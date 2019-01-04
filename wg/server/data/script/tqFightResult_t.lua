--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFightResult')

local TestCaseFightResult = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.stream = FightEventStream()
		self.fightResult = FightResult(self.stream)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__getDefenderPartyName = function(self)
		local defendPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('def1', 'def1_r', 200000)
		local defendPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('def2', 'def2_r', 200001)
		self.fightResult:setDefenderCamps({{player=defendPlayer1},{player=defendPlayer2}})
		assertEQ ( self.fightResult:_getDefenderPartyName(), 'def2_r')
	end;
	
	test_getAllFightResults = function(self)
		self.mm:mock(self.fightResult.resultMaker, 'make', {'result'} )
	
		local attackerCamp = {player=self.player}
		local defendPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('def1', 'def1_r', 200001)
		local defendPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('def2', 'def2_r', 200002)
		local defendPlayer3 = TestCaseHelper:loadPlayerByUserNameEx('def3', 'def3_r', 200003)
		local defenderCamps = {{player=defendPlayer1},{player=defendPlayer2},{player=defendPlayer3}}
		
		self.fightResult:clear()
		self.fightResult:setAttackerCamp(attackerCamp)
		self.fightResult:setDefenderCamps(defenderCamps)
		local results = self.fightResult:getAllFightResults()
		assertEQ ( results, {} )
		
		defenderCamps[1].isFighted = true
		self.fightResult:clear()
		self.fightResult:setAttackerCamp(attackerCamp)
		self.fightResult:setDefenderCamps(defenderCamps)
		self.fightResult:setArmy({armyId=1, expedType=1})
		local results = self.fightResult:getAllFightResults()
		assertEQ ( results, {'result'} )
		
		defenderCamps[1].isFighted = true
		defenderCamps[2].isFighted = true
		self.fightResult:clear()
		self.fightResult:setAttackerCamp(attackerCamp)
		self.fightResult:setDefenderCamps(defenderCamps)
		local results = self.fightResult:getAllFightResults()
		assertEQ ( results, {'result','result'} )
	end;
})


tqFightResult_t_main = function(suite)
	suite:addTestCase(TestCaseFightResult, 'TestCaseFightResult')
end;


