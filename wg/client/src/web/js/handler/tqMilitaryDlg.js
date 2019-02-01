/******************************************************************************
******************************************************************************/
MilitaryDlg = ListenerBaseDlg.extern(function(){
	//MilitaryDlg-unittest-start
	var C_TAB_PERSONAL_IDX = 0;
	var C_TAB_ALLIANCE_IDX = 1;
	
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_armyLineClassNames = {};
	
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		
		m_armyLineClassNames[ARMY_TYPE.SELF] = 'selfarmy';
		m_armyLineClassNames[ARMY_TYPE.ENEMY] = 'enemyarmy';
		m_armyLineClassNames[ARMY_TYPE.ALLI] = 'alliancearmy';
		
		_regEvents();
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		HelpGuider.getNewcomerSpirit().onDlgOpen('military', {parent:m_dlg.getParent(), items:m_items});
		this._notifyOpenDlg();
	};
	
	this.closeDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	this.hideDlg = function(){
		this.closeDlg();
	};

	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, m_this, _onUpdatePersonalArmys);
		m_g.regEvent(EVT.SALLIANCE_ARMY_UPDATE, 0, m_this, _onUpdateAllianceArmys);
	};	
	
	var _initDlg = function(){
		if ( !m_dlg ) {
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:rstr.military.militarydlg.title,
					pos:{x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.military.maindlg, m_items);
			_setTabs();
			_setCallers();
		}
		m_dlg.show();
	};
	
	var _setTabs = function(){
		for ( var i=0; i<rstr.military.militarydlg.tabs.length; ++i ) {
			m_items.tabList.setTabText(i, rstr.military.militarydlg.tabs[i]);
		}
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
	};
	
	var _initInfo = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
		m_items.tabList.activeTab(C_TAB_PERSONAL_IDX);
		_updatePersonalArmys();
		_updateAllianceArmys();
	};
	
	var _onUpdatePersonalArmys = function(){
		if ( !m_this.isShow() ) return;
		
		_updatePersonalArmys();
	};
	
	var _onUpdateAllianceArmys = function(){
		if ( !m_this.isShow() ) return;
		
		_updateAllianceArmys();
	};
	
	var _onUpdate = function(curTimeMs){
		_updatePersonalArmysLeftTime();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('military');
		}
	};
	
	var _onClickSeeBtn = function(id){
		var personalArmys = m_g.getImgr().getArmys().list;
		var army = personalArmys[id];
		if ( !army ) return;
		
		UIM.openDlg('fightmap', army.id, -1);
	};
	
	var _onClickOpBtn = function(id){
		var personalArmys = m_g.getImgr().getArmys().list;
		var army = personalArmys[id];
		if ( !army ) return;
		
		UIM.openDlg('militaryop', army);
	};
	
	var _onClickReinforceBtn = function(id){
		var samealliArmy = m_g.getImgr().getArmys().samealli;
		var army = samealliArmy[id];
		if ( !army ) return;
		
		var target = {};
		target.type = OBJ_TYPE.ROLE;
		target.name = army.target.role;
		target.pos = army.target.pos;
		target.alliance = m_g.getImgr().getRoleRes().alliance;
		UIM.openDlg('expedition', target);
	};
	
	var _updatePersonalArmys = function(){
		try{
			var personalArmys = m_g.getImgr().getArmys().list;
			m_items.tabList.getTabBtn(C_TAB_PERSONAL_IDX).setNewFlag(personalArmys.length);
			var list = m_items.tabList.getTabItems(C_TAB_PERSONAL_IDX).list;
			list.setItemCount(personalArmys.length);
			
			for ( var i=0; i<personalArmys.length; ++i ) {
				var army = personalArmys[i];
				var listItem = list.getItem(i);
				var className = m_armyLineClassNames[army.armyType];
				
				var sourceRole = TQ.format(rstr.military.militarydlg.playerName, army.sourceRole, army.sourcePos.x, army.sourcePos.y);
				if (IS_DEBUG){
					sourceRole += ' ' + army.id;
				}
				_setArmyLineFieldTextAndColor(listItem.exsubs.intent, className, rstr.military.militarydlg.intents[army.expedType]);
				_setArmyLineFieldTextAndColor(listItem.exsubs.sourcePlayer, className, sourceRole );
				_setArmyLineFieldTextAndColor(listItem.exsubs.state, className, rstr.military.militarydlg.states[army.state] );
				_setArmyLineFieldTextAndColor(listItem.exsubs.targetPlayer, className, TQ.format(rstr.military.militarydlg.playerName, army.targetRole, army.targetPos.x, army.targetPos.y) );
				_setArmyLineFieldTextAndColor(listItem.exsubs.leftTime, className, _getLeftTimeString(army));

				var enableSeeBtn = army.fighted==1;
				listItem.exsubs.seebtn.enable(enableSeeBtn);
				listItem.exsubs.seebtn.setId(i);
				listItem.exsubs.seebtn.setCaller({self:m_this,caller:_onClickSeeBtn});
				
				listItem.exsubs.opbtn.setId(i);
				listItem.exsubs.opbtn.setCaller({self:m_this,caller:_onClickOpBtn});
			}
		}catch(e){
			var errmsg = 'armys error: '+ErrorGetter.getCommErr(e);
			LogSender.sendLog(m_g, errmsg);
		}
	};
	
	var _updateAllianceArmys = function(){
		var samealliArmy = m_g.getImgr().getArmys().samealli;
		m_items.tabList.getTabBtn(C_TAB_ALLIANCE_IDX).setNewFlag(samealliArmy.length);
		var list = m_items.tabList.getTabItems(C_TAB_ALLIANCE_IDX).list;
		list.setItemCount(samealliArmy.length);

		for ( var i=0; i<samealliArmy.length; ++i ) {
			var army = samealliArmy[i];
			var listItem = list.getItem(i);
			var className = 'enemyarmy';
			_setArmyLineFieldTextAndColor(listItem.exsubs.attackPlayer, className, army.source.role);
			_setArmyLineFieldTextAndColor(listItem.exsubs.attackAlliance, className, army.source.alliance );
			_setArmyLineFieldTextAndColor(listItem.exsubs.state, className, rstr.military.militarydlg.states[army.state] );
			_setArmyLineFieldTextAndColor(listItem.exsubs.enemyPlayer, className, army.source.role );
			_setArmyLineFieldTextAndColor(listItem.exsubs.alliancePlayer, className, army.target.role );
			_setArmyLineFieldTextAndColor(listItem.exsubs.leftTime, className, _getLeftTimeString(army));
			
			listItem.exsubs.reinforcebtn.setId(i);
			listItem.exsubs.reinforcebtn.setCaller({self:m_this,caller:_onClickReinforceBtn});
		}
	};
	
	var _setArmyLineFieldTextAndColor = function(dom, className, text){
		TQ.setText(dom, text );
		TQ.setClass(dom, className );
	};
	
	var _updatePersonalArmysLeftTime = function(){
		var personalArmys = m_g.getImgr().getArmys().list;
		var list = m_items.tabList.getTabItems(C_TAB_PERSONAL_IDX).list;
		for ( var i=0, cnt=list.getCount(); i<cnt; ++i ) {
			var armyRes = personalArmys[i];
			var listItem = list.getItem(i);
			TQ.setTextEx(listItem.exsubs.leftTime, _getLeftTimeString(armyRes));
		}
	};
	
	var _getAllianceArmysByDescIdSort = function(){
		return m_g.getImgr().getArmys().samealli;
	};
	
	var _getLeftTimeString = function(armyRes) {
		if ( armyRes.state != ARMYDYN_STATE.GOTO 
			&& armyRes.state != ARMYDYN_STATE.RETURN ) {
			return '-:-:-';
		}
		
		var leftTime = armyRes.stopTime - m_g.getSvrTimeS();
		if ( leftTime < 0 ) {
			leftTime = 0;
		}

		return TQ.formatTime(0, leftTime);
	};
	//MilitaryDlg-unittest-end
});

