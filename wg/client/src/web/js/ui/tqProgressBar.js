PROGBAR_SHOWFLAG_NONE = 0;
PROGBAR_SHOWFLAG_VAL = 1;
PROGBAR_SHOWFLAG_PER = 2;
PROGBAR_SHOWFLAG_CUSTOM = 3;

ProgressBarEx = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_range=100;
	var m_value=[0,0];
	var m_parent;
	var m_progressdom;
	var m_frontdom;
	var m_bardom=[null,null];
	var m_ops={count:1,showflag:1};
	var m_w;
	var m_h;
	var m_textdom;
	var m_textfrontdom;
	var m_customValCaller = null;
	var m_isMirror = false;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g, parent, ops){
		m_g = g;
		m_this = this;
		m_parent = parent;
		if ( ops ){
			TQ.dictCopy(m_ops, ops);
		}
		
		if ( !m_ops.uiback ) {
			m_ops.uiback = uiback.progress.comm;
		}
		
		if ( !m_ops.count ){
			m_ops.count = 1;
		}
		else if ( m_ops.count > m_value.length ){
			m_ops.count = m_value.length;
		}
		
		_init();
	};
	
	this.setRange = function(value){
		m_range = value;
		_resetBar();
	};
	
	this.getRange = function(){
		return m_range;
	};
	
	this.setValue = function(idx, value){
		m_value[idx] = value;
		_resetBar();
	};
	
	this.getValue = function(idx){
		return m_value[idx];
	};
	
	this.setColor = function(color){
		for ( var i=0; i<m_bardom.length; ++i ){
			if ( m_bardom[i] ) {
				TQ.setCSS(m_bardom[i], 'backgroundColor', color);
			}
		}
	};
	
	this.show = function(){
		TQ.setCSS(m_parent, 'display', 'block');
	};
	
	this.hide = function(){
		TQ.setCSS(m_parent, 'display', 'none');
	};
	
	this.setCustomValCaller = function(caller){
		m_customValCaller = caller;
	};
	
	this.setShowFlag = function(flag){
		m_ops.showflag = flag;
	};
	
	this.getText = function() {
		return TQ.getTextEx(m_textfrontdom);
	};
	
	this.setMirror = function(isMirror){
		m_isMirror = isMirror;
	};
	
	this.isMirror = function(){
		return m_isMirror;
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(){
		m_w = TQ.getDomWidth(m_parent);
		m_h = TQ.getDomHeight(m_parent);
		m_progressdom = TQ.createDom('div');
		TQ.setClass(m_progressdom, m_ops.uiback.backcls);
		TQ.setDomWidth(m_progressdom, m_w );
		TQ.setCSS(m_progressdom, 'position', 'absolute');
		TQ.append(m_parent, m_progressdom);
		
		m_frontdom = TQ.createDom('div');
		TQ.setCSS(m_frontdom, 'position', 'absolute');
		TQ.setCSS(m_frontdom, 'zIndex', 30);
		TQ.setDomWidth(m_frontdom, m_w );
		TQ.append(m_progressdom, m_frontdom);
		
		for ( var i=0; i<m_ops.count; ++i ){
			m_bardom[i] = TQ.createDom('div');
			TQ.setCSS(m_bardom[i], 'position', 'absolute');
			TQ.setCSS(m_bardom[i], 'left', m_ops.uiback.bar.l+'px');
			TQ.setCSS(m_bardom[i], 'top', m_ops.uiback.bar.t+'px');
			TQ.setDomWidth(m_bardom[i], m_w );
			TQ.setCSS(m_bardom[i], 'zIndex', i+20);
			TQ.append(m_progressdom, m_bardom[i]);
			TQ.setClass(m_bardom[i], i==0 ? m_ops.uiback.barcls : m_ops.uiback.secbarcls);
			TQ.fixIE6Png(m_bardom[i]);
		}
		_createUIFront();
	};
	
	var _createUIFront = function(){
		if ( m_ops.uiback.cls.length > 1 ){
			for ( var k in m_ops.uiback.cls ){
				var corner = TQ.createDom('div');
				TQ.setClass(corner, m_ops.uiback.cls[k]);
				TQ.append(m_frontdom, corner);
				TQ.fixIE6Png(corner);
			}
			
			var subnodes = m_g.getGUI().selectSubDiv(m_frontdom);
			if ( m_ops.uiback.type == 1 || m_ops.uiback.type == 2 ){
				m_textdom = subnodes[1];
			}
			else if ( m_ops.uiback.type == 3 ){
				m_textdom = subnodes[4];
			}
			
			m_g.getGUI().setUIBack(m_frontdom, m_w, m_h, m_ops.uiback.type);
		}
		else if ( m_ops.uiback.cls.length == 1 ) {
			TQ.setClass(m_frontdom, m_ops.uiback.cls[0]);
			TQ.fixIE6Png(m_frontdom);
			m_textdom = m_frontdom;
		}
		_createTextDom();
	};
	
	var _createTextDom = function(){
		if ( m_ops.showflag == 0 )  return;

		m_textfrontdom = TQ.createDom('div');
		TQ.setCSS(m_textfrontdom, 'position', 'absolute');
		TQ.setCSS(m_textfrontdom, 'zIndex', 2);
		TQ.setCSS(m_textfrontdom, 'color', '#ffffff');
		TQ.setDomPos(m_textfrontdom, 0, 0);
		
		TQ.append(m_textdom, m_textfrontdom);
	};
	
	var _resetBar = function(){
		_resetBarDomSize();
		_resetTextDomSize();
		_resetTextVal();
	};
	
	var _resetBarDomSize = function() {
		var barw = m_w - m_ops.uiback.bar.l - m_ops.uiback.bar.r;
		for ( var i=0; i<m_ops.count; ++i ){
			var w = parseInt(barw * m_value[i] / m_range, 10);
			w = (w > 0) ? w : 0;
			TQ.setDomWidth(m_bardom[i], w );
			if ( m_isMirror ) {
				TQ.setCSS(m_bardom[i], 'left', m_ops.uiback.bar.l + (barw - w) + 'px');
				m_bardom[i].style.backgroundPosition = (w-barw) + 'px 0px';
			}
		}
	};

	var _resetTextDomSize = function(){
		var left = m_ops.uiback.bar.l;
		var w = m_w - m_ops.uiback.bar.l - m_ops.uiback.bar.r;
		if ( TQ.isIE6() && (m_ops.uiback.type == 1 || m_ops.uiback.type == 3) ) {
			var cnodes = m_g.getGUI().selectSubDiv(m_frontdom);
			w = w - TQ.getDomWidth(cnodes[0]) - TQ.getDomWidth(cnodes[2]);
			left = left + TQ.getDomWidth(cnodes[0]);
		}
		if ( m_textfrontdom ) {
			TQ.setDomWidth(m_textfrontdom, w);
			TQ.setCSS(m_textfrontdom, 'left', left + 'px');
		}
	};
	
	var _resetTextVal = function(){
		var val = '';
		if ( m_ops.showflag == PROGBAR_SHOWFLAG_VAL ) {
			val = m_value[0]+'/'+m_range;
		} else if ( m_ops.showflag == PROGBAR_SHOWFLAG_PER ) {
			val = parseInt(m_value[0]*100/m_range) + '%';
		} else if ( m_ops.showflag == PROGBAR_SHOWFLAG_CUSTOM ) {
			val = m_customValCaller.caller.call(m_customValCaller.self, m_value[0], m_range);
		}

		if ( m_textfrontdom  ) {
			TQ.setText(m_textfrontdom, val);
		}
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};