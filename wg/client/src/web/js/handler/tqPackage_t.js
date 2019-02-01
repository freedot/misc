//require('./tqPackage.js');
//require('./tqCC.js');
require('./tqShopHandler.js');

requireEx('./handler/tqPackage.js', [
	{
		start:'//PackageDlg-unittest-start'
		,end:'//PackageDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_opmenu'
			,'m_classitemObj'
			,'_onSelectListItem'
			,'_setOpMenuItemsEnableState'
			,'_getCurSel'
			,'_onSvrPkg'
			,'_onPkgItems'
			,'_onPkgMisc'
			,'_onPkgSalveMax'
			,'_updateGoldNumber'
			,'_updateGridnumber'
			,'_updateItemList'
			,'_initNetItemsResId'
			]
	}
	,{
		start:'//DirectUseItemHdrMgr-unittest-start'
		,end:'//DirectUseItemHdrMgr-unittest-end'
		,items:['m_specUseItemHdrs'
			]
	}
	,{
		start:'//DirectSetPosMoveCityUseItemHdr-unittest-start'
		,end:'//DirectSetPosMoveCityUseItemHdr-unittest-end'
		,items:['_onCoodCallback'
			]
	}	
]);


TestCasePackage = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		JMISC.initOneTime(this.g);
		UIM.regDlg('shop', ShopDlg.snew(this.g));
		UIM.regDlg('midwait', new WaitmidDlg(this.g));	
		UIM.regDlg('buyitemlist', new BuyItemListDlg(this.g));	
		this.dlg = PackageDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
		
	this.testOpenDlg = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		assert(dlg.getCore().isShow());
		assert(dlg.getCore().getPosition().x != -1 ||  dlg.getCore().getPosition().y != -1 );
	};
	
	this.testPkgDataHandle = function(){
		var dlg = PackageDlg.snew(g_app);
		g_app.clearSendMsg();
		g_app.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		var rtsendmsg = '{cmd='+NETCMD.PKG+',subcmd=0}';
		assert(g_app.getSendMsg() == rtsendmsg, 'when login ok, get pkg info from server');
		
		var imgr = g_app.getImgr();
		assert(imgr.getGold()==0);
		assert(imgr.getGiftGold()==0);
		assert(imgr.getMaxGrids()==0);
		
		var cmd = {pkg:{misc:{gold:10,giftgold:20,maxgrids:100}}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert(imgr.getGold()==10);
		assert(imgr.getGiftGold()==20);
		assert(imgr.getMaxGrids()==100);
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500001,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert(imgr.getItemNumByResId(2500001)==5);
		assert(imgr.getItemNumByResId(2500002)==4);
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:3,resid:2500002,number:2}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert(imgr.getItemNumByResId(2500002)==2, 'sub one item number');
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:3,_d:1}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert(imgr.getItemNumByResId(2500002)==0, 'delete one item');	
	};
	
	this.test__onSvrPkg = function(self) {
		this.mm.mock(this.lc(), '_onPkgItems' );
		this.mm.mock(this.lc(), '_onPkgMisc' );
		this.mm.mock(this.lc(), '_onPkgSalveMax' );
		this.mm.mock(this.lc(), '_updateGoldNumber' );
		this.mm.mock(this.lc(), '_updateGridnumber' );
		this.mm.mock(this.lc(), '_updateItemList' );
		
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '' );
		
		cmd = {data:{pkg:{items:[1,2], misc:{money:3}, salveMax:10}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '_onPkgItems,_onPkgMisc,_onPkgSalveMax,_updateGoldNumber,_updateGridnumber,_updateItemList' );
		assertEQ ( this.mm.params['_onPkgItems'], [ [1,2] ] );
		assertEQ ( this.mm.params['_onPkgMisc'], [ {money:3} ] );
		assertEQ ( this.mm.params['_onPkgSalveMax'], [ 10 ] );
	};
	
	this.test__onPkgItems = function(){
		this.mm.mock(this.lc(), '_initNetItemsResId');
		this.mm.mock(TQ, 'dictCopy');
		this.mm.mock(this.lc().m_classitemObj, 'refresh');
		this.mm.mock(ItemResUtil, 'initItemsres');
		this.mm.mock(this.g, 'sendEvent');
		
		
		var netItems = null;
		this.lc()._onPkgItems(netItems);
		assertEQ ( this.mm.walkLog, '' );
		
		netItems = [1,2];
		this.lc()._onPkgItems(netItems);
		assertEQ ( this.mm.walkLog, '_initNetItemsResId,dictCopy,refresh,initItemsres,sendEvent' );
		assertEQ ( this.mm.params['_initNetItemsResId'], [netItems ] );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getPkgs().items, netItems ] );
		assertEQ ( this.mm.params['initItemsres'], [this.g.getImgr().getPkgs().items ] );
		assertEQ ( this.mm.params['sendEvent'], [{eid: EVT.PKG_CHANGE, sid: 0} ] );
	};
	
	this.test__onPkgMisc = function(){
		this.mm.mock(TQ, 'dictCopy');
		this.mm.mock(this.g, 'sendEvent');
		
		var netMisc = null;
		this.lc()._onPkgMisc(netMisc);
		assertEQ ( this.mm.walkLog, '' );
		
		netMisc = {money:10};
		this.lc()._onPkgMisc(netMisc);
		assertEQ ( this.mm.walkLog, 'dictCopy,sendEvent' );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getPkgs().misc, netMisc ] );
		assertEQ ( this.mm.params['sendEvent'], [{eid: EVT.PKG_CHANGE, sid: 1} ] );
	};
	
	this.test__onPkgSalveMax = function(){
		this.mm.mock(this.g, 'sendEvent');
		var netSalveMax = 0;
		this.lc()._onPkgSalveMax(netSalveMax);
		assertEQ ( this.mm.walkLog, '' );
		
		netSalveMax = 10;
		this.lc()._onPkgSalveMax(netSalveMax);
		assertEQ ( this.g.getImgr().getSalveInfo().max, netSalveMax );
		assertEQ ( this.mm.params['sendEvent'], [{eid: EVT.PKG_CHANGE, sid: 2} ] );
	};
	
	this.testPkgTabCtrl = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		assert(dlg.getCore().isShow());
		
		assert(dlg.getCtrl('tab').getActiveTab() == 1, 'default select first tab page'); 
		assert(dlg.getCtrl('tab').getTabCount() == rstr.pkgdlg.tabs.length);
		assert((PackageClassifyItems.snew(this.g)).getCount() == rstr.pkgdlg.tabs.length);
		assert(dlg.getCtrl('tab').getTabBtn(0).getText() == rstr.pkgdlg.tabs[0]);
		
		dlg.getCtrl('tab').activeTab(2);
		assert(dlg.getCtrl('tab').getActiveTab() == 2);
	};
	
	this.testGoldCtrlNumber = function(){
		var dlg = PackageDlg.snew(g_app);
		var cmd = {pkg:{misc:{gold:10,giftgold:20,maxgrids:100}}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		dlg.openDlg();
		assert( (TQ.getTextEx(dlg.getCtrl('gold')) == '10') 
			&& (TQ.getTextEx(dlg.getCtrl('giftgold')) == '20')
			, 'before open dlg, handle the gold lbl show' );
			
		var cmd = {pkg:{misc:{gold:1,giftgold:2,maxgrids:10}}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert( (TQ.getTextEx(dlg.getCtrl('gold')) == '1') 
			&& (TQ.getTextEx(dlg.getCtrl('giftgold')) == '2')
			, 'after open dlg, handle the gold lbl show' );		
	};
	
	this.testGridNumberCtrlNumber = function(){
		var dlg = PackageDlg.snew(g_app);
		var cmd = {pkg:{misc:{gold:10,giftgold:20,maxgrids:100}}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		dlg.openDlg();
		assert(TQ.getTextEx(dlg.getCtrl('gridnum')) == '0/100');
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500001,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		assert(TQ.getTextEx(dlg.getCtrl('gridnum')) == '3/100');
	};
	
	this.testOpBtn = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		assert(dlg.getCtrl('paybtn').isShow());
		assert(dlg.getCtrl('shopbtn').isShow());
		assert(dlg.getCtrl('exchangebtn').isShow());

		dlg.getCtrl('paybtn').click();
		dlg.getCtrl('shopbtn').click();
		assert(UIM.getDlg('shop').isShow());
		assert(!UIM.getDlg('exchange').isShow());
		dlg.getCtrl('exchangebtn').click();
		assert(UIM.getDlg('exchange').isShow());
	};
	
	this.testListCtrlData = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500001,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		dlg.getCtrl('tab').activeTab(0);
		var items = dlg.getCtrl('tab').getTabItems(0);
		assert(items.list.getCount() == 3);
		
		cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500003,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		items = dlg.getCtrl('tab').getTabItems(0);
		assert(items.list.getCount() == 3);
		assertEQ( isInclude( IMG.getBKImage(items.list.getItem(0).exsubs.icon), '2500001'), true );
		assertEQ( isInclude( IMG.getBKImage(items.list.getItem(1).exsubs.icon), '2500002'), true );
		assertEQ( isInclude( IMG.getBKImage(items.list.getItem(2).exsubs.icon), '2500003'), true );
		
		dlg.getCtrl('tab').activeTab(2);
		items = dlg.getCtrl('tab').getTabItems(2);
		assert(items.list.getCount() == 3);
	};
	
	this.testMenuOp = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		assert(!dlg.getOpMenu().isShow());
		
		this.mm.mock(dlg.lc(), '_getCurSel', [{itemres:{canUse:1,canUses:1,canDrop:1,targets:[1]}}] );
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500001,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		dlg.getCtrl('tab').activeTab(1);
		var items = dlg.getCtrl('tab').getTabItems(1);
		items.list.clickItem(MockMouseEvent.snew(0,0),0);
		assert(dlg.getOpMenu().isShow());
		
		dlg.getOpMenu().click(0); // use item
		assert(!dlg.getOpMenu().isShow());
	};
	
	this.test_menuOpSendChat = function(){
		var dlg = PackageDlg.snew(g_app);
		dlg.openDlg();
		
		this.mm.mock(UIM.getPanel('chat'), 'sendMessageToCurChannel');
		
		var cmd = {cmd:NETCMD.PKG,pkg:{items:[{id:1,resid:2500001,number:2},{id:2,resid:2500001,number:3},{id:3,resid:2500002,number:4}]}};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.PKG, data:cmd});
		dlg.getCtrl('tab').activeTab(0);
		var items = dlg.getCtrl('tab').getTabItems(0);
		items.list.setCurSel(0);
		assertEQ ( dlg.getOpMenu().getCount(), 4 );
		
		this.g.getImgr().getRoleRes().uid = 20000;
		dlg.getOpMenu().click(3); // send item info to current chat
		assertEQ ( this.mm.params['sendMessageToCurChannel'], ['#[i:2500001:1:20000]'] );
		assertEQ (dlg.getOpMenu().isShow(), false);
	};
	
	this.test__onSelectListItem = function(){
		this.mm.mock(this.lc(), '_setOpMenuItemsEnableState' );
		this.lc()._onSelectListItem({}, 0);
		assert ( this.mm.walkLog == '_setOpMenuItemsEnableState' );
	};
	
	this.test__setOpMenuItemsEnableState = function(){
		var g_item = {itemres:{canUse:1,canUses:1,canDrop:1}};
		this.mm.mock(this.lc(), '_getCurSel',  [g_item] );
		
		this.lc()._setOpMenuItemsEnableState();
		assert ( this.lc().m_opmenu.isEnable(0) == true );
		assert ( this.lc().m_opmenu.isEnable(1) == true );
		assert ( this.lc().m_opmenu.isEnable(2) == true );
		
		g_item.itemres = {canUse:0,canUses:0,canDrop:0};
		this.lc()._setOpMenuItemsEnableState();
		assert ( this.lc().m_opmenu.isEnable(0) == false );
		assert ( this.lc().m_opmenu.isEnable(1) == false );
		assert ( this.lc().m_opmenu.isEnable(2) == false );
	};
	
	this.test__initNetItemsResId = function(){
		this.g.getImgr().getPkgs().items = [{id:1, resid:1001}];
		
		var netItems = [{id:1}, {id:2, resid:1002}];
		this.lc()._initNetItemsResId(netItems);
		assertEQ ( netItems, [{id:1, resid:1001},{id:2, resid:1002}] );
	};
});

TestCaseItemsOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = ItemsOpHdr.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_useItem = function(){
		this.mm.mock(UseItemSender, 'send');
		this.hdr.useItem({id:1,resid:2,itemres:{targets:[3]}});
		assert ( this.mm.walkLog == 'send' );
		assert ( this.mm.params['send'][0] == this.g );
		assert ( this.mm.params['send'][1].id == 1 );
		assert ( this.mm.params['send'][2] == 1 )
		assert ( this.mm.params['send'][3].type == 3 );
	};
	
	this.test_useItems = function(){
		UIM.regDlg('inputnum', new InputNumDlg(this.g));
		
		this.mm.mock( this.hdr, 'useItem', [true] );
		this.mm.mock( UseItemSender, 'send');
		
		this.g.getImgr().addItem({id:1,resid:2,number:1});
		assert ( this.hdr.useItems({id:1,resid:2,itemres:{targets:[3]}}) == true );
		
		this.mm.clear();
		this.g.getImgr().addItem({id:1,resid:2,number:9});
		assert ( this.hdr.useItems({id:1,resid:2,itemres:{targets:[3]}}) == true );
		assert ( UIM.getDlg('inputnum').isShow() == true );
		UIM.getDlg('inputnum').click();
		
		assert ( this.mm.walkLog == 'send' );
		assert ( this.mm.params['send'][0] == this.g );
		assert ( this.mm.params['send'][1].id == 1 );
		assert ( this.mm.params['send'][2] == 10 );
		assert ( this.mm.params['send'][3].type == 3 );
		
		this.mm.clear();
		this.g.getImgr().addItem({id:1,resid:2,number:res_max_canuseitem_number});
		assert ( this.hdr.useItems({id:1,resid:2,itemres:{targets:[3]}}) == true );
		UIM.getDlg('inputnum').click();
		assert ( this.mm.params['send'][2] == res_max_canuseitem_number );
	};
	
	this.test_dropItem = function(){
		var g_item = {id:1,resid:2,number:1};
		
		this.mm.mock( ItemOpSender, 'sendDropItem' );
		
		this.hdr.dropItem(g_item);
		assert( this.g.getGUI().isShowMsgBox() == true );
		assert( this.g.getGUI().getMsgBoxMsg() == rstr.pkgdlg.lbl.dropitem );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assert ( this.mm.walkLog == '' );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assert ( this.mm.walkLog == 'sendDropItem' );
		assertListEQ( this.mm.params['sendDropItem'], [this.g, g_item] );
	};
});

TestCaseDirectUseItemHdrMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getHdr = function(){
		var r_isSpec = [false];
		this.mm.mock(DirectUseItemHdrMgr, 'isSpec', r_isSpec);
		assertEQ ( DirectUseItemHdrMgr.getHdr({effects:[]}) instanceof DirectCommUseItemHdr, true);
		assertEQ ( this.mm.params['isSpec'], [{effects:[]}] );
		
		r_isSpec[0] = true;
		assertEQ ( DirectUseItemHdrMgr.getHdr({effects:[{id:RES_EFF.SEND_WORLD_BLESS}]}), DirectUseItemHdrMgr.lc().m_specUseItemHdrs[RES_EFF.SEND_WORLD_BLESS]);
		assertEQ ( DirectUseItemHdrMgr.getHdr({effects:[{id:RES_EFF.SETPOS_MOVECITY}]}), DirectUseItemHdrMgr.lc().m_specUseItemHdrs[RES_EFF.SETPOS_MOVECITY]);
	};
	
	this.test_isSpec = function(){
		assertEQ ( DirectUseItemHdrMgr.isSpec(), false);
		assertEQ ( DirectUseItemHdrMgr.isSpec({}), false);
		assertEQ ( DirectUseItemHdrMgr.isSpec({effects:[]}), false);
		assertEQ ( DirectUseItemHdrMgr.isSpec({effects:[{id:1},{id:2}]}), false);
		assertEQ ( DirectUseItemHdrMgr.isSpec({effects:[{id:1}]}), false);
		assertEQ ( DirectUseItemHdrMgr.isSpec({effects:[{id:RES_EFF.SEND_WORLD_BLESS}]}), true);
		assertEQ ( DirectUseItemHdrMgr.isSpec({effects:[{id:RES_EFF.SETPOS_MOVECITY}]}), true);
	};
});

TestCaseDirectSendWorldBlessUseItemHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = DirectSendWorldBlessUseItemHdr.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_useItem = function(){
		var g_item = {itemres:{targets:[1],effects:[{val:10}]}};
		UIM.regDlg('inputtext', new InputTextDlg(this.g));
		this.mm.mock( UseItemSender, 'send');
		this.hdr.useItem(this.g, g_item);
		assert ( UIM.getDlg('inputtext').isShow() == true );
		assert ( this.mm.walkLog == '' );
		
		UIM.getDlg('inputtext').setText('msg"');
		UIM.getDlg('inputtext').clickOk();
		assert ( this.mm.walkLog == 'send' );
		assert ( this.mm.params['send'][0] == this.g );
		assert ( this.mm.params['send'][1] == g_item );
		assert ( this.mm.params['send'][2] == 1 );
		assert ( this.mm.params['send'][3].type == 1 );
		assert ( this.mm.params['send'][3].msg == TQ.encodeMessage('msg"') );
		
		this.mm.clear();
		this.mm.mock(UIM.getDlg('inputtext'), 'openDlg');
		this.hdr.useItem(this.g, g_item);
		assertListEQ ( this.mm.params['openDlg'], [rstr.pkgdlg.lbl.inputbless, 40] );
	};
});

