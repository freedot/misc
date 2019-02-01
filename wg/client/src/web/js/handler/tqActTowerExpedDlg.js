/*******************************************************************************/
ActTowerForceTabHdr = ExpedForceTabHdr.extern(function(){
	this.isNeedSingleHero = function(){
		return false;
	};
});

HerosUtil = JClass.ex({
	getHerosFightCap : function(g, heroIds){
		var fightCapSum = 0;
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = g.getImgr().getHero( heroId );
			if ( !hero ) continue;
			
			fightCapSum += g.getImgr().getHeroAttrVal(hero, ATTR.FC);
		}
		return fightCapSum;
	}
}).snew();

ExpedHerosChecker = Class.extern(function(){
	var m_this = null;
	this.g_ = null;
	this.isValid = function(g, canExpedHeroIds, expedType) {
		m_this = this;
		this.g_ = g;
		
		if ( _isEmptyHeros(canExpedHeroIds) ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noAssignHeros);
			return false;
		}
		
		if ( _hasDeepWoundHero(canExpedHeroIds) ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noHealth);
			return false;
		}
		
		if ( !_isHeroExped(expedType) && _hasNoCarrySoldierHero(canExpedHeroIds) ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noCarrySoldiers);
			return false;
		}
		
		var busyHeros = _getBusyHeros(expedType, canExpedHeroIds);
		if ( busyHeros != '' ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, TQ.format(rstr.expeddlg.err.hasBusyHero, busyHeros));
			return false;
		}
		
		return true;
	};
	
	var _hasDeepWoundHero = function(heroIds){
		var imgr = m_this.g_.getImgr();
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = imgr.getHero(heroId);
			if ( !hero ) continue;
			
			var healthVal = imgr.getHeroAttrVal(hero, ATTR.HEALTH);
			if ( res_gethealthtype(healthVal) == HEALTH_TYPE.DEEP_WOUND ) return true;
		}
		return false;
	};
	
	var _hasNoCarrySoldierHero = function(heroIds){
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = m_this.g_.getImgr().getHero(heroId);
			if ( !hero ) continue;
			if ( !hero.soldier ) return true;
			if ( hero.soldier.number == 0 ) return true;
		}
		return false;
	};
	
	var _getBusyHeros = function(expedType, heroIds){
		var busyHeros = '';
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = m_this.g_.getImgr().getHero(heroId);
			if ( !hero ) continue;
			if ( _isCanExped(hero, expedType) ) continue;
			
			busyHeros += ' ' + hero.name;
		}
		if ( busyHeros != '' ) {
			busyHeros += ' ';
		}
		return busyHeros;
	};
	
	var _isEmptyHeros = function(heroIds){
		var heroCount = 0;
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = m_this.g_.getImgr().getHero(heroId);
			if ( !hero ) continue;
			heroCount++;
		}
		return heroCount == 0;
	};
	
	var _isCanExped = function(hero, expedType){
		if ( hero.state == HERO_STATE.FREE ) return true;
		if ( hero.state == HERO_STATE.ACT_TERRACE && expedType == EXPED_TYPE.ACT_TERRACE ) return true;
		if ( hero.state == HERO_STATE.ACT_TOWER && expedType == EXPED_TYPE.ACT_TOWER ) return true;
		if ( hero.state == HERO_STATE.ACT_TOWER && expedType == EXPED_TYPE.ACT_TOWER ) return true;
		if ( hero.state == HERO_STATE.ACT_WORLDBOSS && expedType == EXPED_TYPE.ACT_WORLDBOSS ) return true;
		return false;
	};
	
	var _isHeroExped = function(expedType){
		return (expedType == EXPED_TYPE.DANTIAO) 
			|| (expedType == EXPED_TYPE.TIAOXIN) 
			|| (expedType == EXPED_TYPE.ACT_TERRACE);
	};
}).snew();

