--*******************************************************************************
--*******************************************************************************
ArmyContainer = Class:extends({
	init = function(self, player)
		self.player = player
		self.military = self.player:getPersistVar().military
	end;
	
	setDefArmy = function(self, lineupId, heroIds)
		local defArmy = self.military.defArmy
		defArmy.lineupId = lineupId
		defArmy.heroCount = table.getn(heroIds)
		for i, heroId in ipairs(heroIds) do
			defArmy.heros[i-1] = heroId
		end
	end;
	
	getDefArmy = function(self)
		local defArmy = { lineupId=self.military.defArmy.lineupId, heros={0,0,0,0,0} }
		for i=1, self.military.defArmy.heroCount, 1 do
			defArmy.heros[i] = self.military.defArmy.heros[i-1]
		end
		return defArmy
	end;
	
	getCanFightDefArmy =  function(self)
		local defArmy = { lineupId=self.military.defArmy.lineupId, heros={0,0,0,0,0} }
		for i=1, self.military.defArmy.heroCount, 1 do
			local heroId = self.military.defArmy.heros[i-1]
			local hero = self.player:getHeroMgr():getHeroById(heroId)
			if (hero ~= nil) and (hero:isFree() or hero:isSteeling()) then
				defArmy.heros[i] = heroId
			end
		end
		return defArmy
	end;
	
	setAllTowerSoldiers = function(self, soldiers)
		for i, soldier in ipairs(soldiers) do
			self:setTowerSoldier(i, soldier)
		end
	end;
	
	setTowerSoldier = function(self, id, soldier)
		if (id < 1) or (id > MAX_TEAM_HERO_CNT) then
			return
		end
		
		local towerSoldiers = self.military.towerArmy.soldiers
		towerSoldiers[id-1].resid = soldier.resid
		towerSoldiers[id-1].number = soldier.number
	end;
	
	getTowerPlayer = function(self)
		local citys = self.player:getCitys()
		local towerLevel = citys:getBuildLevelByResId(FIXID.TOWERBUILD)
		return TowerPlayer(towerLevel, self.military.towerArmy, self.player:getAlliId(), self.player:getIcon())
	end;
	
	getTowerArmy = function(self)
		local towerArmy = {lineupId=FIXID.TOWERARMLINEUP, soldiers=self.military.towerArmy.soldiers, heros={0,0,0,0,0}}
		for i=1, MAX_TEAM_HERO_CNT, 1 do
			local soldier = towerArmy.soldiers[i-1]
			if (soldier.resid > 0) and (soldier.number > 0) then
				towerArmy.heros[i] = i
			end
		end
		
		return towerArmy
	end;
	
	getSelfArmyCount = function(self)
		return self.military.selfArmyCount
	end;
	
	getSelfArmyId = function(self, armyIdx) -- from 0 - n-1
		return self.military.selfArmyIds[armyIdx]
	end;
	
	getEnemyArmyCount = function(self, armyId)
		return self.military.enemyArmyCount
	end;
	
	getEnemyArmyId = function(self, armyIdx) -- from 0 - n-1
		return self.military.enemyArmyIds[armyIdx]
	end;
	
	getAllianceArmyCount = function(self)
		return self.military.alliArmyCount
	end;
	
	getAllianceArmyId = function(self, armyIdx) -- from 0 - n-1
		return self.military.alliArmyIds[armyIdx]
	end;
	
	removeArmyId = function(self, armyId)
		local armyTags = { {ids='selfArmyIds', cnt='selfArmyCount', sender='sendDelArmy'}
			,{ids='enemyArmyIds', cnt='enemyArmyCount', sender='sendDelArmy'}
			,{ids='alliArmyIds', cnt='alliArmyCount', sender='sendDelArmy'} }
			
		for _, armyTag in ipairs(armyTags) do
			Util:findC(self.military[armyTag.ids], self.military[armyTag.cnt], nil, armyId)
			if Util:getLastFindIdx() >= 0 then
				self.military[armyTag.cnt] = Util:removeElementC(self.military[armyTag.ids], self.military[armyTag.cnt], Util:getLastFindIdx())
				self.military[armyTag.ids][self.military[armyTag.cnt]] = 0
				MilitarySender[armyTag.sender](MilitarySender, self.player, armyId)
				break
			end
		end
	end;
	
	addSelfArmyId = function(self, armyId)
		if self.military.selfArmyCount == MAX_SELFARMY_CNT then
			log('beyond self army max count')
			return -1
		end
		
		self.military.selfArmyIds[self.military.selfArmyCount] = armyId
		self.military.selfArmyCount = self.military.selfArmyCount + 1
		
		MilitarySender:sendArmy(self.player, armyId)
		
		return armyId
	end;
	
	addEnemyArmyId = function(self, armyId)
		if self.military.enemyArmyCount == MAX_ENEMYARMY_CNT then
			log('beyond enemy army max count')
			return nil
		end
		
		self.military.enemyArmyIds[self.military.enemyArmyCount] = armyId
		self.military.enemyArmyCount = self.military.enemyArmyCount + 1
		
		MilitarySender:sendArmy(self.player, armyId)
		
		return armyId
	end;
	
	addAllianceArmyId = function(self, armyId)
		if self.military.alliArmyCount == MAX_ALLIARMY_CNT then
			log('beyond alli army max count')
			return nil
		end
		
		self.military.alliArmyIds[self.military.alliArmyCount] = armyId
		self.military.alliArmyCount = self.military.alliArmyCount + 1
		
		MilitarySender:sendArmy(self.player, armyId)
		
		return armyId
	end;
	
	fillSimpleHero = function(self, newHero, heroRes)
		newHero.id = heroRes.id
		newHero.name = heroRes.name
		newHero.level = heroRes.level
		newHero.attrCount = table.getn(heroRes.attrs)
		for attrIdx, attrRes in ipairs(heroRes.attrs) do
			local newAttr = newHero.attrs[attrIdx-1] -- c++ bind array , from zero index
			newAttr.attr = attrRes.attr
			newAttr.val = attrRes.val
			newAttr.unit = attrRes.unit
		end
		newHero.soldier.resid = heroRes.soldier.resid
		newHero.soldier.number = heroRes.soldier.number
		newHero.lineupPos = heroRes.lineupPos
	end;
	
	isSelfArmyFull = function(self)
		return self.military.selfArmyCount == MAX_SELFARMY_CNT
	end;
	
	isEnemyArmyFull = function(self)
		return self.military.enemyArmyCount == MAX_ENEMYARMY_CNT
	end;
	
	isAllianceArmyFull = function(self)
		return self.military.alliArmyCount == MAX_ALLIARMY_CNT
	end;
	
	hasSelfArmyId = function(self, armyId)
		return Util:findC(self.military.selfArmyIds, self.military.selfArmyCount, nil, armyId) ~= nil
	end;
	
	hasAllianceArmyId = function(self, armyId)
		return Util:findC(self.military.alliArmyIds, self.military.alliArmyCount, nil, armyId) ~= nil
	end;
})


