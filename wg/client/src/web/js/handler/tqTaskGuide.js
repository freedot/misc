/*******************************************************************************/
TaskGuide = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this._isShow = false;
	this._tasks = [];
	this.init = function(g, items){
		this.g_ = g;
		this.items_ = items;
		this._createPanel();
		this._regEvents();
		this._setCallers();
		this._onClickExpand();
	};
	
	this.expandPanel = function(){
		this._onClickExpand();
	};
	
	this.getTasks = function(){
		return this._tasks;
	};
	
	this.scrollTop = function(){
		this.items_.taskGuide.items.taskList.scrollPos(0);
	};
	
	this.getTaskBtnById = function(id){
		if ( !TQ.find(this._tasks, 'id', id) ) return null;
		var item = this.items_.taskGuide.items.taskList.getItem(TQ.getLastFindIdx());
		return item.exsubs.opBtn;
	};
	
	this._createPanel = function(){
		this.items_.taskGuide.items = {};
		var tmpl = uicfg.main.mainpanel.t_[1];
		this.g_.getGUI().buildDomItems(this.items_.taskGuide, tmpl, uicfg.main.mainpanel.t_, this.items_.taskGuide.items);
		TQ.fixIE6Png(this.items_.taskGuide);	
	};
	
	this._regEvents = function(){
		this.g_.regEvent(EVT.TASKCHANGE, 0, this, this._onTaskChange);
	};
	
	this._setCallers = function(){
		this.items_.expandTaskGuideBtn.setCaller({self:this, caller:this._onClickExpand});
		this.items_.collapseTaskGuideBtn.setCaller({self:this, caller:this._onClickCollapse});
		if ( !TQ.isMobile() ) this.items_.taskGuideToggleBtn.setCaller({self:this, caller:this._onClickToggle});
		this.items_.taskGuide.items.seeMoreTasks.setCaller({self:this, caller:this._onClickSeeMore});
	};
	
	this._show = function(){
		TQ.setCSS(this.items_.taskGuide, 'display', 'block');
		TQ.setCSS(this.items_.expandTaskGuideBtn.getParent(), 'display', 'none');
		TQ.setCSS(this.items_.collapseTaskGuideBtn.getParent(), 'display', 'block');
		this._isShow = true;
		this._update();
	};
	
	this._hide = function(){
		TQ.setCSS(this.items_.taskGuide, 'display', 'none');
		TQ.setCSS(this.items_.expandTaskGuideBtn.getParent(), 'display', 'block');
		TQ.setCSS(this.items_.collapseTaskGuideBtn.getParent(), 'display', 'none');
		this._isShow = false;
	};
	
	this._update = function(){
		if (!this._isShow) return;
		
		var growups = this.g_.getImgr().getTask().growups;
		this._tasks = [];
		TQ.dictCopy(this._tasks, growups);
		this._tasks.sort(function(task1, task2){
			if ( task1.state == 1 && task2.state != 1 ) return -1;
			if ( task2.state == 1 && task1.state != 1 ) return 1;
			return task1.id - task2.id;
		});
		
		var list = this.items_.taskGuide.items.taskList;
		list.setItemCount(this._tasks.length);
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			var task = this._tasks[i];
			TQ.setTextEx(item.exsubs.title, task.itemres.name);
			TQ.setTextEx(item.exsubs.desc, task.itemres.targetDesc);
			TQ.setClass(item.exsubs.state, this._getStateCssClass(task.state));
			TQ.setTextEx(item.exsubs.state, rstr.task.taskdlg.states[task.state]);
			
			if (task.state == TASK_STATE.WAIT_GET) {
				item.exsubs.opBtn.setText(rstr.task.taskdlg.btn.getTaskReward);
				TQ.setCSS(item.exsubs.hotFlag, 'display', 'none');
			} else {
				item.exsubs.opBtn.setText(rstr.task.taskdlg.btn.seeTaskDetail);
				TQ.setCSS(item.exsubs.hotFlag, 'display', task.itemres.hotTip ? 'block' : 'none');
			}
						
			item.exsubs.opBtn.setId(i);
			item.exsubs.opBtn.setCaller({self:this, caller:this._onClickOp});
		}
	};
	
	this._getStateCssClass = function(state){
		var stateCssClasss = ['wait_complete_state', 'wait_get_state', 'complete_state'];
		return stateCssClasss[state];
	};
	
	this._onClickExpand = function(){
		this._show();
		if ( !TQ.isMobile() )  this.items_.taskGuideToggleBtn.setPress(true);
	};
	
	this._onClickCollapse = function(){
		this._hide();
		if ( !TQ.isMobile() ) this.items_.taskGuideToggleBtn.setPress(false);
	};
	
	this._onClickToggle = function(){
		if ( this.items_.taskGuideToggleBtn.isPress() ) {
			this._show();			
		} else {
			this._hide();
		}
	};
	
	this._onClickSeeMore = function(){
		UIM.openDlg('task', 'growup');
	};
	
	this._onTaskChange = function(){
		this._update();
	};
	
	this._onClickOp = function(idx){
		var task = this._tasks[idx];
		if ( task.state == TASK_STATE.WAIT_GET ) {
			TaskSender.sendGetReward(this.g_, task.id);
		} else {
			UIM.getDlg('task').openDlg();
			UIM.getDlg('task').selectTask('growup', idx);
		}
	};
});
