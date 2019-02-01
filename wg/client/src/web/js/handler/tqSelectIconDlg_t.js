/*******************************************************************************/
requireEx('./handler/tqSelectIconDlg.js', [
	{
		start:'//SelectIconDlg-unittest-start'
		,end:'//SelectIconDlg-unittest-end'
		,items:['m_g'
		,'m_this'
		,'m_caller'
		,'m_iconIds'
		,'m_curIconId'
		,'m_dlg'
		,'m_items'
		,'_setParams'
		,'_initDlg'
		,'_initInfo'
		,'_showDlg'
		,'_createDlg'
		,'_initListItems'
		,'_setListCaller'
		,'_onClickListItem'
		]
	}
]);

TestCaseSelectIconDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg  = SelectIconDlg.snew(this.g);
		this.dlg.openDlg([101,102], 102);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_setCaller = function(){
		var caller = {self:this, caller:this.test_setCaller};
		this.dlg.setCaller(caller);
		assertEQ ( this.lc().m_caller, caller );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_setParams');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc(), '_showDlg');
		this.dlg.openDlg([101, 102], 102);
		assertEQ ( this.mm.walkLog, '_setParams,_initDlg,_initInfo,_showDlg' );
		assertEQ ( this.mm.params['_setParams'], [[101, 102], 102] );
	};
	
	this.test__setParams = function(){
		this.lc()._setParams([101, 102], 102);
		assertEQ ( this.lc().m_iconIds, [101, 102] );
		assertEQ ( this.lc().m_curIconId, 102 );
	};
	
	this.test__initDlg = function(){
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setListCaller');
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setListCaller' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.selectRoleIconDlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.selectRoleIconDlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);	
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_initListItems');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_initListItems' );
	};
	
	this.test__initListItems = function(){
		this.lc()._initListItems([101, 102], 102);
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		assertEQ ( this.lc().m_items.list.getCurSel(), 1);
		
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(0).exsubs.icon), '101.gif'), true);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(1).exsubs.icon), '102.gif'), true);
	};
	
	this.test__setListCaller = function(){
		this.mm.mock(this.lc().m_items.list, 'setCaller');
		this.lc()._setListCaller();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickListItem}] );
	};
	
	this.test__onClickListItem = function(){	
		this.lc().m_dlg.show();
		var r_iconId = 0;
		var callBack = function(iconId){
			r_iconId = iconId;
		};
		var caller = {self:this, caller:callBack};
		this.lc()._onClickListItem(null, 0);
		assertEQ ( r_iconId, 0 );
		assertEQ ( this.lc().m_dlg.isShow(), false );
		
		this.lc().m_dlg.show();
		this.dlg.setCaller(caller);
		this.lc()._onClickListItem(null, 0);
		assertEQ ( r_iconId, 101 );
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
});

tqSelectIconDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelectIconDlg, 'TestCaseSelectIconDlg');
};
