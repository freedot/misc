var getIndexRange = function(fromId, toId){
	var startId = fromId < toId ? fromId : toId;
	var endId = toId > fromId ? toId : fromId;
	return {start: startId, end: endId};
};

var fs = require('fs');
var StorysDB = JClass.ex({ // if need, can replace by sqlite
	_init : function(){
		this._storys = [];
		this._load();
		// {idx:0, id:1, story:'story', points:1, state:0, owner:'xx;xx;', bindcase:0, cases:[{id:1, auto:1, name:'case1', state:0}], tasks:[{name:'task1', owner:'xx;xx;', leftTime:10}]}
	}
	
	,_load : function(){
		try {
			var data = fs.readFileSync(this._getStoryListFileName(), 'utf8');
			this._storys = eval('(' + data + ')' );
		} catch (e) {
			console.log('file ' + this._getStoryListFileName() + ' not exist' );
		}
	}
	
	,_save : function(){
		fs.writeFile(this._getStoryListFileName(), JSON.stringify(this._storys), function (err) {
			if (err) throw err;
		});
	}
	
	,_getStoryListFileName : function(){
		return makeFullPath('storys/storylist.txt');
	}
	
	,getStorys : function(){
		this._resetStorysState();
		return this._storys;
	}
	
	,getStory : function(storyId){
		var story = this._findStoryById(storyId);
		this._resetCasesAutoFlag(story);
		this._resetCasesAutoTestResultState(story);
		return story;
	}
	
	,addStory : function(story){
		this._fillStory(story);
		this._storys.push(story);
		this._resetTasksIndex(this._storys.length-1, this._storys.length-1);
		this._save();
	}
	
	,insertStory : function(story){
		this._fillStory(story);
		this._storys.splice(story.idx, 0, story);
		this._resetTasksIndex(story.idx, this._storys.length-1);
		this._save();
	}
	
	,changeStoryIndex : function(fromIndex, toIndex){
		this._changeStoryIndex(fromIndex, toIndex);
		this._resetTasksIndex(fromIndex, toIndex);
		this._save();
	}
	
	,deleteStory : function(storyId){
		var storyIndex = this.findStoryIdxById(storyId);
		if ( storyIndex < 0 ) return;
		this._storys.splice(storyIndex, 1);
		if ( storyIndex < this._storys.length ) {
			this._resetTasksIndex(storyIndex, this._storys.length-1);
		}
		this._save();
	}
	
	,saveStory : function(story){
		var index = this.findStoryIdxById(story.id);
		this._storys[index] = story;
		this._save();
		return this._storys[index];
	}
	
	,changeStoryCase : function(storyId, tcase){
		var story = this._findStoryById(storyId);
		var ttcase = this._findCaseById(story.cases, tcase.id);
		ttcase.name = tcase.name;
		ttcase.owner = tcase.owner;
		ttcase.state = tcase.state;
		ttcase.auto = tcase.auto;
		this._save();
		return ttcase;
	}
	
	,addStoryCase : function(storyId){
		var tcase = {id:-1, auto:0, name:'--', owner:'--', state:0};
		var story = this._findStoryById(storyId);
		tcase.id = Register.get('StoryCaseMgr').allocId();
		story.cases.push(tcase);
		this._save();
		return story.cases[story.cases.length-1];
	}
	
	,changeStoryCaseIndex : function(storyId, fromIdx, toIdx){
		var story = this._findStoryById(storyId);
		var tcase = story.cases[fromIdx];
		story.cases.splice(fromIdx, 1);
		if ( fromIdx < toIdx ) {
			story.cases.splice(toIdx-1, 0, tcase);
		} else {
			story.cases.splice(toIdx, 0, tcase);
		}
		this._save();
		return {list:story.cases};
	}
	
	,deleteStoryCase : function(storyId, caseIdx){
		var story = this._findStoryById(storyId);
		story.cases.splice(caseIdx, 1);
		this._save();
		return {list:story.cases};
	}
	
	,getStoryCases : function(storyId){
		var story = this._findStoryById(storyId);
		this._resetCasesAutoFlag(story);
		this._resetCasesAutoTestResultState(story);
		return {list:story.cases};
	}
	
	,setAutoCase : function(storyId, caseId){
		var story = this._findStoryById(storyId);
		var tcase = this._findCaseById(story.cases, caseId);
		tcase.auto = 1;
		this._save();
		return tcase;
	}
	
	,addStoryTask : function(storyId){
		var task = {id:-1, name:'--', owner:'--', state:0, leftTime:0};
		var story = this._findStoryById(storyId);
		task.id = this._getNewTaskId(story.tasks);
		story.tasks.push(task);
		this._save();
		return story.tasks[story.tasks.length-1];
	}
	
	,deleteStoryTask : function(storyId, taskIdx){
		var story = this._findStoryById(storyId);
		story.tasks.splice(taskIdx, 1);
		this._save();
		return {list:story.tasks};
	}
	
	,changeStoryTask : function(storyId, task){
		var story = this._findStoryById(storyId);
		var ttask = this._findCaseById(story.tasks, task.id);
		ttask.name = task.name;
		ttask.owner = task.owner;
		ttask.leftTime = task.leftTime;
		ttask.state = task.state;
		this._save();
		return ttask;
	}
	
	,changeStoryTaskIndex : function(storyId, fromIdx, toIdx){
		var story = this._findStoryById(storyId);
		var task = story.tasks[fromIdx];
		story.tasks.splice(fromIdx, 1);
		if ( fromIdx < toIdx ) {
			story.tasks.splice(toIdx-1, 0, task);
		} else {
			story.tasks.splice(toIdx, 0, task);
		}
		this._save();
		return {list:story.tasks};
	}	
	
	,findStoryIdxById : function(storyId){
		for ( var i=0; i<this._storys.length; ++i ) {
			var story = this._storys[i];
			if ( story.id == storyId ) return i;
		}
		return -1;
	}	
	
	,_fillStory : function(story){
		story.id = this._allocStoryId();
		story.cases = [];
		story.tasks = [];	
	}
	
	,_allocStoryId : function(){
		var id = 0;
		for ( var i=0; i<this._storys.length; ++i ) {
			var story = this._storys[i];
			if ( story.id > id ) id = story.id;
		}
		return id + 1;
	}
	
	,_changeStoryIndex : function(fromId, toId){
		var story = this._storys[fromId];
		this._storys.splice(fromId, 1);
		if ( fromId < toId ) {
			this._storys.splice(toId-1, 0, story);
		} else {
			this._storys.splice(toId, 0, story);
		}
	}
	
	,_resetTasksIndex : function(fromId, toId){
		var range = getIndexRange(fromId, toId);
		for ( var i=range.start; i<=range.end; ++i ) {
			this._storys[i].idx = i;
		}
	}
	
	,_findStoryById : function(storyId){
		var idx = this.findStoryIdxById(storyId);
		if ( idx < 0 ) return null;
		return this._storys[idx];
	}
	
	,_findCaseById : function(cases, caseId){
		for ( var i=0; i<cases.length; ++i ) {
			var tcase = cases[i];
			if ( tcase.id == caseId ) return tcase;
		}
		return null;
	}
	
	,_resetCasesAutoFlag : function(story){
		for ( var i=0; i<story.cases.length; ++i ) {
			var tcase = story.cases[i];
			if ( Register.get('StoryCaseMgr').isAutoCase(tcase.id) )  tcase.auto = 1;
			else tcase.auto = 0;
		}
	}
	
	,_resetCasesAutoTestResultState : function(story){
		for ( var i=0; i<story.cases.length; ++i ) {
			var tcase = story.cases[i];
			if ( Register.get('StoryCaseMgr').isAutoCase(tcase.id) )  {
				tcase.state = Register.get('StoryCaseMgr').getAutoCaseTestState(tcase.id);
			}
		}
	}
	
	,_resetStorysState : function(story){
		for ( var i=0; i<this._storys.length; ++i ) {
			var story = this._storys[i];
			this._resetCasesAutoTestResultState(story);
			if ( !story.bindcase ) continue;
			if ( this._storyCasesPass(story.cases) ) {
				if ( story.state == 3 ) story.state = 2;
			} else {
				if ( story.state == 2 ) story.state = 3;
			}
		}
	}
	
	,_storyCasesPass : function(cases){
		for ( var i=0; i<cases.length; ++i ) {
			if ( cases[i].state == 0 ) return false;
		}
		return true;
	}
	
	,_getNewTaskId : function(tasks){
		var id = 0;
		for ( var i=0; i<tasks.length; ++i ) {
			if (tasks[i].id > id ) id = tasks[i].id;
		}
		return id+1;
	}
})

