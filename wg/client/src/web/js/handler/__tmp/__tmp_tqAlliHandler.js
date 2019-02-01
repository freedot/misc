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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_BTN_DELAY_MS = 1500;
	var C_APPLY_TAB_IDX = 0;
	var C_CREATE_TAB_IDX = 1;
	
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_dlg;
	_lc_.m_items = {};
	_lc_.m_invitelist = [];

	this._init = function(){
		_lc_.m_g = this.g_;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
		this._notifyOpenDlg();
	};
	
	this.sendApplyToSvr = function(name){
		AllianceSender.sendApplyJoin(_lc_.m_g, name);
		_lc_.m_g.getGUI().sysMsgTips(SMT_NORMAL, TQ.format(rstr.alli.detaildlg.sendapply, name));
	};
	
	this.isShow = function(){
		return _lc_._isShow();
	};
	
	this.hideDlg = function(){
		if (_lc_.m_dlg) _lc_.m_dlg.hide();
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
		_lc_._initInputs();
		_lc_._setBtnsDelayType();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.createdlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.createdlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_._getCtrl('listbtn').setCaller({self:_lc_.m_this, caller:_lc_._onClickAlliListBtn});
		_lc_._getCtrl('applybtn').setCaller({self:_lc_.m_this, caller:_lc_._onClickApplyBtn});
		_lc_._getCtrl('createbtn').setCaller({self:_lc_.m_this, caller:_lc_._onClickCreateBtn});
		_lc_._getCtrl('randbtn').setCaller({self:_lc_.m_this, caller:_lc_._onClickRandBtn});
	};
	
	_lc_._initInputs = function(){
		InputLimit.maxGBKBytes(_lc_._getCtrl('ialliname'), JVALID.getMaxAlliLen());
		InputLimit.maxGBKBytes(_lc_._getCtrl('icreatename'), JVALID.getMaxAlliLen());
		TQ.maxLength(_lc_._getCtrl('iflagname'), JVALID.getMaxAlliFlagLen());
	};
	
	_lc_._setBtnsDelayType = function(){
		_lc_._getCtrl('applybtn').setType(BTN_TYPE.DELAY);
		_lc_._getCtrl('applybtn').setDelay(_lc_.C_BTN_DELAY_MS);
		_lc_._getCtrl('createbtn').setType(BTN_TYPE.DELAY);
		_lc_._getCtrl('createbtn').setDelay(_lc_.C_BTN_DELAY_MS);
	};
	
	_lc_._showDlg = function() {
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		TQ.setTextEx(_lc_._getCtrl('alliname'), '');
		TQ.setTextEx(_lc_._getCtrl('needmoney'), res_create_alli_need_money);
		AllianceSender.sendGetCurApplying(_lc_.m_g);
		_lc_.m_items.tab.activeTab(0);
	};
	
	_lc_._onLoginOk = function(){
		AllianceSender.sendGetInviteList(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_lc_._handleCreateResult(netdata.create);
		_lc_._handleApplyInfo(netdata.applyinfo);
		_lc_._handleInviteInfo(netdata.inviteinfo);
	};
	
	_lc_._onClickAlliListBtn = function(){
		var dlg = UIM.getDlg('allilist');
		dlg.setCaller({self:_lc_.m_this, caller:_lc_._onSelectAlliance});
		dlg.openDlg(_lc_.m_g.getImgr().getStateCity());
	};
	
	_lc_._onSelectAlliance = function(name){
		_lc_._getCtrl('ialliname').value = name;
	};
	
	_lc_._onClickApplyBtn = function(){
		if ( !JVALID.checkAlliname(_lc_._getCtrl('ialliname').value) ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null);
		} else {
			_lc_.m_this.sendApplyToSvr(_lc_._getCtrl('ialliname').value);
		}
	};
	
	_lc_._onClickCreateBtn = function(){
		if ( !JVALID.checkAlliname(_lc_._getCtrl('icreatename').value) ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null);
			_lc_._getCtrl('icreatename').focus();
			return;
		}
		
		if ( !JVALID.checkAlliFlagName(_lc_._getCtrl('iflagname').value) ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.createdlg.tips.invalidalliflag, MB_F_CLOSE, null);
			_lc_._getCtrl('iflagname').focus();
			return;
		}
	
		AllianceSender.sendCreateAlli(_lc_.m_g, _lc_._getCtrl('icreatename').value, _lc_._getCtrl('iflagname').value);
	};
	
	_lc_._onClickRandBtn = function(){
		_lc_._getCtrl('iflagname').value = _lc_._getRandHZ();
	};
	
	_lc_._onClickAgreeInvite = function(idx){
		var res = _lc_.m_invitelist[idx];
		AllianceSender.sendAgreeInvite(_lc_.m_g, res.roleId, res.alliId);
	};
	
	_lc_._onClickIgnoreInvite = function(idx){
		var res = _lc_.m_invitelist[idx];
		AllianceSender.sendIgnoreInvite(_lc_.m_g, res.roleId, res.alliId);
	};
	
	_lc_._handleApplyInfo = function(applyinfo){
		if ( !applyinfo ) return;
		if ( !applyinfo.alli ) return;
		if (!_lc_._isShow() ) return;
		
		TQ.setTextEx(_lc_._getCtrl('alliname'), applyinfo.alli);
	};	
	
	_lc_._handleCreateResult = function(create){
		if ( !create ) return;
		if (!_lc_._isShow() ) return;
		
		if ( create.result == 0 ) {
			_lc_.m_g.getImgr().getRoleRes().allipos = create.allipos;
			_lc_.m_g.getGUI().sysMsgTips(SMT_SUCCESS, rstr.alli.createdlg.tips.createalliok);
			_lc_._hideDlg();
			UIM.getDlg('alli').openDlg();
		}
	};
	
	_lc_._handleInviteInfo = function(inviteinfo){
		if (!inviteinfo) return;
		
		TQ.dictCopy(_lc_.m_invitelist, inviteinfo);
		if (!_lc_._isShow()) {
			if ( _lc_.m_invitelist.length > 0 ) {
				UIM.getPanel('main').getToolbar().startAllianceBlinking(10000);
			}
			return;
		}
		
		var list = _lc_._getCtrl('invitelist');
		_lc_._setInviteListItems(list);
		_setInviteListItemsBtnCaller(list);
	};
	
	_lc_._setInviteListItems = function(list){
		list.setItemCount(_lc_.m_invitelist.length);
		for ( var i=0; i<_lc_.m_invitelist.length; ++i ) {
			var res = _lc_.m_invitelist[i];
			var item = list.getItem(i);
			TQ.setTextEx(item.exsubs.desc, HyperLinkMgr.formatLink(res.desc));
		}
	};
	
	var _setInviteListItemsBtnCaller = function(list){
		for (var i=0; i<list.getCount(); ++i) {
			var item = list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.ignoreBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAgreeInvite});
			item.exsubs.ignoreBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickIgnoreInvite});
		}
	};
	
	_lc_._hideDlg = function(){
		if ( _lc_.m_dlg ) {
			_lc_.m_dlg.hide();
		}
	};
	
	_lc_._getCtrl = function(ctrlName){
		var applyItems = _lc_.m_items.tab.getTabItems(C_APPLY_TAB_IDX);
		var createItems = _lc_.m_items.tab.getTabItems(C_CREATE_TAB_IDX);
		if (applyItems[ctrlName]) {
			return applyItems[ctrlName]; 
		} else { 
			return createItems[ctrlName];
		}
	};
	
	_lc_._getRandHZ = function(){
		eval( "var word=" +  '"\\u' + (Math.round(Math.random() * 20901) + 19968).toString(16)+'"');
		return word;
	};
	//AlliCreateDlg-unittest-end
});

AlliListDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
    _lc_.m_g = null;
    _lc_.m_this = null;
    _lc_.m_dlg = null;
    _lc_.m_items = {};
	_lc_.m_cityResId = 0;
	_lc_.m_templ = null;
	var m_caller = null;

	this.init = function(g){
		_lc_._init(this, g);
    };
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
    this.openDlg = function(cityResId){
		_lc_._initParams(cityResId);
        _lc_._initDlg();
		_lc_._showDlg();
        _lc_._initInfo();
    };
	
	this.isShow = function(){
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._init = function(THIS, g){
		_lc_.m_this = THIS;
		_lc_.m_g = g;
	};
	
	_lc_._initParams = function(cityResId){
		_lc_.m_cityResId = cityResId;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._createDlgByTempl();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.listdlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.allilistdlg, _lc_.m_items);
	};
	
	_lc_._createDlgByTempl = function(){
		_lc_.m_templ = AlliListDlgTempl.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.container, 'join');
	};
	
	_lc_._setCallers = function(){
		_lc_.m_templ.setCaller({self:_lc_.m_this, caller:_lc_._onClickJoinBtn});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_templ.openDlg(_lc_.m_cityResId);
	};	
	
	_lc_._onClickJoinBtn = function(allianceName){
		if ( m_caller ) {
			m_caller.caller.call(m_caller.self, allianceName);
			_lc_.m_dlg.hide();
		}
	};
	//AlliListDlg-unittest-end
});

AlliListDlgTempl = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	var m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_cityResId = 0;
	_lc_.m_flag = 'rank'; // rank or join
	_lc_.m_alliancesRes = [];
	var m_caller = null;
	_lc_.m_pageBar = null;
		
	this.init = function(g, dlg, parentItem, flag){
		_lc_._init(this, g, dlg, flag);
		_lc_._createItems(parentItem);
		_lc_._createPageBar();
		_regEvents();
	};
	
	// set click join button caller
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.openDlg = function(cityResId){
		_openInit(cityResId);
		_lc_.m_items.pageBar.activePage(1, true);
	};
	
	// callback for pageBar
	this.onPageBarClickSearch = function(name){ 
		if ( name == '' ) {
			return;
		}
		
		if ( !JVALID.checkAlliname(name) ){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.listdlg.tip.invalidalli);
			return;
		}
		
		AllianceSender.sendSearchAlliance(_lc_.m_g, _lc_.m_cityResId, name);
	};
	
	// callback for pageBar
	this.onPageBarClickGetSelf = function(){ 
		if (!_lc_.m_g.getImgr().isInAlliance()) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.listdlg.tip.selfNoInAlli);
			return;
		}
		AllianceSender.sendSearchAlliance(_lc_.m_g, _lc_.m_cityResId, _lc_.m_g.getImgr().getAllianceName());
	};
	
	// callback for pageBar
	this.onPageNavigate = function(pageNo){
		AllianceSender.sendGetAlliList(_lc_.m_g, _lc_.m_cityResId, pageNo);
	};
	
	_lc_._init = function(THIS, g, dlg, flag){
		_lc_.m_this = THIS;
		_lc_.m_g = g;
		m_dlg = dlg;
		_lc_.m_flag = flag;
	};
	
	_lc_._createItems= function(parentItem){
		var templs = uicfg.alli.allilistdlg.t_;
		var templ = templs[0];
		_lc_.m_g.getGUI().buildDomItems(parentItem, templ, templs, _lc_.m_items);
	};
	
	_lc_._createPageBar = function(){
		_lc_.m_pageBar = RankPageBar.snew(_lc_.m_g, rstr.alli.listdlg.lbl.searchalli, JVALID.getMaxAlliLen(), _lc_.m_items.pageBarCon, _lc_.m_items);
		_lc_.m_pageBar.regObServer(_lc_.m_this);
	};
	
	var _regEvents = function(){
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _onSvrPkg);
	};
	
	var _openInit = function(cityResId){
		_lc_.m_cityResId = cityResId;
	};
	
	_lc_._setAllianceListItems = function(talliances){
		var alliances = _collectAlliances(talliances);
		_lc_.m_items.list.setItemCount(alliances.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
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
	
	_lc_._setAllianceListItemBtnsVisible = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			if ( _lc_.m_flag == 'join' ) {
				item.exsubs.joinBtn.show();
			} else {
				item.exsubs.joinBtn.hide();
			}
		}
	};
	
	_lc_._setAllianceListItemBtnsCaller = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSeeBtn});
			item.exsubs.joinBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickJoinBtn});
		}
	};
	
	_lc_._setCurSelectItem = function(curSelIdx){
		if ( isNull(curSelIdx) ) {
			_lc_.m_items.list.setCurSel(-1);
		} else {
			_lc_.m_items.list.setCurSel(curSelIdx);
		}
	};
	
	_lc_._onClickSeeBtn = function(idx){
		var alliance = _lc_.m_alliancesRes[idx];
		AllianceSender.sendGetAllianceDetail(_lc_.m_g, alliance.name);
	};
	
	_lc_._onClickJoinBtn = function(idx){
		if ( m_caller ) {
			var alliance = _lc_.m_alliancesRes[idx];
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
		if (netdata.cityResId != _lc_.m_cityResId) return;
		
		_lc_.m_alliancesRes = netdata.alliances;
		_lc_.m_pageBar.setPageBarNoActive(netdata.pageNo, netdata.pageCount);
		_lc_._setAllianceListItems(_lc_.m_alliancesRes);
		_lc_._setAllianceListItemBtnsVisible();
		_lc_._setAllianceListItemBtnsCaller();
		_lc_._setCurSelectItem(netdata.curSelIdx);
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_detail = null;

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.hideDlg = function(){
		if (_lc_.m_dlg) _lc_.m_dlg.hide();
	};
	
	_lc_._openDlg = function(detail){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo(detail);
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.detaildlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.allidetail, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.applybtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickApplyBtn});
		_lc_.m_items.membtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMemBtn});
	};

	_lc_._initInfo = function(detail){
		_lc_.m_detail = detail;
		
		var tags = ['name', 'level', 'flag', 'leader', 'mem', 'buildVal', 'card', 'honour'];
		for ( var i=0; i<tags.length; ++i ) {
			var tag = tags[i];
			TQ.setTextEx(_lc_.m_items[tag], _lc_.m_detail[tag]);
		}
		
		TQ.setTextEx(_lc_.m_items.introduction.getContainerObj(), _lc_.m_detail.introduction);
		var cityres = ItemResUtil.findItemres(_lc_.m_detail.cityResId);
		IMG.setBKImage(_lc_.m_items.cityFlag,IMG.makeSmallStateCityFlag(cityres.flagimg));
	};
	
	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (!netdata.detail) return;
		
		_lc_._openDlg(netdata.detail);
	};
	
	_lc_._onClickApplyBtn = function(){
		UIM.getDlg('allicreate').sendApplyToSvr(_lc_.m_detail.name);
	};
	
	_lc_._onClickMemBtn = function(){
		if ( _lc_.m_g.getImgr().isSameAllianceByName(_lc_.m_detail.name) ) {
			UIM.getDlg('selfallimemlist').openDlg();
		} else {
			UIM.getDlg('otherallimemlist').openDlg(_lc_.m_detail.name);
		}
	};
	//AlliDetailDlg-unittest-end
});

SelfAlliMemListDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_MIN_NOLOGIN_DAYS = 3;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_selfmems = [];
	
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
    };
	
    this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
    };
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.selfmemlistdlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.selfmemlist, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.pageBar.setCaller({self:_lc_.m_this, caller:_lc_._onPageNavigate});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_items.pageBar.activePage(1, true);
	};
	
	_lc_._onSvrPkg = function(netevent){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		if (!netevent.data.selfmems) return;
		
		_lc_.m_selfmems = netevent.data.selfmems;
		_setPageBar(netevent.data.pageNo, netevent.data.pageCount);
		_updateListItems();
		_setListItemBtnsCaller();
	};
	
	var _setPageBar = function(pageNo, pageCount){
		_lc_.m_items.pageBar.setPageCnt(pageCount);
		_lc_.m_items.pageBar.activePage(pageNo, false, true);
	};
	
	var _updateListItems = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_selfmems.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var mem = _lc_.m_selfmems[i];
			TQ.setTextEx(item.exsubs.name, mem.name);
			TQ.setTextEx(item.exsubs.alliPos, rstr.alli.alliposs[mem.alliPos]);
			TQ.setTextEx(item.exsubs.roleRank, mem.roleRank);
			TQ.setTextEx(item.exsubs.level, mem.level);
			TQ.setTextEx(item.exsubs.buildCurVal, mem.buildCurVal);
			TQ.setTextEx(item.exsubs.contributes, mem.contributes);
			TQ.setTextEx(item.exsubs.state, _getMemState(mem.loginTime));
			TTIP.setCallerData(item.exsubs.tooltips['$alliPos'], {self:_lc_.m_this, caller:_onGetAlliPosTip}, {idx:i});
			item.exsubs.seeBtn.setId(i);
		}
	};
	
	var _setListItemBtnsCaller = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSeeBtn});
		}
	};
	
	var _getMemState = function(loginTime){
		if (loginTime == 0) return '--';
		
		var noLoginDays = Math.floor((_lc_.m_g.getSvrTimeS() - loginTime)/(24*3600));
		if (noLoginDays < C_MIN_NOLOGIN_DAYS) return '--';
		
		return TQ.format(rstr.alli.selfmemlistdlg.tip.noLoginDays, noLoginDays);
	};
	
	var _onGetAlliPosTip = function(data){
		return TIPM.makeItemTip( rstr.alli.allipostips[_lc_.m_selfmems[data.idx].alliPos] );
	};
	
	_lc_._onPageNavigate = function(pageNo){
		AllianceSender.sendGetSelfMems(_lc_.m_g, pageNo);
	};
	
	_lc_._onClickSeeBtn = function(idx){
		var dlg = UIM.getDlg('allimeminfo');
		dlg.openDlg(_lc_.m_selfmems[idx]);
		dlg.setObserver(_lc_._onMemberChange);
	};
	
	_lc_._onMemberChange = function(){
		AllianceSender.sendGetSelfMems(_lc_.m_g, _lc_.m_items.pageBar.getCurPage());
	};
	//SelfAlliMemListDlg-unittest-end
});

OtherAlliMemListDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_mems = [];
	var m_cityResId = 0;
	var m_allianceName = '';
		
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
    };
	
    this.openDlg = function(allianceName){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo(allianceName);
    };
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();		
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.othermemlistdlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.othermemlist, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.pageBar.setCaller({self:_lc_.m_this, caller:_lc_._onPageNavigate});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(allianceName){
		m_allianceName = allianceName;
		_lc_.m_items.pageBar.activePage(1, true);
	};
	
	_lc_._onSvrPkg = function(netevent){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		if (!netevent.data.mems) return;
		
		_lc_.m_mems = netevent.data.mems;
		m_cityResId = netevent.data.cityResId;
		_setPageBar(netevent.data.pageNo, netevent.data.pageCount);
		_updateListItems();
		_setListItemBtnsCaller();
		_setListItemBtnsEnable();
	};
	
	var _setPageBar = function(pageNo, pageCount){
		_lc_.m_items.pageBar.setPageCnt(pageCount);
		_lc_.m_items.pageBar.activePage(pageNo, false, true);
	};
	
	var _updateListItems = function(){
		var cityRes = ItemResUtil.findItemres(m_cityResId);
		IMG.setBKImage(_lc_.m_items.cityFlag, IMG.makeSmallStateCityFlag(cityRes.flagimg));
		
		_lc_.m_items.list.setItemCount(_lc_.m_mems.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var mem = _lc_.m_mems[i];
			
			TQ.setTextEx(item.exsubs.name, mem.name);
			TQ.setTextEx(item.exsubs.alliPos, rstr.alli.alliposs[mem.alliPos]);
			TQ.setTextEx(item.exsubs.roleRank, mem.roleRank);
			TQ.setTextEx(item.exsubs.level, mem.level);
			
			var fightRefState = _lc_.m_g.getImgr().getFightRefState(mem.roleId);
			TQ.setTextEx(item.exsubs.state, rstr.field.rolecitydlg.lbl.refstate[fightRefState]);
			
			var pos = FieldUtil.getPosByGridId(mem.gridId);
			var cood = '#[m:' + pos.x + ':' + pos.y + ']';
			TQ.setTextEx(item.exsubs.cood, HyperLinkMgr.formatLink(cood));
			
			var dis = Math.round(ExpedTargetUtil.getDistance(_lc_.m_g, pos));
			TQ.setTextEx(item.exsubs.distance, dis);
			
			TTIP.setCallerData(item.exsubs.tooltips['$alliPos'], {self:_lc_.m_this, caller:_onGetAlliPosTip}, {idx:i});
			
			item.exsubs.seeBtn.setId(i);
			item.exsubs.declareBtn.setId(i);
		}
	};
	
	var _setListItemBtnsCaller = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.seeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSeeBtn});
			item.exsubs.declareBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickDeclareBtn});
		}
	};
	
	var _setListItemBtnsEnable = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var mem = _lc_.m_mems[i];
			var fightRefState = _lc_.m_g.getImgr().getFightRefState(mem.roleId);
			item.exsubs.declareBtn.enable(fightRefState == REF_ROLESTATE.NORMAL);
		}
	};
	
	var _onGetAlliPosTip = function(data){
		return TIPM.makeItemTip( rstr.alli.allipostips[_lc_.m_mems[data.idx].alliPos] );
	};
	
	_lc_._onPageNavigate = function(pageNo){
		AllianceSender.sendGetOtherMems(_lc_.m_g, m_allianceName, pageNo);
	};
	
	_lc_._onClickSeeBtn = function(idx){
		var mem = _lc_.m_mems[idx];
		var field = {gridId:mem.gridId, objType:OBJ_TYPE.ROLE, roleId:mem.roleId, roleName:mem.name, alliance:{uid:-1,name:'alliance'}};
		UIM.getDlg('rolecitymodal').openDlg(field);
	};
	
	_lc_._onClickDeclareBtn = function(idx){
		var mem = _lc_.m_mems[idx];
		var fightRefState = _lc_.m_g.getImgr().getFightRefState(mem.roleId);
		if (fightRefState == REF_ROLESTATE.NORMAL){
			MilitarySender.sendDeclareFight(_lc_.m_g, mem.roleId);
		}
	};
	//OtherAlliMemListDlg-unittest-end
});

