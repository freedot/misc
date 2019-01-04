BuildStopTimerHdr = Class:extends({
	getBuildStopParam = function(self, player, cityid, buildid)
		local citys = player:getCitys()
		local city = citys:getCityById(cityid)
		if city == nil then 
			return nil 
		end
		
		local build = city:getBuildById(buildid)
		if build == nil then 
			return nil 
		end
		
		if build.ulStoptime > (Util:getTime() + TIMER_DRT_TIME) then
			return nil 
		end
		return city, build
	end;
})

BuildUpStopTimerHdr = BuildStopTimerHdr:extends({
	handle = function(self, player, cityid, buildid)
		local city, build = self:getBuildStopParam(player, cityid, buildid)
		if city == nil then return end
		if build.ucState ~= BUILD_STATE.UPGRADE then 
			return 
		end
		
		city:addBuildLevel(build)
		
		WUtil:sendSysMsgArgs(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100196, '"@itemid' .. build.ulResId .. '",' .. build.ucLevel )
		WUtil:sendSysMsgArgs(player, SMSGT.POP, SMT_SUCCESS, 100198, '"@itemid' .. build.ulResId .. '","@buptip' .. build.ulResId .. '"' )
		
		self:addRoleExp(player, build)
		self:addCityBuildVal(player, build)
		
		build.ucState = BUILD_STATE.COMM
		
		CityBuildValSender:send(player, {'buildval'})
		CityBuildSender:send(player, cityid, buildid)
		TaskFinisher:checkTasks(player)
		
		player:getCitys():handleAutoBuilds()
	end;
	
	addRoleExp = function(self, player, build)
		local exp = res_buildup_addexp(build.ucLevel)
		player:addExp(exp)
	end;
	
	addCityBuildVal = function(self, player, build)
		local cres = player:getCityRes() 
		cres:addBuildVal( res_buildup_addbuildval(build.ucLevel) )
	end;
}):new()

BuildDownStopTimerHdr = BuildStopTimerHdr:extends({
	handle = function(self, player, cityid, buildid)
		local city, build = self:getBuildStopParam(player, cityid, buildid)
		if city == nil then return end
		if build.ucState ~= BUILD_STATE.DOWN then 
			return
		end
		
		self:subRoleExp(player, build)
		self:returnDownBuildRes(player, build)
		self:returnDownBuildPopu(player, build)
		self:subCityBuildVal(player, build)
		city:subBuildLevel(build)
		
		build.ucState = BUILD_STATE.COMM
		
		CityBuildSender:send(player, cityid, buildid)
		CityBuildValSender:sendAll(player)
		CommResSender:sendAll(player)	
		
		player:getCitys():handleAutoBuilds()
	end;
	
	returnDownBuildRes = function(self, player, build)
		local cityres = player:getCityRes()
		local levelres = ItemResUtil:findBuildLevelres(build.ulResId, build.ucLevel)
		local tags = {food='Food', wood='Wood', stone='Stone', iron='Iron'}
		for k, m in pairs(tags) do
			local res = levelres[k]
			if res ~= nil and res > 0 then
				local getter = cityres['get'..m]
				local setter = cityres['set'..m]
				setter(cityres, getter(cityres) + res*res_down_retres_per)
			end
		end
	end;
	
	returnDownBuildPopu = function(self, player, build)
		local levelres = ItemResUtil:findBuildLevelres(build.ulResId, build.ucLevel)
		if levelres.addpopu == nil then
			return
		end
		
		local cityres = player:getCityRes()
		local idlePopu = cityres:getIdlePopu() + levelres.addpopu
		cityres:setIdlePopu(idlePopu)
		PopuSender:send(player, {'idle'})
	end;
	
	subCityBuildVal = function(self, player, build)
		local cres = player:getCityRes()
		cres:subBuildVal( res_buildup_addbuildval(build.ucLevel) )
	end;
	
	subRoleExp = function(self, player, build)
		local exp = res_buildup_addexp(build.ucLevel)
		player:subExp(exp)
	end;
}):new()

