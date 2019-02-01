/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
FillSoldierDropTypeList = Class.extern(function(){
	var m_g = null;
	this.init = function(g){
		m_g = g;
	};
	
	this.fill = function(listItem, soldier){
		listItem.exsubs.userdata = {soldiertypes:[], currentNumber:soldier.number};
		listItem.exsubs.soldiertype.deleteAllItem();
		
		_addCurSoldierType(listItem, soldier);
		_addFreeSoldierTypes(listItem);
		_addEmptyType(listItem);
	};
	
	var _addCurSoldierType = function(listItem, soldier){
		if ( soldier.resid > 0 ) {
			listItem.exsubs.userdata.soldiertypes.push(soldier.resid);
			listItem.exsubs.soldiertype.addItem({text:RStrUtil.getSoldierNameByResId(soldier.resid)});
		}
	};
	
	var _addFreeSoldierTypes = function(listItem){
		var soldiers = m_g.getImgr().getSoldiers();
		for ( var i=0; i<soldiers.length; ++i ) {
			var soldier = soldiers[i];
			if ( TQ.find(listItem.exsubs.userdata.soldiertypes, null, soldier.id) != null ) continue;
			
			listItem.exsubs.userdata.soldiertypes.push(soldier.id);
			listItem.exsubs.soldiertype.addItem({text:RStrUtil.getSoldierNameByResId(soldier.id)});
		}
	};
	
	var _addEmptyType = function(listItem){
		listItem.exsubs.soldiertype.addItem({text:rstr.assignsoldierdlg.lbl.nohas});
		listItem.exsubs.userdata.soldiertypes.push(0);
	};
});

UpdateFreeSoldierList = Class.extern(function(){
	this.setListItems = function(g, list){
		var soldiers = g.getImgr().getSoldiers();
		list.setItemCount(soldiers.length);
		for ( var i=0; i<soldiers.length; ++i ) {
			var soldier = soldiers[i];
			var listItem = list.getItem(i);
			TQ.setText(listItem.exsubs.soldiertype, RStrUtil.getSoldierNameByResId(soldier.id));
			TQ.setText(listItem.exsubs.soldiernumber, soldier.number);
		}
	};
}).snew();

