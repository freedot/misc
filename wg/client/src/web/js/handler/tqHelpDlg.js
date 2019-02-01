/******************************************************************************
******************************************************************************/
HelpDlg = BaseDlg.extern(function(){
	this._getDlgCfg = function(){
		return {modal:false, pos:{x:"center", y:30}, title:rstr.help.helpdlg.title, uicfg:uicfg.help.helpdlg};
	}; 
	
	this._afterCreate = function(){
		this._fillHelpTree();
	};
	
	this._setCallers = function(){
		this.items_.helptree.setCaller({self:this, caller:this._onClickTreeItem});
	};
	
	this._initInfo = function(){
		this.items_.helptree.scrollPos(0);
		this.selectNewComerHelp();
	};
	
	this._fillHelpTree = function(){
		this.items_.helptree.removeAll();
		var root = this.items_.helptree.getRoot();
		this._buildCatalog(root, res_helps.catalog);
	};
	
	this._buildCatalog = function(parenttreeitem,catalog){
		if ( !catalog ){
			return;
		}
		
		for ( var i=0, n=catalog.length; i<n; ++i ){
			var c = catalog[i];
			var treeitem = this.items_.helptree.append(parenttreeitem, {text:c.name, state:1, userdata:c.res});
			this._buildCatalog(treeitem, c.catalog);
		}
	};
	
	this.selectNewComerHelp = function(){
		var root = this.items_.helptree.getRoot();
		var newcomerHelp = this.items_.helptree.getItemFirstChild(root);
		this.items_.helptree.setCurSel(this.items_.helptree.getItemFirstChild(newcomerHelp));
	};
	
	this._onClickTreeItem = function(e, treeitem){
		if ( !treeitem.userdata ) return;
		if ( !treeitem.userdata.desc ) return;
		
		var nativeLink = ' ';
		if (treeitem.userdata.helpimg) {
			var link = TQ.format(rstr.newcomerHelp.imgLink, treeitem.userdata.helpimg);
			nativeLink += HyperLinkMgr.formatLink(link);
		}
		
		TQ.setHtml(this.items_.helpcon.getContainerObj(), treeitem.userdata.desc + nativeLink);
		this.items_.helpcon.refresh();
	};
});

/** 迷你帮助对话框 */
MiniHelpDlg = function(){
	//-----------
	//private:const
	//-----------

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_helpid;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.SHOWHELPBYID, 0, m_this, _onOpenHelpById);
	};
	
	/** 打开话框 */
	this.openDlg = function(helpid,pos){
		_initDlg();
		m_dlg.show(pos);
		m_helpid = parseInt(helpid,10);
		if ( isNaN(m_helpid) ){
			_setDirectHelpCon(helpid);//helpid is string
		}
		else{
			_setHelpCon();
		}
	};
	
	this.closeDlg = function(){
		if ( m_dlg ){
			m_dlg.hide();
		}
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
				pos:{x:0, y:0},
				uiback:uiback.dlg.minihelp,
				zIndex:UI_ZORDER_POPPANEL
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.help.minihelpdlg, m_items);
			m_items.closeBtn.setCaller({self:m_this, caller:_onClickCloseBtn});
			m_dlg.hide();
		}
	};
	
	var _onClickCloseBtn = function(id){
		m_dlg.hide();
	};

	var _onOpenHelpById = function(e){
		m_this.openDlg(e.helpid);
	};
	
	var _setDirectHelpCon = function(helpstr){
		TQ.setHtml(m_items.helpcon.getContainerObj(), helpstr);
		m_items.helpcon.refresh();
	};
	
	var _setHelpCon = function(){
		var res = ItemResUtil.findHelpRes(m_helpid);
		if ( res ){
			TQ.setHtml(m_items.title, res.name);
			TQ.setHtml(m_items.helpcon.getContainerObj(), res.desc);
			m_items.helpcon.refresh();
		}
	};
	
	//---------------------------------------
	this.init.apply(this, arguments);
};

