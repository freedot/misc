requireEx('./handler/tqSmallMapPanel.js', [
	{
		start:'//SmallViewmap-unittest-start'
		,end:'//SmallViewmap-unittest-end'
		,items:['m_g'
			,'m_viewblock'
			,'_setViewportSize'
			,'_setViewBockSize'
			]
	}
	,{
		start:'//SmallMapPanel-unittest-start'
		,end:'//SmallMapPanel-unittest-end'
		,items:['m_items'
			,'_initParams'
			,'_createUIItems'
			,'_callSuperInit'
			]
	}
])

TestCaseSmallViewmap = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var items = {};
		this.g.getGUI().initPanel(UIM.getPanel('main').getItems().smallmap, uicfg.main.smallmap, items);
		this.sview = SmallViewmap.snew(this.g, items.smallmap, items.smap_viewblock, items.smap_event);
		this.lc = this.sview.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setViewportSize = function(){
		this.mm.mock(this.lc(), '_setViewportSize');
		this.mm.mock(this.lc(), '_setViewBockSize');
		this.sview.setViewportSize({cx:1, cy:2});
		assertEQ ( this.mm.walkLog, '_setViewportSize,_setViewBockSize' );
		assertEQ ( this.mm.params['_setViewportSize'], [{cx:1, cy:2}] );
	};
	
	this.test__setViewportSize = function(){
		this.lc()._setViewportSize({cx:1, cy:2});
		assertEQ ( this.sview.getViewport().w, 1 );
		assertEQ ( this.sview.getViewport().h, 2 );
	};
	
	this.test__setViewBockSize = function(){
		this.mm.mock(TQ, 'setDomSize');
		
		this.lc()._setViewportSize({cx:1, cy:2});
		this.lc()._setViewBockSize();
		assertEQ ( this.mm.params['setDomSize'], [this.lc().m_viewblock, 5, 5] );
		
		this.lc()._setViewportSize({cx:6, cy:7});
		this.lc()._setViewBockSize();
		assertEQ ( this.mm.params['setDomSize'], [this.lc().m_viewblock, 6, 7] );
	};
});

TestCaseSmallMapPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.panel = SmallMapPanel.snew(this.g, UIM.getPanel('main').getItems().smallmap);
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_createUIItems');
		this.mm.mock(this.lc(), '_callSuperInit');
		this.mm.mock(this.panel, 'setMapPixelSize');
		this.panel.init(this.g, UIM.getPanel('main').getItems().smallmap);
		assertEQ ( this.mm.walkLog, '_initParams,_createUIItems,_callSuperInit,setMapPixelSize' );
		assertEQ ( this.mm.params['_initParams'], [this.panel, this.g, UIM.getPanel('main').getItems().smallmap] );
		assertEQ ( this.mm.params['setMapPixelSize'], [{cx:137, cy:115}] );
	};
	
	this.test_getMapSize = function(){
		assertEQ ( this.panel.getMapSize(), {cx:149, cy:146});
	};
	
	this.test_getMapEventDom = function(){
		this.lc().m_items = {};
		this.g.getGUI().initPanel(UIM.getPanel('main').getItems().smallmap, uicfg.main.smallmap, this.lc().m_items);
		assertEQ ( this.panel.getMapEventDom(), this.lc().m_items.smap_event);
	};
});

tqSmallMapPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseSmallViewmap, 'TestCaseSmallViewmap');
	suite.addTestCase(TestCaseSmallMapPanel, 'TestCaseSmallMapPanel');
};
