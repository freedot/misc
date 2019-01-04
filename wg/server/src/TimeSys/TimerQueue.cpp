/*
 * TimerQueue.cpp
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#include "TimerQueue.h"
#include <IGameSys.h>
#include <log.h>

TimerQueue::TimerQueue() :
		m_time(NULL) {
	INIT_TQINTERFACE()
	m_precisionMs = ETCX_MAX_PRECISION;
	m_timerNodeAlloc.Init(ETCX_ALLOC_NODE_COUNT, 0, false, true);
	m_timerQueue.resize(ETCX_TIMER_NODE_COUNT);
}

TimerQueue::~TimerQueue() {
}

bool TimerQueue::OnOneTimeInit() {
	if (m_lpGameSys == NULL) {
		return false;
	}

	m_time = static_cast<ITime*>(m_lpGameSys->GetUserData("ITime"));
	if (m_time == NULL) {
		return false;
	}

	ILogSys* logSys = static_cast<ILogSys*>(m_lpGameSys->GetUserData("ILogSys"));
	if (logSys == NULL) {
		return false;
	}
	LOG_INIT(logSys);

	uint32 fmtCurTimeMs = FormatTimeByPrecision(m_time->GetCurrentTimeMs());
	int32 curQueueIndex = GetQueueIdxByTime(fmtCurTimeMs);
	m_timerQueue.initTraversePos(curQueueIndex);

	return true;
}

void TimerQueue::OnUpdate(uint32 curTimeMs) {
	uint32 fmtCurTimeMs = FormatTimeByPrecision(curTimeMs);
	uint32 curQueuePos = GetQueueIdxByTime(fmtCurTimeMs);
	int32 count = m_timerQueue.getFromLastTraversePosDistance(curQueuePos);
	for (int32 i = 0; i < count; ++i) {
		TqLstTimer& timerList = m_timerQueue[m_timerQueue.getNextTraversePos()];
		TraverseTimerNodesList(timerList, fmtCurTimeMs, curTimeMs);
		m_timerQueue.moveTraversePos();
	}
}

TQHANDLE TimerQueue::SetTimer(uint32 eventId, void* userData, uint32 elapseMs,
		ITimerListener* timerListener) {
	if (elapseMs == 0) {
		timerListener->OnTimer(NULL, eventId, userData,
				m_time->GetCurrentTimeMs());
		return NULL;
	}

	elapseMs = FormatTimeByPrecision(elapseMs);
	if (elapseMs < m_precisionMs) {
		elapseMs = m_precisionMs;
	}

	uint32 curTimeMs = m_time->GetCurrentTimeMs();
	curTimeMs = FormatTimeByPrecision(curTimeMs);

	TqLstTimer* timerList = GetLstTimer(curTimeMs, elapseMs);
	STimerNode* newNode = m_timerNodeAlloc.Alloc();
	newNode->clear();
	newNode->eventId = eventId;
	newNode->userData = userData;
	newNode->setTimeMs = curTimeMs;
	newNode->elapseMs = elapseMs;
	newNode->timerListener = timerListener;
	newNode->timerList = timerList;
	newNode->uid = GetTimerUID();

	return reinterpret_cast<TQHANDLE>(timerList->PushBack(newNode));
}

bool TimerQueue::KillTimer(TQHANDLE hTimer) {
	if (hTimer == NULL) {
		return true;
	}

	TqLstTimerIter* timerIter = static_cast<TqLstTimerIter*>(hTimer);
	STimerNode* node = timerIter->Value();
	TqLstTimer* timerList = node->timerList;
	node->clear();
	m_timerNodeAlloc.Free(node);

	timerList->Erase(timerIter);

	return true;
}

void* TimerQueue::GetUserData(TQHANDLE hTimer) {
	if (hTimer == NULL) {
		return NULL;
	}

	TqLstTimerIter* iter = static_cast<TqLstTimerIter*>(hTimer);
	STimerNode* node = iter->Value();
	return node->userData;
}

struct TimerUserData {
	/// connect server id
	int32 connid;
	/// 产生该事件的玩家对象id
	object_id playerid;
	/// 参数
	int64 param1;
	/// 参数
	int64 param2;
};

void TimerQueue::Print() {
}

inline TimerQueue::TqLstTimer* TimerQueue::GetLstTimer(uint32 curTimeMs,
		uint32 elapseMs) {
	uint32 fireIndex = GetQueueIdxByTime(curTimeMs + elapseMs);
	return &m_timerQueue[fireIndex];
}

inline uint32 TimerQueue::GetQueueIdxByTime(uint32 timeMs) {
	uint32 modTimeMs = timeMs % (m_timerQueue.size() * m_precisionMs);
	return modTimeMs / m_precisionMs;
}

inline uint32 TimerQueue::FormatTimeByPrecision(uint32 timeMs) {
	return (timeMs / m_precisionMs) * m_precisionMs;
}

inline
uint64 TimerQueue::GetTimerUID() {
	return (((uint64) rand()) << 32) | ((uint64) rand());
}

inline
void TimerQueue::TraverseTimerNodesList(TqLstTimer& timerList,
		uint32 fmtCurTimeMs, uint32 curTimeMs) {
	TqLstTimerIter* iter = timerList.Begin();
	TqLstTimerIter* nextIter = NULL;
	while (iter != timerList.End()) {
		nextIter = iter->Next();
		STimerNode* node = iter->Value();
		uint32 factElapseMs = fmtCurTimeMs + m_precisionMs - node->setTimeMs;
		if (factElapseMs >= node->elapseMs) {
			uint64 lastUid = node->uid;
			if ( node->timerListener == 0 ) {
				assert(false);
			}
			node->timerListener->OnTimer((TQHANDLE) iter, node->eventId,
					node->userData, curTimeMs);
			ReattachTimerNodeToPos(lastUid, node, timerList, iter,
					fmtCurTimeMs);
		}
		iter = nextIter;
	}
}

inline
void TimerQueue::ReattachTimerNodeToPos(uint64 lastUid, STimerNode* node,
		TqLstTimer& timerList, TqLstTimerIter* iter, uint32 fmtCurTimeMs) {
	if (node->uid != lastUid) {
		return;
	}

	timerList.Pick(iter);
	TqLstTimer* nextTimerList = GetLstTimer(fmtCurTimeMs, node->elapseMs);
	node->setTimeMs = fmtCurTimeMs;
	node->timerList = nextTimerList;
	nextTimerList->AttachBack(iter);
}
