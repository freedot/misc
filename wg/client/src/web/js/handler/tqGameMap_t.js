//
requireEx('./handler/tqGameMap.js', [
	{
		start:'//GameMap-unittest-start'
		,end:'//GameMap-unittest-end'
		,items:[]
	}
	,{
		start:'//MapObjsContainer-unittest-start'
		,end:'//MapObjsContainer-unittest-end'
		,items:[
			'm_g'
			,'m_mapDom'
			,'m_mapId'
			,'m_objDoms'
			,'m_freeObjDoms'
			,'m_anims'
			,'_saveMapId'
			,'_freeLastMapObjs'
			,'_freeLastGifMapObjs'
			,'_freeLastAnimMapObjs'
			,'_loadMapObjs'
			,'_loadGifObj'
			,'_loadAnimObj'
			,'_allocMapObjDom'
		]
	}
]);

TestCaseDragMapChecker = TestCase.extern(function(){
	this.testDragMap= function(){
		assertEQ ( DragMapChecker.isDragging(), false );
		
		DragMapChecker.startDrag();
		assertEQ ( DragMapChecker.isDragging(), true );
		
		DragMapChecker.endDrag();
		assertEQ ( DragMapChecker.isDragging(), false );
	};
});

TestCaseGameMap = TestCase.extern(function(){
	this.setUp = function(){
		this.gameMap = GameMap.snew(this.g, MockDomEx.snew());
		this.lc = this.gameMap.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
});

TestCaseMapObjsContainer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mapDom = MockDomEx.snew();
		this.con = MapObjsContainer.snew(this.g, this.mapDom);
		this.lc = this.con.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g , this.g);
		assertEQ ( this.lc().m_mapDom , this.mapDom);
	};
	
	this.test_load = function(){
		this.mm.mock(this.lc(), '_saveMapId');
		this.mm.mock(this.lc(), '_freeLastMapObjs');
		this.mm.mock(this.lc(), '_loadMapObjs');
		var mapId = 9000001;
		this.con.load(mapId);
		assertEQ ( this.mm.walkLog, '_saveMapId,_freeLastMapObjs,_loadMapObjs' );
		assertEQ ( this.mm.params['_saveMapId'], [mapId] );
	};
	
	this.test__saveMapId = function(){
		var mapId = 9000001;
		this.lc()._saveMapId(mapId);
		assertEQ ( this.lc().m_mapId , mapId);
	};
	
	this.test__freeLastMapObjs = function(){
		this.mm.mock(this.lc(), '_freeLastGifMapObjs');
		this.mm.mock(this.lc(), '_freeLastAnimMapObjs');
		this.lc()._freeLastMapObjs();
		assertEQ ( this.mm.walkLog, '_freeLastGifMapObjs,_freeLastAnimMapObjs' );
	};
	
	this.test__freeLastGifMapObjs = function(){
		this.mm.mock(TQ, 'setCSS');
		this.lc().m_freeObjDoms = [{name:'dom1'}];
		this.lc().m_objDoms = [{name:'dom2'},{name:'dom3'}];
		
		this.lc()._freeLastMapObjs();
		assertEQ ( this.mm.walkLog, 'setCSS,setCSS' );
		assertEQ ( this.mm.params['setCSS.0'], [{name:'dom2'}, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.1'], [{name:'dom3'}, 'display', 'none'] );
		assertEQ ( this.lc().m_freeObjDoms, [{name:'dom1'},{name:'dom2'},{name:'dom3'}] );
		assertEQ ( this.lc().m_objDoms, [] );
	};
	
	this.test__freeLastAnimMapObjs = function(){
		res_animations = [{id:100006, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, frameCount:12, frameInterval:100}];
		var anim = this.g.getAnimMgr().alloc(100006);
		this.lc().m_anims = [anim];
		this.mm.mock(anim, 'stop');
		this.lc()._freeLastAnimMapObjs();
		assertEQ ( this.mm.walkLog, 'stop');
		assertEQ ( this.lc().m_anims, [] );
	};
	
	this.test__loadMapObjs = function(){
		res_mapobjs = [{ id:9000001	,objs:[{type:'gif'},{type:'anim'}]}];
		
		this.mm.mock(this.lc(), '_loadGifObj');
		this.mm.mock(this.lc(), '_loadAnimObj');
		
		this.lc().m_mapId = 9000002;
		this.lc()._loadMapObjs();
		assertEQ ( this.mm.walkLog, '');
		
		this.lc().m_mapId = 9000001;
		this.lc()._loadMapObjs();
		assertEQ ( this.mm.walkLog, '_loadGifObj,_loadAnimObj');
		assertEQ ( this.mm.params['_loadGifObj'], [{type:'gif'}] );
		assertEQ ( this.mm.params['_loadAnimObj'], [{type:'anim'}] );
	};
	
	this.test__loadGifObj = function(){
		var objRes = {type:'gif', size:{cx:10, cy:20}, pos:{x:1, y:2}, path:'map/objs/9000001001.gif'};
		this.mm.mock(this.lc(), '_allocMapObjDom', [{name:'dom'}]);
		this.mm.mock(IMG, 'setBKImage' );
		this.mm.mock(TQ, 'setDomRect' );
		this.lc()._loadGifObj(objRes);
		assertEQ ( this.mm.params['setBKImage'], [{name:'dom'}, IMG.makeImg(objRes.path)] );
		assertEQ ( this.mm.params['setDomRect'], [{name:'dom'}, 1, 2, 10, 20] );
	};
	
	this.test__loadAnimObj = function(){
		res_animations = [{id:100006, path:'effects/test1/', playTimes:10, frameSize:{cx:80, cy:96}, frameCount:12, frameInterval:100}];
		
		var objRes = {type:'anim', pos:{x:1, y:2}, animId:100006};
		var anim = this.g.getAnimMgr().alloc(objRes.animId);
		this.mm.mock(this.g.getAnimMgr(), 'alloc', [anim]);
		this.mm.mock(anim, 'setPosition');
		this.mm.mock(anim, 'play');
		this.lc()._loadAnimObj(objRes);
		assertEQ ( this.mm.walkLog, 'alloc,setPosition,play' );
		assertEQ ( this.mm.params[ 'alloc' ], [100006]);
		assertEQ ( this.mm.params[ 'setPosition' ], [{x:1, y:2}]);
		assertEQ ( this.lc().m_anims, [anim] );
	};
	
	this.test__allocMapObjDom = function(){
		var dom = MockDomEx.snew('div');
		this.lc().m_freeObjDoms = [dom];
		this.mm.mock(TQ, 'setCSS');
		assertEQ ( this.lc()._allocMapObjDom(), dom);
		assertEQ ( this.mm.params['setCSS'], [dom, 'display', 'block']);
		assertEQ ( this.lc().m_objDoms, [dom] );
		assertEQ ( this.lc().m_freeObjDoms, [] );
		
		
		this.mm.clear();
		
		this.mm.mock(TQ, 'createDom', [{name:'dom'}]);
		this.mm.mock(TQ, 'setClass' );
		this.mm.mock(TQ, 'append' );
		
		assertEQ ( this.lc()._allocMapObjDom(), {name:'dom'});
		assertEQ ( this.mm.params['createDom'], ['div']);
		assertEQ ( this.mm.params['setClass'], [{name:'dom'}, 'map_fixobject']);
		assertEQ ( this.mm.params['append'], [this.lc().m_mapDom, {name:'dom'}]);
		assertEQ ( this.lc().m_objDoms, [dom, {name:'dom'} ] );
		assertEQ ( this.lc().m_freeObjDoms, [] );
	};
	
	
});


tqGameMap_t_main = function(suite) {
	suite.addTestCase(TestCaseDragMapChecker, 'TestCaseDragMapChecker');
	suite.addTestCase(TestCaseGameMap, 'TestCaseGameMap');	
	suite.addTestCase(TestCaseMapObjsContainer, 'TestCaseMapObjsContainer');	
};