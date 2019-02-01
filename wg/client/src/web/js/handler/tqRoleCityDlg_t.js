/*******************************************************************************/
requireEx('./handler/tqRoleCityDlg.js', [
	{
		start:'//RoleCityDlg-unittest-start'
		,end:'//RoleCityDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_field'
			,'m_dlg'
			,'m_items'
			,'m_opHdr'
			,'m_isModal'
			,'m_achievement'
			,'_regEvent'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_startUpdater'
			,'_createOpHdr'
			,'_setTitle'
			,'_updateInfo'
			,'_getFieldDetailInfo'
			,'_isShow'
			,'_setRoleBaseInfo'
			,'_setFightState'
			,'_setRoleDetailInfo'
			,'_onDlgEvent'
			,'_onUpdate'
			,'_onLoginOk'
			,'_onSvrPkg'
			,'_clearRoleBaseInfo'
			,'_clearFightState'
			,'_clearRoleDetailInfo'
		]
	}
]);
	
var RoleCityOpHdrHelperForTestCase = Class.extern(function(){
	this.createItemWithBtns = function(g){
		var items = {};
		for ( var i=0; i<6; ++i ) {
			items['opbtn' + (i+1)] = new ComButton(g, new MockDom());
		}
		return items;
	};
}).snew();
	
var TestCaseSelfRoleCityOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		var dlg = MockDialog.snew();
		var btnCount = 6;
		this.g_items = RoleCityOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {roleName:'role', roleId:10000};
		this.hdr = SelfRoleCityOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.rolecitydlg.btn.selfCityBtns );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [
			null,
			null,
			null,
			null,
			this.hdr.onEnterCity,
			this.hdr.onEnterFarm] );
	};
	
	this.test_setSomeBtnsHide = function(){
		this.hdr.setAllBtnsVisible();
		
		this.hdr.setSomeBtnsHidden();
		
		assertEQ ( this.g_items.opbtn1.isShow(), false );
		assertEQ ( this.g_items.opbtn2.isShow(), false );
		assertEQ ( this.g_items.opbtn3.isShow(), false );
		assertEQ ( this.g_items.opbtn4.isShow(), false );
	};
	
	this.test_onEnterCity = function(){
		var back_inbuild = UIM.getPanel('inbuild');
		var inbuildPanel = Class.extern(function(){ this.open=function(){}; }).snew();
		UIM.forceRegPanel('inbuild', inbuildPanel);
		
		this.mm.mock(UIM, 'closeMapPanels');
		this.mm.mock(inbuildPanel, 'open');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		
		this.hdr.onEnterCity();
		assertEQ ( this.mm.walkLog, 'closeMapPanels,open,closeDlg' );
		
		UIM.forceRegPanel('inbuild', back_inbuild);
	};
});

var TestCaseSameAlliRoleCityOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		var dlg = MockDialog.snew();
		var btnCount = 6;
		this.g_items = RoleCityOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.ROLE, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = SameAlliRoleCityOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.rolecitydlg.btn.sameAlliCityBtns );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [
			this.hdr.onSendMail,
			this.hdr.onTalkTo,
			this.hdr.onDispatchArmy,
			this.hdr.onAddFavorite,
			this.hdr.onAddFriend,
			this.hdr.onEnterFarm] );
	};
	
	this.test_onDispatchArmy = function(){
		this.mm.mock(ExpedUtil, 'expedTo');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		this.hdr.onDispatchArmy();
		assertEQ ( this.mm.walkLog, 'expedTo,closeDlg' );
		assertEQ ( this.mm.params['expedTo'], [this.g_field] );
	};
});

var TestCaseOtherAlliRoleCityOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		var dlg = MockDialog.snew();
		var btnCount = 6;
		this.g_items = RoleCityOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.ROLE, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = OtherAlliRoleCityOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.rolecitydlg.btn.otherAlliCityBtns );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [
			this.hdr.onSendMail,
			this.hdr.onTalkTo,
			this.hdr.onDeclareOrAttack,
			this.hdr.onAddFavorite,
			this.hdr.onAddFriend,
			this.hdr.onEnterFarm] );
	};
	
	this.test_setSomeBtnsHide = function(){
		var r_getFightRefState = [REF_ROLESTATE.NORMAL];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		this.hdr.setAllBtnsVisible();
		this.hdr.setSomeBtnsHidden();
		assertEQ ( this.g_items.opbtn3.isShow(), true );
		assertEQ( this.mm.params['getFightRefState'], [this.g_field.roleId] );
		
		r_getFightRefState[0] = REF_ROLESTATE.DECLARING_FIGHT;
		this.hdr.setAllBtnsVisible();
		this.hdr.setSomeBtnsHidden();
		assertEQ ( this.g_items.opbtn3.isShow(), false );
	};
	
	this.test_update = function(){
		var r_getFightRefState = [REF_ROLESTATE.NORMAL];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		this.hdr.update();
		assertEQ ( this.hdr.items.opbtn3.getText(), rstr.field.rolecitydlg.btn.declareFight );
		assertEQ( this.mm.params['getFightRefState'], [this.g_field.roleId] );
		
		r_getFightRefState[0] = REF_ROLESTATE.FIGHTING;
		this.hdr.update();
		assertEQ ( this.hdr.items.opbtn3.getText(), rstr.field.rolecitydlg.btn.fightTo );
	};
	
	this.test_onDeclareOrAttack = function(){
		var r_getFightRefState = [REF_ROLESTATE.NORMAL];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		this.mm.mock(MilitarySender, 'sendDeclareFight');
		this.mm.mock(OutFieldSender, 'sendRefreshFieldsByLastViewPos');
		this.mm.mock(ExpedUtil, 'expedTo');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		this.hdr.onDeclareOrAttack();
		assertEQ ( this.mm.walkLog, 'getFightRefState,sendDeclareFight,sendRefreshFieldsByLastViewPos' );
		assertEQ ( this.mm.params['sendDeclareFight'], [this.g, 10000] );
		assertEQ( this.mm.params['getFightRefState'], [this.g_field.roleId] );
		assertEQ( this.mm.params['sendRefreshFieldsByLastViewPos'], [this.g] );
		
		this.mm.clear();
		r_getFightRefState[0] = REF_ROLESTATE.FIGHTING;
		this.hdr.onDeclareOrAttack();
		assertEQ ( this.mm.walkLog, 'getFightRefState,expedTo,closeDlg' );
		assertEQ ( this.mm.params['expedTo'], [this.g_field] );
	};
});

var TestCaseRoleCityDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RoleCityDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.lc().m_field = {gridId:1, roleId:10000, roleName:'role', icon:102, level:1, cityMaxLevel:10, actTower:2, actTerrace:3, ydInfo:{is_yellow_vip:1,yellow_vip_level:2}, vip:0};
		this.lc()._initDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.lc().m_isModal, false );
		
		this.mm.mock( this.lc(), '_regEvent' );
		this.dlg.init(this.g, true);
		assertEQ ( this.mm.walkLog, '_regEvent' );
		assertEQ ( this.lc().m_isModal, true );
	};
	
	this.test_openDlg = function(){
		var g_field = {};
		this.mm.mock(UIM, 'closeAllFieldDlg' );
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(g_field);
		assertEQ ( this.lc().m_field, g_field );
		assertEQ ( this.mm.walkLog, 'closeAllFieldDlg,_initDlg,_openDlg,_initInfo' );
			
		this.lc().m_isModal = true;
		this.mm.clear();
		this.dlg.openDlg(g_field);
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test_closeDlg = function(){
		this.lc().m_dlg = null;
		this.dlg.closeDlg();
		
		this.lc()._initDlg();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.dlg.closeDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__regEvent = function(){
		this.mm.mock(this.g, 'regEvent' );
		this.lc()._regEvent();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.dlg, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.FIGHTREFSTATE, this.dlg, this.lc()._onSvrPkg] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.OUTFIELD_DETAIL, 0, this.dlg, this.lc()._updateInfo] );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		
		var g_dlg = MockDialog.snew(this.g);
		this.mm.travelMock(RoleAchievement, 'snew:snewAchievement');
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.mm.mock( g_dlg, 'setCaller' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,setCaller,snewAchievement' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:false, title:'...', pos:{x:'center', y:50} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.field.rolecitydlg, this.lc().m_items] ); 
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] ); 
		assertEQ ( this.mm.params['snewAchievement'], [this.g, this.lc().m_items.achievement] );
		assertEQ ( this.lc().m_achievement instanceof RoleAchievement, true );
		
		this.mm.clear();
		this.lc().m_dlg = null;
		this.lc().m_isModal = true;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,setCaller,snewAchievement' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:true, title:'...', pos:{x:'center', y:50} }] );
		
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '', 'only create one time' );
	};
	
	this.test__openDlg = function(){
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'show' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_achievement, 'setRole');
		this.mm.mock(this.lc(), '_startUpdater' );
		this.mm.mock(this.lc(), '_createOpHdr' );
		this.mm.mock(this.lc(), '_setTitle' );
		this.mm.mock(this.lc(), '_updateInfo' );
		this.mm.mock(this.lc(), '_getFieldDetailInfo' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_startUpdater,_createOpHdr,_setTitle,_updateInfo,_getFieldDetailInfo' );
		
		this.lc().m_field.isDetail = 1;
		this.mm.clear();
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_startUpdater,_createOpHdr,_setTitle,_updateInfo,_getFieldDetailInfo,setRole' );
		assertEQ ( this.mm.params['setRole'], [{cityMaxLevel:10, actTower:2, actTerrace:3, vip:0}] );
	};
	
	this.test__startUpdater = function(){
		this.mm.mock(this.lc().m_g, 'regUpdater' );
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, 'regUpdater' );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 1000] );
	};
	
	this.test__createOpHdr = function(){
		var btnCount = 6;
		this.lc().m_field = {roleName:'role', alliance:{uid:1}};
		
		var g_isSameRoleRt = [true];
		var g_isSameAllianceRt = [true];
		this.mm.mock(this.g.getImgr(), 'isSameRole', g_isSameRoleRt);
		this.mm.mock(this.g.getImgr(), 'isSameAlliance', g_isSameAllianceRt);
		this.mm.mock(SelfRoleCityOpHdr, 'snew', ['self obj']);
		this.mm.mock(SameAlliRoleCityOpHdr, 'snew', ['same alliance obj']);
		this.mm.mock(OtherAlliRoleCityOpHdr, 'snew', ['other alliance obj']);
		
		this.mm.clear();
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, 'self obj' );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, btnCount, this.lc().m_items, this.lc().m_field] );
		
		this.mm.clear();
		g_isSameRoleRt[0] = false;
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, 'same alliance obj' );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, btnCount, this.lc().m_items, this.lc().m_field] );
		
		this.mm.clear();
		g_isSameAllianceRt[0] = false;
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, 'other alliance obj' );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, btnCount, this.lc().m_items, this.lc().m_field] );
	};
	
	this.test__updateInfo = function(){
		var dlg = MockDialog.snew();
		var btnCount = 6;
		var g_isShowRt = [false];
		
		this.lc().m_opHdr = SelfRoleCityOpHdr.snew(this.g, dlg, btnCount, this.lc().m_items, {});
		
		this.mm.mock(this.lc(), '_isShow', g_isShowRt );
		this.mm.mock(this.lc().m_opHdr, 'update' );
		this.mm.mock(this.lc(), '_setRoleBaseInfo' );
		this.mm.mock(this.lc(), '_setFightState' );
		this.mm.mock(this.lc(), '_setRoleDetailInfo' );
		this.mm.mock(this.lc().m_achievement, 'setRole');
		
		this.lc()._updateInfo();
		assertEQ ( this.mm.walkLog, '_isShow' );

		this.mm.clear();
		g_isShowRt[0] = true;
		this.lc().m_field.isDetail = 1;
		this.lc()._updateInfo();
		assertEQ ( this.mm.walkLog, '_isShow,update,_setRoleBaseInfo,_setFightState,_setRoleDetailInfo,setRole' );
		assertEQ ( this.mm.params['setRole'], [{cityMaxLevel:10, actTower:2, actTerrace:3, vip:0}] );
	};
	
	this.test__getFieldDetailInfo = function(){
		this.lc().m_field.isDetail = 1;
		this.lc().m_field.gridId = 1;
		this.mm.mock(OutFieldSender, 'sendGetFieldDetail' );
		
		this.lc()._getFieldDetailInfo();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_field.isDetail = 0;
		this.lc()._getFieldDetailInfo();
		assertEQ ( this.mm.walkLog, 'sendGetFieldDetail' );
		assertEQ ( this.mm.params['sendGetFieldDetail'], [this.g, 1] );
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true);
		
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false);
		
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false);
	};
	
	this.test__setRoleBaseInfo = function(){
		g_platform = 'qzone';
		this.mm.mock(this.lc(), '_clearRoleBaseInfo');
		this.lc().m_field.isDetail = 0;
		this.lc()._setRoleBaseInfo();
		assertEQ ( this.mm.walkLog, '_clearRoleBaseInfo' );
		
		this.mm.clear();
		this.lc().m_field.isDetail = 1;
		this.lc()._setRoleBaseInfo();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.icon), '102.gif'), true );
		assertEQ ( TQ.getTextEx(this.lc().m_items.name), RStrUtil.makeYellowDiamondRoleName('role', this.lc().m_field.ydInfo) );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.stateCityFlag), '1.png'), true );
		assertEQ ( TQ.getTextEx(this.lc().m_items.roleLevel), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cood), HyperLinkMgr.formatLink('#[m:0:0]'));
	};
	
	this.test__setFightState = function(){
		this.mm.mock(this.lc(), '_clearFightState');
		this.lc()._setFightState();
		assertEQ ( this.mm.walkLog, '_clearFightState' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.fightState), '' );
		
		var r_getFightRefState = [REF_ROLESTATE.NORMAL];
		var r_getFightRefStateStopTime = [this.g.getSvrTimeS() + 10];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		this.mm.mock(this.g.getImgr(), 'getFightRefStateStopTime', r_getFightRefStateStopTime);
		this.lc().m_field.isDetail = 1;
		this.lc()._setFightState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.fightState), TQ.formatColorStr(rstr.field.rolecitydlg.lbl.refstate[0], COLORS.ROLESTATE_NORMAL) );
		assertEQ( this.mm.params['getFightRefState'], [this.lc().m_field.roleId] );
		
		r_getFightRefState[0] = REF_ROLESTATE.DECLARING_FIGHT;
		this.lc()._setFightState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.fightState), TQ.formatColorStr(rstr.field.rolecitydlg.lbl.refstate[1] + '00:00:10', COLORS.ROLESTATE_DECLARING_FIGHT) );
		
		r_getFightRefState[0] = REF_ROLESTATE.FIGHTING;
		this.lc()._setFightState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.fightState), TQ.formatColorStr(rstr.field.rolecitydlg.lbl.refstate[2] + '00:00:10', COLORS.ROLESTATE_FIGHTING) );
	};
	
	this.test__setRoleDetailInfo = function(){
		this.mm.mock(this.lc(), '_clearRoleDetailInfo');
		this.lc()._setRoleDetailInfo();
		assertEQ ( this.mm.walkLog, '_clearRoleDetailInfo' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), '' );
		
		this.mm.clear();
		this.lc().m_field.isDetail = 1;
		this.lc().m_field.alliance = {name:'alli'};
		this.lc().m_field.buildval = {level:1, cur:10};
		this.lc().m_field.rank = 10000;
		this.lc().m_field.introduction = 'sign&hck;';
		this.lc()._setRoleDetailInfo();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), 'alli' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityLevel), RStrUtil.getCityNameByLevel(1) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildVal), 10 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.sort), 10000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.introduction), 'sign<br/>' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		this.lc()._onDlgEvent(0);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.walkLog, 'unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock( this.lc(), '_setFightState' );
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_setFightState' );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(FightResStateSender, 'sendGetRefStates');
		this.lc()._onLoginOk();
		assertEQ(this.mm.params['sendGetRefStates'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getFightRefStates(), [] );
		
		cmd = {data:{states:[]}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getFightRefStates(), [] );
		
		cmd = {data:{states:[{id:10000,state:1,stoptime:2}]}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getFightRefStates(), [{id:10000,state:1,stoptime:2}] );
	};
	
	this.test__clearRoleBaseInfo = function(){
		this.lc()._clearRoleBaseInfo();
		assertEQ ( IMG.getBKImage(this.lc().m_items.icon), "url('')");
		assertEQ ( TQ.getTextEx(this.lc().m_items.name), '' );
		assertEQ ( IMG.getBKImage(this.lc().m_items.stateCityFlag), "url('')");
		assertEQ ( TQ.getTextEx(this.lc().m_items.roleLevel), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cood), '' );		
	};
	
	this.test__clearFightState = function(){
		this.lc()._clearFightState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.fightState), '' );
	};
	
	this.test__clearRoleDetailInfo = function(){
		this.lc()._clearRoleDetailInfo();
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityLevel), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildVal), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.sort), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.introduction), '' );
	};
});

tqRoleCityDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelfRoleCityOpHdr, 'TestCaseSelfRoleCityOpHdr');
	suite.addTestCase(TestCaseSameAlliRoleCityOpHdr, 'TestCaseSameAlliRoleCityOpHdr');
	suite.addTestCase(TestCaseOtherAlliRoleCityOpHdr, 'TestCaseOtherAlliRoleCityOpHdr');
	suite.addTestCase(TestCaseRoleCityDlg, 'TestCaseRoleCityDlg');
};
