ChatHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = ChatSendMsgHdr:new()
	end;
})

chat_msg_max_len = 50*3
ChatSendMsgHdr = Class:extends({
	init = function(self)
		self.chatHdrs = {}
		self.chatHdrs[CHAT_TARGET.PLAYER] = ChatSendPlayerHdr()
		self.chatHdrs[CHAT_TARGET.STATE] = ChatSendStateHdr()
		self.chatHdrs[CHAT_TARGET.ALLIANCE] = ChatSendAllianceHdr()
		self.chatHdrs[CHAT_TARGET.WORLD] = ChatSendWorldHdr()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_setParams(player, cmdtb) then
			return
		end
		
		self:_getChatHdr(self.target):handle(self.player, self.target, self.msg)
	end;
	
	_setParams = function(self, player, cmdtb)
		local msg = string.trimr( Util:getString(cmdtb, 'msg') )
		if not self:_isValidLength( msg ) then
			return false
		end
		
		self.msg = self:_filterMsg(msg)
		self.target = self:_formatWhenChatToRole(Util:getNumber(cmdtb, 'target'), self.msg)
		self.player = player
		return true
	end;
	
	_isValidLength = function(self, msg)
		return string.len(msg) > 0 and string.len(msg) <= chat_msg_max_len
	end;
	
	_filterMsg = function(self, msg)
		msg = string.gsub(msg, '[\n\r]', ' ' )
		return DirtyWordChecker:replace(msg)
	end;
	
	_formatWhenChatToRole = function(self, target, msg)
		if string.find(msg, '/') == 1 then
			return CHAT_TARGET.PLAYER
		else
			return target
		end	
	end;
	
	_getChatHdr = function(self, target)
		if self.chatHdrs[target] == nil then
			return NullHandler
		end
		return self.chatHdrs[target]
	end;
})

ChatSendBaseHdr = Class:extends({
	init = function(self)
		self.lastLimitTimes = {}
		self.lastLimitTimes[CHAT_TARGET.WORLD] = 15-1
		self.lastLimitTimes[CHAT_TARGET.STATE] = 5-1
		self.lastLimitTimes[CHAT_TARGET.ALLIANCE] = 10-1
		self.lastLimitTimes[CHAT_TARGET.PLAYER] = 5-1	
		
		self.targetMapChannel = {}
		self.targetMapChannel[CHAT_TARGET.PLAYER] = CHAT_CHANNEL.PRIVATE
		self.targetMapChannel[CHAT_TARGET.WORLD] = CHAT_CHANNEL.WORLD
		self.targetMapChannel[CHAT_TARGET.STATE] = CHAT_CHANNEL.STATE
		self.targetMapChannel[CHAT_TARGET.ALLIANCE] = CHAT_CHANNEL.ALLIANCE
	end;
	
	handle = function(self, player, target, msg)
		self:_setParams(player, target, msg)
		
		if not self:_hasQualificatione() then
			return
		end
		
		if self:_isTooFrequency(self.target) then 
			return 
		end
		
		self.expends = self:_createExpends()
		if not WUtil:isEnoughExpends(self.expends) then
			return
		end

		WUtil:subExpends(self.expends)	
		self.player:setChatLastTime(self.target, Util:getTime())	
		
		local players = self:_collectPlayers()
		self:_sendChatMsg(players)
		self:_checkActTask()
	end;	
	
	_setParams = function(self, player, target, msg)
		self.player = player
		self.target = target
		self.msg = msg	
	end;	
	
	_hasQualificatione = function(self)
		return true
	end;	
	
	_isTooFrequency = function(self, targetType)
		local lastTime = self.player:getChatLastTime(targetType)
		return (Util:getTime() - lastTime) < self.lastLimitTimes[targetType]
	end;	
	
	_createExpends = function(self)
		return {}
	end;	
	
	_collectPlayers = function(self)
		return nil
	end;
	
	_sendChatMsg = function(self, players)
		local fromCityId = self.player:getCityId()
		local fromId = self.player:getRoleId()
		local fromName = self.player:getRoleName()
		local channel = self.targetMapChannel[self.target]
		local appendInfo = self:_getAppendInfo(self.player)
		for _, player in pairs(players) do
			ChatSender:sendMsg(player, fromCityId, fromId, fromName, appendInfo, channel, self.msg )
		end
	end;	
	
	_checkActTask = function(self)
	end;
	
	_getAppendInfo = function(self, player)
		local mem = player:getQQMembership()
		local appendInfo = {
			vip=player:getVipLevel()
			,blue={level=mem['blue_vip_level'],year=mem['is_blue_year_vip'],super=mem['is_super_blue_vip'],grow=mem['_3366_grow_level']} }
		return appendInfo
	end;
	
	_getEmptyAppendInfo = function(self)
		return {vip=0,blue={level=0,year=0,super=0,grow=0}}
	end;
})

