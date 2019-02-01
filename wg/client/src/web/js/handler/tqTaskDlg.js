/*******************************************************************************/
var MIN_NEED_PRESTIGE = 1000;
TaskResSchedule = Class.extern(function(){
	var C_INFINITE = 0xffffffff;
	this.inited_ = false;
	this.roleTaskSchedule_ = [];
	this.init = function(g){
		this.g_ = g;
	};
	
	this.initSchedule = function(){
		if ( this.inited_ ) return;
		
		this._initTaskSchedule();
		this.inited_ = true;
	};
	
	this.updateRoleTasks = function(){
		var roleRes =  this.g_.getImgr().getRoleRes();
		for ( var i=this.roleTaskSchedule_.length-1; i>=0; --i ) {
			var schedule = this.roleTaskSchedule_[i];
			if (roleRes.level >= schedule.precond.roleLevel) {
				this._notifyTask(schedule.id, TASK_STATE.CANDO);
				this.roleTaskSchedule_.splice(i, 1);
			}
		}
	};
	
	this._initTaskSchedule = function(){
		for ( var i=0; i<res_tasks.length; ++i ) {
			var res = res_tasks[i];
			if (res.type == TASK_TYPE.ROLE) {
				this.roleTaskSchedule_.push({id:res.id, precond:res.precond});
			}
		}
	};
	
	this._notifyTask = function(taskId, state){
		if ( TQ.find(this.g_.getImgr().getTask().actives, 'id', taskId)) return;
		if ( TQ.find(this.g_.getImgr().getTask().roles, 'id', taskId)) return;
		this.g_.sendEvent({eid:EVT.NET, sid:NETCMD.TASK, data:{tasks:[{id:taskId,state:state}]}});
	};
});

CheckAddFavoriteTask = JClass.ex({
	init : function(g){
		this.g_ = g;
		TQ.addEvent(document, 'keydown', function(e){
			e = e ? e : window.event;
			var key = TQ.getKeyCode(e);
			if ( e.ctrlKey && (key == VK_KEY.D) ) { // CTRL + D
				TaskSender.sendAddFavorite(g);
			}
			return true;
		});
	}
	
	/*
	,addFavorite : function(){
		var url = '';
		try {
			window.external.addFavorite(url, rstr.addFavorite.title);
			TaskSender.sendAddFavorite(this.g_);
		} catch (e) {
			try {
				window.sidebar.addPanel(rstr.addFavorite.title, url, "");
				TaskSender.sendAddFavorite(this.g_);
			} catch (e) {
				alert(rstr.addFavorite.useHotKey);
			}
		}
	}
	*/
});

