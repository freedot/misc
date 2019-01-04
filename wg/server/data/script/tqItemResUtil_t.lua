--*******************************************************************************
require('tqItemResUtil')

local TestCaseItemResUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqItemResUtil_t_main = function(suite)
	suite:addTestCase(TestCaseItemResUtil, 'TestCaseItemResUtil')
end;


