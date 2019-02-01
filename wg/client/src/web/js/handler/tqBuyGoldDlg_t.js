/*******************************************************************************/
require('./tqBuyGoldDlg.js')

TestCaseBuyGoldDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = BuyGoldDlg.snew(this.g);
		this.dlg.openDlg();		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.buyGoldDlg.title, pos:{x:"center", y:70}, uicfg:uicfg.buyGoldDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_guangGao = function(){
		g_platform = 'qzone';
		this.dlg.openDlg();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().guanggao), 'buygold/yd.gif' ), true );
		
		g_platform = '3366';
		this.dlg.openDlg();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().guanggao), 'buygold/bd.gif' ), true );
	};
	
	this.test_clickFirstPayDetail = function(){
		this.g.getImgr().getTask().actives = [{id:1},{id:FIXID.FIRST_PAYGOLD},{id:3}];
		this.mm.mock(UIM.getDlg('task'), 'openDlg');
		this.mm.mock(UIM.getDlg('task'), 'selectTask');
		this.dlg.getItems().see.click();
		assertEQ ( this.mm.params['openDlg'], [] );
		assertEQ ( this.mm.params['selectTask'], ['activity', 1] );
	};
	
	this.test_goldItemsShow = function(){
		assertEQ ( this.dlg.getItems().list.getCount(), 4 );
		var item0 = this.dlg.getItems().list.getItem(0);
		var item1 = this.dlg.getItems().list.getItem(1);
		var item2 = this.dlg.getItems().list.getItem(2);
		var item3 = this.dlg.getItems().list.getItem(3);
		var res0 = ItemResUtil.findItemres(FIXID.GOLD_1);
		var res1 = ItemResUtil.findItemres(FIXID.GOLD_2);
		var res2 = ItemResUtil.findItemres(FIXID.GOLD_3);
		var res3 = ItemResUtil.findItemres(FIXID.GOLD_4);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), res0.bigpic + '.gif' ), true );
		assertEQ ( isInclude(TQ.getTextEx(item0.exsubs.name), res0.name), true );
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.icon), res1.bigpic + '.gif' ), true );
		assertEQ ( isInclude(TQ.getTextEx(item1.exsubs.name), res1.name), true );
		assertEQ ( isInclude(IMG.getBKImage(item2.exsubs.icon), res2.bigpic + '.gif' ), true );
		assertEQ ( isInclude(TQ.getTextEx(item2.exsubs.name), res2.name), true );
		assertEQ ( isInclude(IMG.getBKImage(item3.exsubs.icon), res3.bigpic + '.gif' ), true );
		assertEQ ( isInclude(TQ.getTextEx(item3.exsubs.name), res3.name), true );
	};
	
	this.test_clickBuyBtn = function(){
		var item0 = this.dlg.getItems().list.getItem(0);
		var item1 = this.dlg.getItems().list.getItem(1);
		var item2 = this.dlg.getItems().list.getItem(2);
		var item3 = this.dlg.getItems().list.getItem(3);
		
		this.mm.mock(ShopSender, 'sendBuyGold');
		item0.exsubs.buy.click();
		assertEQ ( this.mm.params['sendBuyGold'], [this.g, FIXID.GOLD_1, 1] );
		
		this.mm.clear();
		item1.exsubs.buy.click();
		assertEQ ( this.mm.params['sendBuyGold'], [this.g, FIXID.GOLD_2, 1] );
		
		this.mm.clear();
		item2.exsubs.buy.click();
		assertEQ ( this.mm.params['sendBuyGold'], [this.g, FIXID.GOLD_3, 1] );
		
		this.mm.clear();
		item3.exsubs.buy.click();
		assertEQ ( this.mm.params['sendBuyGold'], [this.g, FIXID.GOLD_4, 1] );
	};
	
	this.test_clickShop = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.getItems().shop.click();
		assertEQ ( this.mm.params['openDlg'], ['shop', 0] );
	};
});

tqBuyGoldDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseBuyGoldDlg, 'TestCaseBuyGoldDlg');
};
