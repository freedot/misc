/*******************************************************************************/
NewcomerHelper = BaseDlg.extern(function(){
	this.C_MINBTN_RT_ = [750, 485, 32, 32];
	this.C_DLG_W_ = 437;
	this.C_DLG_H_ = 166;
	this.C_BTN_W_ = 32;
	this.C_BTN_H_ = 32;
	this.lastPos_ = {x:0, y:0};
	this.caches_ = [];
	this.curId_ = -1;
	this.isOpened_ = false;
	if ( TQ.isMobile() ) {
		this.C_MINBTN_RT_ = [750, 485, 50, 50];
		this.C_BTN_W_ = 50;
		this.C_BTN_H_ = 50;
	}
	
	this.handleCaches = function(){
		for ( var i=0; i<this.caches_.length; ++i ) {
			this._onSvrPkg(this.caches_[i]);
		}
	};
	
	this.getCurId = function(){
		return this.curId_;
	};
	
	this.setPosition = function(pos){
		this._savePosition(pos);
		this._setDlgPosition();
		this._setSpiritDomPosition();
	};
	
	this._savePosition = function(pos){
		this.lastPos_ = pos;
	};
	
	this._setDlgPosition = function(){
		if ( !this.isShow() ) return;
		var x = this.lastPos_.x + this.C_BTN_W_ - this.C_DLG_W_;
		var y = this.lastPos_.y + this.C_BTN_H_ - this.C_DLG_H_;
		this.dlg_.setPosition({x:x, y:y});
	};
	
	this._setSpiritDomPosition = function(){
		if ( !this.items_.spiritDom ) return;
		TQ.setDomPos(this.items_.spiritDom, this.lastPos_.x, this.lastPos_.y);
	};	

	this._init = function(){
		this._regEvents();
		this._createSpiritMiniBtn();
	};
		
	this._getDlgCfg = function(){
		return {modal:false, pos:{x:"center", y:0}, uiback:uiback.dlg.noborder, uicfg:uicfg.help.NewcomerHelper};
	};
		
	this._afterCreate = function(){
		TQ.fixIE6Png(this.items_.bak);
		TQ.fixIE6Png(this.items_.subbak);
	};
		
	this._setCallers = function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
		this.items_.closeBtn.setCaller({self:this, caller:this._onClickClose});
		this.items_.seeAllHelp.setCaller({self:this, caller:this._onClickAllHelp});
	};
		
	this._initInfo = function(){
		this.items_.spiritBtn.hide();
		this._setDlgPosition();
		this.isOpened_ = true;
	};
	
	this._regEvents = function(){
		this.g_.regEvent(EVT.NET, NETCMD.NEWCOMERHELP, this, this._onSvrPkg);
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
	};
	
	this._createSpiritMiniBtn = function(){
		var uibody = TQ.getUiBody();
		this.items_.spiritDom = TQ.createDom('div');
		TQ.append(uibody, this.items_.spiritDom);
		TQ.setCSS(this.items_.spiritDom, 'position', 'absolute');
		TQ.setCSS(this.items_.spiritDom, 'zIndex', '1000');
		TQ.setDomRect(this.items_.spiritDom, this.C_MINBTN_RT_[0], this.C_MINBTN_RT_[1], this.C_MINBTN_RT_[2], this.C_MINBTN_RT_[3]);
		var btn_uiback = uiback.btn.helpspirit;
		if ( TQ.isMobile() ) btn_uiback = uiback.mb.btn12_helpspirit;
		this.items_.spiritBtn = new ComButton(this.g_, this.items_.spiritDom, {uiback:btn_uiback});
		this.items_.spiritBtn.setCaller({self:this,caller:this._onClickOpen});
		TTIP.addTip(this.items_.spiritDom, rstr.newcomerHelp.tip.spiritBtn );
	};
	
	this._isOpened = function(){
		return this.isOpened_;
	};
	
	this._updateByCurTask = function(id){
		this.curId_ = id;
		var res = ItemResUtil.findTaskRes(id);
		if ( !res ) {
			TQ.setRichText(this.items_.con, '');
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
			return;
		}
		
		var nativeLink = '';
		if (res.helpimg) {
			var link = TQ.format(rstr.newcomerHelp.imgLink, res.helpimg);
			nativeLink = HyperLinkMgr.formatLink(link);
		}
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		TQ.setRichText(this.items_.con, res.desc + nativeLink);
	};
	
	this._updateByRandTip = function(){
		var idx = Math.randomInt(res_tip_helps.length);
		var btnS = '<div class=changetipbtn id=new_comer_helper_tip>' + rstr.newcomerHelp.btn.everydayTip + '</div>';
		TQ.setRichText(this.items_.con, rstr.newcomerHelp.lbl.everydayTip + res_tip_helps[idx].desc + btnS);
		var btn = TQ.getDomById('new_comer_helper_tip');
		var this_l = this;
		TQ.addEvent(btn,'click',function(e){
			this_l._updateByRandTip();
		});
	};
	
	this._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			this.items_.spiritBtn.show();
		}
	};
	
	this._onClickOpen = function(){
		this.openDlg();
	};
	
	this._onClickClose = function(){
		this.hideDlg();
	};
	
	this._onClickAllHelp = function(){
		UIM.getDlg('help').openDlg();
	};
	
	this._onLoginOk = function(){
		NewcomerHelpSender.sendGetCurNode(this.g_);
	};
	
	this._onSvrPkg = function(netevent){
		if (!netevent.data.newhelp) return;
		
		if ( this.g_.getState() != GSTATE.INGAME ) {
			this.caches_.push(netevent);
			return;
		}
		
		if (!this._isOpened()){
			this.openDlg();
			this.hideDlg();
		}
		
		this._updateByCurTask(netevent.data.newhelp.id);
		if ( netevent.data.newhelp.id == 0 ) {
			this._updateByRandTip();
		}
	};
});

