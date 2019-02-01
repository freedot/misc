/*******************************************************************************/
VipDlg = BaseDlg.extern(function(){
	this._init = function(){
		this.payGold_ = 0;
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRoleBaseResChange);
		this.g_.regEvent(EVT.NET, NETCMD.PAYGOLD, this, this._onPayGold);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.vipdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.vipdlg};
	}; 
	
	this._afterCreate = function(){
		this._setItems();
	};	
	
	this._setCallers = function(){
		this.items_.payBtn.setCaller({self:this, caller:this._onClickPayBtn});
	};	
	
	this._initInfo = function(){
		this._update();
	};
	
	this._update = function(){
		if ( !this.isShow() ) return;
		this._updateVipLevelNumber();
		this._updateVipProg();
		this._updateCurLevelBlock();
	};
	
	this._updateVipLevelNumber = function(){
		IMG.setBKImage(this.items_.vipLevel, IMG.makeImg('vip/ui/' + this.imgr_.getVipLevel() + '.png') );
	};
	
	this._updateVipProg = function(){
		var progInfo = this._getVipProgRangeAndVal();
		var totalLen = 455;
		var w =	Math.round(totalLen*progInfo.val/progInfo.range);
		TQ.setCSS(this.items_.vipProg, 'width', w+'px');
		TQ.setRichText(this.items_.payGold, progInfo.val + '/' + progInfo.range);
		if ( this.imgr_.getVipLevel() < res_vip_max_level ) {
			TQ.setRichText(this.items_.vipProgDesc, TQ.format(rstr.vipdlg.progDesc, (progInfo.range - progInfo.val), this.imgr_.getVipLevel()+1));
		} else {
			TQ.setRichText(this.items_.vipProgDesc, TQ.format(rstr.vipdlg.maxProgDesc, this.imgr_.getVipLevel()));
		}
	};
	
	this._getVipProgRangeAndVal = function(){
		var vipLevel = this.imgr_.getVipLevel();
		var res = TQ.find(res_vip, 'effid', VIP_EFF.PAY);
		var range = 0;
		var curnum = 0;
		if ( vipLevel < res_vip_max_level ) {
			range = res.effs[vipLevel+1] - res.effs[vipLevel];
			curnum = this.payGold_ - res.effs[vipLevel];
		} else {
			range = res.effs[res_vip_max_level] - res.effs[res_vip_max_level-1];
			curnum = this.payGold_ - res.effs[res_vip_max_level-1];
		}
		
		if (curnum > range) {
			curnum = range;
		}
		return {val:curnum, range:range};
	};
	
	this._updateCurLevelBlock = function() {
		var orgin_left = 196;
		var subLen = 634/res_vip_max_level;
		var vipLevel = this.imgr_.getVipLevel();
		if ( vipLevel == 0 ) {
			TQ.setCSS(this.items_.curLevel, 'display', 'none');
		} else {
			TQ.setCSS(this.items_.curLevel, 'display', 'block');
			TQ.setCSS(this.items_.curLevel, 'left', (orgin_left + Math.round(subLen*(vipLevel-1))) + 'px');
		}
	};
	
	this._setItems = function(){
		this.items_.effectList.setItemCount(res_vip.length - 1);
		for ( var itemIdx=0; itemIdx<this.items_.effectList.getCount(); ++itemIdx ) {
			var res = res_vip[itemIdx+1];
			var item = this.items_.effectList.getItem(itemIdx);
			TQ.setRichText(item.exsubs.name, res.name);
			for ( var level=1; level<=res_vip_max_level; ++level) {
				var val = res.effs[level];
				if ( val == 0 ) {
					TQ.setClass(item.exsubs['level' + level], 'noflag');
				} else if ( res.unit == 'yesno' ) {
					TQ.setClass(item.exsubs['level' + level], 'yesflag');
				} else if ( res.unit == 'steel' ) {
					TQ.setRichText(item.exsubs['level' + level], rstr.vipdlg.steelNames[val] );
				} else if ( res.unit == 'item' ) {
					TQ.setRichText(item.exsubs['level' + level], TQ.format(rstr.vipdlg.itemName, level) );
				} else {
					TQ.setRichText(item.exsubs['level' + level], TQ.format(res.unit, val) );
				}
				TTIP.setCallerData(item.exsubs.tooltips['$level' + level], {self:this, caller:this._onGetTooltip},{unit:res.unit, val:val});
			}
		}
	};
	
	this._onClickPayBtn = function(){
		JMISC.openPayWnd();
	};
	
	this._onGetTooltip = function(data){
		if ( data.unit != 'item' ) return '';
		var itemId = data.val;
		var item = {id:0, resid:itemId, itemres:ItemResUtil.findItemres(itemId) };
		return TIPM.getItemDesc(item, 'sys');
	};
	
	this._onRoleBaseResChange = function(){
		this._update();
	};
	
	this._onPayGold = function(netevent){
		var netdata = netevent.data;
		if ( !isNull(netdata.paygold) ) {
			this.payGold_ = netdata.paygold;
			this._update();
		}
	};
});
