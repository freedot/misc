JUtil.setRoot(JUtil.getElemById('g_root'));
JUI.setRootElem(JUtil.getElemById('g_root'));

var STORY_STATE = {
	WAITING: 0
	,RUNING: 1
	,FINISHED: 2
	,ERROR: 3
};

var CASE_STATE = {
	FAIL: 0
	,SUCC: 1
};

var CasesChecker = JClass.ex({
	isAllSuccess : function(cases){
		for ( var i=0; i<cases.length; ++i ) {
			if ( cases[i].state == 0 ) return false;
		}
		return true;
	}
});

var MemberQueryHelper = JClass.ex({
	_init : function(){
		this._members = [];
		ServerStub.get('MembersObject').getMembers(JCaller.snew(this, function(members){
			this._members = members.list;
		}));
	}
	
	,getList: function(input, text){
		var list = [];
		var lastmem = this._getLastMember(text);
		for ( var i=0; i<this._members.length; ++i ) {
			var member = this._members[i];
			if ( member.indexOf(lastmem) == 0 ) {
				list.push(member);
			}
		}
		list.sort();
		return list;
	}
	
	,autoComplete: function(input, text, selectText){
		var idx = text.lastIndexOf(';');
		if ( idx < 0) input.setText(selectText + ';');
		else input.setText(text.substring(0, idx+1) + selectText + ';');
		return true;
	}
	
	,_getLastMember: function(members){
		var idx = members.lastIndexOf(';');
		if ( idx < 0 ) return members;
		return members.substring(idx+1, members.length);
	}
});
Register.reg('MemberQueryHelper', MemberQueryHelper.snew());

