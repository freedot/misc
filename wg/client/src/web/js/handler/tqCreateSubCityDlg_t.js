/*******************************************************************************/
requireEx('./handler/tqCreateSubCityDlg.js', [
	{
		start:'//CreateSubCityDlg-unittest-start'
		,end:'//CreateSubCityDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_subCityId'
			,'m_createType'
			,'_initParams'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_openDlg'
			,'_onCreateResCity'
			,'_onCreateMilitaryCity'
			,'_closeDlg'
			,'_sendCreateSubCity'
			]
	}
]);

TestCaseCreateSubCityDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = CreateSubCityDlg.snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		
		var p_subCityId = 2;
		var p_createType = 'create'; // or 'change'
		this.dlg.openDlg(p_subCityId, p_createType);
		assertEQ ( this.mm.walkLog, '_initParams,_initDlg,_openDlg' );
		assertEQ ( this.mm.params['_initParams'], [p_subCityId, p_createType] );
	};
	
	this.test__initParams = function(){
		var p_subCityId = 2;
		var p_createType = 'change';
		this.lc()._initParams(p_subCityId, p_createType);
		assertEQ ( this.lc().m_subCityId, p_subCityId );
		assertEQ ( this.lc().m_createType, p_createType);
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_createDlg' );
		this.mm.mock( this.lc(), '_setCallers' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.lc().m_dlg = {};
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '', 'only create one time' );
	};
	
	this.test_createDlg = function(){
		var r_dlg = {name:'dlg'};
		this.mm.mock( Dialog, 'snew', [r_dlg]);
		this.mm.mock( this.g.getGUI(), 'initDlg');
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.lc().m_dlg, r_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:true, title:rstr.createSubCityDlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.createSubCityDlg, this.lc().m_items] );
	};
	
	this.test__setCallers = function(){
		this.lc()._createDlg();
		
		this.mm.mock(this.lc().m_items.resBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.militaryBtn, 'setCaller');
		
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onCreateResCity}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onCreateMilitaryCity}] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'show' );	
	};
	
	this.test__onCreateResCity = function(){
		this.mm.mock(this.lc(), '_sendCreateSubCity');
		this.mm.mock(this.lc(), '_closeDlg');
		this.lc()._onCreateResCity();
		assertEQ ( this.mm.walkLog, '_sendCreateSubCity,_closeDlg' );
		assertEQ ( this.mm.params['_sendCreateSubCity'], [CITY_TYPE.SUBRES] );
	};
	
	this.test__onCreateMilitaryCity = function(){
		this.mm.mock(this.lc(), '_sendCreateSubCity');
		this.mm.mock(this.lc(), '_closeDlg');
		this.lc()._onCreateMilitaryCity();
		assertEQ ( this.mm.walkLog, '_sendCreateSubCity,_closeDlg' );
		assertEQ ( this.mm.params['_sendCreateSubCity'], [CITY_TYPE.SUBARMY] );
	};
	
	this.test__sendCreateSubCity = function(){
		this.mm.mock(CityBuildSender, 'sendCreateSubCity');
		this.mm.mock(CityBuildSender, 'sendChangeSubCity');
		
		this.lc().m_subCityId = 2;
		this.lc().m_createType = 'create';
		this.lc()._sendCreateSubCity(CITY_TYPE.SUBRES);
		assertEQ ( this.mm.walkLog, 'sendCreateSubCity' );
		assertEQ ( this.mm.params['sendCreateSubCity'], [this.g, this.lc().m_subCityId, CITY_TYPE.SUBRES] );
		
		this.mm.clear();
		this.lc().m_createType = 'change';
		this.lc()._sendCreateSubCity(CITY_TYPE.SUBRES);
		assertEQ ( this.mm.walkLog, 'sendChangeSubCity' );
		assertEQ ( this.mm.params['sendChangeSubCity'], [this.g, this.lc().m_subCityId, CITY_TYPE.SUBRES] );
	};
	
	this.test__closeDlg = function(){
		this.lc()._createDlg();
		this.lc().m_dlg.show();
		this.lc()._closeDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
});

tqCreateSubCityDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseCreateSubCityDlg, 'TestCaseCreateSubCityDlg');
};
