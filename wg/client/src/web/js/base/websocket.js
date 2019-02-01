WS= function(){
	var m_this=null;
	var m_host=null;
	var m_port=null;
	var m_proxy = null;
	var m_g=null;

	var m_wsVer = '0';
	var m_socket=null;
	var m_xxtea = new XXTea;
	var m_pkg_head_len = 4;
	var m_combuf = {
		pos : 0
		,pkgLen : 0
		,buf : new ArrayBuffer(65536)
		,binary : false
		,gzip : false
		,encrypt : false
	};
		
	this.init = function(host, port, proxy){
		m_this=this;
		m_host=host;
		m_port=port;
		m_proxy = proxy;
	};
	
	this.setGameObj = function(g) {
		m_g = g;
	};
	
	this.connect = function(){
		m_socket = new WebSocket('ws://' + m_host + ':' + m_port); 
		m_socket.onopen = function(evt) { m_this._onOpen(evt); }; 
		m_socket.onclose = function(evt) { m_this._onClose(evt); }; 
		m_socket.onmessage = function(evt) {m_this._onMessage(evt.data); };
		m_socket.onerror = function(evt) { m_this._onError(evt); };
	};
	
	this.send = function(msg){
		try {
			m_socket.send(msg);
			log('>>[c->s]'+msg);
		} catch(err) {
			//alert(err.description);
		}
	};
	
	this.close = function(){
		m_socket.close();
	};
	
	this._onOpen = function(evt){
		if ( m_g == null ) return;
		m_socket.binaryType = 'arraybuffer';
		log('websocket opened!');
	};
	
	this._onMessage = function(data){
		if ( m_g == null ) return;
		if ( data == null ) return;
		if ( m_wsVer == '0' ) {
			if ((typeof(data) != 'string') || (data != '1' && data != '2') ) {
				m_g.onClose();
				return;
			}
			m_wsVer = data;
			m_g.onConnect(true);
			return;
		}
		
		if ( m_wsVer == '1' ) {
			this._onDataVer1(data);
		} else if (m_wsVer == '2') {
			this._onDataVer2(data);
		}
	};
	
	this._onDataVer1 = function(data){
		if ( typeof(data) != 'string' ) return ;
		var srcView = data;
		var srcLen = data.length;
		this._onCommData(srcView, srcLen, function(view, pos){ return view.charCodeAt(pos);});
	};
	
	this._onDataVer2 = function(data){
		if ( !(data instanceof ArrayBuffer) ) return ;
		var srcView = new Uint8Array(data);
		var srcLen = srcView.byteLength;
		this._onCommData(srcView, srcLen, function(view, pos){ return view[pos];});
	};
	
	this._onCommData = function(src, srcLen, getViewCharCodeAt){
		var srcPos = 0;
		while ( srcPos < srcLen ) {
			if ( m_combuf.pkgLen == 0 ) {
				var needLen = Math.min( m_pkg_head_len - m_combuf.pos, srcLen - srcPos);
				var toPos = m_combuf.pos + needLen;
				var pkgLenView = new DataView(m_combuf.buf, m_combuf.pos, needLen);
				for ( ; m_combuf.pos<toPos; ++m_combuf.pos ) {
					pkgLenView.setUint8(m_combuf.pos, getViewCharCodeAt(src, srcPos++));
				}
				if ( m_combuf.pos == m_pkg_head_len ) { // complete pkg len
					var len = ntohl(pkgLenView.getUint32(0, true));
					m_combuf.gzip = ((len&0x8000000) != 0);
					m_combuf.binary = ((len&0x4000000) != 0);
					m_combuf.encrypt = ((len&0x2000000) != 0);
					m_combuf.pkgLen = len & 0xFFFFFF;
					m_combuf.pos = 0;
				}
			} else if ( m_combuf.pos < m_combuf.pkgLen ) {
				var needLen = Math.min( m_combuf.pkgLen-m_combuf.pos, srcLen - srcPos);
				var toPos = m_combuf.pos + needLen;
				var pkgView = new Uint8Array(m_combuf.buf, m_combuf.pos, needLen);
				for ( ; m_combuf.pos<toPos; ++m_combuf.pos ) {
					pkgView[m_combuf.pos] = getViewCharCodeAt(src, srcPos++);
				}
				
				//align four bytes
				var alignPos = Math.floor((toPos+3)/4)*4;
				var pkgView = new Uint8Array(m_combuf.buf, 0, alignPos);
				for ( var i=toPos; i<alignPos; ++i ) {
					pkgView[i] = 0;
				}
				
				if ( m_combuf.pos == m_combuf.pkgLen ) {
					var msg = '';
					var v = [];
					var pkgView = new Uint32Array(m_combuf.buf, 0, Math.floor((m_combuf.pkgLen+3)/4));
					for ( var i=0; i<pkgView.length; ++i ) {
						v.push(pkgView[i]);
					}
					
					try {
						if ( m_combuf.encrypt ) {
							msg = m_xxtea.decrypt_ex(v);
						} else {
							msg = m_xxtea.long2str(v);
						}
					}catch(e) {
					}
					
					m_combuf.pos = 0;
					m_combuf.pkgLen = 0;
					m_this._onData(msg);
				}
			}
		}		
	};
	
	this._onData = function(msg){
		if ( m_g != null ) {
			m_g.onData(msg);
		}
	};
	
	this._onClose = function(evt){
		log('websocket close !');
		if ( m_g != null ) {
			m_g.onClose();
		}
	};
	
	this._onError = function(evt){
		log('websocket error !');
		if ( m_g != null ) {
			m_g.onClose();
		}
	};
	
	this.send = function(msg){
		try {
			var emsg = m_xxtea.encrypt(msg);
			if ( m_wsVer == '1' ) {
				var alen = m_xxtea.long2str([htonl(emsg.length)]);
				m_socket.send( ':'+alen+emsg );
			} else if (m_wsVer == '2') {
				var buf = new ArrayBuffer(emsg.length);
				var bytes = new Uint8Array(buf);
				for ( var i=0; i<emsg.length; ++i ) {
					bytes[i] = emsg.charCodeAt(i);
				}
				var alen = new Uint8Array(htonl_array(emsg.length));
				m_socket.send( alen );
				m_socket.send( bytes );
			}
			log('>>[c->s]'+msg);
		} catch(err) {
			alert(err.description);
		}
	};
	
	this.close = function(){
		m_socket.close();
	};
	
	this.setKey = function(userkey) {
		m_xxtea.setKey(userkey);
	};
	
	this.setMaxPackLen = function(maxlen) {
		log('set max len : ' + maxlen);
	};
	
	this.init.apply(this, arguments);
};

