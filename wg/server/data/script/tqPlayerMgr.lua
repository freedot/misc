CityStatePlayerSpec = Class:extends({
	init = function(self, cityId)
		self.cityId = cityId
	end;
	
	isSatisfiedBy = function(self, player)
		return player:getCityId() == self.cityId
	end;
})

AlliancePlayerSpec = Class:extends({
	init = function(self, allianceId)
		self.allianceId = allianceId
	end;
	
	isSatisfiedBy = function(self, player)
		return player:getAlliId() == self.allianceId	
	end;
})

PlayerMgr = Class:extends({
	init = function(self)
		self._timerCaller = Caller:new(TIMER_ID.PLAYER_MGR, self, self._onOffinePlayerExit)
		self._onlinesCheckCaller = Caller:new(TIMER_ID.ONLINES_CHECK, self, self._onOnlinesCheck)
		self.list = rinit(self.list, {})
		self.onlinePlayers = rinit(self.onlinePlayers, {})
		self.offlinePlayers = rinit(self.offlinePlayers, {})
		self:_setOnlinesCheckTimer()
	end;
	
	safeExit = function(self)
		self:_safeExitOnlinePlayers()
		self:_safeExitOfflinePlayers()
		self:clear()
	end;
	
	clear = function(self)
		self.list = {}
		self.onlinePlayers = {}
		self.offlinePlayers = {}
	end;
	
	getPlayerById = function(self, id, connid)
		return self.list[self:makeListKey(id, connid)]
	end;
	
	getAllOnlinePlayers = function(self)
		return self.onlinePlayers
	end;
	
	collectOnlinePlayersBy = function(self, spec)
		local players = {}
		for _, player in pairs(self.onlinePlayers) do
			if spec:isSatisfiedBy(player) then
				table.insert(players, player)
			end
		end
		return players
	end;
	
	getPlayerByName = function(self, username)
		return self.onlinePlayers[username]
	end;
	
	getOfflinePlayerByName = function(self, username)
		return self.offlinePlayers[username]
	end;
	
	getOrLoadPlayerByUserName = function(self, objType, username)
		if (username == '') then
			return nil 
		end
		
		local player = self:getPlayerByName(username)
		if (player ~= nil) then 
			return player 
		end
		
		return self:_getOfflinePlayerByName(username)
	end;
	
	getOrLoadPlayerByRoleName = function(self, roleName)
		local grid = app:getCityMgr():getGridByRoleName(roleName)
		if grid == nil then
			return nil
		end
		
		return self:getOrLoadPlayerByUserName(grid.objType, grid.userName)
	end;
	
	getOrLoadPlayerByRoleId = function(self, roleId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return nil
		end
		
		return self:getOrLoadPlayerByUserName(grid.objType, grid.userName)
	end;
	
	getOnlinePlayerByRoleId = function(self, roleId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return nil
		end
		
		return self:getPlayerByName(grid.userName)
	end;
	
	getOnlinePlayerByRoleName = function(self, roleName)
		local grid = app:getCityMgr():getGridByRoleName(roleName)
		if grid == nil then
			return nil
		end
		
		return self:getPlayerByName(grid.userName)
	end;

	newPlayer = function(self, id, connid)
		local player = Player:new()
		player:setPersistVar(SPub:AllocDBVar());
		player:setId(id);
		player:setConnId(connid);
		player:setGameState(EGUS_LOGINNING)
		self.list[self:makeListKey(id, connid)] = player;
		return player
	end;
	
	exitPlayer = function(self, player)
		if player:isDeleted() then
			LOG('<error> save player after player is deleted!, [exitPlayer] ')
		end
		player:save()
		player:sendUserExit()
		self:freePlayer(player)
	end;
	
	freePlayer = function(self, player)
		if player:getGameState() == EGUS_INGAME then
			LOGEX('ACU', '<logout> time:' .. Util:getTime() .. ', user:' .. player:getName() .. ', role:' .. player:getRoleName() )
		end
		
		player:clear()
		local key = self:makeListKey(player:getId(), player:getConnId())
		if self.list[key] ~= nil then
			self.list[key] = nil
		end
		if self.onlinePlayers[player:getName()] ~= nil then
			self.onlinePlayers[player:getName()] = nil
		end
		if self.offlinePlayers[player:getName()] ~= nil then
			self.offlinePlayers[player:getName()] = nil
		end
		SPub:FreeDBVar(player:getPersistVar())
		player:setPersistVar(nil)
		player:setDeleted()
	end;

	appendPlayerIndex = function(self, player)
		self.onlinePlayers[player:getName()] = player
	end;
	
	makeListKey = function(self, id, connid)
		return connid..':'..id
	end;
	
	loadOfflinePlayerByUserName = function(self, username)
		local player = Player:new()
		player:setPersistVar(SPub:AllocDBVar())
		local loginHdr = app:getCmdHandler(NETCMD.LOGIN)
		if loginHdr:offlineRoleLogin(player, username) then
			return player
		else
			SPub:FreeDBVar(player:getPersistVar())
			return nil
		end
	end;
	
	sendWorldBless = function(self, blessId, msg)
		for _, player in pairs(self.onlinePlayers) do
			WUtil:sendSysMsg(player, SMSGT.SHOWPOP, blessId, msg)
		end
	end;
	
	getTimerCaller = function(self)	
		return self._timerCaller
	end;
	
	_getOfflinePlayerByName = function(self, username)
		local player = self.offlinePlayers[username]
		if player ~= nil then
			self:_startFreeOfflinePlayerTimer(player)
			return player
		end
		
		player = self:loadOfflinePlayerByUserName(username)
		if player == nil then
			return nil
		end
		
		self.offlinePlayers[username] = player
		self:_startFreeOfflinePlayerTimer(player)
		
		return player
	end;
	
	_onOffinePlayerExit = function(self, timer, seq, curTime, params)
		timer:stop()
		local roleId = params[2]
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then return end
		
		local player = self.offlinePlayers[grid.userName]
		if player == nil then return end
		
		if player:isDeleted() then
			LOG('<error> save player after player is deleted!, [_onOffinePlayerExit] ')
		end
		player:save()
		self:freePlayer(player)
		self.offlinePlayers[grid.userName] = nil
	end;
	
	_safeExitOnlinePlayers = function(self)
		self:_safeExitPlayers(self.onlinePlayers)
	end;
	
	_safeExitOfflinePlayers = function(self)
		self:_safeExitPlayers(self.offlinePlayers)
	end;
	
	_safeExitPlayers = function(self, players)
		for _, player in pairs(players) do
			if player:isDeleted() then
				LOG('<error> save player after player is deleted!, [_safeExitPlayers] ')
			end
			player:save()
			SPub:FreeDBVar(player:getPersistVar())
		end
	end;
	
	_startFreeOfflinePlayerTimer = function(self, player)
		global.getTimer():start(30*1000, {TIMER_EVT.FREE_OFFLINE_PLAYER, player:getRoleId()}, self._timerCaller)
	end;
	
	_setOnlinesCheckTimer = function(self)
		global.getTimer():start(120*1000, {TIMER_EVT.ONLINES_CHECK}, self._onlinesCheckCaller)
	end;
	
	_onOnlinesCheck = function(self)
		local players = self:getAllOnlinePlayers()
		local cnt = 0
		for _, p in pairs(players) do
			cnt = cnt + 1
		end		
		LOGEX('ONLINES', '<onlines>time:' .. Util:getTime() .. ',count:' .. cnt )
	end;
})


