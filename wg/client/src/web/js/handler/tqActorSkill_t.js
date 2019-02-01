/*******************************************************************************/
requireEx('./handler/tqActorSkill.js', [
	{
		start:'//SkillAttackPhase-unittest-start'
		,end:'//SkillAttackPhase-unittest-end'
		,items:['m_anim']
	}
	,{
		start:'//SkillFlyPhase-unittest-start'
		,end:'//SkillFlyPhase-unittest-end'
		,items:['m_g', 'm_resId', 'm_anim', 'm_parent', 'm_route', 'm_isStarted', 'm_isTriggering', 'm_isTriggered', '_isCanUpdate', '_recreateAnim']
	}
	,{
		start:'//SkillHurtPhase-unittest-start'
		,end:'//SkillHurtPhase-unittest-end'
		,items:['m_g', 'm_action', 'm_targetActor', 'm_anim', 'm_isStarted', 'm_isTriggered']
	}
	,{
		start:'//SkillPhaseFactory-unittest-start'
		,end:'//SkillPhaseFactory-unittest-end'
		,items:['m_g', '_getSkillRes']
	}
	,{
		start:'//ActorSkill-unittest-start'
		,end:'//ActorSkill-unittest-end'
		,items:['m_phases'
			,'_updatePhaseAndTriggerNext'
			]
	}
	,{
		start:'//SkillManager-unittest-start'
		,end:'//SkillManager-unittest-end'
		,items:['m_g', 'm_this', 'm_skills', '_onUpdate']
	}
]);

TestCaseNullSkillPhase = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.nullPhase = NullSkillPhase.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_start = function(){
		this.nullPhase.start();
	};
	
	this.test_update = function(){
		this.nullPhase.update();
	};
	
	this.test_isTriggerTime = function(){
		assertEQ ( this.nullPhase.isTriggerTime(), true );
	};
	
	this.test_setTriggered = function(){
		assertEQ ( this.nullPhase.isTriggerTime(), true );
		this.nullPhase.setTriggered();
		assertEQ ( this.nullPhase.isTriggerTime(), false );
	};
	
	this.test_isEnd = function(){
		assertEQ ( this.nullPhase.isEnd(), true );
	};
});

TestCaseSkillAttackPhase = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew('div');
		this.resId = 100;
		this.sourceActor = Actor.snew(this.g);
		this.phase = SkillAttackPhase.snew(this.g, this.parent, this.resId, this.sourceActor);
		this.lc = this.phase.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g.getAnimMgr(), 'allocEffect', [{name:'effectAnim'}]);
		this.phase.init(this.g, this.parent, this.resId, this.sourceActor);
		assertEQ ( this.mm.params['allocEffect'], [this.resId, this.sourceActor.getDirection(), this.parent] );
		assertEQ ( this.lc().m_anim, {name:'effectAnim'});
	};
	
	this.test_start = function(){
		this.mm.mock(this.lc().m_anim, 'play');
		this.phase.start();
		assertEQ( this.mm.walkLog, 'play' );
	};
	
	this.test_update = function(){
		this.phase.update();
	};
	
	this.test_isTriggerTime = function(){
		var r_isTriggerTime=[false];
		this.mm.mock(this.lc().m_anim, 'isTriggerTime', r_isTriggerTime);
		assertEQ ( this.phase.isTriggerTime(), false );
		
		r_isTriggerTime[0] = true;
		this.mm.mock(this.lc().m_anim, 'isTriggerTime', r_isTriggerTime);
		assertEQ ( this.phase.isTriggerTime(), true );
	};
	
	this.test_setTriggered = function(){
		this.mm.mock(this.lc().m_anim, 'setTriggered');
		this.phase.setTriggered();
		assertEQ ( this.mm.walkLog, 'setTriggered' );
	};
	
	this.test_isEnd = function(){
		var r_isEnd = [false];
		this.mm.mock(this.lc().m_anim, 'isEnd', r_isEnd);
		assertEQ ( this.phase.isEnd(), false );
		r_isEnd[0] = true;
		assertEQ ( this.phase.isEnd(), true );
	};
});

