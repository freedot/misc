--*******************************************************************************
BriefRolePlayer = Class:extends({
	init = function(self, grid)
		self.grid = grid
	end;
	
	getRoleName = function(self)
		return self.grid.roleName
	end;
	
	getRoleId = function(self)
		return self.grid.roleId
	end;
	
	getObjType = function(self)
		return self.grid.objType
	end;
	
	getCityPos = function(self)
		return app:getCityMgr():getPosByGridId( self.grid.gridId )
	end;
})

BriefFieldPlayer = Class:extends({
	init = function(self, grid)
		self.grid = grid
		local nameRes = ItemResUtil:findItemres(grid.resId)
		self.name = string.format(rstr.fieldplayer.levelname, grid.level, nameRes.name)
	end;
	
	getRoleName = function(self)
		return self.name
	end;
	
	getRoleId = function(self)
		return self.grid.gridId
	end;
	
	getObjType = function(self)
		return self.grid.objType
	end;
	
	getCityPos = function(self)
		return app:getCityMgr():getPosByGridId( self.grid.gridId )
	end;
})

BriefCopyFieldPlayer = Class:extends({
	init = function(self, copyFieldId)
		self.copyFieldId = copyFieldId
		local nameRes = ItemResUtil:findItemres(copyFieldId)
		self.name = nameRes.name
		self.pos = {x=0, y=0}
	end;
	
	getRoleName = function(self)
		return self.name
	end;
	
	getRoleId = function(self)
		return self.copyFieldId
	end;
	
	getObjType = function(self)
		return OBJ_TYPE.COPYFIELD
	end;
	
	getCityPos = function(self)
		return self.pos
	end;
})


