/******************************************************************************
******************************************************************************/
SelectExpedTargetDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var COPYFIELD_TAB_IDX = 0;
	var ENEMY_TAB_IDX = 1;
	var ENEMYTYPE_FAVORITE_IDX = 0;
	var ENEMYTYPE_ENEMY_IDX = 1;
	
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_caller = null;
	_lc_.m_typeRess = null;
	_lc_.m_targetSpec = null;
	_lc_.m_openPageIdxs = null;
	var m_enemys = [];
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_._initCopyFieldTypeRess();
		_lc_.m_g.regEvent(EVT.FAVORITE_UPDATE, 0, _lc_.m_this, _lc_._onFavoriteUpdate );
		_lc_.m_g.regEvent(EVT.ENEMY_UPDATE, 0, _lc_.m_this, _lc_._onEnemyUpdate );
		_lc_.m_g.regEvent(EVT.NET, NETCMD.MILITARY, _lc_.m_this, _lc_._onSuccCopyFieldsNet );
	};

	this.openDlg = function(targetSpec, openPage){
		_lc_._setParams(targetSpec, openPage);
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
		_lc_._openPage();
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items});
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};	
	
	//-- only for test
	this.getCtrl = function(tag){
		return _lc_.m_items[tag];
	};
	
	//-- only for test
	this.isShow = function(){
		if (!_lc_.m_dlg)  return false;
		return _lc_.m_dlg.isShow();
	};
	
	//-- only for test
	this.click = function(){
		_lc_._onClickConfirmBtn();
	};
	
	this.setCaller = function(caller) {
		_lc_.m_caller = caller;
	};
	
	_lc_._setParams = function(targetSpec, openPage){
		_lc_.m_targetSpec = targetSpec;
		_lc_.m_openPageIdxs = openPage;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:true, title:rstr.selectexpedtarget.title, pos:{x:"center", y:30} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.expedition.selecttarget, _lc_.m_items);
		_lc_._setTabsName();
		_lc_._setCopyFieldTypeList();
		_lc_._setEnemyTypeList();
		_lc_._setCallers();
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._setTabsName = function(){
		for ( var i=0; i<rstr.selectexpedtarget.tabs.length; ++i ) {
			_lc_.m_items.tablist.setTabText(i, rstr.selectexpedtarget.tabs[i]);
		};
	};
	
	_lc_._setCopyFieldTypeList = function(){
		var items = _lc_.m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.typelist.setItemCount(_lc_.m_typeRess.length);
		for ( var i=0, cnt=items.typelist.getCount(); i<cnt; ++i ){
			var typeRes = _lc_.m_typeRess[i];
			var listItem = items.typelist.getItem(i);
			TQ.setText(listItem.exsubs.name, typeRes.typename);
		}
	};
	
	_lc_._setEnemyTypeList = function(){
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.typelist.setItemCount(rstr.selectexpedtarget.lbl.emenytypes.length);
		for ( var i=0, cnt=items.typelist.getCount(); i<cnt; ++i ){
			var typeName = rstr.selectexpedtarget.lbl.emenytypes[i];
			var listItem = items.typelist.getItem(i);
			TQ.setText(listItem.exsubs.name, typeName);
		}
	};
	
	_lc_._setCallers = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_onDlgEvent});
		_lc_._setTabListCaller();
		_lc_._setCopyFieldTypeListCaller();
		_lc_._setEnemyTypeListCaller();
		_lc_._setTargetListCaller();
		_lc_._setBtnsCaller();
	};
	
	_lc_._setTabListCaller = function(){
		_lc_.m_items.tablist.setCaller({self:_lc_.m_this, caller:_lc_._onActiveTab});
	};
	
	_lc_._setCopyFieldTypeListCaller = function(){
		var items = _lc_.m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.typelist.setCaller({self:_lc_.m_this, caller:_lc_._onSelectCopyFieldList});
	};
	
	_lc_._setEnemyTypeListCaller = function(){
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.typelist.setCaller({self:_lc_.m_this, caller:_lc_._onSelectEnemyTypeList});	
	};
	
	_lc_._setTargetListCaller = function(){
		var items = _lc_.m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.targetlist.setCaller({self:_lc_.m_this, caller:_lc_._onSelectTargetList});	
		items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCaller({self:_lc_.m_this, caller:_lc_._onSelectTargetList});	
	};
	
	_lc_._setBtnsCaller = function(){
		_lc_.m_items.deleteBtn.setCaller({self:_lc_.m_this, caller:_lc_._onDeleteFavoriteItem});
		_lc_.m_items.confirmBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickConfirmBtn});
		_lc_.m_items.cancelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancelBtn});
	};

	_lc_._initInfo = function(){
		MilitarySender.sendGetFavorites(_lc_.m_g);
	};
	
	_lc_._openPage = function(){
		_lc_.m_items.tablist.activeTab(_lc_.m_openPageIdxs.tabIdx);
		_lc_.m_items.tablist.getTabItems(_lc_.m_openPageIdxs.tabIdx).typelist.setCurSel(_lc_.m_openPageIdxs.typeListIdx);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('selectexpedtarget');
		}
	};

	
	_lc_._onActiveTab = function(idx){
		var items = _lc_.m_items.tablist.getTabItems(idx);
		var curSel = items.typelist.getCurSel();
		items.typelist.setCurSel(curSel >= 0 ? curSel : 0);
		_lc_._setDeleteBtnEnableState();
	};	
	
	_lc_._onSelectCopyFieldList = function(e, idx){
		var items = _lc_.m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		var targetRes = _lc_.m_typeRess[idx].targetlist;
		items.targetlist.setItemCount(targetRes.length);
		for ( var i=0; i<targetRes.length; ++i ) {
			var res = targetRes[i];
			var listItem = items.targetlist.getItem(i);
			TQ.setText(listItem.exsubs.name, res.name);
			TQ.setText(listItem.exsubs.level, res.level);
			TQ.setText(listItem.exsubs.taofa, _lc_._isSuccCopyField('taofa', res.id) ? rstr.selectexpedtarget.lbl.fightsucc : rstr.selectexpedtarget.lbl.fightnosucc);
			TQ.setText(listItem.exsubs.needtime, TQ.formatTime(0, res.needtime));
		}
		items.targetlist.setCurSel(-1);
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items});
	};
	
	_lc_._onSelectEnemyTypeList = function(e, idx){
		if ( idx == ENEMYTYPE_FAVORITE_IDX ) {
			_lc_._setFavoriteListItems();
		}
		else if ( idx == ENEMYTYPE_ENEMY_IDX ) {
			_lc_._setEnemyListItems();
		}
		else {
			alert('error: 398e84');
		}
		
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);
		_lc_._setDeleteBtnEnableState();
	};
	
	_lc_._onSelectTargetList = function(e, idx){
		_lc_._setDeleteBtnEnableState();
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items});
	};
	
	_lc_._onDeleteFavoriteItem = function(id){
		var field = _lc_._getCurSelField();
		if (!field) {
			return;
		}
		
		MilitarySender.sendDelFavoriteTarget(_lc_.m_g, field.gridId);
	};
	
	_lc_._onClickConfirmBtn = function(){/*
		var target = _lc_._getCurSelField();
		if ( !target ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.selectexpedtarget.err.noSelTarget);
			return;
		}
		*/
		if ( !_lc_.m_targetSpec.isSatisfiedBy(_lc_._getCurSelField()) ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, _lc_.m_targetSpec.getInvalidTip());
			return;
		}
		
		if ( _lc_.m_caller ) {
			_lc_.m_caller.caller.call(_lc_.m_caller.self, _lc_._getCurSelField());
		}
		
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickCancelBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._getCurSelTarget = function(){
		return ExpedUtil.makeExpedTarget(_lc_._getCurSelField());
	};
	
	_lc_._getCurSelField = function(){
		var curSelTabIdx = _lc_._getCurSelTabIdx();
		var curSelTypeIdx = _lc_._getCurSelTypeIdx();
		var curSelTargetIdx = _lc_._getCurSelTargetIdx();
		
		if ( curSelTabIdx == COPYFIELD_TAB_IDX ) {
			return _lc_._getCurSelCopyFieldTarget(curSelTypeIdx, curSelTargetIdx);
		}
		else if (curSelTabIdx == ENEMY_TAB_IDX 
			&& curSelTypeIdx == ENEMYTYPE_FAVORITE_IDX ) {
			return _lc_._getCurSelFavoriteTarget(curSelTargetIdx);
		}
		else if (curSelTabIdx == ENEMY_TAB_IDX 
			&& curSelTypeIdx == ENEMYTYPE_ENEMY_IDX ) {
			return _lc_._getCurSelEnemyTarget(curSelTargetIdx);
		}
		else {
			return null;
		}	
	};
	
	_lc_._getCurSelTabIdx = function(){
		return _lc_.m_items.tablist.getActiveTab();
	};
	
	_lc_._getCurSelTypeIdx = function(){
		var items = _lc_.m_items.tablist.getTabItems(_lc_._getCurSelTabIdx());
		return items.typelist.getCurSel();
	};
	
	_lc_._getCurSelTargetIdx = function(){
		var items = _lc_.m_items.tablist.getTabItems(_lc_._getCurSelTabIdx());
		return items.targetlist.getCurSel();
	};
		
	_lc_._getCurSelCopyFieldTarget = function(typeIdx, targetIdx){
		if (!_lc_.m_typeRess[typeIdx]) return null;
		
		var copyField = _lc_.m_typeRess[typeIdx].targetlist[targetIdx];
		if (!copyField) return null;
		
		copyField.objType = OBJ_TYPE.COPYFIELD;
		return copyField;
	};
	
	_lc_._getCurSelFavoriteTarget = function(targetIdx){
		var favorites = _lc_.m_g.getImgr().getTargetsFavorite();
		return favorites[targetIdx];
	};
	
	_lc_._getCurSelEnemyTarget = function(targetIdx){
		var field = m_enemys[targetIdx];
		if (!field || field.objType != OBJ_TYPE.ROLE) return null;
		return field;
	};
	
	_lc_._setFavoriteListItems = function(){
		var favorites = _lc_.m_g.getImgr().getTargetsFavorite();
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setItemCount(favorites.length);
		for ( var i=0, cnt=items.targetlist.getCount(); i<cnt; ++i ){
			var field = favorites[i];
			var listItem = items.targetlist.getItem(i);
			_lc_._setFavoriteEnemyListItem(listItem, field);
		}
	};
	
	_lc_._onSuccCopyFieldsNet = function(netEvent){
		if ( netEvent.data.succcopyfields ) {
			TQ.dictCopy( _lc_.m_g.getImgr().getSuccCopyFields(), netEvent.data.succcopyfields );
		}
	};
	
	_lc_._onFavoriteUpdate = function(){
		if ( !_lc_.m_this.isShow() ) return;
		
		_lc_._setFavoriteListItems();
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);
	};
	
	_lc_._onEnemyUpdate = function(){
		if ( !_lc_.m_this.isShow() ) return;
		
		_lc_._setEnemyListItems();
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);	
	};
	
	_lc_._setEnemyListItems = function(){
		m_enemys = _collectLastNumberEnemys(_lc_.m_g.getImgr().getEnemys(), 10);
		var items = _lc_.m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setItemCount(m_enemys.length);
		for ( var i=0, cnt=items.targetlist.getCount(); i<cnt; ++i ){
			var field = m_enemys[i];
			var listItem = items.targetlist.getItem(i);
			_lc_._setFavoriteEnemyListItem(listItem, field);
		}
	};
	
	var _collectLastNumberEnemys = function(enemys, number){
		var collects = [];
		if ( enemys.length < number ) {
			return enemys;
		} else {
			var start = enemys.length - number;
			for ( var i=start; i<(start+number); ++i ) {
				collects.push( enemys[i] );
			}
		}
		return collects;
	};
	
	_lc_._setFavoriteEnemyListItem = function(listItem, field) {
		var name = field.roleName != '' ? field.roleName : '--';
		var pos = FieldUtil.getPosByGridId(field.gridId);
		TQ.setText(listItem.exsubs.name, name);
		TQ.setText(listItem.exsubs.fieldType, FieldUtil.getFieldName(field));
		var cood = '#[m:' +  pos.x + ':' + pos.y + ']';
		TQ.setRichText(listItem.exsubs.cood, HyperLinkMgr.formatLink(cood));
		var fightRefState = rstr.selectexpedtarget.lbl.refstate[_lc_.m_g.getImgr().getFightRefState(field.roleId)];
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(_lc_.m_g, pos, res_army_movespeed, 0);
		if (!_isSameCountry(pos)) {
			timeSecond = res_countryfight_needtime;
			fightRefState += rstr.selectexpedtarget.lbl.countryFight;
		}
		TQ.setText(listItem.exsubs.refstate, fightRefState);
		TQ.setText(listItem.exsubs.needtime, TQ.formatTime(0, timeSecond));
	};
	
	var _isSameCountry = function(targetPos){
		var myPos = _lc_.m_g.getImgr().getRoleRes().pos;
		return FieldUtil.getCityResIdByPos(targetPos) == FieldUtil.getCityResIdByPos(myPos);
	};
	
	_lc_._isSuccCopyField = function(fightType, copyFieldId) {
		var succCopyFields = _lc_.m_g.getImgr().getSuccCopyFields();
		return TQ.find(succCopyFields[fightType], null, copyFieldId) != null;
	};
	
	_lc_._initCopyFieldTypeRess = function(){
		_lc_.m_typeRess = [];
		for ( var i=0; i<res_copyfields.length; ++i ) {
			var res = res_copyfields[i];
			if ( res.id >= FIXID.ACT_TOWER_STARTID ) break;
			var typeRes = TQ.find(_lc_.m_typeRess, 'typename', res.typename );
			if ( !typeRes ) {
				_lc_.m_typeRess.push({typename:res.typename, targetlist:[]});
				typeRes = _lc_.m_typeRess[_lc_.m_typeRess.length-1];
			}
			typeRes.targetlist.push(res);
		}
	};
	
	_lc_._setDeleteBtnEnableState = function(){
		if (_lc_._getCurSelTabIdx() != ENEMY_TAB_IDX){
			_lc_.m_items.deleteBtn.enable(false);
			return;
		}
		
		if (_lc_._getCurSelTypeIdx() != ENEMYTYPE_FAVORITE_IDX){
			_lc_.m_items.deleteBtn.enable(false);
			return;		
		}
		
		if (_lc_._getCurSelTargetIdx() < 0){
			_lc_.m_items.deleteBtn.enable(false);
			return;	
		}
		
		_lc_.m_items.deleteBtn.enable(true);
	};
	//SelectExpedTargetDlg-unittest-end
});
