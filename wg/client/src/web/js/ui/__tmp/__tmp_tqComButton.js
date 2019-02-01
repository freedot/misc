/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
BTN_TYPE = {
	COMM : 0 // 普通按钮
	,CHECK : 1 // check按钮
	,TIMER : 2  // timer按钮，按下后会持续发送click事件
	,DELAY : 3  // delay按钮
};

ButtonBlinking = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_DRTTIME = 250;
	_lc_.m_this = null;
	_lc_.m_timer = null;
	_lc_.m_interval = 0;
	_lc_.m_curtime = 0;
	_lc_.m_isBlinkingFrame = false;
	_lc_.m_resetStatusCaller = null;
	
	this.init = function(resetStatusCaller){
		_lc_.m_this = this;
		_lc_.m_resetStatusCaller = resetStatusCaller;
	};
	
	this.start = function(interval){
		if ( !_lc_.m_timer ){
			_lc_.m_timer = window.setInterval(_lc_._onTimer, _lc_.C_DRTTIME);
		}
		
		_lc_.m_interval = (interval > 0) ? interval : 0x7fffffff;
		_lc_.m_curtime = 0;
	};
	
	this.stop = function(){
		_lc_._setBlinkingFrameFlag(false);
		_lc_._killTimer();
		_lc_._resetBtnStatus();
	};
	
	this.isBlinkingFrame = function(){
		return _lc_.m_isBlinkingFrame;
	};
	
	_lc_._onTimer = function(){
		_lc_.m_isBlinkingFrame = !_lc_.m_isBlinkingFrame;
		
		_lc_.m_curtime += _lc_.C_DRTTIME;
		if ( _lc_.m_curtime > _lc_.m_interval ) { 
			_lc_.m_this.stop();
		}
		else {
			_lc_._resetBtnStatus();
		}
	};
	
	_lc_._setBlinkingFrameFlag = function(isBlinkingFrame){
		_lc_.m_isBlinkingFrame = isBlinkingFrame;
	};
	
	_lc_._killTimer = function(){
		if (_lc_.m_timer) {
			window.clearInterval(_lc_.m_timer);
			_lc_.m_timer = null;
		}	
	};
	
	_lc_._resetBtnStatus = function(){
		_lc_.m_resetStatusCaller.caller.call(_lc_.m_resetStatusCaller.self);
	};
	//ButtonBlinking-unittest-end
});

NullButton = Class.extern(function(){
	this.clearCaller = function(){};
	this.resetUIBack = function(uiBackRes){};
	this.getUIBack = function(){ return {}; };
	this.setCaller = function(caller) {};
	this.setCallerEx = function(caller) {};
	this.appendCaller = function(caller){};
	this.unsetCaller = function(caller){};
	this.setId = function(id) {};
	this.getId = function(){return 0;};
	this.setClass = function(cls) {};
	this.setText = function(text) {};
	this.getText = function() {return '';};
	this.setType = function(type) {};
	this.getType = function(){ return 0;};
	this.setPress = function(press) {};
	this.isPress = function(){return false;};
	this.getWidth = function(){return 0;};
	this.enable = function(enable){};
	this.setDisableCanClick = function(flag){};
	this.show = function(){};
	this.hide = function(){};
	this.visible = function(){};
	this.hidden = function(){};
	this.getDom = function(){return null;};	
	this.isShow = function(){return true;};
	this.getParent = function(){return null;};
	this.setDelay = function(delayMs){ };
	this.getDelay =  function(){};
	this.isEnable = function(){return true;};
	this.click = function(){};
	this.startBlinking = function(interval){};
	this.stopBlinking = function(){};		
});

