AJAX_STATE = {
	INIT:0,
	GETTING:1,
	RECVOK:2,
	ERROR:3
};

MyAjax = function() {
	//-----------
	//private:data
	//-----------
	var m_this;
	var m_obj;
	var m_caller;
	var m_state;
	var m_url;
	var m_id;
	var m_ieseq=0;
	
	//------------
	//public:method
	//------------	
	this.init = function(url, id){
		m_this = this;
		m_state = AJAX_STATE.INIT;
		m_url = url;
		_recreateObj();
		m_id = id;
	};
	
	this.setCaller = function(caller) {
		m_caller = caller;
	};
	
	this.getId = function() {
		return m_id;
	};
	
	this.send = function(msg) {
		if ( TQ.getBrowserType() == BS_MSIE ) {
			_recreateObj();
			m_obj.open("GET", m_url+'?d='+msg+'&s='+(m_ieseq++), true);
		}
		else {
			m_obj.open("GET", m_url+'?d='+msg, true);
		}
		m_obj.send(null);
		m_state = AJAX_STATE.GETTING;
	};
	
	this.getState = function(){
		return m_state;
	};
	
	var _createObject = function(){
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
	};
	
	var _handleStateChange = function ( xmlHttp ){
		if ( xmlHttp.readyState == 4 ) {
			m_state = AJAX_STATE.RECVOK;
			if ( xmlHttp.status == 200 && xmlHttp.responseText == 'err!' ) {
				m_state = AJAX_STATE.ERROR;
			}
		}
		if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
			var emsg = xmlHttp.responseText.substr(1, xmlHttp.responseText.length - 2);
			m_caller.caller.call(m_caller.self, emsg);
		}
	};
	
	var _recreateObj = function() {
		m_obj = new _createObject();
		m_obj.onreadystatechange = function() {
			_handleStateChange( m_obj );
		};
		m_state = AJAX_STATE.INIT;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
};
