// 君主对话框
RoleDlg = ListenerBaseDlg.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_INFO_TABIDX = 0;
	
	var m_g;
	var m_this;
	_lc_.m_dlg;
	_lc_.m_items={};
	var m_ppobj=null;
	var m_confirmppblink=null;
	_lc_.m_info = null;
	_lc_.m_achievement = null;
		
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_ppobj = PPointAssign.snew(m_g);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_.m_dlg.show();
		_lc_._initInfo();
		this._notifyOpenDlg();
	};
	
	this.closeDlg = function(){
		this.hideDlg();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) {
			_lc_.m_dlg.hide();
		}
	};
	
	this.isShow = function(){
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._initDlg = function(){
		if ( !_lc_.m_dlg ){
			_lc_.m_dlg = Dialog.snew(m_g,{modal:false,
				title:rstr.roledlg.title,
				pos:{x:'center', y:35}
				});
				
			m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.roledlg, _lc_.m_items);
			_lc_.m_info = RoleDlgInfoPanel.snew(m_g, _lc_.m_items);
			_createSavePPBlink();
			_lc_.m_items.confirmpp.setCaller({self:m_this,caller:_onClickSavePPBtn});
			_lc_.m_items.clearpp.setCaller({self:m_this,caller:_onClickClearPPBtn});
			_lc_.m_items.assignexp.setCaller({self:m_this,caller:_onClickAssignExp});
			TQ.addEvent(_lc_.m_items.cityflag, 'click', _onClickCityFlag);
			_setPPBtns('addpp', _onClickAddPPBtn);
			_setPPBtns('subpp', _onClickSubPPBtn);
			m_ppobj.setLeftPPDom(_lc_.m_items.rolepp);
			m_ppobj.setAttrCaller(_onGetRoleAttr);
			m_ppobj.setBtnStateCaller(_onBtnState);
			m_ppobj.append({drtpp:res_role_pp_drts[0], attr_b:ATTR.FOR_B, attr_a:ATTR.FOR_A, dom:_lc_.m_items.forceattr});
			m_ppobj.append({drtpp:res_role_pp_drts[1], attr_b:ATTR.IN_B, attr_a:ATTR.IN_A, dom:_lc_.m_items.polityattr});
			m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
			_lc_.m_dlg.setCaller({self:m_this,caller:_lc_._onDlgEvent});
			_lc_.m_achievement = RoleAchievement.snew(m_g, _lc_.m_items.achievement);
			
			_lc_.m_dlg.hide();
		}
	};
	
	_lc_._initInfo = function(){
		_updateAchievement();
		_updateInfo();
	};
	
	var _updateAchievement = function(){
		var roleres = m_g.getImgr().getRoleRes();
		_lc_.m_achievement.setRole({cityMaxLevel:roleres.cityMaxLevel, actTower:roleres.actTower, actTerrace:roleres.actTerrace, vip:m_g.getImgr().getVipLevel()});
	};
	
	var _updateInfo = function(){
		var imgr = m_g.getImgr();
		var roleres = imgr.getRoleRes();
		
		var curPPS = imgr.getRoleAttrVal(ATTR.PP);
		if ( m_ppobj.isChanged(curPPS) ) {
			m_ppobj.setLeftPP(curPPS);
		}
		
		IMG.setBKImage(_lc_.m_items.roleicon, IMG.makeBigImg(roleres.itemres.bigpic));
		TQ.setTextEx(_lc_.m_items.roleName,  roleres.name);
		TQ.setTextEx(_lc_.m_items.level, roleres.level);
		TQ.setTextEx(_lc_.m_items.rsort, roleres.ranking);
		
		_lc_.m_items.phybar.setRange(imgr.getRoleAttrVal(ATTR.MPS));
		_lc_.m_items.phybar.setValue(0,imgr.getRoleAttrVal(ATTR.PS));
		
		_lc_.m_items.healthbar.setRange(imgr.getRoleAttrVal(ATTR.MHEALTH));
		_lc_.m_items.healthbar.setValue(0,imgr.getRoleAttrVal(ATTR.HEALTH));
		
		_lc_.m_items.expbar.setRange(imgr.getRoleAttrVal(ATTR.NXP));
		_lc_.m_items.expbar.setValue(0,imgr.getRoleAttrVal(ATTR.XP));
		
		_lc_.m_items.armforcesbar.setRange(imgr.getRoleAttrVal(ATTR.MAF));
		_lc_.m_items.armforcesbar.setValue(0,imgr.getRoleAttrVal(ATTR.AF));
		
		TQ.setTextEx(_lc_.m_items.alli, roleres.alliance.name);
		TQ.setTextEx(_lc_.m_items.prestige, roleres.prestige);
		TQ.setTextEx(_lc_.m_items.cityhonor, roleres.cityhonor);
		
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		IMG.setBKImage(_lc_.m_items.cityflag,IMG.makeStateCityFlag(cityres.flagimg));
		
		_lc_.m_items.herosexpbar.setRange(imgr.getRoleAttrVal(ATTR.MXPS));
		_lc_.m_items.herosexpbar.setValue(0,imgr.getRoleAttrVal(ATTR.XPS));
		
		HelpGuider.firstAssignRolePP(_lc_.m_items.addpp0.getDom(),  imgr.getRoleAttrVal(ATTR.PP));
		HelpGuider.firstChangeCountry(_lc_.m_items.cityflag );
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			HelpGuider.hideTipDlgById(HelpGuider.HELP_TIP.CHANGE_CITY);
			HelpGuider.hideTipDlgById(HelpGuider.HELP_TIP.ASSIGN_ROLEPP);
		}
	};
	
	var _onRolebaseChange = function () {
		_updateInfo();
	};
	
	var _onClickCityFlag = function() {
		UIM.openDlg('changecity');
		HelpGuider.sendHelpTip(m_g, HelpGuider.HELP_TIP.CHANGE_CITY);
	};
	
	var _onClickAddPPBtn = function(id){
		m_ppobj.add(id);
	};
	
	var _onClickSubPPBtn = function(id){
		m_ppobj.sub(id);
	};
	
	var _setPPBtns = function(pptag, caller){
		for ( var i=0; i<2; ++i ){
			_lc_.m_items[pptag+i].setId(i);
			_lc_.m_items[pptag+i].setType(BTN_TYPE.TIMER);
			_lc_.m_items[pptag+i].setCaller({self:m_this, caller:caller});
		}
	};
	
	var _onGetRoleAttr = function(attr) {
		return m_g.getImgr().getRoleAttrVal(attr);
	};
	
	var _onClickSavePPBtn = function (id) {
		RoleSender.sendSavePP(m_g, m_ppobj.getAssignStr());
		HelpGuider.sendHelpTip(m_g, HelpGuider.HELP_TIP.ASSIGN_ROLEPP);
	};
	
	var _onClickClearPPBtn = function(id) {
		UIM.openDlg('clearrolepp');
	};
	
	var _onClickAssignExp = function(id) {
		UIM.openDlg('roleassignexp');
	};
	
	var _onBtnState = function (tag, id, enable) {
		if ( tag == 'confirm' ) {
			_lc_.m_items.confirmpp.enable(enable);
			if ( enable ){
				m_confirmppblink.start(-1);
			} else {
				m_confirmppblink.stop();
			}
		} else if ( tag == 'add' ) {
			_lc_.m_items['addpp'+id].enable(enable);
		} else if ( tag == 'sub' ) {
			_lc_.m_items['subpp'+id].enable(enable);
		}
	};
	
	var _createSavePPBlink = function(){
		var btndom = _lc_.m_items.confirmpp.getDom();
		m_confirmppblink = BlinkingPanel.snew(m_g,{borderw:2});
		m_confirmppblink.bind(
			btndom,
			btndom,
			BLINKING_TYPE.INSERT,
			-1, -1, TQ.getDomWidth(btndom)+2, TQ.getDomHeight(btndom)+2);
	};
	//RoleDlg-unittest-end
});

