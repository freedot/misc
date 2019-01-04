/*
 * ScriptSys.cpp
 *
 *  Created on: 2013-3-8
 *      Author: qujianbiao
 */

#include "ScriptSys.h"

//====================================================================================================
IInterface* CreateInterface(const TQGUID& guid) {
	IInterface* interFace = NULL;

	if (guid == IUID_ISCRIPTSYS) {
		interFace = new Script::ScriptSys;
	}

	if (interFace != NULL) {
		interFace->SetIUID(guid);
	}

	return interFace;
}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;

	if ((*interFace)->GetIUID() == IUID_ISCRIPTSYS) {
		Script::ScriptSys* lpScriptSys = (Script::ScriptSys*) (*interFace);
		delete lpScriptSys;
	}

	(*interFace) = NULL;

}

//====================================================================================================
namespace Script {
ScriptSys::ScriptSys() {
	INIT_TQINTERFACE()
	;
	m_lpLuaState = NULL;
	m_bError = true;
	m_bInit = false;
	m_bInitForClass = false;
	m_ulDebuggerLastTime = 0;
	m_lpFileManager = NULL;
	m_iScriptBufLen = 4096;
	m_lpScriptBuf = new char[m_iScriptBufLen];
	memset(m_szError, 0, sizeof(m_szError));
}

ScriptSys::~ScriptSys() {
	m_vctModules.clear();
	SafeDeleteArray(m_lpScriptBuf);
}

void ScriptSys::ClearLoaded() {
	m_mapLoaded.clear();
}

bool ScriptSys::AddScriptModule(const IScriptModule* lpScriptModule) {
	SScriptModule stModule;
	stModule.lpModule = const_cast<IScriptModule*>(lpScriptModule);
	if (m_bInit) {
		if (!stModule.lpModule->InitScriptEnvironment(this,
				reinterpret_cast<void*>(m_lpLuaState))) {
			return false;
		}
		stModule.bInit = true;
	}
	m_vctModules.push_back(stModule);

	return true;
}

void ScriptSys::AddSysPath(const char* lpszPath) {
	if (lpszPath != NULL) {
		m_vctPaths.push_back(lpszPath);
	}
	InitForClass();
}

bool ScriptSys::RunScriptFromFile(const char* lpszName) {
	if (LoadScriptFromFile(lpszName) != 0) {
		return false;
	}

	int iStatus = LuaPCall();
	if (iStatus != 0) {
		return false;
	}
	return true;
}

int ScriptSys::LoadScriptFromFile(const char* lpszName) {
	char szFileName[MAX_PATH];
	char szFullFileName[MAX_PATH];
	bool bMatchOk = false;
	Buildfilename(szFileName, MAX_PATH, lpszName);
	StdVctPathsIter iter = m_vctPaths.begin();
	for (; iter != m_vctPaths.end(); ++iter) {
		Matchfilename(szFullFileName, MAX_PATH, szFileName, (*iter).c_str());
		// 判断当前文件是否存在
		if (m_lpFileManager->IsFileExist(szFullFileName,
				IO::FLAG_FILE_PACKAGE | IO::FLAG_FILE_RAW)) {
			bMatchOk = true;
			break;
		}
	}

	if (!bMatchOk) {
		return 1;
	}

	uint64 uiModifyTime = m_lpFileManager->GetFileModifyTime(szFullFileName);

	// 打开该文件
	IO::IFile* lpFile = m_lpFileManager->OpenFile(szFullFileName, "rb");
	if (lpFile == NULL) {
		return 1;
	}

	int iFileSize = lpFile->GetLength();
	int iLen = iFileSize;

	char* lpScriptContent = NULL;
	bool bBinaryFlag = false;

	// 读取该文件的内容
	if (m_iScriptBufLen <= iLen) {
		SafeDeleteArray(m_lpScriptBuf);
		m_iScriptBufLen = ((iLen + 1) + 4095) / 4096 * 4096;
		m_lpScriptBuf = new char[m_iScriptBufLen];
	}

	lpFile->Read(m_lpScriptBuf, sizeof(char), iLen);
	m_lpScriptBuf[iLen] = '\0';
	m_lpFileManager->Close(&lpFile);
	SLoadedNode& stLoadedNode = m_mapLoaded[szFullFileName];
	stLoadedNode.iFileSize = iFileSize;
	stLoadedNode.uiModifyTime = uiModifyTime;

	lpScriptContent = m_lpScriptBuf;

	// 文件类型标识
	if (iLen >= 3) {
		// utf8
		if ((uchar) (m_lpScriptBuf[0]) == 0xEF
				&& (uchar) (m_lpScriptBuf[1]) == 0xBB
				&& (uchar) (m_lpScriptBuf[2]) == 0xBF) {
			lpScriptContent += 3;
			iLen -= 3;
		}
	} else if (iLen >= 8) {
		// 二进制加密文件
	}

	// class 的支持,只转义文本格式的script,
	// 对于2进制的在编译工具中就进行了转义
	if (m_bInitForClass && !bBinaryFlag) {
		lua_getglobal(m_lpLuaState, "tran_to_class");
		if (lua_isfunction(m_lpLuaState, -1)) {
			lua_pushstring(m_lpLuaState, lpScriptContent);
			lua_pushstring(m_lpLuaState, szFullFileName);
			int iStatus = lua_pcall(m_lpLuaState, 2, 1, 0);
			if (iStatus == 0) {
				const char* lpSBuf = lua_tostring(m_lpLuaState, -1);
				assert(lpSBuf!=NULL);
				iLen = strlen(lpSBuf);
				if (m_iScriptBufLen <= iLen) {
					SafeDeleteArray(m_lpScriptBuf);
					m_iScriptBufLen = ((iLen + 1) + 4095) / 4096 * 4096;
					m_lpScriptBuf = new char[m_iScriptBufLen];
				}
				SafeStrCpy(m_lpScriptBuf, lpSBuf, m_iScriptBufLen);
				lpScriptContent = m_lpScriptBuf;
				lua_pop(m_lpLuaState, 1);
			} else {
				m_bError = true;
				SafeStrCpy(m_szError, lua_tostring(m_lpLuaState, -1),
						sizeof(m_szError));
				lua_pop( m_lpLuaState, 1);
				PrintError();
				return -1;
			}
		}
	}

	int iStatus = luaL_loadbuffer(m_lpLuaState, lpScriptContent, iLen,
			szFullFileName);
	if (iStatus != 0) {
		m_bError = true;
		SafeStrCpy(m_szError, lua_tostring(m_lpLuaState, -1),
				sizeof(m_szError));
		lua_pop( m_lpLuaState, 1);
		PrintError();
	}
	return iStatus;
}

int ScriptSys::RunScriptString(const char* lpScriptString) {
	int iStatus = luaL_loadstring(m_lpLuaState, lpScriptString);
	if (iStatus == 0) {
		iStatus = LuaPCall();
	}

	return iStatus;
}

const char* ScriptSys::GetLastError() const {
	return m_szError;
}

void ScriptSys::InitForClass() {
	if (!m_bInitForClass) {
		if (RunScriptFromFile("script/com/tqClassLex")) {
			m_bInitForClass = true;
		}

		if (!m_bInitForClass) {
			if (RunScriptFromFile("tqClassLex")) {
				m_bInitForClass = true;
			}
		}
	}
}

bool ScriptSys::OnOneTimeInit() {
	m_lpLuaState = lua_open();
	//lua_initStaticObject(m_lpLuaState);
	luaL_openlibs(m_lpLuaState);

	m_lpFileManager =
			reinterpret_cast<IO::IFileManager*>(m_lpGameSys->GetUserData(
					"IFileManager"));
	assert(m_lpFileManager!=NULL);
	if (m_lpFileManager == NULL) {
		return false;
	}

	// 初始化脚本对class的支持
	InitForClass();

	// 初始化所有脚本模块
	StdVctModuleIter iterSet = m_vctModules.begin();
	for (; iterSet != m_vctModules.end(); ++iterSet) {
		SScriptModule& stModule = (*iterSet);
		if (!stModule.bInit) {
			if (stModule.lpModule->InitScriptEnvironment(this,
					reinterpret_cast<void*>(m_lpLuaState))) {
				stModule.bInit = true;
			}
		}
	}

	m_bInit = true;
	return true;
}

void ScriptSys::OnOneTimeRelease() {
	// 释放所有脚本模块
	StdVctModuleIter iterSet = m_vctModules.begin();
	for (; iterSet != m_vctModules.end(); ++iterSet) {
		SScriptModule& stModule = (*iterSet);
		if (stModule.bInit) {
			stModule.lpModule->OnOneTimeRelease();
			stModule.bInit = false;
		}
	}

	lua_close(m_lpLuaState);
	m_lpLuaState = NULL;
}

void ScriptSys::OnUpdate(uint32 ulTimeMs) {
	StdVctModuleIter iter = m_vctModules.begin();
	for (; iter != m_vctModules.end(); ++iter) {
		if ((*iter).lpModule != NULL) {
			(*iter).lpModule->OnUpdate(ulTimeMs);
		}
	}
}

int ScriptSys::LuaPCall() {
	int iStatus = lua_pcall(m_lpLuaState, 0, LUA_MULTRET, 0);
	if (iStatus != 0) {
		m_bError = true;
		SafeStrCpy(m_szError, lua_tostring(m_lpLuaState, -1),
				sizeof(m_szError));
		lua_pop( m_lpLuaState, 1);
		PrintError();
	}

	return iStatus;
}

void ScriptSys::PrintError() {
#ifdef WIN32
	static bool s_bCall = false;
	if (!s_bCall) {
		FILE* fp = fopen("./error.log", "w");
		if (fp != NULL) {
			fprintf(fp, "%s", m_szError);
			fclose(fp);
		}

		char szParam[4096];
		SafeStrCpy(szParam, "notepad.exe ./error.log", sizeof(szParam));
		WinExec(szParam, SW_SHOWNORMAL);
		s_bCall = true;
	}

	// 调用lua的print
	lua_getglobal(m_lpLuaState, "print");
	if (lua_isfunction(m_lpLuaState, -1)) {
		lua_pushstring(m_lpLuaState, m_szError);
		lua_call(m_lpLuaState, 1, 0);
	}
#else
	std::cerr << m_szError << std::endl;
#endif
}

void ScriptSys::Buildfilename(char* lpFileName, int iBufLen,
		const char* lpszName) {
	char szFName[3 * MAX_PATH + 1];
	SafeStrCpy(szFName, lpszName, sizeof(szFName));
	bool bStartFlag = false;
	lpFileName[0] = 0;
	char* lpszOne = strtok((char*) szFName, ".");
	while (lpszOne) {
		if (bStartFlag) {
			SafeStrCat(lpFileName, "/", iBufLen);
		}
		SafeStrCat(lpFileName, lpszOne, iBufLen);
		bStartFlag = true;
		lpszOne = strtok(NULL, ".");
	}
}

void ScriptSys::Matchfilename(char* lpFileName, int iBufLen,
		const char* lpszName, const char* lpModePath) {
	int iPos = 0;
	int iModeLen = strlen(lpModePath);
	int iNameLen = strlen(lpszName);
	for (int i = 0; i < iModeLen; ++i) {
		if (iPos == iBufLen - 1) {
			break;
		}

		if (*(lpModePath + i) != '?') {
			*(lpFileName + iPos++) = *(lpModePath + i);
		} else {
			if (iNameLen + iPos >= iBufLen - 1) {
				int iLeftLen = iBufLen - 1 - iPos;
				memcpy(lpFileName + iPos, lpszName, iLeftLen);
				iPos += iLeftLen;
				break;
			} else {
				memcpy(lpFileName + iPos, lpszName, iNameLen);
				iPos += iNameLen;
			}
		}
	}

	*(lpFileName + iPos) = '\0';
}

} // end namespace Script
