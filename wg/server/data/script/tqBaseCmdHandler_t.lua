--*******************************************************************************
--  
--*******************************************************************************
require('tqBaseCmdHandler')

local TestCaseBaseCmdHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		local baseHdr = BaseCmdHandler()
		self.mm:mock(baseHdr, 'regHandlers')
		
		baseHdr:init()
		assert ( table.getn(baseHdr.handlers) == 0 )
		assert ( baseHdr.nullHandler:getClass() == NullHandler )
		assert ( self.mm.walkLog == 'regHandlers' )
	end;
	
	test_getHandler = function(self)
		local DemoHandler = TestCase:extends({
			handle = function(self) end;
		})
		
		local NullDemoHandler = TestCase:extends({
			handle = function(self) end;
		})
		
		local baseHdr = BaseCmdHandler()
		baseHdr.handlers[1] = DemoHandler()
	
		assert ( baseHdr:getHandler(1):getClass() == DemoHandler )
		assert ( baseHdr:getHandler(0):getClass() == NullHandler, 'default NullHandler' )
		
		baseHdr.nullHandler = NullDemoHandler()
		assert ( baseHdr:getHandler(0):getClass() == NullDemoHandler )
	end;
	
	test_onRequest = function(self)
		local DemoHandler = TestCase:extends({
			handle = function(self) end;
		})
		
		local baseHdr = BaseCmdHandler()
		baseHdr.handlers[1] = DemoHandler()
		
		self.mm:mock(baseHdr.handlers[1], 'handle')
		local g_cmd = {subcmd=1}
		baseHdr:onRequest(self.player, nil, g_cmd)
		assert ( self.mm.walkLog == 'handle' )
		assertListEQ ( self.mm.params['handle'], {self.player, g_cmd} )
	end;
})


tqBaseCmdHandler_t_main = function(suite)
	suite:addTestCase(TestCaseBaseCmdHandler, 'TestCaseBaseCmdHandler')
end;


