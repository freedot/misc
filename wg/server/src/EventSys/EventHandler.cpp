/*
 * EventHandler.cpp
 *
 *  Created on: 2013-3-7
 *      Author: qujianbiao
 */

#include "EventHandler.h"

FixAlloc<EventHandler::SRegCallBackNode> EventHandler::sm_objRegCallbackNodeAlloc;
FixAlloc<EventHandler::TqLstCallBack> EventHandler::sm_objCallbackListAlloc;
bool EventHandler::sm_bInitAlloc;

EventHandler::EventHandler() {
	INIT_TQINTERFACE()
	m_lpPreviousHandler = NULL;
	m_lpNextHandler = NULL;
	m_bEnable = true;
}

EventHandler::~EventHandler() {
}

bool EventHandler::Init(int iInitNodeCount, EEventHandlerFlag eFlag) {
	if (!sm_bInitAlloc) {
		if (!sm_objRegCallbackNodeAlloc.Init(iInitNodeCount, 0, false, true)) {
			return false;
		}

		if (!sm_objCallbackListAlloc.Init(iInitNodeCount, 0, false, true)) {
			return false;
		}

		sm_bInitAlloc = true;
	}

	return true;
}

TQHANDLE EventHandler::Register(object_id lObjFromId, object_id lObjToId,
		EEventType eventType, const DelegationEvent& objCallback,
		const UserDataObject* lpUserData) {
	TQHANDLE hReg = NULL;
	if (!AdjustFromToId(lObjFromId, lObjToId)) {
		return hReg;
	}

	SRegCallBackNode* lpNewNode = sm_objRegCallbackNodeAlloc.Alloc();
	lpNewNode->lObjFromId = lObjFromId;
	lpNewNode->lObjToId = lObjToId;
	lpNewNode->objCallback = objCallback;
	if (lpUserData != NULL) {
		lpNewNode->userData = *lpUserData;
	}

	TqLstCallBack* lpList = NULL;
	StdMapCallBackIter iter = m_mapCallBacks.find(eventType);
	if (iter != m_mapCallBacks.end()) {
		lpList = (*iter).second;
		lpNewNode->iEventType = eventType;
		lpNewNode->lpList = lpList;
	} else {
		lpNewNode->iEventType = eventType;
		lpNewNode->lpList = sm_objCallbackListAlloc.Alloc();
		m_mapCallBacks[eventType] = lpNewNode->lpList;
		lpList = lpNewNode->lpList;
	}

	hReg = reinterpret_cast<TQHANDLE>(lpList->PushFront(lpNewNode));
	return hReg;
}

void EventHandler::UnRegister(TQHANDLE handle) {
	if (handle == NULL)
		return;

	TqLstCallBackIter* iter = static_cast<TqLstCallBackIter*>(handle);
	if (iter == NULL)
		return;

	SRegCallBackNode* node = iter->Value();
	node->userData.UnRef();
	node->lpList->Erase(iter);
	if (node->lpList->IsEmpty()) {
		StdMapCallBackIter mapIter = m_mapCallBacks.find(node->iEventType);
		m_mapCallBacks.erase(mapIter);
		sm_objCallbackListAlloc.Free(node->lpList);
	}
	sm_objRegCallbackNodeAlloc.Free(node);
}

void EventHandler::ProcessEvent(SEvent& stEvent) {
	SBaseEvent* lpBaseEvent = reinterpret_cast<SBaseEvent*>(stEvent.eventData);
	if (lpBaseEvent == NULL) {
		return;
	}

	StdMapCallBackIter iterMap = m_mapCallBacks.find(lpBaseEvent->eventType);
	if (iterMap == m_mapCallBacks.end())
		return;

	TqLstCallBack* lplstCallBack = (*iterMap).second;
	TqLstCallBackIter* lpIter = lplstCallBack->Begin();
	for (; lpIter != lplstCallBack->End(); lpIter = lpIter->Next()) {
		SRegCallBackNode* lpNode = lpIter->Value();
		if (!InObjectIdRange(lpNode->lObjFromId, lpNode->lObjToId, stEvent.id))
			continue;
		if (lpNode->objCallback.IsNull())
			continue;

		stEvent.userData = lpNode->userData;
		lpNode->objCallback(stEvent);
		if (stEvent.IsSkiped())
			break;
	}

}

bool EventHandler::GetEvtHandlerEnabled() {
	return m_bEnable;
}

const IEventHandler* EventHandler::GetNextHandler() const {
	return m_lpNextHandler;
}

const IEventHandler* EventHandler::GetPreviousHandler() const {
	return m_lpPreviousHandler;
}

void EventHandler::SetEvtHandlerEnabled(bool bEnabled) {
	m_bEnable = bEnabled;
}

void EventHandler::SetNextHandler(const IEventHandler* lpHandler) {
	m_lpNextHandler = const_cast<IEventHandler*>(lpHandler);
}

void EventHandler::SetPreviousHandler(const IEventHandler* lpHandler) {
	m_lpPreviousHandler = const_cast<IEventHandler*>(lpHandler);
}

bool EventHandler::OnOneTimeInit() {
	assert(m_lpGameSys!=NULL);
	if (m_lpGameSys == NULL) {
		return false;
	}
	return true;
}

void EventHandler::OnOneTimeRelease() {
	StdMapCallBackIter mapIter = m_mapCallBacks.begin();
	for (; mapIter != m_mapCallBacks.end(); ++mapIter) {
		TqLstCallBack* lpLstCallBack = (*mapIter).second;
		ReleaseListNodes(lpLstCallBack);
		sm_objCallbackListAlloc.Free(lpLstCallBack);
	}
	m_mapCallBacks.clear();
}

inline
bool EventHandler::InObjectIdRange(object_id lFromId, object_id lToId,
		object_id lCurId) {
	uint32 lCurIdx = GETSIMOBJINDEX(lCurId);
	uint32 lFromIdx = GETSIMOBJINDEX(lFromId);
	uint32 lToIdx = GETSIMOBJINDEX(lToId);
	if (GETSIMOBJTYPE(lCurId) == GETSIMOBJTYPE(lFromId) && lCurIdx >= lFromIdx
			&& lCurIdx <= lToIdx) {
		return true;
	}

	return false;
}

inline
bool EventHandler::AdjustFromToId(object_id& lFromId, object_id& lToId) {
	if (lToId == -1) {
		lToId = lFromId;
	}

	if (GETSIMOBJTYPE(lFromId) != GETSIMOBJTYPE(lToId) ) {
		return false;
	}

	return true;
}

inline
void EventHandler::ReleaseListNodes(TqLstCallBack* lplstCallBack) {
	if (lplstCallBack == NULL)
		return;

	TqLstCallBackIter* lpIter = lplstCallBack->Begin();
	while (lpIter != lplstCallBack->End()) {
		SRegCallBackNode* lpNode = lpIter->Value();
		lpNode->userData.UnRef();
		sm_objRegCallbackNodeAlloc.Free(lpNode);
		lpIter = lpIter->Next();
	}
}
