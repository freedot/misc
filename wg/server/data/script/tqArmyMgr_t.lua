--*******************************************************************************
require('tqArmyMgr')

local TestCaseArmyDBMapper = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mapper = app:getArmyMgr().mapper
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_loadAllStopTime = function(self)
		local expectSQL = "select armyId, state, stopTime from armys;"
		local dbRecords = {
			{armyId=1, state=ARMYDYN_STATE.GOTO, stopTime=10},
			{armyId=2, state=ARMYDYN_STATE.RETURN, stopTime=11},
			{armyId=3, state=ARMYDYN_STATE.DISPATCH, stopTime=12},
		}
		
		app:regDBQuery(function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end)
		
		local list = self.mapper:loadAllStopTime()
		assertEQ ( #list, 3 )
		assertEQ ( list[1], {armyId=1, state=ARMYDYN_STATE.GOTO, stopTime=10} )
		assertEQ ( list[2], {armyId=2, state=ARMYDYN_STATE.RETURN, stopTime=11} )
		assertEQ ( list[3], {armyId=3, state=ARMYDYN_STATE.DISPATCH, stopTime=12} )
		assertEQ ( expectSQL, getLastSql_t() )
	end;
	
	test_getArmyById = function(self)
		local expectSQL = "select * from armys where armyId=1;"
		local dbRecords = {{}}
		app:regDBQuery(function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords[1])
			else
				dbrows:setRecords({})
			end
		end)
		
		assertEQ ( self.mapper:getArmyById(1),  nil )
		
		dbRecords[1] = {
			{armyId=1,state=2,needTime=2,stopTime=3,sourceId=4,sourceType=5,targetId=6,targetType=7,expedType=8,lineupId=9,fighted=1,buff='{}',
			simpleHeros='{{id=1,name="hero1",level=2,attrs={{attr=3,val=4},{attr=5,val=6},{attr=7,val=8}},soldier={resid=10,number=11}}}'}
		}
		local army = self.mapper:getArmyById(1)
		assertEQ ( army.armyId , 1 )
		assertEQ ( army.isMem , false )
		assertEQ ( army.state , 2 )
		assertEQ ( army.needTime , 2 )
		assertEQ ( army.stopTime , 3 )
		assertEQ ( army.fighted , 1 )
		assertEQ ( army.sourceId , 4 )
		assertEQ ( army.sourceType , 5 )
		assertEQ ( army.targetId , 6 )
		assertEQ ( army.targetType , 7 )
		assertEQ ( army.expedType , 8 )
		assertEQ ( army.lineupId , 9 )
		assertEQ ( table.getn(army.simpleHeros) , 1 )
		assertEQ ( army.simpleHeros[1].id , 1 )
		assertEQ ( army.simpleHeros[1].name , 'hero1' )
		assertEQ ( army.heros[1] , 1 )
		assertEQ ( getLastSql_t() , expectSQL )
		
		clearLastSql_t()
		army = self.mapper:getArmyById(1)
		assertEQ ( army.armyId , 1 )
		assertEQ ( getLastSql_t() , '', 'is from cache' )
	end;
	
	test_insert = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserName('source', 'source_r')
		local tagertPlayer = TestCaseHelper:loadPlayerByUserName('tagert', 'tagert_r')
		local lastArmyId = UUIDMgr:newArmyId() 
		-- params : sourceObj, targetObj, lineupId, sourceHeros, expedType, needTime
		local army = app:getArmyMgr():_createArmy(sourcePlayer, tagertPlayer, 180001, {}, 1, 2)
		self.mapper:insert(army)
		
		local expectSQL = "insert into armys values('" .. army.armyId .. "'"
		expectSQL = expectSQL .. ", '" .. army.sourceId .. "'"
		expectSQL = expectSQL .. ", '" .. army.sourceType .. "'"
		expectSQL = expectSQL .. ", '" .. army.targetId .. "'"
		expectSQL = expectSQL .. ", '" .. army.targetType .. "'"
		expectSQL = expectSQL .. ", '" .. army.expedType .. "'"
		expectSQL = expectSQL .. ", '" .. army.lineupId .. "'"
		expectSQL = expectSQL .. ", '{}'"
		expectSQL = expectSQL .. ", '" .. army.state .. "'"
		expectSQL = expectSQL .. ", '" .. army.startTime .. "'"
		expectSQL = expectSQL .. ", '" .. army.needTime .. "'"
		expectSQL = expectSQL .. ", '" .. army.stopTime .. "'"
		expectSQL = expectSQL .. ", '" .. army.fighted .. "'"
		expectSQL = expectSQL .. ", '{}'"
		expectSQL = expectSQL .. ");"
		assertEQ ( getLastSql_t(), expectSQL )
		
		clearLastSql_t()
		local rtArmy = self.mapper:getArmyById(army.armyId)
		assertEQ ( rtArmy, army )
		assertEQ ( getLastSql_t() , '', 'is from cache' )
		
		army = app:getArmyMgr():_createArmy(sourcePlayer, tagertPlayer, 180001, {}, 1, 2, true)
		clearLastSql_t()
		self.mapper:insert(army)
		assertEQ ( getLastSql_t() , '', 'is from cache' )
		
		clearLastSql_t()
		local rtArmy = self.mapper:getArmyById(army.armyId)
		assertEQ ( rtArmy, army )
		assertEQ ( getLastSql_t() , '', 'is from cache' )
	end;
	
	test_updateState = function(self)
		Util:setTimeDrt(0)
		local sourcePlayer = CopyFieldPlayer(171001)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		targetPlayer:setRoleId(2)
		
		local lineupId = 180001
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local needTime = 10
		local army = app:getArmyMgr():addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime)

		local fighted = 0
		self.mapper:updateState(army)
		assertEQ ( getLastSql_t() , "update armys set state=" .. army.state .. ", fighted=" .. army.fighted .. ", stopTime=" .. army.stopTime .. ", buff='{}' where armyId=" .. army.armyId .. ";" )
		
		army = app:getArmyMgr():addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime, true)
		clearLastSql_t()
		self.mapper:updateState(army)
		assertEQ ( getLastSql_t() , "", "me army" )
	end;
	
	test_delete = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserName('source', 'source_r')
		local tagertPlayer = TestCaseHelper:loadPlayerByUserName('tagert', 'tagert_r')
		local lastArmyId = UUIDMgr:newArmyId() 
		local army = app:getArmyMgr():_createArmy(sourcePlayer, tagertPlayer, 180001, {}, 1, 2, true)
		self.mapper:insert(army)
		assertEQ ( self.mapper:getArmyById(army.armyId), army )
		
		clearLastSql_t()
		self.mapper:delete(army.armyId)
		assertEQ ( getLastSql_t(), "", "mem army" )
		assertEQ ( self.mapper:getArmyById(army.armyId), nil )
		
		army = app:getArmyMgr():_createArmy(sourcePlayer, tagertPlayer, 180001, {}, 1, 2, false)
		self.mapper:insert(army)
		clearLastSql_t()
		self.mapper:delete(army.armyId)
		assertEQ ( getLastSql_t(), "delete from armys where armyId=" .. army.armyId .. ";"  )
		assertEQ ( self.mapper:getArmyById(army.armyId), nil )
	end;
})

local TestCaseArmyMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.armyMgr = app:getArmyMgr()
		self.mapper = self.armyMgr.mapper
		Util:setTimeDrt(0)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_startTimers = function(self)
		Util:setTimeDrt(1)
		self.mm:mock(self.mapper, 'loadAllStopTime', {{{armyId=1, state=ARMYDYN_STATE.GOTO, stopTime=3},{armyId=10, state=ARMYDYN_STATE.RETURN, stopTime=30}}} )
		self.mm:mock(global.getTimer(), 'start' )
		self.armyMgr:startTimers()
		assertEQ ( self.mm.params['start.1'], { 2*1000, {TIMER_EVT.EXPED_STOP, 1}, self.armyMgr:getTimerCaller()} )
		assertEQ ( self.mm.params['start.2'], { 29*1000, {TIMER_EVT.EXPED_RETURN_STOP, 10}, self.armyMgr:getTimerCaller()} )
	end;
	
	test_onTimer_ExpedTimerHdrMgr = function(self)
		self.mm:mock(ExpedTimerHdrMgr, 'handle')
		
		Util:setTimeDrt(0)
		local armyId = 1
		local state = ARMYDYN_STATE.GOTO
		local stopTime = 10
		self.armyMgr:startTimer(armyId, state, stopTime)
		
		Util:setTimeDrt(10)
		os.setClockMs(10*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['handle'], {armyId} )
	end;
	
	test_onTimer_ExpedReturnTimerHdrMgr = function(self)
		self.mm:mock(ExpedReturnTimerHdr, 'handle')
		
		Util:setTimeDrt(0)
		local armyId = 1
		local state = ARMYDYN_STATE.RETURN
		local stopTime = 10
		self.armyMgr:startTimer(armyId, state, stopTime)
		
		Util:setTimeDrt(10)
		os.setClockMs(10*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['handle'], {armyId} )		
	end;
	
	test_getArmyById = function(self)
		self.mm:mock(self.mapper, 'getArmyById', {{armyId=1}} )
		assertEQ ( self.armyMgr:getArmyById(1), {armyId=1} )
		assertEQ ( self.mm.params['getArmyById'], {1} )
	end;
	
	test_getArmyExpedNeedFullTime = function(self)
		local r_army = {nil}
		self.mm:mock(self.mapper, 'getArmyById', r_army )
		assertEQ ( self.armyMgr:getArmyExpedNeedFullTime(1), 0 )
		assertEQ ( self.mm.params['getArmyById'], {1} )
		
		r_army[1] = {needTime=10}
		assertEQ ( self.armyMgr:getArmyExpedNeedFullTime(1), 10 )
	end;
	
	test_getArmyCallBackNeedTime = function(self)
		Util:setTimeDrt(11)
		local r_army = {nil}
		self.mm:mock(self.mapper, 'getArmyById', r_army )
		assertEQ ( self.armyMgr:getArmyCallBackNeedTime(1), 0 )
		
		r_army[1] = {state=ARMYDYN_STATE.RETURN, startTime=1}
		assertEQ ( self.armyMgr:getArmyCallBackNeedTime(1), 0 )
		
		r_army[1] = {state=ARMYDYN_STATE.GOTO, startTime=1}
		assertEQ ( self.armyMgr:getArmyCallBackNeedTime(1), 10 )
	end;
	
	test_addArmy = function(self)
		self.mm:mock(self.mapper, 'insert')
		
		
		-- role paiqian role
		local sourcePlayer = TestCaseHelper:loadPlayerByUserName('source', 'source_r')
		sourcePlayer:setRoleId(1)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		targetPlayer:setRoleId(2)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })
		local hero1 = sourcePlayer:getHeroMgr():getHeroById(1)
		local hero2 = sourcePlayer:getHeroMgr():getHeroById(2)
		hero1:setName('hero1')
		hero2:setName('hero2')
		
		local lineupId = 180001
		local sourceHeros = {1,2,0,0,0}
		local needTime = 10
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.PAIQIAN, needTime)
		assertEQ ( self.mm.params['insert'], {army} )
		assertEQ ( army.armyId, 1 )
		assertEQ ( army.isMem, false )
		assertEQ ( army.state, ARMYDYN_STATE.GOTO )
		assertEQ ( army.stopTime, Util:getTime() + needTime )
		assertEQ ( army.fighted, 0 )
		assertEQ ( army.sourceId, 1 )
		assertEQ ( army.sourceType, OBJ_TYPE.ROLE )
		assertEQ ( army.targetId, 2 )
		assertEQ ( army.targetType, OBJ_TYPE.ROLE )
		assertEQ ( army.expedType, EXPED_TYPE.PAIQIAN )
		assertEQ ( army.lineupId, lineupId )
		assertEQ ( table.getn(army.simpleHeros), 5 )
		assertEQ ( army.simpleHeros[1].id, 1 )
		assertEQ ( army.simpleHeros[2].id, 2 )
		assertEQ ( army.simpleHeros[3].id, 0 )
		assertEQ ( army.simpleHeros[4].id, 0 )
		assertEQ ( army.simpleHeros[5].id, 0 )
		
		assertEQ ( army.heros[1], 1 )
		assertEQ ( army.heros[2], 2 )
		assertEQ ( army.heros[3], 0 )
		
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 1 )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyId(0), 1 )
		assertEQ ( targetPlayer:getArmyContainer():getAllianceArmyCount(), 1 )
		assertEQ ( targetPlayer:getArmyContainer():getAllianceArmyId(0), 1 )
		
		
		-- role taofa role
		local sourcePlayer = TestCaseHelper:loadPlayerByUserName('source1', 'source1_r')
		sourcePlayer:setRoleId(1)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target1', 'target1_r')
		targetPlayer:setRoleId(2)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })
		
		local lineupId = 180001
		local sourceHeros = {1,2,0,0,0}
		local needTime = 10
		local isMemArmy = true
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime, isMemArmy)
		assertEQ ( army.isMem, true )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 1 )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyId(0), army.armyId )
		assertEQ ( targetPlayer:getArmyContainer():getEnemyArmyCount(), 1 )
		assertEQ ( targetPlayer:getArmyContainer():getEnemyArmyId(0), army.armyId )
		
		
		-- role paiqian to field
		local sourcePlayer = TestCaseHelper:loadPlayerByUserName('source2', 'source2_r')
		sourcePlayer:setRoleId(1)
		local targetPlayer = FieldPlayer(2) -- gridId
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })
		
		local lineupId = 180001
		local sourceHeros = {1,2,0,0,0}
		local needTime = 10
		local isMemArmy = false
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.PAIQIAN, needTime, isMemArmy)
		assertEQ ( army.isMem, false )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 1 )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyId(0), army.armyId )	

		
		-- copyField taofa role 
		local sourcePlayer = CopyFieldPlayer(171001)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target3', 'target3_r')
		targetPlayer:setRoleId(2)
		
		local lineupId = 180001
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local needTime = 10
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime)
		assertEQ ( army.sourceId, 171001 )
		assertEQ ( army.sourceType, OBJ_TYPE.COPYFIELD )
		assertEQ ( table.getn(army.simpleHeros), 5 )
	end;
	
	test_changeArmy = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		Util:setTimeDrt(0)
		local sourcePlayer = CopyFieldPlayer(171001)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		targetPlayer:setRoleId(2)
		
		local lineupId = 180001
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local needTime = 10
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime)
		clearLastSql_t()
		assertEQ ( army.stopTime , 10 )
		
		local fighted = 0
		self.armyMgr:changeArmy(army.armyId, ARMYDYN_STATE.DISPATCH, fighted, 20)
		
		assertEQ ( army.stopTime , 20 )
		assertEQ ( getLastSql_t() , "update armys set state=3, fighted=0, stopTime=20, buff='{}' where armyId=1;" )
		assertEQ ( getLastTimer_t().eventid ,  -1 )
		
		self.armyMgr:changeArmy(army.armyId, ARMYDYN_STATE.RETURN, fighted, 1000)
		
		assertEQ ( army.stopTime , 1000 )
		assertEQ ( getLastSql_t() , "update armys set state=2, fighted=0, stopTime=1000, buff='{}' where armyId=1;" )
		assertEQ ( self.mm.params['start'], {1000*1000, {TIMER_EVT.EXPED_RETURN_STOP, 1}, self.armyMgr:getTimerCaller()} )
	end;
	
	test_removeArmy = function(self)
		self.mm:mock(self.mapper, 'delete')
		
		Util:setTimeDrt(0)
		local sourcePlayer = CopyFieldPlayer(171001)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		targetPlayer:setRoleId(2)
		
		local lineupId = 180001
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local needTime = 10
		
		local army = self.armyMgr:addArmy(sourcePlayer, targetPlayer, lineupId, sourceHeros, EXPED_TYPE.TAOFA, needTime)
		clearLastSql_t()
		
		local armyId = 1
		assertEQ ( targetPlayer:getArmyContainer():getEnemyArmyCount(), 1 )
		self.armyMgr:removeArmy(sourcePlayer, targetPlayer, armyId)
		assertEQ ( targetPlayer:getArmyContainer():getEnemyArmyCount(), 0 )
		assertEQ ( self.mm.params['delete'], {army.armyId} )
	end;
})


tqArmyMgr_t_main = function(suite)
	suite:addTestCase(TestCaseArmyDBMapper, 'TestCaseArmyDBMapper')
	suite:addTestCase(TestCaseArmyMgr, 'TestCaseArmyMgr')
end;


