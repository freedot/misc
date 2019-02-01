Caller = JClass.ex({
	_init : function(obj, caller){
		this._obj = obj;
		this._caller = caller;
	}
	
	,invoke : function(){
		this._caller.apply(this._obj, arguments);
	}
});

NullCaller = JClass.ex({
	_init : function(obj, caller){}
	,invoke : function(){}
}).snew();