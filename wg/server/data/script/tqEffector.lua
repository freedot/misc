--*******************************************************************************
--1. 必杀等级小于等于幸运等级就无效
--2. 必杀等级大于幸运等级
--*******************************************************************************
EffectorMgr = Class:extends({
	regEffectors = function(self)
		self.regEffectorDict = {}
		self.regEffectorDict[RES_EFF.ACCELERATE] = BuildAccEffector:new()
		self.regEffectorDict[RES_EFF.REFRESHNHERO] = RefreshNewHeroEffector:new()
		self.regEffectorDict[RES_EFF.ADDHEROHEALTH] = AddHeroHealthEffector:new()
		self.regEffectorDict[RES_EFF.ADDHEROMORALE] = AddHeroMoraleEffector:new()
		self.regEffectorDict[RES_EFF.ADDHEROIF] = AddHeroInnerForceEffector:new()
		self.regEffectorDict[RES_EFF.ACC_STEELMAILUO] = HeroSSteelAccEffector:new()
		self.regEffectorDict[RES_EFF.ACC_STEELSKILL] = HeroSkillSteelAccEffector:new()
		
		self.regEffectorDict[RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD] = FullAccBuildUseGiftGoldEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD] = FullAccCultureLearnUseGiftGoldEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD] = FullAccSkeletonSteelUseGiftGoldEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD] = FullAccSkillSteelUseGiftGoldEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD] = FullAccCityDefBuildUseGiftGoldEffector:new()
		
		self.regEffectorDict[RES_EFF.ACC_TRADING] = TradingAccEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD] = FullTradingAccUseGiftGoldEffector:new()
		self.regEffectorDict[RES_EFF.ACC_DOINGROLETASK] = DoingRoleTaskAccEffector:new()
		self.regEffectorDict[RES_EFF.FULL_ACC_TASK_USEGIFTGOLD] = FullTaskAccUseGiftGoldEffector:new()
		
		self.regEffectorDict[RES_EFF.ADD_CANSTEELSKILL] = AddHeroCanSkillSteelTimeEffector:new()
		self.regEffectorDict[RES_EFF.LEARN_HERO_BSKILL] = HeroLearnBaseSkillEffector:new()
		self.regEffectorDict[RES_EFF.LEARN_HERO_TSKILL] = HeroLearnTacticSkillEffector:new()
		self.regEffectorDict[RES_EFF.LEARN_HERO_SSKILL] = HeroLearnSpecSkillEffector:new()
		self.regEffectorDict[RES_EFF.ADD_NEWSOLDIER] = AddRoleNewSoldierNumEffector:new()
		self.regEffectorDict[RES_EFF.ACC_CULTURELEARN] = LearnCultureAccEffector:new()
		self.regEffectorDict[RES_EFF.ACC_CITYDEF] = BuildCityDefAccEffector:new()
		
		self.regEffectorDict[RES_EFF.F_ADD_FULLATTRS] = AddFullFightAttrsEffector:new()
		self.regEffectorDict[RES_EFF.F_ADD_ES] = AddFightESAttrEffector:new()
		self.regEffectorDict[RES_EFF.F_JIPO] = CancelFightDEAttrEffector:new()
		self.regEffectorDict[RES_EFF.F_XUERUO] = XueruoDEAttrEffector:new()
		self.regEffectorDict[RES_EFF.F_CUIDU3] = CuiDuAttrEffector:new()
		self.regEffectorDict[RES_EFF.F_SHENYI] = AddHPAttrEffector:new()
		self.regEffectorDict[RES_EFF.F_FANJI] = FanJiFightEffector:new()
		self.regEffectorDict[RES_EFF.F_ADD_HU] = AddHurtFightEffector:new()
		self.regEffectorDict[RES_EFF.F_BISHA] = BiShaFightEffector:new()
		self.regEffectorDict[RES_EFF.F_LIANJI] = AddHurtFightEffector:new()
		self.regEffectorDict[RES_EFF.F_HUOGONG] = HuoGongFightEffector:new()
		self.regEffectorDict[RES_EFF.F_CHENGSHANG] = ChengShangFightEffector:new()
		self.regEffectorDict[RES_EFF.F_XIXUE] = XiXueFightEffector:new()
		
		self.regEffectorDict[RES_EFF.LEARN_LINEUP] = LearnLineUpEffector:new()
		self.regEffectorDict[RES_EFF.ADD_THREE_BUILDINGPOS] = AddThreeBuildingPosEffector:new()
		self.regEffectorDict[RES_EFF.TOWER_RECOVER_SOLDIER] = AddTowerRecoverSoldierEffector:new()
		self.regEffectorDict[RES_EFF.TOWER_RECOVER_SOLDIER_BYACT] = AddTowerRecoverSoldierByActEffector:new()
		self.regEffectorDict[RES_EFF.RESTORE_HURT_BUILDVAL] = RestoreHurtBuildValEffector:new()
		
		self.regEffectorDict[RES_EFF.SEND_WORLD_BLESS] = SendWorldBlessEffector:new()
		self.regEffectorDict[RES_EFF.SETPOS_MOVECITY] = SetPosMoveCityEffector:new()
		self.regEffectorDict[RES_EFF.RAND_MOVECITY] = RandMoveCityEffector:new()
		self.regEffectorDict[RES_EFF.DROPITEM] = DropItemEffector:new()
		self.regEffectorDict[RES_EFF.PASSIVITY_DROPITEM] = PassivityDropItemEffector:new()
		
		self.regEffectorDict[RES_EFF.ADD_FOOD] = AddCommResEffector:new({'Food'})
		self.regEffectorDict[RES_EFF.ADD_WOOD] = AddCommResEffector:new({'Wood'})
		self.regEffectorDict[RES_EFF.ADD_STONE] = AddCommResEffector:new({'Stone'})
		self.regEffectorDict[RES_EFF.ADD_IRON] = AddCommResEffector:new({'Iron'})
		self.regEffectorDict[RES_EFF.ADD_MONEY] = AddCommResEffector:new({'Money'})
		self.regEffectorDict[RES_EFF.ADD_FOURRES] = AddCommResEffector:new({'Food', 'Wood', 'Stone', 'Iron'})
		
		self.regEffectorDict[RES_EFF.AVOIDFIGHT] = AddAvoidFightEffector:new()
		
		self.regEffectorDict[RES_EFF.ADD_ROLEATTRVAL] = AddRoleAttrEffector:new()
		
		self.regEffectorDict[RES_EFF.ADD_BUILD_SPEED] = AddBuildSpeedEffector:new()
		self.regEffectorDict[RES_EFF.ADD_COMMRES_OUTPUT] = AddCommResOutputEffector:new()
		self.regEffectorDict[RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT] = AddCultureSpeedAndMoneyOutputEffector:new()
	end;
	
	getEffector = function(self, effres)
		local effector = self.regEffectorDict[effres.id]
		if effector == nil then
			return NullEffector
		end
		
		return effector
	end;
}):new()

