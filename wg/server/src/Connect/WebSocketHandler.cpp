/*
 * WebSocketHandler.cpp
 *
 *  Created on: 2014-8-6
 *      Author: qujianbiao
 */

#include "WebSocketHandler.h"
#include "User.h"
#include "./encode/Base64.h"
#include "./encode/SHA1.h"

static const char* C_RESPONSE_V1 = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
		"Upgrade: WebSocket\r\n"
		"Connection: Upgrade\r\n"
		"Sec-WebSocket-Origin: %s\r\n"
		"Sec-WebSocket-Location: %s\r\n\r\n";

static const char* C_RESPONSE_V2 = "HTTP/1.1 101 Switching Protocols\r\n"
		"Upgrade: WebSocket\r\n"
		"Connection: Upgrade\r\n"
		"Sec-WebSocket-Accept: %s\r\n\r\n";

static const char* C_WS_V1_KEY = "Sec-WebSocket-Key1";
static const char* C_WS_V2_KEY = "Sec-WebSocket-Key2";
static const char* C_WS_V_KEY = "Sec-WebSocket-Key";

char* GetHttpHeadKeyVal(char* rawStr, const char* key, char* val, int maxLen) {
	char * str = strstr(rawStr, key);
	if (str == NULL) {
		return NULL;
	}

	str = str + strlen(key);

	// skip : or space or \t
	char c = *str;
	while (c == ':' || c == ' ' || c == '\t') {
		c = *(++str);
	}

	for (int i = 0; i < maxLen - 1; ++i) {
		char c = *(str++);
		if (c == '\r')
			break;
		*(val + i) = c;
	}

	return val;
}

uint ToBigEndian(uint val) {
	if (IsLittleEndian()) {
		return (((val & 0xff000000) >> 24) | ((val & 0x00ff0000) >> 8) | ((val & 0x0000ff00) << 8)
				| ((val & 0x000000ff) << 24));
	} else {
		return val;
	}
}

WebSocketHandler::WebSocketHandler() :
		m_ver(0),m_converted(false) {
}

WebSocketHandler::~WebSocketHandler() {
}

USER_STATE WebSocketHandler::GetShakeState() {
	return USER_STATE_WEBSOCKET_HEAD;
}

char* WebSocketHandler::ShakeHandle(char* recvBuf, int& recvLen) {
	return HandleWebSocketShake(recvBuf, recvLen);
}

char* WebSocketHandler::HandleWebSocketShake(char* recvBuf, int& recvLen) {
	int state = 0;
	CombineBuf* combuf = m_user->GetCombineBuf();
	recvBuf = (char*) combuf->CombineWSHeadTag(recvBuf, recvLen, state);
	if (recvBuf == NULL || state == RET_FAILED)
		return NULL;

	if (state != RET_OK)
		return recvBuf;

	bool hasKey1 = (strstr(combuf->GetBuf(), C_WS_V1_KEY) != NULL);
	bool hasKey2 = (strstr(combuf->GetBuf(), C_WS_V2_KEY) != NULL);
	bool hasKey = (strstr(combuf->GetBuf(), C_WS_V_KEY) != NULL);
	char retbuf[1024] = { 0 };

	if (hasKey1 && hasKey2) {
		if ( recvLen != 8 ) return NULL;

		char keyVal1[512] = { 0 };
		char keyVal2[512] = { 0 };
		char keyVal3[9] = { 0 };
		GetHttpHeadKeyVal(combuf->GetBuf(), C_WS_V1_KEY, keyVal1, sizeof(keyVal1));
		GetHttpHeadKeyVal(combuf->GetBuf(), C_WS_V2_KEY, keyVal2, sizeof(keyVal2));
		memcpy(keyVal3, recvBuf, 8);
		recvBuf += 8;
		recvLen -= 8;

		uchar token[16] = { 0 };
		GenerateToken1((char*)token, sizeof(token), keyVal1, keyVal2, keyVal3);

		char originVal[512] = { 0 };
		GetHttpHeadKeyVal(combuf->GetBuf(), "Origin", originVal, sizeof(originVal));

		char hostVal[512] = { 0 };
		GetHttpHeadKeyVal(combuf->GetBuf(), "Host", hostVal, sizeof(hostVal));
		char locationVal[1024] = { 0 };
		sprintf(locationVal, "ws://%s/", hostVal);

		char handshake[1024] = { 0 };
		sprintf(handshake, C_RESPONSE_V1, originVal, locationVal);

		m_user->SendRawMsg((const char*) handshake, strlen((const char*) handshake));
		m_user->SendRawMsg((const char*) token, sizeof(token));

		SetVer(C_WS_V1);
		m_user->SetWSVer(C_WS_V1);
	} else if (hasKey) {
		char keyVal[512] = { 0 };
		GetHttpHeadKeyVal(combuf->GetBuf(), C_WS_V_KEY, keyVal, sizeof(keyVal));

		char token[64] = { 0 };
		GenerateToken2(token, sizeof(token), keyVal);

		sprintf(retbuf, C_RESPONSE_V2, token);

		m_user->SendRawMsg((const char*) retbuf, strlen((const char*) retbuf));

		SetVer(C_WS_V2);
		m_user->SetWSVer(C_WS_V2);
	} else {
		return NULL;
	}

	m_user->SendWSVersion();
	m_user->SetState(USER_STATE_LOGINING);
	combuf->Clear();

	return recvBuf;
}

