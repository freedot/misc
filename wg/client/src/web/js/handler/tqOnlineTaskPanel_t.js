/*******************************************************************************/
require('./tqOnlineTaskPanel.js')

TestCaseOnlineTaskPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.panel = OnlineTaskPanel.snew(this.g, this.items);
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
		var panel = OnlineTaskPanel.snew(this.g, this.items);
		assertEQ ( TQ.getCSS(this.items.onlineTask_panel, 'display'), 'none' );
		
		this.g.setSvrTimeS(10000);
		this.g.getImgr().getOnlineTask().id = 1;
		this.g.getImgr().getOnlineTask().stopTime = 10000 + 30;
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		var panel = OnlineTaskPanel.snew(this.g, this.items);
		assertEQ ( TQ.getCSS(this.items.onlineTask_panel, 'display'), 'block' );
		assertEQ ( TQ.getTextEx(this.items.onlineTask_leftTime), TQ.format(rstr.task.onlineTask.leftTime, '00:00:30') );
		assertEQ ( this.items.onlineTask_get.isEnable(), false );
		assertEQ ( isInclude(IMG.getBKImage(this.items.onlineTask_icon), 'onlinetask/commicon.gif'), true );
			
		this.g.setSvrTimeS(10000 + 30);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.items.onlineTask_leftTime), rstr.task.onlineTask.canGet );
		assertEQ ( this.items.onlineTask_get.isEnable(), true );
		assertEQ ( isInclude(IMG.getBKImage(this.items.onlineTask_icon), 'onlinetask/openicon.gif'), true );
	};
	
	this.test_clickGet = function(){
		this.mm.mock(TaskSender, 'sendGetOnlineTaskReward');
		this.items.onlineTask_get.click();
		assertEQ ( this.mm.params['sendGetOnlineTaskReward'], [this.g] );
	};
	
	this.test_onSvrPkg = function(){
		this.g.setSvrTimeS(10000);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:1,stopTime:10000+10}}});
		assertEQ ( TQ.getTextEx(this.items.onlineTask_leftTime), TQ.format(rstr.task.onlineTask.leftTime, '00:00:10') );
		assertEQ ( TQ.getCSS(this.items.onlineTask_panel, 'display'), 'block' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{onlinetask:{id:0,stopTime:10000+10}}});
		assertEQ ( TQ.getCSS(this.items.onlineTask_panel, 'display'), 'none' );
	};
});

tqOnlineTaskPanel_t_main = function(suite) {
	//suite.addTestCase(TestCaseOnlineTaskPanel, 'TestCaseOnlineTaskPanel');
};
