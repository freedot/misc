/*******************************************************************************/
requireEx('./handler/tqCommSelBuildDlg.js', [
	{
		start:'//CityBuildUtil-unittest-start'
		,end:'//CityBuildUtil-unittest-end'
		,items:[
			'm_g'
			,'m_cityBuildIds'
		]
	}
	,{
		start:'//BaseCitySelBuildDlg-unittest-start'
		,end:'//BaseCitySelBuildDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_cfg'
			,'m_caller'
			,'m_cityId'
			,'_initIds'
			,'_initParam'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setListItemCount'
			,'_setListItemsPos'
			,'_setListItemsName'
			,'_setCallers'
			,'_initTooltip'
			,'_onClickItem'
			,'_onCloseDlg'
			,'_onDlgEvent'
			,'_onGetTooltip'
			,'_onUpdate'
			,'_updateInfo'
			,'_isShow'
			,'_setListItem'
			,'_isFullBuildCount'
			,'_setListItemIcon'
			,'_setListItemBuildedCnt'
			,'_setListItemBuildedFlag'
		]
	}
]);
	
TestCaseCityBuildUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isCanBuildInCity = function(){
		CityBuildUtil.lc().m_cityBuildIds[CITY_TYPE.MAIN] = [110002];
		CityBuildUtil.lc().m_cityBuildIds[CITY_TYPE.SUBRES] = [110013];
		CityBuildUtil.lc().m_cityBuildIds[CITY_TYPE.SUBARMY] = [110014];
		TQ.dictCopy ( this.g.getImgr().getCityTypes(), [1,2,3,2] );
		
		var p_cityId = 0;
		var p_buildResId = 110002;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), false );
		
		p_cityId = 1;
		p_buildResId = 110002;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), true );
		
		p_buildResId = 110003;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), false );
		
		p_cityId = 4;
		p_buildResId = 110002;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), false );
		
		p_cityId = 4;
		p_buildResId = 110013;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), true );
		
		p_cityId = 5;
		p_buildResId = 110013;
		assertEQ ( CityBuildUtil.isCanBuildInCity(p_cityId, p_buildResId), false );
	};
});
	
TestCaseBaseCitySelBuildDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var THIS = this;
		this.cfg = {ids:[{resid:110002, pos:{x:1, y:2}}, {resid:110003, pos:{x:3, y:4}}]
			, backImgClass:'backImgClass'};
		this.dlg = BaseCitySelBuildDlg.extern(function(){
			this.initCfg = function(cfg){
				cfg.ids = THIS.cfg.ids;
				cfg.backImgClass = THIS.cfg.backImgClass;
			};
		}).snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initIds' );
		this.dlg.init ( this.g );
		
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.lc().m_cfg, this.cfg );
		assertEQ ( this.mm.walkLog, '_initIds' );
	};
	
	this.test_setCaller = function(){
		var p_caller = {self:this, caller:this.test_setCaller };
		this.dlg.setCaller(p_caller);
		assertEQ ( this.lc().m_caller, p_caller );
	};
	
	this.test_openDlg = function(){
		this.mm.mock( this.lc(), '_initParam' );
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_openDlg' );
		this.mm.mock( this.lc(), '_initInfo' );
		
		var p_cityId = 1;
		this.dlg.openDlg(p_cityId);
		assertEQ ( this.mm.walkLog, '_initParam,_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initParam'], [p_cityId] );
	};
	
	this.test__initIds = function(){
		this.mm.mock( ItemResUtil, 'findItemres', [{maxCount:1}] );
		this.lc()._initIds();
		assertEQ ( this.cfg.ids[0], {resid:110002, pos:{x:1, y:2}, id:0, level:0, itemres:{maxCount:1}, maxcnt:1} );
		assertEQ ( this.cfg.ids[1], {resid:110003, pos:{x:3, y:4}, id:0, level:0, itemres:{maxCount:1}, maxcnt:1} );
	};
	
	this.test__initParam = function(){
		var p_cityId = 1;
		this.lc()._initParam(p_cityId);
		assertEQ ( this.lc().m_cityId, p_cityId );
	};
	
	this.test__initDlg = function(){
		this.mm.mock( this.lc(), '_createDlg' );
		this.mm.mock( this.lc(), '_setListItemCount' );
		this.mm.mock( this.lc(), '_setListItemsPos' );
		this.mm.mock( this.lc(), '_setListItemsName' );
		this.mm.mock( this.lc(), '_setCallers' );
		this.mm.mock( this.lc(), '_initTooltip' );
		
		this.lc().m_dlg =  {name:'dlg'};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setListItemCount,_setListItemsPos,_setListItemsName,_setCallers,_initTooltip' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = {name:'dlg'};
		this.mm.mock( Dialog, 'snew', [r_dlg]);
		this.mm.mock( this.g.getGUI(), 'initDlg');
		this.mm.mock( TQ, 'setClass');
		
		this.lc().m_items.backImg = MockDom.snew('div');
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,setClass' );
		assertEQ ( this.lc().m_dlg, r_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:true, title:'', pos:{x:'center', y:50}, uiback:uiback.dlg.noborder}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.selCityBuildDlg, this.lc().m_items] );
		assertEQ ( this.mm.params['setClass'], [this.lc().m_items.backImg, 'backImgClass'] );
	};
	
	this.test__setListItemCount = function(){
		this.lc()._createDlg();
		this.lc().m_items.list.setItemCount(0);
		this.lc()._setListItemCount();
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
	};
	
	this.test__setListItemsPos = function(){
		this.lc()._createDlg();
		this.lc()._setListItemCount();
		
		this.mm.mock ( TQ, 'setCSS' );
		this.mm.mock ( TQ, 'setDomPos' );
		
		this.lc()._setListItemsPos();
		assertEQ ( this.mm.walkLog, 'setCSS,setCSS,setDomPos,setCSS,setCSS,setDomPos' );
		
		assertEQ ( this.mm.params['setCSS.0'], [this.lc().m_items.list.getItem(0).item, 'float', 'none'] );
		assertEQ ( this.mm.params['setCSS.1'], [this.lc().m_items.list.getItem(0).item, 'position', 'absolute'] );
		assertEQ ( this.mm.params['setDomPos.0'], [this.lc().m_items.list.getItem(0).item, 1, 2] );
		assertEQ ( this.mm.params['setCSS.2'], [this.lc().m_items.list.getItem(1).item, 'float', 'none'] );
		assertEQ ( this.mm.params['setCSS.3'], [this.lc().m_items.list.getItem(1).item, 'position', 'absolute'] );
		assertEQ ( this.mm.params['setDomPos.1'], [this.lc().m_items.list.getItem(1).item, 3, 4] );
	};
	
	this.test__setListItemsName = function(){
		this.lc()._createDlg();
		this.lc()._setListItemCount();
		
		this.mm.mock( TQ, 'setTextEx');
		this.lc()._setListItemsName();
		assertEQ ( this.mm.walkLog, 'setTextEx,setTextEx' );
		assertEQ ( this.mm.params['setTextEx.0'], [ this.lc().m_items.list.getItem(0).exsubs.name, ItemResUtil.findItemres(110002).name] );
		assertEQ ( this.mm.params['setTextEx.1'], [ this.lc().m_items.list.getItem(1).exsubs.name, ItemResUtil.findItemres(110003).name] );
	};
	
	this.test__setCallers = function(){
		this.lc()._createDlg();
		
		this.mm.mock( this.lc().m_items.closeBtn, 'setCaller');
		this.mm.mock( this.lc().m_items.list, 'setCaller');
		this.mm.mock( this.lc().m_dlg, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onCloseDlg}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickItem}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
	};
	
	this.test__initTooltip = function(){
		this.lc()._createDlg();
		this.lc()._setListItemCount();
		
		this.mm.mock ( TTIP, 'setCallerData' );
		this.lc()._initTooltip();
		assertEQ ( this.mm.walkLog, 'setCallerData,setCallerData' );
		assertEQ ( this.mm.params['setCallerData.0'], [this.lc().m_items.list.getItem(0).exsubs.tooltips['$item'], {self:this.dlg, caller:this.lc()._onGetTooltip},{idx:0}] );
		assertEQ ( this.mm.params['setCallerData.1'], [this.lc().m_items.list.getItem(1).exsubs.tooltips['$item'], {self:this.dlg, caller:this.lc()._onGetTooltip},{idx:1}] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		
		this.mm.mock(this.lc().m_dlg, 'show' );
		this.mm.mock(this.g, 'regUpdater' );
		
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'show,regUpdater' );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 3000] );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_updateInfo' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_updateInfo' );
	};
	
	this.test__updateInfo = function(){
		this.lc()._createDlg();
		this.lc()._setListItemCount();
		
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_setListItem' );
		
		this.lc()._updateInfo();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateInfo();
		assertEQ ( this.mm.walkLog, '_isShow,_setListItem,_setListItem' );
		assertEQ ( this.mm.params['_setListItem.0'], [this.lc().m_items.list.getItem(0), this.cfg.ids[0]] );
		assertEQ ( this.mm.params['_setListItem.1'], [this.lc().m_items.list.getItem(1), this.cfg.ids[1]] );
	};
	
	this.test__isShow = function(){
		this.lc()._createDlg();
		
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true);
		
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false);
		
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false);
	};
	
	this.test__setListItem = function(){
		this.mm.mock(this.lc(), '_setListItemIcon');
		this.mm.mock(this.lc(), '_setListItemBuildedCnt');
		this.mm.mock(this.lc(), '_setListItemBuildedFlag');
		
		var p_item = {name:'item'};
		var p_resItem = {name:'resItem'};
		this.lc()._setListItem(p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_setListItemIcon,_setListItemBuildedCnt,_setListItemBuildedFlag' );
		assertEQ ( this.mm.params['_setListItemIcon'], [p_item, p_resItem] );
		assertEQ ( this.mm.params['_setListItemBuildedCnt'], [p_item, p_resItem] );
		assertEQ ( this.mm.params['_setListItemBuildedFlag'], [p_item, p_resItem] );
	};
	
	this.test__setListItemIcon = function(){
		var r_isFullBuildCount = [false];
		var r_isCanBuildUpgrade = [false];
		this.mm.mock(this.lc(), '_isFullBuildCount', r_isFullBuildCount);
		this.mm.mock(TIPM, 'isCanBuildUpgrade', r_isCanBuildUpgrade);
		this.mm.mock(IMG, 'setBKImage');
		
		var p_item = {exsubs:{icon:MockDom.snew('div')}};
		var p_resItem = {itemres:{bigpic:101}};
		this.lc()._setListItemIcon(p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.icon, IMG.makeBigImg(101, 'd') ] );
		assertEQ ( this.mm.params['_isFullBuildCount'], [p_resItem] );
		assertEQ ( this.mm.params['isCanBuildUpgrade'], [this.lc().m_cityId, p_resItem] );
		
		this.mm.clear();
		r_isFullBuildCount[0] = true;
		this.lc()._setListItemIcon(p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.icon, IMG.makeBigImg(101, null) ] );
		
		this.mm.clear();
		r_isFullBuildCount[0] = false;
		r_isCanBuildUpgrade[0] = true;
		this.lc()._setListItemIcon(p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.icon, IMG.makeBigImg(101, null) ] );
		
		this.mm.clear();
		r_isFullBuildCount[0] = true;
		r_isCanBuildUpgrade[0] = true;
		this.lc()._setListItemIcon(p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.icon, IMG.makeBigImg(101, null) ] );
	};
	
	this.test__setListItemBuildedCnt = function(){
		var r_isFullBuildCount = [true];
		this.mm.mock(this.lc(), '_isFullBuildCount', r_isFullBuildCount);
		this.mm.mock(this.g.getImgr(), 'getBuildCntByResid', [1]);
		this.mm.mock(TQ, 'setText');
		this.mm.mock(TQ, 'setCSS');
		
		var p_item = {exsubs:{cnt:MockDom.snew('div'), flag:MockDom.snew('div')}};
		var p_resItem = {resid:110001};
		this.lc()._setListItemBuildedCnt(p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_isFullBuildCount' );
		assertEQ ( this.mm.params['_isFullBuildCount'], [p_resItem] );
		
		this.mm.clear();
		r_isFullBuildCount[0] = false;
		this.lc()._setListItemBuildedCnt(p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_isFullBuildCount,setCSS,setCSS,getBuildCntByResid,setText' );
		assertEQ ( this.mm.params['setCSS.0'], [p_item.exsubs.cnt, 'display', 'block'] );
		assertEQ ( this.mm.params['setCSS.1'], [p_item.exsubs.flag, 'display', 'none'] );
		assertEQ ( this.mm.params['getBuildCntByResid'], [this.lc().m_cityId, 110001] );
		assertEQ ( this.mm.params['setText'], [p_item.exsubs.cnt, 1] );
	};
	
	this.test__setListItemBuildedFlag = function(){
		var r_isFullBuildCount = [false];
		this.mm.mock(this.lc(), '_isFullBuildCount', r_isFullBuildCount);
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(IMG, 'setBKImage');
		
		var p_item = {exsubs:{cnt:MockDom.snew('div'), flag:MockDom.snew('div')}};
		var p_resItem = {maxcnt:1};
		this.lc()._setListItemBuildedFlag(p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_isFullBuildCount' );
		
		this.mm.clear();
		r_isFullBuildCount[0] = true;
		this.lc()._setListItemBuildedFlag(p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_isFullBuildCount,setCSS,setCSS,setBKImage' );
		assertEQ ( this.mm.params['setCSS.0'], [p_item.exsubs.flag, 'display', 'block'] );
		assertEQ ( this.mm.params['setCSS.1'], [p_item.exsubs.cnt, 'display', 'none'] );
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.flag, IMG.getBuildedFlag()] );
		
		this.mm.clear();
		p_resItem.maxcnt = 2;
		this.lc()._setListItemBuildedFlag(p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.flag, IMG.getFullBuildedFlag()] );
	};
	
	this.test__onCloseDlg = function(){
		this.lc()._createDlg();
		this.lc().m_dlg.show();
		this.lc()._onCloseDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE + 1);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_updateInfo' );
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_updateInfo' );
	};
	
	this.test__onClickItem = function(){
		this.lc()._createDlg();
		
		this.lc().m_cityId = 1;
		
		var r_isFullBuildCount = [true];
		var r_getSimpleBuildUpTip = ['notenough'];
		this.mm.mock(this.lc(), '_updateInfo');
		this.mm.mock(this.lc(), '_isFullBuildCount', r_isFullBuildCount);
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(TIPM, 'getSimpleBuildUpTip', r_getSimpleBuildUpTip);
		
		var p_idx = 0;
		this.lc()._onClickItem( null, p_idx );
		var item = this.cfg.ids[0];
		assertEQ ( this.mm.walkLog, '_updateInfo,_isFullBuildCount,msgBox' );
		assertEQ ( this.mm.params['_isFullBuildCount'], [ item ] );
		assertEQ ( this.mm.params['msgBox'], [ rstr.comm.msgts, TQ.format(rstr.inbuild.sel.fullbuilded, item.itemres.name, item.maxcnt), MB_F_CLOSE, null ] );
		
		this.mm.clear();
		r_isFullBuildCount[0] = false;
		this.lc()._onClickItem( null, p_idx );
		assertEQ ( this.mm.walkLog, '_updateInfo,_isFullBuildCount,getSimpleBuildUpTip,msgBox' );
		assertEQ ( this.mm.params['getSimpleBuildUpTip'], [ this.lc().m_cityId, this.cfg.ids[0]] );
		assertEQ ( this.mm.params['msgBox'], [ rstr.comm.msgts, 'notenough', MB_F_CLOSE, null ] );
		
		this.mm.clear();
		this.lc().m_caller = null;
		r_getSimpleBuildUpTip[0] = '';
		this.lc()._onClickItem( null, p_idx );
		assertEQ ( this.mm.walkLog, '_updateInfo,_isFullBuildCount,getSimpleBuildUpTip' );
		
		this.mm.clear();
		this.lc().m_dlg.show();
		var r_resid = 0;
		var r_this = null
		this.lc().m_caller = {self:this, caller:function(resid){r_this = this; r_resid = resid; }};
		this.lc()._onClickItem( null, p_idx );
		assertEQ ( this.mm.walkLog, '_updateInfo,_isFullBuildCount,getSimpleBuildUpTip' );
		assertEQ ( r_this, this );
		assertEQ ( r_resid, this.cfg.ids[0].resid );
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__onGetTooltip = function(){
		var p_data = {idx:0};
		this.lc().m_cityId = 1;
		
		var r_isFullBuildCount = [true];
		this.mm.mock(this.lc(), '_isFullBuildCount', r_isFullBuildCount);
		this.mm.mock(TIPM, 'getBuildDesc', ['item desc']);
		
		var expectStr = TQ.format(rstr.inbuild.sel.fullbuilded, this.cfg.ids[0].itemres.name, this.cfg.ids[0].maxcnt);
		assertEQ ( this.lc()._onGetTooltip(p_data), expectStr );
		assertEQ ( this.mm.params['_isFullBuildCount'], [ this.cfg.ids[0] ] );
		
		r_isFullBuildCount[0] = false;
		assertEQ ( this.lc()._onGetTooltip(p_data), 'item desc' );
		assertEQ ( this.mm.params['getBuildDesc'], [1, 'firstup', this.cfg.ids[0] ] );
	};
	
	this.test__isFullBuildCount = function(){
		this.lc().m_cityId = 1;
		
		this.mm.mock(this.g.getImgr(), 'getBuildCntByResid', [10] );
		
		var p_item = {resid:110001, maxcnt:11};
		assertEQ ( this.lc()._isFullBuildCount(p_item), false );
		assertEQ ( this.mm.params['getBuildCntByResid'], [1, 110001] );
		
		p_item.maxcnt = 10;
		assertEQ ( this.lc()._isFullBuildCount(p_item), true );
	};
});

TestCaseMainCitySelBuildDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = MainCitySelBuildDlg.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.dlg.lc().m_cfg.ids.length, 10 );
		assertEQ ( this.dlg.lc().m_cfg.backImgClass, 'mainback' );
	};
});

TestCaseResCitySelBuildDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ResCitySelBuildDlg.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.dlg.lc().m_cfg.backImgClass, 'ressubback' );
	};
});

TestCaseMilitaryCitySelBuildDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = MilitaryCitySelBuildDlg.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.dlg.lc().m_cfg.backImgClass, 'militarysubback' );
	};
});

tqCommSelBuildDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseCityBuildUtil, 'TestCaseCityBuildUtil');
	suite.addTestCase(TestCaseBaseCitySelBuildDlg, 'TestCaseBaseCitySelBuildDlg');
	suite.addTestCase(TestCaseMainCitySelBuildDlg, 'TestCaseMainCitySelBuildDlg');
	suite.addTestCase(TestCaseResCitySelBuildDlg, 'TestCaseResCitySelBuildDlg');
	suite.addTestCase(TestCaseMilitaryCitySelBuildDlg, 'TestCaseMilitaryCitySelBuildDlg');
};