ComButton = function(){
	//private:const
	var C_INTERVAL = 80;
	
	//private:data
	var m_g;
	var m_this;
	var m_dom;
	var m_btn;
	var m_btntext;
	var m_btntextparent;
	var m_callers=[];
	var m_ispress;
	var m_inrect;
	var m_id;
	var m_type;
	var m_enable;
	var m_timer;
	var m_dtimer;
	var m_event=null;
	var m_starttime=0;
	var m_uibackres = uiback.btn.comm;
	var m_isshow;
	var m_delayMs=1000;	
	var m_bakposition = 'static';
	var m_bakzindex = '0';
	var m_disableCanClick = false;	
	var m_mousedown = false;
	var m_buttonBlinking = null;
	var m_newFlag = null;
	var m_isShowNewFlag = false;
	var m_newFlagPos = {x:0, y:0};
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g,dom,ops){
		m_g = g;
		m_dom = dom;
		m_this = this;
		m_id = 0;
		m_type = BTN_TYPE.COMM;
		m_enable = true;
		m_ispress = false;
		m_inrect = false;
		m_isshow = true;
		m_event = null;
		m_posEvent = null;
		m_btn = TQ.createDom('div');
		TQ.append(m_dom, m_btn);
		if ( ops && ops.uiback ){
			m_uibackres = ops.uiback;
		}
		_createUIBack();
		_initEvent();
		_resetStatus();
	};
	
	this.clearCaller = function(){
		m_callers = [];
	};
	
	this.resetUIBack = function(uiBackRes){
		if ( m_uibackres == uiBackRes ) return;
		m_uibackres = uiBackRes;
		_resetStatus();
	};
	
	this.getUIBack = function(){
		return m_uibackres;
	};
	
	/** 设置click的回调 */
	this.setCaller = function(caller) {
		if ( caller ){
			if ( !_isCallerExist(caller) ){
				m_callers.push(caller);
			}
			_resetStatus();
		}
	};
	
	/** 设置click的回调, 同时清除掉以前的 */
	this.setCallerEx = function(caller) {
		if ( caller ){
			m_callers = [caller];
			_resetStatus();
		}
	};
	
	this.appendCaller = function(caller){
		if ( caller ){
			if ( !_isCallerExist(caller) ){
				m_callers.push(caller);
			}
			_resetStatus();
		}
	};
	
	/** 取消一个回调注册 */
	this.unsetCaller = function(caller){
		if ( TQ.find(m_callers, null, caller) ){
			TQ.removeElement(m_callers, TQ.getLastFindIdx());
		}
	};
	
	/** 设置id */
	this.setId = function(id) {
		m_id = id;
	};
	
	/** 获得id */
	this.getId = function(){
		return m_id;
	};
	
	/** 设置class */
	this.setClass = function(cls) {
		log(cls.normal+','+cls.press);
	};
	
	/** 设置btn文本 */
	this.setText = function(text) {
		TQ.setHtml(m_btntext,text);
		var pl = TQ.getTextWidth(text);
		if ( m_btn != m_btntextparent && pl > 0 ){
			TQ.setDomWidth(m_btntextparent, pl );
		}
		
		//_updateBtnTextSize();
		m_g.getGUI().setUIBack(m_btn, -1, -1, m_uibackres.type);
	};
	
	this.getText = function() {
		return m_btntext.innerHTML;
	};
	
	/** 设置按钮类型 */
	this.setType = function(type) {	
		m_type = type;
	};
	
	this.getType = function(){
		return m_type;
	};
	
	/** 设置按下状态 */
	this.setPress = function(press) {
		m_ispress = press;
		_resetStatus();
	};
	
	/** 返回是否按下状态 */
	this.isPress = function(){
		return m_ispress;
	};
	
	/** 获得按钮的宽度 */
	this.getWidth = function(){
		return TQ.getDomWidth(m_btn);
	};
	
	/** 使按钮可用或不可用 */
	this.enable = function(enable){
		if ( m_type == BTN_TYPE.DELAY && !m_enable ){
			return;
		}
		_enable(enable);
	};
	
	this.setDisableCanClick = function(flag){
		m_disableCanClick = flag;
	};
	
	this.show = function(){
		TQ.setCSS(m_btn, 'display', 'block');
		m_isshow = true;
	};
	
	this.hide = function(){
		TQ.setCSS(m_btn, 'display', 'none');
		m_isshow = false;
	};
	
	this.visible = function(){
		TQ.setCSS(m_btn, 'visibility', 'visible');
		m_isshow = true;
	};
	
	this.hidden = function(){
		TQ.setCSS(m_btn, 'visibility', 'hidden');
		m_isshow = false;
	};
	
	this.getDom = function(){
		return m_btn;
	};
	
	this.isShow = function(){
		return m_isshow;
	};
	
	this.getParent = function(){
		return m_dom;
	};
	
	this.setDelay = function(delayMs){
		m_delayMs = delayMs;
	};
	
	this.getDelay =  function(){
		return m_delayMs;
	};
	
	this.isEnable = function(){
		return m_enable;
	};
	
	this.click = function(){
		if ( m_type == BTN_TYPE.CHECK ) {
			m_ispress = !m_ispress;
		}
		_callBackCallers();
		_resetStatus();
	};
	
	this.startBlinking = function(interval){
		if ( !m_buttonBlinking ) {
			m_buttonBlinking = ButtonBlinking.snew({self:m_this, caller:_resetStatus});
		}
		m_buttonBlinking.start(interval);
	};
	
	this.stopBlinking = function(){
		if (m_buttonBlinking){
			m_buttonBlinking.stop();
		}
	};
	
	this.setNewFlag = function(newFlag){
		if ( newFlag && m_uibackres.newFlag ) {
			if ( !m_newFlag ) {
				m_newFlag = TQ.createDom('div');
				TQ.append(m_btn, m_newFlag);
				TQ.setClass(m_newFlag, m_uibackres.newFlag.cls);
				var domPos = TQ.domOffset(m_dom);
				var btnPos = TQ.domOffset(m_btn);
				var btnOffset = {left:btnPos.left - domPos.left, top:btnPos.top - domPos.top};
				if (m_uibackres.newFlag.pos) {
					m_newFlagPos.x = btnOffset.left + m_uibackres.newFlag.pos.x;
					m_newFlagPos.y = btnOffset.top + m_uibackres.newFlag.pos.y;
				} else {
					var flagw = TQ.getDomWidth(m_newFlag);
					var btnw = TQ.getDomWidth(m_btn);
					var left = btnw - flagw;
					m_newFlagPos.x = btnOffset.left + left;
					m_newFlagPos.y = 0;
				}
				TQ.setDomPos(m_newFlag, m_newFlagPos.x, m_newFlagPos.y);
			}
			TQ.setCSS(m_newFlag, 'display', 'block');
			m_isShowNewFlag = true;
		} else {
			if ( m_newFlag ) {
				TQ.setCSS(m_newFlag, 'display', 'none');
				m_isShowNewFlag = false;
			}
		}
	};
	
	this.getNewFlag = function(){
		return m_isShowNewFlag;
	};

	//--------------
	// private:method
	//--------------
	var _initEvent = function(){
		if ( m_uibackres.type == 0 ){
			_initOneDomEvent(m_btn);
		}
		else {
			var cnodes = m_btn.childNodes;
			for ( var i=0; i<cnodes.length; ++i ){
				_initOneDomEvent(cnodes[i]);
			}
		}
	};
	
	var _initOneDomEvent = function(dom){
		TQ.addEvent(dom, 'dragstart', function(e){return false;});
		TQ.addEvent(dom, 'selectstart', function(e){return false;});
		TQ.addEvent(dom,'mouseover',_onMouseOver);
		TQ.addEvent(dom,'mouseout',_onMouseOut);
		TQ.captureMouseEvent(dom, {self:m_this, mouseDown:_onMouseDown, mouseUp:_onMouseUp});
		TQ.captureTouchEvent(dom, {self:m_this, touchStart:_onTouchStart, touchEnd:_onTouchEnd, touchCancel:_onTouchEnd});
	};
	
	var _isCallerExist = function(caller){
		for ( var i=0; i<m_callers.length; ++i ){
			if ( m_callers[i].self == caller.self && m_callers[i].caller == caller.caller ){
				return true;
			}
		}
		return false;
	};
	
	var _enable = function(enable){
		m_enable = enable;
		_resetStatus();
	};
	
	var _onTouchStart = function(e, touch, element){
		_startClick(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
		m_inrect = true;
	};
	
	var _onTouchEnd = function(e, touch, element){
		_endClick(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
		m_inrect = false;
	};
	
	var _onMouseDown = function(e){
		_startClick(e);
	};
	
	var _onMouseUp = function(e){
		_endClick(e);
	};
	
	var _startClick = function(e){
		m_event = e ? e : window.event;
		if ( TQ.getBtnType(m_event) != BTN_LEFT )  return;
		if ( !m_enable ) return;
		
		if ( m_type == BTN_TYPE.CHECK ) {
			m_ispress = !m_ispress;
		}

		m_posEvent = TQ.cloneEvent(m_event);
		m_mousedown = true;
		TQ.stopPropagation(m_event);
		m_g.sendEvent({eid:EVT.MOUSEDOWN,sid:0,event:m_event});
		SoundMgr.playSound(res_sounds.clickBtnDown);
		
		_resetStatus();
		if ( m_type == BTN_TYPE.CHECK ) {
			_callBackCallers();
		}
		else if ( m_type == BTN_TYPE.TIMER && m_callers.length > 0 ){
			m_timer = window.setInterval(_onTimer, C_INTERVAL);
			m_starttime = 0;
		}
	};
	
	var _endClick = function(e){
		m_event = e ? e : window.event;
		if ( TQ.getBtnType(m_event) != BTN_LEFT ) {
			return;
		}
		
		_clearInterval(m_timer);
		m_timer = null;		
		
		if ( !m_enable ) {
			if ( m_disableCanClick ){
				_callCallersOnMouseUp();
			}
			return;
		}
		
		m_mousedown = false;
		TQ.stopPropagation(m_event);
		
		_callCallersOnMouseUp();
		
		if ( m_type == BTN_TYPE.DELAY ){
			_clearInterval(m_dtimer);
			m_dtimer = null;
			m_dtimer = window.setInterval(_onDelayTimer, m_delayMs);
			_enable(false);
		}
		
		_resetStatus();
		SoundMgr.playSound(res_sounds.clickBtnUp);
	};
	
	var _callCallersOnMouseUp = function(){
		if ( !m_inrect ) return;
		if ( m_type == BTN_TYPE.CHECK ) return;
		_callBackCallers();
	};
	
	var _onMouseOver = function(e){
		m_event = e ? e : window.event;
		TQ.stopPropagation(m_event);
		m_inrect = true;
		if ( !m_enable ) return;
		_resetStatus();
	};
	
	var _onMouseOut = function(e){
		m_event = e ? e : window.event;
		//TQ.stopPropagation(m_event); //??? 打开此句对button上的tooltip有影响
		m_inrect = false;
		if ( !m_enable ) return;
		_resetStatus();
	};
	
	var _resetStatus = function() {
		if ( !m_enable ) {
			_setUIBack('disable', m_uibackres.cls.disable);
			return;
		}
		
		if ( m_type == BTN_TYPE.CHECK ) {
			_resetCheckBtnStaus();
		}
		else {
			_resetCommBtnStaus();
		}
	};
	
	var _resetCheckBtnStaus = function(){
		var clsType = _getSafeBtnClass('normal');
		if ( m_ispress && _isBlinkingFrame() ){	
			clsType = _getSafeBtnClass('pressblinking');
		}
		else if ( _isBlinkingFrame() ){	
			clsType = _getSafeBtnClass('blinking');
		}
		else if ( m_ispress && m_inrect ){
			clsType = _getSafeBtnClass('presshot');
		}
		else if ( m_ispress ) {
			clsType = _getSafeBtnClass('press');
		}
		else if ( m_inrect ) {
			clsType = _getSafeBtnClass('hot');
		}
		_setUIBack( clsType.name, clsType.cls );
	};
	
	var _resetCommBtnStaus = function(){
		var clsType = _getSafeBtnClass('normal');
		if ( _isBlinkingFrame() ){	
			clsType = _getSafeBtnClass('blinking');
		}
		else if ( m_mousedown && m_inrect ) {
			clsType = _getSafeBtnClass('press');
		}
		else if ( m_inrect ) {
			clsType = _getSafeBtnClass('hot');
		}
		_setUIBack( clsType.name, clsType.cls );
	};
	
	var _getSafeBtnClass = function(name){
		if ( m_uibackres.cls[name] ) return {name:name, cls:m_uibackres.cls[name]};
		
		if ( name == 'blinking' ) return _getSafeBtnClass('hot');
		if ( name == 'presshot' ) return _getSafeBtnClass('press');
		if ( name == 'pressblinking' ) return _getSafeBtnClass('press');
		if ( name == 'hot' ) return _getSafeBtnClass('normal');
		if ( name == 'press' ) return _getSafeBtnClass('normal');
		
		return _getSafeBtnClass('normal');
	};
	
	var _isBlinkingFrame = function(){
		if (!m_buttonBlinking) return false;
		return m_buttonBlinking.isBlinkingFrame();
	};
	
	var _onDelayTimer = function(){
		_clearInterval(m_dtimer);
		m_dtimer = null;
		_enable(true);
	};
	
	var _onTimer = function(){
		if ( m_starttime < 3 ){
			++m_starttime;
			return;
		}
		
		_callBackCallers();
	};
	
	var _clearInterval = function(timer){
		if ( timer ){
			window.clearInterval(timer);
			timer = null;
		}
	};
	
	var _createUIBack = function(){
		m_btntext = m_btn;
		if ( m_uibackres.type > 0 ){
			TQ.appendClass(m_btn, 'ui-back');
			var ns = m_uibackres.cls.normal;
			for ( var i in ns ){
				var div = TQ.createDom('div');
				TQ.append(m_btn,div);
			}
		}
			
		if ( m_uibackres.type == 1 || m_uibackres.type == 2 ){
			m_btntext = m_btn.childNodes[1];
		}
		else if ( m_uibackres.type == 3 ){
			m_btntext = m_btn.childNodes[4];
		}
		
		m_btntextparent = m_btntext;
		
		if ( _isLowVerIE() ){
			m_btntext = TQ.createDom('div');
			TQ.append(m_btntextparent, m_btntext);
			m_btntext.style.textAlign = 'center';
			m_btntext.style.whiteSpace = 'nowrap';
		}
	
		//_updateBtnTextSize();
		if ( TQ.isIE() ) {
			// ie下如何描边
		} else {
			TQ.appendClass(m_btntext, 'black_edge');
		}
	};
	
	var _setUIBack = function(clsName, cls){
		if ( cls.length == 1 ){
			TQ.setClass(m_btn, cls[0]);
		}
		else {
			var cnodes = m_btn.childNodes;
			for ( var i=0; i<cls.length; ++i ){
				TQ.setClass(cnodes[i], cls[i]);
			}
		}
		
		_updateBtnTextSize();
		if ( TQ.isIE() ) {
			// ie下如何描边
		} else {
			TQ.appendClass(m_btntext, 'black_edge');
		}
		
		_setNewFlagPos(clsName);
	};
	
	var _setNewFlagPos = function(clsName){
		if ( !m_isShowNewFlag ) return;
		if ( !m_uibackres.newFlag.offsets ) return;
		var offset = m_uibackres.newFlag.offsets[clsName];
		if ( !offset ) {
			TQ.setDomPos(m_newFlag, m_newFlagPos.x, m_newFlagPos.y);
		} else {
			TQ.setDomPos(m_newFlag, m_newFlagPos.x + offset.x , m_newFlagPos.y + offset.y);
		}
	};
	
	var _callBackCallers = function(){
		for ( var i=m_callers.length-1; i>=0; --i ){
			var caller = m_callers[i];
			//try{
				caller.caller.call(caller.self, m_id, m_posEvent);
			//}
			//catch(e){
			//	alert(e.description);
			//}
		}
	};
	
	var _isLowVerIE = function(){
		return false;
		return (TQ.isIE6() || TQ.isIE7() || TQ.isIE8());
	};
	
	var _updateBtnTextSize = function(){
		if (m_btntextparent == m_btntext) return;
		TQ.setDomSize(m_btntext, TQ.getDomWidth(m_btntextparent), TQ.getDomHeight(m_btntextparent));
	};
	
	// call constructor
	this.init.apply(this, arguments);
};

BLINKING_TYPE = {
	INSERT : 0 // 当前的blinking要插入到被绑定的dom中
	,FLOAT : 1 // 当前的blinking要浮动在被绑定的dom上
};
BlinkingPanel = Class.extern(function(){
	//-----------
	//private:const
	//-----------
	var C_DRTTIME = 50;
	var C_BW = 2;

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_timer;
	var m_interval;
	var m_curtime;
	var m_parent;
	var m_binddom;
	var m_dom;
	var m_x;
	var m_y;
	var m_w;
	var m_h;
	var m_type;
	var m_lastdomoff = {left:-1000,top:-1000};
	var m_ops = {color:'#ffff00',borderw:C_BW};
	var m_absrect = {x:0,y:0,w:0,h:0};
	var m_isbinded;
	var m_caller;
	var m_borderw = C_BW;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g,ops){
		m_g = g;
		m_this = this;
		m_isbinded = false;
		m_type = BLINKING_TYPE.FLOAT;
		if ( ops && ops.color ){
			m_ops.color = ops.color;
		}
		if ( ops && ops.borderw ){
			m_ops.borderw = ops.borderw;
		}
		if ( ops && ops.bakImgs ){
			m_ops.bakImgs = ops.bakImgs;
		}
		m_borderw = m_ops.borderw;
		m_dom = TQ.createDom('div');
		TQ.setCSS(m_dom, 'zIndex', isNull(ops.zIndex) ? UI_ZORDER_TOOLTIP : ops.zIndex);
		TQ.setCSS(m_dom, 'position', 'absolute');
		TQ.setCSS(m_dom, 'left', '0px');
		TQ.setCSS(m_dom, 'top', '0px');
		TQ.setDomWidth(m_dom, 0);
		TQ.setDomHeight(m_dom, 0);
		
		if ( ops.bakImgs ) {
			_createImgRect(ops.bakImgs, 1, 1, 1, 1);
		} else {
			_createRect(1,1,1,1,1);
		}
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 绑定某个dom，在dom上面进行闪烁 */
	this.bind = function(parent, dom, type, x, y, w, h){
		this.unbind();
		m_parent = parent;
		m_binddom = dom;
		m_type = BLINKING_TYPE.INSERT;
		if ( type ){
			m_type = type;
		}
		m_x = 0;
		if ( x ){
			m_x = x;
		}
		m_y = 0;
		if ( y ){
			m_y = y;
		}
		m_w = w;
		if ( !w ){
			m_w = TQ.getDomWidth(m_dom);
		}
		m_h = h;
		if ( !h ){
			m_h = TQ.getDomHeight(m_dom);
		}
	
		TQ.append(m_parent, m_dom);
		
		if ( m_type == BLINKING_TYPE.FLOAT ){
			_setFloatPos();
		} else if (m_ops.bakImgs) {
			_setImgRect(m_x, m_y, m_w, m_h);
		} else {
			_setRect(m_x, m_y, m_w, m_h, m_borderw);
		}
		TQ.setCSS(m_dom, 'display', 'none');
		m_isbinded = true;
	};
	
	this.unbind = function(){
		this.stop();
		if ( m_isbinded ){
			TQ.remove(m_parent, m_dom);
			m_isbinded = false;
		}
		m_lastdomoff = {left:-1000,top:-1000};
		m_absrect = {x:0,y:0,w:0,h:0};
	};
	
	this.start = function(interval){
		if ( !m_timer ){
			m_timer = window.setInterval(_onTimer, C_DRTTIME);
		}
		m_interval = interval;
		if ( m_interval == -1 ){
			m_interval = 0x7fffffff;
		}
		m_curtime = 0;
		TQ.setCSS(m_dom, 'display', 'block');
	};
	
	this.stop = function(){
		if (m_timer) {
			window.clearInterval(m_timer);
			m_timer = null;
		}
		TQ.setCSS(m_dom, 'display', 'none');
	};
	
	this.getRect = function(){
		return m_absrect;
	};
	
	this.isStart = function(){
		return (m_timer != null);
	};
	
	//--------------
	// private:method
	//--------------
	var _setFloatPos = function(){
		var parentoff = TQ.domOffset(m_parent);
		var domoff = TQ.domOffset(m_binddom);
		domoff.left = domoff.left - parentoff.left;
		domoff.top = domoff.top - parentoff.top;
		if ( m_lastdomoff.top != domoff.top || m_lastdomoff.left != domoff.left ){
			if (m_ops.bakImgs) {
				_setImgRect(domoff.left+m_x, domoff.top+m_y, m_w, m_h);
			} else {
				_setRect(domoff.left+m_x, domoff.top+m_y, m_w, m_h, m_borderw);
			}
			m_lastdomoff.top = domoff.top;
			m_lastdomoff.left = domoff.left;
		}
	};
	
	var _onTimer = function(){
		var drt = 0;
		m_curtime += (C_DRTTIME + drt);
		if ( m_curtime >= m_interval ){
			m_this.stop();
			TQ.setCSS(m_dom, 'opacity', 0);
			if ( m_caller ){
				m_caller.caller.call(m_caller.self, 0);
			}
			return;
		}
		
		if ( m_type == BLINKING_TYPE.FLOAT ){
			_setFloatPos();
		}
		
		var alpha = 60 + Math.floor(Math.cos(m_curtime*0.008)*40);
		TQ.setCSS(m_dom, 'opacity', alpha);
	};
	
	var _createRect = function(x,y,w,h,bw){
		for ( var i=0; i<4; ++i ){
			var subdom = TQ.createDom('div');
			TQ.append(m_dom, subdom);
			TQ.setCSS(subdom, 'backgroundColor', m_ops.color);
			TQ.setCSS(subdom, 'position', 'absolute');
			TQ.setCSS(subdom, 'overflow', 'hidden');
			TQ.setCSS(subdom, 'zIndex', (i+1));
		}
		_setRect(x,y,w,h,bw);
	};
	
	var _setRect = function(x,y,w,h,bw){
		var parentoff = TQ.domOffset(m_parent);
		m_absrect.x = parentoff.left+x;
		m_absrect.y = parentoff.top+y;
		m_absrect.w = w;
		m_absrect.h = h;
		TQ.setCSS(m_dom, 'left', x+'px');
		TQ.setCSS(m_dom, 'top', y+'px');
		var posinfo = [{x:0, y:0, w:w, h:bw}, // top line
			{x:0, y:h-bw, w:w, h:bw},  // bottom line
			{x:0, y:0, w:bw, h:h}, // left line
			{x:w-bw, y:0, w:bw, h:h}]; // right line
		for ( var i=0, n=posinfo.length; i<n; ++i ){
			var p = posinfo[i];
			var c = m_dom.childNodes[i];
			TQ.setCSS(c, 'left', p.x+'px');
			TQ.setCSS(c, 'top', p.y+'px');
			TQ.setDomWidth(c, p.w );
			TQ.setDomHeight(c, p.h );
		}
		
		if ( TQ.getBrowserType() == BS_MSIE ){
			TQ.setDomWidth(m_dom, w );
			TQ.setDomHeight(m_dom, h );
		}
	};
	
	var _createImgRect = function(bakImgs, x,y,w,h){
		for ( var i=0; i<bakImgs.length; ++i ){
			var imgClass = bakImgs[i];
			var subdom = TQ.createDom('div');
			TQ.append(m_dom, subdom);
			TQ.setClass(subdom, imgClass);
		}
		_setImgRect(x,y,w,h);
	};
	
	var _setImgRect = function(x,y,w,h){
		var parentoff = TQ.domOffset(m_parent);
		m_absrect.x = parentoff.left+x;
		m_absrect.y = parentoff.top+y;
		m_absrect.w = w;
		m_absrect.h = h;
		TQ.setCSS(m_dom, 'left', x+'px');
		TQ.setCSS(m_dom, 'top', y+'px');
		
		var conner_w = 8;
		var conner_h = 8;
		var line_w = w - 2*conner_w;
		var line_h = h - 2*conner_h;
		
		var posinfo = [
			{x:0, y:0, w:w, h:h}
		];
		if (m_dom.childNodes.length == 8 ) {
			//0  1   2
			//3      4
			//5  6  7
			posinfo = [
				{x:0, y:0, w:conner_w, h:conner_h}
				,{x:conner_w, y:0, w:line_w, h:conner_h}
				,{x:conner_w+line_w, y:0, w:conner_w, h:conner_h}
				
				,{x:0, y:conner_h, w:conner_w, h:line_h}
				,{x:conner_w+line_w, y:conner_h, w:conner_w, h:line_h}
				
				,{x:0, y:conner_h+line_h, w:conner_w, h:conner_h}
				,{x:conner_w, y:conner_h+line_h, w:line_w, h:conner_h}
				,{x:conner_w+line_w, y:conner_h+line_h, w:conner_w, h:conner_h}
			];
		}
			
		for ( var i=0, n=posinfo.length; i<n; ++i ){
			var p = posinfo[i];
			var c = m_dom.childNodes[i];
			TQ.setDomRect(c, p.x, p.y, p.w, p.h);
		}
		
		if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ){
			TQ.setDomWidth(m_dom, w );
			TQ.setDomHeight(m_dom, h );
		}
	};
});

