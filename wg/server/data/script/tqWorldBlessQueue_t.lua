--*******************************************************************************
--  
--*******************************************************************************
require('tqWorldBlessQueue')

local TestCaseWorldBlessQueue = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.queue = WorldBlessQueue:new(app)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.queue.gameApp, app )
		assertEQ ( self.queue.blessMsg, {} )
		assertEQ ( self.queue.hasTimer, false )
	end;
	
	test_appendMsg = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.mm:mock(self.queue, '_handleMsg')
		
		local p_blessId = 1
		local p_msg = 'msg'
		self.queue:appendMsg(p_blessId, p_msg)
		assertEQ ( self.mm.walkLog, 'start,_handleMsg' )
		assertEQ ( self.mm.params['start'], {5*1000, {TIMER_EVT.SEND_BLESSMSG}, self.queue:getTimerCaller()} )
		assertEQ ( self.mm.params['_handleMsg'], {} )
		assertEQ ( self.queue.hasTimer, true )
		assertEQ ( self.queue.blessMsg, {{blessId=1, msg='msg'}} )
		
		self.mm:clear()
		self.queue:appendMsg(p_blessId, p_msg)
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.queue.blessMsg, {{blessId=1, msg='msg'},{blessId=1, msg='msg'}} )
	end;
	
	test_onTimer = function(self)
		self.mm:mock(self.queue, '_handleMsg')
		self.queue:_onTimer(global.getTimer())
		assertEQ ( self.mm.params['_handleMsg'], {global.getTimer()} )
	end;
	
	test__handleMsg = function(self)
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(app:getPlayerMgr(), 'sendWorldBless')
		
		local p_hdr = {}
		self.queue:_handleMsg(global.getTimer())
		assertEQ ( self.mm.walkLog, 'stop' )
		assertEQ ( self.queue.hasTimer, false )
		
		self.mm:clear()
		self.queue.blessMsg = {{blessId=1, msg='msg'}}
		self.queue:_handleMsg(p_hdr)
		assertEQ ( self.mm.walkLog, 'sendWorldBless' )
		assertEQ ( self.mm.params['sendWorldBless'], {1, 'msg'} )
	end;
})


tqWorldBlessQueue_t_main = function(suite)
	suite:addTestCase(TestCaseWorldBlessQueue, 'TestCaseWorldBlessQueue')
end;