var StoryCasePanel = JClass.ex({
	_init : function(dlg, panel, addBtn, list){
		this._story = null;
		this._dlg = dlg;
		this._panel = panel;
		this._addBtn = addBtn;
		this._list = list;
		this._setCallers();
	}
	
	,updateStoryState : function(caseId, state){
		var caseIdx = this._findCaseIdxById(caseId);
		if (caseIdx < 0) return;
		
		var ttcase = this._story.cases[caseIdx];
		ttcase.state = state;
		this._updateTotalInfo();
		this._setCaseItem(caseIdx);
		this._changeStoryState();		
	}
	
	,_setCallers : function(){
		this._addBtn.setCaller('BTN_CLICK', JCaller.snew(this, this._onAddButton));
		this._list.setItemCaller('item.name', 'LABEL_CHANGED', JCaller.snew(this, this._onNameChanged));
		this._list.setItemCaller('item.owner', 'LABEL_CHANGED', JCaller.snew(this, this._onOwnerChanged));
		this._list.setItemCaller('item.state', 'DROPLIST_CHANGED', JCaller.snew(this, this._onCaseStateChanged));
		this._list.setItemCaller('item.delete', 'BTN_CLICK', JCaller.snew(this, this._onClickDeleteCase));
		this._list.setItemCaller('item.auto', 'BTN_CLICK', JCaller.snew(this, this._onClickAutoCase));
		var qHelper = Register.get('MemberQueryHelper');
		this._list.setItemCaller('item.owner', 'INPUT_QUERY', JCaller.snew(qHelper, qHelper.getList));
		this._list.setItemCaller('item.owner', 'INPUT_AUTOCOMPLETE', JCaller.snew(qHelper, qHelper.autoComplete));
		this._list.setCaller('LIST_DRAGITEM', JCaller.snew(this, this._onDragItem));
		this._list.setCaller('LIST_MOUSEOVER', JCaller.snew(this, this._onMouseOverItem));
		this._list.setCaller('LIST_MOUSEOUT', JCaller.snew(this, this._onMouseOutItem));
	}
	
	,_onAddButton : function(){
		ServerStub.get('StoryObject').addStoryCase(this._story.id, JCaller.snew(this, function(tcase){
			this._story.cases.push(tcase);
			this._setCaseItems();
			this._list.scrollBottom();
			this._list.getItem(this._list.getCount()-1, 'item.name').beginEdit();
		}));
	}
	
	,setCases : function(story){
		this._story = story;
		if ( !this._story.cases ) return ;
		this._setCaseItems();
	}
	
	,_onNameChanged : function(nameLbl){
		this._changeStoryCaseField(nameLbl, 'name', nameLbl.getText());
	}
	
	,_onOwnerChanged : function(ownerLbl){
		this._changeStoryCaseField(ownerLbl, 'owner', ownerLbl.getText());
	}
	
	,_onCaseStateChanged : function(stateList){
		var curState = stateList.getCurSelect();
		this._changeStoryCaseField(stateList, 'state', curState);
	}	
	
	,_changeStoryState : function(){
		if ( !this._story.bindcase ) return;
		
		var lastState = this._story.state;
		var isAllSuccess = CasesChecker.isAllSuccess(this._story.cases);
		if ( this._story.state == STORY_STATE.FINISHED && !isAllSuccess ) {
			this._story.state = STORY_STATE.ERROR;
		} else if ( this._story.state == STORY_STATE.ERROR && isAllSuccess ) {
			this._story.state = STORY_STATE.FINISHED;
		}
		
		if ( lastState != this._story.state ) {
			ServerStub.get('StoryObject').saveStory(this._story, JCaller.snew(this, function(rstory){
				this._dlg.updateStory(rstory);
				Register.get('MainTabs').getAllStorysPanel().updateStory(rstory);
			}));
		}		
	}
	
	,_onDragItem : function(fromItem, toItem){
		var fromIdx = fromItem.getId();
		var toIdx = toItem.getId();
		ServerStub.get('StoryObject').changeStoryCaseIndex(this._story.id, fromIdx, toIdx, JCaller.snew(this, function(cases){
			this._story.cases = cases.list;
			this._setCaseItems();
		}));
	}
	
	,_onClickDeleteCase : function(btn){
		var caseIdx = btn.getParent().getId();
		JUI.openMsgBox(string_res.StoryEditDlg.msgbox.deleteTitle
			,string_res.StoryEditDlg.msgbox.deleteMsg
			,'CONFIRM_CANCEL'
			,JCaller.snew(this, function(op){
				if ( op != 'CONFIRM' ) return;
				ServerStub.get('StoryObject').deleteStoryCase(this._story.id, caseIdx, JCaller.snew(this, function(cases){
					this._story.cases = cases.list;
					this._setCaseItems();
				}));
		}));		
	}
	
	,_onClickAutoCase : function(btn){
		var caseIdx = btn.getParent().getId();
		var tcase = this._story.cases[caseIdx];
		if ( !tcase.auto ) {
			JUI.openMsgBox(string_res.StoryEditDlg.msgbox.createAutoCaseTitle
			,string_res.StoryEditDlg.msgbox.createAutoCaseMsg
			,'CONFIRM_CANCEL'
			,JCaller.snew(this, function(op){
				if ( op != 'CONFIRM' ) return;
				ServerStub.get('CaseObject').newAutoCase(this._story.id, tcase.id, tcase.name, JCaller.snew(this, function(autocase){
					this._story.cases[caseIdx].state = autocase.state; 
					this._story.cases[caseIdx].auto = autocase.auto;
					Register.get('CaseDlg').open({caseId:tcase.id, deleteCaller:JCaller.snew(this, this._onDeleteAutoCase)});
					this._setCaseItem(caseIdx);
					this._changeStoryState();
				}));
			}));
		} else {
			Register.get('CaseDlg').open({caseId:tcase.id, deleteCaller:JCaller.snew(this, this._onDeleteAutoCase)});
		}
	}
	
	,_onDeleteAutoCase : function(){
		this._updateCasesFromSvr();
	}
	
	,_updateCasesFromSvr : function(){
		ServerStub.get('StoryObject').getStoryCases(this._story.id, JCaller.snew(this, function(cases){
			this._story.cases = cases.list;
			this._setCaseItems();
		}));
	}
	
	,_onMouseOverItem: function(item){
		item.findWidget('item.delete').show();
		item.findWidget('item.auto').show();
	}
	
	,_onMouseOutItem: function(item){
		item.findWidget('item.delete').hide();
		var tcase = this._story.cases[item.getId()];
		if ( !tcase.auto ) item.findWidget('item.auto').hide();
	}
	
	,_changeStoryCaseField : function(subItem, fieldName, cur){
		var caseIdx = subItem.getParent().getId();
		this._setCaseItem(caseIdx); // revert name show, wait server changed ok;
		
		if ( this._story.cases[caseIdx][fieldName] == cur ) return;
		
		this._story.cases[caseIdx][fieldName] = cur;
		var ttcase = this._story.cases[caseIdx];
		ServerStub.get('StoryObject').changeStoryCase(this._story.id, ttcase, JCaller.snew(this, function(tcase){
			this._story.cases[caseIdx] = tcase;
			this._updateTotalInfo();
			this._setCaseItem(caseIdx);
			this._changeStoryState();
		}));
	}
	
	,_setCaseItems : function(){
		this._updateTotalInfo();
		this._list.setCount(this._story.cases.length);
		for ( var i=0; i<this._list.getCount(); ++i ) {
			this._setCaseItem(i);
		}
	}
	
	,_setCaseItem : function(idx){
		var tcase = this._story.cases[idx];
		this._list.getItem(idx, 'item.name').setText(tcase.name);
		this._list.getItem(idx, 'item.owner').setText(tcase.owner);
		this._list.getItem(idx, 'item.state').select(tcase.state);
		
		if ( tcase.auto ) this._list.getItem(idx, 'item.state').disable()
		else this._list.getItem(idx, 'item.state').enable();
		
		this._list.getItem(idx, 'item.auto').setStyle(tcase.auto ? 'relation_lock_icon' : 'unrelation_lock_icon');
		if ( tcase.auto ) this._list.getItem(idx, 'item.auto').show();
	}
	
	,_updateTotalInfo : function(){
		var unpassTotal = 0;
		var passTotal = 0;
		for ( var i=0; i<this._story.cases.length; ++i ) {
			if ( this._story.cases[i].state == 0 ) unpassTotal++;
			else passTotal++;
		}
		this._panel.findWidget('root.passInfo.total').setText(passTotal);
		this._panel.findWidget('root.unpassInfo.total').setText(unpassTotal);
		this._toggleShowUnpassInfoPanel(unpassTotal);
	}
	
	,_toggleShowUnpassInfoPanel : function(unpassTotal){
		if ( unpassTotal == 0 ) {
			this._panel.findWidget('root.unpassInfo').hide();
		} else {
			this._panel.findWidget('root.unpassInfo').show();
		}
	}
	
	,_findCaseIdxById : function(caseId){
		for ( var i=0; i<this._story.cases.length; ++i ) {
			if ( this._story.cases[i].id == caseId ) return i;
		}
		return -1;
	}
});

