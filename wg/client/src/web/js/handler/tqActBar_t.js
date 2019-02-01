/*******************************************************************************/
require('./tqActBar.js')

TestCaseActBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_xxx = function(){
		//assertEQ ( false );
	};
});

TestCaseActOnlineTask = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.beCalled_ = false;
		var This = this;
		this.ob = new function(){
			this.showChange = function(){
				This.beCalled_ = true;
			};
		};
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.onlineAct = ActOnlineTask.snew(this.g, this.ob);
		this.item = this.items.actBar.getItem(0);
		this.onlineAct.set(this.item);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetOnlineTaskWhenRecvLoginOk = function(){
		this.mm.mock(TaskSender, 'sendGetOnlineTaskInfo');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendGetOnlineTaskInfo'], [this.g] );
	};
	
	this.test_init = function(){
		this.g.getImgr().getOnlineTask().id = 0;
		this.g.getImgr().getOnlineTask().stopTime = 0;
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		var item = this.items.actBar.getItem(0);
		var panel = ActOnlineTask.snew(this.g, this.ob);
		panel.set(item);
		panel._update();
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
		
		this.g.setSvrTimeS(10000);
		this.g.getImgr().getOnlineTask().id = 1;
		this.g.getImgr().getOnlineTask().stopTime = 10000 + 30;
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		var item = this.items.actBar.getItem(0);
		var panel = ActOnlineTask.snew(this.g);
		panel.set(item);
		panel._update();
		assertEQ ( TQ.getCSS(item.item, 'display'), 'block' );
		assertEQ ( TQ.getTextEx(item.exsubs.label), TQ.format(rstr.task.onlineTask.leftTime, '00:00:30') );
		assertEQ ( item.exsubs.btn.isEnable(), false );
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), 'actbar/onlinetask/commicon.png'), true );
			
		this.g.setSvrTimeS(10000 + 30);
		this.g.update();
		assertEQ ( TQ.getTextEx(item.exsubs.label), rstr.task.onlineTask.canGet );
		assertEQ ( item.exsubs.btn.isEnable(), true );
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), 'actbar/onlinetask/openicon.png'), true );
	};
	
	this.test_clickGet = function(){
		this.mm.mock(TaskSender, 'sendGetOnlineTaskReward');
		this.item.exsubs.btn.click();
		assertEQ ( this.mm.params['sendGetOnlineTaskReward'], [this.g] );
	};
	
	this.test_onSvrPkg = function(){
		this.g.setSvrTimeS(10000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:1,stopTime:10000+10}}});
		assertEQ ( TQ.getTextEx(this.item.exsubs.label), TQ.format(rstr.task.onlineTask.leftTime, '00:00:10') );
		assertEQ ( TQ.getCSS(this.item.item, 'display'), 'block' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:0,stopTime:10000+10}}});
		assertEQ ( TQ.getCSS(this.item.item, 'display'), 'none' );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.onlineAct.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.task.onlineTask.tip );
	};	
	
	this.test_changeShow = function(){
		this.g.setSvrTimeS(10000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:1,stopTime:10000+10}}});
		assertEQ ( this.beCalled_, true );
		assertEQ ( this.onlineAct.isShow(), true );
	
		this.beCalled_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:1,stopTime:10000+10}}});
		assertEQ ( this.beCalled_, false );
		assertEQ ( this.onlineAct.isShow(), true );

		this.beCalled_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:0,stopTime:10000+10}}});
		assertEQ ( this.beCalled_, true );
		assertEQ ( this.onlineAct.isShow(), false );
		
		this.beCalled_ = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:0,stopTime:10000+10}}});
		assertEQ ( this.beCalled_, false );
		assertEQ ( this.onlineAct.isShow(), false );
	};
});

TestCaseActYDTask = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.items.actBar.setItemCount(1);
		this.actYDTask = ActYDTask.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_set = function(){
		g_platform = 'qzone';
		var item = this.items.actBar.getItem(0);
		this.actYDTask.set(item);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/yd/bk.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
		
		g_platform = 'test';
		this.actYDTask.set(item);
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
	};
	
	this.test_click = function(){
		this.mm.mock(UIM, 'openDlg' );
		var item = this.items.actBar.getItem(0);
		this.actYDTask.set(item);
		item.exsubs.btn.click();
		assertEQ ( this.mm.params['openDlg'], ['yellowdiamond'] );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.actYDTask.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.yellowdiamondDlg.tip.seeyd );
	};
	
	this.test_isShow = function(){
		g_platform = 'test';
		assertEQ ( this.actYDTask.isShow(), false );
		g_platform = 'qzone';
		assertEQ ( this.actYDTask.isShow(), true );
	};
});