Effector = Class:extends({
	isCanExec = function(self, player, number, effectres, params)
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return number
	end;
	
	exec = function(self, player, number, effectres, params)
	end;
});

NullEffector = Class:extends({
	isCanExec = function(self, player, number, effectres, params)
		return false
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 0
	end;
	
	exec = function(self, player, number, effectres, params)
	end;
}):new();

RefreshNewHeroEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		return number == 1
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 1
	end;
	
	exec = function(self, player, number, effectres)
		local heromgr = player:getHeroMgr()
		local newheros = heromgr:getNewHeros()
		newheros:refreshNewHeros()
	end;
})

AddRoleAttrEffector = Effector:extends({
	getNeedNumber = function(self, player, number, effectres)
		local attrid = effectres.val2;
		local maxattrid = effectres.val3;
		local curVal = player:getAttrVal(attrid)
		local maxVal = self:_getMaxAttrVal(player, maxattrid)
		local drtVal = maxVal - curVal
		local maxNeedNumber = math.ceil(drtVal / effectres.val)
		return math.min(maxNeedNumber, number)
	end;
	
	isCanExec = function(self, player, number, effectres, params, attrid, maxattrid)
		local attrid = effectres.val2;
		local maxattrid = effectres.val3;
		
		local effectVal = effectres.val * number
		if effectVal == 0 then
			return false
		end
		
		local curVal = player:getAttrVal(attrid)
		local maxVal = self:_getMaxAttrVal(player, maxattrid)
		local isCan = curVal < maxVal
		if not isCan then
			WUtil:sendWarningMsgArgs(player, 100102, '"@attrid' .. attrid .. '"')
		end
		return isCan
	end;
	
	exec = function(self, player, number, effectres, params)
		local attrid = effectres.val2;
		local maxattrid = effectres.val3;
		
		local oldVal = player:getAttrVal(attrid)
		local effectVal = effectres.val * number
		local attrVal = oldVal + effectVal
		local maxVal = self:_getMaxAttrVal(player, maxattrid)
		attrVal = math.min(attrVal, maxVal)
		player:setAttrVal(attrid, attrVal)
		RoleAttrSender:sendAttr(player, player:getAttr(attrid))
	end;
	
	_getMaxAttrVal = function(self, player, maxattrid)
		local maxVal = player:getAttrVal(maxattrid)
		if maxVal == 0 then
			maxVal = 0xffffffff
		end
		return maxVal
	end;
})

HeroAttrEffector = Effector:extends({
	_getNeedNumber = function(self, player, number, effectres, params, attrid, maxattrid)
		local curVal = params.hero:getAttrVal(attrid)
		local maxVal = params.hero:getAttrVal(maxattrid)
		local drtVal = maxVal - curVal
		local maxNeedNumber = math.ceil(drtVal / effectres.val)
		return math.min(maxNeedNumber, number)
	end;
	
	_isCanAddVal = function(self, player, number, effectres, params, attrid, maxattrid)
		local effectVal = effectres.val * number
		if effectVal == 0 then
			return false
		end
		
		local curVal = params.hero:getAttrVal(attrid)
		local maxVal = params.hero:getAttrVal(maxattrid)
		return curVal < maxVal	
	end;
	
	_addVal = function(self, player, number, effectres, params, attrid, maxattrid)
		local oldVal = params.hero:getAttrVal(attrid)
		local effectVal = effectres.val * number
		local attrVal = oldVal + effectVal
		local maxVal = params.hero:getAttrVal(maxattrid)
		attrVal = math.min(attrVal, maxVal)
		params.hero:setAttrVal(attrid, attrVal)
		HeroAttrSender:sendAttr(player, params.hero, params.hero:getAttr(attrid))
	end;
})

AddHeroHealthEffector = HeroAttrEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not params.hero:isFree() 
		 and not params.hero:isSteeling() 
		 and params.hero:getState() ~= HERO_STATE.ACT_TOWER 
		 and params.hero:getState() ~= HERO_STATE.ACT_TERRACE then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return false
		end
		
		return self:_isCanAddVal(player, number, effectres, params, ATTR.HEALTH, ATTR.MHEALTH)
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:_getNeedNumber(player, number, effectres, params, ATTR.HEALTH, ATTR.MHEALTH)
	end;
	
	exec = function(self, player, number, effectres, params)
		self:_addVal(player, number, effectres, params, ATTR.HEALTH, ATTR.MHEALTH)
		WUtil:sendSuccMsg(player, rstr.succ.treatmentsok)
	end;
})

AddHeroMoraleEffector = HeroAttrEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not params.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return false
		end
		
		return self:_isCanAddVal(player, number, effectres, params, ATTR.MO, ATTR.MMO)
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:_getNeedNumber(player, number, effectres, params, ATTR.MO, ATTR.MMO)
	end;
	
	exec = function(self, player, number, effectres, params)
		self:_addVal(player, number, effectres, params, ATTR.MO, ATTR.MMO)
	end;
})

