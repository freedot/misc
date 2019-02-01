/*******************************************************************************/
require('./tqWorldBossDlg.js')

TestCaseWorldBossDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.dlg = WorldBossDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_cantOpenDlg = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.dlg.hideDlg();
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.worldboss.maindlg.tip.needJoinAlliance] );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.worldboss.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.maindlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_sendGetInfoWhenOpen = function(){
		this.mm.mock(WorldBossrSender, 'sendGetInfo');
		assertEQ ( this.dlg.openDlg() );
		assertEQ ( this.mm.params['sendGetInfo'], [this.g] );
	};
	
	this.test_initForceTabWhenInitInfo = function(){
		TestCaseCondition.setPreCond(null, { heros:[
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
			{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		TQ.dictCopy(this.g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.WORLDBOSS, lineup:180001, heros:[0,0,0,0,0]}] );
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 0 );
		
		TQ.dictCopy(this.g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.WORLDBOSS, lineup:180001, heros:[1,2,0,0,0]}] );
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 200 + 300 );
	};
	
	this.test_eventListShow = function(){
		this.dlg.hideDlg();
		var cmd = {events:[{role:'role1',hurt:1000,time:1404904170}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.eventList.getCount(), 0 );
		
		this.dlg.openDlg();
		assertEQ ( this.items.eventList.getCount(), 1 );
		
		cmd = {events:[{role:'role3',hurt:1000,time:1404904165},{role:'role4',hurt:121000,time:1404904166}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.eventList.getCount(), 2 );
		var item0 = this.items.eventList.getItem(0);
		var item1 = this.items.eventList.getItem(1);
		var desc = TQ.format(rstr.worldboss.maindlg.lbl.event, 'role3', 1000, TQ.formatShortDateTime(1404904165));
		assertEQ ( TQ.getTextEx(item0.exsubs.desc), desc );
		desc = TQ.format(rstr.worldboss.maindlg.lbl.event, 'role4', '12万', TQ.formatShortDateTime(1404904166));
		assertEQ ( TQ.getTextEx(item1.exsubs.desc), desc );
	};
	
	this.test_changeForceBtn = function(){
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp' );
		TestCaseCondition.setPreCond(null, { heros:[
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
			{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.items.changeForceBtn.click()
		assertEQ ( UIM.getDlg('assignheros').isShow(), true);
		UIM.getDlg('assignheros').getCtrl('autosel').click();
		UIM.getDlg('assignheros').click();
		assertEQ ( this.g.getImgr().getSaveForceByType(FORCELINE_TYPE.WORLDBOSS), {type:FORCELINE_TYPE.WORLDBOSS, lineup: 180001, heros: [ 1, 2, 0, 0, 0 ]} );
		assertEQ ( this.mm.params['sendSaveForceLineUp'], [this.g, FORCELINE_TYPE.WORLDBOSS, 180001,  [1, 2, 0, 0, 0]] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 200 + 300 );
	};
	
	this.test_assignSoldierBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.items.assignSoldierBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['assignsoldiers']  );
	};
	
	this.test_treatmentBtn = function(){		
		TestCaseCondition.setPreCond(null, { heros:[
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
			{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.dlg.forceTabHdr_.setLineup(0, [1, 2]);
		this.mm.mock(TreatmentHeroHdr, 'treatmentHeros');
		this.items.treatmentBtn.click();
		assertEQ ( this.mm.params['treatmentHeros'], [this.g, [1,2]] );
	};
	
	this.test_fightBtnEnable = function(){
		var cmd = {today:{times:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.fightBtn.isEnable(), false );
		cmd = {today:{times:2}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.fightBtn.isEnable(), true );
	};
	
	this.test_clickFightBtn = function(){
		this.mm.mock(WorldBossrSender, 'sendExped');
		this.items.fightBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noAssignHeros );
		
		TestCaseSysTip.clearTip();
		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:10,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:102,name:"name2",level:1,state:0,soldier:{resid:150001001,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.dlg.forceTabHdr_.setLineup(180001, [1, 2, 0, 0, 0]);
		this.items.fightBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noHealth );

		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(1).attrs[ATTR.HEALTH] = 100;
		this.g.getImgr().getHero(2).attrs[ATTR.HEALTH] = 100;
		this.items.fightBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noCarrySoldiers );
				
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(2).soldier.number = 10;
		this.g.getImgr().getHero(2).state = 1;
		this.items.fightBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), TQ.format(rstr.expeddlg.err.hasBusyHero, ' name2 ') );
				
		assertEQ ( this.dlg.isShow(), true );
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(2).state = HERO_STATE.ACT_WORLDBOSS;
		this.items.fightBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), '' );
		assertEQ ( this.dlg.isShow(), false );
		var target = ItemResUtil.findItemres(FIXID.WORLDBOSSFIELD);
		assertEQ ( this.mm.params['sendExped'], [this.g, target, EXPED_TYPE.ACT_WORLDBOSS, 180001, [1,2,0,0,0] ]);
	};
	
	this.test_todayTimes = function(){
		assertEQ ( TQ.getTextEx(this.items.todayTimes), TQ.format(rstr.worldboss.maindlg.lbl.todaytimes, 3) );
		var cmd = {today:{times:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( TQ.getTextEx(this.items.todayTimes), TQ.format(rstr.worldboss.maindlg.lbl.todaytimes, 0) );
	};
	
	this.test_getTodayGiftEnable = function(){
		var cmd = {today:{gotGift:1}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getTodayGift.isEnable(), false );
		cmd = {today:{gotGift:0}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.getTodayGift.isEnable(), true );
	};
	
	this.test_clickGetTodayGift = function(){
		this.mm.mock(WorldBossrSender, 'sendGetTodayGift');
		this.items.getTodayGift.click();
		assertEQ (this.mm.params['sendGetTodayGift'], [this.g]);
	};
	
	this.test_guwuLevel = function(){
		assertEQ ( TQ.getTextEx(this.items.guwuLevel),  '0/10' );
		assertEQ ( TQ.getTextEx(this.items.addAttackPer),  '0%' );
		var cmd = {today:{guwu:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( TQ.getTextEx(this.items.guwuLevel),  '3/10' );
		assertEQ ( TQ.getTextEx(this.items.addAttackPer),  '30%' );
	};
	
	this.test_selectFirstGuwuTypeWhenOpenDlg = function(){
		this.dlg.openDlg();
		assertEQ ( this.items.guwuType.getCurSelId(), 0);
	};
	
	this.test_seeRankDlg = function(){
		this.mm.mock(UIM, 'openDlg');
		this.items.seeRankDlg.click();
		assertEQ ( this.mm.params['openDlg'], ['worldbossrank'] );
	};
	
	this.test_guwuOneTimeBtn = function(){
		this.mm.mock(WorldBossrSender, 'sendGuwu');
		this.items.guwuOneTimeBtn.click();
		assertEQ ( this.mm.params['sendGuwu'], [this.g, 0, 1] );
		
		this.items.guwuType.select(1);
		this.items.guwuOneTimeBtn.click();
		assertEQ ( this.mm.params['sendGuwu'], [this.g, 1, 1] );
	};
	
	this.test_guwuTenTimesBtn = function(){
		this.mm.mock(WorldBossrSender, 'sendGuwu');
		
		var cmd = {today:{guwu:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		
		this.items.guwuType.select(1);
		this.items.guwuTimesBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		var s = TQ.format(rstr.worldboss.maindlg.tip.guwuTimes, 10-3, rstr.comm.giftgold, 50);
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), s);
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendGuwu'], [this.g, 1, 7] );
	};
	
	this.test_guwuTenTimesBtnEnable = function(){
		var cmd = {today:{guwu:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.guwuOneTimeBtn.isEnable(), true );
		assertEQ ( this.items.guwuTimesBtn.isEnable(), true );
		
		cmd = {today:{guwu:10}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.items.guwuOneTimeBtn.isEnable(), false );
		assertEQ ( this.items.guwuTimesBtn.isEnable(), false );
	}
	
	this.test__onHeroUpdate = function(){
		TestCaseCondition.setPreCond(null, { heros:[
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
			{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
				
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 0 );
		
		this.dlg.openDlg();
		this.dlg.forceTabHdr_.setLineup(0, [1, 2]);
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 200 + 300 );
	};
	
	this.test_onFightDemo = function(){
		UIM.regDlg('fightmap', MockFightDemoDlg.snew());
		this.mm.travelMock(UIM.getDlg('fightmap'), 'openDlg')
		
		var cmd = {fightDemo:{fightId:2,armyId:1},hurt:10};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		assertEQ ( this.dlg.isShow(), false )
		assertEQ ( this.mm.params['openDlg'], [1, 2, {type:'worldboss', hurt:10}] );
		
		UIM.getDlg('fightmap').hideDlg();
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( UIM.getDlg('fightmap').getHideCaller(), null );
	};
});

tqWorldBossDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseWorldBossDlg, 'TestCaseWorldBossDlg');
};
