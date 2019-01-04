/*
 * Time.h
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#ifndef TIME_H_
#define TIME_H_
#include <ITime.h>

class Time: public ITime {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()
	DECLARE_DEFAULT_ONONETIME()

public:
	void SetDispersionMs(uint32 dispersionMs);
	void SetScale(double scale);
	void SleepMs(uint32 timeMs);
	uint32 GetCurrentTimeMs();
	uint64 GetCurrentTimeMsEx();
	uint32 GetCurrentTimeSec();

public:
	Time();
	virtual ~Time();

private:
	uint32 m_dispersionMs;
	double m_scale;
};

#endif /* TIME_H_ */
