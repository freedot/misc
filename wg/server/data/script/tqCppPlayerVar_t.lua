--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqCppPlayerVar')

local TestCaseCppPlayerVar = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqCppPlayerVar_t_main = function(suite)
	suite:addTestCase(TestCaseCppPlayerVar, 'TestCaseCppPlayerVar')
end;


