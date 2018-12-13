ServerObject = JClass.ex({
	callMethod : function(method, params){
		return this[method].apply(this, params);
	}
});
