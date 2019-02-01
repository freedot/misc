/*******************************************************************************/
var MAX_SIGNIN_COUNT = 20;
ActivityValCanGetOrSignChecker = JClass.ex({
	init : function(g){
		this.g_ = g;
	}
	
	,hasCanGetReward : function(){
		for (var i=0; i<res_activityval_rewards.length; ++i ) {
			var canInfo = this.getCanGetInfo(i);
			if (canInfo.isCanGet) return true;
		}
		return false;
	}
	
	,hasCanSign : function(){
		var signin = this.g_.getImgr().getActivityVal().signin;
		return signin.todaySign == 0 && signin.days < MAX_SIGNIN_COUNT;
	}
	
	,hasCanGetSignReward : function(){
		for (var i=0; i<res_signin_rewards.length; ++i ) {
			var canInfo = this.getCanGetSignInfo(i);
			if (canInfo.isCanGet) return true;
		}
		return false;
	}
	
	,getCanGetInfo : function(rewardIdx){
		var activityVal = this.g_.getImgr().getActivityVal();
		var res = res_activityval_rewards[rewardIdx];
		var isGot = TQ.find(activityVal.gotActRewards, null, res.id) != null;
		var isEnoughVal = (activityVal.val >= res.val);
		var isCanGet = (!isGot) && isEnoughVal;
		return {isCanGet:isCanGet, isGot:isGot, isEnoughVal:isEnoughVal};
	}
	
	,getCanGetSignInfo : function(idx){
		var signin = this.g_.getImgr().getActivityVal().signin;
		var res = res_signin_rewards[idx];
		var isGot = TQ.find(signin.gotRewards, null, res.id) != null;
		var isEnoughDays = (signin.days >= res.days);
		var isCanGet = (!isGot) && isEnoughDays;
		return {isCanGet:isCanGet, isGot:isGot, isEnoughDays:isEnoughDays};
	}
});
	

ActivityValBasePanel = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.init = function(g, dlg, items){
		this.g_ = g;
		this.dlg_ = dlg;
		this.items_ = items;
		this.canGetChecker_ = ActivityValCanGetOrSignChecker.snew(this.g_);
		this._regEvents();
		this._setCallers();
	};

	this._regEvents = function(){};
	this._setCallers = function(){};
});

ActivityValActivityValPanel = ActivityValBasePanel.extern(function(){
	this.update = function(){
		var activityVal = this.g_.getImgr().getActivityVal();
		TQ.setTextEx(this.items_.activityVal, activityVal.val);
		
		this.items_.activityProg.setRange(100);
		this.items_.activityProg.setValue(0, activityVal.val);
		
		TQ.setTextEx(this.items_.curActivityTip, this._getActivityValTip(activityVal.val));	
	};
	
	this._getActivityValTip = function(val){
		for ( var i=res_activityval_tips.length-1; i>=0; --i ) {
			var res = res_activityval_tips[i];
			if (val >= res.val) return res.tip;
		}
		return '';
	};
});

ActivityValBaseInfoPanel = ActivityValBasePanel.extern(function(){
	this._regEvents = function(){
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onRolebaseChange);
		this.g_.regEvent(EVT.LETTERUPDATE, 0, this, this._onMailChange);
	};
	
	this._setCallers = function(){
		this.items_.newMailNumber.setCaller({self:this, caller:this._onClickMailNumber});
		this.items_.rolePs.setCaller({self:this, caller:this._onClickRolePs});		
	};
	
	this.update = function(){
		this._updateMailNumber();
		this._updateRolePs();
	};
	
	this._updateMailNumber = function(){
		if (!this.dlg_.isShow()) return;
		this.items_.newMailNumber.setText(String(this.g_.getImgr().getLetterRes().un.length));
	};
	
	this._updateRolePs = function(){
		if (!this.dlg_.isShow()) return;
		var curPs = this.g_.getImgr().getRoleAttrVal(ATTR.PS);
		this.items_.rolePs.setText(String(curPs));
	};	
	
	this._onRolebaseChange = function(){
		this._updateRolePs();
	};
	
	this._onMailChange = function(){
		this._updateMailNumber();
	};	
	
	this._onClickMailNumber = function(){
		UIM.openDlg('letter');
	};
	
	this._onClickRolePs = function(){
		UIM.openDlg('task', 'role');
	};	
});

