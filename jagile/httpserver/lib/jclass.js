/** 
	version: 0.1
	用 __proto__ 的实现方法
	writer: bill825
	date: 2014.12.10
*/

JClass = {
	ex : function(subClass){
		var subClass = subClass ? subClass : {};
		if ( subClass.__proto__ ) {
			subClass.__proto__ = this;
			subClass.__proto__.constructor = subClass._init ? subClass._init : subClass;
			return subClass;
		} else { // not support __proto__
			var s = {};
			for ( var k in this ) s[k] = this[k];
			for ( var k in subClass ) s[k] = subClass[k];
			s.__proto__ = this;
			return s;
		}
	},
	
	snew : function(){
		var newo = this.ex(null);
		newo._class = this;
		if (typeof(newo._init) == 'function'){
			newo._init.apply(newo, arguments);
		}
		return newo;
	}
};

JCaller = JClass.ex({
	_init : function(obj, caller){
		this._obj = obj;
		this._caller = caller;
	}
	
	,invoke : function(){
		return this._caller.apply(this._obj, arguments);
	}
});

JNullCaller = JClass.ex({
	_init : function(obj, caller){}
	,invoke : function(){}
}).snew();