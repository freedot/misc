/*******************************************************************************/
requireEx('./handler/tqCityDefDlg.js', [
	{
		start:'//CityDefDlg-unittest-start'
		,end:'//CityDefDlg-unittest-end'
		,items:[	'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_panels'
			,'_initParams'
			,'_regEvents'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_createPanels'
			,'_onLoginOk'
			,'_onSvrPkg'
			,'_onDlgEvent'
			,'_getPanel'
			,'_onHeroUpdate'
			,'_onUpdateSoldiersRes'
		]
	}
	,{
		start:'//CityDefCreatePanel-unittest-start'
		,end:'//CityDefCreatePanel-unittest-end'
		,items:['m_this'
			,'m_isShow'
			,'m_g'
			,'m_items'
			,'_initParams'
			,'_setSelList'
			,'_setBuildInputNumLimit'
			,'_setCallers'
			,'_updateBuildingInfos'
			,'_udpateBuildedList'
			,'_updateCurSelInfo'
			,'_updateCapacity'
			,'_getInputNumLimit'
			,'_getCurSelBuild'
			,'_getMyHasNumber'
			,'_updateCurSelDefName'
			,'_updateCurSelEffectDesc'
			,'_updateCurSelExpendDesc'
			,'_updateCurSelBuildNeedTime'
			,'_getResTags'
			,'_getLeftCapacity'
			,'_getTotalCapacity'
			,'_getHasCityDefs'
			,'_onUpdate'
			,'_onClickSpeed'
			,'_onClickCancel'
			,'_onClickSelList'
			,'_onClickBuild'
			,'_onNumberChange'
			,'_onClickDown'
			,'_onInputDownNumberOk'
			,'_getCurSelInvalidExpendTip'
			,'_traversalExpends'
			,'_onCancelCallback'
		]
	}
	,{
		start:'//CityDefCityPanel-unittest-start'
		,end:'//CityDefCityPanel-unittest-end'
		,items:['m_this'
			,'m_g'
			,'m_items'
			,'m_forceTabHdr'
			,'m_isShow'
			,'_initParams'
			,'_setCallers'
			,'_updateForcetabList'
			,'_onClickChangeForcetab'
			,'_onClickAssignSoldier'
			,'_onClickSaveForcetab'
			,'_assignHerosCallback'
		]
	}
	,{
		start:'//FillSoldiersHdr-unittest-start'
		,end:'//FillSoldiersHdr-unittest-end'
		,items:['m_g'
			,'m_list'
			,'m_heros'
			,'m_msgSender'
			,'_getChangedSoldier'
			,'_isChanged'
			,'_getCurSetSoldier'
			,'_getSoldierNumber'
		]
	}
	,{
		start:'//CityDefTowerPanel-unittest-start'
		,end:'//CityDefTowerPanel-unittest-end'
		,items:['m_this'
			,'C_BTN_DELAY_MS'
			,'m_g'
			,'m_items'
			,'m_heros'
			,'m_isShow'
			,'m_assignSoldierHdr'
			,'m_fillSoliderHdr'
			,'_initParams'
			,'_initDelayBtns'
			,'_setCallers'
			,'_updateForcetabList'
			,'_updateTowerAttrs'
			,'_updateFreeSoldierList'
			,'_onClickClearAll'
			,'_onClickFillAll'
			,'_onClickConfirmAll'
			,'_enableForcetabListGrid'
			,'_disableForcetabListGrid'
			,'_disableAllForcetabListGrids'
			,'_enableForcetabListGrids'
			,'_createTowerHeros'
			,'_setForcetabListItems'
			,'_setForcetabListCaller'
			,'_onClickConfirmBtn'
			,'_getHeroRes'
		]
	}
]);
	
var TestCaseCityDefDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = CityDefDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams' );
		this.mm.mock(this.lc(), '_regEvents' );
		this.dlg.init(this.g);
		assertEQ ( this.mm.walkLog, '_initParams,_regEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.dlg, this.g] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		
		var p_tabIdx = 1;
		this.dlg.openDlg(p_tabIdx);
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initInfo'], [p_tabIdx] );
	};
	
	this.test__initParams = function(){
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent,regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.HERO_UPDATE, 0, this.dlg, this.lc()._onHeroUpdate] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.SOLDIERRES, 0, this.dlg, this.lc()._onUpdateSoldiersRes] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.LOGIN_OK, 0, this.dlg, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.3'], [EVT.NET, NETCMD.CITYDEF, this.dlg, this.lc()._onSvrPkg] );
		assertEQ ( this.mm.params['regEvent.4'], [EVT.NET, NETCMD.TOWER, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_createDlg' );
		this.mm.mock( this.lc(), '_createPanels' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_createPanels' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.mm.mock(r_dlg, 'setCaller');
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,setCaller' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.cityDefDlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.cityDefDlg, this.lc().m_items] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__createPanels = function(){
		this.mm.mock(CityDefCreatePanel, 'snew', [{name:'create'}] );
		this.mm.mock(CityDefCityPanel, 'snew', [{name:'city'}] );
		this.mm.mock(CityDefTowerPanel, 'snew', [{name:'tower'}] );
		this.lc()._createPanels();
		assertEQ ( this.mm.walkLog, 'snew,snew,snew' );
		assertEQ ( this.mm.params['snew.0'], [this.g, this.lc().m_items.tabList.getTabItems(0)] );
		assertEQ ( this.mm.params['snew.1'], [this.g, this.lc().m_items.tabList.getTabItems(1)] );
		assertEQ ( this.mm.params['snew.2'], [this.g, this.lc().m_items.tabList.getTabItems(2)] );
		assertEQ ( this.lc().m_panels['create'], {name:'create'} );
		assertEQ ( this.lc().m_panels['city'], {name:'city'} );
		assertEQ ( this.lc().m_panels['tower'], {name:'tower'} );
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_panels['create'], 'open');
		this.mm.mock(this.lc().m_panels['city'], 'open');
		this.mm.mock(this.lc().m_panels['tower'], 'open');
		this.mm.mock(this.lc().m_items.tabList, 'setTabCount');
		this.mm.mock(this.lc().m_items.tabList, 'activeTab');
		
		var p_tabIdx = 1;
		this.lc()._initInfo(p_tabIdx);
		
		assertEQ ( this.mm.walkLog, 'open,open,open,setTabCount,activeTab' );
		assertEQ ( this.mm.params['setTabCount'], [2] );
		assertEQ ( this.mm.params['activeTab'], [p_tabIdx] );
		
		this.mm.clear();
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.TOWERBUILD, level:1}] });
		this.lc()._initInfo();
		assertEQ ( this.mm.params['setTabCount'], [3] );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.lc().m_panels['create'], 'hide');
		this.mm.mock(this.lc().m_panels['city'], 'hide');
		this.mm.mock(this.lc().m_panels['tower'], 'hide');
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE+1)
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE)
		assertEQ ( this.mm.walkLog, 'hide,hide,hide' );
	};
	
	this.test__onHeroUpdate = function(){
		this.mm.mock(this.lc()._getPanel('city'), 'update');
		this.lc()._onHeroUpdate();
		assertEQ ( this.mm.walkLog, 'update' );
	};
	
	this.test__onUpdateSoldiersRes = function(){
		this.mm.mock(this.lc()._getPanel('tower'), 'update');
		this.lc()._onUpdateSoldiersRes();
		assertEQ ( this.mm.walkLog, 'update' );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(CityDefSender , 'sendGetCityDefInfo');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['sendGetCityDefInfo'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc().m_panels['create'], 'update');
		this.mm.mock(this.lc().m_panels['city'], 'update');
		this.mm.mock(this.lc().m_panels['tower'], 'update');
		
		this.mm.clear();
		var p_netevent = {data:{citydefs:[1,2,3,4,5]}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.g.getImgr().getCityDefs().defs, [1,2,3,4,5] );
		assertEQ ( this.mm.walkLog, 'update' );
		
		this.mm.clear();
		var p_netevent = {data:{building:{id:1, stoptime:2, number:3}}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.g.getImgr().getCityDefs().building.id, 1 );
		assertEQ ( this.g.getImgr().getCityDefs().building.stoptime, 2 );
		assertEQ ( this.g.getImgr().getCityDefs().building.number, 3 );
		assertEQ ( this.mm.walkLog, 'update' );
		
		this.mm.clear();
		var p_netevent = {data:{defarmy:{heros:[1,2,3,4,5],lineupId:1}}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.g.getImgr().getCityDefs().defarmy, {heros:[1,2,3,4,5],lineupId:1});
		assertEQ ( this.mm.walkLog, 'update' );
		
		this.mm.clear();
		var p_netevent = {data:{tower:{lineupId:180003}}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.g.getImgr().getTower().lineupId, 180003);
		assertEQ ( this.mm.walkLog, 'update' );
		this.g.getImgr().getTower().lineupId = 180004;
	};
	
	this.test__getPanel = function(){
		assertEQ ( this.lc()._getPanel('create'), this.lc().m_panels['create'] );
		assertEQ ( this.lc()._getPanel('city'), this.lc().m_panels['city'] );
		assertEQ ( this.lc()._getPanel('tower'), this.lc().m_panels['tower'] );
		assertEQ ( this.lc()._getPanel('xxx') instanceof NullCityDefPanel, true );
	};
});


var TestCaseCityDefCreatePanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var dlg = CityDefDlg.snew(this.g);
		dlg.openDlg(0);
		this.items = dlg.lc().m_items.tabList.getTabItems(0);
		this.panel = CityDefCreatePanel.snew(this.g, this.items);
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_setSelList');
		this.mm.mock(this.lc(), '_setBuildInputNumLimit');
		this.mm.mock(this.lc(), '_setCallers');
		this.panel.init(this.g, this.items);
		assertEQ ( this.mm.walkLog, '_initParams,_setSelList,_setBuildInputNumLimit,_setCallers' );
		assertEQ ( this.mm.params['_initParams'], [this.panel, this.g, this.items] );
	};
	
	this.test_open = function(){
		this.mm.mock(this.lc().m_items.selList, 'setCurSel' );
		this.mm.mock(this.lc().m_items.inum, 'setVal' );
		this.mm.mock(this.panel, 'update' );
		this.mm.mock(this.g, 'regUpdater' );
		this.panel.open();
		assertEQ ( this.mm.walkLog, 'setCurSel,setVal,update,regUpdater' );
		assertEQ ( this.mm.params['setCurSel'], [0] );
		assertEQ ( this.mm.params['setVal'], [1] );
		assertEQ ( this.mm.params['regUpdater'], [this.panel, this.lc()._onUpdate, 1000] );
		assertEQ ( this.lc().m_isShow, true );
	};
	
	this.test_hide = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.panel.hide();
		assertEQ ( this.mm.params['unregUpdater'], [this.panel, this.lc()._onUpdate] );
		assertEQ ( this.lc().m_isShow, false );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateBuildingInfos' );
		this.mm.mock(this.lc(), '_udpateBuildedList' );
		this.mm.mock(this.lc(), '_updateCurSelInfo' );
		this.mm.mock(this.lc(), '_updateCapacity' );
		
		this.lc().m_isShow = false;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '_updateBuildingInfos,_udpateBuildedList,_updateCurSelInfo,_updateCapacity' );
	};
	
	this.test__initParams = function(){
		this.lc()._initParams(this.panel, this.g, this.items);
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_items, this.items );
	};
	
	this.test__setSelList = function(){
		this.lc()._setSelList();
		assertEQ ( TQ.getTextEx(this.lc().m_items.selList.getItem(0).exsubs.name), res_citydef[0].name );
		assertEQ ( TQ.getTextEx(this.lc().m_items.selList.getItem(4).exsubs.name), res_citydef[4].name );
		assertEQ (  isInclude(IMG.getBKImage(this.lc().m_items.selList.getItem(0).exsubs.icon), res_citydef[0].bigpic), true  );
		assertEQ (  isInclude(IMG.getBKImage(this.lc().m_items.selList.getItem(4).exsubs.icon), res_citydef[4].bigpic), true  );
	};
	
	this.test__setBuildInputNumLimit = function(){
		this.mm.mock(this.lc().m_items.inum, 'setLimit' );
		this.lc()._setBuildInputNumLimit();
		assertEQ ( this.mm.params['setLimit'], [this.lc()._getInputNumLimit] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.speedBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.cancelBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.selList, 'setCaller' );
		this.mm.mock(this.lc().m_items.buildBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.inum, 'setCaller' );
		this.mm.mock(this.lc().m_items.buildedList.getItem(0).exsubs.downBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.buildedList.getItem(0).exsubs.downBtn, 'setId' );
		this.mm.mock(this.lc().m_items.buildedList.getItem(4).exsubs.downBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.buildedList.getItem(4).exsubs.downBtn, 'setId' );
		
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,setCaller,setId,setCaller,setId,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.panel, caller:this.lc()._onClickSpeed}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.panel, caller:this.lc()._onClickCancel}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.panel, caller:this.lc()._onClickSelList}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.panel, caller:this.lc()._onClickBuild}] );
		assertEQ ( this.mm.params['setCaller.4'], [{self:this.panel, caller:this.lc()._onNumberChange}] );
		assertEQ ( this.mm.params['setCaller.5'], [{self:this.panel, caller:this.lc()._onClickDown}] );
		assertEQ ( this.mm.params['setCaller.6'], [{self:this.panel, caller:this.lc()._onClickDown}] );
		assertEQ ( this.mm.params['setId.0'], [0] );
		assertEQ ( this.mm.params['setId.1'], [4] );
	};
	
	this.test__getInputNumLimit = function(){
		res_citydef = [{money:10, food:20}];
		this.mm.mock(this.lc(), '_getCurSelBuild', [0]);
		this.mm.mock(this.lc(), '_getMyHasNumber', [100]);
		this.mm.mock(this.lc(), '_getLeftCapacity', [4]);
		assertEQ ( this.lc()._getInputNumLimit(), {min:1, max:4} )
		
		res_citydef = [{money:10, food:200}];
		assertEQ ( this.lc()._getInputNumLimit(), {min:1, max:1} )
	};
	
	this.test__updateBuildingInfos = function(){
		this.mm.mock( TQ, 'setCSS' );
		this.g.getImgr().getCityDefs().building = {id:0};
		
		this.lc()._updateBuildingInfos();
		assertEQ ( this.mm.walkLog, 'setCSS' );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.buildingInfo, 'display', 'none'] );
		
		this.mm.clear();
		this.g.setSvrTimeS(1);
		this.g.getImgr().getCityDefs().building = {id:150101, stoptime:11, number:2};
		this.lc()._updateBuildingInfos();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.buildingInfo, 'display', 'block'] );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildingName), TQ.format(rstr.cityDefDlg.lbl.buildingNumber, res_citydef[0].name) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildingNumber), 2 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildingLefttime), TQ.formatTime(0, 10) );
		
		this.mm.clear();
		this.g.setSvrTimeS(12);
		this.lc()._updateBuildingInfos();
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildingLefttime), TQ.formatTime(0, 0) );
	};
	
	this.test__udpateBuildedList = function(){
		this.g.getImgr().getCityDefs().defs = [1,0,0,0,0];
		this.lc()._udpateBuildedList();
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildedList.getItem(0).exsubs.name), res_citydef[0].name );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildedList.getItem(0).exsubs.number), 1 );
		assertEQ ( this.lc().m_items.buildedList.getItem(0).exsubs.downBtn.isShow(), true );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildedList.getItem(1).exsubs.name), res_citydef[1].name );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildedList.getItem(1).exsubs.number), 0 );
		assertEQ ( this.lc().m_items.buildedList.getItem(1).exsubs.downBtn.isShow(), false );
	};
	
	this.test__updateCurSelInfo = function(){
		this.mm.mock(this.lc(), '_updateCurSelDefName');
		this.mm.mock(this.lc(), '_updateCurSelEffectDesc');
		this.mm.mock(this.lc(), '_updateCurSelExpendDesc');
		this.mm.mock(this.lc(), '_updateCurSelBuildNeedTime');
		this.lc()._updateCurSelInfo();
		assertEQ ( this.mm.walkLog, '_updateCurSelDefName,_updateCurSelEffectDesc,_updateCurSelExpendDesc,_updateCurSelBuildNeedTime' );
	};
	
	this.test__updateCurSelDefName = function(){
		this.mm.mock(this.lc(), '_getCurSelBuild', [0] );
		this.lc()._updateCurSelDefName();
		assertEQ ( TQ.getTextEx(this.lc().m_items.selName), res_citydef[0].name );
	};
	
	this.test__updateCurSelEffectDesc = function(){
		this.mm.mock(this.lc(), '_getCurSelBuild', [0] );
		this.lc()._updateCurSelEffectDesc();
		assertEQ ( TQ.getTextEx(this.lc().m_items.effDesc), res_citydef[0].desc );
	};
	
	this.test__updateCurSelExpendDesc = function(){
		this.g.getImgr().setMoney(10);
		res_citydef = [{money:10, food:20}];
		this.mm.mock(this.lc(), '_getCurSelBuild', [0] );
		this.lc()._updateCurSelExpendDesc();
		var expectStr = TQ.formatColorStr(rstr.comm.resname['money'] + C_TIP_SPACE + 10 + C_TIP_FOUR_SPACE, C_TIP_VALIDCOLOR)
			+ TQ.formatColorStr(rstr.comm.resname['food'] + C_TIP_SPACE + 20 + C_TIP_FOUR_SPACE, C_TIP_INVALIDCOLOR);
		assertEQ ( TQ.getTextEx(this.lc().m_items.expendDesc), expectStr );
	};
	
	this.test__updateCurSelBuildNeedTime = function(){
		res_citydef = [{ntime:30}];
		this.mm.mock(this.lc(), '_getInputNumLimit', [{min:1, max:2}]);
		this.mm.mock(this.lc(), '_getCurSelBuild', [0] );
		
		this.g.getImgr().addRoleAttr({id:ATTR.IN_B, val:100});
		this.g.getImgr().addRoleAttr({id:ATTR.IN_A, val:50});
		TestCaseCondition.setPreCond(null, { builds:[{resid: FIXID.WALLBUILD, level:50}] });
		
		this.lc()._updateCurSelBuildNeedTime();
		var expectTime = Math.floor(30/(1 + 150/100 + 50/20))*1;
		assertEQ ( TQ.getTextEx(this.lc().m_items.needTime), expectTime );
	};
	
	this.test__updateCapacity = function(){
		this.mm.mock(this.lc(), '_getHasCityDefs', [10] );
		this.mm.mock(this.lc(), '_getTotalCapacity', [20] );
		this.lc()._updateCapacity();
		assertEQ ( TQ.getTextEx(this.lc().m_items.capacityDesc), '10/20');
	};
	
	this.test__getCurSelBuild = function(){
		this.mm.mock(this.lc().m_items.selList, 'getCurSel', [2]);
		assertEQ ( this.lc()._getCurSelBuild(), 2 );
	};
	
	this.test__getResTags = function(){
		assertEQ ( this.lc()._getResTags(), ['money', 'food', 'wood', 'stone', 'iron'] );
	};
	
	this.test__getMyHasNumber = function(){
		this.g.getImgr().setMoney(1);
		this.g.getImgr().getCityRes().cres.food = 2;
		this.g.getImgr().getCityRes().cres.wood = 3;
		this.g.getImgr().getCityRes().cres.stone = 4;
		this.g.getImgr().getCityRes().cres.iron = 5;
		assertEQ ( this.lc()._getMyHasNumber('money'), 1 );
		assertEQ ( this.lc()._getMyHasNumber('food'), 2 );
		assertEQ ( this.lc()._getMyHasNumber('wood'), 3 );
		assertEQ ( this.lc()._getMyHasNumber('stone'), 4 );
		assertEQ ( this.lc()._getMyHasNumber('iron'), 5 );
	};
	
	this.test__getLeftCapacity = function(){
		this.mm.mock(this.lc(), '_getTotalCapacity', [2]);
		this.mm.mock(this.lc(), '_getHasCityDefs', [1]);
		assertEQ ( this.lc()._getLeftCapacity(), 1 );
	};
	
	this.test__getTotalCapacity = function(){
		//FIXID.JIAOLOUBUILD
		TestCaseCondition.setPreCond(null, { builds:[{resid: FIXID.WALLBUILD, level:1},{resid:FIXID.JIAOLOUBUILD, level:10},{resid:FIXID.JIAOLOUBUILD, level:20}] });
		var capacity = Math.floor(1*200*(1 + (10+20)/20));
		assertEQ ( this.lc()._getTotalCapacity(), capacity );
	};
	
	this.test__getHasCityDefs = function(){
		this.g.getImgr().getCityDefs().defs = [1,2,3,0,0];
		assertEQ ( this.lc()._getHasCityDefs(), 1+2+3+0+0 );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_updateBuildingInfos');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_updateBuildingInfos' );
	};
	
	this.test__onClickSpeed = function(){
		this.g.getImgr().getCityDefs().building = {id:150101, stoptime:11};
		var res = ItemResUtil.findItemres(150101);
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onClickSpeed();
		assertEQ ( this.mm.params['openDlg'], ['uselistitem', [RES_EFF.ACC_CITYDEF], {id:150101, stoptime:11, name:res.name, type:RES_TRG.SELF_ROLE} ] );
	};
	
	this.test__onClickCancel = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.lc()._onClickCancel();
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.cityDefDlg.tip.confirmCancel, MB_F_YESNO, {self:this.panel, caller:this.lc()._onCancelCallback}] );
	};
	
	this.test__onClickCancel_onCancelCallback = function(){
		this.lc()._onClickCancel(); // create _onCancelCallback function
		this.mm.mock(CityDefSender, 'sendCancelBuilding');
		this.lc()._onCancelCallback(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onCancelCallback(MB_IDYES);
		assertEQ ( this.mm.params['sendCancelBuilding'], [this.g] );
	};
	
	this.test__onClickSelList = function(){
		this.mm.mock(this.lc().m_items.inum, 'setVal');
		this.mm.mock(this.lc(), '_updateCurSelInfo');
		this.lc()._onClickSelList();
		assertEQ ( this.mm.walkLog, 'setVal,_updateCurSelInfo' );
		assertEQ ( this.mm.params['setVal'], [1] );
	};
	
	this.test__onNumberChange = function(){
		this.mm.mock(this.lc(), '_updateCurSelInfo');
		this.lc()._onNumberChange();
		assertEQ ( this.mm.walkLog, '_updateCurSelInfo' );
	};
	
	this.test__onClickDown = function(){
		this.g.getImgr().getCityDefs().defs = [0,2,0,0,0];
		this.mm.mock(UIM.getDlg('inputnum'), 'openDlg');
		this.mm.mock(UIM.getDlg('inputnum'), 'setCaller');
		
		var p_defIdx = 1;
		this.lc()._onClickDown(p_defIdx);
		assertEQ ( this.mm.walkLog, 'openDlg,setCaller' );
		assertEQ ( this.mm.params['openDlg'], [TQ.format(rstr.cityDefDlg.lbl.downInputNum, res_citydef[1].name, 2), 2] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onInputDownNumberOk}] );
	};
	
	this.test__onClickDown_onInputDownNumberOk = function(){
		var p_defIdx = 1;
		var p_number = 2;
		this.lc()._onClickDown(p_defIdx); // create _onInputDownNumberOk
		
		this.mm.mock(CityDefSender, 'sendDownCityDef');
		this.lc()._onInputDownNumberOk(p_number);
		assertEQ ( this.mm.params['sendDownCityDef'], [this.g, p_defIdx, p_number] );
	};
	
	this.test__onClickBuild = function(){
		this.g.getImgr().getCityDefs().building.id = 1;
		
		var r_getLeftCapacity = [0];
		var r_getCurSelExpendTip = ['no enough'];
		this.mm.mock(this.lc().m_items.inum, 'getVal', [2]);
		this.mm.mock(this.lc().m_items.inum, 'setVal' );
		this.mm.mock(this.lc(), '_getLeftCapacity', r_getLeftCapacity);
		this.mm.mock(this.lc(), '_getCurSelInvalidExpendTip', r_getCurSelExpendTip);
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(this.lc(), '_getCurSelBuild', [2]);
		this.mm.mock(CityDefSender, 'sendBuildCityDef');
		
		this.lc()._onClickBuild();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.cityDefDlg.tip.hasBuilding] );
		
		this.mm.clear();
		this.g.getImgr().getCityDefs().building.id = 0;
		this.lc()._onClickBuild();
		assertEQ ( this.mm.walkLog, 'getVal,_getLeftCapacity,msgBox' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughCapacity, MB_F_CLOSE, null] );
		
		this.mm.clear();
		r_getLeftCapacity[0] = 2;
		this.lc()._onClickBuild();
		assertEQ ( this.mm.walkLog, 'getVal,_getLeftCapacity,_getCurSelInvalidExpendTip,msgBox' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughRes + 'no enough', MB_F_CLOSE, null] );
		
		this.mm.clear();
		r_getCurSelExpendTip[0] = '';
		this.lc()._onClickBuild();
		assertEQ ( this.mm.walkLog, 'getVal,_getLeftCapacity,_getCurSelInvalidExpendTip,_getCurSelBuild,sendBuildCityDef,setVal' );
		assertEQ ( this.mm.params['sendBuildCityDef'], [this.g, 2, 2] );
		assertEQ ( this.mm.params['setVal'], [1] );
	};
	
	this.test__getCurSelInvalidExpendTip = function(){
		this.g.getImgr().setMoney(10);
		res_citydef = [{money:10, food:20}];
		this.mm.mock(this.lc(), '_getCurSelBuild', [0] );
		var expectStr = TQ.formatColorStr(rstr.comm.resname['food'] + C_TIP_SPACE + 20 + C_TIP_NEWLINE, C_TIP_INVALIDCOLOR);
		assertEQ ( this.lc()._getCurSelInvalidExpendTip(), expectStr );
	};
	
	this.test__traversalExpends = function(){
		this.mm.mock(this.lc(), '_getCurSelBuild', [0]);
		
		res_citydef = [{money:10, food:20}];
		
		var r_params = [];
		var callBackFun = function(tag, oneNeedNumber){
			r_params.push({tag:tag, number:oneNeedNumber});
		};
		
		this.lc()._traversalExpends(callBackFun);
		assertEQ ( r_params, [{tag:'money', number:10}, {tag:'food', number:20}] );
	};
});

