/*******************************************************************************/
requireEx('./handler/tqSelectSteelTypeDlg.js', [
	{
		start:'//SelectSteelTypeDlg-unittest-start'
		,end:'//SelectSteelTypeDlg-unittest-end'
		,items:[
			'm_g' 
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_caller'
			,'m_idx'
			,'m_efficiencyType'
			,'_initParamsWhenOpen'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onSelectEffectType'
			,'_onClickOk'
			,'_onClickCancel'
		]
	}
]);


TestCaseSelectSteelTypeDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SelectSteelTypeDlg.snew(this.g);
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
		var p_caller = {};
		this.dlg.setCaller(p_caller);
		assertEQ ( this.lc().m_caller, p_caller);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initParamsWhenOpen' );
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		
		var p_idx = 0;
		var p_efficiencyType = 'speed';
		var p_steelType = 'highsteel';
		this.dlg.openDlg(p_idx, p_efficiencyType, p_steelType);
		assertEQ ( this.mm.walkLog, '_initParamsWhenOpen,_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initParamsWhenOpen'], [p_idx, p_efficiencyType, p_steelType] );
	};
	
	this.test__initParamsWhenOpen = function(){
		var p_idx = 10;
		var p_efficiencyType = 'normal';
		this.lc()._initParamsWhenOpen(p_idx, p_efficiencyType);
		assertEQ ( this.lc().m_idx, p_idx );
		assertEQ ( this.lc().m_efficiencyType, p_efficiencyType );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_createDlg' );
		this.mm.mock( this.lc(), '_setCallers' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:true, title:rstr.selectsteeltypedlg.title, pos:{x:'center', y:80}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.hero.selectsteeltypedlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__setCallers = function(){
		this.lc()._initDlg();
		this.mm.mock(this.lc().m_items.effType, 'setCaller' );
		this.mm.mock(this.lc().m_items.okBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.cancelBtn, 'setCaller' );

		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onSelectEffectType}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickOk}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickCancel}] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.lc()._createDlg();
		
		var p_idx = 10;
		var p_efficiencyType = 'normal';
		this.lc()._initParamsWhenOpen(p_idx, p_efficiencyType);
		this.lc()._initInfo();
		assertEQ ( this.lc().m_items.effType.getCurSelId(), 0 );
		
		var p_efficiencyType = 'speed';
		this.lc()._initParamsWhenOpen(p_idx, p_efficiencyType);
		this.lc()._initInfo();
		assertEQ ( this.lc().m_items.effType.getCurSelId(), 1 );
	};
	
	this.test_initInfo_speedRadioText = function(){
		var p_idx = 0;
		var p_efficiencyType = 'speed';
		var p_steelType = 'highsteel';
		this.dlg.openDlg(p_idx, p_efficiencyType, p_steelType);
		assertEQ ( this.lc().m_items.effType.getRadio(1).getText(), TQ.format(rstr.selectsteeltypedlg.lbl.high, 3)  );
		
		var p_steelType = 'vip1steel';
		this.dlg.openDlg(p_idx, p_efficiencyType, p_steelType);
		assertEQ ( this.lc().m_items.effType.getRadio(1).getText(), TQ.format(rstr.selectsteeltypedlg.lbl.high, 6)  );
		
		var p_steelType = 'vip2steel';
		this.dlg.openDlg(p_idx, p_efficiencyType, p_steelType);
		assertEQ ( this.lc().m_items.effType.getRadio(1).getText(), TQ.format(rstr.selectsteeltypedlg.lbl.high, 12)  );
	};
	
	this.test__onSelectEffectType = function(){
		var p_radioId = 0;
		this.lc()._onSelectEffectType(p_radioId);
		assertEQ ( this.lc().m_efficiencyType, 'normal' );
		
		var p_radioId = 1;
		this.lc()._onSelectEffectType(p_radioId);
		assertEQ ( this.lc().m_efficiencyType, 'speed' );
	};
	
	this.test__onClickOk = function(){
		this.lc()._createDlg();
		this.lc()._openDlg();
		
		var r_idx = -1;
		var r_type = ''
		var p_callerBack = function(idx, type){
			r_idx = idx;
			r_type = type;
		};
		this.lc().m_caller = {self:this, caller:p_callerBack};
		this.lc().m_idx = 10;
		this.lc().m_efficiencyType = 'normal';
		this.lc()._onClickOk();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( r_idx, 10 );
		assertEQ ( r_type, 'normal' );
	};
	
	this.test__onClickCancel = function(){
		this.lc()._createDlg();
		this.lc()._openDlg();
		this.lc()._onClickCancel();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
});

tqSelectSteelTypeDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSelectSteelTypeDlg, 'TestCaseSelectSteelTypeDlg');
};