#ifndef _TQ_CONNECT_H_
#define _TQ_CONNECT_H_
#include <commhead.h>
#include <serverApp.h>
#include <Socket.h>
#include <messagerCmd.h>
#include <ObjContainer.h>
#include "User.h"
#include "GameSvrMessager.h"
#include "./zlib/zlib.h"

#define USE_GZIP_FLAG true
#define USE_GZIP_LEN 256


class Connect: public IReconnectCallback, public ServerApp {
public:
	virtual bool Init();
	virtual bool Configure();
	virtual void OnBeforeWaitEvent();
	virtual void OnAccept(int iSocketFd, const sockaddr_in& stClientAddr);
	virtual void OnRecvEvent(const Net::SEvent* lpstEvent);
	virtual void OnRecvMessager();
	virtual int OnCommandCfg(const char* cmd);
	virtual void OnDestroy();
	virtual bool Reconnected(User* curUser, object_id existUserid, const char* cltKey);

public:
	/** 构造函数 */
	Connect();

	/** 析构函数 */
	virtual ~Connect();

public:
	/** 设置当前的服务器配置目录
	 @param lpszSvrCfgDir 当前服务器的配置文件目录
	 */
	virtual void SetSvrCfgDir(const char* lpszSvrCfgDir);
	virtual void ShowHelpInfo();
	virtual void StartGame(const char* svrname);

protected:
	virtual void HandleAccept(int iSocketFd, const sockaddr_in& stClientAddr);
	virtual void HandleRecvData(const Net::SEvent* lpstEvent);
	virtual bool HandleRecvData(User* user, char* recvBuf, int recvLen);
	virtual bool AddNetIoInEvent(int socket, User* user);
	virtual void DelNetIoEvent(User* user);

private:
	void SetServerVersion();
	void SetWin32CompletionRecvLen();
	void SetSocketObject(Net::Socket &objSocket, int iSocketFd);
	bool InitSimObjContainer();
	User* NewUser(const sockaddr_in& addr, int socket);
	User* NewTmpUser(const sockaddr_in& stClientAddr, int iSocket);
	bool InitMessager();

	void FreeUser(User* lpUser);
	void ExitUser(User* user);

	void UpdateUsers();

	bool IsExitSysCmd(const char* cmd);
	char* AssignHandler(User* user, char* recvBuf, int& recvLen);
	void FreeListUsers(ObjContainer<User>* list);

	void CheckOnlineUserActive();
	void CheckTmpUserActive();
	void CheckUserActive(uint32& curIdx, ObjContainer<User>* container, bool isSendMsg);

protected:
	/// 服务器配置的相对目录
	std::string m_svrCfgDir;
	/// 存放user节点的当前仿真对象容器
	ObjContainer<User> m_userContainer;
	ObjContainer<User> m_tmpUsers;
	/// 当前需检查的user是否处于激活的下标索引号,每一次循环都检查一次
	uint32 m_curCheckUserActiveIndex;
	uint32 m_curCheckTmpUserActiveIndex;
	/// 和当前httpsvr相关联的游戏服务器id
	int m_gameSvrId;
	/// 处理游戏服务器messager
	GameSvrMessager m_gameSvrMessager;
};

#endif // _TQ_CONNECT_H_
