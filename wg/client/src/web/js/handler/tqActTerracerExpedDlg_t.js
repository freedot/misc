/*******************************************************************************/
require('./tqActTerracerExpedDlg.js')

TestCaseActTerraceExpedDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.clearUpdater();
		this.help_init_res();
		this.mm.mock(DropItemUtil, 'getDesc', ['drop desc']);
		this.herodlg = HeroDlgPresenter.snew(this.g, HeroDlgView.snew(this.g), HeroDlgModel.snew(this.g));
		this.dlg = ActTerraceExpedDlg.snew(this.g);
		this.enterTerrace = {curGate:{gateId:1, subGateId:1},stopTime:60,leftLifes:2};
		this.dlg.openDlg(this.enterTerrace);
		this.mm.clear();
	};
	
	this.tearDown = function(){
		this.dlg.hideDlg();
		TestCaseHelper.tearDown(this);
	};
	
	this.help_init_res = function(){
		res_terrace[1][0].dantiaodrop = 1900001;
		res_terrace[1][0].gateName = 'gateName1';
		res_terrace[1][0].gatePosition = 'gatePosition1';
		res_terrace[1][0].heros = [7600091];
		res_terrace[1][0].heroName = 'hero1';
		
		res_terrace[1][1].dantiaodrop = 1900002;
		res_terrace[1][1].gateName = 'gateName2';
		res_terrace[1][1].gatePosition = 'gatePosition2';
		res_terrace[1][1].heros = [7600092];
		res_terrace[1][1].heroName = 'hero2';
		
		res_terrace[1][2].dantiaodrop = 1900003;
		res_terrace[1][2].gateName = 'gateName3';
		res_terrace[1][2].gatePosition = 'gatePosition3';
		res_terrace[1][2].heros = [7600093];
		res_terrace[1][2].heroName = 'hero3';
		
		res_terrace[1][4].dantiaodrop = 1900003;
		res_terrace[1][4].gateName = 'gateName4';
		res_terrace[1][4].gatePosition = 'gatePosition4';
		res_terrace[1][4].heros = [7600093];
		res_terrace[1][4].heroName = 'hero4';
		
		res_terrace[1][5].dantiaodrop = 1900003;
		res_terrace[1][5].gateName = 'gateName5';
		res_terrace[1][5].gatePosition = 'gatePosition5';
		res_terrace[1][5].heros = [7600093];
		res_terrace[1][5].heroName = 'hero5';
		
		res_terrace[1][6].dantiaodrop = 1900003;
		res_terrace[1][6].gateName = 'gateName3';
		res_terrace[1][6].gatePosition = 'gatePosition3';
		res_terrace[1][6].heros = [7600093];
		res_terrace[1][6].heroName = 'hero8';
		
		TQ.qfind(res_fieldheros, 'id', 7600091).singlefightcap = 10;
		TQ.qfind(res_fieldheros, 'id', 7600092).singlefightcap = 20;
		TQ.qfind(res_fieldheros, 'id', 7600093).singlefightcap = 30;
		
		this.g.getImgr().getActTerrace().results = [{id:1, result:1}, {id:2, result:5}];
	};
	
	this.test_sendCheckAutoFightWhenLoginOk =function(){
		this.mm.mock(ActTerraceSender, 'sendCheckAutoFight');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendCheckAutoFight'], [this.g] );
	};
	
	this.test_reset = function(){
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.dlg.reset();
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.running_, false );
	};
	
	this.test_isRunning = function(){
		this.dlg.running_ = false;
		assertEQ ( this.dlg.isRunning(), false );
		
		this.dlg.running_ = true;
		assertEQ ( this.dlg.isRunning(), true );
	};
	
	this.test_forceShow = function(){
		this.dlg.isAutoFight_ = true;
		this.dlg.enterTerrace_ = {curGate:{gateId:1, subGateId:1},stopTime:60,leftLifes:0};
		this.dlg.hideDlg();
		this.dlg.forceShow();
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( TQ.getCSS(this.dlg.items_.leftLifes, 'width'), (0*30) + 'px' );
		
		this.dlg.dlg_ = null;
		this.dlg.forceShow();
	};	
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.activity.terrace.expeddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.terrace.expeddlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
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
	
	this.test__initInfo = function(){
		this.g.setSvrTimeS(40);

		// check gift, leftTime, gateName, gatePosition
		var enterTerrace = {curGate:{gateId:1, subGateId:1},stopTime:60,leftLifes:2};
		this.dlg.openDlg(enterTerrace);
		assertEQ ( TQ.getTextEx(this.dlg.items_.gateNo), rstr.activity.terrace.expeddlg.gateNos[1] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gift), rstr.activity.terrace.expeddlg.giftLabel + 'drop desc' );
		assertEQ ( this.mm.params['getDesc'], [1900001] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.terrace.expeddlg.leftTime , '00:00:20') );
		
		this.g.setSvrTimeS(61);
		this.dlg.openDlg(enterTerrace);
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), '', 'stopTime time is arrived' );
		
		assertEQ ( TQ.getTextEx(this.dlg.items_.gateName), 'gateName1' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gatePosition), rstr.activity.terrace.expeddlg.position + 'gatePosition1' );
		
		
		// check sub gate list
		var enterTerrace = {curGate:{gateId:1, subGateId:2},stopTime:60,leftLifes:2};
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.preBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.nextBtn.isEnable(), true );
		assertEQ ( TQ.getClass(this.dlg.items_.heroItem0), 'item_normal' );
		assertEQ ( TQ.getClass(this.dlg.items_.heroItem1), 'item_sel' );
		assertEQ ( TQ.getClass(this.dlg.items_.heroItem2), 'item_normal' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem0.items.name), 'hero1');
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem0.items.sfightcap), 10);
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem0.items.result), '★');
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem1.items.name), 'hero2');
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem1.items.sfightcap), 20);
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem1.items.result), '★★★★★');
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem2.items.name), 'hero3');
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem2.items.sfightcap), 30);
		assertEQ ( TQ.getTextEx(this.dlg.items_.heroItem2.items.result), rstr.activity.terrace.expeddlg.results[0]);
		
		
		// check my heroDropList
		var heros = [{id:1,icon:101,name:"name1",level:4,state:1,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							,{id:2,icon:101,name:"name2",level:3,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							,{id:3,icon:101,name:"name3",level:2,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							,{id:4,icon:102,name:"name4",level:1,state:HERO_STATE.ACT_TERRACE,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.myHeroList.getTitle(), 'name1' ); //, rstr.activity.terrace.expeddlg.myHeroDropTitle );
		assertEQ ( this.dlg.items_.myHeroList.getCount(), 4 );
		assertEQ ( this.dlg.items_.myHeroList.getCurSel(), 0 );
		assertEQ ( this.dlg.items_.myHeroList.getItemText(0), 'name1' );
		
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.myHeroList.getCount(), 4, 'each time need clear droplist' );
		
		this.dlg.items_.myHeroList.setCurSel(1);
		assertEQ ( this.dlg.items_.myHeroList.getTitle(), 'name2' );
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.myHeroList.getCurSel(), 1 );
		assertEQ ( this.dlg.items_.myHeroList.getTitle(), 'name2', 'save last select hero' );
		
		this.dlg.items_.myHeroList.setCurSel(3);
		var heros = [{id:1,icon:101,name:"name1",level:1,state:1,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							,{id:2,icon:101,name:"name2",level:1,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}, ATTR.CRE,{val:500,u:0}, ATTR.SFC,{val:1500,u:0}, ATTR.PH_B, {val:100, u:0}, ATTR.ST_B, {val:100, u:0}, ATTR.ST_A, {val:100, u:0}, ATTR.AG_B, {val:50, u:0}]) } ];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.myHeroList.getCurSel(), 0, 'heros changed, select 0' );
		
		var heros = [];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(enterTerrace);
		// check current select my hero attrs info
		assertEQ ( IMG.getBKImage(this.dlg.items_.icon), "url('')" );
		assertEQ ( TQ.getTextEx(this.dlg.items_.healthVal), 0 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.creditVal), 0 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.sfightCapVal), 0 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.strVal), 0 );
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'height'), '0px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.agileVal), 0 );
		assertEQ ( TQ.getCSS(this.dlg.items_.agileBar, 'height'), '0px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.phyVal), 0 );
		assertEQ ( TQ.getCSS(this.dlg.items_.phyBar, 'height'), '0px' );
		
		var heros = [{id:1,icon:101,name:"name1",level:2,state:1,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) }
							,{id:2,icon:101,name:"name2",level:1,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}, ATTR.CRE,{val:500,u:0}, ATTR.SFC,{val:1500,u:0}, ATTR.PH_B, {val:100, u:0}, ATTR.ST_B, {val:100, u:0}, ATTR.ST_A, {val:100, u:0}, ATTR.AG_B, {val:50, u:0}]) } ];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(enterTerrace);
		this.dlg.items_.myHeroList.setCurSel(1);
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.icon), '101.gif'), true);
		assertEQ ( TQ.getTextEx(this.dlg.items_.healthVal), TQ.formatColorStr(100, COLORS.HEALTH_HEALTH) );
		assertEQ ( TQ.getTextEx(this.dlg.items_.creditVal), 500 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.sfightCapVal), 1500 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.strVal), 200 );
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'height'), '100px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.agileVal), 50 );
		assertEQ ( TQ.getCSS(this.dlg.items_.agileBar, 'height'), '25px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.phyVal), 100 );
		assertEQ ( TQ.getCSS(this.dlg.items_.phyBar, 'height'), '50px' );
		
		var svrcmd = {heros:[{id:2,attrs:{"10":{val:75*ATTR_PRECISION,u:0}}}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.healthVal), TQ.formatColorStr(75, COLORS.HEALTH_FLESH_WOUND) );
		var svrcmd = {heros:[{id:2,attrs:{"10":{val:20*ATTR_PRECISION,u:0}}}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.healthVal), TQ.formatColorStr(20, COLORS.HEALTH_DEEP_WOUND) );
		this.dlg.hideDlg();
		var svrcmd = {cmd:78,heros:[{id:2,attrs:{"10":{val:10*ATTR_PRECISION,u:0}}}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.healthVal), TQ.formatColorStr(20, COLORS.HEALTH_DEEP_WOUND) );
		this.dlg.openDlg(enterTerrace);
		
		// left life
		assertEQ ( TQ.getCSS(this.dlg.items_.leftLifes, 'width'), (2*30) + 'px' );
		
		
		// check button enable state
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), true );
		
		this.g.setSvrTimeS(50);
		this.dlg.openDlg(enterTerrace);
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		
		// init auto fight info
		this.g.setSvrTimeS(100);
		this.dlg.isAutoFight_ = true;
		this.dlg.reset();
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		
		this.dlg.isAutoFight_ = true;
		this.dlg.autoToSubGateId_ = 7;
		this.g.setSvrTimeS(50);
		this.dlg._initInfo();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.cancelAutoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), true );
		this.g.setSvrTimeS(100);
		
		
		//  stop auto fight when reach user set max subGateId
		this.mm.mock(ActTerraceSender, 'sendStopAutoFight');
		this.dlg.isAutoFight_ = true;
		this.dlg.autoToSubGateId_ = 2;
		this.enterTerrace.curGate.subGateId = 2;
		this.dlg.openDlg( this.enterTerrace );
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.cancelAutoFight );
		
		this.mm.clear();
		this.enterTerrace.curGate.subGateId = 3;
		this.dlg.openDlg(this.enterTerrace);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 1);
		
		this.mm.clear();
		this.enterTerrace.curGate.subGateId = 3;
		this.dlg.openDlg(this.enterTerrace);
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 0);
		
		
		//  stop auto fight when loss life
		this.dlg.autoToSubGateId_ = 2;
		this.enterTerrace.curGate.subGateId = 2;
		this.dlg.isAutoFight_ = true;
		this.dlg.lastLifes_ = 2;
		this.enterTerrace.leftLifes = 2;
		this.dlg.openDlg( this.enterTerrace );
		assertEQ ( this.dlg.isAutoFight_, true );
		
		this.mm.clear();
		this.dlg.lastLifes_ = 2;
		this.enterTerrace.leftLifes = 1;
		this.dlg.openDlg(this.enterTerrace);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.lastLifes_, 1 );
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 1);
		
		this.mm.clear();
		this.dlg.lastLifes_ = 2;
		this.enterTerrace.leftLifes = 1;
		this.dlg.openDlg(this.enterTerrace);
		assertEQ ( this.dlg.lastLifes_, 1 );
		assertStrRepeatCount( this.mm.walkLog, 'sendStopAutoFight', 0);
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.dlg, '_onAutoFight');
		
		this.g.setSvrTimeS(50);
		this.g.update();
		assertEQ ( this.mm.walkLog, '_onAutoFight' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.terrace.expeddlg.leftTime , '00:00:10') );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		this.g.setSvrTimeS(55);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.terrace.expeddlg.leftTime , '00:00:05') );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		this.dlg.hideDlg();
		this.g.setSvrTimeS(60);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.dlg.items_.leftTime), TQ.format(rstr.activity.terrace.expeddlg.leftTime , '00:00:05'), 'when dlg hide, unregister updater' );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.autoFightBtn.isEnable(), false );
		
		
		// pop msg box when life == 0 or pass gate
		var enterTerrace = {curGate:{gateId:1, subGateId:1},stopTime:80,leftLifes:0};
		this.dlg.openDlg(enterTerrace);
		this.g.setSvrTimeS(79);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.hideDlg();
		this.g.setSvrTimeS(80);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.openDlg(enterTerrace);
		this.g.setSvrTimeS(81);
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.g.update();
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.terrace.expeddlg.noLifeMsgTip );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.dlg.running_, false );
		assertEQ ( this.dlg.isAutoFight_, false );
		
		this.g.getGUI().hideMsgBox();
		var enterTerrace = {curGate:{gateId:1, subGateId:8},stopTime:100,leftLifes:1};
		this.dlg.openDlg(enterTerrace);
		this.g.setSvrTimeS(99);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.hideDlg();
		this.g.setSvrTimeS(100);
		this.g.update();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.dlg.openDlg(enterTerrace);
		this.g.setSvrTimeS(101);
		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = true;
		this.g.update();
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.terrace.expeddlg.passGateMsgTip );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.dlg.running_, false );
		assertEQ ( this.dlg.isAutoFight_, false );
	};
	
	this.help__onAutoFight_setCond = function(){
		this.mm.clear();
		this.dlg.isAutoFight_ = true;
		this.dlg.enterTerrace_.leftLifes = 1;
		this.dlg.enterTerrace_.stopTime = this.g.getSvrTimeS();
	};
	
	this.test__onAutoFight = function(){
		var r_vsRet = [true];
		this.mm.mock(this.dlg, '_onClickTreatmentBtn');
		this.mm.mock(this.dlg, '_onClickVSBtn', r_vsRet);
		
		this.help__onAutoFight_setCond();
		this.dlg.isAutoFight_ = false;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg.enterTerrace_.leftLifes = 0;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg.enterTerrace_.stopTime = this.g.getSvrTimeS() + 1;
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '' );
		
		this.help__onAutoFight_setCond();
		this.dlg._onAutoFight();
		assertEQ ( this.mm.walkLog, '_onClickTreatmentBtn,_onClickVSBtn' );
		assertEQ ( this.dlg.isAutoFight_, true );
		
		this.help__onAutoFight_setCond();
		r_vsRet[0] = false;
		this.dlg._onAutoFight();
		assertEQ ( this.dlg.isAutoFight_, false );
	};	
	
	this.test__onSvrPkg = function(){
		// left life is zero , jump main dlg
		this.mm.mock(UIM.getPanel('sysmsg'), 'append');
		
		var TestFightDemoDlg = Class.extern(function(){
			this.hideCaller_ = null;
			this.armyId_ = null;
			this.fightId_ = null;
			this.isShow_ = false;
			this.setHideCaller = function(caller) {
				this.hideCaller_ = caller;
			};
			
			this.openDlg = function(armyId, fightId) {
				this.armyId_ = armyId;
				this.fightId_ = fightId;
				this.isShow_ = true;
			};
			
			this.hideDlg = function(){
				this.hideCaller_.caller.call(this.hideCaller_.self);
			};
			
			this.isShow = function(){
				return this.isShow_;
			};
		});
		UIM.regDlg('fightmap', TestFightDemoDlg.snew());

		this.dlg.isAutoFight_ = true;
		this.dlg.running_ = false;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{enterTerrace:{curGate:{gateId:1, subGateId:1},leftLifes:0, isExit:1}}});
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( this.dlg.running_, false);
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{enterTerrace:{curGate:{gateId:1, subGateId:1},leftLifes:1 }}});
		assertEQ ( this.dlg.running_, true);
		
		this.dlg.isAutoFight_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{enterTerrace:{curGate:{gateId:1, subGateId:1},leftLifes:1, fightDemo:{armyId:1, fightId:2}}}});
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
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{enterTerrace:{curGate:{gateId:1, subGateId:1},leftLifes:0, fightDemo:{armyId:1, fightId:2}}}});
		assertEQ ( this.mm.params['append'], [CHAT_TAG.SYS, rstr.activity.terrace.expeddlg.noLifeSysTip]);
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.enterTerrace_.leftLifes, 0 );
			
		this.mm.clear()
		this.dlg.isAutoFight_ = true;
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{enterTerrace:{curGate:{gateId:1, subGateId:8},leftLifes:1, fightDemo:{armyId:1, fightId:2}}}});
		assertEQ ( this.mm.params['append'], [CHAT_TAG.SYS, rstr.activity.terrace.expeddlg.passGateSysTip]);
		assertEQ ( this.dlg.isShow(), false);
		assertEQ ( this.dlg.isAutoFight_, false );
		assertEQ ( this.dlg.enterTerrace_.curGate.subGateId, 8 );
			
		this.mm.clear(); // format stoptime
		this.g.setSvrTimeS(1001);
		var cmd = {enterTerrace:{stopTime:1000,curGate:{gateId:1, subGateId:5},leftLifes:1}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( cmd.enterTerrace.stopTime, 1002 );			
	};
	
	this.test__onSvrPkgInAutoFightState = function(){
		this.mm.mock(ActTerraceSender, 'sendGetBaseInfo');
		this.dlg.isAutoFight_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:{autoFight:1,autoToGate:2}});
		assertEQ (this.dlg.isAutoFight_, false);
		assertEQ (this.dlg.autoToSubGateId_, 2);
		assertEQ (this.mm.walkLog, '' );
		this.g.sendEvent({eid:EVT.SAVE_FORCES, sid:0});
		assertEQ (this.dlg.isAutoFight_, true);
		assertEQ (this.mm.params['sendGetBaseInfo'], [this.g] );
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
	
	this.test__onClickTreatmentBtn = function(){
		// check my heroDropList
		var heros = [];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(this.enterTerrace);

		this.mm.mock(TreatmentHeroHdr, 'treatmentHeros');
		this.dlg.items_.treatmentBtn.click();
		assertEQ ( this.mm.params['treatmentHeros'], [this.g, [0] ] );
		
		this.mm.clear()
		var heros = [{id:4,icon:101,name:"name3",level:1,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) } ];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(this.enterTerrace);
		this.dlg.items_.myHeroList.setCurSel(0);
		this.dlg.items_.treatmentBtn.click();
		assertEQ ( this.mm.params['treatmentHeros'], [this.g, [4] ] );
	};
	
	this.test__onClickExitBtn = function(){
		this.mm.clear();
		this.mm.mock(ActTerraceSender, 'sendLeaveTerrace');
		this.dlg.items_.exitBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.terrace.expeddlg.confirmExit );		
		
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( this.dlg.isShow(), true );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendLeaveTerrace'], [this.g] );
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__onClickVSBtn = function(){
		this.mm.mock(ActTerraceSender, 'sendExped');
		
		this.dlg.items_.myHeroList.setCurSel(-1);
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noAssignHeros );
		
		TestCaseSysTip.clearTip();
		var heros = [{id:4,icon:101,name:"name4",level:1,state:0,prof:1,soldier:{resid:150001002,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.CO,{val:1000,u:0}]) } ];
		TestCaseCondition.setPreCond(null, { heros:heros } );
		this.dlg.openDlg(this.enterTerrace);
		this.dlg.items_.myHeroList.setCurSel(0);
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), rstr.expeddlg.err.noHealth );
				
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(4).attrs[ATTR.HEALTH] = 100;
		this.g.getImgr().getHero(4).state = 1;
		this.dlg.items_.vsBtn.click();
		assertEQ ( TestCaseSysTip.getSystip(), TQ.format(rstr.expeddlg.err.hasBusyHero, ' name4 ') );
		assertEQ ( this.dlg._onClickVSBtn(), false );
		
		TestCaseSysTip.clearTip();
		this.dlg.isAutoFight_ = false;
		assertEQ ( this.dlg.isShow(), true );
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(4).state = HERO_STATE.ACT_TERRACE;
		this.dlg.items_.vsBtn.click();
		assertEQ ( this.dlg.isShow(), false );
		var curGatesRes = res_terrace[1];
		var target = curGatesRes[1 - 1];
		assertEQ ( target.objType, OBJ_TYPE.COPYFIELD );
		assertEQ ( target.type, OBJ_TYPE.COPYFIELD );
		assertEQ ( this.mm.params['sendExped'], [this.g, target, EXPED_TYPE.ACT_TERRACE, 180001, [4] ]);
		assertEQ ( this.dlg._onClickVSBtn(), true );
		
		this.dlg.forceShow();
		this.dlg.isAutoFight_ = true;
		TestCaseSysTip.clearTip();
		this.g.getImgr().getHero(4).state = HERO_STATE.ACT_TERRACE;
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
		assertEQ ( this.mm.params['openDlg'], [rstr.activity.terrace.expeddlg.inputAutoFightMaxSubGateId, 7] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.dlg._onSetAutoFightMaxSubGateId}] );
		
		this.dlg.isAutoFight_ = true;
		this.dlg.items_.autoFightBtn.setText(rstr.activity.tower.expeddlg.btn.cancelAutoFight);
		this.dlg.items_.vsBtn.enable(false);
		this.dlg.items_.autoFightBtn.click();
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.autoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), true );
	};
	
	this.test__onSetAutoFightMaxSubGateId = function(){
		var autoToLayer = 0;
		this.dlg._onSetAutoFightMaxSubGateId(autoToLayer);
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.activity.terrace.expeddlg.autoFightLessSubGateId ), true, "the auto fight to layer must great then curlayer");
		
		TestCaseSysTip.clearTip();
		autoToLayer = 1;
		this.dlg._onSetAutoFightMaxSubGateId(autoToLayer);
		assertEQ ( this.dlg.items_.autoFightBtn.getText(), rstr.activity.tower.expeddlg.btn.cancelAutoFight );
		assertEQ ( this.dlg.items_.vsBtn.isEnable(), false );
		assertEQ ( this.dlg.isAutoFight_, true );
		assertEQ ( this.dlg.autoToSubGateId_, 1 );
	};
	
	this.test__startAutoFight = function(){
		this.mm.mock(ActTerraceSender, 'sendStartAutoFight');
		
		this.dlg.isAutoFight_ = false;
		this.dlg.autoToSubGateId_ = 4;
		this.dlg._startAutoFight();
		assertEQ ( this.mm.params['sendStartAutoFight'],  [this.g, [0], 4 ] );
		assertEQ ( this.dlg.isAutoFight_, true );
	};
	
	this.test__stopAutoFight = function(){
		this.mm.mock(ActTerraceSender, 'sendStopAutoFight');
		
		this.dlg.isAutoFight_ = true;
		this.dlg._stopAutoFight();
		assertEQ ( this.mm.params['sendStopAutoFight'],  [this.g] );
		assertEQ ( this.dlg.isAutoFight_, false );
	};
});

