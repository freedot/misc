--*******************************************************************************
--  
--*******************************************************************************
require('tqPlayerCultures')

local TestCasePlayerCultures = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.cultures = self.player:getCultures()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getLevel = function(self)
		assert(self.cultures:getLevel(FIXID.FIRSTCUBUILD) == 0)
		self.cultures:setLevel(FIXID.FIRSTCUBUILD, 1)
		assert(self.cultures:getLevel(FIXID.FIRSTCUBUILD) == 1)
	end;
})


tqPlayerCultures_t_main = function(suite)
	suite:addTestCase(TestCasePlayerCultures, 'TestCasePlayerCultures')
end;


