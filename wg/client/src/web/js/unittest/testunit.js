// author: qujianbiao
g_out_profile = false;

print = function(msg){
	if ( navigator.userAgent.indexOf('NODE') >= 0 ) {
		console.error(msg);
	}
	else{
		document.getElementById('unittest_log_id').innerHTML += msg + '<br/>';
	}
};

_assist_msg = '';
clearAssistMsg = function(){
	_assist_msg = '';
};
setAssistMsg = function(msg){
	_assist_msg = msg;
};
getAssistMsg = function(){
	return _assist_msg;
};

_base_url_ = '';
setBaseUrl = function(burl){
	_base_url_ = burl;
};
getBaseUrl = function(){
	return _base_url_;
};


_err_assert_tag = 'createbytestunit';
assert = function(expression, message){
	if ( !expression ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}
};

assertInclude = function(str1, str2, message) {
	var expression = str1.indexOf(str2) >= 0;
	if ( !expression ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}
};

assertNoInclude = function(str1, str2, message) {
	var expression = (str1 != '') && (str1.indexOf(str2) < 0);
	if ( !expression ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}
};

isInclude = function(){
	if ( arguments.length < 2 ) return false;
	var str = arguments[0];
	if ( str == '' ) return false;
	if ( str.indexOf('undefined') >= 0 ) {	
		alert('include undefined');
		return;
	}
	
	for ( var i=1; i<arguments.length; ++i ) {
		var befind = arguments[i];
		if ( str.indexOf(befind) < 0 ) return false;
	}
	return true;
};

isNotInclude = function(){
	if ( arguments.length < 2 ) return false;
	var str = arguments[0];
	if ( str == '' ) return false;
	
	for ( var i=1; i<arguments.length; ++i ) {
		var befind = arguments[i];
		if ( str.indexOf(befind) >= 0 ) return false;
	}
	return true;
};

assertListEQ = function(aList, bList, message) {
	if ( !CompareUtil.eq(aList, bList) ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}	
};
assertEQ = assertListEQ;

assertFloatEQ = function(a, b, message, drt) {
	if ( !floatEQ(a, b, drt) ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}		
};

assertNotEQ = function(a, b, message) {
	if ( a == b ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}		
};

assertStrRepeatCount = function(s, key, count, message){
	var hasCount = 0;
	var list = s.split(',');
	for ( var i=0; i<list.length; ++i ) {
		if ( list[i] == key ) hasCount++;
	}
	
	if ( hasCount != count ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}
};

assertStrOrder = function(s, expectOrderStr, message){
	var list = s.split(',');
	var expectList = expectOrderStr.split(',');
	var pos = -1;
	var isOrdered = true;
	for ( var expectIdx=0; expectIdx<expectList.length; ++expectIdx){
		for ( var allIdx=0; allIdx<list.length; ++allIdx ) {
			if ( list[allIdx] == expectList[expectIdx] ) {
				if (allIdx > pos ) {
					pos = allIdx;
				} else {
					isOrdered = false;
					break;
				}
			}
		}
	}
	
	if ( !isOrdered ) {
		if ( !message ) {
			message = 'assertion failed!';
		}
		if ( getAssistMsg() != '' ) {
			message = '\n  ['+getAssistMsg()+'] '+message;
		}
		throw new Error(_err_assert_tag+message);
	}
};

floatEQ = function(a1, a2, drt) {
	if ( !drt ) drt = 0.001;
	return Math.abs(a1 - a2) < drt;
};

listEQ = function(aList, bList) {
	if (aList.length != bList.length) {
		return false;
	}
	
	for ( var i=0; i<aList.length; ++i ) {
		var aItem = aList[i];
		var bItem = bList[i];
		if ( aItem != bItem ) {
			return false;
		}
	}

	return true;
};

CompareUtil = Class.extern(function(){
	this.eq = function(a, b){
		if (a == null && b != null ) return false;
		if (a != null && b == null ) return false;
		return _compareDict(a,b);
	};
	
	var _compareDict = function(aItem, bItem){
		var aType = TQ.getTypeof(aItem);
		var bType = TQ.getTypeof(bItem);
		if (aType != bType) return false;
		if (aItem == bItem) return true;
		
		if (aType == 'dict' ){
			for (k in bItem) {
				var a = aItem[k];
				var b = bItem[k];
				if ( !_compareDict(a, b) ){
					return false;
				}
			}
			
			for (k in aItem) {
				var a = aItem[k];
				var b = bItem[k];
				if ( !_compareDict(a, b) ){
					return false;
				}
			}
			
			return true;
		}
		else if (aType == 'array' ){
			return _compareList(aItem, bItem);
		}
		else {
			return (aItem == bItem);
		}	
	};
	
	var _compareList = function(aList, bList){
		if (aList.length != bList.length) {
			return false;
		}
		
		for ( var i=0; i<aList.length; ++i ) {
			var aItem = aList[i];
			var bItem = bList[i];
			if ( !_compareDict(aItem, bItem) ) {
				return false;
			}
		}
		
		return true;	
	};
}).snew();