AddHeroInnerForceEffector = HeroAttrEffector:extends({
	isCanExec = function(self, player, itemNumber, effectres, params)
		if not params.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return false
		end
		
		return self:_isCanAddVal(player, itemNumber, effectres, params, ATTR.IF, ATTR.MIF)
	end;
	
	getNeedNumber = function(self, player, itemNumber, effectres, params)
		local onetimeNeednum = res_get_str_if_need_itemnum( params.hero:getSkeletonLevel() )
		local times = math.floor(itemNumber/onetimeNeednum)
		local curIF = params.hero:getAttrVal(ATTR.IF)
		local maxIF = params.hero:getAttrVal(ATTR.MIF)
		local drtIFVal = maxIF - curIF
		
		self.adds = {}
		self.totalAddVal = 0
		for i=1, times, 1 do
			local curPer = math.random(100)
			local addVal = Util:getRoundRandVal( res_str_if_get_vals, curPer ).val
			if (self.totalAddVal + addVal) > drtIFVal then
				addVal = drtIFVal - self.totalAddVal
			end
			
			table.insert(self.adds, addVal)
			self.totalAddVal = self.totalAddVal + addVal
			
			if self.totalAddVal >= drtIFVal then
				break
			end
		end
		
		return table.getn(self.adds)*onetimeNeednum
	end;
	
	exec = function(self, player, itemNumber, effectres, params)
		if self.totalAddVal == 0 or self.totalAddVal == nil then
			return
		end
		
		if self.adds == nil then
			return
		end
		
		local onetimeNeednum = res_get_str_if_need_itemnum( params.hero:getSkeletonLevel() )
		if table.getn(self.adds)*onetimeNeednum ~= itemNumber then
			return
		end
		
		local newEffectres = { val=self.totalAddVal }
		self:_addVal(player, 1, newEffectres, params, ATTR.IF, ATTR.MIF)
		
		HeroAttrSender:sendStrIFResult(player, params.hero, self.adds)
	end;
})

AddHeroCanSkillSteelTimeEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		return (number*effectres.val) > 0
	end;
	
	exec = function(self, player, number, effectres, params)
		local heromgr = player:getHeroMgr()
		local canuse = heromgr:getCanUseSkillSteelTime() + number*effectres.val
		heromgr:setCanUseSkillSteelTime(canuse)
		HeroAttrSender:sendCanUseSSTime(player)
	end;
})

AddRoleNewSoldierNumEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		local effectVal = number*effectres.val
		if effectVal <= 0 then
			return false
		end
		
		local curVal = player:getAttrVal(ATTR.NAF)
		local maxVal = player:getAttrVal(ATTR.MNAF)
		return curVal < maxVal
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		local curVal = player:getAttrVal(ATTR.NAF)
		local maxVal = player:getAttrVal(ATTR.MNAF)
		local drtVal = maxVal - curVal
		local maxNeedNumber = math.ceil(drtVal / effectres.val)
		return math.min(maxNeedNumber, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		local val = player:getAttrVal(ATTR.NAF) + number*effectres.val
		local val = math.min(val, player:getAttrVal(ATTR.MNAF) )
		player:setAttrVal(ATTR.NAF, val)
		RoleAttrSender:sendAttr(player, player:getAttr(ATTR.NAF))
	end;
})

HeroLearnSkillEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if number ~= 1 then 
			return false
		end
		
		self:getParam(player, effectres, params)
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(self.player, 100022, '')
			return false
		end
		
		return self:isValid()
	end;
	
	getNeedNumber = function(self)
		return 1
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		self:addSkill()
		self:sendMsg()
	end;
	
	getParam = function(self, player, effectres, params)
		self.player = player
		self.hero = params.hero
		self.skillid = effectres.val
	end;
	
	noArriveLevel = function(self)
		return self.hero:getLevel() < res_hero_hasskill_minlevel
	end;
	
	isExistSkillId = function(self)
		local skills = self.hero:getSkills()
		return Util:findC(skills.astSkills, skills.ucCount, 'ulResId', self.skillid) ~= nil
	end;
	
	addSkill = function(self)
		self.skill = self.hero:addSkill({resid=self.skillid, level=1})
	end;
	
	sendMsg = function(self)
		SkillMsgSender:sendSkill(self.player, self.hero, self.skill)
	end;	
})

HeroLearnBaseSkillEffector = HeroLearnSkillEffector:extends({
	isValid = function(self)
		if self:noArriveLevel() then return false end
		if not self:hasGrids() then return end
		if self:isExistSkillId() then return end
		if self:hasSkillSteeling() then return end
		
		return true
	end;
	
	addSkill = function(self)
		self.skill = nil
		if self:hasEmptyGrids() then
			self.skill = self.hero:addSkill({resid=self.skillid,level=1,dex=0})
		else
			self.skill = self:randomReplaceSkill()
		end
	end;
	
	getParam = function(self, player, effectres, params)
		self.player = player
		self.hero = params.hero
		self.skillid = effectres.val
		self.gridnum = res_get_basegridcnt_by_herolevel( self.hero:getLevel() )
		self.baseskills = self:getBaseSkills()
	end;
	
	hasGrids = function(self)
		return self.gridnum > 0
	end;
	
	hasSkillSteeling = function(self)
		local skillsteel = self.hero:getSkillSteel()
		return skillsteel.ulResId > 0
	end;
	
	hasEmptyGrids = function(self)
		return table.getn(self.baseskills) < self.gridnum
	end;
	
	randomReplaceSkill = function(self)
		local baseskillcnt = table.getn(self.baseskills)
		local skillNode = self.baseskills[ math.random(baseskillcnt) ]
		
		SkillMsgSender:sendReplaceSkillId(self.player, self.hero, skillNode.idx, skillNode.skillId, self.skillid)
		
		local skill = self.hero:getSkillById(skillNode.skillId)
		skill.ulResId = self.skillid
		if skill.ucLevel == 1 then
			skill.ucLevel = math.random(res_learn_skill_max_level)
		end
		skill.ulDex = 0
		
		self.hero:changeSkill()
		
		return skill
	end;
	
	getBaseSkills = function(self)
		local baseskills = {}
		local allcnt = self.hero:getSkillCount()
		for i=0, allcnt-1, 1 do
			local skill = self.hero:getSkillByIdx(i)
			if skill.ulResId >= res_hero_baseskill_id_first and skill.ulResId <= res_hero_baseskill_id_last then
				table.insert(baseskills, {idx=(i+1), skillId=skill.ulResId})
			end
		end
		return baseskills
	end;
})

HeroLearnTacticSkillEffector = HeroLearnSkillEffector:extends({
	isValid = function(self)
		if self:noArriveLevel() then return false end
		if self:isExistSkillId() then return false end
		
		return true
	end;
})

