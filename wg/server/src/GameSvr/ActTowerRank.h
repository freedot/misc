/*
 * ActTowerRank.h
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#ifndef ACTTOWERRANK_H_
#define ACTTOWERRANK_H_
#include "RankTemplet.h"

class ActTowerRank: public RankTemplet {
public:
	ActTowerRank(IGridsManager* gridMgr);
	virtual ~ActTowerRank();

protected:
	void SortGrids();
	void SortGridsByLastRank();
	void SaveLastVal();
	bool IsValidGrid(Grid* grid);
	bool IsValidGridByLastRank(Grid* grid);
	void SetGridRank(Grid* grid, int rank);
	int GetRankFromGrid(Grid* grid);
};

#endif /* ACTTOWERRANK_H_ */
