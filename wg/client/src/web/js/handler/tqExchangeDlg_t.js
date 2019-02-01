/*******************************************************************************/
require('./tqExchangeDlg.js')

TestCaseExchangeDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		res_exchanges = [{id:1, type:0, name:'name1', dropId:7000124, icon:3000124, tips:'tip1', materials:[{itemId:5000040, number:1}, {itemId:0, number:0}]}
			,{id:2, type:0, name:'name2', dropId:7000125, icon:3000125, tips:'tip2', materials:[{itemId:5000041, number:2},{itemId:5000039, number:3}]}
			,{id:3, type:1, name:'name3', dropId:7000126, icon:3000126, tips:'tip3', materials:[{itemId:5000040, number:4}]}
			,{id:4, type:1, name:'name4', dropId:7000127, icon:3000127, tips:'tip4', materials:[{itemId:5000040, number:4}]}
			,{id:5, type:1, name:'name5', dropId:7000128, icon:3000128, tips:'tip5', materials:[{itemId:5000040, number:4}]} ];
			
		this.dlg = ExchangeDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems()
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.exchangedlg.title, pos:{x:"center", y:40}, uicfg:uicfg.exchangedlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_setTabsName = function(){
		assertEQ ( this.items.tabList.getTabText(0), rstr.exchangedlg.tabs[0] );
		assertEQ ( this.items.tabList.getTabText(1), rstr.exchangedlg.tabs[1] );
	};
	
	this.test_selectFirstTab = function(){
		assertEQ ( this.items.tabList.getActiveTab(), 0 );
		var items = this.items.tabList.getTabItems(0);
		assertEQ ( items.allList.getCount(), 2 );
	};
	
	this.test_showAllList = function(){
		TestCaseCondition.setPreCond(null, {item:{id:5000041, num:2} });
		TestCaseCondition.setPreCond(null, {item:{id:5000039, num:4} });
		
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		assertEQ ( items.allList.getCount(), 2 );
		assertEQ ( TQ.getTextEx(items.allList.getItem(0).exsubs.name), 'name1' );
		assertEQ ( TQ.getCSS(items.allList.getItem(0).exsubs.canFlag, 'display'), 'none' );
		assertEQ ( TQ.getTextEx(items.allList.getItem(1).exsubs.name), 'name2' );
		assertEQ ( TQ.getCSS(items.allList.getItem(1).exsubs.canFlag, 'display'), 'block' );
		
		this.items.tabList.activeTab(1);
		items = this.items.tabList.getTabItems(1);
		assertEQ ( items.allList.getCount(), 3 );
		assertEQ ( TQ.getTextEx(items.allList.getItem(0).exsubs.name), 'name3' );
		assertEQ ( TQ.getTextEx(items.allList.getItem(1).exsubs.name), 'name4' );
		assertEQ ( TQ.getTextEx(items.allList.getItem(2).exsubs.name), 'name5' );
	};
	
	this.test_hasCanExChangeItem = function(){
		TestCaseCondition.setPreCond(null, {item:{id:5000041, num:2} });
		assertEQ ( this.dlg.hasCanExChangeItem(0), false );
		TestCaseCondition.setPreCond(null, {item:{id:5000039, num:4} });
		assertEQ ( this.dlg.hasCanExChangeItem(0), true );
		
		assertEQ ( this.dlg.hasCanExChangeItem(1), false );
		TestCaseCondition.setPreCond(null, {item:{id:5000040, num:4} });
		assertEQ ( this.dlg.hasCanExChangeItem(1), true );
	};
	
	this.test_selectFirstAllListItem = function(){
		var items = this.items.tabList.getTabItems(0);
		assertEQ ( items.allList.getCurSel(), 0 );
		this.items.tabList.activeTab(1);
		items = this.items.tabList.getTabItems(1);
		assertEQ ( items.allList.getCurSel(), 0 );
	};
	
	this.test_selectLastAllListItem = function(){
		var items = this.items.tabList.getTabItems(0);
		items.allList.setCurSel(1);
		this.items.tabList.activeTab(1);
		items = this.items.tabList.getTabItems(1);
		items.allList.setCurSel(2);
		
		this.items.tabList.activeTab(0);
		items = this.items.tabList.getTabItems(0);
		assertEQ ( items.allList.getCurSel(), 1 );
		
		this.items.tabList.activeTab(1);
		items = this.items.tabList.getTabItems(1);
		assertEQ ( items.allList.getCurSel(), 2 );
	};
	
	this.test_showSelectItem_targetTip = function(){
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		items.allList.setCurSel(0);
		var tip = TTIP.getTipById(items.tooltips['$target']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('tip1') );
	};
	
	this.test_showSelectItem_noEnoughMaterial = function(){
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		items.allList.setCurSel(0);
		assertEQ ( isInclude(IMG.getBKImage(items.target), '3000124.gif'), true );
		assertEQ ( items.needList.getCount(), 5 );
		assertEQ ( isInclude(IMG.getBKImage(items.needList.getItem(0).exsubs.icon), '5000040.gif'), true );
		assertEQ ( TQ.getTextEx(items.needList.getItem(0).exsubs.name), '鹤翼阵法残页' );
		assertEQ ( TQ.getTextEx(items.needList.getItem(0).exsubs.number), '(' + TQ.formatColorStr('0', COLORS.NO_ENOUGH_ITEM) + '/1)' );
		
		assertEQ ( IMG.getBKImage(items.needList.getItem(1).exsubs.icon), "url('')");
		assertEQ ( TQ.getTextEx(items.needList.getItem(1).exsubs.name), '' );
		assertEQ ( TQ.getTextEx(items.needList.getItem(1).exsubs.number), '' );
		assertEQ ( IMG.getBKImage(items.needList.getItem(4).exsubs.icon), "url('')");
		assertEQ ( TQ.getTextEx(items.needList.getItem(4).exsubs.name), '' );
		assertEQ ( TQ.getTextEx(items.needList.getItem(4).exsubs.number), '' );		
		
		assertEQ ( items.inum.getVal(), 0 );
		assertEQ ( items.exchangeBtn.isEnable(), false );
		
		assertEQ ( TQ.getCSS(items.inumPanel, 'display'), 'block' );
	};
	
	this.test_showSelectItem_hasEnoughMaterial = function(){
		TestCaseCondition.setPreCond(null, {item:{id:5000041, num:5} });
		TestCaseCondition.setPreCond(null, {item:{id:5000039, num:9} });
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		items.allList.setCurSel(1);
		
		assertEQ ( TQ.getTextEx(items.needList.getItem(0).exsubs.number), '(' + TQ.formatColorStr('5', COLORS.ENOUGH_ITEM) + '/' + TQ.formatColorStr('2', COLORS.ENOUGH_ITEM) + ')' );
		assertEQ ( TQ.getTextEx(items.needList.getItem(1).exsubs.number), '(' + TQ.formatColorStr('9', COLORS.ENOUGH_ITEM) + '/' + TQ.formatColorStr('3', COLORS.ENOUGH_ITEM) + ')' );
		assertEQ ( items.inum.getVal(), 2 );
		assertEQ ( items.exchangeBtn.isEnable(), true );
		
		items.inum.setVal(0);
		assertEQ ( items.inum.getVal(), 1 );
		items.inum.setVal(3);
		assertEQ ( items.inum.getVal(), 2 );
		
		assertEQ ( TQ.getCSS(items.inumPanel, 'display'), 'block' );
	};
	
	this.test_showSelectArm_noEnoughMaterial = function(){
		this.items.tabList.activeTab(1);
		var items = this.items.tabList.getTabItems(1);
		assertEQ ( TQ.getCSS(items.inumPanel, 'display'), 'none' );
		assertEQ ( items.inum.getVal(), 0 );
		assertEQ ( items.exchangeBtn.isEnable(), false );
	};
	
	this.test_showSelectArm_hasEnoughMaterial = function(){
		TestCaseCondition.setPreCond(null, {item:{id:5000040, num:10} });
		this.items.tabList.activeTab(1);
		var items = this.items.tabList.getTabItems(1);
		assertEQ ( TQ.getCSS(items.inumPanel, 'display'), 'none' );
		assertEQ ( items.inum.getVal(), 1 );
		assertEQ ( items.exchangeBtn.isEnable(), true );
	};
	
	this.test_clickExchangeBtn = function(){
		this.mm.mock(ExchangeSender, 'sendExchange');
		
		TestCaseCondition.setPreCond(null, {item:{id:5000041, num:5} });
		TestCaseCondition.setPreCond(null, {item:{id:5000039, num:9} });
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		items.allList.setCurSel(1);
		items.exchangeBtn.click();
		assertEQ ( this.mm.params['sendExchange'], [this.g, 7000125, 2] );
	};
	
	this.test_updateCurSelectPageWhenRecvItemChangeEvent = function(){
		var items = this.items.tabList.getTabItems(0);
		this.items.tabList.activeTab(0);
		items.allList.setCurSel(1);
		assertEQ ( items.inum.getVal(), 0 );
		assertEQ ( TQ.getCSS(items.allList.getItem(1).exsubs.canFlag, 'display'), 'none' );
		
		TestCaseCondition.setPreCond(null, {item:{id:5000041, num:5} });
		TestCaseCondition.setPreCond(null, {item:{id:5000039, num:9} });
		this.g.sendEvent({eid:EVT.PKG_CHANGE,sid:0});
		assertEQ ( items.inum.getVal(), 2 );
		assertEQ ( TQ.getCSS(items.allList.getItem(1).exsubs.canFlag, 'display'), 'block' );
	};
});

tqExchangeDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseExchangeDlg, 'TestCaseExchangeDlg');
};
