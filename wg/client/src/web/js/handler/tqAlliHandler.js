var AUCTION_STEP = 10;

AlliDlg = ListenerBaseDlg.extern(function(){
	var m_g = null;
    this._init = function(){
		m_g = this.g_;
    };
	
    this.openDlg = function(){
		AlliDlgOpener.snew(m_g).open();
		this._notifyOpenDlg();
    };
	
	this.hideDlg = function(){
		if ( UIM.getDlg('allicreate').isShow() ) {
			UIM.getDlg('allicreate').hideDlg();
		}
		
		if ( UIM.getDlg('allimain').isShow() ) {
			UIM.getDlg('allimain').hideDlg();
		}
	};
	
	this.isShow = function(){
		return UIM.getDlg('allicreate').isShow() || UIM.getDlg('allimain').isShow();
	};
	
	this.openSubscribeDlg = function(){
		AlliSubscribeDlgOpener.snew(m_g).open();
	};
	
	this.openGiftDlg = function(){
		AlliGiftDlgOpener.snew(m_g).open();
	};
});

AlliDlgBaseOpener = Class.extern(function(){
	this.g_ = null;
    this.init = function(g){
		this.g_ = g;
    };
	
	this.open = function(){
		var build = this.g_.getImgr().getBuildByResid(BUILDCITY_ID.ALL, FIXID.ALLIINBUILD);
		if ( !build || build.level == 0  ){
			this._openWhenNoBuild();
		} else if ( !this.g_.getImgr().isInAlliance() ){
			this._openWhenNoAlli();
		} else{
			this._open();
		}
	};
	
	this._openWhenNoBuild = function(){
		this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.nobuild);
	};
	
	this._openWhenNoAlli = function(){
		this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.noInAlliance);
	};	
	
	this._open = function(){};
});

AlliDlgOpener = AlliDlgBaseOpener.extern(function(){
	this._openWhenNoAlli = function(){
		UIM.getDlg('allicreate').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
	
	this._open = function(){
		UIM.getDlg('allimain').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
});

AlliSubscribeDlgOpener = AlliDlgBaseOpener.extern(function(){
	this._open = function(){
		UIM.getDlg('allisubscribe').openDlg();
	};
});

AlliGiftDlgOpener = AlliDlgBaseOpener.extern(function(){
	this._open = function(){
		UIM.getDlg('allimain').openDlg(1);
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
});

AlliCreateDlg = ListenerBaseDlg.extern(function(){
	//AlliCreateDlg-unittest-start
	var C_BTN_DELAY_MS = 1500;
	var C_APPLY_TAB_IDX = 0;
	var C_CREATE_TAB_IDX = 1;
	
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_invitelist = [];

	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
		this._notifyOpenDlg();
	};
	
	this.sendApplyToSvr = function(name){
		AllianceSender.sendApplyJoin(m_g, name);
		m_g.getGUI().sysMsgTips(SMT_NORMAL, TQ.format(rstr.alli.detaildlg.sendapply, name));
	};
	
	this.isShow = function(){
		return _isShow();
	};
	
	this.hideDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setCallers();
		_initInputs();
		_setBtnsDelayType();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.createdlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.createdlg, m_items);
	};
	
	var _setCallers = function(){
		_getCtrl('listbtn').setCaller({self:m_this, caller:_onClickAlliListBtn});
		_getCtrl('applybtn').setCaller({self:m_this, caller:_onClickApplyBtn});
		_getCtrl('createbtn').setCaller({self:m_this, caller:_onClickCreateBtn});
		_getCtrl('randbtn').setCaller({self:m_this, caller:_onClickRandBtn});
	};
	
	var _initInputs = function(){
		InputLimit.maxGBKBytes(_getCtrl('ialliname'), JVALID.getMaxAlliLen());
		InputLimit.maxGBKBytes(_getCtrl('icreatename'), JVALID.getMaxAlliLen());
		TQ.maxLength(_getCtrl('iflagname'), JVALID.getMaxAlliFlagLen());
	};
	
	var _setBtnsDelayType = function(){
		_getCtrl('applybtn').setType(BTN_TYPE.DELAY);
		_getCtrl('applybtn').setDelay(C_BTN_DELAY_MS);
		_getCtrl('createbtn').setType(BTN_TYPE.DELAY);
		_getCtrl('createbtn').setDelay(C_BTN_DELAY_MS);
	};
	
	var _showDlg = function() {
		m_dlg.show();
	};
	
	var _initInfo = function(){
		TQ.setTextEx(_getCtrl('alliname'), '');
		TQ.setTextEx(_getCtrl('needmoney'), res_create_alli_need_money);
		AllianceSender.sendGetCurApplying(m_g);
		m_items.tab.activeTab(0);
	};
	
	var _onLoginOk = function(){
		AllianceSender.sendGetInviteList(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_handleCreateResult(netdata.create);
		_handleApplyInfo(netdata.applyinfo);
		_handleInviteInfo(netdata.inviteinfo);
	};
	
	var _onClickAlliListBtn = function(){
		var dlg = UIM.getDlg('allilist');
		dlg.setCaller({self:m_this, caller:_onSelectAlliance});
		dlg.openDlg(m_g.getImgr().getStateCity());
	};
	
	var _onSelectAlliance = function(name){
		_getCtrl('ialliname').value = name;
	};
	
	var _onClickApplyBtn = function(){
		if ( !JVALID.checkAlliname(_getCtrl('ialliname').value) ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null);
		} else {
			m_this.sendApplyToSvr(_getCtrl('ialliname').value);
		}
	};
	
	var _onClickCreateBtn = function(){
		if ( !JVALID.checkAlliname(_getCtrl('icreatename').value) ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null);
			_getCtrl('icreatename').focus();
			return;
		}
		
		if ( !JVALID.checkAlliFlagName(_getCtrl('iflagname').value) ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.createdlg.tips.invalidalliflag, MB_F_CLOSE, null);
			_getCtrl('iflagname').focus();
			return;
		}
	
		AllianceSender.sendCreateAlli(m_g, _getCtrl('icreatename').value, _getCtrl('iflagname').value);
	};
	
	var _onClickRandBtn = function(){
		_getCtrl('iflagname').value = _getRandHZ();
	};
	
	var _onClickAgreeInvite = function(idx){
		var res = m_invitelist[idx];
		AllianceSender.sendAgreeInvite(m_g, res.roleId, res.alliId);
	};
	
	var _onClickIgnoreInvite = function(idx){
		var res = m_invitelist[idx];
		AllianceSender.sendIgnoreInvite(m_g, res.roleId, res.alliId);
	};
	
	var _handleApplyInfo = function(applyinfo){
		if ( !applyinfo ) return;
		if ( !applyinfo.alli ) return;
		if (!_isShow() ) return;
		
		TQ.setTextEx(_getCtrl('alliname'), applyinfo.alli);
	};	
	
	var _handleCreateResult = function(create){
		if ( !create ) return;
		if (!_isShow() ) return;
		
		if ( create.result == 0 ) {
			m_g.getImgr().getRoleRes().allipos = create.allipos;
			m_g.getGUI().sysMsgTips(SMT_SUCCESS, rstr.alli.createdlg.tips.createalliok);
			_hideDlg();
			UIM.getDlg('alli').openDlg();
		}
	};
	
	var _handleInviteInfo = function(inviteinfo){
		if (!inviteinfo) return;
		
		TQ.dictCopy(m_invitelist, inviteinfo);
		if (!_isShow()) {
			if ( m_invitelist.length > 0 ) {
				UIM.getPanel('main').getToolbar().startAllianceBlinking(10000);
			}
			return;
		}
		
		var list = _getCtrl('invitelist');
		_setInviteListItems(list);
		_setInviteListItemsBtnCaller(list);
	};
	
	var _setInviteListItems = function(list){
		list.setItemCount(m_invitelist.length);
		for ( var i=0; i<m_invitelist.length; ++i ) {
			var res = m_invitelist[i];
			var item = list.getItem(i);
			TQ.setTextEx(item.exsubs.desc, HyperLinkMgr.formatLink(res.desc));
		}
	};
	
	var _setInviteListItemsBtnCaller = function(list){
		for (var i=0; i<list.getCount(); ++i) {
			var item = list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.ignoreBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:m_this, caller:_onClickAgreeInvite});
			item.exsubs.ignoreBtn.setCaller({self:m_this, caller:_onClickIgnoreInvite});
		}
	};
	
	var _hideDlg = function(){
		if ( m_dlg ) {
			m_dlg.hide();
		}
	};
	
	var _getCtrl = function(ctrlName){
		var applyItems = m_items.tab.getTabItems(C_APPLY_TAB_IDX);
		var createItems = m_items.tab.getTabItems(C_CREATE_TAB_IDX);
		if (applyItems[ctrlName]) {
			return applyItems[ctrlName]; 
		} else { 
			return createItems[ctrlName];
		}
	};
	
	var _getRandHZ = function(){
		eval( "var word=" +  '"\\u' + (Math.round(Math.random() * 20901) + 19968).toString(16)+'"');
		return word;
	};
	//AlliCreateDlg-unittest-end
});

AlliListDlg = Class.extern(function(){
	//AlliListDlg-unittest-start
    var m_g = null;
    var m_this = null;
    var m_dlg = null;
    var m_items = {};
	var m_cityResId = 0;
	var m_templ = null;
	var m_caller = null;

	this.init = function(g){
		_init(this, g);
    };
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
    this.openDlg = function(cityResId){
		_initParams(cityResId);
        _initDlg();
		_showDlg();
        _initInfo();
    };
	
	this.isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _init = function(THIS, g){
		m_this = THIS;
		m_g = g;
	};
	
	var _initParams = function(cityResId){
		m_cityResId = cityResId;
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_createDlgByTempl();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.listdlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.allilistdlg, m_items);
	};
	
	var _createDlgByTempl = function(){
		m_templ = AlliListDlgTempl.snew(m_g, m_this, m_items.container, 'join');
	};
	
	var _setCallers = function(){
		m_templ.setCaller({self:m_this, caller:_onClickJoinBtn});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_templ.openDlg(m_cityResId);
	};	
	
	var _onClickJoinBtn = function(allianceName){
		if ( m_caller ) {
			m_caller.caller.call(m_caller.self, allianceName);
			m_dlg.hide();
		}
	};
	//AlliListDlg-unittest-end
});

