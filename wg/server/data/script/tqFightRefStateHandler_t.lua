--*******************************************************************************
require('tqFightRefStateHandler')

local TestCaseFightRefStateHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})

local TestCaseFightRefStateHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = FightRefStateHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(1):getClass() == GetFightRefStatesHdr )
	end;
})

local TestCaseGetFightRefStatesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = FightRefStateHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(FightResStateSender, 'sendAllStates')
		self.handler:handle(self.player)
		assertEQ ( self.mm.params['sendAllStates'], {self.player})
	end;
})

tqFightRefStateHandler_t_main = function(suite)
	suite:addTestCase(TestCaseFightRefStateHandler, 'TestCaseFightRefStateHandler')
end;


