--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqSoldierAttrHelper')

local TestCaseSoldierAttrHelper = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;

	testGetSoldierEffectIds = function(self)
		local effectIds = SoldierAttrHelper.soldiersEffectIds[FIXID.DAOBING]
		assert ( effectIds.str == RES_EFF.ADD_DB_STR)
		assert ( effectIds.phy == RES_EFF.ADD_DB_PHY)
		assert ( effectIds.agile == RES_EFF.ADD_DB_AGILE)
		
		effectIds = SoldierAttrHelper.soldiersEffectIds[FIXID.JIBING]
		assert ( effectIds.str == RES_EFF.ADD_JB_STR)
		assert ( effectIds.phy == RES_EFF.ADD_JB_PHY)
		assert ( effectIds.agile == RES_EFF.ADD_JB_AGILE)
		
		effectIds = SoldierAttrHelper.soldiersEffectIds[FIXID.GONGBING]
		assert ( effectIds.str == RES_EFF.ADD_GB_STR)
		assert ( effectIds.phy == RES_EFF.ADD_GB_PHY)
		assert ( effectIds.agile == RES_EFF.ADD_GB_AGILE)
		
		effectIds = SoldierAttrHelper.soldiersEffectIds[FIXID.QIBING]
		assert ( effectIds.str == RES_EFF.ADD_QB_STR)
		assert ( effectIds.phy == RES_EFF.ADD_QB_PHY)
		assert ( effectIds.agile == RES_EFF.ADD_QB_AGILE)
		
		effectIds = SoldierAttrHelper.soldiersEffectIds[FIXID.QIXIE]
		assert ( effectIds.str == RES_EFF.ADD_QX_STR)
		assert ( effectIds.phy == RES_EFF.ADD_QX_PHY)
		assert ( effectIds.agile == RES_EFF.ADD_QX_AGILE)
	end;
	
	testSetHero = function(self)
		-- hero is nil
		assert ( SoldierAttrHelper:setHero(nil) == false )
		assert ( SoldierAttrHelper.hero == nil )
		assert ( SoldierAttrHelper.player == nil )
		assert ( SoldierAttrHelper.baseSoldierId == 0 )
		assert ( SoldierAttrHelper.soldierLevel == 0 )
		assert ( SoldierAttrHelper.soldierRes == nil )
		assert ( SoldierAttrHelper:getSoldierAttrVal('str') == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.HU) == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.DE) == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.HI) == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.ES) == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.BER) == 0 )
		assert ( SoldierAttrHelper:getArmyAttrVal(ATTR.MPS) == 0 )
		
		-- soldier id is zero
		self.hero:carrySoldier({resid=0,number=0})
		assert ( SoldierAttrHelper:setHero(self.hero) == false )
		
		-- soldier id is invalid
		self.hero:carrySoldier({resid=100001001,number=1})
		assert ( SoldierAttrHelper:setHero(self.hero) == false )
		
		-- ok
		self.hero:carrySoldier({resid=150001001,number=1})
		assert ( SoldierAttrHelper:setHero(self.hero) == true )
		assert ( SoldierAttrHelper.hero == self.hero )
		assert ( SoldierAttrHelper.player == self.hero:getPlayer() )
		assert ( SoldierAttrHelper.baseSoldierId == 150001 )
		assert ( SoldierAttrHelper.soldierLevel == 1 )
		assert ( SoldierAttrHelper.soldierRes ~= nil )
		assert ( SoldierAttrHelper:getSoldierAttrVal('str') > 0 )
	end;
	
	testGetSoldierAttrVal = function(self)
		-- no culture add
		self.hero:carrySoldier({resid=150002001,number=1})
		SoldierAttrHelper:setHero(self.hero)
		
		local res = ItemResUtil:findItemres(150002)
		local localenv = {LV=1}
		local basestr = eval(res.str, localenv)
		local basephy = eval(res.phy, localenv)
		local baseagile = eval(res.agile, localenv)
		
		assert ( SoldierAttrHelper:getSoldierAttrVal('str') == basestr )
		assert ( SoldierAttrHelper:getSoldierAttrVal('phy') == basephy )
		assert ( SoldierAttrHelper:getSoldierAttrVal('agile') == baseagile )
		
		-- has culture add
		TestCaseCondition:setPreCond(self.player, nil, {  cultures={{id=120007, level=1},{id=120008, level=2},{id=120009, level=3}} })
		self.hero:carrySoldier({resid=150001001,number=1})
		SoldierAttrHelper:setHero(self.hero)
		
		local res = ItemResUtil:findItemres(150001)
		local localenv = {LV=1}
		local basestr = eval(res.str, localenv)
		local basephy = eval(res.phy, localenv)
		local baseagile = eval(res.agile, localenv)
		
		local mspeed = eval(res.mspeed, localenv)
		local arange = eval(res.arange, localenv)
		local aspeed = eval(res.aspeed, localenv)
		
		assertFloatEQ ( SoldierAttrHelper:getSoldierAttrVal('str'), basestr*1.2 )
		assertFloatEQ ( SoldierAttrHelper:getSoldierAttrVal('phy'), basephy*1.4 )
		assertFloatEQ ( SoldierAttrHelper:getSoldierAttrVal('agile'), baseagile*1.6 )
		
		assertEQ ( SoldierAttrHelper:getSoldierAttrVal('mspeed'), mspeed )
		assertEQ ( SoldierAttrHelper:getSoldierAttrVal('arange'), arange )
		assertEQ ( SoldierAttrHelper:getSoldierAttrVal('aspeed'), aspeed )
	end;
	
	test_getArmyAttrVal = function(self)
		self.hero:carrySoldier({resid=150002001,number=1})
		SoldierAttrHelper:setHero(self.hero)
		local soldierLevel = 1
		local factor = self.hero:getAdaptableFactor() + 0.2*soldierLevel
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.HU), res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.HU), res_calcsoldier_hurt_attr(SoldierAttrHelper:getSoldierAttrVal('str')), factor)  )
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.DE), res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.DE), res_calcsoldier_def_attr(SoldierAttrHelper:getSoldierAttrVal('phy')), factor)  )
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.HI), res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.HI), res_calcsoldier_hit_attr(SoldierAttrHelper:getSoldierAttrVal('agile')), factor)  )
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.ES), res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.ES), res_calcsoldier_esc_attr(SoldierAttrHelper:getSoldierAttrVal('agile')), factor)  )
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.BER), res_get_soldier_ber_attr_val(self.hero:getAttrVal(ATTR.BER), res_calcsoldier_batkper_attr(SoldierAttrHelper:getSoldierAttrVal('agile')), factor)  )
		assertFloatEQ ( SoldierAttrHelper:getArmyAttrVal(ATTR.MPS), res_get_soldier_attr_val(self.hero:getAttrVal(ATTR.MPS), res_calcsoldier_maxphy_attr(SoldierAttrHelper:getSoldierAttrVal('phy')), factor)  )
	end;
	
	test_getSoldierLevel = function(self)
		self.hero:carrySoldier({resid=150002002,number=1})
		SoldierAttrHelper:setHero(self.hero)
		assertEQ ( SoldierAttrHelper:getSoldierLevel(), 2 )
	end;
	
	test_getSoldierBaseId = function(self)
		self.hero:carrySoldier({resid=150003001,number=1})
		SoldierAttrHelper:setHero(self.hero)
		assertEQ ( SoldierAttrHelper:getSoldierBaseId(), 150003 )
	end;
})


tqSoldierAttrHelper_t_main = function(suite)
	suite:addTestCase(TestCaseSoldierAttrHelper, 'TestCaseSoldierAttrHelper')
end;


