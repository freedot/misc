/******************************************************************************
******************************************************************************/
FightResultDlg = Class.extern(function(){
	//FightResultDlg-unittest-start
	var C_TAB_RESULT_IDX = 0;
	var C_TAB_ROUNDSHOW_IDX = 1;
	
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_armyId = 0;
	var m_fightId = 0;
	var m_fightResultPanel = null;
	var m_roundShowPanel = null;
	var m_hideCaller = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(armyId, fightId){
		_setParams(armyId, fightId);
		_initDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	this.setHideCaller = function(caller){
		m_hideCaller = caller;
	};

	this.isShow = function() {
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _setParams = function(armyId, fightId){
		m_armyId = armyId;
		m_fightId = fightId;	
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:true,
					title:rstr.military.fightresult.title,
					pos:{x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.military.fightresult, m_items);
			m_dlg.setCaller({self:m_this, caller:_onDlgEvent});	
			_setTabs();
			_createPanels();
		}
		m_dlg.show();
	};
	
	var _setTabs = function(){
		for ( var i=0; i<rstr.military.fightresult.tabs.length; ++i ) {
			m_items.tabList.setTabText(i, rstr.military.fightresult.tabs[i]);
		}
	};
	
	var _createPanels = function(){
		var resultTab = m_items.tabList.getTabItems(C_TAB_RESULT_IDX);
		m_fightResultPanel = FightResultTabPanel.snew(m_g, resultTab);
		
		var roundShowTab = m_items.tabList.getTabItems(C_TAB_ROUNDSHOW_IDX);
		m_roundShowPanel = FightRoundShowTabPanel.snew(m_g, roundShowTab);
	};
	
	var _initInfo = function(){
		m_items.tabList.activeTab(C_TAB_RESULT_IDX);
		m_fightResultPanel.updateFightResults( m_g.getImgr().getFightDemoResult(m_armyId, m_fightId) );
		m_roundShowPanel.updateFightActions( m_g.getImgr().getFightDemoRounds(m_armyId, m_fightId) );
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			if ( m_hideCaller )  {
				m_hideCaller.caller.call(m_hideCaller.self);
			}
		}
	};
	
	//FightResultDlg-unittest-end
});

FRTAttackCampDom = Class.extern(function(){
	var m_resultTab = null;
	this.init = function(resultTab){
		m_resultTab = resultTab;
	};
	
	this.getRoleInfoDoms = function(){
		return {'icon':m_resultTab.attackIcon, 'name':m_resultTab.attackName, 'level':m_resultTab.attackLevel, 'alliance':m_resultTab.attackAlliance};
	};
	
	this.getHeroList = function(){
		return m_resultTab.attackList;
	};
	
	this.getHeroListAddAttrTitle = function(){
		return m_resultTab.attackerAddAttrHead;
	};
	
	this.getResPanel = function(){
		return m_resultTab.attackRes;
	};
});

FRTTargetCampDom = Class.extern(function(){
	var m_resultTab = null;
	this.init = function(resultTab){
		m_resultTab = resultTab;
	};
	
	this.getRoleInfoDoms = function(){
		return {'icon':m_resultTab.targetIcon, 'name':m_resultTab.targetName, 'level':m_resultTab.targetLevel, 'alliance':m_resultTab.targetAlliance};
	};
	
	this.getHeroList = function(){
		return m_resultTab.targetList;
	};
	
	this.getHeroListAddAttrTitle = function(){
		return m_resultTab.targetAddAttrHead;
	};
	
	this.getResPanel = function(){
		return m_resultTab.targetRes;
	};
});

