#ifndef _SERVERAPP_H_
#define _SERVERAPP_H_
#include <platform.h>
#include <NetIO.h>
#include <Socket.h>
#include <Messager.h>
#include <DllLoader.h>
#include <IGameSys.h>
#include <configer.h>
#include <string>
#include <IUpdateSys.h>
#include <IEventSys.h>
#include <IScriptSys.h>
#include <ITime.h>
#include <ITimerQueue.h>
#include <log.h>
#include <sharemem.h>
#include <DataProcessor.h>
#include <ShareMemKeyMgr.h>

#define GLOBAL_CONFIGURE_PATH  "./globalconfig.xml"

/** 接收messager的缓冲区大小 */
#define MESSAGER_RECV_LEN 0x200000

/*
inline unsigned int ServerApp::timeGetTime()
{
        unsigned int uptime = 0;
        struct timespec on;
        if(clock_gettime(CLOCK_MONOTONIC, &on) == 0)
                 uptime = on.tv_sec*1000 + on.tv_nsec/1000000;
        return uptime;
}
*/

class HostUser {
public:
	const char* GetName() {
		return "host user";
	}
};

/** 服务器应用程序的基类 
 */
class ServerApp {
public:
	/** 显示当前服务器的版本信息
	 */
	virtual void ShowVersion(void);

	/** 开始执行,内部有循环体
	 */
	virtual void Run(void);

public:
	/** 构造函数
	 */
	ServerApp();

	/** 析构函数
	 */
	virtual ~ServerApp();

protected:
	/** 初始化服务
	 */
	virtual bool Init(void);

	/** 装载全局配置文件
	 */
	virtual bool LoadGlobalConfigure();

	/** 状态配置文件
	 */
	virtual bool Configure(void);

	/** 装载资源文件
	 */
	virtual bool LoadResources(void);

public:
	/** 在网络事件来之前会调用该入口 
	 */
	virtual void OnBeforeWaitEvent();

	/** 在网络事件来之后会调用该入口 
	 */
	virtual void OnBeforeRecvEvent();

	/** 当一个客户请求来临会调用该入口
	 @param iSocketFd
	 socket句柄
	 @param stClientAddr
	 客户的地址信息
	 */
	virtual void OnAccept(int iSocketFd, const sockaddr_in& stClientAddr);

	/** 当收到一个客户发送的网络数据会调用该入口
	 @param lpstEvent
	 网络事件节点指针,该事件节点是在OnAccept中被与请求client的socket分配和绑定
	 */
	virtual void OnRecvEvent(const Net::SEvent* lpstEvent);
	
	virtual void OnSendEvent(const Net::SEvent* lpstEvent);

	/** 在收到Messager消息前回调用该接口
	 */
	virtual void OnBeforeRecvMessager();

	/** 在收到Messager消息时回调用该接口
	 */
	virtual void OnRecvMessager();

	/** 接收到一个配置命令
	 */
	virtual int OnCommandCfg(const char* lpszCmd);

	/** 在收到Messager消息后回调用该接口
	 */
	virtual void OnAfterRecv();

	/** 整个应用销毁时会调用该入口
	 */
	virtual void OnDestroy();

public:
	/** 进程唯一性检查，返回当前的进程运行是否为唯一
	 */
	bool CheckUnique();

	/** 将当前进程设置为守护进程
	 */
	bool Daemonize();

	bool IsDaemonized();

	void CloseStdOut();

	/** Pend一个命令行命令
	 @param lpszCmd 将要pend的命令
	 @param lpszServerId 将要pend的目标
	 */
	void PendCommand(const char* cmd, const char* serverName);

	/** 设置全局配置路径
	 */
	void SetGlobalCfgPath(const char* path);

	void StopServer(const char* svrname);

	bool IsExist(const char* svrname);

	void Release();

protected:
	/** 装载公用格式的配置文件
	 @param lpszCfgPath
	 配置文件路径
	 @return
	 返回true或false
	 */
	bool LoadCommConfig(const char* lpszCfgPath);

	/** 装载动态库注册配置
	 @param lpszCfgPath
	 配置文件路径
	 @return
	 返回true或false
	 */
	bool LoadDynRegConfig(const char* lpszCfgPath);

	/** 初始化游戏系统IGameSys对象
	 @return
	 返回true或false
	 */
	bool InitGameSys();

	/** 初始化其他必须的对象 
	 */
	bool InitGameObjects(void);

	/** 初始化监听者 
	 */
	bool InitListeners(void);

	/** 初始化脚本系统模块 
	 */
	bool InitScriptModule(void);

