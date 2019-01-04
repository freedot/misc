require('tqPkgHandler')

local TestCasePkgHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = PkgHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.hdr:getHandler(0):getClass() == SendPkgAllDataHdr )
	end;
})


local TestCaseSendPkgAllDataHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
		
	test_handle = function(self)
		self.mm:mock(ItemMsgSender, 'sendAll' )
		self.mm:mock(ItemMsgSender, 'sendSalveMax' )
		self.mm:mock(PkgMiscSender, 'sendAll' )
		
		PkgHandler():getHandler(0):handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendAll,sendSalveMax,sendAll' )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		assertEQ ( self.mm.params['sendSalveMax'], {self.player} )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
	end;
})

tqPkgHandler_t_main = function(suite)
	suite:addTestCase(TestCasePkgHandler, 'TestCasePkgHandler')
	suite:addTestCase(TestCaseSendPkgAllDataHdr, 'TestCaseSendPkgAllDataHdr')
end;


