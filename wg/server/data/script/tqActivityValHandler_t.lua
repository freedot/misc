--*******************************************************************************
require('tqActivityValHandler')

local TestCaseActivityValHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , ActivityValGetAllInfoHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , ActivityValGetActRewardHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , ActivityValSignInHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , ActivityValGetSignRewardHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , ActivityValGetOnlineGoodsHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , ActivityValGetPayGiftHdr )
	end;
})

local TestCaseActivityValGetAllInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActivityValSender, 'sendVal')
		self.mm:mock(ActivityValSender, 'sendGotActRewards')
		self.mm:mock(ActivityValSender, 'sendGotSigninRewards')
		self.mm:mock(ActivityValSender, 'sendSignin')
		self.mm:mock(ActivityValSender, 'sendDayActs')
		self.mm:mock(ActivityValSender, 'sendGotOnlineGoods')
		self.mm:mock(ActivityValSender, 'sendOnlineGoodsId')
		self.mm:mock(TaskSender, 'sendActValTasks')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendVal'], {self.player} )
		assertEQ ( self.mm.params['sendGotActRewards'], {self.player} )
		assertEQ ( self.mm.params['sendGotSigninRewards'], {self.player} )
		assertEQ ( self.mm.params['sendSignin'], {self.player} )
		assertEQ ( self.mm.params['sendDayActs'], {self.player} )
		assertEQ ( self.mm.params['sendGotOnlineGoods'], {self.player} )
		assertEQ ( self.mm.params['sendOnlineGoodsId'], {self.player} )
		assertEQ ( self.mm.params['sendActValTasks'], {self.player} )
	end;
})

local TestCaseActivityValGetActRewardHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(2)
		
		res_activityval_rewards = {
			{id=1, val=0, dropId=750001 }
			,{id=2, val=40, dropId=750002 }
			,{id=3, val=75, dropId=750003 }
			,{id=4, val=100, dropId=750004, dropId2=750003 }
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', r_isCanExec)
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')
		self.mm:mock(ActivityValSender, 'sendGotActRewards')
		self.mm:mock(TaskFinisher, 'trigerTask')
		--.()
		
		Util:setTimeDrt(1379520000)
		
		self.player:getTask():getActivityVal():setTodayVal(40)
		self.player:getTask():getActivityVal():getGotActRewards():setGotReward(1)
	
		local cmd = {id=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=5}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=3}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=750002}, {}} )
		
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=750002}, {}} )
		assertEQ ( self.mm.params['sendGotActRewards'], {self.player} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FINISH_GET_VITALITY_GIFT} )
		assertEQ ( self.player:getTask():getActivityVal():getGotActRewards():isGotReward(2), true )
		
		cmd = {id=4}
		self.player:getTask():getActivityVal():setTodayVal(100)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=750004, val2=750003}, {}} )
	end;
})

local TestCaseActivityValSignInHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(1379520000)
		self.mm:mock(ActivityValSender, 'sendSignin')
		
		assertEQ ( self.player:getTask():getActivityVal():isTodaySigned(), false )
		assertEQ ( self.player:getTask():getActivityVal():getSigninDays(), 0 )
		self.hdr:handle(self.player)
		assertEQ ( self.player:getTask():getActivityVal():isTodaySigned(), true )
		assertEQ ( self.player:getTask():getActivityVal():getSigninDays(), 1 )
		assertEQ ( self.mm.params['sendSignin'], {self.player} )
	end;
})

local TestCaseActivityValGetSignRewardHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(4)
		
		res_signin_rewards = {
			{id=1, days=5, dropId=760001}
			,{id=2, days=10, dropId=760002}
			,{id=3, days=20, dropId=760003}
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', r_isCanExec)
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')
		self.mm:mock(ActivityValSender, 'sendGotSigninRewards')
		
		for i=1, 10, 1 do
			Util:setTimeDrt(1379520000 + i*24*3600)
			self.player:getTask():getActivityVal():todaySign()
		end
		self.player:getTask():getActivityVal():getGotSigninRewards():setGotReward(1)
	
		local cmd = {id=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=4}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=3}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=760002}, {}} )
		
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=760002}, {}} )
		assertEQ ( self.mm.params['sendGotSigninRewards'], {self.player} )
		assertEQ ( self.player:getTask():getActivityVal():getGotSigninRewards():isGotReward(2), true )
	end;
})

local TestCaseActivityValGetOnlineGoodsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(5)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(self.player:getTask():getActivityVal(), 'todayGetOnlineGoods')
		self.mm:mock(ActivityValSender, 'sendGotOnlineGoods')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'todayGetOnlineGoods,sendGotOnlineGoods' )
		assertEQ ( self.mm.params['sendGotOnlineGoods'], {self.player} )
	end;
})

local TestCaseActivityValGetPayGiftHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActivityValHandler():getHandler(6)
		
		res_dayacts = {
			{id=1, date=1379520000 + 0*24*3600, acts={}}
			,{id=2, date=1379520000 + 1*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=3, date=1379520000 + 2*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=4, date=1379520000 + 3*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=5, date=1379520000 + 4*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=6, date=1379520000 + 5*24*3600, acts={}}
			,{id=7, date=1379520000 + 6*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=8, date=1379520000 + 7*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=9, date=1379520000 + 8*24*3600, acts={}}
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_invalidIdx = function(self)
		local cmd = {idx=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {idx=-1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_hasnoGift = function(self)
		local cmd = {idx=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_hasNoEnoughPkg = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.player:getTask():getPayAct():addGold(1000)
		self.player:getPkg():setMaxGridsCnt(0)
		local cmd = {idx=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100015, ''}  )
	end;
	
	test_handle_succ = function(self)
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.player:getTask():getPayAct():addGold(1000)
		local cmd = {idx=0}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getTask():getPayAct():getGift(0), 0)
	end;
})


tqActivityValHandler_t_main = function(suite)
	suite:addTestCase(TestCaseActivityValHandler, 'TestCaseActivityValHandler')
	suite:addTestCase(TestCaseActivityValGetAllInfoHdr, 'TestCaseActivityValGetAllInfoHdr')
	suite:addTestCase(TestCaseActivityValGetActRewardHdr, 'TestCaseActivityValGetActRewardHdr')
	suite:addTestCase(TestCaseActivityValSignInHdr, 'TestCaseActivityValSignInHdr')
	suite:addTestCase(TestCaseActivityValGetSignRewardHdr, 'TestCaseActivityValGetSignRewardHdr')
	suite:addTestCase(TestCaseActivityValGetOnlineGoodsHdr, 'TestCaseActivityValGetOnlineGoodsHdr')
	suite:addTestCase(TestCaseActivityValGetPayGiftHdr, 'TestCaseActivityValGetPayGiftHdr')
end;