var StoryTaskPanel = JClass.ex({
	_init : function(dlg, panel, addBtn, list){
		this._story = null;
		this._dlg = dlg;
		this._panel = panel;
		this._addBtn = addBtn;
		this._list = list;
		this._setCallers();
	}
	
	,_setCallers : function(){
		this._addBtn.setCaller('BTN_CLICK', JCaller.snew(this, this._onAddButton));
		this._list.setItemCaller('item.delete', 'BTN_CLICK', JCaller.snew(this, this._onClickDelete));
		this._list.setItemCaller('item.name', 'LABEL_CHANGED', JCaller.snew(this, this._onNameChanged));
		this._list.setItemCaller('item.owner', 'LABEL_CHANGED', JCaller.snew(this, this._onOwnerChanged));
		this._list.setItemCaller('item.leftTime', 'LABEL_CHANGED', JCaller.snew(this, this._onLeftTimeChanged));
		var qHelper = Register.get('MemberQueryHelper');
		this._list.setItemCaller('item.owner', 'INPUT_QUERY', JCaller.snew(qHelper, qHelper.getList));
		this._list.setItemCaller('item.owner', 'INPUT_AUTOCOMPLETE', JCaller.snew(qHelper, qHelper.autoComplete));
		this._list.setItemCaller('item.state', 'DROPLIST_CHANGED', JCaller.snew(this, this._onStateChanged));
		this._list.setCaller('LIST_DRAGITEM', JCaller.snew(this, this._onDragItem));
		this._list.setCaller('LIST_MOUSEOVER', JCaller.snew(this, this._onMouseOverItem));
		this._list.setCaller('LIST_MOUSEOUT', JCaller.snew(this, this._onMouseOutItem));
	}
	
	,_onAddButton : function(){
		ServerStub.get('StoryObject').addStoryTask(this._story.id, JCaller.snew(this, function(task){
			this._story.tasks.push(task);
			this._setTaskItems();
			this._list.scrollBottom();
			this._list.getItem(this._list.getCount()-1, 'item.name').beginEdit();
		}));
	}
	
	,setTasks : function(story){
		this._story = story;
		if ( !this._story.tasks ) return ;
		this._setTaskItems();
	}
	
	,_onClickDelete : function(btn){
		var taskIdx = btn.getParent().getId();
		JUI.openMsgBox(string_res.StoryEditDlg.msgbox.deleteTitle
			,string_res.StoryEditDlg.msgbox.deleteMsg
			,'CONFIRM_CANCEL'
			,JCaller.snew(this, function(op){
				if ( op != 'CONFIRM' ) return;
				ServerStub.get('StoryObject').deleteStoryTask(this._story.id, taskIdx, JCaller.snew(this, function(tasks){
					this._story.tasks = tasks.list;
					this._setTaskItems();
				}));
		}));		
	}	
	
	,_onNameChanged : function(nameLbl){
		this._changeStoryTaskField(nameLbl, 'name', nameLbl.getText());
	}
	
	,_onOwnerChanged : function(ownerLbl){
		this._changeStoryTaskField(ownerLbl, 'owner', ownerLbl.getText());
	}
	
	,_onLeftTimeChanged : function(leftTImeLbl){
		this._changeStoryTaskField(leftTImeLbl, 'leftTime', leftTImeLbl.getText());
	}
	
	,_onStateChanged : function(stateList){
		var curState = stateList.getCurSelect();
		this._changeStoryTaskField(stateList, 'state', curState);
	}	
	
	,_onDragItem : function(fromItem, toItem){
		var fromIdx = fromItem.getId();
		var toIdx = toItem.getId();
		ServerStub.get('StoryObject').changeStoryTaskIndex(this._story.id, fromIdx, toIdx, JCaller.snew(this, function(tasks){
			this._story.tasks = tasks.list;
			this._setTaskItems();
		}));
	}
	
	,_onMouseOverItem: function(item){
		item.findWidget('item.delete').show();
	}
	
	,_onMouseOutItem: function(item){
		item.findWidget('item.delete').hide();
	}
	
	,_changeStoryTaskField : function(subItem, fieldName, cur){
		var taskIdx = subItem.getParent().getId();
		this._setTaskItem(taskIdx); // revert name show, wait server changed ok;
		
		if ( this._story.tasks[taskIdx][fieldName] == cur ) return;
		
		this._story.tasks[taskIdx][fieldName] = cur;
		var task = this._story.tasks[taskIdx];
		ServerStub.get('StoryObject').changeStoryTask(this._story.id, task, JCaller.snew(this, function(rtask){
			this._story.tasks[taskIdx] = rtask;
			this._setTaskItem(taskIdx);
		}));
	}
	
	,_setTaskItems : function(){
		this._list.setCount(this._story.tasks.length);
		for ( var i=0; i<this._list.getCount(); ++i ) {
			this._setTaskItem(i);
		}
	}
	
	,_setTaskItem : function(idx){
		var task = this._story.tasks[idx];
		this._list.getItem(idx, 'item.name').setText(task.name);
		this._list.getItem(idx, 'item.leftTime').setText(task.leftTime);
		this._list.getItem(idx, 'item.owner').setText(task.owner);
		this._list.getItem(idx, 'item.state').select(task.state);
	}
});