HeroLearnSpecSkillEffector = HeroLearnSkillEffector:extends({
	isValid = function(self)
		if self:noArriveLevel() then return false end
		if self:isExistSkillId() then return false end
		if self:isInvalidProf() then return false end
		return true
	end;	
	
	isInvalidProf = function(self)
		return self.hero:getProf() ~= HERO_PROF.YONGSHI
	end;
	
	addSkill = function(self)
		self.skill = self.hero:addSkill({resid=self.skillid, level=1})
		local idxMaps = {}
		idxMaps[FIXID.DBSSKILL] = 0
		idxMaps[FIXID.JIBSSKILL] = 1
		idxMaps[FIXID.GBSSKILL] = 2
		idxMaps[FIXID.QBSSKILL] = 3
		idxMaps[FIXID.QXSSKILL] = 4
		
		local idx = idxMaps[self.skillid]
		self.hero:addSubject(idx, 1)
	end;
	
	sendMsg = function(self)
		SkillMsgSender:sendSkill(self.player, self.hero, self.skill)
		HeroAttrSender:sendSubjects(self.player, self.hero)
	end;	
})

AccelerateEffector = Effector:extends({
	isValidNumberAndEffectVal = function(self, number, effectres)
		if number <= 0 then 
			return false
		end
		
		if effectres.val <= 0 then
			return false
		end
		
		return true
	end;
	
	getNeedNumberInner = function(self, stoptime, effectres, number)
		if effectres.u == VAL_UNIT.PER then
			return self:getNeedNumberByPerVal(stoptime, effectres.val/100, number)
		else
			return self:getNeedNumberByVal(stoptime, effectres.val, number)
		end
	end;
	
	getNeedNumberByPerVal = function(self, stoptime, per, number)
		local needNumber = 0
		local durtime = stoptime - Util:getTime()
		for i=1, number, 1 do
			if durtime <= 1 then
				break
			end
			
			local curtateTime = math.floor(durtime*per)
			if curtateTime <= 1 then
				break
			end
			
			durtime =  durtime - curtateTime
			
			needNumber = needNumber + 1
		end
		return needNumber	
	end;
	
	getNeedNumberByVal = function(self, stoptime, val, number)
		local durtime =  stoptime - Util:getTime()
		local maxNeedNumber = math.ceil(durtime/val)
		return math.min(maxNeedNumber, number)	
	end;
	
	calcStopTime = function(self, stoptime, effectres, number)
		if effectres.u == VAL_UNIT.PER then
			return self:calcStopTimeByPerVal(stoptime, effectres.val/100, number)
		else
			return self:calcStopTimeByVal(stoptime, effectres.val, number)
		end
	end;
	
	calcStopTimeByPerVal = function(self, stoptime, per, number)
		local durtime = 0
		for i=1, number, 1 do
			durtime = stoptime - Util:getTime()
			local curtateTime = math.floor(durtime*per)
			stoptime =	stoptime - curtateTime
		end
		return stoptime
	end;
	
	calcStopTimeByVal = function(self, stoptime, val, number)
		local effectval = val * number
		if stoptime < effectval then
			return 0
		else
			return stoptime - effectval
		end
	end;
})

BuildAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		if params.build.ulStoptime <= Util:getTime() then 
			return false
		end
		
		local evt = self:getTimerEventType(params)
		if evt == TIMER_EVT.NONE then 
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:getNeedNumberInner(params.build.ulStoptime, effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local evt = self:getTimerEventType(params)
		params.build.ulStoptime = self:calcStopTime(params.build.ulStoptime, effectres, number)
		local needtime = params.build.ulStoptime - Util:getTime()
		global.getTimer():start(needtime*1000, {evt, params.cityid, params.build.ulId}, player:getTimerCaller())

		CityBuildSender:send(player, params.cityid, params.build.ulId)
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.SPEED_BUILDING)
	end;
	
	getTimerEventType = function(self, params)
		local evt = TIMER_EVT.NONE
		if params.build.ucState == BUILD_STATE.UPGRADE then
			evt = TIMER_EVT.BUILDUP_STOP
		elseif params.build.ucState == BUILD_STATE.DOWN then 
			evt = TIMER_EVT.BUILDDOWN_STOP
		end	
		return evt
	end;
})

--
AccNeedGoldCalculator = Class:extends({
	getNeedGold = function(self, accType, timeS)
		if timeS <= 0 then
			return 0
		end
		
		local res = Util:find(res_acc_needgolds, 'type', accType)
		local phaseCount = table.getn(res.phases)
		local lastPhase = {timeS = 0, gold = 0}
		for i, phase in ipairs(res.phases) do
			if timeS <= phase.timeS then
				return lastPhase.gold + math.floor((timeS - lastPhase.timeS)*(phase.gold - lastPhase.gold)/(phase.timeS - lastPhase.timeS)) + 1;
			end
			
			if phase.timeS == 0 then
				return math.floor(timeS*lastPhase.gold/lastPhase.timeS) + 1;
			end
			
			if i == phaseCount then
				return math.floor(timeS*phase.gold/phase.timeS) + 1;
			end
			
			lastPhase = phase
		end
		
		return 0
	end;
}):new()

FullAccUseGiftGoldEffector = Effector:extends({
	init = function(self)
		self.innerEffector = nil
		self.accType = ''
	end;
	
	isCanExec = function(self, player, number, effectres, params)
		if not self.innerEffector:isCanExec(player, number, effectres, params) then
			return false
		end
		
		return self:_hasEnoughGold(player, params)
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return AccNeedGoldCalculator:getNeedGold(self.accType, self:_getDurationTimeS(player, params) )
	end;
	
	exec = function(self, player, number, effectres, params)
		local newNumber = 1
		self.innerEffector:exec(player, newNumber, effectres, params)
		self:_checkTasks(player)
	end;
	
	_getDurationTimeS = function(self, player, params)
		return 0
	end;
	
	_hasEnoughGold = function(self, player, params)
		return self:getNeedNumber(player, nil, nil, params) <= player:getPkg():getAllGold()
	end;
	
	_checkTasks = function(self, player)
	end;
})

FullAccBuildUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = BuildAccEffector:new()
		self.accType = 'build'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return params.build.ulStoptime - Util:getTime()
	end;
	
	_checkTasks = function(self, player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.BUILD_UPGRADE_USEGOLD)
	end;
})

FullAccCultureLearnUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = LearnCultureAccEffector:new();
		self.accType = 'culture'
	end;
	
	_getDurationTimeS = function(self, player, params)
		local learningCulture = player:getCultures():getLearningCulture()
		return learningCulture.stoptime - Util:getTime()
	end;
})

FullAccSkeletonSteelUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = HeroSSteelAccEffector:new();
		self.accType = 'skeleton'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return params.hero:getSSteelStopTime() - Util:getTime()
	end;
})

FullAccSkillSteelUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = HeroSkillSteelAccEffector:new();
		self.accType = 'skill'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return params.hero:getSkillSteel().ulStoptime - Util:getTime()
	end;
})

FullAccCityDefBuildUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = BuildCityDefAccEffector:new();
		self.accType = 'citydef'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return player:getCityDef():getBuildingStopTime() - Util:getTime()
	end;
})


HeroSSteelAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		if not params.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return false
		end
		
		local hero = params.hero
		local stoptime = hero:getSSteelStopTime()
		if stoptime == 0 then 
			return false 
		end
		
		if stoptime <= Util:getTime() then 
			return false 
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:getNeedNumberInner(params.hero:getSSteelStopTime(), effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local hero = params.hero
		local stoptime = hero:getSSteelStopTime()
		stoptime = self:calcStopTime(stoptime, effectres, number)
		stoptime = math.max(1, stoptime) -- must not 0, need keep steeling state

		hero:setSSteelStopTime(stoptime)
		local needtime = stoptime - Util:getTime()
		global.getTimer():start(needtime*1000, {TIMER_EVT.SSTEEL_HERO_STOP, hero:getId()}, player:getTimerCaller())
		HeroAttrSender:sendSkeleton(player, hero)
	end;
})

HeroSkillSteelAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		if not params.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return false
		end		
		
		local hero = params.hero
		local skillsteel = hero:getSkillSteel()
		if skillsteel.ulResId == 0 then 
			return false
		end
		
		if skillsteel.ulStoptime <= Util:getTime() then 
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:getNeedNumberInner(params.hero:getSkillSteel().ulStoptime, effectres, number)
	end;	
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then	
			return
		end
		
		local hero = params.hero
		local skillsteel = hero:getSkillSteel()
		skillsteel.ulStoptime = self:calcStopTime(skillsteel.ulStoptime, effectres, number)
		local needtime = skillsteel.ulStoptime - Util:getTime()
		global.getTimer():start(needtime*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, hero:getId(), skillsteel.ulResId}, player:getTimerCaller())
		HeroAttrSender:sendSkillSteel(player, hero)
	end;
})

LearnCultureAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		local learningCulture = player:getCultures():getLearningCulture()
		if learningCulture.id == 0 then 
			return false
		end
		
		if learningCulture.stoptime <= Util:getTime() then 
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		local learningCulture = player:getCultures():getLearningCulture()
		return self:getNeedNumberInner(learningCulture.stoptime, effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local learningCulture = player:getCultures():getLearningCulture()
		learningCulture.stoptime = self:calcStopTime(learningCulture.stoptime, effectres, number)
		local needtime = learningCulture.stoptime - Util:getTime()
		global.getTimer():start(needtime*1000, {TIMER_EVT.LEARN_CULTURE_STOP, learningCulture.id}, player:getTimerCaller())
		CultureSender:sendLearningCulture(player)
	end;
})

BuildCityDefAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		local cityDef = player:getCityDef()
		if cityDef:getBuildingResid() == 0 then 
			return false
		end
		
		if cityDef:getBuildingStopTime() <= Util:getTime() then 
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:getNeedNumberInner(player:getCityDef():getBuildingStopTime(), effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local cityDef = player:getCityDef()
		cityDef:setBuildingStopTime(self:calcStopTime(cityDef:getBuildingStopTime(), effectres, number))
		local needtime = cityDef:getBuildingStopTime() - Util:getTime()
		global.getTimer():start(needtime*1000, {TIMER_EVT.BUILD_CITYDEF_STOP, cityDef:getBuildingResid()}, player:getTimerCaller())
		
		PlayerCityDefSender:sendBuilding(player)
	end;
})

--
AddFullFightAttrsEffector = Effector:extends({
	exec = function(self, actor, effectRes)
		-- 已经在二级属性中计算
	end;
})

FightEffector = Effector:extends({
	init = function(self)
		self.attrId=0
	end;
	
	exec = function(self, user, target, stream, effectRes, attackersCamp, defendersCamp)
		self:initParam(user, target, stream, effectRes, attackersCamp, defendersCamp)
		if (not self:isValid()) then return end
		
		self.effectVal = self:getEffectVal()
		self:setEffectVal()
		self:addSteam()
	end;
	
	initParam = function(self, user, target, stream, effectRes, attackersCamp, defendersCamp)
		self.user = user
		self.target = target
		self.stream = stream
		self.effectRes = effectRes
		self.attackersCamp = attackersCamp
		self.defendersCamp = defendersCamp
	end;
	
	isValid = function(self)
		if (self.effectRes == nil) then return false end
		if (self.user:isDie()) then return false end
		if (self.target:isDie()) then return false end
		if (self.target:getType() == ACTOR_TYPE.WALL) then return false end
		if (self.target:getType() == ACTOR_TYPE.DEF) then return false end
		
		return true
	end;
	
	getEffectVal = function(self)
		if self.effectRes.u == VAL_UNIT.VAL then
			return self.effectRes.val
		else
			return self:getBaseVal()*self.effectRes.val/100
		end
	end;
	
	setEffectVal = function(self)
		self.target:addTmpAttrValInFight(self.attrId, self.effectVal)
	end;
	
	getBaseVal = function(self)
		return self.target:getAttrVal(self.attrId)
	end;
	
	addSteam = function(self)
		self.stream:pushEvent({event='effect', userid=self.user:getId(), targetid=self.target:getId(), effid=self.effectRes.id, attr=self.attrId, val=math.floor(self.effectVal)})
	end;	
})

AddFightESAttrEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.ES
	end;
})

CancelFightDEAttrEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.DE
	end;
	
	getEffectVal = function(self)
		return -self.target:getAttrVal(self.attrId)
	end;
})

XueruoDEAttrEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.DE
	end;
	
	setEffectVal = function(self)
		self.target:addTmpAttrValInFight(self.attrId, -self.effectVal)
	end;
})

FanJiFightEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.PS
	end;
	
	isValid = function(self)
		if not FightEffector.isValid(self) then return false end
		local hasDiXiaoFanJi = self.target:getEffect(RES_EFF.F_DIXIAOFANJI)
		if hasDiXiaoFanJi then return false end
		if self:calcDistance(self.user, self.target) > self.user:getAttackRange() then return false end
		return true
	end;
	
	getEffectVal = function(self)
		if self.effectRes.u == VAL_UNIT.VAL then
			return self.effectRes.val 
		else
			local baseHurt = FightHurtCalcHelper:calcBasePhyHurt(self.user, self.target)
			return baseHurt*self.effectRes.val/100
		end
	end;
	
	setEffectVal = function(self)
		self.target:subHP(self.effectVal)
	end;
	
	calcDistance = function(self, actor1, actor2) 
		local pos1 = actor1:getPos()
		local pos2 = actor2:getPos()
		return math.abs(pos1.x - pos2.x) + math.abs(pos1.y - pos2.y)
	end;
})

CuiDuAttrEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.HP
	end;
	
	setEffectVal = function(self)
		self.target:subHP(self.effectVal)
	end;
	
	getBaseVal = function(self)
		if self.effectRes.minHp ~= nil then
			return self.effectRes.minHp
		end
		
		local val1 = self.user:getAttrVal(self.attrId)
		local val2 = self.target:getAttrVal(self.attrId)
		return math.min(val1, val2)
	end;
})

AddHPAttrEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.HP
	end;
	
	getBaseVal = function(self)
		return self.target:getAttrVal(ATTR.MHP)
	end;
	
	setEffectVal = function(self)
		self.target:addHP(self.effectVal)
	end;
})

AddHurtFightEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.HP
	end;
	
	getBaseVal = function(self)
		return self.user:getBaseHurt()
	end;
	
	setEffectVal = function(self)
		self.user:setHurt(self.user:getHurt() + self.effectVal)
	end;
})

HuoGongFightEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.HP
		self.attackTagertNum = 3
	end;
	
	setEffectVal = function(self)
		if self.user:getType() == ACTOR_TYPE.HERO then
			self:setEffectValInner(self.target, self.effectVal)
		elseif self.user:getType() == ACTOR_TYPE.SOLDIER then
			local targets = self:getRandEnemys(self.attackTagertNum)
			for _, target in ipairs(targets) do
				self:setEffectValInner(target, self.effectVal)
			end
		end
	end;
	
	setEffectValInner = function(self, target, effectVal)
		effectVal = self:addEffectVal(target, effectVal)
		target:subHP(effectVal)
		self.stream:pushEvent({event='effect', userid=self.user:getId(), targetid=target:getId(), effid=self.effectRes.id, attr=self.attrId, val=math.floor(effectVal)})
	end;

	getBaseVal = function(self)
		return self.user:getAttrVal(ATTR.HU)*self.user:getFightUnitNumber()
	end;
	
	addSteam = function(self)
	end;
	
	addEffectVal = function(self, target, effectVal)
		local fireHurtEffect = target:getEffect(RES_EFF.F_ADD_FIREHURT)
		if fireHurtEffect == nil then 
			return effectVal 
		end
		
		if fireHurtEffect.u == VAL_UNIT.VAL then
			return effectVal + fireHurtEffect.val
		else
			return effectVal*(1 + fireHurtEffect.val/100)
		end
	end;
	
	getRandEnemys = function(self, needNumber)
		local enemysCamp = self:getEnemysCamp()
		local collects = self:collectLiveSoldiers(enemysCamp.actors)
		return self:_getRandNumActors(collects, needNumber)
	end;
	
	getEnemysCamp = function(self)
		if self.user:getCamp() == FIGHT_CAMP.ATTACK then
			return self.defendersCamp
		else
			return self.attackersCamp
		end
	end;
	
	collectLiveSoldiers = function(self, actors)
		local collects = {}
		for _, actor in ipairs(actors) do
			if (actor:getType() == ACTOR_TYPE.SOLDIER) and (not actor:isDie()) then
				table.insert(collects, actor)
			end
		end
		return collects
	end;
	
	_getRandNumActors = function(self, actors, leftNumber)
		local totalNumber = table.getn(actors)
		local removeNumber = math.max(0, totalNumber - leftNumber)
		for i=1, removeNumber, 1 do
			local tableIdx = math.random(totalNumber)
			table.remove(actors, tableIdx)
			totalNumber = totalNumber - 1
		end
		return actors
	end;
})

BiShaFightEffector = AddHurtFightEffector:extends({
	isValid = function(self)
		if not AddHurtFightEffector.isValid(self) then return false end
		
		local biSha = self.user:getEffect(RES_EFF.F_BISHA)
		if biSha == nil then
			return false
		end
		
		local xingYun = self.target:getEffect(RES_EFF.F_XINGYUN)
		if xingYun == nil then
			return self:_isInPro(biSha.pro)
		end
		
		if xingYun.skillLevel >= biSha.skillLevel then
			return false
		end
		
		local pro = biSha.pro - xingYun.val
		return self:_isInPro(pro)
	end;
	
	_isInPro = function(self, pro)
		return math.random(100) <= pro
	end;
})


ChengShangFightEffector = FightEffector:extends({
	init = function(self)
		self.attrId=ATTR.HP
	end;
	
	getBaseVal = function(self)
		return self.user:getBaseHurt()
	end;
	
	setEffectVal = function(self)
		self.user:setHurt(self.user:getHurt() - self.effectVal)
	end;
	
	addSteam = function(self)
		local evt = self.stream:getEventByReverse({event='berserk', userid=self.user:getId(), targetid=self.target:getId()})
		if evt == nil then
			evt = self.stream:getEventByReverse({event='attack', userid=self.user:getId(), targetid=self.target:getId()})
		end
		
		if evt ~= nil then
			evt.val = evt.val - self.effectVal
		end
	end;		
})

XiXueFightEffector = AddHPAttrEffector:extends({
	getBaseVal = function(self)
		return self.user:getHurt()
	end;
})

LearnLineUpEffector = Effector:extends({
	exec = function(self, player, number, effectres)
		local lineupId = effectres.val
		player:addLineup(lineupId)
		MilitarySender:sendLineups(player)
	end;
})

AddThreeBuildingPosEffector = Effector:extends({
	exec = function(self, player, number, effectres, params)
		local duration = effectres.val * number
		local stateContainer = player:getStateContainer()
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=duration, effect={id=RES_EFF.ADD_THREE_BUILDINGPOS,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		stateContainer:appendState(stateRes, creator)
		
		player:getCitys():handleAutoBuilds()
	end;
})

RecoverSoldierEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		return player:getStateContainer():isCanAppend(self:_getEffectId())
	end;
	
	exec = function(self, player, number, effectres, params)
		local stateContainer = player:getStateContainer()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=effectres.val2, effect={id=self:_getEffectId(),val=effectres.val,unit=1}}
		local creator = {type=0,id=0,skillId=0}
		stateContainer:appendState(stateRes, creator)
	end;
})

