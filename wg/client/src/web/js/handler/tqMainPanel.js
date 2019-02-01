/******************************************************************************
******************************************************************************/
SelCityTool = Class.extern(function(){
	//SelCityTool-unittest-start
	var CMD_ID_NONE = -1;

	var m_this=null;
	var m_g=null;
	var m_items=null;
	
	this.init = function(g, items){
		m_this = this;
		_setParams(g, items);
		_setCaller();
	};

	this.setCurLoadCity = function(cityid){
		var curSelBtnId = CMD_ID_NONE;
		if ( _isMyCity(cityid) ) {
			curSelBtnId = m_items.myCityBtn.getId();
		}
		else if ( _isOutField(cityid) ) {
			curSelBtnId = m_items.outFieldBtn.getId();
		}
		else if ( _isMyFarm(cityid) ) {
			curSelBtnId = m_items.myFarmBtn.getId();
		}
		else if ( _isMyStateCity(cityid) ) {
			curSelBtnId = m_items.myStateCityBtn.getId();
		}
		_resetBtns(curSelBtnId);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	this.getBtn = function(btnName){
		if (btnName == 'mycity') {
			return m_items.myCityBtn;
		} else if (btnName == 'myfarm') {
			return m_items.myFarmBtn;
		} else if (btnName == 'statecity') {
			return m_items.myStateCityBtn;
		} else if (btnName == 'outfield') {
			return m_items.outFieldBtn;
		}
	};
	
	var _setParams = function(g, items){
		m_g = g;
		m_items = items;
	};	
	
	var _setCaller = function(){
		m_items.myCityBtn.setCaller({self:m_this, caller:_onClickMyCityBtn});
		m_items.myFarmBtn.setCaller({self:m_this, caller:_onClickMyFarmBtn});
		m_items.myStateCityBtn.setCaller({self:m_this, caller:_onClickMyStateCityBtn});
		m_items.outFieldBtn.setCaller({self:m_this, caller:_onClickOutFieldBtn});
	};
	
	var _isMyCity = function(cityid){
		return (cityid == FIXID.MAINCITY);
	};
	
	var _isOutField = function(cityid){
		return (cityid == FIXID.OUTFIELD);
	};
	
	var _isMyFarm = function(cityid){
		if ( cityid != FIXID.FARMMAP) return false;
		return UIM.getPanel('farm').isMyCurFarm();
	};
	
	var _isMyStateCity = function(cityid) {
		return (m_g.getImgr().getStateCity() == cityid); 
	};
	
	var _resetBtns = function(curSelBtnId){
		var btns = [m_items.myCityBtn, m_items.myFarmBtn, m_items.myStateCityBtn, m_items.outFieldBtn];
		for ( var i=0; i<btns.length; ++i ) {
			var btn = btns[ i ];
			btn.setPress( btn.getId() == curSelBtnId );
		}
	};
	
	var _onClickMyCityBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('inbuild').open();
	};
	
	var _onClickOutFieldBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('field').open();
		HelpGuider.sendHelpTip(m_g, HelpGuider.HELP_TIP.FIGHT_OUTFIELD);
	};
	
	var _onClickMyFarmBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('farm').open();
	};
	
	var _onClickMyStateCityBtn = function(){
		MapSender.sendEnterCity(m_g, m_g.getImgr().getStateCity());
	};
	
	//SelCityTool-unittest-end
});

