require('tqSysCommander')

local TestCaseSysCommander = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mm:mock(out, 'print')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testExitUser = function(self)
		local willExitPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		self.mm:mock(app:getPlayerMgr(), 'getPlayerById', {willExitPlayer})
		
		self.mm:mock(willExitPlayer, 'save')
		self.mm:mock(app:getPlayerMgr(), 'freePlayer' )
		
		SysCommander():onCommand({playerid=1, connid=0},{cmd=SYSCMD_EXITUSER})
		
		assertEQ(self.mm.walkLog, 'getPlayerById,save,freePlayer')
		assertEQ(self.mm.params['getPlayerById'], {1, 0} )
		assertEQ(self.mm.params['freePlayer'], {willExitPlayer} )
	end;
	
	test_exitSys = function(self)
		self.mm:mock(app:getPlayerMgr(), 'safeExit')
		self.mm:mock(app:getAlliMgr(), 'safeExit')
		SysCommander():onCommand(nil, {cmd=SYSCMD_EXITSYS})
		assertEQ ( self.mm.walkLog, 'safeExit,safeExit,print' )
	end;
})

tqSysCommander_t_main = function(suite)
	suite:addTestCase(TestCaseSysCommander, 'TestCaseSysCommander')
end;

