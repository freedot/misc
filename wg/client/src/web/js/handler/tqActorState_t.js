/*******************************************************************************/
requireEx('./handler/tqActorState.js', [
]);

TestCaseStateFactory = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initOneTime = function(){
		StateFactory.initOneTime(this.g);
		assertEQ ( StateFactory.g, this.g );
	};
	
	this.test_createByType_nullstate = function(){
		assertEQ ( StateFactory.createByType(null, null, null, null), NullState );
	};	
	
	this.test_createByType_standstate = function(){
		var actor = Actor.snew(this.g);
		this.mm.travelMock(StandState, 'snew');
		assertEQ ( StateFactory.createByType(actor, null, 'standstate', null) instanceof StandState, true );
		assertEQ ( this.mm.params['snew'], [actor]);
	};
	
	this.test_createByType_lockedstate = function(){
		var actor = Actor.snew(this.g);
		this.mm.travelMock(LockedState, 'snew');
		assertEQ ( StateFactory.createByType(actor, null, 'lockedstate', null) instanceof LockedState, true );
		assertEQ ( this.mm.params['snew'], [actor]);
	};
	
	this.test_createByType_hurtstate = function(){
		var actor = Actor.snew(this.g);
		var action = {id:1};
		this.mm.travelMock(HurtState, 'snew');
		assertEQ ( StateFactory.createByType(null, actor, 'hurtstate', action) instanceof HurtState, true );
		assertEQ ( this.mm.params['snew'], [this.g, actor, action]);
	};
	
	this.test_createByType_attackstate = function(){
		var user = Actor.snew(this.g);
		var target = Actor.snew(this.g);
		var action = {id:1};
		this.mm.travelMock(AttackState, 'snew');
		assertEQ ( StateFactory.createByType(user, target, 'attackstate', action) instanceof AttackState, true );
		assertEQ ( this.mm.params['snew'], [user, target, action]);
	};
	
	this.test_createByType_diestate = function(){
		var actor = Actor.snew(this.g);
		var target = Actor.snew(this.g);
		var action = {id:1};
		this.mm.travelMock(DieState, 'snew');
		assertEQ ( StateFactory.createByType(actor, null, 'diestate', action) instanceof DieState, true );
		assertEQ ( this.mm.params['snew'], [this.g, actor]);
	};
	
	this.test_createByType_movestate = function(){
		var actor = Actor.snew(this.g);
		actor.setPosition({x:1, y:2});
		var action = {paths:[{x:3, y:4}, {x:5, y:6}]};
		this.mm.travelMock(MoveState, 'snew:snewMoveState');
		this.mm.mock(StateFactory, '_createRoute', [{name:'route'}]);
		
		assertEQ ( StateFactory.createByType(actor, null, 'movestate', action) instanceof MoveState, true );
		assertEQ ( this.mm.params['_createRoute'], [{x:1, y:2}, [{x:3, y:4}, {x:5, y:6}]]);
		assertEQ ( this.mm.params['snewMoveState'], [actor, {name:'route'}]);
	};
	
	this.test_createByType_errorstate = function(){
		assertEQ ( StateFactory.createByType(null, null, 'errorstate', null), NullState );
	};
	
	this.test__createRoute = function(){
		this.mm.travelMock(MoveRoute, 'snew');
		
		var startPos = {x:1, y:2};
		var paths = [{x:1, y:2}, {x:3, y:4}];
		assertEQ ( StateFactory._createRoute(startPos, paths) instanceof MoveRoute, true );
		assertEQ ( this.mm.params['snew'], [ this.g, StateFactory.C_MOVESPEED, [{x:1, y:2}, {x:3, y:4}]  ]);
		
		startPos = {x:1, y:2};
		paths = [{x:3, y:4}, {x:5, y:6}];
		assertEQ ( StateFactory._createRoute(startPos, paths) instanceof MoveRoute, true );
		assertEQ ( this.mm.params['snew'], [ this.g, StateFactory.C_MOVESPEED, [{x:1, y:2}, {x:3, y:4}, {x:5, y:6}]  ]);
	};
});

TestCaseNullState = TestCase.extern(function(){
	this.test_isIdle = function(){
		assertEQ ( NullState.isIdle(), true );
	};
	
	this.test_start = function(){
		NullState.start();
	};
	
	this.test_update = function(){
		NullState.update();
	};
});

TestCaseStandState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actor = Actor.snew(this.g);
		this.state = StandState.snew(this.actor);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.actor, this.actor );
	};
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(),  true );
	};
	
	this.test_start = function(){
		this.mm.mock(this.actor, 'setAction');
		this.state.start();
		assertEQ ( this.mm.params['setAction'], ['stand'] );
	};
	
	this.test_update = function(){
		this.state.update();
	};
});