TestCaseSkillFlyPhase = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew('div');
		this.resId = 100;
		this.speed = 200;
		this.sourceActor = Actor.snew(this.g); this.sourceActor.setPosition({x:1, y:2});
		this.targetActor = Actor.snew(this.g); this.targetActor.setPosition({x:3, y:4});
		this.phase = SkillFlyPhase.snew(this.g, this.parent, this.resId, this.speed, this.sourceActor, this.targetActor);
		this.lc = this.phase.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(MoveRoute, 'snew', [{name:'route'}]);
		this.phase.init(this.g, this.parent, this.resId, this.speed, this.sourceActor, this.targetActor);
		assertEQ ( this.mm.params['snew'], [this.g, this.speed, [{x:1, y:2},{x:3, y:4}]] );
		assertEQ ( this.lc().m_route, {name:'route'} );
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_resId, this.resId );
		assertEQ ( this.lc().m_parent, this.parent );
		assertEQ ( this.lc().m_anim instanceof NullPngAnim, true );
	};
	
	this.test_start = function(){
		assertEQ ( this.lc().m_isStarted, false );
		this.phase.start();
		assertEQ ( this.lc().m_isStarted, true );
	};
	
	this.test_update = function(){
		this.lc().m_isTriggering = false;
		
		var r_isCanUpdate = [false];
		var r_isEnd = [false];
		this.mm.mock(this.lc(), '_isCanUpdate', r_isCanUpdate);
		this.mm.mock(this.lc().m_route, 'update');
		this.mm.mock(this.lc().m_route, 'getDirection', [1]);
		this.mm.mock(this.lc(), '_recreateAnim' );
		this.mm.mock(this.lc().m_route, 'getPosition', [{x:1, y:2}]);
		this.mm.mock(this.lc().m_anim, 'setPosition' );
		this.mm.mock(this.lc().m_route, 'isEnd', r_isEnd);
		this.mm.mock(this.lc().m_anim, 'stop');
		this.phase.update();
		assertEQ ( this.mm.walkLog, '_isCanUpdate');
		
		this.mm.clear();
		r_isCanUpdate[0] = true;
		this.phase.update();
		assertEQ ( this.mm.walkLog, '_isCanUpdate,update,getDirection,_recreateAnim,getPosition,setPosition,isEnd');
		assertEQ ( this.mm.params['_recreateAnim'], [1]);
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}]);
		assertEQ ( this.lc().m_isTriggering, false );
		
		this.mm.clear();
		r_isEnd[0] = true;
		this.phase.update();
		assertEQ ( this.mm.walkLog, '_isCanUpdate,update,getDirection,_recreateAnim,getPosition,setPosition,isEnd,stop');
		assertEQ ( this.lc().m_isTriggering, true );
	};
	
	this.test_isTriggerTime = function(){
		this.lc().m_isTriggering = false;
		this.lc().m_isTriggered = false;
		assertEQ ( this.phase.isTriggerTime(), false );
		
		this.lc().m_isTriggering = true;
		this.lc().m_isTriggered = true;
		assertEQ ( this.phase.isTriggerTime(), false );
		
		this.lc().m_isTriggering = true;
		this.lc().m_isTriggered = false;
		assertEQ ( this.phase.isTriggerTime(), true );
	};
	
	this.test_setTriggered = function(){
		this.lc().m_isTriggered = false;
		this.phase.setTriggered();
		assertEQ ( this.lc().m_isTriggered, true );
	};
	
	this.test_isEnd = function(){
		this.lc().m_isTriggered = false;
		this.lc().m_isTriggering = false;
		assertEQ ( this.phase.isEnd(), false );
		
		this.lc().m_isTriggering = true;
		assertEQ ( this.phase.isEnd(), false );
		
		this.lc().m_isTriggered = true;
		assertEQ ( this.phase.isEnd(), true );
	};	
	
	this.test__isCanUpdate = function(){
		var r_isEnd = [true];
		this.mm.mock(this.lc().m_route, 'isEnd', r_isEnd);
		this.lc().m_isStarted = false;
		assertEQ ( this.lc()._isCanUpdate(), false);
		
		this.lc().m_isStarted = true;
		assertEQ ( this.lc()._isCanUpdate(), false);
		
		r_isEnd[0] = false;
		assertEQ ( this.lc()._isCanUpdate(), true);
	};
	
	this.test__recreateAnim = function(){
		this.mm.mock(this.lc().m_anim, 'getId', [this.g.getAnimMgr().makeAvatarAnimId(this.resId,1,0)]);
		this.mm.mock(this.lc().m_anim, 'stop');
		var newAnim = this.g.getAnimMgr().allocEffect(this.resId, 2, this.parent);
		this.mm.mock(this.g.getAnimMgr(), 'allocEffect',  [newAnim]);
		this.mm.mock(newAnim, 'play');
		
		this.lc()._recreateAnim(1);
		assertEQ ( this.mm.walkLog, 'getId'  );
		
		this.mm.clear();
		this.lc()._recreateAnim(2);
		assertEQ ( this.mm.walkLog, 'getId,stop,allocEffect,play'  );
		assertEQ ( this.mm.params['allocEffect'], [this.resId,2, this.parent] );
		assertEQ ( this.lc().m_anim, newAnim);
	};
});

