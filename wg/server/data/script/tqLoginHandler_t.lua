require('tqLoginHandler')

local TestCaseLoginHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testRoleLogin = function(self)
		local cmd = {cmd=NETCMD.LOGIN,stamp=Util:getTime(),user='hello',zoneid=0,qqmembership={},platform={openid='', openkey='', appid=0, pf='', pfkey='', zoneid=0  }}
		
		self.mm:mock(self.player:getCityRes(), 'sendCityDie')
		LoginHandler.roleLogin = function(self) return RET_LOGIN_NOROLE end
		LoginHandler():onRequest(self.player, nil, cmd)
		
		self.player:getCityRes():setLevel(1)
		LoginHandler.roleLogin = function(self) return RET_LOGIN_OK end
		LoginHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:getCityRes():setLevel(0)
		LoginHandler.roleLogin = function(self) return RET_LOGIN_OK end
		self.mm:clear()
		LoginHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.walkLog, 'sendCityDie' )
		
		LoginHandler.roleLogin = function(self) return -1 end
		LoginHandler():onRequest(self.player, nil, cmd)
	end;
	
	test_exitPlayer = function(self)
		local r_getPlayerByName = {nil}
		local r_getOfflinePlayerByName = {nil}
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_getPlayerByName)
		self.mm:mock(app:getPlayerMgr(), 'getOfflinePlayerByName', r_getOfflinePlayerByName)
		self.mm:mock(app, 'handleError')
		
		LoginHandler():exitPlayer('user')
		assertEQ ( self.mm.walkLog, 'getPlayerByName,getOfflinePlayerByName' )
		assertEQ ( self.mm.params['getPlayerByName'], {'user'} )
		assertEQ ( self.mm.params['getOfflinePlayerByName'], {'user'} )
		
		self.mm:clear()
		r_getOfflinePlayerByName[1] = {name='offlinePlayer'}
		LoginHandler():exitPlayer('user')
		assertEQ ( self.mm.walkLog, 'getPlayerByName,getOfflinePlayerByName,handleError' )
		assertEQ ( self.mm.params['handleError'], {{name='offlinePlayer'}, TQERR.RELOGIN} )
		
		self.mm:clear()
		r_getPlayerByName[1] = {name='onlinePlayer'}
		LoginHandler():exitPlayer('user')
		assertEQ ( self.mm.walkLog, 'getPlayerByName,handleError' )
		assertEQ ( self.mm.params['handleError'], {{name='onlinePlayer'}, TQERR.RELOGIN} )
	end;
	
	test_resetLoginDatas = function(self)
		local hdr = LoginHandler()
		self.mm:mock(self.player, 'recalMaxNewSoldier')
		self.mm:mock(self.player, 'refreshPSAttr')
		self.mm:mock(self.player:getCityRes(), 'refreshIdlePopu')
		self.mm:mock(self.player:getCityRes(), 'refreshMoney')
		self.mm:mock(self.player:getCityRes(), 'cutMoney')
		self.mm:mock(self.player:getCityRes(), 'cutCommRes')
		self.mm:mock(hdr, 'checkRoleState')
		self.mm:mock(hdr, 'checkHerosState')
		self.mm:mock(self.player, 'refreshCityGrid')
		
		hdr:resetLoginDatas(self.player)
		assertEQ ( self.mm.walkLog, 'recalMaxNewSoldier,refreshPSAttr,refreshIdlePopu,refreshMoney,cutMoney,cutCommRes,checkRoleState,checkHerosState,refreshCityGrid' )
		assertEQ ( self.mm.params['checkRoleState'], {self.player})
		assertEQ ( self.mm.params['checkHerosState'], {self.player})
	end;
	
	testOfflineRoleLogin = function(self)
		local player = Player:new()
		player:setPersistVar(SPub:AllocDBVar())
		local rt = LoginHandler():offlineRoleLogin(player, 'testname')
		assert ( rt == true )
	end;
	
	testCheckLearningCulture = function(self)
		Util:setTimeDrt(1)
			
		self.mm:mock(global.getTimer(), 'start')
		
		TestCaseCondition:setPreCond(self.player, nil, {learningculture={id=120001, stoptime=11} })
		LoginHandler():checkRoleState(self.player)
		assertEQ ( self.mm.params['start'], {(11-1)*1000, {TIMER_EVT.LEARN_CULTURE_STOP, 120001}, self.player:getTimerCaller()} )
	end;
	
	test_checkRoleState = function(self)
		local hdr = LoginHandler()
		self.mm:mock(hdr, 'checkYoungState')
		self.mm:mock(hdr, 'checkLearningCulture')
		self.mm:mock(hdr, 'checkBuildingCityDef')
		
		hdr:checkRoleState(self.player)
		assertEQ ( self.mm.walkLog, 'checkYoungState,checkLearningCulture,checkBuildingCityDef' )
		assertEQ ( self.mm.params['checkYoungState'], {self.player} )
		assertEQ ( self.mm.params['checkLearningCulture'], {self.player} )
		assertEQ ( self.mm.params['checkBuildingCityDef'], {self.player} )
	end;
	
	test_checkBuildingCityDef = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.player:getCityDef():setBuildingResid(0)
		LoginHandler():checkBuildingCityDef(self.player)
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:getCityDef():setBuildingResid(150101)
		self.player:getCityDef():setBuildingStopTime(Util:getTime() + 10)
		LoginHandler():checkBuildingCityDef(self.player)
		assertEQ ( self.mm.walkLog, 'start' )
		assertEQ ( self.mm.params['start'], {10*1000, {TIMER_EVT.BUILD_CITYDEF_STOP, 150101}, self.player:getTimerCaller()} )
	end;
	
	testSendMsgs = function(self)
		local mm = MMock()
		mm:mock( MilitarySender, 'sendSuccCopyFields' )
		
		LoginHandler():sendMsgs(self.player)
		mm:restore()
		
		assert ( mm.walkLog == 'sendSuccCopyFields' )
		assertListEQ ( mm.params['sendSuccCopyFields'], {self.player} )
	end;
	
	test__resetLoginTime = function(self)
		Util:setTimeDrt(10)
		self.mm:mock( app:getCityMgr(), 'saveGrid' )
		LoginHandler():_resetLoginTime(self.player)
		assertEQ ( self.mm.params['saveGrid'], {self.player:getCityGrid(), {'loginTime'} } )
		assertEQ ( self.player:getCityGrid().loginTime, 10 )
	end;
	
	test__checkTasks = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.player:getPersistVar().regTime = 1380443355
		Util:setTimeDrt(1380443355)
		LoginHandler():_checkTasks(self.player, false)
		assertEQ ( self.mm.walkLog, 'trigerTask,trigerTask,checkTasks' )
		assertEQ ( self.mm.params['trigerTask.1'], {self.player, TASK_FINISH_TYPE.FIRST_ROLELOGIN, 0} )
		assertEQ ( self.mm.params['trigerTask.2'], {self.player, TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY} )
		
		self.mm:clear()
		Util:setTimeDrt(1380443355 + 2*24*3600)
		LoginHandler():_checkTasks(self.player, false)
		assertEQ ( self.mm.walkLog, 'trigerTask,trigerTask,checkTasks' )
		assertEQ ( self.mm.params['trigerTask.1'], {self.player, TASK_FINISH_TYPE.FIRST_ROLELOGIN, 2} )
		
		self.mm:clear()
		Util:setTimeDrt(1380443355 + 11*24*3600)
		LoginHandler():_checkTasks(self.player, false)
		assertEQ ( self.mm.walkLog, 'trigerTask,checkTasks' )
		assertEQ ( self.mm.params['checkTasks'], { self.player } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY} )
		
		self.mm:clear()
		Util:setTimeDrt(1380443355 + 11*24*3600)
		LoginHandler():_checkTasks(self.player, true)
		assertEQ ( self.mm.walkLog, 'trigerTask,trigerTask,checkTasks' )
		assertEQ ( self.mm.params['checkTasks'], { self.player } )
		assertEQ ( self.mm.params['trigerTask.1'], {self.player, TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY} )
		assertEQ ( self.mm.params['trigerTask.2'], {self.player, TASK_FINISH_TYPE.USE_DOTBROWSER} )
	end;
})

