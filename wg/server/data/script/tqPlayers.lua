Player = Class:extends({
	init = function(self)
		self.state = EGUS_LOGINNING
		self.id = 0
		self.connid = 0
		self.name = ''
		self._stopPay = false
		self.dbvar = nil
		self.citys = nil
		self.pkg = nil
		self.cityres = nil
		self.citydef = nil
		self.farm = nil
		self.cultures = nil
		self.heromgr = nil
		self.soldiermgr = nil
		self.friendMgr = nil
		self.armyContainer = nil
		self.favoriteContainer = nil
		self.enemyContainer = nil
		self.stateContainer = nil
		self.fightRefState = nil
		self.wall = nil
		self.selfField = nil
		self.cityGrid = nil
		self.succCopyFields = nil
		self.tradingArea = nil
		self.clientCfg = nil
		self.buyLimiter = nil
		self.objType = OBJ_TYPE.ROLE
		self.lastGetFieldsTimeMs = 0
		self.lastGetFieldsPos = {x=MAX_CITYMAP_W,y=MAX_CITYMAP_H}
		self.chatLastTime = {0,0,0,0}
		self.actTower = nil
		self.actTerrace = nil
		self.initOk_ = false
		self._timerCaller = TimerCaller:new(0)
		self._fixSaveDBTimer = FixTimer:new(SAVE_PLAYERDB_INTERVAL_S)
		self._fixRefreshRoleAttrTimer = FixTimer:new(res_refresh_roleattr_interval)
		self._fixRecalHeroAttrTimer = FixTimer:new(RECALC_HERO_ATTR_INTERVAL_S)
		self:_regTimers()
		self._platForm = {pfkey='', pf='', openid='', openkey='', appid=''}
		self._isValidRole = true
		self._deleted = false
	end;
	
	setDeleted = function(self)
		self._deleted = true
	end;
	
	isDeleted = function(self)
		return self._deleted
	end;
	
	setQQMembership = function(self, qqmembership)
		for k, v in pairs(qqmembership) do
			self.dbvar.stBInfos.qqMembership[k] = v
		end
	end;
	
	getQQMembership = function(self)
		return self.dbvar.stBInfos.qqMembership
	end;
	
	setPlatForm = function(self, platForm)
		self._platForm = platForm
	end;
	
	getPlatForm = function(self)
		return self._platForm
	end;
	
	getVipLevel = function(self)
		return self:getPersistVar().stMiscs.vip.level
	end;
	
	setVipLevel = function(self, level)
		self:getPersistVar().stMiscs.vip.level = level
		self:refreshCityGrid()
	end;
	
	checkUpgradeVipLevel = function(self)
		local payGold = self:getTask():getPayAct():getAllGold()
		local newLevel = 0
		local res = Util:find(res_vip, 'effid', VIP_EFF.PAY)
		for i, need in ipairs(res.effs) do
			local level = i-1
			if payGold >= need then newLevel = level end
		end
		
		if newLevel ~= self:getVipLevel() then
			self:_getVipItems(self:getVipLevel()+1, newLevel)
			self:setVipLevel(newLevel)
			
			self:getCitys():handleAutoBuilds()
			MoneySender:sendAll(self)
			PkgMiscSender:send(self, {'maxgrids'})
			self.friendMgr:resetMaxFriendCount()
			AutoBuildSender:sendInfo(self)
			
			RoleBaseSender:send(self, {'vip'})
		end
	end;
	
	_getVipItems = function(self, fromLevel, toLevel)
		local res = Util:find(res_vip, 'effid', VIP_EFF.VIP_ITEM)
		for level=fromLevel, toLevel do
			local idx = level + 1
			local rawItems = {RawItemEx({resId=res.effs[idx],number=1})}
			if not self:getPkg():addItems( rawItems ) then
				local mail = app:getMailMgr():addSysMail(self:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, rawItems)
				MailSender:sendBriefMail(self, mail)
			end
		end
	end;
	
	isRole = function(self)
		return self.objType == OBJ_TYPE.ROLE
	end;
	
	isOffline = function(self)
		return self.state == EGUS_OFFLINE_INGAME
	end;
	
	isDied = function(self)
		if self.cityGrid == nil then
			return false
		else
			return self.cityGrid.objType == OBJ_TYPE.DIED_ROLE 
		end
	end;
	
	isYellowDiamond = function(self)
		return self.dbvar.stBInfos.qqMembership.is_yellow_vip == 1 
			or self.dbvar.stBInfos.qqMembership.is_yellow_high_vip == 1 
			or self.dbvar.stBInfos.qqMembership.is_yellow_year_vip == 1 
	end;
	
	isYearYellowDiamond = function(self)
		return  self.dbvar.stBInfos.qqMembership.is_yellow_year_vip == 1 
	end;
	
	isBlueDiamond = function(self)
		return self.dbvar.stBInfos.qqMembership.is_blue_vip == 1 
			or self.dbvar.stBInfos.qqMembership.is_blue_high_vip == 1 
			or self.dbvar.stBInfos.qqMembership.is_blue_year_vip == 1 
	end;
	
	isYearBlueDiamond = function(self)
		return  self.dbvar.stBInfos.qqMembership.is_blue_year_vip == 1 
	end;	
	
	isHighBlueDiamond = function(self)
		return  self.dbvar.stBInfos.qqMembership.is_blue_high_vip == 1 
	end;	
	
	get3366Level = function(self)
		return self.dbvar.stBInfos.qqMembership._3366_grow_level
	end;
	
	getVipEffectVal = function(self, effectId)
		local res = Util:find(res_vip, 'effid', effectId)
		return res.effs[self:getVipLevel() + 1]
	end;
	
	hasVipEffect = function(self, effectId)
		return self:getVipEffectVal(effectId) > 0
	end;
	
	getTimerCaller = function(self)
		self._timerCaller:setId(self:getRoleId())
		return self._timerCaller
	end;
	
	recalRoleAppendAttrs = function(self)
		local citys = self:getCitys()
		local addval = self.citys:getBuildsLevelResSum(FIXID.SITUSHU, 'addinterior')
		local addVal2 = CultureEffectMgr:getEffectAddVal(self, self:getAttrVal(ATTR.IN_B), RES_EFF.ADD_ROLE_FOR)
		self:setAttrVal(ATTR.IN_A, addval + addVal2)
		
		addval = self.citys:getBuildsLevelResSum(FIXID.SIMASHU, 'addforce')
		addVal2 = CultureEffectMgr:getEffectAddVal(self, self:getAttrVal(ATTR.FOR_B), RES_EFF.ADD_ROLE_IN)
		self:setAttrVal(ATTR.FOR_A, addval + addVal2)
		
		RoleAttrSender:sendAttrsByIds(self, {ATTR.IN_A, ATTR.FOR_A})
	end;
	
	getChatLastTime = function(self, targetType)
		return self.chatLastTime[targetType+1]
	end;
	
	setChatLastTime = function(self, targetType, lastTime)
		self.chatLastTime[targetType+1] = lastTime
	end;
	
	getLastGetFieldsTimeMs = function(self)
		return self.lastGetFieldsTimeMs
	end;
	
	setLastGetFieldsTimeMs = function(self, timeMs)
		self.lastGetFieldsTimeMs = timeMs
	end;
	
	setLastGetFieldsPos = function(self, x, y)
		self.lastGetFieldsPos.x = x
		self.lastGetFieldsPos.y = y
	end;
	
	getLastGetFieldsPos = function(self)
		return self.lastGetFieldsPos
	end;
	
	clear = function(self)
		global.getTimer():clearCaller(self._timerCaller:getId())
	end;
	
	setValidRole = function(self, isValidRole)
		self._isValidRole = isValidRole
	end;
	
	save = function(self)
		if not self._isValidRole then
			return
		end
		
		if self._deleted then
			LOG('<error> save player after player is deleted!')
			return
		end
		
		if self.task ~= nil then
			self.task:getOnlineTask():onSave()
		end
		SPub:RoleSave(self.dbvar)
		
		if self.cityGrid ~= nil and self.cityGrid.objType == OBJ_TYPE.ROLE then
			app:getCityMgr():saveAllGrids(self.cityGrid)
		end
	end;
	
	tmpsave = function(self)
		if not self._isValidRole then
			return
		end
		
		if self.task ~= nil then
			self.task:getOnlineTask():onSave()
		end
		SPub:RoleSave(self.dbvar)
	end;
	
	startSaveDBTimer = function(self)
		self._fixSaveDBTimer:start(self:_getRandomTime(self._fixSaveDBTimer:getFrequency()), {TIMER_EVT.SAVEPLAYERDB}, self._timerCaller)
	end;
	
	startRecalcHeroAttrTimer = function(self)
		self._fixRecalHeroAttrTimer:start(self:_getRandomTime(self._fixRecalHeroAttrTimer:getFrequency()), {TIMER_EVT.RECALC_HERO_ATTR}, self._timerCaller)
	end;
	
	startRefreshRoleAttrTimer = function(self)
		self._fixRefreshRoleAttrTimer:start(self:_getRandomTime(self._fixRefreshRoleAttrTimer:getFrequency()), {TIMER_EVT.REFRESHROLEATTR}, self._timerCaller)
	end;
	
	_getRandomTime = function(self, duration)
		local time = Util:getTime() + math.random(duration/5, duration)
		return os.date('*t', time)
	end;
	
	_regTimers = function(self)
		self._timerCaller:register(TIMER_EVT.BUILDUP_STOP, Caller:new(0, self, self._onBuildUpStop))
		self._timerCaller:register(TIMER_EVT.BUILDDOWN_STOP, Caller:new(0, self, self._onBuildDownStop))
		self._timerCaller:register(TIMER_EVT.BUILD_CITYDEF_STOP, Caller:new(0, self, self._onBuildCityDefStop))
		self._timerCaller:register(TIMER_EVT.LEARN_CULTURE_STOP, Caller:new(0, self, self._onLearnCultureStop))
		self._timerCaller:register(TIMER_EVT.SSTEEL_HERO_STOP, Caller:new(0, self, self._onSSteelHeroStop))
		self._timerCaller:register(TIMER_EVT.SKILL_STEEL_HERO_STOP, Caller:new(0, self, self._onSkillSteelHeroStop))
		self._timerCaller:register(TIMER_EVT.HERO_UNLOCK_STOP, Caller:new(0, self, self._onHeroUnLockStop))
		self._timerCaller:register(TIMER_EVT.HERO_STEEL_STOP, Caller:new(0, self, self._onHeroSteelStop))
		self._timerCaller:register(TIMER_EVT.FARMGROWUP_STOP, Caller:new(0, self, self._onFarmGrowupStop))
		self._timerCaller:register(TIMER_EVT.PLAYER_BUFF, Caller:new(0, self, self._onUpdatePlayerBuffState))
		self._timerCaller:register(TIMER_EVT.SAVEPLAYERDB, Caller:new(0, self, self._onSavePlayerDB))
		self._timerCaller:register(TIMER_EVT.REFRESHROLEATTR, Caller:new(0, self, self._onRefreshRoleAttr))
		self._timerCaller:register(TIMER_EVT.RECALC_HERO_ATTR, Caller:new(0, self, self._onRecalcHeroAttr))
		self._timerCaller:register(TIMER_EVT.YOUNG_END, Caller:new(0, self, self._onYoundEnd))
		self._timerCaller:register(TIMER_EVT.GETGOLD_WHEN_PAY, Caller:new(0, self, self._onGetGoldWhenPay))
	end;
	
	_onBuildUpStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local cityid = params[2]
		local buildid = params[3]
		BuildUpStopTimerHdr:handle(self, cityid, buildid)
	end;
	
	_onBuildDownStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local cityid = params[2]
		local buildid = params[3]
		BuildDownStopTimerHdr:handle(self, cityid, buildid)
	end;
	
	_onBuildCityDefStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local cityDefResId = params[2]
		BuildCityDefStopTimerHdr:handle(self, cityDefResId)
	end;
	
	_onLearnCultureStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local cultureId = params[2]
		LearnCultureTimerHdr:handle(self, cultureId)
	end;
	
	_onSSteelHeroStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local heroId = params[2]
		SteelHeroSkeletonTimerHdr:handle(self, heroId)
	end;
	
	_onSkillSteelHeroStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local heroId = params[2]
		local skillId = params[3]
		SkillSteelHeroTimerHdr:handle(self, heroId, skillId)
	end;
	
	_onHeroUnLockStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local heroId = params[2]
		UnlockHeroTimerHdr:handle(self, heroId)
	end;
	
	_onHeroSteelStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local heroId = params[2]
		local startTime = params[3]
		local steelType = params[4]
		HeroSteelStopTimerHdr:handle(self, heroId, startTime, steelType)
	end;
	
	_onFarmGrowupStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local blockId = params[2]
		local blockSeqId = params[3]
		FarmStopTimerHdr:handle(self, blockId, blockSeqId)
	end;
	
	_onUpdatePlayerBuffState = function(self, timer, seq, curTime, params)
		local stateId = params[2]
		self.stateContainer:updateState(timer, stateId)
	end;
	
	_onSavePlayerDB = function(self, timer)
		if self:isDeleted() then
			LOG('<error> save player after player is deleted!, [_onSavePlayerDB] ')
		end	
		self:save()
	end;
	
	_onRefreshRoleAttr = function(self, timer)
		RefreshRoleAttrTimerHdr:handle(self)
	end;
	
	_onRecalcHeroAttr = function(self, timer)
		RecalHeroAttrTimerHdr:handle(self)
	end;
	
	_onYoundEnd = function(self, timer)
		timer:stop()
		self:onYoungEnd()
	end;
	
	startPay = function(self)
		self._stopPay = false
		global.getTimer():start(5*1000, {TIMER_EVT.GETGOLD_WHEN_PAY}, self:getTimerCaller())
	end;
	
	stopPay = function(self)
		self._stopPay = true
	end;
	
	_onGetGoldWhenPay = function(self, timer)
		if self._stopPay then
			timer:stop()
		end
		Service:getProxyServer():sendQueryGold(self)
	end;
	
	onTimer = function(self, hdr, eventid, curtimems, param1, param2)
		if eventid == TIMER_EVT.SAVEPLAYERDB then
			if self:isDeleted() then
				LOG('<error> save player after player is deleted!, [onTimer] ')
			end
			self:save()
		elseif eventid == TIMER_EVT.REFRESHROLEATTR then
			RefreshRoleAttrTimerHdr:handle(hdr, self)
		elseif eventid == TIMER_EVT.RECALC_HERO_ATTR then
			RecalHeroAttrTimerHdr:handle(hdr, self)
		end
	end;
	
	recalSendMaxNewSoldier = function(self)
		self:recalMaxNewSoldier()
		RoleAttrSender:sendAttrsByIds(self, {ATTR.NAF, ATTR.MNAF, ATTR.NAFO})
	end;

	recalMaxNewSoldier = function(self)
		local citys = self:getCitys()
		local levels = 0
		local builds = citys:getBuildsByResId(FIXID.BARBACK)
		for _, b in ipairs(builds) do
			levels = levels + b.ucLevel
		end
		
		local maxnaf = levels * 100
		self:setAttrVal(ATTR.MNAF, maxnaf)
		self:setAttrVal(ATTR.NAFO, maxnaf/12)
		self:refreshNewSoldiers()
	end;
	
	refreshNewSoldiers = function(self)
		local lapse = Util:getTime() - self:getNSLastTime()
		local output = self:getAttrVal(ATTR.NAFO)
		local maxaf = self:getAttrVal(ATTR.MNAF)
		local cur = self:getAttrVal(ATTR.NAF) + math.floor(lapse*output/3600)
		if (cur > maxaf) then cur = maxaf end
		
		self:setNSLastTime( Util:getTime() )
		self:setAttrVal(ATTR.NAF, cur)
	end;
	
	getFavoriteContainer = function(self)
		return self.favoriteContainer
	end;
	
	getEnemyContainer = function(self)
		return self.enemyContainer
	end;
	
	getObjType = function(self)
		return self.objType
	end;
	
	addDeclareState = function(self, roleId)
		return self.fightRefState:addDeclareState(roleId)
	end;
	
	getFightRefState = function(self, roleId)
		return self.fightRefState:getRefState(roleId)
	end;
	
	getFightRefStateObj = function(self)
		return self.fightRefState
	end;
	
	isFullFightRefState = function(self)
		return self.fightRefState:isFull()
	end;
	
	clearLineups = function(self)
		local military = self.dbvar.military
		military.lineupCount = 0
	end;
	
	addLineup = function(self, lineupId)
		if self:hasLineup(lineupId) then return end
		
		local military = self.dbvar.military
		if military.lineupCount == MAX_LINEUP_CNT then
			LOG('add lineup overflow')
			return 
		end
		
		local lineupRes = ItemResUtil:findItemres(lineupId)
		if lineupRes == nil then return end
		
		military.lineups[military.lineupCount] = lineupId
		military.lineupCount = military.lineupCount + 1
	end;
	
	hasLineup = function(self, lineupId)
		local military = self.dbvar.military
		return Util:findC(military.lineups, military.lineupCount, nil, lineupId) ~= nil
	end;
	
	getLineups = function(self)
		local military = self.dbvar.military
		return {lineups = military.lineups, count = military.lineupCount}
	end;
	
	setDefaultTeam = function(self, teamId, lineupId, heroIds)
		local teamIdx = teamId - 1
		if (teamIdx < 0) or (MAX_DEFAULTTEAM_CNT <=  teamIdx) then return end
		local lineupRes = ItemResUtil:findItemres(lineupId)
		if (lineupRes == nil) then return end
		if (table.getn(heroIds) ~= MAX_DEFAULTTEAM_HERO_CNT) then return end
		
		local military = self.dbvar.military
		local team = military.defaultTeams[teamIdx]
		team.lineupId = lineupId
		for i, heroId in ipairs(heroIds) do
			team.heroIds[i-1] = heroId
		end
	end;
	
	getDefaultTeam = function(self, teamId)
		local teamIdx = teamId - 1
		if (teamIdx < 0) or (MAX_DEFAULTTEAM_CNT <=  teamIdx) then return nil end
		local military = self.dbvar.military
		return military.defaultTeams[teamIdx]
	end;
	
	setTodayFightTimes = function(self, times)
		if (times.taofa < 0) or (times.cuihui < 0) or (times.tiaoxin < 0) then 
			return
		end
		
		local todayTimes = self.dbvar.military.todayFightTimes
		todayTimes.taofa = times.taofa
		todayTimes.cuihui = times.cuihui
		todayTimes.tiaoxin = times.tiaoxin
		todayTimes.fightowner = times.fightowner
		todayTimes.lastTime = Util:getTime()
	end;
	
	getTodayFightTimes = function(self)
		local todayTimes = self.dbvar.military.todayFightTimes
		local lastYearDay = os.date("*t", todayTimes.lastTime).yday
		local curYearDay = os.date("*t", Util:getTime()).yday
		if lastYearDay ~= curYearDay then
			todayTimes.taofa = 0
			todayTimes.cuihui = 0
			todayTimes.tiaoxin = 0
			todayTimes.fightowner = 0
		end
				
		return todayTimes
	end;
	
	getsuccCopyFields = function(self)
		return self.succCopyFields
	end;
	
	getTradingArea = function(self)
		return self.tradingArea
	end;
	
	getNSLastTime = function(self)
		local attrs = self.dbvar.stBInfos.stAttrs
		return attrs.ulNSLastTime
	end;
	
	setNSLastTime = function(self, lasttime)
		local attrs = self.dbvar.stBInfos.stAttrs
		attrs.ulNSLastTime = lasttime
	end;
	
	getAttrVal = function(self, attrid)
		local attr = self:getAttr(attrid)
		if attr ~= nil then 
			return attr.ulVal
		else
			return 0
		end
	end;
	
	setAttrVal = function(self, attrid, val)
		local attr = self:getAttr(attrid)
		if attr ~= nil then 
			attr.ulVal = val
			self:_onAttrValChange(attrid)
		end
	end;
	
	_onAttrValChange = function(self, attrid)
		if attrid == ATTR.FOR_B or attrid == ATTR.FOR_A then
			self:_recalHerosAttrs()
		end
	end;
	
	_recalHerosAttrs = function(self)
		local heroMgr = self:getHeroMgr()
		for i=1, heroMgr:getHeroCount(), 1 do
			local hero = heroMgr:getHeroByIdx(i-1)
			HeroAttrHelper:recalcAttrs(self, hero)
		end
	end;
	
	getAttr = function(self, attrid)
		local attrs = self.dbvar.stBInfos.stAttrs
		local attr = Util:findC(attrs.astAttrs, attrs.ucCount, 'usAttr', attrid)
		if attr == nil then
			return nil
		end
			
		self:recalcAttr(attr)
		return attr
	end;
	
	getAttrs = function(self)
		self:recalcAttrs()
		return self.dbvar.stBInfos.stAttrs
	end;
	
	recalcAttrs = function(self)
		self:calcAttrMXPS()
		self:calcAttrMAF()
		self:calcAttrAF()
	end;
		
	recalcAttr = function(self, attr)
		if attr.usAttr == ATTR.MXPS then
			self:calcAttrMXPS()
		elseif attr.usAttr == ATTR.MAF then
			self:calcAttrMAF()
		elseif attr.usAttr == ATTR.AF then
			self:calcAttrAF()
		end
	end;
	
	calcAttrMXPS = function(self)
		local attrs = self.dbvar.stBInfos.stAttrs
		local attr = Util:findC(attrs.astAttrs, attrs.ucCount, 'usAttr', ATTR.MXPS)
		if attr == nil then 
			return 
		end
		
		local role_interior = self:getAttrVal(ATTR.IN_B) + self:getAttrVal(ATTR.IN_A)
		attr.ulVal = res_calc_attr_MXPS(self:getLevel(), role_interior)
		return attr
	end;
	
	calcAttrMAF = function(self)
		local attrs = self.dbvar.stBInfos.stAttrs
		local attr = Util:findC(attrs.astAttrs, attrs.ucCount, 'usAttr', ATTR.MAF)
		if attr == nil then return end
		
		local role_force = self:getAttrVal(ATTR.FOR_B) + self:getAttrVal(ATTR.FOR_A)
		local addval = self.citys:getBuildsLevelResSum(FIXID.FHQBUILD, 'storesoldiernum')
		attr.ulVal = res_calc_attr_MAF(self:getLevel(), role_force, addval)
		return attr
	end;
	
	calcAttrAF = function(self)	
		local attrs = self.dbvar.stBInfos.stAttrs
		local attr = Util:findC(attrs.astAttrs, attrs.ucCount, 'usAttr', ATTR.AF)
		if attr == nil then return end
		
		local soldierSum = 0
		local soldierTypeCnt = self.soldiermgr:getSoldiersCount()
		for i=0, soldierTypeCnt-1, 1 do
			local soldier = self.soldiermgr:getSoldierByIdx(i)
			soldierSum = soldierSum + soldier.number
		end
			
		local heroCnt = self.heromgr:getHeroCount()
		for i=0, heroCnt-1, 1 do
			local hero = self.heromgr:getHeroByIdx(i)
			soldierSum = soldierSum + hero:getSoldier().number
		end
		
		attr.ulVal = soldierSum
		return attr
	end;	
	
	subXPSAttr = function(self, xpsVal)
		if xpsVal <= 0 then
			return
		end
		
		local xpsAttr = self:getAttr(ATTR.XPS)
		if xpsAttr.ulVal > xpsVal then
			xpsAttr.ulVal = xpsAttr.ulVal - xpsVal
		else
			xpsAttr.ulVal = 0
		end
	end;
	
	addXPSAttr = function(self, xpsVal, byItem)
		if xpsVal <= 0 then
			return
		end
		
		local mxpsAttr = self:getAttr(ATTR.MXPS)
		local xpsAttr = self:getAttr(ATTR.XPS)
		if (byItem ~= true) and ((xpsAttr.ulVal + xpsVal) > mxpsAttr.ulVal) then
			xpsAttr.ulVal = mxpsAttr.ulVal
		else
			xpsAttr.ulVal = xpsAttr.ulVal + xpsVal
		end
		RoleAttrSender:sendAttrsByIds(self, {ATTR.XPS} )
		WUtil:sendSysMsgArgs(self, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.HEROSEXP .. '",' .. xpsVal )
	end;
	
	addExp = function(self, expVal)
		if expVal <= 0 then
			return
		end
		
		expVal = math.floor(expVal)
		self:addRawExp(expVal)
		self:upgradeLevels()
		self:clearExpValWhenArriveMaxLevel()
		self:sendMsgWhenAddExp(expVal)
	end;
	
	subExp = function(self, expVal)
		if expVal <= 0 then
			return
		end
		
		expVal = math.floor(expVal)
		self:subRawExp(expVal)
		RoleAttrSender:sendAttrsByIds(self, {ATTR.XP} )
	end;
	
	addRawExp = function(self, expVal)
		local expAttr = self:getAttr(ATTR.XP)
		expAttr.ulVal = expAttr.ulVal + expVal
	end;
	
	subRawExp = function(self, expVal)
		local expAttr = self:getAttr(ATTR.XP)
		expAttr.ulVal = expAttr.ulVal - expVal
	end;
	
	upgradeLevels = function(self)
		while self:isCanUpgrade() do
			self:upgradeLevel()
		end
	end;
	
	clearExpValWhenArriveMaxLevel = function(self)
		if self:isArriveMaxLevel() then
			local expAttr = self:getAttr(ATTR.XP)
			expAttr.ulVal = 0
		end
	end;
	
	sendMsgWhenAddExp = function(self, expVal)
		RoleAttrSender:sendAttrsByIds(self, {ATTR.XP, ATTR.NXP, ATTR.PP, ATTR.PS} )
		RoleBaseSender:send(self, {'level'})
		WUtil:sendSysMsgArgs(self, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.ROLEEXP .. '",' .. expVal )
	end;
	
	isCanUpgrade = function(self)
		if self:isArriveMaxLevel() then
			return false
		end
		
		local expAttr = self:getAttr(ATTR.XP)
		local nextAttr = self:getAttr(ATTR.NXP)
		
		if expAttr.ulVal <  nextAttr.ulVal then 
			return false 
		end
		
		return true
	end;	
	
	isArriveMaxLevel = function(self)
		local maxLevel = res_rolelevelexps[table.getn(res_rolelevelexps)].level
		return self:getLevel() >= maxLevel
	end;
	
	upgradeLevel = function(self)
		local expAttr = self:getAttr(ATTR.XP)
		local nextAttr = self:getAttr(ATTR.NXP)
		
		expAttr.ulVal = expAttr.ulVal - nextAttr.ulVal
		
		local nextLevel = self:getLevel() + 1
		self:setLevel(nextLevel)
		
		self:addPPs(self:getLevel())
		
		self:setNextXP()
		self:setMaxPS()
		self:setPStoMax()
		
		TaskFinisher:checkTasks(self)
		self:getTask():getEveryDayTask():randTasks()
	end;
	
	addPPs = function(self, level)
		local ppattr = self:getAttr(ATTR.PP)
		ppattr.ulVal = ppattr.ulVal + res_getrole_pps_bylevel(level)
	end;
	
	setNextXP = function(self)
		local res = Util:qfind(res_rolelevelexps, 'level', self:getLevel()+1)
		if res ~= nil then
			local nxpattr = self:getAttr(ATTR.NXP)
			nxpattr.ulVal = res.needexp
		end
	end;
	
	setMaxPS = function(self)
		local res = Util:qfind(res_rolelevelexps, 'level', self:getLevel())
		self:setAttrVal(ATTR.MPS, res.maxps )
	end;
	
	setPStoMax = function(self)
		local res = Util:qfind(res_rolelevelexps, 'level', self:getLevel())
		self:setAttrVal(ATTR.PS, res.maxps )
	end;

	setGameState = function(self, state)
		self.state = state;
	end;
	
	getGameState = function(self)
		return self.state;
	end;
	
	setState = function(self, state)
		local oldState = self.dbvar.stBInfos.ucState
		self.dbvar.stBInfos.ucState = state
		self:refreshCityGrid()
		self:_appendOrRemoveYoungEffectState(oldState)
	end;
	
	_appendOrRemoveYoungEffectState = function(self, oldState)
		if self:getState() == ROLE_STATE.YOUNG then
			local stateRes = {type=EFFECT_TYPE.PERDURE, duration=res_young_days*24*3600, effect={id=RES_EFF.YOUNG_STATE, val=0, unit=0}}
			local creator = {type=0,id=0,skillId=0}
			self:getStateContainer():appendState(stateRes, creator)
		elseif oldState == ROLE_STATE.YOUNG then
			self:getStateContainer():stopState(RES_EFF.YOUNG_STATE)
		end
	end;
	
	getState = function(self)
		return self.dbvar.stBInfos.ucState
	end;

	setId = function(self, id)
		self.id = id
	end;
	
	getId = function(self)
		return self.id
	end;
	
	getRoleId = function(self)
		return self.dbvar.ullRoleId
	end;
	
	setRoleId = function(self, roleid)
		self.dbvar.ullRoleId = roleid
		self:refreshCityGrid()
	end;
	
	getRoleName = function(self)
		return self.dbvar.szRName
	end;
	
	setRoleName = function(self, name)
		self.dbvar.szRName = name
		self:refreshCityGrid()
	end;
	

	setConnId = function(self, connid)
		self.connid = connid
	end;
	

	getConnId = function(self)
		return self.connid
	end;
	
	getGMFlag = function(self)
		return Service:getGmDB():getFlag(self:getName())
	end;
	
	setGMFlag = function(self, gmflag)
		--self.dbvar.stBInfos.ucGM = gmflag
	end;

	setPersistVar = function(self, dbvar)
		self.dbvar = dbvar
	end;
	
	loginStart = function(self)
		self:setCityGrid( app:getCityMgr():getGridByRoleId( self:getRoleId() ) )
		self:_createObjects()
		self:_initObjects()
		self:refreshCityGrid()
		self.task:getOnlineTask():onLoginOk()
	end;
	
	loginOk = function(self)
		self.tradingArea:start()
		self.task:getEveryDayTask():start()
		self.task:getDoingRoleTask():start()
		self.task:getActTask():start()
		self.cityres:start()
		self.stateContainer:start()
	end;
	
	_createObjects = function(self)
		self.citys = PlayerCitys:new(self)
		self.pkg = PlayerPackage:new(self)
		self.farm = PlayerFarm:new(self.dbvar.stFarms)
		self.cityres = PlayerCityRes(self)
		self.citydef = PlayerCityDef(self)
		self.heromgr = PlayerHeroMgr(self)	
		self.soldiermgr = PlayerSoldierMgr(self)
		self.cultures = PlayerCultures(self)
		self.friendMgr = PlayerFriendMgr(self)
		self.armyContainer = ArmyContainer(self)
		self.favoriteContainer = FavoriteContainer(self)
		self.enemyContainer = EnemyContainer(self)
		self.fightRefState = PlayerFightRefState:new(self)
		self.tradingArea = TradingArea:new(self)
		self.wall = PlayerWall(self)
		self.selfField = PlayerSelfField(self)
		self.succCopyFields = MapCppSet(self.dbvar.military, 'succCopyFieldCount', 'succCopyFields', nil, MAX_SUCC_COPYFIELD_CNT)
		self.inviteJoinAlliances = MapCppSet(self.dbvar.stMiscs, 'inviteJoinAllianceCount', 'inviteJoinAlliances', 'allianceId', MAX_INVITE_JOIN_ALLI_CNT)
		self.stateContainer = StateContainer:new(self, self:getPersistVar().states, MAX_CITY_STATES_CNT)
		self.actTower = PlayerActTower:new(self)
		self.actTerrace = PlayerActTerrace:new(self)
		self.task = PlayerTask:new(self)
		self.clientCfg = PlayerClientCfg:new(self)
		self.buyLimiter = PlayerBuyLimiter:new(self)
		self.cdkeytypes_ = MapCppSet(self.dbvar.stMiscs.cdkey, 'count', 'types', nil, MAX_CDKEY_CNT)
		
		self.initOk_ = true 
	end;
	
	_initObjects = function(self)
		self.farm:setPlayer(self)
	end;
	
	getCityGrid = function(self)
		return self.cityGrid
	end;
	
	setCityGrid = function(self, cityGrid)
		self.cityGrid = cityGrid
	end;
	
	getTask = function(self)
		return self.task
	end;
	
	getBuyLimiter = function(self)
		return self.buyLimiter
	end;
	
	getClientCfg = function(self)
		return self.clientCfg
	end;
	
	refreshCityGrid = function(self)
		if self.cityGrid == nil or not self.initOk_ then
			return
		end

		self.cityGrid.roleId = self:getRoleId()
		self.cityGrid.modelId = self:getCityModel()
		self.cityGrid.roleName = self:getRoleName()
		self.cityGrid.userName = self:getName()
		self.cityGrid.subCitys = self:_getSubCitysStr()
		self.cityGrid.level = self:getLevel()
		self.cityGrid.sex = self:getSex()
		self.cityGrid.state = self:getState()
		self.cityGrid.icon = self:getIcon()
		self.cityGrid.allianceId = self:getAlliId()
		--self.cityGrid.enemyAlliId = 0
		self.cityGrid.alliName = app:getAlliMgr():getAlliById(self:getAlliId()):getName()
		self.cityGrid.cityLevel = self.cityres:getLevel()
		self.cityGrid.buildCurVal = self.cityres:getCurBuildVal()
		self.cityGrid.misc.cityMaxLevel =  self.cityres:getMaxLevel()
		self.cityGrid.introduction = self:getIntroduction()
		self.cityGrid.misc.shiChangLevel =  self:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD) -- 市场等级
		self.cityGrid.misc.towerLayer = self.actTower:getMaxLayer()
		self.cityGrid.misc.towerTime =  self.actTower:getMaxLayerTime()
		self.cityGrid.misc.vip_level =  self:getVipLevel()
		
		--qq member info
		for _, k in ipairs(g_qqMembershipFields) do
			self.cityGrid.misc[k] =  self.dbvar.stBInfos.qqMembership[k]
		end
		
		local maxGate = self.actTerrace:getMaxGate()
		local curMaxGateId = maxGate.gateId
		if maxGate.subGateId < res_act_terrace_max_subgate_id then
			curMaxGateId = curMaxGateId - 1
		end
		self.cityGrid.misc.terraceGate =  curMaxGateId
	end;
	
	_getSubCitysStr = function(self)
		local s = ''
		local maxCityId = self:getCitys():getCityCount()
		for cityId=BUILDCITY_ID.SUB1, maxCityId, 1 do
			local type = self:getCitys():getCityById(cityId):getType()
			if s ~= '' then
				s = s .. ','
			end
			s = s .. type
		end
		return s
	end;
	
	getPersistVar = function(self)
		return self.dbvar
	end;
	
	getCitys = function(self)
		return self.citys
	end;
	
	getActTower = function(self)
		return self.actTower
	end;
	
	getActTerrace = function(self)
		return self.actTerrace
	end;
	
	getStateContainer = function(self)
		return self.stateContainer
	end;	
	
	getPkg = function(self)
		return self.pkg
	end;
	
	getFarm = function(self)
		return self.farm
	end;
	
	getCityRes = function(self)
		return self.cityres
	end;
	
	getCityDef = function(self)
		return self.citydef
	end;
	
	getHeroMgr = function(self)
		return self.heromgr
	end;
	
	getFriendMgr = function(self)
		return self.friendMgr
	end;
	
	getSoldierMgr = function(self)
		return self.soldiermgr
	end;
	
	getCultures = function(self)
		return self.cultures
	end;
	
	getArmyContainer = function(self)
		return self.armyContainer
	end;
	
	getWall = function(self)
		return self.wall
	end;
	
	getSelfField = function(self)
		return self.selfField
	end;
	
	getPrestige = function(self)
		return self.dbvar.stBInfos.ulPrestige
	end;
	
	setPrestige = function(self, prestige)
		self.dbvar.stBInfos.ulPrestige = prestige
	end;
	
	getCityHonor = function(self)
		return self.dbvar.stBInfos.ulCityHonor
	end;

	setCityHonor = function(self, honor)
		self.dbvar.stBInfos.ulCityHonor = honor
	end;
	
	getCityCD = function(self)
		return self.dbvar.stBInfos.ulCityCD
	end;
	
	setCityCD = function(self, cd)
		self.dbvar.stBInfos.ulCityCD = cd
	end;
	
	getLevel = function(self)
		return self.dbvar.stBInfos.ucLevel
	end;
	
	setLevel = function(self, level)
		self.dbvar.stBInfos.ucLevel = level
		self:refreshCityGrid()
	end;
	
	getCityModel = function(self)
		local level = self.cityres:getLevel()
		local modelIds = {
			{min=0, max=5, id=170501},
			{min=6, max=10, id=170502},
			{min=11, max=15, id=170503},
			{min=16, max=100, id=170504},
		}
		
		for _, m in ipairs(modelIds) do
			if level >= m.min and level <= m.max then
				return m.id
			end
		end
	end;
	
	getIcon = function(self)
		return self.dbvar.stFixVar.ucIcon
	end;
	
	setIcon = function(self, icon)
		self.dbvar.stFixVar.ucIcon = icon
		self:refreshCityGrid()
	end;	
	
	getCityId = function(self)
		return self.dbvar.stFixVar.ulCityId
	end;
	
	
	setCityId = function(self, cityid)
		self.dbvar.stFixVar.ulCityId = cityid
	end;
	
	
	getCityPos = function(self)
		return {x=self.dbvar.stFixVar.ulCPosX, y=self.dbvar.stFixVar.ulCPosY}
	end;
	
	
	setCityPos = function(self, pos)
		self.dbvar.stFixVar.ulCPosX = pos.x
		self.dbvar.stFixVar.ulCPosY = pos.y
	end;
	
	
	getSex = function(self)
		return self.dbvar.ucSex
	end;
	
	setSex = function(self, sex)
		self.dbvar.ucSex = sex
		self:refreshCityGrid()
	end;
	

	getName = function(self)
		return self.name
	end;
	

	setName = function(self, name)
		self.name = name
		self:refreshCityGrid()
	end;
	

	setUserKey = function(self, key)
		if IsDebug() then print('---[s->c]: send user key. '..key) end
		SPub:SendUseKeyCmd(self.id, self.connid, key)
	end;
	

	sendMsg = function(self, msg)
		if self.state == EGUS_OFFLINE_INGAME then 
			return 
		end
		
		if msg == '' or msg == nil then 
			assert(false, 'send message is empty')
			return
		end
		if IsDebug() then 
			print('---[s->c]: send data = '..msg) 
		end
		SPub:SendMsg(self.id, self.connid, msg)
	end;
	

	sendUserExit = function(self)
		self:sendNotify(MSG_CMD_USEREXIT_SC);
	end;
	

	sendNotifyLoginOk = function(self)
		self:sendNotify(MSG_CMD_USERLOGINOK_SC);
	end;
	
	sendNotify = function(self, cmd)
		if self.state == EGUS_OFFLINE_INGAME then 
			return 
		end
		
		if IsDebug() then print('---[s->c]: send notify cmd: '..cmd) end
		SPub:SendMsgNotifyCmd(self.id, self.connid, cmd)
	end;

	getRanking = function(self)
		if self.cityGrid == nil then
			return 0
		end
		return self.cityGrid.roleRank
	end;
	
	setIntroduction = function(self, intro)
		if self.cityGrid == nil then return end
		self.cityGrid.introduction = intro
	end;
	
	getIntroduction = function(self)
		if self.cityGrid == nil then return '' end
		return self.cityGrid.introduction
	end;
	
	exitAlliance = function(self, alliMem)
		self:_returnItemsWhenMyIsSeller()
		self:_returnContributeCard(alliMem)
		self:setAlliId(0)
	end;
	
	_returnItemsWhenMyIsSeller = function(self)
		local alliance = app:getAlliMgr():getAlliById(self:getAlliId())
		local count = alliance:getItemPkg():getItemCount()
		for i=count-1, 0, -1 do
			local item = alliance:getItemPkg():getItemByIdx(i)
			self:_returnContributeToBuyerWhenMyIsSeller(item)
			if self:_returnItemWhenMyIsSeller(item) then
				alliance:getItemPkg():removeItemByIdx(i)
			end
		end
	end;
	
	_returnItemWhenMyIsSeller = function(self, item)
		if item.seller ~= self:getRoleName() then	return false end
		local rawItems = DropItem():createRawItems({{resid=item.resid,number=item.num}})
		local mail = app:getMailMgr():addSysMail(item.seller, rstr.mail.title.returnSellItemWhenExitAlli, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.returnSellItemWhenExitAlli, rawItems)
		MailSender:sendBriefMail(self, mail)
		return true
	end;
	
	_returnContributeToBuyerWhenMyIsSeller = function(self, item)
		if item.seller ~= self:getRoleName() then	return end
		if item.buyer == '' then return end
		
		local roleId = app:getCityMgr():getRoleIdByRoleName(item.buyer)
		local allianceId = app:getCityMgr():getAlliIdByRoleName(item.buyer)
		local alliance = app:getAlliMgr():getAlliById(allianceId)
		local mem = alliance:getMemberById( roleId )
		if mem == nil then return end
		
		mem:setContributes(mem:getContributes() + item.cur)
		local mail = app:getMailMgr():addSysMail(item.buyer, rstr.mail.title.returnContributeWhenExitAlli, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.returnContributeWhenExitAlli,item.cur))
		local player = app:getPlayerMgr():getOnlinePlayerByRoleName(item.buyer)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
			AllianceSender:sendSelfContributes(player, alliance)
		end
	end;
	
	_returnContributeCard = function(self, alliMem)
		local contrib = alliMem:getContributes()
		local cardCount = math.floor((contrib*0.6)/100)
		if cardCount > 0 then
			local rawItems = DropItem():createRawItems({{resid=FIXID.ALLI_CONTRIB_CARD,number=cardCount}})
			local mail = app:getMailMgr():addSysMail(self:getRoleName(), rstr.mail.title.exitAlliReturnContrib, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.exitAlliReturnContrib, rawItems)
			MailSender:sendBriefMail(self, mail)
		end	
	end;
	
	getAlliId = function(self)
		return self.dbvar.stBInfos.ullAlliance
	end;
	
	setAlliId = function(self, allianceId)
		self.dbvar.stBInfos.ullAlliance = allianceId
		self:refreshCityGrid()
		
		if allianceId == self:getEnemyAlliId() then
			self:setEnemyAlliId(0)
		end
	end;
	
	setEnemyAlliId = function(self, allianceId)
		if self.cityGrid == nil then
			return
		end
		
		self.cityGrid.enemyAlliId = allianceId
	end;
	
	getEnemyAlliId = function(self)
		if self.cityGrid == nil then
			return 0
		end
		
		return self.cityGrid.enemyAlliId
	end;
	
	onYoungEnd = function(self)
		if self:getState() == ROLE_STATE.YOUNG then
			self:setState(ROLE_STATE.FREE)
			RoleBaseSender:send(self, {'state'})
			local mail = app:getMailMgr():addSysMail(self:getRoleName(), rstr.mail.title.youngStateEnd, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.youngStateEnd, nil)
			MailSender:sendBriefMail(self, mail)
			WUtil:sendPopBoxMsg(self, rstr.mail.content.youngStateEnd)
		end
	end;
	
	refreshPSAttr = function(self)
		local curDate = os.date("*t", Util:getTime())
		if self.dbvar.stBInfos.stAttrs.lastPSRefreshDay == curDate.yday then
			return
		end

		self:setAttrVal(ATTR.PS, self:getAttrVal(ATTR.MPS))
		self.dbvar.stBInfos.stAttrs.lastPSRefreshDay = curDate.yday
	end;
	
	addAttrPs = function(self, addPs, canBeyondMax)
		local newVal = self:getAttrVal(ATTR.PS) + addPs
		if not canBeyondMax and newVal > self:getAttrVal(ATTR.MPS) then
			newVal = self:getAttrVal(ATTR.MPS)
		end
		self:setAttrVal(ATTR.PS, newVal)
		RoleAttrSender:sendAttrsByIds(self, {ATTR.PS})
		WUtil:sendSysMsgArgs(self, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.ROLEPS .. '",' .. addPs )
	end;
	
	setCurApplyAlliance = function(self, name)
		self.dbvar.stMiscs.applyAlliance = name
	end;
	
	getCurApplyAlliance = function(self)
		return self.dbvar.stMiscs.applyAlliance
	end;
	
	getInviteJoinAlliances = function(self)
		return self.inviteJoinAlliances
	end;
	
	getRegTime = function(self)
		return self.dbvar.regTime
	end;
	
	setRegTime = function(self, regTime)
		self.dbvar.regTime = regTime
	end;
	
	getLockToTime = function(self)
		return self.dbvar.lockToTime
	end;
	
	setLockToTime = function(self, lockToTime)
		self.dbvar.lockToTime = lockToTime
	end;
	
	getCdKeys = function(self)
		return self.cdkeytypes_
	end;
	
	getTodayHasHonor = function(self)
		self:_resetTodayHasHonor()
		return self.dbvar.military.todayHonor.hasHonor
	end;
	
	subTodayHasHonor = function(self, honor)
		self.dbvar.military.todayHonor.hasHonor = self.dbvar.military.todayHonor.hasHonor - honor
	end;
	
	getTodayGetHonor = function(self)
		self:_resetTodayGetHonor()
		return self.dbvar.military.todayHonor.getHonor
	end;
	
	addTodayGetHonor = function(self, honor)
		self:_resetTodayGetHonor()
		self.dbvar.military.todayHonor.getRefreshTime = Util:getTime()
		self.dbvar.military.todayHonor.getHonor = self.dbvar.military.todayHonor.getHonor + honor
	end;
	
	_resetTodayGetHonor = function(self)
		if not Util:isCurDay(self.dbvar.military.todayHonor.getRefreshTime) then
			self.dbvar.military.todayHonor.getHonor = 0
			self.dbvar.military.todayHonor.getRefreshTime = Util:getTime()
		end
	end;
	
	_resetTodayHasHonor = function(self)
		if not Util:isCurDay(self.dbvar.military.todayHonor.hasRefreshTime) then
			self.dbvar.military.todayHonor.hasHonor = res_today_init_has_honor
			self.dbvar.military.todayHonor.hasRefreshTime = Util:getTime()
		end	
	end;	
})