TestCaseDirectSetPosMoveCityUseItemHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = DirectSetPosMoveCityUseItemHdr.snew();
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_useItem = function(){
		this.g.getImgr().getRoleRes().pos = {x:1, y:200};
		
		this.mm.mock(UIM.getDlg('inputcood'), 'setCaller');
		this.mm.mock(UIM.getDlg('inputcood'), 'openDlg');
		
		var g_item = {itemres:{targets:[1]}};
		this.hdr.useItem(this.g, g_item);
		assertEQ ( this.mm.params['setCaller'], [{self:this.hdr, caller:this.lc()._onCoodCallback}] );
		var lbl = TQ.format(rstr.pkgdlg.lbl.inputcood, 1, 200, 200,399, 200, 399);
		var tip = TQ.format(rstr.pkgdlg.lbl.coodoutrange, 200,399, 200, 399);
		assertEQ ( this.mm.params['openDlg'], [lbl, {min:200, max:399}, {min:200, max:399}, tip] );
	};
	
	this.test_useItem__onCoodCallback = function(){
		var g_item = {itemres:{targets:[1]}};
		this.hdr.useItem(this.g, g_item);
		
		this.mm.mock(UseItemSender, 'send');
		this.mm.mock(OutFieldSender, 'sendRefreshFieldsByLastViewPos');
		this.lc()._onCoodCallback(1,2); // x,y
		assertEQ ( this.mm.walkLog, 'send,sendRefreshFieldsByLastViewPos' );
		assertEQ ( this.mm.params['send'], [this.g, g_item, 1, {type:g_item.itemres.targets[0], posX:1, posY:2}] );
		assertEQ ( this.mm.params['sendRefreshFieldsByLastViewPos'], [this.g] );
	};
});

tqPackage_t_main = function(suite) {
	suite.addTestCase(TestCasePackage, 'TestCasePackage');
	suite.addTestCase(TestCaseItemsOpHdr, 'TestCaseItemsOpHdr');
	suite.addTestCase(TestCaseDirectUseItemHdrMgr, 'TestCaseDirectUseItemHdrMgr');
	suite.addTestCase(TestCaseDirectSendWorldBlessUseItemHdr, 'TestCaseDirectSendWorldBlessUseItemHdr');
	suite.addTestCase(TestCaseDirectSetPosMoveCityUseItemHdr, 'TestCaseDirectSetPosMoveCityUseItemHdr');
};