var StoryEditDlg = JUI.Dialog.ex({
	updateStory: function(story){
		this._story = story;
		this._setStoryInfo();
	}
	
	,updateStoryState: function(caseId, state){
		this._casePanel.updateStoryState(caseId, state);
	}
	
	,_getParent : function(){
		return JUI.getRoot();
	}
	
	,_getTempl : function(){
		return ui_res.storyEditDlg;
	}
	
	,_setCallers : function(){
		this._setItemCaller('root.closeBtn', 'BTN_CLICK', JCaller.snew(this, this._onCancelButton));
		this._setItemCaller('root.confirmButton', 'BTN_CLICK', JCaller.snew(this, this._onConfirmButton));
		this._setItemCaller('root.cancelButton', 'BTN_CLICK', JCaller.snew(this, this._onCancelButton));
		this._setItemCaller('root.toggleTaskPanelBtn', 'BTN_CLICK', JCaller.snew(this, this._onToggleTaskPanel));
		this._setItemCaller('root.storyOwner', 'INPUT_QUERY', JCaller.snew(this, this._onQueryOwner));
		this._setItemCaller('root.storyOwner', 'INPUT_AUTOCOMPLETE', JCaller.snew(this, this._onAutoCompleteOwner));
		this._setItemCaller('root.storyState', 'DROPLIST_CHANGING', JCaller.snew(this, this._onStateChanging));
		this._setItemCaller('root.storyState', 'DROPLIST_CHANGED', JCaller.snew(this, this._onStateChanged));
	}
	
	,_onCreateAfter : function(){
		this._casePanel = StoryCasePanel.snew(this, this._panel, this._panel.findWidget('root.addCaseBtn'), this._panel.findWidget('root.testcaseList'));
		this._taskPanel = StoryTaskPanel.snew(this, this._panel, this._panel.findWidget('root.addTaskBtn'), this._panel.findWidget('root.taskList'));
	}
	
	,_onConfirmButton : function(){
		if ( this._param.caller ) {
			this._story.story = this._panel.findWidget('root.storyContent').getText();
			this._story.points = this._panel.findWidget('root.storyPointsContent').getText();
			this._story.state = this._panel.findWidget('root.storyState').getCurSelect();
			this._story.owner = this._panel.findWidget('root.storyOwner').getText();
			this._story.bindcase = this._panel.findWidget('root.bindWithTestCase').isChecked() ? 1 : 0;
			this._param.caller.invoke(this._story);
		}
		this.close();
	}
	
	,_onCancelButton : function(){
		this.close();
	}
	
	,_onToggleTaskPanel : function(){
		if ( !this._param.isEdit ) return;
		this._resetDlgSize();
	}
	
	,_onQueryOwner : function(input, text){
		return Register.get('MemberQueryHelper').getList(input, text);
	}
	
	,_onAutoCompleteOwner : function(input, text, selectText){
		return Register.get('MemberQueryHelper').autoComplete(input, text, selectText);
	}
	
	,_onOpenAfter : function(){
		this._setTitle();
		this._setDlgSize();
		this._story = this._param.story;
		this._setStoryInfo();
		if ( this._param.isEdit ) {
			ServerStub.get('StoryObject').getStoryDetail(this._story.id, JCaller.snew(this, function(story){
				this._story = story;
				this._setStoryInfo();
			}));
		} else {
			this._panel.findWidget('root.bindWithTestCase').check();
		}
		this._panel.findWidget('root.storyContent').focus();
	}
	
	,_onStateChanging : function(list, item){
		if ( item.getId() != STORY_STATE.FINISHED ) return true; // not finished state
		if ( !this._panel.findWidget('root.bindWithTestCase').isChecked() || CasesChecker.isAllSuccess(this._story.cases) ) return true;
		JUI.openMsgBox(string_res.StoryEditDlg.msgbox.cannotFinishStoryTitle, string_res.StoryEditDlg.msgbox.cannotFinishStoryMsg , 'CLOSE');
		return false;
	}
	
	,_onStateChanged : function(){
		this._hideShowBindCheck();
	}
	
	,_setTitle : function(){
		var title = string_res.StoryEditDlg.title;
		if ( this._param.isEdit ) title = string_res.StoryEditDlg.title;
		else if (this._param.isNew ) title = string_res.StoryEditDlg.newtitle;
		else if (this._param.isInsert ) title = string_res.StoryEditDlg.inserttitle;
		this._panel.findWidget('root.title').setText(title);
	}
	
	,_setDlgSize : function(){
		if ( this._param.isEdit ) {
			this._expandDlg();
		} else {
			this._collapseDlg();
		}
	}
	
	,_setStoryInfo : function(){
		this._setStoryName();
		this._setStoryPoints();
		this._setStoryOwner();
		this._setStoryState();
		this._setStoryBindState();
		this._casePanel.setCases(this._story);
		this._taskPanel.setTasks(this._story);
		this._setStoryTasks();
	}
	
	,_setStoryName : function(){
		this._panel.findWidget('root.storyContent').setText(this._story.story);
	}

	,_setStoryPoints : function(){
		this._panel.findWidget('root.storyPointsContent').setText(this._story.points);
	}
	
	,_setStoryOwner : function(){
		this._panel.findWidget('root.storyOwner').setText(this._story.owner);
	}
	
	,_setStoryState : function(){
		this._panel.findWidget('root.storyState').select(this._story.state);
	}
	
	,_setStoryBindState : function(){
		var bindCheck = this._panel.findWidget('root.bindWithTestCase');
		if ( this._story.bindcase ) {
			bindCheck.check();
		} else {
			bindCheck.unCheck();
		}
		this._hideShowBindCheck();
	}
	
	,_hideShowBindCheck : function(){
		var bindCheck = this._panel.findWidget('root.bindWithTestCase');
		if ( this._panel.findWidget('root.storyState').getCurSelect() > 0 ) {
			bindCheck.show();
		} else {
			bindCheck.hide();
		}
	}
	
	,_setStoryTests : function(){
		if ( !this._story.tests ) return ;
		var testcaseList = this._panel.findWidget('root.testcaseList');
		testcaseList.setCount(this._story.tests.length);
		for ( var i=0; i<testcaseList.getCount(); ++i ) {
			var test = this._story.tests[i];
			testcaseList.getItem(i, 'item.caseName').setText(test.name);
		}
	}
	
	,_setStoryTasks : function(){
		if ( !this._story.tasks ) return ;
		var taskList = this._panel.findWidget('root.taskList');
		taskList.setCount(this._story.tasks.length);
		for ( var i=0; i<taskList.getCount(); ++i ) {
			var task = this._story.tasks[i];
			taskList.getItem(i, 'item.taskName').setText(task.name);
		}
	}
	
	,_resetDlgSize : function(){
		this._expandDlg();
	}
	
	,_collapseDlg : function(){
		this._setDlgHeight(315 - 90);
	}
	
	,_expandDlg : function(){
		if ( this._panel.findWidget('root.toggleTaskPanelBtn').isPress() ) {
			this._setDlgHeight(640);
		} else {
			this._setDlgHeight(492 - 50 - 20 + 20);
		}
	}
	
	,_setDlgHeight : function(height){
		JUtil.setElemHeight(this._panel.getElem(), height);
	}
});

