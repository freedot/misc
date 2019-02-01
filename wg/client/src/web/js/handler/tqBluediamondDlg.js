/*******************************************************************************/
BaseQQdiamondDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.g_.regEvent(EVT.ROLEBASE, 2, this, this._onRoleUpgrade);
		this._regEvents();
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, pos:{x:"center", y:40}, uiback:uiback.dlg.noborder, uicfg:this._getUiCfg()};
	}
	
	,_afterCreate : function(){
		TQ.fixIE6Png(this.items_.dlg_bak);
	}
	
	,_setCallers : function(){
		this.items_.closeBtn.setCaller({self:this, caller:this._onCloseDlg});
		this.items_.openCommBtn.setCaller({self:this, caller:this._onOpenComm});
		this.items_.openYearBtn.setCaller({self:this, caller:this._onOpenYear});
		this.items_.payCommBtn.setCaller({self:this, caller:this._onPayComm});
		this.items_.payYearBtn.setCaller({self:this, caller:this._onPayYear});
		this.items_.buyGoldBtn.setCaller({self:this, caller:this._onBuyGold});
		this.items_.getNewBtn.setCaller({self:this, caller:this._onGetNewGift});
		this.items_.getCommEveryDayBtn.setCaller({self:this, caller:this._onGetCommEveryDayGift});
		this.items_.getYearEveryDayBtn.setCaller({self:this, caller:this._onGetYearEveryDayGift});
	}	

	,_initInfo : function(){
		this._getSender().sendGetInfo(this.g_);
		this._update();
	}	
	
	,_onCloseDlg : function(){
		this.hideDlg();
	}

	,_onBuyGold : function(){
		JMISC.openPayWnd();
	}	
	
	,_onGetNewGift : function(){
		if (!this._isDiamond() ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING, this._needOpenDiamondTip() );
			return;
		}
		
		if ( !this._isGotNewGift() ) {
			this._getSender().sendGetNewGift(this.g_);
		}
	}	
	
	,_onGetCommEveryDayGift : function(){
		if (!this._isDiamond() ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING, this._needOpenDiamondTip() );
			return;
		}
		
		if ( !this._isGotCommEverydayGift() ) {
			this._getSender().sendGetCommEveryDayGift(this.g_);
		}
	}	
	
	,_onGetYearEveryDayGift : function(){
		if (!this._isYearDiamond() ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING, this._needOpenYearDiamondTip() );
			return;
		}
		
		if ( !this._isGotYearEveydayGift() ){
			this._getSender().sendGetYearEveryDayGift(this.g_);
		}		
	}
	
	,_onRoleUpgrade : function(){
		this._update();
	}
	
	,_onDiamondInfo : function(netevent){
		this._update();
	}
	
	,_onGetLvlGift : function(idx){
		var res = this._getLevelGiftsResByIdx(idx);
		var roleLevel = this.g_.getImgr().getRoleRes().level;
		if ( res.level > roleLevel ) return;
		if ( this._isGotLvlGift(res.id) ) return;
		if ( res.xdlvl > this._getDiamondLevel() ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING, TQ.format(this._needLevelDiamondTip() , res.xdlvl) );
			return;
		}
		
		this._getSender().sendGetLevelGift(this.g_, res.id);
	}	
	
	,_onGetTooltip : function(data){
		if (data.resid ==0) return '';
		var item = {id:data.resid, resid:data.resid, itemres:ItemResUtil.findItemres(data.resid)};
		return TIPM.getItemDesc(item);
	}
	
	,_update : function(){
		if (!this.isShow()) return;
		this._updateCurDiamondLevel();
		this._updateDiamondBtnsDisplay();
		this._updateNewGiftBtnEnable();
		this._updateCommGiftBtnEnable();
		this._updateLevelGiftList();
		this._updateNewGiftList();
		this._updateCommGiftList();		
		this._updateYearGiftList();
		this._updateYearGiftBtnEnable();
	}	
	
	,_updateDiamondBtnsDisplay : function(){
		if ( this._isCommDiamond() ) {
			TQ.setCSS(this.items_.openCommBtn.getParent(), 'display', 'none' );
			TQ.setCSS(this.items_.payCommBtn.getParent(), 'display', 'block' );
		} else {
			TQ.setCSS(this.items_.openCommBtn.getParent(), 'display', 'block' );
			TQ.setCSS(this.items_.payCommBtn.getParent(), 'display', 'none' );
		}
		
		if ( this._isYearDiamond() ) {
			TQ.setCSS(this.items_.openYearBtn.getParent(), 'display', 'none' );
			TQ.setCSS(this.items_.payYearBtn.getParent(), 'display', 'block' );
		} else {
			TQ.setCSS(this.items_.openYearBtn.getParent(), 'display', 'block' );
			TQ.setCSS(this.items_.payYearBtn.getParent(), 'display', 'none' );
		}
	}
	
	,_updateLevelGiftList : function(){
		var roleLevel = this.g_.getImgr().getRoleRes().level;
		var list = this.items_.levelList;
		list.setItemCount(this._getLevelGiftsResCount());
		for ( var listIdx=0; listIdx<list.getCount(); ++listIdx ) {
			var res = this._getLevelGiftsResByIdx(listIdx);
			var items = DropItemUtil.getDropItems(res.dropid);
			var item = list.getItem(listIdx);
			
			TQ.setText(item.exsubs.roleLevel, 'Lv' + res.level );
			IMG.setBKImage(item.exsubs.xdLevel, this._makeUiDiamondImg(res.xdlvl) );
			
			for ( var colId=1; colId<=items.length; ++colId ) {
				var ritem = items[colId-1];
				ritem.itemres = ItemResUtil.findItemres(ritem.id);
				this._setItem(item.exsubs['icon' + colId], item.exsubs['number' + colId], item.exsubs.tooltips['$item' + colId], ritem);
			}
			for ( var colId=items.length+1; colId<=3; ++colId) {
				TTIP.setCallerData(item.exsubs.tooltips['$item' + colId], {self:this, caller:this._onGetTooltip},{resid:0});
			}
			
			var enable = !this._isGotLvlGift(res.id) && (res.level <= roleLevel) && (res.xdlvl <= this._getDiamondLevel());
			item.exsubs.getBtn.enable(enable);
			item.exsubs.getBtn.setId(listIdx);
			item.exsubs.getBtn.setCaller({self:this, caller:this._onGetLvlGift});
			item.exsubs.getBtn.resetUIBack(this._getGetBtnUiback() );
		}
	}	
	
	,_updateNewGiftBtnEnable : function(){
		this.items_.getNewBtn.enable(!this._isGotNewGift());
	}
	
	,_updateNewGiftList : function(){
		var res = this._getNewGiftsResByIdx(0);
		var items = DropItemUtil.getDropItems(res.dropid);
		var list = this.items_.newhandList;
		list.setItemCount(items.length);
		for ( var i=0; i<list.getCount(); ++i ) {
			var ritem = items[i];
			ritem.itemres = ItemResUtil.findItemres(ritem.id);
			var item = list.getItem(i);
			this._setItem(item.exsubs.icon, item.exsubs.number, item.exsubs.tooltips['$item'], ritem);
		}
	}
	
	,_updateCommGiftBtnEnable : function(){
		this.items_.getCommEveryDayBtn.enable(!this._isGotCommEverydayGift());
	}	
	
	,_updateCommGiftList : function(){
		var list = this.items_.everydayList;
		list.setItemCount(this._getEverydayGiftsResCount());
		for ( var listIdx=0; listIdx<list.getCount(); ++listIdx ) {
			var res = this._getEverydayGiftsResByIdx(listIdx);
			var items = DropItemUtil.getDropItems(res.dropid);
			var item = list.getItem(listIdx);
			IMG.setBKImage(item.exsubs.xdLevel, this._makeUiDiamondImg(res.id) );
			for ( var colId=1; colId<=items.length; ++colId ) {
				var ritem = items[colId-1];
				ritem.itemres = ItemResUtil.findItemres(ritem.id);
				this._setItem(item.exsubs['icon' + colId], item.exsubs['number' + colId], item.exsubs.tooltips['$item' + colId], ritem);
			}
			for ( var colId=items.length+1; colId<=3; ++colId) {
				TTIP.setCallerData(item.exsubs.tooltips['$item' + colId], {self:this, caller:this._onGetTooltip},{resid:0});
			}
		}
	}	
	
	,_updateYearGiftBtnEnable : function(){
		this.items_.getYearEveryDayBtn.enable(!this._isGotYearEveydayGift());
	}
	
	,_updateYearGiftList : function(){
		var res = this._getYearEverydayGiftsResByIdx(0);
		var items = DropItemUtil.getDropItems(res.dropid);
		var list = this.items_.yearEverydayList;
		list.setItemCount(items.length);
		for ( var i=0; i<list.getCount(); ++i ) {
			var ritem = items[i];
			ritem.itemres = ItemResUtil.findItemres(ritem.id);
			var item = list.getItem(i);
			this._setItem(item.exsubs.icon, item.exsubs.number, item.exsubs.tooltips['$item'], ritem);
		}
	}	
	
	,_setItem : function(iconDom, numberDom, tipDom, ritem){
		IMG.setBKImage(iconDom, IMG.makeSmallImg(ritem.itemres.smallpic));
		TQ.setText(numberDom, '×' + ritem.number);
		TTIP.setCallerData(tipDom, {self:this, caller:this._onGetTooltip},{resid:ritem.id});
	}
	
	,_isGotNewGift : function(){
		var bdInfo = this._getRoleDiamondInfo();
		return bdInfo.got_newgift ? true : false;
	}	
	
	,_isGotCommEverydayGift : function(){
		var bdInfo = this._getRoleDiamondInfo();
		if ( !bdInfo.got_commgift ) return false;
		return TQ.isSameDay(bdInfo.got_commgift, this.g_.getSvrTimeS() );
	}	
	
	,_isGotYearEveydayGift : function(){
		var bdInfo = this._getRoleDiamondInfo();
		if ( !bdInfo.got_yeargift ) return false;
		return TQ.isSameDay(bdInfo.got_yeargift, this.g_.getSvrTimeS() );
	}	
	
	,_isGotLvlGift : function(id){
		var bdInfo = this._getRoleDiamondInfo();
		if ( !bdInfo.got_lvlgifts ) return false;
		return TQ.find(bdInfo.got_lvlgifts, null, id) != null;
	}		
	
	,_isDiamond : function(){
		var info = this._getRoleDiamondInfo();
		return (info.is_high_vip || info.is_vip || info.is_year_vip) ? true : false;
	}	
	
	,_isCommDiamond : function(){
		var info = this._getRoleDiamondInfo();
		return (info.is_high_vip || info.is_vip) ? true : false;
	}	
	
	,_isYearDiamond : function(){
		var info = this._getRoleDiamondInfo();
		return info.is_year_vip ? true : false;
	}	
	
	,_getDiamondLevel : function(){
		var info = this._getRoleDiamondInfo();
		return info.vip_level ? info.vip_level : 0;
	}		
	
	,_getLevelGiftsResByIdx : function(idx){
		var res = this._getRess().lvlgifts[idx];
		res.xdlvl = res.bdlvl ? res.bdlvl : res.ydlvl;
		return res;
	}
	
	,_getLevelGiftsResCount : function(){
		return this._getRess().lvlgifts.length;
	}
	
	,_getNewGiftsResByIdx : function(idx){
		return this._getRess().newgifts[idx];
	}
	
	,_getEverydayGiftsResByIdx : function(idx){
		return this._getRess().everydaygifts[idx];
	}
	
	,_getEverydayGiftsResCount : function(){
		return this._getRess().everydaygifts.length;
	}
	
	,_getYearEverydayGiftsResByIdx : function(idx){
		return this._getRess().yeareverydaygifts[idx];
	}

	
	//virtual method
	,_regEvents : function(){}
	,_getUiCfg : function(){}
	,_getSender : function(){}
	,_getRess : function(){}
	,_getRoleDiamondInfo : function(){}
	,_getGetBtnUiback : function(){}
	,_onOpenComm : function(){}
	,_onOpenYear : function(){}
	,_onPayComm : function(){}
	,_onPayYear : function(){}
	,_updateCurDiamondLevel : function(){}
	,_needOpenDiamondTip : function(){}
	,_needOpenYearDiamondTip : function(){}
	,_needLevelDiamondTip : function(){}
	,_makeUiDiamondImg : function(){}
});

