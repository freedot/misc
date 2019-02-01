//战斗结果生成器
FightResultMaker = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.getResultTitle = function(fightResult){
		if ( _lc_._isMainArmyDefender(fightResult) ) {
			return _lc_._getMainArmyDefenderResultTitle(fightResult);
		}
		else if ( _lc_._isAlliArmyDefender(fightResult) ) {
			return _lc_._getAlliArmyDefenderResultTitle(fightResult);
		}
		else if ( _lc_._isTowerArmyDefender(fightResult) ) {
			return _lc_._getTowerArmyDefenderResultTitle(fightResult);
		}
		else if ( _lc_._isCopyFieldArmyDefender(fightResult) ) {
			return _lc_._getCopyFieldArmyDefenderResultTitle(fightResult);
		}
		else if ( _lc_._isOwnerFieldArmyDefender(fightResult) ) {
			return _lc_._getOwnerFieldArmyDefenderResultTitle(fightResult);
		}
		else if ( _lc_._isFieldArmyDefender(fightResult) ) {
			return _lc_._getFieldArmyDefenderResultTitle(fightResult);
		}
		else {
			return 'error result defender!';
		}
	};	
	
	this.getHonorString = function(fightResult){
		return _getHonorString(fightResult);
	};	
	
	this.hasDefExpend = function(defexpend) {
		var expendVal = defexpend.xianjing 
			+ defexpend.gunmu 
			+ defexpend.juma 
			+ defexpend.leishi 
			+ defexpend.nujian;
		return expendVal > 0;
	};
	
	this.getDefExpend = function(orgDefExpend) {
		var defExpend = {xianjing:0, gunmu:0, juma:0, leishi:0, nujian:0};
		TQ.dictCopy(defExpend, orgDefExpend);
		return TQ.format(rstr.military.fightresult.lbl.lostCityDefRes
			,defExpend.xianjing
			,defExpend.gunmu
			,defExpend.juma
			,defExpend.leishi
			,defExpend.nujian	);
	};
	
	this.getGetOrLostResTitle = function(fightResult) {
		var attackResTitle = '';
		var targetResTitle = '';
		if ( fightResult.result == FIGHT_RESULT.ATTACKSUCC ){
			attackResTitle = rstr.military.fightresult.lbl.attackGetRes;
			targetResTitle = rstr.military.fightresult.lbl.targetLostRes;
		}
		else {
			attackResTitle = rstr.military.fightresult.lbl.attackLostRes;
			targetResTitle = rstr.military.fightresult.lbl.targetGetRes;
		}
		
		return {attack:attackResTitle, target:targetResTitle};
	};
	
	this.getGetOrLostResString = function(campData){
		var s = '';
		if ( _lc_._hasRes(campData.gainres) ) {
			s = rstr.military.fightresult.lbl.getRes;
			s += _lc_._makeResString('+', campData.gainres);
		}
		else if ( _lc_._hasRes(campData.lossres) ) {
			s = rstr.military.fightresult.lbl.lostRes;
			s += _lc_._makeResString('-', campData.lossres);
		}
		
		return s;
	};
	
	this.getDropItemsString = function(campData){
		var s = '';
		for ( var k in campData.getdrop ) {
			var drop = campData.getdrop[k];
			if ( drop.type != 'item' ) 
				continue;
			
			var res = ItemResUtil.findItemres(drop.id);
			if ( !res ) 
				continue;
			
			if ( s != '' ) 
				s += ', ';
			
			s += res.name + rstr.dropdesc.numPrefix + drop.number;
		}
		
		if ( s != '' ) {
			s = rstr.military.fightresult.lbl.getItems + s;
		}
		
		return s;
	};
	
	this.isMySucc = function(fightResult){
		var roleRes = m_g.getImgr().getRoleRes();
		if ( fightResult.attacker.role.name == roleRes.name ) {
			return (fightResult.result == FIGHT_RESULT.ATTACKSUCC);
		}
		else {
			return (fightResult.result == FIGHT_RESULT.ATTACKFAIL);
		}
	};	
	
	_lc_._hasRes = function(res){
		if ( !res ) return false;
		
		for ( var k in res ) {
			if ( res[k] > 0 ) {
				return true;
			}
		}
		return false;
	};
	
	_lc_._makeResString = function(sign, res){
		var s='';
		var resNames = ['food','wood','stone','iron', 'money', 'popu'];
		for ( var i in resNames ) {
			var k = resNames[i];
			if ( !res[k] ) continue;
			if ( s != '' ) s = s+', ';
			
			var cssclass = 'comm_inlineline_block';
			if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) {
				cssclass = 'comm_inlineline_block_fixie';
			}
			
			s += '<div class=' + cssclass + '>' + rstr.comm[k]+' '+sign+res[k] + '</div>';
		}
		return s;
	};
	
	_lc_._isMainArmyDefender = function(fightResult){
		return (fightResult.defender.role.objType == OBJ_TYPE.ROLE)
			&& (fightResult.defender.role.name == fightResult.defenderParty);
	};
	
	_lc_._isAlliArmyDefender = function(fightResult){
		return (fightResult.defender.role.objType == OBJ_TYPE.ROLE)
			&& (fightResult.defender.role.name != fightResult.defenderParty);
	};
	
	_lc_._isTowerArmyDefender = function(fightResult){
		return fightResult.defender.role.objType == OBJ_TYPE.TOWER;
	};
	
	_lc_._isCopyFieldArmyDefender = function(fightResult){
		return fightResult.defender.role.objType == OBJ_TYPE.COPYFIELD;
	};
	
	_lc_._isOwnerFieldArmyDefender = function(fightResult){
		return fightResult.defender.role.objType == OBJ_TYPE.OWNERFIELD;
	};
	
	_lc_._isFieldArmyDefender = function(fightResult){
		return fightResult.defender.role.objType == OBJ_TYPE.FIELD;
	};
	
	_lc_._getMyFightResult = function(fightResult){
		return m_this.isMySucc(fightResult) ? rstr.military.fightresult.actions.mySucc :  rstr.military.fightresult.actions.myFail;
	};	
	
	var _getWhoGetHonor = function(fightResult){
		return m_this.isMySucc(fightResult) ? rstr.military.fightresult.actions.myGetHonor :  rstr.military.fightresult.actions.enemyGetHonor;
	};	
	
	_lc_._getMainArmyDefenderResultTitle = function(fightResult){
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackPartyRole 
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );
		s += _getHonorString(fightResult);
		return s;
	};
	
	var _getHonorString = function(fightResult){
		if ( !_lc_._isMainArmyDefender(fightResult) ) return '';
		if ( !fightResult.attacker.gainres || !fightResult.attacker.gainres.honor ) return '';
		
		return TQ.format(_getWhoGetHonor(fightResult), fightResult.attacker.gainres.honor);
	};
	
	_lc_._getAlliArmyDefenderResultTitle = function(fightResult){
		return TQ.format(rstr.military.fightresult.actions.resultAttackAlliance 
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)
			,fightResult.defenderParty
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );	
	};
	
	_lc_._getTowerArmyDefenderResultTitle = function(fightResult){
		return TQ.format(rstr.military.fightresult.actions.resultAttackTower 
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)
			,fightResult.defenderParty
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );
	};
	
	_lc_._getCopyFieldArmyDefenderResultTitle = function(fightResult){
		return TQ.format(rstr.military.fightresult.actions.resultAttackCopyField
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );
	};
	
	_lc_._getOwnerFieldArmyDefenderResultTitle = function(fightResult){
			return TQ.format(rstr.military.fightresult.actions.resultAttackOwnerField
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)	
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );
	};	
	
	_lc_._getFieldArmyDefenderResultTitle = function(fightResult){
		return TQ.format(rstr.military.fightresult.actions.resultAttackField
			,fightResult.attacker.role.name 
			,_getExpedName(fightResult)	
			,fightResult.defender.role.name
			,_lc_._getMyFightResult(fightResult) );
	};
	
	var _getExpedName = function(fightResult) {
		if ( fightResult.expedType && rstr.military.militarydlg.intents[fightResult.expedType] ) {
			return rstr.military.militarydlg.intents[fightResult.expedType];
		} else {
			return rstr.military.fightresult.actions.resultExpedAttack;
		}
	};
	//FightResultMaker-unittest-end
});
