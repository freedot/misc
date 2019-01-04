-- 商城资源
require('tqShopHandler')

local TestCaseShopHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = ShopHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(1):getClass() == ShopBuyItemHandler )
		assert ( self.handler:getHandler(2):getClass() == ShopGetSaleListHandler )
		assert ( self.handler:getHandler(3):getClass() == ShopSaleItemHandler )
		assert ( self.handler:getHandler(4):getClass() == ShopBuyGoldHandler )
	end;
})

local TestCaseShopBuyItemHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = ShopBuyItemHandler()
		res_test_items={
			{id=1,pile=1,buyprice={1000,0,0,0} }
			,{id=2,pile=1,buyprice={0,1000,0,0}}
			,{id=3,pile=1,buyprice={0} }
			,{id=4,pile=1  }
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_player = self.player
		local g_initParamsRt = {false}
		local g_isEnoughExpendsRt = {false}
		local g_isCanBuyRt = {false}
		local g_preAddItemsRt = {false}
		local g_cmd = {}
		local g_expends = {}
		self.handler.payHandler = PayTypeByMoneyHandler()
		self.mm:mock(self.handler, '_initParams', g_initParamsRt, function(self)
			self.player = g_player
			self.resId = 1
			self.number = 2
			self.payHandler:initParams(g_player, 1, 2, 2)
			end)
		self.mm:mock(self.handler.payHandler, 'getExpends', {g_expends})
		self.mm:mock(WUtil, 'isEnoughExpends', g_isEnoughExpendsRt)
		self.mm:mock(self.handler.payHandler, 'isCanBuy', g_isCanBuyRt)
		self.mm:mock(self.handler.payHandler, 'isBind', {1})
		self.mm:mock(self.handler, '_getFactResId', {3000001})
		self.mm:mock(self.player:getPkg(), 'preAddItems', g_preAddItemsRt)
		self.mm:mock(self.player:getPkg(), 'addItems')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(WUtil, 'subExpends')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,getExpends,isEnoughExpends' )
		assertListEQ ( self.mm.params['isEnoughExpends'], {g_expends} )
		
		self.mm:clear()
		g_isEnoughExpendsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,getExpends,isEnoughExpends,isCanBuy' )
		
		self.mm:clear()
		g_isCanBuyRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,getExpends,isEnoughExpends,isCanBuy,isBind,_getFactResId,isBind,preAddItems,sendWarningMsgArgs' )
		assert ( self.mm.params['preAddItems'][1][1]:getClass() == RawItemEx )
		assert ( self.mm.params['preAddItems'][1][1]:getResId() == 3000001 )
		assert ( self.mm.params['preAddItems'][1][1]:getNumber() == 2 )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {g_player, 100023, ''} )
		assertListEQ ( self.mm.params['_getFactResId'], {true, 1} )
		
		self.mm:clear()
		g_preAddItemsRt[1] = true
		self.handler.itemres = {id=3000001}
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,getExpends,isEnoughExpends,isCanBuy,isBind,_getFactResId,isBind,preAddItems,addItems,subExpends' )
		
		self.mm:clear()
		res_test_items = {{id=3000001, apos=1}}
		self.handler.itemres = {id=3000001, apos=1}
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assertListEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.BUY_ONE_ARM} )
	end;
	
	test_handleByGold = function(self)
		Util:setTimeDrt(10)
		self.player:setName('user')
		self.mm:mock(TaskFinisher, 'trigerTask')
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=2}
		assertEQ ( self.handler:handle(self.player, cmd), false )
		Service:getProxyServer():resetDealTime('user', 30)
		
		self.player:getPkg():addGold(5*2)
		self.mm:clear()
		assertEQ ( self.handler:handle(self.player, cmd), true )
		Service:getProxyServer():resetDealTime('user', 30)
		assertEQ ( self.player:getPkg():getGold(), 0, 'not fact sub gold, just cache it')
		assertEQ ( self.player:getPkg():getItemNumber(3000046), 0 )
		assertEQ ( Service:getProxyServer():getDeal('user'), {stamp=Util:getTime(), timeout=30, holdPkgCount=1, cmdpkg=cmd, resid=3000046, number=2, price=5} )
	end;
	
	test_handleByGoldTooFrequently = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		self.player:setName('user')
		self.player:getPkg():addGold(5*2 + 5*2)
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=2}
		assertEQ ( self.handler:handle(self.player, cmd), true )
		Service:getProxyServer():resetDealTime('user', 30)

		Util:setTimeDrt(10+30)
		assertEQ ( self.handler:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100176, ''} )
		
		Util:setTimeDrt(10+30+1)
		assertEQ ( self.handler:handle(self.player, cmd), true )
	end;
	
	test_handleByGoldFactSendGoods = function(self)
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=2}
		self.player:getPkg():addGold(5*2)
		local factSendGold = true
		assertEQ ( self.handler:handle(self.player, cmd, factSendGold), true )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.player:getPkg():getItemNumber(3000046), 2 )
	end;
	
	test_handleArrivedLimitNumber = function(self)
		Util:setTimeDrt(1396954373)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local res = Util:find(res_shops, 'itemid', 3000046)
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=res.itemnum}
		self.player:getPkg():addGold(5*res.itemnum)
		local factSendGold = true
		assertEQ ( self.handler:handle(self.player, cmd, factSendGold), true )
		
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000046, num=1}
		self.player:getPkg():addGold(5*1)
		assertEQ ( self.handler:handle(self.player, cmd, factSendGold), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100180, '"@itemid3000046"'} )
		self.player:getPkg():subGold( self.player:getPkg():getGold() )
		
		local res = Util:find(res_shops, 'itemid', 3000047)
		local number =  res.itemnum + 10
		local cmd = {cmd=NETCMD.SHOP, subcmd=1, paytype=PAY_TYPE.GOLD, resid=3000047, num=number}
		self.player:getPkg():addGold(5*number)
		local factSendGold = true
		assertEQ ( self.handler:handle(self.player, cmd, factSendGold), true )
		assertEQ ( self.player:getPkg():getGold(), 5*number - 5*res.itemnum )
		assertEQ ( self.player:getPkg():getItemNumber(3000047), res.itemnum )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100180, '"@itemid3000047"' } )
	end;
	
	test__initParams = function(self)
		local g_cmd = {paytype=PAY_TYPE.FIRST-1,resid=3,num=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.LAST+1,resid=3,num=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=0,num=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=-1,num=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=1,num=0}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=1,num=-1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=1000000000,num=1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=4,num=1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST+1,resid=3,num=1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=2,num=1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local g_typeHandler = PayTypeByMoneyHandler()
		self.mm:mock(self.handler, '_getTypeHandler', {g_typeHandler})
		self.mm:mock(g_typeHandler, 'initParams' )
		
		g_cmd = {paytype=PAY_TYPE.FIRST,resid=1,num=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.player == self.player )
		assert ( self.handler.resId == 1 )
		assert ( self.handler.number == 2 )
		assert ( self.handler.itemres == res_test_items[1] )
		assert ( self.mm.walkLog == '_getTypeHandler,initParams' )
		assertListEQ ( self.mm.params['_getTypeHandler'], {PAY_TYPE.FIRST} )
		assertListEQ ( self.mm.params['initParams'], {self.player, 1, 1000, 2} )
	end;
	
	test__getFactResId = function(self)
		res_test_items = {{id=10001, isbind=0, bindid=10002, nobindid=0},{id=10002,isbind=1,bindid=0, nobindid=10001}}
		assertEQ ( self.handler:_getFactResId(false, 10001), 10001 )
		assertEQ ( self.handler:_getFactResId(true, 10001), 10002 )
		assertEQ ( self.handler:_getFactResId(false, 10002), 10001 )
		assertEQ ( self.handler:_getFactResId(true, 10002), 10002 )
	end;
	
	test__getTypeHandler = function(self)
		assert ( self.handler:_getTypeHandler(PAY_TYPE.MONEY):getClass() == PayTypeByMoneyHandler)
		assert ( self.handler:_getTypeHandler(PAY_TYPE.GOLD):getClass() == PayTypeByGoldHandler)
		assert ( self.handler:_getTypeHandler(PAY_TYPE.GIFTGOLD):getClass() == PayTypeByGiftGoldHandler)
		assert ( self.handler:_getTypeHandler(PAY_TYPE.PRESTIGE):getClass() == PayTypeByPrestigeHandler)
	end;
})

local TestCasePayTypeByMoneyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = PayTypeByMoneyHandler()
		res_smithy_salelist={
			{ itemIds={} }
			}
		res_smithy_salelist[1].itemIds[1] = true
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_initParams = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		assert ( self.handler.player == self.player )
		assert ( self.handler.resId == 1 )
		assert ( self.handler.oneNeedPay == 2 )
		assert ( self.handler.number == 3 )
	end;
	
	test_getExpends = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		
		local g_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {g_expends} )
		assert ( self.handler:getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( self.mm.params['createExpendObjs'][3][1].attr == ATTR.MONEY )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.MONEY )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )	
	end;
	
	test_isCanBuy = function(self)
		self.handler:initParams(self.player, 2, 2, 3)
		assert ( self.handler:isCanBuy() == false )
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.SMITHY,level=1,state=0} } })
		assert ( self.handler:isCanBuy() == false )
		
		self.handler:initParams(self.player, 1, 2, 3)
		assert ( self.handler:isCanBuy() == true )	
	end;
	
	test_isBind = function(self)
		assert ( self.handler:isBind() == 1 )
	end;
	
	test_isGold = function(self)
		assert ( self.handler:isGold() == false )
	end;
})

local TestCasePayTypeByGoldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = PayTypeByGoldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getExpends = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		
		local g_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {g_expends} )
		assert ( self.handler:getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( self.mm.params['createExpendObjs'][3][1].attr == ATTR.GOLD )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.GOLD )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )	
	end;
	
	test_isCanBuy = function(self)
		self.handler:initParams(self.player, 2, 2, 3)
		assert ( self.handler:isCanBuy() == true )
	end;
	
	test_isBind = function(self)
		assert ( self.handler:isBind() == 0 )
	end;
	
	test_isGold = function(self)
		assert ( self.handler:isGold() == true )
	end;
})

local TestCasePayTypeByGiftGoldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = PayTypeByGiftGoldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getExpends = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		
		local g_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {g_expends} )
		assert ( self.handler:getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( self.mm.params['createExpendObjs'][3][1].attr == ATTR.GIFTGOLD )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.GIFTGOLD )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )	
	end;
	
	test_isCanBuy = function(self)
		self.handler:initParams(self.player, 2, 2, 3)
		assert ( self.handler:isCanBuy() == true )
	end;
	
	test_isBind = function(self)
		assert ( self.handler:isBind() == 1 )
	end;
})

local TestCasePayTypeByPrestigeHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = PayTypeByPrestigeHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getExpends = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		
		local g_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {g_expends} )
		assert ( self.handler:getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( self.mm.params['createExpendObjs'][3][1].attr == ATTR.PRESTIGE )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.PRESTIGE )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )
	end;
	
	test_isCanBuy = function(self)
		self.handler:initParams(self.player, 2, 2, 3)
		assert ( self.handler:isCanBuy() == true )
	end;
	
	test_isBind = function(self)
		assert ( self.handler:isBind() == 1 )
	end;
})

local TestCasePayTypeByHonorHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = PayTypeByHonorHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getExpends = function(self)
		self.handler:initParams(self.player, 1, 2, 3)
		
		local g_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {g_expends} )
		assert ( self.handler:getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( self.mm.params['createExpendObjs'][3][1].attr == ATTR.HONOR )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.HONOR )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )
	end;
	
	test_isCanBuy = function(self)
		self.handler:initParams(self.player, 2, 2, 3)
		assert ( self.handler:isCanBuy() == true )
	end;
	
	test_isBind = function(self)
		assert ( self.handler:isBind() == 1 )
	end;
})

local TestCastShopSaleItemHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = ShopSaleItemHandler()
		res_test_items = {{id=1,pile=2},{id=2,pile=2,salePrice=0},{id=3,pile=2,salePrice=10}}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_player = self.player
		local g_cmd = {}
		local g_item = LuaItemEx(self.resItem)
		
		local g_initParamsRt = {false}
		local g_isCanSaleRt = {false}
		self.mm:mock(self.handler, '_initParams', g_initParamsRt, function(self)
			self.player = g_player
			self.itemId = 1
			self.saleMoney = 2
			self.item = g_item
			end)
		self.mm:mock(self.handler, '_isCanSale', g_isCanSaleRt)
		self.mm:mock(self.player:getPkg(), 'delItemById')
		self.mm:mock(self.player:getCityRes(), 'addMoney')
		self.mm:mock(ItemMsgSender, 'sendDelItem')
		self.mm:mock(self.handler, '_sendSuccResult')
		
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {g_player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isCanSale' )
		
		self.mm:clear()
		g_isCanSaleRt[1] = true
		assert ( self.handler:handle(g_player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isCanSale,_sendSuccResult,delItemById,addMoney,sendDelItem' )
		assertListEQ ( self.mm.params['delItemById'], {g_item:getId()} )
		assertListEQ ( self.mm.params['addMoney'], {2} )
		assertListEQ ( self.mm.params['sendDelItem'], {g_player, 1} )
		
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	test__initParams = function(self)
		local g_cmd = {}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {id=0}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {id=-1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {id=100000000}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local item = self.player:getPkg():_addItem(RawItemEx({resId=1, number=2}))
		item:setResId(100)
		g_cmd = {id=item:getId()}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		item:setResId(1)
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.itemId == item:getId() )
		assert ( self.handler.item == item )
		assert ( self.handler.player == self.player )
		assert ( self.handler.saleMoney == 0 )
		
		item:setResId(2)
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.saleMoney == 0 )
		
		item:setResId(3)
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.saleMoney == 2*10 )
	end;
	
	test__isCanSale = function(self)
		self.handler.saleMoney = 0
		assert ( self.handler:_isCanSale() == false )
		
		self.handler.player = self.player
		self.handler.saleMoney = 1
		self.resItem.gems.gems[1] = 1001
		self.handler.item = LuaItemEx(self.resItem)
		
		assert ( self.handler:_isCanSale() == true )
		
		self.handler.item:addGem(1001)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assert ( self.handler:_isCanSale() == false )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100036, ''} )
	end;
	
	test__sendSuccResult = function(self)
		self.handler.player = self.player
		self.handler.saleMoney = 2
		self.handler.item = LuaItemEx(self.resItem)
		
		self.mm:mock(WUtil, 'sendSuccMsgArgs')

		self.handler:_sendSuccResult()
		assert ( self.mm.walkLog == 'sendSuccMsgArgs' )
		assertListEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100040, '"@itemid3",2'} )	
	end;	
})

local TestCaseShopGetSaleListHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr =  ShopHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init_res_shops_class = function(self)
		local res_shops_ = res_shops
		res_shops = {{id=1, type=1, itemid=1001},{id=2, type=1, itemid=1002},{id=3, type=2, itemid=1003}}
		res_shops_tagsname = {{id=1, name='tag1'}, {id=2, name='tag2'}}
		res_shops_class = {}
		init_res_shops_class()
		assertEQ ( res_shops_class, {{id=1, name='tag1', list={{id=1001},{id=1002}}}, {id=2, name='tag2', list={{id=1003}}}} )
		res_shops = res_shops_
	end;
	
	test_handle = function(self)
		self.mm:mock(ShopSender, 'sendShopSalesList')
		res_shops_class = {{id=1, name='tag1', list={{id=1001},{id=1002}}}, {id=2, name='tag2', list={{id=1003}}}}
		self.hdr:handle(self.player)
		--assertEQ ( self.mm.params['sendShopSalesList'], {self.player, res_shops_class} )
	end;
})

local TestCaseShopBuyGoldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr =  ShopHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handleInvalidId = function(self)
		local cmd = {id=FIXID.GOLD_1 - 1, number=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {id=FIXID.GOLD_4 + 1, number=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleInvalidNumber = function(self)
		local cmd = {id=FIXID.GOLD_1, number=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {id=FIXID.GOLD_1, number=-1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		local cmd = {id=FIXID.GOLD_1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handleFactBuyGold = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(PayGoldSender, 'sendPayGold')
		assertEQ ( self.player:getTask():getPayAct():getAllGold(), 0)
		local cmd = {id=FIXID.GOLD_1, number=2}
		assertEQ ( self.hdr:handle(self.player, cmd, true), true )
		assertEQ ( self.player:getPkg():getGold(), 20 )
		
		cmd = {id=FIXID.GOLD_1, number=20}
		assertEQ ( self.hdr:handle(self.player, cmd, true), true )
		assertEQ ( self.player:getTask():getPayAct():getAllGold(), 220)
		assertEQ ( self.player:getVipLevel(), 1 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FIRST_RECHARGE} )
		assertEQ ( self.mm.params['sendPayGold'], {self.player} )
	end;
})

tqShopHandler_t_main = function(suite)
	suite:addTestCase(TestCaseShopHandler, 'TestCaseShopHandler')
	suite:addTestCase(TestCaseShopBuyItemHandler, 'TestCaseShopBuyItemHandler')
	suite:addTestCase(TestCasePayTypeByMoneyHandler, 'TestCasePayTypeByMoneyHandler')
	suite:addTestCase(TestCasePayTypeByGoldHandler, 'TestCasePayTypeByGoldHandler')
	suite:addTestCase(TestCasePayTypeByGiftGoldHandler, 'TestCasePayTypeByGiftGoldHandler')
	suite:addTestCase(TestCasePayTypeByPrestigeHandler, 'TestCasePayTypeByPrestigeHandler')
	suite:addTestCase(TestCasePayTypeByHonorHandler, 'TestCasePayTypeByHonorHandler')
	suite:addTestCase(TestCastShopSaleItemHandler, 'TestCastShopSaleItemHandler')
	suite:addTestCase(TestCaseShopGetSaleListHandler, 'TestCaseShopGetSaleListHandler')
	suite:addTestCase(TestCaseShopBuyGoldHandler, 'TestCaseShopBuyGoldHandler')
end;

