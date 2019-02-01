//http://dean.edwards.name/packer/
//http://unixpapa.com/js/mouse.html(兼容文章)
//http://www.jslint.com/(语法检查)
//http://www.twinhelix.com/css/iepngfix/demo/ (ie6 png 透明)

//Browser
//RichText
//PureText
//String
//Mouse
//Caret
//Image
//Dom


TIP_PREFIX = '$';

BS_UNKNOWN = 0;
BS_MSIE = 1;
BS_OPERA = 2;
BS_FIREFOX = 3;
BS_SAFARI = 4;
BS_CHROME = 5;
BS_NETSCAPE = 6;
BS_MOZILLA = 7;

// 按键类型
BTN_LEFT = 0;
BTN_MID = 1;
BTN_RIGHT = 2;

G_ID_ASCCOMP = function(a, b){return a.id - b.id;};
G_ID_DESCCOMP = function(a, b){return b.id - a.id;};

//profile 已经有这个函数，找到它
tprofile = Class.extern(function(){
	this.init = function(){
		this.root = this._newNode(null);
		this.curNode = this.root;
		this.indent = 0;
	};
	
	this.begin = function(nodeName){
		var curTime = new Date().getTime();
		if ( !this.curNode.childNodes[nodeName] ) {
			this.curNode.childNodes[nodeName] = this._newNode(this.curNode);
		}
		
		this.curNode.childNodes[nodeName].lastTime = curTime;
		this.curNode.childNodes[nodeName].count++;
		this.curNode = this.curNode.childNodes[nodeName];
	};
	
	this.end = function(nodeName){
		this.curNode = this.curNode.parentNode;
		var curTime = new Date().getTime();
		this.curNode.childNodes[nodeName].useTime = curTime - this.curNode.childNodes[nodeName].lastTime;
		if (this.curNode == this.root) {
			this.indent = 0;
			this._printNodes(null, this.root);
		}
	};
	
	this._printNodes = function(nodeName, node){
		this.indent++;
		if ( nodeName ) {
			//log(this._getIndentWhiteSpace() + 'profile[' + nodeName + ']: useTime:' + node.useTime);
		}
		
		for ( var k in node.childNodes ) {
			this._printNodes(k, node.childNodes[k]);
		}
		this.indent--;
	};
	
	this._newNode = function(parentNode){
		return {parentNode:parentNode, lastTime:0, useTime:0, count:0, childNodes:{}};
	};
	
	this._getIndentWhiteSpace = function(){
		var s = '';
		for ( var i=0; i<this.indent; i++ ){
			s += '&nbsp;&nbsp;';
		}
		return s;
	};
}).snew();

/** 判断当前值是否为null
*/
isNull = function(val) {
	if ( val != undefined && val != null) {
		return false;
	}
	return true;
};

Math.clamp = function(val, min, max){
	if (val < min) return min;
	if ( val > max ) return max;
	return val;
};

Math.randomInt = function(maxInt){
	return Math.floor( (Math.random()*100000000)%maxInt );
};

UnicodeStr = Class.extern(function(){
	var m_this = null;
	this.init = function(){
		m_this = this;
	};
	
	this.byteSubStr = function(str, maxBytes){
		var lastpos = 0;
		var _limitBytes = function(pos, bytes, code, rt){
			if ( (rt +  bytes) > maxBytes ) return -1;
			lastpos = pos;
			return rt + bytes;
		};
		
		this.travel(str, _limitBytes, _getBytes);
		return str.substr(0, lastpos+1);
	};
	
	this.gbkSubStr = function(str, maxBytes){
		var lastpos = 0;
		var _limitGbkBytes = function(pos, bytes, code, rt){
			if ( (rt +  bytes) > maxBytes ) return -1;
			lastpos = pos;
			return rt + bytes;
		};
		
		this.travel(str, _limitGbkBytes, _getGBKBytes);
		return str.substr(0, lastpos+1);
	};
	
	this.gbkLen = function(str){
		var _convertToGbkBytes = function(pos, bytes, code, rt){
			return rt + bytes;
		};	
		
		return this.travel(str, _convertToGbkBytes, _getGBKBytes);
	};
	
	this.travel = function(str, fun, bytesGetter){
		var rt = 0;
		for ( var i = 0; i < str.length; ++i ) {
			var code = str.charCodeAt(i);
			var bytes =  bytesGetter(code);
			rt = fun(i, bytes, code, rt);
			if (rt == -1) break;
		}
		return rt;
	};
	
	var _getGBKBytes = function(code){
		if ( code <= 0xff ) return 1;
		else return 2;
	};
	
	var _getBytes = function(code){
		if ( code <= 0xff ) return 1;
		else return 3;
	};
}).snew();

InputLimit = Class.extern(function(){
	var m_this;
	this.init = function(){
		m_this = this;
	};
	
	this.isNeedLimitEvent = function(e){
		var key = TQ.getKeyCode(e);
		if ( key == VK_KEY.F5) return false;
		if ( e.ctrlKey && (key == VK_KEY.A || key == VK_KEY.C || key == VK_KEY.X || key == VK_KEY.Z || key == VK_KEY.Y  ) )  return false;
		if(key >= VK_KEY.NUM_0 || key == VK_KEY.RETURN || key == VK_KEY.SPACE ) return true;
		else return false;
	};
	
	this.maxGBKBytes = function(inputdom, maxgbkbytes, caller){
		inputdom._caller = caller ? caller : NullCaller;
		TQ.addEvent(inputdom,'keydown',function(e){
			e = e ? e : window.event;
			if ( !m_this.isNeedLimitEvent(e) ) return;
			if ( UnicodeStr.gbkLen(inputdom.value) >= maxgbkbytes) {
				TQ.preventDefault(e);
			}
			inputdom._caller.invoke();
		});
		TQ.addEvent(inputdom,'keyup',function(e){
			if( UnicodeStr.gbkLen(inputdom.value) >= maxgbkbytes) {
				inputdom.value = UnicodeStr.gbkSubStr(inputdom.value, maxgbkbytes);
			}
			inputdom._caller.invoke();
		});
	};
}).snew();

ErrorGetter = Class.extern(function(){
	this.getCommErr = function(e){
		var msg = '';
		if (e.fileName) msg += e.fileName + ':';
		if (e.lineNumber) msg += e.lineNumber;
		if (e.name) msg += ' ['+e.name+'] ';
		if (e.number) msg += ' ['+e.number+'] ';
		if (e.errorNumber) msg += ' ['+(e.errorNumber & 0xFFFF)+'] ';
		if (e.message) msg += ' ['+e.message+']<br/>';
		
		var ss = this.getStackList(e);
		if ( ss ) msg += '[stack]:<br/>';
		for ( k in ss ) {
			msg += ss[k] + '<br/>';
		}
		return msg;
	};
	
	this.getStackList = function(e){
		if ( !e.stack ) return null;
		if ( navigator.userAgent == 'NODE' ) {
			return e.stack.match(/[A-Za-z]:\\[^\)\s]*/g);
		}
		else {
			return e.stack.match(/http[^\)\s]*/g);
		}
	};
}).snew();


EscapeString = Class.extern(function(){
	this.subStr = function(s, len){
		if ( s.length <= len ) {
			return s.substr(0, s.length);
		}
		
		var ec = _getEscapeCharacter(s, len);
		if ( _isEscapeCharacter(ec.s) ) {
			return s.substr(0, ec.pos);
		}
		
		return s.substr(0, len);
	};
	
	var _getEscapeCharacter = function(s, len) {
		var ecStart = -1;
		for ( var i=len-1, cnt=0; i>=0 && cnt < 10; --i, ++cnt ) {
			if ( s.charAt(i) == ';' ) {
				return '';
			}
			
			if ( s.charAt(i) == '&' ) {
				ecStart = i;
				break;
			}
		}
		
		if ( ecStart < 0 ) {
			return '';
		}
		
		var ecEnd = -1;
		for ( var i=len, cnt=0; i<s.length && cnt < 10; ++i, ++cnt ) {
			if ( s.charAt(i) == '&' ) {
				return '';
			}
			
			if ( s.charAt(i) == ';' ) {
				ecEnd = i;
				break;
			}
		}
		
		if ( ecEnd < 0 ) {
			return '';
		}
		
		return {pos:ecStart, s:s.substr(ecStart, ecEnd - ecStart + 1)};
	};
	
	var _isEscapeCharacter = function(ec){
		var ecs = ['&bfh;', '&dkhl;', '&dkhr;', '&quot;', '&apos;', '&hcj;', '&hck;', '&hcl;' ];
		for ( var k in ecs ) {
			if ( ecs[k] == ec ) {
				return true;
			}
		}
		return false;
	};
}).snew();

