requireEx('./handler/tqRoleDlg.js', [
	{
		start:'//RoleDlg-unittest-start'
		,end:'//RoleDlg-unittest-end'
		,items:['m_dlg'
			,'m_items'
			,'m_info'
			,'m_achievement'
			,'_initDlg'
			,'_initInfo'
			,'_onDlgEvent'
			]
	}
	,{
		start:'//RoleDlgInfoPanel-unittest-start'
		,end:'//RoleDlgInfoPanel-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_isShow'
			,'m_items'
			,'_setParams'
			,'_regEvents'
			,'_setSelfSignMaxLen'
			,'_update'
			,'_onClickMovePopu'
			,'_onClickChangeState'
			,'_onClickAvoidFight'
			,'_onClickSaveModify'
			,'_onClickCancelSave'
			,'_onSelfSignChange'
			,'_onRolebaseChange'
			,'_onRoleIntroductionChange'
			,'_onRoleSpecStateChange'
			,'_udpateCityInfo'
			,'_udpateSelfSign'
			,'_showModifyBtns'
			,'_hideModifyBtns'
			,'_encodeSelfSign'
			,'_isResetState'
			,'_cancelResetState'
			,'_setResetState'
			,'_onCancelResetCallback'
			,'_updateRoleState'
			,'_updateRestBtn'
			,'_onUpdate'
			]
	}
	,{
		start:'//RoleAssignExpDlg-unittest-start'
		,end:'//RoleAssignExpDlg-unittest-end'
		,items:['m_items', 'm_curhero', '_onClickConfirmBtn','_getExpLimit']
	}
	,{
		start:'//ClearRolePPDlg-unittest-start'
		,end:'//ClearRolePPDlg-unittest-end'
		,items:['m_items'	
			,'m_dlg'
			,'_onBuyItemBtn'
			,'_onConfirmBtn'
			,'_getAttrValByAddPP'
			,'_getClearForceLimit'
			,'_getClearPolityLimit'
			,'_getLimit'
			,'_onClearForceChange'
			,'_onClearPolityChange'
			,'_setNeedItem'
			,'_onItemChanged'
			]
	}
]);

TestCaseRoleDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		HDRM.regHdr('clientcfg', ClientCfgHandler.snew(this.g));
		this.g.getImgr().getRoleRes().resid=101;
		this.g.getImgr().getRoleRes().itemres= ItemResUtil.findItemres(101);
		this.dlg = RoleDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.mm.mock(this.lc().m_dlg, 'show' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,show,_initInfo' );
	};
	
	this.test__initDlg = function(){
		this.dlg = RoleDlg.snew(this.g);
		this.mm.travelMock(RoleAchievement, 'snew');
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		assertEQ ( this.mm.params['snew'], [this.g, this.lc().m_items.achievement] );
		assertEQ ( this.lc().m_achievement instanceof RoleAchievement, true );
	};
	
	this.test__initInfo = function(){
		this.g.getImgr().getRoleRes().cityMaxLevel=10;
		this.g.getImgr().getRoleRes().actTower = 2;
		this.g.getImgr().getRoleRes().actTerrace = 3;
		
		this.mm.mock(this.lc().m_achievement, 'setRole');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['setRole'], [{cityMaxLevel:10, actTower:2, actTerrace:3, vip:0}] );
	};
});

