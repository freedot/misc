/*******************************************************************************/
SelfFieldUtil = Class.extern(function(){
	//SelfFieldUtil-unittest-start
	this.initOneTime = function(g){
		this.g = g;
	};
	
	this.hasSoldiersDispatched = function(field){
		var hero = this.getCurDispatchHero(field);
		if (!hero) return false;
		
		return hero.soldier.number > 0;
	};
	
	this.getCurDispatchHero = function(field){
		var army = this.getCurDispatchArmy(field);
		if (!army) return null;
		
		for ( var i=0; i<army.heros.length; ++i ){
			var hero = army.heros[i];
			if ( hero.id > 0 ) return hero;
		}
		return null;
	};
	
	this.hasArmyDispatched = function(field){
		return this.getCurDispatchArmy(field) != null;
	};	
	
	this.getCurDispatchArmy = function(field){
		var armys = this.g.getImgr().getArmys().list;
		for (var i=0; i<armys.length; ++i){
			var army = armys[i];
			if (army.armyType != ARMY_TYPE.SELF) continue;
			if (army.targetType != field.objType) continue;
			if (FieldUtil.getGridIdByPos(army.targetPos) != field.gridId) continue;
			if (army.state != ARMYDYN_STATE.DISPATCH) continue;
			
			return army;
		}
		
		return null;
	};		
	//SelfFieldUtil-unittest-end
}).snew();
