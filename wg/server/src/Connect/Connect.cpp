#include "Connect.h"
#include <DataProcessor.h>
#include <processArgs.h>
#include <safefun.h>
#include "Defines.h"

#define TGW_DATA_HEAD_TAG 't'
#define FLASH_DATA_CROSS_TAG '<'
#define FLASH_DATA_INGAME_TAG 8
#define FLASH_DATA_WS_TAG 'G'


#if defined(WIN32)
struct ExceptionHandler {
	ExceptionHandler() {
		LoadLibraryA("exchndl.dll");
	}
};

static ExceptionHandler g_exceptionHandler;
#endif

Connect::Connect() :
		m_curCheckUserActiveIndex(0), m_curCheckTmpUserActiveIndex(0), m_gameSvrId(
				0) {
	SetServerVersion();
	m_gameSvrMessager.SetObjContainer(&m_userContainer);
	m_gameSvrMessager.SetMessager(&m_objMessager);
}

Connect::~Connect() {
}

void Connect::SetServerVersion() {
	// for version
	m_strServerName = "Connect Server";
	m_uiVersionMajor = 1;
	m_uiVersionMinor = 0;
	m_uiVersionBuild = 1;
#if defined(__TIME__) && defined(__DATE__)
	m_szBuildDate = __DATE__;
	m_szBuildTime = __TIME__;
#endif
}

bool Connect::Init() {
	if (!ServerApp::Init()) {
		return false;
	}

	if (!InitMessager()) {
		return false;
	}

	if (!InitSimObjContainer()) {
		return false;
	}

	if (!InitGameSys()) {
		return false;
	}

	if (!InitGameObjects()) {
		return false;
	}

	std::cerr << "init game ok!!" << std::endl;
	return true;
}

void Connect::OnAccept(int iSocketFd, const sockaddr_in& stClientAddr) {
	ServerApp::OnAccept(iSocketFd, stClientAddr);
	HandleAccept(iSocketFd, stClientAddr);
}

void Connect::OnRecvEvent(const Net::SEvent* lpstEvent) {
	ServerApp::OnRecvEvent(lpstEvent);
	HandleRecvData(lpstEvent);
}

void Connect::OnBeforeWaitEvent() {
	UpdateUsers();
}

void Connect::HandleAccept(int iSocket, const sockaddr_in& stClientAddr) {
	std::clog << "accept socket id : " << iSocket << std::endl;
	Net::Socket objSocket;
	SetSocketObject(objSocket, iSocket);
	User* user = NewUser(stClientAddr, iSocket);
	if (user == NULL) { // full roles
		user = NewTmpUser(stClientAddr, iSocket);
		if (user == NULL) {
			std::clog << "alloc tmp user failed!" << std::endl;
			objSocket.Close();
			return;
		}
	}

	if (!AddNetIoInEvent(iSocket, user)) {
		FreeUser(user);
		return;
	}
}

User* Connect::NewTmpUser(const sockaddr_in& stClientAddr, int iSocket) {
	User* user = m_tmpUsers.allocObject();
	if (user == NULL) {
		return NULL;
	}
	user->SetSocket(iSocket);
	user->SetIp(stClientAddr.sin_addr.s_addr);
	user->SetTmp();
	return user;
}

void Connect::HandleRecvData(const Net::SEvent* evt) {
	User* user = reinterpret_cast<User*>(evt->userPtr);
	user->SetActiveTime(m_lpTime->GetCurrentTimeSec());
	while (true) {
		char recvBuf[1024];
		Net::Socket socket;
		socket.Attach(user->GetSocket());
#if defined(WIN32)
		int recvLen = socket.Recv(recvBuf, sizeof(recvBuf));
#else
		int recvLen = socket.Read(recvBuf, sizeof(recvBuf));
#endif // WIN32
		if (recvLen == 0)
			break;

		if (recvLen < 0 ) {
			if (user->IsInGame()) {// 为了断线重连，这里不直接删除用户，等待超时
				DelNetIoEvent(user);
				user->CloseSocket();
				break;
			}
			goto err;
		}

		if (!HandleRecvData(user, recvBuf, recvLen)) {
			std::cerr << "HandleRecvData faild " << std::endl;
			goto err;
		}

		break;
	}
	return;

	err: m_gameSvrMessager.SendUserExitMsgToGameSvr(user->getId());
	ExitUser(user);
}

