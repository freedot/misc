--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFieldCollector')

local TestCaseFieldCollector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.ownerPlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200000)
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001,180002}, heros={{level=10,state=1,soldier={resid=150001010,number=10}} } })
		self.selfField = self.ownerPlayer:getSelfField()
		
		res_fields_level = {{zhanlingdrop=7500141,getiron=10000,level=1,getwood=20000,dantiaodrop=7500151,heros={7600001},getfood=30000,peardropid=7500161,getstone=40000,id=170001001},
								{zhanlingdrop=7500141,getiron=100000,level=2,getwood=200000,dantiaodrop=7500151,heros={7600001},getfood=300000,peardropid=7500161,getstone=400000,id=170001002}}
		res_drops={{roleexp={pro=0,maxnum=0,minnum=0},items={{pro=100,maxnum=1,id=3000085,minnum=1},{pro=100,maxnum=2,id=3000086,minnum=2},{pro=100,maxnum=1,id=3000087,minnum=1},{pro=100,maxnum=1,id=3000088,minnum=1},{pro=100,maxnum=1,id=3000089,minnum=1},{pro=100,maxnum=1,id=3000090,minnum=1},{pro=100,maxnum=1,id=3000091,minnum=1},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0}},credit={pro=0,maxnum=0,minnum=0},heroexp={pro=0,maxnum=0,minnum=0},randtype=0,id=7500161}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testSetParam = function(self)
		local curTime = 10
		local gridId = 2
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		app:getCityMgr():getGridByGridId(gridId).level = 4
		
		FieldCollector:setParam(gridId, curTime)
		local phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 0 )
		
		app:getCityMgr():getGridByGridId(gridId).level = 1
		self.selfField:startCollect(gridId, 5) -- gridId, start time
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 1 )
		assert ( phases[1].level == 1 )
		assert ( phases[1].duration == 5)
		
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 6
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 2 )
		assert ( phases[1].level == 2 )
		assert ( phases[1].duration == 1)
		assert ( phases[2].level == 1 )
		assert ( phases[2].duration == 4)
		
		app:getCityMgr():getGridByGridId(gridId).level = 10
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 6
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 2 )
		assert ( phases[1].level == 10 )
		assert ( phases[1].duration == 1)
		assert ( phases[2].level == 10 )
		assert ( phases[2].duration == 4)
		
		--max collect time1
		curTime = 20*3600
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 5
		FieldCollector:setParam(gridId, curTime)
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 1 )
		assert ( phases[1].level == 10 )
		assert ( phases[1].duration == res_max_collect_time)
		
		--max collect time2
		curTime = 20*3600
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 11*3600
		FieldCollector:setParam(gridId, curTime)
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 1 )
		assert ( phases[1].level == 10 )
		assert ( phases[1].duration == res_max_collect_time)
		
		--max collect time3
		curTime = 20*3600
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 6
		FieldCollector:setParam(gridId, curTime)
		phases = FieldCollector:getLevelTimePhase()
		assert ( table.getn(phases) == 2 )
		assert ( phases[1].level == 10 )
		assert ( phases[1].duration == 1)
		assert ( phases[2].level == 10 )
		assert ( phases[2].duration == res_max_collect_time - 1 )
	end;
	
	testGetCommRes = function(self)
		local gridId = 2
		local curTime = 10
		local soldierNumber = 10
		app:getCityMgr():getGridByGridId(gridId).resId = 170001
		app:getCityMgr():getGridByGridId(gridId).level = 1
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 6
		
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		
		self.selfField:startCollect(gridId, 5)
		
		FieldCollector:setParam(gridId, curTime)
		
		local g_hero = {}
		self.mm:mock( FieldCollector.selfField, 'getCurOccupyHero', {g_hero} )
		self.mm:mock( SkillEffectUtil, 'getAppendValByHeroSkillEffect', {1} )
		
		local ress = FieldCollector:getCommRes()
		local rawFood = soldierNumber*300000*1/3600 + soldierNumber*30000*4/3600
		local rawWood = soldierNumber*200000*1/3600 + soldierNumber*20000*4/3600
		local rawStone = soldierNumber*400000*1/3600 + soldierNumber*40000*4/3600
		local rawIron = soldierNumber*100000*1/3600 + soldierNumber*10000*4/3600
		assert ( ress.food == math.floor(rawFood) + 1)
		assert ( ress.wood == math.floor(rawWood) + 1 )
		assert ( ress.stone == math.floor(rawStone) + 1 )
		assert ( ress.iron == math.floor(rawIron) + 1 )
		assertEQ ( self.mm.params['getCurOccupyHero'], {gridId} )
		assertEQ ( self.mm.params['getAppendValByHeroSkillEffect.1'], {g_hero, RES_EFF.F_GETRES, rawFood} )
		assertEQ ( self.mm.params['getAppendValByHeroSkillEffect.2'], {g_hero, RES_EFF.F_GETRES, rawWood} )
		assertEQ ( self.mm.params['getAppendValByHeroSkillEffect.3'], {g_hero, RES_EFF.F_GETRES, rawStone} )
		assertEQ ( self.mm.params['getAppendValByHeroSkillEffect.4'], {g_hero, RES_EFF.F_GETRES, rawIron} )
	end;
	
	testGetPears = function(self)
		local gridId = 2
		local curTime = 600 + 2*3600 + 100
		local soldierNumber = 10
		app:getCityMgr():getGridByGridId(gridId).resId = 170001
		app:getCityMgr():getGridByGridId(gridId).level = 1
		app:getCityMgr():getGridByGridId(gridId).refreshTime = 600
		
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.selfField:startCollect(gridId, 500)
		
		FieldCollector:setParam(gridId, curTime)
		FieldCollector:getItems()
		local pears = FieldCollector:getItems()

		assert ( pears[3000085] == 2 )
		assert ( pears[3000086] == 4 )
	end;
	
	test_getOneTimeItemDrops = function(self)
		local r_hero = {}
		local r_appendPro = 1
		local r_getDrops = {items={{resid=1001,number=10}}}
		FieldCollector.gridId = 1
		self.mm:mock( FieldCollector.selfField, 'getCurOccupyHero', {r_hero} )
		self.mm:mock( SkillEffectUtil, 'getAppendValByHeroSkillEffect', {r_appendPro} )
		self.mm:mock( FieldCollector.dropItem, 'handle' )
		self.mm:mock( FieldCollector.dropItem, 'getDrops', {r_getDrops} )
		
		local p_pearDropId = 170001
		local outPears = {}
		FieldCollector:getOneTimeItemDrops(outPears, p_pearDropId)
		assertEQ ( outPears[1001], 10 )
		assertEQ ( self.mm.params['getCurOccupyHero'], {FieldCollector.gridId})
		assertEQ ( self.mm.params['getAppendValByHeroSkillEffect'], {r_hero, RES_EFF.F_GETGEM, 1})
		assertEQ ( self.mm.params['handle'], {p_pearDropId, {appendPro=r_appendPro}})
	end;
})


tqFieldCollector_t_main = function(suite)
	suite:addTestCase(TestCaseFieldCollector, 'TestCaseFieldCollector')
end;