	/** 释放GameSys对象 
	 */
	void ReleaseGameSys();

	/** 装载脚本
	 */
	bool LoadFromScript(void);

private:
	int GetNetIOEventCount();
	void HandleNetIOEvents(int iEventCount);
	void HandleNetIOEvents(Net::SEvent* lpstEvent);
	void HandleLinuxNetIOEvents(Net::SEvent* lpstEvent);
	void HandleRecvMessager();
	void HandleCommandCfg();

protected:
	struct SScriptMoudleObj {
		Script::IScriptModule* lpModule;
		std::string strFlag;
	};
	typedef std::vector<SScriptMoudleObj> StdVctScriptModule;
	typedef StdVctScriptModule::iterator StdVctScriptModuleIter;

	/// 游戏系统对象
	IGameSys* m_lpGameSys;
	/// 更新系统对象
	IUpdateSys* m_lpUpdateSys;
	/// 事件系统对象
	IEventSys* m_lpEventSys;
	/// 时间对象
	ITime* m_lpTime;
	/// 时间队列
	ITimerQueue* m_lpTimerQueue;

	/// 脚本系统对象
	Script::IScriptSys* m_lpScriptSys;

	/// 用于装载游戏系统动态库
	DllLoader m_objGameSysDynLib;
	/// 配置数据
	SConfig m_stConfig;
	/// 脚本模块列表
	StdVctScriptModule m_vctModules;

	/// 工作目录
	std::string m_strWorkDir;
	/// 主机的socket对象
	Net::Socket m_objHostSocket;
	/// NetIO对象
	Net::NetIO* m_objNetIO;
	/// Messager对象
	Net::Messager m_objMessager;
	/// 当前服务器的唯一标识名称
	std::string m_strNameId;
	/// 可以接受的最大网路事件数
	int32 m_iMaxEvents;
	/// 每个循环休眠的时间间隔,单位微秒
	uint32 m_uiSleepUs;
	/// 在等待一个网络时间到来时的超时设置
	uint32 m_uiWaitEventTimeOutMs;
	/// 每个循环中处理messager的最大个数,一般建议为设置1
	int32 m_iMessagerMaxCount;
	/// 主机绑定的端口号
	ushort m_usHostBindPort;
	/// 设置主机的监听队列大小
	int32 m_iListenNumber;
	/// 设置主机的socket发送的缓冲大小
	int32 m_iHostSocketSendMaxLen;
	/// 设置client的socket接收的缓冲大小
	int32 m_iClientSocketRecvMaxLen;
	/// 设置client的socket发送的缓冲大小
	int32 m_iClientSocketSendMaxLen;
	/// 设置接收messager缓冲区的大小
	int32 m_iMessageBufferMaxSize;
	/// 设置最多容许的client连接数
	int32 m_iClientMaxSocketCount;
	/// 设置client的保持激活的时间间隔
	uint32 m_uiClientActiveSec;

	/// 服务器名称
	std::string m_strServerName;
	/// 主版本号
	uint32 m_uiVersionMajor;
	/// 次版本号
	uint32 m_uiVersionMinor;
	/// 构建版本号
	uint32 m_uiVersionBuild;
	/// 构建日期
	std::string m_szBuildDate;
	/// 构建时间
	std::string m_szBuildTime;

	/// 存放收到的messager消息缓冲
	uchar* m_lpszMsgPkg;
	/// 存放收到的messager消息缓冲数据长度
	int m_iMsgLen;
	/// 发送给messager数据的服务id
	uint32 m_ulMessagerFromSvrId;

	/// 命令行配置管道
	IO::Pipe* m_lpCmdCfgPipe;

	std::string m_szGlobleCfgPath;

	/// 进程互斥的共享内存
	SHAREMEM_HANDLE m_mutex;

	HostUser m_hostUser;

	bool m_isRunning;
	bool m_isDaemonized;

	ShareMemKeyMgr m_shareMemKeyMgr;
};

