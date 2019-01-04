#ifndef _GAMESYS_H__
#define _GAMESYS_H__
#include <singleton.h>
#include <IGameSys.h>
#include <ITimerQueue.h>
#include <IEventSys.h>
#include <IScriptSys.h>
#include "../GameSvr/IScriptPub.h"
#include "../GameSvr/IGridsManager.h"
#include "../GameSvr/IRankManager.h"
#include "../GameSvr/IProxyServer.h"

extern "C" {
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>
#include <tolua++.h>
#include <luaex.h>
}

using namespace Script;

class GameSys: public Singleton<GameSys> {
	DECLARE_SINGLETON(GameSys);

public:
	void Set(IGameSys* lpGameSys) {
		m_lpGameSys = lpGameSys;
		m_lpTimerQueue = static_cast<ITimerQueue*>(m_lpGameSys->GetUserData("ITimerQueue"));
		m_lpTimerQueueEx = static_cast<ITimerQueueEx*>(m_lpGameSys->GetUserData("ITimerQueueEx"));
		if ( m_lpTimerQueueEx != NULL ) {
			m_lpTimerQueueEx->Init(7200, 500);
		}
		m_lpEventSys = static_cast<IEventSys*>(m_lpGameSys->GetUserData("IEventSys"));
	}

	IGameSys* Get() {
		return m_lpGameSys;
	}

	void SetLuaState(lua_State* lpState) {
		m_lpLuaState = lpState;
	}

	lua_State* GetLuaState() {
		return m_lpLuaState;
	}

	ITimerQueue* GetTimerQueue() {
		return m_lpTimerQueue;
	}

	ITimerQueueEx* GetTimerQueueEx() {
		return m_lpTimerQueueEx;
	}

	IEventSys* GetEventSys() {
		return m_lpEventSys;
	}

	IScriptPub* GetScriptPub() {
		if ( m_lpScriptPub == NULL ) {
			m_lpScriptPub = static_cast<IScriptPub*>(m_lpGameSys->GetUserData("IScriptPub"));
		}
		return m_lpScriptPub;
	}

	IGridsManager* GetGridsManager() {
		if ( m_lpGridsManager == NULL ) {
			m_lpGridsManager = static_cast<IGridsManager*>(m_lpGameSys->GetUserData("IGridsManager"));
		}
		return m_lpGridsManager;
	}

	IRankManager* GetRankManager() {
		if ( m_lpRankManager == NULL ) {
			m_lpRankManager = static_cast<IRankManager*>(m_lpGameSys->GetUserData("IRankManager"));
		}
		return m_lpRankManager;
	}

	IProxyServer* GetProxyServer() {
		if ( m_lpProxyServer == NULL ) {
			m_lpProxyServer = static_cast<IProxyServer*>(m_lpGameSys->GetUserData("IProxyServer"));
		}
		return m_lpProxyServer;
	}

	IScriptSys* GetScriptSys() {
		if ( m_lpScriptSys == NULL ) {
			m_lpScriptSys = static_cast<IScriptSys*>(m_lpGameSys->GetUserData("IScriptSys"));
		}
		return m_lpScriptSys;
	}

public:
	virtual ~GameSys() {}

private:
	GameSys():m_lpGameSys(NULL)
	,m_lpLuaState(NULL)
	,m_lpTimerQueue(NULL)
	,m_lpTimerQueueEx(NULL)
	,m_lpEventSys(NULL)
	,m_lpScriptPub(NULL)
	,m_lpGridsManager(NULL)
	,m_lpRankManager(NULL)
	,m_lpProxyServer(NULL)
	,m_lpScriptSys(NULL) {}

private:
	IGameSys* m_lpGameSys;
	lua_State* m_lpLuaState;
	ITimerQueue* m_lpTimerQueue;
	ITimerQueueEx* m_lpTimerQueueEx;
	IEventSys* m_lpEventSys;
	IScriptPub* m_lpScriptPub;
	IGridsManager* m_lpGridsManager;
	IRankManager* m_lpRankManager;
	IProxyServer* m_lpProxyServer;
	IScriptSys* m_lpScriptSys;
};

#endif // _GAMESYS_H__
