#ifndef _GAMESYS_H__
#define _GAMESYS_H__
#include <singleton.h>
#include <IGameSys.h>
#include <memory>

struct lua_State;
class GameSys: public Singleton<GameSys> {
	DECLARE_SINGLETON(GameSys)

public	:
	void Set(IGameSys* lpGameSys) {
		m_lpGameSys = lpGameSys;
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

	virtual ~GameSys() {
	}

protected:
	GameSys():m_lpGameSys(NULL),m_lpLuaState(NULL) {
	}

private:
	IGameSys* m_lpGameSys;
	lua_State* m_lpLuaState;
};

#endif // _GAMESYS_H__
