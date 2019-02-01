/******************************************************************************
******************************************************************************/
SelCityTool = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var CMD_ID_NONE = -1;

	_lc_.m_this=null;
	_lc_.m_g=null;
	_lc_.m_items=null;
	
	this.init = function(g, items){
		_lc_.m_this = this;
		_setParams(g, items);
		_lc_._setCaller();
	};

	this.setCurLoadCity = function(cityid){
		var curSelBtnId = CMD_ID_NONE;
		if ( _lc_._isMyCity(cityid) ) {
			curSelBtnId = _lc_.m_items.myCityBtn.getId();
		}
		else if ( _lc_._isOutField(cityid) ) {
			curSelBtnId = _lc_.m_items.outFieldBtn.getId();
		}
		else if ( _lc_._isMyFarm(cityid) ) {
			curSelBtnId = _lc_.m_items.myFarmBtn.getId();
		}
		else if ( _lc_._isMyStateCity(cityid) ) {
			curSelBtnId = _lc_.m_items.myStateCityBtn.getId();
		}
		_lc_._resetBtns(curSelBtnId);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	this.getBtn = function(btnName){
		if (btnName == 'mycity') {
			return _lc_.m_items.myCityBtn;
		} else if (btnName == 'myfarm') {
			return _lc_.m_items.myFarmBtn;
		} else if (btnName == 'statecity') {
			return _lc_.m_items.myStateCityBtn;
		} else if (btnName == 'outfield') {
			return _lc_.m_items.outFieldBtn;
		}
	};
	
	var _setParams = function(g, items){
		_lc_.m_g = g;
		_lc_.m_items = items;
	};	
	
	_lc_._setCaller = function(){
		_lc_.m_items.myCityBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMyCityBtn});
		_lc_.m_items.myFarmBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMyFarmBtn});
		_lc_.m_items.myStateCityBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMyStateCityBtn});
		_lc_.m_items.outFieldBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickOutFieldBtn});
	};
	
	_lc_._isMyCity = function(cityid){
		return (cityid == FIXID.MAINCITY);
	};
	
	_lc_._isOutField = function(cityid){
		return (cityid == FIXID.OUTFIELD);
	};
	
	_lc_._isMyFarm = function(cityid){
		if ( cityid != FIXID.FARMMAP) return false;
		return UIM.getPanel('farm').isMyCurFarm();
	};
	
	_lc_._isMyStateCity = function(cityid) {
		return (_lc_.m_g.getImgr().getStateCity() == cityid); 
	};
	
	_lc_._resetBtns = function(curSelBtnId){
		var btns = [_lc_.m_items.myCityBtn, _lc_.m_items.myFarmBtn, _lc_.m_items.myStateCityBtn, _lc_.m_items.outFieldBtn];
		for ( var i=0; i<btns.length; ++i ) {
			var btn = btns[ i ];
			btn.setPress( btn.getId() == curSelBtnId );
		}
	};
	
	_lc_._onClickMyCityBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('inbuild').open();
	};
	
	_lc_._onClickOutFieldBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('field').open();
		HelpGuider.sendHelpTip(_lc_.m_g, HelpGuider.HELP_TIP.FIGHT_OUTFIELD);
	};
	
	_lc_._onClickMyFarmBtn = function(){
		UIM.closeMapPanels();
		UIM.getPanel('farm').open();
	};
	
	_lc_._onClickMyStateCityBtn = function(){
		MapSender.sendEnterCity(_lc_.m_g, _lc_.m_g.getImgr().getStateCity());
	};
	
	//SelCityTool-unittest-end
});

