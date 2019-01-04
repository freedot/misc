--*******************************************************************************
require('tqTradingAreaHdr')

local TestCaseTradingAreaHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , GetTradingAreaInfoHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , StartTradingHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , CancelTradingHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , SetTradingAreaHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , GetTradingAllianceMembersHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , GetTradingAllianceDetailMembersHdr )
	end;
})

local TestCaseGetTradingAreaInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(1)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.player:setAlliId(self.alliance:getId())
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel, state=0} } })	
	end;
	
	test_handle = function(self)
		self.mm:mock(self.player:getTradingArea(), 'checkTargetsInAlliance')
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		self.mm:mock(TradingAreaSender, 'sendBaseInfo')
		self.mm:mock(TradingAreaSender, 'sendTargets')
		self.mm:mock(TradingAreaSender, 'sendTodayTimes')
		
		self:helper_enableAllConditions()
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel-1, state=0} } })	
		assertEQ ( self.hdr:handle(self.player), false )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.walkLog, 'checkTargetsInAlliance,sendStopTime,sendBaseInfo,sendTargets,sendTodayTimes' )
		assertEQ ( self.mm.params['sendStopTime'], {self.player} )
		assertEQ ( self.mm.params['sendBaseInfo'], {self.player} )
		assertEQ ( self.mm.params['sendTargets'], {self.player} )
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player} )
	end;
})

local TestCaseStartTradingHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(2)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self, r_checkTargetsInAlliance)
		self.mm:clear()
		Util:setTimeDrt(1372001450-3600)
		self.player:setAlliId(self.alliance:getId())
		self.player:getTradingArea():getTargetsSet():insert(1)
		self.player:getTradingArea():setStopTime(0)
		self.player:getTradingArea():setTodayTimes(0)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel, state=0} } })	
		r_checkTargetsInAlliance[1] = true
	end;
	
	test_handle = function(self)
		local r_checkTargetsInAlliance = {false}
		
		self.mm:mock(self.player:getTradingArea(), 'checkTargetsInAlliance', r_checkTargetsInAlliance)
		self.mm:mock(self.player:getTradingArea(), 'getTotalNeedTime', {20})
		self.mm:mock(self.player:getTradingArea(), 'start')
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		self.mm:mock(WUtil, 'sendSuccMsgArgs');
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(TradingAreaSender, 'sendTodayTimes')
		self.mm:mock( TaskFinisher, 'trigerTask' )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {}), false )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel-1, state=0} } })	
		assertEQ ( self.hdr:handle(self.player, {}), false )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		r_checkTargetsInAlliance[1] = false
		assertEQ ( self.hdr:handle(self.player, {}), false )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		self.player:getTradingArea():getTargetsSet():remove(1)
		assertEQ ( self.hdr:handle(self.player, {}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100153, ''}, 'has no target citys' )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		Util:setTimeDrt(1372001450)
		assertEQ ( self.hdr:handle(self.player, {}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100154, ''}, "23:00-24:00, can't start trading" )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		self.player:getTradingArea():setTodayTimes(self.player:getTradingArea():getMaxTimes())
		assertEQ ( self.hdr:handle(self.player, {}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100162, ''}, "today times full" )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		self.player:getTradingArea():setStopTime(1)
		assertEQ ( self.hdr:handle(self.player, {}), false )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		assertEQ ( self.hdr:handle(self.player, {vip=1}), false )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		assertEQ ( self.hdr:handle(self.player, {}), true )
		assertEQ ( self.mm.walkLog, 'checkTargetsInAlliance,getTotalNeedTime,start,sendSuccMsgArgs,sendTodayTimes,trigerTask' )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100148, ''}, 'start run trading' )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.START_ONE_TRADINGAREA } )
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player })
		assertEQ ( self.player:getTradingArea():getStopTime(), Util:getTime() + 20 )
		assertEQ ( self.player:getTradingArea():getTodayTimes(), 1 )
		assertEQ ( self.player:getTradingArea():getCurTimes(), 1 )
	end;
	
	test_handle_vip = function(self)
		local r_checkTargetsInAlliance = {false}
		self.mm:mock(self.player:getTradingArea(), 'checkTargetsInAlliance', r_checkTargetsInAlliance)
		self.mm:mock(self.player:getTradingArea(), 'getTotalNeedTime', {20})
		self.mm:mock(self.player:getTradingArea(), 'start')
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		self.mm:mock(WUtil, 'sendSuccMsgArgs');
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(TradingAreaSender, 'sendTodayTimes')
		self.mm:mock( TaskFinisher, 'trigerTask' )
		
		self:helper_enableAllConditions(r_checkTargetsInAlliance)
		local curTimes = self.player:getTradingArea():getMaxTimes() - self.player:getTradingArea():getTodayTimes()
		self.player:setVipLevel(10)
		assertEQ ( self.hdr:handle(self.player, {vip=1}), true )
		assertStrRepeatCount ( self.mm.walkLog, 'trigerTask', curTimes)
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.START_ONE_TRADINGAREA } )
		assertEQ ( self.player:getTradingArea():getStopTime(), Util:getTime() + curTimes*20 )
		assertEQ ( self.player:getTradingArea():getTodayTimes(), self.player:getTradingArea():getMaxTimes() )
		assertEQ ( self.player:getTradingArea():getCurTimes(), curTimes )
	end;
})

local TestCaseSetTradingAreaHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(4)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'role1', 100002, 301)
		self.aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'role2', 100003, 50000)
		self.aPlayer3 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer3', 'role3', 100004, 50001)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.player:setAlliId(self.alliance:getId())
		self.aPlayer1:setAlliId(self.alliance:getId())
		self.aPlayer2:setAlliId(self.alliance:getId())
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel, state=0} } })	
	end;

	test_handle = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(TradingAreaSender, 'sendTargets')
		
		self:helper_enableAllConditions()
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {count=1,t1=100002}), false )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel-1, state=0} } })	
		assertEQ ( self.hdr:handle(self.player, {count=1,t1=100002}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100149, ''}, 'shichang build level is no enough' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=0}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100150, ''}, 'the target count is invalid' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=self.player:getTradingArea():getMaxCitys()+1}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100150, ''}, 'the target count is invalid' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=2,t1=100002,t2=100004}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100151, ''}, 'has target is not same alliance' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=2,t1=100002,t2=-1}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100152, ''}, 'has target is not exist' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=2,t1=100002,t2=100003}), true )
		assertEQ ( self.player:getTradingArea():getTargetsSet():has(100002), true )
		assertEQ ( self.player:getTradingArea():getTargetsSet():has(100003), true )
		assertEQ ( self.mm.params['sendTargets'], {self.player} )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {count=1,t1=100002}), true )
		assertEQ ( self.player:getTradingArea():getTargetsSet():has(100002), true )
		assertEQ ( self.player:getTradingArea():getTargetsSet():has(100003), false )
	end;
})

local TestCaseCancelTradingHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		self.player:getTradingArea():setStopTime(1)
		self.hdr:handle(self.player)
		assertEQ ( self.player:getTradingArea():getStopTime(), 0)
		assertEQ ( self.mm.params['sendStopTime'], {self.player} )
	end;	
})

local TestCaseGetTradingAllianceMembersHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(5)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.player:setAlliId(self.alliance:getId())
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel, state=0} } })	
	end;
	
	test_handle = function(self)
		self.mm:mock(TradingAreaSender, 'sendMembers')
		
		self:helper_enableAllConditions()
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player ), false )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel-1, state=0} } })	
		assertEQ ( self.hdr:handle(self.player ), false )

		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player ), true )
		assertEQ ( self.mm.params['sendMembers'], {self.player} )
	end;
})

local TestCaseGetTradingAllianceDetailMembersHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TradingAreaHdr():getHandler(6)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'role1', 100002, 301)
		self.aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'role2', 100003, 50000)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.player:setAlliId(self.alliance:getId())
		self.aPlayer1:setAlliId(self.alliance:getId())
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel, state=0} } })	
	end;
	
	test_handle = function(self)
		self.mm:mock(TradingAreaSender, 'sendDetailMember')
		self:helper_enableAllConditions()
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {roleId=100002} ), false )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=res_trading_need_build_minlevel-1, state=0} } })	
		assertEQ ( self.hdr:handle(self.player, {roleId=100002} ), false )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {roleId=-1} ), false )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {roleId=100003} ), false )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.player, {roleId=100002} ), true )
		
		assertEQ ( self.mm.params['sendDetailMember'], {self.player, app:getCityMgr():getGridByRoleId(100002) } )
	end;
})

tqTradingAreaHdr_t_main = function(suite)
	suite:addTestCase(TestCaseTradingAreaHdr, 'TestCaseTradingAreaHdr')
	suite:addTestCase(TestCaseGetTradingAreaInfoHdr, 'TestCaseGetTradingAreaInfoHdr')
	suite:addTestCase(TestCaseStartTradingHdr, 'TestCaseStartTradingHdr')
	suite:addTestCase(TestCaseSetTradingAreaHdr, 'TestCaseSetTradingAreaHdr')
	suite:addTestCase(TestCaseCancelTradingHdr, 'TestCaseCancelTradingHdr')
	suite:addTestCase(TestCaseGetTradingAllianceMembersHdr, 'TestCaseGetTradingAllianceMembersHdr')
	suite:addTestCase(TestCaseGetTradingAllianceDetailMembersHdr, 'TestCaseGetTradingAllianceDetailMembersHdr')
end;


