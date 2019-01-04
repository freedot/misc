/*
 * Time.cpp
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#include "TimeSys.h"
#include "TimerQueue.h"
#include "TimerQueueEx.h"
#include <log.h>
DECLARE_DLLMAIN()

IInterface* CreateInterface(const TQGUID& guid) {
	IInterface* interFace = NULL;
	if (guid == IUID_ITIME) {
		interFace = new Time;
	} else if (guid == IUID_ITIMERQUEUE) {
		interFace = new TimerQueue;
	} else if (guid == IUID_ITIMERQUEUE_EX) {
		interFace = new TimerQueueEx;
	}

	if (interFace != NULL) {
		interFace->SetIUID(guid);
	}

	return interFace;
}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;

	if ((*interFace)->GetIUID() == IUID_ITIME) {
		Time* time = (Time*) (*interFace);
		delete time;
	} else if ((*interFace)->GetIUID() == IUID_ITIMERQUEUE) {
		TimerQueue* timerQueue = (TimerQueue*) (*interFace);
		delete timerQueue;
	} else if ((*interFace)->GetIUID() == IUID_ITIMERQUEUE_EX) {
		if ( g_onTimerBegin ) {
			LOG("com", "*error: release IUID_ITIMERQUEUE_EX");
			(*interFace) = NULL;
			(*interFace)->GetIUID(); // crash it
		}
		TimerQueueEx* timerQueueEx = (TimerQueueEx*) (*interFace);
		delete timerQueueEx;
	}

	(*interFace) = NULL;
}

Time::Time() :
		m_dispersionMs(0), m_scale(1.0f) {
	INIT_TQINTERFACE()
}

Time::~Time() {
}

void Time::SetDispersionMs(uint32 dispersionMs) {
	m_dispersionMs = dispersionMs;
}

void Time::SetScale(double scale) {
	m_scale = scale;
}

void Time::SleepMs(uint32 timeMs) {
	tq_sleep(timeMs);
}

uint32 Time::GetCurrentTimeMs() {
	uint32 timeVal = GetTickCount();
	timeVal += m_dispersionMs;
	return (uint32) (m_scale * timeVal);
}

uint64 Time::GetCurrentTimeMsEx() {
	uint64 timeVal = GetTickCountEx();
	timeVal += m_dispersionMs;
	return (uint64) (m_scale * timeVal);
}

uint32 Time::GetCurrentTimeSec() {
	return GetCurrentTimeMs()/1000;
}
