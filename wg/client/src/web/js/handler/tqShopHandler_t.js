//---
requireEx('./handler/tqShopHandler.js', [
	{
		start:'//BuyItemDlg-unittest-start'
		,end:'//BuyItemDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_myhave'
			,'m_buyprice'
			,'m_items'
			,'m_item'
			,'m_maxnum'
			,'m_resItem'
			,'_isCanBuy'
			,'_hasPrice'
			,'_initParams'
			,'_initDlg'
			,'_initInfo'
			,'_recalPay'
			,'_hideAllPaymentRadios'
			,'_resetPaymentRadios'
			,'_getPayment'
			]
	}
]);

TestCaseBuyItemDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = BuyItemDlg.snew(this.g);
		this.lc = this.dlg.lc;
		
		res_test_items = [
			{id:1,buyprice:[1,0,0]}
			,{id:2,buyprice:[0,0,1],nobindid:1}
			,{id:11,buyprice:[0,10,0], targets:[35], canBuyAndUse:1}
			,{id:12,buyprice:[0,0,1], canUse:1}
			,{id:13,buyprice:[0,0,1], targets:[], canBuyAndUse:1}
			,{id:14,buyprice:[0,0,1], targets:[1], canBuyAndUse:0}
			,{id:15,buyprice:[0,0,1], targets:[1]}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		var g_item = {};
		
		var g_isCanBuyRt = [false];
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_isCanBuy', g_isCanBuyRt);
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_initInfo');
		
		this.dlg.openDlg(g_item);
		assert ( this.mm.walkLog == '_initParams,_isCanBuy' );
		assertListEQ ( this.mm.params['_initParams'], [g_item] );
		
		this.mm.clear();
		g_isCanBuyRt[0] = true;
		this.dlg.openDlg(g_item);
		assert ( this.mm.walkLog == '_initParams,_isCanBuy,_initDlg,_initInfo' );
	};
	
	this.test_buyAndUseBtnShow = function(){
		this.dlg.openDlg({id:0, resid:11, number:10000});
		assertEQ ( this.lc().m_dlg.getBtns()[0].isShow(), true );
	};
	
	this.test_buyAndUseBtnHide = function(){
		this.dlg.openDlg({id:0, resid:12, number:10000});
		assertEQ ( this.lc().m_dlg.getBtns()[0].isShow(), false, 'has no targets' );
		
		this.dlg.openDlg({id:0, resid:13, number:10000});
		assertEQ ( this.lc().m_dlg.getBtns()[0].isShow(), false, 'has no targets' );
		
		this.dlg.openDlg({id:0, resid:14, number:10000});
		assertEQ ( this.lc().m_dlg.getBtns()[0].isShow(), false, 'canBuyAndUse is 0' );
		
		this.dlg.openDlg({id:0, resid:15, number:10000});
		assertEQ ( this.lc().m_dlg.getBtns()[0].isShow(), false, 'canBuyAndUse is null' );
	};
	
	this.checkClickBuyBtn = function(btnIdx, msg){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(ShopSender, 'sendBuyItem');
		
		var item = {id:0, resid:11, number:10000};
		this.dlg.openDlg(item);
		this.lc().m_dlg.getBtns()[btnIdx].click();
		assertEQ ( this.mm.walkLog, 'sysMsgTips', msg );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_ERROR, TQ.format(rstr.shop.buyitem.lessmoney, rstr.shop.buyitem.paynames[1])], msg );
		assertEQ ( this.lc().m_dlg.isShow(), true, msg );
		
		this.mm.clear();
		this.g.getImgr().setGold(10);
		this.dlg.openDlg(item);
		this.lc().m_dlg.getBtns()[btnIdx].click();
		assertEQ ( this.mm.walkLog, 'sendBuyItem', msg );
		assertEQ ( this.mm.params['sendBuyItem'], [this.g, 1, 1, item] , msg);
		assertEQ ( this.lc().m_dlg.isShow(), false, msg );		
	};
	
	this.test_clickBuyBtn = function(){
		var buyBtnIdx = 1;
		this.checkClickBuyBtn(buyBtnIdx, 'test_clickBuyBtn');
	};
	
	this.test_clickBuyAndUseBtn = function(){
		var buyAndUseBtnIdx = 0;
		this.checkClickBuyBtn(buyAndUseBtnIdx, 'test_clickBuyAndUseBtn');
		
		this.mm.mock(UseItemSender, 'send');
		
		this.mm.clear();
		this.g.getImgr().setGold(0);
		var item = {id:0, resid:11, number:10000};
		this.dlg.openDlg(item);
		this.lc().m_dlg.getBtns()[buyAndUseBtnIdx].click();
		assertStrRepeatCount ( this.mm.walkLog, 'send', 0 );
		
		this.mm.clear();
		this.g.getImgr().setGold(10);
		this.dlg.openDlg(item);
		this.lc().m_dlg.getBtns()[buyAndUseBtnIdx].click();
		assertStrRepeatCount ( this.mm.walkLog, 'send', 1 );
		assertEQ ( this.mm.params['send'], [this.g, item, 1, {type:35}] );
	};
	
	this.test__isCanBuy = function(){	
		var g_hasPriceRt = [false];
		this.mm.mock(this.lc(), '_hasPrice', g_hasPriceRt);
		this.mm.mock(this.g.getGUI(), 'msgBox');
		
		assert ( this.lc()._isCanBuy() == false );
		assertListEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.shop.buyitem.cannotbuy, MB_F_CLOSE, null] );
		
		
		g_hasPriceRt[0] = true;
		assert ( this.lc()._isCanBuy() == true );
	};
	
	this.test__initParams = function(){
		var g_item = {resid:1};
		this.lc()._initParams(g_item);
		assert ( this.lc().m_item == g_item );
		assert ( this.lc().m_maxnum == 999 );
		assert ( this.lc().m_resItem == res_test_items[0] );
		assert ( this.lc().m_buyprice == res_test_items[0].buyprice );
		
		g_item = {resid:1,buyprice:[1,0,0],number:10}
		this.lc()._initParams(g_item);
		assert ( this.lc().m_item == g_item );
		assert ( this.lc().m_maxnum == 10 );
		assert ( this.lc().m_resItem == res_test_items[0] );
		assert ( this.lc().m_buyprice == g_item.buyprice );
		
		g_item = {resid:2,number:10};
		this.lc()._initParams(g_item);
		assert ( this.lc().m_item.resid == 1 );
		assert ( this.lc().m_resItem == res_test_items[0] );
		assert ( this.lc().m_buyprice == res_test_items[0].buyprice );
	};
	
	this.test__hasPrice = function(){
		this.lc().m_buyprice = null;
		assert ( this.lc()._hasPrice() == false );
		
		this.lc().m_buyprice = [];
		assert ( this.lc()._hasPrice() == false );
		
		this.lc().m_buyprice = [0,0];
		assert ( this.lc()._hasPrice() == false );
		
		this.lc().m_buyprice = [1,0];
		assert ( this.lc()._hasPrice() == true );
	}
	
	this.test__recalPay = function(){
		this.mm.mock(this.lc(), '_hideAllPaymentRadios');
		this.mm.mock(this.lc(), '_resetPaymentRadios');
		this.lc()._recalPay(10);
		assert ( this.mm.walkLog == '_hideAllPaymentRadios,_resetPaymentRadios' );
		assertListEQ ( this.mm.params['_resetPaymentRadios'], [10] );
	};
	
	this.test__hideAllPaymentRadios = function(){
		this.dlg.openDlg({resid:1});
		this.lc().m_items.payment.getRadio(0).show();
		this.lc().m_items.payment.getRadio(3).show();
		this.lc()._hideAllPaymentRadios();
		assert ( this.lc().m_items.payment.getRadio(0).isShow() == false );
		assert ( this.lc().m_items.payment.getRadio(0).getId() == 100 );
		assert ( this.lc().m_items.payment.getRadio(3).isShow() == false );
		assert ( this.lc().m_items.payment.getRadio(3).getId() == 103 );
	};
	
	this.test__resetPaymentRadios = function(){
		this.dlg.openDlg({resid:1});
		this.lc().m_buyprice = [0,1,0,3];
		this.lc().m_myhave = [10,11,12,13];
		this.lc()._resetPaymentRadios(2);
		assert ( this.lc().m_items.payment.getRadio(0).getId() == 1 );
		assert ( this.lc().m_items.payment.getRadio(1).getId() == 3 );
		var btntext = rstr.shop.buyitem.paynames[1] + ' ' + (1*2)  + ' (' + rstr.comm.have + ':' + 11 +')';
		assert ( this.lc().m_items.payment.getRadio(0).getText() == btntext );
	};
	
	this.test__getPayment = function(){
		this.dlg.openDlg({resid:1});
		this.lc().m_items.payment.getRadio(0).setId(1);
		this.lc().m_items.payment.getRadio(1).setId(2);
		
		this.lc().m_items.payment.select(1);
		assert ( this.lc()._getPayment() == 1 );
		
		this.lc().m_items.payment.select(2);
		assert ( this.lc()._getPayment() == 2 );
	};
});

