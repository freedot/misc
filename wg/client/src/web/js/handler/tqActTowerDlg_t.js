/*******************************************************************************/
require('./tqActTowerDlg.js')

TestCaseActTowerDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.getImgr().getRoleRes().level = res_enter_tower_need_rolelevel;
		this.dlg = ActTowerDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg._init();
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.ACT_TOWER, this.dlg, this.dlg._onSvrPkg] );
	};
	
	this.test_canNotOpenDlgWhenRoleLevelNotArrived = function(){
		this.dlg.hideDlg();
		this.g.getImgr().getRoleRes().level = res_enter_tower_need_rolelevel - 1;
		this.dlg.openDlg();
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), TQ.format(rstr.activity.tower.maindlg.tip.roleLevelNotArrived, res_enter_tower_need_rolelevel) );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.activity.tower.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.maindlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.dlg.items_.addRecoveryRateBtn, 'setCaller:addRateSetCaller');
		this.mm.mock(this.dlg.items_.buyBtn, 'setCaller:buySetCaller');
		this.mm.mock(this.dlg.items_.enterBtn, 'setCaller:enterSetCaller');
		this.dlg._setCallers();
		assertEQ ( this.mm.params['addRateSetCaller'], [{self:this.dlg, caller:this.dlg._onClickAddRecoveryRateBtn}] );
		assertEQ ( this.mm.params['buySetCaller'], [{self:this.dlg, caller:this.dlg._onClickBuyItemBtn}] );
		assertEQ ( this.mm.params['enterSetCaller'], [{self:this.dlg, caller:this.dlg._onClickEnterBtn}] );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(ActTowerSender, 'sendGetBaseInfo');
		this.mm.mock(UIM.getDlg('acttowerexped'), 'reset');
		this.dlg._initInfo();
		assertEQ ( this.mm.params['sendGetBaseInfo'], [this.g] );
		assertEQ ( this.mm.params['reset'], [] );
		assertEQ ( this.dlg.items_.towerLayerRadio.getCurSelId(), 0 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayFreeTimes), TQ.format(rstr.activity.tower.maindlg.lbl.todayFreeTimes, 0));
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayItemTimes), TQ.format(rstr.activity.tower.maindlg.lbl.todayItemTimes, 0));
		assertEQ ( TQ.getTextEx(this.dlg.items_.maxLayer), 0);
		assertEQ ( this.dlg.items_.enterBtn.getType(), BTN_TYPE.DELAY);
		assertEQ ( this.dlg.items_.enterBtn.getDelay()>0, true);
		
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.noUseRecoverItem);
		this.g.getImgr().getRoleStates().push({id:RES_EFF.TOWER_RECOVER_SOLDIER});
		this.dlg._initInfo();
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.useRecoverItem);
	};
	
	this.test__onClickAddRecoveryRateBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg._onClickAddRecoveryRateBtn();
		assertEQ ( this.mm.params['openDlg'], ['uselistitem', [RES_EFF.TOWER_RECOVER_SOLDIER], {id:0, name:'', type:RES_TRG.SELF_ROLE}] );
		assertEQ ( TestCaseSysTip.hasSystip(), false);
		
		this.g.getImgr().getRoleStates().push({id:RES_EFF.TOWER_RECOVER_SOLDIER});
		this.dlg._onClickAddRecoveryRateBtn();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.maindlg.tip.itemused ), true, "you has the buff, can't use item again");
	};
	
	this.test__onClickBuyItemBtn = function(){
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg');
		this.dlg._onClickBuyItemBtn();
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:FIXID.HEIMULING, number:100000}] );
	};
	
	this.test__onClickEnterBtn = function(){
		this.mm.mock(ActTowerSender, 'sendEnterTower');
		this.dlg.items_.towerLayerRadio.select(0);
		this.dlg._onClickEnterBtn();
		assertEQ ( this.mm.params['sendEnterTower'], [this.g, 1]);
		
		assertEQ (  UIM.getDlg('actskiplayer').isShow(), false );
		this.mm.clear();
		var cmd = {data:{baseInfo:{today:{freeTimes:2, itemTimes:1}, maxLayer:39}}};
		this.dlg._onSvrPkg(cmd);
		this.dlg.items_.towerLayerRadio.select(1);
		this.dlg._onClickEnterBtn();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ (  UIM.getDlg('actskiplayer').isShow(), false );
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.maindlg.tip.cannotSkip ), true);
		
		var cmd = {data:{baseInfo:{today:{freeTimes:2, itemTimes:1}, maxLayer:40}}};
		this.dlg._onSvrPkg(cmd);
		this.mm.clear();
		this.dlg.items_.towerLayerRadio.select(1);
		this.dlg._onClickEnterBtn();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( UIM.getDlg('actskiplayer').isShow(), true );
		assertEQ ( UIM.getDlg('actskiplayer').params_, {layer:41} );
		
		var cmd = {data:{baseInfo:{today:{freeTimes:2, itemTimes:1}, maxLayer:80}}};
		this.dlg._onSvrPkg(cmd);
		this.mm.clear();
		this.dlg.items_.towerLayerRadio.select(2);
		this.dlg._onClickEnterBtn();
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( UIM.getDlg('actskiplayer').params_, {layer:81} );
		
		this.mm.mock(this.dlg, '_enter');
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.HEIMULING, num:1} });
		this.g.getImgr().getActTower().baseInfo.today.maxTimes = 3;
		this.g.getImgr().getActTower().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTower().baseInfo.today.itemTimes = 0;
		this.mm.clear();
		this.dlg._onClickEnterBtn();
		assertEQ ( this.mm.walkLog, '_enter' );
		
		// when use item, need second confirm
		this.mm.mock(this.dlg, '_enter');
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.HEIMULING, num:1} });
		this.g.getImgr().getActTower().baseInfo.today.maxTimes = 2;
		this.g.getImgr().getActTower().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTower().baseInfo.today.itemTimes = 0;
		this.mm.clear();
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.tower.maindlg.lbl.confirmUseItem );
		this.g.getGUI().msgBoxClick(MB_IDYES+1);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.walkLog, '_enter' );
	};
	
	this.test__onSvrPkg = function(){
		this.dlg.dlg_.hide();
		var cmd = {data:{ranks:[{rank:1, name:'role1', maxLayer:90},{rank:2, name:'role2', maxLayer:89}]}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.items_.rankingList.getCount(), 0);
		
		this.dlg.dlg_.show();
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.items_.rankingList.getCount(), 2);
		var item0 = this.dlg.items_.rankingList.getItem(0);
		var item1 = this.dlg.items_.rankingList.getItem(1);
		assertEQ ( TQ.getTextEx(item0.exsubs.no), TQ.format(rstr.activity.tower.maindlg.lbl.no, 1) );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'role1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.maxLayer), TQ.format(rstr.activity.tower.maindlg.lbl.maxLayer, 90) );
		assertEQ ( TQ.getTextEx(item1.exsubs.no), TQ.format(rstr.activity.tower.maindlg.lbl.no, 2) );
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'role2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.maxLayer), TQ.format(rstr.activity.tower.maindlg.lbl.maxLayer, 89) );
		
		this.dlg.dlg_.hide();
		cmd = {data:{baseInfo:{today:{maxTimes:3, freeTimes:2, itemTimes:1}, maxLayer:80}}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( TQ.getTextEx(this.dlg.items_.maxLayer), 0);
		
		this.dlg.dlg_.show();
		this.dlg._onSvrPkg(cmd);
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayFreeTimes), TQ.format(rstr.activity.tower.maindlg.lbl.todayFreeTimes, 2, 3));
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayItemTimes), TQ.format(rstr.activity.tower.maindlg.lbl.todayItemTimes, 1));
		assertEQ ( TQ.getTextEx(this.dlg.items_.maxLayer), 80);
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( this.mm.walkLog, '');
		
		cmd = {data:{enterTower:{curLayer:1}}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__onStateChange = function(){
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.noUseRecoverItem);
		this.g.getImgr().getRoleStates().push({id:RES_EFF.TOWER_RECOVER_SOLDIER});
		
		this.dlg.dlg_.hide();
		this.g.sendEvent({eid:EVT.ROLESPECSTATE_CHANGE, sid:0});
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.noUseRecoverItem);
		
		this.dlg.dlg_.show();
		this.g.sendEvent({eid:EVT.ROLESPECSTATE_CHANGE, sid:0});
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.useRecoverItem);
	};
});

TestCaseActSkipLayerDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ActSkipLayerDlg.snew(this.g);
		this.dlg.openDlg({layer:41});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:true, title:rstr.activity.tower.skipLayerDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.skipLayerDlg} );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.dlg.items_.needBtn, 'setCaller:needBtnSetCaller');
		this.mm.mock(this.dlg.items_.noNeedBtn, 'setCaller:noNeedBtnSetCaller');
		this.dlg._setCallers();
		assertEQ ( this.mm.params['needBtnSetCaller'], [{self:this.dlg, caller:this.dlg._onClickNeedBtn}] );
		assertEQ ( this.mm.params['noNeedBtnSetCaller'], [{self:this.dlg, caller:this.dlg._onClickNoNeedBtn}] );
	};
	
	this.test__onClickNeedBtn = function(){
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( UIM.getDlg('actgainskiplayergift').isShow(), false );
		
		this.dlg._onClickNeedBtn();
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( UIM.getDlg('actgainskiplayergift').isShow(), true );
		assertEQ ( UIM.getDlg('actgainskiplayergift').params_, {layer:41});
	};
	
	this.test__onClickNoNeedBtn = function(){
		this.mm.mock(ActTowerSender, 'sendEnterTower');
		
		assertEQ ( this.dlg.isShow(), true );
		this.dlg._onClickNoNeedBtn();
		assertEQ ( this.mm.params['sendEnterTower'], [this.g, 41] );
		assertEQ ( this.dlg.isShow(), false );
	};
});