ActivityValTaskUtil = JClass.ex({
	_init : function(g){
		this.g_ = g;
	}
	
	,hasRedDot : function(){
		var noFinishTasks = this.collectNoFinishTasks();
		for ( var i=0; i<noFinishTasks.length; ++i ) {
			var task = noFinishTasks[i];
			if ( task.reddot ) return true;
		}
		return false;
	}
	
	,collectNoFinishTasks : function(){
		var noFinishTasks = [];
		var activityVals = this.g_.getImgr().getTask().activityVals;
		for ( var i=0; i<res_activityval_tasks.length; ++i ) {
			var res = res_activityval_tasks[i];
			var task = TQ.find(activityVals, 'id', res.id);
			if ((task == null) || (task.times < res.times)) {
				var reddot = this._getHasRedDot(res.id);
				noFinishTasks.push({res:res, curTimes:task?task.times:0, reddot:reddot});
			}
		}
		
		noFinishTasks.sort(function(a, b){
			if (b.curTimes == a.curTimes){
				return a.res.id - b.res.id;
			} else {
				return b.curTimes - a.curTimes;
			}
		});

		return noFinishTasks;
	}
	
	,_getHasRedDot : function(taskId){
		if ( taskId == FIXID.ACTVAL_OTHER_FARM ) {
			return this._getOtherFarmHasRedDot();
		} else if (taskId == FIXID.ACTVAL_ROLE_TASK) {
			return this._getRoleTaskHasRedDot();
		} else if (taskId == FIXID.ACTVAL_GET_PRESTIGE) {
			return this._getGetPrestigeHasRedDot();
		} else if (taskId == FIXID.ACTVAL_DAY_TASK) {
			return this._getDayTaskHasRedDot();
		} else if (taskId == FIXID.ACTVAL_JOIN_TERRACE) {
			return this._getJoinTerraceHasRedDot();
		} else if (taskId == FIXID.ACTVAL_JOIN_TOWER) {
			return this._getJoinTowerHasRedDot();
		} else if (taskId == FIXID.ACTVAL_ALLI_CONTRIBUTE) {
			return this._getAlliContributeHasRedDot();
		} else if (taskId == FIXID.ACTVAL_GET_ALLI_GIFT) {
			return this._getGetAlliGiftHasRedDot();
		} else if (taskId == FIXID.ACTVAL_LAWLIGHT_FEED) {
			return this._getLawlightFeedHasRedDot();
		} else if (taskId == FIXID.ACTVAL_TRADING_AREA) {
			return this._getTradingAreaHasRedDot();
		} else if (taskId == FIXID.ACTVAL_HERO_STEEL) {
			return this._getHeroSteelHasRedDot();
		} else if (taskId == FIXID.ACTVAL_ASSIGN_HEROEXP) {
			return this._getAssignHeroExpHasRedDot();
		} else if (taskId == FIXID.ACTVAL_SPEED_BUILDING) {
			return this._getSpeedBuildingHasRedDot();
		} else if (taskId == FIXID.ACTVAL_ZHANLING_FIELD) {
			return this._getZhanlingFieldHasRedDot();
		} else if (taskId == FIXID.ACTVAL_GET_RES_FROMFIELD) {
			return this._getGetResFromFieldHasRedDot();
		} else if (taskId == FIXID.ACTVAL_PROVOKE_PLAYER) {
			return this._getProvokePlayerHasRedDot();
		} else if (taskId == FIXID.ACTVAL_FIGHT_PLAYER_FOR_HONOR) {
			return this._getFightHonorHasRedDot();
		} else {
			return false;
		}
	}
	
	,_getOtherFarmHasRedDot : function(){
		return this.g_.getImgr().getRoleAttrVal(ATTR.PS) > 0;
	}
	
	,_getRoleTaskHasRedDot : function(){
		var hasDoing = this.g_.getImgr().getTask().roleTask.doing.id > 0;
		var hasCD = this.g_.getImgr().getTask().roleTask.cdStopTime > 0;
		var noDoing = !hasDoing && !hasCD;
		return this.g_.getImgr().getRoleAttrVal(ATTR.PS) >= 50 && noDoing;
	}
	
	,_getGetPrestigeHasRedDot : function(){
		return GetGiftByPrestigeChecker.snew(this.g_).hasCanGetGift();
	}
	
	,_getDayTaskHasRedDot : function(){
		var tasks = this.g_.getImgr().getTask().everydays;
		for ( var i=0; i<tasks.length; ++i ) {
			var task = tasks[i];
			if ( task.state == TASK_STATE.WAIT_COMPLETE ) {
				return true;
			}
		}
		return false;
	}
	
	,_getJoinTerraceHasRedDot : function(){
		return this.g_.getImgr().getRoleRes().level >= res_enter_terrace_need_rolelevel;
	}
	
	,_getJoinTowerHasRedDot : function(){
		return this.g_.getImgr().getRoleRes().level >= res_enter_tower_need_rolelevel;
	}
	
	,_getAlliContributeHasRedDot : function(){
		return this.g_.getImgr().isInAlliance();
	}
	
	,_getGetAlliGiftHasRedDot : function(){
		if ( !this.g_.getImgr().isInAlliance() ) return false;
		
		var selfMember = this.g_.getImgr().getMyAlliance().getSelfMember();
		return !selfMember.isTodayGotRes();
	}
	
	,_getLawlightFeedHasRedDot : function(){
		if ( !this.g_.getImgr().isInAlliance() ) return false;
		
		return AlliLawLightUtil.snew(this.g_).isCanFeed();
	}
	
	,_getTradingAreaHasRedDot : function(){
		return UIM.getDlg('tradingarea').isCanTrade();
	}
	
	,_getHeroSteelHasRedDot : function(){
		return this.g_.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD) > 0;
	}
	
	,_getAssignHeroExpHasRedDot : function(){
		return this.g_.getImgr().getRoleAttrVal(ATTR.XPS) > 0;
	}
	
	,_getSpeedBuildingHasRedDot : function(){
		return true;
	}
	
	,_getZhanlingFieldHasRedDot : function(){
		return !this.g_.getImgr().isNewPlayer() && !this.g_.getImgr().isRestPlayer();
	}
	
	,_getGetResFromFieldHasRedDot : function(){
		return this.g_.getImgr().getSelfFields().list.length > 0;
	}
	
	,_getProvokePlayerHasRedDot : function(){
		return !this.g_.getImgr().isNewPlayer() && !this.g_.getImgr().isRestPlayer();
	}
	
	,_getFightHonorHasRedDot : function(){
		return this._getProvokePlayerHasRedDot();
	}
});

