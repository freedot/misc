require('./tqSoldierDlg.js');
require('./tqSoldierOpDlg.js');

TestCaseSoldierDlgPresenter = TestCase.extern(function(){
	this.setUp = function(){
		this.view = SoldierDlgView.snew(g_app);
		this.model = SoldierDlgModel.snew(g_app);
		this.presenter = SoldierDlgPresenter .snew(g_app, this.view, this.model);
		UIM.regDlg('uselistitem', UseListItemDlg.snew(g_app));
		UIM.regDlg('filteritem', FilterItemDlg.snew(g_app));
		UIM.regDlg('buyitem', MockDialog.snew());
		UIM.regDlg('soldierop', SoldierOpDlg.snew(g_app));
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.testOpenDlg = function(){
		this.presenter.openDlg();
		assert( this.view.isShow() == true );
	};
	
	this.testBarbackInfoView = function() {
		TestCaseCondition.setPreCond(null, {roleattrs:[{id:ATTR.NAF,val:100},{id:ATTR.MNAF,val:200},{id:ATTR.AF,val:300},{id:ATTR.MAF,val:400},{id:ATTR.NAFO,val:10}]} );
		this.presenter.openDlg();
		
		assertNoInclude( TQ.getTextEx( this.view.getCtrl('newsoldier') ) , 'undefined' ); 
		assertInclude( TQ.getTextEx( this.view.getCtrl('newsoldier') ) , '100' ); 
		assertInclude( TQ.getTextEx( this.view.getCtrl('newsoldier') ) , '200' ); 
		
		assertNoInclude( TQ.getTextEx( this.view.getCtrl('totalsoldier') ) , 'undefined' ); 
		assertInclude( TQ.getTextEx( this.view.getCtrl('totalsoldier') ) , '300' ); 
		assertInclude( TQ.getTextEx( this.view.getCtrl('totalsoldier') ) , '400' ); 
		
		assertNoInclude( TQ.getTextEx( this.view.getCtrl('soldieroutput') ) , 'undefined' ); 
		assertInclude( TQ.getTextEx( this.view.getCtrl('soldieroutput') ) , '10' );
	};
	
	this.testRoleAttrsChange = function(){
		this.presenter.openDlg();
		assertInclude( TQ.getTextEx( this.view.getCtrl('newsoldier') ) , '0' );
		TestCaseCondition.setPreCond(null, {roleattrs:[{id:ATTR.NAF,val:100}]} );
		g_app.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertInclude( TQ.getTextEx( this.view.getCtrl('newsoldier') ) , '100' );
	};
	
	this.testClickAddNewSoldierBtn = function(){
		var itemid = ItemResUtil.findEffectItems(RES_EFF.ADD_NEWSOLDIER).items[0];
		TestCaseCondition.setPreCond(this.hero, { item:{id:itemid,num:1} })
		this.presenter.openDlg();
		this.view.getCtrl('addnewsoldier').click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
		UIM.getDlg('uselistitem').clickItem(0);
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testHasSoldierList = function(){
		this.presenter.openDlg();
		assert ( this.view.getCtrl('hassoldierlist').getCount() == 0 )
		
		g_app.sendEvent({ eid:EVT.NET, sid:NETCMD.SOLDIERRES, data:{soldiers:[{id:150001*1000+1,number:2}]} });
		
		assert ( this.view.getCtrl('hassoldierlist').getCount() == 1 );
		var item = this.view.getCtrl('hassoldierlist').getItem(0);
		assertInclude ( TQ.getTextEx(item.exsubs.name), '1' );
		assert ( TQ.getTextEx(item.exsubs.num) === 2);
	};
	
	this.testCanSoldierList = function(){
		this.presenter.openDlg();
		assert ( this.view.getCtrl('cantraininglist').getCurSel() == 0 )
		
		assert ( this.view.getCtrl('cantraininglist').getCount() == 5 );
		var item = this.view.getCtrl('cantraininglist').getItem(0);
		assertInclude ( TQ.getTextEx(item.exsubs.name), '0' );
		assertInclude( IMG.getBKImage(item.exsubs.icon), 'gif' );
		assertNoInclude( IMG.getBKImage(item.exsubs.icon), 'undefined' );

		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:2}] })
		this.view.updateView()
		assertInclude ( TQ.getTextEx(item.exsubs.name), '2' );
		assertInclude( IMG.getBKImage(item.exsubs.icon), 'gif' );
		assertNoInclude( IMG.getBKImage(item.exsubs.icon), 'undefined' );
	};
	
	this.testSelCanSoldierListItem = function(){
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:3},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:1000000, food:1000000 })
		this.presenter.openDlg();
		
		assert ( this.view.getCtrl('cantraininglist').getCurSel() == 0 );
		var res = ItemResUtil.findItemres(FIXID.FIRSTSOLDIER);
		var LV = 1;
		assert (  TQ.getTextEx(this.view.getCtrl('strattr')) == Math.round(eval(res.str))  );
		assert (  TQ.getTextEx(this.view.getCtrl('phyattr')) == Math.round(eval(res.phy))  );
		assert (  TQ.getTextEx(this.view.getCtrl('agileattr')) == Math.round(eval(res.agile))  );
		assert (  TQ.getTextEx(this.view.getCtrl('mspeedattr')) == Math.round(eval(res.mspeed))  );
		assert (  TQ.getTextEx(this.view.getCtrl('arangeattr')) == Math.round(eval(res.arange))  );
		assert (  TQ.getTextEx(this.view.getCtrl('aspeedattr')) == Math.round(eval(res.aspeed))  );
		
		var res = TQ.qfind(res_soldiers_upd, 'level', 1);
		assert (  TQ.getTextEx(this.view.getCtrl('needfood')) ==  res.food );
		assert (  TQ.getTextEx(this.view.getCtrl('needmoney')) ==  res.money );
		
		assert (  TQ.getTextEx(this.view.getCtrl('curfood')) == 1000000 );
		assert (  TQ.getTextEx(this.view.getCtrl('curmoney')) == 1000000 );
		
		this.view.getCtrl('isoldiernum').setVal(2);
		this.view.getCtrl('cantraininglist').setCurSel(1);
		assert( this.view.getCtrl('isoldiernum').getVal() == 1);
	};
	
	this.testChangeSoldierNum = function() {
		var res = TQ.qfind(res_soldiers_upd, 'level', 1);
		
		this.presenter.openDlg();
		var isoldiernum = this.view.getCtrl('isoldiernum');
		assert ( isoldiernum.getVal() == 1 );
		assert (  TQ.getTextEx(this.view.getCtrl('needfood')) ==  res.food );
		assert (  TQ.getTextEx(this.view.getCtrl('needmoney')) ==  res.money );
		assert (  TQ.getTextEx(this.view.getCtrl('neednewsoldier')) == 1 );
		
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:0},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:0}], money:res.money*3, food:res.food*2 })
		isoldiernum.setVal(4);
		assert ( isoldiernum.getVal() == 1 );
		
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:3},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:res.money*3, food:res.food*2 })
		isoldiernum.setVal(4);
		assert ( isoldiernum.getVal() == 2 );
		
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:3},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:res.money*3, food:res.food*3 })
		isoldiernum.setVal(4);
		assert ( isoldiernum.getVal() == 2 );
		assert (  TQ.getTextEx(this.view.getCtrl('needfood')) ==  res.food*2 );
		assert (  TQ.getTextEx(this.view.getCtrl('needmoney')) ==  res.money*2 );
		assert (  TQ.getTextEx(this.view.getCtrl('neednewsoldier')) == 2 );
	};
	
	this.testFoodMoneySvrChange = function(){
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:1}], money:2, food:3 })
		this.presenter.openDlg();
		assert (  TQ.getTextEx(this.view.getCtrl('curfood')) == 3 );
		assert (  TQ.getTextEx(this.view.getCtrl('curmoney')) == 2 );
		assert (  TQ.getTextEx(this.view.getCtrl('curnewsoldier')) == 1 );
		
		TestCaseCondition.setPreCond(null, { roleattrs:[{id:ATTR.NAF,val:10}] })
		g_app.sendEvent({ eid:EVT.ROLEBASE, sid:0});
		
		assert (  TQ.getTextEx(this.view.getCtrl('curnewsoldier')) == 10 );
		assert (  TQ.getTextEx(this.view.getCtrl('curmoney')) == 2 );
		assert (  TQ.getTextEx(this.view.getCtrl('curfood')) == 3 );
		
		TestCaseCondition.setPreCond(null, { money:20, food:30 })
		g_app.sendEvent({ eid:EVT.CITYRES, sid:0});
		assert (  TQ.getTextEx(this.view.getCtrl('curmoney')) == 20 );
		assert (  TQ.getTextEx(this.view.getCtrl('curfood')) == 30 );
	};
	
	this.testClickTrainingBtn = function(){
		this.presenter.openDlg();
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}], roleattrs:[{id:ATTR.NAF,val:0},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:1000000, food:1000000 });
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldierdlg.err.noNewSoldier );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}], roleattrs:[{id:ATTR.NAF,val:1000000},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:0, food:1000000 });
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldierdlg.err.noMoney );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}], roleattrs:[{id:ATTR.NAF,val:1000000},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:1000000, food:0 });
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldierdlg.err.noFood );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:0}], roleattrs:[{id:ATTR.NAF,val:1000000},{id:ATTR.AF,val:3},{id:ATTR.MAF,val:3}], money:1000000, food:1000000 });
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert ( TestCaseSysTip.getSystip() == rstr.soldierdlg.err.noCapacity );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:0}], roleattrs:[{id:ATTR.NAF,val:1000000},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:1000000, food:1000000 });
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert ( TestCaseSysTip.hasSystip() == true );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}], roleattrs:[{id:ATTR.NAF,val:1000000},{id:ATTR.AF,val:1},{id:ATTR.MAF,val:3}], money:1000000, food:1000000 });
		this.view.getCtrl('isoldiernum').setVal(2);
		this.view.updateView();
		this.view.getCtrl('trainingbtn').click();
		assert( g_app.getSendMsg() != '' );
		assert( this.view.getCtrl('isoldiernum').getVal() == 1);
	};
	
	this.testClickUpdSoldierBtn = function(){
		this.presenter.openDlg();
		g_app.sendEvent({ eid:EVT.NET, sid:NETCMD.SOLDIERRES, data:{soldiers:[{id:150001*1000+1,number:2}]} });
		var item = this.view.getCtrl('hassoldierlist').getItem(0);
		item.exsubs.updsoldier.click();
		assert( UIM.getDlg('soldierop').isShow() == true );
		
		var soldier = null;
		UIM.getDlg('soldierop').openDlg = function( s ) { soldier = s; };
		item.exsubs.updsoldier.click();
		assert ( soldier.id == 150001*1000+1 );
		assert ( soldier.number == 2 );
	};
});

tqSoldierDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSoldierDlgPresenter, 'TestCaseSoldierDlgPresenter');
};