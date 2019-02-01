/*******************************************************************************/
requireEx('./handler/tqClickRoleHdr.js', [
	{
		start:'//ClickRoleHdr-unittest-start'
		,end:'//ClickRoleHdr-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_popmenu'
			,'m_cmdCallers'
			,'m_roleId'
			,'m_roleName'
			,'CMD_TALK'
			,'CMD_FRIEND'
			,'CMD_LETTER'
			,'CMD_COPYNAME'
			,'CMD_DETAIL'
			,'_createPopMenu'
			,'_setCallers'
			,'_setCmdCallerMaps'
			,'_onCommand'
			,'_onChat'
			,'_onApplyFriend'
			,'_onWriteLetter'
			,'_onCopyName'
			,'_onShowDetail'
			,'_setRole'
			]
	}
]);

TestCaseClickRoleHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = ClickRoleHdr.snew(this.g);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_createPopMenu')
		this.mm.mock(this.lc(), '_setCallers')
		this.mm.mock(this.lc(), '_setCmdCallerMaps')
		this.hdr.init ( this.g );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.hdr );
		assertEQ ( this.mm.walkLog, '_createPopMenu,_setCallers,_setCmdCallerMaps' );
		assertEQ ( this.mm.params['_createPopMenu'], [rstr.clickplayer.menus] );
	};
	
	this.test_click = function(){
		this.mm.mock(this.lc().m_popmenu, 'show');
		assertEQ ( this.lc().m_roleId, 0);
		assertEQ ( this.lc().m_roleName, '');
		this.hdr.click({x:1, y:2}, 10000, 'role');
		assertEQ ( this.mm.params['show'], [{x:1, y:2}] );
		assertEQ ( this.lc().m_roleId, 10000);
		assertEQ ( this.lc().m_roleName, 'role');
	};
	
	this.test__createPopMenu = function(){
		isCanCopyToClipboard = function() {return false};
		this.lc().m_popmenu = null;
		this.lc()._createPopMenu(rstr.clickplayer.menus);
		assertEQ ( this.lc().m_popmenu.getCount(), 4);
		
		isCanCopyToClipboard = function() {return true };
		this.lc().m_popmenu = null;
		this.lc()._createPopMenu(rstr.clickplayer.menus);
		assertEQ ( this.lc().m_popmenu.getCount(), 5);
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_popmenu, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.hdr, caller:this.lc()._onCommand}] );
	};
	
	this.test__setCmdCallerMaps = function(){
		this.lc().m_cmdCallers = {};
		this.lc()._setCmdCallerMaps();
		assertEQ ( this.lc().m_cmdCallers[this.lc().CMD_TALK],  this.lc()._onChat);
		assertEQ ( this.lc().m_cmdCallers[this.lc().CMD_FRIEND],  this.lc()._onApplyFriend);
		assertEQ ( this.lc().m_cmdCallers[this.lc().CMD_LETTER],  this.lc()._onWriteLetter);
		assertEQ ( this.lc().m_cmdCallers[this.lc().CMD_COPYNAME],  this.lc()._onCopyName);
		assertEQ ( this.lc().m_cmdCallers[this.lc().CMD_DETAIL],  this.lc()._onShowDetail);
	};
	
	this.test__setRole = function(){
		assertEQ ( this.lc().m_roleId, 0);
		assertEQ ( this.lc().m_roleName, '');
		this.lc()._setRole(10000, 'role');
		assertEQ ( this.lc().m_roleId, 10000);
		assertEQ ( this.lc().m_roleName, 'role');	
	};
	
	this.test__onCommand = function(){
		this.mm.mock(this.g.getGUI(), 'hideAllMenu');
		var call_talk = false;
		var call_detail = false;
		this.lc().m_cmdCallers[this.lc().CMD_TALK] = function(){ call_talk=true; };
		this.lc().m_cmdCallers[this.lc().CMD_DETAIL] = function(){ call_detail=true; };
		
		this.lc()._onCommand(this.lc().CMD_TALK);
		assertEQ ( this.mm.walkLog, 'hideAllMenu' );
		assertEQ ( call_talk, true );
		assertEQ ( call_detail, false );
		
		this.mm.clear();
		this.lc()._onCommand(this.lc().CMD_DETAIL);
		assertEQ ( this.mm.walkLog, 'hideAllMenu' );
		assertEQ ( call_detail, true );
	};
	
	this.test__onChat = function(){
		this.mm.mock(UIM.getPanel('chat'), 'setChatTarget');
		this.lc().m_roleName = 'role';
		this.lc()._onChat();
		assertEQ ( this.mm.params['setChatTarget'], ['role'] );
	};
	
	this.test__onApplyFriend = function(){
		this.mm.mock(	FriendSender, 'sendApplyFriend' ); //(this.g, this.field.roleName);
		this.lc().m_roleName = 'role';
		this.lc()._onApplyFriend();
		assertEQ ( this.mm.params['sendApplyFriend'], [this.g, 'role'] );
	};
	
	this.test__onWriteLetter = function(){
		this.lc().m_roleName = 'role';
		var dlg = WriteLetterDlg.snew(this.g);
		UIM.regDlg('writeletter', dlg);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock(dlg, 'clear');
		this.mm.mock(dlg, 'setRecv');
		this.mm.mock(dlg, 'setFocus');
	
		this.lc()._onWriteLetter();
		
		assertEQ ( this.mm.walkLog, 'openDlg,clear,setRecv,setFocus' );
		assertEQ ( this.mm.params['setRecv'], ['role'] );
		assertEQ ( this.mm.params['setFocus'], ['title'] );
	};
	
	this.test__onCopyName = function(){
		this.lc().m_roleName = 'role';
		var bak = copyToClipboard;
		var r_txt = '';
		copyToClipboard = function(txt){ r_txt = txt; };
		this.lc()._onCopyName();
		assertEQ ( r_txt, 'role' );
		copyToClipboard = bak;
	};
	
	this.test__onShowDetail = function(){
		this.lc().m_roleName = 'role';
		this.mm.mock(OutFieldSender, 'sendGetFieldDetailByRole');
		this.lc()._onShowDetail();
		assertEQ ( this.mm.params['sendGetFieldDetailByRole'], [this.g, 'role'] );
	};	
});

tqClickRoleHdr_t_main = function(suite) {
	suite.addTestCase(TestCaseClickRoleHdr, 'TestCaseClickRoleHdr');
};