inline ServerApp::ServerApp() {
	m_lpGameSys = NULL;
	m_lpUpdateSys = NULL;
	m_lpEventSys = NULL;
	m_lpTime = NULL;
	m_lpTimerQueue = NULL;
	m_lpScriptSys = NULL;
	m_objNetIO = NULL;
	m_iMaxEvents = 0;
	m_uiSleepUs = 5000;
	m_uiWaitEventTimeOutMs = 0;
	m_iMessagerMaxCount = 0;
	m_usHostBindPort = 0;
	m_iListenNumber = 5;
	m_iHostSocketSendMaxLen = 1024;
	m_iClientSocketRecvMaxLen = 1024;
	m_iClientSocketSendMaxLen = 1024;
	m_iMessageBufferMaxSize = MESSAGER_RECV_LEN;
	m_iClientMaxSocketCount = 1024;
	m_uiClientActiveSec = 0;
	m_uiVersionMajor = 0;
	m_uiVersionMinor = 0;
	m_uiVersionBuild = 0;
	m_lpszMsgPkg = NULL;
	m_iMsgLen = 0;
	m_ulMessagerFromSvrId = 0xffff;
	m_lpCmdCfgPipe = NULL;
	m_szGlobleCfgPath = GLOBAL_CONFIGURE_PATH;
	m_mutex = INVAILED_SHAREMEM_HANDLE;

	m_lpszMsgPkg = new uchar[m_iMessageBufferMaxSize];

	m_isRunning = true;
	m_isDaemonized = false;
	Net::Startup();
}

inline ServerApp::~ServerApp() {
	ReleaseGameSys();
	SafeDeleteArray(m_lpszMsgPkg);
	SafeDelete(m_lpCmdCfgPipe);
	m_objHostSocket.Close();
	DestoryNetIO(&m_objNetIO);
	Net::Cleanup();
}

inline void ServerApp::ShowVersion(void) {
	std::cout << "==================================================="
			<< std::endl;
	std::cout << " Server name: " << m_strServerName << std::endl;
	std::cout << " Version: " << m_uiVersionMajor << "." << m_uiVersionMinor
			<< "." << m_uiVersionBuild << std::endl;
	std::cout << " Last Compiling Date: " << m_szBuildDate << " "
			<< m_szBuildTime << std::endl;
	std::cout << " Copyright: 2013-2014" << std::endl;
	std::cout << "==================================================="
			<< std::endl;
}

inline bool ServerApp::Init(void) {
	// init the rand 
	time_t lTime;
	srand(time(&lTime));

	m_objNetIO = Net::CreateNetIO();

	// load global configure
	if (!LoadGlobalConfigure()) {
		std::cerr << "*Load global configure failed " << std::endl;
		return false;
	}

	// Load the configure file 
	if (!Configure()) {
		std::cerr << "*Load configure failed " << std::endl;
		return false;
	}

	// Load resources file 
	if (!LoadResources()) {
		std::cerr << "*Load resources failed " << std::endl;
		return false;
	}

	// 初始化配置管道
	m_lpCmdCfgPipe = new IO::Pipe;
	const char* cmdCfgKey = m_shareMemKeyMgr.MakeKey(SMEMTYPE_CMD_CFG_HEAD,
			m_strNameId.c_str());
	if (!m_lpCmdCfgPipe->Init(cmdCfgKey, 4096, IO::PIPE_MUTEX_LOCK)) {
		std::cerr << "*Init command config failed!" << std::endl;
		return false;
	}

	// create host socket for client connect
	if (m_usHostBindPort > 0
			&& !m_objHostSocket.CreateSocket(AF_INET, SOCK_STREAM, 0, 0)) {
		std::cerr << "*Create socket SOCK_STREAM for tcp failed!" << std::endl;
		return false;
	}

	// create io net object (epoll for linux, completeio for windows) 
	if (m_iMaxEvents > 0 && !m_objNetIO->Create(m_iMaxEvents)) {
		std::cerr << "*Create netio event failed! max events count: "
				<< m_iMaxEvents << std::endl;
		return false;
	}

	// bind the host socket with one port
	if (m_usHostBindPort > 0 && !m_objHostSocket.Bind(m_usHostBindPort)) {
		std::cerr << "*Bind the socket with " << m_usHostBindPort
				<< " port failed!" << std::endl;
		return false;
	}

	// set the host socket send buffer max size
	if (m_usHostBindPort > 0
			&& !m_objHostSocket.SetSendBufferMaxSize(m_iHostSocketSendMaxLen)) {
		std::cerr << "*Set socket max send buffer size to "
				<< m_iHostSocketSendMaxLen << " failed!" << std::endl;
		return false;
	}

	// set the host socket listen number
	if (m_usHostBindPort > 0) {
		m_objHostSocket.SetListenNumber(m_iListenNumber);
	}

	// add the host socket into net io event queue
	if (m_usHostBindPort > 0) {
		if (!m_objNetIO->AddRecvEvent(m_objHostSocket.GetHandle(), &m_hostUser)) {
			std::cerr << "*Add io event  failed!" << std::endl;
			return false;
		}
	}

	return true;
}

