/*******************************************************************************/
NoBindPkgClassifyItems = BaseClassifyItems.ex({
	_initClassItems : function(){
		this.classitems_ = [
			{classid:RES_CLS.PKGITEM,items:[]}
			,{classid:RES_CLS.EQUIPITEM,items:[]}
			,{classid:RES_CLS.CANUSEITEM,items:[]}
			,{classid:RES_CLS.OTHERITEM,items:[]}];
	}
	
	,_getItems : function(){
		return this.g_.getImgr().getPkgs().items;
	}
	
	,_isSatisfiedBy : function(ci, item) { 
		return this._isInRange(ci, item) && (!item.isBind) && (!item.itemres.isbind);
	}
	
	,_sortFun : function(a, b){
		return a.resid - b.resid;
	}
});

AlliMySellDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.curSelItemId_ = -1;
		this.itemsClassify_ = NoBindPkgClassifyItems.snew(this.g_);
		this.g_.regEvent(EVT.PKG_CHANGE, 0, this, this._onItemsChange);
		this.g_.regEvent(EVT.SELLING_ITEMS, 0, this, this._onSellingItems);
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.alli.myselldlg.title, pos:{x:"center", y:40}, uicfg:uicfg.alli.myselldlg};
	}
	
	,_setCallers : function(){
		for (var i=0; i<this.items_.pkgTabs.getTabCount(); ++i ) {
			var list = this.items_.pkgTabs.getTabItems(i).list;
			list.setCaller({self:this, caller:this._onSelectItem});
		}
		this.items_.inumber.setLimitCaller({self:this, caller:this._onGetNumberLimit});
		this.items_.sellBtn.setCaller({self:this, caller:this._onClickSellBtn});
	}
	
	,_afterCreate : function(){
		this._setTabsText();
	}

	,_initInfo : function(){
		AllianceSender.sendGetSellItems(this.g_);
		this.items_.pkgTabs.activeTab(0);
		this._updatePkgTabList();
		this._updateCurSelItem();
		this._updateSellingItems();
	}	
	
	,_setTabsText : function(){
		for ( var i=0; i<rstr.alli.myselldlg.tabs.length; ++i ) {
			this.items_.pkgTabs.setTabText(i, rstr.alli.myselldlg.tabs[i]);
		}
	}
	
	,_updatePkgTabList : function(){
		if (!this.isShow()) return;
		
		this.itemsClassify_.refresh();
		
		for ( var tabIdx=0; tabIdx<this.items_.pkgTabs.getTabCount(); ++tabIdx ) {
			var list  = this.items_.pkgTabs.getTabItems(tabIdx).list;
			var items = this.itemsClassify_.getClassItems(tabIdx).items;
			list.setItemCount(items.length);
			for ( var listIdx=0; listIdx<list.getCount(); ++listIdx ) {
				var item = list.getItem(listIdx);
				var ritem = items[listIdx];
				CommDrawItem.drawIconAndNumber(item, ritem, true);
				TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetTooltip},{tabIdx:tabIdx,listIdx:listIdx});
			}
		}
	}
	
	,_updateCurSelItem : function(){
		if (!this.isShow()) return;
		
		var curItem = this.imgr_.getItemById(this.curSelItemId_);
		if ( !curItem ) {
			this._clearCurSelItem();
			return;
		}
		CommDrawItem.drawItemIcon(this.items_.icon, curItem.itemres);
		TQ.setRichText(this.items_.num, curItem.number);
		TQ.setRichText(this.items_.itemDesc, curItem.itemres.desc);
	}
	
	,_updateSellingItems : function(){
		if (!this.isShow()) return;
		
		var sellingItems = this.imgr_.getSellingItems();
		this.items_.sellingList.setItemCount(sellingItems.length);
		for ( var i=0; i<this.items_.sellingList.getCount(); ++i ) {
			var item = this.items_.sellingList.getItem(i);
			var ritem = sellingItems[i];
			CommDrawItem.drawIconAndNumber(item, ritem, true);
			TQ.setRichText(item.exsubs.curPrice, ritem.cur);
			TQ.setRichText(item.exsubs.fixedPrice, ritem.fixed);
			TQ.setRichText(item.exsubs.state, rstr.alli.myselldlg.lbl.auctionStates[this._getSellingItemState(ritem)]);
			var leftTime = ritem.stopTime - this.g_.getSvrTimeS();
			TQ.setRichText(item.exsubs.leftTime, AlliAuctionLeftTimeState.getLeftTimeState(this.g_, ritem.stopTime));
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetSellingItemTooltip},{idx:i});
			item.exsubs.cancelBtn.enable(this._getSellingItemState(ritem) == 0);
			item.exsubs.cancelBtn.setId(i);
			item.exsubs.cancelBtn.setCaller({self:this, caller:this._onClickCancelSellBtn});
		}
	}
	
	,_clearCurSelItem : function(){
		IMG.setBKImage(this.items_.icon, '');
		TQ.setClass(this.items_.icon, '');
		TQ.setRichText(this.items_.num, '');
		TQ.setRichText(this.items_.itemDesc, '');
		this.items_.iauctionPrice.setVal(0);
		this.items_.ifixedPrice.setVal(0);
	}
	
	,_onGetTooltip : function(data){
		var item = this.itemsClassify_.getItem(data.tabIdx, data.listIdx);
		return TIPM.getItemDesc(item);
	}
	
	,_onGetSellingItemTooltip: function(data){
		var sellingItems = this.imgr_.getSellingItems();
		var item = sellingItems[data.idx];
		return TIPM.getItemDesc(item, 'sys');
	}
	
	,_onSelectItem : function(e, idx){
		var tabIdx = this.items_.pkgTabs.getActiveTab();
		this.curSelItemId_ = this.itemsClassify_.getItem(tabIdx, idx).id;
		this.items_.inumber.setVal(1);
		this._clearCurSelItem();
		this._updateCurSelItem();
	}
	
	,_onGetNumberLimit : function(){
		var curItem = this.imgr_.getItemById(this.curSelItemId_);
		if ( !curItem ) return {min:0, max:0};
		return {min:0, max:curItem.number};
	}
	
	,_onClickSellBtn : function(){
		var curItem = this.imgr_.getItemById(this.curSelItemId_);
		if ( !curItem ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.myselldlg.tip.canNotSelectItemId);
			return;
		}
		
		var number = this.items_.inumber.getVal();
		if ( number <= 0 ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.myselldlg.tip.canNotInputNumber);
			return;
		}
		
		var auctionPrice = this.items_.iauctionPrice.getVal();
		if ( auctionPrice <= 0 ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.myselldlg.tip.notInputAuctionPrice);
			return;
		}
		
		var fixedPrice = this.items_.ifixedPrice.getVal();
		if ( fixedPrice <= auctionPrice ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.myselldlg.tip.notInputFixedPrice);
			return;
		}
		
		AllianceSender.sendSellItem(this.g_, this.curSelItemId_, number, auctionPrice, fixedPrice);
	}
	
	,_onClickCancelSellBtn : function(id){
		var sellingItems = this.imgr_.getSellingItems();
		AllianceSender.sendCancelSellItem(this.g_, sellingItems[id].id);
	}
	
	,_onItemsChange : function(){
		this._updatePkgTabList();
		this._updateCurSelItem();
	}
	
	,_onSellingItems : function(){
		this._updateSellingItems();
	}
	
	,_getSellingItemState : function(ritem){
		var state = 0;
		if ( ritem.doing == 0 && (this.g_.getSvrTimeS() <= ritem.stopTime)) {
			state = 0;
		} else if (this.g_.getSvrTimeS() > ritem.stopTime) {
			state = 2;
		} else {
			state = 1;
		}
		return state;
	}
});