MainPanel = function(){
	//MainPanel-testunit-start
	var C_PLISTBTN_W = 24;
	var C_PLISTW = 128;
	
	var C_WORDMAPBTN_W = 20;
	var C_WORDMAPBTN_H = 20;
	var C_PLAYERLIST_VSPACE = 18; 
	var C_PLISTBTN_VSPACE = 40;
	
	var m_g;
	var m_this;
	var m_items={};
	var m_rolepanel;
	var m_sysmsgpanel;
	var m_chatpanel;
	var m_toolbar;
	var m_smallMapBtnBar = null;
	var m_teamgroup;
	var m_queuemsg;
	var m_statecitypanel;
	var m_briefrespanel;
	var m_smallmappanel;
	var m_inbuildpanel;
	var m_farmpanel;
	var m_selcitytool;
	var m_subCityBtnsBar = null;
	var m_subCityPanels = null;
	var m_stateBuffBar = null;
	var m_taskGuide = null;
	var m_onlineTask = null;
	var m_trackBar = null;
	var m_onlineGoods = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
		_init();
	};
	
	this.getItems = function(){
		return m_items;
	};
	
	this.getToolbar = function(){
		return m_toolbar;
	};
	
	this.getSmallMapBtnBar = function(){
		return m_smallMapBtnBar;
	};
	
	this.getQueueMsgBar = function(){
		return m_queuemsg;
	};
	
	this.getSelCityTool = function(){
		return m_selcitytool;
	};
	
	this.getTraceBar = function(){
		return m_trackBar;
	};
	
	this.getSubCityBtnsBar = function(){
		return m_subCityBtnsBar;
	};
	
	this.getSubCityPanels = function(){
		return m_subCityPanels;
	};
	
	this.getStateBuffBar = function(){
		return m_stateBuffBar;
	};
	
	this.getResPanel = function(){
		return m_respanel;
	};
	
	this.getTaskGuide = function(){
		return m_taskGuide;
	};
	
	this.getOnlineTask = function(){
		return m_onlineTask;
	};
	
	this.getOnlineGoods = function(){
		return m_onlineGoods;
	};
	
	this.getTeamGroup = function(){
		return new function(){
			this.openDlg = function() {};
			this.upDlg = function(){};
			this.downDlg = function(){};
		};
		//return m_teamgroup;
	};
	
	this.notifyTraceClose = function(btntype){
		if ( btntype == 'task' ) {
			//m_items.taskGuideToggleBtn.setPress(false);
		} else if ( btntype == 'building' ) {
			m_items.trackbuildingbtn.setPress(false);
		}
	};
	
	this.hideGuestBindBtn = function(){
		TQ.setCSS(m_items.bindGuestUser.getParent(), 'display', 'none');
	};
	
	//for unit-test
	this.regEvents = function(){
		m_g.regEvent(EVT.CITYRES, 0, m_this, _evidentSuggestBtnWhenLowBuildVal);
	};
	
	var _init = function(){
		var uibody = TQ.getUiBody();
		m_g.getGUI().initPanel(uibody, uicfg.main.mainpanel, m_items);
		m_rolepanel = RoleBasePanel.snew(m_g, m_items.role);
		UIM.regPanel('role', m_rolepanel);
		
		m_sysmsgpanel = new SysMsgPanel(m_g, m_items);
		UIM.regPanel('sysmsg', m_sysmsgpanel);
		
		if ( TQ.isMobile() ) {
			m_chatpanel = MiniChatPanel.snew(m_g, m_items.chat);
			UIM.regPanel('chat', m_chatpanel);
		} else {		
			m_chatpanel = new ChatPanel(m_g, m_items.chat);
			UIM.regPanel('chat', m_chatpanel);
		}
		
		m_smallmappanel = SmallMapPanel.snew(m_g, m_items.smallmap);
		UIM.regPanel('smallmap', m_smallmappanel);
		
		m_statecitypanel = StateCityPanel.snew(m_g, m_items.map);
		UIM.regPanel('statecity', m_statecitypanel);
		
		m_inbuildpanel = InBuildPanel.snew(m_g, m_items.map);
		UIM.regPanel('inbuild', m_inbuildpanel);
		
		m_briefrespanel = BriefResPanel.snew(m_g, m_items);
		UIM.regPanel('briefres', m_briefrespanel);
		
		m_farmpanel = FarmPresenter.snew(m_g, FarmView.snew(m_g, m_items.map), FarmModel.snew(m_g));
		UIM.regPanel('farm', m_farmpanel);
		
		m_fieldpanel = FieldMapView.snew(m_g, m_items);
		UIM.regPanel('field', m_fieldpanel);
		
		m_taskGuide = TaskGuide.snew(m_g, m_items);
		//m_onlineTask = OnlineTaskPanel.snew(m_g, m_items);
		m_onlineGoods = OnlineGoodsPanel.snew(m_g, m_items);
	
		m_selcitytool = SelCityTool.snew(m_g, m_items);
		m_toolbar = new MainToolbar(m_g, m_items);
		m_smallMapBtnBar = SmallMapBtnBar.snew(m_g, m_items);
		m_queuemsg = new QueueMsgBtn(m_g);
		m_subCityBtnsBar = SubCityBtnsBar.snew(m_g, m_items);
		m_subCityPanels = SubCityPanels.snew(m_g, m_items.map);
		
		m_stateBuffBar = StateBuffBar.snew(m_g, m_items.buffBar);
		m_actBar = ActBar.snew(m_g, m_items.actBar);
		
		m_items.vipBtn.setCaller({self:m_this, caller:_onClickVipBtn});
		m_items.rechargebtn.setCaller({self:m_this, caller:_onClickRecharge});
		m_items.officialbtn.setCaller({self:m_this, caller:_onClickOfficial});
		m_items.gonggaobtn.setCaller({self:m_this, caller:_onClickGongGao});
		
		if ( !TQ.isMobile() ) {
			m_items.togglesyschat.setPress(true);
			m_items.togglesyschat.setCaller({self:m_this, caller:_onToggleSysChat});
		}
		
		if ( TQ.isMobile() ) {
			TQ.setCSS(m_items.smbtn_toggle_bgsound.getParent(), 'display', 'none' );
			TQ.setCSS(m_items.smbtn_exchange.getParent(), 'display', 'none' );
			TQ.setCSS(m_items.minitoolbar, 'display', 'none' );
		}
		
		m_trackBar = TrackToolbar.snew(m_g, m_items);
		
		//m_items.gameSuggestBtn.show(IS_DEBUG);
		m_items.gameSuggestBtn.setCaller({self:m_this, caller:_onClickGameSuggest});
		m_this.regEvents();
		
		if ( !g_isguest ) {
			m_this.hideGuestBindBtn();
		} else {
			m_items.bindGuestUser.setCaller({self:m_this, caller:_onClickBindGuestUser});
		}
	};
	
	var _onToggleSysChat = function(id) {
		TQ.setCSS(m_items.sysmsg, 'display', m_items.togglesyschat.isPress() ? 'block' : 'none');
		m_sysmsgpanel.refresh();
	};
	
	var _onClickVipBtn = function() {
		UIM.openDlg('vip');
		_sendHelpTip(HelpGuider.HELP_TIP.OPEN_VIPDLG);
	};
	
	var _onClickRecharge = function() {
		JMISC.openPayWnd();
		_sendHelpTip(HelpGuider.HELP_TIP.OPEN_PAYDLG);
	};
	
	var _onClickOfficial = function() {
		JMISC.openOfficialWnd();
	};
	
	var _onClickGongGao = function() {
		UIM.openDlg('gonggao');
	};
	
	var _onClickGameSuggest = function(){
		var inputdlg = UIM.getDlg('inputareatext');
		inputdlg.openDlg(rstr.gameSuggest.title, '', rstr.gameSuggest.desc, 512 );
		inputdlg.setCaller({self:m_this, caller:function(txt){
			LogSender.sendSuggest(m_g, txt);
		}});
	};
	
	var _onClickBindGuestUser = function(){
		UIM.getDlg('bindguest').openDlg();
	};
	
	var _sendHelpTip = function(tipId){
		var times = HDRM.getHdr('clientcfg').getHelpTipTimes(tipId);
		if ( times <= 2 ) ClientCfgSender.sendSetHelpTip(m_g, tipId);
		HelpGuider.hideTipDlgById(tipId);
	};
	
	var _evidentSuggestBtnWhenLowBuildVal = function(){
		var cityres = m_g.getImgr().getCityRes();
		if ( cityres.buildval.cur < 2000 ) {
			if ( TQ.isMobile() ) {
				m_items.gameSuggestBtn.resetUIBack(uiback.mb.btn10_suggest_new);
			} else {
				m_items.gameSuggestBtn.resetUIBack(uiback.btn.suggest_new);
			}
		} else {
			if ( TQ.isMobile() ) {
				m_items.gameSuggestBtn.resetUIBack(uiback.mb.btn10_suggest);
			} else {
				m_items.gameSuggestBtn.resetUIBack(uiback.btn.suggest);
			}
		}
	};
	
	var _resetPlayerListVisible = function() {
	};
	
	this.init.apply(this, arguments);
	//MainPanel-testunit-end
};