RoleStateHdr = Class.extern(function(){
	this.g_ = null;
	this.init = function(g){
		this.g_ = g;
	};
	
	this.getRoleStateText = function(){
		return this._getSubHdr().getRoleStateText();
	};
	
	this.getOpBtnTextAndEnable = function(){
		return this._getSubHdr().getOpBtnTextAndEnable();
	};
	
	this.getToolTip = function(){
		return this._getSubHdr().getToolTip();
	};
	
	this._getSubHdr = function(){
		this._createSubHdrs();
		if ( this.g_.getImgr().hasRoleState(RES_EFF.AVOIDFIGHTCD) ) {
			return this.avoidFightCDState_;
		} else if ( this.g_.getImgr().hasRoleState(RES_EFF.AVOIDFIGHT) ) {
			return this.avoidFightState_;
		} else if ( this.g_.getImgr().hasRoleState(RES_EFF.YOUNG_STATE) ) {
			return this.youngState_;
		} else {
			return this.freeState_;
		}
	};
	
	this._createSubHdrs = function(){
		this.freeState_ = this.freeState_ ? this.freeState_  : RoleFreeStateHdr.snew(this.g_);
		this.avoidFightState_ = this.avoidFightState_ ? this.avoidFightState_ : RoleAvoidFightStateHdr.snew(this.g_);
		this.avoidFightCDState_ = this.avoidFightCDState_ ? this.avoidFightCDState_ : RoleAvoidFightCDStateHdr.snew(this.g_);
		this.youngState_ = this.youngState_ ? this.youngState_ : RoleYoungStateHdr.snew(this.g_);
	};
	
	this._getRoleEffectState = function(effectStateId, lbl){
		var state = this.g_.getImgr().getRoleState(effectStateId);
		var leftTime = Math.max(0, state.stoptime - this.g_.getSvrTimeS());
		return TQ.format(lbl, TQ.formatTime(0, leftTime));
	};
});

