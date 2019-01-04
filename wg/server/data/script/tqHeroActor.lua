--*******************************************************************************
HeroActor = FightActor:extends({
	init = function(self)
		self:initParams()
		self.type = ACTOR_TYPE.HERO
		self:initActorInfos()
	end;
	
	initActorInfos = function(self)
		self.hero = nil
		self.attrs = {}
		self.fightTmpAddAttrs = {}
		self.skillEffects = {}
		self.effectUid = 1
		self.baseHurt = 0
		self.hurt = 0
		self.addExpVal = 0
		self.addCreditVal = 0
		self.addIForceVal = 0
	end;
	
	setHero = function(self, hero)
		self.hero = hero
		self:copyAttrs()
		self:clearFightTmpAddAttrs()
		self:collectFixedSkillEffects()
		self:recalcAttrs()
	end;
	
	getHero = function(self)
		return self.hero
	end;
	
	getIcon = function(self)
		return self.hero:getIcon()
	end;
	
	getName = function(self)
		return self.hero:getName()
	end;
	
	addExp = function(self, val)
		self.addExpVal = self.addExpVal + val
	end;
	
	getAddExp = function(self)
		return self.addExpVal
	end;		
	
	addCredit = function(self, val)
		self.addCreditVal = self.addCreditVal + val
	end;
	
	getAddCredit = function(self)
		return self.addCreditVal
	end;		
	
	addIForce = function(self, val)
		self.addIForceVal = self.addIForceVal + val
	end;
	
	getAddIForce = function(self)
		return self.addIForceVal
	end;		
	
	getSoldierResId = function(self)
		return 0
	end;
	
	copyAttrs = function(self)
		self.attrs[ATTR.HU] = self.hero:getAttrVal(ATTR.HU)
		self.attrs[ATTR.DE] = self.hero:getAttrVal(ATTR.DE)
		self.attrs[ATTR.HI] = self.hero:getAttrVal(ATTR.HI)
		self.attrs[ATTR.MPS] = self.hero:getAttrVal(ATTR.MPS)
		self.attrs[ATTR.ES] = self.hero:getAttrVal(ATTR.ES)
		self.attrs[ATTR.BER] = self.hero:getAttrVal(ATTR.BER)
	end;
	
	clearFightTmpAddAttrs = function(self)
		self.fightTmpAddAttrs[ATTR.HU] = 0
		self.fightTmpAddAttrs[ATTR.DE] = 0
		self.fightTmpAddAttrs[ATTR.HI] = 0
		self.fightTmpAddAttrs[ATTR.ES] = 0
		self.fightTmpAddAttrs[ATTR.BER] = 0
		self.fightTmpAddAttrs[ATTR.HP] = 0
		self.fightTmpAddAttrs[ATTR.MHP] = 0
		self.fightTmpAddAttrs[ATTR.UHP] = 0
		self.fightTmpAddAttrs[ATTR.MPS] = 0
		self.fightTmpAddAttrs[ATTR.PS] = 0
	end;
	
	collectFixedSkillEffects = function(self) -- 存在问题，如果使用者是攻击者，作用对象是防守者，则有问题
		local skillCount = self.hero:getSkillCount()
		for i=0, skillCount-1, 1 do
			local skill = self.hero:getSkillByIdx(i)
			local skillRes = ItemResUtil:findItemres(skill.ulResId)
			local skillLevel = skill.ucLevel + AddLevelByHeroFiveElemAttr:getAddLevel( self.hero,  skillRes)
			
			for _, effect in ipairs(skillRes.effects) do
				if effect.id == 0 then break end
				if tonumber(effect.pro) == 100 then
					local val = eval(effect.val, {LV=skillLevel})
					table.insert(self.skillEffects, {uid=self.effectUid, id=effect.id, skillId=skillRes.id, skillLevel=skillLevel, pro=100, val=val, u=effect.u, isbuff=false, times=0xffffffff})
					self.stream:pushEvent({event='addeff', id=self.id, effid=effect.id, effuid=self.effectUid})
					self.effectUid = self.effectUid + 1
				end
			end
		end
	end;
	
	recalcAttrs = function(self)
		self:recalcAttrsBySkill()
		self:recalcHP()	
	end;	
	
	recalcAttrsBySkill = function(self)
		for _, effect in ipairs(self.skillEffects) do
			if effect.id == RES_EFF.F_ADD_FULLATTRS then
				local effector = EffectorMgr:getEffector(effect)
				effector:exec(self, effect)
				break
			end
		end
	end;
	
	recalcHP = function(self)
		self.attrs[ATTR.MHP] = res_ps_to_factps*self.attrs[ATTR.MPS]
		self.attrs[ATTR.HP] = self.attrs[ATTR.MHP]
	end;
	
	addTmpAttrValInFight = function(self, attrId, addVal)
		self.fightTmpAddAttrs[attrId] = self.fightTmpAddAttrs[attrId] + addVal
	end;
	
	getAttrVal = function(self, attrId)
		local attrVal = self.attrs[attrId]
		if attrVal == nil then
			attrVal = self.hero:getAttrVal(attrId)
		end
		
		local addVal = self.fightTmpAddAttrs[attrId]
		if addVal == nil then
			addVal = 0
		end
		
		return attrVal + addVal
	end;
	
	setAttrVal = function(self, attrId, val)
		self.attrs[attrId] = val
	end;
	
	addHP = function(self, hpVal)
		if (hpVal <= 0) then return end
		local curVal = self.attrs[ATTR.HP] + hpVal
		if (curVal > self.attrs[ATTR.MHP]) then curVal = self.attrs[ATTR.MHP] end
		self.attrs[ATTR.HP] = curVal
	end;
	
	subHP = function(self, hpVal)
		if (hpVal <= 0) then return end
		local curVal = self.attrs[ATTR.HP] - hpVal
		if (curVal < 0) then curVal = 0 end
		self.attrs[ATTR.HP] = curVal
		
		if self.attrs[ATTR.HP] == 0 then
			self:die()
		end
	end;
	
	getEffects = function(self)
		return self.skillEffects
	end;
	
	isCanAddEffect = function(self, effectId)
		for _, eff in ipairs(self.skillEffects) do
			if res_get_fighteffect_rel(eff.id, effectId) == STATE_REL.MUTEX then return false end
		end
		return true
	end;
	
	addProEffect = function(self, effect)
		for _, eff in ipairs(self.skillEffects) do
			if res_get_fighteffect_rel(eff.id, effect.id) == STATE_REL.REPLACE then
				eff.val = effect.val
				eff.u = effect.u
				eff.times = effect.times
				return
			end
		end
		effect.uid = self.effectUid
		table.insert(self.skillEffects, effect)
		self.stream:pushEvent({event='addeff', id=self.id, skillId=effect.skillId, effid=effect.id, effuid=effect.uid})
		self.effectUid = self.effectUid + 1
	end;
	
	getEffect = function(self, effectId)
		for _, eff in ipairs(self.skillEffects) do
			if (eff.id == effectId) then return eff end
		end
		return nil
	end;
	
	clearProEffects = function(self)
		self:clearEffectsInner(false)
	end;
	
	clearEffectBuffs = function(self)
		self:clearEffectsInner(true)
	end;
	
	clearEffectsInner = function(self, isbuff)
		local cnt = table.getn(self.skillEffects)
		for i=cnt, 1, -1 do
			local effect = self.skillEffects[i]
			if effect.isbuff == isbuff then
				effect.times = effect.times - 1
				if effect.times <= 0 then
					table.remove(self.skillEffects, i)
					self.stream:pushEvent({event='removeeff', id=self.id, effid=effect.id, effuid=effect.uid})
				end
			end
		end	
	end;
	
	getAttackSpeed = function(self)
		if (self.attackSpeed == 0) then 
			local agval = self.hero:getAttrVal(ATTR.AG_B) + self.hero:getAttrVal(ATTR.AG_A)
			local coval = self.hero:getAttrVal(ATTR.CO)
			self.attackSpeed = agval*1000 + coval + math.random(10)
		end
		return self.attackSpeed
	end;
	
	getAttackRange = function(self)
		return MAX_ATTACKRANGE
	end;

	setBaseHurt = function(self, baseHurt)
		self.baseHurt = baseHurt
	end;
	
	getBaseHurt = function(self)
		return self.baseHurt
	end;
	
	setHurt = function(self, hurt)
		self.hurt = hurt
	end;
	
	getHurt = function(self)
		return self.hurt
	end;
	
	attack = function(self, target, attackersCamp, defendersCamp)
		self:setAttackTarget(target)
		self:clearFightTmpAddAttrs()
		target:clearFightTmpAddAttrs()
		ActorAttackHdr:setStream(self.stream)
		ActorAttackHdr:attack(self, target, attackersCamp, defendersCamp)
	end;
	
	getFightUnitNumber = function(self)
		return 1
	end;
	
	getSkillCount = function(self)
		return self.hero:getSkillCount()
	end;
	
	getSkillByIdx = function(self, idx)
		return self.hero:getSkillByIdx(idx)
	end;
})

