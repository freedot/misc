/*
 * RoleRank.cpp
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#include "RoleRank.h"
#include <algorithm>

struct RoleRankComp {
	bool operator()(const Grid* a, const Grid* b) const {
		if (a->buildCurVal == b->buildCurVal) {
			return a->misc.buildValTime < b->misc.buildValTime;
		} else {
			return a->buildCurVal > b->buildCurVal;
		}
	}
};

struct RoleRankCompByLastRank {
	bool operator()(const Grid* a, const Grid* b) const {
		return (a->roleRank > 0) && (a->roleRank < b->roleRank);
	}
};

RoleRank::RoleRank(IGridsManager* gridMgr) :
		RankTemplet(gridMgr) {
}

RoleRank::~RoleRank() {
}

void RoleRank::SortGrids() {
	std::sort(m_ranks.begin(), m_ranks.end(), RoleRankComp());
	SaveLastVal();
}

void RoleRank::SortGridsByLastRank(){
	std::sort(m_ranks.begin(), m_ranks.end(), RoleRankCompByLastRank());
}

bool RoleRank::IsValidGrid(Grid* grid) {
	if (grid == NULL)
		return false;
	if (grid->objType != OBJ_TYPE_ROLE)
		return false;
	return true;
}

bool RoleRank::IsValidGridByLastRank(Grid* grid) {
	return IsValidGrid(grid);
}

void RoleRank::SetGridRank(Grid* grid, int rank) {
	if (grid == NULL)
		return;
	grid->roleRank = rank;
}

void RoleRank::SaveLastVal() {
	std::vector<Grid*>::iterator iter = m_ranks.begin();
	for (int rank = 1; iter != m_ranks.end(); ++iter, ++rank) {
		Grid* grid = *(iter);
		if (grid == NULL)
			continue;
		SaveLastInfo(grid);
	}
}

int RoleRank::GetRankFromGrid(Grid* grid) {
	if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
		return 0;
	return grid->roleRank;
}

void RoleRank::NewRoleRegister(int64 roleId) {
	Grid* newGrid = m_gridsMgr->GetGridByRoleId(roleId);
	if (newGrid == NULL || newGrid->objType != OBJ_TYPE_ROLE)
		return;

	int newRank = m_ranks.size() + 1;
	SaveLastInfo(newGrid);
	SetGridRank(newGrid, newRank);
	m_ranks.push_back(newGrid);
}

void RoleRank::SaveLastInfo(Grid* grid) {
	grid->misc.lastRoleLevel = grid->level;
	grid->misc.lastBuildVal = grid->buildCurVal;
}
