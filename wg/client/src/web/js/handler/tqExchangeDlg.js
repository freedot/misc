/*******************************************************************************/
ExchangeDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.listSelects = [-1, -1];
	}
	
	,hasCanExChangeItem : function(tabIdx){
		var ress = this._collectByType(tabIdx);
		for ( var i=0; i<ress.length; ++i ) {
			if ( this._hasEnoughMaterials(ress[i].materials) ) {
				return true;
			}
		}
		return false;
	}
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.exchangedlg.title, pos:{x:"center", y:40}, uicfg:uicfg.exchangedlg};
	} 
	
	,_afterCreate : function(){
		this._setTabsText();
		this.g_.regEvent(EVT.PKG_CHANGE, 0, this, this._onItemChanged);
	}	
	
	,_setCallers : function(){
		this.items_.tabList.setCaller({self:this, caller:this._onActiveTab});
		for ( var i=0; i<this.items_.tabList.getTabCount(); ++i ) {
			var items = this.items_.tabList.getTabItems(i);
			items.allList.setCaller({self:this, caller:this._onClickListItem});
			TTIP.setCallerData(items.tooltips['$target'], {self:this, caller:this._onGetTargetTip}, {});
			items.inum.setLimit(this._getExchangeLimit());
			items.exchangeBtn.setCaller({self:this, caller:this._onClickExchangeBtn});
		}
	}	
	
	,_initInfo : function(){
		this.items_.tabList.activeTab(0);
		this._setTabBtnRedDot();
	}
	
	,_setTabsText : function(){
		for ( var i=0; i<rstr.exchangedlg.tabs.length; ++i ) {
			this.items_.tabList.setTabText(i, rstr.exchangedlg.tabs[i]);
		}
	}
	
	,_setTabBtnRedDot : function(){
		for ( var i=0; i<2; ++i ) {
			this.items_.tabList.getTabBtn(i).setNewFlag(this.hasCanExChangeItem(i));
		}
	}
	
	,_onActiveTab : function(idx){
		var items = this.items_.tabList.getTabItems(idx);
		var ress = this._collectByType(idx);
		this._setAllListItem(items.allList, ress);
		var lastSel = this.listSelects[idx];
		if (lastSel < 0) {
			items.allList.setCurSel(0);
		} else {
			items.allList.setCurSel(lastSel);
		}
	}
	
	,_onClickListItem : function(e, idx){
		this._savetListSelected(idx);
		this._updateCurSelectPage();
	}
	
	,_onGetTargetTip : function(data){
		var res = this._getCurSelRes();
		return TIPM.makeItemTip(res.tips);
	}
	
	,_onClickExchangeBtn : function(){
		var res = this._getCurSelRes();
		var items = this._getCurItems();
		ExchangeSender.sendExchange(this.g_, res.dropId, items.inum.getVal() );
	}
	
	,_onItemChanged : function(){
		if ( !this.isShow() ) return;
		this._updateCurSelectPage();
		
		var tabIdx = this.items_.tabList.getActiveTab();
		var items = this.items_.tabList.getTabItems(tabIdx);
		var ress = this._collectByType(tabIdx);
		this._setAllListItem(items.allList, ress);
		this._setTabBtnRedDot();
	}
	
	,_setAllListItem : function(list, ress){
		list.setItemCount(ress.length);
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			var res = ress[i];
			TQ.setRichText(item.exsubs.name, res.name);
			if ( this._hasEnoughMaterials(res.materials) ) {
				TQ.setCSS(item.exsubs.canFlag, 'display', 'block' );
			} else {
				TQ.setCSS(item.exsubs.canFlag, 'display', 'none' );
			}
		}
	}
	
	,_hasEnoughMaterials : function(materials){
		for ( var i=0; i<materials.length; ++i ) {
			material = materials[i];
			if (material.itemId == 0) break;
			var number = this.g_.getImgr().getItemNumByResId(material.itemId);
			if (material.number > number) return false;
		}
		return true;
	}
	
	,_savetListSelected : function(idx){
		var curTabIdx = this.items_.tabList.getActiveTab();
		this.listSelects[curTabIdx] = idx;
	}
	
	,_updateCurSelectPage : function(){
		var res = this._getCurSelRes();
		var items = this._getCurItems();
		IMG.setBKImage(items.target, IMG.makeBigImg(res.icon));
		CommDrawItem.drawItemIcon(items.target, {bigpic:res.icon, level:res.level});
		this._updateNeedMaterials(items.needList, res);
		items.inum.setVal(10000);
		items.exchangeBtn.enable(this._getCanExchangeMaxCount() > 0);
		TQ.setCSS(items.inumPanel, 'display', this._isArmTab() ? 'none' : 'block');
	}
	
	,_updateNeedMaterials : function(list, res){
		for ( var i=0; i < list.getCount(); ++i ) {
			var item = list.getItem(i);
			var material = res.materials[i];
			if (material && material.itemId > 0) {
				var itemRes = ItemResUtil.findItemres(material.itemId);
				CommDrawItem.drawItemIcon(item.exsubs.icon, itemRes);
				
				TQ.setRichText(item.exsubs.name, itemRes.name);
				var hasNumber = this.g_.getImgr().getItemNumByResId(material.itemId);
				var snumber = '';
				if (hasNumber >= material.number) {
					snumber = TQ.format(rstr.exchangedlg.needNumber, TQ.formatColorStr(hasNumber, COLORS.ENOUGH_ITEM), TQ.formatColorStr(material.number, COLORS.ENOUGH_ITEM));
				} else {
					snumber = TQ.format(rstr.exchangedlg.needNumber, TQ.formatColorStr(hasNumber, COLORS.NO_ENOUGH_ITEM),material.number);
				}
				TQ.setRichText(item.exsubs.number, snumber );
			} else {
				IMG.setBKImage(item.exsubs.icon, ''); 	TQ.setClass(item.exsubs.icon, '');
				TQ.setRichText(item.exsubs.name, '');
				TQ.setRichText(item.exsubs.number, '' );
			}
		}
	}
	
	,_getCurSelRes : function(){
		var curTabIdx = this.items_.tabList.getActiveTab();
		var items = this.items_.tabList.getTabItems(curTabIdx);
		var curIdx = items.allList.getCurSel();
		var ress = this._collectByType(curTabIdx);
		return ress[curIdx];
	}
	
	,_getCurItems : function(){
		var curTabIdx = this.items_.tabList.getActiveTab();
		return this.items_.tabList.getTabItems(curTabIdx);
	}
	
	,_collectByType : function(type){
		var ress = [];
		for ( var i=0; i<res_exchanges.length; ++i ) {
			var res = res_exchanges[i];
			if ( res.type == type ) {
				ress.push(res);
			}
		}
		return ress;
	}
	
	,_getExchangeLimit : function(){
		var this_l = this;
		return function(){
			var maxcount = this_l._getCanExchangeMaxCount();
			if (maxcount > 0) {
				return {min:1, max:maxcount};
			} else {
				return {min:0, max:0};
			}
		};
	}
	
	,_getCanExchangeMaxCount : function(){
		var maxcount = this._isArmTab() ? 1 : 10000;
		var res = this._getCurSelRes();
		for ( var i=0; i<res.materials.length; ++i ) {
			material = res.materials[i];
			if (material.itemId == 0) break;
			var number = this.g_.getImgr().getItemNumByResId(material.itemId);
			var cnt = Math.floor(number/material.number);
			if (cnt < maxcount) maxcount = cnt;
		}
		return maxcount;
	}
	
	,_isArmTab : function(){
		return this.items_.tabList.getActiveTab() == 1;
	}
});
