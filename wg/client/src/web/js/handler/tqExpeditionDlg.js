/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
EXPED_TEAMGRID_MAXCNT = 5;

ExpedTargetUtil = Class.extern(function(){
	var NULL_TYPE = -1;
	this.createNull = function(){
		return {type:NULL_TYPE};
	};
	
	this.getValidTarget = function(target){
		return target ? target : this.createNull();
	};
	
	this.isNull = function(target) {
		return (!target) || (target.type == NULL_TYPE);
	};
	
	this.getDistance = function(g, targetPos) {
		var myPos = g.getImgr().getRoleRes().pos;
		return Math.sqrt((myPos.x - targetPos.x)*(myPos.x - targetPos.x) + (myPos.y - targetPos.y)*(myPos.y - targetPos.y));
	};
	
	this.getMoveNeedTime = function(g, targetPos, speed) {
		var timeHour = this.getDistance(g, targetPos) / speed;
		var timeSecond = Math.floor(timeHour*3600) + res_army_preparetime*res_army_movespeed/speed;
		return timeSecond;
	};
}).snew();

ExpedTargetSpec = Class.extern(function(){
	this.isSatisfiedBy = function(field){
		return ExpedUtil.makeExpedTarget(field) != null;
	};
	
	this.getInvalidTip = function(){
		return rstr.selectexpedtarget.err.noSelTarget;
	};
});