TaskDlg = BaseDlg.extern(function(){
	var C_TAB_GROWUP_IDX = 1;
	var C_BLINKING_DURATION = 10000;
	this.panels_ = {};
	this.taskResSchedule_ = null;
	this.checkAddFavoriteTask_ = null;
	this.hasNewTask_ = false;
	this.tabIdxs_ = {'activity':0, 'growup':1, 'role':2, 'everyday':3};
	this.addFavoriteTiped_ = false;
	
	this.hasCanGetGifts = function(){
		for ( var k in this.tabIdxs_ ) {
			if ( this._hasCanGetGift(k) ) {
				return true;
			}
		}
		return false;
	};
		
	this.selectTask = function(tabName, itemIdx){
		this._activeTab(tabName);
		var items = this.items_.tabs.getTabItems(this.items_.tabs.getActiveTab());
		items.list.setCurSel(itemIdx);
	};
	
	this._init = function(){
		this._createTabsPanels();
		this.taskResSchedule_ = TaskResSchedule.snew(this.g_);
		this.checkAddFavoriteTask_ = CheckAddFavoriteTask.snew(this.g_);
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.g_.regEvent(EVT.NET, NETCMD.TASK, this, this._onSvrTask);
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRolebaseChange);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.task.taskdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.task.taskdlgex};
	}; 
	
	this._afterCreate = function(){
		this._createTabsContentSubDom();
		this._initTabsPanels();
	};
	
	this._setCallers = function(){
		this.items_.tabs.setCaller({self:this, caller:this._onSelectTab});
	};
	
	this._createTabsContentSubDom = function(){
		var templs = uicfg.task.taskdlgex.t_;
		var templ = templs[5];
		for ( var i=0; i<rstr.task.taskdlg.tabs.length; ++i ) {
			var tabItems = this.items_.tabs.getTabItems(i);
			tabItems.content_desc = TQ.createDom('div');
			tabItems.content_reward = TQ.createDom('div');
			TQ.setClass(tabItems.content_reward, 'reward');
			TQ.append(tabItems.content.getContainerObj(), tabItems.content_desc);
			TQ.append(tabItems.content.getContainerObj(), tabItems.content_reward);
			tabItems.content_reward.items = {};
			this.g_.getGUI().buildDomItems(tabItems.content_reward, templ, templs, tabItems.content_reward.items);
		}
	};
	
	this._createTabsPanels = function(){
		this.panels_['activity'] = TaskDlgActPanel.snew(this.g_);
		this.panels_['growup'] = TaskDlgGrowupPanel.snew(this.g_);
		this.panels_['role'] = TaskDlgRolePanel.snew(this.g_);
		this.panels_['everyday'] = TaskDlgEveryDayPanel.snew(this.g_);
	};
	
	this._initTabsPanels = function(){
		for ( var k in this.tabIdxs_ ) {
			this.panels_[k].setItems(this.items_.tabs.getTabItems(this.tabIdxs_[k]));
		}
	};
	
	this._initInfo = function(){
		this._update();
		this._blinkingBtn();
		this._activeTab(this.params_);
	};
	
	this._activeTab = function(tabName){
		var idx = this.tabIdxs_[tabName];
		this.items_.tabs.activeTab( idx ? idx : 0);
	};
	
	this._blinkingBtn = function(){
		if ( !this.hasNewTask_ ) return;
		
		UIM.getPanel('main').getToolbar().stopTaskBlinking();
		this.items_.tabs.getTabBtn(C_TAB_GROWUP_IDX).startBlinking(C_BLINKING_DURATION);
		this.hasNewTask_ = false;
	};
	
	this._onLoginOk = function(){
		TaskSender.sendGetAllTasks(this.g_);
	};
	
	this._onSvrTask = function(netevent){
		if ( netevent.data.tasks ) {
			var imgrTask = this.g_.getImgr().getTask();
			TQ.dictCopy(imgrTask.tasks, netevent.data.tasks);
			this._reorganizeTasks();
			this.g_.sendEvent({eid:EVT.TASKCHANGE, sid:0});
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		} else if ( netevent.data.roleTask ) {
			var imgrTask = this.g_.getImgr().getTask();
			TQ.dictCopy(imgrTask.roleTask, netevent.data.roleTask);
			this.g_.sendEvent({eid:EVT.TASKCHANGE, sid:1});
		} else if ( netevent.data.prestigeTask ) {
			var imgrTask = this.g_.getImgr().getTask();
			TQ.dictCopy(imgrTask.prestigeTask, netevent.data.prestigeTask);
			this.g_.sendEvent({eid:EVT.TASKCHANGE, sid:2});
		} else if ( netevent.data.startGTip ) {
			StartGlobalTip.snew(this.g_).openDlg();
			return;
		} else if ( netevent.data.openTodayAct ) {
			UIM.openDlg('activityval');
			this.g_.getImgr().setNewcomerHelpEnd();
			return;
		}
		
		this._update();
	};
	
	this._onRolebaseChange = function(){
		this.taskResSchedule_.initSchedule();
		this.taskResSchedule_.updateRoleTasks();
	};
	
	this._onSelectTab = function(tabIdx){
		if ( tabIdx == C_TAB_GROWUP_IDX ) {
			this.items_.tabs.getTabBtn(C_TAB_GROWUP_IDX).stopBlinking();
		}
	};
	
	this._update = function(){
		if ( !this.isShow() ) return;
		for ( var k in this.tabIdxs_ ) {
			this.panels_[k].update();
			var tabIdx = this.tabIdxs_[k];
			this.items_.tabs.getTabBtn(tabIdx).setNewFlag( this._hasCanGetGift(k) );
		}
	};
	
	this._hasCanGetGift = function(tabName){
		return this.panels_[tabName].hasCanGetGift();
	};
	
	this._reorganizeTasks = function(){
		var bak_growups = this.g_.getImgr().getTask().growups;
		this._initTasks();
		this._collectTasks();
		this._sortTasks();
		this._blinkBtnWhenHasNewGrowups(bak_growups);
		this._tipAddFavoriteTask();
	};
	
	this._tipAddFavoriteTask = function(){
		if (this.addFavoriteTiped_) return;
		
		var actives = this.g_.getImgr().getTask().actives;
		for ( var i=0; i<actives.length; ++i ) {
			var task  = actives[i];
			if ( task.itemres.id == FIXID.ADD_FAVORITE && task.state == TASK_STATE.WAIT_COMPLETE ) {
				this.g_.getGUI().sysMsgTips2(SMT_NORMAL, task.itemres.desc);
				this.addFavoriteTiped_ = true;
			}
		}
	};
	
	this._initTasks = function(){
		var imgrTask = this.g_.getImgr().getTask();
		imgrTask.actives = [];
		imgrTask.growups = [];
		imgrTask.subGrowups = [];
		imgrTask.roles = [];
		imgrTask.everydays = [];
		imgrTask.activityVals = [];
	};
	
	this._collectTasks = function(){
		var imgrTask = this.g_.getImgr().getTask();
		for ( var i=0; i<imgrTask.tasks.length; ++i ) {
			var task  = imgrTask.tasks[i];
			if (!task.itemres) {
				task.itemres = ItemResUtil.findTaskRes(task.id);
			}
			if (!task.itemres) {// for everyday task, taskId = resid*100 + idx
				task.itemres = ItemResUtil.findTaskRes(Math.floor(task.id/100)); 
			}
			
			if (!task.itemres) continue;
			if (task.state == TASK_STATE.COMPLETE && task.itemres.fixShow == 0)  continue;
			if (task.itemres.type == TASK_TYPE.ACTIVE) {
				if ( !TQ.isMobile() || task.itemres.id != FIXID.ADD_FAVORITE ) {
					imgrTask.actives.push(task);
				}
			} else if (task.itemres.type == TASK_TYPE.GROWUP) {
				imgrTask.growups.push(task);
			} else if (task.itemres.type == TASK_TYPE.SUBGROWUP){
				imgrTask.subGrowups.push(task);
			} else if (task.itemres.type == TASK_TYPE.ROLE){
				imgrTask.roles.push(task);
			} else if (task.itemres.type == TASK_TYPE.EVERYDAY){
				imgrTask.everydays.push(task);
			} else if (task.itemres.type == TASK_TYPE.ACTIVITYVAL){
				imgrTask.activityVals.push(task);
			}
		}
	};
	
	this._sortTasks = function(){
		var imgrTask = this.g_.getImgr().getTask();
		imgrTask.actives.sort(G_ID_ASCCOMP);
		imgrTask.growups.sort(G_ID_ASCCOMP);
		imgrTask.subGrowups.sort(G_ID_ASCCOMP);
		imgrTask.roles.sort(G_ID_ASCCOMP);
		imgrTask.everydays.sort(function(a, b){return a.id%100 - b.id%100;});
		imgrTask.activityVals.sort(G_ID_ASCCOMP);
	};
	
	this._blinkBtnWhenHasNewGrowups = function(oldGrowups){
		if ( !this._hasNewGrowupTask(oldGrowups) ) return;
		if ( !this.isShow() ) {
			UIM.getPanel('main').getToolbar().startTaskBlinking(C_BLINKING_DURATION);
			this.hasNewTask_ = true;
		} else if ( this.items_.tabs.getActiveTab() != C_TAB_GROWUP_IDX ) {
			this.items_.tabs.getTabBtn(C_TAB_GROWUP_IDX).startBlinking(C_BLINKING_DURATION);
		}
	};
	
	this._hasNewGrowupTask = function(oldGrowups){
		var imgrTask = this.g_.getImgr().getTask();
		for ( var i=0; i<imgrTask.growups.length; ++i ) {
			var task = imgrTask.growups[i];
			if ( !TQ.qfind(oldGrowups, 'id', task.id) )  return true;
		}
		return false;
	};
});

