/*******************************************************************************/
ActTerraceDlg = BaseDlg.extern(function(){
	var m_this = null;
	var m_curGateId = 0;
	this._init = function(){
		m_this = this;
		this.g_.regEvent(EVT.NET, NETCMD.ACT_TERRACE, this, this._onSvrPkg);
	};
	
	this._isCanOpen = function(){
		if ( this.g_.getImgr().getRoleRes().level < res_enter_terrace_need_rolelevel ) {
			var msg = TQ.format(rstr.activity.terrace.maindlg.tip.roleLevelNotArrived, res_enter_terrace_need_rolelevel);
			this.g_.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return false;
		}
		return true;
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.activity.terrace.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.terrace.maindlg};
	}; 
	
	this._afterCreate = function(){
		if (TQ.isIE6()) {
			for ( var i=0; i<9; ++i ) {
				this.items_['gate' + (i+1)].resetUIBack(uiback.btn.forIE6Terracegatebtn);
			}
		}
	};	
	
	this._setCallers = function(){
		for ( var i=0; i<9; ++i ) {
			this.items_['gate' + (i+1)].setCaller({self:this, caller:_onClickGateBtn});
		}
		this.items_.buyBtn.setCaller({self:this, caller:_onClickBuyItemBtn});
		this.items_.enterBtn.setCaller({self:this, caller:_onClickEnterBtn});
	};	
	
	this._initInfo = function(){
		_clearBaseInfo();
		ActTerraceSender.sendGetBaseInfo(this.g_);
		UIM.getDlg('actterraceexped').reset();
		
		if ( m_curGateId == 0 ) {
			this.items_.gate1.click();
		}
	};
	
	this._onSvrPkg = function(netevent){
		_updateResults(netevent.data.results);
		_updateBaseInfo(netevent.data.baseInfo);
		_enterTerrace(netevent.data.enterTerrace);
	};
	
	var _updateResults = function(results){
		if (!results) return;
		TQ.dictCopy(m_this.g_.getImgr().getActTerrace().results, results);
	};
	
	var _updateBaseInfo = function(baseInfo){
		if (!baseInfo) return;
		TQ.dictCopy(m_this.g_.getImgr().getActTerrace().baseInfo, baseInfo);
		
		if ( !m_this.isShow() ) return;
		
		baseInfo = m_this.g_.getImgr().getActTerrace().baseInfo;
		for ( var i=0; i<9; ++i ) {
			m_this.items_['gate' + (i+1)].enable(i<baseInfo.maxGate.gateId);
		}
		
		TQ.setTextEx(m_this.items_.todayFreeTimes, TQ.format(rstr.activity.terrace.maindlg.lbl.todayFreeTimes, baseInfo.today.freeTimes, baseInfo.today.maxTimes));
		TQ.setTextEx(m_this.items_.todayItemTimes, TQ.format(rstr.activity.terrace.maindlg.lbl.todayItemTimes, baseInfo.today.itemTimes));
		
		if (!baseInfo.curGate.gateId) baseInfo.curGate.gateId = 0;
		
		var btnId = Math.clamp(baseInfo.curGate.gateId, 1, 9);
		m_this.items_['gate' + btnId].click();
	};
	
	var _enterTerrace = function(enterTerrace){
		if (!enterTerrace) return;
		m_this.hideDlg();
	};
	
	var _clearBaseInfo = function(){
		TQ.setTextEx(m_this.items_.todayFreeTimes, TQ.format(rstr.activity.terrace.maindlg.lbl.todayFreeTimes, 0));
		TQ.setTextEx(m_this.items_.todayItemTimes, TQ.format(rstr.activity.terrace.maindlg.lbl.todayItemTimes, 0));
	};
	
	var _onClickGateBtn = function(id){
		_selectGateBtns(id);
		
		var res_terrace_gate = res_terrace[id];
		TQ.setTextEx(m_this.items_.gateName, res_terrace_gate[0].gateName);
		
		m_this.items_.heroList.setItemCount(res_terrace_gate.length);
		for ( var i=0; i<m_this.items_.heroList.getCount(); ++i ) {
			var item = m_this.items_.heroList.getItem(i);
			var res = res_terrace_gate[i];
			var heroRes = ItemResUtil.findItemres(res.heros[0]);
			TQ.setTextEx(item.exsubs.no, i+1);
			TQ.setTextEx(item.exsubs.name, res.heroName);
			TQ.setTextEx(item.exsubs.sfightcap, heroRes.singlefightcap);
		}
	};
	
	var _onClickBuyItemBtn = function(){
		UIM.getDlg('buyitem').openDlg({id:0, resid:FIXID.HEIMULING, number:100000});
	};
	
	var _onClickEnterBtn = function(){
		var imgr = m_this.g_.getImgr();
		var baseInfo = imgr.getActTerrace().baseInfo;
		if ( baseInfo.today.freeTimes == baseInfo.today.maxTimes
			&& baseInfo.today.itemTimes == 0
			&& imgr.getItemNumByResId(FIXID.HEIMULING) > 0 ) {
			m_this.g_.getGUI().msgBox(rstr.comm.msgts
				,rstr.activity.terrace.maindlg.lbl.confirmUseItem
				,MB_F_YESNO, {self:m_this, caller:function(msgid){
				if ( msgid == MB_IDYES ) {
					ActTerraceSender.sendEnterTerrace(m_this.g_, m_curGateId);
				}
			}});
			return;
		}
		
		ActTerraceSender.sendEnterTerrace(m_this.g_, m_curGateId);
	};
	
	var _selectGateBtns = function(id){
		m_curGateId = id;
		for ( var i=0; i<9; ++i ) {
			var btn = m_this.items_['gate' + (i+1)];
			btn.setPress( btn.getId() == m_curGateId );
		}
	};
});
