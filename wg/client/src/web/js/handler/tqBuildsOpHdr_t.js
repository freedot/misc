/*******************************************************************************/
requireEx('./handler/tqBuildsOpHdr.js', [
	{
		start:'//BuildsOpHdr-unittest-start'
		,end:'//BuildsOpHdr-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_buildBlocks'
			,'m_canNotDowns'
			,'m_canNotDownsWhenOneLevel'
			,'m_buildOpidMaps'
			,'m_menuCfgs'
			,'m_opMenu'
			,'m_opShows'
			,'_allocMenu'
			,'_onOpCommand'
			,'_onGetTooltip'
			,'_setMenuCommItemsShowFlag'
			,'_setMenuSpecItemsShowFlag'
			,'_setMenuWSYItemsShowFlag'
			,'_resetOpMenuItemsShowByFlag'
			,'_getMenuId'
			,'_getCanNotDownTip'
			,'_getTipTagByNameId'
			,'_onBuildingInfo'
			,'_onSoldier'
			,'_onCulture'
			,'_onRecruitHero'
			,'_onOpenArmOpDlg'
			,'_onUpgradeBuild'
			,'_onDownBuild'
			,'_onDownCallback'
			,'_onSpeedBuilding'
			,'_onCancelBuilding'
			,'_onCancelCallback'
			,'_onHeroSteel'
			,'_onCityDef'
			,'_onHeroTreat'
			,'_onResProtect'
			,'_onExchangeHeroExp'
			,'_onChangeSubCity'
			,'_onJoinAlliance'
			,'_onSeeReinforcement'
			,'_onTradingArea'
		]
	}
]);

TestCaseBuildsOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.item = {};
		var m_this = this;
		var p_curBlock = new function(){this.getItem = function(){
				return m_this.item;
			};};
		var p_buildBlocks = new function(){this.getCurBlock=function(){
				return p_curBlock;
			};};
		this.hdr = BuildsOpHdr.snew(this.g, p_buildBlocks);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var p_buildBlocks = {};
		var hdr = BuildsOpHdr.snew(this.g, p_buildBlocks);
		assertEQ ( hdr.lc().m_g, this.g );
		assertEQ ( hdr.lc().m_this, hdr );
		assertEQ ( hdr.lc().m_buildBlocks, p_buildBlocks );
		assertEQ ( hdr.lc().m_canNotDowns, {'110001':true,'110007':true} );
		assertEQ ( hdr.lc().m_canNotDownsWhenOneLevel, {'110013':true,'110018':true} );
		assertEQ ( hdr.lc().m_menuCfgs.length, 23 );
	};
	
	this.test_createOpMenu = function(){
		var r_menu = new Menu(this.g,{width:100});
		var r_menuItem = r_menu.addMenuItem({id:10, icon:null, text:'txt'});
		var r_tipId = 1;
		
		this.mm.mock ( this.lc(), '_allocMenu', [r_menu] );
		this.mm.mock ( r_menu, 'setDisableCanClick' );
		this.mm.mock ( r_menu, 'setCaller' );
		this.mm.mock ( r_menu, 'addMenuItem', [r_menuItem] );
		this.mm.mock ( TTIP, 'addTip', [r_tipId]);
		this.mm.mock ( TTIP, 'setCallerData' );
		
		this.lc().m_menuCfgs = [];
		this.hdr.createOpMenu();
		assertEQ ( this.mm.walkLog, '_allocMenu,setDisableCanClick,setCaller' );
		assertEQ ( this.mm.params['setDisableCanClick'], [true]);
		assertEQ ( this.mm.params['setCaller'], [{self:this.hdr, caller:this.lc()._onOpCommand}]);
		
		this.mm.clear();
		this.lc().m_menuCfgs = [{id:'SOLDIER', icon:'101.gif', text:'soldier'}];
		this.hdr.createOpMenu();
		assertEQ ( this.mm.walkLog, '_allocMenu,setDisableCanClick,setCaller,addMenuItem' );
		assertEQ ( this.mm.params['addMenuItem'], [{id:0, icon:'101.gif', text:'soldier'}]);
		
		this.mm.clear();
		this.lc().m_menuCfgs = [{id:'UPGRADE', icon:'101.gif', text:'up'}];
		this.hdr.createOpMenu();
		assertEQ ( this.mm.walkLog, '_allocMenu,setDisableCanClick,setCaller,addMenuItem,addTip,setCallerData' );
		assertEQ ( this.mm.params['addTip'], [r_menuItem.item, '.']);
		assertEQ ( this.mm.params['setCallerData'], [r_tipId, {self:this.hdr, caller:this.lc()._onGetTooltip}, {id:'UPGRADE'} ]);
		
		this.mm.clear();
		this.lc().m_menuCfgs = [{id:'DOWN', icon:'101.gif', text:'down'}];
		this.hdr.createOpMenu();
		assertEQ ( this.mm.walkLog, '_allocMenu,setDisableCanClick,setCaller,addMenuItem,addTip,setCallerData' );
		assertEQ ( this.lc().m_opMenu, r_menu );
	};
	
	this.test_isShow = function(){
		this.lc().m_opMenu = null;
		assertEQ ( this.hdr.isShow(), false );
		this.hdr.createOpMenu();
		assertEQ ( this.hdr.isShow(), false );
		this.lc().m_opMenu.show({x:1, y:2});
		assertEQ ( this.hdr.isShow(), true );
	};
	
	this.test_show = function(){
		this.lc().m_opMenu = null;
		this.hdr.show({x:1, y:2});
		assertEQ ( this.hdr.isShow(), false );
		this.hdr.createOpMenu();
		this.mm.mock(this.lc().m_opMenu, 'show');
		this.hdr.show({x:1, y:2});
		assertEQ ( this.mm.params['show'], [{x:1, y:2}]);
	};
	
	this.test_resetOpMenuItemsShow = function(){
		var r_item = [null];
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', r_item);
		this.mm.mock(this.lc(), '_setMenuCommItemsShowFlag');
		this.mm.mock(this.lc(), '_setMenuSpecItemsShowFlag');
		this.mm.mock(this.lc(), '_setMenuWSYItemsShowFlag');
		this.mm.mock(this.lc(), '_resetOpMenuItemsShowByFlag');
		
		this.lc().m_opShows = {'UPGRADE':true};
		this.hdr.resetOpMenuItemsShow();
		assertEQ ( this.mm.walkLog, 'getItem' );
		assertEQ ( this.lc().m_opShows, {} );
		
		this.mm.clear();
		r_item[0] = {state:1};
		this.hdr.resetOpMenuItemsShow();
		assertEQ ( this.mm.walkLog, 'getItem,_setMenuCommItemsShowFlag,_setMenuSpecItemsShowFlag,_setMenuWSYItemsShowFlag,_resetOpMenuItemsShowByFlag' );
		assertEQ ( this.mm.params['_setMenuCommItemsShowFlag'], [r_item[0]]);
		assertEQ ( this.mm.params['_setMenuWSYItemsShowFlag'], [r_item[0]]);
		assertEQ ( this.mm.params['_setMenuSpecItemsShowFlag'], [r_item[0]]);
	};
	
	this.test_updateOpMenuItem = function(){
		this.hdr.createOpMenu();
		
		var r_isShow = [false];
		var r_item = [null];
		this.mm.mock(this.lc().m_opMenu, 'isShow', r_isShow);
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', r_item);
		this.mm.mock(TIPM, 'isCanBuildUpgrade', [true]);
		this.mm.mock(this.lc(), '_getMenuId', [1]);
		this.mm.mock(this.lc().m_opMenu, 'enableItem');
		
		this.hdr.updateOpMenuItem();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.hdr.updateOpMenuItem();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		this.lc().m_opShows = {'UPGRADE':true};
		this.hdr.updateOpMenuItem();
		assertEQ ( this.mm.walkLog, 'isShow,getItem' );
		
		this.mm.clear();
		r_item[0] = {cityId:1, state:2};
		this.hdr.updateOpMenuItem();
		assertEQ ( this.mm.walkLog, 'isShow,getItem,isCanBuildUpgrade,_getMenuId,enableItem' );
		assertEQ ( this.mm.params['isCanBuildUpgrade'], [1, r_item[0]]);
		assertEQ ( this.mm.params['_getMenuId'], ['UPGRADE']);
		assertEQ ( this.mm.params['enableItem'], [1, true]);
	};
	
	this.test_opSpeed = function(){
		this.mm.mock(UIM, 'openDlg');
		
		this.lc().m_cityId = 2;
		var p_item = {id:1, stoptime:10, resid:110001, cityId:2};
		this.hdr.opSpeed(p_item);
		assertEQ ( this.mm.params['openDlg'], ['uselistitem'
			,[RES_EFF.ACCELERATE]
			,{id:1, cid:2, stoptime:10, resid:110001, type:RES_TRG.BUILDING_IBUILD}
			] );
	};
	
	this.test_opCancel = function(){
		this.lc().m_cityId = 2;
		this.mm.mock(CityBuildSender, 'sendCancelBuild');
		var p_item = {id:3, cityId:2};
		this.hdr.opCancel(p_item);
		assertEQ ( this.mm.params['sendCancelBuild'], [this.g, 2, 3] );
	};
	
	this.test__getMenuId = function(){
		this.lc().m_menuCfgs = [{id:'UPGRADE'}];
		assertEQ ( this.lc()._getMenuId('UPGRADE'), 0 );
		assertEQ ( this.lc()._getMenuId('DOWN'), -1 );
	};
	
	this.test__setMenuCommItemsShowFlag = function(){
		this.lc().m_opShows = {};
		var p_item = {state:BUILD_STATE.COMM};
		this.lc()._setMenuCommItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {'UPGRADE':true, 'DOWN':true});
		
		this.lc().m_opShows = {};
		var p_item = {state:BUILD_STATE.UPGRADE};
		this.lc()._setMenuCommItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {'SPEED':true, 'CANCEL':true});
		
		this.lc().m_opShows = {};
		var p_item = {state:BUILD_STATE.DOWN};
		this.lc()._setMenuCommItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {'SPEED':true, 'CANCEL':true});
	};
	
	this.test__setMenuSpecItemsShowFlag = function(){
		this.lc().m_buildOpidMaps = {'110001':['BUILDINGINFO'], '110002':[]};
		this.lc().m_opShows = {};
		var p_item = {level:0, itemres:{id:110002}};
		this.lc()._setMenuSpecItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {} );
		
		p_item.level = 1;
		this.lc()._setMenuSpecItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {} );
		
		p_item.itemres.id = 110001;
		this.lc()._setMenuSpecItemsShowFlag(p_item);
		assertEQ ( this.lc().m_opShows, {'SEP':true, 'BUILDINGINFO':true} );
	};
	
	this.test__setMenuWSYItemsShowFlag = function(){
		this.lc().m_opShows = {};
		var item = {level:1, itemres:{id:1}};
		this.lc()._setMenuWSYItemsShowFlag(item);
		assertEQ ( this.lc().m_opShows, {} );
			
		var item = {level:0, itemres:{id:FIXID.ALLIINBUILD}};
		this.lc()._setMenuWSYItemsShowFlag(item);
		assertEQ ( this.lc().m_opShows, {} );
		
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		item = {level:1, itemres:{id:FIXID.ALLIINBUILD}};
		this.lc()._setMenuWSYItemsShowFlag(item);
		assertEQ ( this.lc().m_opShows, {'JOINALLIANCE':false, 'REINFORCEMENT':true} );
		
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		this.lc()._setMenuWSYItemsShowFlag(item);
		assertEQ ( this.lc().m_opShows, {JOINALLIANCE:true, REINFORCEMENT:false} );
	};
	
	this.test__resetOpMenuItemsShowByFlag = function(){
		this.hdr.createOpMenu();
		this.lc().m_opMenu.clear();
		this.lc().m_opMenu.addMenuItem({id:0, icon:null, text:'txt0'});
		this.lc().m_opMenu.addMenuItem({id:1, icon:null, text:'txt1'});
		
		this.mm.mock(this.lc().m_opMenu, 'showItem');
		
		this.lc().m_menuCfgs = [{id:'BUILDINGINFO'},{id:'SOLDIER'}];
		this.lc().m_opShows = {'BUILDINGINFO':true};
		
		this.lc()._resetOpMenuItemsShowByFlag();
		assertEQ ( this.mm.walkLog, 'showItem,showItem' );
		assertEQ ( this.mm.params['showItem.0'], [0, true] );
		assertEQ ( this.mm.params['showItem.1'], [1, false] );
	};
	
	this.test__allocMenu = function(){
		assertEQ ( this.lc()._allocMenu() instanceof Menu, true );
	};
	
	this.test__onOpCommand = function(){
		this.mm.mock(this.g.getGUI(), 'hideAllMenu');
		
		var w_onBuildingInfo = {};
		var _onBuildingInfo = function(idx, params){
			w_onBuildingInfo.idx = idx;
			w_onBuildingInfo.params = params;
		};
		var w_onSoldier = {};
		var _onSoldier = function(idx, params){
			w_onSoldier.idx = idx;
			w_onSoldier.params = params;
		};
		this.lc().m_menuCfgs = [{id:'BUILDINGINFO', opCaller:_onBuildingInfo, params:{idx:1}},{id:'SOLDIER', opCaller:_onSoldier},{id:'CULTURE'}];
		
		var p_menuId = 0;
		this.lc()._onOpCommand(p_menuId);
		assertEQ ( w_onBuildingInfo, {idx:0, params:{idx:1}} );
		
		p_menuId = 1;
		this.lc()._onOpCommand(p_menuId);
		assertEQ ( w_onSoldier, {idx:1, params:undefined} );
		
		p_menuId = 2;
		this.lc()._onOpCommand(p_menuId);
		
		p_menuId = 3;
		this.lc()._onOpCommand(p_menuId);
	};
	
	this.test__onGetTooltip = function(){
		var r_getCanNotDownTip = ['can not down tip'];
		var r_item = [null];
		this.mm.mock(this.lc(), '_getCanNotDownTip', r_getCanNotDownTip);
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', r_item);
		this.mm.mock(this.lc(), '_getTipTagByNameId', ['up']);
		this.mm.mock(TIPM, 'getBuildDesc', ['common tip']);
		
		var p_data = {id:'UPGRADE'};
		assertEQ ( this.lc()._onGetTooltip(p_data), 'can not down tip' );
		assertEQ ( this.mm.params['_getCanNotDownTip'], ['UPGRADE'] );
		
		this.mm.clear();
		r_getCanNotDownTip[0] = '';
		assertEQ ( this.lc()._onGetTooltip(p_data), '' );
		
		this.mm.clear();
		r_item[0] = {resid:110001,cityId:1};
		assertEQ ( this.lc()._onGetTooltip(p_data), 'common tip' );
		assertEQ ( this.mm.params['_getTipTagByNameId'], ['UPGRADE'] );
		assertEQ ( this.mm.params['getBuildDesc'], [1, 'up', r_item[0]] );
	};
	
	this.test__getTipTagByNameId = function(){
		assertEQ ( this.lc()._getTipTagByNameId('UPGRADE'), 'up' );
		assertEQ ( this.lc()._getTipTagByNameId('DOWN'), 'down' );
	};
	
	this.test__getCanNotDownTip = function(){
		assertEQ ( this.lc()._getCanNotDownTip('UPGRADE'), '' );
		
		var r_item = [null];
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', r_item);
		assertEQ ( this.lc()._getCanNotDownTip('DOWN'), '' );
		
		r_item[0] = {resid:110001,itemres:{name:'guanfu'}};
		this.lc().m_canNotDowns = {};
		assertEQ ( this.lc()._getCanNotDownTip('DOWN'), '' );
		
		this.lc().m_canNotDowns = {'110001':true};
		var expectTip = TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undown, 'guanfu'));
		assertEQ ( this.lc()._getCanNotDownTip('DOWN'), expectTip );
		
		r_item[0] = {level:2,resid:110002,itemres:{name:'minfang'}};
		this.lc().m_canNotDownsWhenOneLevel = {'110002':true};
		assertEQ ( this.lc()._getCanNotDownTip('DOWN'), '' );
		
		r_item[0] = {level:1,resid:110002,itemres:{name:'minfang'}};
		this.lc().m_canNotDownsWhenOneLevel = {'110002':true};
		var expectTip = TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, 'minfang'));
		assertEQ ( this.lc()._getCanNotDownTip('DOWN'), expectTip );
	};
	
	this.test__onBuildingInfo = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onBuildingInfo();
		assertEQ ( this.mm.params['openDlg'], ['buildinginfo'] );
	};
	
	this.test__onSoldier = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onSoldier();
		assertEQ ( this.mm.params['openDlg'], ['soldier'] );
	};
	
	this.test__onCulture = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onCulture();
		assertEQ ( this.mm.params['openDlg'], ['culture'] );
	};
	
	this.test__onRecruitHero = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onRecruitHero();
		assertEQ ( this.mm.params['openDlg'], ['recruithero'] );
	};
	
	this.test__onResProtect = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onResProtect();
		assertEQ ( this.mm.params['openDlg'], ['resprotect'] );
	};
	
	this.test__onHeroSteel = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onHeroSteel();
		assertEQ ( this.mm.params['openDlg'], ['steellist'] );
	};
	
	this.test__onOpenArmOpDlg = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onOpenArmOpDlg(0, {tabIdx:1});
		assertEQ ( this.mm.params['openDlg'], ['armop', 1] );
	};
	
	this.test__onHeroTreat = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onHeroTreat();
		assertEQ ( this.mm.params['openDlg'], ['hospital'] );
	};
	
	this.test__onCityDef = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onCityDef(0, {tabIdx:1});
		assertEQ ( this.mm.params['openDlg'], ['citydef', 1] );
	};
	
	this.test__onExchangeHeroExp = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onExchangeHeroExp();
		assertEQ ( this.mm.params['openDlg'], ['jitan'] );
	};
	
	this.test__onChangeSubCity = function(){
		var r_getBuildsByCityId = [[{resid:1},{resid:2}]];
		this.mm.mock(UIM.getPanel('main').getSubCityBtnsBar(), 'getCurSubCityId', [2]);
		this.mm.mock(this.g.getImgr(), 'getBuildsByCityId', r_getBuildsByCityId);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onChangeSubCity();
		assertEQ ( this.mm.walkLog, 'getCurSubCityId,getBuildsByCityId,sysMsgTips' );
		assertEQ ( this.mm.params['getBuildsByCityId'], [2] );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100068].msg] );
		
		this.mm.clear();
		r_getBuildsByCityId[0] = [{level:2}];
		this.lc()._onChangeSubCity();
		assertEQ ( this.mm.walkLog, 'getCurSubCityId,getBuildsByCityId,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100069].msg] );
		
		this.mm.clear();
		r_getBuildsByCityId[0] = [{level:1}];
		this.lc()._onChangeSubCity();
		assertEQ ( this.mm.walkLog, 'getCurSubCityId,getBuildsByCityId,openDlg' );
		assertEQ ( this.mm.params['openDlg'], ['createsubcity', 2, 'change'] );
	};
	
	this.test__onJoinAlliance = function(){
		this.mm.mock(UIM.getDlg('allicreate'), 'openDlg');
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopAllianceBlinking');
		this.lc()._onJoinAlliance();
		assertEQ ( this.mm.walkLog, 'openDlg,stopAllianceBlinking' );
	};
	
	this.test__onSeeReinforcement = function(){
		this.mm.mock(UIM.getDlg('reinforcement'), 'openDlg');
		this.lc()._onSeeReinforcement();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onTradingArea = function(){
		this.mm.mock(UIM.getDlg('tradingarea'), 'openDlg' );
		this.lc()._onTradingArea();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onUpgradeBuild = function(){
		var r_item ={id:2, cityId:1};
		var r_getSimpleBuildUpTip = ['tip'];
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', [r_item]);
		this.mm.mock(TIPM, 'getSimpleBuildUpTip', r_getSimpleBuildUpTip);
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(CityBuildSender, 'sendUpgradeBuild');
		
		this.lc()._onUpgradeBuild(r_item);
		assertEQ ( this.mm.walkLog, 'getItem,getSimpleBuildUpTip,msgBox' );
		assertEQ ( this.mm.params['getSimpleBuildUpTip'], [1, r_item] );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, 'tip', MB_F_CLOSE, null] );
		
		this.mm.clear();
		r_getSimpleBuildUpTip[0] = '';
		this.lc()._onUpgradeBuild(r_item);
		assertEQ ( this.mm.walkLog, 'getItem,getSimpleBuildUpTip,sendUpgradeBuild' );
		assertEQ ( this.mm.params['sendUpgradeBuild'], [this.g, 1, 2] );
	};
	
	this.test__onDownBuild = function(){
		var r_item ={level:1,resid:110001,itemres:{name:'guanfu'}};
		this.lc().m_canNotDowns = {'110001':true};
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', [r_item]);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.lc()._onDownBuild();
		assertEQ ( this.mm.walkLog, 'getItem,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, TQ.format(rstr.inbuild.panel.tips.undown, 'guanfu')] );
		
		this.mm.clear();
		this.lc().m_canNotDowns = {'110001':false};
		this.lc().m_canNotDownsWhenOneLevel = {'110001':true};
		this.lc()._onDownBuild();
		assertEQ ( this.mm.walkLog, 'getItem,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, 'guanfu')] );
		
		this.mm.clear();
		r_item.level = 2;
		this.lc()._onDownBuild();
		assertEQ ( this.mm.walkLog, 'getItem,msgBox' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.inbuild.panel.tips.confirmDown,  MB_F_YESNO, {self:this.hdr, caller:this.lc()._onDownCallback}] );
		
		this.mm.clear();
		r_item.level = 1;
		this.lc().m_canNotDownsWhenOneLevel = {'110001':false};
		this.lc()._onDownBuild();
		assertEQ ( this.mm.walkLog, 'getItem,msgBox' );
	};
	
	this.test__onDownBuild_onDownCallback = function(){
		var r_item ={id:2, cityId:1};
		this.lc().m_canNotDowns = {};
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', [r_item]);
		this.lc()._onDownBuild(); // init _onDownCallback function
		
		this.mm.mock(CityBuildSender, 'sendDownBuild');
		this.lc()._onDownCallback(MB_IDNO);
		assertEQ ( this.mm.walkLog, 'getItem' );
		
		this.lc()._onDownCallback(MB_IDYES);
		assertEQ ( this.mm.params['sendDownBuild'], [this.g, 1, 2] );
	};
	
	this.test__onSpeedBuilding = function(){
		var r_item ={id:2};
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', [r_item]);
		this.mm.mock(this.hdr, 'opSpeed');
		this.lc()._onSpeedBuilding();
		assertEQ ( this.mm.walkLog, 'getItem,opSpeed' );
		assertEQ ( this.mm.params['opSpeed'], [r_item] );
	};
	
	this.test__onCancelBuilding = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.lc()._onCancelBuilding();
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.inbuild.panel.tips.confirmCancelUp,  MB_F_YESNO, {self:this.hdr, caller:this.lc()._onCancelCallback}] );
	};
	
	this.test__onCancelBuilding_onCancelCallback = function(){
		this.lc()._onCancelBuilding(); // init _onCancelCallback function
		
		var r_item ={id:2};
		this.mm.mock(this.lc().m_buildBlocks.getCurBlock(), 'getItem', [r_item]);
		this.mm.mock(this.hdr, 'opCancel');
		this.lc()._onCancelCallback(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onCancelCallback(MB_IDYES);
		assertEQ ( this.mm.walkLog, 'getItem,opCancel' );
		assertEQ ( this.mm.params['opCancel'], [r_item] );
	};
	
});

tqBuildsOpHdr_t_main = function(suite) {
	suite.addTestCase(TestCaseBuildsOpHdr, 'TestCaseBuildsOpHdr');
};
