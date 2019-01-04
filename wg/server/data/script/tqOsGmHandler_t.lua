--*******************************************************************************
require('tqOsGmHandler')

local TestCaseOsGmHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqOsGmHandler_t_main = function(suite)
	suite:addTestCase(TestCaseOsGmHandler, 'TestCaseOsGmHandler')
end;


