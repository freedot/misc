--*******************************************************************************
require('tqYellowDiamondHandler')

local TestCaseYellowDiamondHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler:new()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , YDGetNewGiftHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , YDGetCommEveryDayGiftHandler )
		assertEQ ( self.hdr:getHandler(3):getClass() , YDGetYearEveryDayGiftHandler )
		assertEQ ( self.hdr:getHandler(4):getClass() , YDGetLevelGiftHandler )
		assertEQ ( self.hdr:getHandler(5):getClass() , YDGetInfoHandler )
	end;
})

local TestCaseYDGetNewGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotYellowMember = function(self)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		self.player:setQQMembership({is_yellow_vip=1})
		self.player:getTask():getYDTask():setGotNewGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_yellow_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')
		self.mm:mock(RoleBaseSender, 'send')
		self.player:setQQMembership({is_yellow_vip=1})
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getYDTask():getGotNewGift(), 1 )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_yd_newgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_yd_newgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
	end;
})

local TestCaseYDGetCommEveryDayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotYellowMember = function(self)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=2})
		self.player:getTask():getYDTask():setGotCommGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=2})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=2})
		self.player:getTask():getYDTask():setGotCommGift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getYDTask():getGotCommGift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_yd_everydaygifts[2].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_yd_everydaygifts[2].dropid}, {}} )	
	end;
})

local TestCaseYDGetYearEveryDayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotYearYellowMember = function(self)
		self.player:setQQMembership({is_yellow_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_yellow_year_vip=1})
		self.player:getTask():getYDTask():setGotYearGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_yellow_year_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_yellow_year_vip=1})
		self.player:getTask():getYDTask():setGotYearGift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getYDTask():getGotYearGift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_yd_yeareverydaygifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_yd_yeareverydaygifts[1].dropid}, {}} )			
	end;
})

local TestCaseYDGetLevelGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotYellowMember = function(self)
		local cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleInvalidId = function(self)
		local cmd = {id=100}
		self.player:setLevel(100)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleIsGot = function(self)
		local cmd = {id=1}
		self.player:setLevel(100)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=7})
		self.player:getTask():getYDTask():getGotLvlGifts():insert(1)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleRoleLevelTooLow = function(self)
		local cmd = {id=1}
		self.player:setLevel(9)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleRoleLevelTooLow = function(self)
		local cmd = {id=8}
		self.player:setLevel(100)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=1})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=7})
		self.player:setLevel(100)
		local cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		local cmd = {id=1}
		self.player:setLevel(100)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getTask():getYDTask():getGotLvlGifts():has(1), true )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_yd_lvlgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_yd_lvlgifts[1].dropid}, {}} )					
	end;
})

local TestCaseYDGetInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = YellowDiamondHandler():getHandler(5)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
	end;
})


tqYellowDiamondHandler_t_main = function(suite)
	suite:addTestCase(TestCaseYellowDiamondHandler, 'TestCaseYellowDiamondHandler')
	suite:addTestCase(TestCaseYDGetNewGiftHandler, 'TestCaseYDGetNewGiftHandler')
	suite:addTestCase(TestCaseYDGetCommEveryDayGiftHandler, 'TestCaseYDGetCommEveryDayGiftHandler')
	suite:addTestCase(TestCaseYDGetYearEveryDayGiftHandler, 'TestCaseYDGetYearEveryDayGiftHandler')
	suite:addTestCase(TestCaseYDGetLevelGiftHandler, 'TestCaseYDGetLevelGiftHandler')
	suite:addTestCase(TestCaseYDGetInfoHandler, 'TestCaseYDGetInfoHandler')
end;