TrackToolbar = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.init = function(g, items){
		this.g_ = g;
		this.items_ = items;
		this._setCallers();
	};
	
	this.getBtn = function(name){
		if ( name == 'act' ) {
			return this.items_.trackactbtn;
		} else if ( name == 'autobuild' ) {
			return this.items_.trackautobuildbtn;
		} else if ( name == 'building' ) {
			return this.items_.trackbuildingbtn;
		}
	};
	
	this._setCallers = function(){
		this.items_.trackactbtn.setCaller({self:this, caller:this._onClickTrackAct});
		this.items_.trackbuildingbtn.setCaller({self:this, caller:this._onClickTrackBuilding});
		this.items_.trackautobuildbtn.setCaller({self:this, caller:this._onClickTrackAutoBuild});
	};
	
	this._onClickTrackAct = function(){
		this._toggleDlg('activityval');
	};
	
	this._onClickTrackBuilding = function(){
		if ( this.items_.trackbuildingbtn.isPress() ) {
			UIM.openDlg('buildingtrace');
		} else {
			UIM.getDlg('buildingtrace').closeDlg();
		}
	};
	
	this._onClickTrackAutoBuild = function(){
		this._toggleDlg('autobuild');
	};
	
	this._toggleDlg = function(dlgName){
		var dlg = UIM.getDlg(dlgName);
		if ( dlg.isShow() ) {
			dlg.hideDlg();
		} else {
			UIM.openDlg(dlgName);
		}
	};
});

