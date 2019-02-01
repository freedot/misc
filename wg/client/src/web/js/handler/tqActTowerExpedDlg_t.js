/*******************************************************************************/
require('./tqActTowerExpedDlg.js')

TestCaseActTowerExpedDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.clearUpdater();
		this.dlg = ActTowerExpedDlg.snew(this.g);
		this.dlg.openDlg({curLayer:1});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isRunning = function(){
		this.dlg.running_ = false;
		assertEQ ( this.dlg.isRunning(), false );
		
		this.dlg.running_ = true;
		assertEQ ( this.dlg.isRunning(), true );
	};
	
	this.test_forceShow = function(){
		this.mm.mock(this.dlg.forceTabHdr_, 'refresh');
		this.dlg.isAutoFight_ = true;
		this.dlg.enterTower_ = {curLayer:1, stopTime:60, leftLifes:0};
		this.dlg.hideDlg();
		this.dlg.forceShow();
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( this.mm.walkLog, 'refresh' );
		assertEQ ( TQ.getCSS(this.dlg.items_.leftLifes, 'width'), (0*30) + 'px' );
		
		this.dlg.dlg_ = null;
		this.dlg.forceShow();
	};

	this.test__init = function(){
		this.dlg._init();
	};
	
	this.test_sendCheckAutoFightWhenLoginOk =function(){
		this.mm.mock(ActTowerSender, 'sendCheckAutoFight');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendCheckAutoFight'], [this.g] );
	};
	
	this.test__showDlg = function(){
		this.dlg.isAutoFight_ = false;
		this.dlg.hideDlg();
		this.dlg._showDlg();
		assertEQ ( this.dlg.isShow(), true );
		
		this.dlg.isAutoFight_ = true;
		this.dlg.hideDlg();
		this.dlg._showDlg();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.activity.tower.expeddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.expeddlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.dlg.dlg_, 'setCaller:dlgSetCaller');
		this.dlg._setCallers();
		assertEQ ( this.mm.params['dlgSetCaller'], [{self:this.dlg, caller:this.dlg._onDlgEvent}] );
	};
	
	this.test__afterCreate = function(){
		// create each layer gift list and tooltip caller
		this.mm.travelMock(TTIP, 'setCallerData');
		this.mm.travelMock(ActTowerForceTabHdr, 'snew');
		this.dlg._afterCreate();
		assertEQ ( this.dlg.items_.layerGiftsList.getCount(), 10 );
		var item0 = this.dlg.items_.layerGiftsList.getItem(0);
		var item1 = this.dlg.items_.layerGiftsList.getItem(1);
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), '5001002.gif'), true );
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.icon), '5001001.gif'), true );
		assertEQ ( this.mm.params['setCallerData.0'], [item0.exsubs.tooltips['$item'], {self:this.dlg, caller:this.dlg._onGettLayerGiftTip}, {idx:0}] );
		assertEQ ( this.mm.params['setCallerData.1'], [item1.exsubs.tooltips['$item'], {self:this.dlg, caller:this.dlg._onGettLayerGiftTip}, {idx:1}] );
		
		// create forceTabHdr_
		assertEQ ( this.dlg.forceTabHdr_ instanceof ActTowerForceTabHdr, true );
		assertEQ ( this.mm.params['snew'], [this.dlg.g_, this.dlg.items_] );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.g, 'regUpdater');
		this.mm.travelMock(this.dlg.forceTabHdr_, 'refresh');
		this.mm.travelMock(this.dlg.forceTabHdr_, 'setLineup');
		
		TQ.dictCopy(this.g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.ACTTOWER, lineup:180001, heros:[1,2]}] );
		
		// check current layer arraw
		var left = 23;
		var itemW = 62;
		var arrawW = 18;
		
		var enterTower = {curLayer:1};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.curLayerArrow, 'left'), (left + 0*itemW + (itemW-arrawW)/2) + 'px' );
		assertEQ ( this.dlg.dlg_.getTitle(), TQ.format(rstr.activity.tower.maindlg.dtitle, 1)  );
		
		enterTower = {curLayer:29};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.curLayerArrow, 'left'), (left + 2*itemW + (itemW-arrawW)/2) + 'px' );
		
		enterTower = {curLayer:100};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.curLayerArrow, 'left'), (left + 9*itemW + (itemW-arrawW)/2) + 'px' );
		
		enterTower = {curLayer:101};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.curLayerArrow, 'left'), (left + 9*itemW + (itemW-arrawW)/2) + 'px' );
		var copyField = ItemResUtil.findItemres(172000 + 100);
		var lineupRes = ItemResUtil.findItemres(copyField.lineup);
		assertEQ ( TQ.getTextEx(this.dlg.items_.enemyLineupName), lineupRes.name );
		assertEQ ( this.dlg.dlg_.getTitle(), TQ.format(rstr.activity.tower.maindlg.dtitle, 100)  )
		
		// check reg updater
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.dlg._onUpdate, 1000] );
		
		// check update force table
		assertEQ ( this.mm.params['setLineup'], [180001, [1,2]]);
		assertEQ ( this.mm.params['refresh'], []);
		
		// check last Layer Info
		enterTower = {curLayer:1};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.lastLayerInfo, 'display'), 'none' );
		
		enterTower = {curLayer:2,lastLayerInfo:{layer:1, fightResult:0, gift:{heroExp:100, items:[]}}};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.lastLayerInfo, 'display'), 'block' );
		var s = TQ.format(rstr.activity.tower.expeddlg.tip.lastLayerInfo, 1, rstr.activity.tower.expeddlg.fightResults[0], 100, '无');
		assertEQ ( TQ.getTextEx(this.dlg.items_.lastLayerInfo), s);
		assertEQ ( this.dlg.dlg_.getTitle(), TQ.format(rstr.activity.tower.maindlg.dtitle, 2)  );
		
		enterTower = {curLayer:2,lastLayerInfo:{layer:1, fightResult:0, gift:{heroExp:100, items:{}}}};
		this.dlg.openDlg(enterTower);
		var s = TQ.format(rstr.activity.tower.expeddlg.tip.lastLayerInfo, 1, rstr.activity.tower.expeddlg.fightResults[0], 100, '无');
		assertEQ ( TQ.getTextEx(this.dlg.items_.lastLayerInfo), s);
		
		enterTower = {curLayer:3,lastLayerInfo:{layer:2, fightResult:1, gift:{heroExp:100, items:[{id:2500001,number:2}]}}};
		this.dlg.openDlg(enterTower);
		var res = ItemResUtil.findItemres(2500001);
		var itemname = ItemNameColorGetter.getColorVal(res.level, res.name)
		var s = TQ.format(rstr.activity.tower.expeddlg.tip.lastLayerInfo, 2, rstr.activity.tower.expeddlg.fightResults[1], 100, itemname + '×2');
		assertEQ ( TQ.getTextEx(this.dlg.items_.lastLayerInfo), s);
		
		
		// check stopTime, and vsBtn autoFightBtn state
		enterTower = {curLayer:10, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.tower.expeddlg.leftTime, '00:00:10') );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		this.g.setSvrTimeS(61);
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), '' );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		this.g.getImgr().getActTower().baseInfo.maxLayer = 9
		enterTower = {curLayer:11, stopTime:60};
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), true, '过了前10层，才可自动' );
		
		this.g.getImgr().getActTower().baseInfo.maxLayer = 10
		enterTower = {curLayer:10, stopTime:60};
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), true, '过了前10层，才可自动' );
		
		// check leftLifes
		enterTower = {curLayer:1, stopTime:60, leftLifes:2};
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getCSS(this.dlg.items_.leftLifes, 'width'), (2*30) + 'px' );
		
		
		// check usedItemTip
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.noUseRecoverItem);
		this.g.getImgr().getRoleStates().push({id:RES_EFF.TOWER_RECOVER_SOLDIER});
		this.dlg.openDlg(enterTower);
		assertEQ ( TQ.getTextEx(this.dlg.items_.usedItemTip), rstr.activity.tower.maindlg.lbl.useRecoverItem);
		
		// check enemy lineup name, enemy FightCap, enemy lineup
		enterTower = {curLayer:2}; //172002
		this.dlg.openDlg(enterTower);
		var copyField = ItemResUtil.findItemres(172002);
		var lineupRes = ItemResUtil.findItemres(copyField.lineup);
		assertEQ ( TQ.getTextEx(this.dlg.items_.enemyLineupName), lineupRes.name );
	
		var fightCap = 0;
		for ( var i=0; i<copyField.heros.length; ++i ) {
			var fieldHero = ItemResUtil.findItemres(copyField.heros[i]);
			fightCap += fieldHero.fightcap;
		}
		assertEQ ( TQ.getTextEx(this.dlg.items_.enemyFightCap), fightCap );
		
		var enemyForceList = this.dlg.items_.enemyForceTabList;
		var hero0 = ItemResUtil.findItemres(copyField.heros[0]);
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(0).exsubs.name),  rstr.comm.heroprofs[hero0.prof] );
		var hero1 = ItemResUtil.findItemres(copyField.heros[1]);
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(1).exsubs.name),  rstr.comm.heroprofs[hero1.prof] );
		var hero2 = ItemResUtil.findItemres(copyField.heros[2]);
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(2).exsubs.name),  rstr.comm.heroprofs[hero2.prof] );
		var hero3 = ItemResUtil.findItemres(copyField.heros[3]);
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(3).exsubs.name),  rstr.comm.heroprofs[hero3.prof] );
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(4).exsubs.name),  '' );
		var hero4 = ItemResUtil.findItemres(copyField.heros[4]);
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(5).exsubs.name),  rstr.comm.heroprofs[hero4.prof] );
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(6).exsubs.name),  '' );
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(7).exsubs.name),  '' );
		assertEQ ( TQ.getTextEx ( enemyForceList.getItem(8).exsubs.name),  '' );
		
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 0 );
		
		this.dlg._updateForceTab(180001, [1,0,2,0,0]);
		this.dlg._initInfo();
		assertEQ ( TQ.getCSS(this.dlg.items_.curlineup, 'display' ), 'block' );
		
		
		// init auto fight info
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.dlg.reset();
		assertEQ ( this.dlg.running_, false );
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		
		
		// stop auto fight when reach user set max layer
		this.mm.mock(ActTowerSender, 'sendStopAutoFight');
		this.dlg.isAutoFight_ = true;
		this.dlg.autoToLayer_ = 10;
		enterTower = {curLayer:10, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.cancelAutoFight );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), true );
		
		enterTower = {curLayer:11};
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertStrRepeatCount ( this.mm.walkLog, 'sendStopAutoFight', 1);
		
		this.mm.clear();
		enterTower = {curLayer:11};
		this.dlg.openDlg(enterTower);
		assertStrRepeatCount ( this.mm.walkLog, 'sendStopAutoFight', 0);
		
		
		//  stop auto fight when loss life
		this.dlg.isAutoFight_ = true;
		this.dlg.autoToLayer_ = 10;
		enterTower = {curLayer:10, leftLifes:2};
		this.dlg.lastLifes_ = 2;
		this.dlg.openDlg( enterTower );
		assertEQ ( this.dlg.isAutoFight_, true );
		
		this.mm.clear();
		enterTower = {curLayer:10, leftLifes:1};
		this.dlg.lastLifes_ = 2;
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.lastLifes_, 1 );
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 1);
		
		this.mm.clear();
		enterTower = {curLayer:10, leftLifes:1};
		this.dlg.lastLifes_ = 2;
		this.dlg.openDlg(enterTower);
		assertEQ ( this.dlg.lastLifes_, 1 );
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 0);
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.dlg, '_onAutoFight');
		// check stopTime, and vsBtn autoFightBtn state
		enterTower = {curLayer:1, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		this.dlg._onUpdate();
		assertEQ ( this.mm.walkLog, '_onAutoFight' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.tower.expeddlg.leftTime, '00:00:10') );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		this.g.setSvrTimeS(61);
		this.dlg._onUpdate();
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), '' );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		
		// pop msg box when life == 0 or pass gate
		this.g.getGUI().hideMsgBox();
		this.g.setSvrTimeS(79);
		var enterTower = {curLayer:1,stopTime:80,leftLifes:0};
		this.dlg.openDlg(enterTower);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.hideDlg();
		this.g.setSvrTimeS(80);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.openDlg(enterTower);
		this.g.setSvrTimeS(81);
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.g.update();
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.tower.expeddlg.tip.noLifeMsgTip );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.dlg.running_, false );
		assertEQ ( this.dlg.isAutoFight_, false );
		
		this.g.getGUI().hideMsgBox();
		var enterTower = {curLayer:101,stopTime:100,leftLifes:1};
		this.dlg.openDlg(enterTower);
		this.g.setSvrTimeS(99);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.hideDlg();
		this.g.setSvrTimeS(100);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.openDlg(enterTower);
		this.g.setSvrTimeS(101);
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.g.update();
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.tower.expeddlg.tip.passLayerMsgTip );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assertEQ ( this.dlg.isShow(), false );		
		assertEQ ( this.dlg.running_, false );
		assertEQ ( this.dlg.isAutoFight_, false );
	};
	
	this.help__onAutoFight_setCond = function(){
		this.mm.clear();
		this.dlg.isAutoFight_ = true;
		this.dlg.enterTower_.leftLifes = 1;
		this.dlg.enterTower_.stopTime = this.g.getSvrTimeS();
	};
	
	this.test__onAutoFight = function(){
		var r_vsRet = [true];
		var fillHdr = FillSoldiersHdr.snew(this.g, null, SoldierSender);
		this.mm.mock(FillSoldiersHdr, 'snew', [fillHdr]);
		this.mm.mock(fillHdr, 'setHeros');
		this.mm.mock(fillHdr, 'fillAll');
		this.mm.mock(this.dlg.forceTabHdr_, 'getFreeHeros', [[{id:1},{id:2}]]);
		this.mm.mock(this.dlg, '_onClickTreatmentBtn');
		this.mm.mock(this.dlg, '_onClickVSBtn', r_vsRet);
		
		this.help__onAutoFight_setCond();
		this.dlg.isAutoFight_ = false;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg.enterTower_.leftLifes = 0;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg.enterTower_.stopTime = this.g.getSvrTimeS() + 1;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg._onAutoFight();
		assertEQ ( this.mm.params['setHeros'], [[{id:1},{id:2}]] );
		assertEQ ( this.mm.params['fillAll'], [] );
		assertEQ ( this.mm.params['_onClickTreatmentBtn'], [] );
		assertEQ ( this.mm.params['_onClickVSBtn'], [] );
		assertEQ ( this.dlg.isAutoFight_, true );
		
		this.help__onAutoFight_setCond();
		r_vsRet[0] = false;
		this.dlg._onAutoFight();
		assertEQ ( this.dlg.isAutoFight_, false );
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
	
	this.test__onSvrPkg = function(){
		this.mm.mock(UIM.getPanel('sysmsg'), 'append');
		UIM.regDlg('fightmap', MockFightDemoDlg.snew());
		
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = false;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70,leftLifes:1, fightDemo:{armyId:1, fightId:2}, isExit:1}}});
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.dlg.running_, false );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70,leftLifes:1}}});
		assertEQ ( this.dlg.running_, true );
		
		this.dlg.isAutoFight_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70,leftLifes:1, fightDemo:{armyId:1, fightId:2}}}});
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( UIM.getDlg('fightmap').isShow(), true);
		assertEQ ( UIM.getDlg('fightmap').armyId_, 1);
		assertEQ ( UIM.getDlg('fightmap').fightId_, 2);
		UIM.getDlg('fightmap').hideDlg();
		assertEQ ( this.dlg.isShow(), true);
		assertEQ ( UIM.getDlg('fightmap').hideCaller_, null );
		
		this.mm.clear()
		this.dlg.isAutoFight_ = true;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70,leftLifes:0, fightDemo:{armyId:1, fightId:2}}}});
		assertEQ ( this.mm.params['append'], [CHAT_TAG.SYS, rstr.activity.tower.expeddlg.tip.noLifeSysTip]);
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.enterTower_.leftLifes, 0 );
			
		this.mm.clear()
		this.dlg.isAutoFight_ = true;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:101,leftLifes:1, fightDemo:{armyId:1, fightId:2}}}});
		assertEQ ( this.mm.params['append'], [CHAT_TAG.SYS, rstr.activity.tower.expeddlg.tip.passLayerSysTip]);
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.enterTower_.curLayer, 101 );
		
		this.mm.clear(); // format stoptime
		this.g.setSvrTimeS(1001);
		var cmd = {enterTower:{stopTime:1000,curLayer:80,leftLifes:1}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:cmd});
		assertEQ ( cmd.enterTower.stopTime, 1002 );
	};
	
	this.test__onSvrPkgInAutoFightState = function(){
		this.mm.mock(ActTowerSender, 'sendGetBaseInfo');
		this.dlg.isAutoFight_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{autoFight:1,autoToLayer:2}});
		assertEQ (this.dlg.isAutoFight_, false);
		assertEQ (this.dlg.autoToLayer_, 2);
		assertEQ (this.mm.walkLog, '' );
		this.g.sendEvent({eid:EVT.SAVE_FORCES, sid:0});
		assertEQ (this.dlg.isAutoFight_, true);
		assertEQ (this.mm.params['sendGetBaseInfo'], [this.g] );
	};
	
	this.test__onGetAutoFightBtnTip = function(){
		var enterTower = {curLayer:10, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		var tip = TTIP.getTipById(this.dlg.items_.tooltips['$autoFight']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.activity.tower.expeddlg.tip.autoFightBtnTip );
		
		this.g.getImgr().getActTower().baseInfo.maxLayer = 10
		enterTower = {curLayer:10, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		this.dlg.items_.autoFightBtn.enable(false);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '' );
		
		this.g.getImgr().getActTower().baseInfo.maxLayer = 9
		enterTower = {curLayer:11, stopTime:60};
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTower);
		this.dlg.items_.autoFightBtn.enable(false);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '' );
	};
	
	this.test__onGettLayerGiftTip = function(){
		var copyField = ItemResUtil.findItemres(172030);
		copyField.itemicontip = 'tip';
		assertEQ ( this.dlg._onGettLayerGiftTip({idx:2}), TQ.format(rstr.activity.tower.expeddlg.tip.layerDropTip, 30) + 'tip' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		
		this.dlg.running_ = false;
		this.dlg.hideDlg();
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.dlg._onUpdate] );
		
		this.mm.clear();
		this.dlg.running_ = true;
		this.dlg.hideDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__onClickShowGetGiftsBtn = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70, lastLayerInfo:{gift:{heroExp:100, items:[{id:2500001,number:1},{id:2500002,number:2}]}}}}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TOWER, data:{enterTower:{curLayer:70, lastLayerInfo:{gift:{heroExp:100, items:[{id:2500003,number:3}]}}}}});
		
		assertEQ ( UIM.getDlg('acttowerlastgetgifts').isShow(), false );
		this.dlg.items_.showGetGiftsBtn.click();
		assertEQ ( UIM.getDlg('acttowerlastgetgifts').isShow(), true );
		assertEQ ( UIM.getDlg('acttowerlastgetgifts').params_, [{id:2500001,number:1},{id:2500002,number:2},{id:2500003,number:3}] );
		
		this.dlg.reset();
		this.dlg.items_.showGetGiftsBtn.click();
		assertEQ ( UIM.getDlg('acttowerlastgetgifts').params_, [] );
	};
	
	this.test__onClickAddRecoveryRateBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.items_.addRecoveryRateBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['uselistitem', [RES_EFF.TOWER_RECOVER_SOLDIER], {id:0, name:'', type:RES_TRG.SELF_ROLE}] );
		assertEQ ( TestCaseSysTip.hasSystip(), false);
		
		this.g.getImgr().getRoleStates().push({id:RES_EFF.TOWER_RECOVER_SOLDIER});
		this.dlg.items_.addRecoveryRateBtn.click();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.maindlg.tip.itemused ), true, "you has the buff, can't use item again");
	};
	
	this.test__onClickChangeForceBtn = function(){
		this.mm.mock(UIM.getDlg('assignheros'), 'setCaller' );
		this.mm.mock(UIM.getDlg('assignheros'), 'openDlg' );
		this.dlg.items_.changeForceBtn.click();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.dlg._updateForceTabAndSendSave}] );
		assertEQ ( this.mm.params['openDlg'], [] );
	};
	
	this.test__onHeroUpdate = function(){
		this.mm.mock(this.dlg.forceTabHdr_, 'refresh' );
		this.mm.nologMock(this.dlg.forceTabHdr_, 'getHeroIds', [[1,2]] );
		
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assertEQ ( this.mm.walkLog, '' );
		this.dlg.forceShow();
		
		this.mm.clear();
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 0 );
		var heros = this.g.getImgr().getHeros().list;
		heros.push({id:1, attrs:{}});
		heros[0].attrs[ATTR.FC] = {val:10};
		heros.push({id:2, attrs:{}});
		heros[1].attrs[ATTR.FC] = {val:20};
		this.g.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assertEQ ( this.mm.walkLog, 'refresh' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 10+20 );
	};
	
	this.test__updateForceTab = function(){
		this.mm.mock(this.dlg.forceTabHdr_, 'setLineup' );
		this.mm.mock(this.dlg.forceTabHdr_, 'refresh' );

		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
				
		var lineup = 1;
		var heroIds = [1,0,2,0,5];
		this.dlg._updateForceTab(lineup, heroIds);
		assertEQ ( this.mm.walkLog, 'setLineup,refresh' );
		assertEQ ( this.mm.params['setLineup'],  [lineup, heroIds] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 500 );
	};
	
	this.test__updateForceTabAndSendSave = function(){
		this.mm.mock(this.dlg.forceTabHdr_, 'setLineup' );
		this.mm.mock(this.dlg.forceTabHdr_, 'refresh' );
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp');

		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
				
		var lineup = 1;
		var heroIds = [1,0,2,0,5];
		this.dlg._updateForceTabAndSendSave(lineup, heroIds);
		assertEQ ( this.mm.walkLog, 'setLineup,refresh,sendSaveForceLineUp' );
		assertEQ ( this.mm.params['setLineup'],  [lineup, heroIds] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.myFightCap), 500 );
		assertEQ ( this.mm.params['sendSaveForceLineUp'], [this.g, FORCELINE_TYPE.ACTTOWER, lineup, heroIds] );
		assertEQ ( this.g.getImgr().getSaveForces(), [{type:1,lineup:0,heros:[]},{type:2,lineup:lineup,heros:heroIds},{type:3,lineup:0,heros:[]}]);
	};
	
	this.test__onClickAssignSoldierBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.items_.assignSoldierBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['assignsoldiers']  );
	};
	
	this.test__onClickTreatmentBtn = function(){
		this.mm.mock(HeroSender, 'sendTreatments');
		this.dlg.items_.treatmentBtn.click();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.herodlg.tips.fullhealth ), true, "has no heros need treatment");
		
		TestCaseSysTip.clearTip();
		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:10,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.dlg._updateForceTab(180001, [1,0,2,0,0]);
		this.dlg.items_.treatmentBtn.click();
		var needNum = TreatmentHeroHdr.getNeedItemNumber(this.g, this.dlg.forceTabHdr_.getHeroIds());
		var hasNum = this.g.getImgr().getItemNumByResId(FIXID.SALVE);
		var msg = HyperLinkMgr.formatLink(RStrUtil.makeNoSalveBuyMsg(FIXID.PKG_SALVE, needNum, hasNum));
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), msg );
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getImgr().addItem({id:1,resid:FIXID.SALVE,number:needNum});
		this.dlg.items_.treatmentBtn.click();
		assertEQ ( this.mm.params['sendTreatments'], [this.g, [1,0,2,0,0]] );
	};
	
	this.test__onClickExitBtn = function(){
		this.mm.mock(ActTowerSender, 'sendLeaveTower');
		this.dlg._onClickExitBtn();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.tower.expeddlg.tip.confirmExit );		
		
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( this.dlg.isShow(), true );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendLeaveTower'], [this.g] );
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__onClickVSBtn = function(){
		this.mm.mock(ActTowerSender, 'sendExped');
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noAssignHeros );
		
		TestCaseSysTip.clearTip();
		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:10,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:102,name:"name2",level:1,state:0,soldier:{resid:150001001,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.dlg._updateForceTab(180001, [1,0,2,0,0]);
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noHealth );
				
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(1).attrs[ATTR.HEALTH] = 100;
		this.g.getImgr().getHero(2).attrs[ATTR.HEALTH] = 100;
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noCarrySoldiers );
				
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(2).soldier.number = 10;
		this.g.getImgr().getHero(2).state = 1;
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), TQ.format(rstr.expeddlg.err.hasBusyHero, ' name2 ') );
		assertEQ ( this.dlg._onClickVSBtn(), false );
		
		assertEQ ( this.dlg.isShow(), true );
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(2).state = HERO_STATE.ACT_TOWER;
		this.dlg.items_.vsBtn.click();
		assertEQ ( this.dlg.isShow(), false );
		var target = ItemResUtil.findItemres(172001);
		assertEQ ( target.objType, OBJ_TYPE.COPYFIELD );
		assertEQ ( target.type, OBJ_TYPE.COPYFIELD );
		assertEQ ( this.mm.params['sendExped'], [this.g, target, EXPED_TYPE.ACT_TOWER, 180001, [1,0,2,0,0] ]);
		assertEQ ( this.dlg._onClickVSBtn(), true );
		
		// when auto fight state, not hide dlg
		this.mm.clear();
		this.dlg.forceShow();
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(2).state = HERO_STATE.ACT_TOWER;
		this.dlg.isAutoFight_ = true
		this.dlg.items_.vsBtn.click();
		assertEQ ( this.dlg.isShow(), true );
	};
	
	this.test__onClickAutoFightBtn = function(){
		this.mm.mock(UIM.getDlg('inputnum'), 'openDlg' );
		this.mm.mock(UIM.getDlg('inputnum'), 'setCaller' );
		
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		
		this.dlg.items_.autoFightBtn.click();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.mm.params['openDlg'], [rstr.activity.tower.expeddlg.tip.inputAutoFightMaxLayer, 100] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.dlg._onSetAutoFightMaxLayer}] );
		
		this.dlg.isAutoFight_ = true;
		this.dlg.items_.autoFightBtn.setText(rstr.activity.tower.expeddlg.btn.cancelAutoFight);
		this.dlg.items_.vsBtn.enable(false);
		this.dlg.items_.autoFightBtn.click();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
	};
	
	this.test__onSetAutoFightMaxLayer = function(){
		var autoToLayer = 0;
		this.dlg._onSetAutoFightMaxLayer(autoToLayer);
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.tower.expeddlg.tip.autoFightLessLayer ), true, "the auto fight to layer must great then curlayer");
		
		TestCaseSysTip.clearTip();		
		autoToLayer = 1;
		this.dlg._onSetAutoFightMaxLayer(autoToLayer);
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.cancelAutoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.dlg.autoToLayer_, 1 );
	};
	
	this.test__startAutoFight = function(){
		this.mm.mock(ActTowerSender, 'sendStartAutoFight');
		
		TestCaseCondition.setPreCond(null, { heros:[
				{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:10,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
				{id:2,icon:102,name:"name2",level:1,state:0,soldier:{resid:150001001,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:300,u:0}]) } ] });
		this.dlg._updateForceTab(180001, [1,0,2,0,0]);
				
		this.dlg.isAutoFight_ = false;
		this.dlg.autoToLayer_ = 10;
		this.dlg._startAutoFight();
		assertEQ ( this.mm.params['sendStartAutoFight'],  [this.g, [1,0,2,0,0], 10 ] );
		assertEQ ( this.dlg.isAutoFight_, true );
	};
	
	this.test__stopAutoFight = function(){
		this.mm.mock(ActTowerSender, 'sendStopAutoFight');
		
		this.dlg.isAutoFight_ = true;
		this.dlg._stopAutoFight();
		assertEQ ( this.mm.params['sendStopAutoFight'],  [this.g] );
		assertEQ ( this.dlg.isAutoFight_, false );
	};
});

TestCaseActTowerLastGetGiftsDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ActTowerLastGetGiftsDlg.snew(this.g);
		this.lastGetItems = [{id:4500008, number:1}, {id:4500009, number:2}];
		this.dlg.openDlg(this.lastGetItems);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:true, title:rstr.activity.tower.lastGetGiftsDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.tower.lastGetGiftsDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__initInfo = function(){
		assertEQ ( this.dlg.items_.list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.list.getItem(0).exsubs.nameAndNumber), RStrUtil.getItemColorNameByResId(4500008) + '×1' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.list.getItem(1).exsubs.nameAndNumber), RStrUtil.getItemColorNameByResId(4500009) + '×2' );
	};
});	


tqActTowerExpedDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseActTowerExpedDlg, 'TestCaseActTowerExpedDlg');
	suite.addTestCase(TestCaseActTowerLastGetGiftsDlg, 'TestCaseActTowerLastGetGiftsDlg');
};
