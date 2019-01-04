#include "gamesvr.h"
#include "ScriptPub.h"
#include "GridsManager.h"
#include "RankManager.h"
#include "ProxyServer.h"
#include <messagerCmd.h>
#include <processArgs.h>
#include <IFile.h>
#include <IFileManager.h>

#if defined(WIN32)
struct ExceptionHandler {
	ExceptionHandler() {
		LoadLibraryA("exchndl.dll");
	}
};

static ExceptionHandler g_exceptionHandler;
#endif

const int SYSCMD_RELOADCODE = 1;
const int SYSCMD_EXITUSER = 2;
const int SYSCMD_EXITSYS = 3;

const int RELOAD_ALL_SCRIPT_FLAG = 0;
const int RELOAD_MODIFY_SCRIPT_FLAG = 1;

bool DatabaseCfg::LoadConfig(const char* filename) {
	TiXmlDocument objDoc(filename);
	objDoc.LoadFile();
	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load configure xml file ./db_config.xml failed!"
				<< std::endl;
		return false;
	}
	m_strHostIp = LoadString(objDoc, "DBHostIp");
	m_usHostPort = LoadInteger(objDoc, "DBHostPort");
	m_strUsername = LoadString(objDoc, "DBUsername");
	m_strPassword = LoadString(objDoc, "DBPassword");
	m_strDatabase = LoadString(objDoc, "Database");
	m_strCharacterSet = LoadString(objDoc, "DBCharacterSet");
	m_usZoneId = LoadInteger(objDoc, "ZoneId");
	return true;
}

const char* DatabaseCfg::LoadString(TiXmlDocument& objDoc,
		const char* fieldkey) {
	TiXmlNode* lpNode = NULL;
	TiXmlElement* lpElement = NULL;
	lpNode = objDoc.FirstChild(fieldkey);
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		return lpElement->Attribute("value");
	}
	return NULL;
}

int DatabaseCfg::LoadInteger(TiXmlDocument& objDoc, const char* fieldkey) {
	int val = 0;
	TiXmlNode* lpNode = NULL;
	TiXmlElement* lpElement = NULL;
	lpNode = objDoc.FirstChild(fieldkey);
	if (lpNode != NULL) {
		lpElement = lpNode->ToElement();
		lpElement->Attribute("value", &val);
	}
	return val;
}

GameSvr::GameSvr() :
		m_lpIDB(NULL), m_iHttpSvrId(0), m_iFlashSvrId(0), m_lpScriptPub(NULL), m_lpGridsMgr(
				NULL), m_lpRankMgr(NULL), m_lpProxyServer(NULL) {
	SetServerVersion();
}

GameSvr::~GameSvr() {
}

IO::IDatabase* GameSvr::GetDB() {
	return m_lpIDB;
}

ushort GameSvr::GetZoneId() {
	return m_dbCfg.GetZoneId();
}

int GameSvr::GetMaxRegCount() {
	return 1000;
}

bool GameSvr::Init() {
	std::cout << "start ServerApp::Init ..." << std::endl;
	if (!ServerApp::Init()) {
		std::cerr << "ServerApp::Init failed" << std::endl;
		return false;
	}

	std::cout << "start InitMessager ..." << std::endl;
	if (!InitMessager()) {
		std::cerr << "InitMessager failed" << std::endl;
		return false;
	}

	std::cout << "start InitGameSys ..." << std::endl;
	if (!InitGameSys()) {
		std::cerr << "InitGameSys failed" << std::endl;
		return false;
	}

	std::cout << "start InitFileMgr ..." << std::endl;
	if (!InitFileMgr()) {
		std::cerr << "InitFileMgr failed" << std::endl;
		return false;
	}

	std::cout << "start InitGameObjects ..." << std::endl;
	if (!InitGameObjects()) {
		std::cerr << "InitGameObjects failed" << std::endl;
		return false;
	}

	std::cout << "start InitDBObject ..." << std::endl;
	if (!InitDBObject()) {
		std::cerr << "InitDBObject failed" << std::endl;
		return false;
	}

	std::cout << "start InitTimerQueue ..." << std::endl;
	if (!InitTimerQueue()) {
		std::cerr << "InitTimerQueue failed" << std::endl;
		return false;
	}

	std::cout << "start InitScriptPub ..." << std::endl;
	if (!InitScriptPub()) {
		std::cerr << "InitScriptPub failed" << std::endl;
		return false;
	}

	std::cout << "start InitGridsMgr ..." << std::endl;
	if (!InitGridsMgr()) {
		std::cerr << "InitGridsMgr failed" << std::endl;
		return false;
	}

	std::cout << "start InitRankMgr ..." << std::endl;
	if (!InitRankMgr()) {
		std::cerr << "InitRankMgr failed" << std::endl;
		return false;
	}

	std::cout << "start InitProxyServer ..." << std::endl;
	if (!InitProxyServer()) {
		std::cerr << "InitProxyServer failed" << std::endl;
		return false;
	}

	std::cout << "start LoadFromScript ..." << std::endl;
	if (!LoadFromScript()) {
		std::cerr << "LoadFromScript failed" << std::endl;
		return false;
	}

	std::cout << "init game ok!" << std::endl;
	return true;
}

