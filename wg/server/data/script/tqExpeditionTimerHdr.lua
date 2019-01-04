--*******************************************************************************
--*******************************************************************************
require('tqDefs')
require('tqFightHdr')
require('tqFightResult')


ExpeditionTimerHdr = Class:extends({
	handle = function(self, curArmy, attackerCamp, defenderCamps, observer)
		self:initParams(curArmy, attackerCamp, defenderCamps, observer)
		if not self:isArriveTime() then return false end
		if not self:isValidExpedState() then return false end
		
		self:expedComplete()
		return true
	end;
	
	initParams = function(self, curArmy, attackerCamp, defenderCamps, observer)
		self.fighted = FIGHT_FLAG.UNFIGHT
		self.army = curArmy
		self.arriveTime = self.army.stopTime
		self.attackerCamp = attackerCamp
		self.defenderCamps = defenderCamps
		self.observer_ = observer
	end;
	
	isArriveTime = function(self)
		return (Util:getTime() + TIMER_DRT_TIME) >= self.army.stopTime
	end;
	
	isValidExpedState = function(self)
		return self.army.state == ARMYDYN_STATE.GOTO
	end;	
	
	expedComplete = function(self)
	end;
	
	sendArmyState = function(self)
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineSourcePlayer(self.army), self.army.armyId)
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineTargetPlayer(self.army), self.army.armyId)
	end;	
	
	curArmyReturn = function(self)
		local sourcePlayer = self.attackerCamp.player
		local needTime = app:getArmyMgr():getArmyExpedNeedFullTime(self.army.armyId)
		local stopTime = self.arriveTime + needTime
		app:getArmyMgr():changeArmy(self.army.armyId, ARMYDYN_STATE.RETURN, self.fighted, stopTime)
	end;
	
	isAlliPlayerField = function(self)
		local sourcePlayer = self.attackerCamp.player
		if sourcePlayer:getAlliId() == 0 then
			return false
		end
		
		local targetPlayer = self:getDefenderPlayer()
		local grid = app:getCityMgr():getGridByPos( targetPlayer:getCityPos() )
		if grid == nil then
			return false
		end
		
		if grid.objType ~= OBJ_TYPE.FIELD then
			return false
		end
		
		if grid.roleId == 0 then
			return false
		end
		
		local roleGrid = app:getCityMgr():getGridByRoleId(grid.roleId)
		if roleGrid == nil then
			return false
		end
		
		return sourcePlayer:getAlliId() == roleGrid.allianceId
	end;
	
	isSelfFieldFull = function(self)
		local sourcePlayer = self.attackerCamp.player
		return sourcePlayer:getSelfField():isFull()
	end;
	
	getDefenderPlayer = function(self)
		return self:getDefenderCamp().player
	end;
	
	getDefenderCamp = function(self)
		local len = table.getn(self.defenderCamps)
		return self.defenderCamps[len]
	end;
	
	herosDispatchField = function(self)
		local heros = self:collectAttackerHeros()
		for _, hero in ipairs(heros) do
			hero:setState(HERO_STATE.DISPATCHFIELD)
		end
		
		HeroAttrSender:sendHerosState(self.attackerCamp.player, heros)
	end;
	
	collectAttackerHeros = function(self)
		return self:collectHeros(self.attackerCamp.actors)
	end;
	
	collectDefenderHeros = function(self)
		local defenderCamp = self:getDefenderCamp()
		return self:collectHeros(defenderCamp.actors)
	end;
	
	collectHeros = function(self, actors)
		local heros = {}
		for _, actor in ipairs(actors) do
			if actor.getHero ~= nil then
				local hero = actor:getHero()
				table.insert(heros, hero)
			end
		end
		return heros
	end;
})

DefaultExpeditionTimerHdr = ExpeditionTimerHdr:extends({
	handle = function(self, curArmy, attackerCamp, defenderCamps)
		self:initParams(curArmy, attackerCamp, defenderCamps, nil)
		self:curArmyReturn()
		self:sendArmyState()
		LOG('<warning>target is changed, army return! attacker:' .. attackerCamp.player:getRoleName())
		return true
	end;
})

