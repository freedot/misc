--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFieldHeroMgr')

local TestCaseFieldHeroMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.heromgr = FieldHeroMgr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testNewHero = function(self)
		local heroId = 2
		local fieldHeroResId = 7600001
		local rtHero = self.heromgr:newHero(heroId, fieldHeroResId)
		assert ( self.heromgr:getHeroCount() == 1 )
		local hero = self.heromgr:getHeroById(heroId)
		assert ( hero ~= nil )
		assert ( hero == rtHero )
		assert ( hero:getLevel() > 0 )
		assert ( hero:getId() == heroId )
		assertEQ ( hero:getIcon() >= 101, true )
		
		local heroId = 3
		local fieldHeroResId = 7600001
		local heroName = 'hero'
		local heroIcon = 109
		local rtHero = self.heromgr:newHero(heroId, fieldHeroResId, heroName, heroIcon)
		assertEQ ( self.heromgr:getHeroCount(), 2 )
		local hero = self.heromgr:getHeroById(heroId)
		assertEQ ( hero:getIcon(), 109 )
		assertEQ ( hero:getName(), 'hero' )
	end;
})


tqFieldHeroMgr_t_main = function(suite)
	suite:addTestCase(TestCaseFieldHeroMgr, 'TestCaseFieldHeroMgr')
end;