RefreshRoleAttrTimerHdr = Class:extends({
	handle = function(self, player)
		player:getCityRes():refreshIdlePopu()
		player:getCityRes():refreshMoney()
		player:getPkg():refreshSalve()
		player:refreshNewSoldiers()
		player:refreshPSAttr()
		PopuSender:sendAll(player)
		MoneySender:sendAll(player)
		RoleAttrSender:sendAttrsByIds(player, {ATTR.NAF,ATTR.PS})
		ExchangeHeroExpSender:sendTodayTimes(player)
		MilitarySender:sendTodayFTimes(player)
	end;
}):new()

FarmStopTimerHdr = Class:extends({
	handle = function(self, player, blockid, blockSeqId)
		local farm = player:getFarm()
		local block = farm:getBlockById(blockid)
		if block == nil then return end
		if block.seqId ~= blockSeqId then return end
		if block.ucState ~= FARM_STATE.SAPLING then return end
		block.ucState = FARM_STATE.COMPLETE
		
		local vipVal = player:getVipEffectVal(VIP_EFF.ADD_FARM_PROTECT_TIME)*60
		block.protectStopTime = Util:getTime() + vipVal
		
		FarmSender:sendBlock(player, farm, block)
	end;
}):new()

UnlockHeroTimerHdr = Class:extends({
	handle = function(self, player, heroid)
		local hero = player:getHeroMgr():getHeroById(heroid)
		if hero == nil then return end
		if hero:getLockState() ~= HERO_LOCKSTATE.UNLOCKING then return end
		hero:setLockState(HERO_LOCKSTATE.NONE)
		HeroAttrSender:sendUnLockedHero(player, hero)
		WUtil:sendSuccMsgArgs(player, 100009, '"@heroid'..hero:getId()..'"')
	end;
}):new()

RecalHeroAttrTimerHdr = Class:extends({
	handle = function(self, player)
		self.player = player
		local heromgr = player:getHeroMgr()
		local elapse = Util:getTime() - heromgr:getAttrLastTime()
		heromgr:setAttrLastTime(Util:getTime())
		local herocnt = heromgr:getHeroCount()
		for i=0, herocnt-1, 1 do
			local hero = heromgr:getHeroByIdx(i)
			self:recalcHealthAttr(hero, elapse)
			self:recalcMoraleAttr(hero, elapse)
		end
	end;
	
	recalcHealthAttr = function(self, hero, elapse)
		local oldmealth = hero:getAttrRawVal(ATTR.HEALTH)
		local mmealth = hero:getAttrVal(ATTR.MHEALTH)
		mealth = oldmealth + elapse*res_hero_mealth_upspeed/3600*ATTR_PRECISION
		if mealth > mmealth * ATTR_PRECISION then
			mealth = mmealth * ATTR_PRECISION
		end
		if oldmealth ~= mealth then
			hero:setAttrRawVal(ATTR.HEALTH, mealth)
			HeroAttrSender:sendAttr(self.player, hero, hero:getAttr(ATTR.HEALTH))
		end
	end;
	
	recalcMoraleAttr = function(self, hero, elapse)
		local oldmorale = hero:getAttrRawVal(ATTR.MO)
		local mmorale = hero:getAttrVal(ATTR.MMO)
		local mid_morale = (mmorale * 2 / 3) * ATTR_PRECISION
		if oldmorale > mid_morale then
			morale = math.max(mid_morale, oldmorale - elapse*res_hero_morale_downspeed/3600*ATTR_PRECISION)
		else
			morale = math.min(mid_morale, oldmorale + elapse*res_hero_morale_upspeed/3600*ATTR_PRECISION)
		end
		if oldmorale ~= morale then
			local attr = hero:getAttr(ATTR.MO)
			attr.ulVal = morale
			HeroAttrSender:sendAttr(self.player, hero, attr)
		end
	end;
}):new()


