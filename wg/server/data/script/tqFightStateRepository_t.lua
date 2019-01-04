--*******************************************************************************
require('tqFightStateRepository')

local TestCaseFightRefStateGateway = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_loadAll = function(self)
		local expectSQL = "select * from fightstates;"
		local dbRecords = {
			{id=1, roleId1=10, roleId2=11, fightState=1, stopTime=1000000}
			,{id=2, roleId1=12, roleId2=13, fightState=2, stopTime=1100000}
		}

		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		local states = {}
		assertEQ ( FightRefStateGateway:loadAll(states), 2 )
		assertEQ ( states['10.11'], {id=1, roleId1=10, roleId2=11, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=1000000} )
		assertEQ ( states['12.13'], {id=2, roleId1=12, roleId2=13, state=REF_ROLESTATE.FIGHTING, stopTime=1100000} )
	end;
	
	test_insert = function(self)
		local s = "insert into fightstates values('1','10','11','1','10000');"
		FightRefStateGateway:insert(1, 10, 11, 1, 10000)
		assertEQ ( getLastSql_t(), s )
	end;
	
	test_update = function(self)
		local s = "update fightstates set fightState=2, stopTime=10000 where id=1;"
		FightRefStateGateway:update(1, 10, 11, 2, 10000)
		assert ( getLastSql_t() == s )
	end;
	
	test_delete = function(self)
		local s = "delete from fightstates where id=1;"
		FightRefStateGateway:delete(1)
		assert ( getLastSql_t() == s )
	end;
})