ActivityValTaskListPanel = ActivityValBasePanel.extern(function(){
	var C_TITLE_COUNT = 2;
	
	var super_init = this.init;
	this.init = function(g, dlg, items){
		super_init.call(this, g, dlg, items); 
		this.util_ = ActivityValTaskUtil.snew(this.g_);
	};
	
	this._regEvents = function(){
		this.g_.regEvent(EVT.TASKCHANGE, 0, this, this._onTaskChange);
	};
	
	this.update = function(){
		if (!this.dlg_.isShow()) return;
		
		this.items_.taskList.setItemCount(res_activityval_tasks.length + C_TITLE_COUNT); 
		
		var pos = 0;
		var noFinishTasks = this._collectNoFinishTasks();
		this._setTaskListItemTitle(pos++, TQ.format(rstr.activityValDlg.lbl.noFinishTaskTitle, noFinishTasks.length));
		pos = this._setTaskListItems(pos, noFinishTasks);
		
		var finishTasks = this._collectFinishTasks();
		this._setTaskListItemTitle(pos++, TQ.format(rstr.activityValDlg.lbl.finishTaskTitle, finishTasks.length));
		pos = this._setTaskListItems(pos, finishTasks);		
	};
	
	this._collectNoFinishTasks = function(){
		return this.util_.collectNoFinishTasks();
	};
	
	this._collectFinishTasks = function(){
		var finishTasks = [];
		var activityVals = this.g_.getImgr().getTask().activityVals;
		for ( var i=0; i<res_activityval_tasks.length; ++i ) {
			var res = res_activityval_tasks[i];
			var task = TQ.find(activityVals, 'id', res.id);
			if (task && task.times == res.times) {
				finishTasks.push({res:res, curTimes:res.times, reddot:false});
			}
		}
		return finishTasks;
	};
	
	this._setTaskListItemTitle = function(idx, title){
		var item = this.items_.taskList.getItem(idx);
		item.exsubs.name.setText(title);
		item.exsubs.name.resetUIBack(uiback.btn.activityVal.nolink_title);
		
		item.exsubs.task = null;
		TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetTaskNameTip}, {idx:idx});

		TQ.setCSS(item.exsubs.reddot, 'display', 'none');
		TQ.setTextEx(item.exsubs.number, '');
		TQ.setTextEx(item.exsubs.addNumber, '');
	};
	
	this._setTaskListItems = function(pos, tasks){
		for (var i=0; i<tasks.length; ++i) {
			var task = tasks[i];
			var item = this.items_.taskList.getItem(pos);
			
			var itemStyle = this._getTaskListItemStyle(task);
			item.exsubs.name.setText(task.res.name);
			item.exsubs.name.resetUIBack(itemStyle.name);
			TQ.setTextEx(item.exsubs.number, task.curTimes + '/' + task.res.times);
			TQ.setClass(item.exsubs.number, itemStyle.number);
			TQ.setTextEx(item.exsubs.addNumber, this._getStarOrAddNumber(task));
			TQ.setClass(item.exsubs.addNumber, itemStyle.addNumber);
			TQ.setCSS(item.exsubs.reddot, 'display', task.reddot ? 'block' : 'none' );
			
			item.exsubs.task = task;
			item.exsubs.name.setId(pos);
			item.exsubs.name.setCaller({self:this, caller:this._onClickTaskListName});
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetTaskNameTip}, {idx:pos});
			
			pos++;
		}
		return pos;
	};
	
	this._getTaskListItemStyle = function(task){
		if (task.curTimes == 0) {
			return {number:'taskList_number_nofinish'
				,addNumber:'taskList_addnumber_nofinish'
				,name:uiback.btn.activityVal[this._getNameLinkTag(task) + '_nofinish'] };
		} else if (task.curTimes < task.res.times) {
			return {number:'taskList_number_finishpart'
				,addNumber:'taskList_addnumber_finishpart'
				,name:uiback.btn.activityVal[this._getNameLinkTag(task) + '_finishpart'] };
		} else {
			return {number:'taskList_number_finish'
				,addNumber:'taskList_addnumber_finish'
				,name:uiback.btn.activityVal.nolink_finish };
		}
	};
	
	this._getNameLinkTag = function(task){
		return (!task.res.linkType) ? 'nolink' : 'link';
	};
	
	this._getStarOrAddNumber = function(task){
		if (task.curTimes == 0) {
			return rstr.activityValDlg.lbl.stars[task.res.star];
		}
		
		var s = '';
		for ( var t=0; t<task.curTimes; ++t ) {
			s += '+';
			s += task.res.val;
			if ( this._needShowVipVal(task) ) {
				s += '+';
				s += this._getShowVipVal(task) + '(VIP)';
			}
		}
		return s;
	};	
	
	this._needShowVipVal = function(task){
		if ( task.res.id != FIXID.EVERYDAY_LOGIN_TASK) return false;
		return this._getShowVipVal(task) > 0;
	};
	
	this._getShowVipVal = function(){
		var taskTotalVal = 0;
		var activityVals = this.g_.getImgr().getTask().activityVals;
		for ( var i=0; i<res_activityval_tasks.length; ++i ) {
			var res = res_activityval_tasks[i];
			var task = TQ.find(activityVals, 'id', res.id);
			if (task) taskTotalVal += task.times*res.val;
		}
		
		var activityVal = this.g_.getImgr().getActivityVal();
		return Math.max(0, activityVal.val - taskTotalVal);
	};
	
	this._onClickTaskListName = function(idx){
		var item = this.items_.taskList.getItem(idx);
		if (!item.exsubs.task) return;
		if (item.exsubs.task.curTimes == item.exsubs.task.res.times) return;

		if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.FARM) {
			UIM.getPanel('farm').open();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.OTHERFARM) {
			UIM.getPanel('field').open();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.ROLETASK) {
			UIM.openDlg('task', 'role');
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.EVERYDAYTASK) {
			UIM.openDlg('task', 'everyday');
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.ACT_TERRACE) {
			UIM.openActTerraceDlg();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.ACT_TOWER) {
			UIM.openActTowerDlg();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.ALLI_CONTRIBUTE) {
			UIM.getDlg('alli').openSubscribeDlg();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.ALLI_GIFT) {
			UIM.getDlg('alli').openGiftDlg();
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.TRADING_AREA) {
			UIM.openDlg('tradingarea');
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.STEEL_HERO) {
			UIM.openDlg('steellist');
		} else if (item.exsubs.task.res.linkType == ACTIVITYVAL_TASK_LINK.HEROS_DLG) {
			UIM.openDlg('hero');
		}
	};	
	
	this._onGetTaskNameTip = function(data){
		var item = this.items_.taskList.getItem(data.idx);
		if (!item.exsubs.task) return '';
		return TIPM.makeItemTip(item.exsubs.task.res.tip);
	};
	
	this._onTaskChange = function(){
		this.update();
	};
});

