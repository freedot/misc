/*******************************************************************************/
WorldBossAlliGiftDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.g_.regEvent(EVT.WORLDBOSS, 0, this, this._onWorldBossUpdate);
		HDRM.regHdrEx(this.g_, 'worldbosssvr', WorldBossSvrHdr);
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.worldboss.allidropgiftdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.allidropgiftdlg};
	}
	
	,_initInfo : function(){
		WorldBossrSender.sendGetAlliGiftInfo(this.g_);
	}
	
	,_onWorldBossUpdate : function(){
		if ( !this.isShow() ) return;
		this._updateCon();
	}
	
	,_updateCon : function(){
		var alligifts = this.imgr_.getWorldBoss().alligifts;
		var s = '';
		for ( var alliIdx=0; alliIdx<alligifts.length; ++alliIdx ) {
			var alligift = alligifts[alliIdx];
			s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.alliName, alligift.alli) + '<br/>';
			for ( var dropIdx=0; dropIdx<alligift.drops.length ; ++dropIdx ) {
				var drop = alligift.drops[dropIdx];
				var res = ItemResUtil.findItemres(drop.id);
				var name = ItemNameColorGetter.getColorVal(res.level, res.name);
				s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.dropItem, name, drop.num) + '<br/>';
			}
		}
		TQ.setRichText(this.items_.dropsCon.getContainerObj(), s);
		this.items_.dropsCon.refresh();
	}
});
