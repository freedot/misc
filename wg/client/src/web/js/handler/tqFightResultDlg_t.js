require('./tqFightResultDlg_data_t.js');
requireEx('./handler/tqFightResultDlg.js', [
	{
		start:'//FightResultDlg-unittest-start'
		,end:'//FightResultDlg-unittest-end'
		,items:['m_fightResultPanel'
			,'m_dlg'
			,'m_roundShowPanel'
			,'m_hideCaller'
			,'_initDlg'
			,'_setTabs'
			,'_createPanels'
			,'_onDlgEvent'
		]
	}
	,{
		start:'//FightResultTabPanel-unittest-start'
		,end:'//FightResultTabPanel-unittest-end'
		,items:['m_resultTab'
			,'m_fightResultMaker'
			,'_getCampGetter'
			,'_setRoleInfos'
			,'_setFightResultImg'
			,'_setGetOrLostResPanelTitle'
			,'_setHerosInfos'
			,'_getAddAttrTitleString'
			,'_setHeroInfos'
			,'_setCityDefExpend'
			,'_setGetOrLostResPanel'
		]
	}
	,{
		start:'//FightRoundShowTabPanel-unittest-start'
		,end:'//FightRoundShowTabPanel-unittest-end'
		,items:['m_handlers'
			,'m_fightDemo'
			,'m_roundsString'
			,'m_roundShowTab'
			,'m_fightResultMaker'
			,'_regHandlers'
			,'_showResult'
			,'_showActorsDetail'
			,'_handleAction'
			,'_handleRoundAction'
			,'_handleMoveAction'
			,'_handleMissAction'
			,'_handleAttackAction'
			,'_handleBerserkAction'
			,'_handleDieAction'
			,'_handleAddEffectAction'
			,'_handleRemoveEffectAction'
			,'_handleEffectAction'
			,'_getAttrDescByEffect'
			,'_getActorById'
			,'_isMyActor'
		]
	}
]);

TestCaseFightResultDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.militaryHdr = MilitaryHandler.snew(this.g);
		this.dlg = FightResultDlg.snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		if ( this.dlg.isShow() ) this.dlg.closeDlg();
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setHideCaller = function(){
		var caller =  {self:this.dlg, caller:function(){}};
		this.dlg.setHideCaller(caller);
		assertEQ ( this.lc().m_hideCaller, caller );
	};
	
	this.test__initDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.lc().m_dlg = null;
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.mm.mock( this.lc(), '_setTabs' );
		this.mm.mock( this.lc(), '_createPanels' );
		this.mm.mock( g_dlg, 'setCaller' );
		this.mm.mock( g_dlg, 'show' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,setCaller,_setTabs,_createPanels,show' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:true, title:rstr.military.fightresult.title, pos:{x:'center', y:40}}] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
		assertEQ ( this.lc().m_dlg, g_dlg );
		
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'show' );
	};
	
	this.test__onDlgEvent = function(){
		var called = false;
		this.lc().m_hideCaller = {self:this.dlg, caller:function(){
			called = true;
		}};
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( called, true );
		
		called = false;
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE+1);
		assertEQ ( called, false );
		
		this.lc().m_hideCaller = null;
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
	};
	
	this.testTabsList = function(){
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('tabList').getTabCount() == 2 );
		assert ( this.dlg.getCtrl('tabList').getTabText(0) == rstr.military.fightresult.tabs[0]);
		assert ( this.dlg.getCtrl('tabList').getTabText(1) == rstr.military.fightresult.tabs[1]);
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
	
	this.testShowLastFightResult = function(){
		this.g.getImgr().getRoleRes().name = 'target_r';
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:fightdemocmd});
		this.dlg.openDlg();
		
		var armyId = 3;
		var fightId = -1;
		this.dlg.openDlg(armyId, fightId);
		
		var resultTab = this.dlg.getCtrl('tabList').getTabItems(0);
		assert ( isInclude ( IMG.getBKImage(resultTab.attackIcon), '103.gif') == true );
		assert ( TQ.getTextEx(resultTab.attackName) == '70级黄巾叛军' );
		assert ( TQ.getTextEx(resultTab.attackLevel) == '70' );
		assert ( TQ.getTextEx(resultTab.attackAlliance) == '--' );
		
		assert ( isInclude ( IMG.getBKImage(resultTab.targetIcon), '203.gif') == true );
		assert ( TQ.getTextEx(resultTab.targetName) == 'target_r' );
		assert ( TQ.getTextEx(resultTab.targetLevel) == '1' );
		assert ( TQ.getTextEx(resultTab.targetAlliance) == 'hello' );
		
		assert ( isInclude ( IMG.getBKImage(resultTab.fightResult), 'retfail.gif') == true );
		
		assert ( resultTab.attackList.getCount() == 2 );
		var attackListItem = resultTab.attackList.getItem(0);
		assert ( TQ.getTextEx(attackListItem.exsubs.name) == '70级勇士' );
		assert ( TQ.getTextEx(attackListItem.exsubs.level) == '70'  );
		assert ( TQ.getTextEx(attackListItem.exsubs.soldierName) == '4阶刀兵'  );
		assert ( TQ.getTextEx(attackListItem.exsubs.soldierNumber) == '6000'  );
		assert ( TQ.getTextEx(attackListItem.exsubs.lostNumber) == '6' );
		assert ( TQ.getTextEx(attackListItem.exsubs.reviveNumber) == '0' );
		assert ( TQ.getTextEx(resultTab.attackerAddAttrHead) == rstr.military.fightresult.lbl.exp );
		assert ( TQ.getTextEx(attackListItem.exsubs.addAttrNumber) == '1' );
		
		assert ( resultTab.targetList.getCount() == 2 );
		var targetListItem = resultTab.targetList.getItem(0);
		assert ( TQ.getTextEx(targetListItem.exsubs.name) == 'hero1' );
		assert ( TQ.getTextEx(targetListItem.exsubs.level) == '11'  );
		assert ( TQ.getTextEx(targetListItem.exsubs.soldierName) == '10阶刀兵'  );
		assert ( TQ.getTextEx(targetListItem.exsubs.soldierNumber) == '10'  );
		assert ( TQ.getTextEx(targetListItem.exsubs.lostNumber) == '10' );
		assert ( TQ.getTextEx(targetListItem.exsubs.reviveNumber) == '2' );
		assert ( TQ.getTextEx(resultTab.targetAddAttrHead) == rstr.military.fightresult.lbl.credit );
		assert ( TQ.getTextEx(targetListItem.exsubs.addAttrNumber) == '2' );
		
		assert ( TQ.getTextEx(resultTab.targetLostDefRes) == TQ.format(rstr.military.fightresult.lbl.lostCityDefRes, 50, 100, 0, 0, 0));
		assert ( TQ.getTextEx(resultTab.attackResTitle) == rstr.military.fightresult.lbl.attackGetRes );
		assert ( TQ.getTextEx(resultTab.targetResTitle) == rstr.military.fightresult.lbl.targetLostRes );
		assert ( TQ.getTextEx(resultTab.targetRes) == rstr.military.fightresult.lbl.lostRes + '<div class=comm_inlineline_block>' + rstr.comm.food + ' -2</div>, <div class=comm_inlineline_block>' + rstr.comm.wood + ' -1</div><br/>' );
		assert ( TQ.getTextEx(resultTab.attackRes) == rstr.military.fightresult.lbl.getRes + '<div class=comm_inlineline_block>' + rstr.comm.food + ' +2</div>, <div class=comm_inlineline_block>' + rstr.comm.wood + ' +1</div><br/>' + rstr.military.fightresult.lbl.getItems + ItemResUtil.findItemres(FIXID.SALVE).name+rstr.dropdesc.numPrefix+'1, '+ItemResUtil.findItemres(FIXID.CHILINGDAN).name+rstr.dropdesc.numPrefix+'2');
	};
});

TestCaseFightResultPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.militaryHdr = MilitaryHandler.snew(this.g);
		this.dlg = FightResultDlg.snew(this.g);
		this.dlg.openDlg();
		this.fightResultPanel = this.dlg.lc().m_fightResultPanel;
		this.lc = this.fightResultPanel.lc;
	};
	
	this.tearDown = function(){
		if ( this.dlg.isShow() ) this.dlg.closeDlg();
		TestCaseHelper.tearDown(this);
	};
	
	this.testSetGetOrLostResPanel = function(){
		this.lc()._setGetOrLostResPanel('attacker', {gainres:{food:1}, getdrop:[{type:'item',id:FIXID.SALVE,number:1}]} );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackRes) == '获得资源：<div class=comm_inlineline_block>粮食 +1</div>'+'<br/>'+'获得物品：药膏×1' );
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetRes) == '' );
		
		TQ.setHtml(this.lc().m_resultTab.attackRes, '');
		TQ.setHtml(this.lc().m_resultTab.targetRes, '');
		
		this.lc()._setGetOrLostResPanel('defender', {lossres:{food:1}, getdrop:[{type:'item',id:FIXID.SALVE,number:1}]} );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackRes) == '' );
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetRes) == '损失资源：<div class=comm_inlineline_block>粮食 -1</div>'+'<br/>'+'获得物品：药膏×1' );
	};
	
	this.testSetCityDefExpend = function(){
		this.g.getImgr().getRoleRes().name = 'att';
		var fightResult = {result:FIGHT_RESULT.ATTACKSUCC,defenderParty:'def',attacker:{role:{name:'att'},gainres:{honor:5}}, defender:{defexpend:{},role:{name:'def', objType:OBJ_TYPE.ROLE},lossres:{honor:5}}};
		var s = FightResultMaker.snew(this.g).getHonorString(fightResult);
		this.lc()._setCityDefExpend(fightResult);
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetLostDefRes) == s + TQ.format(rstr.military.fightresult.lbl.lostCityDefRes, 0, 0, 0, 0, 0));
		
		fightResult.defender.defexpend = {xianjing:1};
		this.lc()._setCityDefExpend(fightResult);
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetLostDefRes) == s + TQ.format(rstr.military.fightresult.lbl.lostCityDefRes, 1, 0, 0, 0, 0));
		
		fightResult.defender.defexpend = {gunmu:2, juma:3, nujian:5};
		this.lc()._setCityDefExpend(fightResult);
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetLostDefRes) == s + TQ.format(rstr.military.fightresult.lbl.lostCityDefRes, 0, 2, 3, 0, 5));
		
		fightResult.defender.defexpend = {xianjing:1, gunmu:2, juma:3, leishi:4, nujian:5};
		this.lc()._setCityDefExpend(fightResult);
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetLostDefRes) == s + TQ.format(rstr.military.fightresult.lbl.lostCityDefRes, 1, 2, 3, 4, 5));
	};
	
	this.test_setHeroInfos = function(){
		this.lc().m_resultTab.attackList.setItemCount(1);
		var listItem = this.lc().m_resultTab.attackList.getItem(0);
		var hero = {name:"hero1",level:11,soldier:{resid:150001010,number:10,loss:10,revive:2},addExp:0,addCredit:0};
		this.lc()._setHeroInfos(listItem, hero);
		assert ( TQ.getTextEx(listItem.exsubs.name) == 'hero1' );
		assert ( TQ.getTextEx(listItem.exsubs.level) == '11'  );
		assert ( TQ.getTextEx(listItem.exsubs.soldierName) == '10阶刀兵'  );
		assert ( TQ.getTextEx(listItem.exsubs.soldierNumber) == '10'  );
		assert ( TQ.getTextEx(listItem.exsubs.lostNumber) == '10' );
		assert ( TQ.getTextEx(listItem.exsubs.reviveNumber) == '2' );
		assert ( TQ.getTextEx(listItem.exsubs.addAttrNumber) == '0' );
		
		var hero = {name:"hero1",level:11,soldier:{resid:150001010,number:10,loss:10,revive:2},addExp:1,addCredit:0};
		this.lc()._setHeroInfos(listItem, hero);
		assert ( TQ.getTextEx(listItem.exsubs.addAttrNumber) == '1' );
		
		var hero = {name:"hero1",level:11,soldier:{resid:150001010,number:10,loss:10,revive:2},addExp:0,addCredit:2};
		this.lc()._setHeroInfos(listItem, hero);
		assert ( TQ.getTextEx(listItem.exsubs.addAttrNumber) == '2' );
		
		var hero = {name:"hero1",level:11,soldier:{resid:0,number:0,loss:10,revive:2},addExp:0,addCredit:0};
		this.lc()._setHeroInfos(listItem, hero);
		assert ( TQ.getTextEx(listItem.exsubs.soldierName) == '--'  );
		assert ( TQ.getTextEx(listItem.exsubs.soldierNumber) == '0'  );
	};
	
	this.test_getAddAttrTitleString = function(){
		assert ( this.lc()._getAddAttrTitleString({addExp:0, addCredit:0}, 'a') == 'a' );
		assert ( this.lc()._getAddAttrTitleString({addExp:1, addCredit:0}, 'a') == rstr.military.fightresult.lbl.exp );
		assert ( this.lc()._getAddAttrTitleString({addExp:0, addCredit:1}, 'a') == rstr.military.fightresult.lbl.credit );
	};
	
	this.test_setHerosInfos = function(){
		this.lc()._setHerosInfos('attacker', {heros:[{name:"hero1",level:11,soldier:{resid:150001010,number:10,loss:10,revive:2},addExp:0,addCredit:0}]});
		assert ( this.lc().m_resultTab.attackList.getCount() == 1 );
		var listItem = this.lc().m_resultTab.attackList.getItem(0);
		assert ( TQ.getTextEx(listItem.exsubs.name) == 'hero1' );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackerAddAttrHead) == '' );
	};
	
	this.test_setGetOrLostResPanelTitle = function(){
		this.lc()._setGetOrLostResPanelTitle({result:1});
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackResTitle) == rstr.military.fightresult.lbl.attackGetRes );
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetResTitle) == rstr.military.fightresult.lbl.targetLostRes );
		
		this.lc()._setGetOrLostResPanelTitle({result:0});
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackResTitle) == rstr.military.fightresult.lbl.attackLostRes );
		assert ( TQ.getTextEx(this.lc().m_resultTab.targetResTitle) == rstr.military.fightresult.lbl.targetGetRes );
	};
	
	this.test_setFightResultImg = function(){
		var r_isMySucc = [true];
		this.mm.mock(this.lc().m_fightResultMaker, 'isMySucc', r_isMySucc);
		
		var p_fightResult = {name:'result'};
		this.lc()._setFightResultImg(p_fightResult);
		assert ( isInclude ( IMG.getBKImage(this.lc().m_resultTab.fightResult), 'retwin.gif') == true );
		assert ( this.mm.params['isMySucc'], [p_fightResult] );
		
		r_isMySucc[0] = false;
		this.lc()._setFightResultImg(p_fightResult);
		assert ( isInclude ( IMG.getBKImage(this.lc().m_resultTab.fightResult), 'retfail.gif') == true );
	};
	
	this.test_setRoleInfos = function(){
		this.lc()._setRoleInfos('attacker', {role:{icon:101, name:'role', level:1, alli:'alli'}});
		
		assert ( isInclude ( IMG.getBKImage(this.lc().m_resultTab.attackIcon), '101.gif') == true );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackName) == 'role' );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackLevel) == '1' );
		assert ( TQ.getTextEx(this.lc().m_resultTab.attackAlliance) == 'alli' );
	};
	
	this.test_getCampGetter = function(){
		assert ( this.lc()._getCampGetter('attacker') instanceof FRTAttackCampDom );
		assert ( this.lc()._getCampGetter('defender') instanceof FRTTargetCampDom );
	};
});

