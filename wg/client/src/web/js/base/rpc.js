
Server = function(){
	this.reg = function(regInfos){
		
	};
};

[
	{type:0, id:1001, name='getPlayer', ret='Player', params=1},
	{type:1, id:2001, className='PlayerMgr', 
		members:[
			{type:0, id:1001, name='getId', ret=1, params=0},
			{type:0, id:1002, name='getName', ret=1, params=0},
		]},
]

// demo 
var player = Server.getPlayer('aabbcc')
print ( player.getId() )
print ( player.getName() )

Client = function(player){
};

Client.regClass('Player', Player);
Client.regFun('getPlayer', app.getPlayer)