AlliListDlgTempl = Class.extern(function(){
	//AlliListDlgTempl-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_cityResId = 0;
	var m_flag = 'rank'; // rank or join
	var m_alliancesRes = [];
	var m_caller = null;
	var m_pageBar = null;
		
	this.init = function(g, dlg, parentItem, flag){
		_init(this, g, dlg, flag);
		_createItems(parentItem);
		_createPageBar();
		_regEvents();
	};
	
	// set click join button caller
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.openDlg = function(cityResId){
		_openInit(cityResId);
		m_items.pageBar.activePage(1, true);
	};
	
	// callback for pageBar
	this.onPageBarClickSearch = function(name){ 
		if ( name == '' ) {
			return;
		}
		
		if ( !JVALID.checkAlliname(name) ){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.listdlg.tip.invalidalli);
			return;
		}
		
		AllianceSender.sendSearchAlliance(m_g, m_cityResId, name);
	};
	
	// callback for pageBar
	this.onPageBarClickGetSelf = function(){ 
		if (!m_g.getImgr().isInAlliance()) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.listdlg.tip.selfNoInAlli);
			return;
		}
		AllianceSender.sendSearchAlliance(m_g, m_cityResId, m_g.getImgr().getAllianceName());
	};
	
	// callback for pageBar
	this.onPageNavigate = function(pageNo){
		AllianceSender.sendGetAlliList(m_g, m_cityResId, pageNo);
	};
	
	var _init = function(THIS, g, dlg, flag){
		m_this = THIS;
		m_g = g;
		m_dlg = dlg;
		m_flag = flag;
	};
	
	var _createItems= function(parentItem){
		var templs = uicfg.alli.allilistdlg.t_;
		var templ = templs[0];
		m_g.getGUI().buildDomItems(parentItem, templ, templs, m_items);
	};
	
	var _createPageBar = function(){
		m_pageBar = RankPageBar.snew(m_g, rstr.alli.listdlg.lbl.searchalli, JVALID.getMaxAlliLen(), m_items.pageBarCon, m_items);
		m_pageBar.regObServer(m_this);
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	var _openInit = function(cityResId){
		m_cityResId = cityResId;
	};
	
	var _setAllianceListItems = function(talliances){
		var alliances = _collectAlliances(talliances);
		m_items.list.setItemCount(alliances.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var alliance = alliances[i];
			
			var cityres = ItemResUtil.findItemres(alliance.cityResId);
			IMG.setBKImage(item.exsubs.cityFlag,IMG.makeSmallStateCityFlag(cityres.flagimg));
			
			TQ.setTextEx(item.exsubs.rank, alliance.rank);
			TQ.setTextEx(item.exsubs.name, alliance.name);
			TQ.setTextEx(item.exsubs.leader, alliance.leader);
			TQ.setTextEx(item.exsubs.level, alliance.level);
			TQ.setTextEx(item.exsubs.mem, alliance.mem);
			TQ.setTextEx(item.exsubs.honour, alliance.honour);
			item.exsubs.seeBtn.setId(i);
			item.exsubs.joinBtn.setId(i);
		}
	};
	
	var _collectAlliances = function(alliances){
		var collectAllis = [];
		for ( var i=0; i<alliances.length; ++i ) {
			var alliance = alliances[i];
			if (alliance.name == '--' && alliance.cityResId == 0) continue;
			collectAllis.push(alliance);
		}
		return collectAllis;
	};
	
	var _setAllianceListItemBtnsVisible = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			if ( m_flag == 'join' ) {
				item.exsubs.joinBtn.show();
			} else {
				item.exsubs.joinBtn.hide();
			}
		}
	};
	
	var _setAllianceListItemBtnsCaller = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:m_this, caller:_onClickSeeBtn});
			item.exsubs.joinBtn.setCaller({self:m_this, caller:_onClickJoinBtn});
		}
	};
	
	var _setCurSelectItem = function(curSelIdx){
		if ( isNull(curSelIdx) ) {
			m_items.list.setCurSel(-1);
		} else {
			m_items.list.setCurSel(curSelIdx);
		}
	};
	
	var _onClickSeeBtn = function(idx){
		var alliance = m_alliancesRes[idx];
		AllianceSender.sendGetAllianceDetail(m_g, alliance.name);
	};
	
	var _onClickJoinBtn = function(idx){
		if ( m_caller ) {
			var alliance = m_alliancesRes[idx];
			m_caller.caller.call(m_caller.self, alliance.name);
		}
	};
	
	var _onSvrPkg = function(netevent){
		if ( !m_dlg.isShow() ) return;
		_updateBySvrPkg(netevent);
	};
	
	var _updateBySvrPkg = function(netevent){
		var netdata = netevent.data;
		if (!netdata.alliances) return;
		if (netdata.cityResId != m_cityResId) return;
		
		m_alliancesRes = netdata.alliances;
		m_pageBar.setPageBarNoActive(netdata.pageNo, netdata.pageCount);
		_setAllianceListItems(m_alliancesRes);
		_setAllianceListItemBtnsVisible();
		_setAllianceListItemBtnsCaller();
		_setCurSelectItem(netdata.curSelIdx);
	};
	//AlliListDlgTempl-unittest-end
});

RankPageBar = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.parent_ = null;
	this.searchMaxLen_ = 1;
	this.searchLbl_ = '';
	this.observer_ = null;
	var m_this = null;
	
	this.init = function(g, searchLbl, searchMaxLen, parent, items){
		m_this = this;
		this.g_ = g;
		this.searchLbl_ = searchLbl;
		this.searchMaxLen_ = searchMaxLen;
		this.parent_ = parent;
		this.items_ = items;
		this._createTempl();
		this._setCallers();
	};
	
	this.regObServer = function(ob){
		this.observer_ = ob;
		this.items_.pageBar.activePage(1, true);
	};
	
	this.setPageBarNoActive = function(pageNo, pageCount){
		this.items_.pageBar.setPageCnt(pageCount);
		this.items_.pageBar.activePage(pageNo, false, true);
		this.items_.pageno.setVal(pageNo);
	};
	
	this._createTempl = function(searchMaxLen){
		var templs = uicfg.alli.allilistdlg.t_;
		var templ = templs[2];
		this.g_.getGUI().buildDomItems(this.parent_, templ, templs, this.items_);
		TQ.setTextEx(this.items_.searchLbl, this.searchLbl_);
		InputLimit.maxGBKBytes(this.items_.searchName,  this.searchMaxLen_);
	};
	
	this._setCallers = function(){
		this.items_.pageno.setLimit(_onGetPageNoLimit);
		this.items_.searchBtn.setCaller({self:this, caller:this._onClickSearch});
		this.items_.getSelfBtn.setCaller({self:this, caller:this._onClickGetSelf});
		this.items_.gotoPage.setCaller({self:this, caller:this._onClickGotoPage});
		this.items_.pageBar.setCaller({self:this, caller:this._onPageNavigate});
	};
	
	this._onClickSearch = function(){
		this.observer_.onPageBarClickSearch(this.items_.searchName.value);
	};
	
	this._onClickGetSelf = function(){
		this.observer_.onPageBarClickGetSelf();
	};
	
	this._onPageNavigate = function(pageNo){
		this.items_.pageno.setVal(pageNo);
		this.observer_.onPageNavigate(pageNo);
	};	
	
	this._onClickGotoPage = function(){
		this.items_.pageBar.activePage(this.items_.pageno.getVal());
	};
	
	var _onGetPageNoLimit = function(){
		return {min:1, max:m_this.items_.pageBar.getPageCnt()};
	};
});

AlliDetailDlg = Class.extern(function(){
	//AlliDetailDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_detail = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.hideDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	var _openDlg = function(detail){
		_initDlg();
		_showDlg();
		_initInfo(detail);
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.detaildlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.allidetail, m_items);		
	};
	
	var _setCallers = function(){
		m_items.applybtn.setCaller({self:m_this, caller:_onClickApplyBtn});
		m_items.membtn.setCaller({self:m_this, caller:_onClickMemBtn});
	};

	var _initInfo = function(detail){
		m_detail = detail;
		
		var tags = ['name', 'level', 'flag', 'leader', 'mem', 'buildVal', 'card', 'honour'];
		for ( var i=0; i<tags.length; ++i ) {
			var tag = tags[i];
			TQ.setTextEx(m_items[tag], m_detail[tag]);
		}
		
		TQ.setTextEx(m_items.introduction.getContainerObj(), m_detail.introduction);
		var cityres = ItemResUtil.findItemres(m_detail.cityResId);
		IMG.setBKImage(m_items.cityFlag,IMG.makeSmallStateCityFlag(cityres.flagimg));
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (!netdata.detail) return;
		
		_openDlg(netdata.detail);
	};
	
	var _onClickApplyBtn = function(){
		UIM.getDlg('allicreate').sendApplyToSvr(m_detail.name);
	};
	
	var _onClickMemBtn = function(){
		if ( m_g.getImgr().isSameAllianceByName(m_detail.name) ) {
			UIM.getDlg('selfallimemlist').openDlg();
		} else {
			UIM.getDlg('otherallimemlist').openDlg(m_detail.name);
		}
	};
	//AlliDetailDlg-unittest-end
});

