--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqMapCppArrayList')

local TestCaseMapCppArrayList = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqMapCppArrayList_t_main = function(suite)
	suite:addTestCase(TestCaseMapCppArrayList, 'TestCaseMapCppArrayList')
end;


