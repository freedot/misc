--*******************************************************************************
require('tqExchangeHandler')

local TestCaseExchangeHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})


local TestCaseExchangeHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ExchangeHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , ExchangeItemHandler )
	end;
})

local TestCaseExchangeItemHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ExchangeHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_invalidDropId = function(self)
		local cmd = {dropId=0, count=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_invalidCount = function(self)
		local cmd = {dropId=7500328, count=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {dropId=7500328, count=-1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {dropId=7500342, count=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_noEnoughMaterial = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=5000041, number=10})})
		local cmd = {dropId=7500327, count=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_noEnoughPkg = function(self)
		self.player:getPkg():setMaxGridsCnt(1)
		self.player:getPkg():addItems({RawItemEx({resId=5000041, number=16})})
		local cmd = {dropId=7500327, count=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_ok = function(self)
		self.player:getPkg():setMaxGridsCnt(10)
		self.player:getPkg():addItems({RawItemEx({resId=5000041, number=16})})
		local cmd = {dropId=7500327, count=2}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getItemNumber(5000041), 16 - 2*7 )
		assertEQ ( self.player:getPkg():getItemNumber(3000124), 2 )
	end;
})



tqExchangeHandler_t_main = function(suite)
	suite:addTestCase(TestCaseExchangeHandler, 'TestCaseExchangeHandler')
	suite:addTestCase(TestCaseExchangeItemHandler, 'TestCaseExchangeItemHandler')
end;