SelfAlliMemListDlg = Class.extern(function(){
	//SelfAlliMemListDlg-unittest-start
	var C_MIN_NOLOGIN_DAYS = 3;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_selfmems = [];
	
	this.init = function(g){
		m_this = this;
		m_g = g;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
    };
	
    this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
    };
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.selfmemlistdlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.selfmemlist, m_items);
	};
	
	var _setCallers = function(){
		m_items.pageBar.setCaller({self:m_this, caller:_onPageNavigate});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_items.pageBar.activePage(1, true);
	};
	
	var _onSvrPkg = function(netevent){
		if (!m_dlg || !m_dlg.isShow()) return;
		if (!netevent.data.selfmems) return;
		
		m_selfmems = netevent.data.selfmems;
		_setPageBar(netevent.data.pageNo, netevent.data.pageCount);
		_updateListItems();
		_setListItemBtnsCaller();
	};
	
	var _setPageBar = function(pageNo, pageCount){
		m_items.pageBar.setPageCnt(pageCount);
		m_items.pageBar.activePage(pageNo, false, true);
	};
	
	var _updateListItems = function(){
		m_items.list.setItemCount(m_selfmems.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var mem = m_selfmems[i];
			TQ.setTextEx(item.exsubs.name, mem.name);
			TQ.setTextEx(item.exsubs.alliPos, rstr.alli.alliposs[mem.alliPos]);
			TQ.setTextEx(item.exsubs.roleRank, mem.roleRank);
			TQ.setTextEx(item.exsubs.level, mem.level);
			TQ.setTextEx(item.exsubs.buildCurVal, mem.buildCurVal);
			TQ.setTextEx(item.exsubs.contributes, mem.contributes);
			TQ.setTextEx(item.exsubs.state, _getMemState(mem.loginTime));
			TTIP.setCallerData(item.exsubs.tooltips['$alliPos'], {self:m_this, caller:_onGetAlliPosTip}, {idx:i});
			item.exsubs.seeBtn.setId(i);
		}
	};
	
	var _setListItemBtnsCaller = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:m_this, caller:_onClickSeeBtn});
		}
	};
	
	var _getMemState = function(loginTime){
		if (loginTime == 0) return '--';
		
		var noLoginDays = Math.floor((m_g.getSvrTimeS() - loginTime)/(24*3600));
		if (noLoginDays < C_MIN_NOLOGIN_DAYS) return '--';
		
		return TQ.format(rstr.alli.selfmemlistdlg.tip.noLoginDays, noLoginDays);
	};
	
	var _onGetAlliPosTip = function(data){
		return TIPM.makeItemTip( rstr.alli.allipostips[m_selfmems[data.idx].alliPos] );
	};
	
	var _onPageNavigate = function(pageNo){
		AllianceSender.sendGetSelfMems(m_g, pageNo);
	};
	
	var _onClickSeeBtn = function(idx){
		var dlg = UIM.getDlg('allimeminfo');
		dlg.openDlg(m_selfmems[idx]);
		dlg.setObserver(_onMemberChange);
	};
	
	var _onMemberChange = function(){
		AllianceSender.sendGetSelfMems(m_g, m_items.pageBar.getCurPage());
	};
	//SelfAlliMemListDlg-unittest-end
});

OtherAlliMemListDlg = Class.extern(function(){
	//OtherAlliMemListDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_mems = [];
	var m_cityResId = 0;
	var m_allianceName = '';
		
	this.init = function(g){
		m_this = this;
		m_g = g;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
    };
	
    this.openDlg = function(allianceName){
		_initDlg();
		_showDlg();
		_initInfo(allianceName);
    };
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();		
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.othermemlistdlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.othermemlist, m_items);		
	};
	
	var _setCallers = function(){
		m_items.pageBar.setCaller({self:m_this, caller:_onPageNavigate});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(allianceName){
		m_allianceName = allianceName;
		m_items.pageBar.activePage(1, true);
	};
	
	var _onSvrPkg = function(netevent){
		if (!m_dlg || !m_dlg.isShow()) return;
		if (!netevent.data.mems) return;
		
		m_mems = netevent.data.mems;
		m_cityResId = netevent.data.cityResId;
		_setPageBar(netevent.data.pageNo, netevent.data.pageCount);
		_updateListItems();
		_setListItemBtnsCaller();
		_setListItemBtnsEnable();
	};
	
	var _setPageBar = function(pageNo, pageCount){
		m_items.pageBar.setPageCnt(pageCount);
		m_items.pageBar.activePage(pageNo, false, true);
	};
	
	var _updateListItems = function(){
		var cityRes = ItemResUtil.findItemres(m_cityResId);
		IMG.setBKImage(m_items.cityFlag, IMG.makeSmallStateCityFlag(cityRes.flagimg));
		
		m_items.list.setItemCount(m_mems.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var mem = m_mems[i];
			
			TQ.setTextEx(item.exsubs.name, mem.name);
			TQ.setTextEx(item.exsubs.alliPos, rstr.alli.alliposs[mem.alliPos]);
			TQ.setTextEx(item.exsubs.roleRank, mem.roleRank);
			TQ.setTextEx(item.exsubs.level, mem.level);
			
			var fightRefState = m_g.getImgr().getFightRefState(mem.roleId);
			TQ.setTextEx(item.exsubs.state, rstr.field.rolecitydlg.lbl.refstate[fightRefState]);
			
			var pos = FieldUtil.getPosByGridId(mem.gridId);
			var cood = '#[m:' + pos.x + ':' + pos.y + ']';
			TQ.setTextEx(item.exsubs.cood, HyperLinkMgr.formatLink(cood));
			
			var dis = Math.round(ExpedTargetUtil.getDistance(m_g, pos));
			TQ.setTextEx(item.exsubs.distance, dis);
			
			TTIP.setCallerData(item.exsubs.tooltips['$alliPos'], {self:m_this, caller:_onGetAlliPosTip}, {idx:i});
			
			item.exsubs.seeBtn.setId(i);
			item.exsubs.declareBtn.setId(i);
		}
	};
	
	var _setListItemBtnsCaller = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:m_this, caller:_onClickSeeBtn});
			item.exsubs.declareBtn.setCaller({self:m_this, caller:_onClickDeclareBtn});
		}
	};
	
	var _setListItemBtnsEnable = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var mem = m_mems[i];
			var fightRefState = m_g.getImgr().getFightRefState(mem.roleId);
			item.exsubs.declareBtn.enable(fightRefState == REF_ROLESTATE.NORMAL);
		}
	};
	
	var _onGetAlliPosTip = function(data){
		return TIPM.makeItemTip( rstr.alli.allipostips[m_mems[data.idx].alliPos] );
	};
	
	var _onPageNavigate = function(pageNo){
		AllianceSender.sendGetOtherMems(m_g, m_allianceName, pageNo);
	};
	
	var _onClickSeeBtn = function(idx){
		var mem = m_mems[idx];
		var field = {gridId:mem.gridId, objType:OBJ_TYPE.ROLE, roleId:mem.roleId, roleName:mem.name, alliance:{uid:-1,name:'alliance'}};
		UIM.getDlg('rolecitymodal').openDlg(field);
	};
	
	var _onClickDeclareBtn = function(idx){
		var mem = m_mems[idx];
		var fightRefState = m_g.getImgr().getFightRefState(mem.roleId);
		if (fightRefState == REF_ROLESTATE.NORMAL){
			MilitarySender.sendDeclareFight(m_g, mem.roleId);
		}
	};
	//OtherAlliMemListDlg-unittest-end
});

AlliMainDlg = ListenerBaseDlg.extern(function(){
	//AlliMainDlg-unittest-start
	var C_TAB_INFO_IDX = 0;
	var C_TAB_LAWLIGHT_IDX = 1;
	var C_TAB_AUCTION_IDX = 2;
	
    var m_g = null;
    var m_this = null;
    var m_dlg = null;
    var m_items = {};
	var m_basePanel = null;
    var m_lawLightPanel = null;
	var m_auctionPanel = null;

    this._init = function(){
		_initParams(this, this.g_);
		 m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
    };
	
    this.openDlg = function(tabIdx){
		_initDlg();
		_showDlg();
		_initInfo(tabIdx);
		this._notifyOpenDlg();
    };
	
	this.isShow = function(){
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	this.hideDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	
	var _initParams = function(THIS, g){
        m_g = g;
        m_this = THIS;
		m_basePanel = NullAlliMainPanel.snew();
		m_lawLightPanel = NullAlliMainPanel.snew();
		m_auctionPanel = NullAlliMainPanel.snew();
	};	
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
		_initPanels();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.main.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.maindlg, m_items);			
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
	};
	
	var  _initPanels = function(){
		m_basePanel = AlliMainBasePanel.snew(m_g, m_items.tablist.getTabItems(C_TAB_INFO_IDX));
		m_lawLightPanel = AlliMainLawLightPanel.snew(m_g, m_items.tablist.getTabItems(C_TAB_LAWLIGHT_IDX));
		m_auctionPanel = AlliMainAuctionPanel.snew(m_g, m_items.tablist.getTabItems(C_TAB_AUCTION_IDX));
	};
	
	var _showDlg = function(){
		m_dlg.show();
		m_basePanel.show();
		m_lawLightPanel.show();
		m_auctionPanel.show();
	};
	
	var _initInfo = function(tabIdx){
		AllianceSender.sendGetMyAllianceDetail(m_g);
		m_items.tablist.activeTab(tabIdx ? tabIdx : 0);
	};
	
	var _onSvrPkg  = function(netevent){
		var netdata = netevent.data;
		_onSvrPkgBaseinfo(netdata.mydetail);
		_onSvrPkgLawLightInfo(netdata.lawlight);
		_onSvrPkgAuction(netdata.auction);
		_onSvrPkgSelfMember(netdata.selfmem);
		_onSvrPkgMySellingItems(netdata.sellingItems);
	};	
	
	var _onSvrPkgBaseinfo = function(mydetail){
		if ( !mydetail ) return;
		
		m_g.getImgr().getMyAlliance().copyDetail(mydetail);
		m_g.sendEvent({eid:EVT.SELFALLI_DETAIL, sid:0});
		_update();
	};
	
	var _onSvrPkgLawLightInfo = function(lawlight){
		if ( !lawlight ) return;
		
		m_g.getImgr().getMyAlliance().copyLawLight(lawlight);
		_update();
	};
	
	var _onSvrPkgAuction = function(auction) {
		if ( !auction ) return;
		
		m_g.getImgr().getMyAlliance().copyAuction(auction);
		_update();
	};
	
	var _onSvrPkgSelfMember = function(selfMember){
		if ( !selfMember ) return;
		
		m_g.getImgr().getMyAlliance().copySelfMember(selfMember);
		m_g.sendEvent({eid:EVT.SELFALLIMEM_CHANGE, sid:0});
		_update();
	};
	
	var _onSvrPkgMySellingItems = function(sellingItems){
		if ( !sellingItems ) return;
		m_g.getImgr().copySellingItems(sellingItems);
		m_g.sendEvent({eid:EVT.SELLING_ITEMS, sid:0});
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ) {
			m_basePanel.hide();
			m_lawLightPanel.hide();
			m_auctionPanel.hide();
		}
	};
	
	var _update = function(){
		if (!m_dlg || !m_dlg.isShow()) return;
		m_basePanel.update();
		m_lawLightPanel.update();
		m_auctionPanel.update();
	};
	
	//AlliMainDlg-unittest-end
});

