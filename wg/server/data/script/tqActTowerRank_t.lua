--*******************************************************************************
require('tqActTowerRank')


local TestCaseActTowerRank = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.tester = RankTester:new('actTowerRank:')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getPageCount = function(self)
		assertEQ ( app:getActTowerRank():getPageCount(10), 2 )
	end;
	
	test_selectRanks = function(self)
		self.tester:test_selectRanks(app:getActTowerRank(), 'role')
	end;
	
	test__onSortTimer = function(self)
		app:getActTowerRank():init()
		self.tester:test__onSortTimer(self, app:getActTowerRank(), 'actTower', 15)
	end;
	
	test_getIdxByName = function(self)
		self.tester:test_getIdxByName(self, app:getActTowerRank(), 'actTower')
	end;
})

tqActTowerRank_t_main = function(suite)
	suite:addTestCase(TestCaseActTowerRank, 'TestCaseActTowerRank')
end;


