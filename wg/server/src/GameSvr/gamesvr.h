#ifndef _GAME_SVR_H__
#define _GAME_SVR_H__
#include <IDatabase.h>
#include <serverApp.h>
#include <ITimerQueue.h>
#include <IScriptSys.h>
#include <IEventSys.h>
#include <messagerCmd.h>
#include <sharemem.h>

class DatabaseCfg {
public:
	bool LoadConfig(const char* filename);

public:
	const char* GetHostIp() {
		return m_strHostIp.c_str();
	}
	ushort GetHostPort() {
		return m_usHostPort;
	}
	const char* GetUserName() {
		return m_strUsername.c_str();
	}
	const char* GetPassword() {
		return m_strPassword.c_str();
	}
	const char* GetDatabase() {
		return m_strDatabase.c_str();
	}
	const char* GetCharSet() {
		return m_strCharacterSet.c_str();
	}
	ushort GetZoneId() {
		return m_usZoneId;
	}

	DatabaseCfg() :
			m_usHostPort(0), m_usZoneId(1) {
	}

private:
	const char* LoadString(TiXmlDocument& objDoc, const char* fieldkey);
	int LoadInteger(TiXmlDocument& objDoc, const char* fieldkey);

private:
	/// 数据库服务器IP
	std::string m_strHostIp;
	/// 数据库服务器端口
	ushort m_usHostPort;
	/// 数据库用户名称
	std::string m_strUsername;
	/// 数据库密码
	std::string m_strPassword;
	/// 数据库名称
	std::string m_strDatabase;
	/// 数据库的字符集
	std::string m_strCharacterSet;
	/// 游戏服务器线id
	ushort m_usZoneId;
};

///时钟精度
#define TIMERQUEUE_PRECISION_MS 500

class ScriptPub;
class GridsManager;
class RankManager;
class ProxyServer;
class GameSvr: public ServerApp {
public:
	virtual bool Init();
	virtual bool Configure();
	virtual void OnRecvMessager();
	virtual void OnDestroy();
	virtual int OnCommandCfg(const char* cmd);

public:
	IO::IDatabase* GetDB();
	ushort GetZoneId();
	int GetMaxRegCount();
	void SendMsg(object_id id, int32 connid, const char* lpMsg);
	void SendMsgNotifyCmd(object_id id, int32 connid, int cmd);
	void SendUseKeyCmd(object_id id, int32 connid, const char* key);
	void SendProxyCmd(const char* msg);
	const char* GetCfgBasePath();
	const char* GetLogBasePath();
	const char* GetSvrNameId();

public:
	/** 构造函数 */
	GameSvr();
	/** 析构函数 */
	~GameSvr();

public:
	/** 设置当前的服务器配置目录
	 @param lpszSvrCfgDir 当前服务器的配置文件目录
	 */
	virtual void SetSvrCfgDir(const char* lpszSvrCfgDir);
	void ShowHelpInfo();
	void ReloadScript(const char* svrname, int reloadFlag);
	void StartGame(const char* svrname);
	void StopServer(const char* svrname);

protected:
	bool InitFileMgr();
	bool InitMessager();
	void SetServerVersion();
	bool InitScriptPub();
	bool InitDBObject();
	bool InitTimerQueue();
	bool InitGridsMgr();
	bool InitRankMgr();
	bool InitProxyServer();
	int32 GetMessagerType();
	void OnBeforeWaitEvent();
	void OnMsgTransfer(char* msg);
	void OnMsgNotify(char* msg);
	void OnMsgCmdUserExit(MsgNotify* notify);
	void OnMsgCmdUserLoginOk(MsgNotify* notify);
	bool IsExitSysCmd(const char* cmd);
	void SendTransferMsg(object_id id, int connid, char* msg);

protected:
	/// 服务器配置的相对目录
	std::string m_strSvrCfgDir;
	/// 服务器配置的基本路径
	std::string m_strCfgBasePath;
	/// 服务器日志的基本路径
	std::string m_strLogBasePath;
	/// 数据库对象
	IO::IDatabase* m_lpIDB;
	/// 数据库配置
	DatabaseCfg m_dbCfg;
	/// 和当前gamesvr相关联的HTTP服务器id
	int m_iHttpSvrId;
	/// 和当前gamesvr相关联的FLASH服务器id
	int m_iFlashSvrId;
	/// 供脚本调用的接口
	ScriptPub* m_lpScriptPub;
	/// 城池网格管理
	GridsManager* m_lpGridsMgr;
	/// 排名管理
	RankManager* m_lpRankMgr;
	/// 代理服务器
	ProxyServer* m_lpProxyServer;
};

#endif// _GAME_SVR_H__
