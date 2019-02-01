/*******************************************************************************/
JiTanDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_._initParams(this, g);
		_lc_._regEvents();
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	_lc_._initParams = function(selfThis, g){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.ROLEBASE, 0, _lc_.m_this, _lc_._onRolebaseChange);
		_lc_.m_g.regEvent(EVT.CITYRES, 0, _lc_.m_this, _lc_._onCityResChange);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.EXCHANGEEXP, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:true, title:rstr.jitandlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.jitandlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.assign.setCaller({self:_lc_.m_this, caller:_lc_._onClickAssignHerosExp});
		_lc_.m_items.exchange.setCaller({self:_lc_.m_this, caller:_lc_._onClickExchange});
		_lc_.m_items.inum.setCaller({self:_lc_.m_this, caller:_lc_._onNumChange});
		_lc_.m_items.inum.setLimit(_lc_._onGetNumLimit);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._updateExpsBar();
		_lc_._updateCityRes();
		_lc_._updateTodayTimes();
	};
	
	_lc_._updateExpsBar = function(){
		if ( !_lc_._isShow() ) return;
		_lc_.m_items.herosexpbar.setRange(_lc_.m_g.getImgr().getRoleAttrVal(ATTR.MXPS));
		_lc_.m_items.herosexpbar.setValue(0,_lc_.m_g.getImgr().getRoleAttrVal(ATTR.XPS));
	};
	
	_lc_._updateCityRes = function(){
		if ( !_lc_._isShow() ) return;
		for ( var i=0; i<4; ++i ) {
			_lc_._setListItemResIcon(i);
			_lc_._setListItemResNeedAndHasNum(i);
		}
	};
	
	_lc_._setListItemResIcon = function(idx){
		var res = ItemResUtil.findItemres( _lc_.m_g.getImgr().getCityResResIdByIdx(idx) );
		IMG.setBKImage(_lc_.m_items['icon'+idx], IMG.makeSmallImg(res.smallpic));
	};
	
	_lc_._setListItemResNeedAndHasNum = function(idx){
		var curNum = _lc_.m_items.inum.getVal();
		var hasNum = RStrUtil.formatResNumStr(_lc_.m_g.getImgr().getCityResValByIdx(idx));
		var msg = TQ.format(rstr.jitandlg.lbl.exchangeItem, curNum, hasNum);
		TQ.setTextEx(_lc_.m_items['res'+idx], msg);
	};
	
	_lc_._updateTodayTimes = function(){
		if ( !_lc_._isShow() ) return;
		
		var todaytimes = _lc_.m_g.getImgr().getExchangeExp().todaytimes;
		var msg = TQ.format(rstr.jitandlg.lbl.todayTimes, todaytimes.cur, todaytimes.max);
		TQ.setTextEx(_lc_.m_items.todayTimes, msg);
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._onLoginOk = function(){
		ExchangeHeroExpSender.sendGetTimes(_lc_.m_g);
	};
	
	_lc_._onRolebaseChange = function(){
		_lc_._updateExpsBar();
	};
	
	_lc_._onCityResChange = function(){
		_lc_._updateCityRes();
	};
	
	_lc_._onNumChange = function(){
		_lc_._updateCityRes();
	};
	
	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if ( netdata.todaytimes ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getExchangeExp().todaytimes, netdata.todaytimes);
			_lc_._updateTodayTimes();
		}
	};
	
	_lc_._onClickAssignHerosExp = function(){
		UIM.openDlg('roleassignexp');
	};
	
	_lc_._onClickExchange = function(){
		if ( !_lc_._hasEnoughTimes() ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughTimes);
			return;
		}
		
		if ( !_lc_._hasEnoughRes() ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughRes);
			return;
		}
		
		if ( !_lc_._hasEnoughCapacity() ){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughCap);
			return;
		}		
		
		ExchangeHeroExpSender.sendExchange(_lc_.m_g, _lc_.m_items.inum.getVal());
		_lc_.m_items.inum.setVal(1);
	};
	
	_lc_._onGetNumLimit = function(){
		return {min:1, max:_lc_._getCanMaxTimes()};
	};
	
	_lc_._hasEnoughTimes = function(){
		return _lc_._getTodayLeftTimes() > 0;
	};
	
	_lc_._hasEnoughRes = function(){
		return _lc_._getResCanTimes() > 0;
	};
	
	_lc_._hasEnoughCapacity = function(){
		return _lc_._getCapacityCanTimes() > 0;
	};
	
	_lc_._getCanMaxTimes = function(){
		var maxTimes = Math.min(_lc_._getTodayLeftTimes(), _lc_._getResCanTimes(), _lc_._getCapacityCanTimes());
		return Math.max(1, maxTimes);
	};	
	
	_lc_._getTodayLeftTimes = function(){
		var todaytimes = _lc_.m_g.getImgr().getExchangeExp().todaytimes;
		return todaytimes.max - todaytimes.cur;
	};
	
	_lc_._getResCanTimes = function(){
		var resCanTimes = 0xffffffff;
		for ( var i=0; i<4; ++i ) {
			var times = Math.floor(_lc_.m_g.getImgr().getCityResValByIdx(i)/1000);
			if ( times < resCanTimes ) {
				resCanTimes = times;
			}
		}
		return resCanTimes;
	};
	
	_lc_._getCapacityCanTimes = function(){
		return Math.floor((_lc_.m_g.getImgr().getRoleAttrVal(ATTR.MXPS) - _lc_.m_g.getImgr().getRoleAttrVal(ATTR.XPS))/1000);
	};
	//JiTanDlg-unittest-end
});
