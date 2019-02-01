/** 心跳包处理器 */
var HeartbeatHandler = function(){
	//-----------
	//private:const
	//-----------
	var C_UP_INTERVAL_MS = 30000;
	var C_NET_DELAY_MS = 500;
	
	//------------
	//private:date
	//------------
	var m_this;
	var m_g;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g){
		m_this = this;
		m_g = g;
		m_g.regEvent(EVT.NET, NETCMD.HEARTBEAT, m_this, _onSvrPkg);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.LOGIN_OK, 1, m_this, _onLoginOk);
	};
	
	//------------
	//private:method
	//------------
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		m_g.setSvrTimeMs(cmdpkg.svrtime*1000 + C_NET_DELAY_MS);
	};
	
	var _onLoginOk = function(){
		m_g.regUpdater(m_this, _onUpdate, C_UP_INTERVAL_MS);
	};
	
	/** 响应更新
	@param curTimeMs 当前的时间（ms）
	*/
	var _onUpdate = function( curTimeMs ) {
		_sendHeartbeatCmdToSvr();
	};
	
	/** 发送心跳包
	*/
	var _sendHeartbeatCmdToSvr = function() {
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000, 10);
		var sendmsg = '{cmd='+NETCMD.HEARTBEAT+', svrtime='+svrtime+'}';
		m_g.send(null, sendmsg);
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};