NullAlliMainPanel = Class.extern(function(){
	this.show = function(){};
	this.hide = function(){};
	this.update = function(){};
});

AlliMainBasePanel = Class.extern(function(){
	//AlliMainBasePanel-unittest-start
	var CMD_TRANSFER_LEADER = 0;
	var CMD_APPOINT_ALEADER = 1;
	var CMD_APPOINT_ELDER = 2;
	var CMD_FIRE_ALEADER = 3;
	var CMD_FIRE_ELDER = 4;
	var CMD_KICK = 5;
	var CMD_TALK = 6;
	var CMD_LETTER = 7;

	var m_g;
	var m_this;
	var m_items = {};
	var m_opmenu = null;
	var m_curmemidx = 0;
	
	this.init = function(g, uiitem){
		m_g = g;
		m_this = this;
		m_items = uiitem;
		_setCallers();
	};
	
	this.show = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.hide = function(){
		m_g.unregUpdater(m_this, _onUpdate);
	};	
	
	this.update = function(){
		_setBtnsEnableState();
		_setBtnsVisibleByAlliPos();
		_setBarContainersVisible();
		_setBarLabel();
		_setBtnText();
		_updateBaseInfo();
		_updateBars();
	};
	
	var _setCallers = function(){
		m_items.upgradeLevelBtn.setCaller({self:m_this, caller:_onClickUpgrade});
		m_items.transferBtn.setCaller({self:m_this, caller:_onClickTransfer});
		m_items.seeMemsBtn.setCaller({self:m_this, caller:_onClickMemList});
		m_items.subscribeBtn.setCaller({self:m_this, caller:_onClickSubscribe});
		m_items.modifyQQGroupBtn.setCaller({self:m_this, caller:_onClickModifyQQ});
		
		m_items.inviteBtn.setCaller({self:m_this, caller:_onClickInvite});
		m_items.agreeApplyBtn.setCaller({self:m_this, caller:_onClickAgreeApply});
		m_items.showEventBtn.setCaller({self:m_this, caller:_onClickEvent});
		m_items.mergeBtn.setCaller({self:m_this, caller:_onClickMerge});
		m_items.dismissBtn.setCaller({self:m_this, caller:_onClickDismiss});
		m_items.quitBtn.setCaller({self:m_this, caller:_onClickQuit});
		
		m_items.modifyIntroduceBtn.setCaller({self:m_this, caller:_onClickModifyIntroduce});
		m_items.modifyBulletinBtn.setCaller({self:m_this, caller:_onClickModifyBulletin});
		
		m_items.upgradeBar.setShowFlag(PROGBAR_SHOWFLAG_CUSTOM);
		m_items.upgradeBar.setCustomValCaller({self:m_this, caller:_onGetFomartLeftTime});
		
		m_items.transferOrDismissBar.setShowFlag(PROGBAR_SHOWFLAG_CUSTOM);
		m_items.transferOrDismissBar.setCustomValCaller({self:m_this, caller:_onGetFomartLeftTime});
		
		TTIP.setCallerData(m_items.tooltips['$honour'], {self:m_this, caller:_onGetHonourTip},{});
		TTIP.setCallerData(m_items.tooltips['$buildVal'], {self:m_this, caller:_onGetBuildValTip},{});
		TTIP.setCallerData(m_items.tooltips['$card'], {self:m_this, caller:_onGetCardTip},{});
	};	
	
	var _setBtnsEnableState = function(){
		_setBtnsEnableStateByAlliPos();
		_setUpgradeBtnEnableState();
	};
	
	var _setBtnsEnableStateByAlliPos = function(){
		var btnsNeedAlliPos = {
			'upgradeLevelBtn':ALLI_POS.ALEADER
			,'transferBtn':ALLI_POS.LEADER
			,'modifyQQGroupBtn':ALLI_POS.LEADER
			,'inviteBtn':ALLI_POS.ELDER
			,'agreeApplyBtn':ALLI_POS.ELDER
			,'mergeBtn':ALLI_POS.ALEADER
			,'dismissBtn':ALLI_POS.LEADER
			,'modifyIntroduceBtn':ALLI_POS.LEADER
			,'modifyBulletinBtn':ALLI_POS.LEADER
		};
		
		for ( var btnName in btnsNeedAlliPos ) {
			var needAlliPos = btnsNeedAlliPos[btnName];
			var isValidAlliPos = m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos() >= needAlliPos;
			m_items[btnName].enable(isValidAlliPos);
		}
	};
	
	var _setUpgradeBtnEnableState = function(){
		if ( m_items.upgradeLevelBtn.isEnable() ) {
			var myAlliance = m_g.getImgr().getMyAlliance();
			m_items.upgradeLevelBtn.enable(!myAlliance.isUpgradingAlliance() && !myAlliance.isFullLevel());
		}
	};
	
	var _setBtnsVisibleByAlliPos = function(){
		var btnsNeedAlliPos = {
			'modifyIntroduceBtn':ALLI_POS.LEADER
			,'modifyBulletinBtn':ALLI_POS.LEADER
		};
		
		for ( var btnName in btnsNeedAlliPos ) {
			var needAlliPos = btnsNeedAlliPos[btnName];
			var isValidAlliPos = m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos() >= needAlliPos;
			if (isValidAlliPos) {
				m_items[btnName].show();
			} else {
				m_items[btnName].hide();
			}
		}		
	};
	
	var _setBarContainersVisible = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setCSS(m_items.upgradeBarContainer, 'display', myAlliance.isUpgradingAlliance() ? 'block' : 'none' );
		TQ.setCSS(m_items.transferBarContainer, 'display', ( myAlliance.isTransfering() || myAlliance.isDismissing() ) ? 'block' : 'none' );
		
	};
	
	var _setBarLabel = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx ( m_items.transferOrDismissLbl, myAlliance.isDismissing() ? rstr.alli.main.lbl.dismissBar : rstr.alli.main.lbl.transferBar );
	};
	
	var _setBtnText = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		m_items.dismissBtn.setText(myAlliance.isDismissing() ? rstr.alli.main.btn.undismiss : rstr.alli.main.btn.dismiss);
	};
	
	var _updateBaseInfo = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx( m_items.name, myAlliance.getName() );
		TQ.setTextEx( m_items.cityName, ItemResUtil.findItemres(myAlliance.getCityResId()).name );
		TQ.setTextEx( m_items.alliFlag, myAlliance.getAlliFlag() );
		TQ.setTextEx( m_items.rank, myAlliance.getRank() );
		TQ.setTextEx( m_items.honour, RStrUtil.formatResNumStr(myAlliance.getHonour()) );
		TQ.setTextEx( m_items.level, myAlliance.getLevel() );
		TQ.setTextEx( m_items.leader, myAlliance.getLeader() );
		TQ.setTextEx( m_items.mem, myAlliance.getMemCount() + '/' + _getCurLevelRes().memmaxcount );
		
		TQ.setTextEx( m_items.buildVal, RStrUtil.formatResNumStr(myAlliance.getBuildVal()) );
		TQ.setTextEx( m_items.card, RStrUtil.formatResNumStr(myAlliance.getCardNumber()) );
		TQ.setTextEx( m_items.qqGroup, myAlliance.getQQGroup() );
		TQ.setRichText( m_items.introduction.getContainerObj(), TQ.decodeMessage(myAlliance.getIntroduction()) );
		TQ.setRichText( m_items.bulletin.getContainerObj(), TQ.decodeMessage(myAlliance.getBulletin()) );
		m_items.introduction.refresh();
		m_items.bulletin.refresh();
	};
	
	var _updateBars = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		
		_updateBar('upgradeBar', myAlliance.getUpgradeStartTime(), myAlliance.getUpgradeStopTime());
		_updateBar('transferOrDismissBar', myAlliance.getDismissStartTime(), myAlliance.getDismissStopTime());
		_updateBar('transferOrDismissBar', myAlliance.getTransferStartTime(), myAlliance.getTransferStopTime());
	};
	
	var _updateBar = function(barName, startTime, stopTime){
		if (stopTime == 0) return;
		
		var maxVal = stopTime - startTime;
		var curVal = m_g.getSvrTimeS() - startTime;
		var curVal = Math.min(maxVal, curVal);
		m_items[barName].setRange(maxVal);
		m_items[barName].setValue(0, curVal);
	};
	
	var _onUpdate = function(){
		_updateBars();
	};
	
	var _onClickUpgrade = function(){
		if ( _getNextLevelRes().needbuildval > m_g.getImgr().getMyAlliance().getBuildVal() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, TQ.format(rstr.ids[100118].msg, _getNextLevelRes().needbuildval) );
			return;
		}
		
		m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.alli.main.tip.confirmUpgradeAlli
			,MB_F_YESNO
			,{self:m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendUpgradeAlliance(m_g);
				}
			}});
	};
	
	var _getNextLevelRes = function(){
		return _getLevelRes(m_g.getImgr().getMyAlliance().getLevel() + 1);
	};
	
	var _getCurLevelRes = function(){
		return _getLevelRes(m_g.getImgr().getMyAlliance().getLevel());
	};
	
	var _getLevelRes = function(level){
		var levelIdx = level - 1;
		return res_alli_upd_needs[levelIdx];
	};
	
	var _onClickTransfer = function(){
		if (m_g.getImgr().getMyAlliance().isDismissing()){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100119].msg);
		} else if (m_g.getImgr().getMyAlliance().isTransfering()){
			UIM.getDlg('alliuntransfer').openDlg();
		} else {
			UIM.getDlg('allitransfer').openDlg();
		}
	};
	
	var _onClickMemList = function(){
		UIM.getDlg('selfallimemlist').openDlg();
	};
	
	var _onClickSubscribe = function(){
		UIM.getDlg('allisubscribe').openDlg();
	};
	
	var _onClickModifyQQ = function(){
		var inputdlg = UIM.getDlg('inputnumex');
		inputdlg.openDlg(rstr.alli.main.lbl.inputQQGroup, 99999999999);
		inputdlg.setNumber(m_g.getImgr().getMyAlliance().getQQGroup());
		inputdlg.setCaller({self:m_this, caller:_onQQGroupCallBack});
	};
	
	var _onQQGroupCallBack = function(qqGroup){
		AllianceSender.sendModifyQQGroup(m_g, qqGroup);
	};
	
	var _onClickInvite = function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.alli.main.lbl.inputInviteName, JVALID.getMaxUserLen());
		inputdlg.setCaller({self:m_this,caller:_onInviteCallBack});		
	};
	
	var _onInviteCallBack = function(name){
		if ( JVALID.checkUsername(name) ){
			AllianceSender.sendInvite(m_g, name);
		}
		else{
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100050].msg);
		}
	};
	
	var _onClickAgreeApply = function(){
		UIM.getDlg('alliapplylist').openDlg();
	};
	
	var _onClickEvent = function(){
		UIM.getDlg('allievents').openDlg();
	};
	
	var _onClickMerge = function(){
		UIM.getDlg('allimerge').openDlg();
	};
	
	var _onClickDismiss = function(){
		if (m_g.getImgr().getMyAlliance().isTransfering()){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100120].msg);
		} else if (m_g.getImgr().getMyAlliance().isDismissing()){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmUnDismissAlli, MB_F_YESNO, {self:m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendCancelDismiss(m_g);
				}
			}});
		} else {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmDismissAlli, MB_F_YESNO, {self:m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendDismiss(m_g);
				}
			}});
		}
	};
	
	var _onClickQuit = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		if (myAlliance.getSelfMember().getAlliPos() == ALLI_POS.LEADER) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100121].msg);
		} else {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmExitAlli, MB_F_YESNO, {self:m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendExitAlliance(m_g);
				}
			}});
		}
	};
	
	var _onClickModifyIntroduce = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		var inputdlg = UIM.getDlg('inputareatext');
		inputdlg.openDlg(rstr.alli.main.lbl.modifyIntroduce, TQ.decodeMessageForText(myAlliance.getIntroduction()), rstr.alli.main.lbl.introduceDesc, JVALID.getMaxAllianceIntroduceGBKBytes() );
		inputdlg.setCaller({self:m_this, caller:_onModifyIntroduceCallBack});
	};
	
	var _onModifyIntroduceCallBack = function(text){
		var myAlliance = m_g.getImgr().getMyAlliance();
		var originalIntr = TQ.decodeMessageForText(myAlliance.getIntroduction());
		if ( text != originalIntr ){
			AllianceSender.sendModifyIntroduce(m_g, text);
		}
	};
	
	var _onClickModifyBulletin = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		var inputdlg = UIM.getDlg('inputareatext');
		inputdlg.openDlg(rstr.alli.main.lbl.modifyBulletin, TQ.decodeMessageForText(myAlliance.getBulletin()), rstr.alli.main.lbl.bulletinDesc, JVALID.getMaxAllianceBulletinGBKBytes() );
		inputdlg.setCaller({self:m_this, caller:_onModifyBulletinCallBack});
	};
	
	var _onModifyBulletinCallBack = function(text){
		var myAlliance = m_g.getImgr().getMyAlliance();
		var originalBulletin = TQ.decodeMessageForText(myAlliance.getBulletin());
		if ( text != originalBulletin ){
			AllianceSender.sendModifyBulletin(m_g, text);
		}
	};
	
	var _onGetFomartLeftTime = function(curVal, range){
		return TQ.formatTime(0, range - curVal);
	};
	
	var _onGetHonourTip = function(data){
		var myAlliance = m_g.getImgr().getMyAlliance();
		return myAlliance.getHonour().toString();
	};
	
	var _onGetBuildValTip = function(data){
		var myAlliance = m_g.getImgr().getMyAlliance();
		return myAlliance.getBuildVal().toString();
	};
	
	var _onGetCardTip = function(data){
		var myAlliance = m_g.getImgr().getMyAlliance();
		return myAlliance.getCardNumber().toString();
	};
	//AlliMainBasePanel-unittest-end
});