var StorysList = JClass.ex({
	updateStory: function(story){
		var idx = this._findStoryIdxById(story.id);
		this._storys[idx] = story;
		this._setStoryItem(idx);
	}
	
	,addStory : function(){
		Register.get('StoryEditDlg').open({isNew:true, beforeIndex:-1, story:this._emptyStory(-1), caller:JCaller.snew(this, function(story){
			ServerStub.get('StoryObject').addStory(story, JCaller.snew(this, function(storys){
				this._onStorysData(storys);
				this._list.scrollBottom();
			}));
		})});
	}
	
	,_init : function(panel){
		this._panel = panel;
		this._list = this._panel.findWidget('root.storyList');
		this._storys = [];
		this._setCallers();
		ServerStub.get('StoryObject').getStorys(JCaller.snew(this, this._onStorysData));
	}
	
	,_setCallers : function(){
		this._list.setCaller('LIST_DRAGITEM', JCaller.snew(this, this._onDragItem));
		this._list.setCaller('LIST_DCLICKITEM', JCaller.snew(this, this._onDClickItem));
		this._list.setCaller('LIST_MOUSEOVER', JCaller.snew(this, this._onMouseOverItem));
		this._list.setCaller('LIST_MOUSEOUT', JCaller.snew(this, this._onMouseOutItem));
		this._list.setItemCaller('item.toolbar.editButton', 'BTN_CLICK', JCaller.snew(this, this._onClickEditItem));
		this._list.setItemCaller('item.toolbar.insertButton', 'BTN_CLICK', JCaller.snew(this, this._onClickInsertItem));
		this._list.setItemCaller('item.toolbar.deleteButton', 'BTN_CLICK', JCaller.snew(this, this._onClickDelItem));
		this._list.setItemCaller('item.story', 'LABEL_CHANGED', JCaller.snew(this, this._onStoryNameChanged));
		this._list.setItemCaller('item.storyPoints', 'LABEL_CHANGED', JCaller.snew(this, this._onStoryPointsChanged));
		this._list.setItemCaller('item.owner', 'LABEL_CHANGED', JCaller.snew(this, this._onStoryOwnerChanged));
		this._list.setItemCaller('item.state', 'DROPLIST_CHANGING', JCaller.snew(this, this._onStoryStateChanging));
		this._list.setItemCaller('item.state', 'DROPLIST_CHANGED', JCaller.snew(this, this._onStoryStateChanged));
		this._list.setItemCaller('item.owner', 'INPUT_QUERY', JCaller.snew(this, this._onStoryQueryOwner));
		this._list.setItemCaller('item.owner', 'INPUT_AUTOCOMPLETE', JCaller.snew(this, this._onAutoCompleteOwner));
	}
	
	,_onStorysData : function(storys){
		this._storys = storys.list;
		this._list.setCount(this._storys.length);
		for ( var i=0; i<this._list.getCount(); ++i ) {
			this._setStoryItem(i);
			var story = this._storys[i];
		}
	}
	
	,_setStoryItem : function(index){
		var states = ['waitstate', 'doingstate', 'finishedstate'];
		var story = this._storys[index];
		this._list.getItem(index, 'item.story').setText(story.story);
		this._list.getItem(index, 'item.storyPoints').setText(story.points);
		this._list.getItem(index, 'item.toolbar').hide();
		this._list.getItem(index, 'item.state').select(story.state);
		this._list.getItem(index, 'item.owner').setText(story.owner);
	}
	
	,_onDragItem : function(fromItem, toItem){
		var fromId = this._storys[fromItem.getId()].id;
		var toId = this._storys[toItem.getId()].id;
		ServerStub.get('StoryObject').changeStoryIndex( fromId, toId, JCaller.snew(this, function(storys){
			for ( var i=storys.start; i<=storys.end; ++i ) {
				this._storys[i] = storys.list[i - storys.start];
				this._setStoryItem(i);
			}
		}));
	}
	
	,_onDClickItem : function(clickPosition, item){
		Register.get('StoryEditDlg').open({isEdit:true, story:this._storys[item.getId()], caller:JCaller.snew(this, this._onSaveStory)});
	}
	
	,_onClickEditItem : function(btn){
		var index = this._getListItemByBtn(btn).getId();
		Register.get('StoryEditDlg').open({isEdit:true, story:this._storys[index], caller:JCaller.snew(this, this._onSaveStory)});
	}
	
	,_onSaveStory : function(story){
		ServerStub.get('StoryObject').saveStory(story, JCaller.snew(this, function(rstory){
			this._storys[rstory.idx] = rstory;
			this._setStoryItem(rstory.idx);
		}));
	}
	
	,_onClickAddItem : function(){
		Register.get('StoryEditDlg').open({isNew:true, beforeIndex:-1, story:this._emptyStory(-1), caller:JCaller.snew(this, function(story){
			ServerStub.get('StoryObject').addStory(story, JCaller.snew(this, function(storys){
				this._onStorysData(storys);
				this._list.scrollBottom();
			}));
		})});		
	}
	
	,_onClickInsertItem : function(btn){
		var index = this._getListItemByBtn(btn).getId();
		Register.get('StoryEditDlg').open({isInsert:true, beforeIndex:index, story:this._emptyStory(index), caller:JCaller.snew(this, function(story){
			ServerStub.get('StoryObject').insertStory(story, JCaller.snew(this, function(storys){
				this._onStorysData(storys);
			}));
		})});
	}
	
	,_onClickDelItem : function(btn){
		var index = this._getListItemByBtn(btn).getId();
		var story = this._storys[index];
		JUI.openMsgBox(string_res.StoryList.msgbox.deleteTitle
			,string_res.StoryList.msgbox.deleteMsg
			,'CONFIRM_CANCEL'
			,JCaller.snew(this, function(op){
				if ( op != 'CONFIRM' ) return;
				ServerStub.get('StoryObject').deleteStory(story.id, JCaller.snew(this, function(storys){
					this._onStorysData(storys);
				}));
		}));
	}
	
	,_onStoryNameChanged: function(storyNameLbl){
		this._changeStory(storyNameLbl, 'story', storyNameLbl.getText());
	}
	
	,_onStoryPointsChanged: function(storyPointsLbl){
		this._changeStory(storyPointsLbl, 'points', storyPointsLbl.getText());
	}
	
	,_onStoryOwnerChanged: function(storyOwnerLbl){
		this._changeStory(storyOwnerLbl, 'owner', storyOwnerLbl.getText());
	}
	
	,_onStoryStateChanging: function(list, item){
		var storyIdx = list.getParent().getId();
		var story = this._storys[storyIdx];
		
		if ( item.getId() != STORY_STATE.FINISHED ) return true; // not finished state
		if ( !story.bindcase || CasesChecker.isAllSuccess(story.cases) ) return true;
		JUI.openMsgBox(string_res.StoryEditDlg.msgbox.cannotFinishStoryTitle, string_res.StoryEditDlg.msgbox.cannotFinishStoryMsg , 'CLOSE');
		return false;
	}
	
	,_onStoryStateChanged: function(storyStateDropList){
		this._changeStory(storyStateDropList, 'state', storyStateDropList.getCurSelect());
	}
	
	,_onStoryQueryOwner : function(input, text){
		return Register.get('MemberQueryHelper').getList(input, text);
	}
	
	,_onAutoCompleteOwner : function(input, text, selectText){
		return Register.get('MemberQueryHelper').autoComplete(input, text, selectText);
	}
	
	,_onMouseOverItem : function(item){
		item.findWidget('item.toolbar').show();
	}
	
	,_onMouseOutItem : function(item){
		item.findWidget('item.toolbar').hide();
	}
	
	,_getListItemByBtn : function(btn){
		return btn.getParent().getParent();
	}
	
	,_changeStory : function(subItem, fieldName, cur){
		var storyIdx = subItem.getParent().getId();
		this._setStoryItem(storyIdx); // revert name show, wait server changed ok;
		
		if ( this._storys[storyIdx][fieldName] == cur ) return;
		
		this._storys[storyIdx][fieldName] = cur;
		this._onSaveStory(this._storys[storyIdx]);
	}
	
	,_findStoryIdxById : function(storyId){
		for ( var i=0; i<this._storys.length; ++i ) {
			if ( this._storys[i].id == storyId ) return i;
		}
		return -1;
	}

	,_emptyStory : function(index){
		return {idx:index, story:'', state:0, points:'0', bindcase:1, cases:[], tasks:[]};
	}		
});

