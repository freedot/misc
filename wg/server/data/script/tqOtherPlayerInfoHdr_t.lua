--*******************************************************************************
require('tqOtherPlayerInfoHdr')

local TestCaseOtherPlayerInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = OtherPlayerInfoHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(0):getClass() , NullHandler )
		assertEQ ( self.hdr:getHandler(1):getClass() , GetBuildAddSpeedHdr )
	end;
})

local TestCaseGetBuildAddSpeedHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = OtherPlayerInfoHdr():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(OtherPlayerInfoSender, 'sendBuildAddSpeed')
		local cmd = {name='no'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local target = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100001)
		cmd = {name='target_r'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:setAlliId(1)
		cmd = {name=self.player:getRoleName()}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		target:setAlliId(1)
		cmd = {name='target_r'}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['sendBuildAddSpeed'], {self.player, target} )
	end;
})

tqOtherPlayerInfoHdr_t_main = function(suite)
	suite:addTestCase(TestCaseOtherPlayerInfoHdr, 'TestCaseOtherPlayerInfoHdr')
	suite:addTestCase(TestCaseGetBuildAddSpeedHdr, 'TestCaseGetBuildAddSpeedHdr')
end;


