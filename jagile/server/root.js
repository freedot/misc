require('./lib/jclass');
require('./lib/jregister');
require('./config');
require('./serverObjects');

var RootServer = JClass.ex({
	startServer : function(port){
		var http = require('http');
		var url=require('url');
		var querystring=require('querystring');
		var this_l = this;
		http.createServer(function (req, res) {
			res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
			try {
				console.log('<url> : ' + req.url);
				
				if ( req.url.indexOf('{') == 6 ) { // bug : 收到重复的数据包，但没有进行 urlencode
					console.log('*error repeat data!');
					res.end('{ret:-1, msg:"error"}');
					return;
				}
				
				var msg = url.parse(req.url, true).query.msg;
				if (!msg) {
					console.log('*error url!');
					res.end('{ret:-1, msg:"error"}');
					return;
				}
				
				console.log('c->s : ' + msg);
				var data = JSON.parse(msg);
				if ( !this_l._isRegClient(data) && !this_l._checkSeq(data) ) {
					console.log('*error seq!');
					res.end('{ret:-1, msg:"error"}');
					return;
				}
				
				var serverObj = Register.get(data.objId);
				var retData = serverObj.callMethod(data.method, data.params);
				var cltId = data.cltId ? data.cltId : retData.registerClientId;
				Register.get('ClientStub').setClientCurSeq(cltId, data.seq);
				retData.seq = data.seq;
				retData.objId = data.objId;
				var rtMsg = JSON.stringify(retData);
				console.log('s->c : ' + rtMsg);
				res.end(rtMsg);
			} catch (e) {
				res.end('{ret:-1, msg:"error"}');
				console.log('*error!');
			}
		}).listen(port);
		console.log('Server running at :' + port);
	}
	
	,_isRegClient : function(data){
		return data.objId == 'ClientStub' && data.method == 'registerClient' ;
	}
	
	,_checkSeq : function(data){
		if ( !data.cltId ) return false;
		if ( !data.seq ) return false;
		if ( data.seq < 2 ) return false;
		console.log('seq check , datecltId: ' + data.cltId +', dataseq: ' + data.seq + ', curseq: ' + Register.get('ClientStub').getClientCurSeq(data.cltId));
		return Register.get('ClientStub').getClientCurSeq(data.cltId)+1 == data.seq;
	}
});


var main = function(){
	var Commander = require('./lib/commander');
	var cmd = Commander.snew({'--help':0, '-help':0, '-port':1, '-daemon':0});
	if ( cmd.has('--help') || cmd.has('-help') ) {
		console.log('node root.js -daemon -port 8088');
		return;
	}
	
	var port = cmd.get('-port', 0, 8088);
	RootServer.snew().startServer(port);
	if ( cmd.has('-daemon') ) {
		require('./lib/daemon')();
	}
}

main();




