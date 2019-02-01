//---------------------------------------
PopPanel = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_panel;
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,options){
		m_g = g;
		m_panel = TQ.createDom('div');
		TQ.append(TQ.getUiBody(), m_panel);
		//document.body.appendChild(m_panel);
		m_panel.className = "ui-panel";
		if ( options.className ) {
			TQ.appendClass(m_panel, options.className);
		}
		if ( options.width ) {
			TQ.setDomWidth(m_panel, options.width);
		}
		TQ.setDomHeight(m_panel, 'auto');
		var zindex = UI_ZORDER_POPPANEL;
		if ( options.zindex ) {
			zindex = options.zindex;
		}
		m_panel.style.zIndex = zindex;
	};
	
	/** 显示面板 */
	this.show = function(pos){
		var gbody = TQ.getUiBody();
		var gbodyoff = TQ.domOffset(gbody);
		TQ.setCSS(m_panel,'visibility','visible');
		TQ.setCSS(m_panel,'left',(pos.x - gbodyoff.left)+'px');
		TQ.setCSS(m_panel,'top',(pos.y - gbodyoff.top)+'px');
		m_g.getGUI().appendPopPanel(m_panel);
	};
	
	/** 隐藏面板 */
	this.hide = function(){
		TQ.setCSS(m_panel, 'visibility', 'hidden');
		m_g.getGUI().removePopPanel(m_panel);
	};
	
	this.isShow = function(){
		return TQ.curCSS(m_panel, 'visibility') != 'hidden';
	};
	
	/** 获得dom */
	this.getDom = function(){
		return m_panel;
	};
	
	/** 获得panel的宽度 */
	this.getWidth = function(){
		return TQ.getDomWidth(m_panel);
	};
	
	/** 获得panel的高度 */
	this.getHeight = function(){
		return TQ.getDomHeight(m_panel);
	};
	
	/** 添加子dom */
	this.appendChild = function(dom){
		m_panel.appendChild(dom);
	};
	
	//--------------
	// private:method
	//--------------
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};