PlayerCitys = Class:extends({
	init = function(self, player)
		self.player = player
		self.autoBuilds =  MapCppSet(self.player:getPersistVar().stCitys, 'waitBuildCount', 'waitBuilds', nil, MAX_WAIT_BUILDS_CNT)
		self:initCitys()
	end;
	
	initCitys = function(self)
		self.citys = {}
		local citys = self.player:getPersistVar().stCitys
		for i=0, citys.ucTotal-1, 1 do
			local city = PlayerCity:new(self.player, citys.astCitys[i])
			table.insert(self.citys, city)
		end
		
		for cityid, city in ipairs(self.citys) do
			self:initCityBuilds(cityid, city)
		end
	end;
	
	initCityBuilds = function(self, cityid, city)
		if city:getType() == CITY_TYPE.NONE then 
			return 
		end
		
		local builds = city:getBuilds()
		for i=(builds.ucTotal-1), 0, -1 do
			local b = builds.astInBuilds[i]
			local needtime = math.max((b.ulStoptime - Util:getTime()), 0)
			if b.ucState == BUILD_STATE.UPGRADE then
				global.getTimer():start(needtime*1000, {TIMER_EVT.BUILDUP_STOP, cityid, b.ulId}, self.player:getTimerCaller())
			elseif b.ucState == BUILD_STATE.DOWN then
				global.getTimer():start(needtime*1000, {TIMER_EVT.BUILDDOWN_STOP, cityid, b.ulId}, self.player:getTimerCaller())
			end
		end
	end;
	
	clearCitys = function(self)
		self.citys = {}
		local citys = self.player:getPersistVar().stCitys
		citys.ucTotal = 0
	end;
	
	clearSubCitys = function(self)
		self.citys = {self.citys[1]}
		local citys = self.player:getPersistVar().stCitys
		citys.ucTotal = 1
	end;
	
	getExchangeExpTodayTimes = function(self)
		self:resetExchangeExpCurTimes()
		self:resetExchangeExpMaxTimes()
		return self.player:getPersistVar().stCitys.exchangeTodayTimes
	end;
	
	resetExchangeExpCurTimes = function(self)
		local todayTimes = self.player:getPersistVar().stCitys.exchangeTodayTimes
		local lastYearDay = os.date("*t", todayTimes.lastTime).yday
		local curYearDay = os.date("*t", Util:getTime()).yday
		if lastYearDay ~= curYearDay then
			todayTimes.curTimes = 0
		end
	end;
	
	resetExchangeExpMaxTimes = function(self)
		self.player:getPersistVar().stCitys.exchangeTodayTimes.maxTimes =
			self:getBuildsLevelResSum(FIXID.JITANBUILD, 'addsacrificetimes')
	end;
	
	addExchangeExpTodayTimes = function(self, addTimes)
		if addTimes <= 0 then
			return 
		end
		
		local todayTimes = self.player:getPersistVar().stCitys.exchangeTodayTimes
		todayTimes.curTimes = todayTimes.curTimes + addTimes
		todayTimes.lastTime = Util:getTime()
	end;
	
	getBuildsByResId = function(self, resid)
		local builds = {}
		for _, city in ipairs(self.citys) do
			local bs = city:getBuildsByResId(resid)
			table.foreachi(bs, function(i, b) table.insert(builds, b) end)
		end
		return builds
	end;
	
	getMaxCRes = function(self)
		return self:getMaxCResByStore() + self:getAddMaxCResByWorkShop()
	end;
	
	getMaxCResByStore = function(self)
		local city = self:getCityById(CITY_TYPE.MAIN)
		if city == nil then
			return res_commres_basestorenum 
		end
		
		local build = city:getBuildByResId(FIXID.STOREINBUILD)
		if build == nil then 
			return res_commres_basestorenum 
		end
		
		local res = ItemResUtil:findBuildLevelres(build.ulResId, build.ucLevel)
		if res == nil then 
			return res_commres_basestorenum 
		end
		
		return res.storenum
	end;
	
	getAddMaxCResByWorkShop = function(self)
		return self:getBuildsLevelResSum(FIXID.WORKSHOPBUILD, 'addresstorenum')
	end;
	
	getMaxMoney = function(self)
		return self:getBuildsLevelResSum(FIXID.GOV_BUILD, 'storenum')
	end;
	
	getBuildsLevelResSum = function(self, resid, resFieldName)
		local sum = 0
		local builds = self:getBuildsByResId(resid)
		for _, b in ipairs(builds) do
			local res = ItemResUtil:findBuildLevelres(resid, b.ucLevel)
			if res ~= nil and res[resFieldName] ~= nil then
				sum = sum + res[resFieldName]
			end
		end
		return sum
	end;
	
	getBuildsLevelSum = function(self, resid)
		local levelSum = 0
		local builds = self:getBuildsByResId(resid)
		for _, build in ipairs(builds) do
			levelSum = levelSum + build.ucLevel
		end
		return levelSum
	end;
	
	getMaxPopu = function(self)
		return res_initmaxpopu + self:getBuildsLevelResSum(FIXID.HOUSEBUILD, 'popunum')
	end;
	
	getCityByType = function(self, citytype)
		for _,c in ipairs(self.citys) do
			if c:getType() == citytype then return c end
		end
		return nil
	end;
	
	addCity = function(self, citytype)
		if self:_isArrivedMaxCityCount() then
			return nil
		end
		
		if self:_isAddMainCityExist(citytype) then
			return nil
		end
		
		local city = self:_createCity(citytype)
		self.player:refreshCityGrid()
		
		return city
	end;
	
	_isArrivedMaxCityCount = function(self)
		local citys = self.player:getPersistVar().stCitys
		return citys.ucTotal  >= MAX_CITY_CNT
	end;
	
	_isAddMainCityExist = function(self, citytype)
		local citys = self.player:getPersistVar().stCitys
		return (citytype == CITY_TYPE.MAIN) and (citys.ucTotal > 0)
	end;
	
	_createCity = function(self, citytype)
		local citys = self.player:getPersistVar().stCitys
		local city = PlayerCity:new(self.player, citys.astCitys[citys.ucTotal])
		city:setType(citytype)
		city:setBuildCount(0)
		table.insert(self.citys, city)
		citys.ucTotal = citys.ucTotal + 1
		return city
	end;
	
	getCityCount = function(self)
		return table.getn(self.citys)
	end;
	
	getCityById = function(self, id)
		local city = self.citys[id] -- 从1开始
		if city then
			return city
		else
			return nil
		end
	end;
	
	getBuildingCount = function(self)
		local cnt = 0
		for _, city in ipairs(self.citys) do
			cnt = cnt + city:getBuildingCount()
		end
		return cnt
	end;
	
	getBuildLevelByResId = function(self, resid)
		local level = 0
		local builds = self:getBuildsByResId(resid)
		if table.getn(builds) == 0 then return level end
		for _, b in ipairs(builds) do
			if b.ucLevel > level then
				level = b.ucLevel
			end
		end
		return level
	end;
	
	isFullBuildingCnt = function(self, showTip)
		local isFull = (self.player:getCitys():getBuildingCount() >= self:_getCanMaxBuildingCnt() )
		if isFull and showTip == true then
			WUtil:sendErrorMsg(self.player, rstr.err.fullbuildings)
		end
		return isFull
	end;
	
	_getCanMaxBuildingCnt = function(self)
		local rt = res_max_building_cnt
		
		local stateContainer = self.player:getStateContainer()
		local state = stateContainer:getEffectState(RES_EFF.ADD_THREE_BUILDINGPOS)
		local vipVal = self.player:getVipEffectVal(VIP_EFF.ADD_BUILD_QUEUE)
		rt = rt + vipVal
		
		if state ~= nil then
			rt = rt + state:getEffectVal()
		end
		
		return rt
	end;	
	
	getAutoBuilds = function(self)
		return self.autoBuilds
	end;
	
	isStartAutoBuild = function(self)
		return self.player:getPersistVar().stCitys.startAutoBuild == 1
	end;
	
	setStartAutoBuild = function(self, flag)
		self.player:getPersistVar().stCitys.startAutoBuild = flag
	end;
	
	handleAutoBuilds = function(self)
		if not self:isStartAutoBuild() then
			return
		end
		
		if self.autoBuilds:getCount() == 0 then
			return 
		end
		
		local hdr = app:getCmdHandler(NETCMD.BUILDRES):getHandler(3)
		local removes = {}
		for i=0, self.autoBuilds:getCount()-1 do
			if self:isFullBuildingCnt(false) then
				break
			end
			
			local combineId = self.autoBuilds:get(i)
			local cid = math.floor(combineId/1000)
			local id = combineId%1000
			hdr:handle(self.player, {cid=cid, id=id})
			table.insert(removes, combineId)
		end
		
		for _, combineId in ipairs(removes) do
			self.autoBuilds:remove(combineId)
		end
		
		if not self:isFullBuildingCnt(false) then
			self:setStartAutoBuild(0)
			WUtil:sendPopBoxMsg(self.player, rstr.autobuild.stop)
		end
		
		AutoBuildSender:sendInfo(self.player)
	end;
})