ExpeditionDlg = ListenerBaseDlg.extern(function(){
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_target = ExpedTargetUtil.createNull();
	var m_targetHdr = null;
	var m_targetMgr = null;
	var m_defaultTeamHdr = null;
	var m_lineUpInfoHdr = null;
	var m_targetChecker = null;
	
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_targetChecker = ExpedTargetChecker.snew(m_g);
		m_g.regEvent(EVT.BATTLETIMES_UPDATE, 0, m_this, _onUpdateBattleTime);
	};
	
	this.getItems = function(){
		return m_items;
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(target){
		_initDlg();
		_initInfo(target);
		HelpGuider.getNewcomerSpirit().onDlgOpen('expedition', {parent:m_dlg.getParent(), items:m_items});
		this._notifyOpenDlg();
	};
	
	this.closeDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	this.hideDlg = function(){
		this.closeDlg();
	};

	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.setTarget = function(target) {
		_setTarget(target);
	};
	
	this.getTarget = function(){
		return m_target;
	};
	
	this.hasExpedHeros = function(){
		var canExpedHeroIds = m_lineUpInfoHdr.getCanExpedHeros();
		return ExpedHerosChecker.isValid(m_g, canExpedHeroIds, m_targetHdr.getSelectType());
	};
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,	title:rstr.expeddlg.title, pos:{x:"center", y:30} });
			m_g.getGUI().initDlg(m_dlg, uicfg.expedition.maindlg, m_items);
			m_targetMgr = ExpedTargetHdrMgr.snew(m_g, m_items);
			m_lineUpInfoHdr = ExpedLineupInfoHdr.snew(m_g, m_items);
			m_defaultTeamHdr = ExpedDefaultTeamHdr.snew(m_g, m_items);
			
			m_defaultTeamHdr.setLineUpInfoHdr(m_lineUpInfoHdr);
			
			_setCallers();
			_setImgHelp();
		}
		m_dlg.show();
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		m_items.selecttype.setCaller({self:m_this, caller:_onSelectType});
		m_items.changeforcetab.setCaller({self:m_this, caller:_onClickChangeForcetabBtn});
		m_items.selecttarget.setCaller({self:m_this, caller:_onClickSelectTargetBtn});
		m_items.assignsoldier.setCaller({self:m_this, caller:_onClickAssignSoldierBtn});
		m_items.fillsoldier.setCaller({self:m_this, caller:_onClickFillSoldierBtn});
		m_items.treatment.setCaller({self:m_this, caller:_onClickTreatmentBtn});
		m_items.expedition.setCaller({self:m_this, caller:_onClickExpeditionBtn});
	};
	
	var _setImgHelp = function(){
		TQ.setTextEx(m_items.imghelp, HyperLinkMgr.formatLink(rstr.military.expeddlg.tip.imghelp));
	};
	
	var _initInfo = function(target){
		if ( target ) {
			_setTarget(target);
		}
		else if ( ExpedTargetUtil.isNull(m_target) ) {
			_setTarget( ExpedTargetUtil.createNull() );
		}
		
		_updateTodayBattleTimes();
		_loadForceFromSave();
	};
	
	var _loadForceFromSave = function(){
		var saveForce = m_g.getImgr().getSaveForceByType(FORCELINE_TYPE.COMM);
		m_lineUpInfoHdr.setLineup(saveForce.lineup, saveForce.heros);
		m_lineUpInfoHdr.refresh();
	};
	
	var _setTarget = function(target) {
		m_target = ExpedTargetUtil.getValidTarget(target);
		
		m_targetChecker.setTarget(m_target);
		
		m_defaultTeamHdr.setTarget(m_target);
		
		m_targetMgr.setTarget(m_target);
		m_targetHdr = m_targetMgr.getTargetHdr();
		m_targetHdr.updateTargetName();
		m_targetHdr.updateTargetPos();
		m_targetHdr.updateTargetTypes();
		m_targetHdr.udpateEnemyFightCap();
		
		m_lineUpInfoHdr.setTarget(m_target);
		m_lineUpInfoHdr.setTargetHdr(m_targetHdr);
		m_lineUpInfoHdr.refresh();
		
		m_defaultTeamHdr.update();
		
		m_items.selecttype.select(0);
	};
	
	var _updateTodayBattleTimes = function(){
		if ( !m_this.isShow() ) return;
		var times = m_g.getImgr().getTodayBattleTimes();
		TQ.setTextEx(m_items.todaybattleinfo, TQ.format(rstr.expeddlg.lbl.todaybattleinfo, times.taofa, times.cuihui, times.tiaoxin, times.fightowner) );
	};
	
	var _onUpdateBattleTime = function(){
		_updateTodayBattleTimes();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			HelpGuider.getNewcomerSpirit().onDlgClose('expedition');
		}
	};
	
	var _onSelectType = function(idx){
		m_targetHdr.setSelectType(idx);
		m_targetHdr.updateTypeDesc();
		m_targetHdr.udpateEnemyFightCap();
		m_lineUpInfoHdr.setExpedType( m_targetHdr.getSelectType() );
		m_lineUpInfoHdr.refresh();
	};
	
	var _onClickChangeForcetabBtn = function(){
		if ( ExpedTargetUtil.isNull(m_target) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noTarget);
			return;
		}
		
		var _assignHerosCallback = function(lineup, heroIds){
			m_defaultTeamHdr.clearTeamSel();
			m_lineUpInfoHdr.setLineup(lineup, heroIds);
			m_lineUpInfoHdr.refresh();
			MilitarySender.sendSaveForceLineUp(m_g, FORCELINE_TYPE.COMM, lineup, heroIds);
			TQ.dictCopy(m_g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.COMM, lineup:lineup, heros:heroIds}] );
		};
		var dlg = UIM.getDlg('assignheros');
		dlg.setCaller({self:m_this, caller:_assignHerosCallback});
		dlg.openDlg('comm');
	};
	
	var _onClickSelectTargetBtn = function(){
		var dlg = UIM.getDlg('selectexpedtarget');
		dlg.setCaller({self:m_this, caller:_onSelectTarget});
		dlg.openDlg(ExpedTargetSpec.snew(), {tabIdx:0, typeListIdx:0});
	};
	
	var _onSelectTarget = function(field){
		var target = ExpedUtil.makeExpedTarget(field);
		_setTarget(target);
	};
	
	var _onClickAssignSoldierBtn = function(){
		UIM.openDlg('assignsoldiers');
	};
	
	var _onClickFillSoldierBtn = function(){
		var fillHdr = FillSoldiersHdr.snew(m_g, null, SoldierSender);
		fillHdr.setHeros(m_lineUpInfoHdr.getFreeHeros());
		fillHdr.fillAll();
	};
	
	var _onClickTreatmentBtn = function(){
		TreatmentHeroHdr.treatmentHeros(m_g, m_lineUpInfoHdr.getHeroIds());
	};
	
	var _onClickExpeditionBtn = function(){
		if ( ExpedTargetUtil.isNull(m_target) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noTarget);
			return false;
		}
		
		var canExpedHeroIds = m_lineUpInfoHdr.getCanExpedHeros();
		if ( !ExpedHerosChecker.isValid(m_g, canExpedHeroIds, m_targetHdr.getSelectType()) ) {
			return false;
		}
		
		var isNormalStateWithOtherPlayer = m_targetChecker.isOtherPlayer() 
			&& m_g.getImgr().getFightRefState(m_target.roleId) == REF_ROLESTATE.NORMAL;
		if ( isNormalStateWithOtherPlayer ) {
			m_g.getGUI().sysMsgTips( SMT_WARNING, rstr.expeddlg.err.noDeclareFight );
			return;
		}
		
		var isDelaringFightStateWithOtherPlayer = m_targetChecker.isOtherPlayer() 
			&& m_g.getImgr().getFightRefState(m_target.roleId) == REF_ROLESTATE.DECLARING_FIGHT;
		if ( isDelaringFightStateWithOtherPlayer ) {
			m_g.getGUI().sysMsgTips( SMT_WARNING, rstr.expeddlg.err.declaringFight );
			return;
		}
		
		if ( _isBeyondFightOtherPlayerTimes() ) {
			return;
		}
		
		if ( m_targetMgr.getTargetHdr().isCountryFight() ) {
			var tip = m_targetMgr.getTargetHdr().getCountryFightTip();
			m_g.getGUI().msgBox(rstr.comm.msgts, tip, MB_F_CLOSE, {self:m_this, caller:function(){
				_sendExpeditionCmdAndCloseDlg();
			}}, [rstr.military.expeddlg.expebtn]);
		} else {
			_sendExpeditionCmdAndCloseDlg();
		}
	};
	
	var _isBeyondFightOtherPlayerTimes = function() {
		if ( !m_targetChecker.isOtherPlayer() ) return false;
		
		var times = m_g.getImgr().getTodayBattleTimes();
		if ( (times.taofa + times.cuihui + times.tiaoxin) < res_max_attack_player_times ) return false;
		
		_popMsgBoxForUseOrBuyItem(rstr.expeddlg.warning.attackMaxTimes, res_max_attack_player_times);
		return true;
	};
	
	var _popMsgBoxForUseOrBuyItem = function(formatMsg, maxTimes) {
		var itemRes = ItemResUtil.findItemres(FIXID.CHUSHILING);
		var msg = TQ.format(formatMsg, maxTimes, itemRes.name);
		var hasNumber = m_g.getImgr().getItemNumByResId(FIXID.CHUSHILING);
		if ( hasNumber > 0 ) {
			var _onExpedCallback = function(id){
				if ( id == MB_IDYES ) {
					_sendExpeditionCmdAndCloseDlg();
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, msg,  MB_F_YESNO, {self:m_this, caller:_onExpedCallback} );
		}
		else {
			msg += RStrUtil.makeNoItemBuyMsg(m_g, FIXID.CHUSHILING, 1);
			m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
		}	
	};	
	
	var _sendExpeditionCmdAndCloseDlg = function(){
		var heroIds = m_lineUpInfoHdr.getExpedHerosInLineup();
		var expedType = m_targetHdr.getSelectType();
		var lineupId = m_lineUpInfoHdr.getLineup();
		MilitarySender.sendExped(m_g, m_target, expedType, lineupId, heroIds);
		m_dlg.hide();
	};	
});

ExpedTargetChecker = Class.extern(function(){
	//ExpedTargetChecker-unittest-start
	var m_g = null;
	var m_this = null;
	var m_target = null;
	this.init = function(g) {
		m_g = g;
		m_this = this;
		m_target = ExpedTargetUtil.createNull();
	};
	
	this.setTarget = function(target){
		m_target = ExpedTargetUtil.getValidTarget(target);
	};
	
	this.isSameAlliPlayer = function(){
		if ( !_isPlayerTarget() ) return false;
		if ( !m_target.alliance ) return false;
		
		var myAlliance = m_g.getImgr().getRoleRes().alliance;
		return (myAlliance.uid == m_target.alliance.uid) && (myAlliance.uid != 0);
	};
	
	this.isSelfFieldTarget = function(){
		if ( !_isFieldTarget() ) return false;
		
		return m_g.getImgr().getSelfFieldByGridId(m_target.id) != null;
	};
	
	this.isOtherPlayer = function(){
		if ( !_isPlayerTarget() ) return false;
		
		return !this.isSameAlliPlayer();
	};
	
	this.isOtherFieldTarget = function(){
		if ( !_isFieldTarget() ) return false;
		
		return !this.isSelfFieldTarget();
	};
	
	this.isCopyFieldTarget = function(){
		return ( m_target.type == OBJ_TYPE.COPYFIELD );
	};
	
	var _isPlayerTarget = function(){
		return m_target.type == OBJ_TYPE.ROLE;
	};
	
	var _isFieldTarget = function(){
		return m_target.type == OBJ_TYPE.FIELD;
	};
	//ExpedTargetChecker-unittest-end
});