TestCaseRoleDlgInfoPanel = TestCase.extern(function(){
	this.setUp =  function(){
		TestCaseHelper.setUp(this);
		HDRM.regHdr('clientcfg', ClientCfgHandler.snew(this.g));
		this.g.getImgr().getRoleRes().resid=101;
		this.g.getImgr().getRoleRes().itemres= ItemResUtil.findItemres(101);
		this.dlg = RoleDlg.snew(this.g);
		this.dlg.openDlg()
		this.panel = this.dlg.lc().m_info;
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var items = {name:'items'};
		this.mm.mock(this.lc(), '_setParams' );
		this.mm.mock(this.lc(), '_regEvents' );
		this.mm.mock(this.lc(), '_setSelfSignMaxLen' );
		this.mm.mock(this.lc(), '_update' );
		this.panel.init( this.g, items );
		assertEQ ( this.mm.walkLog, '_setParams,_regEvents,_setSelfSignMaxLen,_update' );
		assertEQ ( this.mm.params['_setParams'], [this.panel, this.g, items] );
	};
	
	this.test_show = function(){
		this.lc().m_isShow = false;
		this.mm.mock(this.g, 'regUpdater');
		this.mm.mock(this.lc(), '_update');
		this.panel.show();
		assertEQ ( this.mm.walkLog, 'regUpdater,_update' );
		assertEQ ( this.mm.params['regUpdater'], [this.panel, this.lc()._onUpdate, 1000] );
		assertEQ ( this.lc().m_isShow, true );
	};
	
	this.test_hide = function(){
		this.lc().m_isShow = true;
		this.mm.mock(this.g, 'unregUpdater');
		this.panel.hide();
		assertEQ ( this.mm.params['unregUpdater'], [this.panel, this.lc()._onUpdate] );
		assertEQ ( this.lc().m_isShow, false );
	};
	
	this.test__setParams = function(){
		var items = {name:'items'};
		this.lc()._setParams( this.panel, this.g, items );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_items, items );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.lc().m_items.movepopu, 'setCaller' );
		this.mm.mock(this.lc().m_items.changestate, 'setCaller' );
		this.mm.mock(this.lc().m_items.avoidfight, 'setCaller' );
		this.mm.mock(this.lc().m_items.savemodify, 'setCaller' );
		this.mm.mock(this.lc().m_items.cancelsave, 'setCaller' );
		this.mm.mock(TQ, 'addEvent');
		this.mm.mock(this.g, 'regEvent');
		
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,setCaller,addEvent,regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.panel, caller:this.lc()._onClickMovePopu}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.panel, caller:this.lc()._onClickChangeState}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.panel, caller:this.lc()._onClickAvoidFight}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.panel, caller:this.lc()._onClickSaveModify}] );
		assertEQ ( this.mm.params['setCaller.4'], [{self:this.panel, caller:this.lc()._onClickCancelSave}] );
		assertEQ ( this.mm.params['addEvent'], [this.lc().m_items.iselfsign.getContainerObj(),'keyup', this.lc()._onSelfSignChange ] );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.ROLEBASE, 0, this.panel, this.lc()._onRolebaseChange] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.ROLEBASE, 1, this.panel, this.lc()._onRoleIntroductionChange] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.ROLESPECSTATE_CHANGE, 0, this.panel, this.lc()._onRoleSpecStateChange] );
	};
	
	this.test__setSelfSignMaxLen = function(){
		this.mm.mock(InputLimit, 'maxGBKBytes')
		this.lc()._setSelfSignMaxLen();
		assertEQ ( this.mm.params['maxGBKBytes'], [this.lc().m_items.iselfsign.getContainerObj(), JVALID.getSelfSignMaxLen()] );
	};
	
	this.test__update = function(){
		this.mm.mock(this.lc(), '_udpateCityInfo');
		this.mm.mock(this.lc(), '_udpateSelfSign');
		this.mm.mock(this.lc(), '_updateRoleState');
		this.mm.mock(this.lc(), '_updateRestBtn');
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '_udpateCityInfo,_udpateSelfSign,_updateRoleState,_updateRestBtn' );
	};
	
	this.test__udpateCityInfo = function(){
		this.g.getImgr().getRoleRes().pos = {x:1, y:2};
		this.g.getImgr().getRoleRes().cityid = 9900001;
		this.lc()._udpateCityInfo();
		assertEQ ( TQ.getTextEx(this.lc().m_items.statecity), '魏国' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.position), '1,2' );
	};
	
	this.test__udpateSelfSign = function(){
		this.g.getImgr().getRoleRes().introduction = 'my is good man';
		this.mm.mock(TQ, 'decodeMessageForText', ['decode text']);
		this.mm.mock(this.lc(), '_hideModifyBtns');
		this.lc()._udpateSelfSign();
		assertEQ ( this.mm.walkLog, 'decodeMessageForText,_hideModifyBtns' );
		assertEQ ( this.mm.params['decodeMessageForText'], ['my is good man']);
		assertEQ ( this.lc().m_items.iselfsign.getContainerObj().value, 'decode text' );
	};
	
	this.test__updateRoleState = function(){
		this.g.getImgr().getRoleRes().state = 1;
		this.lc()._updateRoleState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.rolestate), rstr.comm.rolestate[1] );
		
		this.g.getImgr().getRoleRes().state = 0;
		this.lc()._updateRoleState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.rolestate), rstr.comm.rolestate[0] );
		
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHTCD, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRoleState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.rolestate), TQ.format(rstr.comm.cooldown, TQ.formatTime(0,10)) );
	};
	
	this.test_showAvoidFightState = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHT, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRoleState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.rolestate), TQ.format(rstr.roledlg.lbl.avoidfight, TQ.formatTime(0,10)) );
	};
	
	this.test_showYoungState = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.YOUNG_STATE, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRoleState();
		assertEQ ( TQ.getTextEx(this.lc().m_items.rolestate), TQ.format(rstr.roledlg.lbl.youngstate, TQ.formatTime(0,10)) );
	};
	
	this.test_getRoleStateTipWhenFreeState = function(){
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		var tip = TTIP.getTipById(this.lc().m_items.tooltips['$rolestate']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.roleFreeState );
	};
	
	this.test_getRoleStateTipWhenAvoidFightState = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHT, stoptime:this.g.getSvrTimeS()+10});
		var tip = TTIP.getTipById(this.lc().m_items.tooltips['$rolestate']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.roleAvoidFightState );
	};
	
	this.test_getRoleStateTipWhenAvoidFightCDState = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHTCD, stoptime:this.g.getSvrTimeS()+10});
		var tip = TTIP.getTipById(this.lc().m_items.tooltips['$rolestate']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.roleAvoidFightCDState );
	};
	
	this.test_getRoleStateTipWhenYoungState = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.YOUNG_STATE, stoptime:this.g.getSvrTimeS()+10});
		var tip = TTIP.getTipById(this.lc().m_items.tooltips['$rolestate']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.roleYoungState );
	};
	
	this.test__updateResetBtn = function(){
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHT, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRestBtn();
		assertEQ ( this.lc().m_items.avoidfight.isEnable(), true );
		assertEQ ( this.lc().m_items.avoidfight.getText(), rstr.roledlg.btns.stopavoidfight );
		
		this.g.getImgr().getRoleStates().push({id:RES_EFF.AVOIDFIGHTCD, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRestBtn();
		assertEQ ( this.lc().m_items.avoidfight.isEnable(), false );
		assertEQ ( this.lc().m_items.avoidfight.getText(), rstr.roledlg.btns.avoidfight );
		
		this.g.getImgr().getRoleStates().length = 0;
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.lc()._updateRestBtn();
		assertEQ ( this.lc().m_items.avoidfight.isEnable(), true );
		assertEQ ( this.lc().m_items.avoidfight.getText(), rstr.roledlg.btns.avoidfight );
		
		this.g.getImgr().getRoleStates().push({id:RES_EFF.YOUNG_STATE, stoptime:this.g.getSvrTimeS()+10});
		this.lc()._updateRestBtn();
		assertEQ ( this.lc().m_items.avoidfight.isEnable(), false );
		assertEQ ( this.lc().m_items.avoidfight.getText(), rstr.roledlg.btns.avoidfight );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_updateRoleState' );
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_updateRoleState' );
	};
	
	this.test__onClickMovePopu = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onClickMovePopu();
		assertEQ ( this.mm.params['openDlg'], ['changecity'] );
	};
	
	this.test__onClickChangeState = function(){
		this.g.getImgr().getRoleRes().id = 1;
		this.g.getImgr().getRoleRes().name = 'my';
		this.mm.mock(UIM.getDlg('uselistitem'), 'openDlg');
		this.lc()._onClickChangeState();
		assertEQ ( this.mm.params['openDlg'], [[RES_EFF.RAND_MOVECITY, RES_EFF.SETPOS_MOVECITY], {id:1, name:'my', type:RES_TRG.SELF_ROLE}] );
	};
	
	this.test__onClickAvoidFight = function(){
		var r_isResetState = [true];
		this.mm.mock(this.lc(), '_isResetState', r_isResetState);
		this.mm.mock(this.lc(), '_cancelResetState');
		this.mm.mock(this.lc(), '_setResetState');
		
		this.lc()._onClickAvoidFight();
		assertEQ ( this.mm.walkLog, '_isResetState,_cancelResetState' );
		
		this.mm.clear();
		r_isResetState[0] = false;
		this.lc()._onClickAvoidFight();
		assertEQ ( this.mm.walkLog, '_isResetState,_setResetState' );
	};
	
	this.test__isResetState = function(){
		this.g.getImgr().getRoleRes().state = ROLE_STATE.REST;
		assertEQ ( this.lc()._isResetState(), true );
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		assertEQ ( this.lc()._isResetState(), false );
	};
	
	this.test__cancelResetState = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.lc()._cancelResetState();
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.roledlg.tips.cancelReset, MB_F_YESNO, {self:this.panel, caller:this.lc()._onCancelResetCallback}]);
	};
	
	this.test__cancelResetState__onCancelResetCallback = function(){
		this.lc()._cancelResetState(); // create _onCancelResetCallback
		this.mm.mock(RoleStateSender, 'cancelState');
		this.lc()._onCancelResetCallback(MB_IDNO);
		assertEQ ( this.mm.walkLog, '');
		this.lc()._onCancelResetCallback(MB_IDYES);
		assertEQ ( this.mm.params['cancelState'], [this.g, RES_EFF.AVOIDFIGHT]);
	};
	
	this.test__setResetState = function(){
		this.g.getImgr().getRoleRes().id = 1;
		this.g.getImgr().getRoleRes().name = 'my';
		this.mm.mock(UIM.getDlg('uselistitem'), 'openDlg');
		this.lc()._setResetState();
		assertEQ ( this.mm.params['openDlg'], [[RES_EFF.AVOIDFIGHT], {id:1, name:'my', type:RES_TRG.SELF_ROLE}] );
	};
	
	this.test__onClickSaveModify = function(){
		this.mm.mock(RoleSender, 'sendSelfSign');
		this.lc().m_items.iselfsign.getContainerObj().value='I am good "man"';
		this.lc()._onClickSaveModify();
		assertEQ ( this.mm.params['sendSelfSign'], [this.g, 'I am good &quot;man&quot;'] );
	};
	
	this.test__onClickCancelSave = function(){
		this.mm.mock(this.lc(), '_udpateSelfSign');
		this.lc()._onClickCancelSave();
		assertEQ ( this.mm.walkLog, '_udpateSelfSign' );
	};
	
	this.test__onSelfSignChange = function(){
		this.g.getImgr().getRoleRes().introduction = 'i am good man';
		this.mm.mock(this.lc(), '_encodeSelfSign', ['i am good man']);
		this.mm.mock(this.lc(), '_showModifyBtns');
		this.mm.mock(this.lc(), '_hideModifyBtns');
		this.lc()._onSelfSignChange();
		assertEQ ( this.mm.walkLog, '_encodeSelfSign,_hideModifyBtns' );
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().introduction = 'i am bad man';
		this.lc()._onSelfSignChange();
		assertEQ ( this.mm.walkLog, '_encodeSelfSign,_showModifyBtns' );
	};
	
	this.test__onRolebaseChange = function(){
		this.mm.mock(this.lc(), '_udpateCityInfo');
		this.mm.mock(this.lc(), '_updateRoleState');
		this.mm.mock(this.lc(), '_updateRestBtn');
		this.lc()._onRolebaseChange();
		assertEQ ( this.mm.walkLog, '_udpateCityInfo,_updateRoleState,_updateRestBtn' );
	};
	
	this.test__onRoleIntroductionChange = function(){
		this.mm.mock(this.lc(), '_udpateSelfSign');
		this.lc()._onRoleIntroductionChange();
		assertEQ ( this.mm.walkLog, '_udpateSelfSign' );
	};
	
	this.test__onRoleSpecStateChange = function(){
		this.lc().m_isShow = false;
		this.mm.mock(this.lc(), '_updateRoleState');
		this.mm.mock(this.lc(), '_updateRestBtn');
		this.lc()._onRoleSpecStateChange();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_isShow = true;
		this.mm.mock(this.lc(), '_updateRoleState');
		this.mm.mock(this.lc(), '_updateRestBtn');
		this.lc()._onRoleSpecStateChange();
		assertEQ ( this.mm.walkLog, '_updateRoleState,_updateRestBtn' );
	};
	
	this.test__showModifyBtns = function(){
		this.mm.mock(this.lc().m_items.savemodify, 'show');
		this.mm.mock(this.lc().m_items.cancelsave, 'show');
		this.lc()._showModifyBtns();
		assertEQ ( this.mm.walkLog, 'show,show');
	};
	
	this.test__hideModifyBtns = function(){
		this.mm.mock(this.lc().m_items.savemodify, 'hide');
		this.mm.mock(this.lc().m_items.cancelsave, 'hide');
		this.lc()._hideModifyBtns();
		assertEQ ( this.mm.walkLog, 'hide,hide');
	};
	
	this.test__encodeSelfSign = function(){
		this.lc().m_items.iselfsign.getContainerObj().value = 'i am good "man"';
		
		this.mm.mock(TQ, 'encodeMessage', ['i am good &quot;man&quot;']);
		this.mm.mock(UnicodeStr, 'byteSubStr', ['0123456789']);
		this.mm.mock(EscapeString, 'subStr', ['i am good &quot;']);
		
		assertEQ ( this.lc()._encodeSelfSign(), 'i am good &quot;' );
		assertEQ ( this.mm.walkLog, 'encodeMessage,byteSubStr,subStr' );
		assertEQ ( this.mm.params['encodeMessage'], [ 'i am good "man"'] );
		assertEQ ( this.mm.params['byteSubStr'], ['i am good &quot;man&quot;', JVALID.getSelfSignMaxBytes()] );
		assertEQ ( this.mm.params['subStr'], ['i am good &quot;man&quot;', '0123456789'.length] );
	};
});

