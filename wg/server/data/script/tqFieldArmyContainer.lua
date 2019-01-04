--*******************************************************************************
--*******************************************************************************
FieldArmyContainer = Class:extends({
	init = function(self)
		self.army = {lineupId=FIXID.DEFAULTLINEUP, heroCount=5, heros={0,0,0,0,0}}
	end;
	
	initArmy = function(self, lineupId, heroIds)
		if (lineupId == nil) or (heroIds == nil) then 
			return
		end
		
		self.army.lineupId = lineupId
		for i, heroId in ipairs(heroIds) do
			self.army.heros[i] = heroId
		end
	end;
	
	getDefArmy = function(self)
		return self.army
	end;
	
	getCanFightDefArmy = function(self)
		return self:getDefArmy()
	end;
	
	getSelfArmy = function(self)
		return self.army
	end;
})