ActivityValRewardListPanel = ActivityValBasePanel.extern(function(){
	this.update = function(){
		var activityVal = this.g_.getImgr().getActivityVal();
		this.items_.rewardList.setItemCount(res_activityval_rewards.length);
		for ( var i=0; i<this.items_.rewardList.getCount(); ++i ) {
			var res = res_activityval_rewards[i];
			var item = this.items_.rewardList.getItem(i);
			
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(res.icon));
			TQ.setTextEx(item.exsubs.desc, TQ.format(rstr.activityValDlg.lbl.activityValDesc, res.val));
			
			var canInfo = this.canGetChecker_.getCanGetInfo(i);
			
			if ( canInfo.isCanGet ) {
				TQ.setCSS(item.exsubs.stateEffect, 'display', 'block');
				item.exsubs.get.enable(true);
			} else {
				TQ.setCSS(item.exsubs.stateEffect, 'display', 'none');
				item.exsubs.get.enable(false);
			}
			
			if ( canInfo.isCanGet ) {
				item.exsubs.get.setText(rstr.activityValDlg.btn.getActReward);
				item.exsubs.get.resetUIBack(uiback.btn.activityVal.actReward_canGet);
			} else if (canInfo.isGot) {
				item.exsubs.get.setText(rstr.activityValDlg.btn.gotActReward);
				item.exsubs.get.resetUIBack(uiback.btn.activityVal.actReward_got);
			} else if (!canInfo.isEnoughVal) {
				item.exsubs.get.setText(rstr.activityValDlg.btn.activityValNoEnough);
				item.exsubs.get.resetUIBack(uiback.btn.activityVal.actReward_noEnough);
			}
			
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetActRewardTip}, {idx:i});
			TTIP.setCallerData(item.exsubs.tooltips['$item1'], {self:this, caller:this._onGetActRewardTip}, {idx:i});
			item.exsubs.get.setId(res.id);
			item.exsubs.get.setCaller({self:this, caller:this._onClickActRewardGet});
		}		
	};
	
	this._onGetActRewardTip = function(data){
		var res = res_activityval_rewards[data.idx];
		return TIPM.makeItemTip(res.tip);
	};	
	
	this._onClickActRewardGet = function(id){
		ActivityValSender.sendGetActReward(this.g_, id);
	};	
});

