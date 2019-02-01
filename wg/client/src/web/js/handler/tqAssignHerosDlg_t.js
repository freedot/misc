require('./tqAssignHerosDlg.js');

TestCaseAssignHerosDlg = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		UIM.regDlg('assignsoldiers', AssignSoldiersDlg.snew(this.g));
		this.dlg = AssignHerosDlg.snew(this.g);
		
		this.heros = [{id:1,icon:101,name:"name1",level:1,state:0,prof:1,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
						 {id:2,icon:102,name:"name2",level:2,state:1,prof:2,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:3,icon:103,name:"name3",level:3,state:0,prof:3,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:4,icon:103,name:"name4",level:3,state:0,prof:3,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:5,icon:103,name:"name5",level:3,state:0,prof:3,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:6,icon:103,name:"name6",level:3,state:0,prof:3,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:7,icon:103,name:"name7",level:3,state:0,prof:3,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:8,icon:103,name:"name8",level:3,state:0,prof:3,soldier:{resid:0,number:1},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
						 {id:9,icon:103,name:"name9",level:3,state:0,prof:3,soldier:{resid:150001001,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
						 ];
		this.lineups = [180001,180002];
		this.bak_res_lineup = res_lineup;
		res_lineup=[{'id':180001,'desc':'无阵xxx','name':'无阵','grids':[0,1,2,3,4],'smallpic':180001}
			,{'id':180002,'desc':'五饼阵xxx','name':'五饼阵','grids':[0,2,4,6,8],'smallpic':180002}];
			
		TestCaseCondition.setPreCond(null, { lineups:this.lineups} );
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
		res_lineup = this.bak_res_lineup;
	};
	
	this.isEmptyTableGrid = function(gridIdx){
		var listItem = this.dlg.getCtrl('tablelist').getItem(gridIdx);
		return isInclude(IMG.getBKImage(listItem.exsubs.icon.parentNode), 'expedition/forcetab/small_emptybak.gif')
			&& isNotInclude(IMG.getBKImage(listItem.exsubs.icon), 'images');
	};
	
	this.isHasHeroTableGrid = function(gridIdx){
		var listItem = this.dlg.getCtrl('tablelist').getItem(gridIdx);
		return isInclude(IMG.getBKImage(listItem.exsubs.icon.parentNode), 'expedition/forcetab/small_emptybak.gif')
			&& isInclude(IMG.getBKImage(listItem.exsubs.icon), 'images');
	};
	
	this.isDisableTableGrid = function(gridIdx){
		var listItem = this.dlg.getCtrl('tablelist').getItem(gridIdx);
		return isInclude(IMG.getBKImage(listItem.exsubs.icon.parentNode), 'expedition/forcetab/small_disablebak.gif');
	};
	
	this.testOpenDlg = function(){
		this.dlg.openDlg();
		assert ( this.dlg.isShow() == true );
	};
	
	this.testShowFreeHerosList = function(){
		TestCaseCondition.setPreCond(null, {heros:this.heros } );
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('herolist').getCount() == 8 );
	};
	
	this.testUpdateHeroEvent = function(){
		
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('herolist').getCount() == 0 );
		
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assert( this.dlg.getCtrl('herolist').getCount() == 8 );
	};
	
	this.testHeroListItem = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();

		var listItem0 = this.dlg.getCtrl('herolist').getItem(0);
		assert( TQ.getTextEx(listItem0.exsubs.name) == 'name1');
		assert( TQ.getTextEx(listItem0.exsubs.health) ==RStrUtil.getHealthStr(100));
		assert( TQ.getTextEx(listItem0.exsubs.prof) == rstr.comm.heroprofs[1]);
		assert( TQ.getTextEx(listItem0.exsubs.level) == '1');
		assert( TQ.getTextEx(listItem0.exsubs.soldiertype) == '1阶刀兵');
		assert( TQ.getTextEx(listItem0.exsubs.soldiernumber) == '10');
		assert( TQ.getTextEx(listItem0.exsubs.state) == rstr.comm.herostate[0]);
		
		var listItem1 = this.dlg.getCtrl('herolist').getItem(1);
		assert( TQ.getTextEx(listItem1.exsubs.name) == 'name3');
		assert( TQ.getTextEx(listItem1.exsubs.health) == RStrUtil.getHealthStr(1));
		assert( TQ.getTextEx(listItem1.exsubs.prof) == rstr.comm.heroprofs[3]);
		assert( TQ.getTextEx(listItem1.exsubs.level) == '3');
		assert( TQ.getTextEx(listItem1.exsubs.soldiertype) == '1阶刀兵');
		assert( TQ.getTextEx(listItem1.exsubs.soldiernumber) == '10');
		assert( TQ.getTextEx(listItem1.exsubs.state) == rstr.comm.herostate[0]);
	};
	
	this.testShowLineupList = function(){
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('lineuplist').getCount() == 2 );
	};
	
	this.testDefaultSelectLineupListFirstItem = function(){
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('lineuplist').getCurSel() == 0 );
	};
	
	this.testShowLineupListItem = function(){
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('lineuplist').getCount() == 2 );
		var listItem0 = this.dlg.getCtrl('lineuplist').getItem(0);
		assert( TQ.getTextEx(listItem0.exsubs.name) == '无阵');
		assertInclude( IMG.getBKImage(listItem0.exsubs.icon), 'images');
		
		var listItem1 = this.dlg.getCtrl('lineuplist').getItem(1);
		assert( TQ.getTextEx(listItem1.exsubs.name) == '五饼阵');
		assertInclude( IMG.getBKImage(listItem1.exsubs.icon), 'images');
	};
	
	this.testSelectLineupShowDesc = function(){
		this.dlg.openDlg();
		assertNoInclude( TQ.getTextEx(this.dlg.getCtrl('lineupdesc')), 'undefined' );
		
		this.dlg.getCtrl('lineuplist').setCurSel(1);
		assertNoInclude( TQ.getTextEx(this.dlg.getCtrl('lineupdesc')), 'undefined' );
	};
	
	this.testSelectLineupReshowGrids = function(){
		this.dlg.openDlg();
		assert(this.isEmptyTableGrid(0) == true);
		assert(this.isEmptyTableGrid(1) == true);
		assert(this.isEmptyTableGrid(2) == true);
		assert(this.isEmptyTableGrid(3) == true);
		assert(this.isEmptyTableGrid(4) == true);
		assert(this.isDisableTableGrid(5) == true);
		assert(this.isDisableTableGrid(6) == true);
		assert(this.isDisableTableGrid(7) == true);
		assert(this.isDisableTableGrid(8) == true);
	};
	
	this.testSelectHeroInLineupGrid = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('herolist').setCurSel(0);
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		this.dlg.getCtrl('herolist').setCurSel(3);
		
		assert(this.isHasHeroTableGrid(0) == true);
		assert(this.isHasHeroTableGrid(1) == true);
		assert(this.isHasHeroTableGrid(2) == true);
		assert(this.isHasHeroTableGrid(3) == true);
		assert(this.isEmptyTableGrid(4) == true);
		
		this.dlg.getCtrl('herolist').setCurSel(4);
		
		assert(this.isHasHeroTableGrid(0) == true);
		assert(this.isHasHeroTableGrid(1) == true);
		assert(this.isHasHeroTableGrid(2) == true);
		assert(this.isHasHeroTableGrid(3) == true);
		assert(this.isHasHeroTableGrid(4) == true);
		assert(this.isDisableTableGrid(5) == true);
		
		this.dlg.getCtrl('herolist').setCurSel(5);
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getCheck() == 0);
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.fullHeros );
		
		this.dlg.getCtrl('herolist').setCurSel(4); // cancel
		this.dlg.getCtrl('herolist').setCurSel(6);
		assert ( this.dlg.getCtrl('herolist').getItem(6).exsubs.sel.getCheck() == 0);
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.noCarrySoldiers );
		TestCaseSysTip.clearTip();
		
		this.dlg.getCtrl('herolist').setCurSel(7);
		assert ( this.dlg.getCtrl('herolist').getItem(7).exsubs.sel.getCheck() == 0);
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.noCarrySoldiers );
	};
	
	this.testSelectCancelHeroInLineupGrid = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		// select
		this.dlg.getCtrl('herolist').setCurSel(0);
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		this.dlg.getCtrl('herolist').setCurSel(3);
		
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getText() == ' 1');
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getText() == ' 2');
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getText() == ' 3');
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getText() == ' 4');
		
		// cancel
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getText() == ' 1');
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getText() == '');
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getText() == '');		
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getText() == ' 4');
		
		// select
		this.dlg.getCtrl('herolist').setCurSel(5);
		
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getText() == ' 1');
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getText() == ' 4');
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getText() == ' 2');
		
		assert(this.isHasHeroTableGrid(0) == true);
		assert(this.isHasHeroTableGrid(1) == true);
		assert(this.isEmptyTableGrid(2) == true);
		assert(this.isHasHeroTableGrid(3) == true);
		assert(this.isEmptyTableGrid(4) == true);
		assert(this.isDisableTableGrid(5) == true);	
	};
	
	this.testChangeLineupWhenHerosIn = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		// select
		this.dlg.getCtrl('herolist').setCurSel(0);
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		this.dlg.getCtrl('herolist').setCurSel(3);
		
		this.dlg.getCtrl('lineuplist').setCurSel(1);
		assert(this.isHasHeroTableGrid(0) == true);
		assert(this.isHasHeroTableGrid(2) == true);
		assert(this.isHasHeroTableGrid(4) == true);
		assert(this.isHasHeroTableGrid(6) == true);
		
		assert(this.isEmptyTableGrid(8) == true);
		
		assert(this.isDisableTableGrid(1) == true);
		assert(this.isDisableTableGrid(3) == true);
		assert(this.isDisableTableGrid(5) == true);
		assert(this.isDisableTableGrid(7) == true);
	};
	
	this.testAutoSelectHeros = function(){
		this.heros[0].soldier.number = 0;
		
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		this.dlg.getCtrl('herolist').setCurSel(5);
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getCheck() == 1);
		
		this.dlg.getCtrl('autosel').click();
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getCheck() == 1);
		
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getCheck() == 1);
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getCheck() == 1);
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getCheck() == 1);
		assert ( this.dlg.getCtrl('herolist').getItem(4).exsubs.sel.getCheck() == 1);
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getCheck() == 1);
		
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getText() == ' 1');
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getText() == ' 2');
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getText() == ' 3');
		assert ( this.dlg.getCtrl('herolist').getItem(4).exsubs.sel.getText() == ' 4');
		assert ( this.dlg.getCtrl('herolist').getItem(5).exsubs.sel.getText() == ' 5');
		
		assert(this.isHasHeroTableGrid(0) == true);
		assert(this.isHasHeroTableGrid(1) == true);
		assert(this.isHasHeroTableGrid(2) == true);
		assert(this.isHasHeroTableGrid(3) == true);
		assert(this.isHasHeroTableGrid(4) == true);
		assert(this.isDisableTableGrid(5) == true);
	};
	
	this.testCancelAllSelectedHeros = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('autosel').click();
		this.dlg.getCtrl('cancelsel').click();
		
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getCheck() == 0);
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getCheck() == 0);
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getCheck() == 0);
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getCheck() == 0);
		assert ( this.dlg.getCtrl('herolist').getItem(4).exsubs.sel.getCheck() == 0);
		
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getText() == '');
		assert ( this.dlg.getCtrl('herolist').getItem(1).exsubs.sel.getText() == '');
		assert ( this.dlg.getCtrl('herolist').getItem(2).exsubs.sel.getText() == '');
		assert ( this.dlg.getCtrl('herolist').getItem(3).exsubs.sel.getText() == '');
		assert ( this.dlg.getCtrl('herolist').getItem(4).exsubs.sel.getText() == '');
		
		assert(this.isEmptyTableGrid(0) == true);
		assert(this.isEmptyTableGrid(1) == true);
		assert(this.isEmptyTableGrid(2) == true);
		assert(this.isEmptyTableGrid(3) == true);
		assert(this.isEmptyTableGrid(4) == true);
		assert(this.isDisableTableGrid(5) == true);
	};
	
	this.testClickAssignSoldierBtn = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		this.dlg.getCtrl('assignsoldier').click();
		assert( UIM.getDlg('assignsoldiers').isShow() == true );
	};
	
	this.testClickSetDefaultTeamBtn = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('team1').click();
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.noHero );
		
		this.dlg.getCtrl('herolist').setCurSel(0);
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		this.dlg.getCtrl('herolist').setCurSel(3);
		this.dlg.getCtrl('team1').click();
		assertInclude ( this.g.getSendMsg(), 'teamid=1');
		this.g.clearSendMsg();
		
		this.dlg.getCtrl('team2').click();
		assertInclude ( this.g.getSendMsg(), 'teamid=2');
		this.g.clearSendMsg();
		
		this.dlg.getCtrl('team3').click();
		assertInclude ( this.g.getSendMsg(), 'teamid=3');
		this.g.clearSendMsg();
	};
	
	this.testClickConfirmBtnNoHasFreeHeroButNeedHas = function(){
		TestCaseCondition.setPreCond(null, { heros:[] } );
		this.dlg.openDlg();
		
		this.dlg.click();
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.noFreeHero );
		assert ( this.dlg.isShow() == false );
	};
	
	this.testClickConfirmBtnNoHasFreeHeroButNoNeed = function(){
		var lineup = null;
		var heroIds = null;
		var _assignHerosCallback = function(lineup_, heroIds_){
			lineup = lineup_;
			heroIds = heroIds_;
		};

		this.dlg.openDlg({canEmpty:true});
		this.dlg.setCaller({self:this, caller:_assignHerosCallback});		
		this.dlg.click();
		assert ( TestCaseSysTip.hasSystip() == false );
		assert ( this.dlg.isShow() == false );
		assert ( lineup == 180001 );
		assert ( heroIds[0] == 0 );
		assert ( heroIds[1] == 0 );
		assert ( heroIds[2] == 0 );
		assert ( heroIds[3] == 0 );
		assert ( heroIds[4] == 0 );
	};
	
	this.testClickConfirmBtnNoAssignHero = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.click();
		assert ( TestCaseSysTip.getSystip() == rstr.assignherosdlg.err.noHero );
		assert ( this.dlg.isShow() == true );
	};
	
	this.testClickConfirmBtn = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		this.dlg.getCtrl('lineuplist').setCurSel(1);
		
		var lineup = null;
		var heroIds = null;
		var _assignHerosCallback = function(lineup_, heroIds_){
			lineup = lineup_;
			heroIds = heroIds_;
		};
		this.dlg.setCaller({self:this, caller:_assignHerosCallback});		
		
		this.dlg.getCtrl('herolist').setCurSel(0);
		this.dlg.getCtrl('herolist').setCurSel(1);
		this.dlg.getCtrl('herolist').setCurSel(2);
		this.dlg.getCtrl('herolist').setCurSel(3);
		this.dlg.getCtrl('herolist').setCurSel(4);
		
		this.dlg.click();
		assert ( TestCaseSysTip.hasSystip() == false );
		assert ( this.dlg.isShow() == false );
		
		assert ( lineup == 180002 );
		assert ( heroIds[0] == 1 );
		assert ( heroIds[1] == 3 );
		assert ( heroIds[2] == 4 );
		assert ( heroIds[3] == 5 );
		assert ( heroIds[4] == 6 );
	};
	
	this.testSecOpenDlgClearLastSelHeros = function(){
		TestCaseCondition.setPreCond(null, { heros:this.heros } );
		this.dlg.openDlg();
		
		this.dlg.getCtrl('herolist').setCurSel(0);
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getCheck() == 1);
		assert(this.isHasHeroTableGrid(0) == true);
		
		this.dlg.closeDlg();
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('herolist').getItem(0).exsubs.sel.getCheck() == 0);
		assert(this.isHasHeroTableGrid(0) == false);
	};
});

tqAssignHerosDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAssignHerosDlg, 'TestCaseAssignHerosDlg');
};