FightResultTabPanel = Class.extern(function(){
	//FightResultTabPanel-unittest-start
	var m_g = null;
	var m_this = null;
	var m_resultTab = null;
	var m_campDomGetters = null;
	var m_fightResultMaker = null;
	
	this.init = function(g, resultTab){
		m_g = g;
		m_resultTab = resultTab;
		m_this = this;
		m_fightResultMaker = FightResultMaker.snew(m_g);
		m_campDomGetters = {
			'attacker':FRTAttackCampDom.snew(m_resultTab)
			,'defender':FRTTargetCampDom.snew(m_resultTab)
		};
	};
	
	this.updateFightResults = function(fightDemoResult){
		if (fightDemoResult == null) {
			return;
		}
		
		_setRoleInfos('attacker', fightDemoResult.attacker);
		_setRoleInfos('defender', fightDemoResult.defender);
		_setFightResultImg(fightDemoResult);
		_setHerosInfos('attacker', fightDemoResult.attacker);
		_setHerosInfos('defender', fightDemoResult.defender);
		_setCityDefExpend(fightDemoResult);
		_setGetOrLostResPanelTitle(fightDemoResult);
		_setGetOrLostResPanel('attacker', fightDemoResult.attacker);
		_setGetOrLostResPanel('defender', fightDemoResult.defender);
	};
	
	var _getCampGetter = function(campType) {
		return m_campDomGetters[campType];
	};
	
	var _setRoleInfos = function(campType, campData){
		var doms = _getCampGetter(campType).getRoleInfoDoms();
		IMG.setBKImage(doms.icon, IMG.makeBigImg(campData.role.icon));
		TQ.setText(doms.name, campData.role.name);
		TQ.setText(doms.level, campData.role.level);
		TQ.setText(doms.alliance, campData.role.alli);
	};
	
	var _setFightResultImg = function(fightDemoResult) {
		var resultImg = '';
		if ( m_fightResultMaker.isMySucc(fightDemoResult) ){
			resultImg = 'fight/retwin.gif';
		}
		else {
			resultImg = 'fight/retfail.gif';
		}
		IMG.setBKImage(m_resultTab.fightResult, IMG.makeImg(resultImg));	
	};
	
	var _setGetOrLostResPanelTitle = function(fightDemoResult) {
		var title = m_fightResultMaker.getGetOrLostResTitle(fightDemoResult);
		TQ.setText(m_resultTab.attackResTitle, title.attack);
		TQ.setText(m_resultTab.targetResTitle, title.target);	
	};
	
	var _setHerosInfos = function(campType, campData){
		var list = _getCampGetter(campType).getHeroList();
		var addAttrTitle = _getCampGetter(campType).getHeroListAddAttrTitle();
		
		var addAttrTitleString = '';
		list.setItemCount(campData.heros.length);
		for ( var i=0; i<campData.heros.length; ++i ) {
			var listItem = list.getItem(i);
			var hero = campData.heros[i];
			_setHeroInfos(listItem, hero);
			addAttrTitleString = _getAddAttrTitleString(hero, addAttrTitleString);
		}
		
		TQ.setText(addAttrTitle, addAttrTitleString);
	};
	
	var _getAddAttrTitleString = function(hero, addAttrTitleString) {
		if ( hero.addExp > 0 ) {
			return rstr.military.fightresult.lbl.exp;
		} else if ( hero.addCredit > 0 ) {
			return rstr.military.fightresult.lbl.credit;
		}
		return addAttrTitleString;
	};
	
	var _setHeroInfos = function(listItem, hero) {
		TQ.setText(listItem.exsubs.name, hero.name);
		TQ.setText(listItem.exsubs.level, hero.level);
		TQ.setText(listItem.exsubs.soldierName, RStrUtil.getSoldierNameByResId(hero.soldier.resid));
		TQ.setText(listItem.exsubs.soldierNumber, hero.soldier.number);
		TQ.setText(listItem.exsubs.lostNumber, hero.soldier.loss);
		TQ.setText(listItem.exsubs.reviveNumber, hero.soldier.revive);
		
		var addAttrNumber = 0;
		if ( hero.addExp > 0 ) {
			addAttrNumber = hero.addExp;
		} else if ( hero.addCredit > 0 ) {
			addAttrNumber = hero.addCredit;
		}
		TQ.setText(listItem.exsubs.addAttrNumber, addAttrNumber);
	};
	
	var _setCityDefExpend = function(fightDemoResult){
		var s = m_fightResultMaker.getHonorString(fightDemoResult) 
			+ m_fightResultMaker.getDefExpend(fightDemoResult.defender.defexpend);
		TQ.setRichText(m_resultTab.targetLostDefRes, s);
	};
	
	var _setGetOrLostResPanel = function(campType, campData){
		var resPanel =  _getCampGetter(campType).getResPanel();
		var resText = m_fightResultMaker.getGetOrLostResString(campData);
		var dropItemsText = m_fightResultMaker.getDropItemsString(campData);
		TQ.setTextEx(resPanel, resText+'<br/>'+dropItemsText);
	};
	//FightResultTabPanel-unittest-end
});

