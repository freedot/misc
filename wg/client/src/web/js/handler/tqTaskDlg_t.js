/*******************************************************************************/
require('./tqTaskDlg.js')

TestCaseTaskResSchedule = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.taskResSchedule = TaskResSchedule.snew(this.g);
		res_tasks = [
			{id:1, type:1, state:1, fixShow:1, name:'active1', dname:'detail active1', time:{start:1377336523, duration:3600}, desc:'desc1', targetDesc:'targetdesc1', dropId:7500001 }
			,{id:2, type:1, state:1, fixShow:1, name:'active2', dname:'detail active2', time:{start:1377336523+7000, duration:100}, desc:'desc2', targetDesc:'targetdesc2', dropId:7500001}
			,{id:3, type:1, state:0, fixShow:0, name:'active3', dname:'detail active3', time:{start:1377336523+8000, duration:100}, desc:'desc3', targetDesc:'targetdesc3', dropId:7500001}
			,{id:4, type:1, state:0, fixShow:0, name:'active4', dname:'detail active4', time:{start:1377336523+9000, duration:100}, desc:'desc4', targetDesc:'targetdesc4', dropId:7500001}
			,{id:5, type:1, state:0, fixShow:1, name:'active5', dname:'detail active5', time:{start:1377336523+10000, duration:100}, desc:'desc5', targetDesc:'targetdesc5', dropId:7500001}
			,{id:6, type:1, state:0, fixShow:1, name:'active6', dname:'detail active6', time:{start:1377336523+11000, duration:100}, desc:'desc6', targetDesc:'targetdesc6', dropId:7500001}
			
			,{id:7, type:1, state:0, fixShow:0, name:'active7', dname:'detail active7', time:{start:1377336523+12000, duration:0}, desc:'desc7', targetDesc:'targetdesc7', dropId:7500001} // 长期有效
			,{id:8, type:1, state:0, fixShow:0, name:'active8', dname:'detail active8', time:{start:TASK_STARTTIME.SVR_OPEN, duration:100}, desc:'desc8', targetDesc:'targetdesc8', dropId:7500001} // 开服日期
			,{id:9, type:1, state:0, fixShow:0, name:'active9', dname:'detail active9', time:{start:TASK_STARTTIME.FIRST_LOGIN, duration:100}, desc:'desc9', targetDesc:'targetdesc9', dropId:7500001} // 首登日期
			,{id:10, type:1, state:0, fixShow:0, name:'active10', dname:'detail active10', time:{start:TASK_STARTTIME.FIRST_LOGIN+1, duration:100}, desc:'desc10', targetDesc:'targetdesc10', dropId:7500001} // 首登日期 + 1
			
			,{id:1000, type:4, fixShow:1, roleExp:100, pro:20, multiple:1.5, name:'roletask1000', desc:'desc1000',  help:'help1000', targetDesc:'targetdesc1000', precond:{roleLevel:10}, needps:100, cdtime:10, needtime:60, dropId:7500001}
			,{id:1001, type:4, fixShow:1, roleExp:100, pro:20, multiple:1.5, name:'roletask1001', desc:'desc1001',  help:'help1001', targetDesc:'targetdesc1001', precond:{roleLevel:20}, needps:200, cdtime:20, needtime:120,dropId:7500001}
		];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
		this.g.unregUpdater(this.taskResSchedule, this.taskResSchedule._onUpdate);
	};
	
	this.test_initSchedule = function(){
		var taskResSchedule = TaskResSchedule.snew(this.g);
		this.mm.mock(taskResSchedule, '_initTaskSchedule');
		taskResSchedule.initSchedule();
		assertEQ ( this.mm.walkLog,  '_initTaskSchedule' );
		
		this.mm.clear();
		taskResSchedule.initSchedule();
		assertEQ ( this.mm.walkLog, '', 'only call one time' );
	};
	
	this.test_updateRoleTasks = function(){
		this.mm.mock(this.g, 'sendEvent');
		this.g.getImgr().getRoleRes().level = 1;
		
		this.taskResSchedule.initSchedule();
		
		this.mm.clear();
		this.taskResSchedule.updateRoleTasks();
		assertEQ (this.mm.walkLog, '');
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().level = 10;
		this.taskResSchedule.updateRoleTasks();
		assertEQ (this.mm.params['sendEvent'], [{eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1000,state:TASK_STATE.CANDO}]}}]);
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().level = 11;
		this.taskResSchedule.updateRoleTasks();
		assertEQ (this.mm.walkLog, '', 'roletask id=1000, is added');
		
		this.mm.clear();
		this.g.getImgr().getTask().roles = [{id:1001,state:TASK_STATE.DOING}];
		this.g.getImgr().getRoleRes().level = 20;
		this.taskResSchedule.updateRoleTasks();
		assertEQ (this.mm.walkLog, '', 'roletask id=1001, is exist');
	};
});

TestCaseTaskDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		res_everyday_task_cnt = 2;
		
		res_tasks = [
			{id:1, type:1, state:0, fixShow:1, name:'active1', dname:'detail active1', time:{start:1377336523, duration:3600}, desc:'desc1', targetDesc:'targetdesc1', dropId:7500001 }
			,{id:2, type:1, state:0, fixShow:1, name:'active2', dname:'detail active2', time:{start:1377336523, duration:0}, desc:'desc2', targetDesc:'targetdesc2', dropId:7500001} // 长期有效
			,{id:3, type:1, state:0, fixShow:1, name:'active3', dname:'detail active3', time:{start:TASK_STARTTIME.SVR_OPEN, duration:3600}, desc:'desc3', targetDesc:'targetdesc3', dropId:7500001}  // 开服日期
			,{id:4, type:1, state:0, fixShow:0, name:'active4', dname:'detail active4', time:{start:TASK_STARTTIME.FIRST_LOGIN, duration:3600}, desc:'desc4', targetDesc:'targetdesc4', dropId:7500001} // 首登日期
			,{id:5, type:1, state:0, fixShow:1, name:'active5', dname:'detail active5', time:{start:TASK_STARTTIME.FIRST_LOGIN+1, duration:3600}, desc:'desc5', targetDesc:'targetdesc5', dropId:7500001} // 首登日期+1
			
			,{id:10, type:2, fixShow:0, name:'growuptask10', desc:'desc10', help:'help10', targetDesc:'targetdesc10', dropId:7500001}
			,{id:11, type:2, fixShow:0, name:'growuptask11', desc:'desc11', help:'help11', targetDesc:'targetdesc11', dropId:7500001}
			,{id:12, type:2, fixShow:0, name:'growuptask12', desc:'desc12', help:'help12', targetDesc:'targetdesc12', dropId:7500001}
			,{id:100, type:3, fixShow:0, name:'subgrowuptask100', desc:'desc100', help:'help100', targetDesc:'targetdesc100', dropId:7500001}
			,{id:101, type:3, fixShow:0, name:'subgrowuptask101', desc:'desc101', help:'help101', targetDesc:'targetdesc101', dropId:7500001}
			,{id:102, type:3, fixShow:0, name:'subgrowuptask102', desc:'desc102', help:'help102', targetDesc:'targetdesc102', dropId:7500001}
			
			,{id:1000, type:4, fixShow:1, roleExp:100, pro:20, multiple:1.5, name:'roletask1000', desc:'desc1000', help:'help1000', targetDesc:'targetdesc1000', precond:{roleLevel:10}, needps:100, cdtime:10, needtime:60, dropId:7500001}
			,{id:1001, type:4, fixShow:1, roleExp:200, pro:20, multiple:2, name:'roletask1001', desc:'desc1001', help:'help1001', targetDesc:'targetdesc1001', precond:{roleLevel:20}, needps:200, cdtime:20, needtime:120,dropId:7500001}
			,{id:1002, type:4, fixShow:1, roleExp:300, pro:20, multiple:3, name:'roletask1002', desc:'desc1002', help:'help1002', targetDesc:'targetdesc1002', precond:{roleLevel:30}, needps:300, cdtime:30, needtime:180,dropId:7500001}
			
			,{id:10000, type:5, fixShow:1, name:'everydaytask10000', help:'help10000', desc:'desc10000', targetDesc:'targetdesc10000', difficulty:2, dropId:7500001}
			,{id:10001, type:5, fixShow:1, name:'everydaytask10001', help:'help10001', desc:'desc10001', targetDesc:'targetdesc10001', difficulty:3, dropId:7500001}
			,{id:10002, type:5, fixShow:1, name:'everydaytask10002', help:'help10002', desc:'desc10002',  targetDesc:'targetdesc10002', difficulty:4, dropId:7500001}
		];
			
		res_drops = [{id:7500001, items:[{'pro':100,'id':FIXID.SALVE,'minnum':4,'maxnum':4},{'pro':100,'id':FIXID.REFRESHCARD,'minnum':1,'maxnum':1}],roleexp:{'pro':100,'minnum':1,'maxnum':1}}];

		this.dlg = TaskDlg.snew(this.g);
		this.dlg.openDlg();
		this.tabs = this.dlg.items_.tabs;
		this.actItems = this.dlg.items_.tabs.getTabItems(0);
		this.growupItems = this.dlg.items_.tabs.getTabItems(1);
		this.roleItems = this.dlg.items_.tabs.getTabItems(2);
		this.everydayItems = this.dlg.items_.tabs.getTabItems(3);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_hasCanGetGift = function(){
		// activity task tab
		assertEQ ( this.dlg._hasCanGetGift('activity'), false );
		this.g.getImgr().getTask().actives = [{id:1, state:TASK_STATE.WAIT_GET}];
		assertEQ ( this.dlg._hasCanGetGift('activity'), true );
		
		// growup task tab
		assertEQ ( this.dlg._hasCanGetGift('growup'), false );
		this.g.getImgr().getTask().growups = [{id:1, state:TASK_STATE.WAIT_GET}];
		assertEQ ( this.dlg._hasCanGetGift('growup'), true );
		
		this.g.getImgr().getTask().growups = [{id:1, state:0}];
		this.g.getImgr().getTask().subGrowups = [{id:1, state:TASK_STATE.WAIT_GET}];
		assertEQ ( this.dlg._hasCanGetGift('growup'), true );
		
		// role task tab
		assertEQ ( this.dlg._hasCanGetGift('role'), false );
		this.g.getImgr().getTask().roles = [{id:1000, state:TASK_STATE.CANDO}];
		assertEQ ( this.dlg._hasCanGetGift('role'), false );
		
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:1000});
		var roleTask = this.g.getImgr().getTask().roleTask;
		roleTask.doing.id = 1;
		roleTask.cdStopTime = 0;
		assertEQ ( this.dlg._hasCanGetGift('role'), false );
		
		roleTask.doing.id = 0;
		roleTask.cdStopTime = 1;
		assertEQ ( this.dlg._hasCanGetGift('role'), false );
		
		roleTask.doing.id = 0;
		roleTask.cdStopTime = 0;
		assertEQ ( this.dlg._hasCanGetGift('role'), true );
		
		// everyday task tab
		this.g.setSvrTimeS(100000000);
		assertEQ ( this.dlg._hasCanGetGift('everyday'), false );
		this.g.getImgr().getTask().everydays = [{id:10000, state:TASK_STATE.WAIT_GET}];
		assertEQ ( this.dlg._hasCanGetGift('everyday'), true );
		
		this.g.getImgr().getRoleRes().prestige = 1;
		this.g.getImgr().getTask().prestigeTask.lastTime = 0;
		this.g.getImgr().getTask().everydays = [{id:10000, state:0}];
		assertEQ ( this.dlg._hasCanGetGift('everyday'), false );
		
		this.g.getImgr().getRoleRes().prestige = 1000;
		this.g.getImgr().getTask().prestigeTask.lastTime = this.g.getSvrTimeS();
		assertEQ ( this.dlg._hasCanGetGift('everyday'), false );
		
		this.g.getImgr().getRoleRes().prestige = 1000;
		this.g.getImgr().getTask().prestigeTask.lastTime = 0;
		assertEQ ( this.dlg._hasCanGetGift('everyday'), true );
	};
	
	this.test_setRedDots = function(){
		this.g.getImgr().getTask().actives = [{id:1, state:TASK_STATE.WAIT_GET, itemres:res_tasks[0]}];
		this.g.getImgr().getTask().growups = [{id:1, state:TASK_STATE.WAIT_GET, itemres:res_tasks[0]}];
		this.dlg._update();
		assertEQ ( this.dlg.getItems().tabs.getTabBtn(0).getNewFlag(), true );
		assertEQ ( this.dlg.getItems().tabs.getTabBtn(1).getNewFlag(), true );
		assertEQ ( this.dlg.getItems().tabs.getTabBtn(2).getNewFlag(), false );
		assertEQ ( this.dlg.getItems().tabs.getTabBtn(3).getNewFlag(), false );
	};
	
	this.test_hasCanGetGifts = function(){
		assertEQ ( this.dlg.hasCanGetGifts(), false );
		this.g.getImgr().getTask().actives = [{id:1, state:TASK_STATE.WAIT_GET, itemres:res_tasks[0]}];
		assertEQ ( this.dlg.hasCanGetGifts(), true );
		this.g.getImgr().getTask().actives = [{id:1, state:0, itemres:res_tasks[0]}];
		this.g.getImgr().getTask().growups = [{id:1, state:TASK_STATE.WAIT_GET, itemres:res_tasks[0]}];
		assertEQ ( this.dlg.hasCanGetGifts(), true );
	};
	
	this.test_selectTask = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:0},{id:11,state:1}]}});
		
		this.dlg.selectTask('growup', 1);
		assertEQ ( this.tabs.getActiveTab(), 1 );
		assertEQ ( this.growupItems.list.getCurSel(), 1);
	};
	
	this.test__getAllTasksWhenLoginOk = function(){
		this.mm.mock(TaskSender, 'sendGetAllTasks');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0, data:{}});
		assertEQ ( this.mm.params['sendGetAllTasks'], [this.g] );
	};
	
	this.test__onRolebaseChange = function(){
		this.mm.mock(this.dlg.taskResSchedule_, 'initSchedule');
		this.mm.mock(this.dlg.taskResSchedule_, 'updateRoleTasks');
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:0, data:{}});
		assertEQ ( this.mm.walkLog, 'initSchedule,updateRoleTasks' );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.task.taskdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.task.taskdlgex};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__setTabsText = function(){
		assertEQ ( this.tabs.getTabText(0), rstr.task.taskdlg.tabs[0] );
		assertEQ ( this.tabs.getTabText(1), rstr.task.taskdlg.tabs[1] );
		assertEQ ( this.tabs.getTabText(2), rstr.task.taskdlg.tabs[2] );
		assertEQ ( this.tabs.getTabText(3), rstr.task.taskdlg.tabs[3] );
	};
	
	this.test__createTabsContentSubDom = function(){
		assertEQ ( this.actItems.content_desc, this.actItems.content.getContainerObj().childNodes[0] );
		assertEQ ( this.actItems.content_reward, this.actItems.content.getContainerObj().childNodes[1] );
		assertEQ ( TQ.getClass(this.actItems.content_reward), 'reward' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopTaskBlinking');
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10,state:0}]}});
		assertEQ ( this.actItems.list.getCount(), 0 );
		this.dlg.openDlg();
		assertEQ ( this.actItems.list.getCount(), 1 );
		assertEQ ( this.tabs.getActiveTab(), 0 );
		assertEQ ( this.mm.params['stopTaskBlinking'], [] );
		
		this.mm.clear();
		this.dlg.openDlg('growup');
		assertEQ ( this.tabs.getActiveTab(), 1 );
		
		this.mm.clear();
		this.dlg.openDlg('role');
		assertEQ ( this.tabs.getActiveTab(), 2 );
		
		this.mm.clear();
		this.dlg.openDlg('everyday');
		assertEQ ( this.tabs.getActiveTab(), 3 );
		
		
		this.mm.clear();
		this.dlg.openDlg('xxx');
		assertEQ ( this.tabs.getActiveTab(), 0 );

		//this.params_		
		//'活动任务', '成长任务', '君主任务', '日常任务
	};
	
	this.test__onSvrTask = function(){
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{}});
		assertEQ ( this.g.getImgr().getTask().tasks, [] );
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0}]}});
		
		assertEQ ( this.g.getImgr().getTask().tasks, [{id:1,state:0,itemres:res_tasks[0]}] );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:1}]}});
		assertEQ ( this.g.getImgr().getTask().tasks, [{id:1,state:0,itemres:res_tasks[0]},{id:10,state:1,itemres:ItemResUtil.findTaskRes(10)}] );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:2}]}});
		assertEQ ( this.g.getImgr().getTask().tasks, [{id:1,state:0,itemres:res_tasks[0]},{id:10,state:2,itemres:ItemResUtil.findTaskRes(10)}] );
		
			
		// check update active task title name and state
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:2,state:1},{id:3,state:2},{id:4,state:2}]}});
		assertEQ ( this.actItems.list.getCount(), 0 );
		assertEQ ( this.actItems.list.getCurSel(), -1 );
		
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:2,_d:1}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:3,state:2},{id:4,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:2,state:1}]}});
		assertEQ ( this.actItems.list.getCount(), 3 );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(0).exsubs.name), 'active1' );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(0).exsubs.state), rstr.task.taskdlg.states[0] );
		assertEQ ( TQ.getClass(this.actItems.list.getItem(0).exsubs.state), 'wait_complete_state' );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(1).exsubs.name), 'active2' );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(1).exsubs.state), rstr.task.taskdlg.states[1] );
		assertEQ ( TQ.getClass(this.actItems.list.getItem(1).exsubs.state), 'wait_get_state' );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(2).exsubs.name), 'active3' );
		assertEQ ( TQ.getTextEx(this.actItems.list.getItem(2).exsubs.state), rstr.task.taskdlg.states[2] );
		assertEQ ( TQ.getClass(this.actItems.list.getItem(2).exsubs.state), 'complete_state' );
		assertEQ ( this.actItems.list.getCurSel(), 0 );
			
		this.actItems.list.setCurSel(2);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,_d:1}]}});
		assertEQ ( this.actItems.list.getCurSel(), 0 );
		
		this.actItems.list.setCurSel(1);
		var r_idx = -1;
		this.actItems.list.setCaller({self:this, caller:function(e, idx){
			r_idx = idx
		}})
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:2,state:2}]}});
		assertEQ ( this.actItems.list.getCurSel(), 1 );
		assertEQ ( r_idx, 1 );
		
		
		// check update grow up task title name and state
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,_d:1}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:0}]}});
		assertEQ ( this.growupItems.list.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.growupItems.list.getItem(0).exsubs.name), 'growuptask10' );
		assertEQ ( TQ.getTextEx(this.growupItems.list.getItem(0).exsubs.state), rstr.task.taskdlg.states[0] );		
			
			
		// check sub update grow up task title name and state
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:101,state:1},{id:102,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:100,state:0}]}});
		assertEQ ( this.growupItems.subList.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.growupItems.subList.getItem(0).exsubs.name), 'subgrowuptask100' );
		assertEQ ( TQ.getTextEx(this.growupItems.subList.getItem(0).exsubs.state), rstr.task.taskdlg.states[0] );	
			
		
		// check role task title name and state
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:1000,state:3},{id:1002,state:5}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1001,state:4}]}});	
		assertEQ ( this.roleItems.list.getCount(), 3 );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(0).exsubs.name), 'roletask1000' );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(0).exsubs.state), rstr.task.taskdlg.states[3] );	
		assertEQ ( TQ.getClass(this.roleItems.list.getItem(0).exsubs.state), 'cannotdo_state' );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(1).exsubs.name), 'roletask1001' );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(1).exsubs.state), rstr.task.taskdlg.states[4] );
		assertEQ ( TQ.getClass(this.roleItems.list.getItem(1).exsubs.state), 'cando_state' );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(2).exsubs.name), 'roletask1002' );
		assertEQ ( TQ.getTextEx(this.roleItems.list.getItem(2).exsubs.state), rstr.task.taskdlg.states[5] );
		assertEQ ( TQ.getClass(this.roleItems.list.getItem(2).exsubs.state), 'doing_state' );
			
			
		// check everyday task title name and state
		this.mm.travelMock(this.g, 'sendEvent');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000*100 + 1,state:0},{id:10002*100 + 2,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10001*100 + 3,state:1}]}});
		assertEQ ( this.everydayItems.list.getCount(), 3 );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(0).exsubs.name), 'everydaytask10000' );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(0).exsubs.state), rstr.task.taskdlg.states[0] );	
		assertEQ ( TQ.getClass(this.everydayItems.list.getItem(0).exsubs.state), 'wait_complete_state' );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(1).exsubs.name), 'everydaytask10002' );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(1).exsubs.state), rstr.task.taskdlg.states[2] );
		assertEQ ( TQ.getClass(this.everydayItems.list.getItem(1).exsubs.state), 'complete_state' );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(2).exsubs.name), 'everydaytask10001' );
		assertEQ ( TQ.getTextEx(this.everydayItems.list.getItem(2).exsubs.state), rstr.task.taskdlg.states[1] );
		assertEQ ( TQ.getClass(this.everydayItems.list.getItem(2).exsubs.state), 'wait_get_state' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.TASKCHANGE, sid:0}] );
	};
	
	this.check_act_task_content = function(res, nameFlag){
		var expeStr = '';
		expeStr += '<div class="detailname"><font class=title>任务名称：</font>' + res.dname + '</div>';
		
		if (res.time.duration == 0) { // 长期有效
			expeStr += '<div class="time"><font class=title>活动时间：</font>长期有效</div>';
		} else if (res.time.start == TASK_STARTTIME.SVR_OPEN) { // 用开服时间替换
			expeStr += '<div class="time"><font class=title>活动时间：</font>2013-08-25 00:00:00 至 2013-08-25 01:00:00</div>';
		} else if ( res.time.start == TASK_STARTTIME.FIRST_LOGIN ) { // 用首登时间替换
			expeStr += '<div class="time"><font class=title>活动时间：</font>2013-08-26 00:00:00 至 2013-08-26 01:00:00</div>';
		} else if ( res.time.start == TASK_STARTTIME.FIRST_LOGIN + 1 ) { // 用首登时间+1替换
			expeStr += '<div class="time"><font class=title>活动时间：</font>2013-08-27 00:00:00 至 2013-08-27 01:00:00</div>';
		} else { // 实际的活动时间
			expeStr += '<div class="time"><font class=title>活动时间：</font>2013-08-24 17:28:43 至 2013-08-24 18:28:43</div>';
		}
		
		expeStr += '<div class="desc"><font class=title>活动简介：</font>' + res.desc + '</div>';
		expeStr += '<div class="target"><font class=title>活动目标：</font>' + res.targetDesc + '</div>';
		
		assertEQ ( TQ.getTextEx(this.actItems.content_desc), expeStr, nameFlag );
		assertEQ ( TQ.getCSS(this.actItems.content_reward, 'display'), 'block', nameFlag );
		
		assertEQ ( TQ.getTextEx(this.actItems.content_reward.items.desc), '<font class=title>活动奖励：</font>' + DropItemUtil.getSimpleDesc(7500001), nameFlag );
		var rewardList = this.actItems.content_reward.items.rewardList;
		assertEQ ( rewardList.getCount(), 2, nameFlag);
		assertEQ ( isInclude(IMG.getBKImage(rewardList.getItem(0).exsubs.icon), ItemResUtil.findItemres(FIXID.SALVE).bigpic + '.gif'), true , nameFlag);
		assertEQ ( isInclude(IMG.getBKImage(rewardList.getItem(1).exsubs.icon), ItemResUtil.findItemres(FIXID.REFRESHCARD).bigpic + '.gif'), true , nameFlag);
		assertEQ ( TQ.getTextEx(rewardList.getItem(0).exsubs.number), '×4' , nameFlag);
		assertEQ ( TQ.getTextEx(rewardList.getItem(1).exsubs.number), '×1', nameFlag );
		var tip = TTIP.getTipById(rewardList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.getItemDesc(SysItemMaker.make(0,ItemResUtil.findItemres(FIXID.SALVE)), 'sys') , nameFlag);
	};
	
	this.check_growup_task_content = function(res, nameFlag){
		this.mm.clear();
		var expeStr = '';
		expeStr += '<div class="desc"><font class=title>任务描述：</font>' + res.desc + '</div>';
		expeStr += '<div class="help"><font class=title>任务指南：</font>' + res.help + '</div>';
		expeStr += '<div class="target"><font class=title>任务目标：</font>' + res.targetDesc + '</div>';
		assertEQ ( TQ.getTextEx(this.growupItems.content_desc), expeStr, 'content desc error in ' + nameFlag );
		assertEQ ( TQ.getCSS(this.growupItems.content_reward, 'display'), 'block', 'conent reward display error in ' + nameFlag );	
		assertEQ ( TQ.getTextEx(this.growupItems.content_reward.items.desc), '<font class=title>任务奖励：</font>' + DropItemUtil.getSimpleDesc(7500001), 'conent reward desc error in ' + nameFlag );
		var rewardList = this.growupItems.content_reward.items.rewardList;
		assertEQ ( rewardList.getCount(), 2, 'conent reward item count error in ' + nameFlag);
		var tip = TTIP.getTipById(rewardList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.getItemDesc(SysItemMaker.make(0,ItemResUtil.findItemres(FIXID.SALVE)), 'sys') , 'conent reward item tip error in ' + nameFlag);
		assertEQ ( this.growupItems.getRewardBtn.isShow(), true , 'getRewardBtn show error in ' + nameFlag);
		assertEQ ( this.growupItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward);
		assertEQ ( this.growupItems.getRewardBtn.isEnable(), false , 'getRewardBtn enable error in ' + nameFlag);
	};
	
	this.check_role_task_content = function(res, precondClass, vip, nameFlag){
		var expeStr = '';
		expeStr += '<div class="desc"><font class=title>任务描述：</font>' + res.desc + '</div>';
		expeStr += '<div class="precond ' + precondClass + '"><font class=title>任务前提：</font>君主等级大于' + res.precond.roleLevel + '级</div>';
		var needtime = TQ.formatTime(0, res.needtime);
		var cdtime = TQ.formatTime(0, res.cdtime);
		if (vip > 0) {
			needtime = TQ.format(rstr.task.taskdlg.lbl.vipimm, vip);
			cdtime = TQ.format(rstr.task.taskdlg.lbl.vipimm, vip);
		}
		expeStr += '<div class="detaildesc">&nbsp;消耗君主精力：' + res.needps +'<br/>&nbsp;任务时间：' + needtime + '<br/>&nbsp;冷却时间：' + cdtime + '</div>';
		assertEQ ( TQ.getTextEx(this.roleItems.content_desc), expeStr, 'content desc error in ' + nameFlag );
		assertEQ ( TQ.getCSS(this.roleItems.content_reward, 'display'), 'block', 'conent reward display error in ' + nameFlag );	
		assertEQ ( TQ.getTextEx(this.roleItems.content_reward.items.desc), '<font class=title>任务奖励：</font>' + TQ.format(rstr.task.taskdlg.content.roleTaskReward, res.roleExp, res.multiple), 'conent reward desc error in ' + nameFlag );
		var rewardList = this.roleItems.content_reward.items.rewardList;
		assertEQ ( rewardList.getCount(), 0, 'conent reward item count error in ' + nameFlag);
	};
	
	this.test__onClickListItem = function(){
		// check active task content
		this.mm.mock(this.actItems.content, 'refresh');
		this.mm.clear();
		this.actItems.list.setCurSel(10);
		assertEQ ( TQ.getTextEx(this.actItems.content_desc), '' );
		assertEQ ( TQ.getCSS(this.actItems.content_reward, 'display'), 'none' );
		assertEQ ( this.mm.walkLog, 'refresh' );
		assertEQ ( this.actItems.getRewardBtn.isShow(), true );
		assertEQ ( this.actItems.getRewardBtn.isEnable(), false );
		assertEQ ( this.actItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward);

		this.g.getImgr().getRoleRes().svrOpenTime = 1377360000;
		this.g.getImgr().getRoleRes().firstLoginTime = 1377360000 + 24*3600;
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:2,state:1},{id:3,state:2},{id:4,state:1},{id:5,state:1}]}});
		this.mm.clear();
		this.actItems.list.setCurSel(-1);
		assertEQ ( TQ.getTextEx(this.actItems.content_desc), '' );
		assertEQ ( TQ.getCSS(this.actItems.content_reward, 'display'), 'none' );
		assertEQ ( this.mm.walkLog, 'refresh' );
			
		this.actItems.list.setCurSel(0);
		this.check_act_task_content(ItemResUtil.findTaskRes(1), 'select first item');
		assertEQ ( this.actItems.getRewardBtn.isShow(), true );
		assertEQ ( this.actItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward);
		assertEQ ( this.actItems.getRewardBtn.isEnable(), false );

		this.actItems.list.setCurSel(2);
		this.check_act_task_content(ItemResUtil.findTaskRes(3), 'select 2 item, 开服时间');
		assertEQ ( this.actItems.getRewardBtn.isShow(), true );
		assertEQ ( this.actItems.getRewardBtn.isEnable(), false );
		assertEQ ( this.actItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.completed );
	
		this.mm.clear();
		this.actItems.list.setCurSel(1);
		this.check_act_task_content(ItemResUtil.findTaskRes(2), 'select 1 item, 长期有效');
		assertEQ ( this.actItems.getRewardBtn.isShow(), true );
		assertEQ ( this.actItems.getRewardBtn.isEnable(), true );
		assertEQ ( this.actItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward );
		
		this.mm.clear();
		this.actItems.list.setCurSel(3);
		this.check_act_task_content(ItemResUtil.findTaskRes(4), 'select 3 item, 首登日期');
		
		this.mm.clear();
		this.actItems.list.setCurSel(4);
		this.check_act_task_content(ItemResUtil.findTaskRes(5), 'select 4 item, 首登日期+1');
		
		assertEQ ( this.mm.walkLog, 'refresh' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10,state:0},{id:11,state:1},{id:12,state:2},{id:100,state:0}]}});
		this.check_growup_task_content(ItemResUtil.findTaskRes(10), 'first update select list first item');
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:100,state:0},{id:101,state:1},{id:102,state:2}]}});
		this.growupItems.subList.setCurSel(0);	
		this.check_growup_task_content(ItemResUtil.findTaskRes(100), 'sub list');	

		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0}]}});
		this.check_growup_task_content(ItemResUtil.findTaskRes(100), 'save last sub list select ');			
		
		this.growupItems.list.setCurSel(0);	
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0}]}});
		this.check_growup_task_content(ItemResUtil.findTaskRes(10), 'save last list select ');
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:1000,state:3},{id:1001,state:4},{id:1002,state:5}]}});
		this.roleItems.list.setCurSel(0);
		this.check_role_task_content(ItemResUtil.findTaskRes(1000), 'precond_noenough', 0, 'role task can not do');
		
		this.roleItems.list.setCurSel(1);
		this.check_role_task_content(ItemResUtil.findTaskRes(1001), 'precond_enough', 0, 'role task can do');
			
		this.g.getImgr().getRoleRes().vip = 5;
		this.roleItems.list.setCurSel(2);
		this.check_role_task_content(ItemResUtil.findTaskRes(1002), 'precond_enough', 5, 'role task doing');
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000,state:0},{id:10001,state:1},{id:10002,state:2}]}});
		this.everydayItems.list.setCurSel(0);
		var expeStr = '';
		expeStr += '<div class="desc"><font class=title>任务描述：</font>desc10000</div>';
		expeStr += '<div class="help"><font class=title>任务指南：</font>help10000</div>';
		expeStr += '<div class="difficulty"><font class=title>任务难度：</font>★★</div>';
		expeStr += '<div class="target"><font class=title>任务目标：</font>targetdesc10000</div>';
		assertEQ ( TQ.getTextEx(this.everydayItems.content_desc), expeStr );
		assertEQ ( TQ.getCSS(this.everydayItems.content_reward, 'display'), 'block' );
		assertEQ ( TQ.getTextEx(this.everydayItems.content_reward.items.desc), '<font class=title>活动奖励：</font>' + DropItemUtil.getSimpleDesc(7500001) );
		var rewardList = this.everydayItems.content_reward.items.rewardList;
		assertEQ ( rewardList.getCount(), 2);
		this.everydayItems.list.setCurSel(-1);
		assertEQ ( this.everydayItems.getRewardBtn.isShow(), true );
		assertEQ ( this.everydayItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward);
		assertEQ ( this.everydayItems.getRewardBtn.isEnable(), false );
		assertEQ ( this.everydayItems.changeTaskBtn.isShow(), false );
		assertEQ ( this.everydayItems.immediatelyBtn.isShow(), false );
		this.everydayItems.list.setCurSel(0);
		assertEQ ( this.everydayItems.getRewardBtn.isShow(), true );
		assertEQ ( this.everydayItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward);
		assertEQ ( this.everydayItems.getRewardBtn.isEnable(), false );
		assertEQ ( this.everydayItems.changeTaskBtn.isShow(), true );
		assertEQ ( this.everydayItems.immediatelyBtn.isShow(), true );
		this.mm.clear();
		this.everydayItems.list.setCurSel(2);
		assertEQ ( this.everydayItems.getRewardBtn.isShow(), true );
		assertEQ ( this.everydayItems.getRewardBtn.isEnable(), false );
		assertEQ ( this.everydayItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.completed );
		assertEQ ( this.everydayItems.changeTaskBtn.isShow(), false );
		assertEQ ( this.everydayItems.immediatelyBtn.isShow(), false );
		this.mm.clear();
		this.everydayItems.list.setCurSel(1);
		assertEQ ( this.everydayItems.getRewardBtn.isShow(), true );
		assertEQ ( this.everydayItems.getRewardBtn.isEnable(), true );
		assertEQ ( this.everydayItems.changeTaskBtn.isShow(), true );
		assertEQ ( this.everydayItems.immediatelyBtn.isShow(), false );
		assertEQ ( this.everydayItems.getRewardBtn.getText(), rstr.task.taskdlg.btn.getReward );			
	};
	
	this.test__onClickGetRewardBtn = function(){
		this.mm.mock(TaskSender, 'sendGetReward');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:2,state:1},{id:3,state:2}]}});
		this.actItems.list.setCurSel(1);
		this.actItems.getRewardBtn.click();
		assertEQ ( this.mm.params['sendGetReward'], [this.g, 2], 'act task' );
			
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10,state:0},{id:11,state:1},{id:12,state:2}]}});
		this.growupItems.list.setCurSel(1);
		this.growupItems.getRewardBtn.click();
		assertEQ ( this.mm.params['sendGetReward'], [this.g, 11], 'grow up task' );
		
		this.mm.clear();			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:100,state:0},{id:101,state:1},{id:102,state:2}]}});
		this.growupItems.subList.setCurSel(1);
		this.growupItems.getRewardBtn.click();
		assertEQ ( this.mm.params['sendGetReward'], [this.g, 101], 'sub grow up task'  );
		
		this.mm.clear();			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000,state:0},{id:10001,state:1},{id:10002,state:2}]}});
		this.everydayItems.list.setCurSel(1);
		this.everydayItems.getRewardBtn.click();
		assertEQ ( this.mm.params['sendGetReward'], [this.g, 10001], 'everyday task'  );
	};
	
	this.test_rolePsShow = function(){
		assertEQ ( TQ.getTextEx(this.roleItems.rolePs), TQ.format(rstr.task.taskdlg.roleps, 0) );
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:10});
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertEQ ( TQ.getTextEx(this.roleItems.rolePs), TQ.format(rstr.task.taskdlg.roleps, 10) );
	};
	
	this.test_useItemBtn_forAddRolePs = function(){
		this.mm.mock(UIM.getDlg('uselistitem'), 'openDlgByItemIds');
		this.roleItems.useItemBtn.click();
		assertEQ ( this.mm.params['openDlgByItemIds'], [rstr.useitem.filterdlg.title.addPs
			,rstr.useitem.filterdlg.btn.useItem
			,[3000018, 3000019] ,{id:0, name:'', type:RES_TRG.SELF_ROLE} ] );
	};
	
	this.test_opBtn_enableState_forRoleTask = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:1000,state:3},{id:1001,state:4},{id:1002,state:5}]}});
		this.roleItems.list.setCurSel(-1);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
			
		this.roleItems.list.setCurSel(0);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
			
		this.roleItems.list.setCurSel(1);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), true );
			
		this.roleItems.list.setCurSel(2);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
			
		this.roleItems.list.setCurSel(-1);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:1, stopTime:10}}}});
		assertEQ ( this.roleItems.speedBtn.isShow(), true );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(0);
		assertEQ ( this.roleItems.speedBtn.isShow(), true );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(1);
		assertEQ ( this.roleItems.speedBtn.isShow(), true );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(2);
		assertEQ ( this.roleItems.speedBtn.isShow(), true );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(-1);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:0, stopTime:0},cdStopTime:1}}});
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(0);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(1);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
		
		this.roleItems.list.setCurSel(2);
		assertEQ ( this.roleItems.speedBtn.isShow(), false );
		assertEQ ( this.roleItems.doBtn.isShow(), false );
	};
	
	this.test_doingInfo_forRoleTask = function(){
		this.g.setSvrTimeS(10);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:1000,state:3},{id:1001,state:4},{id:1002,state:5}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:1002, stopTime:60},cdStopTime:0}}});
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), TQ.format(rstr.task.taskdlg.content.doingRoleTask, 'roletask1002', '00:00:50' ), 'has task doing' );
		
		this.g.setSvrTimeS(50);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), TQ.format(rstr.task.taskdlg.content.doingRoleTask, 'roletask1002', '00:00:10' ), 'has task doing' );
		
		this.g.setSvrTimeS(61);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), '', 'task doing stop' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:0, stopTime:60},cdStopTime:0}}});
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), '', 'has no task doing and not in cooldown time' );
		
		this.g.setSvrTimeS(70);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:0, stopTime:60},cdStopTime:100}}});
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), TQ.format(rstr.task.taskdlg.content.roleTaskCD, '00:00:30' ), 'in cooldown time' );
		
		this.g.setSvrTimeS(100);
		this.g.update();
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), '', 'cooldown time stop' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:0, stopTime:60},cdStopTime:0}}});
		assertEQ ( TQ.getTextEx(this.roleItems.doingInfo), '', 'has no task doing and not in cooldown time' );
	};
	
	this.test_click_opBtn_forRoleTask = function(){
		this.mm.mock(TaskSender, 'sendDoRoleTask');
		this.mm.mock(UIM.getDlg('uselistitem'), 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:1000,state:3},{id:1001,state:4},{id:1002,state:5}]}});
		this.roleItems.list.setCurSel(1);
		assertEQ ( this.roleItems.doBtn.isShow(), true );
		this.roleItems.doBtn.click();
		assertEQ ( this.mm.params['sendDoRoleTask'], [this.g, 1001], 'do role task' );
			
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{roleTask:{doing:{id:1002, stopTime:60},cdStopTime:0}}});
		assertEQ ( this.roleItems.speedBtn.isShow(), true );
		this.roleItems.speedBtn.click();
		assertEQ ( this.mm.params['openDlg'], [[RES_EFF.ACC_DOINGROLETASK]
			,{id:0, stoptime:60, name:rstr.task.taskdlg.roleTask, type:RES_TRG.SELF_ROLE}], 'speed doing role task' );
	};
	
	this.test_click_changeEverydayTaskBtn = function(){
		this.mm.mock(TaskSender, 'sendChangeEverydayTask');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000,state:0},{id:10001,state:1},{id:10002,state:2}]}});
		this.everydayItems.list.setCurSel(0);
		this.everydayItems.changeTaskBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.task.taskdlg.tip.changeEverydayTask );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendChangeEverydayTask'], [this.g, 10000] );
	};
	
	this.test_click_immediatelyEverydayTaskBtn = function(){
		this.mm.mock(TaskSender, 'sendCompleteEverydayTask');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000,state:0},{id:10001,state:1},{id:10002,state:2}]}});
		this.everydayItems.list.setCurSel(0);
		this.everydayItems.immediatelyBtn.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.task.taskdlg.tip.completeEverydayTask );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendCompleteEverydayTask'], [this.g, 10000] );
	};
	
	this.test_prestigeShow = function(){
		assertEQ ( TQ.getTextEx(this.everydayItems.prestige), rstr.task.taskdlg.prestige + '0' );
		this.g.getImgr().getRoleRes().prestige = 10;
		this.g.sendEvent({eid:EVT.ROLEBASE, sid:0});
		assertEQ ( TQ.getTextEx(this.everydayItems.prestige), rstr.task.taskdlg.prestige + '10' );
	};
	
	this.test_getPrestigeBtn_state = function(){
		this.g.setSvrTimeS(1377875911);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{prestigeTask:{lastTime:0}}});
		assertEQ ( this.everydayItems.getByPrestige.isEnable(), true );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{prestigeTask:{lastTime:1377875911 - 24*3600}}});
		assertEQ ( this.everydayItems.getByPrestige.isEnable(), true );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{prestigeTask:{lastTime:1377875911 - 1*3600}}});
		assertEQ ( this.everydayItems.getByPrestige.isEnable(), false );
	};
	
	this.test_startGlobalTip = function(){
		var stip = StartGlobalTip.snew(this.g);
		this.mm.mock(StartGlobalTip, 'snew', [stip]);
		this.mm.mock(stip, 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{startGTip:1}});
		assertEQ ( this.mm.params['snew'], [this.g] );
		assertEQ ( this.mm.params['openDlg'], [] );
	};
	
	this.test_openTodayAct = function(){
		this.mm.mock(UIM, 'openDlg');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{openTodayAct:1}});
		assertEQ ( this.mm.params['openDlg'], ['activityval'] );
		assertEQ ( this.g.getImgr().isNewcomerHelpEnd(), true );
	};
	
	this.test_click_getPrestigeBtn = function(){
		this.g.setSvrTimeS(1377875911);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{prestigeTask:{lastTime:0}}});
		assertEQ ( this.everydayItems.getByPrestige.isEnable(), true );
		
		this.mm.mock(TaskSender, 'sendGetRewardByPrestige');
		
		this.g.getImgr().getRoleRes().prestige = 999;
		this.everydayItems.getByPrestige.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.task.taskdlg.tip.noEnoughPrestige );
		this.g.getGUI().hideMsgBox();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().prestige = 1000;
		this.everydayItems.getByPrestige.click();
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		assertEQ ( this.mm.params['sendGetRewardByPrestige'], [this.g] );
	};
	
	this.test_blinkMainBtn_whenHideDlg = function(){
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'startTaskBlinking' );
		this.dlg.hideDlg();
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		assertEQ ( this.mm.params['startTaskBlinking'], [10000] );
			
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_blinkTabBtn_whenDlgIsShow = function(){
		this.mm.mock(this.dlg.items_.tabs.getTabBtn(1), 'startBlinking' );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		assertEQ ( this.mm.params['startBlinking'], [10000] );
			
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		assertEQ ( this.mm.walkLog, '' );
			
		this.mm.clear();
		this.dlg.items_.tabs.activeTab(1);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10,state:1}]}});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_blinkTabBtn_whenOpenDlg = function(){
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopTaskBlinking' );
		this.mm.mock(this.dlg.items_.tabs.getTabBtn(1), 'startBlinking' );
		
		this.dlg._initInfo();
		assertEQ ( this.mm.walkLog, '' );
		
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:11,state:1},{id:12,state:2}]}});
		assertEQ ( this.mm.walkLog, '' );
			
		this.dlg._initInfo();
		assertEQ ( this.mm.walkLog, 'stopTaskBlinking,startBlinking' );
		assertEQ ( this.mm.params['startBlinking'], [10000] );
	};
	
	this.test_stopBlinkTabBtn_whenClickGrowupTab = function(){
		this.mm.mock(this.dlg.items_.tabs.getTabBtn(1), 'stopBlinking' );
		this.dlg.items_.tabs.activeTab(2);
		assertEQ ( this.mm.walkLog, '' );
		
		this.dlg.items_.tabs.activeTab(1);
		assertEQ ( this.mm.walkLog, 'stopBlinking' );
	};
	
	this.test_isEveryDayBeforeChangedSvrCmd = function(){
		res_everyday_task_cnt = 3;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:1,state:0},{id:10000*100 + 1,state:0},{id:10002*100 + 2,state:2}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10001*100 + 3,state:1}]}});
		assertEQ ( this.everydayItems.list.getCount(), 3 );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10001*100 + 3,_d:1}]}});
		assertEQ ( this.everydayItems.list.getCount(), 3 );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10000*100 + 1,_d:1}]}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:10002*100 + 2,_d:1}]}});
		assertEQ ( this.everydayItems.list.getCount(), 0, 'when count is zero, need update' );
	};
	
	this.test_clickPayGoldBtn = function(){
		this.mm.mock(JMISC, 'openPayWnd');
		this.dlg.items_.tabs.getTabItems(0).paygold.click();
		assertEQ ( this.mm.walkLog, 'openPayWnd' );
	};
});

tqTaskDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseTaskResSchedule, 'TestCaseTaskResSchedule');
	suite.addTestCase(TestCaseTaskDlg, 'TestCaseTaskDlg');
};
