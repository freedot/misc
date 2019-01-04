require('tqStrategyHandler')

local TestCaseStrategyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})

tqStrategyHandler_t_main = function(suite)
	suite:addTestCase(TestCaseStrategyHandler, 'TestCaseStrategyHandler')
end



