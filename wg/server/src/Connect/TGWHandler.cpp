/*
 * TGWHandler.cpp
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#include "TGWHandler.h"
#include "User.h"

TGWHandler::TGWHandler() {
}

TGWHandler::~TGWHandler() {
}

USER_STATE TGWHandler::GetShakeState() {
	return USER_STATE_TGW_HEAD;
}

char* TGWHandler::ShakeHandle(char* recvBuf, int& recvLen){
	return SkipTGWHead(recvBuf, recvLen);
}

char* TGWHandler::SkipTGWHead(char* recvBuf, int& recvLen) {
	CombineBuf* combuf = m_user->GetCombineBuf();
	int state = 0;
	recvBuf = (char*) combuf->CombineTGWHeadTag(recvBuf, recvLen, state);
	if (recvBuf == NULL || state == RET_FAILED)
		return NULL;

	if (state != RET_OK)
		return recvBuf;

	m_user->SetState(USER_STATE_LOGINING);
	combuf->Clear();

	return recvBuf;
}