TestCaseActBDTask = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.items.actBar.setItemCount(1);
		this.actBDTask = ActBDTask.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_set = function(){
		g_platform = '3366';
		var item = this.items.actBar.getItem(0);
		this.actBDTask.set(item);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
		
		g_platform = 'test';
		this.actBDTask.set(item);
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
	};
	
	this.help_setNoGift = function(){
		this.g.setSvrTimeS(10000000);
		var bdInfo = this.g.getImgr().getRoleRes().bdInfo;
		this.g.getImgr().getRoleRes().level = 100;
		bdInfo.blue_vip_level = 2;
		bdInfo.is_blue_vip = 1;
		bdInfo.got_highgift = this.g.getSvrTimeS();
		bdInfo.got_newgift = 1;
		bdInfo.got_commgift = this.g.getSvrTimeS();
		bdInfo.got_yeargift = this.g.getSvrTimeS();
		bdInfo.got_lvlgifts = [1,2,3];
	};
	
	this.test_hasNoGift = function(){
		this.help_setNoGift();
		
		g_platform = '3366';
		var item = this.items.actBar.getItem(0);
		this.actBDTask.set(item);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk_open.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_newgift = 0;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_highgift = 0;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_commgift = 0;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_yeargift = 0;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_lvlgifts = [1,2];
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
		
		this.help_setNoGift();
		this.g.getImgr().getRoleRes().bdInfo.got_lvlgifts = null;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:4});
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/bd/bk.png') ), true );
	};
	
	this.test_click = function(){
		this.mm.mock(UIM, 'openDlg' );
		var item = this.items.actBar.getItem(0);
		this.actBDTask.set(item);
		item.exsubs.btn.click();
		assertEQ ( this.mm.params['openDlg'], ['bluediamond'] );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.actBDTask.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.bluediamondDlg.tip.seebd );
	};
	
	this.test_isShow = function(){
		g_platform = 'test';
		assertEQ ( this.actBDTask.isShow(), false );
		g_platform = '3366';
		assertEQ ( this.actBDTask.isShow(), true );
	};
});

TestCaseAct3366Task = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.items.actBar.setItemCount(1);
		this.act3366Task = Act3366Task.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_set = function(){
		g_platform = '3366';
		var item = this.items.actBar.getItem(0);
		this.act3366Task.set(item);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/3366/bk.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
		
		g_platform = 'test';
		this.act3366Task.set(item);
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
	};
	
	this.test_click = function(){
		this.mm.mock(UIM, 'openDlg' );
		var item = this.items.actBar.getItem(0);
		this.act3366Task.set(item);
		item.exsubs.btn.click();
		assertEQ ( this.mm.params['openDlg'], ['blue3366diamond'] );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.act3366Task.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		var tipmsg = TQ.format(rstr.bluediamondDlg.tip.see3366, 0);
		tip.getTip(); assertEQ ( tip.getTipMsg(), tipmsg );
	};
	
	this.test_isShow = function(){
		g_platform = 'test';
		assertEQ ( this.act3366Task.isShow(), false );
		g_platform = '3366';
		assertEQ ( this.act3366Task.isShow(), true );
	};
});

