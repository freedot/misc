--*******************************************************************************
--  
--*******************************************************************************
require('tqBriefPlayer')

local TestCaseBriefRolePlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.grid = {gridId=2, objType=OBJ_TYPE.ROLE, roleName='role', roleId=1001}
		self.rolePlayer = BriefRolePlayer:new(self.grid)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.rolePlayer.grid, self.grid )
	end;
	
	test_getRoleName = function(self)
		assertEQ ( self.rolePlayer:getRoleName(), 'role' )
	end;
	
	test_getRoleId = function(self)
		assertEQ ( self.rolePlayer:getRoleId(), 1001)
	end;
	
	test_getObjType = function(self)
		assertEQ ( self.rolePlayer:getObjType(), OBJ_TYPE.ROLE )
	end;
	
	test_getCityPos = function(self)
		assertEQ ( self.rolePlayer:getCityPos(), {x=1, y=0} )
	end;
})

local TestCaseBriefFieldPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.grid = {gridId=2, objType=OBJ_TYPE.FIELD, resId=170001, level=1}
		self.fieldPlayer = BriefFieldPlayer:new(self.grid)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.fieldPlayer.grid, self.grid )
	end;
	
	test_getRoleName = function(self)
		local nameRes = ItemResUtil:findItemres(170001)
		local name = string.format(rstr.fieldplayer.levelname, 1, nameRes.name)
		assertEQ ( self.fieldPlayer:getRoleName(), name)
	end;
	
	test_getRoleId = function(self)
		assertEQ ( self.fieldPlayer:getRoleId(), 2)
	end;
	
	test_getObjType = function(self)
		assertEQ ( self.fieldPlayer:getObjType(), OBJ_TYPE.FIELD)
	end;
	
	test_getCityPos = function(self)
		assertEQ ( self.fieldPlayer:getCityPos(), {x=1, y=0} )
	end;
})

local TestCaseBriefCopyFieldPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.copyFieldPlayer = BriefCopyFieldPlayer:new(171001)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getRoleName = function(self)
		local nameRes = ItemResUtil:findItemres(171001)
		assertEQ ( self.copyFieldPlayer:getRoleName(), nameRes.name )
	end;
	
	test_getObjType = function(self)
		assertEQ (  self.copyFieldPlayer:getObjType(), OBJ_TYPE.COPYFIELD )
	end;
	
	test_getRoleId = function(self)
		assertEQ ( self.copyFieldPlayer:getRoleId(), 171001)
	end;
	
	test_getCityPos = function(self)
		assertEQ (  self.copyFieldPlayer:getCityPos(), {x=0, y=0} )
	end;
})

tqBriefPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseBriefRolePlayer, 'TestCaseBriefRolePlayer')
	suite:addTestCase(TestCaseBriefFieldPlayer, 'TestCaseBriefFieldPlayer')
	suite:addTestCase(TestCaseBriefCopyFieldPlayer, 'TestCaseBriefCopyFieldPlayer')
end;


