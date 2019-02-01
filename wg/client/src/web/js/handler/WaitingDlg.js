/*******************************************************************************/
WaitingDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.timer_ = null;
	} 
	
	,_getDlgCfg : function(){
		return {modal:true, width:350, pos:{x:"center", y:250}, uicfg:uicfg.waitingdlg, uiback:uiback.dlg.npc};
	}
	
	,_initInfo : function(){
		if ( !this.params_ ) {
			this.params_ = {tip:'', timeout:10, hideicon:false};
		}
		if (!this.params_.tip){
			this.params_.tip = '';
		}
		if (!this.params_.timeout){
			this.params_.timeout = 10;
		}
		if (!this.params_.hideicon){
			this.params_.hideicon = false;
		}
		TQ.setRichText(this.items_.tip, this.params_.tip);
		TQ.setCSS(this.items_.waiticon, 'display', this.params_.hideicon ? 'none' : 'block' );
		var this_l = this;
		if (this.timer_){
			window.clearTimeout(this.timer_);
			this.timer_ = null;
		}
		this.timer_ = window.setTimeout(function(){
			this_l.hideDlg();
			if ( this_l.params_.callback ) {
				this_l.params_.callback.invoke();
			}
			this_l.timer_ = null;
		}, this.params_.timeout*1000);
	}
});