ExpedLineupInfoHdr = Class.extern(function(){
	//ExpedLineupInfoHdr-unittest-start
	var m_this = null;
	var m_items = null;
	var m_myFightCapRefresher = null;
	var m_forceTabHdr = null;
	var m_targetHdr = null;
	
	this.init = function(g, uiitems){
		m_this = this;
		m_items = uiitems;
		m_myFightCapRefresher = ExpedMyFightCapRefresher.snew(g, uiitems);
		m_forceTabHdr = ExpedForceTabHdr.snew(g, uiitems);
		g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onUpdateHero);
	};
	
	this.setTargetHdr = function(targetHdr){
		m_targetHdr = targetHdr;
	};
	
	this.setTarget = function(target){
		m_myFightCapRefresher.setTarget(target);
		m_forceTabHdr.setTarget(target);
	};
	
	this.setExpedType = function(expedType){
		m_myFightCapRefresher.setExpedType(expedType);
		m_forceTabHdr.setExpedType(expedType);
	};
	
	this.setLineup = function(lineupId, heroIds){
		m_myFightCapRefresher.setLineup(lineupId, heroIds);
		m_forceTabHdr.setLineup(lineupId, heroIds);
		_setBtnsState();
	};
	
	this.refresh = function(){
		m_myFightCapRefresher.refresh();
		m_forceTabHdr.refresh();
		if ( m_targetHdr ) m_targetHdr.updateMoveNeedTime(m_forceTabHdr.getArmySpeed() );
	};
	
	this.getLineup = function(){
		return m_forceTabHdr.getLineup();
	};
	
	this.getHeroIds = function(){
		return m_forceTabHdr.getHeroIds();
	};
	
	this.getFreeHeros = function(){
		return m_forceTabHdr.getFreeHeros();
	};
	
	this.isNeedSingleHero = function(){
		return m_forceTabHdr.isNeedSingleHero();
	};
	
	this.getCanExpedHeros = function(){
		return m_forceTabHdr.getCanExpedHeros();
	};
	
	this.getExpedHerosInLineup = function(){
		return m_forceTabHdr.getExpedHerosInLineup();
	};
	
	this._getArmySpeed = function(){
	};
	
	var _setBtnsState = function(){
		if ( m_myFightCapRefresher.getFirstValidHero() != null ) {
			m_items.fillsoldier.enable(true);
			m_items.treatment.enable(true);
		}
		else {
			m_items.fillsoldier.enable(false);
			m_items.treatment.enable(false);
		}
	};
	
	var _onUpdateHero = function(){
		m_this.refresh();
	};
	//ExpedLineupInfoHdr-unittest-end
});

ExpedMyFightCapRefresher = Class.extern(function(){
	//ExpedMyFightCapRefresher-unittest-start
	var m_g = null;
	var m_items = null;
	var m_this = null;
	var m_targetChecker = null;
	var m_target = ExpedTargetUtil.createNull();
	var m_expedType = null;
	var m_heroIds = [];
	var m_lineupId = 0;
	
	this.init = function(g, uiitems){
		m_g = g;
		m_this = this;
		m_items = uiitems;
		m_targetChecker = ExpedTargetChecker.snew(m_g);
	};
	
	this.setTarget = function(target){
		m_target = ExpedTargetUtil.getValidTarget(target);
		m_targetChecker.setTarget(m_target);
	};
	
	this.setExpedType = function(expedType){
		m_expedType = expedType;
	};
	
	this.setLineup = function(lineupId, heroIds){
		m_lineupId = lineupId;
		m_heroIds = heroIds;
	};
	
	this.refresh = function(){
		TQ.setText(m_items.myfightcap, 0);
		if ( m_expedType == EXPED_TYPE.TIAOXIN 
			|| m_expedType == EXPED_TYPE.DANTIAO ) {
			TQ.setText(m_items.myfightcap, _getFirstHeroSingleFightCap());
		}
		else if ( m_expedType == EXPED_TYPE.PAIQIAN ) {
			if ( m_targetChecker.isSelfFieldTarget() ) {
				TQ.setText(m_items.myfightcap, _getFirstHeroFightCap());
			}
			else {// target is alliance player
				TQ.setText(m_items.myfightcap, _getHerosFightCap() );
			}
		}
		else if ( m_expedType == EXPED_TYPE.TAOFA ) {
			TQ.setText(m_items.myfightcap, _getHerosFightCap() );
		}
		else if ( m_expedType == EXPED_TYPE.CUIHUI ) {
			TQ.setText(m_items.myfightcap, _getHerosFightCap() );
		}
		else if ( m_expedType == EXPED_TYPE.ZHANLING ) {
			TQ.setText(m_items.myfightcap, _getFirstHeroFightCap());
		}
	};
	
	this.getFirstValidHero = function(){
		return _getFirstValidHero();
	};
	
	var _getFirstHeroFightCap = function(){
		var hero = _getFirstValidHero();
		if ( !hero ) return 0;
		return m_g.getImgr().getHeroAttrVal(hero, ATTR.FC);
	};
	
	var _getFirstHeroSingleFightCap = function(){
		var hero = _getFirstValidHero();
		if ( !hero ) return 0;
		return m_g.getImgr().getHeroAttrVal(hero, ATTR.SFC);
	};
	
	var _getHerosFightCap = function(){
		if ( !_isValidLineUp() ) {
			return 0;
		}
		
		var fightCapSum = 0;
		for ( var i=0; i<m_heroIds.length; ++i ) {
			var heroId = m_heroIds[i];
			var hero = m_g.getImgr().getHero( heroId );
			if ( !hero ) continue;
			
			fightCapSum += m_g.getImgr().getHeroAttrVal(hero, ATTR.FC);
		}
		return fightCapSum;
	};
	
	var _isValidLineUp = function(){
		var res = ItemResUtil.findItemres(m_lineupId);
		return (res != null);
	};
	
	var _getFirstValidHero = function(){
		for ( var i=0; i<m_heroIds.length; ++i ) {
			var heroId = m_heroIds[i];
			var hero = m_g.getImgr().getHero( heroId );
			if ( hero ) return hero;
		}
		return null;
	};
	//ExpedMyFightCapRefresher-unittest-end
});

