require('tqClass')

HeroResHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = FirstGetHerosInfoHdr:new()
		self.handlers[1] = GetHeroDetailInfoHdr:new()
		self.handlers[2] = HeroChangeNameHdr:new()
		self.handlers[4] = AssignHeroPPHdr:new()
		self.handlers[6] = ClearHeroPPHdr:new()
		self.handlers[8] = FireHeroHdr:new()
		self.handlers[13] = RefreshNewHerosHdr:new()
		self.handlers[15] = RecruitHeroHdr:new()
		self.handlers[33] = LockHeroHdr:new()
		self.handlers[34] = UnLockHeroHdr:new()
		self.handlers[35] = TreatmentHeroHdr:new()
		self.handlers[36] = CongeHeroOfficialHdr:new()
		self.handlers[37] = ConferHeroOfficialHdr:new()
		self.handlers[39] = SteelHeroSkeletonHdr:new()
		self.handlers[40] = UseItemInsightHeroSkillHdr:new()
		self.handlers[41] = SkillSteelHeroHdr:new()
		self.handlers[43] = WearHeroTSkillHdr:new()
		self.handlers[44] = TreatmentHerosHdr:new()
		self.handlers[45] = UnWearHeroTSkillHdr:new()
		self.handlers[46] = WearHeroArmHdr:new()
		self.handlers[47] = UnWearHeroArmHdr:new()
		self.handlers[48] = StopHeroSteelHdr:new()
		self.handlers[49] = SteelHeroHdr:new()
		self.handlers[50] = UpgradeHeroNAttrHdr:new()
	end;
})

FirstGetHerosInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		HeroAttrSender:sendSimpleHeros(player)
		HeroAttrSender:sendCanUseSSTime(player)
	end;
})

GetHeroDetailInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local hero = player:getHeroMgr():getHeroById(Util:getNumber(cmdtb, 'id'))
		if hero == nil then 
			return false 
		end
		
		HeroAttrSender:sendDetailHero(player, hero)
	end;
})

HeroChangeNameHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return
		end
		
		if not self.expend:isEnough() then 
			return 
		end
		
		if not ValidChecker:isHeroName(self.name) then 
			local err = getLastErrorStr()
			WUtil:sendErrorMsg(self.player, err)
			return
		end
		
		self.expend:sub()
		self.hero:setName(self.name)
		HeroAttrSender:sendName(self.player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.heromgr = self.player:getHeroMgr()
		self.heroid = Util:getNumber(cmdtb, 'id')
		self.hero = self.heromgr:getHeroById(self.heroid)
		self.name = Util:getString(cmdtb, 'name')
		self.expend = GoldExpend(self.player, {attr=ATTR.GOLD,val=res_hero_changename_need_gold})
		return self.hero ~= nil and self.name ~= ''
	end;
})

AssignHeroPPHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self.hero:isFree() and not self.hero:isSteeling() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return
		end
		
		self:subPP()
		self:recalcAttrs()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.ASSIGN_HERO_ATTR)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		if hero == nil then return false end
		
		local p0 = Util:getNumber(cmdtb, 'p0')
		local p1 = Util:getNumber(cmdtb, 'p1')
		local p2 = Util:getNumber(cmdtb, 'p2')
		if (p0 < 0) or (p1 < 0) or (p2 < 0) then return false end
		if (p0 + p1 + p2) == 0 then return false end
		if (p0 + p1 + p2) > hero:getAttrVal(ATTR.PP) then return false end
		
		self.hero = hero
		self.pps = {p0, p1, p2}
		return true
	end;
	
	subPP = function(self)
		local leftpp = self.hero:getAttrVal(ATTR.PP) - (self.pps[1] + self.pps[2] + self.pps[3])
		self.hero:setAttrVal(ATTR.PP, leftpp)
	end;
	
	recalcAttrs = function(self)
		self.hero:setAttrVal(ATTR.ST_B, self.hero:getAttrVal(ATTR.ST_B) + self.pps[1] )
		self.hero:setAttrVal(ATTR.AG_B, self.hero:getAttrVal(ATTR.AG_B) + self.pps[2] )
		self.hero:setAttrVal(ATTR.PH_B, self.hero:getAttrVal(ATTR.PH_B) + self.pps[3] )
		HeroAttrHelper:recalcAttrs(self.player, self.hero)
	end;
})

ClearHeroPPHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(self.player, 100022, '')
			return
		end
		
		if not self:isNeedClear() then return end
		if not self:isEnoughItem() then return end
		self:subItems()
		self:recalcAttrs()
		HeroAttrSender:sendDetailHero(player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		self.hero = heromgr:getHeroById(heroid)
		if self.hero == nil then return false end
		
		self:initBasePP()
		return true;
	end;
	
	subItems = function(self)
		local pkg = self.player:getPkg()
		pkg:subItemByResId(FIXID.CLEARPP, self.neednum)
	end;
	
	recalcAttrs = function(self)
		local returnpp = self:getTotalPP() - self:getBasePP()
		self.hero:setAttrVal(ATTR.ST_B, self.basestval)
		self.hero:setAttrVal(ATTR.AG_B, self.baseagval)
		self.hero:setAttrVal(ATTR.PH_B, self.basephval)
		self.hero:setAttrVal(ATTR.PP, self.hero:getAttrVal(ATTR.PP) + returnpp)
		HeroAttrHelper:recalcAttrs(self.player, self.hero)
	end;
	
	isNeedClear = function(self)
		return self:getTotalPP() > self:getBasePP()
	end;
	
	isEnoughItem = function(self)
		self.neednum = res_getneed_hero_clearppitems(self.hero:getLevel())
		local itemnum = self.player:getPkg():getItemNumber(FIXID.CLEARPP)
		return self.neednum <= itemnum
	end;
	
	getTotalPP = function(self)
		return self.hero:getAttrVal(ATTR.ST_B) + self.hero:getAttrVal(ATTR.AG_B) + self.hero:getAttrVal(ATTR.PH_B)
	end;
	
	getBasePP = function(self)
		return self.basestval + self.baseagval + self.basephval
	end;
	
	initBasePP = function(self)
		local profbaseres = res_init_newheros['prof'..self.hero:getProf()]
		self.basestval = profbaseres[1].val
		self.baseagval = profbaseres[3].val
		self.basephval = profbaseres[5].val
		local curlevel = self.hero:getLevel()
		for level=2, curlevel, 1 do
			local syspp = res_get_hero_ppoint(level).sys;
			self.basestval = self.basestval + syspp/3;
			self.baseagval = self.baseagval + syspp/3;
			self.basephval = self.basephval + syspp/3;
		end
	end;
})

FireHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:isValidHeroState() then return end
		if not self.hero:isEmptyWears() then return end
		
		local soldier = self.hero:getSoldier()
		if soldier.number > 0 then
			local soldiermgr = self.player:getSoldierMgr()
			soldiermgr:addSoldier(soldier)
			self.hero:uncarrySoldier()
		end
		self.heromgr:destroyHero(self.hero:getId())
		HeroAttrSender:sendFireHero(self.player, self.heroid)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.heromgr = self.player:getHeroMgr()
		self.heroid = Util:getNumber(cmdtb, 'id')
		self.hero = self.heromgr:getHeroById(self.heroid)
		return self.hero ~= nil
	end;
	
	isValidHeroState = function(self)
		return self.hero:isFree() and not self.hero:isLocked() and not self.hero:isUnLocking()
	end;
})

RefreshNewHerosHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local useitem = Util:getNumber(cmdtb, 'useitem')
		if useitem == 0 then
			self:normalRefresh(player)
		else
			self:useitemRefresh(player)
		end
	end;
	
	normalRefresh = function(self, player)
		local heromgr = player:getHeroMgr()
		local newheros = heromgr:getNewHeros()
		local citys = player:getCitys()
		local tlevel = citys:getBuildLevelByResId(FIXID.TAVERNBUILD)
		local res = ItemResUtil:findBuildLevelres(FIXID.TAVERNBUILD, tlevel)
		if res == nil then return end
		if Util:getTime() >= (newheros:getNewHeroLastTime() + res.refreshtime) then
			newheros:refreshNewHeros()
		end
		NewHerosSender:sendAll(player)
	end;
	
	useitemRefresh = function(self, player)
		local useitemcmd = {id=0,resid=FIXID.REFRESHCARD,number=1,ttype=RES_TRG.SELF_NEWHEROS}
		local rt = UseItemHdr:handle(player, useitemcmd)
		if not rt then return end
		NewHerosSender:sendAll(player)
	end;
})

RecruitHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:isValidHeroId() then return end
		if self:isHerosCountFull() then return end
		
		local hero = self.heromgr:createHero(self.nhero)
		self.newheros:deleteHeroById(self.id)
		NewHerosSender:sendDelHero(self.player, self.id)
		HeroAttrSender:sendDetailHero(self.player, hero)
		
		TaskFinisher:checkTasks(player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.HERO_UPGRADE, hero:getLevel())
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.id = Util:getNumber(cmdtb, 'id')
		self.heromgr = self.player:getHeroMgr()
		self.newheros = self.heromgr:getNewHeros()
		return true
	end;
	
	isValidHeroId = function(self)
		self.nhero = self.newheros:getNewHeroById(self.id)
		return self.nhero ~= nil
	end;
	
	isHerosCountFull = function(self)
		return self.heromgr:getHeroCount() >= self.heromgr:getHeroMaxCount()
	end;
})

LockHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self.hero:isFree() and not self.hero:isSteeling() then return end
		if self.hero:isLocked() or self.hero:isUnLocking() then return end
		
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		HeroAttrSender:sendLockHero(self.player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.heromgr = self.player:getHeroMgr()
		self.heroid = Util:getNumber(cmdtb, 'id')
		self.hero = self.heromgr:getHeroById(self.heroid)
		return self.hero ~= nil
	end;
})

UnLockHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self.hero:isFree() and not self.hero:isSteeling() then return end
		if not self.hero:isLocked() then return end
		
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		self.hero:setUnLockTime(Util:getTime() + res_unlock_hero_time)
		HeroAttrSender:sendUnLockHero(self.player, self.hero)
		global.getTimer():start(res_unlock_hero_time*1000, {TIMER_EVT.HERO_UNLOCK_STOP, self.hero:getId()}, player:getTimerCaller())
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.heromgr = self.player:getHeroMgr()
		self.heroid = Util:getNumber(cmdtb, 'id')
		self.hero = self.heromgr:getHeroById(self.heroid)
		return self.hero ~= nil
	end;
})


TreatmentHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:isNeedTreat() then return end
		if not self:isEnoughItem() then return end
		
		local useitemcmd = {id=0,resid=FIXID.SALVE,number=self.neednum,ttype=RES_TRG.SELF_HERO,tid=self.hero:getId()}
		UseItemHdr:handle(player, useitemcmd)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		self.hero = heromgr:getHeroById(heroid)
		return self.hero ~= nil
	end;
	
	isNeedTreat = function(self)
		return self.hero:getAttrVal(ATTR.HEALTH) < self.hero:getAttrVal(ATTR.MHEALTH)
	end;
	
	isEnoughItem = function(self)
		local effect = ItemResUtil:findEffectres(FIXID.SALVE, RES_EFF.ADDHEROHEALTH);
		if (effect == null) then return false end
		
		local health = self.hero:getAttrVal(ATTR.HEALTH)
		local mhealth = self.hero:getAttrVal(ATTR.MHEALTH)
		local drt = mhealth - health;
		self.neednum = math.floor( (drt + effect.val - 1) / effect.val )
		local itemnum = self.player:getPkg():getItemNumber(FIXID.SALVE)
		return self.neednum <= itemnum
	end;
})

