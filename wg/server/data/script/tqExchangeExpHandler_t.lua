--*******************************************************************************
--  
--*******************************************************************************
require('tqExchangeExpHandler')

local TestCaseExchangeExpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = ExchangeExpHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(1):getClass() == GetExchangeExpTimesHdr )
		assert ( self.handler:getHandler(2):getClass() == ExchangeHerosExpHdr )
	end;	
})

local TestCaseGetExchangeExpTimesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ExchangeHeroExpSender, 'sendTodayTimes')
		GetExchangeExpTimesHdr():handle(self.player)
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player} )
	end;
})

local TestCaseExchangeHerosExpHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ExchangeHerosExpHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		local r_hasEnoughTimes = {false}
		local r_hasEnoughCityRes = {false}
		local r_hasEnoughCap = {false}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(self.hdr, '_hasEnoughTimes', r_hasEnoughTimes)
		self.mm:mock(self.hdr, '_hasEnoughCommRes', r_hasEnoughCityRes)
		self.mm:mock(self.hdr, '_hasEnoughCap', r_hasEnoughCap)
		self.mm:mock(self.hdr, '_subCommRes')
		self.mm:mock(self.hdr, '_exchange')
		self.mm:mock(self.hdr, '_sendMsgs')
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParam[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_hasEnoughTimes' )
		
		self.mm:clear()
		r_hasEnoughTimes[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_hasEnoughTimes,_hasEnoughCommRes' )
		
		self.mm:clear()
		r_hasEnoughCityRes[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_hasEnoughTimes,_hasEnoughCommRes,_hasEnoughCap' )
		
		self.mm:clear()
		r_hasEnoughCap[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )

		assertEQ ( self.mm.walkLog, '_initParam,_hasEnoughTimes,_hasEnoughCommRes,_hasEnoughCap,_subCommRes,_exchange,_sendMsgs' )
	end;
	
	test__initParam = function(self)
		local p_cmd = {times=0}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false )
		
		local p_cmd = {times=-1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false )
		
		local p_cmd = {times=1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.times, 1 )
	end;
	
	test__hasEnoughTimes = function(self)
		self.mm:mock(self.player:getCitys(), 'getExchangeExpTodayTimes', {{curTimes=1, maxTimes=2}})
		
		self.hdr.times = 1
		self.hdr.player = self.player
		assertEQ ( self.hdr:_hasEnoughTimes(), true )
		
		self.hdr.times = 2
		self.hdr.player = self.player
		assertEQ ( self.hdr:_hasEnoughTimes(), false )
	end;
	
	test__hasEnoughCommResAndSubCommRes = function(self)
		self.hdr.times = 1
		self.hdr.player = self.player
		
		self.player:getCityRes():setFood(999)
		self.player:getCityRes():setWood(999)
		self.player:getCityRes():setStone(999)
		self.player:getCityRes():setIron(999)
		
		assertEQ ( self.hdr:_hasEnoughCommRes(), false )
		
		self.player:getCityRes():setFood(1000)
		assertEQ ( self.hdr:_hasEnoughCommRes(), false )
		
		self.player:getCityRes():setWood(1000)
		assertEQ ( self.hdr:_hasEnoughCommRes(), false )
		
		self.player:getCityRes():setStone(1000)
		assertEQ ( self.hdr:_hasEnoughCommRes(), false )
		
		self.player:getCityRes():setIron(1000)
		assertEQ ( self.hdr:_hasEnoughCommRes(), true )
		
		self.hdr:_subCommRes()
		assertEQ ( self.player:getCityRes():getFood(), 0 )
		assertEQ ( self.player:getCityRes():getWood(), 0 )
		assertEQ ( self.player:getCityRes():getStone(), 0 )
		assertEQ ( self.player:getCityRes():getIron(), 0 )
	end;
	
	test__hasEnoughCap = function(self)
		self.mm:mock(self.player, 'getAttrVal', nil, function(self, attrId)
			if attrId == ATTR.XPS then
				return 1000
			elseif attrId == ATTR.MXPS then
				return 2000
			end
		end)
		
		self.hdr.times = 1
		self.hdr.player = self.player
		assertEQ ( self.hdr:_hasEnoughCap(), true )
		
		self.hdr.times = 2
		assertEQ ( self.hdr:_hasEnoughCap(), false )
	end;
	
	test__exchange = function(self)
		self.hdr.times = 1
		self.hdr.player = self.player
		self.mm:mock(self.player, 'addXPSAttr')
		self.mm:mock(self.player:getCitys(), 'addExchangeExpTodayTimes')
		self.hdr:_exchange()
		assertEQ ( self.mm.params['addXPSAttr'], {1000} )
		assertEQ ( self.mm.params['addExchangeExpTodayTimes'], {1} )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.mm:mock(RoleAttrSender, 'sendAttr')
		self.mm:mock(ExchangeHeroExpSender, 'sendTodayTimes')
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendAttr,sendTodayTimes' )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.player:getAttr(ATTR.XPS)} )
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player} )
	end;
})


tqExchangeExpHandler_t_main = function(suite)
	suite:addTestCase(TestCaseExchangeExpHandler, 'TestCaseExchangeExpHandler')
	suite:addTestCase(TestCaseGetExchangeExpTimesHdr, 'TestCaseGetExchangeExpTimesHdr')
	suite:addTestCase(TestCaseExchangeHerosExpHdr, 'TestCaseExchangeHerosExpHdr')
end;


