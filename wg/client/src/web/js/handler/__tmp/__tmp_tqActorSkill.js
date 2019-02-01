/*******************************************************************************/
res_cltskills = [ 
	 {id:150001, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // 刀兵
	,{id:150002, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // 戟兵
	,{id:150003, phases:{attack:{id:0}, fly:{id:1001, speed:0.5}, hurt:{id:0}} }  // 弓兵
	,{id:150004, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // 骑兵
	,{id:150005, phases:{attack:{id:0}, fly:{id:1002, speed:0.5}, hurt:{id:0}} }  // 器械
	,{id:150101, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // HERO MAN
	,{id:150102, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // HERO WOMEN
	,{id:150201, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // WALL
	,{id:150300, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:0}} }  // world boss
	,{id:150301, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:1003}} }  // DEF -- XIANJING
	,{id:150302, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:1004}} }  // DEF -- GUNMU
	,{id:150303, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:1005}} }  // DEF -- JUMA
	,{id:150304, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:1006}} }  // DEF -- LEISHI
	,{id:150305, phases:{attack:{id:0}, fly:{id:0, speed:0xffffffff}, hurt:{id:1007}} }  // DEF -- NUJIAN
];
	
	

NullSkillPhase = Class.extern(function(){
	var m_isTriggered = false;
	this.start = function(){};
	this.update = function(){};
	this.isTriggerTime = function(){ return !m_isTriggered; };
	this.setTriggered = function(){m_isTriggered=true;};
	this.isEnd = function(){return true;};
});

SkillAttackPhase = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_anim = null;
	this.init = function(g, parent, resId, sourceActor){
		_lc_.m_anim = g.getAnimMgr().allocEffect(resId, sourceActor.getDirection(), parent);
	};
	
	this.start = function(){
		_lc_.m_anim.play();
	};
	
	this.update = function(){};
	
	this.isTriggerTime = function(){ 
		return _lc_.m_anim.isTriggerTime(); 
	};
	
	this.setTriggered = function(){
		_lc_.m_anim.setTriggered();
	};
	
	this.isEnd = function(){
		return _lc_.m_anim.isEnd();
	};
	//SkillAttackPhase-unittest-end
});

SkillFlyPhase = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_resId = null;
	_lc_.m_parent = null;
	_lc_.m_anim = null;
	_lc_.m_route = null;
	_lc_.m_isStarted = false;
	_lc_.m_isTriggered = false;
	_lc_.m_isTriggering = false;
	
	this.init = function(g, parent,  resId, speed, sourceActor, targetActor){
		_lc_.m_g = g;
		_lc_.m_parent = parent;
		_lc_.m_resId = resId;
		
		var paths = [];
		paths.push({x:sourceActor.getPosition().x, y:sourceActor.getPosition().y});
		paths.push({x:targetActor.getPosition().x, y:targetActor.getPosition().y});
		_lc_.m_route = MoveRoute.snew(g, speed, paths);
		
		_lc_.m_anim = NullPngAnim.snew(0);
	};
	
	this.start = function(){
		_lc_.m_isStarted = true;
	};
	
	this.update = function(){
		if (!_lc_._isCanUpdate()) return;
		
		_lc_.m_route.update();
		_lc_._recreateAnim(_lc_.m_route.getDirection());
		_lc_.m_anim.setPosition(_lc_.m_route.getPosition());
		if (_lc_.m_route.isEnd() ) {
			_lc_.m_anim.stop();
			_lc_.m_isTriggering = true;
		}
	};
	
	this.isTriggerTime = function(){ 
		return _lc_.m_isTriggering && (!_lc_.m_isTriggered);
	};
	
	this.setTriggered = function(){ 
		_lc_.m_isTriggered = true;
	};
	
	this.isEnd = function(){
		return _lc_.m_isTriggering && _lc_.m_isTriggered;
	};
	
	_lc_._isCanUpdate = function(){
		return _lc_.m_isStarted && (!_lc_.m_route.isEnd());
	};
	
	_lc_._recreateAnim = function(dir){
		if ( _lc_.m_anim.getId() == _lc_.m_g.getAnimMgr().makeAvatarAnimId(_lc_.m_resId, dir, 0) ) {
			return;
		}
		
		_lc_.m_anim.stop();
		_lc_.m_anim = _lc_.m_g.getAnimMgr().allocEffect(_lc_.m_resId, dir, _lc_.m_parent);
		_lc_.m_anim.play();
	};
	//SkillFlyPhase-unittest-end
});

