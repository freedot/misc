require('tqBuildResHandler')

local TestCaseBuildResHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BuildResHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.hdr:getHandler(1):getClass() == SendAllCitysBuildsHdr )
		assert ( self.hdr:getHandler(2):getClass() == CityAddBuildHdr )
		assert ( self.hdr:getHandler(3):getClass() == CityUpBuildHdr )
		assert ( self.hdr:getHandler(4):getClass() == CityDownBuildHdr )
		assert ( self.hdr:getHandler(5):getClass() == CityCancelBuildingHdr )
		assert ( self.hdr:getHandler(6):getClass()	== CreateSubCityHdr )
		assert ( self.hdr:getHandler(7):getClass()	== ChangeSubCityHdr )
		assert ( self.hdr:getHandler(8):getClass() == SendAllAllianceBuildsHdr )
		assert ( self.hdr:getHandler(9):getClass() == AllianceUpBuildHdr )
		assert ( self.hdr:getHandler(10):getClass() == AllianceUpBuildEndHdr )
	end;
})

local TestCaseSendAllCitysBuildsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(CityBuildSender, 'sendCitysType' );
		self.mm:mock(CityBuildSender, 'sendAll' );
		self.mm:mock(CityBuildSender, 'sendOpenMainCity' );
		SendAllCitysBuildsHdr():handle(self.player, {subcmd=1})
		assertEQ ( self.mm.walkLog, 'sendCitysType,sendAll,sendOpenMainCity' )
		assertEQ ( self.mm.params['sendCitysType'], {self.player} )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		assertEQ ( self.mm.params['sendOpenMainCity'], {self.player} )
	end;
})

local TestCaseCityBuildHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CityBuildHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValidOnePreCond = function(self)
		self.hdr.player = self.player
		
		local p_cond = {id=0}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		p_cond = {id=nil}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		p_cond = {id=1, level=0}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		p_cond = {id=1, level=nil}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		self.player:getCityRes():setLevel( 2 )
		p_cond = {id=FIXID.CITYLEVEL, level=2}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		self.player:getCityRes():setLevel( 1 )
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), false )
		
		local r_getCurBuildLevel = {1}
		self.mm:mock(self.hdr, '_getCurBuildLevel', r_getCurBuildLevel)
		p_cond = {id=FIXID.FIRSTINBUILD, level=2}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), false )
		assertEQ ( self.mm.params['_getCurBuildLevel'], {FIXID.FIRSTINBUILD} )
		
		r_getCurBuildLevel[1] = 2
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		p_cond = {id=FIXID.FIRSTINBUILD-1, level=1}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
		
		p_cond = {id=FIXID.LASTINBUILD+1, level=1}
		assertEQ ( self.hdr:_isValidOnePreCond(p_cond), true )
	end;
	
	test__getCurBuildLevel = function(self)
		self.hdr.player = self.player
		self.hdr.city = self.player:getCitys():getCityById(1)
		
		local r_isCanBuildInCity = {true}
		self.mm:mock( self.hdr, '_isCanBuildInCity', r_isCanBuildInCity )
		self.mm:mock( self.hdr.city, 'getBuildLevelByResId', {1} )
		self.mm:mock( self.player:getCitys(), 'getBuildLevelByResId', {2} )
		
		local p_resid = FIXID.FIRSTINBUILD
		assertEQ ( self.hdr:_getCurBuildLevel(p_resid), 1 )
		assertEQ ( self.mm.walkLog, '_isCanBuildInCity,getBuildLevelByResId' )
		assertEQ ( self.mm.params['_isCanBuildInCity'], {p_resid} )
		assertEQ ( self.mm.params['getBuildLevelByResId'], {p_resid} )
		
		self.mm:clear()
		r_isCanBuildInCity[1] = false
		assertEQ ( self.hdr:_getCurBuildLevel(p_resid), 2 )
		assertEQ ( self.mm.walkLog, '_isCanBuildInCity,getBuildLevelByResId' )
		assertEQ ( self.mm.params['getBuildLevelByResId'], {p_resid} )
	end;
	
	test__isCanBuildInCity = function(self)
		local r_find = {nil}
		self.mm:mock(Util, 'find', r_find )
		
		self.hdr.citytype = CITY_TYPE.MAIN
		local p_resid = FIXID.FIRSTINBUILD
		assertEQ ( self.hdr:_isCanBuildInCity(p_resid), false )
		assertEQ ( self.mm.params['find'], {res_maincity_canbuildids, 'nil', p_resid} )
		
		self.mm:clear()
		r_find[1] = {}
		assertEQ ( self.hdr:_isCanBuildInCity(p_resid), true )
		
		self.mm:clear()
		self.hdr.citytype = CITY_TYPE.SUBRES
		assertEQ ( self.hdr:_isCanBuildInCity(p_resid), true )
		assertEQ ( self.mm.params['find'], {res_subrescity_canbuildids, 'nil', p_resid} )
		
		self.mm:clear()
		self.hdr.citytype = CITY_TYPE.SUBARMY
		assertEQ ( self.hdr:_isCanBuildInCity(p_resid), true )
		assertEQ ( self.mm.params['find'], {res_subarmycity_canbuildids, 'nil', p_resid} )
		
		self.mm:clear()
		self.hdr.citytype = CITY_TYPE.SUBARMY + 1
		assertEQ ( self.hdr:_isCanBuildInCity(p_resid), false )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__calcFactNeedTimeWhenHasStateEffect = function(self)
		self.hdr.player = self.player
		assertEQ ( self.hdr:_calcFactNeedTime(10000), 10000 )
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_BUILD_SPEED,val=100,unit=1 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		
		assertEQ ( self.hdr:_calcFactNeedTime(10000), 5000 )
		
		self.player:getStateContainer():stopState(RES_EFF.ADD_BUILD_SPEED)
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_BUILD_SPEED,val=1000,unit=0 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		assertEQ ( self.hdr:_calcFactNeedTime(10000), 9000 )
		
		self.player:getStateContainer():stopState(RES_EFF.ADD_BUILD_SPEED)
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_BUILD_SPEED,val=100000,unit=0 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		assertEQ ( self.hdr:_calcFactNeedTime(10000), 1 )
	end;
})

local TestCaseCityAddBuildHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CityAddBuildHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;

	test__initParam = function(self)
		local p_cmd = {cid=2, resid=110002, id=2}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false )
		
		local p_cmd = {cid=1, resid=110002, id=2}
		
		self.mm:clear()
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), true )
		assertEQ ( self.hdr.id, 2 )
		assertEQ ( self.hdr.resid, 110002 )
		assertEQ ( self.hdr.cityid, 1 )
		assertEQ ( self.hdr.city, self.player:getCitys():getCityById(1) )
		assertEQ ( self.hdr.citytype, self.player:getCitys():getCityById(1):getType() )
		assertEQ ( self.hdr.level, 0 )
		assertEQ ( self.hdr.player, self.player )
	end;
	
	test__isValidResId = function(self)
		self.hdr.resid = res_maincity_canbuildids[1]
		self.hdr.citytype = CITY_TYPE.MAIN
		assertEQ ( self.hdr:_isValidResId(), true )
		
		self.hdr.resid = res_maincity_canbuildids[1] - 1
		assertEQ ( self.hdr:_isValidResId(), false )
		
		self.hdr.resid = res_subrescity_canbuildids[1]
		self.hdr.citytype = CITY_TYPE.SUBRES
		assertEQ ( self.hdr:_isValidResId(), true )
		
		self.hdr.resid = res_subrescity_canbuildids[1] - 1
		assertEQ ( self.hdr:_isValidResId(), false )
		
		self.hdr.resid = res_subarmycity_canbuildids[1]
		self.hdr.citytype = CITY_TYPE.SUBARMY
		assertEQ ( self.hdr:_isValidResId(), true )
		
		self.hdr.resid = res_subarmycity_canbuildids[1] - 1
		assertEQ ( self.hdr:_isValidResId(), false )
	end;
	
	test__isValidBlockId = function(self)
		self.hdr.player = self.player
		self.hdr.citytype = CITY_TYPE.MAIN
		self.player:getCityRes():setLevel(1)
		
		self.hdr.id = 0 
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_maincity_inbuildnums['LV1'] + 1
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_maincity_inbuildnums['LV1']
		assertEQ ( self.hdr:_isValidBlockId(), true )
		
		self.hdr.citytype = CITY_TYPE.SUBRES
		self.hdr.id = 0 
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_subcity_inbuildnum + 1
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_subcity_inbuildnum
		assertEQ ( self.hdr:_isValidBlockId(), true )
		
		self.hdr.citytype = CITY_TYPE.SUBARMY
		self.hdr.id = 0 
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_subcity_inbuildnum + 1
		assertEQ ( self.hdr:_isValidBlockId(), false )
		
		self.hdr.id = res_subcity_inbuildnum
		assertEQ ( self.hdr:_isValidBlockId(), true )
	end;
	
	test__isValid = function(self)
		local r_isValidResId = {false}
		local r_isValidBlockId = {false}
		local r_isFullBuildingCnt = {true}
		local r_isArrivedMaxBuildCount = {true}
		local r_isValidPreCondition = {false}
		local r_isEmptyBlock = {false}
		local r_isEnoughExpends = {false}
		
		self.mm:mock(self.hdr, '_isValidResId', r_isValidResId)
		self.mm:mock(self.hdr, '_isValidBlockId', r_isValidBlockId)
		self.mm:mock(self.hdr, '_isFullBuildingCnt', r_isFullBuildingCnt)
		self.mm:mock(self.hdr, '_isArrivedMaxBuildCount', r_isArrivedMaxBuildCount)
		self.mm:mock(self.hdr, '_isValidPreCondition', r_isValidPreCondition)
		self.mm:mock(self.hdr, '_isEmptyBlock', r_isEmptyBlock)
		self.mm:mock(WUtil, 'isEnoughExpends', r_isEnoughExpends)
		
		self.hdr.expends = nil
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		self.hdr.expends = {}
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId' )
		
		self.mm:clear()
		r_isValidResId[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId' )
		
		self.mm:clear()
		r_isValidBlockId[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt' )
		
		self.mm:clear()
		r_isFullBuildingCnt[1] = false
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt,_isArrivedMaxBuildCount' )
		
		self.mm:clear()
		r_isArrivedMaxBuildCount[1] = false
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt,_isArrivedMaxBuildCount,_isValidPreCondition' )
		
		self.mm:clear()
		r_isValidPreCondition[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt,_isArrivedMaxBuildCount,_isValidPreCondition,_isEmptyBlock' )
		
		self.mm:clear()
		r_isEmptyBlock[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt,_isArrivedMaxBuildCount,_isValidPreCondition,_isEmptyBlock,isEnoughExpends' )
		
		self.mm:clear()
		r_isEnoughExpends[1] = true
		assertEQ ( self.hdr:_isValid(), true )
		assertEQ ( self.mm.walkLog, '_isValidResId,_isValidBlockId,_isFullBuildingCnt,_isArrivedMaxBuildCount,_isValidPreCondition,_isEmptyBlock,isEnoughExpends' )
	end;
	
	test__isArrivedMaxBuildCount = function(self)
		self.hdr.city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		
		local r_res = {{maxCount=1}}
		local r_builds = {{},{}}
		self.mm:mock(ItemResUtil, 'findItemres', r_res)
		self.mm:mock(self.hdr.city, 'getBuildsByResId', {r_builds})
		assertEQ ( self.hdr:_isArrivedMaxBuildCount(), true )
		
		r_res[1].maxCount = 2
		assertEQ ( self.hdr:_isArrivedMaxBuildCount(), true )
		
		r_res[1].maxCount = 3
		assertEQ ( self.hdr:_isArrivedMaxBuildCount(), false )
	end;
	
	test__isEmptyBlock = function(self)
		self.hdr.id = 1
		self.hdr.city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		
		local r_build = {nil}
		self.mm:mock(self.hdr.city, 'getBuildById', r_build)
		assertEQ ( self.hdr:_isEmptyBlock(), true )
		
		r_build[1] = {}
		assertEQ ( self.hdr:_isEmptyBlock(), false )
	end;
	
	test__docmd = function(self)
		self.hdr.city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		self.hdr.player = self.player
		self.hdr.cityid = 2
		self.hdr.id = 1
		self.hdr.resid = 110002
		self.hdr.expends = {id=1}
		
		self.mm:mock(WUtil, 'subExpends' )
		self.mm:mock(self.hdr, '_getBuildNeedTime', {10} )
		self.mm:mock(self.hdr.city, 'addBuild' )
		self.mm:mock(global.getTimer(), 'start' )
		self.mm:mock(CityBuildSender, 'send' )
		
		self.hdr:_docmd()
		
		assertEQ ( self.mm.walkLog, 'subExpends,_getBuildNeedTime,addBuild,start,send' )
		assertEQ ( self.mm.params['subExpends'], {self.hdr.expends} )
		assertEQ ( self.mm.params['addBuild'], { {id=1, resid=110002, level=0, state=BUILD_STATE.UPGRADE, stoptime=Util:getTime()+10} } )
		assertEQ ( self.mm.params['start'], {10*1000, {TIMER_EVT.BUILDUP_STOP, self.hdr.cityid, self.hdr.id}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['send'], {self.player, self.hdr.cityid, self.hdr.id} )
	end;
})

local TestCaseCityDownBuildHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CityDownBuildHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValid = function(self)
		local r_isFullBuildingCnt = {true}
		local r_isCommState = {false}
		local r_isCanDownBuild = {false}
		self.mm:mock( self.hdr, '_isFullBuildingCnt', r_isFullBuildingCnt )
		self.mm:mock( self.hdr, '_isCommState', r_isCommState )
		self.mm:mock( self.hdr, '_isCanDownBuild', r_isCanDownBuild )
		
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isFullBuildingCnt' )
		
		self.mm:clear()
		r_isFullBuildingCnt[1] = false
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isFullBuildingCnt,_isCommState' )
		
		self.mm:clear()
		r_isCommState[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isFullBuildingCnt,_isCommState,_isCanDownBuild' )
		
		self.mm:clear()
		r_isCanDownBuild[1] = true
		assertEQ ( self.hdr:_isValid(), true )
		assertEQ ( self.mm.walkLog, '_isFullBuildingCnt,_isCommState,_isCanDownBuild' )
	end;
	
	test__isCanDownBuild = function(self)
		self.hdr.resid = FIXID.GOV_BUILD
		self.hdr.level = 10
		assertEQ ( self.hdr:_isCanDownBuild(), false )
		
		self.hdr.resid = FIXID.WALLBUILD
		self.hdr.level = 10
		assertEQ ( self.hdr:_isCanDownBuild(), false )
		
		self.hdr.resid = FIXID.SITUSHU
		self.hdr.level = 10
		assertEQ ( self.hdr:_isCanDownBuild(), true )
		
		self.hdr.resid = FIXID.SITUSHU
		self.hdr.level = 1
		assertEQ ( self.hdr:_isCanDownBuild(), false )
		
		self.hdr.resid = FIXID.SIMASHU
		self.hdr.level = 10
		assertEQ ( self.hdr:_isCanDownBuild(), true )
		
		self.hdr.resid = FIXID.SIMASHU
		self.hdr.level = 1
		assertEQ ( self.hdr:_isCanDownBuild(), false )
	end;
	
	test__docmd = function(self)
		self.hdr.city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		self.hdr.player = self.player
		self.hdr.build = {}
		self.hdr.cityid = 2
		self.hdr.id = 1
		
		local r_needTime = 10
		self.mm:mock( self.hdr, '_getBuildNeedTime', {r_needTime} )
		self.mm:mock( self.hdr.city, 'downBuilding' )
		self.mm:mock( global.getTimer(), 'start' )
		self.mm:mock( CityBuildSender, 'send' )
		
		self.hdr:_docmd()
		assertEQ ( self.mm.walkLog, '_getBuildNeedTime,downBuilding,start,send' )
		assertEQ ( self.mm.params['downBuilding'], {self.hdr.build, {stoptime=Util:getTime()+r_needTime} })
		assertEQ ( self.mm.params['start'], {r_needTime*1000, {TIMER_EVT.BUILDDOWN_STOP, self.hdr.cityid, self.hdr.id}, self.player:getTimerCaller()})
		assertEQ ( self.mm.params['send'], {self.player, self.hdr.cityid, self.hdr.id})
	end;
	
	test__getBuildLevelres = function(self)
		self.hdr.resid = FIXID.GOV_BUILD
		self.hdr.level = 1
		self.mm:mock( ItemResUtil, 'findBuildLevelres', {{id=FIXID.GOV_BUILD}} )
		assertEQ ( self.hdr:_getBuildLevelres(), {id=FIXID.GOV_BUILD} )
		assertEQ ( self.mm.params['findBuildLevelres'], {self.hdr.resid, self.hdr.level})
	end;
	
	test__getBuildNeedTime = function(self)
		self.mm:mock( self.hdr, '_getBuildLevelres', {{ntime=1000}} )
		self.mm:mock( self.hdr, '_calcFactNeedTime', {10} )
		assertEQ ( self.hdr:_getBuildNeedTime(), 10 )
		assertEQ ( self.mm.params['_calcFactNeedTime'], {1000*res_down_retres_per})
	end;
})

local TestCaseBaseSubCityHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BaseSubCityHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		local r_isValid = {false}
		local r_hasEnoughExpends = {true}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(self.hdr, '_createExpends')
		self.mm:mock(self.hdr, '_hasEnoughExpends', r_hasEnoughExpends)
		self.mm:mock(self.hdr, '_isValid', r_isValid)
		self.mm:mock(self.hdr, '_createSubCity')
		self.mm:mock(self.hdr, '_subExpends')
		self.mm:mock(self.hdr, '_sendMsgs')
		self.mm:mock(self.player, 'recalRoleAppendAttrs')
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmd} )
		assertEQ ( self.mm.walkLog, '_initParam' )
		
		self.mm:clear()
		r_initParam[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_createExpends,_hasEnoughExpends,_isValid' )
		
		self.mm:clear()
		r_isValid[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,_createExpends,_hasEnoughExpends,_isValid,_createSubCity,_subExpends,recalRoleAppendAttrs,_sendMsgs' )
	end;
	
	test__initParam = function(self)
		local p_cmdtb = {id=BUILDCITY_ID.SUB1-1, type=CITY_TYPE.SUBRES}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		
		p_cmdtb = {id=BUILDCITY_ID.SUB4+1, type=CITY_TYPE.SUBRES}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		
		p_cmdtb = {id=BUILDCITY_ID.SUB1, type=CITY_TYPE.SUBRES-1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		
		p_cmdtb = {id=BUILDCITY_ID.SUB1, type=CITY_TYPE.SUBARMY+1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		
		p_cmdtb = {id=BUILDCITY_ID.SUB1, type=CITY_TYPE.SUBRES}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), true )
		
		p_cmdtb = {id=BUILDCITY_ID.SUB1, type=CITY_TYPE.SUBARMY}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), true )
		assertEQ ( self.hdr.subCityId, BUILDCITY_ID.SUB1 )
		assertEQ ( self.hdr.subCityType, CITY_TYPE.SUBARMY )
		assertEQ ( self.hdr.player, self.player )
	end;
	
	test__isExistSubCity = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		assertEQ ( self.hdr:_isExistSubCity(), false )
		
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		assertEQ ( self.hdr:_isExistSubCity(), true )
	end;
	
	test__createSubCity = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		self.hdr.subCityType = CITY_TYPE.SUBARMY
		
		local r_city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		self.mm:mock(self.hdr, '_allocSubCity', {r_city})
		self.mm:mock(r_city, 'addBuild')
		
		self.hdr:_createSubCity()
		assertEQ ( self.mm.walkLog, '_allocSubCity,addBuild' )
		local b = res_role_initdata.militarybuild[1]
		assertEQ ( self.mm.params['addBuild'], {{id=b.id,resid=b.resid,level=b.level,state=b.state,stoptime=0}} )
	end;
	
	test__getInitBuildRes = function(self)
		self.hdr.subCityType = CITY_TYPE.SUBRES
		assertEQ ( self.hdr:_getInitBuildRes(), res_role_initdata.resbuild )
		self.hdr.subCityType = CITY_TYPE.SUBARMY
		assertEQ ( self.hdr:_getInitBuildRes(), res_role_initdata.militarybuild )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		
		self.mm:mock( CityBuildSender, 'sendCitysType' )
		self.mm:mock( CityBuildSender, 'sendOneCityAllBuilds' )
		self.mm:mock( WUtil, 'sendSuccMsgArgs' )
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendCitysType,sendOneCityAllBuilds,sendSuccMsgArgs' )
		assertEQ ( self.mm.params['sendCitysType'], {self.player} )
		assertEQ ( self.mm.params['sendOneCityAllBuilds'], {self.player, self.hdr.subCityId} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100064, ''} )
	end;
})

local TestCaseCreateSubCityHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CreateSubCityHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValid = function(self)
		local r_isExistSubCity = {true}
		local r_hasEnoughCityLevel = {false}
		self.mm:mock(self.hdr, '_isExistSubCity', r_isExistSubCity)
		self.mm:mock(self.hdr, '_hasEnoughCityLevel', r_hasEnoughCityLevel)
		
		assertEQ ( self.hdr:_isValid(), false )
		
		r_isExistSubCity[1] = false
		assertEQ ( self.hdr:_isValid(), false )
		
		r_hasEnoughCityLevel[1] = true
		assertEQ ( self.hdr:_isValid(), true )
	end;
	
	test__hasEnoughCityLevel = function(self)
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		self.hdr.player = self.player
		self.player:getCityRes():setLevel(1)
		assertEQ ( self.hdr:_hasEnoughCityLevel(), false )
		self.player:getCityRes():setLevel( res_create_subcity_needcitylevels[BUILDCITY_ID.SUB1] )
		assertEQ ( self.hdr:_hasEnoughCityLevel(), true )
	end;
	
	test__allocSubCity = function(self)
		self.hdr.player = self.player
		local r_city = {}
		self.mm:mock(self.player:getCitys(), 'addCity', {r_city})
		assertEQ ( self.hdr:_allocSubCity(), r_city )
	end;
	
	test__doTasks = function(self)
		self.hdr.player = self.player
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.hdr:_doTasks()
		assertEQ (self.mm.params['checkTasks'], {self.player } )
	end;
	
	test_notEnoughItem = function(self)
		self.mm:mock( WUtil, 'sendPopBoxMsgArgs' )
		self.player:getCityRes():setLevel(16)
		assertEQ ( self.hdr:handle(self.player, {id=3, type=CITY_TYPE.SUBRES}), false )
		assertEQ ( self.mm.params['sendPopBoxMsgArgs'], {self.player, 100066, '"@itemid' .. FIXID.TIANGONGTU .. '",1,0,' .. FIXID.TIANGONGTU } )
	end;
	
	test_enoughItem = function(self)
		self.player:getCityRes():setLevel(16)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.TIANGONGTU, number=1})})
		assertEQ ( self.hdr:handle(self.player, {id=3, type=CITY_TYPE.SUBRES}), true )
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.TIANGONGTU), 0 )
		
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.TIANGONGTU, number=1})})
		assertEQ ( self.hdr:handle(self.player, {id=3, type=CITY_TYPE.SUBRES}), false )
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.TIANGONGTU), 1 )
		
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.TIANGONGTU, number=1})})
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.TIANGONGTU), 2 )
		assertEQ ( self.hdr:handle(self.player, {id=3, type=CITY_TYPE.SUBRES}), true )
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.TIANGONGTU), 0 )
	end;
})

local TestCaseChangeSubCityHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChangeSubCityHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValid = function(self) 
		local r_isExistSubCity = {false}
		local r_isCanChangeState = {false}
		local r_isTypeChanged = {false}
		local r_hasEnoughExpends = {false}
		self.mm:mock(self.hdr, '_isExistSubCity', r_isExistSubCity)
		self.mm:mock(self.hdr, '_isCanChangeState', r_isCanChangeState)
		self.mm:mock(self.hdr, '_isTypeChanged', r_isTypeChanged)
		self.mm:mock(self.hdr, '_createExpends')
		self.mm:mock(self.hdr, '_hasEnoughExpends', r_hasEnoughExpends)
		
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isExistSubCity' )
		
		self.mm:clear()
		r_isExistSubCity[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isExistSubCity,_isCanChangeState' )
		
		self.mm:clear()
		r_isCanChangeState[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isExistSubCity,_isCanChangeState,_isTypeChanged' )
		
		self.mm:clear()
		r_isTypeChanged[1] = true		
		assertEQ ( self.hdr:_isValid(), true )
		assertEQ ( self.mm.walkLog, '_isExistSubCity,_isCanChangeState,_isTypeChanged' )
	end;
	
	test__isCanChangeState = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		
		local r_city = self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		assertEQ ( self.hdr:_isCanChangeState(), false )

		r_city:setBuildCount(0)
		local b = res_role_initdata.resbuild[1]
		r_city:addBuild({id=b.id,resid=b.resid,level=b.level,state=b.state,stoptime=0})
		r_city:addBuild({id=b.id+1,resid=b.resid+1,level=b.level,state=b.state,stoptime=0})
		assertEQ ( self.hdr:_isCanChangeState(), false )
		
		r_city:setBuildCount(0)
		local b = res_role_initdata.resbuild[1]
		r_city:addBuild({id=b.id,resid=b.resid,level=b.level+1,state=b.state,stoptime=0})
		assertEQ ( self.hdr:_isCanChangeState(), false )
		
		r_city:setBuildCount(0)
		local b = res_role_initdata.resbuild[1]
		r_city:addBuild({id=b.id,resid=b.resid+1,level=b.level,state=b.state,stoptime=0})
		assertEQ ( self.hdr:_isCanChangeState(), false )
		
		r_city:setBuildCount(0)
		local b = res_role_initdata.resbuild[1]
		r_city:addBuild({id=b.id,resid=b.resid,level=b.level,state=b.state,stoptime=0})
		assertEQ ( self.hdr:_isCanChangeState(), true )
	end;
	
	test__getMainBuildResId = function(self)
		local r_city1 = self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		local r_city2 = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		assertEQ ( self.hdr:_getMainBuildResId(r_city1), FIXID.SITUSHU )
		assertEQ ( self.hdr:_getMainBuildResId(r_city2), FIXID.SIMASHU )
	end;
	
	test__isTypeChanged = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		self.hdr.subCityType = CITY_TYPE.SUBRES
		local r_city = self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		
		self.mm:mock( WUtil, 'sendWarningMsgArgs' )
		
		assertEQ ( self.hdr:_isTypeChanged(), false )
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100065, ''} )
		
		self.mm:clear()
		self.hdr.subCityType = CITY_TYPE.SUBARMY
		assertEQ ( self.hdr:_isTypeChanged(), true )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__createExpends = function(self)
		self.hdr.player = self.player
		local r_expends = {}
		self.mm:mock( WUtil, 'createExpendObjs', {r_expends} )
		self.hdr:_createExpends()
		assertEQ ( self.hdr.expends, r_expends )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {{resid=FIXID.TIANGONGTU, type=EXPEND_TYPE.ITEM,val=2}}} )
	end;
	
	test__hasEnoughExpends = function(self)
		self.hdr.expends = {}
		self.hdr.player = self.player
		
		local r_isEnoughExpends = {false}
		self.mm:mock( WUtil, 'isEnoughExpends', r_isEnoughExpends )
		self.mm:mock( WUtil, 'sendPopBoxMsgArgs' )
		
		assertEQ ( self.hdr:_hasEnoughExpends(), false )
		assertEQ ( self.mm.walkLog, 'isEnoughExpends,sendPopBoxMsgArgs' )
		assertEQ ( self.mm.params['isEnoughExpends'], {self.hdr.expends} )
		assertEQ ( self.mm.params['sendPopBoxMsgArgs'], {self.player, 100066, '"@itemid' .. FIXID.TIANGONGTU .. '",2,0,' .. FIXID.TIANGONGTU } )
		
		self.mm:clear()
		r_isEnoughExpends[1] = true
		assertEQ ( self.hdr:_hasEnoughExpends(), true )
		assertEQ ( self.mm.walkLog, 'isEnoughExpends' )
	end;
	
	test__allocSubCity = function(self)
		self.hdr.player = self.player
		self.hdr.subCityId = BUILDCITY_ID.SUB1
		self.hdr.subCityType = CITY_TYPE.SUBRES
		
		local r_city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		self.mm:mock(r_city, 'setType')
		self.mm:mock(r_city, 'setBuildCount')
		assertEQ ( self.hdr:_allocSubCity(), r_city )
		assertEQ ( self.mm.walkLog, 'setType,setBuildCount' )
		assertEQ ( self.mm.params['setType'], {CITY_TYPE.SUBRES} )
		assertEQ ( self.mm.params['setBuildCount'], {0} )
	end;
	
	test__subExpends = function(self)
		self.hdr.expends = {}
		self.mm:mock( WUtil, 'subExpends' )
		self.hdr:_subExpends()
		assertEQ ( self.mm.params['subExpends'], {self.hdr.expends} )
	end;
})


