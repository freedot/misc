--*******************************************************************************
CityDefHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetCityDefInfoHandler()
		self.handlers[2] = CancelCityDefBuildingHandler()
		self.handlers[3] = BuildCityDefHandler()
		self.handlers[4] = DownCityDefHandler()
		self.handlers[5] = SetDefArmyHandler()
	end;
})

GetCityDefInfoHandler = Class:extends({
	handle = function(self, player)
		PlayerCityDefSender:sendDefs(player)
		PlayerCityDefSender:sendBuilding(player)
		PlayerCityDefSender:sendDefArmy(player)
		PlayerTowerSender:sendTowers(player)
	end;
})

CancelCityDefBuildingHandler = Class:extends({
	handle = function(self, player)
		self:_initParams(player)
		
		if not self:_hasBuilding() then
			return false
		end
		
		self:_clearCityDefBuilding()
		self:_sendMsgs()
		
		return true
	end;
	
	_initParams = function(self, player)
		self.player = player
	end;
	
	_hasBuilding = function(self)
		return self.player:getCityDef():getBuildingResid() > 0
	end;
	
	_clearCityDefBuilding = function(self)
		local cityDef = self.player:getCityDef()
		cityDef:setBuildingResid(0)
		cityDef:setBuildingStopTime(0)
		cityDef:setBuildingNumber(0)
	end;
	
	_sendMsgs = function(self)
		PlayerCityDefSender:sendBuilding(self.player)
	end;
})

BaseCityDefHandler = Class:extends({
	_initParams = function(self, player, cmdtb)
		local defType = Util:getNumber(cmdtb, 'type')
		if (defType < CITYDEF_TYPE.FIRST) or (defType > CITYDEF_TYPE.LAST) then
			return false
		end
		
		local number = Util:getNumber(cmdtb, 'number')
		if number <= 0 then
			return false
		end
		
		self.defType = defType
		self.number = number
		self.player = player
		
		return true	
	end;
})

BuildCityDefHandler = BaseCityDefHandler:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if self:_hasBuilding() then
			return false
		end
		
		if not self:_hasEnoughCapacity() then
			return false
		end
		
		self:_createExpends()
		if not WUtil:isEnoughExpends(self.expends) then
			return false
		end
		
		WUtil:subExpends(self.expends)
		self:_startBuilding()
		self:_sendMsgs()
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.BUILD_CITY_DEF, self:_getResId(), self.number)
		
		return true
	end;

	_hasBuilding = function(self)
		return self.player:getCityDef():getBuildingResid() > 0
	end;
	
	_hasEnoughCapacity = function(self)
		return self.number <= self:_getLeftCapacity()
	end;
	
	_createExpends = function(self)
		local res = res_citydef[self.defType]
		local expendress = ExpendResMaker:makeExpendResWithNumber(res, self.number)
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
	end;

	_startBuilding = function(self)
		local cityDef = self.player:getCityDef()
		cityDef:setBuildingStopTime(Util:getTime() + self:_getNeedTime())
		cityDef:setBuildingResid(self:_getResId())
		cityDef:setBuildingNumber(self.number)
		global.getTimer():start(self:_getNeedTime()*1000, {TIMER_EVT.BUILD_CITYDEF_STOP, cityDef:getBuildingResid()}, self.player:getTimerCaller())
	end;
	
	_sendMsgs = function(self)
		PlayerCityDefSender:sendDefs(self.player)
		PlayerCityDefSender:sendBuilding(self.player)
	end;
	
	_getLeftCapacity = function(self)
		return self:_getTotalCapacity() - self:_getHasCityDefs()
	end;
	
	_getHasCityDefs = function(self)
		local number = 0
		local cityDef = self.player:getCityDef()
		for defType=CITYDEF_TYPE.FIRST, CITYDEF_TYPE.LAST, 1 do
			number = number + cityDef:getDefNumber(defType)
		end
		return number
	end;
	
	_getTotalCapacity = function(self)
		local wallBuildLevel = self.player:getCitys():getBuildLevelByResId(FIXID.WALLBUILD)
		local jiaolouLevels = self.player:getCitys():getBuildsLevelSum(FIXID.JIAOLOUBUILD)
		return math.floor(wallBuildLevel*200*(1 + jiaolouLevels/20));
	end;
	
	_getNeedTime = function(self)
		local res = res_citydef[self.defType]
		local role_interior = self.player:getAttrVal(ATTR.IN_B) + self.player:getAttrVal(ATTR.IN_A)
		local wallBuildLevel = self.player:getCitys():getBuildLevelByResId(FIXID.WALLBUILD)
		local unitTime = math.ceil(res.ntime/(1 + role_interior/100 + wallBuildLevel/20))
		return unitTime*self.number
	end;
	
	_getResId = function(self)
		return self.defType - CITYDEF_TYPE.FIRST +  FIXID.FIRSTCITYDEF
	end;
})

DownCityDefHandler = BaseCityDefHandler:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isEnoughNumber() then
			return false
		end
		
		self:_downCityDefs()
		self:_sendMsgs()
		
		return true
	end;
	
	_isEnoughNumber = function(self)
		return self.number <= self.player:getCityDef():getDefNumber(self.defType)
	end;
	
	_downCityDefs = function(self)
		local lastNumber = self.player:getCityDef():getDefNumber(self.defType)
		self.player:getCityDef():setDefNumber(self.defType, lastNumber-self.number)
	end;
	
	_sendMsgs = function(self)
		PlayerCityDefSender:sendDefs(self.player)
	end;
})

SetDefArmyHandler = Class:extends({
	init = function(self)
		self.herosHdr = NetCmdHerosHdr:new()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		self.player:getArmyContainer():setDefArmy(self.lineupId, self.heroIds)
		PlayerCityDefSender:sendDefArmy(self.player)
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.SET_CITY_DEF_ARMY)
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local lineupId = Util:getNumber(cmdtb, 'lineup')
		if not player:hasLineup(lineupId) then
			return false 
		end
		
		if not self.herosHdr:handleParam(player, cmdtb, MAX_DEFAULTTEAM_HERO_CNT) then
			return false
		end
		
		if self.herosHdr:getHeroIdsCount()  ~= MAX_DEFAULTTEAM_HERO_CNT then
			return false
		end
		
		self.player = player
		self.lineupId = lineupId
		self.heroIds = self.herosHdr:getHeroIds()
		
		return true
	end;
})


