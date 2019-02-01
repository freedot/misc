/*******************************************************************************/
ActTowerDlg = BaseDlg.extern(function(){
	var m_this = null;
	var C_BTN_DELAY_MS = 300;
	this._init = function(){
		m_this = this;
		this.g_.regEvent(EVT.ROLESPECSTATE_CHANGE, 0, this, _onStateChange);
		this.g_.regEvent(EVT.NET, NETCMD.ACT_TOWER, this, this._onSvrPkg);
	};
	
	this._isCanOpen = function(){
		if ( this.g_.getImgr().getRoleRes().level < res_enter_tower_need_rolelevel ) {
			var msg = TQ.format(rstr.activity.tower.maindlg.tip.roleLevelNotArrived, res_enter_tower_need_rolelevel);
			this.g_.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return false;
		}
		return true;
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.activity.tower.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.maindlg};
	}; 
	
	this._setCallers = function(){
		this.items_.addRecoveryRateBtn.setCaller({self:this, caller:this._onClickAddRecoveryRateBtn});
		this.items_.buyBtn.setCaller({self:this, caller:this._onClickBuyItemBtn});
		this.items_.enterBtn.setCaller({self:this, caller:this._onClickEnterBtn});
	};	
	
	this._initInfo = function(){
		this.items_.enterBtn.setType(BTN_TYPE.DELAY);
		this.items_.enterBtn.setDelay(C_BTN_DELAY_MS);
		_clearBaseInfo();
		_updateUseRecoverLbl();
		this.items_.towerLayerRadio.select(0);
		ActTowerSender.sendGetBaseInfo(this.g_);
		UIM.getDlg('acttowerexped').reset();
	};
	
	this._onClickAddRecoveryRateBtn = function(){
		if (m_this.g_.getImgr().hasRoleState(RES_EFF.TOWER_RECOVER_SOLDIER)) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.tower.maindlg.tip.itemused);
			return;
		}
		UIM.openDlg('uselistitem', [RES_EFF.TOWER_RECOVER_SOLDIER], {id:0, name:'', type:RES_TRG.SELF_ROLE});
	};
	
	this._onClickBuyItemBtn = function(){
		UIM.getDlg('buyitem').openDlg({id:0, resid:FIXID.HEIMULING, number:100000});
	};
	
	this._onClickEnterBtn = function(){
		var imgr = m_this.g_.getImgr();
		var baseInfo = imgr.getActTower().baseInfo;		
		if ( baseInfo.today.freeTimes == baseInfo.today.maxTimes
			&& baseInfo.today.itemTimes == 0 
			&& imgr.getItemNumByResId(FIXID.HEIMULING) > 0 ) {
			m_this.g_.getGUI().msgBox(rstr.comm.msgts
				,rstr.activity.tower.maindlg.lbl.confirmUseItem
				,MB_F_YESNO, {self:m_this, caller:function(msgid){
				if ( msgid == MB_IDYES ) {
					m_this._enter();
				}
			}});
			return;
		}
		
		this._enter();
	};
	
	this._enter = function(){
		var idx = this.items_.towerLayerRadio.getCurSelId();
		var startLayers = [1, 41, 81];
		
		if (idx == 0){
			ActTowerSender.sendEnterTower(this.g_, startLayers[idx]);
			return;
		} 
		
		var baseInfo = this.g_.getImgr().getActTower().baseInfo;		
		if ( (baseInfo.maxLayer + 1) < startLayers[idx] ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.tower.maindlg.tip.cannotSkip);
			return;
		}
		
		UIM.getDlg('actskiplayer').openDlg({layer:startLayers[idx]});
	};
	
	this._onSvrPkg = function(netevent){
		_updateRanks(netevent.data.ranks);
		_updateBaseInfo(netevent.data.baseInfo);
		_enterTower(netevent.data.enterTower);
	};
	
	var _onStateChange = function(){
		_updateUseRecoverLbl();
	};
	
	var _updateRanks = function(ranks){
		if (!m_this.isShow()) return;
		if (!ranks) return;
		m_this.items_.rankingList.setItemCount(ranks.length);
		for ( var i=0; i<m_this.items_.rankingList.getCount(); ++i ){
			var item = m_this.items_.rankingList.getItem(i);
			var rank = ranks[i];
			TQ.setTextEx(item.exsubs.no, TQ.format(rstr.activity.tower.maindlg.lbl.no, rank.rank));
			TQ.setTextEx(item.exsubs.name, rank.name);
			TQ.setTextEx(item.exsubs.maxLayer, TQ.format(rstr.activity.tower.maindlg.lbl.maxLayer, rank.maxLayer));
		}
	};
	
	var _updateBaseInfo = function(baseInfo){
		if (!baseInfo) return;
		TQ.dictCopy(m_this.g_.getImgr().getActTower().baseInfo, baseInfo);
		
		if (!m_this.isShow()) return;
		TQ.setTextEx(m_this.items_.todayFreeTimes, TQ.format(rstr.activity.tower.maindlg.lbl.todayFreeTimes, baseInfo.today.freeTimes, baseInfo.today.maxTimes));
		TQ.setTextEx(m_this.items_.todayItemTimes, TQ.format(rstr.activity.tower.maindlg.lbl.todayItemTimes, baseInfo.today.itemTimes));
		TQ.setTextEx(m_this.items_.maxLayer, baseInfo.maxLayer);
	};
	
	var _enterTower = function(enterTower){
		if (!enterTower) return;
		
		m_this.hideDlg();
	};
	
	var _clearBaseInfo = function(){
		TQ.setTextEx(m_this.items_.todayFreeTimes, TQ.format(rstr.activity.tower.maindlg.lbl.todayFreeTimes, 0));
		TQ.setTextEx(m_this.items_.todayItemTimes, TQ.format(rstr.activity.tower.maindlg.lbl.todayItemTimes, 0));
		TQ.setTextEx(m_this.items_.maxLayer, 0);
	};
	
	var _updateUseRecoverLbl = function(){
		if ( !m_this.isShow() ) return;
		
		var lbl = rstr.activity.tower.maindlg.lbl.noUseRecoverItem;
		if (m_this.g_.getImgr().hasRoleState(RES_EFF.TOWER_RECOVER_SOLDIER)) {
			lbl = rstr.activity.tower.maindlg.lbl.useRecoverItem;
		}
		TQ.setTextEx(m_this.items_.usedItemTip, lbl);
	};

});