inline void ServerApp::Run(void) {
	if (!Init()) {
		return;
	}

	if (IsDaemonized()) {
		CloseStdOut();
	}

	while (m_isRunning) {
		OnBeforeWaitEvent();
		m_lpUpdateSys->OnUpdate(m_lpTime->GetCurrentTimeMs());
		m_lpEventSys->ProcessPendEvents();
		int iEventCount = GetNetIOEventCount();
		if (iEventCount < 0) {
			m_lpTime->SleepMs(m_uiSleepUs / 1000);
			continue;
		}
		OnBeforeRecvEvent();
		HandleNetIOEvents(iEventCount);
		OnBeforeRecvMessager();
		HandleRecvMessager();
		HandleCommandCfg();
		OnAfterRecv();
		m_lpTime->SleepMs(m_uiSleepUs / 1000);
	}

	OnDestroy();
}

inline bool ServerApp::LoadFromScript() {
	bool bRt = false;
	if (m_lpScriptSys != NULL) {
		for (uint i = 0; i < m_stConfig.stScript.vctPaths.size(); ++i) {
			std::string szPath = m_strWorkDir + m_stConfig.stScript.vctPaths[i];
			m_lpScriptSys->AddSysPath(szPath.c_str());
		}
		bRt = m_lpScriptSys->RunScriptFromFile(m_stConfig.stScript.strRoot.c_str());
	}
	if (!bRt) {
		std::cerr << "load script failed!" << std::endl;
	}
	return bRt;
}

inline bool ServerApp::LoadGlobalConfigure() {
	TiXmlDocument objDoc(m_szGlobleCfgPath.c_str());
	objDoc.LoadFile();

	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load global configure xml file failed: "
				<< m_szGlobleCfgPath << std::endl;
		return false;
	}

	std::string pathKey;
	if (IsWin32()) {
		pathKey = "Win32WorkDirection";
	} else if (IsLinux()) {
		pathKey = "LinuxWorkDirection";
	}

	TiXmlNode* lpNode = objDoc.FirstChild(pathKey.c_str());
	if (lpNode != NULL) {
		TiXmlElement* lpElement = lpNode->ToElement();
		const char* lpszVal = lpElement->Attribute("value");
		if (lpszVal != NULL) {
			m_strWorkDir = lpszVal;
		}
	}

	return true;
}

inline bool ServerApp::LoadCommConfig(const char* lpszCfgPath) {
	assert(lpszCfgPath != NULL);
	if (lpszCfgPath == NULL) {
		return false;
	}

	TiXmlNode* lpNode = NULL;
	TiXmlElement* lpElement = NULL;
	int iVal = 0;

	std::string szPath = m_strWorkDir + lpszCfgPath;
	TiXmlDocument objDoc(szPath.c_str());
	objDoc.LoadFile();
	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load configure xml file " << szPath << " failed!"
				<< std::endl;
		return false;
	}

	// 读取日志输出目录
	lpNode = objDoc.FirstChild("Log");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		const char* lpszVal = lpElement->Attribute("value");
		if (lpszVal != NULL) {
			m_stConfig.strLogFile = m_strWorkDir + lpszVal;
		}
	}

	// 读取当前服务器的唯一标识名称
	lpNode = objDoc.FirstChild("ServerName");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		const char* lpszVal = lpElement->Attribute("value");
		if (lpszVal != NULL) {
			m_strNameId = lpszVal;
		}
	}

	// 读取等待IOEvent的最大个数
	lpNode = objDoc.FirstChild("IOEventMaxCount");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iMaxEvents = iVal;
	}

	// 读取每次循环等待的时间间隔，单位微秒
	lpNode = objDoc.FirstChild("SleepUs");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_uiSleepUs = iVal;
	}

	// 读取等待IOEvent的超时，单位是毫秒
	lpNode = objDoc.FirstChild("WaitIOEventTimeOutMs");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_uiWaitEventTimeOutMs = iVal;
	}

	// 读取在单轮循环中可处理messager中包个数最大值
	lpNode = objDoc.FirstChild("MessagerMaxCount");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iMessagerMaxCount = iVal;
	}

	// 读取主socket的绑定端口
	lpNode = objDoc.FirstChild("HostBindPort");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_usHostBindPort = iVal;
	}

	// 读取主socket的监听缓冲个数
	lpNode = objDoc.FirstChild("ListenNumber");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iListenNumber = iVal;
	}

	// 读取主socket的发送缓冲区最大长度
	lpNode = objDoc.FirstChild("HostSocketSendMaxLen");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iHostSocketSendMaxLen = iVal;
	}

	// 读取客户端socket的接收缓冲区最大长度
	lpNode = objDoc.FirstChild("ClientSocketRecvMaxLen");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iClientSocketRecvMaxLen = iVal;
	}

	// 读取户端socket的发送缓冲区最大长度
	lpNode = objDoc.FirstChild("ClientSocketSendMaxLen");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iClientSocketSendMaxLen = iVal;
	}

	// 读取接收messager的缓冲区最大长度
	lpNode = objDoc.FirstChild("MessageBufferMaxSize");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		if (iVal > MESSAGER_RECV_LEN) {
			SafeDeleteArray(m_lpszMsgPkg);
			m_iMessageBufferMaxSize = iVal;
			m_lpszMsgPkg = new uchar[m_iMessageBufferMaxSize];
		}
	}

	// 读取容许连接的最大客户端数
	lpNode = objDoc.FirstChild("ClientMaxSocketCount");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_iClientMaxSocketCount = iVal;
	}

	// 读取client的保持激活的时间间隔,单位秒
	lpNode = objDoc.FirstChild("ClientActiveSec");
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &iVal);
		m_uiClientActiveSec = iVal;
	}

	return true;
}