local TestCaseCheckHerosState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_checkHerosState = function(self)
		local loginHdr = LoginHandler()
		
		self.mm:mock(loginHdr, 'checkHeroUnlockState')
		self.mm:mock(loginHdr, 'checkHeroSkeletonSteeling')
		self.mm:mock(loginHdr, 'checkHeroSkillSteeling')
		self.mm:mock(loginHdr, 'checkHeroSteeling')
		
		loginHdr:checkHerosState(self.player)
			
		assertEQ ( self.mm.walkLog, 'checkHeroUnlockState,checkHeroSkeletonSteeling,checkHeroSkillSteeling,checkHeroSteeling' )
		assertEQ ( self.mm.params['checkHeroUnlockState'], {self.player, self.hero})
		assertEQ ( self.mm.params['checkHeroSkeletonSteeling'], {self.player, self.hero})
		assertEQ ( self.mm.params['checkHeroSkillSteeling'], {self.player, self.hero})
		assertEQ ( self.mm.params['checkHeroSteeling'], {self.player, self.hero})
	end;
	
	test_checkHeroUnlockState = function(self)
		self.mm:mock(global.getTimer(), 'start')
		Util:setTimeDrt(1)
		
		LoginHandler():checkHeroUnlockState(self.player, self.hero)
		
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		self.hero:setUnLockTime(11)
		LoginHandler():checkHeroUnlockState(self.player, self.hero)
		assertEQ ( self.mm.params['start'], {(11 - 1)*1000, {TIMER_EVT.HERO_UNLOCK_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
	end;
	
	test_checkHeroSkeletonSteeling = function(self)
		self.mm:mock(global.getTimer(), 'start')
		Util:setTimeDrt(1)
		
		LoginHandler():checkHeroSkeletonSteeling(self.player, self.hero)
		assertEQ ( self.mm.walkLog, '' )
		
		self.hero:setSSteelStopTime(11)
		LoginHandler():checkHeroSkeletonSteeling(self.player, self.hero)
		assertEQ ( self.mm.params['start'], {(11 - 1)*1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
	end;
	
	test_checkHeroSkillSteeling = function(self)
		self.mm:mock(global.getTimer(), 'start')
		Util:setTimeDrt(1)
		
		LoginHandler():checkHeroSkillSteeling(self.player, self.hero)
		
		TestCaseCondition:setPreCond(self.player, self.hero, { hero={skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		LoginHandler():checkHeroSkillSteeling(self.player, self.hero)
		assertEQ ( self.mm.params['start'], {(30 - Util:getTime())*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, self.hero:getId(), 6001008}, self.player:getTimerCaller()} )
	end;
	
	test_checkHeroSteeling = function(self)
		self.mm:mock(global.getTimer(), 'start')
		Util:setTimeDrt(2)
		
		LoginHandler():checkHeroSteeling(self.player, self.hero)
		
		self.hero:getHeroSteel():setStartTime(1)
		self.hero:getHeroSteel():setSteelType(2)
		self.hero:getHeroSteel():setSteelQuarters(10)
		LoginHandler():checkHeroSteeling(self.player, self.hero)
		assertEQ ( self.mm.params['start'], { (10*900 + 1 - 2)*1000, {TIMER_EVT.HERO_STEEL_STOP, self.hero:getId(), 1, 2}, self.player:getTimerCaller() } )
	end;
	
	test_offlineRoleLogin = function(self)
		local hdr = LoginHandler()
		local r_RoleLogin = {RET_LOGIN_OK-1}
		self.mm:mock(SPub, 'RoleLogin', r_RoleLogin)
		self.mm:mock(self.player, 'loginStart')
		self.mm:mock(self.player, 'setName')
		self.mm:mock(self.player, 'setGameState')
		self.mm:mock(hdr, 'resetLoginDatas')
		
		assertEQ ( hdr:offlineRoleLogin(self.player, 'user'), false )
		assertEQ ( self.mm.walkLog, 'RoleLogin' )
		assertEQ ( self.mm.params['RoleLogin'], {self.player:getPersistVar(), 'user', SPub:GetZoneId()} )
		
		self.mm:clear()
		r_RoleLogin[1] = RET_LOGIN_OK
		assertEQ ( hdr:offlineRoleLogin(self.player, 'user'), true )
		assertEQ ( self.mm.walkLog, 'RoleLogin,loginStart,setName,setGameState,resetLoginDatas' )
		assertEQ ( self.mm.params['setName'], {'user'})
		assertEQ ( self.mm.params['setGameState'], {EGUS_OFFLINE_INGAME})
		assertEQ ( self.mm.params['resetLoginDatas'], {self.player})
	end;
})

tqLoginHandler_t_main = function(suite)
	suite:addTestCase(TestCaseLoginHandler, 'TestCaseLoginHandler')
	suite:addTestCase(TestCaseCheckHerosState, 'TestCaseCheckHerosState')
end;


