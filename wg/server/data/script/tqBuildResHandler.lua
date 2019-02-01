--------------------------------------------------------------------
BuildResHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = SendAllCitysBuildsHdr()
		self.handlers[2] = CityAddBuildHdr()
		self.handlers[3] = CityUpBuildHdr()
		self.handlers[4] = CityDownBuildHdr()
		self.handlers[5] = CityCancelBuildingHdr()
		self.handlers[6] = CreateSubCityHdr()
		self.handlers[7] = ChangeSubCityHdr()
		self.handlers[8] = SendAllAllianceBuildsHdr()
		self.handlers[9] = AllianceUpBuildHdr()
		self.handlers[10] = AllianceUpBuildEndHdr()
	end;
})

SendAllCitysBuildsHdr = Class:extends({
	handle = function(self, player, cmdtb)
		CityBuildSender:sendCitysType(player)
		CityBuildSender:sendAll(player)
		CityBuildSender:sendOpenMainCity(player)
	end;
})

CityBuildHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then 
			return false
		end
		
		self:_getExpends()
		if not self:_isValid() then 
			return false
		end
		
		self:_docmd()
		return true
	end;
	
	_getExpends = function(self)
		self.expends = nil 
		local res = self:_getBuildNextLevelres()
		if res == nil then 
			return 
		end
		
		local expendress = ExpendResMaker:makeExpendRes(res)
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
	end;
	
	_isFullBuildingCnt = function(self)
		return self.player:getCitys():isFullBuildingCnt(true)
	end;
	
	_isCommState = function(self)
		return self.build.ucState == BUILD_STATE.COMM
	end;	
	
	_isValidPreCondition = function(self)  
		local res = self:_getBuildNextLevelres()
		if res.conds == nil then 
			return true 
		end
		
		for _, cond in ipairs(res.conds) do
			if not self:_isValidOnePreCond(cond) then return false end
		end
		return true
	end;
	
	_isValidOnePreCond = function(self, cond)
		if (cond.id == nil) or (cond.id == 0) or (cond.level == nil) or (cond.level == 0) then 
			return true
		end
		
		local cityres = self.player:getCityRes()
		if (cond.id == FIXID.CITYLEVEL) 
			and (cityres:getLevel() < cond.level) then
			return false
		elseif (cond.id >= FIXID.FIRSTINBUILD) 
			and (cond.id <= FIXID.LASTINBUILD) 
			and (self:_getCurBuildLevel(cond.id) < cond.level) then
			return false
		end
		
		return true
	end;
	
	_getCurBuildLevel = function(self, resid)
		if self:_isCanBuildInCity(resid) then
			return self.city:getBuildLevelByResId(resid)
		else
			return self.player:getCitys():getBuildLevelByResId(resid)
		end
	end;
	
	_isCanBuildInCity = function(self, resid)
		local canbuidids = nil
		if self.citytype == CITY_TYPE.MAIN then
			canbuidids = res_maincity_canbuildids
		elseif self.citytype == CITY_TYPE.SUBRES then
			canbuidids = res_subrescity_canbuildids
		elseif self.citytype == CITY_TYPE.SUBARMY then
			canbuidids = res_subarmycity_canbuildids
		else
			LOG('error:395jfw85f , self.citytype' .. self.citytype)
			return false
		end
		
		return Util:find(canbuidids, nil, resid) ~= nil
	end;
	
	_getBuildNextLevelres = function(self)
		return ItemResUtil:findBuildLevelres(self.resid, self.level+1)
	end;
	
	_getBuildNeedTime = function(self)
		local res = self:_getBuildNextLevelres()
		return self:_calcFactNeedTime(res.ntime)
	end;
	
	_calcFactNeedTime = function(self, ntime)
		ntime = self:_speedByStateEffect(ntime)
		local culturelevel = self.player:getCultures():getLevel(FIXID.BUILDCBUILD);
		local citys = self.player:getCitys()
		local city = citys:getCityByType(CITY_TYPE.MAIN)
		local build = city:getBuildByResId(FIXID.GOV_BUILD)
		local govlevel = build.ucLevel;
		local role_interior = self.player:getAttrVal(ATTR.IN_B) + self.player:getAttrVal(ATTR.IN_A);
		local facttime = res_calc_fact_inbuild_time(ntime, culturelevel, govlevel, role_interior)
		return math.floor(facttime);
	end;
	
	_speedByStateEffect = function(self, ntime)
		local state = self.player:getStateContainer():getEffectState(RES_EFF.ADD_BUILD_SPEED)
		if state == nil then
			return ntime
		end
		
		if state:getEffectValUnit() == VAL_UNIT.PER then
			return ntime/(1 + state:getEffectVal()/100)
		else
			return math.max(1, ntime - state:getEffectVal())
		end
	end;
})

