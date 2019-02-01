/*******************************************************************************/
CreateSubCityDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_subCityId = 0;
	_lc_.m_createType = '';
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	/** 打开对话狂
	@param subCityId 分城Id
	@param createType 可选择是: 'create' or 'change' */
	this.openDlg = function(subCityId, createType){
		_lc_._initParams(subCityId, createType);
		_lc_._initDlg();
		_lc_._openDlg();
	};
	
	_lc_._initParams = function(subCityId, createType){
		_lc_.m_subCityId = subCityId;
		_lc_.m_createType = createType;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:true, title:rstr.createSubCityDlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.createSubCityDlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.resBtn.setCaller({self:_lc_.m_this, caller:_lc_._onCreateResCity});
		_lc_.m_items.militaryBtn.setCaller({self:_lc_.m_this, caller:_lc_._onCreateMilitaryCity});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._onCreateResCity = function(){
		_lc_._sendCreateSubCity(CITY_TYPE.SUBRES);
		_lc_._closeDlg();
	};
	
	_lc_._onCreateMilitaryCity = function(){
		_lc_._sendCreateSubCity(CITY_TYPE.SUBARMY);
		_lc_._closeDlg();
	};
	
	_lc_._sendCreateSubCity = function(cityType){
		if ( _lc_.m_createType == 'create' ) {
			CityBuildSender.sendCreateSubCity(_lc_.m_g, _lc_.m_subCityId, cityType);
		}
		else if ( _lc_.m_createType == 'change' ) {
			CityBuildSender.sendChangeSubCity(_lc_.m_g, _lc_.m_subCityId, cityType);
		}
	};
	
	_lc_._closeDlg = function(){
		_lc_.m_dlg.hide();
	};
	//CreateSubCityDlg-unittest-end
});
