#ifndef _EVENT_CAST_H_
#define _EVENT_CAST_H_

#include <commhead.h>
#include <baseevent.h>
#include "../GameSvr/IScriptPub.h"

//tolua_begin
class EventCast {
public:
	EventCast() {
	}
	;
	virtual ~EventCast() {
	}
	;

public:
	ScriptEvent* Cast_ScriptEvent(SBaseEvent* lpBaseEvent) {
		return static_cast<ScriptEvent*>(lpBaseEvent);
	}

	TimerEvent* Cast_TimerEvent(SBaseEvent* lpBaseEvent) {
		return static_cast<TimerEvent*>(lpBaseEvent);
	}
};
//tolua_end

#endif // _EVENT_CAST_H_