inline bool ServerApp::LoadDynRegConfig(const char* lpszCfgPath) {
	assert(lpszCfgPath != NULL);
	if (lpszCfgPath == NULL) {
		return false;
	}

	std::string szPath = m_strWorkDir + lpszCfgPath;
	if (!m_stConfig.LoadSysConfig(szPath.c_str())) {
		return false;
	}

	return true;
}

inline bool ServerApp::Configure(void) {
	return true;
}

inline bool ServerApp::LoadResources(void) {
	return true;
}

inline void ServerApp::OnBeforeWaitEvent() {
}

inline void ServerApp::OnBeforeRecvEvent() {
}

inline void ServerApp::OnAccept(int iSocketFd,
		const sockaddr_in& stClientAddr) {
}

inline void ServerApp::OnRecvEvent(const Net::SEvent* lpstEvent) {
}

inline void ServerApp::OnSendEvent(const Net::SEvent* lpstEvent) {
}

inline void ServerApp::OnBeforeRecvMessager() {
}

inline void ServerApp::OnRecvMessager() {
}

inline int ServerApp::OnCommandCfg(const char* cmd) {
	if (strcmp(cmd, "exit") == 0) {
		m_isRunning = false;
		return 1;
	}
	return 0;
}

inline void ServerApp::OnAfterRecv() {
}

inline void ServerApp::OnDestroy() {
}

inline bool ServerApp::CheckUnique() {
	return false;
}

inline bool ServerApp::Daemonize() {
#if defined(LINUX)
	pid_t pid = fork();
	if (pid > 0) {
		exit(0);
	} else if (pid < 0) {
		std::cerr << "Daemonize failed 1" << std::endl;
		exit(1);
		return false;
	}

	setsid();
	pid = fork();
	if (pid > 0) {
		exit(0);
	} else if (pid < 0) {
		std::cerr << "Daemonize failed 2" << std::endl;
		exit(1);
		return false;
	}

	umask(0);
	m_isDaemonized = true;
#endif// LINUX
	return true;
}

inline bool ServerApp::IsDaemonized() {
	return m_isDaemonized;
}

inline void ServerApp::CloseStdOut() {
#if defined(LINUX)
	close(0);
	close(1);
	close(2);
#endif// LINUX
}

inline void ServerApp::PendCommand(const char* cmd, const char* serverName) {
	if (cmd != NULL && serverName != NULL) {
		IO::Pipe* cmdCfgPipe = new IO::Pipe;
		const char* cmdCfgKey = m_shareMemKeyMgr.MakeKey(SMEMTYPE_CMD_CFG_HEAD, serverName);
		if (cmdCfgPipe->Init(cmdCfgKey, 4096, IO::PIPE_MUTEX_LOCK)) {
			cmdCfgPipe->Push(strlen(cmd) + 1, cmd);
		}
		SafeDelete(cmdCfgPipe);
	}
}