TestCaseHorizontalList = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mm.mock(DropItemUtil, 'getDesc', ['drop desc']);
		this.dlg = ActTerraceExpedDlg.snew(this.g);
		var enterTerrace = {curGate:{gateId:1, subGateId:1},stopTime:60};
		this.dlg.openDlg(enterTerrace);
		this.list = this.dlg.subGateList_;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setItemCount = function(){
		var params = [];
		var ob = function(itemIdx, item){
			params.push({itemIdx:itemIdx, item:item} );
		};
		this.list.setObserver({self:this, caller:ob});
		this.list.setItemCount(7, 2);
		assertEQ ( this.list.items_.preBtn.isEnable(), false );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( params.length, 2 );
		assertEQ ( params[0] , {itemIdx:0, item:this.list.items_.heroItem0} );
		assertEQ ( params[1] , {itemIdx:1, item:this.list.items_.heroItem1} );
		var lastItem0Name =  this.list.items_.heroItem0.items.name;
		var lastItem1Name =  this.list.items_.heroItem1.items.name;
		assertEQ ( this.list.items_.heroItem0.items.name != null, true );
		assertEQ ( this.list.items_.heroItem1.items.name != null, true );
		
		// only create tmpl one time
		params = [];
		this.list.setItemCount(7, 3);
		assertEQ ( this.list.items_.preBtn.isEnable(), false );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( params.length, 3 );
		assertEQ ( params[0] , {itemIdx:0, item:this.list.items_.heroItem0} );
		assertEQ ( params[1] , {itemIdx:1, item:this.list.items_.heroItem1} );
		assertEQ ( params[2] , {itemIdx:2, item:this.list.items_.heroItem2} );
		assertEQ ( this.list.items_.heroItem0.items.name == lastItem0Name, true, 'not recreate' );
		assertEQ ( this.list.items_.heroItem1.items.name == lastItem1Name, true, 'not recreate' );
		assertEQ ( this.list.items_.heroItem2.items.name != null, true );
	};
	
	this.test_clickBtn = function(){
		var params = [];
		var ob = function(itemIdx, item){
			params.push({itemIdx:itemIdx, item:item} );
		};
		this.list.setObserver({self:this, caller:ob});
		this.list.setItemCount(7, 3);
		
		params = [];
		this.list.items_.nextBtn.click();
		assertEQ ( this.list.items_.preBtn.isEnable(), true );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( params.length, 3 );
		assertEQ ( params[0] , {itemIdx:3, item:this.list.items_.heroItem0} );
		assertEQ ( params[1] , {itemIdx:4, item:this.list.items_.heroItem1} );
		assertEQ ( params[2] , {itemIdx:5, item:this.list.items_.heroItem2} );
		assertEQ ( TQ.getClass(this.list.items_.heroItem0), 'item_normal' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem1), 'item_normal' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem2), 'item_normal' );
		
		params = [];
		this.list.items_.preBtn.click();
		assertEQ ( this.list.items_.preBtn.isEnable(), false );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( TQ.getClass(this.list.items_.heroItem0), 'item_sel' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem1), 'item_normal' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem2), 'item_normal' );		
		
		params = [];
		this.list.items_.nextBtn.click();
		params = [];
		this.list.items_.nextBtn.click();
		assertEQ ( this.list.items_.preBtn.isEnable(), true );
		assertEQ ( this.list.items_.nextBtn.isEnable(), false );
		assertEQ ( params.length, 1 );
		assertEQ ( params[0] , {itemIdx:6, item:this.list.items_.heroItem0} );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem0, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem1, 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem2, 'display'), 'none' );
		
		params = [];
		this.list.items_.preBtn.click();
		assertEQ ( this.list.items_.preBtn.isEnable(), true );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( params.length, 3 );
		assertEQ ( params[0] , {itemIdx:3, item:this.list.items_.heroItem0} );
		assertEQ ( params[1] , {itemIdx:4, item:this.list.items_.heroItem1} );
		assertEQ ( params[2] , {itemIdx:5, item:this.list.items_.heroItem2} );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem0, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem1, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem2, 'display'), 'block' );
	};
	
	this.test_setCurSel = function(){
		var params = [];
		var ob = function(itemIdx, item){
			params.push({itemIdx:itemIdx, item:item} );
		};
		this.list.setObserver({self:this, caller:ob});
		this.list.setItemCount(7, 3);
		
		params = []
		this.list.setCurSel(4);
		assertEQ ( this.list.items_.preBtn.isEnable(), true );
		assertEQ ( this.list.items_.nextBtn.isEnable(), true );
		assertEQ ( params.length, 3 );
		assertEQ ( params[0] , {itemIdx:3, item:this.list.items_.heroItem0} );
		assertEQ ( params[1] , {itemIdx:4, item:this.list.items_.heroItem1} );
		assertEQ ( params[2] , {itemIdx:5, item:this.list.items_.heroItem2} );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem0, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem1, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.list.items_.heroItem2, 'display'), 'block' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem0), 'item_normal' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem1), 'item_sel' );
		assertEQ ( TQ.getClass(this.list.items_.heroItem2), 'item_normal' );		
	};
});

TestCaseVerticalAttrBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mm.mock(DropItemUtil, 'getDesc', ['drop desc']);
		this.dlg = ActTerraceExpedDlg.snew(this.g);
		var enterTerrace = {curGate:{gateId:1, subGateId:1},stopTime:60};
		this.dlg.openDlg(enterTerrace);
		this.maxHight = 100;
		this.bar = VerticalAttrBar.snew(this.g, this.maxHight, this.dlg.items_.strBar, this.dlg.items_.strVal);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setValue = function(){
		this.dlg.items_.strBar.offsetHeight = 50;
		this.dlg.items_.strVal.offsetHeight = 16;
		
		TQ.setCSS(this.dlg.items_.strBar, 'left', '50px');
		TQ.setCSS(this.dlg.items_.strBar, 'top', '150px');
		this.bar.setValue(0, 10);
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'top'), '200px');
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'height'), '0px');
		assertEQ ( TQ.getCSS(this.dlg.items_.strVal, 'top'), (200 - 16) + 'px');
		assertEQ ( TQ.getTextEx(this.dlg.items_.strVal), 0 );
		
		this.dlg.items_.strBar.offsetHeight = 0;
		this.bar.setValue(7, 10);
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'top'), (200 - 100*7/10 ) + 'px');
		assertEQ ( TQ.getCSS(this.dlg.items_.strBar, 'height'), (100*7/10) + 'px');
		assertEQ ( TQ.getCSS(this.dlg.items_.strVal, 'top'), (200 - 100*7/10 - 16) + 'px');
		assertEQ ( TQ.getTextEx(this.dlg.items_.strVal), 7 );
	};
});

tqActTerracerExpedDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseActTerraceExpedDlg, 'TestCaseActTerraceExpedDlg');
	suite.addTestCase(TestCaseHorizontalList, 'TestCaseHorizontalList');
	suite.addTestCase(TestCaseVerticalAttrBar, 'TestCaseVerticalAttrBar');
};
