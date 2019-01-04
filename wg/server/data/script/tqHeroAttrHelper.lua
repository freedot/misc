--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
HeroAttrHelper = Class:extends({
	init = function(self)
		self.needSendIds = {ATTR.PP,ATTR.PH_B, ATTR.ST_B, ATTR.AG_B,ATTR.PH_A, ATTR.ST_A, ATTR.AG_A, ATTR.HI, ATTR.HU, ATTR.DE,
		ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.SFC, ATTR.FC, ATTR.CO, ATTR.SP,
		ATTR.JIN_SKILL_LEVEL,ATTR.MU_SKILL_LEVEL,ATTR.SHUI_SKILL_LEVEL,
		ATTR.HUO_SKILL_LEVEL,ATTR.TU_SKILL_LEVEL}
		self.healthFactor_ = 1
	end;
	
	initAttrs = function(self, hero)
		self:initSubjects(hero)
		local level = hero:getLevel()
		local resattrs = {
			{attr=ATTR.XP, unit=0, val=0}, -- 当前经验
			{attr=ATTR.NXP, unit=0, val=self:getNeedExp(level+1)}, -- 下级需要的经验
			{attr=ATTR.PP, unit=0, val=0 }, -- 可分配潜力点
			{attr=ATTR.SP, unit=0, val=res_hero_base_move_speed}, -- 移动速度
			{attr=ATTR.IF, unit=0, val=0}, -- 当前内功
			{attr=ATTR.MIF, unit=0, val=HeroAttrHelper:getMaxIForce(hero:getSkeletonLevel()) }, -- 内功上限
			{attr=ATTR.CRE, unit=0, val=0}, --武勋为单挑战获得，无上限，封官用
			{attr=ATTR.CO, unit=0, val=0 }, -- 统率
			{attr=ATTR.HI, unit=0, val=0 }, -- 命中
			{attr=ATTR.HU, unit=0, val=0 }, -- 攻击
			{attr=ATTR.DE, unit=0, val=0}, -- 防御
			{attr=ATTR.ES, unit=0, val=0}, -- 闪避
			{attr=ATTR.BER, unit=VAL_UNIT.PER, val=0}, -- 会心
			{attr=ATTR.PS, unit=0, val=0}, -- 当前体力 
			{attr=ATTR.MPS, unit=0, val=0 }, -- 最大体力
			{attr=ATTR.SFC, unit=0, val=0}, -- 单挑力
			
			{attr=ATTR.HEALTH, val=100*ATTR_PRECISION, unit=0}, --当前健康 一个小时两点（每个）
			{attr=ATTR.MHEALTH, val=100, unit=0}, --健康上限
			{attr=ATTR.MO, unit=0, val=100*ATTR_PRECISION}, -- 当前士气（定时器）
			{attr=ATTR.MMO, unit=0, val=150}, -- 士气最大值		
			
			{attr=ATTR.AN, unit=0, val=0}, --当前怒气值
			{attr=ATTR.MAN, unit=0, val=100}, --怒气最大值
			
			{attr=ATTR.FC, unit=0, val=0}, -- 战力
			
			{attr=ATTR.JIN_SKILL_LEVEL, unit=0, val=0}, -- 金系技能等级
			{attr=ATTR.MU_SKILL_LEVEL, unit=0, val=0}, -- 木系技能等级
			{attr=ATTR.SHUI_SKILL_LEVEL, unit=0, val=0}, -- 水系技能等级
			{attr=ATTR.HUO_SKILL_LEVEL, unit=0, val=0}, -- 火系技能等级
			{attr=ATTR.TU_SKILL_LEVEL, unit=0, val=0}, -- 土系技能等级
		}

		local innerhero = hero:getInner()
		local startpos = innerhero.stAttrs.ucCount
		for i, resattr in ipairs(resattrs) do
			local attr = innerhero.stAttrs.astAttrs[startpos + i - 1]
			attr.usAttr = resattr.attr
			attr.ulVal = resattr.val
			attr.ucUnit = resattr.unit
		end
		
		innerhero.stAttrs.ucCount = innerhero.stAttrs.ucCount + table.getn(resattrs)
		SortAttrs(innerhero.stAttrs.astAttrs[0], innerhero.stAttrs.ucCount)
		assert( innerhero.stAttrs.ucCount <=  MAX_HEROATTRS_CNT )
	end;
	
	resetAttrsByLevel = function(self, player, hero)
		self:recalcBaseAttrsByLevel(hero)
		self:recalcDynAttrs(player, hero)
	end;
	
	recalcBaseAttrsByLevel = function(self, hero)
		local level = hero:getLevel()
		local syspp = res_get_hero_ppoint( level ).sys
		local freepp = res_get_hero_ppoint( level ).free
		local resattrs = {
			{attr=ATTR.PH_B, addval=syspp/3},
			{attr=ATTR.ST_B, addval=syspp/3},
			{attr=ATTR.AG_B, addval=syspp/3},
			{attr=ATTR.PP, addval=freepp}, -- 可分配潜力点
			{attr=ATTR.NXP, setval=self:getNeedExp(level+1)}, -- 下级需要的经验
			{attr=ATTR.HEALTH, setval=100*ATTR_PRECISION}, --当前健康 
		}
		self:innerCalcAttrs(hero, resattrs)
	end;
	
	recalcAttrs = function(self, player, hero)
		self:recalcBaseAttrs(player, hero)
		self:recalcDynAttrs(player, hero)
		HeroAttrSender:sendAttrsByIds(player, hero, self.needSendIds)
	end;
	
	recalcBaseAttrs = function(self, player, hero)
		self:_clearBaseAppendAttrs(hero)
		self:_appendBaseAppendAttrsByRoleAttr(player, hero)
		self:_appendBaseAppendAttrsByWears(hero)
	end;
	
	_clearBaseAppendAttrs = function(self, hero)
		local resAttrs = {
			{attr=ATTR.PH_A, setval=0},
			{attr=ATTR.ST_A, setval=0},
			{attr=ATTR.AG_A, setval=0},
		}
		self:innerCalcAttrs(hero, resAttrs)	
	end;
	
	_appendBaseAppendAttrsByRoleAttr = function(self, player, hero)
		local role_force = player:getAttrVal(ATTR.FOR_B) + player:getAttrVal(ATTR.FOR_A)
		local hero_ph_b = hero:getAttrVal(ATTR.PH_B)
		local hero_st_b = hero:getAttrVal(ATTR.ST_B)
		local hero_ag_b = hero:getAttrVal(ATTR.AG_B)
		local resAttrs = {
			{attr=ATTR.PH_A, addval=math.floor(hero_ph_b*role_force/100) },
			{attr=ATTR.ST_A, addval=math.floor(hero_st_b*role_force/100)},
			{attr=ATTR.AG_A, addval=math.floor(hero_ag_b*role_force/100)},
		}
		self:innerCalcAttrs(hero, resAttrs)
	end;
	
	_appendBaseAppendAttrsByWears = function(self, hero)
		local resAttrs = {
			{attr=ATTR.PH_A, addval=0, baseAttr=ATTR.PH_B },
			{attr=ATTR.ST_A, addval=0, baseAttr=ATTR.ST_B },
			{attr=ATTR.AG_A, addval=0, baseAttr=ATTR.AG_B },
		}
		
		local wearContainer = hero:getWearContainer()
		for wearArmIdx=1, wearContainer:getCount(), 1 do
			local arm = wearContainer:getWearArmByIdx(wearArmIdx):getArm()
			self:appendAttrValByArmAttrs(arm, resAttrs)
			self:appendAttrValByArmGems(arm, resAttrs)
		end
		
		self:innerCalcAttrs(hero, resAttrs)
	end;
	
	appendAttrValByArmAttrs = function(self, arm, resAttrs)
		for attrIdx=1, arm:getAttrsCount(), 1 do
			local attr = arm:getAttrByIdx(attrIdx-1)
			local resAttr = Util:find(resAttrs, 'baseAttr', attr.attr)
			if resAttr ~= nil then
				resAttr.addval = resAttr.addval + attr.val
			end
			
			resAttr = Util:find(resAttrs, 'attr', attr.attr)
			if resAttr ~= nil then
				resAttr.addval = resAttr.addval + attr.val
			end
		end
	end;
	
	appendAttrValByArmGems = function(self, arm,  resAttrs)
		for gemIdx=1, arm:getGemsCount(), 1 do
			local gemId = arm:getGemByIdx(gemIdx-1)
			local attr = GemUtil:getAttr(gemId)
			local resAttr = Util:find(resAttrs, 'baseAttr', attr.attr)
			if resAttr ~= nil then
				resAttr.addval = resAttr.addval + attr.val
			end
		end
	end;
	
	recalcDynAttrs = function(self, player, hero)
		local healthVal = hero:getAttrVal(ATTR.HEALTH)
		local typ = res_gethealthtype(healthVal)
		self.healthFactor_ = res_health_map_attrsfactors[typ]
		
		local resattrs = {
			{attr=ATTR.HI, setfun='getHitVal', funparam=hero }, -- 命中
			{attr=ATTR.HU, setfun='getHurtVal', funparam=hero }, -- 攻击
			{attr=ATTR.DE, setfun='getDefenseVal', funparam=hero }, -- 防御
			{attr=ATTR.ES, setfun='getEscapeVal', funparam=hero }, -- 闪避
			{attr=ATTR.BER, setfun='getBerserkAttPer', funparam=hero }, -- 会心
			{attr=ATTR.MPS, setfun='getMaxPhysicalVal', funparam=hero }, -- 最大体力
			{attr=ATTR.SFC, setfun='getSFCAttrVal', funparam=hero }, -- 单挑力
			{attr=ATTR.FC, setfun='getFCAttrVal', funparam=hero }, -- 战力
			{attr=ATTR.CO, setfun='getCommandVal', funparam={player=player, hero=hero} }, -- 统率
			{attr=ATTR.SP, setfun='getMoveSpeedVal', funparam=hero }, -- 行军速度
			{attr=ATTR.JIN_SKILL_LEVEL, setfun='getJinSkillLevelAttr', funparam=hero }, -- 金系技能等级
			{attr=ATTR.MU_SKILL_LEVEL, setfun='getMuSkillLevelAttr', funparam=hero }, -- 木系技能等级
			{attr=ATTR.SHUI_SKILL_LEVEL, setfun='getShuiSkillLevelAttr', funparam=hero }, -- 水系技能等级
			{attr=ATTR.HUO_SKILL_LEVEL, setfun='getHuoSkillLevelAttr', funparam=hero }, -- 火系技能等级
			{attr=ATTR.TU_SKILL_LEVEL, setfun='getTuSkillLevelAttr', funparam=hero }, -- 土系技能等级
		}
		self:innerCalcAttrs(hero, resattrs)
	end;
	
	innerCalcAttrs = function(self, hero, resattrs)
		for _, a in ipairs(resattrs) do
			local attr = hero:getAttr(a.attr)
			if a.addval ~= nil then
				attr.ulVal = attr.ulVal + a.addval
			elseif a.setval ~= nil then
				attr.ulVal = a.setval
			elseif a.setfun ~= nil then
				attr.ulVal = self[a.setfun](self, a.funparam)
			end
		end	
	end;

	copyAttrs = function(self, srcattrs, desattrs, count)
		for i=1, count, 1 do
			local srcattr = srcattrs[i-1]
			local desattr = desattrs[i-1]
			desattr.usAttr = srcattr.usAttr
			desattr.ulVal = srcattr.ulVal
			desattr.ucUnit = srcattr.ucUnit
		end
	end;
	
	initSubjects = function(self, hero)
		local innerhero = hero:getInner()
		local srcL = res_hero_init_subjects[ hero:getProf() ]
		local desC = innerhero.aucSubjects
		for i=1, MAX_SUBJECT_CNT, 1 do
			desC[i-1] = srcL[i]
		end
	end;	
	
	getNeedExp = function(self, level)
		if level > table.getn(res_herolevelexps ) then 
			return res_herolevelexps[level-1].needexp
		else 
			return res_herolevelexps[level].needexp 
		end
	end;
	
	getMaxIForce = function(self, level)
		local res = res_herojingmai[level]
		if res == nil then 
			res = res_herojingmai[level + 1]
			return res.preif
		else
			return res.maxif
		end
	end;
	
	getHitVal = function(self, hero)
		local nagval = hero:getAttrVal(ATTR.NAG)
		local baseval = res_calchero_hit_attr(hero:getProf(), hero:getAttrVal(ATTR.AG_B), hero:getAttrVal(ATTR.AG_A), nagval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		
		local addval = self:getAddValByWears(hero, baseval, ATTR.HI)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.HI)
			+ self:getAddValBySkill(hero, baseval, ATTR.HI)
		return baseval + addval
	end;
	
	getHurtVal = function(self, hero)
		local nstval = hero:getAttrVal(ATTR.NST)
		local baseval = res_calchero_hurt_attr(hero:getProf(), hero:getAttrVal(ATTR.ST_B), hero:getAttrVal(ATTR.ST_A), nstval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		local addval = self:getAddValByWears(hero, baseval, ATTR.HU)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.HU)
			+ self:getAddValBySkill(hero, baseval, ATTR.HU)
		return baseval + addval
	end;
	
	getDefenseVal = function(self, hero)
		local nphval = hero:getAttrVal(ATTR.NPH)
		local baseval = res_calchero_def_attr(hero:getProf(),  hero:getAttrVal(ATTR.PH_B), hero:getAttrVal(ATTR.PH_A), nphval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		
		local addval = self:getAddValByWears(hero, baseval, ATTR.DE)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.DE)
			+ self:getAddValBySkill(hero, baseval, ATTR.DE)
		return baseval + addval
	end;
	
	getEscapeVal = function(self, hero)
		local nagval = hero:getAttrVal(ATTR.NAG)
		local baseval = res_calchero_esc_attr(hero:getProf(), hero:getAttrVal(ATTR.AG_B), hero:getAttrVal(ATTR.AG_A), nagval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		
		local addval = self:getAddValByWears(hero, baseval, ATTR.ES)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.ES)
			+ self:getAddValBySkill(hero, baseval, ATTR.ES)
		return baseval + addval
	end;
	
	getBerserkAttPer = function(self, hero)
		local nagval = hero:getAttrVal(ATTR.NAG)
		local baseval = res_calchero_batkper_attr(hero:getProf(), hero:getAttrVal(ATTR.AG_B), hero:getAttrVal(ATTR.AG_A), nagval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		
		local addval = self:getAddValByWears(hero, baseval, ATTR.BER)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.BER)
			+ self:getAddValBySkill(hero, baseval, ATTR.BER)
		return baseval + addval
	end;
	
	getMaxPhysicalVal = function(self, hero)
		local nphval = hero:getAttrVal(ATTR.NPH)
		local baseval = res_calchero_maxphy_attr(hero:getProf(), hero:getAttrVal(ATTR.PH_B), hero:getAttrVal(ATTR.PH_A), nphval, hero:getAttrVal(ATTR.IF))*self:_getHealthFactor()
		
		local addval = self:getAddValByWears(hero, baseval, ATTR.MPS)
			+ self:getAddValBySkeleton(hero, baseval, ATTR.MPS)
			+ self:getAddValBySkill(hero, baseval, ATTR.MPS)
		return baseval + addval
	end;
	
	_getHealthFactor = function(self)
		return self.healthFactor_
	end;
	
	getSFCAttrVal = function(self, hero)
		local hurt = hero:getAttrVal(ATTR.HU)
		local def = hero:getAttrVal(ATTR.DE)
		local hit = hero:getAttrVal(ATTR.HI)
		local esc = hero:getAttrVal(ATTR.ES)
		local batkper = hero:getAttrVal(ATTR.BER)
		local maxphy = hero:getAttrVal(ATTR.MPS)
		
		local totalAttr = res_gethero_totalattrs_val(hurt, def, hit, esc, batkper, maxphy)
		
		return res_gethero_single_fight_capacity( totalAttr )
	end;
	
	getFCAttrVal = function(self, hero)
		local soldierNumber = hero:getSoldierNumber()
		if (soldierNumber == 0) then return 0 end
		
		local adaptableFactor = hero:getAdaptableFactor()
		if (adaptableFactor == 0) then return 0 end

		SoldierAttrHelper:setHero(hero)
		local soldierLevel = SoldierAttrHelper:getSoldierLevel()
		local hurt = SoldierAttrHelper:getArmyAttrVal(ATTR.HU)
		local def = SoldierAttrHelper:getArmyAttrVal(ATTR.DE)
		local hit = SoldierAttrHelper:getArmyAttrVal(ATTR.HI)
		local esc = SoldierAttrHelper:getArmyAttrVal(ATTR.ES)
		local batkper = SoldierAttrHelper:getArmyAttrVal(ATTR.BER)
		local maxphy = SoldierAttrHelper:getArmyAttrVal(ATTR.MPS)
		
		local armyTotalAttr = res_gethero_totalattrs_val(hurt, def, hit, esc, batkper, maxphy)
		
		return res_gethero_fight_capacity(armyTotalAttr, soldierLevel, adaptableFactor, soldierNumber)
	end;
	
	getCommandVal = function(self, param)
		local baseval = res_gethero_command_maxval( param.hero:getLevel() )
		
		local addVal = self:getAddValByWears(param.hero, baseval, ATTR.CO)
			+ self:getAddValByOfficial(param.hero, baseval, ATTR.CO)
			+ self:getAddValByBuilds(param.player:getCitys(), baseval, ATTR.CO)
		
		return baseval + addVal
	end;
	
	getMoveSpeedVal = function(self, hero)
		return res_hero_base_move_speed 
			+ self:getAddValByWears(hero, res_hero_base_move_speed, ATTR.SP)
	end;
	
	getJinSkillLevelAttr = function(self, hero)
		return self:getAddValByWears(hero, 1, ATTR.JIN_SKILL_LEVEL)
	end;
	
	getMuSkillLevelAttr = function(self, hero)
		return self:getAddValByWears(hero, 1, ATTR.MU_SKILL_LEVEL)
	end;
	
	getShuiSkillLevelAttr = function(self, hero)
		return self:getAddValByWears(hero, 1, ATTR.SHUI_SKILL_LEVEL)
	end;
	
	getHuoSkillLevelAttr = function(self, hero)
		return self:getAddValByWears(hero, 1, ATTR.HUO_SKILL_LEVEL)
	end;
	
	getTuSkillLevelAttr = function(self, hero)
		return self:getAddValByWears(hero, 1, ATTR.TU_SKILL_LEVEL)
	end;
	
	getAddValByWears = function(self, hero, baseVal, attrId)
		local attrVal = 0
		local wearContainer = hero:getWearContainer()
		for wearArmIdx=1, wearContainer:getCount(), 1 do
			local arm = wearContainer:getWearArmByIdx(wearArmIdx):getArm()
			attrVal = attrVal + self:getAddValByArmAttrs(arm, baseVal, attrId)
			attrVal = attrVal + self:getAddValByArmGems(arm, baseVal, attrId)
		end
		
		return attrVal
	end;
	
	getAddValByArmAttrs = function(self, arm, baseVal, attrId)
		local attrVal = 0
		for attrIdx=1, arm:getAttrsCount(), 1 do
			local attr = arm:getAttrByIdx(attrIdx-1)
			if attr.attr == attrId then
				attrVal = attrVal + self:calcAttrVal(baseVal, attr)
			end
		end
		return attrVal
	end;
	
	getAddValByArmGems = function(self, arm, baseVal, attrId)
		local attrVal = 0
		for gemIdx=1, arm:getGemsCount(), 1 do
			local gemResId = arm:getGemByIdx(gemIdx-1)
			local attr = GemUtil:getAttr(gemResId)
			if attr.attr == attrId then
				attrVal = attrVal + self:calcAttrVal(baseVal, attr)
			end
		end
		return attrVal
	end;
	
	calcAttrVal = function(self, baseVal, attr)
		if attr.unit == VAL_UNIT.VAL then
			return attr.val
		elseif attr.unit == VAL_UNIT.PER then
			return math.floor(attr.val * baseVal / 100)
		end
	end;
	
	getAddValByOfficial = function(self, hero, baseVal, attrId)
		local offires = Util:qfind(res_heroofficials, 'id', hero:getOfficial())
		if offires == nil then
			return 0
		end
		
		if attrId == ATTR.CO then
			return offires.addcom
		end
		
		return 0
	end;
	
	getAddValBySkeleton = function(self, hero, baseval, attrid)
		local res = res_herojingmai[ hero:getSkeletonLevel() ]
		if res == nil then return 0 end
		
		local addRes = {val=0, unit=0}
		if attrid == ATTR.HI then
			addRes = res.addhit
		elseif attrid == ATTR.HU then
			addRes = res.addhurt
		elseif attrid == ATTR.DE then
			addRes = res.adddef
		elseif attrid == ATTR.ES then
			addRes = res.addes
		elseif attrid == ATTR.BER then
			addRes = res.addber
		elseif attrid == ATTR.MPS then
			addRes = res.addmps
		end
		
		local addVal = 0
		if addRes.unit == VAL_UNIT.VAL then
			addVal = addRes.val
		elseif addRes.unit == VAL_UNIT.PER then
			addVal = math.floor(baseval*addRes.val/100)
		end
		
		return addVal
	end;
	
	getAddValBySkill = function(self, hero, baseval, attrid)
		local skill = hero:getSkillById(FIXID.FULLATTR_SKILL)
		if skill == nil then
			return 0
		end
		
		local effect = ItemResUtil:findItemres(FIXID.FULLATTR_SKILL).effects[1]
		local val = eval(effect.val, {LV=skill.ucLevel})
		if effect.u == VAL_UNIT.VAL then
			return val
		elseif effect.u == VAL_UNIT.PER then
			return math.floor(baseval*val/100)
		end
	end;	
	
	getAddValByBuilds = function(self, citys, baseVal, attrId)
		if attrId == ATTR.CO then
			local levels = citys:getBuildsLevelSum(FIXID.JIAOLIANBUILD)
			return levels*20
		end
		
		return 0
	end;	
}):new()


