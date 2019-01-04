--*******************************************************************************
require('tqFightResultMaker')

FightResult = Class:extends({
	init = function(self, stream)
		self.stream = stream
		self.resultMaker = FightResultMaker()
		self:clear()
	end;
	
	clear = function(self)
		self.attackerCamp = nil
		self.defenderCamps = nil
		self.fightRet = 0
		
		self.cacheResult = {}
	end;
	
	setAttackerCamp = function(self, attackerCamp)
		self.attackerCamp = attackerCamp
	end;
	
	setDefenderCamps = function(self, defenderCamps)
		self.defenderCamps = defenderCamps
	end;
	
	setArmy = function(self, army)
		self.army = army
	end;
	
	setFightRet = function(self, fightRet)
		self.fightRet = fightRet
	end;
	
	getFightActionAndResultString = function(self)
		if self.cacheResult.saction == nil then
			self.cacheResult.saction = toJIONString(self.stream:getEvents())
		end
		
		if self.cacheResult.sresults == nil then
			local results = self:getAllFightResults()
			self.cacheResult.sresults = self:joinFightResultsToStr( results )
		end
		
		return self.cacheResult.saction, self.cacheResult.sresults
	end;
	
	getFightResultsCount = function(self)
		local results = self:getAllFightResults()
		return table.getn(results)
	end;	
	
	getAllianceFightResult = function(self, resultIdx)
		local results = self:getAllFightResults()
		return results[resultIdx]
	end;
	
	getAllFightResults = function(self)
		if self.cacheResult.results ~= nil then
			return self.cacheResult.results
		end
		
		local defenderPartyName = self:_getDefenderPartyName()
		self.cacheResult.results = {}
		for _, defenderCamp in ipairs(self.defenderCamps) do
			if not defenderCamp.isFighted then
				break
			end
			local fightResultStr = self.resultMaker:make(defenderPartyName, self.army.expedType, self.attackerCamp, defenderCamp, self.fightRet)
			table.insert(self.cacheResult.results, fightResultStr)
		end
		return self.cacheResult.results
	end;
	
	_getDefenderPartyName = function(self)
		local len = table.getn(self.defenderCamps)
		return self.defenderCamps[len].player:getRoleName()
	end;
		
	joinFightResultsToStr = function(self, results)
		local sresults = ''
		for _, sresult in ipairs(results) do
			if (sresults ~= '') then sresults = sresults..',' end
			sresults = sresults..sresult
		end
		return '['..sresults..']'
	end;
})