/*
function hideinfo(e){
	var e = e ? e : window.event;
    if(e.srcElement.tagName.toLowerCase()=="a"){//如果触发函数的对象是链接
        //设置状态栏的显示为链接的文本
		log(window.status);
        window.status='';
    }
}
document.onmouseover=hideinfo; //鼠标移上时调用 hideinfo 函数
document.onmousemove=hideinfo; //鼠标移动时调用 hideinfo 函数
document.onmousedown=hideinfo; //鼠标按下时调用 hideinfo 函数
*/

TQ = new function(){
	//------------
	//public:const
	//------------
	
	//------------
	//public:private
	//------------
	var m_this;
	var m_curBrowserType = BS_UNKNOWN;
	var m_curBrowserVer = 0;
	var m_browserNames = ['unknow','msie','opera','firefox','safari','chrome','netscape','mozilla'];
	var m_truebody = null;
	var m_objDate;
	var m_comDom;
	var m_loadedscripts={};
	var m_gbody = null;
	var m_ie6drtw = 4;
	var m_isMobile = false;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(){
		m_this = this;
		m_curBrowserType = _initBrowserType();
		
		var ua = navigator.userAgent.toLowerCase();
		m_isMobile = true;//ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1;

		m_objDate = new Date();
	};
	
	this.getUiBody = function(){
		if ( !m_gbody ) {
			m_gbody = TQ.getDomById('g_body');
		}
		return m_gbody;
	};
	
	this.isMobile = function(){
		return m_isMobile;
	};
	
	this.isEmptyDict = function(dict){
		if ( !dict ) return true; 
		for ( var k in dict ) {
			if ( !isNull(dict[k]) ) 
				return false;
		}
		return true;
	};
	
	this.formatColorStr = function(s, color, exstyle){
		if (exstyle) {
			return '<font color="'+color+'" style="' + exstyle  + '">'+s+'</font>';
		} else {
			return '<font color="'+color+'">'+s+'</font>';
		}
	};
	
	this.getIe6DrtW = function(){
		return  m_this.isIE6() ? m_ie6drtw : 0;
	};
	
	this.hasBit = function(val,bit){
		return (val&bit)==bit;
	};
	
	this.isIE6 = function(){
		return this.isIE() && (this.getBrowserVer() < 7.0);
	};
	
	this.isIE7 = function(){
		return this.isIE() && (this.getBrowserVer() >= 7.0 && this.getBrowserVer() < 8.0 );
	};
	
	this.isIE8 = function(){
		return this.isIE() && (this.getBrowserVer() >= 8.0 && this.getBrowserVer() < 9.0 );
	};
	
	this.isIE9 = function(){
		return this.isIE() && (this.getBrowserVer() >= 9.0 && this.getBrowserVer() < 10.0 );
	};
	
	this.isIE10 = function(){
		return this.isIE() && (this.getBrowserVer() >= 10.0 && this.getBrowserVer() < 11.0 );
	};
	
	this.isIE = function(){
		return m_curBrowserType == BS_MSIE;
	};
	
	this.isLessVerIE = function(maxVer){
		return this.isIE() && (this.getBrowserVer() < maxVer);
	};
	
	this.getDomParent = function(dom){
		if ( !dom ) return null;
		return dom.parentNode;
	};
	
	this.getBrowserVer = function(){
		return m_curBrowserVer;
	};
	
	this.fixIE6Png = function(dom){
		if ( m_this.isIE6() ){
			DD_belatedPNG.init();
			DD_belatedPNG.fixPng(dom);
		}
	};
	
	this.getValidEvent = function(e){
		return e ? e : window.event;
	};
	
	this.formatLine = function(msg){
		return '<div style="white-space:nowrap;">'+msg+'</div>';
	};
	
	this.format = function(){
		if( arguments.length == 0 )
			return null;
		return m_this.formatArgs(arguments[0], arguments, 1);
	};
	
	this.formatArgs = function(fmt, args, startpos){
		var str = fmt;
		if ( !args ) return str;
		if ( !startpos ) startpos = 0;
		for(var i=startpos; i<args.length; i++) {
			var re = new RegExp('\\{' + (i-startpos) + '\\}','gm');
			str = str.replace(re, args[i]);
		}
		return str;
	};
	
	this.getFlashVer = function() {
		var version = '';
		//return version;
		try {
			version = navigator.plugins['Shockwave Flash'].description;
		}
		catch(e) {
			try {
				version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
			}
			catch(e) {}
		}
		return version;
	};
	
	/** 排序二分法查找 */
	this.qfind = function(arrays, keyname, keyval){
		return Finder.qfind(arrays, keyname, keyval);
	};
	
	/** 顺序查找 */
	this.find = function(arrays, keyname, keyval, spec) {
		return Finder.find(arrays, keyname, keyval, spec);
	};
	
	/** 将一个对值的list转换成dict, 如 [key1, val1, key2, val2] -> {key1:val1, key2:val2}
	*/
	this.pairListToDict = function(pairList){
		var disc = {};
		for ( var i=0, n=pairList.length/2; i<n; ++i ){
			disc[pairList[2*i]] = pairList[2*i+1];
		}
		return disc;
	};
	
	this.listToSet = function(list){
		var disc = {};
		for ( var i=0; i<list.length; ++i){
			disc[list[i]] = true;
		}
		return disc;
	};
	
	this.dictToList = function(dict){
		var list = [];
		for ( var k in dict ) {
			list.push( dict[k] );
		}
		return list;
	};
	
	this.getLastFindIdx = function(){
		return Finder.getLastIdx();
	};
	
	/** 获得浏览器的类型 */
	this.getBrowserType = function(){
		return m_curBrowserType;
	};
	
	/** 获得浏览器的名称 */
	this.getBrowserName = function(){
		return m_browserNames[m_curBrowserType];
	};

	/** 获得窗口的滚动条位置 */
	this.getScrollPos = function(){
		var sLeft = document.body.scrollLeft ? document.body.scrollLeft : 0 ; 
		var sTop = document.body.scrollTop ? document.body.scrollTop : 0; 
		if (document.compatMode==="CSS1Compat") {
			sLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : sLeft;
			sTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : sTop;
		}
		return {x:sLeft, y:sTop};
	};
	
	/** 获得窗口的大小 */
	this.getWinSize = function(){
		var truebody = _getTrueBody();
		return {cx:truebody.clientWidth,cy:truebody.clientHeight};
	};
	
	this.getWinInnerSize = function(){
		return this._getWinInnerSizeByQQApi();
	};
	
	this._getWinInnerSize = function(){//包含滚动条的宽度和高度
		if (window.innerWidth && window.innerHeight) {
			return {cx:window.innerWidth,cy:window.innerHeight};
		}
		else {
			var size_div = document.getElementById("size_div");
			var bodyClientWidth = document.body.clientWidth;
			var bodyClientHeight = document.body.clientHeight;
			var clientWidth = size_div.clientWidth;
			var clientHeight = size_div.clientHeight;
			if (this.isIE7()){
				var hasHorizontalScrollBar = clientWidth < bodyClientWidth;
				return {cx:clientWidth
					,cy:clientHeight+(hasHorizontalScrollBar?this.getBrowserScollBarH():0)};
			}
			else if (this.isIE() && (this.getBrowserVer() > 7.0)) {
				var hasHorizontalScrollBar = clientWidth < bodyClientWidth;
				var hasVerticalScrollBar = clientHeight < bodyClientHeight;
				return {cx:clientWidth+(hasVerticalScrollBar?this.getBrowserScollBarW():0)
					,cy:clientHeight+(hasHorizontalScrollBar?this.getBrowserScollBarH():0)};
			}
			else {
				return {cx:clientWidth,cy:clientHeight};
			}
		}
	};
	
	this._getWinInnerSizeByQQApi = function(){
		var size = this._getWinInnerSize();
		return size;
		/*
		fusion2.canvas.getClientRect({
			onSuccess : function (rect) { 
				//size.cx = rect.clientRight - rect.clientLeft;
				size.cy = rect.clientBottom - rect.clientTop;
			}
		});
		return size;
		*/
	};
	
	this.getBrowserScollBarH = function(){
		var scrollbar_div = document.getElementById("scrollbar_div");
		return 100 - scrollbar_div.clientHeight;
	};
	
	this.getBrowserScollBarW = function(){
		var scrollbar_div = document.getElementById("scrollbar_div");
		return 100 - scrollbar_div.clientWidth;
	};
	
	/** 通过当前屏幕大小、要显示的面板大小、不可覆盖的鼠标区域，来调节pos的位置，一般用于tooltip和menu的显示中
	@param pos 将要被调节的位置
	@param panelSize 面板的大小
	@param mouseSize[可选] 不可覆盖的鼠标区域
	@return 返回调节后的鼠标位置 {x:,y:}
	*/
	this.getAdjustPosByWinSize = function(pos, panelSize, mouseSize){
		if ( !mouseSize ) {
			mouseSize = {cx:0, cy:0};
		}
		
		var scrollPos = this.getScrollPos();
		var winSize = this.getWinSize();
		var newPos = {x:pos.x, y:pos.y};
		
		if( (newPos.x + panelSize.cx + mouseSize.cx) > (scrollPos.x+winSize.cx) ){
			newPos.x = newPos.x - panelSize.cx - mouseSize.cx/2;
		}
		else {
			newPos.x += mouseSize.cx;
		}
		
		if ( newPos.x < scrollPos.x ) {
			newPos.x = scrollPos.x;
		}
		
		if( (newPos.y + panelSize.cy + mouseSize.cy) > (scrollPos.y+winSize.cy) ){
			newPos.y = newPos.y - panelSize.cy - mouseSize.cy/2;
		}
		else {
			newPos.y += mouseSize.cy;
		}
		
		if ( newPos.y < scrollPos.y ) {
			newPos.y = scrollPos.y;
		}
		
		return newPos;
	};
	
	/** 创建一个dom对象 */
	this.createDom = function(domtype){
		return document.createElement(domtype);
	};
	
	/** 通过id获得一个dom对象 */
	this.getDomById = function(id){
		return document.getElementById(id);
	};
	
	/** 向一个dom对象中添加一个className */
	this.appendClass = function(dom, className){
		if ( !dom.className ) { dom.className = ''; }
		if ( dom.className.indexOf(className) >= 0 ) { return; }
		if ( dom.className !== '' ) {
			dom.className += ' ';
		}
		dom.className += className;
	};
	
	/** 从一个dom对象中删除一个classNames */
	this.removeClass = function(dom, classvalue){
		if ( dom.className ){
			var rclass = /[\n\t]/g;
			var rspaces = /\s+/;
			var classNames = (classvalue.toLowerCase()).split( rspaces );
			var className = (" " + dom.className.toLowerCase() + " ").replace(rclass, " ");
			for ( var c = 0, cl = classNames.length; c < cl; ++c ) {
				className = className.replace(new RegExp(" " + classNames[c] + " ", "g"), " ");
			}
			dom.className = this.trim(className);
		}
	};
	
	/** 设置一个dom对象的className */
	this.setClass = function(dom, className){
		dom.className = className;
	};
	
	/** 获得一个dom对象的className */
	this.getClass = function(dom){
		return dom.className;
	};
	
	/** 获得指定的子dom */
	this.getSubDom = function(parent,subs){
		var subdom = parent;
		for ( var i=0; i<subs.length; ++i ){
			subdom = subdom.childNodes[subs[i]];
		}
		return subdom;
	};
	
	this.hasSubDom = function(parent, dom){
		for ( var k in parent.childNodes ) {
			if ( parent.childNodes[k] == dom ) {
				return true;
			}
		}
		
		return false;
	};
	
	/** 输入框textarea最大长度 */
	this.maxLength = function(inputdom, maxlength){
		var domtag = inputdom.tagName.toLowerCase();
		if ( domtag == "textarea" ){
			this.addEvent(inputdom,'keydown',function(e){
				e = e ? e : window.event;
				var key = m_this.getKeyCode(e);
				if ( key == VK_KEY.F5) return;
				if ( e.ctrlKey && (key == VK_KEY.A || key == VK_KEY.C || key == VK_KEY.X || key == VK_KEY.Z || key == VK_KEY.Y  ) )  return;
				if(key >= VK_KEY.NUM_0 || key == VK_KEY.RETURN || key == VK_KEY.SPACE ) {
					var length = inputdom.value.length;
					if(length >= maxlength) {
						m_this.preventDefault(e);
					}
				}
			});
			this.addEvent(inputdom,'keyup',function(e){
				var length = inputdom.value.length;
				if(length >= maxlength) {
					inputdom.value = inputdom.value.substring(0,maxlength);
				}
			});
		}
		else if ( domtag == "input" ){
			this.setAttr(inputdom, 'maxLength', maxlength);
		}
	};
	
	/** 在对象中添加一个事件处理函数 */
	this.addEvent = function (o, t, f) {
		if (o.addEventListener) {
			if ( m_curBrowserType == BS_FIREFOX ){
				if ( t == 'mousewheel' ) t = 'DOMMouseScroll';
			}
			o.addEventListener(t, f, false);
		}
		else if (o.attachEvent) o.attachEvent('on'+ t, f);
		else o['on'+ t] = f;
	};
	
	/** 在对象中删除一个事件处理函数 */
	this.removeEvent = function (o, t, f) {
		if (o.removeEventListener) o.removeEventListener(t, f, false);
		else if (o.detachEvent) o.detachEvent('on'+ t, f);
		else o['on'+ t] = null;
	};
	
	this.removeElement = function(arrays, index) {
		if ( index >= 0 && index < arrays.length ) {
			arrays[index] = null;
			for ( var i=index; i<(arrays.length-1); ++i ) {
				arrays[i] = arrays[i+1];
			}
			arrays.length -= 1;
		}
	};
	
	/** 取消事件的上层冒泡传递处理 */
	this.stopPropagation = function(e){
		e = e ? e: window.event;
		e.cancelBubble = true;
		if ( e.stopPropagation ){
			e.stopPropagation();
		}
	};
	
	this.preventDefault = function(e){
		e = e ? e: window.event;
		if ( e.preventDefault ) {  
			e.preventDefault();  
		}
		else {  
			e.returnValue = false;  
			e.cancelBubble=true;
		}
	};
	
	this.getKeyCode = function(e){
		e = e ? e: window.event;
		var k = 0;
		if ( e.keyCode ){
			k = e.keyCode;
		}
		else if (e.which) {
			k = e.which;
		}
		else{
			k = e.charCode;
		}		
		return k;
	};
	
	/** 获得鼠标的绝对位置 */
	this.mouseCoords = function(ev){
		ev = ev ? ev : window.event;
		if( !isNull(ev.pageX) || !isNull(ev.pageY) ){
			return {x:ev.pageX, y:ev.pageY};
		}
		
		var srollPos = m_this.getScrollPos();
		var truebody = _getTrueBody();
		return {
			x:ev.clientX + srollPos.x - truebody.clientLeft,
			y:ev.clientY + srollPos.y - truebody.clientTop
		};
	};
	
	/** clone一个事件 */
	this.cloneEvent = function(e){
		var newEvent = {};
		newEvent.pageX = e.pageX;
		newEvent.pageY = e.pageY;
		newEvent.clientX = e.clientX;
		newEvent.clientY = e.clientY;
		newEvent.button = e.button;
		return newEvent;
	};
	
	/** 获得dom对象相对于整个屏幕的偏移量 */
	this.domOffset = function(dom){
		var left = 0;
		var top = 0;
		var curdom = dom;
		while(curdom && curdom.offsetLeft != undefined){
			left += curdom.offsetLeft;
			top += curdom.offsetTop;
			curdom = curdom.offsetParent;
		}
		return {left:left,top:top};
	};
	
	/** 获得鼠标的相对位置 */
	this.mouseRelativeCoords = function(dom,ev){
		var off = this.domOffset(dom);
		var mPos = this.mouseCoords(ev);
		return {x:mPos.x-off.left, y:mPos.y-off.top};
	};
	
	this.offsetPoint = function(pos, dx, dy){
		return {x:pos.x + dx, y:pos.y + dy};
	};
	
	/** 获得事件按钮类型 */
	this.getBtnType = function(e) {
		var btntype = BTN_LEFT;
		if ( m_curBrowserType == BS_MSIE ) {
			if ( e.button == 1 ) btntype = BTN_LEFT;
			else if ( e.button == 4 ) btntype = BTN_MID;
			else if ( e.button == 2 ) btntype = BTN_RIGHT;
		}
		else {
			if ( e.button == 0 ) btntype = BTN_LEFT;
			else if ( e.button == 1 ) btntype = BTN_MID;
			else if ( e.button == 2 ) btntype = BTN_RIGHT;
		}
		return btntype;
	};
	
	this.makeMouseEvent = function(pageX, pageY, buttontype, srcElement){
		var button = 0;
		if ( m_curBrowserType == BS_MSIE ) {
			if ( buttontype == BTN_LEFT ) button = 1;
			if ( buttontype == BTN_MID ) button = 4;
			if ( buttontype == BTN_RIGHT ) button = 2;
		} else {
			if ( buttontype == BTN_LEFT ) button = 0;
			if ( buttontype == BTN_MID ) button = 1;
			if ( buttontype == BTN_RIGHT ) button = 2;
		}
		return {pageX:pageX, pageY:pageY, button:button, srcElement:srcElement};
	};
	
	this.setCSS = function(elem, name, val){
		if ( name == 'float' ){
			elem.style.styleFloat = val;
			elem.style.cssFloat = val;
		} else if ( name.toLowerCase() == 'display') {
			if ( this.isIE() && val.toLowerCase() == 'none' ) { 
				// fix ie bug @see http://www.justarrangingbits.org/iehidingcontentbug/index.html
				this._setCommCSS(elem, name, 'block');
			}
			this._setCommCSS(elem, name, val);
		} else if ( name == 'opacity' ){
			if ( elem.filters ){
				if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) {
					elem.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + val + ');';
				} else {
					elem.style.filter = 'Alpha(opacity='+val+')';
				}
			} else {
				elem.style.opacity = val/100;
				elem.style['-moz-opacity'] = val/100;
			}
		} else if ( name == 'select' ){
			elem.style['-moz-user-select'] = val;
			elem.style['-webkit-user-select'] = val;
			elem.style['-ms-user-select'] = val;
			elem.style['-khtml-user-select'] = val;
			elem.style[' user-select'] = val;
			this._fixOldIESelectCSS(elem, val);
		} else{
			this._setCommCSS(elem, name, val);
		}
	};
	
	this.showElem = function(elem){
		this.setCSS(elem, 'display', 'block' );
	};
	
	this.hideElem = function(elem){
		this.setCSS(elem, 'display', 'none' );
	};
	
	this._fixOldIESelectCSS = function(elem, val) {
		if ( !TQ.isLessVerIE(11.0) ) return;
		if ( val == 'none' ) {
			elem.onselectstart = function(e){
				var e = e ? e : window.event;
				var tagName = e.srcElement.tagName.toLowerCase();
				return (tagName == 'input' || tagName == 'textarea');
			};
		} else {
			elem.onselectstart = function(){
				TQ.stopPropagation(); 
				return true;
			};
		}
	};
	
	this._setCommCSS = function(elem, name, val){
		try{
			elem.style[name] = val;
		} catch(err) {
			log('*error: setCSS['+name+']:'+val);
		}
	};
	
	/** 获得某个css的属性值:目前的需求只是width,height */
	this.curCSS = function( elem, name ) {
		var ret = '';
		if ( elem.currentStyle && elem.currentStyle[name] ) {
			ret = elem.currentStyle[name];
		} else if ( window.getComputedStyle ) {
			var computedStyle = window.getComputedStyle( elem, null );
			if ( computedStyle ){
				ret = computedStyle[name];
			}
		} else if ( elem.style && elem.style[name] ){
			ret = elem.style[name];
		}
		return ret;
	};
	
	/** 获得某个css的属性值 */
	this.getCSS = function( elem, name ) {
		var ret = '';
		if ( elem.style && elem.style[name] ){
			ret = elem.style[name];
		}
		else if ( elem.style && name == 'float' ){
			if ( elem.style.styleFloat ) {
				ret =  elem.style.styleFloat;
			}
			else if ( elem.style.cssFloat ) {
				ret =  elem.style.cssFloat;
			}
		}
		return ret;
	};
	
	/** 向dom中添加一个子dom*/
	this.append = function(dom,subdom){
		dom.appendChild(subdom);
	};
	
	/** 从dom中将subdom移除 */
	this.remove = function(dom, subdom){
		dom.removeChild(subdom);
	};
	
	/** 从dom中将subdom移除, only for ie */
	this.deleteDom = function(dom){
		if ( m_curBrowserType == BS_MSIE ){
			if ( !m_comDom ){
				m_comDom = m_this.createDom('div');
			}
			m_comDom.appendChild(dom);   
			m_comDom.innerHTML = '';   
		}
	};
	
	/** 设置一个dom的attribute */
	this.setAttr = function(dom,key,val){
		dom.setAttribute(key,val);
	};
	
	/** 设置dom的html文本 */
	this.setHtml = function(dom,text){
		try{
			dom.innerHTML = text;
		}
		catch(e){
			alert(text);
		}
	};
	
	this.setRichText = function(dom,text){
		this.setHtml(dom, text);
	};
	
	/** 设置dom的纯文本 */
	this.setText = function(dom,text){
		try{
			if ( m_curBrowserType == BS_FIREFOX ){
				dom.textContent = text;
			}
			else{
				dom.innerText = text;
			}
		}
		catch(e){
			alert(text);
		}
	};
	
	/** 设置dom的纯文本或格式文本 */
	this.setTextEx = function(dom, text){
		if ( typeof(text) == "string" && text.indexOf('<') >= 0 ){
			this.setText(dom, '');
			this.setHtml(dom, text);
		}
		else{
			this.setHtml(dom, '');
			this.setText(dom, text);
		}
	};
	
	this.getTextEx = function(dom){
		if ( dom.innerText !== '' ) {
			return dom.innerText;
		}
		else if ( dom.innerHTML !== '' ) {
			return dom.innerHTML;
		}
		return '';
	};
	
	/** 字典拷贝 
	@param des 目标
	@param src 源
	@remarks 如果某元素中存在_d:1,(delete之意)则源中已存在的该元素将被删除,
		     如果是数组，则需要在第一个元素指定数组元素的关键字段 _k:'xxx'*/
	this.dictCopy = function(des, src) {
		var type = m_this.getTypeof(src);
		if ( type == 'dict' ){
			_recursiveCopy(null,null,null,des,src);
		}
		else if ( type == 'array' ){
			_recursiveCopyArray(des,src);
		}
		else {
			alert(type);
			alert('disc copy type error');
		}
	};
	
	/** 获取一个变量的类型
	@return 返回的值为 array, disc, number, string, undefined 中之一 */
	this.getTypeof = function(a){
		var t = typeof(a);
		if ( t == 'object' ){
			if ( a instanceof Array ){
				t = 'array';
			}
			else{
				t = 'dict';
			}
		}
		return t;
	};
	
	this.formatTime = function(flag,sec){
		return _formatTime(flag,sec);
	};

	/** 返回 hour:min */
	this.formatTimeMin = function(min){
		var hours = parseInt(min/60);
		var mins = parseInt(min - hours*60);
		var ftime = _formatNumber(hours,2) + ':';
		ftime += _formatNumber(mins,2);
		return ftime;
	};
	
	/** 格式化一个日期时间 yy-mm-dd hh:mm:ss
	@param sec 传入的是总的秒数
	@return 返回格式化后的字符串 */
	this.formatDateTime = function(sec) {
		return this._formatDateTime(sec, 'datetime');
	};
	
	/** 格式化一个日期时间 yy-mm-dd
	@param sec 传入的是总的秒数
	@return 返回格式化后的字符串 */
	this.formatDate = function(sec) {
		return this._formatDateTime(sec, 'date');
	};
	
	/** 格式化一个日期时间 mm月dd日hh:mm:ss
	@param sec 传入的是总的秒数
	@return 返回格式化后的字符串 */
	this.formatShortDateTime = function(sec){
		return this._formatDateTime(sec, 'shortdatetime');
	};
	
	/** 格式化一个日期时间 mm月dd日
	@param sec 传入的是总的秒数
	@return 返回格式化后的字符串 */
	this.formatShortDate = function(sec){
		return this._formatDateTime(sec, 'shortdate');
	};
	
	this._formatDateTime = function(sec, flag) {
		m_objDate.setTime(sec*1000);
		var year = m_objDate.getYear();
		year = (year<1900?(1900+year):year);
		var mon = _formatNumber(m_objDate.getMonth() + 1, 2);
		var day = _formatNumber(m_objDate.getDate(), 2);
		var hour = _formatNumber(m_objDate.getHours(), 2);
		var min = _formatNumber(m_objDate.getMinutes(), 2);
		var sec = _formatNumber(m_objDate.getSeconds(), 2);
		var fmtdate = year + '-' + mon + '-' + day;
		if (flag == 'datetime') {
			fmtdate += ' ' + hour + ':' + min + ':' + sec;
		}
		if (flag == 'shortdatetime' ) {
			mon = m_objDate.getMonth() + 1;
			day = m_objDate.getDate();
			fmtdate = mon + '月' + day + '日';
			fmtdate += hour + ':' + min + ':' + sec;
		}
		if (flag == 'shortdate') {
			mon = m_objDate.getMonth() + 1;
			day = m_objDate.getDate();
			fmtdate = mon + '月' + day + '日';
		}
		return fmtdate;
	};
	
	this.isSameDay = function(timesec1, timesec2){
		m_objDate.setTime(timesec1*1000);
		var year1 = m_objDate.getYear();
		var mon1 = m_objDate.getMonth();
		var day1 = m_objDate.getDate();
		
		m_objDate.setTime(timesec2*1000);
		var year2 = m_objDate.getYear();
		var mon2 = m_objDate.getMonth();
		var day2 = m_objDate.getDate();
		
		return (year1 == year2) && (mon1 == mon2) && (day1 == day2);
	};
	
	this.getTextWidth = function(text){
		var ii=0;
		var a=text.replace(/[\x00-\xff]/g,"7|").replace(/[^\x00-\xff]/g,"13|").split("|");
		for(var i=0;i<a.length;i++){
			ii += parseInt(a[i]) || 0;
		}
		return ii;
	};
	
	this.trim = function(text){
		return this.trimRight(this.trimLeft(text));
	};
	
	this.trimLeft = function(text){
		return text.replace(/^\s+/, '');
	};
	
	this.trimRight = function(text){
		return text.replace(/\s+$/, '');
	};
	
	this.initArray = function(arrays, len, val){
		for ( var i=0; i<arrays.length; ++i ){
			arrays[i] = val;
		}
		for ( var i=arrays.length; i<len; ++i ){
			arrays.push(val);
		}
	};
	
	this.encodeMsgByBytesLimit = function(msg, maxBytes){
		var emsg = this.encodeMessage(msg);
		var subMsg = UnicodeStr.byteSubStr( emsg, maxBytes );
		return EscapeString.subStr(emsg, subMsg.length);
	};
	
	/** 对用户输入的内容进行过滤和转义(编码)
	@param msg 字符串 */
	this.encodeMessage = function(msg) {
		var rtmsg = msg.replace(/%/g, "&bfh;");
		rtmsg = rtmsg.replace(/#\[\s.A/g, "*[A");
		rtmsg = rtmsg.replace(/\[/g, "&dkhl;");
		rtmsg = rtmsg.replace(/\]/g, "&dkhr;");
		rtmsg = rtmsg.replace(/\"/g, "&quot;");
		rtmsg = rtmsg.replace(/\'/g, "&apos;");
		rtmsg = rtmsg.replace(/\r\n/g, "&hcj;");
		rtmsg = rtmsg.replace(/\r/g, "&hck;");
		rtmsg = rtmsg.replace(/\n/g, "&hcl;");
		return rtmsg;
	};
	
	/** 对用户输入的内容进行过滤和转义(解码)
	@param msg 字符串 */
	this.decodeMessage = function(msg,mode){
		var rtmsg = msg.replace(/&bfh;/g, "%");
		rtmsg = rtmsg.replace(/&dkhl;/g, "[");
		rtmsg = rtmsg.replace(/&dkhr;/g, "]");
		rtmsg = rtmsg.replace(/</g, "&lt;"); // fact is encode
		rtmsg = rtmsg.replace(/>/g, "&gt;"); // fact is encode
		rtmsg = rtmsg.replace(/&hcj;/g, "<br/>");
		rtmsg = rtmsg.replace(/&hck;/g, "<br/>");
		rtmsg = rtmsg.replace(/&hcl;/g, "<br/>");
		rtmsg = rtmsg.replace(/&apos;/g, "'");
		rtmsg = rtmsg.replace(/ /g, "&nbsp;");
		return rtmsg;
	};
	
	this.decodeMessageForText = function(msg,mode){
		var msg0 = msg.replace(/&bfh;/g, "%");
		var msg1 = msg0.replace(/&dkhl;/g, "[");
		var msg2 = msg1.replace(/&dkhr;/g, "]");
		var msg3 = msg2.replace(/&quot;/g, "\"");
		var msg4 = msg3.replace(/&apos;/g, "\'");
		var msg5 = msg4.replace(/&hcj;/g, "\r\n");
		var msg6 = msg5.replace(/&hck;/g, "\r");
		var msg7 = msg6.replace(/&hcl;/g, "\n");
		var msg8 = msg7.replace(/&lt;/g, "<");
		var msg9 = msg8.replace(/&gt;/g, ">");
		return msg9;
	};
	
	this.decodeMessageEx = function(msg,mode){
		var msg0 = msg.replace(/&bfh;/g, "%");
		var msg1 = msg0.replace(/&dkhl;/g, "[");
		var msg2 = msg1.replace(/&dkhr;/g, "]");
		var msg3 = msg2.replace(/&hcj;/g, "\r\n");
		var msg4 = msg3.replace(/&hck;/g, "\r");
		var msg5 = msg4.replace(/&hcl;/g, "\n");
		var msg6 = msg5.replace(/&apos;/g, "'");
		return msg6;
	};
	
	this.decodeMessageForChat = function(msg){
		var dmsg = msg.replace(/</g, "&lt;");
		dmsg = dmsg.replace(/>/g, "&gt;");
		return dmsg;
	};
	
	this.insertAtCursor = function(myField, myValue) {
		if (myField.createTextRange && myField.caretPos) {
			var caretPos = myField.caretPos;
			caretPos.text =caretPos.text.charAt(caretPos.text.length - 1) == ' ' ?myValue + ' ' : myValue; 
			this.setCaretPos(myField, myField.caretPosVal+myValue.length);
		} 
		else if ( document.selection ){
			var rng = myField.createTextRange();
			rng.text = myField.value;
			rng.collapse(false);
			
			var sel = document.selection.createRange();  
			sel.text = myValue; 
			sel.select();
		}
		else if ( myField.selectionStart || myField.selectionStart == "0" ) {  
			myField.focus();
			var startPos = myField.selectionStart;  
			var endPos = myField.selectionEnd;  
			myField.value = myField.value.substring(0, startPos)
				+ myValue  
				+ myField.value.substring(endPos, myField.value.length);
			startPos += myValue.length;
			myField.selectionStart = startPos;
			myField.selectionEnd = startPos;
		}
		else {
			myField.focus();
			myField.value += myValue;
		}
	};
	
	this.getDomWidth = function(dom){
		return dom.w_ ? dom.w_ : dom.offsetWidth;
	};
	
	this.getDomAutoWidth = function(dom){
		return dom.offsetWidth;
	};
	
	this.getDomHeight = function(dom){
		return dom.h_ ? dom.h_ : dom.offsetHeight;
	};
	
	this.getDomAutoHeight = function(dom){
		return dom.offsetHeight;
	};
	
	this.setDomRect = function(dom, l, t, w, h){
		this.setDomPos(dom, l, t);
		this.setDomSize(dom, w, h);
	};
	
	this.setDomPos = function(dom, l, t){
		TQ.setDomLeft(dom, l);
		TQ.setDomTop(dom, t);
	};
	
	this.setDomLeft = function(dom, l){
		TQ.setCSS(dom, 'left', l+'px');
	};
	
	this.setDomTop = function(dom, t){
		TQ.setCSS(dom, 'top', t+'px');
	};
	
	this.setDomSize = function(dom, w, h){
		this.setDomWidth(dom, w);
		this.setDomHeight(dom, h);
	};
	
	this.setDomWidth = function(dom, w){
		if (w == 'auto'){
			TQ.setCSS(dom, 'width', 'auto');
			dom.w_ = null;
		} else {
			TQ.setCSS(dom, 'width',w + 'px');
			dom.w_ = w;
		}
	};
	
	this.setDomHeight = function(dom, h){
		if (h == 'auto'){
			TQ.setCSS(dom, 'height', 'auto');
			dom.h_ = null;
		} else {
			TQ.setCSS(dom, 'height', h + 'px');
			dom.h_ = h;
		}
	};
	
	this.getDomRect = function(dom){
		var l = parseInt(TQ.getCSS(dom, 'left'), 10);
		var t = parseInt(TQ.getCSS(dom, 'top'), 10);
		var w = parseInt(TQ.getCSS(dom, 'width'), 10);
		var h = parseInt(TQ.getCSS(dom, 'height'), 10);
		return {l:l, t:t, w:w, h:h};
	};
	
	this.getDomSize = function(dom){
		var rect = this.getDomRect(dom);
		return {cx:rect.w, cy:rect.h};
	};
	
	this.getDomPos = function(dom){
		var rect = this.getDomRect(dom);
		return {x:rect.l, y:rect.t};
	};
	
	this.isFunction = function(obj) {
		return typeof obj === 'function';
	};
	
	this.getHTMLElementPosition = function (element) {
        var docElem = document.documentElement;
        var win = window;
        var box = null;
        if (this.isFunction(element.getBoundingClientRect)) {
            box = element.getBoundingClientRect();
        } else {
            if (element instanceof HTMLCanvasElement) {
                box = {
                    left: 0,
                    top: 0,
                    width: element.width,
                    height: element.height
                };
            } else {
                box = {
                    left: 0,
                    top: 0,
                    width: parseInt(element.style.width),
                    height: parseInt(element.style.height)
                };
            }
        }
        return {
            left: box.left + win.pageXOffset - docElem.clientLeft,
            top: box.top + win.pageYOffset - docElem.clientTop,
            width: box.width,
            height: box.height
        };
    };
	
	this.captureTouchEvent = function(element, events){
		var cantouch = false;
		var nav = navigator, doc = document, docEle = doc.documentElement;
		var cantouch = docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined  || nav.msPointerEnabled;
		if ( !cantouch ) return;
		
		var this_l = this;
		var touches = [];
		
		var _findSameTouch = function(toucheslist){
			for ( var i=0; i<toucheslist.length; i++ ) {
				var touch = toucheslist[i];
				if ( touch.identifier === touches[0].identifier ) {
					return touch;
				}
			}
			return null;
		};
			
		var _ontouchstart = function(event){
			if (!event.targetTouches) return;
			if (event.targetTouches.length>1) return;
			if (touches.length>0)return;
			
			var touch = event.targetTouches[0];
			if ( events.isCanCapture && !events.isCanCapture({pageX:touch.pageX, pageY:touch.pageY})) {
				return;
			}
			
			touches.push(touch);
			TQ.addEvent(element,"touchmove", _ontouchmove);
			TQ.addEvent(element, "touchend", _ontouchend);
			TQ.addEvent(element, "touchcancel", _ontouchcancel);
			if (events.touchStart) events.touchStart.call(events.self, event, touch, element);
			
			//event.stopPropagation();
			event.preventDefault();
			element.focus();
		};
		var _ontouchmove = function(event){
			if (!event.changedTouches) return;
			if ( touches.length != 1 ) return;
			var same_touch = _findSameTouch(event.changedTouches);
			if (!same_touch) return;
			
			if (events.touchMove) events.touchMove.call(events.self, event, same_touch, element);
			//event.stopPropagation();
			event.preventDefault();			
		};
		var _ontouchend = function(event){
			if (!event.changedTouches) return;
			if ( touches.length != 1 ) return;
			var same_touch = _findSameTouch(event.changedTouches);
			if (!same_touch) return;
			
			if (events.touchEnd) events.touchEnd.call(events.self, event, same_touch, element);
			touches.length = 0;
			TQ.removeEvent(document, 'touchmove', _ontouchmove);
			TQ.removeEvent(document, 'touchend', _ontouchend);
			TQ.removeEvent(document, 'touchcancel', _ontouchcancel);
			
			//event.stopPropagation();
			event.preventDefault();		
		};
		var _ontouchcancel = function(){
			if (!event.changedTouches) return;
			
			if ( touches.length != 1 ) return;
			var same_touch = _findSameTouch(event.changedTouches);
			if (!same_touch) return;
			
			if (events.touchCancel) events.touchCancel.call(events.self, event, same_touch, element);
			touches.length = 0;
			TQ.removeEvent(document, 'touchmove', _ontouchmove);
			TQ.removeEvent(document, 'touchend', _ontouchend);
			TQ.removeEvent(document, 'touchcancel', _ontouchcancel);
			
			//event.stopPropagation();
			event.preventDefault(); 
		};
		TQ.addEvent(element,"touchstart", _ontouchstart);
	};
	
	this.captureMouseEvent = function(dom, events){
		if (document.documentElement['onmouseup'] === undefined) return;
		
		var _onMouseMove = function(e){
			e = e ? e : window.event;
			events.mouseMove.call(events.self, e);
			TQ.preventDefault(e);
			return true;
		};
		
		var _onMouseUp = function(e){// release
			e = e ? e : window.event;
			if ( events.mouseUp ){
				events.mouseUp.call(events.self, e);
			}

			if ( this.releaseCapture ) {
				this.releaseCapture();  
			}
			else if ( window.captureEvents ) {
				window.captureEvents(Event.MOUSEUP);
			}
			
			TQ.removeEvent(document, 'mouseup', _onMouseUp);
			if ( events.mouseMove ){
				TQ.removeEvent(document, 'mousemove', _onMouseMove);
			}
			TQ.preventDefault(e);
			return true;
		};
		
		var _onMouseDown = function(e){
			e = e ? e : window.event;
			
			var tagName = e.srcElement.tagName.toLowerCase();
			if (tagName == 'textarea') {
				return false;
			}
			
			if ( events.mouseDown ){
				events.mouseDown.call(events.self, e);
			}
			
			if ( events.isCanCapture && !events.isCanCapture(e)) {
				return true;
			}
			
			if( this.setCapture ) {
				this.setCapture();
			} else if ( window.captureEvents ) {
				window.captureEvents(Event.MOUSEUP);
			}
	
			if ( events.mouseMove ){
				TQ.addEvent(document, 'mousemove', _onMouseMove);
			}
			TQ.addEvent(document, 'mouseup', _onMouseUp);
			TQ.preventDefault(e);
			return true;
		};
		
		TQ.addEvent(dom, 'mousedown', _onMouseDown);
	};
	
	this.getDomOutWidth = function(dom){
		return _getDomOutWidth(dom);
	};
	
	this.getDomMarginWidth = function(dom){
		return _getDomMarginWidth(dom);
	};
	
	this.saveTextareaPos = function(textBox){
		if ( m_curBrowserType == BS_MSIE ){// 6.0, 7.0, 8.0, 9.0
			m_this.addEvent(textBox,'keydown',function(e){
				_storeCaret(textBox);
			});
			m_this.addEvent(textBox,'keyup',function(e){
				_storeCaret(textBox);
			});
			m_this.addEvent(textBox,'mousedown',function(e){
				_storeCaret(textBox);
			});
			m_this.addEvent(textBox,'mouseup',function(e){
				_storeCaret(textBox);
			});
			m_this.addEvent(textBox,'focus',function(e){
				_storeCaret(textBox);
			});
		}
	};
	
	this.isInRect = function(rect, pos){
		return ( pos.x >= rect.x 
			&& pos.x < (rect.x + rect.w)
			&& pos.y >= rect.y 
			&& pos.y < (rect.y + rect.h) );	
	};
	
	this.isInRhombus = function(rect, pos){
		var ret = false;
		if ( m_this.isInRect(rect, pos) ){
			var halfw = parseInt(rect.w/2);
			var halfh = parseInt(rect.h/2);
			var x = pos.x - rect.x;
			var y = pos.y - rect.y;
			var mx = (x+halfw) % rect.w;
			var my = y % rect.h;
			var dx = (mx <= halfw) ? mx : (rect.w-mx);
			var sh = parseInt(halfh*dx/halfw);
			if ( my >= sh && my <= (rect.h - sh) ){
				ret = true;
			}
		}
		return ret;
	};
	
	this.formatNumber = function(num,len){
		return _formatNumber(num,len);	
	};
	
	this.setFocus = function(inputDom){
		setTimeout(function(){ // fix ie bug
			try{ 
			inputDom.focus();
			}catch(e){};
			}, 0); 	
	};
	
	this.moveCaretEnd = function(inputDom){
		this.setCaretPos(inputDom, inputDom.value.length);
	};
	
	this.setCaretPos = function(inputDom, pos){
		try{ 
			if (inputDom.createTextRange){
				var range = inputDom.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			} else if (inputDom.setSelectionRange) {
				//inputDom.setSelectionRange(pos, pos);
			}
		}catch(e){};	
	};
	
	//--------------
	// private:method
	//--------------
	var _initBrowserType = function(){
		var type = BS_UNKNOWN;
		var agt=navigator.userAgent;
		if ( agt.indexOf("Firefox") != -1 ) {
			type = BS_FIREFOX;
		}
		else if ( agt.indexOf("Opera") != -1 ) {
			type = BS_OPERA;
		}
		else if ( agt.indexOf("MSIE") != -1 ) {
			type = BS_MSIE;
			m_curBrowserVer = parseFloat(agt.match(/MSIE( )(\d+(\.\d+)?)/)[2]);
		}
		else if ( agt.indexOf("Chrome") != -1 ) {
			type = BS_CHROME;
		}
		else if ( agt.indexOf("Safari") != -1 && agt.indexOf("Apple") != -1 ) {
			type = BS_SAFARI;
		}
		else if ( navigator.product == "Gecko" ){
			type = BS_MOZILLA;
		}
		else if ( navigator.vendor=="Netscape" ){
			type = BS_NETSCAPE;
		}
		return type;
	};
	
	/** 获得正body */
	var _getTrueBody = function(){
		if ( m_truebody == null ) {
			var d = document;
			m_truebody = (d.compatMode==="CSS1Compat") ? d.documentElement : d.body;
		}
		return m_truebody;
	};
	
	var _recursiveCopyArray = function(des, src){
		// check first element, find the _k,
		var akey = null;
		var startidx = 0;
		if ( src.length > 0 ){
			akey = src[0]['_k'];
			var replaceflag = src[0]['_r']; // _r:1, 直接替换整个数组
			if ( akey || replaceflag ){
				startidx = 1;
			} else if ( !akey && src[0]['id'] != undefined ){
				akey = 'id';
			}
		} else {
			return;
		}
		
		if ( !akey ){
			des.length = 0;
			for ( var i=startidx; i<src.length; ++i ){
				des.push(src[i]);
			}
			return;
		}
		
		for ( var i=startidx; i<src.length; ++i ){// jump the first element
			var sitem = src[i];
			var ditem = m_this.find(des, akey, sitem[akey]);
			if ( sitem._d && ditem ){
				m_this.removeElement(des, m_this.getLastFindIdx());
			}
			else if ( ditem ){// disc type
				_recursiveCopy(null, null, null, ditem, sitem);
			}
			else if ( !sitem._d ){
				des.push({});
				_recursiveCopy(null, null, null, des[des.length-1], sitem);
			}
		}
	};
	
	var _recursiveCopy = function(parentdes, parenttype, parentkey, des, src){
		for ( k in src ){
			var srcitem = src[k];
			var type = m_this.getTypeof(srcitem);
			if ( type == 'dict' ){
				if ( !des[k] ) {
					des[k] = {};
				}
				_recursiveCopy(des, type, k, des[k], srcitem);
			}
			else if ( type == 'array' ){
				if ( !des[k] ) {
					des[k] = [];
				}
				_recursiveCopyArray(des[k], srcitem);
			}
			else{
				if ( parenttype == 'dict' && k == '_d' ){//_d is _delete
					parentdes[parentkey] = null;
				}
				else{
					des[k] = srcitem;
				}
			}
		}
	};
	
	var _formatTime = function(flag,sec){
		if (sec < 0) {
			sec = 0;
		}
		
		var hours = parseInt(sec/3600);
		var mins = parseInt((sec - hours*3600)/60);
		var secs = parseInt(sec - hours*3600 - mins*60);
		var hourtag = ':';
		var mintag = ':';
		var sectag = '';
		if ( flag == 1 || flag == 2 ){
			hourtag = '小时';
			mintag = '分';
			sectag = '秒';
		}
		var ftime = '';
		if ( flag == 0 || flag == 1 || hours > 0 ){
			ftime += _formatNumber(hours,2) + hourtag;
		}
		ftime += _formatNumber(mins,2) + mintag;
		ftime += _formatNumber(secs,2) + sectag;
		return ftime;
	};
	
	var _formatNumber = function(num,len){
		var totaln = 1;
		var leftn = parseInt(num / 10);
		while(leftn>0){
			++totaln;
			if ( totaln >= len ){
				return num;
			}
			leftn = parseInt(leftn / 10);
		}
		var ftime = '';
		for ( var i=totaln; i<len; ++i ){
			ftime += '0';
		}
		ftime += num;
		return ftime;
	};
	
	var _getDomOutWidth = function(dom){
		return (TQ.getDomWidth(dom) + _getDomMarginWidth(dom));
	};
	
	var _getDomMarginWidth = function(dom){
		var marginw = parseInt(TQ.curCSS(dom, 'marginLeft'), 10) + 
			parseInt(TQ.curCSS(dom, 'marginRight'), 10);
		if ( isNaN && isNaN(marginw) ){
			marginw = 0;
		}
		return marginw;
	};
	
	var _storeCaret = function(textEl) {
		if (textEl.createTextRange) {
			try{
				var cuRange=document.selection.createRange();
				textEl.caretPos = cuRange.duplicate(); 
				
				var tbRange=textEl.createTextRange();
				tbRange.collapse(true);
				tbRange.select();
				var headRange=document.selection.createRange();
				headRange.setEndPoint("EndToEnd",cuRange);
				textEl.caretPosVal = headRange.text.length;
				cuRange.select();
			}catch(e){}
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

IMG = new function(){
	//------------
	//public:const
	//------------
	
	//------------
	//public:private
	//------------
	var m_g;
	var m_mode = 'office';

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(){
	};
	
	this.setGameObj = function(g){
		m_g = g;
	};
	
	this.getMode = function(){
		return m_mode;
	};
	
	/** 设置背景图片 */
	this.setBKImage = function(dom,src,pos){
		if ( TQ.isIE6() && src.indexOf('.png') > 0 ) {
			var attr = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"')";
			TQ.setCSS(dom, 'filter', attr);
			dom.style.backgroundImage = 'none';
		}
		else{
			dom.style.backgroundImage = "url('"+src+"')";
			TQ.fixIE6Png(dom);
		}
		
		if ( pos ) {
			dom.style.backgroundPosition = pos;
		}
	};
	
	this.getBKImage = function(dom){
		return dom.style.backgroundImage;
	};
	
	/** 通过id组合一个大图片路径 */
	this.makeBigImg = function(id,flag){
		flag = flag ? '_'+flag : '';
		return _addVer(m_mode+'/item/big/'+id+flag+'.gif');
	};
	
	/** 通过id组合一个中图片路径 */
	this.makeMidImg = function(id,flag){
		flag = flag ? '_'+flag : '';
		return _addVer(m_mode+'/item/mid/'+id+flag+'.gif');
	};
	
	/** 通过id组合一个小图片路径 */
	this.makeSmallImg = function(id, flag){
		flag = flag ? '_'+flag : '';
		return _addVer(m_mode+'/item/small/'+id+flag+'.gif');
	};
	
	this.makeInBuildImg = function(id, hot, state){
		var s = (state == 0) ? '_n' : '_n';
		var h = hot ? '_h' : '';
		var ext = '.png';
		if ( id == FIXID.WALLBUILD || id == FIXID.GOV_BUILD) ext = '.gif'; 
		return _addVer(m_mode+'/build/block/'+id+s+h+ext);
	};
	
	this.makeFarmBuildImg = function(id, hot, state){
		var s = '_'+state;
		var h = hot ? '_h' : '';
		return _addVer(m_mode+'/farm/block/'+id+s+h+'.gif');
	};
	
	this.makeAlliBuildImg = function(id, hot){
		var h = hot ? '_h' : '_n';
		return _addVer(m_mode+'/alli/build/'+id+h+'.gif');
	};
	
	this.makeImg = function(imgpic){
		return _addVer(m_mode+'/'+imgpic);
	};
	
	// id小于10000 时为jpg，大于等于10000时为gif
	this.makeHelpImg = function(id){
		var ext = '.gif';
		if ( id < 10000 ) ext = '.jpg';
		return _addVer(m_mode+'/helpimg/'+id +ext);
	};
	
	this.makeGroupPosImg = function(pos){
		var szimgsrc = '';
		if ( pos  > 0 ){
			szimgsrc = _addVer(m_mode+'/chat/group/pos/'+pos+'.gif');
		}
		return szimgsrc;
	};
	
	this.makeStepoutImg = function(state){
		var szimgsrc = '';
		if ( state == 0 ){
			szimgsrc = _addVer(m_mode+'/ui/back/team/stepoutflag.gif');
		}
		return szimgsrc;
	};
	
	this.makeFaceImg = function(classidx, type, faceid){
		var szpath = m_mode+'/chat/face/'+TQ.formatNumber(classidx,2)+'/';
		var szimgsrc = szpath + TQ.formatNumber(faceid,2);
		if ( type == 0 ){
			szimgsrc += '_x';
		}
		szimgsrc += '.gif';
		return _addVer(szimgsrc);
	};
	
	this.makeStateCityFlag = function(cityimg){
		return _addVer(m_mode+'/statecity/flag/new/'+cityimg);
	};
	
	this.makeSmallStateCityFlag = function(cityimg){
		return _addVer(m_mode+'/statecity/sflag/new/'+cityimg);
	};
	
	this.makeYellowDiamondImg = function(flag, level){
		return this._makeQQCommDiamondImg('yd', flag, level);
	};
	
	this.makeYellowDiamondYearImg = function(flag){
		return this._makeQQCommDiamondYearImg('yd', flag);
	};
	
	this.makeBlueDiamondImg = function(flag, level){
		return this._makeQQCommDiamondImg('bd', flag, level);
	};
	
	this.makeBlueDiamondYearImg = function(flag){
		return this._makeQQCommDiamondYearImg('bd', flag);
	};	
	
	this._makeQQCommDiamondImg = function(diamondName, flag, level){
		var ext = '.gif';
		if ( flag == 'ui' ) ext = '.png';
		return _addVer(m_mode+'/qq/' + diamondName + '/flag/' + flag + '/' + level + ext);	
	};
	
	this._makeQQCommDiamondYearImg = function(diamondName, flag){
		var ext = '.gif';
		if ( flag == 'ui' ) ext = '.png';
		return _addVer(m_mode+'/qq/' + diamondName + '/flag/year' + ext);
	};
	
	this.getItemTalk = function(){
		return _addVer(m_mode+'/chat/itemtalk.gif');
	};
	
	this.getBuildedFlag = function(){
		return _addVer(m_mode+'/build/buildedflag.gif');
	};
	
	this.getFullBuildedFlag = function(){
		return _addVer(m_mode+'/build/fullbulidedflag.gif');
	};
	
	this.getBuyLimitFlag = function(){
		return _addVer(m_mode+'/shopdlg/limit.png');
	};

	this.getCursorImg = function(cur, hot_x, hot_y){
		if ( hot_x || hot_y ) {
			return 'url('+_addVer(m_mode+'/'+cur)+') ' + hot_x + ' ' + hot_y + ', auto';
		} else {
			return 'url('+_addVer(m_mode+'/'+cur)+'),auto';
		}
	};
	
	this.getChatTag = function(flag){
		var flagmaps = {};
		flagmaps[CHAT_TAG.SYS] = 'sys';
		flagmaps[CHAT_TAG.WORLD] = 'world';
		flagmaps[CHAT_TAG.ALLIANCE] = 'alliance';
		flagmaps[CHAT_TAG.STATE] = 'state';
		flagmaps[CHAT_TAG.PRIVATE] = 'private';
		flagmaps[CHAT_TAG.PROMPT] = 'prompt';
			
		for ( var cityid=9900001; cityid<=9900004; ++cityid) {
			flagmaps[cityid] = 'newcitys/' + cityid;
		}
		
		var name = flagmaps[flag];
		if ( !name ) name = flag;
		var src = '/chat/flagtag/'+name+'.gif';
		if ( TQ.isMobile() ) {
			src = '/mb' + src;
		}
		return _addVer(m_mode+src);
	};
	
	this.makeChatTagDiv = function(tag){
		var cls = 'ui_chat_imgtag';
		if ( TQ.isMobile() ) {
			cls = 'mb_ui_chat_imgtag';
		}
		return this.makeCommChatTagDiv(cls, '<div class=inner_img style="BACKGROUND:url(\'' + IMG.getChatTag(tag) + '\') 0px 0px no-repeat;"></div>');
	};
	
	this.makeVipChatTagDiv = function(vipLevel){
		var img = this.makeImg('vip/small/' + vipLevel + '.gif');
		return this.makeCommChatTagDiv('ui_chat_viptag', '<div class=inner_img style="BACKGROUND:url(\'' + img + '\') 0px 4px no-repeat;"></div>');
	};
	
	this.makeBlueGrowChatTagDiv = function(growLevel){
		var img = this.makeBlueGrowImg(growLevel);
		return this.makeCommChatTagDiv('ui_chat_growtag', '<div class=inner_img style="BACKGROUND:url(\'' + img + '\') 0px 3px no-repeat;"></div>');
	};
	
	this.makeBlueGrowImg = function(growLevel){
		return this.makeImg('qq/bd/grow/chat/1.gif');
	};
	
	this.makeCommChatTagDiv = function(baseClassName, s ) {
		var cssclass = baseClassName;
		if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) {
			cssclass = cssclass + '_fixie';
		}
		return '<div class=' + cssclass + '>' + s + '</div>';
	};
	
	this.getAvatarImg = function(imgId){
		return _addVer(m_mode+'/avatar/'+ imgId +'.gif');
	};
	
	this.getCityNameImgByLevel = function(level){
		var levelName = TQ.formatNumber(level, 2);
		return _addVer(m_mode+'/briefresbar/levels/' + levelName + '.gif');
	};
	
	
	this.getCityBigLevelIcon = function(bigLevel){
		return _addVer(m_mode+'/achievement/bigcitylevels/' + bigLevel + '.gif');
	};
	
	this.getActTowerIcon = function(isEnable){
		var flag = isEnable ? '' : '_d';
		return _addVer(m_mode+'/achievement/acttower' + flag + '.gif');
	};
	
	this.getActTerraceIcon = function(isEnable){
		var flag = isEnable ? '' : '_d';
		return _addVer(m_mode+'/achievement/actterrace' + flag + '.gif');
	};
	
	this.getVipIcon = function(isEnable){
		var flag = isEnable ? '' : '_d';
		return _addVer(m_mode+'/achievement/vip' + flag + '.gif');
	};
	
	this.getImgNumber = function(flag, num){
		var sizes = {com:{cx:8, cy:9}};
		var size = sizes[flag];
		var s = '';
		var snum = num.toString();
		for ( var i=snum.length-1; i>=0; --i ) {
			var style = 'FLOAT:right;';
			style += 'WIDTH:' + size.cx + 'px;';
			style += 'HEIGHT:' + size.cy + 'px;';
			style += 'BACKGROUND:url(' + _addVer(m_mode+'/imgnum/' + flag + '/' + snum.substr(i, 1) + '.gif') + ') no-repeat;';
			s += '<div style="' + style + '"></div>';
		}
		return s;
	};
	
	this.getSound = function(src){
		return _addVer(m_mode+'/sound/' + src);
	};
	
	var _addVer = function(img){
		if ( img.indexOf('v=') > 0 ) return;
		
		var ver = '0';
		var h = _hashString(img);
		if ( !res_images[h] ) {
		} else if ( res_images[h][img] ) {
			ver = res_images[h][img];
		} else {
			ver = res_images[h]['v'];
		}
		
		return image_base_url + img + '?v=' + ver;
	};
	
	var _hashString = function(s){
		var h = 0;
		for ( var i=0; i<s.length; ++i ) {
			h = (31 * h + s.charCodeAt(i)) % 0xffffffff;
		}
		return h;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};
/*
g_can_select_elems = [];
TQ.getDomById('g_body').onselectstart = function(e){
	var e = e ? e : window.event;
	var cur = e.srcElement;
	while ( cur ) {
		for ( var i=0; i<g_can_select_elems.length; ++i ) {
			if (cur === g_can_select_elems[i]) {
				return true;
			}
		}
		cur = cur.parentNode;
	}
	return false;
};
*/

// 道具资源的一些常用处理工具
ItemResUtil = Class.extern(function(){
	this.initItemsres = function(items, key){
		key = key ? key : 'resid';
		for ( var i=0; i<items.length; ++i ){
			var item = items[i];
			this.initItemres(item, key);
		}
	};
	
	this.initItemres = function(item, key){
		if ( item.itemres && item.itemres.id == item[key] ) return;
		item.itemres = this.findItemres(item[key]);
	};
	
	this.findItemres = function(resid){
		if ( !resid ) return null;
		
		var res = TQ.qfind(res_test_items, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_ex, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_base, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_builds, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_farms, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_heroskills, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_fields, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_soldiers, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_items_cultures, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_lineup, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_drops, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_copyfields, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_fieldheros, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_citydef, 'id', resid);
		if ( res ) return res;
		res = TQ.qfind(res_npcs, 'id', resid);
		if ( res ) return res;
		log('* not find resid: ' + resid);
		//if ( resid == undefined ) assert(false, 'find undefined key in itemres')
		return null;
	};
	
	this.findBuildLevelres = function(resid, level){
		var res = TQ.qfind(res_inbuild, 'id', resid*1000 + level);
		if ( res ) return res;
		res = TQ.qfind(res_cultures_upd, 'id', resid*1000 + level);
		if ( res ) return res;
		return null;
	};
	
	this.findEffectres = function(resid, effectid) {
		var itemres = this.findItemres(resid);
		if (itemres == null) return null;
		return TQ.qfind(itemres.effects, 'id', effectid);
	};
	
	this.findEffectItems = function(effectid) {
		var res = TQ.qfind(res_efftiems_ex, 'id', effectid);
		if ( res ) return res;
		res = TQ.qfind(res_efftiems, 'id', effectid);
		if ( res ) return res;
		return null;
	};
	
	this.findCultureLevelres = function(resid, level){
		return TQ.qfind(res_cultures_upd, 'id', this.makeLevelResid(resid, level));
	};
	
	this.findFieldLevelres = function(resid, level){
		return TQ.qfind(res_fields_level, 'id', this.makeLevelResid(resid, level));
	};
	
	this.findTaskRes = function(id){
		var res = TQ.qfind(res_tasks, 'id', id);
		if ( res ) return res;
		res = TQ.qfind(res_activityval_tasks, 'id', id);
		if ( res ) return res;
		res = TQ.qfind(res_newhelp_tasks, 'id', id);
		if ( res ) return res;
		return null;
	};
	
	this.findHelpRes = function(id){
		var res = TQ.qfind(res_newhelp_tasks, 'id', id);
		if ( res ) return res;
		res = TQ.qfind(res_all_helps, 'id', id);
		if ( res ) return res;
		return null;
	};
	
	this.splitResidLevel = function(id){
		return {resid: parseInt(id/1000,10), level:id%1000};
	};
	
	this.makeLevelResid = function(baseId, level) {
		return baseId*1000 + level;
	};
	
}).snew();
