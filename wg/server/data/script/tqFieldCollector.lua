--*******************************************************************************
--*******************************************************************************
FieldCollector = Class:extends({
	init = function(self)
		self.resTags = {'food', 'wood', 'stone', 'iron'}
		self.dropItem = DropItem()
		self._isOk = true
	end;
	
	setParam = function(self, gridId, curTime)
		self.gridId = gridId
		local grid = app:getCityMgr():getGridByGridId(self.gridId)
		if grid == nil then
			self._isOk = false
			return 
		end
		
		local ownerPlayer = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, grid.roleId)
		if ownerPlayer:getObjType() ~= OBJ_TYPE.ROLE then
			self._isOk = false
			return 
		end
		
		self.selfField = ownerPlayer:getSelfField()
		self.soldierNumber = self.selfField:getCollectSoldierNumber(self.gridId)
		self.curTime = curTime
		self.levelPhases = self:getLevelTimePhase()
	end;
	
	getCommRes = function(self)
		local getRess = {wood=0, food=0, stone=0, iron=0}
		if not self._isOk then
			return getRess
		end

		local grid = app:getCityMgr():getGridByGridId(self.gridId)
		if grid == nil then
			return getRess
		end
		
		for _, phase in ipairs(self.levelPhases) do
			local levelRes = ItemResUtil:findFieldLevelRes(grid.resId, phase.level)
			if levelRes ~= nil then
				for _, tag in ipairs(self.resTags) do
					getRess[tag] = getRess[tag] + phase.duration*self.soldierNumber*levelRes['get'..tag]/3600
				end
			end
		end
		
		local dispatchHero = self.selfField:getCurOccupyHero(self.gridId)
		for _, tag in ipairs(self.resTags) do
			local curRes = getRess[tag]
			local addvalBySkill = SkillEffectUtil:getAppendValByHeroSkillEffect(dispatchHero, RES_EFF.F_GETRES, curRes)
			curRes = curRes + addvalBySkill
			getRess[tag] = math.floor(curRes)
		end
		
		return getRess
	end;
	
	getItems = function(self)
		local pears = {}
		if not self._isOk then
			return pears
		end

		local grid = app:getCityMgr():getGridByGridId(self.gridId)
		if grid == nil then
			return {}
		end
		
		for _, phase in ipairs(self.levelPhases) do
			local levelRes = ItemResUtil:findFieldLevelRes(grid.resId, phase.level)
			if levelRes ~= nil then
				local times = math.floor(phase.duration/3600)
				for i=1, times, 1 do
					self:getOneTimeItemDrops(pears, levelRes.peardropid)
				end
			end
		end
		
		return pears
	end;
	
	getOneTimeItemDrops= function(self, outPears, pearDropId)
		local dispatchHero = self.selfField:getCurOccupyHero(self.gridId)
		local appendPro = SkillEffectUtil:getAppendValByHeroSkillEffect(dispatchHero, RES_EFF.F_GETGEM, 1)
		self.dropItem:handle(pearDropId, {appendPro=appendPro})
		local drops = self.dropItem:getDrops()
		for _, dropItem in ipairs(drops.items) do
			if outPears[dropItem.resid] == nil then
				outPears[dropItem.resid] = 0
			end
			outPears[dropItem.resid] = outPears[dropItem.resid] + dropItem.number
		end
	end;
	
	getLevelTimePhase = function(self)
		local startTime = self.selfField:getStartTime(self.gridId)
		if startTime == 0 then
			return {}
		end
		
		local grid = app:getCityMgr():getGridByGridId(self.gridId)
		if grid == nil then
			return {}
		end
		
		local lastRefreshTime = grid.refreshTime
		local curLevel = grid.level
		
		local phases = {}
		if startTime < lastRefreshTime then
			local lastLevel = math.clamp(curLevel+1, 1, res_max_field_level)
			local duration1 = math.clamp(lastRefreshTime - startTime, 0, res_max_collect_time)
			if duration1 > 0 then
				table.insert(phases, {level=lastLevel, duration=duration1})
			end
			
			local duration2 = math.clamp(self.curTime - lastRefreshTime, 0, res_max_collect_time - duration1)
			if duration2 > 0 then
				table.insert(phases, {level=curLevel, duration=duration2})
			end
		else
			local duration = math.clamp(self.curTime - startTime, 0, res_max_collect_time)
			if duration > 0 then
				table.insert(phases, {level=curLevel, duration=duration})
			end
		end
		
		return phases
	end;
	
	dictItemsToListItems = function(self, dictItems)
		local listItems = {}
		for resid, number in pairs(dictItems) do
			table.insert( listItems, {resid=resid, number=number})
		end
		return listItems
	end;
}):new()


