// 初始打开list时，会回调drawcaller
// 移动滚动条时，会回调drawcaller
// 调用redraw，会回调drawcaller
VirtualList = Class.extern(function(){
	this.init = function(g, parent){
		this._g = g;
		if ( parent.tagName && parent.tagName.toLowerCase()=="div" ){
			this._dom = parent;
		} else if (parent.uiClass()=='Scroller'){
			this._dom = parent.getContainerObj();
			this._scroller = parent;
		} else {
			alert('parent invalid type');
			return;
		}
		
		this._count = 0;
		this._canShowCount = 0;
		this._items = [];
		this._itemclass = {sel:'',hot:'',normal:'',disable:''};
		this._extmpl = null;
		this._selectIdx = -1;
	};
	
	this.uiClass = function(){
		return 'List';
	};

	this.setItemTmplEx = function(tmpl){
		this._itemclass = tmpl.c;
		this._extmpl = tmpl;
	};	
	
	this.cancelFirstClick = function(cancel){
		this._cancelFirstClick = cancel;
	};	
	
	this.setCurSel = function(idx){
		this._innerSelectItem(idx);
		this._innerMouseClick(null,m_selectIdx);
	};
	
	this.getCurSel = function(){
		return this._selectIdx;
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
});
