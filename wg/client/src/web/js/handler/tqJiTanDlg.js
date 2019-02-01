/*******************************************************************************/
JiTanDlg = Class.extern(function(){
	//JiTanDlg-unittest-start
	var m_this = null;
	var m_g = null;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		_initParams(this, g);
		_regEvents();
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	var _initParams = function(selfThis, g){
		m_this = selfThis;
		m_g = g;
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
		m_g.regEvent(EVT.CITYRES, 0, m_this, _onCityResChange);
		m_g.regEvent(EVT.NET, NETCMD.EXCHANGEEXP, m_this, _onSvrPkg);
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:true, title:rstr.jitandlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.jitandlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.assign.setCaller({self:m_this, caller:_onClickAssignHerosExp});
		m_items.exchange.setCaller({self:m_this, caller:_onClickExchange});
		m_items.inum.setCaller({self:m_this, caller:_onNumChange});
		m_items.inum.setLimit(_onGetNumLimit);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateExpsBar();
		_updateCityRes();
		_updateTodayTimes();
	};
	
	var _updateExpsBar = function(){
		if ( !_isShow() ) return;
		m_items.herosexpbar.setRange(m_g.getImgr().getRoleAttrVal(ATTR.MXPS));
		m_items.herosexpbar.setValue(0,m_g.getImgr().getRoleAttrVal(ATTR.XPS));
	};
	
	var _updateCityRes = function(){
		if ( !_isShow() ) return;
		for ( var i=0; i<4; ++i ) {
			_setListItemResIcon(i);
			_setListItemResNeedAndHasNum(i);
		}
	};
	
	var _setListItemResIcon = function(idx){
		var res = ItemResUtil.findItemres( m_g.getImgr().getCityResResIdByIdx(idx) );
		IMG.setBKImage(m_items['icon'+idx], IMG.makeSmallImg(res.smallpic));
	};
	
	var _setListItemResNeedAndHasNum = function(idx){
		var curNum = m_items.inum.getVal();
		var hasNum = RStrUtil.formatResNumStr(m_g.getImgr().getCityResValByIdx(idx));
		var msg = TQ.format(rstr.jitandlg.lbl.exchangeItem, curNum, hasNum);
		TQ.setTextEx(m_items['res'+idx], msg);
	};
	
	var _updateTodayTimes = function(){
		if ( !_isShow() ) return;
		
		var todaytimes = m_g.getImgr().getExchangeExp().todaytimes;
		var msg = TQ.format(rstr.jitandlg.lbl.todayTimes, todaytimes.cur, todaytimes.max);
		TQ.setTextEx(m_items.todayTimes, msg);
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _onLoginOk = function(){
		ExchangeHeroExpSender.sendGetTimes(m_g);
	};
	
	var _onRolebaseChange = function(){
		_updateExpsBar();
	};
	
	var _onCityResChange = function(){
		_updateCityRes();
	};
	
	var _onNumChange = function(){
		_updateCityRes();
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if ( netdata.todaytimes ) {
			TQ.dictCopy(m_g.getImgr().getExchangeExp().todaytimes, netdata.todaytimes);
			_updateTodayTimes();
		}
	};
	
	var _onClickAssignHerosExp = function(){
		UIM.openDlg('roleassignexp');
	};
	
	var _onClickExchange = function(){
		if ( !_hasEnoughTimes() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughTimes);
			return;
		}
		
		if ( !_hasEnoughRes() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughRes);
			return;
		}
		
		if ( !_hasEnoughCapacity() ){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.jitandlg.tip.noEnoughCap);
			return;
		}		
		
		ExchangeHeroExpSender.sendExchange(m_g, m_items.inum.getVal());
		m_items.inum.setVal(1);
	};
	
	var _onGetNumLimit = function(){
		return {min:1, max:_getCanMaxTimes()};
	};
	
	var _hasEnoughTimes = function(){
		return _getTodayLeftTimes() > 0;
	};
	
	var _hasEnoughRes = function(){
		return _getResCanTimes() > 0;
	};
	
	var _hasEnoughCapacity = function(){
		return _getCapacityCanTimes() > 0;
	};
	
	var _getCanMaxTimes = function(){
		var maxTimes = Math.min(_getTodayLeftTimes(), _getResCanTimes(), _getCapacityCanTimes());
		return Math.max(1, maxTimes);
	};	
	
	var _getTodayLeftTimes = function(){
		var todaytimes = m_g.getImgr().getExchangeExp().todaytimes;
		return todaytimes.max - todaytimes.cur;
	};
	
	var _getResCanTimes = function(){
		var resCanTimes = 0xffffffff;
		for ( var i=0; i<4; ++i ) {
			var times = Math.floor(m_g.getImgr().getCityResValByIdx(i)/1000);
			if ( times < resCanTimes ) {
				resCanTimes = times;
			}
		}
		return resCanTimes;
	};
	
	var _getCapacityCanTimes = function(){
		return Math.floor((m_g.getImgr().getRoleAttrVal(ATTR.MXPS) - m_g.getImgr().getRoleAttrVal(ATTR.XPS))/1000);
	};
	//JiTanDlg-unittest-end
});