ActTowerExpedDlg = BaseDlg.extern(function(){
	var c_lifeStarWidth = 30;
	var c_minAutoFightLayer = 10;
	var c_maxLayer = 100;
	var m_this = null;
	var m_lastGetItems = [];
	this.enterTower_ = {stopTime:0};
	this.forceTabHdr_ = null;
	this.isAutoFight_ = false;
	this.autoToLayer_ = 0;
	this.running_ = false;
	this.lastLifes_ = 0;
	this.checkAutoFightTimes_ = 0;
	
	this.reset = function(){
		m_lastGetItems = [];
		this.running_ = false;
		this._stopAutoFight();
	};
	
	this.isRunning = function(){
		return this.running_;
	};
	
	this.forceShow = function(){
		if ( this.dlg_ ) {
			this.dlg_.show();
			this._initUpdate();
		}
	};
	
	this._init = function(){
		m_this = this;
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.g_.regEvent(EVT.NET, NETCMD.ACT_TOWER, this, this._onSvrPkg);
		this.g_.regEvent(EVT.ROLESPECSTATE_CHANGE, 0, this, _onStateChange);
		this.g_.regEvent(EVT.HERO_UPDATE, 0, this, this._onHeroUpdate);
		this.g_.regEvent(EVT.SAVE_FORCES, 0, this, this._onCheckAutoFight);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.activity.tower.expeddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.expeddlg};
	}; 
	
	this._setCallers = function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
		this.items_.showGetGiftsBtn.setCaller({self:this, caller:this._onClickShowGetGiftsBtn});
		this.items_.addRecoveryRateBtn.setCaller({self:this, caller:this._onClickAddRecoveryRateBtn});
		this.items_.vsBtn.setCaller({self:this, caller:this._onClickVSBtn});
		this.items_.autoFightBtn.setCaller({self:this, caller:this._onClickAutoFightBtn});
		this.items_.changeForceBtn.setCaller({self:this, caller:this._onClickChangeForceBtn});
		this.items_.assignSoldierBtn.setCaller({self:this, caller:this._onClickAssignSoldierBtn});
		this.items_.treatmentBtn.setCaller({self:this, caller:this._onClickTreatmentBtn});
		this.items_.exitBtn.setCaller({self:this, caller:this._onClickExitBtn});
		TTIP.setCallerData(this.items_.tooltips['$autoFight'], {self:this, caller:this._onGetAutoFightBtnTip}, {});
	};
	
	this._afterCreate = function(){
		_setLayerGiftsList();
		this.forceTabHdr_ = ActTowerForceTabHdr.snew(this.g_, this.items_);
	};	
	
	var _setLayerGiftsList = function(){
		var list = m_this.items_.layerGiftsList;
		list.setItemCount(10);
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			var layerIdx = (i + 1)*10 - 1;
			var layerResId = FIXID.ACT_TOWER_STARTID + layerIdx;
			var layerRes = ItemResUtil.findItemres(layerResId);
			IMG.setBKImage(item.exsubs.icon, layerRes.itemicon ? IMG.makeBigImg( layerRes.itemicon ) : '');
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:m_this._onGettLayerGiftTip}, {idx:i});
		}
	};
	
	this._showDlg = function(){
		if ( !this.isAutoFight_ ){
			this.dlg_.show();
		}
	};
	
	this._initInfo = function(){
		this.enterTower_ = this.params_;
		this._initUpdate();
		this.lastLifes_ = this.enterTower_.leftLifes;
	};
	
	this._initUpdate = function(){
		_setTitle();
		_stopAutoFightWhenArriveMax();
		_stopAutoFightWhenLossLife();
		
		_setCurLayerArrawPosition();
		_setLastLayerInfo();
		_setLeftTime();
		_setBtnsStateByLeftTime();
		_setAutoFightBtnTextByAutoFightFlag();
		_updateLeftLifes();
		_updateUseRecoverLbl();
		_setEnemyInfo();
		this.g_.regUpdater(this, this._onUpdate, 1000);
		var saveForce = this.g_.getImgr().getSaveForceByType(FORCELINE_TYPE.ACTTOWER);
		this._updateForceTab(saveForce.lineup, saveForce.heros);
	};
	
	var _setTitle = function(){
		m_this.dlg_.setTitle(TQ.format(rstr.activity.tower.maindlg.dtitle, _getFactCurLayer()));
	};
	
	var _stopAutoFightWhenArriveMax = function(){
		if ( !m_this.isAutoFight_ ) return;
		if ( m_this.enterTower_.curLayer > m_this.autoToLayer_ ) {
			m_this._stopAutoFight();
		}
	};
	
	var _stopAutoFightWhenLossLife = function(){
		if ( !m_this.isAutoFight_ ) return;
		if ( m_this.enterTower_.leftLifes < m_this.lastLifes_ ) {
			m_this._stopAutoFight();
		}
	};
	
	var _setCurLayerArrawPosition = function(){
		var left = 23;
		var itemW = 62;
		var arrawW = 18;
		var idx = Math.floor(m_this.enterTower_.curLayer/10);  
		idx = Math.min(idx, 9);
		var x = left + idx*itemW + (itemW - arrawW)/2;
		TQ.setCSS(m_this.items_.curLayerArrow, 'left', x + 'px');
	};
	
	var _setLastLayerInfo = function(){
		if (!m_this.enterTower_.lastLayerInfo) {
			TQ.setCSS(m_this.items_.lastLayerInfo, 'display', 'none');
			return;
		}
		
		TQ.setCSS(m_this.items_.lastLayerInfo, 'display', 'block');

		var lastLayerInfo = m_this.enterTower_.lastLayerInfo;
		var fightResult = rstr.activity.tower.expeddlg.fightResults[lastLayerInfo.fightResult];
		var itemDesc = _makeItemDesc(lastLayerInfo.gift.items);
		var msg = TQ.format(rstr.activity.tower.expeddlg.tip.lastLayerInfo, lastLayerInfo.layer, fightResult, lastLayerInfo.gift.heroExp, itemDesc);
		TQ.setTextEx(m_this.items_.lastLayerInfo, msg);
	};
	
	var _makeItemDesc = function(items){
		if (!items.length) return rstr.activity.tower.expeddlg.noItem;
		
		var s = '';
		for ( var i=0; i<items.length; ++i ) {
			var item = items[i];
			s += RStrUtil.getItemColorNameByResId(item.id) + rstr.comm.numPrefix + item.number;
		}
		
		return s;
	};
	
	var _setLeftTime = function(){
		if (_getLeftTime() == 0) {
			TQ.setTextEx(m_this.items_.leftTime, '');
			return;
		} 
		var sleftTime = TQ.formatTime(0, _getLeftTime());
		TQ.setTextEx(m_this.items_.leftTime, TQ.format(rstr.activity.tower.expeddlg.leftTime, sleftTime));
	};
	
	var _setBtnsStateByLeftTime = function(){
		m_this.items_.vsBtn.enable((_getLeftTime() == 0) && !m_this.isAutoFight_ );
		if ( m_this.isAutoFight_ ) {
			m_this.items_.autoFightBtn.enable(true);
		} else {
			m_this.items_.autoFightBtn.enable(_getLeftTime() == 0 && _isCanAutoFight() );
		}
	};
	
	var _isCanAutoFight = function(){
		var maxLayer = m_this.g_.getImgr().getActTower().baseInfo.maxLayer;
		return (m_this.enterTower_.curLayer > c_minAutoFightLayer) || (maxLayer >= c_minAutoFightLayer);
	};
	
	var _formatStopTime = function(enterTower){
		if (enterTower.stopTime && m_this.g_.getSvrTimeS() >= enterTower.stopTime ) {
			enterTower.stopTime = m_this.g_.getSvrTimeS() + 1;
		}
	};
	
	var _getLeftTime = function(){
		var stopTime = m_this.enterTower_.stopTime ? m_this.enterTower_.stopTime : 0;
		var leftTime = stopTime - m_this.g_.getSvrTimeS();
		if (leftTime < 0) leftTime = 0;
		return leftTime;
	};
	
	var _setAutoFightBtnTextByAutoFightFlag = function(){
		m_this.items_.autoFightBtn.setText(m_this.isAutoFight_ ? 
			rstr.activity.tower.expeddlg.btn.cancelAutoFight : rstr.activity.tower.expeddlg.btn.autoFight );
	};	
	
	var _updateLeftLifes = function(){
		TQ.setDomWidth(m_this.items_.leftLifes, m_this.enterTower_.leftLifes*c_lifeStarWidth );
	};
	
	var _updateUseRecoverLbl = function(){
		if ( !m_this.isShow() ) return;
		var lbl = rstr.activity.tower.maindlg.lbl.noUseRecoverItem;
		if (m_this.g_.getImgr().hasRoleState(RES_EFF.TOWER_RECOVER_SOLDIER)) {
			lbl = rstr.activity.tower.maindlg.lbl.useRecoverItem;
		}
		TQ.setTextEx(m_this.items_.usedItemTip, lbl);
	};
	
	var _setEnemyInfo = function(){
		_setEnemyLineUpName();
		_setEnemyFightCap();
		_setEnemyForceTabList();
	};
	
	var _setEnemyLineUpName = function(){
		var res = _getTargetRes();
		TQ.setTextEx(m_this.items_.enemyLineupName, res.lineupRes.name);
	};
	
	var _setEnemyFightCap = function(){
		var res = _getTargetRes();
		var fightCap = 0;
		for ( var i=0; i<res.copyField.heros.length; ++i ) {
			var fieldHero = ItemResUtil.findItemres(res.copyField.heros[i]);
			fightCap += fieldHero.fightcap;
		}
		TQ.setTextEx(m_this.items_.enemyFightCap, fightCap);
	};
	
	var _setEnemyForceTabList = function(){
		var res = _getTargetRes();
		for ( var gridIdx=0, heroIdx=0; gridIdx<m_this.items_.enemyForceTabList.getCount(); ++gridIdx ) {
			var item = m_this.items_.enemyForceTabList.getItem(gridIdx);
			if ( gridIdx != res.lineupRes.grids[heroIdx] ) {
				TQ.setTextEx(item.exsubs.name, '');
				continue;
			} 
			var fieldHero = ItemResUtil.findItemres(res.copyField.heros[heroIdx++]);
			TQ.setTextEx(item.exsubs.name, rstr.comm.heroprofs[fieldHero.prof]);
		}
	};
	
	var _getTargetRes = function(){
		var curLayer = _getFactCurLayer();
		var resId = FIXID.ACT_TOWER_STARTID + curLayer - 1; 
		var copyField = ItemResUtil.findItemres(resId);
		var lineupRes = ItemResUtil.findItemres(copyField.lineup);
		return {copyField:copyField, lineupRes:lineupRes};
	};
	
	var _getFactCurLayer = function(){
		return Math.min(m_this.enterTower_.curLayer, c_maxLayer);
	};
	
	var _onStateChange = function(){
		_updateUseRecoverLbl();
	};
	
	this._onLoginOk = function(){
		ActTowerSender.sendCheckAutoFight(this.g_);
	};
	
	this._onSvrPkg = function(netevent){
		if ( netevent.data.autoFight ) {
			this.autoToLayer_ = netevent.data.autoToLayer;
			this._onCheckAutoFight();
			return;
		}
		
		if ( this._isNeedShowFightDemo(netevent.data.enterTower) ) {
			this._showFightDemo(netevent.data.enterTower);
		} else {
			_enterTower(netevent.data.enterTower);
		}
	};
	
	this._onCheckAutoFight = function(){
		this.checkAutoFightTimes_++;
		if ( this.checkAutoFightTimes_ < 2 ) return;
		
		this.isAutoFight_ = true;
		ActTowerSender.sendGetBaseInfo(this.g_);
	};
	
	this._isNeedShowFightDemo = function(enterTower) {
		return !this.isAutoFight_ && enterTower && enterTower.fightDemo;
	};
	
	this._showFightDemo = function(enterTower){
		this.hideDlg();		
		var dlg = UIM.getDlg('fightmap');
		dlg.setHideCaller({self:this, caller:function(){
			_enterTower(enterTower);
			dlg.setHideCaller(null);
		}});
		dlg.openDlg(enterTower.fightDemo.armyId, enterTower.fightDemo.fightId);
	};
	
	var _enterTower = function(enterTower){
		if (!enterTower) return;
		
		_formatStopTime(enterTower);
		
		if ( enterTower.isExit ) {
			m_this.running_ = false;
		} else {
			m_this.running_ = true;
		}
		
		m_this.enterTower_ = enterTower;
		
		if (enterTower.leftLifes == 0) {
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, rstr.activity.tower.expeddlg.tip.noLifeSysTip);
			m_this._stopAutoFight();
			return;
		}
		
		if ( m_this._isPassLayer(enterTower.curLayer) ){
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, rstr.activity.tower.expeddlg.tip.passLayerSysTip);
			m_this._stopAutoFight();
			return;
		}
		
		_saveLastGiftItems(enterTower.lastLayerInfo);
		m_this.openDlg(enterTower);
	};
	
	this._isPassLayer = function(curLayer){
		return curLayer > c_maxLayer;
	};
	
	var _saveLastGiftItems = function(lastLayerInfo){
		if ( !lastLayerInfo ) return;
		for ( var i=0; i<lastLayerInfo.gift.items.length; ++i ) {
			m_lastGetItems.push( lastLayerInfo.gift.items[i] );
		}
	};
	
	this._onUpdate = function(){
		_setLeftTime();
		_setBtnsStateByLeftTime();
		this._checkStopFight();
		this._onAutoFight();
	};
	
	this._checkStopFight = function(){
		if ( this.isShow() 
			&& !this._hasLeftLifes() 
			&& this._isArriveStopTime() ) {
			this._popCloseMsgBox(rstr.activity.tower.expeddlg.tip.noLifeMsgTip);
		} else if ( this.isShow() 
			&& this._isPassLayer(this.enterTower_.curLayer)
			&& this._isArriveStopTime() ) {
			this._popCloseMsgBox(rstr.activity.tower.expeddlg.tip.passLayerMsgTip);
		}			
	};
	
	this._popCloseMsgBox = function(tipMsg){
		this.g_.getGUI().msgBox(rstr.comm.msgts,tipMsg, MB_F_CLOSE, 
			{self:this, caller:function(){
			m_this._stopAutoFight();
			m_this.running_ = false;
			m_this.hideDlg();
		}});	
	};
	
	this._onAutoFight = function(){
		if ( !m_this.isAutoFight_ ) return;
		if ( m_this.enterTower_.leftLifes == 0 ) return;
		if ( _getLeftTime() > 0 ) return;
		
		var fillHdr = FillSoldiersHdr.snew(this.g_, null, SoldierSender);
		fillHdr.setHeros(this.forceTabHdr_.getFreeHeros());
		fillHdr.fillAll();
		
		this._onClickTreatmentBtn();
		
		if ( !this._onClickVSBtn() ) {
			this._stopAutoFight();
		}
	};
	
	this._hasLeftLifes = function(){
		return this.enterTower_.leftLifes > 0;
	};
	
	this._isArriveStopTime = function(){
		return this.g_.getSvrTimeS() >= this.enterTower_.stopTime;
	};		
	
	this._onGetAutoFightBtnTip = function(){
		if ( !_isCanAutoFight() ) {
			return rstr.activity.tower.expeddlg.tip.autoFightBtnTip;
		} else {
			return '';
		}
	};
	
	this._onGettLayerGiftTip = function(data){
		var tipLayer = (data.idx + 1)*10;
		var layerResId = FIXID.ACT_TOWER_STARTID + tipLayer - 1;
		var copyField = ItemResUtil.findItemres(layerResId);
		if ( !copyField.itemicontip || copyField.itemicontip == '' ) return '';
		return TQ.format(rstr.activity.tower.expeddlg.tip.layerDropTip, tipLayer) + copyField.itemicontip;
	};
	
	this._onDlgEvent = function(id){
		if (id == C_SYS_DLG_HIDE && !this.running_ ) {
			this.g_.unregUpdater(this, this._onUpdate);
		}
	};
	
	this._onClickShowGetGiftsBtn = function(){
		UIM.getDlg('acttowerlastgetgifts').openDlg(m_lastGetItems);
	};
	
	this._onClickAddRecoveryRateBtn = function(){
		if (m_this.g_.getImgr().hasRoleState(RES_EFF.TOWER_RECOVER_SOLDIER)) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.tower.maindlg.tip.itemused);
			return;
		}
		UIM.openDlg('uselistitem', [RES_EFF.TOWER_RECOVER_SOLDIER], {id:0, name:'', type:RES_TRG.SELF_ROLE});
	};
	
	this._onClickChangeForceBtn = function(){
		var dlg = UIM.getDlg('assignheros');
		dlg.setCaller({self:this, caller:this._updateForceTabAndSendSave});
		dlg.openDlg();
	};
	
	this._updateForceTabAndSendSave = function(lineup, heroIds){
		this._updateForceTab(lineup, heroIds);
		MilitarySender.sendSaveForceLineUp(this.g_, FORCELINE_TYPE.ACTTOWER, lineup, heroIds);
		TQ.dictCopy(this.g_.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.ACTTOWER, lineup:lineup, heros:heroIds}] );
	};
	
	this._updateForceTab = function(lineup, heroIds){
		this.forceTabHdr_.setLineup(lineup, heroIds);
		this.forceTabHdr_.refresh();
		TQ.setTextEx(this.items_.myFightCap, _getHerosFightCap(heroIds));
	};
	
	this._onClickAssignSoldierBtn = function(){
		UIM.openDlg('assignsoldiers');
	};
	
	this._onClickTreatmentBtn = function(){
		TreatmentHeroHdr.treatmentHeros(this.g_, this.forceTabHdr_.getHeroIds());
	};
	
	this._onClickExitBtn = function(){
		this.g_.getGUI().msgBox(rstr.comm.msgts ,rstr.activity.tower.expeddlg.tip.confirmExit ,MB_F_YESNO ,{self:this, caller:function(msgid){
			if ( msgid == MB_IDYES ) {
				ActTowerSender.sendLeaveTower(m_this.g_);
				m_this.dlg_.hide();
			}
		}});
	};
	
	this._onClickVSBtn = function(){
		var canExpedHeroIds = this.forceTabHdr_.getCanExpedHeros();
		if ( !ExpedHerosChecker.isValid(this.g_, canExpedHeroIds, EXPED_TYPE.ACT_TOWER) ) {
			return false;
		}
		_sendExpeditionCmdAndCloseDlg();
		return true;
	};
	
	this._onClickAutoFightBtn = function(){
		if ( !this.isAutoFight_ ) {
			var inputdlg = UIM.getDlg('inputnum');
			inputdlg.openDlg(rstr.activity.tower.expeddlg.tip.inputAutoFightMaxLayer, c_maxLayer);
			inputdlg.setCaller({self:this, caller:this._onSetAutoFightMaxLayer});
		} else {
			this._stopAutoFight();
		}
	};	
	
	this._onSetAutoFightMaxLayer = function(autoToLayer){
		if ( autoToLayer < this.enterTower_.curLayer ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.tower.expeddlg.tip.autoFightLessLayer);
			return;
		}
		
		this.autoToLayer_ = autoToLayer;
		this._startAutoFight();
	};
	
	this._onHeroUpdate = function(){
		if ( !this.isShow() ) return;
		
		this.forceTabHdr_.refresh();
		var heroIds = this.forceTabHdr_.getHeroIds();
		TQ.setTextEx(this.items_.myFightCap, _getHerosFightCap(heroIds));
	};
	
	var _getHerosFightCap = function(heroIds){
		var fightCapSum = 0;
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			var hero = m_this.g_.getImgr().getHero( heroId );
			if ( !hero ) continue;
			
			fightCapSum += m_this.g_.getImgr().getHeroAttrVal(hero, ATTR.FC);
		}
		return fightCapSum;
	};	
	
	var _sendExpeditionCmdAndCloseDlg = function(){
		var target = _getTargetRes().copyField;
		target.objType = OBJ_TYPE.COPYFIELD;
		target.type = OBJ_TYPE.COPYFIELD;
		var expedType = EXPED_TYPE.ACT_TOWER;
		var heroIds = m_this.forceTabHdr_.getExpedHerosInLineup();
		var lineupId = m_this.forceTabHdr_.getLineup();
		ActTowerSender.sendExped(m_this.g_, target, expedType, lineupId, heroIds);
		if ( !m_this.isAutoFight_ ) m_this.dlg_.hide();
	};	
	
	this._startAutoFight = function(){
		this.isAutoFight_ = true;
		_setBtnsStateByLeftTime();
		_setAutoFightBtnTextByAutoFightFlag();
		ActTowerSender.sendStartAutoFight(this.g_, this.forceTabHdr_.getExpedHerosInLineup(), this.autoToLayer_);
	};
	
	this._stopAutoFight = function(){
		m_this.isAutoFight_ = false;
		if (this.isShow()) {
			_setBtnsStateByLeftTime();
			_setAutoFightBtnTextByAutoFightFlag();		
		}
		ActTowerSender.sendStopAutoFight(this.g_);
	};
});

ActTowerLastGetGiftsDlg = BaseDlg.extern(function(){
	this._getDlgCfg = function(){
		return {modal:true, title:rstr.activity.tower.lastGetGiftsDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.lastGetGiftsDlg};
	}; 
	
	this._initInfo = function(){
		var items = this.params_;
		this.items_.list.setItemCount(items.length);
		for ( var i=0; i<items.length; ++i ) {
			var item = this.items_.list.getItem(i);
			var name = RStrUtil.getItemColorNameByResId(items[i].id);
			TQ.setRichText(item.exsubs.nameAndNumber, name + rstr.comm.numPrefix + items[i].number);
		}
	};
});
