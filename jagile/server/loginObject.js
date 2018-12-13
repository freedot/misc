var LoginObject = ServerObject.ex({
	_init : function(){
		this._keys = {};
		this._allocId = 0;
		this._chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	
	,login : function(){
		var id = ++this._allocId;
		this._keys[id] = {id:id, value:this._makeKey()};
		return {key:this._keys[id]};
	}
	
	,check : function(key){
		return this._keys[key.id] == key.value;
	}
	
	,_makeKey : function(){
		var key = '';
		for ( var i=0; i<16; ++i ) {
			var idx = Math.floor(Math.random()*1000000) % this._chars.length;
			key += this._chars.substr(i,1);
		}
		return key;
	}
});

Register.reg('LoginObject', LoginObject.snew());
ClientStub.reg('LoginObject', Register.get('LoginObject'));



