/*******************************************************************************/
require('./tqActTerraceDlg.js')

TestCaseActTerraceDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.getImgr().getRoleRes().level = res_enter_terrace_need_rolelevel;
		this.dlg = ActTerraceDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_canNotOpenDlgWhenRoleLevelNotArrived = function(){
		this.dlg.hideDlg();
		this.g.getImgr().getRoleRes().level = res_enter_terrace_need_rolelevel - 1;
		this.dlg.openDlg();
		assertEQ ( this.dlg.isShow(), false );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), TQ.format(rstr.activity.terrace.maindlg.tip.roleLevelNotArrived, res_enter_terrace_need_rolelevel) );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.activity.terrace.maindlg.title, pos:{x:"center", y:40}, uicfg:uicfg.activity.terrace.maindlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_changeGateBtnUIBackWhenIE6 = function(){
		assertEQ ( this.dlg.items_.gate1.getUIBack(), uiback.btn.terracegatebtn);
		assertEQ ( this.dlg.items_.gate9.getUIBack(), uiback.btn.terracegatebtn);
		
		this.mm.mock(TQ, 'isIE6', [true]);
		this.dlg._afterCreate();
		assertEQ ( this.dlg.items_.gate1.getUIBack(), uiback.btn.forIE6Terracegatebtn);
		assertEQ ( this.dlg.items_.gate9.getUIBack(), uiback.btn.forIE6Terracegatebtn);
	};
	
	this.test__initInfo = function(){
		assertEQ ( this.dlg.items_.gate1.isPress(), true, 'click first gate btn when first open dlg' );
		this.mm.mock(this.dlg.items_.gate1, 'click' );
		this.mm.mock(ActTerraceSender, 'sendGetBaseInfo');
		this.mm.mock(UIM.getDlg('actterraceexped'), 'reset');
		this.dlg._initInfo();
		assertEQ ( this.mm.walkLog, 'sendGetBaseInfo,reset', 'not need click gate btn when second open dlg' );
		assertEQ ( this.mm.params['sendGetBaseInfo'], [this.g] );
		assertEQ ( this.mm.params['reset'], [] );
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayFreeTimes),  TQ.format(rstr.activity.terrace.maindlg.lbl.todayFreeTimes, 0));
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayItemTimes), TQ.format(rstr.activity.terrace.maindlg.lbl.todayItemTimes, 0));	
	};
	
	this.help_init_res = function(){
		res_terrace[1][0].gateName = 'gateName1';
		res_terrace[1][0].heros = [7600091];
		res_terrace[1][0].heroName = 'hero1';
		res_terrace[1][1].heros = [7600092];
		res_terrace[1][1].heroName = 'hero2';
		res_terrace[1][2].heros = [7600093];
		res_terrace[1][2].heroName = 'hero3';
		res_terrace[1][3].heros = [7600094];
		res_terrace[1][3].heroName = 'hero4';
		res_terrace[1][4].heros = [7600095];
		res_terrace[1][4].heroName = 'hero5';
		res_terrace[1][5].heros = [7600096];
		res_terrace[1][5].heroName = 'hero6';
		res_terrace[1][6].heros = [7600097];
		res_terrace[1][6].heroName = 'hero7';
		
		res_terrace[3][0].gateName = 'gateName3';
		res_terrace[3][0].heros = [7600091];
		res_terrace[3][0].heroName = 'hero1';
		res_terrace[3][1].heros = [7600092];
		res_terrace[3][1].heroName = 'hero2';
		res_terrace[3][2].heros = [7600093];
		res_terrace[3][2].heroName = 'hero3';
		res_terrace[3][3].heros = [7600094];
		res_terrace[3][3].heroName = 'hero4';
		res_terrace[3][4].heros = [7600095];
		res_terrace[3][4].heroName = 'hero5';
		res_terrace[3][5].heros = [7600096];
		res_terrace[3][5].heroName = 'hero6';
		res_terrace[3][6].heros = [7600097];
		res_terrace[3][6].heroName = 'hero7';
		
		res_terrace[4][0].gateName = 'gateName4';
		res_terrace[4][0].heros = [7600091];
		res_terrace[4][0].heroName = 'hero41';
		res_terrace[4][1].heros = [7600092];
		res_terrace[4][1].heroName = 'hero42';
		res_terrace[4][2].heros = [7600093];
		res_terrace[4][2].heroName = 'hero43';
		res_terrace[4][3].heros = [7600094];
		res_terrace[4][3].heroName = 'hero44';
		res_terrace[4][4].heros = [7600095];
		res_terrace[4][4].heroName = 'hero45';
		res_terrace[4][5].heros = [7600096];
		res_terrace[4][5].heroName = 'hero46';
		res_terrace[4][6].heros = [7600097];
		res_terrace[4][6].heroName = 'hero47';
		
		TQ.qfind(res_fieldheros, 'id', 7600091).singlefightcap = 10;
		TQ.qfind(res_fieldheros, 'id', 7600092).singlefightcap = 20;
		TQ.qfind(res_fieldheros, 'id', 7600093).singlefightcap = 30;
		TQ.qfind(res_fieldheros, 'id', 7600094).singlefightcap = 40;
		TQ.qfind(res_fieldheros, 'id', 7600095).singlefightcap = 50;
		TQ.qfind(res_fieldheros, 'id', 7600096).singlefightcap = 60;
		TQ.qfind(res_fieldheros, 'id', 7600097).singlefightcap = 70;
	};
	
	this.test__onSvrPkg = function(){
		this.help_init_res();		
		
		// check btn enable state
		this.dlg.dlg_.hide();
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:1}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isEnable(), true );
		assertEQ ( this.dlg.items_.gate2.isEnable(), true );
		assertEQ ( this.dlg.items_.gate9.isEnable(), true );
		
		this.dlg.dlg_.show();
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:1}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isEnable(), true );
		assertEQ ( this.dlg.items_.gate2.isEnable(), false );
		assertEQ ( this.dlg.items_.gate9.isEnable(), false );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:1}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isEnable(), true );
		assertEQ ( this.dlg.items_.gate2.isEnable(), false );
		assertEQ ( this.dlg.items_.gate9.isEnable(), false );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:2}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isEnable(), true );
		assertEQ ( this.dlg.items_.gate2.isEnable(), true );
		assertEQ ( this.dlg.items_.gate3.isEnable(), false );
		assertEQ ( this.dlg.items_.gate9.isEnable(), false );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:10}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isEnable(), true );
		assertEQ ( this.dlg.items_.gate9.isEnable(), true );
		
		
		// check freeTimes, itemTimes
		var cmd = {baseInfo:{today:{maxTimes:3, freeTimes:2, itemTimes:1}, curGate:{gateId:1}, maxGate:{gateId:8}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayFreeTimes),  TQ.format(rstr.activity.terrace.maindlg.lbl.todayFreeTimes, 2, 3));
		assertEQ ( TQ.getTextEx(this.dlg.items_.todayItemTimes), TQ.format(rstr.activity.terrace.maindlg.lbl.todayItemTimes, 1));
		
		
		// select first gate, gate hero list
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:0}, maxGate:{gateId:8}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate1.isPress(), true );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:10}, maxGate:{gateId:8}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate9.isPress(), true );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:3}, maxGate:{gateId:8}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate3.isPress(), true );
		
		var cmd = {baseInfo:{today:{freeTimes:2, itemTimes:1}, curGate:{gateId:4}, maxGate:{gateId:8}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.dlg.items_.gate3.isPress(), false );
		assertEQ ( this.dlg.items_.gate4.isPress(), true );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gateName), 'gateName4' );
		assertEQ ( this.dlg.items_.heroList.getCount(), 7 );
		var item0 = this.dlg.items_.heroList.getItem(0);
		var item1 = this.dlg.items_.heroList.getItem(1);
		var item6 = this.dlg.items_.heroList.getItem(6);
		assertEQ ( TQ.getTextEx(item0.exsubs.no), 1 );
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'hero41' );
		assertEQ ( TQ.getTextEx(item0.exsubs.sfightcap),  10 );
		assertEQ ( TQ.getTextEx(item1.exsubs.no), 2 );
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'hero42' );
		assertEQ ( TQ.getTextEx(item1.exsubs.sfightcap),  20 );
		assertEQ ( TQ.getTextEx(item6.exsubs.no), 7 );
		assertEQ ( TQ.getTextEx(item6.exsubs.name), 'hero47' );
		assertEQ ( TQ.getTextEx(item6.exsubs.sfightcap),  70 );
		
		
		// update results
		var cmd = {results:[{id:1, result:0},{id:2, result:2}] };
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.g.getImgr().getActTerrace().results, cmd.results );
		var cmd = {results:[{id:3, result:1}] };
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACT_TERRACE, data:cmd});
		assertEQ ( this.g.getImgr().getActTerrace().results, [{id:1, result:0},{id:2, result:2},{id:3, result:1}] );
		
		
		// when recv enterTerrace, close self dlg
		cmd = {data:{enterTerrace:{curGate:{gateId:1, subGateId:1},stopTime:60,leftLifes:2}}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test__onClickGateBtn = function(){
		this.help_init_res();
		
		this.dlg.items_.gate3.click();
		assertEQ ( this.dlg.items_.gate3.isPress(), true );
		assertEQ ( this.dlg.items_.gate4.isPress(), false );
		assertEQ ( TQ.getTextEx(this.dlg.items_.gateName), 'gateName3' );
	};
	
	this.test__onClickBuyItemBtn = function(){
		this.mm.mock(UIM.getDlg('buyitem'), 'openDlg');
		this.dlg.items_.buyBtn.click();
		assertEQ ( this.mm.params['openDlg'], [{id:0, resid:FIXID.HEIMULING, number:100000}] );
	};
	
	this.test__onClickEnterBtn = function(){
		this.mm.mock(ActTerraceSender, 'sendEnterTerrace');
		
		this.help_init_res();
		this.dlg.items_.gate3.click();
		
		this.g.getImgr().getActTerrace().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.itemTimes = 0;
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.mm.params['sendEnterTerrace'], [this.g, 3] );
		
		this.mm.clear();
		this.g.getImgr().getActTerrace().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.itemTimes = 1;
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.HEIMULING, num:1} });
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.mm.params['sendEnterTerrace'], [this.g, 3] );
		
		this.mm.clear();
		this.g.getImgr().getActTerrace().baseInfo.today.maxTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.freeTimes = 1;
		this.g.getImgr().getActTerrace().baseInfo.today.itemTimes = 0;
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.mm.params['sendEnterTerrace'], [this.g, 3] );
		
		this.mm.clear();
		this.g.getImgr().getActTerrace().baseInfo.today.maxTimes = 3;
		this.g.getImgr().getActTerrace().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.itemTimes = 0;
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.mm.params['sendEnterTerrace'], [this.g, 3] );
		
		this.mm.clear();
		this.g.getImgr().getActTerrace().baseInfo.today.maxTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.freeTimes = 2;
		this.g.getImgr().getActTerrace().baseInfo.today.itemTimes = 0;
		this.dlg.items_.enterBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.activity.terrace.maindlg.lbl.confirmUseItem );
		this.g.getGUI().msgBoxClick(MB_IDYES+1);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendEnterTerrace'], [this.g, 3] );
	};
});

tqActTerraceDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseActTerraceDlg, 'TestCaseActTerraceDlg');
};
