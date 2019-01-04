--*******************************************************************************
ExpedReturnTimerHdr = Class:extends({
	handle = function(self, armyId)
		if not self:initParams(armyId) then 
			return false
		end
		
		if not self:isValidState() then 
			return false
		end
		
		if not self:isArriveTime() then 
			return false
		end
		
		self:setHerosFreeState()
		self:subHerosHealth()
		self:removeArmy()
		
		return true
	end;
	
	initParams = function(self, armyId)
		self.army = app:getArmyMgr():getArmyById(armyId)
		if self.army == nil then
			LOG('<error> can not find return army')
			return false
		end
		
		self.sourcePlayer = ArmyPlayerGetter:getSourcePlayer(self.army)
		if self.sourcePlayer == nil then
			return false
		end
		
		self.targetPlayer = ArmyPlayerGetter:getTargetPlayer(self.army)
		if self.targetPlayer == nil then
			return false
		end
		
		return true
	end;
	
	isValidState = function(self)
		return self.army.state == ARMYDYN_STATE.RETURN
	end;
	
	isArriveTime = function(self)
		return (Util:getTime() + TIMER_DRT_TIME) >= self.army.stopTime
	end;
	
	setHerosFreeState = function(self)
		local sourceHeros = self:getSourceHeros()
		for _, hero in ipairs(sourceHeros) do
			hero:setState(HERO_STATE.FREE)
		end
		
		if not self.sourcePlayer:isRole() then
			return
		end	
		
		if not self.army.isMem then
			HeroAttrSender:sendHerosState(self.sourcePlayer, sourceHeros)
		end
	end;
	
	subHerosHealth = function(self)
		if not self.sourcePlayer:isRole() then
			return
		end
		
		if self.army.expedType == EXPED_TYPE.PAIQIAN then
			return
		end
		
		if SelfFieldChecker:isSelfField(self.sourcePlayer, self.targetPlayer) then
			return 
		end
		
		local sourceHeros = self:getSourceHeros()
		for _, hero in ipairs(sourceHeros) do
			local health = math.clamp(0, hero:getAttrVal(ATTR.HEALTH) - res_expedreturn_sub_health)
			hero:setAttrVal(ATTR.HEALTH, health)
			HeroAttrSender:sendAttrsByIds(self.sourcePlayer, hero, {ATTR.HEALTH})
		end
	end;
	
	removeArmy = function(self)
		app:getArmyMgr():removeArmy(self.sourcePlayer, self.targetPlayer, self.army.armyId)
	end;

	getSourceHeros = function(self)
		local sourceHeros = {}
		local heroMgr = self.sourcePlayer:getHeroMgr()
		for _, heroId in ipairs(self.army.heros) do
			local hero = heroMgr:getHeroById(heroId)
			if hero ~= nil then
				table.insert(sourceHeros, hero)
			end
		end
		
		return sourceHeros
	end;
})


