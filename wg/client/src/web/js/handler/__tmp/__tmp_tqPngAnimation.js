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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_isTrigered = false;
	_lc_.m_playStarted = false;
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
	this.play = function(){ _lc_.m_playStarted = true; };
	this.stop = function(){};
	this.isTriggerTime = function(){ return _lc_.m_playStarted && (!_lc_.m_isTrigered); };
	this.isTriggered = function() { return _lc_.m_isTrigered; };
	this.setTriggered = function(){_lc_.m_isTrigered = true;};
	this.isEnd = function(){return _lc_.m_playStarted;};
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_DRTTIME = 50;
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_animationRes = null;
	_lc_.m_parentDom = null;
	_lc_.m_dom = null;
	_lc_.m_timer = null;
	_lc_.m_curFrame = 0;
	_lc_.m_duration = 0;
	_lc_.m_nextFrameTime = 0;
	_lc_.m_playTimes = 0;
	_lc_.m_isFrameChanged = false;
	_lc_.m_frameDoms = [];
	_lc_.m_caller = null;
	_lc_.m_isTrigered = false;
	_lc_.m_playStarted = false;
	
	this.init = function(g, parentDom, animationRes){
		_lc_.m_this = this;
		_lc_.m_g = g;
		_lc_.m_animationRes = animationRes;
		if ( !_lc_.m_animationRes.playTimes ) {
			_lc_.m_animationRes.playTimes = 0xffffffff;
		}		
		_lc_.m_parentDom = parentDom;
		_lc_._createDom(parentDom);
		_lc_._createFrameDoms();
		_lc_._initFrame();
	};
	
	this.attachTo = function(parentDom){
		_lc_._remove();
		TQ.append(parentDom, _lc_.m_dom);
		_lc_.m_parentDom = parentDom;
		_lc_._initFrame();
	};
	
	this.regCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.getId = function(){
		return _lc_.m_animationRes.id;
	};
	
	this.setZIndex = function(zIndex){
		TQ.setCSS(_lc_.m_dom, 'zIndex', zIndex);
	};

	this.setPosition = function(pos){
		var x = pos.x - _lc_.m_animationRes.center.x;
		var y = pos.y - _lc_.m_animationRes.center.y;
		TQ.setDomPos(_lc_.m_dom, x, y);
	};
	
	this.getSize = function(){
		return {cx:_lc_.m_animationRes.frameSize.cx, cy:_lc_.m_animationRes.frameSize.cy};
	};
	
	this.play = function(){
		if ( !_lc_.m_timer ){
			_lc_.m_timer = window.setInterval(_lc_._onTimer, _lc_.C_DRTTIME);
		}
		TQ.setCSS(_lc_.m_dom, 'display', 'block');
		_lc_._initFrame();
		_lc_._setPlayStartFlag();
		_lc_._showCurFrame();
	};
	
	this.stop = function(){
		_stopTimer();
		TQ.setCSS(_lc_.m_dom, 'display', 'none');
		_lc_._remove();
		
		if ( _lc_.m_caller ) _lc_.m_caller.caller.call(_lc_.m_caller.self, this);
	};
	
	this.isTriggerTime = function(){
		var keyFrame = _lc_.m_animationRes.keyFrame ? _lc_.m_animationRes.keyFrame : 0;
		return _lc_.m_playStarted && (_lc_.m_curFrame >= keyFrame) && (!_lc_.m_isTrigered);
	};
	
	this.setTriggered = function(){
		_lc_.m_isTrigered = true;
	};
	
	this.isTriggered = function(){
		return _lc_.m_isTrigered;
	};
	
	this.isEnd = function(){
		return _lc_.m_playStarted && (_lc_.m_timer == null);
	};
	
	var _stopTimer = function(){
		if ( _lc_.m_timer ){
			window.clearInterval(_lc_.m_timer);
			_lc_.m_timer = null;
		}
	};
	
	_lc_._remove = function(){
		if (!_lc_.m_parentDom) return;
		
		TQ.remove(_lc_.m_parentDom, _lc_.m_dom);
		_lc_.m_parentDom = null;
	};	
	
	_lc_._createDom = function(parent){
		_lc_.m_dom = TQ.createDom('div');
		TQ.setCSS(_lc_.m_dom, 'position', 'absolute' );
		TQ.setDomSize(_lc_.m_dom, _lc_.m_animationRes.frameSize.cx, _lc_.m_animationRes.frameSize.cy );
		TQ.append(parent, _lc_.m_dom );
	};
	
	_lc_._createFrameDoms = function(size){
		for ( var i=0; i<_lc_._getFrameCount(); ++i ){
			var frameDom = _lc_._createFrameDom(i);
			_lc_._loadFrameImage(i, frameDom);
		}
	};
	
	_lc_._createFrameDom = function(idx){
		var frameDom = TQ.createDom('div');
		TQ.setDomSize(frameDom, _lc_.m_animationRes.frameSize.cx, _lc_.m_animationRes.frameSize.cy );
		TQ.setCSS(frameDom, 'zIndex', idx);
		TQ.setCSS(frameDom, 'position', 'absolute' );
		TQ.setCSS(frameDom, 'display', 'none');
		TQ.append(_lc_.m_dom, frameDom );
		_lc_.m_frameDoms.push(frameDom);
		return frameDom;
	};
	
	_lc_._loadFrameImage = function(idx, frameDom) {
		var imgPath = TQ.formatNumber(_lc_.m_animationRes.path + TQ.formatNumber(idx, 3) + '.png');
		var fullPath = IMG.makeImg(imgPath);
		IMG.setBKImage(frameDom, fullPath);	
	};
	
	_lc_._initFrame = function(){
		_lc_.m_curFrame = 0;
		_lc_.m_isFrameChanged = true;
		_lc_.m_duration = 0;
		_lc_.m_nextFrameTime = 0;
		_lc_.m_playTimes = 0;
		_lc_.m_isTrigered = false;
		_lc_.m_playStarted = false;
	};	
	
	_lc_._setPlayStartFlag = function(){
		_lc_.m_playStarted = true;
	};
	
	_lc_._onTimer = function(){
		_lc_._incDuration();
		
		if ( _lc_._isCurFrameEnd() ) {
			_lc_._moveNextFrame();
		}
		
		if ( _lc_._isPlayTimesEnd() ) {
			_lc_.m_this.stop();
			return;
		}
		
		_lc_._showCurFrame();
	};
	
	_lc_._incDuration = function(){
		_lc_.m_duration += _lc_.C_DRTTIME;
	};
	
	_lc_._isPlayTimesEnd = function(){
		return _lc_.m_playTimes == _lc_.m_animationRes.playTimes;
	};
	
	_lc_._isCurFrameEnd = function(){
		return _lc_.m_duration >= _lc_.m_nextFrameTime;
	};	
	
	_lc_._moveNextFrame = function(){
		if ( _lc_.m_curFrame == _lc_._getFrameCount() - 1 ) _lc_.m_playTimes++;
		_lc_.m_curFrame = (_lc_.m_curFrame + 1)%_lc_._getFrameCount();
		_lc_.m_nextFrameTime += _lc_._getCurFrameInterval();
		_lc_.m_isFrameChanged = true;
	};
	
	_lc_._getFrameCount = function(){
		if (_lc_.m_animationRes.frameCount) {
			return _lc_.m_animationRes.frameCount;
		}
		else {
			return _lc_.m_animationRes.frames.length;
		}
	};
	
	_lc_._getCurFrameInterval = function(){
		if (_lc_.m_animationRes.frameInterval) {
			return _lc_.m_animationRes.frameInterval;
		}
		else {
			return _lc_.m_animationRes.frames[_lc_.m_curFrame];
		}
	};	
	
	_lc_._showCurFrame = function(){
		if (!_lc_.m_isFrameChanged) return;
		_lc_.m_isFrameChanged = false;
		
		for ( var i=0; i<_lc_._getFrameCount(); ++i ){
			TQ.setCSS(_lc_.m_frameDoms[i], 'display', (i == _lc_.m_curFrame) ? 'block' : 'none');
		}
	};
	//PngAnimation-unittest-end
});
