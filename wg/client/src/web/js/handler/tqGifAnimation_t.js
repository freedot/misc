/*******************************************************************************/
requireEx('./handler/tqGifAnimation.js', [
	{
		start:'//EffectContainer-unittest-start'
		,end:'//EffectContainer-unittest-end'
		,items:[
			'm_effects'
		]
	}
	,{
		start:'//Actor-unittest-start'
		,end:'//Actor-unittest-end'
		,items:[
			'm_parent'
			,'m_this'
			,'m_g'
			,'m_anim'
			,'m_type'
			,'m_resId'
			,'m_actionId'
			,'m_state'
			,'m_dir'
			,'m_pos'
			,'m_avatarRes'
			,'m_actionName'
			,'m_actionRes'
			,'m_effectContainer'
			,'m_hpbar'
			,'m_observer'
			,'C_BASE_Z'
			,'C_HPBAR_OFFSET_Z'
			,'_loadAvatar'
			,'_createHPBar'
			,'_updateAvatarPos'
			,'_isInited'
		]
	}
	,{
		start:'//ActorManager-unittest-start'
		,end:'//ActorManager-unittest-end'
		,items:[
			'm_actors'
			,'_findActorPos'
		]
	}
	,{
		start:'//FightMapDlg-unittest-start'
		,end:'//FightMapDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_showFight'
			,'m_sizer'
			,'_initDlg'
			,'_showDlg'
			,'_initInfo'
			,'_onDlgEvent'
			,'_onUpdate'
			,'_createDlg'
			,'_createRoleItemsByTmpl'
			,'_createShowFight'
			,'_setCaller'
		]
	}
	,{
		start:'//FightMapDlgSizer-unittest-start'
		,end:'//FightMapDlgSizer-unittest-end'
		,items:[
			'm_dlg'
			,'m_items'
			,'C_HEROLIST_H'
			,'C_HEROLIST_W'
			,'m_size'
			,'_setParams'
			,'_resizeDlg'
			,'_resetMapDomPosition'
			,'_resetRoleInfoPosition'
			,'_resetHPProgBarPosition'
			,'_resetHeroListPosition'
			,'_resetDefBarPosition'
			,'_resetWallBarPosition'
			,'_resetAttackerHeroListPosition'
			,'_resetDefenderHeroListPosition'
			,'_resetSkipBtnPosition'
		]
	}
	,{
		start:'//ShowFight-unittest-start'
		,end:'//ShowFight-unittest-end'
		,items:[
			'm_g'
			,'m_dlg'
			,'m_items'
			,'m_showRounds'
			,'m_showFightResult'
			,'m_subShowFight'
			,'m_fightDemo'
			,'_setHeadPartyInfo'
			,'_updateHerosInfo'
			,'_updateWallsInfo'
			,'_updateDefsInfo'
			,'_createActors'
			,'_getWallActor'
			,'_hasWallActor'
			,'_collectDefActors'
			,'_createSubShowFight'
			,'_initFight'
			,'_loadMap'		
			,'_onActorHPChange'			
			,'_setHPProgBarMaxVal'
			,'_updateHPProgBar'
			,'_calcActorsMaxHP'
			,'_calcActorsHP'
		]
	}
	,{
		start:'//ShowRounds-unittest-start'
		,end:'//ShowRounds-unittest-end'
		,items:[
			'm_rounds'
			,'m_mapOffsetPos'
			,'m_gridPixel'
			,'_isAllRoundsEnd'
			,'_isCurRoundEnd'
			,'_popRound'
			,'_getCurRound'
			,'_updateRound'
			,'_removeDeletedActions'
			,'_getStateType'
			,'_convertMoveActionPaths'
			,'_updateEffectEvent'
			,'_updateAddEffectEvent'
			,'_updateRemoveEffectEvent'
			,'_updateStateEvent'
			,'_resetWallActorAction'
		]
	}
	,{
		start:'//ShowFightResult-unittest-start'
		,end:'//ShowFightResult-unittest-end'
		,items:[
			'C_RESULT_WIN_ANIMID'
			,'C_RESULT_FAIL_ANIMID'
			,'C_RESULT_ZINDEX'
			,'m_g'
			,'m_dlg'
			,'m_items'
			,'m_resultAnim'
			,'m_armyId'
			,'m_fightId'
			,'_isResultUIShow'
			,'_showResultUI'
			,'_startResultEffect'
			,'_getResultAnimPos'
			,'_hideFightMapDlg'
		]
	}
]);
	
TestEffectContainer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew();
		this.container = EffectContainer.snew();
		this.lc = this.container.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_add = function(){
		var effect = ActorEffect.snew(); effect.setId(1);
		this.container.add(effect);
		assertEQ ( this.lc().m_effects, [effect] );
	};
	
	this.test_remove = function(){
		var effect1 = ActorAnimEffect.snew(this.g, this.parent, 0); effect1.setId(1);
		var effect2 = ActorAnimEffect.snew(this.g, this.parent, 0); effect2.setId(2);
		this.mm.mock(effect1, 'destory:destory1');
		this.mm.mock(effect2, 'destory:destory2');
		this.container.add(effect1);
		this.container.add(effect2);
		this.container.remove(1);
		assertEQ ( this.lc().m_effects, [effect2] );
		assertEQ ( this.mm.params['destory1'], [] );
		this.container.remove(3);
		assertEQ ( this.lc().m_effects, [effect2] );
		this.container.remove(2);
		assertEQ ( this.mm.params['destory2'], [] );
		assertEQ ( this.lc().m_effects, [] );
	};
	
	this.test_update = function(){
		var effect1 = ActorAnimEffect.snew(this.g, this.parent, 0); effect1.setId(1);
		var effect2 = ActorAnimEffect.snew(this.g, this.parent, 0); effect2.setId(2);
		this.container.add(effect1);
		this.container.add(effect2);
		this.mm.mock(effect1, 'setZIndex');
		this.mm.mock(effect1, 'setPosition');
		this.mm.mock(effect1, 'play');
		this.mm.mock(effect2, 'setZIndex');
		this.mm.mock(effect2, 'setPosition');
		this.mm.mock(effect2, 'play');
		
		var zIndex = 1;
		var pos = {x:1, y:2};
		this.container.update(zIndex, pos);
		assertEQ ( this.mm.walkLog, 'setZIndex,setPosition,play,setZIndex,setPosition,play' );
		assertEQ ( this.mm.params['setZIndex.0'], [zIndex] );
		assertEQ ( this.mm.params['setZIndex.1'], [zIndex] );
		assertEQ ( this.mm.params['setPosition.0'], [pos] );
		assertEQ ( this.mm.params['setPosition.1'], [pos] );
	};
});

TestNullProgressBar = TestCase.extern(function(){
	this.test_all_interface = function(){
		var bar = NullProgressBar.snew();
		bar.setPos({x:1, y:2});
		bar.setZOrder(1);
		bar.setVal(1);
		assertEQ ( bar.getVal(), 1 );
		bar.setMaxVal(2);
		assertEQ ( bar.getMaxVal(), 2 );
	};
});

