/*******************************************************************************/
requireEx('./handler/tqActorEffect.js', [
	{
		start:'//ActorEffect-unittest-start'
		,end:'//ActorEffect-unittest-end'
		,items:[
		]
		,appends:[
			'_getOffsetZIndex = function(){ return m_offsetZIndex; }'
			,'_getOffsetPos = function(){ return m_offsetPos; }'
			,'_getZIndex = function(){ return m_zIndex; }'
			,'_getPosition = function(){ return m_pos; }'
		]
	}
	,{
		start:'//ActorValueEffect-unittest-start'
		,end:'//ActorValueEffect-unittest-end'
		,items:[
			'm_value'
			,'m_effect'
		]
		,appends:[
			'_getColor = function(){ return TQ.getCSS(m_effect.getEntity().getDomObj(), "color"); }'
			,'_getFontSize = function(){ return parseInt(TQ.getCSS(m_effect.getEntity().getDomObj(), "fontSize")); }'
			,'_getFontWeight = function(){ return TQ.getCSS(m_effect.getEntity().getDomObj(), "fontWeight"); }'
		]
	}
	,{
		start:'//ActorAnimEffect-unittest-start'
		,end:'//ActorAnimEffect-unittest-end'
		,items:[
			'm_animId'
			,'m_anim'
		]
	}
	,{
		start:'//EffectManager-unittest-start'
		,end:'//EffectManager-unittest-end'
		,items:[
			'm_g'
			,'C_ADDEFF_BASE'
			,'C_HEROEFF_BASE'
			,'m_effectsCfg'
			,'_addMapEffect'
		]
	}
]);

TestCaseActorEffect = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.baseEffect = ActorEffect.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setId = function(){
		this.baseEffect.setId(1);
		assertEQ ( this.baseEffect.getId(), 1 );
	};
	
	this.test_getId = function(){
		this.test_setId();
	};
	
	this.test_setOffsetZIndex = function(){
		this.baseEffect.setOffsetZIndex(1);
		assertEQ ( this.baseEffect._getOffsetZIndex(), 1);
	};
	
	this.test_setOffsetPos = function(){
		this.baseEffect.setOffsetPos({x:1, y:2});
		assertEQ ( this.baseEffect._getOffsetPos(), {x:1, y:2});
	};
	
	this.test_setZIndex = function(){
		this.mm.mock(this.baseEffect, 'update');
		this.baseEffect.setOffsetPos({x:10, y:20});
		this.baseEffect.setOffsetZIndex(2);
		this.baseEffect.setZIndex(1);
		assertEQ ( this.baseEffect._getZIndex(), 1);
		assertEQ ( this.mm.params['update'], [3, {x:10, y:20}] );
	};
	
	this.test_setPosition = function(){
		this.mm.mock(this.baseEffect, 'update');
		this.baseEffect.setOffsetZIndex(2);
		this.baseEffect.setOffsetPos({x:10, y:20});
		this.baseEffect.setPosition({x:1, y:2});
		assertEQ ( this.baseEffect._getPosition(), {x:1, y:2});
		assertEQ ( this.mm.params['update'], [2, {x:11, y:22}] );
	};
	
	this.test_getAddHP = function(){
		assertEQ ( this.baseEffect.getAddHP(), 0 );
	};
	
	this.test_getSubHP = function(){
		assertEQ ( this.baseEffect.getSubHP(), 0 );
	};
	
	this.test_destory = function(){
		this.baseEffect.destory(); // do nothing
	};
});