AlliLawLightUtil = JClass.ex({
	_init : function(g){
		this._g = g;
		this._imgr = this._g.getImgr();
	}
	
	,isCanFeed : function(){
		var selfMember = this._imgr.getMyAlliance().getSelfMember();
		return selfMember.getTodayFeedTimes() < this.getMaxFeedTimes();
	}
	
	,getMaxFeedTimes : function(){
		return this.getLawLightCurLevelRes().maxfeedtimes + this._imgr.getVipEffectVal(VIP_EFF.ADD_LAWLIGHTFEED_TIMES);
	}
	
	,getLawLightCurLevelRes : function(){
		var lawLight = this._imgr.getMyAlliance().getLawLight();
		return this._getLawLightLevelRes(lawLight.getLevel());
	}
	
	,getLawLightNextLevelRes : function(){
		var lawLight = this._imgr.getMyAlliance().getLawLight();
		return this._getLawLightLevelRes(lawLight.getLevel()+1);
	}
	
	,_getLawLightLevelRes : function(level){
		var levelIdx = level - 1;
		return res_alli_lawlight_upd[levelIdx];
	}
});

AlliMainLawLightPanel = Class.extern(function(){
	//AlliMainLawLightPanel-unittest-start
	var m_g;
	var m_this;
	var m_items = {};
	var m_util = null;
	
	this.init = function(g, uiitem){
		m_g = g;
		m_this = this;
		m_items = uiitem;
		m_util = AlliLawLightUtil.snew(g);
		
		_setCallers();
		_setBtnTipCaller();
	};
	
	this.show = function(){};
	this.hide = function(){};		
	
	this.update = function(){
		_setBtnsEnableState();
		_setBtnsVisibleByAlliPos();
		_updateBaseInfo();
	};
	
	var _setBtnsEnableState = function(){
		_setGetResBtnEnableState();
		_setUpgradeBtnEnableState();
		_setBestowBtnEnableState();
		_setFeedBtnsEnableState();
	};
	
	var _setGetResBtnEnableState = function(){
		var selfMember = m_g.getImgr().getMyAlliance().getSelfMember();
		m_items.getResBtn.enable(!selfMember.isTodayGotRes());
	};
	
	var _setUpgradeBtnEnableState = function(){
		var nextRes = m_util.getLawLightNextLevelRes();
		if (!nextRes) return;
		
		var myAlliance = m_g.getImgr().getMyAlliance();
		if (myAlliance.getBuildVal() >= nextRes.needbuildval && myAlliance.getCardNumber() >= nextRes.needcard ) {
			m_items.upgradeBtn.enable(true);
		} else {
			m_items.upgradeBtn.enable(false);
		}
	};
	
	var _setBestowBtnEnableState = function(){
		var res = m_util.getLawLightCurLevelRes();
		var lawLight = m_g.getImgr().getMyAlliance().getLawLight();
		if ( lawLight.getGrowupVal() == res.maxgrowupval ) {
			m_items.bestowBtn.enable(true);
		} else {
			m_items.bestowBtn.enable(false);
		}
	};
	
	var _setFeedBtnsEnableState = function(){
		m_items.feedBtn.enable(m_util.isCanFeed());
		m_items.feedAllBtn.enable(m_util.isCanFeed());
	};
	
	var _setBtnsVisibleByAlliPos = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		if ( myAlliance.getSelfMember().getAlliPos() == ALLI_POS.LEADER ) {
			m_items.upgradeBtn.show();
			m_items.bestowBtn.show();
		} else {
			m_items.upgradeBtn.hide();
			m_items.bestowBtn.hide();
		}
		
		var lawLight = myAlliance.getLawLight();
		if ( lawLight.getLevel() == res_alli_lawlight_maxlevel ) {
			m_items.upgradeBtn.hide();
		}
	};
	
	var _updateBaseInfo = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx(m_items.canGetMoney, _getCurLevelRes().getmoney);
		TQ.setTextEx(m_items.canGetHeroExp, _getCurLevelRes().getheroexp);
		TQ.setTextEx(m_items.getResNeedContributes, _getCurLevelRes().expendcontribute);
		TQ.setTextEx(m_items.totalContributes, myAlliance.getSelfMember().getContributes());
		var addOutputs = ['addFoodOutput', 'addWoodOutput', 'addStoneOutput', 'addIronOutput', 'addMoneyOutput'];
		for ( var k in addOutputs ) {
			TQ.setTextEx ( m_items[ addOutputs[k] ], '+' + myAlliance.getLevel()*5 + '%' );
		}
		m_items.growupBar.setRange(m_util.getLawLightCurLevelRes().maxgrowupval);
		m_items.growupBar.setValue(0, myAlliance.getLawLight().getGrowupVal());
		TQ.setTextEx(m_items.todayLeftTime, m_util.getMaxFeedTimes() - myAlliance.getSelfMember().getTodayFeedTimes());
		TQ.setTextEx(m_items.feedNeedContributes, m_util.getLawLightCurLevelRes().feedneedcontributes );
		IMG.setBKImage(m_items.lawLightIcon, IMG.makeImg('alli/lawlight/icon/' + myAlliance.getLawLight().getLevel() + '.jpg'));
	};
	
	var _setCallers = function(){
		m_items.getResBtn.setCaller({self:m_this, caller:_onClickGetResBtn});
		m_items.upgradeBtn.setCaller({self:m_this, caller:_onClickUpgradeBtn});
		m_items.bestowBtn.setCaller({self:m_this, caller:_onClickBestowBtn});
		m_items.feedBtn.setCaller({self:m_this, caller:_onClickFeedBtn});
		m_items.feedAllBtn.setCaller({self:m_this, caller:_onClickFeedAllBtn});
	};
	
	var _setBtnTipCaller = function(){
		TTIP.setCallerData(m_items.tooltips['$upgradeBtnTip'], {self:m_this, caller:_onGetUpgradeBtnTip},{});
	};
	
	var _onClickGetResBtn = function(){
		AllianceSender.sendGainTodayGift(m_g);
	};
	
	var _onClickUpgradeBtn = function(){
		var s = _getUpgradeNeedTip();
		var msg = s + rstr.alli.main.lawLight.tip.confirmUpgrade;
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendUpgradeLawLight(m_g);
			}
		}});
	};
	
	var _onClickBestowBtn = function(){
		var msg = rstr.alli.main.lawLight.tip.confirmBestow;
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendLawLightBestow(m_g);
			}
		}});
	};
	
	var _onClickFeedBtn = function(){
		AllianceSender.sendLawLightFeed(m_g);
	};
	
	var _onClickFeedAllBtn = function(){
		AllianceSender.sendLawLightFeedAll(m_g);
	};
	
	var _onGetUpgradeBtnTip = function(){
		return _getUpgradeNeedTip();
	};

	var _getCurLevelRes = function(){
		return _getLevelRes(m_g.getImgr().getMyAlliance().getLevel());
	};
	
	var _getLevelRes = function(level){
		var levelIdx = level - 1;
		return res_alli_upd_needs[levelIdx];
	};	
	
	var _getUpgradeNeedTip = function(){
		var nextRes = m_util.getLawLightNextLevelRes();
		var myAlliance = m_g.getImgr().getMyAlliance();
		var buildValColor = myAlliance.getBuildVal() < nextRes.needbuildval ? COLORS.NO_ENOUGH_ITEM : COLORS.ENOUGH_ITEM;
		var cardColor = myAlliance.getCardNumber() < nextRes.needcard ? COLORS.NO_ENOUGH_ITEM : COLORS.ENOUGH_ITEM;
		var s = TQ.format(rstr.alli.main.lawLight.tip.upgradeNeed, 
			buildValColor, nextRes.needbuildval, myAlliance.getBuildVal()
			,cardColor, nextRes.needcard, myAlliance.getCardNumber() );
		return s;
	};
	//AlliMainLawLightPanel-unittest-end
});