TestCaseActor = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		log = function(){};
			
		this.actor = Actor.snew(this.g); this.actor.setId(1);
		this.lc = this.actor.lc;
		
		res_avatarclts = [{id:10000, 'stand':{id:0, dir:[0,1,2,3]}}];
		
		res_animations = [
			{id:1000101, path:'avatar/1000100/', frameSize:{cx:100, cy:200}, center:{x:1, y:2}, playTimes:2, frameCount:5, frameInterval:10}
			,{id:2000101, path:'avatar/2000100/', frameSize:{cx:100, cy:200}, center:{x:1, y:2}, playTimes:2, frameCount:5, frameInterval:10}
		];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.actor );
	};
	
	this.test_setParent = function(){
		var parentDom = MockDomEx.snew('div');
		this.actor.setParent(parentDom);
		assertEQ ( this.actor.getParent(), parentDom );
	};
	
	this.test_getParent = function(){
		this.test_setParent();
	};
	
	this.test_setId = function(){
		this.actor.setId(1);
		assertEQ ( this.actor.getId(), 1 );
	};
	
	this.test_getEffectContainer = function(){
		assertEQ ( this.actor.getEffectContainer() instanceof EffectContainer, true );
	};
	
	this.test_setType = function(){
		this.actor.setType(1);
		assertEQ ( this.actor.getType(), 1 );
	};
	
	this.test_getType = function(){
		this.test_setType();
	};
	
	this.test_setCampName = function(){
		this.actor.setCampName('attacker');
		assertEQ ( this.actor.getCampName(), 'attacker' );
	};
	
	this.test_setIcon = function(){
		this.actor.setIcon(1);
		assertEQ ( this.actor.getIcon(), 1);
	};
	
	this.test_isHero = function(){
		this.actor.setType(ACTOR_TYPE.SOLDIER );
		assertEQ ( this.actor.isHero(), false );
		this.actor.setType(ACTOR_TYPE.HERO );
		assertEQ ( this.actor.isHero(), true );
	};
	
	this.test_setResId = function(){
		this.actor.setResId(10000);
		assertEQ ( this.actor.getResId(),  10000 );
	};
	
	this.test_setPosition = function(){
		this.mm.mock(this.lc(), '_updateAvatarPos');
		this.actor.setPosition({x:1, y:2});
		assertEQ ( this.actor.getPosition(), {x:1, y:2});
		assertEQ ( this.mm.walkLog, '_updateAvatarPos' );
	};
	
	this.test_getPosition = function(){
		this.actor.setPosition({x:1, y:2});
		assertEQ ( this.actor.getPosition(), {x:1, y:2});
		this.actor.setPosition({x:2, y:3});
		assertEQ ( this.actor.getPosition(), {x:2, y:3});
	};
	
	this.test_getZIndex = function(){
		this.actor.setPosition({x:1, y:2});
		assertEQ ( this.actor.getZIndex(), 2 + this.lc().C_BASE_Z );
	};
	
	this.test_setDirection = function(){
		this.mm.mock(this.lc(), '_loadAvatar');
		this.actor.setDirection(1);
		assertEQ ( this.actor.getDirection(), 1 );
		assertEQ ( this.mm.walkLog, '_loadAvatar' );
	};
	
	this.test_getDirection = function(){
		this.actor.setDirection(1);
		assertEQ ( this.actor.getDirection(), 1 );
		this.actor.setDirection(2);
		assertEQ ( this.actor.getDirection(), 2 );
	};
	
	this.test_setAction = function(){
		this.mm.mock(this.lc(), '_loadAvatar');
		this.actor.setAction('prepare');
		assertEQ ( this.lc().m_actionId, ACTOR_ACTS_NAMEID['prepare'] );
		assertEQ ( this.mm.walkLog, '_loadAvatar' );
	};
	
	this.test_setState = function(){
		this.mm.mock(this.lc().m_state, 'end');
		var state = MoveState.snew(this.actor);
		this.actor.setState(state);
		assertEQ ( this.lc().m_state, state );
		assertEQ ( this.mm.walkLog, 'end' );
	};
	
	this.test_getAnim = function(){
		assertEQ ( this.actor.getAnim() instanceof NullPngAnim, true );
	};
	
	this.test_setObserver = function(){
		this.actor.setObserver(this.test_setObserver);
		assertEQ ( this.lc().m_observer, this.test_setObserver);
	};
	
	this.test_isIdle = function(){
		this.actor.setState(NullState);
		assertEQ ( this.actor.isIdle(), true );
		
		var state = MoveState.snew(this.actor);
		this.actor.setState(state);
		assertEQ ( this.actor.isIdle(), false );
	};
	
	this.test_setHP = function(){
		this.actor.setHP(100, 90);
		assertEQ ( this.actor.getMaxHP(), 100 );
		assertEQ ( this.actor.getHP(), 90 );
	};
	
	this.test_setUnitHP = function(){
		assertEQ ( this.actor.getUnitHP(), 1);
		this.actor.setUnitHP(2);
		assertEQ ( this.actor.getUnitHP(), 2);
	};
	
	this.test_subHP = function(){
		var _ob_params = {id:0, type:'', val:0};
		var _ob = function(id, type, val){
			_ob_params = {id:id, type:type, val:val};
		};
		this.actor.setObserver(_ob);
			
		this.actor.setHP(100, 100);
		this.actor.subHP(20);
		assertEQ ( this.lc().m_hpbar.getVal(), 80 );
		assertEQ ( _ob_params, {id:this.actor.getId(), type:'subhp', val:20} );
		
		_ob_params = {id:0, type:'', val:0};
		this.actor.subHP(-1);
		assertEQ ( this.lc().m_hpbar.getVal(), 80 );
		assertEQ ( _ob_params, {id:0, type:'', val:0} );
		
		_ob_params = {id:0, type:'', val:0};
		this.actor.subHP(81);
		assertEQ ( this.lc().m_hpbar.getVal(), 0 );
		assertEQ ( _ob_params, {id:this.actor.getId(), type:'subhp', val:80} );
	};
	
	this.test_addHP = function(){
		var _ob_params = {id:0, type:'', val:0};
		var _ob = function(id, type, val){
			_ob_params = {id:id, type:type, val:val};
		};
		this.actor.setObserver(_ob);
		
		this.actor.setHP(100, 100);
		this.actor.subHP(20);
		assertEQ ( this.lc().m_hpbar.getVal(), 80 );
		
		this.actor.addHP(10);
		assertEQ ( this.lc().m_hpbar.getVal(), 90 );
		assertEQ ( _ob_params, {id:this.actor.getId(), type:'addhp', val:10} );
		
		_ob_params = {id:0, type:'', val:0};
		this.actor.addHP(-1);
		assertEQ ( this.lc().m_hpbar.getVal(), 90 );
		assertEQ ( _ob_params, {id:0, type:'', val:0} );
		
		_ob_params = {id:0, type:'', val:0};
		this.actor.addHP(11);
		assertEQ ( this.lc().m_hpbar.getVal(), 100 );
		assertEQ ( _ob_params, {id:this.actor.getId(), type:'addhp', val:10} );
	};
	
	this.test_die = function(){
		var _ob_params = {id:0, type:''};
		var _ob = function(id, type){
			_ob_params = {id:id, type:type};
		};
		this.actor.setObserver(_ob);
		this.actor.die();
		assertEQ ( _ob_params, {id:this.actor.getId(), type:'die'} );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateAvatarPos');
		this.mm.mock(this.lc().m_state, 'update');
		this.actor.update(1);
		assertEQ ( this.mm.walkLog, '_updateAvatarPos,update' );
	};	
	
	this.test_destory = function(){
		this.lc().m_hpbar = NullProgressBar.snew();
		this.mm.mock(this.lc().m_state, 'end');
		this.mm.mock(this.lc().m_anim, 'stop');
		this.mm.mock(this.g.getEntityfactory(), 'freePBar');
		this.actor.destory();
		assertEQ ( this.mm.walkLog, 'end,stop' );
		
		this.mm.clear();
		this.lc().m_hpbar = {name:'hpbar'};
		this.actor.destory();
		assertEQ ( this.mm.walkLog, 'freePBar,end,stop' );
		assertEQ ( this.mm.params['freePBar'], [{name:'hpbar'}] );
		assertEQ ( this.lc().m_hpbar instanceof NullProgressBar, true );
	};
	
	this.test__loadAvatar = function(){
		var resId1 = 100*10000 + 1*100 + 1;
		var anim1 = this.g.getAnimMgr().alloc(resId1);
		var resId2 = 200*10000 + 1*100 + 1;
		var anim2 = this.g.getAnimMgr().alloc(resId2);
		
		this.mm.mock(this.g.getAnimMgr(), 'allocAvatar', null, function(resid, parent){
			if (resid == 100 ) return anim1;
			if (resid == 200 ) return anim2;
		});
		this.mm.mock(anim1, 'play');
		this.mm.mock(anim2, 'play');
		this.mm.mock(anim2, 'setPosition');
		this.mm.mock(this.lc(), '_createHPBar');

		this.lc()._loadAvatar();
		assertEQ ( this.mm.walkLog, '' );
		
		this.actor.setType(ACTOR_TYPE.SOLDIER);
		this.actor.setResId(100);
		this.actor.setAction('stand');
		this.actor.setDirection(1);
		this.actor.setParent(MockDomEx.snew('div'));

		this.mm.clear();
		this.lc()._loadAvatar();
		assertEQ ( this.mm.walkLog, '_createHPBar,allocAvatar,play' );
		
		//m_resId, m_dir, m_actionId
		assertEQ ( this.mm.params['allocAvatar'], [100, 1, 1, this.lc().m_parent] );
		assertEQ ( this.lc().m_anim, anim1 );
		
		this.mm.mock(this.lc().m_anim, 'stop');
		
		this.mm.clear();
		this.lc()._loadAvatar();
		assertEQ ( this.mm.walkLog, '_createHPBar' );
		
		this.lc().m_pos = {x:1, y:2};
		this.mm.clear();
		this.actor.setResId(200);
		this.lc()._loadAvatar();
		assertEQ ( this.mm.walkLog, '_createHPBar,stop,allocAvatar,setPosition,play' );
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}] );
		assertEQ ( this.lc().m_anim.getId(), resId2 );
	};
	
	this.test__updateAvatarPos = function(){
		this.lc()._updateAvatarPos();
		
		this.actor.setResId(100);
		this.actor.setAction('stand');
		this.actor.setDirection(1);
		this.actor.setParent(MockDomEx.snew('div'));
		
		this.lc().m_hpbar = this.g.getEntityfactory().allocPBar(MockDomEx.snew());
		
		this.mm.mock(this.lc().m_anim, 'setPosition' );
		this.mm.mock(this.lc().m_anim, 'setZIndex' );
		this.mm.mock(this.lc().m_effectContainer, 'update' );
		this.mm.mock(this.lc().m_hpbar, 'setPos' );
		this.mm.mock(this.lc().m_hpbar, 'setZOrder' );
		
		this.actor.setPosition({x:1000, y:2000});
		this.mm.clear();
		
		this.lc()._updateAvatarPos();
		assertEQ ( this.mm.params['setPosition'], [{x:1000, y:2000}] );
		assertEQ ( this.mm.params['setZIndex'], [this.lc().C_BASE_Z + 2000] );
		assertEQ ( this.mm.params['update'], [this.lc().C_BASE_Z + 2000, {x:1000, y:2000}] );
		assertEQ ( this.mm.params['setPos'], [{x:1000-22.5, y:2000-60}] );
		assertEQ ( this.mm.params['setZOrder'], [this.lc().C_BASE_Z + 2000 + this.lc().C_HPBAR_OFFSET_Z] );
	};
	
	this.test__isInited = function(){
		assertEQ ( this.lc()._isInited(), false );
		this.actor.setResId(100);
		assertEQ ( this.lc()._isInited(), false );
		this.actor.setAction('stand');
		assertEQ ( this.lc()._isInited(), false );
		this.actor.setDirection(1);
		assertEQ ( this.lc()._isInited(), false );
		this.actor.setParent(MockDomEx.snew('div'));
		assertEQ ( this.lc()._isInited(), true );
	};
	
	this.test__createHPBar = function(){
		this.lc().m_hpbar.setMaxVal(200);
		this.lc().m_hpbar.setVal(100);
		
		var parent = MockDomEx.snew();
		this.actor.setParent(parent);
		
		var hpBar = this.g.getEntityfactory().allocPBar(parent);
		this.mm.mock(this.g.getEntityfactory(), 'allocPBar', [hpBar]);
		this.mm.mock(hpBar, 'setSize' );
		this.mm.mock(hpBar, 'setBarBorder' );
		this.mm.mock(hpBar, 'setBarImage' );
		this.mm.mock(hpBar, 'setZOrder' );
		
		this.actor.setType(ACTOR_TYPE.HERO);
		this.lc()._createHPBar();
		assertEQ ( this.mm.walkLog, '' );
		
		this.actor.setType(ACTOR_TYPE.SOLDIER);
		this.lc()._createHPBar();
		assertEQ ( this.mm.walkLog, 'allocPBar,setSize,setBarBorder,setBarImage,setZOrder' );
		assertEQ ( this.mm.params['allocPBar'], [parent] );
		assertEQ ( this.mm.params['setSize'], [{cx:45, cy:5}] );
		
		assertEQ ( this.mm.params['setBarBorder'], [IMG.makeImg('comm/perbarbak45.gif')] );
		assertEQ ( this.mm.params['setBarImage'], [IMG.makeImg('comm/perbar45.gif')] );
		assertEQ ( this.mm.params['setZOrder'], [0] );
		assertEQ ( this.lc().m_hpbar.getMaxVal(), 200 );
		assertEQ ( this.lc().m_hpbar.getVal(), 100 );
		assertEQ ( this.lc().m_hpbar, hpBar);

		this.mm.clear();
		this.lc()._createHPBar();
		assertEQ ( this.mm.walkLog, '' );
	};
});