bool Connect::HandleRecvData(User* user, char* recvBuf, int recvLen) {
	IConnectHandler* handler = user->GetHandler();
	if (handler) {
		handler->StartHandleRectData();
	}

	if (recvLen > 0 && user->IsWillClose()) {
		return false;
	}

	while (recvLen > 0) {
		IConnectHandler* handler = user->GetHandler();
		if (handler == NULL) {
			recvBuf = AssignHandler(user, recvBuf, recvLen);
			handler = user->GetHandler();
			if (!handler)
				return false;
			handler->SetUser(user);
			handler->SetGameSvrId(m_gameSvrId);
			handler->SetMessager(&m_objMessager);
			handler->SetHostPort(m_usHostBindPort);
			handler->SetReconnectCallback(this);
			handler->StartHandleRectData();
		} else {
			recvBuf = handler->Handle(recvBuf, recvLen);
		}

		if (recvBuf == NULL)
			return false;
	}

	return true;
}

bool Connect::Reconnected(User* curUser, object_id existUserid,
		const char* cltKey) {
	User* existUser = m_userContainer.getById(existUserid);
	if (existUser == NULL) {
		return false;
	}

	if (existUser->GetSocket() != -1) {
		return false;
	}

	if (!existUser->IsInGame()) {
		return false;
	}


	if (strcmp(existUser->GetCltKey(), cltKey) != 0) {
		return false;
	}

	// copy new user ip, socketid to exist user object
	existUser->SetIp(curUser->GetIp());
	existUser->SetSocket(curUser->GetSocket());
	existUser->SetActiveTime(m_lpTime->GetCurrentTimeSec());

	DelNetIoEvent(curUser);
	if (!AddNetIoInEvent(existUser->GetSocket(), existUser)) {
		FreeUser(existUser);
		return false;
	}

	existUser->SendUserIdAndCltKeyToClient();
	existUser->SendReconnectedOkToClient();

	// free new user, use exist user object
	curUser->SetIp(0);
	curUser->SetSocket(-1);
	curUser->SetActiveTime(0);
	curUser->SetState(USER_STATE_WILLCLOSE);

	return true;
}

char* Connect::AssignHandler(User* user, char* recvBuf, int& recvLen) {
	CombineBuf* combuf = user->GetCombineBuf();
	recvBuf = (char*) combuf->CombineHeadTag(recvBuf, recvLen);
	if (recvBuf == NULL)
		return NULL;

	if (combuf->GetTag() == FLASH_DATA_CROSS_TAG) {
		user->SetHandler(HANDLER_FLASH);
		user->SetState(USER_STATE_FLASH_HEAD);
	} else if (combuf->GetTag() == TGW_DATA_HEAD_TAG) {
		user->SetHandler(HANDLER_TGW);
		user->SetState(USER_STATE_TGW_HEAD);
	} else if (combuf->GetTag() == FLASH_DATA_WS_TAG) {
		user->SetHandler(HANDLER_WS);
		user->SetState(USER_STATE_WEBSOCKET_HEAD);
	} else if (combuf->GetTag() == FLASH_DATA_INGAME_TAG) {
		user->SetHandler(HANDLER_FLASH);
		user->SetState(USER_STATE_GAMEIN);
	} else {
		std::cout << "AssignHandler : tag: " << combuf->GetTag() << std::endl;
	}

	return recvBuf;
}

void Connect::DelNetIoEvent(User* user) {
	if (user != NULL && user->GetSocket() != -1) {
		m_objNetIO->DelEvent(user->GetSocket());
	}
}

bool Connect::AddNetIoInEvent(int socket, User* user) {
	if (!m_objNetIO->AddRecvEvent(socket, (void*) user)) {
		std::clog << "Add client node event into io queue failed !"
				<< std::endl;
		return false;
	}
	return true;
}

void Connect::SetSvrCfgDir(const char* lpszSvrCfgDir) {
	m_svrCfgDir = lpszSvrCfgDir;
}

bool Connect::Configure() {
	if (!LoadDynRegConfig("config/connect/sys_config.xml")) {
		return false;
	}

	std::string strFile = "config/connect/" + m_svrCfgDir + "/comm_config.xml";
	if (!LoadCommConfig(strFile.c_str())) {
		return false;
	}

	std::string szMsgCfg = m_strWorkDir + "config/msg_config.xml";
	if (!m_objMessager.LoadConfig(szMsgCfg.c_str())) {
		std::cerr << "load message config failed!" << std::endl;
		return false;
	}
	return true;
}

void Connect::OnRecvMessager() {
	m_gameSvrMessager.OnMsgFromGameSvr((char*) m_lpszMsgPkg);
}

void Connect::SetSocketObject(Net::Socket &objSocket, int iSocketFd) {
	objSocket.Attach(iSocketFd);
	objSocket.SetNonBlocking();
	objSocket.SetRecvBufferMaxSize(m_iClientSocketRecvMaxLen);
	objSocket.SetSendBufferMaxSize(m_iClientSocketSendMaxLen);
	objSocket.SetCloseDelay(0);
}

