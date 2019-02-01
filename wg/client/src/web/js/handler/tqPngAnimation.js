/*******************************************************************************/
/**
animation={
	path:'', // png图像的路径，png的文件名为 000.png 001.png ... nnn.png
	playTimes:播放次数
	frameSize:{cx:100, cy:100}, //每帧png的宽和高 
	center:{x:0, y:0}, //图片的中心点
	frameCount:2, //帧数
	keyFrame:0,//关键帧
	frameInterval:20, //每帧停留的时间，单位毫秒
	frames:[] //如果frameInterval不为空，则frames无效，
	                   //frames是定义每帧停留时间，每帧可以不同
				//和frameCount/frameInterval互斥使用
}
*/
PngAnimMgr = Class.extern(function(){
	this.init = function(g){
		this.g = g;
		this.freeAmins = {};
	};
	
	/** 返回一个PngAnimProxy */
	this.alloc = function(animId, parentDom){
		var parentDom = parentDom ? parentDom : TQ.getUiBody();
		var anim = this._allocFromFreeAmin(animId);
		if (anim) {
			anim.attachTo(parentDom);
		} else {
			anim = this._createAmin(animId, parentDom);
		}
		var proxyAnim = PngAnimProxy.snew(anim);
		proxyAnim.addCaller({self:this, caller:this._onStop});
		return proxyAnim;
	};
	
	this.allocAvatar = function(resId, dir, actionId, parentDom){
		var trys = [{resId:resId, dir:dir, actionId:actionId}
			,{resId:resId, dir:1, actionId:actionId}
			,{resId:resId, dir:1, actionId:1}];
		return this._tryAlloc(trys, parentDom);
	};
	
	this.allocEffect = function(resId, dir, parentDom){
		var trys = [{resId:resId, dir:dir, actionId:0}, {resId:resId, dir:1, actionId:0}];
		return this._tryAlloc(trys, parentDom);
	};
	
	this.makeAvatarAnimId = function(resId, dir, actionId){
		return resId*10000 + dir*100 + actionId;
	};
	
	this._tryAlloc = function(trys, parentDom){
		var animId = 0;
		for ( var i=0; i<trys.length; ++i ) {
			animId = this.makeAvatarAnimId(trys[i].resId, trys[i].dir, trys[i].actionId);
			var res = TQ.qfind(res_animations, 'id', animId);
			if (res) break;
		}
		return this.alloc(animId, parentDom);	
	};
	
	this._allocFromFreeAmin = function(animId){
		var amins = this._getFreeAminsByAnimId(animId);
		if ( amins.length == 0 ) return null;
		
		var amin = amins[amins.length-1];
		amins.length--;
		return amin;
	};
	
	this._createAmin = function(animId, parentDom){
		var res = TQ.qfind(res_animations, 'id', animId);
		if (!res) return NullPngAnim.snew(animId);
		
		return PngAnimation.snew(this.g, parentDom, res);
	};
	
	this._onStop = function(anim){
		if (anim.isNull) return;
		var amins = this._getFreeAminsByAnimId(anim.getId());
		amins.push(anim);
	};
	
	this._getFreeAminsByAnimId = function(animId){
		if ( !this.freeAmins[animId] ) {
			this.freeAmins[animId] = [];
		}
		return this.freeAmins[animId];
	};
});

NullPngAnim = Class.extern(function(){
	//NullPngAnim-unittest-start
	var m_isTrigered = false;
	var m_playStarted = false;
	this.isNull = true;
	this.init = function(animId) {
		if (animId > 0 
			&& animId != 1503010101 
			&& animId != 1503020101 
			&& animId != 1503030101 
			&& animId != 1503040101 
			&& animId != 1503050101 
		) log(animId);
	};
	this.attachTo = function(parentDom){};
	this.addCaller = function(caller){};
	this.regCaller = function(caller){};
	this.removeCaller = function(caller){};
	this.getId = function(){return 0;};
	this.setZIndex = function(zIndex){};
	this.setPosition = function(pos){};
	this.getSize = function(){ return {cx:1, cy:1}; };
	this.play = function(){ m_playStarted = true; };
	this.stop = function(){};
	this.isTriggerTime = function(){ return m_playStarted && (!m_isTrigered); };
	this.isTriggered = function() { return m_isTrigered; };
	this.setTriggered = function(){m_isTrigered = true;};
	this.isEnd = function(){return m_playStarted;};
	//NullPngAnim-unittest-end
});

