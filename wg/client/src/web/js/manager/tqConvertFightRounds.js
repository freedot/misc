/*******************************************************************************/
ConvertFightRounds = Class.extern(function(){
	//ConvertFightRounds-unittest-start
	var m_convertors = {};
	this.init = function(){
		m_convertors['fightstart'] = FightFightStartActionConvertor.snew();
		m_convertors['round'] = FightRoundStartActionConvertor.snew();
		m_convertors['move'] = FightMoveActionConvertor.snew();
		m_convertors['attack'] = FightAttackActionConvertor.snew();
		m_convertors['miss'] = FightMissActionConvertor.snew();
		m_convertors['default'] = FightDefaultActionConvertor.snew();
	};
	
	this.convert = function(desRounds, srcActions){
		for ( var i=0, seq=0; i<srcActions.length; ++i ) {
			var srcAction = srcActions[i];
			srcAction.seq = ++seq;
			srcAction.subseq = 0;
			var convertor = _findConvertorBy(srcAction.event);
			i = convertor.convert(desRounds, desRounds.length-1, srcActions, i);
		};
	};
	
	this.splitRounds = function(rounds){
		var desRounds = [];
		for ( var roundIdx=0; roundIdx<rounds.length; ++roundIdx ) {
			var actions = rounds[roundIdx];
			desRounds.push([]);
			var desActions = desRounds[desRounds.length-1];
			for ( var actionIdx=0; actionIdx<actions.length; ++actionIdx) {
				var action = actions[actionIdx];
				if ( (action.event == 'movestart' ) 
					|| (action.event == 'movesplit')
					|| (action.event == 'moveend')) {
					desRounds.push([]);
					desActions = desRounds[desRounds.length-1];
					desActions.push(actions[0]);
				} else {
					desActions.push(action);
				}
			}
		}
		return desRounds;
	};
	
	var _findConvertorBy = function(eventName){
		var convertor = m_convertors[eventName];
		if ( convertor ) return convertor;
		return m_convertors['default'];
	};
	//ConvertFightRounds-unittest-end
});

FightDefaultActionConvertor = Class.extern(function(){
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		desRounds[curRoundIdx].push(srcActions[startSrcIdx]);
		return startSrcIdx;
	};
});

FightFightStartActionConvertor = Class.extern(function(){
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		return startSrcIdx;
	};
});

FightRoundStartActionConvertor = Class.extern(function(){
	var m_defaultConvertor = FightDefaultActionConvertor.snew();
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		desRounds.push([]);
		return m_defaultConvertor.convert(desRounds, desRounds.length-1, srcActions, startSrcIdx);
	};
});

FightMoveActionConvertor = Class.extern(function(){
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		var startAction = srcActions[startSrcIdx];
		
		var copyMoveAction = {};
		TQ.dictCopy(copyMoveAction, startAction);
		
		var sameActorEndMoveIdx = _findSameActorMoveEndIdx(srcActions, startSrcIdx);
		_combineSamePaths(copyMoveAction.paths, srcActions, startSrcIdx, sameActorEndMoveIdx);
		
		desRounds[curRoundIdx].push(copyMoveAction);
		return sameActorEndMoveIdx;
	};
	
	var _findSameActorMoveEndIdx = function(srcActions, startSrcIdx){
		var startAction = srcActions[startSrcIdx];
		for ( var i=startSrcIdx+1; i<srcActions.length; ++i ) {
			var srcAction = srcActions[i];
			if ( srcAction.event != 'move' ) return i-1;
			if ( srcAction.id != startAction.id ) return i-1;
		}
		return srcActions.length - 1;
	};
	
	var _combineSamePaths = function(paths, srcActions, startSrcIdx, sameActorEndMoveIdx){
		for ( var i=startSrcIdx + 1; i<=sameActorEndMoveIdx; ++i ) {
			var srcAction = srcActions[i];
			paths.push(srcAction.paths[0]);
		}
	};	
});

