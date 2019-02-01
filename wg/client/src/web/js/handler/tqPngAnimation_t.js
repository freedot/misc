/*******************************************************************************/
requireEx('./handler/tqPngAnimation.js', [
	{
		start:'//NullPngAnim-unittest-start'
		,end:'//NullPngAnim-unittest-end'
		,items:['m_isTrigered','m_playStarted']
	}
	,{
		start:'//PngAnimation-unittest-start'
		,end:'//PngAnimation-unittest-end'
		,items:['C_DRTTIME'
			,'m_this' 
			,'m_g' 
			,'m_dom'
			,'m_parentDom'
			,'m_animationRes'
			,'m_timer'
			,'m_duration'
			,'m_curFrame'
			,'m_nextFrameTime'
			,'m_playTimes'
			,'m_isFrameChanged'
			,'m_frameDoms'
			,'m_caller'
			,'m_isTrigered'
			,'m_playStarted'
			,'_createDom'
			,'_createFrameDoms'
			,'_createFrameDom'
			,'_loadFrameImage'
			,'_onTimer'
			,'_initFrame'
			,'_incDuration'
			,'_isPlayTimesEnd'
			,'_isCurFrameEnd'
			,'_showCurFrame'
			,'_moveNextFrame'
			,'_getFrameCount'
			,'_getCurFrameInterval'
			,'_remove'
			,'_setPlayStartFlag'
			]
	}
]);
	
log = function(){};

TestCasePngAnimMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mgr = PngAnimMgr.snew(this.g);
		
		res_animations = [
			{id:100006, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:3000101, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:3000201, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:4000101, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:6000100, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:6000101, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
			,{id:6000102, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, center:{x:0, y:0}, frameCount:12, frameInterval:100}
		];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var mgr = PngAnimMgr.snew(this.g);
		assertEQ ( mgr.g, this.g );
		assertEQ ( mgr.freeAmins, {} );
	};
	
	this.test_alloc = function(){
		var resid = 100006;
		var res = TQ.qfind(res_animations, 'id', resid);
		var anim1 = PngAnimation.snew(this.g, TQ.getUiBody(), res);
		var anim2 = PngAnimation.snew(this.g, TQ.getUiBody(), res);
		
		var r_getFreeAmin = [anim1];
		var r_createAmin = [anim2];
		
		var resid = 100006;
		var res = TQ.qfind(res_animations, 'id', resid);
		var anim = PngAnimation.snew(this.g, TQ.getUiBody(), res);
		var animProxy = PngAnimProxy.snew(anim);
		
		this.mm.mock(this.mgr, '_allocFromFreeAmin', r_getFreeAmin);
		this.mm.mock(this.mgr, '_createAmin', r_createAmin);
		this.mm.mock(PngAnimProxy, 'snew', [animProxy]);
		this.mm.mock(animProxy, 'addCaller');
		this.mm.mock(anim1, 'attachTo');
		
		assertEQ ( this.mgr.alloc(resid), animProxy );
		assertEQ ( this.mm.walkLog, '_allocFromFreeAmin,attachTo,snew,addCaller' );
		assertEQ ( this.mm.params['_allocFromFreeAmin'], [resid] );
		assertEQ ( this.mm.params['attachTo'], [TQ.getUiBody()] );
		assertEQ ( this.mm.params['snew'], [anim1] );
		assertEQ ( this.mm.params['addCaller'], [{self:this.mgr, caller:this.mgr._onStop}] );
		
		this.mm.clear();
		r_getFreeAmin[0] = null;
		assertEQ ( this.mgr.alloc(resid), animProxy );
		assertEQ ( this.mm.walkLog, '_allocFromFreeAmin,_createAmin,snew,addCaller' );
		assertEQ ( this.mm.params['snew'], [anim2] );
		assertEQ ( this.mm.params['_createAmin'], [resid, TQ.getUiBody()] );
		
		this.mm.clear();
		r_getFreeAmin[0] = null;
		var parentDom = MockDomEx.snew('div');
		assertEQ ( this.mgr.alloc(resid, parentDom), animProxy );
		assertEQ ( this.mm.params['_createAmin'], [resid, parentDom] );
	};
	
	this.test_allocAvatar = function(){
		var p = {resId:300, dir:2, actionId:1};
		assertEQ ( this.mgr.allocAvatar(p.resId, p.dir, p.actionId).getId(), this.mgr.makeAvatarAnimId(p.resId, p.dir, p.actionId) );
		
		p = {resId:300, dir:3, actionId:1};
		assertEQ ( this.mgr.allocAvatar(p.resId, p.dir, p.actionId).getId(), this.mgr.makeAvatarAnimId(p.resId, 1, p.actionId) );
		
		p = {resId:400, dir:2, actionId:1};
		assertEQ ( this.mgr.allocAvatar(p.resId, p.dir, p.actionId).getId(), this.mgr.makeAvatarAnimId(p.resId, 1, 1) );
		
		p = {resId:500, dir:2, actionId:1};
		assertEQ ( this.mgr.allocAvatar(p.resId, p.dir, p.actionId).getId(), this.mgr.makeAvatarAnimId(0, 0, 0) );
	};
	
	this.test_allocEffect = function(){	
		var p = {resId:600, dir:1};
		assertEQ ( this.mgr.allocEffect(p.resId, p.dir).getId(), this.mgr.makeAvatarAnimId(p.resId, p.dir, 0) );
		
		p = {resId:600, dir:2};
		assertEQ ( this.mgr.allocEffect(p.resId, p.dir).getId(), this.mgr.makeAvatarAnimId(p.resId, 1, 0) );
		
		p = {resId:700, dir:2};
		assertEQ ( this.mgr.allocEffect(p.resId, p.dir).getId(), this.mgr.makeAvatarAnimId(0, 0, 0) );
	};
	
	this.test_makeAvatarAnimId = function(){
		var resId = 200;
		var dir = 1;
		var actionId = 2;
		assertEQ ( this.mgr.makeAvatarAnimId(resId, dir, actionId), 200*10000 + 1*100 + 2);
	};
	
	this.test__tryAlloc = function(){	
		var trys = [{resId:300, dir:2, actionId:1},{resId:300, dir:0, actionId:1},{resId:300, dir:0, actionId:0}];
		assertEQ ( this.mgr._tryAlloc(trys).getId(), this.mgr.makeAvatarAnimId(300, 2, 1) );
		
		trys = [{resId:300, dir:3, actionId:1},{resId:300, dir:2, actionId:1},{resId:300, dir:0, actionId:0}];
		assertEQ ( this.mgr._tryAlloc(trys).getId(), this.mgr.makeAvatarAnimId(300, 2, 1) );
		
		trys = [{resId:400, dir:2, actionId:1},{resId:400, dir:0, actionId:1},{resId:400, dir:1, actionId:1}];
		assertEQ ( this.mgr._tryAlloc(trys).getId(), this.mgr.makeAvatarAnimId(400, 1, 1) );
		
		trys = [{resId:500, dir:2, actionId:1},{resId:500, dir:0, actionId:1},{resId:500, dir:0, actionId:0}];
		assertEQ ( this.mgr._tryAlloc(trys).getId(), this.mgr.makeAvatarAnimId(0, 0, 0) );
	};
	
	this.test__allocFromFreeAmin = function(){
		var r_getFreeAminsByAnimId = [[]];
		this.mm.mock( this.mgr, '_getFreeAminsByAnimId', r_getFreeAminsByAnimId);
		assertEQ ( this.mgr._allocFromFreeAmin(100006), null );
		assertEQ ( this.mm.params['_getFreeAminsByAnimId'],  [100006] );
		
		r_getFreeAminsByAnimId[0] = [{name:'anim0'},{name:'anim1'}];
		assertEQ ( this.mgr._allocFromFreeAmin(100006), {name:'anim1'} );
		assertEQ ( this.mgr._allocFromFreeAmin(100006), {name:'anim0'} );
		assertEQ ( this.mgr._allocFromFreeAmin(100006), null );
	};
	
	this.test__createAmin = function(){
		var parentDom = MockDomEx.snew('div');
		this.mm.mock(PngAnimation, 'snew', [{name:'anim'}]);
		var resid = 100006;
		assertEQ ( this.mgr._createAmin(resid, parentDom), {name:'anim'} );
		assertEQ ( this.mm.params['snew'], [this.g, parentDom, TQ.qfind(res_animations, 'id', resid)] );
		
		resid = 1;
		assertEQ ( this.mgr._createAmin(resid, parentDom) instanceof NullPngAnim, true );
	};
	
	this.test__onStop = function(){
		var r_getFreeAminsByAnimId = [[]];
		this.mm.mock( this.mgr, '_getFreeAminsByAnimId', r_getFreeAminsByAnimId);
		
		var resid = 100006;
		var res = TQ.qfind(res_animations, 'id', resid);
		var anim = PngAnimation.snew(this.g, TQ.getUiBody(), res);
		this.mgr._onStop(anim);
		assertEQ ( this.mm.params['_getFreeAminsByAnimId'],  [100006] );
		assertEQ ( r_getFreeAminsByAnimId[0], [anim] );
		
		this.mm.clear();
		var anim = NullPngAnim.snew();
		this.mgr._onStop(anim);
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__getFreeAminsByAnimId = function(){
		var resid = 100006;
		this.mgr.freeAmins[resid] = [{name:'anim'}];
		assertEQ ( this.mgr._getFreeAminsByAnimId(resid), [{name:'anim'}]); 
		
		resid = 100007
		assertEQ ( this.mgr._getFreeAminsByAnimId(resid), []); 
	};
});

