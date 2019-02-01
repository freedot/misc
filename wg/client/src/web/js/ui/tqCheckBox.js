/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CheckBox = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_btn;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,parent,ops){
		m_g = g;
		m_this = this;
		if ( !ops ) {
			ops = {};
		}
		if ( !ops.uiback ) {
			ops.uiback = uiback.btn.check;
		}
		m_btn = new ComButton(g,parent,ops);
		m_btn.setType(BTN_TYPE.CHECK);
	};
	
	/** 设置click的回调 */
	this.setCaller = function(caller) {
		m_btn.setCaller(caller);
	};
	
	/** 设置id */
	this.setId = function(id) {
		m_btn.setId(id);
	};
	
	/** 设置btn文本 */
	this.setText = function(text) {
		m_btn.setText(text);
	};
	
	/** 获得btn文本 */
	this.getText = function(){
		return m_btn.getText();
	};
	
	/** 设置check状态 */
	this.setCheck = function(check) {
		m_btn.setPress(check==1);
	};
	
	/** 获得check状态 */
	this.getCheck = function(){
		return m_btn.isPress()?1:0;
	};
	
	/** 获得id */
	this.getId = function(){
		return m_btn.getId();
	};
	
	this.show = function(){
		m_btn.show();
	};
	
	this.hide = function(){
		m_btn.hide();
	};	
	
	this.isShow = function(){
		return m_btn.isShow();
	};
	
	this.click = function(){
		m_btn.click();
	};
	
	//--------------
	// private:method
	//--------------
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

RadioBox = CheckBox;
RadioGroup = function(){
	//-----------
	//private:data
	//-----------
	var m_radios = [];
	var m_cudid = -1;
	var m_canswitch = false; // 是指在单个radio上可以进行选择或取消选择的操作
	var m_caller = null;
	var m_precaller = null;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(canswitch){
		m_canswitch = canswitch?canswitch:false;
	};
	
	/** 设置click的回调 */
	this.append = function(radio){
		m_radios.push(radio);
		radio.setCaller({self:this,caller:_onRadio});
	};
	
	this.select = function(id){
		_uncheckRadio(id);
		if ( _preSelect(id) ) {
			_select(id);
		}
	};
	
	this.getCurSelId = function(){
		return m_cudid;
	};
	
	this.getRadio = function(idx){
		return m_radios[idx];
	};
	
	this.setPreCaller = function(caller){
		m_precaller = caller;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};

	//------------
	//private:method
	//------------	
	var _onRadio = function(id){
		_toggleRadioCheck(id);
		if ( _preSelect(id) ) {
			_select(id);
		}
	};
	
	var _preSelect = function(id){
		var radio = _getRadioById(id);
		if ( !radio ) return true;
		if ( !m_precaller ) return true;
		if ( radio.getCheck() == 1 ) return true;
		
		return m_precaller.caller.call(m_precaller.self, id);
	};
	
	var _select = function(id){
		var radio = _getRadioById(id);
		if ( radio ) {
			var lastCheckState = radio.getCheck();
			if ( lastCheckState == 0 ) {
				m_cudid = id;
				_uncheckAll();
				radio.setCheck(1);
			}
			else if ( m_canswitch ) {
				m_cudid = -1;
				_uncheckAll();
				radio.setCheck(0);
			}
		}
		else {
			m_cudid = -1;
			_uncheckAll();
		}
		
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_cudid);
		}
	};
	
	var _getRadioById = function(id){
		for ( var i in m_radios ){
			var rd = m_radios[i];
			if ( rd.getId() == id ) return rd;
		}
	};
	
	var _uncheckAll = function(){
		for ( var i in m_radios ){
			var radio = m_radios[i];
			radio.setCheck(0);
		}
	};
	
	var _toggleRadioCheck = function(id){
		var radio = _getRadioById(id);
		if ( !radio ) return;
		
		if ( radio.getCheck() == 0 ) {
			radio.setCheck(1);
		}
		else {
			radio.setCheck(0);
		}
	};
	
	var _uncheckRadio = function(id){
		var radio = _getRadioById(id);
		if ( !radio ) return;
		
		radio.setCheck(0);
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};