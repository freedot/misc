--*******************************************************************************
--  
--*******************************************************************************
require('tqTowerHandler')

local TestCaseTowerHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TowerHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , TowerSoldiersAssignHandler )
	end;
})

local TestCaseNetCmdSoldierParser = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.parser = NetCmdSoldierParser()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getSoldiers = function(self)
		local p_maxCount = MAX_TEAM_HERO_CNT
		local p_cmd = {count=0}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), nil )
		
		p_cmd = {count=MAX_TEAM_HERO_CNT+1}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), nil )
		
		p_cmd = {count=1, hid1=1, sid1=1}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), nil )
		
		p_cmd = {count=1, hid1=1, sid1=0, snum1=1}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), nil )
		
		p_cmd = {count=1, hid1=1, sid1=0, snum1=0}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), {{id=1,resid=0,number=0}} )
		
		p_cmd = {count=1, hid1=1, sid1=150001001, snum1=-1}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), nil )
		
		p_cmd = {count=1, hid1=1, sid1=150001001, snum1=0}
		assertEQ ( self.parser:getSoldiers(p_cmd, p_maxCount), {{id=1,resid=150001001,number=0}} )
	end;
	
	test__isValidSoldierId = function(self)
		assertEQ ( self.parser:_isValidSoldierId(150001000), false )
		assertEQ ( self.parser:_isValidSoldierId(150001001), true )
		assertEQ ( self.parser:_isValidSoldierId(150001010), true )
		assertEQ ( self.parser:_isValidSoldierId(150001011), false )
		assertEQ ( self.parser:_isValidSoldierId(150000001), false )
		assertEQ ( self.parser:_isValidSoldierId(150006001), false )
	end;	
})

local TestBaseSoldiersAssignHandler = BaseSoldiersAssignHandler:extends({
	_getCurSoldierByIdx = function(self, idx) end;
	_recordChange = function(self, idx, resid) end;	
	_carrySoldier = function(self, idx, setSoldier) end;
	_getCarriedNumber = function(self, resid) end;	
	_getCommand = function(self) end;	
	_getHeroCount = function(self) end;
	_clearSoldier = function(self) end;
})

local TestCaseBaseSoldiersAssignHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TestBaseSoldiersAssignHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__hasNoAssignNoChange = function(self)
		self.hdr.player = self.player
		
		local r_getCurSoldierByIdx = {{resid=150001001, number=1}}
		self.mm:mock( self.hdr, '_getCurSoldierByIdx', r_getCurSoldierByIdx )
		
		self.hdr.soldiers = {{id=1, resid=150001001, number=1}}
		assertEQ ( self.hdr:_hasNoAssignNoChange(), true )
		assertEQ ( self.mm.params['_getCurSoldierByIdx'], {1} )
		
		self.hdr.soldiers = {{id=1, resid=150001001, number=2}}
		assertEQ ( self.hdr:_hasNoAssignNoChange(), false )
		
		self.hdr.soldiers = {{id=1, resid=150001002, number=1}}
		assertEQ ( self.hdr:_hasNoAssignNoChange(), false )
	end;
	
	test__hasBeyondHasSoldiersNumber = function(self)
		local r_getNeedNumbers = {{}}
		r_getNeedNumbers[1][150001001] = 1
		self.mm:mock(self.hdr, '_getNeedNumbers', r_getNeedNumbers)
		self.mm:mock(self.hdr, '_getHasNumber', {1})
		
		assertEQ ( self.hdr:_hasBeyondHasSoldiersNumber(), false)
		assertEQ ( self.mm.params['_getHasNumber'], {150001001} )
		
		r_getNeedNumbers[1][150001001] = 2
		assertEQ ( self.hdr:_hasBeyondHasSoldiersNumber(), true)
	end;
	
	test__getNeedNumbers = function(self)
		self.hdr.soldiers = {
			{id=1,resid=150001001,number=1}
			,{id=2,resid=150001001,number=1}
			,{id=3,resid=150001002,number=3} }
		local needNumbers = self.hdr:_getNeedNumbers()
		assertEQ ( needNumbers[150001001], 2 )
		assertEQ ( needNumbers[150001002], 3 )
	end;
	
	test__getHasNumber = function(self)
		self.hdr.player = self.player 
		
		local r_getCarriedNumber = {1}
		self.mm:mock( self.hdr, '_getCarriedNumber', r_getCarriedNumber )
		
		local p_resid = 0
		assertEQ ( self.hdr:_getHasNumber(p_resid), 0 )
		
		self.player:getSoldierMgr():addSoldier({resid=150001001,number=1})
		assertEQ ( self.hdr:_getHasNumber(150001001), 1+1 )
		assertEQ ( self.mm.params['_getCarriedNumber'], {150001001} )
	end;
	
	test__hasBeyondCommand = function(self)
		self.mm:mock(self.hdr, '_getCommand', {10})
		self.hdr.soldiers = {{number=10}}
		assertEQ ( self.hdr:_hasBeyondCommand(), false )
		assertEQ ( self.mm.params['_getCommand'], {1} )
		
		self.hdr.soldiers = {{number=11}}
		assertEQ ( self.hdr:_hasBeyondCommand(), true )
	end;
	
	test__takeOff = function(self)
		self.hdr.player = self.player
		self.hdr.changedSoldiers = {}
		
		local r_getCurSoldierByIdx = {{resid=0}}
		self.mm:mock( self.hdr, '_getHeroCount', {1} )
		self.mm:mock( self.hdr, '_getCurSoldierByIdx', r_getCurSoldierByIdx )
		self.mm:mock(self.player:getSoldierMgr(), 'addSoldier' )
		self.mm:mock( self.hdr, '_clearSoldier')
		self.mm:mock( self.hdr, '_recordChange')
		
		self.hdr:_takeOff()
		assertEQ ( self.mm.walkLog, '_getHeroCount,_getCurSoldierByIdx' )
		assertEQ ( self.mm.params['_getCurSoldierByIdx'], {1} )
		
		self.mm:clear()
		r_getCurSoldierByIdx[1] = {resid=150001001, number=0}
		self.hdr:_takeOff()
		assertEQ ( self.mm.walkLog, '_getHeroCount,_getCurSoldierByIdx' )
		
		self.mm:clear()
		r_getCurSoldierByIdx[1] = {resid=150001001, number=1}
		self.hdr:_takeOff()
		assertEQ ( self.mm.walkLog, '_getHeroCount,_getCurSoldierByIdx,addSoldier,_clearSoldier,_recordChange' )
		assertEQ ( self.mm.params['addSoldier'], {{resid=150001001, number=1}} )
		assertEQ ( self.mm.params['_clearSoldier'], {1, {resid=150001001, number=1}} )
		assertEQ ( self.mm.params['_recordChange'], {1, 150001001} )
	end;
	
	test__confirmAllAssigns = function(self)
		self.hdr.player = self.player
		self.hdr.changedSoldiers = {}
		self.hdr.soldiers = {{id=1, resid=150001001, number=2}}
		self.mm:mock(self.player:getSoldierMgr(), 'subSoldier' )
		self.mm:mock(self.hdr, '_carrySoldier' )
		self.mm:mock(self.hdr, '_recordChange' )
		self.hdr:_confirmAllAssigns()
		assertEQ ( self.mm.walkLog, 'subSoldier,_carrySoldier,_recordChange' )
		assertEQ ( self.mm.params['subSoldier'], {self.hdr.soldiers[1]} )
		assertEQ ( self.mm.params['_carrySoldier'], {1, self.hdr.soldiers[1]} )
		assertEQ ( self.mm.params['_recordChange'], {1, self.hdr.soldiers[1].resid} )
	end;	
})

local TestCaseTowerSoldiersAssignHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TowerSoldiersAssignHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		self.mm:mock(NetCmdSoldierParser, 'new', {{name='soldierParser'}} )
		self.hdr:init()
		assertEQ ( self.hdr.paramParser, {name='soldierParser'} )
	end;
	
	test_handle = function(self)
		local r_initParams = {false}
		local r_hasInvalidTowerId = {true}
		local r_hasNoAssignNoChange = {true}
		local r_hasRepeatTowerId = {true}
		local r_hasBeyondHasSoldiersNumber = {true}
		local r_hasBeyondCommand = {true}
		self.mm:mock(self.hdr, '_initParams', r_initParams )
		self.mm:mock(self.hdr, '_hasInvalidTowerId', r_hasInvalidTowerId )
		self.mm:mock(self.hdr, '_hasNoAssignNoChange', r_hasNoAssignNoChange )
		self.mm:mock(self.hdr, '_hasRepeatTowerId', r_hasRepeatTowerId )
		self.mm:mock(self.hdr, '_hasBeyondHasSoldiersNumber', r_hasBeyondHasSoldiersNumber )
		self.mm:mock(self.hdr, '_hasBeyondCommand', r_hasBeyondCommand )
		self.mm:mock(self.hdr, '_takeOff' )
		self.mm:mock(self.hdr, '_confirmAllAssigns' )
		self.mm:mock(self.hdr, '_sendMsgs' )
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['_initParams'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParams[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId' )
		
		self.mm:clear()
		r_hasInvalidTowerId[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId,_hasNoAssignNoChange' )
		
		self.mm:clear()
		r_hasNoAssignNoChange[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId,_hasNoAssignNoChange,_hasRepeatTowerId' )
		
		self.mm:clear()
		r_hasRepeatTowerId[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId,_hasNoAssignNoChange,_hasRepeatTowerId,_hasBeyondHasSoldiersNumber' )
		
		self.mm:clear()
		r_hasBeyondHasSoldiersNumber[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId,_hasNoAssignNoChange,_hasRepeatTowerId,_hasBeyondHasSoldiersNumber,_hasBeyondCommand' )
		
		self.mm:clear()
		r_hasBeyondCommand[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParams,_hasInvalidTowerId,_hasNoAssignNoChange,_hasRepeatTowerId,_hasBeyondHasSoldiersNumber,_hasBeyondCommand,_takeOff,_confirmAllAssigns,_sendMsgs' )
	end;
	
	test__initParams = function(self)
		local r_getSoldiersFromCmd = {nil}
		self.mm:mock(self.hdr.paramParser, 'getSoldiers', r_getSoldiersFromCmd)
		
		local p_cmd = {}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false)
		assertEQ ( self.mm.params['getSoldiers'], {p_cmd, MAX_TEAM_HERO_CNT} )
		
		r_getSoldiersFromCmd[1] = {{id=1,resid=0,number=0}}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), true )
		assertEQ ( self.hdr.soldiers, r_getSoldiersFromCmd[1] )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.changedSoldiers, {} )
	end;
	
	test__hasInvalidTowerId = function(self)
		self.hdr.soldiers = {{id=1}}
		assertEQ ( self.hdr:_hasInvalidTowerId(), false )
		
		self.hdr.soldiers = {{id=0}}
		assertEQ ( self.hdr:_hasInvalidTowerId(), true )
		
		self.hdr.soldiers = {{id=MAX_TEAM_HERO_CNT+1}}
		assertEQ ( self.hdr:_hasInvalidTowerId(), true )
	end;
	
	test__hasRepeatTowerId = function(self)
		self.hdr.soldiers = {{id=1, resid=150001001, number=1}}
		assertEQ ( self.hdr:_hasRepeatTowerId(), false )
		
		self.hdr.soldiers = {{id=1, resid=150001001, number=1},{id=2, resid=0, number=0}}
		assertEQ ( self.hdr:_hasRepeatTowerId(), false )
		
		self.hdr.soldiers = {{id=1, resid=150001001, number=1},{id=2, resid=0, number=0},{id=2, resid=0, number=0}}
		assertEQ ( self.hdr:_hasRepeatTowerId(), true )
	end;
	
	test__getCurSoldierByIdx = function(self)
		self.hdr.player = self.player
		self.hdr.soldiers = {{id=2,resid=0,number=0}}
		self.player:getArmyContainer():setTowerSoldier(2, {resid=150001001, number=2})
		assertEQ ( self.hdr:_getCurSoldierByIdx(1), {id=2, resid=150001001, number=2})
	end;
	
	test__recordChange = function(self)
		self.hdr.changedSoldiers = {}
		self.mm:mock( Util, 'insertUnique' )
		self.hdr:_recordChange(1, 150001001)
		assertEQ ( self.mm.params['insertUnique'], {self.hdr.changedSoldiers, 'nil', 150001001} )
	end;
	
	test__carrySoldier = function(self)
		self.hdr.player = self.player
		self.mm:mock( self.player:getArmyContainer(), 'setTowerSoldier' )
		self.hdr:_carrySoldier(0, {id=1, resid=150001001, number=2})
		assertEQ ( self.mm.params['setTowerSoldier'], {1, {id=1, resid=150001001, number=2}} )
	end;
	
	test__getCarriedNumber = function(self)
		self.hdr.player = self.player
		self.player:getArmyContainer():setTowerSoldier(1, {resid=150001001, number=1})
		self.player:getArmyContainer():setTowerSoldier(2, {resid=150001001, number=2})
		assertEQ ( self.hdr:_getCarriedNumber(150001001), 1+2 )
		assertEQ ( self.hdr:_getCarriedNumber(150001002), 0 )
	end;
	
	test__getCommand = function(self)
		self.hdr.player = self.player
		assertEQ ( self.hdr:_getCommand(), 0 )
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.TOWERBUILD,level=1,state=0} } })
		local towerLevelRes = ItemResUtil:findBuildLevelres(FIXID.TOWERBUILD, 1)
		local fieldHeroRes = ItemResUtil:findItemres(towerLevelRes.fieldheroid)
		assertEQ ( self.hdr:_getCommand(), fieldHeroRes.maxnum )
	end;
	
	test__getHeroCount = function(self)
		self.hdr.soldiers = {{id=1},{id=2}}
		assertEQ ( self.hdr:_getHeroCount(), 2 )
	end;
	
	test__clearSoldier = function(self)
		self.hdr.player = self.player
		self.player:getArmyContainer():setTowerSoldier(1, {resid=150001001, number=10})
		
		self.mm:mock( self.player:getArmyContainer(), 'setTowerSoldier' )
		self.hdr:_clearSoldier(1, {id=1, resid=150001001, number=10})
		assertEQ ( self.mm.params['setTowerSoldier'], {1, {resid=150001001, number=0}} )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.hdr.changedSoldiers = {150001001,150001002}
		
		self.mm:mock(PlayerTowerSender, 'sendTowers' )
		self.mm:mock(RoleSoldierSender, 'sendSoldiersByIds' )
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendTowers,sendSoldiersByIds' )
		assertEQ ( self.mm.params['sendTowers'], {self.player} )
		assertEQ ( self.mm.params['sendSoldiersByIds'], {self.player, self.hdr.changedSoldiers} )
	end;
})

tqTowerHandler_t_main = function(suite)
	suite:addTestCase(TestCaseTowerHandler, 'TestCaseTowerHandler')
	suite:addTestCase(TestCaseBaseSoldiersAssignHandler, 'TestCaseBaseSoldiersAssignHandler')
	suite:addTestCase(TestCaseNetCmdSoldierParser, 'TestCaseNetCmdSoldierParser')
	suite:addTestCase(TestCaseTowerSoldiersAssignHandler, 'TestCaseTowerSoldiersAssignHandler')
end;