PlayerCity = Class:extends({
	init = function(self, player, city)
		self.player = player
		self.city = city
	end;
	
	getType = function(self)
		return self.city.ucType
	end;
	
	getBuildCount = function(self)
		return self.city.stInBuilds.ucTotal
	end;
	
	getBuildingCount = function(self)
		local cnt = 0
		for i=self.city.stInBuilds.ucTotal-1, 0, -1 do
			if self.city.stInBuilds.astInBuilds[i].ucState ~= BUILD_STATE.COMM then
				cnt = cnt + 1
			end
		end
		return cnt
	end;
	
	--@params
	-- level -- >= 该level的建筑
	getBuildCountByResIdLevel = function(self, resid, level)
		local cnt = 0
		for i=self.city.stInBuilds.ucTotal-1, 0, -1 do
			local build = self.city.stInBuilds.astInBuilds[i]
			if build.ulResId == resid and build.ucLevel >= level then
				cnt = cnt + 1
			end
		end
		return cnt
	end;
	
	setType = function(self, ctype)
		self.city.ucType = ctype
	end;
	
	setBuildCount = function(self, cnt)
		self.city.stInBuilds.ucTotal = cnt
	end;
	
	getBuilds = function(self)
		return self.city.stInBuilds
	end;
	
	addBuild = function(self, b)
		local pos = self.city.stInBuilds.ucTotal
		if pos >= MAX_INBUILD_CNT then return end
		
		local build = self.city.stInBuilds.astInBuilds[pos]
		build.ulId = Util:getNumber(b, 'id')
		build.ulResId = Util:getNumber(b, 'resid')
		build.ucLevel = Util:getNumber(b, 'level')
		build.ucState = Util:getNumber(b, 'state')
		build.ulStoptime = Util:getNumber(b, 'stoptime')
		self.city.stInBuilds.ucTotal = pos +1
		return build
	end;
	
	delBuild = function(self, buildid)
		if self:getBuildById(buildid) == nil then return end
		self.city.stInBuilds.ucTotal = Util:removeElementC(self.city.stInBuilds.astInBuilds, self.city.stInBuilds.ucTotal, Util:getLastFindIdx())
	end;
	
	upgradeBuilding = function(self, build, b)
		build.ucState = BUILD_STATE.UPGRADE
		build.ulStoptime = b.stoptime
	end;
	
	downBuilding = function(self, build, b)
		build.ucState = BUILD_STATE.DOWN
		build.ulStoptime = b.stoptime
	end;
	
	addBuildLevel = function(self, build)
		local lastLevel = build.ucLevel
		build.ucLevel = build.ucLevel + 1
		self:onBuildLevelChange(build, lastLevel, build.ucLevel)
	end;
	
	subBuildLevel = function(self, build)
		local lastLevel = build.ucLevel
		build.ucLevel = build.ucLevel - 1
		self:onBuildLevelChange(build, lastLevel, build.ucLevel)
		if build.ucLevel == 0 then 
			self:delBuild(build.ulId) 
		end	
	end;
	
	getBuildById = function(self, id)
		return Util:findC(self.city.stInBuilds.astInBuilds, self.city.stInBuilds.ucTotal, 'ulId', id)
	end;
	
	getBuildByResId = function(self, resid)
		return Util:findC(self.city.stInBuilds.astInBuilds, self.city.stInBuilds.ucTotal, 'ulResId', resid)
	end;
	
	getBuildsByResId = function(self, resid)
		local builds = {}
		for i=0,self.city.stInBuilds.ucTotal-1,1 do
			local build = self.city.stInBuilds.astInBuilds[i]
			if build.ulResId == resid then
				table.insert(builds, build)
			end
		end
		return builds
	end;
	
	getBuildLevelByResId = function(self, resid)
		local maxLevel = 0
		local builds = self:getBuildsByResId(resid)
		for _, b in ipairs(builds) do
			if b.ucLevel > maxLevel then
				maxLevel = b.ucLevel
			end
		end
		return maxLevel
	end;
	
	onBuildLevelChange = function(self, build, lastLevel, curLevel)
		if build.ulResId == FIXID.GOV_BUILD then
			MoneySender:sendAll(self.player)
		elseif build.ulResId == FIXID.STOREINBUILD or build.ulResId == FIXID.WORKSHOPBUILD then
			CommResSender:send(self.player, {FIXID.MAXCRESCNT})
		elseif build.ulResId == FIXID.HOUSEBUILD then
			self.player:getCityRes():onPopuChange()
		elseif build.ulResId == FIXID.BARBACK then
			self.player:recalSendMaxNewSoldier()
		elseif build.ulResId == FIXID.JITANBUILD then
			ExchangeHeroExpSender:sendTodayTimes(self.player)
		elseif build.ulResId == FIXID.JIAOLIANBUILD then
			self:_recalcHerosCommandAttr()
		elseif build.ulResId == FIXID.HOSPITALBUILD then
			ItemMsgSender:sendSalveMax(self.player)
		end
		if build.ulResId ==  FIXID.SITUSHU or build.ulResId ==  FIXID.SIMASHU then
			self.player:recalRoleAppendAttrs()
		end
		
		self.player:refreshCityGrid()
	end;
	
	_recalcHerosCommandAttr = function(self)
		local heroMgr = self.player:getHeroMgr()
		for i=1, heroMgr:getHeroCount(), 1 do
			local hero = heroMgr:getHeroByIdx(i-1)
			hero:recalcCommandAttr()
			HeroAttrSender:sendAttr(self.player, hero, hero:getAttr(ATTR.CO) )
			hero:uncarrySoldierBeyondCommand()
		end
	end;
})

