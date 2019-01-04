--*******************************************************************************
require('tqProxyServer')

local TestCaseProxyServer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='pf1', pfkey='pfkey1', zoneid='zoneid1' })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_connect = function(self)
		local r_connect = {true}
		self.mm:mock(ProxyServerC, 'connect', r_connect)
		assertEQ ( Service:getProxyServer():connect(), true )
		expectMsg = '{"cmd":1,"zoneId":"1","user":"bdgame","psw":"385wflwreifdew213"}#'
		assertEQ ( ProxyServerC:getSendMsg(), expectMsg )
	end;
	
	test_getHoldPkgCount = function(self)
		self.player:setName('user')
		assertEQ ( Service:getProxyServer():getHoldPkgCount('user'), 0 )
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=5490001, price=5, number=2})
		Service:getProxyServer():resetDealTime('user', 30)
		assertEQ ( Service:getProxyServer():getHoldPkgCount('user'), 0 )

		Util:setTimeDrt(50)
		Service:getProxyServer():addDeal(self.player, {holdPkgCount=1, resid=5490001, price=5, number=2})
		assertEQ ( Service:getProxyServer():getHoldPkgCount('user'), 1 )
		local url = 'http://1251007151.cdn.myqcloud.com/1251007151/images/office/item/big/5490001.gif'
		expectMsg = '{"cmd":3,"params":{"openid":"openid1","openkey":"openkey1","appid":"appid1","pf":"pf1","pfkey":"pfkey1","ts":"' .. os.time() .. '","payitem":"5490001*5*2","goodsmeta":"10金币*10金币","goodsurl":"' .. url .. '","zoneid":"1"}}#'
		assertEQ ( ProxyServerC:getSendMsg(), expectMsg )

		Service:getProxyServer():resetDealTime('user', 30)		
		Util:setTimeDrt(50 + 30 + 1)
		assertEQ ( Service:getProxyServer():getHoldPkgCount('user'), 0 )
	end;
	
	test_sendQueryGold = function(self)
		g_use_self_gold = false
		Service:getProxyServer():sendQueryGold(self.player)
		expectMsg = '{"cmd":2,"params":{"openid":"openid1","openkey":"openkey1","appid":"appid1","pf":"pf1","pfkey":"pfkey1","ts":"' .. os.time() .. '","zoneid":"1"}}#'
		assertEQ ( ProxyServerC:getSendMsg(), expectMsg )
		g_use_self_gold = true
	end;
	
	test_sendQueryUserExist = function(self)
		Service:getProxyServer():sendQueryUserExist(1, -1)
		expectMsg = '{"cmd":7,"clientid":1,"ret":-1}#'
		assertEQ ( ProxyServerC:getSendMsg(), expectMsg )
	end;
})


tqProxyServer_t_main = function(suite)
	suite:addTestCase(TestCaseProxyServer, 'TestCaseProxyServer')
end;


