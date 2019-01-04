#include "DynSMCom.h"
#include <tinyxml/tinyxml.h>
#include <map>
#include <string>
#include <ILuaInterfaceCallBack.h>
//#include <ISimStateManager.h>
DECLARE_DLLMAIN()

extern "C" {
#include <lua/lua.h>
#include <lua/lauxlib.h>
#include <lua/lualib.h>
#include <lua/tolua++.h>
#include <lua/luaex.h>
}

#include "LuaXml.h"
#include "RequireEx.h"
#include "LuaMath.h"

//-------------------------------------------------------------------------------------------
IInterface* CreateInterface(const TQGUID& IGUID) {
	IInterface* lpInterface = NULL;

	if (IGUID == IUID_ISMCOM) {
		lpInterface = new Script::DynSMCom;
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
		if ((*lplpInterface)->GetIUID() == IUID_ISMCOM) {
			Script::DynSMCom* lpObj = (Script::DynSMCom*) (*lplpInterface);
			delete lpObj;
		} else {
			assert(false);
		}
		(*lplpInterface) = NULL;
	}
}

namespace Script {
void UnRefUserData(const UserDataObject* lpCObject) {
	UserDataObject* lpObject = const_cast<UserDataObject*>(lpCObject);
	if (lpObject != NULL) {
		lua_State* lpLuaState = GameSys::Instance()->GetLuaState();
		if (lpLuaState != NULL) {
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
	}
}

//----------------------------------------------------------------------------------------------------
/** 设置一个监听接口的回调脚本
 @param interface
 监听接口对象
 @param strFunkey
 将要监听的函数key值
 @param self  [可选参数]
 回调脚本函数的属主table,该参数可以不传入,如果传入,在触发回调函数时,会把它作为首个参数传入
 例如 def xxx.fun(self, ...)
 @param fun
 被回调的脚本函数
 */
static int InterfaceSetCallBack(lua_State* lpLuaState) {
	int iStacktop = lua_gettop(lpLuaState);

	// 奇怪的写法，看有没有好的方法？
	char* lpPtr = (char*) tolua_tousertype(lpLuaState, 1, 0) + sizeof(void*);
	ILuaInterfaceCallBack* lpCallBack = (ILuaInterfaceCallBack*) (lpPtr);

	const char* lpszKey = lua_tostring(lpLuaState, 2);
	int iSelfRef = 0;
	int iFunRef = 0;
	UserDataObject objUserData;
	if (lpCallBack == NULL) {
		goto error_end;
	}

	if (lpszKey == NULL) {
		goto error_end;
	}

	// 获得self
	if (iStacktop == 4) {
		lua_pushvalue(lpLuaState, -2);
		if (lua_isnil(lpLuaState, -1)) {
			goto error_end;
		}
		iSelfRef = lua_ref(lpLuaState, true);
		assert(iSelfRef>0);
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
	assert(iFunRef>0);
	if (iFunRef <= 0) {
		goto error_end;
	}

	objUserData.SetUserData(0, reinterpret_cast<void*>(iSelfRef));
	objUserData.SetUserData(1, reinterpret_cast<void*>(iFunRef));
	objUserData.SetUnRefFun(UnRefUserData);
	lpCallBack->SetCallBack(lpszKey, objUserData);

	assert(lua_gettop(lpLuaState) == iStacktop);

	return 0;

	error_end: if (iFunRef > 0) {
		lua_unref(lpLuaState, iFunRef);
	}

	if (iSelfRef > 0) {
		lua_unref(lpLuaState, iSelfRef);
	}

	lua_settop(lpLuaState, iStacktop);

	assert(false);

	return 0;
}

//----------------------------------------------------------------------------------------------------
static int GetGameSys(lua_State* lpLuaState) {
	IGameSys* lpGameSys = GameSys::Instance()->Get();
	tolua_pushusertype(lpLuaState, lpGameSys, "IGameSys");
	return 1;
}

//----------------------------------------------------------------------------------------------------
DynSMCom::DynSMCom() :
		m_lpLuaState(NULL) {
	INIT_TQINTERFACE()
}

//----------------------------------------------------------------------------------------------------
DynSMCom::~DynSMCom() {
}

//----------------------------------------------------------------------------------------------------
bool DynSMCom::InitScriptEnvironment(IScriptSys* lpScriptSys,
		void* lpScriptEnv) {
	assert(lpScriptEnv != NULL);
	if (lpScriptEnv == NULL) {
		return false;
	}

	m_lpLuaState = reinterpret_cast<lua_State*>(lpScriptEnv);
	GameSys::Instance()->SetLuaState(m_lpLuaState);
	//lua_initStaticObject(m_lpLuaState);
	tolua_open(m_lpLuaState);
	RegisterLuaFun(m_lpLuaState);
	InstallRequireEx(m_lpLuaState);
	return true;
}

//----------------------------------------------------------------------------------------------------
bool DynSMCom::OnOneTimeInit() {
	if (m_lpGameSys == NULL) {
		return false;
	}

	GameSys::Instance()->Set(m_lpGameSys);

	return true;
}

//----------------------------------------------------------------------------------------------------
void DynSMCom::RegisterLuaFun(lua_State* lpLuaState) {
	if (lpLuaState != NULL) {
		luaopen_tqAllTolua(lpLuaState);

		lua_register(lpLuaState, "ParseXmlFile", ParseXmlFile);
		lua_register(lpLuaState, "SaveXmlFile", SaveXmlFile);
		lua_register(lpLuaState, "OR", Math_OR);
		lua_register(lpLuaState, "AND", Math_AND);
		lua_register(lpLuaState, "HEX", Math_HEX);
		lua_register(lpLuaState, "LSHIFT", Math_LSHIFT);
		lua_register(lpLuaState, "RSHIFT", Math_RSHIFT);
		lua_register(lpLuaState, "Point2DInPoly", Math_Point2DInPoly);
		lua_register(lpLuaState, "GetGameSys", GetGameSys);
		lua_register(lpLuaState, "InterfaceSetCallBack", InterfaceSetCallBack);
	}
}

} // end namespace Script