BlinkingCtrl = Class.extern(function(){
	//-----------
	//private:const
	//-----------
	var C_DRTTIME = 250;

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_timer;
	var m_interval;
	var m_curtime;
	var m_binddom;
	var m_isbinded;
	var m_caller;
	var m_isshow;
	var m_param;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_isbinded = false;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 绑定某个dom，在dom上面进行闪烁 */
	this.bind = function(dom, param){
		m_param = param;
		this.unbind();
		m_binddom = dom;
		m_isbinded = true;
	};
	
	this.unbind = function(){
		this.stop();
		m_binddom = null;
		m_isbinded = false;
	};
	
	this.getBind = function(){
		return m_binddom;
	};
	
	this.start = function(interval){
		if ( !m_timer ){
			m_timer = window.setInterval(_onTimer, C_DRTTIME);
		}
		m_interval = interval;
		if ( m_interval == -1 ){
			m_interval = 0x7fffffff;
		}
		m_curtime = 0;
		m_isshow = true;
	};
	
	this.stop = function(){
		if (m_timer) {
			window.clearInterval(m_timer);
			m_timer = null;
		}
		
		if ( m_binddom ){
			TQ.setCSS(m_binddom, 'opacity', 100);
		}
	};
	
	this.isStart = function(){
		return (m_timer != null);
	};
	
	//--------------
	// private:method
	//--------------
	var _onTimer = function(){
		var drt = 0;
		m_curtime += (C_DRTTIME + drt);
		if ( m_curtime >= m_interval ){
			m_this.stop();
			if ( m_caller ){
				m_caller.caller.call(m_caller.self, m_param);
			}
			return;
		}
		TQ.setCSS(m_binddom, 'opacity', m_isshow?100:0);
		m_isshow = !m_isshow;
	};
	
});