TaskDlgBaseList = Class.extern(function(){
	this.g_ = null;
	this.list_ = null;
	this.init = function(g, list) {
		this.g_ = g;
		this.list_ = list;
	};
	
	this.setCaller = function(caller){
		this.list_.setCaller(caller);
	};	
	
	this.update = function(tasks, isResetCurSel){
		this._updateListItems(tasks);
		if (isResetCurSel) {
			this._resetCurSel();
		}
	};	
	
	this._updateListItems = function(tasks){
		this.list_.setItemCount(tasks.length);
		for ( var i=0; i<this.list_.getCount(); ++i ) {
			var item = this.list_.getItem(i);
			var task = tasks[i];
			TQ.setTextEx(item.exsubs.name, task.itemres.name);
			TQ.setClass(item.exsubs.state, this._getStateCssClass(task.state));
			TQ.setTextEx(item.exsubs.state, rstr.task.taskdlg.states[task.state]);
		}
	};
	
	this._resetCurSel = function(){
		var lastCurSel = this.list_.getCurSel();
		if ( lastCurSel >= this.list_.getCount() ) {
			this.list_.setCurSel(0);
		} else if (lastCurSel < 0 && this.list_.getCount() > 0) {
			this.list_.setCurSel(0);
		} else {
			this.list_.setCurSel(lastCurSel);
		}
	};
	
	this._getStateCssClass = function(state){
		var stateCssClasss = ['wait_complete_state', 'wait_get_state', 'complete_state', 'cannotdo_state', 'cando_state', 'doing_state'];
		return stateCssClasss[state];
	};
});