ExpedFightTimerHdr = ExpeditionTimerHdr:extends({
	init = function(self)
		self.stream = FightEventStream()
		self.fightHdr = FightHdr(self.stream)
		self.fightResult = FightResult(self.stream)
		self.mapId = 9920003
		self.maxRoundCount = 40
		self.dropItem = DropItem()
		self.refreshCurFieldsHdr = RefreshCurFieldsHandler()
		self.giveUpSelfFieldHdr = GiveUpFieldHandler()
		self.isCanSendMail_ = true
		self.isCanSendFightDemoTip_ = true
	end;
	
	handle = function(self, curArmy, attackerCamp, defenderCamps, observer)
		self:initParams(curArmy, attackerCamp, defenderCamps, observer)
		self:_setMapId()
		if not self:isArriveTime() then return false end
		if not self:isValidExpedState() then return false end
		if not self:isCanFight() then
			self:curArmyReturn()
			self:sendArmyState()
			return false
		end

		self:innerInit()
		self:_beforeFight()
		self:fight()
		if self.fightRet == FIGHT_RESULT.ATTACKSUCC then
			self:_beforeAttackerSuccess()
			self:attackerSuccess()
			self:_afterAttackerSuccess()
		elseif self.fightRet == FIGHT_RESULT.ATTACKFAIL then
			self:_beforeAttackerFail()
			self:attackerFail()
			self:_afterAttackerFail()
		end
		self:expedComplete()
		return true
	end;
	
	_beforeFight = function(self)
	end;
	
	_beforeAttackerSuccess = function(self)
	end;
	
	_afterAttackerSuccess = function(self)
	end;
	
	_beforeAttackerFail = function(self)
	end;
	
	_afterAttackerFail = function(self)
	end;
	
	_setMapId = function(self)
		self.mapId = 9920003
		for _, actor in ipairs(self:getDefenderCamp().actors) do
			if actor:getType() == ACTOR_TYPE.HERO then
				self.mapId = 9920001
				break
			elseif actor:getType() == ACTOR_TYPE.WALL then
				self.mapId = 9920002
				break
			end
		end
	end;
	
	isCanFight = function(self)
		_no_implement_()
	end;
	
	innerInit = function(self)
		self.stream:clear()
		self.fightRet = FIGHT_RESULT.ATTACKSUCC
		self.attackerCamp.dropLogs = {}
		for _, defenderCamp in ipairs(self.defenderCamps) do
			defenderCamp.lossRes = {}
			defenderCamp.dropLogs = {}
		end
		
		self.fightResult:clear()
		self.fightResult:setAttackerCamp(self.attackerCamp)
		self.fightResult:setDefenderCamps(self.defenderCamps)		
		self.fightResult:setArmy(self.army)		
	end;
	
	fight = function(self)
		local fightRet = FIGHT_RESULT.ATTACKSUCC
		for _, defenderCamp in ipairs(self.defenderCamps) do
			fightRet = self.fightHdr:fight(self.mapId, self.attackerCamp, defenderCamp, self.maxRoundCount)
			defenderCamp.isFighted = true
			if (fightRet == FIGHT_RESULT.ATTACKFAIL) then break end
			self:resetCityDefs(defenderCamp)
		end
		self.fightRet = fightRet
		
		self.fightResult:setFightRet(self.fightRet)
		self.fighted = FIGHT_FLAG.FIGHTED
	end;
	
	resetCityDefs = function(self, defenderCamp)
		for _, actor in ipairs(defenderCamp.actors) do
			if (actor:getType() == ACTOR_TYPE.DEF) then
				actor:reset()
			end
		end
	end;

	attackerSuccess = function(self)
		self:attackerSuccessNotify()
		self:attackerGetDropItems()
		self:seizeResFromDefender()
		self:seizePopuFromDefender()
		self:addCountryHonourToAttacker()
		self:subDefenderCityBuildVal()
		self:subAttackerHerosHealthWhenAttackSuccess()
		self:subDefenderHerosHealthWhenAttackSuccess()
		self:addAttackerHerosMorale()
		self:subDefenderHerosMorale()
		self:addAlliFlagToDefender()		
		
		if self:isNeedCurArmyStayWhenAttackSuccess() then
			self:ownerArmyReturn()
			self:curArmyStay()
		else
			self:curArmyReturn()
		end
	end;
	
	attackerFail = function(self)
		self:subAttackerCityBuildVal()
		self:defenderGetDropItems()
		self:subAttackerHerosHealthWhenAttackFail()
		self:subDefenderHerosHealthWhenAttackFail()
		self:addDefenderHerosMorale()
		self:subAttackerHerosMorale()
		self:addCountryHonourToDefender()
		self:curArmyReturn()
	end;
	
	expedComplete = function(self)
		self:reviveHerosSoldier()
		self:addFightResultMail()
		self:allianceArmyReturn()
		self:refreshArmyHerosInfo()
		self:sendActorAttrs()
		self:sendArmyState()
		self:sendFightDemo()
	end;

	attackerSuccessNotify = function(self)
	end;
	
	attackerGetDropItems = function(self)
	end;
	
	defenderGetDropItems = function(self)
	end;
	
	seizeResFromDefender = function(self)
	end;
	
	seizePopuFromDefender = function(self)
	end;
	
	subDefenderCityBuildVal = function(self)
	end;
	
	subAttackerCityBuildVal = function(self)
	end;
	
	subAttackerHerosHealthWhenAttackSuccess = function(self)
		self:subAttackerHerosHealth(res_exped_low_expend_health)
	end;
	
	subAttackerHerosHealthWhenAttackFail = function(self)
		self:subAttackerHerosHealth(res_exped_high_expend_health)
	end;
	
	subAttackerHerosHealth = function(self, expendVal)
		local heros = self:collectAttackerHeros()
		for _, hero in ipairs(heros) do
			local health = hero:getAttrVal(ATTR.HEALTH) - expendVal
			hero:setAttrVal(ATTR.HEALTH, health)
		end
	end;
	
	subDefenderHerosHealthWhenAttackSuccess = function(self)
		self:subDefenderHerosHealth(res_exped_high_expend_health)
	end;
	
	subDefenderHerosHealthWhenAttackFail = function(self)
		self:subDefenderHerosHealth(res_exped_low_expend_health)
	end;
	
	subDefenderHerosHealth = function(self, expendVal)
		for _, defenderCamp in ipairs(self.defenderCamps) do
			for _, actor in ipairs(defenderCamp.actors) do
				if actor.getHero ~= nil then
					local hero = actor:getHero()
					local health = hero:getAttrVal(ATTR.HEALTH) - expendVal
					hero:setAttrVal(ATTR.HEALTH, health)
				end
			end
		end
	end;
	
	addAttackerHerosMorale = function(self)
	end;
	
	addCountryHonourToAttacker = function(self)
	end;
	
	addCountryHonourToDefender = function(self)
	end;
	
	subAttackerHerosMorale = function(self)
	end;
	
	addDefenderHerosMorale = function(self)
	end;
	
	subDefenderHerosMorale = function(self)
	end;
	
	isNeedCurArmyStayWhenAttackSuccess = function(self)
		return false;
	end;
	
	curArmyStay = function(self)
		local startTime = self.arriveTime
		app:getArmyMgr():changeArmy(self.army.armyId, ARMYDYN_STATE.DISPATCH, self.fighted, startTime)
		self:_removeArmyFromLastOwner()
		self:_lastOwnerGiveUpField()
		self:addToAttackerSelfFieldList()
		self:herosDispatchField()
	end;
	
	ownerArmyReturn = function(self)
	end;
	
	addAlliFlagToDefender = function(self)
	end;
	
	reviveHerosSoldier = function(self)
		self:reviveAttackerHerosSoldier()
		self:reviveDefendersHerosSoldier()
	end;
	
	reviveAttackerHerosSoldier = function(self)
		local attackerPlayer = self.attackerCamp.player
		if (not attackerPlayer:isRole()) then return end
		
		local revive = 0
		if (attackerPlayer:getState() == ROLE_STATE.YOUNG) then 
			revive =  young_revive_soldier_pre
		end
		
		revive = revive + self:_getAppendAttackerRevivePre()
		if revive == 0 then
			return
		end
		
		if revive > 1 then
			revive = 1
		end
		
		for _, actor in ipairs(self.attackerCamp.actors) do
			if actor:getType() == ACTOR_TYPE.SOLDIER then
				actor:setReviveNumber( actor:getLossNumber()*revive )
			end
		end
	end;
	
	reviveDefendersHerosSoldier = function(self)
		local partyDefenderCamp = self:getDefenderCamp()
		if ( not partyDefenderCamp.player:isRole() ) then 
			return 
		end
		
		local revivePre = defender_revive_soldier_pre
		if (partyDefenderCamp.player:getState() == ROLE_STATE.YOUNG) then 
			revivePre = young_revive_soldier_pre
		end
		
		self:reviveDefenderHerosSoldier(partyDefenderCamp, revivePre)
		
		local towerDefenderCamp = self:getTowerDefenderCamp()
		if towerDefenderCamp == nil then
			return
		end
		
		self:reviveDefenderHerosSoldier(towerDefenderCamp, revivePre)
		
		self:resetDefenderTowerSoldiers(partyDefenderCamp.player, towerDefenderCamp)
	end;
	
	_getAppendAttackerRevivePre = function(self)
		return 0
	end;
	
	reviveDefenderHerosSoldier = function(self, defenderCamp, revivePre)
		for _, actor in ipairs(defenderCamp.actors) do
			if actor:getType() == ACTOR_TYPE.SOLDIER then
				actor:setReviveNumber( actor:getLossNumber()*revivePre )
			end
		end
	end;
	
	getTowerDefenderCamp = function(self)
		if table.getn(self.defenderCamps) < 2 then
			return nil
		end
		
		local camp = self.defenderCamps[table.getn(self.defenderCamps) - 1]
		if camp.player:getObjType() ~= OBJ_TYPE.TOWER then
			return nil
		end
		
		return camp
	end;
	
	resetDefenderTowerSoldiers = function(self, partyDefenderPlayer, towerDefenderCamp)
		local armyContainer = partyDefenderPlayer:getArmyContainer()
		for _, actor in ipairs(towerDefenderCamp.actors) do
			if actor:getType() == ACTOR_TYPE.SOLDIER then
				armyContainer:setTowerSoldier(actor:getId(), actor:getHero():getSoldier())
			end
		end
	end;
	
	addFightResultMail = function(self)
		if self.isCanSendMail_ then
			self:addAttackerFightResultMail()
			self:addAlliDefenderFightResultMail()
			self:addDefenderFightResultMail()
		end
	end;
	
	addAttackerFightResultMail = function(self)
		local attackerPlayer = self.attackerCamp.player
		if (not attackerPlayer:isRole()) then return end
		
		local results = self.fightResult:getAllFightResults()
		for _, sresult in ipairs(results) do
			local mail = app:getMailMgr():addSysMail(attackerPlayer:getRoleName(),
				rstr.mail.title.fightresult, FIXID.FDEMO_MAILTEMP, sresult)
			MailSender:sendBriefMail(attackerPlayer, mail)
		end
	end;
	
	addAlliDefenderFightResultMail = function(self)
		for alliResultIdx, defenderCamp in ipairs(self.defenderCamps) do
			if defenderCamp.isFighted and defenderCamp.isAlliacneArmy and defenderCamp.player:isRole() then
				local sresult = self.fightResult:getAllianceFightResult(alliResultIdx)
				local mail = app:getMailMgr():addSysMail(defenderCamp.player:getRoleName(),
					rstr.mail.title.fightresult, FIXID.FDEMO_MAILTEMP, sresult)
				MailSender:sendBriefMail(defenderCamp.player, mail)
			end
		end
	end;
	
	addDefenderFightResultMail = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if (not defenderPlayer:isRole()) then return end
		
		local results = self.fightResult:getAllFightResults()
		for _, sresult in ipairs(results) do
			local mail = app:getMailMgr():addSysMail(defenderPlayer:getRoleName(),
				rstr.mail.title.fightresult, FIXID.FDEMO_MAILTEMP, sresult)
			MailSender:sendBriefMail(defenderPlayer, mail)
		end
	end;
	
	allianceArmyReturn = function(self)
		local targetPlayer = self:getDefenderPlayer()
		for _, defenderCamp in ipairs(self.defenderCamps) do
			if defenderCamp.isAlliacneArmy and self:isAllActorsDied(defenderCamp.actors) then
				local returnNeedtime = app:getArmyMgr():getArmyExpedNeedFullTime(defenderCamp.armyId)
				local stopTime = self.arriveTime + returnNeedtime
				app:getArmyMgr():changeArmy(defenderCamp.armyId, ARMYDYN_STATE.RETURN, self.fighted, stopTime)
				
				local allianceArmy = app:getArmyMgr():getArmyById(defenderCamp.armyId)
				MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineSourcePlayer(allianceArmy), allianceArmy.armyId)
				MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineTargetPlayer(allianceArmy), allianceArmy.armyId)
			end
		end		
	end;
	
	refreshArmyHerosInfo = function(self)
		self:refreshCurArmyHerosInfo()
		self:refreshAllianceArmyHerosInfo()
	end;
	
	refreshCurArmyHerosInfo = function(self)
		local sourceActors = self.attackerCamp.actors
		self:refreshSimpleHerosInfo(sourceActors, self.army)
	end;
	
	refreshAllianceArmyHerosInfo = function(self) 
		local targetPlayer = self:getDefenderPlayer()
		for _, defenderCamp in ipairs(self.defenderCamps) do
			if defenderCamp.isAlliacneArmy then
				local allianceActors = defenderCamp.actors
				local allianceArmy = app:getArmyMgr():getArmyById(defenderCamp.armyId)
				local isAlliArmyChanged = self:refreshSimpleHerosInfo(allianceActors, allianceArmy)
				if isAlliArmyChanged then
					local alliancePlayer = defenderCamp.player
					MilitarySender:sendArmy(alliancePlayer, allianceArmy.armyId)
					MilitarySender:sendArmy(targetPlayer, allianceArmy.armyId)
				end
			end
		end
	end;
	
	refreshSimpleHerosInfo = function(self, actors, army)
		if army == nil then
			return false
		end
		
		local isChanged = false
		for _, actor in ipairs(actors) do
			local hero =  actor:getHero()
			local simpleHero = Util:find(army.simpleHeros, 'id', hero:getId())
			local curNumber = hero:getSoldierNumber()
			if curNumber ~= simpleHero.soldier.number then
				simpleHero.soldier.number = curNumber
				isChanged = true
			end
		end
		return isChanged
	end;
	
	sendActorAttrs = function(self)
		self:sendAttackerActorAttrs()
		self:sendDefenderActorAttrs()
	end;
	
	sendAttackerActorAttrs = function(self)
		self:sendAttackerHerosAttrs()
	end;
	
	sendAttackerHerosAttrs = function(self)
		local attackerPlayer = self.attackerCamp.player
		if (not attackerPlayer:isRole()) then return end
		
		local attrs = {ATTR.HEALTH, ATTR.MO}
		local heros = self:collectAttackerHeros()
		for _, hero in ipairs(heros) do
			HeroAttrSender:sendCarrySoldier(attackerPlayer, hero)
			HeroAttrSender:sendAttrsByIds(attackerPlayer, hero, attrs)
		end
	end;
	
	sendDefenderActorAttrs = function(self)
		self:sendDefenderTowerAttrs()
		self:sendDefenderCityDefAttrs()
		self:sendDefenderHerosAttrs()
		self:sendDefenderAlliHerosAttrs()
	end;
	
	sendDefenderTowerAttrs = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if (not defenderPlayer:isRole()) then return end
		
		PlayerTowerSender:sendTowers(defenderPlayer)
	end;
	
	sendDefenderCityDefAttrs = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if (not defenderPlayer:isRole()) then return end
		
		PlayerCityDefSender:sendDefs(defenderPlayer)
	end;
	
	sendDefenderHerosAttrs = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if (not defenderPlayer:isRole()) then return end
		
		local heros = self:collectDefenderHeros()
		for _, hero in ipairs(heros) do
			HeroAttrSender:sendCarrySoldier(defenderPlayer, hero)
		end
	end;
	
	sendDefenderAlliHerosAttrs = function(self)
		for _, defenderCamp in ipairs(self.defenderCamps) do
			if defenderCamp.isAlliacneArmy then
				for _, actor in ipairs(defenderCamp.actors) do
					local hero = actor:getHero()
					HeroAttrSender:sendCarrySoldier(defenderCamp.player, hero)
				end
			end
		end
	end;
	
	sendFightDemo = function(self)
		self:sendAttackerFightDemo()
		self:sendDefenderFightDemo()
		self:sendAlliDefenderFightDemo()
	end;
	
	sendAttackerFightDemo = function(self)
		self:sendPartyPlayer( self.attackerCamp.player )
	end;
	
	sendDefenderFightDemo = function(self)
		self:sendPartyPlayer( self:getDefenderPlayer() )
	end;
	
	sendPartyPlayer = function(self, partyPlayer)
		if (not partyPlayer:isRole()) then return end
		
		local lastFightId = self.fightResult:getFightResultsCount()
		local saction, sresults = self.fightResult:getFightActionAndResultString()
		MilitarySender:sendFightDemo(partyPlayer, self.army.armyId, lastFightId, self.mapId, saction, sresults)
		
		self:sendAllFightDemoTips(partyPlayer)	
		self:observer_('fightDemo', {armyId=self.army.armyId, fightId=lastFightId})
	end;
	
	sendAlliDefenderFightDemo = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if (not defenderPlayer:isRole()) then return end	
		
		local saction, sresults = self.fightResult:getFightActionAndResultString()
		for fightId, defenderCamp in ipairs(self.defenderCamps) do
			if defenderCamp.isFighted and defenderCamp.isAlliacneArmy then
				local alliancePlayer = defenderCamp.player
				MilitarySender:sendFightDemo(alliancePlayer, self.army.armyId, fightId, self.mapId, saction, sresults)
				self:sendFightDemoTip(alliancePlayer, fightId)
			end
		end
	end;
	
	sendAllFightDemoTips = function(self, player)
		local resultCnt = self.fightResult:getFightResultsCount()
		for fightId=1, resultCnt, 1 do
			self:sendFightDemoTip(player, fightId)
		end
	end;
	
	sendFightDemoTip = function(self, player, fightId)
		if self.isCanSendFightDemoTip_ then
			local msg = string.gsub(rstr.fight.showdemo, '{0}:{1}', self.army.armyId..':'..fightId )
			WUtil:sendSysMsg(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msg )	
		end
	end;
	
	collectCanGetDropAttackerActors = function(self, fieldLevel)
		return self:collectCanGetDropActors(self.attackerCamp.actors, fieldLevel)
	end;
	
	collectCanGetDropDefenderActors = function(self, fieldLevel)
		local defenderCamp = self:getDefenderCamp()
		return self:collectCanGetDropActors(defenderCamp.actors, fieldLevel)
	end;
	
	collectCanGetDropActors = function(self, campActors, fieldLevel)
		local actors = {}
		for _, actor in ipairs(campActors) do
			self:insertCanGetDropActor(actors, actor, fieldLevel)
		end
		return actors
	end;
	
	insertCanGetDropActor = function(self, actors, actor, fieldLevel)
		if (actor.getHero == nil) then return end
		local hero = actor:getHero()
		if (hero == nil) then return end
		if ((hero:getLevel() - fieldLevel) >= hero_cangetdrop_leveldrt) then return end
		
		table.insert(actors, actor)
	end;
	
	isAllActorsDied = function(self, actors)
		for _, actor in ipairs(actors) do
			if (not actor:isDie()) then return false end
		end
		return true
	end;
	
	_removeArmyFromLastOwner = function(self)
		local fieldPlayer = self:getDefenderPlayer()
		if fieldPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then return end
		
		local ownerPlayer = fieldPlayer:getOwnerPlayer()
		ownerPlayer:getArmyContainer():removeArmyId(self.army.armyId)
	end;
	
	_lastOwnerGiveUpField = function(self)
		local fieldPlayer = self:getDefenderPlayer()
		if fieldPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then return end
		
		local ownerPlayer = fieldPlayer:getOwnerPlayer()
		self.giveUpSelfFieldHdr:handle(ownerPlayer, {fieldId=fieldPlayer:getGridId(), collectReason=COLLECT_REASON.BEATTACKED})
		self:_sendLastOwnerGiveUpMail(ownerPlayer, fieldPlayer:getGridId())
	end;
	
	_sendLastOwnerGiveUpMail = function(self, ownerPlayer, gridId)
		local pos = app:getCityMgr():getPosByGridId(gridId)
		local attackerPos = self.attackerCamp.player:getCityPos()
		local content = string.format(rstr.mail.content.beAttackedGiveUpField, 
			pos.x, pos.y, self.attackerCamp.player:getRoleName(), attackerPos.x, attackerPos.y)
		local mail = app:getMailMgr():addSysMail(ownerPlayer:getRoleName(), rstr.mail.title.beAttackedGiveUpField, FIXID.COMM_SYS_MAILTEMP, content, nil)
		MailSender:sendBriefMail(ownerPlayer, mail)
	end;
	
	addToAttackerSelfFieldList = function(self)
		local fieldPlayer = self:getDefenderPlayer()
		
		local grid = app:getCityMgr():getGridByPos(fieldPlayer:getCityPos())
		if grid == nil then
			LOG('<error> 334htr45459')
			return
		end
		
		app:getCityMgr():occupyFieldGrid(self.attackerCamp.player, grid)
		
		local selfFieldContainer = self.attackerCamp.player:getSelfField()
		selfFieldContainer:addField(grid)
		PlayerSelfFieldSender:sendSelfField(self.attackerCamp.player, grid.gridId)
		self.refreshCurFieldsHdr:handle(self.attackerCamp.player)
	end;
})

