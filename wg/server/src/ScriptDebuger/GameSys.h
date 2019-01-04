#ifndef _GAMESYS_H__
#define _GAMESYS_H__
#include <singleton.h>
#include <IGameSys.h>

class GameSys: public Singleton<GameSys> {
	DECLARE_SINGLETON(GameSys);

public:
	void Set(IGameSys* lpGameSys) {
		m_lpGameSys = lpGameSys;
	}

	IGameSys* Get() {
		return m_lpGameSys;
	}

public:
	virtual ~GameSys() {}

private:
	GameSys():m_lpGameSys(NULL) {
	}

private:
	IGameSys* m_lpGameSys;
};

#endif // _GAMESYS_H__
