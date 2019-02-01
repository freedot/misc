/*******************************************************************************/
ChatPanelDlg = JBaseDlg.ex({
	_innerInit : function(){
		this._chatpanel = null;
	} 
	
	,_getDlgCfg : function(){
		/*need implement by sub class*/
		return {modal:true, title:rstr.chatPanelDlg.title, pos:{x:"center", y:"vcenter"}, uicfg:uicfg.chatpaneldlg};
	}
	
	,_afterCreate : function(){
		/*need implement by sub class*/
		this._chatpanel = new ChatPanel(this.g_, this.getItems().chatpanelcon);
	}
});
