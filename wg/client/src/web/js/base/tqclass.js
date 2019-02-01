Class = function(){};
// 该类的实现是支持基类的私有方法及属性，比较费资源
Class.snew = function() {
	var curclass = this;
	while ( curclass.parent ) {
		curclass.prototype = new curclass.parent();
		curclass.prototype.constructor = curclass;
		curclass = curclass.parent;
	}
	
	curclass = this;
	while ( curclass.parent ) {
		curclass.prototype.Super = curclass.parent.prototype;
		curclass = curclass.parent;
	}
	
	var newobj = new this(arguments);
	newobj.Super = this.prototype;//慎用Super属性，目前实现有问题！！！
	if ( newobj.init && typeof(newobj.init) == 'function'  ) {
		newobj.init.apply(newobj, arguments);
	}
	return newobj;
};

Class.extern = function (newclass){
	newclass.parent = this;
	newclass.extern = this.extern; 
	newclass.snew = this.snew;
	return newclass;
};

Class.delegate = function(subject, concrete){
	var functionNames = [];
	for ( var k in concrete ) {
		if ( k == 'init' ) continue;
		if ( k == 'constructor' ) continue;
		if ( typeof(concrete[k]) != 'function' ) continue;
		subject[k] = function() {
			var name = '';
			for ( var i=0; i<functionNames.length; ++i ) {
				var node = functionNames[i];
				if ( arguments.callee === node.method ) {
					name = node.name;
				}
			}
			return concrete[name].apply(concrete, arguments);
		};
		functionNames.push({method:subject[k], name:k});
	}
};
