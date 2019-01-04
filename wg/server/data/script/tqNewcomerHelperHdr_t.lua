--*******************************************************************************
require('tqNewcomerHelperHdr')

local TestCaseNewcomerHelperHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = NewcomerHelperHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , NewHelperGetCurNodeHdr )
	end;
})

local TestCaseNewHelperGetCurNodeHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = NewcomerHelperHdr():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(NewcomerTaskSender, 'sendCurTask')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendCurTask'], {self.player} )
	end;
})


tqNewcomerHelperHdr_t_main = function(suite)
	suite:addTestCase(TestCaseNewcomerHelperHdr, 'TestCaseNewcomerHelperHdr')
	suite:addTestCase(TestCaseNewHelperGetCurNodeHdr, 'TestCaseNewHelperGetCurNodeHdr')
end;