----------------------------------------------------------------------------------
local TestCaseBuildResHandlerEx = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:backRes()
		
		res_inbuild={{id=110001001, storenum=1000}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110004001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007002}
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testAddBuildCmd = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(100)
		cres:setWood(10)
		cres:setStone(80)
		cres:setIron(20)
		cres:setMoney(10)
		cres:setMLastTime(Util:getTime())
		
		clearSendMsg_t()
		local cmd = {subcmd=2, id=4,resid=110004,cid=BUILDCITY_ID.MAIN}
		BuildResHandler():onRequest(self.player, nil, cmd)
		assert(getSendMsg_t() ~= '')
	end;
	
	testUpgradeBuildCmd = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(100)
		cres:setWood(10)
		cres:setStone(80)
		cres:setIron(20)
		cres:setMoney(10)
		cres:setMLastTime(Util:getTime())
		
		clearSendMsg_t()
		local cmd = {subcmd=3, id=2,cid=BUILDCITY_ID.MAIN}
		BuildResHandler():onRequest(self.player, nil, cmd)
		local rt = getSendMsg_t()
		assert(string.find(rt, 'id:2,cid:1,resid:110007,state:1,level:1,stoptime:') ~= nil )
	end;
	
	testCityCancelBuildingHdr = function(self)
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		city:setBuildCount(0)
		local b1 = city:addBuild({id=1,resid=110004,level=3,state=BUILD_STATE.UPGRADE,stoptime=10000})
		local cmd = {id=1,resid=110004,cid=BUILDCITY_ID.MAIN}
		CityCancelBuildingHdr:handle(self.player, cmd)
		assert(city:getBuildCount() == 1)
		
		city:setBuildCount(0)
		local b2 = city:addBuild({id=1,resid=110004,level=0,state=BUILD_STATE.UPGRADE,stoptime=10000})
		local cmd = {id=b2.ulId,resid=110004,cid=BUILDCITY_ID.MAIN}
		CityCancelBuildingHdr:handle(self.player, cmd)
		assert(city:getBuildCount() == 0)
	end;
})

