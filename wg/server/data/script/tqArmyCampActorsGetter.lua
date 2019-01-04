--*******************************************************************************
--*******************************************************************************
ArmyCampActorsGetter = Class:extends({
	init = function(self)
		self.MAX_WALL_CNT = 3
	end;
	
	getSourceCamp = function(self, army)
		local sourcePlayer = ArmyPlayerGetter:getSourcePlayer(army)
		return self:getExpedCamp(sourcePlayer, army, FIGHT_CAMP.ATTACK)
	end;
	
	getTargetCamps = function(self, army)
		local targetPlayer = ArmyPlayerGetter:getTargetPlayer(army)
		if targetPlayer:getObjType() == OBJ_TYPE.NONE then
			return {{player=targetPlayer}}
		end
		
		local defenderCamps = {}
		if army.expedType == EXPED_TYPE.PAIQIAN then
			table.insert(defenderCamps, {player=targetPlayer})
		elseif targetPlayer:getObjType() == OBJ_TYPE.ROLE then
			self:createAllianceActorsCamps(defenderCamps, targetPlayer, army.expedType)
			self:createTowerActorsCamp(defenderCamps, targetPlayer, army.expedType)
			self:createDefArmyActorsCamp(defenderCamps, targetPlayer, army.expedType)
		else
			self:createDefArmyActorsCamp(defenderCamps, targetPlayer, army.expedType)
		end
		return defenderCamps
	end;
	
	createAllianceActorsCamps = function(self, defenderCamps, targetPlayer, expedType)
		local armyContainer = targetPlayer:getArmyContainer()
		local allianceCount = armyContainer:getAllianceArmyCount()
		for i=0, allianceCount-1, 1 do
			local armyId = armyContainer:getAllianceArmyId(i)
			local allianceArmy = app:getArmyMgr():getArmyById(armyId)
			local alliancePlayer = ArmyPlayerGetter:getSourcePlayer(allianceArmy)
			local allianceCamp = self:getAllianceDefenderCamp(defenderCamps, alliancePlayer, allianceArmy, expedType)
			if allianceCamp ~= nil then
				table.insert(defenderCamps, allianceCamp)
			end
		end
	end;
	
	getAllianceDefenderCamp = function(self, defenderCamps, alliancePlayer, allianceArmy, expedType)
		if (alliancePlayer == nil or allianceArmy == nil) then return nil end
		if (allianceArmy.state ~= ARMYDYN_STATE.DISPATCH) then return nil end
		if (expedType == EXPED_TYPE.TIAOXIN) then return nil end
		
		local allianceCamp = self:getExpedCamp(alliancePlayer, allianceArmy, FIGHT_CAMP.DEFEND)
		if (table.getn(allianceCamp.actors) == 0) then return nil end
		
		allianceCamp.isAlliacneArmy = true
		allianceCamp.armyId = allianceArmy.armyId
		
		return allianceCamp
	end;
	
	createTowerActorsCamp = function(self, defenderCamps, targetPlayer, expedType)
		if (expedType == EXPED_TYPE.TIAOXIN) then return end
		
		local towerCamp = {player=nil, lineupId=0, actors={}}
		
		local towerPlayer = targetPlayer:getArmyContainer():getTowerPlayer()
		local towerArmy = targetPlayer:getArmyContainer():getTowerArmy()
		
		towerCamp.player = towerPlayer
		towerCamp.lineupId = towerArmy.lineupId
		self:createHeroOrSoldierActors(towerPlayer, towerArmy, expedType, towerCamp.actors, FIGHT_CAMP.DEFEND)
		if (table.getn(towerCamp.actors) == 0) then return end
		
		self:createCityDefActors(targetPlayer, towerCamp.actors)
		table.insert(defenderCamps, towerCamp)
	end;
	
	createDefArmyActorsCamp = function(self, defenderCamps, targetPlayer, expedType)
		local defArmyCamp = {player=nil, lineupId=0, actors={}}
		
		local defArmy = targetPlayer:getArmyContainer():getCanFightDefArmy()
		defArmyCamp.player = targetPlayer
		defArmyCamp.lineupId = defArmy.lineupId
		self:createHeroOrSoldierActors(targetPlayer, defArmy, expedType, defArmyCamp.actors, FIGHT_CAMP.DEFEND)
		
		if not self:isHeroExped(expedType) then
			self:createWallActors(targetPlayer, defArmyCamp.actors)
			self:createCityDefActors(targetPlayer, defArmyCamp.actors)
		end
		
		table.insert(defenderCamps, defArmyCamp)
	end;
	
	getExpedCamp = function(self, sourcePlayer, army, campType)
		local camp = {player=sourcePlayer, lineupId=army.lineupId, actors={}}
		self:createHeroOrSoldierActors(sourcePlayer, army, army.expedType, camp.actors, campType)
		return camp
	end;
	
	createHeroOrSoldierActors = function(self, player, army, expedType, actors, camp)
		for pos, heroId in ipairs(army.heros) do
			local actor = self:createActor(expedType, player:getHeroMgr():getHeroById(heroId), pos, camp)
			
			if actor ~= nil then
				self:_changeActorAttrByPlayerStateEffect(player, actor, self:isHeroExped(expedType))
				table.insert(actors, actor)
			end
			
			if (actor ~= nil) and self:isHeroExped(expedType) then
				break
			end
		end
	end;
	
	_changeActorAttrByPlayerStateEffect = function(self, player, actor, isHeroExped)
		if actor == nil then return end
		if not player:isRole() then return end
		
		local buffState = player:getStateContainer():getEffectState(RES_EFF.ZHANSHENZHIGUANG)
		if (buffState ~= nil) and (not isHeroExped) then
			local buffAdd = math.max(1, (buffState:getEffectVal()-1)*5)/100
			
			local hurtVal = actor:getAttrVal(ATTR.HU)
			actor:setAttrVal(ATTR.HU, math.floor(hurtVal*(1+buffAdd)))
		
			local defVal = actor:getAttrVal(ATTR.DE)
			actor:setAttrVal(ATTR.DE, math.floor(defVal*(1+buffAdd)))
		end
	end;
	
	createWallActors = function(self, player, actors)
		local wall = player:getWall()
		local hp, def = wall:getHPAndDEF()
		if (hp == 0) then return end
		
		local wallActorData = WallActorData()
		wallActorData:setHPAndDEF(hp, def)
		for i=1, self.MAX_WALL_CNT, 1 do
			local wallActorProxy = WallActorProxy()
			wallActorProxy:setWallData(wallActorData)
			wallActorProxy:setCamp(FIGHT_CAMP.DEFEND)
			table.insert(actors, wallActorProxy)
		end
	end;
	
	createCityDefActors = function(self, player, actors)
		local cityDef = player:getCityDef()
		for defType=CITYDEF_TYPE.FIRST, CITYDEF_TYPE.LAST, 1 do
			local number = cityDef:getDefNumber(defType)
			if number > 0 then
				local cdActor = CityDefActor()
				cdActor:setCityDef(cityDef, defType)
				cdActor:setCamp(FIGHT_CAMP.DEFEND)
				table.insert(actors, cdActor)
			end
		end	
	end;
	
	createActor = function(self, expedType, hero, pos, camp)
		if hero == nil then
			return nil
		end
		
		local actor = self:allocActor(expedType)
		actor:setHero(hero)
		actor:setLineupPos(pos)
		actor:setCamp(camp)
		if actor:getFightUnitNumber() > 0 then
			return actor
		end
		
		return nil
	end;
	
	allocActor = function(self, expedType)
		if self:isHeroExped(expedType) then
			return HeroActor()
		else
			return SoldierActor()
		end
	end;
	
	isHeroExped = function(self, expedType)
		return (expedType == EXPED_TYPE.DANTIAO) or (expedType == EXPED_TYPE.TIAOXIN) or (expedType == EXPED_TYPE.ACT_TERRACE)
	end;
}):new()


