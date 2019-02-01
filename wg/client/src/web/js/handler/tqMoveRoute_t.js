/*******************************************************************************/
requireEx('./handler/tqMoveRoute.js', [
	{
		start:'//MoveRoute-unittest-start'
		,end:'//MoveRoute-unittest-end'
		,items:['m_g'
			,'m_speed'
			,'m_curPos'
			,'m_paths'
			,'m_direction'
			,'m_pathDistances'
			,'m_lastTimeMs'
			,'_initParams'
			,'_updateCurPosAndDir'
			,'_makePathDistances'
			,'_findNextPointByDistance'
		]
	}
]);

TestCaseDirectionVector = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_calcDirectionVector = function(){
		assertEQ ( DirectionVector.calcDirectionVector({x:0, y:0},{x:2, y:0}), {x:1, y:0});
		assertEQ ( DirectionVector.calcDirectionVector({x:0, y:0},{x:-2, y:0}), {x:-1, y:0});
		assertEQ ( DirectionVector.calcDirectionVector({x:0, y:0},{x:0, y:2}), {x:0, y:1});
		assertEQ ( DirectionVector.calcDirectionVector({x:0, y:0},{x:0, y:-2}), {x:0, y:-1});
	};
	
	this.test_getDirectionByVector = function(){
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:0}), 1 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0, y:1}), 2 );
		assertEQ ( DirectionVector.getDirectionByVector({x:-1, y:0}), 3 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0, y:-1}), 4 );
		
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:0.1}), 1 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:-0.1}), 1 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:0.5}), 1 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:0.6}), 2 );
		assertEQ ( DirectionVector.getDirectionByVector({x:0.5, y:-0.6}), 4 );
		assertEQ ( DirectionVector.getDirectionByVector({x:-0.5, y:0.1}), 3 );
		assertEQ ( DirectionVector.getDirectionByVector({x:-0.5, y:-0.1}), 3 );
		assertEQ ( DirectionVector.getDirectionByVector({x:-0.5, y:-0.6}), 4 );
		assertEQ ( DirectionVector.getDirectionByVector({x:-0.5, y:0.6}), 2 );
	};	
	
	this.test_calcDistance = function(){
		var posA = {x:1, y:1};
		var posB = {x:10, y:10};
		assertEQ ( DirectionVector.calcDistance(posA, posB), Math.sqrt(81+81) );
	};	
});

TestCaseMoveRoute = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.route = MoveRoute.snew(this.g, 100, [{x:1, y:2},{x:3, y:4}]);
		this.lc = this.route.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams' );
		this.mm.mock(this.lc(), '_makePathDistances' );
		this.mm.mock(this.route, 'update' );
		this.route.init(this.g, 100, [{x:1, y:2},{x:3, y:4}]);
		assertEQ ( this.mm.walkLog, '_initParams,_makePathDistances,update' );
		assertEQ ( this.mm.params['_initParams'], [this.g, 100, [{x:1, y:2},{x:3, y:4}]] );
	};
	
	this.test_update = function(){
		var r_isEnd = [true];
		var r_isArriveCurPoint = [false];
		this.mm.mock(this.route, 'isEnd', r_isEnd);
		this.mm.mock(this.lc(), '_updateCurPosAndDir' );
		
		this.route.update();
		assertEQ ( this.mm.walkLog, 'isEnd' );
		
		this.mm.clear();
		r_isEnd[0] = false;
		this.route.update();
		assertEQ ( this.mm.walkLog, 'isEnd,_updateCurPosAndDir' );
	};
	
	this.test_getPosition = function(){
		this.lc().m_curPos = {x:1, y:2};
		assertEQ ( this.route.getPosition(), {x:1, y:2} );
	};
	
	this.test_getDirection = function(){
		this.lc().m_direction = 1;
		assertEQ ( this.route.getDirection(), 1 );
	};
	
	this.test_isEnd = function(){
		this.lc().m_paths = [{x:1, y:2},{x:100, y:200}];
		this.lc().m_curPos = {x:100, y:200};
		assertEQ ( this.route.isEnd(), true );
		
		this.lc().m_curPos = {x:99, y:200};
		assertEQ ( this.route.isEnd(), false );
		
		this.lc().m_curPos = {x:100, y:201};
		assertEQ ( this.route.isEnd(), false );
	};
	
	this.test__initParams = function(){
		this.g.setCurTimeMs(100);
		this.lc()._initParams(this.g, 100, [{x:1, y:2},{x:3, y:4}]);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_speed, 100 );
		assertEQ ( this.lc().m_curPos, {x:1, y:2} );
		assertEQ ( this.lc().m_paths, [{x:1, y:2},{x:3, y:4}] );
		assertEQ ( this.lc().m_lastTimeMs, 100 );
	};
	
	this.test__makePathDistances = function(){	
		this.lc().m_paths = [{x:1, y:0},{x:2, y:0},{x:2, y:2}];
		this.lc()._makePathDistances();
		assertEQ ( this.lc().m_pathDistances, [0,1,3] );
	};
	
	this.test__updateCurPosAndDir = function(){
		this.lc().m_paths = [{x:0, y:0}, {x:10, y:0}, {x:10, y:10}];
		this.lc()._makePathDistances();
		this.lc().m_lastTimeMs = 100;
		this.lc().m_speed = 2;
		this.g.setCurTimeMs(102);
		
		this.lc()._updateCurPosAndDir();
		assertEQ ( this.lc().m_curPos, {x:4, y:0} );
		assertEQ ( this.lc().m_direction, 1);
		
		this.g.setCurTimeMs(108);
		this.lc()._updateCurPosAndDir();
		assertEQ ( this.lc().m_curPos, {x:10, y:6} );
		assertEQ ( this.lc().m_direction, 2);
		
		this.g.setCurTimeMs(118);
		this.lc()._updateCurPosAndDir();
		assertEQ ( this.lc().m_curPos, {x:10, y:10} );
		assertEQ ( this.lc().m_direction, 2);
	};
	
	this.test__findNextPointByDistance = function(){
		this.lc().m_pathDistances = [0,20,30];
		assertEQ ( this.lc()._findNextPointByDistance(0), 1 );
		assertEQ ( this.lc()._findNextPointByDistance(19), 1 );
		assertEQ ( this.lc()._findNextPointByDistance(20), 2 );
		assertEQ ( this.lc()._findNextPointByDistance(29), 2 );
		assertEQ ( this.lc()._findNextPointByDistance(30), 2 );
		assertEQ ( this.lc()._findNextPointByDistance(31), 2 );
	};
});

tqMoveRoute_t_main = function(suite) {
	suite.addTestCase(TestCaseMoveRoute, 'TestCaseMoveRoute');
	suite.addTestCase(TestCaseDirectionVector, 'TestCaseDirectionVector');
};

