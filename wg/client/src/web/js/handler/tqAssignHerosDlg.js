/******************************************************************************
******************************************************************************/
AssignHerosDlg = Class.extern(function(){
	var DEFAULT_LINEUP_ID = 180001;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_caller = null;
	var m_selHeros = [0,0,0,0,0];
	var m_params = {canEmpty:false};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onUpdateHero);
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(params){
		if ( params ) m_params = params;
		_initDlg();
		_initInfo();
		HelpGuider.getNewcomerSpirit().onDlgOpen('assignheros', {parent:m_dlg.getParent(), items:m_items});
	};
	
	this.closeDlg = function(){
		if (m_dlg) m_dlg.hide();
	};

	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.setCaller = function(caller) {
		m_caller = caller;
	};
	
	this.click = function(){
		_onClickConfirmBtn();
	};
	
	this.hasAssignedHero = function(){
		return _hasAssignedHero();
	};
	
	this.getCoreDlg = function(){
		return m_dlg;
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.assignherosdlg.title, pos:{x:"center", y:30},
							btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickConfirmBtn}}
							,{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickCancelBtn}}
							] });
			m_g.getGUI().initDlg(m_dlg, uicfg.expedition.assignherosdlg, m_items);
			_setCallers();
		}
		m_dlg.show();
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		_setHeroListCaller();
		_setLineupListCaller();
		_setCommBtnsCaller();
	};
	
	var _setHeroListCaller = function(){
		m_items.herolist.setCaller({self:m_this, caller:_onClickHeroListItem});
	};
	
	var _setLineupListCaller = function(){
		m_items.lineuplist.setCaller({self:m_this, caller:_onClickLineupItem});
	};
	
	var _setCommBtnsCaller = function(){
		m_items.autosel.setCaller({self:m_this, caller:_onClickAutoSelBtn});
		m_items.cancelsel.setCaller({self:m_this, caller:_onClickCancelAllSelectedBtn});
		m_items.assignsoldier.setCaller({self:m_this, caller:_onClickAssignSoldierBtn});
		m_items.team1.setCaller({self:m_this, caller:_onClickSetDefaultTeamBtn});
		m_items.team2.setCaller({self:m_this, caller:_onClickSetDefaultTeamBtn});
		m_items.team3.setCaller({self:m_this, caller:_onClickSetDefaultTeamBtn});
	};
	
	var _initInfo = function(){
		_clearAllSelectHeros();
		_updateHeroList();
		_updateTableGrids();
		_updateLineupList();
	};
	
	var _updateHeroList = function(){
		var freeheros = m_g.getImgr().collectFreeHeros();
		m_items.herolist.setItemCount(freeheros.length);
		for ( var i=0; i<freeheros.length; ++i ){
			var hero = freeheros[i];
			var listItem = m_items.herolist.getItem(i);
			TQ.setText(listItem.exsubs.name, hero.name);
			
			var healthVal = m_g.getImgr().getHeroAttrVal(hero, ATTR.HEALTH);
			TQ.setTextEx(listItem.exsubs.health, RStrUtil.getHealthStr(healthVal));
			
			TQ.setTextEx(listItem.exsubs.prof, rstr.comm.heroprofs[hero.prof]);
			TQ.setTextEx(listItem.exsubs.level, hero.level);
			TQ.setTextEx(listItem.exsubs.soldiertype, RStrUtil.getSoldierNameByResId(hero.soldier.resid) );
			TQ.setTextEx(listItem.exsubs.soldiernumber, hero.soldier.number);
			
			TQ.setRichText(listItem.exsubs.state, rstr.comm.herostate[hero.state]);
			
			listItem.exsubs.sel.setId(hero.id);
		}
	};
	
	var _updateLineupList = function(){
		var lineups = m_g.getImgr().getLineups();
		m_items.lineuplist.setItemCount(lineups.length);
		for ( var i=0; i<lineups.length; ++i ) {
			var listItem = m_items.lineuplist.getItem(i);
			var lineupId = lineups[i];
			var lineupRes = ItemResUtil.findItemres(lineupId);
			TQ.setText(listItem.exsubs.name, lineupRes.name);
			IMG.setBKImage(listItem.exsubs.icon, IMG.makeSmallImg(lineupRes.smallpic));
		}
		m_items.lineuplist.setCurSel(0);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			HelpGuider.getNewcomerSpirit().onDlgClose('assignheros');
		}
	};
	
	var _onUpdateHero = function(){
		if ( !m_this.isShow() ) return;
		_updateHeroList();
	};
		
	var _onClickConfirmBtn = function(){
		if ( m_items.herolist.getCount() == 0 && !m_params.canEmpty ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignherosdlg.err.noFreeHero);
			m_dlg.hide();
			return;
		}
		
		if ( !_hasAssignedHero() && !m_params.canEmpty ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignherosdlg.err.noHero);
			return;
		}
		
		if ( m_caller ) {
			m_caller.caller.call(m_caller.self, _getCurLineupId(), m_selHeros);
		}
		
		m_dlg.hide();
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _onClickHeroListItem = function(e, idx){
		var listItem = m_items.herolist.getItem(idx);
		if ( !listItem ) return;
		
		var lastCheckFlag = listItem.exsubs.sel.getCheck();
		var isWillPress = ( lastCheckFlag == 0 );
		if ( isWillPress ) {
			_selectHeroForExped(listItem);
		}
		else {
			_unselectHeroForExped(listItem);
		}
		
		_updateTableGrids();
	};
	
	var _selectHeroForExped = function(listItem){
		var hasEmptyGrid = ( TQ.find(m_selHeros, null, 0) != null );
		var emptyGridIdx = TQ.getLastFindIdx();
		if ( !hasEmptyGrid ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignherosdlg.err.fullHeros);
			return ;
		}
		
		var heroId = listItem.exsubs.sel.getId();
		var hero = m_g.getImgr().getHero(heroId);
		if ( (!hero.soldier) || (hero.soldier.resid == 0) || (hero.soldier.number == 0) ){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignherosdlg.err.noCarrySoldiers);
			return ;
		}

		var thisHeroSelected = ( TQ.find(m_selHeros, null, heroId) != null );
		if ( !thisHeroSelected ) {
			m_selHeros[emptyGridIdx] = heroId;
			listItem.exsubs.sel.setCheck(1);
			listItem.exsubs.sel.setText(' '+(emptyGridIdx+1));
		}
	};
	
	var _unselectHeroForExped = function(listItem){
		var heroId = listItem.exsubs.sel.getId();
		var findThisHero = ( TQ.find(m_selHeros, null, heroId) != null );
		if ( findThisHero ) {
			m_selHeros[TQ.getLastFindIdx()] = 0;
		}
		listItem.exsubs.sel.setCheck(0);
		listItem.exsubs.sel.setText('');	
	};
	
	var _onClickLineupItem = function(e, idx){
		_setLineupDesc();
		_updateTableGrids();
	};
	
	var _onClickAutoSelBtn = function(){
		_clearAllSelectHeros();
		_selectHerosByOrder();
		_updateTableGrids();
	};
	
	var _onClickCancelAllSelectedBtn = function(){
		_clearAllSelectHeros();
		_updateTableGrids();
	};
	
	var _onClickAssignSoldierBtn = function(){
		UIM.openDlg('assignsoldiers');
	};
	
	var _onClickSetDefaultTeamBtn = function(teamId){
		if ( !_hasAssignedHero() )  {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.assignherosdlg.err.noHero);
			return;
		}
		
		MilitarySender.sendDefaultTeam(m_g, teamId, _getCurLineupId(), m_selHeros);
	};
	
	var _setLineupDesc = function() {
		var lineupRes = _getCurLineupRes();
		TQ.setText(m_items.lineupdesc, lineupRes.desc);
	};
	
	var _updateTableGrids = function() {
		_disableAllGrids();
		_empyLineupGrids();
		_showHerosInLineupGrids();
		HelpGuider.getNewcomerSpirit().onDlgOpen('assignheros', {parent:m_dlg.getParent(), items:m_items});
	};
	
	var _disableAllGrids = function(){
		for ( var i=0, cnt=m_items.tablelist.getCount(); i<cnt; ++i ) {
			var listItem = m_items.tablelist.getItem(i);
			IMG.setBKImage(listItem.exsubs.icon, '');
			IMG.setBKImage(listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/small_disablebak.gif'));
		}
	};
	
	var _empyLineupGrids = function(){
		var lineupRes = _getCurLineupRes();
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			var listItem = m_items.tablelist.getItem(gridIdx);
			IMG.setBKImage(listItem.exsubs.icon, '');
			IMG.setBKImage(listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/small_emptybak.gif'));
		}
	};
	
	var _showHerosInLineupGrids = function(){
		var lineupRes = _getCurLineupRes();
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			var heroId = m_selHeros[i];
			if ( heroId == 0 ) continue;
			
			var listItem = m_items.tablelist.getItem(gridIdx);
			var hero = m_g.getImgr().getHero(heroId);
			IMG.setBKImage(listItem.exsubs.icon, IMG.makeSmallImg(hero.icon));
		}
	};
	
	var _clearAllSelectHeros = function(){
		m_selHeros = [0,0,0,0,0];
		for ( var i=0, cnt=m_items.herolist.getCount(); i<cnt; ++i ){
			var listItem = m_items.herolist.getItem(i);
			listItem.exsubs.sel.setCheck(0);
			listItem.exsubs.sel.setText('');
		}
	};
	
	var _selectHerosByOrder = function(){
		var freeheros = m_g.getImgr().collectFreeHeros();
		var allCount = m_items.herolist.getCount();
		for ( var allIdx=0, selIdx=0; (allIdx<allCount) && (selIdx < m_selHeros.length) ; ++allIdx ) {
			var listItem = m_items.herolist.getItem(allIdx);
			var hero = freeheros[allIdx];
			if ( (hero.soldier.resid == 0) || (hero.soldier.number == 0) ) {
				continue;
			}
			
			listItem.exsubs.sel.setCheck(1);
			listItem.exsubs.sel.setText(' '+(selIdx+1));
			m_selHeros[selIdx] = hero.id;
			selIdx++;
		}
	};
	
	var _getCurLineupRes = function(){
		var lineupId = _getCurLineupId();
		return ItemResUtil.findItemres(lineupId);
	};
	
	var _getCurLineupId = function(){
		var lineupIdx = m_items.lineuplist.getCurSel();
		var lineups = m_g.getImgr().getLineups();
		var lineupId = lineups[lineupIdx];
		return lineupId ? lineupId : DEFAULT_LINEUP_ID;
	};
	
	var _hasAssignedHero = function(){
		for ( var i=0; i<m_selHeros.length; ++i ) {
			if ( m_selHeros[i] > 0 ) return true;
		}
		return false;
	};
});