TestCaseSkillHurtPhase = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew('div');
		this.resId = 100;
		this.action = {event:'attack'};
		this.targetActor = Actor.snew(this.g); 
		this.targetActor.setPosition({x:1, y:2});
		this.phase = SkillHurtPhase.snew(this.g, this.parent, this.resId, this.action, this.targetActor);
		this.lc = this.phase.lc;	
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g.getAnimMgr(), 'allocEffect', [{name:'anim'}]);
		this.phase.init(this.g, this.parent, this.resId, this.action, this.targetActor);
		assertEQ ( this.lc().m_g, this.g  );
		assertEQ ( this.lc().m_action, this.action  );
		assertEQ ( this.lc().m_targetActor, this.targetActor  );
		assertEQ ( this.lc().m_anim, {name:'anim'} );
		assertEQ ( this.mm.params['allocEffect'], [this.resId, this.targetActor.getDirection(), this.parent] );
	};
	
	this.test_start = function(){
		assertEQ(this.lc().m_isStarted, false);
		this.mm.mock(this.lc().m_anim, 'play');
		this.mm.mock(this.lc().m_anim, 'setPosition');
		this.phase.start();
		assertEQ( this.mm.walkLog, 'play,setPosition' );
		assertEQ( this.mm.params['setPosition'], [{x:1, y:2}] );
		assertEQ(this.lc().m_isStarted, true);
	};
	
	this.test_update = function(){
		var r_isTriggerTime = [false];
		this.mm.mock(this.lc().m_anim, 'isTriggerTime', r_isTriggerTime);
		this.mm.mock(this.lc().m_anim, 'setTriggered');
		this.mm.mock(StateFactory, 'createByType', [{name:'hurtState'}]);
		this.mm.mock(this.targetActor, 'setState');
		
		this.phase.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime' );
		
		this.mm.clear();
		r_isTriggerTime[0] = true;
		this.phase.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,setTriggered,createByType,setState' );
		assertEQ ( this.mm.params['createByType'], [null, this.targetActor, 'hurtstate', this.action] );
		assertEQ ( this.mm.params['setState'], [{name:'hurtState'}] );
	};
	
	this.test_isTriggerTime = function(){	
		this.lc().m_isStarted = false;
		this.lc().m_isTriggered = true;
		var r_isEnd = [false];
		this.mm.mock(this.lc().m_anim, 'isEnd', r_isEnd);
		
		assertEQ ( this.phase.isTriggerTime(), false );
		
		this.lc().m_isStarted = true;
		assertEQ ( this.phase.isTriggerTime(), false );
		
		this.lc().m_isTriggered = false;
		assertEQ ( this.phase.isTriggerTime(), false );
		
		r_isEnd[0] = true;
		assertEQ ( this.phase.isTriggerTime(), true );
	};
	
	this.test_setTriggered = function(){
		assertEQ(this.lc().m_isTriggered, false);
		this.phase.setTriggered();
		assertEQ(this.lc().m_isTriggered, true);
	};
	
	this.test_isEnd = function(){
		var r_isEnd = [false];
		this.mm.mock(this.lc().m_anim, 'isEnd', r_isEnd);
		assertEQ ( this.phase.isEnd(), false );
		r_isEnd[0] = true;
		assertEQ ( this.phase.isEnd(), true );
	};
});

