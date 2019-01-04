/*
 * WebSocketHandler.h
 *
 *  Created on: 2014-8-6
 *      Author: qujianbiao
 */

#ifndef WEBSOCKETHANDLER_H_
#define WEBSOCKETHANDLER_H_
#include "ConnectHandler.h"

static const char C_WS_V1 = 1;
static const char C_WS_V2 = 2;

class WebSocketHandler: public ConnectHandler {
public:
	WebSocketHandler();
	virtual ~WebSocketHandler();

private:
	virtual USER_STATE GetShakeState();
	virtual char* ShakeHandle(char* recvBuf, int& recvLen);
	virtual char* CombineInGamePkg(char* recvBuf, int& recvLen);
	virtual bool IsNeedGZip(int slen);
	virtual bool IsNeedEncrypt(const char* msg);
	virtual void StartHandleRectData();

private:
	char* HandleWebSocketShake(char* recvBuf, int& recvLen);
	char * GenerateToken1(char * token, int maxLen, char* key1, char* key2, char* key3);
	uint CollectNumFromStr(char* key);
	uint CollectSpaceCountFromStr(char* key);
	char * GenerateToken2(char * token, int maxLen, char* key);
	void SetVer(char ver);
	char GetVer();

private:
	char m_ver;
	bool m_converted;
};

#endif /* WEBSOCKETHANDLER_H_ */
