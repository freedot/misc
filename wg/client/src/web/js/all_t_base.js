// nodejs的api
// http://blog.csdn.net/fh13760184/article/details/6840696  
/*
assert.fail(actual, expected, message, operator)
assert.ok(value, [message])
assert.equal(actual, expected, [message])
assert.notEqual(actual, expected, [message])
assert.deepEqual(actual, expected, [message])
assert.notDeepEqual(actual, expected, [message])
assert.strictEqual(actual, expected, [message])
assert.notStrictEqual(actual, expected, [message])
assert.throws(block, [error], [message])
assert.doesNotThrow(block, [error], [message])
assert.ifError(value)
*/

require('./fulljslint.js');
var fs = require('fs');
var g_baseworkpath = 'E:/MyWork/wg/trunk/web/';
//var g_baseworkpath = 'C:/output/clt/trunk/web/';

var g_srcworkpath = g_baseworkpath + 'js';

myrequire = function(jsFile, replaces){
	var filePath = g_srcworkpath + jsFile;
	var pos = filePath.lastIndexOf('/');
	if ( pos <= 0 ) return false;
	var newDir = filePath.substr(0, pos) + '/__tmp/';
	try{
		fs.mkdirSync(newDir, 0777);
	} catch(e) {
	}
	var newfilePath = newDir + '__tmp_' + filePath.substr(pos+1);
	
	
	var s = '';
	try{
		s = fs.readFileSync(filePath, encoding='utf8');
	} 
	catch(e) {
		alert('can not find js file : ' + filePath);
		return false;
	}
	
	if (  (s.length >= 1) && (s.charCodeAt(0) == 65279) ) { // remove utf8 dom head
		s = s.substr(1, s.length-1);
	}
	
	for ( var k in replaces ) {
		s = s.replace(k, replaces[k]);
	}
	
	fs.writeFileSync(newfilePath, s, encoding='utf8');
	require(newfilePath);
	
	return true;
};

requireEx_replaceExportItems = function(s, rep){
	for ( var itemK in rep.items ) {
		var item = rep.items[itemK];
		s = s.replace( new RegExp('([^a-zA-Z0-9_]*)'+'('+item+')'+'([^a-zA-Z0-9_]+)',"g"), '$1' + '_lc_.' + item+'$3' );
	}
	return s;
};

requireEx = function(jsFile, replaces){
	var filePath = g_srcworkpath + jsFile;
	
	var pos = filePath.lastIndexOf('/');
	if ( pos <= 0 ) return false;
	var newDir = filePath.substr(0, pos) + '/__tmp/';
	try{
		fs.mkdirSync(newDir, 0777);
	} catch(e) {
	}
	var newfilePath = newDir + '__tmp_' + filePath.substr(pos+1);
	
	var s = '';
	try{
		s = fs.readFileSync(filePath, encoding='utf8');
	} 
	catch(e) {
		alert('can not find js file : ' + filePath);
		return false;
	}
	
	if (  (s.length >= 1) && (s.charCodeAt(0) == 65279) ) { // remove utf8 dom head
		s = s.substr(1, s.length-1);
	}
	
	for ( var repK in replaces ) {
		var rep = replaces[repK];
		var startPos = s.indexOf(rep.start);
		var endPos = s.indexOf(rep.end);
		var subStr = s.substr(startPos, endPos - startPos + rep.end.length);
		
		var newSubStr = subStr.replace(rep.start, 'var _lc_={};this.lc=function(){return _lc_;};');
		newSubStr = requireEx_replaceExportItems(newSubStr, rep);
		
		// check the local var is be defined
		for ( var itemK in rep.items ) {
			var item = rep.items[itemK];
			if ( newSubStr.match(new RegExp('var\\s+_lc_\\.'+item,"g")) == null) {
				print('*error: in ' + rep.start + ', the local var :' + item + ' is not defined!');
			}
		}
		
		newSubStr = newSubStr.replace( new RegExp('var\\s+_lc_\\.',"g"), '_lc_.');
		
		if ( rep.appends ) {
			for ( var k in rep.appends ) {
				newSubStr += '\n';
				
				var appendItem = requireEx_replaceExportItems(rep.appends[k], rep);
				newSubStr += 'this.' + appendItem;
			}
		}
		
		s = s.replace(subStr, newSubStr);
	}
	
	fs.writeFileSync(newfilePath, s, encoding='utf8');
	require(newfilePath);
	
	return true;
};

g_curtestsuite = '';
g_curtestcases = [];
resetCurTestCases = function(curFileName){
	if ( !curFileName ) return;
	
	if ( curFileName.indexOf('_t.js') < 0 ) {
		curFileName = curFileName.replace('.js', '_t.js');
	}
	
	var s = '';
	try{
		s = fs.readFileSync(curFileName, encoding='utf8');
	} 
	catch(e) {
		return;
	}
	
	s.replace(/([A-Za-z0-9_]+)\s*=\s*function\s*\(\s*suite\s*\)/g, function(a, w, c){
		g_curtestsuite = w;
	});
		
	s.replace(/suite.addTestCase\(([A-Za-z0-9_]+)/g, function(a, w, c){
		g_curtestcases.push(w);
	});
};

require('./scriptlists.js');
printMissingSemicolonErrors = function(curFileName){
	var missFileCount = 0;
	if ( !curFileName ) {
		for ( k in g_scriptlists ) { // 因为 g_testFiles 中的文件不全
			var path = g_baseworkpath + g_scriptlists[k];
			if ( path.indexOf('js/base/lua.js') > 0 ) continue;
			if ( printMissingSemicolonError( path ) ) {
				missFileCount++;
			}
		}
	}
	else {
		if ( printMissingSemicolonError(curFileName) ) {
			missFileCount++;
		}
	}
	
	if ( missFileCount > 0 ) {
		print('--------------------------------------');
		print( 'missing semicolon files count: ' + missFileCount );
		print('--------------------------------------');	
	}
};

printMissingSemicolonError = function(curFileName){
	if ( !curFileName ) return false;
	
	if ( curFileName.indexOf('_t.js') > 0 ) {
		curFileName = curFileName.replace('_t.js', '.js');
	}
	
	var s = '';
	try{
		s = fs.readFileSync(curFileName, encoding='utf8');
	} 
	catch(e) {
		return false;
	}
	
	if (  (s.length >= 1) && (s.charCodeAt(0) == 65279) ) { // remove utf8 dom head
		s = s.substr(1, s.length-1);
	}
	
	var option = {};
	var myResult = JSLINT(s, option);
	if ( myResult ) {
		return false;
	}
	
	var myData = JSLINT.data();
	for ( k in myData.errors ) {
		var e = myData.errors[k];
		print ( curFileName+':'+e.line+': ['+e.reason+'] character '+e.character+' : <'+e.evidence+'>' );
	}
	
	return true;
};

g_testFiles = [];
requireTestFiles = function(){
	for ( k in g_testFiles ) {
		require( g_testFiles[k] );
	}
};

g_testsuites = [];
addTestsuite = function(suite, name){
	if (name == '') return;
	eval( name + '(suite);' );
};

addTestsuites = function(suite, fromIdx, count){
	for ( var i=fromIdx; i<fromIdx+count; ++i ) {
		addTestsuite(suite, g_testsuites[i]);
	}
};