var TestCaseCityDefForceTabHdr = TestCase.extern(function(){
	this.test_isNeedSingleHero = function(){
		assertEQ ( CityDefForceTabHdr.snew().isNeedSingleHero(), false );
	};
});

var TestCaseCityDefCityPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var dlg = CityDefDlg.snew(this.g);
		dlg.openDlg(0);
		this.items = dlg.lc().m_items.tabList.getTabItems(1);
		this.panel = CityDefCityPanel.snew(this.g, this.items);
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_setCallers');
		this.panel.init(this.g, this.items);
		assertEQ ( this.mm.walkLog, '_initParams,_setCallers' );
		assertEQ ( this.mm.params['_initParams'], [this.panel, this.g, this.items] );
	};
	
	this.test_open = function(){
		this.mm.mock(this.panel, 'update');
		this.panel.open();
		assertEQ ( this.mm.walkLog, 'update' );
		assertEQ ( this.lc().m_isShow, true );
	};
	
	this.test_hide = function(){
		this.panel.open();
		this.panel.hide();
		assertEQ ( this.lc().m_isShow, false );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateForcetabList');
		
		this.lc().m_isShow = false;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '_updateForcetabList' );
	};
	
	this.test__initParams = function(){
		this.mm.mock(CityDefForceTabHdr, 'snew', [{name:'forceTabHdr'}] );
		this.lc()._initParams(this.panel, this.g, this.items);
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_items, this.items );
		assertEQ ( this.lc().m_forceTabHdr, {name:'forceTabHdr'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.items] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.changeForcetab, 'setCaller');
		this.mm.mock(this.lc().m_items.assignSoldier, 'setCaller');
		this.mm.mock(this.lc().m_items.saveForcetab, 'setCaller');
		
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.panel, caller:this.lc()._onClickChangeForcetab}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.panel, caller:this.lc()._onClickAssignSoldier}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.panel, caller:this.lc()._onClickSaveForcetab}] );
		
		assertEQ ( this.lc().m_items.saveForcetab.getType(), BTN_TYPE.DELAY);
		assertEQ ( this.lc().m_items.saveForcetab.getDelay(), 300);
	};
	
	this.test__updateForcetabList = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'setLineup');
		this.mm.mock(this.lc().m_forceTabHdr, 'refresh');
		
		this.g.getImgr().getCityDefs().defarmy = {lineupId:10, heros:[1,2,3,4,5]};
		this.lc()._updateForcetabList();
		assertEQ ( this.mm.walkLog, 'setLineup,refresh' );
		assertEQ ( this.mm.params['setLineup'], [10, [1,2,3,4,5]] );
	};
	
	this.test__onClickChangeForcetab = function(){
		this.mm.mock(UIM.getDlg('assignheros'), 'setCaller');
		this.mm.mock(UIM.getDlg('assignheros'), 'openDlg');
		
		this.lc()._onClickChangeForcetab();
		assertEQ ( this.mm.walkLog, 'setCaller,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._assignHerosCallback}] );
		assertEQ ( this.mm.params['openDlg'], [{canEmpty:true}] );
	};
	
	this.test__onClickChangeForcetab_assignHerosCallback = function(){
		this.lc()._onClickChangeForcetab();// create _assignHerosCallback function
		
		this.mm.mock(this.lc().m_forceTabHdr, 'setLineup' );
		this.mm.mock(this.lc().m_forceTabHdr, 'refresh' );
		
		var p_lineupId = 1;
		var p_heros = [1,2,3,4,5];
		this.lc()._assignHerosCallback(p_lineupId, p_heros);
		assertEQ ( this.mm.walkLog, 'setLineup,refresh' );
		assertEQ ( this.mm.params['setLineup'], [p_lineupId, p_heros] );
	};
	
	this.test__onClickAssignSoldier = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onClickAssignSoldier();
		assertEQ ( this.mm.params['openDlg'], ['assignsoldiers'] );
	};
	
	this.test__onClickSaveForcetab = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getLineup', [1]);
		this.mm.mock(this.lc().m_forceTabHdr, 'getHeroIds', [[1,2,3,4,5]]);
		this.mm.mock(CityDefSender, 'sendSaveDefArmy');
		
		this.lc()._onClickSaveForcetab();
		assertEQ ( this.mm.walkLog, 'getLineup,getHeroIds,sendSaveDefArmy' );
		assertEQ ( this.mm.params['sendSaveDefArmy'], [this.g, 1, [1,2,3,4,5]] );
	};
});

var TestCaseFillSoldiersHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var dlg = CityDefDlg.snew(this.g);
		dlg.openDlg(0);
		this.items = dlg.lc().m_items.tabList.getTabItems(2);
		this.heros = [];
		this.hdr = FillSoldiersHdr.snew(this.g, this.items.forcetablist, TowerSender);
		this.hdr.setHeros(this.heros);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_list, this.items.forcetablist );
		assertEQ ( this.lc().m_msgSender, TowerSender );
	};
	
	this.test_setHeros = function(){
		this.hdr.setHeros(this.heros);
		assertEQ ( this.lc().m_heros, this.heros );
	};
	
	this.test_confirm = function(){
		var r_getChangedSoldier = [null];
		this.mm.mock(this.lc(), '_getChangedSoldier', r_getChangedSoldier);
		this.mm.mock(TowerSender, 'sendConfirmSoldiersAssign');
		var p_idx = 0;
		this.hdr.confirm(p_idx);
		assertEQ ( this.mm.walkLog, '_getChangedSoldier' );
		
		this.mm.clear();
		r_getChangedSoldier[0] = {id:1,resid:150001001,number:10};
		this.hdr.confirm(p_idx);
		assertEQ ( this.mm.walkLog, '_getChangedSoldier,sendConfirmSoldiersAssign' );
		assertEQ ( this.mm.params['sendConfirmSoldiersAssign'], [this.g, [{id:1,resid:150001001,number:10}]] );
	};
	
	this.test_confirmAll = function(){
		this.mm.mock(this.lc(), '_getChangedSoldier',  [{id:1,resid:150001001,number:10}]);
		this.mm.mock(TowerSender, 'sendConfirmSoldiersAssign');
		this.lc().m_heros = [{id:1},{id:2}];
		this.hdr.confirmAll();
		assertEQ ( this.mm.walkLog, '_getChangedSoldier,_getChangedSoldier,sendConfirmSoldiersAssign');
		assertEQ ( this.mm.params['sendConfirmSoldiersAssign'], [this.g, [{id:1,resid:150001001,number:10},{id:1,resid:150001001,number:10}]] );
	};
	
	this.test_fillAll = function(){
		this.lc().m_heros = [{id:0}
			,{id:1, soldier:{resid:150001001, number:1}, attrs:{}}
			,{id:2, soldier:{resid:150001002, number:20}, attrs:{}}
			,{id:3, soldier:{resid:150001002, number:100}, attrs:{}}
			,{id:4, soldier:{resid:150001002, number:15}, attrs:{}}
			];
		this.lc().m_heros[1].attrs[ATTR.CO] = {val:10};
		this.lc().m_heros[2].attrs[ATTR.CO] = {val:5};
		this.lc().m_heros[3].attrs[ATTR.CO] = {val:30};
		this.lc().m_heros[4].attrs[ATTR.CO] = {val:15};
		
		this.mm.mock(this.lc(), '_getCurSetSoldier', [{resid:150001002, number:0}] );
		this.mm.mock(TowerSender, 'sendConfirmSoldiersAssign');
		
		this.hdr.fillAll();
		assertEQ ( this.mm.params['sendConfirmSoldiersAssign'], [this.g, [{id:1,resid:150001002,number:10},{id:2,resid:150001002,number:5},{id:3,resid:150001002,number:30}]] );
	};
	
	this.test_clearAllSoldiers = function(){
		this.lc().m_heros = [{id:0}
			,{id:1, soldier:{resid:150001001, number:1}, attrs:{}}
			,{id:2, soldier:{resid:150001002, number:0}, attrs:{}}
			,{id:3, soldier:{resid:150001002, number:2}, attrs:{}}
			];
		this.mm.mock(TowerSender, 'sendConfirmSoldiersAssign');
		this.hdr.clearAllSoldiers();
		assertEQ ( this.mm.params['sendConfirmSoldiersAssign'], [this.g, [{id:1,resid:150001001,number:0},{id:3,resid:150001002,number:0}]] );
	};
	
	this.test__getChangedSoldier = function(){
		this.lc().m_heros = [{id:0}];
		
		var r_getCurSetSoldier = [null];
		this.mm.mock(TowerSender, 'sendConfirmSoldiersAssign');
		this.mm.mock(this.lc(), '_getCurSetSoldier', r_getCurSetSoldier);
		var p_idx = 0;
		assertEQ ( this.lc()._getChangedSoldier(p_idx), null );
		
		r_getCurSetSoldier[0] = {resid:150001001, number:10};
		
		this.mm.clear();
		this.lc().m_heros = [{id:1, soldier:{resid:150001001, number:10}}];
		assertEQ ( this.lc()._getChangedSoldier(p_idx), null );
		
		this.mm.clear();
		this.lc().m_heros = [{id:1, soldier:{resid:150001002, number:10}}];
		assertEQ ( this.lc()._getChangedSoldier(p_idx), {id:1,resid:150001001,number:10} );
		
		this.mm.clear();
		this.lc().m_heros = [{id:1, soldier:{resid:150001001, number:11}}];
		assertEQ ( this.lc()._getChangedSoldier(p_idx), {id:1,resid:150001001,number:10} );
	};
	
	this.test__isChanged = function(){
		var soldier1 = {resid:150001001, number:1};
		var soldier2 = {resid:150001001, number:1};
		assertEQ ( this.lc()._isChanged(soldier1, soldier2), false );
		
		var soldier2 = {resid:150001002, number:1};
		assertEQ ( this.lc()._isChanged(soldier1, soldier2), true );
		
		var soldier2 = {resid:150001001, number:2};
		assertEQ ( this.lc()._isChanged(soldier1, soldier2), true );
	};
	
	this.test__getCurSetSoldier = function(){
		var p_idx = 0;
		var listItem = this.lc().m_list.getItem(p_idx);
		this.mm.mock(listItem.exsubs.soldiertype, 'getCurSel', [0]);
		this.mm.mock(listItem.exsubs.soldiernumber, 'getVal', [10]);
		listItem.exsubs.userdata.soldiertypes = [150001001];
		assertEQ ( this.lc()._getCurSetSoldier(p_idx), {resid:150001001, number:10} );
		
		this.lc().m_list = null;
		this.lc().m_heros = [{id:1, soldier:{resid:150001001, number:10}}];
		assertEQ ( this.lc()._getCurSetSoldier(p_idx), {resid:150001001, number:10} );
	};
	
	this.test__getSoldierNumber = function(){
		this.lc().m_heros = [{id:0},{id:1,soldier:{resid:150001001,number:2}},{id:2,soldier:{resid:150001001,number:3}},{id:3,soldier:{resid:150001002,number:4}}];
		this.g.getImgr().getSoldiers().push({id:150001001,number:1});
		assertEQ ( this.lc()._getSoldierNumber(150001001), 1+2+3 );
	};
});

var TestCaseCityDefTowerPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.initTower();
		var dlg = CityDefDlg.snew(this.g);
		dlg.openDlg(0);
		this.items = dlg.lc().m_items.tabList.getTabItems(2);
		this.panel = CityDefTowerPanel.snew(this.g, this.items);
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_initDelayBtns');
		this.mm.mock(this.lc(), '_setCallers');
		this.panel.init(this.g, this.items);
		assertEQ ( this.mm.walkLog, '_initParams,_initDelayBtns,_setCallers' );
		assertEQ ( this.mm.params['_initParams'], [this.panel, this.g, this.items] );
	};
	
	this.test_open = function(){
		this.lc().m_isShow = false;
		this.mm.mock(this.panel, 'update');
		this.panel.open();
		assertEQ ( this.mm.walkLog, 'update' );
		assertEQ ( this.lc().m_isShow, true );
	};
	
	this.test_hide = function(){
		this.lc().m_isShow = true;
		this.panel.hide();
		assertEQ ( this.lc().m_isShow, false );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateForcetabList');
		this.mm.mock(this.lc(), '_updateTowerAttrs');
		this.mm.mock(this.lc(), '_updateFreeSoldierList');
		
		this.lc().m_isShow = false;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.panel.update();
		assertEQ ( this.mm.walkLog, '_updateForcetabList,_updateTowerAttrs,_updateFreeSoldierList' );
	};
	
	this.test__initParams = function(){
		this.mm.mock(AssignSoldiersHdr, 'snew', [{name:'hdr'}]);
		this.mm.mock(FillSoldiersHdr, 'snew', [{name:'fillhdr'}]);
		this.lc()._initParams(this.panel, this.g, this.items);
		assertEQ ( this.lc().m_this, this.panel);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_items, this.items);
		assertEQ ( this.lc().m_assignSoldierHdr, {name:'hdr'});
		assertEQ ( this.lc().m_fillSoliderHdr, {name:'fillhdr'});
		assertEQ ( this.mm.params['snew.0'], [this.g, this.items.forcetablist] );
		assertEQ ( this.mm.params['snew.1'], [this.g, this.lc().m_items.forcetablist, TowerSender] );
	};
	
	this.test__initDelayBtns = function(){
		this.mm.mock(this.lc().m_items.clearAll, 'setType');
		this.mm.mock(this.lc().m_items.clearAll, 'setDelay');
		this.mm.mock(this.lc().m_items.fillAll, 'setType');
		this.mm.mock(this.lc().m_items.fillAll, 'setDelay');
		this.lc()._initDelayBtns();
		assertEQ ( this.mm.walkLog, 'setType,setDelay,setType,setDelay' );
		assertEQ ( this.mm.params['setType.0'], [BTN_TYPE.DELAY] );
		assertEQ ( this.mm.params['setDelay.0'], [this.lc().C_BTN_DELAY_MS] );
		assertEQ ( this.mm.params['setType.1'], [BTN_TYPE.DELAY] );
		assertEQ ( this.mm.params['setDelay.1'], [this.lc().C_BTN_DELAY_MS] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.clearAll, 'setCaller');
		this.mm.mock(this.lc().m_items.fillAll, 'setCaller');
		this.mm.mock(this.lc().m_items.confirmAll, 'setCaller');
		
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.panel, caller:this.lc()._onClickClearAll}]);
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.panel, caller:this.lc()._onClickFillAll}]);
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.panel, caller:this.lc()._onClickConfirmAll}]);
	};
	
	this.test__updateForcetabList = function(){
		this.mm.mock(this.lc(), '_disableAllForcetabListGrids');
		this.mm.mock(this.lc(), '_enableForcetabListGrids');
		this.mm.mock(this.lc(), '_createTowerHeros');
		this.mm.mock(this.lc(), '_setForcetabListItems');
		this.mm.mock(this.lc(), '_setForcetabListCaller');
		this.lc()._updateForcetabList();
		assertEQ ( this.mm.walkLog, '_disableAllForcetabListGrids,_enableForcetabListGrids,_createTowerHeros,_setForcetabListItems,_setForcetabListCaller' );
	};
	
	this.test__disableAllForcetabListGrids = function(){
		this.mm.mock(this.lc(), '_disableForcetabListGrid');
		this.lc()._disableAllForcetabListGrids();
		assertEQ ( this.mm.params['_disableForcetabListGrid.0'], [0] );
		assertEQ ( this.mm.params['_disableForcetabListGrid.8'], [8] );
	};
	
	this.test__enableForcetabListGrids = function(){
		this.mm.mock(this.lc(), '_enableForcetabListGrid');
		this.lc()._updateForcetabList();
		assertEQ ( this.mm.walkLog, '_enableForcetabListGrid,_enableForcetabListGrid,_enableForcetabListGrid,_enableForcetabListGrid,_enableForcetabListGrid' );
		var tower = this.g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		assertEQ ( this.mm.params['_enableForcetabListGrid.0'], [lineupRes.grids[0] ] );
		assertEQ ( this.mm.params['_enableForcetabListGrid.4'], [lineupRes.grids[4] ] );
	};
	
	this.initTower = function(){
		var tower = this.g.getImgr().getTower();
		tower.lineupId = 180004;
		tower.soldiers = [{resid:150001001,number:10}
			,{resid:150001002,number:11}
			,{resid:150001003,number:12}
			,{resid:150001004,number:13}
			,{resid:150001005,number:14}];
	};
	
	this.test__createTowerHeros = function(){
		this.initTower();
		this.mm.mock( this.lc(), '_getHeroRes', [{maxnum:1}] );
		this.mm.mock( this.lc().m_fillSoliderHdr, 'setHeros' );
		this.mm.mock(this.lc().m_assignSoldierHdr, 'setHeros' );
		this.lc()._createTowerHeros();
		
		var tower = this.g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		assertEQ ( this.lc().m_heros[0], {id:1, soldier:tower.soldiers[0], attrs:{'34':{val:1}}} );
		assertEQ ( this.lc().m_heros[1], {id:2, soldier:tower.soldiers[1], attrs:{'34':{val:1}}} );
		assertEQ ( this.lc().m_heros[2], {id:3, soldier:tower.soldiers[2], attrs:{'34':{val:1}}} );
		assertEQ ( this.lc().m_heros[3], {id:4, soldier:tower.soldiers[3], attrs:{'34':{val:1}}} );
		assertEQ ( this.lc().m_heros[4], {id:0, soldier:{resid:0,number:0}} );
		assertEQ ( this.lc().m_heros[5], {id:5, soldier:tower.soldiers[4], attrs:{'34':{val:1}}} );
		assertEQ ( this.lc().m_heros[6], {id:0, soldier:{resid:0,number:0}} );
		assertEQ ( this.lc().m_heros[7], {id:0, soldier:{resid:0,number:0}} );
		assertEQ ( this.lc().m_heros[8], {id:0, soldier:{resid:0,number:0}} );
		assertEQ ( this.mm.params['setHeros.0'], [this.lc().m_heros] );
		assertEQ ( this.mm.params['setHeros.1'], [this.lc().m_heros] );
	};
	
	this.test__setForcetabListItems = function(){
		this.initTower();
		this.lc()._createTowerHeros();
		this.mm.mock(this.lc().m_assignSoldierHdr, 'fillSoldierDropType');
		this.lc()._updateForcetabList();
		assertStrRepeatCount ( this.mm.walkLog, 'fillSoldierDropType', 9 );
		
		assertEQ ( this.mm.params['fillSoldierDropType.0'], [this.lc().m_items.forcetablist.getItem(0), this.lc().m_heros[0].soldier] );
		assertEQ ( this.mm.params['fillSoldierDropType.8'], [this.lc().m_items.forcetablist.getItem(8), this.lc().m_heros[8].soldier] );
	};
	
	this.test__setForcetabListCaller = function(){
		this.initTower();
		this.lc()._createTowerHeros();
		
		this.mm.mock(this.lc().m_assignSoldierHdr, 'setCallers' );
		this.lc()._setForcetabListCaller();
		assertEQ ( this.mm.params['setCallers'], [{self:this.panel, caller:this.lc()._onClickConfirmBtn}] );
	};
	
	this.test__disableForcetabListGrid = function(){
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(IMG, 'setBKImage');
		var p_itemIdx = 0;
		this.lc()._disableForcetabListGrid(p_itemIdx);
		assertEQ ( this.mm.walkLog, 'setCSS,setBKImage' );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.forcetablist.getItem(p_itemIdx).exsubs.container, 'display', 'none' ] );
		assertEQ ( this.mm.params['setBKImage'], [this.lc().m_items.forcetablist.getItem(p_itemIdx).exsubs.bak, IMG.makeImg('expedition/forcetab/disablebak.gif') ] );
	};
	
	this.test__enableForcetabListGrid = function(){
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(IMG, 'setBKImage');
		var p_itemIdx = 0;
		this.lc()._enableForcetabListGrid(p_itemIdx);
		assertEQ ( this.mm.walkLog, 'setCSS,setBKImage' );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.forcetablist.getItem(p_itemIdx).exsubs.container, 'display', 'block' ] );
		assertEQ ( this.mm.params['setBKImage'], [this.lc().m_items.forcetablist.getItem(p_itemIdx).exsubs.bak, IMG.makeImg('expedition/forcetab/emptybak.gif') ] );
	};
	
	this.test__updateTowerAttrs = function(){
		var r_getHeroRes = [{str:1,agile:2,phy:3,maxnum:4}];
		this.mm.mock(this.lc(), '_getHeroRes', r_getHeroRes);
		this.lc()._updateTowerAttrs();
		assertEQ ( TQ.getTextEx(this.lc().m_items.strength), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.agile), 2 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.physical), 3 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.command), 4 );
		
		r_getHeroRes[0] = null;
		this.lc()._updateTowerAttrs();
	};
	
	this.test__updateFreeSoldierList = function(){
		this.mm.mock(UpdateFreeSoldierList, 'setListItems');
		this.lc()._updateFreeSoldierList();
		assertEQ ( this.mm.params['setListItems'], [this.g, this.lc().m_items.freeSoldierList] );
	};
	
	this.test__onClickConfirmBtn = function(){
		this.mm.mock(this.lc().m_fillSoliderHdr, 'confirm');
		var p_heroIdx = 1;
		this.lc()._onClickConfirmBtn(p_heroIdx);
		assertEQ ( this.mm.params['confirm'], [p_heroIdx] );
	};
	
	this.test__onClickClearAll = function(){
		this.mm.mock(this.lc().m_fillSoliderHdr, 'clearAllSoldiers');
		this.lc()._onClickClearAll();
		assertEQ ( this.mm.walkLog, 'clearAllSoldiers');
	};
	
	this.test__onClickConfirmAll = function(){
		this.mm.mock(this.lc().m_fillSoliderHdr, 'confirmAll');
		this.lc()._onClickConfirmAll();
		assertEQ ( this.mm.walkLog, 'confirmAll');
	};
	
	this.test__onClickFillAll = function(){
		this.mm.mock(this.lc().m_fillSoliderHdr, 'fillAll');
		this.lc()._onClickFillAll();
		assertEQ ( this.mm.walkLog, 'fillAll');
	};
	
	this.test__getHeroRes = function(){
		assertEQ ( this.lc()._getHeroRes(), null );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.TOWERBUILD, level:1}] });
		var buildLevelRes = ItemResUtil.findBuildLevelres(FIXID.TOWERBUILD, 1);
		var heroRes = ItemResUtil.findItemres(buildLevelRes.fieldheroid);
		assertEQ ( this.lc()._getHeroRes(), heroRes );
	};
});

tqCityDefDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseCityDefDlg, 'TestCaseCityDefDlg');
	suite.addTestCase(TestCaseCityDefCreatePanel, 'TestCaseCityDefCreatePanel');
	suite.addTestCase(TestCaseCityDefForceTabHdr, 'TestCaseCityDefForceTabHdr');
	suite.addTestCase(TestCaseCityDefCityPanel, 'TestCaseCityDefCityPanel');
	suite.addTestCase(TestCaseFillSoldiersHdr, 'TestCaseFillSoldiersHdr');
	suite.addTestCase(TestCaseCityDefTowerPanel, 'TestCaseCityDefTowerPanel');
};
