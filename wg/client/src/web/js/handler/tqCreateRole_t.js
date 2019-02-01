requireEx('./handler/tqCreateRole.js', [
	{
		start:'//CreateRoleDlg-unittest-start'
		,end:'//CreateRoleDlg-unittest-end'
		,items:['m_g'
			, 'm_this'
			, 'm_dlg'
			, 'm_isvalidrole'
			, 'm_items'
			, '_initDlg'
			, '_initInfo'
			, '_showDlg'
			, '_onSvrPkg'
			, '_onSvrValidCheck'
			, '_createDlg'
			, '_setBtnType'
			, '_setCallers'
			, '_setListItems'
			, '_initInputLength'
			, '_onClickList'
			, '_onClickEnterGame'
			, '_doCheckNameValid'
			, '_onFinishCreate'
			, '_getCurSelIcon'
			, '_setListItemIcon'
			, '_setListItemBtnCallers'
			, '_onClickSelectIconBtn'
			, '_onSelectIconCallback'
			, '_onRoleNameChange'
			, '_isShow'
			, '_onClickGetRandName'
			, '_setRoleName'
			]
	}
]);

TestCaseCreateRole = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = CreateRoleDlg.snew(this.g);
		TQ.setDomSize(TQ.getUiBody(), 2048, 1536);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		res_role_icons = [{id:0, icon:[101,201]},{id:1, icon:[102,202]}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
		TQ.setDomSize(TQ.getUiBody(), 0, 0);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.walkLog, 'regEvent' );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.CREATEROLE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc(), '_showDlg');
		this.mm.mock(g_loading, 'hide');
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_initInfo,_showDlg,hide' );
	};
	
	this.test_resize = function(){
		this.lc().m_dlg.hide();
		var size = {cx:1000, cy:600};
		this.dlg.resize(size);
		assertEQ ( this.lc().m_dlg.getPosition(), {x:0, y:0} );
		
		this.lc().m_dlg.show();
		this.dlg.resize(size);
		assertEQ ( this.lc().m_dlg.getPosition(), {x:(1000-2048)/2, y:0} );
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
		
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
		
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false );
	};
	
	this.test__initDlg = function(){
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setBtnType');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setListItems');
		this.mm.mock(this.lc(), '_initInputLength');
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setBtnType,_setCallers,_setListItems,_initInputLength' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, pos:{x:'center', y:0}, uiback:uiback.dlg.noborder}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.createrole, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);	
	};
	
	this.test__setBtnType = function(){
		this.mm.mock(this.lc().m_items.randName, 'setDelay' );
		this.lc()._setBtnType();
		assertEQ ( this.lc().m_items.randName.getType(),  BTN_TYPE.DELAY);
		assertEQ ( this.mm.params['setDelay'], [500] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.list, 'setCaller');
		this.mm.mock(this.lc().m_items.entergame, 'setCaller');
		this.mm.mock(this.lc().m_items.randName, 'setCaller');
		this.mm.mock(TQ, 'addEvent');
		this.mm.mock(this.lc(), '_setListItemBtnCallers');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,_setListItemBtnCallers' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickList}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickEnterGame}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickGetRandName}] );
	};
	
	this.test__setListItemBtnCallers = function(){
		this.mm.mock( this.lc().m_items.list.getItem(0).exsubs.selectIcon, 'setCaller' );
		this.mm.mock( this.lc().m_items.list.getItem(1).exsubs.selectIcon, 'setCaller' );
		this.lc()._setListItemBtnCallers();
		assertEQ ( this.lc().m_items.list.getItem(0).exsubs.selectIcon.getId(), 0);
		assertEQ ( this.lc().m_items.list.getItem(1).exsubs.selectIcon.getId(), 1);
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickSelectIconBtn}] )
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickSelectIconBtn}] )
	};
	
	this.test__setListItems = function(){
		this.mm.mock(Math, 'random', [0.2] );
		this.lc()._setListItems();
		var iconIdx0 =  Math.floor(res_role_icons.length*0.2);
		var iconId0 = res_role_icons[iconIdx0].icon[0];
		var iconIdx1 =  Math.floor(res_role_icons.length*0.2);
		var iconId1 = res_role_icons[iconIdx0].icon[1];
		assertEQ ( this.lc().m_items.list.getItem(0).exsubs.iconId, iconId0);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(0).exsubs.icon), iconId0 + '.gif'), true);
		assertEQ ( this.lc().m_items.list.getItem(1).exsubs.iconId, iconId1);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(1).exsubs.icon), iconId1 + '.gif'), true);
	};
	
	this.test__setListItemIcon = function(){
		var item = this.lc().m_items.list.getItem(0);
		this.lc()._setListItemIcon(item, 101);
		assertEQ ( item.exsubs.iconId, 101);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), '101.gif'), true);
	};
	
	this.test__initInputLength = function(){
		var callerObj = Caller.snew(this.lc().m_this, this.lc()._onRoleNameChange);
		this.mm.mock(Caller, 'snew', [callerObj] );
		this.mm.mock(InputLimit, 'maxGBKBytes' );
		this.lc()._initInputLength();
		assertEQ ( this.mm.params['maxGBKBytes'], [this.lc().m_items.rolename, JVALID.getMaxUserLen(), callerObj] );
		assertEQ ( this.mm.params['snew'], [this.lc().m_this, this.lc()._onRoleNameChange] );
	};
	
	this.test__onRoleNameChange = function(){
		this.mm.mock(this.lc(), '_doCheckNameValid');
		this.lc().m_items.rolename.value = '';
		this.lc()._onRoleNameChange();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_items.rolename.value = 'a';
		this.lc()._onRoleNameChange();
		assertEQ ( this.mm.walkLog, '_doCheckNameValid' );
		
		this.mm.clear();
		this.lc().m_items.rolename.value = 'a';
		this.lc()._onRoleNameChange();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__initInfo = function(){
		this.lc().m_items.list.setCurSel(1);
		this.lc()._initInfo();
		assertEQ ( this.lc().m_items.list.getCurSel(), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME)  );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__doCheckNameValid = function(){
		this.mm.mock(CreateRoleSender, 'sendCheckName');
		this.lc().m_items.rolename.value = '';
		this.lc()._doCheckNameValid();
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME) );
		
		this.lc().m_items.rolename.value = '1';
		this.lc()._doCheckNameValid();
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.errlength, COLORS.INVALID_ROLE_NAME) );
		
		this.lc().m_items.rolename.value = '1234567890123345';
		this.lc()._doCheckNameValid();
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.errlength, COLORS.INVALID_ROLE_NAME) );
		
		this.lc().m_items.rolename.value = '123\"456';
		this.lc()._doCheckNameValid();
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.invalidchar, COLORS.INVALID_ROLE_NAME) );
		
		this.lc().m_items.rolename.value = '123456';
		this.lc()._doCheckNameValid();
		assertEQ ( this.mm.params['sendCheckName'], [this.g, '123456'] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.dlg, 'openDlg');
		
		this.mm.mock(this.lc(), '_onSvrValidCheck');
		this.mm.mock(this.lc(), '_onFinishCreate');
		
		var netdata = {data:{subid:0}};
		this.lc()._onSvrPkg(netdata);
		assertEQ ( this.mm.walkLog, 'openDlg' );
		
		this.mm.clear();
		netdata = {data:{subid:1}};
		this.lc()._onSvrPkg(netdata);
		assertEQ ( this.mm.walkLog, '_onSvrValidCheck' );
		assertEQ ( this.mm.params['_onSvrValidCheck'], [netdata.data] );
		
		this.mm.clear();
		netdata = {data:{subid:2, randname:"randname"}};
		this.lc()._onSvrPkg(netdata);
		assertEQ ( this.lc().m_items.rolename.value, 'randname' );
		
		this.mm.clear();
		netdata = {data:{subid:99}};
		this.lc()._onSvrPkg(netdata);
		assertEQ ( this.mm.walkLog, '_onFinishCreate' );
		assertEQ ( this.mm.params['_onFinishCreate'], [netdata.data] );
	};
	
	this.test__onSvrValidCheck = function(){
		this.lc().m_items.entergame.enable(false);
		var netdata = {result:'OK'};
		this.lc()._onSvrValidCheck(netdata);
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr(rstr.createroledlg.err.okname, COLORS.VALID_ROLE_NAME) );
		assertEQ ( this.lc().m_isvalidrole, true );
		assertEQ ( this.lc().m_items.entergame.isEnable(), false );
		
		netdata.result = 'error';
		this.lc()._onSvrValidCheck(netdata);
		assertEQ ( TQ.getTextEx(this.lc().m_items.namedesc), TQ.formatColorStr('error', COLORS.INVALID_ROLE_NAME) );
		assertEQ ( this.lc().m_isvalidrole, false );
		assertEQ ( this.lc().m_items.entergame.isEnable(), true );
	};
	
	this.test__setRoleName = function(){
		this.mm.mock(CreateRoleSender, 'sendCheckName');
		this.lc()._setRoleName("randname");
		assertEQ ( this.lc().m_items.rolename.value, 'randname' );
		assertEQ ( this.mm.params['sendCheckName'], [this.g, 'randname'] );
	};
	
	this.test__onFinishCreate = function(){	
		this.lc().m_dlg.show();
		this.lc().m_items.entergame.enable(false);
		this.lc()._onFinishCreate({result:0});
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( this.lc().m_items.entergame.isEnable(), false );
		assertEQ ( this.g.getImgr().isFirstCreateGame(), true );
		
		this.mm.clear();
		this.lc().m_dlg.show();
		this.lc().m_items.entergame.enable(false);
		this.lc()._onFinishCreate({result:1});
		assertEQ ( this.lc().m_dlg.isShow(), true );
		assertEQ ( this.lc().m_items.entergame.isEnable(), true );
	};
	
	this.test__onClickList = function(){
		this.lc()._onClickList(null, 0);
		assertEQ ( this.lc().m_items.list.getItem(0).exsubs.selectIcon.isShow(), true );
		assertEQ ( this.lc().m_items.list.getItem(1).exsubs.selectIcon.isShow(), false );
		
		this.lc()._onClickList(null, 1);
		assertEQ ( this.lc().m_items.list.getItem(0).exsubs.selectIcon.isShow(), false );
		assertEQ ( this.lc().m_items.list.getItem(1).exsubs.selectIcon.isShow(), true );
	};
	
	this.test__onClickGetRandName = function(){
		this.lc().m_items.list.setCurSel(1);
		this.mm.mock(CreateRoleSender, 'sendGetRandName');
		this.lc()._onClickGetRandName();
		assertEQ ( this.mm.params['sendGetRandName'], [this.g, 1] );
	};
	
	this.test__onClickEnterGame = function(){
		this.lc().m_items.rolename.value = 'role';
		this.lc().m_isvalidrole = false;
		this.lc().m_items.entergame.enable(true);
		this.mm.mock(CreateRoleSender, 'sendCreateRole');
		this.mm.mock(this.lc(), '_getCurSelIcon', [102]);
		this.lc()._onClickEnterGame();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( this.lc().m_items.entergame.isEnable(), true );
		
		this.lc().m_isvalidrole = true;
		this.lc().m_items.entergame.enable(true);
		this.lc()._onClickEnterGame();
		assertEQ ( this.mm.params['sendCreateRole'], [this.g, 'role', 102] );
		assertEQ ( this.lc().m_items.entergame.isEnable(), false );
	};
	
	this.test__onClickSelectIconBtn = function(){
		this.lc().m_items.list.getItem(0).exsubs.iconId = 101;
		this.mm.mock(UIM.getDlg('selecticon'), 'setCaller');
		this.mm.mock(UIM.getDlg('selecticon'), 'openDlg');
		this.lc()._onClickSelectIconBtn(0);
		assertEQ ( this.mm.walkLog, 'setCaller,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectIconCallback}] );
		assertEQ ( this.mm.params['openDlg'], [[101, 102], 101 ] );
	};
	
	this.test__onClickSelectIconBtn_onSelectIconCallback = function(){
		this.lc()._onClickSelectIconBtn(0); // init _onSelectIconCallback function
		this.mm.mock(this.lc(), '_setListItemIcon');
		this.lc()._onSelectIconCallback(102);
		assertEQ ( this.mm.params['_setListItemIcon'], [this.lc().m_items.list.getItem(0), 102] );
	};
	
	this.test__getCurSelIcon = function(){
		this.lc().m_items.list.getItem(0).exsubs.iconId = 101;
		this.lc().m_items.list.getItem(1).exsubs.iconId = 201;
		this.lc().m_items.list.setCurSel(0);
		assertEQ ( this.lc()._getCurSelIcon(), 101 );
		this.lc().m_items.list.setCurSel(1);
		assertEQ ( this.lc()._getCurSelIcon(), 201 );
	};

});


tqCreateRole_t_main = function(suite) {
	suite.addTestCase(TestCaseCreateRole, 'TestCaseCreateRole');
};