FightAttackActionConvertor = Class.extern(function(){
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		var desRound = desRounds[curRoundIdx];
		
		var seq = srcActions[startSrcIdx].seq;
		startSrcIdx = _skipAttackActionWhenBerserk(srcActions, startSrcIdx);
		var attackEndIdx = _findAttackEndIdx(srcActions, startSrcIdx);
		
		var subseq = 0;
		for ( var i=startSrcIdx; i<attackEndIdx; ++i ) {
			if ( isNull(srcActions[i].seq) ) srcActions[i].seq = seq;
			if ( isNull(srcActions[i].subseq) ) srcActions[i].subseq = subseq;
			subseq = srcActions[i].subseq + 1;
		}
		
		var copyAttackAction = {effects:[]};
		var startAction = srcActions[startSrcIdx];
		TQ.dictCopy(copyAttackAction, startAction);
		_pushAttackActionAsEffect(copyAttackAction.effects, startAction);
		_pushEffectsInAttackPhase(copyAttackAction.effects, srcActions, startSrcIdx, attackEndIdx);
		desRound.push(copyAttackAction);
		
		var spawnPairActions = _spawnNewAttackActionByEffect(srcActions, startSrcIdx, attackEndIdx);
		for(var i=0; i<spawnPairActions.length; ++i){
			this.convert(desRounds, curRoundIdx, spawnPairActions[i], 0);
		}
		
		var dieActions = _collectDieActions(srcActions, startSrcIdx, attackEndIdx);
		for ( var i=0; i<dieActions.length; ++i ) {
			desRound.push(dieActions[i]);
		}
		
		return attackEndIdx;
	};
	
	var _skipAttackActionWhenBerserk = function(srcActions, startSrcIdx){
		if ( srcActions[startSrcIdx+1] && srcActions[startSrcIdx+1].event == 'berserk' ){
			return startSrcIdx+1;
		}
		return startSrcIdx;
	};
	
	var _pushAttackActionAsEffect = function(effects, startAction){
		effects.push({userid:startAction.userid
			,targetid:startAction.targetid
			,effid: (startAction.event == 'berserk') ? RES_EFF.F_CLT_BERSERK_SUBHP : RES_EFF.F_CLT_SUBHP
			,val:startAction.val});		
	};
	
	var _pushEffectsInAttackPhase = function(effects, srcActions, startSrcIdx, attackEndIdx){
		for ( var i=startSrcIdx+1; i<attackEndIdx; ++i ) {
			var srcAction = srcActions[i];
			if ( !_isCanSpawn(srcAction.effid) && !_isDieAction(srcAction) ) {
				effects.push(srcAction);
			}
		}
	};
	
	var _spawnNewAttackActionByEffect = function(srcActions, startSrcIdx, attackEndIdx){
		var spawnPairActions = [];
		for ( var i=startSrcIdx+1; i<attackEndIdx; ++i ) {
			var srcAction = srcActions[i];
			if ( _isCanSpawn(srcAction.effid) ) {
				var newAction = {event:'attack', userid:srcAction.userid, targetid:srcAction.targetid, val:srcAction.val, seq:srcAction.seq, subseq:srcAction.subseq};
				spawnPairActions.push([newAction, {event:'attackend'}]);
			}
		}
		return spawnPairActions;
	};
	
	var _collectDieActions = function(srcActions, startSrcIdx, attackEndIdx){
		var dieActions = [];
		for ( var i=startSrcIdx+1; i<attackEndIdx; ++i ) {
			var srcAction = srcActions[i];
			if ( _isDieAction(srcAction) ) {
				dieActions.push(srcAction);
			}
		}
		return dieActions;
	};
	
	var _isCanSpawn = function(effectId){
		if (isNull(effectId)) return false;
		
		return effectId == RES_EFF.F_LIANJI 
			|| effectId == RES_EFF.F_FANJI;
	};
	
	var _isDieAction = function(action){
		return action.event && action.event == 'die';
	};
	
	var _findAttackEndIdx = function(srcActions, startSrcIdx) {
		for ( var i=startSrcIdx + 1; i<srcActions.length; ++i ) {
			if ( srcActions[i].event == 'attackend' ) return i;
		}
		return startSrcIdx;
	};
});

FightMissActionConvertor = Class.extern(function(){
	this.convert = function(desRounds, curRoundIdx, srcActions, startSrcIdx){
		var desRound = desRounds[curRoundIdx];
		var copyMissAction = {effects:[]};
		var startAction = srcActions[startSrcIdx];
		TQ.dictCopy(copyMissAction, startAction);
		copyMissAction.effects.push({userid:startAction.userid, targetid:startAction.targetid, effid:RES_EFF.F_CLT_MISS, val:rstr.fight.effect.miss});
		desRound.push(copyMissAction);
		return startSrcIdx;
	};
});
