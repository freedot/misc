/*
 * RoleRank.h
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#ifndef ROLERANK_H_
#define ROLERANK_H_
#include "RankTemplet.h"

class RoleRank : public RankTemplet {
public:
	RoleRank(IGridsManager* gridMgr);
	virtual ~RoleRank();

protected:
	void SortGrids();
	void SortGridsByLastRank();
	bool IsValidGrid(Grid* grid);
	bool IsValidGridByLastRank(Grid* grid);
	void SetGridRank(Grid* grid, int rank);
	void SaveLastVal();
	int GetRankFromGrid(Grid* grid);
	void NewRoleRegister(int64 roleId);

private:
	void SaveLastInfo(Grid* grid);
};

#endif /* ROLERANK_H_ */
