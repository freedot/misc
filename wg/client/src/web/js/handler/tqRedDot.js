/*******************************************************************************/
RedDot = JClass.ex({
	init : function(g){
		this.g_ = g;
		this.actValCanGetOrSignChecker_ = ActivityValCanGetOrSignChecker.snew(this.g_);
		this.activityValTaskUtil_ = ActivityValTaskUtil.snew(this.g_);
		this._regEvents();
	}
	
	,_regEvents : function(){
		this.g_.regUpdater(this, this._onUpdate, 30000);
		this.g_.regEvent(EVT.LETTERUPDATE, 0, this, this._onLetterUpdate);
		this.g_.regEvent(EVT.PKG_CHANGE, 0, this, this._onItemChanged);
		this.g_.regEvent(EVT.AUTOBUILD, 0, this, this._onAutoBuild);
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRoleAttrChanged);
		this.g_.regEvent(EVT.TASKCHANGE, 0, this, this._onTaskChanged);
		this.g_.regEvent(EVT.TASKCHANGE, 1, this, this._onTaskChanged);
		this.g_.regEvent(EVT.TASKCHANGE, 2, this, this._onTaskChanged);
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onTaskChanged);
		this.g_.regEvent(EVT.FARMINFO, 2, this, this._onFarmInfo);
		this.g_.regEvent(EVT.ACTIVITY_VAL, 0, this, this._onActivityValChange);
		this.g_.regEvent(EVT.UPD_ACT_VAL_REDDOT, 0, this, this._onActivityValChange);
		this.g_.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, this, this._onArmys);
		this.g_.regEvent(EVT.SALLIANCE_ARMY_UPDATE, 0, this, this._onArmys);
	}
	
	,_onUpdate : function(){
		this._onActivityValChange();
	}
	
	,_onLetterUpdate : function(){
		var mails = this.g_.getImgr().getLetterRes().all;
		var hasNewMail = false;
		for ( var i=0; i<mails.length; ++i ) {
			if ( mails[i].read == 0 ) {
				hasNewMail = true;
				break;
			}
		}
		
		var letterBtn = UIM.getPanel('main').getSmallMapBtnBar().getBtn('letter');
		letterBtn.setNewFlag(hasNewMail);
	}
	
	,_onItemChanged : function(){
		var hasCanExchange = ( UIM.getDlg('exchange').hasCanExChangeItem(0) 
			|| UIM.getDlg('exchange').hasCanExChangeItem(1) );
		var changeBtn = UIM.getDlg('package').getCtrl('exchangebtn');
		if (changeBtn) {
			changeBtn.setNewFlag(hasCanExchange);
		}
	}
	
	,_onAutoBuild : function(){
		var autoBtn = UIM.getPanel('main').getTraceBar().getBtn('autobuild');
		var autoBuild = this.g_.getImgr().getAutoBuild();
		var canDo = autoBuild.max > 0 && (autoBuild.starting == 0 || autoBuild.list.length == 0);
		autoBtn.setNewFlag(canDo);
	}
	
	,_onRoleAttrChanged : function(){
		var roleBtn = UIM.getPanel('main').getToolbar().getBtn('role');
		roleBtn.setNewFlag(this.g_.getImgr().getRoleAttrVal(ATTR.PP) > 0);
	}
	
	,_onTaskChanged : function(){
		var taskBtn = UIM.getPanel('main').getToolbar().getBtn('task');
		taskBtn.setNewFlag(UIM.getDlg('task').hasCanGetGifts());
	}
	
	,_onFarmInfo : function(){
		var hasCompleteBlock = false;
		var myfarm = this.g_.getImgr().getMyFarm();
		for ( var i=0; i<myfarm.blocks.length; ++i ) {
			var block = myfarm.blocks[i];
			if ( block.resid == FIXID.EMPTYFARMBLOCK ) continue;
			if ( block.resid == FIXID.NEXTFARMBLOCK ) continue;
			if ( block.state == FARM_STATE.COMPLETE ) {
				hasCompleteBlock = true;
				break;
			}
		}
		var myfarmBtn = UIM.getPanel('main').getSelCityTool().getBtn('myfarm');
		myfarmBtn.setNewFlag(hasCompleteBlock);
	}
	
	,_onActivityValChange : function(){
		var actBtn = UIM.getPanel('main').getTraceBar().getBtn( 'act');
		actBtn.setNewFlag(this.actValCanGetOrSignChecker_.hasCanGetReward()
			|| this.actValCanGetOrSignChecker_.hasCanSign()
			|| this.actValCanGetOrSignChecker_.hasCanGetSignReward()
			|| this.activityValTaskUtil_.hasRedDot());
	}
	
	,_onArmys : function(){
		var personalArmys = this.g_.getImgr().getArmys().list;
		var samealliArmy = this.g_.getImgr().getArmys().samealli;
		var militaryBtn = UIM.getPanel('main').getToolbar().getBtn('military');
		militaryBtn.setNewFlag(personalArmys.length > 0 || samealliArmy.length > 0);
	}
});
