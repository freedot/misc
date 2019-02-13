RStrUtil=Class.extern(function(){this.initOneTime=function(a){this.g_=a},this.makeNoItemBuyMsg=function(a,b,c){var d=a.getImgr().getItemNumByResId(b),e=ItemResUtil.findItemres(b);return TQ.format(rstr.comm.noenoughbuyitem,e.name,c,d,b)},this.makeNoSalveBuyMsg=function(a,b,c){var d=ItemResUtil.findItemres(a);return TQ.format(rstr.comm.noenoughsalvebuyitem,d.name,b,c,a)},this.getHealthStr=function(a){var b=res_gethealthtype(a);return rstr.comm.healthnames[b]},this.getColorHealthVal=function(a){var b=res_gethealthtype(a),c={};return c[HEALTH_TYPE.HEALTH]=COLORS.HEALTH_HEALTH,c[HEALTH_TYPE.FLESH_WOUND]=COLORS.HEALTH_FLESH_WOUND,c[HEALTH_TYPE.DEEP_WOUND]=COLORS.HEALTH_DEEP_WOUND,TQ.formatColorStr(a,c[b])},this.getSoldierNameByResId=function(a){var b=ItemResUtil.splitResidLevel(a),c=ItemResUtil.findItemres(b.resid);return c?TQ.format(rstr.soldierdlg.lbl.combinename,b.level,c.name):"--"},this.getSoldierNameByResIdAndLevel=function(a,b){var c=ItemResUtil.splitResidLevel(a),d=ItemResUtil.findItemres(c.resid);return d?TQ.format(rstr.soldierdlg.lbl.combinename,b,d.name):"--"},this.getNameByResId=function(a){var b=ItemResUtil.findItemres(a);return b?b.name:""},this.getNoBindNameByResId=function(a){var b=ItemResUtil.findItemres(a);return b?b.nobindid?(b=ItemResUtil.findItemres(b.nobindid),b?b.name:""):b.name:""},this.formatResNumStr=function(a){return a>1e8?Math.floor(a/1e8)+rstr.comm.yiyi:a>1e4?Math.floor(a/1e4)+rstr.comm.tenthousand:a},this.getCityNameByLevel=function(a){var b=TQ.qfind(res_citylevelneeds,"level",a);return b?b.name:""},this.getItemColorNameByResId=function(a){var b=ItemResUtil.findItemres(a);return b?ItemNameColorGetter.getColorVal(b.level,b.name):""},this.makeXDiamondRoleName=function(a,b){return g_platform=="3366"?this.makeBlueDiamondRoleName(a,b.bdInfo):g_platform=="qzone"?this.makeYellowDiamondRoleName(a,b.ydInfo):a},this.makeYellowDiamondRoleName=function(a,b){if(!b)return a;var c='<div style="float:left;width:auto;">{0}</div>',d=a;return b.is_yellow_high_vip?d=TQ.format(c,a)+TQ.format(this._getXDFmt("Y"),18,IMG.makeYellowDiamondImg("high",b.yellow_vip_level)):b.is_yellow_vip&&(d=TQ.format(c,a)+TQ.format(this._getXDFmt("Y"),18,IMG.makeYellowDiamondImg("comm",b.yellow_vip_level))),b.is_yellow_year_vip&&(d+=TQ.format(this._getXDFmt("Y"),16,IMG.makeYellowDiamondYearImg("comm"))),d},this.makeBlueDiamondRoleName=function(a,b){if(!b)return a;var c='<div style="float:left;width:auto;">{0}</div>',d=a,e=this.g_.getImgr().getRoleRes().name==a,f=e?"B":"OB";if(b.is_super_blue_vip||b.is_blue_vip){var g="";b.is_super_blue_vip?g="high":b.is_blue_vip&&(g="comm"),d=TQ.format(c,a)+this._make3366Flag(b)+TQ.format(this._getXDFmt(f),18,IMG.makeBlueDiamondImg(g,b.blue_vip_level))+this._makeBlueYearFlag(b,f)}return d},this._makeBlueYearFlag=function(a,b){return a.is_blue_year_vip?TQ.format(this._getXDFmt(b),17,IMG.makeBlueDiamondYearImg("comm")):""},this._make3366Flag=function(a){var b=this.g_.getImgr().get3366GrowLevel();return b>0?TQ.format(this._get3366Fmt(b),17,IMG.makeBlueGrowImg(b)):""},this._getXDFmt=function(a){return"<div style=\"float:left;height:16px;width:{0}px;BACKGROUND:url('{1}') 1px 0px no-repeat;\" onclick='javascript:HyperLinkMgr.onClickLink(event, \""+a+"\"); return false;' onMouseOver='javascript:HyperLinkMgr.onMouseOver(event, \""+a+"\"); return false;' onMouseOut='javascript:HyperLinkMgr.onMouseOut(event, \""+a+"\"); return false;' onMouseMove='javascript:HyperLinkMgr.onMouseMove(event, \""+a+"\"); return false;'></div>"},this._get3366Fmt=function(a){return'<div style="float:left;height:16px;width:{0}px;BACKGROUND:url(\'{1}\') 1px 0px no-repeat;" onclick=\'javascript:HyperLinkMgr.onClickLink(event, "3366", "'+a+'"); return false;\' onMouseOver=\'javascript:HyperLinkMgr.onMouseOver(event, "3366", "'+a+'"); return false;\' onMouseOut=\'javascript:HyperLinkMgr.onMouseOut(event, "3366", "'+a+'"); return false;\' onMouseMove=\'javascript:HyperLinkMgr.onMouseMove(event, "3366", "'+a+"\"); return false;'></div>"}}).snew()