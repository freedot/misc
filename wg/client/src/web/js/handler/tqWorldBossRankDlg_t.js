/*******************************************************************************/
require('./tqWorldBossRankDlg.js')

TestCaseWorldBossRankDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = WorldBossRankDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.worldboss.rankdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.rankdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_sendGetInfoWhenOpen = function(){
		this.mm.mock(WorldBossrSender, 'sendGetRankInfo');
		assertEQ ( this.dlg.openDlg() );
		assertEQ ( this.mm.params['sendGetRankInfo'], [this.g] );
	};
	
	this.test_persionDate = function(){
		this.g.setSvrTimeS(1404904170);
		this.dlg.openDlg();
		s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.formatShortDate(1404904170) );
		assertEQ ( TQ.getTextEx(this.items.persionDate), s );
	};
	
	this.test_personList = function(){
		this.dlg.hideDlg();
		
		var cmd = {prank:[{rank:1,role:'role1',hurt:1000},{rank:2,role:'role2',hurt:121000}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.personList.getCount(), 0);
		
		this.dlg.openDlg();
		assertEQ ( this.items.personList.getCount(), 2 );
		var item0 = this.items.personList.getItem(0);
		var item1 = this.items.personList.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 1 );
		assertEQ ( item0.exsubs.name.getText(), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.hurtNumber), TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber,  1000) );
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.hurtNumber), TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber,  '12万') );
	};
	
	this.test_getPersonGift = function(){
		this.mm.mock(WorldBossrSender, 'sendGetPersonRankGift');
		this.items.getPersonGift.click();
		assertEQ ( this.mm.params['sendGetPersonRankGift'], [this.g] );
	};
	
	this.test_getPersonGiftEnable = function(){
		var cmd = {today:{gotPRankGift:0}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getPersonGift.isEnable(), true );
		
		var cmd = {today:{gotPRankGift:1}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getPersonGift.isEnable(), false );
	};
	
	this.test_allianceDate = function(){
		this.g.setSvrTimeS(1404904170);
		this.dlg.openDlg();
		s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.formatShortDate(1404904170) );
		assertEQ ( TQ.getTextEx(this.items.allianceDate), s );
	};
	
	this.test_allianceList = function(){
		this.dlg.hideDlg();
		
		var cmd = {arank:[{rank:1,alli:'alli1',hurt:1000},{rank:2,alli:'alli2',hurt:121000}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.allianceList.getCount(), 0);
		
		this.dlg.openDlg();
		assertEQ ( this.items.allianceList.getCount(), 2 );
		var item0 = this.items.allianceList.getItem(0);
		var item1 = this.items.allianceList.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'alli1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.hurtNumber), TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber,  1000) );
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.hurtNumber), TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber,  '12万') );		
	};
	
	this.test_seeDropAllianceGift = function(){
		this.mm.mock(UIM, 'openDlg');
		this.items.seeDropAllianceGift.click();
		assertEQ ( this.mm.params['openDlg'], ['worldbossalligift']);
	};
	
	this.test_countryDate = function(){
		this.dlg.openDlg();
		var s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.format(rstr.worldboss.rankdlg.lbl.weekLbl, 0) );
		assertEQ ( TQ.getTextEx(this.items.countryDate), s );
		
		var cmd = {crankweek:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		var s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.format(rstr.worldboss.rankdlg.lbl.weekLbl, 1) );
		assertEQ ( TQ.getTextEx(this.items.countryDate), s );
	};
	
	this.test_countryList = function(){
		this.dlg.hideDlg();
		
		var cmd = {crank:[{rank:1,country:9900001,times:10},{rank:2,country:9900002,times:20},{rank:3,country:9900003,times:30}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.countryList.getCount(), 0);
		
		this.dlg.openDlg();
		assertEQ ( this.items.countryList.getCount(), 3 );
		var item0 = this.items.countryList.getItem(0);
		var item1 = this.items.countryList.getItem(1);
		var item2 = this.items.countryList.getItem(2);
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 1 );
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 2 );
		assertEQ ( TQ.getTextEx(item2.exsubs.rank), 3 );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), rstr.comm.countrys[0] );
		assertEQ ( TQ.getTextEx(item1.exsubs.name), rstr.comm.countrys[1] );
		assertEQ ( TQ.getTextEx(item2.exsubs.name), rstr.comm.countrys[2] );
		assertEQ ( TQ.getTextEx(item0.exsubs.times), TQ.format(rstr.worldboss.rankdlg.lbl.hurtTimes,  10) );
		assertEQ ( TQ.getTextEx(item1.exsubs.times), TQ.format(rstr.worldboss.rankdlg.lbl.hurtTimes,  20) );	
		assertEQ ( TQ.getTextEx(item2.exsubs.times), TQ.format(rstr.worldboss.rankdlg.lbl.hurtTimes,  30) );	
	};
	
	this.test_getCountryGift = function(){
		this.mm.mock(WorldBossrSender, 'sendGetCountryRankGift');
		this.items.getCountryGift.click();
		assertEQ ( this.mm.params['sendGetCountryRankGift'], [this.g] );
	};
	
	this.test_getCountryGiftEnable = function(){
		var cmd = {today:{gotCRankGift:0}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getCountryGift.isEnable(), true );
		
		var cmd = {today:{gotCRankGift:1}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getCountryGift.isEnable(), false );
	};
	
	this.test_clickRoleName = function(){
		this.dlg.hideDlg();
		
		var cmd = {prank:[{rank:1,role:'role1',hurt:1000},{rank:2,role:'role2',hurt:121000}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.personList.getCount(), 0);
		
		this.dlg.openDlg();
		var item0 = this.items.personList.getItem(0);
		
		this.mm.mock(OutFieldSender, 'sendGetFieldDetailByRole');
		item0.exsubs.name.click();
		assertEQ ( this.mm.params['sendGetFieldDetailByRole'], [this.g, 'role1'] );
	};
});

tqWorldBossRankDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseWorldBossRankDlg, 'TestCaseWorldBossRankDlg');
};
