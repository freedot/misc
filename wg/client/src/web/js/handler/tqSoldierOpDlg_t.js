require('./tqSoldierOpDlg.js');

TestCaseSoldierUpdOpDlg = TestCase.extern(function(){
	this.setUp = function(){
		this.dlg = SoldierOpDlg.snew(g_app);
		this.level = 1;
		this.resid = 150001*1000+this.level;
		var nextlevelidx = (this.level-1)+1;
		this.needres = res_soldiers_upd[nextlevelidx];
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.testOpenDlg = function(){
		this.dlg.openDlg({id:this.resid});
		assert( this.dlg.isShow() == true );
	};
	
	this.testDlgTitle = function(){
		this.dlg.openDlg({id:this.resid});
		assertInclude( this.dlg.getTitle(), rstr.soldieropdlg.title + ' - 1');
	}; 
	
	this.testShowMaxLevelDesc = function(){
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}] , soldiers:[{id:this.resid,number:10}] } );
		this.dlg.openDlg({id:this.resid});
		assert( TQ.getTextEx( this.dlg.getCtrl('desc') ) == '' );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}] , soldiers:[{id:this.resid,number:10}]} );
		this.dlg.openDlg({id:this.resid});
		assert( TQ.getTextEx( this.dlg.getCtrl('desc') ) == rstr.soldieropdlg.lbl.arrivemaxlevel , 'soldierLevel > cultureLevel' );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}] , soldiers:[{id:this.resid+1,number:10}] } );
		this.dlg.openDlg({id:this.resid+1});
		assert( TQ.getTextEx( this.dlg.getCtrl('desc') ) == rstr.soldieropdlg.lbl.arrivemaxlevel, 'soldierLevel > cultureLevel' );
	};
	
	
	this.testDisableUpdBtnWhenArriveMaxLevel = function(){
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}], soldiers:[{id:this.resid,number:10}] } );
		this.dlg.openDlg({id:this.resid});
		assert( this.dlg.getCtrl('updbtn').isEnable() == true );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}], soldiers:[{id:this.resid,number:10}] } );
		this.dlg.openDlg({id:this.resid});
		assert( this.dlg.getCtrl('updbtn').isEnable() == false );
	};
	
	this.testCanUpdMaxNumber = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:4}], cultures:[{id:120006,level:2}], money:this.needres.money*3, food:this.needres.food*0 });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('iupdnum').setVal(-1);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 1 );
		this.dlg.getCtrl('iupdnum').setVal(0);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 1 );
		this.dlg.getCtrl('iupdnum').setVal(2);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 1 );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}], money:this.needres.money*2, food:this.needres.food*3 });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('iupdnum').setVal(0);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 1 );
		this.dlg.getCtrl('iupdnum').setVal(4);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 2 );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}], money:this.needres.money*3, food:this.needres.food*2 });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('iupdnum').setVal(4);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 2 );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}], money:this.needres.money*5, food:this.needres.food*5 });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('iupdnum').setVal(5);
		assert( this.dlg.getCtrl('iupdnum').getVal() == 4 );
	};
	
	this.testChangeNumberRefreshNeedres = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:3}],  cultures:[{id:120006,level:2}], money:this.needres.money*3, food:this.needres.food*3 });
		this.dlg.openDlg({id:this.resid});
		assert( this.dlg.getCtrl('iupdnum').getVal() == 1 );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('needmoney') ), '' + this.needres.money );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('needfood') ), '' + this.needres.food );
		
		this.dlg.getCtrl('iupdnum').setVal(3);
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('needmoney') ), '' + this.needres.money*3 );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('needfood') ), '' + this.needres.food*3 );
	};
	
	this.testClickUpdBtnNoEnoughMoney = function(){
		TestCaseCondition.setPreCond(null, {soldiers:[{id:this.resid,number:1}],  cultures:[{id:120006,level:2}], money:0, food:this.needres.food });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('updbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldieropdlg.err.noMoney );
	};
	
	this.testClickUpdBtnNoEnoughFood = function(){
		TestCaseCondition.setPreCond(null, {soldiers:[{id:this.resid,number:1}],  cultures:[{id:120006,level:2}], money:this.needres.money, food:0 });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('updbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldieropdlg.err.noFood );	
	};
	
	this.testClickUpdBtnNoEnoughSoldierNum = function(){
		TestCaseCondition.setPreCond(null, {soldiers:[{id:this.resid,number:0}], cultures:[{id:120006,level:2}], money:this.needres.money, food:this.needres.food });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('updbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldieropdlg.err.noSoldierForUpgrade );
	};
	
	this.testClickUpdBtnOK = function(){
		TestCaseCondition.setPreCond(null, {soldiers:[{id:this.resid,number:2}], cultures:[{id:120006,level:2}], money:2*this.needres.money, food:2*this.needres.food });
		this.dlg.openDlg({id:this.resid});
		this.dlg.getCtrl('iupdnum').setVal(2);
		this.dlg.getCtrl('updbtn').click();
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
		assert(this.dlg.getCtrl('iupdnum').getVal() == 1);
	};
});

TestCaseSoldierDemobOpDlg = TestCase.extern(function(){
	this.setUp = function(){
		this.dlg = SoldierOpDlg.snew(g_app);
		this.level = 1;
		this.resid = 150001*1000+this.level;
		var levelidx = (this.level-1);
		this.needres = res_soldiers_upd[levelidx];
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.testMinMaxInputNumber = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:10}]});
		this.dlg.openDlg({id:this.resid});
		
		this.dlg.getCtrl('idemobnum').setVal(0);
		assert( this.dlg.getCtrl('idemobnum').getVal() == 1 );
		
		this.dlg.getCtrl('idemobnum').setVal(11);
		assert( this.dlg.getCtrl('idemobnum').getVal() == 10 );
	};
	
	this.testChangeNumberRefreshRetRes = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:10}]});
		this.dlg.openDlg({id:this.resid});
		assert( this.dlg.getCtrl('idemobnum').getVal() == 1 );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('rtmoney') ), '' + parseInt(this.needres.money*res_demob_soldier_retres_per, 10) );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('rtfood') ), '' + parseInt(this.needres.food*res_demob_soldier_retres_per, 10) );
		
		this.dlg.getCtrl('idemobnum').setVal(3);
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('rtmoney') ), '' + parseInt(this.needres.money*3*res_demob_soldier_retres_per, 10) );
		assertInclude( TQ.getTextEx( this.dlg.getCtrl('rtfood') ), '' + parseInt(this.needres.food*3*res_demob_soldier_retres_per, 10) );
	};
	
	this.testClickDemobBtnNoEnoughSoldierNum = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:0}]});
		this.dlg.openDlg({id:this.resid,number:0});
		this.dlg.getCtrl('demobbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldieropdlg.err.noSoldierForDemob );	
	};
	
	this.testClickDemobBtnSecConfirm = function(){
		TestCaseCondition.setPreCond(null, { soldiers:[{id:this.resid,number:10}]});
		this.dlg.openDlg({id:this.resid});

		this.dlg.getCtrl('idemobnum').setVal(10);
		this.dlg.getCtrl('demobbtn').click();
		assert(g_app.getGUI().isShowMsgBox() == true);
		
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
		assert( this.dlg.getCtrl('idemobnum').getVal() == 1 );
	};
});

tqSoldierOpDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSoldierUpdOpDlg, 'TestCaseSoldierUpdOpDlg');
	suite.addTestCase(TestCaseSoldierDemobOpDlg, 'TestCaseSoldierDemobOpDlg');
};