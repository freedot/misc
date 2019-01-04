--*******************************************************************************
--*******************************************************************************
PlayerCityRes = Class:extends({
	init = function(self, player)
		self.player = player
		self.citys = self.player:getCitys()
		self.farm = self.player:getFarm()
		self.cityres = self.player:getPersistVar().stCitys.stCRes
		self.tax = 1
	end;
	
	start = function(self)
		self:appendHurtValState()
	end;
	
	setTax = function(self, tax)
		self.tax = tax
	end;
	
	getTax = function(self)
		return self.tax
	end;
	
	setWood = function(self, w)
		if (w < 0) then w = 0 end
		self.cityres.ullWood = self:_toStoreRes(w)
	end;
	
	getWood = function(self)
		return self:_toFactRes(self.cityres.ullWood)
	end;
	
	addWood = function(self, addVal, notNeedTip)
		if ( addVal <= 0 ) then return end
		self:setWood(self:getWood() + addVal)
		self:_sendAddResTip(FIXID.WOOD, addVal, notNeedTip)
	end;
	
	_sendAddResTip = function(self, id, val, notNeedTip)
		if notNeedTip ~= true then
			WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. id .. '",' .. val )
		end
	end;
	
	subWood = function(self, subVal)
		if ( subVal <= 0 ) then return  end
		self:setWood(self:getWood() - subVal)
	end;
	
	setStone = function(self, s)
		if (s < 0) then s = 0 end
		self.cityres.ullStone = self:_toStoreRes(s)
	end;
	
	getStone = function(self)
		return self:_toFactRes(self.cityres.ullStone) 
	end;
	
	addStone = function(self, addVal, notNeedTip)
		if ( addVal <= 0 ) then return end
		self:setStone(self:getStone() + addVal)
		self:_sendAddResTip(FIXID.STONE, addVal, notNeedTip)
	end;
	
	subStone = function(self, subVal)
		if ( subVal <= 0 ) then return  end
		self:setStone(self:getStone() - subVal)
	end;
	
	setIron = function(self, r)
		if (r < 0) then r = 0 end
		self.cityres.ullIron = self:_toStoreRes(r)
	end;
	
	getIron = function(self)
		return self:_toFactRes(self.cityres.ullIron)
	end;	
	
	addIron = function(self, addVal, notNeedTip)
		if ( addVal <= 0 ) then return end
		self:setIron(self:getIron() + addVal)
		self:_sendAddResTip(FIXID.IRON, addVal, notNeedTip)
	end;
	
	subIron = function(self, subVal)
		if ( subVal <= 0 ) then return  end
		self:setIron(self:getIron() - subVal)
	end;
	
	setFood = function(self, f)
		if (f < 0) then f = 0 end
		self.cityres.ullFood = self:_toStoreRes(f)
	end;
	
	getFood = function(self)
		return self:_toFactRes(self.cityres.ullFood)
	end;
	
	addFood = function(self, addVal, notNeedTip)
		if ( addVal <= 0 ) then return end
		self:setFood(self:getFood() + addVal)
		self:_sendAddResTip(FIXID.FOOD, addVal, notNeedTip)
	end;
	
	subFood = function(self, subVal)
		if ( subVal <= 0 ) then return  end
		self:setFood(self:getFood() - subVal)
	end;
	
	setIdlePopu = function(self, idle)
		self.cityres.lIdlePopu = idle
		TaskFinisher:checkTasks(self.player)
	end;
	
	getIdlePopu = function(self)
		local maxpopu = self.citys:getMaxPopu()
		local maxidle = maxpopu - self.farm:getWorkforce();
		if ( self.cityres.lIdlePopu > maxidle ) then
			self:refreshIdlePopu()
		end
		
		return self.cityres.lIdlePopu
	end;
	
	refreshIdlePopu = function(self)
		local maxpopu = self.citys:getMaxPopu()
		local lapse = Util:getTime() - self:getILastTime()
		local cur = self.cityres.lIdlePopu + math.floor(lapse*res_idlepopu_output*maxpopu)
		local maxidle = maxpopu - self.farm:getWorkforce()
		if ( cur > maxidle ) then cur = maxidle end
		if ( self:getLevel() == 0 ) then cur = 0 end
		
		self:setILastTime( Util:getTime() )
		self:setIdlePopu(cur)
	end;
	
	onPopuChange = function(self)
		MoneySender:sendAll(self.player)
		PopuSender:sendAll(self.player)
	end;
	
	setILastTime = function(self, t)
		self.cityres.ulILastTime = t
	end;
	
	getILastTime = function(self)
		return self.cityres.ulILastTime
	end;
	
	setMoney = function(self, money)
		self.cityres.ullMoney = self:_toStoreRes(money)
		self:_formatMoneyByRange(res_maxres_beyond)
	end;
	
	getMoney = function(self)
		return self:_toFactRes(self.cityres.ullMoney)
	end;
	
	refreshMoney = function(self)
		local curtime = Util:getTime()
		if not self:_isBeyondMaxMoney() then
			local duration = curtime - self.cityres.ulMLastTime
			local drtmoney = duration * self:getMoneyOutput() / 3600
			self.cityres.ullMoney = self.cityres.ullMoney + self:_toStoreRes(drtmoney)
			self:_formatMoneyByRange(1)
		end
		self.cityres.ulMLastTime = curtime
	end;
	
	subMoney = function(self, money)
		local mymoney = self:getMoney()
		self:setMoney( math.max(0, (mymoney - money)) )
		MoneySender:send(self.player, {'money'})
	end;
	
	addMoney = function(self, money)
		if money <= 0 then
			return
		end
		
		local mymoney = self:getMoney()
		self:setMoney(mymoney + money)
		WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.MONEY .. '",' .. money )
		MoneySender:send(self.player, {'money'})
	end;
	
	cutMoney = function(self)
		self:_formatMoneyByRange(1)
		MoneySender:send(self.player, {'money'})
	end;
	
	cutCommRes = function(self)
		self:_formatCommResByRange('ullFood', 1)
		self:_formatCommResByRange('ullWood', 1)
		self:_formatCommResByRange('ullStone', 1)
		self:_formatCommResByRange('ullIron', 1)
		CommResSender:send(self.player, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON})
	end;
	
	getMLastTime = function(self)
		return self.cityres.ulMLastTime
	end;
	
	setMLastTime = function(self, t)-- 最近一次计算钱的更新时间
		self.cityres.ulMLastTime = t
	end;
	
	getMoneyOutput = function(self)
		return (self.farm:getWorkforce() + self:getIdlePopu())*(1 + self:_getBuffAddMoneyOutput() + self:_getVipEffectVal() )
	end;
	
	_getBuffAddMoneyOutput = function(self)
		local buffState = self.player:getStateContainer():getEffectState(RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT)
		local buffAdd = 0
		if buffState ~= nil and (buffState:getEffectValUnit() == VAL_UNIT.PER) then
			buffAdd = buffState:getEffectVal()/100
		end
		
		buffState = self.player:getStateContainer():getEffectState(RES_EFF.ZHANSHENZHIGUANG)
		if buffState ~= nil then
			buffAdd = buffState:getEffectVal()*10/100
		end
		
		return buffAdd
	end;
	
	_getVipEffectVal = function(self)
		return self.player:getVipEffectVal(VIP_EFF.ADD_MONEY_OUTPUT) / 100
	end;
	
	isFullLevel = function(self)
		return self:getLevel() >= res_max_city_level
	end;	
	
	getLevel = function(self)
		return self.cityres.ucLevel
	end;
	
	getMaxLevel = function(self)
		return self.cityres.lastMaxLevel
	end;
	
	setLevel = function(self, level)
		if self.cityres.ucLevel ~= level then
			self.cityres.ucLevel = level
			self:onCityLevelChange()
		end
	end;
	
	getTodayLostedBuildVal = function(self)
		if self.cityres.todayLostedBuildVal == 0 then
			return 0
		end
		
		local lastYearDay = os.date("*t", self.cityres.todayLostedBuildTime).yday
		local curYearDay = os.date("*t", Util:getTime()).yday
		if lastYearDay ~= curYearDay then
			self.cityres.todayLostedBuildVal = 0
		end
		
		return self.cityres.todayLostedBuildVal
	end;
	
	setTodayLostedBuildVal = function(self, lostBuildVal)
		if lostBuildVal < 0 then 
			return
		end
		
		self.cityres.todayLostedBuildVal = lostBuildVal
		self.cityres.todayLostedBuildTime = Util:getTime()
	end;
	
	getBuildHurtVal = function(self)
		return self.cityres.ulHurtBuildVal
	end;
	
	setBuildHurtVal = function(self, val)
		if ( val < 0 ) then val = 0 end
		if ( val > self:getBuildVal() ) then val = self:getBuildVal() end
		
		local lastVal = self:getCurBuildVal()
		
		self.cityres.ulHurtBuildVal = val
		
		self:_saveBuildValInGrid(lastVal)
		
		self:resetCityLevel()
	end;
	
	_saveBuildValInGrid = function(self, lastVal)
		if self:getCurBuildVal() ~= lastVal and self.player:getCityGrid() then
			self.player:getCityGrid().buildCurVal = self:getCurBuildVal()
			self.player:getCityGrid().misc.buildValTime = Util:getTime()
		end
	end;
	
	setBuildHurtValAndState = function(self, val)
		self:setBuildHurtVal(val)
		self:appendHurtValState()
	end;
	
	appendHurtValState = function(self)
		if self:getBuildHurtVal() > 0 then
			local stateContainer = self.player:getStateContainer()
			local stateRes = {type=EFFECT_TYPE.PER_MINUTE,duration=0xffffffff, effect={id=RES_EFF.HURT_BUILDVAL,val=0,unit=0}}
			local creator = {type=0,id=0,skillId=0}
			stateContainer:appendState(stateRes, creator)
		end
	end;
	
	getCurBuildVal = function(self)
		return self:getBuildVal() - self:getBuildHurtVal()
	end;
	
	getBuildVal = function(self)
		return self.cityres.ulBuildVal
	end;
	
	setBuildVal = function(self, val)
		local lastVal = self:getCurBuildVal()
		
		if val < 0 then
			val = 0
		end
		
		self.cityres.ulBuildVal = val
		if (self.cityres.ulBuildVal < self.cityres.ulHurtBuildVal) then
			self.cityres.ulHurtBuildVal = self.cityres.ulBuildVal
		end
		
		self:_saveBuildValInGrid(lastVal)
		
		self:resetCityLevel()
	end;
	
	addBuildVal = function(self, val)
		self:setBuildVal(self:getBuildVal() + val)
		TaskFinisher:checkTasks(self.player)
	end;
	
	subBuildVal = function(self, val)
		self:setBuildVal(self:getBuildVal() - val)
	end;
	
	getMaxBuildVal = function(self)
		local nextlevel = self.cityres.ucLevel+1
		local res = Util:qfind(res_citylevelneeds, 'level', nextlevel)
		if res == nil then -- full level
			res = Util:qfind(res_citylevelneeds, 'level', nextlevel-1)
		end
		return res.needbuildval
	end;
	
	getLevelByBuildVal = function(self, buildval)
		local level = 10000
		for i, res in ipairs(res_citylevelneeds) do
			if buildval < res.needbuildval then
				level = res.level - 1
				break;
			end
		end
		if level == 0 and buildval > 0 then
			level = 1
		end
		return level
	end;
	
	getFarmMaxBlockCount = function(self)
		local res = Util:qfind(res_citylevelneeds, 'level', self:getLevel())
		if res == nil then
			return 0
		end
		
		return res.farmBlock
	end;
	
	getFarmMaxBlockId = function(self)
		return self:getFarmMaxBlockCount()
	end;
	
	resetCityLevel = function(self)
		local curval = self:getCurBuildVal()
		local level = self:getLevelByBuildVal(curval)
		if level < self:getLevel() then
			self:setLevel(level)
		end
	end;
	
	onCityLevelChange = function(self)
		self:_resetLastMaxLevel()
		self:resetFarmBlockCount()
		self:resetRoleYoungState()
		self.player:refreshCityGrid()
		if self:getLevel() == 0 then
			self:_cityDie()
		end
	end;
	
	_resetLastMaxLevel = function(self)
		if self:getLevel() > self.cityres.lastMaxLevel then
			self.cityres.lastMaxLevel = self:getLevel()
		end
	end;
	
	resetFarmBlockCount = function(self)
		self.farm:delBlocksByMaxId( self:getFarmMaxBlockId() )
		FarmSender:sendAll(self.player, self.player)
	end;
	
	resetRoleYoungState = function(self)
		if (self.player:getState() ~= ROLE_STATE.YOUNG) then return end
		if (self:getLevel() < res_young_citylevel) then return end
		self.player:onYoungEnd()
	end;
	
	sendCityDie = function(self)
		CreateRoleSender:sendCityDieState(self.player)
		local pos = app:getCityMgr():getFreeCityPos( self.player:getCityId() )
		if pos == nil then
			CreateRoleSender:sendCityDieNoPos(self.player)
		else
			CreateRoleSender:sendCityDie(self.player, pos)
		end
	end;
	
	_cityDie = function(self)
		self:_giveupAllFieldsWhenDie()
		self:_returnAllArmysWhenDie()
				
		local mapGrid = self.player:getCityGrid()
		mapGrid.refreshTime = Util:getTime() + self:_getDieCityHoldDay()*24*3600
		app:getCityMgr():appendExileGrid(mapGrid)
		app:getCityMgr():freeCityPos(self.player:getCityPos())
		
		local exileGrid = app:getCityMgr():getExileGridByRoleId(self.player:getRoleId())
		self.player:setCityGrid(exileGrid)
		app:getCityMgr():mapRoleNameToRoleId(exileGrid.roleName, exileGrid.roleId)
	
		self:sendCityDie()
	end;
	
	_returnAllArmysWhenDie = function(self)
		self:_immediateReturnSelfArmys()
		self:_returnEnemyArmys()
		self:_returnAllianceArmys()
	end;
	
	_immediateReturnSelfArmys = function(self)
		local armyContainer = self.player:getArmyContainer()
		local selfArmyCount = armyContainer:getSelfArmyCount()
		for i=selfArmyCount-1, 0, -1 do
			local armyId = armyContainer:getSelfArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			local target = ArmyPlayerGetter:getTargetPlayer(army)
			self:_clearSelfArmyHerosState(army)
			app:getArmyMgr():removeArmy(self.player, target, armyId)
		end	
	end;
	
	_returnEnemyArmys = function(self)
		local armyContainer = self.player:getArmyContainer()
		local enemyArmyCount = armyContainer:getEnemyArmyCount()
		local callBack = CallBackArmyHdr:new()
		for i=enemyArmyCount-1, 0, -1 do
			local armyId = armyContainer:getEnemyArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			local source = ArmyPlayerGetter:getSourcePlayer(army)
			callBack:handle(source, {armyId = armyId})
		end
	end;
	
	_returnAllianceArmys = function(self)
		local armyContainer = self.player:getArmyContainer()
		local allianceArmyCount = armyContainer:getAllianceArmyCount()
		local repatriate = RepatriateArmyHdr:new()
		for i=allianceArmyCount-1, 0, -1 do
			local armyId = armyContainer:getAllianceArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			local target = ArmyPlayerGetter:getTargetPlayer(army)
			repatriate:handle(target, {armyId = armyId})
		end
	end;
	
	_clearSelfArmyHerosState = function(self, army)
		for _, heroId in ipairs(army.heros) do
			local hero = self.player:getHeroMgr():getHeroById(heroId)
			if hero ~= nil then
				hero:setState(HERO_STATE.FREE)
				HeroAttrSender:sendHerosState(self.player, {hero})
			end
		end
	end;
	
	_giveupAllFieldsWhenDie = function(self)
		local giveup = GiveUpFieldHandler:new()
		local selfField = self.player:getSelfField()
		local count = selfField:getCount()
		for i=count-1, 0, -1 do
			local grid = selfField:getFieldByIdx(0)
			giveup:handle(self.player, {fieldId=grid.gridId})
		end
	end;
	
	_getDieCityHoldDay = function(self)
		if self.cityres.lastMaxLevel < 4 then
			return 7
		elseif self.cityres.lastMaxLevel < 8 then
			return 15
		elseif self.cityres.lastMaxLevel < 11 then
			return 30
		else 
			return 60
		end
	end;
	
	_formatMoneyByRange = function(self,scale)
		local factmoney = self:_toFactRes(self.cityres.ullMoney)
		factmoney = WUtil:formatRange(0, self.citys:getMaxMoney()*scale, factmoney)
		self.cityres.ullMoney = self:_toStoreRes(factmoney)
	end;
	
	_formatCommResByRange = function(self,tag,scale)
		local factnum = self:_toFactRes(self.cityres[tag])
		factnum = WUtil:formatRange(0, self.citys:getMaxCRes()*scale, factnum)
		self.cityres[tag] = self:_toStoreRes(factnum)
	end;
	
	_isBeyondMaxMoney = function(self)
		local factmoney = self:_toFactRes(self.cityres.ullMoney)
		local maxmoney = self.citys:getMaxMoney()
		return factmoney >= maxmoney
	end;
	
	_toFactRes = function(self, storeres)
		return math.floor(storeres/RES_PRECISION)
	end;
	
	_toStoreRes = function(self, factres)
		return factres * RES_PRECISION
	end;
})


