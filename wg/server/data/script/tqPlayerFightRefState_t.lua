--*******************************************************************************
require('tqPlayerFightRefState')

local TestCasePlayerFightRefState = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	load = function(self)
		assertEQ ( false )
	end;
})


tqPlayerFightRefState_t_main = function(suite)
	suite:addTestCase(TestCasePlayerFightRefState, 'TestCasePlayerFightRefState')
end;


