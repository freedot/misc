/*
 * BaseRank.cpp
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#include "RankTemplet.h"

RankTemplet::RankTemplet(IGridsManager* gridMgr) :
m_gridsMgr(gridMgr) {
m_ranks.reserve(GRIDS_COUNT / 2);

}

RankTemplet::~RankTemplet() {
}

void RankTemplet::Sort() {
	CollectNeedSortGrids();
	SortGrids();
	ResetRankInGrids();
}

void RankTemplet::LoadLast(){
	CollectNeedSortGridsHasRank();
	SortGridsByLastRank();
}

void RankTemplet::CollectNeedSortGrids() {
	m_ranks.clear();
	for (int gridId = 1; gridId <= GRIDS_COUNT; ++gridId) {
		Grid* grid = m_gridsMgr->GetGridById(gridId);
		if ( !IsValidGrid(grid) ) {
			ClearGridRank(grid);
			continue;
		}
		m_ranks.push_back(grid);
	}
}

void RankTemplet::CollectNeedSortGridsHasRank() {
	m_ranks.clear();
	for (int gridId = 1; gridId <= GRIDS_COUNT; ++gridId) {
		Grid* grid = m_gridsMgr->GetGridById(gridId);
		if ( !IsValidGridByLastRank(grid) ) {
			continue;
		}
		m_ranks.push_back(grid);
	}
}

void RankTemplet::ResetRankInGrids() {
	std::vector<Grid*>::iterator iter = m_ranks.begin();
	for (int rank = 1; iter != m_ranks.end(); ++iter, ++rank) {
		Grid* grid = *(iter);
		SetGridRank(grid, rank);
	}
}

int RankTemplet::GetCount() {
	return m_ranks.size();
}

const Grid* RankTemplet::Get(int idx) {
	if (idx < 0 || idx >= (int) m_ranks.size())
		return NULL;
	return m_ranks[idx];
}

int RankTemplet::GetIdxByName(const char* roleName) {
	int64 roleId = m_gridsMgr->GetRoleIdByRoleName(roleName);
	Grid* grid = m_gridsMgr->GetGridByRoleId(roleId);
	int rank = GetRankFromGrid(grid);
	if (rank == 0)
		return -1;

	return RANK_TO_IDX(rank);
}

void RankTemplet::StartChangeRolePos(int64 roleId) {
	Grid* grid = m_gridsMgr->GetGridByRoleId(roleId);
	int rank = GetRankFromGrid(grid);
	if (rank == 0)
		return;

	ClearGridRank(grid);

	Changing changing(rank, true);
	m_changingRoles[roleId] = changing;
}

void RankTemplet::AddNewRole(int64 roleId) {
	if (!IsChangePos(roleId)) {
		NewRoleRegister(roleId);
		return;
	}

	Grid* newGrid = m_gridsMgr->GetGridByRoleId(roleId);
	if (newGrid == NULL)
		return;

	ChangingIter iter = m_changingRoles.find(roleId);
	Changing& changing = (*iter).second;
	SetGridRank(newGrid, changing.rank_);
	m_ranks[RANK_TO_IDX(changing.rank_)] = newGrid;
}

void RankTemplet::RemoveRole(int64 roleId) {
	if (IsChangePos(roleId))
		return;

	Grid* oldGrid = m_gridsMgr->GetGridByRoleId(roleId);
	int rank = GetRankFromGrid(oldGrid);
	if (rank == 0)
		return;

	m_ranks.erase(m_ranks.begin() + RANK_TO_IDX(rank));
	ClearGridRank(oldGrid);
	ResetRankInGrids();
}

void RankTemplet::EndChangeRolePos(int64 roleId) {
	Changing changing(0, false);
	m_changingRoles[roleId] = changing;
}

bool RankTemplet::IsChangePos(int64 roleId) {
	ChangingIter iter = m_changingRoles.find(roleId);
	if (iter == m_changingRoles.end())
		return false;
	return (*iter).second.isChanging_;
}
