/******************************************************************************
******************************************************************************/
SelectExpedTargetDlg = Class.extern(function(){
	//SelectExpedTargetDlg-unittest-start
	var COPYFIELD_TAB_IDX = 0;
	var ENEMY_TAB_IDX = 1;
	var ENEMYTYPE_FAVORITE_IDX = 0;
	var ENEMYTYPE_ENEMY_IDX = 1;
	
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_caller = null;
	var m_typeRess = null;
	var m_targetSpec = null;
	var m_openPageIdxs = null;
	var m_enemys = [];
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		_initCopyFieldTypeRess();
		m_g.regEvent(EVT.FAVORITE_UPDATE, 0, m_this, _onFavoriteUpdate );
		m_g.regEvent(EVT.ENEMY_UPDATE, 0, m_this, _onEnemyUpdate );
		m_g.regEvent(EVT.NET, NETCMD.MILITARY, m_this, _onSuccCopyFieldsNet );
	};

	this.openDlg = function(targetSpec, openPage){
		_setParams(targetSpec, openPage);
		_initDlg();
		_openDlg();
		_initInfo();
		_openPage();
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:m_dlg.getParent(), items:m_items});
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};	
	
	//-- only for test
	this.getCtrl = function(tag){
		return m_items[tag];
	};
	
	//-- only for test
	this.isShow = function(){
		if (!m_dlg)  return false;
		return m_dlg.isShow();
	};
	
	//-- only for test
	this.click = function(){
		_onClickConfirmBtn();
	};
	
	this.setCaller = function(caller) {
		m_caller = caller;
	};
	
	var _setParams = function(targetSpec, openPage){
		m_targetSpec = targetSpec;
		m_openPageIdxs = openPage;
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		m_dlg = Dialog.snew(m_g,{modal:true, title:rstr.selectexpedtarget.title, pos:{x:"center", y:30} });
		m_g.getGUI().initDlg(m_dlg, uicfg.expedition.selecttarget, m_items);
		_setTabsName();
		_setCopyFieldTypeList();
		_setEnemyTypeList();
		_setCallers();
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _setTabsName = function(){
		for ( var i=0; i<rstr.selectexpedtarget.tabs.length; ++i ) {
			m_items.tablist.setTabText(i, rstr.selectexpedtarget.tabs[i]);
		};
	};
	
	var _setCopyFieldTypeList = function(){
		var items = m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.typelist.setItemCount(m_typeRess.length);
		for ( var i=0, cnt=items.typelist.getCount(); i<cnt; ++i ){
			var typeRes = m_typeRess[i];
			var listItem = items.typelist.getItem(i);
			TQ.setText(listItem.exsubs.name, typeRes.typename);
		}
	};
	
	var _setEnemyTypeList = function(){
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.typelist.setItemCount(rstr.selectexpedtarget.lbl.emenytypes.length);
		for ( var i=0, cnt=items.typelist.getCount(); i<cnt; ++i ){
			var typeName = rstr.selectexpedtarget.lbl.emenytypes[i];
			var listItem = items.typelist.getItem(i);
			TQ.setText(listItem.exsubs.name, typeName);
		}
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		_setTabListCaller();
		_setCopyFieldTypeListCaller();
		_setEnemyTypeListCaller();
		_setTargetListCaller();
		_setBtnsCaller();
	};
	
	var _setTabListCaller = function(){
		m_items.tablist.setCaller({self:m_this, caller:_onActiveTab});
	};
	
	var _setCopyFieldTypeListCaller = function(){
		var items = m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.typelist.setCaller({self:m_this, caller:_onSelectCopyFieldList});
	};
	
	var _setEnemyTypeListCaller = function(){
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.typelist.setCaller({self:m_this, caller:_onSelectEnemyTypeList});	
	};
	
	var _setTargetListCaller = function(){
		var items = m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		items.targetlist.setCaller({self:m_this, caller:_onSelectTargetList});	
		items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCaller({self:m_this, caller:_onSelectTargetList});	
	};
	
	var _setBtnsCaller = function(){
		m_items.deleteBtn.setCaller({self:m_this, caller:_onDeleteFavoriteItem});
		m_items.confirmBtn.setCaller({self:m_this, caller:_onClickConfirmBtn});
		m_items.cancelBtn.setCaller({self:m_this, caller:_onClickCancelBtn});
	};

	var _initInfo = function(){
		MilitarySender.sendGetFavorites(m_g);
	};
	
	var _openPage = function(){
		m_items.tablist.activeTab(m_openPageIdxs.tabIdx);
		m_items.tablist.getTabItems(m_openPageIdxs.tabIdx).typelist.setCurSel(m_openPageIdxs.typeListIdx);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('selectexpedtarget');
		}
	};

	
	var _onActiveTab = function(idx){
		var items = m_items.tablist.getTabItems(idx);
		var curSel = items.typelist.getCurSel();
		items.typelist.setCurSel(curSel >= 0 ? curSel : 0);
		_setDeleteBtnEnableState();
	};	
	
	var _onSelectCopyFieldList = function(e, idx){
		var items = m_items.tablist.getTabItems(COPYFIELD_TAB_IDX);
		var targetRes = m_typeRess[idx].targetlist;
		items.targetlist.setItemCount(targetRes.length);
		for ( var i=0; i<targetRes.length; ++i ) {
			var res = targetRes[i];
			var listItem = items.targetlist.getItem(i);
			TQ.setText(listItem.exsubs.name, res.name);
			TQ.setText(listItem.exsubs.level, res.level);
			TQ.setText(listItem.exsubs.taofa, _isSuccCopyField('taofa', res.id) ? rstr.selectexpedtarget.lbl.fightsucc : rstr.selectexpedtarget.lbl.fightnosucc);
			TQ.setText(listItem.exsubs.needtime, TQ.formatTime(0, res.needtime));
		}
		items.targetlist.setCurSel(-1);
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _onSelectEnemyTypeList = function(e, idx){
		if ( idx == ENEMYTYPE_FAVORITE_IDX ) {
			_setFavoriteListItems();
		}
		else if ( idx == ENEMYTYPE_ENEMY_IDX ) {
			_setEnemyListItems();
		}
		else {
			alert('error: 398e84');
		}
		
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);
		_setDeleteBtnEnableState();
	};
	
	var _onSelectTargetList = function(e, idx){
		_setDeleteBtnEnableState();
		HelpGuider.getNewcomerSpirit().onDlgOpen('selectexpedtarget', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _onDeleteFavoriteItem = function(id){
		var field = _getCurSelField();
		if (!field) {
			return;
		}
		
		MilitarySender.sendDelFavoriteTarget(m_g, field.gridId);
	};
	
	var _onClickConfirmBtn = function(){/*
		var target = _getCurSelField();
		if ( !target ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.selectexpedtarget.err.noSelTarget);
			return;
		}
		*/
		if ( !m_targetSpec.isSatisfiedBy(_getCurSelField()) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, m_targetSpec.getInvalidTip());
			return;
		}
		
		if ( m_caller ) {
			m_caller.caller.call(m_caller.self, _getCurSelField());
		}
		
		m_dlg.hide();
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _getCurSelTarget = function(){
		return ExpedUtil.makeExpedTarget(_getCurSelField());
	};
	
	var _getCurSelField = function(){
		var curSelTabIdx = _getCurSelTabIdx();
		var curSelTypeIdx = _getCurSelTypeIdx();
		var curSelTargetIdx = _getCurSelTargetIdx();
		
		if ( curSelTabIdx == COPYFIELD_TAB_IDX ) {
			return _getCurSelCopyFieldTarget(curSelTypeIdx, curSelTargetIdx);
		}
		else if (curSelTabIdx == ENEMY_TAB_IDX 
			&& curSelTypeIdx == ENEMYTYPE_FAVORITE_IDX ) {
			return _getCurSelFavoriteTarget(curSelTargetIdx);
		}
		else if (curSelTabIdx == ENEMY_TAB_IDX 
			&& curSelTypeIdx == ENEMYTYPE_ENEMY_IDX ) {
			return _getCurSelEnemyTarget(curSelTargetIdx);
		}
		else {
			return null;
		}	
	};
	
	var _getCurSelTabIdx = function(){
		return m_items.tablist.getActiveTab();
	};
	
	var _getCurSelTypeIdx = function(){
		var items = m_items.tablist.getTabItems(_getCurSelTabIdx());
		return items.typelist.getCurSel();
	};
	
	var _getCurSelTargetIdx = function(){
		var items = m_items.tablist.getTabItems(_getCurSelTabIdx());
		return items.targetlist.getCurSel();
	};
		
	var _getCurSelCopyFieldTarget = function(typeIdx, targetIdx){
		if (!m_typeRess[typeIdx]) return null;
		
		var copyField = m_typeRess[typeIdx].targetlist[targetIdx];
		if (!copyField) return null;
		
		copyField.objType = OBJ_TYPE.COPYFIELD;
		return copyField;
	};
	
	var _getCurSelFavoriteTarget = function(targetIdx){
		var favorites = m_g.getImgr().getTargetsFavorite();
		return favorites[targetIdx];
	};
	
	var _getCurSelEnemyTarget = function(targetIdx){
		var field = m_enemys[targetIdx];
		if (!field || field.objType != OBJ_TYPE.ROLE) return null;
		return field;
	};
	
	var _setFavoriteListItems = function(){
		var favorites = m_g.getImgr().getTargetsFavorite();
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setItemCount(favorites.length);
		for ( var i=0, cnt=items.targetlist.getCount(); i<cnt; ++i ){
			var field = favorites[i];
			var listItem = items.targetlist.getItem(i);
			_setFavoriteEnemyListItem(listItem, field);
		}
	};
	
	var _onSuccCopyFieldsNet = function(netEvent){
		if ( netEvent.data.succcopyfields ) {
			TQ.dictCopy( m_g.getImgr().getSuccCopyFields(), netEvent.data.succcopyfields );
		}
	};
	
	var _onFavoriteUpdate = function(){
		if ( !m_this.isShow() ) return;
		
		_setFavoriteListItems();
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);
	};
	
	var _onEnemyUpdate = function(){
		if ( !m_this.isShow() ) return;
		
		_setEnemyListItems();
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setCurSel(-1);	
	};
	
	var _setEnemyListItems = function(){
		m_enemys = _collectLastNumberEnemys(m_g.getImgr().getEnemys(), 10);
		var items = m_items.tablist.getTabItems(ENEMY_TAB_IDX);
		items.targetlist.setItemCount(m_enemys.length);
		for ( var i=0, cnt=items.targetlist.getCount(); i<cnt; ++i ){
			var field = m_enemys[i];
			var listItem = items.targetlist.getItem(i);
			_setFavoriteEnemyListItem(listItem, field);
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
	
	var _setFavoriteEnemyListItem = function(listItem, field) {
		var name = field.roleName != '' ? field.roleName : '--';
		var pos = FieldUtil.getPosByGridId(field.gridId);
		TQ.setText(listItem.exsubs.name, name);
		TQ.setText(listItem.exsubs.fieldType, FieldUtil.getFieldName(field));
		var cood = '#[m:' +  pos.x + ':' + pos.y + ']';
		TQ.setRichText(listItem.exsubs.cood, HyperLinkMgr.formatLink(cood));
		var fightRefState = rstr.selectexpedtarget.lbl.refstate[m_g.getImgr().getFightRefState(field.roleId)];
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(m_g, pos, res_army_movespeed, 0);
		if (!_isSameCountry(pos)) {
			timeSecond = res_countryfight_needtime;
			fightRefState += rstr.selectexpedtarget.lbl.countryFight;
		}
		TQ.setText(listItem.exsubs.refstate, fightRefState);
		TQ.setText(listItem.exsubs.needtime, TQ.formatTime(0, timeSecond));
	};
	
	var _isSameCountry = function(targetPos){
		var myPos = m_g.getImgr().getRoleRes().pos;
		return FieldUtil.getCityResIdByPos(targetPos) == FieldUtil.getCityResIdByPos(myPos);
	};
	
	var _isSuccCopyField = function(fightType, copyFieldId) {
		var succCopyFields = m_g.getImgr().getSuccCopyFields();
		return TQ.find(succCopyFields[fightType], null, copyFieldId) != null;
	};
	
	var _initCopyFieldTypeRess = function(){
		m_typeRess = [];
		for ( var i=0; i<res_copyfields.length; ++i ) {
			var res = res_copyfields[i];
			if ( res.id >= FIXID.ACT_TOWER_STARTID ) break;
			var typeRes = TQ.find(m_typeRess, 'typename', res.typename );
			if ( !typeRes ) {
				m_typeRess.push({typename:res.typename, targetlist:[]});
				typeRes = m_typeRess[m_typeRess.length-1];
			}
			typeRes.targetlist.push(res);
		}
	};
	
	var _setDeleteBtnEnableState = function(){
		if (_getCurSelTabIdx() != ENEMY_TAB_IDX){
			m_items.deleteBtn.enable(false);
			return;
		}
		
		if (_getCurSelTypeIdx() != ENEMYTYPE_FAVORITE_IDX){
			m_items.deleteBtn.enable(false);
			return;		
		}
		
		if (_getCurSelTargetIdx() < 0){
			m_items.deleteBtn.enable(false);
			return;	
		}
		
		m_items.deleteBtn.enable(true);
	};
	//SelectExpedTargetDlg-unittest-end
});
