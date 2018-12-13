/** 
	version: 0.1
	writer: bill825
	date: 2014.12.10
*/

JAJAX_STATE = {
	INIT:0,
	GETTING:1,
	RECVOK:2,
	ERROR:3
};

JAjax = JClass.ex({
	_init : function(url){
		this._state = JAJAX_STATE.INIT;
		this._url = url;
		this._caller = JNullCaller;
		this._syncObj = null;
		this._asyncObj = null;
		this._timer = null;
		this._caches = [];
	}
	
	,setCaller : function(caller) {
		this._caller = caller;
	}
	
	,asyncSend : function(msg){
		this.send(msg, true);
	}
	
	,syncSend : function(msg){
		this.send(msg, false);
	}
	
	,send : function(msg, async) {
		var async = JUtil.isNull(async) ? true : async;
		if ( async ) {
			this._caches.push(msg);
			if ( !this._timer ) {
				var this_l = this;
				this._timer = window.setInterval(function(){
					this_l._onTimer();
				}, 50);
			}
		} else {
			this._syncObj = this._createAjaxObj();
			this._send(this._syncObj, msg, async);
		}
	}
	
	,_send : function(ajaxObj, msg, async){
		var url = this._url+'?msg='+encodeURIComponent(msg);
		try{
			console.log('send >>> ' + msg);
			ajaxObj.open("GET", url, async);
			ajaxObj.send(null);
			this._state = JAJAX_STATE.GETTING;
		} catch(e){
			alert('send msg by ajax failed!');
		}
	}
	
	,_onTimer : function(){
		if ( this._caches.length == 0 ) {
			window.clearInterval(this._timer);
			this._timer = null;
			return;
		}
		
		if ( this._asyncObj ) {
			return;
		}
		
		var msg = this._caches[0];
		this._caches.splice(0,1);
		this._asyncObj = this._createAjaxObj();
		this._send(this._asyncObj, msg, true);
	}
	
	,getState : function(){
		return this._state;
	}
	
	,_createObject : function(){
		try{
			return new ActiveXObject( "Msxml2.XMLHTTP" );
		}catch(e){}
		try{
			return new ActiveXObject( "Microsoft.XMLHTTP" );
		}catch(e){}
		try{
			return new XMLHttpRequest();
		}catch(e){}
		return null;
	}
	
	,_handleStateChange : function ( xmlHttp ){
		if ( xmlHttp.readyState == 4 ) {
			this._state = JAJAX_STATE.RECVOK;
			if ( xmlHttp == this._asyncObj ) this._asyncObj = null;
			if ( xmlHttp == this._syncObj ) this._syncObj = null;
		}
		
		if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
			var emsg = xmlHttp.responseText;
			this._caller.invoke(emsg);
		}
	}
	
	,_createAjaxObj : function() {
		var obj = this._createObject();
		var this_l = this;
		obj.onreadystatechange = function() {
			this_l._handleStateChange( obj );
		};
		this._state = JAJAX_STATE.INIT;
		return obj;
	}
});
