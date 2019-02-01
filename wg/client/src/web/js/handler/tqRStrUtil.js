/*******************************************************************************/
RStrUtil = Class.extern(function(){
	//RStrUtil-unittest-start
	this.initOneTime = function(g) {
		this.g_ = g;
	};
	
	this.makeNoItemBuyMsg = function(g, id, neednum) {
		var hasnum = g.getImgr().getItemNumByResId(id);
		var res = ItemResUtil.findItemres(id);
		return TQ.format(rstr.comm.noenoughbuyitem, res.name, neednum, hasnum, id);
	};
	
	this.makeNoSalveBuyMsg = function(id, neednum, hasnum) {
		var res = ItemResUtil.findItemres(id);
		return TQ.format(rstr.comm.noenoughsalvebuyitem, res.name, neednum, hasnum, id);
	};
	
	this.getHealthStr = function(healthVal) {
		var typeIdx = res_gethealthtype(healthVal);
		return rstr.comm.healthnames[typeIdx];
	};
	
	this.getColorHealthVal = function(healthVal){
		var typeIdx = res_gethealthtype(healthVal);
		var colors = {};
		colors[ HEALTH_TYPE.HEALTH] = COLORS.HEALTH_HEALTH;
		colors[ HEALTH_TYPE.FLESH_WOUND] = COLORS.HEALTH_FLESH_WOUND;
		colors[ HEALTH_TYPE.DEEP_WOUND] = COLORS.HEALTH_DEEP_WOUND;
		return TQ.formatColorStr(healthVal, colors[typeIdx] );
	};
	
	this.getSoldierNameByResId = function(resid){
		var residLevel = ItemResUtil.splitResidLevel(resid);
		var res = ItemResUtil.findItemres(residLevel.resid);
		if ( !res ) {
			return '--';
		}
		
		return TQ.format(rstr.soldierdlg.lbl.combinename, residLevel.level, res.name);
	};
	
	this.getSoldierNameByResIdAndLevel = function(resid, level){
		var residLevel = ItemResUtil.splitResidLevel(resid);
		var res = ItemResUtil.findItemres(residLevel.resid);
		if ( !res ) {
			return '--';
		}
		
		return TQ.format(rstr.soldierdlg.lbl.combinename, level, res.name);
	};
	
	this.getNameByResId = function(resid){
		var res = ItemResUtil.findItemres(resid);
		if ( !res ) {
			return '';
		}
		
		return res.name;
	};
	
	this.getNoBindNameByResId = function(resid){
		var res = ItemResUtil.findItemres(resid);
		if ( !res ) {
			return '';
		}
		
		if (!res.nobindid){
			return res.name;
		}
		
		res = ItemResUtil.findItemres(res.nobindid);
		if ( !res ) {
			return '';
		}
		
		return res.name;
	};
	
	this.formatResNumStr = function(num){
		if ( num > 10000*10000 ) {
			return Math.floor(num/100000000)+rstr.comm.yiyi;
		} else if ( num > 10000 ) {
			return Math.floor(num/10000)+rstr.comm.tenthousand;
		}	else {
			return num;
		}
	};
	
	this.getCityNameByLevel = function(level){
		var res = TQ.qfind(res_citylevelneeds, 'level', level);
		if (!res) return '';
		
		return res.name;
	};
	
	this.getItemColorNameByResId = function(resid){
		var res = ItemResUtil.findItemres(resid);
		if ( !res ) {
			return '';
		}
		
		return ItemNameColorGetter.getColorVal(res.level, res.name);
	};
	
	this.makeXDiamondRoleName = function(roleName, info){
		if ( g_platform == '3366' ) {
			return this.makeBlueDiamondRoleName(roleName, info.bdInfo);
		} else if ( g_platform == 'qzone' ) {
			return this.makeYellowDiamondRoleName(roleName, info.ydInfo);
		} else {
			return roleName;
		}
	};
	
	this.makeYellowDiamondRoleName = function(roleName, ydInfo){
		if (!ydInfo) {
			return roleName;
		}
		
		var namefmt = '<div style="float:left;width:auto;">{0}</div>';
		var s = roleName;
		if ( ydInfo.is_yellow_high_vip ) {
			s = TQ.format(namefmt, roleName) + TQ.format(this._getXDFmt('Y'), 18, IMG.makeYellowDiamondImg('high', ydInfo.yellow_vip_level));
		} else if ( ydInfo.is_yellow_vip ) {
			s = TQ.format(namefmt, roleName) + TQ.format(this._getXDFmt('Y'), 18, IMG.makeYellowDiamondImg('comm', ydInfo.yellow_vip_level));
		}
		if ( ydInfo.is_yellow_year_vip ) {
			s = s + TQ.format(this._getXDFmt('Y'), 16, IMG.makeYellowDiamondYearImg('comm'));
		}
		return s;
	};
	
	this.makeBlueDiamondRoleName = function(roleName, bdInfo){
		if (!bdInfo) {
			return roleName;
		}
		
		var namefmt = '<div style="float:left;width:auto;">{0}</div>';
		var s = roleName;
		var isSelf = this.g_.getImgr().getRoleRes().name == roleName;
		var flag = isSelf ? 'B' : 'OB';
		if ( bdInfo.is_super_blue_vip || bdInfo.is_blue_vip) {
			var bdtype = '';
			if ( bdInfo.is_super_blue_vip ) {
				bdtype = 'high';
			} else if ( bdInfo.is_blue_vip ) {
				bdtype = 'comm';
			}
			s = TQ.format(namefmt, roleName) + this._make3366Flag(bdInfo) + TQ.format(this._getXDFmt(flag), 18, IMG.makeBlueDiamondImg(bdtype, bdInfo.blue_vip_level)) + this._makeBlueYearFlag(bdInfo, flag);
		}
		
		return s;
	};
	
	this._makeBlueYearFlag = function(bdInfo, flag){
		if ( bdInfo.is_blue_year_vip ) {
			return TQ.format(this._getXDFmt(flag), 17, IMG.makeBlueDiamondYearImg('comm'));
		}
		return '';
	};
	
	this._make3366Flag = function(bdInfo){
		var level = this.g_.getImgr().get3366GrowLevel();
		if ( level > 0 ) {
			return TQ.format(this._get3366Fmt(level), 17, IMG.makeBlueGrowImg(level));
		}
		return '';
	};
	
	this._getXDFmt = function(hyperFlag){
		return '<div style="float:left;height:16px;width:{0}px;BACKGROUND:url(\'{1}\') 1px 0px no-repeat;" onclick=\'javascript:HyperLinkMgr.onClickLink(event, \"' +hyperFlag+ '\"); return false;\' onMouseOver=\'javascript:HyperLinkMgr.onMouseOver(event, \"' + hyperFlag + '\"); return false;\' onMouseOut=\'javascript:HyperLinkMgr.onMouseOut(event, \"' + hyperFlag + '\"); return false;\' onMouseMove=\'javascript:HyperLinkMgr.onMouseMove(event, \"' + hyperFlag + '\"); return false;\'></div>';
	};
	
	this._get3366Fmt = function(level){
		return '<div style="float:left;height:16px;width:{0}px;BACKGROUND:url(\'{1}\') 1px 0px no-repeat;" onclick=\'javascript:HyperLinkMgr.onClickLink(event, \"3366\", \"' +level+ '\"); return false;\' onMouseOver=\'javascript:HyperLinkMgr.onMouseOver(event, \"3366\", \"' +level+ '\"); return false;\' onMouseOut=\'javascript:HyperLinkMgr.onMouseOut(event, \"3366\", \"' +level+ '\"); return false;\' onMouseMove=\'javascript:HyperLinkMgr.onMouseMove(event, \"3366\", \"' +level+ '\"); return false;\'></div>';
	};
	
	
	//RStrUtil-unittest-end
}).snew();