AlliMainDlg = ListenerBaseDlg.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_TAB_INFO_IDX = 0;
	var C_TAB_LAWLIGHT_IDX = 1;
	var C_TAB_AUCTION_IDX = 2;
	
    _lc_.m_g = null;
    _lc_.m_this = null;
    _lc_.m_dlg = null;
    _lc_.m_items = {};
	_lc_.m_basePanel = null;
    _lc_.m_lawLightPanel = null;
	_lc_.m_auctionPanel = null;

    this._init = function(){
		_initParams(this, this.g_);
		 _lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
    };
	
    this.openDlg = function(tabIdx){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo(tabIdx);
		this._notifyOpenDlg();
    };
	
	this.isShow = function(){
		if ( !_lc_.m_dlg ) return false;
		return _lc_.m_dlg.isShow();
	};
	
	this.hideDlg = function(){
		if (_lc_.m_dlg) _lc_.m_dlg.hide();
	};
	
	
	var _initParams = function(THIS, g){
        _lc_.m_g = g;
        _lc_.m_this = THIS;
		_lc_.m_basePanel = NullAlliMainPanel.snew();
		_lc_.m_lawLightPanel = NullAlliMainPanel.snew();
		_lc_.m_auctionPanel = NullAlliMainPanel.snew();
	};	
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
		_lc_._initPanels();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.main.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.maindlg, _lc_.m_items);			
	};
	
	_lc_._setCallers = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_lc_._onDlgEvent});
	};
	
	_lc_._initPanels = function(){
		_lc_.m_basePanel = AlliMainBasePanel.snew(_lc_.m_g, _lc_.m_items.tablist.getTabItems(C_TAB_INFO_IDX));
		_lc_.m_lawLightPanel = AlliMainLawLightPanel.snew(_lc_.m_g, _lc_.m_items.tablist.getTabItems(C_TAB_LAWLIGHT_IDX));
		_lc_.m_auctionPanel = AlliMainAuctionPanel.snew(_lc_.m_g, _lc_.m_items.tablist.getTabItems(C_TAB_AUCTION_IDX));
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
		_lc_.m_basePanel.show();
		_lc_.m_lawLightPanel.show();
		_lc_.m_auctionPanel.show();
	};
	
	_lc_._initInfo = function(tabIdx){
		AllianceSender.sendGetMyAllianceDetail(_lc_.m_g);
		_lc_.m_items.tablist.activeTab(tabIdx ? tabIdx : 0);
	};
	
	_lc_._onSvrPkg  = function(netevent){
		var netdata = netevent.data;
		_onSvrPkgBaseinfo(netdata.mydetail);
		_onSvrPkgLawLightInfo(netdata.lawlight);
		_onSvrPkgAuction(netdata.auction);
		_onSvrPkgSelfMember(netdata.selfmem);
		_onSvrPkgMySellingItems(netdata.sellingItems);
	};	
	
	var _onSvrPkgBaseinfo = function(mydetail){
		if ( !mydetail ) return;
		
		_lc_.m_g.getImgr().getMyAlliance().copyDetail(mydetail);
		_lc_.m_g.sendEvent({eid:EVT.SELFALLI_DETAIL, sid:0});
		_update();
	};
	
	var _onSvrPkgLawLightInfo = function(lawlight){
		if ( !lawlight ) return;
		
		_lc_.m_g.getImgr().getMyAlliance().copyLawLight(lawlight);
		_update();
	};
	
	var _onSvrPkgAuction = function(auction) {
		if ( !auction ) return;
		
		_lc_.m_g.getImgr().getMyAlliance().copyAuction(auction);
		_update();
	};
	
	var _onSvrPkgSelfMember = function(selfMember){
		if ( !selfMember ) return;
		
		_lc_.m_g.getImgr().getMyAlliance().copySelfMember(selfMember);
		_lc_.m_g.sendEvent({eid:EVT.SELFALLIMEM_CHANGE, sid:0});
		_update();
	};
	
	var _onSvrPkgMySellingItems = function(sellingItems){
		if ( !sellingItems ) return;
		_lc_.m_g.getImgr().copySellingItems(sellingItems);
		_lc_.m_g.sendEvent({eid:EVT.SELLING_ITEMS, sid:0});
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ) {
			_lc_.m_basePanel.hide();
			_lc_.m_lawLightPanel.hide();
			_lc_.m_auctionPanel.hide();
		}
	};
	
	var _update = function(){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		_lc_.m_basePanel.update();
		_lc_.m_lawLightPanel.update();
		_lc_.m_auctionPanel.update();
	};
	
	//AlliMainDlg-unittest-end
});

NullAlliMainPanel = Class.extern(function(){
	this.show = function(){};
	this.hide = function(){};
	this.update = function(){};
});

AlliMainBasePanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var CMD_TRANSFER_LEADER = 0;
	var CMD_APPOINT_ALEADER = 1;
	var CMD_APPOINT_ELDER = 2;
	var CMD_FIRE_ALEADER = 3;
	var CMD_FIRE_ELDER = 4;
	var CMD_KICK = 5;
	var CMD_TALK = 6;
	var CMD_LETTER = 7;

	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_items = {};
	var m_opmenu = null;
	var m_curmemidx = 0;
	
	this.init = function(g, uiitem){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_items = uiitem;
		_setCallers();
	};
	
	this.show = function(){
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
	};
	
	this.hide = function(){
		_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
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
		_lc_.m_items.upgradeLevelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickUpgrade});
		_lc_.m_items.transferBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickTransfer});
		_lc_.m_items.seeMemsBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMemList});
		_lc_.m_items.subscribeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSubscribe});
		_lc_.m_items.modifyQQGroupBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickModifyQQ});
		
		_lc_.m_items.inviteBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickInvite});
		_lc_.m_items.agreeApplyBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAgreeApply});
		_lc_.m_items.showEventBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickEvent});
		_lc_.m_items.mergeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMerge});
		_lc_.m_items.dismissBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickDismiss});
		_lc_.m_items.quitBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickQuit});
		
		_lc_.m_items.modifyIntroduceBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickModifyIntroduce});
		_lc_.m_items.modifyBulletinBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickModifyBulletin});
		
		_lc_.m_items.upgradeBar.setShowFlag(PROGBAR_SHOWFLAG_CUSTOM);
		_lc_.m_items.upgradeBar.setCustomValCaller({self:_lc_.m_this, caller:_lc_._onGetFomartLeftTime});
		
		_lc_.m_items.transferOrDismissBar.setShowFlag(PROGBAR_SHOWFLAG_CUSTOM);
		_lc_.m_items.transferOrDismissBar.setCustomValCaller({self:_lc_.m_this, caller:_lc_._onGetFomartLeftTime});
		
		TTIP.setCallerData(_lc_.m_items.tooltips['$honour'], {self:_lc_.m_this, caller:_onGetHonourTip},{});
		TTIP.setCallerData(_lc_.m_items.tooltips['$buildVal'], {self:_lc_.m_this, caller:_onGetBuildValTip},{});
		TTIP.setCallerData(_lc_.m_items.tooltips['$card'], {self:_lc_.m_this, caller:_onGetCardTip},{});
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
			var isValidAlliPos = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos() >= needAlliPos;
			_lc_.m_items[btnName].enable(isValidAlliPos);
		}
	};
	
	var _setUpgradeBtnEnableState = function(){
		if ( _lc_.m_items.upgradeLevelBtn.isEnable() ) {
			var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
			_lc_.m_items.upgradeLevelBtn.enable(!myAlliance.isUpgradingAlliance() && !myAlliance.isFullLevel());
		}
	};
	
	var _setBtnsVisibleByAlliPos = function(){
		var btnsNeedAlliPos = {
			'modifyIntroduceBtn':ALLI_POS.LEADER
			,'modifyBulletinBtn':ALLI_POS.LEADER
		};
		
		for ( var btnName in btnsNeedAlliPos ) {
			var needAlliPos = btnsNeedAlliPos[btnName];
			var isValidAlliPos = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos() >= needAlliPos;
			if (isValidAlliPos) {
				_lc_.m_items[btnName].show();
			} else {
				_lc_.m_items[btnName].hide();
			}
		}		
	};
	
	var _setBarContainersVisible = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setCSS(_lc_.m_items.upgradeBarContainer, 'display', myAlliance.isUpgradingAlliance() ? 'block' : 'none' );
		TQ.setCSS(_lc_.m_items.transferBarContainer, 'display', ( myAlliance.isTransfering() || myAlliance.isDismissing() ) ? 'block' : 'none' );
		
	};
	
	var _setBarLabel = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx ( _lc_.m_items.transferOrDismissLbl, myAlliance.isDismissing() ? rstr.alli.main.lbl.dismissBar : rstr.alli.main.lbl.transferBar );
	};
	
	var _setBtnText = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		_lc_.m_items.dismissBtn.setText(myAlliance.isDismissing() ? rstr.alli.main.btn.undismiss : rstr.alli.main.btn.dismiss);
	};
	
	var _updateBaseInfo = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx( _lc_.m_items.name, myAlliance.getName() );
		TQ.setTextEx( _lc_.m_items.cityName, ItemResUtil.findItemres(myAlliance.getCityResId()).name );
		TQ.setTextEx( _lc_.m_items.alliFlag, myAlliance.getAlliFlag() );
		TQ.setTextEx( _lc_.m_items.rank, myAlliance.getRank() );
		TQ.setTextEx( _lc_.m_items.honour, RStrUtil.formatResNumStr(myAlliance.getHonour()) );
		TQ.setTextEx( _lc_.m_items.level, myAlliance.getLevel() );
		TQ.setTextEx( _lc_.m_items.leader, myAlliance.getLeader() );
		TQ.setTextEx( _lc_.m_items.mem, myAlliance.getMemCount() + '/' + _getCurLevelRes().memmaxcount );
		
		TQ.setTextEx( _lc_.m_items.buildVal, RStrUtil.formatResNumStr(myAlliance.getBuildVal()) );
		TQ.setTextEx( _lc_.m_items.card, RStrUtil.formatResNumStr(myAlliance.getCardNumber()) );
		TQ.setTextEx( _lc_.m_items.qqGroup, myAlliance.getQQGroup() );
		TQ.setRichText( _lc_.m_items.introduction.getContainerObj(), TQ.decodeMessage(myAlliance.getIntroduction()) );
		TQ.setRichText( _lc_.m_items.bulletin.getContainerObj(), TQ.decodeMessage(myAlliance.getBulletin()) );
		_lc_.m_items.introduction.refresh();
		_lc_.m_items.bulletin.refresh();
	};
	
	var _updateBars = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		
		_updateBar('upgradeBar', myAlliance.getUpgradeStartTime(), myAlliance.getUpgradeStopTime());
		_updateBar('transferOrDismissBar', myAlliance.getDismissStartTime(), myAlliance.getDismissStopTime());
		_updateBar('transferOrDismissBar', myAlliance.getTransferStartTime(), myAlliance.getTransferStopTime());
	};
	
	var _updateBar = function(barName, startTime, stopTime){
		if (stopTime == 0) return;
		
		var maxVal = stopTime - startTime;
		var curVal = _lc_.m_g.getSvrTimeS() - startTime;
		var curVal = Math.min(maxVal, curVal);
		_lc_.m_items[barName].setRange(maxVal);
		_lc_.m_items[barName].setValue(0, curVal);
	};
	
	_lc_._onUpdate = function(){
		_updateBars();
	};
	
	_lc_._onClickUpgrade = function(){
		if ( _getNextLevelRes().needbuildval > _lc_.m_g.getImgr().getMyAlliance().getBuildVal() ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, TQ.format(rstr.ids[100118].msg, _getNextLevelRes().needbuildval) );
			return;
		}
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.alli.main.tip.confirmUpgradeAlli
			,MB_F_YESNO
			,{self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendUpgradeAlliance(_lc_.m_g);
				}
			}});
	};
	
	var _getNextLevelRes = function(){
		return _getLevelRes(_lc_.m_g.getImgr().getMyAlliance().getLevel() + 1);
	};
	
	var _getCurLevelRes = function(){
		return _getLevelRes(_lc_.m_g.getImgr().getMyAlliance().getLevel());
	};
	
	var _getLevelRes = function(level){
		var levelIdx = level - 1;
		return res_alli_upd_needs[levelIdx];
	};
	
	_lc_._onClickTransfer = function(){
		if (_lc_.m_g.getImgr().getMyAlliance().isDismissing()){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100119].msg);
		} else if (_lc_.m_g.getImgr().getMyAlliance().isTransfering()){
			UIM.getDlg('alliuntransfer').openDlg();
		} else {
			UIM.getDlg('allitransfer').openDlg();
		}
	};
	
	_lc_._onClickMemList = function(){
		UIM.getDlg('selfallimemlist').openDlg();
	};
	
	_lc_._onClickSubscribe = function(){
		UIM.getDlg('allisubscribe').openDlg();
	};
	
	_lc_._onClickModifyQQ = function(){
		var inputdlg = UIM.getDlg('inputnumex');
		inputdlg.openDlg(rstr.alli.main.lbl.inputQQGroup, 99999999999);
		inputdlg.setNumber(_lc_.m_g.getImgr().getMyAlliance().getQQGroup());
		inputdlg.setCaller({self:_lc_.m_this, caller:_lc_._onQQGroupCallBack});
	};
	
	_lc_._onQQGroupCallBack = function(qqGroup){
		AllianceSender.sendModifyQQGroup(_lc_.m_g, qqGroup);
	};
	
	_lc_._onClickInvite = function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.alli.main.lbl.inputInviteName, JVALID.getMaxUserLen());
		inputdlg.setCaller({self:_lc_.m_this,caller:_lc_._onInviteCallBack});		
	};
	
	_lc_._onInviteCallBack = function(name){
		if ( JVALID.checkUsername(name) ){
			AllianceSender.sendInvite(_lc_.m_g, name);
		}
		else{
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100050].msg);
		}
	};
	
	_lc_._onClickAgreeApply = function(){
		UIM.getDlg('alliapplylist').openDlg();
	};
	
	_lc_._onClickEvent = function(){
		UIM.getDlg('allievents').openDlg();
	};
	
	_lc_._onClickMerge = function(){
		UIM.getDlg('allimerge').openDlg();
	};
	
	_lc_._onClickDismiss = function(){
		if (_lc_.m_g.getImgr().getMyAlliance().isTransfering()){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100120].msg);
		} else if (_lc_.m_g.getImgr().getMyAlliance().isDismissing()){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmUnDismissAlli, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendCancelDismiss(_lc_.m_g);
				}
			}});
		} else {
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmDismissAlli, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendDismiss(_lc_.m_g);
				}
			}});
		}
	};
	
	_lc_._onClickQuit = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		if (myAlliance.getSelfMember().getAlliPos() == ALLI_POS.LEADER) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100121].msg);
		} else {
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.main.tip.confirmExitAlli, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ){
					AllianceSender.sendExitAlliance(_lc_.m_g);
				}
			}});
		}
	};
	
	_lc_._onClickModifyIntroduce = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		var inputdlg = UIM.getDlg('inputareatext');
		inputdlg.openDlg(rstr.alli.main.lbl.modifyIntroduce, TQ.decodeMessageForText(myAlliance.getIntroduction()), rstr.alli.main.lbl.introduceDesc, JVALID.getMaxAllianceIntroduceGBKBytes() );
		inputdlg.setCaller({self:_lc_.m_this, caller:_lc_._onModifyIntroduceCallBack});
	};
	
	_lc_._onModifyIntroduceCallBack = function(text){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		var originalIntr = TQ.decodeMessageForText(myAlliance.getIntroduction());
		if ( text != originalIntr ){
			AllianceSender.sendModifyIntroduce(_lc_.m_g, text);
		}
	};
	
	_lc_._onClickModifyBulletin = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		var inputdlg = UIM.getDlg('inputareatext');
		inputdlg.openDlg(rstr.alli.main.lbl.modifyBulletin, TQ.decodeMessageForText(myAlliance.getBulletin()), rstr.alli.main.lbl.bulletinDesc, JVALID.getMaxAllianceBulletinGBKBytes() );
		inputdlg.setCaller({self:_lc_.m_this, caller:_lc_._onModifyBulletinCallBack});
	};
	
	_lc_._onModifyBulletinCallBack = function(text){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		var originalBulletin = TQ.decodeMessageForText(myAlliance.getBulletin());
		if ( text != originalBulletin ){
			AllianceSender.sendModifyBulletin(_lc_.m_g, text);
		}
	};
	
	_lc_._onGetFomartLeftTime = function(curVal, range){
		return TQ.formatTime(0, range - curVal);
	};
	
	var _onGetHonourTip = function(data){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		return myAlliance.getHonour().toString();
	};
	
	var _onGetBuildValTip = function(data){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		return myAlliance.getBuildVal().toString();
	};
	
	var _onGetCardTip = function(data){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_items = {};
	var m_util = null;
	
	this.init = function(g, uiitem){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_items = uiitem;
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
		var selfMember = _lc_.m_g.getImgr().getMyAlliance().getSelfMember();
		_lc_.m_items.getResBtn.enable(!selfMember.isTodayGotRes());
	};
	
	var _setUpgradeBtnEnableState = function(){
		var nextRes = m_util.getLawLightNextLevelRes();
		if (!nextRes) return;
		
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		if (myAlliance.getBuildVal() >= nextRes.needbuildval && myAlliance.getCardNumber() >= nextRes.needcard ) {
			_lc_.m_items.upgradeBtn.enable(true);
		} else {
			_lc_.m_items.upgradeBtn.enable(false);
		}
	};
	
	var _setBestowBtnEnableState = function(){
		var res = m_util.getLawLightCurLevelRes();
		var lawLight = _lc_.m_g.getImgr().getMyAlliance().getLawLight();
		if ( lawLight.getGrowupVal() == res.maxgrowupval ) {
			_lc_.m_items.bestowBtn.enable(true);
		} else {
			_lc_.m_items.bestowBtn.enable(false);
		}
	};
	
	var _setFeedBtnsEnableState = function(){
		_lc_.m_items.feedBtn.enable(m_util.isCanFeed());
		_lc_.m_items.feedAllBtn.enable(m_util.isCanFeed());
	};
	
	var _setBtnsVisibleByAlliPos = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		if ( myAlliance.getSelfMember().getAlliPos() == ALLI_POS.LEADER ) {
			_lc_.m_items.upgradeBtn.show();
			_lc_.m_items.bestowBtn.show();
		} else {
			_lc_.m_items.upgradeBtn.hide();
			_lc_.m_items.bestowBtn.hide();
		}
		
		var lawLight = myAlliance.getLawLight();
		if ( lawLight.getLevel() == res_alli_lawlight_maxlevel ) {
			_lc_.m_items.upgradeBtn.hide();
		}
	};
	
	var _updateBaseInfo = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx(_lc_.m_items.canGetMoney, _getCurLevelRes().getmoney);
		TQ.setTextEx(_lc_.m_items.canGetHeroExp, _getCurLevelRes().getheroexp);
		TQ.setTextEx(_lc_.m_items.getResNeedContributes, _getCurLevelRes().expendcontribute);
		TQ.setTextEx(_lc_.m_items.totalContributes, myAlliance.getSelfMember().getContributes());
		var addOutputs = ['addFoodOutput', 'addWoodOutput', 'addStoneOutput', 'addIronOutput', 'addMoneyOutput'];
		for ( var k in addOutputs ) {
			TQ.setTextEx ( _lc_.m_items[ addOutputs[k] ], '+' + myAlliance.getLevel()*5 + '%' );
		}
		_lc_.m_items.growupBar.setRange(m_util.getLawLightCurLevelRes().maxgrowupval);
		_lc_.m_items.growupBar.setValue(0, myAlliance.getLawLight().getGrowupVal());
		TQ.setTextEx(_lc_.m_items.todayLeftTime, m_util.getMaxFeedTimes() - myAlliance.getSelfMember().getTodayFeedTimes());
		TQ.setTextEx(_lc_.m_items.feedNeedContributes, m_util.getLawLightCurLevelRes().feedneedcontributes );
		IMG.setBKImage(_lc_.m_items.lawLightIcon, IMG.makeImg('alli/lawlight/icon/' + myAlliance.getLawLight().getLevel() + '.jpg'));
	};
	
	var _setCallers = function(){
		_lc_.m_items.getResBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickGetResBtn});
		_lc_.m_items.upgradeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickUpgradeBtn});
		_lc_.m_items.bestowBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBestowBtn});
		_lc_.m_items.feedBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickFeedBtn});
		_lc_.m_items.feedAllBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickFeedAllBtn});
	};
	
	var _setBtnTipCaller = function(){
		TTIP.setCallerData(_lc_.m_items.tooltips['$upgradeBtnTip'], {self:_lc_.m_this, caller:_lc_._onGetUpgradeBtnTip},{});
	};
	
	_lc_._onClickGetResBtn = function(){
		AllianceSender.sendGainTodayGift(_lc_.m_g);
	};
	
	_lc_._onClickUpgradeBtn = function(){
		var s = _getUpgradeNeedTip();
		var msg = s + rstr.alli.main.lawLight.tip.confirmUpgrade;
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendUpgradeLawLight(_lc_.m_g);
			}
		}});
	};
	
	_lc_._onClickBestowBtn = function(){
		var msg = rstr.alli.main.lawLight.tip.confirmBestow;
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendLawLightBestow(_lc_.m_g);
			}
		}});
	};
	
	_lc_._onClickFeedBtn = function(){
		AllianceSender.sendLawLightFeed(_lc_.m_g);
	};
	
	_lc_._onClickFeedAllBtn = function(){
		AllianceSender.sendLawLightFeedAll(_lc_.m_g);
	};
	
	_lc_._onGetUpgradeBtnTip = function(){
		return _getUpgradeNeedTip();
	};

	var _getCurLevelRes = function(){
		return _getLevelRes(_lc_.m_g.getImgr().getMyAlliance().getLevel());
	};
	
	var _getLevelRes = function(level){
		var levelIdx = level - 1;
		return res_alli_upd_needs[levelIdx];
	};	
	
	var _getUpgradeNeedTip = function(){
		var nextRes = m_util.getLawLightNextLevelRes();
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();		
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.transferdlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.transferdlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.confirmBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickConfirmBtn});
		_lc_.m_items.cancelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancelBtn});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		AllianceSender.sendGetALeaders(_lc_.m_g);
		_lc_.m_items.names.deleteAllItem();
		_lc_.m_items.names.setCurSel(-1);
		_lc_.m_items.names.setTitle(rstr.alli.transferdlg.lbl.dropTitle);
	};
	
	_lc_._onClickConfirmBtn = function(){
		if ( _lc_.m_items.names.getCurSel() < 0 ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.transferdlg.tip.selectTransferTarget);
			return;
		}
		
		var msg = TQ.format(rstr.alli.transferdlg.tip.confirmTransfer, _lc_.m_items.names.getTitle());
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendTransferLeader(_lc_.m_g, _lc_.m_items.names.getTitle());
			}
		}});
	};
	
	_lc_._onClickCancelBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._onSvrPkg = function(netevent){
		if (!_lc_.m_dlg || !_lc_.m_dlg.isShow()) return;
		if (!netevent.data.aleaders) return;
		
		_lc_.m_items.names.deleteAllItem();
		for ( var i=0; i<netevent.data.aleaders.length; ++i ) {
			var name = netevent.data.aleaders[i];
			_lc_.m_items.names.addItem({text:name});
		}
	};
	//AlliTransferDlg-unittest-end
});

AlliUnTransferDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
		
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.untransferdlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.untransferdlg, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.stopTransferBtn.setCaller({self:_lc_.m_this, caller:_lc_._onStopTransferBtn});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx ( _lc_.m_items.name, TQ.format(rstr.alli.untransferdlg.lbl.newname, myAlliance.getTransferName()));
		var leftTime = TQ.formatTime(0, myAlliance.getTransferStopTime() - _lc_.m_g.getSvrTimeS() );
		TQ.setTextEx ( _lc_.m_items.leftTime, TQ.format(rstr.alli.untransferdlg.lbl.lefttime, leftTime));
	};
	
	_lc_._onStopTransferBtn = function(){
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.untransferdlg.tip.stopTransfer, MB_F_YESNO
			,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendStopTransfer(_lc_.m_g);
			}
		}});
	};
	//AlliUnTransferDlg-unittest-end
});

AlliSubscribeDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_PAGE_ITEMCOUNT = 12;
	var C_TODAY_SORT_TAB = 0;
	var C_ALL_SORT_TAB = 1;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	var m_resNames = [rstr.comm.food, rstr.comm.wood, rstr.comm.stone, rstr.comm.iron, rstr.comm.card];
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.CITYRES, 0, _lc_.m_this, _lc_._onCityResChange);
		_lc_.m_g.regEvent(EVT.SELFALLIMEM_CHANGE, 0, _lc_.m_this, _lc_._onSelfAllMemChange);
		_lc_.m_g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemsChange);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();		
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._initContributesOperateList();
		_lc_._initPreviewTabListTitleText();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.subscribedlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.subscribedlg, _lc_.m_items);		
	};
	
	_lc_._initContributesOperateList = function(){
		_lc_.m_items.list.setItemCount(m_resNames.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			TQ.setTextEx(_lc_.m_items.list.getItem(i).exsubs.resName, m_resNames[i]);
		}
	};
	
	_lc_._initPreviewTabListTitleText = function(){
		for ( var i=0; i<rstr.alli.subscribedlg.tabs.length; ++i ) {
			var text = rstr.alli.subscribedlg.tabs[i];
			_lc_.m_items.tablist.setTabText(i, text);
		}
	};
	
	_lc_._setCallers = function(){
		_setContributeListCallers();
		_setTableListPageBarCallers();
	};
	
	var _setContributeListCallers = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.inum.setId(i);
			item.exsubs.inum.setLimit(_lc_._onGetResNumberLimit);
			
			item.exsubs.contributeBtn.setId(i);
			item.exsubs.contributeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickContributeBtn});
			
			if ( i < _lc_.m_items.list.getCount() - 1) {
				item.exsubs.buyBtn.hide();
			} else {
				item.exsubs.buyBtn.show();
			}
			item.exsubs.buyBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuyBtn});
		}
	};
	
	var _setTableListPageBarCallers = function(){
		for ( var i=0; i<_lc_.m_items.tablist.getTabCount(); ++i ) {
			var pageBar = _lc_.m_items.tablist.getTabItems(i).pageBar;
			pageBar.setId(i);
			pageBar.setCaller({self:_lc_.m_this, caller:_lc_._onPageNavigate});
		}
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_selectFirstTab();
		_selectEachTabFirstPage();
		_showMyContributes();
		_updateCurHasCommRes();
	};
	
	var _selectFirstTab = function(){
		_lc_.m_items.tablist.activeTab(0);
	};
	
	var _selectEachTabFirstPage = function(){
		for ( var i=0; i<_lc_.m_items.tablist.getTabCount(); ++i ) {
			var pageBar = _lc_.m_items.tablist.getTabItems(i).pageBar;
			pageBar.activePage(1, true);
		}		
	};
	
	var _showMyContributes = function(){
		var myContributes = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getContributes();
		TQ.setTextEx(_lc_.m_items.myContributes, myContributes);
	};
	
	var _updateCurHasCommRes = function(){
		var commRess = _getCommRess();
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var curHas = '';
			if ( i < _lc_.m_items.list.getCount() - 1 ) {
				curHas = TQ.format(rstr.alli.subscribedlg.lbl.curHas, m_resNames[i], commRess[i]);
			} else {
				curHas = TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, m_resNames[i], commRess[i]);
				TQ.setTextEx ( item.exsubs.unitName, rstr.alli.subscribedlg.lbl.oneUnit );
			}
			TQ.setTextEx ( item.exsubs.curHas, curHas );
		}
	};
	
	_lc_._onGetResNumberLimit = function(id){
		var commRess = _getCommRess();
		return {min:0, max:commRess[id]};
	};
	
	_lc_._onClickContributeBtn = function(id){
		var item = _lc_.m_items.list.getItem(id);
		var num = item.exsubs.inum.getVal();
		if ( num > 0 ) {
			AllianceSender.sendContributeRes(_lc_.m_g, id, num);
			AllianceSender.sendGetTodaySortMems(_lc_.m_g, _lc_.m_items.tablist.getTabItems(0).pageBar.getCurPage());
			AllianceSender.sendGetAllSortMems(_lc_.m_g, _lc_.m_items.tablist.getTabItems(1).pageBar.getCurPage());
		}
	};
	
	_lc_._onClickBuyBtn = function(){
		UIM.getDlg('buyitem').openDlg({id:0, resid:FIXID.ALLI_CARD, number:100000});
	};
	
	_lc_._onPageNavigate = function(pageNo, tabIdx){
		if (tabIdx == C_TODAY_SORT_TAB) {
			AllianceSender.sendGetTodaySortMems(_lc_.m_g, pageNo);
		} else {
			AllianceSender.sendGetAllSortMems(_lc_.m_g, pageNo);
		}
	};
	
	_lc_._onCityResChange = function(){
		if ( !_isShow() ) return;
		_updateCurHasCommRes();
	};	
	
	_lc_._onSelfAllMemChange = function(){
		if ( !_isShow() ) return;
		_showMyContributes();
	};
	
	_lc_._onItemsChange = function(){
		if ( !_isShow() ) return;
		_updateCurHasCommRes();
	};
	
	_lc_._onSvrPkg = function(netevent){
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
		
		var items = _lc_.m_items.tablist.getTabItems(tabIdx);
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
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	var _getCommRess = function(){
		var commRes = _lc_.m_g.getImgr().getCityRes().cres;
		var commRess = [commRes.food, commRes.wood, commRes.stone, commRes.iron];
		for ( var i=0; i<commRess.length; ++i ) {
			commRess[i] = Math.floor(commRess[i]/10000);
		}
		commRess.push(_lc_.m_g.getImgr().getItemNumByResId(FIXID.ALLI_CARD));
		return commRess;
	};
	//AlliSubscribeDlg-unittest-end
});

AlliMemInfoDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	var m_member = null;
	var m_alliPosDropList = [];
	var m_observer = function(){};
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.setObserver = function(observer){
		m_observer = observer;
	};
	
	this.openDlg = function(member){
		_setParam(member);
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	var _setParam = function(member){
		m_member = member;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.meminfodlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.meminfodlg, _lc_.m_items);		
	};

	_lc_._setCallers = function(){
		_lc_.m_items.appointBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAppoint});
		_lc_.m_items.fireBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickFire});
		_lc_.m_items.chatBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickChat});
		_lc_.m_items.mailBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickMail});
		_lc_.m_items.friendBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickFriend});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_setMemberInfo();
		_setAlliPosDropList();
		_selectCurPosInDropList();
		_setAppointContainerVisible();
		_setFireBtnVisible();
	};
	
	var _setMemberInfo = function() {
		IMG.setBKImage ( _lc_.m_items.icon, IMG.makeBigImg(m_member.icon));
		TQ.setTextEx ( _lc_.m_items.name, m_member.name );
		TQ.setTextEx ( _lc_.m_items.alliName, _lc_.m_g.getImgr().getMyAlliance().getName() );
		TQ.setTextEx ( _lc_.m_items.alliPos, rstr.alli.alliposs[m_member.alliPos] );
		TQ.setTextEx ( _lc_.m_items.level, m_member.level );
		TQ.setTextEx ( _lc_.m_items.roleRank, m_member.roleRank );
		TQ.setTextEx ( _lc_.m_items.buildCurVal, m_member.buildCurVal );
		TQ.setTextEx ( _lc_.m_items.contributes, m_member.contributes );
		var pos = FieldUtil.getPosByGridId(m_member.gridId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		TQ.setTextEx ( _lc_.m_items.cood, HyperLinkMgr.formatLink(cood));
	};
	
	var _setAlliPosDropList = function(){
		_lc_.m_items.alliPosDropList.deleteAllItem();
		m_alliPosDropList = [];
		var myAlliPos = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if (myAlliPos == ALLI_POS.LEADER) {
			m_alliPosDropList = [ALLI_POS.ALEADER, ALLI_POS.ELDER, ALLI_POS.MEM];
		} else if ( myAlliPos == ALLI_POS.ALEADER) {
			m_alliPosDropList = [ALLI_POS.ELDER, ALLI_POS.MEM];
		}
		
		for ( var i=0; i<m_alliPosDropList.length; ++i ) {
			_lc_.m_items.alliPosDropList.addItem({text:rstr.alli.alliposs[ m_alliPosDropList[i] ]});
		}
	};
	
	var _selectCurPosInDropList = function(){
		TQ.find(m_alliPosDropList, null, m_member.alliPos);
		_lc_.m_items.alliPosDropList.setCurSel(TQ.getLastFindIdx());
	};
	
	var _setAppointContainerVisible = function(){
		var myAlliPos = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if ( myAlliPos > m_member.alliPos && myAlliPos >= ALLI_POS.ALEADER) {
			TQ.setCSS(_lc_.m_items.appointContainer, 'display', 'block');
		} else {
			TQ.setCSS(_lc_.m_items.appointContainer, 'display', 'none');
		}
	};
	
	var _setFireBtnVisible = function(){
		var myAlliPos = _lc_.m_g.getImgr().getMyAlliance().getSelfMember().getAlliPos();
		if ( myAlliPos > m_member.alliPos ) {
			_lc_.m_items.fireBtn.show();
		} else {
			_lc_.m_items.fireBtn.hide();
		}
	};
	
	_lc_._onClickAppoint = function(){
		var selectIdx = _lc_.m_items.alliPosDropList.getCurSel();
		var selectAlliancePos = m_alliPosDropList[selectIdx];
		if ( selectAlliancePos == m_member.alliPos ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.meminfodlg.tip.noChangeAppoint);
			return;
		}
		
		var msg = TQ.format(rstr.alli.meminfodlg.tip.confirmAppoint, m_member.name, _lc_.m_items.alliPosDropList.getTitle());
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendAppointMember(_lc_.m_g, m_member.name, selectAlliancePos);
				m_observer();
			}
		}});
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickFire = function(){
		var msg = TQ.format(rstr.alli.meminfodlg.tip.confirmFire, m_member.name);
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendFireMember(_lc_.m_g, m_member.name);
				m_observer();
			}
		}});
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickChat = function(){
		UIM.getPanel('chat').setChatTarget(m_member.name);
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickMail = function(){
		UIM.getDlg('writeletter').writeLetterTo(m_member.name);
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickFriend = function(){
		FriendSender.sendApplyFriend(_lc_.m_g, m_member.name);
	};
	//AlliMemInfoDlg-unittest-end
});

AlliApplyListDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_applys = [];
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
			title : rstr.alli.applylistdlg.title,
			pos : {x:'center', y:40} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.applylistdlg, _lc_.m_items);
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._updateApplyList();
	};
	
	_lc_._onSvrPkg = function(netevent){
		if ( !netevent.data.applys ) return;
		TQ.dictCopy(_lc_.m_applys, netevent.data.applys);
		
		if ( _lc_.m_dlg && _lc_.m_dlg.isShow() ) {
			_lc_._updateApplyList();
		}
	};
	
	_lc_._updateApplyList = function(){
		_setApplyListItems();
		_setApplyListBtnsCaller();
	};
	
	var _setApplyListItems = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_applys.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var member = _lc_.m_applys[i];
			TQ.setTextEx ( item.exsubs.name, member.roleName );
			TQ.setTextEx ( item.exsubs.level, member.level );
			TQ.setTextEx ( item.exsubs.buildVal, member.buildVal );
		}
	};
	
	var _setApplyListBtnsCaller = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.refuseBtn.setId(i);			
			item.exsubs.agreeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAgreeBtn});
			item.exsubs.refuseBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickRefuseBtn});
		}		
	};
	
	_lc_._onClickAgreeBtn = function(id){
		AllianceSender.sendAgreeApply(_lc_.m_g, _lc_.m_applys[id].roleId);
	};
	
	_lc_._onClickRefuseBtn = function(id){
		AllianceSender.sendIgnoreApply(_lc_.m_g, _lc_.m_applys[id].roleId);
	};
	//AlliApplyListDlg-unittest-end
});

AlliEventsDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_dlg;
	_lc_.m_items = {};
	var m_events = [];

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if (_lc_.m_dlg) _lc_.m_dlg.hide();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.eventsdlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.eventsdlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.pageBar.setCaller({self:_lc_.m_this, caller:_lc_._onPageNavigate});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_items.pageBar.activePage(1, true);
	};
	
	_lc_._onPageNavigate = function(pageNo){
		AllianceSender.sendGetEvents(_lc_.m_g, pageNo);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var events = netevent.data.events;
		if ( !events ) return;
		if ( !_lc_.m_dlg || !_lc_.m_dlg.isShow() ) return;
		
		_lc_.m_items.pageBar.setPageCnt(events.pageCount);
		_lc_.m_items.pageBar.activePage(events.pageNo, false, true);
		
		_lc_.m_items.list.setItemCount(events.list.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); i++ ){
			var item = _lc_.m_items.list.getItem(i);
			var event = events.list[i];
			TQ.setTextEx(item.exsubs.desc, event.desc);
			TQ.setTextEx(item.exsubs.time, TQ.formatDateTime(event.time));
		}
	};
	//AlliEventsDlg-unittest-end
});

AlliMergeDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	var m_applys = [];
		
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.ALLIANCE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.mergedlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.mergedlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.applyMergeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickApplyMerge});
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		AllianceSender.sendGetApplyMerges(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var applymerges = netevent.data.applymerges;
		if ( !applymerges ) return;
		if ( !_lc_.m_dlg || !_lc_.m_dlg.isShow() ) return;
		
		TQ.dictCopy(m_applys, applymerges);
		_setApplyMergeListItems();
		_setApplyMergeListBtnsCaller();
	};
	
	var _setApplyMergeListItems = function(){
		_lc_.m_items.list.setItemCount(m_applys.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); i++ ){
			var item = _lc_.m_items.list.getItem(i);
			var apply = m_applys[i];
			TQ.setTextEx(item.exsubs.name, apply.name);
			TQ.setTextEx(item.exsubs.level, apply.level);
			TQ.setTextEx(item.exsubs.leader, apply.leader);
		}		
	};
	
	var _setApplyMergeListBtnsCaller = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); i++ ){
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.agreeBtn.setId(i);
			item.exsubs.refuseBtn.setId(i);
			item.exsubs.agreeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAgreeBtn});
			item.exsubs.refuseBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickRefuseBtn});
		}			
	};
	
	_lc_._onClickApplyMerge = function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.alli.mergedlg.lbl.applyMergeTip, JVALID.getMaxAlliLen());
		inputdlg.setCaller({self:_lc_.m_this,caller:_lc_._onApplyMergeCallBack});		
	};
	
	_lc_._onApplyMergeCallBack = function(name){
		if ( JVALID.checkAlliname(name) ){
			AllianceSender.sendApplyMerge(_lc_.m_g, name);
		} else {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100116].msg);
		}
	};	
	
	_lc_._onClickAgreeBtn = function(listIdx){
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.alli.mergedlg.tip.confirmMerge, MB_F_YESNO
			,{self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ){
				AllianceSender.sendAgreeMerge(_lc_.m_g, m_applys[listIdx].name);
			}
		}});
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickRefuseBtn = function(listIdx){
		AllianceSender.sendRefuseMerge(_lc_.m_g, m_applys[listIdx].name);
	};
	//AlliMergeDlg-unittest-end
});



