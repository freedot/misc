//---
requireEx('./handler/tqMilitaryDlg.js', [
	{
		start:'//MilitaryDlg-unittest-start'
		,end:'//MilitaryDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			]
	}
	,{
		start:'//MilitaryOpDlg-unittest-start'
		,end:'//MilitaryOpDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_army'
			,'m_opHdr'
			,'m_heroGetter'
			,'_createOpHdr'
			,'_createHeroGetter'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_setCallers'
			,'_setRoleName'
			,'_setFightCap'
			,'_setHeroList'
			,'_setLeftTime'
			,'_setOpBtnText'
			,'_onClickStrategy'
			,'_onClickOP'
			,'_getLeftTime'
			,'_onUpdate'
			,'_onDlgEvent'
			]
	}
]);
	
TestCaseMilitaryDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.militaryHdr = MilitaryHandler.snew(this.g);
		this.dlg = MilitaryDlg.snew(this.g);
		this.g.getImgr().getRoleRes().name = 'my';
		this.g.updater.length = 0;
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testTabsList = function(){
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('tabList').getTabCount() == 2 );
		assert ( this.dlg.getCtrl('tabList').getTabText(0) == rstr.military.militarydlg.tabs[0]);
		assert ( this.dlg.getCtrl('tabList').getTabText(1) == rstr.military.militarydlg.tabs[1]);
	};
	
	this.testOpenDlgSelectFirstTab = function(){
		this.dlg.openDlg();
		assert ( this.dlg.isShow() == true );
		assert ( this.dlg.getCtrl('tabList').getActiveTab() == 0 );
		
		this.dlg.getCtrl('tabList').activeTab(1);
		assert ( this.dlg.getCtrl('tabList').getActiveTab() == 1 );
		
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('tabList').getActiveTab() == 0 );
	};
	
	this.testShowSelfArmyList = function(){
		IS_DEBUG = false;
		this.g.setSvrTimeS(0);
		var netcmd = {cmd:74,armys:{list:[
			{id:1,state:0,expedType:1,sourceType:1,sourceRole:'my',sourcePos:{x:0,y:0},heros:[1,2,0,0,0],targetType:1,targetRole:"target1",targetPos:{x:0,y:1},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( list.getCount() == 1 );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.intent) == rstr.military.militarydlg.intents[1] );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.sourcePlayer) == 'my(0,0)' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.state) == rstr.military.militarydlg.states[0] );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.targetPlayer) == 'target1(0,1)' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.leftTime) == '00:00:20' );
		
		// new army info add
		var netcmd = {cmd:74,armys:{list:[
			{id:2,state:3,expedType:5,sourceType:1,sourceRole:'my',sourcePos:{x:0,y:0},heros:[1,2,0,0,0],targetType:1,targetRole:"target2",targetPos:{x:2,y:3},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( list.getCount() == 2 );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.intent) == rstr.military.militarydlg.intents[5] );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.sourcePlayer) == 'my(0,0)' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.state) == rstr.military.militarydlg.states[3] );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.targetPlayer) == 'target2(2,3)' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.leftTime) == '-:-:-' );
		assert ( TQ.getTextEx(list.getItem(1).exsubs.targetPlayer) == 'target1(0,1)' );
		
		//update
		this.g.setSvrTimeS(2);
		this.g.update();
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( TQ.getTextEx(list.getItem(1).exsubs.leftTime) == '00:00:18' );
		
		//update, time beyond
		this.g.setSvrTimeS(21);
		this.g.update();
		assert ( TQ.getTextEx(list.getItem(1).exsubs.leftTime) == '00:00:00' );
		
		//close the dlg, unregister from update list
		assert ( this.g.updater.length == 1 );
		this.dlg.closeDlg();
		assert ( this.g.updater.length == 0 );
	};
	
	this.testShowPersonalArmyList = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:0,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetType:1,targetRole:"target",targetPos:{x:203,y:0},stopTime:20}
			,{id:3,state:0,expedType:5,armyType:ARMY_TYPE.ALLI,sourceRole:"alliance",sourcePos:{x:202,y:0},heros:[{id:1,name:"hero",level:1,attrs:{"10":{val:100}},soldier:{resid:150001010,number:10}},{id:0},{id:0},{id:0},{id:0}],targetRole:'my',targetPos:{x:0,y:0},stopTime:20}
			,{id:2,state:0,expedType:1,armyType:ARMY_TYPE.ENEMY,sourceRole:"enemy",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		IS_DEBUG = false;
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( list.getCount() == 3, 'collect all personal armys show in list' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.sourcePlayer) == 'alliance(202,0)' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.targetPlayer) == 'my(0,0)' );
		assert ( TQ.getTextEx(list.getItem(1).exsubs.sourcePlayer) == 'enemy(201,0)' );
		assert ( TQ.getTextEx(list.getItem(1).exsubs.targetPlayer) == 'my(0,0)' );
		assert ( TQ.getTextEx(list.getItem(2).exsubs.sourcePlayer) == 'my(0,0)' );
		assert ( TQ.getTextEx(list.getItem(2).exsubs.targetPlayer) == 'target(203,0)' );
		
		// set line item alliancearmy classname
		assert ( TQ.getClass(list.getItem(0).exsubs.intent) == 'alliancearmy' );
		assert ( TQ.getClass(list.getItem(0).exsubs.sourcePlayer) == 'alliancearmy' );
		assert ( TQ.getClass(list.getItem(0).exsubs.state) == 'alliancearmy' );
		assert ( TQ.getClass(list.getItem(0).exsubs.targetPlayer) == 'alliancearmy' );
		assert ( TQ.getClass(list.getItem(0).exsubs.leftTime) == 'alliancearmy' );
		// set line item enemyarmy classname
		assert ( TQ.getClass(list.getItem(1).exsubs.intent) == 'enemyarmy' );
		// set line item selfarmy classname
		assert ( TQ.getClass(list.getItem(2).exsubs.intent) == 'selfarmy' );
	};
	
	this.testShowAllianceArmyList = function(){
		this.g.setSvrTimeS(0);
		var netcmd = {cmd:74,armys:{
			samealli:[{id:1,state:0,expedType:1,lineupId:180001,heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],source:{role:"srole",pos:{x:2,y:3},alliance:"salliance"},target:{role:"trole",pos:{x:0,y:1}},stopTime:20}]
		}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		var list = this.dlg.getCtrl('tabList').getTabItems(1).list;
		assert ( list.getCount() == 1 );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.attackPlayer) == 'srole' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.attackAlliance) == 'salliance' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.state) == rstr.military.militarydlg.states[0] );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.enemyPlayer) == 'srole' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.alliancePlayer) == 'trole' );
		assert ( TQ.getTextEx(list.getItem(0).exsubs.leftTime) == '00:00:20' );
		
		// set line item enemyarmy classname
		assert ( TQ.getClass(list.getItem(0).exsubs.attackPlayer) == 'enemyarmy' );
	};
	
	this.testSeeBtnEnableOrDisable_beforeOpenDlg = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:0,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetType:1,targetRole:"target",targetPos:{x:203,y:0},stopTime:20,fighted:1}
			,{id:2,state:0,expedType:1,armyType:ARMY_TYPE.ENEMY,sourceRole:"enemy",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			]}};
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( list.getItem(0).exsubs.seebtn.isEnable() == false );
		assert ( list.getItem(1).exsubs.seebtn.isEnable() == true );
	};
	
	this.testSeeBtnEnableOrDisable_afterOpenDlg = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:0,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetRole:"target",targetPos:{x:203,y:0},stopTime:20}
			,{id:2,state:0,expedType:1,armyType:ARMY_TYPE.ENEMY,sourceRole:"enemy",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:0,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetRole:"target",targetPos:{x:203,y:0},stopTime:20,fighted:1}
			,{id:2,state:0,expedType:1,armyType:ARMY_TYPE.ENEMY,sourceRole:"enemy",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		assert ( list.getItem(0).exsubs.seebtn.isEnable() == false );
		assert ( list.getItem(1).exsubs.seebtn.isEnable() == true );
	};
	
	this.testClickSeeBtn = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:1,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetType:1,targetRole:"target",targetPos:{x:203,y:0},stopTime:20,fighted:1}
			]}};		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		this.mm.mock(UIM, 'openDlg');
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		list.getItem(0).exsubs.seebtn.click();
		assertEQ ( this.mm.params['openDlg'], ['fightmap', 1, -1] );
	};
	
	this.testClickOpBtn = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			{id:1,state:1,expedType:5,armyType:ARMY_TYPE.SELF,sourceRole:'my',sourcePos:{x:0,y:0}, heros:[1,2,0,0,0],targetType:1,targetRole:"target",targetPos:{x:203,y:0},stopTime:20,fighted:1}
		]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		var methodMock = MethodMock.snew();
		methodMock.mock(UIM, 'openDlg', function(dlgName, army){
			methodMock.dlgName = dlgName;
			methodMock.army = army;
		} );
		var list = this.dlg.getCtrl('tabList').getTabItems(0).list;
		list.getItem(0).exsubs.opbtn.click();
		methodMock.restore();
		assert ( methodMock.dlgName == 'militaryop' );
		assert ( methodMock.army.id == 1 );
	};
	
	this.testClickReinforceBtn = function(){
		this.g.getImgr().getRoleRes().alliance.uid = 2;
		this.g.setSvrTimeS(0);
		var netcmd = {cmd:74,armys:{
			samealli:[{id:1,state:0,expedType:1,lineupId:180001,heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],source:{role:"srole",pos:{x:2,y:3},alliance:"salliance"},target:{role:"trole",pos:{x:0,y:1}},stopTime:20}]
		}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		this.dlg.openDlg();
		
		var methodMock = MethodMock.snew();
		methodMock.mock(UIM, 'openDlg', function(dlgName, target){
			methodMock.dlgName = dlgName;
			methodMock.target = target;
		} );
		var list = this.dlg.getCtrl('tabList').getTabItems(1).list;
		list.getItem(0).exsubs.reinforcebtn.click();
		methodMock.restore();
		assert ( methodMock.dlgName == 'expedition' );
		assert ( methodMock.target != null );
		assert ( methodMock.target.type == OBJ_TYPE.ROLE );
		assert ( methodMock.target.name == 'trole' );
		assert ( methodMock.target.pos.x == 0 );
		assert ( methodMock.target.pos.y == 1 );
		assert ( methodMock.target.alliance.uid == 2 );
	};
});

TestCaseMilitaryOpDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = MilitaryOpDlg.snew(this.g);
		//this.dlg.openDlg({});
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.lc().m_g = null;
		this.lc().m_this = null;
		this.dlg.init(this.g);
		assert ( this.lc().m_g == this.g );
		assert ( this.lc().m_this == this.dlg );
	};
	
	this.test_openDlg = function(){
		var g_army = {};
		this.mm.mock(this.lc(), '_createOpHdr');
		this.mm.mock(this.lc(), '_createHeroGetter');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc().m_g, 'regUpdater');
			
		this.dlg.openDlg(g_army);
		assertEQ ( this.mm.walkLog, '_createOpHdr,_createHeroGetter,_initDlg,_openDlg,_initInfo,regUpdater' );
		assertEQ ( this.lc().m_army, g_army );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 1000] );
	};
	
	this.test_closeDlg = function(){
		this.lc()._initDlg();
		this.lc()._openDlg();
		this.dlg.closeDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false);
	};
	
	this.test__createOpHdr = function(){
		var factory = MilitaryOpHandlerFactory.snew();
		this.mm.mock(MilitaryOpHandlerFactory, 'snew', [factory]);
		this.mm.mock(factory, 'createOpHdr', [{name:'opHdr'}]);
		
		this.lc().m_army = {id:1};
		this.lc()._createOpHdr();
		assertEQ (this.lc().m_opHdr,  {name:'opHdr'});
		assertEQ (this.mm.params['createOpHdr'], [this.g, this.dlg, this.lc().m_army] );
	};
	
	this.test__createHeroGetter = function(){
		this.lc().m_army = {id:1, heros:[]};
		this.lc()._createHeroGetter();
		assert ( this.lc().m_heroGetter instanceof ArmyHeroGetter );
		assert ( this.lc().m_heroGetter.g == this.g );
		assert ( this.lc().m_heroGetter.army == this.lc().m_army );
	}
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.g.getGUI(), 'initDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assert ( this.mm.walkLog == 'initDlg,_setCallers' );
		assertListEQ ( this.mm.params['initDlg'], [this.lc().m_dlg, uicfg.military.opdlg, this.lc().m_items] );
		
		this.mm.clear();
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '', 'only init dlg one time' );
	};
	
	this.test__openDlg = function(){
		this.lc()._initDlg();
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assert ( this.lc().m_dlg.isShow() == true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_setRoleName');
		this.mm.mock(this.lc(), '_setFightCap');
		this.mm.mock(this.lc(), '_setHeroList');
		this.mm.mock(this.lc(), '_setLeftTime');
		this.mm.mock(this.lc(), '_setOpBtnText');
		this.lc()._initInfo();
		assert ( this.mm.walkLog == '_setRoleName,_setFightCap,_setHeroList,_setLeftTime,_setOpBtnText' );
	};
	
	this.test__setCallers = function(){
		this.lc()._initDlg();
		this.mm.mock(this.lc().m_items.strategybtn, 'setCaller');
		this.mm.mock(this.lc().m_items.opbtn, 'setCaller');
		this.mm.mock(this.lc().m_dlg, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickStrategy}]);
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickOP}]);
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onDlgEvent}]);
	};
	
	this.test__onClickStrategy = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips')
		this.lc()._onClickStrategy();
		assert ( this.mm.walkLog == 'sysMsgTips' );
		assertListEQ ( this.mm.params['sysMsgTips'], [SMT_NORMAL, rstr.ids[100042].msg] );
	};
	
	this.test__onClickOP = function(){
		this.lc()._initDlg();
		
		this.lc().m_opHdr = MilitaryOpSelfArmyHdr.snew(this.g, {});
		this.mm.mock(this.lc().m_opHdr, 'operate');
		this.mm.mock(this.lc().m_dlg, 'hide');
		this.lc()._onClickOP();
		assertEQ ( this.mm.walkLog, 'operate' );
	};
	
	this.test__setRoleName = function(){
		this.lc().m_opHdr = MilitaryOpSelfArmyHdr.snew(this.g, {});
		this.mm.mock(this.lc().m_opHdr, 'getSourceRoleName', ['role']);
		this.mm.mock(TQ, 'setTextEx');
		this.lc()._setRoleName();
		assert ( this.mm.walkLog == 'getSourceRoleName,setTextEx' );
		assertListEQ ( this.mm.params['setTextEx'], [this.lc().m_items.roleName, 'role']);
	};
	
	this.test__setFightCap = function(){
		this.lc().m_heroGetter = ArmyHeroGetter.snew(this.g, {heros:[]});
		this.mm.mock(this.lc().m_heroGetter, 'getFightCap', [100]);
		this.mm.mock(TQ, 'setTextEx');
		this.lc()._setFightCap();
		assert ( this.mm.walkLog == 'getFightCap,setTextEx' );
		assertListEQ ( this.mm.params['setTextEx'], [this.lc().m_items.fightCap, 100]);
	};
	
	this.test__setHeroList = function(){
		this.lc()._initDlg();
		this.lc().m_heroGetter = ArmyHeroGetter.snew(this.g, {heros:[]});
		this.mm.mock(this.lc().m_heroGetter, 'getHeroCount', [2]);
		this.mm.mock(this.lc().m_heroGetter, 'getHeroByIdx', [{name:'name',level:1,attrs:{'10':{val:100*ATTR_PRECISION}},soldier:{resid:150001001,number:2}}]);
		this.lc()._setHeroList();
		assert ( this.mm.walkLog == 'getHeroCount,getHeroByIdx,getHeroByIdx' );
		assert ( this.lc().m_items.heroList.getCount() == 2 );
		assert ( TQ.getTextEx(this.lc().m_items.heroList.getItem(0).exsubs.name) == 'name' );
		assert ( TQ.getTextEx(this.lc().m_items.heroList.getItem(0).exsubs.level) == 1 );
		assert ( TQ.getTextEx(this.lc().m_items.heroList.getItem(0).exsubs.health) == 100 );
		assert ( TQ.getTextEx(this.lc().m_items.heroList.getItem(0).exsubs.soldier) == '1阶刀兵' );
		assert ( TQ.getTextEx(this.lc().m_items.heroList.getItem(0).exsubs.number) == 2 );
	};
	
	this.test__setLeftTime = function(){
		this.lc()._initDlg();

		var g_getLeftTimeRt = [0];
		this.mm.mock(this.lc(), '_getLeftTime', g_getLeftTimeRt);
		this.lc()._setLeftTime();
		assert ( TQ.getTextEx(this.lc().m_items.leftTime) == '' );
			
		g_getLeftTimeRt[0] = 10;
		this.lc()._setLeftTime();
		assert ( TQ.getTextEx(this.lc().m_items.leftTime) == rstr.military.opdlg.lbl.arriveTime + '00:00:10' );
	};
	
	this.test__getLeftTime = function(){
		this.lc().m_army = {state:ARMYDYN_STATE.DISPATCH};
		assert ( this.lc()._getLeftTime() == 0 );
		
		this.g.setSvrTimeS(1);
		this.lc().m_army = {state:ARMYDYN_STATE.GOTO, stopTime:11};
		assert ( this.lc()._getLeftTime() == 10 );
		
		this.lc().m_army = {state:ARMYDYN_STATE.RETURN, stopTime:11};
		assert ( this.lc()._getLeftTime() == 10 );
		
		this.lc().m_army = {state:ARMYDYN_STATE.RETURN, stopTime:0};
		assert ( this.lc()._getLeftTime() == 0 );
	};
	
	this.test__setOpBtnText = function(){
		this.lc()._initDlg();
		this.lc().m_opHdr = MilitaryOpSelfArmyHdr.snew(this.g, {});
		this.mm.mock(this.lc().m_opHdr, 'getBtnTitle', ['btnLabel']);
		this.lc()._setOpBtnText();
		assert ( this.lc().m_items.opbtn.getText() == 'btnLabel' );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_setLeftTime');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_setLeftTime' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater');
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE-1);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
});