ExpedPVETimerHdr = ExpedFightTimerHdr:extends({
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self:collectCanGetDropAttackerActors(res.level)
		DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.taofadrop)
		self.attackerCamp.dropLogs = DropItemUtil:getLog()
		self:observer_('drop', DropItemUtil:getDrops())
	end;
})

ExpedCopyFieldFightPlayerTimerHdr = ExpedFightTimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	defenderGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = self.attackerCamp.player:getRes()
		local actors = self:collectCanGetDropDefenderActors(res.level)
		DropItemUtil:handle(defenderPlayer, actors, nil, res.fieldtaofadrop)
		self:getDefenderCamp().dropLogs = DropItemUtil:getLog()
	end;
})

ExpedPVPTimerHdr = ExpedFightTimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	addAttackerHerosMorale = function(self)
		self:addAttackerHerosMoraleComm(res_exped_attacker_succ_addmo)
	end;
	
	subAttackerHerosMorale = function(self)
		self:addAttackerHerosMoraleComm(res_exped_attacker_fail_submo)
	end;
	
	addAttackerHerosMoraleComm = function(self, addVal)
		local heros = self:collectAttackerHeros()
		for _, hero in ipairs(heros) do
			local morale = hero:getAttrVal(ATTR.MO) + addVal
			hero:setAttrVal(ATTR.MO, morale)
		end
	end;
	
	addDefenderHerosMorale = function(self)
		self:addDefenderHerosMoraleComm(res_exped_defender_succ_addmo)
	end;
	
	subDefenderHerosMorale = function(self)
		self:addDefenderHerosMoraleComm(res_exped_defender_fail_submo)
	end;
	
	addDefenderHerosMoraleComm = function(self, addVal)
		for _, defenderCamp in ipairs(self.defenderCamps) do
			for _, actor in ipairs(defenderCamp.actors) do
				if actor.getHero ~= nil then
					local hero = actor:getHero()
					local morale = hero:getAttrVal(ATTR.MO) + addVal
					hero:setAttrVal(ATTR.MO, morale)
				end
			end
		end
	end;
	
	addCountryHonourToAttacker = function(self)
		self:_addCountryHonourr(self.attackerCamp.player)
	end;
	
	addCountryHonourToDefender = function(self)
		self:_addCountryHonourr(self:getDefenderPlayer())
	end;
	
	_addCountryHonourr = function(self, winner)
		if not self:_isCountryFight() then return end
		
		local honour = self:_getHonourNumber()
		if honour == 0 then return end

		local attacker = self.attackerCamp.player		
		local defender = self:getDefenderPlayer()
		if math.abs(attacker:getLevel() - defender:getLevel()) >= res_get_honor_differ_level then
			return
		end	
		
		local defender = self:getDefenderPlayer()
		if defender:getTodayHasHonor() == 0 then
			return
		end

		local canHonour = 0
		if attacker == winner then
			if attacker:getTodayGetHonor() == res_today_max_get_honor then
				return
			end
			canHonour = math.min(defender:getTodayHasHonor(), res_today_max_get_honor - attacker:getTodayGetHonor(), honour)
			attacker:addTodayGetHonor(canHonour)
			defender:subTodayHasHonor(canHonour)
		else
			canHonour = math.min(defender:getTodayHasHonor(), honour)
			defender:subTodayHasHonor(canHonour)
		end
		
		winner:setCityHonor(winner:getCityHonor() + canHonour)
		RoleBaseSender:send(winner, {'cityhonor'})
		if self:getDefenderCamp().lossRes == nil then
			self:getDefenderCamp().lossRes = {}
		end
		self:getDefenderCamp().lossRes.honor = canHonour
	end;
	
	_isCountryFight = function(self)
		local attacker = self.attackerCamp.player
		local defender = self:getDefenderPlayer()
		if not attacker:isRole() or not defender:isRole() then
			return false
		end		
		return attacker:getCityId() ~= defender:getCityId()
	end;
	
	_getHonourNumber = function(self)
		return 0
	end;
})

