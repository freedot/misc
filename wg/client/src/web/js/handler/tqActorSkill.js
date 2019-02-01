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
	//SkillAttackPhase-unittest-start
	var m_anim = null;
	this.init = function(g, parent, resId, sourceActor){
		m_anim = g.getAnimMgr().allocEffect(resId, sourceActor.getDirection(), parent);
	};
	
	this.start = function(){
		m_anim.play();
	};
	
	this.update = function(){};
	
	this.isTriggerTime = function(){ 
		return m_anim.isTriggerTime(); 
	};
	
	this.setTriggered = function(){
		m_anim.setTriggered();
	};
	
	this.isEnd = function(){
		return m_anim.isEnd();
	};
	//SkillAttackPhase-unittest-end
});

SkillFlyPhase = Class.extern(function(){
	//SkillFlyPhase-unittest-start
	var m_g = null;
	var m_resId = null;
	var m_parent = null;
	var m_anim = null;
	var m_route = null;
	var m_isStarted = false;
	var m_isTriggered = false;
	var m_isTriggering = false;
	
	this.init = function(g, parent,  resId, speed, sourceActor, targetActor){
		m_g = g;
		m_parent = parent;
		m_resId = resId;
		
		var paths = [];
		paths.push({x:sourceActor.getPosition().x, y:sourceActor.getPosition().y});
		paths.push({x:targetActor.getPosition().x, y:targetActor.getPosition().y});
		m_route = MoveRoute.snew(g, speed, paths);
		
		m_anim = NullPngAnim.snew(0);
	};
	
	this.start = function(){
		m_isStarted = true;
	};
	
	this.update = function(){
		if (!_isCanUpdate()) return;
		
		m_route.update();
		_recreateAnim(m_route.getDirection());
		m_anim.setPosition(m_route.getPosition());
		if (m_route.isEnd() ) {
			m_anim.stop();
			m_isTriggering = true;
		}
	};
	
	this.isTriggerTime = function(){ 
		return m_isTriggering && (!m_isTriggered);
	};
	
	this.setTriggered = function(){ 
		m_isTriggered = true;
	};
	
	this.isEnd = function(){
		return m_isTriggering && m_isTriggered;
	};
	
	var _isCanUpdate = function(){
		return m_isStarted && (!m_route.isEnd());
	};
	
	var _recreateAnim = function(dir){
		if ( m_anim.getId() == m_g.getAnimMgr().makeAvatarAnimId(m_resId, dir, 0) ) {
			return;
		}
		
		m_anim.stop();
		m_anim = m_g.getAnimMgr().allocEffect(m_resId, dir, m_parent);
		m_anim.play();
	};
	//SkillFlyPhase-unittest-end
});

SkillHurtPhase = Class.extern(function(){
	//SkillHurtPhase-unittest-start
	var m_g = null;
	var m_action = null;
	var m_targetActor = null;
	var m_anim = null;
	var m_isStarted = false;
	var m_isTriggered = false;
	
	this.init = function(g, parent, resId, action, targetActor){
		m_g = g;
		m_action = action;
		m_targetActor = targetActor;
		m_anim = m_g.getAnimMgr().allocEffect(resId, targetActor.getDirection(), parent);
	};
	
	this.start = function(){
		m_anim.play();
		m_anim.setPosition(m_targetActor.getPosition());
		m_isStarted = true;
	};
	
	this.update = function(){
		if (m_anim.isTriggerTime()) {
			m_anim.setTriggered();
			m_targetActor.setState( StateFactory.createByType(null, m_targetActor, 'hurtstate', m_action) );
		}
	};
	
	this.isTriggerTime = function(){ 
		return m_isStarted && (!m_isTriggered) && m_anim.isEnd();
	};
	
	this.setTriggered = function(){ 
		m_isTriggered = true;
	};
	
	this.isEnd = function(){
		return m_anim.isEnd();
	};
	//SkillHurtPhase-unittest-end
});

SkillPhaseFactory = Class.extern(function(){
	//SkillPhaseFactory-unittest-start
	var m_g = null;
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.createAttackPhase = function(parent, action, sourceActor){
		var res = _getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillAttackPhase.snew(m_g, parent, res.phases.attack.id, sourceActor);
	};
	
	this.createFlyPhase = function(parent, action, sourceActor, targetActor){
		var res = _getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillFlyPhase.snew(m_g, parent, res.phases.fly.id, res.phases.fly.speed, sourceActor, targetActor);
	};
	
	this.createHurtPhase = function(parent, action, sourceActor, targetActor){
		var res = _getSkillRes(action, sourceActor);
		if (!res) return NullSkillPhase.snew();
		
		return SkillHurtPhase.snew(m_g, parent, res.phases.hurt.id, action, targetActor);
	};
	
	var _getSkillRes = function(action, sourceActor){
		if ( action.event != 'attack' && action.event != 'miss' && action.event != 'berserk' ) {
			return null;
		}
		
		var skillId = sourceActor.getResId();
		return TQ.qfind(res_cltskills, 'id', skillId);
	};
	//SkillPhaseFactory-unittest-end
}).snew();

ActorSkill = Class.extern(function(){
	//ActorSkill-unittest-start
	var m_phases = [];
	this.init = function(parent, action, sourceActor, targetActor){
		m_phases.push(SkillPhaseFactory.createAttackPhase(parent, action, sourceActor));
		m_phases.push(SkillPhaseFactory.createFlyPhase(parent, action, sourceActor, targetActor));
		m_phases.push(SkillPhaseFactory.createHurtPhase(parent, action, sourceActor, targetActor));
		m_phases.push(NullSkillPhase.snew()); // push NullSkillPhase as end phase
	};
	
	this.start = function(){
		m_phases[0].start();
	};
	
	this.update = function(){
		for ( var i=0; i<m_phases.length-1; ++i ) {
			_updatePhaseAndTriggerNext(m_phases[i], m_phases[i+1]);
		}
	};
	
	this.isEnd = function(){
		for ( var i=0; i<m_phases.length; ++i ) {
			if ( !m_phases[i].isEnd() ) return false;
		}
		return true;
	};
	
	var _updatePhaseAndTriggerNext = function(prePhase, nextPhase){
		prePhase.update();
		if ( prePhase.isTriggerTime() ) {
			prePhase.setTriggered();
			nextPhase.start();
		}
	};
	//ActorSkill-unittest-end
});

SkillManager = Class.extern(function(){
	//SkillManager-unittest-start
	var m_g = null;
	var m_this = null;
	var m_skills = [];
	
	this.initOneTime = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.addSkill = function(parent, action, sourceActor, targetActor){
		var skill = ActorSkill.snew(parent, action, sourceActor, targetActor);
		skill.start();
		m_skills.push(skill);
		m_g.regUpdater(m_this, _onUpdate, 10);
		return skill;  // for test
	};
	
	var _onUpdate = function(){
		if ( m_skills.length == 0 ) {
			m_g.unregUpdater(m_this, _onUpdate);
			return;
		}
		
		for ( i=m_skills.length-1; i>=0; --i ){
			m_skills[i].update();
			if (m_skills[i].isEnd()){
				m_skills.splice(i, 1);
				continue;
			}
		}
	};
	//SkillManager-unittest-end
}).snew();