MainPanel = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_PLISTBTN_W = 24;
	var C_PLISTW = 128;
	
	var C_WORDMAPBTN_W = 20;
	var C_WORDMAPBTN_H = 20;
	var C_PLAYERLIST_VSPACE = 18; 
	var C_PLISTBTN_VSPACE = 40;
	
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_items={};
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
		_lc_.m_g = g;
		_lc_.m_this = this;
		_init();
	};
	
	this.getItems = function(){
		return _lc_.m_items;
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
			//_lc_.m_items.taskGuideToggleBtn.setPress(false);
		} else if ( btntype == 'building' ) {
			_lc_.m_items.trackbuildingbtn.setPress(false);
		}
	};
	
	this.hideGuestBindBtn = function(){
		TQ.setCSS(_lc_.m_items.bindGuestUser.getParent(), 'display', 'none');
	};
	
	//for unit-test
	this.regEvents = function(){
		_lc_.m_g.regEvent(EVT.CITYRES, 0, _lc_.m_this, _evidentSuggestBtnWhenLowBuildVal);
	};
	
	var _init = function(){
		var uibody = TQ.getUiBody();
		_lc_.m_g.getGUI().initPanel(uibody, uicfg.main.mainpanel, _lc_.m_items);
		m_rolepanel = RoleBasePanel.snew(_lc_.m_g, _lc_.m_items.role);
		UIM.regPanel('role', m_rolepanel);
		
		m_sysmsgpanel = new SysMsgPanel(_lc_.m_g, _lc_.m_items);
		UIM.regPanel('sysmsg', m_sysmsgpanel);
		
		if ( TQ.isMobile() ) {
			m_chatpanel = MiniChatPanel.snew(_lc_.m_g, _lc_.m_items.chat);
			UIM.regPanel('chat', m_chatpanel);
		} else {		
			m_chatpanel = new ChatPanel(_lc_.m_g, _lc_.m_items.chat);
			UIM.regPanel('chat', m_chatpanel);
		}
		
		m_smallmappanel = SmallMapPanel.snew(_lc_.m_g, _lc_.m_items.smallmap);
		UIM.regPanel('smallmap', m_smallmappanel);
		
		m_statecitypanel = StateCityPanel.snew(_lc_.m_g, _lc_.m_items.map);
		UIM.regPanel('statecity', m_statecitypanel);
		
		m_inbuildpanel = InBuildPanel.snew(_lc_.m_g, _lc_.m_items.map);
		UIM.regPanel('inbuild', m_inbuildpanel);
		
		m_briefrespanel = BriefResPanel.snew(_lc_.m_g, _lc_.m_items);
		UIM.regPanel('briefres', m_briefrespanel);
		
		m_farmpanel = FarmPresenter.snew(_lc_.m_g, FarmView.snew(_lc_.m_g, _lc_.m_items.map), FarmModel.snew(_lc_.m_g));
		UIM.regPanel('farm', m_farmpanel);
		
		m_fieldpanel = FieldMapView.snew(_lc_.m_g, _lc_.m_items);
		UIM.regPanel('field', m_fieldpanel);
		
		m_taskGuide = TaskGuide.snew(_lc_.m_g, _lc_.m_items);
		//m_onlineTask = OnlineTaskPanel.snew(_lc_.m_g, _lc_.m_items);
		m_onlineGoods = OnlineGoodsPanel.snew(_lc_.m_g, _lc_.m_items);
	
		m_selcitytool = SelCityTool.snew(_lc_.m_g, _lc_.m_items);
		m_toolbar = new MainToolbar(_lc_.m_g, _lc_.m_items);
		m_smallMapBtnBar = SmallMapBtnBar.snew(_lc_.m_g, _lc_.m_items);
		m_queuemsg = new QueueMsgBtn(_lc_.m_g);
		m_subCityBtnsBar = SubCityBtnsBar.snew(_lc_.m_g, _lc_.m_items);
		m_subCityPanels = SubCityPanels.snew(_lc_.m_g, _lc_.m_items.map);
		
		m_stateBuffBar = StateBuffBar.snew(_lc_.m_g, _lc_.m_items.buffBar);
		m_actBar = ActBar.snew(_lc_.m_g, _lc_.m_items.actBar);
		
		_lc_.m_items.vipBtn.setCaller({self:_lc_.m_this, caller:_onClickVipBtn});
		_lc_.m_items.rechargebtn.setCaller({self:_lc_.m_this, caller:_onClickRecharge});
		_lc_.m_items.officialbtn.setCaller({self:_lc_.m_this, caller:_onClickOfficial});
		_lc_.m_items.gonggaobtn.setCaller({self:_lc_.m_this, caller:_onClickGongGao});
		
		if ( !TQ.isMobile() ) {
			_lc_.m_items.togglesyschat.setPress(true);
			_lc_.m_items.togglesyschat.setCaller({self:_lc_.m_this, caller:_onToggleSysChat});
		}
		
		if ( TQ.isMobile() ) {
			TQ.setCSS(_lc_.m_items.smbtn_toggle_bgsound.getParent(), 'display', 'none' );
			TQ.setCSS(_lc_.m_items.smbtn_exchange.getParent(), 'display', 'none' );
			TQ.setCSS(_lc_.m_items.minitoolbar, 'display', 'none' );
		}
		
		m_trackBar = TrackToolbar.snew(_lc_.m_g, _lc_.m_items);
		
		//_lc_.m_items.gameSuggestBtn.show(IS_DEBUG);
		_lc_.m_items.gameSuggestBtn.setCaller({self:_lc_.m_this, caller:_onClickGameSuggest});
		_lc_.m_this.regEvents();
		
		if ( !g_isguest ) {
			_lc_.m_this.hideGuestBindBtn();
		} else {
			_lc_.m_items.bindGuestUser.setCaller({self:_lc_.m_this, caller:_onClickBindGuestUser});
		}
	};
	
	var _onToggleSysChat = function(id) {
		TQ.setCSS(_lc_.m_items.sysmsg, 'display', _lc_.m_items.togglesyschat.isPress() ? 'block' : 'none');
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
		inputdlg.setCaller({self:_lc_.m_this, caller:function(txt){
			LogSender.sendSuggest(_lc_.m_g, txt);
		}});
	};
	
	var _onClickBindGuestUser = function(){
		UIM.getDlg('bindguest').openDlg();
	};
	
	var _sendHelpTip = function(tipId){
		var times = HDRM.getHdr('clientcfg').getHelpTipTimes(tipId);
		if ( times <= 2 ) ClientCfgSender.sendSetHelpTip(_lc_.m_g, tipId);
		HelpGuider.hideTipDlgById(tipId);
	};
	
	var _evidentSuggestBtnWhenLowBuildVal = function(){
		var cityres = _lc_.m_g.getImgr().getCityRes();
		if ( cityres.buildval.cur < 2000 ) {
			if ( TQ.isMobile() ) {
				_lc_.m_items.gameSuggestBtn.resetUIBack(uiback.mb.btn10_suggest_new);
			} else {
				_lc_.m_items.gameSuggestBtn.resetUIBack(uiback.btn.suggest_new);
			}
		} else {
			if ( TQ.isMobile() ) {
				_lc_.m_items.gameSuggestBtn.resetUIBack(uiback.mb.btn10_suggest);
			} else {
				_lc_.m_items.gameSuggestBtn.resetUIBack(uiback.btn.suggest);
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
	var _lc_={};this.lc=function(){return _lc_;};
	var C_BTN_KING_ID = 0;
	var C_BTN_TASK_ID = 1;
	var C_BTN_ALLI_ID = 2;
	var C_BTN_HERO_ID = 3;
	var C_BTN_EXPED_ID = 4;
	var C_BTN_SPLIT_ID = 5;
	var C_BTN_PKG_ID = 6;
	_lc_.C_BTN_LETTER_ID = 7;
	var C_BTN_RANKING_ID = 8;
	var C_BTN_MILITARY_ID = 9;
	var C_BTN_SHOP_ID = 10;

	var C_TASK_INTERVAL = 10000;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	_lc_.m_items;	
	_lc_.m_btns=[];
	var m_buttonNames = {};

	//------------
	//public:method
	//------------
	this.init = function(g, items){
		m_g = g;
		m_this = this;
		_lc_.m_items = items;
		_setCallers();
	};
	
	var _regBtnNames = function() {
		m_buttonNames = {
			'allianceBtn':_lc_.m_items.mbtn_alli
		};
	};
	
	this.show = function(){
	};
	
	this.hide = function(){
	};	
	
	this.startAllianceBlinking = function(interval){
		_lc_.m_items.mbtn_alli.startBlinking(interval);
	};
	
	this.stopAllianceBlinking = function(){
		_lc_.m_items.mbtn_alli.stopBlinking();
	};
	
	this.startTaskBlinking = function(interval){
		_lc_.m_items.mbtn_task.startBlinking(interval);
	};
	
	this.stopTaskBlinking = function(){
		_lc_.m_items.mbtn_task.stopBlinking();
	};
	
	this.getBtn = function(btnName){
		if (btnName == 'role') {
			return _lc_.m_items.mbtn_role;
		} else if (btnName == 'task') {
			return _lc_.m_items.mbtn_task;
		} else if (btnName == 'hero') {
			return _lc_.m_items.mbtn_hero;
		} else if (btnName == 'alli') {
			return _lc_.m_items.mbtn_alli;
		} else if (btnName == 'exped') {
			return _lc_.m_items.mbtn_exped;
		} else if (btnName == 'military') {
			return _lc_.m_items.mbtn_military;
		} else if (btnName == 'pkg') {
			return _lc_.m_items.mbtn_pkg;
		}
	};
	
	var _setCallers = function(){
		_lc_.m_items.mbtn_role.setCaller({self:m_this,caller:_onClickRoleBtn});
		_lc_.m_items.mbtn_task.setCaller({self:m_this,caller:_onClickTaskBtn});
		_lc_.m_items.mbtn_hero.setCaller({self:m_this,caller:_onClickHeroBtn});
		_lc_.m_items.mbtn_alli.setCaller({self:m_this,caller:_onClickAlliBtn});
		_lc_.m_items.mbtn_exped.setCaller({self:m_this,caller:_onClickExpedBtn});
		_lc_.m_items.mbtn_military.setCaller({self:m_this,caller:_onClickMilitaryBtn});
		_lc_.m_items.mbtn_pkg.setCaller({self:m_this,caller:_onClickPkgBtn});
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
	var _lc_={};this.lc=function(){return _lc_;};
	var WORLDBTN_W = 26;
	var WORLDBTN_H = 26;
	_lc_.C_LETTER_INTERVAL = 20000;
	
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_items = null;
	
	this.init = function(g, items){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_items = items;
		_lc_._setCallers();
		_lc_._regEvents();	
	};

	this.getBtnSize = function(){
		return {cx:WORLDBTN_W, cy:WORLDBTN_H};
	};
	
	this.getBtn = function(btnName){
		if ( btnName == 'shop' ) {
			return _lc_.m_items.smbtn_shop;
		} else if ( btnName == 'rank' ) {
			return _lc_.m_items.smbtn_rank;
		} else if ( btnName == 'letter' ) {
			return _lc_.m_items.smbtn_letter;
		} else if ( btnName == 'exchange' ) {
			return _lc_.m_items.smbtn_exchange;
		} else if ( btnName == 'bgsound' ) {
			return _lc_.m_items.smbtn_toggle_bgsound;
		}
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.smbtn_shop.setCaller({self:_lc_.m_this,caller:_lc_._onClickShopBtn});
		_lc_.m_items.smbtn_rank.setCaller({self:_lc_.m_this,caller:_lc_._onClickRankBtn});
		_lc_.m_items.smbtn_letter.setCaller({self:_lc_.m_this,caller:_lc_._onClickLetterBtn});
		_lc_.m_items.smbtn_exchange.setCaller({self:_lc_.m_this,caller:_lc_._onClickExchangeBtn});
		_lc_.m_items.smbtn_toggle_bgsound.setCaller({self:_lc_.m_this,caller:_onToggleBGSound});
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.NEW_MAIL, 0, _lc_.m_this, _lc_._onNewLetter);
	};
	
	_lc_._onClickShopBtn = function(){
		_sendHelpTip('shop');
		_toggleDlg('shop', 0);
	};
	
	_lc_._onClickRankBtn = function(){
		_sendHelpTip('rank');
		_toggleDlg('rank');
	};
	
	_lc_._onClickLetterBtn = function(){
		_sendHelpTip('letter');
		_toggleDlg('letter');
		_lc_.m_items.smbtn_letter.stopBlinking();
	};
	
	_lc_._onClickExchangeBtn = function(){
		if ( !TQ.isMobile() ) _sendHelpTip('exchange');
		_toggleDlg('exchange');
	};
	
	var _onToggleBGSound = function(){
		SoundMgr.toggleBackSound();
	};
	
	_lc_._onNewLetter = function(evt){
		if ( evt.start ){
			_lc_.m_items.smbtn_letter.startBlinking(_lc_.C_LETTER_INTERVAL);
		}
		else if ( evt.stop ){
			_lc_.m_items.smbtn_letter.stopBlinking();
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
		if ( times <= 2 ) ClientCfgSender.sendSetHelpTip(_lc_.m_g, tipId);
		HelpGuider.hideTipDlgById(tipId);
	};
	
	//SmallMapBtnBar-testunit-end
});

QueueMsgBtn = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_MINBTN_RT = [700, 427, 32, 32];
		
	var m_g;
	var m_this;
	_lc_.m_dom;
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
		if ( !_lc_.m_dom ) {
			return;
		}
		
		TQ.setDomPos(_lc_.m_dom, pos.x, pos.y);
	};
	
	this.setSize = function(size) {
	};
	
	// private:method
	var _init = function(){
		var uibody = TQ.getUiBody();
		_lc_.m_dom = TQ.createDom('div');
		TQ.append(uibody, _lc_.m_dom);
		TQ.setCSS(_lc_.m_dom, 'position', 'absolute');
		TQ.setCSS(_lc_.m_dom, 'zIndex', '1000');
		TQ.setDomRect(_lc_.m_dom, C_MINBTN_RT[0], C_MINBTN_RT[1], C_MINBTN_RT[2], C_MINBTN_RT[3]);
		m_msgbtn = new ComButton(m_g, _lc_.m_dom, {uiback:uiback.btn.queuemsg});
		m_msgbtn.setCaller({self:m_this,caller:_onClickBtn});
		m_blinkctrl = BlinkingCtrl.snew(m_g);
		m_blinkctrl.bind(_lc_.m_dom, null);
		_stopBlink();
	};
	
	var _startBlink = function(){
		TQ.setCSS(_lc_.m_dom, 'display', 'block');
		m_blinkctrl.start(-1);
	};
	
	var _stopBlink = function(){
		m_blinkctrl.stop();
		TQ.setCSS(_lc_.m_dom, 'display', 'none');
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_items = null;
	var m_subCityIds = null;
	_lc_.m_btns = null;
	var m_curSubCityId = 0;
	
	this.init = function(g, items){
		_lc_._initParams(this, g, items);
		_lc_._setCallers();
		_lc_._regEvents();
		_lc_._setBtnsTipCaller();
	};
	
	this.setCurSubCityId = function(cityId){
		_lc_._setCurSubCityId(cityId);
		_lc_._setAllBtnsNormalState();
		_lc_._setCurBtnPressState();
	};
	
	this.getCurSubCityId = function(){
		return m_curSubCityId;
	};
	
	this.getEmptySubCity = function(){
		for ( var i=0; i<_lc_.m_btns.length; ++i ) {
			var btn = _lc_.m_btns[i];
			var subCityId = btn.getId();
			if ( !_lc_._hasSubCity(subCityId) && _lc_._hasEnoughCityLevel(subCityId) ) {
				return btn;
			}
		}
		return null;
	};
	
	_lc_._initParams = function(selfThis, g, items){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
		_lc_.m_items = items;
		m_subCityIds = [BUILDCITY_ID.SUB1, BUILDCITY_ID.SUB2, BUILDCITY_ID.SUB3, BUILDCITY_ID.SUB4];
		_lc_.m_btns = [_lc_.m_items.city1btn, _lc_.m_items.city2btn, _lc_.m_items.city3btn, _lc_.m_items.city4btn];
	};
	
	_lc_._setCallers = function(){
		for ( var i=0; i<_lc_.m_btns.length; ++i ) {
			_lc_.m_btns[i].setCaller({self:_lc_.m_this, caller:_lc_._onClickSubCity});
		}
		_lc_.m_items.myfieldsBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSelfField});
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.CITYTYPES, 0, _lc_.m_this, _lc_._onCityTypesUpdate);
		_lc_.m_g.regEvent(EVT.SETCITYLEVEL, 0, _lc_.m_this, _lc_._onSetCityLevel);
	};
	
	_lc_._onCityTypesUpdate = function(){
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		_lc_._setBtnsImage();
	};
	
	_lc_._onSetCityLevel = function(){
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		_lc_._setBtnsImage();
	};
	
	_lc_._setBtnsImage = function(){
		for ( var i=0; i<_lc_.m_btns.length; ++i ) {
			var btn = _lc_.m_btns[i];
			_lc_._setBtnEnableState(btn);
			_lc_._setBtnUIBack(btn);
		}
	};
	
	_lc_._setBtnEnableState = function(btn){
		var subCityId = btn.getId();
		if ( _lc_._hasSubCity(subCityId) || _lc_._hasEnoughCityLevel(subCityId) ) {
			btn.enable(true);
		} else { // empty and not enough city level
			btn.enable(false);
		}
	};
	
	_lc_._setBtnUIBack = function(btn){
		var btnUIBackRes = null;
		
		var subCityId = btn.getId();
		var subCityType = _lc_.m_g.getImgr().getCityTypeByCityId(subCityId);
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
	
	_lc_._setBtnsTipCaller = function(){
		for ( var i=0; i<_lc_.m_btns.length; ++i ) {
			TTIP.setCallerData(_lc_.m_items.tooltips[TIP_PREFIX + 'city' + (i + 1) + 'Btn'], {self:_lc_.m_this, caller:_lc_._onGetToolTip}, {idx:i});
		}
	};
	
	_lc_._onGetToolTip = function(data){
		var subCityId = m_subCityIds[data.idx];
		
		if ( _lc_._hasSubCity(subCityId) ) {
			return rstr.createSubCity.tip.enterCity;
		}
		else if ( _lc_._hasEnoughCityLevel(subCityId) ){
			return rstr.createSubCity.tip.createCity;
		}
		else { // not enough city level
			var needCityLevel = res_create_subcity_needcitylevels[subCityId];
			var needCityLevelName = RStrUtil.getCityNameByLevel(needCityLevel);
			return TQ.format(rstr.createSubCity.tip.needCityLevel, needCityLevelName);
		}
	};
	
	_lc_._onClickSubCity = function(subCityId){
		if ( !_lc_._hasSubCity(subCityId) ) {
			_lc_._onClickEmptySubCityBtn(subCityId);
		}
		else {
			_lc_._onClickExistSubCityBtn(subCityId);
		}
	};
	
	_lc_._onClickSelfField = function(){
		UIM.openDlg('selffieldslist');
		HelpGuider.sendHelpTip(_lc_.m_g, HelpGuider.HELP_TIP.OPEN_MYFIELD);
	};
	
	_lc_._hasSubCity = function(subCityId){
		return _lc_.m_g.getImgr().getCityTypeByCityId(subCityId) != CITY_TYPE.NONE;
	};
	
	_lc_._onClickEmptySubCityBtn = function(subCityId){
		if ( !_lc_._hasEnoughCityLevel(subCityId) ) {
			var needCityLevel = res_create_subcity_needcitylevels[subCityId];
			var needCityLevelName = RStrUtil.getCityNameByLevel(needCityLevel);
			var msg = TQ.format(rstr.createSubCity.needCityLevel, needCityLevelName);
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		UIM.openDlg('createsubcity', subCityId, 'create');
	};
	
	_lc_._hasEnoughCityLevel = function(subCityId){
		var needCityLevel = res_create_subcity_needcitylevels[subCityId];
		return needCityLevel <= _lc_.m_g.getImgr().getCityLevel();
	};
	
	_lc_._onClickExistSubCityBtn = function(subCityId){
		UIM.closeMapPanels();
		_lc_._getSubCityPanel(subCityId).open();
	};
	
	_lc_._getSubCityPanel = function(subCityId){
		return UIM.getPanel('main').getSubCityPanels().getPanel(subCityId);
	};
	
	_lc_._setCurSubCityId = function(subCityId){
		m_curSubCityId = subCityId;
	};
	
	_lc_._setAllBtnsNormalState = function(){
		for ( var i=0; i<_lc_.m_btns.length; ++i ) {
			_lc_.m_btns[i].setPress(false);
		}
	};
	
	_lc_._setCurBtnPressState = function(){
		if ( !TQ.find(m_subCityIds, null, _lc_.m_this.getCurSubCityId()) ) return;
		
		_lc_.m_btns[TQ.getLastFindIdx()].setPress(true);
	};
	//SubCityBtnsBar-testunit-end
});

