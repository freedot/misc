require('./tqAssignSoldiersDlg.js');

TestCaseAssignSoldiersDlg = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.dlg = AssignSoldiersDlg.snew(this.g);
		this.heros = [{id:1,icon:101,name:"name1",level:1,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) },
						 {id:2,icon:102,name:"name2",level:2,state:1,prof:2,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}])},
						 {id:3,icon:103,name:"name3",level:3,state:0,prof:3,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:2000,u:0}])},
						 {id:4,icon:103,name:"name4",level:3,state:0,prof:3,soldier:{resid:150002002,number:20},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}])},
						 {id:5,icon:103,name:"name5",level:3,state:0,prof:3,soldier:{resid:150001002,number:30},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:40,u:0}])},
						 {id:6,icon:103,name:"name6",level:3,state:0,prof:3,soldier:{resid:150003002,number:30},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}])},
						 {id:7,icon:103,name:"name7",level:3,state:0,prof:3,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}])}
						 ];
		this.soldiers = [{id:150001001,number:10}, {id:150001002,number:20}, {id:150002001,number:30}, {id:150003002,number:40}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.testOpenDlg = function(){
		this.dlg.openDlg();
		assert ( this.dlg.isShow() == true );
	};
	
	this.testShowFreeHerosList = function(){
		TestCaseCondition.setPreCond(null, {heros:this.heros } );
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('herolist').getCount() == 6 );
	};
	
	this.testRecvUpdateHeroEventBeforeOpenDlg = function(){
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('herolist').getCount() == 0 );
	};
	
	this.testRecvUpdateHeroEventAfterOpenDlg = function(){
		this.dlg.openDlg();
		
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assert( this.dlg.getCtrl('herolist').getCount() == 6 );
	};
	
	this.testHeroListItem = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();

		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert( TQ.getTextEx(listItem0.exsubs.name) == 'name1');
		assert( TQ.getTextEx(listItem0.exsubs.health) == rstr.comm.healthnames[0]);
		assert( TQ.getTextEx(listItem0.exsubs.prof) == rstr.comm.heroprofs[1]);
		assert( TQ.getTextEx(listItem0.exsubs.level) == '1');
		
		var res = ItemResUtil.findItemres(150001);
		var name = TQ.format(rstr.soldierdlg.lbl.combinename, 2, res.name);
		assert( listItem0.exsubs.soldiertype.getTitle() == name);
		assert( listItem0.exsubs.soldiernumber.getVal() == 10);
		assert( TQ.getTextEx(listItem0.exsubs.maxnum) == '1000');
		assert( TQ.getTextEx(listItem0.exsubs.state) == rstr.comm.herostate[0]);
		
		var listItem1 = this.dlg.getCtrl('herolist').getItem(1);
		assert( TQ.getTextEx(listItem1.exsubs.name) == 'name3');
		assert( TQ.getTextEx(listItem1.exsubs.health) == rstr.comm.healthnames[2]);
		assert( TQ.getTextEx(listItem1.exsubs.prof) == rstr.comm.heroprofs[3]);
		assert( TQ.getTextEx(listItem1.exsubs.level) == '3');
		assert( listItem1.exsubs.soldiertype.getTitle() == rstr.assignsoldierdlg.lbl.nohas);
		assert( listItem1.exsubs.soldiernumber.getVal() == 0);
		assert( TQ.getTextEx(listItem1.exsubs.maxnum) == '2000');
		assert( TQ.getTextEx(listItem1.exsubs.state) == rstr.comm.herostate[0]);
	};
	
	this.testFreeSoldierList = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers } );
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('soldierlist').getCount() == 4 );
	};
	
	this.testFreeSoldierListItem = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers } );
		this.dlg.openDlg();
		
		var res = ItemResUtil.findItemres(150001);
		var name = TQ.format(rstr.soldierdlg.lbl.combinename, 1, res.name);
		
		var listItem0 = this.dlg.getCtrl('soldierlist').getItem(0);
		assertInclude( TQ.getTextEx(listItem0.exsubs.soldiertype), '1');
		assert( TQ.getTextEx(listItem0.exsubs.soldiertype) == name);
		assert( TQ.getTextEx(listItem0.exsubs.soldiernumber) == '10');
		
		var listItem3 = this.dlg.getCtrl('soldierlist').getItem(3);
		assertInclude( TQ.getTextEx(listItem3.exsubs.soldiertype), '2');
		assert( TQ.getTextEx(listItem3.exsubs.soldiernumber) == '40');
	};
	
	this.testRecvFreeSoldierUpdateEventBeforeOpenDlg = function(){
		this.g.sendEvent({eid:EVT.SOLDIERRES, sid:0});
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('soldierlist').getCount() == 0 );
	};
	
	this.testRecvFreeSoldierUpdateEventAfterOpenDlg = function(){
		this.dlg.openDlg();
	
		TestCaseCondition.setPreCond(null, { heros:this.heros, soldiers:this.soldiers } );
		this.g.sendEvent({eid:EVT.SOLDIERRES, sid:0});
		assert( this.dlg.getCtrl('soldierlist').getCount() == 4 );
		assert( this.dlg.getCtrl('herolist').getCount() == 6 );
	};
	
	this.testSoldierTypeDropListWhenHasFreeSoldiers = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert( listItem0.exsubs.soldiertype.getCount() == 5 );
		assert( listItem0.exsubs.soldiertype.getCurSel() == 0 );
		assert( listItem0.exsubs.userdata.soldiertypes.length == 5 );
		assert( listItem0.exsubs.userdata.soldiertypes[0] == 150001002 );
		assert( listItem0.exsubs.userdata.soldiertypes[1] == 150001001 );
		assert( listItem0.exsubs.userdata.soldiertypes[2] == 150002001 );
		assert( listItem0.exsubs.userdata.soldiertypes[3] == 150003002 );
		assert( listItem0.exsubs.userdata.soldiertypes[4] == 0 );
		
		var listItem2 = this.dlg.getCtrl('herolist').getItem(2);
		assert( listItem2.exsubs.soldiertype.getCount() == 6 );
		assert( listItem2.exsubs.soldiertype.getCurSel() == 0 );
		assert( listItem2.exsubs.userdata.soldiertypes.length == 6 );
		assert( listItem2.exsubs.userdata.soldiertypes[0] == 150002002 );
		assert( listItem2.exsubs.userdata.soldiertypes[1] == 150001001 );
		assert( listItem2.exsubs.userdata.soldiertypes[2] == 150001002 );
		assert( listItem2.exsubs.userdata.soldiertypes[3] == 150002001 );
		assert( listItem2.exsubs.userdata.soldiertypes[4] == 150003002 );
		assert( listItem2.exsubs.userdata.soldiertypes[5] == 0 );
		
		var listItem5 = this.dlg.getCtrl('herolist').getItem(5);
		assert( listItem5.exsubs.soldiertype.getCount() == 5 );
		assert( listItem5.exsubs.soldiertype.getCurSel() == 4 );
		assert( listItem5.exsubs.userdata.soldiertypes.length == 5 );
		assert( listItem5.exsubs.userdata.soldiertypes[0] == 150001001 );
		assert( listItem5.exsubs.userdata.soldiertypes[1] == 150001002 );
		assert( listItem5.exsubs.userdata.soldiertypes[2] == 150002001 );
		assert( listItem5.exsubs.userdata.soldiertypes[3] == 150003002 );
		assert( listItem5.exsubs.userdata.soldiertypes[4] == 0 );
	};
	
	this.testSoldierTypeDropListWhenNoFreeSoldiers = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert( listItem0.exsubs.soldiertype.getCount() == 2 );
		assert( listItem0.exsubs.soldiertype.getCurSel() == 0 );
		assert( listItem0.exsubs.userdata.soldiertypes.length == 2 );
		assert( listItem0.exsubs.userdata.soldiertypes[0] == 150001002 );
		
		var listItem1 = this.dlg.getCtrl('herolist').getItem(1);
		assert( listItem1.exsubs.soldiertype.getCount() == 1 );
		assert( listItem1.exsubs.soldiertype.getCurSel() == 0 );
		assert( listItem1.exsubs.userdata.soldiertypes.length == 1 );
		assert( listItem1.exsubs.userdata.soldiertypes[0] == 0 );
	};
	
	this.testChangeSoldierType = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 10 );
		
		listItem0.exsubs.soldiertype.setCurSel(1);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 0 );
		
		listItem0.exsubs.soldiernumber.setVal(1);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 1 );
		
		listItem0.exsubs.soldiertype.setCurSel(0);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 10, 'set number equal to this old type has value'  );
		
		listItem0.exsubs.soldiertype.setCurSel(1);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 0, 'the type is change, clear soldier number' );
		
		assert ( TestCaseSysTip.getSystip() == '' );
	};
	
	this.testChangeSoldierNumberWhenTypeIsEmpty = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert ( listItem0.exsubs.soldiernumber.getVal() == 10 );
		assert ( TestCaseSysTip.getSystip() == '' );
		
		var len = listItem0.exsubs.soldiertype.getCount();
		listItem0.exsubs.soldiertype.setCurSel(len-1);
		assert ( TestCaseSysTip.getSystip() == '' );
		
		listItem0.exsubs.soldiernumber.setVal(1);
		
		assert ( listItem0.exsubs.soldiernumber.getVal() == 0 );
		assert ( TestCaseSysTip.getSystip() == rstr.assignsoldierdlg.err.noSoldierType );
	};
	
	this.testSoldierNumberLimitByMaxFreeSoldierNum = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		var totalFreeNumber = 20; // 150001002
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		listItem0.exsubs.soldiernumber.setVal(0);
		
		var listItem3 = this.dlg.getCtrl('herolist').getItem(3);
		var item3UseNumber = 10;
		listItem3.exsubs.soldiernumber.setVal(30 + item3UseNumber);
	
		var listItem4 = this.dlg.getCtrl('herolist').getItem(4);
		listItem4.exsubs.soldiertype.setCurSel(2); // 150001002
		var leftNumber = totalFreeNumber - item3UseNumber;
		listItem4.exsubs.soldiernumber.setVal(30 + leftNumber + 1000);
		
		assert(listItem4.exsubs.soldiernumber.getVal() == leftNumber);
	};
	
	this.testSoldierNumberLimitByMaxCommandAttr = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		var totalFreeNumber = 20; // 150001002
		var listItem3 = this.dlg.getCtrl('herolist').getItem(3);
		listItem3.exsubs.soldiernumber.setVal(30 + totalFreeNumber);
		assert( listItem3.exsubs.soldiernumber.getVal() == 40);
	};
	
	this.testClickConfrimButtonWhenNoChange = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		listItem0.exsubs.confirm.click();
		assert(this.g.getSendMsg() == '');
	};
	
	this.testClickConfrimButtonWhenTypeChange = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		listItem0.exsubs.soldiertype.setCurSel(1);
		listItem0.exsubs.confirm.click();
		assertNoInclude(this.g.getSendMsg(), 'undefined');
	};
	
	this.testClickConfrimButtonWhenNumberChange = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		listItem0.exsubs.soldiernumber.setVal(0);
		listItem0.exsubs.confirm.click();
		assertNoInclude(this.g.getSendMsg(), 'undefined');
	};
	
	this.testClickConfrimAllButtonWhenNoChange = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.click();
		assert(this.g.getSendMsg() == '');
	};
	
	this.testClickConfrimAllButtonWhenChange = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		listItem0.exsubs.soldiernumber.setVal(0);
		
		this.dlg.click();
		assertNoInclude(this.g.getSendMsg(), 'undefined');
	};
	
	this.testClickClearAllButton = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('clearall').click();
		assertNoInclude(this.g.getSendMsg(), 'undefined');
	};
	
	this.testClickFullAllButton = function(){
		TestCaseCondition.setPreCond(null, { soldiers:this.soldiers, heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('fullall').click();
		assertNoInclude(this.g.getSendMsg(), 'undefined');
	};
});

tqAssignSoldiersDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAssignSoldiersDlg, 'TestCaseAssignSoldiersDlg');
};