inline bool ServerApp::InitGameSys() {
	std::string szGameSysDllName = "./libGameSys";
	szGameSysDllName += DYNLIB_EXT;
	if (!m_objGameSysDynLib.Load(szGameSysDllName.c_str())) {
		assert(false);
		return false;
	}

	CREATEINTERFACE pfnCreate = (CREATEINTERFACE) m_objGameSysDynLib.GetSymbol(
			"CreateInterface");
	assert(pfnCreate != NULL);
	if (pfnCreate == NULL) {
		return false;
	}
	m_lpGameSys = reinterpret_cast<IGameSys*>(pfnCreate(IUID_IGAMESYS));

	// register from config
	if (m_lpGameSys != NULL) {
		// 注册和创建配置中的所有接口对象
		std::vector<IInterface*> vctObjs;
		StdMapRegIter iter = m_stConfig.mapRegs.begin();
		for (; iter != m_stConfig.mapRegs.end(); ++iter) {
			SRegInterface& stReg = (*iter).second;
			if (!m_lpGameSys->RegisterInterface(stReg.IGUID,
					stReg.strPath.c_str())) {
				std::cerr << "*RegisterInterface " << stReg.strPath
						<< " failed! " << std::endl;
				assert(false);
				return false;
			}

			if (stReg.strRegName != "") {
				IInterface* lpObj = m_lpGameSys->CreateInterface(stReg.IGUID);
				vctObjs.push_back(lpObj);
				if (lpObj == NULL) {
					std::cerr << stReg.strRegName << ": *CreateInterface "
							<< " failed! " << std::endl;
					assert(false);
					return false;
				} else {
					std::cout << "CreateInterface [" << stReg.strRegName
							<< "] ok! " << std::endl;
				}

				if (!m_lpGameSys->RegisterUserData(stReg.strRegName.c_str(),
						lpObj)) {
					std::cerr << "*RegisterUserData " << stReg.strRegName
							<< " failed! " << std::endl;
					assert(false);
					return false;
				}
			}
		}

		// 调用所有接口对象的初始化入口
		std::vector<IInterface*>::iterator vctIter = vctObjs.begin();
		for (; vctIter != vctObjs.end(); ++vctIter) {
			(*vctIter)->OnOneTimeInit();
		}
	}
	return (m_lpGameSys != NULL);
}

inline bool ServerApp::InitGameObjects(void) {
	if (m_lpGameSys == NULL) {
		return false;
	}

	// 初始化日志系统
	ILogSys* lpLogSys = static_cast<ILogSys*>(m_lpGameSys->GetUserData(
			"ILogSys"));
	if (lpLogSys == NULL) {
		return false;
	}
	
	std::string comLog = m_stConfig.strLogFile + "_COM";
	lpLogSys->AddLog("COM", comLog.c_str(), 1, 50, 0x200000);
	
	std::string deal32WanLog = m_stConfig.strLogFile +"_DEAL_32WAN";
	lpLogSys->AddLog("DEAL_32WAN", deal32WanLog.c_str(), 1, 50, 0x200000);

	std::string onlinesLog = m_stConfig.strLogFile +"_ONLINES";
	lpLogSys->AddLog("ONLINES", onlinesLog.c_str(), 1, 50, 0x200000);

	std::string osLog = m_stConfig.strLogFile +"_OS";
	lpLogSys->AddLog("OS", osLog.c_str(), 1, 50, 0x200000);

	std::string acuLog = m_stConfig.strLogFile +"_ACU";
	lpLogSys->AddLog("ACU", acuLog.c_str(), 1, 50, 0x200000);

	std::string sugLog = m_stConfig.strLogFile +"_SUG";
	lpLogSys->AddLog("SUG", sugLog.c_str(), 1, 50, 0x200000);

	LOG_INIT(lpLogSys);
	LOG("COM",
	"----------------------- server log start -------------------------");

	m_lpUpdateSys = static_cast<IUpdateSys*>(m_lpGameSys->GetUserData(
			"IUpdateSys"));
	if (m_lpUpdateSys == NULL) {
		return false;
	}

	m_lpEventSys =
			static_cast<IEventSys*>(m_lpGameSys->GetUserData("IEventSys"));
	if (m_lpEventSys == NULL) {
		return false;
	}

	m_lpTime = static_cast<ITime*>(m_lpGameSys->GetUserData("ITime"));
	if (m_lpTime == NULL) {
		return false;
	}

	m_lpTimerQueue = static_cast<ITimerQueue*>(m_lpGameSys->GetUserData(
			"ITimerQueue"));
	if (m_lpTimerQueue == NULL) {
		return false;
	}

	if (!m_lpEventSys->Init(1024, 128)) {
		return false;
	}

	m_lpScriptSys = static_cast<Script::IScriptSys*>(m_lpGameSys->GetUserData(
			"IScriptSys"));
	if (m_lpScriptSys == NULL) {
		return false;
	}

	// 初始化监听者
	if (!InitListeners()) {
		return false;
	}

	// 初始化脚本系统模块
	if (!InitScriptModule()) {
		return false;
	}

	return true;
}