//--
MilitaryOpHandlerFactory = Class.extern(function(){
	this.createOpHdr = function(g, dlg, army){
		var hdr = null;
		if ( g.getImgr().isSelfArmy(army.id) ){
			if ( this._isDispatchFieldState(army) ){
				hdr = MilitaryOpDispatchSelfFieldArmyHdr.snew(g, dlg, army);
			}
			else{
				hdr = MilitaryOpSelfArmyHdr.snew(g, dlg, army);
			}
		}
		else if ( g.getImgr().isEnemyArmy(army.id) ) {
			hdr = MilitaryOpEnemyArmyHdr.snew(g, dlg, army);
		}
		else if ( g.getImgr().isAlliArmy(army.id) ) {
			hdr = MilitaryOpAlliArmyHdr.snew(g, dlg, army);
		}
		else {
			hdr = NullMilitaryOpArmyHdr.snew(g, dlg, army);
		}
		return hdr;
	};
	
	this._isDispatchFieldState = function(army){
		if (army.state != ARMYDYN_STATE.DISPATCH) {
			return false;
		}
		
		return army.targetType == OBJ_TYPE.FIELD 
			|| army.targetType == OBJ_TYPE.OWNERFIELD;
	};
});

MilitaryOpHandler = Class.extern(function(){
	this.init = function(g, dlg, army){
		this.g = g;
		this.dlg = dlg;
		this.army = army;
	};
	
	this.getBtnTitle = function(){};
	
	this.getSourceRoleName = function(){
		return this.army.sourceRole;
	};
	
	this.operate = function(){};
});

