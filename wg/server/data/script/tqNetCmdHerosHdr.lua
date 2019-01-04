--*******************************************************************************
--*******************************************************************************
NETCMDHEROS_MAX_COUNT = 1000
NetCmdHerosHdr = Class:extends({
	-- maxCount , 如果该参数为nil，则使用默认的 NETCMDHEROS_MAX_COUNT
	handleParam = function(self, player, cmdtb, maxCount)
		self.player = player
		self.heros = {}
		self.heroIds = {}
		
		if maxCount == nil then
			maxCount = NETCMDHEROS_MAX_COUNT
		end
		
		local heroCount = Util:getNumber(cmdtb, 'count')
		if heroCount <= 0 or heroCount > maxCount then
			return false
		end
		
		local heroMgr = self.player:getHeroMgr()
		for i=1, heroCount, 1 do
			local heroId = Util:getNumber(cmdtb, 'hid'..i)
			table.insert(self.heroIds, heroId)
			local hero = heroMgr:getHeroById(heroId)
			if (hero ~= nil) then
				table.insert(self.heros, hero)
			end
		end
		
		return true
	end;

	getHerosCount = function(self)
		return table.getn(self.heros)
	end;
	
	getHeros = function(self)
		return self.heros
	end;

	getHeroIdsCount = function(self)
		return table.getn(self.heroIds)
	end;
	
	getHeroIds = function(self)
		return self.heroIds
	end;
	
	isEmptyHeros = function(self)
		return self:getHerosCount() == 0
	end;
	
	hasBusyHeros = function(self, exclusives)
		if exclusives == nil then
			exclusives = {}
		end
		
		for _, hero in ipairs(self.heros) do
			if not hero:isFree() and exclusives[hero:getState()] == nil then
				return true
			end
		end
		return false	
	end;	
	
	hasRepeatHeros = function(self)
		local existHero = {}
		for _, hero in ipairs(self.heros) do
			if existHero[hero:getId()] ~= nil then 
				return true
			else
				existHero[hero:getId()] = true
			end
		end
		return false	
	end;
	
	hasDeepWoundHeros = function(self)
		for _, hero in ipairs(self.heros) do
			local health = hero:getAttrVal(ATTR.HEALTH)
			if (res_gethealthtype(health) == HEALTH_TYPE.DEEP_WOUND ) then
				return true
			end
		end
		return false	
	end;
	
	hasEmptyCarrySoldierHeros = function(self)
		for _, hero in ipairs(self.heros) do
			local soldier = hero:getSoldier()
			if (soldier.resid == 0) or (soldier.number == 0) then
				return true
			end
		end
		return false	
	end;
})