inline bool ServerApp::InitListeners(void) {
	if (m_lpGameSys == NULL) {
		return false;
	}

	// 添加事件监听对象
	std::vector<std::string>::iterator iter =
			m_stConfig.stLoadDyn.vctEventListeners.begin();
	for (; iter != m_stConfig.stLoadDyn.vctEventListeners.end(); ++iter) {
		IInterface* lpInterface =
				reinterpret_cast<IInterface*>(m_lpGameSys->GetUserData(
						(*iter).c_str()));
		IEventListener* lpListener = static_cast<IEventListener*>(lpInterface);
		if (m_lpEventSys != NULL && lpListener != NULL) {
			m_lpEventSys->AddEventListener(lpListener);
			;
		}
	}

	// 添加更新监听对象
	iter = m_stConfig.stLoadDyn.vctUpdateListeners.begin();
	for (; iter != m_stConfig.stLoadDyn.vctUpdateListeners.end(); ++iter) {
		IInterface* lpInterface =
				reinterpret_cast<IInterface*>(m_lpGameSys->GetUserData(
						(*iter).c_str()));
		IUpdateListener* lpListener = static_cast<IUpdateListener*>(lpInterface);
		if (m_lpUpdateSys != NULL && lpListener != NULL) {
			m_lpUpdateSys->AddUpdateListener(lpListener);
		}
	}

	return true;
}

inline int ServerApp::GetNetIOEventCount() {
	int iEventTotal = 0;
	if (m_iMaxEvents > 0) {
		iEventTotal = m_objNetIO->WaitEvent(m_uiWaitEventTimeOutMs);
	}
	if (iEventTotal < 0) {
		std::clog << "net io wait event failed!" << std::endl;
	}
	return iEventTotal;
}

inline void ServerApp::HandleNetIOEvents(int iEventCount) {
	for (int i = 0; i < iEventCount; ++i) {
		Net::SEvent* lpstEvent = m_objNetIO->GetEvent(i);
		HandleNetIOEvents(lpstEvent);
	}
}

inline void ServerApp::HandleRecvMessager() {
	for (int i = 0; i < m_iMessagerMaxCount; ++i) {
		m_iMsgLen = m_iMessageBufferMaxSize;
		int iRt = m_objMessager.Recv(m_ulMessagerFromSvrId, m_lpszMsgPkg,
				m_iMsgLen);
		if (iRt > 0) {
			m_iMsgLen = iRt;
			OnRecvMessager();
		} else {
			break;
		}
	}
}

inline void ServerApp::HandleCommandCfg() {
	if (m_lpCmdCfgPipe == NULL)
		return;
	char szCmdMsg[4096];
	int iCmdMsgLen = sizeof(szCmdMsg);
	if (m_lpCmdCfgPipe->Pop(iCmdMsgLen, szCmdMsg) == IO::TQ_IO_OK) {
		OnCommandCfg(szCmdMsg);
	}
}

inline void ServerApp::HandleNetIOEvents(Net::SEvent* lpstEvent) {
	if (lpstEvent->userPtr == &m_hostUser) {
		// accept the client connect
		sockaddr_in stClientAddr;
		int iAddrLen = sizeof(stClientAddr);
		int iSocketFd = m_objHostSocket.Accept((sockaddr *) &stClientAddr,
				&iAddrLen);
		if (iSocketFd < 0) {
			std::clog << "Accept one client connect failed!" << std::endl;
			return;
		}
		OnAccept(iSocketFd, stClientAddr);
	} else if ( lpstEvent->isRecvEvent()  ) {
		OnRecvEvent(lpstEvent);
	} else if ( lpstEvent->isWriteEvent() ) {
		OnSendEvent(lpstEvent);
	} else {
		std::clog << "unkown event !" << std::endl;
	}
}

inline bool ServerApp::InitScriptModule() {
	if (m_lpGameSys == NULL || m_lpScriptSys == NULL) {
		assert(false);
		return false;
	}

	StdMapRegScriptModuleIter iter =
			m_stConfig.stLoadDyn.mapScriptModules.begin();
	for (; iter != m_stConfig.stLoadDyn.mapScriptModules.end(); ++iter) {
		TQGUID& stId = (TQGUID&) ((*iter).first);
		SScriptModuleNode& stNode = (*iter).second;
		std::clog << "start load script module !" << std::endl;
		Script::IScriptModule* lpModule = NULL;
		if (stNode.strFlag == "GET") {
			lpModule =
					static_cast<Script::IScriptModule*>(m_lpGameSys->GetUserData(
							stNode.strName.c_str()));
		} else {
			lpModule =
					static_cast<Script::IScriptModule*>(m_lpGameSys->CreateInterface(
							stId));
		}

		std::clog << "start reg script module !" << std::endl;
		assert(lpModule!=NULL);
		if (lpModule != NULL) {
			std::clog << "init module !" << std::endl;
			if (stNode.strFlag != "GET") {
				lpModule->SetGameSys(m_lpGameSys);
				if (!lpModule->OnOneTimeInit()) {
					assert(false);
					return false;
				}
			}

			std::clog << "add module !" << std::endl;
			bool bRt = m_lpScriptSys->AddScriptModule(lpModule);
			std::clog << "add module ok!" << std::endl;
			assert(bRt);
			if (!bRt) {
				return false;
			}

			std::clog << "save module !" << std::endl;
			SScriptMoudleObj stMoudle;
			stMoudle.strFlag = stNode.strFlag;
			stMoudle.lpModule = lpModule;
			m_vctModules.push_back(stMoudle);
		}
	}
	return true;
}

