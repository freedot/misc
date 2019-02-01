/*******************************************************************************/
SelectSteelTypeDlg = Class.extern(function(){
	//SelectSteelTypeDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_caller = null;
	var m_idx = 0;
	var m_efficiencyType = '';
	var m_steelType = '';
		
	this.init = function(g){
		m_this = this;
		m_g = g;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.openDlg = function(idx, efficiencyType, steelType){
		_initParamsWhenOpen(idx, efficiencyType, steelType);
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	var _initParamsWhenOpen = function(idx, efficiencyType, steelType){
		m_idx = idx;
		m_efficiencyType = efficiencyType;
		m_steelType = steelType;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:true, title:rstr.selectsteeltypedlg.title, pos:{x:'center', y:80} });
		m_g.getGUI().initDlg(m_dlg, uicfg.hero.selectsteeltypedlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.effType.setCaller({self:m_this, caller:_onSelectEffectType});
		m_items.okBtn.setCaller({self:m_this, caller:_onClickOk});
		m_items.cancelBtn.setCaller({self:m_this, caller:_onClickCancel});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		var needs = {'highsteel':3, 'vip1steel':6, 'vip2steel':12};
		m_items.effType.select( (m_efficiencyType == 'normal') ? 0 : 1 );
		m_items.effType.getRadio(1).setText( TQ.format(rstr.selectsteeltypedlg.lbl.high, needs[m_steelType]) );
	};
	
	var _onSelectEffectType = function(id){
		m_efficiencyType = (id == 0) ? 'normal' : 'speed';
	};
	
	var _onClickOk = function(){
		m_caller.caller.call(m_caller.self, m_idx, m_efficiencyType);
		m_dlg.hide();
	};
	
	var _onClickCancel = function(){
		m_dlg.hide();
	};
	//SelectSteelTypeDlg-unittest-end
});