ExpedForceTabHdr = Class.extern(function(){
	//ExpedForceTabHdr-unittest-start
	var m_g = null;
	var m_items = null;
	var m_this = null;
	var m_target = ExpedTargetUtil.createNull();
	var m_expedType = 0;
	var m_lineupId = 0;
	var m_heroIds = [];
	var m_targetChecker = null;
	this.init = function(g, uiitems){
		m_g = g;
		m_this = this;
		m_items = uiitems;
		m_targetChecker = ExpedTargetChecker.snew(m_g);
	};
	
	this.setTarget = function(target){
		m_target = ExpedTargetUtil.getValidTarget(target);
		m_targetChecker.setTarget(m_target);
	};
	
	this.setExpedType = function(expedType){
		m_expedType = expedType;
	};
	
	this.setLineup = function(lineupId, heroIds){
		m_lineupId = lineupId;
		m_heroIds = heroIds;
	};
	
	this.getLineup = function(){
		if ( m_this.isNeedSingleHero() ) {
			return FIXID.DEFAULTLINEUP;
		}
		else {
			return m_lineupId;
		}
	};
	
	this.getHeroIds = function(){
		return m_heroIds;
	};
	
	this.getFreeHeros = function(){
		var heros = [];
		for ( var i=0; i<m_heroIds.length; ++i ) {
			var hero = m_g.getImgr().getHero( m_heroIds[i] );
			if ( !hero ) continue;
			if ( hero.state != HERO_STATE.FREE ) continue;
			heros.push(hero);
		}
		return heros;
	};
	
	this.refresh = function(){
		_updateLineupName();
		_updateForceTabList();
	};
	
	this.isNeedSingleHero = function(){
		if ( m_expedType == EXPED_TYPE.TIAOXIN ) return true;
		if ( m_expedType == EXPED_TYPE.DANTIAO ) return true;
		if ( m_expedType == EXPED_TYPE.ZHANLING ) return true;
		if ( m_targetChecker.isOtherFieldTarget() && m_expedType == EXPED_TYPE.TAOFA ) return true;
		if ( m_targetChecker.isSelfFieldTarget() && m_expedType == EXPED_TYPE.PAIQIAN ) return true;
		
		return false;
	};
	
	this.getCanExpedHeros = function(){
		return _getCanExpedHeros();
	};
	
	this.getExpedHerosInLineup = function(){
		return _getExpedHerosInLineup();
	};
	
	this.getArmySpeed = function(){
		var speed = 0xffffffff;
		for ( var i=0; i<m_heroIds.length; ++i ) {
			var heroId = m_heroIds[i];
			var hero = m_g.getImgr().getHero( heroId );
			if ( !hero ) continue;
			
			var curSpeed = m_g.getImgr().getHeroAttrVal(hero, ATTR.SP);
			if ( curSpeed < speed ) {
				speed = curSpeed;
			}
		}
		
		if (speed == 0xffffffff){
			speed = res_army_movespeed;
		}
		
		return speed;		
	};
	
	var _updateLineupName = function(){
		var res = ItemResUtil.findItemres(m_lineupId);
		if ( res ) {
			TQ.setCSS(m_items.curlineup, 'display', 'block');
			TQ.setText(m_items.curlineup_txt, res.name);
		}
		else {
			TQ.setCSS(m_items.curlineup, 'display', 'none');
		}
	};
	
	var _updateForceTabList = function(){
		if ( m_this.isNeedSingleHero() ) {
			if ( m_heroIds.length > 1 ) {
				_showFirstHeroInLineupGrid();
			}
			else if ( m_heroIds.length == 1 ) {
				_showHeroInMidGrid();
			}
			else {
				_showEmptyMidGrid();
			}
		}
		else {
			if ( m_heroIds.length > 0 ) {
				_showHerosInLineupGrids();
			}
			else {
				_disableAllGrids();
			}
		}
	};
	
	var _getCanExpedHeros = function(){
		var heroIds = _collectValidHeroIds();
		if ( m_this.isNeedSingleHero() && heroIds.length > 0 ) {
			return [ heroIds[0] ];
		}
		
		if ( !m_this.isNeedSingleHero() && (m_heroIds.length == EXPED_TEAMGRID_MAXCNT) ) {
			return heroIds;
		}
		
		return [];
	};
	
	var _getExpedHerosInLineup = function(){
		var heroIds = _collectValidHeroIds();
		if ( m_this.isNeedSingleHero() && heroIds.length > 0 ) {
			return [ heroIds[0] ];
		}
		
		if ( !m_this.isNeedSingleHero() && (m_heroIds.length == EXPED_TEAMGRID_MAXCNT) ) {
			return m_heroIds;
		}
		
		return [];
	};
	
	var _collectValidHeroIds = function() {
		var heroIds = [];
		for ( var i=0; i<m_heroIds.length; ++i ) {
			var heroId = m_heroIds[i];
			if ( heroId == 0 ) continue;
			
			heroIds.push(heroId);
		}
		return heroIds;
	};	
	
	var _showFirstHeroInLineupGrid = function(){
		_disableAllGrids();
		var heroGrid = _getFirstValidHeroGrid();
		if ( heroGrid ) {
			_enableGrid(heroGrid.grid);
			_showHeroInGrid(heroGrid.grid, heroGrid.hero);
		}
	};
	
	var _showHeroInMidGrid = function(){
		_disableAllGrids();
		
		var midGridIdx = 4;
		_enableGrid(midGridIdx);
		
		var hero = m_g.getImgr().getHero( m_heroIds[0] );
		_showHeroInGrid(midGridIdx, hero);
	};
	
	var _showEmptyMidGrid = function(){
		_disableAllGrids();
		
		var midGridIdx = 4;
		_enableEmptyGrid(midGridIdx);
	};
	
	var _showHerosInLineupGrids = function(){
		_disableAllGrids();
		var res = ItemResUtil.findItemres(m_lineupId);
		if ( !res ) {
			return;
		}
		
		for ( var i=0; i<res.grids.length; ++i ) {
			var gridIdx = res.grids[i];
			var heroId = m_heroIds[i];
			var hero = m_g.getImgr().getHero( heroId );
			if ( !hero ) {
				_enableEmptyGrid(gridIdx);
				continue;
			}
			
			_enableGrid(gridIdx);
			_showHeroInGrid(gridIdx, hero);
		}
	};
	
	var _disableAllGrids = function(){
		for ( var i=0, cnt=m_items.forcetablist.getCount(); i<cnt; ++i ) {
			_disableGrid(i);
		}
	};
	
	var _disableGrid = function(idx){
		var listItem = m_items.forcetablist.getItem(idx);
		_hideGridDetailLabels(idx);
		IMG.setBKImage(listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/disablebak.gif'));
	};
	
	var _enableEmptyGrid = function(idx){
		var listItem = m_items.forcetablist.getItem(idx);
		_hideGridDetailLabels(idx);
		IMG.setBKImage(listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/emptybak.gif'));
	};
	
	var _enableGrid = function(idx){
		var listItem = m_items.forcetablist.getItem(idx);
		_showGridDetailLbls(idx);
		IMG.setBKImage(listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/emptybak.gif'));
	};
	
	var _hideGridDetailLabels = function(idx){
		_showOrHideGridDetailLabels(idx, 'hide');
	};
	
	var _showGridDetailLbls = function(idx){
		_showOrHideGridDetailLabels(idx, 'show');
	};
	
	var _showOrHideGridDetailLabels = function(idx, flag) {
		var displayAttrVal = (flag=='show') ? 'block' : 'none';
		var lbls = ['icon', 'level', 'name', 'health', 'soldiername', 'soldiernum', 'stateflag'];
		
		var listItem = m_items.forcetablist.getItem(idx);
		for ( var k in lbls ) {
			TQ.setCSS(listItem.exsubs[ lbls[k] ], 'display', displayAttrVal);
		}
	};
	
	var _showHeroInGrid = function(gridIdx, hero){
		var imgr = m_g.getImgr();
		var listItem = m_items.forcetablist.getItem(gridIdx);
		IMG.setBKImage(listItem.exsubs.icon, IMG.makeSmallImg(hero.icon));
		TQ.setTextEx(listItem.exsubs.level, TQ.format(rstr.comm.flevel, hero.level));
		TQ.setTextEx(listItem.exsubs.name, hero.name);
		
		var healthVal = imgr.getHeroAttrVal(hero, ATTR.HEALTH);
		TQ.setTextEx(listItem.exsubs.health, RStrUtil.getHealthStr(healthVal));
		TQ.setTextEx(listItem.exsubs.soldiername, RStrUtil.getSoldierNameByResId(hero.soldier.resid));
		TQ.setTextEx(listItem.exsubs.soldiernum, hero.soldier.number);
		if ( hero.state != HERO_STATE.FREE ) {
			IMG.setBKImage(listItem.exsubs.stateflag, IMG.makeImg('expedition/forcetab/herobusy.gif'));
		}
		else {
			IMG.setBKImage(listItem.exsubs.stateflag, '');
		}
	};
	
	var _getFirstValidHeroGrid = function(){
		var res = ItemResUtil.findItemres(m_lineupId);
		if ( !res ) return null;
		
		for ( var i=0; i<res.grids.length; ++i ) {
			var gridIdx = res.grids[i];
			var heroId = m_heroIds[i];
			var hero = m_g.getImgr().getHero( heroId );
			if ( hero ) {
				return {grid:gridIdx, hero:hero};
			}
		}
		return null;
	};
	//ExpedForceTabHdr-unittest-end
});

ExpedDefaultTeamHdr = Class.extern(function(){
	var m_g = null;
	var m_items = null;
	var m_this = null;
	var m_lineUpInfoHdr = null;
	var m_target = ExpedTargetUtil.createNull();
	this.init = function(g, uiitems){
		m_g = g;
		m_this = this;
		m_items = uiitems;
		m_g.regEvent(EVT.BDEFAULT_TEAMS_UPDATE, 0, m_this, _onUpdateDefaultTeams);
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onUpdateHero);
		m_items.defaultteam.setPreCaller({self:m_this, caller:_onPreSelectTeam});
		m_items.defaultteam.setCaller({self:m_this, caller:_onSelectTeam});
	};
	
	this.setLineUpInfoHdr = function(hdr){
		m_lineUpInfoHdr = hdr;
	};
	
	this.setTarget = function(target){
		m_target = ExpedTargetUtil.getValidTarget(target);
	};
	
	this.update = function(){
		_updateCurDefaultTeam();
		_updateDefaultTeams();
	};
	
	this.clearTeamSel = function(){
		m_items.defaultteam.select(-1);
	};
	
	var _onPreSelectTeam = function(id){
		if ( id < 0 ) {
			return true;
		}
		
		var teams = m_g.getImgr().getDefaultTeams();
		var team = teams[id];
		var hasLineup = team && team.lineup;
		if ( !hasLineup ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noLineup);
			return false;
		}
		
		if ( ExpedTargetUtil.isNull(m_target) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.expeddlg.err.noTarget);
			return false;
		}
		
		return true;
	};
	
	var _onSelectTeam = function(id){
		_updateCurDefaultTeam();
		_updateCurDefaultTeamSetLineup();
	};
	
	var _onUpdateDefaultTeams = function(){
		_updateDefaultTeams();
	};
	
	var _onUpdateHero = function(){
		_updateDefaultTeams();
	};
	
	var _updateDefaultTeams = function(){
		var fightcaps = [{isSeted:true, val:0},{isSeted:true, val:0},{isSeted:true, val:0}];
		var teams = m_g.getImgr().getDefaultTeams();
		for ( var teamIdx=0; teamIdx<teams.length; ++teamIdx ) {
			var team = teams[teamIdx];
			if ( team.lineup == 0 ) { // not set default team
				fightcaps[teamIdx].isSeted = false;
				continue;
			}
			
			for ( var heroIdx=0; heroIdx<team.heros.length; ++heroIdx ) {
				var heroId = team.heros[heroIdx];
				var hero = m_g.getImgr().getHero(heroId);
				if ( !hero ) continue;
		
				fightcaps[teamIdx].val += m_g.getImgr().getHeroAttrVal(hero, ATTR.FC);
			}
		}
		
		for ( var i=0; i<fightcaps.length; ++i ) {
			var radio = m_items.defaultteam.getRadio(i);
			var fightcap = fightcaps[i];
			if ( fightcap.isSeted ) {
				radio.setText(TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[i+1], fightcaps[i].val ));
			}
			else {
				radio.setText(TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[i+1], rstr.expeddlg.btn.nosetteam ));
			}
		}
	};
	
	var _updateCurDefaultTeamSetLineup = function(){
		var id = m_items.defaultteam.getCurSelId();
		if ( id < 0 ) {
			m_lineUpInfoHdr.setLineup(0, []);
			m_lineUpInfoHdr.refresh();
		} else {
			var teams = m_g.getImgr().getDefaultTeams();
			var team = teams[id];
			m_lineUpInfoHdr.setLineup(team.lineup, team.heros);
			m_lineUpInfoHdr.refresh();
			MilitarySender.sendSaveForceLineUp(m_g, FORCELINE_TYPE.COMM, team.lineup, team.heros);
			TQ.dictCopy(m_g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.COMM, lineup:team.lineup, heros:team.heros}] );
		}
	};
	
	var _updateCurDefaultTeam = function(){
		var id = m_items.defaultteam.getCurSelId();
		if ( id < 0 ) {
			TQ.setCSS(m_items.curdefaultteam, 'display', 'none');
		} else {
			TQ.setCSS(m_items.curdefaultteam, 'display', 'block');
			TQ.setText(m_items.curdefaultteam_txt, TQ.format(rstr.expeddlg.lbl.defaultteam, rstr.comm.hznums[id+1]));
		}
	};
	
});

