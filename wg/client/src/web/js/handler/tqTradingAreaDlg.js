/*******************************************************************************/
TradingAreaDlg = Class.extern(function(){
	//TradingAreaDlg-unittest-start
	var m_this = null;
	var m_g = null;
	var m_dlg = null;
	var m_items = {};
		
	var m_tradingInfo = {stopTime:0, rate:1, maxCitys:4, capacity:0
				,targets:[] ,totalDis:0, needTime:0, gain:0, todayTimes:{cur:0,max:0}};
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.TRADING_AREA, m_this, _onSvrPkg);
		m_g.regEvent(EVT.SELFALLI_DETAIL, 0, m_this, _onSelfAlliDetail);
	};
	
	this.openDlg = function(){
		if ( !_isCanOpen() ) {
			return;
		}
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	this.isCanOpenDlg = function(){
		var buildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SHICHANGBUILD);
		return m_g.getImgr().isInAlliance() && (buildLevel >= res_trading_need_build_minlevel);
	};
	
	this.isTrading = function(){
		return m_tradingInfo.stopTime > 0;
	};
	
	this.isCanTrade = function(){
		return this.isCanOpenDlg() && !this.isTrading();
	};
	
	var _isCanOpen = function(){
		if (!m_this.isCanOpenDlg()) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.tradingareadlg.tip.canNotOpen);
			return false;
		}
		return true;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.tradingareadlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.tradingareadlg, m_items);		
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		m_items.setTradingAreaBtn.setCaller({self:m_this, caller:_onClickSetTradingArea});
		m_items.startTradingBtn.setCaller({self:m_this, caller:_onClickStartTrading});
		m_items.startVipTradingBtn.setCaller({self:m_this, caller:_onClickStartVipTrading});
		m_items.cancelTradingBtn.setCaller({self:m_this, caller:_onClickCancelTrading});
		m_items.speedTradingBtn.setCaller({self:m_this, caller:_onClickSpeedTrading});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
		AllianceSender.sendGetMyAllianceDetail(m_g);
		TradingAreaSender.sendGetMyTradingInfo(m_g);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}		
	};
	
	var _onUpdate = function(){
		_updateLeftTime();
	};
	
	var _onClickSetTradingArea = function(){
		var roleNames = [];
		for ( var i=0; i<m_tradingInfo.targets.length; ++i ) {
			roleNames.push(m_tradingInfo.targets[i].roleName);
		}
		UIM.getDlg('settradingarea').openDlg(m_tradingInfo.maxCitys, roleNames);
	};
	
	var _onClickStartTrading = function(){
		TradingAreaSender.sendStartTrading(m_g, false);
	};
	
	var _onClickStartVipTrading = function(){
		if ( !m_g.getImgr().hasVipEffect(VIP_EFF.SPEED_TRADING) ) {
			var minLevel = m_g.getImgr().hasVipEffectMinLevel(VIP_EFF.SPEED_TRADING);
			m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.alli.tradingareadlg.lbl.noEnoughVip, 2), MB_F_CLOSE, null);
			return;
		}
		
		m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.alli.tradingareadlg.lbl.confirmVipStart
			,MB_F_YESNO, {self:m_this, caller:function(id){
				if ( id == MB_IDYES ) TradingAreaSender.sendStartTrading(m_g, true);
			}} );
	};
	
	var _onClickCancelTrading = function(){
		var msg = rstr.alli.tradingareadlg.tip.confirmCancelTrading;
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				TradingAreaSender.sendCancelTrading(m_g);
			}
		}});		
	};
	
	var _onClickSpeedTrading = function(){
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ACC_TRADING], 
			{id:0, stoptime:m_tradingInfo.stopTime, name:rstr.alli.tradingareadlg.tip.trading, type:RES_TRG.SELF_ROLE} );
	};
	
	var _onSvrPkg = function(netevent){
		if (!netevent.data.trading) return;
		TQ.dictCopy(m_tradingInfo, netevent.data.trading);
		m_tradingInfo.targets.sort(function(a, b){
			return a.distance - b.distance; });
		_update();
	};
	
	var _onSelfAlliDetail = function(){
		_update();
	};
	
	var _update = function(){
		if (!m_dlg || !m_dlg.isShow()) return;
		
		_updateBaseInfo();
		_updateList();
		_updateGainInfo();
		_updateLeftTime();
		_updateBtnsVisible();
	};
	
	var _updateBaseInfo = function(){
		var buildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SHICHANGBUILD);
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx(m_items.allianceName, myAlliance.getName());
		TQ.setTextEx(m_items.tradingRate, m_tradingInfo.rate );
		TQ.setTextEx(m_items.buildLevel, buildLevel );
		TQ.setTextEx(m_items.teamLevel, buildLevel );
		TQ.setTextEx(m_items.maxCitys, m_tradingInfo.maxCitys );
		TQ.setTextEx(m_items.capacity, m_tradingInfo.capacity );
	};
	
	var _updateList = function(){
		m_items.list.setItemCount(m_tradingInfo.targets.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var target = m_tradingInfo.targets[i];
			TQ.setTextEx ( item.exsubs.no, i+1 );
			TQ.setTextEx ( item.exsubs.roleName, target.roleName );
			var pos = FieldUtil.getPosByGridId(target.gridId);
			TQ.setTextEx ( item.exsubs.cood, '(' + pos.x + ',' + pos.y + ')' );
			TQ.setTextEx ( item.exsubs.buildLevel, target.buildLevel );
			TQ.setTextEx ( item.exsubs.distance, target.distance );
		}
	};
	
	var _updateGainInfo = function(){
		TQ.setTextEx(m_items.cityNumber, m_tradingInfo.targets.length + '/' + m_tradingInfo.maxCitys);
		TQ.setTextEx(m_items.totalDistance, m_tradingInfo.totalDis);
		TQ.setTextEx(m_items.needTime, TQ.formatTime(0, m_tradingInfo.needTime) );
		TQ.setTextEx(m_items.gain, m_tradingInfo.gain );
		var maxTimes = m_tradingInfo.todayTimes.max;
		TQ.setTextEx(m_items.todayTimes, m_tradingInfo.todayTimes.cur + '/' + maxTimes );
	};
	
	var _updateLeftTime = function(){
		if (m_tradingInfo.stopTime == 0) {
			TQ.setTextEx(m_items.leftTime, '');
		} else {
			var leftTime = Math.max(0, m_tradingInfo.stopTime - m_g.getSvrTimeS());
			TQ.setTextEx(m_items.leftTime, TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, TQ.formatTime(0, leftTime)));
		}
	};
	
	var _updateBtnsVisible = function(){
		if ( m_this.isTrading() ) {
			TQ.setCSS(m_items.cancelTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(m_items.speedTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(m_items.setTradingAreaBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(m_items.startTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(m_items.startVipTradingBtn.getParent(), 'visibility', 'hidden');
		} else {
			TQ.setCSS(m_items.cancelTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(m_items.speedTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(m_items.setTradingAreaBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(m_items.startTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(m_items.startVipTradingBtn.getParent(), 'visibility', 'visible');
		}
	};
	//TradingAreaDlg-unittest-end
});
