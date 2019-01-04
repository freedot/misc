--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
WearItem = Class:extends({
	init = function(self, innerWear)
		self.innerWear = innerWear
		self.arm = ItemEx(innerWear.arm)
	end;
	
	getArm = function(self)
		return self.arm
	end;
	
	setArmPos = function(self, armPos)
		self.innerWear.armPos = armPos
	end;
	
	getArmPos = function(self)
		return self.innerWear.armPos
	end;
})

HeroWear = Class:extends({
	init = function(self, innerWears)
		self.innerWears = innerWears
		self:_initWears()
	end;
	
	getWearArmByArmPos = function(self, armPos)
		return Util:findByFun(self.wears, 'getArmPos', armPos)
	end;
	
	getArmByArmPos = function(self, armPos)
		local wearArm = self:getWearArmByArmPos(armPos)
		if wearArm == nil then
			return nil
		end
		
		return wearArm:getArm()
	end;
	
	getWearArmById = function(self, armId)
		if armId <= 0 then
			return nil
		end
		
		for _, wear in ipairs(self.wears) do
			if wear:getArm():getId() == armId then
				return wear
			end
		end
		
		return nil
	end;
	
	getCount = function(self)
		return table.getn(self.wears)
	end;
	
	getWearArmByIdx = function(self, idx) -- from 1 to n
		return self.wears[ idx ]
	end;
	
	wear = function(self, armPos, arm)
		if armPos < HEROARM_POS.FIRST then
			return 
		end
		
		if armPos > HEROARM_POS.LAST then
			return
		end
		
		if self:getWearArmByArmPos(armPos) ~= nil then
			return
		end
		
		local wearItem = WearItem(self.innerWears.wears[self.innerWears.count])
		wearItem:setArmPos(armPos)
		wearItem:getArm():copyFrom(arm)
		table.insert( self.wears, wearItem )
		self.innerWears.count = self.innerWears.count + 1
	end;
	
	unWear = function(self, armPos)
		if Util:findC(self.innerWears.wears, self.innerWears.count, 'armPos', armPos) == nil then
			return
		end
		
		self.innerWears.count = Util:removeElementC(self.innerWears.wears, self.innerWears.count, Util:getLastFindIdx())
		table.remove(self.wears, table.getn(self.wears))
	end;
	
	_initWears = function(self)
		self.wears = {}
		for i=1, self.innerWears.count, 1 do
			local innerWear = self.innerWears.wears[i-1]
			table.insert( self.wears, WearItem(innerWear) )
		end
	end;
})


