--*******************************************************************************
require('tqPlayerBuyLimiter')

local TestCasePlayerBuyLimiter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.buyLimiter = self.player:getBuyLimiter()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getTodayLeftNumer = function(self)
		Util:setTimeDrt(1396954373)
		assertEQ ( self.buyLimiter:getTodayLeftNumber(2500144), 0xffffffff )
		
		local res = Util:find(res_shops, 'itemid', 3000046)
		self.buyLimiter:addBuyItemId(3000046, res.itemnum/2)
		assertEQ ( self.buyLimiter:getTodayLeftNumber(3000046), res.itemnum/2 )
		self.buyLimiter:addBuyItemId(3000046, res.itemnum/2)
		assertEQ ( self.buyLimiter:getTodayLeftNumber(3000046), 0 )
		
		Util:setTimeDrt(1396954373 + 24*3600)
		assertEQ ( self.buyLimiter:getTodayLeftNumber(3000046), res.itemnum )
	end;
})


tqPlayerBuyLimiter_t_main = function(suite)
	suite:addTestCase(TestCasePlayerBuyLimiter, 'TestCasePlayerBuyLimiter')
end;


