--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqExpedReturnTimerHdr')

TestArmyResHelper = Class:extends({
	createArmy = function(self, sourcePlayer, targetPlayer, expedType, state)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=0})
	
		local lineupId = 180001
		local sourceHeros = {1,2,0,0,0}
		local stopTime = 20
		local army = app:getArmyMgr():addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, expedType,  stopTime)
		
		app:getArmyMgr():changeArmy(army.armyId, state, 0, stopTime)
		
		clearSendMsg_t()
		
		
		return sourcePlayer, targetPlayer, army.armyId, stopTime
	end;
	
	createArmyEx = function(self, sourcePlayer, targetPlayer, expedType, state)
		local _, _, armyId, _ = TestArmyResHelper:createArmy(sourcePlayer, targetPlayer, expedType, state)
		return app:getArmyMgr():getArmyById(armyId)
	end;
	
	createSourcePlayer = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 1)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}}  } })
		return sourcePlayer
	end;
	
	createTargetPlayer = function(self)
		return TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 2)
	end;	
})

local TestCastExpedReturnTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testIsValidArmyId = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle(armyId+1)
		
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testIsValidState = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle(armyId)

		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidStoptime = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=10})
		ExpedReturnTimerHdr:handle(armyId)

		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testRoleArmyReturnFromEnemyRole = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)

		
		local sourceHero = sourcePlayer:getHeroMgr():getHeroByIdx(0)
		assert ( sourceHero:getState() == 0 )
		
		assert ( sourcePlayer:getArmyContainer():getSelfArmyCount() == 0 )
		assert ( targetPlayer:getArmyContainer():getEnemyArmyCount() == 0 )
		assert ( app:getArmyMgr():getArmyById(armyId) == nil )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:0}]}') == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:74,armys:{list:[{id:1,_d:1}]}}') == 2 )
		assert ( sourceHero:getAttrVal(ATTR.HEALTH) == 98)
		assert ( selectSendMsgCnt_t('has@{cmd:78,heros:%[{id:1,attrs:') == 1 )
	end;
	
	testRoleArmyReturnFromEnemyRole_memArmy = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		local army = app:getArmyMgr():getArmyById(armyId)
		army.isMem = true
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)

		
		local sourceHero = sourcePlayer:getHeroMgr():getHeroByIdx(0)
		assert ( sourceHero:getState() == 0 )
		
		assert ( sourcePlayer:getArmyContainer():getSelfArmyCount() == 0 )
		assert ( targetPlayer:getArmyContainer():getEnemyArmyCount() == 0 )
		assert ( app:getArmyMgr():getArmyById(armyId) == nil )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:0}]}') == 0 )
		assert ( selectSendMsgCnt_t('eq@{cmd:74,armys:{list:[{id:1,_d:1}]}}') == 2 )
		assert ( sourceHero:getAttrVal(ATTR.HEALTH) == 98)
		assert ( selectSendMsgCnt_t('has@{cmd:78,heros:%[{id:1,attrs:') == 1 )
	end;
	
	testCopyFieldReturnFromRole = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(CopyFieldPlayer(171001), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)
		
		assert ( targetPlayer:getArmyContainer():getEnemyArmyCount() == 0 )
		assert ( app:getArmyMgr():getArmyById(armyId) == nil )
	end;
	
	testRoleReturnFromField_selfField = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), FieldPlayer(2), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		TestCaseHelper:addSelfField(sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)
		
		assert ( sourcePlayer:getArmyContainer():getSelfArmyCount() == 0 )
		assert ( app:getArmyMgr():getArmyById(armyId) == nil )
		
		local sourceHero = sourcePlayer:getHeroMgr():getHeroByIdx(0)
		assert ( sourceHero:getAttrVal(ATTR.HEALTH) == 100)
	end;
	
	testRoleReturnFromField_otherField = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), FieldPlayer(2), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)
		
		assert ( sourcePlayer:getArmyContainer():getSelfArmyCount() == 0 )
		assert ( app:getArmyMgr():getArmyById(armyId) == nil )
		
		local sourceHero = sourcePlayer:getHeroMgr():getHeroByIdx(0)
		assert ( sourceHero:getAttrVal(ATTR.HEALTH) == 98)
	end;
	
	testRoleReturnFromAllianceRole = function(self)
		local sourcePlayer, targetPlayer, armyId, stopTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.RETURN)
		
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime=20})
		ExpedReturnTimerHdr:handle( armyId)
		
		assert ( selectSendMsgCnt_t('eq@{cmd:74,armys:{list:[{id:1,_d:1}]}}') == 2 )
		
		local sourceHero = sourcePlayer:getHeroMgr():getHeroByIdx(0)
		assert ( sourceHero:getAttrVal(ATTR.HEALTH) == 100)
	end;
	
	test_handle = function(self)
		local handler = ExpedReturnTimerHdr
		
		local g_armyId = 1
		
		local g_initParamsRt = {false}
		local g_isValidStateRt = {false}
		local g_isArriveTimeRt = {false}
		
		self.mm:mock(handler, 'initParams', g_initParamsRt)
		self.mm:mock(handler, 'isValidState', g_isValidStateRt)
		self.mm:mock(handler, 'isArriveTime', g_isArriveTimeRt)
		self.mm:mock(handler, 'setHerosFreeState')
		self.mm:mock(handler, 'subHerosHealth')
		self.mm:mock(handler, 'removeArmy')
		
		assert ( handler:handle(g_armyId) == false )
		assert ( self.mm.walkLog == 'initParams' )
		assertListEQ ( self.mm.params['initParams'], {g_armyId} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( handler:handle(g_armyId) == false )
		assert ( self.mm.walkLog == 'initParams,isValidState' )
		
		self.mm:clear()
		g_isValidStateRt[1] = true
		assert ( handler:handle(g_armyId) == false )
		assert ( self.mm.walkLog == 'initParams,isValidState,isArriveTime' )
		
		self.mm:clear()
		g_isArriveTimeRt[1] = true
		assert ( handler:handle(g_armyId) == true )
		assert ( self.mm.walkLog == 'initParams,isValidState,isArriveTime,setHerosFreeState,subHerosHealth,removeArmy' )
	end;
})

tqExpedReturnTimerHdr_t_main = function(suite)
	suite:addTestCase(TestCastExpedReturnTimerHdr, 'TestCastExpedReturnTimerHdr')
end;

