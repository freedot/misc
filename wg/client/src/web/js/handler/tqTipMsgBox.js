/*******************************************************************************/
TipMsgBox = BaseDlg.extern(function(){
	this._getDlgCfg = function(){
		return {modal:true, title:null, uiback:uiback.dlg.npc, pos:{x:"center", y:40}, uicfg:uicfg.comm.tipmsgbox};
	}; 
	
	this._initInfo = function(){
		var msg = this.params_;
		TQ.setTextEx(this.items_.msg, msg);
	};
});