local TestCaseFightStateRepository = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		Repository:getFightState().fightStates_ = {}
		Repository:getFightState().roleMaps_ = {}
		Repository:getFightState().newKeyId_ = 0
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_loadAll = function(self)
		self.mm:mock(FightRefStateGateway, 'loadAll', nil ,function(self, states)
			states['10.11'] = {id=1, roleId1=10, roleId2=11, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=1000000}
			states['11.12'] = {id=2, roleId1=11, roleId2=12, state=REF_ROLESTATE.FIGHTING, stopTime=1100000}
			return 2
		end)
		
		self.mm:mock(Repository:getFightState(), '_startTimer')
		Repository:getFightState():loadAll()
		assertEQ ( Repository:getFightState().newKeyId_, 2 )
		assertEQ ( Repository:getFightState().fightStates_['10.11'], {id=1, roleId1=10, roleId2=11, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=1000000} )
		assertEQ ( Repository:getFightState().fightStates_['11.12'], {id=2, roleId1=11, roleId2=12, state=REF_ROLESTATE.FIGHTING, stopTime=1100000} )
		assertEQ ( self.mm.params['_startTimer.1'], {10, 11, 1000000} )
		assertEQ ( self.mm.params['_startTimer.2'], {11, 12, 1100000} )
		assertEQ ( Repository:getFightState():getRoleMap(9), {} )
		assertEQ ( Repository:getFightState():getRoleMap(10), {11} )
		assertEQ ( Repository:getFightState():getRoleMap(11), {10,12} )
		assertEQ ( Repository:getFightState():getRoleMap(12), {11} )
		
		self.mm:clear()
		Repository:getFightState():loadAll()
		assertEQ ( Repository:getFightState().fightStates_['10.11'], {id=1, roleId1=10, roleId2=11, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=1000000} )
		assertEQ ( Repository:getFightState().fightStates_['11.12'], {id=2, roleId1=11, roleId2=12, state=REF_ROLESTATE.FIGHTING, stopTime=1100000} )
		assertEQ ( Repository:getFightState():getRoleMap(9), {}, 'before load all, need clear' )
		assertEQ ( Repository:getFightState():getRoleMap(10), {11}, 'before load all, need clear' )
		assertEQ ( Repository:getFightState():getRoleMap(11), {10,12}, 'before load all, need clear' )
		assertEQ ( Repository:getFightState():getRoleMap(12), {11}, 'before load all, need clear' )
	end;
	
	test_startDeclareState = function(self)
		Util:setTimeDrt(100)
		self.mm:mock(FightRefStateGateway, 'insert')
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), 0 )
		local state = Repository:getFightState():startDeclareState( 1000000, 1100000 )
		assertEQ ( self.mm.walkLog, 'insert' )
		assertEQ ( self.mm.params['insert'], {1, 1000000, 1100000, REF_ROLESTATE.DECLARING_FIGHT, Util:getTime() + res_declare_fight_interval} )
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.DECLARING_FIGHT )
		assertEQ ( Repository:getFightState():getState(1100000, 1000000), REF_ROLESTATE.DECLARING_FIGHT )
		assertEQ ( Repository:getFightState():getStateObj(1000000, 1100000), state )
		
		self.mm:clear()
		Repository:getFightState():startDeclareState( 1000000, 1100000 )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__startFightState = function(self)
		Util:setTimeDrt(100)
		self.mm:mock(FightRefStateGateway, 'update')
		assertEQ ( Repository:getFightState():getState(1, 2), 0 )
		Repository:getFightState():startDeclareState( 1, 2 )
		
		self.mm:clear()
		Util:setTimeDrt(100 + res_declare_fight_interval + 200)
		Repository:getFightState():_startFightState(2,1)
		assertEQ ( Repository:getFightState():getState(1, 2), 2 )
		assertEQ ( self.mm.walkLog, 'update' )
		assertEQ ( self.mm.params['update'], {1, 1, 2, REF_ROLESTATE.FIGHTING, 100 + res_declare_fight_interval + res_fightting_interval} )
		
		self.mm:clear()
		Repository:getFightState():_startFightState(2,1)
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_timer = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'role1', 1000000)
		local player2 = TestCaseHelper:loadPlayerByUserNameEx('player2', 'role2', 1100000)
		self.mm:mock(FightResStateSender, 'sendState')
		
		Util:setTimeDrt(100)
		os.setClockMs(10000)
		Repository:getFightState():startDeclareState( 1000000, 1100000 )
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.DECLARING_FIGHT )
		assertEQ ( Repository:getFightState():getRoleMap(1000000), {1100000} )
		assertEQ ( Repository:getFightState():getRoleMap(1100000), {1000000} )
		assertEQ ( self.mm.params['sendState.1'], {player1, 1100000} )
		assertEQ ( self.mm.params['sendState.2'], {player2, 1000000} )
		
		-- 模拟以前一个废的timer节点
		global.getTimer():start((res_declare_fight_interval-2)*1000, {TIMER_EVT.FIGHT_REF_STATECHANGE, 1000000, 1100000}, Repository:getFightState():getTimerCaller())
		
		self.mm:clear()
		Util:setTimeDrt(100 + res_declare_fight_interval - 10)
		os.setClockMs(10000 + (res_declare_fight_interval-10)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.DECLARING_FIGHT )
		assertEQ ( global.getTimer():isStoped(), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(100 + res_declare_fight_interval - 2) -- 触发了废节点，通过stopTime来判断合法性，忽略该节点
		os.setClockMs(10000 + (res_declare_fight_interval-2)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.DECLARING_FIGHT )
		assertEQ ( global.getTimer():isStoped(), true )
		
		self.mm:clear()
		Util:setTimeDrt(100 + res_declare_fight_interval - 1)
		os.setClockMs(10000 + (res_declare_fight_interval)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.FIGHTING )
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['sendState.1'], {player1, 1100000} )
		assertEQ ( self.mm.params['sendState.2'], {player2, 1000000} )
		
		-- 模拟以前一个废的timer节点
		global.getTimer():start((res_declare_fight_interval-4)*1000, {TIMER_EVT.FIGHT_REF_STATECHANGE, 1000000, 1100000}, Repository:getFightState():getTimerCaller())
		
		self.mm:clear()
		Util:setTimeDrt(100 + res_declare_fight_interval + res_fightting_interval - 10)
		os.setClockMs(10000 + (res_declare_fight_interval + res_fightting_interval - 10)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.FIGHTING )
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear() -- 触发了废节点，通过stopTime来判断合法性，忽略该节点
		Util:setTimeDrt(100 + res_declare_fight_interval + res_fightting_interval - 4)
		os.setClockMs(10000 + (res_declare_fight_interval + res_fightting_interval - 4)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), REF_ROLESTATE.FIGHTING )
		
		self.mm:clear()
		self.mm:mock(FightRefStateGateway, 'delete')
		Util:setTimeDrt(100 + res_declare_fight_interval + res_fightting_interval-1)
		os.setClockMs(10000 + (res_declare_fight_interval + res_fightting_interval + 1)*1000)
		global.getTimer():update()
		assertEQ ( Repository:getFightState():getState(1000000, 1100000), 0 )
		assertEQ ( self.mm.params['delete'], {1} )
		assertEQ ( self.mm.params['sendState.1'], {player1, 1100000} )
		assertEQ ( self.mm.params['sendState.2'], {player2, 1000000} )
		assertEQ ( Repository:getFightState():getRoleMap(1000000), {} )
		assertEQ ( Repository:getFightState():getRoleMap(1100000), {} )		
	end;
})

local TestCaseRepository = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_load = function(self)
		self.mm:mock(Repository.fightState, 'loadAll:fightStateLoadAll')
		Repository:load()
		assertEQ ( self.mm.walkLog, 'fightStateLoadAll' )
	end;
})

tqFightStateRepository_t_main = function(suite)
	suite:addTestCase(TestCaseFightRefStateGateway, 'TestCaseFightRefStateGateway')
	suite:addTestCase(TestCaseFightStateRepository, 'TestCaseFightStateRepository')
	suite:addTestCase(TestCaseRepository, 'TestCaseRepository')
end;


