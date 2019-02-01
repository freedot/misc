/*******************************************************************************/
requireEx('./handler/tqSelfFieldDlg.js', [
	{
		start:'//SelfFieldsHdr-unittest-start'
		,end:'//SelfFieldsHdr-unittest-end'
		,items:['m_g'
			,'m_this'
			,'_regEvents'
			,'_onLoginOk'
			,'_onSvrPkg'
		]
	}
	,{
		start:'//SelfFieldDlg-unittest-start'
		,end:'//SelfFieldDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_field'
			,'m_dlg'
			,'m_items'
			,'_regEvents'		
			,'_initParam'
			,'_initDlg'
			,'_setCallers'		
			,'_openDlg'
			,'_initInfo'
			,'_firstGetCanGetRes'
			,'_startUpdater'
			,'_setFieldNameAndPos'
			,'_setArmyInfo'
			,'_setCollectedTime'
			,'_setCanGetRes'
			,'_setStartOrStopBtnName'
			,'_setBtnsEnableState'
			,'_onDlgEvent'
			,'_onSelfFieldUpdate'
			,'_onUpdate'
			,'_onUpdateSendCmd'
			,'_onClickCallBack'
			,'_onClickDispatch'
			,'_onClickStartOrStop'
			,'_onClickStart'
			,'_onClickStop'
			,'_onClickGiveUp'
			,'_isShow'
		]
	}
]);

var TestCaseSelfFieldsHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = SelfFieldsHdr.snew(this.g);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.hdr.init ( this.g );
		assertEQ ( this.mm.walkLog, '_regEvents');
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_this, this.hdr);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent');
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.hdr, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.SELFFIELD, this.hdr, this.lc()._onSvrPkg] );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(SelfFieldSender, 'sendGetAllSelfFields');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.walkLog, 'sendGetAllSelfFields' );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.g, 'sendEvent');
		
		var nevent = {data:{}};
		this.lc()._onSvrPkg(nevent);
		assertEQ ( this.mm.walkLog, '' );
			
		var nevent = {data:{selffields:[{id:1}]}};
		this.lc()._onSvrPkg(nevent);
		assertEQ ( this.g.getImgr().getSelfFields().list, [{id:1}] );
		assertEQ ( this.mm.walkLog, 'sendEvent' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.SELFFIELD_UPDATE, sid:0}] );
	};
});

var TestCaseSelfFieldDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SelfFieldDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.lc()._initDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var dlg = SelfFieldDlg.snew(this.g);
		assertEQ ( dlg.lc().m_g, this.g );
		assertEQ ( dlg.lc().m_this, dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(UIM, 'closeAllFieldDlg' );
		this.mm.mock(this.lc(), '_initParam' );
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg({id:1});
		assertEQ ( this.mm.walkLog, 'closeAllFieldDlg,_initParam,_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initParam'], [{id:1}] );	
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
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.SELFFIELD_UPDATE, 0, this.dlg, this.lc()._onSelfFieldUpdate] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.PERSONAL_ARMY_UPDATE, 0, this.dlg, this.lc()._onSelfFieldUpdate] );
	};
	
	this.test__initParam = function(){
		assertEQ ( this.lc().m_field, null );
		this.lc()._initParam({id:1});
		assertEQ ( this.lc().m_field, {id:1} );
	};
	
	this.test__initDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.lc().m_dlg = null;
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.mm.mock( this.lc(), '_setCallers' );
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,_setCallers' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:false, title:rstr.field.selffielddlg.title , pos:{x:'center', y:50}} ]); 
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.field.selffielddlg, this.lc().m_items] ); 
		
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '', 'only create one time' );
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.lc().m_dlg, 'setCaller' );
		this.mm.mock( this.lc().m_items.callbackBtn, 'setCaller' );
		this.mm.mock( this.lc().m_items.dispatchBtn, 'setCaller' );
		this.mm.mock( this.lc().m_items.startOrStopBtn, 'setCaller' );
		this.mm.mock( this.lc().m_items.giveUpBtn, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] ); 
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickCallBack}] ); 
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickDispatch}] ); 
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.dlg, caller:this.lc()._onClickStartOrStop}] ); 
		assertEQ ( this.mm.params['setCaller.4'], [{self:this.dlg, caller:this.lc()._onClickGiveUp}] ); 
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};	
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_firstGetCanGetRes');
		this.mm.mock(this.lc(), '_startUpdater');
		this.mm.mock(this.lc(), '_setFieldNameAndPos');
		this.mm.mock(this.lc(), '_setArmyInfo');
		this.mm.mock(this.lc(), '_setCollectedTime');
		this.mm.mock(this.lc(), '_setCanGetRes');
		this.mm.mock(this.lc(), '_setStartOrStopBtnName');
		this.mm.mock(this.lc(), '_setBtnsEnableState');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_firstGetCanGetRes,_startUpdater,_setFieldNameAndPos,_setArmyInfo,_setCollectedTime,_setCanGetRes,_setStartOrStopBtnName,_setBtnsEnableState' );
	};	
	
	this.test__firstGetCanGetRes = function(){
		this.lc().m_field = {gridId:1};
		this.mm.mock(SelfFieldSender, 'sendGetCanGetRes');
		this.lc()._firstGetCanGetRes();
		assertEQ ( this.mm.walkLog, 'sendGetCanGetRes' );
		assertEQ ( this.mm.params['sendGetCanGetRes'], [this.g, 1] );		
	};
	
	this.test__startUpdater = function(){
		this.mm.mock(this.lc().m_g, 'regUpdater' );
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, 'regUpdater,regUpdater' );
		assertEQ ( this.mm.params['regUpdater.0'], [this.dlg, this.lc()._onUpdate, 1000] );
		assertEQ ( this.mm.params['regUpdater.1'], [this.dlg, this.lc()._onUpdateSendCmd, 30000] );
	};
	
	this.test__setFieldNameAndPos = function(){
		this.lc().m_field = {gridId:2, objType:OBJ_TYPE.FIELD, resid:170001, level:1};
		this.lc()._setFieldNameAndPos();
		assertEQ ( TQ.getTextEx(this.lc().m_items.fieldName),  FieldUtil.getFieldName(this.lc().m_field) + ' (1, 0)' );
	};
	
	this.test__setArmyInfo = function(){
		this.lc().m_field = {};
		
		var g_getCurDispatchHeroRt = [null];
		this.mm.mock(SelfFieldUtil, 'getCurDispatchHero', g_getCurDispatchHeroRt);
		this.lc()._setArmyInfo();
		assertEQ ( this.mm.params['getCurDispatchHero'], [this.lc().m_field] );
		assertEQ ( TQ.getTextEx(this.lc().m_items.armyInfo),  '' );
		
		g_getCurDispatchHeroRt[0] = {id:1,name:"name1",level:1,state:0,prof:1,soldier:{resid:150001001,number:10}};
		this.lc()._setArmyInfo();
		var expectStr = TQ.format(rstr.field.selffielddlg.lbl.armyInfo, 'name1', 1, RStrUtil.getSoldierNameByResId(150001001), 10);
		assertEQ ( TQ.getTextEx(this.lc().m_items.armyInfo), expectStr );
	};
	
	this.test__setCollectedTime = function(){
		this.lc().m_field = {gridId:1};
		this.lc()._setCollectedTime();
		assertEQ ( TQ.getTextEx(this.lc().m_items.collectedTime),  '' );
		
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:0}];
		this.lc()._setCollectedTime();
		assertEQ ( TQ.getTextEx(this.lc().m_items.collectedTime),  '' );
		
		this.g.setSvrTimeS(11);
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:1}];
		this.lc()._setCollectedTime();
		assertEQ ( TQ.getTextEx(this.lc().m_items.collectedTime),  '00:00:10' );
		
		this.g.setSvrTimeS(0);
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:1}];
		this.lc()._setCollectedTime();
		assertEQ ( TQ.getTextEx(this.lc().m_items.collectedTime),  '00:00:00' );
		
		this.g.setSvrTimeS(2+res_max_collect_time);
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:1}];
		this.lc()._setCollectedTime();
		assertEQ ( TQ.getTextEx(this.lc().m_items.collectedTime),  '10:00:00' );
	};
	
	this.test__setCanGetRes = function(){
		this.lc().m_field = {gridId:1};
		this.g.getImgr().getSelfFields().list = [{id:2}];
		
		this.lc()._setCanGetRes();
		assertEQ ( TQ.getTextEx(this.lc().m_items.canGetRes),  '0' );
		
		this.g.getImgr().getSelfFields().list = [{id:1}];
		this.lc()._setCanGetRes();
		assertEQ ( TQ.getTextEx(this.lc().m_items.canGetRes),  '0' );
		
		this.g.getImgr().getSelfFields().list = [{id:1,canGetRes:{food:1,wood:2,stone:0,iron:4}}];
		this.lc()._setCanGetRes();
		assertEQ ( TQ.getTextEx(this.lc().m_items.canGetRes),  rstr.comm.food+'1 '+rstr.comm.wood+'2 '+rstr.comm.iron+'4');
	};
	
	this.test__setStartOrStopBtnName = function(){
		this.lc().m_field = {gridId:1};
		this.g.getImgr().getSelfFields().list = [{id:2}];
		this.lc()._setStartOrStopBtnName();
		assertEQ ( this.lc().m_items.startOrStopBtn.getText(),  rstr.field.selffielddlg.btn.start);
		
		this.g.getImgr().getSelfFields().list = [{id:1}];
		this.lc()._setStartOrStopBtnName();
		assertEQ ( this.lc().m_items.startOrStopBtn.getText(),  rstr.field.selffielddlg.btn.start);
		
		this.g.getImgr().getSelfFields().list = [{id:1,startTime:0}];
		this.lc()._setStartOrStopBtnName();
		assertEQ ( this.lc().m_items.startOrStopBtn.getText(),  rstr.field.selffielddlg.btn.start);
		
		this.g.getImgr().getSelfFields().list = [{id:1,startTime:1}];
		this.lc()._setStartOrStopBtnName();
		assertEQ ( this.lc().m_items.startOrStopBtn.getText(),  rstr.field.selffielddlg.btn.stop);
	};
	
	this.test__setBtnsEnableState = function(){
		this.lc().m_field = {};
		
		var g_hasArmyDispatchedRt = [true];
		this.mm.mock ( SelfFieldUtil, 'hasArmyDispatched', g_hasArmyDispatchedRt );
		this.lc()._setBtnsEnableState();
		assertEQ ( this.mm.params['hasArmyDispatched'], [this.lc().m_field] );
		assertEQ ( this.lc().m_items.callbackBtn.isEnable(), true );
		
		g_hasArmyDispatchedRt[0] = false;
		this.lc()._setBtnsEnableState();
		assertEQ ( this.lc().m_items.callbackBtn.isEnable(), false );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		this.lc()._onDlgEvent(0);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.walkLog, 'unregUpdater,unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater.0'], [this.dlg, this.lc()._onUpdate] );
		assertEQ ( this.mm.params['unregUpdater.1'], [this.dlg, this.lc()._onUpdateSendCmd] );
	};	
	
	this.test__onSelfFieldUpdate = function(){
		var g_isShowRt = [false];
		this.mm.mock(this.lc(), '_isShow', g_isShowRt);
		this.mm.mock(this.lc(), '_setArmyInfo');
		this.mm.mock(this.lc(), '_setCollectedTime');
		this.mm.mock(this.lc(), '_setCanGetRes');
		this.mm.mock(this.lc(), '_setStartOrStopBtnName');
		this.mm.mock(this.lc(), '_setBtnsEnableState');
		
		this.lc()._onSelfFieldUpdate();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		g_isShowRt[0] = true;
		this.lc()._onSelfFieldUpdate();
		assertEQ ( this.mm.walkLog, '_isShow,_setArmyInfo,_setCollectedTime,_setCanGetRes,_setStartOrStopBtnName,_setBtnsEnableState' );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_setCollectedTime');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_setCollectedTime' );
	};
	
	this.test__onUpdateSendCmd = function(){
		this.lc().m_field = {gridId:1};
		this.mm.mock(SelfFieldSender, 'sendGetCanGetRes');
		this.lc()._onUpdateSendCmd();
		assertEQ ( this.mm.params['sendGetCanGetRes'], [this.g, 1] );
	};
	
	this.test__onClickCallBack = function(){
		this.lc().m_field = {gridId:1};
		
		this.mm.mock( SelfFieldSender, 'sendRecallArmy' );
		this.lc()._onClickCallBack();
		
		assert ( this.g.getGUI().isShowMsgBox() == true);
		this.g.getGUI().msgBoxClick(MB_IDYES);
		
		assertEQ ( this.mm.walkLog, 'sendRecallArmy' );
		assertEQ ( this.mm.params['sendRecallArmy'], [this.g, 1] );
	};
	
	this.test__onClickDispatch = function(){
		this.lc().m_field = {gridId:1};
		
		var g_hasArmyDispatchedRt = [true];
		this.mm.mock(SelfFieldUtil, 'hasArmyDispatched', g_hasArmyDispatchedRt );
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock( ExpedUtil, 'expedTo' );
		this.lc()._onClickDispatch();
		assertEQ ( this.mm.walkLog, 'hasArmyDispatched,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100057].msg] );
		assertEQ ( this.mm.params['hasArmyDispatched'], [this.lc().m_field] );
		
		this.mm.clear();
		g_hasArmyDispatchedRt[0] = false;
		this.lc()._onClickDispatch();
		assertEQ ( this.mm.walkLog, 'hasArmyDispatched,expedTo' );
		assertEQ ( this.mm.params['expedTo'], [this.lc().m_field] );
	};
	
	this.test__onClickStartOrStop = function(){
		this.lc().m_field = {gridId:1};
		
		this.mm.mock( this.lc(), '_onClickStart' );
		this.mm.mock( this.lc(), '_onClickStop' );
		
		this.mm.clear();
		this.lc()._onClickStartOrStop();
		assertEQ ( this.mm.walkLog, '_onClickStart' );
		
		this.mm.clear();
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:0}];
		this.lc()._onClickStartOrStop();
		assertEQ ( this.mm.walkLog, '_onClickStart' );
		
		this.mm.clear();
		this.g.getImgr().getSelfFields().list = [{id:1, startTime:1}];
		this.lc()._onClickStartOrStop();
		assertEQ ( this.mm.walkLog, '_onClickStop' );		
	};
	
	this.test__onClickStart = function(){
		this.lc().m_field = {gridId:1};
		
		var g_hasArmyDispatchedRt = [false];
		var g_hasSoldiersDispatchedRt = [false];
		this.mm.mock(SelfFieldUtil, 'hasArmyDispatched', g_hasArmyDispatchedRt);
		this.mm.mock(SelfFieldUtil, 'hasSoldiersDispatched', g_hasSoldiersDispatchedRt);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(SelfFieldSender, 'sendStartCollect');
		
		this.lc()._onClickStart();
		assertEQ ( this.mm.walkLog, 'hasArmyDispatched,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100058].msg] );
		assertEQ ( this.mm.params['hasArmyDispatched'], [this.lc().m_field] );
		
		this.mm.clear();
		g_hasArmyDispatchedRt[0] = true;
		this.lc()._onClickStart();
		assertEQ ( this.mm.walkLog, 'hasArmyDispatched,hasSoldiersDispatched,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100056].msg] );
		assertEQ ( this.mm.params['hasSoldiersDispatched'], [this.lc().m_field] );
		
		this.mm.clear();
		g_hasSoldiersDispatchedRt[0] = true;
		this.lc()._onClickStart();
		assertEQ ( this.mm.walkLog, 'hasArmyDispatched,hasSoldiersDispatched,sendStartCollect' );
		assertEQ ( this.mm.params['sendStartCollect'], [this.g, 1] );
	};
	
	this.test__onClickStop = function(){
		this.lc().m_field = {gridId:1};
		
		this.mm.mock(SelfFieldSender, 'sendStopCollect');
		this.lc()._onClickStop();
		assertEQ ( this.mm.walkLog, 'sendStopCollect' )
		assertEQ ( this.mm.params['sendStopCollect'], [this.g, 1] );
	};
	
	this.test__onClickGiveUp = function(){
		this.lc().m_field = {gridId:1};
		this.mm.mock(SelfFieldSender, 'sendGiveUpField');
			
		this.lc()._onClickGiveUp();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true);
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendGiveUpField'], [this.g, 1]);
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
		
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
		
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false );
	};	
});

tqSelfFieldDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelfFieldsHdr, 'TestCaseSelfFieldsHdr');
	suite.addTestCase(TestCaseSelfFieldDlg, 'TestCaseSelfFieldDlg');
};