PngAnimProxy = Class.extern(function(){
	this.anim = null;
	this.callers = [];
	this.init = function(anim){
		this.anim = anim;
		this.anim.regCaller({self:this, caller:this._onStop});
	};
	
	this.attachTo = function(parentDom){
		this.anim.attachTo(parentDom);
	};
	
	this.addCaller = function(caller){
		if ( this._hasCaller(caller) ) return;
		this.callers.push(caller);
	};
	
	this.removeCaller = function(caller){
		if ( !this._hasCaller(caller) ) return;
		this.callers.splice(this._getCallerIdx(caller), 1);
	};
	
	this._hasCaller = function(caller) {
		return this._getCallerIdx(caller) >= 0;
	};
	
	this._getCallerIdx = function(caller){
		for ( var i=0; i<this.callers.length; ++i ) {
			var regCaller = this.callers[i];
			if (regCaller.self == caller.self && regCaller.caller == caller.caller) return i;
		}
		return -1;
	};
	
	this.regCaller = function(caller){
		this.callers = [];
		this.addCaller(caller);
	};
	
	this.getId = function(){
		return this.anim.getId();
	};
	
	this.setZIndex = function(zIndex){
		this.anim.setZIndex(zIndex);
	};

	this.setPosition = function(pos){
		this.anim.setPosition(pos);
	};
	
	this.getSize = function(){
		return this.anim.getSize();
	};
	
	this.play = function(){
		this.anim.play();
	};
	
	this.stop = function(){
		this.anim.stop();
		this._clearCallers();
	};
	
	this.isEnd = function(){
		return this.anim.isEnd();
	};
	
	this.isTriggerTime = function(){
		return this.anim.isTriggerTime();
	};
	
	this.setTriggered = function(){
		this.anim.setTriggered();
	};
	
	this.isTriggered = function(){
		return this.anim.isTriggered();
	};
	
	this._onStop = function(anim){
		this.anim = NullPngAnim.snew(0);
		this.anim.play();
		if ( anim.isTriggered() ) this.anim.setTriggered();
		
		for ( var i=0; i<this.callers.length; ++i ) {
			var reg = this.callers[i];
			reg.caller.call(reg.self, anim);
		}
	};
	
	this._clearCallers = function(){
		this.callers = [];
	};
});

