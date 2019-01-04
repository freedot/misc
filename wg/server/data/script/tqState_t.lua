--*******************************************************************************
--*******************************************************************************
require('tqState')

local TestCaseStateCreator = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	assertInitOk = function(self, state, g_innState)
		assert ( state.player == self.player )
		assert ( state.state == g_innState )
		assert ( state.state.id == 1 )
		assert ( state.state.lastTime == 10 )
		assert ( state.state.startTime == 10 )	
	end;
	
	test_create = function(self)
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getClass() == State )
		self:assertInitOk( state, g_innState )
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.HURT_BUILDVAL}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getClass() == HurtBuildValState )
		self:assertInitOk( state, g_innState )
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.AVOIDFIGHT}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getClass() == AvoidFightState )
		self:assertInitOk( state, g_innState )
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getClass() == AddCultureSpeedAndMoneyOutputState )
		self:assertInitOk( state, g_innState )
	end;
})

local TestCaseState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getId = function(self)
		local g_innState = {id=1,effect={id=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getId() == 1 )
	end;
	
	test_getType = function(self)
		local g_innState = {id=1,type=1,effect={id=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getType() == 1 )
	end;
	
	test_getStopTime = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getStopTime() == 2 )
	end;
	
	test_getEffectId = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getEffectId() == 3 )
	end;
	
	test_getEffectVal = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=1, val=2}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getEffectVal() == 2 )
	end;
	
	test_getDuration = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=10,effect={id=3}}
		local state = StateCreator:create(self.player, 1, g_innState)
		assert ( state:getDuration() == 10 )
	end;
	
	test_getElapse = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=10,effect={id=3}}
		local state = StateCreator:create(self.player, 1, g_innState)
		
		Util:setTimeDrt(0)
		assert ( state:getElapse() == 0 )
		
		Util:setTimeDrt(2)
		assert ( state:getElapse() == 1 )
		
		Util:setTimeDrt(20)
		assert ( state:getElapse() == 10 )
	end;
	
	test_refreshLastTimeAndDuration = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=10,effect={id=3}}
		local state = StateCreator:create(self.player, 1, g_innState)
		
		Util:setTimeDrt(0)
		state:refreshLastTimeAndDuration()
		assert ( state.state.lastTime == 1 )
		assert ( state.state.duration == 10 )
		
		Util:setTimeDrt(2)
		state:refreshLastTimeAndDuration()
		assert ( state.state.lastTime == 2 )
		assert ( state.state.duration == 9 )
		
		Util:setTimeDrt(20)
		state:refreshLastTimeAndDuration()
		assert ( state.state.lastTime == 20 )
		assert ( state.state.duration == 0 )
	end;
	
	test_addDuration = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3}}
		local state = StateCreator:create(self.player, 1, g_innState)
		state:addDuration(1)
		assert ( state.state.duration == 2 )
	end;
	
	test_addEffectVal = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3,val=1},creator={type=0,id=0,skillId=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		state:addEffectVal(1)
		assert ( state.state.effect.val == 2 )
	end;
	
	test_setCreator = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3,val=1},creator={type=0,id=0,skillId=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		state:setCreator({type=1,id=2,skillId=3})
		assert ( state.state.creator.type == 1 )
		assert ( state.state.creator.id == 2 )
		assert ( state.state.creator.skillId == 3 )
	end;
	
	test_isStateEnd = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3,val=1},creator={type=0,id=0,skillId=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		
		local g_getTypeRt = {0}
		local g_getDurationRt = {0}
		
		local mm = MMock()
		mm:mock(state, 'getType', g_getTypeRt)
		mm:mock(state, 'getDuration', g_getDurationRt)
		
		g_getTypeRt[1] = EFFECT_TYPE.PERDURE
		g_getDurationRt[1] = 10
		assert ( state:isStateEnd() == false )
		
		g_getDurationRt[1] = 0
		assert ( state:isStateEnd() == true )
		
		g_getTypeRt[1] = EFFECT_TYPE.ONETIME
		g_getDurationRt[1] = 10
		assert ( state:isStateEnd() == false )
		
		g_getTypeRt[1] = EFFECT_TYPE.ONETIME
		g_getDurationRt[1] = 0
		assert ( state:isStateEnd() == true )
		
		g_getTypeRt[1] = EFFECT_TYPE.PER_SECOND
		g_getDurationRt[1] = 0
		assert ( state:isStateEnd() == true )
		
		g_getTypeRt[1] = EFFECT_TYPE.PER_SECOND
		g_getDurationRt[1] = 10
		assert ( state:isStateEnd() == false )
		
		mm:restore()
	end;
	
	test_update = function(self)
		local g_innState = {id=1,type=1,lastTime=1,duration=1,effect={id=3,val=1},creator={type=0,id=0,skillId=0}}
		local state = StateCreator:create(self.player, 1, g_innState)
		
		local g_innerUpdateRt = {RET_STATE_END}
		local g_isStateEndRt = {true}
		
		local mm = MMock()
		mm:mock(state, 'getElapse', {100} )
		mm:mock(state, 'innerUpdate', g_innerUpdateRt )
		mm:mock(state, 'refreshLastTimeAndDuration', nil )
		mm:mock(state, 'isStateEnd', g_isStateEndRt )
		
		--
		mm:clear()
		g_innerUpdateRt[1] = RET_STATE_END
		local rt = state:update()
		assert ( rt == RET_STATE_END )
		assert ( mm.walkLog == 'getElapse,innerUpdate' )
		assertListEQ ( mm.params['innerUpdate'], {100} )
		
		--
		mm:clear()
		g_innerUpdateRt[1] = RET_STATE_CONTINUE
		g_isStateEndRt[1] = true
		local rt = state:update()
		assert ( rt == RET_STATE_END )
		assert ( mm.walkLog == 'getElapse,innerUpdate,refreshLastTimeAndDuration,isStateEnd' )
		
		--
		mm:clear()
		g_innerUpdateRt[1] = RET_STATE_CONTINUE
		g_isStateEndRt[1] = false
		local rt = state:update()
		assert ( rt == RET_STATE_CONTINUE )
		assert ( mm.walkLog == 'getElapse,innerUpdate,refreshLastTimeAndDuration,isStateEnd' )
		
		mm:restore()
	end;
})

