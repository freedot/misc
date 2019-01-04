--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqHeroWear')

local TestCaseWearItem = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getArm = function(self)
		local g_innerWear = {armPos=1, arm={id=1}}
		local wearItem = WearItem(g_innerWear)
		assert ( wearItem:getArm():getId() == 1 )
	end;
	
	test_setArmPos = function(self)
		local g_innerWear = {armPos=1, arm={id=1}}
		local wearItem = WearItem(g_innerWear)
		assert ( wearItem:getArmPos() == 1 )	
		
		wearItem:setArmPos(2)
		assert ( wearItem:getArmPos() == 2 )
	end;
})

local TestCaseHeroWear = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		local heroWear = HeroWear({count=0})
		
		local g_innerWears = {count=0}
		self.mm:mock(heroWear, '_initWears')
		heroWear:init(g_innerWears)
		assert ( heroWear.innerWears == g_innerWears )
		assert ( self.mm.walkLog == '_initWears' )
	end;
	
	test_initWears = function(self)
		local heroWear = HeroWear({count=0})
		heroWear.innerWears = {count=0}
		heroWear:_initWears()
		assert ( heroWear:getCount() == 0 )
		
		heroWear.innerWears = {count=2, wears={}}
		heroWear.innerWears.wears[0] = {armPos=1,arm={id=1}}
		heroWear.innerWears.wears[1] = {armPos=2,arm={id=2}}
		heroWear:_initWears()
		assert ( heroWear:getCount() == 2 )
		assert ( heroWear.wears[1]:getArm():getId() == 1 )
		assert ( heroWear.wears[2]:getArm():getId() == 2 )
	end;
	
	test_getWearArmByArmPos = function(self)
		local g_innerWears = {count=1, wears={}}
		g_innerWears.wears[0] = {armPos=1,arm={id=1}}
		
		local heroWear = HeroWear(g_innerWears)
		assert ( heroWear:getWearArmByArmPos(1) ~= nil )
		assert ( heroWear:getWearArmByArmPos(1):getArmPos() == 1 )
		assert ( heroWear:getWearArmByArmPos(1):getArm():getId() == 1 )
		assert ( heroWear:getWearArmByArmPos(2) == nil )
	end;
	
	test_getArmByArmPos = function(self)
		local g_innerWears = {count=1, wears={}}
		g_innerWears.wears[0] = {armPos=1,arm={id=1}}
		local heroWear = HeroWear(g_innerWears)
		assert ( heroWear:getArmByArmPos(1) ~= nil )
		assert ( heroWear:getArmByArmPos(1):getId() == 1 )
		assert ( heroWear:getArmByArmPos(2) == nil )
	end;
	
	test_getArmById = function(self)
		local g_innerWears = {count=1, wears={}}
		g_innerWears.wears[0] = {armPos=1,arm={id=1}}
		local heroWear = HeroWear(g_innerWears)
		
		assert ( heroWear:getWearArmById(0) == nil )
		assert ( heroWear:getWearArmById(-1) == nil )
		assert ( heroWear:getWearArmById(2) == nil )
		assert ( heroWear:getWearArmById(1):getArm():getId() == 1 )
	end;
	
	test_getWearArmByIdx = function(self)
		local g_innerWears = {count=1, wears={}}
		g_innerWears.wears[0] = {armPos=1,arm={id=1}}
		
		local heroWear = HeroWear(g_innerWears)
		
		assert ( heroWear:getWearArmByIdx(1) ~= nil )
		assert ( heroWear:getWearArmByIdx(1):getArmPos() == 1 )
		assert ( heroWear:getWearArmByIdx(1):getArm():getId() == 1 )
		assert ( heroWear:getWearArmByIdx(2) == nil )
	end;
	
	test_wear = function(self)
		local g_innerWears = {count=0, wears={}}
		g_innerWears.wears[0] = {armPos=0, arm={id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}}
		
		local heroWear = HeroWear(g_innerWears)
		
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		local arm = ItemEx(g_resItem)
		
		local g_armPos = 1
		heroWear:wear(g_armPos, arm)
		assert ( heroWear:getWearArmByArmPos(g_armPos):getArmPos() == g_armPos )
		assert ( heroWear:getCount() == 1 )
		assert ( heroWear:getCount() == heroWear.innerWears.count )
		
		heroWear:wear(g_armPos, arm)
		assert ( heroWear:getCount() == 1 )
		
		heroWear:wear(HEROARM_POS.FIRST-1, arm)
		assert ( heroWear:getCount() == 1 )
		
		heroWear:wear(HEROARM_POS.LAST+1, arm)
		assert ( heroWear:getCount() == 1 )
	end;
	
	test_unWear = function(self)	
		local g_innerWears = {count=2, wears={}}
		g_innerWears.wears[0] = {armPos=2, arm={id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}}
		g_innerWears.wears[1] = {armPos=3, arm={id=3, resId=4, number=5, forceLevel=6, attrs={count=0,attrs={} }, gems={count=1,gems={}}}}
		
		local heroWear = HeroWear(g_innerWears)
		
		assert ( heroWear:getCount() == 2 )
		
		local g_armPos = 1
		heroWear:unWear(g_armPos)
		assert ( heroWear:getCount() == 2 )
		
		g_armPos = 2
		heroWear:unWear(g_armPos)
		assert ( heroWear:getCount() == 1 )
		assert ( heroWear:getCount() == heroWear.innerWears.count )
		assert ( g_innerWears.wears[0].armPos == 3 )
		assert ( g_innerWears.wears[0].arm.id == 3 )
		assert ( g_innerWears.wears[0].arm.resId == 4 )
		
		g_armPos = 3
		heroWear:unWear(g_armPos)
		assert ( heroWear:getCount() == 0 )
		assert ( heroWear:getCount() == heroWear.innerWears.count )
	end;
})


tqHeroWear_t_main = function(suite)
	suite:addTestCase(TestCaseWearItem, 'TestCaseWearItem')
	suite:addTestCase(TestCaseHeroWear, 'TestCaseHeroWear')
end;