ExpedTargetHdr = Class.extern(function(){
	this.g = null;
	this.items = null;
	this.target = ExpedTargetUtil.createNull();
	this.selectType = 0;
	this.expedTypes = [];
	this.init = function(g, uiitems){
		this.g = g;
		this.items = uiitems;	
	};
	
	this.setTarget = function(target){
		this.target = ExpedTargetUtil.getValidTarget(target);
	};
	
	this.setSelectType = function(idx){
		if ( idx >= this.expedTypes.length ) {
			alert('error: 4930259r3');
		}
		this.selectType = this.expedTypes[idx];
	};
	
	this.getSelectType = function(){
		return this.selectType;
	};
	
	this.updateMoveNeedTime = function(armySpeed) {
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(this.g, this.target.pos, armySpeed);
		TQ.setText(this.items.needtime, TQ.formatTime(0, timeSecond));
	};
	
	this.updateTargetName = function(){
		TQ.setText(this.items.target, this.target.name);
	};
	
	this.udpateEnemyFightCap = function(){
		TQ.setText(this.items.enemyfightcap, '');
	};
	
	this.updateTargetPos = function(){
		TQ.setText(this.items.coordinate, 'x:'+this.target.pos.x+', y:'+this.target.pos.y);
	};
	
	this.catTargetLevel = function(name){
		return name + '.' + TQ.format(rstr.comm.flevel, this.target.level);
	};
	
	this.setTargetTypeRadioTexts = function(){
		for ( var i=0; i<this.expedTypes.length; ++i ) {
			var expedType = this.expedTypes[i];
			var expedTypeIdx = expedType - EXPED_TYPE.FIRST;
			var expedText = rstr.expeddlg.btn.types[expedTypeIdx];
			this.items.selecttype.getRadio(i).show();
			this.items.selecttype.getRadio(i).setText(expedText);
		}
		for ( var i=this.expedTypes.length; i<4; ++i ) {
			this.items.selecttype.getRadio(i).hide();
		}
	};
	
	this.isSameCountry = function(){
		var myPos = this.g.getImgr().getRoleRes().pos;
		return FieldUtil.getCityResIdByPos(this.target.pos) == FieldUtil.getCityResIdByPos(myPos);
	};
	
	this.isCountryFight = function(){
		return false;
	};
	
	this.getCountryFightTip = function(){
		return '';
	};
});

