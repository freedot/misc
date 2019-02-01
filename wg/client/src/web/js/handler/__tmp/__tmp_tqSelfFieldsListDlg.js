/*******************************************************************************/
SelfFieldsListDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_._regEvents();	
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.SELFFIELD_UPDATE, 0, _lc_.m_this, _lc_._onSelfFieldUpdate);
		_lc_.m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, _lc_.m_this, _lc_._onSelfFieldUpdate);	
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.field.selffieldslistdlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.field.selffieldslistdlg, _lc_.m_items);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._updateFieldList();
	};
	
	_lc_._onSelfFieldUpdate = function(){
		if (!_lc_._isShow()) return;
		
		_lc_._updateFieldList();
	};
	
	_lc_._updateFieldList = function(){
		_lc_._setFieldListItems();
		_lc_._setFieldListCallers();
	};
	
	_lc_._setFieldListItems = function(){
		var selfFields = _lc_.m_g.getImgr().getSelfFields().list;
		_lc_.m_items.list.setItemCount(selfFields.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ){
			var item = _lc_.m_items.list.getItem(i);
			var selfField = selfFields[i];
			var field = FieldUtil.makeFieldFromSelfField(selfField);
			var hero = _lc_._getDispatchArmyHero(field);
			
			TQ.setTextEx(item.exsubs.fieldName, _lc_._getFieldName(field));
			TQ.setTextEx(item.exsubs.heroName, hero.name);
			TQ.setTextEx(item.exsubs.soldierName, RStrUtil.getSoldierNameByResId(hero.soldier.resid));
			TQ.setTextEx(item.exsubs.soldierNum, hero.soldier.number);
			TQ.setTextEx(item.exsubs.collectState, _lc_._getCollectStateStr(selfField) );
		}
	};
	
	_lc_._getDispatchArmyHero = function(field){
		var hero = SelfFieldUtil.getCurDispatchHero(field);
		if (!hero) {
			return {name:'--', soldier:{resid:0, number:0}};
		}
		
		return hero;
	};
	
	_lc_._getFieldName = function(field){
		var fieldName = FieldUtil.getFieldName(field);
		var pos = FieldUtil.getPosByGridId(field.gridId);
		return fieldName + '(' + pos.x + ',' + pos.y + ')';
	};
	
	_lc_._getCollectStateStr = function(selfField){
		return selfField.startTime ? rstr.field.selffieldslistdlg.lbl.collecting : rstr.field.selffieldslistdlg.lbl.stopCollect;
	};	
	
	_lc_._setFieldListCallers = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ){
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.enterBtn.setId(i);
			item.exsubs.enterBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickEnter});
		}
	};
	
	_lc_._onClickEnter = function(id){
		var field = FieldUtil.makeFieldFromSelfField(_lc_.m_g.getImgr().getSelfFieldByIdx(id));
		var dlg = UIM.getDlg('selffield');
		dlg.openDlg(field);
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};
	//SelfFieldsListDlg-unittest-end
});
