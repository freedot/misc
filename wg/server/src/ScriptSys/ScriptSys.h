/*
 * ScriptSys.h
 *
 *  Created on: 2013-3-8
 *      Author: qujianbiao
 */

#ifndef SCRIPTSYS_H_
#define SCRIPTSYS_H_
#include <IScriptSys.h>
#include <IUpdateListener.h>
#include <IFile.h>
#include <IFileManager.h>
#include <map>

extern "C"
{
 #include <lua/lua.h>
 #include <lua/lualib.h>
 #include <lua/lauxlib.h>
 #include <lua/tolua++.h>
 #include <lua/luaex.h>
}

namespace Script {

const int c_iScriptErrorLen = 4096;

class ScriptSys: public IScriptSys {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()

public:
	void ClearLoaded();
	bool AddScriptModule(const IScriptModule* lpScriptModule);
	void AddSysPath(const char* lpszPath);
	bool RunScriptFromFile(const char* lpszName);
	int LoadScriptFromFile(const char* lpszName);
	int RunScriptString(const char* lpScriptString);
	const char* GetLastError() const;
	void OnUpdate(uint32 ulTimeMs);
	bool OnOneTimeInit();
	void OnOneTimeRelease();

public:
	ScriptSys();
	virtual ~ScriptSys();

private:
	int LuaPCall();
	void Buildfilename(char* lpFileName, int iBufLen, const char* lpszName);
	void Matchfilename(char* lpFileName, int iBufLen, const char* lpszName,
			const char* lpModePath);
	void InitForClass();
	void PrintError();

private:
	struct SLoadedNode {
		uint64 uiModifyTime;
		int iFileSize;
		SLoadedNode() :
				uiModifyTime(0), iFileSize(0) {
		}
	};

	typedef std::map<std::string, SLoadedNode> StdMapLoaded;
	typedef StdMapLoaded::iterator StdMapLoadedIter;

	struct SScriptModule {
		bool bInit;
		IScriptModule* lpModule;
		SScriptModule() :
				bInit(false), lpModule(NULL) {
		}
	};
	typedef std::vector<SScriptModule> StdVctModule;
	typedef StdVctModule::iterator StdVctModuleIter;

	typedef std::vector<std::string> StdVctPaths;
	typedef StdVctPaths::iterator StdVctPathsIter;

private:
	bool m_bInit;
	lua_State* m_lpLuaState;
	bool m_bError;
	char m_szError[c_iScriptErrorLen];
	uint32 m_ulDebuggerLastTime;
	StdVctModule m_vctModules;
	IO::IFileManager* m_lpFileManager;
	StdVctPaths m_vctPaths;
	StdMapLoaded m_mapLoaded;
	bool m_bInitForClass;
	char* m_lpScriptBuf;
	int m_iScriptBufLen;
};

} /* namespace Script */
#endif /* SCRIPTSYS_H_ */