HeroOfficialHdr = Class:extends({
	hasOfficial = function(self)
		return self.hero:getOfficial() > 0
	end;	
})

CongeHeroOfficialHdr = HeroOfficialHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:hasOfficial() then return end
		if self:hasSoldier() then return end
		if not self.hero:isFree() then return end
		
		self.hero:setOfficial(self.official)
		HeroAttrSender:sendOfficial(self.player, self.hero)
		HeroAttrSender:sendAttr(self.player, self.hero, self.hero:getAttr(ATTR.CO) )
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		self.official = 0
		self.hero = heromgr:getHeroById(heroid)
		return self.hero ~= nil
	end;
	
	hasSoldier = function(self)
		return self.hero:getSoldier().number > 0 
	end;
})

ConferHeroOfficialHdr = HeroOfficialHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:getExpends() then return end
		if not self.hero:isFree() then return end
		if self:hasOfficial() then return end
		if self:isFullOfficials() then return end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		if not self:_hasEnoughCredit() then return false end
		
		WUtil:subExpends(self.expends)
		self.hero:setOfficial(self.official)
		HeroAttrSender:sendOfficial(self.player, self.hero)
		HeroAttrSender:sendAttr(self.player, self.hero, self.hero:getAttr(ATTR.CO) )
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CONFER_HERO_OFFICAL)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		if hero == nil then return false end
		
		local official = Util:getNumber(cmdtb, 'official')
		if official < 1 then return false end
		if official >  table.getn(res_heroofficials) then return false end
		
		local roleofficialres = self:getPlayerOfficialResByLevel()
		if roleofficialres == nil then return false end
		
		self.hero = hero
		self.official = official
		self.roleofficialres = roleofficialres
		return true
	end;
	
	getExpends = function(self)
		local res = res_heroofficials[self.official]
		
		local expendress = {}
		if res.needitem > 0 then
			table.insert(expendress, {resid=FIXID.TIGERCARD, type=EXPEND_TYPE.ITEM, val=res.needitem})
		end

		self.expends = WUtil:createExpendObjs(self.player, self.hero, expendress)

		return true
	end;
	
	isFullOfficials = function(self)
		return self:getPlayerHasCurOfficialCnt() >= self:getPlayerCanConferCurOfficialCnt()
	end;
	
	_hasEnoughCredit = function(self)
		local res = res_heroofficials[self.official]
		return self.hero:getAttrVal(ATTR.CRE)  >= res.needcredit
	end;
	
	getPlayerHasCurOfficialCnt = function(self)
		local cnt = 0
		local heromgr = self.player:getHeroMgr()
		local herocnt = heromgr:getHeroCount()
		for i=0, herocnt-1, 1 do
			local hero = heromgr:getHeroByIdx(i)
			if hero:getOfficial() == self.official then
				cnt = cnt + 1
			end
		end
		return cnt
	end;
	
	getPlayerCanConferCurOfficialCnt = function(self)
		return self.roleofficialres.nums[self.official]
	end;
	
	getPlayerOfficialResByLevel = function(self)
		local rolelevel = self.player:getLevel()
		local len = table.getn(res_roleofficials)
		for i=1, len, 1 do
			local r = res_roleofficials[i]
			if ( rolelevel <= r.level ) then 
				return r
			end
		end
		return nil
	end;
})

SteelHeroSkeletonHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(self.player, 100022, '')
			return
		end
		
		if not self:getExpends() then return end
		if self:isSteeling() then return end
		if not self:hasEnoughHeroLevel() then return end
		if not self:hasEnoughInnerForce() then return end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		
		WUtil:subExpends(self.expends)
		global.getTimer():start(self.nextres.needtime*1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller())
		
		self.hero:setSSteelStopTime(Util:getTime() + self.nextres.needtime)
		HeroAttrSender:sendSkeleton(self.player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		if hero == nil then return false end
		
		local nextres = self:getSteelNextRes(hero)
		if nextres == nil then return false end
		
		self.hero = hero
		self.nextres = nextres
		return true
	end;
	
	getExpends = function(self)
		local expendress = {}
		if self.nextres.needitem > 0 then
			table.insert(expendress, {resid=self.nextres.itemid, type=EXPEND_TYPE.ITEM, val=self.nextres.needitem})
		end
		
		if self.nextres.needmoney > 0 then
			table.insert(expendress, {attr=ATTR.MONEY, type=EXPEND_TYPE.MONEY, val=self.nextres.needmoney})
		end
		
		self.expends = WUtil:createExpendObjs(self.player, self.hero, expendress)
		
		return true
	end;
	
	isSteeling = function(self) 
		return self.hero:getSSteelStopTime() > 0
	end;
	
	hasEnoughHeroLevel = function(self)
		return self.hero:getLevel() >= self.nextres.prelevel
	end;
	
	hasEnoughInnerForce = function(self)
		return self.hero:getAttrVal(ATTR.IF) >= self.nextres.preif
	end;
	
	getSteelNextRes = function(self, hero)
		return res_herojingmai[ hero:getSkeletonLevel() + 1 ]
	end;
})

