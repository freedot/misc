NS = function(){
	var C_UPDATE_INTERVAL = 15;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_xxtea = null;
	var m_senders = [null,null];
	var m_clientid = 0;
	var m_keyid = 0;
	var m_stack = [];
	var m_start = false;
	var m_timer = null;
	
	//------------
	//public:method
	//------------
	this.init = function(host, port){
		m_this=this;
		m_keyid = 123456;
		m_clientid = 0;
		m_xxtea = new XXTea();
		_initSenders(host, port);
	};
	
	this.setGameObj = function(g) {
		m_g = g;
	};
	
	this.connect = function(){
		window.setTimeout(_onConnect, 200);
	};
	
	this.send = function(msg){
		if ( m_g.getState() == GSTATE.CLOSE ) {
			m_g.onClose();
			return;
		}
		
		var sender = _getIdleSender();
		if ( sender ) {
			_send(msg);
		}
		else {
			m_stack.push(msg);
		}
	};
	
	this.close = function(){
	};
	
	this.setKey = function(userkey) {
		//m_xxtea.setKey(userkey);
	};
	
	this.setMaxPackLen = function(maxlen) {
		// no something
	};
	
	this.onConnect = function(success){
		// no something
	};
	
	this.onClose = function(){
		// no something
	};
	
	var _onConnect = function() {
		try {
			m_g.onConnect(true);
			_clearInterval();
			m_timer = window.setInterval(_onUpdate, C_UPDATE_INTERVAL);
		}
		catch(e){
			window.setTimeout(_onConnect, 200);
		}
	};
	
	var _onData = function(emsg){
		if ( m_g == null ) return;
		if ( emsg == 'err!' ) {
			_clearInterval();
			return;
		}
		var ms = emsg.split('*');
		for ( var i=0; i<ms.length; ++i ) {
			_onHandleOneData(ms[i]);
		}
	};
	
	var _onHandleOneData = function(emsg) {
		var dmsg = m_xxtea.decrypt(emsg);
		if ( dmsg.indexOf('KI:') == 0 ) {
			m_keyid = parseInt(dmsg.substr(3), 10);
		}
		else if ( dmsg.indexOf('K:') == 0 ) {
			var key = dmsg.substr(2);
			m_xxtea.setKey(key);
		}
		else if ( dmsg.indexOf('SI:') == 0 ) {
			m_clientid = parseInt(dmsg.substr(3), 10);
			m_start = true;
		}
		else {
			var pos = dmsg.lastIndexOf('}');
			if ( pos == dmsg.length - 1 ) {
				m_g.onData(dmsg);
			}
			else if ( pos > 0 ) {
				m_g.onData(dmsg.substr(0, pos+1));
			}
			else {
				alert('error data: e94939223');
			}
		}
	};
	
	var _onUpdate = function(){
		if ( m_stack.length > 0 && _getIdleSender() ) {
			_send(m_stack[0]);
			TQ.removeElement(m_stack, 0);
		}
		
		if ( !_isConnected() && !_isConnectError() ) {
			_connectServer();
		}
	};
	
	var _initSenders = function(host, port) {
		for ( var i=0; i<m_senders.length; ++i ) {
			m_senders[i] = new MyAjax('http://'+host+':'+port+'/', i);
			m_senders[i].setCaller({self:m_this, caller:_onData});
		}
	};
	
	var _getIdleSender = function() {
		var sender = null;
		if ( m_senders[0].getState() != AJAX_STATE.GETTING ) {
			sender = m_senders[0];
		}
		else if ( m_senders[1].getState() != AJAX_STATE.GETTING ) {
			sender = m_senders[1];
		}
		return sender;
	};
	
	var _isConnected = function() {
		return ( ( m_senders[0].getState() == AJAX_STATE.GETTING ) 
			|| ( m_senders[1].getState() == AJAX_STATE.GETTING ) );
	};
	
	var _isConnectError = function() {
		return ( ( m_senders[0].getState() == AJAX_STATE.ERROR ) 
			|| ( m_senders[1].getState() == AJAX_STATE.ERROR ) );
	};
	
	var _connectServer = function() {
		var sender = _getIdleSender();
		if ( sender && m_start ) {
			var emsg = m_xxtea.encrypt('k:'+m_keyid);
			sender.send(emsg+'&i='+m_clientid);
		}
	};
	
	var _send = function (msg) {
		var sender = _getIdleSender();
		if ( sender ) {
			var emsg = m_xxtea.encrypt('k:'+m_keyid+',s:'+msg);
			sender.send(emsg+'&i='+m_clientid);
		}
	};
	
	var _clearInterval = function(){
		if ( m_timer ){
			window.clearInterval(m_timer);
			m_timer = null;
		}
	};

	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

