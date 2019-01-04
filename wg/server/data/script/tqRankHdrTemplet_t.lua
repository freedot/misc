--*******************************************************************************
require('tqRankHdrTemplet')

local TestCaseRankHdrTemplet = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


tqRankHdrTemplet_t_main = function(suite)
	suite:addTestCase(TestCaseRankHdrTemplet, 'TestCaseRankHdrTemplet')
end;


