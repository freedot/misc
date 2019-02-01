/*******************************************************************************/
BuyGoldDlg = BaseDlg.extern(function(){
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.buyGoldDlg.title, pos:{x:"center", y:70}, uicfg:uicfg.buyGoldDlg};
	}; 
	
	this._setCallers = function(){
		this.items_.see.setCaller({self:this, caller:this._onClickSee});
		this.items_.shop.setCaller({self:this, caller:this._onClickShop});
	};
	
	this._initInfo = function(){
		this._updateItemList();
		this._updateGuangGao();
	};
	
	this._updateItemList = function(){
		var ids = [FIXID.GOLD_1, FIXID.GOLD_2, FIXID.GOLD_3, FIXID.GOLD_4];
		this.items_.list.setItemCount(ids.length);
		for ( var i=0; i<ids.length; ++i ) {
			var item = this.items_.list.getItem(i);
			var res = ItemResUtil.findItemres(ids[i]);
			CommDrawItem.drawItemIconAndName(item.exsubs.icon, item.exsubs.name, res);
			item.exsubs.buy.setId(res.id);
			item.exsubs.buy.setCaller({self:this, caller:this._onClickBuy});
			item.exsubs.buy.setType(BTN_TYPE.DELAY);
		}
	};
	
	this._updateGuangGao = function(){
		var plats = {
			'qzone' : 'buygold/yd.gif'
			,'3366' : 'buygold/bd.gif'
		};
		if ( plats[g_platform] ) IMG.setBKImage(this.items_.guanggao, IMG.makeImg(plats[g_platform]) );
	};
	
	this._onClickBuy = function(resid){
		ShopSender.sendBuyGold(this.g_, resid, 1);
	};
	
	this._onClickSee = function(){
		UIM.getDlg('task').openDlg();
		UIM.getDlg('task').selectTask('activity', this._getActPayTaskIdx());
	};
	
	this._onClickShop = function(){
		UIM.openDlg('shop', 0);
	};
	
	this._getActPayTaskIdx = function(){
		TQ.find(this.g_.getImgr().getTask().actives, 'id', FIXID.FIRST_PAYGOLD);
		return TQ.getLastFindIdx();
	};
});