PlayerSoldierMgr = Class:extends({
	init = function(self, player)
		self.player = player
		self.soldiers = self.player:getPersistVar().soldiers
	end;
	
	getSoldierNumber = function(self, resid)
		local s = Util:findC(self.soldiers.soldiers, self.soldiers.count, 'resid', resid)
		if s == nil then return 0 end
		return s.number
	end;
	
	addSoldier = function(self, soldier)
		local s = Util:findC(self.soldiers.soldiers, self.soldiers.count, 'resid', soldier.resid)
		if s ~= nil then
			s.number = s.number + soldier.number
		elseif self.soldiers.count < MAX_SLDS_CNT then
			s = self.soldiers.soldiers[self.soldiers.count]
			self.soldiers.count = self.soldiers.count + 1
			s.resid = soldier.resid
			s.number = soldier.number
		else
			LOG('error: the MAX_SLDS_CNT not enough')
		end
	end;
	
	subSoldier = function(self, soldier)
		local hasSoldier = Util:findC(self.soldiers.soldiers, self.soldiers.count, 'resid', soldier.resid)
		if hasSoldier == nil then return end
		
		if hasSoldier.number <= soldier.number then
			self.soldiers.count = Util:removeElementC(self.soldiers.soldiers, self.soldiers.count, Util:getLastFindIdx())
		else
			hasSoldier.number = hasSoldier.number - soldier.number
		end
	end;
	
	getSoldiersCount = function(self)
		return self.soldiers.count
	end;
	
	getSoldierByIdx = function(self, idx)
		return self.soldiers.soldiers[idx]
	end;
	
	getSoldierById = function(self, id)
		return Util:findC(self.soldiers.soldiers, self.soldiers.count, 'resid', id)
	end;
})