ExpedPVPTiaoxinTimerHdr = ExpedPVPTimerHdr:extends({
	_beforeFight = function(self)
		TaskFinisher:trigerTask(self.attackerCamp.player, TASK_FINISH_TYPE.PROVOKE_PLAYER)
	end;

	_getHonourNumber = function(self)
		return res_tiaoxin_honor
	end;
})

ExpedPVPTaofaTimerHdr = ExpedPVPTimerHdr:extends({
	seizeResFromDefender = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local defenderCityRes =  defenderPlayer:getCityRes()
		
		local canSeizeRes = self:getCanSeizeRes()
		self:subDefenderCityRes(canSeizeRes)
		self:addAttackerCityRes(canSeizeRes)
		self:setDefenderLossRes(canSeizeRes)
		
		CommResSender:send(defenderPlayer, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON})
		
		local attackerPlayer = self.attackerCamp.player
		CommResSender:send(attackerPlayer, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON})
	end;
	
	getCanSeizeRes = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local defenderCityRes =  defenderPlayer:getCityRes()
		
		local curMoney = defenderCityRes:getMoney()
		local curFood = defenderCityRes:getFood()
		local curWood = defenderCityRes:getWood()
		local curStone = defenderCityRes:getStone()
		local curIron = defenderCityRes:getIron()
		
		local protectNumber = self:getProtectResNumber(defenderPlayer)
		
		local canGetMaxMoney = math.floor(curMoney/10)
		local canGetMaxFood = math.max(0, math.floor( (curFood - protectNumber) / 5 ))
		local canGetMaxWood = math.max(0, math.floor( (curWood - protectNumber) / 5 ))
		local canGetMaxStone = math.max(0, math.floor( (curStone - protectNumber) / 5 ))
		local canGetMaxIron = math.max(0, math.floor( (curIron - protectNumber) / 5 ))
		local canGetMaxTotalres = canGetMaxMoney + canGetMaxFood + canGetMaxWood + canGetMaxStone + canGetMaxIron 
		
		local attakcerArmyCap = self:getArmyCarryResCap(self.attackerCamp)
		
		local canGetPre = math.min(1, attakcerArmyCap/canGetMaxTotalres)
		local canGetMoney = math.floor(canGetPre*canGetMaxMoney)
		local canGetFood = math.floor(canGetPre*canGetMaxFood)
		local canGetWood = math.floor(canGetPre*canGetMaxWood)
		local canGetStone = math.floor(canGetPre*canGetMaxStone)
		local canGetIron = math.floor(canGetPre*canGetMaxIron)
		
		return {money=canGetMoney, food=canGetFood, wood=canGetWood, stone=canGetStone, iron=canGetIron}
	end;
	
	subDefenderCityRes = function(self, canSeizeRes)
		local defenderCityRes =  self:getDefenderPlayer():getCityRes()
		defenderCityRes:subMoney(canSeizeRes.money)
		defenderCityRes:subFood(canSeizeRes.food)
		defenderCityRes:subWood(canSeizeRes.wood)
		defenderCityRes:subStone(canSeizeRes.stone)
		defenderCityRes:subIron(canSeizeRes.iron)
	end;
	
	addAttackerCityRes = function(self, canSeizeRes)
		local attackerCityRes = self.attackerCamp.player:getCityRes()
		attackerCityRes:addMoney(canSeizeRes.money)
		attackerCityRes:addFood(canSeizeRes.food)
		attackerCityRes:addWood(canSeizeRes.wood)
		attackerCityRes:addStone(canSeizeRes.stone)
		attackerCityRes:addIron(canSeizeRes.iron)
	end;
	
	setDefenderLossRes = function(self, canSeizeRes)
		local defenderCamp = self:getDefenderCamp()
		defenderCamp.lossRes.money = canSeizeRes.money
		defenderCamp.lossRes.food = canSeizeRes.food
		defenderCamp.lossRes.wood = canSeizeRes.wood
		defenderCamp.lossRes.stone = canSeizeRes.stone
		defenderCamp.lossRes.iron = canSeizeRes.iron
	end;
	
	getProtectResNumber = function(self, player)
		return player:getCitys():getBuildsLevelResSum(FIXID.DIJIAOBUILD, 'addresprotectnum')
	end;
	
	getArmyCarryResCap = function(self, camp)
		local carryResCap = 0
		for _, actor in ipairs(camp.actors) do
			local hero = actor:getHero()
			carryResCap = carryResCap + hero:getAttrVal(ATTR.FC)*320
		end
		return carryResCap
	end;
	
	_getHonourNumber = function(self)
		return res_taofa_honor
	end;
})

