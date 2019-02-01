// 游戏状态
GSTATE = {
	ERROR : -1
	,CLOSE : 0
	,CONNECT : 1
	,LOGIN : 2
	,BEGIN : 3
	,CREATEROLE : 4
	,GETDATA : 5
	,STARTGAME : 6
	,INGAME : 7
	,LOSTCONN : 8
	,RECONN : 9
};

SST_NORMAL		= 0;
SST_BAD			= 1;
SST_GOOD		= 2;

NETCMD_GM				= 3;		// GM
NETCMD_RECONN			= 4;		// 断线重连
NETCMD_SETCLTKEY	= 5;		// 设置客户端的key，id，为重连用
NETCMD_RECONNECTED_OK = 6; //重连成功

NETCMD = {
	ERROR					: 50	// 错误
	,LOGIN					: 51	// 登录
	,CREATEROLE				: 52 	// 创建角色
	,ROLEBASE				: 53 	// 角色的基本数值变化
	,RES					: 54 	// 下发资源信息
	//,CITYRES				: 55 	// 城市资源信息
	,HEARTBEAT				: 56 	// 心跳信息
	//,SEL_CITY				: 57 	// 选择城市
	//,GOLDRES				: 58 	// 银两、人口
	,USEITEM				: 59 	// 使用道具
	,CITYRES				: 60	// 城池资源（粮食、木材、石料、生铁）
	,BUILDRES				: 61 	// 建筑资源
	,GENRES					: 62 	// 将领资源
	,SOLDIERRES				: 63 	// 士兵资源
	,DEFRES					: 64 	// 城防资源
	,CHAT					: 65 	// 对话
	,PKG					: 66 	// 包裹
	,SHOP					: 67 	// 商城
	,DEAL					: 68 	// 交易
	,REPORT					: 69 	// 报告
	,LETTER					: 70 	// 信件
	,STORE					: 71 	// 仓库
	,TASK					: 72	// 任务
	,MAP					: 73	// 地图
	,MILITARY				: 74	// 军事方面的
	,FAVORITES				: 75	// 收藏列表
	,FIGHT					: 76	// 战斗指挥（包括城防布局建造）
	,RESPLANE				: 77	// 资源面板
	,HERORES				: 78	// 英雄资源（取代GENRES）
	,SVRCFG					: 79    // server上的配置
	,FRIEND					: 80    // 好友
	,TEAM					: 81    // 队伍
	,SYSMSG				: 82    // 向客户端下发的系统消息
	,ITEM					: 83    // 道具相关的处理
	,FARM					: 84    // 农场相关的处理
	,CULTURE				: 85    // 国学相关的处理
	,STRATEGY				: 86	 // 策略
	,RANKING				: 87	 // 排名
	,ALLIANCE				: 88	 // 联盟
	,MAKE					: 89	 // 制造
	,NPCTALK				: 90	 // NPC对话框
	,MAPPLAYERS			: 91	 // 国家中玩家的列表
	,BATTLE					: 92 // 战场相关
	,MAIL					: 93 // 邮件
	,CITYDEF			: 94 //城防
	,TOWER				: 95 // 哨塔
	,SELFFIELD			: 96 // 自己占领的野地
	,ITEMOP			: 97 // 道具操作
	,OUTFIELD		: 98 // 野地
	,EXCHANGEEXP	: 99 // 兑换武将经验
	,FIGHTREFSTATE	: 100 // 战斗关系
	,ROLESTATE	: 101 // 角色状态
	,OTHERPLAYERINFO	: 102 // 其他玩家的信息
	,TRADING_AREA	: 103 // 商圈
	,ACT_TOWER	: 104 //千层塔活动
	,ACT_TERRACE	: 105 //千层塔活动
	,ACTIVITY_VAL	: 106 //活跃值
	,NEWCOMERHELP : 107 // 新手指引
	//,PROXY_QueryGold : 108 // 代理服务器通知金币余额
	//,PROXY_GetBuyToken : 109 // 代理服务器通知购买物品需要的token
	//,PROXY_DealResult : 110 //  代理服务器通知交易结果
	
	,PAYMENT : 111 // 支付
	,START_BuyByGold : 112 // 通知客户端开始打开购买窗口
	,RESULT_BuyByGold : 113 // 客户端通知服务器购买道具的结果
	
	,EXCHANGE : 200 // 兑换
	,CLT_LOG : 201 // 上报的客户端错误日志
	,FULL_ROLES : 202 //  服务器角色已满
	,YELLOWDIAMOND : 203 //  黄钻
	,CLT_CFG : 204 // 客户端配置
	,VIP : 205 // vip
	,AUTOBUILD : 206 // 自动建造
	,PAYGOLD : 207 // 
	,BLUEDIAMOND : 208 //  蓝钻
	,CDKEY : 209 
	,WORLDBOSS : 210
	,SEND_REWARD : 211
};