AssignSoldiersHdr = Class.extern(function(){
	var m_g = null;
	var m_this = null;
	var m_list = null;
	var m_soldierTypeIsChanging = false;
	var m_heros = null;
	var m_filler = null;
	var m_ob = null;
	
	this.init = function(g, list, ob){
		m_this = this;
		m_g = g;
		m_list = list;
		m_ob = ob;
		m_filler = FillSoldierDropTypeList.snew(m_g);
	};
	
	this.setHeros = function(heros){
		m_heros = heros;
	};
	
	this.setCallers = function(confirmCaller){
		_setListSoldierTypeCallers();
		_setListSoldierNumberCallers();
		_setListConfirmBtnCallers(confirmCaller);
		_setListCurSoldierType();
	};
	
	this.fillSoldierDropType = function(listItem, soldier){
		m_filler.fill(listItem, soldier);
	};
	
	var _setListSoldierTypeCallers = function(){
		for ( var i=0; i<m_list.getCount(); ++i ){
			var listItem = m_list.getItem(i);
			
			listItem.exsubs.soldiertype.setId(i);
			listItem.exsubs.soldiertype.setCaller({self:m_this, caller:_onSelectSoldierType});
		}
	};
	
	var _setListSoldierNumberCallers = function(){
		for ( var i=0; i<m_list.getCount(); ++i ){
			var listItem = m_list.getItem(i);
			
			listItem.exsubs.soldiernumber.setId(i);
			listItem.exsubs.soldiernumber.setCaller({self:m_this, caller:_onSoldierNumberChange});
			listItem.exsubs.soldiernumber.setLimit(_onGetSoldierNumberLimit);
		}
	};
	
	var _setListConfirmBtnCallers = function(confirmCaller){
		for ( var i=0; i<m_list.getCount(); ++i ){
			var listItem = m_list.getItem(i);
			
			listItem.exsubs.confirm.setId(i);
			listItem.exsubs.confirm.setCaller(confirmCaller);
		}
	};
	
	var _setListCurSoldierType = function(){
		for ( var i=0; i<m_list.getCount(); ++i ){
			var hero = m_heros[i];
			var listItem = m_list.getItem(i);
			
			TQ.find(listItem.exsubs.userdata.soldiertypes, null, hero.soldier.resid);
			listItem.exsubs.soldiertype.setCurSel(TQ.getLastFindIdx());
		}
	};
	
	var _onSoldierNumberChange = function(number, heroIdx){
		var listItem = m_list.getItem(heroIdx);
		listItem.exsubs.userdata.currentNumber = number;
		if (m_ob) m_ob.onSoldierNumberChange();
		if ( !m_soldierTypeIsChanging && (_getCurSoldierTypeId(heroIdx) == 0) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignsoldierdlg.err.noSoldierType);
		}
	};
	
	var _onGetSoldierNumberLimit = function(heroIdx){
		var curSoldierTypeId = _getCurSoldierTypeId(heroIdx);
		var freeSoldierLeftNumber = _getFreeSoldierLeftNumber(heroIdx, curSoldierTypeId);
		
		var hero = m_heros[heroIdx];
		var carriedSoldierNumber = (hero.soldier.resid == curSoldierTypeId) ? hero.soldier.number : 0;
		var canCarrayMaxNumber = m_g.getImgr().getHeroAttrVal(hero, ATTR.CO);

		return {min:0, max:Math.min(freeSoldierLeftNumber + carriedSoldierNumber, canCarrayMaxNumber)};
	};
	
	var _getCurSoldierTypeId = function(heroIdx){
		var curListItem = m_list.getItem(heroIdx);
		var curSoldierTypeIdx = curListItem.exsubs.soldiertype.getCurSel();
		return curListItem.exsubs.userdata.soldiertypes[curSoldierTypeIdx];
	};
	
	var _getFreeSoldierLeftNumber = function(heroIdx, soldierTypeId){
		var soldiers = m_g.getImgr().getSoldiers();
		var soldier = TQ.find(soldiers, 'id', soldierTypeId);
		if ( !soldier ) return 0;
		
		var totalFreeNumber = soldier.number;
		for ( var i=0; i<m_heros.length; ++i ) {
			if ( i == heroIdx ) continue;
			
			var listItem = m_list.getItem(i);
			var curSoldierTypeIdx = listItem.exsubs.soldiertype.getCurSel();
			var curSoldierTypeId = listItem.exsubs.userdata.soldiertypes[curSoldierTypeIdx];
			if ( curSoldierTypeId != soldierTypeId )  continue;
			
			var usedFreeNumber = listItem.exsubs.userdata.currentNumber;
			var hero = m_heros[i];
			if ( hero.soldier.resid == soldierTypeId ) {
				var carriedSoldierNumber = hero.soldier.number;
				usedFreeNumber -= carriedSoldierNumber;
			}
			
			if ( usedFreeNumber < 0 ) {
				usedFreeNumber = 0;
			}
			
			totalFreeNumber -= usedFreeNumber;
		}
		return totalFreeNumber;
	};
	
	var _onSelectSoldierType = function(e, soldierTypeIdx, heroIdx){
		var listItem = m_list.getItem(heroIdx);
		var hero = m_heros[heroIdx];
		var soldierTypeId = listItem.exsubs.userdata.soldiertypes[soldierTypeIdx];
		
		m_soldierTypeIsChanging = true;
		if ( soldierTypeId == hero.soldier.resid ) {
			listItem.exsubs.soldiernumber.setVal(hero.soldier.number);
		}
		else {
			listItem.exsubs.soldiernumber.setVal(0);
		}
		m_soldierTypeIsChanging = false;
		if (m_ob) m_ob.onSelectSoldierType();
	};
});

