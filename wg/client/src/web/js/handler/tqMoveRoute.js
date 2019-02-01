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
	//MoveRoute-unittest-start
	var m_g = null;
	var m_speed = null;
	var m_curPos = {x:0, y:0};
	var m_paths = null;
	
	var m_direction = 0;
	var m_lastTimeMs = 0;
	var m_pathDistances = [];
	
	this.init = function(g, speed, paths) {
		_initParams(g, speed, paths);
		_makePathDistances();
		this.update();
	};
	
	this.update = function(){
		if ( this.isEnd() ) return;
		_updateCurPosAndDir();
	};
	
	this.getPosition = function(){
		return m_curPos;
	};
	
	this.getDirection = function(){
		return m_direction;
	};
	
	this.isEnd = function(){
		var endPoint = m_paths[m_paths.length-1];
		return (endPoint.x == m_curPos.x) && (endPoint.y == m_curPos.y);
	};
	
	var _initParams = function(g, speed, paths){
		m_g = g;
		m_speed = speed;
		m_curPos.x = paths[0].x;
		m_curPos.y = paths[0].y;
		m_paths = paths;
		m_lastTimeMs = m_g.getCurTimeMs();
	};
	
	var _makePathDistances = function(){
		m_pathDistances = [];
		
		var distance = 0;
		m_pathDistances.push(distance);
		
		for  ( var i=1; i<m_paths.length; ++i ) {
			distance += DirectionVector.calcDistance(m_paths[i-1], m_paths[i]);
			m_pathDistances.push(distance);
		}
	};
	
	var _updateCurPosAndDir = function(){
		var moveDistance = (m_g.getCurTimeMs() - m_lastTimeMs)*m_speed;
		moveDistance = Math.min(moveDistance, m_pathDistances[m_pathDistances.length-1]);
		
		var pathPointIdx = _findNextPointByDistance(moveDistance);

		var prePoint = m_paths[pathPointIdx-1];
		var nextPoint = m_paths[pathPointIdx];
		var directionVector = DirectionVector.calcDirectionVector(prePoint, nextPoint);
		
		var leftDistance = moveDistance-m_pathDistances[pathPointIdx-1];
		m_curPos.x = prePoint.x + directionVector.x*leftDistance;
		m_curPos.y = prePoint.y + directionVector.y*leftDistance;
		
		m_direction = DirectionVector.getDirectionByVector(directionVector);
	};
	
	var _findNextPointByDistance = function(moveDistance){
		for ( var i=0; i<m_pathDistances.length; ++i ) {
			var pathDistance = m_pathDistances[i];
			if (moveDistance < pathDistance){
				return i;
			}
		}
		return m_pathDistances.length - 1;
	};
	//MoveRoute-unittest-end
});
