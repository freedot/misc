Menu = function(){

	//-----------
	//private:data
	//-----------
	var m_this;
	var m_menus;
	var m_menupanel;
	var m_menulist;
	var m_caller;
	var m_overcaller;
	var m_outcaller;
	var m_width;
	var m_noadjustw=false;
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g,options){
		m_this = this;
		m_menus = [];
		m_caller = null;
		if ( !options.className ) {
			options.className = 'menu_panel';
		}
		
		if ( !options.zindex ){
			options.zindex = UI_ZORDER_MENU;
		}
		
		if ( options.noadjustw ){
			m_noadjustw = options.noadjustw;
		}
		
		m_menupanel = new PopPanel(g,options);
		m_menulist = List.snew(g,m_menupanel.getDom());
		m_menulist.setCols({sel:'',hot:'itemhot',normal:'itemnor',disable:'itemdis'},
			[{sel:'',hot:'coliconhot',normal:'coliconnor',disable:'coliconnor'},
			 {sel:'',hot:'colnamehot',normal:'colnamenor',disable:'colnamedis'},
			 {sel:'',hot:'coliconhot',normal:'coliconnor',disable:'coliconnor'}]);
		m_menupanel.hide();
		m_menulist.setCaller({self:this,caller:_onClick},{self:this,caller:_onOver},{self:this,caller:_onOut});
		m_width = 90;
		if ( options.width ) m_width = options.width;
	};
	
	this.setClass = function(itemclass,cols){
		m_menulist.setCols(itemclass,cols);
	};
	
	/** 添加菜单条目 */
	this.addMenuItem = function(item){
		var idx = m_menulist.getCount();
		m_menulist.setItemCount(idx+1);
		var rightarrow = null;
		if ( item.submenu ){
			rightarrow = 'comm/submenu.gif';
		}
		m_menulist.setItem(idx,[{icon:item.icon},{text:item.text},{icon:rightarrow}]);
		var vitem = m_menulist.getItem(idx);
		_adjustItemWidth(vitem);
		m_menus.push({id:item.id, icon:item.icon, rightarrow:rightarrow, submenu:item.submenu, vitem:vitem, separator:(item.separator?true:false)});
		return vitem;
	};
	
	this.setItemText = function(id, text){
		var idx = _getItemIdxById(id);
		var item = m_menus[idx];
		m_menulist.setItem(idx,[{icon:item.icon},{text:text},{icon:item.rightarrow}]);
	};
	
	this.addSeparator = function(item){
		var vitem = this.addMenuItem({id:item.id, separator:true, icon:null, text:''});
		vitem.subs = [];
		TQ.setClass(vitem.item, 'splititem');
		return vitem;
	};
	
	/** 在制定位置显示菜单 */
	this.show = function(pos, mouseSize){
		var panelSize = {cx:m_menupanel.getWidth(), cy:m_menupanel.getHeight() };
		var adjustPos = TQ.getAdjustPosByWinSize(pos, panelSize, mouseSize);
		m_menupanel.show(adjustPos);
	};
	
	this.hide = function(){
		m_menupanel.hide();
	};
	
	this.isShow = function(){
		return m_menupanel.isShow();
	};
	
	/** 设置回调 */
	this.setCaller = function(caller, overcaller, outcaller){
		m_caller = caller;
		m_overcaller = overcaller;
		m_outcaller = outcaller;
	};
	
	/** 获得根部list */
	this.getRootList = function(){
		return m_menulist;
	};
	
	/** 显示一个条目 */
	this.showItem = function(id,show){
		_showItem(id,show);
	};
	
	this.enableItem = function(id, enable){
		_enableItem(id,enable);
	};
	
	this.isEnable = function(id){
		return _isEnable(id);
	};
	
	this.getCount = function(){
		return m_menulist.getCount();
	};
	
	this.getItem = function(idx){
		return m_menus[idx];
	};
	
	this.hideAllItem = function(){
		for ( var i=0, n=m_menulist.getCount(); i<n; ++i ){
			var item = m_menulist.getItem(i);
			TQ.setCSS(item.item,'display','none');
			TQ.setCSS(item.item,'heigth','0px');
		}
	};
	
	this.setDisableCanClick = function(flag){
		m_menulist.setDisableCanClick(flag);
	};
	
	this.clear = function(){
		for ( var i=0; i<m_menus.length; ++i ){
			var m = m_menus[i];
			if ( m.vitem && m.vitem.tipid != undefined ){
				TTIP.delTip(m.vitem.tipid);
			}
		}
		m_menus = [];
		m_menulist.setItemCount(0);
	};
	
	this.click = function(idx){
		_onClick(null, idx);
	};
	
	//--------------
	// private:method
	//--------------
	var _adjustItemWidth = function(vitem){
		if ( vitem && !m_noadjustw ){
			TQ.setDomWidth(vitem.item, m_width );
			var iSubWidth = m_width - TQ.getDomWidth(vitem.subs[0].item) - TQ.getDomWidth(vitem.subs[2].item);
			TQ.setDomWidth(vitem.subs[1].item, iSubWidth-4 );
		}
	};
		
	/** 响应列表单击事件 */
	var _onClick = function(e,idx){
		var menu = m_menus[idx];
		if ( m_caller && !menu.separator && !menu.submenu ){
			m_caller.caller.call(m_caller.self,menu.id);
		}
	};
	
	var _onOver = function(idx){
		var menu = m_menus[idx];
		if ( menu.submenu ){
			var off = TQ.domOffset(menu.vitem.item);
			menu.submenu.show({x:(off.left + TQ.getDomWidth(menu.vitem.item)), y:off.top}, 
				{cx: TQ.getDomWidth(menu.vitem.item), cy: TQ.getDomHeight(menu.vitem.item)});
			_hideSubMenus([idx]);
		}
		else{
			_hideSubMenus([]);
		}
		
		if ( m_overcaller ){
			m_overcaller.caller.call(m_overcaller.self,menu.id);
		}
	};
	
	var _onOut = function(idx){
		var menu = m_menus[idx];
		if ( m_overcaller ){
			m_outcaller.caller.call(m_outcaller.self,menu.id);
		}
	};
	
	var _hideSubMenus = function(fillteridxs){
		for ( var i=0; i<m_menus.length; ++i ){
			if ( TQ.find(fillteridxs, null, i) ) continue;
			if ( m_menus[i].submenu ){
				m_menus[i].submenu.hide();
			}
		}
	};
	
	var _showItem = function(id,show){
		var item = _getItemById(id);
		if ( item ){
			TQ.setCSS(item.item,'display',show?'block':'none');
			TQ.setCSS(item.item,'heigth','0px');
		}
	};
	
	var _enableItem = function(id, enable){
		var idx = _getItemIdxById(id);
		if ( idx >= 0 ){
			m_menulist.enableItem(idx, enable);
		}
	};
	
	var _isEnable = function(id){
		var idx = _getItemIdxById(id);
		if ( idx >= 0 ){
			return m_menulist.isEnable(idx);
		}
		return false;
	};
	
	var _getItemById = function(id){
		var idx = _getItemIdxById(id);
		if ( idx >= 0 ){
			return m_menulist.getItem(idx);
		}
		return null;
	};
	
	var _getItemIdxById = function(id){
		for ( var i=0; i<m_menulist.getCount(); ++i ){
			var mitem = m_menus[i];
			if ( mitem.id == id ){
				return i;
			}
		}
		return -1;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};