RoleFreeStateHdr = RoleStateHdr.extern(function(){
	this.getRoleStateText = function(){
		var roleres = this.g_.getImgr().getRoleRes();
		return rstr.comm.rolestate[roleres.state];
	};
	
	this.getOpBtnTextAndEnable = function(){
		return {enable:true, text:rstr.roledlg.btns.avoidfight};
	};
	
	this.getToolTip = function(){
		return rstr.roledlg.tips.roleFreeState;
	};
});

RoleAvoidFightStateHdr = RoleStateHdr.extern(function(){
	this.getRoleStateText = function(){
		return this._getRoleEffectState(RES_EFF.AVOIDFIGHT, rstr.roledlg.lbl.avoidfight);
	};
	
	this.getOpBtnTextAndEnable = function(){
		return {enable:true, text:rstr.roledlg.btns.stopavoidfight};
	};
	
	this.getToolTip = function(){
		return rstr.roledlg.tips.roleAvoidFightState;
	};
});

RoleAvoidFightCDStateHdr = RoleStateHdr.extern(function(){
	this.getRoleStateText = function(){
		return this._getRoleEffectState(RES_EFF.AVOIDFIGHTCD, rstr.comm.cooldown);
	};
	
	this.getOpBtnTextAndEnable = function(){
		return {enable:false, text:rstr.roledlg.btns.avoidfight};
	};
	
	this.getToolTip = function(){
		return rstr.roledlg.tips.roleAvoidFightCDState;
	};
});

RoleYoungStateHdr = RoleStateHdr.extern(function(){
	this.getRoleStateText = function(){
		return this._getRoleEffectState(RES_EFF.YOUNG_STATE, rstr.roledlg.lbl.youngstate);
	};
	
	this.getOpBtnTextAndEnable = function(){
		return {enable:false, text:rstr.roledlg.btns.avoidfight};
	};
	
	this.getToolTip = function(){
		return rstr.roledlg.tips.roleYoungState;
	};
});

RoleDlgInfoPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_items = null;
	_lc_.m_isShow = false;
	var m_roleStateHdr = null;
	this.init = function(g, items){
		_lc_._setParams(this, g, items);
		m_roleStateHdr = RoleStateHdr.snew(_lc_.m_g);
		_setTipCaller();
		_lc_._regEvents();
		_lc_._setSelfSignMaxLen();
		_lc_._update();
		
	};
	
	this.show = function(){
		_lc_.m_isShow = true;
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		_lc_._update();
	};
	
	this.hide = function(){
		_lc_.m_isShow = false;
		_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
	};
	
	_lc_._setParams = function(selfThis, g, items) {
		_lc_.m_g = g;
		_lc_.m_this = selfThis;
		_lc_.m_items = items;
	};
	
	var _setTipCaller = function(){
		TTIP.setCallerData(_lc_.m_items.tooltips[TIP_PREFIX + 'rolestate'], {self:_lc_.m_this, caller:_onGetRoleStateTip}, {});
	};
	
	_lc_._regEvents = function(){
		_lc_.m_items.movepopu.setCaller({self:_lc_.m_this, caller:_lc_._onClickMovePopu});
		_lc_.m_items.changestate.setCaller({self:_lc_.m_this, caller:_lc_._onClickChangeState});
		_lc_.m_items.avoidfight.setCaller({self:_lc_.m_this, caller:_lc_._onClickAvoidFight});
		_lc_.m_items.savemodify.setCaller({self:_lc_.m_this, caller:_lc_._onClickSaveModify});
		_lc_.m_items.cancelsave.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancelSave});
		TQ.addEvent(_lc_.m_items.iselfsign.getContainerObj(), 'keyup', _lc_._onSelfSignChange);
		
		_lc_.m_g.regEvent(EVT.ROLEBASE, 0, _lc_.m_this, _lc_._onRolebaseChange);
		_lc_.m_g.regEvent(EVT.ROLEBASE, 1, _lc_.m_this, _lc_._onRoleIntroductionChange);
		_lc_.m_g.regEvent(EVT.ROLESPECSTATE_CHANGE, 0, _lc_.m_this, _lc_._onRoleSpecStateChange);
	};
	
	_lc_._setSelfSignMaxLen = function(){
		InputLimit.maxGBKBytes(_lc_.m_items.iselfsign.getContainerObj(), JVALID.getSelfSignMaxLen());
	};
	
	_lc_._update = function(){
		_lc_._udpateCityInfo();
		_lc_._udpateSelfSign();
		_lc_._updateRoleState();
		_lc_._updateRestBtn();		
	};
	
	_lc_._udpateCityInfo = function(){
		var roleres = _lc_.m_g.getImgr().getRoleRes();
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		TQ.setTextEx(_lc_.m_items.statecity, cityres.name);
		TQ.setTextEx(_lc_.m_items.position, roleres.pos.x+','+roleres.pos.y);
	};
	
	_lc_._udpateSelfSign = function(){
		_lc_.m_items.iselfsign.getContainerObj().value = 
			TQ.decodeMessageForText(_lc_.m_g.getImgr().getRoleRes().introduction);
		_lc_._hideModifyBtns();
	};
	
	_lc_._updateRoleState = function(){
		TQ.setTextEx(_lc_.m_items.rolestate, m_roleStateHdr.getRoleStateText());
	};
	
	_lc_._updateRestBtn = function(){
		var btnInfo = m_roleStateHdr.getOpBtnTextAndEnable();
		_lc_.m_items.avoidfight.enable(btnInfo.enable);
		_lc_.m_items.avoidfight.setText(btnInfo.text);
	};	
	
	var _onGetRoleStateTip = function(){
		return m_roleStateHdr.getToolTip();
	};
	
	_lc_._onUpdate = function(){
		_lc_._updateRoleState();
	};
	
	_lc_._onClickMovePopu = function(){
		UIM.openDlg('changecity');
	};
	
	_lc_._onClickChangeState = function(){
		var role = _lc_.m_g.getImgr().getRoleRes();
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.RAND_MOVECITY, RES_EFF.SETPOS_MOVECITY], 
			{id:role.id, name:role.name, type:RES_TRG.SELF_ROLE} );
	};
	
	_lc_._onClickAvoidFight = function(){
		if ( _lc_._isResetState() ) {
			_lc_._cancelResetState();
		}
		else {
			_lc_._setResetState();
		}
	};
	
	_lc_._isResetState = function() {
		var role = _lc_.m_g.getImgr().getRoleRes();
		return role.state == ROLE_STATE.REST;
	};
	
	_lc_._cancelResetState = function() {
		_lc_._onCancelResetCallback = function(id){
			if ( id == MB_IDYES ){
				RoleStateSender.cancelState(_lc_.m_g, RES_EFF.AVOIDFIGHT);
			}
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.roledlg.tips.cancelReset, MB_F_YESNO, {self:_lc_.m_this, caller:_lc_._onCancelResetCallback});
	};
	
	_lc_._setResetState = function() {
		var role = _lc_.m_g.getImgr().getRoleRes();
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.AVOIDFIGHT], 
			{id:role.id, name:role.name, type:RES_TRG.SELF_ROLE} );
	};
	
	_lc_._onClickSaveModify = function(){
		RoleSender.sendSelfSign(_lc_.m_g, _lc_._encodeSelfSign(_lc_.m_items.iselfsign.getContainerObj().value));
	};
	
	_lc_._onClickCancelSave = function(){
		_lc_._udpateSelfSign();
	};
	
	_lc_._onSelfSignChange = function(){
		var isModify = _lc_._encodeSelfSign() != _lc_.m_g.getImgr().getRoleRes().introduction;
		if ( isModify ) {
			_lc_._showModifyBtns();
		}
		else {
			_lc_._hideModifyBtns();
		}
	};
	
	_lc_._onRolebaseChange = function(){
		_lc_._udpateCityInfo();
		_lc_._updateRoleState();
		_lc_._updateRestBtn();
	};
	
	_lc_._onRoleIntroductionChange = function(){
		_lc_._udpateSelfSign();
	};
	
	_lc_._onRoleSpecStateChange = function(){
		if ( !_lc_.m_isShow ) return;
		_lc_._updateRoleState();
		_lc_._updateRestBtn();
	};

	_lc_._showModifyBtns = function(){
		_lc_.m_items.savemodify.show();
		_lc_.m_items.cancelsave.show();
	};
	
	_lc_._hideModifyBtns = function(){
		_lc_.m_items.savemodify.hide();
		_lc_.m_items.cancelsave.hide();
	};
	
	_lc_._encodeSelfSign = function(){
		return TQ.encodeMsgByBytesLimit(_lc_.m_items.iselfsign.getContainerObj().value, JVALID.getSelfSignMaxBytes());
	};
	//RoleDlgInfoPanel-unittest-end
});

