--*******************************************************************************
require('tqDealResult32WanHandler')

local TestCaseDealResult32WanHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqDealResult32WanHandler_t_main = function(suite)
	suite:addTestCase(TestCaseDealResult32WanHandler, 'TestCaseDealResult32WanHandler')
end;