FightRoundShowTabPanel = Class.extern(function(){
	//FightRoundShowTabPanel-unittest-start
	var m_g = null;
	var m_this = null;
	var m_roundShowTab = null;
	var m_handlers = {};
	var m_fightDemo = null;
	var m_roundsString = '';
	var m_fightResultMaker = null;
	
	this.init = function(g, roundShowTab){
		m_g = g;
		m_roundShowTab = roundShowTab;
		m_this = this;
		m_fightResultMaker = FightResultMaker.snew(m_g);
		_regHandlers();
	};
	
	this.updateFightActions = function(fightDemo){
		if (fightDemo == null) {
			return;
		}
		
		m_fightDemo = fightDemo;
		
		_initActorsForDescAttr();
		_showResult();
		_showActorsDetail();
		
		for ( var roundIdx=0; roundIdx<m_fightDemo.rounds.length; ++roundIdx ) {
			var round = m_fightDemo.rounds[roundIdx];
			for ( var actionIdx=0; actionIdx<round.length; ++actionIdx) {
				var action = round[actionIdx];
				_handleAction(action);
			}
		}
		
		TQ.setHtml(m_roundShowTab.rounds.getContainerObj(), m_roundsString);
		m_roundShowTab.rounds.refresh();
	};
	
	var _regHandlers = function(){
		m_handlers['round'] = _handleRoundAction;
		m_handlers['move'] = _handleMoveAction;
		m_handlers['miss'] = _handleMissAction;
		m_handlers['attack'] = _handleAttackAction;
		m_handlers['berserk'] = _handleBerserkAction;
		m_handlers['die'] = _handleDieAction;
		m_handlers['addeff'] = _handleAddEffectAction;
		m_handlers['removeeff'] = _handleRemoveEffectAction;
		m_handlers['effect'] = _handleEffectAction;
	};
	
	var _showResult = function(){
		m_roundsString = m_fightResultMaker.getResultTitle(m_fightDemo) + rstr.military.fightresult.actions.roundDetail;
	};
	
	var _showActorsDetail = function(){
		if (!IS_DEBUG) return;
		
		for ( var i=0; i<m_fightDemo.attacker.actors.length; ++i ) {
			var actor = m_fightDemo.attacker.actors[i];
			_showActorDetail(rstr.military.fightresult.actions.attackCamp, actor);
		}
		
		for ( var i=0; i<m_fightDemo.defender.actors.length; ++i ) {
			var actor = m_fightDemo.defender.actors[i];
			_showActorDetail(rstr.military.fightresult.actions.defendCamp, actor);
		}
	};
	
	var _showActorDetail = function(campTag, actor){
		if ( !actor.detail ) {
			return;
		}
		
		if ( actor.type == ACTOR_TYPE.WALL ) {
			m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.wallActorDetail, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.MHP], actor.detail.attrs[ATTR.DE], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.HERO ) {
			m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.heroActorDetail, actor.name, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.HI], actor.detail.attrs[ATTR.HU], actor.detail.attrs[ATTR.DE], actor.detail.attrs[ATTR.ES], actor.detail.attrs[ATTR.BER], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.SOLDIER ) {
			m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.soldierActorDetail, actor.name, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.HI], actor.detail.attrs[ATTR.HU], actor.detail.attrs[ATTR.DE], actor.detail.attrs[ATTR.ES], actor.detail.attrs[ATTR.BER], actor.detail.attrs[ATTR.UHP], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.DEF ) {
			m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.defActorDetail, actor.name, actor.detail.attrs[ATTR.HU], actor.detail.unitNumber, actor.detail.attackSpeed, actor.detail.attackRange);
		}
	};
	
	var _handleAction = function(action){
		var handler = m_handlers[action.event];
		if ( handler ) {
			handler(action);
		}
	};
	
	var _handleRoundAction = function(action){
		m_roundsString += TQ.format(rstr.military.fightresult.actions.round, action.round);
	};
	
	var _handleMoveAction = function(action){
		var actor = _getActorById(action.id);
		if ( _isMyActor(actor) ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myMove, actor.name);
		}
		else {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyMove, actor.name);
		}
	};
	
	var _handleMissAction = function(action){
		var attackerActor = _getActorById(action.userid);
		var defenderActor = _getActorById(action.targetid);
		if ( _isMyActor(attackerActor) ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myMiss, attackerActor.name, defenderActor.name);
		}
		else {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyMiss, attackerActor.name, defenderActor.name);
		}
	};
	
	var _handleAttackAction = function(action){
		_makeAttackStr(false, action);
	};
	
	var _handleBerserkAction = function(action){
		_makeAttackStr(true, action);
	};
	
	var _makeAttackStr = function(isBerserk, action){
		var attackerActor = _getActorById(action.userid);
		var defenderActor = _getActorById(action.targetid);
		
		var fmtStr = '';
		if ( isBerserk && _isMyActor(attackerActor) ) {
			fmtStr = rstr.military.fightresult.actions.myBerserk;
		} else if ( isBerserk  ) {
			fmtStr = rstr.military.fightresult.actions.enemyBerserk;
		} else if ( _isMyActor(attackerActor) ) {
			fmtStr = rstr.military.fightresult.actions.myAttack;
		} else {
			fmtStr = rstr.military.fightresult.actions.enemyAttack;
		}
		
		var factNumber = _subActorHP(defenderActor, action.val);
		m_roundsString += TQ.format(fmtStr, attackerActor.name, defenderActor.name, _getSubHPUnitName(defenderActor.type), factNumber);
	};
	
	var _handleDieAction = function(action){
		var actor = _getActorById(action.id);
		if ( _isMyActor(actor) ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myDie, actor.name);
		}
		else {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyDie, actor.name);
		}
	};
	
	var _handleAddEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
	
		var actor = _getActorById(action.id);
		if ( _isMyActor(actor) ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myAddEffect, actor.name, res.desc);
		}
		else {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyAddEffect, actor.name, res.desc);
		}
	};
	
	var _handleRemoveEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
		
		var actor = _getActorById(action.id);
		if ( _isMyActor(actor) ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myRemoveEffect, actor.name, res.desc);
		}
		else {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyRemoveEffect, actor.name, res.desc);
		}
	};
	
	var _handleEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
		
		var userActor = _getActorById(action.userid);
		var targetActor = _getActorById(action.targetid);
		
		var isSameActor = ( action.userid == action.targetid );
		var isMyActor = _isMyActor(userActor);
		
		if ( isMyActor && isSameActor ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myUseToSelfEffect, userActor.name, res.desc, _getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( isMyActor && !isSameActor ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.myUseToOtherEffect, userActor.name, targetActor.name, res.desc, _getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( !isMyActor && isSameActor ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyUseToSelfEffect, userActor.name, res.desc, _getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( !isMyActor && !isSameActor ) {
			m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyUseToOtherEffect, userActor.name, targetActor.name, res.desc, _getAttrDescByEffect(res.isHelpful, action));
		}
	};
	
	var _getAttrDescByEffect = function(isHelpful, action){
		var attr = TQ.qfind(res_attrs, 'id', action.attr);
		if ( action.attr == ATTR.HP ) {
			var targetActor = _getActorById(action.targetid);
			if ( action.val > 0 ) {
				if (isHelpful) {
					var factNumber = _addActorHP(targetActor, action.val);
					return TQ.format(rstr.military.fightresult.actions.addHPAttr, _getAddHPUnitName(targetActor.type),  factNumber);
				} else {
					var factNumber = _subActorHP(targetActor, action.val);
					return TQ.format(rstr.military.fightresult.actions.subHPAttr, _getSubHPUnitName(targetActor.type),  factNumber);
				}
			} else {
				var factNumber = _subActorHP(targetActor, -action.val);
				return TQ.format(rstr.military.fightresult.actions.subHPAttr, _getSubHPUnitName(targetActor.type),  factNumber);
			}
		} else if ( action.val > 0 ) {
			return TQ.format(rstr.military.fightresult.actions.addAttr, action.val,  attr.name);
		} else {
			return TQ.format(rstr.military.fightresult.actions.subAttr, -action.val,  attr.name);
		}
	};
	
	var _subActorHP = function(actor, val){
		var factNumber = Math.ceil(val/actor.fordesc.uhp);
		if ( factNumber > actor.fordesc.facthp ) {
			factNumber = actor.fordesc.facthp;
			actor.fordesc.facthp = 0;
		} else {
			actor.fordesc.facthp -= factNumber;
		}
		return factNumber;
	};
	
	var _addActorHP = function(actor, val){
		var factNumber = Math.ceil(val/actor.fordesc.uhp);
		if ( factNumber+actor.fordesc.facthp > actor.fordesc.factmhp ) {
			factNumber = actor.fordesc.factmhp - actor.fordesc.facthp;
			actor.fordesc.facthp = actor.fordesc.factmhp;
		} else {
			actor.fordesc.facthp += factNumber;
		}
		return factNumber;
	};	
	
	var _getSubHPUnitName = function(type){
		if (type == ACTOR_TYPE.SOLDIER) return rstr.military.fightresult.actions.subSoldierLable;
		else return rstr.military.fightresult.actions.subHPLable;
	};	
	
	var _getAddHPUnitName = function(type){
		if (type == ACTOR_TYPE.SOLDIER) return rstr.military.fightresult.actions.addSoldierLable;
		else return rstr.military.fightresult.actions.addHPLable;
	};	
	
	var _getActorById = function(actorId){
		var actor = TQ.find(m_fightDemo.attacker.actors, 'id', actorId);
		if ( actor != null ) {
			actor.camp = 'attacker';
			_initForDescAttr(actor);
			return actor; 
		}
		
		actor = TQ.find(m_fightDemo.defender.actors, 'id', actorId);
		actor.camp = 'defender';
		_initForDescAttr(actor);
		return actor;
	};
	
	var _initActorsForDescAttr = function(){
		for ( var i=0; i<m_fightDemo.attacker.actors.length; ++i ) {
			var actor = m_fightDemo.attacker.actors[i];
			actor.fordesc = null;
			_initForDescAttr(actor);
		}
		
		for ( var i=0; i<m_fightDemo.defender.actors.length; ++i ) {
			var actor = m_fightDemo.defender.actors[i];
			actor.fordesc = null;
			_initForDescAttr(actor);
		}
	};
	
	var _initForDescAttr = function(actor){
		if ( !actor.fordesc ){
			actor.fordesc = {hp:1, mhp:1, uhp:1, fmax:1, facthp:1, factmhp:1};
			if ( actor.detail ) {
				actor.fordesc.hp = actor.detail.attrs[ATTR.HP];
				actor.fordesc.mhp = actor.detail.attrs[ATTR.HP];
				actor.fordesc.uhp = actor.detail.attrs[ATTR.UHP];
				actor.fordesc.facthp = Math.floor(actor.fordesc.hp/actor.fordesc.uhp);
				actor.fordesc.factmhp = actor.fordesc.facthp;
			}
		}
	};
	
	var _isMyActor = function(actor){
		if ( actor.camp == 'attacker' && m_fightDemo.myIsAttacker ){
			return true;
		}
		
		if ( actor.camp == 'defender' && !m_fightDemo.myIsAttacker ){
			return true;
		}
		
		return false;
	};
	
	//FightRoundShowTabPanel-unittest-end
});
