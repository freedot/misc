/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
ChatPanel = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_MENU_ITEM_H = 23;
	var C_CMD_WORLD_ID = 0;
	var C_CMD_ALLIANCE_ID = 1;
	var C_CMD_CITY_ID = 2;
	var C_CMD_CHATPLAYER_ID = 3;
	
	_lc_.C_MAX_CHAT_LINES = 1000;
	_lc_.C_REDUCE_LINES = 50;	
	
	_lc_.C_MAXCON_LEN = 50;
	_lc_.C_NEWLINE = '<BR/>';
	
	_lc_.C_PANEL_W = 266;
	
	_lc_.C_MAX_HISTORY_CNT = 10;
	//------------
	//public:method
	//------------
	this.initialize = function(g, dom, fixedPos){
		m_g = g;
		m_this = this;
		_lc_.m_dom = dom;
		m_isFixedPos = fixedPos ? true : false;
		_lc_.m_faceUtil = FaceUtil.snew(m_g);
		_lc_._initChatColors();
		_initPanel();
		_createTargetMenu();
		_setTabsText();
		_lc_._createScrollers();
		_regEvent();
		_setPanelH(_lc_.m_curhidx);
	};
	
	this.setChatTarget = function(name){
		var roleres = m_g.getImgr().getRoleRes();
		if ( name != roleres.name ){
			_lc_._setChatTarget(CHAT_TARGET.PLAYER, name);
		}
	};
	
	this.insertMsg = function(msg){
		_lc_._insertInputMsg(msg);
	};
	
	this.getSize = function(){
		return {cx:_lc_.C_PANEL_W, cy:_lc_.m_resizeh.hs[_lc_.m_curhidx]};
	};
	
	this.setPosition = function(x, y){
		if ( !m_isFixedPos ) {
			TQ.setDomPos(_lc_.m_dom, x, y);
		}
	};
	
	this.appendMsgToCurChannel = function(msg){
		var channel = _lc_.m_items.channeltabs.getActiveTab();
		var fromInfo = _makeEmptyInfo();
		var toInfo = _makeEmptyInfo();
		msg = _lc_._composeMsg(0, CHAT_SYSPLAYER.SYS, '', fromInfo, 0, '', toInfo, channel, msg);
		_lc_._appendMessage(channel, msg);
	};
	
	this.sendMessageToCurChannel = function(msg){
		var targetPlayer = _lc_._getPlayerTarget();
		if (targetPlayer != '') {
			msg = _makePlayerTarget(targetPlayer) + msg;
		}
		_lc_._sendMessageCmd(msg);
	};
	
	//------------
	//private:method
	//------------
	_lc_._initChatColors = function(){
		_lc_.m_chatColors[CHAT_TAG.WORLD] = '#FEC200';
		_lc_.m_chatColors[CHAT_TAG.SYS] = '#FFC200';
		_lc_.m_chatColors[CHAT_TAG.STATE] = '#FEFE00';
		_lc_.m_chatColors[9900001] = _lc_.m_chatColors[CHAT_TAG.STATE];
		_lc_.m_chatColors[9900002] = _lc_.m_chatColors[CHAT_TAG.STATE];
		_lc_.m_chatColors[9900003] = _lc_.m_chatColors[CHAT_TAG.STATE];
		_lc_.m_chatColors[CHAT_TAG.ALLIANCE] = '#00FE00';
		_lc_.m_chatColors[CHAT_TAG.PRIVATE] = '#FE80FE';	
	};
	
	var _initPanel = function(){
		var gui = m_g.getGUI();
		gui.initPanel(_lc_.m_dom, uicfg.chatpanel, _lc_.m_items);
		m_panelback = gui.createPanelUIBack(_lc_.m_dom, m_uibackres);
		var w = TQ.getDomWidth(_lc_.m_dom);
		var h = TQ.getDomHeight(_lc_.m_dom);
		gui.setUIBack(m_panelback, w, h, m_uibackres.type);
		
		_lc_.m_items.facebtn = FacePanelBtn.snew(m_g, _lc_.m_items.facebtn);
		_lc_.m_items.facebtn.setCaller({self:m_this, caller:_onInsertFace});
		
		_lc_.m_items.sendbtn.setCaller({self:m_this, caller:_lc_._onSend});
		_lc_.m_items.largebtn.setCaller({self:m_this, caller:_onLargeH});
		
		_lc_.m_items.target.setCaller({self:m_this, caller:_onSelectTarget});
		
		TQ.addEvent(_lc_.m_items.msginput,'keydown',function(e){
				e = e ? e : window.event;
				var k = TQ.getKeyCode(e);
				if ( k == VK_KEY.RETURN ){
					_lc_._sendMessage();
					TQ.preventDefault(e);
				}
				else if ( k == VK_KEY.UPARROW ) {
					_prevChatCache();
					TQ.preventDefault(e);
				}
				else if ( k == VK_KEY.DOWNARROW ) {
					_nextChatCache();
					TQ.preventDefault(e);
				}
			});
		TQ.saveTextareaPos(_lc_.m_items.msginput);
		TQ.maxLength(_lc_.m_items.msginput, _lc_.C_MAXCON_LEN);
		_lc_._setChatTarget(CHAT_TARGET.STATE, rstr.chatpanel.targetmenus[CHAT_TARGET.STATE]);
	};
	
	_lc_._pushChatCache = function(value) {
		if (value=='') return;
	
		if ( TQ.find(_lc_.m_inputcache.list, null, value) ) {
			TQ.removeElement(_lc_.m_inputcache.list, TQ.getLastFindIdx());
		}
		
		_lc_.m_inputcache.list.push(value);
		if ( _lc_.m_inputcache.list.length > _lc_.C_MAX_HISTORY_CNT ) {
			TQ.removeElement(_lc_.m_inputcache.list, 0);
		}
		
		_lc_.m_inputcache.curpos = _lc_.m_inputcache.list.length - 1;
	};
	
	var _prevChatCache = function() {
		var val = _lc_.m_inputcache.list[_lc_.m_inputcache.curpos];
		if ( val ) {
			_lc_.m_items.msginput.value = val;
		}
		_lc_.m_inputcache.curpos--;
		if ( _lc_.m_inputcache.curpos < 0 ) _lc_.m_inputcache.curpos = 0;
	};
	
	var _nextChatCache = function() {
		_lc_.m_inputcache.curpos++;
		if ( _lc_.m_inputcache.curpos >= _lc_.m_inputcache.list.length ) {
			_lc_.m_inputcache.curpos = _lc_.m_inputcache.list.length-1;
		}
		var val = _lc_.m_inputcache.list[_lc_.m_inputcache.curpos];
		if ( val ) {
			_lc_.m_items.msginput.value = val;
		}
	};
	
	var _createTargetMenu = function(){
		if ( TQ.isMobile() ) {
			m_targetmenu = new Menu(m_g,{width:94,className:'mb_chattarget_menu_panel'});
			C_MENU_ITEM_H = 39;
		} else {
			m_targetmenu = new Menu(m_g,{width:51,className:'chattarget_menu_panel'});
		}
		
		for ( var i=0; i<rstr.chatpanel.targetmenus.length; ++i ){
			m_targetmenu.addMenuItem({id:i,icon:null,text:rstr.chatpanel.targetmenus[i]});
		}
		m_targetmenu.setCaller({self:m_this, caller:_onSelectTargetCmd});
	};
	
	var _setTabsText = function(){
		var tablist = _lc_.m_items.channeltabs;
		for ( var i=0; i<rstr.chatpanel.tabs.length; ++i ){
			tablist.setTabText(i, rstr.chatpanel.tabs[i]);
		}
		tablist.setCaller({self:m_this, caller:_onSelectTab});
		tablist.activeTab(0);
	};
	
	_lc_._createScrollers = function(){
		for ( var channel=0; channel<CHAT_CHANNEL.MAX; ++channel ){
			_lc_.m_channelscrollers[channel] = ChatConScroller.snew(m_g);
			var con = (channel == CHAT_CHANNEL.WORLD) ? 
				_lc_.m_items.speakercon : _lc_.m_items.channeltabs.getTabItems(channel).con;
			_lc_.m_channelscrollers[channel].initScroller(con, _lc_.C_MAX_CHAT_LINES, _lc_.C_REDUCE_LINES);
		}
	};
	
	var _regEvent = function(){
		m_g.regEvent(EVT.NET, NETCMD.CHAT, m_this, _lc_._onSvrPkg);
	};
	
	var _onSelectTab = function(idx){
		m_showchannel = idx;
	};
	
	var _onInsertFace = function(data){
		_lc_._insertInputMsg(data.face);
	};
	
	_lc_._insertInputMsg = function(msg){
		TQ.setFocus(_lc_.m_items.msginput);
		if ((_lc_.m_items.msginput.value.length + msg.length) > _lc_.C_MAXCON_LEN){
			return;
		}
		
		TQ.insertAtCursor(_lc_.m_items.msginput, msg);
	};
	
	var _onSelectTarget = function(){
		var dom = _lc_.m_items.target.getDom();
		var off = TQ.domOffset(dom);
		m_targetmenu.show({x:off.left-1, y:off.top - C_MENU_ITEM_H*m_targetmenu.getCount() - 2});
	};
	
	var _onSelectTargetCmd = function(id){
		m_g.getGUI().hideAllMenu();
		if ( id == C_CMD_CHATPLAYER_ID ){
			_onChatWidthPlayerCmd();
		}
		else{
			_lc_._setChatTarget(id, rstr.chatpanel.targetmenus[id]);
		}
	};
	
	var _onChatWidthPlayerCmd = function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.chatpanel.playername, JVALID.getMaxUserLen());
		var _onInputPlayerOk = function(name){
			if ( JVALID.checkUsername(name) ){
				_lc_._setChatTarget(CHAT_TARGET.PLAYER, name);
			}
			else{
				UIM.getPanel('sysmsg').append(0, rstr.chatpanel.errname);
			}
		};
		inputdlg.setCaller({self:m_this,caller:_onInputPlayerOk});
	};
	
	_lc_._onSend = function(){
		_lc_._sendMessage();
	};
	
	var _onLargeH = function(){
		_lc_.m_curhidx = (_lc_.m_curhidx+1)%_lc_.m_resizeh.hs.length;
		_setPanelH(_lc_.m_curhidx);
	};
	
	_lc_._composeMsg = function(fromCityId, fromId, fromName, fromInfo, toId, toName, toInfo, channel, msg){
		if ( !_lc_._isSysMsg(fromId) ) {
			msg = TQ.decodeMessageForChat(msg);
		}
		msg = HyperLinkMgr.formatLink(msg);
		msg = _lc_.m_faceUtil.faceFormat(msg);
		
		var fromVip = _makeVipInfo(fromInfo);
		var toVip = _makeVipInfo(toInfo);
		var role = _lc_._isSysMsg(fromId) ? '' : HyperLinkMgr.formatChatName(fromId, fromName)+'<font class="ui-chat-player-colon">:</font>';
		if ( CHAT_CHANNEL.PRIVATE == channel && toId != 0) {
			role = HyperLinkMgr.formatChatName(fromId, fromName)+'<font class="ui-chat-player-splitword">对</font>' + toVip + HyperLinkMgr.formatChatName(toId, toName) + '<font class="ui-chat-player-splitword">说</font><font class="ui-chat-player-colon">:</font>';
		}
		
		var cssclass = 'ui-chat-player-title';
		if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) {
			cssclass = 'ui-chat_player-title-fixie';
		} else if ( TQ.isMobile() ) {
			cssclass = 'mb-ui-chat-player-title';
		}		
		
		if ( role != '' ) {
			role = fromVip + '<div class="' + cssclass + '">' + role + '</div>';
		}
		var imgtag = _lc_._getChatTagImg(fromCityId, fromId, channel, cssclass);
		var msgColor = _lc_._getMsgColor(fromCityId, fromId, channel);
		return imgtag + role + TQ.formatColorStr(msg, msgColor, 'vertical-align:middle;') + _lc_.C_NEWLINE ;
	};
	
	var _makeVipInfo = function(vipInfo){
		var s = '';
		if ( !vipInfo ) return s;
		
		s += _makeBlueGrowTag(vipInfo);
		s += _makeBlueVipTag(vipInfo);
		s += _makeMyVipTag(vipInfo);
		
		return s;
	};
	
	var _makeMyVipTag = function(vipInfo){
		var s = '';
		if ( vipInfo.vip > 0 ) {
			s = IMG.makeVipChatTagDiv( vipInfo.vip );
		}
		return s;
	};
	
	var _makeBlueGrowTag = function(vipInfo){
		var s = '';
		if ( g_platform != '3366' ) {
			return s;
		}
		
		if ( vipInfo.blue.grow > 0 ) {
			s = IMG.makeBlueGrowChatTagDiv( vipInfo.blue.grow );
		}
		return s;
	};
	
	var _makeBlueVipTag = function(vipInfo) {
		var s = '';
		if ( g_platform != '3366' ) {
			return s;
		}
		
		var fmt = '<div style="float:left;height:17px;width:{0}px;BACKGROUND:url(\'{1}\') 1px 3px no-repeat;"></div>';
		if ( vipInfo.blue.level > 0 && vipInfo.blue.super_ ) {
			s += TQ.format(fmt, 16, IMG.makeBlueDiamondImg('high', vipInfo.blue.level));
		} else if ( vipInfo.blue.level > 0 ) {
			s += TQ.format(fmt, 16, IMG.makeBlueDiamondImg('comm', vipInfo.blue.level));
		}
		
		if ( vipInfo.blue.level > 0 && vipInfo.blue.year ) {
			s += TQ.format(fmt, 16, IMG.makeBlueDiamondYearImg('comm'));
			return IMG.makeCommChatTagDiv('ui_chat_bluevipyeartag', s);
		} else if (s != '') {
			return IMG.makeCommChatTagDiv('ui_chat_blueviptag', s);
		} else {
			return s;
		}
	};
	
	_lc_._isSysMsg = function(fromId){
		return fromId < CHAT_SYSPLAYER.MAX;
	};
	
	_lc_._getChatTagImg = function(fromCityId, fromId, channel, cssclass){
		var tag = _lc_._getChatTag(fromCityId, fromId, channel);
		return IMG.makeChatTagDiv(tag);
	};
	
	_lc_._getMsgColor = function(fromCityId, fromId, channel){
		var tag = _lc_._getChatTag(fromCityId, fromId, channel);
		return _lc_.m_chatColors[tag];
	};	
	
	_lc_._getChatTag = function(fromCityId, fromId, channel){
		var tag = 0;
		if ( _lc_._isSysMsg(fromId) ) {
			if ( fromId == CHAT_SYSPLAYER.STATE ) {
				tag = CHAT_TAG.STATE;
			}
			else if ( fromId == CHAT_SYSPLAYER.ALLIANCE ) {
				tag = CHAT_TAG.ALLIANCE;
			}
			else if ( fromId == CHAT_SYSPLAYER.SYS ) {
				tag = CHAT_TAG.SYS;
			}
		}
		else if (channel == CHAT_CHANNEL.STATE) {
			tag = fromCityId;//CHAT_TAG.STATE;
		}
		else if (channel == CHAT_CHANNEL.ALLIANCE) {
			tag = CHAT_TAG.ALLIANCE;
		}
		else if (channel == CHAT_CHANNEL.PRIVATE) {
			tag = CHAT_TAG.PRIVATE;
		}
		else if (channel == CHAT_CHANNEL.WORLD) {
			tag = CHAT_TAG.WORLD;
		}
		
		return tag;
	};
	
	_lc_._onSvrPkg = function(netevent){
		var chat = netevent.data;
		if ( _lc_._isClearWorldChannel(chat) ) {
			_lc_.m_channelscrollers[CHAT_CHANNEL.WORLD].clear();
			return;
		}
		
		if (!chat.msg) return;
		
		if ( !chat.fromInfo ) {
			chat.fromInfo = _makeEmptyInfo();
		}
		
		var toId = 0;
		if ( chat.toId ) toId = chat.toId;
		var toName = '';
		if ( chat.toName ) toName = chat.toName;
		var fromCityId = 0;
		if ( chat.fromCityId ) fromCityId = chat.fromCityId;
		var toInfo = _makeEmptyInfo();
		if ( chat.toInfo ) toInfo = chat.toInfo;
		if ( chat.fromId != CHAT_SYSPLAYER.SYS ) { // 过滤掉超链接
			chat.msg = chat.msg.replace(/#\[A:/g, "*[A:");
		}
		var msg = _lc_._composeMsg(fromCityId, chat.fromId, chat.fromName, chat.fromInfo, toId, toName, toInfo, chat.channel, chat.msg);
		_lc_._appendMessage(chat.channel, msg);
	};
	
	var _makeEmptyInfo = function(){
		return {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
	};
	
	_lc_._isClearWorldChannel = function(chat){
		return _lc_._isSysMsg(chat.fromId) 
			&& chat.channel == CHAT_CHANNEL.WORLD 
			&& chat.msg == ''; 
	};
	
	var _clearWorldChannel = function(){
		_lc_.m_channelscrollers[CHAT_CHANNEL.WORLD].clear();
	};
	
	_lc_._setChatTarget = function(target, name){
		if (target == CHAT_TARGET.PLAYER){
			_lc_.m_items.msginput.value = '/' + name + ' ';
		}
		else {
			_lc_.m_target = target;
			_lc_.m_items.target.setText(name);
		}
		
		TQ.setFocus(_lc_.m_items.msginput);
		TQ.moveCaretEnd(_lc_.m_items.msginput);
	};
	
	_lc_._sendMessage = function(){
		var ichat = _lc_.m_items.msginput;
		var msg = TQ.trimRight(ichat.value);
		_lc_._pushChatCache(msg);

		var targetPlayer = _lc_._getPlayerTarget();
		if (targetPlayer != '') {
			ichat.value = _makePlayerTarget(targetPlayer);
		} else {
			ichat.value = '';
		}
		
		TQ.setFocus(_lc_.m_items.msginput);
		
		if ( msg == '' ) {
			return;
		}
		
		if (_handleByGm(msg) ) {
			return;
		}
		
		_lc_._sendMessageCmd(msg);
	};
	
	var _handleByGm = function(msg){
		if ( !_isGmAndGmInstructMsg(msg) ) {
			return false;
		}
		
		if (_handleByClientGm(msg)){
			return true; 
		} else {
			_sendGM(msg);
			return true;
		}
	};
	
	var _isGmAndGmInstructMsg = function(msg){
		return (msg.indexOf('//') == 0 && m_g.getImgr().getGMFlag() > 0);
	};
	
	var _handleByClientGm = function(msg){
		if ( msg == '//testanim' ) { 
			UIM.openDlg('testanim');
			return true;
		} else if ( msg == '//close' ) {
			m_g.closeG();
			return true;
		} else {
			return false;
		}
	};
	
	_lc_._sendMessageCmd = function(msg){
		ChatSender.sendMsg(m_g, _lc_.m_target, msg);
	};
	
	_lc_._appendMessage = function(channel, msg){
		if ( channel == CHAT_CHANNEL.WORLD ) {
			_lc_.m_channelscrollers[channel].clear();
		}
		
		_lc_.m_channelscrollers[channel].append(msg);
		
		if (channel != CHAT_CHANNEL.ALL && channel != CHAT_CHANNEL.WORLD ){
			_lc_.m_channelscrollers[CHAT_CHANNEL.ALL].append(msg);
		}
	};
	
	var _setPanelH = function(hidx) {
		if (TQ.isMobile() ) {
			return;
		}
		
		var size = m_g.getWinSizer().getCurSize();
		var h = _lc_.m_resizeh.hs[ hidx ];
		var top = size.cy - h;
		// 设置整个dom的大小和位置
		TQ.setCSS(_lc_.m_dom, 'top', top+'px');
		TQ.setDomHeight(_lc_.m_dom, h );
		
		// 设置panel的高度，以及panel的背景图的高度
		TQ.setDomHeight(_lc_.m_items.chatpanel, h );
		TQ.setDomHeight(m_panelback, h );
	
		var conh = h - _lc_.m_resizeh.barh - 3*_lc_.m_resizeh.spaceh;
		
		// 设置tabpanel的高度，以及每个tabpage的高度
		var tabconh = conh - 70;
		var con = _lc_.m_items.channeltabs.getTabParent();
		TQ.setDomHeight(con, tabconh );
		for ( var i=0; i<_lc_.m_items.channeltabs.getTabCount(); ++i ) {
			// 每个tabpage的高度
			var panel = _lc_.m_items.channeltabs.getTabPanel(i);
			TQ.setDomHeight(panel, tabconh );
			
			// 每个tabpage的滚动面板高度
			var items = _lc_.m_items.channeltabs.getTabItems(i);
			items.con.setSize(items.con.getWidth(), tabconh-2*_lc_.m_resizeh.spaceh);
		}
		
		// 设置工具条的顶部位置
		var bartop = conh + 2*_lc_.m_resizeh.spaceh;
		TQ.setCSS(_lc_.m_items.toolbar, 'top', bartop+'px');
		
		// 重新刷新整个面板的背景图
		var gui = m_g.getGUI();
		var w = TQ.getDomWidth(_lc_.m_dom);
		var h = TQ.getDomHeight(_lc_.m_dom);
		gui.setUIBack(m_panelback, w, h, m_uibackres.type);
		
		_lc_.m_curhidx = hidx;
	};
	
	var _sendGM = function(msg){
		var ps = msg.split(' ');
		if (ps.length == 0) return;
		var funname = ps[0].substr(2, ps[0].length-2);
		var s = '';
		for ( var i=1; i<ps.length; ++i ) {
			s += ',p'+i+'=[['+ps[i]+']]';
		}
		m_g.send(null, '{cmd='+NETCMD_GM+',name=[['+funname+']]'+s+'}');
	};
	
	_lc_._getPlayerTarget = function(){
		var msg = _lc_.m_items.msginput.value;
		var reg = /^\/(\S*)/; 
		var r = msg.match(reg);
		return r ? r[1] : '';
	};
	
	var _makePlayerTarget = function(targetPlayer){
		return '/' + targetPlayer + ' ';
	};
	
	//-----------
	//private:data
	//-----------
	var m_g=null;
	var m_this=null;
	_lc_.m_dom=null;
	_lc_.m_items={};
	var m_panelback=null;
	var m_uibackres=uiback.dlg.chatpanel;
	var m_targetmenu=null;
	var m_showchannel=0;
	_lc_.m_target=CHAT_TARGET.STATE;
	var m_chatplayer='';
	_lc_.m_channelscrollers={};
	_lc_.m_resizeh = {hs:[240, 360], spaceh:2, barh:56};
	_lc_.m_curhidx = 0;
	_lc_.m_inputcache={list:[],curpos:0};
	_lc_.m_faceUtil = null;
	_lc_.m_chatColors = {};
	var m_isFixedPos = false;
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
	//ChatPanel-unittest-end
};

SysMsgPanel = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_MAX_CHAT_LINES = 100;
	var C_REDUCE_LINES = 10;
	
	//-----------
	//private:data
	//-----------
	_lc_.m_g;
	var m_this;
	var m_dom;
	var m_items={};
	var m_mainitems=null;
	var m_panelback;
	//var m_uibackres = uiback.panel.panel1;
	var m_uibackres = uiback.dlg.noborder;
	var m_chatconscroller;
	var m_linenos=[];	
	
	//------------
	//public:method
	//------------
	this.init = function(g, mainitems){
		_lc_.m_g = g;
		m_this = this;
		m_mainitems = mainitems;
		m_dom = m_mainitems.sysmsg;
		_initPanel();
	};
	
	this.append = function(flag, msg){
		_appendMsg(flag, msg);
	};
	
	this.refresh = function(){
		m_items.con.refresh();
	};
	
	//------------
	//private:method
	//------------
	var _initPanel = function(){
		var gui = _lc_.m_g.getGUI();
		gui.initPanel(m_dom, uicfg.main.sysmsgpanel, m_items);
		TQ.fixIE6Png(m_dom);
		m_chatconscroller = ChatConScroller.snew(_lc_.m_g);
		m_chatconscroller.initScroller(m_items.con, C_MAX_CHAT_LINES, C_REDUCE_LINES);
		
		if ( TQ.isMobile() ) {
			m_mainitems.expandSysMsgBtn.setCaller({self:m_this, caller:_onClickExpand});
			m_mainitems.collapseSysMsgBtn.setCaller({self:m_this, caller:_onClickCollapse});
			TQ.setCSS(m_mainitems.expandSysMsgBtn.getParent(), 'display', 'none' );
			TQ.setCSS(m_mainitems.collapseSysMsgBtn.getParent(), 'display', 'block' );
		}
	};
	
	var _appendMsg = function(flag, msg){
		var linemsg = IMG.makeChatTagDiv(flag) + msg + '<br/>';
		m_chatconscroller.append(linemsg);
	};
	
	var _onClickExpand = function(){
		TQ.setCSS(m_dom, 'display', 'block');
		TQ.setCSS(m_mainitems.chat, 'display', 'block');
		TQ.setCSS(m_mainitems.expandSysMsgBtn.getParent(), 'display', 'none' );
		TQ.setCSS(m_mainitems.collapseSysMsgBtn.getParent(), 'display', 'block' );
		
	};
	
	var _onClickCollapse = function(){
		TQ.setCSS(m_dom, 'display', 'none');
		TQ.setCSS(m_mainitems.chat, 'display', 'none');
		TQ.setCSS(m_mainitems.expandSysMsgBtn.getParent(), 'display', 'block' );
		TQ.setCSS(m_mainitems.collapseSysMsgBtn.getParent(), 'display', 'none' );
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
	//SysMsgPanel-unittest-end
};