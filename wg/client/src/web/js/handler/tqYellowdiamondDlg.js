/*******************************************************************************/
YellowdiamondDlg = BaseQQdiamondDlg.ex({
	_regEvents : function(){
		this.g_.regEvent(EVT.ROLEBASE, 3, this, this._onDiamondInfo);
	}
	
	,_getUiCfg : function(){
		return uicfg.YellowdiamondDlg;
	}
	
	,_getSender : function(){
		return YellowDiamondSender;
	}
	
	,_getRess : function(){
		return {
			lvlgifts : res_yd_lvlgifts
			,newgifts : res_yd_newgifts
			,everydaygifts : res_yd_everydaygifts
			,yeareverydaygifts : res_yd_yeareverydaygifts
		};
	}
	
	,_getRoleDiamondInfo : function(){
		var ydInfo = {};
		TQ.dictCopy(ydInfo, this.g_.getImgr().getRoleRes().ydInfo);
		ydInfo.is_vip = ydInfo.is_yellow_vip;
		ydInfo.is_high_vip = ydInfo.is_yellow_high_vip;
		ydInfo.is_year_vip = ydInfo.is_yellow_year_vip;
		ydInfo.vip_level = ydInfo.yellow_vip_level;
		return ydInfo;
	}
	
	,_getGetBtnUiback : function(){
		return uiback.btn.ydgetbtn;
	}
	
	,_onOpenComm : function(){
		JMISC.openCommYellowDiamond();
	}
	
	,_onOpenYear : function(){
		JMISC.openYearYellowDiamond();
	}
	
	,_onPayComm : function(){
		JMISC.payCommYellowDiamond();
	}
	
	,_onPayYear : function(){
		JMISC.payYearYellowDiamond();
	}	
	
	,_updateCurDiamondLevel : function(){
		if ( this._isDiamond() ) {
			IMG.setBKImage(this.items_.yellowLbl, '' );
			IMG.setBKImage(this.items_.yellowLevel, this._makeUiDiamondImg(this._getDiamondLevel()) );
		} else {
			IMG.setBKImage(this.items_.yellowLbl, IMG.makeImg('qq/yd/mainui/notyellow.gif') );
		}
	}	
	
	,_needOpenDiamondTip : function(){
		return rstr.yellowdiamondDlg.tip.openYellow;
	}
	
	,_needOpenYearDiamondTip : function(){
		return rstr.yellowdiamondDlg.tip.openYearYellow;
	}
	
	,_needLevelDiamondTip : function() {
		return rstr.yellowdiamondDlg.tip.levelYellow;
	}
	
	,_makeUiDiamondImg : function(xdlvl) {
		return IMG.makeYellowDiamondImg('ui', xdlvl);
	}
});