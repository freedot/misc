/*******************************************************************************/
WorldBossRankDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.g_.regEvent(EVT.WORLDBOSS, 0, this, this._onWorldBossUpdate);
		HDRM.regHdrEx(this.g_, 'worldbosssvr', WorldBossSvrHdr);
	} 
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.worldboss.rankdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.rankdlg};
	}
	
	,_setCallers : function(){
		this.items_.getPersonGift.setCaller({self:this, caller:this._onClickGetPersonGift});
		this.items_.seeDropAllianceGift.setCaller({self:this, caller:this._onClickSeeDropAllianceGift});
		this.items_.getCountryGift.setCaller({self:this, caller:this._onClickGetCountryGift});
	}
	
	,_initInfo : function(){
		this._update();
		WorldBossrSender.sendGetRankInfo(this.g_);
	}	
	
	,_update : function(){
		if ( !this.isShow() ) return;
		this._updatePersonDate();
		this._updatePersonList();
		this._updateBtnsEnable();
		this._updateAllianceDate();
		this._updateAllianceList();
		this._updateCountryDate();
		this._updateCountryList();
	}
	
	,_updatePersonDate : function(){
		var s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.formatShortDate(this.g_.getSvrTimeS()) );
		TQ.setRichText(this.items_.persionDate, s );
	}
	
	,_updatePersonList : function(){
		var personRank = this.imgr_.getWorldBoss().prank;
		this.items_.personList.setItemCount(personRank.length);
		for ( var i=0; i<personRank.length; ++i ) {
			var item = this.items_.personList.getItem(i);
			var rank = personRank[i];
			TQ.setRichText(item.exsubs.rank, (i+1));
			item.exsubs.name.setId(i);
			item.exsubs.name.setText(rank.role);
			item.exsubs.name.setCaller({self:this, caller:this._onClickRoleName});
			var hurt = RStrUtil.formatResNumStr(rank.hurt);
			TQ.setRichText(item.exsubs.hurtNumber, TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber, hurt));
		}
	}
	
	,_updateBtnsEnable: function(){
		var today = this.imgr_.getWorldBoss().today;
		this.items_.getPersonGift.enable(today.gotPRankGift == 0);
		this.items_.getCountryGift.enable(today.gotCRankGift == 0);
	}
	
	,_updateAllianceDate : function(){
		var s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.formatShortDate(this.g_.getSvrTimeS()) );
		TQ.setRichText(this.items_.allianceDate, s );
	}
	
	,_updateAllianceList : function(){
		var allianceRank = this.imgr_.getWorldBoss().arank;
		this.items_.allianceList.setItemCount(allianceRank.length);
		for ( var i=0; i<allianceRank.length; ++i ) {
			var item = this.items_.allianceList.getItem(i);
			var rank = allianceRank[i];
			TQ.setRichText(item.exsubs.rank, (i+1));
			TQ.setRichText(item.exsubs.name, rank.alli);
			var hurt = RStrUtil.formatResNumStr(rank.hurt);
			TQ.setRichText(item.exsubs.hurtNumber, TQ.format(rstr.worldboss.rankdlg.lbl.hurtNumber, hurt));
		}
	}
	
	,_updateCountryDate : function(){
		var crankweek = this.imgr_.getWorldBoss().crankweek;
		var s = TQ.format(rstr.worldboss.rankdlg.lbl.randdateLbl, TQ.format(rstr.worldboss.rankdlg.lbl.weekLbl, crankweek) );
		TQ.setRichText(this.items_.countryDate, s );
	}
	
	,_updateCountryList : function(){
		var countryRank = this.imgr_.getWorldBoss().crank;
		this.items_.countryList.setItemCount(countryRank.length);
		for ( var i=0; i<countryRank.length; ++i ) {
			var item = this.items_.countryList.getItem(i);
			var rank = countryRank[i];
			TQ.setRichText(item.exsubs.rank, (i+1));
			TQ.setRichText(item.exsubs.name, rstr.comm.countrys[rank.country - FIXID.FIRSTSTATECITY]);
			TQ.setRichText(item.exsubs.times, TQ.format(rstr.worldboss.rankdlg.lbl.hurtTimes, rank.times));
		}
	}
	
	,_onClickRoleName : function(id){
		var rank = this.imgr_.getWorldBoss().prank[id];
		OutFieldSender.sendGetFieldDetailByRole(this.g_, rank.role);
	}
	
	,_onClickGetPersonGift : function(){
		WorldBossrSender.sendGetPersonRankGift(this.g_);
	}
	
	,_onClickSeeDropAllianceGift : function(){
		UIM.openDlg('worldbossalligift');
	}
	
	,_onClickGetCountryGift : function(){
		WorldBossrSender.sendGetCountryRankGift(this.g_);
	}
	
	,_onWorldBossUpdate : function(){
		this._update();
	}
});
