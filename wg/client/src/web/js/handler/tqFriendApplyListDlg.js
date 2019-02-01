/*******************************************************************************/
FriendApplyListDlg = Class.extern(function(){
	//FriendApplyListDlg-unittest-start
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
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.friend.applylistdlg.title, pos:{x:"center", y:30}});
		m_g.getGUI().initDlg(m_dlg, uicfg.friend.applylistdlg, m_items);
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.NET, NETCMD.FRIEND, m_this, _onSvrPkg);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateAppyList();
	};
	
	var _updateAppyList = function(){
		if (!_isShow()) return;
		
		_setApplyListItems();
		_setApplyListCallers();
	};
	
	var _setApplyListItems = function(){
		var applys = m_g.getImgr().getFriends().applys;
		m_items.list.setItemCount(applys.length);
		for (var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var apply = applys[i];
			TQ.setTextEx(item.exsubs.name, apply.roleName);
			TQ.setTextEx(item.exsubs.level, apply.level);
			TQ.setTextEx(item.exsubs.sex, rstr.comm.sexs[apply.sex]);
			var pos = FieldUtil.getPosByGridId(apply.gridId);
			TQ.setTextEx(item.exsubs.cood,  pos.x + ',' + pos.y);
		}
	};
	
	var _setApplyListCallers = function(){
		for (var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.rejectBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:m_this, caller:_onClickAgreeApply});
			item.exsubs.rejectBtn.setCaller({self:m_this, caller:_onClickRejectApply});
		}
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.applys ){
			var applys = m_g.getImgr().getFriends().applys;
			TQ.dictCopy(applys, cmdpkg.applys);
			_updateAppyList();
		}
	};
	
	var _onClickAgreeApply = function(id){
		var apply = m_g.getImgr().getFriends().applys[id];
		FriendSender.sendAgreeApplyFriend(m_g, apply.roleId);
	};
	
	var _onClickRejectApply = function(id){
		var apply = m_g.getImgr().getFriends().applys[id];
		FriendSender.sendRejectApplyFriend(m_g, apply.roleId);
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};
	//FriendApplyListDlg-unittest-end
});
