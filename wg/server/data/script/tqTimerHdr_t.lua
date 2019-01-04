require('tqHeroResHandler_t')
require('tqTimerHdr')

local TestCaseRefreshRoleAttrTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock( self.player:getCityRes(), 'refreshIdlePopu' )
		self.mm:mock( self.player:getCityRes(), 'refreshMoney' )
		self.mm:mock( self.player:getPkg(), 'refreshSalve' )
		self.mm:mock( self.player, 'refreshNewSoldiers' )
		self.mm:mock( self.player, 'refreshPSAttr' )
		self.mm:mock( PopuSender, 'sendAll' )
		self.mm:mock( MoneySender, 'sendAll' )
		self.mm:mock( RoleAttrSender, 'sendAttrsByIds' )
		self.mm:mock( ExchangeHeroExpSender, 'sendTodayTimes' )
		self.mm:mock( MilitarySender, 'sendTodayFTimes' )
		
		RefreshRoleAttrTimerHdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'refreshIdlePopu,refreshMoney,refreshSalve,refreshNewSoldiers,refreshPSAttr,sendAll,sendAll,sendAttrsByIds,sendTodayTimes,sendTodayFTimes' )
		assertEQ ( self.mm.params['sendAll.1'], {self.player} )
		assertEQ ( self.mm.params['sendAll.2'], {self.player} )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.NAF,ATTR.PS}} )
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player} )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.player} )
	end;
})

local TestCaseTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.bak_res_inbuild = res_inbuild
		res_inbuild={{id=110001001, storenum=1000}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110004001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007001}
			,{stone=80,conds={{id=110001,level=1},{id=FIXID.CITYLEVEL,level=0}},money=10,food=100,wood=10,iron=20,ntime=60,id=110007002}
			}
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		res_inbuild = self.bak_res_inbuild
	end;
	
	testBuildUpStopTimerHdr = function(self)
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		
		clearSendMsg_t()
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		local build = city:getBuildById(2)
		build.ulStoptime = Util:getTime()
		build.ucState = BUILD_STATE.UPGRADE
		
		self.mm:clear()
		BuildUpStopTimerHdr:handle(self.player, BUILDCITY_ID.MAIN, 2)
		assert(getSendMsg_t() ~= '')
		assert(build.ucState == BUILD_STATE.COMM)
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		assertEQ ( self.mm.params['sendSysMsgArgs.1'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100196, '"@itemid' .. build.ulResId .. '",' .. build.ucLevel} )
		assertEQ ( self.mm.params['sendSysMsgArgs.2'], {self.player, SMSGT.POP, SMT_SUCCESS, 100198, '"@itemid' .. build.ulResId .. '","@buptip' .. build.ulResId .. '"'} )
		
		self.mm:clear()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.HOUSEBUILD, level=10,state=BUILD_STATE.UPGRADE} } } )
		local build = city:getBuildById(10)
		build.ulStoptime = Util:getTime()
		BuildUpStopTimerHdr:handle(self.player, BUILDCITY_ID.MAIN, 10)
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		
		self.mm:clear()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=11,resid=FIXID.BARBACK, level=10,state=BUILD_STATE.UPGRADE} } } )
		local build = city:getBuildById(11)
		build.ulStoptime = Util:getTime()
		BuildUpStopTimerHdr:handle(self.player, BUILDCITY_ID.MAIN, 11)
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	testBuildDownStopTimerHdr = function(self)
		clearSendMsg_t()
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		local build = city:getBuildById(2)
		build.ulStoptime = Util:getTime()
		build.ucState = BUILD_STATE.DOWN
		
		BuildDownStopTimerHdr:handle(self.player, BUILDCITY_ID.MAIN, 2)
		
		local cres = self.player:getCityRes()
		assert(getSendMsg_t() ~= '')
		assert(cres:getWood() > 0)
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		assert(city:getBuildCount() == 1 )
		assert(build.ucState == BUILD_STATE.COMM)
	end;
	
	testFarmStopTimerHdr = function(self)
		Util:setTimeDrt(0)
		local farm = self.player:getFarm()
		farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		
		Util:setTimeDrt(30*60)
		
		clearSendMsg_t()
		
		FarmStopTimerHdr:handle(self.player, 1, 0)
		assert(getSendMsg_t() ~= '')
		assertEQ ( farm:getBlockById(1).ucState, FARM_STATE.COMPLETE)
		assertEQ ( farm:getBlockById(1).protectStopTime, Util:getTime())
		
		self.player:setVipLevel(3)
		clearSendMsg_t()
		farm:seedBlock({id=2,resid=FIXID.FARM,level=1,state=0})
		Util:setTimeDrt(30*60 + 30*60)
		clearSendMsg_t()
		FarmStopTimerHdr:handle(self.player, 2, 1)
		assert(getSendMsg_t() ~= '')
		assertEQ ( farm:getBlockById(2).ucState, FARM_STATE.COMPLETE)
		assertEQ ( farm:getBlockById(2).protectStopTime, Util:getTime() + 60)
	end;
	
	testUnlockHeroTimerHdr = function(self)
		local hero = HeroTestCaseHelper:createOneNewHero(self.player, self.player:getHeroMgr())
		hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		
		clearSendMsg_t()
		UnlockHeroTimerHdr:handle(self.player, hero:getId())
		assert(hero:getLockState() == HERO_LOCKSTATE.NONE )
		assert(getSendMsgCnt_t() == 3)
		
		clearSendMsg_t()
		hero:setLockState(HERO_LOCKSTATE.LOCKED)
		UnlockHeroTimerHdr:handle(self.player, hero:getId())
		assert(getSendMsg_t() == '')
		
		clearSendMsg_t()
		hero:setLockState(HERO_LOCKSTATE.NONE)
		UnlockHeroTimerHdr:handle(self.player, hero:getId())
		assert(getSendMsg_t() == '')
	end;
	
	testRecalHeroAttrTimerHdr_Mealth = function(self)
		Util:setTimeDrt(0)
		local hero = HeroTestCaseHelper:createOneNewHero(self.player, self.player:getHeroMgr())
		local healthattr = hero:getAttr(ATTR.HEALTH)
		healthattr.ulVal = 80*ATTR_PRECISION
		Util:setTimeDrt(3600)
		RecalHeroAttrTimerHdr:handle(self.player)
		assert(healthattr.ulVal == (80+res_hero_mealth_upspeed)*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
		
		clearSendMsg_t()
		Util:setTimeDrt(360000)
		RecalHeroAttrTimerHdr:handle(self.player)
		assert(healthattr.ulVal == hero:getAttrVal(ATTR.MHEALTH)*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
	end;
	
	testRecalHeroAttrTimerHdr_Morale_down = function(self)
		Util:setTimeDrt(0)
		local hero = HeroTestCaseHelper:createOneNewHero(self.player, self.player:getHeroMgr())
		local moraleattr = hero:getAttr(ATTR.MO)
		moraleattr.ulVal = 150*ATTR_PRECISION
		Util:setTimeDrt(3600)
		RecalHeroAttrTimerHdr:handle(self.player)
		assert(moraleattr.ulVal == (150-res_hero_morale_downspeed)*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
		
		clearSendMsg_t()
		Util:setTimeDrt(360000)
		RecalHeroAttrTimerHdr:handle( self.player)
		assert(moraleattr.ulVal == hero:getAttrVal(ATTR.MMO)*2/3*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
	end;
	
	testRecalHeroAttrTimerHdr_Morale_up = function(self)
		Util:setTimeDrt(0)
		local hero = HeroTestCaseHelper:createOneNewHero(self.player, self.player:getHeroMgr())
		local moraleattr = hero:getAttr(ATTR.MO)
		moraleattr.ulVal = 80*ATTR_PRECISION
		Util:setTimeDrt(3600)
		RecalHeroAttrTimerHdr:handle(self.player)
		assert(moraleattr.ulVal == (80+res_hero_morale_upspeed)*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
		
		clearSendMsg_t()
		Util:setTimeDrt(360000)
		RecalHeroAttrTimerHdr:handle(self.player)
		assert(moraleattr.ulVal == hero:getAttrVal(ATTR.MMO)*2/3*ATTR_PRECISION )
		assert(getSendMsg_t() ~= '')
	end;
})

local TestCaseBuildDownStopTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_handle = function(self)
		local city = self.player:getCitys():getCityById(1)
		local build = {ucState=BUILD_STATE.COMM, ucLevel=1}
		local r_getBuildStopParam = {nil, build}
		self.mm:mock( BuildDownStopTimerHdr, 'getBuildStopParam', r_getBuildStopParam )
		self.mm:mock( BuildDownStopTimerHdr, 'returnDownBuildRes' )
		self.mm:mock( BuildDownStopTimerHdr, 'returnDownBuildPopu' )
		self.mm:mock( BuildDownStopTimerHdr, 'subCityBuildVal' )
		self.mm:mock( city, 'subBuildLevel' )
		self.mm:mock( CityBuildSender, 'send' )
		self.mm:mock( CityBuildValSender, 'sendAll' )
		self.mm:mock( CommResSender, 'sendAll' )
		self.mm:mock( self.player:getCitys(), 'handleAutoBuilds' )
		
		local p_cityid = 1
		local p_buildid = 2
		
		BuildDownStopTimerHdr:handle(self.player, p_cityid, p_buildid)
		assertEQ ( self.mm.walkLog, 'getBuildStopParam' )
		assertEQ ( self.mm.params['getBuildStopParam'], {self.player, p_cityid, p_buildid} )
		
		self.mm:clear()
		r_getBuildStopParam[1] = city
		BuildDownStopTimerHdr:handle(self.player, p_cityid, p_buildid)
		assertEQ ( self.mm.walkLog, 'getBuildStopParam' )
		
		self.mm:clear()
		self.player:addExp(res_buildup_addexp(1))
		assertEQ ( self.player:getAttrVal(ATTR.XP), res_buildup_addexp(1))
		build.ucState = BUILD_STATE.DOWN
		BuildDownStopTimerHdr:handle(self.player, p_cityid, p_buildid)
		assertEQ ( self.mm.walkLog, 'getBuildStopParam,returnDownBuildRes,returnDownBuildPopu,subCityBuildVal,subBuildLevel,send,sendAll,sendAll,handleAutoBuilds' )
		assertEQ ( self.mm.params['returnDownBuildRes'], {self.player, build} )
		assertEQ ( self.mm.params['subCityBuildVal'], {self.player, build} )
		assertEQ ( self.mm.params['subBuildLevel'], {build} )
		assertEQ ( self.mm.params['send'], {self.player, p_cityid, p_buildid} )
		assertEQ ( self.mm.params['sendAll.1'], {self.player} )
		assertEQ ( self.mm.params['sendAll.2'], {self.player} )
		assertEQ ( build.ucState, BUILD_STATE.COMM )
		assertEQ ( self.player:getAttrVal(ATTR.XP), 0)
	end;
	
	test_returnDownBuildPopu = function(self)
		self.mm:mock(self.player:getCityRes(), 'setIdlePopu' )
		self.mm:mock(PopuSender, 'send' )
		
		local p_build = {ulResId=FIXID.GOV_BUILD, ucLevel=1}
		BuildDownStopTimerHdr:returnDownBuildPopu(self.player, p_build)
		assertEQ ( self.mm.walkLog, '' )
		
		local p_build = {ulResId=FIXID.WORKSHOPBUILD, ucLevel=1}
		BuildDownStopTimerHdr:returnDownBuildPopu(self.player, p_build)
		assertEQ ( self.mm.walkLog, 'setIdlePopu,send' )
		local levelres = ItemResUtil:findBuildLevelres(p_build.ulResId, p_build.ucLevel)
		assertEQ ( self.mm.params['setIdlePopu'], {self.player:getCityRes():getIdlePopu() + levelres.addpopu} )
		assertEQ ( self.mm.params['send'], { self.player, {'idle'} } )
	end;
})

local TestCaseSteelHeroSkeletonTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	setPreCond = function(self, p)
		self.hero:setSkeletonLevel(p.slevel)
		self.hero:setSSteelStopTime(p.sstoptime)

		res_herojingmai[7].maxif = 300
		res_herojingmai[7].addhit.val = 0
		res_herojingmai[7].addhurt.val = 0
		res_herojingmai[7].adddef.val = 0
		res_herojingmai[7].addes.val = 0
		res_herojingmai[7].addber.val = 0
		res_herojingmai[7].addmps.val = 0
		
		res_herojingmai[8].maxif = 400
		res_herojingmai[8].addhit.val = 1
		res_herojingmai[8].addhit.unit = 0
		res_herojingmai[8].addhurt.val = 2
		res_herojingmai[8].adddef.val = 3
		res_herojingmai[8].addes.val = 4
		res_herojingmai[8].addes.unit = 0
		res_herojingmai[8].addber.val = 5
		res_herojingmai[8].addber.unit = 0
		res_herojingmai[8].addmps.val = 6
	end;
	
	testHandle_isNotSteeling = function(self)
		self:setPreCond({slevel=7,sstoptime=0})
		SteelHeroSkeletonTimerHdr:handle(self.player, self.hero:getId())
		assert( self.hero:getSkeletonLevel() == 7 )
		assert( getSendMsg_t() == '' )
	end;
	
	testHandle_isInVaildTime = function(self)
		Util:setTimeDrt(26)
		self:setPreCond({slevel=7,sstoptime=30})
		SteelHeroSkeletonTimerHdr:handle(self.player, self.hero:getId())
		assert( self.hero:getSkeletonLevel() == 7 )
		assert( getSendMsg_t() == '' )
	end;
	
	testHandle_isFullSlevel = function(self)
		Util:setTimeDrt(30)
		self:setPreCond({slevel=8,sstoptime=30})
		SteelHeroSkeletonTimerHdr:handle(self.player, self.hero:getId())
		assert( self.hero:getSkeletonLevel() == 8 )
		assert( getSendMsg_t() == '' )
	end;
	
	testHandle_OK = function(self)
		self.mm:mock(TaskFinisher, 'checkTasks' )
		Util:setTimeDrt(29) -- 模拟1秒的误差
		self:setPreCond({slevel=7,sstoptime=30})
		
		local oldHI = self.hero:getAttrVal(ATTR.HI)
		local oldHU = self.hero:getAttrVal(ATTR.HU)
		local oldDE = self.hero:getAttrVal(ATTR.DE)
		local oldES = self.hero:getAttrVal(ATTR.ES)
		local oldBER = self.hero:getAttrVal(ATTR.BER)
		local oldMPS = self.hero:getAttrVal(ATTR.MPS)
		--local oldSFC = self.hero.getAttrVal(ATTR.SFC)

		SteelHeroSkeletonTimerHdr:handle(self.player, self.hero:getId())
		
		assert( self.hero:getSkeletonLevel() == 8 )
		assert( self.hero:getSSteelStopTime() == 0 )
		assert( self.hero:getAttrVal(ATTR.MIF) == 400 )
		
		assert( self.hero:getAttrVal(ATTR.HI) == oldHI + 1 )
		assert( self.hero:getAttrVal(ATTR.HU) == oldHU + 2 )
		assert( self.hero:getAttrVal(ATTR.DE) == oldDE + 3 )
		assert( self.hero:getAttrVal(ATTR.ES) == oldES + 4 )
		assert( self.hero:getAttrVal(ATTR.BER) == oldBER + 5 )
		assert( self.hero:getAttrVal(ATTR.MPS) == oldMPS + 6 )
		--assert( self.hero.getAttrVal(ATTR.SFC) > oldSFC )
		
		assert( getSendMsgCnt_t() == 2 )
		assert( isInclude(getSendMsg_t(1), 'id:1', 'skeleton:', 'level:8', 'stoptime:0' ) == true )
		assert( isInclude(getSendMsg_t(2), '"'..ATTR.MIF..'":', '"'..ATTR.HI..'":', '"'..ATTR.HU..'":', '"'..ATTR.DE..'":', '"'..ATTR.ES..'":', '"'..ATTR.BER..'":', '"'..ATTR.MPS..'":', '"'..ATTR.SFC..'":' ) == true )
		assertEQ( self.mm.params['checkTasks'], {self.player} )
	end;
})

local TestCaseSkillSteelHeroTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testNoSteeling = function(self)	
		TestCaseCondition:setPreCond(self.player, self.hero, {  curtime=30, hero={skills={{resid=6001001,level=1},{resid=6001008,level=1,dex=1}}, skillsteel={resid=0,durtime=0,stoptime=0}} })
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001008)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidSkill = function(self)	
		TestCaseCondition:setPreCond(self.player, self.hero, {   curtime=30, hero={skills={{resid=6001001,level=1},{resid=6001008,level=1,dex=1}}, skillsteel={resid=6001008,durtime=1,stoptime=30}} })
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001009)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testNoHasThisSkill = function(self)	
		TestCaseCondition:setPreCond(self.player, self.hero, {   curtime=30, hero={skills={{resid=6001001,level=1},{resid=6001008,level=1,dex=1}}, skillsteel={resid=6001009,durtime=1,stoptime=30}} })
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001009)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testNoArriveStoptime = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {  curtime=26, hero={skills={{resid=6001001,level=1},{resid=6001008,level=1,dex=1}}, skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001008)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testIsFullLevel = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {  curtime=30, hero={skills={{resid=6001001,level=1},{resid=6001008,level=20}}, skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001008)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testSteel_OK = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {  curtime=30, hero={skills={{resid=6001001,level=1},{resid=6001008,level=1,dex=0}}, skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		local oldlevel = self.hero:getSkillById(6001008).ucLevel
		
		SkillSteelHeroTimerHdr:handle(self.player, self.hero:getId(), 6001008)
		assert( self.hero:getSkillSteel().ulResId == 0 )
		assert( self.hero:getSkillById(6001008).ulDex > 0 or self.hero:getSkillById(6001008).ucLevel > oldlevel )
		assert( getSendMsgCnt_t() ~= 0 )
	end;
})



local TestCaseLearnCultureTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidTimerCultureId = function(self)	
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=120001, stoptime=30} })
		LearnCultureTimerHdr:handle(self.player, 120002)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testNoCultureIsLearning = function(self)	
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=0, stoptime=0} })
		LearnCultureTimerHdr:handle(self.player, 120001)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testNoArriveStoptime = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=26, learningculture={id=120001, stoptime=30} })
		LearnCultureTimerHdr:handle(self.player, 120001)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testCultureIsFullLevel = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=120001, stoptime=30}, cultures={{id=120001, level=100}} })
		LearnCultureTimerHdr:handle(self.player, 120001)
		assert( getSendMsgCnt_t() == 0 )
	end;
	
	testLearnOK_FromZeroToOneLevel = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=120001, stoptime=30} })
		assert( self.player:getCultures():getCultures().count == 0 )
		LearnCultureTimerHdr:handle(self.player, 120001)
		assert( self.player:getCultures():getLearningCulture().id == 0 )
		assert( self.player:getCultures():getLearningCulture().stoptime == 0 )
		assert( self.player:getCultures():getCultures().count == 1 )
		assert( self.player:getCultures():getLevel(120001) == 1 )
		assert( getSendMsgCnt_t() == 4 )
	end;
	
	testLearnOK_FromOneToTwoLevel = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.mm:mock(TaskFinisher, 'checkTasks')
		TestCaseCondition:setPreCond(self.player, nil, {curtime=29, learningculture={id=120001, stoptime=30}, cultures={{id=120001, level=1}} })
		assert( self.player:getCultures():getCultures().count == 1 )
		LearnCultureTimerHdr:handle(self.player, 120001)
		assert( self.player:getCultures():getLearningCulture().id == 0 )
		assert( self.player:getCultures():getLearningCulture().stoptime == 0 )
		assert( self.player:getCultures():getCultures().count == 1 )
		assert( self.player:getCultures():getLevel(120001) == 2 )
		assertEQ( self.mm.params['checkTasks'], {self.player} )
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.POP, SMT_SUCCESS, 100198, '"@itemid120001","@cuptip120001"'} )
	end;
})

local TestCaseHeroSteelStopTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_invalidHeroId = function(self)
		self.mm:mock(HeroSteelStopTimerHdr:getStopHdr(), 'handle')
		local p_heroId = 1
		HeroSteelStopTimerHdr:handle( self.player, p_heroId, 0, 0 )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_invalidStartTime = function(self)
		self.mm:mock(HeroSteelStopTimerHdr:getStopHdr(), 'handle')
		local p_heroId = 1
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0}} })
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		hero1:getHeroSteel():setStartTime(2)
		
		HeroSteelStopTimerHdr:handle( self.player, p_heroId, 1, 0 )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_invalidSteelType = function(self)
		self.mm:mock(HeroSteelStopTimerHdr:getStopHdr(), 'handle')
		local p_heroId = 1
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0}} })
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		hero1:getHeroSteel():setStartTime(1)
		hero1:getHeroSteel():setSteelType(1)
		
		HeroSteelStopTimerHdr:handle( self.player, p_heroId, 1, 0 )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_handle = function(self)
		self.mm:mock(HeroSteelStopTimerHdr:getStopHdr(), 'handle')
		local p_heroId = 1
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0}} })
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		hero1:getHeroSteel():setStartTime(1)
		hero1:getHeroSteel():setSteelType(1)
		HeroSteelStopTimerHdr:handle( self.player, p_heroId, 1, 1 )
		assertEQ ( self.mm.walkLog, 'handle' )
		assertEQ ( self.mm.params['handle'], {self.player, {heroId=p_heroId}} )
	end;
	
	test_getStopHdr = function(self)
		local hdr = HeroSteelStopTimerHdr:getStopHdr()
		assertEQ ( hdr:getClass(), StopHeroSteelHdr )
		assertEQ ( hdr, HeroSteelStopTimerHdr:getStopHdr() )
	end;
})

local TestCaseBuildCityDefStopTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isValidId = {false}
		local r_isArriveTime = {false}
		self.mm:travelMock(BuildCityDefStopTimerHdr, '_initParams')
		self.mm:mock(BuildCityDefStopTimerHdr, '_isValidId', r_isValidId)
		self.mm:mock(BuildCityDefStopTimerHdr, '_isArriveTime', r_isArriveTime)
		self.mm:mock(BuildCityDefStopTimerHdr, '_addCityDef')
		self.mm:mock(BuildCityDefStopTimerHdr, '_clearCityDefBuilding')
		self.mm:mock(BuildCityDefStopTimerHdr, '_sendMsgs')
		self.mm:mock(TaskFinisher, 'checkTasks')
		
		local p_cityDefResId = FIXID.FIRSTCITYDEF + 1
		assertEQ ( BuildCityDefStopTimerHdr:handle(self.player, p_cityDefResId), false )
		assertEQ ( self.mm.walkLog, '_initParams,_isValidId' )
		assertEQ ( self.mm.params['_initParams'], {self.player, p_cityDefResId} )
		
		self.mm:clear()
		r_isValidId[1] = true
		assertEQ ( BuildCityDefStopTimerHdr:handle(self.player, p_cityDefResId), false )
		assertEQ ( self.mm.walkLog, '_initParams,_isValidId,_isArriveTime' )
		
		self.mm:clear()
		r_isArriveTime[1] = true
		p_cityDefResId = FIXID.FIRSTCITYDEF + 1
		assertEQ ( BuildCityDefStopTimerHdr:handle(self.player, p_cityDefResId), true )
		assertEQ ( self.mm.walkLog, '_initParams,_isValidId,_isArriveTime,_addCityDef,_clearCityDefBuilding,_sendMsgs,checkTasks' )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test__initParams = function(self)
		local p_cityDefResId = 1
		BuildCityDefStopTimerHdr:_initParams(self.player, p_cityDefResId)
		assertEQ ( BuildCityDefStopTimerHdr.player, self.player)
		assertEQ ( BuildCityDefStopTimerHdr.cityDefResId, p_cityDefResId)
		assertEQ ( BuildCityDefStopTimerHdr.cityDef, self.player:getCityDef() )
	end;
	
	test__isValidId = function(self)
		BuildCityDefStopTimerHdr.player = self.player
		BuildCityDefStopTimerHdr.cityDef = self.player:getCityDef()
		self.player:getCityDef():setBuildingResid(0)
		assertEQ ( BuildCityDefStopTimerHdr:_isValidId(), false )
		
		self.player:getCityDef():setBuildingResid(1)
		BuildCityDefStopTimerHdr.cityDefResId = 2
		assertEQ ( BuildCityDefStopTimerHdr:_isValidId(), false )
		
		BuildCityDefStopTimerHdr.cityDefResId = 1
		assertEQ ( BuildCityDefStopTimerHdr:_isValidId(), true )
	end;
	
	test__isArriveTime = function(self)
		BuildCityDefStopTimerHdr.cityDef = self.player:getCityDef()
		self.player:getCityDef():setBuildingStopTime(Util:getTime())
		assertEQ ( BuildCityDefStopTimerHdr:_isArriveTime(), true )
		
		self.player:getCityDef():setBuildingStopTime(Util:getTime()+TIMER_DRT_TIME)
		assertEQ ( BuildCityDefStopTimerHdr:_isArriveTime(), true )
		
		self.player:getCityDef():setBuildingStopTime(Util:getTime()+TIMER_DRT_TIME+1)
		assertEQ ( BuildCityDefStopTimerHdr:_isArriveTime(), false )
	end;
	
	test__addCityDef = function(self)
		self.player:getCityDef():setBuildingNumber(1)
		self.player:getCityDef():setBuildingResid(FIXID.FIRSTCITYDEF)
		BuildCityDefStopTimerHdr.cityDefResId = self.player:getCityDef():getBuildingResid()
		BuildCityDefStopTimerHdr.cityDef = self.player:getCityDef()
		BuildCityDefStopTimerHdr:_addCityDef()
		assertEQ ( self.player:getCityDef():getDefNumber(CITYDEF_TYPE.XIANJING), 1 )
		BuildCityDefStopTimerHdr:_addCityDef()
		assertEQ ( self.player:getCityDef():getDefNumber(CITYDEF_TYPE.XIANJING), 2 )
	end;
	
	test__clearCityDefBuilding = function(self)
		BuildCityDefStopTimerHdr.cityDef = self.player:getCityDef()
		self.player:getCityDef():setBuildingResid(1)
		self.player:getCityDef():setBuildingStopTime(2)
		self.player:getCityDef():setBuildingNumber(3)
		BuildCityDefStopTimerHdr:_clearCityDefBuilding()
		assertEQ ( self.player:getCityDef():getBuildingResid(), 0 )
		assertEQ ( self.player:getCityDef():getBuildingStopTime(), 0 )
		assertEQ ( self.player:getCityDef():getBuildingNumber(), 0 )
	end;
	
	test__sendMsgs = function(self)
		BuildCityDefStopTimerHdr.player = self.player
		self.mm:mock(PlayerCityDefSender, 'sendDefs')
		self.mm:mock(PlayerCityDefSender, 'sendBuilding')
		BuildCityDefStopTimerHdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendDefs,sendBuilding' )
		assertEQ ( self.mm.params['sendDefs'], {self.player} )
		assertEQ ( self.mm.params['sendBuilding'], {self.player} )
	end;
})

tqTimerHdr_t_main = function(suite)	
	suite:addTestCase(TestCaseRefreshRoleAttrTimerHdr, 'TestCaseRefreshRoleAttrTimerHdr' )
	suite:addTestCase(TestCaseTimerHdr, 'TestCaseTimerHdr' )
	suite:addTestCase(TestCaseBuildDownStopTimerHdr, 'TestCaseBuildDownStopTimerHdr')
	suite:addTestCase(TestCaseSteelHeroSkeletonTimerHdr, 'TestCaseSteelHeroSkeletonTimerHdr')
	suite:addTestCase(TestCaseSkillSteelHeroTimerHdr, 'TestCaseSkillSteelHeroTimerHdr')
	suite:addTestCase(TestCaseLearnCultureTimerHdr, 'TestCaseLearnCultureTimerHdr')
	suite:addTestCase(TestCaseHeroSteelStopTimerHdr, 'TestCaseHeroSteelStopTimerHdr')
	suite:addTestCase(TestCaseBuildCityDefStopTimerHdr, 'TestCaseBuildCityDefStopTimerHdr')
end;