NullExpedTargetHdr = ExpedTargetHdr.extern(function(){
	this.setSelectType = function(idx){
		this.selectType = 0;
	};
	
	this.updateTargetName = function(){
		TQ.setText(this.items.target, '');
	};	
	
	this.updateTargetPos = function(){
		TQ.setText(this.items.coordinate, 'x:0, y:0');
	};
	
	this.updateMoveNeedTime = function(armySpeeds) {
		TQ.setText(this.items.needtime, TQ.formatTime(0, 0));
	};	
	
	this.updateTargetTypes = function() {
		this.expedTypes = [];
		this.setTargetTypeRadioTexts();
	};
	
	this.updateTypeDesc = function(){
		TQ.setRichText(this.items.typedesc, '');
	};
});

SameAlliPlayerTargetHdr = ExpedTargetHdr.extern(function(){
	this.init = function(g, uiitems){
		this.g = g;
		this.items = uiitems;
	};
	
	this.setTarget = function(target){
		this.target = ExpedTargetUtil.getValidTarget(target);
	};
	
	this.updateTargetTypes = function() {
		this.expedTypes = [EXPED_TYPE.PAIQIAN];
		this.setTargetTypeRadioTexts();
	};
	
	this.updateTypeDesc = function(){
		TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.paiqianplayertype);
	};
	
	this.updateMoveNeedTime = function(armySpeed) {
		var level = this.g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.ALLIINBUILD);
		var speed = armySpeed + 0.1*level*armySpeed;
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(this.g, this.target.pos, speed);
		TQ.setText(this.items.needtime, TQ.formatTime(0, timeSecond));
	};
});

SelfFieldTargetHdr = ExpedTargetHdr.extern(function(){
	this.updateTargetTypes = function() {
		this.expedTypes = [EXPED_TYPE.PAIQIAN];
		this.setTargetTypeRadioTexts();
	};
	
	this.updateTypeDesc = function(){
		TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.paiqianfieldtype);
	};
	
	this.updateMoveNeedTime = function(armySpeed) {
		var speed = armySpeed*10;
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(this.g, this.target.pos, speed);
		TQ.setText(this.items.needtime, TQ.formatTime(0, timeSecond));
	};	
});