MilitaryOpDispatchSelfFieldArmyHdr = MilitaryOpHandler.extern(function(){
	this.getBtnTitle = function(){
		return rstr.military.opdlg.btn.enterfield;
	};

	this.operate = function(){
		var dlg = UIM.getDlg('selffield');
		var selfField = this.g.getImgr().getSelfFieldByGridId(this.army.targetId);
		var field = FieldUtil.makeFieldFromSelfField(selfField);
		dlg.openDlg(field);
		this.dlg.closeDlg();
	};
});

MilitaryOpSelfArmyHdr = MilitaryOpHandler.extern(function(){
	this.getBtnTitle = function(){
		return rstr.military.opdlg.btn.callback;
	};
	
	this.operate = function(){
		if (!this._preOperate()) return;
		
		var g = this.g;
		var armyId = this.army.id;
		var dlg = this.dlg;
		var _onCallbackArmy = function(id) {
			if ( id == MB_IDYES ) {
				MilitarySender.sendCallBackArmy(g, armyId);
				dlg.closeDlg();
			}
		};
		this.g.getGUI().msgBox(rstr.comm.msgts, rstr.military.opdlg.lbl.confirmCallBack,  MB_F_YESNO, {self:this, caller:_onCallbackArmy} );
	};
	
	this._preOperate = function(){
		if (this.army.state == ARMYDYN_STATE.RETURN) {
			this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100044].msg);
			return false;
		}
		return true;
	};	
});

MilitaryOpEnemyArmyHdr = MilitaryOpHandler.extern(function(){
	this.getBtnTitle = function(){
		return rstr.military.opdlg.btn.callback;
	};
	
	this.operate = function(){
		this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100043].msg);
	};
});

MilitaryOpAlliArmyHdr = MilitaryOpHandler.extern(function(){
	this.getBtnTitle = function(){
		return rstr.military.opdlg.btn.repatriate;
	};
	
	this.operate = function(){
		var g = this.g;
		var armyId = this.army.id;
		var dlg = this.dlg;
		var _onRepatriateArmy = function(id) {
			if ( id == MB_IDYES ) {
				MilitarySender.sendRepatriateArmy(g, armyId);
				dlg.closeDlg();
			}
		};
		this.g.getGUI().msgBox(rstr.comm.msgts, rstr.military.opdlg.lbl.confirmRepatriate,  MB_F_YESNO, {self:this, caller:_onRepatriateArmy} );
	};
});

NullMilitaryOpArmyHdr = MilitaryOpHandler.extern(function(){
	this.getBtnTitle = function(){ return ''; };
	this.getSourceRoleName = function(){ return ''; };
	this.operate = function(){};
});

