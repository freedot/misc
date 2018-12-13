var fs = require('fs');
var SprintDB = JClass.ex({
	_init : function(){
		this._sprints = {allocId:1, curSprint:0, list:[]};
		this._load();
	}
	
	,_load : function(){
		try {
			var data = fs.readFileSync(this._getSprintFileName(), 'utf8');
			this._sprints = eval('(' + data + ')' );
		} catch (e) {
			console.log('file ' + this._getSprintFileName() + ' not exist' );
		}
	}
	
	,_save : function(){
		fs.writeFile(this._getSprintFileName(), JSON.stringify(this._sprints), function (err) {
			if (err) throw err;
		});
	}
	
	,createSprint : function(title, desc, start, end){
		var sprint = {id:this._sprints.allocId++, title:title, desc:desc, start:start, end:end, storys:[]};
		this._sprints.list.push(sprint);
		this._save();
		return {sprint:sprint};
	}
	
	,_getSprintFileName : function(){
		return makeFullPath('storys/sprints.txt');
	}
})

var SprintObject = ServerObject.ex({
	_init : function(){
		this._db = SprintDB.snew();
	}
	
	,createSprint : function(title, desc, start, end){
		return {list:this._db.createSprint(title, desc, start, end)};
	}
});

Register.reg('SprintObject', SprintObject.snew());
ClientStub.reg('SprintObject', Register.get('SprintObject'));



