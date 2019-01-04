/*
 * EventSys.h
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#ifndef EVENTSYS_H_
#define EVENTSYS_H_
#include <IEventSys.h>
#include <ringbuffer.h>
#include <vector>

class EventSys: public IEventSys {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()
	DECLARE_DEFAULT_ONONETIME()

public:
	bool Init(uint32 count, uint32 handlePendMaxTimes);
	int ProcessPendEvents();
	int SendEvent(SEvent& event);
	void PendEvent(SEvent& event);
	void AddEventListener(IEventListener* listener);
	void DelEventListener(int idx);
	int GetEventListenerCount();

public:
	EventSys();
	virtual ~EventSys();

private:
	typedef std::vector<IEventListener*> StdVctEvtListener;
	typedef StdVctEvtListener::iterator StdVctEvtListenerIter;
	typedef StdVctEvtListener::reverse_iterator StdVctEvtListenerRIter;

private:
	uint32 m_handlePendMaxTimes;
	RingBuffer* m_pendEvents;
	StdVctEvtListener m_evtListeners;
};
#endif /* EVENTSYS_H_ */
