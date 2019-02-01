/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
ActorAttr = function(){
	this.initialize = function(){
	};
	
	this.checkArmNeed = function(hero, needs) {
		var ret = true;
		if ( !hero ) return ret;
		for ( var i in needs ) {
			var need = needs[i];
			if ( need.attr == ATTR.LVL ) {
				ret = hero.level >= need.val;
				if ( !ret ) break;
			}
		}
		return ret;
	};

	this.initialize.apply(this, arguments);
};


AAttr = new ActorAttr();