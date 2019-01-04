--*******************************************************************************
--*******************************************************************************
CampActorInfoSetterForDebug = Class:extends({
	init = function(self)
	end;
	
	setActorInfo = function(self, inActor, outActor)
		if inActor:getType() == ACTOR_TYPE.WALL then
			self:setWallActorInfo(inActor, outActor)
		elseif inActor:getType() == ACTOR_TYPE.HERO then
			self:setHeroActorInfo(inActor, outActor)
		elseif inActor:getType() == ACTOR_TYPE.SOLDIER then
			self:setSoldierActorInfo(inActor, outActor)
		elseif inActor:getType() == ACTOR_TYPE.DEF then
			self:setCityDefActorInfo(inActor, outActor)
		end
	end;
	
	setWallActorInfo = function(self, inActor, outActor)
		outActor.detail = {}
		outActor.detail.attrs = {}
		outActor.detail.attrs[ATTR.HP] = inActor:getAttrVal(ATTR.HP)
		outActor.detail.attrs[ATTR.MHP] = inActor:getAttrVal(ATTR.MHP)
		outActor.detail.attrs[ATTR.UHP] = 1
		outActor.detail.attrs[ATTR.DE] = inActor:getAttrVal(ATTR.DE)
		outActor.detail.attackSpeed = inActor:getAttackSpeed()
		outActor.detail.attackRange = inActor:getAttackRange()
		outActor.detail.isCanDodge = inActor:isCanDodge()
		outActor.detail.icon = 0
	end;
	
	setHeroActorInfo = function(self, inActor, outActor)
		outActor.detail = {}
		outActor.detail.attrs = {}
		outActor.detail.attrs[ATTR.HU] = inActor:getAttrVal(ATTR.HU)
		outActor.detail.attrs[ATTR.DE] = inActor:getAttrVal(ATTR.DE)
		outActor.detail.attrs[ATTR.HI] = inActor:getAttrVal(ATTR.HI)
		outActor.detail.attrs[ATTR.HP] = inActor:getAttrVal(ATTR.HP)
		outActor.detail.attrs[ATTR.UHP] = 1
		outActor.detail.attrs[ATTR.ES] = inActor:getAttrVal(ATTR.ES)
		outActor.detail.attrs[ATTR.BER] = inActor:getAttrVal(ATTR.BER)
		outActor.detail.attrs[ATTR.BER] = inActor:getAttrVal(ATTR.BER)
		outActor.detail.attrs[ATTR.SFC] = inActor:getAttrVal(ATTR.SFC)
		outActor.detail.attackSpeed = inActor:getAttackSpeed()
		outActor.detail.attackRange = inActor:getAttackRange()
		outActor.detail.isCanDodge = inActor:isCanDodge()
		outActor.detail.icon = inActor:getIcon()
	end;
	
	setSoldierActorInfo = function(self, inActor, outActor)
		outActor.detail = {}
		outActor.detail.attrs = {}
		outActor.detail.attrs[ATTR.HU] = inActor:getAttrVal(ATTR.HU)
		outActor.detail.attrs[ATTR.DE] = inActor:getAttrVal(ATTR.DE)
		outActor.detail.attrs[ATTR.HI] = inActor:getAttrVal(ATTR.HI)
		outActor.detail.attrs[ATTR.HP] = inActor:getAttrVal(ATTR.HP)
		outActor.detail.attrs[ATTR.UHP] = inActor:getAttrVal(ATTR.UHP)
		outActor.detail.attrs[ATTR.ES] = inActor:getAttrVal(ATTR.ES)
		outActor.detail.attrs[ATTR.BER] = inActor:getAttrVal(ATTR.BER)
		outActor.detail.attrs[ATTR.FC] = inActor:getAttrVal(ATTR.FC)
		outActor.detail.attackSpeed = inActor:getAttackSpeed()
		outActor.detail.attackRange = inActor:getAttackRange()
		outActor.detail.isCanDodge = inActor:isCanDodge()
		outActor.detail.icon = inActor:getIcon()
	end;
	
	setCityDefActorInfo = function(self, inActor, outActor)
		outActor.detail = {}
		outActor.detail.attrs = {}
		outActor.detail.attrs[ATTR.HU] = inActor:getAttrVal(ATTR.HU)
		outActor.detail.attrs[ATTR.HP] = inActor:getInitNumber()
		outActor.detail.attrs[ATTR.UHP] = 1
		outActor.detail.number = inActor:getInitNumber()
		outActor.detail.unitNumber = inActor:getFightUnitNumber()
		outActor.detail.attackSpeed = inActor:getAttackSpeed()
		outActor.detail.attackRange = inActor:getAttackRange()
		outActor.detail.isCanDodge = inActor:isCanDodge()
		outActor.detail.icon = 0
	end;
}):new()


