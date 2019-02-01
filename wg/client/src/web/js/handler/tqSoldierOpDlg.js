/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
SoldierOpDlg = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_soldier=null;
	var m_upgradeOp=null;
	var m_demobOp=null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(soldier){
		m_soldier = soldier;
		_initDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		if (m_dlg) m_dlg.hide();
	};

	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.getTitle = function() {
		return m_dlg.getTitle();
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.soldieropdlg.title, pos:{x:"center", y:30} });
			m_g.getGUI().initDlg(m_dlg, uicfg.soldier.opdlg, m_items);
			m_upgradeOp = SoldierUpgradeOp.snew(m_g, m_dlg, m_items);
			m_demobOp = SoldierDemobOp.snew(m_g, m_dlg, m_items);
			m_upgradeOp.setCaller();
			m_demobOp.setCaller();
		}
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_setTitle();
		m_upgradeOp.initInfo(m_soldier);
		m_demobOp.initInfo(m_soldier);
	};
	
	var _setTitle = function(){
		m_dlg.setTitle(rstr.soldieropdlg.title + ' - ' + RStrUtil.getSoldierNameByResId(m_soldier.id) );
	};
});

SoldierUpgradeOp = Class.extern(function(){
	var m_g=null;
	var m_dlg=null;
	var m_items=null;
	var m_this=null;
	var m_soldier=null;
	
	this.init = function(g, dlg, items) {
		m_this = this;
		m_g = g;
		m_dlg = dlg;
		m_items = items;
	};
	
	this.setCaller = function(){
		_setUpdInputNumCaller();
		_setCommBtnCaller();
	};
	
	this.initInfo = function(soldier){
		m_soldier = soldier;
		_setMaxLevelDesc();
		_setUpdBtnEnableState();
		_setUpdInputNum();
	};
	
	var _setUpdInputNumCaller = function(){
		m_items.iupdnum.setLimit(_onGetUpdInputNumLimit);
		m_items.iupdnum.setCaller({self:m_this, caller:_onUpdInputNumChange});
	};
	
	var _setCommBtnCaller = function() {
		m_items.updbtn.setCaller({self:m_this, caller:_onClickUpdBtn});
	};
	
	var _setMaxLevelDesc = function(){
		if ( _isArrivedMaxLevel() ) {
			TQ.setText(m_items.desc, rstr.soldieropdlg.lbl.arrivemaxlevel);
		} 
		else {
			TQ.setText(m_items.desc, '');
		}
	};
	
	var _setUpdBtnEnableState = function(){
		if ( _isArrivedMaxLevel() ) {
			m_items.updbtn.enable(false);
		}
		else {
			m_items.updbtn.enable(true);
		}
	};
	
	var _setUpdInputNum = function(){
		m_items.iupdnum.setVal(1);
	};
	
	var _onGetUpdInputNumLimit = function(){
		var imgr = m_g.getImgr();
		var needRes = _getNextLevelNeedRes();
		var maxByMoney = parseInt( imgr.getMoney()/needRes.money, 10);
		var maxByFood = parseInt( imgr.getCityRes().cres.food/needRes.food, 10);
		var maxBySoldierNumber = m_g.getImgr().getSoldierNumber(m_soldier.id);
		var max = Math.min(maxByMoney, maxByFood, maxBySoldierNumber);
		max = Math.max(1, max);
		return {min:1, max:max};
	};
	
	var _onUpdInputNumChange = function(num){
		var needRes = _getNextLevelNeedRes();
		var needMoney = TQ.format(rstr.soldieropdlg.lbl.needmoney, needRes.money*num);
		var needFood  = TQ.format(rstr.soldieropdlg.lbl.needfood, needRes.food*num);
		TQ.setText(m_items.needmoney, needMoney);
		TQ.setText(m_items.needfood, needFood);
	};
	
	var _onClickUpdBtn = function() {
		var imgr = m_g.getImgr();
		var needRes = _getNextLevelNeedRes();
		var upgradeNumber = m_items.iupdnum.getVal();
		var hasEnoughMoney = needRes.money*upgradeNumber <= imgr.getMoney() ;
		var hasEnoughFood = needRes.food*upgradeNumber <= imgr.getCityRes().cres.food ;
		var hasSoldierNumber = imgr.getSoldierNumber(m_soldier.id);
		var hasEnoughSoldierNumber = upgradeNumber <= hasSoldierNumber;
		
		if ( !hasEnoughMoney ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldieropdlg.err.noMoney);
			return;
		}
		if ( !hasEnoughFood ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldieropdlg.err.noFood);
			return;
		}
		if ( !hasEnoughSoldierNumber ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldieropdlg.err.noSoldierForUpgrade);
			return;
		}
		
		SoldierSender.sendUpgrade(m_g, m_soldier.id, upgradeNumber);
		m_items.iupdnum.setVal(1);
	};
	
	var _isArrivedMaxLevel = function(){
		var residLevel = ItemResUtil.splitResidLevel(m_soldier.id);
		var cultureIdx = residLevel.resid - FIXID.FIRSTSOLDIER;
		var culture = m_g.getImgr().getTrainCultureByIdx(cultureIdx);
		return ( residLevel.level >= culture.level );
	};
	
	var _getNextLevelNeedRes = function(){
		var residLevel = ItemResUtil.splitResidLevel(m_soldier.id);
		var nextLevel = residLevel.level + 1;
		return TQ.qfind(res_soldiers_upd, 'level', nextLevel);
	};
});