TestCaseMilitaryOpHandlerFactory = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.factory = MilitaryOpHandlerFactory.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_createOpHdr = function(){
		this.g.getImgr().getArmys().list = [{id:1, armyType:ARMY_TYPE.SELF},{id:2, armyType:ARMY_TYPE.ENEMY},{id:3, armyType:ARMY_TYPE.ALLI}];
		
		var g_isDispatchFieldStateRt = [true];
		this.mm.mock(this.factory, '_isDispatchFieldState', g_isDispatchFieldStateRt);
		this.mm.mock(MilitaryOpDispatchSelfFieldArmyHdr, 'snew', [{name:'dispatchSelfFieldArmy'}] );
		this.mm.mock(MilitaryOpSelfArmyHdr, 'snew', [{name:'selfArmy'}] );
		this.mm.mock(MilitaryOpEnemyArmyHdr, 'snew', [{name:'enemyArmy'}] );
		this.mm.mock(MilitaryOpAlliArmyHdr, 'snew', [{name:'alliArmy'}] );
		this.mm.mock(NullMilitaryOpArmyHdr, 'snew', [{name:'nullArmy'}] );
		
		var dlg = {name:'dlg'};
		var army = {id:1};
		assertEQ ( this.factory.createOpHdr(this.g, dlg, army), {name:'dispatchSelfFieldArmy'});
		assertEQ ( this.mm.params['_isDispatchFieldState'], [army] );
		assertEQ ( this.mm.params['snew'], [this.g, dlg, army] );
		
		this.mm.clear();
		g_isDispatchFieldStateRt[0] = false;
		assertEQ ( this.factory.createOpHdr(this.g, dlg, army), {name:'selfArmy'});
		assertEQ ( this.mm.params['_isDispatchFieldState'], [army] );
		assertEQ ( this.mm.params['snew'], [this.g, dlg, army] );
		
		this.mm.clear();
		army = {id:2};
		assertEQ ( this.factory.createOpHdr(this.g, dlg, army), {name:'enemyArmy'});
		assertEQ ( this.mm.params['snew'], [this.g, dlg, army] );
		
		this.mm.clear();
		army = {id:3};
		assertEQ ( this.factory.createOpHdr(this.g, dlg, army), {name:'alliArmy'});
		assertEQ ( this.mm.params['snew'], [this.g, dlg, army] );
		
		this.mm.clear();
		army = {id:4};
		assertEQ ( this.factory.createOpHdr(this.g, dlg, army), {name:'nullArmy'});
		assertEQ ( this.mm.params['snew'], [this.g, dlg, army] );
	};
	
	this.test__isDispatchFieldState = function(){
		var army = {state:ARMYDYN_STATE.GOTO};
		assertEQ ( this.factory._isDispatchFieldState(army), false );
		
		army = {state:ARMYDYN_STATE.DISPATCH, targetType:OBJ_TYPE.ROLE};
		assertEQ ( this.factory._isDispatchFieldState(army), false );
		
		army = {state:ARMYDYN_STATE.DISPATCH, targetType:OBJ_TYPE.FIELD};
		assertEQ ( this.factory._isDispatchFieldState(army), true );
		
		army = {state:ARMYDYN_STATE.DISPATCH, targetType:OBJ_TYPE.OWNERFIELD};
		assertEQ ( this.factory._isDispatchFieldState(army), true );
	};	
});


