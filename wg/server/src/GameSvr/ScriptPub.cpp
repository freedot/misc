#include "ScriptPub.h"
#include <DataProcessor.h>
#include "gamesvr.h"
#include "tqRoleVar.h"
#include "tqDbAssist.h"

#define MAKE_ROLE_GUID(zoneid, idx) \
	((((uint64)(zoneid))<<32)&0x4FFF00000000LL)|(((uint64)(idx))&0xffffffff)

#ifdef _DEBUG
#define DBVAR_ALLOC_MAX_COUNT (1<<8)
#define DBALLIVAR_ALLOC_MAX_COUNT (1<<4)
#define TIMERUSERDATA_ALLOC_MAX_COUNT (1<<4)
#else
#define DBVAR_ALLOC_MAX_COUNT (1<<8)
#define DBALLIVAR_ALLOC_MAX_COUNT (1<<4)
#define TIMERUSERDATA_ALLOC_MAX_COUNT (1<<4)
#endif //_DEBUG
#ifdef LUA_UT
#undef DBVAR_ALLOC_MAX_COUNT
#undef DBALLIVAR_ALLOC_MAX_COUNT
#undef TIMERUSERDATA_ALLOC_MAX_COUNT
#define DBVAR_ALLOC_MAX_COUNT 1
#define DBALLIVAR_ALLOC_MAX_COUNT 1
#define TIMERUSERDATA_ALLOC_MAX_COUNT 1
#endif // LUA_UT
#define MAKE_DB_CITYID(cityidx, grididx) ((((uint32)(cityidx))<<24)|(((uint32)(grididx))&0xffffff))

ScriptPub::ScriptPub() :
		m_time(NULL), m_lpGameSvr(NULL), m_lpszSql(NULL) {
	INIT_TQINTERFACE()
	m_lpszSql = new char[MAX_SQL_LEN];
	m_dbVarAlloc.Init(DBVAR_ALLOC_MAX_COUNT, 0, false, true);
	m_dbAlliVarAlloc.Init(DBALLIVAR_ALLOC_MAX_COUNT, 0, false, true);
	m_timerUserdataAlloc.Init(TIMERUSERDATA_ALLOC_MAX_COUNT, 0, false, true);
}

ScriptPub::~ScriptPub() {
	SafeDeleteArray(m_lpszSql);
	ReleaseBlobs();
}

bool ScriptPub::OnOneTimeInit() {
	if (m_lpGameSys == NULL) {
		return false;
	}

	m_time = static_cast<ITime*>(m_lpGameSys->GetUserData("ITime"));
	if (m_time == NULL) {
		return false;
	}

	return true;
}

void ScriptPub::ReleaseBlobs() {
	return;
	std::vector<char*>::iterator iter = m_vctBlobs.begin();
	for (; iter != m_vctBlobs.end(); ++iter) {
		char* lpBuf = (*iter);
		SafeDeleteArray(lpBuf);
	}
	m_vctBlobs.clear();
}

void ScriptPub::SetGameSvr(GameSvr* lpGameSvr) {
	m_lpGameSvr = lpGameSvr;
}

const char* ScriptPub::GetCfgBasePath() {
	if (!m_lpGameSvr)
		return NULL;
	return m_lpGameSvr->GetCfgBasePath();
}

const char* ScriptPub::GetLogBasePath() {
	if (!m_lpGameSvr)
		return NULL;
	return m_lpGameSvr->GetLogBasePath();
}

const char* ScriptPub::GetSvrNameId() {
	if (!m_lpGameSvr)
		return NULL;
	return m_lpGameSvr->GetSvrNameId();
}

object_id ScriptPub::MakeNewRoleId(const SDBVar* dbvar) {
	ushort zoneid = m_lpGameSvr->GetZoneId();
	uint32 index = 0;
	IO::IDatabase* db = m_lpGameSvr->GetDB();
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, sc_lpszGetLastRoleAutoId);
	if (db->Query(m_lpszSql, strlen(m_lpszSql)) && HasRowFromCurQuerySet()) {
		index = SafeAsciToULong(db->GetField(0));
	}
	return MAKE_ROLE_GUID(zoneid, index+1);
}

int ScriptPub::CreateRole(const SDBVar* dbvar) {
	IO::IDatabase* db = m_lpGameSvr->GetDB();

	int ret = VarConvertRoleFieldToBlob(db, m_lpszSql, MAX_SQL_LEN, (SDBVar*) dbvar, m_vctBlobs);
	if (ret != RET_OK) {
		return ret;
	}

	return VarInsertRoleIntoDB(db, m_lpszSql, MAX_SQL_LEN, (SDBVar*) dbvar, m_vctBlobs);
}

int ScriptPub::RoleLogin(SDBVar* dbvar, const char* username, int zoneid) {
	if (m_lpGameSvr->GetZoneId() != zoneid) {
		return RET_LOGIN_ZONEID_ERR;
	}

	if (!QueryRoleByUserName(username, zoneid)) {
		return RET_DB_COM_ERR;
	}

	if (!HasRowFromCurQuerySet()) {
		return RET_LOGIN_NOROLE;
	}

	return RoleVarInitRoleFromDB(m_lpGameSvr->GetDB(), dbvar);
}