EVENT_RET_BREAK = 1;
EVENT_RET_OK = 0;
RET_OK = 0;
RET_CONTINUE = 0;
RET_END = 1;
// 事件的定义
EVT = {
	GEN_DETAIL : 0
	,TACTICAL_CHANGE : 1
	,EXERCISE : 2
	,ARMYDYN : 3
	,ARMYDYNDETAIL : 4
	,RES_CHANGE : 5
	,INBUILD_CHANGE : 6
	,MOUSEDOWN : 7
	,HERO_DETAIL : 8 // 不用了
	,PKG_CHANGE : 9
	,NET : 10
	,LOGIN_OK : 11
	,TASKCHANGE : 12
	,CFGDOWNLOAD : 13
	,LETTERUPDATE : 14
	,SCRIPTLOADED : 15
	,CSSLOADED : 16
	,SHOWHELPBYID : 17
	,NEWHELPTASKNEXT : 18
	,HERO_UPDATE : 19
	,NEW_CHAT : 20
	,TEAMINFO_CHANGE : 21
	,NEWAPPLY_TEAM : 22
	,UPDATER : 23
	,FARMINFO : 24
	,ROLEBASE : 25
	,FRIENDLIST : 26
	,FIGHT_CDLIST : 27
	,FIGHT_ROUND : 28
	,FIGHT_MOVE : 29
	,FIGHT_OPMENU : 30
	,FIGHT_ATTACK : 31
	,FIGHT_RESULT : 32
	,ARMYDYN_SELF : 33
	,ARMYDYN_ENEMY : 34
	,ARMYDYN_ALLI : 35
	,ARMYDYN_SELF_DETAIL : 36
	,ARMYDYN_ENEMY_DETAIL : 37
	,ARMYDYN_ALLI_DETAIL : 38
	,NEW_MILITARY : 39
	,MANUAL_FIGHT : 40
	,NEW_ALLIAPPLY : 41
	,SOLDIERRES : 42
	,SETCITYLEVEL : 43
	,HERO_STRIF_RESULT : 44
	,CITYRES : 45
	,CULTURE_UPDATE : 46
	,BATTLETIMES_UPDATE : 47
	,BDEFAULT_TEAMS_UPDATE : 48
	,FAVORITE_UPDATE : 49
	,PERSONAL_ARMY_UPDATE : 50
	,SALLIANCE_ARMY_UPDATE : 53
	,NEW_MAIL : 54
	,OUTFIELD_DETAIL : 55
	,SELFFIELD_UPDATE : 56
	,CITYTYPES : 57
	,ENEMY_UPDATE : 58
	,ROLESPECSTATE_CHANGE : 59
	,SELFALLIMEM_CHANGE : 60
	,SELFALLI_DETAIL : 61
	,ACTIVITY_VAL : 62
	,PAYACT : 63
	,AUTOBUILD : 64
	,WORLDBOSS : 65
	,SELLING_ITEMS : 66
	,SAVE_FORCES : 67
	,UPD_ACT_VAL_REDDOT : 68
};


// 鼠标事件类型
MT_CHAT = 1;
MT_FIGHT = 2;

// 鼠标形状类型
CUR_NORMAL = 0;
CUR_F_ATTACK = 1;
CUR_F_RESCUE = 2;
CUR_F_SEL_ATTACK = 3;
CUR_F_SEL_RESCUE = 4;
CUR_F_SEL_CANNOT = 5;