TestCaseActorValueEffect = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew();
		this.valueEffect = ActorValueEffect.snew(this.g, this.parent);
		this.lc = this.valueEffect.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var numEffect = this.g.getEntityfactory().allocNumEffect(this.parent);
		this.mm.mock(this.g.getEntityfactory(), 'allocNumEffect', [numEffect] );
		this.mm.mock(numEffect, 'setSize');
		this.mm.mock(numEffect.getEntity(), 'setClass:setClassFront');
		this.mm.mock(numEffect.getBakEntity(), 'setClass:setClassBack');
		
		var valueEffect =  ActorValueEffect.snew(this.g, this.parent);
		assertEQ ( valueEffect.lc().m_effect, numEffect );
		assertEQ ( this.mm.params['allocNumEffect'], [this.parent]);
		assertEQ ( this.mm.params['setSize'], [{cx:100, cy:30}]);
		assertEQ ( this.mm.params['setClassFront'], ['actorValueEffect_front']);
		assertEQ ( this.mm.params['setClassBack'], ['actorValueEffect_back']);
	};
	
	this.test_setValue = function(){
		this.mm.mock(this.lc().m_effect, 'setNumber');
		this.valueEffect.setValue(10);
		assertEQ ( this.mm.params['setNumber'], [10]); 
		assertEQ ( this.lc().m_value, 10);
	};
	
	this.test_setColor = function(){
		this.mm.travelMock(TQ, 'setCSS' );
		this.valueEffect.setColor('red');
		assertEQ ( this.valueEffect._getColor(), 'red' );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_effect.getEntity().getDomObj(), 'color', 'red'] );
	};
	
	this.test_setFontSize = function(){
		this.mm.travelMock(TQ, 'setCSS' );
		this.valueEffect.setFontSize(12);
		assertEQ ( this.valueEffect._getFontSize(), 12 );
		assertEQ ( this.mm.walkLog, 'setCSS,setCSS' );
		assertEQ ( this.mm.params['setCSS.0'], [this.lc().m_effect.getEntity().getDomObj(), 'fontSize', '12px'] );
		assertEQ ( this.mm.params['setCSS.1'], [this.lc().m_effect.getBakEntity().getDomObj(), 'fontSize', '12px'] );
		
		this.mm.clear();
		var isBold = true;
		this.valueEffect.setFontSize(26, isBold);
		assertEQ ( this.valueEffect._getFontSize(), 26 );
		assertEQ ( this.mm.walkLog, 'setCSS,setCSS,setCSS,setCSS' );
		assertEQ ( this.mm.params['setCSS.0'], [this.lc().m_effect.getEntity().getDomObj(), 'fontSize', '26px'] );
		assertEQ ( this.mm.params['setCSS.1'], [this.lc().m_effect.getBakEntity().getDomObj(), 'fontSize', '26px'] );
		assertEQ ( this.mm.params['setCSS.2'], [this.lc().m_effect.getEntity().getDomObj(), 'fontWeight', 'bold'] );
		assertEQ ( this.mm.params['setCSS.3'], [this.lc().m_effect.getBakEntity().getDomObj(), 'fontWeight', 'bold'] );
		
	};
	
	this.test_setSubHP = function(){
		this.valueEffect.setSubHP(1);
		assertEQ ( this.valueEffect.getSubHP(), 1 );
	};
	
	this.test_getSubHP = function(){
		assertEQ ( this.valueEffect.getSubHP(), 0 );
	};
	
	this.test_setAddHP = function(){
		this.valueEffect.setAddHP(1);
		assertEQ ( this.valueEffect.getAddHP(), 1);
	};
	
	this.test_getAddHP = function(){
		assertEQ ( this.valueEffect.getAddHP(), 0 );
	};
	
	this.test_play = function(){
		this.mm.mock(this.lc().m_effect, 'start');
		this.mm.mock(EUPD, 'appendEffect');
		this.valueEffect.play();
		assertEQ ( this.mm.walkLog, 'start,appendEffect' );
		assertEQ ( this.mm.params['appendEffect'], [this.lc().m_effect, this.g.getEntityfactory().freeNumEffect] );
		
		this.mm.clear();
		this.valueEffect.play();
		assertEQ ( this.mm.walkLog, '', 'is playing' );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc().m_effect, 'setPos');
		this.mm.mock(this.lc().m_effect, 'setZOrder');
		this.valueEffect.update(1000, {x:1, y:2});
		assertEQ ( this.mm.params['setPos'], [{x:1, y:2}] );
		assertEQ ( this.mm.params['setZOrder'], [1000] );
	};
});

TestCaseActorAnimEffect = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parent = MockDomEx.snew();
		this.animId = 10000;
		this.animEffect = ActorAnimEffect.snew(this.g, this.parent, this.animId);
		this.lc = this.animEffect.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.travelMock(this.g.getAnimMgr(), 'alloc');
		this.animEffect.init(this.g, this.parent, this.animId);
		assertEQ ( this.mm.params['alloc'], [this.animId, this.parent] );
		assertNotEQ ( this.lc().m_anim, null );
	};
	
	this.test_play = function(){
		this.mm.mock(this.lc().m_anim, 'play');
		this.animEffect.play();
		assertEQ ( this.mm.walkLog, 'play' );
		
		this.mm.clear();
		this.animEffect.play();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc().m_anim, 'setZIndex');
		this.mm.mock(this.lc().m_anim, 'setPosition');
		this.animEffect.update(1000, {x:1, y:2});
		assertEQ ( this.mm.params['setZIndex'], [1000] );
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}] );
	};
	
	this.test_destory = function(){
		this.mm.mock(this.lc().m_anim, 'stop');
		this.animEffect.destory();
		assertEQ ( this.mm.walkLog, 'stop' );
	};
});

