/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
/** sysmsgtip的显示类型 */
SMT_NORMAL = 0;
SMT_WARNING = 1;
SMT_ERROR = 2;
SMT_SUCCESS = 3;

BaseSysMsgTipsBox = JClass.ex({
	init : function(g){
		this.g_ = g;
		this.timer_ = null;
		this.totaltime_ = 0;
		this.C_DRTTIME = 50;
		this.C_TYPECOLORS = ['#FFFFFF', '#FFFF00', '#FF3300', '#20FF20'];
		
		var this_ = this;
		this.dom_ = TQ.createDom('div');
		TQ.setClass(this.dom_, this._getCssClass());
		var uiBody = TQ.getUiBody();
		TQ.append(uiBody, this.dom_);
		TQ.setCSS(this.dom_, 'display', 'none');
		TQ.setCSS(this.dom_, 'zIndex', UI_ZORDER_TOOLTIP);
		TQ.addEvent(this.dom_, 'mousedown', function(){
			this_._stopTimer();
		});
		TQ.fixIE6Png(this.dom_);
	}
	
	,show : function(type, msg){
		this._addTipMsg(type, msg);
		this._startTimer();
	}
	
	,resize : function(size){
		var x = (size.cx - this._getBarWidth()) / 2;
		TQ.setDomPos(this.dom_, x, this._getBarTop());
	}
	
	,_addTipMsg : function(type, msg){
		this.totaltime_ = 0;
		TQ.setHtml(this.dom_, msg);
		TQ.setCSS(this.dom_, 'display', 'block');
		TQ.setCSS(this.dom_, 'opacity', this._getStartAlpha());
		TQ.setCSS(this.dom_, 'color', this.C_TYPECOLORS[type]);
	}
	
	,_startTimer : function(){
		if ( this.timer_ ) return;
		
		var this_ = this;
		this.timer_ = window.setInterval(function(){this_._onUpdate.call(this_);}, this.C_DRTTIME);
	}
	
	,_stopTimer : function(){
		if (this.timer_) {
			window.clearInterval(this.timer_);
			this.timer_ = null;
		}
		TQ.setCSS(this.dom_, 'display', 'none');
	}
	
	,_getCssClass : function(){}
	,_getBarWidth : function(){}
	,_getBarTop : function(){}
	,_getStartAlpha : function(){}
	,_onUpdate : function(){}
});

SysMsgTipsBox = BaseSysMsgTipsBox.ex({
	init : function(g){
		this._super.init.call(this, g); 
		this.C_STATICTIME = 3500;
		this.C_DECREASETIME = 1000;
	}
	
	,_getCssClass : function(){
		return 'ui-systips';
	}
	
	,_getBarWidth : function(){
		return 539;
	}
	
	,_getBarTop : function(){
		return 130;
	}
	
	,_getStartAlpha : function(){
		return 90;
	}
	
	,_onUpdate : function(){
		this.totaltime_ += this.C_DRTTIME;
		if ( this.totaltime_ < this.C_STATICTIME ){// do nothing , only static show
		} else if ( this.totaltime_ < (this.C_DECREASETIME + this.C_STATICTIME) ) {
			var shapedrttime = this.totaltime_ - this.C_STATICTIME;
			// decrease the opacity, until hide
			var alpha = parseInt((1-shapedrttime/this.C_DECREASETIME)*this._getStartAlpha());
			TQ.setCSS(this.dom_, 'opacity', alpha);
		} else {
			this._stopTimer();
		}
	}
});

SysMsgTipsBox2 = BaseSysMsgTipsBox.ex({
	init : function(g){
		this._super.init.call(this, g); 
		this.C_DURATION = 15*1000;
	}
	
	,_getCssClass : function(){
		return 'ui-systips2';
	}
	
	,_getBarWidth : function(){
		return 539;
	}
	
	,_getBarTop : function(){
		return 100;
	}
	
	,_getStartAlpha : function(){
		return 90;
	}
	
	,_onUpdate : function(){
		this.totaltime_ += this.C_DRTTIME;
		if ( this.totaltime_ > this.C_DURATION ){
			this._stopTimer();
		}
	}
});