inline void ServerApp::SetGlobalCfgPath(const char* path) {
	m_szGlobleCfgPath = path;
}

inline void ServerApp::StopServer(const char* svrname) {
	if (svrname != NULL && strcmp(svrname, "") != 0) {
		PendCommand("exit", svrname);
		std::cout << "send stop server command!" << std::endl;
	}
}

inline void ServerApp::ReleaseGameSys(void) {
	if (m_lpGameSys != NULL) {
		// 调用所有接口的OnOneTimeRelease入口
		StdMapRegIter iter = m_stConfig.mapRegs.begin();
		for (; iter != m_stConfig.mapRegs.end(); ++iter) {
			SRegInterface& stReg = (*iter).second;
			if (stReg.strRegName != "") {
				IInterface* lpInterface =
						reinterpret_cast<IInterface*>(m_lpGameSys->GetUserData(
								stReg.strRegName.c_str()));
				if (lpInterface != NULL) {
					lpInterface->OnOneTimeRelease();
				}
			}
		}

		// 调用所有的脚本模块对象的OnOneTimeRelease入口
		StdVctScriptModuleIter iterSM = m_vctModules.begin();
		for (; iterSM != m_vctModules.end(); ++iterSM) {
			Script::IScriptModule* lpModule = (*iterSM).lpModule;
			if ((*iterSM).strFlag != "GET") {
				lpModule->OnOneTimeRelease();
			}
		}

		// 释放所有接口
		for (iter = m_stConfig.mapRegs.begin();
				iter != m_stConfig.mapRegs.end(); ++iter) {
			SRegInterface& stReg = (*iter).second;
			if (stReg.strRegName != "") {
				IInterface* lpInterface =
						reinterpret_cast<IInterface*>(m_lpGameSys->GetUserData(
								stReg.strRegName.c_str()));
				if (lpInterface != NULL) {
					m_lpGameSys->DestroyInterface(&lpInterface);
				}
			}
		}

		// 释放所有的脚本模块对象
		iterSM = m_vctModules.begin();
		for (; iterSM != m_vctModules.end(); ++iterSM) {
			Script::IScriptModule* lpModule = (*iterSM).lpModule;
			if ((*iterSM).strFlag != "GET") {
				m_lpGameSys->DestroyInterface((IInterface**) &lpModule);
			}

		}

		// 释放游戏系统对象
		DESTROYINTERFACE pfnDestory =
				(DESTROYINTERFACE) m_objGameSysDynLib.GetSymbol(
						"DestroyInterface");
		assert(pfnDestory != NULL);
		if (pfnDestory != NULL) {
			pfnDestory(reinterpret_cast<IInterface**>(&m_lpGameSys));
		}
	}
}

inline bool ServerApp::IsExist(const char* svrname) {
	const char* mutexKey = m_shareMemKeyMgr.MakeKey(SMEMTYPE_MUTEX_GAME, svrname);
	bool existFlag = false;
	m_mutex = CreateShareMem(mutexKey, 1, existFlag);
	if (m_mutex == INVAILED_SHAREMEM_HANDLE) {
		std::cerr << "IsExist: create mutex share mem failed" << std::endl;
		return true;
	}

	if (existFlag) {
		std::cerr << "IsExist: server :" << svrname << " exist!" << std::endl;
		m_mutex = INVAILED_SHAREMEM_HANDLE;
		return true;
	}
	
	return false;
}

inline void ServerApp::Release() {
	if (m_mutex != INVAILED_SHAREMEM_HANDLE) {
		ReleaseShareMem(m_mutex);
		m_mutex = INVAILED_SHAREMEM_HANDLE;
	}
}

#endif // _SERVERAPP_H_
