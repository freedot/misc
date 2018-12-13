var PORT = 8080;

var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');

var mine = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

var startServer = function(port, basePath, defaultPage) {
	var server = http.createServer(function (request, response) {
		try{
			var pathname = url.parse(request.url).pathname;
			pathname = pathname.replace(/(^\s*)|(\s*$)/g,"")
			if ( pathname == '/' ) pathname = defaultPage;
			var realPath = path.join(basePath, pathname);
			console.log(realPath);
			var ext = path.extname(realPath);
			ext = ext ? ext.slice(1) : 'unknown';
			fs.exists(realPath, function (exists) {
				if (!exists) {
					response.writeHead(404, {
						'Content-Type': 'text/plain'
					});

					response.write("This request URL " + pathname + " was not found on this server.");
					response.end();
				} else {
					fs.readFile(realPath, "binary", function (err, file) {
						if (err) {
							response.writeHead(500, {
								'Content-Type': 'text/plain'
							});
							response.end('open file error!');
						} else {
							var contentType = mine[ext] || "text/plain";
							response.writeHead(200, {
								'Content-Type': contentType
							});
							response.write(file, "binary");
							response.end();
						}
					});
				}
			});
		} catch (e) {
			response.writeHead(500, {'Content-Type' : 'text/plain'});
			response.end('unknown error!');
		}
	});
	server.listen(port);
	console.log("Server runing at port: " + port + ".");
}

var main = function(){
	var Commander = require('./lib/commander');
	var cmd = Commander.snew({'--help':0, '-help':0, '-port':1, '-basepath':1, '-daemon':0, '-defaultpage':1});
	if ( cmd.has('--help') || cmd.has('-help') ) {
		console.log('node httpserver.js -daemon -port 8080 -basepath E:\\MyWork\\wg\\agiletool\\web -defaultpage index.html');
		return;
	}
	
	var port = cmd.get('-port', 0, 8080);
	var basePath = cmd.get('-basepath', 0, 'E:\\MyWork\\wg\\agiletool\\web');
	var defaultPage = cmd.get('-defaultpage', 0, 'index.html');
	startServer(port, basePath, defaultPage);
	if ( cmd.has('-daemon') ) {
		require('./lib/daemon')();
	}
}

main();
