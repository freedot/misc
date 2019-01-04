--*******************************************************************************
FightActor = Class:extends({
	init = function(self)
		self:initParams()
	end;
	
	initParams = function(self)
		self.id = 0
		self.x = -1
		self.y = -1
		self.camp = 0
		self.type = ACTOR_TYPE.COMM
		self.attackSpeed = 0
		self.isLive = true
		self.attackTarget = nil
		self.stream = NullFightEventStream
		self.model = 0
	end;
	
	getType = function(self)
		return self.type
	end;
	
	getId = function(self)
		return self.id
	end;
	
	getName = function(self)
		return ''
	end;
	
	getIcon = function(self)
		return 0
	end;
	
	setId = function(self, id)
		self.id = id
	end;
	
	setStream = function(self, stream)
		self.stream = stream
	end;
	
	getCamp = function(self)
		return self.camp
	end;
	
	setCamp = function(self, camp)
		self.camp = camp
	end;
	
	setPos = function(self, x, y)
		self.x = x
		self.y = y
		FightMapHdr:setMask(x, y, 1)
	end;
	
	getPos = function(self)
		return {x=self.x, y=self.y}
	end;
	
	isCanAddEffect = function(self)
		return false;
	end;
	
	addTmpAttrValInFight = function(self)
	end;
	
	moveTo = function(self, x, y)
		self:clearPos()
		self:setPos(x, y)
		self.stream:pushEvent({event='move', id=self.id, paths={{x=x,y=y}}})
	end;
	
	die = function(self)
		self:clearPos()
		self.isLive = false
		self.stream:pushEvent({event='die', id=self.id})
	end;
	
	isDie = function(self)
		return not self.isLive
	end;
	
	clearPos = function(self)
		FightMapHdr:setMask(self.x, self.y, 0)
		self.x = -1
		self.y = -1
	end;
	
	getAttackTarget = function(self)
		return self.attackTarget 
	end;
	
	setAttackTarget = function(self, attackTarget)
		self.attackTarget = attackTarget
	end;
	
	getAttackRange = function(self)
		return 0
	end;
	
	setAttackRange = function(self, range)
	end;
	
	getMoveRange = function(self)
		return 0
	end;
	
	getAttackSpeed = function(self)
		return self.attackSpeed
	end;
	
	setLineupPos = function(self, lineupPos)
		self.lineupPos = lineupPos
	end;
	
	getLineupPos = function(self)
		return self.lineupPos
	end;
	
	clearFightTmpAddAttrs = function(self)
	end;
	
	getSkillCount = function(self)
		return 0
	end;
	
	getSkillByIdx = function(self, skillIdx)
		return nil
	end;
	
	clearProEffects = function(self)
	end;
	
	clearEffectBuffs = function(self)
	end;
	
	getEffects = function(self)
		return EMPTY_EFFECTS
	end;
	
	getAttrVal = function(self, attrId)
		return 0
	end;
	
	getSoldierResId = function(self)
		return 0
	end;
	
	getSoldierModelResId = function(self)
		if self.model == 0 then
			return self:getSoldierResId()
		else
			return self.model
		end
	end;
	
	setSoldierModelResId = function(self, model)
		self.model = model
	end;
	
	subHP = function(self)
	end;
	
	addHP = function(self)
	end;
	
	isCanDodge = function(self)
		return true
	end;
	
	attack = function(self, target)
	end;
	
	getSoldierLevel = function(self)
		return 0
	end;
	
	getAdaptableFactor = function(self)
		return 0
	end;
})

NullActor = FightActor:extends({
})


