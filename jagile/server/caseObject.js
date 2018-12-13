var fs = require('fs');
var StoryCaseMgr = JClass.ex({
	_init: function(){
		this._id = 0;
		this._casesInfo = {curid:1, storysCases:{}};
		this._load();
	}
	
	,_load : function(){
		try {
			var data = fs.readFileSync(this._getCaseMgrFileName(), 'utf8');
			this._casesInfo = eval('(' + data + ')' );
		} catch (e) {
			console.log('file ' + this._getCaseMgrFileName() + ' not exist' );
		}
	}
	
	,_save : function(){
		fs.writeFile(this._getCaseMgrFileName(), JSON.stringify(this._casesInfo), function (err) {
			if (err) throw err;
		});
	}
	
	,_getCaseMgrFileName : function(){
		return makeFullPath('cases/casemgr.txt');
	}
	
	,allocId : function(){
		this._casesInfo.curid++;
		this._save();
		return this._casesInfo.curid;
	}
	
	,isAutoCase : function(caseId){
		if ( this._casesInfo.storysCases[caseId] ) return true;
		else return false;
	}
	
	,regAutoCase : function(tcase){
		this._casesInfo.storysCases[tcase.id] = {storyId:tcase.storyId, testState:0};
		this._save();
	}
	
	,getAutoCaseStoryId : function(caseId){
		return this._casesInfo.storysCases[caseId].storyId;
	}
	
	,getAutoCaseTestState : function(caseId){
		return this._casesInfo.storysCases[caseId].testState;
	}
		
	,unregAutoCase : function(caseId){
		if ( this.isAutoCase(caseId)){
			delete this._casesInfo.storysCases[caseId];
			this._save();
		}
	}
});
Register.reg('StoryCaseMgr', StoryCaseMgr.snew());

var CaseDB = JClass.ex({
	_init : function(){
		this._storysCases = {};
	}
	
	,_load : function(storyId){
		try {
			var data = fs.readFileSync(this._makeStoryCasesFile(storyId), 'utf8');
			this._storysCases[storyId] = eval('(' + data + ')' );
		} catch (e) {
			this._storysCases[storyId] = {};
			console.log('file ' + this._makeStoryCasesFile(storyId) + ' not exist' );
		}
	}
	
	,_save : function(storyId){
		fs.writeFile(this._makeStoryCasesFile(storyId), JSON.stringify(this._storysCases[storyId]), function (err) {
			if (err) throw err;
		});
	}
	
	,addNewCase : function(tcase){
		var cases = this._getStoryCases(tcase.storyId);
		cases[tcase.id] = tcase;
		tcase.state = Register.get('StoryCaseMgr').getAutoCaseTestState(tcase.id);
		this._save(tcase.storyId);
		return tcase;
	}
	
	,saveAutoCase : function(caseId, name, content){
		var storyId = Register.get('StoryCaseMgr').getAutoCaseStoryId(caseId);
		var cases = this._getStoryCases(storyId);
		var tcase = cases[caseId];
		tcase.name = name;
		tcase.content = content;		
		this._save(storyId);
		return tcase;
	}
	
	,getAutoCase : function(caseId){
		var storyId = Register.get('StoryCaseMgr').getAutoCaseStoryId(caseId);
		var cases = this._getStoryCases(storyId);
		var autocase = cases[caseId.toString()];
		autocase.state = Register.get('StoryCaseMgr').getAutoCaseTestState(caseId);
		return autocase;
	}
	
	,deleteStoryCase : function(caseId){
		var storyId = Register.get('StoryCaseMgr').getAutoCaseStoryId(caseId);
		Register.get('StoryCaseMgr').unregAutoCase(caseId);
		var cases = this._getStoryCases(storyId);
		delete cases[caseId.toString()];
		this._save(storyId);
		return {ret:0};
	}
	
	,_getStoryCases : function(storyId){
		if ( !this._storysCases[storyId] ) {
			this._load(storyId);
		}
		return this._storysCases[storyId];
	}
	
	,_makeStoryCasesFile : function(storyId){
		return makeFullPath('cases/story_' + storyId + '.txt');
	}
});

var CaseObject = ServerObject.ex({
	_init : function(){
		this._db = CaseDB.snew();
	}
	
	,newAutoCase : function(storyId, caseId, name){
		var tcase = this._newAutoCase(storyId, caseId, name);
		Register.get('StoryObject').setAutoCase(storyId, caseId);
		Register.get('StoryCaseMgr').regAutoCase(tcase);
		return this._db.addNewCase(tcase);
	}
	
	,saveAutoCase : function(caseId, name, content){
		return this._db.saveAutoCase(caseId, name, content);
	}
	
	,getAutoCase : function(caseId){
		return this._db.getAutoCase(caseId);
	}
	
	,deleteStoryCase : function(caseId){
		return this._db.deleteStoryCase(caseId);
	}
	
	,runCase: function(caseId){
		// need use fit or slim test engine, this just sample test
		// test result need modify StoryCaseMgr the testState
		return {ret:0, result:{state:0, list:[{range:{pos:30, len:5}, str:'<result1>', state:1}, {range:{pos:50, len:5}, str:'<result2>', state:0}]}};
	}
	
	,runStoryCases: function(storyId){
		return {ret:-1};
	}
	
	,_newAutoCase : function(storyId, caseId, name){
		return {storyId:storyId, id:caseId, auto:1, name:name, state:0, content:''};
	}
});

Register.reg('CaseObject', CaseObject.snew());
ClientStub.reg('CaseObject', Register.get('CaseObject'));