char * WebSocketHandler::GenerateToken1(char * token, int maxLen, char* key1, char* key2, char* key3) {
	int num1 = CollectNumFromStr(key1);
	uint spaces1 = CollectSpaceCountFromStr(key1);
	uint num2 = CollectNumFromStr(key2);
	uint spaces2 = CollectSpaceCountFromStr(key2);
	uchar buf[16] = { 0 };
	ulong a1 = ToBigEndian(num1 / spaces1);
	ulong a2 = ToBigEndian(num2 / spaces2);
	memcpy(buf, &a1, sizeof(a1));
	memcpy(buf+4, &a2, sizeof(a2));
	memcpy(buf+8, key3, 8);
	Net::DataProcessor::Md5HashBuf((uchar*) token, (const uchar *) buf, sizeof(buf));
	return token;
}

uint WebSocketHandler::CollectNumFromStr(char* key) {
	char num[256] = { 0 };
	for (int i = 0, pos = 0; i < (int) strlen(key) && pos < (int) (sizeof(num) - 1); ++i) {
		char c = key[i];
		if (c < '0' || c > '9')
			continue;
		num[pos++] = c;
	}
	return (uint) atoi(num);
}

uint WebSocketHandler::CollectSpaceCountFromStr(char* key) {
	uint count = 0;
	for (int i = 0; i < (int) strlen(key); ++i) {
		if (key[i] == ' ')
			count++;
	}
	return count;
}

char * WebSocketHandler::GenerateToken2(char * token, int maxLen, char* key) {
	char buf[1024];
	char ser_key[20];
	sprintf(buf, "%s258EAFA5-E914-47DA-95CA-C5AB0DC85B11", key);

	CSHA1 newCSHA1;
	newCSHA1.Update((const uchar*) buf, strlen(buf));
	newCSHA1.Final();
	newCSHA1.GetHash((uchar*) ser_key);

	Base64::Encode(ser_key, sizeof(ser_key), token, maxLen);
	return token;
}

void WebSocketHandler::SetVer(char ver) {
	m_ver = ver;
}

char WebSocketHandler::GetVer() {
	return m_ver;
}

char* WebSocketHandler::CombineInGamePkg(char* recvBuf, int& recvLen) {
	CombineBuf* combuf = m_user->GetCombineBuf();
	if (GetVer() == C_WS_V1) {
		recvBuf = combuf->SkipWSSplitCharV1(recvBuf, recvLen);

		if ( !m_converted ){
			combuf->ConvertStringToBinary(recvBuf, recvLen);
			m_converted = true;
		}

		if (recvLen == 0) {
			return recvBuf;
		}
		return (char*) combuf->CombineInGamePkg(recvBuf, recvLen);
	} else if (GetVer() == C_WS_V2) {
		recvBuf = combuf->SkipWSSplitCharV2(recvBuf, recvLen);
		return recvBuf;
	} else {
		return NULL;
	}
}

bool WebSocketHandler::IsNeedGZip(int slen) {
	return false;
}

bool WebSocketHandler::IsNeedEncrypt(const char* msg) {
	return true;
}

void WebSocketHandler::StartHandleRectData(){
	m_converted = false;
}

