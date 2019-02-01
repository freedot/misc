/*******************************************************************************/
requireEx('./handler/tqTradingAreaDlg.js', [
	{
		start:'//TradingAreaDlg-unittest-start'
		,end:'//TradingAreaDlg-unittest-end'
		,items:[
			'm_this'
			,'m_dlg'
			,'m_items'
			,'m_g'		
			,'m_tradingInfo'		
			,'_initDlg'		
			,'_showDlg'		
			,'_initInfo'		
			,'_createDlg'		
			,'_setCallers'		
			,'_onSvrPkg'		
			,'_onClickSetTradingArea'		
			,'_onClickStartTrading'		
			,'_onSelfAlliDetail'		
			,'_onClickCancelTrading'		
			,'_onClickSpeedTrading'		
			,'_update'		
			,'_onDlgEvent'		
			,'_onUpdate'		
		]
	}
]);

TestCaseTradingAreaDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = TradingAreaDlg.snew(this.g);
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SHICHANGBUILD, level:5}] });
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.mm.params['regEvent.0'], [EVT.NET, NETCMD.TRADING_AREA, this.dlg, this.lc()._onSvrPkg] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.SELFALLI_DETAIL, 0, this.dlg, this.lc()._onSelfAlliDetail] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test_openDlgWhenNoInAlliance = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		TestCaseSysTip.clearTip();
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		this.dlg.openDlg();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.tradingareadlg.tip.canNotOpen ), true);
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_openDlgWhenBuildHasNoEnoughLevel = function(){
		TestCaseSysTip.clearTip();
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SHICHANGBUILD, level:1}] });
		this.dlg.openDlg();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.tradingareadlg.tip.canNotOpen ), true);
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );		
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.tradingareadlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.tradingareadlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.lc().m_dlg, 'setCaller:dlgSetCaller' );
		
		this.mm.mock( this.lc().m_items.setTradingAreaBtn, 'setCaller:setTradingSetCaller' );
		this.mm.mock( this.lc().m_items.startTradingBtn, 'setCaller:startTradingSetCaller' );
		
		this.mm.mock( this.lc().m_items.cancelTradingBtn, 'setCaller:cancelTradingSetCaller' );
		this.mm.mock( this.lc().m_items.speedTradingBtn, 'setCaller:speedTradingSetCaller' );
		
		this.lc()._setCallers();
		
		assertEQ ( this.mm.params['setTradingSetCaller'], [{self:this.dlg, caller:this.lc()._onClickSetTradingArea}] );
		assertEQ ( this.mm.params['startTradingSetCaller'], [{self:this.dlg, caller:this.lc()._onClickStartTrading}] );
		assertEQ ( this.mm.params['cancelTradingSetCaller'], [{self:this.dlg, caller:this.lc()._onClickCancelTrading}] );
		assertEQ ( this.mm.params['speedTradingSetCaller'], [{self:this.dlg, caller:this.lc()._onClickSpeedTrading}] );
		assertEQ ( this.mm.params['dlgSetCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
	};	
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.g, 'regUpdater');
		this.mm.mock(AllianceSender, 'sendGetMyAllianceDetail');
		this.mm.mock(TradingAreaSender, 'sendGetMyTradingInfo');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 1000] );
		assertEQ ( this.mm.params['sendGetMyAllianceDetail'], [this.g] );
		assertEQ ( this.mm.params['sendGetMyTradingInfo'], [this.g] );
	};
	
	this.test__onClickSetTradingArea = function(){
		this.helper_setTradingInfo_start();
		this.mm.mock(UIM.getDlg('settradingarea'), 'openDlg');
		this.lc()._onClickSetTradingArea();
		assertEQ ( this.mm.params['openDlg'], [4, ['role1', 'role2']]);
	};
	
	this.test__onClickStartTrading = function(){
		this.mm.mock(TradingAreaSender, 'sendStartTrading');
		this.lc()._onClickStartTrading();
		assertEQ ( this.mm.params['sendStartTrading'], [this.g, false] );
	};
	
	this.test__onClickStartVipTrading = function(){
		this.mm.mock(TradingAreaSender, 'sendStartTrading');
		this.lc().m_items.startVipTradingBtn.click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), HyperLinkMgr.formatLink(TQ.format(rstr.alli.tradingareadlg.lbl.noEnoughVip, 2)) );
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getImgr().getRoleRes().vip = 2;
		this.lc().m_items.startVipTradingBtn.click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.tradingareadlg.lbl.confirmVipStart );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendStartTrading'], [this.g, true] );		
	};
	
	this.test__onClickCancelTrading = function(){
		this.mm.mock(TradingAreaSender, 'sendCancelTrading');
		this.lc()._onClickCancelTrading();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.tradingareadlg.tip.confirmCancelTrading );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendCancelTrading'], [this.g] );
	};
	
	this.test__onClickSpeedTrading = function(){
		this.mm.mock(UIM.getDlg('uselistitem'), 'openDlg');
		this.lc()._onClickSpeedTrading();
		assertEQ ( this.mm.params['openDlg'], [[RES_EFF.ACC_TRADING],  {id:0, stoptime:this.lc().m_tradingInfo.stopTime, name:rstr.alli.tradingareadlg.tip.trading, type:RES_TRG.SELF_ROLE}] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc(), '_update');
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_tradingInfo.stopTime, 0 );
		assertEQ ( this.mm.walkLog, '' );
		
		cmd = {data:{trading:{stopTime:1}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_tradingInfo.stopTime, 1 );
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.test__onSelfAlliDetail = function(){
		this.mm.mock(this.lc(), '_update');
		this.lc()._onSelfAlliDetail();
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.helper_setAllianceDetail = function(){
		var mydetail = {name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:20,card:30,qqGroup:'123456',introduction:'<intro>',bulletin:'<bulletin>',upgrade:{startTime:10, stopTime:30},transfer:{startTime:15, stopTime:35}};
		this.g.getImgr().getMyAlliance().copyDetail(mydetail);
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SHICHANGBUILD, level:25}] });
	};
	
	this.helper_setTradingInfo_start = function(){
		var cmd = {data:{trading:{stopTime:30, rate:1, maxCitys:4, capacity:2500, targets:[
			{roleName:'role2', gridId:602, buildLevel:11,distance:1001}
			,{roleName:'role1', gridId:601, buildLevel:10,distance:1000}
			] ,totalDis:10000, needTime:20, gain:2000, todayTimes:{cur:1, max:3} }}};
		this.lc()._onSvrPkg(cmd);
	};
	
	this.helper_setTradingInfo_stop = function(){
		var cmd = {data:{trading:{stopTime:0}}};
		this.lc()._onSvrPkg(cmd);
	};
	
	this.test__update = function(){
		this.helper_setAllianceDetail();
		this.helper_setTradingInfo_start();
		
		this.g.setSvrTimeS(20);
		TQ.setTextEx(this.lc().m_items.allianceName, '');
		
		this.lc().m_dlg.hide();
		this.lc()._update();
		assertEQ ( TQ.getTextEx(this.lc().m_items.allianceName), '' );
		
		this.lc().m_dlg.show();
		this.lc()._update();
		
		assertEQ ( TQ.getTextEx(this.lc().m_items.allianceName), 'alliance' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.tradingRate), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildLevel), 25 );
		
		assertEQ ( TQ.getTextEx(this.lc().m_items.teamLevel), 25 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.maxCitys), 4 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.capacity), 2500 );
		
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '2/4' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.totalDistance), 10000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.needTime), '00:00:20' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.gain), 2000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.todayTimes), '1/3' );
		
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, '00:00:10') );
		assertEQ ( TQ.getCSS(this.lc().m_items.cancelTradingBtn.getParent(), 'visibility'), 'visible' );
		assertEQ ( TQ.getCSS(this.lc().m_items.speedTradingBtn.getParent(), 'visibility'), 'visible' );
		assertEQ ( TQ.getCSS(this.lc().m_items.setTradingAreaBtn.getParent(), 'visibility'), 'hidden' );
		assertEQ ( TQ.getCSS(this.lc().m_items.startTradingBtn.getParent(), 'visibility'), 'hidden' );
		assertEQ ( TQ.getCSS(this.lc().m_items.startVipTradingBtn.getParent(), 'visibility'), 'hidden' );
		
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.no), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.roleName), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.cood), '(0,1)' );
		assertEQ ( TQ.getTextEx(item0.exsubs.buildLevel), 10 );
		assertEQ ( TQ.getTextEx(item0.exsubs.distance), 1000 );
		
		assertEQ ( TQ.getTextEx(item1.exsubs.no), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.roleName), 'role2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.cood), '(1,1)' );
		assertEQ ( TQ.getTextEx(item1.exsubs.buildLevel), 11 );
		assertEQ ( TQ.getTextEx(item1.exsubs.distance), 1001 );
		
		this.helper_setTradingInfo_stop();
		this.lc()._update();
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), '' );
		assertEQ ( TQ.getCSS(this.lc().m_items.cancelTradingBtn.getParent(), 'visibility'), 'hidden' );
		assertEQ ( TQ.getCSS(this.lc().m_items.speedTradingBtn.getParent(), 'visibility'), 'hidden' );
		assertEQ ( TQ.getCSS(this.lc().m_items.setTradingAreaBtn.getParent(), 'visibility'), 'visible' );
		assertEQ ( TQ.getCSS(this.lc().m_items.startTradingBtn.getParent(), 'visibility'), 'visible' );
		assertEQ ( TQ.getCSS(this.lc().m_items.startVipTradingBtn.getParent(), 'visibility'), 'visible' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE-1);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
	this.test__onUpdate = function(){
		this.helper_setAllianceDetail();
		this.helper_setTradingInfo_start();
		this.g.setSvrTimeS(10);
		this.lc()._onUpdate();
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, '00:00:20') );
		
		this.g.setSvrTimeS(20);
		this.lc()._onUpdate();
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, '00:00:10') );
		
		this.g.setSvrTimeS(31);
		this.lc()._onUpdate();
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, '00:00:00') );
	};
	
});

tqTradingAreaDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseTradingAreaDlg, 'TestCaseTradingAreaDlg');
};
