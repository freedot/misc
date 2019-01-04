--*******************************************************************************
--  
--*******************************************************************************
require('tqCityDefHandler')

local TestCaseCityDefHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CityDefHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , GetCityDefInfoHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , CancelCityDefBuildingHandler )
		assertEQ ( self.hdr:getHandler(3):getClass() , BuildCityDefHandler )
		assertEQ ( self.hdr:getHandler(4):getClass() , DownCityDefHandler )
		assertEQ ( self.hdr:getHandler(5):getClass() , SetDefArmyHandler )
	end;
})

local TestCaseGetCityDefInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local hdr = GetCityDefInfoHandler()
		self.mm:mock(PlayerCityDefSender, 'sendDefs')
		self.mm:mock(PlayerCityDefSender, 'sendBuilding')
		self.mm:mock(PlayerCityDefSender, 'sendDefArmy')
		self.mm:mock(PlayerTowerSender, 'sendTowers')
		
		hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendDefs,sendBuilding,sendDefArmy,sendTowers' )
		assertEQ ( self.mm.params['sendDefs'], {self.player} )
		assertEQ ( self.mm.params['sendBuilding'], {self.player} )
		assertEQ ( self.mm.params['sendDefArmy'], {self.player} )
		assertEQ ( self.mm.params['sendTowers'], {self.player} )
	end;
})

local TestCaseCancelCityDefBuildingHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CancelCityDefBuildingHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_hasBuilding = {false}
		self.mm:mock(self.hdr, '_initParams' )
		self.mm:mock(self.hdr, '_hasBuilding', r_hasBuilding )
		self.mm:mock(self.hdr, '_clearCityDefBuilding' )
		self.mm:mock(self.hdr, '_sendMsgs' )
		
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding' )
		assertEQ ( self.mm.params['_initParams'], {self.player})
		
		self.mm:clear()
		r_hasBuilding[1] = true
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding,_clearCityDefBuilding,_sendMsgs' )
	end;
	
	test__initParams = function(self)
		self.hdr:_initParams(self.player)
		assertEQ ( self.hdr.player, self.player )
	end;
	
	test__hasBuilding = function(self)
		self.hdr.player = self.player
		self.player:getCityDef():setBuildingResid(0)
		assertEQ ( self.hdr:_hasBuilding(), false )
		
		self.player:getCityDef():setBuildingResid(1)
		assertEQ ( self.hdr:_hasBuilding(), true )	
	end;
	
	test__clearCityDefBuilding = function(self)
		self.hdr.player = self.player
		local cityDef = self.player:getCityDef()
		cityDef:setBuildingResid(1)
		cityDef:setBuildingStopTime(2)
		cityDef:setBuildingNumber(3)
		self.hdr:_clearCityDefBuilding()
		assertEQ ( cityDef:getBuildingResid(), 0 )
		assertEQ ( cityDef:getBuildingStopTime(), 0 )
		assertEQ ( cityDef:getBuildingNumber(), 0 )
	end;
	
	test__sendMsgs = function(self)
		self.mm:mock(PlayerCityDefSender, 'sendBuilding')
		self.hdr.player = self.player
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.params['sendBuilding'], {self.player} )
	end;
})

local TestCaseBaseCityDefHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BaseCityDefHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__initParams = function(self)
		local p_cmd = {type=CITYDEF_TYPE.FIRST-1}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		local p_cmd = {type=CITYDEF_TYPE.LAST+1}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		local p_cmd = {type=CITYDEF_TYPE.FIRST, number=0}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		local p_cmd = {type=CITYDEF_TYPE.FIRST, number=2}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), true )
		assertEQ ( self.hdr.player, self.player)
		assertEQ ( self.hdr.defType, CITYDEF_TYPE.FIRST)
		assertEQ ( self.hdr.number, 2)
	end;
})

local TestCaseBuildCityDefHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BuildCityDefHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.expends = {name='expendobjs'}
		
		local r_initParams = {false}
		local r_hasBuilding = {true}
		local r_hasEnoughCapacity = {false}
		local r_isEnoughExpends = {false}
		self.mm:mock(self.hdr, '_initParams', r_initParams)
		self.mm:mock(self.hdr, '_hasBuilding', r_hasBuilding)
		self.mm:mock(self.hdr, '_hasEnoughCapacity', r_hasEnoughCapacity)
		self.mm:mock(self.hdr, '_createExpends')
		self.mm:mock(WUtil, 'isEnoughExpends', r_isEnoughExpends)
		self.mm:mock(WUtil, 'subExpends')
		self.mm:mock(self.hdr, '_startBuilding')
		self.mm:mock(self.hdr, '_sendMsgs')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['_initParams'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParams[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding' )
		
		self.mm:clear()
		r_hasBuilding[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding,_hasEnoughCapacity' )
		
		self.mm:clear()
		r_hasEnoughCapacity[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding,_hasEnoughCapacity,_createExpends,isEnoughExpends' )
		assertEQ ( self.mm.params['isEnoughExpends'], {{name='expendobjs'}} )
		
		self.mm:clear()
		self.hdr.defType = CITYDEF_TYPE.FIRST
		self.hdr.number = 2
		r_isEnoughExpends[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParams,_hasBuilding,_hasEnoughCapacity,_createExpends,isEnoughExpends,subExpends,_startBuilding,_sendMsgs,trigerTask' )
		assertEQ ( self.mm.params['subExpends'], {{name='expendobjs'}} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.BUILD_CITY_DEF, FIXID.FIRSTCITYDEF, 2})
	end;
	
	test__hasBuilding = function(self)
		self.hdr.player = self.player
		self.player:getCityDef():setBuildingResid(0)
		assertEQ ( self.hdr:_hasBuilding(), false )
		
		self.player:getCityDef():setBuildingResid(1)
		assertEQ ( self.hdr:_hasBuilding(), true )
	end;
	
	test__hasEnoughCapacity = function(self)
		self.hdr.number = 1
		self.mm:mock(self.hdr, '_getLeftCapacity', {1})
		assertEQ ( self.hdr:_hasEnoughCapacity(), true )
		
		self.hdr.number = 2
		assertEQ ( self.hdr:_hasEnoughCapacity(), false )
	end;
	
	test__createExpends = function(self)
		self.hdr.number = 2
		res_citydef = {{money=1, food=2}}
		
		self.hdr.defType = 1
		self.hdr.player = self.player
		self.mm:mock(ExpendResMaker, 'makeExpendResWithNumber', {{name='expendress'}})
		self.mm:mock(WUtil, 'createExpendObjs', {{name='expendobjs'}})
		
		self.hdr:_createExpends()
		assertEQ ( self.mm.walkLog, 'makeExpendResWithNumber,createExpendObjs' )
		assertEQ ( self.mm.params['makeExpendResWithNumber'], {res_citydef[1], 2} )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {name='expendress'}} )
		assertEQ ( self.hdr.expends, {name='expendobjs'} )
	end;
	
	test__startBuilding = function(self)
		self.hdr.player = self.player
		self.hdr.defType = CITYDEF_TYPE.FIRST
		self.hdr.number = 5
		self.mm:mock(self.hdr, '_getNeedTime', {10} )
		self.mm:mock(global.getTimer(), 'start')
		self.hdr:_startBuilding()
		assertEQ ( self.mm.params['start'], {10*1000, {TIMER_EVT.BUILD_CITYDEF_STOP, FIXID.FIRSTCITYDEF}, self.player:getTimerCaller()} )
		assertEQ ( self.player:getCityDef():getBuildingStopTime(), Util:getTime() + 10 )
		assertEQ ( self.player:getCityDef():getBuildingResid(), FIXID.FIRSTCITYDEF )
		assertEQ ( self.player:getCityDef():getBuildingNumber(), 5 )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.mm:mock(PlayerCityDefSender, 'sendDefs')
		self.mm:mock(PlayerCityDefSender, 'sendBuilding')
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendDefs,sendBuilding' )
		assertEQ ( self.mm.params['sendDefs'], {self.player} )
		assertEQ ( self.mm.params['sendBuilding'], {self.player} )
	end;
	
	test__getLeftCapacity = function(self)
		self.mm:mock(self.hdr, '_getTotalCapacity', {10})
		self.mm:mock(self.hdr, '_getHasCityDefs', {5})
		assertEQ ( self.hdr:_getLeftCapacity(), 5 )
	end;
	
	test__getHasCityDefs = function(self)
		self.hdr.player = self.player
		 self.player:getCityDef():setDefNumber(CITYDEF_TYPE.FIRST, 1)
		 self.player:getCityDef():setDefNumber(CITYDEF_TYPE.FIRST+1, 2)
		 self.player:getCityDef():setDefNumber(CITYDEF_TYPE.FIRST+2, 3)
		 assertEQ ( self.hdr:_getHasCityDefs(), 6 )
	end;
	
	test__getTotalCapacity = function(self)
		self.hdr.player = self.player
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.WALLBUILD,level=5,state=0},{id=5,resid=FIXID.JIAOLOUBUILD,level=10,state=0},{id=6,resid=FIXID.JIAOLOUBUILD,level=20,state=0} } })
		local expectCapacity = math.floor(5*200*(1 + (10+20)/20));
		assertEQ ( self.hdr:_getTotalCapacity(), expectCapacity )
	end;
	
	test__getNeedTime = function(self)
		self.hdr.number = 5
		self.hdr.player = self.player
		self.hdr.defType = 1
		
		res_citydef = {{ntime=100}}
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.WALLBUILD,level=5,state=0} } })
		self.player:setAttrVal(ATTR.IN_B, 10)
		self.player:setAttrVal(ATTR.IN_A, 20)
		
		
		local role_interior = 10 + 20
		local wallBuildLevel = 5
		local unitTime = math.ceil(100/(1 + role_interior/100 + wallBuildLevel/20))
		assertEQ ( self.hdr:_getNeedTime(), unitTime*5 )
	end;
})

local TestCaseDownCityDefHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = DownCityDefHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_initParams = {false}
		local r_isEnoughNumber = {false}
		self.mm:mock(self.hdr, '_initParams', r_initParams)
		self.mm:mock(self.hdr, '_isEnoughNumber', r_isEnoughNumber)
		self.mm:mock(self.hdr, '_downCityDefs' )
		self.mm:mock(self.hdr, '_sendMsgs' )
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['_initParams'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParams[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_isEnoughNumber' )
		
		self.mm:clear()
		r_isEnoughNumber[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParams,_isEnoughNumber,_downCityDefs,_sendMsgs' )
	end;
	
	test__isEnoughNumber = function(self)
		self.hdr.player = self.player
		self.hdr.number = 1
		self.hdr.defType = 1
		
		assertEQ ( self.hdr:_isEnoughNumber(), false )
		
		self.player:getCityDef():setDefNumber(self.hdr.defType, 1)
		assertEQ ( self.hdr:_isEnoughNumber(), true )
	end;
	
	test__downCityDefs = function(self)
		self.hdr.player = self.player
		self.hdr.number = 1
		self.hdr.defType = 1
		
		self.player:getCityDef():setDefNumber(self.hdr.defType, 2)
		self.hdr:_downCityDefs()
		assertEQ ( self.player:getCityDef():getDefNumber(self.hdr.defType), 1 )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.mm:mock(PlayerCityDefSender, 'sendDefs')
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.params['sendDefs'], {self.player} )
	end;
})

local TestCaseSetDefArmyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = SetDefArmyHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.hdr.herosHdr:getClass(), NetCmdHerosHdr)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player 
		self.hdr.lineupId = 180002
		self.hdr.heroIds = {1,2,3,4,5}
		
		local r_initParams = {false}
		self.mm:mock(self.hdr, '_initParams', r_initParams)
		self.mm:mock(self.player:getArmyContainer(), 'setDefArmy')
		self.mm:mock(PlayerCityDefSender, 'sendDefArmy')
		self.mm:mock(TaskFinisher, 'trigerTask' )
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['_initParams'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParams[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParams,setDefArmy,sendDefArmy,trigerTask' )
		assertEQ ( self.mm.params['setDefArmy'], {self.hdr.lineupId, self.hdr.heroIds} )
		assertEQ ( self.mm.params['sendDefArmy'], {self.player } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.SET_CITY_DEF_ARMY} )
	end;
	
	test__initParams = function(self)
		local p_cmd = {lineup=180002}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		self.player:addLineup(180002)
		p_cmd = {lineup=180002, count=-1}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		p_cmd = {lineup=180002, count=2, hid1=1, hid2=2}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), false )
		
		p_cmd = {lineup=180002, count=5, hid1=1, hid2=2, hid3=3, hid4=4, hid5=5}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.lineupId, 180002 )
		assertEQ ( self.hdr.heroIds, {1,2,3,4,5} )
		
		p_cmd = {lineup=180002, count=5, hid1=0, hid2=0, hid3=0, hid4=0, hid5=0}
		assertEQ ( self.hdr:_initParams(self.player, p_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.lineupId, 180002 )
		assertEQ ( self.hdr.heroIds, {0,0,0,0,0} )
	end;
})

tqCityDefHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCityDefHandler, 'TestCaseCityDefHandler')
	suite:addTestCase(TestCaseGetCityDefInfoHandler, 'TestCaseGetCityDefInfoHandler')
	suite:addTestCase(TestCaseCancelCityDefBuildingHandler, 'TestCaseCancelCityDefBuildingHandler')
	suite:addTestCase(TestCaseBaseCityDefHandler, 'TestCaseBaseCityDefHandler')
	suite:addTestCase(TestCaseBuildCityDefHandler, 'TestCaseBuildCityDefHandler')
	suite:addTestCase(TestCaseDownCityDefHandler, 'TestCaseDownCityDefHandler')
	suite:addTestCase(TestCaseSetDefArmyHandler, 'TestCaseSetDefArmyHandler')
end;


