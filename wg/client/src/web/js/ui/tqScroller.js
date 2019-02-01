SCROLL_LINEH = 15;
SCROLL_TRACE_W = 15;
SCROLL_TRACE_MINH = 24;
SCROLL_TRACE_MAXH = 20000;

SliderBtn = Class.extern(function(){
	var m_this = null;
	var m_gui = null;
	this.init = function(g, parentDom, uiback, caller){
		this.g = g;
		this.uiback = uiback;
		this.caller = caller;
		m_this = this;
		m_gui = this.g.getGUI();
		
		this.dom = TQ.createDom('div');
		TQ.append(parentDom, this.dom);
		this.backdom = m_gui.createPanelUIBack(this.dom, this.uiback, false, 0);
		TQ.setCSS(this.dom, 'position', 'absolute');
		this.decorateDom = TQ.createDom('div');
		TQ.setCSS(this.decorateDom, 'zIndex', '10');
		TQ.append(this.dom, this.decorateDom);
		TQ.setClass(this.decorateDom, this.uiback.decorateCls);
		_regEvents();
	};
	
	this.setSize = function(cx, cy){
		TQ.setDomSize(this.dom, cx, cy);
		TQ.setDomSize(this.decorateDom, cx, cy);
		_refreshUIBack(cx, cy);
	};
	
	this.setPosition = function(x, y){
		TQ.setDomPos(this.dom, x, y);
	};
	
	this.setTop = function(top){
		this.dom.style.top = top + 'px';
	};
	
	this.getTop = function(){
		return parseInt(this.dom.style.top);
	};
	
	this.getBtnH = function(){
		return TQ.getDomHeight(this.dom);	
	};
	
	this.setBtnH = function(h){
		this.setSize(TQ.getDomWidth(this.dom), h);
	};
	
	this.domOffset = function(){
		return TQ.domOffset(this.dom);
	};	
	
	var _regEvents = function(){
		TQ.addEvent(m_this.dom, 'dragstart', function(e){return false;});
		TQ.addEvent(m_this.dom, 'selectstart', function(e){return false;});
		TQ.captureMouseEvent(m_this.dom, {self:m_this, mouseDown:_onMouseDown, mouseMove:_onMouseMove, mouseUp:_onMouseUp});
		TQ.captureTouchEvent(m_this.dom, {self:m_this, touchStart:_onTouchStart, touchMove:_onTouchMove, touchEnd:_onTouchEnd, touchCancel:_onTouchEnd});
	};	

	var _refreshUIBack = function(cx, cy){
		if ( m_this.uiback.type >= 0 ){
			m_gui.setUIBack(m_this.backdom, cx, cy, m_this.uiback.type);
		}
	};
	
	var _onMouseDown = function(e){
		if ( TQ.getBtnType(e) != BTN_LEFT ) return;
		TQ.stopPropagation(e);
		m_this.caller.startDrag(e);
	};
	
	var _onMouseMove = function(e){
		if ( TQ.getBtnType(e) != BTN_LEFT ) return;
		TQ.stopPropagation(e);
		m_this.caller.updateScroll(e);
	};
	
	var _onMouseUp = function(e){
		if ( TQ.getBtnType(e) != BTN_LEFT ) return;
		TQ.stopPropagation(e);
		m_this.caller.stopDrag(e);
	};
	
	var _onTouchStart  = function(e, touch, element){
		m_this.caller.startDrag(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	};
	
	var _onTouchMove  = function(e, touch, element){
		m_this.caller.updateScroll(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	};
	
	var _onTouchEnd  = function(e, touch, element){
		m_this.caller.stopDrag(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	};
});

/** 滑动条 */
SliderBar = function(){
	//-----------
	//private:const
	//-----------
	var C_CLICKBAR_ID = 1;
	var C_CLICKBTN_ID = 2;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_parent;
	var m_sliderbtn;
	var m_sliderbar;
	var m_document;
	var m_startmousepos = {x:0,y:0};
	var m_startbtnpos = {x:0,y:0};
	var m_btnh = 0;
	var m_size = {cx:10,cy:10};
	var m_range = 1;
	var m_scale = 1.0;
	var m_linedrt = 10;
	var m_pagedrt = 40;
	var m_caller;
	var m_lineh = SCROLL_LINEH;
	var m_pageh = 0;
	var m_scrollpos = 0;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,parent){
		m_g = g;
		m_this = this;
		m_parent = parent;
		_init();
	};
	
	this.setSize = function(w,h){
		m_size.cx = w;
		m_size.cy = h;
		_resetSize();
		_setposition();
	};
	
	this.getDom = function(){
		return m_sliderbar.getDom();
	};
	
	this.prevLine = function(){
		_positionDrag(-m_linedrt);
	};
	
	this.nextLine = function(){
		_positionDrag(m_linedrt);
	};
	
	/** 设置滚动的最大范围 */
	this.setRange = function(pageh,range){
		range = range >= pageh ? range : pageh;
		m_range = range;
		m_pageh = pageh;
		_resetSize();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.scrollBy = function(drt){
		var drt = drt/m_scale;
		_positionDrag(drt);
	};
	
	this.setLineHeight = function(lineh){
		m_lineh = lineh;
		_resetSize();
	};
	
	this.scrollPos = function(pos){
		m_startbtnpos.y = 0;
		var drt = parseInt(pos/m_scale+0.5);
		_positionDrag(drt);
	};
	
	this.getScrollPos = function(){
		return m_scrollpos;
	};
	
	//--------------
	// private:method
	//--------------	
	var _init = function(){
		m_sliderbar = new ComButton(m_g,m_parent,{uiback:uiback.btn.scrollbar});
		m_sliderbar.setId(C_CLICKBAR_ID);
		m_sliderbar.setCaller({self:m_this, caller:_onClickBar});
		m_sliderbar.setType(BTN_TYPE.TIMER);
		
		m_sliderbtn = SliderBtn.snew(m_g, 
			m_sliderbar.getDom(), 
			uiback.scrollslider, 
			{startDrag:_startDrag, updateScroll:_updateScroll, stopDrag:_stopDrag});
		m_sliderbtn.setPosition(0, 0);
		m_btnh = m_sliderbtn.getBtnH();
		_setposition();
	};
	
	var _onClickBar = function(id,e){
		var curmousepos = TQ.mouseCoords(e);
		var btnoffset = m_sliderbtn.domOffset();
		if ( curmousepos.y < btnoffset.top ){
			var drtally = btnoffset.top - curmousepos.y;
			var drty = m_pagedrt < drtally ? m_pagedrt:drtally;
			_positionDrag(-drty);
		}
		else if ( curmousepos.y > (btnoffset.top+m_btnh) ){
			var drtally = curmousepos.y - (btnoffset.top+m_btnh);
			var drty = m_pagedrt < drtally ? m_pagedrt:drtally;
			_positionDrag(drty);
		}
	};
	
	var _startDrag = function(e){
		m_startmousepos = TQ.mouseCoords(e);
		return false;
	};
	
	var _stopDrag = function(e){
		m_startbtnpos.y = m_sliderbtn.getTop();
	};
	
	var _updateScroll = function(e){
		var curmousepos = TQ.mouseCoords(e);
		var drty = curmousepos.y - m_startmousepos.y;
		var backstartbtnposy = m_startbtnpos.y;
		_positionDrag(drty);
		m_startbtnpos.y = backstartbtnposy;
	};
	
	var _setposition = function(){
		var sliderdom = m_sliderbar.getDom();
		TQ.setDomSize(sliderdom, m_size.cx, m_size.cy);
		
		m_sliderbtn.setSize(m_size.cx, m_size.cx);
		m_btnh = m_sliderbtn.getBtnH();
	};
	
	var _isEnd = function(){
		return (m_startbtnpos.y + m_btnh) >= (m_size.cy - m_linedrt/2);
	};
	
	var _positionDrag = function(drty){
		var cury = m_startbtnpos.y + drty;
		if ( cury < 0 ) cury = 0;
		if ( cury + m_btnh > m_size.cy ) cury = m_size.cy - m_btnh;
		m_sliderbtn.setTop(cury);
		m_scrollpos = parseInt(cury * m_scale, 10);
		if ( m_caller) {
			m_caller.caller.call(m_caller.self, -m_scrollpos);
		}
		m_startbtnpos.y = cury;
	};
	
	var _resetSize = function(){
		var btnh = parseInt(m_pageh * m_size.cy / m_range);
		if ( btnh < SCROLL_TRACE_MINH ) btnh = SCROLL_TRACE_MINH;
		if ( btnh > SCROLL_TRACE_MAXH ) btnh = SCROLL_TRACE_MAXH;
		m_sliderbtn.setBtnH(btnh);
		m_btnh = btnh;
		var a = (m_range - m_pageh);
		var b = (m_size.cy-m_btnh);
		if ( b == 0 ){
			m_scale = 1.0;	
		}
		else{
			m_scale = (m_range - m_pageh)/(m_size.cy-m_btnh);	
		}
		m_linedrt = parseInt(m_lineh/m_scale);
		m_linedrt = m_linedrt <= 0 ? 1: m_linedrt;
		var pageh = parseInt(m_pageh-m_lineh*1.5);
		pageh = pageh <= 0 ? 1: pageh;
		m_pagedrt = parseInt(pageh/m_scale);
		m_pagedrt = m_pagedrt <= 0 ? 1: m_pagedrt;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

/** 滚动条 */
Scrollbar = function(){
	//-----------
	//private:const
	//-----------
	var C_PREV_BTN_ID = 1;
	var C_NEXT_BTN_ID = 2;

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_parent;
	var m_upbtn;
	var m_downbtn;
	var m_sliderbar;
	var m_range = 0;
	var m_size = {cx:0,cy:0};
	var m_blinkflag = false;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,parent){
		m_g = g;
		m_this = this;
		m_parent = TQ.createDom('div');
		parent.appendChild(m_parent);
		_init();
	};
	
	/** 设置滚动条的大小 */
	this.setSize = function(w,h){
		m_size.cx = w;
		m_size.cy = h;
		_setposition();
	};
	
	/** 设置滚动的最大范围 */
	this.setRange = function(range){
		m_range = range;
		m_sliderbar.setRange(m_size.cy,range);
	};
	
	this.setCaller = function(caller){
		m_sliderbar.setCaller(caller);
	};
	
	this.scrollBy = function(drt){
		m_sliderbar.scrollBy(drt);
	};
	
	this.scrollPos = function(pos){
		m_sliderbar.scrollPos(pos);
	};

	this.setLineHeight = function(lineh){
		m_sliderbar.setLineHeight(lineh);
	};
	
	this.getScrollPos = function(){
		return m_sliderbar.getScrollPos();
	};
	
	this.startDownBlink = function(){
		m_downbtn.startBlinking(0);
		m_blinkflag = true;
	};
	
	this.stopDownBlink = function(){
		m_downbtn.stopBlinking();
		m_blinkflag = false;
	};
	
	this.isDownBlink = function(){
		return m_blinkflag;
	};
	
	//--------------
	// private:method
	//--------------	
	var _init = function(){
		// 添加滚动条按钮
		m_upbtn = new ComButton(m_g,m_parent,{uiback:uiback.btn.scrollubtn});
		m_upbtn.setId(C_PREV_BTN_ID);
		m_upbtn.setCaller({self:m_this, caller:_onBtnClick});
		m_upbtn.setType(BTN_TYPE.TIMER);
		
		m_sliderbar = new SliderBar(m_g, m_parent);
		
		m_downbtn = new ComButton(m_g,m_parent,{uiback:uiback.btn.scrolldbtn});
		m_downbtn.setId(C_NEXT_BTN_ID);
		m_downbtn.setCaller({self:m_this, caller:_onBtnClick});
		m_downbtn.setType(BTN_TYPE.TIMER);
	};
	
	var _setposition = function(){
		TQ.setDomSize(m_parent, m_size.cx, m_size.cy);
		TQ.setCSS(m_parent, 'position', 'absolute');
		
		var upbtndom = m_upbtn.getDom();
		var sliderdom = m_sliderbar.getDom();
		var dnbtndom = m_downbtn.getDom();
		TQ.setDomSize(upbtndom, m_size.cx, m_size.cx);
		TQ.setCSS(sliderdom, 'top', m_size.cx+'px');
		m_sliderbar.setSize(m_size.cx,(m_size.cy-2*m_size.cx));
		TQ.setDomSize(dnbtndom, m_size.cx, m_size.cx);
		TQ.setCSS(dnbtndom, 'top', (m_size.cy-m_size.cx)+'px');
	};
	
	var _onBtnClick = function(id){
		if ( id == C_PREV_BTN_ID ){
			m_sliderbar.prevLine();
		}
		else if ( id == C_NEXT_BTN_ID ){
			m_sliderbar.nextLine();
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);		
};

var DragScroll = JClass.ex({
	init : function(g, con, scrollbar) {
		this.c_interval = 15;
		this.c_minMoveStep = 0.5;
		this.c_deaccelerateFactor = 0.95;
		
		this._g = g;
		this._con = con;
		this._scrollbar = scrollbar;
		
		this._startMousePos = {x:0, y:0};
		this._startpos = 0;
		this._moveStep = 0;
		this._lastMousePos = {x:0, y:0};
		this._lastTime = 0;
		this._timer = null;
		
		TQ.captureMouseEvent(this._con, {self:this, mouseDown:this._onMouseDown, mouseMove:this._onMouseMove, mouseUp:this._onMouseUp});
		TQ.captureTouchEvent(this._con, {self:this, touchStart:this._onTouchStart, touchMove:this._onTouchMove, touchEnd:this._onTouchEnd, touchCancel:this._onTouchCancel});
	}
	
	,_onMouseDown : function(e){
		this._startDrag(e);
	}
	
	,_onMouseMove : function(e){
		this._moveInDrag(e);
	}
	
	,_onMouseUp : function(e){
		this._endDrag(e);
	}
	
	,_onTouchStart : function(e, touch, element){
		this._startDrag(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	}
	
	,_onTouchMove : function(e, touch, element){
		this._moveInDrag(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	}
	
	,_onTouchEnd : function(e, touch, element){
		this._endDrag(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	}
	
	,_onTouchCancel : function(e, touch){
		this._stopTimer();
	}
	
	,_startDrag : function(e){
		this._startMousePos = TQ.mouseCoords(e);
		this._startpos = this._scrollbar.getScrollPos();
		this._moveStep = 0;
		this._lastMousePos = this._startMousePos;
		this._lastTime = new Date().getTime();
		this._stopTimer();
	}	
	
	,_moveInDrag : function(e) {
		this._calcMoveStep(e);
		var pos = TQ.mouseCoords(e);
		var drt = (pos.y - this._startMousePos.y);
		this._scrollbar.scrollPos(this._startpos - drt);
	}
	
	,_endDrag : function(e) {
		this._stopTimer();
		
		if ( Math.abs(this._moveStep) > this.c_minMoveStep ) {
			var this_l = this;
			this._timer = window.setInterval(function(){
				this_l._onDeaccelerateScrolling();
			}, this.c_interval);
			this._startpos = this._scrollbar.getScrollPos();
		}		
	}
	
	,_calcMoveStep : function(e){
		var pos = TQ.mouseCoords(e);
		this._moveStep = (pos.y - this._lastMousePos.y)*0.35;
		this._lastMousePos = pos;
	}
	
	,_onDeaccelerateScrolling : function(){
		this._moveStep = this._moveStep*this.c_deaccelerateFactor;
		this._startpos = this._startpos - this._moveStep;
		this._scrollbar.scrollPos(this._startpos);
		if ( Math.abs(this._moveStep) <= this.c_minMoveStep ) {
			this._stopTimer();
		}
	}
	
	,_stopTimer : function(){
		if ( this._timer ) {
			window.clearInterval(this._timer);
			this._timer = null;
		}
	}	
});

Scroller = function() {
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_allcontainer;
	var m_container;
	var m_subcontainer;
	var m_dom;
	var m_auto;
	var m_w = 0;
	var m_h = 0;
	var m_totalheight = 0;
	var m_lastScrollTop = 0;
	var m_scrollbarcon;
	var m_scrollbar;
	var m_istextarea = false;
	var m_showbar = false;
	var m_mousedown = false;
	var m_lineheight = SCROLL_LINEH;
	var m_containerobj = null;//如果是dom，则和m_dom相同
	var m_dragscroll = null;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g, dom, auto){
		m_g = g;
		m_this = this;
		m_dom = dom;
		if ( m_dom.tagName.toLowerCase()=="textarea" ){
			m_istextarea = true;
		}
		m_auto = auto?auto:false;
		_init();
	};
	
	this.uiClass = function(){
		return 'Scroller';
	};
	
	this.setCanSelect = function(){
		TQ.setCSS(m_dom, 'select', 'text' );
	};
	
	/** 刷新scroller */
	this.refresh = function(){
		if ( m_istextarea ){
			_resetScrollInfo();
		}
		else{
			_initscroller();
		}
	};
	
	/** 滚动到指定的位置 */
	this.scrollPos = function(pos){
		m_scrollbar.scrollPos(pos);
	};
	
	this.scrollEnd = function(){
		m_scrollbar.scrollPos(0x7fffffff);
	};
	
	this.getWidth = function() {
		return m_w;
	};
	
	this.getHeight = function() {
		return m_h;
	};
	
	/** 设置面板的大小 */
	this.setSize = function(w,h){
		if ( w > 0 ) {
			m_w = w;
		}
		if ( h > 0 ){
			m_h = h;
		}
		this.refresh();
	};
	
	this.setPos = function(x,y){
		TQ.setCSS(m_allcontainer, 'left', x+'px');
		TQ.setCSS(m_allcontainer, 'top', y+'px');
	};
	
	this.setRect = function(l,t,w,h){
		this.setPos(l,t);
		this.setSize(w,h);
	};
	
	/** 设置一行的实际高度 */
	this.setLineHeight = function(lineh){
		m_lineheight = lineh;
		m_scrollbar.setLineHeight(lineh);
	};
	
	/** 设置容器中包含的对象 */
	this.setContainerObj = function(cobj){
		m_containerobj = cobj;
	};
	
	/** 获得容器中包含的对象 */
	this.getContainerObj = function(){
		return m_containerobj;
	};
	
	this.show = function(){
		TQ.setCSS(m_allcontainer, 'display', 'block');
	};
	
	this.hide = function(){
		TQ.setCSS(m_allcontainer, 'display', 'none');
	};
	
	this.getDom = function(){
		return m_allcontainer;
	};
	
	this.getScrollPos = function(){
		return m_scrollbar.getScrollPos();
	};
	
	this.getRange = function(){
		return m_totalheight;
	};
	
	this.startDownBlink = function(){
		m_scrollbar.startDownBlink();
	};
	
	this.stopDownBlink = function(){
		m_scrollbar.stopDownBlink();
	};
	
	this.isNearToEnd = function(){
		return _isNearToEnd();
	};
	
	// 为性能优化做的
	this.setScrollDomH = function(h){
		if ( !m_istextarea ){
			m_dom.h_ = h;
		}
	};
	
	//--------------
	// private:method
	//--------------	
	var _init = function(){
		var parent = m_dom.parentNode;
		parent.removeChild(m_dom);
		m_allcontainer = TQ.createDom('div');
		parent.appendChild(m_allcontainer);
		if ( m_istextarea ){
			m_totalheight = m_dom.scrollHeight;
			m_lastScrollTop = 0;
		}
		else{
			m_totalheight = TQ.getDomHeight(m_dom);
		}
		var csss = ['position','left','top'];
		for ( key in csss ){
			TQ.setCSS(m_allcontainer, csss[key], TQ.getCSS(m_dom,csss[key]));
		}
		m_dom.style.left = '0px';
		m_dom.style.top = '0px';
		
		// 添加滚动内容的面板
		m_container = TQ.createDom('div');
		m_allcontainer.appendChild(m_container);
		m_subcontainer = TQ.createDom('div');
		m_container.appendChild(m_subcontainer);
		m_subcontainer.appendChild(m_dom);
		TQ.appendClass(m_container,'ui-scrollcon');
		TQ.appendClass(m_subcontainer,'ui-subscrollcon');
		m_dom.style.position = 'absolute';
		TQ.addEvent(m_allcontainer, 'mousewheel', _onMousewheel);
		
		// 添加滚动条面板
		m_scrollbarcon = TQ.createDom('div');
		TQ.appendClass(m_scrollbarcon,'ui-scrollbarcon');
		
		m_allcontainer.appendChild(m_scrollbarcon);
		m_scrollbar = new Scrollbar(m_g,m_scrollbarcon);
		m_scrollbar.setCaller({self:m_this,caller:_onScroll});
		m_w = parseInt(TQ.getCSS(m_dom,'width'));
		m_h = parseInt(TQ.getCSS(m_dom,'height'));
		if ( m_istextarea ){
			TQ.addEvent(m_dom,'keydown',_onTextareaKey);
			TQ.addEvent(m_dom,'keyup',_onTextareaKey);
			TQ.addEvent(m_dom,'change',_onTextareaKey);
			TQ.addEvent(m_dom,'mousedown',_onTextareaMousedown);
			TQ.addEvent(m_dom,'mouseup',_onTextareaMouseup);
			TQ.addEvent(m_dom,'mousemove',_onTextareaMousemove);
		}
		
		_initscroller();
		m_scrollbar.scrollBy(0);
		m_dragscroll = DragScroll.snew(m_g, m_allcontainer, m_scrollbar);
	};
	
	var _initscroller = function(){
		if ( m_istextarea ){
			TQ.setDomHeight(m_dom, m_h );
			if ( TQ.getDomAutoHeight(m_dom) > m_h ){// fix chrome bug
				var drt = TQ.getDomAutoHeight(m_dom) - m_h;
				TQ.setDomHeight(m_dom, m_h-drt );
			}
			if ( TQ.getDomAutoWidth(m_dom) > m_w ){
				var drt = TQ.getDomAutoWidth(m_dom) - m_w;
				TQ.setDomWidth(m_dom, m_w-drt );
			}
			m_totalheight = m_dom.scrollHeight;
		} else {
			TQ.setDomHeight(m_dom, 'auto');
			m_totalheight = TQ.getDomHeight(m_dom);
		}
		TQ.setDomSize(m_allcontainer, m_w, m_h);
		
		m_showbar = (!m_auto) || (m_totalheight > m_h);
		var scrollbarw = m_showbar ? SCROLL_TRACE_W:0;
		TQ.setDomSize(m_container, (m_w - scrollbarw), m_h);
		TQ.setDomSize(m_subcontainer, (m_w - scrollbarw), m_h);
		TQ.setDomWidth(m_dom, m_w - scrollbarw );
		TQ.setDomSize(m_scrollbarcon, scrollbarw, m_h);
		m_scrollbar.setSize(scrollbarw, m_h);
		if ( m_showbar ){
			var scrollbarw2 = scrollbarw;
			m_scrollbarcon.style.display = 'block';
			if ( m_istextarea ){
				m_dom.style.overflowY = 'auto';
				m_dom.style.overflowX = 'hidden';
				var sysscrollw = TQ.getDomAutoWidth(m_dom) - m_dom.clientWidth - 2*m_dom.clientLeft;
				if ( sysscrollw >= 0 ){//fix opera bug, assume the max sys scroll w = 20px
					sysscrollw = m_w - m_dom.clientWidth + 1;
				}
				scrollbarw2 = scrollbarw - sysscrollw;
			}
			TQ.setDomWidth(m_dom, m_w - scrollbarw2 );
			m_scrollbar.setRange(m_totalheight);
		} else {
			TQ.setCSS(m_scrollbarcon, 'display', 'none');
			if ( m_istextarea ){
				TQ.setCSS(m_dom, 'overflow', 'hidden');
			}
			TQ.setDomHeight(m_dom, m_h );
			m_scrollbar.setRange(m_totalheight);
			m_scrollbar.scrollBy(0);
		}
	};
	
	var _scrollIsDirty = function(){
		var dirty = false;
		if ( m_totalheight != m_dom.scrollHeight ){
			m_totalheight = m_dom.scrollHeight;
			dirty = true;
		}
		if ( m_lastScrollTop != m_dom.scrollTop ){
			m_lastScrollTop = m_dom.scrollTop;
			dirty = true;
		}
		return dirty;
	};
	
	var _isNearToEnd = function(){
		var pos = m_scrollbar.getScrollPos();
		return (m_h + pos) >= (m_totalheight - m_lineheight);
	};
	
	var _onScroll = function(top){
		if ( m_scrollbar.isDownBlink() && _isNearToEnd() ){
			m_scrollbar.stopDownBlink();
		}
		if ( m_istextarea ){
			m_dom.scrollTop = -top;
		}
		else{
			m_dom.style.top = top+'px';
		}
	};
	
	var _onMousewheel = function(e){
		e = e ? e : window.event;
		if ( !m_istextarea ){
			var direct = 0; 
			if (e.wheelDelta) { 
				direct = e.wheelDelta > 0 ? -1 : 1; 
			} 
			else if (e.detail) { 
				direct = e.detail < 0 ? -1 : 1; 
			}
			e.returnValue = false;
			m_scrollbar.scrollBy(direct * m_lineheight * 3);
		}
		else{
			if ( _scrollIsDirty() ){
				m_scrollbar.scrollPos(m_lastScrollTop);
			}
		}
	};
	
	var _onTextareaKey = function(e){
		_resetScrollInfo();
	};
	
	var _onTextareaMousedown = function(e){
		e = e ? e : window.event;
		if ( TQ.getBtnType(e) != BTN_LEFT ) return;
		m_mousedown = true;
		_resetScrollInfo();
	};
	
	var _onTextareaMouseup = function(e){
		e = e ? e : window.event;
		if ( TQ.getBtnType(e) != BTN_LEFT ) return;
		m_mousedown = false;
	};
	
	var _onTextareaMousemove = function(e){
		e = e ? e : window.event;
		if ( m_mousedown ){
			_resetScrollInfo();
		}
	};
	
	var _resetScrollInfo = function(){
		if ( _scrollIsDirty() ){
			var showbar = (!m_auto) || (m_totalheight > m_h);
			if ( showbar != m_showbar ) {
				_initscroller();
			}
			else{
				m_scrollbar.setRange(m_totalheight);
			}
			m_scrollbar.scrollPos(m_lastScrollTop);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};
