--*******************************************************************************
require('tqQueryUserExistHandler')

local TestCaseQueryUserExistHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_onRequest = function(self)
		local r_IsExistUserName = {false}
		self.mm:mock(SPub, 'IsExistUserName', r_IsExistUserName)
		self.mm:mock(Service:getProxyServer(), 'sendQueryUserExist')
		QueryUserExistHandler():onRequest(nil, nil, {openid='xxx', clientid=10})
		assertEQ ( self.mm.params['IsExistUserName'], {'xxx'} )
		assertEQ ( self.mm.params['sendQueryUserExist'], {10, -1} )
		
		r_IsExistUserName[1] = true
		QueryUserExistHandler():onRequest(nil, nil, {openid='xxx', clientid=10})
		assertEQ ( self.mm.params['sendQueryUserExist'], {10, 1} )
	end;
})


tqQueryUserExistHandler_t_main = function(suite)
	suite:addTestCase(TestCaseQueryUserExistHandler, 'TestCaseQueryUserExistHandler')
end;


