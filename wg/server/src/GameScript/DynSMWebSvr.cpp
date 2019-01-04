#include "DynSMWebSvr.h"
#include "GameSys.h"
#include <DataProcessor.h>
#include <log.h>
#include "ScriptTimer.h"

#include "../GameSvr/IScriptPub.h"

#ifndef LUA_UT
DECLARE_DLLMAIN()
#endif //LUA_UT
extern "C" {
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>
#include <tolua++.h>
#include <luaex.h>
#include "ITimerQueue.h"
}

static ScriptTimer g_scriptTimer;
static Script::ScriptTimerEx g_scriptTimerEx;
void HandleLuaErrorStatus(lua_State* luaState) {
	char szError[4096];
	SafeStrCpy(szError, lua_tostring(luaState, -1), sizeof(szError));
	lua_pop(luaState, 1);

	lua_getglobal(luaState, "print");
	if (lua_isfunction(luaState, -1)) {
		lua_pushstring(luaState, szError);
		lua_call(luaState, 1, 0);
	}
	LOG("COM", "<scripterror> %s", szError);
	//assert(false);
}

//-------------------------------------------------------------------------------------------
inline uchar* GetInnerKey(int iFlag, uchar* lpuKey) {
	if (iFlag == 0) { // 登录签名用
		const char* loginKey = "3420891zcqEAD21r";
		memcpy(lpuKey, loginKey, 16);
	} else if (iFlag == 1) {
		*((uint32*) lpuKey) = 23105;
		*((uint32*) (lpuKey + 4)) = 50938;
		*((uint32*) (lpuKey + 8)) = 27672;
		*((uint32*) (lpuKey + 12)) = 20693;
	}
	return lpuKey;
}

//-------------------------------------------------------------------------------------------
IInterface* CreateInterface(const TQGUID& IGUID) {
	IInterface* lpInterface = NULL;
	if (IGUID == IUID_ISM_WEB_SVR) {
		lpInterface = new Script::DynSMWebSvr;
	} else {
		assert(false);
	}

	if (lpInterface != NULL) {
		lpInterface->SetIUID(IGUID);
	}
	return lpInterface;
}

//-------------------------------------------------------------------------------------------
void DestroyInterface(IInterface** lplpInterface) {
	if (lplpInterface && *lplpInterface) {
		if ((*lplpInterface)->GetIUID() == IUID_ISM_WEB_SVR) {
			Script::DynSMWebSvr* lpObj = (Script::DynSMWebSvr*) (*lplpInterface);
			delete lpObj;
		} else {
			assert(false);
		}
		(*lplpInterface) = NULL;
	}
}