CityAddBuildHdr = CityBuildHdr:extends({
	_initParam = function(self, player, cmdtb)
		self.id = Util:getNumber(cmdtb, 'id')
		self.resid = Util:getNumber(cmdtb, 'resid')
		self.cityid = Util:getNumber(cmdtb, 'cid')
		self.level = 0
		self.player = player 
		self.city = player:getCitys():getCityById(self.cityid)
		if self.city == nil then
			return false
		end
		
		self.citytype = self.city:getType()
		
		return true
	end;
	
	_isValidResId = function(self)
		return self:_isCanBuildInCity(self.resid)
	end;
	
	_isValidBlockId = function(self)
		local maxid = 0
		if self.citytype == CITY_TYPE.MAIN then 
			local cres = self.player:getCityRes()
			maxid = res_maincity_inbuildnums['LV'..cres:getLevel()] -- 主城的格子数是逐级开启
		elseif (self.citytype >= CITY_TYPE.SUBRES) and (self.citytype <= CITY_TYPE.SUBARMY) then
			maxid = res_subcity_inbuildnum
		end
		return (self.id >= 1) and (self.id <= maxid)
	end;
	
	_isValid = function(self)
		if self.expends == nil then return false end
		if not self:_isValidResId() then return false end
		if not self:_isValidBlockId() then return false end
		if self:_isFullBuildingCnt() then return false end
		if self:_isArrivedMaxBuildCount() then return false end
		if not self:_isValidPreCondition() then return false end
		if not self:_isEmptyBlock() then return false end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		return true
	end;
	
	_isArrivedMaxBuildCount = function(self)
		local res = ItemResUtil:findItemres(self.resid)
		local builds = self.city:getBuildsByResId(self.resid)
		return table.getn(builds) >= res.maxCount 
	end;
	
	_isEmptyBlock = function(self)
		return self.city:getBuildById(self.id) == nil
	end;

	_docmd = function(self)
		WUtil:subExpends(self.expends)
		local needtime = self:_getBuildNeedTime()
		local stoptime = Util:getTime() + needtime
		self.city:addBuild({id=self.id, resid=self.resid, level=0, state=BUILD_STATE.UPGRADE, stoptime=stoptime})
		global.getTimer():start(needtime*1000, {TIMER_EVT.BUILDUP_STOP, self.cityid, self.id}, self.player:getTimerCaller())
		CityBuildSender:send(self.player, self.cityid, self.id)
	end;
})

CityExistBuildHdr = CityBuildHdr:extends({
	_initParam = function(self, player, cmdtb)
		self.id = Util:getNumber(cmdtb, 'id')
		self.cityid = Util:getNumber(cmdtb, 'cid')
		
		local citys = player:getCitys()
		self.city = citys:getCityById(self.cityid)
		if self.city == nil then return false end
		
		self.citytype = self.city:getType()
		if self.citytype == CITY_TYPE.NONE then return false end
		
		self.build = self.city:getBuildById(self.id)
		if self.build == nil then return false end
		
		self.resid = self.build.ulResId
		self.level = self.build.ucLevel
		self.player = player
		
		return true
	end;
})

CityUpBuildHdr = CityExistBuildHdr:extends({
	_isValid = function(self)
		if self.expends == nil then return false end
		if self:_isFullBuildingCnt() then return false end
		if not self:_isCommState() then return false end
		if not self:_isValidPreCondition() then return false end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		return true
	end;
	
	_docmd = function(self)
		WUtil:subExpends(self.expends)
		local needtime = self:_getBuildNeedTime()
		local stoptime = Util:getTime() + needtime
		self.city:upgradeBuilding(self.build, {stoptime=stoptime})
		global.getTimer():start(needtime*1000, {TIMER_EVT.BUILDUP_STOP, self.cityid, self.id}, self.player:getTimerCaller())
		CityBuildSender:send(self.player, self.cityid, self.id)
	end;
})