TaskDlgBaseContent = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.init = function(g, items) {
		this.g_ = g;
		this.items_ = items;
	};
	
	this.update = function(task, lblDefs, canShowLbls, rewardLbl){
		this._updateContentDesc(task, lblDefs, canShowLbls);
		this._updateContentReward(task, rewardLbl);
		this.items_.content.refresh();
	};
	
	this._updateContentDesc = function(task, lblDefs, canShowLbls){
		if ( !task ) {
			TQ.setHtml(this.items_.content_desc, '');
			return;
		}
		
		var expeStr = '';
		for ( var i=0; i<canShowLbls.length; ++i ) {
			var lblName = canShowLbls[i];
			if (lblName == 'name' ) {
				expeStr += this._makeNameDiv(lblDefs, task);
			} else if (lblName == 'time' ) {
				expeStr += this._makeTimeDiv(lblDefs, task);
			}else if (lblName == 'help' ) {
				expeStr += this._makeHelpDiv(lblDefs, task);
			} else if (lblName == 'desc' ) {
				expeStr += this._makeDescDiv(lblDefs, task);
			} else if (lblName == 'precond' ) {
				expeStr += this._makePrecondDiv(lblDefs, task);
			} else if (lblName == 'difficulty' ) {
				expeStr += this._makeDifficultyDiv(lblDefs, task);
			} else if (lblName == 'detaildesc' ) {
				expeStr += this._makeDetailDescDiv(lblDefs, task);
			} else if (lblName == 'target' ) {
				expeStr += this._makeTargetDiv(lblDefs, task);
			}
		}
		
		TQ.setHtml( this.items_.content_desc, expeStr );
	};

	this._makeNameDiv = function(lblDefs, task){
		return this._makeDivStr('detailname', lblDefs.name + task.itemres.dname);
	};	
	
	this._makeTimeDiv = function(lblDefs, task){
		if (task.itemres.time.duration == 0) {
			return this._makeDivStr('time', lblDefs.time + rstr.task.taskdlg.content.longDuration);
		}
					
		var start = task.itemres.time.start;
		if (start == TASK_STARTTIME.SVR_OPEN) {
			start = this.g_.getImgr().getRoleRes().svrOpenTime;
		} else if (start >= TASK_STARTTIME.FIRST_LOGIN && start <= TASK_STARTTIME.MAX_FIRST_LOGIN ) {
			var days = (start - TASK_STARTTIME.FIRST_LOGIN);
			start = this.g_.getImgr().getRoleRes().firstLoginTime + days*24*3600;
		}
		var startTime = TQ.formatDateTime(start);
		var endTime = TQ.formatDateTime(start + task.itemres.time.duration);
		var time = TQ.format(rstr.task.taskdlg.content.timeToTimeFmt, startTime, endTime);
		return this._makeDivStr('time', lblDefs.time + time);
	};
	
	this._makeHelpDiv = function(lblDefs, task){
		return this._makeDivStr('help', lblDefs.help + task.itemres.help);
	};
	
	this._makeDescDiv = function(lblDefs, task){
		return this._makeDivStr('desc', lblDefs.desc + task.itemres.desc);
	};
	
	this._makePrecondDiv = function(lblDefs, task){
		var s = lblDefs.precond + TQ.format(rstr.task.taskdlg.content.taskPrecondFmt, task.itemres.precond.roleLevel);
		if (task.state == TASK_STATE.CANNOTDO) {
			return this._makeDivStr('precond precond_noenough', s);
		} else {
			return this._makeDivStr('precond precond_enough', s);
		}
	};
	
	this._makeDifficultyDiv = function(lblDefs, task){
		var stars = '';
		for ( var i=0; i<task.itemres.difficulty; ++i ) {
			stars += rstr.comm.star;
		}
		return this._makeDivStr('difficulty', lblDefs.difficulty + stars);
	};
	
	this._makeDetailDescDiv = function(lblDefs, task){
		var s = TQ.format(rstr.task.taskdlg.content.taskDDescFmt
			,task.itemres.needps
			,this._getRoleTaskNeedTime(task)
			,this._getRoleTaskCDTime(task) );
		return this._makeDivStr('detaildesc', s);
	};
	
	this._getRoleTaskNeedTime = function(task){
		if ( this.g_.getImgr().hasVipEffect(VIP_EFF.SPEED_ROLETASK) ) {
			return TQ.format(rstr.task.taskdlg.lbl.vipimm, this.g_.getImgr().getVipLevel() );
		} else {
			return TQ.formatTime(0, task.itemres.needtime);
		}
	};
	
	this._getRoleTaskCDTime = function(task){
		if ( this.g_.getImgr().hasVipEffect(VIP_EFF.SPEED_ROLETASK) ) {
			return TQ.format(rstr.task.taskdlg.lbl.vipimm, this.g_.getImgr().getVipLevel() );
		} else {
			return TQ.formatTime(0, task.itemres.cdtime);
		}
	};
	
	this._makeTargetDiv = function(lblDefs, task){
		return this._makeDivStr('target', lblDefs.target + task.itemres.targetDesc);
	};
		
	this._updateContentReward = function(task, rewardLbl){
		if ( !task ) {
			TQ.setCSS(this.items_.content_reward, 'display', 'none');
			return;
		}
		
		TQ.setCSS(this.items_.content_reward, 'display', 'block');
		TQ.setHtml( this.items_.content_reward.items.desc,  rewardLbl + this._getRewardDesc(task) );
		var items = this._getRewardItems(task);
		var rewardList = this.items_.content_reward.items.rewardList;
		rewardList.setItemCount(items.length);
		for ( var i=0; i<rewardList.getCount(); ++i ) {
			var item = rewardList.getItem(i);
			var reward = items[i];
			var itemRes = ItemResUtil.findItemres(reward.id);
			CommDrawItem.drawItemIcon(item.exsubs.icon, itemRes);
			TQ.setTextEx(item.exsubs.number, rstr.comm.numPrefix + reward.number);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:this._onGetRewardItemTip}, {itemRes:itemRes});
		}
	};
	
	this._getRewardDesc = function(task){
		return DropItemUtil.getSimpleDesc(task.itemres.dropId);
	};
	
	this._getRewardItems = function(task){
		return DropItemUtil.getDropItems(task.itemres.dropId);
	};
	
	this._onGetRewardItemTip = function(data){
		return TIPM.getItemDesc({id:0, itemres:data.itemRes}, 'sys');
	};
	
	this._makeDivStr = function(className, content){
		return '<div class="' + className + '">' + content + '</div>';
	};
});

