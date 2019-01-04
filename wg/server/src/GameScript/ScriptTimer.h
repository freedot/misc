#ifndef _SCRIPTTIMER_H_
#define _SCRIPTTIMER_H_
#include <ITimerListener.h>
#include "GameSys.h"
#include "../GameSvr/IScriptPub.h"

class ScriptTimer: public ITimerListener {
public:
	void OnTimer(TQHANDLE hHdr, int32 lIdEvent, void* lpUserData,
			int32 lCurTimeMs) {
		TimerEvent timerEvt;
		TimerUserData* userdate = (TimerUserData*) lpUserData;
		timerEvt.eventType = (EEventType) (2 + EET_NET_EVENT_FIRST);
		int* hdrPtr = (int*)(&hHdr);
		timerEvt.hdr = *(hdrPtr);
		timerEvt.playerid = userdate->playerid;
		timerEvt.connid = userdate->connid;
		timerEvt.param1 = userdate->param1;
		timerEvt.param2 = userdate->param2;
		timerEvt.eventid = lIdEvent;
		timerEvt.curtimeMs = lCurTimeMs;
		SEvent evt(&timerEvt);
		GameSys::Instance()->GetEventSys()->SendEvent(evt);
	}

	virtual ~ScriptTimer() {
	}
};

namespace Script {
class ScriptTimerEx: public ITimerListenerEx {
public:
	void OnTimer(const TIMER_IDS* ids, const TIMER_PARAMS* params,
			uint32 curTimeMs);

	virtual ~ScriptTimerEx() {
	}
};
}
#endif // _SCRIPTTIMER_H_
