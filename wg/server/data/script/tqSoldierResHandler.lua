SoldierResHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetSoldersHdr:new()
		self.handlers[2] = TrainSoldierHdr:new()
		self.handlers[3] = UpgradeSoldierHdr:new()
		self.handlers[4] = DemobSoldierHdr:new()
		self.handlers[8] = ConfirmSoldiersAssignHdr:new()
	end;
})

GetSoldersHdr = Class:extends({
	handle = function(self, player)
		RoleSoldierSender:sendSoldiers(player)
	end;
})

SoldierHdr = Class:extends({
	getCultureIdsList = function(self)
		return {120006,120011,120016,120021,120026}
	end;
	
	getExpends = function(self, needLevel)
		local needres = Util:qfind(res_soldiers_upd, 'level', needLevel);
		local expendress = {{attr=ATTR.MONEY, type=EXPEND_TYPE.MONEY, val=needres.money*self.number}
			,{id=FIXID.FOOD, type=EXPEND_TYPE.COMMRES, val=needres.food*self.number}}
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
		return true
	end;	
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.soldierMgr = self.player:getSoldierMgr()
		
		local number = Util:getNumber(cmdtb, 'num')
		if number <= 0 then return false end
		
		local resid = Util:getNumber(cmdtb, 'id')
		local hasNumber = self.soldierMgr:getSoldierNumber(resid)
		if number > hasNumber then return false end
		
		self.soldierId = resid
		self.number = number
		self.resid, self.level = WUtil:splitSoldierTotalResId(self.soldierId) 
		return true
	end;
})

TrainSoldierHdr = SoldierHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:getExpends(self.cultureLevel) then return end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		
		WUtil:subExpends(self.expends)
		self.player:setAttrVal(ATTR.NAF, self.player:getAttrVal(ATTR.NAF) - self.number )
		
		local resid = WUtil:makeSoldierResId(self.resid, self.cultureLevel)
		local soldierMgr = self.player:getSoldierMgr()
		soldierMgr:addSoldier({resid=resid, number=self.number})
		
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.NAF) )
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.AF) )
		RoleSoldierSender:sendSoldier(self.player, resid)
		
		local baseSoldierId, soldierLevel = ItemResUtil:splitResidLevel(resid)
		local level1SoldierId = ItemResUtil:makeSoldierId(baseSoldierId, 1)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.TRAIN_SOLDIER, level1SoldierId, soldierMgr:getSoldierNumber(resid))
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.resid = self:getSoldierResid(cmdtb)
		if self.resid == 0 then return false end
		
		self.cultureLevel = self:getCultureLevel()
		if self.cultureLevel == 0 then return false end
		
		self.number = self:getSoldierNumber(cmdtb)
		if self.number == 0 then return false end
		
		return true
	end;
	
	getSoldierResid = function(self, cmdtb)
		local resid = Util:getNumber(cmdtb, 'id')
		if (resid < FIXID.FIRSTSOLDIER or resid > FIXID.LASTSOLDIER) then return 0 end
		
		return resid
	end;
	
	getCultureLevel = function(self)
		local cultures = self.player:getCultures()
		local sidMaptoCid = self:getCultureIdsList()
		local mapidx = self.resid - FIXID.FIRSTSOLDIER + 1
		local cultureid = sidMaptoCid[mapidx]
		return cultures:getLevel( cultureid )
	end;
	
	getSoldierNumber = function(self, cmdtb)
		local number = Util:getNumber(cmdtb, 'num')
		if number <= 0 then return 0 end
		if number > self.player:getAttrVal(ATTR.NAF) then return 0 end
		if number > (self.player:getAttrVal(ATTR.MAF) - self.player:getAttrVal(ATTR.AF)) then return 0 end
		return number 
	end;
	
})