TaskDlgBaseOpBtn = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.task_ = null;
	this.init = function(g, items) {
		this.g_ = g;
		this.items_ = items;
		this._setCaller();
	};
	
	this.update = function(task){
		this.task_ = task;
		if ( !task || task.state == TASK_STATE.WAIT_COMPLETE ) {
			this.items_.getRewardBtn.enable(false);
			this.items_.getRewardBtn.setText(rstr.task.taskdlg.btn.getReward);
		} else if ( task.state == TASK_STATE.WAIT_GET ) {
			this.items_.getRewardBtn.enable(true);
			this.items_.getRewardBtn.setText(rstr.task.taskdlg.btn.getReward);
		} else { 
			this.items_.getRewardBtn.enable(false);
			this.items_.getRewardBtn.setText(rstr.task.taskdlg.btn.completed);
		}
	};
	
	this._setCaller = function(){
		this.items_.getRewardBtn.setCaller({self:this, caller:this._onClickGetRewardBtn});
	};

	this._onClickGetRewardBtn = function(){
		TaskSender.sendGetReward(this.g_, this.task_.id);
	};	
});

TaskDlgBasePanel = JClass.ex({
	hasCanGetGift: function(){
		var tasks = this._getTasks();
		for ( var i=0; i<tasks.length; ++i ) {
			var task = tasks[i];
			if (task.state == TASK_STATE.WAIT_GET) {
				return true;
			} else if (task.state == TASK_STATE.CANDO && this._isCanDoRoleTask(task)) {
				return true;
			}
		}
		return false;
	}
	
	,_isCanDoRoleTask : function(task){
		var res =  ItemResUtil.findTaskRes(task.id);
		var roleTask = this.g_.getImgr().getTask().roleTask;
		var hasPs = this.g_.getImgr().getRoleAttrVal(ATTR.PS);
		return ( roleTask.doing.id == 0 && roleTask.cdStopTime == 0 && hasPs >= res.needps );
	}
});
	
TaskDlgActPanel = TaskDlgBasePanel.ex({
	init : function(g) {
		this.g_ = g;
		this.items_ = null;
		this.listComponent_ = null;
		this.contentComponent_ = null;
		this.opBtnComponent_ = null;
	}
	
	,setItems : function(items){
		this.items_ = items;
		this._createComponents();
		this._setCaller();
	}
	
	,update : function(){
		this.listComponent_.update(this._getTasks(), true);
	}
	
	,_getTasks : function(){
		return this.g_.getImgr().getTask().actives;
	}
	
	,_createComponents : function(){
		this.listComponent_ = TaskDlgBaseList.snew(this.g_, this.items_.list);
		this.contentComponent_ = TaskDlgBaseContent.snew(this.g_, this.items_);
		this.opBtnComponent_ = TaskDlgBaseOpBtn.snew(this.g_, this.items_);
	}
	
	,_setCaller : function(){
		this.listComponent_.setCaller({self:this, caller:this._onClickListItem});
		this.items_.paygold.setCaller({self:this, caller:this._onClickPayGold});
	}
	
	,_onClickListItem : function(e, idx){
		var task = this.g_.getImgr().getTask().actives[idx];
		this.contentComponent_.update(task, this._getContenLbls(), this._getCanShowLbls(), this._getRewardLbl());
		this.opBtnComponent_.update(task);
	}	
	
	,_onClickPayGold : function(){
		JMISC.openPayWnd();
	}
	
	,_getContenLbls : function() {
		return {
			'name':rstr.task.taskdlg.content.name
			,'time':rstr.task.taskdlg.content.activeTime
			,'desc':rstr.task.taskdlg.content.activeDesc
			,'target':rstr.task.taskdlg.content.activeTarget};
	}
	
	,_getCanShowLbls : function(){
		return ['name', 'time', 'desc', 'target'];
	}
	
	,_getRewardLbl : function(){
		return rstr.task.taskdlg.content.activeReward;
	}
});

