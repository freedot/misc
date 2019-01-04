--*******************************************************************************
require('tqWorldMsgQueue')

local TestCaseWorldMsgQueue = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.queue = app:getWorldMsgQueue()
		global.initTimer()
		self.queue:init(app)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_appendMsg = function(self)
		self.queue:appendMsg(10000, 'role', 'msg')
		assertEQ ( self.queue.msgQueue, {{fromId=10000, fromName='role', msg='msg'}} )
	end;
	
	test_clear = function(self)
		self.queue.msgQueue = {{fromId=1,fromName='role',msg='msg'}}
		self.queue.lastTime = 1
		self.queue.lastSended = true
		self.queue:clear()
		assertEQ ( self.queue.msgQueue, {} )
		assertEQ ( self.queue.lastTime, 0 )
		assertEQ ( self.queue.lastSended, false )
	end;
	
	test__onTimer = function(self)
		self.mm:mock(self.queue, '_sendAllOnlinePlayers')
		
		Util:setTimeDrt(res_world_msg_clear_interval-1)
		os.setClockMs(1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		Util:setTimeDrt(res_world_msg_clear_interval)
		os.setClockMs(1000 + 1*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		self.queue:appendMsg(10000, 'role', 'msg')
		Util:setTimeDrt(res_world_msg_replace_interval-1)
		os.setClockMs(1000 + 2*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		Util:setTimeDrt(res_world_msg_replace_interval)
		os.setClockMs(1000 + 3*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '_sendAllOnlinePlayers' )
		assertEQ ( self.mm.params['_sendAllOnlinePlayers'], {{fromId=10000, fromName='role', msg='msg'}} )
		assertEQ ( self.queue.lastSended, true )
		assertEQ ( self.queue.lastTime, Util:getTime() )
		assertEQ ( self.queue.msgQueue, {} )
		
		self.mm:clear()
		self.queue.lastSended = true
		self.queue.lastTime = 0
		self.queue.msgQueue = {}
		Util:setTimeDrt(res_world_msg_clear_interval - 1)
		os.setClockMs(1000 + 4*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(res_world_msg_clear_interval)
		os.setClockMs(1000 + 5*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '_sendAllOnlinePlayers' )
		assertEQ ( self.mm.params['_sendAllOnlinePlayers'], {{fromId=CHAT_SYSPLAYER.SYS, fromName='', msg=''}} )
		assertEQ ( self.queue.lastSended, false )
		
		self.mm:clear()
		self.queue.lastSended = false
		os.setClockMs(1000 + 6*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__sendAllOnlinePlayers = function(self)
		local players = {}
		players['1role'] = {id=1}
		players['2role'] = {id=2}
		self.mm:mock( app:getPlayerMgr(), 'getAllOnlinePlayers', {players} )
		self.mm:mock( ChatSender, 'sendMsg' )
		local fromInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		self.queue:_sendAllOnlinePlayers({fromId=1, fromName='role', msg='msg'})
		assertEQ ( self.mm.walkLog, 'getAllOnlinePlayers,sendMsg,sendMsg' )
		assertEQ ( self.mm.params['sendMsg.1'], {players['1role'], 0, 1, 'role', fromInfo, CHAT_CHANNEL.WORLD, 'msg'} )
		assertEQ ( self.mm.params['sendMsg.2'], {players['2role'], 0, 1, 'role', fromInfo, CHAT_CHANNEL.WORLD, 'msg'} )
	end;
})


tqWorldMsgQueue_t_main = function(suite)
	suite:addTestCase(TestCaseWorldMsgQueue, 'TestCaseWorldMsgQueue')
end;


