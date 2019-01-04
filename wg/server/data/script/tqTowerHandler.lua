--*******************************************************************************
TowerHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = TowerSoldiersAssignHandler()
	end;
})

NetCmdSoldierParser = Class:extends({
	getSoldiers = function(self, cmdtb, maxCount)
		local count =  Util:getNumber(cmdtb, 'count')
		if (count <= 0) or (count > maxCount) then
			return nil
		end
		
		local soldiers = {}
		for i=1, count, 1 do
			local id = Util:getNumber(cmdtb, 'hid'..i)
			local resid = Util:getNumber(cmdtb, 'sid'..i)
			local number = Util:getNumber(cmdtb, 'snum'..i)
			if (resid ~= 0) and (not self:_isValidSoldierId(resid)) then
				return nil
			end
			
			if (resid == 0) and (number ~= 0) then
				return nil
			end
			
			if (resid > 0) and (number < 0) then
				return nil
			end
			
			table.insert(soldiers, {id=id, resid=resid, number=number})
		end
		
		return soldiers	
	end;
	
	_isValidSoldierId = function(self, resid)
		local baseId, level = ItemResUtil:splitResidLevel(resid)
		if Util:qfind(res_items_soldiers, 'id', baseId) == nil then 
			return false
		end
		
		return (level > 0) and (level <= table.getn(res_soldiers_upd))
	end;	
})

BaseSoldiersAssignHandler = Class:extends({
	_hasNoAssignNoChange = function(self)
		for i, setSoldier in ipairs(self.soldiers) do
			local curSoldier = self:_getCurSoldierByIdx(i)
			if (curSoldier.resid == setSoldier.resid) and (curSoldier.number == setSoldier.number) then 
				return true 
			end
		end
		return false
	end;
	
	_hasBeyondHasSoldiersNumber = function(self)
		for resid, number in pairs(self:_getNeedNumbers()) do
			if number > self:_getHasNumber(resid) then
				return true
			end
		end
		
		return false
	end;
	
	_getNeedNumbers = function(self)
		local needNumbers = {}
		for _, s in ipairs(self.soldiers) do
			if needNumbers[s.resid] == nil then
				needNumbers[s.resid] = 0
			end
			needNumbers[s.resid] = needNumbers[s.resid] + s.number
		end
		return needNumbers
	end;
	
	_getHasNumber = function(self, resid)
		if resid == 0 then
			return 0
		end
		
		local number = self.player:getSoldierMgr():getSoldierNumber(resid)
		return number + self:_getCarriedNumber(resid)
	end;
	
	_hasBeyondCommand = function(self)
		for i, setSoldier in ipairs(self.soldiers) do
			if setSoldier.number > self:_getCommand(i) then 
				return true 
			end
		end
		return false
	end;
	
	_takeOff = function(self)
		local count = self:_getHeroCount()
		for i=1, count, 1 do
			local s = self:_getCurSoldierByIdx(i)
			if (s.resid > 0) and (s.number > 0) then
				self.player:getSoldierMgr():addSoldier(s)
				self:_clearSoldier(i, s)
				self:_recordChange(i, s.resid)
			end
		end
	end;
	
	_confirmAllAssigns = function(self)
		for i, setSoldier in ipairs(self.soldiers) do
			self.player:getSoldierMgr():subSoldier(setSoldier)
			self:_carrySoldier(i, setSoldier)
			self:_recordChange(i, setSoldier.resid)
		end
	end;	
})

TowerSoldiersAssignHandler = BaseSoldiersAssignHandler:extends({
	init = function(self)
		self.paramParser = NetCmdSoldierParser:new()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then return false end
		if self:_hasInvalidTowerId() then return false end	
		if self:_hasNoAssignNoChange() then return false end
		if self:_hasRepeatTowerId() then return false end	
		if self:_hasBeyondHasSoldiersNumber() then return false end
		if self:_hasBeyondCommand() then  return false end
				
		self:_takeOff()
		self:_confirmAllAssigns()
		self:_sendMsgs()
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		self.soldiers = self.paramParser:getSoldiers(cmdtb, MAX_TEAM_HERO_CNT)
		if self.soldiers == nil then
			return false
		end
		
		self.player = player
		self.changedSoldiers = {}
		
		return true
	end;
	
	_hasInvalidTowerId = function(self)
		for _, s in ipairs(self.soldiers) do
			if (s.id < 1) or (s.id > MAX_TEAM_HERO_CNT) then
				return true
			end
		end
		return false
	end;
	
	_hasRepeatTowerId  = function(self)
		local existIds = {}
		for _, soldier in ipairs(self.soldiers) do
			if existIds[soldier.id] then
				return true
			end
			
			existIds[soldier.id] = true
		end
		
		return false
	end;
	
	_getCurSoldierByIdx = function(self, idx)
		local id = self.soldiers[idx].id
		local s = self.player:getArmyContainer():getTowerArmy().soldiers[id-1]
		return {id=id, resid=s.resid, number=s.number}
	end;
	
	_recordChange = function(self, idx, resid)
		Util:insertUnique(self.changedSoldiers, nil, resid)
	end;	
	
	_carrySoldier = function(self, idx, setSoldier)
		self.player:getArmyContainer():setTowerSoldier(setSoldier.id, setSoldier)
	end;
	
	_getCarriedNumber = function(self, resid)
		local number = 0
		local towerArmy = self.player:getArmyContainer():getTowerArmy()
		for i=0, MAX_TEAM_HERO_CNT-1, 1 do
			local s = towerArmy.soldiers[i]
			if s.resid == resid then
				number = number + s.number
			end
		end
		return number
	end;	
	
	_getCommand = function(self)
		local towerLevel = self.player:getCitys():getBuildLevelByResId(FIXID.TOWERBUILD)
		if towerLevel == 0 then
			return 0
		end
		
		local towerLevelRes = ItemResUtil:findBuildLevelres(FIXID.TOWERBUILD, towerLevel);
		local fieldHeroRes = ItemResUtil:findItemres(towerLevelRes.fieldheroid)
		return fieldHeroRes.maxnum
	end;	
	
	_getHeroCount = function(self) 
		return table.getn(self.soldiers)
	end;
	
	_clearSoldier = function(self, idx, setSoldier)
		self.player:getArmyContainer():setTowerSoldier(setSoldier.id, {resid=setSoldier.resid, number=0}) 
	end;
	
	_sendMsgs = function(self)
		PlayerTowerSender:sendTowers(self.player)
		RoleSoldierSender:sendSoldiersByIds(self.player, self.changedSoldiers)
	end;	
})


