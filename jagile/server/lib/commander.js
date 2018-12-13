require('./jclass');
var Commander = JClass.ex({
	_init : function(opsCfg){
		this._ops = {};
		this._parse(opsCfg);
	}
	
	,_parse : function(opsCfg){
		var currentOp = '';
		var currentArgMaxCount = 0;
		var currentArgCount = 0;
		var this_l = this;
		process.argv.forEach(function(val, index, array) {
			if ( currentArgCount < currentArgMaxCount ) {
				this_l._ops[currentOp].push(val);
				currentArgCount++;
			} else if ( opsCfg[val] != null && opsCfg[val] != undefined ) {
				currentArgMaxCount = opsCfg[val];
				currentArgCount = 0;
				currentOp = val;
				this_l._ops[currentOp] = [];
			}
		});		
	}
	
	,get: function(key, index, defaultVal){
		if ( !this._ops[key] ) return defaultVal;
		
		index = index ? index : 0;
		var val = this._ops[key][index];
		return val ? val : defaultVal;
	}
	
	,has: function(key) {
		if ( !this._ops[key] ) return false;
		return true;
	}
});

module.exports = Commander;
