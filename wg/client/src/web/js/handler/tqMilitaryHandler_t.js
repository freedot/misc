/******************************************************************************
******************************************************************************/
requireEx('./handler/tqMilitaryHandler.js', [
	{
		start:'//MilitaryHandler-unittest-start'
		,end:'//MilitaryHandler-unittest-end'
		,items:['m_g'
			,'m_this'
			,'_onLoginOk'
			]
	}
]);

TestCaseMilitaryHandler = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = MilitaryHandler.snew(this.g);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testRecvFavoriteData = function(){
		this.mm.mock(this.g.getImgr(), 'getFightRefState', [REF_ROLESTATE.NORMAL]);
		var svrcmd = {favorites:[{id:1,name:'xxx',pos:{x:100,y:200}}
			,{id:2,name:'xxx',pos:{x:100,y:200}}
			,{id:3,name:'xxx',pos:{x:100,y:200}} ]};
		
		var updateEventSended = false;
		g_app.regEvent(EVT.FAVORITE_UPDATE, 0, this, function(){ updateEventSended = true; } );
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assert(g_app.getImgr().getTargetsFavorite().length == 3);
		assert(updateEventSended == true);
	};
	
	this.testRecvEnemyData = function(){
		var svrcmd = {enemys:[{id:1,name:'xxx',pos:{x:100,y:200}}
			,{id:2,name:'xxx',pos:{x:100,y:200}}
			,{id:3,name:'xxx',pos:{x:100,y:200}} ]};
		
		var updateEventSended = false;
		g_app.regEvent(EVT.ENEMY_UPDATE, 0, this, function(){ updateEventSended = true; } );
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assert(g_app.getImgr().getEnemys().length == 3);
		assert(updateEventSended == true);
	};
	
	this.testRecvLineupData = function(){
		var svrcmd = {lineups:[1,2]};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assert(g_app.getImgr().getLineups().length == 2);
		assert(g_app.getImgr().getLineups()[0] == 1);
		assert(g_app.getImgr().getLineups()[1] == 2);
		
		svrcmd = {lineups:[3,1,4]};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assert(g_app.getImgr().getLineups().length == 3);
		assert(g_app.getImgr().getLineups()[0] == 3);
		assert(g_app.getImgr().getLineups()[1] == 1);
		assert(g_app.getImgr().getLineups()[2] == 4);
		
		svrcmd = {lineups:[{"_r":1}]};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assert(g_app.getImgr().getLineups().length == 0);
	};
	
	this.testRecvArmysData = function(){
		var armys = g_app.getImgr().getArmys();
	
		var svrcmd = {armys:{list:[
			{id:1, armyType:ARMY_TYPE.SELF, state:ARMYDYN_STATE.GOTO, expedType:1,  heros:[{id:1},{id:0},{id:2}]}
			,{id:2, _d:1}
			,{id:3, armyType:ARMY_TYPE.ENEMY, state:ARMYDYN_STATE.GOTO, expedType:1,  heros:[{id:3},{id:0},{id:4}]}
			]
			,samealli:[
			{id:10}
			,{id:11}
			]}};
		var personalArmyEventSended = false;
		var salliArmyEventSended = false;
		g_app.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, this, function(){ personalArmyEventSended = true; } );
		g_app.regEvent(EVT.SALLIANCE_ARMY_UPDATE, 0, this, function(){ salliArmyEventSended = true; } );
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assertEQ ( armys.list.length, 2 );
		assertEQ ( personalArmyEventSended, true );
		assertEQ ( armys.list[0].id, 3);
		assertEQ ( armys.list[1].id, 1);
		assertEQ ( armys.list[1].heros, [{id:1},{id:0},{id:2}]);
		
		assertEQ ( armys.samealli.length, 2 );
		assertEQ ( salliArmyEventSended, true );
		assertEQ ( armys.samealli[0].id, 11);
		assertEQ ( armys.samealli[1].id, 10);
		
		var svrcmd = {saveforces:[{type:1,lineup:180001,heros:[1,0,2]},{type:2,lineup:180002,heros:[1,0,3]}]};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:svrcmd});
		assertEQ ( this.g.getImgr().getSaveForces(), [{type:1,lineup:180001,heros:[1,0,2]},{type:2,lineup:180002,heros:[1,0,3]}]);
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(MilitarySender, 'sendGetMilitary');
		this.mm.mock(MilitarySender, 'sendGetAllArmys');
		this.mm.mock(MilitarySender, 'sendGetForceLineUp');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['sendGetMilitary'], [this.g] );
		assertEQ ( this.mm.params['sendGetAllArmys'], [this.g] );
		assertEQ ( this.mm.params['sendGetForceLineUp'], [this.g] );
	};
	
});

tqMilitaryHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseMilitaryHandler, 'TestCaseMilitaryHandler');
};