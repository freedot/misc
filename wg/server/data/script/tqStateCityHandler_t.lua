--*******************************************************************************
require('tqStateCityHandler')

local TestCaseStateCityHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = StateCityHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , StateCityEnterHandler )
	end;
})

local TestCaseStateCityEnterHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = StateCityHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(StateCitySender,  'sendEnter' )
		self.mm:mock(StateCitySender,  'sendNpcs' )
		assertEQ ( self.hdr:handle(self.player, {id=FIXID.FIRSTSTATECITY-1}), false)
		assertEQ ( self.hdr:handle(self.player, {id=FIXID.LASTSTATECITY+1}), false)
		assertEQ ( self.hdr:handle(self.player, {id=FIXID.FIRSTSTATECITY}), true)
		assertEQ ( self.mm.params['sendEnter'], {self.player, FIXID.FIRSTSTATECITY} )
		assertEQ ( self.mm.params['sendNpcs'], {self.player, FIXID.FIRSTSTATECITY} )
	end;
})


tqStateCityHandler_t_main = function(suite)
	suite:addTestCase(TestCaseStateCityHandler, 'TestCaseStateCityHandler')
	suite:addTestCase(TestCaseStateCityEnterHandler, 'TestCaseStateCityEnterHandler')
end;