ActivityValSignInPanel = ActivityValBasePanel.extern(function(){
	this._setCallers = function(){
		this.items_.signinBtn.setCaller({self:this, caller:this._onClickSignIn});
	};
	
	this.update = function(){
		this._updateSigninBtn();
		this._updateSigninDays();
		this._updateSignList();
	};
	
	this._updateSigninBtn = function() {
		var signin = this.g_.getImgr().getActivityVal().signin;
		if (signin.days == MAX_SIGNIN_COUNT) {
			this.items_.signinBtn.enable(false);
		} else if (signin.todaySign == 0) {
			this.items_.signinBtn.enable(true);
		} else {
			this.items_.signinBtn.enable(false);
		}
	};
	
	this._updateSigninDays = function() {
		var signin = this.g_.getImgr().getActivityVal().signin;
		TQ.setTextEx(this.items_.signinDays, TQ.format(rstr.activityValDlg.lbl.signinDays, signin.days));
	};
	
	this._updateSignList = function() {
		var signin = this.g_.getImgr().getActivityVal().signin;
		this.items_.signinList.setItemCount(res_signin_rewards.length);
		for ( var i=0; i<this.items_.signinList.getCount(); ++i ) {
			var res = res_signin_rewards[i];
			var item = this.items_.signinList.getItem(i);
			TQ.setTextEx(item.exsubs.desc, TQ.format(rstr.activityValDlg.lbl.signinDesc, res.days));
			
			var canInfo = this.canGetChecker_.getCanGetSignInfo(i);
				
			if (canInfo.isGot) {
				item.exsubs.get.enable(false);
				item.exsubs.get.setText(rstr.activityValDlg.btn.signGot);
				TQ.setTextEx(item.exsubs.days, TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.ENOUGH_SIGNINDAYS, res.days, res.days));
			} else if (canInfo.isCanGet) {
				item.exsubs.get.enable(true);
				item.exsubs.get.setText(rstr.activityValDlg.btn.signGet);
				TQ.setTextEx(item.exsubs.days, TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.ENOUGH_SIGNINDAYS, res.days, res.days));
			} else {
				item.exsubs.get.enable(false);
				item.exsubs.get.setText(rstr.activityValDlg.btn.signGet);
				TQ.setTextEx(item.exsubs.days, TQ.format(rstr.activityValDlg.lbl.signinItemDays, COLORS.NOENOUGH_SIGNINDAYS, signin.days, res.days));
			}
			
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetSignRewardTip}, {idx:i});
			item.exsubs.get.setId(res.id);
			item.exsubs.get.setCaller({self:this, caller:this._onClickSignRewardGet});
		}
	};
	
	this._onGetSignRewardTip = function(data){
		var res = res_signin_rewards[data.idx];
		return TIPM.makeItemTip(res.tip);
	};
	
	this._onClickSignRewardGet = function(id){
		ActivityValSender.sendGetSignReward(this.g_, id);
	};	
	
	this._onClickSignIn = function(){
		ActivityValSender.sendSignIn(this.g_);
	};	
});