TestCaseActGainSkipLayerGiftDlg  = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.acttowerdlg = ActTowerDlg.snew(this.g);
		this.dlg = ActGainSkipLayerGiftDlg.snew(this.g);
		this.dlg.openDlg({layer:41});
		this.rolepanel = RoleBasePanel.snew(this.g, MockDomEx.snew('div'));
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:true, title:rstr.activity.tower.gainSkipLayerGift.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.gainSkipLayerGift} );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.dlg.items_.gainBtn, 'setCaller:gainBtnSetCaller');
		this.mm.mock(this.dlg.items_.noGainBtn, 'setCaller:noGainBtnSetCaller');
		this.dlg._setCallers();
		assertEQ ( this.mm.params['gainBtnSetCaller'], [{self:this.dlg, caller:this.dlg._onClickGainBtn}] );
		assertEQ ( this.mm.params['noGainBtnSetCaller'], [{self:this.dlg, caller:this.dlg._onClickNoGainBtn}] );
	};
	
	this.test__initInfo = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{baseInfo:{maxLayer:70}}});
		var needGold = 100 - 70;
		this.dlg._initInfo();
		assertEQ ( TQ.getTextEx(this.dlg.items_.desc), TQ.format(rstr.activity.tower.gainSkipLayerGift.desc, 70, 40, needGold) );
		
		this.dlg.openDlg({layer:81});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{baseInfo:{maxLayer:90}}});
		var needGold = 200 - 90;
		this.dlg._initInfo();
		assertEQ ( TQ.getTextEx(this.dlg.items_.desc), TQ.format(rstr.activity.tower.gainSkipLayerGift.desc, 90, 80, needGold) );
		
		this.dlg.openDlg({layer:81});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:4}}});
		var needGold = 0;
		this.dlg._initInfo();
		assertEQ ( TQ.getTextEx(this.dlg.items_.desc), TQ.format(rstr.activity.tower.gainSkipLayerGift.desc, 90, 80, needGold +  rstr.activity.tower.gainSkipLayerGift.vip) );
	};
	
	this.test__onClickGainBtn = function(){
		this.mm.mock(ActTowerSender, 'sendEnterTower');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{baseInfo:{maxLayer:70}}});
		var needGold = 100 - 70;
		this.dlg._onClickGainBtn();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.gainSkipLayerGift.tip.noEnoughGold ), true);
		
		TestCaseSysTip.clearTip();
		this.g.getImgr().setGiftGold(needGold);
		this.dlg._onClickGainBtn();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.gainSkipLayerGift.tip.noEnoughGold ), true);
		
		TestCaseSysTip.clearTip();
		this.g.getImgr().setGold(needGold);
		this.dlg._onClickGainBtn();
		assertEQ ( TestCaseSysTip.hasSystip(), false);
		assertEQ ( this.mm.params['sendEnterTower'], [this.g, 41, true]);
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__onClickNoGainBtn = function(){
		this.mm.mock(ActTowerSender, 'sendEnterTower');
		this.dlg._onClickNoGainBtn();
		assertEQ ( this.mm.params['sendEnterTower'], [this.g, 41]);
		assertEQ ( this.dlg.isShow(), false );
	};
});

tqActTowerDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseActTowerDlg, 'TestCaseActTowerDlg');
	suite.addTestCase(TestCaseActSkipLayerDlg, 'TestCaseActSkipLayerDlg');
	suite.addTestCase(TestCaseActGainSkipLayerGiftDlg, 'TestCaseActGainSkipLayerGiftDlg');
};