ExpedPVPCuihuiTimerHdr = ExpedPVPTaofaTimerHdr:extends({
	seizePopuFromDefender = function(self)
		local defenderCityRes =  self:getDefenderPlayer():getCityRes()
		local curPopu = defenderCityRes:getIdlePopu()
		local canGetPopu = math.floor(curPopu/5)
		defenderCityRes:setIdlePopu(curPopu - canGetPopu)
		
		local defenderCamp = self:getDefenderCamp()
		defenderCamp.lossRes.popu = canGetPopu
		
		local attackerCityRes = self.attackerCamp.player:getCityRes()
		attackerCityRes:setIdlePopu(attackerCityRes:getIdlePopu() + canGetPopu)
		
		PopuSender:send(self:getDefenderPlayer(), {'idle'})
		PopuSender:send(self.attackerCamp.player, {'idle'})
	end;
	
	subDefenderCityBuildVal = function(self)
		local defenderCityRes =  self:getDefenderPlayer():getCityRes()
		local defMaxValue = defenderCityRes:getBuildVal()

		local dayCanLostMaxVal = math.max(defMaxValue*0.3,  8000) - defenderCityRes:getTodayLostedBuildVal()
		if  dayCanLostMaxVal <= 0 then
			return 
		end
		
		local canLost = self:getHurtBuildValFactor()*self:getAttackerSoldierNumber()
		local factCanLost = math.min(canLost, dayCanLostMaxVal)
		
		defenderCityRes:setBuildHurtValAndState(defenderCityRes:getBuildHurtVal() + factCanLost)
		defenderCityRes:setTodayLostedBuildVal(defenderCityRes:getTodayLostedBuildVal() + factCanLost)
		CityBuildValSender:send(self:getDefenderPlayer(), {'hurtval'})
		
		self:_handleAllianceHonour(factCanLost)
	end;
	
	subAttackerCityBuildVal = function(self)
	end;
	
	getHurtBuildValFactor = function(self)
		local defenderCityRes =  self:getDefenderPlayer():getCityRes()
		local defMaxValue = defenderCityRes:getBuildVal()
		
		local attackerCityRes = self.attackerCamp.player:getCityRes()
		local attMaxValue = attackerCityRes:getBuildVal()
		
		return math.atan((attMaxValue - defMaxValue)/(attMaxValue + defMaxValue))/3.14159265 + 1
	end;
	
	getAttackerSoldierNumber = function(self)
		local soldierNumber = 0
		for _, actor in ipairs(self.attackerCamp.actors) do
			local hero = actor:getHero()
			soldierNumber = soldierNumber + hero:getSoldierNumber()
		end
		return soldierNumber
	end;
	
	addAlliFlagToDefender = function(self)
		local attackerPlayer = self.attackerCamp.player
		local targetPlayer = self:getDefenderPlayer()
		targetPlayer:setEnemyAlliId( attackerPlayer:getAlliId() )
	end;
	
	_handleAllianceHonour = function(self, hurtBuildVal)
		local attackerAlliance = app:getAlliMgr():getAlliById(self.attackerCamp.player:getAlliId())
		local defenderAlliance = app:getAlliMgr():getAlliById(self:getDefenderPlayer():getAlliId())
		if attackerAlliance:isNull() or defenderAlliance:isNull() then
			return false
		end
		
		local addHonour = math.floor(hurtBuildVal/1000)
		attackerAlliance:addHonour(addHonour)
		defenderAlliance:subHonour(addHonour)
		
		local attackerName = self.attackerCamp.player:getRoleName()
		local defenderName = self:getDefenderPlayer():getRoleName()
		app:getAlliMgr():addAllianceEvent(attackerAlliance, 'pkAttacker', {attacker=attackerName, defender=defenderName, addHonour=addHonour} )
		app:getAlliMgr():addAllianceEvent(defenderAlliance, 'pkDefender', {attacker=attackerName, defender=defenderName, subHonour=addHonour} )
	end;
	
	_getHonourNumber = function(self)
		return res_cuihui_honor
	end;
})
	
