--*******************************************************************************
-- 在登录后处理一些异常的数据
--*******************************************************************************
local ArmyChecker = Class:extends({
	check = function(self, player)
		local armyContainer = player:getArmyContainer()
		local armyCount = self:_getCount(armyContainer)
		for i=armyCount-1, 0, -1 do
			local armyId = self:_getArmyId(armyContainer, i)
			local army = app:getArmyMgr():getArmyById(armyId)
			if army == nil then
				armyContainer:removeArmyId(armyId)
				LOG('<error> invalid armyId, user:' .. player:getName())
			end
		end
	end;
	_getCount = function(self, armyContainer) return 0 end;
	_getArmyId = function(self, armyContainer, idx ) 	return -1 end;
})

local SelfArmyChecker = ArmyChecker:extends({
	_getCount = function(self, armyContainer)
		return armyContainer:getSelfArmyCount()
	end;
	
	_getArmyId = function(self, armyContainer, idx )
		return armyContainer:getSelfArmyId(idx)
	end;
})

local EnemyArmyChecker = ArmyChecker:extends({
	_getCount = function(self, armyContainer)
		return armyContainer:getEnemyArmyCount()
	end;
	
	_getArmyId = function(self, armyContainer, idx )
		return armyContainer:getEnemyArmyId(idx)
	end;
})

local HerosStateChecher = Class:extends({
	check = function(self, player)
		local heroMgr = player:getHeroMgr()
		for i=0, heroMgr:getHeroCount()-1 do
			local hero = heroMgr:getHeroByIdx(i)
			if (hero:getState() == HERO_STATE.EXPED) or (hero:getState() == HERO_STATE.DISPATCHFIELD) then
				if not self:_isInArmy(player, hero:getId()) then
					hero:setState(HERO_STATE.FREE)
					HeroAttrSender:sendHerosState(player, {hero:getId()})
					LOG('<error> invalid hero state, user:' .. player:getName())
				end
			end
		end	
	end;
	
	_isInArmy = function(self, player, heroId)
		local armyContainer = player:getArmyContainer()
		local selfArmyCount = armyContainer:getSelfArmyCount()
		for i=0, selfArmyCount-1 do
			local armyId = armyContainer:getSelfArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			for _, itheroId in ipairs(army.heros) do
				if itheroId == heroId then
					return true
				end
			end
		end
		return false
	end;	
})

InvalidDataChecker = Class:extends({
	init = function(self)
		self._selfArmyChecker = SelfArmyChecker:new()
		self._enemyArmyChecker = EnemyArmyChecker:new()
		self._herosStateChecker = HerosStateChecher:new()
	end;
	
	checkArmys = function(self, player)
		self._selfArmyChecker:check(player)
		self._enemyArmyChecker:check(player)
	end;
	
	checkHerosState = function(self, player)
		self._herosStateChecker:check(player)
	end;
}):new()




