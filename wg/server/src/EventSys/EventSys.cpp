/*
 * EventSys.cpp
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#include "EventSys.h"
#include "EventHandler.h"
DECLARE_DLLMAIN()

const int C_MAX_PENDEVENTDATA_LEN = 4096;

IInterface* CreateInterface(const TQGUID& guid) {
	IInterface* interFace = NULL;
	if (guid == IUID_IEVENTSYS) {
		interFace = new EventSys;
	} else if (guid == IUID_IEVENTHANDLER) {
		interFace = new EventHandler;
	}

	if (interFace != NULL) {
		interFace->SetIUID(guid);
	}

	return interFace;

}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;

	if ((*interFace)->GetIUID() == IUID_IEVENTSYS) {
		EventSys* eventSys = (EventSys*) (*interFace);
		delete eventSys;
	} else if ((*interFace)->GetIUID() == IUID_IEVENTHANDLER) {
		EventHandler* eventHdr = (EventHandler*) (*interFace);
		delete eventHdr;
	}

	(*interFace) = NULL;
}

EventSys::EventSys() {
	INIT_TQINTERFACE()
	m_handlePendMaxTimes = 1;
	m_pendEvents = NULL;
}

EventSys::~EventSys() {
	SafeDelete(m_pendEvents);
}

bool EventSys::Init(uint32 count, uint32 handlePendMaxTimes) {
	m_handlePendMaxTimes = handlePendMaxTimes;
	m_pendEvents = new RingBuffer(count * GetEventDataMaxSize());
	return true;
}

int EventSys::ProcessPendEvents() {
	int ret = 0;
	byte buf[C_MAX_PENDEVENTDATA_LEN];
	for (uint32 times = 0; times < m_handlePendMaxTimes; ++times) {
		if (m_pendEvents->IsEmpty())
			break;

		if (m_pendEvents->Pop(buf, sizeof(buf)) < 0)
			return -1;

		SEvent* event = reinterpret_cast<SEvent*>(buf);
		SBaseEvent* baseEvent = reinterpret_cast<SBaseEvent*>(buf
				+ sizeof(SEvent));
		event->eventData = baseEvent;
		ret = SendEvent(*event);
	}
	return ret;
}

int EventSys::SendEvent(SEvent& event) {
	int iRet = 0;
	StdVctEvtListenerRIter riter = m_evtListeners.rbegin();
	for (; riter != m_evtListeners.rend(); ++riter) {
		(*riter)->OnEvent(event);
		if (event.IsSkiped()) {
			break;
		}
	}
	return iRet;
}

void EventSys::PendEvent(SEvent& event) {
	SBaseEvent* baseEvent = event.eventData;
	if (baseEvent == NULL)
		return;

	byte buf[C_MAX_PENDEVENTDATA_LEN];
	int size = baseEvent->GetSize();
	int sendSize = sizeof(event) + size;
	if (sendSize > C_MAX_PENDEVENTDATA_LEN)
		return;

	memcpy(buf, &event, sizeof(event));
	memcpy(buf + sizeof(event), baseEvent, size);
	while (m_pendEvents->Push(buf, sendSize) == RingBuffer::RET_ISFULL) {
		ProcessPendEvents();
	}
}

void EventSys::AddEventListener(IEventListener* listener) {
	assert(listener!=NULL);
	if (listener != NULL) {
		m_evtListeners.push_back(listener);
	}
}

void EventSys::DelEventListener(int idx) {
	if (idx >= 0 && idx < (int) m_evtListeners.size()) {
		m_evtListeners.erase(m_evtListeners.begin() + idx);
	}
}

int EventSys::GetEventListenerCount() {
	return m_evtListeners.size();
}