bool Connect::InitSimObjContainer() {
	if (!m_userContainer.init(EUCT_USER, m_iClientMaxSocketCount))
		return false;
	int count = std::max(m_iClientMaxSocketCount / 10, 100);
	if (!m_tmpUsers.init(EUCT_USER, count))
		return false;
	return true;
}

void Connect::UpdateUsers() {
	CheckOnlineUserActive();
	CheckTmpUserActive();
}

void Connect::CheckOnlineUserActive() {
	CheckUserActive(m_curCheckUserActiveIndex, &m_userContainer, true);
}

void Connect::CheckTmpUserActive() {
	CheckUserActive(m_curCheckTmpUserActiveIndex, &m_tmpUsers, false);
}

void Connect::CheckUserActive(uint32& curIdx, ObjContainer<User>* container,
		bool isSendMsg) {
	uint32 idx = (curIdx++) % container->getCount();
	User* user = container->getByIdx(idx);
	if (user == NULL)
		return;
	if (!user->IsActive(m_lpTime->GetCurrentTimeSec())) {
		if (isSendMsg) {
			m_gameSvrMessager.SendUserExitMsgToGameSvr(user->getId());
		}
		ExitUser(user);
	}
}

User* Connect::NewUser(const sockaddr_in& addr, int socket) {
	User* user = m_userContainer.allocObject();
	if (user == NULL) {
		std::clog << "Alloc user node failed!" << std::endl;
	} else {
		user->SetIp(addr.sin_addr.s_addr);
		user->SetSocket(socket);
	}
	return user;
}

bool Connect::InitMessager() {
	if (!m_objMessager.Connect(m_strNameId.c_str(), "*")) {
		std::cerr << "messager connect other server failed!" << std::endl;
		return false;
	}
	m_gameSvrId = m_objMessager.GetRandomToSvrIdByType(0);
	m_gameSvrMessager.SetGameSvrId(m_gameSvrId);
	return true;
}

void Connect::FreeUser(User* user) {
	if (user) {
		user->CloseSocket();
		if (user->IsTmp()) {
			m_tmpUsers.freeObject(user->getId());
		} else {
			m_userContainer.freeObject(user->getId());
		}
	}
}

void Connect::OnDestroy() {
	FreeListUsers(&m_userContainer);
	FreeListUsers(&m_tmpUsers);
}

void Connect::FreeListUsers(ObjContainer<User>* list) {
	int count = list->getCount();
	for (int i = count - 1; i >= 0; --i) {
		User* user = list->getByIdx(i);
		ExitUser(user);
	}
}

void Connect::ExitUser(User* user) {
	DelNetIoEvent(user);
	FreeUser(user);
}

int Connect::OnCommandCfg(const char* cmd) {
	if (ServerApp::OnCommandCfg(cmd) == 1)
		return 1;

	if (IsExitSysCmd(cmd)) {
		m_isRunning = false;
	}

	return 1;
}

bool Connect::IsExitSysCmd(const char* cmd) {
	return strcmp(cmd, "exit") == 0;
}

void Connect::ShowHelpInfo() {
	std::clog << "connect -s svrname" << std::endl;
	std::clog << "    启动指定的server!" << std::endl;
	std::clog << "connect -v" << std::endl;
	std::clog << "    显示当期server的版本信息!" << std::endl;
}

void Connect::StartGame(const char* svrname) {
	if (svrname != NULL && strcmp(svrname, "") != 0) {
		SetSvrCfgDir(svrname);
		ShowVersion();
		Run();
	}
}

//////////////////////////////////////////////////////
int main(int argc, char* argv[]) {
	Connect app;
	ProcessArgs objArgs(argc, argv, "s:g:k:hvd");
	if (objArgs.HasArg('h')) {
		app.ShowHelpInfo();
	} else if (objArgs.HasArg('v')) {
		app.ShowVersion();
	} else if (objArgs.HasArg('k')) {
		app.StopServer(objArgs.GetParam('k'));
	} else if (objArgs.HasArg('s')) {
		const char* svrname = objArgs.GetParam('s');
		if (app.IsExist(svrname)) {
			return 0;
		}
		if (objArgs.HasArg('g')) {
			app.SetGlobalCfgPath(objArgs.GetParam('g'));
		}
		if (objArgs.HasArg('d')) {
			app.Daemonize();
		}signal(SIGPIPE, SIG_IGN);
		app.StartGame(svrname);
		std::cout << "server stop!" << std::endl;
	}
	app.Release();
	return 0;
}