MainToolbar = function(){
	//MainToolbar-testunit-start
	var C_BTN_KING_ID = 0;
	var C_BTN_TASK_ID = 1;
	var C_BTN_ALLI_ID = 2;
	var C_BTN_HERO_ID = 3;
	var C_BTN_EXPED_ID = 4;
	var C_BTN_SPLIT_ID = 5;
	var C_BTN_PKG_ID = 6;
	var C_BTN_LETTER_ID = 7;
	var C_BTN_RANKING_ID = 8;
	var C_BTN_MILITARY_ID = 9;
	var C_BTN_SHOP_ID = 10;

	var C_TASK_INTERVAL = 10000;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_items;	
	var m_btns=[];
	var m_buttonNames = {};

	//------------
	//public:method
	//------------
	this.init = function(g, items){
		m_g = g;
		m_this = this;
		m_items = items;
		_setCallers();
	};
	
	var _regBtnNames = function() {
		m_buttonNames = {
			'allianceBtn':m_items.mbtn_alli
		};
	};
	
	this.show = function(){
	};
	
	this.hide = function(){
	};	
	
	this.startAllianceBlinking = function(interval){
		m_items.mbtn_alli.startBlinking(interval);
	};
	
	this.stopAllianceBlinking = function(){
		m_items.mbtn_alli.stopBlinking();
	};
	
	this.startTaskBlinking = function(interval){
		m_items.mbtn_task.startBlinking(interval);
	};
	
	this.stopTaskBlinking = function(){
		m_items.mbtn_task.stopBlinking();
	};
	
	this.getBtn = function(btnName){
		if (btnName == 'role') {
			return m_items.mbtn_role;
		} else if (btnName == 'task') {
			return m_items.mbtn_task;
		} else if (btnName == 'hero') {
			return m_items.mbtn_hero;
		} else if (btnName == 'alli') {
			return m_items.mbtn_alli;
		} else if (btnName == 'exped') {
			return m_items.mbtn_exped;
		} else if (btnName == 'military') {
			return m_items.mbtn_military;
		} else if (btnName == 'pkg') {
			return m_items.mbtn_pkg;
		}
	};
	
	var _setCallers = function(){
		m_items.mbtn_role.setCaller({self:m_this,caller:_onClickRoleBtn});
		m_items.mbtn_task.setCaller({self:m_this,caller:_onClickTaskBtn});
		m_items.mbtn_hero.setCaller({self:m_this,caller:_onClickHeroBtn});
		m_items.mbtn_alli.setCaller({self:m_this,caller:_onClickAlliBtn});
		m_items.mbtn_exped.setCaller({self:m_this,caller:_onClickExpedBtn});
		m_items.mbtn_military.setCaller({self:m_this,caller:_onClickMilitaryBtn});
		m_items.mbtn_pkg.setCaller({self:m_this,caller:_onClickPkgBtn});
	};
	
	var _onClickRoleBtn = function(){
		_toggleDlg('role');
	};
	
	var _onClickTaskBtn = function(){
		_toggleDlg('task');
	};
	
	var _onClickHeroBtn = function(){
		_toggleDlg('hero');
	};
	
	var _onClickAlliBtn = function(){
		_toggleDlg('alli');
	};
	
	var _onClickExpedBtn = function(){
		_toggleDlg('expedition');
	};
	
	var _onClickMilitaryBtn = function(){
		_toggleDlg('military');
	};
	
	var _onClickPkgBtn = function(){
		_toggleDlg('package');
	};
	
	var _toggleDlg = function(dlgName){
		var dlg = UIM.getDlg(dlgName);
		if ( dlg.isShow() ) {
			dlg.hideDlg();
		} else {
			UIM.openDlg(dlgName);
		}
	};
	
	this.init.apply(this, arguments);
	//MainToolbar-testunit-end
};

