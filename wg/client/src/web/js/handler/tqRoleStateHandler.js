/*******************************************************************************/
RoleStateHandler = Class.extern(function(){
	//RoleStateHandler-unittest-start
	var m_g = null;
	var m_this = null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.ROLESTATE, m_this, _onSvrPkg);
	};
	
	var _onLoginOk = function(){
		RoleStateSender.getAllStates(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.states ){
			TQ.dictCopy(m_g.getImgr().getRoleStates(), cmdpkg.states);
			m_g.sendEvent({eid:EVT.ROLESPECSTATE_CHANGE,sid:0});
		}
	};
	//RoleStateHandler-unittest-end
});
