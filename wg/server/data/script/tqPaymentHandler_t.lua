--*******************************************************************************
require('tqPaymentHandler')

local TestCasePaymentHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = PaymentHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , PaymentStartHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , PaymentStopHandler )
	end;	
})

local TestCasePaymentStartHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = PaymentHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(self.player, 'startPay')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'startPay' )
	end;
})

local TestCasePaymentStopHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = PaymentHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(self.player, 'stopPay')
		self.mm:mock(Service:getProxyServer(), 'sendQueryGold')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'stopPay,sendQueryGold' )
	end;
})


tqPaymentHandler_t_main = function(suite)
	suite:addTestCase(TestCasePaymentHandler, 'TestCasePaymentHandler')
	suite:addTestCase(TestCasePaymentStartHandler, 'TestCasePaymentStartHandler')
	suite:addTestCase(TestCasePaymentStopHandler, 'TestCasePaymentStopHandler')
end;


