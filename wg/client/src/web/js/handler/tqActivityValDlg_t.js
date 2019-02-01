/*******************************************************************************/
require('./tqActivityValDlg.js')

TestCaseActivityValDlg = TestCase.extern(function(){
	this.setUp = function(){
		res_activityval_tips = [
			{id:1, val:0, tip:'tip1'}
			,{id:2, val:40, tip:'tip2'}
			,{id:3, val:75, tip:'tip3'}
			,{id:4, val:100, tip:'tip4'}
		];
			
		res_activityval_tasks = [
			{id:7001, type:7, name:'name1', times:2, val:3, star:5, tip:'tip1', docond:[{}]}
			,{id:7002, type:7, name:'name2', times:2, val:1, star:4, linkType:1, tip:'tip2', docond:[{}]}
			,{id:7003, type:7, name:'name3', times:3, val:2, star:3, linkType:2, tip:'tip3', docond:[{}]}
		];
		
		res_activityval_rewards = [
			{id:1, icon:101, val:0, dropId:750001, tip:'artip1'}
			,{id:2, icon:102, val:40, dropId:750002, tip:'artip2'}
			,{id:3, icon:103, val:75, dropId:750003, tip:'artip3'}
			,{id:4, icon:104, val:100, dropId:750004, tip:'artip4'}
		];
		
		res_signin_rewards = [
			{id:1, name:'name1', days:5, dropId:760001, tip:'srtip1'}
			,{id:2, name:'name2', days:10, dropId:760002, tip:'srtip2'}
			,{id:3, name:'name3', days:20, dropId:760003, tip:'srtip3'}
		];
			
		res_dayact_defs = [
			{id:1, type:1, name:'修炼双倍', tip:'活动期间，20点到23点期间武将修炼经验奖励双倍'}
			,{id:2, type:2, name:'修炼三倍', tip:'活动期间，20点到23点期间武将修炼经验奖励三倍'}
			,{id:3, type:3, name:'点将双倍', tip:'活动期间，武将在点将台获得内功奖励双倍'}
			,{id:4, type:4, name:'点将三倍', tip:'活动期间，武将在点将台获得内功奖励三倍'}
			,{id:5, type:5, name:'点将多次', tip:'活动期间，点将台次数多一次'}
			,{id:6, type:6, name:'闯塔双倍', tip:'活动期间，武将在千层塔获得经验奖励双倍'}
			,{id:7, type:7, name:'闯塔三倍', tip:'活动期间，武将在千层塔获得经验奖励三倍'}
			,{id:8, type:8, name:'闯塔恢复', tip:'活动期间千层塔伤兵恢复+10%，可与道具叠加'}
			,{id:9, type:9, name:'闯塔恢复', tip:'活动期间千层塔伤兵恢复+20%，即100%'}
			,{id:10, type:10, name:'闯塔多次', tip:'活动期间，千层塔次数多一次'}
			,{id:11, type:SVR_TODAY_ACT_TYPE.ACT_PAY_1, name:'充值活动', tip:'充值活动'}
		];
		
		TestCaseHelper.setUp(this);
		this.taskdlg = TaskDlg.snew(this.g);
		this.dlg = ActivityValDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.activityValDlg.title, pos:{x:"center", y:100}, uicfg:uicfg.activityVal.mainDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__onLoginOk_getFromSvr = function(){
		this.mm.mock(ActivityValSender, 'sendGetAllInfo');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendGetAllInfo'], [this.g] );
		
		this.mm.clear();
		this.g.setSvrTimeS(1379520000);
		this.g.update();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.g.setSvrTimeS(1379520000 + 5); // 5 sec drt
		this.g.update();
		assertEQ ( this.mm.params['sendGetAllInfo'], [this.g] );
	};
	
	this.test__initInfo = function(){
		this.g.getImgr().getActivityVal().val = 10;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.activityVal), 10 );
		assertEQ ( this.dlg.items_.activityProg.getValue(0), 10 );
		assertEQ ( this.dlg.items_.activityProg.getRange(), 100 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.curActivityTip), 'tip1');
		this.g.getImgr().getActivityVal().val = 40;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.curActivityTip), 'tip2');
		this.g.getImgr().getActivityVal().val = 41;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.curActivityTip), 'tip2');
		this.g.getImgr().getActivityVal().val = 100;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.curActivityTip), 'tip4');
		
		this.g.getImgr().getLetterRes().un = [1,2];
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.newMailNumber.getText(), '2');
		
		assertEQ ( this.dlg.items_.rolePs.getText(), '0' );
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:10});
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertEQ (  this.dlg.items_.rolePs.getText(), '10' );
		this.dlg.hideDlg();
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:20});
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertEQ ( this.dlg.items_.rolePs.getText(), '10' );
		
		this.dlg.openDlg();
		this.g.getImgr().getLetterRes().un = [1,2,3];
		this.g.sendEvent({eid:EVT.LETTERUPDATE,sid:0});
		assertEQ ( this.dlg.items_.newMailNumber.getText(), '3');
		this.dlg.hideDlg();
		this.g.getImgr().getLetterRes().un = [1,2,3,4];
		this.g.sendEvent({eid:EVT.LETTERUPDATE,sid:0});
		assertEQ ( this.dlg.items_.newMailNumber.getText(), '3');
		
		this.g.getImgr().getTask().tasks = [{id:7002,times:1}, {id:7003,times:3}]; 
		this.g.getImgr().getTask().activityVals = [{id:7002,times:1}, {id:7003,times:3}]; 
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.taskList.getCount(), 5);
		var item0 = this.dlg.items_.taskList.getItem(0);
		var item1 = this.dlg.items_.taskList.getItem(1);
		var item2 = this.dlg.items_.taskList.getItem(2);
		var item3 = this.dlg.items_.taskList.getItem(3);
		var item4 = this.dlg.items_.taskList.getItem(4);
		assertEQ ( item0.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.noFinishTaskTitle, 2) );
		assertEQ ( item0.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_title);
		assertEQ ( TQ.getTextEx(item0.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item0.exsubs.addNumber), '' );
		
		assertEQ ( item1.exsubs.name.getText(), 'name2' ); 
		assertEQ ( item1.exsubs.name.getUIBack(), uiback.btn.activityVal.link_finishpart);
		assertEQ ( TQ.getTextEx(item1.exsubs.number), '1/2' ); 
		assertEQ ( TQ.getClass(item1.exsubs.number), 'taskList_number_finishpart' );
		assertEQ ( TQ.getTextEx(item1.exsubs.addNumber), '+1' ); 
		assertEQ ( TQ.getClass(item1.exsubs.addNumber), 'taskList_addnumber_finishpart' );
		
		assertEQ ( item2.exsubs.name.getText(), 'name1' );
		assertEQ ( item2.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_nofinish);
		assertEQ ( TQ.getTextEx(item2.exsubs.number), '0/2' );
		assertEQ ( TQ.getClass(item2.exsubs.number), 'taskList_number_nofinish' );
		assertEQ ( TQ.getTextEx(item2.exsubs.addNumber), '★★★★★' );
		assertEQ ( TQ.getClass(item2.exsubs.addNumber), 'taskList_addnumber_nofinish' );
		
		assertEQ ( item3.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.finishTaskTitle, 1) );
		assertEQ ( item3.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_title);
		assertEQ ( TQ.getTextEx(item3.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item3.exsubs.addNumber), '' );
		assertEQ ( TQ.getCSS(item3.exsubs.reddot, 'display'), 'none' );
		
		assertEQ ( item4.exsubs.name.getText(), 'name3' );
		assertEQ ( item4.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_finish);
		assertEQ ( TQ.getTextEx(item4.exsubs.number), '3/3' );
		assertEQ ( TQ.getClass(item4.exsubs.number), 'taskList_number_finish' );
		assertEQ ( TQ.getTextEx(item4.exsubs.addNumber), '+2+2+2' );
		assertEQ ( TQ.getClass(item4.exsubs.addNumber), 'taskList_addnumber_finish' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:7001, times:1},{id:7002, times:2}]}});
		assertEQ ( item0.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.noFinishTaskTitle, 1) );
		assertEQ ( TQ.getTextEx(item0.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item0.exsubs.addNumber), '' );
		
		assertEQ ( item1.exsubs.name.getText(), 'name1' );
		assertEQ ( item1.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_finishpart);
		assertEQ ( TQ.getTextEx(item1.exsubs.number), '1/2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.addNumber), '+3' );
		
		assertEQ ( item2.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.finishTaskTitle, 2) );
		assertEQ ( TQ.getTextEx(item2.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item2.exsubs.addNumber), '' );
		
		assertEQ ( item3.exsubs.name.getText(), 'name2' );
		assertEQ ( TQ.getTextEx(item3.exsubs.number), '2/2' );
		assertEQ ( TQ.getTextEx(item3.exsubs.addNumber), '+1+1' );
		
		assertEQ ( item4.exsubs.name.getText(), 'name3' );
		assertEQ ( TQ.getTextEx(item4.exsubs.number), '3/3' );
		assertEQ ( TQ.getTextEx(item4.exsubs.addNumber), '+2+2+2' );
		
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:7001, times:2}]}});
		assertEQ ( item0.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.noFinishTaskTitle, 1) );
		
		this.dlg._showDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:7001, times:2}]}});
		assertEQ ( item0.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.noFinishTaskTitle, 0) );
		assertEQ ( TQ.getTextEx(item0.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item0.exsubs.addNumber), '' );
		
		assertEQ ( item1.exsubs.name.getText(), TQ.format(rstr.activityValDlg.lbl.finishTaskTitle, 3) );
		assertEQ ( TQ.getTextEx(item1.exsubs.number), '' );
		assertEQ ( TQ.getTextEx(item1.exsubs.addNumber), '' );
		
		assertEQ ( item2.exsubs.name.getText(), 'name1' );
		assertEQ ( item2.exsubs.name.getUIBack(), uiback.btn.activityVal.nolink_finish);
		assertEQ ( TQ.getTextEx(item2.exsubs.number), '2/2' );
		assertEQ ( TQ.getTextEx(item2.exsubs.addNumber), '+3+3' );
	};
	
	this.test_vipVal = function(){
		res_activityval_tasks = [
			{'star':5,'name':'login','val':10,'type':7,'tip':'login','id':1720001,'times':1}
			];
		this.g.getImgr().getTask().activityVals = [{id:FIXID.EVERYDAY_LOGIN_TASK,times:1}];
		this.g.getImgr().getActivityVal().val = 30;
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.taskList.getCount(), 3);
		var item = this.dlg.items_.taskList.getItem(2);
		assertEQ ( TQ.getTextEx(item.exsubs.addNumber), '+10+20(VIP)' );
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
	};
	
	this.helper_setRes = function(){
		res_activityval_tasks = [
			{id:7001, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
			,{id:7002, type:7, name:'name2', times:2, val:1, star:4, linkType:ACTIVITYVAL_TASK_LINK.FARM, tip:'tip2'}
			,{id:7003, type:7, name:'name3', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.ROLETASK, tip:'tip3'}
			,{id:7004, type:7, name:'name4', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.EVERYDAYTASK, tip:'tip4'}
			,{id:7005, type:7, name:'name5', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.ACT_TERRACE, tip:'tip5'}
			,{id:7006, type:7, name:'name6', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.ACT_TOWER, tip:'tip6'}
			,{id:7007, type:7, name:'name7', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.ALLI_CONTRIBUTE, tip:'tip7'}
			,{id:7008, type:7, name:'name8', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.ALLI_GIFT, tip:'tip8'}
			,{id:7009, type:7, name:'name9', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.TRADING_AREA, tip:'tip9'}
			,{id:7010, type:7, name:'name10', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.STEEL_HERO, tip:'tip10'}
			,{id:7011, type:7, name:'name11', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.HEROS_DLG, tip:'tip11'}
			,{id:7012, type:7, name:'name12', times:3, val:2, star:3, linkType:ACTIVITYVAL_TASK_LINK.HEROS_DLG, tip:'tip12'}
			,{id:7013, type:7, name:'name13', times:2, val:1, star:4, linkType:ACTIVITYVAL_TASK_LINK.OTHERFARM, tip:'tip13'}
			,{id:7014, type:7, name:'name14', times:3, val:2, star:3,  tip:'tip14'}
			
		];
	};
	
	this.test_clickTaskListItemName = function(){
		this.helper_setRes();
			
		this.mm.mock(UIM.getPanel('farm'), 'open:openFarm');
		this.mm.mock(UIM.getPanel('field'), 'open:openField');
		this.mm.mock(UIM, 'openDlg');
		this.mm.mock(UIM.getDlg('alli'), 'openSubscribeDlg');
		this.mm.mock(UIM.getDlg('alli'), 'openGiftDlg');
		this.mm.mock(UIM, 'openActTowerDlg');
		this.mm.mock(UIM, 'openActTerraceDlg');
			
		this.g.getImgr().getTask().tasks = [{id:7012,times:3}]; 
		this.g.getImgr().getTask().activityVals = [{id:7012,times:3}]; 
		this.dlg.openDlg();
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(0).exsubs.name.click(); // title
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(1).exsubs.name.click(); // no link
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(2).exsubs.name.click(); // farm
		assertEQ ( this.mm.walkLog, 'openFarm' );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(3).exsubs.name.click(); // role task
		assertEQ ( this.mm.params['openDlg'], ['task', 'role'] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(4).exsubs.name.click(); // everyday task
		assertEQ ( this.mm.params['openDlg'], ['task', 'everyday'] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(5).exsubs.name.click(); // active terrace
		assertEQ ( this.mm.params['openActTerraceDlg'], [] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(6).exsubs.name.click(); // active tower
		assertEQ ( this.mm.params['openActTowerDlg'], [] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(7).exsubs.name.click(); // alli contribute
		assertEQ ( this.mm.params['openSubscribeDlg'], [] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(8).exsubs.name.click(); // alli gift
		assertEQ ( this.mm.params['openGiftDlg'], [] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(9).exsubs.name.click(); // trading area
		assertEQ ( this.mm.params['openDlg'], ['tradingarea'] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(10).exsubs.name.click(); // steel hero
		assertEQ ( this.mm.params['openDlg'], ['steellist'] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(11).exsubs.name.click(); // herodlg
		assertEQ ( this.mm.params['openDlg'], ['hero'] );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(12).exsubs.name.click(); // other farm
		assertEQ ( this.mm.walkLog, 'openField' );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(13).exsubs.name.click(); // title
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.dlg.items_.taskList.getItem(14).exsubs.name.click(); // is complete, no link
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_taskListItemNameTip = function(){
		this.helper_setRes();
		
		this.g.getImgr().getTask().tasks = [{id:7012,times:3}]; 
		this.g.getImgr().getTask().activityVals = [{id:7012,times:3}]; 
		this.dlg.openDlg();
		
		var tip = TTIP.getTipById(this.dlg.items_.taskList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '' ); // title
		
		tip = TTIP.getTipById(this.dlg.items_.taskList.getItem(1).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('tip1') );
	};
	
	this.test_clickMailNumber = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.items_.newMailNumber.click();
		assertEQ ( this.mm.params['openDlg'], ['letter'] );
	};
	
	this.test_clickRolePs = function(){
		this.mm.mock(UIM, 'openDlg');
		this.dlg.items_.rolePs.click();
		assertEQ ( this.mm.params['openDlg'], ['task', 'role'] );
	};
	
	this.test_activityValRewardList = function(){
		this.g.getImgr().getActivityVal().val = 0;
		this.dlg.openDlg();
		
		var item0 = this.dlg.items_.rewardList.getItem(0);
		var item1 = this.dlg.items_.rewardList.getItem(1);
		var item2 = this.dlg.items_.rewardList.getItem(2);
		var item3 = this.dlg.items_.rewardList.getItem(3);
		
		assertEQ ( TQ.getCSS(item0.exsubs.stateEffect, 'display'), 'block' );
		assertEQ ( TQ.getCSS(item1.exsubs.stateEffect, 'display'), 'none' );
		assertEQ ( TQ.getCSS(item2.exsubs.stateEffect, 'display'), 'none' );
		assertEQ ( TQ.getCSS(item3.exsubs.stateEffect, 'display'), 'none' );
		
		assertEQ ( isInclude(IMG.getBKImage(item0.exsubs.icon), '101'), true );
		assertEQ ( isInclude(IMG.getBKImage(item1.exsubs.icon), '102'), true );
		assertEQ ( isInclude(IMG.getBKImage(item2.exsubs.icon), '103'), true );
		assertEQ ( isInclude(IMG.getBKImage(item3.exsubs.icon), '104'), true );
		
		assertEQ ( TQ.getTextEx(item0.exsubs.desc), '活跃度≥0' );
		assertEQ ( TQ.getTextEx(item1.exsubs.desc), '活跃度≥40' );
		assertEQ ( TQ.getTextEx(item2.exsubs.desc), '活跃度≥75' );
		assertEQ ( TQ.getTextEx(item3.exsubs.desc), '活跃度≥100' );
		
		assertEQ ( item0.exsubs.get.getText(), '抽取奖励' );
		assertEQ ( item0.exsubs.get.isEnable(), true );
		assertEQ ( item0.exsubs.get.getUIBack(), uiback.btn.activityVal.actReward_canGet );
		assertEQ ( item1.exsubs.get.getText(), '活跃值未达到' );
		assertEQ ( item1.exsubs.get.isEnable(), false );
		assertEQ ( item1.exsubs.get.getUIBack(), uiback.btn.activityVal.actReward_noEnough );
		
		this.g.getImgr().getActivityVal().val = 40;
		this.g.getImgr().getActivityVal().gotActRewards = [1];
		this.dlg.openDlg();
		assertEQ ( TQ.getCSS(item0.exsubs.stateEffect, 'display'), 'none' );
		assertEQ ( TQ.getCSS(item1.exsubs.stateEffect, 'display'), 'block' );
		assertEQ ( TQ.getCSS(item2.exsubs.stateEffect, 'display'), 'none' );
		
		assertEQ ( item0.exsubs.get.getText(), '已抽取奖励' );
		assertEQ ( item0.exsubs.get.isEnable(), false );
		assertEQ ( item0.exsubs.get.getUIBack(), uiback.btn.activityVal.actReward_got );
		assertEQ ( item1.exsubs.get.getText(), '抽取奖励' );
		assertEQ ( item1.exsubs.get.isEnable(), true );
	};
	
	this.test_hasCanGetReward = function(){
		this.g.getImgr().getActivityVal().val = 0;
		this.g.getImgr().getActivityVal().gotActRewards = [1];
		assertEQ ( ActivityValCanGetOrSignChecker.snew(this.g).hasCanGetReward(), false );
		this.g.getImgr().getActivityVal().val = 40;
		this.g.getImgr().getActivityVal().gotActRewards = [1,2];
		assertEQ ( ActivityValCanGetOrSignChecker.snew(this.g).hasCanGetReward(), false );
		this.g.getImgr().getActivityVal().val = 40;
		this.g.getImgr().getActivityVal().gotActRewards = [1];
		assertEQ ( ActivityValCanGetOrSignChecker.snew(this.g).hasCanGetReward(), true );
	};
	
	this.test_hasCanSign = function(){
		this.g.getImgr().getActivityVal().signin.days = 0;
		this.g.getImgr().getActivityVal().signin.todaySign = 1;
		assertEQ (ActivityValCanGetOrSignChecker.snew(this.g).hasCanSign(), false );
		this.g.getImgr().getActivityVal().signin.days = 0;
		this.g.getImgr().getActivityVal().signin.todaySign = 0;
		assertEQ (ActivityValCanGetOrSignChecker.snew(this.g).hasCanSign(), true );
		this.g.getImgr().getActivityVal().signin.days = 20;
		this.g.getImgr().getActivityVal().signin.todaySign = 0;
		assertEQ (ActivityValCanGetOrSignChecker.snew(this.g).hasCanSign(), false );
	};
	
	this.test_hasCanGetSignReward = function(){
		this.g.getImgr().getActivityVal().signin.days = 5;
		this.g.getImgr().getActivityVal().signin.gotRewards = [1];
		assertEQ (ActivityValCanGetOrSignChecker.snew(this.g).hasCanGetSignReward(), false );
		this.g.getImgr().getActivityVal().signin.days = 11;
		assertEQ (ActivityValCanGetOrSignChecker.snew(this.g).hasCanGetSignReward(), true );
	};
	
	this.test_activityValRewardList_tip = function(){
		this.g.getImgr().getActivityVal().val = 0;
		this.dlg.openDlg();
		var tip = TTIP.getTipById(this.dlg.items_.rewardList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('artip1') );
		
		tip = TTIP.getTipById(this.dlg.items_.rewardList.getItem(1).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('artip2') );
		
		tip = TTIP.getTipById(this.dlg.items_.rewardList.getItem(0).exsubs.tooltips['$item1']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('artip1') );
		
		tip = TTIP.getTipById(this.dlg.items_.rewardList.getItem(1).exsubs.tooltips['$item1']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('artip2') );
	};
	
	this.test_activityValRewardList_click = function(){
		this.mm.mock(ActivityValSender, 'sendGetActReward');
		this.g.getImgr().getActivityVal().val = 50;
		this.dlg.openDlg();
		this.dlg.items_.rewardList.getItem(0).exsubs.get.click();
		assertEQ ( this.mm.params['sendGetActReward'], [this.g, 1] );
		this.dlg.items_.rewardList.getItem(1).exsubs.get.click();
		assertEQ ( this.mm.params['sendGetActReward'], [this.g, 2] );
	};
	
	this.test_signinBtn_state = function(){
		this.g.getImgr().getActivityVal().signin.days = 3;
		this.g.getImgr().getActivityVal().signin.todaySign = 0;
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.signinBtn.isEnable(), true);
		
		this.g.getImgr().getActivityVal().signin.days = 3;
		this.g.getImgr().getActivityVal().signin.todaySign = 1;
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.signinBtn.isEnable(), false);
		
		this.g.getImgr().getActivityVal().signin.days =20;
		this.g.getImgr().getActivityVal().signin.todaySign = 0;
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.signinBtn.isEnable(), false);
	}; 
	
	this.test_signinBtn_click = function(){
		this.mm.mock(ActivityValSender, 'sendSignIn');
		this.g.getImgr().getActivityVal().signin.days = 3;
		this.g.getImgr().getActivityVal().signin.todaySign = 0;
		this.dlg.openDlg();
		this.dlg.items_.signinBtn.click();
		assertEQ ( this.mm.params['sendSignIn'],  [this.g] );
	};
	
	this.test_signinDays_label = function(){
		this.g.getImgr().getActivityVal().signin.days = 3;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.signinDays), TQ.format(rstr.activityValDlg.lbl.signinDays, 3) );
		
		this.g.getImgr().getActivityVal().signin.days = 4;
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.signinDays), TQ.format(rstr.activityValDlg.lbl.signinDays, 4) );
	};
	
	this.test_signinList_itemShow = function(){
		this.g.getImgr().getActivityVal().signin.days = 11;
		this.g.getImgr().getActivityVal().signin.gotRewards = [1];
		this.dlg.openDlg();
		
		assertEQ ( this.dlg.items_.signinList.getCount(), 3 );
		var item0 = this.dlg.items_.signinList.getItem(0);
		var item1 = this.dlg.items_.signinList.getItem(1);
		var item2 = this.dlg.items_.signinList.getItem(2);
		
		assertEQ ( TQ.getTextEx(item0.exsubs.desc), TQ.format(rstr.activityValDlg.lbl.signinDesc, res_signin_rewards[0].days) );
		assertEQ ( TQ.getTextEx(item1.exsubs.desc), TQ.format(rstr.activityValDlg.lbl.signinDesc, res_signin_rewards[1].days) );
		assertEQ ( TQ.getTextEx(item2.exsubs.desc), TQ.format(rstr.activityValDlg.lbl.signinDesc, res_signin_rewards[2].days) );
		
		assertEQ ( TQ.getTextEx(item0.exsubs.days), TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.ENOUGH_SIGNINDAYS, 5, 5) );
		assertEQ ( TQ.getTextEx(item1.exsubs.days), TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.ENOUGH_SIGNINDAYS, 10, 10) );
		assertEQ ( TQ.getTextEx(item2.exsubs.days), TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.NOENOUGH_SIGNINDAYS, 11, 20) );
		
		assertEQ ( item0.exsubs.get.getText(), rstr.activityValDlg.btn.signGot );
		assertEQ ( item0.exsubs.get.isEnable(), false);
		assertEQ ( item1.exsubs.get.getText(), rstr.activityValDlg.btn.signGet );
		assertEQ ( item1.exsubs.get.isEnable(), true);
		assertEQ ( item2.exsubs.get.getText(), rstr.activityValDlg.btn.signGet );
		assertEQ ( item2.exsubs.get.isEnable(), false);
	};
	
	this.test_signinList_itemTip = function(){
		this.g.getImgr().getActivityVal().signin.days = 7;
		this.dlg.openDlg();
		
		var tip = TTIP.getTipById(this.dlg.items_.signinList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip('srtip1') );
	};
	
	this.test_signinList_itemClick = function(){
		this.mm.mock(ActivityValSender, 'sendGetSignReward');
		this.g.getImgr().getActivityVal().signin.days = 7;
		this.dlg.openDlg();
		
		this.dlg.items_.signinList.getItem(0).exsubs.get.click();
		assertEQ ( this.mm.params['sendGetSignReward'], [this.g, 1] );
	};

	this.test_todayActList_itemShow = function(){
		this.g.getImgr().getActivityVal().dayacts = [{day:0, acts:[1,2,3,4,5,6]}];
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.todayActList.getCount(), 6 );
		var item0 = this.dlg.items_.todayActList.getItem(0);
		var item1 = this.dlg.items_.todayActList.getItem(1);
		var item2 = this.dlg.items_.todayActList.getItem(2);
		var item3 = this.dlg.items_.todayActList.getItem(3);
		var item4 = this.dlg.items_.todayActList.getItem(4);
		var item5 = this.dlg.items_.todayActList.getItem(5);
		assertEQ ( TQ.getTextEx(item0.exsubs.name), res_dayact_defs[0].name );
		assertEQ ( TQ.getTextEx(item1.exsubs.name), res_dayact_defs[1].name );
	};
	
	this.test_todayActList_itemTip = function(){
		this.g.getImgr().getActivityVal().dayacts = [{day:0, acts:[6]}];
		this.dlg.openDlg();
		var tip = TTIP.getTipById(this.dlg.items_.todayActList.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.makeItemTip(res_dayact_defs[6-1].tip) );
	};
	
	this.test_onSvrPkg = function(){
		var cmd = {actVal:{val:1
			,gotActRewards:[1]
			,signin:{days:3, todaySign:1}
			,dayacts:[{day:0, acts:[1,SVR_TODAY_ACT_TYPE.ACT_PAY_1]}] }};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.activityVal), 1 );
		assertEQ ( this.dlg.items_.rewardList.getItem(0).exsubs.get.getText(), '已抽取奖励' );
		assertEQ ( this.dlg.items_.signinBtn.isEnable(), false);
		assertEQ ( this.dlg.items_.todayActList.getCount(), 1 );
		
		this.dlg.hideDlg();
		var cmd = {actVal:{val:2
			,gotActRewards:[]
			,signin:{days:3, todaySign:0}
			,dayacts:[{day:0, acts:[1,2]}] }};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ACTIVITY_VAL, data:cmd});
		assertEQ ( TQ.getTextEx(this.dlg.items_.activityVal), 1 );
		assertEQ ( this.dlg.items_.rewardList.getItem(0).exsubs.get.getText(), '已抽取奖励' );
		assertEQ ( this.dlg.items_.signinBtn.isEnable(), false);
		assertEQ ( this.dlg.items_.todayActList.getCount(), 1 );
	};	
	
	this.test_getOtherFarmHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_OTHER_FARM, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:0});
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:1});
		this.dlg.openDlg();
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getRoleTaskHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_ROLE_TASK, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getTask().roleTask.doing.id = 0;
		this.g.getImgr().getTask().roleTask.cdStopTime = 0;
		
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:0});
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getTask().roleTask.doing.id = 1;
		this.g.getImgr().getTask().roleTask.cdStopTime = 0;
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:50});
		this.dlg.openDlg();
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getTask().roleTask.doing.id = 0;
		this.g.getImgr().getTask().roleTask.cdStopTime = 1;
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:50});
		this.dlg.openDlg();
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getTask().roleTask.doing.id = 0;
		this.g.getImgr().getTask().roleTask.cdStopTime = 0;
		this.g.getImgr().addRoleAttr({id:ATTR.PS, val:50});
		this.dlg.openDlg();
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getGetPrestigeHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_GET_PRESTIGE, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().getRoleRes().prestige = 0;
		this.g.getImgr().getTask().prestigeTask.lastTime = 0;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getRoleRes().prestige = 1000;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getDayTaskHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_DAY_TASK, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().getTask().everydays = [];
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getTask().everydays = [{id:1, state:TASK_STATE.WAIT_GET}];
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getTask().everydays = [{id:1, state:TASK_STATE.WAIT_COMPLETE}];
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getJoinTerraceHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_JOIN_TERRACE, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().getRoleRes().level = res_enter_terrace_need_rolelevel - 1;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getRoleRes().level = res_enter_terrace_need_rolelevel;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getJoinTowerHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_JOIN_TOWER, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().getRoleRes().level = res_enter_tower_need_rolelevel - 1;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().getRoleRes().level = res_enter_tower_need_rolelevel;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getAlliContributeHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_ALLI_CONTRIBUTE, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
		
		this.g.getImgr().setAllianceId(0);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().setAllianceId(1);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getGetAlliGiftHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_GET_ALLI_GIFT, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.setSvrTimeS(1369732734 + 3600*1);
		var selfMember = this.g.getImgr().getMyAlliance().getSelfMember();
		selfMember.copySelfMember({gainGift:{lastTime:1369732734}});
		this.g.getImgr().setAllianceId(0);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().setAllianceId(1);
		this.g.setSvrTimeS(1369732734 + 3600*24);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
		
		this.g.getImgr().setAllianceId(1);
		this.g.setSvrTimeS(1369732734 + 3600*1);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
	};
	
	this.test_getLawlightFeedHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_LAWLIGHT_FEED, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		var r_can = [true];
		var util = AlliLawLightUtil.snew(this.g);
		this.mm.mock(AlliLawLightUtil, 'snew', [util] );
		this.mm.mock(util, 'isCanFeed', r_can );
			
		this.g.getImgr().setAllianceId(0);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().setAllianceId(1);
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
			
		r_can[0] = false;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
	};
	
	this.test_getTradingAreaHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_TRADING_AREA, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		var r_can = [false];
		this.mm.mock( UIM.getDlg('tradingarea'), 'isCanTrade', r_can );
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		r_can[0] = true;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getHeroSteelHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_HERO_STEEL, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getAssignHeroExpHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_ASSIGN_HEROEXP, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];

		this.g.getImgr().addRoleAttr({id:ATTR.XPS, val:0});
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
		
		this.g.getImgr().addRoleAttr({id:ATTR.XPS, val:1});
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getSpeedBuildingHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_SPEED_BUILDING, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getZhanlingFieldHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_ZHANLING_FIELD, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.REST;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getGetResFromFieldHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_GET_RES_FROMFIELD, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getSelfFields().list = [];
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getSelfFields().list = [{}];
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getProvokePlayerHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_PROVOKE_PLAYER, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.REST;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_getFightHonorHasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_FIGHT_PLAYER_FOR_HONOR, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.REST;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'none' );
			
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		this.dlg.openDlg();
		var item = this.dlg.getItems().taskList.getItem(1);
		assertEQ ( TQ.getCSS(item.exsubs.reddot, 'display'), 'block' );
	};
	
	this.test_sendEventWhenOpenDlg = function(){
		this.mm.mock(this.g, 'sendEvent');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.UPD_ACT_VAL_REDDOT, sid:0}] );
	};
});

TestCaseActivityValTaskUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_hasRedDot = function(){
		res_activityval_tasks = [
			{id:FIXID.ACTVAL_GET_RES_FROMFIELD, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
			,{id:FIXID.ACTVAL_PROVOKE_PLAYER, type:7, name:'name1', times:2, val:3, star:5, linkType:ACTIVITYVAL_TASK_LINK.NONE, tip:'tip1'}
		];
			
		this.g.getImgr().getSelfFields().list = [];
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		assertEQ ( ActivityValTaskUtil.snew(this.g).hasRedDot(), false );
			
		this.g.getImgr().getSelfFields().list = [{}];
		this.g.getImgr().getRoleRes().state = ROLE_STATE.YOUNG;
		assertEQ ( ActivityValTaskUtil.snew(this.g).hasRedDot(), true );
			
		this.g.getImgr().getSelfFields().list = [];
		this.g.getImgr().getRoleRes().state = ROLE_STATE.FREE;
		assertEQ ( ActivityValTaskUtil.snew(this.g).hasRedDot(), true );
	};
});	


tqActivityValDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseActivityValDlg, 'TestCaseActivityValDlg');
	suite.addTestCase(TestCaseActivityValTaskUtil, 'TestCaseActivityValTaskUtil');
};