/** 网络处理
*/
Network = function(){
	//-----------
	//private:const
	//-----------
	var MAX_SEQ = 0x7ffffffe;
	var UP_INTERVAL_MS = 100;
	
	//-----------
	//private:data
	//-----------
	var m_this;
	var m_g;
	var m_sendqueue={};
	var m_dirtydelay=true;
	var m_seq=0;
	var m_socket=null;
	var m_key = '';
	var m_initKey = 'fheurdh6537aj1HG';
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g, socket){
		m_this = this;
		m_g = g;
		m_socket = socket;
		m_socket.setGameObj(m_g);
		this.initKey();
		m_g.regUpdater(m_this, _onUpdate, UP_INTERVAL_MS);
	};
	
	/** 注册发送消息的最小时间间隔
	@param key 发送消息的类型
	@param interval 发送该类型的最短时间间隔
	*/
	this.regSendLimit = function(key, interval) {
		m_sendqueue[key] = {limit:interval,delay:0,last:0,msg:null};
	};
	
	/** 注册发送消息的延迟时间间隔
	@param key 发送消息的类型
	@param delay 发送该类型的最短时间间隔
	*/
	this.regSendDelay = function(key, delay) {
		if ( m_sendqueue[key] ) {
			m_sendqueue[key].delay = delay;
		}
		else {
			m_sendqueue[key] = {limit:0,delay:delay,last:0,msg:null};
		}
	};
	
	/** 发送消息
	@param key 发送消息的类型，如果为null则不做发送时间间隔类型处理
	@param msg 发送的消息内容
	*/
	this.send = function(key, msg){
		return _send(key, msg);
	};
	
	this.sendRaw = function(msg){
		m_socket.send(msg);
	};
	
	this.setKey = function(k){
		m_socket.setKey(k);
		m_key = k;
	};
	
	this.setMaxPackLen = function(len){
		m_socket.setMaxPackLen(len);
	};
	
	this.connect = function(){
		m_socket.connect();
	};
	
	this.close = function(){
		m_socket.close();
	};
	
	this.initKey = function(){
		m_socket.setKey(m_initKey);
	};
	
	this.resetKey = function(){
		m_socket.setKey(m_key);
	};
		
	//------------
	//private:method
	//------------
	var _onUpdate = function(clttime){
		if ( m_dirtydelay && _handleSendQueue(clttime) ){
			m_dirtydelay = false;
		}
	};
	
	/** 处理发送队列，返回true表示全部处理完毕 */
	var _handleSendQueue = function(clttime){
		var handleAll = true;
		for ( k in m_sendqueue ){
			var node = m_sendqueue[k];
			if ( node.msg && (clttime - node.last) >= node.delay ) {
				m_socket.send(node.msg);
				node.msg = null;
			}
			else if ( node.msg ){
				handleAll = false;
			}
		}
		return handleAll;
	};
	
	/** 分配一个网络序号 */
	var _allocSeq = function(){
		return (++m_seq)%MAX_SEQ;
	};
	
	var _send = function(key, msg){
		var curTime = m_g.getCurTimeMs();
		var seq = _allocSeq();
		msg = _appendInnerSeq(msg, seq);
		if ( msg == '' ){
			alert('send msg is empty!');
		}
		else if ( !key ){
			m_socket.send(msg);
		}
		else if ( !m_sendqueue[key] ){
			m_socket.send(msg);
		}
		else if ( m_sendqueue[key].delay > 0 ){
			m_sendqueue[key].msg = msg;
			m_sendqueue[key].last = curTime;
			m_dirtydelay = true;
		}
		else if ( m_sendqueue[key].last == 0 
			|| (curTime - m_sendqueue[key].last) >= m_sendqueue[key].limit ){
			m_socket.send(msg);
			m_sendqueue[key].last = curTime;
		}
		else{
			//var charhdr = m_g.getCmdHandler(NETCMD.CHAT);
			//charhdr.outputSysMsg('发送该消息过于频繁，请稍后重试！');
			seq = -1;
		}
		return seq;
	};
	
	var _appendInnerSeq = function(msg, seq){
		msg = TQ.trim(msg);
		if ( msg != '' ){
			msg = msg.substr(0, msg.length-1) + ',_s=' + seq + '}';
		}
		return msg;
	};
	
	//--------------
	// private:method
	//--------------
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};


