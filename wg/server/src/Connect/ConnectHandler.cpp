/*
 * ConnectHandler.cpp
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#include "ConnectHandler.h"
#include "./zlib/zlib.h"
#include "User.h"
#include <messagerCmd.h>
#include "Defines.h"

#define USE_GZIP_FLAG_ true
#define USE_GZIP_LEN_ 256


class LuaTableParser {
public:
	static uint32 GetValue(const char* s, const char* key) {
		char* start = GetValueStart(s, key);
		if (start == NULL)
			return 0;
		return SafeAsciToULong(start);
	}

	static uint64 GetLongLongValue(const char* s, const char* key) {
		char* start = GetValueStart(s, key);
		if (start == NULL)
			return 0;
		return SafeAsciToUInt64(start);
	}

	static int GetString(const char* s, const char* key, char* out,
			int outbuflen) {
		char* start = GetValueStart(s, key);
		if (start == NULL)
			return -1;

		start++; // skip " or '
		char* end = strstr(start, "\"");
		if (end == NULL)
			end = strstr(start, "\'");
		if (end == NULL)
			return -1;

		int len = (int) (end - start);
		if (len >= outbuflen)
			return -2;

		memcpy(out, start, len);
		out[len] = '\0';

		return 0;
	}
private:
	static char* GetValueStart(const char* s, const char* key) {
		if (s == NULL)
			return NULL;

		char* start = (char*)strstr(s, key);
		if (start == NULL)
			return NULL;

		start += strlen(key); // skip key
		start++; // skip =
		return start;
	}
};

ConnectHandler::ConnectHandler() :
		m_user(NULL), m_messager(NULL), m_gameSvrId(0), m_hostPort(0), m_reconnectCallback(
				NULL) {
}

ConnectHandler::~ConnectHandler() {
}

char* ConnectHandler::Handle(char* recvBuf, int& recvLen) {
	if (m_user->GetState() == GetShakeState()) {
		return ShakeHandle(recvBuf, recvLen);
	} else if (m_user->GetState() == USER_STATE_LOGINING) {
		m_user->SetState(USER_STATE_GAMEIN);
		return recvBuf;
	} else if (m_user->GetState() == USER_STATE_GAMEIN) {
		return HandleInGameState(recvBuf, recvLen);
	} else {
		std::cout << "Handle : error, user state: " << m_user->GetState()
				<< std::endl;
	}
	return NULL;
}

void ConnectHandler::SetUser(User* user) {
	m_user = user;
}

void ConnectHandler::SetMessager(Net::Messager* messager) {
	m_messager = messager;

}

void ConnectHandler::SetGameSvrId(int svrId) {
	m_gameSvrId = svrId;
}

void ConnectHandler::SetHostPort(ushort port) {
	m_hostPort = port;
}

void ConnectHandler::SetReconnectCallback(IReconnectCallback* callback) {
	m_reconnectCallback = callback;
}

void ConnectHandler::StartHandleRectData() {
}

char* ConnectHandler::HandleInGameState(char* recvBuf, int& recvLen) {
	recvBuf = CombineInGamePkg(recvBuf, recvLen);
	if (recvBuf == NULL) {
		std::cout << "HandleInGameState:1" << std::endl;
		return NULL;
	} else if (IsCompleteOnePkg() && !HandlePackage()) {
		std::cout << "HandleInGameState:2" << std::endl;
		return NULL;
	}
	return recvBuf;
}

USER_STATE ConnectHandler::GetShakeState() {
	return USER_STATE_INIT;
}

char* ConnectHandler::ShakeHandle(char* recvBuf, int& recvLen) {
	return NULL;
}

char* ConnectHandler::CombineInGamePkg(char* recvBuf, int& recvLen) {
	CombineBuf* combuf = m_user->GetCombineBuf();
	return (char*) combuf->CombineInGamePkg(recvBuf, recvLen);
}

bool ConnectHandler::IsCompleteOnePkg() {
	CombineBuf* combuf = m_user->GetCombineBuf();
	return combuf->IsCompleteOnePkg();
}

bool ConnectHandler::HandlePackage() {
	char msg[65535];
	if (!DecryptPkg(msg, sizeof(msg) - 1)) {
		return false;
	}

	m_user->GetCombineBuf()->Clear();

	if (IsReconnectMsg(msg)) {
		return Reconnect(msg);
	} else if (m_user->IsTmp()) {
		char msg[128] = { 0 };
		SafeSprintf(msg, sizeof(msg), NETCMD_S, NETCMD_FULL_ROLES);
		m_user->SendMsg(msg);
		m_user->SetState(USER_STATE_WILLCLOSE);
		return true;
	} else {
		SendMsgToGameSvr(m_user->getId(), msg, strlen(msg) + 1);
		return true;
	}
}

bool ConnectHandler::IsReconnectMsg(const char* msg) {
	return (int)(LuaTableParser::GetValue(msg, "cmd")) == NETCMD_RECONN;
}

bool ConnectHandler::Reconnect(const char* msg) {
	object_id existUserId = LuaTableParser::GetLongLongValue(msg, "userId");
	char cltKey[CLT_KEY_LEN] = { 0 };
	if (LuaTableParser::GetString(msg, "cltKey", cltKey, sizeof(cltKey)) != 0) {
		return false;
	}
	return m_reconnectCallback->Reconnected(m_user, existUserId, cltKey);
}

void ConnectHandler::SendMsgToGameSvr(object_id id, const char* data,
		int datalen) {
	int32 type = MSG_TRANSFER;
	m_messager->SendHead(m_gameSvrId, sizeof(type) + sizeof(id) + datalen);
	m_messager->SendData(m_gameSvrId, (const void*) &type, sizeof(type));
	m_messager->SendData(m_gameSvrId, (const void*) &id, sizeof(id));
	m_messager->SendData(m_gameSvrId, data, datalen);
}

bool ConnectHandler::DecryptPkg(char* msg, int msglen) {
	CombineBuf* combuf = m_user->GetCombineBuf();
	if (!Net::DataProcessor::Decrypt((const uchar*) combuf->GetBuf(),
			combuf->GetBufLen(), m_user->GetUserKey(), (uchar*) msg, &msglen)) {
		std::clog << "Decrypt the data failed!" << std::endl;
		return false;
	}

	msg[msglen] = '\0';
	return true;
}

bool ConnectHandler::IsNeedGZip(int slen) {
	return slen >= USE_GZIP_LEN_ && USE_GZIP_FLAG_;
}

bool ConnectHandler::IsNeedEncrypt(const char* msg) {
	return true;
}

bool ConnectHandler::EncryptPkg(const char* msg, char* outmsg,
		uint32& outmsglen) {
	const char* src = msg;
	uchar msgzlib[65535];
	int slen = strlen(msg);
	int srcLen = slen;
	int gzip_flag = 0x0000000;
	int encry_flag = 0x0000000;
	if (IsNeedGZip(slen)) {
		ulong zliblen = sizeof(msgzlib);
		if (compress(msgzlib, &zliblen, (const uchar*) msg, slen) != Z_OK) {
			std::cerr << "zip data error!" << std::endl;
			return false;
		}
		src = (const char*) msgzlib;
		srcLen = zliblen;
		gzip_flag = 0x8000000;
	}

	if (!IsNeedEncrypt(msg)) {
		memcpy(outmsg, msg, slen + 1);
		outmsglen = slen;
		outmsglen |= gzip_flag;
		outmsglen |= encry_flag;
		return true;
	}

	encry_flag = 0x2000000;
	if (!Net::DataProcessor::Encrypt(0, (const uchar*) src, srcLen,
			m_user->GetUserKey(), (uchar*) outmsg, (int*) &outmsglen)) {
		return false;
	}

	outmsglen |= gzip_flag;
	outmsglen |= encry_flag;
	return true;
}
