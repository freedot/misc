requireEx('./handler/tqSelectExpedTargetDlg.js', [
	{
		start:'//SelectExpedTargetDlg-unittest-start'
		,end:'//SelectExpedTargetDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_typeRess'
			,'m_caller'
			,'m_targetSpec'
			,'m_openPageIdxs'
			,'_setParams'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_openPage'
			,'_onFavoriteUpdate'
			,'_onEnemyUpdate'
			,'_onSuccCopyFieldsNet' 
			,'_setTabsName' 
			,'_setCopyFieldTypeList' 
			,'_setEnemyTypeList' 
			,'_setCallers' 
			,'_setTabListCaller' 
			,'_setCopyFieldTypeListCaller' 
			,'_setEnemyTypeListCaller' 
			,'_setBtnsCaller' 
			,'_onActiveTab' 
			,'_onSelectCopyFieldList' 
			,'_onSelectEnemyTypeList' 
			,'_onDeleteFavoriteItem' 
			,'_onClickConfirmBtn' 
			,'_onClickCancelBtn' 
			,'_isSuccCopyField' 
			,'_setFavoriteListItems' 
			,'_setEnemyListItems' 
			,'_getCurSelTarget' 
			,'_getCurSelField' 
			,'_getCurSelTabIdx' 
			,'_getCurSelTypeIdx' 
			,'_getCurSelTargetIdx' 
			,'_getCurSelCopyFieldTarget' 
			,'_getCurSelFavoriteTarget' 
			,'_getCurSelEnemyTarget' 
			,'_setFavoriteEnemyListItem' 
			,'_initCopyFieldTypeRess' 
			,'_setDeleteBtnEnableState' 
			,'_setTargetListCaller' 
			,'_onSelectTargetList' 
			]
	}
]);

TestCaseSelectExpedTargetDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SelectExpedTargetDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.lc()._initDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};

	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
			
		var dlg = SelectExpedTargetDlg.snew(this.g);

		assert ( this.mm.walkLog == 'regEvent,regEvent,regEvent' );
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.FAVORITE_UPDATE, 0, dlg.lc().m_this, dlg.lc()._onFavoriteUpdate] );
		assertListEQ ( this.mm.params['regEvent.1'], [EVT.ENEMY_UPDATE, 0, dlg.lc().m_this, dlg.lc()._onEnemyUpdate] );
		assertListEQ ( this.mm.params['regEvent.2'], [EVT.NET, NETCMD.MILITARY, dlg.lc().m_this, dlg.lc()._onSuccCopyFieldsNet] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_setParams');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc(), '_openPage');
		
		var targetSpec = {name:'spec'};
		var openPage = {tabIdx:0,typeListIdx:0};
		this.dlg.openDlg(targetSpec, openPage);
		assertEQ ( this.mm.walkLog, '_setParams,_initDlg,_openDlg,_initInfo,_openPage' );
		assertEQ ( this.mm.params['_setParams'], [targetSpec, openPage] );
	};
	
	this.test_setCaller = function(){
		this.dlg.setCaller(this);
		assert ( this.lc().m_caller == this );
	};
	
	this.test__setParams = function(){
		var targetSpec = {name:'spec'};
		var openPage = {tabIdx:0,typeListIdx:0};
		this.lc()._setParams(targetSpec, openPage);
		assertEQ ( this.lc().m_targetSpec, targetSpec );
		assertEQ ( this.lc().m_openPageIdxs, openPage );
	};
	
	this.test__initDlg = function(){
		var g_dlg = {};
		this.lc().m_dlg = null;
		this.mm.mock(Dialog, 'snew', [g_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg');
		
		this.mm.mock(this.lc(), '_setTabsName');
		this.mm.mock(this.lc(), '_setCopyFieldTypeList');
		this.mm.mock(this.lc(), '_setEnemyTypeList');
		this.mm.mock(this.lc(), '_setCallers');
		
		this.lc()._initDlg();
		assert ( this.mm.walkLog == 'snew,initDlg,_setTabsName,_setCopyFieldTypeList,_setEnemyTypeList,_setCallers' );
		assertListEQ ( this.mm.params['snew'], [ this.g, {modal:true, title:rstr.selectexpedtarget.title, pos:{x:"center", y:30} } ] );
		assertListEQ ( this.mm.params['initDlg'], [ g_dlg, uicfg.expedition.selecttarget, this.lc().m_items] );
		
		this.mm.clear();
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '', 'init only one time');
	};
	
	this.test__openDlg = function(){
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._openDlg();
		assert ( this.mm.walkLog == 'show' );
	};
	
	this.test__setTabsName = function(){
		this.lc()._setTabsName();
		for ( var i=0; i<rstr.selectexpedtarget.tabs.length; ++i ){
			assert ( this.lc().m_items.tablist.getTabText(i) == rstr.selectexpedtarget.tabs[i] );
		}
	};
	
	this.test__setCopyFieldTypeList = function(){
		this.lc().m_typeRess = [{typename:'name1'},{typename:'name2'}];
		this.lc()._setCopyFieldTypeList();
		var items = this.lc().m_items.tablist.getTabItems(0);
		assert ( items.typelist.getCount() == 2 );
		assert ( TQ.getTextEx(items.typelist.getItem(0).exsubs.name) == 'name1' );
		assert ( TQ.getTextEx(items.typelist.getItem(1).exsubs.name) == 'name2' );
	};
	
	this.test__setEnemyTypeList = function(){
		this.lc()._setEnemyTypeList();
		var items = this.lc().m_items.tablist.getTabItems(1);
		assert ( items.typelist.getCount() == rstr.selectexpedtarget.lbl.emenytypes.length );
		assert ( TQ.getTextEx(items.typelist.getItem(0).exsubs.name) == rstr.selectexpedtarget.lbl.emenytypes[0] );
		assert ( TQ.getTextEx(items.typelist.getItem(1).exsubs.name) == rstr.selectexpedtarget.lbl.emenytypes[1] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc(), '_setTabListCaller');
		this.mm.mock(this.lc(), '_setCopyFieldTypeListCaller');
		this.mm.mock(this.lc(), '_setEnemyTypeListCaller');
		this.mm.mock(this.lc(), '_setTargetListCaller');
		this.mm.mock(this.lc(), '_setBtnsCaller');
		
		this.lc()._setCallers();
		assert ( this.mm.walkLog == '_setTabListCaller,_setCopyFieldTypeListCaller,_setEnemyTypeListCaller,_setTargetListCaller,_setBtnsCaller' );
	};
	
	this.test__setTabListCaller = function(){
		this.mm.mock(this.lc().m_items.tablist, 'setCaller');
		this.lc()._setTabListCaller();
		assert ( this.mm.walkLog == 'setCaller' );
		assertListEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onActiveTab}] );
	};
	
	this.test__setCopyFieldTypeListCaller = function(){
		var items = this.lc().m_items.tablist.getTabItems(0);
		this.mm.mock(items.typelist, 'setCaller');
		this.lc()._setCopyFieldTypeListCaller();
		assert ( this.mm.walkLog == 'setCaller' );
		assertListEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectCopyFieldList}] );
	};
	
	this.test__setEnemyTypeListCaller = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		this.mm.mock(items.typelist, 'setCaller');
		this.lc()._setEnemyTypeListCaller();
		assertEQ ( this.mm.walkLog, 'setCaller' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectEnemyTypeList}] );
	};
	
	this.test__setTargetListCaller = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		this.mm.mock(items.targetlist, 'setCaller');
		this.lc()._setTargetListCaller();
		assertEQ ( this.mm.walkLog, 'setCaller' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectTargetList}] );	
	};
	
	this.test__setBtnsCaller = function(){
		this.mm.mock(this.lc().m_items.deleteBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.confirmBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.cancelBtn, 'setCaller');
		this.lc()._setBtnsCaller();
		assert ( this.mm.walkLog == 'setCaller,setCaller,setCaller' );
		assertListEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onDeleteFavoriteItem}] );
		assertListEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickConfirmBtn}] );
		assertListEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickCancelBtn}] );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(MilitarySender, 'sendGetFavorites');
		this.lc()._initInfo();
		assert ( this.mm.walkLog == 'sendGetFavorites' );
		assertListEQ ( this.mm.params['sendGetFavorites'], [this.g] );
	};
	
	this.test__openPage = function(){
		this.mm.mock(this.lc().m_items.tablist, 'activeTab');
		this.mm.mock(this.lc().m_items.tablist.getTabItems(1).typelist, 'setCurSel');
		this.lc().m_openPageIdxs = {tabIdx:1, typeListIdx:0};
		this.lc()._openPage();
		assertEQ ( this.mm.params['activeTab'], [1] );
		assertEQ ( this.mm.params['setCurSel'], [0] );
	};
	
	this.test__onActiveTab = function(){
		var g_getCurSelRt = [-1];
		var items = this.lc().m_items.tablist.getTabItems(0);
		this.mm.mock(items.typelist, 'getCurSel', g_getCurSelRt);
		this.mm.mock(items.typelist, 'setCurSel');
		this.mm.mock(this.lc(), '_setDeleteBtnEnableState');
		this.lc()._onActiveTab(0);
		assertEQ( this.mm.walkLog, 'getCurSel,setCurSel,_setDeleteBtnEnableState' );
		assertEQ( this.mm.params['setCurSel'], [0] );
		
		g_getCurSelRt[0] = 1;
		this.lc()._onActiveTab(0);
		assertEQ( this.mm.params['setCurSel'], [1] );
	};
	
	this.test__onSelectCopyFieldList = function(){
		this.lc().m_typeRess = [{typename:'name1'},{typename:'name2'
			,targetlist:[
				{name:'n1', level:1, id:170001, needtime:10}
				,{name:'n2', level:2, id:170002, needtime:20} ]
			}];
		
		var items = this.lc().m_items.tablist.getTabItems(0);
		this.mm.mock(this.lc(), '_isSuccCopyField', null, function(t, id) { 
			if(id==170001) return true;
			else return false; });
		this.mm.mock(items.targetlist, 'setCurSel');
		
		this.lc()._onSelectCopyFieldList(null, 1);
		assert ( this.mm.walkLog == '_isSuccCopyField,_isSuccCopyField,setCurSel' );
		assertListEQ ( this.mm.params['_isSuccCopyField.0'], ['taofa', 170001] );
		assertListEQ ( this.mm.params['_isSuccCopyField.1'], ['taofa', 170002] );
		assertListEQ ( this.mm.params['setCurSel'], [-1] );
		assert ( items.targetlist.getCount() == 2 );
		assert ( TQ.getTextEx(items.targetlist.getItem(0).exsubs.name) == 'n1' ); 
		assert ( TQ.getTextEx(items.targetlist.getItem(0).exsubs.level) == '1' ); 
		assert ( TQ.getTextEx(items.targetlist.getItem(0).exsubs.taofa) == rstr.selectexpedtarget.lbl.fightsucc ); 
		assert ( TQ.getTextEx(items.targetlist.getItem(0).exsubs.needtime) == '00:00:10' ); 
		assert ( TQ.getTextEx(items.targetlist.getItem(1).exsubs.taofa) == rstr.selectexpedtarget.lbl.fightnosucc ); 
		assert ( TQ.getTextEx(items.targetlist.getItem(1).exsubs.needtime) == '00:00:20' ); 
	};
	
	this.test__onSelectEnemyTypeList = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		
		this.mm.mock(this.lc(), '_setFavoriteListItems');
		this.mm.mock(this.lc(), '_setEnemyListItems');
		this.mm.mock(items.targetlist, 'setCurSel');
		this.mm.mock(this.lc(), '_setDeleteBtnEnableState');
		
		this.lc()._onSelectEnemyTypeList(null, 0);
		assert ( this.mm.walkLog == '_setFavoriteListItems,setCurSel,_setDeleteBtnEnableState' );
		assertListEQ( this.mm.params['setCurSel'], [-1] );
		
		this.mm.clear();
		this.lc()._onSelectEnemyTypeList(null, 1);
		assert ( this.mm.walkLog == '_setEnemyListItems,setCurSel,_setDeleteBtnEnableState' );
		assertListEQ( this.mm.params['setCurSel'], [-1] );
	};
	
	this.test__onSelectTargetList = function(){
		this.mm.mock( this.lc(), '_setDeleteBtnEnableState' );
		this.lc()._onSelectTargetList();
		assertEQ ( this.mm.walkLog, '_setDeleteBtnEnableState' );
	};
	
	this.test__onDeleteFavoriteItem = function(){
		var g_getCurSelField = [{gridId:1}];
		this.mm.mock(this.lc(), '_getCurSelField', g_getCurSelField);
		this.mm.mock(MilitarySender, 'sendDelFavoriteTarget');

		this.lc()._onDeleteFavoriteItem();
		assertListEQ( this.mm.params['sendDelFavoriteTarget'], [this.g, 1] );
		
		this.mm.clear();
		g_getCurSelField[0] = null;
		this.lc()._onDeleteFavoriteItem();
		assert ( this.mm.walkLog == '_getCurSelField' );
	};
	
	this.test__onClickConfirmBtn = function(){
		var TargetSpec = Class.extern(function(){
			this.isSatisfiedBy = function(field) {
			};
			this.getInvalidTip = function(){
				return 'invalid tip';
			};
		});
		
		var targetSpec = TargetSpec.snew();
		this.lc()._setParams(targetSpec);
		
		var r_isSatisfiedBy = [true];
		var r_getCurSelField = [{id:1}];
		this.mm.mock(targetSpec, 'isSatisfiedBy', r_isSatisfiedBy);
		this.mm.mock(this.lc(), '_getCurSelField', r_getCurSelField);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(this.lc().m_dlg, 'hide');
		
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.mm.walkLog , '_getCurSelField,isSatisfiedBy,hide' );
		assertEQ ( this.mm.params['isSatisfiedBy'], [{id:1}]);
		
		this.mm.clear();
		var g_target = null;
		this.dlg.setCaller({self:this, caller:function(target) { g_target=target;} });
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.mm.walkLog , '_getCurSelField,isSatisfiedBy,_getCurSelField,hide' );
		assertEQ ( g_target , r_getCurSelField[0] );
		
		this.mm.clear();
		r_isSatisfiedBy[0] = false;
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.mm.walkLog , '_getCurSelField,isSatisfiedBy,sysMsgTips' );
		assertEQ( this.mm.params['sysMsgTips'], [SMT_WARNING, 'invalid tip'] );
	};
	
	this.test__onClickCancelBtn = function(){
		this.mm.mock(this.lc().m_dlg, 'hide');
		this.lc()._onClickCancelBtn();
		assert ( this.mm.walkLog == 'hide' );
	};
	
	this.test__getCurSelTarget = function(){
		this.mm.mock(this.lc(), '_getCurSelField', [{name:'field'}] );
		this.mm.mock(ExpedUtil, 'makeExpedTarget', [{name:'target'}] );
		assertEQ ( this.lc()._getCurSelTarget(), {name:'target'} );
		assertEQ ( this.mm.params['makeExpedTarget'], [{name:'field'}] );
	};
	
	this.test__getCurSelField = function(){
		var g_getCurSelTabIdxRt = [0];
		var g_getCurSelTypeIdxRt = [0];
		this.mm.mock(this.lc(), '_getCurSelTabIdx', g_getCurSelTabIdxRt);
		this.mm.mock(this.lc(), '_getCurSelTypeIdx', g_getCurSelTypeIdxRt);
		this.mm.mock(this.lc(), '_getCurSelTargetIdx', [10]);
		this.mm.mock(this.lc(), '_getCurSelCopyFieldTarget', [1]);
		this.mm.mock(this.lc(), '_getCurSelFavoriteTarget', [2]);
		this.mm.mock(this.lc(), '_getCurSelEnemyTarget', [3]);
		
		assert ( this.lc()._getCurSelField() == 1 );
		assertListEQ( this.mm.params['_getCurSelCopyFieldTarget'], [0,10] );
		
		this.mm.clear();
		g_getCurSelTabIdxRt[0] = 1;
		assert ( this.lc()._getCurSelField() == 2 );
		assertListEQ( this.mm.params['_getCurSelFavoriteTarget'], [10] );
		
		this.mm.clear();
		g_getCurSelTypeIdxRt[0] = 1;
		assert ( this.lc()._getCurSelField() == 3 );
		assertListEQ( this.mm.params['_getCurSelEnemyTarget'], [10] );
		
		this.mm.clear();
		g_getCurSelTypeIdxRt[0] = 2;
		assert ( this.lc()._getCurSelField() == null );
	};
	
	this.test__getCurSelTabIdx = function(){
		this.mm.mock(this.lc().m_items.tablist, 'getActiveTab', [1]);
		assert ( this.lc()._getCurSelTabIdx() == 1 );
	};
	
	this.test__getCurSelTypeIdx = function(){
		this.mm.mock(this.lc(), '_getCurSelTabIdx', [0]);
		var items = this.lc().m_items.tablist.getTabItems(0);
		this.mm.mock(items.typelist, 'getCurSel', [100]);
		assert ( this.lc()._getCurSelTypeIdx() == 100 );		
	};
	
	this.test__getCurSelTargetIdx = function(){
		this.mm.mock(this.lc(), '_getCurSelTabIdx', [0]);
		var items = this.lc().m_items.tablist.getTabItems(0);
		this.mm.mock(items.targetlist, 'getCurSel', [100]);
		assert ( this.lc()._getCurSelTargetIdx() == 100 );		
	};
	
	this.test__getCurSelCopyFieldTarget = function(){
		this.lc().m_typeRess = [{typename:'name1', targetlist:[{ id:170001, name:'n1', level:1, needtime:10}] }];
		assertEQ ( this.lc()._getCurSelCopyFieldTarget(100, 0), null );
		assertEQ ( this.lc()._getCurSelCopyFieldTarget(0, 1), null );
		assertEQ ( this.lc()._getCurSelCopyFieldTarget(0, 0), this.lc().m_typeRess[0].targetlist[0] );
	};
	
	this.test__getCurSelFavoriteTarget = function(){
		var g_favorites = [{id:1,objType:OBJ_TYPE.ROLE}];
		this.mm.mock(this.g.getImgr(), 'getTargetsFavorite', [g_favorites]);
		assertEQ ( this.lc()._getCurSelFavoriteTarget(0), g_favorites[0] );
	};
	
	this.test__getCurSelEnemyTarget = function(){
		var g_enemys = [
			{id:1,objType:OBJ_TYPE.ROLE}
			,{id:2,objType:OBJ_TYPE.NONE}
			,{id:3,objType:OBJ_TYPE.ROLE}
			,{id:4,objType:OBJ_TYPE.ROLE}
			,{id:5,objType:OBJ_TYPE.ROLE}
			,{id:6,objType:OBJ_TYPE.ROLE}
			,{id:7,objType:OBJ_TYPE.ROLE}
			,{id:8,objType:OBJ_TYPE.ROLE}
			,{id:9,objType:OBJ_TYPE.ROLE}
			,{id:10,objType:OBJ_TYPE.ROLE}
			,{id:11,objType:OBJ_TYPE.ROLE}
			];
		this.mm.mock(this.g.getImgr(), 'getEnemys', [g_enemys]);
			
		var items = this.lc().m_items.tablist.getTabItems(1);
		items.typelist.setCurSel(1);
		
		assertEQ ( this.lc()._getCurSelEnemyTarget(0), null );
		assertEQ ( this.lc()._getCurSelEnemyTarget(1), g_enemys[2] );
	};
	
	this.test__setFavoriteListItems = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		
		var g_favorites = [{id:1},{id:2}];
		this.mm.mock(this.g.getImgr(), 'getTargetsFavorite', [g_favorites]);
		this.mm.mock(this.lc(), '_setFavoriteEnemyListItem');
		this.lc()._setFavoriteListItems();
		assertEQ ( this.mm.walkLog, 'getTargetsFavorite,_setFavoriteEnemyListItem,_setFavoriteEnemyListItem' );
		assertEQ ( this.mm.params['_setFavoriteEnemyListItem.0'], [items.targetlist.getItem(0), g_favorites[0]] );
		assertEQ ( this.mm.params['_setFavoriteEnemyListItem.1'], [items.targetlist.getItem(1), g_favorites[1]] );
	};
	
	this.test__onSuccCopyFieldsNet = function(){
		this.mm.mock(TQ, 'dictCopy' );
		
		var netEvent = {data:{}};
		this.lc()._onSuccCopyFieldsNet(netEvent);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		var netEvent = {data:{succcopyfields:{}}};
		this.lc()._onSuccCopyFieldsNet(netEvent);
		assertEQ ( this.mm.walkLog, 'dictCopy' );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getSuccCopyFields(), netEvent.data.succcopyfields] );
	};
	
	this.test__onFavoriteUpdate = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		
		var r_isShow = [false];
		this.mm.mock(this.dlg, 'isShow', r_isShow);
		this.mm.mock(this.lc(), '_setFavoriteListItems');
		this.mm.mock(items.targetlist, 'setCurSel');
		
		this.lc()._onFavoriteUpdate();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._onFavoriteUpdate();
		assertEQ ( this.mm.walkLog, 'isShow,_setFavoriteListItems,setCurSel' );
		assertEQ ( this.mm.params['setCurSel'], [-1] );
	};
	
	this.test__onEnemyUpdate = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		
		var r_isShow = [false];
		this.mm.mock(this.dlg, 'isShow', r_isShow);
		this.mm.mock(this.lc(), '_setEnemyListItems');
		this.mm.mock(items.targetlist, 'setCurSel');
		
		this.lc()._onEnemyUpdate();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._onEnemyUpdate();
		assertEQ ( this.mm.walkLog, 'isShow,_setEnemyListItems,setCurSel' );
		assertEQ ( this.mm.params['setCurSel'], [-1] );	
	};
	
	this.test__setEnemyListItems = function(){
		var items = this.lc().m_items.tablist.getTabItems(1);
		
		var g_enemys = [{id:1},{id:2}];
		this.mm.mock(this.g.getImgr(), 'getEnemys', [g_enemys]);
		this.mm.mock(this.lc(), '_setFavoriteEnemyListItem');
		this.lc()._setEnemyListItems();
		assertEQ ( this.mm.walkLog, 'getEnemys,_setFavoriteEnemyListItem,_setFavoriteEnemyListItem' );
		assertEQ ( this.mm.params['_setFavoriteEnemyListItem.0'], [items.targetlist.getItem(0), g_enemys[0]] );
		assertEQ ( this.mm.params['_setFavoriteEnemyListItem.1'], [items.targetlist.getItem(1), g_enemys[1]] );	
	};
	
	this.test__setFavoriteEnemyListItem = function(){
		this.mm.mock(ExpedTargetUtil, 'getMoveNeedTime', [10]);
		this.mm.mock(FieldUtil, 'getFieldName', ['fieldName']);
		this.mm.mock(this.g.getImgr(), 'getFightRefState', [REF_ROLESTATE.NORMAL]);
		
		TestCaseCondition.setPreCond(null, {rolepos:{x:338,y:160}});
		
		var items = this.lc().m_items.tablist.getTabItems(1);
		items.targetlist.setItemCount(1);
		var listItem = items.targetlist.getItem(0);
		var g_target = {gridId:257*600+313+1, roleName:'name'};
		this.lc()._setFavoriteEnemyListItem(listItem, g_target);
		assertEQ( this.mm.params['getMoveNeedTime'], [this.g, {x:313, y:257}, res_army_movespeed, 0] );
		
		assertEQ( TQ.getTextEx(listItem.exsubs.name), 'name' );
		assertEQ( TQ.getTextEx(listItem.exsubs.fieldType), 'fieldName' );
		var cood = '#[m:313:257]';
		assertEQ( TQ.getTextEx(listItem.exsubs.cood), HyperLinkMgr.formatLink(cood) );
		assertEQ( TQ.getTextEx(listItem.exsubs.refstate), rstr.selectexpedtarget.lbl.refstate[0] );
		assertEQ( TQ.getTextEx(listItem.exsubs.needtime), '00:00:10' );
		
		
		g_target = {gridId:2, roleName:''};
		this.lc()._setFavoriteEnemyListItem(listItem, g_target);
		assertEQ( TQ.getTextEx(listItem.exsubs.name), '--' );
	};
	
	this.test__setFavoriteEnemyListItem_diffCountry = function(){
		this.mm.mock(ExpedTargetUtil, 'getMoveNeedTime', [10]);
		this.mm.mock(FieldUtil, 'getFieldName', ['fieldName']);
		this.mm.mock(this.g.getImgr(), 'getFightRefState', [REF_ROLESTATE.NORMAL]);
		
		TestCaseCondition.setPreCond(null, {rolepos:{x:341,y:268}});
		
		var items = this.lc().m_items.tablist.getTabItems(1);
		items.targetlist.setItemCount(1);
		var listItem = items.targetlist.getItem(0);
		var g_target = {gridId:40*600+134+1, roleName:'name'};
		this.lc()._setFavoriteEnemyListItem(listItem, g_target);
		assertEQ( TQ.getTextEx(listItem.exsubs.refstate), rstr.selectexpedtarget.lbl.refstate[0]+rstr.selectexpedtarget.lbl.countryFight );
		assertEQ( TQ.getTextEx(listItem.exsubs.needtime), '00:15:00' );
	};

	
	this.test__isSuccCopyField = function(){
		this.g.getImgr().getSuccCopyFields()['taofa'] = [1];
		assertEQ ( this.lc()._isSuccCopyField('taofa', 1), true );
		assertEQ ( this.lc()._isSuccCopyField('taofa', 0), false );
	};
	
	this.test__initCopyFieldTypeRess = function(){
		res_copyfields = [{typename:'a', id:1},{typename:'a', id:2},{typename:'b', id:3}];
		this.lc()._initCopyFieldTypeRess();
		assertEQ ( this.lc().m_typeRess, [{typename:'a', targetlist:[{typename:'a', id:1},{typename:'a', id:2}]},{typename:'b', targetlist:[{typename:'b', id:3}]}] );
	};
	
	this.test__setDeleteBtnEnableState = function(){
		var g_getCurSelTabIdxRt = [0];
		var g_getCurSelTypeIdxRt = [0];
		var g_getCurSelTargetIdxRt = [0];
		this.mm.mock(this.lc(), '_getCurSelTabIdx', g_getCurSelTabIdxRt);
		this.mm.mock(this.lc(), '_getCurSelTypeIdx', g_getCurSelTypeIdxRt);
		this.mm.mock(this.lc(), '_getCurSelTargetIdx', g_getCurSelTargetIdxRt);
		this.mm.mock(this.lc().m_items.deleteBtn, 'enable');
		
		this.lc()._setDeleteBtnEnableState();
		assertEQ ( this.mm.params['enable'], [false] );
		
		this.mm.clear();
		g_getCurSelTabIdxRt[0] = 1;
		g_getCurSelTypeIdxRt[0] = 1;
		this.lc()._setDeleteBtnEnableState();
		assertEQ ( this.mm.params['enable'], [false] );
		
		this.mm.clear();
		g_getCurSelTabIdxRt[0] = 1;
		g_getCurSelTypeIdxRt[0] = 0;
		g_getCurSelTargetIdxRt[0] = -1;
		this.lc()._setDeleteBtnEnableState();
		assertEQ ( this.mm.params['enable'], [false] );
		
		this.mm.clear();
		g_getCurSelTargetIdxRt[0] = 0;
		this.lc()._setDeleteBtnEnableState();
		assertEQ ( this.mm.params['enable'], [true] );
	};
});

tqSelectExpedTargetDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelectExpedTargetDlg, 'TestCaseSelectExpedTargetDlg');
};