/*******************************************************************************/
DirectionVector = Class.extern(function(){
	this.calcDirectionVector = function(prePoint, nextPoint){
		var r = this.calcDistance(prePoint, nextPoint);
		var x = (nextPoint.x - prePoint.x)/r;
		var y = (nextPoint.y - prePoint.y)/r;
		return {x:x, y:y};
	};
	
	this.getDirectionByVector = function(vector){
		var x = 0;
		var y = 0;
		if (Math.abs(vector.x) >= Math.abs(vector.y)) {
			x = vector.x;
			y = 0;
		} else {
			x = 0;
			y = vector.y;
		}
		if (x > 0 ) return 1;
		else if (y > 0) return 2;
		else if (x < 0) return 3;
		else if (y < 0) return 4;
		else return 0;
	};
	
	this.calcDistance = function(posA, posB){
		return Math.sqrt((posA.x-posB.x)*(posA.x-posB.x) + (posA.y-posB.y)*(posA.y-posB.y));
	};
}).snew();

MoveRoute = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_speed = null;
	_lc_.m_curPos = {x:0, y:0};
	_lc_.m_paths = null;
	
	_lc_.m_direction = 0;
	_lc_.m_lastTimeMs = 0;
	_lc_.m_pathDistances = [];
	
	this.init = function(g, speed, paths) {
		_lc_._initParams(g, speed, paths);
		_lc_._makePathDistances();
		this.update();
	};
	
	this.update = function(){
		if ( this.isEnd() ) return;
		_lc_._updateCurPosAndDir();
	};
	
	this.getPosition = function(){
		return _lc_.m_curPos;
	};
	
	this.getDirection = function(){
		return _lc_.m_direction;
	};
	
	this.isEnd = function(){
		var endPoint = _lc_.m_paths[_lc_.m_paths.length-1];
		return (endPoint.x == _lc_.m_curPos.x) && (endPoint.y == _lc_.m_curPos.y);
	};
	
	_lc_._initParams = function(g, speed, paths){
		_lc_.m_g = g;
		_lc_.m_speed = speed;
		_lc_.m_curPos.x = paths[0].x;
		_lc_.m_curPos.y = paths[0].y;
		_lc_.m_paths = paths;
		_lc_.m_lastTimeMs = _lc_.m_g.getCurTimeMs();
	};
	
	_lc_._makePathDistances = function(){
		_lc_.m_pathDistances = [];
		
		var distance = 0;
		_lc_.m_pathDistances.push(distance);
		
		for  ( var i=1; i<_lc_.m_paths.length; ++i ) {
			distance += DirectionVector.calcDistance(_lc_.m_paths[i-1], _lc_.m_paths[i]);
			_lc_.m_pathDistances.push(distance);
		}
	};
	
	_lc_._updateCurPosAndDir = function(){
		var moveDistance = (_lc_.m_g.getCurTimeMs() - _lc_.m_lastTimeMs)*_lc_.m_speed;
		moveDistance = Math.min(moveDistance, _lc_.m_pathDistances[_lc_.m_pathDistances.length-1]);
		
		var pathPointIdx = _lc_._findNextPointByDistance(moveDistance);

		var prePoint = _lc_.m_paths[pathPointIdx-1];
		var nextPoint = _lc_.m_paths[pathPointIdx];
		var directionVector = DirectionVector.calcDirectionVector(prePoint, nextPoint);
		
		var leftDistance = moveDistance-_lc_.m_pathDistances[pathPointIdx-1];
		_lc_.m_curPos.x = prePoint.x + directionVector.x*leftDistance;
		_lc_.m_curPos.y = prePoint.y + directionVector.y*leftDistance;
		
		_lc_.m_direction = DirectionVector.getDirectionByVector(directionVector);
	};
	
	_lc_._findNextPointByDistance = function(moveDistance){
		for ( var i=0; i<_lc_.m_pathDistances.length; ++i ) {
			var pathDistance = _lc_.m_pathDistances[i];
			if (moveDistance < pathDistance){
				return i;
			}
		}
		return _lc_.m_pathDistances.length - 1;
	};
	//MoveRoute-unittest-end
});
