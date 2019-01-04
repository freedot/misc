#ifndef _I_EVENT_LISTENER_H_
#define _I_EVENT_LISTENER_H_
#include "eventdata.h"

/** Interface of an object which can receive events.
 */
class IEventListener {
public:
	/** Called if an event happened.
	 */
	virtual void OnEvent(SEvent& stEvent) = 0;
};

#endif // _I_EVENT_LISTENER_H_