TaskDlgGrowupPanel = TaskDlgBasePanel.ex({
	init : function(g) {
		this.g_ = g;
		this.items_ = null;
		this.listComponent_ = null;
		this.subListComponent_ = null;
		this.contentComponent_ = null;
		this.opBtnComponent_ = null;
	}
	
	,setItems : function(items){
		this.items_ = items;
		this._createComponents();
		this._setCaller();
	}
	
	,update : function(){
		var idx =  this.items_.list.getCurSel();
		var subIdx =  this.items_.subList.getCurSel();
		var isFirstUpdate = (idx < 0 && subIdx < 0);
		var isSelList = (idx >= 0);		
		var isSelSubList = (subIdx >= 0);
		this.listComponent_.update(this.g_.getImgr().getTask().growups, isFirstUpdate || isSelList);
		this.subListComponent_.update(this.g_.getImgr().getTask().subGrowups, isSelSubList);
	}
	
	,_getTasks : function(){
		var tasks = [];
		for ( var i=0; i<this.g_.getImgr().getTask().growups.length; ++i ) {
			tasks.push(this.g_.getImgr().getTask().growups[i]);
		}
		for ( var i=0; i<this.g_.getImgr().getTask().subGrowups.length; ++i ) {
			tasks.push(this.g_.getImgr().getTask().subGrowups[i]);
		}
		return tasks;
	}
	
	,_createComponents : function(){
		this.listComponent_ = TaskDlgBaseList.snew(this.g_, this.items_.list);
		this.subListComponent_ = TaskDlgBaseList.snew(this.g_, this.items_.subList);
		this.contentComponent_ = TaskDlgBaseContent.snew(this.g_, this.items_);
		this.opBtnComponent_ = TaskDlgBaseOpBtn.snew(this.g_, this.items_);
	}
	
	,_setCaller : function(){
		this.listComponent_.setCaller({self:this, caller:this._onClickListItem});
		this.subListComponent_.setCaller({self:this, caller:this._onClickSubListItem});
	}
	
	,_onClickListItem : function(e, idx){
		if ( idx >= 0 ) this.items_.subList.setCurSel(-1);
		this._updateContent( this.g_.getImgr().getTask().growups[idx] );
	}
	
	,_onClickSubListItem : function(e, idx){
		if ( idx >= 0 ) this.items_.list.setCurSel(-1);
		this._updateContent( this.g_.getImgr().getTask().subGrowups[idx] );
	}
	
	,_updateContent : function(task){
		this.contentComponent_.update(task, this._getContenLbls(), this._getCanShowLbls(), this._getRewardLbl());
		this.opBtnComponent_.update(task);
	}
	
	,_getContenLbls : function() {
		return {'desc':rstr.task.taskdlg.content.growupDesc
			,'help':rstr.task.taskdlg.content.growupHelp
			,'target':rstr.task.taskdlg.content.growupTarget};
	}
	
	,_getCanShowLbls : function(){
		return ['desc', 'help', 'target'];
	}
	
	,_getRewardLbl : function(){
		return rstr.task.taskdlg.content.growupReward;
	}
});

TaskDlgRoleOpBtn = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.task_ = null;
	this.init = function(g, items) {
		this.g_ = g;
		this.items_ = items;
		this._setCaller();
	};
	
	this.update = function(task){
		this.task_ = task;
		var roleTask = this.g_.getImgr().getTask().roleTask;
		if ( roleTask.doing.id > 0 ) {
			this._showBtnParent(this.items_.speedBtn);
			this._hideBtnParent(this.items_.doBtn);
		} else if ( roleTask.cdStopTime > 0 ) {
			this._hideBtnParent(this.items_.speedBtn);
			this._hideBtnParent(this.items_.doBtn);
		} else if ( !task || task.state == TASK_STATE.CANNOTDO ) {
			this._hideBtnParent(this.items_.speedBtn);
			this._hideBtnParent(this.items_.doBtn);
		} else if ( task.state == TASK_STATE.CANDO ) {
			this._hideBtnParent(this.items_.speedBtn);
			this._showBtnParent(this.items_.doBtn);
		} else if ( task.state == TASK_STATE.DOING ) {
			this._hideBtnParent(this.items_.speedBtn);
			this._hideBtnParent(this.items_.doBtn);
		}
	};
	
	this._showBtnParent = function(btn) {
		TQ.setCSS(btn.getParent(), 'display', 'block');
		btn.show();
	};
	
	this._hideBtnParent = function(btn) {
		TQ.setCSS(btn.getParent(), 'display', 'none');
		btn.hide();
	};
	
	this._setCaller = function(){
		this.items_.doBtn.setCaller({self:this, caller:this._onClickDoTaskBtn});
		this.items_.speedBtn.setCaller({self:this, caller:this._onClickSpeedBtn});
		this.items_.useItemBtn.setCaller({self:this, caller:this._onClickUseItemBtn});
	};
	
	this._onClickDoTaskBtn = function(){
		TaskSender.sendDoRoleTask(this.g_, this.task_.id);
	};	
	
	this._onClickSpeedBtn = function(){
		var stopTime = this.g_.getImgr().getTask().roleTask.doing.stopTime;
		UIM.getDlg('uselistitem').openDlg([RES_EFF.ACC_DOINGROLETASK] ,{id:0, stoptime:stopTime, name:rstr.task.taskdlg.roleTask, type:RES_TRG.SELF_ROLE});
	};
	
	this._onClickUseItemBtn = function(){
		var itemids = [3000018, 3000019];
		UIM.getDlg('uselistitem').openDlgByItemIds(rstr.useitem.filterdlg.title.addPs
			,rstr.useitem.filterdlg.btn.useItem
			,itemids	,{id:0, name:'', type:RES_TRG.SELF_ROLE} );
	};
});

TaskDlgRoleContent = TaskDlgBaseContent.extern(function(){
	this._getRewardDesc = function(task){
		return TQ.format(rstr.task.taskdlg.content.roleTaskReward, task.itemres.roleExp, task.itemres.multiple);
	};
	
	this._getRewardItems = function(task){
		return [];
	};
});

