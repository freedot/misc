/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
DropList = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_parent;
	var m_panel;
	var m_list;
	var m_title;
	var m_width=90;
	var m_caller;
	var m_id=0;

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g, parent, ops){
		m_g = g;
		m_this = this;
		m_parent = parent;
		var title = TQ.createDom('div');
		TQ.append(m_parent, title);
		TQ.setClass(title, 'ui-droplist');

		m_title = new ComButton(m_g,title,{uiback:uiback.btn.droptitle});
		m_title.setText('--');

		var arrowbtn = new ComButton(m_g,title,{uiback:uiback.btn.droparraw});
		m_title.setCaller({self:m_this,caller:_onTitleClick});
		arrowbtn.setCaller({self:m_this,caller:_onTitleClick});
		
		if ( ops.width ) {
			m_width = ops.width;
		}
		ops.className = 'menu_panel';
		ops.zindex = UI_ZORDER_MENU;
		m_panel = new PopPanel(m_g,ops);
		m_panel.hide();
		m_list = List.snew(g,m_panel.getDom());
		m_list.setCols({sel:'dropitemsel',hot:'dropitemhot',normal:'dropitemnor'},
			[{sel:'dropnamehot',hot:'dropnamehot',normal:'dropnamenor'}]);
		m_list.setCaller({self:m_this,caller:_onListClick});
	};
	
	/** 添加一个item */
	this.addItem = function(item){
		var idx = m_list.getCount();
		m_list.setItemCount(idx+1);
		m_list.setItem(idx,[{text:item.text}]);
		var vitem = m_list.getItem(idx);
		if ( vitem ){
			TQ.setDomWidth(vitem.item, m_width );
			TQ.setDomHeight(vitem.item, TQ.getDomHeight(vitem.subs[0].item) );
			TQ.setDomWidth(vitem.subs[0].item, m_width );
		}
	};
	
	this.deleteAllItem = function(){
		m_list.setItemCount(0);
	};
	
	this.setCurSel = function(idx){
		m_list.setCurSel(idx);
	};
	
	this.getCurSel = function(){
		return m_list.getCurSel();
	};
	
	this.getCount = function(){
		return m_list.getCount();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.setTitle = function(title){
		m_title.setText(title);
	};
	
	this.getTitle = function() {
		return m_title.getText();
	};
	
	this.getTitleDom = function(){
		return m_title.getDom();
	};
	
	this.setId = function(id){
		m_id = id;
	};
	
	this.getItemText = function(idx){
		var item = m_list.getItem(idx);
		if ( !item ) return '';
		
		return item.subs[0].item.innerHTML;
	};
	
	//--------------
	// private:method
	//--------------
	var _onTitleClick = function(id,e){
		var dom = m_title.getDom();
		var off = TQ.domOffset(dom);
		m_panel.show({x:off.left,y:off.top+TQ.getDomHeight(dom)});
	};
	
	var _onListClick = function(e,idx){
		var item = m_list.getItem(idx);
		if ( item ){
			m_title.setText(item.subs[0].item.innerHTML);
		}
		if ( m_caller ){
			m_caller.caller.call(m_caller.self,e,idx,m_id);
		}
		m_panel.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};