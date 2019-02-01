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
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g;
	var m_this;
	_lc_.m_dlg;
	_lc_.m_items={};
	_lc_.m_caller;
	_lc_.m_label = '';
	_lc_.m_xRange = {min:0, max:C_OUTFIELD_COL_GRIDS-1};
	_lc_.m_yRange = {min:0, max:C_OUTFIELD_ROW_GRIDS-1};
	_lc_.m_outRangeTip = '';
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(label, xRange, yRange, outRangeTip){
		_lc_._initParams(label, xRange, yRange, outRangeTip);
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
		_lc_._setFocus();
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};
	
	this.click = function(){
		_lc_._onClickConfirmBtn();
	};
	
	_lc_._initParams = function(label, xRange, yRange, outRangeTip){
		_lc_.m_label = label;
		_lc_.m_xRange = xRange;
		_lc_.m_yRange = yRange;
		_lc_.m_outRangeTip = outRangeTip;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		TQ.setTextEx(_lc_.m_items.name, _lc_.m_label);
	};
	
	_lc_._setFocus = function(){
		_lc_.m_items.cood_x.focus();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(m_g,{modal:true,
				pos:{x:"center", y:60},
				uiback:uiback.dlg.npc,
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_lc_._onClickConfirmBtn}},
				{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_lc_._onClickCancelBtn}}]
			});
		m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.comm.cooddlg, _lc_.m_items);
		_lc_.m_dlg.hide();	
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.favoriteBtn.setCaller({self:m_this, caller:_lc_._onClickFavorite});
		_lc_.m_items.cood_x.setLimit(_onGetXLimitNum);
		_lc_.m_items.cood_y.setLimit(_onGetYLimitNum);
	};
	
	var _onGetXLimitNum = function(){
		return {min:0, max:_lc_.m_xRange.max};
	};
	
	var _onGetYLimitNum = function(){
		return {min:0, max:_lc_.m_yRange.max};
	};

	_lc_._onClickConfirmBtn = function(){
		var pos = {x:_lc_.m_items.cood_x.getVal(), y:_lc_.m_items.cood_y.getVal()};
		if ( !_lc_._isInRange(pos) ) {	
			m_g.getGUI().sysMsgTips(SMT_WARNING, _lc_.m_outRangeTip);
			return;
		}
		
		if ( _lc_.m_caller ){
			var x = _lc_.m_items.cood_x.getVal();
			var y = _lc_.m_items.cood_y.getVal();
			_lc_.m_caller.caller.call(_lc_.m_caller.self, pos.x, pos.y);
		}
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickCancelBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickFavorite = function(){
		var dlg = UIM.getDlg('selectexpedtarget');
		dlg.setCaller({self:m_this, caller:_lc_._onSelectFavorite});
		dlg.openDlg(EmptyFieldTargetSpec.snew(), {tabIdx:1, typeListIdx:0});
	};
	
	_lc_._onSelectFavorite = function(field){
		var pos = FieldUtil.getPosByGridId(field.gridId);
		_lc_.m_items.cood_x.setVal(pos.x);
		_lc_.m_items.cood_y.setVal(pos.y);
	};
	
	_lc_._isInRange = function(pos){
		return (pos.x >= _lc_.m_xRange.min && pos.x <= _lc_.m_xRange.max
			&& pos.y >= _lc_.m_yRange.min && pos.y<= _lc_.m_yRange.max);
	};
	//InputCoodDlg-unittest-end
});

