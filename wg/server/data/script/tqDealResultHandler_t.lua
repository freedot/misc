--*******************************************************************************
require('tqDealResultHandler')

local TestCaseDealResultHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		g_use_self_gold = false
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		g_use_self_gold = true
	end;
	
	test_handleDealResultFailed = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2, token='token1'})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, token="token1", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100176, ''} )
		assertEQ ( GET_LOG(), '<deal>deal result error: user=player, resid=3000147, price=5, number=2, token=token1' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
	end;
	
	test_handleDealResultFailedWhenDealTimeout = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2, token='token1'})
		Service:getProxyServer():resetDealTime('player', 30)
		
		Util:setTimeDrt(50)
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, token="token1", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100177, ''} )
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( GET_LOG(), '<deal>timeout, deal result error: user=player, resid=3000147, price=5, number=2, token=token1' )
	end;
	
	test_handleDealResultFailedWhenPlayerNoExist = function(self)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', {nil} )
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player_unkown", ret=-1, token="token1", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>player not exist, deal result error: user=player_unkown, resid=3000147, price=5, number=2, token=token1' )
	end;	
	
	test_handleDealResultFailedWhenTokenNotEQ = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2, token='token1'})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=-1, token="token2", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100178, ''} )
		assertEQ ( GET_LOG(), '<deal>token not fit, deal result error: user=player, resid=3000147, price=5, number=2, token=token2' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
	end;
	
	test_handleDealResultSucc = function(self)
		Service:getProxyServer():addDeal(self.player, {cmdpkg={cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=2}, resid=3000046, price=5, number=2, token='token1'})
		local cmd = {openid="player", ret=0, token="token1", resid=3000046, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>deal result succ: user=player, resid=3000046, price=5, number=2, token=token1' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.player:getPkg():getItemNumber(3000046), 2 )
	end;
	
	test_handleDealResultSuccButSendItemError = function(self)
		Service:getProxyServer():addDeal(self.player, {cmdpkg={cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=2}, resid=3000046, price=1, number=2, token='token1'})
		local cmd = {openid="player", ret=0, token="token1", resid=3000046, price=1, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal-error>deal result succ, but send item failed: user=player, resid=3000046, price=1, number=2, token=token1' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
		assertEQ ( self.player:getPkg():getGold(), 1*2 )
		assertEQ ( self.player:getPkg():getItemNumber(3000046), 0 )
	end;
	
	test_handleDealResultSuccWhenTokenNotEQ = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2, token='token1'})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=0, token="token2", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100178, ''} )
		assertEQ ( GET_LOG(), '<deal>token not fit, deal result succ: user=player, resid=3000147, price=5, number=2, token=token2' )
		assertEQ ( Service:getProxyServer():getDeal('player'), nil )
	end;
	
	test_handleDealResultSuccWhenDealTimeout = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2, token='token1'})
		Service:getProxyServer():resetDealTime('player', 30)
		
		Util:setTimeDrt(50)
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=0, token="token1", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100177, ''} )
		assertEQ ( self.player:getPkg():getGold(), 5*2 )
		assertEQ ( GET_LOG(), '<deal>timeout, deal result succ: user=player, resid=3000147, price=5, number=2, token=token1' )
	end;
	
	test_handleDealResultSuccWhenPlayerNoExist = function(self)
		self.mm:mock(app:getPlayerMgr(), 'getOrLoadPlayerByUserName', {nil} )
		Service:getProxyServer():addDeal(self.player, {resid=3000147, price=5, number=2})
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player_unkown", ret=0, token="token1", resid=3000147, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( GET_LOG(), '<deal>player not exist, deal result succ: user=player_unkown, resid=3000147, price=5, number=2, token=token1' )
	end;
	
	test_handleDealResultSuccWhenDealTimeoutAndIsGoldId = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		Service:getProxyServer():addDeal(self.player, {resid=FIXID.GOLD_1, price=5, number=2, token='token1'})
		Service:getProxyServer():resetDealTime('player', 30)
		
		Util:setTimeDrt(50)
		assertEQ ( self.player:getPkg():getGold(), 0 )
		local cmd = {openid="player", ret=0, token="token1", resid=FIXID.GOLD_1, price=5, number=2}
		DealResultHandler():onRequest(nil, nil, cmd)
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.player:getPkg():getGold(), 10*2 )
		assertEQ ( GET_LOG(), '<deal>deal result succ: user=player, resid=' .. FIXID.GOLD_1 .. ', price=5, number=2, token=token1' )
	end;
})


tqDealResultHandler_t_main = function(suite)
	suite:addTestCase(TestCaseDealResultHandler, 'TestCaseDealResultHandler')
end;


