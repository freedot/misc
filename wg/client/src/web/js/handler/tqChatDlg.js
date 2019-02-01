/*******************************************************************************/
ChatDlg = Class.extern(function(){
	//ChatDlg-unittest-start
	var C_CLOSE_ID = 1;
	var C_SEND_ID = 2;
	var C_MAXCON_LEN = 255;
	var C_NEWLINE = '<BR/>';
	var C_OTHERCOLOR = '#FFFFFF';
	var C_DEFAULT_INPUTCOLOR = '#FFFFFF';
	
	var C_MAX_DLG_W = 500;
	var C_MIN_DLG_W = 337;
	
	var C_DLG_CLOSE_BTN_W = 18;
	var C_DLG_BORDER_W = 1;
	var C_DLG_BORDER_W = 1;
	
	var C_MIN_DLG_CON_RECT = [7,57,323,146];
	var C_MAX_DLG_CON_RECT = [7,29,323,174];
	
	var C_MAX_CHAT_LINES = 1000;
	var C_REDUCE_LINES = 50;
	
	var m_g=null;
	var m_this=null;
	var m_chatConScroller=null;
	var m_role=null;
	var m_dlg=null;
	var m_items = {};
	
	var m_curColorIdx=0;
	var m_curFontSizeIdx=0;
	
	var m_faceUtil = null;
	
	var m_upCaller = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_chatConScroller = ChatConScroller.snew(m_g);
		m_faceUtil = FaceUtil.snew(m_g);
	};
	
	this.setUpCaller = function(upCaller){
		m_upCaller = upCaller;
		if ( m_dlg ) {
			m_dlg.setUpCaller(m_upCaller);
		}
	};
	
	this.openDlg = function(role){
		_initParam(role);
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.getCore = function(){
		return m_dlg;
	};
	
	this.clear = function(){
		if ( !m_dlg ) return;
		
		m_chatConScroller.clear();
		_clearInput();
	};

	this.focus = function(){
		if ( !m_dlg ) return;
		
		m_items.ichat.getContainerObj().focus();
	};
	
	this.handleChatPkg = function(netchat){
		return _onHandleChatPkg(netchat);
	};
	
	var _initParam = function(role){
		m_role = role;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_createColorPanel();
		_createFontSizePanel();
		_createFacePanel();
		_addChatInputReturnKeyEvent();
		_setChatInputMaxLength();
		_saveChatInputCursorPos();
		_initChatConScroller();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, canDrag:true, dragTitleH:35, pos:{x:'center', y:80}, uiback:uiback.dlg.friendmain});
		m_g.getGUI().initDlg(m_dlg, uicfg.friend.chatdlg, m_items);
		m_dlg.setUpCaller(m_upCaller);
	};
	
	var _createColorPanel = function(){
		m_items.colorbtn = ColorPanelBtn.snew(m_g, m_items.colorbtn);
		m_items.colorbtn.setCaller({self:m_this, caller:_onSetColor});
		m_items.colorbtn.setDefaultColor(15);
	};
	
	var _createFontSizePanel = function(){
		m_items.sizebtn = FontSizePanelBtn.snew(m_g, m_items.sizebtn);
		m_items.sizebtn.setCaller({self:m_this, caller:_onSetFontSize});
		m_items.sizebtn.setDefaultSize(0);	
	};
	
	var _createFacePanel = function(){
		m_items.facebtn = FacePanelBtn.snew(m_g, m_items.facebtn);
		m_items.facebtn.setCaller({self:m_this, caller:_onInsertFace});	
	};
	
	var _setChatInputMaxLength = function(){
		InputLimit.maxGBKBytes(m_items.ichat.getContainerObj(), C_MAXCON_LEN);
	};
	
	var _addChatInputReturnKeyEvent = function(){
		var _onChatKey = function(e){
			var event = TQ.getValidEvent(e);
			var k = TQ.getKeyCode(event);
			if ( event.ctrlKey && k == VK_KEY.RETURN  ){
				_sendMessage();
				TQ.preventDefault(event);
			}
		};
		
		TQ.addEvent(m_items.ichat.getContainerObj(), 'keydown', _onChatKey);
	};
	
	var _saveChatInputCursorPos = function(){
		var chatInput = m_items.ichat.getContainerObj();
		TQ.saveTextareaPos(chatInput);
	};
	
	var _initChatConScroller = function(){
		m_chatConScroller.initScroller(m_items.con, C_MAX_CHAT_LINES, C_REDUCE_LINES);
	};
	
	var _setCallers = function(){
		m_items.dlgclosebtn.setCaller({self:m_this, caller:_onClickClose});
		m_items.sendbtn.setCaller({self:m_this, caller:_onClickSend});
		m_items.clearbtn.setCaller({self:m_this, caller:_onClickClear});	
	};
	
	var _openDlg = function(){
		if (m_dlg.isShow()) {
			m_g.getGUI().upDlg(UI_ZORDER_DLG, m_dlg);
			return;
		}
		
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_setRoleIcon();
		_setRoleNameLevelSex();
		_setCityName();
	};
	
	var _setRoleIcon = function(){
		var res = ItemResUtil.findItemres(m_role.icon);
		IMG.setBKImage(m_items.icon,IMG.makeBigImg(res.bigpic));	
	};
	
	var _setRoleNameLevelSex = function(){
		TQ.setTextEx(m_items.name, m_role.roleName);
		TQ.setTextEx(m_items.level, RStrUtil.getCityNameByLevel(m_role.buildval.level) );
		TQ.setTextEx(m_items.sex, rstr.comm.sexs[m_role.sex]);
	};
	
	var _setCityName = function(){
		var pos = FieldUtil.getPosByGridId(m_role.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(m_role.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		var cityNameAndPos = res.name + ' ' + HyperLinkMgr.formatLink(cood);
		TQ.setTextEx(m_items.city, cityNameAndPos);
	};
	
	var _onInsertFace = function(data){
		TQ.insertAtCursor(m_items.ichat.getContainerObj(), data.face);
	};
	
	var _onSetColor = function(data){
		m_curColorIdx = data.idx;
	};
	
	var _onSetFontSize = function(idx){
		m_curFontSizeIdx = idx;
	};
	
	var _onClickClose = function(){
		m_dlg.hide();
	};
	
	var _onClickSend = function(){
		_sendMessage();
	};
	
	var _onClickClear = function(){
		m_chatConScroller.clear();
	};	
	
	var _sendMessage = function(){
		var msg = _combineInputMsg();
		if ( msg == '' ) {
			_clearInput();
			return;
		}
		
		FriendSender.sendFriendChat(m_g, m_role.roleId, msg);
		_appendMessage(COLORS.FRIENDCHAT_MYCOLOR, m_g.getImgr().getRoleName(), m_g.getSvrTimeS(), msg);
		_clearInput();
	};	
	
	var _combineInputMsg = function(){
		var msg = TQ.trimRight(m_items.ichat.getContainerObj().value);
		if (msg == '') return '';
		
		msg = m_g.getGUI().encodeFont(msg, m_curColorIdx, m_curFontSizeIdx);
		return TQ.encodeMessage(msg);
	};
	
	var _clearInput = function(){
		var scrollChat = m_items.ichat;
		var inputChat = scrollChat.getContainerObj();
		inputChat.focus();
		inputChat.value = '';
		scrollChat.refresh();
	};

	var _onHandleChatPkg = function(netchat){
		if ( !_isShow() ){
			return EVENT_RET_OK;
		}
		
		if ( netchat.roleId  != m_role.roleId ){
			return EVENT_RET_OK;
		}
		
		_appendMessage(COLORS.FRIENDCHAT_OTHERCOLOR, netchat.roleName, netchat.time, netchat.msg);
		return EVENT_RET_BREAK;
	};
	
	var _appendMessage = function(szcolor, name, timesec, msg){
		msg = TQ.decodeMessage(msg);
	
		msg = m_g.getGUI().decodeFont(msg);
		msg = m_faceUtil.faceFormat(msg);

		var msgTitle = '<font color="'+szcolor+'">' + name + ' ' + TQ.formatDateTime(timesec) + '</font>' + C_NEWLINE;
		var msgCon = '<div style="PADDING-LEFT:12px;">' + msg + '</div>';
		m_chatConScroller.append(msgTitle + msgCon);
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};

	//ChatDlg-unittest-end
});
