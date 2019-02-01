/*******************************************************************************/
requireEx('./handler/tqFriendApplyListDlg.js', [
	{
		start:'//FriendApplyListDlg-unittest-start'
		,end:'//FriendApplyListDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'_initDlg'
			,'_createDlg'
			,'_regEvents'
			,'_openDlg'
			,'_initInfo'
			,'_onSvrPkg'
			,'_updateAppyList'
			,'_isShow'
			,'_setApplyListItems'
			,'_setApplyListCallers'
			,'_onClickAgreeApply'
			,'_onClickRejectApply'
		]
	}
]);

TestCaseFriendApplyListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = FriendApplyListDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.friend.applylistdlg.title, pos:{x:"center", y:30}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.friend.applylistdlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.FRIEND, this.dlg, this.lc()._onSvrPkg]);
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );	
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_updateAppyList' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_updateAppyList' );
	};
	
	this.test__updateAppyList = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow);
		this.mm.mock(this.lc(), '_setApplyListItems' );
		this.mm.mock(this.lc(), '_setApplyListCallers' );
		this.lc()._updateAppyList();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateAppyList();
		assertEQ ( this.mm.walkLog, '_isShow,_setApplyListItems,_setApplyListCallers' );
	};
	
	this.test__setApplyListItems = function(){
		this.g.getImgr().getFriends().applys = [{roleName:'role1',level:1,sex:0,gridId:1},{roleName:'role2',level:2,sex:1,gridId:2}];
		this.lc()._setApplyListItems();
		assertEQ ( this.lc().m_items.list.getCount(), 2);
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.sex), '男' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.cood), '0,0' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.level), 2 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.sex), '女' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.cood), '1,0' );
	};
	
	this.test__setApplyListCallers = function(){
		this.lc().m_items.list.setItemCount(1);
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.agreeBtn, 'setId');
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.agreeBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.rejectBtn, 'setId');
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.rejectBtn, 'setCaller');
		this.lc()._setApplyListCallers();
		assertEQ ( this.mm.walkLog, 'setId,setId,setCaller,setCaller' );
		assertEQ ( this.mm.params['setId.0'], [0] );
		assertEQ ( this.mm.params['setId.1'], [0] );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickAgreeApply}] );
		assertEQ ( this.mm.params['setCaller.0.self'], this.lc().m_items.list.getItem(0).exsubs.agreeBtn );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickRejectApply}] );
		assertEQ ( this.mm.params['setCaller.1.self'], this.lc().m_items.list.getItem(0).exsubs.rejectBtn );
	};
	
	this.test__onSvrPkg = function(){
		var p_netevent = {data:{applys:[]}};
		this.mm.mock(TQ, 'dictCopy' );
		this.mm.mock(this.lc(), '_updateAppyList' );
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.mm.walkLog, 'dictCopy,_updateAppyList' );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getFriends().applys, p_netevent.data.applys] );
		
		this.mm.clear();
		p_netevent = {data:{}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__onClickAgreeApply = function(){
		this.g.getImgr().getFriends().applys = [{roleId:10000,roleName:'role1',level:1,sex:0,gridId:1}];
		this.mm.mock(FriendSender, 'sendAgreeApplyFriend' );
		this.lc()._onClickAgreeApply(0);
		assertEQ ( this.mm.params['sendAgreeApplyFriend'], [this.g, 10000] );
	};
	
	this.test__onClickRejectApply = function(){
		this.g.getImgr().getFriends().applys = [{roleId:10000,roleName:'role1',level:1,sex:0,gridId:1}];
		this.mm.mock(FriendSender, 'sendRejectApplyFriend' );
		this.lc()._onClickRejectApply(0);
		assertEQ ( this.mm.params['sendRejectApplyFriend'], [this.g, 10000] );
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true);
		
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false);
		
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false);
	};	
});

tqFriendApplyListDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseFriendApplyListDlg, 'TestCaseFriendApplyListDlg');
};
