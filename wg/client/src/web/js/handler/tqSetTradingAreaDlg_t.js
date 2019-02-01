/*******************************************************************************/
requireEx('./handler/tqSetTradingAreaDlg.js', [
	{
		start:'//SetTradingAreaDlg-unittest-start'
		,end:'//SetTradingAreaDlg-unittest-end'
		,items:[
			'm_this'
			,'m_dlg'
			,'m_items'
			,'m_g'		
			,'m_mems'		
			,'_initDlg'		
			,'_showDlg'		
			,'_initInfo'		
			,'_createDlg'		
			,'_setCallers'				
			,'_onSvrPkg'		
			,'_onClickListItem'		
			,'_onClickAutoSelBtn'		
			,'_onClickAllCancelBtn'		
			,'_onClickSaveSelBtn'		
		]
	}
]);

TestCaseSetTradingAreaDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SetTradingAreaDlg.snew(this.g);
		this.dlg.openDlg(4, ['role1']);
		this.lc = this.dlg.lc;
		this.cmd = {data:{mems:[{roleId:1,roleName:'role1',gridId:602,buildLevel:2,distance:100},{roleId:2, roleName:'role2',gridId:601,buildLevel:3,distance:90}]}};
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
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
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
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:true, title:rstr.alli.settradingareadlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.settradingareadlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.lc().m_items.list, 'setCaller:listSetCaller' );
		this.mm.mock( this.lc().m_items.autoSelBtn, 'setCaller:autoSelBtnSetCaller' );
		this.mm.mock( this.lc().m_items.allCancelBtn, 'setCaller:allCancelBtnSetCaller' );
		this.mm.mock( this.lc().m_items.saveSelBtn, 'setCaller:saveSelBtnSetCaller' );
		
		this.lc()._setCallers();
		
		assertEQ ( this.mm.params['listSetCaller'], [{self:this.dlg, caller:this.lc()._onClickListItem}] );
		assertEQ ( this.mm.params['autoSelBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickAutoSelBtn}] );
		assertEQ ( this.mm.params['allCancelBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickAllCancelBtn}] );
		assertEQ ( this.mm.params['saveSelBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickSaveSelBtn}] );
	};	
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
	};
	
	this.test__initInfo = function(){
		this.mm.mock(TradingAreaSender, 'sendGetMembers');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetMembers'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(TradingAreaSender, 'sendGetMemDetail');
		
		TQ.setTextEx(this.lc().m_items.cityNumber, '');
		
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_mems, [] );
		
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '' );
		assertEQ ( this.lc().m_mems, [{roleId:2, roleName:'role2',gridId:601,buildLevel:3,distance:90 },{roleId:1, roleName:'role1',gridId:602,buildLevel:2,distance:100 }] );
		
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( this.mm.params['sendGetMemDetail'], [this.g, 1] );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '1/4' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.totalDis), 100 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.needTime), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.gain), '0 ' + rstr.comm.money );

		var list = this.lc().m_items.list;
		assertEQ ( list.getCount(), 2 );
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.no), 1 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.roleName), 'role2' );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.cood), '(0,1)' );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.buildLevel), 3 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.distance), 90 );
		
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 1 );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.no), 2 );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.roleName), 'role1' );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.cood), '(1,1)' );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.buildLevel), 2 );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.distance), 100 );
		
		// 初次选择列表只在打开后的第一次起作用
		list.getItem(0).exsubs.sel.setCheck(1);
		list.getItem(1).exsubs.sel.setCheck(0);
		this.lc()._onSvrPkg(cmd);
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 0 );
		
		// 每次打开对话框会重新清除一次选择列表
		this.dlg.openDlg(4, ['role1']);
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 1 );
	};
	
	this.test__onClickListItem = function(){
		this.mm.mock(TradingAreaSender, 'sendGetMemDetail');
		
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '1/4' );
		
		this.lc()._onClickListItem(null, -1); // item is null
		
		this.lc()._onClickListItem(null, 0);
		var list = this.lc().m_items.list;
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( this.mm.params['sendGetMemDetail'], [this.g, 2] );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '2/4', 'update total info' );
		
		this.mm.clear();
		this.lc()._onClickListItem(null, 0);
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '1/4', 'update total info' );
		
		// 如果已经包含详情，则不向server请求
		this.mm.clear();
		var detailcmd = {data:{mems:[{_k:'roleId'},{roleId:2,isDetail:1,needTime:10,gain:20}]}};
		this.lc()._onSvrPkg(detailcmd);
		this.lc()._onClickListItem(null, 0);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '2/4', 'update total info' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.totalDis), 90+100 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.needTime), 10 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.gain), '20 ' + rstr.comm.money );
		
		// 已达到选择的上限
		this.mm.clear();
		this.dlg.openDlg(1, ['role1']);
		this.lc()._onSvrPkg(this.cmd);
		this.lc()._onClickListItem(null, 0);
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.settradingareadlg.tip.maxCount ), true);
	};
	
	this.test__onClickAutoSelBtn = function(){
		this.dlg.openDlg(1, ['role1']);
		this.lc()._onSvrPkg(this.cmd);
		this.lc()._onClickAutoSelBtn();
		var list = this.lc().m_items.list;
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '1/1' );
		
		this.dlg.openDlg(4, ['role1']);
		this.lc()._onSvrPkg(this.cmd);
		this.lc()._onClickAutoSelBtn();
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '2/4' );
	};
	
	this.test__onClickAllCancelBtn = function(){
		this.dlg.openDlg(4, ['role1']);
		this.lc()._onSvrPkg(this.cmd);
		this.lc()._onClickAutoSelBtn();
		var list = this.lc().m_items.list;
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '2/4' );
		
		this.lc()._onClickAllCancelBtn();
		assertEQ ( list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( list.getItem(1).exsubs.sel.getCheck(), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNumber), '0/4' );
	};
	
	this.test__onClickSaveSelBtn = function(){
		this.mm.mock(TradingAreaSender, 'sendSetTradingArea');
		this.dlg.openDlg(4, []);
		this.lc()._onSvrPkg(this.cmd);
		this.lc()._onClickSaveSelBtn();
		assertEQ ( this.lc().m_dlg.isShow(), true );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.settradingareadlg.tip.noSelected ), true);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onClickAutoSelBtn();
		this.lc()._onClickSaveSelBtn();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( this.mm.params['sendSetTradingArea'], [this.g, [2,1]] );
	};
});

tqSetTradingAreaDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSetTradingAreaDlg, 'TestCaseSetTradingAreaDlg');
};
