--*******************************************************************************
require('tqClientCfgHandler')

local TestCaseClientCfgToggleMapHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ClientCfgHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_InvalidIdx = function(self)
		assertEQ ( self.hdr:handle(self.player, {idx=-1,flag=1}), false )
		assertEQ ( self.hdr:handle(self.player, {idx=4,flag=1}), false )
	end;
	
	test_handle_InvalidFlag = function(self)
		assertEQ ( self.hdr:handle(self.player, {idx=0,flag=-1}), false )
		assertEQ ( self.hdr:handle(self.player, {idx=0,flag=256}), false )
	end;
	
	test_handle = function(self)
		self.mm:mock(ClientCfgSender, 'sendToggleMap')
		assertEQ ( self.hdr:handle(self.player, {idx=0,flag=1}), true )
		assertEQ ( self.player:getClientCfg():getToggleMapFlag(0), 1 )
		assertEQ ( self.mm.params['sendToggleMap'], {self.player} )
	end;
})


local TestCaseClientCfgGongGaoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ClientCfgHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local cmd = {ver=10}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getClientCfg():getGongGaoVer(), 10 )
	end;
})

local TestCaseClientCfgGongGaoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ClientCfgHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local cmd = {ver=10}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getClientCfg():getGongGaoVer(), 10 )
	end;
})

local TestCaseClientCfgSetHelpTipHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ClientCfgHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ClientCfgSender, 'sendHelpTip')
		local cmd = {tipId=1}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getClientCfg():getHelpTips():has(1), true)
		assertEQ ( self.player:getClientCfg():getHelpTips():getByValKey(1).times, 1)
		assertEQ ( self.mm.params['sendHelpTip'], {self.player, 1, 1} )
		
		self.mm:clear()
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getClientCfg():getHelpTips():getByValKey(1).times, 2)
		assertEQ ( self.mm.params['sendHelpTip'], {self.player, 1, 2} )
	end;
})


tqClientCfgHandler_t_main = function(suite)
	suite:addTestCase(TestCaseClientCfgToggleMapHandler, 'TestCaseClientCfgToggleMapHandler')
	suite:addTestCase(TestCaseClientCfgGongGaoHandler, 'TestCaseClientCfgGongGaoHandler')
	suite:addTestCase(TestCaseClientCfgSetHelpTipHandler, 'TestCaseClientCfgSetHelpTipHandler')
end;


