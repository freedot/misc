/******************************************************************************
******************************************************************************/
HandlerMgr = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_handlers = {};
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(){
		m_this = this;
	};
	
	this.initOneTime = function(g){
		m_g = g;
		_init();
	};
	
	this.getHdr = function(key){
		return m_handlers[key];
	};
	
	this.clear = function(){
		m_handlers = {};
	};
	
	this.regHdr = function(key, hdr){
		m_handlers[key] = hdr;
	};
	
	this.regHdrEx = function(g, key, hdrClass){
		if ( !m_handlers[key] ) {
			m_handlers[key] = hdrClass.snew(g);
		}
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(){
		m_handlers['login'] = new LoginHandler(m_g);// 登录
		m_handlers['team'] = new TeamHandler(m_g);//组队
		m_handlers['friend'] = new FriendHandler(m_g);//好友
		m_handlers['sysmsg'] = new SysMsgHandler(m_g);//系统消息
		m_handlers['heartbeat'] = new HeartbeatHandler(m_g);//心跳
		m_handlers['clickrole'] = ClickRoleHdr.snew(m_g);//单击玩家连接的处理
		m_handlers['clickitem'] = ClickItemHdr.snew(m_g);//单击道具连接的处理
		m_handlers['military'] = MilitaryHandler.snew(m_g);//军情处理器
		m_handlers['mail'] = LetterNetCmdHdr.snew(m_g);//NPC对话处理器
		m_handlers['selffields'] = SelfFieldsHdr.snew(m_g);//玩家的野地列表
		m_handlers['rolestate'] = RoleStateHandler.snew(m_g);//玩家特殊状态处理
		m_handlers['dealgold'] = DealByGoldHandler.snew(m_g);//通过金子交易的处理
		m_handlers['clientcfg'] = ClientCfgHandler.snew(m_g);
		m_handlers['svrcfg'] = SvrConfigHandler.snew(m_g);
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

HDRM = new HandlerMgr();