SmallMapBtnBar = Class.extern(function(){
	//SmallMapBtnBar-testunit-start
	var WORLDBTN_W = 26;
	var WORLDBTN_H = 26;
	var C_LETTER_INTERVAL = 20000;
	
	var m_g = null;
	var m_this = null;
	var m_items = null;
	
	this.init = function(g, items){
		m_g = g;
		m_this = this;
		m_items = items;
		_setCallers();
		_regEvents();	
	};

	this.getBtnSize = function(){
		return {cx:WORLDBTN_W, cy:WORLDBTN_H};
	};
	
	this.getBtn = function(btnName){
		if ( btnName == 'shop' ) {
			return m_items.smbtn_shop;
		} else if ( btnName == 'rank' ) {
			return m_items.smbtn_rank;
		} else if ( btnName == 'letter' ) {
			return m_items.smbtn_letter;
		} else if ( btnName == 'exchange' ) {
			return m_items.smbtn_exchange;
		} else if ( btnName == 'bgsound' ) {
			return m_items.smbtn_toggle_bgsound;
		}
	};
	
	var _setCallers = function(){
		m_items.smbtn_shop.setCaller({self:m_this,caller:_onClickShopBtn});
		m_items.smbtn_rank.setCaller({self:m_this,caller:_onClickRankBtn});
		m_items.smbtn_letter.setCaller({self:m_this,caller:_onClickLetterBtn});
		m_items.smbtn_exchange.setCaller({self:m_this,caller:_onClickExchangeBtn});
		m_items.smbtn_toggle_bgsound.setCaller({self:m_this,caller:_onToggleBGSound});
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.NEW_MAIL, 0, m_this, _onNewLetter);
	};
	
	var _onClickShopBtn = function(){
		_sendHelpTip('shop');
		_toggleDlg('shop', 0);
	};
	
	var _onClickRankBtn = function(){
		_sendHelpTip('rank');
		_toggleDlg('rank');
	};
	
	var _onClickLetterBtn = function(){
		_sendHelpTip('letter');
		_toggleDlg('letter');
		m_items.smbtn_letter.stopBlinking();
	};
	
	var _onClickExchangeBtn = function(){
		if ( !TQ.isMobile() ) _sendHelpTip('exchange');
		_toggleDlg('exchange');
	};
	
	var _onToggleBGSound = function(){
		SoundMgr.toggleBackSound();
	};
	
	var _onNewLetter = function(evt){
		if ( evt.start ){
			m_items.smbtn_letter.startBlinking(C_LETTER_INTERVAL);
		}
		else if ( evt.stop ){
			m_items.smbtn_letter.stopBlinking();
		}
	};
	
	var _toggleDlg = function(dlgName, param1){
		var dlg = UIM.getDlg(dlgName);
		if ( dlg.isShow() ) {
			dlg.hideDlg();
		} else {
			if (!isNull(param1)) {
				UIM.openDlg(dlgName, param1);
			} else {
				UIM.openDlg(dlgName);
			}
		}
	};
	
	var _sendHelpTip = function(dlgName){
		var dlg = UIM.getDlg(dlgName);
		if ( dlg.isShow() ) return;
		var tipIds = {
			'shop': HelpGuider.HELP_TIP.OPEN_SHOPDLG
			,'rank': HelpGuider.HELP_TIP.OPEN_RANKDLG
			,'letter': HelpGuider.HELP_TIP.OPEN_LETTERDLG
			,'exchange': HelpGuider.HELP_TIP.OPEN_EXCHANGEDLG
			};
		var tipId = tipIds[dlgName];
		var times = HDRM.getHdr('clientcfg').getHelpTipTimes(tipId);
		if ( times <= 2 ) ClientCfgSender.sendSetHelpTip(m_g, tipId);
		HelpGuider.hideTipDlgById(tipId);
	};
	
	//SmallMapBtnBar-testunit-end
});

