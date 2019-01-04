--*******************************************************************************
--*******************************************************************************
WallActorData = Class:extends({
	init = function(self)
		self.attrs = {}
	end;
	
	setHPAndDEF = function(self, hp, def)
		self.attrs[ATTR.DE] = def
		self.attrs[ATTR.MHP] = hp
		self.attrs[ATTR.HP] = self.attrs[ATTR.MHP]
		self.attrs[ATTR.MPS] = self.attrs[ATTR.MHP]/res_ps_to_factps
	end;
	
	getAttrVal = function(self, attrId)
		local attrVal = self.attrs[attrId]
		if attrVal ~= nil then
			return attrVal
		end
		return 0
	end;
	
	subHP = function(self, hpVal)
		if (hpVal <= 0) then return end
		local curVal = self.attrs[ATTR.HP] - hpVal
		if (curVal < 0) then curVal = 0 end
		self.attrs[ATTR.HP] = curVal
	end;

	isDie = function(self)
		return self.attrs[ATTR.HP] == 0
	end;
})

WallActorProxy = FightActor:extends({
	init = function(self)
		self:initParams()
		self.type = ACTOR_TYPE.WALL
		self.wallData = nil
	end;
	
	getName = function(self)
		return rstr.actor.wallActorName
	end;
	
	setWallData = function(self, wallData)
		self.wallData = wallData
		if self.wallData:isDie() then self:die() end
	end;
	
	getAttackSpeed = function(self)
		return MIN_ATTACKSPEED
	end;
	
	getAttackRange = function(self)
		return MIN_ATTACKRANGE
	end;
	
	getAttrVal = function(self, attrId)
		return self.wallData:getAttrVal(attrId)
	end;

	subHP = function(self, hpVal)
		self.wallData:subHP(hpVal)
		if self.wallData:isDie() then self:die() end
	end;
	
	getAdaptableFactor = function(self)
		return 1
	end;
	
	isCanDodge = function(self)
		return false
	end;
})