BaseInsightHeroSkillHdr = Class:extends({
	handle = function(self, player, hero)
		self.player = player
		self.hero = hero
		if self:getEmptyBaseSkillGridCnt() == self:getBaseSkillCnt() then return end
		
		local newskill = self:randomCreateSkill()
		self:sendMsg(newskill)
	end;	
	
	getEmptyBaseSkillGridCnt = function(self)
		return res_get_basegridcnt_by_herolevel( self.hero:getLevel() )
	end;
	
	getBaseSkillCnt = function(self)
		local basecnt = 0;
		local allcnt = self.hero:getSkillCount()
		for i=0, allcnt-1, 1 do
			local skill = self.hero:getSkillByIdx(i)
			if skill.ulResId >= res_hero_baseskill_id_first and skill.ulResId <= res_hero_baseskill_id_last then
				basecnt = basecnt + 1
			end
		end
		return basecnt;
	end;	
	
	randomCreateSkill = function(self)
		local skills = {}
		for id=res_hero_baseskill_id_first, res_hero_baseskill_id_last, 1 do
			if not self.hero:hasSkill(id) then
				table.insert(skills, id)
			end
		end
		
		local index = math.random( table.getn(skills) )
		local skillid = skills[index]
		if skillid == nil then return nil end
		
		local level = math.random( res_insight_skill_max_level)
		return self.hero:addSkill({resid=skillid, level=level})
	end;
	
	sendMsg = function(self, newskill)
		if newskill == nil then return end
		
		SkillMsgSender:sendSkill(self.player, self.hero, newskill)
		WUtil:sendSuccMsgArgs(self.player, 100010, '"@skillid'..newskill.ulResId..'",'..newskill.ucLevel)
	end;
})
InsightHeroSkillHdr = BaseInsightHeroSkillHdr:new()

UseItemInsightHeroSkillHdr = BaseInsightHeroSkillHdr:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return
		end
		
		if not self:getExpends() then 
			return 
		end
		
		if self:getEmptyBaseSkillGridCnt() == self:getBaseSkillCnt() then 
			return 
		end
		
		if not WUtil:isEnoughExpends(self.expends) then 
			return
		end
		
		WUtil:subExpends(self.expends)
		local newskill = self:randomCreateSkill()
		self:sendMsg(newskill)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.HERO_INSIGHT_SKILL)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		self.hero = heromgr:getHeroById(heroid)
		return self.hero ~= nil
	end;
	
	getExpends = function(self)
		local expendress = {{resid=FIXID.LINGWUDAN, type=EXPEND_TYPE.ITEM, val=1}}
		self.expends = WUtil:createExpendObjs(self.player, self.hero, expendress)
		return true
	end;	
})

SkillSteelHeroHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return
		end
		
		local heromgr = self.player:getHeroMgr()
		local leftsstime = heromgr:getCanUseSkillSteelTime() - self.stime 
		heromgr:setCanUseSkillSteelTime(leftsstime)
		
		global.getTimer():start(self.stime*3600*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, self.hero:getId(), self.skill.ulResId}, self.player:getTimerCaller())
		local skillsteel = self.hero:getSkillSteel()
		skillsteel.ulResId = self.skill.ulResId
		skillsteel.ulStoptime = Util:getTime() + self.stime*3600
		skillsteel.ulDurtime = self.stime

		HeroAttrSender:sendSkillSteel(self.player, self.hero)
		HeroAttrSender:sendCanUseSSTime(self.player)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.hero = self:getHero(cmdtb)
		if self.hero == nil then return false end
		
		self.skill = self:getSkill(cmdtb)
		if self.skill == nil then return false end
		
		self.stime = self:getSTime(cmdtb)
		if self.stime == nil then return false end
		
		return true
	end;

	getHero = function(self, cmdtb)
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		return hero
	end;
	
	getSkill = function(self, cmdtb)
		local skillid = Util:getNumber(cmdtb, 'skillid')
		if skillid < res_hero_baseskill_id_first then return nil end
		if skillid > res_hero_baseskill_id_last then return nil end
		
		local skill = self.hero:getSkillById(skillid)
		if skill == nil then return nil end
		if skill.ucLevel >= res_hero_baseskill_maxlevel  then return nil end
		
		return skill
	end;
	
	getSTime = function(self, cmdtb)
		local heromgr = self.player:getHeroMgr()
		local stime = Util:getNumber(cmdtb, 'stime')
		if stime <= 0 then return nil end
		if stime > res_canuse_sstime_maxnum then return nil end
		if stime > heromgr:getCanUseSkillSteelTime() then return nil end
		
		return stime
	end;
})

WearHeroTSkillHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(player, 100022, '')
			return
		end
		
		if not self:hasSkill() then 
			return 
		end
		
		if self:isWeared() then 
			return 
		end
		
		self.hero:setCurTacticSkillId(self.skillid)
		HeroAttrSender:sendCurTacticSkillId(self.player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.hero = self:getHero(cmdtb)
		if self.hero == nil then return false end
		
		self.skillid = self:getSkillId(cmdtb)
		if self.skillid == nil then return false end
		
		return true
	end;
	
	getHero = function(self, cmdtb)
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		return hero
	end;	
	
	getSkillId = function(self, cmdtb)
		local skillid = Util:getNumber(cmdtb, 'skillid')
		if skillid ~= 6001001 and skillid ~= 6001002 then return nil end
		
		return skillid
	end;	
	
	hasSkill = function(self)
		local skill = self.hero:getSkillById(self.skillid)
		return (skill ~= nil) and (skill.ucLevel > 0)  
	end;
	
	isWeared  = function(self)
		return self.hero:getCurTacticSkillId() == self.skillid
	end;
})

TreatmentHerosHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if not self:isEnoughItem() then return end

		self:useItems()
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		
		self.effect = ItemResUtil:findEffectres(FIXID.SALVE, RES_EFF.ADDHEROHEALTH);
		if (self.effect == null) then return false end

		local count = Util:getNumber(cmdtb, 'count')
		if count <= 0 then return false end
		
		self.heros = {}
		local heroMgr = self.player:getHeroMgr()
		for i=1, count, 1 do
			local heroId = Util:getNumber(cmdtb, 'id'..i)
			local hero = heroMgr:getHeroById(heroId)
			if (hero ~= nil) and (hero:getAttrVal(ATTR.HEALTH) < hero:getAttrVal(ATTR.MHEALTH)) then
				table.insert(self.heros, hero)
			end
		end
		
		return table.getn(self.heros) > 0
	end;
	
	isEnoughItem = function(self)
		local needNum = 0
		for _, hero in ipairs(self.heros) do
			needNum = needNum + self:getNeedItemNumber(hero)
		end
		
		local hasNum = self.player:getPkg():getItemNumber(FIXID.SALVE)
		return needNum <= hasNum
	end;
	
	useItems = function(self)
		for _, hero in ipairs(self.heros) do
			local needNum = self:getNeedItemNumber(hero)
			local useitemcmd = {id=0,resid=FIXID.SALVE,number=needNum,ttype=RES_TRG.SELF_HERO,tid=hero:getId()}
			UseItemHdr:handle(self.player, useitemcmd)
		end
	end;
	
	getNeedItemNumber = function(self, hero)
		local health = hero:getAttrVal(ATTR.HEALTH)
		local mhealth = hero:getAttrVal(ATTR.MHEALTH)
		local drt = mhealth - health;
		return math.floor( (drt + self.effect.val - 1) / self.effect.val )
	end;
})

UnWearHeroTSkillHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then 
			return 
		end
		
		if not self.hero:isFree() then
			WUtil:sendWarningMsgArgs(self.player, 100022, '')
			return false
		end
		
		if not self:isWeared() then 
			return 
		end
		
		self.hero:setCurTacticSkillId(0)
		HeroAttrSender:sendCurTacticSkillId(self.player, self.hero)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.hero = self:getHero(cmdtb)
		if self.hero == nil then return false end
		return true
	end;
	
	getHero = function(self, cmdtb)
		local heromgr = self.player:getHeroMgr()
		local heroid = Util:getNumber(cmdtb, 'id')
		local hero = heromgr:getHeroById(heroid)
		return hero
	end;	
	
	isWeared  = function(self)
		return self.hero:getCurTacticSkillId() > 0
	end;
})


WearHeroArmBaseOp = Class:extends({
	_getHero = function(self, cmdtb)
		local heroId = Util:getNumber(cmdtb, 'heroId')
		if heroId == 0 then
			LOG('weararm error: 100006')
			return false
		end
		
		local hero = self.player:getHeroMgr():getHeroById(heroId)
		if hero == nil then
			LOG('weararm error: 100007')
			return false
		end
		
		self.hero = hero
		return true
	end;
})

WearHeroArmHdr = WearHeroArmBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			LOG('weararm error: 00003')
			return false
		end

		if not self.hero:isFree() and not self.hero:isSteeling() then
			WUtil:sendWarningMsgArgs(self.player, 100018, '')
			LOG('weararm error: 00004')
			return false
		end
		
		if not self:_isFitLevel() then
			WUtil:sendWarningMsgArgs(self.player, 100019, '' .. self.itemRes.needlevel )
			LOG('weararm error: 00005')
			return false 
		end
		
		if self:_hasCoAttrInCurWear() then
			WUtil:sendWarningMsgArgs(self.player, 100020, '"@armpos' .. self.itemRes.apos .. '"' )
			LOG('weararm error: 00006')
			return false
		end
		
		local willWearItem = self:_allocTempItem()
		willWearItem:copyFrom(self.item)
		
		local playerPkg = self.player:getPkg()
		local itemId = self.item:getId()
		playerPkg:delItemById(itemId)
		ItemMsgSender:sendDelItem(self.player, itemId)
		
		local wearContainer = self.hero:getWearContainer()
		playerPkg:returnItems({ wearContainer:getArmByArmPos(self.itemRes.apos) })
		wearContainer:unWear(self.itemRes.apos)
		
		wearContainer:wear(self.itemRes.apos, willWearItem)
		self:_freeTempItem(willWearItem)
		
		HeroAttrSender:sendUnWear(self.player, self.hero, self.itemRes.apos)
		HeroAttrSender:sendWear(self.player, self.hero, self.itemRes.apos)
		
		HeroAttrHelper:recalcAttrs(self.player, self.hero, self.ids)
		
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.WEAR_HERO_ARM)
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		
		if not self:_getArm(cmdtb) then
			LOG('weararm error: 00001')
			return false
		end
		
		if not self:_getHero(cmdtb) then
			LOG('weararm error: 00002')
			return false
		end
		
		return true
	end;
	
	_getArm = function(self, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'itemId')
		if itemId == 0 then
			LOG('weararm error: 100001')
			return false
		end
		
		item = self.player:getPkg():getItemById(itemId)
		if item == nil then
			LOG('weararm error: 100002')
			return false
		end
		
		local itemRes = ItemResUtil:findItemres(item:getResId())
		if itemRes.apos == nil then
			LOG('weararm error: 100003, resid:' .. item:getResId())
			return false
		end
		
		if itemRes.apos == 0 then
			LOG('weararm error: 100004')
			return false
		end
		
		local hasHeroTarget = Util:find(itemRes.targets, nil, RES_TRG.SELF_HERO)
		if not hasHeroTarget then
			LOG('weararm error: 100005')
			return false
		end
		
		self.item = item
		self.itemRes = itemRes
		return true
	end;
	
	_isFitLevel = function(self)
		return self.itemRes.needlevel <= self.hero:getLevel()
	end;
	
	_hasCoAttrInCurWear = function(self)
		local wearArm = self.hero:getWearContainer():getWearArmByArmPos(self.itemRes.apos)
		if wearArm == nil then
			return false
		end
		
		return wearArm:getArm():hasAttr(ATTR.CO) or GemUtil:hasAttr(wearArm:getArm(), ATTR.CO)
	end;
	
	_allocTempItem = function(self)
		local tmpInnerItem = CppPlayerVar:allocVar('SItem')
		local willWearItem = CppTempItemEx(tmpInnerItem.var)
		willWearItem:setCppVarHdr(tmpInnerItem.hdr)
		return willWearItem
	end;
	
	_freeTempItem = function(self, cppTempItem)
		CppPlayerVar:freeVar( cppTempItem:getCppVarHdr() )
	end;	
})

