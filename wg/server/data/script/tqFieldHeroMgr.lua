--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
FieldHeroMgr = Class:extends({
	init = function(self)
		self.heros = {}
		self.heroCount = 0
	end;
	
	newHero = function(self, heroId, fieldHeroResid, heroName, heroIcon)
		if (fieldHeroResid == 0) then return end
		local hero = FieldHero()
		hero:setResId(fieldHeroResid)
		hero:setId(heroId)
		if heroName ~= nil then
			hero:setName(heroName)
		end
		if heroIcon ~= nil then
			hero:setIcon(heroIcon)
		end
		self.heros[heroId] = hero
		self.heroCount = self.heroCount + 1
		
		return self.heros[heroId]
	end;
	
	getHeroCount = function(self)
		return self.heroCount
	end;
	
	getHeroById = function(self, heroId)
		return self.heros[heroId]
	end;
})