var SPRINT_ID = {
	ALL : -1
	,CURRENT: 0
};

g_calendar = new Calendar("g_calendar");
document.write(g_calendar);
var CurrentSprintTabPanel = JClass.ex({
	_init : function(panel){
		this._panel = panel;
		this._sprintStart = this._panel.findWidget('root.sprintStart');
		this._sprintEnd = this._panel.findWidget('root.sprintEnd');
		this._storysList = StorysList.snew(panel);
		this._setCallers();
	}
	
	,_setCallers : function() {
		this._sprintStart.setCaller('INPUT_FOCUS', JCaller.snew(this, function(input){
			JUtil.setTimer(1, JCaller.snew(this, function(){
				g_calendar.showMoreDay = false;
				g_calendar.show(input.getElem());
			}));
		}));
		this._sprintEnd.setCaller('INPUT_FOCUS', JCaller.snew(this, function(input){
			JUtil.setTimer(1, JCaller.snew(this, function(){
				g_calendar.showMoreDay = false;
				g_calendar.show(input.getElem());
			}));
		}));
	}
});

var SprintsTabPanel = JClass.ex({
	_init : function(panel){
		this._panel = panel;
		this._setCallers();
	}
	
	,_setCallers : function(){
		this._panel.findWidget('root.createSprint').setCaller('BTN_CLICK', JCaller.snew(this, this._onClickCreateSprint));
	}
	
	,_onClickCreateSprint : function(){
		Register.get('CreateSprintDlg').open();
	}
});

