/*******************************************************************************/
SetTradingAreaDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_mems = [];
	var m_setLastSelected = false;
	var m_maxCitys = 4;
	var m_lastSelecteds = [];
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.TRADING_AREA, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(maxCitys, lastSelecteds){
		_initParams(maxCitys, lastSelecteds);
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	var _initParams = function(maxCitys, lastSelecteds){
		m_setLastSelected = false;
		m_maxCitys = maxCitys;
		m_lastSelecteds = lastSelecteds;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : true,
				title : rstr.alli.settradingareadlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.settradingareadlg, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.list.setCaller({self:_lc_.m_this, caller:_lc_._onClickListItem});
		_lc_.m_items.autoSelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAutoSelBtn});
		_lc_.m_items.allCancelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAllCancelBtn});
		_lc_.m_items.saveSelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSaveSelBtn});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		TradingAreaSender.sendGetMembers(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		if (!netevent.data.mems) return;
		TQ.dictCopy(_lc_.m_mems, netevent.data.mems);
		_lc_.m_mems.sort(function(a, b){
			return a.distance - b.distance; });
		_udpate();
	};
	
	var _udpate = function(){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		_setListItems();
		_selectByLastSelectItems();
		_setTotalInfo();
	};
	
	var _setListItems = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_mems.length);
		for (var i=0; i<_lc_.m_mems.length; ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var mem = _lc_.m_mems[i];
			TQ.setTextEx(item.exsubs.no, i+1);
			TQ.setTextEx(item.exsubs.roleName, mem.roleName);
			var pos = FieldUtil.getPosByGridId(mem.gridId);
			TQ.setTextEx(item.exsubs.cood, '(' + pos.x + ',' + pos.y + ')' );
			TQ.setTextEx(item.exsubs.buildLevel, mem.buildLevel);
			TQ.setTextEx(item.exsubs.distance, mem.distance);
		}
	};
	
	var _selectByLastSelectItems = function(){
		if (m_setLastSelected) return;
		m_setLastSelected = true;
		
		_unSelectListItems();

		for ( var i=0; i<m_lastSelecteds.length; ++i ) {
			var selectRoleName = m_lastSelecteds[i];
			if (!TQ.find(_lc_.m_mems, 'roleName', selectRoleName)) continue;
			_selectByIdx(TQ.getLastFindIdx());
		}
	};
	
	var _unSelectListItems = function(){
		for (var i=0; i<_lc_.m_mems.length; ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.sel.setCheck(0);
		}		
	};
	
	var _setTotalInfo = function(){
		TQ.setTextEx(_lc_.m_items.cityNumber, _getTotalSelectNumber() + '/' + m_maxCitys);
		TQ.setTextEx(_lc_.m_items.totalDis, _getTotalSelectDistance() );
		TQ.setTextEx(_lc_.m_items.needTime, _getTotalSelectNeedTime() );
		TQ.setTextEx(_lc_.m_items.gain, _getTotalSelectGain() + ' ' + rstr.comm.money );
	};
	
	var _getTotalSelectNumber = function(){
		return _getSelectSum(function(itemIdx){	return 1;  });
	};
	
	var _getTotalSelectDistance = function(){
		return _getSelectSum(function(itemIdx){ return _lc_.m_mems[itemIdx].distance;  });
	};
	
	var _getTotalSelectNeedTime = function(){
		return _getSelectSum(function(itemIdx){
			return _lc_.m_mems[itemIdx].needTime ? _lc_.m_mems[itemIdx].needTime : 0;  });
	};
	
	var _getTotalSelectGain = function(){
		return _getSelectSum(function(itemIdx){
			return _lc_.m_mems[itemIdx].gain ? _lc_.m_mems[itemIdx].gain : 0;  });
	};
	
	var _getSelectSum = function(collectFun){
		var sum = 0;
		for (var i=0; i<_lc_.m_mems.length; ++i) {
			if (!_isSelectedByIdx(i)) continue;
			sum += collectFun(i);
		}
		return sum;
	};
	
	var _selectByIdx = function(itemIdx){
		if (_getTotalSelectNumber() >= m_maxCitys) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.settradingareadlg.tip.maxCount);
			return;
		}
		
		_lc_.m_items.list.getItem(itemIdx).exsubs.sel.setCheck(1);
		if (!_lc_.m_mems[itemIdx].isDetail) {
			TradingAreaSender.sendGetMemDetail(_lc_.m_g, _lc_.m_mems[itemIdx].roleId);
		}
	};
	
	var _unselectByIdx = function(itemIdx){
		_lc_.m_items.list.getItem(itemIdx).exsubs.sel.setCheck(0);
	};
	
	var _isSelectedByIdx = function(itemIdx){
		return _lc_.m_items.list.getItem(itemIdx).exsubs.sel.getCheck() == 1;
	};
	
	_lc_._onClickListItem = function(e, index) {
		var item = _lc_.m_items.list.getItem(index);
		if (!item) return;
		
		var isWillCheck = !_isSelectedByIdx(index);
		if (isWillCheck) {
			_selectByIdx(index);
		} else {
			_unselectByIdx(index);
		}
		
		_setTotalInfo();
	};
	
	_lc_._onClickAutoSelBtn = function(){
		_unSelectListItems();
		for ( var i=0; i<_lc_.m_mems.length && i<m_maxCitys; ++i) {
			_selectByIdx(i);
		}
		_setTotalInfo();
	};
	
	_lc_._onClickAllCancelBtn = function(){
		_unSelectListItems();
		_setTotalInfo();
	};
	
	_lc_._onClickSaveSelBtn = function(){
		if (_getTotalSelectNumber() == 0) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.settradingareadlg.tip.noSelected);
			return;
		}
		
		TradingAreaSender.sendSetTradingArea(_lc_.m_g, _collectSelectedRoleIds());
		_lc_.m_dlg.hide();
	};
	
	var _collectSelectedRoleIds = function(){
		var roleIds = [];
		_getSelectSum(function(itemIdx){
			roleIds.push(_lc_.m_mems[itemIdx].roleId); return 1;  });
		return roleIds;
	};
		
	//SetTradingAreaDlg-unittest-end
});
