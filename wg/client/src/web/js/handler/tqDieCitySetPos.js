/*******************************************************************************/
DieCitySetPos = BaseDlg.extern(function(){
	var C_RANDNAMEDELAY = 500;
	
	this._init = function(){
		this.g_.regEvent(EVT.NET, NETCMD.CREATEROLE, this, this._onSvrPkg);
	};
	
	this._getDlgCfg = function(){
		return {modal:true, title:null, uiback:uiback.dlg.npc, pos:{x:"center", y:40}, uicfg:uicfg.diecitysetpos};
	}; 
	
	this._setCallers = function(){
		this.items_.changePosBtn.setCaller({self:this, caller:this._onClickChangePos});
		this.items_.confirmBtn.setCaller({self:this, caller:this._onClickConfirm});
	};	
	
	this._afterCreate = function(){
		this.items_.changePosBtn.setType(BTN_TYPE.DELAY);
		this.items_.changePosBtn.setDelay(C_RANDNAMEDELAY);
		this.items_.confirmBtn.setType(BTN_TYPE.DELAY);
		this.items_.confirmBtn.setDelay(C_RANDNAMEDELAY);
	};
	
	this._initInfo = function(){
		this.pos_ = this.params_;
		TQ.setTextEx(this.items_.title, rstr.dieCitySetPos.title);
		TQ.setTextEx(this.items_.pos_x, this.pos_.x);
		TQ.setTextEx(this.items_.pos_y, this.pos_.y);
	};
	
	this._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (netdata.subid == 3) {
			if (this.dlg_) this.dlg_.hide();
			UIM.getDlg('tipmsgbox').openDlg(rstr.dieCitySetPos.lbl.hasNoPos);
		} else if ( netdata.subid == 4 ) {
			this.openDlg(netdata.pos);
		} else if ( netdata.subid == 5) {
			if (this.dlg_) this.dlg_.hide();
		} else if ( netdata.subid == 6) { // city died
			UIM.getDlg('actterraceexped').reset();
			UIM.getDlg('acttowerexped').reset();			
		}
	};
	
	this._onClickChangePos = function(){
		CreateRoleSender.sendGetRandPos(this.g_);
	};
	
	this._onClickConfirm = function(){
		CreateRoleSender.sendSetPos(this.g_, this.pos_);
	};
});