//---
ArmyHeroGetter = Class.extern(function(){
	this.init = function(g, army){
		this.g = g;
		this.army = army;
		this.heros = this.collectValidHeros(this.army.heros);
	};
	
	this.getFightCap = function(){
		var fightCap = 0;
		var imgr = this.g.getImgr();
		for ( var i=0; i<this.army.heros.length; ++i ) {
			var hero = this.getHeroByIdx(i);
			fightCap += imgr.getHeroAttrVal(hero, ATTR.FC);
		}
		
		return fightCap;
	};
	
	this.getHeroCount = function(){
		return this.heros.length;
	};
	
	this.getHeroByIdx = function(idx){
		return this.heros[idx];
	};
	
	this.collectValidHeros = function(heros){
		var validHeros = [];
		for ( var i=0; i<heros.length; ++i ) {
			var hero = heros[i];
			if (hero.id == 0) continue;
			
			validHeros.push(hero);
		}
		return validHeros;
	};
});

MilitaryOpDlg = Class.extern(function(){
	//MilitaryOpDlg-unittest-start
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_army;
	var m_opHdr = null;
	var m_heroGetter = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(army){
		m_army = army;
		_createOpHdr();
		_createHeroGetter();
		_initDlg();
		_openDlg();
		_initInfo();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	var _createOpHdr = function(){
		m_opHdr = MilitaryOpHandlerFactory.snew().createOpHdr(m_g, m_this, m_army);
	};
	
	var _createHeroGetter = function(){
		m_heroGetter = ArmyHeroGetter.snew(m_g, m_army);
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					title:rstr.military.opdlg.title,
					pos:{x:'center', y:50}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.military.opdlg, m_items);
			m_dlg.hide();
			_setCallers();
		}
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_setRoleName();
		_setFightCap();
		_setHeroList();
		_setLeftTime();
		_setOpBtnText();
	};
	
	var _setCallers = function(){
		m_items.strategybtn.setCaller({self:m_this, caller:_onClickStrategy});
		m_items.opbtn.setCaller({self:m_this, caller:_onClickOP});
		m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
	};
	
	var _onClickStrategy = function(){
		m_g.getGUI().sysMsgTips(SMT_NORMAL, rstr.ids[100042].msg);
	};
	
	var _onClickOP = function(){
		m_opHdr.operate();
	};
	
	var _setRoleName = function(){
		TQ.setTextEx(m_items.roleName, m_opHdr.getSourceRoleName());
	};
	
	var _setFightCap = function(){
		TQ.setTextEx(m_items.fightCap, m_heroGetter.getFightCap());
	};
	
	var _setHeroList = function(){
		m_items.heroList.setItemCount(m_heroGetter.getHeroCount());
		for ( var i=0, n=m_items.heroList.getCount(); i<n; ++i ) {
			var item = m_items.heroList.getItem(i);
			var hero = m_heroGetter.getHeroByIdx(i);
			
			TQ.setText(item.exsubs.name, hero.name);
			TQ.setText(item.exsubs.level, hero.level);
			TQ.setText(item.exsubs.health, m_g.getImgr().getHeroAttrVal(hero, ATTR.HEALTH));
			TQ.setText(item.exsubs.soldier, RStrUtil.getSoldierNameByResId(hero.soldier.resid));
			TQ.setText(item.exsubs.number, hero.soldier.number);
		}
	};
	
	var _setLeftTime = function(){
		if (_getLeftTime() > 0) {
			var leftTime = rstr.military.opdlg.lbl.arriveTime + TQ.formatTime(0, _getLeftTime());
			TQ.setTextEx(m_items.leftTime, leftTime);
		}
		else {
			TQ.setTextEx(m_items.leftTime, '');
		}
	};
	
	var _getLeftTime = function(){
		var leftTime = 0;
		if (m_army.state == ARMYDYN_STATE.GOTO || m_army.state == ARMYDYN_STATE.RETURN ){
			leftTime = Math.max(0, m_army.stopTime - m_g.getSvrTimeS());
		}
		return leftTime;
	};
	
	var _setOpBtnText = function(){
		m_items.opbtn.setText(m_opHdr.getBtnTitle());
	};
	
	var _onUpdate = function(){
		_setLeftTime();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}	
	};
	
	//MilitaryOpDlg-unittest-end
});