// 分配潜力点 
PPointAssign = Class.extern(function(){
	this.init = function(g){
		this.g = g;
		this.list = [];
		this.leftpps = 0;
		this.originalLeftPPS = 0;
		this.leftppdom = null;
		this.getAttrCaller = null;
		this.btnStateCaller = null;
	};
	
	this.setAttrCaller = function(caller){
		this.getAttrCaller = caller;
	};
	
	this.setBtnStateCaller = function(caller){
		this.btnStateCaller = caller;
	};
	
	this.setLeftPPDom = function(dom){
		this.leftppdom = dom;
	};
	
	this.append = function(item){
		item.pps = 0;
		this.list.push(item);
	};
	
	this.isChanged = function(leftpp){
		if ( leftpp != this.originalLeftPPS || leftpp == 0 ) {
			return true;
		}
		
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			var curAttr = this.getAttrCaller(it.attr_b)+this.getAttrCaller(it.attr_a);
			if ( curAttr != it.originalAttr ) {
				return true;
			}
		}
		
		return false;
	};
	
	this.clear = function(){
		this.leftpps = 0;
		this._clearOriginalAttrs();
		this._clearCurPPS();
		this._refresh();	
	};
	
	this.setLeftPP = function(leftpp){
		this.leftpps = leftpp;
		this._saveOriginalAttrs();
		this._clearCurPPS();
		this._refresh();	
	};
	
	this.getLeftPP = function(){
		return this.leftpps;
	};
	
	this.add = function(idx){
		var item = this.list[idx];
		if ( this.leftpps >= item.drtpp ) {
			item.pps += item.drtpp;
			this.leftpps -= item.drtpp;
			this._refresh();
		}
	};
	
	this.sub = function(idx){
		var item = this.list[idx];
		if ( item.pps >= item.drtpp ) {
			item.pps -= item.drtpp;
			this.leftpps += item.drtpp;
			this._refresh();
		}
	};
	
	this.getAssignStr = function () {
		var s = '';
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			s = s+',p'+i+'='+it.pps;
		}
		return s;
	};	
	
	this._saveOriginalAttrs = function(){
		this.originalLeftPPS = this.leftpps;
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			it.originalAttr = this.getAttrCaller(it.attr_b)+this.getAttrCaller(it.attr_a);
		}
	};
	
	this._clearOriginalAttrs = function(){
		this.originalLeftPPS = 0;
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			it.originalAttr = 0;
		}
	};
	
	this._clearCurPPS = function(){
		for ( var i=0; i<this.list.length; ++i ) {
			this.list[i].pps = 0;
		}
	};
	
	this._refresh = function() {
		this._setVal();
		this._checkButtons();
	};
	
	this._setVal = function() {
		TQ.setTextEx(this.leftppdom, this.leftpps);
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			var baseVal = this.getAttrCaller(it.attr_b) + parseInt(it.pps / it.drtpp, 10);
			var appendVal = this.getAttrCaller(it.attr_a);
			if ( appendVal > 0 ) {
				appendVal = '(' + TQ.formatColorStr('+' + appendVal, COLORS.APPEND_ATTR) + ')';
			}
			TQ.setTextEx(it.dom, baseVal + appendVal );
		}
	};
	
	this._checkButtons = function() {
		var assignpps = 0;
		for ( var i=0; i<this.list.length; ++i ) {
			var it = this.list[i];
			assignpps += it.pps;
			this.btnStateCaller('add', i, (this.leftpps >= it.drtpp));
			this.btnStateCaller('sub', i, (it.pps >= it.drtpp));
		}
		this.btnStateCaller('confirm', 0, (assignpps > 0));
	};
});

