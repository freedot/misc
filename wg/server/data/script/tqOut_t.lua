--*******************************************************************************
--  
--*******************************************************************************
require('tqOut')

local TestCaseOut = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqOut_t_main = function(suite)
	suite:addTestCase(TestCaseOut, 'TestCaseOut')
end;


