/*
 * GameSys.cpp
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#include "GameSys.h"
DECLARE_DLLMAIN()

IInterface* CreateInterface(const TQGUID& IGUID) {
	IInterface* lpInterface = NULL;

	if (IGUID == IUID_IGAMESYS) {
		lpInterface = new GameSys;
	} else {
		assert(false);
	}

	if (lpInterface != NULL) {
		lpInterface->SetIUID(IGUID);
	}

	return lpInterface;
}

void DestroyInterface(IInterface** lplpInterface) {
	if (lplpInterface && *lplpInterface) {
		if ((*lplpInterface)->GetIUID() == IUID_IGAMESYS) {
			GameSys* lpGameSys = (GameSys*) (*lplpInterface);
			delete lpGameSys;
		} else {
			assert(false);
		}
		(*lplpInterface) = NULL;
	}
}

///////////////////////////////////////
GameSys::GameSys() {
	INIT_TQINTERFACE()
}

GameSys::~GameSys() {
	StdMapDllIter itDll = m_mapDlls.begin();
	for (; itDll != m_mapDlls.end(); ++itDll) {
		(*itDll).second.loader.UnLoad();
	}
	m_mapDlls.clear();
	m_mapInterfaces.clear();
	m_mapUserDatas.clear();
}

bool GameSys::Init() {
	return true;
}

bool GameSys::RegisterInterface(const TQGUID& guid, const char* dllName) {
	bool bRt = false;
	StdMapInterfaceIter iter = m_mapInterfaces.find(guid);
	if (iter == m_mapInterfaces.end()) {
		m_mapInterfaces[guid] = dllName;
		m_mapInterfaces[guid] += DYNLIB_EXT;
		bRt = true;
	}

	return bRt;
}

IInterface* GameSys::CreateInterface(const TQGUID& guid) {
	StdMapInterfaceIter regIter = m_mapInterfaces.find(guid);
	if (regIter == m_mapInterfaces.end())
		return NULL;

	StdMapDllIter dllIter = m_mapDlls.find((*regIter).second);
	if (dllIter == m_mapDlls.end()) {
		if (!LoadDll(regIter))
			return NULL;

		if (!InitDllSymbol(regIter))
			return NULL;
	}

	return FactCreateInterface(guid);
}

bool GameSys::LoadDll(StdMapInterfaceIter& regIter) {
	SDll& dllNode = m_mapDlls[(*regIter).second];
	if (!dllNode.loader.Load((*regIter).second.c_str())) {
		m_mapDlls.erase((*regIter).second);
		std::cerr << "load dll " << (*regIter).second.c_str() << " failed!"
				<< std::endl;
		std::cerr << "error: " << DYNLIB_ERROR() << std::endl;
		return false;
	}

	return true;
}

bool GameSys::InitDllSymbol(StdMapInterfaceIter& regIter) {
	SDll& dllNode = m_mapDlls[(*regIter).second];

	dllNode.pfnCreate = (CREATEINTERFACE) dllNode.loader.GetSymbol(
			"CreateInterface");
	dllNode.pfnDestroy = (DESTROYINTERFACE) dllNode.loader.GetSymbol(
			"DestroyInterface");
	if (dllNode.pfnCreate == NULL || dllNode.pfnDestroy == NULL) {
		dllNode.loader.UnLoad();
		m_mapDlls.erase((*regIter).second);
		std::cerr << "get dll " << (*regIter).second.c_str()
				<< " pfnCreate or pfnDestroy failed!" << std::endl;

		std::cerr << "error: " << DYNLIB_ERROR() << std::endl;
		return false;
	}

	return true;
}

IInterface* GameSys::FactCreateInterface(const TQGUID& guid) {
	StdMapInterfaceIter regIter = m_mapInterfaces.find(guid);
	StdMapDllIter dllIter = m_mapDlls.find((*regIter).second);
	IInterface* lpInterface = (*dllIter).second.pfnCreate(guid);
	if (lpInterface == NULL) {
		std::cerr << "create Iterface failed: " << (*regIter).second.c_str()
				<< std::endl;
		assert( lpInterface != NULL);
		return NULL;
	}

	lpInterface->SetGameSys(this);
	return lpInterface;
}

IInterface* GameSys::CreateInterface(const char* guidName) {
	TQGUID IGUID = SafeAsciToUUID(guidName);
	return CreateInterface(IGUID);
}

IInterface* GameSys::CreateAndInitInterface(const TQGUID& guid) {
	IInterface* lpInterface = CreateInterface(guid);
	if (lpInterface == NULL)
		return NULL;

	if (!lpInterface->OnOneTimeInit()) {
		DestroyInterface(&lpInterface);
		return NULL;
	}

	return lpInterface;
}

IInterface* GameSys::CreateAndInitInterface(const char* guidName) {
	TQGUID guid = SafeAsciToUUID(guidName);
	return CreateAndInitInterface(guid);
}

void GameSys::DestroyInterface(IInterface** interFace) {
	if (interFace && *interFace) {
		const TQGUID& IGUID = (*interFace)->GetIUID();
		StdMapInterfaceIter itInterface = m_mapInterfaces.find(IGUID);
		if (itInterface != m_mapInterfaces.end()) {
			StdMapDllIter itDll = m_mapDlls.find((*itInterface).second);
			if (itDll != m_mapDlls.end()) {
				if ((*itDll).second.pfnDestroy != NULL) {
					(*itDll).second.pfnDestroy(interFace);
				}
			}
		}
	}
}

bool GameSys::RegisterUserData(const char* key, void* userData) {
	StdMapUserDataIter iter = m_mapUserDatas.find(key);
	if (iter != m_mapUserDatas.end()) {
		return false;
	}

	m_mapUserDatas[key] = userData;
	return true;
}

void GameSys::UnRegisterUserData(const char* key) {
	StdMapUserDataIter iter = m_mapUserDatas.find(key);
	if (iter != m_mapUserDatas.end()) {
		m_mapUserDatas.erase(iter);
	}
}

void* GameSys::GetUserData(const char* key) {
	StdMapUserDataIter iter = m_mapUserDatas.find(key);
	if (iter != m_mapUserDatas.end()) {
		return (*iter).second;
	}

	return NULL;
}
