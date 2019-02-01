--*******************************************************************************
--*******************************************************************************
require('tqStateContainer')

local TestCaseStateContainer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getStatesCount = function(self)
		local stateContainer = StateContainer(self.player, {count=0,lastStateId=0,states={}}, 10)
		stateContainer:start()
		stateContainer.states = {1}
		assertEQ ( stateContainer:getStatesCount(), 1 )
	end;
	
	test_getStateByIdx = function(self)
		local stateContainer = StateContainer(self.player, {count=0,lastStateId=0,states={}}, 10)
		stateContainer:start()
		stateContainer.states = {1,10,100}
		assertEQ ( stateContainer:getStateByIdx(1), 1 )
		assertEQ ( stateContainer:getStateByIdx(2), 10 )
		assertEQ ( stateContainer:getStateByIdx(3), 100 )
	end;
	
	test_allocId = function(self)
		local stateContainer = StateContainer(self.player, {count=0,lastStateId=0, states={}}, 10)
		stateContainer:start()
		assert ( stateContainer:_allocId() == 1 )
		assert ( stateContainer:_allocId() == 2 )
	end;
	
	test_createStateObjs = function(self)
		local g_innerStates = {count=1,lastStateId=0, states={}}
		g_innerStates.states[0] = {id=1,times=1,type = EFFECT_TYPE.PER_SECOND,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		
		local stateContainer = StateContainer(self.player, g_innerStates, 10)
		stateContainer:start()
		
		local mm = MMock()
		mm:mock(stateContainer, '_createStateObj')
		
		stateContainer:_createStateObjs()
		mm:restore()
		
		assertListEQ ( mm.params['_createStateObj'], {g_innerStates.states[0]} )
		assert ( mm.walkLog == '_createStateObj' )
	end;
	
	test_createStateObj = function(self)
		local stateContainer = StateContainer(self.player, {count=0,lastStateId=0, states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=0,effect={id=0}}
		local g_state = State(self.player, 0, g_innerState)
		
		local mm = MMock()
		mm:mock(StateCreator, 'create', {g_state})
		
		stateContainer:_createStateObj(g_innerState)
		mm:restore()
		
		assert ( mm.walkLog == 'create' )
		assertListEQ ( mm.params['create'], {self.player, 1, g_innerState} )
		assert ( table.getn(stateContainer.states) == 1 )
		assert ( stateContainer.states[1] == g_state )
	end;
	
	test_allocInnerState = function(self)
		local innerStates = CppPlayerVar:allocVar('SState')
		innerStates.var.count = 0
		
		local stateContainer = StateContainer(self.player, innerStates.var, 1)
		stateContainer:start()
		
		local state = stateContainer:_allocInnerState()
		assert ( state == innerStates.var.states[0] )
		assert ( stateContainer.innerStates.count == 1 )
		
		assert (  stateContainer:_allocInnerState() == nil )
	end;
	
	test_startStates = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=0,effect={id=0}}
		local g_state = State(self.player, 0, g_innerState)
		table.insert( stateContainer.states, g_state )
		
		local mm = MMock()
		mm:mock(stateContainer, '_startState', nil)
		stateContainer:_startStates()
		mm:restore()
		
		assertListEQ ( mm.params['_startState'], {g_state} )
	end;
	
	test_startState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=2, type=1, effect={id=0}, lastTime=0, duration=10 }
		local g_state = State(self.player, 2, g_innerState)
		
		self.mm:mock(StateUtil, 'getEffectStateElapse', {10})
		self.mm:mock(global.getTimer(), 'start')
		self.mm:mock(RoleStateSender, 'sendAddState', nil)
		self.mm:mock(g_state, 'enter', nil)
		
		stateContainer:_startState(g_state)
		
		assertEQ ( self.mm.walkLog, 'getEffectStateElapse,start,sendAddState,enter' )
		assertEQ ( self.mm.params['getEffectStateElapse'], {g_state} )
		assertEQ ( self.mm.params['start'], {10*1000, {TIMER_EVT.PLAYER_BUFF, 2}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['sendAddState'], {self.player, g_state} )
	end;
	
	test__stopState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=2, type=1, effect={id=0}}
		local g_state = State(self.player, 2, g_innerState)
		local g_hdr = {}

		self.mm:mock(g_state, 'leave')
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(stateContainer, '_removeStateById')
		self.mm:mock(RoleStateSender, 'sendDelState')
		
		stateContainer:_stopState(global.getTimer(), g_state)
		
		assertEQ ( self.mm.walkLog, 'stop,sendDelState,_removeStateById,leave' )
		assertEQ ( self.mm.params['sendDelState'], {self.player, g_state} )
		assertEQ ( self.mm.params['_removeStateById'], {g_state:getId()} )
	end;
	
	test_getStateById = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		stateContainer.states = {}
		table.insert(stateContainer.states, State(self.player, 1, {id=1}))
		table.insert(stateContainer.states, State(self.player, 2, {id=2}))
		
		assert ( stateContainer:_getStateById(1):getId() == 1 )
		assert ( stateContainer:_getStateById(2):getId() == 2 )
		assert ( stateContainer:_getStateById(3) == nil )
	end;
	
	test_hasEffectState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		stateContainer.states = {}
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=3}}))
		
		assert ( stateContainer:hasEffectState(1) == false )
		assert ( stateContainer:hasEffectState(3) == true )
	end;
	
	test_getEffectStates = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		stateContainer.states = {}
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=3}}))
		table.insert(stateContainer.states, State(self.player, 2, {id=2,effect={id=3}}))
		
		local states = stateContainer:_getEffectStates(1)
		assert ( table.getn(states) == 0 )
		
		local states = stateContainer:_getEffectStates(3)
		assert ( table.getn(states) == 2 )
	end;
	
	test_getEffectState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		stateContainer.states = {}
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=3}}))
		
		assert ( stateContainer:getEffectState(1) == nil )
		assert ( stateContainer:getEffectState(3) == stateContainer.states[1] )
	end;
	
	test_removeStateById = function(self)
		local innerStates = CppPlayerVar:allocVar('SState')
		innerStates.var.count = 2
		innerStates.var.states[0].id = 1
		innerStates.var.states[1].id = 2
		
		local stateContainer = StateContainer(self.player, innerStates.var, 10)
		stateContainer:start()
		
		stateContainer:_removeStateById(3)
		assert ( table.getn(stateContainer.states) == 2 )
		
		stateContainer:_removeStateById(1)
		assert ( table.getn(stateContainer.states) == 1 )
		assert ( stateContainer.innerStates.count == 1 )
		assert ( stateContainer.states[1]:getId() == 2 )
		
		CppPlayerVar:freeVar(innerStates.hdr)
	end;
	
	test_removeStateById = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local mm = MMock()
		mm:mock(stateContainer, '_getStateIdxById', {1000})
		mm:mock(stateContainer, '_removeStateByIdx', nil)
		
		stateContainer:_removeStateById(1)
		mm:restore()
		
		assertEQ ( mm.walkLog, '_getStateIdxById,_removeStateByIdx' )
		assertListEQ ( mm.params['_getStateIdxById'], {1} )
		assertListEQ ( mm.params['_removeStateByIdx'], {1000} )
	end;
	
	test_getStateIdxById = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		table.insert(stateContainer.states, State(self.player, 10, {id=10}))
		table.insert(stateContainer.states, State(self.player, 20, {id=20}))
		
		assert ( stateContainer:_getStateIdxById(-1) == -1 )
		assert ( stateContainer:_getStateIdxById(10) == 1 )
		assert ( stateContainer:_getStateIdxById(20) == 2 )
	end;
	
	test_isCanAppend = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=3}}))
		table.insert(stateContainer.states, State(self.player, 2, {id=2,effect={id=4}}))	
		
		self.mm:mock(nil, 'res_get_state_relations', nil, function(id1, id2)
			if (id1 == 4) and (id2 == 5) then
				return STATE_REL.MUTEX
			end
			return 0 end)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
			
		assert ( stateContainer:isCanAppend(5) == false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100101, '"@effid4","@effid5"'} )
		assert ( stateContainer:isCanAppend(6) == true )
	end;
	
	test_stopStatesByRel = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=1}}))
		table.insert(stateContainer.states, State(self.player, 2, {id=2,effect={id=2}}))
		table.insert(stateContainer.states, State(self.player, 3, {id=3,effect={id=1}}))
		table.insert(stateContainer.states, State(self.player, 4, {id=4,effect={id=4}}))
		
		self.mm:mock(nil, 'res_get_state_relations', nil, function(id1, id2)
			if (id1 == 1 or id1 == 4) and (id2 == 5) then
				return STATE_REL.REPLACE
			end
			return 0 end)
		self.mm.ids = ''
		local mm = self.mm
		self.mm:mock(stateContainer, '_stopState', nil, function(self, hdr, state)
			assert ( hdr == 'nil' )
			mm.ids = mm.ids .. state:getId()
			end)
			
		stateContainer:_stopStatesByRel(5)
		
		assert ( mm.ids == '431' )
	end;
	
	test_getCanOverlayState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		table.insert(stateContainer.states, State(self.player, 1, {id=1,effect={id=1}}))
		table.insert(stateContainer.states, State(self.player, 2, {id=2,effect={id=2}}))
		table.insert(stateContainer.states, State(self.player, 3, {id=3,effect={id=3}}))
		table.insert(stateContainer.states, State(self.player, 4, {id=4,effect={id=4}}))
		self.mm:mock(nil, 'res_get_state_relations', nil, function(id1, id2)
			if id1 == 1 then
				return STATE_REL.REPLACE_ADD_DUR
			elseif id1 == 2 then
				return STATE_REL.REPLACE_ADD_VAL
			elseif id1 == 3 then
				return STATE_REL.REPLACE_ADD_DURVAL
			end
			return 0 end)
			
		local ref, state = stateContainer:_getCanOverlayState(1)
		assert ( state:getId() == 1 and ref == STATE_REL.REPLACE_ADD_DUR )
		
		local ref, state = stateContainer:_getCanOverlayState(2)
		assert ( state:getId() == 2 and ref == STATE_REL.REPLACE_ADD_VAL )
		
		local ref, state = stateContainer:_getCanOverlayState(3)
		assert ( state:getId() == 3 and ref == STATE_REL.REPLACE_ADD_DURVAL )
		
		local ref, state = stateContainer:_getCanOverlayState(4)
		assert ( state == nil )
	end;
	
	test_overlayState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=1,type=1,lastTime=1,duration=1,effect={id=3,val=1},creator={type=0,id=0,skillId=0}}
		local g_state = State(self.player, 1, g_innerState)
		
		local mm = MMock()
		mm:mock(g_state, 'addDuration', nil )
		mm:mock(g_state, 'addEffectVal', nil )
		mm:mock(g_state, 'setCreator', nil )
		mm:mock(stateContainer, '_startState', nil )
		
		local g_stateRes = {id=1,type=EFFECT_TYPE.PERDURE,duration=2,val=3,unit=0,isonline=0}
		local g_creator = {type=1,id=2,skillid=3}
		stateContainer:_overlayState(nil, g_state, g_stateRes, g_creator)
		assert ( mm.walkLog == '' )
		
		mm:clear()
		stateContainer:_overlayState(STATE_REL.REPLACE, g_state, g_stateRes, g_creator)
		assert ( mm.walkLog == '' )
		
		mm:clear()
		stateContainer:_overlayState(STATE_REL.REPLACE_ADD_DUR, nil, g_stateRes, g_creator)
		assert ( mm.walkLog == '' )
		
		mm:clear()
		stateContainer:_overlayState(STATE_REL.REPLACE_ADD_DUR, g_state, g_stateRes, g_creator)
		assertEQ ( mm.walkLog, 'addDuration,setCreator,_startState' )
		assertListEQ ( mm.params['addDuration'], {2})
		assertListEQ ( mm.params['setCreator'], {g_creator})
		assertListEQ ( mm.params['_startState'], {g_state})
		
		mm:clear()
		stateContainer:_overlayState(STATE_REL.REPLACE_ADD_VAL, g_state, g_stateRes, g_creator)
		assertEQ ( mm.walkLog, 'addEffectVal,setCreator,_startState' )
		assertListEQ ( mm.params['addEffectVal'], {3})
		assertListEQ ( mm.params['setCreator'], {g_creator})
		assertListEQ ( mm.params['_startState'], {g_state})
		
		mm:clear()
		stateContainer:_overlayState(STATE_REL.REPLACE_ADD_DURVAL, g_state, g_stateRes, g_creator)
		assertEQ ( mm.walkLog, 'addDuration,addEffectVal,setCreator,_startState' )
		assertListEQ ( mm.params['addDuration'], {2})
		assertListEQ ( mm.params['addEffectVal'], {3})
		assertListEQ ( mm.params['setCreator'], {g_creator})
		assertListEQ ( mm.params['_startState'], {g_state})
		
		mm:restore()
	end;
	
	test_removeStateByIdx = function(self)
		local innerStates = CppPlayerVar:allocVar('SState')
		innerStates.var.count = 2
		innerStates.var.states[0].id = 1
		innerStates.var.states[1].id = 2
		
		local stateContainer = StateContainer(self.player, innerStates.var, 10)
		stateContainer:start()

		stateContainer:_removeStateByIdx(0)
		stateContainer:_removeStateByIdx(3)
		assert ( table.getn(stateContainer.states) == 2 )
		
		stateContainer:_removeStateByIdx(1)
		assert ( table.getn(stateContainer.states) == 1 )
		assert ( stateContainer.innerStates.count == 1 )
		assert ( stateContainer.states[1]:getId() == 1000 + 2 )
		
		CppPlayerVar:freeVar(innerStates.hdr)	
	end;
	
	test__appendNewState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {{}}
		local g_state = State(self.player, 1, {id=1})
		local g_stateRes = {}
		local g_creator = {}
		
		local mm = MMock()
		mm:mock(stateContainer, '_allocInnerState', g_innerState)
		mm:mock(stateContainer, '_initInnerState')
		mm:mock(stateContainer, '_createStateObj', {g_state})
		mm:mock(stateContainer, '_startState', nil)
		
		stateContainer:_appendNewState(g_stateRes, g_creator)
		
		assert ( mm.walkLog == '_allocInnerState,_initInnerState,_createStateObj,_startState' )
		assertListEQ ( mm.params['_initInnerState'], {g_innerState[1], g_stateRes, g_creator} )
		assertListEQ ( mm.params['_createStateObj'], {g_innerState[1]} )
		assertListEQ ( mm.params['_startState'], {g_state} )
		
		mm:clear()
		g_innerState[1] = nil
		stateContainer:_appendNewState(g_stateRes, g_creator)
		assert ( mm.walkLog == '_allocInnerState' )
		
		mm:restore()
	end;
	
	test_appendState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_stateRes = {effect={id=1}}
		local g_creator = {}
		local g_ref = 0
		local g_state = {}
		local g_isCanAppendRt = {true}
		local g_getCanOverlayStateRt = {g_ref, g_state}
		
		local mm = MMock()
		mm:mock(stateContainer, 'isCanAppend', g_isCanAppendRt)
		mm:mock(stateContainer, '_stopStatesByRel', nil)
		mm:mock(stateContainer, '_getCanOverlayState', g_getCanOverlayStateRt)
		mm:mock(stateContainer, '_overlayState', nil)
		mm:mock(stateContainer, '_appendNewState', nil)
		
		stateContainer:appendState(g_stateRes, g_creator)
		assert ( mm.walkLog == 'isCanAppend,_stopStatesByRel,_getCanOverlayState,_overlayState' )
		assertListEQ ( mm.params['isCanAppend'], {1} )
		assertListEQ ( mm.params['_stopStatesByRel'], {1} )
		assertListEQ ( mm.params['_getCanOverlayState'], {1} )
		assertListEQ ( mm.params['_overlayState'], {g_ref, g_state, g_stateRes, g_creator} )
		
		--
		mm:clear()
		g_getCanOverlayStateRt[1] = nil
		g_getCanOverlayStateRt[2] = nil
		
		stateContainer:appendState(g_stateRes, g_creator)
		assert ( mm.walkLog == 'isCanAppend,_stopStatesByRel,_getCanOverlayState,_appendNewState' )
		assertListEQ ( mm.params['isCanAppend'], {1} )
		assertListEQ ( mm.params['_stopStatesByRel'], {1} )
		assertListEQ ( mm.params['_getCanOverlayState'], {1} )
		assertListEQ ( mm.params['_appendNewState'], {g_stateRes, g_creator} )
		
		--
		mm:clear()
		g_isCanAppendRt[1] = false
		stateContainer:appendState(g_stateRes, g_creator)
		assert ( mm.walkLog == 'isCanAppend' )
		assertListEQ ( mm.params['isCanAppend'], {1} )
		
		mm:restore()
	end;
	
	test_stopState = function(self)
		local g_innerState1 = {id=1,type=1,lastTime=1,duration=1,effect={id=1,val=1},creator={type=0,id=0,skillId=0}}
		local g_innerState2 = {id=2,type=1,lastTime=1,duration=1,effect={id=1,val=10},creator={type=0,id=0,skillId=0}}
		local g_innerState3 = {id=3,type=1,lastTime=1,duration=1,effect={id=2,val=100},creator={type=0,id=0,skillId=0}}
		
		local states = self.player:getPersistVar().states
		states.count = 3
		Util:dictCopy(states.states[0], g_innerState1)
		Util:dictCopy(states.states[1], g_innerState2)
		Util:dictCopy(states.states[2], g_innerState3)	
		
		local stateContainer = StateContainer(self.player, states, 10)
		stateContainer:start()
		
		local state1 = stateContainer:getStateByIdx(1)
		local state2 = stateContainer:getStateByIdx(2)
		
		self.mm:travelMock(stateContainer, '_stopState' )
		stateContainer:stopState(1)
		assertEQ ( self.mm.walkLog, '_stopState,_stopState' )
		assertEQ ( self.mm.params['_stopState.1'], {'nil', state2} )
		assertEQ ( self.mm.params['_stopState.2'], {'nil', state1} )
		assertEQ ( stateContainer:hasEffectState(1), false )
	end;
	
	test__initInnerState = function(self)
		local stateContainer = StateContainer(self.player, {count=0,states={}}, 10)
		stateContainer:start()
		
		local g_innerState = {id=1,startTime=-1,lastTime=-1,type=1,duration=1, effect={id=1,unit=0,val=1},creator={type=0,id=0,skillId=0}}
		stateContainer:_initInnerState(g_innerState, {type=3, duration=2, effect={id=4, val=5, unit=1} }, {type=6, id=7, skillId=8} )
		assertEQ ( g_innerState.startTime, Util:getTime() )
		assertEQ ( g_innerState.lastTime, Util:getTime() )
		assertEQ ( g_innerState.type, 3 )
		assertEQ ( g_innerState.duration, 2 )
		assertEQ ( g_innerState.effect, {id=4, val=5, unit=1} )
		assertEQ ( g_innerState.creator, {type=6, id=7, skillId=8} )
	end;
	
	comm_updateStateForEffectType = function(self, effectType)
		self.mm:mock(global.getTimer(), 'stop' )
		local stateContainer = self.player:getStateContainer()
		stateContainer:updateState(global.getTimer(), 0)
		assertEQ ( self.mm.walkLog, 'stop' )
		
		Util:setTimeDrt(0)
		local stateRes = {type=effectType, duration=10, effect={id=RES_EFF.ADD_THREE_BUILDINGPOS,val=3,unit=0}}
		stateContainer:appendState(stateRes, {type=0,id=0,skillId=0})
		local state = stateContainer:getStateByIdx(1)
		
		self.mm:clear()
		Util:setTimeDrt(8)
		stateContainer:updateState(global.getTimer(), state:getId())
		assertEQ ( stateContainer:getStateByIdx(1) ~= nil, true, 'effectType:' .. effectType )
		assertEQ ( self.mm.walkLog, 'stop', 'effectType:' .. effectType )
		
		self.mm:clear()
		Util:setTimeDrt(9)
		stateContainer:updateState(global.getTimer(), state:getId())
		assertEQ ( stateContainer:getStateByIdx(1) == nil, true, 'effectType:' .. effectType )	
	end;
	
	test_updateStateForPERDURE = function(self)
		self:comm_updateStateForEffectType(EFFECT_TYPE.PERDURE)
	end;
	
	test_updateStateForONETIME = function(self)
		self:comm_updateStateForEffectType(EFFECT_TYPE.ONETIME)
	end;
})

tqStateContainer_t_main = function(suite)
	suite:addTestCase(TestCaseStateContainer, 'TestCaseStateContainer')
end;


