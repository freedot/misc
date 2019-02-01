/*******************************************************************************/
GongGaoDlg = JBaseDlg.ex({
	_innerInit : function(){
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.gonggaodlg.title, pos:{x:"center", y:90}, uicfg:uicfg.gonggaodlg};
	}

	,_initInfo : function(){
		this._update();
		ClientCfgSender.sendGongGaoVer(this.g_);
	}	
	
	,_update : function(){
		TQ.setRichText(this.items_.desc.getContainerObj(), res_gonggao.desc);
		this.items_.desc.refresh();
	}
});