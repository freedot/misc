/** ZORDER的定义 */
UI_ZORDER_NORMAL = 0;
UI_ZORDER_DLG = 10000;//-- 19999 + drt : 20000 - 29999
UI_SPACE_MIN = 30000;
UI_SPACE_MAX = 39999;
UI_ZORDER_MDLG = 40000;// -- 49999 + drt : 50000 - 59999
UI_ZORDER_DLGDRT = 10000;
UI_ZORDER_MSGDLG = 60000;
UI_ZORDER_POPPANEL = 70000;
UI_ZORDER_MENU = 80000;
UI_ZORDER_TOOLTIP = 90000;
UI_ZORDER_SCREEN_EFFECT = 100000;

/** 游戏界面对象 */
UI = function(){
	//-----------
	//private:const
	//-----------
	var C_WINTYPE_COMWIDGET = 0x0;
	var C_WINTYPE_COMBTN = 0x1;
	var C_WINTYPE_LIST = 0x2;
	var C_WINTYPE_NUMINPUT = 0x3;
	var C_WINTYPE_COMLABEL = 0x4;
	var C_WINTYPE_COMVALUE = 0x5;
	var C_WINTYPE_IMAGE = 0x6;
	var C_WINTYPE_CHECKBOX = 0x7;
	var C_WINTYPE_RADIOBOX = 0x8;
	var C_WINTYPE_SPININPUT = 0x9;
	var C_WINTYPE_INPUT = 0xa;
	var C_WINTYPE_DROPLIST = 0xb;
	var C_WINTYPE_TABCTRLBAR = 0xc;
	var C_WINTYPE_TABCONTAINER = 0xd;
	var C_WINTYPE_TABPAGE = 0xe;
	var C_WINTYPE_AREAINPUT = 0xf;
	var C_WINTYPE_TREE = 0x10;
	var C_WINTYPE_PROG = 0x11;
	var C_WINTYPE_COMMLABEL = 0x12;
	var C_WINTYPE_COMMVALUE = 0x13;
	var C_WINTYPE_COMMHEADCOL = 0x14;
	var C_WINTYPE_PAGENAVIGATE = 0x15;
	var C_WINTYPE_DIALOG = 0x16;
	
	var C_WINSTYLE_AUTOSCROLL = 0x1;
	var C_WINSTYLE_CHECKRADIO = 0x2;
	var C_WINSTYLE_CHECKBUTTON = 0x4;
	var C_WINSTYLE_SPINBUTTON = 0x8;
	var C_WINSTYLE_READONLY = 0x10;
	var C_WINSTYLE_AUTOWIDTH = 0x20;
	var C_WINSTYLE_AUTOHEIGHT = 0x40;
	var C_WINSTYLE_IGNORELEFTTOP = 0x80;
	var C_WINSTYLE_PROGSHOWVAL = 0x100;
	var C_WINSTYLE_PROGSHOWPER = 0x200;
	var C_WINSTYLE_ZEROLEFTTOP = 0x400;
	var C_WINSTYLE_CANCELFIRSTCLICK = 0x800;
	
	var C_WINSTYLE_V_MIDDLE = 0x1000;
	var C_WINSTYLE_V_TOP = 0x2000;
	var C_WINSTYLE_V_BOTTOM = 0x4000;
	var C_WINSTYLE_H_LEFT = 0x8000;
	var C_WINSTYLE_H_CENTER = 0x10000;
	var C_WINSTYLE_H_RIGHT = 0x20000;
	
	var C_WINSTYLE_PAGENAVIGATE_EDGEBTN = 0x40000;
	
	
	var C_MSG_FONT_TAG = '&font;';
	
	var C_COMMLABEL_BORDER_W = 1;
	var C_COMMLABEL_BORDER_H = 1;
	var C_COMMLABEL_LEFT = 3;
	var C_COMMLABEL_RIGTH = 1;
	
	var C_INPUT_DRT_W = TQ.getBrowserType() == BS_MSIE ? 4 : 2;
	var C_INPUT_DRT_H = 4;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		m_dlgzindexs = {};
		_init();
	};
	
	/** 添加弹出式面板 */
	this.appendPopPanel = function(panel) {
		if ( !TQ.find(m_poppanels, null, panel) ){
			m_poppanels.push(panel);
		}
	};
	
	this.removePopPanel = function(panel){
		if ( TQ.find(m_poppanels, null, panel) ){
			TQ.removeElement(m_poppanels, TQ.getLastFindIdx());
		}
	};
	
	this.hideAllMenu = function(){
		for ( var i=0; i<m_poppanels.length; ++i ) {
			var o = m_poppanels[i];
			o.style.visibility = 'hidden';
		}
		m_poppanels = [];
	};
	
	this.allocDlgId = function(){
		return m_dlgid++;
	};
	
	this.msgBox = function(title, msg, flag, caller, btnTxts){
		if ( !m_msgdlg ) {
			m_msgdlg = new MessageBox(m_g);
		}
		m_msgdlg.show(title, msg, flag, caller, btnTxts);
	};
	
	this.noTitleMsgBox = function(msg){
		if ( !m_notitlemsgdlg ) {
			m_notitlemsgdlg = new NoButtonTitleMessageBox(m_g);
		}
		m_notitlemsgdlg.show(msg);
	};
	
	this.hideMsgBox = function(){
		if ( m_msgdlg ) m_msgdlg.hide();
	};
	
	this.msgBoxClick = function(id){
		if ( m_msgdlg ) m_msgdlg.click(id);
	};
	
	this.isShowMsgBox = function(){
		if (!m_msgdlg) return false;
		return m_msgdlg.isShow();
	};
	
	this.getMsgBoxMsg = function(){
		return m_msgdlg ? m_msgdlg.getMsg() : '';
	};
	
	this.sysMsgTips = function(type,msg){
		this.getSysMsgTipBox().show(type, msg);
	};
	
	this.sysMsgTips2 = function(type, msg){
		this.getSysMsgTipBox2().show(type, msg);
	};
	
	this.getSysMsgTipBox = function(){
		if ( !m_sysmsgtips ){
			m_sysmsgtips = SysMsgTipsBox.snew(m_g);
		}
		return m_sysmsgtips;
	};
	
	this.getSysMsgTipBox2 = function(){
		if ( !m_sysmsgtips2 ){
			m_sysmsgtips2 = SysMsgTipsBox2.snew(m_g);
		}
		return m_sysmsgtips2;
	};
	
	this.getColorPanel = function(){
		if ( !m_colorpanel ){
			m_colorpanel = new ColorPanel(m_g);
		}
		return m_colorpanel;
	};
	
	this.getFontSizePanel = function(){
		if ( !m_fontsizepanel ){
			m_fontsizepanel = new FontSizePanel(m_g);
		}
		return m_fontsizepanel;
	};
	
	/** 通过配置文件初始化对话框 */
	this.initDlg = function(dlg,uires,items){
		var panel = dlg.getConDom();
		itemres = uires['c_'];
		tmp = uires['t_'];
		this._setDlgContentPos(dlg, itemres);
		_buildDlgItems(panel,itemres,tmp,items,true);
		dlg.refresh();
		dlg.show();
	};
	
	this._setDlgContentPos = function(dlg, itemres){
		if ( isNull(itemres.f) && isNull(itemres.g) && TQ.isIE() ) {
			var parentScreenPos = TQ.domOffset(dlg.getDom());
			var contentScreenPos = TQ.domOffset(dlg.getConDom());
			itemres.f = contentScreenPos.left - parentScreenPos.left;
			itemres.g = contentScreenPos.top - parentScreenPos.top;
			if (itemres.g > 60) itemres.g = 60;
		}
	};
	
	/** 通过配置文件初始化面板 */
	this.initPanel = function(panel,uires,items){
		itemres = uires['c_'];
		tmp = uires['t_'];
		_buildDlgItems(panel,itemres,tmp,items,true);
	};
	
	this.buildDomItems = function(parent,itemres,tmp,items){
		_buildDlgItems(parent,itemres,tmp,items,true);
	};
	
	this.setUIBack = function(panelback,w,h,t){
		if ( panelback ) {
			if ( w == -1 ){
				_resetParentByChild(panelback, t);
			}
			else{
				_resetParentAndChild(panelback, w, h, t);
			}
		}
	};
	
	this.createPanelUIBack = function(panel, backres, nofixpng, zIndex){
		var panelback = null;
		var fixpng = nofixpng ? false : true;
		zIndex = (zIndex == null)? -2 : zIndex;
		if ( panel ){
			panelback = TQ.createDom('div');
			TQ.setClass(panelback,'ui-back');
			TQ.setCSS(panelback, 'zIndex', zIndex);
			TQ.setCSS(panelback, 'position', 'absolute');
			TQ.append(panel, panelback);
		}
		
		if ( panel && backres.cls.length > 1 ){
			for ( var k in backres.cls ){
				var backcorner = TQ.createDom('div');
				TQ.setClass(backcorner,backres.cls[k]);
				TQ.append(panelback, backcorner);
				if ( fixpng ){
					TQ.fixIE6Png(backcorner);
				}
			}
		}
		else if ( panel &&  backres.cls.length == 1 ) {
			TQ.setClass(panelback,backres.cls[0]);
			if ( fixpng ){
				TQ.fixIE6Png(panelback);
			}
		}
		
		return panelback;
	};
	
	/** 
	@param flag  --- =0表示显示在dombtn的上方，=1表示显示在dombtn的下方
	*/
	this.showBtnPanel = function(flag, dombtn, panel){
		_showBtnPanel(flag, dombtn, panel);
	};
	
	this.decodeFont = function(msg){
		if ( msg.indexOf(C_MSG_FONT_TAG) == 0 ){
			var coloridx = parseInt(msg.substr(C_MSG_FONT_TAG.length, 2), 10);
			var szcolor = this.getColorPanel().getColorByIdx(coloridx);
			var sizeidx = parseInt(msg.substr(C_MSG_FONT_TAG.length+2, 2), 10);
			var szsize = this.getFontSizePanel().getSizeByIdx(sizeidx);
			if ( szcolor && szsize ){
				var taglen = C_MSG_FONT_TAG.length + 2 + 2;
				msg = '<font style="color:'+szcolor+';font-size:'+szsize+'px;">' + msg.substr(taglen, msg.length - taglen) + '</font>';
			}
		}
		return msg;
	};
	
	this.encodeFont = function(msg, coloridx, fontsizeidx){
		return C_MSG_FONT_TAG + TQ.formatNumber(coloridx, 2) + TQ.formatNumber(fontsizeidx, 2) + msg;
	};
	
	this.selectSubDiv = function(dom){
		return _selectSubDiv(dom);
	};
	
	this.setCursor = function(id) {
		m_cursorid = id;
		TQ.setCSS(m_cursorsrc['s'+id].dom, 'cursor', m_cursorsrc['s'+id].src);
	};
	
	this.getCursor = function(){
		return m_cursorid;
	};
	
	this.addCursor = function(id, dom, imgsrc) {
		dom = dom ? dom : TQ.getUiBody();
		if ( m_cursorsrc['s'+id] ){
			alert('the cursor id is exist : ' + id);
		}
		else{
			m_cursorsrc['s'+id] = {src:imgsrc, dom:dom};
		}
	};
	
	this.clearCursors = function(){
		m_cursorsrc = {};
	};
	
	this.hideDlgs = function(zindex){
		var zitem = m_dlgzindexs[zindex];
		if ( !zitem ) return;
		for( var i=0; i<zitem.dlglists.length; ++i ){
			var d = zitem.dlglists[i];
			if ( d.isShow() ) d.hide();
		}
	};
	
	this.upDlg = function(zindex, dlg){
		_upDlg(zindex, dlg);
	};

	//--------------
	// private:method
	//--------------
	var _init = function(){
		_initEvent();
		_initStartUI();
	};
	
	var _initEvent = function(){
		TQ.addEvent(document, 'mousedown', _onMousedown);
		m_g.regEvent(EVT.MOUSEDOWN, 0, m_this, _onCustomMousedown);
	};
	
	var _initStartUI = function(){
	};
	
	var _onMousedown = function(e) {
		var t = null;
		if ( e.target ){
			t = e.target;
		}
		else if ( e.srcElement ){
			t = e.srcElement;
		}
		else{
			alert('error obj target');
			return;
		}
		var isfind = false;
		for ( var i=0; i<m_poppanels.length; ++i ) {
			var o = m_poppanels[i];
			var p = t;
			while ( p ) {
				if ( p == o ) {
					isfind = true;
					break;
				}
				p = p.parentNode;
			}
			
			if ( isfind ) break;
		}
		
		if ( !isfind ) {
			m_this.hideAllMenu();
		}
	};

	var _onCustomMousedown = function(e) {
		_onMousedown(e.event);
	};
	
	var _buildDlgItems = function(parent,itemres,tmp,items,resetparentsize){
		var itemdom = null;
		var scroller = null;
		if(itemres.a == C_WINTYPE_INPUT	|| itemres.a == C_WINTYPE_NUMINPUT){
			itemdom = TQ.createDom('input');
			TQ.setAttr(itemdom,'type','text');
			itemdom.className = 'ui-input';
		}
		else if (itemres.a == C_WINTYPE_AREAINPUT){
			itemdom = TQ.createDom('textarea');
			itemdom.className = 'ui-areainput';
		}
		else{
			itemdom = TQ.createDom('div');
			if ( itemres.cs && itemres.cs==1 ) {
				//itemdom.onselectstart = function(){return false;};
				//itemdom.setAttribute('unselectable', 'on');
				//TQ.setCSS(itemdom, 'unselect', 'none' );
			} else if (itemres.cs && itemres.cs==2) {
				TQ.setCSS(itemdom, 'select', 'text' );
				//g_can_select_elems.push(itemdom);
				//itemdom.setAttribute('unselectable', 'text');
				//itemdom.onselectstart = function(){return true;};
			}
		}
	
		if ( itemdom ){
			TQ.append(parent,itemdom);
			
			if ( !itemres.c ){ // Position (css)
				TQ.setCSS(itemdom,'position','absolute');
			}
			
			if ( itemres.a != C_WINTYPE_COMBTN ){
				if ( itemres.m && !itemres.n && !itemres.o && !itemres.ak){ // NormalClass
					TQ.appendClass(itemdom,itemres.m);
				}
			}
			
			var zerolefttop = (itemres.b && TQ.hasBit(itemres.b, C_WINSTYLE_ZEROLEFTTOP));
			if ( zerolefttop ){
				itemres.f = 0;
				itemres.g = 0;
			}
			
			if ( itemres.f != undefined && itemres.g != undefined ){ // position (left,top)
				var ignorelefttop = (itemres.b && TQ.hasBit(itemres.b, C_WINSTYLE_IGNORELEFTTOP));
				if ( !ignorelefttop ){
					TQ.setCSS(itemdom,'left',itemres.f+'px');
					TQ.setCSS(itemdom,'top',itemres.g+'px');
				}
			}
			
			if ( itemres.h && itemres.i ){ // size (width, height)
				var itemw = itemres.h;
				var itemh = itemres.i;
				if(itemres.a == C_WINTYPE_INPUT	|| itemres.a == C_WINTYPE_NUMINPUT) {
					itemw = itemres.h - C_INPUT_DRT_W;
					itemh = itemres.i - C_INPUT_DRT_H;
				}
				var autow = (itemres.b && TQ.hasBit(itemres.b,C_WINSTYLE_AUTOWIDTH));
				var autoh = (itemres.b && TQ.hasBit(itemres.b,C_WINSTYLE_AUTOHEIGHT));
				var strw = autow?'auto':itemw;
				var strh = autoh?'auto':itemh;
				TQ.setDomSize(itemdom, strw, strh);
				if ( resetparentsize ){
					TQ.setDomSize(parent, strw, strh);
				}
			}
			
			if ( itemres.t ){ // tooltip
				var t = itemres.t;
				if ( t.indexOf('<') < 0 ) {
					t = '<div class="commtip">' + t + '</div>';
				}
				var tipid = TTIP.addTip(itemdom, t );
				if ( itemres.t.charAt(0) == '$' ){
					if ( !items['tooltips'] )items['tooltips'] = {};
					items['tooltips'][itemres.t] = tipid;
				}
			}
			
			if ( itemres.d ){// Float  ???
				var floatCSS = ['','left','right'];
				TQ.setCSS(itemdom,'float',floatCSS[itemres.d]);
				if ( resetparentsize ){
					TQ.setCSS(parent,'float',floatCSS[itemres.d]);
				}
			}
			
			if ( items && itemres.e ) { // Id
				if ( itemres.a != C_WINTYPE_RADIOBOX
					&& itemres.a != C_WINTYPE_TABCTRLBAR
					&& itemres.a != C_WINTYPE_TABCONTAINER ){
					items[itemres.e] = itemdom;
				}
			}
			
			if ( itemres.j ){ //zIndex
				//TQ.setCSS(parent,'zIndex',itemres.j);
				TQ.setCSS(itemdom,'zIndex',itemres.j);
			}
			
			// create auto scroller
			if ( TQ.hasBit(itemres.b,C_WINSTYLE_AUTOSCROLL) ){ // Style auto scroll
				scroller = new Scroller(m_g,itemdom,true);
				scroller.refresh();
				if ( items && itemres.e ) {// Id
					var containerObj = items[itemres.e];
					if ( containerObj ){
						scroller.setContainerObj(containerObj);
					}
					items[itemres.e] = scroller;
				}
			}
			
			if ( itemres.a == C_WINTYPE_LIST ){ // type = list
				var dom = itemdom;
				if ( items && itemres.e && items[itemres.e] ){
					dom = items[itemres.e];
				}
				var list = List.snew(m_g,dom);
				var tmpitem = null;
				if ( itemres.ai ){// item other template
					tmpitem = eval(itemres.ai);
				}
				else if ( tmp ){// item template
					tmpitem = tmp[itemres.k];
				}
				if ( tmpitem ){
					var itemclass = {sel:'',hot:'',normal:'',disable:''};
					if (tmpitem.m)itemclass.normal = tmpitem.m;
					if (tmpitem.n)itemclass.hot = tmpitem.n;
					if (tmpitem.o)itemclass.sel = tmpitem.o;
					if (tmpitem.ak)itemclass.disable = tmpitem.ak;
					list.setItemTmplEx({c:itemclass, cg:tmpitem});
					if ( TQ.hasBit(itemres.b, C_WINSTYLE_CANCELFIRSTCLICK) ){
						list.cancelFirstClick(true);
					}
				}
				if ( itemres.l ){ // 默认列表条目个数
					list.setItemCount(itemres.l);
				}
				if ( items && itemres.e ) { // Id
					items[itemres.e] = list;
				}
			}
			else if ( itemres.a == C_WINTYPE_TREE ){// tree
				var dom = itemdom;
				if ( items && itemres.e && items[itemres.e] ){
					dom = items[itemres.e];
				}
				var tree = new Tree(m_g,dom);
				if ( items && itemres.e ) { // Id
					items[itemres.e] = tree;
				}
			}
			else if ( itemres.a == C_WINTYPE_PROG ){ // progressbar
				var ops = {};
				if ( itemres.aj ){
					ops.uiback = itemres.aj;
				}
				ops.showflag = 0; // no show
				if ( TQ.hasBit(itemres.b, C_WINSTYLE_PROGSHOWVAL) ){
					ops.showflag = 1; // show value
				}
				else if ( TQ.hasBit(itemres.b, C_WINSTYLE_PROGSHOWPER) ){
					ops.showflag = 2; // show per
				}
				var progressbar = new ProgressBarEx(m_g, itemdom, ops);
				if ( itemres.al ) {
					progressbar.setColor(itemres.al);
				}
				
				if ( items && itemres.e ) { // Id
					items[itemres.e] = progressbar;
				}
			}
			else if ( itemres.a == C_WINTYPE_COMBTN ){
				var ops = {};
				if ( itemres.aj ){
					ops.uiback = itemres.aj;
				}
				var btnobj = new ComButton(m_g,itemdom,ops);
				if ( itemres.u ) { //ButtonId
					btnobj.setId(itemres.u);
				}
				if ( itemres.w ){ //ButtonText
					btnobj.setText( itemres.w );
				}
				if ( items && itemres.e ) { // Id
					items[itemres.e] = btnobj;
				}
				var ischeckbutton = (itemres.b && TQ.hasBit(itemres.b,C_WINSTYLE_CHECKBUTTON));
				if ( ischeckbutton ) {
					btnobj.setType(BTN_TYPE.CHECK);
				}
			}
			else if ( itemres.a == C_WINTYPE_DROPLIST ){
				var droplist = new DropList(m_g,itemdom,{width:itemres.h});
				if ( items && itemres.e ) { // Id
					items[itemres.e] = droplist;
				}
			}
			else if ( itemres.a == C_WINTYPE_RADIOBOX ){
				if ( items && itemres.e ) { // Id
					var radiogroups = items[itemres.e];
					if ( !radiogroups ){
						var checkflag = (itemres.b && TQ.hasBit(itemres.b,C_WINSTYLE_CHECKRADIO));
						radiogroups = new RadioGroup(checkflag);
						items[itemres.e] = radiogroups;
					}
					var ops = {};
					if ( itemres.aj ){
						ops.uiback = itemres.aj;
					}
					var radio = new RadioBox(m_g,itemdom,ops);
					if ( itemres.aa ){ //RadioId
						radio.setId(itemres.aa);
					}
					if ( itemres.ad ){ //RadioText
						radio.setText( itemres.ad );
					}
					radiogroups.append(radio);
				}
			}
			else if ( itemres.a == C_WINTYPE_CHECKBOX ){
				if ( items && itemres.e ) { // Id
					var ops = {};
					if ( itemres.aj ){
						ops.uiback = itemres.aj;
					}
					var check = new CheckBox(m_g, itemdom, ops);
					if ( itemres.ae ){ //CheckId
						check.setId(itemres.ae);
					}
					if ( itemres.af ){ //CheckText
						check.setText( itemres.af );
					}
					items[itemres.e] = check;
				}
			}
			else if ( itemres.a == C_WINTYPE_SPININPUT ){
				TQ.appendClass(itemdom,'ui-inputdom');
				var spininput = new SpinInput(m_g,itemdom,itemres.q,itemres.r,itemres.s);
				if ( itemres.b ){
					spininput.setReadOnly(TQ.hasBit(itemres.b,C_WINSTYLE_READONLY));
				}
				if ( itemres.p == '' ) itemres.p = 0;
				spininput.setVal( Number(itemres.p) );
				items[itemres.e] = spininput;
			}
			else if ( itemres.a == C_WINTYPE_NUMINPUT ){
				var numinput = new NumInput(m_g, itemdom, itemres.r, itemres.s);
				if ( itemres.p == '' ) itemres.p = 0;
				numinput.setVal( Number(itemres.p) );
				if ( items && itemres.e ){
					items[itemres.e] = numinput;
				}
			}
			else if ( itemres.a == C_WINTYPE_INPUT ){
			}
			else if ( itemres.a == C_WINTYPE_AREAINPUT ){
				var strw = itemres.h-C_INPUT_DRT_W;
				var strh = itemres.i-C_INPUT_DRT_H;
				TQ.setDomSize(itemdom, strw, strh);
			}
			else if ( itemres.a == C_WINTYPE_TABCTRLBAR ){
				if ( !itemres.e ){
					alert('TABCTRLBAR must has item name!');
					return;
				}
				var ops = {};
				if ( itemres.aj ){
					ops.tabuiback = itemres.aj;
				}
				var tabPanel = new TabPanel(m_g, itemdom, ops);
				if ( tmp && itemres.ag ){ // TabTempList
					var container = null;
					if ( items && itemres.e ){
						container = items[itemres.e];
					}
					if ( container ) {
						_resetTabPage(tabPanel,container,tmp,itemres,items);
					}
				}
				if ( items && itemres.e ){
					items[itemres.e] = tabPanel;
				}
			}
			else if ( itemres.a == C_WINTYPE_TABCONTAINER ){
				if ( !itemres.e ){
					alert('TABCONTAINER must has item name!');
					return;
				}
				if ( tmp && itemres.ag ){ // TabTempList
					items[itemres.e+'_sub_'] = [];
					var subitems = items[itemres.e+'_sub_'];
					for ( var i=0; i<itemres.ag.length; ++i ){
						var subitemres = tmp[itemres.ag[i]];
						if ( subitemres ){
							var subitem = {};
							_buildDlgItems(itemdom,subitemres,tmp,subitem,true);
							subitems.push(subitem);
						}
					}
					if ( items && itemres.e && items[itemres.e]){
						var tabPanel = items[itemres.e];
						_resetTabPage(tabPanel,itemdom,tmp,itemres,items);
					}
				}
				if ( items && itemres.e && !items[itemres.e]){
					items[itemres.e] = itemdom;
				}
			}
			else if ( itemres.a == C_WINTYPE_COMMLABEL ){
				_setCommLabel(itemdom, itemres, 'comm_label');
				_setDefaultText(itemdom, itemres);
			}
			else if ( itemres.a == C_WINTYPE_PAGENAVIGATE ){
				var ops = {edgebtn:false};
				if ( TQ.hasBit(itemres.b, C_WINSTYLE_PAGENAVIGATE_EDGEBTN) ){
					ops.edgebtn = true;
				}
				var page = new PageNavigate(m_g, itemdom, ops);
				if ( items && itemres.e ){
					items[itemres.e] = page;
				}
			}
			else if ( itemres.a == C_WINTYPE_COMMVALUE ){
				_setCommLabel(itemdom, itemres, 'comm_value');
				_setDefaultText(itemdom, itemres);
			}
			else if ( itemres.a == C_WINTYPE_COMMHEADCOL ){
				TQ.appendClass(itemdom, 'commheadcol');
				var domleft = TQ.createDom('div');
				var domtext = TQ.createDom('div');
				var domright = TQ.createDom('div');
				TQ.append(itemdom, domleft);
				TQ.append(itemdom, domtext);
				TQ.append(itemdom, domright);
				TQ.setClass(domleft, 'leftdom');
				TQ.setClass(domtext, 'textdom');
				TQ.setClass(domright, 'rightdom');
				TQ.setDomWidth(domtext, TQ.getDomWidth(itemdom)-TQ.getDomWidth(domleft)-TQ.getDomWidth(domright) );
				_setDefaultText(domtext, itemres);
				if ( items && itemres.e ){
					items[itemres.e+'@parent'] = items[itemres.e];
					items[itemres.e] = domtext;
				}
			}
			else{
				_setComWidget(itemdom, itemres);
				_setDefaultText(itemdom, itemres);
			}
		}
		
		// 遍历构建子窗体条目
		if ( itemdom && itemres.z ){ // children
			for ( var i=0; i<itemres.z.length; ++i ){
				_buildDlgItems(itemdom,itemres.z[i],tmp,items,false);
			}
		}
	};
	
	var _setDefaultText = function(itemdom, itemres){
		if ( itemres.p ){
			var dom = itemdom;
			if ( itemdom.uiClass && itemdom.uiClass() == 'Scroller' ){
				dom = itemdom.getContainerObj();
			}
			TQ.setTextEx(dom, itemres.p );
		}	
	};
	
	var _setComWidget = function(itemdom, itemres){
		var domw = TQ.getDomWidth(itemdom);
		var domh = TQ.getDomHeight(itemdom);
		var drtw = 0;
		var drth = 0;
		if ( itemres.h && itemres.i ){
			var autow = (itemres.b && TQ.hasBit(itemres.b, C_WINSTYLE_AUTOWIDTH));
			var autoh = (itemres.b && TQ.hasBit(itemres.b, C_WINSTYLE_AUTOHEIGHT));
			if ( !autow ){
				if (domw == 0) domw = itemres.h;
				drtw = domw - itemres.h;
				domw = itemres.h;
			}
			if ( !autoh ){
				if (domh == 0) domh = itemres.i;
				drth = domh - itemres.i;
				domh = itemres.i;
			}
		}
		var adjustrt = _setLabelAlign(domw, domh, itemdom, itemres);
		domw = adjustrt.domw - drtw;
		domh = adjustrt.domh - drth ;
		TQ.setDomSize(itemdom, domw, domh);
	};
	
	var _setLabelAlign = function(domw, domh, itemdom, itemres){
		if ( !itemres.b ){
		}
		else if ( TQ.hasBit(itemres.b,C_WINSTYLE_V_MIDDLE) ){
			TQ.setCSS(itemdom, 'lineHeight', domh+'px');
		}
		
		if ( TQ.hasBit(itemres.b,C_WINSTYLE_H_LEFT) ){
			TQ.setCSS(itemdom, 'textAlign', 'left');
			TQ.setCSS(itemdom, 'paddingLeft', C_COMMLABEL_LEFT+'px');
			domw -= C_COMMLABEL_LEFT;
		}
		else if ( TQ.hasBit(itemres.b,C_WINSTYLE_H_CENTER) ){
			TQ.setCSS(itemdom, 'textAlign', 'center');
		}
		else if ( TQ.hasBit(itemres.b,C_WINSTYLE_H_RIGHT) ){
			TQ.setCSS(itemdom, 'textAlign', 'right');
			TQ.setCSS(itemdom, 'paddingRight', C_COMMLABEL_RIGTH+'px');
			domw -= C_COMMLABEL_RIGTH;
		}
		return {domw:domw, domh:domh};
	};
	
	var _setCommLabel = function(itemdom, itemres, classname){
		var domw = TQ.getDomWidth(itemdom) - 2*C_COMMLABEL_BORDER_W;
		var domh = TQ.getDomHeight(itemdom) - 2*C_COMMLABEL_BORDER_H;
		var adjustrt = _setLabelAlign(domw, domh, itemdom, itemres);
		domw = adjustrt.domw;
		domh = adjustrt.domh;
		TQ.setDomSize(itemdom, domw, domh);
		TQ.appendClass(itemdom, classname);
	};
	
	var _showBtnPanel = function(flag, dombtn, panel){
		var off = TQ.domOffset(dombtn);
		var size = panel.getSize();
		var x = off.left-1;
		var y = off.top - size.cy;
		if ( flag == 1 ){
			y = off.top + TQ.getDomHeight(dombtn);
		}
		panel.show({x:x,y:y});
	};
	
	var _resetTabPage = function(tabPanel,container,tmp,itemres,items){
		if ( !container.childNodes ) return;
		var subitems = items[itemres.e+'_sub_'];
		for ( var i=0; i<container.childNodes.length; ++i ){
			var subitemres = tmp[itemres.ag[i]];
			var tabname = subitemres.ah ? subitemres.ah : '';
			var subitem = container.childNodes[i];
			tabPanel.setTabPage(i, tabname, subitem, subitems[i]);
		}
		items[itemres.e+'_sub_'] = null;
	};
	
	var _selectSubDivForIe6 = function(dom){
		var cnodes = [];
		for ( var i=0; i<dom.childNodes.length; ++i ){
			var c = dom.childNodes[i];
			if ( c.nodeName == 'DIV' ){
				cnodes.push(c);
			}
		}
		return cnodes;
	};	
	
	var _selectSubDiv = function(dom){
		var cnodes = null;
		if ( TQ.isIE6() ){
			cnodes = _selectSubDivForIe6(dom);
		}
		else{
			cnodes = dom.childNodes;
		}
		return cnodes;
	};	
	
	var _resetParentByChild = function(dlgback, t){
		var cnodes = _selectSubDiv(dlgback);
		var w = 0;
		var h = 0;
		if ( t == 0 ){
			return;
		}
		else if ( t == 1 ){
			//0  1  2
			w = TQ.getDomWidth(cnodes[0]) + TQ.getDomWidth(cnodes[1]) + TQ.getDomWidth(cnodes[2]);
			h = TQ.getDomHeight(cnodes[0]);
		}
		else if ( t == 2 ){
			//0
			//1
			//2
			w = TQ.getDomWidth(cnodes[0]);
			h = TQ.getDomHeight(cnodes[0]) + TQ.getDomHeight(cnodes[1]) + TQ.getDomHeight(cnodes[2]);
		}
		else if ( t == 3 ){
			//0  1  2
			//3  4  5
			//6  7  8
			w = TQ.getDomWidth(cnodes[0]) + TQ.getDomWidth(cnodes[1]) + TQ.getDomWidth(cnodes[2]);
			h = TQ.getDomHeight(cnodes[0]) + TQ.getDomHeight(cnodes[3]) + TQ.getDomHeight(cnodes[6]);
		}
		TQ.setDomWidth(dlgback, w);
		TQ.setDomHeight(dlgback, h);
	};
	
	var _resetParentAndChild = function(dlgback, w, h, t){
		// for ie6, 
		var cnodes = _selectSubDiv(dlgback);
		var adjustw = w;
		var adjusth = h;
		if ( t == 1 ){
			//0  1  2
			var cw = w - TQ.getDomWidth(cnodes[0]) - TQ.getDomWidth(cnodes[2]);
			if ( cw <= 0 ) {
				cw = 1;
				adjustw = cw + TQ.getDomWidth(cnodes[0]) + TQ.getDomWidth(cnodes[2]);
			}
			TQ.setDomWidth(cnodes[1], cw);
		}
		else if ( t == 2 ){
			//0
			//1
			//2
			var ch = h - TQ.getDomHeight(cnodes[0]) - TQ.getDomHeight(cnodes[2]);
			if ( ch <= 0 ){
				ch = 1;
				adjusth = ch + TQ.getDomHeight(cnodes[0]) + TQ.getDomHeight(cnodes[2]);
			}
			TQ.setDomHeight(cnodes[1], ch );
		}
		else if ( t == 3 ){
			//0  1  2
			//3  4  5
			//6  7  8
			var cw = w - TQ.getDomWidth(cnodes[0]) - TQ.getDomWidth(cnodes[2]);
			var ch = h - TQ.getDomHeight(cnodes[0]) - TQ.getDomHeight(cnodes[6]);
			if ( cw <= 0 ) {
				cw = 1;
				adjustw = cw + TQ.getDomWidth(cnodes[0]) + TQ.getDomWidth(cnodes[2]);
			}
			if ( ch <= 0 ){
				ch = 1;
				adjusth = ch + TQ.getDomHeight(cnodes[0]) + TQ.getDomHeight(cnodes[6]);
			}
			TQ.setDomWidth(cnodes[1], cw);
			TQ.setDomWidth(cnodes[4], cw);
			TQ.setDomWidth(cnodes[7], cw);
			TQ.setDomHeight(cnodes[3], ch);
			TQ.setDomHeight(cnodes[4], ch);
			TQ.setDomHeight(cnodes[5], ch);
		}
		TQ.setCSS(dlgback, 'left', '0px');
		TQ.setCSS(dlgback, 'top', '0px');
		TQ.setDomWidth(dlgback, adjustw);
		TQ.setDomHeight(dlgback, adjusth);
	};
	
	var _upDlg = function(zindex, dlg){
		var zitem = m_dlgzindexs[zindex];
		if ( !zitem ){
			zitem = _createNewZIndexNode(zindex, dlg);
		}
		else if ( isNull( zitem.dlgidxs[dlg.getId()] ) ) {
			if ( !_addDlgToZIndexNode(zitem, dlg) ) return;
		}
		_resortZIndexDlgidxs(zitem, dlg);
		dlg.setZIndex(++zitem.curmax);
	};
	
	var _createNewZIndexNode = function(zindex, dlg){
		m_dlgzindexs[zindex] = {base:0, curmax:0, max:0, dlgidxs:{}, dlglists:[]};
		var zitem = m_dlgzindexs[zindex];
		_addDlgToListIdx(zitem, dlg);
		zitem.base = zindex;
		zitem.curmax = zindex;
		zitem.max = zindex + UI_ZORDER_DLGDRT;
		return zitem;
	};
	
	var _addDlgToZIndexNode = function(zitem, dlg){
		_addDlgToListIdx(zitem, dlg);
		if ( zitem.dlglists.length >= (zitem.max - zitem.base) ){
			alert('error: 5939694, too many dlg!');
			return false;
		}
		return true;
	};
	
	var _addDlgToListIdx = function(zitem, dlg){
		zitem.dlglists.push(dlg);
		zitem.dlgidxs[dlg.getId()] = zitem.dlglists.length-1;
	};
	
	var _resortZIndexDlgidxs = function(zitem, dlg){
		if ( (zitem.curmax+1) < zitem.max ) return;
		zitem.dlgidxs = {};
		zitem.curmax = zitem.base;
		zitem.dlglists.sort(function(a,b){return (a.getZIndex()>b.getZIndex())?1:-1;});
		for( var i=0, n=zitem.dlglists.length; i<n; ++i ){
			var d = zitem.dlglists[i];
			if ( d.isShow() ){
				d.setZIndex(zitem.base+i);
				zitem.curmax++;
			}
			zitem.dlgidxs[d.getId()] = i;
		}
	};
	
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_this = null;
	var m_poppanels = [];
	var m_dlgid = 0;
	var m_msgdlg = null;
	var m_notitlemsgdlg = null;
	var m_sysmsgtips = null;
	var m_sysmsgtips2 = null;
	var m_colorpanel = null;
	var m_fontsizepanel = null;
	var m_cursorsrc={};
	var m_dlgzindexs = null;
	var m_cursorid='default';
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};
