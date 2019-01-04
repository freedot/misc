--*******************************************************************************
require('tqGetBuyTokenHandler')

local TestCaseGetBuyTokenHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		g_use_self_gold = false
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		g_use_self_gold = true
	end;
	
	test_handleGetTokenFailedWhenPlayerNotYellowDiamond = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, msg="error"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100176, ''} )
		assertEQ ( GET_LOG(), '<deal>get token error: user=player, resid=3000147, price=5, number=2, ret=-1, msg=error' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
	end;
	
	test_handleGetTokenFailedWhenPlayerIsYellowDiamond = function(self)
		g_use_self_gold = false
		self.player:setQQMembership({is_yellow_vip=1})
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, msg="error"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.player:getPkg():getGold(), math.floor(5*0.8)*2 )
		g_use_self_gold = true
	end;
	
	test_handleGetTokenFailedWhenDealTimeout = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		Service:getProxyServer():resetDealTime('player', 30)
		
		Util:setTimeDrt(50)
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, msg="error"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100177, ''} )
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( GET_LOG(), '<deal>timeout, get token error: user=player, ret=-1, msg=error' )
	end;
	
	test_handleGetTokenFailedWhenPlayerNoExist = function(self)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', {nil} )
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player_unkown", ret=-1, msg="error"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>player not exist, get token error: user=player_unkown, ret=-1, msg=error' )
	end;
	
	test_handleGetTokenSucc = function(self)
		self.mm:mock(DealByGoldSender, 'sendStartBuy')
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		local cmd = {openid="player", ret=0, url_params="url1", token="token1"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>get token succ: user=player, resid=3000147, price=5, number=2, url_params=url1, token=token1' )
		local deal = Service:getProxyServer():getDeal('player')
		assertEQ ( deal.url_params, 'url1')
		assertEQ ( deal.token, 'token1')
		assertEQ ( self.mm.params['sendStartBuy'], {self.player, "url1"} )
	end;
	
	test_handleGetTokenSuccWhenDealTimeout = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		Service:getProxyServer():resetDealTime('player', 30)
		
		Util:setTimeDrt(50)
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=0, url_params="url1", token="token1"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100177, ''} )
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( GET_LOG(), '<deal>timeout, get token succ: user=player, url_params=url1, token=token1' )
	end;
	
	test_handleGetTokenSuccWhenPlayerNoExist = function(self)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', {nil} )
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player_unkown",  ret=0, url_params="url1", token="token1"}
		GetBuyTokenHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>player not exist, get token succ: user=player_unkown, url_params=url1, token=token1' )
	end;
})


tqGetBuyTokenHandler_t_main = function(suite)
	suite:addTestCase(TestCaseGetBuyTokenHandler, 'TestCaseGetBuyTokenHandler')
end;


