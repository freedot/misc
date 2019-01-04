--*******************************************************************************
--*******************************************************************************
PlayerSelfField = Class:extends({
	init = function(self, player)
		self.player = player
		self.data = player:getPersistVar().stCitys
		self.citys = player:getCitys()
	end;
	
	isFull = function(self)
		if self.data.fieldTotal >= MAX_SELFFIELD_CNT then
			return true
		end
		
		local govLevel = self.citys:getBuildLevelByResId(FIXID.GOV_BUILD)
		if self.data.fieldTotal >= res_selffield_maxcount(govLevel) then
			return true
		end
		
		return false
	end;
	
	getCount = function(self, field)
		return self.data.fieldTotal
	end;
	
	addField = function(self, field)
		if self:isFull() then 
			LOG('error: beyond self field max count')
			return
		end
		
		if self:getFieldById(field.gridId) ~= nil then
			LOG('error: add repeat self field ')
			return
		end
		
		local selfField = self.data.selfFields[self.data.fieldTotal]
		
		selfField.gridId = field.gridId
		selfField.startTime = 0
		
		self.data.fieldTotal = self.data.fieldTotal + 1
	end;
	
	deleteField = function(self, field)
		local grid = Util:findC(self.data.selfFields, self.data.fieldTotal, 'gridId', field.gridId)
		if grid == nil then
			return
		end
		
		self.data.fieldTotal = Util:removeElementC(self.data.selfFields, self.data.fieldTotal, Util:getLastFindIdx())
	end;
	
	getFieldByIdx = function(self, idx) -- from 0 - n-1
		return self.data.selfFields[idx]
	end;
	
	getFieldById = function(self, gridId)
		return Util:findC(self.data.selfFields, self.data.fieldTotal, 'gridId', gridId)
	end;
	
	startCollect = function(self, gridId, curTime)
		local field = self:getFieldById(gridId)
		if field == nil then
			return
		end
		
		if self:getCurOccupySoldierNumber(gridId) == 0 then
			return
		end
		
		field.startTime = curTime
		self:resetCollectSoldierNumber(gridId)
	end;
	
	stopCollect = function(self, gridId)
		local field = self:getFieldById(gridId)
		if field == nil then
			return
		end
		
		field.startTime = 0
	end;
	
	getStartTime = function(self, gridId)
		local field = self:getFieldById(gridId)
		if field == nil then
			return 0
		end
		
		return field.startTime
	end;
	
	getCollectSoldierNumber = function(self, gridId)
		local field = self:getFieldById(gridId)
		if field == nil then
			return 0
		end
		
		return field.soldierNumber
	end;
	
	resetCollectSoldierNumber = function(self, gridId)
		local field = self:getFieldById(gridId)
		if field == nil then
			return
		end
		
		field.soldierNumber = self:getCurOccupySoldierNumber(gridId)
	end;
	
	getCurOccupySoldierNumber = function(self, gridId)
		local hero = self:getCurOccupyHero(gridId)
		if hero == nil then
			return 0
		end
		
		return hero:getSoldierNumber()
	end;
	
	getCurOccupyHero = function(self, gridId)
		local occupyArmy = self:getOccupyArmy(gridId)
		if occupyArmy == nil then
			return nil
		end
		
		local heroMgr = self.player:getHeroMgr()
		for _, heroId in ipairs(occupyArmy.heros) do
			local hero = heroMgr:getHeroById(heroId)
			if hero ~= nil then
				return hero
			end
		end
		return nil
	end;
	
	getOccupyArmy = function(self, gridId)
		local ownerArmyContainer = self.player:getArmyContainer()
		local ownerSelfArmyCount = ownerArmyContainer:getSelfArmyCount()
		for i=0, ownerSelfArmyCount-1, 1 do
			local armyId = ownerArmyContainer:getSelfArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			if (army ~= nil )
				and (army.targetType == OBJ_TYPE.FIELD)
				and (army.targetId == gridId)	
				and (army.state == ARMYDYN_STATE.DISPATCH ) then
				return army
			end
		end
		
		return nil
	end;
})


