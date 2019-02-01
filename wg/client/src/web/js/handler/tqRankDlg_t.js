/*******************************************************************************/
require('./tqRankDlg.js')

TestCaseRankDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_selectFirstTab = function(){
		assertEQ ( this.dlg.items_.tablist.getActiveTab(), 0);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.rankingdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.rankingdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__createRolePanel = function(){
		this.mm.travelMock(RankRolePanel, 'snew');
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
		assertEQ ( this.dlg.rolePanel_ instanceof RankRolePanel, true );
		var items = this.dlg.items_.tablist.getTabItems(this.dlg.TAB_ROLE_IDX_);
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, items] );
	};
	
	this.test__createAlliRankPanel = function(){
		this.mm.travelMock(AlliListDlgTempl, 'snew');
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
		assertEQ ( this.dlg.alliPanel_ instanceof AlliListDlgTempl, true );
		var con = this.dlg.items_.tablist.getTabItems(this.dlg.TAB_ALLI_IDX_).con;
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, con, 'rank'] );
	};
	
	this.test__createActTowerPanel = function(){
		this.mm.travelMock(RankActTowerPanel, 'snew');
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
		assertEQ ( this.dlg.actTowerPanel_ instanceof RankActTowerPanel, true );
		var items = this.dlg.items_.tablist.getTabItems(this.dlg.TAB_ACTTOWER_IDX_);
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, items] );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.dlg.alliPanel_, 'openDlg:openAlliPanel');
		this.dlg._initInfo();
		assertEQ ( this.mm.params['openAlliPanel'], [0] );
	};
});

TestCaseRankRolePanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
		this.panel = this.dlg.rolePanel_;
		this.ranks = [{rank:100,name:'role1', gridId:1001, roleId:1000001, alli:'alli1', level:1, buildVal:10000}
			,{rank:101,name:'role2', gridId:1002, roleId:1000002, alli:'alli2', level:2, buildVal:10001}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_createPageBar = function(){
		this.mm.mock(RankPageBar, 'snew', [this.panel.pageBar_]);
		this.mm.mock(this.panel.pageBar_, 'regObServer');
		
		var items = this.dlg.items_.tablist.getTabItems(this.dlg.TAB_ROLE_IDX_);
		var panel = RankRolePanel.snew(this.g, this.dlg, items);

		assertEQ ( this.mm.walkLog, 'snew,regObServer' );
		assertEQ ( this.mm.params['snew'], [this.g, rstr.alli.listdlg.lbl.searchrole, JVALID.getMaxUserLen(), panel.items_.pageBarCon, panel.items_] );
		assertEQ ( this.mm.params['regObServer'], [panel] );
	};
	
	this.test_onPageBarClickSearch = function(){
		this.mm.mock(RoleSender, 'sendSearchRoleForRank');
		var name = '';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.getSystip(), '' );
		assertEQ ( this.mm.walkLog, '' );
		
		name = 'abcdeisfsaffsdfasfasfas';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.listdlg.tip.invalidrole ), true);
		assertEQ ( this.mm.walkLog, '' );
		
		TestCaseSysTip.clearTip();
		name = 'abc';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.hasSystip (), false );
		assertEQ ( this.mm.params['sendSearchRoleForRank'], [this.g, 'abc'] );
	};
	
	this.test_onPageBarClickGetSelf = function(){
		this.mm.mock(RoleSender, 'sendSearchRoleForRank');
		this.g.getImgr().getRoleRes().name = 'my';
		this.panel.onPageBarClickGetSelf();
		assertEQ ( this.mm.params['sendSearchRoleForRank'], [this.g, 'my'] );
	};
	
	this.test_onPageNavigate = function(){
		this.mm.mock(RoleSender, 'sendGetPageRankRoles');
		this.panel.onPageNavigate(1);
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 1] );
	};
	
	this.test_refreshWhenOpen = function(){
		this.mm.mock(RoleSender, 'sendGetPageRankRoles');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 1] );
		
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd});
		this.panel.onPageNavigate(2);
		
		this.mm.clear();
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 2] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.panel.pageBar_, 'setPageBarNoActive');
		var netcmd = {}
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
			
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd});
		assertEQ ( this.mm.params['setPageBarNoActive'], [2, 10] );
		assertEQ ( this.panel.items_.list.getCount(), 2 );
		var item0 = this.panel.items_.list.getItem(0);
		var item1 = this.panel.items_.list.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 100 );
		assertEQ ( TQ.getTextEx(item0.exsubs.role), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.alli), 'alli1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.buildVal), 10000 );
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 101 );
		assertEQ ( this.panel.items_.list.getCurSel(), 1 );
		
		this.mm.clear();
		this.dlg.hideDlg();
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__clickItemOpBtn = function(){
		this.mm.mock(UIM.getDlg('rolecity'), 'openDlg');
		this.mm.mock(UIM.getPanel('chat'), 'setChatTarget');
		this.mm.mock(UIM.getDlg('writeletter'), 'writeLetterTo');
		
		var netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd});
		var item0 = this.panel.items_.list.getItem(0);
		var item1 = this.panel.items_.list.getItem(1);
		
		// click seebtn 
		this.mm.clear();
		item0.exsubs.seebtn.click();
		var field = {gridId:1001, objType:OBJ_TYPE.ROLE, roleId:1000001, roleName:'role1', alliance:{uid:-1,name:'--'}};
		assertEQ ( this.mm.params['openDlg'], [field] );
		this.mm.clear();
		item1.exsubs.seebtn.click();
		var field = {gridId:1002, objType:OBJ_TYPE.ROLE, roleId:1000002, roleName:'role2', alliance:{uid:-1,name:'--'}};
		assertEQ ( this.mm.params['openDlg'], [field] );
		
		// click chatbtn
		this.mm.clear();
		item0.exsubs.chatbtn.click();
		assertEQ ( this.mm.params['setChatTarget'], ['role1'] );
		this.mm.clear();
		item1.exsubs.chatbtn.click();
		assertEQ ( this.mm.params['setChatTarget'], ['role2'] );
		
		// click letterbtn
		this.mm.clear();
		item0.exsubs.letterbtn.click();
		assertEQ ( this.mm.params['writeLetterTo'], ['role1'] );
		this.mm.clear();
		item1.exsubs.letterbtn.click();
		assertEQ ( this.mm.params['writeLetterTo'], ['role2'] );
	};
});

TestCaseRankActTowerPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RankDlg.snew(this.g);
		this.dlg.openDlg();
		this.panel = this.dlg.actTowerPanel_;
		this.ranks = [{rank:100, name:'role1', gridId:1001, roleId:1000001, maxLayer:10, maxTime:1383300337}
			,{rank:101,name:'role2', gridId:1002, roleId:1000002, maxLayer:20, maxTime:1383300338}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_createPageBar = function(){
		this.mm.mock(RankPageBar, 'snew', [this.panel.pageBar_]);
		this.mm.mock(this.panel.pageBar_, 'regObServer');
		
		var items = this.dlg.items_.tablist.getTabItems(this.dlg.TAB_ROLE_IDX_);
		var panel = RankActTowerPanel.snew(this.g, this.dlg, items);
		
		assertEQ ( this.mm.walkLog, 'snew,regObServer' );
		assertEQ ( this.mm.params['snew'], [this.g, rstr.alli.listdlg.lbl.searchrole, JVALID.getMaxUserLen(), panel.items_.pageBarCon, panel.items_] );
		assertEQ ( this.mm.params['regObServer'], [panel] );
	};
	
	this.test_onPageBarClickSearch = function(){
		this.mm.mock(ActTowerSender, 'sendSearchRoleForRank');
		var name = '';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.getSystip(), '' );
		assertEQ ( this.mm.walkLog, '' );
		
		name = 'abcdeisfsaffsdfasfasfas';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.listdlg.tip.invalidrole ), true);
		assertEQ ( this.mm.walkLog, '' );
		
		TestCaseSysTip.clearTip();
		name = 'abc';
		this.panel.onPageBarClickSearch(name);
		assertEQ ( TestCaseSysTip.hasSystip (), false );
		assertEQ ( this.mm.params['sendSearchRoleForRank'], [this.g, 'abc'] );
	};
	
	this.test_onPageBarClickGetSelf = function(){
		this.mm.mock(ActTowerSender, 'sendSearchRoleForRank');
		this.g.getImgr().getRoleRes().name = 'my';
		this.panel.onPageBarClickGetSelf();
		assertEQ ( this.mm.params['sendSearchRoleForRank'], [this.g, 'my'] );
	};
	
	this.test_onPageNavigate = function(){
		this.mm.mock(ActTowerSender, 'sendGetPageRankRoles');
		this.panel.onPageNavigate(1);
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 1] );
	};
	
	this.test_refreshWhenOpen = function(){
		this.mm.mock(ActTowerSender, 'sendGetPageRankRoles');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 1] );
		
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:netcmd});
		this.panel.onPageNavigate(2);
		
		this.mm.clear();
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGetPageRankRoles'], [this.g, 2] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.panel.pageBar_, 'setPageBarNoActive');
		var netcmd = {}
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
		
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:netcmd});
		assertEQ ( this.mm.params['setPageBarNoActive'], [2, 10] );
		assertEQ ( this.panel.items_.list.getCount(), 2 );
		var item0 = this.panel.items_.list.getItem(0);
		var item1 = this.panel.items_.list.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 100 );
		assertEQ ( TQ.getTextEx(item0.exsubs.role), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.maxLayer), 10 );
		assertEQ ( TQ.getTextEx(item0.exsubs.maxTime), TQ.formatDateTime(1383300337) );
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 101 );
		assertEQ ( this.panel.items_.list.getCurSel(), 1 );
		
		this.mm.clear();
		this.dlg.hideDlg();
		netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__clickItemOpBtn = function(){
		this.mm.mock(UIM.getDlg('rolecity'), 'openDlg');
		this.mm.mock(UIM.getPanel('chat'), 'setChatTarget');
		this.mm.mock(UIM.getDlg('writeletter'), 'writeLetterTo');
		
		var netcmd = { ranks:this.ranks, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:netcmd});
		var item0 = this.panel.items_.list.getItem(0);
		var item1 = this.panel.items_.list.getItem(1);
		
		// click seebtn 
		this.mm.clear();
		item0.exsubs.seebtn.click();
		var field = {gridId:1001, objType:OBJ_TYPE.ROLE, roleId:1000001, roleName:'role1', alliance:{uid:-1,name:'--'}};
		assertEQ ( this.mm.params['openDlg'], [field] );
		this.mm.clear();
		item1.exsubs.seebtn.click();
		var field = {gridId:1002, objType:OBJ_TYPE.ROLE, roleId:1000002, roleName:'role2', alliance:{uid:-1,name:'--'}};
		assertEQ ( this.mm.params['openDlg'], [field] );
		
		// click chatbtn
		this.mm.clear();
		item0.exsubs.chatbtn.click();
		assertEQ ( this.mm.params['setChatTarget'], ['role1'] );
		this.mm.clear();
		item1.exsubs.chatbtn.click();
		assertEQ ( this.mm.params['setChatTarget'], ['role2'] );
		
		// click letterbtn
		this.mm.clear();
		item0.exsubs.letterbtn.click();
		assertEQ ( this.mm.params['writeLetterTo'], ['role1'] );
		this.mm.clear();
		item1.exsubs.letterbtn.click();
		assertEQ ( this.mm.params['writeLetterTo'], ['role2'] );
	};
});

tqRankDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseRankDlg, 'TestCaseRankDlg');
	suite.addTestCase(TestCaseRankRolePanel, 'TestCaseRankRolePanel');
	suite.addTestCase(TestCaseRankActTowerPanel, 'TestCaseRankActTowerPanel');
};
