--*******************************************************************************
--*******************************************************************************
OwnerFieldPlayer = BasePlayer:extends({
	init = function(self, fieldGridId)
		self.objType = OBJ_TYPE.OWNERFIELD
		self.fieldGridId = fieldGridId
		if not self:initPlayer() then
			self.objType = OBJ_TYPE.NONE
		end
	end;
	
	initPlayer = function(self)
		if not self:initBaseAttrs() then
			return false
		end
		
		self:createCityDef()
		self:createHeroMgr()
		self:createArmyMgr()
		
		return true
	end;
	
	initBaseAttrs = function(self)
		local pos = app:getCityMgr():getPosByGridId( self.fieldGridId )
		local grid = app:getCityMgr():getGridByGridId( self.fieldGridId )
		if (grid == nil) 
			or (grid.objType ~= OBJ_TYPE.FIELD)
			or (grid.roleId == 0) then 
			return false
		end
		
		local ownerRoleGrid = app:getCityMgr():getGridByRoleId(grid.roleId)
		if ownerRoleGrid == nil then
			return false
		end
		
		local ownerPlayer = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, ownerRoleGrid.userName)
		if ownerPlayer == nil then
			return false
		end
		
		self.name = string.format(rstr.occupyfieldplayer.playername, ownerRoleGrid.roleName)
		self.pos = {x=pos.x, y=pos.y}
		self.ownerPlayer = ownerPlayer
		self.level = ownerRoleGrid.level
		
		return true
	end;
	
	createCityDef = function(self)
		self.cityDef = FieldPlayerCityDef(self)
		self.wall = FieldPlayerWall(nil)	
	end;
	
	createArmyMgr = function(self)
		self.occupyArmy = nil
		local ownerArmyContainer = self.ownerPlayer:getArmyContainer()
		local ownerSelfArmyCount = ownerArmyContainer:getSelfArmyCount()
		for i=0, ownerSelfArmyCount-1, 1 do
			local armyId = ownerArmyContainer:getSelfArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			if (army ~= nil)
				and (army.targetType == OBJ_TYPE.FIELD) 
				and (army.targetId == self.fieldGridId) 
				and (army.state == ARMYDYN_STATE.DISPATCH ) then
				self.occupyArmy = army
				break
			end
		end
		
		if self.occupyArmy == nil then
			self.occupyArmy = {armyId=-1, lineupId=FIXID.DEFAULTLINEUP, heros={0,0,0,0,0}}
		end
		
		self.armyContainer = FieldArmyContainer()
		self.armyContainer:initArmy(self.occupyArmy.lineupId, self.occupyArmy.heros)
	end;
	
	createHeroMgr = function(self) 
		self.heroMgr = self.ownerPlayer:getHeroMgr()
	end;	
	
	getGridId = function(self)
		return self.fieldGridId
	end;
	
	getRoleId = function(self)
		return self.fieldGridId
	end;
	
	getOwnerPlayer = function(self)
		return self.ownerPlayer
	end;
	
	getOwnerArmy = function(self)
		return self.occupyArmy
	end;
	
	getIcon = function(self)
		return self.ownerPlayer:getIcon()
	end;
})


