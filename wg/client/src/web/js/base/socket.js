NullSocket = function(){
	this.connect = function(){};
	this.send = function(){};
	this.close = function(){};
	this.setKey = function(){};
	this.setMaxPackLen = function(){};
};

Msg = function(){
	var m_this=null;
	var m_host=null;
	var m_port=null;
	var m_proxy = null;
	var m_g=null;
	var m_socket=new NullSocket();
		
	this.init = function(host, port, proxy){
		m_this=this;
		m_host=host;
		m_port=port;
		m_proxy = proxy;
		_initSocket();
	};
	
	this.setGameObj = function(g) {
		m_g = g;
	};
	
	this.connect = function(){
		if ( m_socket != null ){	
			m_socket.connect(m_host, m_port);
		}
		else{
			window.setTimeout(m_this.connect, 200);
		}
	};
	
	this.send = function(msg){
		try {
			m_socket.send(msg, 1);
			log('>>[c->s]'+msg);
		}
		catch(err) {
			//alert(err.description);
		}
	};
	
	this.close = function(){
		m_socket.close();
	};
	
	this.setKey = function(userkey) {
		m_socket.setKey(userkey);
	};
	
	this.setMaxPackLen = function(maxlen) {
		m_socket.setMaxPackLen(maxlen);
	};
	
	this.onConnect = function(success){
		if ( m_g != null ) {
			if (m_proxy.type == 'TGW' && success) {
				var proxymsg = 'tgw_l7_forward\r\nHost:' + m_proxy.url + '\r\n\r\n';
				m_socket.send(proxymsg, 0);
			}
			m_g.onConnect(success);
		}
	};
	
	this.onClose = function(){
		if ( m_g != null ) {
			m_g.onClose();
		}
	};
	
	this.onData = function(pkg){
		if ( m_g != null ) {
			if (pkg != null) log ( '<<[c<-s]' + pkg );
			m_g.onData(pkg);
		}
	};
	
	var _initSocket = function() {
		m_socket = _getMovie("socket");
		if ( !m_socket || typeof m_socket.connect != "function" ) {
			m_socket = new NullSocket();
			window.setTimeout(_initSocket, 100);
		}
	};
	
	var _getMovie = function(mName) {
		return document.getElementById(mName);
	};	
	
	this.init.apply(this, arguments);
};

