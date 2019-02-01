
requireEx('./ui/tqTooltip.js', [
	{
		start:'//Tip-unittest-start'
		,end:'//Tip-unittest-end'
		,items:['m_g'
			,'m_dom'
			,'m_lastPos'
			,'C_THPACE'
			,'C_TWOTIP_WSPACE'
			,'m_setok'
			,'m_tipMsgs'
			,'m_caller'
			,'_init'
			,'_setTipContent'
			,'_isEmptyTipMsg'
			,'_initTipMsgsListByCaller'
			,'_hideTip'
			,'_showTip'
			,'_getAllTipsSize'
			,'_getTipsOffsetLeftW'
			,'_getAllTipsPoss'
			,'_destroy'
			,'_onMouseOver'
			,'_onMouseOut'
			,'_onMouseMove'
			,'_innerShowTip'
			,'_startTimer'
			,'_stopTimer'
			,'_setTipContentAndShow'
			,'_onTimer'
			]
	}
	,{
		start:'//TooltipPanel-unittest-start'
		,end:'//TooltipPanel-unittest-end'
		,items:['m_g'
			,'C_HSPACE'
			,'C_WSPACE'
			,'m_frontPanel'
			,'m_backPanel'
			,'_create'
			,'_removeLastChilds'
			,'_setContent'
			,'_resetBackPanelSize'
			,'_createBack'
			]
	}
	,{
		start:'//Tooltip-unittest-start'
		,end:'//Tooltip-unittest-end'
		,items:['m_g'
			]
	}
]);
	
	
TestCaseTip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tip = new Tip(this.g, TTIP, MockDomEx.snew('div'), 'msg', null);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(TQ, 'addEvent');
		
		this.tip.lc()._init();
		assert ( this.mm.walkLog == 'addEvent,addEvent,addEvent' );
		assertListEQ ( this.mm.params['addEvent.0'], [this.tip.lc().m_dom, 'mouseover', this.tip.lc()._onMouseOver] );
		assertListEQ ( this.mm.params['addEvent.1'], [this.tip.lc().m_dom, 'mouseout', this.tip.lc()._onMouseOut] );
		assertListEQ ( this.mm.params['addEvent.2'], [this.tip.lc().m_dom, 'mousemove', this.tip.lc()._onMouseMove] );	
	};
	
	this.test_show = function(){
		this.mm.mock(this.tip.lc(), '_startTimer' );
		this.mm.mock(this.tip.lc(), '_setTipContentAndShow' );
		this.tip.show({x:1, y:2});
		assertEQ ( this.mm.params['_startTimer'], [] );
		assertEQ ( this.mm.params['_setTipContentAndShow'], [{x:1, y:2}] );
	};
	
	this.test_onMouseOver = function(){
		var e = {};
		this.mm.mock(this.tip.lc(), '_innerShowTip');
		
		this.tip.setFlag(1);
		this.tip.lc()._onMouseOver(e);
		assert ( this.mm.walkLog == '' );
		
		this.tip.setFlag(0);
		this.tip.lc()._onMouseOver(e);
		assert ( this.mm.walkLog == '_innerShowTip' );
		assertListEQ ( this.mm.params['_innerShowTip'], [e]);
	};
	
	this.test_onMouseMove = function(){
		var e = {};
		this.mm.mock(this.tip.lc(), '_innerShowTip');
		
		this.tip.setFlag(1);
		this.tip.lc()._onMouseMove(e);
		assert ( this.mm.walkLog == '' );
		
		this.tip.setFlag(0);
		this.tip.lc()._onMouseMove(e);
		assert ( this.mm.walkLog == '_innerShowTip' );	
		assertListEQ ( this.mm.params['_innerShowTip'], [e]);
	};
	
	this.test_onMouseOut = function(){
		var e = {};
		this.mm.mock(this.tip.lc(), '_hideTip');
		this.mm.mock(TQ, 'stopPropagation');
	
		this.tip.setFlag(1);
		this.tip.lc()._onMouseOut(e);
		assert ( this.mm.walkLog == '' );
		
		this.tip.setFlag(0);
		this.tip.lc()._onMouseOut(e);
		assert ( this.mm.walkLog == '_hideTip,stopPropagation' );
		assertListEQ ( this.mm.params['stopPropagation'], [e]);
	};
	
	this.test_innerShowTip = function(){
		var g_isEmptyTipMsgRt = [true];
		var g_mouseCoordsRt = [{x:1, y:2}];
		var e = {};
		
		this.mm.mock(this.tip.lc(), '_startTimer');
		this.mm.mock(this.tip.lc(), '_setTipContent');
		this.mm.mock(this.tip.lc(), '_isEmptyTipMsg', g_isEmptyTipMsgRt);
		this.mm.mock(TQ, 'mouseCoords', g_mouseCoordsRt);
		this.mm.mock(this.tip.lc(), '_showTip');
		this.mm.mock(TQ, 'stopPropagation');
		
		this.tip.lc()._innerShowTip(e);		
		assert ( this.mm.walkLog == '_startTimer,mouseCoords,_setTipContent,_isEmptyTipMsg,stopPropagation' );
		assertListEQ ( this.mm.params['stopPropagation'], [e]);
		
		this.mm.clear();
		g_isEmptyTipMsgRt[0] = false;
		this.tip.lc()._innerShowTip(e);		
		assert ( this.mm.walkLog == '_startTimer,mouseCoords,_setTipContent,_isEmptyTipMsg,_showTip,stopPropagation' );
		assertListEQ ( this.mm.params['_showTip'], [ g_mouseCoordsRt[0] ]);
		assertListEQ ( this.mm.params['stopPropagation'], [e]);
	};

	this.test_setTipContent = function(){
		var g_isEmptyTipMsgRt = [true];
		this.mm.mock(this.tip.lc(), '_initTipMsgsListByCaller' );
		this.mm.mock(this.tip.lc(), '_isEmptyTipMsg', g_isEmptyTipMsgRt );
		this.mm.mock(TTIP, 'setTipContent' );
		
		this.tip.lc().m_setok = true;
		this.tip.lc()._setTipContent();
		assert ( this.mm.walkLog == '' );
		
		this.mm.clear();
		this.tip.lc().m_setok = false;
		this.tip.lc()._setTipContent();
		assert ( this.mm.walkLog == '_initTipMsgsListByCaller,_isEmptyTipMsg' );
		assert ( this.tip.lc().m_setok == false );
		
		this.mm.clear();
		this.tip.lc().m_setok = false;
		g_isEmptyTipMsgRt[0] = false;
		this.tip.lc().m_tipMsgs = ['msg1','msg2'];
		this.tip.lc()._setTipContent();
		assert ( this.mm.walkLog == '_initTipMsgsListByCaller,_isEmptyTipMsg,setTipContent,setTipContent' );
		assertListEQ ( this.mm.params['setTipContent.0'], [0, 'msg1', this.tip] );
		assertListEQ ( this.mm.params['setTipContent.1'], [1, 'msg2', this.tip] );
	};
	
	this.test_isEmptyTipMsg = function(){
		this.tip.lc().m_tipMsgs.length = 0;
		assert ( this.tip.lc()._isEmptyTipMsg() == true );
		
		this.tip.lc().m_tipMsgs.length = 1;
		assert ( this.tip.lc()._isEmptyTipMsg() == false );
	};
	
	this.test_initTipMsgsListByCaller = function(){
		this.tip.lc().m_tipMsgs.length = 0;
		
		this.tip.lc()._initTipMsgsListByCaller();
		assert ( this.tip.lc().m_tipMsgs.length == 0 );
		
		var g_retMsg = '';
		var getContentCaller = function(data) {
			return g_retMsg;
		}
		this.tip.setCaller({self:this.tip, caller:getContentCaller})
		
		this.tip.lc()._initTipMsgsListByCaller();
		assert ( this.tip.lc().m_tipMsgs.length == 0 );
		
		g_retMsg = {};
		this.tip.lc()._initTipMsgsListByCaller();
		assert ( this.tip.lc().m_tipMsgs.length == 1 );
		assert ( this.tip.lc().m_tipMsgs[0] == g_retMsg );
			
		g_retMsg = '1<split>2<split><split>3';
		this.tip.lc()._initTipMsgsListByCaller();
		assert ( this.tip.lc().m_tipMsgs.length == 3 );
		assert ( this.tip.lc().m_tipMsgs[0] == '1' );
		assert ( this.tip.lc().m_tipMsgs[1] == '2' );
		assert ( this.tip.lc().m_tipMsgs[2] == '3' );
	};
	
	this.test_hideTip = function(){
		this.tip.lc().m_setok = true;
		this.tip.lc()._hideTip();
		assert ( this.tip.lc().m_setok == false );
		
		var g_isEmptyTipMsgRt = [true];
		this.mm.mock(this.tip.lc(), '_isEmptyTipMsg', g_isEmptyTipMsgRt );
		this.mm.mock(TTIP, 'hideTip' );
		
		this.tip.lc()._hideTip();
		assert ( this.mm.walkLog == '_isEmptyTipMsg' );
		
		this.mm.clear();
		g_isEmptyTipMsgRt[0] = false;
		this.tip.lc()._hideTip();
		assert ( this.mm.walkLog == '_isEmptyTipMsg,hideTip,hideTip' );
		assertListEQ ( this.mm.params['hideTip.0'], [0] );
		assertListEQ ( this.mm.params['hideTip.1'], [1] );
	};
	
	this.test__startTimer = function(){
		this.mm.mock(this.g, 'regUpdater');
		this.tip.lc()._startTimer();
		assertEQ ( this.mm.walkLog, '' );
		
		this.tip.setFlag(TIP_FLAG.TIMER);
		this.tip.lc()._startTimer();
		assertEQ ( this.mm.params['regUpdater'], [this.tip, this.tip.lc()._onTimer, 1000] );
	};
	
	this.test__stopTimer = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.tip.lc()._stopTimer();
		assertEQ ( this.mm.walkLog, '' );
		
		this.tip.setFlag(TIP_FLAG.TIMER);
		this.tip.lc()._stopTimer();
		assertEQ ( this.mm.params['unregUpdater'], [this.tip, this.tip.lc()._onTimer] );
	};
	
	this.test__onTimer = function(){
		this.tip.lc().m_lastPos = {x:1, y:2};
		this.mm.mock(this.tip, 'reset' );
		this.mm.mock(this.tip.lc(), '_setTipContentAndShow' );
		this.tip.lc()._onTimer();
		assertEQ ( this.mm.walkLog, 'reset,_setTipContentAndShow' );
		assertEQ ( this.mm.params['_setTipContentAndShow'], [{x:1, y:2}] );
	};
	
	this.test_showTip = function(){
		var g_adjustPos = {x:1, y:2};
		this.mm.mock(this.tip.lc(), '_getAllTipsSize', [{cx:10,cy:20}] );
		this.mm.mock(this.tip.lc(), '_getTipsOffsetLeftW', [5] );
		this.mm.mock(TQ, 'getAdjustPosByWinSize', [g_adjustPos] );
		this.mm.mock(this.tip.lc(), '_getAllTipsPoss', [[{x:1,y:2},{x:3,y:4}]] );
		this.mm.mock(TTIP, 'showTip' );
		
		this.tip.lc()._showTip({x:100, y:200});
		assert ( this.mm.walkLog == '_getTipsOffsetLeftW,_getAllTipsSize,getAdjustPosByWinSize,_getAllTipsPoss,showTip,showTip' );
		assert ( this.mm.params['getAdjustPosByWinSize'][0].x == 100 - 5);
		assert ( this.mm.params['getAdjustPosByWinSize'][0].y == 200 );
		assert ( this.mm.params['getAdjustPosByWinSize'][1].cx == 10 );
		assert ( this.mm.params['getAdjustPosByWinSize'][1].cy == 20 );
		assert ( this.mm.params['getAdjustPosByWinSize'][2].cx == 15 );
		assert ( this.mm.params['getAdjustPosByWinSize'][2].cy == this.tip.lc().C_THPACE );
		assertEQ ( this.tip.lc().m_lastPos, {x:100, y:200});
		
		assert ( this.mm.params['_getAllTipsPoss'][0].x == g_adjustPos.x );
		assert ( this.mm.params['_getAllTipsPoss'][0].y == g_adjustPos.y );
		
		assert ( this.mm.params['showTip.0'][0] == 0 );
		assert ( this.mm.params['showTip.0'][1].x == 1 );
		assert ( this.mm.params['showTip.0'][1].y == 2 );
		
		assert ( this.mm.params['showTip.1'][0] == 1 );
		assert ( this.mm.params['showTip.1'][1].x == 3 );
		assert ( this.mm.params['showTip.1'][1].y == 4 );
	};
	
	this.test_getAllTipsSize = function(){
		var mm = MethodMock.snew();
		mm.mock(TTIP, 'getSize', function(idx){
			if (idx == 0) return {cx:10, cy:20};
			else if (idx == 1) return {cx:20, cy:30};
			});

		this.tip.lc().m_tipMsgs = ['msg1', 'msg2'];
		var size = this.tip.lc()._getAllTipsSize();
		mm.restore();
		
		assert ( size.cx == 10 + 20 + this.tip.lc().C_TWOTIP_WSPACE );
		assert ( size.cy == 30 );
	};
	
	this.test_getAllTipsPoss = function(){
		var mm = MethodMock.snew();
		mm.mock(TTIP, 'getSize', function(idx){
			if (idx == 0) return {cx:10, cy:20};
			else if (idx == 1) return {cx:20, cy:30};
			});

		this.tip.lc().m_tipMsgs = ['msg1', 'msg2'];
		var poss = this.tip.lc()._getAllTipsPoss({x:1, y:2});
		mm.restore();
		
		assert ( poss.length == 2 );
		assert ( poss[0].x == 1 );
		assert ( poss[0].y == 2 );
		assert ( poss[1].x == 1+10+this.tip.lc().C_TWOTIP_WSPACE );
		assert ( poss[1].y == 2 );
	};
	
	this.test__getTipsOffsetLeftW = function(){
		var mm = MethodMock.snew();
		mm.mock(TTIP, 'getSize', function(idx){
			if (idx == 0) return {cx:10, cy:20};
			if (idx == 1) return {cx:20, cy:30};
			if (idx == 3) return {cx:30, cy:30};
			});

		this.tip.lc().m_tipMsgs = ['msg1', 'msg2'];
		assertEQ ( this.tip.lc()._getTipsOffsetLeftW(), 10 );
		
		this.tip.lc().m_tipMsgs = ['msg1'];
		assertEQ ( this.tip.lc()._getTipsOffsetLeftW(), 0 );
		
		this.tip.lc().m_tipMsgs = ['msg1', 'msg2', 'msg3'];
		assertEQ ( this.tip.lc()._getTipsOffsetLeftW(), 30 );
		
		mm.restore();
	};
	
	this.test_destroy = function(){
		this.mm.mock(TQ, 'removeEvent');
		
		this.tip.lc()._destroy();
		assert ( this.mm.walkLog == 'removeEvent,removeEvent,removeEvent' );
		assertListEQ ( this.mm.params['removeEvent.0'], [this.tip.lc().m_dom, 'mouseover', this.tip.lc()._onMouseOver] );
		assertListEQ ( this.mm.params['removeEvent.1'], [this.tip.lc().m_dom, 'mouseout', this.tip.lc()._onMouseOut] );
		assertListEQ ( this.mm.params['removeEvent.2'], [this.tip.lc().m_dom, 'mousemove', this.tip.lc()._onMouseMove] );
	};
});

TestCaseTooltipPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tipPanel = TooltipPanel.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.tipPanel.lc(), '_create');
		this.tipPanel.init(this.g);
		assert ( this.mm.walkLog == '_create' );
		assert ( this.tipPanel.lc().m_g == this.g );
	};
	
	this.test_setContent = function(){
		this.mm.mock(this.tipPanel.lc(), '_removeLastChilds');
		this.mm.mock(this.tipPanel.lc(), '_setContent');
		this.mm.mock(this.tipPanel.lc(), '_resetBackPanelSize');
		
		this.tipPanel.setContent('content');
		assert ( this.mm.walkLog == '_removeLastChilds,_setContent,_resetBackPanelSize' );
		assertListEQ ( this.mm.params['_setContent'], ['content'] );
	};
	
	this.test_removeLastChilds_ = function(){
		this.tipPanel.lc().m_frontPanel.getDom().appendChild(MockDomEx.snew('div'));
		this.tipPanel.lc().m_frontPanel.getDom().appendChild(MockDomEx.snew('div'));
		assert ( this.tipPanel.lc().m_frontPanel.getDom().lastChild != null );
		this.tipPanel.lc()._removeLastChilds();
		assert ( this.tipPanel.lc().m_frontPanel.getDom().lastChild == null );
	};
	
	this.test_setContent_ = function(){	
		this.mm.mock(TQ, 'setHtml');
		this.mm.mock(TQ, 'append');
		
		this.tipPanel.lc()._setContent('s');
		assert ( this.mm.walkLog == 'setHtml' );
		assertListEQ ( this.mm.params['setHtml'], [this.tipPanel.lc().m_frontPanel.getDom(),'s'] );
		
		var g_dom = {};
		this.mm.clear();
		this.tipPanel.lc()._setContent(g_dom);
		assert ( this.mm.walkLog == 'append' );
		assertListEQ ( this.mm.params['append'], [this.tipPanel.lc().m_frontPanel.getDom(), g_dom] );
	};
	
	this.test_resetBackPanelSize_ = function(){
		this.mm.mock(this.g.getGUI(), 'setUIBack');
		
		this.tipPanel.lc().m_frontPanel.getDom().offsetWidth = 1;
		this.tipPanel.lc().m_frontPanel.getDom().offsetHeight = 2;
		
		this.tipPanel.lc()._resetBackPanelSize();
		assert ( this.mm.walkLog == 'setUIBack' );
		
		var backDom = this.tipPanel.lc().m_backPanel.getDom();
		var w = 1 + this.tipPanel.lc().C_WSPACE;
		var h = 2 + this.tipPanel.lc().C_HSPACE;
		
		assertListEQ ( this.mm.params['setUIBack'], [backDom, w, h, uiback.tooltip.tip.type] );
	};
	
	this.test_create = function(){
		this.mm.mock(this.tipPanel.lc(), '_createBack');
		this.tipPanel.lc()._create();
		assert ( this.mm.walkLog == '_createBack' );
		
		assert ( this.tipPanel.lc().m_frontPanel != null );
		assert ( this.tipPanel.lc().m_backPanel != null );
		assert ( this.tipPanel.lc().m_frontPanel.isShow() == false );
		assert ( this.tipPanel.lc().m_backPanel.isShow() == false );
		
		assert ( TQ.getClass(this.tipPanel.lc().m_frontPanel.getDom()) == 'ui-tooltip' );
		assert ( TQ.getClass(this.tipPanel.lc().m_backPanel.getDom()) == 'ui-tipback' );
	};
	
	this.test_createBack = function(){
		var g_cls = ['class'];
		var g_backParent = {};
		var g_backCorner = {};
		var g_backCornerRt = [g_backCorner];
		
		this.mm.mock(TQ, 'createDom', g_backCornerRt);
		this.mm.mock(TQ, 'setClass');
		this.mm.mock(TQ, 'append');
		this.mm.mock(TQ, 'fixIE6Png');
		
		this.tipPanel.lc()._createBack(g_backParent, g_cls);
		
		assert ( this.mm.walkLog == 'createDom,setClass,append,fixIE6Png' );
		assertListEQ ( this.mm.params['createDom'], ['div'] );
		assertListEQ ( this.mm.params['setClass'], [g_backCorner, 'class'] );
		assertListEQ ( this.mm.params['append'], [g_backParent, g_backCorner] );
		assertListEQ ( this.mm.params['fixIE6Png'], [g_backCorner ] );
	};
	
	this.test_show = function(){
		var g_pos = {x:1, y:2};
		this.mm.mock(this.tipPanel.lc().m_backPanel, 'show');
		this.mm.mock(this.tipPanel.lc().m_frontPanel, 'show');
		
		this.tipPanel.show(g_pos);
		assert ( this.mm.walkLog == 'show,show' );
		assert ( this.mm.params['show.0'][0].x == g_pos.x - this.tipPanel.lc().C_WSPACE/2 );
		assert ( this.mm.params['show.0'][0].y == g_pos.y - this.tipPanel.lc().C_HSPACE/2 );
		assertListEQ ( this.mm.params['show.1'], [g_pos] );
	};
	
	this.test_hide = function(){
		this.tipPanel.lc().m_backPanel.show({x:1,y:2});
		this.tipPanel.lc().m_frontPanel.show({x:1,y:2});
		
		this.tipPanel.hide();
		
		assert ( this.tipPanel.lc().m_backPanel.isShow() == false );
		assert ( this.tipPanel.lc().m_frontPanel.isShow() == false );
	};
});

tqTooltip_t_main = function(suite) {
	suite.addTestCase(TestCaseTip, 'TestCaseTip');
	suite.addTestCase(TestCaseTooltipPanel, 'TestCaseTooltipPanel');
};