/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
C_SYS_DLG_HIDE = -20;
C_SYS_CLOSEBTN_ID = -1;
C_SYS_HELPBTN_ID = -2;
C_SYS_DLG_SEPARATOR = -30;
Dialog = Class.extern(function(){
	//-----------
	//private:const
	//-----------
	var C_BTN_W_SPACE = 5;
	var C_BTN_W_SEPARATOR = 20;
	
	//------------
	//public:method
	//------------
	/** 初始化
	@param ops 的输入格式
		    title:'道具列表', 
		    modal:true, 
		    width:643, 
		    pos:{x:"center/", y:50},
		    btns:[{btn:{id:0,text:'确定'},caller:null}],
		    zIndex:2000, 
		    fixzIndex:true,
		    uiback:uiback.dlg.comm,
		    nofixpng:true, //是否在ie6下对背景的png进行透明处理
		    canDrag:true,
		    dragTitleH:0,
	*/
	this.init = function(g,ops){
		if ( TQ.isMobile() ) {
			m_uibackres = uiback.mb.commdlg;
			m_commclass = {mdlg:'mb-ui-mdlg', dlg:'mb-ui-dlg'};
		}
		
		m_g = g;
		m_this = this;
		m_ops = ops;
		if ( m_ops.uiback ){
			m_uibackres = m_ops.uiback;
			if ( m_uibackres.commclass ){
				TQ.dictCopy(m_commclass, m_uibackres.commclass);
			}
		}
		
		m_resDragTitleH = m_uibackres.dragTitleH;
		if ( m_uibackres.canDrag ) m_resCanDrag = m_uibackres.canDrag;
		
		if ( m_ops.helpid ){
			m_helpid = m_ops.helpid;
		}
		
		var hasbtns = ( m_ops.btns && m_ops.btns.length > 0 );
		if ( !hasbtns && m_uibackres.nbtn_cls ){
			m_uibackres = {type:m_uibackres.type, cls:m_uibackres.nbtn_cls};
		}
		
		if ( m_ops.zIndex ){
			m_basezIndex = m_ops.zIndex;
		}
		else if ( m_ops.modal ){
			m_basezIndex = UI_ZORDER_MDLG;
		}
		else{
			m_basezIndex = UI_ZORDER_DLG;
		}
		
		m_isFixZIndex = m_ops.fixzIndex ? true : false;
		
		m_gui = m_g.getGUI();
		_createDlg();
	};
	
	this.uiClass = function(){
		return 'Dialog';
	};
	
	this.getZIndex = function(){
		return parseInt(m_dlg.style.zIndex, 10);
	};
	
	this.setZIndex = function(zindex){
		TQ.setCSS(m_dlg, 'zIndex', zindex);
		if ( m_isFixZIndex ){
			m_basezIndex = zindex;
		}
	};
	
	/** 显示面板 */
	this.show = function(pos){
		m_isshow = true;
		TQ.setCSS(m_dlg,'visibility','visible');
		var x = m_ops.pos.x;
		var y = m_ops.pos.y;
		if ( pos ){
			x = pos.x;
			y = pos.y;
		}
		_setPosition(x, y);
		
		if ( m_isFixZIndex ){
			TQ.setCSS(m_dlg, 'zIndex', m_basezIndex);
		}
		else{
			m_gui.upDlg(m_basezIndex, m_this);
		}
	};
	
	this.setPosition = function(pos){
		_setPosition(pos.x, pos.y);
	};
	
	/** 隐藏面板 */
	this.hide = function(){
		m_isshow = false;
		m_dlg.style.zIndex = -900000;
		TQ.setCSS(m_dlg, 'visibility', 'hidden');
		TQ.setCSS(m_dlgcon, 'left', '-1000000px');
		TQ.setCSS(m_dlgcon, 'top', '-1000000px');
		_sysCaller(C_SYS_DLG_HIDE);
	};
	
	/** 判断dlg是否打开 */
	this.isShow = function(){
		return m_isshow;
	};
	
	/** 设置对话框标题*/
	this.setTitle = function(title){
		TQ.setHtml(m_titletext,title);
	};
	
	/** 获取对话框标题 */
	this.getTitle = function(){
		return TQ.getTextEx(m_titletext);
	};
	
	/** 获得内容对象 */
	this.getConDom = function(){
		return m_content;
	};
	
	/** 设置对话框内容 */
	this.setContent = function(context){
		TQ.setHtml(m_content, context);
	};
	
	/** 获得对话的id */
	this.getId = function(){
		return m_id;
	};
	
	/** 获得对话的dom对象 */
	this.getDom = function(){
		return m_dlg;
	};
	
	/** 添加一个按钮 */
	this.addBtn = function(btn,caller){
		if ( btn.id == C_SYS_DLG_SEPARATOR ){
			var sep = TQ.createDom('div');
			TQ.setDomWidth(sep, C_BTN_W_SEPARATOR);
			TQ.setDomHeight(sep, 10);
			TQ.setCSS(sep,'float','left');
			TQ.append(m_btnbar,sep);
			m_separators.push(sep);
		}
		else{
			var btnobj = new ComButton(m_g,m_btnbar,{uiback:uiback.btn.dlgbtn});
			btnobj.setText(btn.text);
			btnobj.setId(btn.id);
			btnobj.setCaller(caller);
			m_btns.push(btnobj);
			
			//add split
			var split = TQ.createDom('div');
			TQ.setDomWidth(split, C_BTN_W_SPACE );
			TQ.setDomHeight(split, 10);
			TQ.setCSS(split,'float','left');
			TQ.append(m_btnbar,split);
			m_btnsplits.push(split);
		}
		_recalBtnsWidth();
	};
	
	/** 设置指定dlg的回调 */
	this.setCaller = function(caller){
		if ( caller && !_isCallerExist(caller) ){
			m_callers.push(caller);
		}
	};
	
	/** 取消一个回调注册 */
	this.unsetCaller = function(caller){
		if ( TQ.find(m_callers, null, caller) ){
			TQ.removeElement(m_callers, TQ.getLastFindIdx());
		}
	};
	
	/** 获得按钮列表 */
	this.getBtns = function(){
		return m_btns;
	};
	
	this.refresh = function(){
		_bakOverFlowCSS();// fix ie6 bug
		_resetSize();// if ie6, will change the overflow css
		_resetTitleBar();
		_recalBtnsWidth();
		_resetBtnBar();
		_refreshBack();
		_restoreOverFlowCSS(); // fix ie6 bug
	};
	
	/** 刷新对话框按钮的布局 */
	this.refreshBtn = function(){
		_recalBtnsWidth();
		_resetBtnBar();
	};
	
	/** 刷新DLG的背景图像布局 */
	this.refreshBack = function(){
		_refreshBack();
	};
	
	this.refreshTitle = function(){
		_resetTitleBar();
	};
	
	/** 切换dlg的父亲节点 */
	this.changeParent = function(newparent){
		if ( m_parent && m_parent !=newparent ){
			TQ.remove(m_parent, m_dlg);
			TQ.append(newparent, m_dlg);
			m_parent = newparent;
		}
	};
	
	/** 获得系统关闭按钮 */
	this.getSysCloseBtn = function(){
		if ( m_sysbtns.length > 0 ){
			return m_sysbtns[0];
		}
		return null;
	};
	
	this.getSize = function(){
		return {cx:TQ.getDomWidth(m_dlgcon), cy:TQ.getDomHeight(m_dlgcon)};
	};
	
	this.setSize = function(s){
		TQ.setDomWidth(m_dlgcon, s.cx );
		TQ.setDomHeight(m_dlgcon, s.cy );
		_refreshBack();
	};
	
	this.getId = function(){
		return m_id;
	};
	
	this.getPosition = function(){
		return {x:m_pos.x, y:m_pos.y};
	};
	
	this.getParent = function(){
		return m_parent;
	};
	
	this.setUpCaller = function(upCaller){
		m_upCaller = upCaller;
	};
	
	var _createDlg = function(){
		m_id = 'tqdlg_'+m_gui.allocDlgId();
		var parentdom = _createDlgOverlay(m_ops);
		parentdom = _createDlgPanel(parentdom, m_ops);
		_createDlgTitle(parentdom, m_ops);
		_createDlgContent(parentdom, m_ops);
		_createDlgBtns(parentdom, m_ops);
		_createDlgBack();
		_createCanDragTitle();
	};
	
	var _isCallerExist = function(caller){
		for ( var i=0; i<m_callers.length; ++i ){
			if ( m_callers[i].self == caller.self && m_callers[i].caller == caller.caller ){
				return true;
			}
		}
		return false;
	};
	
	/** 创建模式对话框的overlay层 */
	var _createDlgOverlay = function(ops){
		var uiBody = TQ.getUiBody();
		m_parent = uiBody;
		var parentdom = uiBody;
		if ( ops.modal ){ //模式对话框,创建overlay层
			m_dlg = TQ.createDom('div');
			TQ.setClass(m_dlg, m_commclass.mdlg);
			TQ.setCSS(m_dlg, 'visibility', 'hidden');
			TQ.append(parentdom,m_dlg);
			
			TQ.setCSS(m_dlg, 'zIndex', m_basezIndex);
			
			parentdom = m_dlg;
			var overlay = TQ.createDom('div');
			TQ.append(parentdom,overlay);
			TQ.setClass(overlay, 'ui-overlay-dlg');
			TQ.setAttr(overlay, 'unselectable', 'on');
		}
		return parentdom;
	};
	
	/** 创建对话框的整个面板 */
	var _createDlgPanel = function(parentdom, ops){
		var dlgpanel = TQ.createDom('div');
		if ( !ops.modal ){
			m_dlg = dlgpanel;
			TQ.setCSS(m_dlg, 'zIndex', UI_ZORDER_DLG);
		}
		
		if ( ops.zIndex ){
			TQ.setCSS(m_dlg, 'zIndex', ops.zIndex);
		}
		if ( ops.modal ){
			TQ.setClass(dlgpanel, 'ui-panel-dlg');
		}
		else{
			TQ.setClass(dlgpanel, m_commclass.dlg);
		}
		
		TQ.append(parentdom,dlgpanel);
		
		if ( ops.width ){
			TQ.setDomWidth(dlgpanel, ops.width );
		}
		else{
			TQ.setDomWidth(dlgpanel, 'auto');
		}
		
		m_dlgcon = dlgpanel;
		parentdom = dlgpanel;
		return parentdom;
	};
	
	/** 创建对话框的标题栏 */
	var _createDlgTitle = function(parentdom, ops){
		if ( ops.title ) {
			m_titlebar = TQ.createDom('div');
			TQ.setClass(m_titlebar, 'ui-titlebar');
			TQ.setAttr(m_titlebar, 'unselectable', 'on');
			TQ.append(parentdom, m_titlebar);
			
			// pre space div
			m_titlePreSpace = TQ.createDom('div');
			TQ.setClass(m_titlePreSpace, 'ui-titleprespace');
			TQ.append(m_titlebar, m_titlePreSpace);
			
			// title text bar
			m_titletext = TQ.createDom('div');
			TQ.setClass(m_titletext, 'ui-titletext');
			TQ.setAttr(m_titletext, 'unselectable', 'on');
			TQ.append(m_titlebar, m_titletext);
			
			// title btn bar
			m_titlebtn = TQ.createDom('div');
			TQ.setClass(m_titlebtn, 'ui-titlebtn');
			TQ.append(m_titlebar, m_titlebtn);
			
			// close btn
			var closeuiback = null;
			if ( TQ.isMobile() ) {
				closeuiback = uiback.mb.closebtn1;
			} else {
				closeuiback = uiback.btn.dlgclose;
			}
			var closebtn = new ComButton(m_g, m_titlebtn, {uiback:closeuiback});
			closebtn.setId(C_SYS_CLOSEBTN_ID);
			closebtn.setCaller({self:m_this, caller:_onBtnClick});
			m_sysbtns.push(closebtn);
			
			// help btn
			if ( m_helpid > 0 ){
				var helpbtn = new ComButton(m_g, m_titlebtn, {uiback:uiback.btn.dlghelp});
				helpbtn.setId(C_SYS_HELPBTN_ID);
				helpbtn.setCaller({self:m_this, caller:_onBtnClick});
				m_sysbtns.push(helpbtn);
			}
			
			TQ.setHtml(m_titletext, ops.title);
		}
	};
	
	/** 创建对话框的显示内容面板 */
	var _createDlgContent = function(parentdom, ops){
		m_content = TQ.createDom('div');
		TQ.append(parentdom,m_content);
		TQ.setClass(m_content, 'ui-content');
	};
	
	/** 创建对话框底部的按钮 */
	var _createDlgBtns = function(parentdom, ops){
		if ( ops.btns != null ) {
			m_btndiv = TQ.createDom('div');
			TQ.append(parentdom, m_btndiv);
			TQ.setClass(m_btndiv, 'ui-btns');
			
			m_btnspace = TQ.createDom('div');
			TQ.append(m_btndiv, m_btnspace);
			TQ.setClass(m_btnspace, 'ui-btnbarspace');
			
			m_btnbar = TQ.createDom('div');
			TQ.append(m_btndiv, m_btnbar);
			TQ.setClass(m_btnbar, 'ui-dlg-btn');
			
			for ( var i in ops.btns ){
				var btn = ops.btns[i];
				m_this.addBtn(btn.btn,btn.caller);
			}
		}
	};

	var _createCanDragTitle = function(e){
		if ( m_ops.canDrag == false ) return;
		if ( isNull(m_ops.canDrag) && m_resCanDrag == false ) return;
		
		TQ.addEvent(m_this.getDom(), 'dragstart', function(){return false;});
		TQ.addEvent(m_this.getDom(), 'selectstart', function(){return false;});
		TQ.captureMouseEvent(m_this.getDom(), {self:m_this, isCanCapture:_isCanCapture, mouseDown:_onTitleMouseDown, mouseMove:_onTitleMouseMove});
		TQ.captureTouchEvent(m_this.getDom(), {self:m_this, isCanCapture:_isCanCapture, touchStart:_onTouchStart, touchMove:_onTouchMove});
	};
	
	var _isCanCapture = function(e){
		var dragTitleH = 0;
		if ( m_resDragTitleH ) dragTitleH = m_resDragTitleH;
		if ( m_ops.dragTitleH ) dragTitleH = m_ops.dragTitleH;
		if ( dragTitleH == 0 ) return true;
		
		var mpos = TQ.mouseCoords(e);
		var dlgPos = m_this.getPosition();
		return (mpos.y - dlgPos.y) < dragTitleH && (mpos.y - dlgPos.y) >= 0;
	};
	
	var _onTouchStart = function(e, touch, element){
		var ce = TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element);
		_startDrag(TQ.mouseCoords(ce));
	};
	
	var _onTouchMove = function(e, touch, element){
		var ce = TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element);
		_moveInDrag(TQ.mouseCoords(ce));
	};
	
	var _onTitleMouseDown = function(e){
		_startDrag(TQ.mouseCoords(e));
	};
	
	var _onTitleMouseMove = function(e){
		_moveInDrag(TQ.mouseCoords(e));
	};		
	
	var _startDrag = function(pos){
		_upDlg();
		m_lastMousePos = pos;
		m_lastDlgPos = m_this.getPosition();
	};
	
	var _moveInDrag = function(curMousePos){
		log('x:' + curMousePos.x + ', y:' + curMousePos.y );
		var clientSize = m_g.getWinSizer().getValidClientSize();
		curMousePos.x = Math.clamp(curMousePos.x, 0, clientSize.cx);
		curMousePos.y = Math.clamp(curMousePos.y, 0, clientSize.cy);
		var offset = {x:(curMousePos.x - m_lastMousePos.x), y:(curMousePos.y - m_lastMousePos.y)};
		var dlgPos = {x:(m_lastDlgPos.x + offset.x), y:(m_lastDlgPos.y + offset.y)};
		m_this.setPosition(dlgPos);
	};
	
	var _upDlg = function(){
		if (  m_ops.modal ) return;
		m_gui.upDlg(UI_ZORDER_DLG, m_this);
		m_upCaller.invoke();
	};
	
	/** 响应按钮单击事件 */
	var _onBtnClick = function(id){
		if ( id == C_SYS_CLOSEBTN_ID ){
			var isSkip = _sysCaller(C_SYS_CLOSEBTN_ID);
			if ( !isSkip ) m_this.hide();
		} else if ( id == C_SYS_HELPBTN_ID ){
			m_g.pendEvent({eid:EVT.SHOWHELPBYID,sid:0,pendtime:1,helpid:m_helpid});
		}
	};
	
	/** 重新计算和设置按钮bar的宽度 */
	var _recalBtnsWidth = function(){
		if ( m_btndiv ) {
			var w = 0;
			for ( var i in m_btns ){
				var btn = m_btns[i];
				var disp = 'none';
				if ( btn.isShow() ){
					w += (btn.getWidth() + C_BTN_W_SPACE);
					disp = 'block';
				}
				TQ.setCSS(m_btnsplits[i], 'display', disp);
			}
			w = w + (m_separators.length*C_BTN_W_SEPARATOR) +TQ.getIe6DrtW();
			TQ.setDomWidth(m_btnbar, w );
		}
	};
	
	/** 设置位置 */
	var _setPosition = function(x,y){
		if ( x === 'center' ) {
			m_pos.x = (TQ.getDomWidth(m_parent) - TQ.getDomWidth(m_dlgcon))/2;
		}
		else if ( x === 'left' ) {
			m_pos.x = 0;
		}
		else if ( x === 'right' ) {
			m_pos.x = TQ.getDomWidth(m_parent) - TQ.getDomWidth(m_dlgcon);
		}
		else {
			m_pos.x = x;
		}
		
		if ( y === 'top' ) {
			m_pos.y = 0;
		}
		else if ( y == 'vcenter' ) {
			m_pos.y = (TQ.getDomHeight(m_parent) - TQ.getDomHeight(m_dlgcon))/2;
		}
		else if ( y == 'bottom' ) {
			m_pos.y = TQ.getDomHeight(m_parent) - TQ.getDomHeight(m_dlgcon);
		}
		else {
			m_pos.y = y;
			//if ( TQ.isMobile() && ((y + TQ.getDomHeight(m_dlgcon)) > TQ.getDomHeight(m_parent)) ) {
			//	m_pos.y = (TQ.getDomHeight(m_parent) - TQ.getDomHeight(m_dlgcon))/2;
			//}
		}
		
		TQ.setCSS(m_dlgcon, 'left', m_pos.x+'px');
		TQ.setCSS(m_dlgcon, 'top', m_pos.y+'px');
	};
	
	/** 刷新DLG的背景图像布局 */
	var _refreshBack = function(){
		if ( m_uibackres.type >= 0 ){
			var w = TQ.getDomWidth(m_dlgcon);
			var h = TQ.getDomHeight(m_dlgcon);
			m_gui.setUIBack(m_dlgback, w, h, m_uibackres.type);
		}
	};
	
	var _resetTitleBar = function(){
		if ( m_titlebar ){
			var w = TQ.getDomWidth(m_dlgcon);
			TQ.setDomWidth(m_titlebar, w );
			TQ.setDomWidth(m_titletext, w-TQ.getDomOutWidth(m_titlebtn)-TQ.getDomWidth(m_titlePreSpace) );
		}
	};
	
	var _resetBtnBar = function(){
		if ( m_btndiv ){
			var w = TQ.getDomWidth(m_dlgcon);
			TQ.setDomWidth(m_btndiv, w );
			TQ.setDomHeight(m_btnspace, TQ.getDomHeight(m_btnbar) );
			TQ.setDomWidth(m_btnspace, w-TQ.getDomOutWidth(m_btnbar) );
		}
	};
	
	/** 创建DLG的背景图像布局 */
	var _createDlgBack = function(){
		if ( m_dlgback ){// delete exist
			TQ.remove(m_dlgcon,m_dlgback);
			TQ.deleteDom(m_dlgback);
			m_dlgback = null;
		}
		if ( !m_dlgback && m_uibackres && m_uibackres.type >= 0 ){
			var nofixpng = m_ops.nofixpng ? true : false;
			m_dlgback = m_gui.createPanelUIBack(m_dlgcon, m_uibackres, nofixpng);
		}
	};
	
	var _resetSize = function(){
		if ( !m_ops.width
		     && m_content.firstChild
		     && m_content.firstChild.tagName.toLowerCase() == "div" ){
			var marginw = TQ.getDomMarginWidth(m_content);
			var w = marginw + TQ.getDomWidth(m_content.firstChild);
			if ( TQ.isIE6() ){// fix ie6 bug
				TQ.setCSS(m_dlgcon, 'overflow', 'hidden');
			}
			TQ.setDomWidth(m_content, TQ.getDomWidth(m_content.firstChild) );
			TQ.setDomWidth(m_dlgcon, w);
		}
	};
	
	var _bakOverFlowCSS = function(){//fix ie6 bug
		if ( TQ.isIE6() ){
			m_bakoverflowcss = TQ.curCSS(m_dlgcon, 'overflow');
			if ( !m_bakoverflowcss ){
				m_bakoverflowcss = 'visible';
			}
		}
	};
	
	var _restoreOverFlowCSS = function(){//fix ie6 bug
		if ( TQ.isIE6() ){
			TQ.setCSS(m_dlgcon, 'overflow', m_bakoverflowcss);
		}
	};
	
	var _sysCaller = function(id){
		if ( m_callers.length == 0 ) return;
		
		var isSkip = false;
		for ( var i=m_callers.length-1; i>=0; --i ){
			var caller = m_callers[i];
			var ret = caller.caller.call(caller.self, id);
			if (!isSkip) isSkip = ret ? true : false;
		}
		return isSkip;
	};
	
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_id = '';
	var m_dlg = null;
	var m_dlgcon = null;
	var m_this = null;
	var m_titlebar = null;
	var m_titlePreSpace = null;
	var m_titletext = null;
	var m_titlebtn = null;
	var m_content = null;
	var m_btnspace = null;
	var m_btnbar = null;
	var m_btns = [];
	var m_btnsplits = [];
	var m_separators = [];
	var m_sysbtns = [];
	var m_ops = null;
	var m_isshow = true;
	var m_dlgback = null;
	var m_uibackres = uiback.dlg.comm;
	var m_callers = [];
	var m_gui;
	var m_commclass = {mdlg:'ui-mdlg', dlg:'ui-dlg'};
	var m_helpid = 0;
	var m_parent;
	var m_btndiv;	
	var m_bakoverflowcss='visible';
	var m_basezIndex;
	var m_isFixZIndex=false;
	var m_pos={x:-1,y:-1};
	var m_resDragTitleH = 0;
	var m_resCanDrag = false;
	var m_lastMousePos = {x:0, y:0};
	var m_lastDlgPos = {x:0, y:0};
	var m_upCaller = NullCaller;
});
