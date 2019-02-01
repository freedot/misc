tq_decodeUrl = function(url){
	var cc = 'ABCDEFGHIJK';
	if ( url.indexOf('=') != 0 ) {
		return url;
	}
	
	var durl = '';
	for ( var i=1; i<url.length; ++i ) {
		var idx = cc.indexOf(url.substr(i, 1));
		if ( idx < 10 ) {
			durl += idx;
		} else {
			durl += '.';
		}
	}
	
	return durl;
};

createMsgObject = function(url, port, proxy){
	if ( isMobileBrowser() && hasWebSocket() ) {
		log( 'use websocket ' );
		return new WS(tq_decodeUrl(url), port, proxy);
	} else if ( TQ.getFlashVer() != '' ) {
		log( 'use flash socket ' );
		return new Msg(tq_decodeUrl(url), port, proxy);
	} else {
		log( 'error: not find flashsocket and websocket ' );
		return null;
	}
};

initGame = function(url, port, proxy, sig){
	if ( !GlobalPub ) {
		throw new Error("not load GlobalPub.");
		return;
	}
	
	objMsg = createMsgObject(url, port, proxy); // must global var, why?????
	if ( !objMsg ) return;
	
	log('initGame 1');
	objApp=new GlobalPub(sig, objMsg); // must global var
	log('initGame 2');
	window.setTimeout("objApp.connG()", 1000);
	log('initGame 3');
	window.onresize=function(){
		objApp.onResize();
	};
	log('initGame 4');
};