CityDownBuildHdr = CityExistBuildHdr:extends({
	_getExpends = function(self)
	end;
	
	_isValid = function(self)
		if self:_isFullBuildingCnt() then return false end
		if not self:_isCommState() then return false end
		if not self:_isCanDownBuild() then return false end
		return true
	end;
	
	_isCanDownBuild = function(self)
		local canNotDownBuilds = {FIXID.GOV_BUILD, FIXID.WALLBUILD}
		local canNotDownBuildsWhenOneLevel = {FIXID.SITUSHU, FIXID.SIMASHU}
		if Util:find(canNotDownBuilds, null, self.resid) ~= nil then
			return false
		end
		
		if (self.level == 1) and (Util:find(canNotDownBuildsWhenOneLevel, null, self.resid) ~= nil) then
			return false
		end
		
		return true
	end;
	
	_docmd = function(self)
		local needtime = self:_getBuildNeedTime()
		local stoptime = Util:getTime() + needtime
		self.city:downBuilding(self.build, {stoptime=stoptime})
		global.getTimer():start(needtime*1000, {TIMER_EVT.BUILDDOWN_STOP, self.cityid, self.id}, self.player:getTimerCaller())
		CityBuildSender:send(self.player, self.cityid, self.id)
	end;
	
	_getBuildLevelres = function(self)
		return ItemResUtil:findBuildLevelres(self.resid, self.level)
	end;
	
	_getBuildNeedTime = function(self)
		local res = self:_getBuildLevelres()
		return self:_calcFactNeedTime(res.ntime*res_down_retres_per)
	end;
})

CityCancelBuildingHdr = CityExistBuildHdr:extends({
	_getExpends = function(self)
	end;
	
	_isValid = function(self)
		if self:_isCommState() then return false end
		return true
	end;
	
	_docmd = function(self)
		self.build.ucState = BUILD_STATE.COMM
		if self.build.ucLevel == 0 then 
			self.city:delBuild(self.id) 
		end
		CityBuildSender:send(self.player, self.cityid, self.id)	
	end;
})

BaseSubCityHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then 
			return false
		end
		
		self:_createExpends()
		
		if not self:_hasEnoughExpends() then
			return false
		end
		
		if not self:_isValid() then
			return false
		end
		
		self:_createSubCity()
		self:_subExpends()
		player:recalRoleAppendAttrs()
		self:_sendMsgs()
		self:_doTasks()
		
		return true
	end;
	
	_isValid = function(self)
	end;
	
	_initParam = function(self, player, cmdtb)
		local subCityId = Util:getNumber(cmdtb, 'id')
		if (subCityId < BUILDCITY_ID.SUB1) or (subCityId > BUILDCITY_ID.SUB4) then
			return false
		end
		
		local subCityType = Util:getNumber(cmdtb, 'type')
		if (subCityType ~=CITY_TYPE.SUBRES) and (subCityType ~=CITY_TYPE.SUBARMY) then
			return false
		end
		
		self.subCityId = subCityId
		self.subCityType = subCityType
		self.player = player
		
		return true
	end;
	
	_isExistSubCity = function(self)
		return self.player:getCitys():getCityById(self.subCityId) ~= null
	end;
	
	_createExpends = function(self)
		local expendRess = {{resid=FIXID.TIANGONGTU, type=EXPEND_TYPE.ITEM,val=self:_getNeedItemCount()}}
		self.expends = WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
	
	_hasEnoughExpends = function(self)
		if not WUtil:isEnoughExpends(self.expends) then
			local hasItemNum = self.player:getPkg():getItemNumber(FIXID.TIANGONGTU)
			WUtil:sendPopBoxMsgArgs(self.player, 100066, '"@itemid' .. FIXID.TIANGONGTU .. '",' .. self:_getNeedItemCount() .. ',' .. hasItemNum .. ',' .. FIXID.TIANGONGTU )
			return false
		end
		
		return true
	end;
	
	_subExpends = function(self)
		WUtil:subExpends(self.expends)
	end;
	
	_createSubCity = function(self)
		local city = self:_allocSubCity()
		local initBuildRes = self:_getInitBuildRes()
		for _, b in ipairs(initBuildRes) do
			city:addBuild({id=b.id,resid=b.resid,level=b.level,state=b.state,stoptime=0})
		end
	end;
	
	_allocSubCity = function(self)
	end;
	
	_getInitBuildRes = function(self)
		if self.subCityType == CITY_TYPE.SUBRES then
			return res_role_initdata.resbuild
		else
			return res_role_initdata.militarybuild
		end
	end;
	
	_sendMsgs = function(self)
		CityBuildSender:sendCitysType(self.player)
		CityBuildSender:sendOneCityAllBuilds(self.player, self.subCityId)
		WUtil:sendSuccMsgArgs(self.player, 100064, '')
	end;
	
	_doTasks = function(self)
	end;
})