TaskDlgRolePanel = TaskDlgBasePanel.ex({
	init : function(g) {
		this.g_ = g;
		this.items_ = null;
		this.listComponent_ = null;
		this.contentComponent_ = null;
		this.opBtnComponent_ = null;
	}
	
	,setItems : function(items){
		this.items_ = items;
		this._createComponents();
		this._setCaller();
		this._regEvent();
		this.g_.regUpdater(this, this._onUpdate, 1000);
	}
	
	,update : function(){
		this.listComponent_.update(this._getTasks(), true);
		this._updateRolePs();
		this._updateDoingInfo();
	}
	
	,_getTasks : function(){
		return this.g_.getImgr().getTask().roles;
	}
	
	,_updateRolePs : function(){
		var curPs = this.g_.getImgr().getRoleAttrVal(ATTR.PS);
		TQ.setTextEx(this.items_.rolePs, TQ.format(rstr.task.taskdlg.roleps, curPs));
	}
	
	,_updateDoingInfo : function(){
		TQ.setTextEx(this.items_.doingInfo, '');
		this._updateDoingTask();
		this._updateTaskCDTime();		
	}
	
	,_updateDoingTask : function(){
		var doingTask = this.g_.getImgr().getTask().roleTask.doing;
		if (doingTask.id == 0) return;
		
		var taskRes = ItemResUtil.findTaskRes(doingTask.id);
		var leftTime = doingTask.stopTime - this.g_.getSvrTimeS();
		var s = '';
		if (leftTime > 0) {
			s = TQ.format(rstr.task.taskdlg.content.doingRoleTask, taskRes.name, TQ.formatTime(0, leftTime));
		}
		TQ.setTextEx(this.items_.doingInfo, s);
	}
	
	,_updateTaskCDTime : function(){
		var cdStopTime = this.g_.getImgr().getTask().roleTask.cdStopTime;
		if ( cdStopTime == 0 ) return;
		
		var leftTime = cdStopTime - this.g_.getSvrTimeS();
		var s = '';
		if (leftTime > 0) {
			s = TQ.format(rstr.task.taskdlg.content.roleTaskCD, TQ.formatTime(0, leftTime));
		}
		TQ.setTextEx(this.items_.doingInfo, s);
	}
	
	,_createComponents : function(){
		this.listComponent_ = TaskDlgBaseList.snew(this.g_, this.items_.list);
		this.contentComponent_ = TaskDlgRoleContent.snew(this.g_, this.items_);
		this.opBtnComponent_ = TaskDlgRoleOpBtn.snew(this.g_, this.items_);
	}
	
	,_setCaller : function(){
		this.listComponent_.setCaller({self:this, caller:this._onClickListItem});
	}
	
	,_regEvent : function(){
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRolebaseChange);
	}
	
	,_onClickListItem : function(e, idx){
		var task = this.g_.getImgr().getTask().roles[idx];
		this.contentComponent_.update(task, this._getContenLbls(), this._getCanShowLbls(), this._getRewardLbl());
		this.opBtnComponent_.update(task);
	}
	
	,_onRolebaseChange : function(){
		this._updateRolePs();
	}
	
	,_onUpdate : function(){
		this._updateDoingInfo();
	}
	
	,_getContenLbls : function() {
		return {
			'desc':rstr.task.taskdlg.content.taskDesc
			,'precond':rstr.task.taskdlg.content.taskPrecond
			,'detaildesc':rstr.task.taskdlg.content.taskDetailDesc
			};
	}
	
	,_getCanShowLbls : function(){
		return ['desc', 'precond', 'detaildesc'];
	}
	
	,_getRewardLbl : function(){
		return rstr.task.taskdlg.content.taskReward;
	}
});

TaskDlgEveryDayOpBtn = Class.extern(function(){
	var m_this = null;
	this.g_ = null;
	this.items_ = null;
	this.task_ = null;
	this.baseOpBtn = null;
	this.init = function(g, items) {
		m_this = this;
		this.g_ = g;
		this.items_ = items;
		this.baseOpBtn = TaskDlgBaseOpBtn.snew(this.g_, this.items_);
		this._setCaller();
	};
	
	this.update = function(task){
		this.task_ = task;
		this.baseOpBtn.update(task);
		if ( task && task.state == TASK_STATE.WAIT_COMPLETE) {
			this.items_.changeTaskBtn.show();
			this.items_.immediatelyBtn.show();			
		} else if ( task && task.state == TASK_STATE.WAIT_GET) {
			this.items_.changeTaskBtn.show();
		} else { 
			this.items_.changeTaskBtn.hide();
			this.items_.immediatelyBtn.hide();
		}
	};
	
	this._setCaller = function(){
		this.items_.changeTaskBtn.setCaller({self:this, caller:this._onClickChangeTaskBtn});
		this.items_.immediatelyBtn.setCaller({self:this, caller:this._onClickImmediatelyBtn});
	};

	this._onClickChangeTaskBtn = function(){
		this.g_.getGUI().msgBox(rstr.comm.msgts, rstr.task.taskdlg.tip.changeEverydayTask, MB_F_YESNO 
			,{self:this, caller:function(msgid){
			if ( msgid == MB_IDYES ) {
				TaskSender.sendChangeEverydayTask(m_this.g_, m_this.task_.id);
			}
		}});
	};
	
	this._onClickImmediatelyBtn = function(){
		this.g_.getGUI().msgBox(rstr.comm.msgts, rstr.task.taskdlg.tip.completeEverydayTask, MB_F_YESNO 
			,{self:this, caller:function(msgid){
			if ( msgid == MB_IDYES ) {
				TaskSender.sendCompleteEverydayTask(m_this.g_, m_this.task_.id);
			}
		}});
	};
});

