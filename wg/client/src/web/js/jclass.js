/** 用 __proto__ 的实现方法
其中_super的用法实例：this._super._init.call(this, id, name, age); 
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
		newo._super =  newo.__proto__.__proto__;
		newo._class = this;
		if (typeof(newo._init) == 'function'){
			newo._init.apply(newo, arguments);
		} else if (typeof(newo.init) == 'function'){
			newo.init.apply(newo, arguments);
		}
		return newo;
	}
};
