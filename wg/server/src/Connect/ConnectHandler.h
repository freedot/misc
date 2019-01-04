/*
 * ConnectHandler.h
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#ifndef CONNECTHANDLER_H_
#define CONNECTHANDLER_H_
#include <commhead.h>
#include <Messager.h>
#include <DataProcessor.h>

enum CONNECT_HANDLER {
	HANDLER_FLASH = 1, HANDLER_TGW = 2, HANDLER_WS = 3,
};

enum USER_STATE {
	USER_STATE_INIT = 0,
	USER_STATE_FLASH_HEAD = 1,
	USER_STATE_TGW_HEAD = 2,
	USER_STATE_WEBSOCKET_HEAD = 3,
	USER_STATE_LOGINING = 4,
	USER_STATE_GAMEIN = 5,
	USER_STATE_WILLCLOSE = 6,
};

class User;

class IReconnectCallback{
public:
	virtual bool Reconnected(User* curUser, object_id existUserid, const char* cltKey) = 0;
	virtual ~IReconnectCallback() {
	}
};

class IConnectHandler {
public:
	virtual char* Handle(char* recvBuf, int& recvLen) = 0;
	virtual void SetUser(User* user) = 0;
	virtual void SetMessager(Net::Messager* messager) = 0;
	virtual void SetGameSvrId(int svrId) = 0;
	virtual void SetHostPort(ushort port) = 0;
	virtual void SetReconnectCallback(IReconnectCallback* callback) = 0;
	virtual void StartHandleRectData() = 0;
	virtual ~IConnectHandler() {
	}
};

class ConnectHandler: public IConnectHandler {
public:
	virtual char* Handle(char* recvBuf, int& recvLen);
	virtual void SetUser(User* user);
	virtual void SetMessager(Net::Messager* messager);
	virtual void SetGameSvrId(int svrId);
	virtual void SetHostPort(ushort port);
	virtual void SetReconnectCallback(IReconnectCallback* callback);
	virtual void StartHandleRectData();

public:
	bool DecryptPkg(char* msg, int msglen);
	bool EncryptPkg(const char* msg, char* outmsg, uint32& outmsglen);

public:
	ConnectHandler();
	virtual ~ConnectHandler();

protected:
	virtual USER_STATE GetShakeState();
	virtual char* ShakeHandle(char* recvBuf, int& recvLen);
	virtual char* CombineInGamePkg(char* recvBuf, int& recvLen);
	virtual bool IsCompleteOnePkg();
	virtual bool IsNeedGZip(int slen);
	virtual bool IsNeedEncrypt(const char* msg);

private:
	char* HandleInGameState(char* recvBuf, int& recvLen);
	bool HandlePackage();
	void SendMsgToGameSvr(object_id id, const char* data, int datalen);
	bool IsReconnectMsg(const char* msg);
	bool Reconnect(const char* msg);

protected:
	User* m_user;
	Net::Messager* m_messager;
	int m_gameSvrId;
	ushort m_hostPort;
	IReconnectCallback* m_reconnectCallback;
};

#endif /* CONNECTHANDLER_H_ */
