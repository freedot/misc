/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
SoldierDlgView = Class.extern(function(){
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_presenter=null;
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		this.refreshNewcomerSpirit();
	};
	
	this.closeDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	this.setPresenter = function(presenter){
		m_presenter = presenter;
	};
	
	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.updateView = function() {
		_updateView();
	};
	
	this.refreshNewcomerSpirit = function(){
		HelpGuider.getNewcomerSpirit().onDlgOpen('soldier', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.soldierdlg.title, pos:{x:"center", y:30} });
			m_g.getGUI().initDlg(m_dlg, uicfg.soldier.soldierdlg, m_items);
			if ( m_presenter ) m_presenter.initDlg();
			m_dlg.setCaller({self:m_this,caller:function(id){
				if ( id == C_SYS_DLG_HIDE ){
					HelpGuider.getNewcomerSpirit().onDlgClose('soldier');
				}				
			}});
		}
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_updateView();
		m_items.cantraininglist.setCurSel(0);
		m_items.isoldiernum.setVal(1);
	};
	
	var _updateView = function(){
		if ( !m_this.isShow() ) return;
		
		_setBarbackInfo();
		_setHasSoldierList();
		_setCanSoldierList();
		_setCurResLabels();
	};
	
	var _setBarbackInfo = function(){
		var imgr = m_g.getImgr();
		TQ.setTextEx(m_items.newsoldier, TQ.format(rstr.soldierdlg.lbl.newsoldier, imgr.getRoleAttrVal(ATTR.NAF), imgr.getRoleAttrVal(ATTR.MNAF) ));
		TQ.setTextEx(m_items.totalsoldier, TQ.format(rstr.soldierdlg.lbl.totalsoldier, imgr.getRoleAttrVal(ATTR.AF), imgr.getRoleAttrVal(ATTR.MAF) ));
		TQ.setTextEx(m_items.soldieroutput, TQ.format(rstr.soldierdlg.lbl.soldieroutput, imgr.getRoleAttrVal(ATTR.NAFO) ));
	};
	
	var _setHasSoldierList = function(){
		var oldcnt = m_items.hassoldierlist.getCount();
		var soldiers = m_g.getImgr().getSoldiers();
		m_items.hassoldierlist.setItemCount(soldiers.length);
		for ( var i=0; i<soldiers.length; ++i ) {
			var soldier = soldiers[i];
			var item = m_items.hassoldierlist.getItem(i);
			TQ.setText(item.exsubs.name, RStrUtil.getSoldierNameByResId(soldier.id));
			TQ.setText(item.exsubs.num, soldier.number);
		}
		
		if ( oldcnt != m_items.hassoldierlist.getCount() ) {
			m_presenter.resetHasSoldierListCaller();
		}
	};
	
	var _setCanSoldierList = function(){
		var cnt = m_items.cantraininglist.getCount();
		for ( var i=0; i<cnt; ++i ) {
			var item = m_items.cantraininglist.getItem(i);
			var culture = m_g.getImgr().getTrainCultureByIdx(i);
			//TQ.setCSS(item.exsubs.cover, 'display', culture.level > 0 ? 'none' : 'block' );
			var baseSoldierId = FIXID.FIRSTSOLDIER + i;
			var res = ItemResUtil.findItemres(baseSoldierId);
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(res.bigpic));
			var soldierId = ItemResUtil.makeLevelResid(baseSoldierId, Math.max(1, culture.level));
			TQ.setText(item.exsubs.name, RStrUtil.getSoldierNameByResIdAndLevel(soldierId, culture.level));
		}
	};
	
	var _setCurResLabels = function(){
		var imgr = m_g.getImgr();
		TQ.setText( m_items.curmoney, imgr.getMoney() );
		TQ.setText( m_items.curfood, imgr.getCityRes().cres.food );
		TQ.setText( m_items.curnewsoldier, imgr.getRoleAttrVal(ATTR.NAF) );
	};	
});

