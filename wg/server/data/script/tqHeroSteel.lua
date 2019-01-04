--*******************************************************************************
HeroSteel = Class:extends({
	init = function(self, steel)
		self.steel = steel
	end;
	
	getSteelQuarters = function(self)
		return self.steel.quarters
	end;
	
	setSteelQuarters = function(self, quarters)
		self.steel.quarters = quarters
	end;
	
	getQuarterRes = function(self)
		return self.steel.quarterRes
	end;	
	
	setQuarterRes = function(self, quarterRes)
		self.steel.quarterRes = quarterRes
	end;
	
	getStartTime = function(self)
		return self.steel.startTime
	end;
	
	setStartTime = function(self, startTime)
		self.steel.startTime = startTime
	end;
	
	getSteelType = function(self)
		return self.steel.steelType
	end;
	
	setSteelType = function(self, steelType)
		self.steel.steelType = steelType
	end;
	
	getActMult = function(self)
		return self.steel.actMult
	end;
	
	setActMult = function(self, actMult)
		self.steel.actMult = actMult
	end;
	
	setQuarterMoney = function(self, money)
		self.steel.quarterMoney = money
	end;
	
	setHourGold = function(self, gold)
		self.steel.hourGold = gold
	end;
	
	getSteeledExp = function(self)
		if self:_getSteeledQuarters() < 1 then
			return 0
		end
		local svrActMult = 1
		return math.floor( self:_getSteeledQuarters()*self:getQuarterRes()*self:getActMult() )
	end;
	
	getReturnMoney = function(self)
		return math.floor(self:_getLeftQuarters()* self.steel.quarterMoney*0.7)
	end;
	
	getReturnGold = function(self)
		if self:_getSteeledQuarters() < 1 then
			return math.floor(self:getSteelQuarters()*self.steel.hourGold/4)
		end
		
		return math.floor(self:_getLeftQuarters()*self.steel.hourGold/4)
	end;
	
	_getDuration = function(self)
		if self.steel.startTime == 0 then
			return 0
		end
		
		local duration = Util:getTime() - self.steel.startTime
		return math.clamp(duration, 0, self.steel.quarters*900)
	end;	
	
	_getSteeledQuarters = function(self)
		return self:_getDuration() / 900
	end;
	
	_getLeftQuarters = function(self)
		return self:getSteelQuarters() - self:_getSteeledQuarters()
	end;
})