ChatSendPlayerHdr = ChatSendBaseHdr:extends({
	_setParams = function(self, player, target, msg)
		ChatSendBaseHdr._setParams(self, player, target, msg)
		self:_splitToPlayerMsg(self.msg)
		self:_initTargetPlayer()
	end;
	
	_hasQualificatione = function(self)
		if self.targetRoleName == '' or self.msg == '' then
			return false
		end
		
		if not self:_isHasTargetPlayer() then
			local appendInfo = self:_getEmptyAppendInfo()
			ChatSender:sendMsg(self.player, 0, CHAT_SYSPLAYER.SYS, '', appendInfo, CHAT_CHANNEL.PRIVATE, rstr.chat.noplayer)
			return false
		end
		
		return true
	end;

	_splitToPlayerMsg = function(self, msg)
		local pos = string.find(msg, ' ')
		if pos == nil then
			self.targetRoleName = string.sub(msg, 2, -1)
			self.msg = ''
		else
			self.targetRoleName = string.sub(msg, 2, pos-1)
			self.msg = string.trimr(string.sub(msg, pos+1, -1))		
		end
	end;
	
	_initTargetPlayer = function(self)
		local grid = app:getCityMgr():getGridByRoleName(self.targetRoleName)
		if grid == nil then
			self.targetPlayer = NullPlayer
			return
		end
		
		self.targetPlayer = app:getPlayerMgr():getPlayerByName(grid.userName)
		if self.targetPlayer == nil then
			self.targetPlayer = NullPlayer
		end
		
		if self.targetPlayer == self.player then
			self.targetPlayer = NullPlayer
		end
	end;

	_isHasTargetPlayer = function(self)
		return app:getCityMgr():getGridByRoleName(self.targetRoleName) ~= nil
	end;
	
	_collectPlayers = function(self)
		return {self.player, self.targetPlayer}
	end;
	
	_sendChatMsg = function(self, players)
		local fromId = self.player:getRoleId()
		local fromName = self.player:getRoleName()
		local toId = self.targetPlayer:getRoleId()
		local toName = self.targetPlayer:getRoleName()
		local channel = self.targetMapChannel[self.target]
		
		local fromAppendInfo = self:_getAppendInfo(self.player)
		local toAppendInfo = self:_getAppendInfo(self.targetPlayer)
			
		for _, player in ipairs(players) do
			ChatSender:sendPlayerMsg(player, fromId, fromName, fromAppendInfo, toId, toName, toAppendInfo, channel, self.msg )
		end
	end;	
})

ChatSendStateHdr = ChatSendBaseHdr:extends({
	_createExpends = function(self)
		local expendRess = {{resid=FIXID.SMALLSPEAKER, type=EXPEND_TYPE.ITEM,val=1}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
	
	_collectPlayers = function(self)
		return app:getPlayerMgr():getAllOnlinePlayers()
		--return app.getPlayerMgr().collectOnlinePlayersBy(CityStatePlayerSpec(self.player.getCityId()))
	end;
	
	_checkActTask = function(self)
		local questionAct = Service:getQuestionAct()
		if not questionAct:isCorrect(self.msg) then
			return
		end
		
		questionAct:appendToRanks(self.player:getRoleName())
		Service:getQuestionAct():sendGift(self.player)
	end;
})

ChatSendAllianceHdr = ChatSendBaseHdr:extends({
	_hasQualificatione = function(self)
		local hasAlliance = self.player:getAlliId() > 0
		if not hasAlliance then
			local appendInfo = self:_getEmptyAppendInfo()
			ChatSender:sendMsg(self.player, 0, CHAT_SYSPLAYER.ALLIANCE, '', appendInfo, CHAT_CHANNEL.ALLIANCE, rstr.chat.noalliance)
		end
		return hasAlliance
	end;

	_collectPlayers = function(self)
		return app:getPlayerMgr():collectOnlinePlayersBy(AlliancePlayerSpec(self.player:getAlliId()))
	end;
})

ChatSendWorldHdr = ChatSendBaseHdr:extends({
	_createExpends = function(self)
		local expendRess = {{resid=FIXID.BIGSPEAKER, type=EXPEND_TYPE.ITEM,val=1}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
	
	_sendChatMsg = function(self, players)
		app:getWorldMsgQueue():appendMsg(self.player:getRoleId(), self.player:getRoleName(), self.msg)
	end;	
})