namespace Script {
DynSMWebSvr* g_lpobjScriptApp = NULL;

void UnRefUserData(const UserDataObject* lpCObject) {
	UserDataObject* lpObject = const_cast<UserDataObject*>(lpCObject);
	if (lpObject == NULL)
		return;
	lua_State* lpLuaState = GameSys::Instance()->GetLuaState();
	if (lpLuaState == NULL)
		return;
	int iStacktop = lua_gettop(lpLuaState);
	long iRef = reinterpret_cast<long>(lpObject->GetUserData(0));
	if (iRef > 0) {
		lua_unref(lpLuaState, iRef);
	}

	iRef = reinterpret_cast<long>(lpObject->GetUserData(1));
	if (iRef > 0) {
		lua_unref(lpLuaState, iRef);
	}
	assert(lua_gettop(lpLuaState) == iStacktop);
}

/** 注册一个事件触发脚本
 @param wnd
 处理该事件的窗体对象,在此处为NULL
 @param eventid
 处理的事件id
 @param fromid
 处理的起始的命令id
 @param toid
 处理的终止的命令id
 @param self  [可选参数]
 回调脚本函数的属主table,该参数可以不传入,如果传入,在触发回调函数时,会把它作为首个参数传入
 例如 def xxx.fun(self, ...)
 @param fun
 被回调的脚本函数
 */
static int SC_AppEvtRegister(lua_State* lpLuaState) {
	int iStacktop = lua_gettop(lpLuaState);
	int iEvtId = (int) lua_tonumber(lpLuaState, 2);
	object_id iFromId = (object_id) lua_tonumber(lpLuaState, 3);
	object_id iToId = (object_id) lua_tonumber(lpLuaState, 4);
	int iSelfRef = 0;
	int iFunRef = 0;
	TQHANDLE handle = NULL;
	UserDataObject objUserData;
	IEventHandler* lpHandler = NULL;

	// 获得self
	if (iStacktop == 6) {
		lua_pushvalue(lpLuaState, -2);
		if (lua_isnil(lpLuaState, -1)) {
			goto error_end;
		}
		iSelfRef = lua_ref(lpLuaState, true);
		assert(iSelfRef > 0);
		if (iSelfRef <= 0) {
			goto error_end;
		}
	}

	// 获得fun
	lua_pushvalue(lpLuaState, -1);
	if (lua_isnil(lpLuaState, -1)) {
		goto error_end;
	}
	iFunRef = lua_ref(lpLuaState, true);
	assert(iFunRef > 0);
	if (iFunRef <= 0) {
		goto error_end;
	}

	lpHandler = (IEventHandler*) g_lpobjScriptApp->GetTopEventHandler();
	if (lpHandler == NULL) {
		goto error_end;
	}

	objUserData.SetUserData(0, reinterpret_cast<void*>(iSelfRef));
	objUserData.SetUserData(1, reinterpret_cast<void*>(iFunRef));
	objUserData.SetUnRefFun(UnRefUserData);
	handle = lpHandler->Register(iFromId, iToId, (EEventType) iEvtId,
			DelegationEvent(g_lpobjScriptApp, &DynSMWebSvr::OnOneEvent),
			&objUserData);
	if (handle == NULL) {
		goto error_end;
	}
	assert(lua_gettop(lpLuaState) == iStacktop);
	lua_pushinteger(lpLuaState, reinterpret_cast<long>(handle));
	return 1;

	error_end:

	if (iFunRef > 0) {
		lua_unref(lpLuaState, iFunRef);
	}

	if (iSelfRef > 0) {
		lua_unref(lpLuaState, iSelfRef);
	}

	lua_settop(lpLuaState, iStacktop);
	lua_pushnil(lpLuaState);
	return 1;
}

static int SC_AppEvtUnRegister(lua_State* lpLuaState) {
	TQHANDLE handle = reinterpret_cast<TQHANDLE>((int) lua_tonumber(lpLuaState,
			2));
	if (handle == NULL)
		return 0;
	IEventHandler* lpHandler =
			(IEventHandler*) g_lpobjScriptApp->GetTopEventHandler();
	if (lpHandler == NULL)
		return 0;
	lpHandler->UnRegister(handle);
	return 0;
}

static int SC_IsDebug(lua_State* lpLuaState) {
#ifdef DEBUG
	lua_pushboolean(lpLuaState, 1);
#else
	lua_pushboolean(lpLuaState, 0);
#endif // DEBUG
	return 1;
}

static int SC_Log(lua_State* lpLuaState) {
	int iStacktop = lua_gettop(lpLuaState);
	assert(iStacktop == 1);
	const char* lpszMsg = lua_tostring(lpLuaState, -1);
	if (lpszMsg != NULL) {
		LOG("COM", lpszMsg);
	}
	return 0;
}

static int SC_LogEx(lua_State* lpLuaState) {
	int iStacktop = lua_gettop(lpLuaState);
	assert(iStacktop == 2);
	const char* lpszType = lua_tostring(lpLuaState, 1);
	const char* lpszMsg = lua_tostring(lpLuaState, 2);
	if (lpszType != NULL && lpszMsg != NULL) {
		LOG(lpszType, lpszMsg);
	}
	return 0;
}

static int SC_DecodeSig(lua_State* lpLuaState) {
	const char* lpszHex = lua_tostring(lpLuaState, -1);
	char szOutBuf[4096];
	szOutBuf[0] = '\0';
	if (lpszHex != NULL) {
		uchar szOutBufTmp[4096];
		int iOutBufTmpLen = sizeof(szOutBufTmp);
		Net::DataProcessor::HexCharsToBins(szOutBufTmp, &iOutBufTmpLen, lpszHex,
				strlen(lpszHex));

		uchar aucKey[16];
		GetInnerKey(0, aucKey);
		int iOutBufLen = sizeof(szOutBuf) - 1;
		if (Net::DataProcessor::Decrypt(szOutBufTmp, iOutBufTmpLen, aucKey,
				(uchar *) szOutBuf, &iOutBufLen)) {
			szOutBuf[iOutBufLen] = '\0';
		}
	}
	lua_pushstring(lpLuaState, szOutBuf);
	return 1;
}

static int SC_GetScriptPub(lua_State* lpLuaState) {
	IScriptPub* scriptpub = GameSys::Instance()->GetScriptPub();
	tolua_pushusertype(lpLuaState, (void*) scriptpub, "IScriptPub");
	return 1;
}

static int SC_GetGridsManager(lua_State* lpLuaState) {
	IGridsManager* gridsMgr = GameSys::Instance()->GetGridsManager();
	tolua_pushusertype(lpLuaState, (void*) gridsMgr, "IGridsManager");
	return 1;
}

static int SC_GetRankManager(lua_State* lpLuaState) {
	IRankManager* rankMgr = GameSys::Instance()->GetRankManager();
	tolua_pushusertype(lpLuaState, (void*) rankMgr, "IRankManager");
	return 1;
}

static int SC_GetProxyServer(lua_State* lpLuaState) {
	IProxyServer* proxyServer = GameSys::Instance()->GetProxyServer();
	tolua_pushusertype(lpLuaState, (void*) proxyServer, "IProxyServer");
	return 1;
}

static int SC_GetScriptSys(lua_State* lpLuaState) {
	IScriptSys* scriptsys = GameSys::Instance()->GetScriptSys();
	tolua_pushusertype(lpLuaState, (void*) scriptsys, "IScriptSys");
	return 1;
}

inline int GetScriptObjectRef(lua_State* lpLuaState, int top) {
	int selfref = 0;
	lua_pushvalue(lpLuaState, top);
	if (lua_isnil(lpLuaState, -1)) {
		return selfref;
	}

	selfref = lua_ref(lpLuaState, true);
	assert(selfref > 0);
	if (selfref <= 0) {
		return selfref;
	}
	return selfref;
}

static int SC_PrintTimer(lua_State* lpLuaState) {
	ITimerQueue* timerQueue = GameSys::Instance()->GetTimerQueue();
	timerQueue->Print();
	return 0;
}

/**
 @param playerid
 @param connid
 @param eventid
 @param elapse
 @param param1
 @param param2
 @return null
 */
static int SC_SetTimer(lua_State* lpLuaState) {
	object_id playerid = (object_id) lua_tonumber(lpLuaState, 1);
	int connid = (int) lua_tonumber(lpLuaState, 2);
	int eventid = (int) lua_tonumber(lpLuaState, 3);
	lua_Number elapse = lua_tonumber(lpLuaState, 4);
	if (elapse < 0) {
		elapse = 0;
	} else if (elapse > 0xffffffff) {
		elapse = 0xffffffff;
	}
	int64 param1 = (int64) lua_tonumber(lpLuaState, 5);
	int64 param2 = (int64) lua_tonumber(lpLuaState, 6);
	ITimerQueue* timerQueue = GameSys::Instance()->GetTimerQueue();
	IScriptPub* scriptPub = GameSys::Instance()->GetScriptPub();
	TimerUserData* userdata = scriptPub->AllocTimerUserData();
	userdata->playerid = playerid;
	userdata->connid = connid;
	userdata->param1 = param1;
	userdata->param2 = param2;
	TQHANDLE hdr = timerQueue->SetTimer(eventid, (void*) userdata,
			(uint32) elapse, &g_scriptTimer);
	if (hdr == NULL) {
		scriptPub->FreeTimerUserData(userdata);
	}
	int* hdrPtr = (int*) (&hdr);
	int ihdr = *(hdrPtr);
	lua_pushnumber(lpLuaState, ihdr);
	return 1;
}

/**
 @param timerHdr
 */
static int SC_KillTimer(lua_State* lpLuaState) {
	int ihdr = (int) lua_tonumber(lpLuaState, 1);
	ITimerQueue* timerQueue = GameSys::Instance()->GetTimerQueue();

	TQHANDLE * hdrPtr = (TQHANDLE*) (&ihdr);
	TQHANDLE hdr = *(hdrPtr);
	TimerUserData* userdata = (TimerUserData*) timerQueue->GetUserData(hdr);
	IScriptPub* scriptPub = GameSys::Instance()->GetScriptPub();
	if (userdata != NULL) {
		scriptPub->FreeTimerUserData(userdata);
	}
	timerQueue->KillTimer(hdr);
	return 0;
}

/**
 */
static int SC_StartTimer(lua_State* lpLuaState) {
	int argIdx = 1;
	int keyIdCnt = (int) lua_tonumber(lpLuaState, argIdx++);

	TIMER_IDS ids;
	ids.keyCount = keyIdCnt;
	int i = 0;
	for (i = 0; i < TIMER_IDS_COUNT; ++i) {
		ids.ids[i] = (uint32) lua_tonumber(lpLuaState, argIdx++);
	}

	lua_Number elapse = lua_tonumber(lpLuaState, argIdx++);
	if (elapse < 0) {
		elapse = 0;
	} else if (elapse > 0xffffffff) {
		elapse = 0xffffffff;
	}

	TIMER_PARAMS params;
	for (i = 0; i < TIMER_PARAMS_COUNT; ++i) {
		params.ps[i] = (uint32) lua_tonumber(lpLuaState, argIdx++);
	}

	ITimerQueueEx* timerQueue = GameSys::Instance()->GetTimerQueueEx();
	timerQueue->Start(keyIdCnt, &ids, (uint32) elapse, &params,
			&g_scriptTimerEx);
	return 0;
}

static int SC_StopTimer(lua_State* lpLuaState) {
	ITimerQueueEx* timerQueue = GameSys::Instance()->GetTimerQueueEx();
	timerQueue->Stop();
	return 0;
}

static int SC_StopServer(lua_State* lpLuaState) {
	exit(0);
	return 0;
}


void ScriptTimerEx::OnTimer(const TIMER_IDS* ids, const TIMER_PARAMS* params,
		uint32 curTimeMs) {
	lua_State* ls = GameSys::Instance()->GetLuaState();
	lua_getglobal(ls, "c_onTimer");
	int i = 0, cnt = 0;
	for (i = 0; i < TIMER_IDS_COUNT; ++i) {
		lua_pushnumber(ls, ids->ids[i]);
		cnt++;
	}
	for (i = 0; i < TIMER_PARAMS_COUNT; ++i) {
		lua_pushnumber(ls, params->ps[i]);
		cnt++;
	}
	lua_pushnumber(ls, curTimeMs);
	cnt++;

	int status = lua_pcall(ls, cnt, 0, 0);
	if (status != 0) {
		HandleLuaErrorStatus(ls);
	}
}

static int SC_GetTimerInfo(lua_State* lpLuaState) {
	int ihdr = (int) lua_tonumber(lpLuaState, 1);
	TQHANDLE * hdrPtr = (TQHANDLE*) (&ihdr);
	TQHANDLE hdr = *(hdrPtr);

	if (hdr != NULL) {
		ITimerQueue* timerQueue = GameSys::Instance()->GetTimerQueue();
		TimerUserData* userdata = (TimerUserData*) timerQueue->GetUserData(hdr);

		lua_pushnumber(lpLuaState, userdata->playerid);
		lua_pushnumber(lpLuaState, userdata->connid);
		lua_pushnumber(lpLuaState, userdata->param1);
		lua_pushnumber(lpLuaState, userdata->param2);
	} else {
		lua_pushnumber(lpLuaState, 0);
		lua_pushnumber(lpLuaState, 0);
		lua_pushnumber(lpLuaState, 0);
		lua_pushnumber(lpLuaState, 0);
	}

	return 4;
}

inline int attrs_comp(const void *a, const void *b) {
	return ((SAttr*) a)->usAttr - ((SAttr*) b)->usAttr;
}

static int SC_SortAttrs(lua_State* luaState) {
	SAttr* arrays = ((SAttr*) tolua_tousertype(luaState, 1, 0));
	int len = ((int) lua_tonumber(luaState, 2));
	qsort(arrays, len, sizeof(SAttr), attrs_comp);
	return 0;
}

DynSMWebSvr::DynSMWebSvr() :
		m_lpLuaState(NULL), m_lastTimeMs(0) {
	INIT_TQINTERFACE()
	INIT_IEVENTHANDLERMGR()
	g_lpobjScriptApp = this;
}

DynSMWebSvr::~DynSMWebSvr() {
}

bool DynSMWebSvr::OnOneTimeInit() {
	if (m_lpGameSys == NULL) {
		return false;
	}

	GameSys::Instance()->Set(m_lpGameSys);
	ILogSys* lpLogSys = static_cast<ILogSys*>(m_lpGameSys->GetUserData(
			"ILogSys"));
	if (lpLogSys == NULL) {
		return false;
	}
	LOG_INIT(lpLogSys);
	return true;
}

bool DynSMWebSvr::InitScriptEnvironment(IScriptSys* lpScriptSys,
		void* lpScriptEnv) {
	assert(lpScriptEnv != NULL);
	if (lpScriptEnv == NULL) {
		return false;
	}

	m_lpLuaState = reinterpret_cast<lua_State*>(lpScriptEnv);
	GameSys::Instance()->SetLuaState(m_lpLuaState);

	//lua_initStaticObject(m_lpLuaState);

	RegisterLuaFun(m_lpLuaState);

	m_lpEvtHandler =
			static_cast<IEventHandler*>(GameSys::Instance()->Get()->CreateAndInitInterface(
					IUID_IEVENTHANDLER));
	assert(m_lpEvtHandler!=NULL);
	if (m_lpEvtHandler == NULL) {
		return false;
	}

	m_lpEvtHandler->Init(1024, EEHF_NOT_LOCK);

	return true;
}

void DynSMWebSvr::RegisterLuaFun(lua_State* lpLuaState) {
	if (lpLuaState != NULL) {
		tolua_tqAllTolua_open(lpLuaState);

		lua_register(lpLuaState, "PrintTimer", SC_PrintTimer);
		lua_register(lpLuaState, "SetTimer", SC_SetTimer);
		lua_register(lpLuaState, "KillTimer", SC_KillTimer);
		lua_register(lpLuaState, "GetTimerInfo", SC_GetTimerInfo);
		lua_register(lpLuaState, "SortAttrs", SC_SortAttrs);
		lua_register(lpLuaState, "AppEvtRegister", SC_AppEvtRegister);
		lua_register(lpLuaState, "AppEvtUnRegister", SC_AppEvtUnRegister);
		lua_register(lpLuaState, "IsDebug", SC_IsDebug);
		lua_register(lpLuaState, "LOG", SC_Log);
		lua_register(lpLuaState, "LOGEX", SC_LogEx);
		lua_register(lpLuaState, "DecodeSig", SC_DecodeSig);
		lua_register(lpLuaState, "GetScriptPub", SC_GetScriptPub);
		lua_register(lpLuaState, "GetScriptSys", SC_GetScriptSys);
		lua_register(lpLuaState, "GetGridsManager", SC_GetGridsManager);
		lua_register(lpLuaState, "GetRankManager", SC_GetRankManager);
		lua_register(lpLuaState, "GetProxyServer", SC_GetProxyServer);
		lua_register(lpLuaState, "StartTimer", SC_StartTimer);
		lua_register(lpLuaState, "StopTimer", SC_StopTimer);
		lua_register(lpLuaState, "StopServer", SC_StopServer);
	}
}

void DynSMWebSvr::OnEvent(SEvent& stEvent) {
	IEventHandler* handler = m_lpEvtHandler;
	while (handler) {
		handler->ProcessEvent(stEvent);
		if (stEvent.IsSkiped()) {
			return;
		}
		handler = const_cast<IEventHandler*>(handler->GetNextHandler());
	}

	SendEventToScript(stEvent);
}

void DynSMWebSvr::OnOneEvent(SEvent& stEvent) {
	long iSelfRef = reinterpret_cast<long>(stEvent.userData.GetUserData(0));
	long iFunRef = reinterpret_cast<long>(stEvent.userData.GetUserData(1));
	lua_State* lpLuaState = GameSys::Instance()->GetLuaState();
	if (lpLuaState != NULL && iFunRef > 0) {
		int iParamCount = 1;
		int iStacktop = lua_gettop(lpLuaState);
		lua_getref(lpLuaState, iFunRef);
		//lua_clearfunself(lpLuaState, -1);
		if (iSelfRef > 0) {
			// 如果存在self,则传入self为首个参数
			lua_getref(lpLuaState, iSelfRef);
			iParamCount = 2;
		}
		tolua_pushusertype(lpLuaState, &stEvent, "SEvent");
		int iStatus = lua_pcall(lpLuaState, iParamCount, 0, 0);
		if (iStatus != 0) {
			HandleLuaErrorStatus(lpLuaState);
		}
		assert(lua_gettop(lpLuaState) == iStacktop);
	}
}

void DynSMWebSvr::OnUpdate(uint32 timeMs) {
	UpdateScript(timeMs);
}

void DynSMWebSvr::SendEventToScript(SEvent& stEvent) {
	lua_State* ls = GameSys::Instance()->GetLuaState();
	if (ls == NULL)
		return;

	lua_getglobal(ls, "c_onCmd");
	tolua_pushusertype(ls, &stEvent, "SEvent");
	int iStatus = lua_pcall(ls, 1, 0, 0);
	if (iStatus != 0) {
		HandleLuaErrorStatus(ls);
	}
}

void DynSMWebSvr::UpdateScript(uint32 timeMs) {
	if (timeMs - m_lastTimeMs < 100) // 100ms 更新一次
		return;
	m_lastTimeMs = timeMs;

	lua_State* ls = GameSys::Instance()->GetLuaState();
	if (ls == NULL)
		return;

	lua_getglobal(ls, "c_onUpdate");
	lua_pushnumber(ls, timeMs);
	int status = lua_pcall(ls, 1, 0, 0);
	if (status != 0) {
		HandleLuaErrorStatus(ls);
	}
}

} // end namespace Script

