/*******************************************************************************/
CommBuildUpdater =  Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_info = null;
	_lc_.m_list = null;
	_lc_.m_rlist = null;
	_lc_.m_rgroupList = null;
	var m_setterMaps = null;

	this.init = function(g, info){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_info = info;
		_lc_.m_list = _lc_.m_info.list;
		_lc_.m_rlist = _lc_.m_info.rlist ? _lc_.m_info.rlist : null;
		_lc_.m_rgroupList = _lc_.m_info.rgroupList ? _lc_.m_info.rgroupList : null;
	};
	
	this.update = function(){
		if (_lc_.m_rlist) {
			_lc_._updateListByResList();
		}
		else if (_lc_.m_rgroupList) {
			_lc_._updateListByGroupResList();
		}
	};
	
	_lc_._updateListByResList = function(){
		_lc_.m_list.setItemCount(_lc_.m_rlist.length);
		var idx = 0;
		var factCount = _lc_._updateOneList(idx, 0, _lc_.m_rlist);
		_lc_.m_list.setItemCount(factCount);
	};
	
	_lc_._updateListByGroupResList = function(){
		var idx = 0;
		_lc_.m_list.setItemCount(_lc_._getGroupResListItemCount());
		for ( var groupIdx=0; groupIdx<_lc_.m_rgroupList.length; ++groupIdx ){
			idx = _lc_._updateOneList(idx, groupIdx, _lc_.m_rgroupList[groupIdx]);
		}
		_lc_.m_list.setItemCount(idx);
	};
	
	_lc_._updateOneList = function(startListIdx, groupIdx, resList){
		var idx = startListIdx;
		for ( var i=0; i<resList.length; ++i ){
			var ritem = resList[i];
			if ( ritem.state == 0 ) continue;
			
			var item = _lc_.m_list.getItem(idx++);
			_lc_._setItemCon(_lc_._combineResIdx(groupIdx, i), item, ritem);
		}
		return idx;
	};
	
	_lc_._getGroupResListItemCount = function(){
		var itemCount = 0;
		for ( var i=0; i<_lc_.m_rgroupList.length; ++i ){
			itemCount += _lc_.m_rgroupList[i].length;
		}
		return itemCount;
	};
	
	_lc_._combineResIdx = function(groupIdx, ritemIdx){
		return groupIdx * 10000 + ritemIdx;
	};
	
	_lc_._setItemCon = function(combineResIdx, item, resItem){
		for ( var i=0; i<_lc_.m_info.needitems.length; ++i ){
			var lblName = _lc_.m_info.needitems[i];
			var setter = _lc_._getSetterByLableName(lblName);
			setter(combineResIdx, item, resItem);
		}
	};
	
	_lc_._getSetterByLableName = function(lblName){
		if (!m_setterMaps) { // delay init
			m_setterMaps = {
				 'icon':_lc_._setItemIcon
				,'stop':_lc_._checkSendStopCmd
				,'name':_lc_._setItemName
				,'state':_lc_._setItemState
				,'levelstate':_lc_._setItemLevelState
				,'number':_lc_._setItemNumber
				,'lefttime':_lc_._setItemLefttime
				,'curlevel':_lc_._setItemCurLevel
				,'goallevel':_lc_._setItemGoalLevel
				,'opbtn':_lc_._setItemOp
				,'null':function(){}
			};
		}
		
		var setter = m_setterMaps[lblName];
		if (!setter) {
			setter = m_setterMaps['null'];
		}
		
		return setter;
	};
	
	_lc_._setItemIcon = function(combineResIdx, item, resItem){
		IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(resItem.itemres.smallpic));
	};
	
	_lc_._checkSendStopCmd = function(combineResIdx, item, resItem){
		if ( resItem.state != BUILD_STATE.UPGRADE && resItem.state != BUILD_STATE.DOWN )  return;
		if ( !_lc_.m_info.sendStopCmdToSvr ) return; 
		if ( resItem.stoptime > _lc_.m_g.getSvrTimeS() ) return;
		
		_lc_._sendStopCmdToSvr(resItem);
	};	
	
	_lc_._setItemName = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.name, resItem.itemres.name);
		TQ.setClass(item.exsubs.name, _getClassName(resItem));
	};
	
	_lc_._setItemState = function(combineResIdx, item, resItem){
		if ( _lc_.m_info.getStateName != null ) {
			TQ.setTextEx(item.exsubs.state, _lc_.m_info.getStateName(resItem, _lc_._getListGroupIdx(combineResIdx)));
		}
		else if ( resItem.level == 0 && resItem.state == BUILD_STATE.UPGRADE ){// first build or learn
			TQ.setTextEx(item.exsubs.state, _lc_.m_info.firststatefmt);
		}
		else {
			TQ.setTextEx(item.exsubs.state, _lc_.m_info.statefmt[resItem.state]);
		}
		TQ.setClass(item.exsubs.state, _getClassName(resItem));
	};	
	
	_lc_._setItemLevelState = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.levelstate, resItem.level+'->'+_lc_._getGoalLevel(resItem));
		TQ.setClass(item.exsubs.levelstate, _getClassName(resItem));
	};
	
	_lc_._setItemNumber = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.levelstate, TQ.format(rstr.soldierdlg.recruitnum,resItem.number) );
		TQ.setClass(item.exsubs.levelstate, _getClassName(resItem));
	};
	
	_lc_._setItemLefttime = function(combineResIdx, item, resItem){
		var showTime = 0;
		if ( resItem.state == BUILD_STATE.UPGRADE || resItem.state == BUILD_STATE.DOWN){
			leftTime = Math.max(0, resItem.stoptime - _lc_.m_g.getSvrTimeS());
			showTime = leftTime;
		}
		TQ.setTextEx(item.exsubs.lefttime, TQ.formatTime(0,  showTime));
		TQ.setClass(item.exsubs.lefttime, _getClassName(resItem));
	};
	
	_lc_._setItemCurLevel = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.curlevel, resItem.level);
		TQ.setClass(item.exsubs.curlevel, _getClassName(resItem));
	};
	
	_lc_._setItemGoalLevel = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.nextlevel, _lc_._getGoalLevel(resItem));
		TQ.setClass(item.exsubs.nextlevel, _getClassName(resItem));
	};
	
	_lc_._setItemOp = function(combineResIdx, item, resItem){
		item.exsubs.opspeed.setId(combineResIdx);
		item.exsubs.opcancel.setId(combineResIdx);
		item.exsubs.opspeed.setCaller({self:_lc_.m_this, caller:_lc_._onSpeedBtn});
		item.exsubs.opcancel.setCaller({self:_lc_.m_this, caller:_lc_._onCancelBtn});
	};
	
	_lc_._onSpeedBtn = function(combineResIdx){
		var item = _lc_._getResItemByCombineResIdx(combineResIdx);
		var groupIdx = Math.floor(combineResIdx/10000);
		_lc_.m_info.opspeed(item, _lc_._getListGroupIdx(combineResIdx));
	};
	
	_lc_._onCancelBtn = function(combineResIdx){
		var item = _lc_._getResItemByCombineResIdx(combineResIdx);
		_lc_.m_info.opcancel(item, _lc_._getListGroupIdx(combineResIdx));
	};
	
	_lc_._getResItemByCombineResIdx = function(combineResIdx){
		if (_lc_.m_rlist){
			return _lc_.m_rlist[combineResIdx];
		}
		else if (_lc_.m_rgroupList){
			return _lc_.m_rgroupList[_lc_._getListGroupIdx(combineResIdx)][_lc_._getItemIdxInList(combineResIdx)];
		}
		
		alert('error: 59030235');
		return null;
	};
	
	_lc_._getListGroupIdx = function(combineResIdx){
		return Math.floor(combineResIdx/10000);
	};
	
	_lc_._getItemIdxInList = function(combineResIdx){
		return combineResIdx%10000;
	};
	
	_lc_._getGoalLevel = function(resItem){
		if ( typeof(resItem.level) != 'number' ) {
			return resItem.level;
		}
		else if ( resItem.state == BUILD_STATE.UPGRADE ){
			return resItem.level + 1;
		}
		else if ( resItem.state == BUILD_STATE.DOWN ){
			return resItem.level - 1;
		}
		else {
			return resItem.level;
		}
	};
	
	_lc_._sendStopCmdToSvr = function(resItem){
		_lc_.m_info.sendStopCmdToSvr(resItem);
	};
	
	var _getClassName = function(resItem){
		if (resItem && resItem.isCulture) {
			return 'comm_yellowfont';
		} else {
			return 'comm_whitefont';
		}
	};

	//CommBuildUpdater-unittest-end
});