AddTowerRecoverSoldierEffector = RecoverSoldierEffector:extends({
	_getEffectId = function(self)
		return RES_EFF.TOWER_RECOVER_SOLDIER
	end;
})

AddTowerRecoverSoldierByActEffector = RecoverSoldierEffector:extends({
	_getEffectId = function(self)
		return RES_EFF.TOWER_RECOVER_SOLDIER_BYACT
	end;
})

RestoreHurtBuildValEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		return (number*effectres.val) > 0
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		local hurtVal = player:getCityRes():getBuildHurtVal()
		if hurtVal == 0 then
			WUtil:sendWarningMsgArgs(player, 100167, '')
			return 0
		else
			local needNumber = math.ceil(hurtVal / effectres.val)
			if needNumber > number then
				needNumber = number
			end
			return needNumber
		end
	end;
	
	exec = function(self, player, number, effectres, params)
		local cityRes = player:getCityRes()
		local hurtVal = cityRes:getBuildHurtVal() - number*effectres.val
		cityRes:setBuildHurtVal(hurtVal)
		CityBuildValSender:send(player, {'hurtval'})
	end;
})

SendWorldBlessEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		local msg = Util:getString(params.netcmd, 'tmsg')
		if string.len(msg) == 0 then
			return false
		end
		
		if string.len(msg) > res_max_bless_string_len then
			return false
		end
		
		if DirtyWordChecker:has(msg) then
			WUtil:sendWarningMsgArgs(player, 100041, '')
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 1
	end;
	
	exec = function(self, player, number, effectres, params)
		local msg = player:getRoleName() .. ': ' .. Util:getString(params.netcmd, 'tmsg')
		app:getWorldBlessQueue():appendMsg(effectres.val, msg)
	end;
})


MoveCityUtil = Class:extends({
	isHerosStateCanMove = function(self, player)
		local heroMgr = player:getHeroMgr()
		for i=heroMgr:getHeroCount()-1, 0, -1 do
			local hero = heroMgr:getHeroByIdx(i)
			if hero:isExped() then
				WUtil:sendWarningMsgArgs(player, 100062, '')
				return false
			end
		end
		
		return true
	end;
	
	moveToPos = function(self, player, pos)
		RankMgrC:StartChangeRolePos(player:getRoleId())
	
		local srcGrid = app:getCityMgr():getGridByPos(player:getCityPos())
		local desGrid = app:getCityMgr():getGridByPos(pos)
		if srcGrid == nil or desGrid == nil then
			LOG('<error> 238dfj43r3223')
			return
		end
		
		app:getCityMgr():copyGrid(desGrid, srcGrid)
		
		app:getCityMgr():freeCityPos(player:getCityPos())
		
		player:setCityPos(pos)
		app:getCityMgr():resetPlayerGrid(player)
		player:refreshCityGrid()
		
		RankMgrC:EndChangeRolePos(player:getRoleId())
		
		self:_returnEnemyArmys(player)
		self:_returnAllianceArmys(player)
		
		RoleBaseSender:send(player, {'pos'})
		WUtil:sendSuccMsgArgs(player, 100063, pos.x..','..pos.y)		
	end;
	
	_returnEnemyArmys = function(self, player)
		local container = player:getArmyContainer()
		for i=container:getEnemyArmyCount()-1, 0, -1 do
			local armyId = container:getEnemyArmyId(i)
			self:_returnArmy(player, armyId)
		end
	end;
	
	_returnAllianceArmys = function(self, player)
		local container = player:getArmyContainer()
		for i=container:getAllianceArmyCount()-1, 0, -1 do
			local armyId = container:getAllianceArmyId(i)
			self:_returnArmy(player, armyId)
		end
	end;
	
	_returnArmy = function(self, player, armyId)
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then
			return
		end
		
		if army.state == ARMYDYN_STATE.RETURN then
			return
		end
		
		local stopTime = Util:getTime() + self:_getReturnNeedTime(army)
		app:getArmyMgr():changeArmy(army.armyId, ARMYDYN_STATE.RETURN, FIGHT_FLAG.UNFIGHT, stopTime)
		
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineSourcePlayer(army), army.armyId)
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineTargetPlayer(army), army.armyId)
	end;
	
	_getReturnNeedTime = function(self, army)
		if army.state == ARMYDYN_STATE.GOTO then
			return app:getArmyMgr():getArmyCallBackNeedTime(army.armyId)
		else
			return app:getArmyMgr():getArmyExpedNeedFullTime(army.armyId)
		end
	end;
})

MoveCityEffector = Effector:extends({
	init = function(self)
		self.moveCityUtil = MoveCityUtil:new()
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 1
	end;
	
	exec = function(self, player, number, effectres, params)
		local pos = self:_allocCityPos(player, params)
		self.moveCityUtil:moveToPos(player, pos)
	end;
	
	_allocCityPos = function(self, player, params)
	end;
})

SetPosMoveCityEffector = MoveCityEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:_isValidMovePos(player, params) then
			return false
		end
		
		if not self.moveCityUtil:isHerosStateCanMove(player) then
			return false
		end
		
		return true
	end;
	
	_isValidMovePos = function(self, player, params)
		local pos = {x=Util:getNumber(params.netcmd, 'tposX'), y=Util:getNumber(params.netcmd, 'tposY')}
		local cityResId = app:getCityMgr():getCityResIdByPos(pos)
		if cityResId ~= player:getCityId() then
			WUtil:sendWarningMsgArgs(player, 100061, '')
			return false
		end
		
		local grid = app:getCityMgr():getGridByPos(pos)
		return (grid ~= nil) and (grid.objType == OBJ_TYPE.NONE)
	end;	
	
	_allocCityPos = function(self, player, params)
		local pos = {x=Util:getNumber(params.netcmd, 'tposX'), y=Util:getNumber(params.netcmd, 'tposY')}
		return pos
	end;
})

RandMoveCityEffector = MoveCityEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not app:getCityMgr():hasFreeGrid(player:getCityId() ) then
			return false
		end
		
		if not self.moveCityUtil:isHerosStateCanMove(player) then
			return false
		end
		
		return true
	end;

	_allocCityPos = function(self, player, params)
		return app:getCityMgr():getFreeCityPos(player:getCityId())
	end;
})