local TestCaseCityAddBuildHdrOld = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		TestCaseHelper:backRes()
		
		res_inbuild={{id=110001001, storenum=1000}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110004001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007002}
			}
		res_items_builds = {
			{id=110001, maxCount=1}
			,{id=110002, maxCount=2}
			,{id=110003, maxCount=1}
			,{id=110004, maxCount=1}
			}
		self.hdr = CityAddBuildHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_isArrivedMaxBuildCount = function(self)
		local cmd = {id=4,resid=110001,cid=BUILDCITY_ID.MAIN}
		self.hdr:_initParam(self.player, cmd)
		
		assert ( self.hdr:_isArrivedMaxBuildCount() == true )
		
		self.hdr.resid = 110002
		assert ( self.hdr:_isArrivedMaxBuildCount() == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {builds={ {id=10,resid=110002,level=1,state=0} } })
		assert ( self.hdr:_isArrivedMaxBuildCount() == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {builds={ {id=11,resid=110002,level=1,state=0} } })
		assert ( self.hdr:_isArrivedMaxBuildCount() == true )
	end;
	
	test_CityAddBuildHdr = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(100)
		cres:setWood(10)
		cres:setStone(80)
		cres:setIron(20)
		cres:setMoney(10)
		cres:setMLastTime(Util:getTime())
	
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local oldbuildcnt = city:getBuildCount()
		
		clearSendMsg_t()
		
		local cmd = {id=4,resid=110004,cid=BUILDCITY_ID.MAIN}
		
		self.hdr:handle(self.player, cmd)
		--[[
		local rt = getSendMsg_t()
		local build = city:getBuildById(4)
		
			
		assert(string.find(rt, 'id:'..build.ulId..',cid:1,resid:110004,state:1,level:0,stoptime:') ~= nil )
		
		assert(cres:getFood() == 0)
		assert(cres:getWood() == 0)
		assert(cres:getStone() == 0)
		assert(cres:getIron() == 0)
		assert(cres:getMoney() == 0)
		
		assert((oldbuildcnt+1) == city:getBuildCount())
		
		-- send timer event
		clearSendMsg_t()
		os.setClockMs(1000*(build.ulStoptime - Util:getTime()))
		Util:setTimeDrt(build.ulStoptime)
		global.getTimer():update()
		assertEQ ( isInclude(getSendMsg_t(), 'builds:'), true )
		]]
	end;
})

tqBuildResHandler_t_main = function(suite)
	-- old --
	suite:addTestCase(TestCaseBuildResHandlerEx, 'TestCaseBuildResHandlerEx')
	suite:addTestCase(TestCaseCityAddBuildHdrOld, 'TestCaseCityAddBuildHdrOld')
	--------
	
	suite:addTestCase(TestCaseBuildResHandler, 'TestCaseBuildResHandler')
	
	suite:addTestCase(TestCaseSendAllCitysBuildsHdr, 'TestCaseSendAllCitysBuildsHdr')
	suite:addTestCase(TestCaseCityBuildHdr, 'TestCaseCityBuildHdr')
	suite:addTestCase(TestCaseCityAddBuildHdr, 'TestCaseCityAddBuildHdr')
	suite:addTestCase(TestCaseCityDownBuildHdr, 'TestCaseCityDownBuildHdr')
	
	suite:addTestCase(TestCaseBaseSubCityHdr, 'TestCaseBaseSubCityHdr')
	suite:addTestCase(TestCaseCreateSubCityHdr, 'TestCaseCreateSubCityHdr')
	suite:addTestCase(TestCaseChangeSubCityHdr, 'TestCaseChangeSubCityHdr')
end;