ExpedPaiqianTimerHdr = ExpeditionTimerHdr:extends({
	expedComplete = function(self)
		if self:isCanPaiqian() then
			self:curArmyStay()
		else
			self:curArmyReturn()
		end
		self:sendArmyState()
	end;
	
	isCanPaiqian = function(self)
		_no_implement_()
	end;

	curArmyStay = function(self)
		local startTime = self.arriveTime
		app:getArmyMgr():changeArmy(self.army.armyId, ARMYDYN_STATE.DISPATCH, self.fighted, startTime)
		self:herosDispatchField()
	end;
})

ExpedFightCopyFieldTimerHdr = ExpedPVETimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	_beforeFight = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		TaskFinisher:trigerTask(self.attackerCamp.player, TASK_FINISH_TYPE.TAOFA_COPYFIELD, res.id)
	end;
	
	attackerSuccessNotify = function(self)
		self.attackerCamp.player:getsuccCopyFields():insert( self:getDefenderPlayer():getRoleId() )
		MilitarySender:sendSuccCopyFields(self.attackerCamp.player)
	end;
})

ExpedFightActTowerTimerHdr = ExpedPVETimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self.attackerCamp.actors
		
		
		local exp2 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2)
		local exp3 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3)
		local vipVal = self.attackerCamp.player:getVipEffectVal(VIP_EFF.ADD_TOWER_EXP_GET)
		if vipVal > 0 then
			vipVal = (1 + vipVal/100)
		end
		local heroExpMulti = math.max(1, exp2 + exp3 + vipVal )
		
		DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.taofadrop, {heroExp={mult=heroExpMulti}})
		self.attackerCamp.dropLogs = DropItemUtil:getLog()
		self:observer_('drop', DropItemUtil:getDrops())
	end;	
	
	_beforeFight = function(self)
		self.attackerFightCap = self:_getActorsFightCap(self.attackerCamp.actors)
		self.defenderFightCap = self:_getActorsFightCap(self:getDefenderCamp().actors)
		self.isCanSendMail_ = false
	end;
	
	_afterAttackerSuccess = function(self)
		local leftFightCap = self:_getActorsFightCap(self.attackerCamp.actors)
		local per = leftFightCap / self.attackerFightCap
		self:observer_('fightResult', 5 + self:_getFightResult(per))
		self:observer_('isSuccess', true)
	end;
	
	_afterAttackerFail = function(self)
		local leftFightCap = self:_getActorsFightCap(self:getDefenderCamp().actors)
		local per = leftFightCap / self.defenderFightCap
		self:observer_('fightResult', self:_getFightResult(per))
		self:observer_('isSuccess', false)
	end;	
	
	_getAppendAttackerRevivePre = function(self)
		local per = 0.8
		local stateContainer = self.attackerCamp.player:getStateContainer()
		local effects = {RES_EFF.TOWER_RECOVER_SOLDIER, RES_EFF.TOWER_RECOVER_SOLDIER_BYACT}
		for _, effectId in ipairs(effects) do
			local state = stateContainer:getEffectState(effectId)
			if state ~= nil then
				per = per + state:getEffectVal()/100
			end
		end
		return per
	end;
	
	_getActorsFightCap = function(self, actors)
		local cap = 0
		for _, actor in ipairs(actors) do
			cap = cap + HeroAttrHelper:getFCAttrVal(actor:getHero())
		end
		return cap
	end;
	
	_getFightResult = function(self, per)
		local fightResult = 0
		if per <= 0.2 then
			fightResult = 0
		elseif per <= 0.4 then
			fightResult = 1
		elseif per <= 0.6 then
			fightResult = 2
		elseif per <= 0.8 then
			fightResult = 3
		else
			fightResult = 4
		end
		return fightResult
	end;
})

ExpedFightWorldBossTimerHdr = ExpedPVETimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	_setMapId = function(self)
		self.mapId = 9920004
	end;
	
	_beforeFight = function(self)
		self.isCanSendMail_ = false
		self.isCanSendFightDemoTip_ = false
		self:_resetAttackerAttr()
		self:_resetDefenderAttr()
	end;	
	
	_resetAttackerAttr = function(self)
		local guwuLevel = self.attackerCamp.player:getTask():getWorldBoss():getGuwuLevel()
		local actors = self.attackerCamp.actors
		for _, actor in ipairs(actors) do
			local attrHU = actor:getAttrVal(ATTR.HU)*(1 + guwuLevel*0.1)
			actor:setAttrVal(ATTR.HU, attrHU)
			
			local attrDE = actor:getAttrVal(ATTR.DE)*(1 + guwuLevel*0.1)
			actor:setAttrVal(ATTR.DE, attrDE)
			
			actor:setAttackRange(1000000)
		end
	end;
	
	_resetDefenderAttr = function(self)
		local actors = self:getDefenderCamp().actors
		for _, actor in ipairs(actors) do
			actor:setSoldierModelResId(150300)
			actor:setAttackRange(1000000)
			actor:getHero():setIcon(300)
		end
	end;
	
	_beforeAttackerSuccess = function(self)
		self:_calcTotalHurt()
	end;
	
	_beforeAttackerFail = function(self)
		self:_calcTotalHurt()
	end;
	
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self.attackerCamp.actors
		
		if res.taofadrop > 0 then
			DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.taofadrop)
			self.attackerCamp.dropLogs = DropItemUtil:getLog()
			self:observer_('drop', DropItemUtil:getDrops())
		end
	end;	
	
	_afterAttackerSuccess = function(self)
		self:observer_('fightResult', self._hurtHp)
		self:observer_('isSuccess', true)
	end;
	
	_afterAttackerFail = function(self)
		self:observer_('fightResult', self._hurtHp)
		self:observer_('isSuccess', false)
	end;	
	
	_getAppendAttackerRevivePre = function(self)
		return 1.0
	end;
	
	_calcTotalHurt = function(self)
		self._hurtHp = 0
		local actors = self:getDefenderCamp().actors
		for _, actor in ipairs(actors) do
			self._hurtHp = self._hurtHp +(actor:getAttrVal(ATTR.MHP) - actor:getAttrVal(ATTR.HP))
		end	
		self._hurtHp = math.floor(self._hurtHp)
	end;
})

