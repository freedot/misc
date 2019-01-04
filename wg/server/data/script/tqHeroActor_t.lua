--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqHeroActor')

local TestCaseHeroActor = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{state=0,soldier={resid=150001001,number=1}}} })
		self.hero = self.player:getHeroMgr():getHeroByIdx(0)
		self.hero:setName('hero')
		self.heroActor = HeroActor()
		self.heroActor:setHero(self.hero)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetName = function(self)
		assert ( self.heroActor:getName() == 'hero' )
	end;
	
	testAddExp = function(self)
		assert ( self.heroActor:getAddExp() == 0 )
		self.heroActor:addExp(1)
		assert ( self.heroActor:getAddExp() == 1 )
		
		self.heroActor:addExp(1)
		assert ( self.heroActor:getAddExp() == 2 )
	end;
	
	testAddCredit = function(self)
		assert ( self.heroActor:getAddCredit() == 0 )
		self.heroActor:addCredit(1)
		assert ( self.heroActor:getAddCredit() == 1 )
		
		self.heroActor:addCredit(1)
		assert ( self.heroActor:getAddCredit() == 2 )
	end;
	
	testAddIForce = function(self)
		assert ( self.heroActor:getAddIForce() == 0 )
		self.heroActor:addIForce(1)
		assert ( self.heroActor:getAddIForce() == 1 )
		
		self.heroActor:addIForce(1)
		assert ( self.heroActor:getAddIForce() == 2 )
	end;
	
	test_getSoldierLevel = function(self)
		assertEQ ( self.heroActor:getSoldierLevel() , 0 )
	end;
	
	test_getAdaptableFactor = function(self)
		assertEQ ( self.heroActor:getAdaptableFactor() , 0 )
	end;
})

tqHeroActor_t_main = function(suite)
	suite:addTestCase(TestCaseHeroActor, 'TestCaseHeroActor')
end;


