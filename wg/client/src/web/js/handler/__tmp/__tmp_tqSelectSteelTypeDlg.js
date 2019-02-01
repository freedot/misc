/*******************************************************************************/
SelectSteelTypeDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_caller = null;
	_lc_.m_idx = 0;
	_lc_.m_efficiencyType = '';
	var m_steelType = '';
		
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.openDlg = function(idx, efficiencyType, steelType){
		_lc_._initParamsWhenOpen(idx, efficiencyType, steelType);
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	_lc_._initParamsWhenOpen = function(idx, efficiencyType, steelType){
		_lc_.m_idx = idx;
		_lc_.m_efficiencyType = efficiencyType;
		m_steelType = steelType;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:true, title:rstr.selectsteeltypedlg.title, pos:{x:'center', y:80} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.hero.selectsteeltypedlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.effType.setCaller({self:_lc_.m_this, caller:_lc_._onSelectEffectType});
		_lc_.m_items.okBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickOk});
		_lc_.m_items.cancelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancel});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		var needs = {'highsteel':3, 'vip1steel':6, 'vip2steel':12};
		_lc_.m_items.effType.select( (_lc_.m_efficiencyType == 'normal') ? 0 : 1 );
		_lc_.m_items.effType.getRadio(1).setText( TQ.format(rstr.selectsteeltypedlg.lbl.high, needs[m_steelType]) );
	};
	
	_lc_._onSelectEffectType = function(id){
		_lc_.m_efficiencyType = (id == 0) ? 'normal' : 'speed';
	};
	
	_lc_._onClickOk = function(){
		_lc_.m_caller.caller.call(_lc_.m_caller.self, _lc_.m_idx, _lc_.m_efficiencyType);
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickCancel = function(){
		_lc_.m_dlg.hide();
	};
	//SelectSteelTypeDlg-unittest-end
});