ExpedFightActTerraceTimerHdr = ExpedPVETimerHdr:extends({
	isCanFight = function(self)
		return true
	end;
	
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self.attackerCamp.actors
		
		local if2 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2)
		local if3 = app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3)
		local iforceMulti = math.max(1, if2 + if3 )
		
		DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.dantiaodrop, {heroIForce={mult=iforceMulti}})
		self.attackerCamp.dropLogs = DropItemUtil:getLog()
	end;
	
	_beforeFight = function(self)
		self.attackerHP_ = self.attackerCamp.actors[1]:getAttrVal(ATTR.HP)
		self.isCanSendMail_ = false
	end;
	
	_afterAttackerSuccess = function(self)
		local leftPer = self.attackerCamp.actors[1]:getAttrVal(ATTR.HP) / self.attackerHP_
		self:observer_('fightResult',  self:_getFightResult(leftPer))
		self:observer_('isSuccess', true)
	end;
	
	_afterAttackerFail = function(self)
		self:observer_('fightResult', 0)
		self:observer_('isSuccess', false)
	end;	
	
	_getFightResult = function(self, per)
		local fightResult = 0
		if per <= 0.2 then
			fightResult = 1
		elseif per <= 0.4 then
			fightResult = 2
		elseif per <= 0.6 then
			fightResult = 3
		elseif per <= 0.8 then
			fightResult = 4
		else
			fightResult = 5
		end
		return fightResult
	end;
})