AssignSoldiersDlg = Class.extern(function(){
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_freeheros = [];
	var m_assignSoldierHdr = null;
	var m_fillSoliderHdr = null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onUpdateHero);
		m_g.regEvent(EVT.SOLDIERRES, 0, m_this, _onUpdateSoldiersRes);
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		HelpGuider.getNewcomerSpirit().onDlgOpen('assignsoldiers', {parent:m_dlg.getParent(), items:m_items});
	};
	
	this.closeDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	this.hideDlg = function(){
		this.closeDlg();
	};

	this.isShow = function() {
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	this.click = function(){
		_onClickConfirmAllBtn();
	};
	
	this.onSoldierNumberChange = function(){
		HelpGuider.getNewcomerSpirit().onDlgOpen('assignsoldiers', {parent:m_dlg.getParent(), items:m_items});
	};
	
	this.onSelectSoldierType = function(){
		HelpGuider.getNewcomerSpirit().onDlgOpen('assignsoldiers', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.assignsoldierdlg.title, pos:{x:"center", y:30},
							btns:[{btn:{id:0,text:rstr.assignsoldierdlg.btn.confirmall},caller:{self:m_this,caller:_onClickConfirmAllBtn}}
							,{btn:{id:0,text:rstr.comm.close},caller:{self:m_this,caller:_onClickCancelBtn}}
							] });
			m_g.getGUI().initDlg(m_dlg, uicfg.expedition.assignsoldiersdlg, m_items);
			m_assignSoldierHdr = AssignSoldiersHdr.snew(m_g, m_items.herolist, m_this);
			m_fillSoliderHdr = FillSoldiersHdr.snew(m_g, m_items.herolist, SoldierSender);
			_setCallers();
		}
		m_dlg.show();
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		m_items.clearall.setCaller({self:m_this, caller:_onClickClearAllBtn});
		m_items.fullall.setCaller({self:m_this, caller:_onClickFullAllBtn});
	};
	
	var _initInfo = function(){
		_updateHeroList();
		_updateFreeSoldierList();
	};
	
	var _updateHeroList = function(){
		if ( !m_this.isShow() ) return;
		
		_collectFreeHeros();
		_setHeroListCount();
		_setHeroListItems();
		m_assignSoldierHdr.setHeros(m_freeheros);
		m_fillSoliderHdr.setHeros(m_freeheros);
		m_assignSoldierHdr.setCallers({self:m_this, caller:_onClickConfirmBtn});
	};
	
	var _collectFreeHeros = function(){
		m_freeheros = m_g.getImgr().collectFreeHeros();
	};	
	
	var _setHeroListCount = function(){
		m_items.herolist.setItemCount(m_freeheros.length);
	};
	
	var _setHeroListItems = function(){
		var imgr = m_g.getImgr();
		for ( var i=0; i<m_freeheros.length; ++i ){
			var hero = m_freeheros[i];
			var listItem = m_items.herolist.getItem(i);
			
			TQ.setText(listItem.exsubs.name, hero.name);
			var healthVal = imgr.getHeroAttrVal(hero, ATTR.HEALTH);
			TQ.setTextEx(listItem.exsubs.health, RStrUtil.getHealthStr(healthVal));
			TQ.setTextEx(listItem.exsubs.prof, rstr.comm.heroprofs[hero.prof]);
			TQ.setTextEx(listItem.exsubs.level, hero.level);
			TQ.setTextEx(listItem.exsubs.maxnum, imgr.getHeroAttrVal(hero, ATTR.CO));
			TQ.setTextEx(listItem.exsubs.state, rstr.comm.herostate[hero.state]);
			m_assignSoldierHdr.fillSoldierDropType(listItem, hero.soldier);
		}
	};
	
	var _updateFreeSoldierList = function(){
		if ( !m_this.isShow() ) return;
		UpdateFreeSoldierList.setListItems(m_g, m_items.soldierlist);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			HelpGuider.getNewcomerSpirit().onDlgClose('assignsoldiers');
		}
	};
	
	var _onClickClearAllBtn = function(){
		m_fillSoliderHdr.clearAllSoldiers();
	};
	
	var _onClickFullAllBtn = function(){
		m_fillSoliderHdr.fillAll();
	};
	
	var _onClickConfirmAllBtn = function(){
		m_fillSoliderHdr.confirmAll();
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _onUpdateHero = function(){
		_updateHeroList();
	};
	
	var _onUpdateSoldiersRes = function(){
		_updateHeroList();
		_updateFreeSoldierList();
	};
	
	var _onClickConfirmBtn = function(heroIdx){
		m_fillSoliderHdr.confirm(heroIdx);
	};
});
