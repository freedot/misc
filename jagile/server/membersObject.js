var fs = require('fs');

var MembersDB = JClass.ex({
	_init : function(){
		this._members = [];
		this._load();
	}
	
	,_load : function(){
		try {
			var data = fs.readFileSync(this._getFileName(), 'utf8');
			this._members = eval('(' + data + ')' );
		} catch (e) {
			console.log('file ' + this._getFileName() + ' not exist' );
		}
	}
	
	,_save : function(storyId){
		fs.writeFile(this._getFileName(), JSON.stringify(this._storysCases[storyId]), function (err) {
			if (err) throw err;
		});
	}
	
	,getMembers : function(){
		return {list:this._members};
	}
	
	,addMember : function(memName){
		for ( var i=0; i<this._members.length; ++i ) {
			if ( this._members[i] == memName) {
				return {list:this._members};
			}
		}
		this._members.push[memName];
		return {list:this._members};
	}
	
	,deleteMember : function(memName){
		for ( var i=0; i<this._members.length; ++i ) {
			if ( this._members[i] == memName) {
				this._members.splice(i, 1);
				break;
			}
		}
		return {list:this._members};
	}
	
	,_getFileName : function(){
		return makeFullPath('members.txt');
	}
});

var MembersObject = ServerObject.ex({
	_init : function(){
		this._db = MembersDB.snew();
	}
	
	,getMembers : function(){
		return this._db.getMembers();
	}
	
	,addMember : function(memName){
		return this._db.addMember(memName);
	}
	
	,deleteMember : function(memName){
		return this._db.deleteMember(memName);
	}
});

Register.reg('MembersObject', MembersObject.snew());
ClientStub.reg('MembersObject', Register.get('MembersObject'));