GetGiftByPrestigeChecker = JClass.ex({
	_init : function(g) {
		this._g = g;
	}
	
	,hasCanGetGift : function(){
		var hasEnoughPrestige = this._g.getImgr().getRoleRes().prestige >= MIN_NEED_PRESTIGE;
		var prestigeTask = this._g.getImgr().getTask().prestigeTask;
		var isGettedToday = TQ.isSameDay(this._g.getSvrTimeS(), prestigeTask.lastTime);
		return (hasEnoughPrestige && !isGettedToday);		
	}
});

TaskDlgPrestigePanel = TaskDlgBasePanel.ex({
	init : function(g, items) {
		this.g_ = g;
		this.items_ = null;
	}
	
	,setItems : function(items){
		this.items_ = items;
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRolebaseChange);
		this.items_.getByPrestige.setCaller({self:this, caller:this._onClickGetByPrestigeBtn});
	}
	
	,update : function(){
		this._updatePrestige();
		this._updateBtnState();
	}
	
	,hasCanGetGift : function(){
		return GetGiftByPrestigeChecker.snew(this.g_).hasCanGetGift();
	}
	
	,_onRolebaseChange : function(){
		this._updatePrestige();
	}
	
	,_onClickGetByPrestigeBtn : function(){
		if (this.g_.getImgr().getRoleRes().prestige < MIN_NEED_PRESTIGE ) {
			this.g_.getGUI().msgBox(rstr.comm.msgts, rstr.task.taskdlg.tip.noEnoughPrestige, MB_F_CLOSE, null);
		} else {
			TaskSender.sendGetRewardByPrestige(this.g_);
		}
	}
	
	,_updatePrestige : function(){
		TQ.setTextEx(this.items_.prestige, rstr.task.taskdlg.prestige + this.g_.getImgr().getRoleRes().prestige);
	}
	
	,_updateBtnState : function(){
		var prestigeTask = this.g_.getImgr().getTask().prestigeTask;
		var isGettedToday = TQ.isSameDay(this.g_.getSvrTimeS(), prestigeTask.lastTime);
		this.items_.getByPrestige.enable(!isGettedToday);
	}
});

TaskDlgEveryDayPanel = TaskDlgBasePanel.ex({
	init : function(g) {
		this.g_ = g;
		this.items_ = null;
		this.listComponent_ = null;
		this.contentComponent_ = null;
		this.opBtnComponent_ = null;
		this.prestigePanel_ = TaskDlgPrestigePanel.snew(this.g_);
	}
	
	,setItems : function(items){
		this.items_ = items;
		this._createComponents();
		this._setCaller();
	}	
	
	,update : function(){
		var everydays = this._getTasks();
		if (this._isChangedBefore(everydays)) return;
		this.listComponent_.update(everydays, true);
		this.prestigePanel_.update(); // 声望变化也调用
	}
	
	,hasCanGetGift : function(){
		return this._super.hasCanGetGift.call(this) 
			|| this.prestigePanel_.hasCanGetGift();
	}
	
	,_getTasks : function(){
		return this.g_.getImgr().getTask().everydays;
	}
	
	,_createComponents : function(){
		this.listComponent_ = TaskDlgBaseList.snew(this.g_, this.items_.list);
		this.contentComponent_ = TaskDlgBaseContent.snew(this.g_, this.items_);
		this.opBtnComponent_ = TaskDlgEveryDayOpBtn.snew(this.g_, this.items_);
		this.prestigePanel_.setItems(this.items_);
	}
	
	,_setCaller : function(){
		this.listComponent_.setCaller({self:this, caller:this._onClickListItem});
	}
	
	,_onClickListItem : function(e, idx){
		var task = this.g_.getImgr().getTask().everydays[idx];
		this.contentComponent_.update(task, this._getContenLbls(), this._getCanShowLbls(), this._getRewardLbl());
		this.opBtnComponent_.update(task);
	}
	
	,_getContenLbls : function() {
		return {
			'desc':rstr.task.taskdlg.content.taskDesc
			,'help':rstr.task.taskdlg.content.taskHelp
			,'difficulty':rstr.task.taskdlg.content.taskDifficulty
			,'target':rstr.task.taskdlg.content.taskTarget};
	}

	,_getCanShowLbls : function(){
		return ['desc', 'help', 'difficulty', 'target'];
	}
	
	,_getRewardLbl : function(){
		return rstr.task.taskdlg.content.activeReward;
	}
	
	,_isChangedBefore : function(everydays){
		return (everydays.length < res_everyday_task_cnt) && (everydays.length > 0);
	}
});
