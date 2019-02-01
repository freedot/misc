/*******************************************************************************/
ClickRoleHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var CMD_FIRST = 1;
	_lc_.CMD_TALK = 1;
	_lc_.CMD_FRIEND = 2;
	_lc_.CMD_LETTER = 3;
	_lc_.CMD_COPYNAME = 4;
	_lc_.CMD_DETAIL = 5;
	var CMD_LAST = 5;
	
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_popmenu = null;
	_lc_.m_cmdCallers = {};
	_lc_.m_roleId = 0;
	_lc_.m_roleName = '';
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_._createPopMenu(rstr.clickplayer.menus);
		_lc_._setCallers();
		_lc_._setCmdCallerMaps();
	};
	
	this.click = function(pos, roleId, roleName){
		_lc_._setRole(roleId, roleName);
		_lc_.m_popmenu.show(pos);
	};
	
	_lc_._createPopMenu = function(names){
		_lc_.m_popmenu = new Menu(_lc_.m_g,{width:90});
		for ( var i=CMD_FIRST; i<=CMD_LAST; ++i ){
			if ( !isCanCopyToClipboard() && i == _lc_.CMD_COPYNAME ) {
				continue;
			}
			
			_lc_.m_popmenu.addMenuItem( {id:i, icon:null, text:names[i-CMD_FIRST]} );
		}	
	};
	
	_lc_._setCallers = function(){
		_lc_.m_popmenu.setCaller({self:_lc_.m_this, caller:_lc_._onCommand});
	};
	
	_lc_._setCmdCallerMaps = function(){
		_lc_.m_cmdCallers[_lc_.CMD_TALK] = _lc_._onChat;
		_lc_.m_cmdCallers[_lc_.CMD_FRIEND] = _lc_._onApplyFriend;
		_lc_.m_cmdCallers[_lc_.CMD_LETTER] = _lc_._onWriteLetter;
		_lc_.m_cmdCallers[_lc_.CMD_COPYNAME] = _lc_._onCopyName;
		_lc_.m_cmdCallers[_lc_.CMD_DETAIL] = _lc_._onShowDetail;		
	};
	
	_lc_._setRole = function(roleId, roleName){
		_lc_.m_roleId = roleId;
		_lc_.m_roleName = roleName;
	};
	
	_lc_._onCommand = function(id){
		_lc_.m_g.getGUI().hideAllMenu();
		_lc_.m_cmdCallers[id]();
	};
	
	_lc_._onChat = function(){
		UIM.getPanel('chat').setChatTarget(_lc_.m_roleName);
	};
	
	_lc_._onApplyFriend = function(){
		FriendSender.sendApplyFriend(_lc_.m_g, _lc_.m_roleName);
	};
	
	_lc_._onWriteLetter = function(){
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.clear();
		dlg.setRecv(_lc_.m_roleName );
		dlg.setFocus('title');
	};
	
	_lc_._onCopyName = function(){
		copyToClipboard(_lc_.m_roleName);
	};
	
	_lc_._onShowDetail = function(){
		OutFieldSender.sendGetFieldDetailByRole(_lc_.m_g, _lc_.m_roleName);
	};
	//ClickRoleHdr-unittest-end
});