TestCaseSkillPhaseFactory = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.lc = SkillPhaseFactory.lc;
		this.parent = MockDomEx.snew('div');
		this.action = {event:'attack'};
		this.invalidAction = {event:'effect', skillId:1};
		this.sourceActor = Actor.snew(this.g); this.sourceActor.setPosition({x:1, y:2}); this.sourceActor.setType(ACTOR_TYPE.SOLDIER); this.sourceActor.setResId(150001);
		this.targetActor = Actor.snew(this.g); this.targetActor.setPosition({x:3, y:4});
		
		res_cltskills = [ 
			 {id:150001, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // 刀兵
			,{id:150002, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // 戟兵
			,{id:150003, phases:{attack:{id:0}, fly:{id:1001, speed:100}, hurt:{id:0}} }  // 弓兵
			,{id:150004, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // 骑兵
			,{id:150005, phases:{attack:{id:0}, fly:{id:1002, speed:100}, hurt:{id:0}} }  // 器械
			,{id:150101, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // HERO MAN
			,{id:150102, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // HERO WOMEN
			,{id:150201, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:0}} }  // WALL
			,{id:150301, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:1003}} }  // DEF -- XIANJING
			,{id:150302, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:1004}} }  // DEF -- GUNMU
			,{id:150303, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:1005}} }  // DEF -- JUMA
			,{id:150304, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:1006}} }  // DEF -- LEISHI
			,{id:150305, phases:{attack:{id:0}, fly:{id:0, speed:0}, hurt:{id:1007}} }  // DEF -- NUJIAN
		];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initOneTime = function(){
		SkillPhaseFactory.initOneTime(this.g);
		assertEQ ( this.lc().m_g, this.g );
	};
	
	this.test_createAttackPhase = function(){
		this.mm.mock(SkillAttackPhase, 'snew', [{name:'attackPhase'}] );
		assertEQ ( SkillPhaseFactory.createAttackPhase(this.parent, this.invalidAction, this.sourceActor) instanceof NullSkillPhase, true );
		
		assertEQ ( SkillPhaseFactory.createAttackPhase(this.parent, this.action, this.sourceActor), {name:'attackPhase'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.parent, 0, this.sourceActor] );
	};
	
	this.test_createFlyPhase = function(){
		this.mm.mock(SkillFlyPhase, 'snew', [{name:'flyPhase'}] );
		assertEQ ( SkillPhaseFactory.createFlyPhase(this.parent, this.invalidAction, this.sourceActor, this.targetActor) instanceof NullSkillPhase, true );
		
		assertEQ ( SkillPhaseFactory.createFlyPhase(this.parent, this.action, this.sourceActor, this.targetActor), {name:'flyPhase'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.parent, 0, 0, this.sourceActor, this.targetActor] );
	};
	
	this.test_createHurtPhase = function(){
		this.mm.mock(SkillHurtPhase, 'snew', [{name:'hurtPhase'}] );
		assertEQ ( SkillPhaseFactory.createHurtPhase(this.parent, this.invalidAction, this.sourceActor, this.targetActor) instanceof NullSkillPhase, true );
		
		assertEQ ( SkillPhaseFactory.createHurtPhase(this.parent, this.action, this.sourceActor, this.targetActor), {name:'hurtPhase'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.parent, 0, this.action, this.targetActor] );
	};
	
	this.test__getSkillRes = function(){
		var sourceActor = Actor.snew(this.g); 
		sourceActor.setType(ACTOR_TYPE.SOLDIER);
		sourceActor.setResId(150001);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[0] );
		assertEQ ( this.lc()._getSkillRes({event:'miss'}, sourceActor), res_cltskills[0] );
		assertEQ ( this.lc()._getSkillRes({event:'berserk'}, sourceActor), res_cltskills[0] );
		assertEQ ( this.lc()._getSkillRes({event:'effect'}, sourceActor), null );
		sourceActor.setResId(150002);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[1] );
		sourceActor.setResId(150003);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[2] );
		sourceActor.setResId(150004);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[3] );
		sourceActor.setResId(150005);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[4] );
		
		sourceActor.setType(ACTOR_TYPE.HERO);
		sourceActor.setIcon(101);
		sourceActor.setResId(150101);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[5] );
		sourceActor.setIcon(201);
		sourceActor.setResId(150102);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[6] );
		
		sourceActor.setType(ACTOR_TYPE.WALL);
		sourceActor.setResId(150201);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[7] );
		
		sourceActor.setType(ACTOR_TYPE.DEF);
		sourceActor.setResId(150301);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[8] );
		sourceActor.setResId(150302);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[9] );
		sourceActor.setResId(150303);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[10] );
		sourceActor.setResId(150304);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[11] );
		sourceActor.setResId(150305);
		assertEQ ( this.lc()._getSkillRes({event:'attack'}, sourceActor), res_cltskills[12] );
	};
});