bool GameSvr::Configure() {
	if (!LoadDynRegConfig("config/gamesvr/sys_config.xml")) {
		return false;
	}

	std::string strFile = "config/gamesvr/" + m_strSvrCfgDir
			+ "/comm_config.xml";
	if (!LoadCommConfig(strFile.c_str())) {
		return false;
	}

	m_strCfgBasePath = m_strWorkDir + "config/gamesvr/" + m_strSvrCfgDir;
	m_strLogBasePath = m_strWorkDir + "log";

	strFile = m_strCfgBasePath	+ "/db_config.xml";
	if (!m_dbCfg.LoadConfig(strFile.c_str())) {
		return false;
	}

	std::string szMsgCfg = m_strWorkDir + "config/msg_config.xml";
	if (!m_objMessager.LoadConfig(szMsgCfg.c_str())) {
		std::cerr << "load message config failed!" << std::endl;
		return false;
	}
	return true;
}

const char* GameSvr::GetCfgBasePath(){
	return m_strCfgBasePath.c_str();
}

const char* GameSvr::GetLogBasePath(){
	return m_strLogBasePath.c_str();
}

const char* GameSvr::GetSvrNameId(){
	return m_strNameId.c_str();
}

void GameSvr::OnBeforeWaitEvent() {
	m_lpProxyServer->handlePkg();
}

void GameSvr::OnRecvMessager() {
	int32 type = GetMessagerType();
	if (type == MSG_TRANSFER) {
		OnMsgTransfer((char *) m_lpszMsgPkg + sizeof(type));
	} else if (type == MSG_NOTIFY) {
		OnMsgNotify((char *) m_lpszMsgPkg);
	}
}

void GameSvr::SendProxyCmd(const char* msg) {
	SendTransferMsg(0, 1000000, (char*) msg);
}

void GameSvr::OnMsgTransfer(char* msg) {
	object_id id = *((object_id*) msg);
	msg += sizeof(id);
	SendTransferMsg(id, m_ulMessagerFromSvrId, msg);
}

void GameSvr::SendTransferMsg(object_id id, int connid, char* msg) {
	ScriptEvent stWebNetEvt;
	stWebNetEvt.eventType = (EEventType) ((1 + EET_NET_EVENT_FIRST));
	stWebNetEvt.playerid = id;
	stWebNetEvt.connid = connid;
	stWebNetEvt.data = msg;
	stWebNetEvt.datalen = strlen(msg);
	SEvent stEvent(&stWebNetEvt);
	m_lpEventSys->SendEvent(stEvent);
}

void GameSvr::OnMsgNotify(char* msg) {
	MsgNotify* notify = (MsgNotify*) msg;
	if (notify->cmd == MSG_CMD_USEREXIT_CS) {
		OnMsgCmdUserExit(notify);
	}
}

void GameSvr::OnMsgCmdUserExit(MsgNotify* notify) {
	ScriptEvent stWebNetEvt;
	stWebNetEvt.eventType = (EEventType) (3 + EET_NET_EVENT_FIRST);
	stWebNetEvt.playerid = notify->userid;
	stWebNetEvt.connid = m_ulMessagerFromSvrId;

	char msg[256];
	SafeSprintf(msg, sizeof(msg), "{cmd=%d}", SYSCMD_EXITUSER);
	stWebNetEvt.data = msg;
	stWebNetEvt.datalen = strlen(msg);

	SEvent stEvent(&stWebNetEvt);
	m_lpEventSys->SendEvent(stEvent);
}

