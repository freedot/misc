/*
 * BaseRank.h
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#ifndef RANKTEMPLET_H_
#define RANKTEMPLET_H_

#include <vector>
#include <map>
#include "IRank.h"

class RankTemplet: public IRank {
public:
	void Sort();
	void LoadLast();
	int GetCount();
	const Grid* Get(int idx);
	int GetIdxByName(const char* roleName);

	void StartChangeRolePos(int64 roleId);
	void AddNewRole(int64 roleId);
	void RemoveRole(int64 roleId);
	void EndChangeRolePos(int64 roleId);

public:
	RankTemplet(IGridsManager* gridMgr);
	virtual ~RankTemplet();

protected:
	// for sub class
	virtual void SortGrids() = 0;
	virtual void SortGridsByLastRank() = 0;
	virtual bool IsValidGrid(Grid* grid) = 0;
	virtual bool IsValidGridByLastRank(Grid* grid) = 0;
	virtual void SetGridRank(Grid* grid, int rank) = 0;
	virtual int GetRankFromGrid(Grid* grid) = 0;
	virtual void NewRoleRegister(int64 roleId) {
	}

protected:
	void CollectNeedSortGrids();
	void CollectNeedSortGridsHasRank();
	void ResetRankInGrids();
	bool IsChangePos(int64 roleId);
	void ClearGridRank(Grid* grid) {
		SetGridRank(grid, 0);
	}

protected:
	struct Changing {
		int rank_;
		bool isChanging_;
		Changing() :
				rank_(0), isChanging_(false) {
		}
		Changing(int rank, bool isChanging) :
				rank_(rank), isChanging_(isChanging) {
		}
	};
	IGridsManager* m_gridsMgr;
	std::vector<Grid*> m_ranks;
	std::map<int64, Changing> m_changingRoles;

	typedef std::vector<Grid*>::iterator RankIter;
	typedef std::map<int64, Changing>::iterator ChangingIter;
};

#endif /* RANKTEMPLET_H_ */
