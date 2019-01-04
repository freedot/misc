--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFightActor')

local TestCaseFightActor = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetName = function(self)
		assert ( FightActor():getName() == '' )
	end;
	
	testAddTmpAttrValInFight = function(self)
		FightActor():addTmpAttrValInFight()
	end;
	
	testIsCanAddEffect = function(self)
		assert ( FightActor():isCanAddEffect() == false )
	end;
	
	test_getIcon = function(self)
		assert ( FightActor():getIcon() == 0 )
	end;
})


tqFightActor_t_main = function(suite)
	suite:addTestCase(TestCaseFightActor, 'TestCaseFightActor')
end;