TestCaseMilitaryOpHandler = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = {name:'dlg'};
		this.army = {id:1, sourceRole:'sourceRole', heros:[1,2]};
		this.hdr = MilitaryOpHandler.snew(this.g, this.dlg, this.army);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.hdr.g,  this.g);
		assertEQ ( this.hdr.dlg,  this.dlg);
		assertEQ ( this.hdr.army,  this.army);
	};
	
	this.test_getSourceRoleName = function(){
		assert ( this.hdr.getSourceRoleName() == 'sourceRole' );
	};
});

TestCaseMilitaryOpDispatchSelfFieldArmyHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = MockDialog.snew(this.g);
		this.army = {id:1, sourceRole:'sourceRole', heros:[1,2]};
		this.hdr = MilitaryOpDispatchSelfFieldArmyHdr.snew(this.g, this.dlg, this.army);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getBtnTitle = function(){
		assert ( this.hdr.getBtnTitle() == rstr.military.opdlg.btn.enterfield );
	};
	
	this.test_operate = function(){
		var dlg = MockDialog.snew(this.g);
		UIM.regDlg('selffield', dlg);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock(this.hdr.dlg, 'closeDlg');
		
		this.g.getImgr().getSelfFields().list = [{id:1, resid:170001, level:1, startTime:1}];
		this.army.targetId = 1;
		this.hdr.operate();
		assertEQ ( this.mm.walkLog, 'openDlg,closeDlg' );
		assertEQ ( this.mm.params['openDlg'], [{gridId:1, resid:170001, level:1, objType:OBJ_TYPE.FIELD}] );
	};
});

TestCaseMilitaryOpSelfArmyHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = MockDialog.snew(this.g);
		this.army = {id:1, sourceRole:'sourceRole', heros:[1,2]};
		this.hdr = MilitaryOpSelfArmyHdr.snew(this.g, this.dlg, this.army);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getBtnTitle = function(){
		assert ( this.hdr.getBtnTitle() == rstr.military.opdlg.btn.callback );
	};

	this.test_operate = function(){
		var g_preOperateRt = [false];
		this.mm.mock(this.hdr, '_preOperate', g_preOperateRt);
		this.mm.mock(MilitarySender, 'sendCallBackArmy' );
		this.mm.mock(this.hdr.dlg, 'closeDlg');
		
		this.hdr.operate();
		assertEQ ( this.mm.walkLog, '_preOperate' );
		
		this.mm.clear();
		g_preOperateRt[0] = true;
		this.hdr.operate();
		assertEQ ( this.mm.walkLog, '_preOperate' );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true);
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.walkLog, '_preOperate,sendCallBackArmy,closeDlg' );
		assertEQ ( this.mm.params['sendCallBackArmy'], [this.g, 1] );
	};	
	
	this.test__preOperate = function(){
		this.army.state = ARMYDYN_STATE.RETURN;
		this.mm.mock(this.g.getGUI(), 'sysMsgTips')
		assert ( this.hdr._preOperate() == false );
		assert ( this.mm.walkLog == 'sysMsgTips' );
		assertListEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100044].msg] );
		
		this.mm.clear();
		this.army.state = ARMYDYN_STATE.GOTO;
		assert ( this.hdr._preOperate() == true );
		assert ( this.mm.walkLog == '' );
	};	
});

TestCaseMilitaryOpEnemyArmyHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.army = {id:1, sourceRole:'enemy', heros:[{id:1,attrs:{}},{id:2,attrs:{}}]};
		this.army.heros[0].attrs[ATTR.FC] = {val:1};
		this.army.heros[1].attrs[ATTR.FC] = {val:2};
		this.dlg = MockDialog.snew(this.g);
		this.hdr = MilitaryOpEnemyArmyHdr.snew(this.g, this.dlg, this.army);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getBtnTitle = function(){
		assert ( this.hdr.getBtnTitle() == rstr.military.opdlg.btn.callback );
	};
	
	this.test_operate = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips')
		this.hdr.operate();
		assert ( this.mm.walkLog == 'sysMsgTips' );
		assertListEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100043].msg] );
	};
});

TestCaseMilitaryOpAlliArmyHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.army = {id:1, sourceRole:'alli', heros:[{id:1,attrs:{}},{id:2,attrs:{}}]};
		this.army.heros[0].attrs[ATTR.FC] = {val:1};
		this.army.heros[1].attrs[ATTR.FC] = {val:2};
		this.dlg = MockDialog.snew(this.g);
		this.hdr = MilitaryOpAlliArmyHdr.snew(this.g, this.dlg, this.army);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getBtnTitle = function(){
		assert ( this.hdr.getBtnTitle() == rstr.military.opdlg.btn.repatriate );
	};
	
	this.test_operate = function(){
		this.mm.mock(MilitarySender, 'sendRepatriateArmy' );
		this.mm.mock(this.hdr.dlg, 'closeDlg');
		
		this.hdr.operate();
		
		assert ( this.mm.walkLog == '' );
		assert ( this.g.getGUI().isShowMsgBox() == true);
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assert ( this.mm.walkLog == 'sendRepatriateArmy,closeDlg' );
		assertListEQ ( this.mm.params['sendRepatriateArmy'], [this.g, 1] );	
	};
});

