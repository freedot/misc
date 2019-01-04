--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerSelfField')

local TestCasePlayerSelfField = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		
		self.ownerPlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200000)
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001,180002}, heros={{level=10,state=1,soldier={resid=150001010,number=10}} } })
		TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.selfField = self.ownerPlayer:getSelfField()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetCount = function(self)
		assert ( self.selfField:getCount() == 0 )
	end;
	
	testAddField = function(self)
		self.selfField:addField({gridId=1})
		assert ( self.selfField:getCount() == 1 )
		local field = self.selfField:getFieldByIdx(0)
		assert ( field == self.selfField:getFieldById(1) )
		assert ( field.gridId == 1 )
		assert ( field.startTime == 0 )
	end;
	
	testAddRepeatField = function(self)
		local methodMock = MethodMock()
		methodMock:mock(nil, 'res_selffield_maxcount', function() return 2 end)
		
		self.selfField:addField({gridId=1})
		assert ( self.selfField:getCount() == 1 )
		self.selfField:addField({gridId=1})
		assert ( self.selfField:getCount() == 1 )
		methodMock:restore()
	end;
	
	testDeleteField = function(self)
		self.selfField:deleteField({gridId=1})
		assert ( self.selfField:getCount() == 0 )
		self.selfField:addField({gridId=1})
		assert ( self.selfField:getCount() == 1 )
		self.selfField:deleteField({gridId=1})
		assert ( self.selfField:getCount() == 0 )
	end;
	
	testIsFull = function(self)
		self.selfField:addField({gridId=1, level=4})
		assert ( self.selfField:isFull() == true )
	end;
	
	testStartCollect = function(self)
		assert ( self.selfField:getStartTime(1) == 0 )
		
		self.selfField:startCollect(1, 1)--[[curTime]]
		assert ( self.selfField:getStartTime(1) == 0 )
		
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		self.selfField:startCollect(2, 1)--[[curTime]]
		assert ( self.selfField:getStartTime(2) == 1 )
	end;
	
	testGetCollectSoldierNumber = function(self)
		local gridId = 2
		local curTime = 1
		
		assert ( self.selfField:getCollectSoldierNumber(gridId) == 0 )
		
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		self.selfField:startCollect(gridId, curTime)
		
		assert ( self.selfField:getCollectSoldierNumber(gridId) == 10 )
	end;
	
	testGetCurOccupySoldierNumber = function(self)
		local gridId = 2
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		assert ( self.selfField:getCurOccupySoldierNumber(gridId) == 10 )
	end;
	
	test_getCurOccupyHero = function(self)
		local p_gridId = 1
		local r_getOccupyArmy = {nil}
		self.mm:mock(self.selfField, 'getOccupyArmy', r_getOccupyArmy)
		assertEQ ( self.selfField:getCurOccupyHero(p_gridId), nil )
		assertEQ ( self.mm.params['getOccupyArmy'], {p_gridId} )
		
		r_getOccupyArmy[1] = {heros={ self.hero:getId() }}
		assertEQ ( self.selfField:getCurOccupyHero(p_gridId):getId(), self.hero:getId() )
	end;
})


tqPlayerSelfField_t_main = function(suite)
	suite:addTestCase(TestCasePlayerSelfField, 'TestCasePlayerSelfField')
end;


