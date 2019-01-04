--*******************************************************************************
--*******************************************************************************
MilitaryHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = GetMilitaryInfoHdr()
		self.handlers[1] = ExpeditionMgr
		self.handlers[2] = DelFavoriteTargetHdr()
		self.handlers[3] = SetDefaultTeamHdr()
		self.handlers[4] = GetAllArmysHdr()
		self.handlers[5] = CallBackArmyHdr()
		self.handlers[6] = RepatriateArmyHdr()
		self.handlers[7] = AddFavoriteTargetHdr()
		self.handlers[8] = DeclareFightHdr()
		self.handlers[9] = GetFavoritesHdr()
		self.handlers[10] = SaveForceLineUpHdr()
		self.handlers[11] = GetForceLineUpsHdr()
	end;
})

GetMilitaryInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		MilitarySender:sendDefaultTeams(player)
		MilitarySender:sendFavorites(player)
		MilitarySender:sendEnemys(player)
		MilitarySender:sendLineups(player)
		MilitarySender:sendTodayFTimes(player)
	end;
})

DelFavoriteTargetHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end

		self.player:getFavoriteContainer():delete(self.id)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.id = Util:getNumber(cmdtb, 'id')
		local favoriteContainer = self.player:getFavoriteContainer()
		return favoriteContainer:has(self.id)
	end;
})

SetDefaultTeamHdr = Class:extends({
	init = function(self)
		self.herosHdr = NetCmdHerosHdr:new()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return end
		if self.herosHdr:isEmptyHeros() then return end
		if self.herosHdr:hasBusyHeros() then return end
		if self.herosHdr:hasRepeatHeros() then return end
		
		self.player:setDefaultTeam(self.teamId, self.lineupId, self.heroIds)
		MilitarySender:sendDefaultTeam(self.player, self.teamId)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		local teamId = Util:getNumber(cmdtb, 'teamid')
		if (teamId < 1) or (MAX_DEFAULTTEAM_CNT < teamId) then return false end
		
		local lineupId = Util:getNumber(cmdtb, 'lineup')
		if not self.player:hasLineup(lineupId) then return false end
		
		self.teamId = teamId
		self.lineupId = lineupId
		
		if not self.herosHdr:handleParam(self.player, cmdtb, MAX_DEFAULTTEAM_HERO_CNT) then
			return false
		end
		
		self.heros = self.herosHdr:getHeros()
		self.heroIds = self.herosHdr:getHeroIds()
		self.teamId = teamId
		self.lineupId = lineupId
		return true
	end;
})

GetAllArmysHdr = Class:extends({
	handle = function(self, player, cmdtb)
		MilitarySender:sendAllArmys(player)
		InvalidDataChecker:checkArmys(player)
		InvalidDataChecker:checkHerosState(player)
	end;
})

BaseCallBackArmyHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		if not self:_isCanReturnArmy() then
			return false
		end
		
		self:_returnArmy()
		self:_sendMsgs()
		return true
	end;
	
	_isCanReturnArmy = function(self)
	end;
	
	_initParam = function(self, player, cmdtb)
		local armyId = Util:getNumber(cmdtb, 'armyId')
		if not self:_hasArmyId(player, armyId) then
			return false
		end
		
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then
			return false
		end
		
		self.player = player
		self.army = army
		
		return true
	end;
	
	_hasArmyId = function(self, player, armyId)
	end;
	
	_isArmyReturnState = function(self)
		return self.army.state == ARMYDYN_STATE.RETURN
	end;
	
	_returnArmy = function(self)
		local stopTime = Util:getTime() + self:_getReturnNeedTime()
		app:getArmyMgr():changeArmy(self.army.armyId, ARMYDYN_STATE.RETURN, FIGHT_FLAG.UNFIGHT, stopTime)
	end;
	
	_sendMsgs = function(self)
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineSourcePlayer(self.army), self.army.armyId)
		MilitarySender:sendArmyState(ArmyPlayerGetter:getOnlineTargetPlayer(self.army), self.army.armyId)
	end;
	
	_getReturnNeedTime = function(self)
		if self.army.state == ARMYDYN_STATE.GOTO then
			return app:getArmyMgr():getArmyCallBackNeedTime(self.army.armyId)
		else
			return app:getArmyMgr():getArmyExpedNeedFullTime(self.army.armyId)
		end
	end;
})

CallBackArmyHdr = BaseCallBackArmyHdr:extends({
	_hasArmyId = function(self, player, armyId)
		return player:getArmyContainer():hasSelfArmyId(armyId)
	end;
	
	_isCanReturnArmy = function(self)
		if self:_isArmyReturnState() then
			return false
		end
		
		if self:_isTargetNotRoleWhenDispatchState() then
			return false
		end

		return true
	end;
	
	_isTargetNotRoleWhenDispatchState = function(self)
		if self.army.state ~= ARMYDYN_STATE.DISPATCH then
			return false
		end
		
		return self.army.targetType ~= OBJ_TYPE.ROLE
	end;
})

RepatriateArmyHdr = BaseCallBackArmyHdr:extends({
	_hasArmyId = function(self, player, armyId)
		return player:getArmyContainer():hasAllianceArmyId(armyId)
	end;
	
	_isCanReturnArmy = function(self)
		if self:_isArmyReturnState() then
			return false
		end

		return true
	end;
})

AddFavoriteTargetHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		self.player:getFavoriteContainer():add(self.gridId)
		WUtil:sendSuccMsgArgs(self.player, 100070, '')
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local gridId = Util:getNumber(cmdtb, 'gridId')
		if gridId < 1 or gridId > GRIDS_COUNT then
			return false
		end
		
		self.player = player
		self.gridId = gridId
		
		return true
	end;
})

DeclareFightHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		if self.player:getRoleId() == self.targetPlayer:getRoleId() then
			WUtil:sendWarningMsgArgs(self.player, 100165, '')
			return false
		end
		
		if not self:_isValidRoleState() then
			return false
		end
		
		if self:_isSameAlliance() then
			WUtil:sendWarningMsgArgs(self.player, 100051, '')
			return false
		end
		
		if not self:_isNormalRefState() then
			WUtil:sendWarningMsgArgs(self.player, 100052, '')
			return false
		end
		
		if self.player:isFullFightRefState() then
			WUtil:sendWarningMsgArgs(self.player, 100053, '')
			return false
		end
		
		if self.targetPlayer:isFullFightRefState() then
			WUtil:sendWarningMsgArgs(self.player, 100088, '')
			return false
		end
		
		self:_addDeclareRefState()
		self:_sendMsgs()
		self:_addSysMails()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local targetId = Util:getNumber(cmdtb, 'targetId')
		local targetPlayer = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, targetId)
		if targetPlayer == NullPlayer then
			return false
		end
		
		self.player = player
		self.targetPlayer = targetPlayer
		
		return true
	end;
	
	_isValidRoleState = function(self)
		if self.targetPlayer:isDied() then
			WUtil:sendWarningMsgArgs(self.player, 100171, '')
			return false
		end
		
		if self.player:getState() == ROLE_STATE.YOUNG then
			WUtil:sendWarningMsgArgs(self.player, 100084, '')
			return false
		end
		
		if self.targetPlayer:getState() == ROLE_STATE.YOUNG then
			WUtil:sendWarningMsgArgs(self.player, 100085, '')
			return false
		end
		
		if self.player:getState() == ROLE_STATE.REST then
			WUtil:sendWarningMsgArgs(self.player, 100086, '')
			return false
		end
		
		if self.targetPlayer:getState() == ROLE_STATE.REST then
			WUtil:sendWarningMsgArgs(self.player, 100087, '')
			return false
		end
		
		return true
	end;
	
	_isSameAlliance = function(self)
		if self.player:getAlliId() == 0 then
			return false
		end
		
		return self.player:getAlliId() == self.targetPlayer:getAlliId()
	end;
	
	_isNormalRefState = function(self)
		local refState = self.player:getFightRefState( self.targetPlayer:getRoleId() )
		return refState ==  REF_ROLESTATE.NORMAL
	end;
	
	_addDeclareRefState = function(self)
		self.player:addDeclareState(self.targetPlayer:getRoleId())
		self.targetPlayer:addDeclareState(self.player:getRoleId())
	end;
	
	_sendMsgs = function(self)
		WUtil:sendSuccMsgArgs(self.player, 100054, '')
		WUtil:sendWarningMsgArgs(self.targetPlayer, 100055, '"' .. self.player:getRoleName() .. '"')
	end;
	
	_addSysMails = function(self)
		self:_addSysMail(self.player, self.targetPlayer, rstr.mail.content.declareTo)
		self:_addSysMail(self.targetPlayer, self.player, rstr.mail.content.declareFrom)
	end;
	
	_addSysMail = function(self, notifyPlayer, otherPlayer, contentFormat)
		local pos = otherPlayer:getCityPos()
		local content = string.format(contentFormat, otherPlayer:getRoleName(), pos.x, pos.y)
		local mail = app:getMailMgr():addSysMail(notifyPlayer:getRoleName(), rstr.mail.title.declareFight, FIXID.COMM_SYS_MAILTEMP, content)
		MailSender:sendBriefMail(notifyPlayer, mail)
	end;
})

GetFavoritesHdr = Class:extends({
	handle = function(self, player)
		MilitarySender:sendFavorites(player)
	end;
})

SaveForceLineUpHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local lineupId = Util:getNumber(cmdtb, 'lineup')
		if not player:hasLineup(lineupId) then return false end
		
		local heroCount = Util:getNumber(cmdtb, 'count')
		if heroCount > MAX_DEFAULTTEAM_HERO_CNT then return false end
		if heroCount < 0 then return false end
		
		local heroIds = {}
		for i=1, heroCount, 1 do
			local heroId = Util:getNumber(cmdtb, 'hid'..i)
			table.insert(heroIds, heroId)
		end
		
		local ttype = Util:getNumber(cmdtb, 'type')
		player:getClientCfg():addForceLineup(ttype, lineupId, heroIds)
		
		if heroCount > 0 then
			TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.HERO_LINEUP_ACTTOWER)
		end
		
		return true
	end;
})

GetForceLineUpsHdr = Class:extends({
	handle = function(self, player, cmdtb)
		MilitarySender:sendForceLineupCfg(player)
	end;
})