TestCaseActorManager = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actorMgr = ActorManager.snew(this.g);
		this.lc = this.actorMgr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_add = function(){
		var actor = Actor.snew(this.g);
		actor.setId(1);
		this.actorMgr.add(actor);
		assertEQ ( this.actorMgr.getById(null), null);
		assertEQ ( this.actorMgr.getById(undefined), null);
		assertEQ ( this.actorMgr.getById(1), actor);
		assertEQ ( this.actorMgr.getById(2), null);
	};
	
	this.test_getById = function(){
		this.test_add();
	};
	
	this.test_remove = function(){
		var actor = Actor.snew(this.g);
		actor.setId(1);
		this.mm.mock(actor, 'destory');
		this.actorMgr.add(actor);
		assertEQ ( this.actorMgr.getById(1), actor);
		
		this.actorMgr.remove(actor);
		assertEQ ( this.mm.walkLog, 'destory');
		assertEQ (  this.actorMgr.getById(1), null);
		
		this.actorMgr.remove(actor);
		assertEQ (  this.actorMgr.getById(1), null);
	};
	
	this.test_clear = function(){
		var actor = Actor.snew(this.g);
		actor.setId(1);
		this.mm.mock(actor, 'destory');
		
		this.actorMgr.add(actor);
		assertEQ ( this.actorMgr.getById(1), actor);
		
		this.actorMgr.clear();
		assertEQ ( this.actorMgr.getById(1), null);
		assertEQ ( this.mm.walkLog, 'destory' );
	};
	
	this.test_getByIdx = function(){
		this.actorMgr.clear();
		var actor = Actor.snew(this.g);
		this.actorMgr.add(actor);
		assertEQ( this.actorMgr.getByIdx(0), actor );
		assertEQ( isNull(this.actorMgr.getByIdx(1)), true );
	};
	
	this.test_getCount = function(){
		this.actorMgr.clear();
		assertEQ( this.actorMgr.getCount(), 0 );
		
		this.actorMgr.add(Actor.snew(this.g));
		assertEQ( this.actorMgr.getCount(), 1 );
		this.actorMgr.add(Actor.snew(this.g));
		assertEQ( this.actorMgr.getCount(), 2 );
	};
	
	this.test_setMainWallId = function(){
		assertEQ ( this.actorMgr.getMainWallId(), 0 );
		this.actorMgr.setMainWallId(1);
		assertEQ ( this.actorMgr.getMainWallId(), 1 );
	};
	
	this.test__findActorPos = function(){
		var actor = Actor.snew(this.g);
		actor.setId(1);
		this.actorMgr.add(actor);
		assertEQ ( this.lc()._findActorPos(1), 0 );
		assertEQ ( this.lc()._findActorPos(2), -1 );
	};
});

TestCaseFightMapDlgSetup = function(testCase){
	var fightDemo = {id:1, mapId:9920003, actions:[{event:"fightstart"},{event:"fightstart", attacker:{role:{name:'role'}, actors:[{type:ACTOR_TYPE.HERO, pos:{x:1, y:2}, detail:{attrs:{}}}]}, defender:{role:{name:'role2'}, actors:[{type:ACTOR_TYPE.HERO, pos:{x:1, y:2}, detail:{attrs:{}}}]} }], result:[{result:0},{result:1}]};
	fightDemo.actions[1].attacker.actors[0].detail.attrs[ATTR.HP] = 1000;
	fightDemo.actions[1].attacker.actors[0].detail.attrs[ATTR.SFC] = 100;
	fightDemo.actions[1].defender.actors[0].detail.attrs[ATTR.HP] = 1000;
	fightDemo.actions[1].defender.actors[0].detail.attrs[ATTR.SFC] = 100;
	testCase.g.getImgr().getFightDemos().push(fightDemo);

	testCase.dlg = FightMapDlg.snew(testCase.g);
	var armyId = 1; 
	var fightId = 2;		
	testCase.dlg.openDlg(armyId, fightId);
};

TestCaseFightMapDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		TestCaseFightMapDlgSetup(this);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_showDlg');
		this.mm.mock(this.lc(), '_initInfo');
		
		var armyId = 1; 
		var fightId = 2;
		this.dlg.openDlg(armyId, fightId, {type:'comm'});
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );
		assertEQ ( this.mm.params['_initInfo'], [armyId, fightId, {type:'comm'}] );
	};
	
	this.test_resize = function(){
		this.mm.mock(this.lc().m_sizer, 'resize');
		this.dlg.resize({cx:1, cy:2});
		assertEQ ( this.mm.params['resize'], [this.lc().m_dlg, this.lc().m_items, {cx:1, cy:2}] );
		
		this.mm.clear();
		this.lc().m_dlg.hide();
		this.dlg.resize({cx:1, cy:2});
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.dlg.resize({cx:1, cy:2});
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_setHideCaller = function(){
		this.lc().m_dlg.hide(); // when hidecaller is null
		
		this.lc().m_dlg.show();
		var isHide = false;
		this.dlg.setHideCaller({self:this, caller:function(){
			isHide = true;
		}});
		this.lc().m_dlg.hide();
		assertEQ ( isHide, true );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = {};
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.travelMock(FightMapDlgSizer, 'snew');
		this.mm.mock(this.lc(), '_createRoleItemsByTmpl');
		this.mm.mock(this.lc(), '_createShowFight');
		this.mm.mock(this.lc(), '_setCaller');
		
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
			
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,snew,_createRoleItemsByTmpl,_createShowFight,_setCaller' );
		assertEQ ( this.mm.params['snew'], [this.g] );
		assertEQ ( this.lc().m_sizer instanceof FightMapDlgSizer, true );
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, uiback:uiback.dlg.noborder, pos:{x:0, y:0} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.military.fightmapdlg, this.lc().m_items] ); 
	};
	
	this.test__createRoleItemsByTmpl = function(){
		this.lc().m_items.attackerRole.items = {};
		this.lc().m_items.defenderRole.items = {};
		this.lc()._createRoleItemsByTmpl();
		assertEQ ( isNull(this.lc().m_items.attackerRole.items.icon), false );
		assertEQ ( isNull(this.lc().m_items.attackerRole.items.name), false );
		assertEQ ( isNull(this.lc().m_items.attackerRole.items.alliance), false );
		assertEQ ( isNull(this.lc().m_items.attackerRole.items.fightCap), false );
		assertEQ ( isNull(this.lc().m_items.defenderRole.items.icon), false );
		assertEQ ( isNull(this.lc().m_items.defenderRole.items.name), false );
		assertEQ ( isNull(this.lc().m_items.defenderRole.items.alliance), false );
		assertEQ ( isNull(this.lc().m_items.defenderRole.items.fightCap), false );
	};
	
	this.test__createShowFight = function(){
		this.mm.mock( ShowFight, 'snew:snewShowFight', [{name:'show'}] );
		this.lc()._createShowFight();
		assertEQ (this.mm.params['snewShowFight'], [this.g, this.lc().m_dlg, this.lc().m_items, this.lc().m_sizer] ); 
		assertEQ (this.lc().m_showFight, {name:'show'} );
	};
	
	this.test__setCaller = function(){
		this.mm.mock( this.lc().m_dlg, 'setCaller' );
		this.lc()._setCaller();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] ); 
	};
	
	this.test__showDlg = function(){
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._showDlg();
		assertEQ ( this.mm.walkLog, 'show' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc().m_g, 'regUpdater' );
		this.mm.mock(this.lc().m_showFight, 'initFight' );
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1, cy:2}] );
		this.mm.mock(this.dlg, 'resize' );
		var armyId = 1; 
		var fightId = 2;
		this.lc()._initInfo(armyId, fightId, {type:'comm'});
		assertEQ ( this.mm.walkLog, 'regUpdater,getValidClientSize,resize,initFight,getValidClientSize,resize' );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 10] );		
		assertEQ ( this.mm.params['initFight'], [armyId, fightId, {type:'comm'}] );
		assertEQ ( this.mm.params['resize.0'], [{cx:1, cy:2}] );		
		assertEQ ( this.mm.params['resize.1'], [{cx:1, cy:2}] );		
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		this.lc()._onDlgEvent(0);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.walkLog, 'unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );		
	};
	
	this.test__onClickSkip = function(){
		this.mm.mock(this.lc().m_showFight, 'skip');
		this.lc().m_items.skipBtn.click();
		assertEQ ( this.mm.walkLog, 'skip' );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc().m_showFight, 'update');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, 'update' );
	};
});

