/*******************************************************************************/
NpcDlg = JBaseDlg.ex({
	_getDlgCfg : function(){
		return {modal:true, pos:{x:"center", y:"vcenter"}, uiback:uiback.dlg.noborder, uicfg:uicfg.npcdlg};
	}
	
	,_afterCreate : function(){
		this.bak_ = this.g_.getGUI().createPanelUIBack(this.items_.conbk, uiback.dlg.npc, false);
	}
	
	,_setCallers : function(){
		this.items_.opslist.setCaller({self:this, caller:this._onSelectOption});
	}
	
	,_initInfo : function(){
		this._initDesc();
		this._initOpsList();
		this._resetDescHeight();
		this._resetOpsBarPosition();
		this._resetBakSize();
	}
	
	,_initDesc : function(){
		TQ.setRichText(this.items_.desc, this.params_.desc);
	}
	
	,_initOpsList : function(){
		if ( !this.params_.ops ) {
			this.items_.opslist.setItemCount(0);
			return;
		}
		
		this.items_.opslist.setItemCount(this.params_.ops.length);
		for ( var i=0; i<this.items_.opslist.getCount(); ++i ) {
			var item = this.items_.opslist.getItem(i);
			TQ.setRichText(item.exsubs.name, this.params_.ops[i]);
		}
	}
	
	,_resetDescHeight : function(){
		TQ.setCSS(this.items_.desc, 'height', 'auto');
	}
	
	,_resetOpsBarPosition : function(){
		var bottomSpace = 10;
		var descTop = TQ.getDomPos(this.items_.desc).y;
		var opbarTop = descTop + this.items_.desc.offsetHeight + bottomSpace;
		TQ.setCSS(this.items_.opslist.getParent(), 'top', opbarTop + 'px' );
		TQ.setCSS(this.items_.opslist.getParent(), 'height', this._getOpsBarHeight() + 'px' );
	}
	
	,_resetBakSize : function(){
		var bottomSpace = 40;
		var opbarTop = TQ.getDomPos(this.items_.opslist.getParent()).y;
		var bkH = opbarTop + this._getOpsBarHeight() + bottomSpace;
		TQ.setCSS(this.items_.conbk, 'height', bkH + 'px');
		var size = TQ.getDomSize(this.items_.conbk);
		this.g_.getGUI().setUIBack(this.bak_, size.cx, size.cy, uiback.dlg.npc.type);
	}
	
	,_getOpsBarHeight : function(){
		var count = this.items_.opslist.getCount();
		return Math.floor((count+2)/3)*50;
	}
	
	,_onSelectOption : function(e, idx){
		if ( this.params_.caller ) {
			this.params_.caller.invoke(idx);
		}
		this.hideDlg();
	}
});