int ScriptPub::RoleSave(const SDBVar* dbvar) {
	if (dbvar == NULL) {
		return RET_NULL_PTR;
	}

	if (dbvar->ullRoleId == 0) {
		return RET_OK;
	}

	IO::IDatabase* db = m_lpGameSvr->GetDB();

	int ret = VarConvertRoleFieldToBlob(db, m_lpszSql, MAX_SQL_LEN, (SDBVar*) dbvar, m_vctBlobs);
	if (ret != RET_OK) {
		return ret;
	}

	return VarUpdateRoleIntoDB(db, m_lpszSql, MAX_SQL_LEN, (SDBVar*) dbvar, m_vctBlobs);
}

void ScriptPub::RoleLogout(const SPlayer* lpPlayer, int iReason) {
}

bool ScriptPub::IsExistRoleName(const char* rolename) {
	IO::IDatabase* db = m_lpGameSvr->GetDB();
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, sc_lpszFindRoleNameExist, rolename);
	if (db->Query(m_lpszSql, strlen(m_lpszSql)) && HasRowFromCurQuerySet()) {
		return true;
	}
	return false;
}

bool ScriptPub::IsExistUserName(const char* username) {
	if (username == NULL)
		return false;
	if (strlen(username) < 2 || strlen(username) > 32)
		return false;
	if (strstr(username, "\'") != NULL)
		return false;
	if (strstr(username, "\"") != NULL)
		return false;

	IO::IDatabase* db = m_lpGameSvr->GetDB();
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, sc_lpszFindUserNameExist, username);
	if (db->Query(m_lpszSql, strlen(m_lpszSql)) && HasRowFromCurQuerySet()) {
		return true;
	}
	return false;
}

void ScriptPub::SendMsg(object_id id, int connid, const char* msg) {
	m_lpGameSvr->SendMsg(id, connid, msg);
}

void ScriptPub::SendMsgNotifyCmd(object_id id, int connid, int cmd) {
	m_lpGameSvr->SendMsgNotifyCmd(id, connid, cmd);
}

void ScriptPub::SendUseKeyCmd(object_id id, int connid, const char* key) {
	m_lpGameSvr->SendUseKeyCmd(id, connid, key);
}

SDBVar* ScriptPub::AllocDBVar() {
#ifdef LUA_UT
	return new SDBVar;
#else
	return m_dbVarAlloc.Alloc();
#endif
}

void ScriptPub::FreeDBVar(SDBVar* dbvar) {
	if (dbvar != NULL) {
#ifdef LUA_UT
		delete dbvar;
#else
		m_dbVarAlloc.Free(dbvar);
#endif
	}
}

bool ScriptPub::QueryRoleByUserName(const char* username, ushort zoneid) {
	IO::IDatabase* db = m_lpGameSvr->GetDB();
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, sc_lpszLoginSql, username);
	if (!db->Query(m_lpszSql, strlen(m_lpszSql))) {
		LOG("COM", "zoneid=%d the error: %s", zoneid, db->GetLastErrorStr());
		return false;
	}
	return true;
}

bool ScriptPub::HasRowFromCurQuerySet() {
	IO::IDatabase* db = m_lpGameSvr->GetDB();
	return (db->GetRow() && (db->GetRowCount() > 0));
}

SDBAlliVar* ScriptPub::AllocDBAlliVar() {
#ifdef LUA_UT
	return new SDBAlliVar;
#else
	return m_dbAlliVarAlloc.Alloc();
#endif
}

void ScriptPub::FreeDBAlliVar(SDBAlliVar* dbvar) {
	if (dbvar != NULL) {
#ifdef LUA_UT
		delete dbvar;
#else
		m_dbAlliVarAlloc.Free(dbvar);
#endif
	}
}

int ScriptPub::InitAlliByUID(object_id id, SDBAlliVar* dballivar) {
	int ret = 0;
	if (!QueryAlliFromDB(id)) {
		ret = RET_DB_COM_ERR;
	} else if (!HasRowFromCurQuerySet()) {
		ret = RET_NOFIND_ALLI;
	} else {
		ret = AlliVarInitAlliFromDB(m_lpGameSvr->GetDB(), dballivar);
	}
	return ret;
}

bool ScriptPub::QueryAlliFromDB(uint64 alliid) {
	IO::IDatabase* db = m_lpGameSvr->GetDB();
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, sc_lpszGetAlliById, alliid);
	if (!db->Query(m_lpszSql, strlen(m_lpszSql))) {
		LOG("COM", "alliid=%d the error: %s", alliid, db->GetLastErrorStr());
		return false;
	}
	return true;
}

TimerUserData* ScriptPub::AllocTimerUserData() {
#ifdef LUA_UT
	return new TimerUserData;
#else
	return m_timerUserdataAlloc.Alloc();
#endif
}

void ScriptPub::FreeTimerUserData(TimerUserData* userdata) {
	if (userdata != NULL) {
#ifdef LUA_UT
		delete userdata;
#else
		m_timerUserdataAlloc.Free(userdata);
#endif
	}
}

ushort ScriptPub::GetZoneId() {
	return m_lpGameSvr->GetZoneId();
}

IO::IDatabase* ScriptPub::GetDBConn() {
	return m_lpGameSvr->GetDB();
}

void ScriptPub::ClearInnerHero(const SHero* hero) {
	new ((void*) hero) SHero();
}

int32 ScriptPub::diffTimeMs(uint32 time1, uint32 time2) {
	return (int32) (time2 - time1);
}

uint32 ScriptPub::getTimeMs() {
	return m_time->GetCurrentTimeMs();
}

uint64 ScriptPub::getTimeMsEx() {
	return m_time->GetCurrentTimeMsEx();
}

