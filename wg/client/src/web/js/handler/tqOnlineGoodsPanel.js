/*******************************************************************************/
OnlineGoodsPanel = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.init = function(g, items){
		this.g_ = g;
		this.items_ = items;
		this.g_.regEvent(EVT.ACTIVITY_VAL, 0, this, this._onActivityValChange);
		this.items_.onlineGetGoods_btn.setCaller({self:this, caller:this._onClickGetBtn});
		TQ.fixIE6Png(this.items_.onlineGetGoods_icon);
		this._update();
	};
	
	this._onActivityValChange = function(){
		this._update();
	};
	
	this._onClickGetBtn = function(){
		ActivityValSender.sendGetOnlineGoods(this.g_);
	};
	
	this._update = function(){
		var actVal = this.g_.getImgr().getActivityVal();
		if ( actVal.onlineGoodsId > 0 && actVal.gotOnlineGoods == 0 ) {
			this._show();
		} else {
			this._hide();
		}
	};
	
	this._hide = function(){
		TQ.setCSS(this.items_.onlineGetGoods_panel, 'display', 'none');
	};
	
	this._show = function(){
		TQ.setCSS(this.items_.onlineGetGoods_panel, 'display', 'block');
	};
});
