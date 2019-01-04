--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerFarm')

local TestCasePlayerFarm = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.farm = self.player:getFarm()
		self.farm.farms.farmVer = 1
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testWorkforce = function(self)
		self.farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		assert( self.farm:getWorkforce() == res_farmblock_needpopu )
		
		self.farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		assert( self.farm:getWorkforce() == 2*res_farmblock_needpopu )
	end;
	
	testCalcTotalRes = function(self)
		local _expectVal = function()
			local baseout = math.floor(res_farmpip_needtime.LV4 * res_farm_sec_output)
			local culturelevel = 0
			local wslevel = 10
			local role_interior = 0
			local allilevel = 0
			local buffAdd = 0.5
			local vipAdd = 0.1
			return res_calc_farm_totalres(baseout, culturelevel, wslevel, role_interior, allilevel,  buffAdd, vipAdd)
		end;
		
		self.player:setVipLevel(1)
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_COMMRES_OUTPUT,val=50,unit=1 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		
		self.mm:mock(self.farm, 'getWorkShopBuildsLevelSum', {10})
		local farmblock = {resid=FIXID.FARM, level=4}
		local rt = self.farm:calcTotalRes(farmblock)
		assert( rt == _expectVal() )
	end;
	
	test_getBlockRes =function(self)
		local g_isCanGatherRt = {false}
		self.mm:mock( self.farm, 'isCanGather', g_isCanGatherRt )
		self.mm:mock( self.farm, '_getBlockResBySelf', {1} )
		self.mm:mock( self.farm, '_getBlockResByOtherCollector', {2} )
		
		local g_block = {}
		assertEQ ( self.farm:getBlockRes(self.player:getRoleId(), g_block), 0 )
		assertEQ ( self.mm.walkLog, 'isCanGather' )
		assertEQ ( self.mm.params['isCanGather'], {self.player:getRoleId(), g_block} )
		
		self.mm:clear()
		g_isCanGatherRt[1] = true
		local g_block = {}
		assertEQ ( self.farm:getBlockRes(self.player:getRoleId(), g_block), 1 )
		assertEQ ( self.mm.walkLog, 'isCanGather,_getBlockResBySelf' )
		assertEQ ( self.mm.params['_getBlockResBySelf'], {g_block} )
		
		self.mm:clear()
		assertEQ ( self.farm:getBlockRes(self.player:getRoleId()+1, g_block), 2 )
		assertEQ ( self.mm.walkLog, 'isCanGather,_getBlockResByOtherCollector' )
		assertEQ ( self.mm.params['_getBlockResByOtherCollector'], {g_block} )
	end;
	
	test__getBlockResBySelf = function(self)
		local g_block = {ucState=FARM_STATE.COMPLETE, ulLeftRes=100}
		assertEQ ( self.farm:_getBlockResBySelf(g_block), 100 )
		
		Util:setTimeDrt(6)
		local g_block = {ucState=FARM_STATE.SAPLING, ulLeftRes=100, ulStartTime=1, ulStopTime = 11}
		assertEQ ( self.farm:_getBlockResBySelf(g_block), 50*0.7 )
		
		local g_block = {ucState=FARM_STATE.COMPLETE + 1}
		assertEQ ( self.farm:_getBlockResBySelf(g_block), 0 )
	end;
	
	test__getBlockResByOtherCollector = function(self)
		self.mm:mock( math, 'random', {10})
		local g_block = {ulLeftRes=100, ulTotalRes=200}
		assertEQ ( self.farm:_getBlockResByOtherCollector(g_block), 0 )
		
		local g_block = {ulLeftRes=200, ulTotalRes=200}
		assertEQ ( self.farm:_getBlockResByOtherCollector(g_block), 20 )
		
		local g_block = {ulLeftRes=110, ulTotalRes=200}
		assertEQ ( self.farm:_getBlockResByOtherCollector(g_block), 10 )
	end;
	
	testGetInnerFarmData = function(self)
		assert( self.farm:getFarmData() ~= nil )
	end;
	
	testSeedBlock = function(self)
		self.farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		assert(self.farm:getBlockCount() == 1)
		
		local farmblock = self.farm:getBlockById(1)
		assert(farmblock.ucState == 0)
		assert(farmblock.ulStartTime == Util:getTime())
		assert(farmblock.ulStopTime == Util:getTime() + res_farmpip_needtime.LV1)
		assert(farmblock.ulTotalRes > 0 )
	end;
	
	test__onBlockCountChange = function(self)
		self.mm:mock(self.player:getCityRes(), 'onPopuChange')
		self.farm:_onBlockCountChange()
		assertEQ ( self.mm.walkLog, 'onPopuChange' )
	end;
	
	test_delBlocksByMaxId = function(self)
		self.mm:mock(self.farm, '_onBlockCountChange')
		
		self.farm:setBlockCount(0)
		self.farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		self.farm:seedBlock({id=3,resid=FIXID.FARM,level=1,state=0})
		self.farm:seedBlock({id=2,resid=FIXID.FARM,level=1,state=0})
		assertEQ(self.farm:getBlockCount(), 3)
		
		self.mm:clear()
		self.farm:delBlocksByMaxId(3)
		assert( self.farm:getBlockCount() == 3 )
		assert( self.farm:getBlockById(1) ~= nil )
		assert( self.farm:getBlockById(2) ~= nil )
		assert( self.farm:getBlockById(3) ~= nil )
		assertEQ( self.mm.walkLog, '' )
		
		self.mm:clear()
		self.farm:delBlocksByMaxId(1)
		assert(self.farm:getBlockCount() == 1)
		assertEQ( self.mm.walkLog, '_onBlockCountChange' )
	end;
	
	test_addLog = function(self)
		local MAX_FARM_LOG_CNT_ = MAX_FARM_LOG_CNT
		MAX_FARM_LOG_CNT = 2
		
		self.farm:addLog({ltype=1, role='xxx1', param1=1, param2=1, param3=1, param4=1})
		assert(self.farm:getLogCount() == 1)
		assert(self.farm:getLogVer() == 1)
		
		self.farm:addLog({ltype=2, role='xxx2', param1=1, param2=1, param3=1, param4=1})
		assert(self.farm:getLogCount() == 2)
		assert(self.farm:getLogVer() == 2)
		
		self.farm:addLog({ltype=3, role='xxx3', param1=1, param2=1, param3=1, param4=1})
		assert(self.farm:getLogCount() == 2)
		assert(self.farm:getLogVer() == 3)
		
		assert(self.farm:getLogIdx(0).szRName == 'xxx2' )
		assert(self.farm:getLogIdx(1).szRName == 'xxx3' )
		
		MAX_FARM_LOG_CNT = MAX_FARM_LOG_CNT_
	end;
	
	test_reseedBlock = function(self)
		Util:setTimeDrt(10)
		local g_block = {ulId=10, ulStartTime=0, ulStopTime=0, ucLevel=1, ulResId=FIXID.FARM, collectorCount=1, ulTotalRes=0, ulLeftRes=0, ucState=0, seqId=0}
		
		self.mm:mock( self.farm, 'calcTotalRes', {1000} )
		self.mm:mock( global.getTimer(), 'start' )
		
		self.farm:reseedBlock(g_block)
		assertEQ ( self.mm.walkLog, 'calcTotalRes,start' )
		assertEQ ( self.mm.params['calcTotalRes'], {{level=1, resid=FIXID.FARM}} )
		local needTime = g_block.ulStopTime - Util:getTime()
		assertEQ ( self.mm.params['start'], {needTime*1000, {TIMER_EVT.FARMGROWUP_STOP, 10, g_block.seqId}, self.player:getTimerCaller()} )
		assertEQ ( g_block, {ulId=10, ulStartTime=10, ulStopTime=res_farmpip_needtime['LV1']+10, ucLevel=1, ulResId=FIXID.FARM, collectorCount=0, ulTotalRes=1000, seqId=0, ulLeftRes=1000, ucState=FARM_STATE.SAPLING} )
	end;
	
	test__addFarmVer = function(self)
		self.farm.farms.farmVer = 1
		self.farm:_addFarmVer()
		assertEQ ( self.farm:getFarmVer(), 2 )
	end;
	
	test_isCanGather = function(self)
		Util:setTimeDrt(10001)
		assertEQ ( self.farm:isCanGather( self.player:getRoleId(), {ucState=FARM_STATE.COMPLETE, protectStopTime=0}), true )
		assertEQ ( self.farm:isCanGather( self.player:getRoleId(), {ucState=FARM_STATE.COMPLETE+1, protectStopTime=0}), true )
		
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE+1, protectStopTime=0}), false )
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE, ulLeftRes=10, ulTotalRes=20, protectStopTime=0}), false )
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE, ulLeftRes=11, ulTotalRes=20, collectors={}, collectorCount=0, protectStopTime=0}), true )
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE, ulLeftRes=11, ulTotalRes=20, collectors={}, collectorCount=MAX_COLLECTOR_CNT, protectStopTime=0}), false )
		
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE, ulLeftRes=20, ulTotalRes=20, collectors={}, collectorCount=0,protectStopTime=10000}), true )
		assertEQ ( self.farm:isCanGather( self.player:getRoleId() + 1, {ucState=FARM_STATE.COMPLETE, ulLeftRes=20, ulTotalRes=20, collectors={}, collectorCount=0,protectStopTime=10002}), false )
		
		local g_block = {ucState=FARM_STATE.COMPLETE, ulLeftRes=11, ulTotalRes=20, collectors={}, collectorCount=0, protectStopTime=0}
		g_block.collectorCount = 1
		g_block.collectors[0] = self.player:getRoleId() + 1
		assertEQ ( self.farm:isCanGather(self.player:getRoleId() + 1, g_block), false )
	end;
	
	test_isCanGathers = function(self)
		self.farm.farms.ucCount = 1
		
		local r_isCanGather = {false}
		local r_isComplete = {false}
		self.mm:mock(self.farm, 'isCanGather', r_isCanGather )
		self.mm:mock(self.farm, 'isComplete', r_isComplete)
		
		local collectorId = 10000
		assertEQ ( self.farm:isCanGathers(collectorId), false )
		assertEQ ( self.mm.params['isCanGather'], {collectorId, self.farm.farms.astFarms[0]} )
		
		self.mm:clear()
		r_isCanGather[1] = true
		assertEQ ( self.farm:isCanGathers(collectorId), false )
		assertEQ ( self.mm.params['isComplete'], {self.farm.farms.astFarms[0]} )
		
		self.mm:clear()
		r_isComplete[1] = true
		assertEQ ( self.farm:isCanGathers(collectorId), true )
	end;
	
	test_isComplete = function(self)
		assertEQ ( self.farm:isComplete({ucState=FARM_STATE.COMPLETE}), true )
		assertEQ ( self.farm:isComplete({ucState=FARM_STATE.COMPLETE+1}), false )
	end;
	
	test_subBlockRes = function(self)
		local g_block = {ulTotalRes=1000, ulLeftRes=1000}
		
		self.farm:subBlockRes(g_block, -1)
		assertEQ ( g_block, {ulTotalRes=1000, ulLeftRes=1000} )
		
		self.farm:subBlockRes(g_block, 500)
		assertEQ ( g_block, {ulTotalRes=1000, ulLeftRes=500} )
		
		self.farm:subBlockRes(g_block, 501)
		assertEQ ( g_block, {ulTotalRes=1000, ulLeftRes=0} )
	end;
	
	test_addCollector = function(self)
		local MAX_COLLECTOR_CNT_ = MAX_COLLECTOR_CNT
		MAX_COLLECTOR_CNT = 2
		
		local g_block = {collectors={}, collectorCount=0}
		self.farm:addCollector(1, g_block)
		assertEQ ( g_block.collectorCount, 1 )
		assertEQ ( g_block.collectors[0], 1 )
		
		self.farm:addCollector(2, g_block)
		assertEQ ( g_block.collectorCount, 2 )
		assertEQ ( g_block.collectors[0], 1 )
		assertEQ ( g_block.collectors[1], 2 )
		
		self.farm:addCollector(3, g_block)
		assertEQ ( g_block.collectorCount, 2 )
		assertEQ ( g_block.collectors[0], 1 )
		assertEQ ( g_block.collectors[1], 2 )
		
		MAX_COLLECTOR_CNT = MAX_COLLECTOR_CNT_
	end;
	
	test_getWorkShopBuildsLevelSum = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=5,resid=FIXID.WORKSHOPBUILD,level=1,state=0},{id=6,resid=FIXID.WORKSHOPBUILD,level=2,state=0} } })
		assertEQ ( self.farm:getWorkShopBuildsLevelSum(), 3 )
	end;
	
	test__isFullCollector = function(self)
		assertEQ ( self.farm:_isFullCollector({collectorCount=0}), false )
		assertEQ ( self.farm:_isFullCollector({collectorCount=0}), false )
	end;
	
	test__addFarmVer = function(self)
		local lastVer = self.farm:getFarmVer()
		self.farm:_addFarmVer()
		assertEQ ( self.farm:getFarmVer(), lastVer + 1 )
	end;
})


tqPlayerFarm_t_main = function(suite)
	suite:addTestCase(TestCasePlayerFarm, 'TestCasePlayerFarm')
end;