TestCaseNullPngAnim = TestCase.extern(function(){
	this.test_attachTo = function(){
		NullPngAnim.snew().attachTo(MockDomEx.snew('div'));
	};
	
	this.test_regCaller = function(){
		NullPngAnim.snew().regCaller({self:this, caller:this.test_regCaller});
	};
	
	this.test_getId = function(){
		assertEQ ( NullPngAnim.snew().getId(), 0 );
	};
	
	this.test_setZIndex = function(){
		NullPngAnim.snew().setZIndex(1);
	};
	
	this.test_setPosition = function(){
		NullPngAnim.snew().setPosition({x:1, y:2});
	};
	
	this.test_getSize = function(){
		assertEQ ( NullPngAnim.snew().getSize(), {cx:1, cy:1} );
	};
	
	this.test_play = function(){
		var nullAnim = NullPngAnim.snew();
		assertEQ ( nullAnim.lc().m_playStarted, false );
		nullAnim.play();
		assertEQ ( nullAnim.lc().m_playStarted, true );
	};
	
	this.test_stop = function(){
		NullPngAnim.snew().stop();
	};
	
	this.test_isTriggerTime = function(){
		var nullAnim = NullPngAnim.snew();
		assertEQ ( nullAnim.isTriggerTime(), false );
		
		nullAnim.play();
		assertEQ ( nullAnim.isTriggerTime(), true );
		
		nullAnim.setTriggered();
		assertEQ ( nullAnim.isTriggerTime(), false );
	};
	
	this.test_setTriggered = function(){
		var nullAnim = NullPngAnim.snew();
		assertEQ ( nullAnim.isTriggered(), false );
		nullAnim.setTriggered();
		assertEQ ( nullAnim.isTriggered(), true );
	};
	
	this.test_isEnd = function(){
		var nullAnim = NullPngAnim.snew();
		assertEQ ( nullAnim.isEnd(), false );
		
		nullAnim.play();
		assertEQ ( nullAnim.isEnd(), true );
	};
});

