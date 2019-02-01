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
	var _lc_={};this.lc=function(){return _lc_;};
	var m_btnCount = 6;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_field = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_opHdr = null;
	_lc_.m_isModal = false;
	_lc_.m_achievement = null;
		
	this.init = function(g, isModal){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_isModal = isModal ? true : false;
		_lc_._regEvent();
	};
	
	this.openDlg = function(field){
		_lc_.m_field = field;
		if (!_lc_.m_isModal) UIM.closeAllFieldDlg();
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.closeDlg = function(){
		if (!_lc_.m_dlg) return;
		_lc_.m_dlg.hide();
	};
	
	_lc_._regEvent = function(){
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.FIGHTREFSTATE, _lc_.m_this, _lc_._onSvrPkg);
		_lc_.m_g.regEvent(EVT.OUTFIELD_DETAIL, 0, _lc_.m_this, _lc_._updateInfo);
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:_lc_.m_isModal, title:'...', pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.field.rolecitydlg, _lc_.m_items);
		_lc_.m_dlg.setCaller({self:_lc_.m_this, caller:_lc_._onDlgEvent});
		_lc_.m_achievement = RoleAchievement.snew(_lc_.m_g, _lc_.m_items.achievement);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._startUpdater();
		_lc_._createOpHdr();
		_lc_._setTitle();
		_lc_._updateInfo();
		_lc_._getFieldDetailInfo();
		_updateAchievement();
	};	
	
	_lc_._startUpdater = function(){
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
	};
	
	_lc_._setTitle = function(){
		var title = TQ.format(rstr.field.rolecitydlg.title, _lc_.m_field.roleName);
		_lc_.m_dlg.setTitle(title);
	};
	
	_lc_._createOpHdr = function(){
		if ( _lc_.m_g.getImgr().isSameRole(_lc_.m_field.roleName) ){
			_lc_.m_opHdr = SelfRoleCityOpHdr.snew(_lc_.m_g, _lc_.m_this, m_btnCount, _lc_.m_items, _lc_.m_field);
		}
		else if ( _lc_.m_g.getImgr().isSameAlliance(_lc_.m_field.alliance.uid) ){
			_lc_.m_opHdr = SameAlliRoleCityOpHdr.snew(_lc_.m_g, _lc_.m_this, m_btnCount, _lc_.m_items, _lc_.m_field);
		}
		else {
			_lc_.m_opHdr = OtherAlliRoleCityOpHdr.snew(_lc_.m_g, _lc_.m_this, m_btnCount, _lc_.m_items, _lc_.m_field);
		}
	};
	
	_lc_._updateInfo = function(){
		if ( !_lc_._isShow() ){
			return;
		}
		
		_lc_.m_opHdr.update();
		_lc_._setRoleBaseInfo();
		_lc_._setFightState();
		_lc_._setRoleDetailInfo();
		_updateAchievement();
	};
	
	_lc_._getFieldDetailInfo = function(){
		if (_lc_.m_field.isDetail) {
			return;
		}
		
		OutFieldSender.sendGetFieldDetail(_lc_.m_g, _lc_.m_field.gridId);
	};
	
	var _updateAchievement = function(){
		if (!_lc_.m_field.isDetail) {
			return;
		}
		
		_lc_.m_achievement.setRole({cityMaxLevel:_lc_.m_field.cityMaxLevel, actTower:_lc_.m_field.actTower, actTerrace:_lc_.m_field.actTerrace, vip:_lc_.m_field.vip});
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) {
			return false;
		}
		
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._setRoleBaseInfo = function(){
		if (!_lc_.m_field.isDetail) {
			_lc_._clearRoleBaseInfo();
			return;
		}
		
		IMG.setBKImage(_lc_.m_items.icon, IMG.makeBigImg(_lc_.m_field.icon));
		var name = RStrUtil.makeXDiamondRoleName(_lc_.m_field.roleName, _lc_.m_field);
		TQ.setRichText(_lc_.m_items.name, name);
		
		var cityRes = ItemResUtil.findItemres( FieldUtil.getCityResIdByGridId(_lc_.m_field.gridId) );
		IMG.setBKImage(_lc_.m_items.stateCityFlag, IMG.makeStateCityFlag(cityRes.flagimg));
		
		TQ.setTextEx(_lc_.m_items.roleLevel, _lc_.m_field.level);
		
		var pos = FieldUtil.getPosByGridId(_lc_.m_field.gridId);
		var cood = '#[m:' + pos.x + ':' + pos.y + ']';
		TQ.setTextEx(_lc_.m_items.cood, HyperLinkMgr.formatLink(cood));
	};
	
	_lc_._setFightState = function(){
		if (!_lc_.m_field.isDetail) {
			_lc_._clearFightState();
			return;
		}
		
		var fightRefState = _lc_.m_g.getImgr().getFightRefState(_lc_.m_field.roleId);
		var s = rstr.field.rolecitydlg.lbl.refstate[fightRefState];
		if ( fightRefState != REF_ROLESTATE.NORMAL){
			var refStoptime = _lc_.m_g.getImgr().getFightRefStateStopTime(_lc_.m_field.roleId);
			var leftTime = Math.max(0, refStoptime -  _lc_.m_g.getSvrTimeS());
			s += TQ.formatTime(0, leftTime);
		}
		
		TQ.setTextEx(_lc_.m_items.fightState, TQ.formatColorStr(s, _getFightRefColor(fightRefState)));
	};	
	
	_lc_._setRoleDetailInfo = function(){
		if (!_lc_.m_field.isDetail) {
			_lc_._clearRoleDetailInfo();
			return;
		}
		
		TQ.setTextEx ( _lc_.m_items.alliance, _lc_.m_field.alliance.name );
		TQ.setTextEx ( _lc_.m_items.cityLevel, RStrUtil.getCityNameByLevel(_lc_.m_field.buildval.level) );
		TQ.setTextEx ( _lc_.m_items.buildVal, _lc_.m_field.buildval.cur );
		TQ.setTextEx ( _lc_.m_items.sort, _lc_.m_field.rank );
		TQ.setRichText ( _lc_.m_items.introduction, TQ.decodeMessage(_lc_.m_field.introduction) );
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
		}
	};
	
	_lc_._onUpdate = function(){
		_lc_._setFightState();
	};
	
	_lc_._onLoginOk = function(){
		FightResStateSender.sendGetRefStates(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(ndata){
		if ( ndata.data.states ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getFightRefStates(), ndata.data.states);
		}
	};
	
	var _getFightRefColor = function(state){
		var colors = {};
		colors[REF_ROLESTATE.NORMAL] = COLORS.ROLESTATE_NORMAL;
		colors[REF_ROLESTATE.DECLARING_FIGHT] = COLORS.ROLESTATE_DECLARING_FIGHT;
		colors[REF_ROLESTATE.FIGHTING] = COLORS.ROLESTATE_FIGHTING;
		return colors[state];
	};
	
	_lc_._clearRoleBaseInfo = function(){
		IMG.setBKImage(_lc_.m_items.icon, '');
		TQ.setTextEx(_lc_.m_items.name, '');
		IMG.setBKImage(_lc_.m_items.stateCityFlag, '');
		TQ.setTextEx(_lc_.m_items.roleLevel, '');
		TQ.setTextEx(_lc_.m_items.cood, '');
	};
	
	_lc_._clearFightState = function(){
		TQ.setTextEx(_lc_.m_items.fightState, '');
	};
	
	_lc_._clearRoleDetailInfo = function(){
		TQ.setTextEx ( _lc_.m_items.alliance, '' );
		TQ.setTextEx ( _lc_.m_items.cityLevel, '' );
		TQ.setTextEx ( _lc_.m_items.buildVal, '' );
		TQ.setTextEx ( _lc_.m_items.sort, '' );
		TQ.setTextEx ( _lc_.m_items.introduction, '' );
	};
	//RoleCityDlg-unittest-end
});
