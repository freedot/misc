SpinBtn = function(){
	//-----------
	//private:const
	//-----------
	var C_ADD_BTN_ID = 1;
	var C_SUB_BTN_ID = -1;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_parent;
	var m_spindom_left;
	var m_spindom_right;
	var m_prevbtn;
	var m_nextbtn;
	var m_caller;
	var m_width = SCROLL_TRACE_W;
	var m_height = SCROLL_TRACE_MINH;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,parent){
		m_g = g;
		m_this = this;
		m_parent = parent;
	};
	
	this.createLeftBtn = function(){
		m_spindom_left = TQ.createDom('div');
		m_parent.appendChild(m_spindom_left);
		m_spindom_left.className = 'ui-spin';

		m_prevbtn = new ComButton(m_g, m_spindom_left, {uiback:uiback.btn.spinprev});
		m_prevbtn.setId(C_SUB_BTN_ID);
		m_prevbtn.setCaller({self:m_this, caller:_onBtnClick});
		m_prevbtn.setType(BTN_TYPE.TIMER);
	};
	
	this.createRightBtn = function(){
		m_spindom_right = TQ.createDom('div');
		m_parent.appendChild(m_spindom_right);
		m_spindom_right.className = 'ui-spin';

		m_nextbtn = new ComButton(m_g, m_spindom_right, {uiback:uiback.btn.spinnext});
		m_nextbtn.setId(C_ADD_BTN_ID);
		m_nextbtn.setCaller({self:m_this, caller:_onBtnClick});
		m_nextbtn.setType(BTN_TYPE.TIMER);		
	};
	
	this.setSize = function(w,h){
		m_width = w;
		m_height = h;
		_resetSize();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	//--------------
	// private:method
	//--------------	
	var _resetSize = function(){
		var prevdom = m_prevbtn.getDom();
		var nextdom = m_nextbtn.getDom();
		TQ.setDomWidth(prevdom, m_width);
		TQ.setDomWidth(nextdom, m_width);
		TQ.setDomHeight(prevdom, m_height );
		TQ.setDomHeight(nextdom, m_height );
		TQ.setDomSize(m_spindom_left, m_width, m_height);
		TQ.setDomSize(m_spindom_right, m_width, m_height);
	};
	
	var _onBtnClick = function(id){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, id);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

FilterInput = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_inputdom;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,inputdom){
		m_g = g;
		m_inputdom = inputdom;
	};
	
	/** 输入框种只能输入数字 */
	this.filter = function(nochars){
		_inputFilter(nochars);
	};	
	
	//--------------
	// private:method
	//--------------
	var _inputFilter = function(nochars){
		TQ.addEvent(m_inputdom,'keypress',function(e){
			e = e ? e : window.event;
			if (!e.charCode) k = String.fromCharCode(e.which);
			else k = String.fromCharCode(e.charCode);
			if (nochars.indexOf(k) != -1) e.preventDefault();
			if (e.ctrlKey&&k=='v') e.preventDefault();
		});
		TQ.addEvent(m_inputdom,'contextmenu',function(e){
			return false;
		});
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

NumInput = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_inputdom;
	var m_caller;
	var m_lastnum = -1;
	var m_min = 0;
	var m_max = 0xffffffff;
	var m_maxlength = 11;
	var m_getlimit = null;
	var m_getlimitCaller = null;
	var m_filter;
	var m_dirty = false;
	var m_ischangeevt = false;
	var m_id = 0;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,input,imin,imax,getlimit,maxlen){
		m_g = g;
		m_inputdom = input;
		TQ.addEvent(m_inputdom,'keyup',_onKeyup);
		TQ.addEvent(m_inputdom,'change',_onNumChange);
		m_min = imin ? imin : m_min;
		m_max = imax ? imax : m_max;
		m_maxlength = maxlen ? maxlen : m_maxlength;
		m_getlimit = getlimit ? getlimit : null;
		TQ.setAttr(m_inputdom,'maxlength',m_maxlength);
		m_filter = new FilterInput(m_g,m_inputdom);
		var nochars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.-_ ";
		m_filter.filter(nochars);
	};
	
	this.setReadOnly = function(flag){
		m_inputdom.readOnly = flag;
	};
	
	this.getVal = function(){
		return _getFactNum();
	};
	
	this.setVal = function(num){
		num = _limitNum(num);
		m_inputdom.value = num;
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, num, m_id);
		}
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.setId = function(id){
		m_id = id;
	};
	
	this.getId = function(){
		return m_id;
	};
	
	this.setLimit = function(getlimit){
		m_getlimit = getlimit ? getlimit : null;
	};
	
	this.setLimitCaller = function(getlimitCaller){
		m_getlimitCaller = getlimitCaller;
	};
	
	this.getLimit = function(){
		return m_getlimit;
	};
	
	this.focus = function(){
		m_inputdom.focus();
	};
	
	//--------------
	// private:method
	//--------------
	var	_onKeyup = function(e){
		e = e ? e : window.event;
		var key = e.which;
		if(key >= 33 || key == 13) {
			var length = this.value.length;
			if(length >= m_maxlength) {
				e.preventDefault();
			}
		}
		m_ischangeevt = false;
		_onInnerNumChange(e);
	};
	
	var _onNumChange = function(e){
		m_ischangeevt = true;
		_onInnerNumChange(e);
	};
	
	var _onInnerNumChange = function(e){
		var num = _getFactNum();
		if ( num != m_lastnum ){
			if ( m_caller ){
				m_caller.caller.call(m_caller.self, num, m_id);
			}
			m_lastnum = num;
		}
		if ( m_dirty ){
			m_inputdom.value = num;
			m_dirty = false;
		}
	};
	
	var _getFactNum = function(){
		var num = parseInt(m_inputdom.value, 10);
		return _limitNum(num);
	};
	
	var _limitNum = function(num){
		lt = _getLimit();
		if ( isNaN(num) ) {num = lt.min;if(m_ischangeevt){m_dirty=true;}}
		if ( num < lt.min ) {num = lt.min;m_dirty=true;}
		if ( num > lt.max ) {num = lt.max;m_dirty=true;}
		return num;
	};
	
	var _getLimit = function(){
		if ( m_getlimitCaller ) {
			return m_getlimitCaller.caller.call(m_getlimitCaller.self);
		} else if ( m_getlimit ){
			return m_getlimit(m_id);
		} else {
			return {min:m_min,max:m_max};
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};


SpinInput = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dom;
	var m_inputdom;
	var m_numinput;
	var m_step = 1;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,dom,step,imin,imax,getlimit,maxlen){
		m_g = g;
		m_this = this;
		m_dom = dom;
		m_step = step ? step : m_step;
		_init(imin,imax,getlimit,maxlen);
	};
	
	this.setCaller = function(caller){
		m_numinput.setCaller(caller);
	};
	
	this.getVal = function(){
		return m_numinput.getVal();
	};
	
	this.setVal = function(val){
		m_numinput.setVal(val);
	};
	
	this.setId = function(id){
		m_numinput.setId(id);
	};
	
	this.setReadOnly = function(flag){
		m_numinput.setReadOnly(flag);
	};
	
	this.setLimit = function(getlimit){
		m_numinput.setLimit(getlimit);
	};
	
	this.setLimitCaller = function(getlimitCaller){
		m_numinput.setLimitCaller(getlimitCaller);
	};
	
	this.focus = function(){
		m_numinput.focus();
	};
	
	this.getDom = function(){
		return m_dom;
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(imin,imax,getlimit,maxlen){
		var w = m_dom.clientWidth;
		var h = m_dom.clientHeight;
		m_spinbtn = new SpinBtn(m_g,m_dom);
		m_spinbtn.createLeftBtn();
		m_inputdom = TQ.createDom('input');
		TQ.setAttr(m_inputdom,'type','text');
		TQ.append(m_dom,m_inputdom);
		m_spinbtn.createRightBtn();
		
		TQ.setClass(m_inputdom, 'ui-input');
		TQ.setDomSize(m_inputdom, (w-2*(SCROLL_TRACE_W+2)), h-4);
		if ( TQ.getDomAutoWidth(m_inputdom) > (w-SCROLL_TRACE_W) ){// fix ie bug
			var drt = TQ.getDomAutoWidth(m_inputdom) - (w-SCROLL_TRACE_W);
			if ( TQ.isIE() ) {
				TQ.setDomSize(m_inputdom, (w-SCROLL_TRACE_W-drt-2), h-4);
			} else {
				TQ.setDomSize(m_inputdom, (w-SCROLL_TRACE_W-drt), h-4);
			}
		}
		m_spinbtn.setSize(SCROLL_TRACE_W,h);
		m_numinput = new NumInput(m_g, m_inputdom, imin, imax, getlimit, maxlen);
		m_spinbtn.setCaller({self:m_this, caller:_onSpinClick});
	};
	
	var _onSpinClick = function(id){
		m_numinput.setVal(m_numinput.getVal()+id*m_step);
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};
