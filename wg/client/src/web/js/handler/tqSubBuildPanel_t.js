/*******************************************************************************/
requireEx('./handler/tqSubBuildPanel.js', [
	{
		start:'//SubBuildPanel-unittest-start'
		,end:'//SubBuildPanel-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_cityId'
			,'m_commBuildPanel'
			,'_onSvrPkg'
		]
	}
]);

TestCaseSubBuildPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var p_dom = MockDom.snew();
		var p_params = {cityResId:FIXID.SUBRESCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:0, blockPoss:[], cityId:2};
		this.panel = SubBuildPanel.snew(this.g, p_dom, p_params);
		this.lc = this.panel.lc;		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var r_commBuildPanel = {id:1, setCanShowFlag:function(){}};
		this.mm.mock ( CommBuildPanel, 'snew', [r_commBuildPanel] );
		this.mm.mock ( this.g, 'regEvent' );
		
		var p_dom = MockDom.snew();
		var p_params = {cityResId:FIXID.SUBRESCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:0, blockPoss:[], cityId:2};
		this.panel.init ( this.g, p_dom, p_params);
		assertEQ ( this.mm.walkLog, 'snew,regEvent' );
		assertEQ ( this.mm.params['snew'], [this.g, p_dom, p_params] );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.BUILDRES, this.panel, this.lc()._onSvrPkg] );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_commBuildPanel, r_commBuildPanel );
		assertEQ ( this.lc().m_cityId, 2);
	};
	
	this.test_open = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'open' );
		this.panel.open();
		assertEQ ( this.mm.walkLog, 'open' );
	};
	
	this.test_hide = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'hide' );
		this.panel.hide();
		assertEQ ( this.mm.walkLog, 'hide' );
	};
	
	this.test_destroy = function(){
		this.mm.mock ( this.panel, 'hide' );
		this.panel.destroy();
		assertEQ ( this.mm.walkLog, 'hide' );
	};
	
	this.test_opSpeed = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'opSpeed' );
		var p_item = {id:1};
		this.panel.opSpeed(p_item);
		assertEQ ( this.mm.params['opSpeed'], [p_item] );
	};
	
	this.test_opCancel = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'opCancel' );
		var p_item = {id:1};
		this.panel.opCancel(p_item);
		assertEQ ( this.mm.params['opCancel'], [p_item] );
	};
	
	this.test_resize = function(){
		this.mm.mock( this.lc().m_commBuildPanel, 'resize' );
		this.panel.resize({cx:1, cy:2});
		assertEQ ( this.mm.params['resize'], [{cx:1, cy:2}] );
	};
	
	this.test_setActive = function(){
		this.mm.mock(this.lc().m_commBuildPanel, 'setActive');
		this.panel.setActive(true);
		assertEQ ( this.mm.params['setActive'], [true] );	
	};
	
	this.test_isActive = function(){
		this.mm.mock(this.lc().m_commBuildPanel, 'isActive', [true]);
		assertEQ ( this.panel.isActive(), true );	
	};
	
	this.test_resetViewPos = function(){
		this.mm.mock(this.lc().m_commBuildPanel, 'resetViewPos');
		this.panel.resetViewPos();
		assertEQ ( this.mm.walkLog, 'resetViewPos' );	
	};
	
	this.test_getItems = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'getItems', [{name:'items'}] );
		assertEQ ( this.panel.getItems(), {name:'items'} );
		assertEQ ( this.mm.walkLog, 'getItems' );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock( this.lc().m_commBuildPanel, 'handleSvrBuildsData');
		
		var p_netEvent = {data:{}};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds = {};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds.cityId = 1;
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds.cityId = 2;
		p_netEvent.data.builds.list = [];
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, 'handleSvrBuildsData' );
		assertEQ ( this.mm.params['handleSvrBuildsData'], [p_netEvent.data.builds.list] );
	};
});

TestCaseResSubBuildPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.p_dom = MockDom.snew();
		this.p_cityId = 2;
		this.panel = ResSubBuildPanel.snew(this.g, this.p_dom, this.p_cityId);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.panel.Super, 'init');
		this.panel.init ( this.g, this.p_dom, this.p_cityId );
		
		var params = {cityResId:FIXID.SUBRESCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:this.panel.C_POSS.length, blockPoss:this.panel.C_POSS, cityId:this.p_cityId};
		assertEQ ( this.mm.params['init'], [this.g, this.p_dom, params] );
	};
	
	this.test_getCityType = function(){
		assertEQ ( this.panel.getCityType(), CITY_TYPE.SUBRES );
	};
});

TestCaseMilitarySubBuildPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.p_dom = MockDom.snew();
		this.p_cityId = 2;
		this.panel = MilitarySubBuildPanel.snew(this.g, this.p_dom, this.p_cityId);		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.panel.Super, 'init');
		this.panel.init ( this.g, this.p_dom, this.p_cityId );
		
		var params = {cityResId:FIXID.SUBARMYCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:this.panel.C_POSS.length, blockPoss:this.panel.C_POSS, cityId:this.p_cityId};
		assertEQ ( this.mm.params['init'], [this.g, this.p_dom, params] );
	};
	
	this.test_getCityType = function(){
		assertEQ ( this.panel.getCityType(), CITY_TYPE.SUBARMY );
	};
});

tqSubBuildPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseSubBuildPanel, 'TestCaseSubBuildPanel');
	suite.addTestCase(TestCaseResSubBuildPanel, 'TestCaseResSubBuildPanel');
	suite.addTestCase(TestCaseMilitarySubBuildPanel, 'TestCaseMilitarySubBuildPanel');
};
