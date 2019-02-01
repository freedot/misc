/*******************************************************************************/
CreateSubCityDlg = Class.extern(function(){
	//CreateSubCityDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_subCityId = 0;
	var m_createType = '';
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开对话狂
	@param subCityId 分城Id
	@param createType 可选择是: 'create' or 'change' */
	this.openDlg = function(subCityId, createType){
		_initParams(subCityId, createType);
		_initDlg();
		_openDlg();
	};
	
	var _initParams = function(subCityId, createType){
		m_subCityId = subCityId;
		m_createType = createType;
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:true, title:rstr.createSubCityDlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.createSubCityDlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.resBtn.setCaller({self:m_this, caller:_onCreateResCity});
		m_items.militaryBtn.setCaller({self:m_this, caller:_onCreateMilitaryCity});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _onCreateResCity = function(){
		_sendCreateSubCity(CITY_TYPE.SUBRES);
		_closeDlg();
	};
	
	var _onCreateMilitaryCity = function(){
		_sendCreateSubCity(CITY_TYPE.SUBARMY);
		_closeDlg();
	};
	
	var _sendCreateSubCity = function(cityType){
		if ( m_createType == 'create' ) {
			CityBuildSender.sendCreateSubCity(m_g, m_subCityId, cityType);
		}
		else if ( m_createType == 'change' ) {
			CityBuildSender.sendChangeSubCity(m_g, m_subCityId, cityType);
		}
	};
	
	var _closeDlg = function(){
		m_dlg.hide();
	};
	//CreateSubCityDlg-unittest-end
});
