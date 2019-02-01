/*******************************************************************************/
requireEx('./handler/tqInputCoodDlg.js', [
	{
		start:'//InputCoodDlg-unittest-start'
		,end:'//InputCoodDlg-unittest-end'
		,items:[
			'm_dlg'
			,'m_caller'
			,'m_items'
			,'m_label'
			,'m_xRange'
			,'m_yRange'
			,'m_outRangeTip'
			,'_initParams'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_setFocus'
			,'_createDlg'
			,'_setCallers'
			,'_onClickConfirmBtn'
			,'_onClickCancelBtn'
			,'_onClickFavorite'
			,'_onSelectFavorite'
			,'_isInRange'
		]
	}
]);

TestCaseEmptyFieldTargetSpec = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isSatisfiedBy = function(){
		var g_field = {objType:OBJ_TYPE.ROLE };
		assertEQ ( EmptyFieldTargetSpec.snew().isSatisfiedBy(null), false );
		assertEQ ( EmptyFieldTargetSpec.snew().isSatisfiedBy(g_field), false );
		
		var g_field = {objType:OBJ_TYPE.NONE };
		assertEQ ( EmptyFieldTargetSpec.snew().isSatisfiedBy(g_field), true );
	};
	
	this.test_getInvalidTip = function(){
		assertEQ ( EmptyFieldTargetSpec.snew().getInvalidTip(), rstr.selectexpedtarget.err.noEmptyFieldTarget );
	};
});

TestCaseInputCoodDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.label = 'label';
		this.xRange = {min:1, max:2};
		this.yRange = {min:3, max:4};
		this.outRangeTip = 'out range tip';
		this.dlg = InputCoodDlg.snew(this.g);
		this.dlg.openDlg(this.label, this.xRange, this.yRange, this.outRangeTip);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		var g_label = 'label';
		var g_xRange = {min:1, max:2};
		var g_yRange = {min:3, max:4};
		var g_outRangeTip = 'outRange';
		
		var dlg = InputCoodDlg.snew(this.g);
		this.mm.mock(dlg.lc(), '_initParams');
		this.mm.mock(dlg.lc(), '_initDlg');
		this.mm.mock(dlg.lc(), '_showDlg');
		this.mm.mock(dlg.lc(), '_initInfo');
		this.mm.mock(dlg.lc(), '_setFocus');
		
		dlg.openDlg(g_label, g_xRange, g_yRange, g_outRangeTip );
		
		assert ( this.mm.walkLog == '_initParams,_initDlg,_showDlg,_initInfo,_setFocus' );
		assertListEQ ( this.mm.params['_initParams'], [g_label, g_xRange, g_yRange, g_outRangeTip] );
	};
	
	this.test_setCaller = function(){
		var caller = function(){};
		this.dlg.setCaller(caller);
		assert ( this.lc().m_caller == caller );
	};
	
	this.test_isShow = function(){
		var dlg = InputCoodDlg.snew(this.g);
		assert ( dlg.isShow() == false );
		
		dlg.openDlg();
		assert ( dlg.isShow() == true );
		
		dlg.lc().m_dlg.hide();
		assert ( dlg.isShow() == false );
	};
	
	this.test_click = function(){
		this.mm.mock(this.lc(), '_onClickConfirmBtn' );
		this.dlg.click();
		assert ( this.mm.walkLog == '_onClickConfirmBtn' );
	};
	
	this.test__initParams = function(){
		var g_label = 'label';
		var g_xRange = {min:1, max:2};
		var g_yRange = {min:3, max:4};
		var g_outRangeTip = 'tip';
		
		var dlg = InputCoodDlg.snew(this.g);
		dlg.lc()._initParams(g_label, g_xRange, g_yRange, g_outRangeTip);
		assert ( dlg.lc().m_label == g_label );
		assert ( dlg.lc().m_xRange == g_xRange );
		assert ( dlg.lc().m_yRange == g_yRange );
		assert ( dlg.lc().m_outRangeTip == g_outRangeTip );
	};
	
	this.test__initDlg = function(){
		var dlg = InputCoodDlg.snew(this.g);
		this.mm.mock(dlg.lc(), '_createDlg');
		this.mm.mock(dlg.lc(), '_setCallers');
		dlg.lc()._initDlg();
		assert ( this.mm.walkLog == '_createDlg,_setCallers' );
		
		this.mm.clear();
		dlg.lc().m_dlg = {};
		dlg.lc()._initDlg();
		assert ( this.mm.walkLog == '', 'only create one time' );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assert ( this.dlg.isShow() == true );
	};

	this.test__initInfo = function(){
		this.lc().m_label = 'tip';
		this.lc()._initInfo();
		assert ( TQ.getTextEx(this.lc().m_items.name) == 'tip' );
	};
	
	this.test__setFocus = function(){
		this.mm.mock(this.lc().m_items.cood_x, 'focus');
		this.lc()._setFocus();
		assert ( this.mm.walkLog == 'focus' );
	};
	
	this.test__createDlg = function(){
		this.mm.mock(this.g.getGUI(), 'initDlg');
		this.lc()._createDlg();
		assert ( this.mm.walkLog == 'initDlg' );
		assert ( this.mm.params['initDlg'][1] == uicfg.comm.cooddlg );
		assert ( this.mm.params['initDlg'][2] == this.lc().m_items );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.favoriteBtn, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickFavorite}] );
	};
	
	this.test__onClickConfirmBtn = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		
		this.lc().m_items.cood_x.setVal(2);
		this.lc().m_items.cood_y.setVal(4);
		this.lc().m_dlg.show();
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.dlg.isShow() , false );	
		
		var g_beCalled = false;
		var g_x = 0;
		var g_y = 0;
		var _caller = function(x, y){
			g_beCalled = true;
			g_x = x;
			g_y = y;
		};
		
		this.lc().m_items.cood_x.setVal(0);
		this.lc().m_items.cood_y.setVal(0);
		
		this.lc().m_caller = {self:this, caller:_caller};
		this.lc().m_dlg.show();
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.dlg.isShow(), true );	
		assertEQ ( g_beCalled , false );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, this.outRangeTip] );
		
		this.mm.clear();
		this.lc().m_items.cood_x.setVal(2);
		this.lc().m_items.cood_y.setVal(4);
		this.lc()._onClickConfirmBtn();
		assertEQ ( this.dlg.isShow(), false );	
		assertEQ ( g_beCalled , true );
		assertEQ ( g_x , 2 );
		assertEQ ( g_y , 4 );
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__onClickCancelBtn = function(){
		assert ( this.dlg.isShow() == true );
		this.lc()._onClickCancelBtn();
		assert ( this.dlg.isShow() == false );		
	};
	
	this.test__onClickFavorite = function(){
		this.mm.mock( UIM.getDlg('selectexpedtarget'), 'openDlg' );
		this.mm.mock( UIM.getDlg('selectexpedtarget'), 'setCaller' );
		this.mm.mock( EmptyFieldTargetSpec, 'snew', [{name:'spec'}] );
		this.lc()._onClickFavorite();
		assertEQ ( this.mm.walkLog, 'setCaller,snew,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectFavorite}] );
		assertEQ ( this.mm.params['openDlg'], [{name:'spec'}, {tabIdx:1, typeListIdx:0}] );
	};
	
	this.test__onSelectFavorite = function(){
		this.dlg.openDlg(this.label, {min:0, max:599}, {min:0, max:599}, this.outRangeTip);
		
		var field = {gridId:10000};
		this.lc()._onSelectFavorite(field);
		var pos = FieldUtil.getPosByGridId(field.gridId);
		assertEQ ( this.lc().m_items.cood_x.getVal(), pos.x );
		assertEQ ( this.lc().m_items.cood_y.getVal(), pos.y );
	};
	
	this.test__isInRange = function(){
		assertEQ ( this.lc()._isInRange({x:0, y:0}), false );
		assertEQ ( this.lc()._isInRange({x:1, y:3}), true );
		assertEQ ( this.lc()._isInRange({x:2, y:4}), true );
		assertEQ ( this.lc()._isInRange({x:10, y:4}), false );
		assertEQ ( this.lc()._isInRange({x:1, y:30}), false );
	};
});

tqInputCoodDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseEmptyFieldTargetSpec, 'TestCaseEmptyFieldTargetSpec');
	suite.addTestCase(TestCaseInputCoodDlg, 'TestCaseInputCoodDlg');
};
