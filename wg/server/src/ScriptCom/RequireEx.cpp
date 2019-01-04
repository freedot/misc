#include "RequireEx.h"
#include <assert.h>
#include <IScriptSys.h>

/** 自定义的require函数
 @param lpszFilename
 文件名称
 */
static void loaderror(lua_State *L, const char *filename) {
	luaL_error(L, "error loading module " LUA_QS " from file " LUA_QS ":\n\t%s",
			lua_tostring(L, 1), filename, lua_tostring(L, -1));
}

/** 自定义的loader_My函数
 @param lpszFilename
 文件名称
 */
static int loader_My(lua_State *L) {
	Script::IScriptSys* lpScriptSys =
			reinterpret_cast<Script::IScriptSys*>(GameSys::Instance()->Get()->GetUserData(
					"IScriptSys"));
	if (lpScriptSys == NULL) {
		return 1;
	}

	const char *lpszName = luaL_checkstring(L, -1);
	int iRet = lpScriptSys->LoadScriptFromFile(lpszName);
	if (iRet == 1) {
		return 1;
	}

	if (iRet != 0) {
		loaderror(L, lpszName);
	}

	if (iRet == 0) {

	}

	return 1;
}

/** 安装自定义的require函数RequireEx
 */
int InstallRequireEx(lua_State *L) {
	int iOldTop = lua_gettop(L);
	lua_getglobal(L, "require");
	lua_getfenv(L, -1);
	lua_getfield(L, -1, "loaders");
	if (lua_istable(L, -1)) {
		lua_pushcfunction(L, loader_My);
		//将默认的 loader_Lua 替换掉
		//{loader_preload, loader_Lua, loader_C, loader_Croot, NULL};
		lua_rawseti(L, -2, 2);
	}
	lua_pop(L, 1);
	lua_pop(L, 1);
	lua_pop(L, 1);
	assert(iOldTop == lua_gettop(L));
	return 0;
}
