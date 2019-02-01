/*******************************************************************************/
SelectIconDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_caller = null;
	_lc_.m_iconIds = [];
	_lc_.m_curIconId = 0;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.openDlg = function(iconIds, curIconId){
		_lc_._setParams(iconIds, curIconId);
		_lc_._initDlg();
		_lc_._initInfo();
		_lc_._showDlg();
	};
	
	_lc_._setParams = function(iconIds, curIconId){
		_lc_.m_iconIds = iconIds;
		_lc_.m_curIconId = curIconId;	
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setListCaller();		
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{
				modal : false,
				title : rstr.selectRoleIconDlg.title,
				pos : {x:'center', y:50}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.selectRoleIconDlg, _lc_.m_items);	
	};
	
	_lc_._initInfo = function(){
		_lc_._initListItems();
	};
	
	_lc_._initListItems = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_iconIds.length);
		if ( TQ.find(_lc_.m_iconIds, null, _lc_.m_curIconId) ) {
			_lc_.m_items.list.setCurSel(TQ.getLastFindIdx());
		};
		
		for ( var i=0; i<_lc_.m_iconIds.length; ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var itemres = ItemResUtil.findItemres(_lc_.m_iconIds[i]); 
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(itemres.bigpic));
		}
	};
	
	_lc_._setListCaller = function(){
		_lc_.m_items.list.setCaller({self:_lc_.m_this, caller:_lc_._onClickListItem});
	};
	
	_lc_._onClickListItem = function(e, idx){
		if ( _lc_.m_caller ) {
			var iconId = _lc_.m_iconIds[idx];
			_lc_.m_caller.caller.call(_lc_.m_caller.self, iconId);
		}
		_lc_.m_dlg.hide();
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	//SelectIconDlg-unittest-end
});