QueueMsgBtn = function(){
	//QueueMsgBtn-testunit-start
	var C_MINBTN_RT = [700, 427, 32, 32];
		
	var m_g;
	var m_this;
	var m_dom;
	var m_msgbtn;
	var m_blinkctrl;
	var m_msg=[];

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.TEAM, m_this, _onSvrPkg);
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrAlliPkg);
		_init();
	};
	
	this.setPosition = function(pos) {
		if ( !m_dom ) {
			return;
		}
		
		TQ.setDomPos(m_dom, pos.x, pos.y);
	};
	
	this.setSize = function(size) {
	};
	
	// private:method
	var _init = function(){
		var uibody = TQ.getUiBody();
		m_dom = TQ.createDom('div');
		TQ.append(uibody, m_dom);
		TQ.setCSS(m_dom, 'position', 'absolute');
		TQ.setCSS(m_dom, 'zIndex', '1000');
		TQ.setDomRect(m_dom, C_MINBTN_RT[0], C_MINBTN_RT[1], C_MINBTN_RT[2], C_MINBTN_RT[3]);
		m_msgbtn = new ComButton(m_g, m_dom, {uiback:uiback.btn.queuemsg});
		m_msgbtn.setCaller({self:m_this,caller:_onClickBtn});
		m_blinkctrl = BlinkingCtrl.snew(m_g);
		m_blinkctrl.bind(m_dom, null);
		_stopBlink();
	};
	
	var _startBlink = function(){
		TQ.setCSS(m_dom, 'display', 'block');
		m_blinkctrl.start(-1);
	};
	
	var _stopBlink = function(){
		m_blinkctrl.stop();
		TQ.setCSS(m_dom, 'display', 'none');
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.invite ){
			m_msg.push({cmd:NETCMD.TEAM, invite:cmdpkg.invite});
			_startBlink();
		}
		
		if ( cmdpkg.applyleader ){
			m_msg.push({cmd:NETCMD.TEAM, applyleader:cmdpkg.applyleader});
			_startBlink();
		}
		
		if ( cmdpkg.changeleader ){
			m_msg.push({cmd:NETCMD.TEAM, changeleader:cmdpkg.changeleader});
			_startBlink();
		}
	};
	
	var _onSvrAlliPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.invite ){
			m_msg.push({cmd:NETCMD.ALLIANCE, invite:cmdpkg.invite});
			_startBlink();
		}
	};
	
	var _onClickBtn = function(id){
		if ( m_msg.length > 0 ){
			var msg = m_msg[0];
			TQ.removeElement(m_msg, 0);
			if ( m_msg.length == 0 ){
				_stopBlink();
			}
			
			if ( msg.cmd == NETCMD.TEAM ){
				_onTeam(msg);
			}
			else if (msg.cmd == NETCMD.ALLIANCE){
				_onAlliance(msg);
			}
		}
	};
	
	var _onTeam = function(msg){
		if ( msg.invite ){
			HDRM.getHdr('team').inviteMe(msg.invite);
		}		
		else if ( msg.applyleader ){
			HDRM.getHdr('team').applyLeaderFromMe(msg.applyleader);
		}
		else if ( msg.changeleader ){
			HDRM.getHdr('team').changeLeaderToMe(msg.changeleader);
		}
	};
	
	var _onAlliance = function(msg){
		if ( msg.invite ){
			UIM.getDlg('alliinvite').inviteMe(msg.invite);
		}
	};
	
	this.init.apply(this, arguments);
	//QueueMsgBtn-testunit-end
};

