require('./tqHyperLinkMgr.js');

TestCaseHyperLinkMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		HyperLinkMgr.initOneTime(this.g);
		this.e = {pageX:0, pageY:0};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getHdr = function(){
		assertEQ ( HyperLinkMgr.getHdr('c') instanceof RechargeLinkHdr, true );
	};
	
	this.testFormatChatName = function(){
		var msg = HyperLinkMgr.formatChatName(1, 'qjb');
		assert ( msg == "<a class='ui-chat-link-player' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"r\",1,\"qjb\"); return false;' ondragstart='return false;' onselectstart='return false;'>[qjb]</a>");
	};
	
	this.testRoleLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[r:1:qjb]');
		assert ( msg == "<a class='ui-chat-link-player' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"r\",1,\"qjb\"); return false;' ondragstart='return false;' onselectstart='return false;'>[qjb]</a>");
	};
	
	this.testHelpLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[?:1:help]');
		assert ( msg == "<a class='ui-inner-help' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"?\",\"1\"); return false;' ondragstart='return false;' onselectstart='return false;'>[help]</a>");
	};
	
	this.testHeroLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[h:1:hero]');
		assert ( msg == "<a class='ui-chat-link-hero' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"h\",1,\"hero\"); return false;' ondragstart='return false;' onselectstart='return false;'>[hero]</a>");
	};
	
	this.testShowItemLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[i:2000001:10000000:2000000]');
		assert ( isInclude(msg, "<a class='ui-chat-link-item' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"i\",2000001,10000000,2000000); return false;' ondragstart='return false;' onselectstart='return false;'>") == true );
	};
	
	this.testBuyItemLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[b:2000001:buy]');
		assert ( msg == "<a class='ui-link-buyitem' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"b\",2000001); return false;' ondragstart='return false;' onselectstart='return false;'>[buy]</a>");
	};
	
	this.testFightDemoLinkHdr = function(){
		var msg = HyperLinkMgr.formatLink('#[f:1:2]');
		assert ( isInclude(msg, "<a class='ui-link-fightdemo' id='fight_demo_a_0' name='fight_demo_a_0' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"f\",1,2); return false;' ondragstart='return false;' onselectstart='return false;'>", rstr.fight.showfightdemo) == true );
	};
	
	this.testHelpLinkHdr_handleLink = function(){
		UIM.regDlg('minihelp', MockDialog.snew());
		HyperLinkMgr.onClickLink(this.e, '?', '1');
		assert ( UIM.getDlg('minihelp').isShow() == true );
	};
	
	this.testRoleLinkHdr_handleLink = function(){
		HDRM.regHdr('clickrole', ClickRoleHdr.snew(this.g));
		this.mm.mock(HDRM.getHdr('clickrole'), 'click');
		
		this.g.getImgr().getRoleRes().name = 'test';
		HyperLinkMgr.onClickLink(this.e, 'r', 10000, 'test');
		assertEQ ( this.mm.walkLog, '' );
		
		HyperLinkMgr.onClickLink(this.e, 'r', 10000, 'test2');
		assertEQ ( this.mm.params['click'], [{x:0, y:0}, 10000, 'test2'] );
	};
	
	this.testHeroLinkHdr_handleLink = function(){
		HyperLinkMgr.onClickLink(this.e, 'h', '1');
	};
	
	this.testShowItemLinkHdr_handleLink = function(){
		var click_ = false;
		HDRM.regHdr('clickitem', new function(){ this.click=function(){click_=true;}; } );
		HyperLinkMgr.onClickLink(this.e, 'i', 2000001, 1);
		assert ( click_ == true );
	};
	
	this.testBuyItemLinkHdr_handleLink = function(){
		UIM.regDlg('buyitem', MockDialog.snew());
		HyperLinkMgr.onClickLink(this.e, 'b', 2000001);
		assert ( UIM.getDlg('buyitem').isShow() == true );
	};
	
	this.testFightDemoLinkHdr_handleLink = function(){
		var methodMock = MethodMock.snew();
		methodMock.mock(UIM, 'openDlg', function(dlgName, armyId, fightId){
			methodMock.dlgName = dlgName;
			methodMock.armyId = armyId;
			methodMock.fightId = fightId;
		} )
		HyperLinkMgr.onClickLink(this.e, 'f', 1, 2);
		methodMock.restore();
		assert ( methodMock.dlgName == 'fightmap' );
		assert ( methodMock.armyId == 1 );
		assert ( methodMock.fightId == 2 );
	};
});

TestCaseRechargeLinkHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = RechargeLinkHdr.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_makeLink = function(){
		var p_params = [];
		assertEQ ( this.hdr.makeLink(p_params), null );
		
		this.mm.mock(this.hdr, 'getAHeadFixParams', [['event', 'c']] );
		this.mm.mock(this.hdr, 'makeCommLink', ['link'] );
		var p_params = ['c', 'recharge'];
		assertEQ ( this.hdr.makeLink(p_params), 'link' );
		assertEQ ( this.mm.params['getAHeadFixParams'], [p_params] );
		assertEQ ( this.mm.params['makeCommLink'], ['ui-link-buyitem', ['event', 'c'], 'recharge'] );
	};
	
	this.test_handleLink = function(){
		this.mm.mock(JMISC, 'openPayWnd' );
		this.hdr.handleLink();
		assertEQ ( this.mm.walkLog, 'openPayWnd' );
	};
});

TestCaseGotoMapLinkHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = GotoMapLinkHdr.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_makeLink = function(){
		var msg = HyperLinkMgr.formatLink('#[m:1:2]');
		var expectStr = "<a class='ui-link-gotomap' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"m\",1,2); return false;' ondragstart='return false;' onselectstart='return false;'>(1,2)</a>";
		assertEQ ( msg, expectStr );
	};
	
	this.test_handleLink = function(){
		this.mm.mock(UIM, 'closeMapPanels');
		this.mm.mock(UIM.getPanel('field'), 'open' );
		this.mm.mock(UIM.getPanel('field'), 'gotoPos' );
		this.hdr.handleLink('e', ['e', 'm', 1, 2]);
		assertEQ ( this.mm.walkLog, 'closeMapPanels,open,gotoPos' );
		assertEQ ( this.mm.params['gotoPos'], [{x:1, y:2}] );
	};
});

TestCaseAllianceLinkHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = AllianceLinkHdr.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_makeLink = function(){
		var msg = HyperLinkMgr.formatLink('#[a:alliance]');
		var expectStr = "<a class='ui-link-alliance' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"a\",\"alliance\"); return false;' ondragstart='return false;' onselectstart='return false;'>[alliance]</a>";
		assertEQ ( msg, expectStr );
	};
	
	this.test_handleLink = function(){
		this.mm.mock(AllianceSender, 'sendGetAllianceDetail');
		this.hdr.handleLink('e', ['e', 'a', 'alliance']);
		assertEQ ( this.mm.params['sendGetAllianceDetail'], [this.g, 'alliance'] );
	};
});

TestCaseImgHelpLinkHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = ImgHelpLinkHdr.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_makeLink = function(){
		var msg = HyperLinkMgr.formatLink('#[H:120001:tip]');
		var expectStr = "<a class='ui-link-imghelp' href='#' onclick='javascript:HyperLinkMgr.onClickLink(event,\"H\",120001); return false;' ondragstart='return false;' onselectstart='return false;'>[tip]</a>";
		assertEQ ( msg, expectStr );
	};
	
	this.test_handleLink = function(){
		this.mm.mock(UIM.getDlg('imghelp'), 'openDlg');
		this.hdr.handleLink('e', ['e', 'H', 120001]);
		assertEQ ( this.mm.params['openDlg'], [120001] );
	};
});

tqHyperLinkMgr_t_main = function(suite) {
	suite.addTestCase(TestCaseHyperLinkMgr, 'TestCaseHyperLinkMgr');
	suite.addTestCase(TestCaseRechargeLinkHdr, 'TestCaseRechargeLinkHdr');
	suite.addTestCase(TestCaseGotoMapLinkHdr, 'TestCaseGotoMapLinkHdr');
	suite.addTestCase(TestCaseAllianceLinkHdr, 'TestCaseAllianceLinkHdr');
	suite.addTestCase(TestCaseImgHelpLinkHdr, 'TestCaseImgHelpLinkHdr');
};



