require('tqPlayerMgr')

local TestCasePlayerMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;	
	
	test_collectOnlinePlayersBy = function(self)
		app:getPlayerMgr().onlinePlayers[self.player:getName()] = self.player
		assertEQ ( app:getPlayerMgr():collectOnlinePlayersBy(CityStatePlayerSpec(self.player:getCityId())), {self.player} ) 
		assertEQ ( app:getPlayerMgr():collectOnlinePlayersBy(CityStatePlayerSpec(self.player:getCityId()+1)), {} ) 
	end;
	
	testLoadOfflinePlayerByName = function(self)
		local player = app:getPlayerMgr():loadOfflinePlayerByUserName('testname')
		assert ( player ~= nil )
		assert ( player:getGameState() == EGUS_OFFLINE_INGAME )
	end;
	
	testGetOrLoadPlayerByName = function(self)
		local player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, 'testname')
		assert ( player ~= nil )
		assert ( player:getGameState() == EGUS_OFFLINE_INGAME )
	end;
	
	test_getOrLoadPlayerByRoleName = function(self)
		local r_grid = {nil}
		local r_player = {self.player}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleName', r_grid)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', r_player)
		assertEQ ( app:getPlayerMgr():getOrLoadPlayerByRoleName('name'), nil )
		
		r_grid[1] = {objType=OBJ_TYPE.ROLE, userName='user'}
		assertEQ ( app:getPlayerMgr():getOrLoadPlayerByRoleName('name'), self.player )
		assertEQ ( self.mm.params['getGridByRoleName'], {'name'} )
		assertEQ ( self.mm.params['getOrLoadPlayerByUserName'], {OBJ_TYPE.ROLE, 'user'} )
	end;
	
	test_getOrLoadPlayerByRoleId = function(self)
		local r_grid = {nil}
		local r_player = {self.player}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_grid)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', r_player)
		assertEQ ( app:getPlayerMgr():getOrLoadPlayerByRoleId(10000), nil )
		
		r_grid[1] = {objType=OBJ_TYPE.ROLE, userName='user'}
		assertEQ ( app:getPlayerMgr():getOrLoadPlayerByRoleId(10000), self.player )
		assertEQ ( self.mm.params['getGridByRoleId'], {10000} )
		assertEQ ( self.mm.params['getOrLoadPlayerByUserName'], {OBJ_TYPE.ROLE, 'user'} )
	end;
	
	test_getOnlinePlayerByRoleId = function(self)
		local r_grid = {nil}
		local r_player = {self.player}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_grid)
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_player)
		assertEQ ( app:getPlayerMgr():getOnlinePlayerByRoleId(10000), nil )
		
		r_grid[1] = {userName='user'}
		assertEQ ( app:getPlayerMgr():getOnlinePlayerByRoleId(10000), self.player )
		assertEQ ( self.mm.params['getGridByRoleId'], {10000} )
		assertEQ ( self.mm.params['getPlayerByName'], {'user'} )
	end;
	
	test_safeExit = function(self)
		self.mm:mock(app:getPlayerMgr(), '_safeExitOnlinePlayers')
		self.mm:mock(app:getPlayerMgr(), '_safeExitOfflinePlayers')
		self.mm:mock(app:getPlayerMgr(), 'clear')
		app:getPlayerMgr():safeExit()
		assertEQ ( self.mm.walkLog, '_safeExitOnlinePlayers,_safeExitOfflinePlayers,clear' )
	end;
	
	test_getAllOnlinePlayers = function(self)
		assertEQ ( app:getPlayerMgr():getAllOnlinePlayers(), app:getPlayerMgr().onlinePlayers )
	end;
	
	test_getOfflinePlayerByName = function(self)
		app:getPlayerMgr().offlinePlayers = {}
		app:getPlayerMgr().offlinePlayers['user'] = self.player
		assertEQ ( app:getPlayerMgr():getOfflinePlayerByName('xxx'), nil )
		assertEQ ( app:getPlayerMgr():getOfflinePlayerByName('user'), self.player )
	end;
	
	test_sendWorldBless = function(self)
		app:getPlayerMgr().onlinePlayers = {name1 = self.player, name2 = self.player}
		self.mm:mock( WUtil, 'sendSysMsg' )
		
		app:getPlayerMgr():sendWorldBless( 1, 'a' )
		assert ( self.mm.walkLog == 'sendSysMsg,sendSysMsg' )
		assertListEQ ( self.mm.params['sendSysMsg.1'], {self.player, SMSGT.SHOWPOP, 1, 'a'} )
		assertListEQ ( self.mm.params['sendSysMsg.2'], {self.player, SMSGT.SHOWPOP, 1, 'a'} )
	end;
	
	test_freePlayer = function(self)
		self.player:setName('user')
		app:getPlayerMgr().list['0:1'] = self.player
		app:getPlayerMgr().onlinePlayers['user'] = self.player
		self.mm:mock(self.player, 'clear')
		self.mm:mock(SPub, 'FreeDBVar')
		self.mm:mock(self.player, 'setPersistVar')
		app:getPlayerMgr():freePlayer(self.player)
		assertEQ ( self.mm.walkLog, 'clear,FreeDBVar,setPersistVar' )
		assertEQ ( app:getPlayerMgr().list['0:1'], nil )
		assertEQ ( app:getPlayerMgr().onlinePlayers['user'], nil )
		assertEQ ( self.mm.params['FreeDBVar'], {self.player:getPersistVar()})
		assertEQ ( self.mm.params['setPersistVar'], {nil})
	end;
	
	test__getOfflinePlayerByName = function(self)
		self.mm:mock(app:getPlayerMgr(), '_startFreeOfflinePlayerTimer')
		self.player:setName('user')
		app:getPlayerMgr().offlinePlayers['user'] = self.player
		assertEQ ( app:getPlayerMgr():_getOfflinePlayerByName('user'), self.player )
		assertEQ ( self.mm.params['_startFreeOfflinePlayerTimer'], {self.player} )
		
		self.mm:clear()
		app:getPlayerMgr().offlinePlayers['user'] = nil
		local r_loadOfflinePlayerByUserName = {nil}
		self.mm:mock( app:getPlayerMgr(), 'loadOfflinePlayerByUserName', r_loadOfflinePlayerByUserName )
		assertEQ ( app:getPlayerMgr():_getOfflinePlayerByName('user'), nil )
		assertEQ ( self.mm.params['loadOfflinePlayerByUserName'], {'user'})
		
		self.mm:clear()
		r_loadOfflinePlayerByUserName[1] = self.player
		assertEQ ( app:getPlayerMgr():_getOfflinePlayerByName('user'), self.player )
		assertEQ ( app:getPlayerMgr().offlinePlayers['user'], self.player )
		assertEQ ( self.mm.params['_startFreeOfflinePlayerTimer'], {self.player} )
	end;
	
	test__safeExitOnlinePlayers = function(self)
		app:getPlayerMgr().onlinePlayers = {}
		app:getPlayerMgr().onlinePlayers['user'] = self.player
		self.mm:mock(self.player, 'save')
		self.mm:mock(SPub, 'FreeDBVar')
		app:getPlayerMgr():_safeExitOnlinePlayers()
		assertEQ ( self.mm.walkLog, 'save,FreeDBVar' )
		assertEQ ( self.mm.params['FreeDBVar'], {self.player:getPersistVar()} )
	end;
	
	test__safeExitOfflinePlayers = function(self)
		app:getPlayerMgr().offlinePlayers = {}
		app:getPlayerMgr().offlinePlayers['user'] = self.player
		self.mm:mock(self.player, 'save')
		self.mm:mock(SPub, 'FreeDBVar')
		app:getPlayerMgr():_safeExitOfflinePlayers()
		assertEQ ( self.mm.walkLog, 'save,FreeDBVar' )	
		assertEQ ( self.mm.params['FreeDBVar'], {self.player:getPersistVar()} )
	end;
	
	test__startFreeOfflinePlayerTimer = function(self)
		self.mm:mock(global.getTimer(), 'start')	
		app:getPlayerMgr():_startFreeOfflinePlayerTimer(self.player)
		assertEQ ( self.mm.params['start'], {30*1000, {TIMER_EVT.FREE_OFFLINE_PLAYER, self.player:getRoleId()}, app:getPlayerMgr():getTimerCaller()} )
	end;
	
	test__onOffinePlayerExit = function(self)
		os.setClockMs(10000)
		app:getPlayerMgr():_startFreeOfflinePlayerTimer(self.player)
		
		local r_grid = {{userName='user'}}
		app:getPlayerMgr().offlinePlayers['user'] = self.player
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_grid)
		self.mm:mock(self.player, 'save')
		self.mm:mock(app:getPlayerMgr(), 'freePlayer')
		
		os.setClockMs(10000+30*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog, 'getGridByRoleId,save,freePlayer' )
		assertEQ ( self.mm.params['freePlayer'], {self.player})
		assertEQ ( app:getPlayerMgr().offlinePlayers['user'], nil )
		
		self.mm:clear()
		app:getPlayerMgr().offlinePlayers['user'] = self.player
		r_grid[1] = nil
		app:getPlayerMgr():_startFreeOfflinePlayerTimer(self.player)
		os.setClockMs(10000 + 30*1000 + 30*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog, 'getGridByRoleId', 'invalid grid' )
		
		self.mm:clear()
		app:getPlayerMgr().offlinePlayers['user'] = nil
		r_grid[1] = {userName='user'}
		app:getPlayerMgr():_startFreeOfflinePlayerTimer(self.player)
		os.setClockMs(10000 + 30*1000 + 30*1000 + 30*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog, 'getGridByRoleId', 'not find player in offlinePlayers list' )
	end;
})


tqPlayerMgr_t_main = function(suite)
	suite:addTestCase(TestCasePlayerMgr, 'TestCasePlayerMgr')
end;