SkillHurtPhase = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_action = null;
	_lc_.m_targetActor = null;
	_lc_.m_anim = null;
	_lc_.m_isStarted = false;
	_lc_.m_isTriggered = false;
	
	this.init = function(g, parent, resId, action, targetActor){
		_lc_.m_g = g;
		_lc_.m_action = action;
		_lc_.m_targetActor = targetActor;
		_lc_.m_anim = _lc_.m_g.getAnimMgr().allocEffect(resId, targetActor.getDirection(), parent);
	};
	
	this.start = function(){
		_lc_.m_anim.play();
		_lc_.m_anim.setPosition(_lc_.m_targetActor.getPosition());
		_lc_.m_isStarted = true;
	};
	
	this.update = function(){
		if (_lc_.m_anim.isTriggerTime()) {
			_lc_.m_anim.setTriggered();
			_lc_.m_targetActor.setState( StateFactory.createByType(null, _lc_.m_targetActor, 'hurtstate', _lc_.m_action) );
		}
	};
	
	this.isTriggerTime = function(){ 
		return _lc_.m_isStarted && (!_lc_.m_isTriggered) && _lc_.m_anim.isEnd();
	};
	
	this.setTriggered = function(){ 
		_lc_.m_isTriggered = true;
	};
	
	this.isEnd = function(){
		return _lc_.m_anim.isEnd();
	};
	//SkillHurtPhase-unittest-end
});

SkillPhaseFactory = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	this.initOneTime = function(g){
		_lc_.m_g = g;
	};
	
	this.createAttackPhase = function(parent, action, sourceActor){
		var res = _lc_._getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillAttackPhase.snew(_lc_.m_g, parent, res.phases.attack.id, sourceActor);
	};
	
	this.createFlyPhase = function(parent, action, sourceActor, targetActor){
		var res = _lc_._getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillFlyPhase.snew(_lc_.m_g, parent, res.phases.fly.id, res.phases.fly.speed, sourceActor, targetActor);
	};
	
	this.createHurtPhase = function(parent, action, sourceActor, targetActor){
		var res = _lc_._getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillHurtPhase.snew(_lc_.m_g, parent, res.phases.hurt.id, action, targetActor);
	};
	
	_lc_._getSkillRes = function(action, sourceActor){
		if ( action.event != 'attack' && action.event != 'miss' && action.event != 'berserk' ) {
			return null;
		}
		
		var skillId = sourceActor.getResId();
		return TQ.qfind(res_cltskills, 'id', skillId);
	};
	//SkillPhaseFactory-unittest-end
}).snew();

ActorSkill = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_phases = [];
	this.init = function(parent, action, sourceActor, targetActor){
		_lc_.m_phases.push(SkillPhaseFactory.createAttackPhase(parent, action, sourceActor));
		_lc_.m_phases.push(SkillPhaseFactory.createFlyPhase(parent, action, sourceActor, targetActor));
		_lc_.m_phases.push(SkillPhaseFactory.createHurtPhase(parent, action, sourceActor, targetActor));
		_lc_.m_phases.push(NullSkillPhase.snew()); // push NullSkillPhase as end phase
	};
	
	this.start = function(){
		_lc_.m_phases[0].start();
	};
	
	this.update = function(){
		for ( var i=0; i<_lc_.m_phases.length-1; ++i ) {
			_lc_._updatePhaseAndTriggerNext(_lc_.m_phases[i], _lc_.m_phases[i+1]);
		}
	};
	
	this.isEnd = function(){
		for ( var i=0; i<_lc_.m_phases.length; ++i ) {
			if ( !_lc_.m_phases[i].isEnd() ) return false;
		}
		return true;
	};
	
	_lc_._updatePhaseAndTriggerNext = function(prePhase, nextPhase){
		prePhase.update();
		if ( prePhase.isTriggerTime() ) {
			prePhase.setTriggered();
			nextPhase.start();
		}
	};
	//ActorSkill-unittest-end
});

SkillManager = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_skills = [];
	
	this.initOneTime = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.addSkill = function(parent, action, sourceActor, targetActor){
		var skill = ActorSkill.snew(parent, action, sourceActor, targetActor);
		skill.start();
		_lc_.m_skills.push(skill);
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 10);
		return skill;  // for test
	};
	
	_lc_._onUpdate = function(){
		if ( _lc_.m_skills.length == 0 ) {
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
			return;
		}
		
		for ( i=_lc_.m_skills.length-1; i>=0; --i ){
			_lc_.m_skills[i].update();
			if (_lc_.m_skills[i].isEnd()){
				_lc_.m_skills.splice(i, 1);
				continue;
			}
		}
	};
	//SkillManager-unittest-end
}).snew();
