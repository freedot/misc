/*
 * RankManager.h
 *
 *  Created on: 2013-7-22
 *      Author: qujianbiao
 */

#ifndef RANKMANAGER_H_
#define RANKMANAGER_H_
#include <map>
#include <string>
#include <IGameSys.h>
#include "IRankManager.h"
#include "IGridsManager.h"
#include "IRank.h"

class GameSvr;
class RankManager : public IRankManager {
public:
	void SetGameSys(IGameSys* gameSys);

	IRank* GetRank(const char* rankName);
	void StartChangeRolePos(int64 roleId);
	void AddNewRole(int64 roleId);
	void RemoveRole(int64 roleId);
	void EndChangeRolePos(int64 roleId);

public:
	RankManager();
	virtual ~RankManager();

private:
	void CreateRanks(IGridsManager* gridsMgr);
	void ReleaseRanks();

private:
	IGameSys* m_gameSys;
	std::map<std::string, IRank*> m_ranks;
};

#endif /* RANKMANAGER_H_ */
