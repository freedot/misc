SCROLL_LINEH=15,SCROLL_TRACE_W=15,SCROLL_TRACE_MINH=24,SCROLL_TRACE_MAXH=2e4,SliderBtn=Class.extern(function(){var a=null,b=null;this.init=function(d,e,f,g){this.g=d,this.uiback=f,this.caller=g,a=this,b=this.g.getGUI(),this.dom=TQ.createDom("div"),TQ.append(e,this.dom),this.backdom=b.createPanelUIBack(this.dom,this.uiback,!1,0),TQ.setCSS(this.dom,"position","absolute"),this.decorateDom=TQ.createDom("div"),TQ.setCSS(this.decorateDom,"zIndex","10"),TQ.append(this.dom,this.decorateDom),TQ.setClass(this.decorateDom,this.uiback.decorateCls),c()},this.setSize=function(a,b){TQ.setDomSize(this.dom,a,b),TQ.setDomSize(this.decorateDom,a,b),d(a,b)},this.setPosition=function(a,b){TQ.setDomPos(this.dom,a,b)},this.setTop=function(a){this.dom.style.top=a+"px"},this.getTop=function(){return parseInt(this.dom.style.top)},this.getBtnH=function(){return TQ.getDomHeight(this.dom)},this.setBtnH=function(a){this.setSize(TQ.getDomWidth(this.dom),a)},this.domOffset=function(){return TQ.domOffset(this.dom)};var c=function(){TQ.addEvent(a.dom,"dragstart",function(a){return!1}),TQ.addEvent(a.dom,"selectstart",function(a){return!1}),TQ.captureMouseEvent(a.dom,{self:a,mouseDown:e,mouseMove:f,mouseUp:g}),TQ.captureTouchEvent(a.dom,{self:a,touchStart:h,touchMove:i,touchEnd:j,touchCancel:j})},d=function(c,d){a.uiback.type>=0&&b.setUIBack(a.backdom,c,d,a.uiback.type)},e=function(b){if(TQ.getBtnType(b)!=BTN_LEFT)return;TQ.stopPropagation(b),a.caller.startDrag(b)},f=function(b){if(TQ.getBtnType(b)!=BTN_LEFT)return;TQ.stopPropagation(b),a.caller.updateScroll(b)},g=function(b){if(TQ.getBtnType(b)!=BTN_LEFT)return;TQ.stopPropagation(b),a.caller.stopDrag(b)},h=function(b,c,d){a.caller.startDrag(TQ.makeMouseEvent(c.pageX,c.pageY,BTN_LEFT,d))},i=function(b,c,d){a.caller.updateScroll(TQ.makeMouseEvent(c.pageX,c.pageY,BTN_LEFT,d))},j=function(b,c,d){a.caller.stopDrag(TQ.makeMouseEvent(c.pageX,c.pageY,BTN_LEFT,d))}}),SliderBar=function(){var a=1,b=2,c,d,e,f,g,h,i={x:0,y:0},j={x:0,y:0},k=0,l={cx:10,cy:10},m=1,n=1,o=10,p=40,q,r=SCROLL_LINEH,s=0,t=0;this.initialize=function(a,b){c=a,d=this,e=b,u()},this.setSize=function(a,b){l.cx=a,l.cy=b,C(),z()},this.getDom=function(){return g.getDom()},this.prevLine=function(){B(-o)},this.nextLine=function(){B(o)},this.setRange=function(a,b){b=b>=a?b:a,m=b,s=a,C()},this.setCaller=function(a){q=a},this.scrollBy=function(a){var a=a/n;B(a)},this.setLineHeight=function(a){r=a,C()},this.scrollPos=function(a){j.y=0;var b=parseInt(a/n+.5);B(b)},this.getScrollPos=function(){return t};var u=function(){g=new ComButton(c,e,{uiback:uiback.btn.scrollbar}),g.setId(a),g.setCaller({self:d,caller:v}),g.setType(BTN_TYPE.TIMER),f=SliderBtn.snew(c,g.getDom(),uiback.scrollslider,{startDrag:w,updateScroll:y,stopDrag:x}),f.setPosition(0,0),k=f.getBtnH(),z()},v=function(a,b){var c=TQ.mouseCoords(b),d=f.domOffset();if(c.y<d.top){var e=d.top-c.y,g=p<e?p:e;B(-g)}else if(c.y>d.top+k){var e=c.y-(d.top+k),g=p<e?p:e;B(g)}},w=function(a){return i=TQ.mouseCoords(a),!1},x=function(a){j.y=f.getTop()},y=function(a){var b=TQ.mouseCoords(a),c=b.y-i.y,d=j.y;B(c),j.y=d},z=function(){var a=g.getDom();TQ.setDomSize(a,l.cx,l.cy),f.setSize(l.cx,l.cx),k=f.getBtnH()},A=function(){return j.y+k>=l.cy-o/2},B=function(a){var b=j.y+a;b<0&&(b=0),b+k>l.cy&&(b=l.cy-k),f.setTop(b),t=parseInt(b*n,10),q&&q.caller.call(q.self,-t),j.y=b},C=function(){var a=parseInt(s*l.cy/m);a<SCROLL_TRACE_MINH&&(a=SCROLL_TRACE_MINH),a>SCROLL_TRACE_MAXH&&(a=SCROLL_TRACE_MAXH),f.setBtnH(a),k=a;var b=m-s,c=l.cy-k;c==0?n=1:n=(m-s)/(l.cy-k),o=parseInt(r/n),o=o<=0?1:o;var d=parseInt(s-r*1.5);d=d<=0?1:d,p=parseInt(d/n),p=p<=0?1:p};this.initialize.apply(this,arguments)},Scrollbar=function(){var a=1,b=2,c,d,e,f,g,h,i=0,j={cx:0,cy:0},k=!1;this.initialize=function(a,b){c=a,d=this,e=TQ.createDom("div"),b.appendChild(e),l()},this.setSize=function(a,b){j.cx=a,j.cy=b,m()},this.setRange=function(a){i=a,h.setRange(j.cy,a)},this.setCaller=function(a){h.setCaller(a)},this.scrollBy=function(a){h.scrollBy(a)},this.scrollPos=function(a){h.scrollPos(a)},this.setLineHeight=function(a){h.setLineHeight(a)},this.getScrollPos=function(){return h.getScrollPos()},this.startDownBlink=function(){g.startBlinking(0),k=!0},this.stopDownBlink=function(){g.stopBlinking(),k=!1},this.isDownBlink=function(){return k};var l=function(){f=new ComButton(c,e,{uiback:uiback.btn.scrollubtn}),f.setId(a),f.setCaller({self:d,caller:n}),f.setType(BTN_TYPE.TIMER),h=new SliderBar(c,e),g=new ComButton(c,e,{uiback:uiback.btn.scrolldbtn}),g.setId(b),g.setCaller({self:d,caller:n}),g.setType(BTN_TYPE.TIMER)},m=function(){TQ.setDomSize(e,j.cx,j.cy),TQ.setCSS(e,"position","absolute");var a=f.getDom(),b=h.getDom(),c=g.getDom();TQ.setDomSize(a,j.cx,j.cx),TQ.setCSS(b,"top",j.cx+"px"),h.setSize(j.cx,j.cy-2*j.cx),TQ.setDomSize(c,j.cx,j.cx),TQ.setCSS(c,"top",j.cy-j.cx+"px")},n=function(c){c==a?h.prevLine():c==b&&h.nextLine()};this.initialize.apply(this,arguments)};var DragScroll=JClass.ex({init:function(a,b,c){this.c_interval=15,this.c_minMoveStep=.5,this.c_deaccelerateFactor=.95,this._g=a,this._con=b,this._scrollbar=c,this._startMousePos={x:0,y:0},this._startpos=0,this._moveStep=0,this._lastMousePos={x:0,y:0},this._lastTime=0,this._timer=null,TQ.captureMouseEvent(this._con,{self:this,mouseDown:this._onMouseDown,mouseMove:this._onMouseMove,mouseUp:this._onMouseUp}),TQ.captureTouchEvent(this._con,{self:this,touchStart:this._onTouchStart,touchMove:this._onTouchMove,touchEnd:this._onTouchEnd,touchCancel:this._onTouchCancel})},_onMouseDown:function(a){this._startDrag(a)},_onMouseMove:function(a){this._moveInDrag(a)},_onMouseUp:function(a){this._endDrag(a)},_onTouchStart:function(a,b,c){this._startDrag(TQ.makeMouseEvent(b.pageX,b.pageY,BTN_LEFT,c))},_onTouchMove:function(a,b,c){this._moveInDrag(TQ.makeMouseEvent(b.pageX,b.pageY,BTN_LEFT,c))},_onTouchEnd:function(a,b,c){this._endDrag(TQ.makeMouseEvent(b.pageX,b.pageY,BTN_LEFT,c))},_onTouchCancel:function(a,b){this._stopTimer()},_startDrag:function(a){this._startMousePos=TQ.mouseCoords(a),this._startpos=this._scrollbar.getScrollPos(),this._moveStep=0,this._lastMousePos=this._startMousePos,this._lastTime=(new Date).getTime(),this._stopTimer()},_moveInDrag:function(a){this._calcMoveStep(a);var b=TQ.mouseCoords(a),c=b.y-this._startMousePos.y;this._scrollbar.scrollPos(this._startpos-c)},_endDrag:function(a){this._stopTimer();if(Math.abs(this._moveStep)>this.c_minMoveStep){var b=this;this._timer=window.setInterval(function(){b._onDeaccelerateScrolling()},this.c_interval),this._startpos=this._scrollbar.getScrollPos()}},_calcMoveStep:function(a){var b=TQ.mouseCoords(a);this._moveStep=(b.y-this._lastMousePos.y)*.35,this._lastMousePos=b},_onDeaccelerateScrolling:function(){this._moveStep=this._moveStep*this.c_deaccelerateFactor,this._startpos=this._startpos-this._moveStep,this._scrollbar.scrollPos(this._startpos),Math.abs(this._moveStep)<=this.c_minMoveStep&&this._stopTimer()},_stopTimer:function(){this._timer&&(window.clearInterval(this._timer),this._timer=null)}});Scroller=function(){var a,b,c,d,e,f,g,h=0,i=0,j=0,k=0,l,m,n=!1,o=!1,p=!1,q=SCROLL_LINEH,r=null,s=null;this.initialize=function(c,d,e){a=c,b=this,f=d,f.tagName.toLowerCase()=="textarea"&&(n=!0),g=e?e:!1,t()},this.uiClass=function(){return"Scroller"},this.setCanSelect=function(){TQ.setCSS(f,"select","text")},this.refresh=function(){n?D():u()},this.scrollPos=function(a){m.scrollPos(a)},this.scrollEnd=function(){m.scrollPos(2147483647)},this.getWidth=function(){return h},this.getHeight=function(){return i},this.setSize=function(a,b){a>0&&(h=a),b>0&&(i=b),this.refresh()},this.setPos=function(a,b){TQ.setCSS(c,"left",a+"px"),TQ.setCSS(c,"top",b+"px")},this.setRect=function(a,b,c,d){this.setPos(a,b),this.setSize(c,d)},this.setLineHeight=function(a){q=a,m.setLineHeight(a)},this.setContainerObj=function(a){r=a},this.getContainerObj=function(){return r},this.show=function(){TQ.setCSS(c,"display","block")},this.hide=function(){TQ.setCSS(c,"display","none")},this.getDom=function(){return c},this.getScrollPos=function(){return m.getScrollPos()},this.getRange=function(){return j},this.startDownBlink=function(){m.startDownBlink()},this.stopDownBlink=function(){m.stopDownBlink()},this.isNearToEnd=function(){return w()},this.setScrollDomH=function(a){n||(f.h_=a)};var t=function(){var g=f.parentNode;g.removeChild(f),c=TQ.createDom("div"),g.appendChild(c),n?(j=f.scrollHeight,k=0):j=TQ.getDomHeight(f);var o=["position","left","top"];for(key in o)TQ.setCSS(c,o[key],TQ.getCSS(f,o[key]));f.style.left="0px",f.style.top="0px",d=TQ.createDom("div"),c.appendChild(d),e=TQ.createDom("div"),d.appendChild(e),e.appendChild(f),TQ.appendClass(d,"ui-scrollcon"),TQ.appendClass(e,"ui-subscrollcon"),f.style.position="absolute",TQ.addEvent(c,"mousewheel",y),l=TQ.createDom("div"),TQ.appendClass(l,"ui-scrollbarcon"),c.appendChild(l),m=new Scrollbar(a,l),m.setCaller({self:b,caller:x}),h=parseInt(TQ.getCSS(f,"width")),i=parseInt(TQ.getCSS(f,"height")),n&&(TQ.addEvent(f,"keydown",z),TQ.addEvent(f,"keyup",z),TQ.addEvent(f,"change",z),TQ.addEvent(f,"mousedown",A),TQ.addEvent(f,"mouseup",B),TQ.addEvent(f,"mousemove",C)),u(),m.scrollBy(0),s=DragScroll.snew(a,c,m)},u=function(){if(n){TQ.setDomHeight(f,i);if(TQ.getDomAutoHeight(f)>i){var a=TQ.getDomAutoHeight(f)-i;TQ.setDomHeight(f,i-a)}if(TQ.getDomAutoWidth(f)>h){var a=TQ.getDomAutoWidth(f)-h;TQ.setDomWidth(f,h-a)}j=f.scrollHeight}else TQ.setDomHeight(f,"auto"),j=TQ.getDomHeight(f);TQ.setDomSize(c,h,i),o=!g||j>i;var b=o?SCROLL_TRACE_W:0;TQ.setDomSize(d,h-b,i),TQ.setDomSize(e,h-b,i),TQ.setDomWidth(f,h-b),TQ.setDomSize(l,b,i),m.setSize(b,i);if(o){var k=b;l.style.display="block";if(n){f.style.overflowY="auto",f.style.overflowX="hidden";var p=TQ.getDomAutoWidth(f)-f.clientWidth-2*f.clientLeft;p>=0&&(p=h-f.clientWidth+1),k=b-p}TQ.setDomWidth(f,h-k),m.setRange(j)}else TQ.setCSS(l,"display","none"),n&&TQ.setCSS(f,"overflow","hidden"),TQ.setDomHeight(f,i),m.setRange(j),m.scrollBy(0)},v=function(){var a=!1;return j!=f.scrollHeight&&(j=f.scrollHeight,a=!0),k!=f.scrollTop&&(k=f.scrollTop,a=!0),a},w=function(){var a=m.getScrollPos();return i+a>=j-q},x=function(a){m.isDownBlink()&&w()&&m.stopDownBlink(),n?f.scrollTop=-a:f.style.top=a+"px"},y=function(a){a=a?a:window.event;if(!n){var b=0;a.wheelDelta?b=a.wheelDelta>0?-1:1:a.detail&&(b=a.detail<0?-1:1),a.returnValue=!1,m.scrollBy(b*q*3)}else v()&&m.scrollPos(k)},z=function(a){D()},A=function(a){a=a?a:window.event;if(TQ.getBtnType(a)!=BTN_LEFT)return;p=!0,D()},B=function(a){a=a?a:window.event;if(TQ.getBtnType(a)!=BTN_LEFT)return;p=!1},C=function(a){a=a?a:window.event,p&&D()},D=function(){if(v()){var a=!g||j>i;a!=o?u():m.setRange(j),m.scrollPos(k)}};this.initialize.apply(this,arguments)}