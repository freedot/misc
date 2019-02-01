TIP_FLAG = {
	COMM : 0,
	CUSTOM : 1,
	TIMER : 2 // 每秒刷新一次
};

Tip = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_TWPACE = 15;
	_lc_.C_THPACE = 28;
	_lc_.C_TWOTIP_WSPACE = 5;
	
	//-----------
	//private:data
	//-----------
	_lc_.m_g = null;
	var m_this = null;
	var m_mgr = null;
	_lc_.m_dom = null;
	_lc_.m_tipMsgs = [];
	var m_rectinfos = null;
	_lc_.m_caller = null;
	var m_data = null;
	_lc_.m_setok = false;
	var m_flag = TIP_FLAG.COMM;
	_lc_.m_lastPos = {x:0, y:0};

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g,mgr,dom,msg,rectinfos){
		_lc_.m_g = g;
		m_this = this;
		_lc_.m_setok = false;
		m_mgr = mgr;
		_lc_.m_dom = dom;
		if ( msg && TQ.trim(msg) != '' ) {
			_lc_.m_tipMsgs.push(msg);
		}
		m_rectinfos = rectinfos;
		_lc_._init();
	};
	
	this.destroy = function(){
		_lc_._destroy();
	};
	
	this.setFlag = function(flag){
		m_flag = flag;
	};
	
	this.getFlag = function(){
		return m_flag;
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.setData = function(data){
		m_data = data;
	};
	
	this.reset = function(){
		_lc_.m_setok = false;
	};
	
	this.resetTipContent = function(){
		_lc_.m_setok = false;
		_lc_._setTipContent();
	};
	
	this.show = function(pos){
		_lc_._startTimer();
		_lc_._setTipContentAndShow(pos);
	};
	
	this.hide = function(){
		_lc_._hideTip();
	};
	
	this.getTip = function(){
		this.resetTipContent();
	};
	
	this.getTipMsg = function(){
		if (_lc_.m_tipMsgs.length == 0){
			return '';
		}
		else{
			return _lc_.m_tipMsgs[0];
		}
	};
	
	this.getLastPos = function(){
		return _lc_.m_lastPos;
	};
	
	//--------------
	// private:method
	//--------------
	_lc_._init = function(){
		if ( m_flag != TIP_FLAG.CUSTOM ){
			TQ.addEvent(_lc_.m_dom,'mouseover',_lc_._onMouseOver);
			TQ.addEvent(_lc_.m_dom,'mouseout',_lc_._onMouseOut);
			TQ.addEvent(_lc_.m_dom,'mousemove',_lc_._onMouseMove);
		}
	};
	
	_lc_._onMouseOver = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		_lc_._innerShowTip(e);
	};
	
	_lc_._onMouseMove = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		_lc_._innerShowTip(e);
	};
	
	_lc_._onMouseOut = function(e){
		if ( m_flag == TIP_FLAG.CUSTOM ){
			return;
		}
		
		e = e ? e : window.event;
		_lc_._hideTip();
		TQ.stopPropagation(e);
	};	
	
	_lc_._startTimer = function(){
		if ( m_flag == TIP_FLAG.TIMER ){
			_lc_.m_g.regUpdater(m_this, _lc_._onTimer, 1000);
		}
	};
	
	_lc_._stopTimer = function(){
		if ( m_flag == TIP_FLAG.TIMER ){
			_lc_.m_g.unregUpdater(m_this, _lc_._onTimer);
		}
	};
	
	_lc_._onTimer = function(){
		m_this.reset();
		_lc_._setTipContentAndShow(_lc_.m_lastPos);
	};
	
	_lc_._innerShowTip = function(e){
		e = e ? e : window.event;
		_lc_._startTimer();
		_lc_._setTipContentAndShow(TQ.mouseCoords(e));
		TQ.stopPropagation(e);
	};
	
	_lc_._setTipContentAndShow = function(pos){
		_lc_._setTipContent();
		if ( !_lc_._isEmptyTipMsg() ) {
			_lc_._showTip(pos);
		}
	};
	
	_lc_._setTipContent = function(){
		if ( _lc_.m_setok ){
			return;
		}
		
		_lc_._initTipMsgsListByCaller();
		
		if ( _lc_._isEmptyTipMsg() ) {
			return;
		}
		
		for (var idx=0; idx<_lc_.m_tipMsgs.length; ++idx ) {
			m_mgr.setTipContent(idx, _lc_.m_tipMsgs[idx], m_this);
		}
		
		_lc_.m_setok = true;
	};
	
	_lc_._isEmptyTipMsg = function() {
		return _lc_.m_tipMsgs.length == 0 ;
	};	
	
	_lc_._initTipMsgsListByCaller = function(){
		if ( !_lc_.m_caller ) {
			return;
		}
		
		var msg = _lc_.m_caller.caller.call(_lc_.m_caller.self, m_data);
		_lc_.m_tipMsgs = [];
		if ( typeof(msg) == 'string' ) {
			var msgs = msg.split('<split>');
			for ( var k in msgs ) {
				if ( !msgs[k] ) {
					continue;
				}
				
				if ( TQ.trim( msgs[k] ) == '' ) {
					continue;
				}
				
				_lc_.m_tipMsgs.push(msgs[k]);
			}
		}
		else if (msg) {
			_lc_.m_tipMsgs.push(msg);
		}
	};
	
	_lc_._hideTip = function(){
		_lc_._stopTimer();
		
		_lc_.m_setok = false;
		if ( !_lc_._isEmptyTipMsg() ) {
			m_mgr.hideTip(0);
			m_mgr.hideTip(1);
		}
	};
	
	_lc_._showTip = function(pos){
		_lc_.m_lastPos.x = pos.x;
		_lc_.m_lastPos.y = pos.y;
		var mouseSize = {cx:C_TWPACE, cy:_lc_.C_THPACE};
		var adjustPos = TQ.getAdjustPosByWinSize({x:pos.x-_lc_._getTipsOffsetLeftW(), y:pos.y}, _lc_._getAllTipsSize(), mouseSize);
		var poss = _lc_._getAllTipsPoss(adjustPos);
		for ( var i=0; i<poss.length; ++i ) {
			m_mgr.showTip(i, poss[i]);
		}
	};
	
	_lc_._getAllTipsSize = function(){
		var retSize = {cx:0, cy:0};
		for (var idx=0; idx<_lc_.m_tipMsgs.length; ++idx ) {
			var size = m_mgr.getSize(idx);
			if (retSize.cx > 0) {
				retSize.cx += _lc_.C_TWOTIP_WSPACE;
			}
			retSize.cx += size.cx;
			
			if (retSize.cy < size.cy) {
				retSize.cy = size.cy;
			}
		}
		return retSize;
	};
	
	_lc_._getAllTipsPoss = function(pos){
		var x = pos.x;
		var retPoss = [];
		for (var i=0; i<_lc_.m_tipMsgs.length; ++i ) {
			var size = m_mgr.getSize(i);
			retPoss.push({x:x, y:pos.y});
			x += size.cx  + _lc_.C_TWOTIP_WSPACE;
		}
		return retPoss;
	};
	
	_lc_._getTipsOffsetLeftW = function(){
		var w = 0;
		for (var i=0; i<_lc_.m_tipMsgs.length-1; ++i ) {
			w += m_mgr.getSize(i).cx;
		}
		return w;
	};
	
	_lc_._destroy = function(){
		if ( m_flag != TIP_FLAG.CUSTOM ){
			TQ.removeEvent(_lc_.m_dom,'mouseover',_lc_._onMouseOver);
			TQ.removeEvent(_lc_.m_dom,'mouseout',_lc_._onMouseOut);
			TQ.removeEvent(_lc_.m_dom,'mousemove',_lc_._onMouseMove);
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_WSPACE = 20;
	_lc_.C_HSPACE = 10;	
	
	_lc_.m_g = null;
	_lc_.m_frontPanel = null;
	_lc_.m_backPanel = null;
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_._create();
	};
	
	this.setContent = function(content){
		_lc_._removeLastChilds();
		_lc_._setContent(content);
		_lc_._resetBackPanelSize();
	};
	
	this.show = function(pos){
		_lc_.m_backPanel.show({x:pos.x-_lc_.C_WSPACE/2,y:pos.y-_lc_.C_HSPACE/2});
		_lc_.m_frontPanel.show(pos);
	};
	
	this.hide = function(){
		_lc_.m_backPanel.hide();
		_lc_.m_frontPanel.hide();	
	};
	
	this.getSize = function(){
		var backDom = _lc_.m_backPanel.getDom();
		return {cx:TQ.getDomWidth(backDom), cy:TQ.getDomHeight(backDom)};	
	};
	
	_lc_._removeLastChilds = function(){
		var frontDom = _lc_.m_frontPanel.getDom();
		while(frontDom.lastChild){
			frontDom.removeChild(frontDom.lastChild);
		}
	};
	
	_lc_._setContent = function(content){
		var frontDom = _lc_.m_frontPanel.getDom();
		if ( typeof(content) == 'string' ) {
			TQ.setHtml(frontDom, content);
		}
		else{
			TQ.append(frontDom, content);
		}
	};
	
	_lc_._resetBackPanelSize = function(){
		var w = _lc_.m_frontPanel.getWidth()+_lc_.C_WSPACE;
		var h = _lc_.m_frontPanel.getHeight()+_lc_.C_HSPACE;
		var backDom = _lc_.m_backPanel.getDom();
		_lc_.m_g.getGUI().setUIBack(backDom, w, h, uiback.tooltip.tip.type);	
	};
	
	_lc_._create = function() {
		_lc_.m_frontPanel = new PopPanel(_lc_.m_g,{zindex:UI_ZORDER_TOOLTIP+1});
		_lc_.m_backPanel = new PopPanel(_lc_.m_g,{zindex:UI_ZORDER_TOOLTIP});
		
		_lc_.m_frontPanel.hide();
		_lc_.m_backPanel.hide();
			
		var frontDom = _lc_.m_frontPanel.getDom();
		TQ.setClass(frontDom, 'ui-tooltip');	
		
		var backDom = _lc_.m_backPanel.getDom();
		TQ.setClass(backDom,'ui-tipback');
		
		_lc_._createBack(backDom, uiback.tooltip.tip.cls);
	};
	
	_lc_._createBack = function(backParent, cls){
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g;
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
		_lc_.m_g = g;
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
			
			m_tippanels.push( TooltipPanel.snew(_lc_.m_g) );
			m_tippanels.push( TooltipPanel.snew(_lc_.m_g) );
		}
	};
	
	var _AddTip = function(dom,msg,rectinfos){
		var tip = new Tip(_lc_.m_g, m_this, dom, msg, rectinfos);
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