void GameSvr::OnDestroy() {
	if (m_lpIDB != NULL) {
		m_lpIDB->Close();
	}
	SafeDelete(m_lpScriptPub);
	SafeDelete(m_lpGridsMgr);
	SafeDelete(m_lpRankMgr);
}

void GameSvr::SetSvrCfgDir(const char* lpszSvrCfgDir) {
	m_strSvrCfgDir = lpszSvrCfgDir;
}

bool GameSvr::InitFileMgr() {
	IO::IFileManager* fileMgr =
			reinterpret_cast<IO::IFileManager*>(m_lpGameSys->GetUserData(
					"IFileManager"));
	fileMgr->SetNatureFileImportant();
	fileMgr->SetWorkPath(m_strWorkDir.c_str());
	std::string stuff = m_strWorkDir + "stuff.dat";
	fileMgr->AddPackage(stuff.c_str());
	return true;
}

bool GameSvr::InitMessager() {
	if (!m_objMessager.Connect(m_strNameId.c_str(), "*")) {
		std::cerr << "messager connect other server failed!" << std::endl;
		return false;
	}
	m_iHttpSvrId = m_objMessager.GetRandomToSvrIdByType(0);
	m_iFlashSvrId = m_objMessager.GetRandomToSvrIdByType(1);
	return true;
}

void GameSvr::SetServerVersion() {
	// for version
	m_strServerName = "Game Server";
	m_uiVersionMajor = 1;
	m_uiVersionMinor = 0;
	m_uiVersionBuild = 1;
#if defined(__TIME__) && defined(__DATE__)
	m_szBuildDate = __DATE__;
	m_szBuildTime = __TIME__;
#endif
}

bool GameSvr::InitScriptPub() {
	m_lpScriptPub = new ScriptPub;
	m_lpScriptPub->SetGameSys(m_lpGameSys);
	m_lpScriptPub->SetGameSvr(this);
	m_lpScriptPub->OnOneTimeInit();
	m_lpGameSys->RegisterUserData("IScriptPub", m_lpScriptPub);
	return true;
}

void GameSvr::SendMsg(object_id id, int32 connid, const char* lpMsg) {
	int32 type = MSG_TRANSFER;
	int msglen = strlen(lpMsg) + 1;
	m_objMessager.SendHead(connid, sizeof(type) + sizeof(id) + msglen);
	m_objMessager.SendData(connid, (const void*) &type, sizeof(type));
	m_objMessager.SendData(connid, (const void*) &id, sizeof(id));
	m_objMessager.SendData(connid, lpMsg, msglen);
}

void GameSvr::SendMsgNotifyCmd(object_id id, int32 connid, int cmd) {
	MsgNotify notify;
	notify.type = MSG_NOTIFY;
	notify.userid = id;
	notify.cmd = cmd;
	m_objMessager.Send(connid, &notify, sizeof(notify));
}

void GameSvr::SendUseKeyCmd(object_id id, int32 connid, const char* key) {
	MsgSetUserKey userkey;
	userkey.type = MSG_SETUSERKEY;
	userkey.userid = id;
	memcpy(userkey.key, key, 16);
	m_objMessager.Send(connid, &userkey, sizeof(userkey));
}

inline int32 GameSvr::GetMessagerType() {
	return *((int32 *) m_lpszMsgPkg);
}

bool GameSvr::InitDBObject() {
	// get db interface object
	m_lpIDB = reinterpret_cast<IO::IDatabase*>(m_lpGameSys->GetUserData(
			"IDatabase"));
	if (m_lpIDB == NULL) {
		std::cerr << "get db object failed!" << std::endl;
		return false;
	}

	// connect the db server
	if (!m_lpIDB->Connect(m_dbCfg.GetHostIp(), m_dbCfg.GetHostPort(),
			m_dbCfg.GetUserName(), m_dbCfg.GetPassword(),
			m_dbCfg.GetDatabase())) {
		std::cerr << "Connect db server failed!" << std::endl;
		return false;
	}

	// set db character set
	if (!m_lpIDB->SetCharacterSet(m_dbCfg.GetCharSet())) {
		std::cerr << "set db character set failed!" << std::endl;
		return false;
	}

	return true;
}

