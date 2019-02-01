/*******************************************************************************/
SelfFieldsListDlg = Class.extern(function(){
	//SelfFieldsListDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		_regEvents();	
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.SELFFIELD_UPDATE, 0, m_this, _onSelfFieldUpdate);
		m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, m_this, _onSelfFieldUpdate);	
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.field.selffieldslistdlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.field.selffieldslistdlg, m_items);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateFieldList();
	};
	
	var _onSelfFieldUpdate = function(){
		if (!_isShow()) return;
		
		_updateFieldList();
	};
	
	var _updateFieldList = function(){
		_setFieldListItems();
		_setFieldListCallers();
	};
	
	var _setFieldListItems = function(){
		var selfFields = m_g.getImgr().getSelfFields().list;
		m_items.list.setItemCount(selfFields.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ){
			var item = m_items.list.getItem(i);
			var selfField = selfFields[i];
			var field = FieldUtil.makeFieldFromSelfField(selfField);
			var hero = _getDispatchArmyHero(field);
			
			TQ.setTextEx(item.exsubs.fieldName, _getFieldName(field));
			TQ.setTextEx(item.exsubs.heroName, hero.name);
			TQ.setTextEx(item.exsubs.soldierName, RStrUtil.getSoldierNameByResId(hero.soldier.resid));
			TQ.setTextEx(item.exsubs.soldierNum, hero.soldier.number);
			TQ.setTextEx(item.exsubs.collectState, _getCollectStateStr(selfField) );
		}
	};
	
	var _getDispatchArmyHero = function(field){
		var hero = SelfFieldUtil.getCurDispatchHero(field);
		if (!hero) {
			return {name:'--', soldier:{resid:0, number:0}};
		}
		
		return hero;
	};
	
	var _getFieldName = function(field){
		var fieldName = FieldUtil.getFieldName(field);
		var pos = FieldUtil.getPosByGridId(field.gridId);
		return fieldName + '(' + pos.x + ',' + pos.y + ')';
	};
	
	var _getCollectStateStr = function(selfField){
		return selfField.startTime ? rstr.field.selffieldslistdlg.lbl.collecting : rstr.field.selffieldslistdlg.lbl.stopCollect;
	};	
	
	var _setFieldListCallers = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ){
			var item = m_items.list.getItem(i);
			item.exsubs.enterBtn.setId(i);
			item.exsubs.enterBtn.setCaller({self:m_this, caller:_onClickEnter});
		}
	};
	
	var _onClickEnter = function(id){
		var field = FieldUtil.makeFieldFromSelfField(m_g.getImgr().getSelfFieldByIdx(id));
		var dlg = UIM.getDlg('selffield');
		dlg.openDlg(field);
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};
	//SelfFieldsListDlg-unittest-end
});
