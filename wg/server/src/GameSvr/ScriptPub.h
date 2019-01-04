#ifndef _TQ_SCRIPT_PUB_H_
#define _TQ_SCRIPT_PUB_H_
#include <pkgBase.h>
#include "IScriptPub.h"
#include <fixAlloc.h>
#include <ITime.h>

namespace IO {
class IDatabase;
}

class GameSvr;
class ScriptPub: public IScriptPub {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()

public:
	bool OnOneTimeInit();
	void OnOneTimeRelease() {
	}
	;
	void SetGameSvr(GameSvr* lpGameSvr);
	int CreateRole(const SDBVar* dbvar);
	int RoleLogin(SDBVar* dbvar, const char* username, int zoneid);
	int RoleSave(const SDBVar* dbvar);
	void RoleLogout(const SPlayer* lpPlayer, int iReason);
	void SendMsg(object_id id, int connid, const char* msg);
	void SendMsgNotifyCmd(object_id id, int connid, int cmd);
	void SendUseKeyCmd(object_id id, int connid, const char* key);
	SDBVar* AllocDBVar();
	void FreeDBVar(SDBVar* dbvar);
	bool IsExistRoleName(const char* rolename);
	bool IsExistUserName(const char* username);
	int InitAlliByUID(object_id id, SDBAlliVar* dballivar);
	SDBAlliVar* AllocDBAlliVar();
	void FreeDBAlliVar(SDBAlliVar* dbvar);
	TimerUserData* AllocTimerUserData();
	void FreeTimerUserData(TimerUserData* userdata);object_id MakeNewRoleId(
			const SDBVar* dbvar);
	ushort GetZoneId();
	IO::IDatabase* GetDBConn();
	void ClearInnerHero(const SHero* hero);
	int32 diffTimeMs(uint32 time1, uint32 time2);
	uint32 getTimeMs();
	uint64 getTimeMsEx();
	const char* GetCfgBasePath();
	const char* GetLogBasePath();
	const char* GetSvrNameId();

public:
	ScriptPub();
	virtual ~ScriptPub();

protected:
	int ReadBlobFromDB(const char* lpBuf, int iBufLen, SPkgBase* lpBase);
	bool HasRow(IO::IDatabase* db);
	bool QueryRoleByUserName(const char* username, ushort zoneid);
	bool HasRowFromCurQuerySet();
	bool QueryAlliFromDB(uint64 alliid);
	void ReleaseBlobs();

protected:
	ITime* m_time;
	GameSvr* m_lpGameSvr;
	char* m_lpszSql;
	std::vector<char*> m_vctBlobs;
	FixAlloc<SDBVar> m_dbVarAlloc;
	FixAlloc<SDBAlliVar> m_dbAlliVarAlloc;
	FixAlloc<TimerUserData> m_timerUserdataAlloc;
};

#endif // _TQ_SCRIPT_PUB_H_
