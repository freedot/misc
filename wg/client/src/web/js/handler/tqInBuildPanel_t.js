/*******************************************************************************/
requireEx('./handler/tqInBuildPanel.js', [
	{
		start:'//InBuildPanel-unittest-start'
		,end:'//InBuildPanel-unittest-end'
		,items:[
			'C_POSS'
			,'m_g'
			,'m_this'
			,'m_cityId'
			,'m_commBuildPanel'
			,'_onLoginOk'
			,'_onSetCityLevel'
			,'_onSvrPkg'
			,'_getBlocksCanUseCnt'
		]
	}
]);

TestCaseInBuildPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mm.nologMock( this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:600}] );
		this.panel = InBuildPanel.snew(this.g, MockDom.snew());
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var r_commBuildPanel = new function(){ this.setFirstPos=function(){}; };
		this.mm.mock ( CommBuildPanel, 'snew', [r_commBuildPanel] );
		this.mm.mock ( this.g, 'regEvent' );
		this.mm.mock ( r_commBuildPanel, 'setFirstPos' );
		
		var x = Math.max(0, 1200 - 1000);
		var y = 430;
		
		var p_dom = MockDom.snew();
		this.panel.init ( this.g, p_dom);
		assertEQ ( this.mm.walkLog, 'snew,setFirstPos,regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['setFirstPos'], [{x:x,y:y}] );
		assertEQ ( this.mm.params['snew'], [this.g, p_dom, {cityResId:FIXID.MAINCITY, mapTitle:rstr.citylist.maincity, canUseBlockCnt:this.lc().C_POSS.length, blockPoss:this.lc().C_POSS, cityId:BUILDCITY_ID.MAIN}] );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.panel, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.SETCITYLEVEL, 0, this.panel, this.lc()._onSetCityLevel] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.NET, NETCMD.BUILDRES, this.panel, this.lc()._onSvrPkg] );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_commBuildPanel, r_commBuildPanel );
		assertEQ ( this.lc().m_cityId, BUILDCITY_ID.MAIN);
	};
	
	this.test_open = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'open' );
		this.mm.mock ( this.lc(), '_getBlocksCanUseCnt', [1] );
		this.mm.mock ( this.lc().m_commBuildPanel, 'setBlocksCanUseCnt' );
		this.panel.open();
		assertEQ ( this.mm.walkLog, 'open,_getBlocksCanUseCnt,setBlocksCanUseCnt' );
		assertEQ ( this.mm.params['setBlocksCanUseCnt'], [1] );
	};
	
	this.test_hide = function(){
		this.mm.mock ( this.lc().m_commBuildPanel, 'hide' );
		this.panel.hide();
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
		this.mm.mock(this.lc().m_commBuildPanel, 'resize');
		
		var size = {cx:1, cy:2};
		this.panel.resize(size);
		assertEQ ( this.mm.params['resize'], [size] );
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
	
	this.test_getCityType = function(){
		assertEQ ( this.panel.getCityType(), CITY_TYPE.MAIN );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock( CityBuildSender, 'sendGetAllBuilds' );
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['sendGetAllBuilds'], [this.g, BUILDCITY_ID.MAIN] );
	};
	
	this.test__onSetCityLevel = function(){
		this.mm.mock ( this.lc(), '_getBlocksCanUseCnt', [1] );
		this.mm.mock ( this.lc().m_commBuildPanel, 'setBlocksCanUseCnt' );
		this.lc()._onSetCityLevel();
		assertEQ ( this.mm.walkLog, '_getBlocksCanUseCnt,setBlocksCanUseCnt' );
		assertEQ ( this.mm.params['setBlocksCanUseCnt'], [1] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock( this.lc().m_commBuildPanel, 'handleSvrBuildsData');
		this.mm.mock ( this.lc().m_commBuildPanel, 'open' );
		this.mm.mock ( this.g, 'sendEvent' );
		this.mm.mock ( g_loading, 'hide' );
		
		var p_netEvent = {data:{}};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds = {};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds.cityId = 2;
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, '' );
			
		p_netEvent.data.builds.cityId = 1;
		p_netEvent.data.builds.list = [];
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, 'handleSvrBuildsData' );
		assertEQ ( this.mm.params['handleSvrBuildsData'], [p_netEvent.data.builds.list] );
		
		this.mm.clear();
		p_netEvent = {data:{openMainCity:1}};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.mm.walkLog, 'open,hide' );
		
		this.mm.clear();
		p_netEvent = {data:{cityTypes:[1,2,3,2]}};
		this.lc()._onSvrPkg(p_netEvent);
		assertEQ ( this.g.getImgr().getCityTypes(), [1,2,3,2]);
		assertEQ ( this.mm.walkLog, 'sendEvent' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.CITYTYPES,sid:0}] );
	};
	
	this.test__getBlocksCanUseCnt = function(){
		this.mm.mock(this.g.getImgr(), 'getCityLevel', [1]);
		this.mm.mock(CityLevelUtil, 'getBlocksCntByCityLevel', [10]);
		assertEQ ( this.lc()._getBlocksCanUseCnt(), 10 );
		assertEQ ( this.mm.params['getBlocksCntByCityLevel'], [1] );
	};
});

tqInBuildPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseInBuildPanel, 'TestCaseInBuildPanel');
};
