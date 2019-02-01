TIP_FLAG = {
	COMM : 0,
	CUSTOM : 1,
	TIMER : 2 // 每秒刷新一次
};

Tip = function(){
	//Tip-unittest-start
	var C_TWPACE = 15;
	var C_THPACE = 28;
	var C_TWOTIP_WSPACE = 5;
	
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_this = null;
	var m_mgr = null;
	var m_dom = null;
	var m_tipMsgs = [];
	var m_rectinfos = null;
	var m_caller = null;
	var m_data = null;
	var m_setok = false;
	var m_flag = TIP_FLAG.COMM;
	var m_lastPos = {x:0, y:0};

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g,mgr,dom,msg,rectinfos){
		m_g = g;
		m_this = this;
		m_setok = false;
		m_mgr = mgr;
		m_dom = dom;
		if ( msg && TQ.trim(msg) != '' ) {
			m_tipMsgs.push(msg);
		}
		m_rectinfos = rectinfos;
		_init();
	};
	
	this.destroy = function(){
		_destroy();
	};
	
	this.setFlag = function(flag){
		m_flag = flag;
	};
	
	this.getFlag = function(){
		return m_flag;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.setData = function(data){
		m_data = data;
	};
	
	this.reset = function(){
		m_setok = false;
	};
	
	this.resetTipContent = function(){
		m_setok = false;
		_setTipContent();
	};
	
	this.show = function(pos){
		_startTimer();
		_setTipContentAndShow(pos);
	};
	
	this.hide = function(){
		_hideTip();
	};
	
	this.getTip = function(){
		this.resetTipContent();
	};
	
	this.getTipMsg = function(){
		if (m_tipMsgs.length == 0){
			return '';
		}
		else{
			return m_tipMsgs[0];
		}
	};
	
	this.getLastPos = function(){
		return m_lastPos;
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(){
		if ( m_flag != TIP_FLAG.CUSTOM ){
			if ( isPcBrowser() ) {
				TQ.addEvent(m_dom,'mouseover',_onMouseOver);
				TQ.addEvent(m_dom,'mouseout',_onMouseOut);
				TQ.addEvent(m_dom,'mousemove',_onMouseMove);
			}
			if ( isMobileBrowser() ) {
				TQ.captureTouchEvent(m_dom, {self:m_this, touchStart:_onTouchStart, touchEnd:_onTouchEnd, touchCancel:_onTouchEnd});
			}
		}
	};
	
	var _onMouseOver = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		_innerShowTip(e);
	};
	
	var _onMouseMove = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		_innerShowTip(e);
	};
	
	var _onMouseOut = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		e = e ? e : window.event;
		_hideTip();
		TQ.stopPropagation(e);
	};	
	
	var _onTouchStart = function(e, touch, element){
		if ( m_flag == TIP_FLAG.CUSTOM ) return;
		var me = TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element);
		window.setTimeout(function(){
			_innerShowTip(me);
		}, 300);
	};

	var _onTouchEnd = function(e, touch, element){
		if ( m_flag == TIP_FLAG.CUSTOM ) return;
		var me = TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element);
		_hideTip();
		TQ.stopPropagation(me);
	};
	
	var _startTimer = function(){
		if ( m_flag == TIP_FLAG.TIMER ){
			m_g.regUpdater(m_this, _onTimer, 1000);
		}
	};
	
	var _stopTimer = function(){
		if ( m_flag == TIP_FLAG.TIMER ){
			m_g.unregUpdater(m_this, _onTimer);
		}
	};
	
	var _onTimer = function(){
		m_this.reset();
		_setTipContentAndShow(m_lastPos);
	};
	
	var _innerShowTip = function(e){
		e = e ? e : window.event;
		_startTimer();
		_setTipContentAndShow(TQ.mouseCoords(e));
		TQ.stopPropagation(e);
	};
	
	var _setTipContentAndShow = function(pos){
		_setTipContent();
		if ( !_isEmptyTipMsg() ) {
			_showTip(pos);
		}
	};
	
	var _setTipContent = function(){
		if ( m_setok ){
			return;
		}
		
		_initTipMsgsListByCaller();
		
		if ( _isEmptyTipMsg() ) {
			return;
		}
		
		for (var idx=0; idx<m_tipMsgs.length; ++idx ) {
			m_mgr.setTipContent(idx, m_tipMsgs[idx], m_this);
		}
		
		m_setok = true;
	};
	
	var _isEmptyTipMsg = function() {
		return m_tipMsgs.length == 0 ;
	};	
	
	var _initTipMsgsListByCaller = function(){
		if ( !m_caller ) {
			return;
		}
		
		var msg = m_caller.caller.call(m_caller.self, m_data);
		m_tipMsgs = [];
		if ( typeof(msg) == 'string' ) {
			var msgs = msg.split('<split>');
			for ( var k in msgs ) {
				if ( !msgs[k] ) {
					continue;
				}
				
				if ( TQ.trim( msgs[k] ) == '' ) {
					continue;
				}
				
				m_tipMsgs.push(msgs[k]);
			}
		}
		else if (msg) {
			m_tipMsgs.push(msg);
		}
	};
	
	var _hideTip = function(){
		_stopTimer();
		
		m_setok = false;
		if ( !_isEmptyTipMsg() ) {
			m_mgr.hideTip(0);
			m_mgr.hideTip(1);
		}
	};
	
	var _showTip = function(pos){
		m_lastPos.x = pos.x;
		m_lastPos.y = pos.y;
		var mouseSize = {cx:C_TWPACE, cy:C_THPACE};
		var adjustPos = TQ.getAdjustPosByWinSize({x:pos.x-_getTipsOffsetLeftW(), y:pos.y}, _getAllTipsSize(), mouseSize);
		var poss = _getAllTipsPoss(adjustPos);
		for ( var i=0; i<poss.length; ++i ) {
			m_mgr.showTip(i, poss[i]);
		}
	};
	
	var _getAllTipsSize = function(){
		var retSize = {cx:0, cy:0};
		for (var idx=0; idx<m_tipMsgs.length; ++idx ) {
			var size = m_mgr.getSize(idx);
			if (retSize.cx > 0) {
				retSize.cx += C_TWOTIP_WSPACE;
			}
			retSize.cx += size.cx;
			
			if (retSize.cy < size.cy) {
				retSize.cy = size.cy;
			}
		}
		return retSize;
	};
	
	var _getAllTipsPoss = function(pos){
		var x = pos.x;
		var retPoss = [];
		for (var i=0; i<m_tipMsgs.length; ++i ) {
			var size = m_mgr.getSize(i);
			retPoss.push({x:x, y:pos.y});
			x += size.cx  + C_TWOTIP_WSPACE;
		}
		return retPoss;
	};
	
	var _getTipsOffsetLeftW = function(){
		var w = 0;
		for (var i=0; i<m_tipMsgs.length-1; ++i ) {
			w += m_mgr.getSize(i).cx;
		}
		return w;
	};
	
	var _destroy = function(){
		if ( m_flag != TIP_FLAG.CUSTOM ){
			TQ.removeEvent(m_dom,'mouseover',_onMouseOver);
			TQ.removeEvent(m_dom,'mouseout',_onMouseOut);
			TQ.removeEvent(m_dom,'mousemove',_onMouseMove);
		}
	};	
	
	this.init.apply(this, arguments);
	
	//Tip-unittest-end
};

