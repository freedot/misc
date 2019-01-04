/*
 * FlashHandler.cpp
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#include "FlashHandler.h"
#include "User.h"

static const char* S_CROSSDOMAIN = "<cross-domain-policy>"
		"<allow-access-from domain=\"*\" to-ports=\"%d\" />"
		"</cross-domain-policy>";

FlashHandler::FlashHandler() {
}

FlashHandler::~FlashHandler() {
}

USER_STATE FlashHandler::GetShakeState() {
	return USER_STATE_FLASH_HEAD;
}

char* FlashHandler::ShakeHandle(char* recvBuf, int& recvLen) {
	return HandleInCheckCrossState(recvBuf, recvLen);
}

char* FlashHandler::HandleInCheckCrossState(char* recvBuf, int& recvLen) {
	CombineBuf* combuf = m_user->GetCombineBuf();
	recvBuf = (char*) combuf->CombineCrossPkg(recvBuf, recvLen);
	int ret = combuf->GetCrossRequestState();
	if (recvBuf == NULL || ret == RET_FAILED)
		return NULL;

	if (ret != RET_OK)
		return recvBuf;

	ResponseClientCrossOk();
	m_user->SetState(USER_STATE_LOGINING);
	combuf->Clear();
	return recvBuf;
}

void FlashHandler::ResponseClientCrossOk() {
	char msg[1024];
	SafeSprintf(msg, sizeof(msg), S_CROSSDOMAIN, m_hostPort);
	m_user->SendRawMsg(msg, strlen(msg) + 1); // 必须加一，否则flash会报错
}