PngAnimation = Class.extern(function(){
	//PngAnimation-unittest-start
	var C_DRTTIME = 50;
	var m_this = null;
	var m_g = null;
	var m_animationRes = null;
	var m_parentDom = null;
	var m_dom = null;
	var m_timer = null;
	var m_curFrame = 0;
	var m_duration = 0;
	var m_nextFrameTime = 0;
	var m_playTimes = 0;
	var m_isFrameChanged = false;
	var m_frameDoms = [];
	var m_caller = null;
	var m_isTrigered = false;
	var m_playStarted = false;
	
	this.init = function(g, parentDom, animationRes){
		m_this = this;
		m_g = g;
		m_animationRes = animationRes;
		if ( !m_animationRes.playTimes ) {
			m_animationRes.playTimes = 0xffffffff;
		}		
		m_parentDom = parentDom;
		_createDom(parentDom);
		_createFrameDoms();
		_initFrame();
	};
	
	this.attachTo = function(parentDom){
		_remove();
		TQ.append(parentDom, m_dom);
		m_parentDom = parentDom;
		_initFrame();
	};
	
	this.regCaller = function(caller){
		m_caller = caller;
	};
	
	this.getId = function(){
		return m_animationRes.id;
	};
	
	this.setZIndex = function(zIndex){
		TQ.setCSS(m_dom, 'zIndex', zIndex);
	};

	this.setPosition = function(pos){
		var x = pos.x - m_animationRes.center.x;
		var y = pos.y - m_animationRes.center.y;
		TQ.setDomPos(m_dom, x, y);
	};
	
	this.getSize = function(){
		return {cx:m_animationRes.frameSize.cx, cy:m_animationRes.frameSize.cy};
	};
	
	this.play = function(){
		if ( !m_timer ){
			m_timer = window.setInterval(_onTimer, C_DRTTIME);
		}
		TQ.setCSS(m_dom, 'display', 'block');
		_initFrame();
		_setPlayStartFlag();
		_showCurFrame();
	};
	
	this.stop = function(){
		_stopTimer();
		TQ.setCSS(m_dom, 'display', 'none');
		_remove();
		
		if ( m_caller ) m_caller.caller.call(m_caller.self, this);
	};
	
	this.isTriggerTime = function(){
		var keyFrame = m_animationRes.keyFrame ? m_animationRes.keyFrame : 0;
		return m_playStarted && (m_curFrame >= keyFrame) && (!m_isTrigered);
	};
	
	this.setTriggered = function(){
		m_isTrigered = true;
	};
	
	this.isTriggered = function(){
		return m_isTrigered;
	};
	
	this.isEnd = function(){
		return m_playStarted && (m_timer == null);
	};
	
	var _stopTimer = function(){
		if ( m_timer ){
			window.clearInterval(m_timer);
			m_timer = null;
		}
	};
	
	var _remove = function(){
		if (!m_parentDom) return;
		
		TQ.remove(m_parentDom, m_dom);
		m_parentDom = null;
	};	
	
	var _createDom = function(parent){
		m_dom = TQ.createDom('div');
		TQ.setCSS(m_dom, 'position', 'absolute' );
		TQ.setDomSize(m_dom, m_animationRes.frameSize.cx, m_animationRes.frameSize.cy );
		TQ.append(parent, m_dom );
	};
	
	var _createFrameDoms = function(size){
		for ( var i=0; i<_getFrameCount(); ++i ){
			var frameDom = _createFrameDom(i);
			_loadFrameImage(i, frameDom);
		}
	};
	
	var _createFrameDom = function(idx){
		var frameDom = TQ.createDom('div');
		TQ.setDomSize(frameDom, m_animationRes.frameSize.cx, m_animationRes.frameSize.cy );
		TQ.setCSS(frameDom, 'zIndex', idx);
		TQ.setCSS(frameDom, 'position', 'absolute' );
		TQ.setCSS(frameDom, 'display', 'none');
		TQ.append(m_dom, frameDom );
		m_frameDoms.push(frameDom);
		return frameDom;
	};
	
	var _loadFrameImage = function(idx, frameDom) {
		var imgPath = TQ.formatNumber(m_animationRes.path + TQ.formatNumber(idx, 3) + '.png');
		var fullPath = IMG.makeImg(imgPath);
		IMG.setBKImage(frameDom, fullPath);	
	};
	
	var _initFrame = function(){
		m_curFrame = 0;
		m_isFrameChanged = true;
		m_duration = 0;
		m_nextFrameTime = 0;
		m_playTimes = 0;
		m_isTrigered = false;
		m_playStarted = false;
	};	
	
	var _setPlayStartFlag = function(){
		m_playStarted = true;
	};
	
	var _onTimer = function(){
		_incDuration();
		
		if ( _isCurFrameEnd() ) {
			_moveNextFrame();
		}
		
		if ( _isPlayTimesEnd() ) {
			m_this.stop();
			return;
		}
		
		_showCurFrame();
	};
	
	var _incDuration = function(){
		m_duration += C_DRTTIME;
	};
	
	var _isPlayTimesEnd = function(){
		return m_playTimes == m_animationRes.playTimes;
	};
	
	var _isCurFrameEnd = function(){
		return m_duration >= m_nextFrameTime;
	};	
	
	var _moveNextFrame = function(){
		if ( m_curFrame == _getFrameCount() - 1 ) m_playTimes++;
		m_curFrame = (m_curFrame + 1)%_getFrameCount();
		m_nextFrameTime += _getCurFrameInterval();
		m_isFrameChanged = true;
	};
	
	var _getFrameCount = function(){
		if (m_animationRes.frameCount) {
			return m_animationRes.frameCount;
		}
		else {
			return m_animationRes.frames.length;
		}
	};
	
	var _getCurFrameInterval = function(){
		if (m_animationRes.frameInterval) {
			return m_animationRes.frameInterval;
		}
		else {
			return m_animationRes.frames[m_curFrame];
		}
	};	
	
	var _showCurFrame = function(){
		if (!m_isFrameChanged) return;
		m_isFrameChanged = false;
		
		for ( var i=0; i<_getFrameCount(); ++i ){
			TQ.setCSS(m_frameDoms[i], 'display', (i == m_curFrame) ? 'block' : 'none');
		}
	};
	//PngAnimation-unittest-end
});