ExpedFightFieldTimerHdr = ExpedPVETimerHdr:extends({
	isCanFight = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if defenderPlayer:getObjType() ~= OBJ_TYPE.FIELD then
			LOG('<warning>target is not field! objType:' .. defenderPlayer:getObjType() .. ', attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		if SelfFieldChecker:isSelfField(self.attackerCamp.player, defenderPlayer) then
			LOG('<warning>target is self field! gridId:' .. defenderPlayer:getRoleId() .. ', attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		if self:isAlliPlayerField() then
			LOG('<warning>target is alli field! gridId:' .. defenderPlayer:getRoleId() .. ', attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		return true
	end;
})

ExpedPaiqianFieldTimerHdr = ExpedPaiqianTimerHdr:extends({
	isCanPaiqian = function(self)
		if not SelfFieldChecker:isSelfField(self.attackerCamp.player, self:getDefenderPlayer()) then
			return false
		end
		
		local sourcePlayer = self.attackerCamp.player
		local targetPlayer = self:getDefenderPlayer()
		if SelfFieldChecker:hasSelfArmyInField(sourcePlayer, targetPlayer) then
			return false
		end
		
		return true
	end;
})

ExpedPaiqianPlayerTimerHdr = ExpedPaiqianTimerHdr:extends({
	isCanPaiqian = function(self)
		if not self:isSameAlliance() then
			return false
		end
		
		if self:isPaiqianArmysFull() then
			return false
		end
		
		return true
	end;
	
	isSameAlliance = function(self)
		local ownerPlayer = self.attackerCamp.player
		if ownerPlayer:getAlliId() == 0 then
			return false
		end
		
		local targetPlayer = self:getDefenderPlayer()
		return ownerPlayer:getAlliId() == targetPlayer:getAlliId()
	end;
	
	isPaiqianArmysFull = function(self)
		local paiqianArmyCnt = 0
		local targetPlayer = self:getDefenderPlayer()
		local armyContainer = targetPlayer:getArmyContainer()
		local alliArmyCnt = armyContainer:getAllianceArmyCount()
		for i=1, alliArmyCnt, 1 do
			local armyId = armyContainer:getAllianceArmyId(i-1)
			local army = app:getArmyMgr():getArmyById(armyId)
			if (army ~= nil) and (army.state == ARMYDYN_STATE.DISPATCH) then
				paiqianArmyCnt = paiqianArmyCnt + 1
			end
		end
		return paiqianArmyCnt == MAX_PAIQIAN_ALLIARMY_CNT
	end;
})

ExpedDantiaoFieldTimerHdr = ExpedFightFieldTimerHdr:extends({
	_beforeFight = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		TaskFinisher:trigerTask(self.attackerCamp.player, TASK_FINISH_TYPE.DANTIAO_FIELD, res.id%1000)
	end;
	
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self:collectCanGetDropAttackerActors(res.level)
		DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.dantiaodrop)
		self.attackerCamp.dropLogs = DropItemUtil:getLog()
	end;
})

ExpedZhanlingFieldTimerHdr = ExpedFightFieldTimerHdr:extends({
	attackerGetDropItems = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		local actors = self:collectCanGetDropAttackerActors(res.level)
		DropItemUtil:handle(self.attackerCamp.player, actors, nil, res.zhanlingdrop)
		self.attackerCamp.dropLogs = DropItemUtil:getLog()
	end;
	
	isCanFight = function(self)
		if not ExpedFightFieldTimerHdr.isCanFight(self) then
			return false
		end
		
		if self:isSelfFieldFull() then
			LOG('<warning>self field full! attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		return true
	end;
	
	isNeedCurArmyStayWhenAttackSuccess = function(self)
		return true
	end;
	
	_afterAttackerSuccess = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local res = defenderPlayer:getRes()
		TaskFinisher:trigerTask(self.attackerCamp.player, TASK_FINISH_TYPE.ZHANLING_FIELD, res.id%1000)
	end;
})

ExpedDantiaoOwnerFieldTimerHdr = ExpedPVPTimerHdr:extends({
	isCanFight = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		if defenderPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then
			LOG('<warning>target is not owner field! attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		if SelfFieldChecker:isSelfField(self.attackerCamp.player, defenderPlayer) then
			LOG('<warning>target is self field! gridId:' .. defenderPlayer:getRoleId() .. ', attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		if self:isAlliPlayerField() then
			LOG('<warning>target is alli field! gridId:' .. defenderPlayer:getRoleId() .. ', attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		return true
	end;

	seizeResFromDefender = function(self)
		local defenderCamp = self:getDefenderCamp()
		if table.getn(defenderCamp.actors) == 0 then
			return
		end
		
		local defenderPlayer = self:getDefenderPlayer()
		local ownerPlayer = defenderPlayer:getOwnerPlayer()
		if ownerPlayer:getSelfField():getStartTime( defenderPlayer:getGridId() ) == 0 then
			return
		end
		
		if not self:isCanSeizeRes() then
			return 
		end
		
		FieldCollector:setParam(defenderPlayer:getGridId(), self.arriveTime)
		
		local attackerPlayer = self.attackerCamp.player
		self:seizeCommRes(FieldCollector:getCommRes(), attackerPlayer, ownerPlayer)
		self:seizeItems(FieldCollector:getItems(), attackerPlayer, ownerPlayer)
		
		ownerPlayer:getSelfField():startCollect(defenderPlayer:getGridId(), self.arriveTime)
	end;
	
	seizeCommRes = function(self, ress, attackerPlayer, ownerPlayer)
		local seizeFood = math.floor(ress.food*res_fight_ownerfield_getres_ratio/100)
		local seizeWood = math.floor(ress.wood*res_fight_ownerfield_getres_ratio/100)
		local seizeStone = math.floor(ress.stone*res_fight_ownerfield_getres_ratio/100)
		local seizeIron = math.floor(ress.iron*res_fight_ownerfield_getres_ratio/100)
		
		attackerPlayer:getCityRes():addFood(seizeFood)
		attackerPlayer:getCityRes():addWood(seizeWood)
		attackerPlayer:getCityRes():addStone(seizeStone)
		attackerPlayer:getCityRes():addIron(seizeIron)
		
		local leftFood = ress.food - seizeFood
		local leftWood = ress.wood - seizeWood
		local leftStone = ress.stone - seizeStone
		local leftIron = ress.iron - seizeIron
		
		ownerPlayer:getCityRes():addFood(leftFood)
		ownerPlayer:getCityRes():addWood(leftWood)
		ownerPlayer:getCityRes():addStone(leftStone)
		ownerPlayer:getCityRes():addIron(leftIron)
	end;
	
	seizeItems = function(self, totalItems, attackerPlayer, ownerPlayer)
		local seizeItems, leftItems = self:calcSeizeItems(totalItems)
		self:addItems(attackerPlayer, seizeItems)
		self:addItems(ownerPlayer, leftItems)
	end;
	
	calcSeizeItems = function(self, totalItems)
		local itemsIds = {}
		for id, number in pairs(totalItems) do
			for i=1, number, 1 do
				table.insert(itemsIds, id)
			end
		end
		
		local seizeItems = {}
		local totalNumber = table.getn(itemsIds)
		local seizeNumber = math.floor(totalNumber*res_fight_ownerfield_getres_ratio/100)
		for i=1, seizeNumber, 1 do	
			local idx = math.random( table.getn(itemsIds) )
			local id = itemsIds[idx]
			if seizeItems[id] == nil then
				seizeItems[id] = 0
			end
			seizeItems[id] = seizeItems[id] + 1
			
			totalItems[id] = totalItems[id] - 1
			if totalItems[id] == 0 then
				table.remove(itemsIds, idx)
				totalItems[id] = nil
			end
		end
		
		return seizeItems, totalItems
	end;
	
	addItems = function(self, player, items)
		if not player:isRole() then
			return false
		end
		
		local listItems = FieldCollector:dictItemsToListItems(items)
		local rawItems = self.dropItem:createRawItems(listItems)
		if table.getn(rawItems) == 0 then
			return true
		end
		
		if player:getPkg():addItems( rawItems ) then
			return true
		end
		
		local mail = app:getMailMgr():addSysMail(player:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, rawItems)
		MailSender:sendBriefMail(player, mail)
		
		return true
	end;
	
	isCanSeizeRes = function()
		return math.random(100) <= res_dantiao_ownerfield_getres_pro
	end;
})

ExpedZhanlingOwnerFieldTimerHdr = ExpedDantiaoOwnerFieldTimerHdr:extends({
	isCanFight = function(self)
		if not ExpedDantiaoOwnerFieldTimerHdr.isCanFight(self) then
			return false
		end
		
		if self:isSelfFieldFull() then
			LOG('<warning>self field full! attacker:' .. self.attackerCamp.player:getRoleName())
			return false
		end
		
		return true
	end;
	
	isCanSeizeRes = function(self)
		return true
	end;
	
	isNeedCurArmyStayWhenAttackSuccess = function(self)
		return true
	end;
	
	ownerArmyReturn = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local ownerPlayer = defenderPlayer:getOwnerPlayer()
		local ownerArmy = defenderPlayer:getOwnerArmy()
		if ownerArmy.armyId < 0 then
			return
		end
		
		local needTime = app:getArmyMgr():getArmyExpedNeedFullTime(ownerArmy.armyId)
		local stopTime = self.arriveTime + needTime
		app:getArmyMgr():changeArmy(ownerArmy.armyId, ARMYDYN_STATE.RETURN, self.fighted, stopTime)
		
		self:defFromSelfFieldList()
	end;
	
	defFromSelfFieldList = function(self)
		local defenderPlayer = self:getDefenderPlayer()
		local ownerPlayer = defenderPlayer:getOwnerPlayer()
		local ownerArmy = defenderPlayer:getOwnerArmy()
		
		local grid = app:getCityMgr():getGridByPos( defenderPlayer:getCityPos() )
		if grid == nil then 
			LOG('<error> 34589f843095')
			return
		end
		local selfFieldContainer = ownerPlayer:getSelfField()
		selfFieldContainer:deleteField(grid)
		PlayerSelfFieldSender:sendDeleteSelfField(ownerPlayer, grid.gridId)
	end;
})

ExpedTimerHdrMgr = Class:extends({
	init = function(self)
		self.observer = self._nullObServer
		self.defaultHdr_ = DefaultExpeditionTimerHdr:new()
		
		self.expedHdrs = {}
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.TAOFA, OBJ_TYPE.ROLE)] = ExpedPVPTaofaTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.COPYFIELD, EXPED_TYPE.TAOFA, OBJ_TYPE.ROLE)] = ExpedCopyFieldFightPlayerTimerHdr:new()

		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.TAOFA, OBJ_TYPE.COPYFIELD)] = ExpedFightCopyFieldTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.DANTIAO, OBJ_TYPE.FIELD)] = ExpedDantiaoFieldTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.CUIHUI, OBJ_TYPE.ROLE)] = ExpedPVPCuihuiTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.TIAOXIN, OBJ_TYPE.ROLE)] = ExpedPVPTiaoxinTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.PAIQIAN, OBJ_TYPE.ROLE)] = ExpedPaiqianPlayerTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.PAIQIAN, OBJ_TYPE.FIELD)] = ExpedPaiqianFieldTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.PAIQIAN, OBJ_TYPE.OWNERFIELD)] = ExpedPaiqianFieldTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.ZHANLING, OBJ_TYPE.FIELD)] = ExpedZhanlingFieldTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.DANTIAO, OBJ_TYPE.OWNERFIELD)] = ExpedDantiaoOwnerFieldTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.ZHANLING, OBJ_TYPE.OWNERFIELD)] = ExpedZhanlingOwnerFieldTimerHdr:new()
		
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.ACT_TOWER, OBJ_TYPE.COPYFIELD)] = ExpedFightActTowerTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.ACT_WORLDBOSS, OBJ_TYPE.COPYFIELD)] = ExpedFightWorldBossTimerHdr:new()
		self.expedHdrs[self:_makeKey(OBJ_TYPE.ROLE, EXPED_TYPE.ACT_TERRACE, OBJ_TYPE.COPYFIELD)] = ExpedFightActTerraceTimerHdr:new()
	end;
	
	handle = function(self, armyId)
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then
			return false
		end
	
		if army.state ~= ARMYDYN_STATE.GOTO then
			return false
		end
	
		local sourceCamp = ArmyCampActorsGetter:getSourceCamp(army)
		local targetCamps = ArmyCampActorsGetter:getTargetCamps(army)
	
		local sourceObjType = sourceCamp.player:getObjType()
		local targetObjType = self:getObjTypeFromCamps(targetCamps)
		if targetObjType == nil then
			return false
		end
		
		local hdr = self:getHandler(army.expedType,  sourceObjType,  targetObjType)
		return hdr:handle(army, sourceCamp, targetCamps, self.observer)
	end;
	
	getObjTypeFromCamps = function(self, camps)
		local len = table.getn(camps)
		if len == 0 then return nil end
		
		return camps[len].player:getObjType()
	end;
	
	getHandler = function(self, expedType, attackerType, defenderType)
		local hdr = self.expedHdrs[self:_makeKey(attackerType, expedType, defenderType)]
		if hdr == nil then 
			return self.defaultHdr_ 
		end
		return hdr
	end;
	
	regObserver = function(self, observer)
		if observer ~= nil then
			self.observer = observer
		else 
			self.observer = self._nullObServer
		end
	end;
	
	_makeKey = function(self, attackerType, expedType, defenderType)
		return attackerType*10000 + expedType*100 + defenderType
	end;
	
	_nullObServer = function(self)
	end;
}):new()


