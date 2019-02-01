/******************************************************************************
******************************************************************************/
// 初始打开list时，会回调drawcaller
// 移动滚动条时，会回调drawcaller
// 调用redraw，会回调drawcaller
VirtualList = Class.extern(function(){
/*	
	this.init = function(g, parent){
		this._list = List.snew(g, parent);
		this._count = 0;
		this._canShowCount = 0;
		this._items = [];
	};
	
	this.setItemCount = function(cnt) {
		this._count = cnt;
		this._createItems(this._count);
		this.refresh();
	};	
	
	this._createItems = function() {
		if ( this._canShowCount == 0 ) {
			this._canShowCount = this._calcMaxShowItems();
		}
		
		var minCount = Math.min(this._canShowCount, this._count);
		if ( this._items.length >= minCount ) return;
		
		for ( var i=this._items.length; i<minCount; ++i ) {
			var item = TQ.createDom('div');
			TQ.append(m_dom, item);
			TQ.setClass(item, m_itemclass.normal);
			m_lists.push({item:item,exsubs:{},subs:[],enable:true});
			var litem = m_lists[m_lists.length-1];
			var subs = litem.subs;
			var exsubs = litem.exsubs;
			
			m_g.getGUI().buildDomItems(item, m_extmpl.cg, null, exsubs);
			for ( var j=0; j<item.childNodes.length; ++j ){
				var subitem = item.childNodes[j];
				m_itemlevel = 0;
				_buildItems(i,item,subitem,null,false);
			}
			
			if ( m_cancelFirstClick && (m_itemclass.hot != '' || m_itemclass.sel != '') ){	
				TQ.setClass(item, '');
				TQ.setClass(item.firstChild, '');
				TQ.setClass(item.firstChild.firstChild, m_itemclass.normal);
			}

			TQ.setCSS(item, 'position', 'relative');
			TQ.setCSS(item.firstChild, 'position', 'absolute');
			TQ.setCSS(item.firstChild, 'left', '0px');
			TQ.setCSS(item.firstChild, 'top', '0px');
		}
	};
	
	this.setDrawCaller = function(caller){
		//caller.invoke(idx, item);
	};
	
	this.redraw = function(scrollPos){
	};
*/
});

// 1. 每个page在点击时才加载
// 2. 对于page中使用相同的模板时，则只创建一份
// 3. 每个page的切换都触发draw回调
// 4. 在page中如果有VirtualList，在切回时会redrawVirtualList
VirtualTabCtrl = Class.extern(function(){
	this.setDrawCaller = function(caller){
		//caller.invoke(tabIdx, curTabItems)
	};
});

List = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_dom = null;
	var m_lists = [];
	var m_cols = [];
	var m_cnt = 0;
	var m_this = null;
	var m_itemclass = null;
	var m_clickCaller = null;
	var m_overCaller = null;
	var m_outCaller = null;
	var m_dbClkCaller = null;
	var m_selectIdx = -1;
	var m_tmpl = null;
	var m_extmpl = null;
	var m_scroller = null;
	var m_cancelFirstClick = false;
	var m_itemlevel = 0;
	var m_disableCanClick = false;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g, parent){
		m_g = g;
		if ( parent.tagName && parent.tagName.toLowerCase()=="div" ){
			m_dom = parent;
		}
		else if (parent.uiClass()=='Scroller'){
			m_dom = parent.getContainerObj();
			m_scroller = parent;
		}
		else{
			alert('parent invalid type');
			return;
		}
		m_itemclass = {sel:'',hot:'',normal:'',disable:''};
		m_this = this;
	};
	
	this.uiClass = function(){
		return 'List';
	};
	
	this.setItemTmpl = function(tmpl){
		m_itemclass = tmpl.itemclass;
		m_tmpl = tmpl;
	};
	
	this.setItemTmplEx = function(tmpl){
		m_itemclass = tmpl.c;
		m_extmpl = tmpl;
	};
	
	this.cancelFirstClick = function(cancel){
		m_cancelFirstClick = cancel;
	};
	
	this.setCols = function(itemclass,cols){
		m_itemclass = itemclass;
		m_cols = cols;
	};
	
	this.setCurSel = function(idx){
		_innerSelectItem(idx);
		_innerMouseClick(null,m_selectIdx);
	};
	
	this.getCurSel = function(){
		return m_selectIdx;
	};
	
	this.setItemCount = function(cnt) {
		_setItemCount(cnt);
	};
	
	/** 获得列表条目个数 */
	this.getCount = function(){
		return m_cnt;
	};
	
	/** 获得某条目 */
	this.getItem = function(idx){
		if ( idx >= 0 && idx < m_lists.length ){
			return m_lists[idx];
		}
		return null;
	};
	
	/** 设置回调 */
	this.setCaller = function(clickCaller, overCaller, outCaller, dbclkCaller){
		m_clickCaller = clickCaller;
		m_overCaller = overCaller;
		m_outCaller = outCaller;
		m_dbClkCaller = dbclkCaller;
	};
	
	/** 设置条目的内容 */
	this.setItem = function(index, colitems){
		var subs = m_lists[index].subs;
		for ( var i=0; i<colitems.length; ++i ) {
			var colitem = colitems[i];
			if ( !isNull(colitem.text) ) {
				TQ.setHtml(subs[i].item, colitem.text);
			}
			else if ( !isNull(colitem.icon) ) {
				IMG.setBKImage(subs[i].item, IMG.makeImg(colitem.icon));
			}
		}
	};
	
	this.enableItem = function(index, enable){
		if ( m_lists[index].enable != enable ) {
			m_lists[index].enable = enable;
			_setItemClassname(index, enable?'normal':'disable');
		}
	};
	
	this.isEnable = function(index){
		return m_lists[index].enable;
	};
	
	this.getSubItem = function(item,name){
		return item.exsubs[name];
	};
	
	this.scrollPos = function(y){
		if ( m_scroller ){
			m_scroller.scrollPos(y);
		}
	};
	
	this.refresh = function(){
		if ( m_scroller ){
			m_scroller.setScrollDomH(1000);
			m_scroller.refresh();
		}
	};
	
	this.getScroller = function(){
		return m_scroller;
	};
	
	this.getParent = function(){
		return m_dom;
	};
	
	this.setDisableCanClick = function(flag){
		m_disableCanClick = flag;
	};
	
	this.clickItem = function(e, idx){
		_innerMouseClick(e, idx);
	};
	
	this.dbclickItem = function(e, idx){
		if ( m_dbClkCaller ) {
			m_dbClkCaller.caller.call(m_dbClkCaller.self, e, idx);
		}
	};
	
	//--------------
	// private:method
	//--------------
	var _setItemCount = function(cnt) {
		for ( var i=m_lists.length; i<cnt; ++i ) {
			var item = TQ.createDom('div');
			TQ.append(m_dom, item);
			TQ.setClass(item, m_itemclass.normal);
			m_lists.push({item:item,exsubs:{},subs:[],enable:true});
			var litem = m_lists[m_lists.length-1];
			var subs = litem.subs;
			var exsubs = litem.exsubs;
			if ( m_tmpl ){// user manual create
				item.innerHTML = m_tmpl.xml;
				for ( var j=0; j<item.childNodes.length; ++j ){
					var subitem = item.childNodes[j];
					m_itemlevel = 0;
					_buildItems(i,item,subitem,subs,false);
				}
			}
			else if ( m_extmpl ){// ui editor create
				m_g.getGUI().buildDomItems(item,m_extmpl.cg,null,exsubs);
				for ( var j=0; j<item.childNodes.length; ++j ){
					var subitem = item.childNodes[j];
					m_itemlevel = 0;
					_buildItems(i,item,subitem,null,false);
				}
				if ( m_cancelFirstClick && (m_itemclass.hot != '' || m_itemclass.sel != '') ){	
					TQ.setClass(item, '');
					TQ.setClass(item.firstChild, '');
					TQ.setClass(item.firstChild.firstChild, m_itemclass.normal);
				}

				TQ.setCSS(item, 'position', 'relative');
				TQ.setCSS(item.firstChild, 'position', 'absolute');
				TQ.setCSS(item.firstChild, 'left', '0px');
				TQ.setCSS(item.firstChild, 'top', '0px');
			}
			else{// user manual create
				for ( var j=0; j<m_cols.length; ++j ) {
					var subitem = TQ.createDom('div');
					m_itemlevel = 0;
					_buildItems(i,item,subitem,subs,true);
				}
			}
		}
		
		for ( var i=0; i<cnt; ++i ) {
			var item = m_lists[i].item;
			TQ.setCSS(item, 'display', 'block');
		}
		
		for ( var i=cnt; i<m_lists.length; ++i ) {
			var item = m_lists[i].item;
			TQ.setCSS(item, 'display', 'none');
		}
		m_cnt = cnt;
		m_this.refresh();
	};
	
	/** 鼠标进入某个条目中 */
	var _innerMouseOver = function(index){
		if ( m_overCaller ) {
			m_overCaller.caller.call(m_overCaller.self, index);
		}
		
		if ( !m_lists[index].enable ){
			return;
		}
		
		var selcls = 'sel';
		if ( m_itemclass['sel'] == '' ){
			selcls = 'hot';
		}
		_setItemClassname(index, (m_selectIdx==index)?selcls:'hot');
	};
	
	/** 鼠标离开某个条目 */
	var _innerMouseOut = function(index){
		if ( m_outCaller ) {
			m_outCaller.caller.call(m_outCaller.self, index);
		}
		
		if ( !m_lists[index].enable ){
			return;
		}
		
		var selcls = 'sel';
		if ( m_itemclass['sel'] == '' ){
			selcls = 'normal';
		}
		_setItemClassname(index, (m_selectIdx==index)?selcls:'normal');
	};
	
	/** 设置条目的样式 */
	var _setItemClassname = function(index,cname){
		if ( index >=0 && index < m_lists.length ) {
			var listitem = m_lists[index];
			if ( m_cancelFirstClick 
				&& listitem.item.firstChild 
				&& listitem.item.firstChild.firstChild 
				&& m_itemclass[cname] != '' ){
				TQ.setClass(listitem.item.firstChild.firstChild, m_itemclass[cname]);
			}
			else{
				TQ.setClass(listitem.item, m_itemclass[cname]);
				if ( !m_tmpl && !m_extmpl ){
					for ( var i=0; i<listitem.subs.length; ++i ) {
						TQ.setClass(listitem.subs[i].item, m_cols[i][cname]);
					}
				}
			}
		}
	};
	
	/** 响应鼠标单击条目 */
	var _innerMouseClick = function(e,index){
		if ( m_clickCaller ) {
			m_clickCaller.caller.call(m_clickCaller.self, e, index);
		}
	};
	
	/** 内部选择 */
	var _innerSelectItem = function(selectidx){
		_setItemClassname(m_selectIdx, 'normal');
		m_selectIdx = parseInt(selectidx, 10);
		if ( m_selectIdx >= m_cnt ) {
			m_selectIdx = Math.max(0, m_cnt-1);
		}
		var selcls = 'sel';
		if ( m_itemclass['sel'] == '' ){
			selcls = 'hot';
		}
		_setItemClassname(m_selectIdx, selcls);
	};
	
	/** 递归创建item */
	var _buildItems = function(itemidx, parentdom, curdom, sublists, needAppend){
		if ( !curdom.tagName ){
			return;
		}
		m_itemlevel++;
		var tagName = m_dom.tagName.toLowerCase();
		if ( tagName == 'div' 
		    || tagName == 'input' 
		    || tagName == 'textarea' ){
			if ( needAppend ){
				parentdom.appendChild(curdom);
			}
			if ( sublists ){
				sublists.push({item:curdom,subs:[]});
			}
			
			curdom.setAttribute('itemidx', itemidx);
			if ( !m_tmpl && !m_extmpl ) {
				TQ.setClass(curdom, m_cols[sublists.length-1].normal);
			}
			
			if ( _isCanRegClickEvent() ){
				var _onTouchStart = function(e, touch, element){
					var me = TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element);
					TQ.stopPropagation(me);
					var idx = curdom.getAttribute('itemidx');
					if ( !m_lists[idx].enable ){
						if ( m_disableCanClick ){
							_innerMouseClick(me, idx);
						}
						return;
					}
					_innerSelectItem(idx);
					_innerMouseClick(me, m_selectIdx);
				};
				if ( isMobileBrowser() )  {
					TQ.captureTouchEvent(curdom, {self:m_this, touchStart:_onTouchStart});
				} 
				
				if (isPcBrowser()) {
					TQ.addEvent(curdom, 'dragstart', function(e){return false;});
					TQ.addEvent(curdom,'mouseover',function(e){
							if ( !e ) {
								e = window.event;
							}
							_innerMouseOver(parseInt(curdom.getAttribute('itemidx')));
						});
					TQ.addEvent(curdom,'mouseout',function(e){
							if ( !e ) {
								e = window.event;
							}
							_innerMouseOut(parseInt(curdom.getAttribute('itemidx')));
						});
					TQ.addEvent(curdom,'click',function(e){
							if ( !e ) {
								e = window.event;
							}
							TQ.stopPropagation(e);
							var idx = curdom.getAttribute('itemidx');
							if ( !m_lists[idx].enable ){
								if ( m_disableCanClick ){
									_innerMouseClick(e, idx);
								}
								return;
							}
							_innerSelectItem(idx);
							_innerMouseClick(e, m_selectIdx);
						});
					TQ.addEvent(curdom,'dblclick',function(e){
							if ( !e ) {
								e = window.event;
							}
							TQ.stopPropagation(e);
							if ( m_dbClkCaller ) {
								m_dbClkCaller.caller.call(m_dbClkCaller.self, e, m_selectIdx);
							}
						});
				}
			}
		
			var subsubs = null;
			if ( sublists ){
				subsubs = sublists[sublists.length-1].subs;
			}
			if ( curdom.childNodes ) {
				for ( var i=0; i<curdom.childNodes.length; ++i ){
					_buildItems(itemidx, curdom, curdom.childNodes[i], subsubs, needAppend);
				}
			}
		}
	};
	
	var _isCanRegClickEvent = function(){
		return (!m_cancelFirstClick || m_itemlevel >= 2);
	};
});