ActivityValTodayActListPanel = ActivityValBasePanel.extern(function(){
	this.update = function(){
		var dayacts = this.g_.getImgr().getActivityVal().dayacts;
		var todayActs = TQ.find(dayacts, 'day', 0).acts;
		this.items_.todayActList.setItemCount(todayActs.length);
		for ( var i=0; i<this.items_.todayActList.getCount(); ++i ) {
			var res = TQ.qfind(res_dayact_defs, 'type', todayActs[i]);
			var item = this.items_.todayActList.getItem(i);
			item.exsubs.res = res;
			TQ.setTextEx(item.exsubs.name, res.name);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetTodayActTip}, {idx:i});
		}
	};
	
	this._onGetTodayActTip = function(data){
		var item = this.items_.todayActList.getItem(data.idx);
		return TIPM.makeItemTip(item.exsubs.res.tip);
	};	
});

ActivityValDlg = BaseDlg.extern(function(){
	this.panels_ = [];
	this._init = function(){
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.g_.regEvent(EVT.NET, NETCMD.ACTIVITY_VAL, this, this._onSvrPkg);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.activityValDlg.title, pos:{x:"center", y:100}, uicfg:uicfg.activityVal.mainDlg};
	}; 
	
	this._afterCreate = function(){
		this.panels_.push( ActivityValActivityValPanel.snew(this.g_, this, this.items_) );
		this.panels_.push( ActivityValBaseInfoPanel.snew(this.g_, this, this.items_) );
		this.panels_.push( ActivityValTaskListPanel.snew(this.g_, this, this.items_) );
		this.panels_.push( ActivityValRewardListPanel.snew(this.g_, this, this.items_) );
		this.panels_.push( ActivityValSignInPanel.snew(this.g_, this, this.items_) );
		this.panels_.push( ActivityValTodayActListPanel.snew(this.g_, this, this.items_) );
	};	
	
	this._initInfo = function(){
		this._update();
		this.g_.sendEvent({eid:EVT.UPD_ACT_VAL_REDDOT, sid:0});
	};
	
	this._update = function(){
		if (!this.isShow()) return;
		
		for ( var i=0; i<this.panels_.length; ++i ) {
			this.panels_[i].update();
		}
	};
	
	this._onLoginOk = function(){
		ActivityValSender.sendGetAllInfo(this.g_);
		FixTimer.regTimer({hour:0, min:0, sec:5}, {self:this, caller:this._onFixTimer});
	};
	
	this._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (!netdata.actVal) return;
		TQ.dictCopy(this.g_.getImgr().getActivityVal(), netdata.actVal);
		this._filterPayAct();
		this.g_.sendEvent({eid:EVT.ACTIVITY_VAL, sid:0});
		this._update();
	};
	
	this._onFixTimer = function(){
		ActivityValSender.sendGetAllInfo(this.g_);
	};
	
	this._filterPayAct = function(){
		var dayacts = this.g_.getImgr().getActivityVal().dayacts;
		for ( var i=0; i<dayacts.length; ++i ) {
			if ( TQ.find(dayacts[i].acts, null, SVR_TODAY_ACT_TYPE.ACT_PAY_1) ) {
				dayacts[i].acts.splice(TQ.getLastFindIdx(), 1);
			}
		}
	};
});

