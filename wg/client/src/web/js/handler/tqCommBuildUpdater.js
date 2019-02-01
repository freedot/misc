/*******************************************************************************/
CommBuildUpdater =  Class.extern(function(){
	//CommBuildUpdater-unittest-start
	var m_g = null;
	var m_this = null;
	var m_info = null;
	var m_list = null;
	var m_rlist = null;
	var m_rgroupList = null;
	var m_setterMaps = null;

	this.init = function(g, info){
		m_g = g;
		m_this = this;
		m_info = info;
		m_list = m_info.list;
		m_rlist = m_info.rlist ? m_info.rlist : null;
		m_rgroupList = m_info.rgroupList ? m_info.rgroupList : null;
	};
	
	this.update = function(){
		if (m_rlist) {
			_updateListByResList();
		}
		else if (m_rgroupList) {
			_updateListByGroupResList();
		}
	};
	
	var _updateListByResList = function(){
		m_list.setItemCount(m_rlist.length);
		var idx = 0;
		var factCount = _updateOneList(idx, 0, m_rlist);
		m_list.setItemCount(factCount);
	};
	
	var _updateListByGroupResList = function(){
		var idx = 0;
		m_list.setItemCount(_getGroupResListItemCount());
		for ( var groupIdx=0; groupIdx<m_rgroupList.length; ++groupIdx ){
			idx = _updateOneList(idx, groupIdx, m_rgroupList[groupIdx]);
		}
		m_list.setItemCount(idx);
	};
	
	var _updateOneList = function(startListIdx, groupIdx, resList){
		var idx = startListIdx;
		for ( var i=0; i<resList.length; ++i ){
			var ritem = resList[i];
			if ( ritem.state == 0 ) continue;
			
			var item = m_list.getItem(idx++);
			_setItemCon(_combineResIdx(groupIdx, i), item, ritem);
		}
		return idx;
	};
	
	var _getGroupResListItemCount = function(){
		var itemCount = 0;
		for ( var i=0; i<m_rgroupList.length; ++i ){
			itemCount += m_rgroupList[i].length;
		}
		return itemCount;
	};
	
	var _combineResIdx = function(groupIdx, ritemIdx){
		return groupIdx * 10000 + ritemIdx;
	};
	
	var _setItemCon = function(combineResIdx, item, resItem){
		for ( var i=0; i<m_info.needitems.length; ++i ){
			var lblName = m_info.needitems[i];
			var setter = _getSetterByLableName(lblName);
			setter(combineResIdx, item, resItem);
		}
	};
	
	var _getSetterByLableName = function(lblName){
		if (!m_setterMaps) { // delay init
			m_setterMaps = {
				 'icon':_setItemIcon
				,'stop':_checkSendStopCmd
				,'name':_setItemName
				,'state':_setItemState
				,'levelstate':_setItemLevelState
				,'number':_setItemNumber
				,'lefttime':_setItemLefttime
				,'curlevel':_setItemCurLevel
				,'goallevel':_setItemGoalLevel
				,'opbtn':_setItemOp
				,'null':function(){}
			};
		}
		
		var setter = m_setterMaps[lblName];
		if (!setter) {
			setter = m_setterMaps['null'];
		}
		
		return setter;
	};
	
	var _setItemIcon = function(combineResIdx, item, resItem){
		IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(resItem.itemres.smallpic));
	};
	
	var _checkSendStopCmd = function(combineResIdx, item, resItem){
		if ( resItem.state != BUILD_STATE.UPGRADE && resItem.state != BUILD_STATE.DOWN )  return;
		if ( !m_info.sendStopCmdToSvr ) return; 
		if ( resItem.stoptime > m_g.getSvrTimeS() ) return;
		
		_sendStopCmdToSvr(resItem);
	};	
	
	var _setItemName = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.name, resItem.itemres.name);
		TQ.setClass(item.exsubs.name, _getClassName(resItem));
	};
	
	var _setItemState = function(combineResIdx, item, resItem){
		if ( m_info.getStateName != null ) {
			TQ.setTextEx(item.exsubs.state, m_info.getStateName(resItem, _getListGroupIdx(combineResIdx)));
		}
		else if ( resItem.level == 0 && resItem.state == BUILD_STATE.UPGRADE ){// first build or learn
			TQ.setTextEx(item.exsubs.state, m_info.firststatefmt);
		}
		else {
			TQ.setTextEx(item.exsubs.state, m_info.statefmt[resItem.state]);
		}
		TQ.setClass(item.exsubs.state, _getClassName(resItem));
	};	
	
	var _setItemLevelState = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.levelstate, resItem.level+'->'+_getGoalLevel(resItem));
		TQ.setClass(item.exsubs.levelstate, _getClassName(resItem));
	};
	
	var _setItemNumber = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.levelstate, TQ.format(rstr.soldierdlg.recruitnum,resItem.number) );
		TQ.setClass(item.exsubs.levelstate, _getClassName(resItem));
	};
	
	var _setItemLefttime = function(combineResIdx, item, resItem){
		var showTime = 0;
		if ( resItem.state == BUILD_STATE.UPGRADE || resItem.state == BUILD_STATE.DOWN){
			leftTime = Math.max(0, resItem.stoptime - m_g.getSvrTimeS());
			showTime = leftTime;
		}
		TQ.setTextEx(item.exsubs.lefttime, TQ.formatTime(0,  showTime));
		TQ.setClass(item.exsubs.lefttime, _getClassName(resItem));
	};
	
	var _setItemCurLevel = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.curlevel, resItem.level);
		TQ.setClass(item.exsubs.curlevel, _getClassName(resItem));
	};
	
	var _setItemGoalLevel = function(combineResIdx, item, resItem){
		TQ.setTextEx(item.exsubs.nextlevel, _getGoalLevel(resItem));
		TQ.setClass(item.exsubs.nextlevel, _getClassName(resItem));
	};
	
	var _setItemOp = function(combineResIdx, item, resItem){
		item.exsubs.opspeed.setId(combineResIdx);
		item.exsubs.opcancel.setId(combineResIdx);
		item.exsubs.opspeed.setCaller({self:m_this, caller:_onSpeedBtn});
		item.exsubs.opcancel.setCaller({self:m_this, caller:_onCancelBtn});
	};
	
	var _onSpeedBtn = function(combineResIdx){
		var item = _getResItemByCombineResIdx(combineResIdx);
		var groupIdx = Math.floor(combineResIdx/10000);
		m_info.opspeed(item, _getListGroupIdx(combineResIdx));
	};
	
	var _onCancelBtn = function(combineResIdx){
		var item = _getResItemByCombineResIdx(combineResIdx);
		m_info.opcancel(item, _getListGroupIdx(combineResIdx));
	};
	
	var _getResItemByCombineResIdx = function(combineResIdx){
		if (m_rlist){
			return m_rlist[combineResIdx];
		}
		else if (m_rgroupList){
			return m_rgroupList[_getListGroupIdx(combineResIdx)][_getItemIdxInList(combineResIdx)];
		}
		
		alert('error: 59030235');
		return null;
	};
	
	var _getListGroupIdx = function(combineResIdx){
		return Math.floor(combineResIdx/10000);
	};
	
	var _getItemIdxInList = function(combineResIdx){
		return combineResIdx%10000;
	};
	
	var _getGoalLevel = function(resItem){
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
	
	var _sendStopCmdToSvr = function(resItem){
		m_info.sendStopCmdToSvr(resItem);
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