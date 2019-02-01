/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
TabPanel = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_dom;
	var m_tabIdx;
	var m_this;
	var m_caller;
	var m_tabs;
	var m_ops = {};
	var m_tabcnt=0;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g, dom, ops){
		m_g = g;
		m_dom = dom;
		m_tabIdx = -1;
		m_tabcnt = 0;
		m_this = this;
		m_tabs = [];
		m_caller = null;
		if ( ops ){
			m_ops = ops;
		}
		if ( !m_ops.tabuiback ){
			m_ops.tabuiback = uiback.btn.tabbtn;
		}
	};
	
	this.hideTabCtrl = function(){
		TQ.hideElem(m_dom);
	};
	
	/** 添加tab */
	this.addTab = function(text,panel,items){
		var tab = new ComButton(m_g, m_dom, {uiback:m_ops.tabuiback});
		tab.setText(text);
		tab.setId(m_tabs.length);
		tab.setCaller({self:m_this, caller:m_this.activeTab});
		tab.setType(BTN_TYPE.CHECK);
		if ( isNull(panel) ) {
			panel = null;
		}
		if ( !items ) {
			items = {};
		}
		m_tabs.push({tab:tab,panel:panel,items:items});
		m_tabcnt++;
	};
	
	this.showTab = function(idx, show){
		var node = m_tabs[idx];
		node.tab[show?'show':'hide']();
	};
	
	this.setTabPage = function(idx,text,panel,items){
		while ( idx >= m_tabs.length ){
			this.addTab('', null);
		}
		if ( !items ) {
			items = {};
		}
		var node = m_tabs[idx];
		node.tab.setText(text);
		node.panel = panel;
		node.items = items;
	};
	
	this.setTabText = function(idx, text){
		var node = _getTabNode(idx);
		if ( !node ) return;
		node.tab.setText(text);
	};
	
	this.getTabText = function(idx){
		var node = _getTabNode(idx);
		if ( !node ) return '';
		return node.tab.getText();
	};
	
	this.getTabBtn = function(idx){
		var node = _getTabNode(idx);
		if ( !node ) return null;
		return node.tab;
	};
	
	/** 获得指定索引的tabcontainer中dom的items 
	 * @param (int) idx 
	 */
	this.getTabItems = function(idx){
		var node = _getTabNode(idx);
		if ( !node ) return null;
		return node.items;
	};
	
	this.getTabPanel = function(idx){
		var node = _getTabNode(idx);
		if ( !node ) return null;
		return node.panel;
	};
	
	this.getTabParent = function(){
		var node = _getTabNode(0);
		if ( !node ) return null;
		return node.panel.parentNode;
	};
	
	/** 设置回调 */
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 激活某个索引的tab */
	this.activeTab = function(index){
		var tab = m_tabs[index];
		if ( !tab.tab.isShow() ) return;
		m_tabIdx = index;
		for ( var i in m_tabs ) {
			var tab = m_tabs[i];
			var ispress = (i == m_tabIdx);
			tab.tab.setPress(ispress);
			if ( tab.panel ){
				TQ.setCSS(tab.panel, 'visibility', ispress?'visible':'hidden');
			}
		}
		if ( m_caller != null ) {
			m_caller.caller.call(m_caller.self, m_tabIdx);
		}
	};
	
	/** 获得当前被激活的tab序号 */
	this.getActiveTab = function() {
		return m_tabIdx;
	};
	
	/** 设置tab页签的个数 */
	this.setTabCount = function(cnt){
		m_tabcnt = cnt;
		if ( cnt <= m_tabs.length ){
			for ( var i=0; i<cnt; ++i ){
				var node = m_tabs[i];
				node.tab.show();
			}
			for ( var i=cnt; i<m_tabs.length; ++i ){
				var node = m_tabs[i];
				node.tab.hide();
			}
		}
		else{
			this.setTabPage(cnt-1, '..', null, []);
			for ( var i=0; i<m_tabs.length; ++i ){
				var node = m_tabs[i];
				node.tab.hide();
			}
		}
	};
	
	this.getTabCount = function(){
		return m_tabcnt;
	};
	
	this.uiClass = function(){
		return 'TabPanel';
	};
	
	//--------------
	// private:method
	//--------------	
	var _getTabNode = function(idx){
		if ( idx >= 0 && idx < m_tabs.length ){
			return m_tabs[idx];
		}
		return null;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};