UpgradeSoldierHdr = SoldierHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:hasEnoughCultureLevel() then return end
		if not self:getExpends(self.level+1) then return end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		
		WUtil:subExpends(self.expends)
		self.soldierMgr:subSoldier({resid=self.soldierId, number=self.number})
		local newSoldierId = WUtil:makeSoldierResId(self.resid, self.level+1)
		self.soldierMgr:addSoldier({resid=newSoldierId, number=self.number})
		
		RoleSoldierSender:sendSoldiersByIds(self.player, {self.soldierId, newSoldierId});
	end;
	
	hasEnoughCultureLevel = function(self)
		local cultures = self.player:getCultures()
		local sidMaptoCid = self:getCultureIdsList()
		local mapidx = self.resid - FIXID.FIRSTSOLDIER + 1
		local cultureid = sidMaptoCid[mapidx]
		local cultureLevel = cultures:getLevel( cultureid )
		return self.level < cultureLevel
	end;	
})

DemobSoldierHdr = SoldierHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		
		self:returnRes()
		self.soldierMgr:subSoldier({resid=self.soldierId, number=self.number})
		RoleSoldierSender:sendSoldiersByIds(self.player, {self.soldierId});
		CommResSender:send(self.player, {FIXID.FOOD})
		MoneySender:send(self.player, {'money'})
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.AF) )
	end;
	
	returnRes = function(self)
		local needres = Util:qfind(res_soldiers_upd, 'level', self.level);
		local returnMoney = math.floor(needres.money*res_demob_soldier_retres_per)*self.number
		local returnFood = math.floor(needres.food*res_demob_soldier_retres_per)*self.number
		
		local cityres = self.player:getCityRes()
		cityres:setMoney(cityres:getMoney() + returnMoney)
		cityres:setFood(cityres:getFood() + returnFood)
	end;
})

ConfirmSoldiersAssignHdr = BaseSoldiersAssignHandler:extends({
	init = function(self)
		self.herosHdr = NetCmdHerosHdr:new()
		self.paramParser = NetCmdSoldierParser:new()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then return false end
		if self.herosHdr:hasRepeatHeros() then return false end
		if self.herosHdr:hasBusyHeros({[HERO_STATE.ACT_TOWER]=true, [HERO_STATE.ACT_TERRACE]=true}) then return false end
		if self.herosHdr:isEmptyHeros() then return false end
		
		if self:_hasNoAssignNoChange() then return false end
		if self:_hasBeyondHasSoldiersNumber() then return false end
		if self:_hasBeyondCommand() then return false end
		
		self:_takeOff()
		self:_confirmAllAssigns()
		self:_sendMsg()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		if not self.herosHdr:handleParam(player, cmdtb) then
			return false
		end
		
		self.soldiers = self.paramParser:getSoldiers(cmdtb, 100)
		if self.soldiers == nil then
			return false
		end
		
		self.player = player
		self.heros = self.herosHdr:getHeros()
		self.changedHeros = {}
		self.changedSoldiers = {}
		
		return true
	end;
	
	_getCurSoldierByIdx = function(self, idx)
		return self.heros[idx]:getSoldier()
	end;
	
	_getCarriedNumber = function(self, resid)
		local number = 0
		for i, _ in ipairs(self.soldiers) do
			local s = self:_getCurSoldierByIdx(i)
			if s.resid == resid then
				number = number + s.number
			end
		end
		return number
	end;
	
	_carrySoldier = function(self, idx, setSoldier)
		self.heros[idx]:carrySoldier(setSoldier)
		
		local baseSoldierId, soldierLevel = ItemResUtil:splitResidLevel(setSoldier.resid)
		local level1SoldierId = ItemResUtil:makeSoldierId(baseSoldierId, 1)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, level1SoldierId, setSoldier.number)
	end;	
	
	_recordChange = function(self, idx, resid)
		Util:insertUnique(self.changedSoldiers, nil, resid)
		Util:insertUnique(self.changedHeros, nil, self.heros[idx])
	end;
	
	_getCommand = function(self, idx)
		return self.heros[idx]:getAttrVal(ATTR.CO)
	end;
	
	_getHeroCount = function(self)
		return table.getn(self.heros)
	end;
	
	_clearSoldier = function(self, idx, setSoldier)
		self.heros[idx]:carrySoldier({resid=setSoldier.resid, number=0})
	end;
	
	_sendMsg = function(self)
		HeroAttrSender:sendCarrySoldiers(self.player, self.changedHeros)
		RoleSoldierSender:sendSoldiersByIds(self.player, self.changedSoldiers)
	end;
})

