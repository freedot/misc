/*******************************************************************************/
ClientCfgHandler = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
		this.helptips_ = [];
		this.g_.regEvent(EVT.NET, NETCMD.CLT_CFG, this, this._onSvrPkg);
	};
	
	this.getHelpTipTimes = function(tipId){
		var node = TQ.find(this.helptips_, 'id', tipId);
		if ( !node ) return 0;
		return node.times;
	};

	this._onSvrPkg = function(netevent){
		var pkg = netevent.data;
		if ( pkg.togglemap ) {
			TQ.dictCopy(this.g_.getImgr().getCltCfg().togglemap, pkg.togglemap);
			SoundMgr.playCurBackSound();
		}
		
		if ( pkg.gongGaoVer ) {
			this.g_.getImgr().getCltCfg().gongGaoVer = pkg.gongGaoVer;
			if (this._isNeedShowGongGao()) {
				UIM.openDlg('gonggao');
			}
		}
		
		if ( pkg.helptips ) {
			TQ.dictCopy(this.helptips_, pkg.helptips);
		}
	};
	
	this._isNeedShowGongGao = function(){
		if (!res_gonggao.autoshow) return false;
		return res_gonggao.ver > this.g_.getImgr().getCltCfg().gongGaoVer;
	};
});
