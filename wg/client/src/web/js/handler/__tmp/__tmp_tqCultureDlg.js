/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CultureDlg = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_svrhdr=null;
	var m_selCultureResid=-1;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_svrhdr = CultureSvrPkgHdr.snew(m_g);
		m_g.regEvent(EVT.CULTURE_UPDATE, 0, m_this, _onCultureUpdate);
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		HelpGuider.getNewcomerSpirit().onDlgOpen('culture', {parent:m_dlg.getParent(), items:m_items});
	};
	
	this.closeDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};

	this.isShow = function() {
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	this.opSpeed = function(learnCulture){
		if ( learnCulture.id == 0 ) return;

		var res = ItemResUtil.findItemres(learnCulture.id);
		UIM.openDlg('uselistitem', 
			[RES_EFF.ACC_CULTURELEARN], 
			{id:learnCulture.id, stoptime:learnCulture.stoptime, name:res.name, type:RES_TRG.SELF_ROLE} );
	};
	
	this.opCancel = function(item){
		CultureSender.sendCancelLearn(m_g);
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.culturedlg.title, pos:{x:"center", y:30} });
			m_g.getGUI().initDlg(m_dlg, uicfg.culture.culturedlg, m_items);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
			_setTabNames();
			_setCallers();
		}
		m_dlg.show();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	var _setTabNames = function(){
		for ( var i=0; i<rstr.culturedlg.tabs.length; ++i ) {
			m_items.tablist.setTabText(i, rstr.culturedlg.tabs[i]);
		}
	};
	
	var _setCallers = function(){
		_setTabActiveCaller();
		_setListsClickCaller();
		_setListItemsTooltipCaller();
		_setCommBtnsCaller();
	};
	
	var _setTabActiveCaller = function(){
		m_items.tablist.setCaller({self:m_this, caller:_onActiveTab});
	};
	
	var _setListsClickCaller = function(){
		for (var i=0; i<m_items.tablist.getTabCount(); ++i ) {
			var items = m_items.tablist.getTabItems(i);
			items.list.setCaller({self:m_this, caller:_onClickListItem});
		}
	};
	
	var _setListItemsTooltipCaller = function(){
		var tabCultureIds = [
			[120001,120002,120003,120004,120005],
			[120006,120007,120008,120009],
			[120011,120012,120013,120014],
			[120016,120017,120018,120019],
			[120021,120022,120023,120024],
			[120026,120027,120028,120029],
			[120031,120032]  ];
		for ( var tabIdx=0, tabCnt=m_items.tablist.getTabCount(); tabIdx<tabCnt; ++tabIdx ) {
			var tabItems = m_items.tablist.getTabItems(tabIdx);
			var curCultureIds = tabCultureIds[tabIdx];
			tabItems.list.setItemCount(curCultureIds.length);
			for ( var listItemIdx=0; listItemIdx<tabItems.list.getCount(); ++listItemIdx ) {
				var listItem = tabItems.list.getItem(listItemIdx);
				listItem.userdata = {cultureResid:curCultureIds[listItemIdx]};
				TTIP.setCallerData(listItem.exsubs.tooltips['$item'], {self:m_this, caller:_onGetCultureTootip}, {id:listItem.userdata.cultureResid});
			}
		}	
	};
	
	var _setCommBtnsCaller = function(){
		m_items.learnbtn.setCaller({self:m_this, caller:_onClickLearnBtn});
		m_items.speedbtn.setCaller({self:m_this, caller:_onClickSpeedLearnBtn});
		m_items.cancelbtn.setCaller({self:m_this, caller:_onClickCancelLearnBtn});
	};
	
	var _initInfo = function(){
		_updateLearningInfo();
		_updateLists();
		m_items.tablist.activeTab(0);
	};
	
	var _updateLists = function() {
		for ( var tabIdx=0, tabCnt=m_items.tablist.getTabCount(); tabIdx<tabCnt; ++tabIdx ) {
			var tabItems = m_items.tablist.getTabItems(tabIdx);
			for ( var listItemIdx=0; listItemIdx<tabItems.list.getCount(); ++listItemIdx ) {
				var listItem = tabItems.list.getItem(listItemIdx);
				var resItem = ItemResUtil.findItemres(listItem.userdata.cultureResid);
				IMG.setBKImage(listItem.exsubs.icon, IMG.makeBigImg(resItem.bigpic));
				var cultureLevel = m_g.getImgr().getCultureLevel(listItem.userdata.cultureResid);
				TQ.setText(listItem.exsubs.name, resItem.name);
				TQ.setText(listItem.exsubs.level, cultureLevel );
				TQ.setText(listItem.exsubs.level_bak, cultureLevel );
			}
		}
	};
	
	var _onActiveTab = function(idx) {
		var items = m_items.tablist.getTabItems(idx);
		items.list.setCurSel(0);
	};
	
	var _onClickListItem = function(e, idx) {
		var items = m_items.tablist.getTabItems(m_items.tablist.getActiveTab());
		var listItem = items.list.getItem(idx);
		m_selCultureResid = listItem.userdata.cultureResid;
		_updateSelectCultureDesc();
		_updateLearnBtnState();
		HelpGuider.getNewcomerSpirit().onDlgOpen('culture', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _onCultureUpdate = function(){
		if ( !m_this.isShow() ) return;
		_updateLists();
		_updateSelectCultureDesc();
		_updateLearnBtnState();
		_updateLearningInfo();
		HelpGuider.getNewcomerSpirit().onDlgOpen('culture', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _onGetCultureTootip = function(data){
		var culture = m_g.getImgr().getCultureById(data.id);
		return TIPM.getCultureDesc(culture);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('culture');
		}
	};
	
	var _onUpdate = function(cltTimeMs) {
		var learnculture = m_g.getImgr().getLearningCulture();
		_updateLearningLeftTime(learnculture);
	};
	
	var _onClickLearnBtn = function() {
		var learnculture = m_g.getImgr().getLearningCulture();
		if ( learnculture.id > 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.culturedlg.err.learning);
			return;
		}
		CultureSender.sendLearn(m_g, m_selCultureResid);
	};
	
	var _onClickSpeedLearnBtn = function() {
		var learnCulture = m_g.getImgr().getLearningCulture();
		m_this.opSpeed(learnCulture);
	};
	
	var _onClickCancelLearnBtn = function() {
		var _onCancelLearnCallback = function(id) {
			if ( id == MB_IDYES ) m_this.opCancel();
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.culturedlg.lbl.cancelLearn,  MB_F_YESNO, {self:m_this, caller:_onCancelLearnCallback} );
	};
	
	var _updateSelectCultureDesc = function(){
		var culture = m_g.getImgr().getCultureById(m_selCultureResid);
		TQ.setTextEx(m_items.desc, TIPM.getCultureLearnDesc(culture));
	};
	
	var _updateLearnBtnState = function(){
		var culture = m_g.getImgr().getCultureById(m_selCultureResid);
		m_items.learnbtn.enable(TIPM.isCultureCanLearn(culture));
	};
	
	var _updateLearningInfo = function(){
		var learnculture = m_g.getImgr().getLearningCulture();
		if ( learnculture.id == 0 ) {
			_clearLearningInfo();
			return;
		}

		_updateLearningIcon(learnculture);
		_updateLearningName(learnculture);
		_updateLeariningLevel(learnculture);
		_updateLearningLeftTime(learnculture);
		m_items.speedbtn.show();
		m_items.cancelbtn.show();
	};
	
	var _clearLearningInfo = function() {
		IMG.setBKImage(m_items.curicon, '');
		TQ.setText(m_items.curname, '');
		TQ.setText(m_items.upgradelevel, '');
		TQ.setText(m_items.lefttime, '');
		m_items.speedbtn.hide();
		m_items.cancelbtn.hide();
	};
	
	var _updateLearningIcon = function(learnculture){
		var res = ItemResUtil.findItemres(learnculture.id);
		IMG.setBKImage(m_items.curicon, IMG.makeBigImg(res.bigpic));
	};
	
	var _updateLearningName = function(learnculture) {
		var res = ItemResUtil.findItemres(learnculture.id);
		TQ.setText(m_items.curname, res.name);
	};
	
	var _updateLeariningLevel = function(learnculture){
		var culture = m_g.getImgr().getCultureById(learnculture.id);
		TQ.setText(m_items.upgradelevel, TQ.format(rstr.comm.flevel, culture.level) + ' -> ' + TQ.format(rstr.comm.flevel, culture.level+1));
	};
	
	var _updateLearningLeftTime = function(learnculture) {
		if ( learnculture.id == 0 ) {
			TQ.setText(m_items.lefttime, '' );
			return;
		}
		
		var lefttime = learnculture.stoptime - m_g.getSvrTimeS();
		lefttime = lefttime < 0 ? 0 : lefttime;
		TQ.setText(m_items.lefttime, rstr.culturedlg.lbl.lefttime + TQ.formatTime(0, lefttime) );
	};
});

CultureSvrPkgHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	this.init = function(g) {
		_lc_._initParam(this, g);
		_lc_._regEvents();
	};
	
	_lc_._initParam = function(selfThis, g){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.CULTURE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	_lc_._onLoginOk = function(){
		CultureSender.sendGetCultures(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_lc_._onCulturesData(netdata);
		_lc_._onCultureLearningData(netdata);
	};
	
	_lc_._onCulturesData = function(netdata){
		if ( !netdata.cultures ) return;
		
		var cultures = _lc_.m_g.getImgr().getCultures();
		TQ.dictCopy(cultures, netdata.cultures);
		_lc_.m_g.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
	};
	
	_lc_._onCultureLearningData = function(netdata){
		if ( !netdata.learning ) return;
		
		var learnculture = _lc_.m_g.getImgr().getLearningCulture();
		TQ.dictCopy(learnculture, netdata.learning);
		ItemResUtil.initItemres(learnculture, 'id');
		_lc_.m_g.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	//CultureSvrPkgHdr-unittest-end
});