GlobalPub = function(){
	//-----------
	//const
	//-----------
	var C_UPDATE_INTERVAL = 100;
	var C_RECONN_TIMES = 3;
	
	//------------
	//public:method
	//------------
	/** 初始化 
	@param sig 数字签名
	@param socket socket对象
	*/
	this.init = function(sig, socket){
		m_this = this;
		m_sig = sig;
		_init(socket);
	};
	
	/** 设置和server对应的id
	*/
	this.setId = function(id){
		m_id = id;
	};
	
	/** 设置协议密码
	@param k 协议密码
	*/
	this.setKey = function(k){
		m_network.setKey(k);
	};
	
	/** 设置网络包体的最大长度
	@param len 网络包体的最大长度
	*/
	this.setMaxPackLen = function(len){
		m_network.setMaxPackLen(len);
	};
	
	/** 获得数字签名
	*/
	this.getSig = function(){
		return m_sig;
	};
	
	/** 获得物品管理器
	*/
	this.getImgr = function(){
		return m_imgr;
	};
	
	/** 获得用户界面对象
	*/
	this.getGUI = function(){
		return m_gui;
	};
	
	/** 获得游戏当前状态
	*/
	this.getState = function(){
		return m_state;
	};
	
	/** 设置游戏当前状态
	@param state 游戏状态
	*/
	this.setState = function(state){
		_setState(state);
	};
	
	/** 设置服务器的时间
	*/
	this.setSvrTimeMs = function(svrtime) {
		m_diffTimeMs = svrtime - m_curTimeMs;
	};
	
	/** 注册事件处理函数 
	@param eid 事件id
	@param sid 事件子id
	@param self 回调函数fun的属主
	@param fun 回调函数fun
	*/
	this.regEvent = function(eid, sid, self, fun) {
		_regEvent(eid, sid, self, fun);
	};
	
	/** 发送事件，无延迟的 
	@param e 事件对象数据 {eid:xx, sid:xx, ...}
		     e.eid 事件id
		     e.sid 事件子id
	*/
	this.sendEvent = function(e) {
		_sendEvent(e);
	};
	
	/** 发送事件，有延迟的 
	@param e 事件对象数据 {eid:xx, sid:xx, pendtime:xx, ...}
		     e.eid 事件id
		     e.sid 事件子id
		     e.pendtime 延迟处理的时间（MS）
	*/
	this.pendEvent = function(e) {
		m_pendevents.push({lasttime:m_curTimeMs, pendtime:e.pendtime, event:e});
	};
	
	/** 发送事件，有延迟的，如果发送的事件在pend队列中已存在，则替换pend中的事件
	@param e 事件对象数据 {eid:xx, sid:xx, pendtime:xx, ...}
		     e.eid 事件id
		     e.sid 事件子id
		     e.pendtime 延迟处理的时间（MS）
	*/
	this.pendReplaceEvent = function(e) {
		for ( var i=m_pendevents.length-1; i>=0; --i ) {
			var pendEvent = m_pendevents[i];
			if ( pendEvent.event.eid != e.eid || pendEvent.event.sid != e.sid )  continue;
			
			pendEvent.lasttime = m_curTimeMs;
			pendEvent.pendtime = e.pendtime;
			return;
		}
		
		this.pendEvent(e);
	};
	
	/** 注册一个Updater对象
	@param self 回调fun的属主
	@param fun 回调fun
	@param intervalMs 更新时间间隔，单位毫秒
	@param notImmUpdate  为true时，注册后不会马上执行更新操作
	*/
	this.regUpdater = function(self, fun, intervalMs, notImmUpdate) {
		if ( _hasRegUpdater(self, fun) ) return;
		
		var lasttime = notImmUpdate ? m_curTimeMs : 0;
		m_updater.push({self:self, fun:fun, interval:intervalMs, lasttime:lasttime});
	};
	
	/** 取消一个Updater对象的注册
	@param self 回调fun的属主
	@param fun 回调fun
	*/
	this.unregUpdater = function(self, fun) {
		_unregUpdater(self, fun);
	};
	
	/** 获得当前时间 
	*/
	this.getCurTimeMs = function() {
		return m_curTimeMs;
	};
	
	/** 获得当前服务器时间 
	*/
	this.getSvrTimeMs = function() {
		return m_curTimeMs + m_diffTimeMs;
	};
	
	this.getSvrTimeS = function() {
		return parseInt(this.getSvrTimeMs()/1000, 10);
	};
	
	/** 注册发送消息的最小时间间隔
	@param key 发送消息的类型
	@param intervalMs 发送该类型的最短时间间隔 
	*/
	this.regSendLimit = function(key, intervalMs) {
		m_network.regSendLimit(key, intervalMs);
	};
	
	/** 注册发送消息的延迟时间间隔
	@param key 发送消息的类型
	@param delayMs 发送该类型的延迟时间
	*/
	this.regSendDelay = function(key, delayMs) {
		m_network.regSendDelay(key, delayMs);
	};
	
	/** 发送消息
	@param key 发送消息的类型字符串（为null时立即发送）
		        通过regSendLimit/regSendDelay来注册
	@param msg 发送的消息内容
	@return 返回包的序列号
	*/
	this.send = function(key, msg) {
		return m_network.send(key,msg);
	};
	
	/** 连接游戏服务器
	*/
	this.connG = function(){
		_connectGame();
	};
	
	/** 响应窗口大小的变化
	*/
	this.onResize = function(){
		if ( m_windowResizer ) {
			m_windowResizer.resize();
		}
	};
	
	/** 监听连接游戏服务器成功或失败事件
	@param success true表示连接成功
	*/
	this.onConnect = function(success){
		if ( m_state == GSTATE.CONNECT ) {
			_onFirstConnect(success);
		}
		else if ( m_state == GSTATE.LOSTCONN ) {
			_onReConnect(success);
		}
	};
	
	/** 监听收到来自服务器数据的事件
	@param pkg 收到来自server的数据
	*/
	this.onData = function(pkg){
		_onData(pkg);
	};
	
	/** 监听socket被关闭事件
	*/
	this.onClose = function(){
		_onClose();
	};
	
	/** 和server断开连接
	*/
	this.closeG = function(){
		m_network.close();
	};
	
	this.getEntityfactory = function(){
		return m_entityfactory;
	};
	
	this.getActorMgr = function(){
		return m_actormgr;
	};
	
	this.getWinSizer = function(){
		return m_windowResizer;
	};
	
	this.getAnimMgr = function(){
		return m_pngAnimMgr;
	};
	
	//------------
	//private:method
	//------------
	var _init = function(socket){
		log('....1');
		_initEnvironment();
		log('....2');
		_createObjects(socket);
		log('....3');
		_initObjects();
		log('....4');
		_createPopMenu();
		log('....5');
		_startUpdater();
		log('....6');
		_addCursors();
		log('....7');
		_hideGameBody();
		log('....8');
		m_windowResizer.regPanelSizer();
		log('....9');
		TQ.setCSS(TQ.getDomById('g_body'), 'select', 'none' );
		log('....10');
	};
	
	var _initEnvironment = function(){
		document.body.oncontextmenu = _onRightClick;
	};
	
	var _createObjects = function(socket){
		m_windowResizer = WindowResizer.snew(m_this);
		m_network = new Network(m_this, socket);
		m_imgr = new ItemMgrEx(m_this);
		m_gui = new UI(m_this);
		m_entityfactory = new EntityFactory(m_this);
		m_actormgr = ActorManager.snew(m_this);
		m_pngAnimMgr = PngAnimMgr.snew(m_this);
		m_redDot = RedDot.snew(m_this);
		TTIP.create(m_this);// 创建tooltip
	};
	
	var _initObjects = function(){
		log('***....1');
		IMG.setGameObj(m_this);
		log('***....2');
		TIPM.init(m_this);// 初始化TooltipMgr
		log('***....3');
		UIM.initOneTime(m_this);// 初始化uimgr
		log('***....4');
		HDRM.initOneTime(m_this);// 初始化HandlerMgr
		log('***....5');
		JMISC.initOneTime(m_this);// 初始化杂项对象
		log('***....6');
		HyperLinkMgr.initOneTime(m_this);// 初始化超链接处理器
		log('***....7');
		EUPD.initOneTime(m_this);
		log('***....8');
		SelfFieldUtil.initOneTime(m_this);
		log('***....9');
		CityBuildUtil.initOneTime(m_this);
		log('***....10');
		SkillManager.initOneTime(m_this);
		log('***....11');
		SkillPhaseFactory.initOneTime(m_this);
		log('***....12');
		StateFactory.initOneTime(m_this);
		log('***....13');
		EffectManager.initOneTime(m_this);
		log('***....14');
		HeroNameColorGetter.initOneTime(m_this);
		log('***....15');
		HeroNAttrFactorColorGetter.initOneTime(m_this);
		log('***....16');
		FixTimer.initOneTime(m_this);
		log('***....17');
		Payment.initOneTime(m_this);
		log('***....18');
		HelpGuider.initOneTime(m_this);
		log('***....19');
		SoundMgr.initOneTime(m_this);
		log('***....20');
		RStrUtil.initOneTime(m_this);
		log('***....21');
	};
	
	var _createPopMenu = function(){
		m_popmenu = new Menu(m_this,{width:110});
		for ( var i=0; i<rstr.comm.rightmenu.length; ++i ){
			m_popmenu.addMenuItem({id:i, icon:null, text:rstr.comm.rightmenu[i]});
		}
		m_popmenu.setCaller({self:m_this, caller:_onSysCommand});
	};	
	
	var _startUpdater = function(){
		m_timer = window.setInterval(_onUpdate, C_UPDATE_INTERVAL);
	};
	
	var _addCursors = function(){
		m_this.getGUI().addCursor('normal', null, 'default');
	};
	
	var _setState = function(state){
		if ( state == GSTATE.CREATEROLE ) {
			_showGameBody();
			g_loading.setTipText(rstr_loading.loginok);
		}
		else if ( state == GSTATE.GETDATA ) {
			_hideGameBody();
		}
		else if ( state == GSTATE.STARTGAME ){
			_showGameBody();
			g_loading.setTipText(rstr_loading.loginok);
		}
		m_state = state;
	};
	
	var _unregUpdater = function(self, fun){
		for ( var i=0; i<m_updater.length; ++i ){
			if ( m_updater[i].self == self && m_updater[i].fun == fun ){
				TQ.removeElement(m_updater, i);
				break;
			}
		}
	};
	
	var _hasRegUpdater = function(self, fun){
		for ( var i=0; i<m_updater.length; ++i ){
			if ( m_updater[i].self == self && m_updater[i].fun == fun ){
				return true;
			}
		}
		return false;
	};
	
	var _connectGame = function(){
		m_state = GSTATE.CONNECT;
		m_network.connect();
	};
	
	var _reconnectGame = function(){
		m_state = GSTATE.LOSTCONN;
		m_network.connect();
	};
	
	var _onFirstConnect = function(success){
		if ( success ){
			_loginGame();
			g_loading.setPercent(100);
			g_loading.setTipText(rstr_loading.connectok);
		} else if ( m_reconnectedTimes < C_RECONN_TIMES ){
			window.setTimeout(m_this.connG, 2000);
			m_reconnectedTimes++;
		} else {
			g_loading.setTipText(rstr_loading.connectfailed);
			_connectFailed();
		}
	};
	
	var _onReConnect = function(success){
		if ( success ) {
			m_reconnectedTimes = 0;
			_reLoginGame();
			UIM.getDlg('waiting').openDlg({tip:rstr_loading.reconnecting, callback:Caller.snew(this, function(){
				m_gui.noTitleMsgBox(rstr_loading.deconn);
				m_state = GSTATE.CLOSE;
			})});
		} else if ( m_reconnectedTimes < C_RECONN_TIMES ) {
			window.setTimeout(_reconnectGame, m_reconnectedTimes*1000);
			UIM.getDlg('waiting').openDlg({tip:rstr_loading.reconnecting});
			m_reconnectedTimes++;
		} else {
			m_gui.noTitleMsgBox(rstr_loading.deconn);
			m_state = GSTATE.CLOSE;
			_connectFailed();
		}
	};
	
	var _onData = function(pkg){
		var cmdPkg = _safeEval(pkg);
		if ( !cmdPkg ) {
		} else if ( cmdPkg.cmd && cmdPkg.cmd == NETCMD.ERROR ) {
			_handErrorCmd(cmdPkg);
		} else if ( cmdPkg.cmd && cmdPkg.cmd == NETCMD.FULL_ROLES ) {
			_clearTime();
			m_state = GSTATE.CLOSE;
			if ( g_loading.isShow() ) {	
				g_loading.setTipText(rstr_loading.fullroles);
			}
		} else if ( cmdPkg.cmd ){
			_sendEvent({eid:EVT.NET, sid:cmdPkg.cmd, data:cmdPkg});
		} else {
			log('error cmd id!');
		}
	};
	
	var _onClose = function(){
		if ( m_state == GSTATE.INGAME ) {
			window.setTimeout(_reconnectGame, 1000);
			UIM.getDlg('waiting').openDlg({tip:rstr_loading.reconnecting});
		} else {
			_clearTime();
			if ( g_loading.isShow() ) {	
				g_loading.setTipText(rstr_loading.deconn);
			} else { 
				m_gui.noTitleMsgBox(rstr_loading.deconn);
			}
			m_state = GSTATE.CLOSE;
		}
	};
	
	var _onUpdate = function(){
		if ( m_state != GSTATE.CLOSE ) {
			m_curTimeMs = new Date().getTime();
			_updateUpdaterList();
			_handlePendEvents();
		}
	};
	
	var _updateUpdaterList = function(){
		for ( var i=0; i<m_updater.length; ++i) {
			var node = m_updater[i];
			if ( (m_curTimeMs - node.lasttime) >= node.interval ) {
				node.fun.call(node.self, m_curTimeMs);
				node.lasttime = m_curTimeMs;
			}
		}	
	};
		
	var _handlePendEvents = function(){
		for ( var i=0; i<m_pendevents.length; ++i ) {
			var node = m_pendevents[i];
			if ( ( m_curTimeMs - node.lasttime ) >= node.pendtime ) {
				m_this.sendEvent(node.event);
				m_pendevents[i] = null;
				TQ.removeElement(m_pendevents,i);
				--i;
			}
		}
	};	
	
	var _sendEvent = function(e){
		var key = e.eid+'.'+e.sid;
		var enode = m_eventregs[key];
		if ( enode ) {
			try{
				_sendNodeEvent(enode, e);
			} catch(e){
				var errmsg = 'send event error: key['+key+'] '+ErrorGetter.getCommErr(e);
				m_this.getGUI().msgBox('error', errmsg, MB_F_CLOSE, null);
				LogSender.sendLog(m_this, errmsg);
			}
		}
	};
	
	var _sendNodeEvent = function(enode, e){
		for ( var i=0; i<enode.length; ++i ) {
			if ( !enode[i].fun ) {
				for ( var k in enode[i].self ) {
					alert(k);
				}
			}
			if ( enode[i].fun.call(enode[i].self, e) == EVENT_RET_BREAK ) break;
		}
	};
	
	var _regEvent = function(eid, sid, self, fun){
		var key = eid+'.'+sid;
		var enode = m_eventregs[key];
		if ( !enode ) {
			m_eventregs[key] = [];
			enode = m_eventregs[key];
		}
		enode.push({self:self, fun:fun});
	};
	
	var _showGameBody = function(){
		var uibody = TQ.getUiBody();
		TQ.setCSS(uibody, 'visibility', 'visible');
		TQ.setCSS(uibody, 'display', 'block');
	};
	
	var _hideGameBody = function(){
		var uibody = TQ.getUiBody();
		TQ.setCSS(uibody, 'visibility', 'hidden');
		TQ.setCSS(uibody, 'display', 'none');
	};

	var _loginGame = function(){
		m_state = GSTATE.LOGIN;
		m_network.sendRaw(m_sig);
		m_reconnectedTimes = 0;
	};
	
	var _reLoginGame = function(){
		m_network.initKey();
		m_network.send(null, '{cmd=4,userId=' + m_imgr.getRoleRes().userId + ',cltKey="' + m_imgr.getRoleRes().cltKey + '"}');
		m_network.resetKey();
		m_reconnectedTimes = 0;
	};
	
	var _onRightClick = function(e){
		//m_popmenu.show(TQ.mouseCoords(e));
		return true;
	};
	
	var _onSysCommand = function(id){
		m_gui.hideAllMenu();
	};
	
	var _clearTime = function(){
		if ( m_timer ) {
			window.clearInterval(m_timer);
			m_timer = null;
		}
	};

	var _safeEval = function(pkg) {
		var cmdPkg = null;
		var jPkg = LUA.toJSON(pkg);
		try {
			cmdPkg = eval('(' + jPkg + ')');
		}
		catch(err) {
			log('pkg error: ' + err.description+'\nlua: '+pkg+'\njson: '+jPkg);
		}
		return cmdPkg;
	};
	
	var _handErrorCmd = function (cmdPkg) {
		if ( g_loading.isShow() || m_state == GSTATE.LOGIN ) {
			g_loading.setTipText(cmdPkg.msg);
		} else {
			m_gui.msgBox(rstr.comm.msgts, cmdPkg.msg, MB_F_CLOSE, null);
		}
		
		if ( cmdPkg.closeflag ) {
			_clearTime();
			m_state = GSTATE.CLOSE;
		}
	};
	
	var _connectFailed = function() {
		_clearTime();
		m_reconnectedTimes = 0;
		m_state = GSTATE.CLOSE;
	};
	
	//-----------
	//private:data
	//-----------
	var m_this;
	var m_sig; // 登录签名信息
	var m_state=GSTATE.CLOSE;// 游戏状态
	var m_updater=[]; // 存放update对象的数组
	var m_eventregs={}; // 增加事件处理队列
	var m_network=null;// 网络处理对象
	var m_imgr=null; // 道具管理器对象
	var m_gui=null; // 游戏界面对象
	var m_actormgr=null;// actor管理器对象
	var m_reconnectedTimes=0;// 连接server的次数
	var m_curTimeMs=new Date().getTime();// 当前时间ms
	var m_diffTimeMs=0;// 客户端和服务器的时间差
	var m_pendevents=[];// 延迟发送的事件队列
	var m_popmenu=null;//右键弹出菜单
	var m_entityfactory;//实体工厂
	var m_timer;//驱动onUpdater
	var m_id = 0;
	var m_windowResizer=null;
	var m_pngAnimMgr = null;
	var m_redDot = null;
	
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

EffectUpdater = function(){
	//-----------
	//private:const
	//-----------
	var C_INTERVAL = 50;

	//------------
	//public:method
	//------------
	this.init = function(){
		m_this = this;
	};
	
	this.initOneTime = function(g){
		m_g = g;
	};	
	
	this.appendEffect = function(effect, endHdr){
		_appendEffect(effect, endHdr);
	};
	
	this.removeEffect = function(effectid){
		_removeEffect(effectid);
	};
	
	this.getTime = function(){
		return m_effectcurtime;
	};
	
	this.update = function(){
		_onEffectTimer();
	};
	
	//------------
	//private:method
	//------------
	var _onEffectTimer = function(){
		m_effectcurtime += C_INTERVAL;
		for ( var i=m_effectupdaters.length-1; i>=0; --i ){
			var effect = m_effectupdaters[i].effect;
			var endHdr = m_effectupdaters[i].endHdr;
			effect.update(m_effectcurtime);
			if ( effect.isEnd() ){
				TQ.removeElement(m_effectupdaters, i );
				if ( endHdr ) endHdr(effect);
			}
		}
		
		if ( m_effectupdaters.length == 0 && m_effecttimer ){
			window.clearInterval(m_effecttimer);
			m_effecttimer = null;
			m_effectcurtime = 0;
		}
	};
	
	var _allocEffectId = function(){
		m_effectid = (m_effectid == 0x7fffffff) ? 1 : (m_effectid+1);
		return m_effectid;
	};
	
	var _appendEffect = function(effect, endHdr){
		if ( !m_effecttimer ){
			m_effecttimer = window.setInterval(_onEffectTimer, C_INTERVAL);
		}
		_allocEffectId();
		m_effectupdaters.push({id:m_effectid, effect:effect, endHdr:endHdr});
	};
	
	var _removeEffect = function(effectid){
		if ( TQ.find(m_effectupdaters, 'id', effectid) ){
			TQ.removeElement(m_effectupdaters, TQ.getLastFindIdx() );
		}
	};
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_effecttimer=null;
	var m_effectupdaters=[];
	var m_effectid=0;
	var m_effectcurtime=0;	
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

EUPD = new EffectUpdater();