UnWearHeroArmHdr = WearHeroArmBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		if not self.hero:isFree() and not self.hero:isSteeling() then
			WUtil:sendWarningMsgArgs(self.player, 100018, '')
			return false
		end
		
		if not self.player:getPkg():returnItems( {self.wearArm:getArm()} ) then
			WUtil:sendWarningMsgArgs(self.player, 100021, '')
			return false 
		end
		
		self.hero:getWearContainer():unWear(self.armPos)
		HeroAttrSender:sendUnWear(self.player, self.hero, self.armPos)
		
		HeroAttrHelper:recalcAttrs(self.player, self.hero, self.ids)
		
		self.hero:uncarrySoldierBeyondCommand()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		if not self:_getHero(cmdtb) then
			return false
		end
		
		if not self:_getWearArm(cmdtb) then
			return false
		end
		
		return true
	end;
	
	_getWearArm = function(self, cmdtb)
		local armPos = Util:getNumber(cmdtb, 'armPos')
		local wearArm = self.hero:getWearContainer():getWearArmByArmPos(armPos)
		if wearArm == nil then
			return false
		end
		
		self.armPos = armPos
		self.wearArm = wearArm
		return true
	end;
})

StopHeroSteelHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		for _, hero in ipairs(self.heros) do
			self:_handleOneHero(hero)
		end
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self:_clearLastHeros()
		
		local heroId = Util:getNumber(cmdtb, 'heroId')
		if heroId == -1 then
			self:_collectAllSteelingHeros()
		else
			self:_collectCurSteelingHero(heroId)
		end
		
		return self:_getHerosCount() > 0
	end;
	
	_clearLastHeros = function(self)
		self.heros = {}
	end;
	
	_collectAllSteelingHeros = function(self)
		local heroMgr = self.player:getHeroMgr()
		for i=0, heroMgr:getHeroCount()-1, 1 do
			local hero = heroMgr:getHeroByIdx(i)
			if hero ~= nil and hero:isSteeling() then
				table.insert(self.heros, hero)
			end
		end
	end;
	
	_collectCurSteelingHero = function(self, heroId)
		local hero = self.player:getHeroMgr():getHeroById(heroId)
		if hero ~= nil and hero:isSteeling() then
			table.insert(self.heros, hero)
		end
	end;
	
	_getHerosCount = function(self)
		return table.getn(self.heros)
	end;
	
	_handleOneHero = function(self, hero)
		self:_initGetRes(hero)
		self:_cancelSteelState(hero)
		
		hero:addExp(self.player, self.exp)
		self.player:getPkg():addGold(self.returnGold)
		self.player:getCityRes():addMoney(self.returnMoney)
		
		self:_sendMsg(hero)
	end;
	
	_initGetRes = function(self, hero)
		local heroSteel = hero:getHeroSteel()
		self.exp = heroSteel:getSteeledExp()
		self.returnMoney = heroSteel:getReturnMoney()
		self.returnGold = heroSteel:getReturnGold()
	end;
	
	_cancelSteelState = function(self, hero)
		hero:setState(HERO_STATE.FREE)
		hero:getHeroSteel():setStartTime(0)
	end;

	_sendMsg = function(self, hero)
		HeroAttrSender:sendDetailHero(self.player, hero)
		PkgMiscSender:send(self.player, {'gold'})
	end;
})

BaseSteelHeroHdr = Class:extends({
	setParam = function(self, param)
		self.param = param
		self.steelRes = res_herosteel[param.hero:getLevel()]
	end;
	
	getQuarterMoney = function(self)
		return 0
	end;
	
	getHourGold = function(self)
		return 0
	end;
	
	getSteelNeedGold = function(self)
		return math.floor(self:getHourGold()/4*self.param.steelQuarters)
	end;
	
	getSteelNeedMoney = function(self)
		return self.steelRes.expendMoney*self.param.steelQuarters
	end;
})

CommSteelHeroHdr = BaseSteelHeroHdr:extends({
	getQuarterRes = function(self)
		return self.steelRes.commGetExp
	end;
	
	getQuarterMoney = function(self)
		return self.steelRes.expendMoney
	end;
	
	getMaxSteelQuarters = function(self)
		return res_comm_herosteel_max_hours*4
	end;
	
	isArriveSteelMaxLevel = function(self, maxSteelLevel)
		return self.param.hero:getLevel() >= maxSteelLevel
	end;
	
	isValidEfficientType = function(self)
		return true
	end;
})

HighSteelHeroHdr = BaseSteelHeroHdr:extends({
	getQuarterRes = function(self)
		return self.steelRes.highGetExp
	end;
	
	getHourGold = function(self)
		return 2
	end;
	
	getMaxSteelQuarters = function(self)
		return res_high_herosteel_max_hours*4
	end;
	
	isArriveSteelMaxLevel = function(self, maxSteelLevel)
		return false
	end;
	
	isValidEfficientType = function(self)
		return true
	end;
})

Vip1SteelHeroHdr = HighSteelHeroHdr:extends({
	getQuarterRes = function(self)
		return self.steelRes.high1GetExp
	end;
	
	getHourGold = function(self)
		return 5
	end;
})

Vip2SteelHeroHdr = HighSteelHeroHdr:extends({
	getQuarterRes = function(self)
		return self.steelRes.high2GetExp
	end;
	
	getHourGold = function(self)
		return 10
	end;
})

SpeedSteelHeroHdr = BaseSteelHeroHdr:extends({
	init = function(self, steelObj, needGold)
		self._steelObj = steelObj
		self._needGold = needGold
	end;
	
	setParam = function(self, param)
		self.param = param
		self._steelObj:setParam(param)
	end;
	
	getQuarterRes = function(self)
		return 2*self._steelObj:getQuarterRes()
	end;
	
	getHourGold = function(self)
		return self._steelObj:getHourGold() + self._needGold
	end;
	
	getSteelNeedMoney = function(self)
		return self._steelObj:getSteelNeedMoney()
	end;	
	
	getMaxSteelQuarters = function(self)
		return self._steelObj:getMaxSteelQuarters()
	end;
	
	isArriveSteelMaxLevel = function(self, maxSteelLevel)
		return self._steelObj:isArriveSteelMaxLevel(maxSteelLevel)
	end;
	
	isValidEfficientType = function(self)
		return self.param.hero:getLevel() <= res_hero_lowsteel_level
	end;
})