var StoryObject = ServerObject.ex({
	_init : function(){
		this._db = StorysDB.snew();
	}
	
	,getStorys : function(){
		return {list:this._db.getStorys()};
	}
	
	,getStoryDetail : function(storyId){
		return this._db.getStory(storyId);
	}
	
	,deleteStory : function(storyId){
		this._db.deleteStory(storyId);
		return {list:this._db.getStorys()};
	}
	
	,addStory : function(story){
		this._db.addStory(story);
		return {list:this._db.getStorys()};
	}
	
	,insertStory : function(story){
		this._db.insertStory(story);
		return {list:this._db.getStorys()};
	}
	
	,changeStoryIndex : function(fromId, toId){
		var fromIndex = this._db.findStoryIdxById(fromId);
		var toIndex = this._db.findStoryIdxById(toId);
		this._db.changeStoryIndex(fromIndex, toIndex);
		return this._collectChangeTasks(fromIndex, toIndex);
	}
	
	,saveStory : function(story){
		return this._db.saveStory(story);
	}
	
	,changeStoryCase : function(storyId, tcase){
		return this._db.changeStoryCase(storyId, tcase);
	}
	
	,addStoryCase : function(storyId){
		return this._db.addStoryCase(storyId);
	}
	
	,changeStoryCaseIndex : function(storyId, fromIdx, toIdx){
		return this._db.changeStoryCaseIndex(storyId, fromIdx, toIdx);
	}
	
	,deleteStoryCase : function(storyId, caseIdx){
		return this._db.deleteStoryCase(storyId, caseIdx);
	}
	
	,getStoryCases : function(storyId){
		return this._db.getStoryCases(storyId);
	}
	
	,setAutoCase : function(storyId, caseId){
		return this._db.setAutoCase(storyId, caseId);
	}
	
	,addStoryTask : function(storyId){
		return this._db.addStoryTask(storyId);
	}
	
	,deleteStoryTask : function(storyId, taskIdx){
		return this._db.deleteStoryTask(storyId, taskIdx);
	}
	
	,changeStoryTask : function(storyId, task){
		return this._db.changeStoryTask(storyId, task);
	}
	
	,changeStoryTaskIndex : function(storyId, fromIdx, toIdx){
		return this._db.changeStoryTaskIndex(storyId, fromIdx, toIdx);
	}
	
	,_collectChangeTasks : function(fromId, toId){
		var storys = [];
		var range = getIndexRange(fromId, toId);
		for ( var i=range.start; i<=range.end; ++i ) {
			storys.push(this._db.getStorys()[i]);
		}	
		return {list:storys, start:range.start, end:range.end};
	}
});

Register.reg('StoryObject', StoryObject.snew());
ClientStub.reg('StoryObject', Register.get('StoryObject'));



