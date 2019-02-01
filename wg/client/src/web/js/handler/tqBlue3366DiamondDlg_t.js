/*******************************************************************************/
require('./tqBlue3366DiamondDlg.js')

TestCaseBlue3366DiamondDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.rolepanel = RoleBasePanel.snew(this.g, MockDomEx.snew('div'));
		this.dlg = Blue3366DiamondDlg.snew(this.g);
		this.dlg.openDlg();	
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, pos:{x:"center", y:40}, uiback:uiback.dlg.noborder, uicfg:uicfg.blue3366DiamondDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};	
	
	this.test_closeBtn = function(){
		assertEQ ( this.dlg.isShow(), true );
		this.dlg.getItems().closeBtn.click();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test_updateList = function(){
		assertEQ ( this.dlg.items_.everydayList.getCount(), res_3366_lvlgifts.length );
		var res0 = res_3366_lvlgifts[0];
		var items0 = DropItemUtil.getDropItems(res0.dropid);
		var item0 = this.dlg.items_.everydayList.getItem(0);
		var item1 = this.dlg.items_.everydayList.getItem(1);
		var item2 = this.dlg.items_.everydayList.getItem(2);
		var item3 = this.dlg.items_.everydayList.getItem(3);
		var item4 = this.dlg.items_.everydayList.getItem(4);
		var item5 = this.dlg.items_.everydayList.getItem(5);
		var item6 = this.dlg.items_.everydayList.getItem(6);
		
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 'LV1-LV5' );
		assertEQ ( TQ.getTextEx(item1.exsubs.level), 'LV6-LV10' );
		assertEQ ( TQ.getTextEx(item2.exsubs.level), 'LV11-LV15' );
		assertEQ ( TQ.getTextEx(item3.exsubs.level), 'LV16-LV20' );
		assertEQ ( TQ.getTextEx(item4.exsubs.level), 'LV21-LV25' );
		assertEQ ( TQ.getTextEx(item5.exsubs.level), 'LV26-LV30' );
		assertEQ ( TQ.getTextEx(item6.exsubs.level), 'LV31以上' );
		
		var itemRes0 = ItemResUtil.findItemres(items0[0].id);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon1), IMG.makeSmallImg(itemRes0.smallpic)), true );
		assertEQ ( TQ.getTextEx(item0.exsubs.number1), '×' + items0[0].number );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item1']);
		items0[0].resid = items0[0].id;
		items0[0].itemres = ItemResUtil.findItemres(items0[0].resid);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(items0[0]));
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item3']);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  '' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.curLevel), TQ.format(rstr.blue3366DiamondDlg.curLevel, 0) );
		
		this.g.getImgr().getRoleRes().bdInfo._3366_grow_level = 1;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( TQ.getTextEx(this.dlg.items_.curLevel), TQ.format(rstr.blue3366DiamondDlg.curLevel, 1) );
		
		this.g.getImgr().getRoleRes().bdInfo._3366_grow_level = 2;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( TQ.getTextEx(this.dlg.items_.curLevel), TQ.format(rstr.blue3366DiamondDlg.curLevel, 1) );
	};
	
	this.test_clickGotoBtn = function(){
		this.mm.mock(JMISC, 'open3366');
		this.dlg.getItems().gotoBtn.click();
		assertEQ ( this.mm.walkLog, 'open3366' );
	};
	
	this.test_setGetBtnState = function(){
		this.g.setSvrTimeS(10000000);
		this.g.getImgr().getRoleRes().bdInfo = {};
		this.dlg._initInfo();
		assertEQ ( this.dlg.getItems().getBtn.isEnable(), true );
			
		this.g.getImgr().getRoleRes().bdInfo = {};
		this.g.getImgr().getRoleRes().bdInfo._3366_grow_level = 1;
		this.g.getImgr().getRoleRes().bdInfo.got_3366gift = this.g.getSvrTimeS();
		this.dlg._initInfo();
		assertEQ ( this.dlg.getItems().getBtn.isEnable(), false );
			
		this.g.setSvrTimeS(10000000 + 24*3600);
		this.dlg._initInfo();
		assertEQ ( this.dlg.getItems().getBtn.isEnable(), true );
	};
	
	this.test_getEveryDayGift = function(){
		this.g.getImgr().getRoleRes().bdInfo = {};
		this.dlg.getItems().getBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.blue3366DiamondDlg.goto3366Tip );
			
		this.mm.clear();
		this.mm.mock(BlueDiamondSender, 'sendGet3366EveryDayGift');
		this.g.getImgr().getRoleRes().bdInfo._3366_grow_level = 1;
		this.dlg.getItems().getBtn.click();
		assertEQ ( this.mm.params['sendGet3366EveryDayGift'], [this.g] );
			
		this.mm.clear();
		this.g.getImgr().getRoleRes().bdInfo.got_3366gift = this.g.getSvrTimeS();
		this.dlg.getItems().getBtn.click();
		assertEQ ( this.mm.walkLog, '' );
	};		
});

tqBlue3366DiamondDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseBlue3366DiamondDlg, 'TestCaseBlue3366DiamondDlg');
};
