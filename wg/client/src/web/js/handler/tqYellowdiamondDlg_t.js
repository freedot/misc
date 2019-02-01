/*******************************************************************************/
require('./tqYellowdiamondDlg.js')

TestCaseYellowdiamondDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.setSvrTimeS(10000000);
		this.rolepanel = RoleBasePanel.snew(this.g, MockDomEx.snew('div'));
		this.dlg = YellowdiamondDlg.snew(this.g);
		this.dlg.openDlg();		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, pos:{x:"center", y:40}, uiback:uiback.dlg.noborder, uicfg:uicfg.YellowdiamondDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__setCallers = function(){
		this.dlg.items_.closeBtn.click();
		assertEQ ( this.dlg.isShow(), false );
		
		this.mm.mock(JMISC, 'openCommYellowDiamond');
		this.dlg.items_.openCommBtn.click();
		assertEQ ( this.mm.params['openCommYellowDiamond'], [] );
		
		this.mm.clear();
		this.mm.mock(JMISC, 'openYearYellowDiamond');
		this.dlg.items_.openYearBtn.click();
		assertEQ ( this.mm.params['openYearYellowDiamond'], [] );
		
		this.mm.clear();
		this.mm.mock(JMISC, 'payCommYellowDiamond');
		this.dlg.items_.payCommBtn.click();
		assertEQ ( this.mm.params['payCommYellowDiamond'], [] );
		
		this.mm.clear();
		this.mm.mock(JMISC, 'payYearYellowDiamond');
		this.dlg.items_.payYearBtn.click();
		assertEQ ( this.mm.params['payYearYellowDiamond'], [] );
		
		this.mm.clear();
		this.mm.mock(JMISC, 'openPayWnd');
		this.dlg.items_.buyGoldBtn.click();
		assertEQ ( this.mm.params['openPayWnd'], [] );
	};
	
	this.test_getNewGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg.items_.getNewBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.yellowdiamondDlg.tip.openYellow );
			
		this.mm.clear();
		this.mm.mock(YellowDiamondSender, 'sendGetNewGift');
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.dlg.items_.getNewBtn.click();
		assertEQ ( this.mm.params['sendGetNewGift'], [this.g] );
			
		this.mm.clear();
		this.g.getImgr().getRoleRes().ydInfo.got_newgift = 1;
		this.dlg.items_.getNewBtn.click();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_getCommEveryDayGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg.items_.getCommEveryDayBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.yellowdiamondDlg.tip.openYellow );
			
		this.mm.clear();
		this.mm.mock(YellowDiamondSender, 'sendGetCommEveryDayGift');
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.dlg.items_.getCommEveryDayBtn.click();
		assertEQ ( this.mm.params['sendGetCommEveryDayGift'], [this.g] );
			
		this.mm.clear();
		this.g.getImgr().getRoleRes().ydInfo.got_commgift = this.g.getSvrTimeS();
		this.dlg.items_.getCommEveryDayBtn.click();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_getYearEveryDayGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.dlg.items_.getYearEveryDayBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.yellowdiamondDlg.tip.openYearYellow );
			
		this.mm.clear();
		this.mm.mock(YellowDiamondSender, 'sendGetYearEveryDayGift');
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_year_vip = 1;
		this.dlg.items_.getYearEveryDayBtn.click();
		assertEQ ( this.mm.params['sendGetYearEveryDayGift'], [this.g] );
			
		this.mm.clear();
		this.g.getImgr().getRoleRes().ydInfo.got_yeargift = this.g.getSvrTimeS();
		this.dlg.items_.getYearEveryDayBtn.click();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_getRoleLevelGift = function(){
		this.mm.mock(YellowDiamondSender, 'sendGetLevelGift');
		this.g.getImgr().getRoleRes().level = 1;
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.g.getImgr().getRoleRes().ydInfo.yellow_vip_level = 4;
		this.dlg.items_.levelList.getItem(0).exsubs.getBtn.click();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().level = 70;
		this.dlg.items_.levelList.getItem(0).exsubs.getBtn.click();
		assertEQ ( this.mm.params['sendGetLevelGift'], [this.g, 1] );
		this.mm.clear();
		this.dlg.items_.levelList.getItem(1).exsubs.getBtn.click();
		assertEQ ( this.mm.params['sendGetLevelGift'], [this.g, 2] );
		this.mm.clear();	
		this.dlg.items_.levelList.getItem(6).exsubs.getBtn.click();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TestCaseSysTip.getSystip(), TQ.format(rstr.yellowdiamondDlg.tip.levelYellow, 5) );
			
		this.mm.clear();
		this.g.getImgr().getRoleRes().ydInfo.got_lvlgifts = [3];
		this.dlg.items_.levelList.getItem(2).exsubs.getBtn.click();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__initInfoShowYellowLevel = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.yellowLbl), 'qq/yd/mainui/notyellow.gif' ), true );
			
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.g.getImgr().getRoleRes().ydInfo.yellow_vip_level = 4;
		this.dlg._initInfo();
		assertEQ ( IMG.getBKImage(this.dlg.items_.yellowLbl), "url('')" );
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.yellowLevel), 'qq/yd/flag/ui/4.png' ), true );
	};
		
	this.test__initInfoOpenYellowBtnsDisplay = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( TQ.getCSS(this.dlg.items_.openCommBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.openYearBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payCommBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payYearBtn.getParent(), 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.dlg._initInfo();
		assertEQ ( TQ.getCSS(this.dlg.items_.openCommBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.openYearBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payCommBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payYearBtn.getParent(), 'display'), 'none' );
			
			
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_year_vip = 1;
		this.dlg._initInfo();
		assertEQ ( TQ.getCSS(this.dlg.items_.openCommBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.openYearBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payCommBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payYearBtn.getParent(), 'display'), 'block' );
	};
	
	this.test__initInfoNewGiftBtns = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getNewBtn.isEnable(), true );
			
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.got_newgift = 1;
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getNewBtn.isEnable(), false );
	};
	
	this.test__initInfoNewGiftList = function(){
		var items = DropItemUtil.getDropItems(res_yd_newgifts[0].dropid);
		assertEQ ( this.dlg.items_.newhandList.getCount(), items.length );
		var itemRes = ItemResUtil.findItemres(items[0].id);
		var item0 = this.dlg.items_.newhandList.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeSmallImg(itemRes.smallpic)), true );
		assertEQ ( TQ.getTextEx(item0.exsubs.number), '×' + items[0].number );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		items[0].resid = items[0].id;
		items[0].itemres = ItemResUtil.findItemres(items[0].resid);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(items[0]));
	};
	
	this.test__initInfoGetCommEveryDayBtnEnableState = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getCommEveryDayBtn.isEnable(), true );
			
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.got_commgift =this.g.getSvrTimeS();
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getCommEveryDayBtn.isEnable(), false );
	};
	
	this.test__initInfoCommGiftList = function(){
		assertEQ ( this.dlg.items_.everydayList.getCount(), res_yd_everydaygifts.length );
		var res0 = res_yd_everydaygifts[0];
		var items0 = DropItemUtil.getDropItems(res0.dropid);
		var item0 = this.dlg.items_.everydayList.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.xdLevel), 'qq/yd/flag/ui/1.png' ), true );
		var itemRes0 = ItemResUtil.findItemres(items0[0].id);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon1), IMG.makeSmallImg(itemRes0.smallpic)), true );
		assertEQ ( TQ.getTextEx(item0.exsubs.number1), '×' + items0[0].number );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item1']);
		items0[0].resid = items0[0].id;
		items0[0].itemres = ItemResUtil.findItemres(items0[0].resid);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(items0[0]));
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item2']);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  '' );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item3']);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  '' );
	};
	
	this.test__initInfoYearGiftBtnEnableState = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getYearEveryDayBtn.isEnable(), true );
			
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.got_yeargift = this.g.getSvrTimeS();
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.getYearEveryDayBtn.isEnable(), false );
	};
	
	this.test__initInfoYearGiftList = function(){
		var items = DropItemUtil.getDropItems(res_yd_yeareverydaygifts[0].dropid);
		assertEQ ( this.dlg.items_.yearEverydayList.getCount(), items.length );
		var itemRes = ItemResUtil.findItemres(items[0].id);
		var item0 = this.dlg.items_.yearEverydayList.getItem(0);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), IMG.makeSmallImg(itemRes.smallpic)), true );
		assertEQ ( TQ.getTextEx(item0.exsubs.number), '×' + items[0].number );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		items[0].resid = items[0].id;
		items[0].itemres = ItemResUtil.findItemres(items[0].resid);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(items[0]));		
	};
	
	this.test__initInfoLevelGiftListBtnsEnableState = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.g.getImgr().getRoleRes().ydInfo.yellow_vip_level = 4;		
		this.g.getImgr().getRoleRes().ydInfo.got_lvlgifts = [3];
		this.g.getImgr().getRoleRes().level = 70;
			
		this.dlg._initInfo();
			
		assertEQ ( this.dlg.items_.levelList.getItem(0).exsubs.getBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.levelList.getItem(1).exsubs.getBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.levelList.getItem(2).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.levelList.getItem(8).exsubs.getBtn.isEnable(), false );
	};
	
	this.test__initInfoLevelGiftList = function(){
		assertEQ ( this.dlg.items_.levelList.getCount(), res_yd_lvlgifts.length );
		var res0 = res_yd_lvlgifts[0];
		var items0 = DropItemUtil.getDropItems(res0.dropid);
		var item0 = this.dlg.items_.levelList.getItem(0);
		assertEQ ( TQ.getTextEx(item0.exsubs.roleLevel), 'Lv10');
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.xdLevel), 'qq/yd/flag/ui/1.png' ), true );
		var itemRes0 = ItemResUtil.findItemres(items0[0].id);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon1), IMG.makeSmallImg(itemRes0.smallpic)), true );
		assertEQ ( TQ.getTextEx(item0.exsubs.number1), '×' + items0[0].number );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item1']);
		items0[0].resid = items0[0].id;
		items0[0].itemres = ItemResUtil.findItemres(items0[0].resid);
		tip.getTip(); assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(items0[0]));
	};
	
	this.test_roleLevelChangeResetLevelGiftListBtnsEnableState = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.g.getImgr().getRoleRes().ydInfo.yellow_vip_level = 5;		
		this.g.getImgr().getRoleRes().ydInfo.got_lvlgifts = [3];
		this.g.getImgr().getRoleRes().level = 70;
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.levelList.getItem(8).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.levelList.getItem(8).exsubs.getBtn.getUIBack(), uiback.btn.ydgetbtn );
		
		var netcmd = {data:{res:{level:80}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd.data});
		var netcmd = {data:{res:{level:100}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd.data});
		assertEQ ( this.dlg.items_.levelList.getItem(8).exsubs.getBtn.isEnable(), true );
	};
	
	this.test_initInfoGetYellowInfo = function(){
		this.mm.mock(YellowDiamondSender, 'sendGetInfo');
		this.dlg._initInfo();
		assertEQ ( this.mm.params['sendGetInfo'], [this.g] );
	};
	
	this.test_onSvrPkgGotNewGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		var cmddata = {res:{ydInfo:{}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getNewBtn.isEnable(), true );
			
		cmddata = {res:{ydInfo:{got_newgift:1}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getNewBtn.isEnable(), false );
	};
	
	this.test_onSvrPkgGotCommGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		var cmddata = {res:{ydInfo:{}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getCommEveryDayBtn.isEnable(), true );
			
		this.g.setSvrTimeS(1379520000);
		cmddata = {res:{ydInfo:{got_commgift:1379520000}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getCommEveryDayBtn.isEnable(), false );
		
		this.g.setSvrTimeS(1379520000 + 24*3600);
		cmddata = {res:{ydInfo:{got_commgift:1379520000}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getCommEveryDayBtn.isEnable(), true );
	};
	
	this.test_onSvrPkgGotYearGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		var cmddata = {res:{ydInfo:{}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getYearEveryDayBtn.isEnable(), true );
			
		this.g.setSvrTimeS(1379520000);
		cmddata = {res:{ydInfo:{got_yeargift:1379520000}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getYearEveryDayBtn.isEnable(), false );
		
		this.g.setSvrTimeS(1379520000 + 24*3600);
		cmddata = {res:{ydInfo:{got_yeargift:1379520000}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.getYearEveryDayBtn.isEnable(), true );
	};
	
	this.test_onSvrPkgGotLvlGift = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.g.getImgr().getRoleRes().ydInfo.is_yellow_vip = 1;
		this.g.getImgr().getRoleRes().ydInfo.yellow_vip_level = 4;		
		this.g.getImgr().getRoleRes().ydInfo.got_lvlgifts = [3];
		this.g.getImgr().getRoleRes().level = 70;
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.levelList.getItem(0).exsubs.getBtn.isEnable(), true );
			
		var cmddata = {res:{ydInfo:{got_lvlgifts:[1,3]}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( this.dlg.items_.levelList.getItem(0).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.levelList.getItem(2).exsubs.getBtn.isEnable(), false );
	};
	
	this.test_onSvrPkgYellowInfo = function(){
		this.g.getImgr().getRoleRes().ydInfo = {};
		this.dlg._initInfo();
		assertEQ ( TQ.getCSS(this.dlg.items_.openCommBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.openYearBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payCommBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payYearBtn.getParent(), 'display'), 'none' );
		
		var cmddata = {res:{ydInfo:{is_yellow_vip:1, is_yellow_year_vip:1, yellow_vip_level:1 }}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:cmddata});
		assertEQ ( TQ.getCSS(this.dlg.items_.openCommBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.openYearBtn.getParent(), 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payCommBtn.getParent(), 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.payYearBtn.getParent(), 'display'), 'block' );		
		assertEQ ( IMG.getBKImage(this.dlg.items_.yellowLbl), "url('')" );
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.yellowLevel), 'qq/yd/flag/ui/1.png' ), true );		
	};
});

tqYellowdiamondDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseYellowdiamondDlg, 'TestCaseYellowdiamondDlg');
};
