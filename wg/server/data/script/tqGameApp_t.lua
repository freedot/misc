--*******************************************************************************
require('tqGameApp')

local TestCaseGameApp = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		--self.hdr = GameApp()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})

tqGameApp_t_main = function(suite)
	suite:addTestCase(TestCaseGameApp, 'TestCaseGameApp')
end;


