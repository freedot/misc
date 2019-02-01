/*******************************************************************************/
require('./tqAlliMySellDlg.js')
TestCaseAlliMySellDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMySellDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems();
		this.pkgItems = [{id:1,resid:2500001,number:1},{id:2,resid:3000229,number:12},{id:3,resid:3000228,number:13},{id:4,resid:5000042,number:14},{id:5,resid:2500001,isBind:1,number:1},{id:6,resid:4000004,number:16}];
		this.alliDlg = AlliMainDlg.snew(this.g);
		this.cmd = {sellingItems:[{id:1,resid:2500001,number:1,doing:0,cur:100,fixed:1000,stopTime:1405218000+2*3600-1},{id:2,resid:3000228,number:2,doing:1,cur:200,fixed:2000,stopTime:1405218000+2*3600},{id:3,resid:4000004,number:3,doing:0,cur:300,fixed:3000,stopTime:1405218000-1}]};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.helper_setPkgItems = function(){
		this.g.getImgr().clearPkgItems();
		ItemResUtil.initItemsres(this.pkgItems);
		for ( var i=0; i<this.pkgItems.length; ++i ) {
			this.g.getImgr().addItem(this.pkgItems[i]);
		}
		
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.alli.myselldlg.title, pos:{x:"center", y:40}, uicfg:uicfg.alli.myselldlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_pkgTabsText = function(){
		assertEQ ( this.items.pkgTabs.getTabText(0), rstr.alli.myselldlg.tabs[0] );
		assertEQ ( this.items.pkgTabs.getTabText(1), rstr.alli.myselldlg.tabs[1] );
		assertEQ ( this.items.pkgTabs.getTabText(3), rstr.alli.myselldlg.tabs[3] );
	};
	
	this.test_selectFirstTabWhenOpenDlg = function(){
		assertEQ ( this.items.pkgTabs.getActiveTab(), 0 );
		this.items.pkgTabs.activeTab(1);
		this.dlg.openDlg();
		assertEQ ( this.items.pkgTabs.getActiveTab(), 0 );
	};
	
	this.test_pkgTabItemList = function(){
		this.helper_setPkgItems();
		this.dlg.openDlg();
		
		// all pkg items -- id:1, id:3, id:6
		var items0 = this.items.pkgTabs.getTabItems(0);
		assertEQ ( items0.list.getCount(), 3 );
		var item0 = items0.list.getItem(0);
		var item1 = items0.list.getItem(1);
		var item2 = items0.list.getItem(2);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeBigImg(this.pkgItems[0].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 1 );
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.icon), IMG.makeBigImg(this.pkgItems[2].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item1.exsubs.num), 13 );
		assertEQ ( isInclude(IMG.getBKImage(item2.exsubs.icon), IMG.makeBigImg(this.pkgItems[5].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item2.exsubs.num), 16 );
		
		// 1
		var items1 = this.items.pkgTabs.getTabItems(1);
		assertEQ ( items1.list.getCount(), 1 );
		item0 = items1.list.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeBigImg(this.pkgItems[0].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 1 );
		
		// 3
		var items2 = this.items.pkgTabs.getTabItems(2);
		assertEQ ( items2.list.getCount(), 1 );
		item0 = items2.list.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeBigImg(this.pkgItems[2].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 13 );
		
		// 6
		var items3 = this.items.pkgTabs.getTabItems(3);
		assertEQ ( items3.list.getCount(), 1 );
		item0 = items3.list.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeBigImg(this.pkgItems[5].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 16 );
		
		//onItemchange
		this.pkgItems[5].number = 20;
		this.helper_setPkgItems();
		this.g.sendEvent({eid: EVT.PKG_CHANGE, sid: 0});
		items3 = this.items.pkgTabs.getTabItems(3);
		assertEQ ( items3.list.getCount(), 1 );
		item0 = items3.list.getItem(0);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 20 );
	};
	
	this.test_pkgTabItemListTip = function(){
		this.helper_setPkgItems();
		this.dlg.openDlg();
		var items0 = this.items.pkgTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(this.pkgItems[0]));
	};
	
	this.test_clickPkgTabItemList = function(){
		this.helper_setPkgItems();
		this.dlg.openDlg();
		var items0 = this.items.pkgTabs.getTabItems(0);
		items0.list.clickItem(null, 1);
		
		assertEQ ( isInclude(IMG.getBKImage(this.items.icon), IMG.makeBigImg(this.pkgItems[2].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(this.items.num), 13 );
		assertEQ ( TQ.getTextEx(this.items.itemDesc), this.pkgItems[2].itemres.desc );
		assertEQ ( this.items.inumber.getVal(), 1 );
		
		this.items.inumber.setVal(14);
		assertEQ ( this.items.inumber.getVal(), 13);
		this.items.inumber.setVal(-1);
		assertEQ ( this.items.inumber.getVal(), 0);
		assertEQ ( this.items.iauctionPrice.getVal(), 0);
		assertEQ ( this.items.ifixedPrice.getVal(), 0);
		
		this.pkgItems[2].number = 20;
		this.helper_setPkgItems();
		this.g.sendEvent({eid: EVT.PKG_CHANGE, sid: 0});
		this.items.inumber.setVal(21);
		this.items.iauctionPrice.setVal(300);
		this.items.ifixedPrice.setVal(400);
		assertEQ ( this.items.inumber.getVal(), 20);
		
		items0.list.clickItem(null, 0);
		assertEQ ( this.items.iauctionPrice.getVal(), 0);
		assertEQ ( this.items.ifixedPrice.getVal(), 0);
		
		// item delete
		items0.list.clickItem(null, 1);
		this.pkgItems[2].id = 100;
		this.helper_setPkgItems();
		this.g.sendEvent({eid: EVT.PKG_CHANGE, sid: 0});
		this.items.inumber.setVal(21);
		assertEQ ( this.items.inumber.getVal(), 0);
		assertEQ ( IMG.getBKImage(this.items.icon), "url('')");
		assertEQ ( TQ.getTextEx(this.items.num), '' );
		assertEQ ( TQ.getTextEx(this.items.itemDesc), '' );
		assertEQ ( this.items.iauctionPrice.getVal(), 0);
		assertEQ ( this.items.ifixedPrice.getVal(), 0);
	};
	
	this.test_initCurSelItemInfoWhenOpenDlg = function(){
		this.helper_setPkgItems();
		this.dlg.openDlg();
		this.items.inumber.setVal(21);
		assertEQ ( this.items.inumber.getVal(), 0);
		assertEQ ( IMG.getBKImage(this.items.icon), "url('')");
		assertEQ ( TQ.getTextEx(this.items.num), '' );
		assertEQ ( TQ.getTextEx(this.items.itemDesc), '' );
	};
	
	this.test_sellBtn = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(AllianceSender, 'sendSellItem');
		this.helper_setPkgItems();
		this.dlg.openDlg();
		this.items.sellBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.myselldlg.tip.canNotSelectItemId] );

		var items0 = this.items.pkgTabs.getTabItems(0);
		items0.list.clickItem(null, 1);
		
		this.items.inumber.setVal(0);
		this.items.iauctionPrice.setVal(1000);
		this.items.ifixedPrice.setVal(2000);
		
		this.mm.clear();
		this.items.sellBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.myselldlg.tip.canNotInputNumber] );
		
		this.items.inumber.setVal(1);
		this.items.iauctionPrice.setVal(0);
		this.items.ifixedPrice.setVal(2000);
		
		this.mm.clear();
		this.items.sellBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.myselldlg.tip.notInputAuctionPrice] );
		
		this.items.inumber.setVal(1);
		this.items.iauctionPrice.setVal(2000);
		this.items.ifixedPrice.setVal(2000);
		
		this.mm.clear();
		this.items.sellBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.myselldlg.tip.notInputFixedPrice] );
		
		this.items.inumber.setVal(1);
		this.items.iauctionPrice.setVal(2000);
		this.items.ifixedPrice.setVal(3000);
		this.mm.clear();
		this.items.sellBtn.click();
		assertEQ ( this.mm.params['sendSellItem'], [this.g, 3, 1, 2000, 3000] );
	};
	
	this.test_sellingList = function(){
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		assertEQ ( this.items.sellingList.getCount(), 3 );
		var item0 = this.items.sellingList.getItem(0);
		var item1 = this.items.sellingList.getItem(1);
		var item2 = this.items.sellingList.getItem(2);
		var sellingItems = this.g.getImgr().getSellingItems();
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeBigImg(sellingItems[0].itemres.bigpic)), true);
		assertEQ ( isInclude(IMG.getBKImage(item2.exsubs.icon), IMG.makeBigImg(sellingItems[2].itemres.bigpic)), true);
		assertEQ ( TQ.getTextEx(item0.exsubs.num), 1);
		assertEQ ( TQ.getTextEx(item2.exsubs.num), 3);
		assertEQ ( TQ.getTextEx(item0.exsubs.curPrice), 100);
		assertEQ ( TQ.getTextEx(item2.exsubs.curPrice), 300);
		assertEQ ( TQ.getTextEx(item0.exsubs.fixedPrice), 1000);
		assertEQ ( TQ.getTextEx(item2.exsubs.fixedPrice), 3000);
		assertEQ ( TQ.getTextEx(item0.exsubs.state), rstr.alli.myselldlg.lbl.auctionStates[0]);
		assertEQ ( TQ.getTextEx(item1.exsubs.state), rstr.alli.myselldlg.lbl.auctionStates[1]);
		assertEQ ( TQ.getTextEx(item2.exsubs.state), rstr.alli.myselldlg.lbl.auctionStates[2]);
		
		assertEQ ( TQ.getTextEx(item0.exsubs.leftTime), rstr.alli.main.lbl.leftTimeNames[1]);
		assertEQ ( TQ.getTextEx(item1.exsubs.leftTime), rstr.alli.main.lbl.leftTimeNames[2]);
		assertEQ ( TQ.getTextEx(item2.exsubs.leftTime), rstr.alli.main.lbl.leftTimeNames[0]);
	};
	
	this.test_sellingListItemTip = function(){
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var item0 = this.items.sellingList.getItem(0);
		var ritem0 = this.g.getImgr().getSellingItems()[0];
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(ritem0, 'sys'));
	};
	
	this.test_sellingListItemCancelBtn = function(){
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var item0 = this.items.sellingList.getItem(0);
		var item1 = this.items.sellingList.getItem(1);
		var item2 = this.items.sellingList.getItem(2);
		assertEQ ( item0.exsubs.cancelBtn.isEnable(), true );
		assertEQ ( item1.exsubs.cancelBtn.isEnable(), false );
		assertEQ ( item2.exsubs.cancelBtn.isEnable(), false );
		
		this.mm.mock(AllianceSender, 'sendCancelSellItem');
		item0.exsubs.cancelBtn.click();
		assertEQ ( this.mm.params['sendCancelSellItem'], [this.g, 1] );
	};
	
	this.test_updateSellingListItemWhenOpenDlg = function(){
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var sellingItems = this.g.getImgr().getSellingItems();
		sellingItems[0].cur = 110;
		
		this.dlg.openDlg();
		var item0 = this.items.sellingList.getItem(0);
		assertEQ ( TQ.getTextEx(item0.exsubs.curPrice), 110);
	};
	
	this.test_sendGetSellItemMsgWhenOpenDlg = function(){
		this.mm.mock(AllianceSender, 'sendGetSellItems');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetSellItems'], [this.g] );
	};
});

tqAlliMySellDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAlliMySellDlg, 'TestCaseAlliMySellDlg');
};
