/*******************************************************************************/
SelectIconDlg = Class.extern(function(){
	//SelectIconDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_caller = null;
	var m_iconIds = [];
	var m_curIconId = 0;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.openDlg = function(iconIds, curIconId){
		_setParams(iconIds, curIconId);
		_initDlg();
		_initInfo();
		_showDlg();
	};
	
	var _setParams = function(iconIds, curIconId){
		m_iconIds = iconIds;
		m_curIconId = curIconId;	
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setListCaller();		
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{
				modal : false,
				title : rstr.selectRoleIconDlg.title,
				pos : {x:'center', y:50}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.selectRoleIconDlg, m_items);	
	};
	
	var _initInfo = function(){
		_initListItems();
	};
	
	var _initListItems = function(){
		m_items.list.setItemCount(m_iconIds.length);
		if ( TQ.find(m_iconIds, null, m_curIconId) ) {
			m_items.list.setCurSel(TQ.getLastFindIdx());
		};
		
		for ( var i=0; i<m_iconIds.length; ++i ) {
			var item = m_items.list.getItem(i);
			var itemres = ItemResUtil.findItemres(m_iconIds[i]); 
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(itemres.bigpic));
		}
	};
	
	var _setListCaller = function(){
		m_items.list.setCaller({self:m_this, caller:_onClickListItem});
	};
	
	var _onClickListItem = function(e, idx){
		if ( m_caller ) {
			var iconId = m_iconIds[idx];
			m_caller.caller.call(m_caller.self, iconId);
		}
		m_dlg.hide();
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	//SelectIconDlg-unittest-end
});
