require('./serverObject');
ClientStub = ServerObject.ex({
	_init : function(){
		this._exclusives = {'_init':true, 'constructor':true, 'callMethod':true, 'ex':true, 'snew':true};
		this._regs = {};
		this._clientSeqs = {};
		this._clientId = 10000;
	}
	
	,reg : function(objectId, object){
		this._regs[objectId] = [];
		for ( var k in object ) {
			if (typeof(object[k]) != 'function' || this._exclusives[k] || k.indexOf('_') == 0 ) continue;
			this._regs[objectId].push(k);
		}
	}
	
	,getProxyObject : function(objectId){
		return {objectId:objectId, methods:this._regs[objectId]};
	}
	
	,getClientCurSeq : function(clientId){
		var seq = this._clientSeqs[clientId];
		return seq ? seq : 0;
	}
	
	,setClientCurSeq : function(clientId, seq){
		this._clientSeqs[clientId] = seq;
	}
	
	,registerClient : function(){
		return {registerClientId:++this._clientId};
	}
}).snew();

