--*******************************************************************************
--*******************************************************************************
SelfFieldChecker = Class:extends({
	hasSelfArmyInField = function(self, sourcePlayer, targetPlayer)
		local grid = app:getCityMgr():getGridByPos( targetPlayer:getCityPos() )
		if grid == nil then
			return false
		end
		
		local sourceContainer = sourcePlayer:getArmyContainer()
		local selfArmyCnt = sourceContainer:getSelfArmyCount()
		for i=1, selfArmyCnt, 1 do
			local armyId = sourceContainer:getSelfArmyId(i-1)
			local army = app:getArmyMgr():getArmyById(armyId)
			if (army ~= nil)
				and (army.state == ARMYDYN_STATE.DISPATCH)
				and (army.targetType == OBJ_TYPE.FIELD )
				and (army.targetId == grid.gridId ) then
				return true
			end
		end
		
		return false
	end;
	
	isSelfField = function(self, ownerPlayer, targetPlayer)
		local grid = app:getCityMgr():getGridByPos( targetPlayer:getCityPos() )
		if grid == nil then
			return false
		end
		
		if grid.objType ~= OBJ_TYPE.FIELD then
			return false
		end
		
		if grid.roleId ~= ownerPlayer:getRoleId() then
			return false
		end
		
		local selfFieldMgr = ownerPlayer:getSelfField()
		if selfFieldMgr:getFieldById(grid.gridId) == nil then
			return false
		end
		
		return true
	end;
}):new()

