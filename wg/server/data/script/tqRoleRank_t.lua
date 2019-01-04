--*******************************************************************************
require('tqRoleRank')

RankTester = Class:extends({
	init = function(self, name)
		self.name_ = name
	end;
	
	test_selectRanks = function(self, roleObj, roleHeadName)
		local ranks = roleObj:selectRanks(1, 10)
		assertEQ ( table.getn(ranks), 10 )
		assertEQ ( ranks[1].roleName, roleHeadName .. '1', self.name_ )
		assertEQ ( ranks[10].roleName, roleHeadName .. '10', self.name_)
		
		local ranks = roleObj:selectRanks(2, 10)
		assertEQ ( table.getn(ranks), 1 )
		assertEQ ( ranks[1].roleName, roleHeadName .. '11' , self.name_ )
	end;
	
	test__onSortTimer = function(self, testcase, roleObj, rankName, fixsec)
		testcase.mm:mock(Service:getRankRefreshDB(), 'getRefreshTime', {1379520000 - 10*3600 - 24*3600 + 1} );
		testcase.mm:mock(Service:getRankRefreshDB(), 'updateRefreshTime' );
		testcase.mm:mock(RankMgrC:GetRank(rankName), 'Sort')
		
		Util:setTimeDrt(1379520000 - 10*3600)
		os.setClockMs(0)
		roleObj:start()
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, 'getRefreshTime', self.name_ )
		assertEQ ( testcase.mm.params['getRefreshTime'], {roleObj:getRankName()} )
		
		testcase.mm:clear()
		Util:setTimeDrt(1379520000 + fixsec -1)
		os.setClockMs((10*3600 + fixsec - 1)*1000)
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, '', self.name_ )
		
		testcase.mm:clear()
		Util:setTimeDrt(1379520000 + fixsec)
		os.setClockMs((10*3600 + fixsec)*1000)
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, 'Sort,updateRefreshTime', self.name_ )
		
		testcase.mm:clear()
		Util:setTimeDrt(1379520000 + fixsec + 1)
		os.setClockMs((10*3600 + fixsec + 1)*1000)
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, '', self.name_ )
		
		testcase.mm:clear()
		Util:setTimeDrt(1379520000 +  fixsec + 24*3600 - 1)
		os.setClockMs((10*3600 + fixsec + 24*3600 - 1)*1000)
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, '', self.name_ )
		
		testcase.mm:clear()
		Util:setTimeDrt(1379520000 +  fixsec + 1 + 24*3600)
		os.setClockMs((10*3600 + fixsec + 1 + 24*3600)*1000)
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, 'Sort,updateRefreshTime', self.name_ )
	end;
	
	test__onSortTimer_startNeedSort = function(self, testcase, roleObj, rankName, fixsec)
		testcase.mm:mock(Service:getRankRefreshDB(), 'getRefreshTime', {1379520000 - 10*3600 - 24*3600} );
		testcase.mm:mock(Service:getRankRefreshDB(), 'updateRefreshTime' );
		testcase.mm:mock(RankMgrC:GetRank(rankName), 'Sort')
		
		Util:setTimeDrt(1379520000 - 10*3600)
		os.setClockMs(0)
		roleObj:start()
		global.getTimer():update()
		assertEQ ( testcase.mm.walkLog, 'getRefreshTime,Sort,updateRefreshTime', self.name_ )
		assertEQ ( testcase.mm.params['getRefreshTime'], {roleObj:getRankName()} )
		assertEQ ( testcase.mm.params['updateRefreshTime'], {roleObj:getRankName()} )
	end;
	
	test_getIdxByName = function(self, testcase, roleObj, rankName)
		testcase.mm:mock(RankMgrC:GetRank(rankName), 'GetIdxByName', {100})
		assertEQ ( roleObj:getIdxByName('role'), 100 )
		assertEQ ( testcase.mm.params['GetIdxByName'], {'role'}, self.name_ )
	end;
})

local TestCaseRoleRank = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.tester = RankTester:new('roleRank:')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getPageCount = function(self)
		assertEQ ( app:getRoleRank():getPageCount(10), 2 )
	end;
	
	test_selectRanks = function(self)
		self.tester:test_selectRanks(app:getRoleRank(), 'rrole')
	end;
	
	test__onSortTimer = function(self)
		app:getRoleRank():init()
		self.tester:test__onSortTimer(self, app:getRoleRank(), 'role', 10)
	end;
	
	test__onSortTimer_startNeedSort = function(self)
		app:getRoleRank():init()
		self.tester:test__onSortTimer_startNeedSort(self, app:getRoleRank(), 'role', 10)
	end;
	
	test_getIdxByName = function(self)
		self.tester:test_getIdxByName(self, app:getRoleRank(), 'role')
	end;
})


tqRoleRank_t_main = function(suite)
	suite:addTestCase(TestCaseRoleRank, 'TestCaseRoleRank')
end;


