/*******************************************************************************/
ActTerraceExpedDlg = BaseDlg.extern(function(){
	var c_maxSubGateId = 7;
	var c_attrBarMaxHight = 100;
	var c_lifeStarWidth = 30;
	var m_this = null;
	this.subGateList_ = null;
	this.strBar_ = null;
	this.agileBar_ = null;
	this.phyBar_ = null;
	this.myheros_ = [];
	this.isAutoFight_ = false;
	this.autoToSubGateId_ = 0;
	this.enterTerrace_ = {stopTime:0};
	this.running_ = false;
	this.lastLifes_ = 0;
	this.checkAutoFightTimes_ = 0;
	
	this.reset = function(){
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
		} else if (this.enterTerrace_.curGate) {
			this.openDlg(this.enterTerrace_);
		}
	};	
	
	this._init = function(){
		m_this = this;
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.g_.regEvent(EVT.NET, NETCMD.ACT_TERRACE, this, this._onSvrPkg);
		this.g_.regEvent(EVT.HERO_UPDATE, 0, this, this._onHeroUpdate);
		this.g_.regEvent(EVT.SAVE_FORCES, 0, this, this._onCheckAutoFight);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.activity.terrace.expeddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.terrace.expeddlg};
	}; 
	
	this._setCallers = function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
		this.items_.myHeroList.setCaller({self:this, caller:this._onSelectHero});
		this.items_.treatmentBtn.setCaller({self:this, caller:this._onClickTreatmentBtn});
		this.items_.exitBtn.setCaller({self:this, caller:this._onClickExitBtn});
		this.items_.vsBtn.setCaller({self:this, caller:this._onClickVSBtn});
		this.items_.autoFightBtn.setCaller({self:this, caller:this._onClickAutoFightBtn});
	};	
	
	this._afterCreate = function(){
		this.subGateList_ = HorizontalList.snew(this.g_, this.items_);
		this.subGateList_.setObserver({self:this, caller:this._onUpdateSubGateItem});
		this.strBar_ = VerticalAttrBar.snew(this.g_, c_attrBarMaxHight, this.items_.strBar, this.items_.strVal);
		this.agileBar_ = VerticalAttrBar.snew(this.g_, c_attrBarMaxHight, this.items_.agileBar, this.items_.agileVal);
		this.phyBar_ = VerticalAttrBar.snew(this.g_, c_attrBarMaxHight, this.items_.phyBar, this.items_.phyVal);
	};
	
	this._showDlg = function(){
		if ( !this.isAutoFight_ ){
			this.dlg_.show();
		}
	};
	
	this._initInfo = function(){
		this.enterTerrace_ = this.params_;
		this._initUpdate();
		this.lastLifes_ = this.enterTerrace_.leftLifes;
	};
	
	this._initUpdate = function(){
		_stopAutoFightWhenArriveMax();
		_stopAutoFightWhenLossLife();
		
		this._updateGateBaseInfo();
		this._updateMyHeroList();
		this._updateLeftLifes();
		this._updateLeftTime();
		this._updateBtnsState();
		
		_setAutoFightBtnTextByAutoFightFlag();
		
		var curGate = this.enterTerrace_.curGate;
		this.subGateList_.setItemCount(_getSubGateCount(curGate.gateId), 4);
		this.subGateList_.setCurSel(this._formatSubGateId(curGate) - 1);	
		
		this.g_.regUpdater(this, this._onUpdate, 1000);	
	};
	
	this._updateGateBaseInfo = function(){
		var curGate = this.enterTerrace_.curGate;
		var subGateRes = _getSubGateRes(curGate);
		TQ.setTextEx(this.items_.gift, rstr.activity.terrace.expeddlg.giftLabel + DropItemUtil.getDescNoGainLbl(subGateRes.dantiaodrop));
		TQ.setTextEx(this.items_.gateNo, rstr.activity.terrace.expeddlg.gateNos[curGate.gateId]);
		TQ.setTextEx(this.items_.gateName, subGateRes.gateName);
		TQ.setTextEx(this.items_.gatePosition, rstr.activity.terrace.expeddlg.position + subGateRes.gatePosition);
	};
	
	this._updateMyHeroList = function(){
		this.items_.myHeroList.deleteAllItem();
		
		var includeStates = {};
		this.myheros_ = this.g_.getImgr().getHeros().list;
		
		for ( var i=0; i<this.myheros_.length; ++i ) {
			this.items_.myHeroList.addItem({text:this.myheros_[i].name});
		}
		
		var lastCurSel = this.items_.myHeroList.getCurSel();
		if (lastCurSel >= 0 && lastCurSel < this.items_.myHeroList.getCount() ) {
			this.items_.myHeroList.setCurSel(lastCurSel);
		} else if (this.items_.myHeroList.getCount() > 0) {
			this.items_.myHeroList.setCurSel(0);
		} else {
			this.items_.myHeroList.setCurSel(-1);
			this.items_.myHeroList.setTitle(rstr.activity.terrace.expeddlg.myHeroDropTitle);
		}
	};
	
	this._updateLeftLifes = function(){
		TQ.setDomWidth(this.items_.leftLifes, this.enterTerrace_.leftLifes*c_lifeStarWidth );
	};
	
	this._updateLeftTime = function(){
		if (this._getLeftTime() == 0) {
			TQ.setTextEx(m_this.items_.leftTime, '');
			return;
		} 
		var sleftTime = TQ.formatTime(0, this._getLeftTime());
		TQ.setTextEx(m_this.items_.leftTime, TQ.format(rstr.activity.terrace.expeddlg.leftTime, sleftTime));
	};
	
	this._updateBtnsState = function(){
		this.items_.vsBtn.enable(!m_this.isAutoFight_ && this._getLeftTime() == 0);
		if (this.isAutoFight_) {
			this.items_.autoFightBtn.enable(true);
		} else {
			this.items_.autoFightBtn.enable(this._getLeftTime() == 0);
		}
	};
	
	this._formatStopTime = function(enterTerrace){
		if (enterTerrace.stopTime && this.g_.getSvrTimeS() >= enterTerrace.stopTime ) {
			enterTerrace.stopTime = this.g_.getSvrTimeS() + 1;
		}
	};
	
	this._getLeftTime = function(){
		return Math.max(0, this.enterTerrace_.stopTime - this.g_.getSvrTimeS());
	};
	
	this._onUpdateSubGateItem = function(itemIdx, item){
		var curGate = this.enterTerrace_.curGate;
		var subGateRes = _getSubGateRes({gateId:curGate.gateId, subGateId:itemIdx+1});

		TQ.setTextEx(item.items.name, subGateRes.heroName);
		var heroRes = ItemResUtil.findItemres(subGateRes.heros[0]);
		TQ.setTextEx(item.items.sfightcap, heroRes.singlefightcap);
		
		var resultId = (curGate.gateId - 1)*c_maxSubGateId + (itemIdx + 1);
		var resultRes = TQ.find(this.g_.getImgr().getActTerrace().results, 'id', resultId);
		var result = resultRes ? resultRes.result : 0;
		TQ.setTextEx(item.items.result, rstr.activity.terrace.expeddlg.results[result]);
	};	
	
	this._onSelectHero = function(e, idx){
		if ( idx < 0 ) {
			this._clearCurSelHeroInfo();
			return;
		}
		
		var hero = this.myheros_[idx];
		IMG.setBKImage(this.items_.icon, IMG.makeBigImg( hero.icon ) );
		
		var imgr = this.g_.getImgr();
		TQ.setTextEx(this.items_.healthVal, RStrUtil.getColorHealthVal(imgr.getHeroAttrVal(hero, ATTR.HEALTH)) );
		TQ.setTextEx(this.items_.creditVal, imgr.getHeroAttrVal(hero, ATTR.CRE) );
		TQ.setTextEx(this.items_.sfightCapVal, imgr.getHeroAttrVal(hero, ATTR.SFC) );
		
		var ph = imgr.getHeroAttrVal(hero, ATTR.PH_B) + imgr.getHeroAttrVal(hero, ATTR.PH_A);
		var st = imgr.getHeroAttrVal(hero, ATTR.ST_B) + imgr.getHeroAttrVal(hero, ATTR.ST_A);
		var ag = imgr.getHeroAttrVal(hero, ATTR.AG_B) + imgr.getHeroAttrVal(hero, ATTR.AG_A);
		var maxVal = Math.max(ph, ag, st, 1);
		this.strBar_.setValue(st, maxVal);
		this.agileBar_.setValue(ag, maxVal);
		this.phyBar_.setValue(ph, maxVal);
	};
	
	this._onDlgEvent = function(id){
		if (id == C_SYS_DLG_HIDE && !this.running_) {
			this.g_.unregUpdater(this, this._onUpdate);
		}
	};
	
	this._onUpdate = function(){
		this._updateLeftTime();
		this._updateBtnsState();
		this._checkStopFight();
		this._onAutoFight();
	};
	
	this._checkStopFight = function(){
		if ( this.isShow() 
			&& !this._hasLeftLifes() 
			&& this._isArriveStopTime() ) {
			this._popCloseMsgBox(rstr.activity.terrace.expeddlg.noLifeMsgTip);
		} else if ( this.isShow() 
			&& this._isPassGate(this.enterTerrace_.curGate)
			&& this._isArriveStopTime() ) {
			this._popCloseMsgBox(rstr.activity.terrace.expeddlg.passGateMsgTip);
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
		if ( !this._hasLeftLifes() ) return;
		if ( this._getLeftTime() > 0 ) return;
		
		this._onClickTreatmentBtn();
		if ( !this._onClickVSBtn() ) {
			this._stopAutoFight();
		}
	};
	
	this._hasLeftLifes = function(){
		return this.enterTerrace_.leftLifes > 0;
	};
	
	this._isArriveStopTime = function(){
		return this.g_.getSvrTimeS() >= this.enterTerrace_.stopTime;
	};	
	
	this._onHeroUpdate = function(){
		if ( !this.isShow() ) return;
		this._onSelectHero(null, this.items_.myHeroList.getCurSel());
	};
	
	this._onLoginOk = function(){
		ActTerraceSender.sendCheckAutoFight(this.g_);
	};
	
	this._onSvrPkg = function(netevent){
		if ( netevent.data.autoFight ) {
			this.autoToSubGateId_ = netevent.data.autoToGate;
			this._onCheckAutoFight();
			return;
		}
		
		if ( this._isNeedShowFightDemo(netevent.data.enterTerrace) ) {
			this._showFightDemo(netevent.data.enterTerrace);
		} else {
			_enterTerrace(netevent.data.enterTerrace);
		}
	};
	
	this._onCheckAutoFight = function(){
		this.checkAutoFightTimes_++;
		if ( this.checkAutoFightTimes_ < 2 ) return;
		
		this.isAutoFight_ = true;
		ActTerraceSender.sendGetBaseInfo(this.g_);
	};
	
	this._onClickTreatmentBtn = function(){
		TreatmentHeroHdr.treatmentHeros(this.g_, [this._getCurSelHeroId()]);
	};
	
	this._onClickExitBtn = function(){
		this.g_.getGUI().msgBox(rstr.comm.msgts, rstr.activity.terrace.expeddlg.confirmExit, MB_F_YESNO ,{self:this, caller:function(msgid){
			if ( msgid == MB_IDYES ) {
				ActTerraceSender.sendLeaveTerrace(m_this.g_);
				m_this.dlg_.hide();
			}
		}});
	};
	
	this._onClickVSBtn = function(){
		if ( !ExpedHerosChecker.isValid(this.g_, [this._getCurSelHeroId()], EXPED_TYPE.ACT_TERRACE) ) {
			return false;
		}
		_sendExpeditionCmdAndCloseDlg();
		return true;
	};
	
	this._onClickAutoFightBtn = function(){
		if ( !this.isAutoFight_ ) {
			var inputdlg = UIM.getDlg('inputnum');
			inputdlg.openDlg(rstr.activity.terrace.expeddlg.inputAutoFightMaxSubGateId, c_maxSubGateId);
			inputdlg.setCaller({self:this, caller:this._onSetAutoFightMaxSubGateId});
		} else {
			this._stopAutoFight();
		}
	};
	
	this._onSetAutoFightMaxSubGateId = function(autoFightSubGateId){
		if ( autoFightSubGateId < this.enterTerrace_.curGate.subGateId ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.activity.terrace.expeddlg.autoFightLessSubGateId);
			return;
		}
		
		this.autoToSubGateId_ = autoFightSubGateId;
		this._startAutoFight();
	};
	
	this._isNeedShowFightDemo = function(enterTerrace) {
		return !this.isAutoFight_ && enterTerrace && enterTerrace.fightDemo;
	};
	
	this._showFightDemo = function(enterTerrace){
		this.hideDlg();		
		var dlg = UIM.getDlg('fightmap');
		dlg.setHideCaller({self:this, caller:function(){
			_enterTerrace(enterTerrace);
			dlg.setHideCaller(null);
		}});
		dlg.openDlg(enterTerrace.fightDemo.armyId, enterTerrace.fightDemo.fightId);
	};
	
	var _enterTerrace = function(enterTerrace){
		if (!enterTerrace) return;
		
		m_this._formatStopTime(enterTerrace);
		
		if (enterTerrace.isExit) {
			m_this.running_ = false;
		} else {
			m_this.running_ = true;
		}
		
		m_this.enterTerrace_ = enterTerrace;
		
		if (enterTerrace.leftLifes == 0) {
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, rstr.activity.terrace.expeddlg.noLifeSysTip);
			m_this._stopAutoFight();
			return;
		}
		
		if ( m_this._isPassGate(enterTerrace.curGate) ){
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, rstr.activity.terrace.expeddlg.passGateSysTip);
			m_this._stopAutoFight();
			return;
		}
		
		m_this.openDlg(enterTerrace);
	};	
	
	this._clearCurSelHeroInfo = function(){
		IMG.setBKImage(this.items_.icon, '');
		TQ.setTextEx(this.items_.healthVal, 0);
		TQ.setTextEx(this.items_.creditVal, 0);
		TQ.setTextEx(this.items_.sfightCapVal, 0);
		this.strBar_.setValue(0, 1);
		this.agileBar_.setValue(0, 1);
		this.phyBar_.setValue(0, 1);
	};
	
	this._formatSubGateId = function(gate){
		return this._isPassGate(gate) ? _getSubGateCount(gate.gateId) : gate.subGateId;
	};
	
	this._isPassGate = function(gate){
		return gate.subGateId > _getSubGateCount(gate.gateId);
	};
	
	var _sendExpeditionCmdAndCloseDlg = function(){
		var target = _getSubGateRes(m_this.enterTerrace_.curGate);
		target.objType = OBJ_TYPE.COPYFIELD;
		target.type = OBJ_TYPE.COPYFIELD;
		var lineupId = 180001;
		var heroIds = [m_this._getCurSelHeroId()];
		ActTerraceSender.sendExped(m_this.g_, target, EXPED_TYPE.ACT_TERRACE, lineupId, heroIds);
		if ( !m_this.isAutoFight_ ) m_this.dlg_.hide();
	};	
	
	this._getCurSelHeroId = function(){
		var curSel = this.items_.myHeroList.getCurSel();
		if (curSel < 0) return 0;
		return this.myheros_[curSel].id;
	};
	
	var _getSubGateRes = function(gate){
		var curGatesRes = res_terrace[gate.gateId];
		var formatSubGateId = m_this._formatSubGateId(gate);
		return curGatesRes[formatSubGateId - 1];
	};
	
	var _getSubGateCount = function(gateId){
		return res_terrace[gateId].length;
	};
	
	var _setAutoFightBtnTextByAutoFightFlag = function(){
		m_this.items_.autoFightBtn.setText(m_this.isAutoFight_ ? 
			rstr.activity.tower.expeddlg.btn.cancelAutoFight : rstr.activity.tower.expeddlg.btn.autoFight );
	};	
	
	var _stopAutoFightWhenArriveMax = function(){
		if ( !m_this.isAutoFight_ ) return;
		if ( m_this.enterTerrace_.curGate.subGateId > m_this.autoToSubGateId_ ) {
			m_this._stopAutoFight();
		}
	};
	
	var _stopAutoFightWhenLossLife = function(){
		if ( !m_this.isAutoFight_ ) return;
		if ( m_this.enterTerrace_.leftLifes < m_this.lastLifes_ ) {
			m_this._stopAutoFight();
		}
	};
	
	this._startAutoFight = function(){
		this.isAutoFight_ = true;
		this._updateBtnsState();
		_setAutoFightBtnTextByAutoFightFlag();		
		ActTerraceSender.sendStartAutoFight(this.g_, [this._getCurSelHeroId()], this.autoToSubGateId_);
	};
	
	this._stopAutoFight = function(){
		this.isAutoFight_ = false;
		if (this.isShow()) {
			this._updateBtnsState();
			_setAutoFightBtnTextByAutoFightFlag();
		}
		ActTerraceSender.sendStopAutoFight(this.g_);
	};
});

