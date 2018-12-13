Register = JClass.ex({
	_init : function(){
		this._regs = {};
	}
	
	,reg : function(keyName, obj){
		this._regs[keyName] = obj;
	}
	
	,get : function(keyName){
		return this._regs[keyName];
	}
}).snew();