AddCommResEffector = Effector:extends({
	init = function(self, commRess)
		self.commRess = commRess
	end;
	
	exec = function(self, player, number, effectres, params)
		self:_addVal(player, number, effectres)
		self:_sendMsg(player)
	end;
	
	_addVal = function(self, player, number, effectres)
		local addVal = number*effectres.val
		local cityRes = player:getCityRes()
		for _, resName in ipairs(self.commRess) do
			local addMethod = cityRes['add' .. resName]
			addMethod(cityRes, addVal)
		end
	end;
	
	_sendMsg = function(self, player)
		CommResSender:sendAll(player)
	end;
})

AddAvoidFightEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		local container = player:getStateContainer()
		if (not container:isCanAppend(effectres.id)) then 
			return false 
		end
		
		if (player:getState() == ROLE_STATE.YOUNG) then
			WUtil:sendWarningMsgArgs(player, 100100, '')
			return false
		end
		
		return true
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 1
	end;
	
	exec = function(self, player, number, effectres, params)
		local duration = effectres.val * number
		local stateContainer = player:getStateContainer()
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=effectres.val, effect={id=effectres.id,val=1,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		stateContainer:appendState(stateRes, creator)
	end;
})

TradingAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		return player:getTradingArea():getStopTime() > Util:getTime()
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return self:getNeedNumberInner(player:getTradingArea():getStopTime(), effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local tradingArea = player:getTradingArea()
		tradingArea:setStopTime( self:calcStopTime(tradingArea:getStopTime(), effectres, number) )
		tradingArea:start()
	end;
})

FullTradingAccUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = TradingAccEffector:new();
		self.accType = 'trading'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return player:getTradingArea():getStopTime() - Util:getTime()
	end;
})

DoingRoleTaskAccEffector = AccelerateEffector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if not self:isValidNumberAndEffectVal(number, effectres) then
			return false
		end
		
		return player:getTask():getDoingRoleTask():getStopTime() > Util:getTime()
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		local doingTask = player:getTask():getDoingRoleTask()
		return self:getNeedNumberInner(doingTask:getStopTime(), effectres, number)
	end;
	
	exec = function(self, player, number, effectres, params)
		if not self:isCanExec(player, number, effectres, params) then
			return
		end
		
		local doingTask = player:getTask():getDoingRoleTask()
		doingTask:setStopTime( self:calcStopTime(doingTask:getStopTime(), effectres, number) )
		doingTask:startDoing()
	end;
})

FullTaskAccUseGiftGoldEffector = FullAccUseGiftGoldEffector:extends({
	init = function(self)
		self.innerEffector = DoingRoleTaskAccEffector:new();
		self.accType = 'roletask'
	end;
	
	_getDurationTimeS = function(self, player, params)
		return player:getTask():getDoingRoleTask():getStopTime() - Util:getTime()
	end;
})


require('tqDropItemUtil')
DropItemEffectorBase = Effector:extends({
	init = function(self)
		self.dropItem = DropItem:new()
		self.drops = nil
		self.dropRawItems = nil
	end;
	
	isCanExec = function(self, player, number, effectres, params)
		local dropIds = self:_collectDropIds(effectres)
		self.drops = {}
		self.dropRawItems = {}
		for _, dropId in ipairs(dropIds) do
			for i=1, number, 1 do
				self.dropItem:handle(dropId)
				local drops = self.dropItem:getDrops()
				table.insert(self.drops, drops)
				
				local rawItems = self.dropItem:createRawItems(drops.items)
				for _, rawItem in ipairs(rawItems) do
					table.insert(self.dropRawItems, rawItem)
				end
			end
		end
		
		return self:_isCanAddItems(player)
	end;
	
	exec = function(self, player, number, effectres, params)
		self:_addItems(player)
		for _, drops in ipairs(self.drops) do
			self.dropItem:setDrops(drops)
			if params ~= nil and params.byItem == true then
				DropItemUtil:dropResForRoleByItem(player, self.dropItem)
			else
				DropItemUtil:dropResForRole(player, self.dropItem)
			end
		end
	end;
	
	_collectDropIds = function(self, effectres)
		local dropIds = {effectres.val}
		if effectres.val2 ~= nil and effectres.val2 > 0 then
			table.insert(dropIds, effectres.val2)
		end
		if effectres.val3 ~= nil and effectres.val3 > 0 then
			table.insert(dropIds, effectres.val3)
		end
		return dropIds
	end;
})

DropItemEffector = DropItemEffectorBase:extends({
	_isCanAddItems = function(self, player)
		if not player:getPkg():preAddItems(self.dropRawItems) then
			WUtil:sendWarningMsgArgs(player, 100129, '')
			return false
		end
		return true
	end;
	
	_addItems = function(self, player)
		player:getPkg():addItems(self.dropRawItems)
	end;
})

PassivityDropItemEffector = DropItemEffectorBase:extends({
	_isCanAddItems = function(self, player)
		return true
	end;
	
	_addItems = function(self, player)
		if player:getPkg():addItems( self.dropRawItems ) then
			return
		end
		
		local mail = app:getMailMgr():addSysMail(player:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, self.dropRawItems)
		MailSender:sendBriefMail(player, mail)
	end;
})

AddStateEffectEffector = Effector:extends({
	isCanExec = function(self, player, number, effectres, params)
		if number ~= 1 then return false end
		return player:getStateContainer():isCanAppend(self:_getEffectId())
	end;
	
	getNeedNumber = function(self, player, number, effectres, params)
		return 1
	end;
	
	exec = function(self, player, number, effectres, params)
		local stateContainer = player:getStateContainer()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=effectres.val2, effect={id=self:_getEffectId(),val=effectres.val,unit=1 }}
		local creator = {type=0,id=0,skillId=0}
		stateContainer:appendState(stateRes, creator)
	end;
})

AddBuildSpeedEffector = AddStateEffectEffector:extends({
	_getEffectId = function(self)
		return RES_EFF.ADD_BUILD_SPEED
	end;
})

AddCommResOutputEffector = AddStateEffectEffector:extends({
	_getEffectId = function(self)
		return RES_EFF.ADD_COMMRES_OUTPUT
	end;
})

AddCultureSpeedAndMoneyOutputEffector = AddStateEffectEffector:extends({
	_getEffectId = function(self)
		return RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT
	end;
})


EffectorMgr:regEffectors()