HorizontalList = Class.extern(function(){
	var m_this = null;
	this.g_ = null;
	this.items_ = null;
	this.itemCount_ = 0;
	this.onePageCount_ = 0;
	this.curPage_ = 1;
	this.observer_ = null;
	this.lastTmplIdx_ = 0;
	this.curSelIdx_ = 0;
	this.classs_ = {sel:'item_sel', normal:'item_normal'};
	
	this.init = function(g, items, classs){
		m_this = this;
		this.g_ = g;
		this.items_ = items;
		if ( classs )	this.classs_ = classs;
		_setCallers();
	};
	
	this.setObserver = function(ob){
		this.observer_ = ob;
	};
	
	this.setItemCount = function(count, onePageCount){
		this.itemCount_  = count;
		this.onePageCount_  = onePageCount;
		_createItems();
		_update();
	};
	
	this.setCurSel = function(idx){
		this.curPage_ = Math.floor(idx/this.onePageCount_) + 1;
		this.curSelIdx_ = idx;
		_update();
	};
	
	var _update = function(){
		_updateBtnsState();
		_updateItems();
		_updateCurSelItem();
	};
	
	var _updateBtnsState = function(){
		m_this.items_.preBtn.enable(m_this.curPage_ > 1);
		m_this.items_.nextBtn.enable(m_this.curPage_*m_this.onePageCount_ < m_this.itemCount_);
	};
	
	var _updateItems = function(){
		for ( var i=0; i<m_this.onePageCount_; i++ ) {
			var uiItem = m_this.items_['heroItem' + i];
			TQ.setCSS(uiItem, 'display', 'none');
		}
		
		_travelCurPageItems(function(itemIdx, uiItem){
			TQ.setCSS(uiItem, 'display', 'block');
			m_this.observer_.caller.call(m_this.observer_.self, itemIdx, uiItem);
		});
	};
	
	var _updateCurSelItem = function(){
		_travelCurPageItems(function(itemIdx, uiItem){
			TQ.setClass(uiItem, itemIdx==m_this.curSelIdx_ ? m_this.classs_.sel : m_this.classs_.normal);
		});
	};
	
	var _setCallers = function(){
		m_this.items_.preBtn.setCaller({self:m_this, caller:_onClickPreBtn});
		m_this.items_.nextBtn.setCaller({self:m_this, caller:_onClickNextBtn});
	};
	
	var _onClickPreBtn = function(){
		m_this.curPage_--;
		_update();
	};
	
	var _onClickNextBtn = function(){
		m_this.curPage_++;
		_update();
	};
	
	var _createItems = function(){
		var tmpl = uicfg.activity.terrace.expeddlg.t_[0];
		for ( var uiIdx=m_this.lastTmplIdx_; uiIdx < m_this.onePageCount_; uiIdx++ ) {
			var uiItem = m_this.items_['heroItem' + uiIdx];
			uiItem.items = {};
			m_this.g_.getGUI().buildDomItems(uiItem, tmpl, null, uiItem.items);
		}
		m_this.lastTmplIdx_ = m_this.onePageCount_;
	};
	
	var _travelCurPageItems = function(travelCallBack){
		var startItemIdx = (m_this.curPage_ - 1)*m_this.onePageCount_;
		var endItemIdx = startItemIdx + m_this.onePageCount_;
		var uiIdx = 0;
		for ( var itemIdx=startItemIdx; itemIdx<endItemIdx && itemIdx<m_this.itemCount_; itemIdx++){
			var uiItem = m_this.items_['heroItem' + (uiIdx++)];
			travelCallBack(itemIdx, uiItem);
		}		
	};
});

VerticalAttrBar = Class.extern(function(){
	var m_g = null;
	var m_maxHight = 0;
	var m_barDom = null;
	var m_valueDom = null;
	this.init = function(g, maxHight, barDom, valueDom){
		m_g = g;
		m_maxHight = maxHight;
		m_barDom = barDom;
		m_valueDom = valueDom;
	};
	
	this.setValue = function(value, maxValue){
		var barBottom = parseInt(TQ.getCSS(m_barDom, 'top'), 10) + TQ.getDomHeight(m_barDom);
		var barHeight = Math.floor(value*m_maxHight/maxValue);
		TQ.setCSS(m_barDom, 'top', (barBottom - barHeight) + 'px');
		TQ.setDomHeight(m_barDom, barHeight );
		TQ.setCSS(m_valueDom, 'top', (barBottom - barHeight - TQ.getDomHeight(m_valueDom)) + 'px');
		TQ.setTextEx(m_valueDom, value);
	};
});
