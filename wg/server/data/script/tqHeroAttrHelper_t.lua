--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqHeroAttrHelper')

local TestCaseHeroAttrHelper = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		
		res_herojingmai[1].addhit.val = 1
		res_herojingmai[1].addhit.unit = VAL_UNIT.PER
		
		res_herojingmai[1].addhurt.val = 2
		res_herojingmai[1].addhurt.unit = VAL_UNIT.VAL
		
		res_herojingmai[1].adddef.val = 3
		res_herojingmai[1].adddef.unit = VAL_UNIT.VAL
		
		res_herojingmai[1].addes.val = 4
		res_herojingmai[1].addes.unit = VAL_UNIT.VAL
		
		res_herojingmai[1].addber.val = 5
		res_herojingmai[1].addber.unit = VAL_UNIT.VAL
		
		res_herojingmai[1].addmps.val = 6
		res_herojingmai[1].addmps.unit = VAL_UNIT.VAL
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getAddValBySkeleton = function(self)
		self.hero:setSkeletonLevel(1)
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.HI) == 2 )
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.HU) == 2 )
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.DE) == 3 )
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.ES) == 4 )
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.BER) == 5 )
		assert ( HeroAttrHelper:getAddValBySkeleton(self.hero, 200, ATTR.MPS) == 6 )
	end;
	
	test_recalcAttrs = function(self)
		self.mm:mock(HeroAttrHelper, 'recalcBaseAttrs')
		self.mm:mock(HeroAttrHelper, 'recalcDynAttrs')
		self.mm:mock(HeroAttrSender, 'sendAttrsByIds')
		HeroAttrHelper:recalcAttrs(self.player, self.hero)
		assertEQ ( self.mm.walkLog, 'recalcBaseAttrs,recalcDynAttrs,sendAttrsByIds' )
		assertEQ ( self.mm.params['recalcBaseAttrs'], {self.player, self.hero} )
		assertEQ ( self.mm.params['recalcDynAttrs'], {self.player, self.hero} )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, self.hero, HeroAttrHelper.needSendIds} )
	end;
	
	test_recalcBaseAttrs = function(self)
		self.mm:mock(HeroAttrHelper, '_clearBaseAppendAttrs')
		self.mm:mock(HeroAttrHelper, '_appendBaseAppendAttrsByRoleAttr')
		self.mm:mock(HeroAttrHelper, '_appendBaseAppendAttrsByWears')
		
		local hero = {name='hero'}
		HeroAttrHelper:recalcBaseAttrs(self.player, hero)
		assertEQ (self.mm.walkLog, '_clearBaseAppendAttrs,_appendBaseAppendAttrsByRoleAttr,_appendBaseAppendAttrsByWears')
		assertEQ ( self.mm.params['_clearBaseAppendAttrs'], {hero} )
		assertEQ ( self.mm.params['_appendBaseAppendAttrsByRoleAttr'], {self.player, hero} )
		assertEQ ( self.mm.params['_appendBaseAppendAttrsByWears'], {hero} )
	end;
	
	test__clearBaseAppendAttrs = function(self)
		self.hero:setAttrVal(ATTR.ST_A, 1)
		self.hero:setAttrVal(ATTR.PH_A, 2)
		self.hero:setAttrVal(ATTR.AG_A, 3)
		
		HeroAttrHelper:_clearBaseAppendAttrs(self.hero)
		
		assert ( self.hero:getAttrVal(ATTR.ST_A) == 0 )
		assert ( self.hero:getAttrVal(ATTR.PH_A) == 0 )
		assert ( self.hero:getAttrVal(ATTR.AG_A) == 0 )
	end;
	
	test__appendBaseAppendAttrsByRoleAttr = function(self)
		self.player:setAttrVal(ATTR.FOR_B, 1)
		self.hero:setAttrVal(ATTR.ST_B, 1000)
		self.hero:setAttrVal(ATTR.PH_B, 2000)
		self.hero:setAttrVal(ATTR.AG_B, 3000)
		self.hero:setAttrVal(ATTR.ST_A, 0)
		self.hero:setAttrVal(ATTR.PH_A, 0)
		self.hero:setAttrVal(ATTR.AG_A, 0)
		HeroAttrHelper:_appendBaseAppendAttrsByRoleAttr(self.player, self.hero)
		assert ( self.hero:getAttrVal(ATTR.ST_A) == 10 )
		assert ( self.hero:getAttrVal(ATTR.PH_A) == 20 )
		assert ( self.hero:getAttrVal(ATTR.AG_A) == 30 )
	end;
	
	test__appendBaseAppendAttrsByWears = function(self)
		local g_armPos = 1
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=6,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=ATTR.ST_B,val=1,unit=0}
		g_resItem.attrs.attrs[1] = {attr=ATTR.PH_B,val=2,unit=0}
		g_resItem.attrs.attrs[2] = {attr=ATTR.AG_B,val=3,unit=0}
		g_resItem.attrs.attrs[3] = {attr=ATTR.AG_B,val=4,unit=0}
		g_resItem.attrs.attrs[4] = {attr=ATTR.AG_B,val=5,unit=0}
		g_resItem.attrs.attrs[5] = {attr=ATTR.ST_A,val=1,unit=0}
		
		g_resItem.gems.gems[0] =  FIXID.FIRSTGEM
		
		local g_arm = ItemEx(g_resItem)
		self.hero:getWearContainer():wear(g_armPos, g_arm)	
		
		assert ( self.hero:getAttrVal(ATTR.ST_A) == 0 )
		assert ( self.hero:getAttrVal(ATTR.PH_A) == 0 )
		assert ( self.hero:getAttrVal(ATTR.AG_A) == 0 )
		
		HeroAttrHelper:_appendBaseAppendAttrsByWears(self.hero)
		
		assert ( self.hero:getAttrVal(ATTR.ST_A) == 1 + 1 + GemUtil:getAttr(FIXID.FIRSTGEM).val )
		assert ( self.hero:getAttrVal(ATTR.PH_A) == 2 )
		assert ( self.hero:getAttrVal(ATTR.AG_A) == 12 )
	end;
	
	test_getAddValByWears = function(self)
		local g_armPos = 1
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=6,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=ATTR.CO,val=100,unit=1}
		g_resItem.attrs.attrs[1] = {attr=ATTR.HU,val=2,unit=0}
		g_resItem.attrs.attrs[2] = {attr=ATTR.DE,val=3,unit=0}
		g_resItem.attrs.attrs[3] = {attr=ATTR.HI,val=4,unit=0}
		g_resItem.attrs.attrs[4] = {attr=ATTR.ES,val=5,unit=0}
		g_resItem.attrs.attrs[5] = {attr=ATTR.SP,val=6,unit=0}
		g_resItem.gems.gems[0] =  FIXID.LASTGEM
		local g_arm = ItemEx(g_resItem)
		self.hero:getWearContainer():wear(g_armPos, g_arm)
		
		local old_co = self.hero:getAttrVal(ATTR.CO)
		local old_hu = self.hero:getAttrVal(ATTR.HU)
		local old_de = self.hero:getAttrVal(ATTR.DE)
		local old_hi = self.hero:getAttrVal(ATTR.HI)
		local old_es = self.hero:getAttrVal(ATTR.ES)
		local old_sp = self.hero:getAttrVal(ATTR.SP)
		
		HeroAttrHelper:recalcDynAttrs(self.player, self.hero)
		
		assert ( self.hero:getAttrVal(ATTR.CO) == old_co + old_co + GemUtil:getAttr( FIXID.LASTGEM).val)
		assert ( self.hero:getAttrVal(ATTR.HU) == old_hu + 2 )
		assert ( self.hero:getAttrVal(ATTR.DE) == old_de + 3 )
		assert ( self.hero:getAttrVal(ATTR.HI) == old_hi + 4 )
		assert ( self.hero:getAttrVal(ATTR.ES) == old_es + 5 )
		assert ( self.hero:getAttrVal(ATTR.SP) == old_sp + 6 )
	end;
	
	test_getCommandVal = function(self)
		self.mm:mock(HeroAttrHelper, 'getAddValByWears', {1})
		self.mm:mock(HeroAttrHelper, 'getAddValByOfficial', {2})
		self.mm:mock(HeroAttrHelper, 'getAddValByBuilds', {3})
		
		local baseval = res_gethero_command_maxval(self.hero:getLevel())
		assertEQ ( HeroAttrHelper:getCommandVal({player=self.player, hero=self.hero}), baseval + 6)
		assertEQ ( self.mm.params['getAddValByWears'], {self.hero, baseval, ATTR.CO} )
		assertEQ ( self.mm.params['getAddValByOfficial'], {self.hero, baseval, ATTR.CO} )
		assertEQ ( self.mm.params['getAddValByOfficial'], {self.hero, baseval, ATTR.CO} )
		assertEQ ( self.mm.params['getAddValByBuilds'], {self.player:getCitys(), baseval, ATTR.CO} )
	end;
	
	test_getAddValByBuilds = function(self)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelSum', {2})
		assertEQ ( HeroAttrHelper:getAddValByBuilds(self.player:getCitys(), 0, ATTR.HI), 0 )
		assertEQ ( HeroAttrHelper:getAddValByBuilds(self.player:getCitys(), 0, ATTR.CO), 2*20	 )
		assertEQ ( self.mm.params['getBuildsLevelSum'], {FIXID.JIAOLIANBUILD} )
	end;
	
	test_getAddValBySkill = function(self)
		local old_hu = self.hero:getAttrVal(ATTR.HU)
		local old_de = self.hero:getAttrVal(ATTR.DE)
		local old_hi = self.hero:getAttrVal(ATTR.HI)
		local old_es = self.hero:getAttrVal(ATTR.ES)
		
		self.hero:addSkill({resid=FIXID.FULLATTR_SKILL,level=2,dex=0})
		HeroAttrHelper:recalcDynAttrs(self.player, self.hero)
		
		local effect = ItemResUtil:findItemres(FIXID.FULLATTR_SKILL).effects[1]
		local val = eval(effect.val, {LV=2})
		assert ( self.hero:getAttrVal(ATTR.HU) == old_hu +val )
		assert ( self.hero:getAttrVal(ATTR.DE) == old_de + val )
		assert ( self.hero:getAttrVal(ATTR.HI) == old_hi + val )
		assert ( self.hero:getAttrVal(ATTR.ES) == old_es + val )
	end;
})


tqHeroAttrHelper_t_main = function(suite)
	suite:addTestCase(TestCaseHeroAttrHelper, 'TestCaseHeroAttrHelper')
end;