BluediamondDlg = BaseQQdiamondDlg.ex({
	_regEvents : function(){
		this.g_.regEvent(EVT.ROLEBASE, 4, this, this._onDiamondInfo);
	}
	
	,_setCallers : function(){
		this._super._setCallers.call(this);
		this.items_.gotoOfficial.setCaller({self:this, caller:this._onGotoOfficial});
		this.items_.getHighEveryDayBtn.setCaller({self:this, caller:this._onGetHighEveryDayGift});
	}
	
	,_getUiCfg : function(){
		return uicfg.BluediamondDlg;
	}
	
	,_getSender : function(){
		return BlueDiamondSender;
	}
	
	,_getRess : function(){
		return {
			lvlgifts : res_bd_lvlgifts
			,newgifts : res_bd_newgifts
			,everydaygifts : res_bd_everydaygifts
			,yeareverydaygifts : res_bd_yeareverydaygifts
			,higheverydaygifts : res_bd_higheverydaygifts
		};
	}
	
	,_getRoleDiamondInfo : function(){
		var bdInfo = {};
		TQ.dictCopy(bdInfo, this.g_.getImgr().getRoleRes().bdInfo);
		bdInfo.is_vip = bdInfo.is_blue_vip;
		bdInfo.is_high_vip = bdInfo.is_super_blue_vip;
		bdInfo.is_year_vip = bdInfo.is_blue_year_vip;
		bdInfo.vip_level = bdInfo. blue_vip_level;
		return bdInfo;
	}
	
	,_update : function(){
		if (!this.isShow()) return;
		this._super._update.call(this);
		this._updateHighGiftList();
		this._updateHighGiftBtnEnable();
	}
	
	,_updateHighGiftList : function(){
		var res = this._getRess().higheverydaygifts[0];
		var items = DropItemUtil.getDropItems(res.dropid);
		var list = this.items_.highEverydayList;
		list.setItemCount(items.length);
		for ( var i=0; i<list.getCount(); ++i ) {
			var ritem = items[i];
			ritem.itemres = ItemResUtil.findItemres(ritem.id);
			var item = list.getItem(i);
			this._setItem(item.exsubs.icon, item.exsubs.number, item.exsubs.tooltips['$item'], ritem);
		}
	}	
	
	,_getGetBtnUiback : function(){
		return uiback.btn.bdgetbtn;
	}
	
	,_onOpenComm : function(){
		JMISC.openCommBlueDiamond();
	}
	
	,_onOpenYear : function(){
		JMISC.openYearBlueDiamond();
	}
	
	,_onPayComm : function(){
		JMISC.payCommBlueDiamond();
	}
	
	,_onPayYear : function(){
		JMISC.payYearBlueDiamond();
	}	
	
	,_onGotoOfficial : function(){
		JMISC.openBlueOfficial();
	}
	
	,_onGetHighEveryDayGift : function(){
		if (!this._isHighDiamond() ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING, rstr.bluediamondDlg.tip.openHighBlue );
			return;
		}
		
		if ( !this._isGotHighEveydayGift() ){
			this._getSender().sendGetHighEveryDayGift(this.g_);
		}		
	}
	
	,_updateCurDiamondLevel : function(){
		if ( this._isDiamond() ) {
			IMG.setBKImage(this.items_.blueLbl, '' );
			IMG.setBKImage(this.items_.blueLevel, this._makeUiDiamondImg(this._getDiamondLevel()) );
		} else {
			IMG.setBKImage(this.items_.blueLbl, IMG.makeImg('qq/bd/mainui/notblue.gif') );
		}
	}	
	
	,_updateHighGiftBtnEnable : function(){
		this.items_.getHighEveryDayBtn.enable(!this._isGotHighEveydayGift());
	}
	
	,_isHighDiamond : function(){
		var info = this._getRoleDiamondInfo();
		return info.is_high_vip ? true : false;
	}	
	
	,_isGotHighEveydayGift : function(){
		var bdInfo = this._getRoleDiamondInfo();
		if ( !bdInfo.got_highgift ) return false;
		return TQ.isSameDay(bdInfo.got_highgift, this.g_.getSvrTimeS() );
	}		
	
	,_needOpenDiamondTip : function(){
		return rstr.bluediamondDlg.tip.openBlue;
	}
	
	,_needOpenYearDiamondTip : function(){
		return rstr.bluediamondDlg.tip.openYearBlue;
	}
	
	,_needLevelDiamondTip : function() {
		return rstr.bluediamondDlg.tip.levelBlue;
	}
	
	,_makeUiDiamondImg : function(xdlvl) {
		return IMG.makeBlueDiamondImg('ui', xdlvl);
	}
});
