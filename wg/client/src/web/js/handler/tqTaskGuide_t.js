/*******************************************************************************/
require('./tqTaskGuide.js')

TestCaseTaskGuide = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.taskdlg = TaskDlg.snew(this.g);
		this.guide = TaskGuide.snew(g_app, this.items);
			
		res_tasks = [
			{id:10, type:2, fixShow:0, name:'growuptask10', desc:'desc10', hotTip:1, help:'help10', targetDesc:'targetdesc10', dropId:7500001}
			,{id:11, type:2, fixShow:0, name:'growuptask11', desc:'desc11', hotTip:1, help:'help11', targetDesc:'targetdesc11', dropId:7500001}
			,{id:12, type:2, fixShow:0, name:'growuptask12', desc:'desc12', hotTip:0, help:'help12', targetDesc:'targetdesc12', dropId:7500001}
		];			
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.check_show = function(flagmsg) {
		assertEQ ( TQ.getCSS( this.items.taskGuide, 'display'), 'block', flagmsg );
		assertEQ ( TQ.getCSS( this.items.expandTaskGuideBtn.getParent(), 'display'), 'none', flagmsg);
		assertEQ ( TQ.getCSS( this.items.collapseTaskGuideBtn.getParent(), 'display'), 'block', flagmsg);
	};
	
	this.check_hide = function(flagmsg){
		assertEQ ( TQ.getCSS( this.items.taskGuide, 'display'), 'none', flagmsg );
		assertEQ ( TQ.getCSS( this.items.expandTaskGuideBtn.getParent(), 'display'), 'block', flagmsg);
		assertEQ ( TQ.getCSS( this.items.collapseTaskGuideBtn.getParent(), 'display'), 'none', flagmsg);
	};
	
	this.test_init = function(){
		this.mm.mock(TQ, 'fixIE6Png');
		this.guide = TaskGuide.snew(g_app, this.items);
		this.check_show('test_init');
		assertEQ ( this.mm.params['fixIE6Png'], [this.items.taskGuide] );
	};
	
	this.test_clickExpandBtn = function(){
		this.items.expandTaskGuideBtn.click();
		this.check_show('test_clickExpandBtn');
		if ( !TQ.isMobile() ) {
			assertEQ ( this.items.taskGuideToggleBtn.isPress(), true );
		}
	};
	
	this.test_clickCollapseBtn = function(){
		this.items.expandTaskGuideBtn.click();
		this.items.collapseTaskGuideBtn.click();
		this.check_hide('test_clickCollapseBtn');
		if ( !TQ.isMobile() ) {
			assertEQ ( this.items.taskGuideToggleBtn.isPress(), false );
		}
	};
	
	this.test_clickToggleBtn = function(){
		if ( !TQ.isMobile() ) {
			assertEQ ( this.items.taskGuideToggleBtn.isPress(), true);
			this.items.taskGuideToggleBtn.click();
			assertEQ ( this.items.taskGuideToggleBtn.isPress(), false);
			this.check_hide('test_clickToggleBtn');
			this.items.taskGuideToggleBtn.click();
			assertEQ ( this.items.taskGuideToggleBtn.isPress(), true);
			this.check_show('test_clickToggleBtn');
		}
	};
	
	this.test_clickShowMoreBtn = function(){
		this.mm.mock(UIM, 'openDlg');
		this.items.taskGuide.items.seeMoreTasks.click();
		assertEQ ( this.mm.params['openDlg'], ['task', 'growup'] );
	};

	this.test_taskListShow = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:0}]}});
		this.items.expandTaskGuideBtn.click();
		assertEQ ( this.items.taskGuide.items.taskList.getCount(), 2 );
		
		var item0 = this.items.taskGuide.items.taskList.getItem(0);
		var item1 = this.items.taskGuide.items.taskList.getItem(1);
		
		assertEQ ( TQ.getTextEx(item1.exsubs.title), 'growuptask10' );
		assertEQ ( TQ.getTextEx(item1.exsubs.desc), 'targetdesc10' );
		assertEQ ( item1.exsubs.opBtn.getText(), rstr.task.taskdlg.btn.seeTaskDetail );
		assertEQ ( TQ.getTextEx(item1.exsubs.state), rstr.task.taskdlg.states[0] );
		assertEQ ( TQ.getClass(item1.exsubs.state), 'wait_complete_state' );
		assertEQ ( TQ.getCSS(item1.exsubs.hotFlag, 'display'), 'block' );
		
		assertEQ ( TQ.getTextEx(item0.exsubs.title), 'growuptask11' );
		assertEQ ( TQ.getTextEx(item0.exsubs.desc), 'targetdesc11' );
		assertEQ ( item0.exsubs.opBtn.getText(), rstr.task.taskdlg.btn.getTaskReward );
		assertEQ ( TQ.getTextEx(item0.exsubs.state), rstr.task.taskdlg.states[1] );
		assertEQ ( TQ.getClass(item0.exsubs.state), 'wait_get_state' );
		assertEQ ( TQ.getCSS(item0.exsubs.hotFlag, 'display'), 'none' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:12,state:0}]}});
		var item2 = this.items.taskGuide.items.taskList.getItem(2);
		assertEQ ( TQ.getCSS(item2.exsubs.hotFlag, 'display'), 'none' );
	};
	
	this.test_clickItemOpBtn = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:0},{id:11,state:1}]}});
		assertEQ ( this.items.taskGuide.items.taskList.getCount(), 2 );
		
		var item0 = this.items.taskGuide.items.taskList.getItem(0);
		var item1 = this.items.taskGuide.items.taskList.getItem(1);
		
		this.mm.mock(UIM.getDlg('task'), 'openDlg');
		this.mm.mock(UIM.getDlg('task'), 'selectTask' );
		this.mm.mock(TaskSender, 'sendGetReward' );
		
		this.mm.clear();
		item1.exsubs.opBtn.click();
		assertEQ ( this.mm.walkLog, 'openDlg,selectTask' );
		assertEQ ( this.mm.params['selectTask'],  ['growup', 1] );
		
		this.mm.clear();
		item0.exsubs.opBtn.click();
		assertEQ ( this.mm.params['sendGetReward'],  [this.g, 11] );
		
		this.items.collapseTaskGuideBtn.click();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:12,state:0}]}});
		assertEQ ( this.items.taskGuide.items.taskList.getCount(), 2 );
	};
});

tqTaskGuide_t_main = function(suite) {
	suite.addTestCase(TestCaseTaskGuide, 'TestCaseTaskGuide');
};