TestCaseLockedState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actor = Actor.snew(this.g);
		this.state = LockedState.snew(this.actor);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.actor, this.actor );
	};
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(),  false );
		this.state.update();
		assertEQ ( this.state.isIdle(),  false );
	};
	
	this.test_start = function(){
		this.mm.mock(this.actor, 'setAction');
		this.state.start();
		assertEQ ( this.mm.params['setAction'], ['stand'] );
	};
	
	this.test_update = function(){
		this.state.update();
	};
});

TestCaseMoveState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actor = Actor.snew(this.g);
		this.route = MoveRoute.snew(this.g, 100, [{x:1, y:2},{x:3, y:4}]);
		this.state = MoveState.snew(this.actor, this.route);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.actor, this.actor );
		assertEQ ( this.state.route, this.route );
	};
	
	this.test_start = function(){
		this.mm.mock(this.actor, 'setAction');
		this.state.start();
		assertEQ ( this.mm.params['setAction'], ['walk'] );
	};
	
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(),  false );
	};
	
	this.test_update = function(){
		var r_isEnd = [false];
		this.mm.mock(this.route, 'update');
		this.mm.mock(this.route, 'getPosition', [{x:1, y:2}]);
		this.mm.mock(this.route, 'getDirection', [1]);
		this.mm.mock(this.route, 'isEnd', r_isEnd);
		this.mm.mock(this.actor, 'setPosition');
		this.mm.mock(this.actor, 'setDirection');
		this.mm.mock(this.actor, 'setState');
		this.mm.mock(StateFactory, 'createByType', [{name:'standState'}]);
		
		this.state.update();
		assertEQ ( this.mm.walkLog, 'update,getPosition,setPosition,getDirection,setDirection,isEnd' );
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}] );
		assertEQ ( this.mm.params['setDirection'], [1] );
		
		this.mm.clear();
		r_isEnd[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'update,getPosition,setPosition,getDirection,setDirection,isEnd,createByType,setState' );
		assertEQ ( this.mm.params['createByType'], [this.actor, null, 'standstate', {}] );
		assertEQ ( this.mm.params['setState'], [{name:'standState'}]   );
	};
});