ErrorPrinter = Class.extern(function(){
	this.print = function(e){
		if ( this.isRaiseByAssert(e) ) {
			this.printAssertErr(e);
		}
		else {
			this.printCommErr(e);
		}
	};
	
	this.isRaiseByAssert = function(e){
		return (e.message && e.message.indexOf(_err_assert_tag) == 0 );
	};
	
	this.printAssertErr = function(e){
		var message = e.message.substr(_err_assert_tag.length, e.message.length - _err_assert_tag.length);
		var ss = this.getStackList(e);
		if ( ss && ss.length > 1 ) { // skip assert stack frame
			print(this.getRefUrl(ss[1])+' '+message);
		}
		else {
			print(message);
		}
	};
	
	this.printCommErr = function(e){
		var msg = '';
		if (e.fileName) msg += this.getRefUrl(e.fileName)+':'
		if (e.lineNumber) msg += e.lineNumber
		if (e.name) msg += ' ['+e.name+'] '
		if (e.errorNumber) msg += ' ['+(e.errorNumber & 0xFFFF)+'] '
		if (e.message) msg += ' ['+e.message+'] '
		print(msg);
		var ss = this.getStackList(e);
		if ( ss ) print('[stack]:');
		for ( k in ss ) {
			print(this.getRefUrl(ss[k]));
		}
	};
	
	this.getStackList = function(e){
		if ( !e.stack ) return null;
		if ( navigator.userAgent.indexOf('NODE') >= 0 ) {
			return e.stack.match(/[A-Za-z]:\\[^\)\s]*/g);
		}
		else {
			return e.stack.match(/http[^\)\s]*/g);
		}
	};
	
	this.getRefUrl = function(url){
		var burl = getBaseUrl();
		if ( burl == '' ) return url;
		if ( url.indexOf(burl) < 0 ) return url;
		return url.substr(burl.length, url.length-burl.length);
	};
}).snew();

TestResult = Class.extern(function(){
	this.init = function(name) {
		this.runCount = 0;
		this.failedCount = 0;
	};
	
	this.testStarted = function() {
		this.runCount = this.runCount + 1;
	};
	
	this.testFailed = function() {
		this.failedCount = this.failedCount + 1;
	};
	
	this.summary = function() {
		return this.runCount+' run, '+this.failedCount+' failed'
	};
});

JTestCase = JClass.ex({
	_init : function(name, classname){
		this.name = name;
		this.classname = classname;
	}
	
	,getClassName : function(){
		return this.classname;
	}
	
	,getName : function(){
		return this.name;
	}
	
	,setUp : function(){
	}
	
	,run : function(result){
		if ( result == null ) {
			result = TestResult.snew();
		}
		result.testStarted();
		
		var step = 0;
		try {
			this.setUp();
			step++;
			this[this.name](this);
			step++;
			this.tearDown();
			step++;
		}
		catch(e){
			ErrorPrinter.print(e);
			result.testFailed();
			if ( step == 1 || step == 2 ) this.tearDown();
		}
		
		return result;
	}
	
	,tearDown : function(){
	}
});

TestCase = Class.extern(function(){
	this.init = function(name, classname){
		this.name = name;
		this.classname = classname;
	};
	
	this.getClassName = function(){
		return this.classname;
	};
	
	this.getName = function(){
		return this.name;
	};
	
	this.setUp = function(){
	};
	
	this.run = function(result){
		if ( result == null ) {
			result = TestResult.snew();
		}
		result.testStarted();
		
		var step = 0;
		try {
			this.setUp();
			step++;
			this[this.name](this);
			step++;
			this.tearDown();
			step++;
		}
		catch(e){
			ErrorPrinter.print(e);
			result.testFailed();
			if ( step == 1 || step == 2 ) this.tearDown();
		}
		
		return result;
	};
	
	this.tearDown = function(){
	};
});

TestSuite = Class.extern(function(){
	this.init = function(){
		this.tests = [];
	};
	
	this.add = function(test){
		this.tests.push(test);
	};
	
	this.addTestCase = function(testcase, classname){
		classname = classname ? classname : '';
		var tobj = testcase.snew('', classname);
		for (k in tobj) {
			if ( k.indexOf('test') != 0 || typeof(tobj[k]) != 'function') continue;
			this.add(testcase.snew(k, classname));
		}
	};
	
	this.run = function(result, testcases){
		if ( result == null ) {
			result = TestResult.snew();
		}
		
		var list = [];
		
		for (k in this.tests) {
			if ( !this.isNeedRun(this.tests[k], testcases) ) continue; 
			
			var name = '';
			var lasttime = 0;
			if ( g_out_profile ) {
				name = this.tests[k].getName();
				lasttime = new Date().getTime();
			}
			
			setAssistMsg(this.tests[k].getName());
			this.tests[k].run(result);
			
			if ( g_out_profile ) {
				var curtime = new Date().getTime();
				list.push({name:name, time:curtime - lasttime});
			}
			
			clearAssistMsg();
		}
		
		if ( g_out_profile ) {
			list = list.sort(function(a, b) {
				return b.time - a.time;
			});
			
			for ( var k in list ) {
				var v = list[k];
				print( v.name + ':' + v.time);
			};
		}
		
		return result
	};
	
	this.isNeedRun = function(curcase, testcases){
		if ( testcases == null || testcases.length == 0 ) return true;
		for ( var k in testcases ) {
			if ( curcase.getClassName() == testcases[k] ) return true;
		}
		return false;
	};
});