SubCityBtnsBar = Class.extern(function(){
	//SubCityBtnsBar-testunit-start
	var m_g = null;
	var m_this = null;
	var m_items = null;
	var m_subCityIds = null;
	var m_btns = null;
	var m_curSubCityId = 0;
	
	this.init = function(g, items){
		_initParams(this, g, items);
		_setCallers();
		_regEvents();
		_setBtnsTipCaller();
	};
	
	this.setCurSubCityId = function(cityId){
		_setCurSubCityId(cityId);
		_setAllBtnsNormalState();
		_setCurBtnPressState();
	};
	
	this.getCurSubCityId = function(){
		return m_curSubCityId;
	};
	
	this.getEmptySubCity = function(){
		for ( var i=0; i<m_btns.length; ++i ) {
			var btn = m_btns[i];
			var subCityId = btn.getId();
			if ( !_hasSubCity(subCityId) && _hasEnoughCityLevel(subCityId) ) {
				return btn;
			}
		}
		return null;
	};
	
	var _initParams = function(selfThis, g, items){
		m_this = selfThis;
		m_g = g;
		m_items = items;
		m_subCityIds = [BUILDCITY_ID.SUB1, BUILDCITY_ID.SUB2, BUILDCITY_ID.SUB3, BUILDCITY_ID.SUB4];
		m_btns = [m_items.city1btn, m_items.city2btn, m_items.city3btn, m_items.city4btn];
	};
	
	var _setCallers = function(){
		for ( var i=0; i<m_btns.length; ++i ) {
			m_btns[i].setCaller({self:m_this, caller:_onClickSubCity});
		}
		m_items.myfieldsBtn.setCaller({self:m_this, caller:_onClickSelfField});
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.CITYTYPES, 0, m_this, _onCityTypesUpdate);
		m_g.regEvent(EVT.SETCITYLEVEL, 0, m_this, _onSetCityLevel);
	};
	
	var _onCityTypesUpdate = function(){
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		_setBtnsImage();
	};
	
	var _onSetCityLevel = function(){
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		_setBtnsImage();
	};
	
	var _setBtnsImage = function(){
		for ( var i=0; i<m_btns.length; ++i ) {
			var btn = m_btns[i];
			_setBtnEnableState(btn);
			_setBtnUIBack(btn);
		}
	};
	
	var _setBtnEnableState = function(btn){
		var subCityId = btn.getId();
		if ( _hasSubCity(subCityId) || _hasEnoughCityLevel(subCityId) ) {
			btn.enable(true);
		} else { // empty and not enough city level
			btn.enable(false);
		}
	};
	
	var _setBtnUIBack = function(btn){
		var btnUIBackRes = null;
		
		var subCityId = btn.getId();
		var subCityType = m_g.getImgr().getCityTypeByCityId(subCityId);
		if ( subCityType == CITY_TYPE.SUBRES ) {
			btnUIBackRes = uiback.btn.subCityBtns.resBtn;
		}
		else if ( subCityType == CITY_TYPE.SUBARMY ) {
			btnUIBackRes = uiback.btn.subCityBtns.militaryBtn;
		}
		else { // empty
			btnUIBackRes = uiback.btn.subCityBtns.emptyBtn;
		}
		
		btn.resetUIBack( btnUIBackRes );
	};
	
	var _setBtnsTipCaller = function(){
		for ( var i=0; i<m_btns.length; ++i ) {
			TTIP.setCallerData(m_items.tooltips[TIP_PREFIX + 'city' + (i + 1) + 'Btn'], {self:m_this, caller:_onGetToolTip}, {idx:i});
		}
	};
	
	var _onGetToolTip = function(data){
		var subCityId = m_subCityIds[data.idx];
		
		if ( _hasSubCity(subCityId) ) {
			return rstr.createSubCity.tip.enterCity;
		}
		else if ( _hasEnoughCityLevel(subCityId) ){
			return rstr.createSubCity.tip.createCity;
		}
		else { // not enough city level
			var needCityLevel = res_create_subcity_needcitylevels[subCityId];
			var needCityLevelName = RStrUtil.getCityNameByLevel(needCityLevel);
			return TQ.format(rstr.createSubCity.tip.needCityLevel, needCityLevelName);
		}
	};
	
	var _onClickSubCity = function(subCityId){
		if ( !_hasSubCity(subCityId) ) {
			_onClickEmptySubCityBtn(subCityId);
		}
		else {
			_onClickExistSubCityBtn(subCityId);
		}
	};
	
	var _onClickSelfField = function(){
		UIM.openDlg('selffieldslist');
		HelpGuider.sendHelpTip(m_g, HelpGuider.HELP_TIP.OPEN_MYFIELD);
	};
	
	var _hasSubCity = function(subCityId){
		return m_g.getImgr().getCityTypeByCityId(subCityId) != CITY_TYPE.NONE;
	};
	
	var _onClickEmptySubCityBtn = function(subCityId){
		if ( !_hasEnoughCityLevel(subCityId) ) {
			var needCityLevel = res_create_subcity_needcitylevels[subCityId];
			var needCityLevelName = RStrUtil.getCityNameByLevel(needCityLevel);
			var msg = TQ.format(rstr.createSubCity.needCityLevel, needCityLevelName);
			m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		UIM.openDlg('createsubcity', subCityId, 'create');
	};
	
	var _hasEnoughCityLevel = function(subCityId){
		var needCityLevel = res_create_subcity_needcitylevels[subCityId];
		return needCityLevel <= m_g.getImgr().getCityLevel();
	};
	
	var _onClickExistSubCityBtn = function(subCityId){
		UIM.closeMapPanels();
		_getSubCityPanel(subCityId).open();
	};
	
	var _getSubCityPanel = function(subCityId){
		return UIM.getPanel('main').getSubCityPanels().getPanel(subCityId);
	};
	
	var _setCurSubCityId = function(subCityId){
		m_curSubCityId = subCityId;
	};
	
	var _setAllBtnsNormalState = function(){
		for ( var i=0; i<m_btns.length; ++i ) {
			m_btns[i].setPress(false);
		}
	};
	
	var _setCurBtnPressState = function(){
		if ( !TQ.find(m_subCityIds, null, m_this.getCurSubCityId()) ) return;
		
		m_btns[TQ.getLastFindIdx()].setPress(true);
	};
	//SubCityBtnsBar-testunit-end
});

