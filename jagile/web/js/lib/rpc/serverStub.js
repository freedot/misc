var SeqAllocer = JClass.ex({
	_init : function(){
		this._seq = 0;
	}
	
	,alloc: function(){
		return ++this._seq;
	}	
}).snew();

var ServerProxyObject = JClass.ex({
	_init : function(){
		this._ajax = null;
		this._callers = {};
	}
	
	,setAjax :function(ajax){
		this._ajax = ajax;
	}
	
	,handleServerData : function(data){
		var seq = data.seq;
		this._invokeCallerBySeq(seq, data);
		this._unregCallerBySeq(seq);
	}
	
	,_getObjectId : function(){
		alert('no implement');
	}
	
	,_getClientId : function(){
		alert('no implement');
	}
	
	,_invokeCallerBySeq : function(seq, data){
		var caller = this._callers[seq];
		if ( caller ) {
			caller.invoke(data);
		}
	}
	
	,_regCallerBySeq : function(seq, caller){
		this._callers[seq] = caller;
	}
	
	,_unregCallerBySeq : function(seq){
		if ( this._callers[seq] ) {
			delete this._callers[seq];
		}
	}
	
	,_makeSendData : function(caller, sendData){
		var seq = SeqAllocer.alloc();
		sendData.seq = seq;
		sendData.objId = this._getObjectId();
		sendData.cltId = this._getClientId();
		this._regCallerBySeq(seq, caller);
		return JSON.stringify(sendData);
	}
});

ServerStub = JClass.ex({
	initStub : function(url){
		this._url = url;
		this._ajax = JAjax.snew(this._url);
		this._ajax.setCaller(JCaller.snew(this, this._onServerData));
		this._regs = {};
		this._clientId = -1;
	}
	
	,get : function(objectId){
		return this._regs[objectId];
	}
	
	,registerClient : function(){
		this._registerClient();
	}
	
	,initProxyObject : function(objectId){
		this._initProxyObject(objectId);
	}
	
	,_onServerData : function(msg){
		var data = eval('(' + msg + ')');
		if ( data.registerClientId ) {
			this._clientId = data.registerClientId;
		} else if ( data.methods && data.objectId ) { // reg server proxy object
			this._regs[data.objectId] = this._createServerProxyObject(data);
		} else if (data.objId){
			this._regs[data.objId].handleServerData(data);
		}
	}
	
	,_createServerProxyObject : function(data){
		var s = 'ServerProxyObject.ex({';
		s += '_getObjectId:function(){ return "' + data.objectId + '"; }';
		s += ',_getClientId:function(){ return "' + this._clientId + '"; }';
		
		for ( var i=0; i<data.methods.length; ++i ) {
			var method = data.methods[i];
			s += ',' + method + ' : function(){';
			s += 'var caller=arguments[arguments.length-1];'
			s += 'var params=[];';
			s += 'for ( var i=0; i<arguments.length-1; ++i ) { params.push(arguments[i]); }'
			s += 'this._ajax.asyncSend(this._makeSendData(caller, {method:"' + method + '",params:params}));';
			s += '}';
		}
		s += '}).snew()';
		
		var obj = eval('(' + s + ')');
		obj.setAjax(this._ajax);
		return obj;
	}
	
	,_registerClient : function(){
		this._ajax.syncSend(JSON.stringify({seq:SeqAllocer.alloc(), objId:'ClientStub', method:"registerClient",params:[]}));
	}
	
	,_initProxyObject : function(objectId){
		this._ajax.syncSend(JSON.stringify({seq:SeqAllocer.alloc(), objId:'ClientStub', cltId:this._clientId, method:"getProxyObject",params:[objectId]}));
	}	
}).snew();