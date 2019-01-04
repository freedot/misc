#ifndef _DBGSERVER_H__
#define _DBGSERVER_H__
#include <singleton.h>
#include <list>
#include <string>
#include <Socket.h>

const int c_recvbuffer_size = 0xffff;
const int c_sendbuffer_size = 8190;
const int c_serverPort = 7788;

extern THREADRET THREADAPI TcpRecvThread(void* lpParam);

class DbgServer : public Singleton<DbgServer>
{
	DECLARE_SINGLETON(DbgServer);
	friend THREADRET THREADAPI TcpRecvThread(void* lpParam);
public:
	void Start();
	void Stop();
	void CloseClient();
	void CloseServer();
	bool IsRecvMsgEmpty();
	const char* RecvMsgTop();
	void PopRecvMsg();
	void PushSendMsg(const char* lpszMsg);

public:
	virtual ~DbgServer();

private:
	DbgServer();
	
private:
	bool m_bQuiting;
	std::list<std::string> m_queSendMsg;
	std::list<std::string> m_queRecvMsg;
	Net::Socket m_objHostSocket;
	Net::Socket m_objCltSocket;
	char* m_lpRecvBuf;
	int m_iRecvLen;
	int m_iPackageLen;
};

#endif // _DBGSERVER_H__