TestCasePngAnimProxy = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parentDom = MockDom.snew('div');
		this.animationRes1 = {id:100001, path:'effects/cityupgrade/', frameSize:{cx:100, cy:200}, playTimes:2, frameCount:5, frameInterval:10};
		this.animationRes2 = {id:100002, path:'effects/cityupgrade/', frameSize:{cx:100, cy:200}, playTimes:2, frames:[10,20,30]};
		this.anim = PngAnimation.snew(this.g, this.parentDom, this.animationRes1);
		this.proxy = PngAnimProxy.snew(this.anim);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.anim, 'regCaller');
		this.proxy.init(this.anim);
		assertEQ ( this.proxy.anim, this.anim)
		assertEQ ( this.mm.params['regCaller'], [{self:this.proxy, caller:this.proxy._onStop}] );
	};
	
	this.test_attachTo = function(){
		this.mm.mock(this.anim, 'attachTo');
		var newParent = MockDomEx.snew('div');
		this.proxy.attachTo(newParent);
		assertEQ ( this.mm.params['attachTo'], [newParent]);
	};
	
	this._onStop = function(anim){
		this._onStop_anim = anim;
	};
	
	this._onStop_2 = function(anim){
		this._onStop_anim = anim;
	};
	
	this.test_addCaller = function(){
		var caller = {self:this, caller:this._onStop};
		this.proxy.addCaller(caller);
		assertEQ ( this.proxy.callers, [caller]);
		
		this.proxy.addCaller(caller);
		assertEQ ( this.proxy.callers, [caller]);
		
		var caller2 = {self:this, caller:this._onStop_2};
		this.proxy.addCaller(caller2);
		assertEQ ( this.proxy.callers, [caller, caller2]);
	};
	
	this.test_removeCaller = function(){
		var caller = {self:this, caller:this._onStop};
		this.proxy.addCaller(caller);
		assertEQ ( this.proxy.callers, [caller]);
		this.proxy.removeCaller(caller);
		assertEQ ( this.proxy.callers, []);
	};
	
	this.test_regCaller = function(){
		var caller = {self:this, caller:this._onStop};
		this.proxy.regCaller(caller);
		assertEQ ( this.proxy.callers, [caller]);
		
		var caller2 = {self:this, caller:this._onStop_2};
		this.proxy.regCaller(caller2);
		assertEQ ( this.proxy.callers, [caller2]);
	};
	
	this.test_getId = function(){
		assertEQ ( this.proxy.getId(), this.anim.getId());
	};
	
	this.test_setZIndex = function(){
		this.mm.mock(this.anim, 'setZIndex');
		this.proxy.setZIndex(1);
		assertEQ ( this.mm.params['setZIndex'], [1]);
	};
	
	this.test_setPosition = function(){
		this.mm.mock(this.anim, 'setPosition');
		this.proxy.setPosition({x:1, y:2});
		assertEQ ( this.mm.params['setPosition'], [{x:1, y:2}]);
	};
	
	this.test_getSize = function(){
		assertEQ ( this.proxy.getSize(), this.anim.getSize());
	};
	
	this.test_play = function(){
		this.mm.mock(this.anim, 'play');
		this.proxy.play();
		assertEQ ( this.mm.walkLog, 'play' );
	};
	
	this.test_stop = function(){
		this.mm.mock(this.anim, 'stop');
		this.mm.mock(this.proxy, '_clearCallers');
		this.proxy.stop();
		assertEQ ( this.mm.walkLog, 'stop,_clearCallers' );
	};
	
	this.test_isEnd = function(){
		this.proxy.anim = NullPngAnim.snew();
		assertEQ ( this.proxy.isEnd(), false );
		this.proxy.anim.play();
		assertEQ ( this.proxy.isEnd(), true );
	};
	
	this.test_isTriggerTime = function(){
		this.mm.mock(this.anim, 'isTriggerTime', [true]);
		assertEQ ( this.proxy.isTriggerTime(), true );
	};

	this.test_setTriggered = function(){
		this.mm.mock(this.anim, 'setTriggered');
		this.proxy.setTriggered();
		assertEQ ( this.mm.walkLog, 'setTriggered' );
	};
	
	this.test_isTriggered = function(){
		this.mm.mock(this.anim, 'isTriggered', [true]);
		assertEQ ( this.proxy.isTriggered(), true );
	};
	
	this.test__onStop = function(){
		this.proxy._onStop(this.anim); // when not set caller
		
		this.proxy.regCaller({self:this, caller:this._onStop});
		this.proxy.anim = this.anim;
		this.proxy._onStop(this.anim);
		assertEQ ( this._onStop_anim, this.anim);
		assertEQ ( this.proxy.anim instanceof NullPngAnim, true);
		assertEQ ( this.proxy.anim.isEnd(), true );
		assertEQ ( this.proxy.anim.isTriggered(), false );
		
		this.proxy.anim = this.anim;
		this.anim.setTriggered();
		this.proxy._onStop(this.anim);
		assertEQ ( this.proxy.anim.isTriggered(), true );
	};
});
	
