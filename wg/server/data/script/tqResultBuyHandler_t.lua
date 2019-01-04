--*******************************************************************************
require('tqResultBuyHandler')

local TestCaseResultBuyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ResultBuyHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , ResultBuySuccHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , ResultBuyCancelHandler )
	end;	
})

local TestCaseResultBuySuccHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ResultBuyHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(10)
		self.player:setName('user')
		Service:getProxyServer():addDeal(self.player, {resid=5490001, price=5, number=2})
		self.hdr:handle(self.player)
		assertEQ ( Service:getProxyServer():getDeal('user') ~= nil, true )
		
		Util:setTimeDrt(10 + 30)
		assertEQ ( Service:getProxyServer():getDeal('user') ~= nil, true )
		
		Util:setTimeDrt(10 + 30 + 1)
		assertEQ ( Service:getProxyServer():getDeal('user') == nil, true )
	end;
})

local TestCaseResultBuyCancelHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ResultBuyHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(10)
		self.player:setName('user')
		Service:getProxyServer():addDeal(self.player, {resid=5490001, price=5, number=2})
		self.hdr:handle(self.player)
		assertEQ ( Service:getProxyServer():getDeal('user') ~= nil, true )
		
		Util:setTimeDrt(10 + 5)
		assertEQ ( Service:getProxyServer():getDeal('user') ~= nil, true )
		
		Util:setTimeDrt(10 + 5 + 1)
		assertEQ ( Service:getProxyServer():getDeal('user') == nil, true )
	end;
})


tqResultBuyHandler_t_main = function(suite)
	suite:addTestCase(TestCaseResultBuyHandler, 'TestCaseResultBuyHandler')
	suite:addTestCase(TestCaseResultBuySuccHandler, 'TestCaseResultBuySuccHandler')
	suite:addTestCase(TestCaseResultBuyCancelHandler, 'TestCaseResultBuyCancelHandler')
end;


