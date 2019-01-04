/*
 * RankManager.cpp
 *
 *  Created on: 2013-7-22
 *      Author: qujianbiao
 */

#include "RankManager.h"
#include "gamesvr.h"
#include <algorithm>
#include <functional>
#include "ActTowerRank.h"
#include "RoleRank.h"

void RankManager::CreateRanks(IGridsManager* gridsMgr) {
	m_ranks["actTower"] = new ActTowerRank(gridsMgr);
	m_ranks["role"] = new RoleRank(gridsMgr);
}

RankManager::RankManager() :
		m_gameSys(NULL) {
}

RankManager::~RankManager() {
	ReleaseRanks();
}

void RankManager::SetGameSys(IGameSys* gameSys) {
	m_gameSys = gameSys;
	IGridsManager* gridsMgr =
			static_cast<IGridsManager*>(m_gameSys->GetUserData("IGridsManager"));
	CreateRanks(gridsMgr);
}

IRank* RankManager::GetRank(const char* rankName) {
	std::map<std::string, IRank*>::iterator iter = m_ranks.find(rankName);
	if (iter == m_ranks.end())
		return NULL;
	return (*iter).second;
}

void RankManager::StartChangeRolePos(int64 roleId) {
	std::map<std::string, IRank*>::iterator iter = m_ranks.begin();
	for (; iter != m_ranks.end(); ++iter) {
		(*iter).second->StartChangeRolePos(roleId);
	}
}

void RankManager::AddNewRole(int64 roleId) {
	std::map<std::string, IRank*>::iterator iter = m_ranks.begin();
	for (; iter != m_ranks.end(); ++iter) {
		(*iter).second->AddNewRole(roleId);
	}
}

void RankManager::RemoveRole(int64 roleId) {
	std::map<std::string, IRank*>::iterator iter = m_ranks.begin();
	for (; iter != m_ranks.end(); ++iter) {
		(*iter).second->RemoveRole(roleId);
	}
}

void RankManager::EndChangeRolePos(int64 roleId) {
	std::map<std::string, IRank*>::iterator iter = m_ranks.begin();
	for (; iter != m_ranks.end(); ++iter) {
		(*iter).second->EndChangeRolePos(roleId);
	}
}

void RankManager::ReleaseRanks() {
	std::map<std::string, IRank*>::iterator iter = m_ranks.begin();
	for (; iter != m_ranks.end(); ++iter) {
		IRank* rank = (*iter).second;
		delete rank;
	}
	m_ranks.clear();
}