// 改变州对话框
ChangeCityDlg = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		m_dlg.show();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.closeDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	this.getItems = function(){ // for test case
		return m_items;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
				title:rstr.changecitydlg.title,
				pos:{x:'center', y:35}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.changecitydlg, m_items);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
			m_items.confirmbtn.setCaller({self:m_this, caller:_onConfirmBtn});
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		_updateInfo();
	};
	
	var _updateInfo = function(){
		var imgr = m_g.getImgr();
		var roleres = imgr.getRoleRes();
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		IMG.setBKImage(m_items.curcity,IMG.makeStateCityFlag(cityres.flagimg));
		
		var citys = [9900001,9900002,9900003];
		for ( var i=listidx=0; i<citys.length; ++i ) {
			var cityid = citys[i];
			if ( cityid != roleres.cityid ) {
				var item = m_items.list.getItem(listidx++);
				var cityres = ItemResUtil.findItemres(cityid);
				IMG.setBKImage(item.exsubs.icon,IMG.makeStateCityFlag(cityres.flagimg));
				item.cityid = cityid;
			}
		}
		
		var needgold = _getNeedGold();
		TQ.setHtml(m_items.needgold, _getColorData(needgold));
 	};
	
	var _getNeedGold = function(){
		return m_g.getImgr().isNewPlayer() ? 0 : 100;
	};
	
	var _getColorData = function (need) {
		if ( need == 0 ) {
			return  TQ.formatColorStr(rstr.changecitydlg.lbl.newplayer, COLORS.ENOUGH_GOLD);
		} else if ( need <= m_g.getImgr().getGold() ) {
			return  TQ.formatColorStr(need, COLORS.ENOUGH_GOLD);
		} else {
			return  TQ.formatColorStr(need, COLORS.NOTENOUGH_GOLD);
		}
	};
	
	var _onConfirmBtn = function(id){
		if ( !_checkValid() ) return;
		var cityid = m_items.list.getItem(m_items.list.getCurSel()).cityid;
		RoleSender.sendChangeCity(m_g, cityid);
		m_dlg.hide();
	};
	
	var _checkValid = function() {
		if ( m_items.list.getCurSel() < 0 ){
			m_g.getGUI().sysMsgTips(SMT_ERROR, rstr.changecitydlg.msg.err_nosel);
			return false;
		}
		
		var expends = [{attr:ATTR.GIFTGOLD,type:EXPEND_TYPE.GIFTGOLD,val:_getNeedGold()}];
		var expendobjs = ExpendUtil.createExpendObjs(m_g, 0, expends);
		if ( !ExpendUtil.isEnough(expendobjs) ) return false;
		
		var roleres = m_g.getImgr().getRoleRes();
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000, 10);
		if ( svrtime < roleres.citycd ) {
			m_g.getGUI().sysMsgTips(SMT_ERROR, rstr.changecitydlg.msg.err_colddown);
			return false;
		}
		
		if ( roleres.alliance.uid != 0 ) {
			m_g.getGUI().sysMsgTips(SMT_ERROR, rstr.changecitydlg.msg.err_hasalli);
			return false;
		}
		
		var heros = m_g.getImgr().getHeros().list;
		for ( var i=0; i<heros.length; ++i ) {
			var hero = heros[i];
			if ( hero.state == HERO_STATE.EXPED ) {
				m_g.getGUI().sysMsgTips(SMT_ERROR, rstr.changecitydlg.msg.err_heronofree);
				return false;
			}
		}
		
		return true;
	};
	
	_onUpdate = function(curTimeMs) {
		var roleres = m_g.getImgr().getRoleRes();
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000, 10);
		var lefttime = roleres.citycd - svrtime;
		if ( lefttime < 0 ) lefttime = 0;
		TQ.setTextEx(m_items.colddown, TQ.formatTime(0,lefttime));
	};
	
	_onDlgEvent = function(id) {
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}
	};
});