var AllStorysTabPanel = JClass.ex({
	updateStory: function(story){
		this._storysList.updateStory(story);
	}
	
	,_init : function(panel){
		this._panel = panel;
		this._storysList = StorysList.snew(panel);
		this._setCallers();
	}
	
	,_setCallers : function(){
		this._panel.findWidget('root.addStory').setCaller('BTN_CLICK', JCaller.snew(this, this._onClickAddItem));
	}
	
	,_onClickAddItem : function(){
		this._storysList.addStory();
	}
});

var SprintsMgr = JClass.ex({
});

var CreateSprintDlg = JUI.Dialog.ex({
	_getParent : function(){
		return JUI.getRoot();
	}
	
	,_getTempl : function(){
		return ui_res.createSprintDlg;
	}
	
	,_setCallers : function() {
		this._panel.findWidget('root.sprintStart').setCaller('INPUT_FOCUS', JCaller.snew(this, function(input){
			JUtil.setTimer(1, JCaller.snew(this, function(){
				g_calendar.showMoreDay = false;
				g_calendar.show(input.getElem());
			}));
		}));
		this._panel.findWidget('root.sprintEnd').setCaller('INPUT_FOCUS', JCaller.snew(this, function(input){
			JUtil.setTimer(1, JCaller.snew(this, function(){
				g_calendar.showMoreDay = false;
				g_calendar.show(input.getElem());
			}));
		}));
		this._setItemCaller('root.closeBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickClose));
		this._setItemCaller('root.cancelButton', 'BTN_CLICK', JCaller.snew(this, this._onCancelButton));
		this._setItemCaller('root.confirmButton', 'BTN_CLICK', JCaller.snew(this, this._onConfirmButton));
	}
	
	,_onOpenAfter : function(){
		this._panel.findWidget('root.sprintTitle').focus();
	}
	
	,_onConfirmButton : function(){
		var title = this._panel.findWidget('root.sprintTitle').getText();
		var content = this._panel.findWidget('root.sprintCon').getText();
		var sprintStart = stringDateToTime(this._panel.findWidget('root.sprintStart').getText());
		var sprintEnd = stringDateToTime(this._panel.findWidget('root.sprintEnd').getText());
		ServerStub.get('SprintObject').createSprint(title, content, sprintStart, sprintEnd, JCaller.snew(this, function(ret){
			//Register.get('SprintsMgr').
		}));
		this.close();
	}
	
	,_onCancelButton : function(){
		this.close();
	}
	
	,_onClickClose : function(){
		this.close();
	}
});

var MainTabs = JClass.ex({
	_init : function(){
		this._create();
	}
	
	,_create : function(){
		this._tab = JUI.createPanel(JUI.getRoot(), ui_res.mainTabs);
		//this._currentSprintPanel = CurrentSprintTabPanel.snew(this._tab.getPanel(0));
		//this._sprintsPanel = SprintsTabPanel.snew(this._tab.getPanel(1));
		this._storyListPanel  = AllStorysTabPanel.snew(this._tab.getPanel(0))
		this._tab.activeTab(0);
	}
	
	,getAllStorysPanel : function(){
		return this._storyListPanel;
	}
});

Register.reg('StoryEditDlg', JUI.createDialog(StoryEditDlg));
Register.reg('CreateSprintDlg', JUI.createDialog(CreateSprintDlg));
Register.reg('MainTabs', MainTabs.snew());



