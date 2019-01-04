--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFieldArmyContainer')

local TestCaseFieldArmyContainer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.armyMgr = FieldArmyContainer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;	
	
	testGetDefArmy = function(self)
		self.armyMgr:initArmy(180001,--[[lineupId]] {0,2,0,0,0}--[[heroIds]])
		local defArmy = self.armyMgr:getDefArmy()
		assert ( defArmy ~= nil )
		assert ( defArmy.lineupId == 180001)
		assert ( defArmy.heroCount == 5)
		assert ( defArmy.heros[1] == 0 )
		assert ( defArmy.heros[2] == 2 )
		assert ( defArmy.heros[3] == 0 )
		assert ( defArmy.heros[4] == 0 )
		assert ( defArmy.heros[5] == 0 )
		assert ( self.armyMgr:getSelfArmy() == defArmy )
	end;
	
	test_getCanFightDefArmy = function(self)
		self.mm:mock(self.armyMgr, 'getDefArmy', {{name='defArmy'}})
		assertEQ ( self.armyMgr:getCanFightDefArmy(), {name='defArmy'} )		
	end;
})


tqFieldArmyContainer_t_main = function(suite)
	suite:addTestCase(TestCaseFieldArmyContainer, 'TestCaseFieldArmyContainer')
end;


