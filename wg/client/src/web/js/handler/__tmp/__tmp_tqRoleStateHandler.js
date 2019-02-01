/*******************************************************************************/
RoleStateHandler = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ROLESTATE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	_lc_._onLoginOk = function(){
		RoleStateSender.getAllStates(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.states ){
			TQ.dictCopy(_lc_.m_g.getImgr().getRoleStates(), cmdpkg.states);
			_lc_.m_g.sendEvent({eid:EVT.ROLESPECSTATE_CHANGE,sid:0});
		}
	};
	//RoleStateHandler-unittest-end
});
