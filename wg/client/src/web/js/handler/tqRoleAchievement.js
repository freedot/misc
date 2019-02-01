/*******************************************************************************/
RoleAchievement = Class.extern(function(){
	this.g_ = null;
	this.items_ = {};
	this.role_ = null;
	this.init = function(g, dom){
		this.g_ = g;
		this._createList(dom);
	};
	
	this.setRole = function(role){ // role: cityMaxLevel: actTower: actTerrace:
		this.role_ = role;
		this.items_.list.setItemCount(4);
		this._setCityLevel(this.items_.list.getItem(0), role.cityMaxLevel);
		this._setActTowerLevel(this.items_.list.getItem(1), role.actTower);
		this._setActTerraceLevel(this.items_.list.getItem(2), role.actTerrace);
		this._setVipLevel(this.items_.list.getItem(3), role.vip);
		this._setTipCaller();
	};
	
	this._createList = function(parentItem){
		var templs = uicfg.roledlg.t_;
		var templ = templs[1];
		this.g_.getGUI().buildDomItems(parentItem, templ, templs, this.items_);
	};
	
	this._setTipCaller = function(){
		TTIP.setCallerData(this.items_.list.getItem(0).exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:this._onGetCityLevelTip}, {});
		TTIP.setCallerData(this.items_.list.getItem(1).exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:this._onGetActTowerTip}, {});
		TTIP.setCallerData(this.items_.list.getItem(2).exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:this._onGetActTerraceTip}, {});
		TTIP.setCallerData(this.items_.list.getItem(3).exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:this._onGetVipTip}, {});
	};
	
	this._setCityLevel = function(item, cityMaxLevel){
		var bigLevel = 0;
		var subLevel = 0;
		if (cityMaxLevel > 0) {
			bigLevel = Math.floor((cityMaxLevel-1)/5) + 1;
			subLevel = (cityMaxLevel-1)%5 + 1;
		}
		IMG.setBKImage(item.exsubs.icon, IMG.getCityBigLevelIcon(bigLevel));
		TQ.setHtml(item.exsubs.num, IMG.getImgNumber('com', subLevel));
	};
	
	this._setActTowerLevel = function(item, actTower) {
		var tenLevel = Math.floor(actTower/10);
		var isEnable = tenLevel>0;
		IMG.setBKImage(item.exsubs.icon, IMG.getActTowerIcon(isEnable));
		TQ.setHtml(item.exsubs.num, IMG.getImgNumber('com', tenLevel));
	};
	
	this._setActTerraceLevel = function(item, actTerrace) {
		var isEnable = actTerrace>0;
		IMG.setBKImage(item.exsubs.icon, IMG.getActTerraceIcon(isEnable));
		TQ.setHtml(item.exsubs.num, IMG.getImgNumber('com', actTerrace));
	};
	
	this._setVipLevel = function(item, vipLevel) {
		var isEnable = vipLevel>0;
		IMG.setBKImage(item.exsubs.icon, IMG.getVipIcon(isEnable));
		TQ.setHtml(item.exsubs.num, IMG.getImgNumber('com', vipLevel));
	};
	
	this._onGetCityLevelTip = function(){
		var res = TQ.qfind(res_citylevelneeds, 'level', this.role_.cityMaxLevel);
		return TQ.format(rstr.roledlg.tips.citylevel, res.name);
	};
	
	this._onGetActTowerTip = function(){
		var tenLevel = Math.floor(this.role_.actTower/10)*10;
		return TQ.format(rstr.roledlg.tips.passtower, tenLevel);
	};
	
	this._onGetActTerraceTip = function(){
		if (this.role_.actTerrace == 0) {
			return rstr.roledlg.tips.nopassterrace;
		} else {
			var res = res_terrace[this.role_.actTerrace][0];
			return TQ.format(rstr.roledlg.tips.passterrace, res.gateName);
		}
	};
	
	this._onGetVipTip = function(){
		if ( this.role_.vip == 0 ) {
			return rstr.roledlg.tips.novip;
		} else {
			return TQ.format(rstr.roledlg.tips.vip, this.role_.vip);
		}
	};
});