TestCaseFightMapDlgSizer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		TestCaseFightMapDlgSetup(this);
		this.sizer = FightMapDlgSizer.snew(this.g);
		this.lc = this.sizer.lc;
		this.lc()._setParams(this.dlg.lc().m_dlg, this.dlg.lc().m_items, {cx:1000, cy:800});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		this.mm.mock(this.lc(), '_setParams');
		this.mm.mock(this.lc(), '_resizeDlg');
		this.mm.mock(this.lc(), '_resetMapDomPosition');
		this.mm.mock(this.lc(), '_resetRoleInfoPosition');
		this.mm.mock(this.lc(), '_resetHPProgBarPosition');
		this.mm.mock(this.lc(), '_resetHeroListPosition');
		this.mm.mock(this.lc(), '_resetDefBarPosition');
		this.mm.mock(this.lc(), '_resetWallBarPosition');
		this.mm.mock(this.lc(), '_resetSkipBtnPosition');
		this.sizer.resize(this.dlg.lc().m_dlg, this.dlg.lc().m_items, {cx:1, cy:2});
		assertEQ ( this.mm.walkLog, '_setParams,_resizeDlg,_resetMapDomPosition,_resetRoleInfoPosition,_resetHPProgBarPosition,_resetHeroListPosition,_resetDefBarPosition,_resetWallBarPosition,_resetSkipBtnPosition' );
		assertEQ ( this.mm.params['_setParams'], [this.dlg.lc().m_dlg, this.dlg.lc().m_items, {cx:1, cy:2}] );
	};
	
	this.test_resetHeroListPosition = function(){
		this.mm.mock(this.lc(), '_resetDefenderHeroListPosition' );
		this.mm.mock(this.lc(), '_resetAttackerHeroListPosition' );
		this.sizer.resetHeroListPosition();
		assertEQ ( this.mm.walkLog, '_resetDefenderHeroListPosition,_resetAttackerHeroListPosition' );
	};
	
	this.test__setParams = function(){
		assertEQ ( this.lc().m_dlg, this.dlg.lc().m_dlg);
		assertEQ ( this.lc().m_items, this.dlg.lc().m_items);
		assertEQ ( this.lc().m_size, {cx:1000, cy:800});
	};
	
	this.test__resizeDlg = function(){
		this.mm.mock(TQ, 'setDomSize');
		this.mm.mock(this.lc().m_dlg, 'refreshBack');
		this.lc()._resizeDlg();
		assertEQ (this.mm.walkLog, 'setDomSize,setDomSize,refreshBack');
		assertEQ ( this.mm.params['setDomSize.0'], [this.lc().m_dlg.getConDom(), 1000, 800] );
		assertEQ ( this.mm.params['setDomSize.1'], [this.lc().m_dlg.getConDom().firstChild, 1000, 800] );
	};
	
	this.test__repositionMapDom = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.mm.mock(TQ, 'setDomSize');
		this.lc()._resetMapDomPosition();
		var maxSize = this.g.getWinSizer().getMaxClientSize();
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_items.map, (1000 - maxSize.cx)/2, (800-maxSize.cy)/2] );
		assertEQ ( this.mm.params['setDomSize'], [this.lc().m_items.map,  maxSize.cx, maxSize.cy ] );
	};
	
	this.test__resetRoleInfoPosition = function(){
		this.lc().m_items.defenderRole.offsetWidth = 100;
		this.lc().m_items.defenderRole.w_ = 100;
		this.lc()._resetRoleInfoPosition();
		assertEQ ( TQ.getCSS(this.lc().m_items.defenderRole, 'left'), (1000 - 100)+'px' );
	};
	
	this.test__resetHPProgBarPosition = function(){
		this.lc().m_items.HPProgBar.offsetWidth = 100;
		this.lc().m_items.HPProgBar.w_ = 100;
		this.lc()._resetHPProgBarPosition();
		assertEQ ( TQ.getCSS(this.lc().m_items.HPProgBar, 'left'), (1000 - 100)/2+'px' );
	};
	
	this.test__resetHeroListPosition = function(){
		this.mm.mock(this.lc(), '_resetAttackerHeroListPosition');
		this.mm.mock(this.lc(), '_resetDefenderHeroListPosition');
		this.lc()._resetHeroListPosition();
		assertEQ ( this.mm.walkLog, '_resetAttackerHeroListPosition,_resetDefenderHeroListPosition' );
	};
	
	this.test__resetDefBarPosition = function(){
		this.lc().m_items.wallBar.offsetHeight = 30;
		this.lc().m_items.wallBar.h_ = 30;
		
		this.lc().m_items.defBar.offsetWidth = 100;
		this.lc().m_items.defBar.w_ = 100;
		this.lc().m_items.defBar.offsetHeight = 20;
		this.lc().m_items.defBar.h = 20;
		
		this.lc()._resetDefBarPosition();
		
		assertEQ ( TQ.getCSS(this.lc().m_items.defBar, 'left'), (1000 - 100 - 50) + 'px' );
		assertEQ ( TQ.getCSS(this.lc().m_items.defBar, 'top'), (800 - this.lc().C_HEROLIST_H - 30 - 20 - 50 )  +'px' );
	};
	
	this.test__resetWallBarPosition = function(){
		this.lc().m_items.wallBar.offsetWidth = 100;
		this.lc().m_items.wallBar.w_ = 100;
		this.lc().m_items.wallBar.offsetHeight = 30;
		this.lc().m_items.wallBar.h_ = 30;
		
		this.lc()._resetWallBarPosition();
		assertEQ ( TQ.getCSS(this.lc().m_items.wallBar, 'left'), (1000 - 100 - 50) + 'px' );
		assertEQ ( TQ.getCSS(this.lc().m_items.wallBar, 'top'), (800 - this.lc().C_HEROLIST_H - 30 - 50 )  +'px' );
	};
	
	this.test__resetSkipBtnPosition = function(){
		this.mm.mock(TQ, 'setDomPos' );
		this.lc()._resetSkipBtnPosition();
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_items.skipBtn.getParent(), (1000 - 131)/2, (800-40)] );
	};
	
	this.test__resetAttackerHeroListPosition = function(){
		this.lc()._resetAttackerHeroListPosition();
		assertEQ ( TQ.getCSS(this.lc().m_items.attackerHeroList.getParent(), 'top'),  (800 - this.lc().C_HEROLIST_H)  +'px' );
	};
	
	this.test__resetDefenderHeroListPosition = function(){
		this.lc().m_items.defenderHeroList.setItemCount(2);
		this.lc()._resetDefenderHeroListPosition();
		assertEQ ( TQ.getCSS(this.lc().m_items.defenderHeroList.getParent(), 'top'),  (800 - this.lc().C_HEROLIST_H)  +'px' );
		assertEQ ( TQ.getCSS(this.lc().m_items.defenderHeroList.getParent(), 'left'),  (1000 - this.lc().C_HEROLIST_W/5*2)  +'px' );
	};
});

