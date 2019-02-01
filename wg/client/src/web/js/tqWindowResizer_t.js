require('./tqWindowResizer.js');

TestCaseWindowResizer = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.resizer = WindowResizer.snew(this.g);
		
		this.MAX_W = 2048;
		this.MIN_W = 900;
		this.MAX_H = 1536;
		this.MIN_H = 500;
		this.FRAME_BORDER = 2;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_regPanelSizer = function(){
		this.resizer.regPanelSizer()
		assert ( this.resizer.regPanelSizers[0]  instanceof GlobalBodySizer );
		assert ( this.resizer.regPanelSizers[1]  instanceof MainPanelMapSizer );
		assert ( this.resizer.regPanelSizers[2]  instanceof FarmPanelSizer );
		assert ( this.resizer.regPanelSizers[3]  instanceof MapPanelSizer );
		assert ( this.resizer.regPanelSizers[4]  instanceof InbuildPanelSizer );
		assert ( this.resizer.regPanelSizers[5]  instanceof ChatPanelSizer );
		//assert ( this.resizer.regPanelSizers[6]  instanceof BriefresPanelSizer );
		assert ( this.resizer.regPanelSizers[7]  instanceof QueueMsgBarSizer );
		assert ( this.resizer.regPanelSizers[8]  instanceof NewcomerHelperSizer );
		assert ( this.resizer.regPanelSizers[9]  instanceof SmallMapSizer );
		assert ( this.resizer.regPanelSizers[10]  instanceof ScutbarSizer );
		//assert ( this.resizer.regPanelSizers[11]  instanceof FarmMainToolBarSizer );
		assert ( this.resizer.regPanelSizers[12]  instanceof FarmSecToolBarSizer );
		assert ( this.resizer.regPanelSizers[13]  instanceof FriendDlgSizer );
		assert ( this.resizer.regPanelSizers[14]  instanceof OutFieldPanelSizer );
		assertEQ ( this.resizer.regPanelSizers[15], this.g.getGUI().getSysMsgTipBox());
		assertEQ ( this.resizer.regPanelSizers[17], UIM.getDlg('createrole') );
		assertEQ ( this.resizer.regPanelSizers[18], UIM.getDlg('fightmap') );
		assertEQ ( this.resizer.regPanelSizers[19], UIM.getDlg('imghelp') );
	};	
	
	this.test_init = function(){
		this.resizer.g = null;
		
		var mm = MMock.snew();
		mm.mock(this.g, 'regUpdater' );
		
		this.resizer.init(this.g);
		mm.restore();
		
		assert ( mm.walkLog == 'regUpdater' );
		assert ( this.resizer.g == this.g );
		assertListEQ ( mm.params['regUpdater'], [this.resizer, this.resizer.onUpdate, 1000]);
	};
	
	this.test_onUpdate = function() {
		var mm = MMock.snew();
		mm.mock(this.resizer, 'resize' );
		this.resizer.onUpdate();
		mm.restore();
		assert ( mm.walkLog == 'resize' );
	};
	
	this.test_resize = function() {
		var g_hasMainPanelRt = [false];
		var g_isSizeChangeRt = [false];
		var mm = MMock.snew();
		mm.mock(this.resizer, 'hasMainPanel', g_hasMainPanelRt );
		mm.mock(this.resizer, 'updateCurSize' );
		mm.mock(this.resizer, 'isSizeChange',  g_isSizeChangeRt);
		mm.mock(this.resizer, 'resizeAndPositionAllPanels' );
		mm.mock(this.resizer, 'updateLastSize' );
		
		mm.clear();
		g_hasMainPanelRt[0] = false;
		g_isSizeChangeRt[0] = false;
		this.resizer.resize();
		assert ( mm.walkLog == 'hasMainPanel' );
		
		mm.clear();
		this.resizer.updateTimes = 9;
		g_hasMainPanelRt[0] = true;
		g_isSizeChangeRt[0] = false;
		this.resizer.resize();
		assert ( mm.walkLog == 'hasMainPanel,updateCurSize,isSizeChange,resizeAndPositionAllPanels,updateLastSize' );
		assert ( this.resizer.updateTimes == 10 );
		
		mm.clear();
		g_hasMainPanelRt[0] = true;
		g_isSizeChangeRt[0] = false;
		this.resizer.resize();
		assert ( mm.walkLog == 'hasMainPanel,updateCurSize,isSizeChange' );
		
		mm.clear();
		g_hasMainPanelRt[0] = true;
		g_isSizeChangeRt[0] = true;
		this.resizer.resize();
		assert ( mm.walkLog == 'hasMainPanel,updateCurSize,isSizeChange,resizeAndPositionAllPanels,updateLastSize' );
		
		mm.restore();
	};
	
	this.test_getMaxClientSize = function(){
		var size = this.resizer.getMaxClientSize();
		assert ( size.cx == this.MAX_W );
		assert ( size.cy == this.MAX_H );
	};
	
	this.test_getValidClientSize = function() {
		var g_getWinInnerSizeRt = {cx:100,cy:100};
		var mm = MMock.snew();
		mm.mock(TQ, 'getWinInnerSize', [g_getWinInnerSizeRt] );
		mm.mock(TQ, 'getBrowserScollBarW', [17] );
		mm.mock(TQ, 'getBrowserScollBarH', [17] );
	
		var size = this.resizer.getValidClientSize();
		assert ( size.cx == this.MIN_W );
		assert ( size.cy == this.MIN_H );
		
		g_getWinInnerSizeRt.cx = 100000;
		g_getWinInnerSizeRt.cy = 100000;
		var size = this.resizer.getValidClientSize();
		assert ( size.cx == this.MAX_W );
		assert ( size.cy == this.MAX_H );
		
		mm.restore();
	};
	
	this.test_hasMainPanel = function(){
		var mainPanel_bak = UIM.getPanel('main');
		UIM.forceRegPanel('main', null);
		assert ( this.resizer.hasMainPanel() == false );
		
		UIM.forceRegPanel('main', mainPanel_bak);
		assert ( this.resizer.hasMainPanel() == true );
	};
	
	this.test_updateCurSize = function(){
		this.resizer.curSize = {cx:0, cy:0};
		
		var mm = MMock.snew();
		mm.mock(this.resizer, 'getValidClientSize', [{cx:1, cy:1}] );
		this.resizer.updateCurSize();
		mm.restore();
		
		assert ( this.resizer.curSize.cx == 1 );
		assert ( this.resizer.curSize.cy == 1 );
	};
	
	this.test_isSizeChange = function(){
		this.resizer.lastSize.cx = 0;
		this.resizer.lastSize.cy = 0;
		this.resizer.curSize.cx = 0;
		this.resizer.curSize.cy = 0;
		assert ( this.resizer.isSizeChange() == false );
		
		this.resizer.lastSize.cx = 1;
		this.resizer.lastSize.cy = 0;
		assert ( this.resizer.isSizeChange() == true );
		
		this.resizer.lastSize.cx = 0;
		this.resizer.lastSize.cy = 1;
		assert ( this.resizer.isSizeChange() == true );
	};
	
	this.test_resizeAndPositionAllPanels = function(){
		var g_sizer = PanelSizer.snew();
		this.resizer.regPanelSizers = [];
		this.resizer.regPanelSizers.push(g_sizer);
		this.resizer.regPanelSizers.push(g_sizer);
		
		var mm = MMock.snew();
		mm.mock(g_sizer, 'resize' )
		mm.mock(g_sizer, 'reposition' )
		
		this.resizer.resizeAndPositionAllPanels();
		mm.restore();
		
		assert ( mm.walkLog == 'resize,reposition,resize,reposition' );
	};
	
	this.test_updateLastSize = function() {
		this.resizer.lastSize.cx = 0;
		this.resizer.lastSize.cy = 0;
		this.resizer.curSize.cx = 1;
		this.resizer.curSize.cy = 2;
		
		this.resizer.updateLastSize();
		assert ( this.resizer.lastSize.cx == 0 );
		assert ( this.resizer.lastSize.cy == 0 );
		
		this.resizer.panelActive();
		this.resizer.updateLastSize();
		assert ( this.resizer.lastSize.cx == 1 );
		assert ( this.resizer.lastSize.cy == 2 );
	};
	
	this.test_panelActive = function(){
		assertEQ ( this.resizer.hasActivePanel(), false );
		this.resizer.panelActive();
		assertEQ ( this.resizer.hasActivePanel(), true );
	};
	
	this.test_getCurSize = function() {
		this.resizer.curSize.cx = 1;
		this.resizer.curSize.cy = 2;
		
		var size = this.resizer.getCurSize();
		assert ( size.cx == 1 );
		assert ( size.cy == 2 );
		
		size.cx = 100;
		size.cy = 200;
		
		assert ( this.resizer.curSize.cx == 1 );
		assert ( this.resizer.curSize.cy == 2 );
	};

});


TestCasePanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.resizerMgr = WindowResizer.snew(this.g);
		this.sizer = PanelSizer.snew(this.g, this.resizerMgr);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.sizer.g, this.g );
		assertEQ ( this.sizer.sizerMgr, this.resizerMgr );
	};
	
	this.test_resizeInnerMapPanel = function(){
		var farmView = UIM.getPanel('farm').getView();
		
		var r_isActive = [false];
		var r_isMainBuildPanel = [false];
		this.mm.mock(TQ, 'setDomSize');
		this.mm.mock(farmView, 'resize');
		this.mm.mock(farmView, 'isActive', r_isActive);
		this.mm.mock(farmView, 'resetViewPos');
		this.mm.mock(this.sizer, 'isMainBuildPanel', r_isMainBuildPanel);
		this.mm.mock(this.resizerMgr, 'panelActive');
		
		var size = {cx:100, cy:200};
		this.sizer.resizeInnerMapPanel(farmView, size);
		assertEQ ( this.mm.walkLog, 'setDomSize,setDomSize,resize,isActive,isActive' );
		assertEQ ( this.mm.params['setDomSize.0'], [farmView.getItems().gamemap, size.cx, size.cy] );
		assertEQ ( this.mm.params['setDomSize.1'], [farmView.getItems().mousemap, size.cx, size.cy] );
		assertEQ ( this.mm.params['resize'], [size] );
		
		this.mm.clear();
		r_isActive[0] = true;
		this.sizer.resizeInnerMapPanel(farmView, size);
		assertEQ ( this.mm.walkLog, 'setDomSize,setDomSize,resize,isActive,resetViewPos,isActive,isMainBuildPanel' );
		
		this.mm.clear();
		r_isMainBuildPanel[0] = true;
		this.sizer.resizeInnerMapPanel(farmView, size);
		assertEQ ( this.mm.walkLog, 'setDomSize,setDomSize,resize,isActive,resetViewPos,isActive,isMainBuildPanel,panelActive' );
		assertEQ ( this.mm.params['isMainBuildPanel'], [farmView] );
	};	
	
	this.test_isMainBuildPanel = function(){
		assertEQ ( this.sizer.isMainBuildPanel(null), false );
		assertEQ ( this.sizer.isMainBuildPanel(UIM.getPanel('inbuild')), true );
	};
});

TestCaseGlobalBodySizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		var sizer = GlobalBodySizer.snew();
		sizer.resize( {cx:101, cy:200} );
		
		var gbody = TQ.getUiBody();
		assert ( TQ.getCSS(gbody, 'width') == '101px' );
		assert ( TQ.getCSS(gbody, 'height') == '200px' );
		assert ( TQ.getCSS(gbody, 'top') == '0px' );
		assert ( TQ.getCSS(gbody, 'left') == '0px' );
		
		this.mm.mock(TQ, 'getWinInnerSize', [{cx:2000+2, cy:1000}] );  // 2是边框宽度
		sizer.resize( {cx:1440, cy:900} );
		assert ( TQ.getCSS(gbody, 'left') == ((2002 - 2 -1440)/2) + 'px' );
	};
});

TestCaseMainPanelMapSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.sizer = MainPanelMapSizer.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		this.mm.mock(TQ, 'setDomSize' );

		var size = {cx:1, cy:2};
		this.sizer.resize(size);
		assertEQ ( this.mm.walkLog, 'setDomSize,setDomSize' );
		assertEQ ( this.mm.params['setDomSize.0'], [UIM.getPanel('main').getItems().rootmap, 1, 2] );
		assertEQ ( this.mm.params['setDomSize.1'], [UIM.getPanel('main').getItems().map, 1, 2] );
	};
});

TestCaseFarmPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		var sizer = FarmPanelSizer.snew();
		this.mm.mock(sizer, 'resizeInnerMapPanel');
		sizer.resize({cx:1, cy:2});
		assertEQ ( this.mm.params['resizeInnerMapPanel'], [UIM.getPanel('farm').getView(), {cx:1, cy:2}] );
	};
});

TestCaseMapPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		var sizer = MapPanelSizer.snew();
		this.mm.mock(sizer, 'resizeInnerMapPanel');
		sizer.resize({cx:1, cy:2});
		assertEQ ( this.mm.params['resizeInnerMapPanel'], [UIM.getPanel('statecity'), {cx:1, cy:2}] );
	};
});

TestCaseInbuildPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.sizer = InbuildPanelSizer.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		this.mm.mock(this.sizer, '_resizeMainBuildPanel');
		this.mm.mock(this.sizer, '_resizeSubBuildPanels');
		var size = {cx:1, cy:2};
		this.sizer.resize(size);
		assertEQ ( this.mm.params['_resizeMainBuildPanel'], [size] );
		assertEQ ( this.mm.params['_resizeSubBuildPanels'], [size] );
	};
	
	this.test__resizeMainBuildPanel = function(){
		this.mm.mock(this.sizer, 'resizeInnerMapPanel');
		this.sizer._resizeMainBuildPanel({cx:1, cy:2});
		assertEQ ( this.mm.params['resizeInnerMapPanel'], [UIM.getPanel('inbuild'), {cx:1, cy:2}] );
	};
	
	this.test__resizeSubBuildPanels = function(){
		this.mm.mock(UIM.getPanel('main').getSubCityPanels(), 'getIterator', [DictIterator.snew({'1':'panel1', '2':'panel2'})]);
		this.mm.mock(this.sizer, 'resizeInnerMapPanel');
		var size = {cx:1, cy:2};
		this.sizer._resizeSubBuildPanels(size);
		assertEQ ( this.mm.params['resizeInnerMapPanel.0'], ['panel1', size] );
		assertEQ ( this.mm.params['resizeInnerMapPanel.1'], ['panel2', size] );
	};
});

TestCaseChatPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this._test_reposition = function(){
		this.mm.mock(UIM.getPanel('chat'), 'getSize', [{cx:100, cy:50}] );
		this.mm.mock(UIM.getPanel('chat'), 'setPosition' );
		
		var size = {cx:1000, cy:600};
		var sizer = ChatPanelSizer.snew();
		sizer.reposition(size);
		assertEQ ( this.mm.params['setPosition'], [0, 550] );
	};
});

TestCaseBriefresPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.mapPanel = new function(){
			this.items = {briefres : MockDomEx.snew('div'), chat : MockDomEx.snew('div') };
			this.getItems = function(){
				this.items.briefres.offsetWidth = 500;
				this.items.briefres.offsetHeight = 100;
				this.items.chat.offsetWidth = 100;
				return this.items;
			};
		};
		this.mainPanel_bak = UIM.getPanel('main');
		UIM.forceRegPanel('main', this.mapPanel);
		
		this.sizer = BriefresPanelSizer.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
		UIM.forceRegPanel('main', this.mainPanel_bak);
	};
	
	this.test_reposition = function(){
		var size = {cx:1000, cy:500};
		this.mm.mock(this.sizer, 'getBriefBarPos', [{x:1, y:2}]);
		this.mm.mock(TQ, 'setDomPos');
		this.sizer.reposition(size);
		assertEQ ( this.mm.walkLog, 'getBriefBarPos,setDomPos' );
		assertEQ ( this.mm.params['getBriefBarPos'], [size] );
		if ( !TQ.isMobile() ) {
			assertEQ ( this.mm.params['setDomPos'], [UIM.getPanel('main').getItems().briefres, 1, 2] );
		}
	};	
	
	this.test_getBriefBarPos = function(){
		this.mm.mock(this.sizer, '_getBriefBarX', [10]);
		
		var W_H = 75;
		var size = {cx:1000, cy:500};
		assertEQ ( this.sizer.getBriefBarPos(size), {x:10, y:500-W_H} );
		assertEQ ( this.mm.params['_getBriefBarX'], [size] );
	};
	
	this.test__getBriefBarX = function(){
		var W_SPACE = 10;
		var W_W = 656;
		
		var size = {cx:2000, cy:1000};
		assertEQ ( this.sizer._getBriefBarX(size), (2000-W_W)/2 );
		
		size = {cx:200, cy:1000};
		assertEQ ( this.sizer._getBriefBarX(size), this.sizer._getChatPanelWidth() + W_SPACE );
	};
	
	this.test__getChatPanelWidth = function() {
		assert ( this.sizer._getChatPanelWidth() == UIM.getPanel('chat').getSize().cx );
	};	
});

TestCaseQueueMsgBarSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		var sizer = QueueMsgBarSizer.snew();
		this.mm.mock(sizer.briefSizer, 'getBriefBarPos', [{x:10, y:20}]);
		this.mm.mock(UIM.getPanel('main').getQueueMsgBar(), 'setPosition');
		this.mm.mock(UIM.getPanel('main').getQueueMsgBar(), 'setSize');
		
		var size = {cx:1000, cy:600};
		sizer.reposition(size);
		assertEQ ( this.mm.params['getBriefBarPos'], [size] );
		assertEQ ( this.mm.params['setPosition'], [{x:10, y:20-55}] );
		assertEQ ( this.mm.params['setSize'], [{cx:350, cy:30}] );
	};
});

TestCaseNewcomerHelperSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		var sizer = NewcomerHelperSizer.snew();
		this.mm.mock(sizer.briefSizer, 'getBriefBarPos', [{x:10, y:20}]);
		this.mm.mock(UIM.getDlg('newcomerhelper'), 'setPosition');
		
		var size = {cx:1000, cy:600};
		sizer.reposition(size);
		assertEQ ( this.mm.params['getBriefBarPos'], [size] );
		assertEQ ( this.mm.params['setPosition'], [{x:400, y:-50}] );
	};
});

TestCaseSmallMapSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		var sizer = SmallMapSizer.snew();
		this.mm.mock(sizer, 'respositionSmallmap');
		this.mm.mock(sizer, 'respositionBtns');
		this.mm.mock(sizer, 'respositionFieldToolBar');
		
		var size = {cx:1, cy:2};
		sizer.reposition(size);
		assertEQ ( this.mm.walkLog, 'respositionSmallmap,respositionBtns,respositionFieldToolBar' );
		assertEQ ( this.mm.params['respositionSmallmap'], [size] );
		assertEQ ( this.mm.params['respositionBtns'], [size] );
		assertEQ ( this.mm.params['respositionFieldToolBar'], [size] );
	};
	
	this.test_respositionSmallmap = function(){
		var sizer = SmallMapSizer.snew();
		this.mm.mock(TQ, 'setCSS');
		
		var p_size = {cx:1000, cy:800};
		sizer.respositionSmallmap(p_size);
		var smallMapSize = UIM.getPanel('smallmap').getMapSize();
		assertEQ ( this.mm.params['setCSS'], [UIM.getPanel('main').getItems().smallmap, 'left', (1000 - smallMapSize.cx) + 'px'] );
	};
	
	this.test_respositionBtns = function(){
		var sizer = SmallMapSizer.snew();
		var smallMapSize = UIM.getPanel('smallmap').getMapSize();
		var p_size = {cx:1000, cy:800};
		var x = p_size.cx - smallMapSize.cx - UIM.getPanel('main').getSmallMapBtnBar().getBtnSize().cx;
		if ( !TQ.isMobile() ) {
			sizer.respositionBtns(p_size);
			assertEQ ( TQ.getCSS(UIM.getPanel('main').getItems().smbtn_shop.getParent(), 'left'), x + 'px' );
			assertEQ ( TQ.getCSS(UIM.getPanel('main').getItems().smbtn_rank.getParent(), 'left'), x + 'px' );
			assertEQ ( TQ.getCSS(UIM.getPanel('main').getItems().smbtn_letter.getParent(), 'left'), x + 'px' );
			assertEQ ( TQ.getCSS(UIM.getPanel('main').getItems().smbtn_exchange.getParent(), 'left'), x + 'px' );
			assertEQ ( TQ.getCSS(UIM.getPanel('main').getItems().smbtn_toggle_bgsound.getParent(), 'left'), x + 'px' );
		}
	};
	
	this.test_respositionFieldToolBar = function(){
		var sizer = SmallMapSizer.snew();
		var smallMapSize = UIM.getPanel('smallmap').getMapSize();
		var p_size = {cx:1000, cy:800};
		sizer.respositionFieldToolBar(p_size);
		if ( !TQ.isMobile() ) {
			assertEQ ( TQ.getDomPos(UIM.getPanel('main').getItems().outFieldToolBar), {x:p_size.cx - smallMapSize.cx, y:smallMapSize.cy} );
		}
	};
});

TestCaseScutbarSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		this.mm.mock(TQ, 'setCSS' );
		this.mm.mock(UIM.getDlg('buildingtrace'), 'setPosition');
		ScutbarSizer.snew().reposition({cx:1000, cy:600});
		if ( !TQ.isMobile() ) {
			assertEQ ( this.mm.params['setCSS'], [UIM.getPanel('main').getItems().scutbar, 'left', (1000-404) + 'px'] );
			var dlgSize = UIM.getDlg('buildingtrace').getSize();
			assertEQ ( this.mm.params['setPosition'], [{x:1000-404 + 115 - dlgSize.cx + 39 + 36, y:49}] );
		}
	};
});

TestCaseFarmMainToolBarSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.sizer = FarmMainToolBarSizer.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		this.mm.mock(this.sizer, 'getMainToolBarPos', [{x:1, y:2}]);
		this.mm.mock(UIM.getPanel('farm').getView(), 'setMainToolBarPos');
		var size = {cx:1000, cy:500};
		this.sizer.reposition(size);
		assertEQ ( this.mm.params['getMainToolBarPos'], [size]);
		assertEQ ( this.mm.params['setMainToolBarPos'], [{x:1, y:2}]);
	};
	
	this.test_getMainToolBarPos = function(){
		this.mm.mock(this.sizer, '_getMainToolBarX', [10]);
		
		var W_H = UIM.getPanel('farm').getView().getMainToolBarSize().cy;
		var size = {cx:1000, cy:500};
		assertEQ ( this.sizer.getMainToolBarPos(size), {x:10, y:500-W_H} );
		assertEQ ( this.mm.params['_getMainToolBarX'], [size] );
	};
	
	this.test__getMainToolBarX = function(){
		var W_SPACE = 10;
		var toolBarW = UIM.getPanel('farm').getView().getMainToolBarSize().cx;
		
		var size = {cx:2000, cy:1000};
		assertEQ ( this.sizer._getMainToolBarX(size), (2000-toolBarW)/2 );
		
		size = {cx:200, cy:1000};
		assertEQ ( this.sizer._getMainToolBarX(size), this.sizer._getChatPanelWidth() + W_SPACE );
	};
	
	this.test__getChatPanelWidth = function() {
		assert ( this.sizer._getChatPanelWidth() == UIM.getPanel('chat').getSize().cx );
	};	
});

TestCaseFarmSecToolBarSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.sizer = FarmSecToolBarSizer.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		var W_SPACE = 10;
		this.mm.mock(this.sizer.mainToolBarSizer, 'getMainToolBarPos', [{x:1, y:2}]);
		this.mm.mock(UIM.getPanel('farm').getView(), 'setSecToolBarPos');
		
		var size = {cx:1000, cy:500};
		this.sizer.reposition(size);
		assertEQ ( this.mm.params['getMainToolBarPos'], [size]);
		assertEQ ( this.mm.params['setSecToolBarPos'], [{x:1 + UIM.getPanel('farm').getView().getMainToolBarSize().cx + W_SPACE, y:500-UIM.getPanel('farm').getView().getSecToolBarSize().cy}]);
	};
});

TestCaseFriendDlgSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_reposition = function(){
		this.mm.mock(UIM.getDlg('friend'), 'resetPos' );
		FriendDlgSizer.snew().reposition();
		assertEQ ( this.mm.walkLog, 'resetPos' );
	};
});

TestCaseOutFieldPanelSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		var sizer = OutFieldPanelSizer.snew();
		this.mm.mock(sizer, 'resizeInnerMapPanel');
		sizer.resize({cx:1, cy:2});
		assertEQ ( this.mm.params['resizeInnerMapPanel'], [UIM.getPanel('field'), {cx:1, cy:2}] );
	};

});

TestCaseGameSuggestBtnSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		var sizer = GameSuggestBtnSizer.snew();
		sizer.reposition({cx:1000, cy:600});
		var dom = UIM.getPanel('main').getItems().gameSuggestBtn.getParent();
		if ( !TQ.isMobile() ) {
			assertEQ ( TQ.getDomPos(dom), {x:721, y:600-130} );
		}
	};

});

tqWindowResizer_t_main = function(suite) {
	suite.addTestCase(TestCaseWindowResizer, 'TestCaseWindowResizer');
	
	suite.addTestCase(TestCasePanelSizer, 'TestCasePanelSizer');
	suite.addTestCase(TestCaseGlobalBodySizer, 'TestCaseGlobalBodySizer');
	suite.addTestCase(TestCaseMainPanelMapSizer, 'TestCaseMainPanelMapSizer');
	suite.addTestCase(TestCaseFarmPanelSizer, 'TestCaseFarmPanelSizer');
	suite.addTestCase(TestCaseMapPanelSizer, 'TestCaseMapPanelSizer');
	suite.addTestCase(TestCaseInbuildPanelSizer, 'TestCaseInbuildPanelSizer');
	suite.addTestCase(TestCaseChatPanelSizer, 'TestCaseChatPanelSizer');
	suite.addTestCase(TestCaseBriefresPanelSizer, 'TestCaseBriefresPanelSizer');
	suite.addTestCase(TestCaseQueueMsgBarSizer, 'TestCaseQueueMsgBarSizer');
	suite.addTestCase(TestCaseNewcomerHelperSizer, 'TestCaseNewcomerHelperSizer');
	suite.addTestCase(TestCaseSmallMapSizer, 'TestCaseSmallMapSizer');
	suite.addTestCase(TestCaseScutbarSizer, 'TestCaseScutbarSizer');
	suite.addTestCase(TestCaseFarmMainToolBarSizer, 'TestCaseFarmMainToolBarSizer');
	suite.addTestCase(TestCaseFarmSecToolBarSizer, 'TestCaseFarmSecToolBarSizer');
	suite.addTestCase(TestCaseFriendDlgSizer, 'TestCaseFriendDlgSizer');
	suite.addTestCase(TestCaseOutFieldPanelSizer, 'TestCaseOutFieldPanelSizer');
	suite.addTestCase(TestCaseGameSuggestBtnSizer, 'TestCaseGameSuggestBtnSizer');
};