TestCaseFRTAttackAndTargetCampDom = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		
		var dlg = FightResultDlg.snew(this.g);
		dlg.openDlg();
		var fightResultPanel = dlg.lc().m_fightResultPanel;
		this.resultTab = fightResultPanel.lc().m_resultTab;
		this.attackCamp = FRTAttackCampDom.snew(this.resultTab);
		this.targetCamp = FRTTargetCampDom.snew(this.resultTab);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.testGetRoleInfoDoms = function(){
		assert ( this.attackCamp.getRoleInfoDoms().icon == this.resultTab.attackIcon );
		assert ( this.attackCamp.getRoleInfoDoms().name == this.resultTab.attackName );
		assert ( this.attackCamp.getRoleInfoDoms().level == this.resultTab.attackLevel );
		assert ( this.attackCamp.getRoleInfoDoms().alliance == this.resultTab.attackAlliance );
		
		assert ( this.targetCamp.getRoleInfoDoms().icon == this.resultTab.targetIcon );
		assert ( this.targetCamp.getRoleInfoDoms().name == this.resultTab.targetName );
		assert ( this.targetCamp.getRoleInfoDoms().level == this.resultTab.targetLevel );
		assert ( this.targetCamp.getRoleInfoDoms().alliance == this.resultTab.targetAlliance );
	};
	
	this.testGetHeroList = function(){
		assert ( this.attackCamp.getHeroList() == this.resultTab.attackList );
		assert ( this.targetCamp.getHeroList() == this.resultTab.targetList );
	};
	
	this.testGetHeroListAddAttrTitle = function(){
		assert ( this.attackCamp.getHeroListAddAttrTitle() == this.resultTab.attackerAddAttrHead );
		assert ( this.targetCamp.getHeroListAddAttrTitle() == this.resultTab.targetAddAttrHead );
	};
	
	this.testGetResPanel = function(){
		assert ( this.attackCamp.getResPanel() == this.resultTab.attackRes );
		assert ( this.targetCamp.getResPanel() == this.resultTab.targetRes );
	};
});

TestCaseFightRoundShowTabPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.militaryHdr = MilitaryHandler.snew(this.g);
		this.dlg = FightResultDlg.snew(this.g);
		this.dlg.openDlg();
		this.roundShowPanel = this.dlg.lc().m_roundShowPanel;
		this.lc = this.roundShowPanel.lc;
		
		var fightDemo = {
			attacker:{actors:[{type:3,name:"ahero",detail:{attrs:{'53':10000,'55':100}},resid:150001,id:1,pos:{y:1,x:2}}],role:{name:"attacker",objType:5}},
			defender:{actors:[
					{type:ACTOR_TYPE.SOLDIER,name:"dhero",detail:{attrs:{'53':20000,'55':500}},resid:150001,id:2,pos:{y:1,x:37}}
					,{type:ACTOR_TYPE.HERO,name:"dhero2",detail:{attrs:{'53':20000,'55':500}},resid:150001,id:3,pos:{y:1,x:38}}
					,{type:ACTOR_TYPE.WALL,name:"wall",detail:{attrs:{'53':20000,'55':500}},resid:150001,id:4,pos:{y:1,x:39}}
					],role:{name:"defender",objType:1}},rounds:[], 
			myIsAttacker:true
		};
		this.lc().m_fightDemo=fightDemo;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_regHandlers = function(){
		this.lc()._regHandlers();
		assert ( this.lc().m_handlers['round'] == this.lc()._handleRoundAction );
		assert ( this.lc().m_handlers['move'] == this.lc()._handleMoveAction );
		assert ( this.lc().m_handlers['miss'] == this.lc()._handleMissAction );
		assert ( this.lc().m_handlers['attack'] == this.lc()._handleAttackAction );
		assert ( this.lc().m_handlers['berserk'] == this.lc()._handleBerserkAction );
		assert ( this.lc().m_handlers['die'] == this.lc()._handleDieAction );
		assert ( this.lc().m_handlers['addeff'] == this.lc()._handleAddEffectAction );
		assert ( this.lc().m_handlers['removeeff'] == this.lc()._handleRemoveEffectAction );
		assert ( this.lc().m_handlers['effect'] == this.lc()._handleEffectAction );
	};
	
	this.test_getActorById = function(){
		assert ( this.lc()._getActorById(1).id == 1 );
		assert ( this.lc()._getActorById(1).camp == 'attacker' );
		assert ( this.lc()._getActorById(1).fordesc.hp == 10000);
		assert ( this.lc()._getActorById(1).fordesc.mhp == 10000);
		assert ( this.lc()._getActorById(1).fordesc.uhp == 100);
		assert ( this.lc()._getActorById(1).fordesc.facthp == 100);
		
		assert ( this.lc()._getActorById(2).id == 2 );
		assert ( this.lc()._getActorById(2).camp == 'defender' );
		assert ( this.lc()._getActorById(2).fordesc.hp == 20000);
		assert ( this.lc()._getActorById(2).fordesc.mhp == 20000);
		assert ( this.lc()._getActorById(2).fordesc.uhp == 500);		
		assert ( this.lc()._getActorById(2).fordesc.facthp == 40);
	};
	
	this.test_isMyActor = function(){
		assert ( this.lc()._isMyActor( this.lc()._getActorById(1) ) == true );
		assert ( this.lc()._isMyActor( this.lc()._getActorById(2) ) == false );
		
		//--
		var fightDemo = {
			attacker:{actors:[{type:3,name:"ahero",resid:150001,id:1,pos:{y:1,x:2}}],role:{name:"attacker",objType:5}},
			defender:{actors:[{type:3,name:"dhero",resid:150001,id:2,pos:{y:1,x:37}}],role:{name:"defender",objType:1}},
			myIsAttacker:false
		};
		this.lc().m_fightDemo=fightDemo;
		assert ( this.lc()._isMyActor( this.lc()._getActorById(1) ) == false );
		assert ( this.lc()._isMyActor( this.lc()._getActorById(2) ) == true );
	};
	
	this.test_handleAction = function(){
		var methodMock = MethodMock.snew();
		methodMock.mock(this.lc().m_handlers, 'round', function(){methodMock.walkLog = 'handleRoundAction' });
		this.lc()._handleAction({event:'round'});
		methodMock.restore();
		assert ( methodMock.walkLog == 'handleRoundAction' );
		
		this.lc()._handleAction({event:'no'});
	};
	
	this.test_handleRoundAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleRoundAction({event:"round",round:2});
		assert ( this.lc().m_roundsString == 'last action<br/><b><font color=#f0f000>第2回合</font></b><br/>' );
	};
	
	this.test_handleMoveAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleMoveAction({id:1,event:"move",paths:[{y:1,x:34}]});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]向敌方移动</font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleMoveAction({id:2,event:"move",paths:[{y:1,x:34}]});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]向我方移动</font><br/>' );
	};
	
	this.test_handleMissAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleMissAction({userid:1, targetid:2, event:"miss"});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]攻击敌方[dhero]<b>未击中</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleMissAction({userid:2, targetid:1, event:"miss"});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]攻击我方[ahero]<b>未击中</b></font><br/>' );
	};
	
	this.test_handleAttackAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:1,targetid:2,event:"attack",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]攻击敌方[dhero]，敌方损兵<b>3</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:2,targetid:1,event:"attack",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]攻击我方[ahero]，我方损兵<b>11</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:2,targetid:1,event:"attack",val:8000});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]攻击我方[ahero]，我方损兵<b>80</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:2,targetid:1,event:"attack",val:2000});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]攻击我方[ahero]，我方损兵<b>9</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:2,targetid:1,event:"attack",val:1000});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]攻击我方[ahero]，我方损兵<b>0</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:1,targetid:3,event:"attack",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]攻击敌方[dhero2]，敌方减血<b>3</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAttackAction({userid:1,targetid:4,event:"attack",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]攻击敌方[wall]，敌方减血<b>3</b></font><br/>' );
		
	};
	
	this.test_handleBerserkAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleBerserkAction({userid:1,targetid:2,event:"berserk",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]<b>会心一击</b>敌方[dhero]，敌方损兵<b>3</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleBerserkAction({userid:2,targetid:1,event:"berserk",val:1100});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]<b>会心一击</b>我方[ahero]，我方损兵<b>11</b></font><br/>' );
	};
	
	this.test_handleDieAction = function(){
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleDieAction({event:"die",id:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　我方[ahero]<b>死亡</b></font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleDieAction({event:"die",id:2});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　敌方[dhero]<b>死亡</b></font><br/>' );
	};
	
	this.test_handleAddEffectAction = function() {
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAddEffectAction({event:'addeff', id:1, effid:RES_EFF.F_XINGYUN, effuid:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]增加了[幸运效果]</font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleAddEffectAction({event:'addeff', id:2, effid:RES_EFF.F_XINGYUN, effuid:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]增加了[幸运效果]</font><br/>' );
	};
	
	this.test_handleRemoveEffectAction = function() {
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleRemoveEffectAction({event:'removeeff', id:1, effid:RES_EFF.F_XINGYUN, effuid:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]的[幸运效果]消失</font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleRemoveEffectAction({event:'removeeff', id:2, effid:RES_EFF.F_XINGYUN, effuid:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]的[幸运效果]消失</font><br/>' );
	};
	
	this.test_getAttrDescByEffect = function(){
		var action = {attr:ATTR.ES, val:1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '增加1点闪避' );
		var action = {attr:ATTR.ES, val:-1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '减少1点闪避' );
		
		var action = {attr:ATTR.DE, val:1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '增加1点防御' );
		var action = {attr:ATTR.DE, val:-1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '减少1点防御' );
		
		var action = {attr:ATTR.PS, val:1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '增加1点精力' );
		var action = {attr:ATTR.PS, val:-1, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '减少1点精力' );
		
		var action = {attr:ATTR.HP, val:1000, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '恢复兵力0' );
		
		var action = {attr:ATTR.HP, val:-1000, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '损兵2' );
		
		var action = {attr:ATTR.HP, val:1000, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(0, action) == '损兵2' );
		
		var action = {attr:ATTR.HP, val:800, targetid:2};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '恢复兵力2' );
		
		var action = {attr:ATTR.HP, val:-1000, targetid:3};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '减血2' );
		
		var action = {attr:ATTR.HP, val:1000, targetid:3};
		assert ( this.lc()._getAttrDescByEffect(1, action) == '加血2' );
	};
	
	this.test_handleEffectAction = function() {
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleEffectAction({event:'effect', userid:1, targetid:1, effid:RES_EFF.F_XINGYUN, attr:ATTR.ES, val:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]的[幸运效果]增加1点闪避</font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleEffectAction({event:'effect', userid:1, targetid:2, effid:RES_EFF.F_XINGYUN, attr:ATTR.ES, val:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#30ff30>　我方[ahero]施加到[dhero]的[幸运效果]增加1点闪避</font><br/>' );		
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleEffectAction({event:'effect', userid:2, targetid:2, effid:RES_EFF.F_XINGYUN, attr:ATTR.ES, val:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]的[幸运效果]增加1点闪避</font><br/>' );
		
		this.lc().m_roundsString='last action<br/>';
		this.lc()._handleEffectAction({event:'effect', userid:2, targetid:1, effid:RES_EFF.F_XINGYUN, attr:ATTR.ES, val:1});
		assert ( this.lc().m_roundsString == 'last action<br/><font color=#ff3000>　敌方[dhero]施加到[ahero]的[幸运效果]增加1点闪避</font><br/>' );		
	};
	
	this.testUpdateFightActions = function() {
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:fightdemocmd});
		
		var armyId = 3;
		var fightId = -1;
		this.roundShowPanel.updateFightActions( this.g.getImgr().getFightDemoRounds(armyId, fightId) );
		assert ( TQ.getTextEx(this.lc().m_roundShowTab.rounds.getContainerObj()) == this.lc().m_roundsString );
		assert ( isInclude(this.lc().m_roundsString, '第1回合', '第29回合') == true );
	};
	
	this.test_updateFightActionsInitForDescAttr = function(){
		this.lc()._getActorById(1).fordesc.facthp = 80;
		assert ( this.lc()._getActorById(1).fordesc.facthp == 80);
		this.roundShowPanel.updateFightActions(this.lc().m_fightDemo);
		assert ( this.lc()._getActorById(1).fordesc.facthp == 100);
	};
	
	
	this.test_showResult = function() {
		this.mm.mock(this.lc().m_fightResultMaker, 'getResultTitle', ['resultTitle']);
		this.lc().m_roundsString='';
		this.lc()._showResult();
		assertEQ ( this.lc().m_roundsString, 'resultTitle' + rstr.military.fightresult.actions.roundDetail );
	};
	
	this.test_showActorsDetail = function() {
		var _IS_DEBUG = IS_DEBUG;
		IS_DEBUG = true;
		var fightDemo = {
			attacker:{actors:[{type:ACTOR_TYPE.WALL,name:"城墙",detail:{attrs:{"37":10,"54":100,"53":100},isCanDodge:0,attackSpeed:0,attackRange:0}}]},
			defender:{actors:[{type:ACTOR_TYPE.WALL,name:"城墙",detail:{attrs:{"37":20,"54":300,"53":200},isCanDodge:0,attackSpeed:0,attackRange:0}}]},
		};
		this.lc().m_fightDemo=fightDemo;
		this.lc().m_roundsString='a';
		this.lc()._showActorsDetail();
		assert ( this.lc().m_roundsString == 'a'
			+'攻方[城墙] 血量:100,最大血量:100,防御:10,攻击速度:0,攻击范围:0<br/>'
			+'守方[城墙] 血量:200,最大血量:300,防御:20,攻击速度:0,攻击范围:0<br/>'
		);
		
		//--
		var fightDemo = {
			attacker:{actors:[{type:ACTOR_TYPE.HERO,name:"HERO1",detail:{attrs:{"36":1,"37":2,"53":3,"40":4,"35":5,"39":6},isCanDodge:0,attackSpeed:2012,attackRange:4294967295}}]},
			defender:{actors:[{type:ACTOR_TYPE.HERO,name:"HERO2",detail:{attrs:{"36":7,"37":8,"53":9,"40":10,"35":11,"39":12},isCanDodge:0,attackSpeed:2013,attackRange:4294967295}}]},
		};
		this.lc().m_fightDemo=fightDemo;
		this.lc().m_roundsString='a';
		this.lc()._showActorsDetail();
		assert ( this.lc().m_roundsString == 'a'
			+'攻方[HERO1] 血量:3,命中:5,伤害:1,防御:2,闪避:6,会心:4,攻击速度:2012,攻击范围:4294967295<br/>'
			+'守方[HERO2] 血量:9,命中:11,伤害:7,防御:8,闪避:12,会心:10,攻击速度:2013,攻击范围:4294967295<br/>'
		);
		
		//--
		var fightDemo = {
			attacker:{actors:[{type:ACTOR_TYPE.SOLDIER,name:"SOLDIER1",detail:{attrs:{"36":1,"37":2,"53":3,"40":4,"35":5,"39":6,"55":100},isCanDodge:0,attackSpeed:2012,attackRange:300}}]},
			defender:{actors:[{type:ACTOR_TYPE.SOLDIER,name:"SOLDIER2",detail:{attrs:{"36":7,"37":8,"53":9,"40":10,"35":11,"39":12,"55":200},isCanDodge:0,attackSpeed:2013,attackRange:400}}]},
		};
		this.lc().m_fightDemo=fightDemo;
		this.lc().m_roundsString='a';
		this.lc()._showActorsDetail();
		assert ( this.lc().m_roundsString == 'a'
			+'攻方[SOLDIER1] 血量:3,命中:5,伤害:1,防御:2,闪避:6,会心:4,单位生命:100,攻击速度:2012,攻击范围:300<br/>'
			+'守方[SOLDIER2] 血量:9,命中:11,伤害:7,防御:8,闪避:12,会心:10,单位生命:200,攻击速度:2013,攻击范围:400<br/>'
		);
		
		//--
		var fightDemo = {
			attacker:{actors:[{type:ACTOR_TYPE.DEF,name:"CITYDEF1",detail:{attrs:{"36":5000},unitNumber:10,isCanDodge:0,attackSpeed:2012,attackRange:300}}]},
			defender:{actors:[{type:ACTOR_TYPE.DEF,name:"CITYDEF2",detail:{attrs:{"36":6000},unitNumber:20,isCanDodge:0,attackSpeed:2013,attackRange:400}}]},
		};
		this.lc().m_fightDemo=fightDemo;
		this.lc().m_roundsString='a';
		this.lc()._showActorsDetail();
		assert ( this.lc().m_roundsString == 'a'
			+'攻方[CITYDEF1] 伤害:5000,单位数量:10,攻击速度:2012,攻击范围:300<br/>'
			+'守方[CITYDEF2] 伤害:6000,单位数量:20,攻击速度:2013,攻击范围:400<br/>'
		);
		
		IS_DEBUG = _IS_DEBUG;
	};
});

tqFightResultDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseFightResultDlg, 'TestCaseFightResultDlg');
	suite.addTestCase(TestCaseFightResultPanel, 'TestCaseFightResultPanel');
	suite.addTestCase(TestCaseFRTAttackAndTargetCampDom, 'TestCaseFRTAttackAndTargetCampDom');
	suite.addTestCase(TestCaseFightRoundShowTabPanel, 'TestCaseFightRoundShowTabPanel');
};