Tree = function(){
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_this = null;
	var m_root = null;
	var m_items = {};
	var m_lastkeyid = 0;
	var m_selectkeyid = -1;
	var m_caller = null;
	var m_scroller;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g, parent){
		m_g = g;
		m_this = this;
		var dom = null;
		if ( parent.tagName && parent.tagName.toLowerCase()=="div" ){
			dom = parent;
		}
		else if (parent.uiClass()=='Scroller'){
			dom = parent.getContainerObj();
			m_scroller = parent;
		}
		else{
			alert('parent invalid type');
			return;
		}
		m_root = {parent:null,container:null,titledom:null,subdom:dom,state:0,subs:[]};
		TQ.appendClass(m_root.subdom, 'ui-tree');
	};
	
	this.uiClass = function(){
		return 'Tree';
	};
	
	this.getRoot = function(){
		return m_root;
	};
	
	this.getItemChildren = function(item){
		return item.subs;
	};
	
	this.getItemFirstChild = function(item){
		if ( item.subs.length > 0 ){
			return item.subs[0];
		}
		return null;
	};
	
	this.setItemText = function(item, text){
		TQ.setHtml(item.titledom, text);
	};
	
	this.getItemText = function(item){
		return TQ.getTextEx(item.titledom);
	};
	
	this.append = function(parent, treeiteminfo){
		var newitem = _createTreeItem(parent, treeiteminfo);
		m_this.refresh();
		return newitem;
	};
	
	this.remove = function(treeitem){
		if ( treeitem ){
			if ( treeitem.keyid == m_selectkeyid ){
				m_selectkeyid = -1;
			}
			
			for ( var i=treeitem.subs.length-1; i>=0; --i ){
				var subtreeitem = treeitem.subs[i];
				m_this.remove(subtreeitem);
			}
			
			// delete dom node
			m_items[treeitem.keyid] = null;
			if ( TQ.find(treeitem.parent.subs, 'keyid', treeitem.keyid) ){
				TQ.removeElement(treeitem.parent.subs, TQ.getLastFindIdx());
			}
			TQ.remove(treeitem.parent.subdom, treeitem.container);
			TQ.deleteDom(treeitem.container);
			 treeitem.container = null;
		}
	};
	
	this.removeAll = function(){
		for ( var i=m_root.subs.length-1; i>=0; --i ){
			var sub = m_root.subs[i];
			m_this.remove(sub);
		}
		m_this.refresh();
	};
	
	this.getCurSel = function(){
		if ( m_selectkeyid >= 0 ){
			return m_items[m_selectkeyid];
		}
		return null;
	};
	
	this.setCurSel = function(item){
		_setCurSel(null, item);
		_expandItemToParent(item.parent);
		_resetScrollerByItem(item);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.scrollPos = function(y){
		if ( m_scroller ){
			m_scroller.scrollPos(y);
		}
	};
	
	this.refresh = function(){
		if ( m_scroller ){
			m_scroller.refresh();
		}
	};
	
	this.getScroller = function(){
		return m_scroller;
	};
	
	//--------------
	// private:method
	//--------------
	var _createTreeItem = function(parent, treeiteminfo){
		var container = TQ.createDom('div');
		var titledom = TQ.createDom('div');
		TQ.append(container, titledom);
		TQ.setClass(titledom, 'item-n');
		TQ.setClass(container, 'item-container');
		TQ.setHtml(titledom, treeiteminfo.text);
		if ( !parent.subdom ){
			parent.subdom = TQ.createDom('div');
			TQ.setClass(parent.subdom, 'item-sub');
			TQ.append(parent.container, parent.subdom);
		}
		TQ.append(parent.subdom, container);
		titledom.setAttribute('itemkey',m_lastkeyid);
		var userdata = null;
		if ( treeiteminfo.userdata ){
			userdata = treeiteminfo.userdata;
		}
		var state = 0;
		if ( treeiteminfo.state ){
			state = treeiteminfo.state;
		}
		var newitem = {parent:parent, container:container, keyid:m_lastkeyid, titledom:titledom, subdom:null, state:state, userdata:userdata, subs:[]};
		parent.subs.push(newitem);
		m_items[m_lastkeyid] = newitem;
		++m_lastkeyid;
		if (m_lastkeyid > 0x7fffffff){
			m_lastkeyid = 0;
		}
		
		// change parent title display
		if ( parent.titledom ){
			if ( parent.state == 0 ){
				TQ.removeClass(parent.titledom, 'item-expand item-collapse');
				TQ.appendClass(parent.titledom, 'item-expand');
				TQ.setCSS(parent.subdom, 'display', 'block');
			}
			else if ( parent.state == 1 ){
				TQ.removeClass(parent.titledom, 'item-expand item-collapse');
				TQ.appendClass(parent.titledom, 'item-collapse');
				TQ.setCSS(parent.subdom, 'display', 'none');
			}
		}
		
		//bind mouse event
		TQ.addEvent(titledom, 'dragstart', function(e){return false;});
		TQ.addEvent(titledom,'mouseover',function(e){
				e = e ? e : window.event;
				_innerMouseOver(titledom.getAttribute('itemkey'));
			});
		TQ.addEvent(titledom,'mouseout',function(e){
				e = e ? e : window.event;
				_innerMouseOut(titledom.getAttribute('itemkey'));
			});
		TQ.addEvent(titledom,'click',function(e){
				e = e ? e : window.event;
				TQ.stopPropagation(e);
				var curkeyid = titledom.getAttribute('itemkey');
				var curtreeitem = m_items[curkeyid];
				_setCurSel(e, curtreeitem);
				_innerMouseClick(e, curkeyid);
			});
		return newitem;		
	};
	
	var _setCurSel = function(e, item){
		var isLeaf = ( item && item.subs.length == 0 );
		if ( isLeaf ){
			_cancelSelect(m_selectkeyid);
			m_selectkeyid = item.keyid;
			_setItemClass(m_selectkeyid, 'item-p');
		}
		if ( m_caller != null ) {
			m_caller.caller.call(m_caller.self, e, item);
		}
	};
	
	var _expandItemToParent = function(item){
		while ( item ){
			if ( item.state == 1 ){
				_expandItem(item);
			}
			item = item.parent;
		}
	};
	
	var _cancelSelect = function(keyid){
		if ( keyid >= 0 ){
			_setItemClass(keyid, 'item-n');
		}
	};
	
	var _innerMouseOver = function(keyid){
		_setItemClass(keyid, (m_selectkeyid==keyid)?'item-p':'item-h');
	};
	
	/** 鼠标离开某个条目 */
	var _innerMouseOut = function(keyid){
		_setItemClass(keyid, (m_selectkeyid==keyid)?'item-p':'item-n');
	};
	
	var _setItemClass = function(keyid, classname){
		var treeitem = m_items[keyid];
		if ( treeitem ){
			TQ.removeClass(treeitem.titledom, 'item-h item-p item-n');
			TQ.appendClass(treeitem.titledom, classname);
		}
	};
	
	/** 响应鼠标单击条目 */
	var _innerMouseClick = function(e, keyid){
		var treeitem = m_items[keyid];
		if ( treeitem.state == 0 ){
			_collapseItem(treeitem);
		}
		else if ( treeitem.state == 1 ){
			_expandItem(treeitem);
		}
	};
	
	var _collapseItem = function(treeitem){
		if ( treeitem.subdom ){
			TQ.setCSS(treeitem.subdom, 'display', 'none');
			TQ.removeClass(treeitem.titledom, 'item-expand item-collapse');
			TQ.appendClass(treeitem.titledom, 'item-collapse');
			treeitem.state = 1;
			if ( m_scroller ){
				m_scroller.refresh();
			}
		}
	};
	
	var _expandItem = function(treeitem){
		if ( treeitem.subdom ){
			TQ.setCSS(treeitem.subdom, 'display', 'block');
			TQ.removeClass(treeitem.titledom, 'item-expand item-collapse');
			TQ.appendClass(treeitem.titledom, 'item-expand');
			treeitem.state = 0;
			if ( m_scroller ){
				m_scroller.refresh();
			}
		}
	};
	
	var _resetScrollerByItem = function(treeitem){
		if ( m_scroller && treeitem && treeitem.titledom ){
			var t = treeitem.titledom.offsetTop;
			var b = t + TQ.getDomHeight(treeitem.titledom);
			var scrollt = parseInt(m_root.subdom.style.top);
			scrollt = -scrollt;
			var scrolldom = m_scroller.getDom();
			var h = TQ.getDomHeight(scrolldom);
			//log('t='+t+',b='+b+',scrollt='+scrollt+',h='+h);
			var sy = scrollt;
			if ( t < scrollt ){
				sy = t;
			}
			if ( b > (scrollt+h) ){
				sy = b - h;
			}
			m_scroller.scrollPos(sy);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};