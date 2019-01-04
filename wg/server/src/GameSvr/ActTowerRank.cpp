/*
 * ActTowerRank.cpp
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#include "ActTowerRank.h"
#include <algorithm>

const int MIN_TOWER_LAYER_NEEDRANK = 10;

struct TowerRankComp {
	bool operator()(const Grid* a, const Grid* b) const {
		if (a->misc.towerLayer == b->misc.towerLayer) {
			return a->misc.towerTime < b->misc.towerTime;
		} else {
			return a->misc.towerLayer > b->misc.towerLayer;
		}
	}
};

struct TowerRankCompByLastRank {
	bool operator()(const Grid* a, const Grid* b) const {
		return (a->misc.towerRank > 0) && (a->misc.towerRank < b->misc.towerRank);
	}
};

ActTowerRank::ActTowerRank(IGridsManager* gridMgr) :
		RankTemplet(gridMgr) {
}

ActTowerRank::~ActTowerRank() {
}

void ActTowerRank::SortGrids() {
	std::sort(m_ranks.begin(), m_ranks.end(), TowerRankComp());
	SaveLastVal();
}

void ActTowerRank::SortGridsByLastRank() {
	std::sort(m_ranks.begin(), m_ranks.end(), TowerRankCompByLastRank());
}

void ActTowerRank::SaveLastVal() {
	std::vector<Grid*>::iterator iter = m_ranks.begin();
	for (int rank = 1; iter != m_ranks.end(); ++iter, ++rank) {
		Grid* grid = *(iter);
		if (grid == NULL)
			continue;
		grid->misc.lastTowerLayer = grid->misc.towerLayer;
		grid->misc.lastTowerTime = grid->misc.towerTime;
	}
}

bool ActTowerRank::IsValidGrid(Grid* grid) {
	if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
		return false;
	if (grid->misc.towerLayer < MIN_TOWER_LAYER_NEEDRANK)
		return false;
	return true;
}

bool ActTowerRank::IsValidGridByLastRank(Grid* grid) {
	if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
		return false;
	if (grid->misc.towerRank <= 0)
		return false;
	return true;
}

void ActTowerRank::SetGridRank(Grid* grid, int rank) {
	if (grid == NULL)
		return;
	grid->misc.towerRank = rank;
}

int ActTowerRank::GetRankFromGrid(Grid* grid) {
	if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
		return 0;
	return grid->misc.towerRank;
}
