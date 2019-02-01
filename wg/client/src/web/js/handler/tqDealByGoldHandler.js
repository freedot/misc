/*******************************************************************************/
DealByGoldHandler = Class.extern(function(){
	this._g = null;
	var m_this = null;
	this.init = function(g){
		this._g = g;
		m_this = this;
		this._g.regEvent(EVT.NET, NETCMD.START_BuyByGold, this, this._onSvrPkg);
	};
	
	this._onSvrPkg = function(netevt){
		if (g_platform == 'pengyou' || g_platform == 'qzone') {
			fusion2.dialog.buy({
				//disturb : true
				param: netevt.data.url_params
				//,sandbox: true
				,context: ''
				,onSuccess : function(opt){ m_this._onSuccess(opt); }
				,onCancel : function(opt){ m_this._onCancel(opt); }
				,onSend : function(opt){ m_this._onSend(opt); }
				,onClose : function(opt){ m_this._onClose(opt); }
			});
		} else if (g_platform == '3366') {
			Open3366API.Pay.show(g_appid
				,netevt.data.url_params
				,0
				,rstr.blue3366DiamondDlg.buyGold
				,this._onClose 
				,this._onSuccess 
				,0
				,true);
		}
	};
	
	this._onSuccess = function(opt){
		DealGoldSender.sendResultSucc(this._g);
		log(' ... buy : onsuccess');
	};
	
	this._onCancel = function(opt){
		DealGoldSender.sendResultCancel(this._g);
		log(' ... buy : oncancel');
	};
	
	this._onSend = function(opt){
		log(' ... buy : onsend');
	};
	
	this._onClose = function(opt){
		log(' ... buy : onclose');
	};
});
