--*******************************************************************************
Hero = Class:extends({
	init = function(self, player, hero)
		self.player = player
		self.hero = hero
		self.wearContainer = HeroWear(self.hero.stWears)
		self.heroSteel = HeroSteel(self.hero.stSteel)
	end;
	
	copy = function(self, otherHero)
	end;
	
	reset = function(self)
		self.wearContainer = HeroWear(self.hero.stWears)
		self.heroSteel = HeroSteel(self.hero.stSteel)	
	end;
	
	getPlayer = function(self)
		return self.player
	end;
	
	getWearContainer = function(self)
		return self.wearContainer
	end;
	
	getHeroSteel = function(self)
		return self.heroSteel
	end;
	
	getInner = function(self)
		return self.hero
	end;
	
	getAttrsCount = function(self)
		return self.hero.stAttrs.ucCount
	end;
	
	getAttr = function(self, attrid)
		local attr = Util:qfindC(self.hero.stAttrs.astAttrs, self.hero.stAttrs.ucCount, 'usAttr', attrid)
		if attr == nil then
			return attr
		end
		
		self:recalcAttrs(attr)
		return attr
	end;
	
	needPrecisionFormat = function(self, attrId)
		for _, needAttrId in ipairs(res_need_precision_attrs) do
			if needAttrId == attrId then return true end
		end
		return false
	end;
	
	recalcAttrs = function(self, attr)
		if attr.usAttr == ATTR.FC then
			attr.ulVal = HeroAttrHelper:getFCAttrVal(self)
		end
	end;
	
	getAttrRawVal = function(self, attrid)
		local attr = self:getAttr(attrid)
		if attr == nil then return 0 end
		return attr.ulVal
	end;
	
	setAttrRawVal = function(self, attrid, val)
		local oldHealthFactor = self:_getHealthFactor(attrid)
		local attr = self:getAttr(attrid)
		if attr == nil then return end
		attr.ulVal = val
		self:_recalcDynAttrsWhenHealthChange(attrid, oldHealthFactor)
	end;
	
	_getHealthFactor = function(self, attrid)
		if attrid ~= ATTR.HEALTH then
			return 0
		end
		local healthVal = self:getAttrVal(ATTR.HEALTH)
		local typ = res_gethealthtype(healthVal)
		return res_health_map_attrsfactors[typ]
	end;
	
	_recalcDynAttrsWhenHealthChange = function(self, attrid, oldHealthFactor)
		if attrid ~= ATTR.HEALTH then return end
		if floatEQ(self:_getHealthFactor(ATTR.HEALTH), oldHealthFactor) then return end
		HeroAttrHelper:recalcDynAttrs(self.player, self)
		HeroAttrSender:sendAttrsByIds(self.player, self, {ATTR.MIF, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.SFC, ATTR.FC})
	end;
	
	_recalcDynAttrsWhenInnerForceChange = function(self, attrid)
		if attrid ~= ATTR.IF then return end
		HeroAttrHelper:recalcDynAttrs(self.player, self)
		HeroAttrSender:sendAttrsByIds(self.player, self, {ATTR.HU, ATTR.DE})
	end;
	
	getAttrVal = function(self, attrid)
		local val = self:getAttrRawVal(attrid)
		if self:needPrecisionFormat(attrid) then
			return math.floor(val / ATTR_PRECISION)
		else
			return val
		end
	end;
	
	setAttrVal = function(self, attrid, val)
		local attr = self:getAttr(attrid)
		if attr == nil then return end
		
		local oldHealthFactor = self:_getHealthFactor(attrid)
		
		val = self:formatAttrVal(attrid, val)
		if self:needPrecisionFormat(attrid) then
			attr.ulVal = val * ATTR_PRECISION
		else
			attr.ulVal = val
		end
		
		self:_recalcDynAttrsWhenHealthChange(attrid, oldHealthFactor)
		self:_recalcDynAttrsWhenInnerForceChange(attrid)
	end;
	
	formatAttrVal = function(self, attrid, val)
		if (val < 0) then return 0 end
		
		local maxVal = 0xfffffffffff
		if attrid == ATTR.HEALTH then
			maxVal = self:getAttrVal(ATTR.MHEALTH)
		elseif attrid == ATTR.MO then
			maxVal = self:getAttrVal(ATTR.MMO)
		end
		
		if val > maxVal then
			val = maxVal
		end
		
		return val
	end;
	
	getRawAttrs = function(self)
		return self.hero.stAttrs
	end;
	
	getLevel = function(self)
		return self.hero.ucLevel
	end;
	
	getIcon = function(self)
		return self.hero.ulIcon
	end;

	getId = function(self)
		return self.hero.ullId
	end;
	
	getName = function(self)
		return self.hero.szName
	end;
	
	setName = function(self, name)
		self.hero.szName = name
	end;
	
	getSubjectsCount = function(self)
		return MAX_SUBJECT_CNT
	end;
	
	getSubject = function(self, idx)
		if (idx < 0) then return 0 end
		if (idx >= MAX_SUBJECT_CNT) then return 0 end
		return self.hero.aucSubjects[idx]
	end;
	
	addSubject = function(self, idx, val)
		if (idx < 0) then return end
		if (idx >= MAX_SUBJECT_CNT) then return end
		self.hero.aucSubjects[idx] = self.hero.aucSubjects[idx] + val
	end;
	
	isFree = function(self)
		return self.hero.ucState == HERO_STATE.FREE
	end;
	
	isSteeling = function(self)
		return self.hero.ucState == HERO_STATE.STEEL
	end;
	
	isDispatchField = function(self)
		return self.hero.ucState == HERO_STATE.DISPATCHFIELD
	end;
	
	isExped = function(self)
		return self.hero.ucState == HERO_STATE.EXPED
	end;
	
	getState = function(self)
		return self.hero.ucState
	end;
	
	setState = function(self, state)
		self.hero.ucState = state
	end;
	
	getProf = function(self)
		return self.hero.ucProf
	end;
	
	setProf = function(self, prof)
		self.hero.ucProf = prof
	end;
	
	getSkeletonLevel = function(self)
		return self.hero.ucSkeletonLevel
	end;
	
	setSkeletonLevel = function(self, level)
		if (level < 0) or (level > res_max_skeleton_level) then return end
		
		self.hero.ucSkeletonLevel = level
		self:setAttrVal( ATTR.MIF, HeroAttrHelper:getMaxIForce(level) )
		HeroAttrHelper:recalcDynAttrs(self.player, self)
	end;
	
	getSSteelStopTime = function(self)
		return self.hero.ulSSteelStopTime
	end;
	
	setSSteelStopTime = function(self, stoptime)
		self.hero.ulSSteelStopTime = stoptime
	end;
	
	getSex = function(self)
		return self.hero.ucSex
	end;
	
	getOfficial = function(self)
		return self.hero.ucOfficial
	end;
	
	setOfficial = function(self, official)
		self.hero.ucOfficial = official
		self:recalcCommandAttr()
		self:uncarrySoldierBeyondCommand()
	end;
	
	recalcCommandAttr = function(self)
		self:setAttrVal(ATTR.CO, HeroAttrHelper:getCommandVal({player=self.player, hero=self}))
	end;
	
	uncarrySoldierBeyondCommand = function(self)
		local beyondNumber = self:getSoldierNumber() - self:getAttrVal(ATTR.CO)
		if beyondNumber <= 0 then
			return
		end
		
		self.player:getSoldierMgr():addSoldier({resid=self:getSoldierResid(), number=beyondNumber})
		self:subSoldierNumber(beyondNumber)
		RoleSoldierSender:sendSoldier(self.player, self:getSoldierResid())
		HeroAttrSender:sendCarrySoldier(self.player, self)
	end;
	
	addSkill = function(self, skillres)
		local skills = self.hero.stSkills
		if skills.ucCount == MAX_HERO_SKILL_CNT then
			LOG('add skill overflow')
			return nil
		end
		
		local skill = skills.astSkills[skills.ucCount]
		skill.ulResId = skillres.resid
		skill.ucLevel = skillres.level
		if skillres.dex ~= nil then
			skill.ulDex = skillres.dex 
		end
		skills.ucCount = skills.ucCount + 1
		
		HeroAttrHelper:recalcDynAttrs(self.player, self)
		
		return skill
	end;
	
	getSkillCount = function(self)
		return self.hero.stSkills.ucCount
	end;
	
	getSkillByIdx = function(self, idx)
		return self.hero.stSkills.astSkills[idx]
	end;
	
	getSkillById = function(self, resid)
		local skills = self.hero.stSkills
		return Util:findC(skills.astSkills, skills.ucCount, 'ulResId', resid)
	end;
	
	getSkills = function(self)
		return self.hero.stSkills
	end;
	
	getSkillSteel = function(self)
		return self.hero.stSkillSteel
	end;
	
	hasSkill = function(self, resid)
		local skills = self.hero.stSkills
		local s = Util:findC(skills.astSkills, skills.ucCount, 'ulResId', resid)
		return s ~= nil 
	end;
	
	getLockState = function(self)
		return self.hero.ucLockState
	end;
	
	setLockState = function(self, state)
		self.hero.ucLockState = state
	end;
	
	isLocked = function(self)
		return self.hero.ucLockState == HERO_LOCKSTATE.LOCKED
	end;
	
	isUnLocking = function(self)
		return self.hero.ucLockState == HERO_LOCKSTATE.UNLOCKING
	end;
	
	isEmptyWears = function(self)
		return self.wearContainer:getCount() == 0
	end;
	
	getUnLockTime = function(self)
		return self.hero.ulUnlockTime
	end;
	
	setUnLockTime = function(self, unlockTime)
		self.hero.ulUnlockTime = unlockTime
	end;
	
	getSoldier = function(self)
		return self.hero.stSoldier
	end;
	
	setSoldierResid = function(self, resid)
		self.hero.stSoldier.resid = resid	
	end;
	
	getSoldierResid = function(self)
		return self.hero.stSoldier.resid
	end;
	
	setSoldierNumber = function(self, number)
		if (number < 0) then number = 0 end
		self.hero.stSoldier.number = number
		self:formatSoldierNumber()
		self:recalcRoleAFAttr()
		self:recalcHeroFCAttr()
	end;
	
	getSoldierNumber = function(self)
		return self.hero.stSoldier.number
	end;
	
	carrySoldier = function(self, soldier)
		if (soldier.number < 0) then 
			soldier.number = 0 
		end
		
		self:setSoldierResid(soldier.resid)
		self:setSoldierNumber(soldier.number)
	end;
	
	uncarrySoldier = function(self)
		self:setSoldierResid(0)
		self:setSoldierNumber(0)
	end;
	
	addSoldierNumber = function(self, number)
		if number <= 0 then
			return
		end
		
		self:setSoldierNumber(self.hero.stSoldier.number + number)
	end;

	subSoldierNumber = function(self, number)
		if number <= 0 then
			return
		end
		
		if self.hero.stSoldier.number > number then
			self:setSoldierNumber(self.hero.stSoldier.number - number)
		else
			self:setSoldierNumber(0)
		end
	end;
	
	formatSoldierNumber = function(self)
		local attrCommand = self:getAttrVal(ATTR.CO)
		self.hero.stSoldier.number =  math.clamp(self.hero.stSoldier.number, 0, attrCommand)
	end;
	
	recalcRoleAFAttr = function(self)
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.AF))
	end;
	
	recalcHeroFCAttr = function(self)
		HeroAttrSender:sendAttr(self.player, self, self:getAttr(ATTR.FC))
	end;
	
	addExp = function(self, player, expval)
		local lastLevel = self.hero.ucLevel
		local expattr = self:getAttr(ATTR.XP)
		expattr.ulVal = expattr.ulVal + expval
		while ( self:isCanUpgrade() ) do 
			self:upgradeLevel(player)
			HeroAttrHelper:resetAttrsByLevel(self.player, self)
		end
		
		if self:isArriveMaxLevel() then
			expattr.ulVal = 0
		end
		
		if lastLevel == self.hero.ucLevel then
			HeroAttrSender:sendAttr(player, self, expattr)
		else
			HeroAttrSender:sendDetailHero(player, self)
		end
	end;
	
	getMaxLevel = function(self)
		local sLevel = self:getSkeletonLevel()
		if sLevel == 0 then
			return res_base_max_hero_level
		else
			return res_herojingmai[sLevel].maxLevel
		end
	end;
	
	isArriveMaxLevel = function(self)
		return self:getLevel() >= self:getMaxLevel()
	end;
	
	isCanUpgrade = function(self)
		if self:isArriveMaxLevel() then
			return false
		end
		
		local expattr = self:getAttr(ATTR.XP)
		local nexpattr = self:getAttr(ATTR.NXP)
		if expattr.ulVal <  nexpattr.ulVal then return false end
		
		return true
	end;
	
	upgradeLevel = function(self, player)
		local expattr = self:getAttr(ATTR.XP)
		local nexpattr = self:getAttr(ATTR.NXP)
		
		self.hero.ucLevel = self.hero.ucLevel + 1
		expattr.ulVal = expattr.ulVal - nexpattr.ulVal
		
		self:onLevelChange(player)
	end;
	
	onLevelChange = function(self, player)
		if self.hero.ucLevel == res_hero_hasskill_minlevel then -- 随机领悟一个技能
			InsightHeroSkillHdr:handle(player, self)
		end
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.HERO_UPGRADE, self:getLevel())
	end;	
	
	addCredit = function(self, value)
		self:setAttrVal(ATTR.CRE, self:getAttrVal(ATTR.CRE) + value)
		HeroAttrSender:sendAttr(self.player, self, self:getAttr(ATTR.CRE))
	end;
	
	addInnerForce = function(self, value)
		local ifVal = self:getAttrVal(ATTR.IF) + value
		local ifVal = math.min(ifVal, self:getAttrVal(ATTR.MIF))
		self:setAttrVal(ATTR.IF, ifVal)
		HeroAttrSender:sendAttr(self.player, self, self:getAttr(ATTR.IF))
	end;
	
	addSkillDex = function(self, skill, dex)
		skill.ulDex = skill.ulDex + dex
		while ( self:isSkillCanUpgrade(skill) ) do 
			self:upgradeSkillLevel(skill)
		end
	end;	
	
	isSkillCanUpgrade = function(self, skill)
		if skill.ucLevel >= res_hero_baseskill_maxlevel then return false end
		local needdex = res_heroskills_upd[skill.ucLevel + 1].needdex
		if skill.ulDex < needdex then return false end

		return true
	end;
	
	upgradeSkillLevel = function(self, skill)
		local needdex = res_heroskills_upd[skill.ucLevel + 1].needdex
		skill.ulDex = skill.ulDex - needdex
		skill.ucLevel = skill.ucLevel + 1
		HeroAttrHelper:recalcDynAttrs(self.player, self)
	end;
	
	changeSkill = function(self)
		HeroAttrHelper:recalcDynAttrs(self.player, self)
	end;
	
	getCurTacticSkillId = function(self)
		return self.hero.ulCurTacticSkill
	end;
	
	setCurTacticSkillId = function(self, curtskill)
		self.hero.ulCurTacticSkill = curtskill
	end;
	
	getAdaptableFactor = function(self)
		if (self.hero.stSoldier.resid == 0) then return 0 end
		
		local baseResid, _ = ItemResUtil:splitResidLevel(self.hero.stSoldier.resid)
		local soldierInSubjectIdx = baseResid - FIXID.FIRSTSOLDIER
		local adaptableVal = self:getSubject(soldierInSubjectIdx)
		return res_get_subject_adaptablefactor(adaptableVal)
	end;
})