OtherPlayerTargetHdr = ExpedTargetHdr.extern(function(){
	this.updateTargetTypes = function() {
		this.expedTypes = [EXPED_TYPE.TAOFA, EXPED_TYPE.CUIHUI, EXPED_TYPE.TIAOXIN];
		this.setTargetTypeRadioTexts();
	};
	
	this.updateTypeDesc = function(){
		var countryDesc = '';
		if ( this.isSameCountry() ) {
			if ( this.selectType == EXPED_TYPE.TAOFA ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.taofaplayertype);
			} else if ( this.selectType == EXPED_TYPE.CUIHUI ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.cuihuiplayertype);
			} else if ( this.selectType == EXPED_TYPE.TIAOXIN ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.tiaoxinplayertype);
			}
		} else {
			if ( this.selectType == EXPED_TYPE.TAOFA ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.taofaplayertypeex);
			} else if ( this.selectType == EXPED_TYPE.CUIHUI ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.cuihuiplayertypeex);
			} else if ( this.selectType == EXPED_TYPE.TIAOXIN ) {
				TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.tiaoxinplayertypeex);
			}
		}
	};
	
	this._superUpdateMoveNeedTime = this.updateMoveNeedTime;
	this.updateMoveNeedTime = function(armySpeed){
		if ( this.isSameCountry() ) {
			if ( this.selectType == EXPED_TYPE.TIAOXIN ) {
				TQ.setText(this.items.needtime, TQ.formatTime(0, res_tiaoxin_needtime));
			} else {
				this._superUpdateMoveNeedTime(armySpeed);
			}
		} else {
			TQ.setText(this.items.needtime, TQ.formatTime(0, res_countryfight_needtime));
		}
	};
	
	this.isCountryFight = function(){
		return !this.isSameCountry();
	};
	
	this.getCountryFightTip = function(){
		var tip = '';
		var cfg = this.g.getImgr().getSvrCfg().honorcfg;
		if ( this.selectType == EXPED_TYPE.TAOFA ) {
			tip = TQ.format(rstr.expeddlg.lbl.taofaplayertype_tip, cfg.taofa);
		} else if ( this.selectType == EXPED_TYPE.CUIHUI ) {
			tip = TQ.format(rstr.expeddlg.lbl.cuihuiplayertype_tip, cfg.cuihui);
		} else if ( this.selectType == EXPED_TYPE.TIAOXIN ) {
			tip = TQ.format(rstr.expeddlg.lbl.tiaoxinplayertype_tip, cfg.tiaoxin);
		}
		return tip + TQ.format(rstr.expeddlg.lbl.countryfight_desc, cfg.leveldiff);
	};
});

OhterFieldTargetHdr = ExpedTargetHdr.extern(function(){
	this.updateTargetTypes = function() {
		this.expedTypes = [EXPED_TYPE.DANTIAO, EXPED_TYPE.ZHANLING];
		this.setTargetTypeRadioTexts();
	};
	
	this.updateTargetName = function(){
		TQ.setText(this.items.target, this.target.name);
	};
	
	this.udpateEnemyFightCap = function(){
		if ( this.selectType == EXPED_TYPE.DANTIAO ) {
			TQ.setText(this.items.enemyfightcap, this.target.sfightcap);
		} else {
			TQ.setText(this.items.enemyfightcap, this.target.fightcap);
		}
	};
	
	this.updateTypeDesc = function(){
		if ( this.selectType == EXPED_TYPE.DANTIAO ) {
			TQ.setRichText(this.items.typedesc, this.getDantiaoDropDesc() );
		} else if ( this.selectType == EXPED_TYPE.ZHANLING ) {	
			TQ.setRichText(this.items.typedesc, rstr.expeddlg.lbl.zhanlingfieldtype );
		}
	};
	
	this.getDantiaoDropDesc = function(){
		var hasOwnerPlayer = this.target.roleId > 0;
		if (hasOwnerPlayer){
			return rstr.expeddlg.lbl.winOver + rstr.expeddlg.lbl.getOtherPlayerRes;
		} else {
			var fieldRes = ItemResUtil.findFieldLevelres(this.target.resid, this.target.level);
			var dropId = fieldRes.dantiaodrop;
			return rstr.expeddlg.lbl.winOver + DropItemUtil.getDesc(dropId);	
		}
	};	
});

CopyFieldTargetHdr = ExpedTargetHdr.extern(function(){
	this.updateTargetTypes = function() {
		this.expedTypes = [EXPED_TYPE.TAOFA];	
		this.setTargetTypeRadioTexts();
	};
	
	this.updateMoveNeedTime = function(armySpeed) {
		TQ.setText(this.items.needtime, TQ.formatTime(0, this.target.needtime));
	};
	
	this.updateTargetName = function(){
		var nameAndLevel = this.catTargetLevel(this.target.name);
		TQ.setText(this.items.target, nameAndLevel);
	};
	
	this.udpateEnemyFightCap = function(){
		TQ.setText(this.items.enemyfightcap, this.target.fightcap);
	};	
	
	this.updateTypeDesc = function(){
		TQ.setRichText(this.items.typedesc, this.getTaofaDropDesc() );
	};
	
	this.getTaofaDropDesc = function(){
		var fieldRes = ItemResUtil.findItemres(this.target.resid);
		var dropId = fieldRes.taofadrop;
		return rstr.expeddlg.lbl.winOver + DropItemUtil.getDesc(dropId);
	};
});

ExpedTargetHdrMgr =  Class.extern(function(){
	var m_g = null;
	var m_this = null;
	var m_items = null;
	var m_target = ExpedTargetUtil.createNull();
	var m_targetChecker = null;
	var m_sameAlliPlayerTargetHdr = null;
	var m_selfFieldTargetHdr = null;
	var m_otherPlayerTargetHdr = null;
	var m_ohterFieldTargetHdr = null;
	var m_copyFieldTargetHdr = null;
	var m_nullTargetHdr = null;
	this.init = function(g, uiitems){
		m_g = g;
		m_this = this;
		m_items = uiitems;
		m_targetChecker = ExpedTargetChecker.snew(m_g);
		m_sameAlliPlayerTargetHdr = SameAlliPlayerTargetHdr.snew(m_g, uiitems);
		m_selfFieldTargetHdr = SelfFieldTargetHdr.snew(m_g, uiitems);
		m_otherPlayerTargetHdr = OtherPlayerTargetHdr.snew(m_g, uiitems);
		m_ohterFieldTargetHdr = OhterFieldTargetHdr.snew(m_g, uiitems);
		m_copyFieldTargetHdr = CopyFieldTargetHdr.snew(m_g, uiitems);
		m_nullTargetHdr = NullExpedTargetHdr.snew(m_g, uiitems);
	};
	
	this.setTarget = function(target){
		m_target = ExpedTargetUtil.getValidTarget(target);
		m_targetChecker.setTarget(m_target);
		this.getTargetHdr().setTarget(m_target);
	};
	
	this.getTargetHdr = function(){
		if ( m_targetChecker.isSameAlliPlayer() ) {
			return m_sameAlliPlayerTargetHdr;
		}
		else if ( m_targetChecker.isSelfFieldTarget() ) {
			return m_selfFieldTargetHdr;
		}
		else if ( m_targetChecker.isOtherPlayer() ) {
			return m_otherPlayerTargetHdr;
		}
		else if ( m_targetChecker.isOtherFieldTarget() ) {
			return m_ohterFieldTargetHdr;
		}
		else if ( m_targetChecker.isCopyFieldTarget() ) {
			return m_copyFieldTargetHdr;
		}
		else {
			return m_nullTargetHdr;
		}	
	};
});


