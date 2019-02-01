/*******************************************************************************/
SelfRoleCityOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.rolecitydlg.btn.selfCityBtns;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [null, null, null, null, this.onEnterCity, this.onEnterFarm];
	};
	
	this.setSomeBtnsHidden = function(){
		this.items.opbtn1.hidden();
		this.items.opbtn2.hidden();
		this.items.opbtn3.hidden();
		this.items.opbtn4.hidden();
	};
	
	this.onEnterCity = function(){
		UIM.closeMapPanels();
		UIM.getPanel('inbuild').open();
		this.dlg.closeDlg();
	};
});

SameAlliRoleCityOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.rolecitydlg.btn.sameAlliCityBtns;
	};

	this.initBtnsCaller = function(){
		this.callers = [this.onSendMail, this.onTalkTo, this.onDispatchArmy, this.onAddFavorite, this.onAddFriend, this.onEnterFarm];
	};
	
	this.onDispatchArmy = function(){
		ExpedUtil.expedTo(this.field);
		this.dlg.closeDlg();
	};
});

OtherAlliRoleCityOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.rolecitydlg.btn.otherAlliCityBtns;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [this.onSendMail, this.onTalkTo, this.onDeclareOrAttack, this.onAddFavorite, this.onAddFriend, this.onEnterFarm];
	};
	
	this.setSomeBtnsHidden = function(){
		if (this.g.getImgr().getFightRefState(this.field.roleId) == REF_ROLESTATE.DECLARING_FIGHT) {
			this.items.opbtn3.hidden();
		}
	};	
	
	this.update = function(){
		var btnText = rstr.field.rolecitydlg.btn.declareFight;
		if (this.g.getImgr().getFightRefState(this.field.roleId) == REF_ROLESTATE.FIGHTING){
			btnText = rstr.field.rolecitydlg.btn.fightTo;
		}
		this.items.opbtn3.setText( btnText );
	};
	
	this.onDeclareOrAttack = function(){
		var fightRefState = this.g.getImgr().getFightRefState(this.field.roleId);
		if (fightRefState == REF_ROLESTATE.NORMAL){
			MilitarySender.sendDeclareFight(this.g, this.field.roleId);
			OutFieldSender.sendRefreshFieldsByLastViewPos(this.g);
		}
		else if (fightRefState == REF_ROLESTATE.FIGHTING){
			ExpedUtil.expedTo(this.field);
			this.dlg.closeDlg();
		}
	};
});

