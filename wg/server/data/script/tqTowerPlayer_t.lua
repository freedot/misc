--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqTowerPlayer')

TestCaseTowerPlayer = TestCase:extends({
	createTowerPlayer = function(self, towerLevel)
		local towerArmy = {lineupId=0, heroCount=0, heros={},  soldiers={} }
		towerArmy.soldiers[0] = {resid=150001001, number=10}
		towerArmy.soldiers[1] = {resid=0, number=11}
		towerArmy.soldiers[2] = {resid=150001003, number=12}
		towerArmy.soldiers[3] = {resid=150001004, number=0}
		towerArmy.soldiers[4] = {resid=150001005, number=14}
		local allianceId = 1
		local icon = 2
		return TowerPlayer(towerLevel, towerArmy, allianceId, icon)
	end;
	
	test_isRole = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:isRole() ==  false )
	end;
	
	testGetObjType = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:getObjType() ==  OBJ_TYPE.TOWER )
	end;
	
	testGetRoleName = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:getRoleName() == rstr.fight.jianta )
	end;
	
	testGetAlliId = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:getAlliId() == 1 )
	end;
	
	testGetIcon = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:getIcon() == 2 )
	end;
	
	testGetLevel = function(self)
		local towerLevel = 3
		local towerPlayer = self:createTowerPlayer(towerLevel)
		assert ( towerPlayer:getLevel() == 3 )
	end;
	
	testGetHeroMgr_ZeroTowerLevel = function(self)
		local towerLevel = 0
		local towerPlayer = self:createTowerPlayer(towerLevel)
		local heroMgr = towerPlayer:getHeroMgr()
		assert ( heroMgr:getHeroCount() ==  0 )
	end;
	
	testGetHeroMgr = function(self)
		local towerLevel = 1
		local towerPlayer = self:createTowerPlayer(towerLevel)
		local heroMgr = towerPlayer:getHeroMgr()
		assert ( heroMgr:getHeroCount() ==  3 )
		local hero1 = heroMgr:getHeroById(1)
		local hero2 = heroMgr:getHeroById(3)
		local hero3 = heroMgr:getHeroById(5)
		assert ( hero1 ~= nil )
		assert ( hero2 ~= nil )
		assert ( hero3 ~= nil )
		assert (hero1:getSoldier().resid == 150001001)
		assert (hero1:getSoldier().number == 10)
		assert (hero2:getSoldier().resid == 150001003)
		assert (hero2:getSoldier().number == 12)
		assert (hero3:getSoldier().resid == 150001005)
		assert (hero3:getSoldier().number == 14)
	end;
})


tqTowerPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseTowerPlayer, 'TestCaseTowerPlayer')
end;