AlliAuctionClassifyItems = BaseClassifyItems.ex({
	_initClassItems : function(){
		this.classitems_ = [
			{classid:RES_CLS.PKGITEM,items:[]}
			,{classid:RES_CLS.EQUIPITEM,items:[]}
			,{classid:RES_CLS.CANUSEITEM,items:[]}
			,{classid:RES_CLS.OTHERITEM,items:[]}
			,{classid:RES_CLS.MY_AUCTION_ITEM,items:[]}];
	}
	
	,_getItems : function(){
		var myAlliance = this.g_.getImgr().getMyAlliance();
		return myAlliance.getAuctionItems();
	}
	
	,_isSatisfiedBy : function(ci, item) { 
		if ( ci.classid == RES_CLS.MY_AUCTION_ITEM ) {
			return item.ismy == 1;
		}
		return this._isInRange(ci, item);
	}
	
	,_sortFun : function(a, b){
		return a.stopTime - b.stopTime;
	}
});

AlliAuctionLeftTimeState = JClass.ex({
	getLeftTimeState : function(g, stopTime){
		var leftTime = stopTime - g.getSvrTimeS();
		return rstr.alli.main.lbl.leftTimeNames[ this._getLeftTimeIdx(leftTime) ];
	}
	
	,_getLeftTimeIdx : function(leftTime){
		if (leftTime < 0) {
			return 0;
		} else if ( leftTime < 2*3600 ) {
			return 1;
		} else if (leftTime < 6*3600 ) {
			return 2;
		} else if (leftTime < 12*3600 ) {
			return 3;
		} else if (leftTime < 24*3600 ) {
			return 4;
		} else {
			return 5;
		}
	}
}).snew();

AlliMainAuctionPanel = JClass.ex({
	init : function(g, uiitem){
		this.TAB_MY_IDX = 4;
		this.g_ = g;
		this.items_ = uiitem;
		this.itemsClassify_ = AlliAuctionClassifyItems.snew(this.g_);
		this._setCallers();
		this._setTabsText();
	}
	
	,show : function(){
		this.items_.paimaiTabs.activeTab(4);
		AllianceSender.sendGetAuctionInfo(this.g_);
	}
	
	,hide : function(){
	}		
	
	,update : function(){
		this.itemsClassify_.refresh();
		this._updateMyContribution();
		this._updateList();
	}
	
	,_setCallers : function(){
		this.items_.mySellBtn.setCaller({self:this, caller:this._onClickMySellBtn});
	}
	
	,_updateMyContribution : function(){
		var myAlliance = this.g_.getImgr().getMyAlliance();
		TQ.setRichText(this.items_.myContribution, myAlliance.getSelfMember().getContributes());
	}
	
	,_updateList : function(){
		for ( var tabIdx=0; tabIdx<this.items_.paimaiTabs.getTabCount(); ++tabIdx ) {
			var list  = this.items_.paimaiTabs.getTabItems(tabIdx).list;
			var items = this.itemsClassify_.getClassItems(tabIdx).items;
			list.setItemCount(items.length);
			for ( var listIdx=0; listIdx<list.getCount(); ++listIdx ) {
				var item = list.getItem(listIdx);
				var ritem = items[listIdx];
				TQ.setRichText(item.exsubs.itemName, ritem.itemres.name);
				TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetItemTip}, {id:this._makeOwnerBtnId(tabIdx, listIdx)});
				TQ.setRichText(item.exsubs.itemNumber, ritem.num);
				item.exsubs.owner.setId(this._makeOwnerBtnId(tabIdx, listIdx));
				item.exsubs.owner.setCaller({self:this, caller:this._onClickOwner});
				if (ritem.isboss) {
					item.exsubs.owner.setText(rstr.alli.main.lbl.worldboss);
				} else {
					item.exsubs.owner.setText(ritem.owner);
				}
				TQ.setRichText(item.exsubs.auctionPrice, ritem.auction);
				TQ.setRichText(item.exsubs.fixedPrice, ritem.fixed);
				TQ.setRichText(item.exsubs.leftTime, AlliAuctionLeftTimeState.getLeftTimeState(this.g_, ritem.stopTime));
				item.exsubs.auctionBuyBtn.setId(this._makeOwnerBtnId(tabIdx, listIdx));
				item.exsubs.auctionBuyBtn.setCaller({self:this, caller:this._onClickAuctionBuyBtn});
				item.exsubs.fixedBuyBtn.setId(this._makeOwnerBtnId(tabIdx, listIdx));
				item.exsubs.fixedBuyBtn.setCaller({self:this, caller:this._onClickFixedBuyBtn});
				if (tabIdx == this.TAB_MY_IDX ) {
					item.exsubs.auctionBuyBtn.hide();
				}
			}
		}
	}
	
	,_setTabsText : function (){
		for (var i=0; i<rstr.alli.main.paimaiTabs.length; ++i ) {
			this.items_.paimaiTabs.setTabText(i, rstr.alli.main.paimaiTabs[i]);
		}
	}

	,_onGetItemTip : function(data){
		var ids = this._splitOwnerBtnId(data.id);
		var item = this.itemsClassify_.getItem(ids.tabIdx, ids.listIdx);
		item = SysItemMaker.make(0, item.itemres);
		return TIPM.getItemDesc(item, 'sys');
	}
	
	,_onClickOwner : function(id){
		var ids = this._splitOwnerBtnId(id);
		var item = this.itemsClassify_.getItem(ids.tabIdx, ids.listIdx);
		if ( item.isboss == 0 )  {
			OutFieldSender.sendGetFieldDetailByRole(this.g_, item.owner);
		} else {
			UIM.openDlg('worldboss');
		}
	}
	
	,_onClickAuctionBuyBtn : function(id){
		var ids = this._splitOwnerBtnId(id);
		var item = this.itemsClassify_.getItem(ids.tabIdx, ids.listIdx);
		if ( item.ismy == 1 )  {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.main.tip.isMyAuctionItem);
		} else if ( item.owner == this.g_.getImgr().getRoleName() ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.main.tip.myIsSeller);
		} else if (item.auction + AUCTION_STEP >= item.fixed) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.main.tip.beyondFixedPrice);
		} else {
			UIM.openDlg('alliauctionbuy', {type:'auction', item:item});
		}
	}
	
	,_onClickFixedBuyBtn : function(id){
		var ids = this._splitOwnerBtnId(id);
		var item = this.itemsClassify_.getItem(ids.tabIdx, ids.listIdx);
		if ( item.owner == this.g_.getImgr().getRoleName() ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.main.tip.myIsSeller);
		} else {
			UIM.openDlg('alliauctionbuy', {type:'fixed', item:item});
		}
	}
	
	,_makeOwnerBtnId : function(tabIdx, listIdx){
		return tabIdx*10000 + listIdx;
	}
	
	,_splitOwnerBtnId : function(id){
		var tabIdx = Math.floor(id/10000);
		var listIdx = id%10000;
		return {tabIdx:tabIdx, listIdx:listIdx};
	}
	
	,_onClickMySellBtn : function(){
		UIM.openDlg('allimysell');
	}
});

