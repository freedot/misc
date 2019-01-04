--*******************************************************************************
require('tqGameRoot')

local TestCaseGameRoot = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqGameRoot_t_main = function(suite)
	suite:addTestCase(TestCaseGameRoot, 'TestCaseGameRoot')
end;


