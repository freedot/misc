#if defined(LUA_UT)

#include <string>
#include <vector>
#include <DllLoader.h>
#include <IScriptSys.h>
#include <ILogSys.h>
#include <IEventHandler.h>
#include "DynSMWebSvr_LuaUT.h"

extern "C" {
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>
#include <tolua++.h>
#include <luaex.h>
}

#include "../GameSvr/IScriptPub.h"
#include "../GameSvr/ScriptPub.h"
#include "../GameSvr/gamesvr.h"

#include "../GameSvr/IGridsManager.h"
#include "../GameSvr/GridsManager.h"

DECLARE_DLLMAIN()

static std::vector<DllLoader> g_dynlibs;
static int g_dynlib_idx = 0;

std::string getDllPath(const char* dllpath) {
	std::string filename = "..\\..\\bin\\";
	filename += dllpath;
	return filename;
}

std::string getFullDllPath(const char* dllpath) {
	std::string filename = getDllPath(dllpath) + DYNLIB_EXT;
	return filename;
}

IInterface* createInterface(const char* dllpath, TQGUID guid) {
	DllLoader& dynlib = g_dynlibs[g_dynlib_idx++];
	if (!dynlib.Load(getFullDllPath(dllpath).c_str())) {
		std::cerr << "load dll 1 " << getFullDllPath(dllpath) << " failed!" << std::endl;
		return NULL;
	}

	CREATEINTERFACE pfnCreate = (CREATEINTERFACE) dynlib.GetSymbol(
			_T("CreateInterface"));
	if (pfnCreate == NULL) {
		std::cerr << "dll " << getFullDllPath(dllpath) << " get CreateInterface failed!" << std::endl;
		return NULL;
	}

	IInterface* obj = pfnCreate(guid);
	if (obj == NULL) {
		return NULL;
	}

	return obj;
}

int luaopen_luaut(lua_State *L) {
	//lua_initStaticObject(L);
	g_dynlibs.resize(32);
	IGameSys* gamesys = reinterpret_cast<IGameSys*>(createInterface(
					"libGameSys", IUID_IGAMESYS));
	if (gamesys == NULL) {
  
		assert(false);
		return 0;
	}

	ILogSys* logsys = reinterpret_cast<ILogSys*>(createInterface("libLogSys",
					IUID_ILOGSYS));
	if (logsys == NULL) {
		assert(false);
		return 0;
	} else {
		gamesys->RegisterUserData("ILogSys", logsys);
	}

	gamesys->RegisterInterface(IUID_IEVENTHANDLER,
			getDllPath("libEventSys").c_str());

	GameSvr* gamesvr = new GameSvr();
	ScriptPub* scriptpub = new ScriptPub();
	scriptpub->SetGameSvr(gamesvr);
	gamesys->RegisterUserData("IScriptPub", scriptpub);

	Script::IScriptModule* module =
	reinterpret_cast<Script::IScriptModule*>(createInterface(
					"libGameScript", IUID_ISM_WEB_SVR));
	if (module == NULL) {
		assert(false);
		return 0;
	}

	module->SetGameSys(gamesys);
	module->OnOneTimeInit();
	module->InitScriptEnvironment(NULL, reinterpret_cast<void*>(L));

	return 1;
}

#endif //LUA_UT
