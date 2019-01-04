--*******************************************************************************
require('tqInvalidDataChecker')

local TestCaseInvalidDataChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqInvalidDataChecker_t_main = function(suite)
	suite:addTestCase(TestCaseInvalidDataChecker, 'TestCaseInvalidDataChecker')
end;


