/*
 * TimerQueueEx.cpp
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#include "TimerQueueEx.h"
#include <IGameSys.h>
#include <log.h>

bool g_onTimerBegin = false;

TimerQueueEx::TimerQueueEx() :
		m_precisionMs(0), m_queueSize(0), m_time(0), m_stopTimerFlag(false) {
	INIT_TQINTERFACE()
}

TimerQueueEx::~TimerQueueEx() {
}

bool TimerQueueEx::OnOneTimeInit() {
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

	return true;
}

bool TimerQueueEx::Init(uint32 queueSize, uint32 precisionMs) {
	m_timerNodeAllocator.Init(8192, 0, false, true);
	m_precisionMs = precisionMs;
	m_queueSize = queueSize;
	m_timerQueue.resize(m_queueSize);

	uint32 fmtCurTimeMs = FormatTimeByPrecision(m_time->GetCurrentTimeMs());
	int32 curQueueIndex = GetQueueIdxByTime(fmtCurTimeMs);
	m_timerQueue.initTraversePos(curQueueIndex);

	return true;
}

void TimerQueueEx::OnUpdate(uint32 curTimeMs) {
	uint32 fmtCurTimeMs = FormatTimeByPrecision(curTimeMs);
	uint32 curQueuePos = GetQueueIdxByTime(fmtCurTimeMs);
	int32 count = m_timerQueue.getFromLastTraversePosDistance(curQueuePos);
	for (int32 i = 0; i < count; ++i) {
		TqLstTimer& timerList = m_timerQueue[m_timerQueue.getNextTraversePos()];
		TraverseTimerNodesList(timerList, curTimeMs);
		m_timerQueue.moveTraversePos();
	}
}

TIMER_IDS* TimerQueueEx::GetConstIds() {
	static TIMER_IDS s_ids;
	return &s_ids;
}

TIMER_PARAMS* TimerQueueEx::GetConstParams() {
	static TIMER_PARAMS s_params;
	return &s_params;
}

void TimerQueueEx::Start(int keyIdCnt, const TIMER_IDS* ids, uint32 elapseMs,
		const TIMER_PARAMS* params, ITimerListenerEx* timerListener) {
	if (elapseMs == 0) {
		timerListener->OnTimer(ids, params, m_time->GetCurrentTimeMs());
		ReplaceLastTimerByIds(keyIdCnt, ids, NULL, NULL);
		return;
	}

	elapseMs = FormatTimeByPrecision(elapseMs);
	if (elapseMs < m_precisionMs) {
		elapseMs = m_precisionMs;
	}

	uint32 curTimeMs = FormatTimeByPrecision(m_time->GetCurrentTimeMs());
	STimerNode* newNode = m_timerNodeAllocator.Alloc();
	newNode->clear();
	newNode->keyIdCnt = keyIdCnt;
	newNode->ids = *ids;
	newNode->params = *params;
	newNode->setTimeMs = curTimeMs;
	newNode->elapseMs = elapseMs;
	newNode->timerListener = timerListener;

	TqLstTimer* timerList = GetLstTimer(curTimeMs, elapseMs);
	TqLstTimerIter* iter = timerList->PushBack(newNode);

	ReplaceLastTimerByIds(keyIdCnt, ids, timerList, iter);
}

void TimerQueueEx::Stop() {
	m_stopTimerFlag = true;
}

inline TimerQueueEx::TqLstTimer* TimerQueueEx::GetLstTimer(uint32 curTimeMs,
		uint32 elapseMs) {
	uint32 fireIndex = GetQueueIdxByTime(curTimeMs + elapseMs);
	return &m_timerQueue[fireIndex];
}

inline uint32 TimerQueueEx::FormatTimeByPrecision(uint32 timeMs) {
	return (timeMs / m_precisionMs) * m_precisionMs;
}

inline uint32 TimerQueueEx::GetQueueIdxByTime(uint32 timeMs) {
	uint32 modTimeMs = timeMs % (m_timerQueue.size() * m_precisionMs);
	return modTimeMs / m_precisionMs;
}

inline
void TimerQueueEx::TraverseTimerNodesList(TqLstTimer& timerList,
		uint32 curTimeMs) {
	TqLstTimerIter* iter = timerList.Begin();
	TqLstTimerIter* nextIter = NULL;
	while (iter != timerList.End()) {
		nextIter = iter->Next();
		HandleTimerNode(timerList, iter, curTimeMs);
		iter = nextIter;
	}
}

inline
void TimerQueueEx::HandleTimerNode(TqLstTimer& timerList, TqLstTimerIter* iter,
		uint32 curTimeMs) {

	STimerNode* node = iter->Value();
	uint32 fmtCurTimeMs = FormatTimeByPrecision(curTimeMs);
	uint32 factElapseMs = fmtCurTimeMs + m_precisionMs - node->setTimeMs;
	if (factElapseMs < node->elapseMs)
		return;
	
	if ( this == NULL ) {
		LOG("com", "*error1: TimerQueueEx be destory!");
	}
	
	m_stopTimerFlag = false;
	if (node->timerListener == NULL) {
		LOG("com", "*error: node->timeListener is NULL, timerList=%x, iter=%x, node=%x, node->keyIdCnt=%d, node->setTimeMs=%d, node->elapseMs=%d, iter->Prev=%x, iter->Next=%x",
		&timerList, iter, node, node->keyIdCnt, node->setTimeMs, node->elapseMs, iter->Prev(), iter->Next()
		);
	}
g_onTimerBegin = true;
	node->timerListener->OnTimer(&node->ids, &node->params, curTimeMs);
g_onTimerBegin = false;
	if ( this == NULL ) {
		LOG("com", "*error2: TimerQueueEx be destory!");
	}

	if (m_stopTimerFlag) {
		TIMER_IDS keyIds(node->ids, node->keyIdCnt);
		RemoveLastTimerNode(node->keyIdCnt, keyIds);
		RemoveTimerNode(&timerList, iter);
	} else {
		ReattachTimerNodeToPos(timerList, iter, fmtCurTimeMs);
	}
}

inline
void TimerQueueEx::ReplaceLastTimerByIds(int keyIdCnt, const TIMER_IDS* ids,
		TqLstTimer* timerList, TqLstTimerIter* iter) {
	TIMER_IDS keyIds(*ids, keyIdCnt);
	SLastTimerNode* node = GetLastTimerNode(keyIdCnt, keyIds);
	if (node != NULL) {
		RemoveTimerNode(node->timerList, node->iter);
		RemoveLastTimerNode(keyIdCnt, keyIds);
	}

	AddLastTimerNode(keyIdCnt, keyIds, timerList, iter);
}

inline TimerQueueEx::SLastTimerNode*
TimerQueueEx::GetLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds) {
	if (keyIdCnt == 0)
		return NULL;
	MapLastTimerIter mapIter = m_lastStartTimers.find(keyIds);
	if (mapIter == m_lastStartTimers.end())
		return NULL;

	return &((*mapIter).second);
}

inline
void TimerQueueEx::RemoveLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds) {
	if (keyIdCnt == 0)
		return;
	MapLastTimerIter mapIter = m_lastStartTimers.find(keyIds);
	if (mapIter == m_lastStartTimers.end())
		return;

	m_lastStartTimers.erase(mapIter);
}

inline
void TimerQueueEx::RemoveTimerNode(TqLstTimer* timerList,
		TqLstTimerIter* iter) {
	STimerNode* node = iter->Value();
	node->clear();
	m_timerNodeAllocator.Free(node);
	timerList->Erase(iter);
}

inline
void TimerQueueEx::AddLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds,
		TqLstTimer* timerList, TqLstTimerIter* iter) {
	if (keyIdCnt == 0 || timerList == NULL || iter == NULL)
		return;

	SLastTimerNode newNode;
	newNode.iter = iter;
	newNode.timerList = timerList;
	m_lastStartTimers[keyIds] = newNode;
}

inline
void TimerQueueEx::ReattachTimerNodeToPos(TqLstTimer& timerList,
		TqLstTimerIter* iter, uint32 fmtCurTimeMs) {
	STimerNode* node = iter->Value();
	TqLstTimer* nextTimerList = GetLstTimer(fmtCurTimeMs, node->elapseMs);
	timerList.Pick(iter);
	nextTimerList->AttachBack(iter);
	node->setTimeMs = fmtCurTimeMs;
}
