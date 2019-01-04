/*
 * IRank.h
 *
 *  Created on: 2013-11-3
 *      Author: Administrator
 */

#ifndef IRANK_H_
#define IRANK_H_

#include "IGridsManager.h"

inline int RANK_TO_IDX(int rank) {
	return rank - 1;
}

//tolua_begin
class IRank {
public:
	//tolua_end

	//tolua_begin
	virtual void Sort() = 0;
	virtual void LoadLast() = 0;
	virtual int GetCount() = 0;
	virtual const Grid* Get(int idx) = 0;
	virtual int GetIdxByName(const char* roleName) = 0;
	//tolua_end


	virtual void StartChangeRolePos(int64 roleId) = 0;
	virtual void AddNewRole(int64 roleId) = 0;
	virtual void RemoveRole(int64 roleId) = 0;
	virtual void EndChangeRolePos(int64 roleId) = 0;
	virtual ~IRank() {
	}
	;
	//tolua_begin
};
//tolua_end

#endif /* IRANK_H_ */
