/******************************************************************************
******************************************************************************/
FightResultDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_TAB_RESULT_IDX = 0;
	var C_TAB_ROUNDSHOW_IDX = 1;
	
	var m_g = null;
	var m_this = null;
	_lc_.m_dlg = null;
	var m_items = {};
	var m_armyId = 0;
	var m_fightId = 0;
	_lc_.m_fightResultPanel = null;
	_lc_.m_roundShowPanel = null;
	_lc_.m_hideCaller = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(armyId, fightId){
		_setParams(armyId, fightId);
		_lc_._initDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		_lc_.m_dlg.hide();
	};
	
	this.setHideCaller = function(caller){
		_lc_.m_hideCaller = caller;
	};

	this.isShow = function() {
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	var _setParams = function(armyId, fightId){
		m_armyId = armyId;
		m_fightId = fightId;	
	};
	
	_lc_._initDlg = function(){
		if ( !_lc_.m_dlg ) {
			_lc_.m_dlg = Dialog.snew(m_g,{modal:true,
					title:rstr.military.fightresult.title,
					pos:{x:'center', y:40}
				});
			m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.military.fightresult, m_items);
			_lc_.m_dlg.setCaller({self:m_this, caller:_lc_._onDlgEvent});	
			_lc_._setTabs();
			_lc_._createPanels();
		}
		_lc_.m_dlg.show();
	};
	
	_lc_._setTabs = function(){
		for ( var i=0; i<rstr.military.fightresult.tabs.length; ++i ) {
			m_items.tabList.setTabText(i, rstr.military.fightresult.tabs[i]);
		}
	};
	
	_lc_._createPanels = function(){
		var resultTab = m_items.tabList.getTabItems(C_TAB_RESULT_IDX);
		_lc_.m_fightResultPanel = FightResultTabPanel.snew(m_g, resultTab);
		
		var roundShowTab = m_items.tabList.getTabItems(C_TAB_ROUNDSHOW_IDX);
		_lc_.m_roundShowPanel = FightRoundShowTabPanel.snew(m_g, roundShowTab);
	};
	
	var _initInfo = function(){
		m_items.tabList.activeTab(C_TAB_RESULT_IDX);
		_lc_.m_fightResultPanel.updateFightResults( m_g.getImgr().getFightDemoResult(m_armyId, m_fightId) );
		_lc_.m_roundShowPanel.updateFightActions( m_g.getImgr().getFightDemoRounds(m_armyId, m_fightId) );
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			if ( _lc_.m_hideCaller )  {
				_lc_.m_hideCaller.caller.call(_lc_.m_hideCaller.self);
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
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	_lc_.m_resultTab = null;
	var m_campDomGetters = null;
	_lc_.m_fightResultMaker = null;
	
	this.init = function(g, resultTab){
		m_g = g;
		_lc_.m_resultTab = resultTab;
		m_this = this;
		_lc_.m_fightResultMaker = FightResultMaker.snew(m_g);
		m_campDomGetters = {
			'attacker':FRTAttackCampDom.snew(_lc_.m_resultTab)
			,'defender':FRTTargetCampDom.snew(_lc_.m_resultTab)
		};
	};
	
	this.updateFightResults = function(fightDemoResult){
		if (fightDemoResult == null) {
			return;
		}
		
		_lc_._setRoleInfos('attacker', fightDemoResult.attacker);
		_lc_._setRoleInfos('defender', fightDemoResult.defender);
		_lc_._setFightResultImg(fightDemoResult);
		_lc_._setHerosInfos('attacker', fightDemoResult.attacker);
		_lc_._setHerosInfos('defender', fightDemoResult.defender);
		_lc_._setCityDefExpend(fightDemoResult);
		_lc_._setGetOrLostResPanelTitle(fightDemoResult);
		_lc_._setGetOrLostResPanel('attacker', fightDemoResult.attacker);
		_lc_._setGetOrLostResPanel('defender', fightDemoResult.defender);
	};
	
	_lc_._getCampGetter = function(campType) {
		return m_campDomGetters[campType];
	};
	
	_lc_._setRoleInfos = function(campType, campData){
		var doms = _lc_._getCampGetter(campType).getRoleInfoDoms();
		IMG.setBKImage(doms.icon, IMG.makeBigImg(campData.role.icon));
		TQ.setText(doms.name, campData.role.name);
		TQ.setText(doms.level, campData.role.level);
		TQ.setText(doms.alliance, campData.role.alli);
	};
	
	_lc_._setFightResultImg = function(fightDemoResult) {
		var resultImg = '';
		if ( _lc_.m_fightResultMaker.isMySucc(fightDemoResult) ){
			resultImg = 'fight/retwin.gif';
		}
		else {
			resultImg = 'fight/retfail.gif';
		}
		IMG.setBKImage(_lc_.m_resultTab.fightResult, IMG.makeImg(resultImg));	
	};
	
	_lc_._setGetOrLostResPanelTitle = function(fightDemoResult) {
		var title = _lc_.m_fightResultMaker.getGetOrLostResTitle(fightDemoResult);
		TQ.setText(_lc_.m_resultTab.attackResTitle, title.attack);
		TQ.setText(_lc_.m_resultTab.targetResTitle, title.target);	
	};
	
	_lc_._setHerosInfos = function(campType, campData){
		var list = _lc_._getCampGetter(campType).getHeroList();
		var addAttrTitle = _lc_._getCampGetter(campType).getHeroListAddAttrTitle();
		
		var addAttrTitleString = '';
		list.setItemCount(campData.heros.length);
		for ( var i=0; i<campData.heros.length; ++i ) {
			var listItem = list.getItem(i);
			var hero = campData.heros[i];
			_lc_._setHeroInfos(listItem, hero);
			addAttrTitleString = _lc_._getAddAttrTitleString(hero, addAttrTitleString);
		}
		
		TQ.setText(addAttrTitle, addAttrTitleString);
	};
	
	_lc_._getAddAttrTitleString = function(hero, addAttrTitleString) {
		if ( hero.addExp > 0 ) {
			return rstr.military.fightresult.lbl.exp;
		} else if ( hero.addCredit > 0 ) {
			return rstr.military.fightresult.lbl.credit;
		}
		return addAttrTitleString;
	};
	
	_lc_._setHeroInfos = function(listItem, hero) {
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
	
	_lc_._setCityDefExpend = function(fightDemoResult){
		var s = _lc_.m_fightResultMaker.getHonorString(fightDemoResult) 
			+ _lc_.m_fightResultMaker.getDefExpend(fightDemoResult.defender.defexpend);
		TQ.setRichText(_lc_.m_resultTab.targetLostDefRes, s);
	};
	
	_lc_._setGetOrLostResPanel = function(campType, campData){
		var resPanel =  _lc_._getCampGetter(campType).getResPanel();
		var resText = _lc_.m_fightResultMaker.getGetOrLostResString(campData);
		var dropItemsText = _lc_.m_fightResultMaker.getDropItemsString(campData);
		TQ.setTextEx(resPanel, resText+'<br/>'+dropItemsText);
	};
	//FightResultTabPanel-unittest-end
});

FightRoundShowTabPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	_lc_.m_roundShowTab = null;
	_lc_.m_handlers = {};
	_lc_.m_fightDemo = null;
	_lc_.m_roundsString = '';
	_lc_.m_fightResultMaker = null;
	
	this.init = function(g, roundShowTab){
		m_g = g;
		_lc_.m_roundShowTab = roundShowTab;
		m_this = this;
		_lc_.m_fightResultMaker = FightResultMaker.snew(m_g);
		_lc_._regHandlers();
	};
	
	this.updateFightActions = function(fightDemo){
		if (fightDemo == null) {
			return;
		}
		
		_lc_.m_fightDemo = fightDemo;
		
		_initActorsForDescAttr();
		_lc_._showResult();
		_lc_._showActorsDetail();
		
		for ( var roundIdx=0; roundIdx<_lc_.m_fightDemo.rounds.length; ++roundIdx ) {
			var round = _lc_.m_fightDemo.rounds[roundIdx];
			for ( var actionIdx=0; actionIdx<round.length; ++actionIdx) {
				var action = round[actionIdx];
				_lc_._handleAction(action);
			}
		}
		
		TQ.setHtml(_lc_.m_roundShowTab.rounds.getContainerObj(), _lc_.m_roundsString);
		_lc_.m_roundShowTab.rounds.refresh();
	};
	
	_lc_._regHandlers = function(){
		_lc_.m_handlers['round'] = _lc_._handleRoundAction;
		_lc_.m_handlers['move'] = _lc_._handleMoveAction;
		_lc_.m_handlers['miss'] = _lc_._handleMissAction;
		_lc_.m_handlers['attack'] = _lc_._handleAttackAction;
		_lc_.m_handlers['berserk'] = _lc_._handleBerserkAction;
		_lc_.m_handlers['die'] = _lc_._handleDieAction;
		_lc_.m_handlers['addeff'] = _lc_._handleAddEffectAction;
		_lc_.m_handlers['removeeff'] = _lc_._handleRemoveEffectAction;
		_lc_.m_handlers['effect'] = _lc_._handleEffectAction;
	};
	
	_lc_._showResult = function(){
		_lc_.m_roundsString = _lc_.m_fightResultMaker.getResultTitle(_lc_.m_fightDemo) + rstr.military.fightresult.actions.roundDetail;
	};
	
	_lc_._showActorsDetail = function(){
		if (!IS_DEBUG) return;
		
		for ( var i=0; i<_lc_.m_fightDemo.attacker.actors.length; ++i ) {
			var actor = _lc_.m_fightDemo.attacker.actors[i];
			_showActorDetail(rstr.military.fightresult.actions.attackCamp, actor);
		}
		
		for ( var i=0; i<_lc_.m_fightDemo.defender.actors.length; ++i ) {
			var actor = _lc_.m_fightDemo.defender.actors[i];
			_showActorDetail(rstr.military.fightresult.actions.defendCamp, actor);
		}
	};
	
	var _showActorDetail = function(campTag, actor){
		if ( !actor.detail ) {
			return;
		}
		
		if ( actor.type == ACTOR_TYPE.WALL ) {
			_lc_.m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.wallActorDetail, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.MHP], actor.detail.attrs[ATTR.DE], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.HERO ) {
			_lc_.m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.heroActorDetail, actor.name, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.HI], actor.detail.attrs[ATTR.HU], actor.detail.attrs[ATTR.DE], actor.detail.attrs[ATTR.ES], actor.detail.attrs[ATTR.BER], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.SOLDIER ) {
			_lc_.m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.soldierActorDetail, actor.name, actor.detail.attrs[ATTR.HP], actor.detail.attrs[ATTR.HI], actor.detail.attrs[ATTR.HU], actor.detail.attrs[ATTR.DE], actor.detail.attrs[ATTR.ES], actor.detail.attrs[ATTR.BER], actor.detail.attrs[ATTR.UHP], actor.detail.attackSpeed, actor.detail.attackRange);
		}
		else if ( actor.type == ACTOR_TYPE.DEF ) {
			_lc_.m_roundsString += campTag+TQ.format(rstr.military.fightresult.actions.defActorDetail, actor.name, actor.detail.attrs[ATTR.HU], actor.detail.unitNumber, actor.detail.attackSpeed, actor.detail.attackRange);
		}
	};
	
	_lc_._handleAction = function(action){
		var handler = _lc_.m_handlers[action.event];
		if ( handler ) {
			handler(action);
		}
	};
	
	_lc_._handleRoundAction = function(action){
		_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.round, action.round);
	};
	
	_lc_._handleMoveAction = function(action){
		var actor = _lc_._getActorById(action.id);
		if ( _lc_._isMyActor(actor) ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myMove, actor.name);
		}
		else {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyMove, actor.name);
		}
	};
	
	_lc_._handleMissAction = function(action){
		var attackerActor = _lc_._getActorById(action.userid);
		var defenderActor = _lc_._getActorById(action.targetid);
		if ( _lc_._isMyActor(attackerActor) ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myMiss, attackerActor.name, defenderActor.name);
		}
		else {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyMiss, attackerActor.name, defenderActor.name);
		}
	};
	
	_lc_._handleAttackAction = function(action){
		_makeAttackStr(false, action);
	};
	
	_lc_._handleBerserkAction = function(action){
		_makeAttackStr(true, action);
	};
	
	var _makeAttackStr = function(isBerserk, action){
		var attackerActor = _lc_._getActorById(action.userid);
		var defenderActor = _lc_._getActorById(action.targetid);
		
		var fmtStr = '';
		if ( isBerserk && _lc_._isMyActor(attackerActor) ) {
			fmtStr = rstr.military.fightresult.actions.myBerserk;
		} else if ( isBerserk  ) {
			fmtStr = rstr.military.fightresult.actions.enemyBerserk;
		} else if ( _lc_._isMyActor(attackerActor) ) {
			fmtStr = rstr.military.fightresult.actions.myAttack;
		} else {
			fmtStr = rstr.military.fightresult.actions.enemyAttack;
		}
		
		var factNumber = _subActorHP(defenderActor, action.val);
		_lc_.m_roundsString += TQ.format(fmtStr, attackerActor.name, defenderActor.name, _getSubHPUnitName(defenderActor.type), factNumber);
	};
	
	_lc_._handleDieAction = function(action){
		var actor = _lc_._getActorById(action.id);
		if ( _lc_._isMyActor(actor) ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myDie, actor.name);
		}
		else {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyDie, actor.name);
		}
	};
	
	_lc_._handleAddEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
	
		var actor = _lc_._getActorById(action.id);
		if ( _lc_._isMyActor(actor) ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myAddEffect, actor.name, res.desc);
		}
		else {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyAddEffect, actor.name, res.desc);
		}
	};
	
	_lc_._handleRemoveEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
		
		var actor = _lc_._getActorById(action.id);
		if ( _lc_._isMyActor(actor) ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myRemoveEffect, actor.name, res.desc);
		}
		else {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyRemoveEffect, actor.name, res.desc);
		}
	};
	
	_lc_._handleEffectAction = function(action){
		var res = TQ.find(res_fighteffects, 'effectid', action.effid);
		if ( !res ) {
			return res;
		}
		
		var userActor = _lc_._getActorById(action.userid);
		var targetActor = _lc_._getActorById(action.targetid);
		
		var isSameActor = ( action.userid == action.targetid );
		var isMyActor = _lc_._isMyActor(userActor);
		
		if ( isMyActor && isSameActor ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myUseToSelfEffect, userActor.name, res.desc, _lc_._getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( isMyActor && !isSameActor ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.myUseToOtherEffect, userActor.name, targetActor.name, res.desc, _lc_._getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( !isMyActor && isSameActor ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyUseToSelfEffect, userActor.name, res.desc, _lc_._getAttrDescByEffect(res.isHelpful, action));
		}
		else if ( !isMyActor && !isSameActor ) {
			_lc_.m_roundsString += TQ.format(rstr.military.fightresult.actions.enemyUseToOtherEffect, userActor.name, targetActor.name, res.desc, _lc_._getAttrDescByEffect(res.isHelpful, action));
		}
	};
	
	_lc_._getAttrDescByEffect = function(isHelpful, action){
		var attr = TQ.qfind(res_attrs, 'id', action.attr);
		if ( action.attr == ATTR.HP ) {
			var targetActor = _lc_._getActorById(action.targetid);
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
	
	_lc_._getActorById = function(actorId){
		var actor = TQ.find(_lc_.m_fightDemo.attacker.actors, 'id', actorId);
		if ( actor != null ) {
			actor.camp = 'attacker';
			_initForDescAttr(actor);
			return actor; 
		}
		
		actor = TQ.find(_lc_.m_fightDemo.defender.actors, 'id', actorId);
		actor.camp = 'defender';
		_initForDescAttr(actor);
		return actor;
	};
	
	var _initActorsForDescAttr = function(){
		for ( var i=0; i<_lc_.m_fightDemo.attacker.actors.length; ++i ) {
			var actor = _lc_.m_fightDemo.attacker.actors[i];
			actor.fordesc = null;
			_initForDescAttr(actor);
		}
		
		for ( var i=0; i<_lc_.m_fightDemo.defender.actors.length; ++i ) {
			var actor = _lc_.m_fightDemo.defender.actors[i];
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
	
	_lc_._isMyActor = function(actor){
		if ( actor.camp == 'attacker' && _lc_.m_fightDemo.myIsAttacker ){
			return true;
		}
		
		if ( actor.camp == 'defender' && !_lc_.m_fightDemo.myIsAttacker ){
			return true;
		}
		
		return false;
	};
	
	//FightRoundShowTabPanel-unittest-end
});