SubCityPanels = Class.extern(function(){
	//SubCityPanels-testunit-start
	var m_g = null;
	var m_this = null;
	var m_mapDom = null;
	var m_panels = {};
	
	this.init = function(g, mapDom){
		_initParams(this, g, mapDom);
		_regEvents();
	};
	
	this.getIterator = function(){
		return DictIterator.snew(m_panels);
	};
	
	this.getPanel = function(subCityId){
		return m_panels[subCityId];
	};
	
	this.hideAllPanels = function(){
		for ( var k in m_panels ) {
			var panel = m_panels[k];
			if ( panel == null ) continue;
			
			panel.hide();
			panel.setActive(false);
		}
	};
	
	var _initParams = function(selfThis, g, mapDom){
		m_this = selfThis;
		m_g = g;
		m_mapDom = mapDom;
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.CITYTYPES, 0, m_this, _onCityTypesUpdate);
	};
	
	var _onCityTypesUpdate = function(){
		var subCityIds = [BUILDCITY_ID.SUB1, BUILDCITY_ID.SUB2, BUILDCITY_ID.SUB3, BUILDCITY_ID.SUB4];
		for ( var i=0; i<subCityIds.length; ++i ) {
			var subCityId = subCityIds[i];
			if ( !_isNeedCreate(subCityId) ) continue;
			
			_destroyLastPanel(subCityId);
			_createPanel(subCityId);
			_openNewPanel(subCityId);
		}
	};
	
	var _isNeedCreate = function(subCityId){
		var curSubCityType = m_g.getImgr().getCityTypeByCityId(subCityId);
		if ( curSubCityType == CITY_TYPE.NONE ) {
			return false;
		}
		
		var curPanel = m_this.getPanel(subCityId);
		if ( !curPanel ) { // when last is empty, need create new panel
			return true;
		}
		
		return curPanel.getCityType() != curSubCityType; // when changed, need create new
	};
	
	var _destroyLastPanel = function(subCityId){
		if ( m_panels[subCityId] ) {
			m_panels[subCityId].destroy();
		}
	};	
	
	var _createPanel = function(subCityId){
		var curSubCityType = m_g.getImgr().getCityTypeByCityId(subCityId);
		if ( curSubCityType == CITY_TYPE.SUBRES ) {
			m_panels[subCityId] = ResSubBuildPanel.snew(m_g, m_mapDom, subCityId);
		}
		else if ( curSubCityType == CITY_TYPE.SUBARMY ) {
			m_panels[subCityId] = MilitarySubBuildPanel.snew(m_g, m_mapDom, subCityId);
		}
		else {
			m_panels[subCityId] = null;
		}
	};

	var _openNewPanel = function(subCityId){
		var panel = m_panels[subCityId];
		if ( !panel ) return;
		
		panel.open();
		panel.resize(m_g.getWinSizer().getCurSize());
		panel.resetViewPos();
	};
	//SubCityPanels-testunit-end
});