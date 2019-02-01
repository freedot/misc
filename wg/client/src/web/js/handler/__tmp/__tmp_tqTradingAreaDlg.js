/*******************************************************************************/
TradingAreaDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
		
	_lc_.m_tradingInfo = {stopTime:0, rate:1, maxCitys:4, capacity:0
				,targets:[] ,totalDis:0, needTime:0, gain:0, todayTimes:{cur:0,max:0}};
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.TRADING_AREA, _lc_.m_this, _lc_._onSvrPkg);
		_lc_.m_g.regEvent(EVT.SELFALLI_DETAIL, 0, _lc_.m_this, _lc_._onSelfAlliDetail);
	};
	
	this.openDlg = function(){
		if ( !_isCanOpen() ) {
			return;
		}
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};
	
	this.isCanOpenDlg = function(){
		var buildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SHICHANGBUILD);
		return _lc_.m_g.getImgr().isInAlliance() && (buildLevel >= res_trading_need_build_minlevel);
	};
	
	this.isTrading = function(){
		return _lc_.m_tradingInfo.stopTime > 0;
	};
	
	this.isCanTrade = function(){
		return this.isCanOpenDlg() && !this.isTrading();
	};
	
	var _isCanOpen = function(){
		if (!_lc_.m_this.isCanOpenDlg()) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.tradingareadlg.tip.canNotOpen);
			return false;
		}
		return true;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.tradingareadlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.tradingareadlg, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this, caller:_lc_._onDlgEvent});
		_lc_.m_items.setTradingAreaBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSetTradingArea});
		_lc_.m_items.startTradingBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickStartTrading});
		_lc_.m_items.startVipTradingBtn.setCaller({self:_lc_.m_this, caller:_onClickStartVipTrading});
		_lc_.m_items.cancelTradingBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancelTrading});
		_lc_.m_items.speedTradingBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSpeedTrading});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		AllianceSender.sendGetMyAllianceDetail(_lc_.m_g);
		TradingAreaSender.sendGetMyTradingInfo(_lc_.m_g);
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
		}		
	};
	
	_lc_._onUpdate = function(){
		_updateLeftTime();
	};
	
	_lc_._onClickSetTradingArea = function(){
		var roleNames = [];
		for ( var i=0; i<_lc_.m_tradingInfo.targets.length; ++i ) {
			roleNames.push(_lc_.m_tradingInfo.targets[i].roleName);
		}
		UIM.getDlg('settradingarea').openDlg(_lc_.m_tradingInfo.maxCitys, roleNames);
	};
	
	_lc_._onClickStartTrading = function(){
		TradingAreaSender.sendStartTrading(_lc_.m_g, false);
	};
	
	var _onClickStartVipTrading = function(){
		if ( !_lc_.m_g.getImgr().hasVipEffect(VIP_EFF.SPEED_TRADING) ) {
			var minLevel = _lc_.m_g.getImgr().hasVipEffectMinLevel(VIP_EFF.SPEED_TRADING);
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, TQ.format(rstr.alli.tradingareadlg.lbl.noEnoughVip, 2), MB_F_CLOSE, null);
			return;
		}
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.alli.tradingareadlg.lbl.confirmVipStart
			,MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ) TradingAreaSender.sendStartTrading(_lc_.m_g, true);
			}} );
	};
	
	_lc_._onClickCancelTrading = function(){
		var msg = rstr.alli.tradingareadlg.tip.confirmCancelTrading;
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				TradingAreaSender.sendCancelTrading(_lc_.m_g);
			}
		}});		
	};
	
	_lc_._onClickSpeedTrading = function(){
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ACC_TRADING], 
			{id:0, stoptime:_lc_.m_tradingInfo.stopTime, name:rstr.alli.tradingareadlg.tip.trading, type:RES_TRG.SELF_ROLE} );
	};
	
	_lc_._onSvrPkg = function(netevent){
		if (!netevent.data.trading) return;
		TQ.dictCopy(_lc_.m_tradingInfo, netevent.data.trading);
		_lc_.m_tradingInfo.targets.sort(function(a, b){
			return a.distance - b.distance; });
		_lc_._update();
	};
	
	_lc_._onSelfAlliDetail = function(){
		_lc_._update();
	};
	
	_lc_._update = function(){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		
		_updateBaseInfo();
		_updateList();
		_updateGainInfo();
		_updateLeftTime();
		_updateBtnsVisible();
	};
	
	var _updateBaseInfo = function(){
		var buildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SHICHANGBUILD);
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx(_lc_.m_items.allianceName, myAlliance.getName());
		TQ.setTextEx(_lc_.m_items.tradingRate, _lc_.m_tradingInfo.rate );
		TQ.setTextEx(_lc_.m_items.buildLevel, buildLevel );
		TQ.setTextEx(_lc_.m_items.teamLevel, buildLevel );
		TQ.setTextEx(_lc_.m_items.maxCitys, _lc_.m_tradingInfo.maxCitys );
		TQ.setTextEx(_lc_.m_items.capacity, _lc_.m_tradingInfo.capacity );
	};
	
	var _updateList = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_tradingInfo.targets.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var target = _lc_.m_tradingInfo.targets[i];
			TQ.setTextEx ( item.exsubs.no, i+1 );
			TQ.setTextEx ( item.exsubs.roleName, target.roleName );
			var pos = FieldUtil.getPosByGridId(target.gridId);
			TQ.setTextEx ( item.exsubs.cood, '(' + pos.x + ',' + pos.y + ')' );
			TQ.setTextEx ( item.exsubs.buildLevel, target.buildLevel );
			TQ.setTextEx ( item.exsubs.distance, target.distance );
		}
	};
	
	var _updateGainInfo = function(){
		TQ.setTextEx(_lc_.m_items.cityNumber, _lc_.m_tradingInfo.targets.length + '/' + _lc_.m_tradingInfo.maxCitys);
		TQ.setTextEx(_lc_.m_items.totalDistance, _lc_.m_tradingInfo.totalDis);
		TQ.setTextEx(_lc_.m_items.needTime, TQ.formatTime(0, _lc_.m_tradingInfo.needTime) );
		TQ.setTextEx(_lc_.m_items.gain, _lc_.m_tradingInfo.gain );
		var maxTimes = _lc_.m_tradingInfo.todayTimes.max;
		TQ.setTextEx(_lc_.m_items.todayTimes, _lc_.m_tradingInfo.todayTimes.cur + '/' + maxTimes );
	};
	
	var _updateLeftTime = function(){
		if (_lc_.m_tradingInfo.stopTime == 0) {
			TQ.setTextEx(_lc_.m_items.leftTime, '');
		} else {
			var leftTime = Math.max(0, _lc_.m_tradingInfo.stopTime - _lc_.m_g.getSvrTimeS());
			TQ.setTextEx(_lc_.m_items.leftTime, TQ.format(rstr.alli.tradingareadlg.lbl.leftTime, TQ.formatTime(0, leftTime)));
		}
	};
	
	var _updateBtnsVisible = function(){
		if ( _lc_.m_this.isTrading() ) {
			TQ.setCSS(_lc_.m_items.cancelTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(_lc_.m_items.speedTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(_lc_.m_items.setTradingAreaBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(_lc_.m_items.startTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(_lc_.m_items.startVipTradingBtn.getParent(), 'visibility', 'hidden');
		} else {
			TQ.setCSS(_lc_.m_items.cancelTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(_lc_.m_items.speedTradingBtn.getParent(), 'visibility', 'hidden');
			TQ.setCSS(_lc_.m_items.setTradingAreaBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(_lc_.m_items.startTradingBtn.getParent(), 'visibility', 'visible');
			TQ.setCSS(_lc_.m_items.startVipTradingBtn.getParent(), 'visibility', 'visible');
		}
	};
	//TradingAreaDlg-unittest-end
});