TestCaseEffectManager = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.lc = EffectManager.lc;
		this.parent = MockDomEx.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initOneTime = function(){
		EffectManager.initOneTime(this.g);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test_addMapEffect = function(){
		this.mm.mock(this.lc(), '_addMapEffect');
		var action = {effects:[  {effid:RES_EFF.F_CLT_SUBHP, val:1}, {effid:RES_EFF.F_CLT_MISS}  ]};
		EffectManager.addMapEffect(true, action);
		assertEQ ( this.mm.walkLog, '_addMapEffect,_addMapEffect' );
		assertEQ ( this.mm.params['_addMapEffect.0'], [true, action.effects[0]] );
		assertEQ ( this.mm.params['_addMapEffect.1'], [true, action.effects[1]] );
		
		this.mm.clear();
		action = { effid:RES_EFF.F_CLT_MISS};
		EffectManager.addMapEffect(true, action);
		assertEQ ( this.mm.params['_addMapEffect'], [true, action] );
	};
	
	this.test__addMapEffect = function(){
		var effect = ActorValueEffect.snew(this.g, this.parent);
		this.mm.mock(EffectManager, 'createEffects', [ [effect] ])
		this.mm.mock(effect, 'getAddHP', [1]);
		this.mm.mock(effect, 'getSubHP', [12000]);
		this.mm.mock(effect, 'play');
		var actor1 = Actor.snew(this.g); actor1.setType(ACTOR_TYPE.SOLDIER); actor1.setParent(this.parent); actor1.setId(1); actor1.setPosition({x:1, y:2});
		var actor2 = Actor.snew(this.g); actor2.setType(ACTOR_TYPE.SOLDIER); actor2.setParent(this.parent); actor2.setId(2); actor2.setPosition({x:1, y:3});
		var actor3 = Actor.snew(this.g); actor3.setType(ACTOR_TYPE.DEF); actor3.setResId(150304); actor3.setParent(this.parent); actor3.setId(3); actor3.setPosition({x:1, y:4});
		this.g.getActorMgr().add(actor1);
		this.g.getActorMgr().add(actor2);
		this.g.getActorMgr().add(actor3);
		this.mm.mock(actor1, 'subHP:subHP1');
		this.mm.mock(actor1, 'addHP:addHP1');
		this.mm.mock(actor2, 'addHP:addHP2');
		this.mm.mock(actor2, 'subHP:subHP2');
		this.mm.mock(actor3, 'addHP:addHP3');
		this.mm.mock(actor3, 'subHP:subHP3');
		
		var effectRes = {userid:1, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:1};
		this.lc()._addMapEffect(true, effectRes);
		assertEQ ( this.mm.walkLog, 'createEffects,getAddHP,addHP2,getSubHP,subHP2,play' );
		assertEQ ( this.mm.params['createEffects'], [actor2, effectRes] );
		assertEQ ( this.mm.params['addHP2'], [1] );
		assertEQ ( this.mm.params['subHP2'], [12000] );
		assertEQ ( this.mm.params['play'], [] );
		assertEQ ( effect._getZIndex(), actor2.getZIndex());
		assertEQ ( effect._getPosition(), actor2.getPosition());
		
		this.mm.clear();
		var effectRes = {userid:3, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:1};
		this.lc()._addMapEffect(true, effectRes);
		assertEQ ( this.mm.walkLog, 'createEffects,getAddHP,addHP2,getSubHP,subHP2,getSubHP,subHP3,play' );
		assertEQ ( this.mm.params['subHP3'], [2] );
	};
	
	this.test_createEffects = function(){
		var actor = Actor.snew(this.g); actor.setParent(this.parent); actor.setId(2); actor.setPosition({x:1, y:2});
		
		var effectAction = { };
		assertEQ ( EffectManager.createEffects(actor, effectAction), [] );
		
		actor.setType(ACTOR_TYPE.SOLDIER);
		actor.setHP(1000, 90);
		actor.setUnitHP(10);
		var cfgs = this.lc().m_effectsCfg[RES_EFF.F_CLT_SUBHP];
		cfgs[0].isBold = true;
		effectAction = { effid:RES_EFF.F_CLT_SUBHP, val:100 };
		var effects = EffectManager.createEffects(actor, effectAction);
		assertEQ ( effects.length, cfgs.length );
		effect = effects[0];
		cfg = cfgs[0];
		assertEQ ( effect instanceof ActorValueEffect, true );
		assertEQ ( effect.lc().m_value, Math.min(90/10, 100/10) );
		assertEQ ( effect._getOffsetPos(), {x:cfg.pos.x - 50, y:cfg.pos.y} );
		assertEQ ( effect._getOffsetZIndex(), cfg.zIndex );
		assertEQ ( effect._getFontSize(), cfg.fontSize );
		assertEQ ( effect._getFontWeight(), 'bold' );
		assertEQ ( effect._getColor(), cfg.color );
		assertEQ ( effect.getSubHP(), 100);
		
		actor.setHP(1000, 910);
		actor.setUnitHP(10);
		cfgs = this.lc().m_effectsCfg[RES_EFF.F_XIXUE];
		effectAction = { effid:RES_EFF.F_XIXUE, val:100 };
		effects = EffectManager.createEffects(actor, effectAction);
		assertEQ ( effects.length, cfgs.length );
		var effect1 = effects[0];
		var cfg1 = cfgs[0];
		assertEQ ( effect1 instanceof ActorAnimEffect, true );
		assertEQ ( effect1._getOffsetPos(), cfg1.pos );
		assertEQ ( effect1._getOffsetZIndex(), cfg1.zIndex );
		assertEQ ( effect1.lc().m_animId, cfg1.animId );
		var effect2 = effects[1];
		assertEQ ( effect2 instanceof ActorValueEffect, true );
		assertEQ ( effect2.lc().m_value, Math.min(100/10, (1000-910)/10) );		
		assertEQ ( effect2.getAddHP(), 100);
		
		cfgs = this.lc().m_effectsCfg[RES_EFF.F_CLT_MISS];
		effectAction = { effid:RES_EFF.F_CLT_MISS, val:'miss' };
		effects = EffectManager.createEffects(actor, effectAction);
		assertEQ ( effects.length, cfgs.length );
		var effect = effects[0];
		assertEQ ( effect instanceof ActorValueEffect, true );
		assertEQ ( effect.lc().m_value, 'miss');		
		assertEQ ( effect.getAddHP(), 0);
		assertEQ ( effect.getSubHP(), 0);
		
		cfgs = this.lc().m_effectsCfg[RES_EFF.F_ADD_FULLATTRS + this.lc().C_ADDEFF_BASE];
		effectAction = { event:'addeff', effid:RES_EFF.F_ADD_FULLATTRS, val:1 };
		effects = EffectManager.createEffects(actor, effectAction);
		effect1 = effects[0];
		cfg1 = cfgs[0];
		assertEQ ( effects.length, cfgs.length );
		assertEQ ( effect1 instanceof ActorAnimEffect, true );
		assertEQ ( effect1._getOffsetPos(), cfg1.pos );
		assertEQ ( effect1._getOffsetZIndex(), cfg1.zIndex );
		assertEQ ( effect1.lc().m_animId, cfg1.animId );
		
		actor.setType(ACTOR_TYPE.HERO);
		cfgs = this.lc().m_effectsCfg[RES_EFF.F_ADD_FULLATTRS + this.lc().C_ADDEFF_BASE + this.lc().C_HEROEFF_BASE];
		effectAction = { event:'addeff', effid:RES_EFF.F_ADD_FULLATTRS, val:1 };
		effects = EffectManager.createEffects(actor, effectAction);
		effect1 = effects[0];
		cfg1 = cfgs[0];
		assertEQ ( effects.length, cfgs.length );
		assertEQ ( effect1 instanceof ActorAnimEffect, true );
		assertEQ ( effect1._getOffsetPos(), cfg1.pos );
		assertEQ ( effect1._getOffsetZIndex(), cfg1.zIndex );
		assertEQ ( effect1.lc().m_animId, cfg1.animId );
	};
});

tqActorEffect_t_main = function(suite) {
	suite.addTestCase(TestCaseActorEffect, 'TestCaseActorEffect');
	suite.addTestCase(TestCaseActorValueEffect, 'TestCaseActorValueEffect');
	suite.addTestCase(TestCaseActorAnimEffect, 'TestCaseActorAnimEffect');
	suite.addTestCase(TestCaseEffectManager, 'TestCaseEffectManager');
};
