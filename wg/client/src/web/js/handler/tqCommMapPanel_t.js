/*******************************************************************************/
requireEx('./handler/tqCommMapPanel.js', [
	{
		start:'//CommMapPanel-unittest-start'
		,end:'//CommMapPanel-unittest-end'
		,items:['m_gamemap'
			,'m_smallmap'
			,'_resetSmallMap'
			,'_loadMap'
			]
	}
]);

TestCaseCommMapPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.commMapPanel = CommMapPanel.snew(this.g, MockDomEx.snew('div'));
		this.commMapPanel.create();
		this.lc = this.commMapPanel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_loadMap = function(){
		this.mm.mock(this.commMapPanel, 'setName');
		this.mm.mock(this.commMapPanel, 'setActive');
		this.mm.mock(this.lc(), '_loadMap');
		this.commMapPanel.loadMap(1, 'statecity');
		assertEQ ( this.mm.walkLog, 'setName,setActive,_loadMap' );
		assertEQ ( this.mm.params['setName'], ['statecity'] );
		assertEQ ( this.mm.params['setActive'], [true] );
		assertEQ ( this.mm.params['_loadMap'], [1] );
	};
	
	this.test_resize = function(){
		var g_size = {cx:100, cy:200};
		var g_viewPort = {x:10, y:20};
		this.mm.mock(this.lc().m_gamemap, 'setViewportSize');
		
		this.commMapPanel.resize(g_size);
		assertEQ ( this.mm.walkLog, 'setViewportSize' );
		assertEQ ( this.mm.params['setViewportSize'], [g_size] );
		
		this.mm.clear();
		this.lc().m_gamemap = null;
		this.commMapPanel.resize(g_size);
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_setActive = function(){
		this.commMapPanel.setActive(false);
		assertEQ ( this.commMapPanel.isActive(), false);
		this.commMapPanel.setActive(true);
		assertEQ ( this.commMapPanel.isActive(), true);
	};
	
	this.test_resetViewPos = function(){
		var g_size = {cx:100, cy:200};
		var g_viewPort = {x:10, y:20};
		this.mm.mock(this.lc(), '_resetSmallMap' );
		this.mm.mock(this.lc().m_gamemap, 'getViewport', [g_viewPort] );
		this.mm.mock(this.lc().m_gamemap, 'setViewportPos' );
		this.mm.mock(this.lc().m_smallmap, 'setViewportPos' );
		
		this.commMapPanel.resetViewPos();
		assertEQ ( this.mm.walkLog, 'getViewport,setViewportPos,_resetSmallMap,setViewportPos' );
		assertEQ ( this.mm.params['setViewportPos.0'], [{x:10, y:20}] );
		assertEQ ( this.mm.params['setViewportPos.1'], [this.lc().m_smallmap.convertLTSPos({x:10, y:20})] );
	};
	
	this.test_isDragged = function(){
		var r_mouseCoords = [{x:95, y:205}];
		this.mm.mock( this.lc().m_gamemap, 'getMouseDownPos', [{x:100, y:200}] );
		this.mm.mock( TQ, 'mouseCoords', r_mouseCoords );
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), false);
		assertEQ ( this.mm.params['mouseCoords'], [{name:'event'}] );
		
		r_mouseCoords[0] = {x:105, y:195};
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), false);
		
		r_mouseCoords[0] = {x:109, y:192};
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), true);
		
		r_mouseCoords[0] = {x:108, y:191};
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), true);
		
		r_mouseCoords[0] = {x:91, y:208};
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), true);
		
		r_mouseCoords[0] = {x:92, y:209};
		assertEQ ( this.commMapPanel.isDragged({name:'event'}), true);
	};
});

tqCommMapPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseCommMapPanel, 'TestCaseCommMapPanel');
};
