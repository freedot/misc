/*******************************************************************************/
require('./tqPayActDlg.js')

TestCasePayActDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		res_pay_act_gifts=[{'itemid':3000246,'itemtip':'内含武将经验卡*20、精力卡*10、初级招贤榜*20，黑木令*5、高级迁城令*1、斗王弓*1','pri':1,'id':1,'allpay':1000}
		,{'itemid':3000248,'itemtip':'内含武将经验卡*30、精力卡*10、初级精华宝盒*10、初级任务箱包*10、排程卡*2、高级免战牌*1、斗王盔*1','pri':2,'id':2,'allpay':2000}
		,{'itemid':3000250,'itemtip':'内含武将经验卡*20、精力卡*10、中级精华宝盒*10、中级任务箱包*10、4级灵石礼包*1、斗王甲*1','pri':3,'id':3,'allpay':5000}
		,{'itemid':3000252,'itemtip':'内含武将经验卡*30、精力卡*10、人和密卷*1、山羊*1、4级灵石礼包*3、斗王靴*1','pri':4,'id':4,'allpay':10000}
		,{'itemid':3000254,'itemtip':'内含武将经验卡*40、精力卡*20、地利密卷*1、阵法残页盒*1、5级灵石礼包*1、斗王珮*1、斗王环*1','pri':5,'id':5,'allpay':20000}
		,{'itemid':3000256,'itemtip':'内含武将经验卡*50、精力卡*25、天时密卷*1、惊帆*1、5级灵石礼包*3、狂战斧*1','pri':6,'id':6,'allpay':50000}
		];


		res_pay_act_returns=[{'desc':'充值1-999金币，返点40%；','id':1,'returnper':40,'allpay':1000}
		,{'desc':'充值1000-2999金币，返点50%；','id':2,'returnper':50,'allpay':3000}
		,{'desc':'充值3000-4999金币，返点55%；','id':3,'returnper':55,'allpay':5000}
		,{'desc':'充值5000-9999金币，返点65%；','id':4,'returnper':65,'allpay':10000}
		,{'desc':'充值10000-19999金币，返点80%；','id':5,'returnper':80,'allpay':20000}
		,{'desc':'充值20000-49999金币，返点85%；','id':6,'returnper':85,'allpay':50000}
		,{'desc':'充值大于50000金币，返点100%；','id':7,'returnper':100,'allpay':99999999}
		];

		
		this.dlg = PayActDlg.snew(this.g);
		this.g.clearUpdater();
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.payActDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.payActDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};	
	
	this.test_noUpdateWhenDlgHide = function(){
		this.dlg.hideDlg();
		var cmd = {payActAllGold:2};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().payGold) != 2, true );
		
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().payGold), 2 );
	};
	
	this.test_autoUpdaterLeftTime = function(){
		var startTime = 1398470000 + 1*24*3600 + 1000;
		this.g.setSvrTimeS(startTime);
		
		var cmd = {payActTime:{start:1398470000,stop:1398470000+3*24*3600}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		var leftTime = 1398470000+3*24*3600+24*3600 - this.g.getSvrTimeS();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().leftTime), TQ.format(rstr.payActDlg.lbl.leftTime, TQ.formatTime(2, leftTime) ) );
		
		this.g.setSvrTimeS(startTime + 1);
		this.g.update();
		var leftTime = 1398470000+3*24*3600+24*3600 - this.g.getSvrTimeS();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().leftTime), TQ.format(rstr.payActDlg.lbl.leftTime, TQ.formatTime(2, leftTime) ) );
		
		this.dlg.hideDlg();		
		this.g.setSvrTimeS(startTime + 2);
		this.g.update();
		var leftTime = 1398470000+3*24*3600+24*3600 - (startTime + 1);
		assertEQ ( TQ.getTextEx(this.dlg.getItems().leftTime), TQ.format(rstr.payActDlg.lbl.leftTime, TQ.formatTime(2, leftTime) ), 'when dlg hide, not update' );
	};
	
	this.test_onSvrPkg = function(){
		var cmd = {payGiftGots:[1,0,0,0,0,0], payActAllGold:1, payActTime:{start:2,stop:3}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( this.g.getImgr().getPayAct().payGiftGots, [1,0,0,0,0,0] );
		assertEQ ( this.g.getImgr().getPayAct().payActAllGold, 1);
		assertEQ ( this.g.getImgr().getPayAct().payActTime, {start:2,stop:3});
	};
	
	this.test_onPayActWhenDlgHide = function(){
		this.g.setSvrTimeS(1398470000 + 1*24*3600 + 1000);
		var cmd = {payActAllGold:1};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().payGold), 1 );
		
		this.dlg.hideDlg();
		cmd = {payActAllGold:2};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().payGold), 1 );
	};
	
	this.test_onPayAct = function(){
		var progbarLen = 458;
		this.g.setSvrTimeS(1398470000 + 1*24*3600 + 1000);
		var cmd = {payGiftGots:[1,0,0,0,0,0], payActAllGold:1, payActTime:{start:1398470000,stop:1398470000+3*24*3600}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		var leftTime = 1398470000+3*24*3600+24*3600 - this.g.getSvrTimeS();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().actTime), TQ.format(rstr.payActDlg.lbl.payActTime, TQ.formatDate(1398470000), TQ.formatDate(1398470000+3*24*3600) ) );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().leftTime), TQ.format(rstr.payActDlg.lbl.leftTime, TQ.formatTime(2, leftTime) ) );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().payGold), 1 );
		var leftGold = res_pay_act_gifts[0].allpay - 1;
		var levelGift = TQ.format(rstr.payActDlg.lbl.nextLevelGift, 1);
		assertEQ ( TQ.getTextEx(this.dlg.getItems().nextLevelPayGold), TQ.format(rstr.payActDlg.lbl.nextLevelPayGold, leftGold, levelGift) );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnPer), '40%' );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnVal), '10' + rstr.comm.giftgold );
		var w = (progbarLen/res_pay_act_gifts.length) * (1/res_pay_act_gifts[0].allpay);
		assertEQ ( TQ.getCSS(this.dlg.getItems().valProg, 'width'), w + 'px' );
		
		var cmd = {payActAllGold:1500};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		var leftGold = res_pay_act_gifts[1].allpay - 1500;
		var levelGift = TQ.format(rstr.payActDlg.lbl.nextLevelGift, 2);
		assertEQ ( TQ.getTextEx(this.dlg.getItems().nextLevelPayGold), TQ.format(rstr.payActDlg.lbl.nextLevelPayGold, leftGold, levelGift) );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnPer), '50%' );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnVal), '750' + rstr.comm.giftgold );
		var w = (progbarLen/res_pay_act_gifts.length) * ( 1 + (500/(res_pay_act_gifts[1].allpay - res_pay_act_gifts[0].allpay)));
		assertEQ ( TQ.getCSS(this.dlg.getItems().valProg, 'width'), w + 'px' );
		
		var cmd = {payActAllGold:1000000};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().nextLevelPayGold), '' );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnPer), '100%' );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnVal), '1000000' + rstr.comm.giftgold );
		var w = (progbarLen/res_pay_act_gifts.length) * res_pay_act_gifts.length;
		assertEQ ( TQ.getCSS(this.dlg.getItems().valProg, 'width'), w + 'px' );
	};
	
	this.test_payBtn = function(){
		this.mm.mock(JMISC, 'openPayWnd' );
		this.dlg.getItems().payBtn.click();
		assertEQ ( this.mm.params['openPayWnd'], [] );
	};
	
	this.test_items_tips = function(){
		var tip = TTIP.getTipById(this.dlg.getItems().list.getItem(0).exsubs.tooltips['$item']); tip.getTip();
		assertEQ(tip.getTipMsg(), TIPM.makeItemTip(res_pay_act_gifts[0].itemtip));
		var tip = TTIP.getTipById(this.dlg.getItems().list.getItem(1).exsubs.tooltips['$item']); tip.getTip();
		assertEQ(tip.getTipMsg(), TIPM.makeItemTip(res_pay_act_gifts[1].itemtip));
	};
	
	this.test_items_giftNeedPayNumber = function(){
		assertEQ ( TQ.getTextEx(this.dlg.getItems().list.getItem(0).exsubs.number), res_pay_act_gifts[0].allpay);
		assertEQ ( TQ.getTextEx(this.dlg.getItems().list.getItem(1).exsubs.number), res_pay_act_gifts[1].allpay);
		assertEQ ( TQ.getTextEx(this.dlg.getItems().list.getItem(5).exsubs.number), res_pay_act_gifts[5].allpay);
	};
	
	this.test_items_getBtnState = function(){
		var cmd = {payGiftGots:[1,0,0,0,0,0],payActAllGold:2500};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( this.dlg.getItems().list.getItem(0).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.getItems().list.getItem(1).exsubs.getBtn.isEnable(), true );
		assertEQ ( this.dlg.getItems().list.getItem(2).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.getItems().list.getItem(3).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.getItems().list.getItem(4).exsubs.getBtn.isEnable(), false );
		assertEQ ( this.dlg.getItems().list.getItem(5).exsubs.getBtn.isEnable(), false );
	};
	
	this.test_items_clickGetBtn = function(){
		this.mm.mock(ActivityValSender, 'sendGetPayActReward');
		var cmd = {payGiftGots:[1,0,0,0,0,0],payActAllGold:2500};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		this.dlg.getItems().list.getItem(1).exsubs.getBtn.click();
		assertEQ ( this.mm.params['sendGetPayActReward'], [this.g, 1] );
	};
	
	this.test_getReturnTip = function(){
		var tip = TTIP.getTipById(this.dlg.getItems().tooltips['$returntip']); tip.getTip();
		var s = '';
		for ( var i=0; i<res_pay_act_returns.length; ++i ) {
			s += res_pay_act_returns[i].desc + '<br/>';
		}
		s += rstr.payActDlg.tip.returnRule;
		assertEQ(tip.getTipMsg(), TIPM.makeItemTip2(s));
	};
	
	this.makeNoReturnDlg = function(){
		res_pay_act_returns=[{'desc':'充值1-999金币，返点40%；','id':1,'returnper':0,'allpay':1000}
		,{'desc':'充值1000-2999金币，返点50%；','id':2,'returnper':0,'allpay':3000}
		,{'desc':'充值3000-4999金币，返点55%；','id':3,'returnper':0,'allpay':5000}
		,{'desc':'充值5000-9999金币，返点65%；','id':4,'returnper':0,'allpay':10000}
		,{'desc':'充值10000-19999金币，返点80%；','id':5,'returnper':0,'allpay':20000}
		,{'desc':'充值20000-49999金币，返点85%；','id':6,'returnper':0,'allpay':50000}
		,{'desc':'充值大于50000金币，返点100%；','id':7,'returnper':0,'allpay':99999999}
		];
		
		this.dlg = PayActDlg.snew(this.g);
		this.g.clearUpdater();
		this.dlg.openDlg();
	};
	
	this.test_hasNoReturnValAndPer = function(){
		this.makeNoReturnDlg();
		this.g.setSvrTimeS(1398470000 + 1*24*3600 + 1000);
		var cmd = {payGiftGots:[1,0,0,0,0,0], payActAllGold:1, payActTime:{start:1398470000,stop:1398470000+3*24*3600}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnPer), '' );
		assertEQ ( TQ.getTextEx(this.dlg.getItems().returnVal), '' );
	};
	
	this.test_hasNoReturnRuleTip = function(){
		assertEQ ( TQ.getCSS(this.dlg.getItems().returnRuleTip, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.getItems().returnRuleDesc, 'display'), 'block' );
		this.makeNoReturnDlg();
		assertEQ ( TQ.getCSS(this.dlg.getItems().returnRuleTip, 'display'), 'none' );
		assertEQ ( TQ.getCSS(this.dlg.getItems().returnRuleDesc, 'display'), 'none' );
	};
	
	this.test_hasNoReturnImgBk = function(){
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().bk_img), 'bk.jpg'), true);
		this.makeNoReturnDlg();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.getItems().bk_img), 'bk_noret.jpg'), true );
	};
	
});

tqPayActDlg_t_main = function(suite) {
	suite.addTestCase(TestCasePayActDlg, 'TestCasePayActDlg');
};