SubCityPanels = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_mapDom = null;
	_lc_.m_panels = {};
	
	this.init = function(g, mapDom){
		_lc_._initParams(this, g, mapDom);
		_lc_._regEvents();
	};
	
	this.getIterator = function(){
		return DictIterator.snew(_lc_.m_panels);
	};
	
	this.getPanel = function(subCityId){
		return _lc_.m_panels[subCityId];
	};
	
	this.hideAllPanels = function(){
		for ( var k in _lc_.m_panels ) {
			var panel = _lc_.m_panels[k];
			if ( panel == null ) continue;
			
			panel.hide();
			panel.setActive(false);
		}
	};
	
	_lc_._initParams = function(selfThis, g, mapDom){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
		_lc_.m_mapDom = mapDom;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.CITYTYPES, 0, _lc_.m_this, _lc_._onCityTypesUpdate);
	};
	
	_lc_._onCityTypesUpdate = function(){
		var subCityIds = [BUILDCITY_ID.SUB1, BUILDCITY_ID.SUB2, BUILDCITY_ID.SUB3, BUILDCITY_ID.SUB4];
		for ( var i=0; i<subCityIds.length; ++i ) {
			var subCityId = subCityIds[i];
			if ( !_lc_._isNeedCreate(subCityId) ) continue;
			
			_lc_._destroyLastPanel(subCityId);
			_lc_._createPanel(subCityId);
			_lc_._openNewPanel(subCityId);
		}
	};
	
	_lc_._isNeedCreate = function(subCityId){
		var curSubCityType = _lc_.m_g.getImgr().getCityTypeByCityId(subCityId);
		if ( curSubCityType == CITY_TYPE.NONE ) {
			return false;
		}
		
		var curPanel = _lc_.m_this.getPanel(subCityId);
		if ( !curPanel ) { // when last is empty, need create new panel
			return true;
		}
		
		return curPanel.getCityType() != curSubCityType; // when changed, need create new
	};
	
	_lc_._destroyLastPanel = function(subCityId){
		if ( _lc_.m_panels[subCityId] ) {
			_lc_.m_panels[subCityId].destroy();
		}
	};	
	
	_lc_._createPanel = function(subCityId){
		var curSubCityType = _lc_.m_g.getImgr().getCityTypeByCityId(subCityId);
		if ( curSubCityType == CITY_TYPE.SUBRES ) {
			_lc_.m_panels[subCityId] = ResSubBuildPanel.snew(_lc_.m_g, _lc_.m_mapDom, subCityId);
		}
		else if ( curSubCityType == CITY_TYPE.SUBARMY ) {
			_lc_.m_panels[subCityId] = MilitarySubBuildPanel.snew(_lc_.m_g, _lc_.m_mapDom, subCityId);
		}
		else {
			_lc_.m_panels[subCityId] = null;
		}
	};

	_lc_._openNewPanel = function(subCityId){
		var panel = _lc_.m_panels[subCityId];
		if ( !panel ) return;
		
		panel.open();
		panel.resize(_lc_.m_g.getWinSizer().getCurSize());
		panel.resetViewPos();
	};
	//SubCityPanels-testunit-end
});