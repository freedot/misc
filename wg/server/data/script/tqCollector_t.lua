--*******************************************************************************
require('tqCollector')

TestCreateSortedAlliancesHelper = function()
		local mgr = app:getAlliMgr()
		
		local alli1_mem1 = TestCaseHelper:loadPlayerByUserNameEx('alli1_mem1', 'role_1_1', 200000)
		local alliance1 = mgr:createAlliance(alli1_mem1, 'alli1', 'a')
		alliance1:setCityResId(9900001)
		alliance1:setLevel(1)
		alliance1:setHonour(30000)
		
		local alli2_mem1 = TestCaseHelper:loadPlayerByUserNameEx('alli2_mem1', 'role_2_1', 200001)
		local alliance2 = mgr:createAlliance(alli2_mem1, 'alli2', 'a')
		alliance2:setCityResId(9900001)
		alliance2:setLevel(1)
		alliance2:setHonour(20000)
		
		local alli3_mem1 = TestCaseHelper:loadPlayerByUserNameEx('alli3_mem1', 'role_3_1', 200002)
		local alliance3 = mgr:createAlliance(alli3_mem1, 'alli3', 'a')
		alliance3:setCityResId(9900001)
		alliance3:setLevel(1)
		alliance3:setHonour(10000)
		local alli3_mem2 = TestCaseHelper:loadPlayerByUserNameEx('alli3_mem2', 'role_3_2', 200003)
		local mem = AllianceMember()
		alli3_mem2:setAlliId(alliance3:getId())
		mem:setId(alli3_mem2:getRoleId())
		alliance3:addMember(mem)
		
		mgr:sortAlliances()
end;

local TestCaseAllianceCollector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.collector = AllianceCollector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_collect = function(self)
		TestCreateSortedAlliancesHelper()
		
		local rankss = self.collector:collect(3)
		assertEQ ( table.getn(rankss), 3 )
		
		local rankss = self.collector:collect(2)
		assertEQ ( table.getn(rankss), 2 )
		
		local rankss = self.collector:collect(10)
		assertEQ ( table.getn(rankss), 3 )
		assertEQ ( rankss, {{{roleName='role_1_1'}},{{roleName='role_2_1'}},{{roleName='role_3_1'},{roleName='role_3_2'}}})
	end;
})


tqCollector_t_main = function(suite)
	suite:addTestCase(TestCaseAllianceCollector, 'TestCaseAllianceCollector')
end;


