//////////////////////////////////////////////////////////////////////////////////////////
requireEx('./handler/tqChatHandler.js', [
	{
		start:'//ChatPanel-unittest-start'
		,end:'//ChatPanel-unittest-end'
		,items:[
			'm_curhidx'
			,'m_resizeh'
			,'m_target'
			,'m_items'
			,'m_channelscrollers'
			,'m_chatColors'
			,'m_faceUtil'
			,'C_PANEL_W'
			,'C_MAXCON_LEN'
			,'C_MAX_CHAT_LINES'
			,'C_REDUCE_LINES'
			,'C_NEWLINE'
			,'C_MAX_HISTORY_CNT'
			,'m_dom'
			,'_initChatColors'
			,'_setChatTarget'
			,'_sendMessageCmd'
			,'_insertInputMsg'
			,'_isSysMsg'
			,'_getChatTagImg'
			,'_getChatTag'
			,'_getMsgColor'
			,'_composeMsg'
			,'_onSvrPkg'
			,'_appendMessage'
			,'_createScrollers'
			,'_isClearWorldChannel'
			,'_onSend'
			,'_sendMessage'
			,'_pushChatCache'
			,'_getPlayerTarget'
			,'m_inputcache'
		]
	}
	,{
		start:'//SysMsgPanel-unittest-start'
		,end:'//SysMsgPanel-unittest-end'
		,items:['m_g']
	}
]);

TestCaseChatPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g = g_app;
		this.panel = UIM.getPanel('chat');
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getSize = function(){
		assertEQ ( this.panel.getSize(), {cx:this.lc().C_PANEL_W, cy:this.lc().m_resizeh.hs[0]} );
		this.lc().m_curhidx = 1;
		assertEQ ( this.panel.getSize(), {cx:this.lc().C_PANEL_W, cy:this.lc().m_resizeh.hs[1]} );
	};
	
	this.test_setPosition = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.panel.setPosition(1,2);
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_dom, 1, 2] );
	};
	
	this.test_appendMsgToCurChannel = function(){
		this.mm.mock(this.lc(), '_composeMsg', ['compose msg'] );
		this.mm.mock(this.lc(), '_appendMessage');
		
		var fromInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		var toInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		this.lc().m_items.channeltabs.activeTab(1);
		this.panel.appendMsgToCurChannel('msg');
		assertEQ ( this.mm.params['_composeMsg'], [0, CHAT_SYSPLAYER.SYS, '', fromInfo, 0, '', toInfo, 1, 'msg'] );
		assertEQ ( this.mm.params['_appendMessage'], [1, 'compose msg'] );
	};
	
	this.test__initChatColors = function(){
		this.lc().m_chatColors = {};
		this.lc()._initChatColors();
		assertEQ ( this.lc().m_chatColors[CHAT_TAG.WORLD], '#FEC200' );
		assertEQ ( this.lc().m_chatColors[CHAT_TAG.SYS], '#FFC200' );
		assertEQ ( this.lc().m_chatColors[CHAT_TAG.STATE], '#FEFE00' );
		assertEQ ( this.lc().m_chatColors[CHAT_TAG.ALLIANCE], '#00FE00' );
		assertEQ ( this.lc().m_chatColors[CHAT_TAG.PRIVATE], '#FE80FE' );
	};
	
	this.test__createScrollers = function(){
		var cc = ChatConScroller.snew(this.g);
		this.mm.mock(ChatConScroller, 'snew', [cc]);
		this.mm.mock(cc, 'initScroller');
	
		this.lc()._createScrollers();
		assertStrRepeatCount ( this.mm.walkLog, 'snew', 5 );
		assertStrRepeatCount ( this.mm.walkLog, 'initScroller', 5 );
		assertEQ ( this.mm.params['snew.0'], [this.g] );
		assertEQ ( this.mm.params['initScroller.0'], [this.lc().m_items.channeltabs.getTabItems(0).con, this.lc().C_MAX_CHAT_LINES, this.lc().C_REDUCE_LINES] );
		assertEQ ( this.mm.params['initScroller.1'], [this.lc().m_items.channeltabs.getTabItems(1).con, this.lc().C_MAX_CHAT_LINES, this.lc().C_REDUCE_LINES] );
		assertEQ ( this.mm.params['initScroller.3'], [this.lc().m_items.channeltabs.getTabItems(3).con, this.lc().C_MAX_CHAT_LINES, this.lc().C_REDUCE_LINES] );
		assertEQ ( this.mm.params['initScroller.4'], [this.lc().m_items.speakercon, this.lc().C_MAX_CHAT_LINES, this.lc().C_REDUCE_LINES] );
	};
	
	this.test__insertInputMsg = function(){
		this.mm.mock(TQ, 'insertAtCursor');
		this.vb.replace(this.lc(), 'C_MAXCON_LEN', 2);
		this.lc().m_items.msginput.value = '1';
		this.lc()._insertInputMsg('2');
		assertEQ ( this.mm.params['insertAtCursor'], [this.lc().m_items.msginput, '2'] );
		
		this.mm.clear();
		this.lc()._insertInputMsg('23');
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__composeMsg = function(){
		this.mm.mock(HyperLinkMgr, 'formatLink', null, function(msg){
			return msg + '_link';
		});
		this.mm.mock(this.lc().m_faceUtil, 'faceFormat', null, function(msg){
			return msg + '_face';
		});
		
		var fromId = CHAT_SYSPLAYER.SYS;
		var fromName = '';
		var channel = CHAT_CHANNEL.WORLD;
		var msg = '<msg>';
		
		var expect_imgtag = this.lc()._getChatTagImg(fromId, channel);
		var expect_role = '';
		var expect_msg = TQ.formatColorStr('<msg>_link_face', this.lc()._getMsgColor(fromId,channel), 'vertical-align:middle;');
		var expect_completemsg = expect_imgtag + expect_role + expect_msg + this.lc().C_NEWLINE;
		var fromInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		var toInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		assertEQ ( this.lc()._composeMsg(0, fromId, fromName, fromInfo, 0, '', toInfo, channel, msg), expect_completemsg );
		
		fromId = 100000;
		fromName = 'role';
		expect_imgtag = this.lc()._getChatTagImg(0, fromId, channel);
		expect_role = '<div class="ui-chat-player-title">' + HyperLinkMgr.formatChatName(fromId, fromName)+'<font class="ui-chat-player-colon">:</font>' + '</div>';
		expect_msg = TQ.formatColorStr('&lt;msg&gt;_link_face', this.lc()._getMsgColor(0, fromId,channel), 'vertical-align:middle;');
		expect_completemsg = expect_imgtag + expect_role + expect_msg + this.lc().C_NEWLINE;
		assertEQ ( this.lc()._composeMsg(0, fromId, fromName, fromInfo, 0, '', toInfo, channel, msg), expect_completemsg );
		
		
		var fromInfo = {vip:3,blue:{level:1,year:1,super_:0,grow:6}};
		var toInfo = {vip:4,blue:{level:2,year:0,super_:1,grow:7}};
		var toId = 200000;
		var toName = 'target';
		channel = CHAT_CHANNEL.PRIVATE;
		var factS = this.lc()._composeMsg(0, fromId, fromName, fromInfo, toId, toName, toInfo, channel, msg);
		expect_completemsg = '<div class=ui_chat_imgtag><div class=inner_img style="BACKGROUND:url(\'images/office/chat/flagtag/private.gif?v=0\') 0px 3px no-repeat;"></div></div><div class=ui_chat_viptag><div class=inner_img style="BACKGROUND:url(\'images/office/vip/small/3.gif?v=0\') 0px 4px no-repeat;"></div></div><div class=ui_chat_growtag><div class=inner_img style="BACKGROUND:url(\'images/office/qq/bd/grow/chat/6.gif?v=0\') 0px 3px no-repeat;"></div></div><div class=ui_chat_bluevipyeartag><div style="float:left;height:16px;width:16px;BACKGROUND:url(\'images/office/qq/bd/flag/comm/1.gif?v=0\') 1px 0px no-repeat;"></div><div style="float:left;height:16px;width:16px;BACKGROUND:url(\'images/office/qq/bd/flag/year.gif?v=0\') 1px 0px no-repeat;"></div></div><div class="ui-chat-player-title"><a class=\'ui-chat-link-player\' href=\'#\' onclick=\'javascript:HyperLinkMgr.onClickLink(event,"r",100000,"role"); return false;\' ondragstart=\'return false;\' onselectstart=\'return false;\'>[role]</a><font class="ui-chat-player-splitword">对</font><div class=ui_chat_viptag><div class=inner_img style="BACKGROUND:url(\'images/office/vip/small/4.gif?v=0\') 0px 4px no-repeat;"></div></div><div class=ui_chat_growtag><div class=inner_img style="BACKGROUND:url(\'images/office/qq/bd/grow/chat/7.gif?v=0\') 0px 3px no-repeat;"></div></div><div class=ui_chat_blueviptag><div style="float:left;height:16px;width:16px;BACKGROUND:url(\'images/office/qq/bd/flag/high/2.gif?v=0\') 1px 0px no-repeat;"></div></div><a class=\'ui-chat-link-player\' href=\'#\' onclick=\'javascript:HyperLinkMgr.onClickLink(event,"r",200000,"target"); return false;\' ondragstart=\'return false;\' onselectstart=\'return false;\'>[target]</a><font class="ui-chat-player-splitword">说</font><font class="ui-chat-player-colon">:</font></div><font color="#FE80FE">&lt;msg&gt;_link_face</font><BR/>';
		//assertEQ ( factS, expect_completemsg );
	};
	
	this.test__isSysMsg = function(){
		assertEQ ( this.lc()._isSysMsg(CHAT_SYSPLAYER.STATE), true );
		assertEQ ( this.lc()._isSysMsg(CHAT_SYSPLAYER.ALLIANCE), true );
		assertEQ ( this.lc()._isSysMsg(CHAT_SYSPLAYER.SYS), true );
		assertEQ ( this.lc()._isSysMsg(10000), false );
	};
	
	this.test__getChatTagImg = function(){
		this.mm.mock(IMG, 'getChatTag', null, function(tag){
			if (tag == CHAT_TAG.SYS) return 'sysimg';
			else return 'no';
		});
		var fromId = CHAT_SYSPLAYER.SYS; var channel = CHAT_CHANNEL.WORLD;
		assertEQ ( this.lc()._getChatTagImg(fromId, channel), '<div class=ui_chat_imgtag><div class=inner_img style="BACKGROUND:url(\'sysimg\') 0px 0px no-repeat;"></div></div>' );
	};
	
	this.test__getMsgColor = function(){
		this.lc().m_chatColors = {};
		this.lc().m_chatColors[CHAT_TAG.SYS] = 'red';
		var fromId = CHAT_SYSPLAYER.SYS; var channel = CHAT_CHANNEL.WORLD;
		assertEQ ( this.lc()._getMsgColor(fromId, channel), 'red' );
	};	
	
	this.test__getChatTag = function(){
		// sys player
		var fromId = CHAT_SYSPLAYER.STATE; var channel = CHAT_CHANNEL.STATE;
		assertEQ ( this.lc()._getChatTag(9900001, fromId, channel), CHAT_TAG.STATE );
		fromId = CHAT_SYSPLAYER.ALLIANCE; channel = CHAT_CHANNEL.STATE;
		assertEQ ( this.lc()._getChatTag(0, fromId, channel), CHAT_TAG.ALLIANCE );
		fromId = CHAT_SYSPLAYER.SYS; channel = CHAT_CHANNEL.STATE;
		assertEQ ( this.lc()._getChatTag(0, fromId, channel), CHAT_TAG.SYS );
		
		// comm player
		fromId = 100000; channel = CHAT_CHANNEL.STATE;
		assertEQ ( this.lc()._getChatTag(9900001, fromId, channel), 9900001 );
		fromId = 100000; channel = CHAT_CHANNEL.ALLIANCE;
		assertEQ ( this.lc()._getChatTag(0, fromId, channel), CHAT_TAG.ALLIANCE );
		fromId = 100000; channel = CHAT_CHANNEL.PRIVATE;
		assertEQ ( this.lc()._getChatTag(0, fromId, channel), CHAT_TAG.PRIVATE );
		fromId = 100000; channel = CHAT_CHANNEL.WORLD;
		assertEQ ( this.lc()._getChatTag(0, fromId, channel), CHAT_TAG.WORLD );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc(), '_composeMsg', ['compose msg']);
		this.mm.mock(this.lc(), '_appendMessage');
		this.mm.mock(this.lc().m_channelscrollers[CHAT_CHANNEL.WORLD], 'clear');
		
		var netevent = {data:{}};
		this.lc()._onSvrPkg(netevent);
		assertEQ ( this.mm.walkLog, '' );
		
		var fromInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		var toInfo = {vip:0,blue:{level:0,year:0,super_:0,grow:0}};
		
		netevent.data = {fromCityId:9900001, fromId:10000, fromName:'name', channel:CHAT_CHANNEL.STATE, msg:'msg'};
		this.lc()._onSvrPkg(netevent);
		assertEQ ( this.mm.walkLog, '_composeMsg,_appendMessage' );
		assertEQ ( this.mm.params['_composeMsg'], [9900001, 10000, 'name', fromInfo, 0, '', toInfo, CHAT_CHANNEL.STATE, 'msg'] );
		assertEQ ( this.mm.params['_appendMessage'], [CHAT_CHANNEL.STATE, 'compose msg'] );
		
		this.mm.clear();
		netevent.data = {fromId:0, fromName:'', channel:CHAT_CHANNEL.WORLD, msg:''};
		this.lc()._onSvrPkg(netevent);
		assertEQ ( this.mm.walkLog, 'clear' );
	};
	
	this.test__isClearWorldChannel = function(){
		var chat = {fromId:0, channel:CHAT_CHANNEL.WORLD, msg:''};
		assertEQ ( this.lc()._isClearWorldChannel(chat), true );
		
		chat = {fromId:0, channel:CHAT_CHANNEL.WORLD, msg:'ss'};
		assertEQ ( this.lc()._isClearWorldChannel(chat), false );
		
		chat = {fromId:0, channel:CHAT_CHANNEL.PRIVATE, msg:''};
		assertEQ ( this.lc()._isClearWorldChannel(chat), false );
		
		chat = {fromId:100000, channel:CHAT_CHANNEL.WORLD, msg:''};
		assertEQ ( this.lc()._isClearWorldChannel(chat), false );
	};
	
	this.test__appendMessage = function(){
		this.mm.mock(this.lc().m_channelscrollers[CHAT_CHANNEL.WORLD], 'clear');
		this.mm.mock(this.lc().m_channelscrollers[CHAT_CHANNEL.WORLD], 'append');
		this.mm.mock(this.lc().m_channelscrollers[CHAT_CHANNEL.STATE], 'append');
		this.mm.mock(this.lc().m_channelscrollers[CHAT_CHANNEL.ALL], 'append');
		this.lc()._appendMessage(CHAT_CHANNEL.STATE, 'msg');
		assertEQ ( this.mm.walkLog, 'append,append' );
		assertEQ ( this.mm.params['append.0'], ['msg'] );
		assertEQ ( this.mm.params['append.1'], ['msg'] );
		
		this.mm.clear();
		this.lc()._appendMessage(CHAT_CHANNEL.ALL, 'msg');
		assertEQ ( this.mm.walkLog, 'append' );
		
		this.mm.clear();
		this.lc()._appendMessage(CHAT_CHANNEL.WORLD, 'msg');
		assertEQ ( this.mm.walkLog, 'clear,append' );
		assertEQ ( this.mm.params['append'], ['msg'] );
	};
	
	this.test__setChatTarget = function(){
		this.mm.mock(TQ, 'setFocus');
		this.mm.mock(TQ, 'moveCaretEnd');
		this.lc().m_items.msginput.value = 'hello';
		this.lc()._setChatTarget(CHAT_TARGET.WORLD, 'world');
		assertEQ ( this.lc().m_target, CHAT_TARGET.WORLD );
		assertEQ ( this.lc().m_items.target.getText(), 'world' );
		assertEQ ( this.lc().m_items.msginput.value, 'hello' );
		assertEQ ( this.mm.walkLog, 'setFocus,moveCaretEnd' );
		
		this.mm.clear();
		this.lc()._setChatTarget(CHAT_TARGET.STATE, 'state');
		assertEQ ( this.lc().m_target, CHAT_TARGET.STATE );
		assertEQ ( this.lc().m_items.target.getText(), 'state' );
		assertEQ ( this.lc().m_items.msginput.value, 'hello' );
		assertEQ ( this.mm.walkLog, 'setFocus,moveCaretEnd' );
		
		this.mm.clear();
		this.lc()._setChatTarget(CHAT_TARGET.PLAYER, 'role');
		assertEQ ( this.lc().m_target, CHAT_TARGET.STATE );
		assertEQ ( this.lc().m_items.target.getText(), 'state' );
		assertEQ ( this.lc().m_items.msginput.value, '/role ' );
		assertEQ ( this.mm.walkLog, 'setFocus,moveCaretEnd' );
		
		this.mm.clear();
		this.lc()._setChatTarget(CHAT_TARGET.ALLIANCE, 'alli');
		assertEQ ( this.lc().m_target, CHAT_TARGET.ALLIANCE );
		assertEQ ( this.lc().m_items.target.getText(), 'alli' );
		assertEQ ( this.lc().m_items.msginput.value, '/role ' );	
		assertEQ ( this.mm.walkLog, 'setFocus,moveCaretEnd' );
	};
		
	this.test__sendMessageCmd = function(){
		this.mm.mock(ChatSender, 'sendMsg');
		this.lc().m_target = 1;
		this.lc()._sendMessageCmd('msg');
		assertEQ ( this.mm.params['sendMsg'], [this.g, 1, 'msg'] );
	};
	
	this.test_sendMessageToCurChannel = function(){
		this.lc().m_items.msginput.value = '';
		this.mm.mock(this.lc(), '_sendMessageCmd');
		this.panel.sendMessageToCurChannel('msg');
		assertEQ ( this.mm.params['_sendMessageCmd'], ['msg'] );
		
		this.mm.clear();
		this.lc().m_items.msginput.value = '/target '
		this.panel.sendMessageToCurChannel('msg');
		assertEQ ( this.mm.params['_sendMessageCmd'], ['/target msg'] );
	};
	
	this.test__onSend = function(){
		this.mm.mock(this.lc(), '_sendMessage');
		this.lc()._onSend();
		assertEQ ( this.mm.walkLog, '_sendMessage' );
	};
	
	this.test__pushChatCache = function(){
		this.lc().m_inputcache.list = [];
		this.lc().m_inputcache.curpos = 0;
		
		this.lc()._pushChatCache('');
		assertEQ ( this.lc().m_inputcache.list, [] );
		assertEQ ( this.lc().m_inputcache.curpos, 0 );
		
		this.lc()._pushChatCache('1');
		assertEQ ( this.lc().m_inputcache.list, ['1'] );
		assertEQ ( this.lc().m_inputcache.curpos, 0 );
		
		this.lc()._pushChatCache('2');
		assertEQ ( this.lc().m_inputcache.list, ['1', '2'] );
		assertEQ ( this.lc().m_inputcache.curpos, 1 );
		
		this.lc()._pushChatCache('3');
		assertEQ ( this.lc().m_inputcache.list, ['1', '2', '3'] );
		assertEQ ( this.lc().m_inputcache.curpos, 2 );
		
		this.lc().m_inputcache.curpos = 0;
		this.lc()._pushChatCache('3');
		assertEQ ( this.lc().m_inputcache.list, ['1', '2', '3'] );
		assertEQ ( this.lc().m_inputcache.curpos, 2 );
		
		this.lc().m_inputcache.curpos = 0;
		this.lc()._pushChatCache('2');
		assertEQ ( this.lc().m_inputcache.list, ['1', '3', '2'] );
		assertEQ ( this.lc().m_inputcache.curpos, 2 );
		
		this.vb.replace(this.lc(), 'C_MAX_HISTORY_CNT', 3);
		this.lc().m_inputcache.curpos = 0;
		this.lc()._pushChatCache('4');
		assertEQ ( this.lc().m_inputcache.list, ['3', '2', '4'] );
		assertEQ ( this.lc().m_inputcache.curpos, 2 );
	};
	
	this.test__getPlayerTarget = function(){
		this.lc().m_items.msginput.value = '';
		assertEQ ( this.lc()._getPlayerTarget(), '' );
		
		this.lc().m_items.msginput.value = '/';
		assertEQ ( this.lc()._getPlayerTarget(), '' );
		
		this.lc().m_items.msginput.value = '/ ';
		assertEQ ( this.lc()._getPlayerTarget(), '' );
		
		this.lc().m_items.msginput.value = '/a ';
		assertEQ ( this.lc()._getPlayerTarget(), 'a' );
		
		this.lc().m_items.msginput.value = '/a';
		assertEQ ( this.lc()._getPlayerTarget(), 'a' );
		
		this.lc().m_items.msginput.value = '/a人';
		assertEQ ( this.lc()._getPlayerTarget(), 'a人' );
	};
	
	this.test__sendMessageClearInput = function(){
		this.lc().m_items.msginput.value = 'msg';
		this.lc()._sendMessage();
		assertEQ ( this.lc().m_items.msginput.value, '' );
	};
	
	this.test__sendMessageSetPlayerTargetToInput = function(){
		this.lc().m_items.msginput.value = '/abc msg';
		this.lc()._sendMessage();
		assertEQ ( this.lc().m_items.msginput.value, '/abc ' );
	};
});

TestCaseSysMsgPanel = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
});

tqChatHandler_t_main = function(suite) {
	if ( TQ.isMobile() ) return;
	suite.addTestCase(TestCaseChatPanel, 'TestCaseChatPanel');
	suite.addTestCase(TestCaseSysMsgPanel, 'TestCaseSysMsgPanel');
};

