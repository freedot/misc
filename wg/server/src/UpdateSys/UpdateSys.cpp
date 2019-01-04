/*
 * UpdateSys.cpp
 *
 *  Created on: 2013-3-6
 *      Author: qujianbiao
 */

#include "UpdateSys.h"
DECLARE_DLLMAIN()

IInterface* CreateInterface(const TQGUID& guid) {
	if (guid != IUID_IUPDATESYS)
		return NULL;

	IInterface*interFace = new UpdateSys;
	interFace->SetIUID(guid);
	return interFace;
}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;

	if ((*interFace)->GetIUID() != IUID_IUPDATESYS)
		return;

	UpdateSys* lpUpdSys = (UpdateSys*) (*interFace);
	delete lpUpdSys;
	(*interFace) = NULL;
}

UpdateSys::UpdateSys() {
	INIT_TQINTERFACE()
}

UpdateSys::~UpdateSys() {
	m_updateListeners.clear();
}

void UpdateSys::AddUpdateListener(IUpdateListener* listener) {
	assert(listener!=NULL);
	if (listener != NULL) {
		m_updateListeners.push_back(listener);
	}
}

void UpdateSys::DelUpdateListener(int idx) {
	if (idx >= 0 && idx < (int) m_updateListeners.size()) {
		m_updateListeners.erase(m_updateListeners.begin() + idx);
	}
}

int UpdateSys::GetUpdateListenerCount() {
	return m_updateListeners.size();
}

void UpdateSys::OnUpdate(uint32 timeMs) {
	StdVctUpdateListenerIter iter = m_updateListeners.begin();
	for (; iter != m_updateListeners.end(); ++iter) {
		(*iter)->OnUpdate(timeMs);
	}
}
