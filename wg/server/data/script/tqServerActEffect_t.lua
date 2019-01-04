--*******************************************************************************
require('tqServerActEffect')



TestHelperServerActEffectClear = function(svrAct)
	svrAct.todayActs_ = {}
end;


TestHelperServerActEffectSet = function(svrAct, actType)
	svrAct.todayActs_[actType] = true
end;

local TestCaseServerActEffect = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.svrAct = ServerActEffect(app)
		
		res_dayacts = {
			{id=1, date=1379433600, acts={SVR_TODAY_ACT_TYPE.HERO_STEEL_2,SVR_TODAY_ACT_TYPE.HERO_STEEL_3}}
			,{id=2, date=1379520000 + 0*24*3600, acts={3,4,250001}}
			,{id=3, date=1379520000 + 1*24*3600, acts={5}}
			,{id=4, date=1379520000 + 3*24*3600, acts={6}}
			,{id=5, date=1379520000 + 4*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_TOWER_RECOVER_10}}
			,{id=6, date=1379520000 + 5*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_TOWER_RECOVER_20}}
		}
		
		global.initTimer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_start_collectActs = function(self)
		Util:setTimeDrt(1379520000 - 10*3600)
		os.setClockMs(0)
		self.svrAct:start()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), false )
		assertEQ ( self.svrAct:getOnlineGoods(), 0 )

		Util:setTimeDrt(1379520000 - 4*3600)		
		os.setClockMs( (10-4)*3600*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), true )
		assertEQ ( self.svrAct:hasActType(2), true )
		assertEQ ( self.svrAct:hasActType(3), false )
		
		Util:setTimeDrt(1379520000 - 1*3600 - 1)		
		os.setClockMs( ((10-1)*3600 - 1)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), true )
		assertEQ ( self.svrAct:hasActType(2), true )
		assertEQ ( self.svrAct:hasActType(3), false )
		
		Util:setTimeDrt(1379520000 - 1)		
		os.setClockMs( (10*3600 - 1)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), false )
		
		Util:setTimeDrt(1379520000 + 2)
		os.setClockMs( (10*3600 + 2)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), true )
		assertEQ ( self.svrAct:hasActType(4), true )
		assertEQ ( self.svrAct:getOnlineGoods(), 250001 )
		
		Util:setTimeDrt(1379520000 + 24*3600 )
		os.setClockMs( (10*3600 + 24*3600)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), true )
		assertEQ ( self.svrAct:hasActType(4), true )
		
		Util:setTimeDrt(1379520000 + 24*3600 + 2 )
		os.setClockMs( (10*3600 + 24*3600 + 2)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), false )
		assertEQ ( self.svrAct:hasActType(4), false )
		assertEQ ( self.svrAct:hasActType(5), true )
		
		Util:setTimeDrt(1379520000 + 2*24*3600 )
		os.setClockMs( (10*3600 + 2*24*3600)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), false )
		assertEQ ( self.svrAct:hasActType(4), false )
		assertEQ ( self.svrAct:hasActType(5), true )
		
		Util:setTimeDrt(1379520000 + 2*24*3600 + 2 )
		os.setClockMs( (10*3600 + 2*24*3600 + 2)*1000 )
		global.getTimer():update()
		assertEQ ( self.svrAct:hasActType(1), false )
		assertEQ ( self.svrAct:hasActType(2), false )
		assertEQ ( self.svrAct:hasActType(3), false )
		assertEQ ( self.svrAct:hasActType(4), false )
		assertEQ ( self.svrAct:hasActType(5), false )
	end;
	
	test_start_addOnlinePlayersEffect = function(self)
		local p1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'player1_r',10000001)
		local p2 = TestCaseHelper:loadPlayerByUserNameEx('player2', 'player2_r',10000002)
		
		assertEQ ( p1:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), false )
		assertEQ ( p2:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), false )
		
		os.setClockMs(0)
		Util:setTimeDrt(1379520000 + 4*24*3600)
		self.svrAct:start()
		assertEQ ( p1:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), true )
		assertEQ ( p1:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), true )
		local state = p1:getStateContainer():getEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT)
		assertEQ ( state:getEffectVal(), 10 )
		assertEQ ( state:getEffectValUnit(), 1 )
		assertEQ ( state:getDuration(), 24*3600 )
		
		Util:setTimeDrt(1379520000 + 5*24*3600 + 2)
		os.setClockMs( ((5-4)*24*3600 + 2)*1000 )
		global.getTimer():update()
		assertEQ ( p1:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), true )
		assertEQ ( p2:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT), true )
		state = p1:getStateContainer():getEffectState(RES_EFF.TOWER_RECOVER_SOLDIER_BYACT)
		assertEQ ( state:getEffectVal(), 20 )
		assertEQ ( state:getEffectValUnit(), 1 )
		assertEQ ( state:getDuration(), 24*3600 - 2 )
	end;
	
	test_getAdditionByActType = function(self)
		Util:setTimeDrt(1379520000 + 20*3600)
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3), 0 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1), 0 )

		TestHelperServerActEffectClear(self.svrAct)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.HERO_STEEL_2)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.HERO_STEEL_3)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3)
		TestHelperServerActEffectSet(self.svrAct, SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1)
		
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), 2 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), 3 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2), 2 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3), 3 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1), 1 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2), 2 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3), 3 )
		assertEQ ( self.svrAct:getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1), 1 )
	end;
})

