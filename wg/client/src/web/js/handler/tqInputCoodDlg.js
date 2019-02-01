//
EmptyFieldTargetSpec = Class.extern(function(){
	this.isSatisfiedBy = function(field){
		if (!field) return false;
		return field.objType == OBJ_TYPE.NONE;
	};
	
	this.getInvalidTip = function(){
		return rstr.selectexpedtarget.err.noEmptyFieldTarget;
	};
});

/** 坐标输入对话框 */
InputCoodDlg = Class.extern(function(){
	//InputCoodDlg-unittest-start
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_caller;
	var m_label = '';
	var m_xRange = {min:0, max:C_OUTFIELD_COL_GRIDS-1};
	var m_yRange = {min:0, max:C_OUTFIELD_ROW_GRIDS-1};
	var m_outRangeTip = '';
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(label, xRange, yRange, outRangeTip){
		_initParams(label, xRange, yRange, outRangeTip);
		_initDlg();
		_showDlg();
		_initInfo();
		_setFocus();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};
	
	this.click = function(){
		_onClickConfirmBtn();
	};
	
	var _initParams = function(label, xRange, yRange, outRangeTip){
		m_label = label;
		m_xRange = xRange;
		m_yRange = yRange;
		m_outRangeTip = outRangeTip;
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		_createDlg();
		_setCallers();
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		TQ.setTextEx(m_items.name, m_label);
	};
	
	var _setFocus = function(){
		m_items.cood_x.focus();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:true,
				pos:{x:"center", y:60},
				uiback:uiback.dlg.npc,
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickConfirmBtn}},
				{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickCancelBtn}}]
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.comm.cooddlg, m_items);
		m_dlg.hide();	
	};
	
	var _setCallers = function(){
		m_items.favoriteBtn.setCaller({self:m_this, caller:_onClickFavorite});
		m_items.cood_x.setLimit(_onGetXLimitNum);
		m_items.cood_y.setLimit(_onGetYLimitNum);
	};
	
	var _onGetXLimitNum = function(){
		return {min:0, max:m_xRange.max};
	};
	
	var _onGetYLimitNum = function(){
		return {min:0, max:m_yRange.max};
	};

	var _onClickConfirmBtn = function(){
		var pos = {x:m_items.cood_x.getVal(), y:m_items.cood_y.getVal()};
		if ( !_isInRange(pos) ) {	
			m_g.getGUI().sysMsgTips(SMT_WARNING, m_outRangeTip);
			return;
		}
		
		if ( m_caller ){
			var x = m_items.cood_x.getVal();
			var y = m_items.cood_y.getVal();
			m_caller.caller.call(m_caller.self, pos.x, pos.y);
		}
		m_dlg.hide();
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _onClickFavorite = function(){
		var dlg = UIM.getDlg('selectexpedtarget');
		dlg.setCaller({self:m_this, caller:_onSelectFavorite});
		dlg.openDlg(EmptyFieldTargetSpec.snew(), {tabIdx:1, typeListIdx:0});
	};
	
	var _onSelectFavorite = function(field){
		var pos = FieldUtil.getPosByGridId(field.gridId);
		m_items.cood_x.setVal(pos.x);
		m_items.cood_y.setVal(pos.y);
	};
	
	var _isInRange = function(pos){
		return (pos.x >= m_xRange.min && pos.x <= m_xRange.max
			&& pos.y >= m_yRange.min && pos.y<= m_yRange.max);
	};
	//InputCoodDlg-unittest-end
});

