--*******************************************************************************
--*******************************************************************************
SoldierAttrHelper = Class:extends({
	init = function(self)
		self.soldiersEffectIds = {}
		self.soldiersEffectIds[FIXID.DAOBING] = {str=RES_EFF.ADD_DB_STR, phy=RES_EFF.ADD_DB_PHY, agile=RES_EFF.ADD_DB_AGILE}
		self.soldiersEffectIds[FIXID.JIBING] = {str=RES_EFF.ADD_JB_STR, phy=RES_EFF.ADD_JB_PHY, agile=RES_EFF.ADD_JB_AGILE}
		self.soldiersEffectIds[FIXID.GONGBING] = {str=RES_EFF.ADD_GB_STR, phy=RES_EFF.ADD_GB_PHY, agile=RES_EFF.ADD_GB_AGILE}
		self.soldiersEffectIds[FIXID.QIBING] = {str=RES_EFF.ADD_QB_STR, phy=RES_EFF.ADD_QB_PHY, agile=RES_EFF.ADD_QB_AGILE}
		self.soldiersEffectIds[FIXID.QIXIE] = {str=RES_EFF.ADD_QX_STR, phy=RES_EFF.ADD_QX_PHY, agile=RES_EFF.ADD_QX_AGILE}
		
		self.soldierAttrs = {}
		self.armyAttrs = {}
	end;
	
	setHero = function(self, hero)
		self:initParams()
		if hero == nil then
			return false
		end
		
		local resid = hero:getSoldier().resid
		if resid == 0 then 
			return false
		end
		
		local baseSoldierId, soldierLevel = ItemResUtil:splitResidLevel(resid)
		local soldierRes = ItemResUtil:findItemres(baseSoldierId)
		if soldierRes == nil then
			return false
		end
		
		self.hero = hero
		self.player = self.hero:getPlayer()
		self.baseSoldierId = baseSoldierId
		self.soldierLevel = soldierLevel
		self.soldierRes = soldierRes
		
		self:_calcSoldierAttrVals()
		self:_calcArmyAttrVals()
		return true
	end;
	
	initParams = function(self)
		self.hero = nil
		self.player = nil
		self.baseSoldierId = 0
		self.soldierLevel = 0
		self.soldierRes = nil
		
		self.soldierAttrs.str = 0
		self.soldierAttrs.phy = 0
		self.soldierAttrs.agile = 0
		self.soldierAttrs.mspeed = 0
		self.soldierAttrs.arange = 0
		self.soldierAttrs.aspeed = 0
		
		self.armyAttrs[ATTR.HU] = 0
		self.armyAttrs[ATTR.DE] = 0
		self.armyAttrs[ATTR.HI] = 0
		self.armyAttrs[ATTR.ES] = 0
		self.armyAttrs[ATTR.BER] = 0
		self.armyAttrs[ATTR.MPS] = 0
	end;
	
	getSoldierAttrVal = function(self, attrName)
		return self.soldierAttrs[attrName]
	end;
	
	getArmyAttrVal = function(self, attrId)
		return self.armyAttrs[attrId]
	end;
	
	getSoldierLevel = function(self)
		return self.soldierLevel
	end;
	
	getSoldierBaseId = function(self)
		return self.baseSoldierId
	end;
	
	_calcSoldierAttrVals = function(self)
		self.soldierAttrs.str = self:_getSoldierAttrVal('str')
		self.soldierAttrs.phy = self:_getSoldierAttrVal('phy')
		self.soldierAttrs.agile = self:_getSoldierAttrVal('agile')
		self.soldierAttrs.mspeed = self:_getSoldierAttrVal('mspeed')
		self.soldierAttrs.arange = self:_getSoldierAttrVal('arange')
		self.soldierAttrs.aspeed = self:_getSoldierAttrVal('aspeed')
	end;
	
	_calcArmyAttrVals = function(self)
		local factor = self.hero:getAdaptableFactor() + 0.2*self.soldierLevel
		self.armyAttrs[ATTR.HU] = res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.HU), res_calcsoldier_hurt_attr(self.soldierAttrs.str), factor)
		self.armyAttrs[ATTR.DE] = res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.DE), res_calcsoldier_def_attr(self.soldierAttrs.phy), factor)
		self.armyAttrs[ATTR.HI] = res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.HI), res_calcsoldier_hit_attr(self.soldierAttrs.agile), factor)
		self.armyAttrs[ATTR.ES] = res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.ES), res_calcsoldier_esc_attr(self.soldierAttrs.agile), factor)
		self.armyAttrs[ATTR.BER] = res_get_soldier_ber_attr_val(self.hero:getAttrVal(ATTR.BER), res_calcsoldier_batkper_attr(self.soldierAttrs.agile), factor)
		self.armyAttrs[ATTR.MPS] = res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.MPS), res_calcsoldier_maxphy_attr(self.soldierAttrs.phy), factor)
	end;
	
	_getSoldierAttrVal = function(self, attrName)
		if self.soldierRes == nil then
			return 0
		end
		
		local localenv = {LV = self.soldierLevel}
		local baseVal = eval(self.soldierRes[attrName], localenv)
		
		local soldierEffectIds = self.soldiersEffectIds[self.baseSoldierId]
		local val = baseVal + CultureEffectMgr:getEffectAddVal(self.player, baseVal, soldierEffectIds[attrName])
		return val
	end;
}):new()