SteelHeroSkeletonTimerHdr = Class:extends({
	handle = function(self, player, heroid )
		if not self:getParam(player, heroid) then return end
		if not self:isSteeling() then return end
		if self:isFullSLevel() then return end
		if not self:isArriveTime() then return end
		
		self.hero:setSkeletonLevel( self.hero:getSkeletonLevel() + 1 )
		self.hero:setSSteelStopTime(0)
		
		HeroAttrSender:sendSkeleton(self.player, self.hero)
		HeroAttrSender:sendAttrsByIds(self.player, self.hero, {ATTR.MIF, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.SFC})
		TaskFinisher:checkTasks(self.player)
	end;
	
	getParam = function(self, player, heroid)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		self.hero = heromgr:getHeroById(heroid)
		return self.hero ~= nil 
	end;
	
	isSteeling = function(self) 
		return self.hero:getSSteelStopTime() > 0
	end;
	
	isFullSLevel = function(self)
		return self.hero:getSkeletonLevel() == table.getn(res_herojingmai)
	end;
	
	isArriveTime = function(self)
		return (Util:getTime() + TIMER_DRT_TIME) >= self.hero:getSSteelStopTime()
	end;
}):new()

SkillSteelHeroTimerHdr = Class:extends({
	handle = function(self, player, heroid, skillid )
		if not self:getParam(player, heroid, skillid) then return end
		if not self:isArriveTime() then return end
		
		local dex = self:getDexValByDurtime()
		self.hero:addSkillDex(self.skill, dex)
		self:clearSkillSteel()
		
		SkillMsgSender:sendSkill(self.player, self.hero, self.skill)
		HeroAttrSender:sendSkillSteel(self.player, self.hero)
	end;
	
	getParam = function(self, player, heroid, skillid)
		self.player = player
		self.hero = self:getHero(heroid)
		if self.hero == nil then return false end
		
		self.skill = self:getSkill(skillid)
		if self.skill == nil then return false end
		
		return true
	end;
	
	getHero = function(self, heroid)
		local heromgr = self.player:getHeroMgr()
		return heromgr:getHeroById(heroid)
	end;
	
	getSkill = function(self, skillid)
		local skillsteel = self.hero:getSkillSteel()
		if skillsteel.ulResId == 0 then return null end
		if skillsteel.ulResId ~= skillid then return null end
		
		local skill = self.hero:getSkillById(skillid)
		if skill == null then return null end
		if skill.ucLevel >= res_hero_baseskill_maxlevel then return null end
		
		return skill
	end;
	
	isArriveTime = function(self)
		local skillsteel = self.hero:getSkillSteel()
		return (Util:getTime() + TIMER_DRT_TIME) >= skillsteel.ulStoptime
	end;
	
	getDexValByDurtime = function(self)
		local skillsteel = self.hero:getSkillSteel()
		return skillsteel.ulDurtime * res_get_skilldex_per_hour
	end;
	
	clearSkillSteel = function(self)
		local skillsteel = self.hero:getSkillSteel()
		skillsteel.ulResId = 0
		skillsteel.ulDurtime = 0
		skillsteel.ulStoptime = 0
	end;
}):new()

