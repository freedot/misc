--*******************************************************************************
require('tqBlueDiamondHandler')

local TestCaseBlueDiamondHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler:new()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , BDGetNewGiftHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , BDGetCommEveryDayGiftHandler )
		assertEQ ( self.hdr:getHandler(3):getClass() , BDGetYearEveryDayGiftHandler )
		assertEQ ( self.hdr:getHandler(4):getClass() , BDGetLevelGiftHandler )
		assertEQ ( self.hdr:getHandler(5):getClass() , BDGetInfoHandler )
		assertEQ ( self.hdr:getHandler(6):getClass() , BDGetHighEveryDayGiftHandler )
		assertEQ ( self.hdr:getHandler(7):getClass() , BDGet3366LevelGiftHandler )
	end;	
})

local TestCaseBDGetNewGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotBlueMember = function(self)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		self.player:setQQMembership({is_blue_vip=1})
		self.player:getTask():getBDTask():setGotNewGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_blue_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')
		self.mm:mock(RoleBaseSender, 'send')
		self.player:setQQMembership({is_blue_vip=1})
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getBDTask():getGotNewGift(), 1 )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_bd_newgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_bd_newgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
	end;
})

local TestCaseBDGetCommEveryDayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotBlueMember = function(self)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=2})
		self.player:getTask():getBDTask():setGotCommGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=2})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=2})
		self.player:getTask():getBDTask():setGotCommGift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getBDTask():getGotCommGift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_bd_everydaygifts[2].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_bd_everydaygifts[2].dropid}, {}} )	
	end;
})

local TestCaseBDGetYearEveryDayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotYearBlueMember = function(self)
		self.player:setQQMembership({is_blue_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_year_vip=1})
		self.player:getTask():getBDTask():setGotYearGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_blue_year_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_year_vip=1})
		self.player:getTask():getBDTask():setGotYearGift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getBDTask():getGotYearGift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_bd_yeareverydaygifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_bd_yeareverydaygifts[1].dropid}, {}} )			
	end;
})

local TestCaseBDGetLevelGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotBlueMember = function(self)
		local cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleInvalidId = function(self)
		local cmd = {id=100}
		self.player:setLevel(100)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleIsGot = function(self)
		local cmd = {id=1}
		self.player:setLevel(100)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=7})
		self.player:getTask():getBDTask():getGotLvlGifts():insert(1)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleRoleLevelTooLow = function(self)
		local cmd = {id=1}
		self.player:setLevel(9)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleRoleLevelTooLow = function(self)
		local cmd = {id=8}
		self.player:setLevel(100)
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=1})
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=7})
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
		self.player:setQQMembership({is_blue_vip=1, blue_vip_level=7})
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getTask():getBDTask():getGotLvlGifts():has(1), true )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_bd_lvlgifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_bd_lvlgifts[1].dropid}, {}} )					
	end;
})

local TestCaseBDGetInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(5)
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

local TestCaseBDGetHighEveryDayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(6)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotHighrBlueMember = function(self)
		self.player:setQQMembership({is_blue_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_high_vip=1})
		self.player:getTask():getBDTask():setGotHighGift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({is_blue_high_vip=1})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({is_blue_high_vip=1})
		self.player:getTask():getBDTask():setGotHighGift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getBDTask():getGotHighGift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_bd_higheverydaygifts[1].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_bd_higheverydaygifts[1].dropid}, {}} )			
	end;
})

local TestCaseBDGet3366LevelGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BlueDiamondHandler():getHandler(7)
		Util:setTimeDrt(1000000)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleIsNotBlueMember = function(self)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleIsGot = function(self)
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({_3366_grow_level=1})
		self.player:getTask():getBDTask():setGot3366Gift()
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handleCanNotDrop = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {false})
		self.player:setQQMembership({_3366_grow_level=2})
		assertEQ ( self.hdr:handle(self.player), false )
	end;	
	
	test_handle = function(self)
		self.mm:mock(self.hdr._dropItemEffector, 'isCanExec', {true})
		self.mm:mock(self.hdr._dropItemEffector, 'exec')	
		self.mm:mock(RoleBaseSender, 'send')
		Util:setTimeDrt(1379520000)
		self.player:setQQMembership({_3366_grow_level=2})
		self.player:getTask():getBDTask():setGot3366Gift()
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getBDTask():getGot3366Gift(), 1379520000 + 24*3600 )
		assertEQ ( self.mm.params['send'], {self.player, {'xdInfo'}} )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=res_3366_lvlgifts[2].dropid}, {}} )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=res_3366_lvlgifts[2].dropid}, {}} )	
	end;
})

tqBlueDiamondHandler_t_main = function(suite)
	suite:addTestCase(TestCaseBlueDiamondHandler, 'TestCaseBlueDiamondHandler')
	suite:addTestCase(TestCaseBDGetNewGiftHandler, 'TestCaseBDGetNewGiftHandler')
	suite:addTestCase(TestCaseBDGetCommEveryDayGiftHandler, 'TestCaseBDGetCommEveryDayGiftHandler')
	suite:addTestCase(TestCaseBDGetYearEveryDayGiftHandler, 'TestCaseBDGetYearEveryDayGiftHandler')
	suite:addTestCase(TestCaseBDGetLevelGiftHandler, 'TestCaseBDGetLevelGiftHandler')
	suite:addTestCase(TestCaseBDGetInfoHandler, 'TestCaseBDGetInfoHandler')
	suite:addTestCase(TestCaseBDGetHighEveryDayGiftHandler, 'TestCaseBDGetHighEveryDayGiftHandler')
	suite:addTestCase(TestCaseBDGet3366LevelGiftHandler, 'TestCaseBDGet3366LevelGiftHandler')
end;


