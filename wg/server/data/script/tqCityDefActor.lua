--*******************************************************************************
--*******************************************************************************
CityDefActor = FightActor:extends({
	init = function(self)
		self:initParams()
		self.type = ACTOR_TYPE.DEF
		self.attrs = {}
		self.cityDef = nil
		self.initNumber = 0
		self.defNumber = 0
		self.unitNumber = 1
	end;
	
	setCityDef = function(self, cityDef, defType)
		self.cityDef = cityDef
		self.defType = defType
		self.attrs[ATTR.HU] = res_citydefs_hurt_bytype[self.defType]
		self:setNumbers()
	end;
	
	getName = function(self)
		return rstr.cityDefActorNames[self.defType]
	end;
	
	reset = function(self)
		self:setNumbers()
	end;
	
	setNumbers = function(self)
		self.initNumber = self.cityDef:getDefNumber(self.defType)
		self.defNumber = self.initNumber
		self.unitNumber = self.defNumber*res_citydef_each_need_num_per
		if (self.unitNumber < 1) then self.unitNumber = 1 end
		if (self.defNumber == 0) then self:die() end
	end;
	
	getInitNumber = function(self)
		return self.initNumber
	end;
	
	getNumber = function(self)
		return self.defNumber
	end;
	
	getSoldierResId = function(self) -- rename ?
		return self.defType
	end;
	
	getDefType = function(self)
		return self.defType
	end;
	
	getAttrVal = function(self, attrId)
		local attrVal = self.attrs[attrId]
		if (attrVal == nil) then attrVal = 0 end
		return attrVal
	end;
	
	setAttrVal = function(self, attrId, val)
		self.attrs[attrId] = val
	end;	
	
	getAttackSpeed = function(self)
		return MIN_ATTACKSPEED
	end;
	
	getAttackRange = function(self)
		return MAX_ATTACKRANGE
	end;
	
	getFightUnitNumber = function(self)
		return self.unitNumber
	end;

	hurtEnd = function(self)
		self.defNumber = self.defNumber - self.unitNumber
		if (self.defNumber < 1) then self.defNumber = 0 end
		if (self.defNumber == 0) then self:die() end
		self.cityDef:setDefNumber(self.defType, self.defNumber)
	end;
	
	attack = function(self, target, attackersCamp, defendersCamp)
		self:setAttackTarget(target)
		ActorAttackHdr:setStream(self.stream)
		ActorAttackHdr:cityDefAttack(self, target, attackersCamp, defendersCamp)
	end;
})

