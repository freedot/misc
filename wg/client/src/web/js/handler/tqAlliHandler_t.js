requireEx('./handler/tqAlliHandler.js', [
	{
		start:'//AlliCreateDlg-unittest-start'
		,end:'//AlliCreateDlg-unittest-end'
		,items:[
			'm_g'
			,'C_BTN_DELAY_MS'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'_onSvrPkg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_initInputs'
			,'_setBtnsDelayType'
			,'_onClickAlliListBtn'
			,'_onSelectAlliance'
			,'_onClickApplyBtn'
			,'_onClickCreateBtn'
			,'_onClickRandBtn'
			,'_handleCreateResult'
			,'_handleApplyInfo'
			,'_handleInviteInfo'
			,'_hideDlg'
			,'_getCtrl'
			,'_getRandHZ'
			,'_onClickAgreeInvite'
			,'_onClickIgnoreInvite'
			,'m_invitelist'
			,'_isShow'
			,'_onLoginOk'
			,'_setInviteListItems'			
		]
	}
	,{
		start:'//AlliListDlg-unittest-start'
		,end:'//AlliListDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_cityResId'
			,'m_templ'
			,'_init'
			,'_initParams'
			,'_initDlg'
			,'_createDlg'
			,'_createDlgByTempl'
			,'_setCallers'
			,'_showDlg'
			,'_initInfo'
			,'_onClickJoinBtn'
		]
	}
	,{
		start:'//AlliListDlgTempl-unittest-start'
		,end:'//AlliListDlgTempl-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_cityResId'
			,'m_flag'
			,'m_alliancesRes'
			,'m_pageBar'
			,'_init'
			,'_createItems'
			,'_createPageBar'
			,'_setAllianceListItems'
			,'_setAllianceListItemBtnsVisible'
			,'_setAllianceListItemBtnsCaller'
			,'_setCurSelectItem'
			,'_onClickSeeBtn'
			,'_onClickJoinBtn'
		]
	}
	,{
		start:'//AlliDetailDlg-unittest-start'
		,end:'//AlliDetailDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_detail'
			,'_onSvrPkg'
			,'_openDlg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onClickApplyBtn'
			,'_onClickMemBtn'
		]
	}
	,{
		start:'//SelfAlliMemListDlg-unittest-start'
		,end:'//SelfAlliMemListDlg-unittest-end'
		,items:['m_g'
			,'m_dlg'
			,'m_this'
			,'m_items'
			,'m_selfmems'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_onSvrPkg'
			,'_createDlg'
			,'_setCallers'
			,'_onPageNavigate'
			,'_onClickSeeBtn'
			,'_onMemberChange'
		]
	}
	,{
		start:'//OtherAlliMemListDlg-unittest-start'
		,end:'//OtherAlliMemListDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_mems'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_showDlg'
			,'_initInfo'		
			,'_onSvrPkg'
			,'_onPageNavigate'
			,'_onClickSeeBtn'
			,'_onClickDeclareBtn'
		]
	}
	,{
		start:'//AlliMainDlg-unittest-start'
		,end:'//AlliMainDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_basePanel'
			,'m_lawLightPanel'
			,'m_auctionPanel'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_initPanels'
			,'_showDlg'
			,'_initInfo'
			,'_onSvrPkg'
			,'_onDlgEvent'
		]
	}
	,{
		start:'//AlliMainBasePanel-unittest-start'
		,end:'//AlliMainBasePanel-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'_onUpdate'
			,'_onClickUpgrade'
			,'_onClickTransfer'
			,'_onClickMemList'
			,'_onClickSubscribe'
			,'_onClickModifyQQ'
			,'_onClickInvite'
			,'_onClickAgreeApply'
			,'_onClickEvent'
			,'_onClickMerge'
			,'_onClickDismiss'
			,'_onClickQuit'
			,'_onClickModifyIntroduce'
			,'_onClickModifyBulletin'			
			,'_onGetFomartLeftTime'
			,'_onQQGroupCallBack'
			,'_onInviteCallBack'
			,'_onModifyIntroduceCallBack'
			,'_onModifyBulletinCallBack'
		]
	}
	,{
		start:'//AlliMainLawLightPanel-unittest-start'
		,end:'//AlliMainLawLightPanel-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'_onClickGetResBtn'
			,'_onClickUpgradeBtn'
			,'_onClickBestowBtn'
			,'_onClickFeedBtn'
			,'_onClickFeedAllBtn'
			,'_onGetUpgradeBtnTip'
		]
	}
	,{
		start:'//AlliTransferDlg-unittest-start'
		,end:'//AlliTransferDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_showDlg'
			,'_initInfo'
			,'_onClickConfirmBtn'
			,'_onClickCancelBtn'
			,'_onSvrPkg'
		]
	}	
	,{
		start:'//AlliUnTransferDlg-unittest-start'
		,end:'//AlliUnTransferDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'		
			,'_showDlg'
			,'_initInfo'
			,'_onStopTransferBtn'
		]
	}
	,{
		start:'//AlliSubscribeDlg-unittest-start'
		,end:'//AlliSubscribeDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_initContributesOperateList'
			,'_initPreviewTabListTitleText'
			,'_onGetResNumberLimit'
			,'_onClickContributeBtn'
			,'_onClickBuyBtn'
			,'_onPageNavigate'
			,'_onCityResChange'
			,'_onSvrPkg'
			,'_onSelfAllMemChange'
			,'_onItemsChange'
		]
	}
	,{
		start:'//AlliMemInfoDlg-unittest-start'
		,end:'//AlliMemInfoDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onClickAppoint'
			,'_onClickFire'
			,'_onClickChat'
			,'_onClickMail'
			,'_onClickFriend'
		]
	}
	,{
		start:'//AlliApplyListDlg-unittest-start'
		,end:'//AlliApplyListDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'m_applys'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_onSvrPkg'
			,'_updateApplyList'
			,'_onClickAgreeBtn'
			,'_onClickRefuseBtn'
		]
	}
	,{
		start:'//AlliEventsDlg-unittest-start'
		,end:'//AlliEventsDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onSvrPkg'
			,'_onPageNavigate'
		]
	}
	,{
		start:'//AlliMergeDlg-unittest-start'
		,end:'//AlliMergeDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onSvrPkg'
			,'_onClickApplyMerge'
			,'_onClickAgreeBtn'
			,'_onClickRefuseBtn'
			,'_onApplyMergeCallBack'
		]
	}
]);
	
TestCaseAlliDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliDlg.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(UIM.getDlg('allicreate'), 'openDlg:openAlliCreateDlg');
		this.mm.mock(UIM.getDlg('allimain'), 'openDlg:openAllimainDlg');
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopAllianceBlinking');
		
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.nobuild] );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.ALLIINBUILD, level:1}] });
		this.mm.clear();
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, 'openAlliCreateDlg,stopAllianceBlinking' );

		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.mm.clear();
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, 'openAllimainDlg,stopAllianceBlinking' );
	};
	
	this.test_openSubscribeDlg = function(){
		this.mm.mock(UIM.getDlg('allisubscribe'), 'openDlg');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		
		this.dlg.openSubscribeDlg();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.nobuild] );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.ALLIINBUILD, level:1}] });
		this.mm.clear();
		this.dlg.openSubscribeDlg();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.noInAlliance] );

		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.mm.clear();
		this.dlg.openSubscribeDlg();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test_openGiftDlg = function(){
		this.mm.mock(UIM.getDlg('allimain'), 'openDlg');
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopAllianceBlinking');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		
		this.dlg.openGiftDlg();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.nobuild] );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.ALLIINBUILD, level:1}] });
		this.mm.clear();
		this.dlg.openGiftDlg();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.noInAlliance] );

		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.mm.clear();
		this.dlg.openGiftDlg();
		assertEQ ( this.mm.params['openDlg'], [1] );
		assertEQ ( this.mm.walkLog, 'openDlg,stopAllianceBlinking' );
	};
});

TestCaseAlliCreateDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.dlg = AlliCreateDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.mm.params['regEvent.0'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc(). _onSvrPkg] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.LOGIN_OK, 0, this.dlg, this.lc(). _onLoginOk] );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.lc().m_g, this.g );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_showDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );
	};
	
	this.test_sendApplyToSvr = function(){
		this.mm.mock(AllianceSender, 'sendApplyJoin');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.dlg.sendApplyToSvr('alliance');
		assertEQ ( this.mm.params['sendApplyJoin'], [this.g, 'alliance'] );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_NORMAL, TQ.format(rstr.alli.detaildlg.sendapply, 'alliance')] );
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_initInputs');
		this.mm.mock(this.lc(), '_setBtnsDelayType');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers,_initInputs,_setBtnsDelayType' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.createdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.createdlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc()._getCtrl('applybtn'), 'setCaller');
		this.mm.mock(this.lc()._getCtrl('listbtn'), 'setCaller');
		this.mm.mock(this.lc()._getCtrl('createbtn'), 'setCaller');
		this.mm.mock(this.lc()._getCtrl('randbtn'), 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickAlliListBtn}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickApplyBtn}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickCreateBtn}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.dlg, caller:this.lc()._onClickRandBtn}] );
	};
	
	this.test__initInputs = function(){
		this.mm.mock(InputLimit, 'maxGBKBytes');
		this.mm.mock(TQ, 'maxLength');
		this.lc()._initInputs();
		assertEQ ( this.mm.params['maxGBKBytes.0'], [this.lc()._getCtrl('ialliname'), JVALID.getMaxAlliLen()] );
		assertEQ ( this.mm.params['maxGBKBytes.1'], [this.lc()._getCtrl('icreatename'), JVALID.getMaxAlliLen()] );
		assertEQ ( this.mm.params['maxLength'], [this.lc()._getCtrl('iflagname'), JVALID.getMaxAlliFlagLen()] );
	};
	
	this.test__setBtnsDelayType = function(){
		this.mm.mock(this.lc()._getCtrl('applybtn'), 'setDelay:setDelay1');
		this.mm.mock(this.lc()._getCtrl('createbtn'), 'setDelay:setDelay2');
		
		this.lc()._setBtnsDelayType();
		assertEQ ( this.mm.params['setDelay1'], [this.lc().C_BTN_DELAY_MS] );
		assertEQ ( this.mm.params['setDelay2'], [this.lc().C_BTN_DELAY_MS] );
		assertEQ ( this.lc()._getCtrl('applybtn').getType(), BTN_TYPE.DELAY );
		assertEQ ( this.lc()._getCtrl('createbtn').getType(), BTN_TYPE.DELAY );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(AllianceSender, 'sendGetCurApplying');
		this.mm.mock(this.lc().m_items.tab, 'activeTab');
		TQ.setTextEx(this.lc()._getCtrl('alliname'), 'has');
		TQ.setTextEx(this.lc()._getCtrl('needmoney'), 0);
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetCurApplying'], [this.g] );
		assertEQ ( this.mm.params['activeTab'], [0] );
		assertEQ ( TQ.getTextEx(this.lc()._getCtrl('alliname')),  '' );
		assertEQ ( TQ.getTextEx(this.lc()._getCtrl('needmoney')),  res_create_alli_need_money );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(AllianceSender, 'sendGetInviteList');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['sendGetInviteList'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc(), '_handleCreateResult' );
		this.mm.mock(this.lc(), '_handleApplyInfo' );
		this.mm.mock(this.lc(), '_handleInviteInfo' );
		
		var netdata = {data:{create:{name:'create'},  applyinfo:{name:'applyinfo'}, inviteinfo:{name:'inviteinfo'}}};
		this.lc()._onSvrPkg(netdata);
		assertEQ ( this.mm.params['_handleCreateResult'], [netdata.data.create] );
		assertEQ ( this.mm.params['_handleApplyInfo'], [netdata.data.applyinfo] );
		assertEQ ( this.mm.params['_handleInviteInfo'], [netdata.data.inviteinfo] );
	};
	
	this.test__onClickAlliListBtn = function(){
		this.mm.mock(UIM.getDlg('allilist'), 'setCaller');
		this.mm.mock(UIM.getDlg('allilist'), 'openDlg');
		this.lc()._onClickAlliListBtn();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectAlliance}] );
		assertEQ ( this.mm.params['openDlg'], [this.g.getImgr().getStateCity()] );
	};
	
	this.test__onSelectAlliance = function(){
		this.lc()._getCtrl('ialliname').value = '';
		this.lc()._onSelectAlliance('alli');
		assertEQ ( this.lc()._getCtrl('ialliname').value, 'alli' );
	};
	
	this.test__onClickApplyBtn = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(this.dlg, 'sendApplyToSvr');
		this.lc()._getCtrl('ialliname').value = 'alliname';
		this.lc()._onClickApplyBtn();
		assertEQ ( this.mm.walkLog, 'sendApplyToSvr' );
		assertEQ ( this.mm.params['sendApplyToSvr'], ['alliname'] );
		
		this.mm.clear();
		this.lc()._getCtrl('ialliname').value = 'allin\'ame';
		this.lc()._onClickApplyBtn();
		assertEQ ( this.mm.walkLog, 'msgBox' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null] );
	};
	
	this.test__onClickCreateBtn = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(AllianceSender, 'sendCreateAlli');
		this.mm.mock(this.lc()._getCtrl('icreatename'), 'focus:focus1');
		this.mm.mock(this.lc()._getCtrl('iflagname'), 'focus:focus2');
		
		this.mm.clear();
		this.lc()._getCtrl('icreatename').value = 'allin\'ame';
		this.lc()._onClickCreateBtn();
		assertEQ ( this.mm.walkLog, 'msgBox,focus1' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.rankingdlg.invalidalliname, MB_F_CLOSE, null] );
		
		this.mm.clear();
		this.lc()._getCtrl('icreatename').value = 'alliname';
		this.lc()._getCtrl('iflagname').value = '\'';
		this.lc()._onClickCreateBtn();
		assertEQ ( this.mm.walkLog, 'msgBox,focus2' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.alli.createdlg.tips.invalidalliflag, MB_F_CLOSE, null] );
		
		this.mm.clear();
		this.lc()._getCtrl('icreatename').value = 'alliname';
		this.lc()._getCtrl('iflagname').value = '好';
		this.lc()._onClickCreateBtn();
		assertEQ ( this.mm.walkLog, 'sendCreateAlli' );
		assertEQ ( this.mm.params['sendCreateAlli'], [this.g, 'alliname', '好'] );
	};
	
	this.test__onClickRandBtn = function(){
		this.mm.mock(this.lc(), '_getRandHZ', ['王'] );
		this.lc()._onClickRandBtn();
		assertEQ ( this.lc()._getCtrl('iflagname').value, '王' );
	};
	
	this.test__onClickAgreeInvite = function(){
		this.mm.mock(AllianceSender, 'sendAgreeInvite');
		this.lc().m_invitelist = [{desc:'desc', roleId:1, alliId:2}];
		this.lc()._onClickAgreeInvite(0);
		assertEQ ( this.mm.params['sendAgreeInvite'], [this.g, 1, 2] );
	};
	
	this.test__onClickIgnoreInvite = function(){
		this.mm.mock(AllianceSender, 'sendIgnoreInvite');
		this.lc().m_invitelist = [{desc:'desc', roleId:1, alliId:2}];
		this.lc()._onClickIgnoreInvite(0);
		assertEQ ( this.mm.params['sendIgnoreInvite'], [this.g, 1, 2] );
	};
	
	this.test__handleApplyInfo = function(){
		TQ.setTextEx(this.lc()._getCtrl('alliname'), '');
		this.lc()._handleApplyInfo(null);
		TQ.setTextEx(this.lc()._getCtrl('alliname'), '');
		
		this.lc()._handleApplyInfo({});
		TQ.setTextEx(this.lc()._getCtrl('alliname'), '');
			
		this.lc()._handleApplyInfo({alli:'alliname'});
		this.lc().m_dlg.hide();
		TQ.setTextEx(this.lc()._getCtrl('alliname'), '');
			
		this.lc()._handleApplyInfo({alli:'alliname'});
		this.lc().m_dlg.show();
		TQ.setTextEx(this.lc()._getCtrl('alliname'), 'alliname');
	};
	
	this.test__handleCreateResult = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(this.lc(), '_hideDlg');
		this.mm.mock(UIM.getDlg('alli'), 'openDlg');
		
		this.g.getImgr().getRoleRes().allipos = 0;
		this.lc()._handleCreateResult ( null );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._handleCreateResult ( {} );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg.hide();
		this.lc()._handleCreateResult ( {result:0, allipos:1} );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg.show();
		this.lc()._handleCreateResult ( {result:0, allipos:1} );
		assertEQ ( this.mm.walkLog, 'sysMsgTips,_hideDlg,openDlg' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_SUCCESS,  rstr.alli.createdlg.tips.createalliok] );
		assertEQ ( this.g.getImgr().getRoleRes().allipos, 1 );
	};
	
	this.test__handleInviteInfo = function(){
		this.lc()._handleInviteInfo(null);
		assertEQ ( this.lc()._getCtrl('invitelist').getCount(), 0);
		
		var inviteinfo = [];
		this.lc()._handleInviteInfo(inviteinfo);
		assertEQ ( this.lc()._getCtrl('invitelist').getCount(), 0);
		assertEQ ( this.lc().m_invitelist, inviteinfo );
		
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'startAllianceBlinking' );
		this.mm.travelMock(this.lc(), '_setInviteListItems' );
		
		this.lc().m_dlg.hide();
		this.lc()._getCtrl('invitelist').setItemCount(10);
		var item0 = this.lc()._getCtrl('invitelist').getItem(0);	
		var item1 = this.lc()._getCtrl('invitelist').getItem(1);
		this.mm.mock(item0.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller');
		this.mm.mock(item0.exsubs.ignoreBtn, 'setCaller:ignoreBtnSetCaller');
		this.mm.mock(item1.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller');
		this.mm.mock(item1.exsubs.ignoreBtn, 'setCaller:ignoreBtnSetCaller');		
		inviteinfo = [{alliId:0,desc:'desc0#[a:alliance0]'},{alliId:1,desc:'desc1#[a:alliance1]'},{alliId:2,desc:'desc2#[a:alliance2]'}];
		this.lc()._handleInviteInfo(inviteinfo);
		this.lc()._handleInviteInfo([{_k:"alliId"},{alliId:2,_d:1}]);
		assertEQ ( this.lc().m_invitelist, [inviteinfo[0], inviteinfo[1]] );
		assertEQ ( this.mm.params['startAllianceBlinking'], [10000] );
		
		this.mm.clear();
		this.lc().m_invitelist = [];
		this.lc()._handleInviteInfo([{_k:"alliId"}]);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg.show();
		this.lc()._handleInviteInfo(inviteinfo);
		this.lc()._handleInviteInfo([{_k:"alliId"},{alliId:2,_d:1}]);
		assertEQ ( this.lc().m_invitelist, [inviteinfo[0], inviteinfo[1]] );
		assertEQ ( this.lc()._getCtrl('invitelist').getCount(), 2);
		assertEQ ( TQ.getTextEx(item0.exsubs.desc), HyperLinkMgr.formatLink(inviteinfo[0].desc) );
		assertEQ ( TQ.getTextEx(item1.exsubs.desc), HyperLinkMgr.formatLink(inviteinfo[1].desc) );
		assertEQ ( this.mm.params['agreeBtnSetCaller.0'], [{self:this.dlg, caller:this.lc()._onClickAgreeInvite}] );
		assertEQ ( this.mm.params['ignoreBtnSetCaller.0'], [{self:this.dlg, caller:this.lc()._onClickIgnoreInvite}] );
		assertEQ ( item0.exsubs.agreeBtn.getId(), 0);
		assertEQ ( item0.exsubs.ignoreBtn.getId(), 0);
		assertEQ ( this.mm.params['agreeBtnSetCaller.1'], [{self:this.dlg, caller:this.lc()._onClickAgreeInvite}] );
		assertEQ ( this.mm.params['ignoreBtnSetCaller.1'], [{self:this.dlg, caller:this.lc()._onClickIgnoreInvite}] );
		assertEQ ( item1.exsubs.agreeBtn.getId(), 1);
		assertEQ ( item1.exsubs.ignoreBtn.getId(), 1);
	};
	
	this.test__hideDlg = function() {
		this.lc().m_dlg.show();
		this.lc()._hideDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		
		this.lc().m_dlg = null;
		this.lc()._hideDlg();
	};
	
	this.test__getCtrl = function(){
		var applyItems = this.lc().m_items.tab.getTabItems(0);
		var createItems = this.lc().m_items.tab.getTabItems(1);
		assertEQ ( this.lc()._getCtrl('ialliname'), applyItems.ialliname );
		assertEQ ( this.lc()._getCtrl('listbtn'), applyItems.listbtn );
		assertEQ ( this.lc()._getCtrl('alliname'), applyItems.alliname );
		assertEQ ( this.lc()._getCtrl('applybtn'), applyItems.applybtn );
		
		assertEQ ( this.lc()._getCtrl('icreatename'), createItems.icreatename );
		assertEQ ( this.lc()._getCtrl('needmoney'), createItems.needmoney );
		assertEQ ( this.lc()._getCtrl('createbtn'), createItems.createbtn );
	};
});

TestCaseAlliListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliListDlg.snew(this.g);
		this.cityResId = 9900001;
		this.dlg.openDlg(this.cityResId );
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_init');
		this.dlg.init(this.g);
		assertEQ ( this.mm.params['_init'], [this.dlg, this.g] );
	};
	
	this.test_openDlg = function(){
		this.mm.travelMock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_showDlg');
		this.mm.mock(this.lc(), '_initInfo');
		
		var cityResId = 9900001
		this.dlg.openDlg(cityResId);
		assertEQ ( this.mm.walkLog, '_initParams,_initDlg,_showDlg,_initInfo' );
		assertEQ ( this.lc().m_cityResId, cityResId );
	};
	
	this.test__init = function(){
		this.lc()._init(this.dlg, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_createDlgByTempl');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_createDlgByTempl,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.listdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.allilistdlg, this.lc().m_items] ); 
	};
	
	this.test__createDlgByTempl = function(){
		this.mm.travelMock(AlliListDlgTempl, 'snew');
		this.lc()._createDlgByTempl();
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, this.lc().m_items.container, 'join'] );
		assertEQ ( this.lc().m_templ instanceof AlliListDlgTempl, true );
	};
	
	this.test__setCallers = function(self){
		this.mm.mock(this.lc().m_templ, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickJoinBtn}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock ( this.lc().m_templ, 'openDlg' )
		this.lc()._initInfo();
		assertEQ ( this.mm.params['openDlg'], [this.cityResId ] );
	};
	
	this.test__onClickJoinBtn = function(){
		this.lc()._onClickJoinBtn('alli');
		
		this.lc().m_dlg.show();
		var r_name = '';
		var callBack = function(name){
			r_name = name;
		};
		this.dlg.setCaller({self:this, caller:callBack});
		this.lc()._onClickJoinBtn('alli');
		assertEQ ( r_name, 'alli' );
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
});

TestCaseAlliListDlgTempl = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliListDlg.snew(this.g);
		this.cityResId = 9900001;
		this.dlg.openDlg(this.cityResId );
		this.templ = AlliListDlgTempl.snew(this.g, this.dlg, this.dlg.lc().m_items.container, 'join');
		this.lc = this.templ.lc;
		
		this.alliances_res = [{rank:100,name:'alli0',cityResId:9900001,leader:'role0',level:1,mem:10,honour:1000}
			,{rank:101,name:'alli1',cityResId:9900002,leader:'role1',level:2,mem:11,honour:1001}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_init');
		this.mm.mock(this.lc(), '_createItems');
		this.templ.init(this.g, this.dlg, this.dlg.lc().m_items.container, 'join');
		assertEQ ( this.mm.walkLog, '_init,_createItems' );
		assertEQ ( this.mm.params['_init'], [this.templ, this.g, this.dlg, 'join']);
		assertEQ ( this.mm.params['_createItems'], [this.dlg.lc().m_items.container]);
	};
	
	this.test_searchLbl = function(){
		assertEQ ( TQ.getTextEx(this.lc().m_items.searchLbl), rstr.alli.listdlg.lbl.searchalli );
	};
	
	this.test_openDlg = function(){
		this.lc().m_pageNo = 10;
		this.lc().m_cityResId = 0;
		this.mm.mock(this.lc().m_items.pageBar, 'activePage');
		this.templ.openDlg(this.cityResId);
		assertEQ ( this.lc().m_cityResId, this.cityResId );
		assertEQ ( this.mm.params['activePage'], [1, true] );
	};
	
	this.test_onSvrPkg = function(){
		this.lc().m_cityResId = this.cityResId;
		this.mm.mock(this.lc().m_pageBar, 'setPageBarNoActive');
		this.mm.mock(this.lc(), '_setAllianceListItems');
		this.mm.mock(this.lc(), '_setAllianceListItemBtnsVisible');
		this.mm.mock(this.lc(), '_setAllianceListItemBtnsCaller');
		this.mm.mock(this.lc(), '_setCurSelectItem');
		
		var netcmd = {}
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
			
		netcmd = {cityResId:this.cityResId+1,alliances:this.alliances_res, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
			
		netcmd = {cityResId:this.cityResId,alliances:this.alliances_res, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:netcmd});
		assertEQ ( this.mm.walkLog, 'setPageBarNoActive,_setAllianceListItems,_setAllianceListItemBtnsVisible,_setAllianceListItemBtnsCaller,_setCurSelectItem' );
		assertEQ ( this.mm.params['setPageBarNoActive'], [2, 10] );
		assertEQ ( this.mm.params['_setAllianceListItems'], [netcmd.alliances] );
		assertEQ ( this.mm.params['_setCurSelectItem'], [netcmd.curSelIdx] );
		assertEQ ( this.lc().m_alliancesRes, netcmd.alliances );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		netcmd = {cityResId:this.cityResId,alliances:this.alliances_res, pageNo:2, pageCount:10, curSelIdx:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:netcmd});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__init = function(){
		this.lc()._init(this.templ, this.g, this.dlg, 'join');
		assertEQ ( this.lc().m_this, this.templ);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_flag, 'join');
	};
	
	this.test__createItems = function(){
		this.mm.mock(this.g.getGUI(), 'buildDomItems');
		var container = this.dlg.lc().m_items.container;
		this.lc()._createItems(container);
		assertEQ ( this.mm.params['buildDomItems'], [container, uicfg.alli.allilistdlg.t_[0], uicfg.alli.allilistdlg.t_, this.lc().m_items] );
	};
	
	this.test__setInputLimit = function(){
		this.mm.mock(InputLimit, 'maxGBKBytes');
		this.mm.mock(this.templ, 'onPageNavigate');
		this.lc()._createPageBar();
		assertEQ ( this.mm.params['maxGBKBytes'], [this.lc().m_items.searchName, JVALID.getMaxAlliLen()] );
		assertEQ ( this.mm.params['onPageNavigate'], [1] );
	};
	
	this.test__setPageBar = function(){
		this.mm.travelMock(this.lc().m_items.pageBar, 'setPageCnt');
		this.mm.travelMock(this.lc().m_items.pageBar, 'activePage');
		this.lc().m_pageBar.setPageBarNoActive(2, 10);
		assertEQ ( this.mm.params['setPageCnt'], [10] );
		assertEQ ( this.mm.params['activePage'], [2, false , true] );
		assertEQ ( this.lc().m_items.pageno.getVal(), 2);
	};
	
	this.test__setAllianceListItems = function(){
		this.lc()._setAllianceListItems(this.alliances_res);
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		
		var cityres = ItemResUtil.findItemres(9900001);
		var cityflagimg = IMG.makeSmallStateCityFlag(cityres.flagimg);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.cityFlag), cityflagimg), true );
		
		assertEQ ( TQ.getTextEx(item0.exsubs.rank), 100 );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'alli0' );
		assertEQ ( TQ.getTextEx(item0.exsubs.leader), 'role0' );
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.mem), 10 );
		assertEQ ( TQ.getTextEx(item0.exsubs.honour), 1000 );
		assertEQ ( item0.exsubs.seeBtn.getId(), 0);
		assertEQ ( item0.exsubs.joinBtn.getId(), 0);
		
		cityres = ItemResUtil.findItemres(9900002);
		cityflagimg = IMG.makeSmallStateCityFlag(cityres.flagimg);
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.cityFlag), cityflagimg), true );		
		
		assertEQ ( TQ.getTextEx(item1.exsubs.rank), 101 );
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'alli1' );
		assertEQ ( TQ.getTextEx(item1.exsubs.leader), 'role1' );
		assertEQ ( TQ.getTextEx(item1.exsubs.level), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.mem), 11 );
		assertEQ ( TQ.getTextEx(item1.exsubs.honour), 1001 );
		assertEQ ( item1.exsubs.seeBtn.getId(), 1);
		assertEQ ( item1.exsubs.joinBtn.getId(), 1);
	};
	
	this.test__setAllianceListItemBtnsVisible = function(){
		this.lc()._setAllianceListItems(this.alliances_res);
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		
		this.lc().m_flag = 'join';
		this.lc()._setAllianceListItemBtnsVisible();
		assertEQ ( item0.exsubs.joinBtn.isShow(), true );
		assertEQ ( item1.exsubs.joinBtn.isShow(), true );
		
		this.lc().m_flag = 'rank';
		this.lc()._setAllianceListItemBtnsVisible();
		assertEQ ( item0.exsubs.joinBtn.isShow(), false );
		assertEQ ( item1.exsubs.joinBtn.isShow(), false );
	};
	
	this.test__setAllianceListItemBtnsCaller = function(){
		this.lc()._setAllianceListItems(this.alliances_res);
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		
		this.mm.mock(item0.exsubs.seeBtn, 'setCaller:seeBtnSetCaller0');
		this.mm.mock(item0.exsubs.joinBtn, 'setCaller:joinBtnSetCaller0');
		this.mm.mock(item1.exsubs.seeBtn, 'setCaller:seeBtnSetCaller1');
		this.mm.mock(item1.exsubs.joinBtn, 'setCaller:joinBtnSetCaller1');
		
		this.lc()._setAllianceListItemBtnsCaller();
		assertEQ ( this.mm.params['seeBtnSetCaller0'], [{self:this.templ, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['joinBtnSetCaller0'], [{self:this.templ, caller:this.lc()._onClickJoinBtn}] );
		assertEQ ( this.mm.params['seeBtnSetCaller1'], [{self:this.templ, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['joinBtnSetCaller1'], [{self:this.templ, caller:this.lc()._onClickJoinBtn}] );
	};
	
	this.test__setCurSelectItem = function(){
		this.lc()._setAllianceListItems(this.alliances_res);
		this.lc().m_items.list.setCurSel(0);
		this.lc()._setCurSelectItem(null);
		assertEQ ( this.lc().m_items.list.getCurSel(), -1);
		this.lc()._setCurSelectItem(1);
		assertEQ ( this.lc().m_items.list.getCurSel(), 1);
	};
	
	this.test__onClickSearch = function(){
		this.mm.mock(AllianceSender, 'sendSearchAlliance');
		
		this.lc().m_items.searchName.value = '';
		this.lc().m_items.searchBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), '' );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_items.searchName.value = 'a';
		this.lc().m_items.searchBtn.click();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.listdlg.tip.invalidalli ), true);
		assertEQ ( this.mm.walkLog, '' );
		
		TestCaseSysTip.clearTip();
		this.lc().m_items.searchName.value = 'abcd';
		this.lc().m_cityResId = this.cityResId;
		this.lc().m_items.searchBtn.click();
		assertEQ ( TestCaseSysTip.hasSystip (), false );
		assertEQ ( this.mm.params['sendSearchAlliance'], [this.g, this.cityResId, 'abcd'] );
	};
	
	this.test__onClickGetSelf = function(){
		this.mm.mock(AllianceSender, 'sendSearchAlliance');
		this.lc().m_cityResId = this.cityResId;
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		this.g.getImgr().getRoleRes().alliance.name = '';
		this.lc().m_items.getSelfBtn.click();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.listdlg.tip.selfNoInAlli ), true);
		assertEQ ( this.mm.walkLog, '' );
		
		TestCaseSysTip.clearTip();
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.g.getImgr().getRoleRes().alliance.name = 'alli';
		this.lc().m_items.getSelfBtn.click();
		assertEQ ( TestCaseSysTip.hasSystip (), false );
		assertEQ ( this.mm.params['sendSearchAlliance'], [this.g, this.cityResId, 'alli'] );
	};
	
	this.test__onClickGotoPage = function(){
		this.lc().m_items.pageBar.setPageCnt(2);
		this.mm.mock(this.lc().m_items.pageBar, 'activePage');
		this.lc().m_items.pageno.setVal(3);
		this.lc().m_items.gotoPage.click();
		assertEQ ( this.mm.params['activePage'], [2] );
	};
	
	this.test__activePage = function(){
		this.lc().m_items.pageBar.setPageCnt(10);
		this.mm.mock(AllianceSender, 'sendGetAlliList');
		this.lc().m_cityResId = this.cityResId;
		var pageNo = 2;
		this.lc().m_items.pageBar.activePage(pageNo);
		assertEQ ( this.mm.params['sendGetAlliList'], [this.g, this.cityResId, pageNo] );
		assertEQ ( this.lc().m_items.pageno.getVal(), 2 );
	};
	
	this.test__onClickSeeBtn = function(){
		this.lc().m_alliancesRes = this.alliances_res;
		this.mm.mock(AllianceSender, 'sendGetAllianceDetail');
		this.lc()._onClickSeeBtn(1);
		assertEQ ( this.mm.params['sendGetAllianceDetail'], [this.g, 'alli1'] );
	};
	
	this.test__onClickJoinBtn = function(){
		this.lc().m_alliancesRes = this.alliances_res;
		this.lc()._onClickJoinBtn(1);
		
		var r_name = '';
		var callBack = function(name){
			r_name = name;
		};
		this.templ.setCaller({self:this, caller:callBack});
		this.lc()._onClickJoinBtn(1);
		assertEQ ( r_name, 'alli1' );
	};
});

TestCaseAlliDetailDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliDetailDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.detail = {name:"alliance",level:1,flag:"f",leader:"role",cityResId:9900001,mem:1,buildVal:2,card:3,honour:4,introduction:"intro"}
		this.lc()._openDlg(this.detail);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test__openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_showDlg');
		this.mm.mock(this.lc(), '_initInfo');
		
		var detail = {name:'alliance'};
		this.lc()._openDlg(detail);
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );
		assertEQ ( this.mm.params['_initInfo'], [detail] );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.detaildlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.allidetail, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.applybtn, 'setCaller:applybtnSetCaller');
		this.mm.mock(this.lc().m_items.membtn, 'setCaller:membtnSetCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['applybtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickApplyBtn}] );
		assertEQ ( this.mm.params['membtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickMemBtn}] );
	};
	
	this.test__initInfo = function(){
		this.lc()._initInfo(this.detail);
		assertEQ ( this.lc().m_detail, this.detail );

		var cityres = ItemResUtil.findItemres(this.detail.cityResId);
		var cityflagimg = IMG.makeSmallStateCityFlag(cityres.flagimg);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.cityFlag), cityflagimg), true );

		assertEQ ( TQ.getTextEx(this.lc().m_items.name), this.detail.name );
		assertEQ ( TQ.getTextEx(this.lc().m_items.level), this.detail.level );
		assertEQ ( TQ.getTextEx(this.lc().m_items.flag), this.detail.flag );
		assertEQ ( TQ.getTextEx(this.lc().m_items.leader), this.detail.leader );
		assertEQ ( TQ.getTextEx(this.lc().m_items.mem), this.detail.mem );
		assertEQ ( TQ.getTextEx(this.lc().m_items.buildVal), this.detail.buildVal );
		assertEQ ( TQ.getTextEx(this.lc().m_items.card), this.detail.card );
		assertEQ ( TQ.getTextEx(this.lc().m_items.honour), this.detail.honour );
		assertEQ ( TQ.getTextEx(this.lc().m_items.introduction.getContainerObj()), this.detail.introduction );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc(), '_openDlg');
		var cmd = {data:{}}
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '' );
			
		cmd = {data:{detail:this.detail}}
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.params['_openDlg'], [this.detail] );
	};
	
	this.test__onClickApplyBtn = function(){
		this.mm.mock(UIM.getDlg('allicreate'), 'sendApplyToSvr');
		this.lc()._onClickApplyBtn();
		assertEQ ( this.mm.params['sendApplyToSvr'], [this.detail.name] );
	};
	
	this.test__onClickMemBtn = function(){
		this.mm.mock(UIM.getDlg('selfallimemlist'), 'openDlg:openSelfDlg');
		this.mm.mock(UIM.getDlg('otherallimemlist'), 'openDlg:openOtherDlg');
		
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.g.getImgr().getRoleRes().alliance.name = 'alliance';
		this.lc()._onClickMemBtn();
		assertEQ ( this.mm.walkLog, 'openSelfDlg');
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		this.g.getImgr().getRoleRes().alliance.name = 'alliance1';
		this.lc()._onClickMemBtn();
		assertEQ ( this.mm.walkLog, 'openOtherDlg');
		assertEQ ( this.mm.params['openOtherDlg'], [this.detail.name] );
	};
});

TestCaseSelfAlliMemListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SelfAlliMemListDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		this.cmd = {data:{selfmems:[
			{name:'role1',gridId:801,roleId:10001,alliPos:2,roleRank:1,level:10,buildCurVal:100,contributes:1000,loginTime:0}
			,{name:'role2',gridId:802,roleId:10002,alliPos:3,roleRank:2,level:11,buildCurVal:101,contributes:1001,loginTime:10000000}
			,{name:'role3',gridId:803,roleId:10003,alliPos:1,roleRank:3,level:12,buildCurVal:102,contributes:1002,loginTime:10000000 - 3*24*3600}
			],pageCount:2,pageNo:1}};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.selfmemlistdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.selfmemlist, this.lc().m_items] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'activePage');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['activePage'], [1, true] );
	};
	
	this.test__onSvrPkg = function(){
		this.lc().m_items.list.setItemCount(3);
		
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		var item2 = this.lc().m_items.list.getItem(2);
		this.mm.mock(item0.exsubs.seeBtn, 'setCaller:setCaller0');
		this.mm.mock(item1.exsubs.seeBtn, 'setCaller:setCaller1');
		this.mm.mock(item2.exsubs.seeBtn, 'setCaller:setCaller2');
		this.mm.mock(this.lc().m_items.pageBar, 'setPageCnt' );
		this.mm.mock(this.lc().m_items.pageBar, 'activePage' );
		
		this.lc().m_items.list.setItemCount(0);
		
		this.g.setSvrTimeS(10000000);
		var cmd = this.cmd;
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.list.getCount(), 0 );
			
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.params['setCaller0'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['setCaller1'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['setCaller2'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['setPageCnt'], [2] );
		assertEQ ( this.mm.params['activePage'], [1, false , true] );
		
		assertEQ ( this.lc().m_items.list.getCount(), 3 );
		assertEQ ( this.lc().m_selfmems, cmd.data.selfmems ); //--
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.alliPos), rstr.alli.alliposs[2] );
		assertEQ ( TQ.getTextEx(item0.exsubs.roleRank), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 10 );
		assertEQ ( TQ.getTextEx(item0.exsubs.buildCurVal), 100 );
		assertEQ ( TQ.getTextEx(item0.exsubs.contributes), 1000 );
		assertEQ ( TQ.getTextEx(item0.exsubs.state), '--' );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$alliPos']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip(rstr.alli.allipostips[2]) );
		
		assertEQ ( item0.exsubs.seeBtn.getId(), 0 );
			
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.alliPos), rstr.alli.alliposs[3] );
		assertEQ ( TQ.getTextEx(item1.exsubs.state), '--' );
		assertEQ ( item1.exsubs.seeBtn.getId(), 1 );
		assertEQ ( TQ.getTextEx(item2.exsubs.state), TQ.format(rstr.alli.selfmemlistdlg.tip.noLoginDays, 3) );
		assertEQ ( item2.exsubs.seeBtn.getId(), 2 );
		var tip = TTIP.getTipById(item1.exsubs.tooltips['$alliPos']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip(rstr.alli.allipostips[3]) );
		
		this.lc()._onSvrPkg({data:{}});
	};
	
	this.test__onPageNavigate = function(){
		this.mm.mock(AllianceSender, 'sendGetSelfMems');
		var pageNo = 1;
		this.lc()._onPageNavigate(1);
		assertEQ( this.mm.params['sendGetSelfMems'], [this.g, pageNo] );
	};
	
	this.test__onClickSeeBtn = function(){
		this.mm.mock(UIM.getDlg('allimeminfo'), 'openDlg');
		this.mm.mock(UIM.getDlg('allimeminfo'), 'setObserver');
		this.lc()._onSvrPkg(this.cmd);

		var index = 1;
		this.lc()._onClickSeeBtn(index);
		assertEQ ( this.mm.params['openDlg'], [ this.cmd.data.selfmems[1] ] );
		assertEQ ( this.mm.params['setObserver'], [ this.lc()._onMemberChange ] );
	};
	
	this.test__onMemberChange = function(){
		this.mm.mock(AllianceSender, 'sendGetSelfMems');
		this.lc()._onMemberChange();
		assertEQ( this.mm.params['sendGetSelfMems'], [this.g, 1] );
	};
});

TestCaseOtherAlliMemListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = OtherAlliMemListDlg.snew(this.g);
		this.dlg.openDlg('alliance');
		this.lc = this.dlg.lc;
		this.cmd = {data:{cityResId:9900001, mems:[
			{name:'role1',alliPos:2,roleRank:1,level:10,gridId:601,roleId:10001}
			,{name:'role2',alliPos:3,roleRank:2,level:11,gridId:602,roleId:10002}
			,{name:'role3',alliPos:1,roleRank:3,level:12,gridId:603,roleId:10003}
			],pageCount:2,pageNo:1}};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg('alliance')
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );		
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.othermemlistdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.othermemlist, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'activePage');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['activePage'], [1, true] );
	};
	
	this.test__onSvrPkg = function(){
		this.g.getImgr().getRoleRes().pos = {x:200, y:200};
		this.g.getImgr().getFightRefStates().push({id:10002, state:1});
		this.g.getImgr().getFightRefStates().push({id:10003, state:2});
		
		this.lc().m_items.list.setItemCount(3);
		
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		var item2 = this.lc().m_items.list.getItem(2);
		this.mm.mock(item0.exsubs.seeBtn, 'setCaller:seeBtnSetCaller0');
		this.mm.mock(item1.exsubs.seeBtn, 'setCaller:seeBtnSetCaller1');
		this.mm.mock(item2.exsubs.seeBtn, 'setCaller:seeBtnSetCaller2');
		this.mm.mock(item0.exsubs.declareBtn, 'setCaller:declareBtnSetCaller0');
		this.mm.mock(item1.exsubs.declareBtn, 'setCaller:declareBtnSetCaller1');
		this.mm.mock(item2.exsubs.declareBtn, 'setCaller:declareBtnSetCaller2');
		this.mm.mock(this.lc().m_items.pageBar, 'setPageCnt' );
		this.mm.mock(this.lc().m_items.pageBar, 'activePage' );		
		
		this.lc().m_items.list.setItemCount(0);
		
		this.g.setSvrTimeS(10000000);
		var cmd = this.cmd;
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.list.getCount(), 0 );
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.params['seeBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['seeBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['seeBtnSetCaller2'], [{self:this.dlg, caller:this.lc()._onClickSeeBtn}] );
		assertEQ ( this.mm.params['declareBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickDeclareBtn}] );
		assertEQ ( this.mm.params['declareBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickDeclareBtn}] );
		assertEQ ( this.mm.params['declareBtnSetCaller2'], [{self:this.dlg, caller:this.lc()._onClickDeclareBtn}] );
		assertEQ ( this.mm.params['setPageCnt'], [2] );
		assertEQ ( this.mm.params['activePage'], [1, false , true] );
		
		assertEQ ( this.lc().m_items.list.getCount(), 3 );
		assertEQ ( this.lc().m_mems, cmd.data.mems );
		
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.alliPos), rstr.alli.alliposs[2] );
		assertEQ ( TQ.getTextEx(item0.exsubs.roleRank), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 10 );
		assertEQ ( TQ.getTextEx(item0.exsubs.state), rstr.field.rolecitydlg.lbl.refstate[0] );
		assertEQ ( TQ.getTextEx(item0.exsubs.cood), HyperLinkMgr.formatLink('#[m:0:1]') );
		assertEQ ( TQ.getTextEx(item0.exsubs.distance), Math.round(ExpedTargetUtil.getDistance(this.g, {x:0, y:1})) );
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$alliPos']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip(rstr.alli.allipostips[2]) );
		assertEQ ( item0.exsubs.seeBtn.getId(), 0 );
		assertEQ ( item0.exsubs.declareBtn.getId(), 0 );
		assertEQ ( item0.exsubs.declareBtn.isEnable(), true );
		
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.alliPos), rstr.alli.alliposs[3] );
		assertEQ ( TQ.getTextEx(item1.exsubs.state), rstr.field.rolecitydlg.lbl.refstate[1] );
		assertEQ ( TQ.getTextEx(item1.exsubs.cood), HyperLinkMgr.formatLink('#[m:1:1]') );
		var tip = TTIP.getTipById(item1.exsubs.tooltips['$alliPos']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip(rstr.alli.allipostips[3]) );
		assertEQ ( item1.exsubs.seeBtn.getId(), 1 );
		assertEQ ( item1.exsubs.declareBtn.getId(), 1 );
		assertEQ ( item1.exsubs.declareBtn.isEnable(), false );
		assertEQ ( TQ.getTextEx(item2.exsubs.state), rstr.field.rolecitydlg.lbl.refstate[2] );
		assertEQ ( item2.exsubs.seeBtn.getId(), 2 );
		assertEQ ( item2.exsubs.declareBtn.getId(), 2 );
		assertEQ ( item2.exsubs.declareBtn.isEnable(), false );
		
		var cityres = ItemResUtil.findItemres(9900001);
		var cityflagimg = IMG.makeSmallStateCityFlag(cityres.flagimg);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.cityFlag), cityflagimg), true );
		
		this.lc()._onSvrPkg({data:{}});
	};
	
	this.test__onPageNavigate = function(){
		this.mm.mock(AllianceSender, 'sendGetOtherMems');
		var pageNo = 1;
		this.lc()._onPageNavigate(pageNo);
		assertEQ ( this.mm.params['sendGetOtherMems'], [this.g, 'alliance', pageNo] );
	};
	
	this.test__onClickSeeBtn = function(){
		field0 = {gridId:601, objType:OBJ_TYPE.ROLE, roleId:10001, roleName:'role1', alliance:{uid:-1,name:'alliance'}};
		field1 = {gridId:602, objType:OBJ_TYPE.ROLE, roleId:10002, roleName:'role2', alliance:{uid:-1,name:'alliance'}};
		
		this.lc()._onSvrPkg(this.cmd);
		this.mm.mock(UIM.getDlg('rolecitymodal'), 'openDlg');
		
		var index = 0;
		this.lc()._onClickSeeBtn(index);
		assertEQ ( this.mm.params['openDlg'], [field0] );
		
		index = 1;
		this.lc()._onClickSeeBtn(index);
		assertEQ ( this.mm.params['openDlg'], [field1] );
	};
	
	this.test__onClickDeclareBtn = function(){
		this.g.getImgr().getFightRefStates().push({id:10002, state:1});
		this.g.getImgr().getFightRefStates().push({id:10003, state:2});
		
		this.lc()._onSvrPkg(this.cmd);
		this.mm.mock(MilitarySender, 'sendDeclareFight');
		var index = 0;
		this.lc()._onClickDeclareBtn(index);
		assertEQ ( this.mm.params['sendDeclareFight'], [this.g, 10001] );
		
		this.mm.clear();
		index = 1;
		this.lc()._onClickDeclareBtn(index);
		assertEQ ( this.mm.walkLog, '' );
	};
});

TestCaseAlliMainDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMainDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );

		this.mm.mock(this.g, 'regEvent');
		this.dlg.init( this.g );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
		assertNotEQ ( this.lc().m_basePanel.update,  null);
		assertNotEQ ( this.lc().m_lawLightPanel.update,  null);
		assertNotEQ ( this.lc().m_auctionPanel.update,  null);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(1)
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
		assertEQ ( this.mm.params['_initInfo'], [1] );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_initPanels');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers,_initPanels' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.main.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.maindlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_dlg, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
	};

	this.test__initPanels = function(){
		this.mm.travelMock(AlliMainBasePanel, 'snew:snewBase');
		this.mm.travelMock(AlliMainLawLightPanel, 'snew:snewLawLight');
		this.mm.travelMock(AlliMainAuctionPanel, 'snew:snewAuction');
		this.lc()._initPanels();
		assertEQ ( this.mm.params['snewBase'], [this.g, this.lc().m_items.tablist.getTabItems(0)] );
		assertEQ ( this.mm.params['snewLawLight'], [this.g, this.lc().m_items.tablist.getTabItems(1)] );
		assertEQ ( this.mm.params['snewAuction'], [this.g, this.lc().m_items.tablist.getTabItems(2)] );
		assertEQ ( this.lc().m_basePanel instanceof AlliMainBasePanel, true );
		assertEQ ( this.lc().m_lawLightPanel instanceof AlliMainLawLightPanel, true );
	};
	
	this.test__showDlg = function(){
		this.mm.mock(this.lc().m_basePanel, 'show:basePanelShow');
		this.mm.mock(this.lc().m_lawLightPanel, 'show:lawLightShow');
		this.mm.mock(this.lc().m_auctionPanel, 'show:auctionShow');
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
		assertEQ ( this.mm.walkLog, 'basePanelShow,lawLightShow,auctionShow' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock( AllianceSender, 'sendGetMyAllianceDetail' );
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetMyAllianceDetail'], [this.g] );
		assertEQ ( this.lc().m_items.tablist.getActiveTab(), 0 );
		
		this.lc()._initInfo(1);
		assertEQ ( this.lc().m_items.tablist.getActiveTab(), 1 );
	};
	
	this.test__onSvrPkg = function(){
		this.lc()._onSvrPkg({data:{}}); // when is null
		
		this.mm.mock(this.lc().m_basePanel, 'update:baseUpdate');
		this.mm.mock(this.lc().m_lawLightPanel, 'update:lawLightUpdate');
		this.mm.mock(this.lc().m_auctionPanel, 'update:auctionUpdate');
		this.mm.mock(this.g, 'sendEvent');
			
		var cmd = {data:{mydetail:{name:'alliance'}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getMyAlliance().getName(), 'alliance' );
		assertEQ ( this.mm.walkLog, 'sendEvent,baseUpdate,lawLightUpdate,auctionUpdate' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.SELFALLI_DETAIL, sid:0}] );
		
		this.mm.clear();
		cmd = {data:{lawlight:{level:1}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getMyAlliance().getLawLight().getLevel(), 1 );
		assertEQ ( this.mm.walkLog, 'baseUpdate,lawLightUpdate,auctionUpdate' );
		
		this.mm.clear();
		cmd = {data:{selfmem:{alliPos:1}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getMyAlliance().getSelfMember().getAlliPos(), 1 );
		assertEQ ( this.mm.walkLog, 'sendEvent,baseUpdate,lawLightUpdate,auctionUpdate' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.SELFALLIMEM_CHANGE, sid:0}] );
		
		this.lc().m_dlg.hide();
		this.mm.clear();
		cmd = {data:{selfmem:{alliPos:1}}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.g.getImgr().getMyAlliance().getSelfMember().getAlliPos(), 1 );
		assertEQ ( this.mm.walkLog, 'sendEvent' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.lc().m_basePanel, 'hide');
		this.mm.mock(this.lc().m_lawLightPanel, 'hide');
		this.mm.mock(this.lc().m_auctionPanel, 'hide');
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE+1)
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE)
		assertEQ ( this.mm.walkLog, 'hide,hide,hide' );	
	};
});

TestCaseAlliMainBasePanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMainDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.lc().m_items.tablist.getTabItems(0);
		this.panel = this.dlg.lc().m_basePanel;
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.items.upgradeLevelBtn, 'setCaller:setCaller1');
		this.mm.mock(this.items.transferBtn, 'setCaller:setCaller2');
		this.mm.mock(this.items.seeMemsBtn, 'setCaller:setCaller3');
		this.mm.mock(this.items.subscribeBtn, 'setCaller:setCaller4');
		this.mm.mock(this.items.modifyQQGroupBtn, 'setCaller:setCaller5');
		this.mm.mock(this.items.inviteBtn, 'setCaller:setCaller6');
		this.mm.mock(this.items.agreeApplyBtn, 'setCaller:setCaller7');
		this.mm.mock(this.items.showEventBtn, 'setCaller:setCaller8');
		this.mm.mock(this.items.mergeBtn, 'setCaller:setCaller9');
		this.mm.mock(this.items.dismissBtn, 'setCaller:setCaller10');
		this.mm.mock(this.items.quitBtn, 'setCaller:setCaller11');
		this.mm.mock(this.items.modifyIntroduceBtn, 'setCaller:setCaller12');
		this.mm.mock(this.items.modifyBulletinBtn, 'setCaller:setCaller13');
		this.mm.mock(this.items.upgradeBar, 'setShowFlag:setShowFlag1');
		this.mm.mock(this.items.upgradeBar, 'setCustomValCaller:setCustomValCaller1');
		this.mm.mock(this.items.transferOrDismissBar, 'setShowFlag:setShowFlag2');
		this.mm.mock(this.items.transferOrDismissBar, 'setCustomValCaller:setCustomValCaller2');
		
		this.panel.init(this.g, this.items);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_items, this.items );
		
		assertEQ ( this.mm.params['setCaller1'], [{self:this.panel, caller:this.lc()._onClickUpgrade}] );
		assertEQ ( this.mm.params['setCaller2'], [{self:this.panel, caller:this.lc()._onClickTransfer}] );
		assertEQ ( this.mm.params['setCaller3'], [{self:this.panel, caller:this.lc()._onClickMemList}] );
		assertEQ ( this.mm.params['setCaller4'], [{self:this.panel, caller:this.lc()._onClickSubscribe}] );
		assertEQ ( this.mm.params['setCaller5'], [{self:this.panel, caller:this.lc()._onClickModifyQQ}] );
		
		assertEQ ( this.mm.params['setCaller6'], [{self:this.panel, caller:this.lc()._onClickInvite}] );
		assertEQ ( this.mm.params['setCaller7'], [{self:this.panel, caller:this.lc()._onClickAgreeApply}] );
		assertEQ ( this.mm.params['setCaller8'], [{self:this.panel, caller:this.lc()._onClickEvent}] );
		assertEQ ( this.mm.params['setCaller9'], [{self:this.panel, caller:this.lc()._onClickMerge}] );
		assertEQ ( this.mm.params['setCaller10'], [{self:this.panel, caller:this.lc()._onClickDismiss}] );
		assertEQ ( this.mm.params['setCaller11'], [{self:this.panel, caller:this.lc()._onClickQuit}] );
		assertEQ ( this.mm.params['setCaller12'], [{self:this.panel, caller:this.lc()._onClickModifyIntroduce}] );
		assertEQ ( this.mm.params['setCaller13'], [{self:this.panel, caller:this.lc()._onClickModifyBulletin}] );
		assertEQ ( this.mm.params['setShowFlag1'], [PROGBAR_SHOWFLAG_CUSTOM] );
		assertEQ ( this.mm.params['setCustomValCaller1'], [{self:this.panel, caller:this.lc()._onGetFomartLeftTime}] );
		assertEQ ( this.mm.params['setShowFlag2'], [PROGBAR_SHOWFLAG_CUSTOM] );
		assertEQ ( this.mm.params['setCustomValCaller2'], [{self:this.panel, caller:this.lc()._onGetFomartLeftTime}] );
	};
	
	this.test_show = function(){
		this.mm.mock(this.g, 'regUpdater');
		this.panel.show();
		assertEQ ( this.mm.params['regUpdater'], [this.panel, this.lc()._onUpdate, 1000] );
	};
	
	this.test_hide = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.panel.hide();
		assertEQ ( this.mm.params['unregUpdater'], [this.panel, this.lc()._onUpdate ] );
	};
	
	this.test_update = function(){
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.MEM},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:10,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), true );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.transferBtn.isEnable(), false );
		assertEQ ( this.items.modifyQQGroupBtn.isEnable(), false );
		assertEQ ( this.items.dismissBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.transferBtn.isEnable(), true );
		assertEQ ( this.items.modifyQQGroupBtn.isEnable(), true );
		assertEQ ( this.items.dismissBtn.isEnable(), true );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.MEM},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.inviteBtn.isEnable(), false );
		assertEQ ( this.items.agreeApplyBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.inviteBtn.isEnable(), true );
		assertEQ ( this.items.agreeApplyBtn.isEnable(), true );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.mergeBtn.isEnable(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.mergeBtn.isEnable(), true );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getCSS(this.items.upgradeBarContainer, 'display'), 'none');
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getCSS(this.items.upgradeBarContainer, 'display'), 'block');
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,transfer:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getCSS(this.items.transferBarContainer, 'display'), 'none');
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,transfer:{stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getCSS(this.items.transferBarContainer, 'display'), 'block');
		assertEQ ( TQ.getTextEx(this.items.transferOrDismissLbl), rstr.alli.main.lbl.transferBar );
		assertEQ ( this.items.dismissBtn.getText(), rstr.alli.main.btn.dismiss );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,transfer:{stopTime:0},dismiss:{stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getCSS(this.items.transferBarContainer, 'display'), 'block');
		assertEQ ( TQ.getTextEx(this.items.transferOrDismissLbl), rstr.alli.main.lbl.dismissBar );
		assertEQ ( this.items.dismissBtn.getText(), rstr.alli.main.btn.undismiss );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.modifyIntroduceBtn.isShow(), false );
		assertEQ ( this.items.modifyBulletinBtn.isShow(), false );
		
		cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.modifyIntroduceBtn.isShow(), true );
		assertEQ ( this.items.modifyBulletinBtn.isShow(), true );
		
		this.mm.mock(this.items.introduction, 'refresh:refresh1');
		this.mm.mock(this.items.bulletin, 'refresh:refresh2');
		
		this.g.setSvrTimeS(20);
		cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.mm.clear();
		cmd = {data:{mydetail:{name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:20,card:30,qqGroup:'123456',introduction:'<intro>',bulletin:'<bulletin>',upgrade:{startTime:10, stopTime:30},transfer:{startTime:15, stopTime:35}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getTextEx(this.items.name), 'alliance' );
		assertEQ ( TQ.getTextEx(this.items.cityName), ItemResUtil.findItemres(9900001).name );
		assertEQ ( TQ.getTextEx(this.items.alliFlag), 'F' );
		assertEQ ( TQ.getTextEx(this.items.rank), 1000 );
		assertEQ ( TQ.getTextEx(this.items.honour), 100 );
		assertEQ ( TQ.getTextEx(this.items.level), 1 );
		assertEQ ( TQ.getTextEx(this.items.leader), 'leader' );
		assertEQ ( TQ.getTextEx(this.items.mem), '10/' + res_alli_upd_needs[1-1].memmaxcount );
		assertEQ ( TQ.getTextEx(this.items.buildVal), 20 );
		assertEQ ( TQ.getTextEx(this.items.card), 30 );
		assertEQ ( TQ.getTextEx(this.items.qqGroup), '123456' );
		assertEQ ( TQ.getTextEx(this.items.introduction.getContainerObj()), '&lt;intro&gt;' );
		assertEQ ( TQ.getTextEx(this.items.bulletin.getContainerObj()), '&lt;bulletin&gt;' );
		assertEQ ( this.items.upgradeBar.getRange(), 30 - 10);
		assertEQ ( this.items.upgradeBar.getValue(0), 20 - 10);
		assertEQ ( this.items.transferOrDismissBar.getRange(), 35 - 15);
		assertEQ ( this.items.transferOrDismissBar.getValue(0), 20 - 15);
		assertEQ ( this.mm.walkLog, 'refresh1,refresh2' );
			
		cmd = {data:{mydetail:{name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:25100,card:35100,qqGroup:'123456',introduction:'<intro>',bulletin:'<bulletin>',upgrade:{startTime:10, stopTime:30},transfer:{startTime:15, stopTime:35}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( TQ.getTextEx(this.items.buildVal), '2万' );
		assertEQ ( TQ.getTextEx(this.items.card), '3万' );
			
		this.g.setSvrTimeS(40);
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeBar.getValue(0), 30 - 10);
		assertEQ ( this.items.transferOrDismissBar.getValue(0), 35 - 15);
	};
	
	this.test_honourTip = function(){
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',honour:10000}}};
		this.dlg.lc()._onSvrPkg(cmd);
		var tip = TTIP.getTipById(this.items.tooltips['$honour']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '10000' );
	};
	
	this.test_buildValTip = function(){
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',buildVal:20000}}};
		this.dlg.lc()._onSvrPkg(cmd);
		var tip = TTIP.getTipById(this.items.tooltips['$buildVal']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '20000' );
	};
	
	this.test_cardTip = function(){
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ELDER},mydetail:{name:'alliance',card:30000}}};
		this.dlg.lc()._onSvrPkg(cmd);
		var tip = TTIP.getTipById(this.items.tooltips['$card']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '30000' );
	};
	
	this.test__onUpdate = function(){
		this.g.setSvrTimeS(20);
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:20,card:30,qqGroup:'123456',introduction:'intro',bulletin:'bulletin',upgrade:{startTime:10, stopTime:30},transfer:{startTime:15, stopTime:35}}}};
		this.dlg.lc()._onSvrPkg(cmd);
			
		this.g.setSvrTimeS(21);
		this.lc()._onUpdate();
		assertEQ ( this.items.upgradeBar.getRange(), 30 - 10);
		assertEQ ( this.items.upgradeBar.getValue(0), 21 - 10);
		assertEQ ( this.items.transferOrDismissBar.getRange(), 35 - 15);
		assertEQ ( this.items.transferOrDismissBar.getValue(0), 21 - 15);
			
		this.items.upgradeBar.setRange(1);
		this.items.upgradeBar.setValue(0, 0);
		this.items.transferOrDismissBar.getRange(1);
		this.items.transferOrDismissBar.getValue(0, 0);	
			
		cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:20,card:30,qqGroup:'123456',introduction:'intro',bulletin:'bulletin',upgrade:{startTime:0, stopTime:0},transfer:{startTime:0, stopTime:0},dismiss:{startTime:10, stopTime:100}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onUpdate();
		assertEQ ( this.items.upgradeBar.getRange(), 1);
		assertEQ ( this.items.upgradeBar.getValue(0), 0);
		assertEQ ( this.items.transferOrDismissBar.getRange(), 100 - 10);
		assertEQ ( this.items.transferOrDismissBar.getValue(0), 21 - 10);
	};
	
	this.test__onClickUpgrade = function(){
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:0,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		assertEQ ( this.items.upgradeLevelBtn.isEnable(), true );	
		
		var nextLevel = cmd.data.mydetail.level + 1;
		var nextLevelIdx = nextLevel - 1;
		var nextRes = res_alli_upd_needs[nextLevelIdx];
		this.lc()._onClickUpgrade();
		assertEQ ( TestCaseSysTip.eqSystipStr( TQ.format(rstr.ids[100118].msg, nextRes.needbuildval) ), true );
		assertEQ ( this.g.getGUI().isShowMsgBox(), false);
		
		TestCaseSysTip.clearTip();
		cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER},mydetail:{name:'alliance',buildVal:10000,level:1,upgrade:{stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickUpgrade();
		assertEQ ( TestCaseSysTip.hasSystip (), false );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.main.tip.confirmUpgradeAlli );
		
		this.mm.mock(AllianceSender, 'sendUpgradeAlliance');
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendUpgradeAlliance'], [this.g] );
	};
	
	this.test__onClickTransfer = function(){
		this.mm.mock(UIM.getDlg('allitransfer'), 'openDlg:openDlg_allitransfer');
		this.mm.mock(UIM.getDlg('alliuntransfer'), 'openDlg:openDlg_alliuntransfer');
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:0, name:''}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickTransfer();
		assertEQ ( this.mm.walkLog, 'openDlg_allitransfer' );
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:100, name:'xxx'}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickTransfer();
		assertEQ ( this.mm.walkLog, 'openDlg_alliuntransfer' );
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:0, name:''},dismiss:{stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickTransfer();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.ids[100119].msg ), true, 'alliance is in dismissing state');
	};
	
	this.test__onClickMemList = function(){
		this.mm.mock(UIM.getDlg('selfallimemlist'), 'openDlg');
		this.lc()._onClickMemList();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onClickSubscribe = function(){
		this.mm.mock(UIM.getDlg('allisubscribe'), 'openDlg');
		this.lc()._onClickSubscribe();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onClickModifyQQ = function(){
		cmd = {data:{mydetail:{name:'alliance',qqGroup:'123456'}}};
		this.dlg.lc()._onSvrPkg(cmd);
			
		this.mm.mock(UIM.getDlg('inputnumex'), 'openDlg');
		this.mm.mock(UIM.getDlg('inputnumex'), 'setNumber');
		this.mm.mock(UIM.getDlg('inputnumex'), 'setCaller');
		this.lc()._onClickModifyQQ();
		assertEQ ( this.mm.params['openDlg'], [rstr.alli.main.lbl.inputQQGroup, 99999999999] );
		assertEQ ( this.mm.params['setNumber'], ['123456'] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onQQGroupCallBack}] );
	};
	
	this.test__onNewQQGroup = function(){
		this.mm.mock(AllianceSender, 'sendModifyQQGroup');
		this.lc()._onQQGroupCallBack('1234');
		assertEQ ( this.mm.params['sendModifyQQGroup'], [this.g, '1234'] );
	};
	
	this.test__onClickInvite = function(){
		this.mm.mock(UIM.getDlg('inputtext'), 'openDlg');
		this.mm.mock(UIM.getDlg('inputtext'), 'setCaller');
		this.lc()._onClickInvite();
		assertEQ ( this.mm.params['openDlg'], [rstr.alli.main.lbl.inputInviteName, JVALID.getMaxUserLen()] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onInviteCallBack}] );
	};
	
	this.test__onInviteCallBack = function(){
		this.mm.mock(AllianceSender, 'sendInvite');
		this.lc()._onInviteCallBack('abc');
		assertEQ ( this.mm.params['sendInvite'], [this.g, 'abc'] );
		assertEQ ( TestCaseSysTip.hasSystip(), false );
		
		this.mm.clear();
		this.lc()._onInviteCallBack('ab\'c');
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.ids[100050].msg ), true);
	};
	
	this.test__onClickAgreeApply= function(){
		this.mm.mock(UIM.getDlg('alliapplylist'), 'openDlg');
		this.lc()._onClickAgreeApply();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onClickEvent = function(){
		this.mm.mock(UIM.getDlg('allievents'), 'openDlg');
		this.lc()._onClickEvent();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onClickMerge = function(){
		this.mm.mock(UIM.getDlg('allimerge'), 'openDlg');
		this.lc()._onClickMerge();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onClickDismiss = function(){
		this.mm.mock(AllianceSender, 'sendDismiss');
		this.mm.mock(AllianceSender, 'sendCancelDismiss');
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:0},dismiss:{startTime:0, stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickDismiss();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.main.tip.confirmDismissAlli );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendDismiss'], [this.g] );
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:0},dismiss:{startTime:0, stopTime:1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickDismiss();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.main.tip.confirmUnDismissAlli );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendCancelDismiss'], [this.g] );
		
		this.mm.clear();
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:1},dismiss:{startTime:0, stopTime:0}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickDismiss();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.ids[100120].msg ), true, 'alliance is in transfering leader state');
	};
	
	this.test__onClickQuit = function(){
		this.mm.mock(AllianceSender, 'sendExitAlliance');
		
		this.mm.clear();
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickQuit();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.ids[100121].msg ), true, 'you are leader, first transfer leader to other');
		
		this.mm.clear();
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.ALEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.lc()._onClickQuit();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.main.tip.confirmExitAlli );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendExitAlliance'], [this.g] );
	};
	
	this.test__onClickModifyIntroduce = function(){
		var cmd = {data:{mydetail:{introduction:'&lt;intro&gt;'}}};
		this.dlg.lc()._onSvrPkg(cmd);
		
		this.mm.mock( UIM.getDlg('inputareatext'), 'openDlg' );
		this.mm.mock( UIM.getDlg('inputareatext'), 'setCaller' );
		this.lc()._onClickModifyIntroduce();
		assertEQ ( this.mm.params['openDlg'], [rstr.alli.main.lbl.modifyIntroduce, '<intro>', rstr.alli.main.lbl.introduceDesc, JVALID.getMaxAllianceIntroduceGBKBytes()] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onModifyIntroduceCallBack}] );
	};
	
	this.test__onModifyIntroduceCallBack = function(){
		var cmd = {data:{mydetail:{introduction:'&lt;intro&gt;'}}};
		this.dlg.lc()._onSvrPkg(cmd);
		
		this.mm.mock(AllianceSender, 'sendModifyIntroduce');
		this.lc()._onModifyIntroduceCallBack('<intro>');
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onModifyIntroduceCallBack('<intro>>');
		assertEQ ( this.mm.params['sendModifyIntroduce'], [this.g, '<intro>>'] );
	};
	
	this.test__onClickModifyBulletin = function(){
		var cmd = {data:{mydetail:{bulletin:'&lt;bulletin&gt;'}}};
		this.dlg.lc()._onSvrPkg(cmd);
		
		this.mm.mock( UIM.getDlg('inputareatext'), 'openDlg' );
		this.mm.mock( UIM.getDlg('inputareatext'), 'setCaller' );
		this.lc()._onClickModifyBulletin();
		assertEQ ( this.mm.params['openDlg'], [rstr.alli.main.lbl.modifyBulletin, '<bulletin>', rstr.alli.main.lbl.bulletinDesc, JVALID.getMaxAllianceBulletinGBKBytes()] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.panel, caller:this.lc()._onModifyBulletinCallBack}] );
	};
	
	this.test__onModifyBulletinCallBack = function(){
		var cmd = {data:{mydetail:{bulletin:'&lt;bulletin&gt;'}}};
		this.dlg.lc()._onSvrPkg(cmd);
		
		this.mm.mock(AllianceSender, 'sendModifyBulletin');
		this.lc()._onModifyBulletinCallBack('<bulletin>');
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onModifyBulletinCallBack('<bulletin>>');
		assertEQ ( this.mm.params['sendModifyBulletin'], [this.g, '<bulletin>>'] );
	};
	
	this.test__onGetFomartLeftTime = function(){
		assertEQ ( this.lc()._onGetFomartLeftTime(10,30), '00:00:20' );
		assertEQ ( this.lc()._onGetFomartLeftTime(20,30), '00:00:10' );
		assertEQ ( this.lc()._onGetFomartLeftTime(30,30), '00:00:00' );
	};
});

TestCaseAlliMainLawLightPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMainDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.lc().m_items.tablist.getTabItems(1);
		this.panel = this.dlg.lc().m_lawLightPanel;
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.items.getResBtn, 'setCaller:setCaller1');
		this.mm.mock(this.items.upgradeBtn, 'setCaller:setCaller2');
		this.mm.mock(this.items.bestowBtn, 'setCaller:setCaller3');
		this.mm.mock(this.items.feedBtn, 'setCaller:setCaller4');
		this.mm.mock(this.items.feedAllBtn, 'setCaller:setCaller5');
		this.mm.mock(TTIP, 'setCallerData');
		
		this.panel.init(this.g, this.items);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panel );
		assertEQ ( this.lc().m_items, this.items );
		assertEQ ( this.mm.params['setCaller1'], [{self:this.panel, caller:this.lc()._onClickGetResBtn}] );
		assertEQ ( this.mm.params['setCaller2'], [{self:this.panel, caller:this.lc()._onClickUpgradeBtn}] );
		assertEQ ( this.mm.params['setCaller3'], [{self:this.panel, caller:this.lc()._onClickBestowBtn}] );
		assertEQ ( this.mm.params['setCaller4'], [{self:this.panel, caller:this.lc()._onClickFeedBtn}] );
		assertEQ ( this.mm.params['setCaller5'], [{self:this.panel, caller:this.lc()._onClickFeedAllBtn}] );
		assertEQ ( this.mm.params['setCallerData'], [this.lc().m_items.tooltips['$upgradeBtnTip'], {self:this.panel, caller:this.lc()._onGetUpgradeBtnTip},{}] );
	};
	
	this.test_update = function(){
		this.g.setSvrTimeS(1369732734 + 3600*1);
		var cmd = {data:{selfmem:{gainGift:{lastTime:1369732734}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.getResBtn.isEnable(), false );
		
		this.g.setSvrTimeS(1369732734 + 3600*24);
		this.panel.update();
		assertEQ ( this.items.getResBtn.isEnable(), true );
		
		var nextLevel = 1 + 1;
		var nextLevelIdx = nextLevel - 1;
		var nextLevelRes = res_alli_lawlight_upd[nextLevelIdx];
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},lawlight:{level:1},mydetail:{buildVal:nextLevelRes.needbuildval-1, card:nextLevelRes.needcard}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isEnable(), false );
		
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},lawlight:{level:1},mydetail:{buildVal:nextLevelRes.needbuildval, card:nextLevelRes.needcard-1}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isEnable(), false );
		
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},lawlight:{level:1},mydetail:{buildVal:nextLevelRes.needbuildval, card:nextLevelRes.needcard}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isEnable(), true );
		
		var cmd = {data:{lawlight:{level:5},selfmem:{alliPos:ALLI_POS.LEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isShow(),  false );
		
		var cmd = {data:{lawlight:{level:1},selfmem:{alliPos:ALLI_POS.ALEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isShow(),  false );
		
		var cmd = {data:{lawlight:{level:1},selfmem:{alliPos:ALLI_POS.LEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.upgradeBtn.isShow(),  true );
		
		var levelRes = res_alli_lawlight_upd[1-1];
		var cmd = {data:{lawlight:{level:1, growup:{val:levelRes.maxgrowupval-1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.bestowBtn.isEnable(),  false );
		
		var levelRes = res_alli_lawlight_upd[1-1];
		var cmd = {data:{lawlight:{level:1, growup:{val:levelRes.maxgrowupval}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.bestowBtn.isEnable(),  true );
		
		var cmd = {data:{lawlight:{level:1},selfmem:{alliPos:ALLI_POS.ALEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.bestowBtn.isShow(),  false );
		
		var cmd = {data:{lawlight:{level:1},selfmem:{alliPos:ALLI_POS.LEADER}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.bestowBtn.isShow(),  true );
		
		this.g.setSvrTimeS(1369732734 + 3600*1);
		var levelRes = res_alli_lawlight_upd[1-1];
		var cmd = {data:{lawlight:{level:1},selfmem:{feed:{lastTime:1369732734, count:levelRes.maxfeedtimes}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.feedBtn.isEnable(),  false );
		assertEQ ( this.items.feedAllBtn.isEnable(),  false );
		
		var cmd = {data:{lawlight:{level:1},selfmem:{feed:{lastTime:1369732734, count:levelRes.maxfeedtimes-1}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.feedBtn.isEnable(),  true );
		assertEQ ( this.items.feedAllBtn.isEnable(),  true );

		this.g.setSvrTimeS(1369732734 + 3600*24);
		var cmd = {data:{lawlight:{level:1},selfmem:{feed:{lastTime:1369732734, count:levelRes.maxfeedtimes}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( this.items.feedBtn.isEnable(),  true );
		assertEQ ( this.items.feedAllBtn.isEnable(),  true );
		
		this.g.setSvrTimeS(1369732734 + 3600*1);
		var levelAlliRes = res_alli_upd_needs[1-1];
		var levelLawLightRes = res_alli_lawlight_upd[2-1];
		var cmd = {data:{selfmem:{contributes:10000,feed:{lastTime:1369732734, count:1}},mydetail:{level:1},lawlight:{level:2,growup:{val:100}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		assertEQ ( TQ.getTextEx(this.lc().m_items.canGetMoney), levelAlliRes.getmoney );
		assertEQ ( TQ.getTextEx(this.lc().m_items.canGetHeroExp), levelAlliRes.getheroexp );
		assertEQ ( TQ.getTextEx(this.lc().m_items.getResNeedContributes), levelAlliRes.expendcontribute );
		assertEQ ( TQ.getTextEx(this.lc().m_items.totalContributes), 10000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.addFoodOutput), '+5%' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.addWoodOutput), '+5%' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.addStoneOutput), '+5%' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.addIronOutput), '+5%' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.addMoneyOutput), '+5%' );
		assertEQ ( this.lc().m_items.growupBar.getRange(), levelLawLightRes.maxgrowupval );
		assertEQ ( this.lc().m_items.growupBar.getValue(0), 100 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.todayLeftTime), levelLawLightRes.maxfeedtimes - 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.feedNeedContributes), levelLawLightRes.feedneedcontributes );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.lawLightIcon), 'alli/lawlight/icon/2.jpg'), true );
		
		// when player is vip 
		this.g.setSvrTimeS(1369732734 + 3600*1 + 1);
		this.g.getImgr().getRoleRes().vip = 3;
		this.panel.update();
		assertEQ ( TQ.getTextEx(this.lc().m_items.todayLeftTime), levelLawLightRes.maxfeedtimes + 1 - 1 );
	};
	
	this.test__onClickGetResBtn = function(){
		this.mm.mock(AllianceSender, 'sendGainTodayGift');
		this.lc()._onClickGetResBtn();
		assertEQ ( this.mm.params['sendGainTodayGift'], [this.g] );
	};
	
	this.test__onClickUpgradeBtn = function(){
		this.mm.mock(AllianceSender, 'sendUpgradeLawLight');
		var nextLevelRes = res_alli_lawlight_upd[1+1-1];
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{buildVal:10000,card:5000},lawlight:{level:1,growup:{val:100}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		this.panel.update();
		this.lc()._onClickUpgradeBtn();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		var s = TQ.format(rstr.alli.main.lawLight.tip.upgradeNeed, 
			COLORS.ENOUGH_ITEM, nextLevelRes.needbuildval, 10000
			,COLORS.ENOUGH_ITEM, nextLevelRes.needcard, 5000 );
		var tipmsg = s + rstr.alli.main.lawLight.tip.confirmUpgrade;
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), tipmsg );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendUpgradeLawLight'], [this.g] );
	};
	
	this.test__onClickBestowBtn = function(){
		this.mm.mock(AllianceSender, 'sendLawLightBestow');
		this.lc()._onClickBestowBtn();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.main.lawLight.tip.confirmBestow );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendLawLightBestow'], [this.g] );
	};
	
	this.test__onClickFeedBtn = function(){
		this.mm.mock(AllianceSender, 'sendLawLightFeed');
		this.lc()._onClickFeedBtn();
		assertEQ ( this.mm.params['sendLawLightFeed'], [this.g] );
	};
	
	this.test__onClickFeedAllBtn = function(){
		this.mm.mock(AllianceSender, 'sendLawLightFeedAll');
		this.lc()._onClickFeedAllBtn();
		assertEQ ( this.mm.params['sendLawLightFeedAll'], [this.g] );
	};
	
	this.test__onGetUpgradeBtnTip = function(){
		var nextLevelRes = res_alli_lawlight_upd[1+1-1];
		var cmd = {data:{selfmem:{alliPos:ALLI_POS.LEADER},mydetail:{buildVal:2,card:1},lawlight:{level:1,growup:{val:100}}}};
		this.dlg.lc()._onSvrPkg(cmd);
		var s = TQ.format(rstr.alli.main.lawLight.tip.upgradeNeed, 
			COLORS.NO_ENOUGH_ITEM, nextLevelRes.needbuildval, 2
			,COLORS.NO_ENOUGH_ITEM, nextLevelRes.needcard, 1 );
		assertEQ ( this.lc()._onGetUpgradeBtnTip(), s );
	};
});

TestCaseAlliMainAuctionPanel  = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMainDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.lc().m_items.tablist.getTabItems(2);
		this.panel = this.dlg.lc().m_auctionPanel;
		this.cmd = {auction:{items:[{id:1,resid:2500001,num:10,ismy:0,isboss:0,owner:'role1',auction:100,fixed:200,stopTime:1405218000 + 2*3600 - 1},{id:2,resid:3000267,num:11,ismy:1,isboss:1,owner:'',auction:110,fixed:120,stopTime:1405218000 + 2*3600},{id:3,resid:5000042,num:12,ismy:1,isboss:0,owner:'role3',auction:240,fixed:250,stopTime:1405218000 + 6*3600},{id:4,resid:5000042,num:12,ismy:0,isboss:0,owner:'myrole',auction:240,fixed:300,stopTime:1405218000 + 6*3600}]}};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_paimaiTabsText = function(){
		assertEQ ( this.items.paimaiTabs.getTabCount(), 5 );
		assertEQ ( this.items.paimaiTabs.getTabText(0), rstr.alli.main.paimaiTabs[0]);
		assertEQ ( this.items.paimaiTabs.getTabText(1), rstr.alli.main.paimaiTabs[1]);
		assertEQ ( this.items.paimaiTabs.getTabText(2), rstr.alli.main.paimaiTabs[2]);
		assertEQ ( this.items.paimaiTabs.getTabText(3), rstr.alli.main.paimaiTabs[3]);
		assertEQ ( this.items.paimaiTabs.getTabText(4), rstr.alli.main.paimaiTabs[4]);
	};
	
	this.test_selectLastTabWhenShow = function(){
		this.panel.show();
		assertEQ ( this.items.paimaiTabs.getActiveTab(), 4 );
		
		this.items.paimaiTabs.activeTab(0);
		this.panel.show();
		assertEQ ( this.items.paimaiTabs.getActiveTab(), 4 );
	};
	
	this.test_sendGetAuctionInfoWhenShow = function(){
		this.mm.mock(AllianceSender, 'sendGetAuctionInfo');
		this.panel.show();
		assertEQ ( this.mm.params['sendGetAuctionInfo'], [this.g]);
	};
	
	this.test_myContribution = function(){
		var cmd = {selfmem:{contributes:20000}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:cmd});
		this.panel.update();
		assertEQ ( TQ.getTextEx(this.items.myContribution), 20000 );
	};
	
	this.test_mySellBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.items.mySellBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['allimysell'] );
	};
	
	this.test_paimaiTabsList = function(){
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		
		// all items
		var items0 = this.items.paimaiTabs.getTabItems(0);
		assertEQ ( items0.list.getCount(), 4 );
		var item0 = items0.list.getItem(0);
		var item1 = items0.list.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.itemName), ItemResUtil.findItemres(2500001).name);
		assertEQ ( TQ.getTextEx(item0.exsubs.itemNumber), 10);
		assertEQ ( item0.exsubs.owner.getText(), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.auctionPrice), 100);
		assertEQ ( TQ.getTextEx(item0.exsubs.fixedPrice), 200);
		assertEQ ( TQ.getTextEx(item0.exsubs.leftTime), rstr.alli.main.lbl.leftTimeNames[1] );
		
		assertEQ ( TQ.getTextEx(item1.exsubs.auctionPrice), 110);
		assertEQ ( TQ.getTextEx(item1.exsubs.fixedPrice), 120);
		assertEQ ( TQ.getTextEx(item1.exsubs.leftTime), rstr.alli.main.lbl.leftTimeNames[2] );
		
		// arm items
		var items1 = this.items.paimaiTabs.getTabItems(1);
		assertEQ ( items1.list.getCount(), 1 );
		var item0 = items1.list.getItem(0);
		assertEQ ( item0.exsubs.owner.getText(), 'role1' );
		
		// can use items
		var items2 = this.items.paimaiTabs.getTabItems(2);
		assertEQ ( items2.list.getCount(), 1 );
		var item0 = items2.list.getItem(0);
		assertEQ ( item0.exsubs.owner.getText(), '世界BOSS掉落' );
		
		// other items
		var items3 = this.items.paimaiTabs.getTabItems(3);
		assertEQ ( items3.list.getCount(), 2 );
		var item0 = items3.list.getItem(0);
		assertEQ ( item0.exsubs.owner.getText(), 'role3' );
		var item1 = items3.list.getItem(1);
		assertEQ ( item1.exsubs.owner.getText(), 'myrole' );
		
		// my auction items
		var items4 = this.items.paimaiTabs.getTabItems(4);
		assertEQ ( items4.list.getCount(), 2 );
		var item0 = items4.list.getItem(0);
		var item1 = items4.list.getItem(1);
		assertEQ ( item0.exsubs.owner.getText(), '世界BOSS掉落' );
		assertEQ ( item1.exsubs.owner.getText(), 'role3' );
		assertEQ ( item0.exsubs.auctionBuyBtn.isShow(), false );		
		assertEQ ( item1.exsubs.auctionBuyBtn.isShow(), false );		
	};
	
	this.test_itemTip = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		var ritems = this.g.getImgr().getMyAlliance().getAuctionItems();
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$item']);
		tip.getTip(); 
		assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(SysItemMaker.make(0, ritems[0].itemres), 'sys'));
	};
	
	this.test_clickRoleName = function(){
		this.mm.mock(OutFieldSender, 'sendGetFieldDetailByRole');
		this.g.setSvrTimeS(1405218000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		item0.exsubs.owner.click();
		assertEQ ( this.mm.params['sendGetFieldDetailByRole'], [this.g, 'role1'] );
	};
	
	this.test_clickRoleOwnerName = function(){
		this.mm.mock(OutFieldSender, 'sendGetFieldDetailByRole');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		item0.exsubs.owner.click();
		assertEQ ( this.mm.params['sendGetFieldDetailByRole'], [this.g, 'role1'] );
	};
	
	this.test_clickBossOwnerName = function(){
		this.mm.mock(UIM, 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item1 = items0.list.getItem(1);
		item1.exsubs.owner.click();
		assertEQ ( this.mm.params['openDlg'], ['worldboss'] );
	};
	
	this.test_clickAuctionBuyBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.cmd.auction.items[2].ismy = 0;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		var item1 = items0.list.getItem(1);
		var item2 = items0.list.getItem(2);
		var item3 = items0.list.getItem(3);
		
		// is my auctioning
		item1.exsubs.auctionBuyBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.main.tip.isMyAuctionItem] );
		
		// comm 
		this.mm.clear();
		var ritems = this.g.getImgr().getMyAlliance().getAuctionItems();
		item0.exsubs.auctionBuyBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['alliauctionbuy', {type:'auction', item:ritems[0]}] );
		
		// will beyond fixed price
		this.mm.clear();
		item2.exsubs.auctionBuyBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.main.tip.beyondFixedPrice] );
		
		// my is seller
		this.mm.clear();
		this.g.getImgr().getRoleRes().name = 'myrole';
		item3.exsubs.auctionBuyBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.main.tip.myIsSeller] );
	};
	
	this.test_clickFixedBuyBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:this.cmd});
		var items0 = this.items.paimaiTabs.getTabItems(0);
		var item0 = items0.list.getItem(0);
		var item3 = items0.list.getItem(3);
		item0.exsubs.fixedBuyBtn.click();
		var ritems = this.g.getImgr().getMyAlliance().getAuctionItems();
		assertEQ ( this.mm.params['openDlg'], ['alliauctionbuy', {type:'fixed', item:ritems[0]}] );
		
		// my is seller
		this.mm.clear();
		this.g.getImgr().getRoleRes().name = 'myrole';
		item3.exsubs.auctionBuyBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.alli.main.tip.myIsSeller] );
	};
});

TestCaseAlliTransferDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliTransferDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.transferdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.transferdlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.confirmBtn, 'setCaller:confirmBtnSetCaller');
		this.mm.mock(this.lc().m_items.cancelBtn, 'setCaller:cancelBtnSetCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['confirmBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickConfirmBtn}] );
		assertEQ ( this.mm.params['cancelBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickCancelBtn}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.lc().m_items.names.addItem({text:'1'});
		this.lc().m_items.names.addItem({text:'2'});
		this.mm.mock(AllianceSender, 'sendGetALeaders');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetALeaders'], [this.g]);
		assertEQ ( this.lc().m_items.names.getTitle(), rstr.alli.transferdlg.lbl.dropTitle);
		assertEQ ( this.lc().m_items.names.getCount(), 0);
		assertEQ ( this.lc().m_items.names.getCurSel(), -1);
		
	};
	
	this.test__onClickConfirmBtn = function(){
		this.mm.mock(AllianceSender, 'sendTransferLeader');
		this.lc().m_items.names.addItem({text:'name1'});
		this.lc().m_items.names.addItem({text:'name2'});
		this.lc().m_items.names.setCurSel(-1);
		this.lc()._onClickConfirmBtn();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.transferdlg.tip.selectTransferTarget ), true);
		
		TestCaseSysTip.clearTip();
		this.lc().m_items.names.setCurSel(0);
		this.lc()._onClickConfirmBtn();
		assertEQ ( TestCaseSysTip.hasSystip(), false );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), TQ.format(rstr.alli.transferdlg.tip.confirmTransfer, 'name1') );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendTransferLeader'], [this.g, 'name1'] );		
	};
	
	this.test__onClickCancelBtn = function(){
		this.lc().m_dlg.show();
		this.lc()._onClickCancelBtn();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__onSvrPkg = function(){
		this.lc().m_dlg.hide();
		var cmd = {data:{aleaders:['name1','name2','name3']}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.names.getCount(), 0);
		
		this.lc().m_dlg.show();
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.names.getCount(), 0);
		
		var cmd = {data:{aleaders:['name1','name2','name3']}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.names.getCount(), 3);
		assertEQ ( this.lc().m_items.names.getItemText(0), 'name1');
		assertEQ ( this.lc().m_items.names.getItemText(1), 'name2');
		assertEQ ( this.lc().m_items.names.getItemText(2), 'name3');
		
		var cmd = {data:{aleaders:['name1','name2','name3']}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_items.names.getCount(), 3);
	};
});

TestCaseAlliUnTransferDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliUnTransferDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.untransferdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.untransferdlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.stopTransferBtn, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onStopTransferBtn}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
	};
	
	this.test__initInfo = function(){
		this.g.setSvrTimeS(10);
		var cmd = {data:{mydetail:{transfer:{startTime:0, stopTime:20, name:'name1'}}}};
		AlliMainDlg.snew(this.g).lc()._onSvrPkg(cmd);
		
		this.lc()._initInfo();
		assertEQ ( TQ.getTextEx(this.lc().m_items.name), TQ.format(rstr.alli.untransferdlg.lbl.newname, 'name1') );
		assertEQ ( TQ.getTextEx(this.lc().m_items.leftTime), TQ.format(rstr.alli.untransferdlg.lbl.lefttime, '00:00:10') );
	};
	
	this.test__onStopTransferBtn = function(){
		this.mm.mock(AllianceSender, 'sendStopTransfer');
		this.lc()._onStopTransferBtn();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.untransferdlg.tip.stopTransfer );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendStopTransfer'], [this.g] );	
	};
});

TestCaseAlliSubscribeDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliSubscribeDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		FIXID.ALLI_CARD = 200001;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.CITYRES, 0, this.dlg, this.lc()._onCityResChange] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.SELFALLIMEM_CHANGE, 0, this.dlg, this.lc()._onSelfAllMemChange] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.PKG_CHANGE, 0, this.dlg, this.lc()._onItemsChange] );
		assertEQ ( this.mm.params['regEvent.3'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_initContributesOperateList');
		this.mm.mock(this.lc(), '_initPreviewTabListTitleText');
		this.mm.mock(this.lc(), '_setCallers');
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_initContributesOperateList,_initPreviewTabListTitleText,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.subscribedlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.subscribedlg, this.lc().m_items] ); 
	};
	
	this.test__initContributesOperateList = function(){
		this.lc()._initContributesOperateList();
		var list = this.lc().m_items.list;
		assertEQ ( list.getCount(), 5 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.resName), rstr.comm.food );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.resName), rstr.comm.wood );
		assertEQ ( TQ.getTextEx(list.getItem(2).exsubs.resName), rstr.comm.stone );
		assertEQ ( TQ.getTextEx(list.getItem(3).exsubs.resName), rstr.comm.iron );
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.resName), rstr.comm.card );
		
		assertEQ ( list.getItem(0).exsubs.buyBtn.isShow(), false );
		assertEQ ( list.getItem(3).exsubs.buyBtn.isShow(), false );
		assertEQ ( list.getItem(4).exsubs.buyBtn.isShow(), true );
	};
	
	this.test__initPreviewTabListTitleText = function(){
		this.lc()._initPreviewTabListTitleText();
		assertEQ ( this.lc().m_items.tablist.getTabText(0), rstr.alli.subscribedlg.tabs[0]);
		assertEQ ( this.lc().m_items.tablist.getTabText(1), rstr.alli.subscribedlg.tabs[1]);
	};
	
	this.test__setCallers = function(){
		var list = this.lc().m_items.list;
		this.mm.mock(list.getItem(0).exsubs.contributeBtn, 'setCaller:setCaller0');
		this.mm.mock(list.getItem(4).exsubs.contributeBtn, 'setCaller:setCaller4');
		this.mm.mock(list.getItem(4).exsubs.buyBtn, 'setCaller:buyBtnSetCaller');
		
		var tablist = this.lc().m_items.tablist;
		this.mm.mock(tablist.getTabItems(0).pageBar, 'setCaller:pageBarSetCaller0');
		this.mm.mock(tablist.getTabItems(1).pageBar, 'setCaller:pageBarSetCaller1');
		
		this.lc()._setCallers();
		
		assertEQ ( list.getItem(0).exsubs.inum.getId(), 0 );
		assertEQ ( list.getItem(4).exsubs.inum.getId(), 4 );
		assertEQ ( list.getItem(0).exsubs.inum.getLimit(), this.lc()._onGetResNumberLimit );
		assertEQ ( list.getItem(4).exsubs.inum.getLimit(), this.lc()._onGetResNumberLimit );
		
		assertEQ ( list.getItem(0).exsubs.contributeBtn.getId(), 0 );
		assertEQ ( list.getItem(4).exsubs.contributeBtn.getId(), 4 );
		assertEQ ( this.mm.params['setCaller0'], [{self:this.dlg, caller:this.lc()._onClickContributeBtn}] );
		assertEQ ( this.mm.params['setCaller4'], [{self:this.dlg, caller:this.lc()._onClickContributeBtn}] );
		assertEQ ( this.mm.params['buyBtnSetCaller'], [{self:this.dlg, caller:this.lc()._onClickBuyBtn}] );
		
		assertEQ ( tablist.getTabItems(0).pageBar.getId(), 0 );
		assertEQ ( tablist.getTabItems(1).pageBar.getId(), 1 );
		assertEQ ( this.mm.params['pageBarSetCaller0'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
		assertEQ ( this.mm.params['pageBarSetCaller1'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
	};
	
	this.test__initInfo = function(){
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.ALLI_CARD,num:6}, food:10000, wood:20001, stone:30001, iron:40001});
			
		var tablist = this.lc().m_items.tablist;
		this.mm.mock(tablist.getTabItems(0).pageBar, 'activePage:activePage0');
		this.mm.mock(tablist.getTabItems(1).pageBar, 'activePage:activePage1');
		
		this.lc()._initInfo();
		assertEQ ( tablist.getActiveTab(), 0);
		assertEQ ( this.mm.params['activePage0'], [1, true]);
		assertEQ ( this.mm.params['activePage1'], [1, true]);
		
		var list = this.lc().m_items.list;
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHas, rstr.comm.food, 1) );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHas, rstr.comm.wood, 2) );
		assertEQ ( TQ.getTextEx(list.getItem(2).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHas, rstr.comm.stone, 3) );
		assertEQ ( TQ.getTextEx(list.getItem(3).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHas, rstr.comm.iron, 4) );
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, rstr.comm.card, 6) );
		assertEQ ( TQ.getTextEx(list.getItem(3).exsubs.unitName), rstr.alli.subscribedlg.lbl.wan );
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.unitName), rstr.alli.subscribedlg.lbl.oneUnit );
		
		var myContributes = this.g.getImgr().getMyAlliance().getSelfMember().getContributes();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myContributes),  myContributes);
	};
	
	this.test__onGetResNumberLimit = function(){
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.ALLI_CARD,num:6}, food:10000, wood:20001, stone:999, iron:40001 });
		assertEQ ( this.lc()._onGetResNumberLimit(0), {min:0, max:1} );
		assertEQ ( this.lc()._onGetResNumberLimit(1), {min:0, max:2} );
		assertEQ ( this.lc()._onGetResNumberLimit(2), {min:0, max:0} );
		assertEQ ( this.lc()._onGetResNumberLimit(3), {min:0, max:4} );
		assertEQ ( this.lc()._onGetResNumberLimit(4), {min:0, max:6} );
	};
	
	this.test__onClickContributeBtn = function(){
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.ALLI_CARD,num:6}, food:10000, wood:20001, stone:30001, iron:40001});
		
		var tablist = this.lc().m_items.tablist;
		tablist.getTabItems(0).pageBar.setPageCnt(2);
		tablist.getTabItems(0).pageBar.activePage(1);
		tablist.getTabItems(1).pageBar.setPageCnt(2);
		tablist.getTabItems(1).pageBar.activePage(2);
		
		this.mm.mock(AllianceSender, 'sendContributeRes');
		this.mm.mock(AllianceSender, 'sendGetTodaySortMems');
		this.mm.mock(AllianceSender, 'sendGetAllSortMems');
		var list = this.lc().m_items.list;
		list.getItem(0).exsubs.inum.setVal(0);
		list.getItem(1).exsubs.inum.setVal(1);
		
		list.getItem(0).exsubs.contributeBtn.click();
		assertEQ ( this.mm.walkLog, '' );
		
		list.getItem(1).exsubs.contributeBtn.click();
		assertEQ ( this.mm.params['sendContributeRes'], [this.g, 1, 1] );
		assertEQ ( this.mm.params['sendGetTodaySortMems'], [this.g, 1] );
		assertEQ ( this.mm.params['sendGetAllSortMems'], [this.g, 2] );
	};
	
	this.test__onClickBuyBtn = function(){
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg');
		this.lc()._onClickBuyBtn();
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:FIXID.ALLI_CARD, number:100000}] );
	};
	
	this.test__onPageNavigate = function(){
		this.mm.mock(AllianceSender, 'sendGetTodaySortMems');
		this.mm.mock(AllianceSender, 'sendGetAllSortMems');
		
		var pageNo = 1;
		this.lc()._onPageNavigate(pageNo, 0);
		assertEQ ( this.mm.walkLog, 'sendGetTodaySortMems' );
		assertEQ ( this.mm.params['sendGetTodaySortMems'], [this.g, pageNo] );
		
		this.mm.clear();
		this.lc()._onPageNavigate(pageNo, 1);
		assertEQ ( this.mm.walkLog, 'sendGetAllSortMems' );
		assertEQ ( this.mm.params['sendGetAllSortMems'], [this.g, pageNo] );
	};
	
	this.test__onCityResChange = function(){
		var list = this.lc().m_items.list;
		var last_str = TQ.getTextEx(list.getItem(0).exsubs.curHas);
		var back_dlg = this.lc().m_dlg;
		
		TestCaseCondition.setPreCond(null, {food:30000});
		
		this.lc().m_dlg = null;
		this.lc()._onCityResChange();
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.curHas), last_str );
		
		this.lc().m_dlg = back_dlg;
		this.lc().m_dlg.hide();
		this.lc()._onCityResChange();
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.curHas), last_str );
		
		this.lc().m_dlg.show();
		this.lc()._onCityResChange();
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHas, rstr.comm.food, 3) );
	};
	
	this.test__onSelfAllMemChange = function(){
		this.g.getImgr().getMyAlliance().copySelfMember({contributes:200});
		
		this.lc().m_dlg.hide();
		this.lc()._onSelfAllMemChange();
		assertNotEQ ( TQ.getTextEx(this.lc().m_items.myContributes),  200);
		
		this.lc().m_dlg.show();
		this.lc()._onSelfAllMemChange();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myContributes),  200);
	};
	
	this.test__onItemsChange = function(){
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.ALLI_CARD,num:10}});
		
		var list = this.lc().m_items.list;
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, rstr.comm.card, 0) );
		
		this.lc().m_dlg.hide();
		this.lc()._onItemsChange();
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, rstr.comm.card, 0) );
		
		this.lc().m_dlg.show();
		this.lc()._onItemsChange();
		assertEQ ( TQ.getTextEx(list.getItem(4).exsubs.curHas), TQ.format(rstr.alli.subscribedlg.lbl.curHasCard, rstr.comm.card, 10) );
	};
	
	this.test__onSvrPkg = function(){
		var cmd = {data:{todaysortmems:[
			 { name:'role1',todayRes:10,todayCard:100}
			,{ name:'role2',todayRes:20,todayCard:200}
			,{ name:'role3',todayRes:30,todayCard:300}
			],pageCount:2,pageNo:1}};
			
		var back_dlg = this.lc().m_dlg;
		this.lc().m_dlg = null;
		this.lc()._onSvrPkg(cmd);
		var todayTab = this.lc().m_items.tablist.getTabItems(0);
		assertEQ ( todayTab.list.getCount(), 0 );

		this.lc().m_dlg = back_dlg;
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg({data:{}});
		assertEQ ( todayTab.list.getCount(), 0 );
			
		this.mm.mock(todayTab.pageBar, 'activePage');
		this.lc()._onSvrPkg(cmd);
		assertEQ ( todayTab.list.getCount(), 3 );
		assertEQ ( todayTab.pageBar.getPageCnt(), 2 );
		assertEQ ( this.mm.params['activePage'], [1, false , true] );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(0).exsubs.rank), 1 );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(0).exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(0).exsubs.res), 10 + rstr.alli.subscribedlg.lbl.wan);
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(0).exsubs.card), 100 );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(1).exsubs.rank), 2 );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(1).exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(1).exsubs.res), 20 + rstr.alli.subscribedlg.lbl.wan );
		assertEQ ( TQ.getTextEx(todayTab.list.getItem(1).exsubs.card), 200 );
			
		var cmd = {data:{allsortmems:[
			 {name:'role1',totalRes:100,totalCard:1000}
			,{name:'role2',totalRes:200,totalCard:2000}
			],pageCount:10,pageNo:2}};
		var allSortTab = this.lc().m_items.tablist.getTabItems(1);
		this.mm.mock(allSortTab.pageBar, 'activePage');
		this.lc()._onSvrPkg(cmd);
		assertEQ ( allSortTab.list.getCount(), 2 );
		assertEQ ( allSortTab.pageBar.getPageCnt(), 10 );
		assertEQ ( this.mm.params['activePage'], [2, false , true] );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(0).exsubs.rank), 13 );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(0).exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(0).exsubs.res), 100 + rstr.alli.subscribedlg.lbl.wan );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(0).exsubs.card), 1000 );
			
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(1).exsubs.rank), 14 );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(1).exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(1).exsubs.res), 200 + rstr.alli.subscribedlg.lbl.wan );
		assertEQ ( TQ.getTextEx(allSortTab.list.getItem(1).exsubs.card), 2000 );
	};
});

TestCaseAlliMemInfoDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.member = {name:'role', alliPos:1, level:10, roleRank:1, buildCurVal:1000, contributes:2000, gridId:601, icon:101};
		this.dlg = AlliMemInfoDlg.snew(this.g);
		this.dlg.openDlg(this.member);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(this.member);
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.meminfodlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.meminfodlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.appointBtn, 'setCaller:appointSetCaller');
		this.mm.mock(this.lc().m_items.fireBtn, 'setCaller:fireSetCaller');
		this.mm.mock(this.lc().m_items.chatBtn, 'setCaller:chatSetCaller');
		this.mm.mock(this.lc().m_items.mailBtn, 'setCaller:mailSetCaller');
		this.mm.mock(this.lc().m_items.friendBtn, 'setCaller:friendSetCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['appointSetCaller'], [{self:this.dlg, caller:this.lc()._onClickAppoint}] );
		assertEQ ( this.mm.params['fireSetCaller'], [{self:this.dlg, caller:this.lc()._onClickFire}] );
		assertEQ ( this.mm.params['chatSetCaller'], [{self:this.dlg, caller:this.lc()._onClickChat}] );
		assertEQ ( this.mm.params['mailSetCaller'], [{self:this.dlg, caller:this.lc()._onClickMail}] );
		assertEQ ( this.mm.params['friendSetCaller'], [{self:this.dlg, caller:this.lc()._onClickFriend}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );				
	};
	
	this.test__initInfo = function(){
		AlliMainDlg.snew(this.g);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.LEADER}, mydetail:{name:'alliance'}}});
		
		this.lc().m_items.alliPosDropList.setTitle('--');
		
		this.lc()._initInfo();
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.icon), '101' ), true );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.name ), 'role' );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.alliName ), 'alliance' );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.alliPos ), rstr.alli.alliposs[this.member.alliPos] );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.level ), 10 );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.roleRank ), 1 );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.buildCurVal ), 1000 );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.contributes ), 2000 );
		assertEQ ( TQ.getTextEx ( this.lc().m_items.cood ), HyperLinkMgr.formatLink('#[m:0:1]') );
		assertEQ ( this.lc().m_items.alliPosDropList.getCount(), 3 );
		assertEQ ( this.lc().m_items.alliPosDropList.getItemText(0), rstr.alli.alliposs[3] );
		assertEQ ( this.lc().m_items.alliPosDropList.getItemText(1), rstr.alli.alliposs[2] );
		assertEQ ( this.lc().m_items.alliPosDropList.getItemText(2), rstr.alli.alliposs[1] );
		assertEQ ( this.lc().m_items.alliPosDropList.getCurSel(), 2 );
		assertEQ ( this.lc().m_items.alliPosDropList.getTitle(), rstr.alli.alliposs[1] );
		
		assertEQ ( TQ.getCSS(this.lc().m_items.appointContainer, 'display'), 'block');
		assertEQ ( this.lc().m_items.fireBtn.isShow(), true );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.ALEADER}}});
		this.lc()._initInfo();
		assertEQ ( TQ.getCSS(this.lc().m_items.appointContainer, 'display'), 'block');
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.ELDER}}});
		this.lc()._initInfo();
		assertEQ ( TQ.getCSS(this.lc().m_items.appointContainer, 'display'), 'none');
		
		this.member.alliPos = ALLI_POS.ALEADER;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.ALEADER}}});
		this.lc()._initInfo();
		assertEQ ( TQ.getCSS(this.lc().m_items.appointContainer, 'display'), 'none');
		
		this.member.alliPos = ALLI_POS.ELDER;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.ALEADER}}});
		this.lc()._initInfo();
		assertEQ ( this.lc().m_items.fireBtn.isShow(), true );
		
		this.member.alliPos = ALLI_POS.ELDER;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.ELDER}}});
		this.lc()._initInfo();
		assertEQ ( this.lc().m_items.fireBtn.isShow(), false );
	};
	
	this.test__onClickAppoint = function(){
		var becalled = false;
		var _observer = function(){
			becalled = true
		};
		this.dlg.setObserver(_observer);
		
		AlliMainDlg.snew(this.g);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ALLIANCE, data:{selfmem:{alliPos:ALLI_POS.LEADER}, mydetail:{name:'alliance'}}});
		this.lc()._initInfo();
		
		this.mm.mock(AllianceSender, 'sendAppointMember');
		this.lc().m_items.alliPosDropList.setCurSel(2);
		this.lc()._onClickAppoint();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.alli.meminfodlg.tip.noChangeAppoint ), true);
		
		assertEQ ( this.lc().m_dlg.isShow(), true );
		TestCaseSysTip.clearTip();
		this.lc().m_items.alliPosDropList.setCurSel(0);
		this.lc()._onClickAppoint();
		assertEQ ( TestCaseSysTip.hasSystip(), false );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), TQ.format(rstr.alli.meminfodlg.tip.confirmAppoint, 'role', this.lc().m_items.alliPosDropList.getTitle()) );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( becalled, false );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendAppointMember'], [this.g, 'role', ALLI_POS.ALEADER] );	
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( becalled, true );
	};
	
	this.test__onClickFire = function() {
		var becalled = false;
		var _observer = function(){
			becalled = true
		};
		this.dlg.setObserver(_observer);
		
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.mm.mock(AllianceSender, 'sendFireMember');
		this.lc()._onClickFire();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), TQ.format(rstr.alli.meminfodlg.tip.confirmFire, 'role') );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( becalled, false );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendFireMember'], [this.g, 'role'] );	
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( becalled, true );
	};
	
	this.test__onClickChat = function(){
		this.mm.mock(UIM.getPanel('chat'), 'setChatTarget');
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.lc()._onClickChat();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( this.mm.params['setChatTarget'], ['role'] );
	};
	
	this.test__onClickMail = function(){
		this.mm.mock(UIM.getDlg('writeletter'), 'writeLetterTo');
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.lc()._onClickMail();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( this.mm.params['writeLetterTo'], ['role'] );
	};
	
	this.test__onClickFriend = function(){
		this.mm.mock(FriendSender, 'sendApplyFriend');
		this.lc()._onClickFriend();
		assertEQ ( this.mm.params['sendApplyFriend'], [this.g, 'role'] );
	};
});

TestCaseAlliApplyListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliApplyListDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		this.cmd = {data:{applys:[{_k:"roleId"}
			,{roleId:10000, roleName:'role1', level:1, buildVal:100}
			,{roleId:10001, roleName:'role2', level:2, buildVal:200}
			]}};
	};

	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(this.member);
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');

		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.applylistdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.applylistdlg, this.lc().m_items] ); 
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );				
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_updateApplyList');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_updateApplyList' );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc(), '_updateApplyList');
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.lc().m_applys, [] );
		
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( this.lc().m_applys, [this.cmd.data.applys[1], this.cmd.data.applys[2]] );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( this.mm.walkLog, '_updateApplyList' );
	};
	
	this.test__updateApplyList = function(){
		var list = this.lc().m_items.list;
		list.setItemCount(2);
		var item0 = list.getItem(0);
		var item1 = list.getItem(1);
		
		this.mm.mock(item0.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller0');
		this.mm.mock(item1.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller1');
		this.mm.mock(item0.exsubs.refuseBtn, 'setCaller:refuseBtnSetCaller0');
		this.mm.mock(item1.exsubs.refuseBtn, 'setCaller:refuseBtnSetCaller1');
		
		list.setItemCount(0);
		
		this.lc()._onSvrPkg(this.cmd);
		
		assertEQ ( list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.buildVal), 100 );
		assertEQ ( item0.exsubs.agreeBtn.getId(), 0 );
		assertEQ ( item0.exsubs.refuseBtn.getId(), 0 );
		assertEQ ( this.mm.params['agreeBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickAgreeBtn}] );
		assertEQ ( this.mm.params['refuseBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickRefuseBtn}] );
		
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.level), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.buildVal), 200 );
		assertEQ ( item1.exsubs.agreeBtn.getId(), 1 );
		assertEQ ( item1.exsubs.refuseBtn.getId(), 1 );
		assertEQ ( this.mm.params['agreeBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickAgreeBtn}] );
		assertEQ ( this.mm.params['refuseBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickRefuseBtn}] );		
	};
	
	this.test__onClickAgreeBtn = function(){
		this.lc()._onSvrPkg(this.cmd);
		this.mm.mock(AllianceSender, 'sendAgreeApply');
		this.lc()._onClickAgreeBtn(1);
		assertEQ ( this.mm.params['sendAgreeApply'], [this.g, 10001] );
	};
	
	this.test__onClickRefuseBtn = function(){
		this.lc()._onSvrPkg(this.cmd);
		this.mm.mock(AllianceSender, 'sendIgnoreApply');
		this.lc()._onClickRefuseBtn(1);
		assertEQ ( this.mm.params['sendIgnoreApply'], [this.g, 10001] );
	};
});

TestCaseAlliEventsDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliEventsDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};

	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(this.member);
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');

		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.eventsdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.eventsdlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'activePage');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['activePage'], [1, true] );
	};
	
	this.test__onPageNavigate = function(){
		this.mm.mock(AllianceSender, 'sendGetEvents');
		var pageNo = 1;
		this.lc()._onPageNavigate(pageNo);
		assertEQ ( this.mm.params['sendGetEvents'], [this.g, pageNo] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.lc().m_items.pageBar, 'setPageCnt' );
		this.mm.mock(this.lc().m_items.pageBar, 'activePage' );
		
		this.lc()._onSvrPkg({data:{}});
		assertEQ ( this.mm.walkLog, '' );
		
		var cmd = {data:{events:{list:[{desc:'desc0', time:1370167090},{desc:'desc1', time:1370167090+3600}], pageCount:2, pageNo:1}}};

		var bak_dlg = this.lc().m_dlg;
		this.lc().m_dlg = null;
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = bak_dlg;
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.params['setPageCnt'], [2] );
		assertEQ ( this.mm.params['activePage'], [1, false, true] );
		var list = this.lc().m_items.list;
		assertEQ ( list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.desc), 'desc0' );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.time), TQ.formatDateTime(1370167090) );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.desc), 'desc1' );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.time), TQ.formatDateTime(1370167090+3600) );
	};
});

TestCaseAlliMergeDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliMergeDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		this.cmd = {data:{applymerges:[{_r:1},{id:1,name:'alliance0', level:1, leader:'role0'},{id:2,name:'alliance1', level:2, leader:'role1'}]}};
	};

	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ALLIANCE, this.dlg, this.lc()._onSvrPkg] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg(this.member);
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');

		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.mergedlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.mergedlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.applyMergeBtn, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickApplyMerge}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(AllianceSender, 'sendGetApplyMerges');
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetApplyMerges'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		var list = this.lc().m_items.list;
		
		this.lc()._onSvrPkg({data:{}});
		assertEQ ( list.getCount(), 0 );
		
		var bak_dlg = this.lc().m_dlg;
		this.lc().m_dlg = null;
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( list.getCount(), 0 );
		
		this.lc().m_dlg = bak_dlg;
		this.lc().m_dlg.hide();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( list.getCount(), 0 );
			
		list.setItemCount(2);
		var item0 = list.getItem(0);
		var item1 = list.getItem(1);
		this.mm.mock(item0.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller0');
		this.mm.mock(item0.exsubs.refuseBtn, 'setCaller:refuseBtnSetCaller0');
		this.mm.mock(item1.exsubs.agreeBtn, 'setCaller:agreeBtnSetCaller1');
		this.mm.mock(item1.exsubs.refuseBtn, 'setCaller:refuseBtnSetCaller1');
		list.setItemCount(0);
		
		this.lc().m_dlg.show();
		this.lc()._onSvrPkg(this.cmd);
		assertEQ ( list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.name), 'alliance0' );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.leader), 'role0' );
		assertEQ ( list.getItem(0).exsubs.agreeBtn.getId(), 0 );
		assertEQ ( list.getItem(0).exsubs.refuseBtn.getId(), 0 );
		assertEQ ( this.mm.params['agreeBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickAgreeBtn}] );
		assertEQ ( this.mm.params['refuseBtnSetCaller0'], [{self:this.dlg, caller:this.lc()._onClickRefuseBtn}] );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.name), 'alliance1' );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.level), 2 );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.leader), 'role1' );
		assertEQ ( list.getItem(1).exsubs.agreeBtn.getId(), 1 );
		assertEQ ( list.getItem(1).exsubs.refuseBtn.getId(), 1 );
		assertEQ ( this.mm.params['agreeBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickAgreeBtn}] );
		assertEQ ( this.mm.params['refuseBtnSetCaller1'], [{self:this.dlg, caller:this.lc()._onClickRefuseBtn}] );		
	};
	
	this.test__onClickApplyMerge = function(){
		this.mm.mock(UIM.getDlg('inputtext'), 'openDlg');
		this.mm.mock(UIM.getDlg('inputtext'), 'setCaller');
		this.lc()._onClickApplyMerge();
		assertEQ ( this.mm.params['openDlg'], [rstr.alli.mergedlg.lbl.applyMergeTip, JVALID.getMaxAlliLen()] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onApplyMergeCallBack}] );
	};
	
	this.test__onApplyMergeCallBack = function(){
		this.mm.mock(AllianceSender, 'sendApplyMerge');
		this.lc()._onApplyMergeCallBack ('abc');
		assertEQ ( this.mm.params['sendApplyMerge'], [this.g, 'abc'] );
		assertEQ ( TestCaseSysTip.hasSystip(), false );
		
		this.mm.clear();
		this.lc()._onApplyMergeCallBack ('ab\'c');
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.ids[100116].msg ), true);
	};
	
	this.test__onClickAgreeBtn = function(){
		this.lc()._onSvrPkg(this.cmd);
		
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.mm.mock(AllianceSender, 'sendAgreeMerge');
		this.lc()._onClickAgreeBtn(1);
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.alli.mergedlg.tip.confirmMerge );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendAgreeMerge'], [this.g, 'alliance1'] );	
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__onClickRefuseBtn = function(){
		this.lc()._onSvrPkg(this.cmd);
		
		this.mm.mock(AllianceSender, 'sendRefuseMerge');
		this.lc()._onClickRefuseBtn(1);
		assertEQ ( this.mm.params['sendRefuseMerge'], [this.g, 'alliance1'] );
	};
});


tqAlliHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseAlliDlg, 'TestCaseAlliDlg');
	suite.addTestCase(TestCaseAlliCreateDlg, 'TestCaseAlliCreateDlg');
	suite.addTestCase(TestCaseAlliListDlg, 'TestCaseAlliListDlg');
	suite.addTestCase(TestCaseAlliListDlgTempl, 'TestCaseAlliListDlgTempl');
	suite.addTestCase(TestCaseAlliDetailDlg, 'TestCaseAlliDetailDlg');
	suite.addTestCase(TestCaseSelfAlliMemListDlg, 'TestCaseSelfAlliMemListDlg');
	suite.addTestCase(TestCaseOtherAlliMemListDlg, 'TestCaseOtherAlliMemListDlg');
	suite.addTestCase(TestCaseAlliMainDlg, 'TestCaseAlliMainDlg');
	suite.addTestCase(TestCaseAlliMainBasePanel, 'TestCaseAlliMainBasePanel');
	suite.addTestCase(TestCaseAlliMainLawLightPanel, 'TestCaseAlliMainLawLightPanel');
	suite.addTestCase(TestCaseAlliMainAuctionPanel, 'TestCaseAlliMainAuctionPanel');
	suite.addTestCase(TestCaseAlliTransferDlg, 'TestCaseAlliTransferDlg');
	suite.addTestCase(TestCaseAlliUnTransferDlg, 'TestCaseAlliUnTransferDlg');
	suite.addTestCase(TestCaseAlliSubscribeDlg, 'TestCaseAlliSubscribeDlg');
	suite.addTestCase(TestCaseAlliMemInfoDlg, 'TestCaseAlliMemInfoDlg');
	suite.addTestCase(TestCaseAlliApplyListDlg, 'TestCaseAlliApplyListDlg');
	suite.addTestCase(TestCaseAlliEventsDlg, 'TestCaseAlliEventsDlg');
	suite.addTestCase(TestCaseAlliMergeDlg, 'TestCaseAlliMergeDlg');
};
