/*******************************************************************************/
WorldBossForceTabHdr = ExpedForceTabHdr.extern(function(){
	this.isNeedSingleHero = function(){
		return false;
	};
});

WorldBossSvrHdr = JClass.ex({
	init : function(g){
		this.g_ = g;
		this.imgr_ = this.g_.getImgr();
		this.g_.regEvent(EVT.NET, NETCMD.WORLDBOSS, this, this._onSvrPkg);
	}
	
	,_onSvrPkg : function(netevent){
		var data = netevent.data;
		if ( data.events ) {
			this.imgr_.getWorldBoss().events = data.events;
		}
		
		if ( data.today ) {
			TQ.dictCopy ( this.imgr_.getWorldBoss().today, data.today);
		}
		
		if ( data.prank ) {
			this.imgr_.getWorldBoss().prank = data.prank;
		}
		
		if ( data.arank ) {
			this.imgr_.getWorldBoss().arank = data.arank;
		}
		
		if ( data.crankweek ) {
			this.imgr_.getWorldBoss().crankweek = data.crankweek;
		}
		
		if ( data.crank ) {
			this.imgr_.getWorldBoss().crank = data.crank;
		}
		
		if ( data.alligifts ){
			this.imgr_.getWorldBoss().alligifts = data.alligifts;
		}
		
		if ( data.fightDemo ) {
			this.imgr_.getWorldBoss().fightDemo = data.fightDemo;
			this.imgr_.getWorldBoss().hurt = data.hurt;
			this.g_.sendEvent({eid:EVT.WORLDBOSS, sid:1});
		}
		
		this.g_.sendEvent({eid:EVT.WORLDBOSS, sid:0});
	}
});

WorldBossDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.forceTabHdr_ = null;
		this.g_.regEvent(EVT.WORLDBOSS, 0, this, this._onWorldBossUpdate);
		this.g_.regEvent(EVT.WORLDBOSS, 1, this, this._onFightDemo);
		this.g_.regEvent(EVT.HERO_UPDATE, 0, this, this._onHeroUpdate);
		HDRM.regHdrEx(this.g_, 'worldbosssvr', WorldBossSvrHdr);
	} 
	
	,_isCanOpen : function(){
		if ( !this.g_.getImgr().isInAlliance() ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.worldboss.maindlg.tip.needJoinAlliance);
			return false;
		}
		return true;
	}
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.worldboss.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.maindlg};
	}
	
	,_setCallers : function(){
		this.items_.changeForceBtn.setCaller({self:this, caller:this._onClickChangeForceBtn});
		this.items_.assignSoldierBtn.setCaller({self:this, caller:this._onClickAssignSoldierBtn});
		this.items_.treatmentBtn.setCaller({self:this, caller:this._onClickTreatmentBtn});
		this.items_.fightBtn.setCaller({self:this, caller:this._onClickFightBtn});
		this.items_.getTodayGift.setCaller({self:this, caller:this._onClickGetTodayGift});
		this.items_.seeRankDlg.setCaller({self:this, caller:this._onClickSeeRankDlg});
		this.items_.guwuOneTimeBtn.setCaller({self:this, caller:this._onClickGuwuOneTimeBtn});
		this.items_.guwuTimesBtn.setCaller({self:this, caller:this._onClickGuwuTimesBtn});
	}
	
	,_afterCreate : function(){
		this.forceTabHdr_ = WorldBossForceTabHdr.snew(this.g_, this.items_);
	}

	,_initInfo : function(){
		this._update();
		var saveForce = this.g_.getImgr().getSaveForceByType(FORCELINE_TYPE.WORLDBOSS);
		this._updateForceTab(saveForce.lineup, saveForce.heros);
		WorldBossrSender.sendGetInfo(this.g_);
		this.items_.guwuType.select(0);
	}	
	
	,_update : function(){
		if ( !this.isShow() ) return;
		this._updateEventsList();
		this._updateBtnsEnable();
		this._updateLeftTimes();
		this._updateGuwuLevel();
	}
	
	,_updateEventsList : function(){
		var events = this.imgr_.getWorldBoss().events;
		this.items_.eventList.setItemCount(events.length);
		for ( var i=0; i<events.length; ++i ) {
			var item = this.items_.eventList.getItem(i);
			var event = events[i];
			var hurt = RStrUtil.formatResNumStr(event.hurt);
			var desc = TQ.format(rstr.worldboss.maindlg.lbl.event, event.role, hurt, TQ.formatShortDateTime(event.time));
			TQ.setRichText(item.exsubs.desc, desc);
		}
	}
	
	,_updateBtnsEnable : function(){
		var today = this.imgr_.getWorldBoss().today;
		this.items_.fightBtn.enable(today.times < today.maxTimes);
		this.items_.getTodayGift.enable(today.gotGift == 0);
		this.items_.guwuOneTimeBtn.enable(today.guwu < today.maxGuwu);
		this.items_.guwuTimesBtn.enable(today.guwu < today.maxGuwu);
	}
	
	,_updateLeftTimes : function(){
		var today = this.imgr_.getWorldBoss().today;
		TQ.setRichText(this.items_.todayTimes, TQ.format(rstr.worldboss.maindlg.lbl.todaytimes, today.maxTimes - today.times));
	}
	
	,_updateGuwuLevel : function(){
		var today = this.imgr_.getWorldBoss().today;
		TQ.setRichText(this.items_.guwuLevel, today.guwu + '/' + today.maxGuwu);
		TQ.setRichText(this.items_.addAttackPer, (today.guwu*10) + '%');
	}
	
	,_updateForceTab : function(lineup, heroIds){
		this.forceTabHdr_.setLineup(lineup, heroIds);
		this._updateMyFightCap();
	}
	
	,_onClickChangeForceBtn : function(){
		var dlg = UIM.getDlg('assignheros');
		dlg.setCaller({self:this, caller:this._updateForceTabAndSendSave});
		dlg.openDlg();
	}
	
	,_onClickAssignSoldierBtn : function(){
		UIM.openDlg('assignsoldiers');
	}
	
	,_onClickTreatmentBtn : function(){
		TreatmentHeroHdr.treatmentHeros(this.g_, this.forceTabHdr_.getHeroIds());
	}	
	
	,_onClickFightBtn : function(){
		var canExpedHeroIds = this.forceTabHdr_.getCanExpedHeros();
		if ( !ExpedHerosChecker.isValid(this.g_, canExpedHeroIds, EXPED_TYPE.ACT_WORLDBOSS) ) {
			return false;
		}
		this._sendExpeditionCmdAndCloseDlg();
		return true;
	}
	
	,_onClickGetTodayGift : function(){
		WorldBossrSender.sendGetTodayGift(this.g_);
	}
	
	,_onClickSeeRankDlg : function(){
		UIM.openDlg('worldbossrank');
	}
	
	,_onClickGuwuOneTimeBtn : function(){
		WorldBossrSender.sendGuwu(this.g_, this.items_.guwuType.getCurSelId(), 1);
	}
	
	,_onClickGuwuTimesBtn : function(){
		var g = this.g_;
		var today = this.imgr_.getWorldBoss().today;
		var guwuType = this.items_.guwuType.getCurSelId();
		var lefttimes = today.maxGuwu - today.guwu;
		var unit = rstr.comm.gold;
		var per = 100;
		if ( guwuType == 1 ) {
			unit = rstr.comm.giftgold;
			per = 50;
		}
		var msg = TQ.format(rstr.worldboss.maindlg.tip.guwuTimes, lefttimes, unit, per);
		this.g_.getGUI().msgBox(rstr.comm.msgts, msg ,MB_F_YESNO, {self:this, caller:function(id){
				if ( id == MB_IDYES ) WorldBossrSender.sendGuwu(g, guwuType, lefttimes);
			}} );
	}
	
	,_sendExpeditionCmdAndCloseDlg : function(){
		var target = this._getTargetRes().copyField;
		target.objType = OBJ_TYPE.COPYFIELD;
		target.type = OBJ_TYPE.COPYFIELD;
		var expedType = EXPED_TYPE.ACT_WORLDBOSS;
		var heroIds = this.forceTabHdr_.getExpedHerosInLineup();
		var lineupId = this.forceTabHdr_.getLineup();
		WorldBossrSender.sendExped(this.g_, target, expedType, lineupId, heroIds);
		this.hideDlg();
	}
	
	,_getTargetRes : function(){
		var copyField = ItemResUtil.findItemres(FIXID.WORLDBOSSFIELD);
		var lineupRes = ItemResUtil.findItemres(copyField.lineup);
		return {copyField:copyField, lineupRes:lineupRes};
	}
	
	,_updateForceTabAndSendSave : function(lineup, heroIds){
		this._updateForceTab(lineup, heroIds);
		MilitarySender.sendSaveForceLineUp(this.g_, FORCELINE_TYPE.WORLDBOSS, lineup, heroIds);
		TQ.dictCopy(this.g_.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.WORLDBOSS, lineup:lineup, heros:heroIds}] );
	}
	
	,_onWorldBossUpdate : function(){
		this._update();
	}
	
	,_onFightDemo : function(){
		var THIS = this;
		this.hideDlg();		
		var dlg = UIM.getDlg('fightmap');
		dlg.setHideCaller({self:this, caller:function(){
			THIS.openDlg();
			dlg.setHideCaller(null);
		}});
		var fightDemo = this.imgr_.getWorldBoss().fightDemo;
		var hurt = this.imgr_.getWorldBoss().hurt;
		dlg.openDlg(fightDemo.armyId, fightDemo.fightId, {type:'worldboss', hurt:hurt});
	}
	
	,_onHeroUpdate : function(){
		if ( !this.isShow() ) return;
		this._updateMyFightCap();
	}
	
	,_updateMyFightCap : function(){
		this.forceTabHdr_.refresh();
		var heroIds = this.forceTabHdr_.getHeroIds();
		TQ.setTextEx(this.items_.myFightCap, HerosUtil.getHerosFightCap(this.g_, heroIds));
	}
});
