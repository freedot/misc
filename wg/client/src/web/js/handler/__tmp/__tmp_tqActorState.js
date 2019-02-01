/*******************************************************************************/
var actorstate_log = function(m){
	//log(m);
};

StateFactory = Class.extern(function(){
	this.C_MOVESPEED = 0.08;
	this.g = null;
	this.initOneTime = function(g){
		this.g = g;
	};
	
	this.createByType = function(user, target, stateType, action){
		if ( !stateType ) return NullState;
		
		if ( stateType == 'standstate' ) {
			return StandState.snew(user);
		} else if ( stateType == 'lockedstate' ) {
			return LockedState.snew(user);
		} else if ( stateType == 'hurtstate' ) {
			return HurtState.snew(this.g, target, action);
		} else if ( stateType == 'attackstate' ) {
			return AttackState.snew(user, target, action);
		} else if ( stateType == 'diestate' ) {
			return DieState.snew(this.g, user);
		} else if ( stateType == 'movestate' ) {
			return MoveState.snew(user, this._createRoute(user.getPosition(), action.paths));
		} else {
			return NullState;
		}
	};
	
	this._createRoute = function(startPosition, paths){
		var startIdx = 0;
		if (paths[0].x == startPosition.x && paths[0].y == startPosition.y ) {
			startIdx = 1;
		}

		var newPaths = [];
		newPaths.push({x:startPosition.x, y:startPosition.y});
		for ( var i=startIdx; i<paths.length; ++i ) {
			newPaths.push({x:paths[i].x, y:paths[i].y});
		}
		
		return MoveRoute.snew(this.g, this.C_MOVESPEED, newPaths );
	};
}).snew();

BaseState = Class.extern(function(){
	this.type_ = 'base';
	this.isIdle = function(){	return false; };
	this.start = function(){};
	this.update = function(){};
	this.end = function(){};
});

NullState = BaseState.extern(function(){
	this.type_ = 'null';
	this.isIdle = function(){
		return true;
	};
}).snew();

StandState = BaseState.extern(function(){
	this.type_ = 'stand';
	this.actor = null;
	this.init = function(actor){
		this.actor = actor;
	};
	
	this.isIdle = function(){
		return true;
	};
	
	this.start = function(){
		this.actor.setAction('stand');
	};
});

LockedState = BaseState.extern(function(){
	this.type_ = 'locked';
	this.actor = null;
	this.init = function(actor){
		this.actor = actor;
	};

	this.start = function(){
		this.actor.setAction('stand');
	};
});

MoveState = BaseState.extern(function(){
	this.type_ = 'move';
	this.actor = null;
	this.route = null;
	this.init = function(actor, route){
		this.actor = actor;
		this.route = route;
	};
	
	this.start = function(){
		this.actor.setAction('walk');
	};
	
	this.update = function(){
		this.route.update();
		this.actor.setPosition(this.route.getPosition());
		this.actor.setDirection(this.route.getDirection());
		if (this.route.isEnd()) {
			this.actor.setState( StateFactory.createByType(this.actor, null, "standstate", {}) );
		}
	};
});

AttackState = BaseState.extern(function(){
	this.type_ = 'attack';
	this.source = null;
	this.target = null;
	this.action = null;
	this.skill_ = null;
	this.init = function(source, target, action){
		this.source = source;
		this.target = target;
		this.action = action;
	};
	
	this.start = function(){
		this.source.setAction('attack');
		this.target.setState( StateFactory.createByType(this.target, null, "lockedstate", {}) );
		var vector = DirectionVector.calcDirectionVector(this.source.getPosition(), this.target.getPosition());
		this.source.setDirection(DirectionVector.getDirectionByVector(vector));
		this.source.getAnim().addCaller({self:this, caller:this._onAnimStop});
		actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' start');
	};
	
	this.update = function(){
		var anim = this.source.getAnim();
		if (anim.isTriggerTime()){
			anim.setTriggered();
			actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' trigge skill start');
			this.skill_ = SkillManager.addSkill(this.source.getParent(), this.action, this.source, this.target);
			actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' trigge skill end');
		}
		
		if ( anim.isEnd() && this.skill_ && this.skill_.isEnd() ) {
			actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' set standstate 1');
			this._setStandState();
		}
	};
	
	this._onAnimStop = function(anim){
		actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' set standstate 2');
		this.update();
		this._setStandState();
	};
	
	this._setStandState = function(){
		this.source.setState( StateFactory.createByType(this.source, null, "standstate", {}) );
	};
	
	this.end = function(){
		actorstate_log(this.source.getResId() + ' attack ' + this.target.getResId() + ' end');
		this.source.getAnim().removeCaller({self:this, caller:this._onAnimStop});
	};
});

HurtState = BaseState.extern(function(){
	this.type_ = 'hurt';
	this.g_ = null;
	this.actor = null;
	this.action = null;
	this.init = function(g, actor, action){
		this.g_ = g;
		this.actor = actor;
		this.action = action;
	};
	
	this.start = function(){
		this.actor.setAction('hurt');
		this.actor.getAnim().addCaller({self:this, caller:this._onAnimStop});
		actorstate_log(this.actor.getResId() + ' be hurt start');
	};
	
	this.update = function(){
		var anim = this.actor.getAnim();
		if (anim.isTriggerTime()){
			actorstate_log(this.actor.getResId() + ' hurt trigge effect start');
			anim.setTriggered();
			EffectManager.addMapEffect(this.actor.isHero(), this.action);
			actorstate_log(this.actor.getResId() + ' hurt trigge effect end');
		}
		
		if (anim.isEnd()) {
			actorstate_log(this.actor.getResId() + ' hurt set standstate 1');
			this._setStandState();
		}
	};
	
	this._onAnimStop = function(anim){
		actorstate_log(this.actor.getResId() + ' hurt set standstate 2');
		this.update();
		this._setStandState();
	};
	
	this._setStandState = function(){
		this.actor.setState( StateFactory.createByType(this.actor, null, "standstate", {}) );
	};
	
	this.end = function(){
		actorstate_log(this.actor.getResId() + ' hurt end');
		this.actor.getAnim().removeCaller({self:this, caller:this._onAnimStop});
	};
});

DieState = BaseState.extern(function(){
	this.type_ = 'die';
	this.g_ = null;
	this.actor = null;
	this.init = function(g, actor){
		this.g_ = g;
		this.actor = actor;
	};
	
	this.start = function(){
		this.actor.setAction('die');
		actorstate_log(this.actor.getResId() + ' die start');
	};
	
	this.isIdle = function(){
		return true;
	};
	
	this.update = function(){
		var anim = this.actor.getAnim();
		if (anim.isEnd()) {
			actorstate_log(this.actor.getResId() + ' die in update start');
			this.actor.die();
			this.g_.getActorMgr().remove(this.actor);
			actorstate_log(this.actor.getResId() + ' die in update end');
		}
	};
});

