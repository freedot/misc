/*
 * GameSys.h
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#ifndef GAMESYS_H_
#define GAMESYS_H_
#include <IGameSys.h>
#include <DllLoader.h>
#include <map>

class GameSys: public IGameSys {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()
	DECLARE_DEFAULT_ONONETIME()

public:
	bool Init();
	bool RegisterInterface(const TQGUID& guid, const char* dllName);
	IInterface* CreateInterface(const TQGUID& guid);
	IInterface* CreateInterface(const char* guidName);
	IInterface* CreateAndInitInterface(const TQGUID& guid);
	IInterface* CreateAndInitInterface(const char* guidName);
	void DestroyInterface(IInterface** interFace);
	bool RegisterUserData(const char* key, void* userData);
	void UnRegisterUserData(const char* key);
	void* GetUserData(const char* key);

public:
	GameSys();
	virtual ~GameSys();

private:
	struct SDll {
		DllLoader loader;
		CREATEINTERFACE pfnCreate;
		DESTROYINTERFACE pfnDestroy;
		SDll() :
				pfnCreate(NULL), pfnDestroy(NULL) {
		}
	};

	typedef std::map<std::string, SDll> StdMapDll;
	typedef StdMapDll::iterator StdMapDllIter;

	typedef std::map<TQGUID, std::string> StdMapInterface;
	typedef StdMapInterface::iterator StdMapInterfaceIter;

	typedef std::map<std::string, void*> StdMapUserData;
	typedef StdMapUserData::iterator StdMapUserDataIter;

private:
	bool LoadDll(StdMapInterfaceIter& regIter);
	bool InitDllSymbol(StdMapInterfaceIter& regIter);
	IInterface* FactCreateInterface(const TQGUID& guid);

private:
	StdMapDll m_mapDlls;
	StdMapInterface m_mapInterfaces;
	StdMapUserData m_mapUserDatas;
};

#endif /* GAMESYS_H_ */
