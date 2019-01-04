--*******************************************************************************
--*******************************************************************************
require('tqSelfFieldChecker')

local TestCaseSelfFieldChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testHasSelfArmyInField = function(self)
		assert ( SelfFieldChecker:hasSelfArmyInField( self.sourcePlayer, FieldPlayer(2) ) == false )
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestArmyResHelper:createArmy(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		assert ( SelfFieldChecker:hasSelfArmyInField( self.sourcePlayer, FieldPlayer(2) ) == true )
	end;
	
	testIsSelfField = function(self)
		assert ( SelfFieldChecker:isSelfField( self.sourcePlayer, FieldPlayer(2) ) == false )
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		assert ( SelfFieldChecker:isSelfField( self.sourcePlayer, FieldPlayer(2) ) == true )
	end;
})


tqSelfFieldChecker_t_main = function(suite)
	suite:addTestCase(TestCaseSelfFieldChecker, 'TestCaseSelfFieldChecker')
end;