TestCaseShowFight = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		TestCaseFightMapDlgSetup(this);
		this.items = this.dlg.lc().m_items;
		this.showFight =  ShowFight.snew(this.g, this.dlg, this.items, this.dlg.lc().m_sizer);
		this.lc = this.showFight.lc;
		this.g.getActorMgr().clear();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.travelMock(ShowRounds, 'snew:snewShowRounds' );
		this.mm.travelMock(ShowFightResult, 'snew:snewShowFightResult' );
		this.showFight.init(this.g, this.dlg, this.items);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_dlg, this.dlg );
		assertEQ ( this.lc().m_items, this.items );
		assertEQ ( this.lc().m_showRounds instanceof ShowRounds, true );
		assertEQ ( this.lc().m_showFightResult instanceof ShowFightResult, true );
		assertEQ ( this.mm.params['snewShowRounds'], [this.g] );
		assertEQ ( this.mm.params['snewShowFightResult'], [this.g, this.dlg, this.items] );
	};
	
	this.test_initFight = function(){
		this.mm.mock(this.lc().m_showFightResult, 'initFight');
		this.mm.mock(this.g.getImgr(), 'getFightDemoRounds', [{name:'fightDemo'}]);
		this.mm.mock(this.lc(), '_initFight');
		
		var armyId = 1; 
		var fightId = 2;
		this.showFight.initFight(armyId, fightId, {type:'comm'});
		assertEQ ( this.mm.walkLog, 'initFight,getFightDemoRounds,_initFight' );
		assertEQ ( this.mm.params['initFight'], [armyId, fightId, {type:'comm'}] );
		assertEQ ( this.mm.params['getFightDemoRounds'], [armyId, fightId] );
		assertEQ ( this.mm.params['_initFight'], [{name:'fightDemo'}] );
	};
	
	this.test_update = function(){	
		var r_isEnd = [false];
		this.mm.mock(this.lc().m_showRounds, 'isEnd', r_isEnd);
		this.mm.mock(this.lc().m_showRounds, 'update:update1');
		this.mm.mock(this.lc().m_showFightResult, 'update:update2');
		
		this.showFight.update();
		assertEQ ( this.mm.walkLog, 'isEnd,update1' );
		
		this.mm.clear();
		r_isEnd[0] = true;
		this.showFight.update();
		assertEQ ( this.mm.walkLog, 'isEnd,update2' );
	};
	
	this.test_skip = function(){
		this.mm.mock(this.lc().m_showRounds, 'skip');
		this.showFight.skip();
		assertEQ ( this.mm.walkLog, 'skip' );
	};
	
	this.test__initFight = function(){
		this.mm.mock(this.g.getActorMgr(), 'clear');
		this.mm.mock(this.lc(), '_createSubShowFight');
		this.mm.mock(this.lc(), '_setHeadPartyInfo');
		this.mm.mock(this.lc(), '_updateHerosInfo');
		this.mm.mock(this.lc(), '_updateWallsInfo');
		this.mm.mock(this.lc(), '_updateDefsInfo');
		this.mm.mock(this.lc(), '_createActors');
		this.mm.mock(this.lc().m_showRounds, 'setRounds');
		this.mm.mock(this.lc(), '_loadMap');
		
		var fightDemo = {attacker:{role:{id:1}, actors:[{type:0}]}, defender:{role:{id:2}, actors:{}}, rounds:[{},{}] };
		this.lc()._initFight(fightDemo);
		assertEQ ( this.mm.walkLog, 'clear,_loadMap,_createSubShowFight,_createActors,_createActors,_setHeadPartyInfo,_setHeadPartyInfo,_updateHerosInfo,_updateHerosInfo,_updateWallsInfo,_updateDefsInfo,setRounds' );
		assertEQ ( this.mm.params['_createSubShowFight'], [fightDemo.attacker.actors] );
		assertEQ ( this.mm.params['_setHeadPartyInfo.0'], ['attacker', fightDemo.attacker] );
		assertEQ ( this.mm.params['_setHeadPartyInfo.1'], ['defender', fightDemo.defender] );
		assertEQ ( this.mm.params['_updateHerosInfo.0'], ['attacker'] );
		assertEQ ( this.mm.params['_updateHerosInfo.1'], ['defender'] );
		assertEQ ( this.mm.params['_createActors.0'], ['attacker', fightDemo.attacker.actors, 1] );
		assertEQ ( this.mm.params['_createActors.1'], ['defender', fightDemo.defender.actors, 3] );
		assertEQ ( this.mm.params['setRounds'], [fightDemo.rounds] );
		assertEQ ( this.mm.params['_loadMap'], [fightDemo] );
		assertEQ ( this.lc().m_fightDemo, fightDemo);
	};	
	
	this.test__loadMap = function(){
		this.mm.mock(this.lc().m_showRounds, 'setMapPosInfo');
		var fightDemo = {mapId:9920002, attacker:{actors:[{id:1, type:ACTOR_TYPE.SOLDIER} ]}
			,defender:{actors:[{id:1, type:ACTOR_TYPE.WALL} ]}};
		var actor = Actor.snew(this.g);  actor.setType(ACTOR_TYPE.WALL); actor.setHP(40,4); actor.setCampName('defender');
		this.g.getActorMgr().add(actor);
		this.lc()._loadMap(fightDemo);
		var res = ItemResUtil.findItemres(9920002);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.map), 'map/' + res.img), true );
		assertEQ ( this.mm.params['setMapPosInfo'], [res.offsetPos, res.gridPixel] );
	};
	
	this.test__createSubShowFight = function(){
		var actors = [{id:1, type:ACTOR_TYPE.HERO}];
		this.lc()._createSubShowFight(actors);
		assertEQ ( this.lc().m_subShowFight instanceof ShowSingleHeroFight, true );
		
		actors = [{id:1, type:ACTOR_TYPE.SOLDIER}];
		this.lc()._createSubShowFight(actors);
		assertEQ ( this.lc().m_subShowFight instanceof ShowSoldiersFight, true );
	};
	
	this.test__setHeadPartyInfo = function(){
		var actor = Actor.snew(this.g);
		actor.setType(ACTOR_TYPE.SOLDIER);
		this.g.getActorMgr().add(actor);
		var actor = Actor.snew(this.g);
		actor.setType(ACTOR_TYPE.SOLDIER);
		this.g.getActorMgr().add(actor);

		this.lc().m_subShowFight = ShowSingleHeroFight.snew();
		this.mm.mock(this.lc().m_subShowFight, 'calcFightCap', [1] );
		this.mm.mock(this.lc(), '_setHPProgBarMaxVal' );
		this.mm.mock(this.lc(), '_updateHPProgBar' );
		
		var campRes = {role:{icon:101, name:'role', alli:'alliance'}, actors:{} };
		this.lc()._setHeadPartyInfo('attacker', campRes);
		assertEQ ( this.mm.walkLog, 'calcFightCap,_setHPProgBarMaxVal,_updateHPProgBar' );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.attackerRole.items.icon), '101.gif'), true );
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.name), 'role' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.alliance), 'alliance' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.fightCap), 1 );
		assertEQ ( this.mm.params['calcFightCap'], [campRes.actors] );
		assertEQ ( this.mm.params['_setHPProgBarMaxVal'], ['attacker'] );
		assertEQ ( this.mm.params['_updateHPProgBar'], ['attacker'] );
		assertEQ ( TQ.getClass(this.lc().m_items.attackerRole.items.attackerBak), 'attackerRoleBak' );
		
		// check hero single fight
		this.g.getActorMgr().clear();
		var actor = Actor.snew(this.g);
		actor.setIcon(109);
		actor.setName('attacker_hero');
		actor.setCampName('attacker');
		actor.setType(ACTOR_TYPE.HERO);
		this.g.getActorMgr().add(actor);
		var actor = Actor.snew(this.g);
		actor.setType(ACTOR_TYPE.HERO);
		actor.setIcon(201);
		actor.setCampName('defender');
		this.g.getActorMgr().add(actor);
		campRes = {role:{icon:101, name:'role', alli:'alliance'}, actors:{} };
		this.lc()._setHeadPartyInfo('attacker', campRes);
		assertEQ ( TQ.getClass(this.lc().m_items.attackerRole.items.attackerBak), 'attackerHeroBak' );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.attackerRole.items.icon), '109.gif'), true );
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.name), 'attacker_hero');
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.alliance), '' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.attackerRole.items.fightCap), 1 );
	};
	
	this.test__setHPProgBarMaxVal = function(){
		this.mm.mock(this.lc().m_items.attackerRole.items.hpProgBar, 'setRange');
		this.mm.mock(this.lc(), '_calcActorsMaxHP', [10]);
		
		this.lc()._setHPProgBarMaxVal('attacker');
		assertEQ ( this.mm.params['setRange'], [10] );
		assertEQ ( this.mm.params['_calcActorsMaxHP'], ['attacker'] );
		assertEQ ( this.lc().m_items.attackerRole.items.hpProgBar.isMirror(), false );
		
		this.lc()._setHPProgBarMaxVal('defender');
		assertEQ ( this.lc().m_items.defenderRole.items.hpProgBar.isMirror(), true );
	};
	
	this.test__updateHPProgBar = function(){
		this.mm.mock(this.lc().m_items.attackerRole.items.hpProgBar, 'setValue');
		this.mm.mock(this.lc(), '_calcActorsHP', [10]);
		this.lc()._updateHPProgBar('attacker');
		assertEQ ( this.mm.params['setValue'], [0, 10] );
		assertEQ ( this.mm.params['_calcActorsHP'], ['attacker'] );
	};
	
	this.test__calcActorsMaxHP = function(){
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setHP(1*2,1); actor1.setUnitHP(2);  actor1.setCampName('attacker');
		var actor2 = Actor.snew(this.g);  actor2.setType(ACTOR_TYPE.SOLDIER); actor2.setHP(2*3,2); actor2.setUnitHP(3);  actor2.setCampName('attacker');
		var actor3 = Actor.snew(this.g);  actor3.setType(ACTOR_TYPE.WALL); actor3.setHP(4*4,4); actor3.setUnitHP(4);   actor3.setCampName('defender');
		var actor4 = Actor.snew(this.g);  actor4.setType(ACTOR_TYPE.DEF); actor4.setHP(4*5,4); actor4.setUnitHP(5); actor4.setCampName('defender');
		var actor5 = Actor.snew(this.g);  actor5.setType(ACTOR_TYPE.SOLDIER); actor5.setHP(5*6,5); actor5.setUnitHP(6); actor5.setCampName('defender');
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.g.getActorMgr().add(actor4);
		this.g.getActorMgr().add(actor5);
		
		assertEQ ( this.lc()._calcActorsMaxHP('attacker'), 3 );
		assertEQ ( this.lc()._calcActorsMaxHP('defender'), 5 );
	};
	
	this.test__calcActorsHP = function(){
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setHP(10,1*2); actor1.setUnitHP(2); actor1.setCampName('attacker');
		var actor2 = Actor.snew(this.g);  actor2.setType(ACTOR_TYPE.SOLDIER); actor2.setHP(20,2*3); actor2.setUnitHP(3); actor2.setCampName('attacker');
		var actor3 = Actor.snew(this.g);  actor3.setType(ACTOR_TYPE.WALL); actor3.setHP(40,4*4); actor3.setUnitHP(4);  actor3.setCampName('defender');
		var actor4 = Actor.snew(this.g);  actor4.setType(ACTOR_TYPE.DEF); actor4.setHP(40,4*5); actor4.setUnitHP(5); actor4.setCampName('defender');
		var actor5 = Actor.snew(this.g);  actor5.setType(ACTOR_TYPE.SOLDIER); actor5.setHP(40,5*6); actor5.setUnitHP(6); actor5.setCampName('defender');
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.g.getActorMgr().add(actor4);
		this.g.getActorMgr().add(actor5);

		assertEQ ( this.lc()._calcActorsHP('attacker'), 3 );
		assertEQ ( this.lc()._calcActorsHP('defender'), 5 );
	};
	
	this.test__updateHerosInfo = function() {
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setIcon(101); actor1.setHP(1000, 500); actor1.setUnitHP(10); actor1.setCampName('attacker');
		var actor2 = Actor.snew(this.g);  actor2.setType(ACTOR_TYPE.SOLDIER); actor2.setIcon(102); actor2.setHP(4000, 2000); actor2.setUnitHP(20); actor2.setCampName('attacker');
		var actor3 = Actor.snew(this.g);  actor3.setType(ACTOR_TYPE.WALL); actor3.setIcon(0); actor3.setCampName('attacker');
		var actor4 = Actor.snew(this.g);  actor4.setType(ACTOR_TYPE.DEF); actor4.setIcon(0); actor4.setCampName('attacker');
		var actor5 = Actor.snew(this.g);  actor5.setType(ACTOR_TYPE.HERO); actor5.setIcon(0); actor5.setCampName('attacker');
		var actor6 = Actor.snew(this.g);  actor6.setType(ACTOR_TYPE.SOLDIER); actor6.setIcon(103); actor6.setHP(4000, 2000); actor6.setUnitHP(20); actor6.setCampName('defender');
		
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.g.getActorMgr().add(actor4);
		this.g.getActorMgr().add(actor5);
		this.g.getActorMgr().add(actor6);
		
		this.lc()._updateHerosInfo('attacker');
		var list = this.lc().m_items.attackerHeroList;
		assertEQ ( list.getCount(), 2 );
		assertEQ ( isInclude(IMG.getBKImage(list.getItem(0).exsubs.icon), '101.gif'), true );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.number), '50/100' );
		assertEQ ( TQ.getTextEx(list.getItem(0).exsubs.number_bak), '50/100' );
		assertEQ ( isInclude(IMG.getBKImage(list.getItem(1).exsubs.icon), '102.gif'), true );
		assertEQ ( TQ.getTextEx(list.getItem(1).exsubs.number), '100/200' );
		
		this.lc()._updateHerosInfo('defender');
		var list = this.lc().m_items.defenderHeroList;
		assertEQ ( list.getCount(), 1 );
		assertEQ ( TQ.getCSS(list.getParent(), 'left'),  (1000 - this.lc().C_HEROLIST_W/5*1)  +'px' );
	};
	
	this.test__updateWallsInfo = function() {
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setIcon(101); actor1.setHP(1000, 500); actor1.setUnitHP(10); actor1.setCampName('attacker');
		this.g.getActorMgr().add(actor1);
		
		this.lc()._updateWallsInfo();
		assertEQ ( TQ.getCSS(this.lc().m_items.wallBar, 'display'), 'none' );
		
		var actor2 = Actor.snew(this.g);  actor2.setId(2); actor2.setType(ACTOR_TYPE.WALL); actor2.setHP(40,4); actor2.setCampName('defender');
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().setMainWallId(2);
		
		this.lc()._updateWallsInfo();
		assertEQ ( TQ.getCSS(this.lc().m_items.wallBar, 'display'), 'block' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.wallHP), '4/40' );
	};
	
	this.test__updateDefsInfo = function(){
		this.g.getActorMgr().clear();
		
		var campRes = {actors:{}};
		this.lc()._updateDefsInfo(campRes);
		assertEQ ( TQ.getCSS(this.lc().m_items.defBar, 'display'), 'none' );
			
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setType(ACTOR_TYPE.WALL); actor.setHP(40,4); actor.setCampName('defender');
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.DEF); actor1.setResId(150301); actor1.setHP(1000, 1000); actor1.setUnitHP(1); actor1.setCampName('defender');
		var actor2 = Actor.snew(this.g);  actor2.setType(ACTOR_TYPE.DEF); actor2.setResId(150302); actor2.setHP(2000, 2000); actor2.setUnitHP(1); actor2.setCampName('defender');
		var actor3 = Actor.snew(this.g);  actor3.setType(ACTOR_TYPE.DEF); actor3.setResId(150305); actor3.setHP(200, 200); actor3.setUnitHP(1); actor3.setCampName('defender');
		this.g.getActorMgr().add(actor);
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.g.getActorMgr().setMainWallId(1);
		
		this.lc()._updateDefsInfo(campRes);
		assertEQ ( TQ.getCSS(this.lc().m_items.defBar, 'display'), 'block' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.def_XIANJING ), 1000);
		assertEQ ( TQ.getTextEx(this.lc().m_items.def_GUNMU ), 2000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.def_JUMA ), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.def_LEISHI ), 0 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.def_NUJIAN ), 200 );
	};
	
	this.test__createActors = function(){
		this.lc().m_showRounds.setMapPosInfo({x:100, y:200}, 50); // mapOffsetPos, gridPixel
		
		this.lc().m_items.map = MockDomEx.snew();
		var actors = [{id:1, name:'hero', type:ACTOR_TYPE.HERO, resid:1001, pos:{x:1, y:2}, detail:{attrs:{},icon:101} }];
		actors[0].detail.attrs[ATTR.HP] = 100;
		actors[0].detail.attrs[ATTR.UHP] = 2;
		this.lc()._createActors('attacker', actors, 2);
		assertEQ ( this.g.getActorMgr().getById(1).getId(), 1);
		assertEQ ( this.g.getActorMgr().getById(1).getDirection(), 2);
		assertEQ ( this.g.getActorMgr().getById(1).getPosition(), {x:100 + 1*50, y:200 + 2*50});
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_g, this.g);
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_actionId, 1);
		assertEQ ( this.g.getActorMgr().getById(1).getResId(), 150101, 'man hero');
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_parent, this.lc().m_items.map);
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_type, ACTOR_TYPE.HERO);
		assertEQ ( this.g.getActorMgr().getById(1).getHP(), 100);
		assertEQ ( this.g.getActorMgr().getById(1).getMaxHP(), 100);
		assertEQ ( this.g.getActorMgr().getById(1).getUnitHP(), 2);
		assertEQ ( this.g.getActorMgr().getById(1).getIcon(), 101);
		assertEQ ( this.g.getActorMgr().getById(1).getCampName(), 'attacker');
		assertEQ ( this.g.getActorMgr().getById(1).getName(), 'hero');
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_observer, this.lc()._onActorHPChange);
		
		this.g.getActorMgr().clear();
		actors[0].detail.icon = 201;
		this.lc()._createActors('attacker', actors, 2);
		assertEQ ( this.g.getActorMgr().getById(1).getResId(), 150102, 'women hero');
		
		this.g.getActorMgr().clear();
		var actors = [{id:1, type:ACTOR_TYPE.SOLDIER, resid:150001, pos:{x:1, y:2}, detail:{attrs:{},icon:101} }];
		actors[0].detail.attrs[ATTR.HP] = 100;
		actors[0].detail.attrs[ATTR.UHP] = 2;
		this.lc()._createActors('defender', actors, 1);
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_type, ACTOR_TYPE.SOLDIER);
		assertEQ ( this.g.getActorMgr().getById(1).getCampName(), 'defender');
		assertEQ ( this.g.getActorMgr().getById(1).getResId(), 150001 );
		
		this.g.getActorMgr().clear();
		var actors = [{id:1, type:ACTOR_TYPE.DEF, resid:1, pos:{x:1, y:2}, detail:{attrs:{},icon:101} }];
		actors[0].detail.attrs[ATTR.HP] = 100;
		actors[0].detail.attrs[ATTR.UHP] = 2;
		this.lc()._createActors('defender', actors, 1);
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_type, ACTOR_TYPE.DEF);
		assertEQ ( this.g.getActorMgr().getById(1).getResId(), 150301 );
		
		this.g.getActorMgr().clear();
		var actors = [
			{id:1, type:ACTOR_TYPE.WALL, resid:0, pos:{x:1, y:0}, detail:{attrs:{},icon:101} }
			,{id:2, type:ACTOR_TYPE.WALL, resid:0, pos:{x:1, y:1}, detail:{attrs:{},icon:101} }
			,{id:3, type:ACTOR_TYPE.WALL, resid:0, pos:{x:1, y:2}, detail:{attrs:{},icon:101} }
		];
		actors[0].detail.attrs[ATTR.HP] = 100;
		actors[0].detail.attrs[ATTR.UHP] = 2;
		actors[1].detail.attrs[ATTR.HP] = 100;
		actors[1].detail.attrs[ATTR.UHP] = 2;
		actors[2].detail.attrs[ATTR.HP] = 100;
		actors[2].detail.attrs[ATTR.UHP] = 2;
		this.lc()._createActors('defender', actors, 1);
		assertEQ ( this.g.getActorMgr().getById(1).lc().m_type, ACTOR_TYPE.WALL);
		assertEQ ( this.g.getActorMgr().getById(1).getResId(), 0 );
		assertEQ ( this.g.getActorMgr().getById(2).lc().m_type, ACTOR_TYPE.WALL);
		assertEQ ( this.g.getActorMgr().getById(2).getResId(), 150201 );
		assertEQ ( this.g.getActorMgr().getById(3).lc().m_type, ACTOR_TYPE.WALL);
		assertEQ ( this.g.getActorMgr().getById(3).getResId(), 0 );
		assertEQ ( this.g.getActorMgr().getMainWallId(), 2 );
	};
	
	this.test__collectDefActors = function(){
		assertEQ ( this.lc()._collectDefActors(), [] );
		
		var actor1 = Actor.snew(this.g);  actor1.setType(ACTOR_TYPE.DEF); actor1.setHP(40,4); actor1.setCampName('defender');
		var actor2 = Actor.snew(this.g);  actor2.setType(ACTOR_TYPE.DEF); actor2.setHP(40,4); actor2.setCampName('defender');
		var actor3 = Actor.snew(this.g);  actor3.setType(ACTOR_TYPE.SOLDIER); actor3.setIcon(102); actor3.setHP(4000, 2000); actor3.setUnitHP(20); actor3.setCampName('attacker');
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		
		assertEQ ( this.lc()._collectDefActors(), [ actor1, actor2 ] );
	};
	
	this.test__getWallActor = function(){
		assertEQ ( this.lc()._getWallActor(), null );
		
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setType(ACTOR_TYPE.WALL); actor.setHP(40,4); actor.setCampName('defender');
		this.g.getActorMgr().add(actor);
		this.g.getActorMgr().setMainWallId(1);
		
		assertEQ ( this.lc()._getWallActor(), actor );
	};
	
	this.test__hasWallActor = function(){
		assertEQ ( this.lc()._hasWallActor(), false );
		
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setType(ACTOR_TYPE.WALL); actor.setHP(40,4); actor.setCampName('defender');
		this.g.getActorMgr().add(actor);
		this.g.getActorMgr().setMainWallId(1);
		
		assertEQ ( this.lc()._hasWallActor(), true );
	};
	
	this.test__onActorHPChange = function(){
		this.mm.mock(this.lc(), '_updateHPProgBar');
		this.mm.mock(this.lc(), '_updateHerosInfo');
		this.mm.mock(this.lc(), '_updateWallsInfo');
		this.mm.mock(this.lc(), '_updateDefsInfo');
		
		this.lc()._onActorHPChange();
		assertEQ ( this.mm.params['_updateHPProgBar.0'], ['attacker'] );
		assertEQ ( this.mm.params['_updateHPProgBar.1'], ['defender'] );
		assertEQ ( this.mm.params['_updateHerosInfo.0'], ['attacker'] );
		assertEQ ( this.mm.params['_updateHerosInfo.1'], ['defender'] );
		assertEQ ( this.mm.params['_updateWallsInfo'], [] );
		assertEQ ( this.mm.params['_updateDefsInfo'], [] );
	};
});