TestCasePPointAssign = TestCase.extern(function(){
	this.setUp = function(){
		var self = this;
		this.g = g_app;
		this.assign = PPointAssign.snew(this.g);
		this.leftPPDom = MockDomEx.snew();
		this.assign.setLeftPPDom( this.leftPPDom );
		
		this.attr1Dom = MockDomEx.snew();
		this.attr2Dom = MockDomEx.snew();
		this.assign.append({drtpp:2, attr_b:ATTR.FOR_B, attr_a:ATTR.FOR_A, dom:this.attr1Dom });
		this.assign.append({drtpp:1, attr_b:ATTR.BR_B, attr_a:ATTR.BR_A, dom:this.attr2Dom });
		
		var getAttrCaller = function(attr) {
			if ( attr == ATTR.FOR_B ) {
				return 1;
			}
			else if ( attr == ATTR.FOR_A ) {
				return 2;
			}
			else if ( attr == ATTR.BR_B ) {
				return 3;
			}
			else if ( attr == ATTR.BR_A ) {
				return 4;
			}
		};
		this.assign.setAttrCaller(getAttrCaller);
		
		this.btnStateSets = '';
		var btnStateCaller = function(btnName, idx, enable) {
			if ( self.btnStateSets != '' ) {
				self.btnStateSets += ',';
			}
			self.btnStateSets += btnName + ':' + idx + ':' + (enable ? 'true' : 'false');
		};
		this.assign.setBtnStateCaller(btnStateCaller);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_checkButtons = function(){
		this.btnStateSets = '';
		this.assign._checkButtons();
		assert ( this.btnStateSets == 'add:0:false,sub:0:false,add:1:false,sub:1:false,confirm:0:false' );
	};
	
	this.test_setVal = function(){
		this.assign._setVal();
		
		assert ( TQ.getTextEx(this.leftPPDom) == 0 );
		assert ( TQ.getTextEx(this.attr1Dom) == '1(<font color="' + COLORS.APPEND_ATTR + '">+2</font>)' );
		assert ( TQ.getTextEx(this.attr2Dom) == '3(<font color="' + COLORS.APPEND_ATTR + '">+4</font>)' );
	};
	
	this.test_refresh = function(){
		var methodMock = MethodMock.snew();
		methodMock.mock(this.assign, '_setVal', function(){
			methodMock.walkLog = '_setVal';
			});
		methodMock.mock(this.assign, '_checkButtons', function(){
			methodMock.walkLog += '_checkButtons';
			});
			
		this.assign._refresh();
		methodMock.restore();
		
		assert ( methodMock.walkLog == '_setVal_checkButtons' );
	};
	
	this.test_add = function(){
		this.btnStateSets = '';
		this.assign.setLeftPP(3);
		assert ( this.btnStateSets == 'add:0:true,sub:0:false,add:1:true,sub:1:false,confirm:0:false' );
		
		this.btnStateSets = '';
		this.assign.add(0);
		assert ( this.assign.getLeftPP() == 3 - 2 );
		assert ( this.btnStateSets == 'add:0:false,sub:0:true,add:1:true,sub:1:false,confirm:0:true' );
		
		this.assign.add(0);
		assert ( this.assign.getLeftPP() == 3 - 2 );
		
		this.btnStateSets = '';
		this.assign.add(1);
		assert ( this.assign.getLeftPP() == 3 - 2 - 1 );
		assert ( this.btnStateSets == 'add:0:false,sub:0:true,add:1:false,sub:1:true,confirm:0:true' );
	};
	
	this.test_sub = function(){
		this.btnStateSets = '';
		this.assign.setLeftPP(3);
		
		this.assign.add(0);
		assert ( this.assign.getLeftPP() == 3 - 2 );
		
		this.btnStateSets = '';
		this.assign.sub(0);
		assert ( this.assign.getLeftPP() == 3 );
		assert ( this.btnStateSets == 'add:0:true,sub:0:false,add:1:true,sub:1:false,confirm:0:false' );
		
		this.assign.sub(0);
		assert ( this.assign.getLeftPP() == 3 );
		
		//---
		this.assign.setLeftPP(3);
		this.assign.add(1);
		this.assign.add(1);
		this.assign.add(1);
		
		this.btnStateSets = '';
		this.assign.sub(1);
		assert ( this.assign.getLeftPP() == 1 );
		assert ( this.btnStateSets == 'add:0:false,sub:0:false,add:1:true,sub:1:true,confirm:0:true' );
	};
	
	this.test_clear = function(){
		this.assign.leftpps = 1;
		var methodMock = MethodMock.snew();
		methodMock.mock(this.assign, '_clearOriginalAttrs', function(){
			methodMock.walkLog = '_clearOriginalAttrs'; });
		methodMock.mock(this.assign, '_clearCurPPS', function(){
			methodMock.walkLog += ',_clearCurPPS'; });
		methodMock.mock(this.assign, '_refresh', function(){
			methodMock.walkLog += ',_refresh'; });
		this.assign.clear();
		methodMock.restore();
		
		assert ( methodMock.walkLog == '_clearOriginalAttrs,_clearCurPPS,_refresh' );
		assert ( this.assign.getLeftPP() == 0 );
	};
	
	this.test_setLeftPP = function(){
		var methodMock = MethodMock.snew();
		methodMock.mock(this.assign, '_saveOriginalAttrs', function(){
			methodMock.walkLog = '_saveOriginalAttrs'; });
		methodMock.mock(this.assign, '_clearCurPPS', function(){
			methodMock.walkLog += ',_clearCurPPS'; });
		methodMock.mock(this.assign, '_refresh', function(){
			methodMock.walkLog += ',_refresh'; });
		this.assign.setLeftPP(10);
		methodMock.restore();
		
		assert ( methodMock.walkLog == '_saveOriginalAttrs,_clearCurPPS,_refresh' );
		assert ( this.assign.getLeftPP() == 10 );
	};
	
	this.test_getAssignStr = function(){
		this.assign.setLeftPP(10);
		assert ( this.assign.getAssignStr() == ',p0=0,p1=0' );
		
		this.assign.add(0);
		this.assign.add(0);
		this.assign.sub(0);
		this.assign.add(1);
		
		assert ( this.assign.getAssignStr() == ',p0=2,p1=1' );
		assert ( this.assign.getLeftPP() == 10 - 2 - 2 + 2 - 1 );
		assert ( TQ.getTextEx(this.leftPPDom) == 7 );

		assert ( TQ.getTextEx(this.attr1Dom) == '2(<font color="' + COLORS.APPEND_ATTR + '">+2</font>)' );
		assert ( TQ.getTextEx(this.attr2Dom) == '4(<font color="' + COLORS.APPEND_ATTR + '">+4</font>)' );
		
		this.assign.setLeftPP(10);
		assert ( this.assign.getAssignStr() == ',p0=0,p1=0' );
		assert ( this.assign.getLeftPP() == 10 );
		assert ( TQ.getTextEx(this.leftPPDom) == 10 );
		assert ( TQ.getTextEx(this.attr1Dom) == '1(<font color="' + COLORS.APPEND_ATTR + '">+2</font>)' );
		assert ( TQ.getTextEx(this.attr2Dom) == '3(<font color="' + COLORS.APPEND_ATTR + '">+4</font>)' );
	};
	
	this.test_saveOriginalAttrs = function(){
		this.assign.setLeftPP(10);
		this.assign._saveOriginalAttrs();
		
		assert ( this.assign.originalLeftPPS == 10 );
		assert ( this.assign.list[0].originalAttr == 3 );
		assert ( this.assign.list[1].originalAttr == 7 );
	};
	
	this.test_clearCurPPS = function(){
		this.assign.list[0].pps = 1;
		this.assign.list[1].pps = 2;
		
		this.assign._clearCurPPS();
		
		assert ( this.assign.list[0].pps == 0 );
		assert ( this.assign.list[1].pps == 0 );
	};
	
	this.test_clearOriginalAttrs = function(){
		this.assign.originalLeftPPS = 10;
		this.assign.list[0].originalAttr = 1;
		this.assign.list[1].originalAttr = 2;
		
		this.assign._clearOriginalAttrs();
		
		assert ( this.assign.originalLeftPPS == 0 );
		assert ( this.assign.list[0].originalAttr == 0 );
		assert ( this.assign.list[1].originalAttr == 0 );
	};
	
	this.test_isChanged = function(){
		this.assign.setLeftPP(10);
		this.assign.add(1);
		
		assert ( this.assign.isChanged(10) == false );
		assert ( this.assign.isChanged(9) == true );
		
		var getAttrCaller = function(attr) {
			if ( attr == ATTR.FOR_B ) {
				return 1;
			}
			else if ( attr == ATTR.FOR_A ) {
				return 2;
			}
			else if ( attr == ATTR.BR_B ) {
				return 6;
			}
			else if ( attr == ATTR.BR_A ) {
				return 7;
			}
		};
		this.assign.setAttrCaller(getAttrCaller);
		assert ( this.assign.isChanged(10) == true );
	};
});

TestCaseRoleAssignExpDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RoleAssignExpDlg.snew(this.g);
		this.dlg.openDlg(0)
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_onClickConfirmBtn = function(){
		this.g.getImgr().getRoleAttrs()[ATTR.XPS] = 10;
		
		this.mm.mock(this.g.getGUI(), 'sysMsgTips' );
		this.mm.mock(RoleSender, 'sendAssignExp' );

		this.dlg.lc().m_items.iassignexp.setVal(0);
		this.dlg.lc()._onClickConfirmBtn();
		assert ( this.mm.walkLog == 'sysMsgTips' );
		assertListEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.roleassignexpdlg.msg.noexp]);
		assert ( this.dlg.lc().m_items.iassignexp.getVal() == 0 );
		
		this.mm.clear();
		this.dlg.lc().m_items.iassignexp.setVal(10);
		this.dlg.lc().m_curhero = null;
		this.dlg.lc()._onClickConfirmBtn();
		assert ( this.mm.walkLog == 'sysMsgTips' );
		assert ( this.dlg.lc().m_items.iassignexp.getVal() == 0 );
		
		this.mm.clear();
		this.dlg.lc().m_items.iassignexp.setVal(10);
		this.dlg.lc().m_curhero = {id:1};
		this.dlg.lc()._onClickConfirmBtn();
		assert ( this.mm.walkLog == 'sendAssignExp' );
		assertListEQ ( this.mm.params['sendAssignExp'], [this.g, 1, 10]);
		assert ( this.dlg.lc().m_items.iassignexp.getVal() == 0 );
	};
});

TestCaseClearRolePPDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = new ClearRolePPDlg(this.g);
		this.dlg.openDlg()
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__onBuyItemBtn = function(){
		this.mm.mock(UIM.getDlg('buyitemlist'), 'openDlg');
		this.lc()._onBuyItemBtn();
		assertEQ ( this.mm.params['openDlg'], [[FIXID.CLEARFORCARD,FIXID.CLEARINCARD]] );
	};
	
	this.test__onConfirmBtn = function(){
		var r_iforce = [0];
		var r_ipolity = [-1];
		this.mm.mock(this.lc().m_items.iforce, 'getVal', r_iforce);
		this.mm.mock(this.lc().m_items.ipolity, 'getVal', r_ipolity);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(RoleSender, 'sendClearPP');
		this.mm.mock(this.lc().m_dlg, 'hide');
		
		this.lc()._onConfirmBtn();
		assertEQ ( this.mm.walkLog, 'getVal,getVal,sysMsgTips,hide' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.clearroleppdlg.msg.noneedclear] );
		
		this.mm.clear();
		r_iforce[0] = -1;
		r_ipolity[0] = 0;
		this.lc()._onConfirmBtn();
		assertEQ ( this.mm.walkLog, 'getVal,getVal,sysMsgTips,hide' );
		
		this.mm.clear();
		r_iforce[0] = 0;
		r_ipolity[0] = 0;
		this.lc()._onConfirmBtn();
		assertEQ ( this.mm.walkLog, 'getVal,getVal,sysMsgTips,hide' );
		
		this.mm.clear();
		r_iforce[0] = 0;
		r_ipolity[0] = 1;
		this.lc()._onConfirmBtn();
		assertEQ ( this.mm.walkLog, 'getVal,getVal,sendClearPP,hide' );
		assertEQ ( this.mm.params['sendClearPP'], [this.g, 0, 1] );
	};
	
	this.test__getClearForceLimit = function(){
		this.mm.mock( this.lc(), '_getLimit', [{min:0, max:1}]);
		assertEQ ( this.lc()._getClearForceLimit(), {min:0, max:1});
		assertEQ ( this.mm.params['_getLimit'], [ATTR.FOR_B, FIXID.CLEARFORCARD] );
	};
	
	this.test__getClearPolityLimit = function(){
		this.mm.mock( this.lc(), '_getLimit', [{min:0, max:1}]);
		assertEQ ( this.lc()._getClearPolityLimit(), {min:0, max:1});
		assertEQ ( this.mm.params['_getLimit'], [ATTR.IN_B, FIXID.CLEARINCARD] );
	};
	
	this.test__getLimit = function(){
		var r_getAttrValByAddPP = [2];
		this.mm.mock(this.lc(), '_getAttrValByAddPP', r_getAttrValByAddPP);
		this.g.getImgr().addItem({id:1,resid:FIXID.CLEARFORCARD,number:3});
		assertEQ ( this.lc()._getLimit(ATTR.FOR_B, FIXID.CLEARFORCARD), {min:0, max:2} );
		
		r_getAttrValByAddPP[0] = 4;
		assertEQ ( this.lc()._getLimit(ATTR.FOR_B, FIXID.CLEARFORCARD), {min:0, max:3} );
	};
	
	this.test__onClearForceChange = function(){
		this.mm.mock( this.lc(), '_setNeedItem');
		var num = 1;
		this.lc()._onClearForceChange(num);
		assertEQ ( this.mm.params['_setNeedItem'], [num, FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem'] );
	};
	
	this.test__onClearPolityChange = function(){
		this.mm.mock( this.lc(), '_setNeedItem');
		var num = 1;
		this.lc()._onClearPolityChange(num);
		assertEQ ( this.mm.params['_setNeedItem'], [num, FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem'] );
	};
	
	this.test__onItemChanged = function(){
		this.lc().m_dlg.hide();
		this.mm.mock(this.lc(), '_setNeedItem');
		this.lc()._onItemChanged();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg.show();
		this.lc().m_items.iforce.setVal(1);
		this.lc().m_items.ipolity.setVal(0);
		this.mm.clear();
		this.lc()._onItemChanged();
		assertEQ ( this.mm.walkLog, '_setNeedItem,_setNeedItem' );
		assertEQ ( this.mm.params['_setNeedItem.0'], [this.lc().m_items.iforce.getVal(), FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem'] );
		assertEQ ( this.mm.params['_setNeedItem.1'], [this.lc().m_items.ipolity.getVal(), FIXID.CLEARINCARD, rstr.clearroleppdlg.lbl.needpolityitem, 'needpolityitem'] );
	};	
	
	this.test__setNeedItem = function(){
		assertEQ ( this.g.getImgr().getItemNumByResId(FIXID.CLEARFORCARD), 0 );
		var num = 1;
		this.lc()._setNeedItem(num, FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
		var s = TQ.format(rstr.clearroleppdlg.lbl.needforceitem, num, TQ.formatColorStr(0, COLORS.NO_ENOUGH_ITEM) ) 
		assertEQ ( TQ.getTextEx(this.lc().m_items.needforceitem), s );
		
		this.g.getImgr().addItem({id:1,resid:FIXID.CLEARFORCARD,number:1});
		this.lc()._setNeedItem(num, FIXID.CLEARFORCARD, rstr.clearroleppdlg.lbl.needforceitem, 'needforceitem');
		var s = TQ.format(rstr.clearroleppdlg.lbl.needforceitem, num, TQ.formatColorStr(1, COLORS.ENOUGH_ITEM) ) 
		assertEQ ( TQ.getTextEx(this.lc().m_items.needforceitem), s );	
	};
});

TestCaseChangeCityDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ChangeCityDlg.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_youngStateNotNeedGold = function(){
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().needgold), TQ.formatColorStr(rstr.changecitydlg.lbl.newplayer, COLORS.ENOUGH_GOLD) );
	};
	
	this.test_freeStateHasEnoughGold = function(){
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.g.getImgr().setGold(100);
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().needgold), TQ.formatColorStr(100, COLORS.ENOUGH_GOLD) );
	};
	
	this.test_freeStateNoEnoughGold = function(){
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.g.getImgr().setGold(90);
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().needgold), TQ.formatColorStr(100, COLORS.NOTENOUGH_GOLD) );
	};
});



tqRoleDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseRoleDlg, 'TestCaseRoleDlg');
	suite.addTestCase(TestCaseRoleDlgInfoPanel, 'TestCaseRoleDlgInfoPanel');
	suite.addTestCase(TestCasePPointAssign, 'TestCasePPointAssign');
	suite.addTestCase(TestCaseRoleAssignExpDlg, 'TestCaseRoleAssignExpDlg');
	suite.addTestCase(TestCaseClearRolePPDlg, 'TestCaseClearRolePPDlg');
	suite.addTestCase(TestCaseChangeCityDlg, 'TestCaseChangeCityDlg');
};