TestCaseActFirstPayTask = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g.getImgr().getTask().actives = [{id:FIXID.FIRST_PAYGOLD, state:TASK_STATE.COMPLETE-1}];
		this.beCalled_ = false;
		var This = this;
		this.ob = new function(){
			this.showChange = function(){
				This.beCalled_ = true;
			};
		};		
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.items.actBar.setItemCount(1);
		this.actTask = ActFirstPayTask.snew(this.g, this.ob);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_set = function(){
		var item = this.items.actBar.getItem(0);
		this.actTask.set(item);
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/firstpay/bk.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
	};
	
	this.test_click = function(){
		this.g.getImgr().getTask().actives = [{id: FIXID.FIRST_PAYGOLD, state:0}];
		this.mm.mock(UIM.getDlg('task'), 'openDlg:openDlg2' );
		this.mm.mock(UIM.getDlg('task'), 'selectTask' );
		
		var item = this.items.actBar.getItem(0);
		this.actTask.set(item);
		item.exsubs.btn.click();
		assertEQ ( this.mm.params['openDlg2'], [] );
		assertEQ ( this.mm.params['selectTask'], ['activity', 0] );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.actTask.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.buyGoldDlg.tip.firstpay_libao );
	};
	
	this.test_isShow = function(){
		var item = this.items.actBar.getItem(0);
		this.actTask.set(item);
		assertEQ ( this.actTask.isShow(), true );
		this.g.getImgr().getTask().actives = [{id:FIXID.FIRST_PAYGOLD, state:TASK_STATE.COMPLETE}];
		this.g.sendEvent({eid:EVT.TASKCHANGE, sid:0});
		assertEQ ( this.actTask.isShow(), false );
		assertEQ ( this.beCalled_, true );
		
		this.beCalled_ = false;
		this.g.getImgr().getTask().actives = [{id:FIXID.FIRST_PAYGOLD, state:TASK_STATE.COMPLETE}];
		this.g.sendEvent({eid:EVT.TASKCHANGE, sid:0});
		assertEQ ( this.actTask.isShow(), false );
		assertEQ ( this.beCalled_, false );
		
		this.beCalled_ = false;
		this.g.getImgr().getTask().actives = [];
		this.g.sendEvent({eid:EVT.TASKCHANGE, sid:0});
		assertEQ ( this.actTask.isShow(), false );
		assertEQ ( this.beCalled_, false );
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
		
		this.beCalled_ = false;
		this.g.getImgr().getTask().actives = [{id:FIXID.FIRST_PAYGOLD, state:TASK_STATE.COMPLETE-1}];
		this.g.sendEvent({eid:EVT.TASKCHANGE, sid:0});
		assertEQ ( this.actTask.isShow(), true );
		assertEQ ( this.beCalled_, true );
		assertEQ ( TQ.getCSS(item.item, 'display'), 'block' );
	};
});

TestCasePayActTask = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.beCalled_ = false;
		var This = this;
		this.ob = new function(){
			this.showChange = function(){
				This.beCalled_ = true;
			};
		};		
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.items.actBar.setItemCount(1);
		this.payAct = PayActTask.snew(this.g, this.ob);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_set = function(){
		var item = this.items.actBar.getItem(0);
		this.payAct.set(item);
		assertEQ ( TQ.getCSS(item.item, 'display'), 'none' );
	};
	
	this.test_getTip = function(){
		var item = this.items.actBar.getItem(0);
		this.payAct.set(item);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.payActDlg.tip.payact_libao );
	};
	
	this.test_click = function(){
		this.mm.mock(UIM, 'openDlg' );
		var item = this.items.actBar.getItem(0);
		this.payAct.set(item);
		item.exsubs.btn.click();
		assertEQ ( this.mm.params['openDlg'], ['payact'] );
	};	
	
	this.test_isShow = function(){
		var item = this.items.actBar.getItem(0);
		this.payAct.set(item);
		assertEQ ( this.payAct.isShow(), false );
		this.g.getImgr().getPayAct().payActTime = {start:0, stop:0};
		this.g.sendEvent({eid:EVT.PAYACT, sid:0});
		assertEQ ( this.payAct.isShow(), false );
		assertEQ ( this.beCalled_, true );
		
		this.beCalled_ = false;
		this.g.getImgr().getPayAct().payActTime = {start:1, stop:2};
		this.g.sendEvent({eid:EVT.PAYACT, sid:0});
		assertEQ ( this.payAct.isShow(), true );
		assertEQ ( this.beCalled_, true );
		assertEQ ( TQ.getCSS(item.item, 'display'), 'block' );
		assertEQ ( isInclude(IMG.getBKImage(item.exsubs.icon), IMG.makeImg('actbar/payact/bk.png') ), true );
		assertEQ ( TQ.getCSS(item.exsubs.label_bak, 'display'), 'none' );
	};	
});


tqActBar_t_main = function(suite) {
	suite.addTestCase(TestCaseActBar, 'TestCaseActBar');
	suite.addTestCase(TestCaseActOnlineTask, 'TestCaseActOnlineTask');
	suite.addTestCase(TestCaseActYDTask, 'TestCaseActYDTask');
	suite.addTestCase(TestCaseActBDTask, 'TestCaseActBDTask');
	suite.addTestCase(TestCaseAct3366Task, 'TestCaseAct3366Task');
	suite.addTestCase(TestCaseActFirstPayTask, 'TestCaseActFirstPayTask');
	suite.addTestCase(TestCasePayActTask, 'TestCasePayActTask');
};
