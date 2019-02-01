require('./tqFightResultDlg_data2_t.js');

requireEx('./handler/tqLetterHandler.js', [
	{
		start:'//LetterNetCmdHdr-unittest-start'
		,end:'//LetterNetCmdHdr-unittest-end'
		,items:['_onSvrMail','_notifyNewMailEventStart','_notifyNewMailEventStop','_decodeMails','_classifyFill']
	}
	,{
		start:'//ReadLetterDlg-unittest-start'
		,end:'//ReadLetterDlg-unittest-end'
		,items:['m_dlg'
			,'m_g'
			,'m_items'
			,'m_curIdx'
			,'m_resList'
			,'_setCallers'
			,'_prevIdx'
			,'_nextIdx'
			,'_onLetterUpdate'
			,'_initParams'
			, '_showCurLetter'
			, '_isShow'
			,'_getCurLetterRes'
			,'_setDlgBtnsEnableState'
			,'_setPrevBtnEnableState'
			,'_setNextBtnEnableState'
			,'_setReplyBtnEnableState'
			,'_makeLetterContent'
			,'_setLetter'
			,'_setLetterItems'
			,'_onGetItems'
			,'_onGetItemTip'
			,'m_tempLetterMakerMgr']		
	}
	,{
		start:'//WriteLetterDlg-unittest-start'
		,end:'//WriteLetterDlg-unittest-end'
		,items:[
			,'_initDlg'
			,'_setInputMaxLen'
			,'m_dlg'
			,'m_this'
			,'m_items'
			,'_setRecv'
			,'_setTitle'
			,'_setContent'
			,'_setFocus'
			,'_onClickSendBtn'
			,'_onClickCancelBtn'
			,'_sendMail'
			,'_checkRecv'
			,'_checkTitle'
			,'_checkContent'
			,'_checkInputValue'
			]		
	}
]);

TestCaseLetterNetCmdHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testInitRegEvent = function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		var lc = hdr.lc;
		var node = this.g.getRegEventNode(EVT.NET, NETCMD.MAIL)[0];
		assert ( node.self == hdr );
		assert ( node.fun == lc()._onSvrMail );
	};
	
	this.testOnSvrMail = function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		var g_cmd = {mails:[]};
		var g_decodeMailsRt = {};
		
		this.mm.mock(hdr.lc(), '_notifyNewMailEventStart');
		this.mm.mock(hdr.lc(), '_notifyNewMailEventStop');
		this.mm.mock(hdr.lc(), '_decodeMails', [g_decodeMailsRt] );
		this.mm.mock(TQ, 'dictCopy' );
		this.mm.mock(hdr.lc(), '_classifyFill' );
		this.mm.mock(this.g, 'sendEvent' );
		
		hdr.lc()._onSvrMail({eid:EVT.NET, sid:NETCMD.MAIL, data:{} })
		assert ( this.mm.walkLog == '' );
		
		hdr.lc()._onSvrMail({eid:EVT.NET, sid:NETCMD.MAIL, data:g_cmd })
		assert ( this.mm.walkLog == '_notifyNewMailEventStart,_decodeMails,dictCopy,_classifyFill,_notifyNewMailEventStop,sendEvent' );
		assertListEQ ( this.mm.params['_decodeMails'], [g_cmd.mails] );
		assertListEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getLetterRes().all, g_decodeMailsRt] );
		assertListEQ ( this.mm.params['_classifyFill'], [] );
		assertListEQ ( this.mm.params['_notifyNewMailEventStart'], [g_cmd.mails ] );
		assertListEQ ( this.mm.params['_notifyNewMailEventStop'], [this.g.getImgr().getLetterRes().all ] );
		assert ( this.mm.params['sendEvent'][0].eid == EVT.LETTERUPDATE );
		assert ( this.mm.params['sendEvent'][0].sid == 0 );
	};
	
	this.test_notifyNewMailEventStart= function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		
		this.mm.mock(this.g, 'sendEvent' );
		hdr.lc()._notifyNewMailEventStart([{id:1,read:1}]);
		assert ( this.mm.walkLog == '' );
		
		hdr.lc()._notifyNewMailEventStart([{id:1,read:0}]);
		assert ( this.mm.walkLog == 'sendEvent' );
		assert ( this.mm.params['sendEvent'][0].eid == EVT.NEW_MAIL );
		assert ( this.mm.params['sendEvent'][0].sid == 0 );
		assert ( this.mm.params['sendEvent'][0].start == true );
	};
	
	this.test_notifyNewMailEventStart= function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		
		this.mm.mock(this.g, 'sendEvent' );
		hdr.lc()._notifyNewMailEventStop([{id:1,read:0}]);
		assert ( this.mm.walkLog == '' );
		
		hdr.lc()._notifyNewMailEventStop([{id:1,read:1}]);
		assert ( this.mm.walkLog == 'sendEvent' );
		assert ( this.mm.params['sendEvent'][0].eid == EVT.NEW_MAIL );
		assert ( this.mm.params['sendEvent'][0].sid == 0 );
		assert ( this.mm.params['sendEvent'][0].stop == true );
	};
	
	this.test_decodeMails = function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		var cmd = {mails:[
			{id:1,sys:1,read:0,from:"",title:"<>",time:1,detail:{}}
			,{id:2,sys:0,read:0,from:"b",title:"a",time:1,detail:{msg:"&bfh;"}}
			,{id:3,sys:0,read:1,from:"b",title:"a",time:1}
			,{id:4}
			]};
		var mails = hdr.lc()._decodeMails(cmd.mails);
		assert ( mails[0].title == "&lt;&gt;" );
		assert ( mails[1].detail.msg == "%" );
		assert ( mails == cmd.mails );
	};
	
	this.test_classifyFill = function(){
		var hdr = LetterNetCmdHdr.snew(this.g);
		var letterRes = this.g.getImgr().getLetterRes();
		letterRes.all = [{id:1, sys:1, from:'', read:0, time:2}
			,{id:2, sys:1, from:'', read:0, time:1}
			,{id:3, sys:1, from:'', read:0, time:3}
			,{id:4, sys:0, from:'role4', read:0, time:4}
			,{id:5, sys:0, from:'role5', read:1, time:5}
			,{id:6, sys:0, from:'role6', read:1, time:3}
			,{id:7, sys:0, from:'role7', read:1, time:2}
			];
		
		hdr.lc()._classifyFill();

		assert ( letterRes.un[0].id == 4 );
		assert ( letterRes.un[1].id == 3 );
		assert ( letterRes.un[1].from == rstr.letter.letterdlg.sysFrom );	
		assert ( letterRes.un[2].id == 1 );
		assert ( letterRes.un[2].from == rstr.letter.letterdlg.sysFrom );	
		assert ( letterRes.un[3].id == 2 );
		assert ( letterRes.un[3].from == rstr.letter.letterdlg.sysFrom );	
		
		assert ( letterRes.sys[0].id == 3 );
		assert ( letterRes.sys[0].from == rstr.letter.letterdlg.sysFrom );
		assert ( letterRes.sys[1].id == 1 );
		assert ( letterRes.sys[1].from == rstr.letter.letterdlg.sysFrom );
		assert ( letterRes.sys[2].id == 2 );
		assert ( letterRes.sys[2].from == rstr.letter.letterdlg.sysFrom );
		
		assert ( letterRes.com[0].id == 5 );
		assert ( letterRes.com[1].id == 4 );
		assert ( letterRes.com[2].id == 6 );
		assert ( letterRes.com[3].id == 7 );
	};
});

TestCaseLetterDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = LetterDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(MailSender, 'sendGetMails');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendGetMails'], [this.g]);
		
		this.helper_makeLetterRes();
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.LETTERUPDATE, sid:0});
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getCount(), 0,  'not update list when dlg hide' )
		
		this.dlg.getCoreDlg().show();
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getCount(), 0);
		this.g.sendEvent({eid:EVT.LETTERUPDATE, sid:0});
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getCount(), 1);
	};
	
	this.test_getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg().modal, false );
		assertEQ ( this.dlg._getDlgCfg().title, rstr.letter.letterdlg.title );
		assertEQ ( this.dlg._getDlgCfg().pos, {x:"center", y:30} );
		assertEQ ( this.dlg._getDlgCfg().uicfg, uicfg.letter.letterdlg );
	};
	
	this.test_bottomBtns = function(){
		var btns = this.dlg.getCoreDlg().getBtns();
		assertEQ ( btns[0].getText(), rstr.letter.letterdlg.btns.write);
		assertEQ ( btns[1].getText(), rstr.letter.letterdlg.btns.selall);
		assertEQ ( btns[2].getText(), rstr.letter.letterdlg.btns.unselall);
		assertEQ ( btns[3].getText(), rstr.letter.letterdlg.btns.deleteall);
		assertEQ ( btns[4].getText(), rstr.comm.close);
	};
	
	this.test_tabTexts = function(){
		assertEQ ( this.dlg.getItems().lettertabs.getTabText(0), rstr.letter.letterdlg.tabs[0] );
		assertEQ ( this.dlg.getItems().lettertabs.getTabText(1), rstr.letter.letterdlg.tabs[1] );
		assertEQ ( this.dlg.getItems().lettertabs.getTabText(2), rstr.letter.letterdlg.tabs[2] );
	};
	
	this.test_showSelAllBtnWhenOpenDlg = function(){
		var btns = this.dlg.getCoreDlg().getBtns();
		assertEQ ( btns[1].isShow(), true );
		assertEQ ( btns[2].isShow(), false );
	};
	
	this.test_selectFirstTabWhenOpenDlg = function(){
		assertEQ ( this.dlg.getItems().lettertabs.getActiveTab(), 0 );
	};
	
	this.helper_makeLetterRes = function(){
		this.g.getImgr().getLetterRes()['un'] = [{id:1, read:0, from:'sys', title:'t1', time:1414153972} ];
		this.g.getImgr().getLetterRes()['sys'] = [{id:2, read:1, from:'sys', title:'t1', time:1414153972}, {id:3, read:0, from:'sys', title:'t2', time:1414153971} ];
		this.g.getImgr().getLetterRes()['com'] = [
				{read:1, from:'ff1', title:'tt1', time:1414153970}
				,{read:0, from:'ff2', title:'tt2', time:1414153960}
				,{read:0, from:'ff3', title:'tt3', time:1414153960}
				,{read:0, from:'ff4', title:'tt4', time:1414153960}
				,{read:0, from:'ff5', title:'tt5', time:1414153960}
				,{read:0, from:'ff6', title:'tt6', time:1414153960}
				,{read:0, from:'ff7', title:'tt7', time:1414153960}
				,{read:0, from:'ff8', title:'tt8', time:1414153960}
				,{read:0, from:'ff9', title:'tt9', time:1414153960}
				,{read:0, from:'ff10', title:'tt10', time:1414153960}
				,{read:0, from:'ff11', title:'tt11', time:1414153960}
				,{read:0, from:'ff12', title:'tt12', time:1414153960}
				];
	};
	
	this.test_letterListItemCount = function(){
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getCount(), 1 );
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(1).letterlist.getCount(), 2 );
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(2).letterlist.getCount(), 11, 'one page can show 11 items' );
	};
	
	this.test_pageCount = function(){
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(0).pagebar.getPageCnt(), 1 )
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(1).pagebar.getPageCnt(), 1 )
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(2).pagebar.getPageCnt(), 2 )
	};
	
	this.test_letterListItemContent = function(){
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		var item = this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getItem(0);
		assertEQ ( TQ.getTextEx(item.exsubs.flag), rstr.letter.letterdlg.status[0] );
		assertEQ ( TQ.getTextEx(item.exsubs.from), 'sys' );
		assertEQ ( TQ.getTextEx(item.exsubs.title), 't1' );
		assertEQ ( TQ.getTextEx(item.exsubs.time), TQ.formatDateTime(1414153972) );
		
		var item = this.dlg.getItems().lettertabs.getTabItems(2).letterlist.getItem(0);
		assertEQ ( TQ.getTextEx(item.exsubs.flag), rstr.letter.letterdlg.status[1] );
		assertEQ ( TQ.getTextEx(item.exsubs.from), 'ff1' );
		assertEQ ( TQ.getTextEx(item.exsubs.title), 'tt1' );
	};
	
	this.test_changePage = function(){
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		this.dlg.getItems().lettertabs.activeTab(2);
		this.dlg.getItems().lettertabs.getTabItems(2).pagebar.activePage(2, true, false);
		assertEQ ( this.dlg.getItems().lettertabs.getTabItems(2).letterlist.getCount(), 1);
		
		var item = this.dlg.getItems().lettertabs.getTabItems(2).letterlist.getItem(0);
		assertEQ ( TQ.getTextEx(item.exsubs.flag), rstr.letter.letterdlg.status[0] );
		assertEQ ( TQ.getTextEx(item.exsubs.from), 'ff12' );
		assertEQ ( TQ.getTextEx(item.exsubs.title), 'tt12' );
	};
	
	this.test_deleteLetter = function(){
		this.mm.mock(MailSender, 'sendDelMails');
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		var item = this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getItem(0);
		item.exsubs.delbtn.click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.letter.letterdlg.confirmdel );
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendDelMails'], [this.g, [1]] );
	};
	
	this.test_readLetter = function(){
		this.mm.mock(UIM, 'openDlg');
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		var item = this.dlg.getItems().lettertabs.getTabItems(0).letterlist.getItem(0);
		item.exsubs.readbtn.click();
		assertEQ ( this.mm.params['openDlg'], ['readletter', this.g.getImgr().getLetterRes()['un'], 0] );
	};
	
	this.test_dbClickLetterForRead = function(){
		this.mm.mock(UIM, 'openDlg');
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		this.dlg.getItems().lettertabs.getTabItems(0).letterlist.dbclickItem(null /*e*/, 0);
		assertEQ ( this.mm.params['openDlg'], ['readletter', this.g.getImgr().getLetterRes()['un'], 0] );
	};
	
	this.test_clickWriteLetterBtn = function(){
		this.mm.mock(UIM.getDlg('writeletter'), 'openDlg');
		this.mm.mock(UIM.getDlg('writeletter'), 'clear');
		var btns = this.dlg.getCoreDlg().getBtns();
		btns[0].click();
		assertEQ ( this.mm.walkLog, 'openDlg,clear' );
	};
	
	this.test_clickSelectAllItemsBtn = function(){
		this.mm.mock(MailSender, 'sendDelMails');
		
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		
		this.dlg.getItems().lettertabs.activeTab(1);
		
		var btns = this.dlg.getCoreDlg().getBtns();
		btns[1].click();
		assertEQ ( btns[1].isShow(), false );
		assertEQ ( btns[2].isShow(), true );
		
		btns[3].click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true);
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendDelMails'], [this.g, [2,3]] );
	};
	
	this.test_clickUnSelectAllItemsBtn = function(){
		this.helper_makeLetterRes();
		this.dlg.openDlg();
		
		this.dlg.getItems().lettertabs.activeTab(1);
		
		var btns = this.dlg.getCoreDlg().getBtns();
		btns[1].click();
		btns[2].click();
		assertEQ ( btns[1].isShow(), true );
		assertEQ ( btns[2].isShow(), false );
		
		btns[3].click();
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.g.getGUI().isShowMsgBox(), false);
	};
	
	this.test_clickCloseDlgBtn = function(){
		var btns = this.dlg.getCoreDlg().getBtns();
		assertEQ ( this.dlg.isShow(), true );
		btns[4].click();
		assertEQ ( this.dlg.isShow(), false );
	};
});

TestCaseReadLetterDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ReadLetterDlg.snew(this.g);
		this.dlg.openDlg({},-1);
		this.lc = this.dlg.lc;
		this.dlgBtns = this.lc().m_dlg.getBtns();
		
		res_items = [{id:1, bigpic:10000}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testRegLetterUpdateEventWhenInit = function(){
		var node = this.g.getRegEventNode(EVT.LETTERUPDATE, 0)[0];
		assert ( node.self == this.dlg );
		assert ( node.fun == this.lc()._onLetterUpdate );
	};	
	
	this.testOpenDlg = function(){
		var g_resList = {};
		this.mm.mock(this.lc(), '_initParams' );
		this.mm.mock(this.lc(), '_showCurLetter' );
		
		this.dlg.openDlg(g_resList, 1);
		assert ( this.lc().m_dlg.isShow() == true );
		assert ( this.mm.walkLog == '_initParams,_showCurLetter' );
		assertListEQ ( this.mm.params['_initParams'], [g_resList, 1]);
	};
	
	this.test_initParams = function(){
		var g_resList = {};
		this.lc()._initParams(g_resList, 1);
		assert ( this.lc().m_resList = g_resList );
		assert ( this.lc().m_curIdx = 1 );
	};
	
	this.test_setCallers = function(){
		this.mm.mock(this.lc().m_items.getbtn, 'setCaller')
		this.lc()._setCallers();
		assert ( this.mm.params['setCaller'][0].self == this.dlg )
		assert ( this.mm.params['setCaller'][0].caller == this.lc()._onGetItems )
	};
	
	this.test_prevIdx = function(){
		this.lc().m_curIdx = 1;
		this.lc()._prevIdx();
		assert ( this.lc().m_curIdx == 0 );
		this.lc()._prevIdx();
		assert ( this.lc().m_curIdx == 0 );
	};
	
	this.test_nextIdx = function(){
		this.lc().m_curIdx = 1;
		this.lc().m_resList.length = 3;
		this.lc()._nextIdx();
		assert ( this.lc().m_curIdx == 2 );
		
		this.lc()._nextIdx();
		assert ( this.lc().m_curIdx == 2 );
	};
	
	this.test_onLetterUpdate = function(){
		var mm = MMock.snew();
		mm.mock( this.lc(), '_showCurLetter' );
		this.lc()._onLetterUpdate();
		mm.restore();
		assert ( mm.walkLog == '_showCurLetter' );
	};
	
	this.testClickPrevBtn = function(){
		var mm = MMock.snew();
		mm.mock( this.lc(), '_prevIdx' );
		mm.mock( this.lc(), '_showCurLetter' );
		
		this.dlgBtns[0].click();
		mm.restore();
		assert ( mm.walkLog == '_prevIdx,_showCurLetter' );
	};
	
	this.testClickNextBtn = function(){
		var mm = MMock.snew();
		mm.mock( this.lc(), '_nextIdx' );
		mm.mock( this.lc(), '_showCurLetter' );
		
		this.dlgBtns[1].click();
		mm.restore();
		assert ( mm.walkLog == '_nextIdx,_showCurLetter' );
	};
	
	this.testClickReplyBtn = function(){
		this.lc().m_resList = [{id:1, from:'from', title:'title', time:0, detail:{msg:"hello"}}];
		
		UIM.regDlg('writeletter', WriteLetterDlg.snew(this.g));
		var mm = MMock.snew();
		mm.mock(UIM.getDlg('writeletter'), 'openDlg' );
		mm.mock(UIM.getDlg('writeletter'), 'setRecv' );
		mm.mock(UIM.getDlg('writeletter'), 'setTitle' );
		mm.mock(UIM.getDlg('writeletter'), 'setContent' );
		
		this.lc().m_curIdx = -1;
		this.dlgBtns[2].click();
		assert ( mm.walkLog == '' );
		
		this.lc().m_curIdx = 0;
		this.dlgBtns[2].click();
		assert ( mm.walkLog == 'openDlg,setRecv,setTitle,setContent' );
		assertListEQ ( mm.params['setRecv'], ['from'] );
		assertListEQ ( mm.params['setTitle'], [rstr.letter.readdlg.reply + 'title'] );
		assertListEQ ( mm.params['setContent'], [''] );
		
		mm.restore();
	};
	
	this.testClickCloseBtn = function(){
		assert ( this.lc().m_dlg.isShow() );
		this.dlgBtns[3].click();
		assert ( this.lc().m_dlg.isShow() == false);
	};
	
	this.test_showCurLetter = function(){
		var g_isShowRt = [false];
		var g_getCurLetterResRt = [];
		
		this.mm.mock(this.lc(), '_isShow', g_isShowRt);
		this.mm.mock(this.lc(), '_getCurLetterRes', g_getCurLetterResRt);
		this.mm.mock(MailSender, 'sendGetDetailMail');
		this.mm.mock(this.lc(), '_setLetter');
		this.mm.mock(this.lc(), '_setLetterItems');
		this.mm.mock(this.lc(), '_setDlgBtnsEnableState');
		
		this.mm.clear();
		this.lc()._showCurLetter();
		assert ( this.mm.walkLog == '_isShow' );
		
		this.mm.clear();
		g_isShowRt[0] = true;
		g_getCurLetterResRt[0] = null;
		this.lc()._showCurLetter();
		assert ( this.mm.walkLog == '_isShow,_getCurLetterRes' );
		
		this.mm.clear();
		g_getCurLetterResRt[0] = {id:1,detail:null};
		this.lc()._showCurLetter();
		assert ( this.mm.walkLog == '_isShow,_getCurLetterRes,sendGetDetailMail' );
		assertListEQ ( this.mm.params['sendGetDetailMail'], [this.g, 1] );
		
		this.mm.clear();
		g_getCurLetterResRt[0] = {id:1,detail:{}};
		this.lc()._showCurLetter();
		assert ( this.mm.walkLog == '_isShow,_getCurLetterRes,_setLetter,_setLetterItems,_setDlgBtnsEnableState' );
		assertListEQ ( this.mm.params['_setLetter'], [g_getCurLetterResRt[0]] );
		assertListEQ ( this.mm.params['_setLetterItems'], [g_getCurLetterResRt[0]] );
		assertListEQ ( this.mm.params['_setDlgBtnsEnableState'], [g_getCurLetterResRt[0]] );
	};	
	
	this.test_isShow = function(){
		var bak_dlg = this.lc().m_dlg;
		this.lc().m_dlg = null;
		assert ( this.lc()._isShow() == false );
		
		this.lc().m_dlg = bak_dlg;
		this.lc().m_dlg.hide();
		assert ( this.lc()._isShow() == false );
		
		this.lc().m_dlg.show();
		assert ( this.lc()._isShow() == true );
	};

	this.test_getCurLetterRes = function(){
		this.lc().m_resList = [10];
		this.lc().m_curIdx = 0;
		assert ( this.lc()._getCurLetterRes() == 10 );
	};
	
	this.test_setLetter = function(){
		this.mm.mock( this.lc(), '_makeLetterContent', ['ccc']);
		this.mm.mock( this.lc().m_items.content, 'refresh');
		
		var g_mailRes = {from:'from', title:'title', sys:1, time:1, detail:{}};
		this.lc()._setLetter(g_mailRes);
		
		assert ( TQ.getTextEx( this.lc().m_items.from ) == 'from' );
		assert ( TQ.getTextEx( this.lc().m_items.title ) == 'title' );
		assert ( TQ.getTextEx( this.lc().m_items.time ) == TQ.formatDateTime(1) );
		assert ( TQ.getTextEx( this.lc().m_items.content.getContainerObj() ) == 'ccc' );
		assert ( this.mm.walkLog == '_makeLetterContent,refresh' );
		assertListEQ ( this.mm.params['_makeLetterContent'], [g_mailRes.detail] );
			
			
		var g_mailRes = {from:'from', title:'title', sys:0, time:1, detail:{}};
		this.lc()._setLetter(g_mailRes);
		assert ( TQ.getTextEx( this.lc().m_items.content.getContainerObj() ) == 'ccc' + rstr.letter.readdlg.lbl.nosystag );
	};
	
	this.test__makeLetterContent = function(){
		assert ( this.lc()._makeLetterContent({msg:'aaa#[m:1:2]',tmsg:'bbb'}) == 'aaa' + HyperLinkMgr.formatLink('#[m:1:2]') );
		assert ( this.lc()._makeLetterContent({}) == '' );
		
		var mm = MMock.snew();
		mm.mock( this.lc().m_tempLetterMakerMgr, 'make', ['ccc']);
		
		assert ( this.lc()._makeLetterContent({tempId:1, tmsg:'temp'}) == 'ccc' );
		mm.restore();
		
		assertEQ ( mm.walkLog, 'make' );
		assertListEQ ( mm.params['make'], [1, 'temp'] );
	};
	
	this.test_setLetterItems = function(){
		this.mm.mock(TTIP, 'setCallerData');
		
		this.lc()._setLetterItems({});
		assert ( TQ.getCSS(this.lc().m_items.itemsPanel, 'display') == 'none' );
		
		this.lc()._setLetterItems({items:[]});
		assert ( TQ.getCSS(this.lc().m_items.itemsPanel, 'display') == 'none' );
		
		this.lc()._setLetterItems({items:[{id:1,resid:1}]});
		assert ( TQ.getCSS(this.lc().m_items.itemsPanel, 'display') == 'block' );
		assert ( this.lc().m_items.itemsList.getCount() == 1 );
		
		var listItem = this.lc().m_items.itemsList.getItem(0);
		assert ( isInclude( IMG.getBKImage(listItem.exsubs.icon), '10000.gif' ) == true );
		assert ( this.mm.params['setCallerData'][0] == listItem.exsubs.tooltips['$item'] );
		assert ( this.mm.params['setCallerData'][1].self == this.dlg );
		assert ( this.mm.params['setCallerData'][1].caller == this.lc()._onGetItemTip );
		assert ( this.mm.params['setCallerData'][2].idx == 0 );
	};	
	
	this.test_onGetItemTip = function(){
		var g_curMailRes = {id:1,items:[{id:1},{id:2}]};
		var g_getCurLetterRes = [g_curMailRes];
		this.mm.mock( this.lc(), '_getCurLetterRes', g_getCurLetterRes );
		this.mm.mock( TIPM, 'getItemDesc', ['tip'] );
		
		assert ( this.lc()._onGetItemTip({idx:1}) == 'tip' );
		assertListEQ ( this.mm.params['getItemDesc'], [g_curMailRes.items[1] ] );
		
		this.mm.clear();
		assert ( this.lc()._onGetItemTip({idx:2}) == '' );
		
		this.mm.clear();
		g_getCurLetterRes[0] = {id:1};
		assert ( this.lc()._onGetItemTip({idx:1}) == '' );
		
		this.mm.clear();
		g_getCurLetterRes[0] = null;
		assert ( this.lc()._onGetItemTip({idx:1}) == '' );
	};	
	
	this.test_setDlgBtnsEnableState = function(){
		var mm = MMock.snew();
		mm.mock( this.lc(), '_setPrevBtnEnableState');
		mm.mock( this.lc(), '_setNextBtnEnableState');
		mm.mock( this.lc(), '_setReplyBtnEnableState');
		
		var g_res = {};
		this.lc()._setDlgBtnsEnableState(g_res);
		mm.restore();
		
		assert ( mm.walkLog == '_setPrevBtnEnableState,_setNextBtnEnableState,_setReplyBtnEnableState' );
		assertListEQ ( mm.params['_setReplyBtnEnableState'], [g_res] );
	};
	
	this.test_setPrevBtnEnableState = function(){
		this.lc().m_curIdx = 0;
		this.lc()._setPrevBtnEnableState();
		assert ( this.dlgBtns[0].isEnable() == false );
		
		this.lc().m_curIdx = 1;
		this.lc()._setPrevBtnEnableState();
		assert ( this.dlgBtns[0].isEnable() == true );
	};
	
	this.test_setNextBtnEnableState = function(){
		this.lc().m_resList.length = 2;
		this.lc().m_curIdx = 0;
		this.lc()._setNextBtnEnableState();
		assert ( this.dlgBtns[1].isEnable() == true );
		
		this.lc().m_curIdx = 1;
		this.lc()._setNextBtnEnableState();
		assert ( this.dlgBtns[1].isEnable() == false );
	};
	
	this.test_setReplyBtnEnableState = function(){
		this.lc()._setReplyBtnEnableState({sys:0});
		assert ( this.dlgBtns[2].isEnable() == true );
		
		this.lc()._setReplyBtnEnableState({sys:1});
		assert ( this.dlgBtns[2].isEnable() == false );
	};
	
	this.test_onGetItems = function(){
		var g_curMailRes = {id:1};
		var g_getCurLetterRes = [g_curMailRes];
		this.mm.mock( this.lc(), '_getCurLetterRes', g_getCurLetterRes );
		this.mm.mock( MailSender, 'sendGetItems' );
		this.lc()._onGetItems();
		assert ( this.mm.walkLog == '_getCurLetterRes,sendGetItems' );
		assertListEQ ( this.mm.params['sendGetItems'], [this.g, 1] );
		
		this.mm.clear();
		g_getCurLetterRes[0] = null;
		this.lc()._onGetItems();
		assert ( this.mm.walkLog == '_getCurLetterRes' );
	};
});

TestCaseWriteLetterDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.dlg = WriteLetterDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		this.dlgBtns = this.lc().m_dlg.getBtns();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_writeLetterTo = function(){
		this.mm.mock(this.dlg, 'openDlg');
		this.mm.mock(this.dlg, 'clear');
		this.mm.mock(this.dlg, 'setRecv');
		this.mm.mock(this.dlg, 'setFocus');
		
		this.dlg.writeLetterTo('role');
		
		assertEQ ( this.mm.walkLog, 'openDlg,clear,setRecv,setFocus' );
		assertEQ ( this.mm.params['setRecv'], ['role'] );
		assertEQ ( this.mm.params['setFocus'], ['title'] );
	};
	
	this.test_setRecv = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_setRecv' );
		this.dlg.setRecv('1');
		assert ( this.mm.walkLog == '_initDlg,_setRecv' );
		assertListEQ ( this.mm.params['_setRecv'], ['1'] );
	};
	
	this.test_setTitle = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_setTitle' );
		
		this.dlg.setTitle('1');
		assert ( this.mm.walkLog == '_initDlg,_setTitle' );
		assertListEQ ( this.mm.params['_setTitle'], ['1'] );
	};
	
	this.test_setContent = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_setContent' );
		
		this.dlg.setContent('1');
		assert ( this.mm.walkLog == '_initDlg,_setContent' );
		assertListEQ ( this.mm.params['_setContent'], ['1'] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc().m_dlg, 'show' );
		this.mm.mock( this.lc().m_items.content, 'refresh' );
		
		this.dlg.openDlg();
		assert ( this.mm.walkLog == '_initDlg,show,refresh' );
	};
	
	this.test_clear = function(){
		this.mm.mock( this.dlg, 'setRecv' );
		this.mm.mock( this.dlg, 'setTitle' );
		this.mm.mock( this.dlg, 'setContent' );
		
		this.dlg.clear();
		assert ( this.mm.walkLog == 'setRecv,setTitle,setContent' );
		assertListEQ ( this.mm.params['setRecv'], [''] );
		assertListEQ ( this.mm.params['setTitle'], [''] );
		assertListEQ ( this.mm.params['setContent'], [''] );
	};
	
	this.test_setFocus = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_setFocus' );
		
		this.dlg.setFocus('recv');
		assert ( this.mm.walkLog == '_initDlg,_setFocus' );
		assertListEQ ( this.mm.params['_setFocus'], ['recv'] );
	};
	
	this.test_initDlg = function(){
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.mm.mock( this.lc(), '_setInputMaxLen' );
		
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assert ( this.mm.walkLog == 'initDlg,_setInputMaxLen' );
		assertListEQ ( this.mm.params['initDlg'], [this.lc().m_dlg, uicfg.letter.writedlg, this.lc().m_items] );
	};
	
	this.test_setInputMaxLen = function(){
		this.mm.mock( InputLimit, 'maxGBKBytes');
		this.mm.mock( JVALID, 'getMaxUserLen', [1] );
		this.mm.mock( JVALID, 'getMaxMailTitleLen', [2] );
		this.mm.mock( JVALID, 'getMaxMailContentLen', [3] );
		
		this.lc()._setInputMaxLen();
		assert ( this.mm.walkLog == 'getMaxUserLen,maxGBKBytes,getMaxMailTitleLen,maxGBKBytes,getMaxMailContentLen,maxGBKBytes' );
		assertListEQ ( this.mm.params['maxGBKBytes.0'], [this.lc().m_items.recv, 1] );
		assertListEQ ( this.mm.params['maxGBKBytes.1'], [this.lc().m_items.title, 2] );
		assertListEQ ( this.mm.params['maxGBKBytes.2'], [this.lc().m_items.content.getContainerObj(), 3] );
	};
	
	this.test_setRecv_ = function(){
		this.lc()._setRecv('1');
		assert ( this.lc().m_items.recv.value == '1' );
	};
	
	this.test_setTitle_ = function(){
		this.lc()._setTitle('1');
		assert ( this.lc().m_items.title.value == '1' );
	};
	
	this.test_setContent_ = function(){
		this.lc()._setContent('1');
		assert ( this.lc().m_items.content.getContainerObj().value == '1' );
	};
	
	this.test_setFocus_ = function(){
		this.mm.clear();
		this.mm.mock( this.lc().m_items.recv, 'focus' );
		this.lc()._setFocus('recv');
		assert ( this.mm.walkLog == 'focus' );
		
		this.mm.clear();
		this.mm.mock( this.lc().m_items.title, 'focus' );
		this.lc()._setFocus('title');
		assert ( this.mm.walkLog == 'focus' );
		
		this.mm.clear();
		this.mm.mock( this.lc().m_items.content.getContainerObj(), 'focus' );
		this.lc()._setFocus('content');
		assert ( this.mm.walkLog == 'focus' );
	};
	
	this.test_onClickSendBtn = function(){
		this.mm.mock( this.lc(), '_sendMail' );
		this.mm.mock( this.lc().m_dlg, 'hide' );
		
		this.lc()._onClickSendBtn();
		assert ( this.mm.walkLog == '_sendMail,hide' );
	};
	
	this.test_onClickCancelBtn = function(){
		this.mm.mock( this.lc().m_dlg, 'hide' );
		
		this.lc()._onClickCancelBtn();
		assert ( this.mm.walkLog == 'hide' );
	};
	
	this.test_sendMail = function(){
		this.lc().m_items.recv.value = 'recv';
		this.lc().m_items.title.value = 'title';
		this.lc().m_items.content.getContainerObj().value = 'content';
		
		var g_checkRecvRt = [false];
		var g_checkTitleRt = [false];
		var g_checkContentRt = [false];
		this.mm.mock( this.lc(), '_checkRecv', g_checkRecvRt );
		this.mm.mock( this.lc(), '_checkTitle', g_checkTitleRt );
		this.mm.mock( this.lc(), '_checkContent',  g_checkContentRt);
		this.mm.mock( MailSender, 'sendMail' );
		
		this.lc()._sendMail();
		assert ( this.mm.walkLog == '_checkRecv' );
		
		g_checkRecvRt[0] = true;
		this.mm.clear();
		this.lc()._sendMail();
		assert ( this.mm.walkLog == '_checkRecv,_checkTitle' );
		
		g_checkTitleRt[0] = true;
		this.mm.clear();
		this.lc()._sendMail();
		assert ( this.mm.walkLog == '_checkRecv,_checkTitle,_checkContent' );
		assertEQ ( TestCaseSysTip.hasSystip(), false );
		
		g_checkContentRt[0] = true;
		this.mm.clear();
		this.lc()._sendMail();
		assert ( this.mm.walkLog == '_checkRecv,_checkTitle,_checkContent,sendMail' );
		assertListEQ ( this.mm.params['sendMail'], [this.g, 'recv', 'title', 'content'] );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.letter.writedlg.tip.sendOk );
	};
	
	this.test_checkRecv = function(){
		this.mm.mock(this.lc(), '_checkInputValue' );
		this.lc().m_items.recv.value = 'recv';
		this.lc()._checkRecv();
		assertListEQ ( this.mm.params['_checkInputValue'], [JVALID.checkUsername, 'recv', 'recv', rstr.letter.writedlg.errname] );
	};
	
	this.test_checkTitle = function(){
		this.mm.mock(this.lc(), '_checkInputValue' );
		this.lc().m_items.title.value = 'title';
		this.lc()._checkTitle();
		assertListEQ ( this.mm.params['_checkInputValue'], [JVALID.checkEmailTitle, 'title', 'title', rstr.letter.writedlg.errtitle] );
	};
	
	this.test_checkContent = function(){
		this.mm.mock(this.lc(), '_checkInputValue' );
		this.lc().m_items.content.getContainerObj().value = 'content';
		this.lc()._checkContent();
		assertListEQ ( this.mm.params['_checkInputValue'], [JVALID.checkEmailContent, 'content', 'content', rstr.letter.writedlg.errcontent] );
	};
	
	this.test_checkInputValue = function(){
		var g_checker_rt = true;
		var g_val = '';
		var checker = function(val){
			g_val = val;
			return g_checker_rt;
		};
		
		assert ( this.lc()._checkInputValue(checker, 'val', 'recv', 'error') == true );
		
		g_checker_rt = false;
		assert ( this.lc()._checkInputValue(checker, 'val', 'recv', 'error') == false );
		assertInclude( this.g.getGUI().getMsgBoxMsg(), 'error' );
		
		this.mm.mock( this.lc().m_dlg, 'show' );
		this.mm.mock( this.lc().m_this, 'setFocus' );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assert ( this.mm.walkLog == 'show,setFocus' );
		assertListEQ ( this.mm.params['setFocus'], ['recv']);
	};
});

tqLetterHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseLetterNetCmdHdr, 'TestCaseLetterNetCmdHdr');
	suite.addTestCase(TestCaseLetterDlg, 'TestCaseLetterDlg');
	suite.addTestCase(TestCaseReadLetterDlg, 'TestCaseReadLetterDlg');
	suite.addTestCase(TestCaseWriteLetterDlg, 'TestCaseWriteLetterDlg');
};