SoldierDemobOp = Class.extern(function(){
	var m_g=null;
	var m_dlg=null;
	var m_items=null;
	var m_this=null;
	var m_soldier=null;
	
	this.init = function(g, dlg, items) {
		m_this = this;
		m_g = g;
		m_dlg = dlg;
		m_items = items;
	};
	
	this.setCaller = function(){
		_setDemobInputNumCaller();
		_setCommBtnCaller();
	};
	
	this.initInfo = function(soldier){
		m_soldier = soldier;
		_setDemobInputNum();
	};
	
	var _setDemobInputNumCaller = function(){
		m_items.idemobnum.setLimit(_onGetDemoInputNumLimit);
		m_items.idemobnum.setCaller({self:m_this, caller:_onDemobInputNumChange});
	};
	
	var _setCommBtnCaller = function(){
		m_items.demobbtn.setCaller({self:m_this, caller:_onClickDemobBtn});
	};
	
	var _setDemobInputNum = function(){
		m_items.idemobnum.setVal(1);
	};
	
	var _onGetDemoInputNumLimit = function(){
		var hasNumber = m_g.getImgr().getSoldierNumber(m_soldier.id);
		return {min:1, max:Math.max(1, hasNumber)};
	};
	
	var _onDemobInputNumChange = function(num){
		var needRes = _getCurLevelNeedRes();
		var returnMoney = TQ.format(rstr.soldieropdlg.lbl.rtmoney, parseInt(needRes.money*num*res_demob_soldier_retres_per, 10) );
		var returnFood  = TQ.format(rstr.soldieropdlg.lbl.rtfood, parseInt(needRes.food*num*res_demob_soldier_retres_per, 10) );
		TQ.setText(m_items.rtmoney, returnMoney);
		TQ.setText(m_items.rtfood, returnFood);	
	};
	
	var _onClickDemobBtn = function(){
		var demobNumber = m_items.idemobnum.getVal();
		var hasNumber = m_g.getImgr().getSoldierNumber(m_soldier.id);
		var hasEnoughSoldierNumber = demobNumber <= hasNumber;
		if ( !hasEnoughSoldierNumber ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.soldieropdlg.err.noSoldierForDemob);
			return;
		}
		
		var _onDemobCallback = function(id) {
			if ( id == MB_IDYES ) {
				SoldierSender.sendDemob(m_g, m_soldier.id, demobNumber);
				m_items.idemobnum.setVal(1);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.soldieropdlg.lbl.confrimdemob,  MB_F_YESNO, {self:m_this, caller:_onDemobCallback} );
	};

	var _getCurLevelNeedRes = function(){
		var residLevel = ItemResUtil.splitResidLevel(m_soldier.id);
		return TQ.qfind(res_soldiers_upd, 'level', residLevel.level);
	};	
});