AlliTransferDlg = Class.extern(function(){
	//AlliTransferDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();		
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.transferdlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.transferdlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.confirmBtn.setCaller({self:m_this, caller:_onClickConfirmBtn});
		m_items.cancelBtn.setCaller({self:m_this, caller:_onClickCancelBtn});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		AllianceSender.sendGetALeaders(m_g);
		m_items.names.deleteAllItem();
		m_items.names.setCurSel(-1);
		m_items.names.setTitle(rstr.alli.transferdlg.lbl.dropTitle);
	};
	
	var _onClickConfirmBtn = function(){
		if ( m_items.names.getCurSel() < 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.transferdlg.tip.selectTransferTarget);
			return;
		}
		
		var msg = TQ.format(rstr.alli.transferdlg.tip.confirmTransfer, m_items.names.getTitle());
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendTransferLeader(m_g, m_items.names.getTitle());
			}
		}});
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _onSvrPkg = function(netevent){
		if (!m_dlg || !m_dlg.isShow()) return;
		if (!netevent.data.aleaders) return;
		
		m_items.names.deleteAllItem();
		for ( var i=0; i<netevent.data.aleaders.length; ++i ) {
			var name = netevent.data.aleaders[i];
			m_items.names.addItem({text:name});
		}
	};
	//AlliTransferDlg-unittest-end
});

AlliUnTransferDlg = Class.extern(function(){
	//AlliUnTransferDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
		
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
		
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.untransferdlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.untransferdlg, m_items);		
	};
	
	var _setCallers = function(){
		m_items.stopTransferBtn.setCaller({self:m_this, caller:_onStopTransferBtn});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx ( m_items.name, TQ.format(rstr.alli.untransferdlg.lbl.newname, myAlliance.getTransferName()));
		var leftTime = TQ.formatTime(0, myAlliance.getTransferStopTime() - m_g.getSvrTimeS() );
		TQ.setTextEx ( m_items.leftTime, TQ.format(rstr.alli.untransferdlg.lbl.lefttime, leftTime));
	};
	
	var _onStopTransferBtn = function(){
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.untransferdlg.tip.stopTransfer, MB_F_YESNO
			,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendStopTransfer(m_g);
			}
		}});
	};
	//AlliUnTransferDlg-unittest-end
});

AlliSubscribeDlg = Class.extern(function(){
	//AlliSubscribeDlg-unittest-start
	var C_PAGE_ITEMCOUNT = 12;
	var C_TODAY_SORT_TAB = 0;
	var C_ALL_SORT_TAB = 1;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_resNames = [rstr.comm.food, rstr.comm.wood, rstr.comm.stone, rstr.comm.iron, rstr.comm.card];
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.CITYRES, 0, m_this, _onCityResChange);
		m_g.regEvent(EVT.SELFALLIMEM_CHANGE, 0, m_this, _onSelfAllMemChange);
		m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemsChange);
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();		
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_initContributesOperateList();
		_initPreviewTabListTitleText();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.subscribedlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.subscribedlg, m_items);		
	};
	
	var _initContributesOperateList = function(){
		m_items.list.setItemCount(m_resNames.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			TQ.setTextEx(m_items.list.getItem(i).exsubs.resName, m_resNames[i]);
		}
	};
	
	var _initPreviewTabListTitleText = function(){
		for ( var i=0; i<rstr.alli.subscribedlg.tabs.length; ++i ) {
			var text = rstr.alli.subscribedlg.tabs[i];
			m_items.tablist.setTabText(i, text);
		}
	};
	
	var _setCallers = function(){
		_setContributeListCallers();
		_setTableListPageBarCallers();
	};
	
	var _setContributeListCallers = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.inum.setId(i);
			item.exsubs.inum.setLimit(_onGetResNumberLimit);
			
			item.exsubs.contributeBtn.setId(i);
			item.exsubs.contributeBtn.setCaller({self:m_this, caller:_onClickContributeBtn});
			
			if ( i < m_items.list.getCount() - 1) {
				item.exsubs.buyBtn.hide();
			} else {
				item.exsubs.buyBtn.show();
			}
			item.exsubs.buyBtn.setCaller({self:m_this, caller:_onClickBuyBtn});
		}
	};
	
	var _setTableListPageBarCallers = function(){
		for ( var i=0; i<m_items.tablist.getTabCount(); ++i ) {
			var pageBar = m_items.tablist.getTabItems(i).pageBar;
			pageBar.setId(i);
			pageBar.setCaller({self:m_this, caller:_onPageNavigate});
		}
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_selectFirstTab();
		_selectEachTabFirstPage();
		_showMyContributes();
		_updateCurHasCommRes();
	};
	
	var _selectFirstTab = function(){
		m_items.tablist.activeTab(0);
	};
	
	var _selectEachTabFirstPage = function(){
		for ( var i=0; i<m_items.tablist.getTabCount(); ++i ) {
			var pageBar = m_items.tablist.getTabItems(i).pageBar;
			pageBar.activePage(1, true);
		}		
	};
	
	var _showMyContributes = function(){
		var myContributes = m_g.getImgr().getMyAlliance().getSelfMember().getContributes();
		TQ.setTextEx(m_items.myContributes, myContributes);
	};
	
	var _updateCurHasCommRes = function(){
		var commRess = _getCommRess();
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var curHas = '';
			if ( i < m_items.list.getCount() - 1 ) {
				curHas = TQ.format(rstr.alli.subscribedlg.lbl.curHas, m_resNames[i], commRess[i]);
			} else {
				curHas = TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, m_resNames[i], commRess[i]);
				TQ.setTextEx ( item.exsubs.unitName, rstr.alli.subscribedlg.lbl.oneUnit );
			}
			TQ.setTextEx ( item.exsubs.curHas, curHas );
		}
	};
	
	var _onGetResNumberLimit = function(id){
		var commRess = _getCommRess();
		return {min:0, max:commRess[id]};
	};
	
	var _onClickContributeBtn = function(id){
		var item = m_items.list.getItem(id);
		var num = item.exsubs.inum.getVal();
		if ( num > 0 ) {
			AllianceSender.sendContributeRes(m_g, id, num);
			AllianceSender.sendGetTodaySortMems(m_g, m_items.tablist.getTabItems(0).pageBar.getCurPage());
			AllianceSender.sendGetAllSortMems(m_g, m_items.tablist.getTabItems(1).pageBar.getCurPage());
		}
	};
	
	var _onClickBuyBtn = function(){
		UIM.getDlg('buyitem').openDlg({id:0, resid:FIXID.ALLI_CARD, number:100000});
	};
	
	var _onPageNavigate = function(pageNo, tabIdx){
		if (tabIdx == C_TODAY_SORT_TAB) {
			AllianceSender.sendGetTodaySortMems(m_g, pageNo);
		} else {
			AllianceSender.sendGetAllSortMems(m_g, pageNo);
		}
	};
	
	var _onCityResChange = function(){
		if ( !_isShow() ) return;
		_updateCurHasCommRes();
	};	
	
	var _onSelfAllMemChange = function(){
		if ( !_isShow() ) return;
		_showMyContributes();
	};
	
	var _onItemsChange = function(){
		if ( !_isShow() ) return;
		_updateCurHasCommRes();
	};
	
	var _onSvrPkg = function(netevent){
		if ( !_isShow() ) return;
		_updateTodaySortTabList(netevent.data);
		_updateAllSortTabList(netevent.data);
	};
	
	var _updateTodaySortTabList = function(netdata){
		_updateSortTabList(0, netdata, _getStartRank(netdata), netdata.todaysortmems, {name:'name', res:'todayRes', card:'todayCard'});
	};
	
	var _updateAllSortTabList = function(netdata){
		_updateSortTabList(1, netdata, _getStartRank(netdata), netdata.allsortmems,  {name:'name', res:'totalRes', card:'totalCard'});
	};
	
	var _getStartRank = function(netdata){
		return (netdata.pageNo - 1)*C_PAGE_ITEMCOUNT + 1;
	};
	
	var _updateSortTabList = function(tabIdx, netdata,  startRank, sortmems, memTags){
		if (!sortmems) return;
		
		var items = m_items.tablist.getTabItems(tabIdx);
		items.pageBar.setPageCnt(netdata.pageCount);
		items.pageBar.activePage(netdata.pageNo, false, true);
		
		items.list.setItemCount(sortmems.length);
		for ( var i=0; i<items.list.getCount(); ++i ) {
			var item = items.list.getItem(i);
			var mem = sortmems[i];
			TQ.setTextEx(item.exsubs.rank, (startRank+i));
			TQ.setTextEx(item.exsubs.name, mem[ memTags.name ]);
			TQ.setTextEx(item.exsubs.res, mem[ memTags.res ] + rstr.alli.subscribedlg.lbl.wan);
			TQ.setTextEx(item.exsubs.card, mem[ memTags.card ]);
		}
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _getCommRess = function(){
		var commRes = m_g.getImgr().getCityRes().cres;
		var commRess = [commRes.food, commRes.wood, commRes.stone, commRes.iron];
		for ( var i=0; i<commRess.length; ++i ) {
			commRess[i] = Math.floor(commRess[i]/10000);
		}
		commRess.push(m_g.getImgr().getItemNumByResId(FIXID.ALLI_CARD));
		return commRess;
	};
	//AlliSubscribeDlg-unittest-end
});

