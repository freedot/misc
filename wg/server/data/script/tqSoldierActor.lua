--*******************************************************************************
SoldierActor = HeroActor:extends({
	init = function(self)
		self:initParams()
		self.type = ACTOR_TYPE.SOLDIER
		self:initActorInfos()
		self.soldier = {initNumber=0,lossNumber=0,reviveNumber=0}
		self.attrs = {}
		self.soldierAttr = {}
		self:_initAttrs()
	end;
	
	copyAttrs = function(self)
		self:calcActorAttrs()
		self:calcUnitHP()
		self.soldier.initNumber = self:getFightUnitNumber()
	end;
	
	getInitNumber = function(self)
		return self.soldier.initNumber
	end;
	
	getLossNumber = function(self)
		return math.ceil(self.soldier.lossNumber)
	end;
	
	getReviveNumber = function(self)
		return self.soldier.reviveNumber
	end;
	
	setReviveNumber = function(self, reviveNumber) 
		self.soldier.reviveNumber = math.floor(reviveNumber+0.5)
		self.hero:addSoldierNumber(self.soldier.reviveNumber)
	end;
	
	calcActorAttrs = function(self)
		self:_initAttrs()		
		local soldier = self.hero:getSoldier()
		if (soldier.number == 0) then return end
		if (soldier.resid == 0) then return end
		
		SoldierAttrHelper:setHero(self.hero)
		self.soldierAttr.resid = SoldierAttrHelper:getSoldierBaseId()
		self.soldierAttr.level = SoldierAttrHelper:getSoldierLevel()
		
		self.soldierAttr.mspeed = SoldierAttrHelper:getSoldierAttrVal('mspeed')
		self.soldierAttr.arange = SoldierAttrHelper:getSoldierAttrVal('arange')
		self.soldierAttr.aspeed = SoldierAttrHelper:getSoldierAttrVal('aspeed')
		
		self.attrs[ATTR.HU] = SoldierAttrHelper:getArmyAttrVal(ATTR.HU)
		self.attrs[ATTR.DE] = SoldierAttrHelper:getArmyAttrVal(ATTR.DE)
		self.attrs[ATTR.HI] = SoldierAttrHelper:getArmyAttrVal(ATTR.HI)
		self.attrs[ATTR.ES] = SoldierAttrHelper:getArmyAttrVal(ATTR.ES)
		self.attrs[ATTR.BER] = SoldierAttrHelper:getArmyAttrVal(ATTR.BER)
		self.attrs[ATTR.MPS] = SoldierAttrHelper:getArmyAttrVal(ATTR.MPS)
	end;
	
	addHP = function(self, hpVal)
		if (hpVal <= 0) then 
			return 
		end
		
		local curVal = self.attrs[ATTR.HP] + hpVal
		if (curVal > self.attrs[ATTR.MHP]) then 
			curVal = self.attrs[ATTR.MHP] 
		end
		self.attrs[ATTR.HP] = curVal
		
		local addNumber = hpVal/self.attrs[ATTR.UHP]
		local leftNumberSpace = self.hero:getAttrVal(ATTR.CO) - self.hero:getSoldier().number
		if addNumber >  leftNumberSpace then
			addNumber = leftNumberSpace
		end
		
		self.soldier.lossNumber = self.soldier.lossNumber - addNumber
		if self.attrs[ATTR.HP] == self.attrs[ATTR.MHP]  then
			self.soldier.lossNumber = 0
		end
		
		self:resetHeroSoldierNumber()
		self:checkDie()
	end;
	
	subHP = function(self, hpVal)
		if (hpVal <= 0) then return end
		
		local curVal = self.attrs[ATTR.HP] - hpVal
		if (curVal < 0) then curVal = 0 end
		self.attrs[ATTR.HP] = curVal
		
		local lostNumber = hpVal/self.attrs[ATTR.UHP]
		if (lostNumber > self.hero:getSoldier().number) then
			lostNumber = self.hero:getSoldier().number
		end
		
		self.soldier.lossNumber = self.soldier.lossNumber + lostNumber
		if self.attrs[ATTR.HP] == 0  then
			self.soldier.lossNumber = self.soldier.initNumber
		end
		
		self:resetHeroSoldierNumber()
		self:checkDie()
	end;
	
	resetHeroSoldierNumber = function(self)
		if self.soldier.lossNumber < 0 then
			self.soldier.lossNumber = 0
		elseif self.soldier.lossNumber > self.soldier.initNumber then
			self.soldier.lossNumber = self.soldier.initNumber
		end
		self.hero:setSoldierNumber(self.soldier.initNumber - math.ceil(self.soldier.lossNumber))
	end;
	
	recalcHP = function(self)
		self:calcUnitHP()
		local soldier = self.hero:getSoldier()
		self.attrs[ATTR.MHP] = soldier.number*self.attrs[ATTR.UHP]
		self.attrs[ATTR.HP] = soldier.number*self.attrs[ATTR.UHP]
		self:checkDie()
	end;
	
	calcUnitHP = function(self)
		self.attrs[ATTR.UHP] = res_ps_to_factps*self.attrs[ATTR.MPS]
	end;
	
	checkDie = function(self)
		local soldier = self.hero:getSoldier()
		if soldier.number <= 0 then
			self:die()
		end
	end;
	
	getSoldierResId = function(self)
		return self.soldierAttr.resid
	end;
	
	getAttackSpeed = function(self)
		if (self.attackSpeed == 0) then 
			local agval = self.hero:getAttrVal(ATTR.AG_B) + self.hero:getAttrVal(ATTR.AG_A)
			local coval = self.hero:getAttrVal(ATTR.CO)
			self.attackSpeed = self.soldierAttr.aspeed*100000 + agval*1000 + coval + math.random(10)
		end
		return self.attackSpeed
	end;
	
	getAttackRange = function(self)
		return self.soldierAttr.arange
	end;
	
	setAttackRange = function(self, range)
		self.soldierAttr.arange = range
	end;
	
	getMoveRange = function(self)
		return self.soldierAttr.mspeed + self:getTacticSkillSpeedAdd()
	end;
	
	getFightUnitNumber = function(self)
		local soldier = self.hero:getSoldier()
		return soldier.number
	end;
	
	getTacticSkillSpeedAdd= function(self)
		local drtSpeed = 0
		local skillId = self.hero:getCurTacticSkillId()
		if skillId == FIXID.MOVEFASTSKILL then
			drtSpeed = 1
		elseif skillId == FIXID.MOVESLOWSKILL then
			drtSpeed = -1
		end
		return drtSpeed
	end;
	
	getSoldierLevel = function(self)
		return self.soldierAttr.level
	end;
	
	getAdaptableFactor = function(self)
		return self.hero:getAdaptableFactor()
	end;
	
	_initAttrs = function(self)
		self.soldierAttr.mspeed=0
		self.soldierAttr.arange=0
		self.soldierAttr.aspeed=0
		self.soldierAttr.resid=0
		self.soldierAttr.level=0
		
		self.attrs[ATTR.HU] = 0
		self.attrs[ATTR.DE] = 0
		self.attrs[ATTR.HI] = 0
		self.attrs[ATTR.ES] = 0
		self.attrs[ATTR.BER] = 0
		self.attrs[ATTR.MPS] = 0
	end;
})