LearnCultureTimerHdr = Class:extends({
	handle = function(self, player, cultureid )
		self:getParams(player, cultureid)
		
		if not self:isValidId() then return end
		if self:isFullLevel() then return end
		if not self:isArriveTime() then return end
		
		self:upgradeLevel()
		self:clearLearningCulture()
		self:sendMsg()
		TaskFinisher:checkTasks(self.player)
		player:recalRoleAppendAttrs()
	end;
	
	getParams = function(self, player, cultureid)
		self.player = player
		self.cultureid = cultureid
		self.cultureObjs = player:getCultures()
		self.learningCulture = self.cultureObjs:getLearningCulture()
	end;
	
	isValidId = function(self, cultureid)
		if self.learningCulture.id == 0 then return false end
		if self.learningCulture.id ~= self.cultureid then return false end
		return true
	end;
	
	isFullLevel = function(self)
		local level = self.cultureObjs:getLevel(self.learningCulture.id)
		local res = ItemResUtil:findItemres(self.learningCulture.id)
		return level >= res.maxlevel
	end;
	
	isArriveTime = function(self)
		local stoptime = self.cultureObjs:getLearningCulture().stoptime
		return (Util:getTime() + TIMER_DRT_TIME) >= stoptime
	end;	
	
	upgradeLevel = function(self)
		local level = self.cultureObjs:getLevel(self.cultureid)
		self.cultureObjs:setLevel(self.cultureid, level+1)
	end;
	
	clearLearningCulture = function(self)
		self.learningCulture.id  = 0
		self.learningCulture.stoptime  = 0
	end;
	
	sendMsg = function(self)
		local level = self.cultureObjs:getLevel(self.cultureid)
		CultureSender:sendCulture(self.player, {id=self.cultureid, level=level})
		CultureSender:sendLearningCulture(self.player)
		WUtil:sendSysMsgArgs(self.player, SMSGT.POP, SMT_SUCCESS, 100198, '"@itemid' .. self.cultureid .. '","@cuptip' .. self.cultureid .. '"' )
	end;
}):new()

HeroSteelStopTimerHdr = Class:extends({
	handle = function(self, player, heroId, startTime, steelType)
		local hero = player:getHeroMgr():getHeroById(heroId)
		if hero == nil then
			return 
		end
		
		local heroSteel = hero:getHeroSteel()
		if heroSteel:getStartTime() ~= startTime or heroSteel:getSteelType() ~= steelType then
			if startTime == nil then startTime = 'nil' end
			if steelType == nil then steelType = 'nil' end
			LOG('can not stop steel, start1:' .. heroSteel:getStartTime() .. ', start2:' .. startTime .. ', type1:' .. heroSteel:getSteelType() .. ',type2:' .. steelType )            
			return
		end
		
		self:getStopHdr():handle(player, {heroId=heroId})
	end;
	
	getStopHdr = function(self)
		if self.hdr == nil then
			self.hdr = StopHeroSteelHdr()
		end
		
		return self.hdr
	end;
}):new()

CityDefUtil = Class:extends({
	getDefTypeFromResId = function(self, resid)
		return  CITYDEF_TYPE.FIRST + (resid - FIXID.FIRSTCITYDEF)
	end;
}):new()

BuildCityDefStopTimerHdr = Class:extends({
	handle = function(self, player, cityDefResId )
		self:_initParams(player, cityDefResId)
		if not self:_isValidId() then 
			return false 
		end
		
		if not self:_isArriveTime() then 
			return false 
		end
		
		self:_addCityDef()
		self:_clearCityDefBuilding()
		self:_sendMsgs()
		
		TaskFinisher:checkTasks(self.player)
		
		return true
	end;
	
	_initParams = function(self, player, cityDefResId)
		self.player = player
		self.cityDefResId = cityDefResId
		self.cityDef = self.player:getCityDef()
	end;
	
	_isValidId = function(self)
		return self.cityDef:getBuildingResid() == self.cityDefResId
	end;
	
	_isArriveTime = function(self)
		return (Util:getTime() + TIMER_DRT_TIME) >= self.cityDef:getBuildingStopTime()
	end;	
	
	_addCityDef = function(self)
		local lastNumber = self.cityDef:getDefNumber(self:_getDefType())
		self.cityDef:setDefNumber(self:_getDefType(), lastNumber + self.cityDef:getBuildingNumber())
	end;
	
	_clearCityDefBuilding = function(self)
		self.cityDef:setBuildingResid(0)
		self.cityDef:setBuildingStopTime(0)
		self.cityDef:setBuildingNumber(0)
	end;
	
	_sendMsgs = function(self)
		PlayerCityDefSender:sendDefs(self.player)
		PlayerCityDefSender:sendBuilding(self.player)
	end;

	_getDefType = function(self)
		return  CityDefUtil:getDefTypeFromResId(self.cityDefResId)
	end;
}):new()

