--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqCultureEffectMgr')

local TestCaseCultureEffectMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:backRes()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testGetEffectAddVal_noLearnCulture = function(self)
		local addVal = CultureEffectMgr:getEffectAddVal(self.player, 100, RES_EFF.ADD_DB_STR)
		assert ( addVal == 0 )
	end;
	
	testGetEffectAddVal_learnCulture = function(self)
		res_items_cultures={
			{effects={{u=VAL_UNIT.PER,id=RES_EFF.ADD_DB_STR,val='LV*20'}, {u=VAL_UNIT.VAL,id=RES_EFF.ADD_DB_PHY,val=1}},maxlevel=20,id=120007},
			{effects={{u=VAL_UNIT.VAL,id=RES_EFF.ADD_DB_STR,val='LV*20'}, {u=VAL_UNIT.VAL,id=RES_EFF.ADD_DB_STR,val=1} },maxlevel=20,id=120008} }
		TestCaseCondition:setPreCond(self.player, nil, {  cultures={{id=120007, level=1},{id=120008, level=2}} })

		CultureEffectMgr:initEffectsMap()
		local addVal = CultureEffectMgr:getEffectAddVal(self.player, 200, RES_EFF.ADD_DB_STR)

		assert ( addVal == 200*(1*20)/100 + 2*20 + 1  )
	end;
})


tqCultureEffectMgr_t_main = function(suite)
	suite:addTestCase(TestCaseCultureEffectMgr, 'TestCaseCultureEffectMgr')
end;


