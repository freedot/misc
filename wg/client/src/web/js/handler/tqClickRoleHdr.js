/*******************************************************************************/
ClickRoleHdr = Class.extern(function(){
	//ClickRoleHdr-unittest-start
	var CMD_FIRST = 1;
	var CMD_TALK = 1;
	var CMD_FRIEND = 2;
	var CMD_LETTER = 3;
	var CMD_COPYNAME = 4;
	var CMD_DETAIL = 5;
	var CMD_LAST = 5;
	
	var m_g = null;
	var m_this = null;
	var m_popmenu = null;
	var m_cmdCallers = {};
	var m_roleId = 0;
	var m_roleName = '';
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		_createPopMenu(rstr.clickplayer.menus);
		_setCallers();
		_setCmdCallerMaps();
	};
	
	this.click = function(pos, roleId, roleName){
		_setRole(roleId, roleName);
		m_popmenu.show(pos);
	};
	
	var _createPopMenu = function(names){
		m_popmenu = new Menu(m_g,{width:90});
		for ( var i=CMD_FIRST; i<=CMD_LAST; ++i ){
			if ( !isCanCopyToClipboard() && i == CMD_COPYNAME ) {
				continue;
			}
			
			m_popmenu.addMenuItem( {id:i, icon:null, text:names[i-CMD_FIRST]} );
		}	
	};
	
	var _setCallers = function(){
		m_popmenu.setCaller({self:m_this, caller:_onCommand});
	};
	
	var _setCmdCallerMaps = function(){
		m_cmdCallers[CMD_TALK] = _onChat;
		m_cmdCallers[CMD_FRIEND] = _onApplyFriend;
		m_cmdCallers[CMD_LETTER] = _onWriteLetter;
		m_cmdCallers[CMD_COPYNAME] = _onCopyName;
		m_cmdCallers[CMD_DETAIL] = _onShowDetail;		
	};
	
	var _setRole = function(roleId, roleName){
		m_roleId = roleId;
		m_roleName = roleName;
	};
	
	var _onCommand = function(id){
		m_g.getGUI().hideAllMenu();
		m_cmdCallers[id]();
	};
	
	var _onChat = function(){
		UIM.getPanel('chat').setChatTarget(m_roleName);
	};
	
	var _onApplyFriend = function(){
		FriendSender.sendApplyFriend(m_g, m_roleName);
	};
	
	var _onWriteLetter = function(){
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.clear();
		dlg.setRecv(m_roleName );
		dlg.setFocus('title');
	};
	
	var _onCopyName = function(){
		copyToClipboard(m_roleName);
	};
	
	var _onShowDetail = function(){
		OutFieldSender.sendGetFieldDetailByRole(m_g, m_roleName);
	};
	//ClickRoleHdr-unittest-end
});