AlliMemInfoDlg = Class.extern(function(){
	//AlliMemInfoDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_member = null;
	var m_alliPosDropList = [];
	var m_observer = function(){};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.setObserver = function(observer){
		m_observer = observer;
	};
	
	this.openDlg = function(member){
		_setParam(member);
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _setParam = function(member){
		m_member = member;
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.meminfodlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.meminfodlg, m_items);		
	};

	var _setCallers = function(){
		m_items.appointBtn.setCaller({self:m_this, caller:_onClickAppoint});
		m_items.fireBtn.setCaller({self:m_this, caller:_onClickFire});
		m_items.chatBtn.setCaller({self:m_this, caller:_onClickChat});
		m_items.mailBtn.setCaller({self:m_this, caller:_onClickMail});
		m_items.friendBtn.setCaller({self:m_this, caller:_onClickFriend});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_setMemberInfo();
		_setAlliPosDropList();
		_selectCurPosInDropList();
		_setAppointContainerVisible();
		_setFireBtnVisible();
	};
	
	var _setMemberInfo = function() {
		IMG.setBKImage ( m_items.icon, IMG.makeBigImg(m_member.icon));
		TQ.setTextEx ( m_items.name, m_member.name );
		TQ.setTextEx ( m_items.alliName, m_g.getImgr().getMyAlliance().getName() );
		TQ.setTextEx ( m_items.alliPos, rstr.alli.alliposs[m_member.alliPos] );
		TQ.setTextEx ( m_items.level, m_member.level );
		TQ.setTextEx ( m_items.roleRank, m_member.roleRank );
		TQ.setTextEx ( m_items.buildCurVal, m_member.buildCurVal );
		TQ.setTextEx ( m_items.contributes, m_member.contributes );
		var pos = FieldUtil.getPosByGridId(m_member.gridId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		TQ.setTextEx ( m_items.cood, HyperLinkMgr.formatLink(cood));
	};
	
	var _setAlliPosDropList = function(){
		m_items.alliPosDropList.deleteAllItem();
		m_alliPosDropList = [];
		var myAlliPos = m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if (myAlliPos == ALLI_POS.LEADER) {
			m_alliPosDropList = [ALLI_POS.ALEADER, ALLI_POS.ELDER, ALLI_POS.MEM];
		} else if ( myAlliPos == ALLI_POS.ALEADER) {
			m_alliPosDropList = [ALLI_POS.ELDER, ALLI_POS.MEM];
		}
		
		for ( var i=0; i<m_alliPosDropList.length; ++i ) {
			m_items.alliPosDropList.addItem({text:rstr.alli.alliposs[ m_alliPosDropList[i] ]});
		}
	};
	
	var _selectCurPosInDropList = function(){
		TQ.find(m_alliPosDropList, null, m_member.alliPos);
		m_items.alliPosDropList.setCurSel(TQ.getLastFindIdx());
	};
	
	var _setAppointContainerVisible = function(){
		var myAlliPos = m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if ( myAlliPos > m_member.alliPos && myAlliPos >= ALLI_POS.ALEADER) {
			TQ.setCSS(m_items.appointContainer, 'display', 'block');
		} else {
			TQ.setCSS(m_items.appointContainer, 'display', 'none');
		}
	};
	
	var _setFireBtnVisible = function(){
		var myAlliPos = m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if ( myAlliPos > m_member.alliPos ) {
			m_items.fireBtn.show();
		} else {
			m_items.fireBtn.hide();
		}
	};
	
	var _onClickAppoint = function(){
		var selectIdx = m_items.alliPosDropList.getCurSel();
		var selectAlliancePos = m_alliPosDropList[selectIdx];
		if ( selectAlliancePos == m_member.alliPos ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.meminfodlg.tip.noChangeAppoint);
			return;
		}
		
		var msg = TQ.format(rstr.alli.meminfodlg.tip.confirmAppoint, m_member.name, m_items.alliPosDropList.getTitle());
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendAppointMember(m_g, m_member.name, selectAlliancePos);
				m_observer();
			}
		}});
		m_dlg.hide();
	};
	
	var _onClickFire = function(){
		var msg = TQ.format(rstr.alli.meminfodlg.tip.confirmFire, m_member.name);
		m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendFireMember(m_g, m_member.name);
				m_observer();
			}
		}});
		m_dlg.hide();
	};
	
	var _onClickChat = function(){
		UIM.getPanel('chat').setChatTarget(m_member.name);
		m_dlg.hide();
	};
	
	var _onClickMail = function(){
		UIM.getDlg('writeletter').writeLetterTo(m_member.name);
		m_dlg.hide();
	};
	
	var _onClickFriend = function(){
		FriendSender.sendApplyFriend(m_g, m_member.name);
	};
	//AlliMemInfoDlg-unittest-end
});

AlliApplyListDlg = Class.extern(function(){
	//AlliApplyListDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_applys = [];
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
			title : rstr.alli.applylistdlg.title,
			pos : {x:'center', y:40} });
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.applylistdlg, m_items);
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateApplyList();
	};
	
	var _onSvrPkg = function(netevent){
		if ( !netevent.data.applys ) return;
		TQ.dictCopy(m_applys, netevent.data.applys);
		
		if ( m_dlg && m_dlg.isShow() ) {
			_updateApplyList();
		}
	};
	
	var _updateApplyList = function(){
		_setApplyListItems();
		_setApplyListBtnsCaller();
	};
	
	var _setApplyListItems = function(){
		m_items.list.setItemCount(m_applys.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var member = m_applys[i];
			TQ.setTextEx ( item.exsubs.name, member.roleName );
			TQ.setTextEx ( item.exsubs.level, member.level );
			TQ.setTextEx ( item.exsubs.buildVal, member.buildVal );
		}
	};
	
	var _setApplyListBtnsCaller = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.refuseBtn.setId(i);			
			item.exsubs.agreeBtn.setCaller({self:m_this, caller:_onClickAgreeBtn});
			item.exsubs.refuseBtn.setCaller({self:m_this, caller:_onClickRefuseBtn});
		}		
	};
	
	var _onClickAgreeBtn = function(id){
		AllianceSender.sendAgreeApply(m_g, m_applys[id].roleId);
	};
	
	var _onClickRefuseBtn = function(id){
		AllianceSender.sendIgnoreApply(m_g, m_applys[id].roleId);
	};
	//AlliApplyListDlg-unittest-end
});

AlliEventsDlg = Class.extern(function(){
	//AlliEventsDlg-unittest-start
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_events = [];

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.eventsdlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.eventsdlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.pageBar.setCaller({self:m_this, caller:_onPageNavigate});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_items.pageBar.activePage(1, true);
	};
	
	var _onPageNavigate = function(pageNo){
		AllianceSender.sendGetEvents(m_g, pageNo);
	};
	
	var _onSvrPkg = function(netevent){
		var events = netevent.data.events;
		if ( !events ) return;
		if ( !m_dlg || !m_dlg.isShow() ) return;
		
		m_items.pageBar.setPageCnt(events.pageCount);
		m_items.pageBar.activePage(events.pageNo, false, true);
		
		m_items.list.setItemCount(events.list.length);
		for ( var i=0; i<m_items.list.getCount(); i++ ){
			var item = m_items.list.getItem(i);
			var event = events.list[i];
			TQ.setTextEx(item.exsubs.desc, event.desc);
			TQ.setTextEx(item.exsubs.time, TQ.formatDateTime(event.time));
		}
	};
	//AlliEventsDlg-unittest-end
});

AlliMergeDlg = Class.extern(function(){
	//AlliMergeDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_applys = [];
		
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.mergedlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.mergedlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.applyMergeBtn.setCaller({self:m_this, caller:_onClickApplyMerge});
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		AllianceSender.sendGetApplyMerges(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		var applymerges = netevent.data.applymerges;
		if ( !applymerges ) return;
		if ( !m_dlg || !m_dlg.isShow() ) return;
		
		TQ.dictCopy(m_applys, applymerges);
		_setApplyMergeListItems();
		_setApplyMergeListBtnsCaller();
	};
	
	var _setApplyMergeListItems = function(){
		m_items.list.setItemCount(m_applys.length);
		for ( var i=0; i<m_items.list.getCount(); i++ ){
			var item = m_items.list.getItem(i);
			var apply = m_applys[i];
			TQ.setTextEx(item.exsubs.name, apply.name);
			TQ.setTextEx(item.exsubs.level, apply.level);
			TQ.setTextEx(item.exsubs.leader, apply.leader);
		}		
	};
	
	var _setApplyMergeListBtnsCaller = function(){
		for ( var i=0; i<m_items.list.getCount(); i++ ){
			var item = m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.refuseBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:m_this, caller:_onClickAgreeBtn});
			item.exsubs.refuseBtn.setCaller({self:m_this, caller:_onClickRefuseBtn});
		}			
	};
	
	var _onClickApplyMerge = function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.alli.mergedlg.lbl.applyMergeTip, JVALID.getMaxAlliLen());
		inputdlg.setCaller({self:m_this,caller:_onApplyMergeCallBack});		
	};
	
	var _onApplyMergeCallBack = function(name){
		if ( JVALID.checkAlliname(name) ){
			AllianceSender.sendApplyMerge(m_g, name);
		} else {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100116].msg);
		}
	};	
	
	var _onClickAgreeBtn = function(listIdx){
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.mergedlg.tip.confirmMerge, MB_F_YESNO
			,{self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendAgreeMerge(m_g, m_applys[listIdx].name);
			}
		}});
		m_dlg.hide();
	};
	
	var _onClickRefuseBtn = function(listIdx){
		AllianceSender.sendRefuseMerge(m_g, m_applys[listIdx].name);
	};
	//AlliMergeDlg-unittest-end
});