bool GameSvr::InitTimerQueue() {
	m_lpTimerQueue->Init(TIMERQUEUE_PRECISION_MS);
	return true;
}

bool GameSvr::InitGridsMgr() {
	m_lpGridsMgr = new GridsManager;
	m_lpGameSys->RegisterUserData("IGridsManager", m_lpGridsMgr);
	m_lpGridsMgr->SetGameSvr(this);
	return true;
}

bool GameSvr::InitRankMgr() {
	m_lpRankMgr = new RankManager;
	m_lpGameSys->RegisterUserData("IRankManager", m_lpRankMgr);
	m_lpRankMgr->SetGameSys(m_lpGameSys);
	return true;
}

bool GameSvr::InitProxyServer() {
	m_lpProxyServer = new ProxyServer;
	m_lpGameSys->RegisterUserData("IProxyServer", m_lpProxyServer);
	m_lpProxyServer->setGameSvr(this);
	return true;
}

void GameSvr::ShowHelpInfo() {
	std::clog << "gamesvr -r svrname" << std::endl;
	std::clog << "    重载指定server的脚本代码!" << std::endl;
	std::clog << "gamesvr -s svrname" << std::endl;
	std::clog << "    启动指定的server!" << std::endl;
	std::clog << "gamesvr -v" << std::endl;
	std::clog << "    显示当期server的版本信息!" << std::endl;
}

void GameSvr::ReloadScript(const char* svrname, int reloadFlag) {
	if (svrname != NULL && strcmp(svrname, "") != 0) {
		char msg[256] = { 0 };
		SafeSprintf(msg, sizeof(msg), "{cmd=%d,flag=%d}", SYSCMD_RELOADCODE,
				reloadFlag);
		PendCommand(msg, svrname);
	}
}

void GameSvr::StartGame(const char* svrname) {
	if (svrname != NULL && strcmp(svrname, "") != 0) {
		SetSvrCfgDir(svrname);
		ShowVersion();
		Run();
	}
}

void GameSvr::StopServer(const char* svrname) {
	if (svrname == NULL || strcmp(svrname, "") == 0)
		return;

	char msg[256] = { 0 };
	SafeSprintf(msg, sizeof(msg), "{cmd=%d}", SYSCMD_EXITSYS);
	PendCommand(msg, svrname);
	std::cout << "send stop server command!" << std::endl;
}

int GameSvr::OnCommandCfg(const char* cmd) {
	if (ServerApp::OnCommandCfg(cmd) == 1)
		return 1;

	ScriptEvent webNetEvt;
	webNetEvt.eventType = (EEventType) (3 + EET_NET_EVENT_FIRST);
	webNetEvt.connid = m_ulMessagerFromSvrId;
	webNetEvt.data = (char*) cmd;
	webNetEvt.datalen = strlen(cmd);
	SEvent event(&webNetEvt);
	m_lpEventSys->SendEvent(event);

	if (IsExitSysCmd(cmd)) {
		m_isRunning = false;
	}

	return 1;
}

bool GameSvr::IsExitSysCmd(const char* cmd) {
	char exitCmd[256] = { 0 };
	SafeSprintf(exitCmd, sizeof(exitCmd), "{cmd=%d}", SYSCMD_EXITSYS);
	return strcmp(cmd, exitCmd) == 0;
}

int main(int argc, char* argv[]) {
	GameSvr app;
	ProcessArgs objArgs(argc, argv, "r:a:k:s:g:dhv");
	if (objArgs.HasArg('h')) {
		app.ShowHelpInfo();
	} else if (objArgs.HasArg('v')) {
		app.ShowVersion();
	} else if (objArgs.HasArg('r')) {
		app.ReloadScript(objArgs.GetParam('r'), RELOAD_MODIFY_SCRIPT_FLAG);
	} else if (objArgs.HasArg('a')) {
		app.ReloadScript(objArgs.GetParam('a'), RELOAD_ALL_SCRIPT_FLAG);
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
		}
		app.StartGame(svrname);
		std::cout << "server stop!" << std::endl;
	}

	app.Release();
	return 0;
}
