/*
 * UpdateSys.h
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#ifndef UPDATESYS_H_
#define UPDATESYS_H_
#include <IUpdateSys.h>

class UpdateSys: public IUpdateSys {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_ONONETIME()

public:
	void AddUpdateListener(IUpdateListener* listener);
	void DelUpdateListener(int idx);
	int GetUpdateListenerCount();
	void OnUpdate(uint32 timeMs);

public:
	UpdateSys();
	virtual ~UpdateSys();

private:
	typedef std::vector<IUpdateListener*> StdVctUpdateListener;
	typedef StdVctUpdateListener::iterator StdVctUpdateListenerIter;

private:
	StdVctUpdateListener m_updateListeners;
};

#endif /* UPDATESYS_H_ */