TestCaseAttackState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.source = Actor.snew(this.g);
		this.target = Actor.snew(this.g);
		this.action = {event:'attack'};
		this.source.setPosition({x:0, y:1});
		this.target.setPosition({x:0, y:2});
		this.state = AttackState.snew(this.source, this.target, this.action);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.source, this.source);
		assertEQ ( this.state.target, this.target);
		assertEQ ( this.state.action, this.action);
	};
	
	this.test_start = function(){
		this.mm.mock(this.source, 'setAction');
		this.mm.travelMock(this.source, 'setDirection');
		this.mm.mock(this.source.getAnim(), 'addCaller');
		this.state.start();
		assertEQ ( this.mm.walkLog, 'setAction,setDirection,addCaller' );
		assertEQ ( this.mm.params['setAction'], ['attack'] );
		assertEQ ( this.mm.params['addCaller'], [{self:this.state, caller:this.state._onAnimStop}] );
		assertEQ ( this.source.getDirection(), 2 );
	};
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(),  false );
	};
	
	this.test_update = function(){
		var r_isTriggerTime = [false];
		var r_isEnd = [false];
		var r_isSkillEnd = [false];
		var r_skill = ActorSkill.snew(this.source.getParent(), this.action, this.source, this.target);
		this.mm.mock(this.source.getAnim(), 'isTriggerTime', r_isTriggerTime);
		this.mm.mock(this.source.getAnim(), 'setTriggered');
		this.mm.mock(this.source.getAnim(), 'isEnd', r_isEnd);
		this.mm.mock(SkillManager, 'addSkill', [r_skill] );
		this.mm.mock(this.source, 'setState');
		this.mm.mock(StateFactory, 'createByType', [{name:'standState'}]);
		this.mm.mock(r_skill, 'isEnd:isSkillEnd', r_isSkillEnd);
		
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd' );
		
		this.mm.clear();
		r_isTriggerTime[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,setTriggered,addSkill,isEnd' );
		assertEQ ( this.mm.params['addSkill'], [this.source.getParent(), this.action, this.source, this.target] );
		assertEQ ( this.state.skill_, r_skill );
		
		this.mm.clear();
		this.state.skill_ = null;
		r_isTriggerTime[0] = false;
		r_isEnd[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd' );
		
		this.mm.clear();
		this.state.skill_ = r_skill;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd,isSkillEnd' );
		
		this.mm.clear();
		r_isSkillEnd[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd,isSkillEnd,createByType,setState' );
		assertEQ ( this.mm.params['createByType'], [this.source, null, 'standstate', {}] );
		assertEQ ( this.mm.params['setState'], [{name:'standState'}] );
	};
	
	this.test__onAnimStop = function(){
		this.mm.mock(this.state, 'update');
		this.mm.mock(this.source, 'setState');
		this.mm.mock(StateFactory, 'createByType', [{name:'standState'}]);		
		this.state._onAnimStop();
		assertEQ ( this.mm.walkLog, 'update,createByType,setState');
		assertEQ ( this.mm.params['createByType'], [this.source, null, 'standstate', {}] );
		assertEQ ( this.mm.params['setState'], [{name:'standState'}] );
	};
	
	this.test_end = function(){
		this.mm.mock(this.source.getAnim(), 'removeCaller');
		this.state.end();
		assertEQ ( this.mm.params['removeCaller'], [{self:this.state, caller:this.state._onAnimStop}] );
	};
});

TestCaseHurtState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actorMgr = ActorManager.snew();
		this.actor = Actor.snew(this.g);
		this.action = {event:'attack'};
		this.state = HurtState.snew(this.g, this.actor, this.action);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.actor, this.actor);
		assertEQ ( this.state.action, this.action);
	};
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(), false );
	};
	
	this.test_start = function(){	
		this.mm.mock(this.actor, 'setAction');
		this.mm.mock(this.actor.getAnim(), 'addCaller');
		this.state.start();
		assertEQ ( this.mm.params['setAction'], ['hurt'] );
		assertEQ ( this.mm.params['addCaller'], [{self:this.state, caller:this.state._onAnimStop}] );
	};
	
	this.test_update = function(){
		var r_isTriggerTime = [false];
		var r_isEnd = [false];
		this.mm.mock(this.actor.getAnim(), 'isTriggerTime', r_isTriggerTime);
		this.mm.mock(this.actor.getAnim(), 'setTriggered');
		this.mm.mock(this.actor.getAnim(), 'isEnd', r_isEnd);
		this.mm.mock(EffectManager, 'addMapEffect');
		this.mm.mock(this.actor, 'setState');
		this.mm.mock(StateFactory, 'createByType', [{name:'standState'}]);
		
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd' );
		
		this.mm.clear();
		r_isTriggerTime[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,setTriggered,addMapEffect,isEnd' );
		assertEQ ( this.mm.params['addMapEffect'], [this.actor.isHero(), this.action] );
		
		this.mm.clear();
		r_isTriggerTime[0] = false;
		r_isEnd[0] = true;
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isTriggerTime,isEnd,createByType,setState' );
		assertEQ ( this.mm.params['createByType'], [this.actor, null, 'standstate', {}] );
		assertEQ ( this.mm.params['setState'], [{name:'standState'}] );
	};
	
	this.test__onAnimStop = function(){
		this.mm.mock(this.state, 'update');
		this.mm.mock(this.actor, 'setState');
		this.mm.mock(StateFactory, 'createByType', [{name:'standState'}]);		
		this.state._onAnimStop();
		assertEQ ( this.mm.walkLog, 'update,createByType,setState' );
		assertEQ ( this.mm.params['createByType'], [this.actor, null, 'standstate', {}] );
		assertEQ ( this.mm.params['setState'], [{name:'standState'}] );
	};
	
	this.test_end = function(){
		this.mm.mock(this.actor.getAnim(), 'removeCaller');
		this.state.end();
		assertEQ ( this.mm.params['removeCaller'], [{self:this.state, caller:this.state._onAnimStop}] );
	};
});

TestCaseDieState = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.actorMgr = this.g.getActorMgr();
		this.actor = Actor.snew(this.g);
		this.action = {event:'die'};
		this.state = DieState.snew(this.g, this.actor);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.state.actor, this.actor );
	};
	
	this.test_isIdle = function(){
		assertEQ ( this.state.isIdle(), true );
	};
	
	this.test_start = function(){
		this.mm.mock(this.actor, 'setAction');
		this.state.start();
		assertEQ ( this.mm.params['setAction'], ['die'] );
	};
	
	this.test_update = function(){
		var r_isEnd = [false];
		this.mm.mock(this.actor.getAnim(), 'isEnd', r_isEnd);
		this.mm.mock(this.actor, 'die');
		this.mm.mock(this.actorMgr, 'remove');
		
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isEnd' );
		
		this.mm.clear();
		r_isEnd[0] = true
		this.state.update();
		assertEQ ( this.mm.walkLog, 'isEnd,die,remove' );
		assertEQ ( this.mm.params['remove'], [this.actor] );
	};
});

tqActorState_t_main = function(suite) {
	suite.addTestCase(TestCaseStateFactory, 'TestCaseStateFactory');
	suite.addTestCase(TestCaseNullState, 'TestCaseNullState');
	suite.addTestCase(TestCaseStandState, 'TestCaseStandState');
	suite.addTestCase(TestCaseLockedState, 'TestCaseLockedState');
	suite.addTestCase(TestCaseMoveState, 'TestCaseMoveState');
	suite.addTestCase(TestCaseAttackState, 'TestCaseAttackState');
	suite.addTestCase(TestCaseHurtState, 'TestCaseHurtState');
	suite.addTestCase(TestCaseDieState, 'TestCaseDieState');
};
