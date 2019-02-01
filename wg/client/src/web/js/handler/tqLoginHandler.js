/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
LoginHandler = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	
	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD_SETCLTKEY, m_this, _onSetCltKey);
		m_g.regEvent(EVT.NET, NETCMD_RECONNECTED_OK, m_this, _onReconnectedOk);
		m_g.regEvent(EVT.NET, NETCMD.LOGIN, m_this, _onSvrLogin);
	};
	
	//------------
	//private:method
	//------------
	var _onSetCltKey = function(netevent){
		m_g.getImgr().getRoleRes().userId = netevent.data.userId;
		m_g.getImgr().getRoleRes().cltKey = netevent.data.cltKey;
	};
	
	var _onReconnectedOk = function(netevent){
		UIM.getDlg('waiting').openDlg({tip:rstr_loading.reconnectedok, hideicon:true, timeout:1});
		m_g.setState(GSTATE.INGAME);
	};
	
	var _onSvrLogin = function(netevent){
		var netdata = netevent.data;
		if ( netdata.begin ) {
			m_g.setState(GSTATE.BEGIN);
			m_g.setId(netdata.id);
		} else if ( netdata.result == 0 ) {
			m_g.setKey(netdata.key);
			m_g.setMaxPackLen(netdata.pkgmaxlen);
			m_g.setState(GSTATE.GETDATA);
		} else if ( netdata.result == 1 ) {// 角色不存在，需要创建
			m_g.setKey(netdata.key);
			m_g.setMaxPackLen(netdata.pkgmaxlen);
			m_g.setState(GSTATE.CREATEROLE);
			m_g.sendEvent({eid:EVT.LOGIN_OK, sid:1});
		} else if ( netdata.result == 2 ){// 登录数据拉去完成
			m_g.setState(GSTATE.STARTGAME);
			m_g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		} else {
			alert('login error data!');
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

