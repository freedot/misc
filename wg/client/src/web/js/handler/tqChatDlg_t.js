/*******************************************************************************/
requireEx('./handler/tqChatDlg.js', [
	{
		start:'//ChatDlg-unittest-start'
		,end:'//ChatDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_chatConScroller'
			,'m_role'
			,'m_curColorIdx'
			,'m_curFontSizeIdx'
			,'m_faceUtil'
			,'m_upCaller'
			,'C_MAXCON_LEN'
			,'C_MAX_CHAT_LINES'
			,'C_REDUCE_LINES'
			,'_initParam'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_createColorPanel'
			,'_createFontSizePanel'
			,'_createFacePanel'
			,'_addChatInputReturnKeyEvent'
			,'_setChatInputMaxLength'
			,'_saveChatInputCursorPos'
			,'_initChatConScroller'
			,'_setCallers'
			,'_onSetColor'
			,'_onSetFontSize'
			,'_onInsertFace'
			,'_onChatKey'
			,'_sendMessage'
			,'_onClickClose'
			,'_onClickSend'
			,'_onClickClear'
			,'_setRoleIcon'
			,'_setRoleNameLevelSex'
			,'_setCityName'
			,'_clearInput'
			,'_onHandleChatPkg'
			,'_combineInputMsg'
			,'_appendMessage'
			,'_isShow'
			]
	}
]);

TestCaseChatDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.role = {roleId:10000, roleName:'role', sex:0, buildval:{level:1}, icon:101, gridId:3};
		this.dlg = ChatDlg.snew(this.g);
		this.dlg.openDlg(this.role);
		this.lc = this.dlg.lc;
		
		res_test_items = [{id:101, bigpic:101, smallpic:101},{id:9900001, name:'city'}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(FaceUtil, 'snew');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.lc().m_chatConScroller instanceof ChatConScroller, true );
		assertEQ ( this.mm.params['snew'], [this.g] );
	};
	
	this.test_setUpCaller = function(){
		this.dlg.setUpCaller({self:this, caller:this.test_setUpCaller});
		assertEQ ( this.lc().m_upCaller, {self:this, caller:this.test_setUpCaller} );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initParam' );
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		
		var p_role = {};
		this.dlg.openDlg(p_role);
		assertEQ ( this.mm.walkLog, '_initParam,_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initParam'], [p_role] );
	};
	
	this.test_getCore = function(){
		assertEQ ( this.dlg.getCore(), this.lc().m_dlg );
	};
	
	this.test_clear = function(){
		this.mm.mock(this.lc().m_chatConScroller, 'clear');
		this.mm.mock(this.lc(), '_clearInput');
		this.lc().m_dlg = null;
		this.dlg.clear();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.dlg.clear();
		assertEQ ( this.mm.walkLog, 'clear,_clearInput' );
	};
	
	this.test_focus = function(){
		this.mm.mock(this.lc().m_items.ichat.getContainerObj(), 'focus');
		this.lc().m_dlg = null;
		this.dlg.focus();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = {};
		this.dlg.focus();
		assertEQ ( this.mm.walkLog, 'focus' );
	};
	
	this.test_handleChatPkg = function(){
		this.mm.mock(this.lc(), '_onHandleChatPkg', ['rchat']);
		
		var p_netchat = {};
		assertEQ ( this.dlg.handleChatPkg(p_netchat), 'rchat' );
		assertEQ ( this.mm.params['_onHandleChatPkg'], [p_netchat] );
	};
	
	this.test__initParam = function(){
		var p_role = {};
		this.lc()._initParam(p_role);
		assertEQ ( this.lc().m_role, p_role);
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = {};
		this.mm.mock( this.lc(), '_createDlg');
		this.mm.mock( this.lc(), '_createColorPanel');
		this.mm.mock( this.lc(), '_createFontSizePanel');
		this.mm.mock( this.lc(), '_createFacePanel');
		this.mm.mock( this.lc(), '_addChatInputReturnKeyEvent');
		this.mm.mock( this.lc(), '_setChatInputMaxLength');
		this.mm.mock( this.lc(), '_saveChatInputCursorPos');
		this.mm.mock( this.lc(), '_initChatConScroller');
		this.mm.mock( this.lc(), '_setCallers');
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_createColorPanel,_createFontSizePanel,_createFacePanel,_addChatInputReturnKeyEvent,_setChatInputMaxLength,_saveChatInputCursorPos,_initChatConScroller,_setCallers' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, canDrag:true, dragTitleH:35, pos:{x:'center', y:80}, uiback:uiback.dlg.friendmain}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.friend.chatdlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__createColorPanel = function(){
		var r_colorPanelBtn = ColorPanelBtn.snew(this.g, MockDom.snew());
		this.mm.mock(ColorPanelBtn, 'snew', [r_colorPanelBtn] );
		this.mm.mock(r_colorPanelBtn, 'setCaller');
		this.mm.mock(r_colorPanelBtn, 'setDefaultColor');
		
		var oldcolorbtn = this.lc().m_items.colorbtn;
		this.lc()._createColorPanel();
		assertEQ ( this.lc().m_items.colorbtn, r_colorPanelBtn );
		assertEQ ( this.mm.walkLog, 'snew,setCaller,setDefaultColor' );
		assertEQ ( this.mm.params['snew'], [this.g, oldcolorbtn] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSetColor}] );
		assertEQ ( this.mm.params['setDefaultColor'], [15] );
	};
	
	this.test__createFontSizePanel = function(){
		var r_fontPanelBtn = FontSizePanelBtn.snew(this.g, MockDom.snew());
		this.mm.mock(FontSizePanelBtn, 'snew', [r_fontPanelBtn] );
		this.mm.mock(r_fontPanelBtn, 'setCaller');
		this.mm.mock(r_fontPanelBtn, 'setDefaultSize');
		
		var oldsizebtn = this.lc().m_items.sizebtn;
		this.lc()._createFontSizePanel();
		assertEQ ( this.lc().m_items.sizebtn, r_fontPanelBtn );
		assertEQ ( this.mm.walkLog, 'snew,setCaller,setDefaultSize' );
		assertEQ ( this.mm.params['snew'], [this.g, oldsizebtn] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSetFontSize}] );
		assertEQ ( this.mm.params['setDefaultSize'], [0] );
	};
	
	this.test__createFacePanel = function(){
		var r_facePanelBtn = FacePanelBtn.snew(this.g, MockDom.snew());
		this.mm.mock(FacePanelBtn, 'snew', [r_facePanelBtn] );
		this.mm.mock(r_facePanelBtn, 'setCaller');
		
		var oldfacebtn = this.lc().m_items.facebtn;
		this.lc()._createFacePanel();
		assertEQ ( this.lc().m_items.facebtn, r_facePanelBtn );
		assertEQ ( this.mm.walkLog, 'snew,setCaller' );
		assertEQ ( this.mm.params['snew'], [this.g, oldfacebtn] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onInsertFace}] );
	};
	
	this.test__setChatInputMaxLength = function(){
		this.mm.mock(InputLimit, 'maxGBKBytes');
		this.lc()._setChatInputMaxLength();
		assertEQ ( this.mm.params['maxGBKBytes'], [this.lc().m_items.ichat.getContainerObj(), this.lc().C_MAXCON_LEN] );
	};
	
	this.test__addChatInputReturnKeyEvent = function(){
		this.mm.mock(TQ, 'addEvent');
		this.lc()._addChatInputReturnKeyEvent();
		assertEQ ( this.mm.params['addEvent'], [this.lc().m_items.ichat.getContainerObj(), 'keydown', this.lc()._onChatKey] );
	};
	
	this.test__addChatInputReturnKeyEvent_onChatKey = function(){
		this.lc()._addChatInputReturnKeyEvent(); // init _onChatKey function
		
		var r_getValidEvent = [{name:'validEvent'}];
		var r_getKeyCode = [0];
		this.mm.mock(TQ, 'getValidEvent', r_getValidEvent);
		this.mm.mock(TQ, 'getKeyCode', r_getKeyCode);
		this.mm.mock(this.lc(), '_sendMessage');
		this.mm.mock(TQ, 'preventDefault');
		
		var p_event = {};
		this.lc()._onChatKey(p_event);
		assertEQ ( this.mm.walkLog, 'getValidEvent,getKeyCode' );
		assertEQ ( this.mm.params['getValidEvent'], [p_event] );
		assertEQ ( this.mm.params['getKeyCode'], [r_getValidEvent[0]] );
		
		this.mm.clear();
		r_getValidEvent[0].ctrlKey = true;
		this.lc()._onChatKey(p_event);
		assertEQ ( this.mm.walkLog, 'getValidEvent,getKeyCode' );
		
		this.mm.clear();
		r_getKeyCode[0] = VK_KEY.RETURN;
		this.lc()._onChatKey(p_event);
		assertEQ ( this.mm.walkLog, 'getValidEvent,getKeyCode,_sendMessage,preventDefault' );
		assertEQ ( this.mm.params['preventDefault'], [r_getValidEvent[0]] );
	};
	
	this.test__saveChatInputCursorPos = function(){
		this.mm.mock(TQ, 'saveTextareaPos');
		this.lc()._saveChatInputCursorPos();
		assertEQ ( this.mm.params['saveTextareaPos'], [this.lc().m_items.ichat.getContainerObj()] );
	};
	
	this.test__initChatConScroller = function(){
		this.mm.mock(this.lc().m_chatConScroller, 'initScroller');
		this.lc()._initChatConScroller();
		assertEQ ( this.mm.params['initScroller'], [this.lc().m_items.con, this.lc().C_MAX_CHAT_LINES, this.lc().C_REDUCE_LINES] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.dlgclosebtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.sendbtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.clearbtn, 'setCaller' );
		
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickClose}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickSend}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickClear}] );
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		var r_isShow = [true];
		this.mm.mock(this.lc().m_dlg, 'isShow', r_isShow);	
		this.mm.mock(this.g.getGUI(), 'upDlg');	
		this.mm.mock(this.lc().m_dlg, 'show');	
		
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'isShow,upDlg' );
		assertEQ ( this.mm.params['upDlg'], [UI_ZORDER_DLG, this.lc().m_dlg] );

		this.mm.clear();
		r_isShow[0] = false;
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'isShow,show' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_setRoleIcon' );
		this.mm.mock(this.lc(), '_setRoleNameLevelSex' );
		this.mm.mock(this.lc(), '_setCityName' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_setRoleIcon,_setRoleNameLevelSex,_setCityName' );
	};
	
	this.test__setRoleIcon = function(){
		this.mm.mock(IMG, 'setBKImage' );
		this.lc()._setRoleIcon();
		assertEQ ( this.mm.params['setBKImage'], [this.lc().m_items.icon, IMG.makeBigImg(101)] );
	};
	
	this.test__setRoleNameLevelSex = function(){
		this.lc()._setRoleNameLevelSex();
		assertEQ ( TQ.getTextEx(this.lc().m_items.name), this.role.roleName );
		assertEQ ( TQ.getTextEx(this.lc().m_items.level), RStrUtil.getCityNameByLevel(this.role.buildval.level) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.sex), rstr.comm.sexs[this.role.sex] );
	};
	
	this.test__setCityName = function(){
		this.lc()._setCityName();
		assertEQ ( TQ.getTextEx(this.lc().m_items.city), 'city ' + HyperLinkMgr.formatLink('#[m:2:0]') );
	};
	
	this.test__onInsertFace = function(){
		this.mm.mock(TQ, 'insertAtCursor' );
		this.lc()._onInsertFace({face:'01.gif'});
		assertEQ ( this.mm.params['insertAtCursor'], [this.lc().m_items.ichat.getContainerObj(), '01.gif'] );
	};
	
	this.test__onSetColor = function(){
		this.lc()._onSetColor({idx:1});
		assertEQ ( this.lc().m_curColorIdx, 1 );
	};
	
	this.test__onSetFontSize = function(){
		this.lc()._onSetFontSize(1); // idx
		assertEQ ( this.lc().m_curFontSizeIdx, 1 );
	};
	
	this.test__onClickClose = function(){
		this.lc().m_dlg.show();
		this.lc()._onClickClose();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__onClickSend = function(){
		this.mm.mock(this.lc(), '_sendMessage');
		this.lc()._onClickSend();
		assertEQ ( this.mm.walkLog, '_sendMessage' );
	};
	
	this.test__onClickClear = function(){
		this.mm.mock(this.lc().m_chatConScroller, 'clear');
		this.lc()._onClickClear();
		assertEQ ( this.mm.walkLog, 'clear' );
	};
	
	this.test__sendMessage = function(){
		var r_combineInputMsg = [''];
		this.mm.mock(this.lc(), '_combineInputMsg', r_combineInputMsg);
		this.mm.mock(FriendSender, 'sendFriendChat');
		this.mm.mock(this.lc(), '_appendMessage');
		this.mm.mock(this.lc(), '_clearInput');
		
		this.lc()._sendMessage();
		assertEQ ( this.mm.walkLog, '_combineInputMsg,_clearInput' );
		
		this.mm.clear();
		r_combineInputMsg[0] = 'chatmsg';
		this.lc()._sendMessage();
		assertEQ ( this.mm.walkLog, '_combineInputMsg,sendFriendChat,_appendMessage,_clearInput' );
		assertEQ ( this.mm.params['sendFriendChat'], [this.g, this.role.roleId, 'chatmsg'] );
		assertEQ ( this.mm.params['_appendMessage'], [COLORS.FRIENDCHAT_MYCOLOR,
			this.g.getImgr().getRoleName(), this.g.getSvrTimeS(), 'chatmsg'] );
	};
	
	this.test__combineInputMsg = function(){
		this.mm.mock(this.g.getGUI(), 'encodeFont', ['fontmsg']);
		this.mm.mock(TQ, 'encodeMessage', ['encodemsg']);
		
		this.lc().m_items.ichat.getContainerObj().value = '  ';
		assertEQ ( this.lc()._combineInputMsg(), '' );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_items.ichat.getContainerObj().value = '  msg  ';
		assertEQ ( this.lc()._combineInputMsg(), 'encodemsg' );
		assertEQ ( this.mm.walkLog, 'encodeFont,encodeMessage' );
		assertEQ ( this.mm.params['encodeFont'], ['  msg', 15, 0 ] );
		assertEQ ( this.mm.params['encodeMessage'], ['fontmsg' ] );
	};
	
	this.test__clearInput = function(){
		this.lc().m_items.ichat.getContainerObj().value = 'lastmsg';
		this.mm.mock(this.lc().m_items.ichat.getContainerObj(), 'focus');
		this.mm.mock(this.lc().m_items.ichat, 'refresh');
		this.lc()._clearInput();
		assertEQ ( this.mm.walkLog, 'focus,refresh' );
		assertEQ ( this.lc().m_items.ichat.getContainerObj().value, '' );
	};
	
	this.test__onHandleChatPkg = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow);
		this.mm.mock(this.lc(), '_appendMessage');
		
		var p_netchat = {roleId:2, roleName:'friend', time:1, msg:'chatmsg'};
		assertEQ ( this.lc()._onHandleChatPkg(p_netchat), EVENT_RET_OK );
		assertEQ ( this.mm.walkLog, '_isShow');
		
		this.mm.clear();
		r_isShow[0] = true;
		assertEQ ( this.lc()._onHandleChatPkg(p_netchat), EVENT_RET_OK );
		assertEQ ( this.mm.walkLog, '_isShow');
		
		this.mm.clear();
		p_netchat.roleId = this.role.roleId;
		assertEQ ( this.lc()._onHandleChatPkg(p_netchat), EVENT_RET_BREAK );
		assertEQ ( this.mm.walkLog, '_isShow,_appendMessage');
		assertEQ ( this.mm.params['_appendMessage'], [COLORS.FRIENDCHAT_OTHERCOLOR, 'friend', 1, 'chatmsg'] );
	};
	
	this.test__appendMessage = function(){
		this.mm.mock(TQ, 'decodeMessage', ['decodemsg']);
		this.mm.mock(this.g.getGUI(), 'decodeFont', ['fontmsg']);
		this.mm.mock(this.lc().m_faceUtil, 'faceFormat', ['facemsg']);
		this.mm.mock(this.lc().m_chatConScroller, 'append' );
		
		this.lc()._appendMessage('scolor', 'friend', 10, 'msg');
		assertEQ ( this.mm.walkLog, 'decodeMessage,decodeFont,faceFormat,append' );
		assertEQ ( this.mm.params['decodeMessage'], ['msg'] );
		assertEQ ( this.mm.params['decodeFont'], ['decodemsg'] );
		assertEQ ( this.mm.params['faceFormat'], ['fontmsg'] );
		assertEQ ( this.mm.params['append'], ['<font color="scolor">friend 1970-01-01 08:00:10</font><BR/><div style="PADDING-LEFT:12px;">facemsg</div>'] );
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

tqChatDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseChatDlg, 'TestCaseChatDlg');
};
