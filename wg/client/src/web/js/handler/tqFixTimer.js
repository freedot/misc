/*******************************************************************************/
FixTimer = Class.extern(function(){
	this.g_ = null;
	this.regs_ = [];
	this.date_ = new Date();
	this.initOneTime = function(g){
		this.g_ = g;
		this.g_.regUpdater(this, this._onUpdater, 1000);
	};
	
	this.regTimer = function(fixTime, caller){
		for ( var i=0; i<this.regs_.length; ++i ) {
			var reg = this.regs_[i];
			if ( reg.caller.self == caller.self && reg.caller.caller == caller.caller ) {
				log('duplicate fixTime regTimer');
				return;
			}
		}
		
		this.regs_.push({caller:caller, fixTimeVal:this._getTimeVal(fixTime.hour, fixTime.min, fixTime.sec), refreshTime:0});
	};
	
	this.unregTimer = function(caller){
		for ( var i=0; i<this.regs_.length; ++i ) {
			var reg = this.regs_[i];
			if ( reg.caller.self == caller.self && reg.caller.caller == caller.caller ) {
				this.regs_.splice(i, 1);
				break;
			}
		}
	};
	
	this.clear = function(){
		this.regs_ = [];
		this.g_.unregUpdater(this, this._onUpdater);
	};
	
	this._onUpdater = function(){
		for ( var i=0; i<this.regs_.length; ++i ) {
			var reg = this.regs_[i];
			var svrTime = this.g_.getSvrTimeS();
			
			if ( TQ.isSameDay(svrTime, reg.refreshTime) ) continue;
			
			this.date_.setTime(svrTime*1000);
			var curTimeVal = this._getTimeVal(this.date_.getHours(), this.date_.getMinutes(), this.date_.getSeconds());
			if ( curTimeVal < reg.fixTimeVal ) continue;
			
			reg.refreshTime = svrTime;
			reg.caller.caller.call(reg.caller.self);
		}
	};
	
	this._getTimeVal = function(hour, min, sec){
		return hour*3600 + min*60 + sec;
	};
}).snew();
