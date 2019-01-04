--*******************************************************************************
--*******************************************************************************
require('tqFieldPlayer')
ArmyPlayerGetter = Class:extends({
	getPairBriefPlayer = function(self, army)
		local sourcePlayer = self:_getBriefSourcePlayer(army)
		if (sourcePlayer:getObjType() ==OBJ_TYPE.NONE) then return false end
		
		local targetPlayer = self:_getBriefTargetPlayer(army)
		if (targetPlayer:getObjType() ==OBJ_TYPE.NONE) then return false end
		
		return true, sourcePlayer, targetPlayer
	end;

	getSourcePlayer = function(self, army)
		if army == nil then
			return nil
		end
		
		return self:getPlayer(army.sourceType, army.sourceId)
	end;
	
	getTargetPlayer = function(self, army)
		if army == nil then
			return nil
		end
		return self:getPlayer(army.targetType, army.targetId)
	end;
	
	getOnlineSourcePlayer = function(self, army)
		if army == nil then
			return NullPlayer
		end
		return self:getOnlinePlayer(army.sourceType, army.sourceId)	
	end;
	
	getOnlineTargetPlayer = function(self, army)
		if army == nil then
			return NullPlayer
		end
		return self:getOnlinePlayer(army.targetType, army.targetId)	
	end;
	
	getPlayer = function(self, objType, objId)
		if objType == OBJ_TYPE.ROLE then
			local grid = app:getCityMgr():getGridByRoleId(objId)
			if grid == nil then 
				return NullPlayer 
			end
			
			local obj = app:getPlayerMgr():getOrLoadPlayerByUserName(grid.objType, grid.userName)
			if obj == nil then
				return NullPlayer
			end
			
			return obj 
		elseif objType == OBJ_TYPE.COPYFIELD then
			return CopyFieldPlayer(objId)
		elseif objType == OBJ_TYPE.FIELD then
			local ownerFieldPlayer = OwnerFieldPlayer(objId)
			if ownerFieldPlayer:getObjType() == OBJ_TYPE.OWNERFIELD then 
				return ownerFieldPlayer 
			end
			
			local fieldPlayer = FieldPlayer(objId)
			if fieldPlayer:getObjType() == OBJ_TYPE.FIELD then 
				return fieldPlayer 
			end
		end
		
		return NullPlayer
	end;
	
	getOnlinePlayer = function(self, objType, objId)	
		if objType == OBJ_TYPE.ROLE then
			return self:_getOnlineRolePlayer(objId)
		elseif objType == OBJ_TYPE.OWNERFIELD or objType == OBJ_TYPE.FIELD then
			local grid = app:getCityMgr():getGridByGridId(objId)
			if grid == nil then return NullPlayer end
			return self:_getOnlineRolePlayer(grid.roleId)
		else
			return NullPlayer
		end
	end;
	
	_getOnlineRolePlayer = function(self, roleId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then 
			return NullPlayer 
		end
		
		local player = app:getPlayerMgr():getPlayerByName(grid.userName)
		if player == nil then
			return NullPlayer 
		end
		
		return player	
	end;
	
	_getBriefSourcePlayer = function(self, army)
		if army == nil then return NullPlayer end
		return self:_getBriefPlayer(army.sourceType, army.sourceId)
	end;
	
	_getBriefTargetPlayer = function(self, army)
		if army == nil then return NullPlayer end
		return self:_getBriefPlayer(army.targetType, army.targetId)
	end;
	
	_getBriefPlayer = function(self, objType, objId)
		if objType == OBJ_TYPE.ROLE then
			local grid = app:getCityMgr():getGridByRoleId(objId)
			if grid == nil then return NullPlayer end
			if grid.objType ~= OBJ_TYPE.ROLE then return NullPlayer end
			return BriefRolePlayer:new(grid)
		elseif objType == OBJ_TYPE.COPYFIELD then
			return BriefCopyFieldPlayer:new(objId)
		elseif objType == OBJ_TYPE.FIELD then
			local grid = app:getCityMgr():getGridByGridId( objId )
			if grid == nil then return NullPlayer end
			if grid.objType ~= OBJ_TYPE.FIELD then return NullPlayer end
			return BriefFieldPlayer:new(grid)
		end
		return NullPlayer	
	end;
}):new()