RoleCityDlg = Class.extern(function(){
	//RoleCityDlg-unittest-start
	var m_btnCount = 6;
	var m_g = null;
	var m_this = null;
	var m_field = null;
	var m_dlg = null;
	var m_items = {};
	var m_opHdr = null;
	var m_isModal = false;
	var m_achievement = null;
		
	this.init = function(g, isModal){
		m_g = g;
		m_this = this;
		m_isModal = isModal ? true : false;
		_regEvent();
	};
	
	this.openDlg = function(field){
		m_field = field;
		if (!m_isModal) UIM.closeAllFieldDlg();
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		if (!m_dlg) return;
		m_dlg.hide();
	};
	
	var _regEvent = function(){
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.FIGHTREFSTATE, m_this, _onSvrPkg);
		m_g.regEvent(EVT.OUTFIELD_DETAIL, 0, m_this, _updateInfo);
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:m_isModal, title:'...', pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.field.rolecitydlg, m_items);
		m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		m_achievement = RoleAchievement.snew(m_g, m_items.achievement);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_startUpdater();
		_createOpHdr();
		_setTitle();
		_updateInfo();
		_getFieldDetailInfo();
		_updateAchievement();
	};	
	
	var _startUpdater = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	var _setTitle = function(){
		var title = TQ.format(rstr.field.rolecitydlg.title, m_field.roleName);
		m_dlg.setTitle(title);
	};
	
	var _createOpHdr = function(){
		if ( m_g.getImgr().isSameRole(m_field.roleName) ){
			m_opHdr = SelfRoleCityOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
		else if ( m_g.getImgr().isSameAlliance(m_field.alliance.uid) ){
			m_opHdr = SameAlliRoleCityOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
		else {
			m_opHdr = OtherAlliRoleCityOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
	};
	
	var _updateInfo = function(){
		if ( !_isShow() ){
			return;
		}
		
		m_opHdr.update();
		_setRoleBaseInfo();
		_setFightState();
		_setRoleDetailInfo();
		_updateAchievement();
	};
	
	var _getFieldDetailInfo = function(){
		if (m_field.isDetail) {
			return;
		}
		
		OutFieldSender.sendGetFieldDetail(m_g, m_field.gridId);
	};
	
	var _updateAchievement = function(){
		if (!m_field.isDetail) {
			return;
		}
		
		m_achievement.setRole({cityMaxLevel:m_field.cityMaxLevel, actTower:m_field.actTower, actTerrace:m_field.actTerrace, vip:m_field.vip});
	};
	
	var _isShow = function(){
		if (!m_dlg) {
			return false;
		}
		
		return m_dlg.isShow();
	};
	
	var _setRoleBaseInfo = function(){
		if (!m_field.isDetail) {
			_clearRoleBaseInfo();
			return;
		}
		
		IMG.setBKImage(m_items.icon, IMG.makeBigImg(m_field.icon));
		var name = RStrUtil.makeXDiamondRoleName(m_field.roleName, m_field);
		TQ.setRichText(m_items.name, name);
		
		var cityRes = ItemResUtil.findItemres( FieldUtil.getCityResIdByGridId(m_field.gridId) );
		IMG.setBKImage(m_items.stateCityFlag, IMG.makeStateCityFlag(cityRes.flagimg));
		
		TQ.setTextEx(m_items.roleLevel, m_field.level);
		
		var pos = FieldUtil.getPosByGridId(m_field.gridId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		TQ.setTextEx(m_items.cood, HyperLinkMgr.formatLink(cood));
	};
	
	var _setFightState = function(){
		if (!m_field.isDetail) {
			_clearFightState();
			return;
		}
		
		var fightRefState = m_g.getImgr().getFightRefState(m_field.roleId);
		var s = rstr.field.rolecitydlg.lbl.refstate[fightRefState];
		if ( fightRefState != REF_ROLESTATE.NORMAL){
			var refStoptime = m_g.getImgr().getFightRefStateStopTime(m_field.roleId);
			var leftTime = Math.max(0, refStoptime -  m_g.getSvrTimeS());
			s += TQ.formatTime(0, leftTime);
		}
		
		TQ.setTextEx(m_items.fightState, TQ.formatColorStr(s, _getFightRefColor(fightRefState)));
	};	
	
	var _setRoleDetailInfo = function(){
		if (!m_field.isDetail) {
			_clearRoleDetailInfo();
			return;
		}
		
		TQ.setTextEx ( m_items.alliance, m_field.alliance.name );
		TQ.setTextEx ( m_items.cityLevel, RStrUtil.getCityNameByLevel(m_field.buildval.level) );
		TQ.setTextEx ( m_items.buildVal, m_field.buildval.cur );
		TQ.setTextEx ( m_items.sort, m_field.rank );
		TQ.setRichText ( m_items.introduction, TQ.decodeMessage(m_field.introduction) );
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}
	};
	
	var _onUpdate = function(){
		_setFightState();
	};
	
	var _onLoginOk = function(){
		FightResStateSender.sendGetRefStates(m_g);
	};
	
	var _onSvrPkg = function(ndata){
		if ( ndata.data.states ) {
			TQ.dictCopy(m_g.getImgr().getFightRefStates(), ndata.data.states);
		}
	};
	
	var _getFightRefColor = function(state){
		var colors = {};
		colors[REF_ROLESTATE.NORMAL] = COLORS.ROLESTATE_NORMAL;
		colors[REF_ROLESTATE.DECLARING_FIGHT] = COLORS.ROLESTATE_DECLARING_FIGHT;
		colors[REF_ROLESTATE.FIGHTING] = COLORS.ROLESTATE_FIGHTING;
		return colors[state];
	};
	
	var _clearRoleBaseInfo = function(){
		IMG.setBKImage(m_items.icon, '');
		TQ.setTextEx(m_items.name, '');
		IMG.setBKImage(m_items.stateCityFlag, '');
		TQ.setTextEx(m_items.roleLevel, '');
		TQ.setTextEx(m_items.cood, '');
	};
	
	var _clearFightState = function(){
		TQ.setTextEx(m_items.fightState, '');
	};
	
	var _clearRoleDetailInfo = function(){
		TQ.setTextEx ( m_items.alliance, '' );
		TQ.setTextEx ( m_items.cityLevel, '' );
		TQ.setTextEx ( m_items.buildVal, '' );
		TQ.setTextEx ( m_items.sort, '' );
		TQ.setTextEx ( m_items.introduction, '' );
	};
	//RoleCityDlg-unittest-end
});