TestCaseShowSingleHeroFight = TestCase.extern(function(){
	this.test_calcFightCap = function(){
		var actors = [{id:0, type:ACTOR_TYPE.HERO, detail:{attrs:{}} }];
		actors[0].detail.attrs[ATTR.SFC] = 1000;
		assertEQ ( ShowSingleHeroFight.snew().calcFightCap(actors), 1000 );
	};
});

TestCaseShowSoldiersFight = TestCase.extern(function(){
	this.test_calcFightCap = function(){
		var actors = [{id:1, type:ACTOR_TYPE.SOLDIER, detail:{attrs:{}} }, {id:2, type:ACTOR_TYPE.SOLDIER, detail:{attrs:{}} }, {id:3}];
		actors[0].detail.attrs[ATTR.FC] = 1;
		actors[1].detail.attrs[ATTR.FC] = 2;
		assertEQ ( ShowSoldiersFight.snew().calcFightCap(actors),  3);
	};
});

TestCaseShowRounds = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {map:MockDomEx.snew()};
		this.showRounds = ShowRounds.snew(this.g);
		this.lc = this.showRounds.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setMapPosInfo = function(){
		this.showRounds.setMapPosInfo({x:1, y:2}, 50);
		assertEQ ( this.lc().m_mapOffsetPos, {x:1, y:2} );
		assertEQ ( this.lc().m_gridPixel, 50 );
	};

	this.test_setRounds = function(){
		assertEQ ( this.lc().m_rounds, [] );
		this.showRounds.setRounds([[],[]]);
		assertEQ ( this.lc().m_rounds, [[],[]] );
	};
	
	this.test_update = function(){
		var r_isAllRoundsEnd = [true];
		var r_isCurRoundEnd = [true];
		this.mm.mock(this.lc(), '_isAllRoundsEnd', r_isAllRoundsEnd);
		this.mm.mock(this.lc(), '_isCurRoundEnd', r_isCurRoundEnd);
		this.mm.mock(this.lc(), '_popRound' );
		this.mm.mock(this.lc(), '_getCurRound', [{name:'curRound'}] );
		this.mm.mock(this.lc(), '_updateRound' );
		this.mm.mock(this.lc(), '_removeDeletedActions' );
		this.mm.mock(this.g.getActorMgr(), 'update');
		
		this.showRounds.update();
		assertEQ ( this.mm.walkLog, 'update,_isAllRoundsEnd' );
		
		this.mm.clear();
		r_isAllRoundsEnd[0] = false;
		this.showRounds.update();
		assertEQ ( this.mm.walkLog, 'update,_isAllRoundsEnd,_isCurRoundEnd,_popRound' );
		
		this.mm.clear();
		r_isCurRoundEnd[0] = false;
		this.showRounds.update();
		assertEQ ( this.mm.walkLog, 'update,_isAllRoundsEnd,_isCurRoundEnd,_getCurRound,_updateRound,_getCurRound,_removeDeletedActions' );
		assertEQ ( this.mm.params['_updateRound'], [ {name:'curRound'} ] );
		assertEQ ( this.mm.params['_removeDeletedActions'], [ {name:'curRound'} ] );
	};
	
	this.test_isEnd = function(){
		var r_isAllRoundsEnd = [true];
		this.mm.mock(this.lc(), '_isAllRoundsEnd', r_isAllRoundsEnd);
		assertEQ ( this.showRounds.isEnd(), true );
		
		r_isAllRoundsEnd[0] = false;
		assertEQ ( this.showRounds.isEnd(), false );
	};
	
	this.test_skip = function(){
		this.lc().m_rounds = [{},{}];
		var actor = Actor.snew(this.g);
		actor.setAction('stand');
		this.g.getActorMgr().add(actor);
		this.showRounds.skip();
		assertEQ ( this.lc().m_rounds, [] );
		assertEQ ( this.g.getActorMgr().getCount(), 0 );
	};
	
	this.test__isAllRoundsEnd = function(){
		this.lc().m_rounds = [{},{}];
		assertEQ ( this.lc()._isAllRoundsEnd(), false );
					
		this.lc().m_rounds = [];
		assertEQ ( this.lc()._isAllRoundsEnd(), true );
			
		var actor = Actor.snew(this.g);
		actor.setAction('stand');
		this.g.getActorMgr().add(actor);
		assertEQ ( this.lc()._isAllRoundsEnd(), true );
			
		actor.setState(StateFactory.createByType(actor, null, "lockedstate", {}));
		assertEQ ( this.lc()._isAllRoundsEnd(), false );
	};
	
	this.test__isCurRoundEnd = function(){
		this.lc().m_rounds = [[{}]];
		assertEQ ( this.lc()._isCurRoundEnd(), false );
			
		this.lc().m_rounds = [[]];
		assertEQ ( this.lc()._isCurRoundEnd(), true );
			
		this.lc().m_rounds = [];
		assertEQ ( this.lc()._isCurRoundEnd(), true );
			
		var actor = Actor.snew(this.g);
		actor.setAction('stand');
		this.g.getActorMgr().add(actor);
		assertEQ ( this.lc()._isCurRoundEnd(), true );
			
		actor.setState(StateFactory.createByType(actor, null, "lockedstate", {}));
		assertEQ ( this.lc()._isCurRoundEnd(), false );
		
		this.lc().m_rounds = [[]];
		assertEQ ( this.lc()._isCurRoundEnd(), false );
	};
	
	this.test__popRound = function(){
		this.lc().m_rounds = [[]];
		this.lc()._popRound();
		assertEQ ( this.lc().m_rounds, [] );
	};
	
	this.test__getCurRound = function(){
		this.lc().m_rounds = [[{id:1}],[{id:2}]];
		assertEQ ( this.lc()._getCurRound(), [{id:1}] );
	};
	
	this.test__updateRound = function(){
		var r_updateEffectEvent = [true];
		var r_updateAddEffectEvent = [true];
		var r_updateRemoveEffectEvent = [true];
		var r_updateStateEvent = [true];
		this.mm.mock(this.lc(), '_updateEffectEvent', r_updateEffectEvent );
		this.mm.mock(this.lc(), '_updateAddEffectEvent', r_updateAddEffectEvent);
		this.mm.mock(this.lc(), '_updateRemoveEffectEvent', r_updateRemoveEffectEvent );
		this.mm.mock(this.lc(), '_resetWallActorAction' );
		this.mm.mock(this.lc(), '_updateStateEvent', r_updateStateEvent );
		
		var actions = [{event:'effect'},{event:'addeff'},{event:'removeeff'},{event:'move'},{event:'invalid'}];
		this.lc()._updateRound(actions);
		assertEQ ( actions[0].isDelete, true );
		assertEQ ( actions[1].isDelete, true );
		assertEQ ( actions[2].isDelete, true );
		assertEQ ( actions[3].isDelete, true );
		assertEQ ( actions[4].isDelete, true );
		assertEQ ( this.mm.walkLog, '_updateEffectEvent,_updateAddEffectEvent,_updateRemoveEffectEvent,_resetWallActorAction,_updateStateEvent,_resetWallActorAction,_updateStateEvent' );
		assertEQ ( this.mm.params['_updateEffectEvent'], [actions[0]]);
		assertEQ ( this.mm.params['_updateAddEffectEvent'], [actions[1]]);
		assertEQ ( this.mm.params['_updateRemoveEffectEvent'], [actions[2]]);
		assertEQ ( this.mm.params['_resetWallActorAction.0'], [actions[3]]);
		assertEQ ( this.mm.params['_resetWallActorAction.1'], [actions[4]]);
		assertEQ ( this.mm.params['_updateStateEvent.0'], [actions[3]]);
		assertEQ ( this.mm.params['_updateStateEvent.1'], [actions[4]]);
		
		r_updateEffectEvent[0] = false;
		r_updateAddEffectEvent[0] = false;
		r_updateRemoveEffectEvent[0] = false;
		r_updateStateEvent[0] = false;
		this.lc()._updateRound(actions);
		assertEQ ( actions[0].isDelete, false );
		assertEQ ( actions[1].isDelete, false );
		assertEQ ( actions[2].isDelete, false );
		assertEQ ( actions[3].isDelete, false );
		assertEQ ( actions[4].isDelete, false );
	};
	
	this.test__updateEffectEvent = function(){
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setParent(MockDomEx.snew());
		this.g.getActorMgr().add(actor);
		
		var r_isIdle = [true];
		this.mm.mock(actor, 'isIdle', r_isIdle);
		this.mm.mock(EffectManager, 'addMapEffect');
		
		var action = {event:'effect', userid:0, targetid:1};
		assertEQ ( this.lc()._updateEffectEvent(action), true );
		assertEQ ( this.mm.params['addMapEffect'], [actor.isHero(), action] );
		
		this.mm.clear();
		r_isIdle[0] = false;
		assertEQ ( this.lc()._updateEffectEvent(action), false );
		
		this.mm.clear();
		action = {event:'effect', userid:1, targetid:2};
		assertEQ ( this.lc()._updateEffectEvent(action), true );
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__updateAddEffectEvent = function(){
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setParent(MockDomEx.snew());
		this.g.getActorMgr().add(actor);
		
		var r_isIdle = [false];
		this.mm.mock(actor, 'isIdle', r_isIdle);
		
		var action = {event:'addeff', id:0};
		assertEQ ( this.lc()._updateAddEffectEvent(action), true );
		
		action = {event:'addeff', id:1};
		assertEQ ( this.lc()._updateAddEffectEvent(action), false );
		
		this.mm.mock(EffectManager, 'createEffects', [[{name:'effect1'},{name:'effect2'}]] );
		this.mm.mock(actor.getEffectContainer(), 'add');
		r_isIdle[0] = true;
		assertEQ ( this.lc()._updateAddEffectEvent(action), true );
		assertEQ ( this.mm.params['createEffects'], [actor, action] );
		assertEQ ( this.mm.params['add.0'], [{name:'effect1'}] );
		assertEQ ( this.mm.params['add.1'], [{name:'effect2'}] );
	};
	
	this.test__updateRemoveEffectEvent = function(){
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setParent(MockDomEx.snew());
		this.g.getActorMgr().add(actor);
		
		var r_isIdle = [false];
		this.mm.mock(actor, 'isIdle', r_isIdle);
		
		var action = {event:'removeeff', id:0, };
		assertEQ ( this.lc()._updateRemoveEffectEvent(action), true );
		
		action = {event:'removeeff', id:1, effuid:2};
		assertEQ ( this.lc()._updateRemoveEffectEvent(action), false );
		
		this.mm.mock(actor.getEffectContainer(), 'remove');
		r_isIdle[0] = true;
		assertEQ ( this.lc()._updateRemoveEffectEvent(action), true );
		assertEQ ( this.mm.params['remove'], [2] );
	};
	
	this.test__resetWallActorAction = function(){
		var actor1 = Actor.snew(this.g);  actor1.setId(1); actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setParent(MockDomEx.snew());
		var actor2 = Actor.snew(this.g);  actor2.setId(2); actor2.setType(ACTOR_TYPE.SOLDIER); actor2.setParent(MockDomEx.snew());
		var actor3 = Actor.snew(this.g);  actor3.setId(3); actor3.setType(ACTOR_TYPE.WALL); actor3.setParent(MockDomEx.snew());
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.g.getActorMgr().setMainWallId(10);
		
		var action = {event:'unkown', userid:1, targetid:2, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'unkown', userid:1, targetid:2, seq:0, subseq:0});
		
		var action = {event:'attack', userid:1, targetid:2, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'attack', userid:1, targetid:2, seq:0, subseq:0});
		
		var action = {event:'attack', userid:1, targetid:3, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'attack', userid:1, targetid:10, seq:0, subseq:0});
			
		var action = {event:'attack', userid:1, targetid:3, seq:0, subseq:0,effects:[{userid:1, targetid:3},{userid:1, targetid:20},{userid:1}]};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'attack', userid:1, targetid:10, seq:0, subseq:0,effects:[{userid:1, targetid:10},{userid:1, targetid:20},{userid:1}]});
		
		var action = {event:'attack', userid:1, targetid:30, seq:0, subseq:0,effects:[{userid:1, targetid:30}]};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'attack', userid:1, targetid:30, seq:0, subseq:0,effects:[{userid:1, targetid:30}]});

		var action = {event:'die', id:1, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'die', id:1, seq:0, subseq:0});
		
		var action = {event:'die', id:20, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'die', id:20, seq:0, subseq:0});
		
		var action = {event:'die', id:3, seq:0, subseq:0};
		this.lc()._resetWallActorAction(action);
		assertEQ ( action, {event:'die', id:10, seq:0, subseq:0});
	};
	
	this.test__updateStateEvent = function(){
		assertEQ (this.lc()._updateStateEvent({event:'invalid'}), true);
		
		var actor = Actor.snew(this.g);  actor.setId(1); actor.setParent(MockDomEx.snew());
		var actor2 = Actor.snew(this.g);  actor2.setId(2); actor2.setParent(MockDomEx.snew());
		this.g.getActorMgr().add(actor);
		this.g.getActorMgr().add(actor2);
		
		var r_isIdle = [false];
		var r_isIdle2 = [true];
		this.mm.mock(actor, 'isIdle', r_isIdle);
		this.mm.mock(actor2, 'isIdle', r_isIdle2);
		
		assertEQ (this.lc()._updateStateEvent({event:'move', id:1}), false);
		assertEQ (this.lc()._updateStateEvent({event:'attack', userid:1, targetid:3}), false);
		
		this.mm.mock(StateFactory, 'createByType', [{name:'state'}]);
		this.mm.mock(this.lc(), '_convertMoveActionPaths', [{name:'newAction'}]);
		this.mm.mock(actor, 'setState');
		
		this.mm.clear();
		r_isIdle[0] = true;
		var action = {event:'attack', userid:1, targetid:2, seq:1, subseq:2};
		assertEQ (this.lc()._updateStateEvent(action), true);
		assertEQ ( this.mm.params['_convertMoveActionPaths'], [action]);
		assertEQ ( this.mm.params['createByType'], [actor, actor2, 'attackstate', {name:'newAction'}]);
		assertEQ ( this.mm.params['setState'], [{name:'state'}]);
		
		this.mm.clear();
		r_isIdle2[0] = false;
		assertEQ (this.lc()._updateStateEvent(action), false);
		
		this.mm.clear();
		r_isIdle2[0] = true;
		this.lc().m_rounds[0] = [{event:'attack', userid:1, targetid:2, seq:1, subseq:1}];
		assertEQ (this.lc()._updateStateEvent(action), false, '有前置的子序列动作还没完成');
		
		this.mm.clear();
		var action = {event:'attack', userid:1, targetid:20, seq:0, subseq:0};
		assertEQ (this.lc()._updateStateEvent(action), true);
		assertEQ ( this.mm.walkLog, 'isIdle' );
	};
	
	this.test__removeDeletedActions = function(){
		var actions = [{event:'addeff', isDelete:true},{event:'removeeff'}];
		this.lc()._removeDeletedActions(actions);
		assertEQ ( actions, [{event:'removeeff'}] );

		actions = [{event:'removeeff', isDelete:true} ];
		this.lc()._removeDeletedActions(actions);
		assertEQ ( actions, [] );
	};

	this.test__getStateType = function(){
		assertEQ ( this.lc()._getStateType({event:'move'}), 'movestate' );
		assertEQ ( this.lc()._getStateType({event:'attack'}), 'attackstate' );
		assertEQ ( this.lc()._getStateType({event:'miss'}), 'attackstate' );
		assertEQ ( this.lc()._getStateType({event:'berserk'}), 'attackstate' );
		assertEQ ( this.lc()._getStateType({event:'die'}), 'diestate' );
		assertEQ ( this.lc()._getStateType({event:'no'}), null );
	};
	
	this.test__convertMoveActionPaths = function(){
		this.showRounds.setMapPosInfo({x:1, y:2}, 50);
		var action = {event:'move', paths:[{x:1, y:2},{x:3, y:4}] };
		assertEQ ( this.lc()._convertMoveActionPaths(action), {event:'move', paths:[{x:1*50 + 1, y:2*50 + 2},{x:3*50 + 1, y:4*50 + 2}] } );
		assertEQ ( action, {event:'move', paths:[{x:1, y:2},{x:3, y:4}] } );
		
		action = {event:'die'};
		assertEQ ( this.lc()._convertMoveActionPaths(action), action );
	};
});