ActSkipLayerDlg = BaseDlg.extern(function(){
	this._getDlgCfg = function(){
		return {modal:true, title:rstr.activity.tower.skipLayerDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.skipLayerDlg};
	}; 
	
	this._setCallers = function(){
		this.items_.needBtn.setCaller({self:this, caller:this._onClickNeedBtn});
		this.items_.noNeedBtn.setCaller({self:this, caller:this._onClickNoNeedBtn});
	};	
	
	this._onClickNeedBtn = function(){
		this.dlg_.hide();
		UIM.openDlg('actgainskiplayergift', this.params_);
	};
	
	this._onClickNoNeedBtn = function(){
		this.dlg_.hide();
		ActTowerSender.sendEnterTower(this.g_, this.params_.layer);
	};
});

ActGainSkipLayerGiftDlg = BaseDlg.extern(function(){
	var m_this = null;
	this._init = function(){
		m_this = this;
	};
	
	this._getDlgCfg = function(){
		return {modal:true, title:rstr.activity.tower.gainSkipLayerGift.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.gainSkipLayerGift};
	}; 
	
	this._setCallers = function(){
		this.items_.gainBtn.setCaller({self:this, caller:this._onClickGainBtn});
		this.items_.noGainBtn.setCaller({self:this, caller:this._onClickNoGainBtn});
	};	
	
	this._initInfo = function(){
		var maxLayer = m_this.g_.getImgr().getActTower().baseInfo.maxLayer;
		var needGold = _getNeedGold();
		if ( m_this.g_.getImgr().hasVipEffect(VIP_EFF.SKIP_TOWER) ) {
			needGold += rstr.activity.tower.gainSkipLayerGift.vip;
		}
		var desc = TQ.format(rstr.activity.tower.gainSkipLayerGift.desc, maxLayer, this.params_.layer - 1, needGold);
		TQ.setTextEx(this.items_.desc, desc);
	};
	
	var _getNeedGold = function(){
		if ( m_this.g_.getImgr().hasVipEffect(VIP_EFF.SKIP_TOWER) ) {
			return 0;
		}
		
		var maxLayer = m_this.g_.getImgr().getActTower().baseInfo.maxLayer;
		if (m_this.params_.layer == 41){
			return 100 - maxLayer;
		} else {
			return 200 - maxLayer;
		}
	};
	
	this._onClickGainBtn = function(){
		if (this.g_.getImgr().getGold() < _getNeedGold()) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.tower.gainSkipLayerGift.tip.noEnoughGold );
			return;
		}
		
		this.dlg_.hide();
		ActTowerSender.sendEnterTower(this.g_, this.params_.layer, true);
	};
	
	this._onClickNoGainBtn = function(){
		this.dlg_.hide();
		ActTowerSender.sendEnterTower(this.g_, this.params_.layer);
	};
});