/*******************************************************************************/
FriendApplyListDlg = Class.extern(function(){
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
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false,	title:rstr.friend.applylistdlg.title, pos:{x:"center", y:30}});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.friend.applylistdlg, _lc_.m_items);
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.NET, NETCMD.FRIEND, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._updateAppyList();
	};
	
	_lc_._updateAppyList = function(){
		if (!_lc_._isShow()) return;
		
		_lc_._setApplyListItems();
		_lc_._setApplyListCallers();
	};
	
	_lc_._setApplyListItems = function(){
		var applys = _lc_.m_g.getImgr().getFriends().applys;
		_lc_.m_items.list.setItemCount(applys.length);
		for (var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var apply = applys[i];
			TQ.setTextEx(item.exsubs.name, apply.roleName);
			TQ.setTextEx(item.exsubs.level, apply.level);
			TQ.setTextEx(item.exsubs.sex, rstr.comm.sexs[apply.sex]);
			var pos = FieldUtil.getPosByGridId(apply.gridId);
			TQ.setTextEx(item.exsubs.cood,  pos.x + ',' + pos.y);
		}
	};
	
	_lc_._setApplyListCallers = function(){
		for (var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.rejectBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAgreeApply});
			item.exsubs.rejectBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickRejectApply});
		}
	};
	
	_lc_._onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.applys ){
			var applys = _lc_.m_g.getImgr().getFriends().applys;
			TQ.dictCopy(applys, cmdpkg.applys);
			_lc_._updateAppyList();
		}
	};
	
	_lc_._onClickAgreeApply = function(id){
		var apply = _lc_.m_g.getImgr().getFriends().applys[id];
		FriendSender.sendAgreeApplyFriend(_lc_.m_g, apply.roleId);
	};
	
	_lc_._onClickRejectApply = function(id){
		var apply = _lc_.m_g.getImgr().getFriends().applys[id];
		FriendSender.sendRejectApplyFriend(_lc_.m_g, apply.roleId);
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};
	//FriendApplyListDlg-unittest-end
});