TestShowFightResult = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var fightDemo = {id:1, actions:[{event:"fightstart"},{event:"fightstart", attacker:{role:{name:'role'}}}], result:[{result:0},{result:1}]};
		this.g.getImgr().getFightDemos().push(fightDemo);
		this.dlg = MockDialog.snew();
		this.items = {map:MockDomEx.snew()};
		this.showResult = ShowFightResult.snew(this.g, this.dlg, this.items);
		this.showResult.initFight(1, 2);
		this.lc = this.showResult.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_dlg, this.dlg );
		assertEQ ( this.lc().m_items, this.items );
	};
	
	this.test_initFight = function(){
		this.lc().m_resultAnim = NullPngAnim.snew();
		this.mm.mock(this.lc().m_resultAnim, 'stop');
		
		var armyId = 1;
		var fightId = 2;
		this.showResult.initFight(armyId, fightId);
		assertEQ ( this.mm.walkLog, 'stop' );
		assertEQ ( this.lc().m_resultAnim, null );
		assertEQ ( this.lc().m_armyId, armyId );
		assertEQ ( this.lc().m_fightId, fightId );
	};
	
	this.test_update = function(){
		this.lc()._startResultEffect();
		var r_isResultEffectEnd = [false];
		var r_isResultUIShow = [true];
		this.mm.mock(this.lc(), '_startResultEffect');
		this.mm.mock(this.lc().m_resultAnim, 'isEnd', r_isResultEffectEnd);
		this.mm.mock(this.lc(), '_isResultUIShow', r_isResultUIShow);
		this.mm.mock(this.lc(), '_showResultUI' );
		this.mm.mock(this.lc(), '_showResultUI' );
		
		this.showResult.update();
		assertEQ ( this.mm.walkLog, '_startResultEffect,isEnd' );
		
		this.mm.clear();
		r_isResultEffectEnd[0] = true;
		this.showResult.update();
		assertEQ ( this.mm.walkLog, '_startResultEffect,isEnd,_isResultUIShow' );
		
		this.mm.clear();
		r_isResultUIShow[0] = false;
		this.showResult.update();
		assertEQ ( this.mm.walkLog, '_startResultEffect,isEnd,_isResultUIShow,_showResultUI' );
	};
	
	this.test__startResultEffect = function(){
		var anim = this.g.getAnimMgr().alloc(this.items.map, this.lc().C_RESULT_ANIMID);
		this.mm.mock(this.g.getAnimMgr(), 'alloc', [anim]);
		this.mm.mock(this.lc(), '_getResultAnimPos', [{x:1, y:2}] );
		this.mm.mock(anim, 'setZIndex' );
		this.mm.mock(anim, 'setPosition' );
		this.mm.mock(anim, 'play' );
		
		this.g.getImgr().getRoleRes().name = 'role';
		this.lc()._startResultEffect();
		assertEQ ( this.lc().m_resultAnim, anim );
		assertEQ ( this.mm.params['alloc'], [this.items.map, this.lc().C_RESULT_WIN_ANIMID] );
		assertEQ ( this.mm.params['setZIndex'], [this.lc().C_RESULT_ZINDEX] );
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}] );
		assertEQ ( this.mm.params['play'], [] );
		
		this.mm.clear();
		this.g.getImgr().getRoleRes().name = 'role1';
		this.lc()._startResultEffect();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_resultAnim = null;
		this.lc()._startResultEffect();
		assertEQ ( this.mm.params['alloc'], [this.items.map, this.lc().C_RESULT_FAIL_ANIMID] );
	};
	
	this.test__getResultAnimPos = function(){
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:800}] );
		this.lc()._startResultEffect();
		this.mm.mock(this.lc().m_resultAnim, 'getSize', [{cx:100, cy:200}] );
		assertEQ (this.lc()._getResultAnimPos(), {x:(1000-100)/2, y:(800-200)/2} );
	};
	
	this.test__isResultUIShow = function(){
		var r_isShow = [false];
		this.mm.mock(UIM.getDlg('fightresult'), 'isShow', r_isShow );
		assertEQ ( this.lc()._isResultUIShow(), false );
		r_isShow[0] = true;
		assertEQ ( this.lc()._isResultUIShow(), true );
	};
	
	this.test__showResultUI = function(){
		this.mm.mock(UIM.getDlg('fightresult'), 'openDlg');
		this.mm.mock(UIM.getDlg('fightresult'), 'setHideCaller');
		this.lc()._showResultUI();
		assertEQ ( this.mm.params['openDlg'], [1, 2] );
		assertEQ ( this.mm.params['setHideCaller'], [{self:this.showResult, caller:this.lc()._hideFightMapDlg}] );
	};
	
	this.test__hideFightMapDlg = function(){
		this.mm.mock(this.lc().m_dlg, 'hide');
		this.lc()._hideFightMapDlg();
		assertEQ ( this.mm.walkLog, 'hide' );
	};
	
	this.test_showResultUI_whenWorldBoss = function(){
		this.showResult.initFight(1, 2, {type:'worldboss', hurt:10});
		this.mm.mock(UIM.getDlg('worldbossresult'), 'openDlg');
		this.mm.mock(UIM.getDlg('worldbossresult'), 'setHideCaller');
		this.showResult.update();
		assertEQ ( UIM.getDlg('fightresult').isShow(), false );
		assertEQ ( this.mm.params['openDlg'], [{hurt:10}] );
		assertEQ ( this.mm.params['setHideCaller'], [{self:this.showResult, caller:this.lc()._hideFightMapDlg}] );
	};
});

TestCaseWorldBossResultDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = WorldBossResultDlg.snew(this.g);
		this.dlg.openDlg({hurt:11000});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:true, title:rstr.military.worldbossresult.title, pos:{x:"center", y:100}, uicfg:uicfg.military.worldbossresult} );
	};
	
	this.test_initDesc = function(){
		assertEQ ( TQ.getTextEx(this.dlg.getItems().desc), TQ.format(rstr.military.worldbossresult.result, RStrUtil.formatResNumStr(11000)) );
	};
	
	this.test_setHideCaller = function(){
		var called = false;
		this.dlg.setHideCaller({self:this, caller:function(){
			called = true;
			}});
		this.dlg.hideDlg();
		assertEQ ( called, true );
	};
});	


tqGifAnimation_t_main = function(suite) {
	suite.addTestCase(TestEffectContainer, 'TestEffectContainer');
	suite.addTestCase(TestNullProgressBar, 'TestNullProgressBar');
	suite.addTestCase(TestCaseActor, 'TestCaseActor');
	suite.addTestCase(TestCaseActorManager, 'TestCaseActorManager');
	suite.addTestCase(TestCaseFightMapDlg, 'TestCaseFightMapDlg');
	suite.addTestCase(TestCaseFightMapDlgSizer, 'TestCaseFightMapDlgSizer');
	suite.addTestCase(TestCaseShowFight, 'TestCaseShowFight');
	suite.addTestCase(TestCaseShowSingleHeroFight, 'TestCaseShowSingleHeroFight');
	suite.addTestCase(TestCaseShowSoldiersFight, 'TestCaseShowSoldiersFight');
	suite.addTestCase(TestCaseShowRounds, 'TestCaseShowRounds');
	suite.addTestCase(TestShowFightResult, 'TestShowFightResult');
	suite.addTestCase(TestCaseWorldBossResultDlg, 'TestCaseWorldBossResultDlg');
};
