/*******************************************************************************/
Blue3366DiamondDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.g_.regEvent(EVT.ROLEBASE, 4, this, this._onDiamondInfo);
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, pos:{x:"center", y:40}, uiback:uiback.dlg.noborder, uicfg:uicfg.blue3366DiamondDlg};
	}
	
	,_setCallers : function(){
		this.items_.closeBtn.setCaller({self:this, caller:this._onCloseDlg});
		this.items_.gotoBtn.setCaller({self:this, caller:this._onGoto});
		this.items_.getBtn.setCaller({self:this, caller:this._onGet});
	}	

	,_initInfo : function(){
		this._update();
	}	
	
	,_update : function(){
		if (!this.isShow()) return;
		this._updateCurLevel();
		this._updateList();
		this._updateGetBtnEnable();
	}
	
	,_updateCurLevel : function(){
		TQ.setRichText(this.items_.curLevel, TQ.format(rstr.blue3366DiamondDlg.curLevel, this._getGrowLevel()));
	}
	
	,_updateList : function(){
		var list = this.items_.everydayList;
		list.setItemCount(res_3366_lvlgifts.length);
		for ( var listIdx=0; listIdx<list.getCount(); ++listIdx ) {
			var res =res_3366_lvlgifts[listIdx];
			var items = DropItemUtil.getDropItems(res.dropid);
			var item = list.getItem(listIdx);
			TQ.setRichText(item.exsubs.level, this._makeLevel(res, listIdx, listIdx==0, listIdx==list.getCount()-1));
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
	
	,_updateGetBtnEnable : function(){
		this.items_.getBtn.enable(!this._isGotEverydayGift());
	}	
	
	,_makeLevel : function(res, idx, isFirst, isLast){
		if ( isFirst ) {
			return TQ.format(rstr.blue3366DiamondDlg.lvl, 1, res.level-1);
		} else if ( isLast ) {
			var lastRes = res_3366_lvlgifts[idx - 1];
			return TQ.format(rstr.blue3366DiamondDlg.maxlvl, lastRes.level);
		} else {
			var lastRes = res_3366_lvlgifts[idx - 1];
			return TQ.format(rstr.blue3366DiamondDlg.lvl, lastRes.level, res.level-1);
		}
	}
	
	,_setItem : function(iconDom, numberDom, tipDom, ritem){
		IMG.setBKImage(iconDom, IMG.makeSmallImg(ritem.itemres.smallpic));
		TQ.setText(numberDom, '×' + ritem.number);
		TTIP.setCallerData(tipDom, {self:this, caller:this._onGetTooltip},{resid:ritem.id});
	}
	
	,_getGrowLevel : function(){
		return this.imgr_.get3366GrowLevel();
	}
	
	,_isGotEverydayGift : function(){
		var bdInfo = this.imgr_.getRoleRes().bdInfo;
		if ( !bdInfo.got_3366gift ) return false;
		return TQ.isSameDay(bdInfo.got_3366gift, this.g_.getSvrTimeS() );
	}
	
	,_onGetTooltip : function(data){
		if (data.resid ==0) return '';
		var item = {id:data.resid, resid:data.resid, itemres:ItemResUtil.findItemres(data.resid)};
		return TIPM.getItemDesc(item);
	}
	
	,_onDiamondInfo : function(netevent){
		this._update();
	}
	
	,_onCloseDlg : function(){
		this.dlg_.hide();
	}
	
	,_onGoto : function(){
		JMISC.open3366();
	}	
	
	,_onGet : function(){
		if ( this._getGrowLevel() == 0 ) {
			this.g_.getGUI().sysMsgTips( SMT_WARNING,  rstr.blue3366DiamondDlg.goto3366Tip );
			return;
		}
		
		if ( !this._isGotEverydayGift() ) {
			BlueDiamondSender.sendGet3366EveryDayGift(this.g_);
		}	
	}
});
