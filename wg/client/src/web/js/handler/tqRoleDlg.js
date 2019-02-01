// 君主对话框
RoleDlg = ListenerBaseDlg.extern(function(){
	//RoleDlg-unittest-start
	var C_INFO_TABIDX = 0;
	
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_ppobj=null;
	var m_confirmppblink=null;
	var m_info = null;
	var m_achievement = null;
		
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_ppobj = PPointAssign.snew(m_g);
	};
	
	this.openDlg = function(){
		_initDlg();
		m_dlg.show();
		_initInfo();
		this._notifyOpenDlg();
	};
	
	this.closeDlg = function(){
		this.hideDlg();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) {
			m_dlg.hide();
		}
	};
	
	this.isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
				title:rstr.roledlg.title,
				pos:{x:'center', y:35}
				});
				
			m_g.getGUI().initDlg(m_dlg, uicfg.roledlg, m_items);
			m_info = RoleDlgInfoPanel.snew(m_g, m_items);
			_createSavePPBlink();
			m_items.confirmpp.setCaller({self:m_this,caller:_onClickSavePPBtn});
			m_items.clearpp.setCaller({self:m_this,caller:_onClickClearPPBtn});
			m_items.assignexp.setCaller({self:m_this,caller:_onClickAssignExp});
			TQ.addEvent(m_items.cityflag, 'click', _onClickCityFlag);
			_setPPBtns('addpp', _onClickAddPPBtn);
			_setPPBtns('subpp', _onClickSubPPBtn);
			m_ppobj.setLeftPPDom(m_items.rolepp);
			m_ppobj.setAttrCaller(_onGetRoleAttr);
			m_ppobj.setBtnStateCaller(_onBtnState);
			m_ppobj.append({drtpp:res_role_pp_drts[0], attr_b:ATTR.FOR_B, attr_a:ATTR.FOR_A, dom:m_items.forceattr});
			m_ppobj.append({drtpp:res_role_pp_drts[1], attr_b:ATTR.IN_B, attr_a:ATTR.IN_A, dom:m_items.polityattr});
			m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
			m_achievement = RoleAchievement.snew(m_g, m_items.achievement);
			
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		_updateAchievement();
		_updateInfo();
	};
	
	var _updateAchievement = function(){
		var roleres = m_g.getImgr().getRoleRes();
		m_achievement.setRole({cityMaxLevel:roleres.cityMaxLevel, actTower:roleres.actTower, actTerrace:roleres.actTerrace, vip:m_g.getImgr().getVipLevel()});
	};
	
	var _updateInfo = function(){
		var imgr = m_g.getImgr();
		var roleres = imgr.getRoleRes();
		
		var curPPS = imgr.getRoleAttrVal(ATTR.PP);
		if ( m_ppobj.isChanged(curPPS) ) {
			m_ppobj.setLeftPP(curPPS);
		}
		
		IMG.setBKImage(m_items.roleicon, IMG.makeBigImg(roleres.itemres.bigpic));
		TQ.setTextEx(m_items.roleName,  roleres.name);
		TQ.setTextEx(m_items.level, roleres.level);
		TQ.setTextEx(m_items.rsort, roleres.ranking);
		
		m_items.phybar.setRange(imgr.getRoleAttrVal(ATTR.MPS));
		m_items.phybar.setValue(0,imgr.getRoleAttrVal(ATTR.PS));
		
		m_items.healthbar.setRange(imgr.getRoleAttrVal(ATTR.MHEALTH));
		m_items.healthbar.setValue(0,imgr.getRoleAttrVal(ATTR.HEALTH));
		
		m_items.expbar.setRange(imgr.getRoleAttrVal(ATTR.NXP));
		m_items.expbar.setValue(0,imgr.getRoleAttrVal(ATTR.XP));
		
		m_items.armforcesbar.setRange(imgr.getRoleAttrVal(ATTR.MAF));
		m_items.armforcesbar.setValue(0,imgr.getRoleAttrVal(ATTR.AF));
		
		TQ.setTextEx(m_items.alli, roleres.alliance.name);
		TQ.setTextEx(m_items.prestige, roleres.prestige);
		TQ.setTextEx(m_items.cityhonor, roleres.cityhonor);
		
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		IMG.setBKImage(m_items.cityflag,IMG.makeStateCityFlag(cityres.flagimg));
		
		m_items.herosexpbar.setRange(imgr.getRoleAttrVal(ATTR.MXPS));
		m_items.herosexpbar.setValue(0,imgr.getRoleAttrVal(ATTR.XPS));
		
		HelpGuider.firstAssignRolePP(m_items.addpp0.getDom(),  imgr.getRoleAttrVal(ATTR.PP));
		HelpGuider.firstChangeCountry(m_items.cityflag );
	};
	
	var _onDlgEvent = function(id){
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
			m_items[pptag+i].setId(i);
			m_items[pptag+i].setType(BTN_TYPE.TIMER);
			m_items[pptag+i].setCaller({self:m_this, caller:caller});
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
			m_items.confirmpp.enable(enable);
			if ( enable ){
				m_confirmppblink.start(-1);
			} else {
				m_confirmppblink.stop();
			}
		} else if ( tag == 'add' ) {
			m_items['addpp'+id].enable(enable);
		} else if ( tag == 'sub' ) {
			m_items['subpp'+id].enable(enable);
		}
	};
	
	var _createSavePPBlink = function(){
		var btndom = m_items.confirmpp.getDom();
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
	//RoleDlgInfoPanel-unittest-start
	var m_g = null;
	var m_this = null;
	var m_items = null;
	var m_isShow = false;
	var m_roleStateHdr = null;
	this.init = function(g, items){
		_setParams(this, g, items);
		m_roleStateHdr = RoleStateHdr.snew(m_g);
		_setTipCaller();
		_regEvents();
		_setSelfSignMaxLen();
		_update();
		
	};
	
	this.show = function(){
		m_isShow = true;
		m_g.regUpdater(m_this, _onUpdate, 1000);
		_update();
	};
	
	this.hide = function(){
		m_isShow = false;
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	var _setParams = function(selfThis, g, items) {
		m_g = g;
		m_this = selfThis;
		m_items = items;
	};
	
	var _setTipCaller = function(){
		TTIP.setCallerData(m_items.tooltips[TIP_PREFIX + 'rolestate'], {self:m_this, caller:_onGetRoleStateTip}, {});
	};
	
	var _regEvents = function(){
		m_items.movepopu.setCaller({self:m_this, caller:_onClickMovePopu});
		m_items.changestate.setCaller({self:m_this, caller:_onClickChangeState});
		m_items.avoidfight.setCaller({self:m_this, caller:_onClickAvoidFight});
		m_items.savemodify.setCaller({self:m_this, caller:_onClickSaveModify});
		m_items.cancelsave.setCaller({self:m_this, caller:_onClickCancelSave});
		TQ.addEvent(m_items.iselfsign.getContainerObj(), 'keyup', _onSelfSignChange);
		
		m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
		m_g.regEvent(EVT.ROLEBASE, 1, m_this, _onRoleIntroductionChange);
		m_g.regEvent(EVT.ROLESPECSTATE_CHANGE, 0, m_this, _onRoleSpecStateChange);
	};
	
	var _setSelfSignMaxLen = function(){
		InputLimit.maxGBKBytes(m_items.iselfsign.getContainerObj(), JVALID.getSelfSignMaxLen());
	};
	
	var _update = function(){
		_udpateCityInfo();
		_udpateSelfSign();
		_updateRoleState();
		_updateRestBtn();		
	};
	
	var _udpateCityInfo = function(){
		var roleres = m_g.getImgr().getRoleRes();
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		TQ.setTextEx(m_items.statecity, cityres.name);
		TQ.setTextEx(m_items.position, roleres.pos.x+','+roleres.pos.y);
	};
	
	var _udpateSelfSign = function(){
		m_items.iselfsign.getContainerObj().value = 
			TQ.decodeMessageForText(m_g.getImgr().getRoleRes().introduction);
		_hideModifyBtns();
	};
	
	var _updateRoleState = function(){
		TQ.setTextEx(m_items.rolestate, m_roleStateHdr.getRoleStateText());
	};
	
	var _updateRestBtn = function(){
		var btnInfo = m_roleStateHdr.getOpBtnTextAndEnable();
		m_items.avoidfight.enable(btnInfo.enable);
		m_items.avoidfight.setText(btnInfo.text);
	};	
	
	var _onGetRoleStateTip = function(){
		return m_roleStateHdr.getToolTip();
	};
	
	var _onUpdate = function(){
		_updateRoleState();
	};
	
	var _onClickMovePopu = function(){
		UIM.openDlg('changecity');
	};
	
	var _onClickChangeState = function(){
		var role = m_g.getImgr().getRoleRes();
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.RAND_MOVECITY, RES_EFF.SETPOS_MOVECITY], 
			{id:role.id, name:role.name, type:RES_TRG.SELF_ROLE} );
	};
	
	var _onClickAvoidFight = function(){
		if ( _isResetState() ) {
			_cancelResetState();
		}
		else {
			_setResetState();
		}
	};
	
	var _isResetState = function() {
		var role = m_g.getImgr().getRoleRes();
		return role.state == ROLE_STATE.REST;
	};
	
	var _cancelResetState = function() {
		var _onCancelResetCallback = function(id){
			if ( id == MB_IDYES ){
				RoleStateSender.cancelState(m_g, RES_EFF.AVOIDFIGHT);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.roledlg.tips.cancelReset, MB_F_YESNO, {self:m_this, caller:_onCancelResetCallback});
	};
	
	var _setResetState = function() {
		var role = m_g.getImgr().getRoleRes();
		var dlg = UIM.getDlg('uselistitem');
		dlg.openDlg([RES_EFF.AVOIDFIGHT], 
			{id:role.id, name:role.name, type:RES_TRG.SELF_ROLE} );
	};
	
	var _onClickSaveModify = function(){
		RoleSender.sendSelfSign(m_g, _encodeSelfSign(m_items.iselfsign.getContainerObj().value));
	};
	
	var _onClickCancelSave = function(){
		_udpateSelfSign();
	};
	
	var _onSelfSignChange = function(){
		var isModify = _encodeSelfSign() != m_g.getImgr().getRoleRes().introduction;
		if ( isModify ) {
			_showModifyBtns();
		}
		else {
			_hideModifyBtns();
		}
	};
	
	var _onRolebaseChange = function(){
		_udpateCityInfo();
		_updateRoleState();
		_updateRestBtn();
	};
	
	var _onRoleIntroductionChange = function(){
		_udpateSelfSign();
	};
	
	var _onRoleSpecStateChange = function(){
		if ( !m_isShow ) return;
		_updateRoleState();
		_updateRestBtn();
	};

	var _showModifyBtns = function(){
		m_items.savemodify.show();
		m_items.cancelsave.show();
	};
	
	var _hideModifyBtns = function(){
		m_items.savemodify.hide();
		m_items.cancelsave.hide();
	};
	
	var _encodeSelfSign = function(){
		return TQ.encodeMsgByBytesLimit(m_items.iselfsign.getContainerObj().value, JVALID.getSelfSignMaxBytes());
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
	//ClearRolePPDlg-unittest-start
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
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
				title:rstr.clearroleppdlg.title,
				pos:{x:'center', y:35},
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onConfirmBtn}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onCancelBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.clearroleppdlg, m_items);
			m_items.buyitembtn.setCaller({self:m_this, caller:_onBuyItemBtn});
			m_items.iforce.setLimit(_getClearForceLimit);
			m_items.ipolity.setLimit(_getClearPolityLimit);
			m_items.iforce.setCaller({self:m_this,caller:_onClearForceChange});
			m_items.ipolity.setCaller({self:m_this,caller:_onClearPolityChange});
			m_dlg.hide();
			m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		}
	};
	
	var _initInfo = function(){
		m_items.iforce.setVal(0);
		m_items.ipolity.setVal(0);
		_updateInfo();
	};
	
	var _updateInfo = function(){
		TQ.setTextEx(m_items.lblclearforce, TQ.format(rstr.clearroleppdlg.lbl.clearforce, _getAttrValByAddPP(ATTR.FOR_B)));
		TQ.setTextEx(m_items.lblclearpolity, TQ.format(rstr.clearroleppdlg.lbl.clearpolity, _getAttrValByAddPP(ATTR.IN_B)));
	};
	
	var _onBuyItemBtn = function(){
		UIM.getDlg('buyitemlist').openDlg([FIXID.CLEARFORCARD, FIXID.CLEARINCARD]);
	};
	
	var _onConfirmBtn = function(){
		var forceval = m_items.iforce.getVal();
		var polityval = m_items.ipolity.getVal();
		if ( forceval <= 0 && polityval <= 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.clearroleppdlg.msg.noneedclear);
		}
		else {
			RoleSender.sendClearPP(m_g, forceval, polityval);
		}
		m_dlg.hide();
	};
	
	var _onCancelBtn = function(){
		m_dlg.hide();
	};
	
	var _getClearForceLimit = function(){
		return _getLimit(ATTR.FOR_B, FIXID.CLEARFORCARD);
	};
	
	var _getClearPolityLimit = function(){
		return _getLimit(ATTR.IN_B, FIXID.CLEARINCARD);
	};
	
	var _getLimit = function(attrid, itemResId){
		var addval = _getAttrValByAddPP(attrid);
		var cardnum = m_g.getImgr().getItemNumByResId(itemResId);	
		return {min:0, max:Math.min(addval, cardnum)};	
	};
	
	var _onClearForceChange = function(num){
		_setNeedItem(num, FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
	};
	
	var _onClearPolityChange = function(num){
		_setNeedItem(num, FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem');
	};
	
	var _onItemChanged = function(){
		if (!m_dlg.isShow()) return;
		_setNeedItem(m_items.iforce.getVal(), FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
		_setNeedItem(m_items.ipolity.getVal(), FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem');
	};	
	
	var _setNeedItem = function(num, itemResId, lbl, itemtag){
		var cardnum = m_g.getImgr().getItemNumByResId(itemResId);
		cardnum = TQ.formatColorStr(cardnum, (cardnum == 0) ? COLORS.NO_ENOUGH_ITEM : COLORS.ENOUGH_ITEM );
		TQ.setTextEx( m_items[itemtag], TQ.format(lbl, num, cardnum) );
	};

	var _getAttrValByAddPP = function(attrid){
		var imgr = m_g.getImgr();
		return imgr.getRoleAttrVal(attrid) - imgr.getRoleInitAttrVal(attrid);
	};
	
	this.init.apply(this, arguments);
	//ClearRolePPDlg-unittest-end
};

// 经验分配对话框
RoleAssignExpDlg = Class.extern(function(){
	//RoleAssignExpDlg-unittest-start
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_curselectheroidx=0;
	var m_curhero=null;
	
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
				btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickConfirmBtn}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickCancelBtn}}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.roleassignexpdlg, m_items);
			m_items.herolist.setCaller({self:m_this,caller:_onSelectHero});
			m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroAttr);
			m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
			m_items.iassignexp.setLimit(_getExpLimit);
			m_items.upgradeneed.setCaller({self:m_this,caller:_onSetUpgradeExp});
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
		m_curhero = m_g.getImgr().getHeroByIdx(sel);
		_updateHeroInfo();
	};
	
	var _onClickConfirmBtn = function() {
		var exp = m_items.iassignexp.getVal();
		m_items.iassignexp.setVal(0);
		if ( exp <= 0 || !m_curhero ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.roleassignexpdlg.msg.noexp);
			return;
		}
		
		RoleSender.sendAssignExp(m_g, m_curhero.id, exp);
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
		var need = imgr.getHeroAttrVal(m_curhero, ATTR.NXP) - imgr.getHeroAttrVal(m_curhero, ATTR.XP);
		need = need > 0 ? need : 0;
		if ( imgr.isMaxHeroLevel(m_curhero) ) {
			need = 0;
		}
		if ( imgr.isMaxHeroLevel(m_curhero) && !imgr.isMaxMaxHeroLevel(m_curhero) ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.roleassignexpdlg.msg.maxlevel);
		}
		m_items.iassignexp.setVal(Math.min(need, max));
	};
	
	var _getExpLimit = function() {
		var max = m_g.getImgr().getRoleAttrVal(ATTR.XPS);
		return {min:0, max:max};
	};
	
	var _updateHeroList = function() {
		m_items.herolist.deleteAllItem();
		m_items.herolist.setTitle(rstr.roleassignexpdlg.lbl.nohero);
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
			m_items.herolist.addItem({text:text});
		}
		m_items.herolist.setCurSel(m_curselectheroidx);
	};
	
	var _updateHeroInfo = function(){
		var imgr = m_g.getImgr();
		m_items.heroexpbar.setRange(imgr.getHeroAttrVal(m_curhero, ATTR.NXP));
		m_items.heroexpbar.setValue(0, imgr.getHeroAttrVal(m_curhero, ATTR.XP));
	};
	
	var _updateRoleExpsBar = function(){
		var imgr = m_g.getImgr();
		m_items.expsbar.setRange(imgr.getRoleAttrVal(ATTR.MXPS));
		m_items.expsbar.setValue(0,imgr.getRoleAttrVal(ATTR.XPS));
	};
	//RoleAssignExpDlg-unittest-end
});
