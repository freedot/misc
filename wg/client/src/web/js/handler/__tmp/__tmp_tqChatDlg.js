/*******************************************************************************/
ChatDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_CLOSE_ID = 1;
	var C_SEND_ID = 2;
	_lc_.C_MAXCON_LEN = 255;
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
	
	_lc_.C_MAX_CHAT_LINES = 1000;
	_lc_.C_REDUCE_LINES = 50;
	
	_lc_.m_g=null;
	_lc_.m_this=null;
	_lc_.m_chatConScroller=null;
	_lc_.m_role=null;
	_lc_.m_dlg=null;
	_lc_.m_items = {};
	
	_lc_.m_curColorIdx=0;
	_lc_.m_curFontSizeIdx=0;
	
	_lc_.m_faceUtil = null;
	
	_lc_.m_upCaller = null;

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_chatConScroller = ChatConScroller.snew(_lc_.m_g);
		_lc_.m_faceUtil = FaceUtil.snew(_lc_.m_g);
	};
	
	this.setUpCaller = function(upCaller){
		_lc_.m_upCaller = upCaller;
		if ( _lc_.m_dlg ) {
			_lc_.m_dlg.setUpCaller(_lc_.m_upCaller);
		}
	};
	
	this.openDlg = function(role){
		_lc_._initParam(role);
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.getCore = function(){
		return _lc_.m_dlg;
	};
	
	this.clear = function(){
		if ( !_lc_.m_dlg ) return;
		
		_lc_.m_chatConScroller.clear();
		_lc_._clearInput();
	};

	this.focus = function(){
		if ( !_lc_.m_dlg ) return;
		
		_lc_.m_items.ichat.getContainerObj().focus();
	};
	
	this.handleChatPkg = function(netchat){
		return _lc_._onHandleChatPkg(netchat);
	};
	
	_lc_._initParam = function(role){
		_lc_.m_role = role;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._createColorPanel();
		_lc_._createFontSizePanel();
		_lc_._createFacePanel();
		_lc_._addChatInputReturnKeyEvent();
		_lc_._setChatInputMaxLength();
		_lc_._saveChatInputCursorPos();
		_lc_._initChatConScroller();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, canDrag:true, dragTitleH:35, pos:{x:'center', y:80}, uiback:uiback.dlg.friendmain});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.friend.chatdlg, _lc_.m_items);
		_lc_.m_dlg.setUpCaller(_lc_.m_upCaller);
	};
	
	_lc_._createColorPanel = function(){
		_lc_.m_items.colorbtn = ColorPanelBtn.snew(_lc_.m_g, _lc_.m_items.colorbtn);
		_lc_.m_items.colorbtn.setCaller({self:_lc_.m_this, caller:_lc_._onSetColor});
		_lc_.m_items.colorbtn.setDefaultColor(15);
	};
	
	_lc_._createFontSizePanel = function(){
		_lc_.m_items.sizebtn = FontSizePanelBtn.snew(_lc_.m_g, _lc_.m_items.sizebtn);
		_lc_.m_items.sizebtn.setCaller({self:_lc_.m_this, caller:_lc_._onSetFontSize});
		_lc_.m_items.sizebtn.setDefaultSize(0);	
	};
	
	_lc_._createFacePanel = function(){
		_lc_.m_items.facebtn = FacePanelBtn.snew(_lc_.m_g, _lc_.m_items.facebtn);
		_lc_.m_items.facebtn.setCaller({self:_lc_.m_this, caller:_lc_._onInsertFace});	
	};
	
	_lc_._setChatInputMaxLength = function(){
		InputLimit.maxGBKBytes(_lc_.m_items.ichat.getContainerObj(), _lc_.C_MAXCON_LEN);
	};
	
	_lc_._addChatInputReturnKeyEvent = function(){
		_lc_._onChatKey = function(e){
			var event = TQ.getValidEvent(e);
			var k = TQ.getKeyCode(event);
			if ( event.ctrlKey && k == VK_KEY.RETURN  ){
				_lc_._sendMessage();
				TQ.preventDefault(event);
			}
		};
		
		TQ.addEvent(_lc_.m_items.ichat.getContainerObj(), 'keydown', _lc_._onChatKey);
	};
	
	_lc_._saveChatInputCursorPos = function(){
		var chatInput = _lc_.m_items.ichat.getContainerObj();
		TQ.saveTextareaPos(chatInput);
	};
	
	_lc_._initChatConScroller = function(){
		_lc_.m_chatConScroller.initScroller(_lc_.m_items.con, _lc_.C_MAX_CHAT_LINES, _lc_.C_REDUCE_LINES);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.dlgclosebtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickClose});
		_lc_.m_items.sendbtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSend});
		_lc_.m_items.clearbtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickClear});	
	};
	
	_lc_._openDlg = function(){
		if (_lc_.m_dlg.isShow()) {
			_lc_.m_g.getGUI().upDlg(UI_ZORDER_DLG, _lc_.m_dlg);
			return;
		}
		
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._setRoleIcon();
		_lc_._setRoleNameLevelSex();
		_lc_._setCityName();
	};
	
	_lc_._setRoleIcon = function(){
		var res = ItemResUtil.findItemres(_lc_.m_role.icon);
		IMG.setBKImage(_lc_.m_items.icon,IMG.makeBigImg(res.bigpic));	
	};
	
	_lc_._setRoleNameLevelSex = function(){
		TQ.setTextEx(_lc_.m_items.name, _lc_.m_role.roleName);
		TQ.setTextEx(_lc_.m_items.level, RStrUtil.getCityNameByLevel(_lc_.m_role.buildval.level) );
		TQ.setTextEx(_lc_.m_items.sex, rstr.comm.sexs[_lc_.m_role.sex]);
	};
	
	_lc_._setCityName = function(){
		var pos = FieldUtil.getPosByGridId(_lc_.m_role.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(_lc_.m_role.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		var cityNameAndPos = res.name + ' ' + HyperLinkMgr.formatLink(cood);
		TQ.setTextEx(_lc_.m_items.city, cityNameAndPos);
	};
	
	_lc_._onInsertFace = function(data){
		TQ.insertAtCursor(_lc_.m_items.ichat.getContainerObj(), data.face);
	};
	
	_lc_._onSetColor = function(data){
		_lc_.m_curColorIdx = data.idx;
	};
	
	_lc_._onSetFontSize = function(idx){
		_lc_.m_curFontSizeIdx = idx;
	};
	
	_lc_._onClickClose = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickSend = function(){
		_lc_._sendMessage();
	};
	
	_lc_._onClickClear = function(){
		_lc_.m_chatConScroller.clear();
	};	
	
	_lc_._sendMessage = function(){
		var msg = _lc_._combineInputMsg();
		if ( msg == '' ) {
			_lc_._clearInput();
			return;
		}
		
		FriendSender.sendFriendChat(_lc_.m_g, _lc_.m_role.roleId, msg);
		_lc_._appendMessage(COLORS.FRIENDCHAT_MYCOLOR, _lc_.m_g.getImgr().getRoleName(), _lc_.m_g.getSvrTimeS(), msg);
		_lc_._clearInput();
	};	
	
	_lc_._combineInputMsg = function(){
		var msg = TQ.trimRight(_lc_.m_items.ichat.getContainerObj().value);
		if (msg == '') return '';
		
		msg = _lc_.m_g.getGUI().encodeFont(msg, _lc_.m_curColorIdx, _lc_.m_curFontSizeIdx);
		return TQ.encodeMessage(msg);
	};
	
	_lc_._clearInput = function(){
		var scrollChat = _lc_.m_items.ichat;
		var inputChat = scrollChat.getContainerObj();
		inputChat.focus();
		inputChat.value = '';
		scrollChat.refresh();
	};

	_lc_._onHandleChatPkg = function(netchat){
		if ( !_lc_._isShow() ){
			return EVENT_RET_OK;
		}
		
		if ( netchat.roleId  != _lc_.m_role.roleId ){
			return EVENT_RET_OK;
		}
		
		_lc_._appendMessage(COLORS.FRIENDCHAT_OTHERCOLOR, netchat.roleName, netchat.time, netchat.msg);
		return EVENT_RET_BREAK;
	};
	
	_lc_._appendMessage = function(szcolor, name, timesec, msg){
		msg = TQ.decodeMessage(msg);
	
		msg = _lc_.m_g.getGUI().decodeFont(msg);
		msg = _lc_.m_faceUtil.faceFormat(msg);

		var msgTitle = '<font color="'+szcolor+'">' + name + ' ' + TQ.formatDateTime(timesec) + '</font>' + C_NEWLINE;
		var msgCon = '<div style="PADDING-LEFT:12px;">' + msg + '</div>';
		_lc_.m_chatConScroller.append(msgTitle + msgCon);
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};

	//ChatDlg-unittest-end
});
