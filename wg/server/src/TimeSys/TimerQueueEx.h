/*
 * TimerQueueEx.h
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#ifndef TIMERQUEUEEX_H_
#define TIMERQUEUEEX_H_
#include <ITimerQueue.h>
#include <ptrList.h>
#include <fixAlloc.h>
#include <ITime.h>
#include <map>

extern bool g_onTimerBegin;

class TimerQueueEx: public ITimerQueueEx {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()

public:
	bool OnOneTimeInit();
	void OnOneTimeRelease() {
	}
	void OnUpdate(uint32 curTimeMs);

	bool Init(uint32 queueSize, uint32 precisionMs);
	TIMER_IDS* GetConstIds();
	TIMER_PARAMS* GetConstParams();
	void Start(int keyIdCnt, const TIMER_IDS* ids, uint32 elapseMs,
			const TIMER_PARAMS* params, ITimerListenerEx* timerListener);
	void Stop();

public:
	TimerQueueEx();
	virtual ~TimerQueueEx();

private:
	struct STimerNode;
	typedef PtrList<STimerNode> TqLstTimer;
	typedef TqLstTimer::Iterator TqLstTimerIter;
	struct STimerNode {
		int keyIdCnt;
		TIMER_IDS ids;
		TIMER_PARAMS params;
		uint32 setTimeMs;
		uint32 elapseMs;
		ITimerListenerEx* timerListener;

		void clear() {
			keyIdCnt = 0;
			memset(&ids, 0, sizeof(ids));
			memset(&params, 0, sizeof(params));
			setTimeMs = 0;
			elapseMs = 0;
			timerListener = NULL;
		}
	};

	struct SLastTimerNode {
		TqLstTimer* timerList;
		TqLstTimerIter* iter;
	};

	typedef std::map<TIMER_IDS, SLastTimerNode> MapLastTimer;
	typedef std::map<TIMER_IDS, SLastTimerNode>::iterator MapLastTimerIter;

	class Queue {
	public:
		Queue() :
				m_vector(NULL), m_size(0), m_lastTraversePos(0) {
		}

		virtual ~Queue() {
			SafeDeleteArray(m_vector);
			m_size = 0;
		}

		void resize(uint32 size) {
			SafeDeleteArray(m_vector);
			m_vector = new TqLstTimer[size];
			m_size = size;
		}

		uint32 size() {
			return m_size;
		}

		TqLstTimer& operator [](int idx) {
			return *(m_vector + idx);
		}

		void initTraversePos(uint32 traversePos) {
			m_lastTraversePos = ((int32) traversePos - 1 + m_size) % m_size;
		}

		int32 getFromLastTraversePosDistance(uint32 curPos) {
			int32 distance = (int32) (curPos - m_lastTraversePos);
			if (distance < 0) {
				distance += m_size;
			}
			return distance;
		}

		int32 getNextTraversePos() {
			return (m_lastTraversePos + 1) % m_size;
		}

		void moveTraversePos() {
			m_lastTraversePos = (m_lastTraversePos + 1) % m_size;
		}

	private:
		TqLstTimer* m_vector;
		uint32 m_size;
		uint32 m_lastTraversePos;
	};

private:
	TqLstTimer* GetLstTimer(uint32 curTimeMs, uint32 elapseMs);
	uint32 FormatTimeByPrecision(uint32 timeMs);
	uint32 GetQueueIdxByTime(uint32 timeMs);
	void TraverseTimerNodesList(TqLstTimer& timerList, uint32 curTimeMs);
	void HandleTimerNode(TqLstTimer& timerList, TqLstTimerIter* iter,
			uint32 curTimeMs);
	void ReplaceLastTimerByIds(int keyIdCnt, const TIMER_IDS* ids,
			TqLstTimer* timerList, TqLstTimerIter* iter);
	SLastTimerNode* GetLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds);
	void AddLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds,
			TqLstTimer* timerList, TqLstTimerIter* iter);
	void RemoveLastTimerNode(int keyIdCnt, const TIMER_IDS& keyIds);
	void RemoveTimerNode(TqLstTimer* timerList, TqLstTimerIter* iter);
	void ReattachTimerNodeToPos(TqLstTimer& timerList,
			TqLstTimerIter* iter, uint32 fmtCurTimeMs);

private:
	FixAlloc<STimerNode> m_timerNodeAllocator;
	uint32 m_precisionMs;
	uint32 m_queueSize;
	Queue m_timerQueue;
	ITime* m_time;
	bool m_stopTimerFlag;
	MapLastTimer m_lastStartTimers;
};

#endif /* TIMERQUEUEEX_H_ */
