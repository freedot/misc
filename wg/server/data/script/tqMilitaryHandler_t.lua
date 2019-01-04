require('tqMilitaryHandler')

local TestCaseMilitaryHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_onRequest = function(self)
		local hdr = MilitaryHandler()
		assert ( hdr:getHandler(0):getClass() == GetMilitaryInfoHdr)
		assert ( hdr:getHandler(1)                 == ExpeditionMgr)
		assert ( hdr:getHandler(2):getClass() == DelFavoriteTargetHdr)
		assert ( hdr:getHandler(3):getClass() == SetDefaultTeamHdr)
		assert ( hdr:getHandler(4):getClass() == GetAllArmysHdr)
		assert ( hdr:getHandler(5):getClass() == CallBackArmyHdr)
		assert ( hdr:getHandler(6):getClass() == RepatriateArmyHdr)
		assert ( hdr:getHandler(7):getClass() == AddFavoriteTargetHdr)
		assert ( hdr:getHandler(8):getClass() == DeclareFightHdr)
		assert ( hdr:getHandler(9):getClass() == GetFavoritesHdr)
		assert ( hdr:getHandler(10):getClass() == SaveForceLineUpHdr)
		assert ( hdr:getHandler(11):getClass() == GetForceLineUpsHdr)
	end;
})


local TestCaseGetMilitaryInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetMilitaryInfoHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(MilitarySender, 'sendDefaultTeams')
		self.mm:mock(MilitarySender, 'sendFavorites')
		self.mm:mock(MilitarySender, 'sendEnemys')
		self.mm:mock(MilitarySender, 'sendLineups')
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		
		self.hdr:handle(self.player, nil)
		assert ( self.mm.walkLog == 'sendDefaultTeams,sendFavorites,sendEnemys,sendLineups,sendTodayFTimes' )
		assertListEQ ( self.mm.params['sendDefaultTeams'], {self.player} )
		assertListEQ ( self.mm.params['sendFavorites'], {self.player} )
		assertListEQ ( self.mm.params['sendEnemys'], {self.player} )
		assertListEQ ( self.mm.params['sendLineups'], {self.player} )
		assertListEQ ( self.mm.params['sendTodayFTimes'], {self.player} )
	end;
})

local TestCaseDelFavoriteTargetHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { favorites={1} })
		self.hdr = DelFavoriteTargetHdr()
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidTargetId = function(self)
		local cmd = {id=2}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testDelOk = function(self)
		local cmd = {id=1}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 1 )
	end;
});

local TestCaseSetDefaultTeamHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0},{state=0},{state=1} } })
		self.hdr = SetDefaultTeamHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidTeamId = function(self)
		local cmd={teamid=0,lineup=180001,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
		
		cmd={teamid=4,lineup=180001,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidLineupId = function(self)
		local cmd={teamid=1,lineup=180003,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidHeroCount = function(self)
		local cmd={teamid=1,lineup=180001,count=1,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
		
		cmd={teamid=1,lineup=180001,count=6,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoHasHero = function(self)
		local cmd={teamid=1,lineup=180001,count=5,hid1=0,hid2=8,hid3=9,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHasRepeatHeros = function(self)
		local cmd={teamid=1,lineup=180002,count=5,hid1=0,hid2=1,hid3=2,hid4=1,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )	
	end;
	
	testHasBusyHero = function(self)
		local cmd={teamid=1,lineup=180001,count=5,hid1=0,hid2=1,hid3=2,hid4=3,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testSetDefaultTeamOK = function(self)
		local cmd={teamid=1,lineup=180002,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		self.hdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() > 0 )
		assert ( self.player:getDefaultTeam(1).lineupId == 180002 )
	end;
});

local TestCaseGetAllArmysHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetAllArmysHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(MilitarySender, 'sendAllArmys')
		self.hdr:handle(self.player, nil)
		assert ( self.mm.walkLog == 'sendAllArmys' )
		assertListEQ ( self.mm.params['sendAllArmys'],  {self.player} )
	end;
});

local TestCaseBaseCallBackArmyHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BaseCallBackArmyHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_initParamRt={false}
		local g_isCanReturnArmyRt={false}
		local g_cmd = {armyId=1}
		
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.hdr, '_isCanReturnArmy', g_isCanReturnArmyRt)
		self.mm:mock(self.hdr, '_returnArmy')
		self.mm:mock(self.hdr, '_sendMsgs')
		
		assert ( self.hdr:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParam' )
		assertListEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assert ( self.hdr:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParam,_isCanReturnArmy' )
		
		self.mm:clear()
		g_isCanReturnArmyRt[1] = true
		assert ( self.hdr:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParam,_isCanReturnArmy,_returnArmy,_sendMsgs' )
	end;
	
	test__initParam = function(self)
		local g_cmd = {armyId=1}
		local g_hasArmyIdRt = {false}
		local g_getArmyByIdRt = {nil}
		self.mm:mock(self.hdr, '_hasArmyId', g_hasArmyIdRt)
		self.mm:mock(app:getArmyMgr(), 'getArmyById', g_getArmyByIdRt)
		assert ( self.hdr:_initParam(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_hasArmyId' )
		assertListEQ ( self.mm.params['_hasArmyId'], {self.player, 1} )
		
		self.mm:clear()
		g_hasArmyIdRt[1] = true
		assert ( self.hdr:_initParam(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_hasArmyId,getArmyById' )
		assertListEQ ( self.mm.params['getArmyById'], {1} )
		
		self.mm:clear()
		g_getArmyByIdRt[1] = {armyId=1}
		assert ( self.hdr:_initParam(self.player, g_cmd) == true )
		assert ( self.hdr.player == self.player )
		assert ( self.hdr.army == g_getArmyByIdRt[1] )
	end;

	test__isArmyReturnState = function(self)
		self.hdr.army = {state=ARMYDYN_STATE.GOTO}
		assert ( self.hdr:_isArmyReturnState() == false )
		
		self.hdr.army = {state=ARMYDYN_STATE.RETURN}
		assert ( self.hdr:_isArmyReturnState() == true )
	end;
	
	test__returnArmy = function(self)
		self.hdr.army = {armyId=1}
		self.mm:mock(self.hdr, '_getReturnNeedTime', {10})
		self.mm:mock(app:getArmyMgr(), 'changeArmy' )
		self.hdr:_returnArmy()
		assert ( self.mm.walkLog == '_getReturnNeedTime,changeArmy' )
		assertListEQ ( self.mm.params['changeArmy'], {1, ARMYDYN_STATE.RETURN, 0, Util:getTime()+10} )
	end;
	
	test__sendMsgs = function(self)
		self.mm:mock(MilitarySender, 'sendArmyState')
		
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100001)
		
		army = {}
		army.armyId = 1
		army.state = ARMYDYN_STATE.GOTO
		army.startTime = 0
		army.needTime = 0
		army.stopTime = 0
		army.sourceId = sourcePlayer:getRoleId()
		army.sourceType = sourcePlayer:getObjType()
		army.targetId = targetPlayer:getRoleId()
		army.targetType = targetPlayer:getObjType()
		army.expedType = 0
		army.lineupId = 0
		army.fighted = 0
		self.hdr.army = army
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendArmyState,sendArmyState' );
		assertEQ ( self.mm.params['sendArmyState.1'], {sourcePlayer, 1} )
		assertEQ ( self.mm.params['sendArmyState.2'], {targetPlayer, 1} )
	end;	
	
	test__getReturnNeedTime = function(self)
		self.mm:mock(app:getArmyMgr(), 'getArmyCallBackNeedTime', {10})
		self.mm:mock(app:getArmyMgr(), 'getArmyExpedNeedFullTime', {11})
		
		self.hdr.army = {armyId=1, state=ARMYDYN_STATE.GOTO}
		assert ( self.hdr:_getReturnNeedTime() == 10 )
		assertListEQ ( self.mm.params['getArmyCallBackNeedTime'], {1} )
		
		self.mm:clear()
		self.hdr.army = {armyId=1, state=ARMYDYN_STATE.DISPATCH}
		assert ( self.hdr:_getReturnNeedTime() == 11 )
		assertListEQ ( self.mm.params['getArmyExpedNeedFullTime'], {1} )
	end;	
});

local TestCaseCallBackArmyHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CallBackArmyHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__hasArmyId = function(self)
		self.player:getArmyContainer():addSelfArmyId(1)
		local armyId = 0
		assert ( self.hdr:_hasArmyId(self.player, armyId) == false )
		
		local armyId = 1
		assert ( self.hdr:_hasArmyId(self.player, armyId) == true )
	end;
	
	test__isCanReturnArmy = function(self)
		local g_isArmyReturnStateRt={true}
		local g_isTargetNotRoleWhenDispatchStateRt={true}
		
		self.mm:mock(self.hdr, '_isArmyReturnState', g_isArmyReturnStateRt)
		self.mm:mock(self.hdr, '_isTargetNotRoleWhenDispatchState', g_isTargetNotRoleWhenDispatchStateRt)
		
		assert ( self.hdr:_isCanReturnArmy() == false )
		
		g_isArmyReturnStateRt[1] = false;
		assert ( self.hdr:_isCanReturnArmy() == false )
		
		g_isTargetNotRoleWhenDispatchStateRt[1] = false;
		assert ( self.hdr:_isCanReturnArmy() == true )
	end;
	
	test__isTargetNotRoleWhenDispatchState = function(self)
		self.hdr.army = {state=ARMYDYN_STATE.GOTO}
		assert ( self.hdr:_isTargetNotRoleWhenDispatchState() == false )
		
		self.hdr.army = {state=ARMYDYN_STATE.DISPATCH, targetType=OBJ_TYPE.ROLE}
		assert ( self.hdr:_isTargetNotRoleWhenDispatchState() == false )
		
		self.hdr.army = {state=ARMYDYN_STATE.DISPATCH, targetType=OBJ_TYPE.FIELD}
		assert ( self.hdr:_isTargetNotRoleWhenDispatchState() == true )
	end;
});

local TestCaseRepatriateArmyHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RepatriateArmyHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__hasArmyId = function(self)
		self.player:getArmyContainer():addAllianceArmyId(1)
		local armyId = 0
		assert ( self.hdr:_hasArmyId(self.player, armyId) == false )
		
		local armyId = 1
		assert ( self.hdr:_hasArmyId(self.player, armyId) == true )
	end;
	
	test__isCanReturnArmy = function(self)
		local g_isArmyReturnStateRt={true}
	
		self.mm:mock(self.hdr, '_isArmyReturnState', g_isArmyReturnStateRt)
		assert ( self.hdr:_isCanReturnArmy() == false )
		
		g_isArmyReturnStateRt[1] = false;
		assert ( self.hdr:_isCanReturnArmy() == true )
	end;	
});

local TestCaseAddFavoriteTargetHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AddFavoriteTargetHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.hdr.gridId = 1
		
		local g_cmd = {gridId=1}
		local g_initParamRt = {false}
		self.mm:mock(self.hdr, '_initParam', g_initParamRt )
		self.mm:mock(self.player:getFavoriteContainer(), 'add' )
		self.mm:mock(WUtil, 'sendSuccMsgArgs' )
		
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,add,sendSuccMsgArgs' )
		assertEQ ( self.mm.params['add'], {1} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100070, ''} )
	end;
	
	test__initParam = function(self)
		local g_cmd = {gridId=0}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		
		local g_cmd = {gridId=GRIDS_COUNT + 1}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		
		local g_cmd = {gridId=1}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.gridId, 1 )
	end;
});

local TestCaseDeclareFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = DeclareFightHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100000)
		self.hdr.targetPlayer = self.targetPlayer
		
		local g_initParamRt = {false}
		local g_isValidRoleStateRt = {false}
		local g_isSameAllianceRt = {true}
		local g_isNormalRefStateRt = {false}
		local g_isFullFightRefStateA = {true}
		local g_isFullFightRefStateB = {true}
		
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(self.hdr, '_initParam', g_initParamRt )
		self.mm:mock(self.hdr, '_isValidRoleState', g_isValidRoleStateRt )
		self.mm:mock(self.hdr, '_isSameAlliance', g_isSameAllianceRt )
		self.mm:mock(self.hdr, '_isNormalRefState', g_isNormalRefStateRt )
		self.mm:mock(self.hdr.player, 'isFullFightRefState', g_isFullFightRefStateA)
		self.mm:mock(self.hdr.targetPlayer, 'isFullFightRefState', g_isFullFightRefStateB)
		self.mm:mock(self.hdr, '_addDeclareRefState' )
		self.mm:mock(self.hdr, '_sendMsgs' )
		self.mm:mock(self.hdr, '_addSysMails' )
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )

		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState' )
		
		self.mm:clear()
		g_cmd.targetId = self.player:getRoleId()
		self.hdr.targetPlayer = self.player
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100165, ''} )
		
		self.mm:clear()
		g_cmd.targetId = self.targetPlayer:getRoleId()
		self.hdr.targetPlayer = self.targetPlayer
		g_isValidRoleStateRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState,_isSameAlliance,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100051, ''} )
		
		self.mm:clear()
		g_isSameAllianceRt[1] = false
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState,_isSameAlliance,_isNormalRefState,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100052, ''} )
		
		self.mm:clear()
		g_isNormalRefStateRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState,_isSameAlliance,_isNormalRefState,isFullFightRefState,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100053, ''} )
		
		self.mm:clear()
		g_isFullFightRefStateA[1] = false
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState,_isSameAlliance,_isNormalRefState,isFullFightRefState,isFullFightRefState,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100088, ''} )
		
		self.mm:clear()
		g_isFullFightRefStateB[1] = false
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidRoleState,_isSameAlliance,_isNormalRefState,isFullFightRefState,isFullFightRefState,_addDeclareRefState,_sendMsgs,_addSysMails' )
	end;
	
	test__initParam = function(self)
		local g_cmd = {targetId=-1}
		
		local g_getPlayerRt = {NullPlayer}
		self.mm:mock(ArmyPlayerGetter, 'getPlayer',  g_getPlayerRt)
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		assertEQ ( self.mm.params['getPlayer'], {OBJ_TYPE.ROLE, -1} )
		
		self.mm:clear()
		g_getPlayerRt[1] = {}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.targetPlayer, g_getPlayerRt[1] )
	end;
	
	test__isValidRoleState = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100000)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		self.hdr.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:_isValidRoleState(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100084, ''} )
		
		self.hdr.player:setState(ROLE_STATE.FREE)
		self.hdr.targetPlayer:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:_isValidRoleState(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100085, ''} )
		
		self.hdr.player:setState(ROLE_STATE.REST)
		self.hdr.targetPlayer:setState(ROLE_STATE.FREE)
		assertEQ ( self.hdr:_isValidRoleState(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100086, ''} )
		
		self.hdr.player:setState(ROLE_STATE.FREE)
		self.hdr.targetPlayer:setState(ROLE_STATE.REST)
		assertEQ ( self.hdr:_isValidRoleState(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100087, ''} )
		
		self.hdr.player:setState(ROLE_STATE.FREE)
		self.hdr.targetPlayer:setState(ROLE_STATE.FREE)
		assertEQ ( self.hdr:_isValidRoleState(), true )
		
		self.hdr.targetPlayer:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		assertEQ ( self.hdr:_isValidRoleState(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100171, ''} )
	end;
	
	test__isSameAlliance = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100000)
		
		local g_getSelfAlliIdRt = {0}
		local g_getTargetAlliIdRt = {0}
		self.mm:mock( self.player, 'getAlliId', g_getSelfAlliIdRt )
		self.mm:mock( self.hdr.targetPlayer, 'getAlliId', g_getTargetAlliIdRt )
		
		assertEQ ( self.hdr:_isSameAlliance(), false )
		
		g_getSelfAlliIdRt[1] = 1
		g_getTargetAlliIdRt[1] = 2
		assertEQ ( self.hdr:_isSameAlliance(), false )
		
		g_getSelfAlliIdRt[1] = 1
		g_getTargetAlliIdRt[1] = 1
		assertEQ ( self.hdr:_isSameAlliance(), true )
	end;
	
	test__isNormalRefState = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100000)
		
		local g_getFightRefStateRt = {REF_ROLESTATE.NORMAL}
		self.mm:mock(self.hdr.player, 'getFightRefState', g_getFightRefStateRt )
		
		assertEQ ( self.hdr:_isNormalRefState(), true )
		assertEQ ( self.mm.params['getFightRefState'], {100000} )
		
		self.mm:clear()
		g_getFightRefStateRt[1] = REF_ROLESTATE.NORMAL + 1
		assertEQ ( self.hdr:_isNormalRefState(), false )
	end;
	
	test__addDeclareRefState = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100000)
		
		self.mm:mock( self.hdr.player, 'addDeclareState' )
		self.mm:mock( self.hdr.targetPlayer, 'addDeclareState' )
		self.hdr:_addDeclareRefState()
		assertEQ ( self.mm.params['addDeclareState.1'], {100000} )
		assertEQ ( self.mm.params['addDeclareState.2'], {self.player:getRoleId()} )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000)
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendSuccMsgArgs,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.hdr.player, 100054, ''} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.hdr.targetPlayer, 100055, '"source_r"'} )
	end;
	
	test__addSysMails = function(self)
		self.hdr.player = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000)
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		self.mm:mock( self.hdr, '_addSysMail' )
		self.hdr:_addSysMails()
		assertEQ ( self.mm.walkLog, '_addSysMail,_addSysMail' )
		assertEQ ( self.mm.params['_addSysMail.1'], {self.hdr.player, self.hdr.targetPlayer, rstr.mail.content.declareTo} )
		assertEQ ( self.mm.params['_addSysMail.2'], {self.hdr.targetPlayer, self.hdr.player, rstr.mail.content.declareFrom} )
	end;
	
	test__addSysMail = function(self)
		local g_player = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000)
		local g_targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		local g_mail = {}
		self.mm:mock( app:getMailMgr(), 'addSysMail', {g_mail} )
		self.mm:mock( MailSender, 'sendBriefMail' )
		self.hdr:_addSysMail(g_player, g_targetPlayer, rstr.declareFight.declareTo)
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail' )
		
		local pos = g_targetPlayer:getCityPos()
		local content = string.format(rstr.declareFight.declareTo, g_targetPlayer:getRoleName(), pos.x, pos.y)
		assertEQ ( self.mm.params['addSysMail'], {'source_r', rstr.mail.title.declareFight, FIXID.COMM_SYS_MAILTEMP, content} )
		assertEQ ( self.mm.params['sendBriefMail'], {g_player, g_mail} )
	end;
})

local TestCaseGetFavoritesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetFavoritesHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(MilitarySender, 'sendFavorites')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendFavorites'], {self.player} )
	end;
})

local TestCaseSaveForceLineUpHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = MilitaryHandler():getHandler(10)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0},{state=0},{state=1} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_invalidLineupId = function(self)
		local cmd={type=1,lineup=180003,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_validLineupId = function(self)
		local cmd={type=1,lineup=180002,count=5,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
	end;
	
	test_invalidHeroCount = function(self)
		local cmd={type=1,lineup=180001,count=6,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd={type=1,lineup=180001,count=-1,hid1=0,hid2=1,hid3=2,hid4=0,hid5=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleOk = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask' )
		local cmd={type=1,lineup=180001,count=2,hid1=1,hid2=2}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getClientCfg():getForceLineupCount(), 1 )
		assertEQ ( self.player:getClientCfg():getForceLineup(0).type, 1 )
		assertEQ ( self.player:getClientCfg():getForceLineup(0).lineup, 180001 )
		assertEQ ( self.player:getClientCfg():getForceLineup(0).heroCount, 2 )
		assertEQ ( self.player:getClientCfg():getForceLineup(0).heroIds[0], 1 )
		assertEQ ( self.player:getClientCfg():getForceLineup(0).heroIds[1], 2 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.HERO_LINEUP_ACTTOWER} )
		
		self.mm:clear()
		local cmd={type=1,lineup=180001,count=0}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.walkLog, '' )
	end;
})

local TestCaseGetForceLineUpsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = MilitaryHandler():getHandler(11)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(MilitarySender, 'sendForceLineupCfg')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendForceLineupCfg'], {self.player} )
	end;
})

tqMilitaryHandler_t_main = function(suite)
	suite:addTestCase(TestCaseMilitaryHandler, 'TestCaseMilitaryHandler')
	suite:addTestCase(TestCaseGetMilitaryInfoHdr, 'TestCaseGetMilitaryInfoHdr')
	suite:addTestCase(TestCaseDelFavoriteTargetHdr, 'TestCaseDelFavoriteTargetHdr')
	suite:addTestCase(TestCaseSetDefaultTeamHdr, 'TestCaseSetDefaultTeamHdr')
	suite:addTestCase(TestCaseGetAllArmysHdr, 'TestCaseGetAllArmysHdr')
	suite:addTestCase(TestCaseBaseCallBackArmyHdr, 'TestCaseBaseCallBackArmyHdr')
	suite:addTestCase(TestCaseCallBackArmyHdr, 'TestCaseCallBackArmyHdr')
	suite:addTestCase(TestCaseRepatriateArmyHdr, 'TestCaseRepatriateArmyHdr')
	suite:addTestCase(TestCaseAddFavoriteTargetHdr, 'TestCaseAddFavoriteTargetHdr')
	suite:addTestCase(TestCaseDeclareFightHdr, 'TestCaseDeclareFightHdr')
	suite:addTestCase(TestCaseGetFavoritesHdr, 'TestCaseGetFavoritesHdr')
	suite:addTestCase(TestCaseSaveForceLineUpHdr, 'TestCaseSaveForceLineUpHdr')
	suite:addTestCase(TestCaseGetForceLineUpsHdr, 'TestCaseGetForceLineUpsHdr')
end;