SoldierDlgModel = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_view=null;
	this.init = function(g) {
		m_g = g;
		m_this = this;
	};
	
	this.setView = function(view){
		m_view = view;
	};
	
	this.handleSoldierSvrPkg = function(ndata){
		if ( ndata.soldiers ) {
			var soldiers = m_g.getImgr().getSoldiers();
			TQ.dictCopy(soldiers, ndata.soldiers);
			m_g.sendEvent({eid:EVT.SOLDIERRES,sid:0});
			m_view.updateView();
		}
	};
});

SoldierDlgPresenter = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_view=null;
	var m_model=null;
	var m_curTrainIdx=-1;
	this.init = function(g, view, model) {
		m_g = g;
		m_this = this;
		m_view = view;
		m_model = model;
		m_view.setPresenter(m_this);
		m_model.setView(m_view);
		m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
		m_g.regEvent(EVT.CITYRES, 0, m_this, _onCityResChange);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.SOLDIERRES, m_this, _onSoldierSvrPkg);
	};
	
	this.openDlg = function() {
		m_view.openDlg();
	};
	
	this.closeDlg = function(){
		m_view.closeDlg();
	};
	
	this.hideDlg = function(){
		this.closeDlg();
	};
	
	this.initDlg = function() {
		_setCallers();
	};
	
	this.getView = function(){
		return m_view;
	};
	
	this.resetHasSoldierListCaller = function() {
		var list = m_view.getCtrl('hassoldierlist');
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			item.exsubs.updsoldier.setId(i);
			item.exsubs.updsoldier.setCaller({self:m_this, caller:_onClickUpdSoldierBtn});
		}
	};
	
	var _setCallers = function() {
		m_view.getCtrl('addnewsoldier').setCaller({self:m_this,caller:_onClickAddNewSoldierListItem});
		m_view.getCtrl('cantraininglist').setCaller({self:m_this,caller:_onClickCanTrainSoldierListItem});
		m_view.getCtrl('isoldiernum').setCaller({self:m_this, caller:_onTrainSoldierNumberChange});
		m_view.getCtrl('isoldiernum').setLimit(_onGetTrainSoldierNumberLimit);
		m_view.getCtrl('trainingbtn').setCaller({self:m_this, caller:_onClickTrainBtn});
	};
	
	var _onRolebaseChange = function(){
		m_view.updateView();
	};
	
	var _onCityResChange = function(){
		m_view.updateView();
	};
	
	var _onLoginOk = function(){
		SoldierSender.sendGetSoldiers(m_g);
	};
	
	var _onSoldierSvrPkg = function(netevent){
		m_model.handleSoldierSvrPkg(netevent.data);
	};
	
	var _onClickAddNewSoldierListItem = function() {
		var role = m_g.getImgr().getRoleRes();
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.ADD_NEWSOLDIER], 
			{id:role.id, name:role.name, type:RES_TRG.SELF_ROLE} );
	};
	
	var _onClickCanTrainSoldierListItem = function(e, idx) {
		m_curTrainIdx = idx;
		var res = _getCurSelTrainRes();
		var LV = _getCurSelCanTrainLevel();
		
		TQ.setText( m_view.getCtrl('strattr'), Math.round(eval(res.str)) );
		TQ.setText( m_view.getCtrl('phyattr'), Math.round(eval(res.phy)) );
		TQ.setText( m_view.getCtrl('agileattr'), Math.round(eval(res.agile)) );
		TQ.setText( m_view.getCtrl('mspeedattr'), Math.round(eval(res.mspeed)) );
		TQ.setText( m_view.getCtrl('arangeattr'), Math.round(eval(res.arange)) );
		TQ.setText( m_view.getCtrl('aspeedattr'), Math.round(eval(res.aspeed)) );
		
		m_view.getCtrl('isoldiernum').setVal(1);
		m_view.refreshNewcomerSpirit();
	};
	
	var _onGetTrainSoldierNumberLimit = function(){
		var LV = _getCurSelCanTrainLevel();
		var needres = TQ.qfind(res_soldiers_upd, 'level', LV);
		var imgr = m_g.getImgr();
		var numByMoney = parseInt(imgr.getMoney()/needres.money, 10);
		var numByFood = parseInt(imgr.getCityRes().cres.food/needres.food, 10);
		var numByNewSoldier = imgr.getRoleAttrVal(ATTR.NAF);
		var numByLeftCapacity = imgr.getRoleAttrVal(ATTR.MAF) - imgr.getRoleAttrVal(ATTR.AF);
		var max = Math.min(numByMoney, numByFood, numByNewSoldier, numByLeftCapacity);
		max = Math.max(1, max);
		return {min:1, max:max};
	};
	
	var _onTrainSoldierNumberChange = function(num){
		_setNeedResLabels(num);
		m_view.refreshNewcomerSpirit();
	};

	var _getCurSelCanTrainLevel = function(){
		var culture = m_g.getImgr().getTrainCultureByIdx(m_curTrainIdx);
		return culture.level > 0 ? culture.level : 1;
	};
	
	var _getCurSelTrainRes = function(){
		return ItemResUtil.findItemres(FIXID.FIRSTSOLDIER+m_curTrainIdx);
	};
	
	var _setNeedResLabels = function(trainNum){
		var LV = _getCurSelCanTrainLevel();
		var needres = TQ.qfind(res_soldiers_upd, 'level', LV);
		TQ.setText( m_view.getCtrl('needfood'), needres.food*trainNum );
		TQ.setText( m_view.getCtrl('needmoney'), needres.money*trainNum );
		TQ.setText( m_view.getCtrl('neednewsoldier'), trainNum );
	};
	
	var _onClickTrainBtn = function(){
		var imgr = m_g.getImgr();
		var res = _getCurSelTrainRes();
		var LV = _getCurSelCanTrainLevel();
		var trainNum = m_view.getCtrl('isoldiernum').getVal();
		var _hasEnoughNewSoldier = function() {
			return trainNum <= imgr.getRoleAttrVal(ATTR.NAF);
		};
		var _hasEnoughMoney = function() {
			var needres = TQ.qfind(res_soldiers_upd, 'level', LV);
			return needres.money*trainNum <= imgr.getMoney();
		};
		var _hasEnoughFood = function() {
			var needres = TQ.qfind(res_soldiers_upd, 'level', LV);
			return needres.food*trainNum <= imgr.getCityRes().cres.food;
		};
		var _hasEnoughCultureLevel = function() {
			var culture = m_g.getImgr().getTrainCultureByIdx(m_curTrainIdx);
			return culture.level > 0;
		};
		var _hasEnoughCapacity = function(){
			var capactiyNum = imgr.getRoleAttrVal(ATTR.MAF) - imgr.getRoleAttrVal(ATTR.AF);
			return trainNum <= capactiyNum;
		};
		
		if (  !_hasEnoughNewSoldier() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldierdlg.err.noNewSoldier);
			return;
		}
		if ( !_hasEnoughMoney() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldierdlg.err.noMoney);
			return;
		}
		if ( !_hasEnoughFood() ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldierdlg.err.noFood);
			return;
		}
		if ( !_hasEnoughCapacity() ){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldierdlg.err.noCapacity);
			return;
		}
		if ( !_hasEnoughCultureLevel() ) {
			var culture = m_g.getImgr().getTrainCultureByIdx(m_curTrainIdx);
			var cultureres = ItemResUtil.findItemres(culture.id);
			m_g.getGUI().sysMsgTips(SMT_WARNING, TQ.format(rstr.soldierdlg.err.noCulture, cultureres.name) );
			return;
		}
		
		SoldierSender.sendTraining(m_g, FIXID.FIRSTSOLDIER+m_curTrainIdx, trainNum);
		m_view.getCtrl('isoldiernum').setVal(1);
	};
	
	var _onClickUpdSoldierBtn = function(id) {
		var soldiers = m_g.getImgr().getSoldiers();
		UIM.getDlg('soldierop').openDlg( soldiers[id] );
	};
});

