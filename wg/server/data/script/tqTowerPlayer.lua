--*******************************************************************************
--*******************************************************************************
TowerPlayer = Class:extends({
	init = function(self, towerLevel, towerArmy, allianceId, icon)
		self.heroMgr = self:createHeroMgr(towerLevel, towerArmy)
		self.objType = OBJ_TYPE.TOWER
		self.name = rstr.fight.jianta
		self.towerLevel = towerLevel
		self.allianceId = allianceId
		self.icon = icon
	end;
	
	isRole = function(self)
		return self.objType == OBJ_TYPE.ROLE
	end;
	
	getObjType = function(self)
		return self.objType
	end;
	
	getRoleName = function(self)
		return self.name
	end;
	
	getHeroMgr = function(self)
		return self.heroMgr
	end;
	
	getAlliId = function(self)
		return self.allianceId
	end;
	
	getIcon = function(self)
		return self.icon;
	end;
	
	getLevel = function(self)
		return self.towerLevel;
	end;
	
	createHeroMgr = function(self, towerLevel, towerArmy) 
		local heroMgr = FieldHeroMgr()
		local buildRes = ItemResUtil:findBuildLevelres(FIXID.TOWERBUILD, towerLevel)
		if (buildRes == nil) then return heroMgr end
		
		for i=1, MAX_TEAM_HERO_CNT, 1 do
			local soldier = towerArmy.soldiers[i-1]
			if (soldier.resid > 0) and (soldier.number > 0) then
				local hero = heroMgr:newHero(i, buildRes.fieldheroid)
				hero:bindSoldier(soldier)
			end
		end 
		return heroMgr
	end;
})



