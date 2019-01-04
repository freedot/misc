#ifndef _USER_H_
#define _USER_H_

#include <commhead.h>
#include <Socket.h>
#include <object.h>
#include "TGWHandler.h"
#include "FlashHandler.h"
#include "WebSocketHandler.h"
#include "CombineBuf.h"

static const int USE_KEY_LEN = 16;
static const int CLT_KEY_LEN = 16+1;

class User: public BaseObject {
public:
	User();
	virtual ~User();

public:
	CombineBuf* GetCombineBuf();
	const uchar* GetUserKey();
	void SetUserKey(uchar* key);
	const char* GetCltKey();
	int GetState();
	void SetState(int state);
	int32 GetIp();
	void SetIp(int32 ip);
	void SetActiveTime(int32 time);
	bool IsActive(int32 curtime);
	bool IsLoginTimeout(int32 curtime);
	bool IsCrossTimeout(int32 curtime);
	bool IsInGameTimeout(int32 curtime);
	bool IsWillCloseTimeout(int32 curtime);
	void SendWSVersion();
	bool SendMsg(const char* msg);
	void SendRawMsg(const char* msg, int msglen);
	int GetSocket();
	void SetSocket(int socket);
	void CloseSocket();
	void SetWillReconnUser(object_id id);
	bool IsTmp();
	void SetTmp();
	object_id GetWillReconnUser();
	void SetWSVer(uchar ver);
	uchar GetWSVer();

	//----------------------------------
	IConnectHandler* GetHandler();
	void SetHandler(CONNECT_HANDLER hdrType);
	bool IsWillClose();
	bool IsInGame();
	void SendUserIdAndCltKeyToClient();
	void SendReconnectedOkToClient();

private:
	void CreateRandCltKey();
	bool SendCommMsg(const char* msg);
	bool SendWSMsgV1(const char* msg);
	bool SendWSMsgV2(const char* msg);

private:
	int m_iodata;
	int m_socket;
	int32 m_ip;
	int m_state;
	int32 m_activetime;
	object_id m_reconnUserid;
	CombineBuf m_combuf;
	uchar m_userkey[USE_KEY_LEN];
	char m_cltKey[CLT_KEY_LEN];
	bool m_isTmp;
	FlashHandler m_flashHander;
	TGWHandler m_tgwHander;
	WebSocketHandler m_wsHandler;
	IConnectHandler* m_handler;
	uchar m_wsVer;
};

#endif //_USER_H_