TestCaseArmyHeroGetter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.army = {id:1, alliRoleName:'alli', heros:[{id:0},{id:1,attrs:{}},{id:2,attrs:{}},{id:0}]};
		this.army.heros[1].attrs[ATTR.FC] = {val:1};
		this.army.heros[2].attrs[ATTR.FC] = {val:2};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};	
	
	this.test_getFightCap = function(){
		var hdr = ArmyHeroGetter.snew(this.g, this.army);
		assert ( hdr.getFightCap() == 3 );
	};
	
	this.test_getHeroCount = function(){
		var hdr = ArmyHeroGetter.snew(this.g, this.army);
		assert ( hdr.getHeroCount() == 2 );
	};
	
	this.test_getHeroByIdx = function(){
		var hdr = ArmyHeroGetter.snew(this.g, this.army);
		assert ( hdr.getHeroByIdx(0) == this.army.heros[1] );
		assert ( hdr.getHeroByIdx(1) == this.army.heros[2] );
	};	
});

tqMilitaryDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseMilitaryDlg, 'TestCaseMilitaryDlg');
	suite.addTestCase(TestCaseMilitaryOpDlg, 'TestCaseMilitaryOpDlg');
	
	suite.addTestCase(TestCaseMilitaryOpHandlerFactory, 'TestCaseMilitaryOpHandlerFactory');
	suite.addTestCase(TestCaseMilitaryOpHandler, 'TestCaseMilitaryOpHandler');
	suite.addTestCase(TestCaseMilitaryOpDispatchSelfFieldArmyHdr, 'TestCaseMilitaryOpDispatchSelfFieldArmyHdr');
	suite.addTestCase(TestCaseMilitaryOpSelfArmyHdr, 'TestCaseMilitaryOpSelfArmyHdr');
	suite.addTestCase(TestCaseMilitaryOpEnemyArmyHdr, 'TestCaseMilitaryOpEnemyArmyHdr');
	suite.addTestCase(TestCaseMilitaryOpAlliArmyHdr, 'TestCaseMilitaryOpAlliArmyHdr');
	
	suite.addTestCase(TestCaseArmyHeroGetter, 'TestCaseArmyHeroGetter');
};