EmptyTooltipPanel = Class.extern(function(){
	this.init = function(g){
	};
	
	this.setContent = function(content){
	};
	
	this.show = function(pos){
	};
	
	this.hide = function(){
	};
	
	this.getSize = function(){
		return {cx:0, cy:0};	
	};
}).snew(null);

TooltipPanel = Class.extern(function(){
	//TooltipPanel-unittest-start
	var C_WSPACE = 20;
	var C_HSPACE = 10;	
	
	var m_g = null;
	var m_frontPanel = null;
	var m_backPanel = null;
	
	this.init = function(g){
		m_g = g;
		_create();
	};
	
	this.setContent = function(content){
		_removeLastChilds();
		_setContent(content);
		_resetBackPanelSize();
	};
	
	this.show = function(pos){
		m_backPanel.show({x:pos.x-C_WSPACE/2,y:pos.y-C_HSPACE/2});
		m_frontPanel.show(pos);
	};
	
	this.hide = function(){
		m_backPanel.hide();
		m_frontPanel.hide();	
	};
	
	this.getSize = function(){
		var backDom = m_backPanel.getDom();
		return {cx:TQ.getDomWidth(backDom), cy:TQ.getDomHeight(backDom)};	
	};
	
	var _removeLastChilds = function(){
		var frontDom = m_frontPanel.getDom();
		while(frontDom.lastChild){
			frontDom.removeChild(frontDom.lastChild);
		}
	};
	
	var _setContent = function(content){
		var frontDom = m_frontPanel.getDom();
		if ( typeof(content) == 'string' ) {
			TQ.setHtml(frontDom, content);
		}
		else{
			TQ.append(frontDom, content);
		}
	};
	
	var _resetBackPanelSize = function(){
		var w = m_frontPanel.getWidth()+C_WSPACE;
		var h = m_frontPanel.getHeight()+C_HSPACE;
		var backDom = m_backPanel.getDom();
		m_g.getGUI().setUIBack(backDom, w, h, uiback.tooltip.tip.type);	
	};
	
	var _create = function() {
		m_frontPanel = new PopPanel(m_g,{zindex:UI_ZORDER_TOOLTIP+1});
		m_backPanel = new PopPanel(m_g,{zindex:UI_ZORDER_TOOLTIP});
		
		m_frontPanel.hide();
		m_backPanel.hide();
			
		var frontDom = m_frontPanel.getDom();
		TQ.setClass(frontDom, 'ui-tooltip');	
		
		var backDom = m_backPanel.getDom();
		TQ.setClass(backDom,'ui-tipback');
		
		_createBack(backDom, uiback.tooltip.tip.cls);
	};
	
	var _createBack = function(backParent, cls){
		for ( var k in cls ){
			var backCorner = TQ.createDom('div');
			TQ.setClass(backCorner, cls[k]);
			TQ.append(backParent, backCorner);
			TQ.fixIE6Png(backCorner);
		}
	};
	//TooltipPanel-unittest-end
});