TestCasePngAnimation = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.parentDom = MockDom.snew('div');
		this.animationRes1 = {id:100001, path:'effects/cityupgrade/', frameSize:{cx:100, cy:200}, center:{x:1, y:2}, playTimes:2, frameCount:5, frameInterval:10};
		this.animationRes2 = {id:100002, path:'effects/cityupgrade/', frameSize:{cx:100, cy:200}, center:{x:1, y:2}, playTimes:2, frames:[10,20,30]};
		this.anim = PngAnimation.snew(this.g, this.parentDom, this.animationRes1);
		this.lc = this.anim.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_createDom');
		this.mm.mock(this.lc(), '_createFrameDoms');
		this.mm.mock(this.lc(), '_initFrame');
		this.anim.init(this.g, this.parentDom, this.animationRes1);
		assertEQ ( this.mm.walkLog, '_createDom,_createFrameDoms,_initFrame' );
		assertEQ ( this.lc().m_this, this.anim);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.lc().m_parentDom, this.parentDom);
		assertEQ ( this.lc().m_animationRes, this.animationRes1);
		assertEQ ( this.mm.params['_createDom'], [this.parentDom] );
	};
	
	this.test_attachTo = function(){
		this.mm.mock(this.lc(), '_remove');
		this.mm.mock(this.lc(), '_initFrame');
		this.mm.mock(TQ, 'append');
		
		var newParent = MockDomEx.snew('div');
		this.anim.attachTo(newParent);
		assertEQ ( this.mm.walkLog, '_remove,append,_initFrame' );
		assertEQ ( this.mm.params['append'], [newParent, this.lc().m_dom] );
		assertEQ ( this.lc().m_parentDom,  newParent);
	};
	
	this.test_regCaller = function(){
		var caller = {self:this, caller:this._onStop};
		this.anim.regCaller(caller);
		assertEQ ( this.lc().m_caller, caller);
	};
	
	this.test_getId = function(){
		assertEQ ( this.anim.getId(), 100001);
	};
	
	this.test_setZIndex = function(){
		this.mm.mock(TQ, 'setCSS');
		this.anim.setZIndex(10);
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_dom, 'zIndex', 10]);
	};
	
	this.test_setPosition = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.anim.setPosition({x:100, y:200});
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_dom, 99, 198]);
	};
	
	this.test_getSize = function(){
		assertEQ ( this.anim.getSize(), {cx:100, cy:200} );
	};
	
	this.test_play = function(){
		var timer = {name:'timer'};
		this.mm.mock(window, 'setInterval', [timer]);
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(this.lc(), '_initFrame');
		this.mm.mock(this.lc(), '_setPlayStartFlag');
		this.mm.mock(this.lc(), '_showCurFrame');
		this.anim.play();
		assertEQ ( this.mm.walkLog, 'setInterval,setCSS,_initFrame,_setPlayStartFlag,_showCurFrame' );
		assertEQ ( this.lc().m_timer, timer);
		assertEQ ( this.mm.params['setInterval'], [this.lc()._onTimer, this.lc().C_DRTTIME] );
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_dom, 'display', 'block']);
		
		this.mm.clear();
		this.anim.play();
		assertEQ ( this.lc().m_timer, timer);
		assertEQ ( this.mm.walkLog, 'setCSS,_initFrame,_setPlayStartFlag,_showCurFrame' );
	};
	
	this.test_isTriggerTime = function(){
		this.lc().m_playStarted = true;
		this.lc().m_isTrigered = true;
		this.lc().m_curFrame = 0;
		assertEQ ( this.anim.isTriggerTime(), false );
		
		this.lc().m_curFrame = 1;
		assertEQ ( this.anim.isTriggerTime(), false );

		this.lc().m_playStarted = false;
		this.lc().m_isTrigered = false;
		this.animationRes1.keyFrame = 1;
		assertEQ ( this.anim.isTriggerTime(), false );
		
		this.lc().m_playStarted = true;
		this.lc().m_isTrigered = false;
		this.animationRes1.keyFrame = 1;
		assertEQ ( this.anim.isTriggerTime(), true );
		
		this.animationRes1.keyFrame = 2;
		assertEQ ( this.anim.isTriggerTime(), false );
		
		this.lc().m_curFrame = 3;
		assertEQ ( this.anim.isTriggerTime(), true );
	};	
	
	this.test_setTriggered = function(){
		this.lc().m_isTrigered = false;
		assertEQ ( this.anim.isTriggered(), false );
		this.anim.setTriggered();
		assertEQ ( this.anim.isTriggered(), true );
	};
	
	this._onStop = function(anim){
		this._onStopBeCalled = true;
		this._anim = anim;
	};
	
	this.test_stop = function(){
		this.lc().m_timer = null;
		this.mm.mock(window, 'clearInterval');
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(this.lc(), '_remove');
		this.anim.stop();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_dom, 'display', 'none']);
		
		this.anim.regCaller({self:this, caller:this._onStop});
		this.mm.clear();
		this.lc().m_timer = {name:'timer'};
		this.anim.stop();
		assertEQ ( this.mm.walkLog, 'clearInterval,setCSS,_remove');
		assertEQ ( this.mm.params['clearInterval'], [{name:'timer'}]);
		assertEQ ( this.lc().m_timer, null );
		assertEQ ( this._onStopBeCalled, true );
		assertEQ ( this._anim, this.anim );
	};
	
	this.test_isEnd = function(){
		this.lc().m_playStarted = false;
		this.lc().m_timer = null;
		assertEQ ( this.anim.isEnd(), false );
		
		this.lc().m_playStarted = true;
		this.lc().m_timer = null;
		assertEQ ( this.anim.isEnd(), true );
		
		this.lc().m_timer = 10000;
		assertEQ ( this.anim.isEnd(), false );
	};
	
	this.test__remove = function(){
		this.mm.mock(TQ, 'remove');
		var dom = this.lc().m_dom;
		this.lc()._remove();
		assertEQ ( this.mm.params['remove'], [this.parentDom, dom] );
		assertEQ ( this.lc().m_dom, dom );
		assertEQ ( this.lc().m_parentDom, null );
		
		this.mm.clear();
		this.lc().m_parentDom = null;
		this.lc()._remove();
		assertEQ ( this.mm.walkLog, '' );
	};	
	
	this.test__createDom = function(){
		var new_dom =  {name:'dom'};
		this.mm.mock(TQ, 'createDom', [new_dom]);
		this.mm.mock(TQ, 'setCSS');
		this.mm.mock(TQ, 'setDomSize');
		this.mm.mock(TQ, 'append');
		this.lc()._createDom(this.parentDom );
		assertEQ ( this.mm.walkLog, 'createDom,setCSS,setDomSize,append' );
		assertEQ ( this.mm.params['createDom'], ['div'] );
		assertEQ ( this.mm.params['setCSS'], [new_dom, 'position', 'absolute'] );
		assertEQ ( this.mm.params['setDomSize'], [new_dom, 100, 200] );
		assertEQ ( this.mm.params['append'], [this.parentDom, new_dom ] );
		assertEQ ( this.lc().m_dom, new_dom );
	};
	
	this.test__createFrameDoms = function(){
		this.mm.mock(this.lc(), '_getFrameCount', [2]);
		this.mm.mock(this.lc(), '_createFrameDom', [{name:'frameDom'}] );
		this.mm.mock(this.lc(), '_loadFrameImage' );
		
		this.lc()._createFrameDoms();
		assertEQ ( this.mm.params['_createFrameDom.0'], [0] );
		assertEQ ( this.mm.params['_createFrameDom.1'], [1] );
		assertEQ ( this.mm.params['_loadFrameImage.0'], [0, {name:'frameDom'}] );
		assertEQ ( this.mm.params['_loadFrameImage.1'], [1, {name:'frameDom'}] );		
	};
	
	this.test__createFrameDom = function(){
		this.lc().m_dom.childNodes = [];
		this.lc().m_frameDoms = [];
		var frameDom = this.lc()._createFrameDom(1);
		assertEQ ( TQ.getDomRect(frameDom).w, 100 );
		assertEQ ( TQ.getDomRect(frameDom).h, 200 );
		assertEQ ( TQ.getCSS(frameDom,  'zIndex'), 1 );
		assertEQ ( TQ.getCSS(frameDom,  'position'), 'absolute' );
		assertEQ ( TQ.getCSS(frameDom,  'display'), 'none' );
		assertEQ ( this.lc().m_dom.firstChild, frameDom );
		assertEQ ( this.lc().m_frameDoms[0], frameDom );
	};
	
	this.test__loadFrameImage = function(){
		var frameDom = MockDom.snew('div');
		this.mm.mock(IMG, 'setBKImage');
		this.lc()._loadFrameImage(1, frameDom);
		var imgpath = IMG.makeImg(this.animationRes1.path + '001.png');
		assertEQ ( this.mm.params['setBKImage'], [frameDom, imgpath] );
	};
	
	this.test__onTimer = function(){
		var r_isPlayTimesEnd = [false];
		var r_isCurFrameEnd = [false];
		this.mm.mock(this.lc(), '_incDuration');
		this.mm.mock(this.lc(), '_isCurFrameEnd', r_isCurFrameEnd);
		this.mm.mock(this.lc(), '_moveNextFrame');
		this.mm.mock(this.lc(), '_isPlayTimesEnd', r_isPlayTimesEnd);
		this.mm.mock(this.anim, 'stop');
		this.mm.mock(this.lc(), '_showCurFrame');
	
		this.lc()._onTimer();
		assertEQ ( this.mm.walkLog, '_incDuration,_isCurFrameEnd,_isPlayTimesEnd,_showCurFrame' );
		
		this.mm.clear();
		r_isCurFrameEnd[0] = true;
		this.lc()._onTimer();
		assertEQ ( this.mm.walkLog, '_incDuration,_isCurFrameEnd,_moveNextFrame,_isPlayTimesEnd,_showCurFrame' );
		
		this.mm.clear();
		r_isPlayTimesEnd[0] = true;
		this.lc()._onTimer();
		assertEQ ( this.mm.walkLog, '_incDuration,_isCurFrameEnd,_moveNextFrame,_isPlayTimesEnd,stop' );
	};
	
	this.test__incDuration = function(){
		assertEQ ( this.lc().m_duration, 0 );
		this.lc()._incDuration();
		assertEQ ( this.lc().m_duration, this.lc().C_DRTTIME );
		this.lc()._incDuration();
		assertEQ ( this.lc().m_duration, this.lc().C_DRTTIME + this.lc().C_DRTTIME);
	};
	
	this.test__isPlayTimesEnd = function(){
		this.lc().m_playTimes = 1;
		assertEQ ( this.lc()._isPlayTimesEnd(), false );
		
		this.lc().m_playTimes = 2;
		assertEQ ( this.lc()._isPlayTimesEnd(), true );
	};
	
	this.test__isCurFrameEnd = function(){
		this.lc().m_duration = 1;
		this.lc().m_nextFrameTime = 2;
		assertEQ ( this.lc()._isCurFrameEnd(), false );
		
		this.lc().m_duration = 2;
		assertEQ ( this.lc()._isCurFrameEnd(), true );
		
		this.lc().m_duration = 3;
		assertEQ ( this.lc()._isCurFrameEnd(), true );
	};
	
	this.test__moveNextFrame = function(){
		this.mm.mock(this.lc(), '_getFrameCount', [2]);
		this.mm.mock(this.lc(), '_getCurFrameInterval', [50]);
		this.lc().m_playTimes = 0;
		this.lc().m_curFrame = 0;
		this.lc().m_nextFrameTime = 0;
		this.lc().m_isFrameChanged = false;
		this.lc()._moveNextFrame();
		assertEQ ( this.lc().m_playTimes, 0 );
		assertEQ ( this.lc().m_curFrame, 1 );
		assertEQ ( this.lc().m_nextFrameTime, 50 );
		assertEQ ( this.lc().m_isFrameChanged, true );
		
		this.lc()._moveNextFrame();
		assertEQ ( this.lc().m_playTimes, 1 );
		assertEQ ( this.lc().m_curFrame, 0 );
		assertEQ ( this.lc().m_nextFrameTime, 50 + 50 );
	};
	
	this.test__getFrameCount = function(){
		assertEQ ( this.lc()._getFrameCount(), 5 );
		this.anim.init(this.g, this.parentDom, this.animationRes2);
		assertEQ ( this.lc()._getFrameCount(), 3 );
	};
	
	this.test__getCurFrameInterval = function(){
		this.lc().m_curFrame = 0;
		assertEQ ( this.lc()._getCurFrameInterval(), 10 );
		
		this.lc().m_curFrame = 1;
		assertEQ ( this.lc()._getCurFrameInterval(), 10 );
		
		this.lc().m_curFrame = 2;
		assertEQ ( this.lc()._getCurFrameInterval(), 10 );
		
		this.anim.init(this.g, this.parentDom, this.animationRes2);
		this.lc().m_curFrame = 0;
		assertEQ ( this.lc()._getCurFrameInterval(), 10 );
		
		this.lc().m_curFrame = 1;
		assertEQ ( this.lc()._getCurFrameInterval(), 20 );
		
		this.lc().m_curFrame = 2;
		assertEQ ( this.lc()._getCurFrameInterval(), 30 );
	};
	
	this.test__showCurFrame = function(){
		this.lc().m_isFrameChanged = true;
		this.lc().m_curFrame = 1;
		this.mm.mock(TQ, 'setCSS');
		this.lc()._showCurFrame();
		assertEQ ( this.mm.params['setCSS.0'], [this.lc().m_frameDoms[0], 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.1'], [this.lc().m_frameDoms[1], 'display', 'block'] );
		assertEQ ( this.mm.params['setCSS.2'], [this.lc().m_frameDoms[2], 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.3'], [this.lc().m_frameDoms[3], 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.4'], [this.lc().m_frameDoms[4], 'display', 'none'] );
		assertEQ ( this.lc().m_isFrameChanged, false );
		
		this.mm.clear();
		this.lc()._showCurFrame();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__initFrame = function(){
		this.lc().m_curFrame = 1;
		this.lc().m_isFrameChanged = false;
		this.lc().m_duration = 1;
		this.lc().m_nextFrameTime = 1;
		this.lc().m_playTimes = 1;
		this.lc().m_isTrigered = true;
		this.lc().m_playStarted = true;
		
		this.lc()._initFrame();
		assertEQ ( this.lc().m_curFrame, 0 );
		assertEQ ( this.lc().m_isFrameChanged, true );
		assertEQ ( this.lc().m_duration, 0 );
		assertEQ ( this.lc().m_nextFrameTime, 0 );
		assertEQ ( this.lc().m_playTimes, 0 );
		assertEQ ( this.lc().m_isTrigered, false );
		assertEQ ( this.lc().m_playStarted, false );
	};
	
	this.test__setPlayStartFlag = function(){
		assertEQ ( this.lc().m_playStarted, false );
		this.lc()._setPlayStartFlag();
		assertEQ ( this.lc().m_playStarted, true );
	};
});

tqPngAnimation_t_main = function(suite) {
	suite.addTestCase(TestCasePngAnimMgr, 'TestCasePngAnimMgr');
	suite.addTestCase(TestCaseNullPngAnim, 'TestCaseNullPngAnim');
	suite.addTestCase(TestCasePngAnimProxy, 'TestCasePngAnimProxy');
	suite.addTestCase(TestCasePngAnimation, 'TestCasePngAnimation');
};
