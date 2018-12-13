/** 
	version: 0.1
	writer: bill825
	date: 2014.12.10
*/

var Browser = JClass.ex({
	_init : function(){
		this._type = 'unknown';
		this._curVer = 0;
		var agt=navigator.userAgent;
		if ( agt.indexOf("Firefox") != -1 ) {
			this._type = 'firefox';
		} else if ( agt.indexOf("Opera") != -1 ) {
			this._type = 'opera';
		} else if ( agt.indexOf("MSIE") != -1 ) {
			this._type = 'msie';
			this._curVer = parseFloat(agt.match(/MSIE( )(\d+(\.\d+)?)/)[2]);
		} else if ( agt.indexOf("Chrome") != -1 ) {
			this._type = 'chrome';
		} else if ( agt.indexOf("Safari") != -1 && agt.indexOf("Apple") != -1 ) {
			this._type = 'safari';
		} else if ( navigator.product == "Gecko" ){
			this._type = 'gecko';
		} else if ( navigator.vendor=="Netscape" ){
			this._type = 'netscape';
		}
	}
	
	,isIE : function(){
		return this._type == 'msie';
	}
	
	,isIE6 : function(){
		return this.isIE() && (this._curVer < 7.0);
	}
	
	,isIE7 : function(){
		return this.isIE() && (this._curVer >= 7.0 && this._curVer < 8.0 );
	}
	
	,isIE8 : function(){
		return this.isIE() && (this._curVer >= 8.0 && this._curVer < 9.0 );
	}
	
	,isIE9 : function(){
		return this.isIE() && (this._curVer >= 9.0 && this._curVer < 10.0 );
	}
	
	,isIE10 : function(){
		return this.isIE() && (this._curVer >= 10.0 && this._curVer < 11.0 );
	}
	
	,isIE11 : function(){
		return this.isIE() && (this._curVer >= 11.0 && this._curVer < 12.0 );
	}
	
	,isLessVerIE : function(maxVer){
		return this.isIE() && (this._curVer < maxVer);
	}
	
	,isFirefox : function(){
		return this._type == 'firefox';
	}
});

var Elem = JClass.ex({
});

var Finder = JClass.ex({
	_init : function(){
		this._lastIdx = -1;
	}
	
	,find : function(arrays, keyname, keyval, spec) {
		this._lastIdx = -1;
		for ( var i=0; i<arrays.length; ++i ) {
			if (spec) {
				if (spec.isSatisfiedBy(arrays[i])) {
					this._lastIdx = i;
					return arrays[i];
				}
			} else {
				var cvalue = (keyname==null) ? arrays[i] : arrays[i][keyname];
				if ( cvalue == keyval ) {
					this._lastIdx = i;
					return arrays[i];
				}
			}
		}
		return null;
	}
	
	/** 排序二分法查找 */
	,qfind : function(arrays, keyname, keyval){
		this._lastIdx = -1;
		var first = 0;
		var last = arrays.length;
		var mid = 0;
		var midValue;
		while(first<last){
			mid=(first+last)>>1;
			midValue=(keyname==null) ? arrays[mid] : arrays[mid][keyname];
			if (keyval==midValue){
				this._lastIdx = mid;
				return arrays[mid];
			} else if (keyval<midValue){
				last=mid;
			} else {
				first=mid+1;
			}
		}
		return null;
	}
	
	,getLastIdx : function(){
		return this._lastIdx;
	}
});

var DictCopy = JClass.ex({
	copy : function(des, src) {
		var type = JUtil.getTypeof(src);
		if ( type == 'dict' ){
			this._recursiveCopy(null,null,null,des,src);
		}
		else if ( type == 'array' ){
			this._recursiveCopyArray(des,src);
		}
		else {
			alert(type);
			alert('disc copy type error');
		}
	}
	
	,_recursiveCopyArray : function(des, src){
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
				this._recursiveCopy(null, null, null, ditem, sitem);
			}
			else if ( !sitem._d ){
				des.push({});
				this._recursiveCopy(null, null, null, des[des.length-1], sitem);
			}
		}
	}
	
	,_recursiveCopy : function(parentdes, parenttype, parentkey, des, src){
		for ( k in src ){
			var srcitem = src[k];
			var type = JUtil.getTypeof(srcitem);
			if ( type == 'dict' ){
				if ( !des[k] ) {
					des[k] = {};
				}
				this._recursiveCopy(des, type, k, des[k], srcitem);
			}
			else if ( type == 'array' ){
				if ( !des[k] ) {
					des[k] = [];
				}
				this._recursiveCopyArray(des[k], srcitem);
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
	}
});

