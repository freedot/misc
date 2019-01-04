--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqArmyContainer')

local TestCaseArmyContainer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.armyContainer = self.player:getArmyContainer()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.TOWERBUILD,level=1,state=0} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetSelfArmyId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {armys={
			self={1}
			} })
		assert ( self.armyContainer:getSelfArmyCount() == 1 )
		assert ( self.armyContainer:getSelfArmyId(0) == 1 )
	end;
	
	testGetAllianceArmyId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {armys={
			alliance={1,2}
			} })
		assert ( self.armyContainer:getAllianceArmyCount() == 2 )
		assert ( self.armyContainer:getAllianceArmyId(0) == 1 )
		assert ( self.armyContainer:getAllianceArmyId(1) == 2 )
	end;
	
	testGetEnemyArmyId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {armys={
			enemy={1,2}
			} })
		assert ( self.armyContainer:getEnemyArmyCount() == 2 )
		assert ( self.armyContainer:getEnemyArmyId(0) == 1 )
		assert ( self.armyContainer:getEnemyArmyId(1) == 2 )
	end;
	
	testDefArmy = function(self)
		local lineupId = 180001
		local heroIds = {0,1,0,0,0}
		self.armyContainer:setDefArmy(lineupId, heroIds)
		local defArmy = self.armyContainer:getDefArmy()
		assert ( defArmy.lineupId == 180001 )
		assert ( defArmy.heros[1] == 0 )
		assert ( defArmy.heros[2] == 1 )
		assert ( defArmy.heros[3] == 0 )
		assert ( defArmy.heros[4] == 0 )
		assert ( defArmy.heros[5] == 0 )
	end;
	
	testGetTowerPlayerHeros = function(self)
		self.player:setIcon(2)
		self.armyContainer:setAllTowerSoldiers({{resid=150001001, number=1},{resid=0, number=0},{resid=0, number=0},{resid=0, number=0},{resid=0, number=0}})
		local towerPlayer = self.armyContainer:getTowerPlayer()
		assert ( towerPlayer ~= nil )
		assert ( towerPlayer:getAlliId() == self.player:getAlliId() )
		assert ( towerPlayer:getIcon() == self.player:getIcon() )
		assert ( towerPlayer:getLevel() == 1 )
		assert ( towerPlayer:getHeroMgr():getHeroCount() == 1 )
	end;
	
	testGetTowerArmy = function(self)
		self.armyContainer:setAllTowerSoldiers({{resid=0, number=1},{resid=150001001, number=0},{resid=150001001, number=1},{resid=0, number=0},{resid=0, number=0}})
		local towerArmy = self.armyContainer:getTowerArmy()
		assert ( towerArmy.heros[1] == 0 )
		assert ( towerArmy.heros[2] == 0 )
		assert ( towerArmy.heros[3]  == 3 )
		assert ( towerArmy.lineupId ==  FIXID.TOWERARMLINEUP )
	end;
	
	testRemoveArmyId = function(self)
		self.mm:mock(MilitarySender, 'sendArmy' )
		self.mm:mock(MilitarySender, 'sendDelArmy' )

		self.armyContainer:addSelfArmyId(1)
		self.armyContainer:addAllianceArmyId(2)
		self.armyContainer:addEnemyArmyId(3)
		assert ( self.armyContainer:getSelfArmyCount() == 1 )
		assert ( self.armyContainer:getSelfArmyId(0) == 1 )
		assert ( self.armyContainer:getAllianceArmyCount() == 1 )
		assert ( self.armyContainer:getAllianceArmyId(0) == 2 )
		assert ( self.armyContainer:getEnemyArmyCount() == 1 )
		assert ( self.armyContainer:getEnemyArmyId(0) == 3 )
		
		assertEQ ( self.mm.params['sendArmy.1'], {self.player, 1} )
		assertEQ ( self.mm.params['sendArmy.2'], {self.player, 2} )
		assertEQ ( self.mm.params['sendArmy.3'], {self.player, 3} )

		self.mm:clear()
		self.armyContainer:removeArmyId(1)
		assert ( self.armyContainer:getSelfArmyCount() == 0 )
		
		self.armyContainer:removeArmyId(2)
		assert ( self.armyContainer:getAllianceArmyCount() == 0 )
		
		self.armyContainer:removeArmyId(3)
		assert ( self.armyContainer:getEnemyArmyCount() == 0 )
		
		assertEQ ( self.mm.params['sendDelArmy.1'], {self.player, 1} )
		assertEQ ( self.mm.params['sendDelArmy.2'], {self.player, 2} )	
		assertEQ ( self.mm.params['sendDelArmy.3'], {self.player, 3} )
	end;
	
	testSelfArmyFull = function(self)	
		local MAX_SELFARMY_CNT_ = MAX_SELFARMY_CNT
		MAX_SELFARMY_CNT = 1
		
		assert ( self.armyContainer:isSelfArmyFull() == false )
		TestCaseCondition:setPreCond(self.player, nil, {armys={ self={1} } })
		assert ( self.armyContainer:isSelfArmyFull() == true )
		
		MAX_SELFARMY_CNT = MAX_SELFARMY_CNT_
	end;
	
	testEnemyArmyFull = function(self)
		local MAX_ENEMYARMY_CNT_ = MAX_ENEMYARMY_CNT
		MAX_ENEMYARMY_CNT = 1
		
		assert ( self.armyContainer:isEnemyArmyFull() == false )
		TestCaseCondition:setPreCond(self.player, nil, {armys={ enemy={1} } })
		assert ( self.armyContainer:isEnemyArmyFull() == true )
		
		MAX_ENEMYARMY_CNT = MAX_ENEMYARMY_CNT_
	end;
	
	testAllianceArmyFull = function(self)
		local MAX_ALLIARMY_CNT_ = MAX_ALLIARMY_CNT
		MAX_ALLIARMY_CNT = 1
		
		assert ( self.armyContainer:isAllianceArmyFull() == false )
		TestCaseCondition:setPreCond(self.player, nil, {armys={ alliance={1} } })
		assert ( self.armyContainer:isAllianceArmyFull() == true )
		
		MAX_ALLIARMY_CNT = MAX_ALLIARMY_CNT_
	end;
	
	test_hasSelfArmyId = function(self)
		self.armyContainer:addSelfArmyId(1)
		assert ( self.armyContainer:hasSelfArmyId(1) == true )
		assert ( self.armyContainer:hasSelfArmyId(0) == false )
	end;
	
	test_hasAllianceArmyId = function(self)
		self.armyContainer:addAllianceArmyId(1)
		assert ( self.armyContainer:hasAllianceArmyId(1) == true )
		assert ( self.armyContainer:hasAllianceArmyId(0) == false )
	end;
	
	test_getCanFightDefArmy = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=HERO_STATE.FREE},{state=HERO_STATE.EXPED},{state=HERO_STATE.STEEL}} })
		local lineupId = 180001
		local heroIds = {0,1,2,3,0}
		self.armyContainer:setDefArmy(lineupId, heroIds)
		local defArmy = self.armyContainer:getCanFightDefArmy()
		assert ( defArmy.lineupId == 180001 )
		assert ( defArmy.heros[1] == 0 )
		assert ( defArmy.heros[2] == 1 )
		assert ( defArmy.heros[3] == 0 )
		assert ( defArmy.heros[4] == 3 )
		assert ( defArmy.heros[5] == 0 )
	end;
	
	test_setTowerSoldiers = function(self)
		self.player:setIcon(2)
		self.armyContainer:setTowerSoldier(0, {resid=150001001, number=1})
		self.armyContainer:setTowerSoldier(6, {resid=150001001, number=1})
		
		self.armyContainer:setTowerSoldier(1, {resid=150001001, number=1})
		assert ( self.armyContainer.military.towerArmy.soldiers[0].resid == 150001001 )
		assert ( self.armyContainer.military.towerArmy.soldiers[0].number == 1 )
	end;	
})


tqArmyContainer_t_main = function(suite)
	suite:addTestCase(TestCaseArmyContainer, 'TestCaseArmyContainer')
end;


