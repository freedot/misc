#include "DynSMDbg.h"
DECLARE_DLLMAIN()

extern "C" {
#include <lua/lua.h>
#include <lua/lauxlib.h>
#include <lua/lualib.h>
#include <lua/luaex.h>
}

#include "GameSys.h"
#include "DbgServer.h"
#include "Rdb.h"
#include "DbgConfiger.h"
#include "tqDbgLua.h"

//-------------------------------------------------------------------------------------------
IInterface* CreateInterface(const TQGUID& IGUID) {
	IInterface* lpInterface = NULL;

	if (IGUID == IUID_ISMDBG) {
		lpInterface = new Script::DynSMDbg;
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
		if ((*lplpInterface)->GetIUID() == IUID_ISMDBG) {
			Script::DynSMDbg* lpObj = (Script::DynSMDbg*) (*lplpInterface);
			delete lpObj;
		} else {
			assert(false);
		}
		(*lplpInterface) = NULL;
	}
}

namespace Script {
//----------------------------------------------------------------------------------------------------
static int GetCurStackFrame(lua_State* lpLuaState) {
	lua_pushinteger(lpLuaState, Rdb::Instance()->GetCurStackFrame());
	return 1;
}

//----------------------------------------------------------------------------------------------------
DynSMDbg::DynSMDbg() :
		m_lpLuaState(NULL) {
	INIT_TQINTERFACE()
}

//----------------------------------------------------------------------------------------------------
DynSMDbg::~DynSMDbg() {
}

//----------------------------------------------------------------------------------------------------
bool DynSMDbg::InitScriptEnvironment(IScriptSys* lpScriptSys,
		void* lpScriptEnv) {
	std::clog << "debugger init !" << std::endl;
	assert(lpScriptEnv != NULL);
	if (lpScriptEnv == NULL) {
		return false;
	}

	m_lpLuaState = reinterpret_cast<lua_State*>(lpScriptEnv);
	//lua_initStaticObject(m_lpLuaState);

	std::clog << "debugger reg fun !" << std::endl;
	RegisterLuaFun(m_lpLuaState);
	
	std::clog << "debugger save something !" << std::endl;
// 用来存放调试时函数运行的环境table
	luaL_loadstring(m_lpLuaState, s_szDbgLua);
	if (lua_isfunction(m_lpLuaState, -1)) {
		int iStatus = lua_pcall(m_lpLuaState, 0, 0, 0);
		if (iStatus != 0)
			return false;
	}

	std::clog << "debugger load xml !" << std::endl;
	DbgConfiger::Instance()->Load("debugconfig.xml");
	std::clog << "debugger set state !" << std::endl;
	Rdb::Instance()->SetState(m_lpLuaState);
	std::clog << "debugger start  !" << std::endl;
	DbgServer::Instance()->Start();
	std::clog << "debugger init ok !" << std::endl;
	return true;
}

//----------------------------------------------------------------------------------------------------
bool DynSMDbg::OnOneTimeInit() {
	if (m_lpGameSys == NULL) {
		return false;
	}

	GameSys::Instance()->Set(m_lpGameSys);

	return true;
}

//----------------------------------------------------------------------------------------------------
void DynSMDbg::OnOneTimeRelease() {
	DbgServer::Instance()->Stop();
}

//----------------------------------------------------------------------------------------------------
void DynSMDbg::OnUpdate(uint32 ulTimeMs) {
	if (!DbgServer::Instance()->IsRecvMsgEmpty()) {
		const char* lpszPopMsg = DbgServer::Instance()->RecvMsgTop();
		char szMsg[c_recvbuffer_size];
		SafeStrCpy(szMsg, lpszPopMsg, sizeof(szMsg));
		DbgServer::Instance()->PopRecvMsg();

		Rdb::Instance()->HandleCommand(szMsg);
	}
}

static const struct luaL_reg reg_funs[] = 
{
	{"tqdb_get_curstackframe",	GetCurStackFrame},
	{NULL, NULL}
};

//----------------------------------------------------------------------------------------------------
void DynSMDbg::RegisterLuaFun(lua_State* lpLuaState) {
	if (lpLuaState != NULL) {
		std::clog << "debugger reg fun ... " << lpLuaState << std::endl;
		luaL_openlib(lpLuaState, "object", reg_funs, 0);
		std::clog << "debugger reg fun ok " << std::endl;
	}
}

} // end namespace Script