NewHeros = Class:extends({
	init = function(self, player, heros)
		self.player = player
		self.heros = heros
	end;
	
	getNewHerosCount = function(self)
		return self.heros.ucNewCount
	end;
	
	getNewHero = function(self, idx)
		return self.heros.astNewHeros[idx]
	end;
	
	getNewHeroById = function(self, id)
		return Util:findC(self.heros.astNewHeros, self.heros.ucNewCount, 'ulId', id)
	end;
	
	getNewHeros = function(self)
		return self.heros
	end;
	
	getNewHeroLastTime = function(self)
		return self.heros.ulNewHeroLastTime
	end;
	
	setNewHeroLastTime = function(self, ltime)
		self.heros.ulNewHeroLastTime = ltime
	end;
	
	deleteHeroById = function(self, id)
		if Util:findC(self.heros.astNewHeros, self.heros.ucNewCount, 'ulId', id) ~= nil then
			self.heros.ucNewCount = Util:removeElementC(self.heros.astNewHeros, self.heros.ucNewCount, Util:getLastFindIdx())
		end
	end;
	
	refreshNewHeros = function(self)
		local citys = self.player:getCitys()
		local tlevel = citys:getBuildLevelByResId(FIXID.TAVERNBUILD)
		if tlevel == 0 then
			return 
		end
		
		local count = 1
		if tlevel > 1 then count = 6 end
		
		for i=1, count, 1 do
			local newhero = self.heros.astNewHeros[i-1]
			local id = i
			local prof = self:_getProfByCountAndIdx(count, i)
			local minLevel = 1
			if count == 1 then
				minLevel = res_first_hero_minLevel
			end
			InitNewHeroUtil:inithero(self.player, newhero, id, prof, tlevel, minLevel)
			self:_recalNewHeroNAttrs(count, newhero)
		end

		self.heros.ulNewHeroLastTime = Util:getTime()
		self.heros.ucNewCount = count
	end;
	
	_getProfByCountAndIdx = function(self, count, idx, level)
		if count == 1 then
			return HERO_PROF.JIJIANG
		end
		return idx
	end;
	
	_recalNewHeroNAttrs = function(self, count, newhero )
		if count ~= 1 then return end
		for i=0, newhero.ucAttrCount-1, 1 do
			local attr = newhero.astAttrs[i]
			if (attr.usAttr == ATTR.NST or attr.usAttr == ATTR.NAG or attr.usAttr == ATTR.NPH)
				and attr.ulVal < 135 then
				attr.ulVal = 135
			end
		end
	end
})

