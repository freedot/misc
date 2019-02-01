/*******************************************************************************/
requireEx('./handler/tqSelfFieldsListDlg.js', [
	{
		start:'//SelfFieldsListDlg-unittest-start'
		,end:'//SelfFieldsListDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'_regEvents'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_onSelfFieldUpdate'
			,'_updateFieldList'
			,'_setFieldListItems'
			,'_setFieldListCallers'
			,'_isShow'
			,'_getDispatchArmyHero'
			,'_getFieldName'
			,'_getCollectStateStr'
			,'_onClickEnter'
			]
	}
]);

TestCaseSelfFieldsListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SelfFieldsListDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.lc()._initDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.dlg.init ( this.g );
		assertEQ ( this.mm.walkLog, '_regEvents');
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.SELFFIELD_UPDATE, 0, this.dlg, this.lc()._onSelfFieldUpdate] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.PERSONAL_ARMY_UPDATE, 0, this.dlg, this.lc()._onSelfFieldUpdate] );
	};
	
	this.test__initDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.lc().m_dlg = null;
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:false, title:rstr.field.selffieldslistdlg.title , pos:{x:'center', y:50}} ]); 
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.field.selffieldslistdlg, this.lc().m_items] ); 
		
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '', 'only create one time' );
	};	
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_updateFieldList');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_updateFieldList' );
	};		
	
	this.test__onSelfFieldUpdate = function(){
		var g_isShowRt = [false];
		this.mm.mock( this.lc(), '_isShow', g_isShowRt );
		this.mm.mock(this.lc(), '_updateFieldList');
		this.lc()._onSelfFieldUpdate();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		g_isShowRt[0] = true;
		this.lc()._onSelfFieldUpdate();
		assertEQ ( this.mm.walkLog, '_isShow,_updateFieldList' );
	};
	
	this.test__updateFieldList = function(){
		this.mm.mock(this.lc(), '_setFieldListItems');
		this.mm.mock(this.lc(), '_setFieldListCallers');
		this.lc()._updateFieldList();
		assertEQ ( this.mm.walkLog, '_setFieldListItems,_setFieldListCallers' );
	};
	
	this.test__setFieldListItems = function(){
		var g_field = {};
		var g_hero = {name:'hero', soldier:{resid:0, number:0}};
		
		this.g.getImgr().getSelfFields().list = [{id:1, resid:170001, level:1, startTime:1},{id:2, resid:170002, level:2, startTime:0}];
		this.mm.mock( FieldUtil, 'makeFieldFromSelfField', [g_field] );
		this.mm.mock( this.lc(), '_getDispatchArmyHero', [g_hero] );
		this.mm.mock( this.lc(), '_getFieldName', ['fieldName'] );
		this.mm.mock( this.lc(), '_getCollectStateStr', ['state'] );
		this.lc()._setFieldListItems();
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.fieldName), 'fieldName' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.heroName), 'hero' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.soldierName), '--' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.soldierNum), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.collectState), 'state' );
		assertEQ ( this.mm.params['makeFieldFromSelfField.0'], [this.g.getImgr().getSelfFields().list[0]]);
		assertEQ ( this.mm.params['_getDispatchArmyHero.0'], [g_field]);
		assertEQ ( this.mm.params['_getFieldName.0'], [g_field]);
		assertEQ ( this.mm.params['_getCollectStateStr.0'], [this.g.getImgr().getSelfFields().list[0]]);
		assertEQ ( this.mm.params['makeFieldFromSelfField.1'], [this.g.getImgr().getSelfFields().list[1]]);
	};
	
	this.test__getDispatchArmyHero = function(){
		var g_field = {};
		var g_getCurDispatchHeroRt = [null];
		this.mm.mock(SelfFieldUtil, 'getCurDispatchHero', g_getCurDispatchHeroRt);
		assertEQ ( this.lc()._getDispatchArmyHero(g_field), {name:'--', soldier:{resid:0, number:0}} );
		
		var g_hero = {};
		g_getCurDispatchHeroRt[0] = g_hero;
		assertEQ ( this.lc()._getDispatchArmyHero(g_field), g_hero );
	};
	
	this.test__getFieldName = function(){
		this.mm.mock(FieldUtil, 'getFieldName', ['fieldName']);
		
		var g_field = {gridId:1};
		assertEQ ( this.lc()._getFieldName(g_field), 'fieldName(0,0)' );
		assertEQ ( this.mm.params['getFieldName'], [g_field] );
	};
	
	this.test__getCollectStateStr = function(){
		var selfField = {};
		assertEQ ( this.lc()._getCollectStateStr(selfField), rstr.field.selffieldslistdlg.lbl.stopCollect );
		
		var selfField = {startTime:0};
		assertEQ ( this.lc()._getCollectStateStr(selfField), rstr.field.selffieldslistdlg.lbl.stopCollect );
		
		var selfField = {startTime:1};
		assertEQ ( this.lc()._getCollectStateStr(selfField), rstr.field.selffieldslistdlg.lbl.collecting );
	};
	
	this.test__setFieldListCallers = function(){
		this.lc().m_items.list.setItemCount(1);
		this.mm.mock ( this.lc().m_items.list.getItem(0).exsubs.enterBtn, 'setId' );
		this.mm.mock ( this.lc().m_items.list.getItem(0).exsubs.enterBtn, 'setCaller' );
		this.lc()._setFieldListCallers();
		assertEQ ( this.mm.walkLog, 'setId,setCaller' );
		assertEQ ( this.mm.params['setId'], [0]);
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickEnter}]);
	};
	
	this.test__onClickEnter = function(){
		this.g.getImgr().getSelfFields().list = [{id:1, resid:170001, level:1, startTime:1}];
		
		var dlg = MockDialog.snew(this.g);
		UIM.regDlg('selffield', dlg);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock(FieldUtil, 'makeFieldFromSelfField', [{gridId:1}]);
		
		this.lc()._onClickEnter(0);
		assertEQ ( this.mm.params['makeFieldFromSelfField'], [ this.g.getImgr().getSelfFields().list[0] ] );
		assertEQ ( this.mm.params['openDlg'], [{gridId:1}]);
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

tqSelfFieldsListDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelfFieldsListDlg, 'TestCaseSelfFieldsListDlg');
};
