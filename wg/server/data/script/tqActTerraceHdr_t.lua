--*******************************************************************************
require('tqActTerraceHdr')

local TestCaseActTerraceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , ActTerraceGetBaseInfoHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , ActTerraceEnterHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , ActTerraceExpedHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , ActTerraceExitHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , ActTerraceStartAutoFightHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , ActTerraceStopAutoFightHdr )
		assertEQ ( self.hdr:getHandler(7):getClass() , ActTerraceCheckAutoFightHdr )
	end;
})

local TestActTerraceGetBaseInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(1)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTerraceSender, 'sendBaseInfo')
		self.mm:mock(ActTerraceSender, 'sendResults')
		self.mm:mock(ActTerraceSender, 'sendEnterTerrace')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendBaseInfo,sendResults' )
		assertEQ ( self.mm.params['sendBaseInfo'], {self.player} )
		assertEQ ( self.mm.params['sendResults'], {self.player} )
		
		self.mm:clear()
		self.player:getActTerrace():setCurGate({gateId=1, subGateId=2})
		self.player:getActTerrace():setLeftLifes(2)
		self.player:getActTerrace():setStopTime(3)
		
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendBaseInfo,sendResults,sendEnterTerrace' )
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player} )
		
		self.mm:clear()
		self.player:getActTerrace():setCurGate({gateId=1, subGateId=res_act_terrace_max_subgate_id+1})
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendBaseInfo,sendResults' )
	end;
}) 

local TestCaseActTerraceEnterHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(2)	
		self.actTerrace = self.player:getActTerrace()
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	helper_pre = function(self)
		self.mm:clear()
		self.actTerrace:setMaxGate({gateId=8, subGateId=2})
		self.actTerrace:setTodayEnterTimes(1)
		self.player:getPkg():setMaxGridsCnt(100)
		self.player:setLevel(res_enter_terrace_need_rolelevel)
		self.cmd = {gateId=1}
	end;	
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:travelMock( WUtil, 'sendPopBoxMsgArgs' )
		self.mm:travelMock(ActTerraceSender, 'sendEnterTerrace')
		
		self:helper_pre()
		self.cmd.gateId = 0
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		
		self:helper_pre()
		self.cmd.gateId = 9
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		
		self:helper_pre()
		self.player:setLevel(res_enter_terrace_need_rolelevel - 1)
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		
		self:helper_pre()
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		
		self:helper_pre()
		self.actTerrace:setTodayEnterTimes(3)
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100158, ''}, 'today arrive max times' )
		
		self:helper_pre()
		self.actTerrace:setTodayEnterTimes(2)
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.params['sendPopBoxMsgArgs'], {self.player, 100066, '"@itemid' .. FIXID.HEIMULING .. '",1,0,' .. FIXID.HEIMULING }, "has't item" )
		
		self:helper_pre()
		self.actTerrace:setStopTime(1)
		self.actTerrace:setTodayEnterTimes(0)
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getTodayEnterTimes(), 1 )
		assertEQ ( self.actTerrace:getCurGate().gateId, 1 )
		assertEQ ( self.actTerrace:getCurGate().subGateId, 1 )
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player})
		assertEQ ( self.actTerrace:getLeftLifes(), 2 )
		assertEQ ( self.actTerrace:getStopTime(), 0)
		
		self:helper_pre()
		self.actTerrace:setStopTime(1)
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getTodayEnterTimes(), 2 )
		assertEQ ( self.actTerrace:getCurGate().gateId, 1 )
		assertEQ ( self.actTerrace:getCurGate().subGateId, 1 )
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player})
		assertEQ ( self.actTerrace:getLeftLifes(), 2 )
		assertEQ ( self.actTerrace:getStopTime(), 0)
		
		self:helper_pre()
		self.actTerrace:setTodayEnterTimes(2)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HEIMULING, number=1})})
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getTodayEnterTimes(), 3 )
		assertEQ ( self.actTerrace:getLeftLifes(), 3)
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.HEIMULING), 0 )
		
		self:helper_pre()
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1)
		self.actTerrace:setTodayEnterTimes(3)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HEIMULING, number=1})})
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getTodayEnterTimes(), 4 )
		assertEQ ( self.actTerrace:getLeftLifes(), 3)
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.HEIMULING), 0 )
	end;
})

local TestCaseActTerraceExpedHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(3)	
		self.actTerrace = self.player:getActTerrace()
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=6,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_pre = function(self)
		self.mm:clear()
		Util:setTimeDrt(1000)
		self.actTerrace:setLeftLifes(1)
		self.actTerrace:setStopTime(Util:getTime()-1)
		self.actTerrace:setCurGate({gateId=1, subGateId=1})
		self.cmd = {lineup=180001,count=5,hid1=1,hid2=2,hid3=3,hid4=0,hid5=0}
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTerraceSender, 'sendEnterTerrace')
		self.mm:mock(ActTerraceSender, 'sendResult')
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(TaskFinisher, 'checkTasks')
		
		local ExpeditionMgr_isValid = false
		local ExpedTimerHdrMgr_isValid = false
		local ExpedReturnTimerHdr_isValid = false
		local p_player = nil
		local p_cmdtb = nil
		self.mm:mock(ExpeditionMgr, 'handle', nil, function(selfObj, player, cmdtb)
			assertEQ ( player:getHeroMgr():getHeroById(1):getState(), 0)
			assertEQ ( player:getHeroMgr():getHeroById(2):getState(), 1)
			assertEQ ( player:getHeroMgr():getHeroById(3):getState(), 0)
			
			p_player = player
			p_cmdtb = cmdtb
			return ExpeditionMgr_isValid, {armyId=1}
		end)
		
		local sendOBs = { {'fightResult', 1}, {'isSuccess', false}, {'fightDemo', {armyId=1, fightId=2}} }
		self.mm:mock(ExpedTimerHdrMgr, 'handle', nil, function(selfObj, timerHdr, armyId)
			if ExpedTimerHdrMgr_isValid then
				for _, v in ipairs(sendOBs) do
					selfObj:observer(v[1], v[2])
				end
			end
			return ExpedTimerHdrMgr_isValid
		end)
		
		self.mm:mock(ExpedReturnTimerHdr, 'handle', nil, function(selfObj, timerHdr, armyId)
			return ExpedReturnTimerHdr_isValid
		end)
		
		
		self:helper_pre()
		self.actTerrace:setLeftLifes(0)
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self:helper_pre()
		self.actTerrace:setStopTime(Util:getTime() + 1)
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self:helper_pre()
		self.actTerrace:setCurGate({gateId=1, subGateId=8})
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self:helper_pre()
		self.actTerrace:setCurGate({gateId=10, subGateId=1})
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self:helper_pre()
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player} )
		
		self:helper_pre()
		ExpeditionMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 6)
		
		self:helper_pre()
		ExpedTimerHdrMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmd), false )
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 6)
		
		self:helper_pre()
		ExpedReturnTimerHdr_isValid = true
		self.actTerrace:setStopTime(0)
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 6)
			
		assertEQ ( self.actTerrace:getLeftLifes(), 0 )
		assertEQ ( self.actTerrace:getStopTime(), Util:getTime() + 60 )
		assertEQ ( self.actTerrace:getCurGate().gateId, 1 )
		assertEQ ( self.actTerrace:getCurGate().subGateId, 1 )
		assertEQ ( isNotInclude(self.mm.walkLog, 'sendResult'), true )
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player, {armyId=1,fightId=2} } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.JION_ACT_TERRACE} )
		
		self:helper_pre()
		self.actTerrace:getCurGate().subGateId = 2
		self.actTerrace:setResult(0, 1)
		self.actTerrace:setStopTime(0)
		sendOBs = { {'fightResult', 2}, {'isSuccess', true}, {'fightDemo', {armyId=1, fightId=2}}, {'drop', {heroExp=10, items={{id=1500001,number=2}} }} }
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getLeftLifes(), 1 )
		assertEQ ( self.actTerrace:getStopTime(), Util:getTime() + 60 )
		assertEQ ( self.actTerrace:getCurGate().gateId, 1 )
		assertEQ ( self.actTerrace:getCurGate().subGateId, 2 + 1 )
		assertEQ ( self.actTerrace:getMaxGate().gateId, 1 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 2 )
		assertEQ ( self.actTerrace:getResultCount(), 2 )
		assertEQ ( self.actTerrace:getResultByIdx(0), 1 )
		assertEQ ( self.actTerrace:getResultByIdx(1), 2 )
		assertEQ ( self.mm.params['sendResult'], {self.player, 1 } )  -- (1-1)*7 + (2-1)
		assertEQ ( self.mm.params['sendEnterTerrace'], {self.player, {armyId=1,fightId=2} } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.JION_ACT_TERRACE} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		
		self:helper_pre()
		self.actTerrace:getCurGate().gateId = 1
		self.actTerrace:getCurGate().subGateId = 7
		assertEQ ( self.hdr:handle(self.player, self.cmd), true )
		assertEQ ( self.actTerrace:getLeftLifes(), 0 )
		assertEQ ( self.actTerrace:getMaxGate().gateId, 2 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test__clearLeftWhenPassGates = function(self)
		self.actTerrace:getCurGate().gateId = 1
		self.actTerrace:getCurGate().subGateId = 7
		self.actTerrace:setLeftLifes(1)
		self.hdr:_clearLeftWhenPassGates(self.actTerrace)
		assertEQ ( self.actTerrace:getLeftLifes(), 1 )
		
		self.actTerrace:getCurGate().subGateId = 8
		self.actTerrace:setLeftLifes(1)
		self.hdr:_clearLeftWhenPassGates(self.actTerrace)
		assertEQ ( self.actTerrace:getLeftLifes(), 0 )
	end;
	
	test__resetWhenArrivedMaxSubGate = function(self)
		self.actTerrace:getCurGate().gateId = 1
		self.actTerrace:getCurGate().subGateId = 7
		self.actTerrace:setMaxGate({gateId=1, subGateId=7})
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 1 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 7 )
		
		self.actTerrace:getCurGate().gateId = 1
		self.actTerrace:getCurGate().subGateId = 8
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 2 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
		
		self.actTerrace:getCurGate().gateId = 1
		self.actTerrace:getCurGate().subGateId = 8
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 2 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
		
		self.actTerrace:getCurGate().gateId = 2
		self.actTerrace:getCurGate().subGateId = 4
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 2 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
		
		self.actTerrace:getCurGate().gateId = 3
		self.actTerrace:getCurGate().subGateId = 2
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 3 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
		
		self.actTerrace:getCurGate().gateId = 4
		self.actTerrace:getCurGate().subGateId = 8
		self.hdr:_resetWhenArrivedMaxSubGate(self.actTerrace)
		assertEQ ( self.actTerrace:getMaxGate().gateId, 5 )
		assertEQ ( self.actTerrace:getMaxGate().subGateId, 1 )
	end;
})

local TestCaseActTerraceExitHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.actTerrace = self.player:getActTerrace()
		self.hdr = ActTerraceHdr():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTerraceSender, 'sendExitTerrace')
		self.actTerrace:setStopTime(1000)
		self.actTerrace:setLeftLifes(1)
		self.actTerrace:setCurGate({gateId=2, subGateId=3})
		self.hdr:handle(self.player)
		assertEQ ( self.actTerrace:getStopTime(), 0 )
		assertEQ ( self.actTerrace:getLeftLifes(), 0 )
		assertEQ ( self.actTerrace:getCurGate().gateId, 1 )
		assertEQ ( self.actTerrace:getCurGate().subGateId, 1 )
		assertEQ ( self.mm.params['sendExitTerrace'], {self.player})
	end;
})

local TestCaseActTerraceStartAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(5)	
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=6,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(10000)
		self.mm:mock(HeroAttrSender, 'sendHerosState' )
		self.hdr:handle(self.player, {lineup=180001,count=5,hid1=1,hid2=2,hid3=3,hid4=0,hid5=0,toGate=2})
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		local hero2 = self.player:getHeroMgr():getHeroById(2)
		local hero3 = self.player:getHeroMgr():getHeroById(3)
		assertEQ ( hero1:getState(), 6)
		assertEQ ( hero2:getState(), 1)
		assertEQ ( hero3:getState(), 6)
		assertEQ ( self.mm.params['sendHerosState'], {self.player, {hero1} } )
		assertEQ ( self.player:getActTerrace():getAutoStartTime(), Util:getTime())
		assertEQ ( self.player:getActTerrace():getAutoToSubGateId(), 2)
	end;
})

local TestCaseActTerraceStopAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(6)	
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=6,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=6,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.player:getActTerrace():setAutoStartTime(1000)
		self.mm:mock(HeroAttrSender, 'sendHerosState' )
		self.hdr:handle(self.player)
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		local hero3 = self.player:getHeroMgr():getHeroById(3)
		assertEQ ( hero1:getState(), 0)
		assertEQ ( hero3:getState(), 0)
		assertEQ ( self.mm.params['sendHerosState'], {self.player, {hero1, hero3} } )
		assertEQ ( self.player:getActTerrace():getAutoStartTime(), 0)
	end;
})

local TestCaseActTerraceCheckAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTerraceHdr():getHandler(7)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTerraceSender, 'sendInAutoFightState')
		self.player:getActTerrace():setAutoStartTime(0)
		self.hdr:handle(self.player, {})
		assertEQ ( self.mm.walkLog, '' )
		self.player:getActTerrace():setAutoStartTime(100000)
		self.hdr:handle(self.player, {})
		assertEQ ( self.mm.params['sendInAutoFightState'],  {self.player})
	end;
})

tqActTerraceHdr_t_main = function(suite)
	suite:addTestCase(TestCaseActTerraceHdr, 'TestCaseActTerraceHdr')
	suite:addTestCase(TestActTerraceGetBaseInfoHdr, 'TestActTerraceGetBaseInfoHdr')
	suite:addTestCase(TestCaseActTerraceEnterHdr, 'TestCaseActTerraceEnterHdr')
	suite:addTestCase(TestCaseActTerraceExpedHdr, 'TestCaseActTerraceExpedHdr')
	suite:addTestCase(TestCaseActTerraceExitHdr, 'TestCaseActTerraceExitHdr')
	suite:addTestCase(TestCaseActTerraceStartAutoFightHdr, 'TestCaseActTerraceStartAutoFightHdr')
	suite:addTestCase(TestCaseActTerraceStopAutoFightHdr, 'TestCaseActTerraceStopAutoFightHdr')
	suite:addTestCase(TestCaseActTerraceCheckAutoFightHdr, 'TestCaseActTerraceCheckAutoFightHdr')
end;