Tooltip = Class.extern(function(){
	//Tooltip-unittest-start
	var m_g;
	var m_this;
	var m_initok=false;
	var m_tips={};
	var m_tippanels=[];
	var m_lasttipid=1;
	var m_freetipids=[];
	var m_asynData=null;

	this.init = function(){
		m_this = this;
		m_asynData={start:false, tipobj:null};
	};
	
	/** 创建该tooltip对象 */
	this.create = function(g){
		m_g = g;
		_create();
	};
	
	this.startAsyn = function(){
		m_asynData.start = true;
	};
	
	this.asynPresent = function(){
		if ( m_asynData.start && m_asynData.tipobj ){
			m_asynData.tipobj.resetTipContent();
		}
	};
	
	this.setTipContent = function(idx, content, tipobj){
		m_asynData.tipobj = tipobj;
		var tipPanel = _getTipPanel(idx);
		tipPanel.setContent(content);
	};
	
	this.showTip = function(idx, pos){
		var tipPanel = _getTipPanel(idx);
		tipPanel.show(pos);
	};
	
	this.hideTip = function(idx){
		var tipPanel = _getTipPanel(idx);
		tipPanel.hide();
		
		m_asynData.start = false;
		m_asynData.tipobj = null;
	};
	
	this.addTip = function(dom,msg,rectinfos){
		return _AddTip(dom, msg, rectinfos);
	};
	
	this.delTip = function(tipid){
		_DelTip(tipid);
	};
	
	this.getTipById = function(tipid){
		return m_tips[tipid];
	};
	
	this.getSize = function(idx){
		var tipPanel = _getTipPanel(idx);
		return tipPanel.getSize();
	};
	
	this.setCallerData = function(tipid, caller, data){
		_setCallerData(tipid, caller, data);
	};
	
	// private:method
	var _create = function(){
		if ( !m_initok ){
			m_initok = true;
			
			m_tippanels.push( TooltipPanel.snew(m_g) );
			m_tippanels.push( TooltipPanel.snew(m_g) );
		}
	};
	
	var _AddTip = function(dom,msg,rectinfos){
		var tip = new Tip(m_g, m_this, dom, msg, rectinfos);
		var tipid = _getFreeTipId();
		m_tips[tipid] = tip;
		return tipid;
	};
	
	var _DelTip = function(tipid){
		var tip = m_tips[tipid];
		if ( tip ) {
			tip.destroy();
			_pushFreeTipId(tipid);
		}
		else {
			log('error _deltip id:'+tipid);
		}
	};
	
	var _getTipPanel = function(idx){
		if ( idx >= 0 && idx < m_tippanels.length ){
			return m_tippanels[idx];
		}
		
		return EmptyTooltipPanel;
	};
	
	var _setCallerData = function(tipId, caller, data){
		var tip = m_this.getTipById(tipId);
		tip.setCaller(caller);
		tip.setData(data);
	};
	
	var _getFreeTipId = function(){
		if ( m_freetipids.length > 0 ){
			return m_freetipids.pop();
		}
		else{
			m_lasttipid = (m_lasttipid < 0x7fffffff) ? (m_lasttipid + 1) : 1;
			return m_lasttipid;
		}
	};
	
	var _pushFreeTipId = function(id){
		m_freetipids.push(id);
	};
				
	//Tooltip-unittest-end
});

TTIP = Tooltip.snew();