DefaultSteelHeroHdr = BaseSteelHeroHdr:extends({
	isValidEfficientType = function(self)
		return false
	end
})

SteelHeroHdr = Class:extends({
	init = function(self)
		self.hdrs = {}
		self.hdrs[10000] = DefaultSteelHeroHdr()
		self.hdrs[HSTEEL_TYPE.COMM] = CommSteelHeroHdr()
		self.hdrs[HSTEEL_TYPE.HIGH] = HighSteelHeroHdr()
		self.hdrs[HSTEEL_TYPE.VIP1] = Vip1SteelHeroHdr()
		self.hdrs[HSTEEL_TYPE.VIP2] = Vip2SteelHeroHdr()
		self.hdrs[HSTEEL_EFF_TYPE.SPEED*100 + HSTEEL_TYPE.HIGH] = SpeedSteelHeroHdr(HighSteelHeroHdr(), 3)
		self.hdrs[HSTEEL_EFF_TYPE.SPEED*100 + HSTEEL_TYPE.VIP1] = SpeedSteelHeroHdr(Vip1SteelHeroHdr(), 6)
		self.hdrs[HSTEEL_EFF_TYPE.SPEED*100 + HSTEEL_TYPE.VIP2] = SpeedSteelHeroHdr(Vip2SteelHeroHdr(), 12)
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		for _, param in ipairs(self.params) do
			self:_handleOneHero(param)
		end
		
		self:_subExpends()
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.STEEL_HERO )
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		if not self:_initHeroSteelMaxLevel(player) then
			return false
		end
		
		if not self:_initSteelType(cmdtb) then
			return false
		end
		
		if not self:_collectHeros(player, cmdtb) then
			return false
		end
		
		if not self:_isAllHerosFreeState() then
			return false
		end
		
		if self:_hasHerosArriveMaxLevel() then
			return false
		end
		
		if self:_hasHerosArriveBuildMaxLevel() then
			return false
		end
		
		if not self:_isValidSteelQuarters() then
			return false
		end
		
		if not self:_isValidEfficientTypes() then
			return false
		end
		
		if not self:_hasEnoughMoney(player) then
			return false
		end
		
		if not self:_hasEnoughGold(player) then
			return false
		end
		
		self.player = player
		
		return true
	end;
	
	_initHeroSteelMaxLevel = function(self, player)
		local level = player:getCitys():getBuildLevelByResId(FIXID.STEEL_BUILD)
		local res = ItemResUtil:findBuildLevelres(FIXID.STEEL_BUILD, level)
		if res == nil then
			return false
		end
		
		self.heroSteelMaxLevel = res.herosteelmaxlevel
		return true
	end;
	
	_initSteelType = function(self, cmdtb)
		self.steelType = Util:getNumber(cmdtb, 'steelType')
		return self.steelType >= HSTEEL_TYPE.FIRST and self.steelType <= HSTEEL_TYPE.LAST
	end;
	
	_collectHeros = function(self, player, cmdtb)
		self.params = {}
		self.heroCount = Util:getNumber(cmdtb, 'count')
		for i=1, self.heroCount, 1 do
			local heroId = Util:getNumber(cmdtb, 'hid' .. i)
			local hero = player:getHeroMgr():getHeroById(heroId)
			if hero == nil then
				return false
			end
			
			local steelQuarters = Util:getNumber(cmdtb, 'sq' .. i)
			local effType = Util:getNumber(cmdtb, 'eff' .. i)
			table.insert(self.params, {hero=hero, steelQuarters=steelQuarters, effType=effType})
		end
		
		return table.getn(self.params) > 0
	end;
	
	_isAllHerosFreeState = function(self)
		for _, param in ipairs(self.params) do
			if not param.hero:isFree() then
				return false
			end
		end
		return true
	end;
	
	_hasHerosArriveMaxLevel = function(self)
		for _, param in ipairs(self.params) do
			if param.hero:getLevel() >= param.hero:getMaxLevel() then
				return true
			end
		end
		return false
	end;
	
	_hasHerosArriveBuildMaxLevel = function(self)
		for _, param in ipairs(self.params) do
			if self:_getHdr(param):isArriveSteelMaxLevel(self.heroSteelMaxLevel) then
				return true
			end
		end
		return false
	end;
	
	_isValidSteelQuarters = function(self)
		local maxSteelQuarters = self:_getMaxSteelQuarters()
		for _, param in ipairs(self.params) do
			if (param.steelQuarters <= 0) or (param.steelQuarters > maxSteelQuarters) then
				return false
			end
		end
		return true
	end;
	
	_getMaxSteelQuarters = function(self)
		return self:_getHdr(self.params[1]):getMaxSteelQuarters()
	end;
	
	_isValidEfficientTypes = function(self)
		for _, param in ipairs(self.params) do
			if not self:_getHdr(param):isValidEfficientType() then
				return false
			end
		end
		return true
	end;
	
	_hasEnoughMoney = function(self, player)
		return player:getCityRes():getMoney() >= self:_getNeedMoney(player)
	end;
	
	_getNeedMoney = function(self, player)
		local needMoney = 0
		for _, param in ipairs(self.params) do
			needMoney = needMoney + self:_getHdr(param):getSteelNeedMoney()
		end
		return needMoney
	end;
	
	_hasEnoughGold = function(self, player)
		return player:getPkg():getGold() >= self:_getNeedGold(player)
	end;
	
	_getNeedGold = function(self, player)
		local needGold = 0
		for _, param in ipairs(self.params) do
			needGold = needGold + self:_getHdr(param):getSteelNeedGold()
		end
		return needGold
	end;
	
	_handleOneHero = function(self, param)
		param.hero:setState(HERO_STATE.STEEL)
		
		local heroSteel = param.hero:getHeroSteel()
		heroSteel:setStartTime(Util:getTime())
		heroSteel:setSteelType(self.steelType)
		heroSteel:setSteelQuarters(param.steelQuarters)
		
		local hdr = self:_getHdr(param)
		heroSteel:setQuarterRes( hdr:getQuarterRes() )
		heroSteel:setQuarterMoney( hdr:getQuarterMoney() )
		heroSteel:setHourGold( hdr:getHourGold() )
		
		local s2 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_2)
		local s3 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_3)
		local svrActMult = math.max(1, s2 + s3 )
		heroSteel:setActMult(svrActMult)
		
		local needTime = param.steelQuarters*900
		global.getTimer():start(needTime*1000, {TIMER_EVT.HERO_STEEL_STOP, param.hero:getId(), heroSteel:getStartTime(), self.steelType}, self.player:getTimerCaller())
		
		HeroAttrSender:sendHerosState(self.player, {param.hero})
		HeroAttrSender:sendHeroSteel(self.player, param.hero)
	end;
	
	_getHdr = function(self, param)
		local key = param.effType*100 + self.steelType
		local hdr = self.hdrs[key]
		if hdr == nil then
			hdr = self.hdrs[10000]
		end
		hdr:setParam(param)
		return hdr
	end;
	
	_subExpends = function(self)
		local expendress = {{attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=self:_getNeedMoney()}
			,{attr=ATTR.GOLD, type=EXPEND_TYPE.GOLD ,val=self:_getNeedGold()}}
		local expends = WUtil:createExpendObjs(self.player, nil, expendress)
		WUtil:subExpends(expends)
	end;
})

