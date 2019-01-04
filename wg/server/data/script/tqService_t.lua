--*******************************************************************************
require('tqService')

local TestCaseService = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqService_t_main = function(suite)
	suite:addTestCase(TestCaseService, 'TestCaseService')
end;