TestCaseActorSkill = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew('div');
		this.action = {event:'attack'};
		this.sourceActor = Actor.snew(this.g); this.sourceActor.setPosition({x:1, y:2});
		this.targetActor = Actor.snew(this.g); this.targetActor.setPosition({x:3, y:4});
		this.skill = ActorSkill.snew(this.parent, this.action, this.sourceActor, this.targetActor);
		this.lc = this.skill.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.lc().m_phases = [];
		this.mm.mock(SkillPhaseFactory, 'createAttackPhase', [{name:'attackPhase'}]);
		this.mm.mock(SkillPhaseFactory, 'createFlyPhase', [{name:'flyPhase'}]);
		this.mm.mock(SkillPhaseFactory, 'createHurtPhase', [{name:'hurtPhase'}]);
		this.mm.mock(NullSkillPhase, 'snew', [{name:'nullPhase'}]);
		this.skill.init(this.parent, this.action, this.sourceActor, this.targetActor);
		assertEQ ( this.lc().m_phases, [{name:'attackPhase'},{name:'flyPhase'},{name:'hurtPhase'},{name:'nullPhase'}] );
		assertEQ ( this.mm.params['createAttackPhase'], [this.parent, this.action, this.sourceActor] );
		assertEQ ( this.mm.params['createFlyPhase'], [this.parent, this.action, this.sourceActor, this.targetActor] );
		assertEQ ( this.mm.params['createHurtPhase'], [this.parent, this.action, this.sourceActor, this.targetActor] );
	};
	
	this.test_start = function(){
		this.mm.mock(this.lc().m_phases[0], 'start:start0');
		this.mm.mock(this.lc().m_phases[1], 'start:start1');
		this.mm.mock(this.lc().m_phases[2], 'start:start2');
		this.mm.mock(this.lc().m_phases[3], 'start:start3');
		this.skill.start();
		assertEQ ( this.mm.walkLog, 'start0' );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updatePhaseAndTriggerNext');
		this.lc().m_phases = ['phase1', 'phase2', 'phase3'];
		this.skill.update();
		assertEQ ( this.mm.walkLog, '_updatePhaseAndTriggerNext,_updatePhaseAndTriggerNext' );
		assertEQ ( this.mm.params['_updatePhaseAndTriggerNext.0'], ['phase1', 'phase2'] );
		assertEQ ( this.mm.params['_updatePhaseAndTriggerNext.1'], ['phase2', 'phase3'] );
	};
	
	this.test_isEnd = function(){
		var phase1 = NullSkillPhase.snew();
		var phase2 = NullSkillPhase.snew();
		
		var r_isEnd1 = [false];
		var r_isEnd2 = [false];
		this.mm.mock(phase1, 'isEnd', r_isEnd1 );
		this.mm.mock(phase2, 'isEnd', r_isEnd2 );
		
		this.lc().m_phases = [phase1, phase2];
		assertEQ ( this.skill.isEnd(), false );
		
		r_isEnd1[0] = true;
		assertEQ ( this.skill.isEnd(), false );
		
		r_isEnd2[0] = true;
		assertEQ ( this.skill.isEnd(), true );
	};
	
	this.test__updatePhaseAndTriggerNext = function(){
		var prePhase = NullSkillPhase.snew();
		var nextPhase = NullSkillPhase.snew();
		
		var r_isTriggerTime = [false];
		this.mm.mock(prePhase, 'update');
		this.mm.mock(prePhase, 'isTriggerTime', r_isTriggerTime);
		this.mm.mock(prePhase, 'setTriggered');
		this.mm.mock(nextPhase, 'start');
		
		this.lc()._updatePhaseAndTriggerNext(prePhase, nextPhase);
		assertEQ ( this.mm.walkLog, 'update,isTriggerTime' );
		
		this.mm.clear();
		r_isTriggerTime[0] = true;
		this.lc()._updatePhaseAndTriggerNext(prePhase, nextPhase);
		assertEQ ( this.mm.walkLog, 'update,isTriggerTime,setTriggered,start' );
	};
});

