/*******************************************************************************/
SetTradingAreaDlg = Class.extern(function(){
	//SetTradingAreaDlg-unittest-start
	var m_this = null;
	var m_g = null;
	var m_dlg = null;
	var m_items = {};
	var m_mems = [];
	var m_setLastSelected = false;
	var m_maxCitys = 4;
	var m_lastSelecteds = [];
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.TRADING_AREA, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(maxCitys, lastSelecteds){
		_initParams(maxCitys, lastSelecteds);
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initParams = function(maxCitys, lastSelecteds){
		m_setLastSelected = false;
		m_maxCitys = maxCitys;
		m_lastSelecteds = lastSelecteds;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : true,
				title : rstr.alli.settradingareadlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.settradingareadlg, m_items);		
	};
	
	var _setCallers = function(){
		m_items.list.setCaller({self:m_this, caller:_onClickListItem});
		m_items.autoSelBtn.setCaller({self:m_this, caller:_onClickAutoSelBtn});
		m_items.allCancelBtn.setCaller({self:m_this, caller:_onClickAllCancelBtn});
		m_items.saveSelBtn.setCaller({self:m_this, caller:_onClickSaveSelBtn});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		TradingAreaSender.sendGetMembers(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		if (!netevent.data.mems) return;
		TQ.dictCopy(m_mems, netevent.data.mems);
		m_mems.sort(function(a, b){
			return a.distance - b.distance; });
		_udpate();
	};
	
	var _udpate = function(){
		if (!m_dlg || !m_dlg.isShow()) return;
		_setListItems();
		_selectByLastSelectItems();
		_setTotalInfo();
	};
	
	var _setListItems = function(){
		m_items.list.setItemCount(m_mems.length);
		for (var i=0; i<m_mems.length; ++i ) {
			var item = m_items.list.getItem(i);
			var mem = m_mems[i];
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
			if (!TQ.find(m_mems, 'roleName', selectRoleName)) continue;
			_selectByIdx(TQ.getLastFindIdx());
		}
	};
	
	var _unSelectListItems = function(){
		for (var i=0; i<m_mems.length; ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.sel.setCheck(0);
		}		
	};
	
	var _setTotalInfo = function(){
		TQ.setTextEx(m_items.cityNumber, _getTotalSelectNumber() + '/' + m_maxCitys);
		TQ.setTextEx(m_items.totalDis, _getTotalSelectDistance() );
		TQ.setTextEx(m_items.needTime, _getTotalSelectNeedTime() );
		TQ.setTextEx(m_items.gain, _getTotalSelectGain() + ' ' + rstr.comm.money );
	};
	
	var _getTotalSelectNumber = function(){
		return _getSelectSum(function(itemIdx){	return 1;  });
	};
	
	var _getTotalSelectDistance = function(){
		return _getSelectSum(function(itemIdx){ return m_mems[itemIdx].distance;  });
	};
	
	var _getTotalSelectNeedTime = function(){
		return _getSelectSum(function(itemIdx){
			return m_mems[itemIdx].needTime ? m_mems[itemIdx].needTime : 0;  });
	};
	
	var _getTotalSelectGain = function(){
		return _getSelectSum(function(itemIdx){
			return m_mems[itemIdx].gain ? m_mems[itemIdx].gain : 0;  });
	};
	
	var _getSelectSum = function(collectFun){
		var sum = 0;
		for (var i=0; i<m_mems.length; ++i) {
			if (!_isSelectedByIdx(i)) continue;
			sum += collectFun(i);
		}
		return sum;
	};
	
	var _selectByIdx = function(itemIdx){
		if (_getTotalSelectNumber() >= m_maxCitys) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.settradingareadlg.tip.maxCount);
			return;
		}
		
		m_items.list.getItem(itemIdx).exsubs.sel.setCheck(1);
		if (!m_mems[itemIdx].isDetail) {
			TradingAreaSender.sendGetMemDetail(m_g, m_mems[itemIdx].roleId);
		}
	};
	
	var _unselectByIdx = function(itemIdx){
		m_items.list.getItem(itemIdx).exsubs.sel.setCheck(0);
	};
	
	var _isSelectedByIdx = function(itemIdx){
		return m_items.list.getItem(itemIdx).exsubs.sel.getCheck() == 1;
	};
	
	var _onClickListItem = function(e, index) {
		var item = m_items.list.getItem(index);
		if (!item) return;
		
		var isWillCheck = !_isSelectedByIdx(index);
		if (isWillCheck) {
			_selectByIdx(index);
		} else {
			_unselectByIdx(index);
		}
		
		_setTotalInfo();
	};
	
	var _onClickAutoSelBtn = function(){
		_unSelectListItems();
		for ( var i=0; i<m_mems.length && i<m_maxCitys; ++i) {
			_selectByIdx(i);
		}
		_setTotalInfo();
	};
	
	var _onClickAllCancelBtn = function(){
		_unSelectListItems();
		_setTotalInfo();
	};
	
	var _onClickSaveSelBtn = function(){
		if (_getTotalSelectNumber() == 0) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.settradingareadlg.tip.noSelected);
			return;
		}
		
		TradingAreaSender.sendSetTradingArea(m_g, _collectSelectedRoleIds());
		m_dlg.hide();
	};
	
	var _collectSelectedRoleIds = function(){
		var roleIds = [];
		_getSelectSum(function(itemIdx){
			roleIds.push(m_mems[itemIdx].roleId); return 1;  });
		return roleIds;
	};
		
	//SetTradingAreaDlg-unittest-end
});