local TestCaseHurtBuildValState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_innerUpdate = function(self)
		local cres = self.player:getCityRes()
		cres:setBuildVal(1000)
		cres:setBuildHurtVal(500)
		self.player:getCityRes():setLevel(1)
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.HURT_BUILDVAL,val=0,unit=0}}
		local state = HurtBuildValState(self.player, 1, g_innState)
		
		assert ( state:innerUpdate(3600) == RET_STATE_CONTINUE )
		local res = Util:qfind(res_citylevelneeds, 'level', self.player:getCityRes():getLevel())
		local hurtVal = 500 - math.floor(res.hurtvalrestorespeed/3600*3600)
		assert ( cres:getBuildHurtVal() == hurtVal )
		assert ( getSendMsg_t() == '{cmd:60,res:{buildval:{hurt:' .. hurtVal .. '}}}' )
		
		assert ( state:innerUpdate(100000) == RET_STATE_END )
		assert ( cres:getBuildHurtVal() == 0 )
		assert ( getSendMsg_t() == '{cmd:60,res:{buildval:{hurt:0}}}' )
		
		cres:setBuildVal(1000)
		cres:setBuildHurtVal(500)
		self.player:getCityRes():setLevel(1)
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.HURT_BUILDVAL,val=400,unit=1}}
		local state = HurtBuildValState(self.player, 1, g_innState)
		
		assert ( state:innerUpdate(3600) == RET_STATE_CONTINUE )
		local res = Util:qfind(res_citylevelneeds, 'level', self.player:getCityRes():getLevel())
		local hurtVal = 500 - math.floor(res.hurtvalrestorespeed/3600*3600)*4
		assert ( cres:getBuildHurtVal() == hurtVal )
		assert ( getSendMsg_t() == '{cmd:60,res:{buildval:{hurt:' .. hurtVal .. '}}}' )
	end;
	
	test_innerUpdateWhenPlayerDie = function(self)
		local cres = self.player:getCityRes()
		cres:setBuildVal(1000)
		cres:setBuildHurtVal(500)
		self.player:getCityRes():setLevel(1)
		self.player:getCityGrid().objType=OBJ_TYPE.DIED_ROLE
		
		local g_innState = {id=0,lastTime=10,startTime=10,effect={id=RES_EFF.HURT_BUILDVAL,val=0,unit=0}}
		local state = HurtBuildValState(self.player, 1, g_innState)
		
		local oldVal = cres:getBuildHurtVal()
		assert ( state:innerUpdate(3600) == RET_STATE_END )
		assert ( cres:getBuildHurtVal() == oldVal )
		assert ( getSendMsg_t() == '' )
	end;
})

local TestCaseAvoidFightState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.state = AvoidFightState(self.player, RES_EFF.AVOIDFIGHT, {})
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_enter = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.player:setState(ROLE_STATE.FREE)
		self.state:enter()
		assertEQ ( self.player:getState() , ROLE_STATE.REST)
		assertEQ ( self.mm.params['send'], {self.player, {'state'}})
	end;
	
	test_leave = function(self)
		self.player:setState(ROLE_STATE.REST)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.player:getStateContainer(), 'appendState')
		self.state:leave()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=3600*10,  effect={id=RES_EFF.AVOIDFIGHTCD,val=1,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		
		assertEQ ( self.mm.params['appendState'], {stateRes, creator} )
		assertEQ ( self.mm.params['send'], {self.player, {'state'}})
		assertEQ ( self.player:getState() , ROLE_STATE.FREE)
	end;
})

local TestCaseAddCultureSpeedAndMoneyOutputState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.state = AddCultureSpeedAndMoneyOutputState(self.player, RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT, {})
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_enter = function(self)
		self.mm:mock(MoneySender, 'sendAll')
		self.state:enter()
		assertEQ ( self.mm.params['sendAll'], {self.player})
	end;
	
	test_leave = function(self)
		self.mm:mock(MoneySender, 'sendAll')
		self.state:leave()
		assertEQ ( self.mm.params['sendAll'], {self.player})
	end;
})


tqState_t_main = function(suite)
	suite:addTestCase(TestCaseStateCreator, 'TestCaseStateCreator')
	suite:addTestCase(TestCaseState, 'TestCaseState')
	suite:addTestCase(TestCaseHurtBuildValState, 'TestCaseHurtBuildValState')
	suite:addTestCase(TestCaseAvoidFightState, 'TestCaseAvoidFightState')
	suite:addTestCase(TestCaseAddCultureSpeedAndMoneyOutputState, 'TestCaseAddCultureSpeedAndMoneyOutputState')
end;