JUtil = JClass.ex({
	Browser : Browser.snew()
	,Elem : Elem.snew()
	,Finder : Finder.snew()
	//,DictCopy : DictCopy.snew()
	
	,_init : function(){
		this._body = null;
		this._root = null;
	}
	
	,setRoot : function(root){
		this._root = root;
	}
	
	,getElemById : function(id){
		return document.getElementById(id);
	}
	
	,createElem : function(){
		return document.createElement('div');
	}
	
	,createInputElem : function(){
		var button = document.createElement("input");
		button.setAttribute("type","text");
		return button;
	}
	
	,createCheckElem : function(name, id, text){
		var div = document.createElement("div");
		var checkButton = document.createElement("input");
		checkButton.setAttribute("type","checkbox");
		checkButton.setAttribute("name", name);
		checkButton.setAttribute("id", id);
		var label = document.createElement('span');
		label.innerHTML = '<label for="' + id + '">' + text + '</label>';
		JUtil.appendElem(div, checkButton);
		JUtil.appendElem(div, label);
		return {container:div, check:checkButton};
	}
	
	,createMInputElem : function(){
		return document.createElement("textarea");
	}
	
	,createButtonElem : function(){
		var button = document.createElement("input");
		button.setAttribute("type","button");
		return button;
	}
	
	,createImageButtonElem : function(){
		var button = document.createElement("div");
		return button;
	}
	
	,setImageButtonSrc : function(elem, src){
		elem.setAttribute("src", src);
	}
	
	,createRadioElem : function(name, id, option, optionText){
		var radio = document.createElement("input");
		radio.setAttribute("type", "radio");
		radio.setAttribute("name", name);
		radio.setAttribute("id", id);
		radio.setAttribute("value", option);
		
		var label = document.createElement('span');
		label.innerHTML = '<label for="' + id + '">' + optionText + '</label>';
		
		return {radio:radio, label:label};
	}
	
	,getRadioValue : function(elem){
		return elem.value;
	}
	
	,setRadioCheckFlag : function(elem, checkFlag){
		elem.checked = checkFlag;
	}
	
	,getRadioCheckFlag : function(elem){
		return elem.checked;
	}
	
	,setElemFocus : function(elem){
		elem.focus();
	}
	
	,selectInputElemText : function(elem){
		elem.select();
	}
	
	,appendElem : function(parent, curElem){
		parent.appendChild(curElem);
	}
	
	,insertElemBefore : function(parent, newchild,refchild){
		parent.insertBefore(newchild,refchild);
	}
	
	,removeElem : function(parent, curElem){
		parent.removeChild(curElem);
	}
	
	,setElemRect : function(elem, rect){
		if ( !rect ) return;
		this.setElemPos(elem, {x:rect.left, y:rect.top});
		this.setElemSize(elem, {cx:rect.width, cy:rect.height});
	}
	
	,setElemSize : function(elem, size){
		if ( !size ) return;
		this.setElemWidth(elem, size.cx);
		this.setElemHeight(elem, size.cy);
	}	
	
	,setElemPos : function(elem, pos){
		if ( !pos ) return;
		this.setElemLeft(elem, pos.x);
		this.setElemTop(elem, pos.y);
	}
	
	,setElemLeft : function(elem, left){
		this.setCSS(elem, 'left', left+'px');
	}
	
	,setElemTop : function(elem, top){
		this.setCSS(elem, 'top', top+'px');
	}
	
	,setElemWidth : function(elem, width){
		if (width == 'auto'){
			this.setCSS(elem, 'width', 'auto');
		} else {
			this.setCSS(elem, 'width',width + 'px');
		}
	}
	
	,setElemHeight : function(elem, height){
		if (height == 'auto'){
			this.setCSS(elem, 'height', 'auto');
		} else {
			this.setCSS(elem, 'height', height + 'px');
		}
	}
	
	,setElemMaxWidth : function(elem, w){
		this.setCSS(elem, 'maxWidth', w + 'px' );
	}
	
	,setVerticalMiddle : function(elem){
		this.setCSS(elem, 'lineHeight', this.getElemRect(elem).height + 'px' );
	}	
	
	,setCSS : function(elem, name, val){
		if ( name == 'float' ){
			elem.style.styleFloat = val;
			elem.style.cssFloat = val;
		} else if ( name.toLowerCase() == 'display') {
			if ( JUtil.Browser.isIE() && val.toLowerCase() == 'none' ) { 
				// fix ie bug @see http://www.justarrangingbits.org/iehidingcontentbug/index.html
				this._setCommCSS(elem, name, 'block');
			}
			this._setCommCSS(elem, name, val);
		} else if ( name == 'opacity' ) {
			if ( elem.filters ){
				if ( JUtil.Browser.isLessVerIE(9.0) ) {
					elem.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + val + ');';
				} else {
					elem.style.filter = 'Alpha(opacity='+val+')';
				}
			} else {
				elem.style.opacity = val/100;
				elem.style['-moz-opacity'] = val/100;
			}
		} else if ( name == 'select' ) {
			elem.style['-moz-user-select'] = val;
			elem.style['-webkit-user-select'] = val;
			elem.style['-ms-user-select'] = val;
			elem.style['-khtml-user-select'] = val;
			elem.style[' user-select'] = val;
			this._fixIESelectCSS(elem, val);
		} else if ( name == 'max-width' ) {
			elem.style.maxWidth = val;
		} else{
			this._setCommCSS(elem, name, val);
		}
	}
	
	,getCSS : function( elem, name ) {
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
	}
	
	,setElemOpacity : function(elem, opacity){
		this.setCSS(elem, 'opacity', opacity);
	}
	
	,getText : function(elem){
	}
	
	,setText : function(elem, text){
		elem.textContent = text;
		elem.innerText = text;
	}
	
	,setElemTip : function(elem, tip){
		elem.title = tip;
	}
	
	,setRichText : function(elem, text){
		elem.innerHTML = text;
	}
	
	,setButtonText : function(elem, text){
		elem.value = text;
	}
	
	,setInputText : function(elem, text){
		elem.value = text;
	}

	,getInputText : function(elem){
		return elem.value;
	}
	
	,showElem : function(elem){
		this.setCSS(elem, 'display', 'block');
	}
	
	,hideElem : function(elem){
		this.setCSS(elem, 'display', 'none');
	}
	
	,getElemParent : function(elem){
		if ( !elem ) return null;
		return elem.parentNode;
	}
	
	,getElemHeight : function(elem){
		return elem.offsetHeight;
	}
	
	,setElemRelativePosition : function(elem){
		this.setCSS(elem, 'position', 'relative');
	}
	
	,setTimer : function(ms, caller){
		window.setTimeout(function(){ caller.invoke(); }, ms);
	}
	
	,captureMouseEvent : function(elem, events){
		var _onMouseMove = function(e){
			e = e ? e : window.event;
			events.mouseMove.invoke(e, elem);
			JUtil.preventDefault(e);
			return true;
		};
		
		var _onMouseUp = function(e){// release
			e = e ? e : window.event;
			if ( events.mouseUp ){
				events.mouseUp.invoke(e, elem);
			}

			if ( this.releaseCapture ) {
				this.releaseCapture();  
			}
			else if ( window.captureEvents ) {
				window.captureEvents(Event.MOUSEUP);
			}
			
			JUtil.removeEvent(document, 'mouseup', _onMouseUp);
			if ( events.mouseMove ){
				JUtil.removeEvent(document, 'mousemove', _onMouseMove);
			}
			JUtil.preventDefault(e);
			return true;
		};
		
		var _onMouseDown = function(e){
			e = e ? e : window.event;
			
			var tagName = e.srcElement.tagName.toLowerCase();
			if (tagName == 'input' || tagName == 'textarea') {
				return true;
			}
			
			if ( events.mouseDown ){
				events.mouseDown.invoke(e, elem);
			}			
			
			if ( events.isCanCapture && !events.isCanCapture.invoke(e, elem)) {
				return true;
			}
			
			if( this.setCapture ) {
				this.setCapture();
			} else if( window.captureEvents ) {
				window.captureEvents(Event.MOUSEUP);
			}
	
			if ( events.mouseMove ){
				JUtil.addEvent(document, 'mousemove', _onMouseMove);
			}
			JUtil.addEvent(document, 'mouseup', _onMouseUp);
			if (!events.defaultHandle) JUtil.preventDefault(e);
			return true;
		};
		
		JUtil.addEvent(elem, 'mousedown', _onMouseDown);
	}	
	
	,addEvent : function (o, t, f) {
		if (o.addEventListener) {
			if ( JUtil.Browser.isFirefox() ){
				if ( t == 'mousewheel' ) t = 'DOMMouseScroll';
			}
			o.addEventListener(t, f, false);
		}
		else if (o.attachEvent) o.attachEvent('on'+ t, f);
		else o['on'+ t] = f;
	}
	
	,removeEvent : function (o, t, f) {
		if (o.removeEventListener) o.removeEventListener(t, f, false);
		else if (o.detachEvent) o.detachEvent('on'+ t, f);
		else o['on'+ t] = null;
	}
	
	,stopPropagation : function(e){
		e = e ? e: window.event;
		e.cancelBubble = true;
		if ( e.stopPropagation ){
			e.stopPropagation();
		}
	}
	
	,preventDefault : function(e){
		e = e ? e: window.event;
		if ( e.preventDefault ) {  
			e.preventDefault();  
		}
		else {  
			e.returnValue = false;  
			e.cancelBubble=true;
		}
	}
	
	,mouseCoords : function(e){
		e = e ? e : window.event;
		if( !JUtil.isNull(e.pageX) || !JUtil.isNull(e.pageY) ){
			return {x:e.pageX, y:e.pageY};
		}
		
		var srollPos = JUtil.getScrollPos();
		var truebody = this._getBody();
		return {
			x:e.clientX + srollPos.x - truebody.clientLeft,
			y:e.clientY + srollPos.y - truebody.clientTop
		};
	}
	
	,elemOffset : function(elem){
		var left = 0;
		var top = 0;
		var curelem = elem;
		while(curelem && curelem.offsetLeft != undefined){
			left += curelem.offsetLeft;
			top += curelem.offsetTop;
			curelem = curelem.offsetParent;
		}
		return {left:left,top:top};
	}
	
	,elemABOffset : function(elem){
		var left = 0;
		var top = 0;
		var curelem = elem;
		while(curelem && curelem != this._root && curelem.offsetLeft != undefined && curelem.offsetTop != undefined){
			left += curelem.offsetLeft;
			top += curelem.offsetTop;
			if (  curelem.scrollLeft != undefined ) {
				left -= curelem.scrollLeft;
			}
			if (  curelem.scrollTop != undefined ) {
				top -= curelem.scrollTop;
			}
			curelem = curelem.offsetParent;
		}
		var srollPos = JUtil.getScrollPos();
		return {left:left+srollPos.x ,top:top+srollPos.y};
	}
	
	,mouseRelativeCoords : function(elem,ev){
		var off = this.elemOffset(elem);
		var mPos = this.mouseCoords(ev);
		return {x:mPos.x-off.left, y:mPos.y-off.top};
	}
	
	,getElemScrollTop : function(elem){
		return elem.scrollTop;
	}
	
	,setElemScrollTop : function(elem, top){
		 elem.scrollTop = top; 
	}
	
	,getScrollPos : function(){
		var sLeft = document.body.scrollLeft ? document.body.scrollLeft : 0 ; 
		var sTop = document.body.scrollTop ? document.body.scrollTop : 0; 
		if (document.compatMode==="CSS1Compat") {
			sLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : sLeft;
			sTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : sTop;
		}
		return {x:sLeft, y:sTop};
	}
	
	,isNull : function(val){
		if ( val != undefined && val != null) {
			return false;
		}
		return true;
	}
	
	,setClass : function(elem, className){
		if ( this.isNull(className) ) return;
		
		elem.className = className;
	}
	
	,getClass : function(elem){
		return elem.className;
	}
	
	,setZOrder : function(elem, zorder){
		this.setCSS(elem, 'zIndex', zorder);
	}
	
	,getElemPos : function(elem){
		return {
			x : parseInt(JUtil.getCSS(elem, 'left'))
			,y : parseInt(JUtil.getCSS(elem, 'top'))
		};
	}
	
	,getElemRect: function(elem){
		return {
			left : parseInt(JUtil.getCSS(elem, 'left'))
			,top : parseInt(JUtil.getCSS(elem, 'top'))
			,width : elem.offsetWidth 
			,height : elem.offsetHeight
		};
	}
	
	,getTypeof : function(a){
		var t = typeof(a);
		if ( t == 'object' ){
			if ( a instanceof Array ){
				t = 'array';
			} else {
				t = 'dict';
			}
		}
		return t;
	}
	
	,getKeyCode : function(e){
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
	}
	
	,_setCommCSS : function(elem, name, val){
		try{
			elem.style[name] = val;
		} catch(err) {
			alert('*error: setCSS['+name+']:'+val);
		}
	}
	
	,_fixIESelectCSS : function(elem, val) {
		if ( !JUtil.Browser.isLessVerIE(11.0) ) return;
		if ( val == 'none' ) {
			elem.onselectstart = function(e){
				var e = e ? e : window.event;
				var tagName = e.srcElement.tagName.toLowerCase();
				return (tagName == 'input' || tagName == 'textarea');
			};
		} else {
			elem.onselectstart = function(e){
				this.stopPropagation(e); 
				return true;
			};
		}
	}
	
	,_getBody : function(){
		if ( this._body == null ) {
			var d = document;
			this._body = (d.compatMode==="CSS1Compat") ? d.documentElement : d.body;
		}
		return this._body;
	}
}).snew();
