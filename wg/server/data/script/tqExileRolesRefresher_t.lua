--*******************************************************************************
require('tqExileRolesRefresher')

local TestCaseExileRolesRefresher = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.refresher = ExileRolesRefresher()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_start = function(self)
		assertEQ ( self.refresher:isComplete(), false )
		self.refresher.isComplete_ = true
		self.refresher:start()
		assertEQ ( self.refresher:isComplete(), false )
	end;
	
	test_refresh = function(self)
		self.mm:mock(app:getCityMgr(), 'refreshExileRoleIds')
		self.refresher:refresh()
		assertEQ ( self.mm.walkLog, 'refreshExileRoleIds' )
		assertEQ ( self.refresher:isComplete(), true )
		
		self.mm:clear()
		self.refresher:refresh()
		assertEQ ( self.mm.walkLog, '' )
	end;
})


tqExileRolesRefresher_t_main = function(suite)
	suite:addTestCase(TestCaseExileRolesRefresher, 'TestCaseExileRolesRefresher')
end;