local TestCaseQuestionAct = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.questionAct = QuestionAct(app)
		global.initTimer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_updateTimer = function(self, sec)
		local zeroHour = 1416412800
		local zeroClock = 0
		Util:setTimeDrt(zeroHour + sec)
		os.setClockMs(zeroClock + sec*1000)
		global.getTimer():update()
	end;
	
	test_isCorrect = function(self)
		local player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 200001)
		self.mm:mock(math, 'random', {2})
		self.mm:mock(WUtil, 'sendSysMsg' )
		self.mm:mock(AddItemToPkgHelper, 'addItems' )
		
		--local msg = string.format(rstr.expedTowerLayer, player.getRoleName(), actTower.getCurLayer())
		--WUtil.sendSysMsg(p, SMSGT.SYS_POPBAR, SMT_NORMAL, msg)
		
		local zeroHour = 1416412800  -- 00:00
		local zeroClock = 0
		Util:setTimeDrt(zeroHour)
		os.setClockMs(zeroClock)
		
		self.questionAct:start()
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
		
		self:helper_updateTimer(20*3600 - 1)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
		
		-- first start
		self:helper_updateTimer(20*3600)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), true )
		assertEQ ( self.mm.params['sendSysMsg.1'], {player, SMSGT.SYS_POPBAR, SMT_NORMAL, res_questions[2].content} )
		local s = string.format(rstr.questions.starttip, 20, 22, 30, 50) .. '<br/><font color=#30ff30>' .. res_questions[2].content .. '</font><font color=#30ffff><br/>' .. res_questions[2].ops[1] .. '<br/>' .. res_questions[2].ops[2] .. '</font>'
		assertEQ ( self.mm.params['sendSysMsg.2'], {player, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, s} )
		self.questionAct:appendToRanks('player_r')
		
		-- in state, not end
		self.mm:clear()
		self:helper_updateTimer(20*3600 + 40)
		assertEQ ( self.questionAct:isCorrect(res_questions[1].answer), false )
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), true )
		assertEQ ( self.mm.walkLog, '' )
		
		-- first end
		self.mm:clear()
		self:helper_updateTimer(20*3600 + 50)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
		local s = '<font color=#30ff30>' .. rstr.questions.endranktip .. '<br/>' ..  'player_r' .. '</font>'
		assertEQ ( self.mm.params['sendSysMsg'], {player, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, s} )
		assertEQ ( self.mm.params['addItems'], {player, res_questions_gift[2].items } )
		
		-- sec not start 
		self.mm:clear()
		self:helper_updateTimer(20*3600 + 30*60 - 10)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
		
		-- sec start 
		self.mm:clear()
		self:helper_updateTimer(20*3600 + 30*60)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), true )
		
		-- sec end
		self.mm:clear()
		self:helper_updateTimer(20*3600 + 30*60 + 50)
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
		assertEQ ( self.mm.params['sendSysMsg'], {player, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, rstr.questions.endtip} )
		
		-- last hour can not start
		self.mm:clear()
		self:helper_updateTimer(22*3600 + 1 )
		assertEQ ( self.questionAct:isCorrect(res_questions[2].answer), false )
	end;
	
	test_sendGift = function(self)
		self.mm:mock(AddItemToPkgHelper, 'addItems' )
		self.questionAct:sendGift(self.player)
		assertEQ ( self.mm.params['addItems'], {self.player, res_questions_gift[1].items } )
	end;
})


tqServerActEffect_t_main = function(suite)
	suite:addTestCase(TestCaseServerActEffect, 'TestCaseServerActEffect')
	suite:addTestCase(TestCaseQuestionAct, 'TestCaseQuestionAct')
end;