CreateSubCityHdr = BaseSubCityHdr:extends({
	_isValid = function(self)
		if self:_isExistSubCity() then
			return false
		end
		
		if not self:_hasEnoughCityLevel() then
			return false
		end
		
		return true
	end;
	
	_hasEnoughCityLevel = function(self)
		local needCityLevel = res_create_subcity_needcitylevels[self.subCityId]
		return needCityLevel <= self.player:getCityRes():getLevel()
	end;
	
	_allocSubCity = function(self)
		local city = self.player:getCitys():addCity(self.subCityType)
		self.subCityId = self.player:getCitys():getCityCount()
		return city
	end;
	
	_getNeedItemCount = function(self)
		return self.player:getCitys():getCityCount()
	end;
	
	_doTasks = function(self)
		TaskFinisher:checkTasks(self.player)
	end;
})

ChangeSubCityHdr = BaseSubCityHdr:extends({
	_isValid = function(self)
		if not self:_isExistSubCity() then
			return false
		end
		
		if not self:_isCanChangeState() then
			return false
		end;
		
		if not self:_isTypeChanged() then
			return false
		end
	
		return true
	end;
	
	_isCanChangeState = function(self)
		local city = self.player:getCitys():getCityById(self.subCityId)
		if city:getBuildCount() == 0 then
			return false
		end
		
		if city:getBuildCount() > 1 then
			return false
		end
		
		local build = city:getBuildByResId( self:_getMainBuildResId(city) )
		if build == nil then
			return false
		end
		
		return build.ucLevel == 1
	end;
	
	_getMainBuildResId = function(self, city)
		if city:getType() == CITY_TYPE.SUBRES then
			return FIXID.SITUSHU
		else
			return FIXID.SIMASHU
		end
	end;
	
	_isTypeChanged = function(self)
		local city = self.player:getCitys():getCityById(self.subCityId)
		if city:getType() == self.subCityType then
			WUtil:sendWarningMsgArgs(self.player, 100065, '')
			return false
		end
		
		return true
	end;
	
	_getNeedItemCount = function(self)
		return 2
	end;

	_allocSubCity = function(self)
		local city = self.player:getCitys():getCityById(self.subCityId)
		city:setType(self.subCityType)
		city:setBuildCount(0)
		return city
	end;
})

SendAllAllianceBuildsHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local sendmsg = '{cmd:'..NETCMD.BUILDRES..',abuild:['
		sendmsg = sendmsg..'{id:1,resid:110101,state:0,level:5}'
		sendmsg = sendmsg..',{id:2,resid:110102,state:0,level:1}'
		sendmsg = sendmsg..',{id:3,resid:110103,state:0,level:1}'
		sendmsg = sendmsg..',{id:4,resid:110104,state:0,level:1}'
		sendmsg = sendmsg..',{id:5,resid:110105,state:0,level:1}'
		sendmsg = sendmsg..',{id:6,resid:110100,state:0,level:6}'
		sendmsg = sendmsg..']}'
		player:sendMsg(sendmsg)
	end;
})

AllianceUpBuildHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local sendmsg = '{cmd:'..NETCMD.BUILDRES..',abuild:['
		sendmsg = sendmsg..'{id:'..cmdtb.id..',state:1,stoptime:'..(Util:getTime()+18)..',level:2}'
		sendmsg = sendmsg..']}'
		player:sendMsg(sendmsg)	
	end;
})

AllianceUpBuildEndHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local sendmsg = '{cmd:'..NETCMD.BUILDRES..',abuild:['
		sendmsg = sendmsg..'{id:'..cmdtb.id..',state:0,level:2}'
		sendmsg = sendmsg..']}'
		player:sendMsg(sendmsg)
	end;
})