// 主角洗点对话框
ClearRolePPDlg = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	_lc_.m_dlg=null;
	_lc_.m_items={};
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		_lc_.m_dlg.show();
	};
	
	this.closeDlg = function(){
		_lc_.m_dlg.hide();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !_lc_.m_dlg ){
			_lc_.m_dlg = Dialog.snew(m_g,{modal:true,
				title:rstr.clearroleppdlg.title,
				pos:{x:'center', y:35},
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_lc_._onConfirmBtn}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onCancelBtn}}]
				});
			m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.clearroleppdlg, _lc_.m_items);
			_lc_.m_items.buyitembtn.setCaller({self:m_this, caller:_lc_._onBuyItemBtn});
			_lc_.m_items.iforce.setLimit(_lc_._getClearForceLimit);
			_lc_.m_items.ipolity.setLimit(_lc_._getClearPolityLimit);
			_lc_.m_items.iforce.setCaller({self:m_this,caller:_lc_._onClearForceChange});
			_lc_.m_items.ipolity.setCaller({self:m_this,caller:_lc_._onClearPolityChange});
			_lc_.m_dlg.hide();
			m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _lc_._onItemChanged);
		}
	};
	
	var _initInfo = function(){
		_lc_.m_items.iforce.setVal(0);
		_lc_.m_items.ipolity.setVal(0);
		_updateInfo();
	};
	
	var _updateInfo = function(){
		TQ.setTextEx(_lc_.m_items.lblclearforce, TQ.format(rstr.clearroleppdlg.lbl.clearforce, _lc_._getAttrValByAddPP(ATTR.FOR_B)));
		TQ.setTextEx(_lc_.m_items.lblclearpolity, TQ.format(rstr.clearroleppdlg.lbl.clearpolity, _lc_._getAttrValByAddPP(ATTR.IN_B)));
	};
	
	_lc_._onBuyItemBtn = function(){
		UIM.getDlg('buyitemlist').openDlg([FIXID.CLEARFORCARD, FIXID.CLEARINCARD]);
	};
	
	_lc_._onConfirmBtn = function(){
		var forceval = _lc_.m_items.iforce.getVal();
		var polityval = _lc_.m_items.ipolity.getVal();
		if ( forceval <= 0 && polityval <= 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.clearroleppdlg.msg.noneedclear);
		}
		else {
			RoleSender.sendClearPP(m_g, forceval, polityval);
		}
		_lc_.m_dlg.hide();
	};
	
	var _onCancelBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._getClearForceLimit = function(){
		return _lc_._getLimit(ATTR.FOR_B, FIXID.CLEARFORCARD);
	};
	
	_lc_._getClearPolityLimit = function(){
		return _lc_._getLimit(ATTR.IN_B, FIXID.CLEARINCARD);
	};
	
	_lc_._getLimit = function(attrid, itemResId){
		var addval = _lc_._getAttrValByAddPP(attrid);
		var cardnum = m_g.getImgr().getItemNumByResId(itemResId);	
		return {min:0, max:Math.min(addval, cardnum)};	
	};
	
	_lc_._onClearForceChange = function(num){
		_lc_._setNeedItem(num, FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
	};
	
	_lc_._onClearPolityChange = function(num){
		_lc_._setNeedItem(num, FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem');
	};
	
	_lc_._onItemChanged = function(){
		if (!_lc_.m_dlg.isShow()) return;
		_lc_._setNeedItem(_lc_.m_items.iforce.getVal(), FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
		_lc_._setNeedItem(_lc_.m_items.ipolity.getVal(), FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem');
	};	
	
	_lc_._setNeedItem = function(num, itemResId, lbl, itemtag){
		var cardnum = m_g.getImgr().getItemNumByResId(itemResId);
		cardnum = TQ.formatColorStr(cardnum, (cardnum == 0) ? COLORS.NO_ENOUGH_ITEM : COLORS.ENOUGH_ITEM );
		TQ.setTextEx( _lc_.m_items[itemtag], TQ.format(lbl, num, cardnum) );
	};

	_lc_._getAttrValByAddPP = function(attrid){
		var imgr = m_g.getImgr();
		return imgr.getRoleAttrVal(attrid) - imgr.getRoleInitAttrVal(attrid);
	};
	
	this.init.apply(this, arguments);
	//ClearRolePPDlg-unittest-end
};

// 经验分配对话框
RoleAssignExpDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	_lc_.m_items={};
	var m_curselectheroidx=0;
	_lc_.m_curhero=null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(heroid){
		_initDlg();
		_initInfo(heroid);
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	this.isShow = function(){
		return m_dlg && m_dlg.isShow();
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
				title:rstr.roleassignexpdlg.title,
				pos:{x:'center', y:45},
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_lc_._onClickConfirmBtn}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickCancelBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.roleassignexpdlg, _lc_.m_items);
			_lc_.m_items.herolist.setCaller({self:m_this,caller:_onSelectHero});
			m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroAttr);
			m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
			_lc_.m_items.iassignexp.setLimit(_lc_._getExpLimit);
			_lc_.m_items.upgradeneed.setCaller({self:m_this,caller:_onSetUpgradeExp});
		}
		m_dlg.show();
	};
	
	var _initInfo = function(heroid){
		if ( heroid == undefined ) m_curselectheroidx = 0;
		else m_curselectheroidx = m_g.getImgr().getHeroIdxFromId(heroid);
		_updateInfo();
	};
	
	var _updateInfo = function(){
		if ( !m_this.isShow() ) return;
		_updateHeroList();
		_updateRoleExpsBar();
	};
	
	var _onSelectHero =  function(e,sel){
		m_curselectheroidx = sel;
		_lc_.m_curhero = m_g.getImgr().getHeroByIdx(sel);
		_updateHeroInfo();
	};
	
	_lc_._onClickConfirmBtn = function() {
		var exp = _lc_.m_items.iassignexp.getVal();
		_lc_.m_items.iassignexp.setVal(0);
		if ( exp <= 0 || !_lc_.m_curhero ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.roleassignexpdlg.msg.noexp);
			return;
		}
		
		RoleSender.sendAssignExp(m_g, _lc_.m_curhero.id, exp);
	};
	
	var _onClickCancelBtn = function() {
		m_dlg.hide();
	};
	
	var _onHeroAttr = function() {
		_updateHeroList();
		_updateHeroInfo();
	};
	
	var _onRolebaseChange = function(){
		_updateRoleExpsBar();
	};
	
	var _onSetUpgradeExp = function() {
		var imgr = m_g.getImgr();
		var max = imgr.getRoleAttrVal(ATTR.XPS);
		var need = imgr.getHeroAttrVal(_lc_.m_curhero, ATTR.NXP) - imgr.getHeroAttrVal(_lc_.m_curhero, ATTR.XP);
		need = need > 0 ? need : 0;
		if ( imgr.isMaxHeroLevel(_lc_.m_curhero) ) {
			need = 0;
		}
		if ( imgr.isMaxHeroLevel(_lc_.m_curhero) && !imgr.isMaxMaxHeroLevel(_lc_.m_curhero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.roleassignexpdlg.msg.maxlevel);
		}
		_lc_.m_items.iassignexp.setVal(Math.min(need, max));
	};
	
	_lc_._getExpLimit = function() {
		var max = m_g.getImgr().getRoleAttrVal(ATTR.XPS);
		return {min:0, max:max};
	};
	
	var _updateHeroList = function() {
		_lc_.m_items.herolist.deleteAllItem();
		_lc_.m_items.herolist.setTitle(rstr.roleassignexpdlg.lbl.nohero);
		var imgr = m_g.getImgr();
		var heros = imgr.getHeros().list;
		for ( var i=0, n=heros.length; i<n; ++i ){
			var hero = heros[i];
			if ( !hero.attrs ) HeroSender.sendGetDetail(m_g, hero.id); 
			var nextxp = imgr.getHeroAttrVal(hero, ATTR.NXP);
			var curxp = imgr.getHeroAttrVal(hero, ATTR.XP);
			var curxpper = 100;
			if ( nextxp > 0 ) {
				curxpper = Math.min(parseInt(curxp*100/nextxp, 10), 100);
			}
			if ( imgr.isMaxHeroLevel(hero) ) {
				curxpper = 100;
			}
			var text = TQ.format(rstr.roleassignexpdlg.msg.selname, hero.name, hero.level, curxpper);
			_lc_.m_items.herolist.addItem({text:text});
		}
		_lc_.m_items.herolist.setCurSel(m_curselectheroidx);
	};
	
	var _updateHeroInfo = function(){
		var imgr = m_g.getImgr();
		_lc_.m_items.heroexpbar.setRange(imgr.getHeroAttrVal(_lc_.m_curhero, ATTR.NXP));
		_lc_.m_items.heroexpbar.setValue(0, imgr.getHeroAttrVal(_lc_.m_curhero, ATTR.XP));
	};
	
	var _updateRoleExpsBar = function(){
		var imgr = m_g.getImgr();
		_lc_.m_items.expsbar.setRange(imgr.getRoleAttrVal(ATTR.MXPS));
		_lc_.m_items.expsbar.setValue(0,imgr.getRoleAttrVal(ATTR.XPS));
	};
	//RoleAssignExpDlg-unittest-end
});