TestCaseSkillManager = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.lc = SkillManager.lc;
		
		this.parent = MockDomEx.snew('div');
		this.action = {event:'attack'};
		this.sourceActor = Actor.snew(this.g); this.sourceActor.setPosition({x:1, y:2});
		this.targetActor = Actor.snew(this.g); this.targetActor.setPosition({x:3, y:4});
		this.skill = ActorSkill.snew(this.parent, this.action, this.sourceActor, this.targetActor);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initOneTime = function(){
		SkillManager.initOneTime(this.g);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, SkillManager );
	};
	
	this.test_addSkill = function(){
		this.lc().m_skills = [];
		this.mm.mock(ActorSkill, 'snew', [this.skill]);
		this.mm.mock(this.skill, 'start');
		this.mm.mock(this.g, 'regUpdater');
		assertEQ ( SkillManager.addSkill(this.parent, this.action, this.sourceActor, this.targetActor), this.skill);
		assertEQ ( this.mm.walkLog, 'snew,start,regUpdater' );
		assertEQ ( this.mm.params['snew'], [this.parent, this.action, this.sourceActor, this.targetActor] );
		assertEQ ( this.mm.params['regUpdater'], [SkillManager, this.lc()._onUpdate, 10] );
		assertEQ ( this.lc().m_skills, [this.skill] );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.g, 'unregUpdater');
		
		this.lc().m_skills = [];
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, 'unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater'], [SkillManager, this.lc()._onUpdate] );

		this.mm.clear();
		var skill1 = ActorSkill.snew(this.parent, this.action, this.sourceActor, this.targetActor);
		var skill2 = ActorSkill.snew(this.parent, this.action, this.sourceActor, this.targetActor);
		this.mm.mock(skill1, 'isEnd:isEnd1', [true]);
		this.mm.mock(skill1, 'update:update1');
		this.mm.mock(skill2, 'isEnd:isEnd2', [false]);
		this.mm.mock(skill2, 'update:update2');
		this.lc().m_skills = [skill1, skill2];
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, 'update2,isEnd2,update1,isEnd1' );
		assertEQ ( this.lc().m_skills, [skill2] );
	};	
});

tqActorSkill_t_main = function(suite) {
	suite.addTestCase(TestCaseNullSkillPhase, 'TestCaseNullSkillPhase');
	suite.addTestCase(TestCaseSkillAttackPhase, 'TestCaseSkillAttackPhase');
	suite.addTestCase(TestCaseSkillFlyPhase, 'TestCaseSkillFlyPhase');
	suite.addTestCase(TestCaseSkillHurtPhase, 'TestCaseSkillHurtPhase');
	suite.addTestCase(TestCaseSkillPhaseFactory, 'TestCaseSkillPhaseFactory');
	suite.addTestCase(TestCaseActorSkill, 'TestCaseActorSkill');
	suite.addTestCase(TestCaseSkillManager, 'TestCaseSkillManager');
};