DropItemUtil = Class.extern(function(){
	var m_hasGainLbl_ = null;
	this.init = function(){
		m_hasGainLbl_ = true;
	};
	
	this.getDesc = function(dropId) {
		var s = '';
		s += _getDesc(dropId);
		s += _getItemsDesc( ItemResUtil.findItemres(dropId) );
		return s;
	};
	
	this.getProItemsDesc = function(dropId){
		var dropRes = ItemResUtil.findItemres(dropId);
		if ( !dropRes.items ) return '';
		
		var s = '';
		for ( var i=0; i<dropRes.items.length; ++i ) {
			var dropItem = dropRes.items[i];
			if ( !dropItem.id ) continue;
			if ( !dropItem.pro ) continue;
			s += _getSpaceEx(s);
			s += _getItemName(dropItem);
		}
		
		return s;
	};
	
	this.getDropItems = function(dropId){
		var dropRes = ItemResUtil.findItemres(dropId);
		if ( !dropRes.items ) return [];
		var items = [];
		for ( var i=0; i<dropRes.items.length; ++i ) {
			var dropItem = dropRes.items[i];
			if ( !dropItem.id ) continue;
			if ( !_isFixGain(dropItem) ) continue;
			if ( dropItem.minnum != dropItem.maxnum ) continue;
			items.push({id:dropItem.id, number:dropItem.minnum});
		}
		return items;
	};
	
	this.getSimpleDesc = function(dropId){
		m_hasGainLbl_ = false;
		var s = _getDesc(dropId);
		m_hasGainLbl_ = true;
		return s;
	};
	
	this.getDescNoGainLbl = function(dropId){
		m_hasGainLbl_ = false;
		var s = this.getDesc(dropId);
		m_hasGainLbl_ = true;
		return s;
	};
	
	var _getDesc = function(dropId) {
		var s = '';
		var dropRes = ItemResUtil.findItemres(dropId);
		s += _getRoleDesc(dropRes);
		s += _getRolePsDesc(dropRes);
		s += _getHeroDesc(dropRes);
		s += _getCreditDesc(dropRes);
		s += _getInnerForceDesc(dropRes);
		s += _getMoneyDesc(dropRes);
		s += _getFourresDesc(dropRes);
		s += _getIdlepopuDesc(dropRes);
		s += _getGiftgoldDesc(dropRes);
		s += _getGoldDesc(dropRes);
		s += _getAlliContributeDesc(dropRes);
		s += _getPrestigeDesc(dropRes);
		s += _getStatehonourDesc(dropRes);
		s += _getJibing1Desc(dropRes);
		s += _getXinbingDesc(dropRes);
		return s;		
	};
	
	var _getItemsDesc = function(dropRes) {	
		var s = '';
		if ( !dropRes.items ) return s;
		
		for ( var i=0; i<dropRes.items.length; ++i ) {
			var dropItem = dropRes.items[i];
			if ( !dropItem.id ) continue;
			if ( !_isFixGain(dropItem) ) continue;
			
			s += _getSpace(s);
			s += _getGainLabel();
			s += _getItemName(dropItem);
			s += _getNumber(rstr.dropdesc.numPrefix, dropItem);
		}
		s += _getSpace(s);
		return s;
	};
	
	var _getSpecialDesc = function(dropRes, lbl, fieldName){
		var s = '';
		if ( !dropRes[fieldName] ) return s;
		if ( !_isFixGain(dropRes[fieldName]) ) return s;
		
		s += _getGainLabel();
		s += lbl;
		s += _getNumber(rstr.dropdesc.numAddPrefix, dropRes[fieldName]);
		s += _getSpace(s);
		return s;
	};	
	
	var _getRoleDesc = function(dropRes) {
		return _getSpecialDesc(dropRes, rstr.dropdesc.roleexp, 'roleexp');
	};
	
	var _getRolePsDesc = function(dropRes) {
		return _getSpecialDesc(dropRes, rstr.dropdesc.roleps, 'roleps');
	};
	
	var _getHeroDesc = function(dropRes) {
		return _getSpecialDesc(dropRes, rstr.dropdesc.heroexp, 'heroexp');
	};
	
	var _getCreditDesc = function(dropRes) {
		return _getSpecialDesc(dropRes, rstr.dropdesc.credit, 'credit');
	};
	
	var _getInnerForceDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.iforce, 'iforce');
	};
	
	var _getMoneyDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.money, 'money');
	};
	
	var _getFourresDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.fourres, 'fourres');
	};
	
	var _getIdlepopuDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.idlepopu, 'idlepopu');
	};
	
	var _getGiftgoldDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.giftgold, 'giftgold');
	};
	
	var _getGoldDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.gold, 'gold');
	};
	
	var _getAlliContributeDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.allicontribute, 'allicontribute');
	};
	
	var _getPrestigeDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.prestige, 'prestige');
	};
	
	var _getStatehonourDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.statehonour, 'statehonour');
	};
	
	var _getJibing1Desc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.jibing1, 'jibing1');
	};
	
	var _getXinbingDesc = function(dropRes){
		return _getSpecialDesc(dropRes, rstr.dropdesc.xinbing, 'xinbing');
	};
	
	var _isFixGain = function(dropItem) {
		return dropItem.pro == 100;
	};
	
	var _getGainLabel = function() {
		if ( m_hasGainLbl_ ) {
			return rstr.dropdesc.mustget;
		} else {
			return '';
		}
	};
	
	var _getItemName = function(dropItem) {
		var itemRes = ItemResUtil.findItemres(dropItem.id);
		return itemRes.name;
	};
	
	var _getNumber = function(preFix, dropItem) {
		if ( dropItem.minnum == dropItem.maxnum ) {
			return preFix + dropItem.minnum;
		}
		return '';
	};
	
	var _getSpace = function(s) {
		if ( s != '' ) {
			return rstr.dropdesc.space;
		} else {
			return '';
		} 
	};
	
	var _getSpaceEx = function(s) {
		if ( s != '' ) {
			return ' ';
		} else {
			return '';
		} 
	};
}).snew();