HeroNAttrCalc = Class:extends({
	calcFactor = function(self, hero)
		local prof = hero:getProf()
		local nattrs = {};
		nattrs[ATTR.AG_B] = ATTR.NAG
		nattrs[ATTR.PH_B] = ATTR.NPH
		nattrs[ATTR.ST_B] = ATTR.NST

		local resattrs = res_hero_main_sec_last_attrs['prof'..prof].attrs;
		local mainNAttr = nattrs[resattrs[1]];
		local secNAttr = nattrs[resattrs[2]];
		local lastNAttr = nattrs[resattrs[3]];

		local mainFactor = self:_getLevel( prof, mainNAttr, hero:getAttrVal(mainNAttr) )
		local secFactor = self:_getLevel( prof, secNAttr, hero:getAttrVal(secNAttr) )
		local lastFactor = self:_getLevel( prof, lastNAttr, hero:getAttrVal(lastNAttr) )
	
		local factor = 0
		if prof == HERO_PROF.YONGSHI then
			factor = 1.1*mainFactor + 1.1*secFactor + 1.1*lastFactor;
		else
			factor = 1.2*mainFactor + 1.1*secFactor + 1.0*lastFactor;
		end
		return factor
	end;
	
	calcLevelRange = function(self, hero, attrId, level)
		local maxLevel = 5
		local resattrs = res_heronature_max_attrs[hero:getProf()]
		return {min = res_heronature_min_attrval + (resattrs[attrId]-res_heronature_min_attrval)/maxLevel*(level-1), max=resattrs[attrId]}
	end;
	
	_getLevel = function(self, prof, attr, val)
		local maxLevel = 5
		local maxVal = res_heronature_max_attrs[prof][attr];
		if val > maxVal then
			maxLevel = 6
		end
		local perLevelVal = (maxVal - res_heronature_min_attrval)/maxLevel;
		local curLevel = math.floor((val - res_heronature_min_attrval)/perLevelVal) + 1;
		return math.min(curLevel, maxLevel)
	end;
}):new()

UpgradeHeroNAttrHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local heroId = Util:getNumber(cmdtb, 'heroId')
		local hero = player:getHeroMgr():getHeroById(heroId)
		if hero == nil then 
			return false
		end
		
		local expendRess = {{resid=FIXID.HERO_NATTR_DAN, type=EXPEND_TYPE.ITEM,val=1}}
		local expends = WUtil:createExpendObjs(player, nil, expendRess)
		if not WUtil:isEnoughExpends(expends) then
			local hasItemNum = player:getPkg():getItemNumber(FIXID.HERO_NATTR_DAN)
			WUtil:sendPopBoxMsgArgs(player, 100066, '"@itemid' .. FIXID.HERO_NATTR_DAN .. '",' .. 1 .. ',' .. hasItemNum .. ',' .. FIXID.HERO_NATTR_DAN )
			return false
		end
		
		if HeroNAttrCalc:calcFactor(hero) >= 16.49999 then
			local attrIds = {ATTR.NAG, ATTR.NPH, ATTR.NST}
			for _, attrId in ipairs(attrIds) do
				local range = HeroNAttrCalc:calcLevelRange(hero, attrId, 5)
				local attrVal = math.random(range.min, range.max+15)
				hero:setAttrVal(attrId, attrVal)
			end
		else
			local attrs = {}
			local attrIds = {ATTR.NAG, ATTR.NPH, ATTR.NST}
			for i=1, 3 do
				local idx = math.random(1, 3-i+1)
				table.insert(attrs, attrIds[idx])
				table.remove(attrIds, idx)
			end
			
			for _, attrId in ipairs(attrs) do
				local attrVal = hero:getAttrVal(attrId)
				local range = HeroNAttrCalc:calcLevelRange(hero, attrId, 5)
				if attrVal+3 <= range.max then
					hero:setAttrVal(attrId, attrVal+3)
					break
				end
			end
		end
		
		HeroAttrHelper:recalcDynAttrs(player, hero)
		HeroAttrSender:sendAttrsByIds(player, hero, {ATTR.MIF, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.NAG, ATTR.NPH, ATTR.NST, ATTR.SFC, ATTR.FC})
		
		WUtil:subExpends(expends)
		
		Service:getOpenSvrAct():recordWhenHasFiveHighHero(player)
		
		return true
	end;
})