InitNewHeroUtil = Class:extends({
	init = function(self)
		self.nattrs = {{attr=ATTR.NST},{attr=ATTR.NAG},{attr=ATTR.NPH}}
	end;
	
	inithero = function(self, player, newhero, id, prof, buildlevel, minLevel)
		newhero.ulId = id
		newhero.ucProf = prof
		newhero.ucLevel = res_get_rand_newhero_level(player:getLevel(), buildlevel)
		if newhero.ucLevel < minLevel then
			newhero.ucLevel = minLevel
		end
		newhero.ulIcon, newhero.ucSex = self:randIconAndSex()
		newhero.szName = self:randCombineName(newhero.ucSex, 0)
		self:initCommAttrs(prof, newhero)
		self:addCommAttrsByLevelPPS(newhero.ucLevel, newhero)
		self:initNaturalAttrs(prof, newhero, buildlevel)
	end;
	
	randCombineName = function(self, sex, deeplevel)
		local xingIdx = math.random(table.getn(res_heronames_xing))
		local xing = res_heronames_xing[xingIdx].name
		local mingIdx =  math.random(table.getn(res_heronames_ming))
		local ming = res_heronames_ming[mingIdx].name[sex+1]
		
		local name = xing..ming
		if res_heronames_filter_names[name] == nil or deeplevel > 5 then
			return name
		else
			return self:randCombineName(sex, deeplevel+1)
		end
	end;
	
	randIconAndSex = function(self)
		local iconidx = math.random(table.getn(res_hero_icons))
		local iconid = res_hero_icons[iconidx].icon
		local sex = ROLE_SEX.MALE
		if math.floor(iconid/100) == 2 then
			sex = ROLE_SEX.FEMALE
		end
		return iconid, sex
	end;	
	
	initCommAttrs = function(self, prof, newhero)
		local resattrs = res_init_newheros['prof'..prof]
		newhero.ucAttrCount = table.getn(resattrs)
		for i=1, newhero.ucAttrCount, 1 do
			local attr = newhero.astAttrs[i-1]
			local resattr = resattrs[i]
			attr.usAttr = resattr.attr
			attr.ulVal = resattr.val
			attr.ucUnit = resattr.unit
		end
	end;
	
	addCommAttrsByLevelPPS = function(self, herolevel, newhero)
		local syspp = 0
		local freepp = 0
		for level=2, herolevel, 1 do
			local pp = res_get_hero_ppoint(level)
			syspp = syspp + pp.sys
			freepp = freepp + pp.free
		end
		local freepp1, freepp2, freepp3 = self:randAssignThreeVal(freepp)
		newhero.astAttrs[0].ulVal = newhero.astAttrs[0].ulVal + syspp/3 + freepp1
		newhero.astAttrs[2].ulVal = newhero.astAttrs[2].ulVal + syspp/3 + freepp2
		newhero.astAttrs[4].ulVal = newhero.astAttrs[4].ulVal + syspp/3 + freepp3
	end;
	
	randAssignThreeVal = function(self, val)
		local r1 = Util:random(val)
		local r2 = Util:random(val - r1)
		local r3 = val - r1 - r2
		local r = Util:random(3)
		if r == 1 then
			return r1, r2, r3
		elseif r == 2 then
			return r2, r1, r3
		elseif r == 3 then
			return r3, r1, r2
		end
	end;
	
	initNaturalAttrs = function(self, prof, newhero, buildlevel)
		local nattrcnt = table.getn(self.nattrs)
		for i=1, nattrcnt, 1 do
			local attr = newhero.astAttrs[newhero.ucAttrCount+i-1]
			local resattr = self.nattrs[i]
			attr.usAttr = resattr.attr
			attr.ulVal = res_getheronature_attr(attr.usAttr, prof)
			attr.ucUnit = 0
		end
		newhero.ucAttrCount = newhero.ucAttrCount + nattrcnt
	end;
}):new()


