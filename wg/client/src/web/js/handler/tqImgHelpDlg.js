/*******************************************************************************/
ImgHelpDlg = BaseDlg.extern(function(){
	this.BTN_RIGHT_MARGIN = 175;
	this.imgId_ = 0;
	this.resize = function(size){
		if (!this.isShow()) return;
		this._resizeDlg(size);
		this._resetposBtn(size);
	};
	
	this._getDlgCfg = function(){
		return {modal:true, pos:{x:0, y:0}, uiback:uiback.dlg.noborder2, uicfg:uicfg.ImgHelpDlg};
	}; 
	
	this._setCallers = function(){
		this.items_.closeBtn.setCaller({self:this, caller:this._onClickClose});
		this.items_.replayBtn.setCaller({self:this, caller:this._onClickReplay});
	};	
	
	this._initInfo = function(){
		this.resize(this.g_.getWinSizer().getCurSize());
		this.imgId_ = this.params_;
		this._replay();
	};
	
	this._onClickClose = function(){
		this.hideDlg();
	};
	
	this._onClickReplay = function(){
		this._replay();
	};
	
	this._replay = function(){
		IMG.setBKImage(this.items_.img, '');
		this.g_.regUpdater(this, this._setImg, 10);
	};
	
	this._resizeDlg = function(size){
		var condom = this.dlg_.getConDom();
		TQ.setDomSize(condom.parentNode, size.cx, size.cy);
		TQ.setDomSize(condom, size.cx, size.cy);
		TQ.setDomSize(condom.firstChild, size.cx, size.cy);
		TQ.setDomSize(this.items_.img, size.cx, size.cy);
		this.dlg_.refreshBack();
	};
	
	this._resetposBtn = function(size){
		TQ.setCSS(this.items_.btnArea, 'left', (size.cx - this.BTN_RIGHT_MARGIN) + 'px' );
	};
	
	this._setImg = function(){
		IMG.setBKImage(this.items_.img, IMG.makeHelpImg(this.imgId_));
		this.g_.unregUpdater(this, this._setImg);
	};
});