TestCaseShopDlg = TestCase.extern(function(){
	this.setUp = function(){
		res_test_items = [
			{id:10001, name:'item10001', bigpic:10001, buyprice:[10,0,0,0]}
			,{id:10002, name:'item10002', bigpic:10002, buyprice:[0,20,20,0]}
			,{id:10003, name:'item10003', bigpic:10003, buyprice:[0,20,0,0]}
			,{id:10004, name:'item10004', bigpic:10004, buyprice:[0,0,0,30]}
		];
			
		//res_shops_class = [{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}];	
		res_shops_class = [];
		TestCaseHelper.setUp(this);
		this.dlg = ShopDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.shop.shopdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.shop.shopdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_simulateSendSvrPkg = function(){
		this.mm.mock(this.g, 'sendEvent');
		this.dlg._afterCreate();
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:res_shops_class}}] );
	};
	
	this.test__initInfo = function(){
		this.g.getImgr().setGiftGold(1);
		this.g.getImgr().setGold(2);
		this.g.getImgr().getRoleRes().prestige = 3;
		this.g.getImgr().getRoleRes().cityhonor = 4;
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:[{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}]}});
		this.dlg.hideDlg();
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.tablist.getTabText(0), 'a1' );
		assertEQ ( this.dlg.items_.tablist.getTabText(1), 'a2' );
		
		assertEQ ( TQ.getTextEx(this.dlg.items_.giftgold), 1 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gold), 2 );
			
		assertEQ ( TQ.getTextEx(this.dlg.items_.prestige), 3 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.cityhonor), 4 );
			
		assertEQ ( this.dlg.items_.tablist.getActiveTab(), 0 );
	};
	
	this.test_getSalesListFromSvr = function(){
		this.mm.mock(ShopSender, 'sendGetShopSalesList');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetShopSalesList'], [this.g] );
	};
	
	this.test_goldChange = function(){
		this.g.getImgr().setGiftGold(10);
		this.g.getImgr().setGold(20);
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.PKG_CHANGE, sid:1});
		assertNotEQ ( TQ.getTextEx(this.dlg.items_.giftgold), 10 );
		assertNotEQ ( TQ.getTextEx(this.dlg.items_.gold), 20 );
		this.dlg.openDlg();

		this.g.getImgr().setGiftGold(100);
		this.g.getImgr().setGold(200);
		this.g.sendEvent({eid:EVT.PKG_CHANGE, sid:1});
		assertEQ ( TQ.getTextEx(this.dlg.items_.giftgold), 100 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gold), 200 );
	};
	
	this.test_prestigeAndCityhonorChange = function(){
		this.g.getImgr().getRoleRes().prestige = 30;
		this.g.getImgr().getRoleRes().cityhonor = 40;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:0});
		assertNotEQ ( TQ.getTextEx(this.dlg.items_.prestige), 30 );
		assertNotEQ ( TQ.getTextEx(this.dlg.items_.cityhonor), 40 );
		this.dlg.openDlg();

		this.g.getImgr().getRoleRes().prestige = 300;
		this.g.getImgr().getRoleRes().cityhonor = 400;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:0});
		assertEQ ( TQ.getTextEx(this.dlg.items_.prestige), 300 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.cityhonor), 400 );
	};
	
	this.test__onSvrPkg = function(){
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:[{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}]}});
		assertEQ ( this.g.getImgr().getShopSales(), [{id:1, name:'a1',list:[{id:10001,itemres:res_test_items[0]},{id:10002,itemres:res_test_items[1]}]},{id:2, name:'a2',list:[{id:10003,itemres:res_test_items[2]},{id:10004,itemres:res_test_items[3]}]}] );
		assertNotEQ ( this.dlg.items_.tablist.getTabText(0), 'a1' );
		assertNotEQ ( this.dlg.items_.tablist.getTabText(1), 'a2' );
		
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{id:1,sales:[{name:'a3',list:[{id:10001},{id:10002}]},{id:2,name:'a4',list:[{id:10003},{id:10004,itemnumsec:2,itemnum:100}]}]}});
		assertEQ ( this.dlg.items_.tablist.getTabText(0), 'a3' );
		assertEQ ( this.dlg.items_.tablist.getTabText(1), 'a4' );
		
		var items0 = this.dlg.items_.tablist.getTabItems(0);
		var item0 = items0.list.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), '10001.gif'), true );
		assertEQ ( IMG.getBKImage(item0.exsubs.flag), "url('')"  );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), ItemNameColorGetter.getColorVal(1, 'item10001') );
		assertEQ ( TQ.getTextEx(item0.exsubs.price), rstr.shop.buyitem.paynames[0] + ' 10' );
		assertEQ ( item0.exsubs.buybtn.getId(), 10001 );
			
		var item1 = items0.list.getItem(1);
		assertEQ ( TQ.getTextEx(item1.exsubs.price), rstr.shop.buyitem.paynames[1] + '/' + rstr.shop.buyitem.paynames[2] + ' 20' );
		assertEQ ( item1.exsubs.buybtn.getId(), 10002 );
			
		var items1 = this.dlg.items_.tablist.getTabItems(1);
		var item0 = items1.list.getItem(0);			
		assertEQ ( TQ.getTextEx(item0.exsubs.name), ItemNameColorGetter.getColorVal(1, 'item10003') );
		assertEQ ( item0.exsubs.buybtn.getId(), 10003 );
		assertEQ ( TQ.getTextEx(item0.exsubs.price), rstr.shop.buyitem.paynames[1] + ' 20' );
		
		var item1 = items1.list.getItem(1);			
		assertEQ ( TQ.getTextEx(item1.exsubs.name), ItemNameColorGetter.getColorVal(1, 'item10004') );
		assertEQ ( item1.exsubs.buybtn.getId(), 10004 );
		assertEQ ( TQ.getTextEx(item1.exsubs.price), rstr.shop.buyitem.paynames[3] + ' 30' );
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.flag), IMG.getBuyLimitFlag()), true );
	};
	
	this.test_clickBuyBtn = function(){
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:[{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}]}});
		var items0 = this.dlg.items_.tablist.getTabItems(0);
		var item0 = items0.list.getItem(0);
		item0.exsubs.buybtn.click();
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:10001, fixed:1, number:100000}] );
	};
	
	this.test_itemTip = function(){
		var itemres = ItemResUtil.findItemres(10002);
		itemres.effects = [{id:201,pro:100,min:2,max:3}];
		
		this.mm.mock(TIPM, 'getItemDesc', ['tip']);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:[{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}]}});
		var items0 = this.dlg.items_.tablist.getTabItems(0);
		var item0 = items0.list.getItem(0);
			
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), 'tip' );
		var itemres = ItemResUtil.findItemres(10001);
		
		assertEQ ( this.mm.params['getItemDesc'], [SysItemMaker.make(0,itemres,{itemnumsec:0, itemnum:0}), 'sys'] );
		
		var item1 = items0.list.getItem(1);
		var tip = TTIP.getTipById(item1.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), 'tip' );
		var itemres = ItemResUtil.findItemres(10002);
		assertEQ ( this.mm.params['getItemDesc'], [SysItemMaker.make(0,itemres,{itemnumsec:0, itemnum:0}), 'sys'] );
	};
	
	this.test_clickRechargeBtn = function(){
		this.mm.mock(JMISC, 'openPayWnd');
		this.dlg.items_.rechargeBtn.click();
		assertEQ ( this.mm.walkLog, 'openPayWnd' );
	};
	
	this.test_clickOpenPkgBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.items_.openPkgBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['package'] );
	};
	
	this.test_hotListShow = function(){
		res_shophot_tags = [{id:1, name:'tag1', ids:[1000]}];
		this.dlg.HOTLIST_MAX_COUNT_ = 2;
		this.dlg.openDlg();
		assertEQ (this.dlg.items_.hotList.getCount(), 1 );
			
		res_shophot_tags = [{id:1, name:'tag1', ids:[1000]},{id:2, name:'tag2', ids:[1001,1002]},{id:3, name:'tag3', ids:[1003]}];
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.hotList.getCount(), 2 );
		assertEQ ( this.dlg.items_.hotList.getItem(0).exsubs.tagBtn.getText(), 'tag1');
		assertEQ ( this.dlg.items_.hotList.getItem(1).exsubs.tagBtn.getText(), 'tag2');
	};
	
	this.test_hotListClickItem = function(){
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg:openBuyItemDlg');
		this.mm.mock(UIM.getDlg('buyitemlist'), 'openDlg:openBuyItemListDlg');
		res_shophot_tags = [{id:1, name:'tag1', ids:[1000,0]},{id:2, name:'tag2', ids:[1001,1002,0]}];
		this.dlg.openDlg();
		this.dlg.items_.hotList.getItem(0).exsubs.tagBtn.click();
		assertEQ ( this.mm.walkLog, 'openBuyItemDlg' );
		assertEQ ( this.mm.params['openBuyItemDlg'], [{id:0, resid:1000, number:100000}] );
		
		this.mm.clear();
		this.dlg.items_.hotList.getItem(1).exsubs.tagBtn.click();
		assertEQ ( this.mm.walkLog, 'openBuyItemListDlg' );
		assertEQ ( this.mm.params['openBuyItemListDlg'], [ [1001,1002] ] );
	};
	
	this.test_findItemInputLengthLimit = function(){
		this.mm.mock(TQ, 'maxLength');
		this.dlg._afterCreate();
		assertEQ ( this.mm.params['maxLength'], [this.dlg.items_.findItemInput, 16] );
	};
	
	this.test_findItemBtnClick = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips' );
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:[{id:1,name:'a1',list:[{id:10001},{id:10002}]},{id:2,name:'a2',list:[{id:10003},{id:10004}]}]}});
		this.dlg.items_.findItemInput.value = 'xxx';
		this.dlg.items_.findItemBtn.click();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.shop.shopdlg.tip.noFind] );
			
		this.mm.clear();
		this.dlg.items_.findItemInput.value = 'item10001';
		this.dlg.items_.findItemBtn.click();
		assertEQ ( this.mm.walkLog, 'openDlg' );
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:10001, number:100000}] );
		
		this.mm.clear();
		this.dlg.items_.findItemInput.value = 'item10004';
		this.dlg.items_.findItemBtn.click();
		assertEQ ( this.mm.walkLog, 'openDlg' );
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:10004, number:100000}] );
	};
	
	this.test_guangGao = function(){
		g_platform = 'qzone';
		this.dlg.openDlg({id:0, resid:11, number:10000});
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().guanggao), 'shopdlg/yd.gif' ), true );
		
		g_platform = '3366';
		this.dlg.openDlg({id:0, resid:11, number:10000});
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().guanggao), 'shopdlg/bd.gif' ), true );
		
		g_platform = 'xxxx';
		this.dlg.openDlg({id:0, resid:11, number:10000});
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().guanggao), 'shopdlg/ot.gif' ), true );
	};	
	
	this.test_clickCdkeyBtn = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips' );
		this.mm.mock(CDKeySender, 'send' );
		assertEQ ( UIM.getDlg('inputtext').isShow(), false );
		this.dlg.items_.cdkeyBtn.click();
		assertEQ ( UIM.getDlg('inputtext').isShow(), true );
		
		UIM.getDlg('inputtext').setText('111111');
		UIM.getDlg('inputtext').clickOk();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.shop.shopdlg.tip.validcdkey] );
		
		this.mm.clear()
		UIM.getDlg('inputtext').setText('0123456789012345678X');
		UIM.getDlg('inputtext').clickOk();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.shop.shopdlg.tip.validcdkey] );
		
		this.mm.clear()
		UIM.getDlg('inputtext').setText('151527FC6FE6516C2BDC');
		UIM.getDlg('inputtext').clickOk();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.shop.shopdlg.tip.validcdkey] );
		
		this.mm.clear()
		UIM.getDlg('inputtext').setText('151527FC6FE6516C2BDB');
		UIM.getDlg('inputtext').clickOk();
		assertEQ ( this.mm.walkLog, 'send' );
		assertEQ ( this.mm.params['send'], [this.g, '151527FC6FE6516C2BDB'] );
	};
});


tqShopHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseBuyItemDlg, 'TestCaseBuyItemDlg');
	suite.addTestCase(TestCaseShopDlg, 'TestCaseShopDlg');
};
