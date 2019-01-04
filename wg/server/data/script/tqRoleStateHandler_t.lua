--*******************************************************************************
--  
--*******************************************************************************
require('tqRoleStateHandler')

local TestCaseRoleStateHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RoleStateHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , GetRoleStatesHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , CancelRoleStateHandler )
	end;
})

local TestCaseGetRoleStatesHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RoleStateHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(RoleStateSender, 'sendStates')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendStates'], {self.player} )
	end;
})

local TestCaseCancelRoleStateHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RoleStateHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanCancelState = {false}
		self.mm:mock(self.hdr, '_isCanCancelState', r_isCanCancelState)
		self.mm:mock(self.player:getStateContainer(), 'stopState')
		
		local cmd = {state=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.walkLog, '_isCanCancelState' )
		assertEQ ( self.mm.params['_isCanCancelState'], {1})
		
		self.mm:clear()
		r_isCanCancelState[1] = true
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.walkLog, '_isCanCancelState,stopState' )
		assertEQ ( self.mm.params['stopState'], {1})
	end;
	
	test__isCanCancelState = function(self)
		assertEQ ( self.hdr:_isCanCancelState(RES_EFF.AVOIDFIGHT), true )
		assertEQ ( self.hdr:_isCanCancelState(1), false )
	end;
})

tqRoleStateHandler_t_main = function(suite)
	suite:addTestCase(TestCaseRoleStateHandler, 'TestCaseRoleStateHandler')
	suite:addTestCase(TestCaseGetRoleStatesHandler, 'TestCaseGetRoleStatesHandler')
	suite:addTestCase(TestCaseCancelRoleStateHandler, 'TestCaseCancelRoleStateHandler')
end;


