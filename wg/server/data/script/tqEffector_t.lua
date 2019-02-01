require('tqEffector')
require('tqHeroResHandler_t')

local calcStopTimeByPerVal = function(stoptime, per, number)
	local durtime = 0
	for i=1, number, 1 do
		durtime = stoptime - Util:getTime()
		stoptime =	stoptime - math.floor(durtime*per)
	end
	return stoptime
end

local TestCaseEffectorMgr = TestCase:extends({
	testGetEffectorObj = function(self)
		assert( EffectorMgr:getEffector({id=0}) == NullEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ACCELERATE}):getClass() == BuildAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.REFRESHNHERO}):getClass() == RefreshNewHeroEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADDHEROHEALTH}):getClass() == AddHeroHealthEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADDHEROMORALE}):getClass() == AddHeroMoraleEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADDHEROIF}):getClass() == AddHeroInnerForceEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_STEELMAILUO}):getClass() == HeroSSteelAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_STEELSKILL}):getClass() == HeroSkillSteelAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_CANSTEELSKILL}):getClass() == AddHeroCanSkillSteelTimeEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.LEARN_HERO_BSKILL}):getClass() == HeroLearnBaseSkillEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.LEARN_HERO_TSKILL}):getClass() == HeroLearnTacticSkillEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.LEARN_HERO_SSKILL}):getClass() == HeroLearnSpecSkillEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_NEWSOLDIER}):getClass() == AddRoleNewSoldierNumEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_TRADING}):getClass() == TradingAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD}):getClass() == FullTradingAccUseGiftGoldEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_DOINGROLETASK}):getClass() == DoingRoleTaskAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_TASK_USEGIFTGOLD}):getClass() == FullTaskAccUseGiftGoldEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD}):getClass() == FullAccBuildUseGiftGoldEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD}):getClass() == FullAccCultureLearnUseGiftGoldEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD}):getClass() == FullAccSkeletonSteelUseGiftGoldEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD}):getClass() == FullAccSkillSteelUseGiftGoldEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD}):getClass() == FullAccCityDefBuildUseGiftGoldEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_CULTURELEARN}):getClass() == LearnCultureAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ACC_CITYDEF}):getClass() == BuildCityDefAccEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_ADD_FULLATTRS}):getClass() == AddFullFightAttrsEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_ADD_ES}):getClass() == AddFightESAttrEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_JIPO}):getClass() == CancelFightDEAttrEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_XUERUO}):getClass() == XueruoDEAttrEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_CUIDU3}):getClass() == CuiDuAttrEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_SHENYI}):getClass() == AddHPAttrEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_FANJI}):getClass() == FanJiFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_ADD_HU}):getClass() == AddHurtFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_BISHA}):getClass() == BiShaFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_LIANJI}):getClass() == AddHurtFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_HUOGONG}):getClass() == HuoGongFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_CHENGSHANG}):getClass() == ChengShangFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.F_XIXUE}):getClass() == XiXueFightEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.LEARN_LINEUP}):getClass() == LearnLineUpEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_THREE_BUILDINGPOS}):getClass() == AddThreeBuildingPosEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.TOWER_RECOVER_SOLDIER}):getClass() == AddTowerRecoverSoldierEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.TOWER_RECOVER_SOLDIER_BYACT}):getClass() == AddTowerRecoverSoldierByActEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.RESTORE_HURT_BUILDVAL}):getClass() == RestoreHurtBuildValEffector )
		

		assert( EffectorMgr:getEffector({id=RES_EFF.SEND_WORLD_BLESS}):getClass() == SendWorldBlessEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.SETPOS_MOVECITY}):getClass() == SetPosMoveCityEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.RAND_MOVECITY}):getClass() == RandMoveCityEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.DROPITEM}):getClass() == DropItemEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.PASSIVITY_DROPITEM}):getClass() == PassivityDropItemEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_FOOD}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_WOOD}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_STONE}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_IRON}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_MONEY}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_FOURRES}):getClass() == AddCommResEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.AVOIDFIGHT}):getClass() == AddAvoidFightEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_ROLEATTRVAL}):getClass() == AddRoleAttrEffector )
		
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_BUILD_SPEED}):getClass() == AddBuildSpeedEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_COMMRES_OUTPUT}):getClass() == AddCommResOutputEffector )
		assert( EffectorMgr:getEffector({id=RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT}):getClass() == AddCultureSpeedAndMoneyOutputEffector )
		
	end;
});

local TestCaseEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		assert ( Effector():isCanExec() == true )
	end;
	
	test_getNeedNumber = function(self)
		assert ( Effector():getNeedNumber(nil, 1) == 1 )
	end;
	
	test_exec = function(self)
		Effector():exec()
	end;
});

local TestCaseSomeEffector = TestCase:extends({
	setUp = function(self)
		Util:setTimeDrt(0)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		Util:setTimeDrt(0)
	end;
	
	testRefreshNewHeroEffector = function(self)
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		local heromgr = self.player:getHeroMgr()
		local newheros = heromgr:getNewHeros()
		
		assert ( RefreshNewHeroEffector():isCanExec(self.player, 0, effectres) == false )
		assert ( RefreshNewHeroEffector():isCanExec(self.player, 2, effectres) == false )
		assert ( RefreshNewHeroEffector():isCanExec(self.player, 1, effectres) == true )
		
		assert ( RefreshNewHeroEffector():getNeedNumber() == 1 )
		
		assert(newheros:getNewHeroLastTime() == 0)
		Util:setTimeDrt(1)
		local effectres = {id=RES_EFF.REFRESHNHERO,val=1,u=0}
		RefreshNewHeroEffector():exec(self.player, 1, effectres)
		assert(newheros:getNewHeroLastTime() == 1)
	end;
	
	testAddHeroHealthEffector = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		self.hero:setAttrVal(ATTR.HEALTH, 97)
		
		local effectres = {id=RES_EFF.ADDHEROHEALTH,val=2}
		self.hero:setState(HERO_STATE.EXPED)
		assert ( AddHeroHealthEffector():isCanExec(self.player, 2, effectres, {hero=self.hero}) == false )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.hero:setState(HERO_STATE.FREE)
		assert ( AddHeroHealthEffector():isCanExec(self.player, 2, effectres, {hero=self.hero}) == true )
		
		self.hero:setState(HERO_STATE.STEEL)
		assert ( AddHeroHealthEffector():isCanExec(self.player, 2, effectres, {hero=self.hero}) == true )
		
		self.hero:setState(HERO_STATE.ACT_TOWER)
		assert ( AddHeroHealthEffector():isCanExec(self.player, 2, effectres, {hero=self.hero}) == true )
		
		self.hero:setState(HERO_STATE.ACT_TERRACE)
		assert ( AddHeroHealthEffector():isCanExec(self.player, 2, effectres, {hero=self.hero}) == true )

		assert ( AddHeroHealthEffector():getNeedNumber(self.player, 2, effectres, {hero=self.hero}) == 2 )
		
		AddHeroHealthEffector():exec(self.player, 2, effectres, {hero=self.hero})
		assert(self.hero:getAttrVal(ATTR.HEALTH) == 100)
		assert(getSendMsgCnt_t() == 3)
	end;
	
	testAddHeroMoraleEffector = function(self)
		self.hero:setAttrVal(ATTR.MMO, 150)
		self.hero:setAttrVal(ATTR.MO, 100)
		
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local effectres = {id=RES_EFF.ADDHEROMORALE,val=3}
		self.hero:setState(1)
		assert ( AddHeroMoraleEffector():isCanExec(self.player, 10, effectres, {hero=self.hero}) == false )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.hero:setState(0)
		assert ( AddHeroMoraleEffector():isCanExec(self.player, 10, effectres, {hero=self.hero}) == true )
		
		assert ( AddHeroMoraleEffector():getNeedNumber(self.player, 10, effectres, {hero=self.hero}) == 10 )
		
		AddHeroMoraleEffector():exec(self.player, 10, effectres, {hero=self.hero})
		assert(self.hero:getAttrVal(ATTR.MO) == 130)
		assert(getSendMsgCnt_t() == 1)
		
		clearSendMsg_t()
		AddHeroMoraleEffector():exec(self.player, 20, effectres, {hero=self.hero})
		assert(self.hero:getAttrVal(ATTR.MO) == 150)
		assert(getSendMsgCnt_t() == 1)
	end;
	
	testHeroLearnBaseSkillEffector_nogrid  = function(self)
		self.hero:getInner().ucLevel = 1
		local effectres = {id=RES_EFF.LEARN_HERO_BSKILL,val=6001008}
		HeroLearnBaseSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testHeroLearnBaseSkillEffector_existskill  = function(self)
		self.hero:getInner().ucLevel = 60
		self.hero:addSkill({resid=6001008,level=1,dex=0})
		local effectres = {id=RES_EFF.LEARN_HERO_BSKILL,val=6001008}
		HeroLearnBaseSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testHeroLearnBaseSkillEffector_hasskillsteeling  = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, skills={{resid=6001008,level=1,dex=0}}, skillsteel={resid=6001008,durtime=10,stoptime=20}} })
		local effectres = {id=RES_EFF.LEARN_HERO_BSKILL,val=6001009}
		HeroLearnBaseSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
		assert(self.hero:getSkillCount() == 1 )
	end;
	
	testHeroLearnBaseSkillEffector_hasEmptyGrid_OK  = function(self)
		self.hero:getInner().ucLevel = 60
		self.hero:addSkill({resid=6001008,level=1,dex=0})
		local effectres = {id=RES_EFF.LEARN_HERO_BSKILL,val=6001009}
		HeroLearnBaseSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() ~= 0)
		assert(self.hero:getSkillCount() == 2 )
		assert(self.hero:getSkillByIdx(1).ulResId == 6001009 )
		assert(self.hero:getSkillByIdx(1).ucLevel == 1 )
	end;
	
	testHeroLearnBaseSkillEffector_hasNoEmptyGrid_OK  = function(self)
		self.hero:getInner().ucLevel = 60
		self.hero:addSkill({resid=6001008,level=20,dex=0})
		self.hero:addSkill({resid=6001009,level=20,dex=0})
		local effectres = {id=RES_EFF.LEARN_HERO_BSKILL,val=6001010}
		HeroLearnBaseSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() ~= 0)
		assert(self.hero:getSkillCount() == 2 )
		assert(self.hero:getSkillByIdx(0).ulResId == 6001010 or self.hero:getSkillByIdx(1).ulResId == 6001010 )
		assert(self.hero:getSkillByIdx(0).ucLevel == 20 and self.hero:getSkillByIdx(1).ucLevel == 20 )
	end;
	
	testAddHeroCanSkillSteelTimeEffector_OK = function(self)
		local effectres = {id=RES_EFF.ADD_CANSTEELSKILL,val=10}
		assert ( AddHeroCanSkillSteelTimeEffector():isCanExec(self.player, 0, effectres, {}) == false )
		assert ( AddHeroCanSkillSteelTimeEffector():isCanExec(self.player, 2, {val=0}, {}) == false )
		assert ( AddHeroCanSkillSteelTimeEffector():isCanExec(self.player, 2, {val=10}, {}) == true )
		
		AddHeroCanSkillSteelTimeEffector():exec(self.player, 2, effectres, {})
		assert(self.player:getHeroMgr():getCanUseSkillSteelTime() == 20)
		assert(getSendMsgCnt_t() == 1)
	end;
	
	testAddNewSoldierNum = function(self)
		local effectres = {id=RES_EFF.ADD_NEWSOLDIER,val=10}
		
		assert ( AddRoleNewSoldierNumEffector():isCanExec(self.player, 0, effectres, {}) == false )
		assert ( AddRoleNewSoldierNumEffector():isCanExec(self.player, 1, {val=0}, {}) == false )
		
		self.player:setAttrVal(ATTR.MNAF, 20)
		self.player:setAttrVal(ATTR.NAF, 20)
		assert ( AddRoleNewSoldierNumEffector():isCanExec(self.player, 3, effectres, {}) == false )
		
		self.player:setAttrVal(ATTR.MNAF, 21)
		self.player:setAttrVal(ATTR.NAF, 0)
		assert ( AddRoleNewSoldierNumEffector():isCanExec(self.player, 3, effectres, {}) == true )
		
		assert ( AddRoleNewSoldierNumEffector():getNeedNumber(self.player, 1, effectres, {}) == 1 )
		assert ( AddRoleNewSoldierNumEffector():getNeedNumber(self.player, 2, effectres, {}) == 2 )
		assert ( AddRoleNewSoldierNumEffector():getNeedNumber(self.player, 3, effectres, {}) == 3, 'math.ceil(21/3) == 3 ' )
		assert ( AddRoleNewSoldierNumEffector():getNeedNumber(self.player, 4, effectres, {}) == 3, 'max need is tree' )
		
		AddRoleNewSoldierNumEffector():exec(self.player, 3, effectres, {})
		assert(getSendMsgCnt_t() == 1)
		assert( self.player:getAttrVal(ATTR.NAF) == 21 )
	end;
})

local TestCaseHeroLearnTacticSkillEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testNoArriveLevel = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel-1} })
		local effectres = {id=RES_EFF.LEARN_HERO_TSKILL,val=6001001}
		HeroLearnTacticSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testIsExistSkillId = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel, skills={{resid=6001001,level=1}}} })
		local effectres = {id=RES_EFF.LEARN_HERO_TSKILL,val=6001001}
		HeroLearnTacticSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testLearnOk = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel} })
		local effectres = {id=RES_EFF.LEARN_HERO_TSKILL,val=6001001}
		HeroLearnTacticSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() ~= 0)
		assert(self.hero:getSkillCount() == 1)
		assert(self.hero:getSkillByIdx(0).ulResId == 6001001)
	end;	
});

local TestCaseHeroLearnSpecSkillEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testNoArriveLevel = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel-1, prof=1} })
		local effectres = {id=RES_EFF.LEARN_HERO_SSKILL,val=6001003}
		HeroLearnSpecSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testIsExistSkillId = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel, prof=1, skills={{resid=6001003,level=1}}} })
		local effectres = {id=RES_EFF.LEARN_HERO_SSKILL,val=6001003}
		HeroLearnSpecSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testInvalidProf = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel, prof=2} })
		local effectres = {id=RES_EFF.LEARN_HERO_SSKILL,val=6001003}
		HeroLearnSpecSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testLearnOk = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=res_hero_hasskill_minlevel, prof=1} })
		local effectres = {id=RES_EFF.LEARN_HERO_SSKILL,val=6001003}
		HeroLearnSpecSkillEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() ~= 0)
		assert(self.hero:getSkillCount() == 1)
		
		assert(self.hero:getSubject(0) == 3)
		assert(self.hero:getSkillByIdx(0).ulResId == 6001003)
	end;
});

local assertAccEffectorGetNeedNumber = function(player, effector, g_effectres, g_params)
	local mm = MethodMock()
	mm:mock(effector, 'getNeedNumberInner', function(self, stoptime, effectres, number)
		mm.stoptime = stoptime
		mm.effectres = effectres
		mm.number = number
		return 4
		end)
	assert ( effector:getNeedNumber(player, 1, g_effectres, g_params ) == 4 )
	mm:restore()
	
	assert ( mm.stoptime == 3 )
	assert ( mm.effectres == g_effectres )
	assert ( mm.number == 1 )
end;

local TestCaseBuildAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isCanExec = function(self)
		local effector = BuildAccEffector()
		local g_effectres = {val=2}
		local g_params = {build={ulStoptime=10}}	
		
		local mm = MethodMock()
		mm:mock(effector, 'isValidNumberAndEffectVal', function(self, number, effectres)
			mm.number = number
			mm.effectres = effectres
			mm.params = params
			return false
			end)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		mm:restore()
		
		assert ( mm.number == 1 )
		assert ( mm.effectres == g_effectres )
		
		Util:setTimeDrt(100)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		Util:setTimeDrt(1)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		g_params = {build={ulStoptime=10, ucState=BUILD_STATE.UPGRADE}}	
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
	end;
	
	test_getNeedNumber = function(self)
		local effector = BuildAccEffector()
		local g_effectres = {val=2}
		local g_params = {build={ulStoptime=3}}
		assertAccEffectorGetNeedNumber(self.player, effector, g_effectres, g_params)
	end;
	
	testInvalidBuildState = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=110010,level=1,state=0} } })
		local build = self.player:getCitys():getBuildsByResId(110010)[1]
		local effectres = {id=RES_EFF.ACCELERATE,val=60,u=0}
		BuildAccEffector():exec(self.player, 2, effectres, {cityid=1, build=build})
		assert(getSendMsg_t() == '')
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testCurTimeArriveStoptime = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { curtime=31, builds={ {id=10,resid=110010,level=1,state=BUILD_STATE.UPGRADE,stoptime=30} } })
		local build = self.player:getCitys():getBuildsByResId(110010)[1]
		local effectres = {id=RES_EFF.ACCELERATE,val=60,u=0}
		BuildAccEffector():exec(self.player, 2, effectres, {cityid=1, build=build})
		assert(getSendMsg_t() == '')
		assert( getLastTimer_t().eventid < 0 )
		
		TestCaseCondition:setPreCond(self.player, nil, { curtime=30 })
		BuildAccEffector():exec(self.player, 2, effectres, {cityid=1, build=build})
		assert(getSendMsg_t() == '')
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testAccEffectOK_Value= function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.mm:mock(TaskFinisher, 'trigerTask')
		local citys = self.player:getCitys()
		local city = citys:getCityById(1)
		local build = city:getBuildById(1)
		build.ucState = BUILD_STATE.UPGRADE
		build.ulStoptime = Util:getTime() + 120
		
		local effectres = {id=RES_EFF.ACCELERATE,val=60,u=0}
		BuildAccEffector():exec(self.player, 2, effectres, {cityid=1, build=build})
		assert(build.ulStoptime == Util:getTime())
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.SPEED_BUILDING} )
		assertEQ ( self.mm.params['start'], {0, {TIMER_EVT.BUILDUP_STOP, 1, build.ulId}, self.player:getTimerCaller()} )
	end;	
	
	testAccEffectOK_Percent= function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.mm:mock(TaskFinisher, 'trigerTask')
		TestCaseCondition:setPreCond(self.player, nil, { curtime=31, builds={ {id=10,resid=110010,level=1,state=BUILD_STATE.UPGRADE,stoptime=500} } })
		local build = self.player:getCitys():getBuildsByResId(110010)[1]
		
		local effectres = {id=RES_EFF.ACCELERATE,val=60,u=VAL_UNIT.PER}
		BuildAccEffector():exec(self.player, 3, effectres, {cityid=1, build=build})
		
		assert(build.ulStoptime == calcStopTimeByPerVal(500, 0.60, 3))
		assert(getSendMsg_t() ~= '')
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.SPEED_BUILDING} )
		assertEQ ( self.mm.params['start'], {(build.ulStoptime-Util:getTime())*1000, {TIMER_EVT.BUILDUP_STOP, 1, build.ulId}, self.player:getTimerCaller()} )
	end;
});

local TestCaseHeroSSteelAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isCanExec = function(self)
		Util:setTimeDrt(10)
		
		local effector = HeroSSteelAccEffector()
		local g_effectres = {}
		local g_params = {hero = self.hero}
		local g_isValidNumberAndEffectValRt = {false}
		
		self.mm:mock(effector, 'isValidNumberAndEffectVal', g_isValidNumberAndEffectValRt)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( self.mm.walkLog == 'isValidNumberAndEffectVal' )
		assertListEQ ( self.mm.params['isValidNumberAndEffectVal'], {1, g_effectres} )

		self.mm:clear()
		self.hero:setState(HERO_STATE.EXPED)
		g_isValidNumberAndEffectValRt[1] = true
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( self.mm.walkLog == 'isValidNumberAndEffectVal,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.mm:clear()
		self.hero:setState(HERO_STATE.FREE)
		self.hero:setSSteelStopTime(0)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		self.mm:clear()
		self.hero:setSSteelStopTime(10)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		self.mm:clear()
		self.hero:setSSteelStopTime(1000)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
	end;
	
	test_getNeedNumber = function(self)
		self.hero:setSSteelStopTime(3)
		local effector = HeroSSteelAccEffector()
		local g_effectres = {val=2}
		local g_params = {hero=self.hero}
		assertAccEffectorGetNeedNumber(self.player, effector, g_effectres, g_params)
	end;
	
	testInvalidSteelState = function(self)
		self.hero:setSSteelStopTime(0)
		local effectres = {id=RES_EFF.ACC_STEELMAILUO,val=10,u=0}
		HeroSSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert( self.hero:getSSteelStopTime() ==  0 )
		assert( getLastTimer_t().eventid == -1 )
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testCurTimeArriveStoptime = function(self)
		self.hero:setSSteelStopTime(30)
		TestCaseCondition:setPreCond(self.player, nil, { curtime=31 })
		local effectres = {id=RES_EFF.ACC_STEELMAILUO,val=10,u=0}
		HeroSSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert( getLastTimer_t().eventid < 0 )
		assert(getSendMsgCnt_t() == 0)
		
		TestCaseCondition:setPreCond(self.player, nil, { curtime=30 })
		HeroSSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert( getLastTimer_t().eventid < 0 )
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testAccEffectorOK_Common = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		self.hero:setSSteelStopTime(Util:getTime()+30)
		local effectres = {id=RES_EFF.ACC_STEELMAILUO,val=10,u=0}
		HeroSSteelAccEffector():exec(self.player, 2, effectres, {hero=self.hero})
		assert( self.hero:getSSteelStopTime() ==  Util:getTime()+10 )
		assertEQ ( self.mm.params['start'], {10 * 1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
		assert(getSendMsgCnt_t() == 1)
	end;
	
	testAccEffectorOK_ManyItems = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		Util:setTimeDrt(100)
		self.hero:setSSteelStopTime(Util:getTime()+30)
		local effectres = {id=RES_EFF.ACC_STEELMAILUO,val=10,u=0}
		HeroSSteelAccEffector():exec(self.player, 100, effectres, {hero=self.hero})
		
		assert( self.hero:getSSteelStopTime() ==  1, '因为是否在修炼状态是通过getSSteelStopTime()>0来判断的，所以需要预留1，很诡异，需要重构' )
		assertEQ ( self.mm.params['start'], {(1-100)*1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
		assert(getSendMsgCnt_t() == 1)
	end;
	
	testAccEffectorOK_Percent = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		self.hero:setSSteelStopTime(100)
		TestCaseCondition:setPreCond(self.player, self.hero, {curtime=25})
		local effectres = {id=RES_EFF.ACC_STEELMAILUO,val=90,u=VAL_UNIT.PER}
		HeroSSteelAccEffector():exec(self.player, 200, effectres, {hero=self.hero})
		assert( self.hero:getSSteelStopTime() >=  1)
		assert( self.hero:getSSteelStopTime() ==  calcStopTimeByPerVal(200, .9, 200))
		local needtime = self.hero:getSSteelStopTime() - Util:getTime()
		assertEQ ( self.mm.params['start'], {needtime*1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
		assert(getSendMsgCnt_t() == 1)
	end;
});

local TestCaseHeroSkillSteelAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isCanExec = function(self)
		Util:setTimeDrt(10)
		
		local effector = HeroSkillSteelAccEffector()
		local g_effectres = {}
		local g_params = {hero = self.hero}
		local g_isValidNumberAndEffectValRt = {false}
		
		self.mm:mock(effector, 'isValidNumberAndEffectVal', g_isValidNumberAndEffectValRt)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( self.mm.walkLog == 'isValidNumberAndEffectVal' )
		assertListEQ ( self.mm.params['isValidNumberAndEffectVal'], {1, g_effectres} )

		self.mm:clear()
		self.hero:setState(HERO_STATE.EXPED)
		g_isValidNumberAndEffectValRt[1] = true
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( self.mm.walkLog == 'isValidNumberAndEffectVal,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.hero:getSkillSteel().ulResId = 0
		self.hero:getSkillSteel().ulStoptime = 0
		
		self.mm:clear()
		self.hero:setState(HERO_STATE.FREE)
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )

		self.mm:clear()
		self.hero:getSkillSteel().ulResId = 1
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )

		self.mm:clear()
		self.hero:getSkillSteel().ulResId = 1
		self.hero:getSkillSteel().ulStoptime = 10
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		self.mm:clear()
		self.hero:getSkillSteel().ulResId = 1
		self.hero:getSkillSteel().ulStoptime = 1000
		assert ( effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
	end;
	
	test_getNeedNumber = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={skillsteel={resid=0,durtime=10,stoptime=3}} })
		local effector = HeroSkillSteelAccEffector()
		local g_effectres = {val=2}
		local g_params = {hero=self.hero}
		assertAccEffectorGetNeedNumber(self.player, effector, g_effectres, g_params)
	end;
	
	testNoSteeling = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={skillsteel={resid=0,durtime=10,stoptime=0}} })
		local effectres = {id=RES_EFF.ACC_STEELSKILL,val=10}
		HeroSkillSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
		assert( getLastTimer_t().eventid ~= TIMER_EVT.SKILL_STEEL_HERO_STOP )
	end;
	
	testCurTimeArriveStoptime = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {curtime=31, hero={skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		local effectres = {id=RES_EFF.ACC_STEELSKILL,val=10}
		HeroSkillSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
		assert( getLastTimer_t().eventid ~= TIMER_EVT.SKILL_STEEL_HERO_STOP )
		
		TestCaseCondition:setPreCond(self.player, self.hero, {curtime=30, hero={skillsteel={resid=6001008,durtime=10,stoptime=30}} })
		HeroSkillSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 0)
		assert( getLastTimer_t().eventid ~= TIMER_EVT.SKILL_STEEL_HERO_STOP )
	end;
	
	testAccEffectorOK_Value = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={skillsteel={resid=6001008,durtime=10,stoptime=20}} })
		local effectres = {id=RES_EFF.ACC_STEELSKILL,val=10}
		HeroSkillSteelAccEffector():exec(self.player, 1, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 1)
		assertEQ ( self.mm.params['start'], {(10-Util:getTime())*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, self.hero:getId(), 6001008}, self.player:getTimerCaller()} )
		assert( self.hero:getSkillSteel().ulStoptime == 10 )
	end;	
	
	testAccEffectorOK_Percent = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.player, self.hero, {curtime=20, hero={skillsteel={resid=6001008,durtime=10,stoptime=2000}} })
		local effectres = {id=RES_EFF.ACC_STEELSKILL,val=40,u=VAL_UNIT.PER}
		HeroSkillSteelAccEffector():exec(self.player, 3, effectres, {hero=self.hero})
		assert(getSendMsgCnt_t() == 1)
		assertEQ ( self.mm.params['start'], {(self.hero:getSkillSteel().ulStoptime-Util:getTime())*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, self.hero:getId(), 6001008}, self.player:getTimerCaller()} )
		assert( self.hero:getSkillSteel().ulStoptime ==  calcStopTimeByPerVal(2000, 0.4, 3) )
	end;
});

local TestCaseLearnCultureAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getNeedNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=0, learningculture={id=120001, stoptime=3} })
		local effector = LearnCultureAccEffector()
		local g_effectres = {val=2}
		assertAccEffectorGetNeedNumber(self.player, effector, g_effectres, {})
	end;	
	
	testNoCultureIsLearning = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		local effectres = {id=RES_EFF.ACC_CULTURELEARN,val=1,u=0}
		LearnCultureAccEffector:exec(self.player, 1, effectres, {})
		assertEQ ( self.mm.walkLog, '' )
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testCurTimeArriveStopTime = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=31, learningculture={id=120001, stoptime=30} })
		local effectres = {id=RES_EFF.ACC_CULTURELEARN,val=1,u=0}
		LearnCultureAccEffector:exec(self.player, 1, effectres, {})
		assert( getLastTimer_t().eventid ~= TIMER_EVT.LEARN_CULTURE_STOP )
		assert(getSendMsgCnt_t() == 0)
		
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=120001, stoptime=30} })
		LearnCultureAccEffector:exec(self.player, 1, effectres, {})
		assert( getLastTimer_t().eventid ~= TIMER_EVT.LEARN_CULTURE_STOP )
		assert(getSendMsgCnt_t() == 0)
	end;
	
	testEffectOK_Value = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		TestCaseCondition:setPreCond(self.player, nil, {curtime=0, learningculture={id=120001, stoptime=30} })
		local effectres = {id=RES_EFF.ACC_CULTURELEARN,val=1,u=VAL_UNIT.VAL}
		LearnCultureAccEffector:exec(self.player, 2, effectres, {})
		assert( self.player:getCultures():getLearningCulture().stoptime == 30 - 2*1 )
		assertEQ ( self.mm.params['start'], {(30 - 2*1)*1000, {TIMER_EVT.LEARN_CULTURE_STOP, 120001}, self.player:getTimerCaller()} )
		assert( getSendMsgCnt_t() == 1 )
		
		self.mm:clear()
		LearnCultureAccEffector:exec(self.player, 100, effectres, {})
		assert( self.player:getCultures():getLearningCulture().stoptime == 0 )
		assertEQ ( self.mm.params['start'], {0, {TIMER_EVT.LEARN_CULTURE_STOP, 120001}, self.player:getTimerCaller()} )
	end;
	
	testEffectOK_Percent = function(self)
		self.mm:mock(global.getTimer(), 'start' )
		TestCaseCondition:setPreCond(self.player, nil, {curtime=30, learningculture={id=120001, stoptime=1000} })
		local effectres = {id=RES_EFF.ACC_CULTURELEARN,val=30,u=VAL_UNIT.PER}
		LearnCultureAccEffector:exec(self.player, 2, effectres, {})
		
		local stoptime = calcStopTimeByPerVal(1000, 0.3, 2)
		assert( self.player:getCultures():getLearningCulture().stoptime ==  stoptime )
		assertEQ ( self.mm.params['start'], {(stoptime - Util:getTime())*1000, {TIMER_EVT.LEARN_CULTURE_STOP, 120001}, self.player:getTimerCaller()} )
		assert( getSendMsgCnt_t() == 1 )
	end;
});

local TestCaseBuildCityDefAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = BuildCityDefAccEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local r_isValidNumberAndEffectVal = {false}
		local r_getBuildingResid = {0}
		local r_getBuildingStopTime = {0}
		self.mm:mock(self.effector, 'isValidNumberAndEffectVal', r_isValidNumberAndEffectVal)
		self.mm:mock(self.player:getCityDef(), 'getBuildingResid', r_getBuildingResid)
		self.mm:mock(self.player:getCityDef(), 'getBuildingStopTime', r_getBuildingStopTime)
		
		local p_number=1
		local p_effectres = {name='effectres'}
		local p_params = {name='params'}
		assertEQ ( self.effector:isCanExec(self.player, p_number, p_effectres, p_params), false )
		assertEQ ( self.mm.params['isValidNumberAndEffectVal'], {p_number, p_effectres} )
		
		r_isValidNumberAndEffectVal[1] = true
		assertEQ ( self.effector:isCanExec(self.player, p_number, p_effectres, p_params), false )
		
		r_getBuildingResid[1] = 150101
		assertEQ ( self.effector:isCanExec(self.player, p_number, p_effectres, p_params), false )
		
		r_getBuildingStopTime[1] = Util:getTime() + 1
		assertEQ ( self.effector:isCanExec(self.player, p_number, p_effectres, p_params), true )
	end;
	
	test_getNeedNumber = function(self)
		self.player:getCityDef():setBuildingStopTime(100)
		self.mm:mock(self.effector, 'getNeedNumberInner', {2} )
		
		local p_number=3
		local p_effectres = {name='effectres'}
		local p_params = {name='params'}
		
		assertEQ ( self.effector:getNeedNumber(self.player, p_number, p_effectres, p_params), 2 )
		assertEQ ( self.mm.params['getNeedNumberInner'], {100, p_effectres, p_number} )
	end;
	
	test_exec = function(self)
		self.player:getCityDef():setBuildingStopTime(11)
		self.player:getCityDef():setBuildingResid(150101)
	
		local r_isCanExec = {false}
		self.mm:mock(self.effector, 'isCanExec', r_isCanExec)
		self.mm:mock(self.effector, 'calcStopTime', {10})
		self.mm:mock(global.getTimer(), 'start' )
		self.mm:mock(PlayerCityDefSender, 'sendBuilding' )
		
		local p_number=3
		local p_effectres = {name='effectres'}
		local p_params = {name='params'}
		self.effector:exec(self.player, p_number, p_effectres, p_params)
		assertEQ ( self.mm.walkLog, 'isCanExec' )
		assertEQ ( self.mm.params['isCanExec'], {self.player, p_number, p_effectres, p_params} )
		
		self.mm:clear()
		r_isCanExec[1] = true
		self.effector:exec(self.player, p_number, p_effectres, p_params)
		assertEQ ( self.mm.walkLog, 'isCanExec,calcStopTime,start,sendBuilding' )
		assertEQ ( self.mm.params['calcStopTime'], {11, p_effectres, p_number} )
		assertEQ ( self.mm.params['start'], {(10 - Util:getTime())*1000, {TIMER_EVT.BUILD_CITYDEF_STOP,150101}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['sendBuilding'], {self.player} )
		assertEQ ( self.player:getCityDef():getBuildingStopTime(), 10 )
	end;
});

local TestCaseFullAccUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = FullAccUseGiftGoldEffector()
		self.effector.innerEffector = BuildAccEffector:new()
		self.effector.accType = 'build'
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_hasEnoughGold = function(self)
		local g_params = {build={ulStoptime=10}}
		
		local mm = MethodMock()
		mm:mock(self.effector, 'getNeedNumber', function(self, player, number, effectres, params)
			mm.player = player
			mm.params = params
			return 2
			end)
		
		assert ( self.effector:_hasEnoughGold(self.player, g_params) == false )
		assert ( mm.player == self.player )
		assert ( mm.params == g_params )
		
		self.player:getPkg():setGold(1)
		assert ( self.effector:_hasEnoughGold(self.player, g_params) == false )
		
		self.player:getPkg():setGiftGold(1)
		assert ( self.effector:_hasEnoughGold(self.player, g_params) == true )
		
		mm:restore()
	end;
	
	test_isCanExec = function(self)
		local g_effectres = {}
		local g_params = {}
		
		local mm = MethodMock()
		mm.rt = false
		mm:mock(self.effector.innerEffector, 'isCanExec', function(self, player, number, effectres, params)
			mm.walkLog = 'isCanExec'
			mm.player = player
			mm.number = number
			mm.effectres = effectres
			mm.params = params
			return mm.rt
			end);
			
		mm.rt2 = false
		mm:mock(self.effector, '_hasEnoughGold', function(self, player, params)
			mm.walkLog = mm.walkLog .. ',_hasEnoughGold'
			mm.player2 = player
			mm.params2 = params
			return mm.rt2
			end);
			
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( mm.walkLog == 'isCanExec' )
		assert ( mm.player == self.player )
		assert ( mm.number == 1 )
		assert ( mm.effectres == g_effectres )
		assert ( mm.params == g_params )
		
		mm.rt = true
		mm.rt2 = false
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		assert ( mm.walkLog == 'isCanExec,_hasEnoughGold' )
		
		mm.rt = true
		mm.rt2 = true
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
		
		mm:restore()
	end;
	
	test_getNeedNumber = function(self)
		local g_params = {build={ulStoptime=10}}
		
		local mm = MethodMock()
		mm:mock(AccNeedGoldCalculator, 'getNeedGold', function(self, accType, timeS)
			mm.accType = accType
			mm.timeS = timeS
			return 2
			end)
		mm:mock(self.effector, '_getDurationTimeS', function(self, player, params)
			mm.player = player
			mm.params = params
			return 10
			end)
			
		assert ( self.effector:getNeedNumber(self.player, nil, nil, g_params) == 2 )
		assert ( self.effector.accType == 'build' )
		assert ( mm.timeS == 10 )
		assert ( mm.player == self.player )
		assert ( mm.params == g_params )
		
		mm:restore()
	end;
	
	test_exec = function(self)
		local g_params = {}
		local g_effectres = {}
		local mm = MethodMock()
		mm:mock(self.effector.innerEffector, 'exec', function(self, player, number, effectres, params)
			mm.walkLog = 'exec'
			mm.player = player
			mm.number = number
			mm.effectres = effectres
			mm.params = params
			end);
			
		self.effector:exec(self.player, 100, g_effectres, g_params)
		mm:restore()
		
		assert ( mm.walkLog == 'exec' )
		assert ( mm.player == self.player )
		assert ( mm.number == 1 )
		assert ( mm.effectres == g_effectres )
		assert ( mm.params == g_params )
	end;
})

local TestCaseFullAccBuildUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = FullAccBuildUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( self.effector.innerEffector:getClass() == BuildAccEffector )
		assert ( self.effector.accType == 'build' )
	end;
	
	test_getDurationTimeS = function(self)
		Util:setTimeDrt(1)
		assert ( self.effector:_getDurationTimeS(self.player, {build={ulStoptime=10}}) == 10 -1 )
	end;
	
	test__checkTasks = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.effector:_checkTasks(self.player)
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.BUILD_UPGRADE_USEGOLD} )
	end;
})

local TestCaseFullAccCultureLearnUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = FullAccCultureLearnUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( self.effector.innerEffector:getClass() == LearnCultureAccEffector )
		assert ( self.effector.accType == 'culture' )
	end;
	
	test_getDurationTimeS = function(self)
		Util:setTimeDrt(1)
		self.player:getCultures():setLearningCulture({id=1,stoptime=10})
		assert ( self.effector:_getDurationTimeS(self.player, nil) == 10 -1 )
	end;
})

local TestCaseFullAccSkeletonSteelUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.effector = FullAccSkeletonSteelUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( self.effector.innerEffector:getClass() == HeroSSteelAccEffector )
		assert ( self.effector.accType == 'skeleton' )
	end;
	
	test_getDurationTimeS = function(self)
		Util:setTimeDrt(1)
		
		self.hero:setSSteelStopTime(10)
		assert ( self.effector:_getDurationTimeS(self.player, {hero=self.hero}) == 10 -1 )
	end;
})

local TestCaseFullAccSkillSteelUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.effector = FullAccSkillSteelUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( self.effector.innerEffector:getClass() == HeroSkillSteelAccEffector )
		assert ( self.effector.accType == 'skill' )
	end;
	
	test_getDurationTimeS = function(self)
		Util:setTimeDrt(1)
		
		self.hero:getSkillSteel().ulResId = 1
		self.hero:getSkillSteel().ulStoptime = 10
		assert ( self.effector:_getDurationTimeS(self.player, {hero=self.hero}) == 10 -1 )
	end;
})

local TestCaseFullAccCityDefBuildUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.effector = FullAccCityDefBuildUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( self.effector.innerEffector:getClass() == BuildCityDefAccEffector )
		assert ( self.effector.accType == 'citydef' )
	end;
	
	test_getDurationTimeS = function(self)
		Util:setTimeDrt(1)
		self.player:getCityDef():setBuildingStopTime(10)
		assert ( self.effector:_getDurationTimeS(self.player, nil) == 10 -1 )
	end;
})

local TestCaseFightAttrsEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0,soldier={resid=150002020,number=100}}}} )
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.stream = FightEventStream()
		self.user = HeroActor()
		self.user:setHero(self.hero)
		self.target = HeroActor()
		self.target:setHero(self.hero)		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testValidTarget = function(self)
		local fightEffector = FightEffector()
		fightEffector:initParam(self.user, self.target, self.stream, nil)
		assert ( fightEffector:isValid() == false )
		
		fightEffector:initParam(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert ( fightEffector:isValid() == true )
		
		self.user:die()
		fightEffector:initParam(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert ( fightEffector:isValid() == false )
		
		self.user.isLive = true
		self.target:die()
		fightEffector:initParam(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert ( fightEffector:isValid() == false )
		
		local wallData = WallActorData()
		wallData:setHPAndDEF(100, 100)
		local wallTarget = WallActorProxy()
		wallTarget:setWallData(wallData)
		fightEffector:initParam(self.user, wallTarget, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert ( fightEffector:isValid() == false )
		
		local cityDefTarget = CityDefActor()
		fightEffector:initParam(self.user, cityDefTarget, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert ( fightEffector:isValid() == false )
	end;
	
	testAddFullFightAttrs = function(self)
		local heroActor = HeroActor()
		heroActor:setHero(self.hero)
		
		local oldHU = heroActor:getAttrVal(ATTR.HU)
		local oldDE = heroActor:getAttrVal(ATTR.DE)
		local oldHI = heroActor:getAttrVal(ATTR.HI)
		local oldMPS = heroActor:getAttrVal(ATTR.MPS)
		local oldES = heroActor:getAttrVal(ATTR.ES)
		local oldBER = heroActor:getAttrVal(ATTR.BER)
		AddFullFightAttrsEffector:exec(heroActor, {id=RES_EFF.F_ADD_FULLATTRS, val=1, u=0})
		
		assert( heroActor:getAttrVal(ATTR.HU) == oldHU )
		assert( heroActor:getAttrVal(ATTR.DE) == oldDE )
		assert( heroActor:getAttrVal(ATTR.HI) == oldHI)
		assert( heroActor:getAttrVal(ATTR.MPS) == oldMPS)
		assert( heroActor:getAttrVal(ATTR.ES) == oldES)
		assert( heroActor:getAttrVal(ATTR.BER) == oldBER)
	end;
	
	testAddFightESAttrEffector = function(self)
		local oldES = self.target:getAttrVal(ATTR.ES)
		AddFightESAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.ES) == oldES+1 )
		assert( self.stream:getEventCnt() == 1 )
		assert( self.stream:getEvent(0).event == 'effect' )
		
		self.user:die()
		oldES = self.target:getAttrVal(ATTR.ES)
		AddFightESAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.ES) == oldES )
		
		self.user.isLive = true
		self.target:die()
		oldES = self.target:getAttrVal(ATTR.ES)
		AddFightESAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_ES, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.ES) == oldES )
	end;
	
	testCancelFightDEAttrEffector = function(self)
		self.user:die()
		CancelFightDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_JIPO, val=0, u=0})
		assert( self.target:getAttrVal(ATTR.DE) > 0 )
		
		self.user.isLive = true
		self.target:die()
		CancelFightDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_JIPO, val=0, u=0})
		assert( self.target:getAttrVal(ATTR.DE) > 0 )
		
		self.user.isLive = true
		self.target.isLive = true
		CancelFightDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_JIPO, val=0, u=0})
		assert( self.target:getAttrVal(ATTR.DE) == 0 )
	end;
	
	testXueruoDEAttrEffector = function(self)
		local oldDE = self.target:getAttrVal(ATTR.DE)
		XueruoDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_XUERUO, val=10, u=1})
		assert( self.target:getAttrVal(ATTR.DE) == oldDE*0.9 )
		
		self.user:die()
		oldDE = self.target:getAttrVal(ATTR.DE)
		XueruoDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_XUERUO, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.DE) == oldDE )
		
		self.user.isLive = true
		self.target:die()
		oldDE = self.target:getAttrVal(ATTR.DE)
		XueruoDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_XUERUO, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.DE) == oldDE )
		
		self.user.isLive = true
		self.target.isLive = true
		oldDE = self.target:getAttrVal(ATTR.DE)
		XueruoDEAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_XUERUO, val=1, u=0})
		assert( floatEQ(self.target:getAttrVal(ATTR.DE), oldDE - 1) == true )
	end;
	
	testCuiDuHPAttrEffector = function(self)
		local oldPS = self.target:getAttrVal(ATTR.HP)
		CuiDuAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_CUIDU3, val=10, u=1})
		assert( self.target:getAttrVal(ATTR.HP) == oldPS*0.9 )
		
		self.user:die()
		oldPS = self.target:getAttrVal(ATTR.HP)
		CuiDuAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_CUIDU3, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) == oldPS )
		
		self.user.isLive = true
		self.target:die()
		oldPS = self.target:getAttrVal(ATTR.HP)
		CuiDuAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_CUIDU3, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) == oldPS )
		
		self.user.isLive = true
		self.target.isLive = true
		oldPS = self.target:getAttrVal(ATTR.HP)
		CuiDuAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_CUIDU3, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) == oldPS - 1)
	end;
	
	testAddHPAttrEffector = function(self)
		self.target:setAttrVal(ATTR.HP, self.target:getAttrVal(ATTR.MHP)*0.9-1 )
		AddHPAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_SHENYI, val=10, u=1})
		assert( self.target:getAttrVal(ATTR.HP) == self.target:getAttrVal(ATTR.MHP) - 1 )
		
		self.user:die()
		AddHPAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_SHENYI, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) < self.target:getAttrVal(ATTR.MHP) )
		
		self.user.isLive = true
		self.target:die()
		AddHPAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_SHENYI, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) < self.target:getAttrVal(ATTR.MHP) )
		
		self.user.isLive = true
		self.target.isLive = true
		AddHPAttrEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_SHENYI, val=1, u=0})
		assert( self.target:getAttrVal(ATTR.HP) == self.target:getAttrVal(ATTR.MHP) )
	end;
	
	testFanJiFightEffector = function(self)
		local oldHP =  self.target:getAttrVal(ATTR.HP)
		self.user:setPos(0,0)
		self.target:setPos(0,2)
		self.user.getAttackRange = function() return 1 end
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=0})
		assert ( self.target:getAttrVal(ATTR.HP) == oldHP, 'beyond the attack range')
		
		self.user:die()
		self.user.getAttackRange = function() return 2 end
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=0})
		assert ( self.target:getAttrVal(ATTR.HP) == oldHP)
		
		self.user.isLive = true
		self.target:die()
		self.user.getAttackRange = function() return 2 end
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=0})
		assert ( self.target:getAttrVal(ATTR.HP) == oldHP )
		
		self.user.isLive = true
		self.target.isLive = true
		self.user.getAttackRange = function() return 2 end
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=0})
		assert ( self.target:getAttrVal(ATTR.HP) == oldHP-1, 'can use')
		
		self.user.isLive = true
		self.target.isLive = true
		self.user.getAttackRange = function() return 2 end
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=1})
		assert ( math.floor(self.target:getAttrVal(ATTR.HP) + 0.5) == oldHP-1, 'can use')
		
		oldHP =  self.target:getAttrVal(ATTR.HP)
		self.target:addProEffect({id=RES_EFF.F_DIXIAOFANJI, val=0, u=0, times=1})
		FanJiFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_FANJI, val=1, u=0})
		assert ( self.target:getAttrVal(ATTR.HP) == oldHP, 'the target has dixiaofanji effect')
	end;
	
	testAddHurtFightEffector = function(self)
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		AddHurtFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=10, u=0})
		assert ( self.user:getHurt() == 200 + 10 )
		
		self.user:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		AddHurtFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=10, u=1})
		assert ( self.user:getHurt() == 200 )
		
		self.user.isLive = true
		self.target:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		AddHurtFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=10, u=1})
		assert ( self.user:getHurt() == 200 )
		
		self.user.isLive = true
		self.target.isLive = true
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		AddHurtFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=10, u=1})
		assert ( self.user:getHurt() == 200 + 200*10/100 )
	end;
	
	testBiShaFightEffector = function(self)
		self.user:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		BiShaFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=100, u=0})
		assert ( self.user:getHurt() == 200)
		
		self.user.isLive = true
		self.target:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		BiShaFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=100, u=0})
		assert ( self.user:getHurt() == 200)
		
		self.user.isLive = true
		self.target.isLive = true
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		self.user:addProEffect({id=RES_EFF.F_BISHA, pro=100, skillLevel=5, val=300, u=1, times=1})
		BiShaFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=300, u=1})
		assert ( self.user:getHurt() == 200 + 200*300/100 )
		
		self.target:addProEffect({id=RES_EFF.F_XINGYUN, skillLevel=5, val=0, u=1, times=1})
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		BiShaFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_ADD_HU, val=300, u=1})
		assert ( self.user:getHurt() == 200 )
	end;
	
	testChengShangFightEffector = function(self)
		self.user:setId(1)
		self.target:setId(2)

		self.user:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		ChengShangFightEffector:exec(self.target, self.user, self.stream, {id=RES_EFF.F_CHENGSHANG, val=100, u=0})
		assert ( self.user:getHurt() == 200 )
		
		self.user.isLive = true
		self.target:die()
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		ChengShangFightEffector:exec(self.target, self.user, self.stream, {id=RES_EFF.F_CHENGSHANG, val=100, u=0})
		assert ( self.user:getHurt() == 200 )
		
		self.user.isLive = true
		self.target.isLive = true
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		ChengShangFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_CHENGSHANG, val=100, u=0})
		assert ( self.user:getHurt() == 100 )
		
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		self.stream:pushEvent({event='attack', userid=1, targetid=2, val=200})
		self.stream:pushEvent({event='berserk', userid=1, targetid=2, val=200})
		ChengShangFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_CHENGSHANG, val=20, u=1})
		assert ( self.user:getHurt() == 200 - 200*20/100 )
		assert ( self.stream:getEvent(0).val == 200 )
		assert ( self.stream:getEvent(1).val == 200 - 200*20/100 )
		
		self.user:setId(3)
		self.target:setId(4)
		self.user:setBaseHurt(200)
		self.user:setHurt(200)
		self.stream:pushEvent({event='attack', userid=3, targetid=4, val=200})
		ChengShangFightEffector:exec(self.user, self.target, self.stream, {id=RES_EFF.F_CHENGSHANG, val=20, u=1})
		assert ( self.user:getHurt() == 200 - 200*20/100 )
		assert ( self.stream:getEvent(2).val == 200 - 200*20/100 )
	end;
	
	testXiXueFightEffector = function(self)
		self.user:setAttrVal(ATTR.MHP, 1000)
		self.user:setAttrVal(ATTR.HP, 0)
		
		self.user:setBaseHurt(100)
		self.user:setHurt(200)
		XiXueFightEffector:exec(self.user, self.user, self.stream, {id=RES_EFF.F_XIXUE, val=10, u=0})
		assert ( self.user:getAttrVal(ATTR.HP) == 10 )
		
		self.user:die()
		self.user:setBaseHurt(100)
		self.user:setHurt(200)
		XiXueFightEffector:exec(self.user, self.user, self.stream, {id=RES_EFF.F_XIXUE, val=10, u=1})
		assert ( self.user:getAttrVal(ATTR.HP) == 10 )
	
		self.user.isLive = true
		self.user:setBaseHurt(100)
		self.user:setHurt(200)
		XiXueFightEffector:exec(self.user, self.user, self.stream, {id=RES_EFF.F_XIXUE, val=10, u=1})
		assert ( self.user:getAttrVal(ATTR.HP) == 30 )
	end;
	
	testHuoGongFightEffector_forOneActorTarget = function(self)
		self.user:setAttrVal(ATTR.HU, 200)
		self.target:setAttrVal(ATTR.MHP, 100)
		self.target:setAttrVal(ATTR.HP, 100)
		
		HuoGongFightEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1})
		assert ( self.target:getAttrVal(ATTR.HP) == 80 )
		
		self.user:setAttrVal(ATTR.HU, 200)
		self.target:setAttrVal(ATTR.MHP, 100)
		self.target:setAttrVal(ATTR.HP, 100)
		self.target:addProEffect({id=RES_EFF.F_ADD_FIREHURT, val=100, u=1, isbuff=false, times=1})
		HuoGongFightEffector():exec(self.user, self.target, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1})
		assert ( self.target:getAttrVal(ATTR.HP) == 60 )
	end;
	
	testHuoGongFightEffector_forMultiActorTarget = function(self)
		local user = SoldierActor()
		user:setHero(self.hero)
		local target1 = SoldierActor()
		target1:setHero(self.hero)
		local target2 = SoldierActor()
		target2:setHero(self.hero)
		local target3 = SoldierActor()
		target3:setHero(self.hero)
		
		user:setAttrVal(ATTR.HU, 200)
		target1:setAttrVal(ATTR.MHP, 1000)
		target1:setAttrVal(ATTR.HP, 1000)
		target2:setAttrVal(ATTR.MHP, 1000)
		target2:setAttrVal(ATTR.HP, 1000)
		target3:setAttrVal(ATTR.MHP, 1000)
		target3:setAttrVal(ATTR.HP, 1000)
		target3:addProEffect({id=RES_EFF.F_ADD_FIREHURT, val=100, u=1, isbuff=false, times=1})
		
		local attackersCamp = {actors={user}}
		local defendersCamp = {actors={target1,target2,target3}}
		HuoGongFightEffector():exec(user, target1, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1}, attackersCamp, defendersCamp)
		assert ( target1:getAttrVal(ATTR.HP) == 800 )
		assert ( target2:getAttrVal(ATTR.HP) == 800 )
		assert ( target3:getAttrVal(ATTR.HP) == 600 )
	end;
	
	testHuoGongFightEffector_getEnemysCamp = function(self)
		local user = SoldierActor()
		user:setHero(self.hero)
		user:setCamp(FIGHT_CAMP.ATTACK)
		local target = SoldierActor()
		target:setHero(self.hero)
		target:setCamp(FIGHT_CAMP.DEFEND)
		local attackersCamp = {actors={user}}
		local defendersCamp = {actors={target}}
		
		local hgEffector = HuoGongFightEffector()
		hgEffector:initParam(user, target, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1}, attackersCamp, defendersCamp)
		assert ( hgEffector:getEnemysCamp() == defendersCamp )
		
		hgEffector:initParam(target, user, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1}, attackersCamp, defendersCamp)
		assert ( hgEffector:getEnemysCamp() == attackersCamp )
	end;
	
	testHuoGongFightEffector_collectLiveSoldiers = function(self)
		local user = SoldierActor()
		user:setHero(self.hero)
		user:setCamp(FIGHT_CAMP.ATTACK)
		local target = SoldierActor()
		target:setHero(self.hero)
		target:setCamp(FIGHT_CAMP.DEFEND)
		local attackersCamp = {actors={user}}
		local defendersCamp = {actors={target, CityDefActor()}}
		
		local hgEffector = HuoGongFightEffector()
		hgEffector:initParam(user, target, self.stream, {id=RES_EFF.F_HUOGONG, val=10, u=1}, attackersCamp, defendersCamp)
		assert ( table.getn(hgEffector:collectLiveSoldiers(defendersCamp.actors)) == 1 )
		
		target:die()
		assert ( table.getn(hgEffector:collectLiveSoldiers(defendersCamp.actors)) == 0 )
	end;
	
	testHuoGongFightEffector__getRandNumActors = function(self)
		local hgEffector = HuoGongFightEffector()
		local actors = {}
		assert ( table.getn(hgEffector:_getRandNumActors(actors, 3)) == 0 )
		
		actors = {SoldierActor(),SoldierActor(),SoldierActor()}
		assert ( table.getn(hgEffector:_getRandNumActors(actors, 2)) == 2 )
		
		actors = {SoldierActor(),SoldierActor(),SoldierActor()}
		assert ( table.getn(hgEffector:_getRandNumActors(actors, 3)) == 3 )
		
		actors = {SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor()}
		assert ( table.getn(hgEffector:_getRandNumActors(actors, 3)) == 3 )
	end;
})

local TestCaseLearnLineUpEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testExec = function(self)
		assert ( self.player:getLineups().count == 0 )
		LearnLineUpEffector:exec(self.player, 1, {val=180002})
		assert ( self.player:getLineups().count == 1 )
		assert ( selectSendMsgCnt_t('has@lineups:') == 1 , 'send lineup to client' )
	end;
})

local TestCaseAddRoleAttrEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getNeedNumber = function(self)
		self.player:setAttrVal(ATTR.PS, 20)
		self.player:setAttrVal(ATTR.MPS, 100)
		local effectres = {val=9, val2=ATTR.PS, val3=ATTR.MPS}
		local number = 2
		assertEQ ( AddRoleAttrEffector():getNeedNumber(self.player, number, effectres), 2 )
		number = 10
		assertEQ ( AddRoleAttrEffector():getNeedNumber(self.player, number, effectres), 9 )
		
		self.player:setAttrVal(ATTR.PP, 20)
		local effectres = {val=9, val2=ATTR.PP, val3=ATTR.NONE}
		local number = 2
		assertEQ ( AddRoleAttrEffector():getNeedNumber(self.player, number, effectres), 2 )
		number = 10
		assertEQ ( AddRoleAttrEffector():getNeedNumber(self.player, number, effectres), 10 )
	end;
	
	test_isCanExec = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.player:setAttrVal(ATTR.PS, 20)
		self.player:setAttrVal(ATTR.MPS, 100)
		local effectres = {val=0, val2=ATTR.PS, val3=ATTR.MPS}
		local number = 10
		assertEQ ( AddRoleAttrEffector():isCanExec(self.player, number, effectres), false )
		assertEQ ( self.mm.walkLog, '' )
		
		effectres = {val=1, val2=ATTR.PS, val3=ATTR.MPS}
		number = 0
		assertEQ ( AddRoleAttrEffector():isCanExec(self.player, number, effectres), false )
		assertEQ ( self.mm.walkLog, '' )
		
		effectres = {val=1, val2=ATTR.PS, val3=ATTR.MPS}
		number = 10
		assertEQ ( AddRoleAttrEffector():isCanExec(self.player, number, effectres), true )
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:setAttrVal(ATTR.PS, 100)
		self.player:setAttrVal(ATTR.MPS, 100)
		assertEQ ( AddRoleAttrEffector():isCanExec(self.player, number, effectres), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100102, '"@attrid' .. ATTR.PS .. '"'} )
		
		self.mm:clear()
		effectres = {val=1, val2=ATTR.PP, val3=ATTR.NONE}
		number = 10
		assertEQ ( AddRoleAttrEffector():isCanExec(self.player, number, effectres), true )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_exec = function(self)
		self.mm:mock(RoleAttrSender, 'sendAttr')
		self.player:setAttrVal(ATTR.PS, 20)
		self.player:setAttrVal(ATTR.MPS, 100)
		local effectres = {val=9, val2=ATTR.PS, val3=ATTR.MPS}
		local number = 2
		AddRoleAttrEffector():exec(self.player, number, effectres)
		assertEQ ( self.player:getAttrVal(ATTR.PS), 20 + 2*9 )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.player:getAttr(ATTR.PS)} )
		
		number = 10
		AddRoleAttrEffector():exec(self.player, number, effectres)
		assertEQ ( self.player:getAttrVal(ATTR.PS), 100 )
		
		self.player:setAttrVal(ATTR.PP, 10)
		effectres = {val=9, val2=ATTR.PP, val3=ATTR.NONE}
		local number = 2
		AddRoleAttrEffector():exec(self.player, number, effectres)
		assertEQ ( self.player:getAttrVal(ATTR.PP), 10 + 2*9 )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.player:getAttr(ATTR.PP)} )
	end;
})

local TestCaseHeroAttrEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{level=11,state=1,soldier={resid=150001010,number=10}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanAddVal_zeroVal = function(self)
		assert ( HeroAttrEffector():_isCanAddVal(self.player, 0, {val=1}, nil, nil, nil) == false )
		assert ( HeroAttrEffector():_isCanAddVal(self.player, 1, {val=0}, nil, nil, nil) == false )
	end;
	
	test_isCanAddVal_arrivedMaxVal = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, 100)
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		assert ( HeroAttrEffector():_isCanAddVal(self.player, 1, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == false )
	end;
	
	test_isCanAddVal = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, 90)
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		assert ( HeroAttrEffector():_isCanAddVal(self.player, 1, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == true )
	end;
	
	test_getNeedNumber = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, 90)
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		assert ( HeroAttrEffector():_getNeedNumber(self.player, 1, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == 1 )
		assert ( HeroAttrEffector():_getNeedNumber(self.player, 5, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == 5 )
		assert ( HeroAttrEffector():_getNeedNumber(self.player, 10, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == 10 )
		assert ( HeroAttrEffector():_getNeedNumber(self.player, 11, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == 10 )
		assert ( HeroAttrEffector():_getNeedNumber(self.player, 5, {val=3}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH) == 4, ' math.ceil(3.33) == 4 ' )
	end;
	
	test_addVal = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, 90)
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		
		HeroAttrEffector():_addVal(self.player, 1, {val=1}, {hero=self.hero}, ATTR.HEALTH, ATTR.MHEALTH)
		
		assert ( selectSendMsgCnt_t('has@91') == 1 )
		assert ( self.hero:getAttrVal(ATTR.HEALTH) == 91 )
	end;
})

local TestCaseHeroLearnSkillEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{level=11,state=1,soldier={resid=150001010,number=10}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local effectres={}
		local params={hero=self.hero}
		
		local effector = HeroLearnSkillEffector()
		effector.isValid = function() end
		
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.hero:setState(HERO_STATE.EXPED)
		assert ( effector:isCanExec(self.player, 1, effectres, params) == false )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.hero:setState(HERO_STATE.FREE)
		assert ( effector:isCanExec(self.player, 0, effectres, params) == false )
		assert ( effector:isCanExec(self.player, 2, effectres, params) == false )
		
		local mm = MethodMock()
		mm.ret_isValid = false
		mm:mock(effector, 'getParam', function(self, player, effectres, params)
			mm.player = player
			mm.effectres = effectres
			mm.params = params
			end)
		mm:mock(effector, 'isValid', function(self)
			return mm.ret_isValid
			end)
		assert ( effector:isCanExec(self.player, 1, effectres, params) == false )
		assert ( mm.player == self.player )
		assert ( mm.effectres == effectres )
		assert ( mm.params == params )
		
		mm.ret_isValid = true
		assert ( effector:isCanExec(self.player, 1, effectres, params) == true )
		mm:restore()
	end;
	
	test_getNeedNumber = function(self)
		local effector = HeroLearnSkillEffector()
		assert ( effector:getNeedNumber() == 1 )
	end;
	
	test_exec = function(self)
		local effectres={}
		local params={}
		local effector = HeroLearnSkillEffector()

		local mm = MethodMock()
		mm.ret_isCanExec = false
		mm:mock(effector, 'isCanExec', function(self, player, number, effectres, params)
			mm.player = player
			mm.number = number
			mm.effectres = effectres
			mm.params = params
			return mm.ret_isCanExec
			end)
			
		mm:mock(effector, 'addSkill', function(self)
			mm.walkLog = mm.walkLog .. 'addSkill'
			end)
			
		mm:mock(effector, 'sendMsg', function(self)
			mm.walkLog = mm.walkLog .. ',sendMsg'
			end)
		
		mm.ret_isCanExec = false
		mm.walkLog = ''
		effector:exec(self.player, 1, effectres, params)
		assert ( mm.walkLog == '' )
		assert ( mm.player == self.player )
		assert ( mm.number == 1 )
		assert ( mm.effectres == effectres )
		assert ( mm.params == params )
		
		mm.ret_isCanExec = true
		mm.walkLog = ''
		effector:exec(self.player, 1, effectres, params)
		assert ( mm.walkLog == 'addSkill,sendMsg' )
		mm:restore()
	end;
})

local TestCaseAccelerateEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{level=11,state=1,soldier={resid=150001010,number=10}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isValidNumberAndEffectVal = function(self)
		assert ( AccelerateEffector():isValidNumberAndEffectVal(0, {val=1}) == false )
		assert ( AccelerateEffector():isValidNumberAndEffectVal(1, {val=0}) == false )
		assert ( AccelerateEffector():isValidNumberAndEffectVal(1, {val=1}) == true )
	end;
	
	test_getNeedNumberByPerVal = function(self)
		Util:setTimeDrt(1)
		assert ( AccelerateEffector():getNeedNumberByPerVal(5, 0.5, 1) == 1 )
		assert ( AccelerateEffector():getNeedNumberByPerVal(9, 0.5, 2) == 2 )
		assert ( AccelerateEffector():getNeedNumberByPerVal(9, 0.5, 3) == 2 )
	end;
	
	test_getNeedNumberByVal = function(self)
		Util:setTimeDrt(1)
		assert ( AccelerateEffector():getNeedNumberByVal(4, 1, 1) == 1 )
		assert ( AccelerateEffector():getNeedNumberByVal(4, 2, 1) == 1 )
		assert ( AccelerateEffector():getNeedNumberByVal(4, 2, 2) == 2, ' math.ceil( (4-1)/2 ) == 2 ' )
		assert ( AccelerateEffector():getNeedNumberByVal(4, 2, 3) == 2 )
	end;
	
	test_getNeedNumberInner_UnitPer = function(self)
		local effector = AccelerateEffector()
		local mm = MethodMock()
		mm:mock(effector, 'getNeedNumberByPerVal', function(self, stoptime, per, number)
			mm.stoptime = stoptime
			mm.per = per
			mm.number = number
			end)
		effector:getNeedNumberInner(1, {u=VAL_UNIT.PER, val=50}, 3)
		mm:restore()
		assert ( mm.stoptime == 1 )
		assert ( mm.per == 50/100 )
		assert ( mm.number == 3 )
	end;
	
	test_getNeedNumberInner_UnitVal = function(self)
		local effector = AccelerateEffector()
		local mm = MethodMock()
		mm:mock(effector, 'getNeedNumberByVal', function(self, stoptime, val, number)
			mm.stoptime = stoptime
			mm.val = val
			mm.number = number
			end)
		effector:getNeedNumberInner(1, {u=VAL_UNIT.VAL, val=2}, 3)
		mm:restore()
		assert ( mm.stoptime == 1 )
		assert ( mm.val == 2 )
		assert ( mm.number == 3 )
	end;
})

local TestCaseAddHeroInnerForceEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{level=11,state=1,soldier={resid=150001010,number=10}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.hero:setState(1)
		self.hero:setAttrVal(ATTR.IF, 1)
		self.hero:setAttrVal(ATTR.MIF, 10)
		assert ( AddHeroInnerForceEffector():isCanExec(self.player, 1, {val=1}, {hero=self.hero}) == false )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
		
		self.hero:setState(0)
		self.hero:setAttrVal(ATTR.IF, 10)
		self.hero:setAttrVal(ATTR.MIF, 10)
		assert ( AddHeroInnerForceEffector():isCanExec(self.player, 1, {val=1}, {hero=self.hero}) == false )
		
		self.hero:setState(0)
		self.hero:setAttrVal(ATTR.IF, 1)
		self.hero:setAttrVal(ATTR.MIF, 10)
		assert ( AddHeroInnerForceEffector():isCanExec(self.player, 1, {val=0}, {hero=self.hero}) == false )
		
		self.hero:setState(0)
		self.hero:setAttrVal(ATTR.IF, 1)
		self.hero:setAttrVal(ATTR.MIF, 10)
		assert ( AddHeroInnerForceEffector():isCanExec(self.player, 0, {val=1}, {hero=self.hero}) == false )
		
		self.hero:setState(0)
		self.hero:setAttrVal(ATTR.IF, 1)
		self.hero:setAttrVal(ATTR.MIF, 10)
		assert ( AddHeroInnerForceEffector():isCanExec(self.player, 1, {val=1}, {hero=self.hero}) == true )
	end;
	
	test_getNeedNumber = function(self)
		self.hero:setAttrVal(ATTR.IF, 0)
		self.hero:setAttrVal(ATTR.MIF, 10)
		
		local effector = AddHeroInnerForceEffector()
		
		local _res_str_if_get_vals = res_str_if_get_vals
		res_str_if_get_vals = {{per=100, val=3}}
		assert ( effector:getNeedNumber(self.player, 1, {val=1}, {hero=self.hero}) == 1 )
		assert ( table.getn(effector.adds) == 1 )
		assert ( effector.adds[1] == 3 )
		assert ( effector.totalAddVal == 3 )
		
		assert ( effector:getNeedNumber(self.player, 3, {val=1}, {hero=self.hero}) == 3 )
		assert ( table.getn(effector.adds) == 3 )
		assert ( effector.adds[1] == 3 )
		assert ( effector.adds[2] == 3 )
		assert ( effector.adds[3] == 3 )
		assert ( effector.totalAddVal == 9 )
		
		assert ( effector:getNeedNumber(self.player, 4, {val=1}, {hero=self.hero}) == 4 )
		assert ( table.getn(effector.adds) == 4 )
		assert ( effector.adds[1] == 3 )
		assert ( effector.adds[2] == 3 )
		assert ( effector.adds[3] == 3 )
		assert ( effector.adds[4] == 1 )
		assert ( effector.totalAddVal == 10 )
		
		assert ( effector:getNeedNumber(self.player, 5, {val=1}, {hero=self.hero}) == 4, 'four items arrived max inner force' )
		
		res_str_if_get_vals = _res_str_if_get_vals
	end;
	
	test_exec = function(self)
		local effector = AddHeroInnerForceEffector()
		
		self.hero:setAttrVal(ATTR.IF, 0)
		self.hero:setAttrVal(ATTR.MIF, 10)
		
		local mm = MethodMock()
		mm.walkLog = ''
		mm:mock(effector, '_addVal', function(self, player, number, effectres, params, curAttr, maxAttr)
			mm.walkLog = '_addVal'
			mm.player1 = player
			mm.number = number
			mm.effectres = effectres
			mm.params = params
			mm.curAttr = curAttr
			mm.maxAttr = maxAttr
			end)
		mm:mock(HeroAttrSender, 'sendStrIFResult', function(self, player, hero, adds)
			mm.walkLog = mm.walkLog .. ',sendStrIFResult'
			mm.player2 = player
			mm.hero = hero
			mm.adds = adds
			end)
		mm:mock(nil, 'res_get_str_if_need_itemnum', function(skeletonLevel)
			mm.skeletonLevel = skeletonLevel
			return 2
			end)
			
		local itemNumber = 4
		effector:exec(self.player, itemNumber, {val=1}, {hero=self.hero})
		assert ( mm.walkLog == '' )
		
		effector.totalAddVal = 10
		itemNumber = 4
		effector:exec(self.player, itemNumber, {val=1}, {hero=self.hero})
		assert ( mm.walkLog == '' )
		
		effector.totalAddVal = 10
		effector.adds = {3,3,3,1}
		itemNumber = 4
		effector:exec(self.player, itemNumber, {val=1}, {hero=self.hero})
		assert ( mm.walkLog == '' )
		
		effector.totalAddVal = 10
		effector.adds = {3,3,3,1}
		itemNumber = 4*2 -- times * oneTimeNeedNumber
		effector:exec(self.player, itemNumber, {val=1}, {hero=self.hero})
		assert ( mm.walkLog == '_addVal,sendStrIFResult' )
		assert ( mm.player1 == self.player )
		assert ( mm.number == 1 )
		assert ( mm.effectres.val == effector.totalAddVal )
		assert ( mm.params.hero == self.hero )
		assert ( mm.curAttr == ATTR.IF )
		assert ( mm.maxAttr == ATTR.MIF )
		
		assert ( mm.player2 == self.player )
		assert ( mm.hero == self.hero )
		assert ( mm.adds == effector.adds )
		assert ( mm.skeletonLevel == self.hero:getSkeletonLevel() )
		
		mm:restore()
	end;
})

local TestCaseAccNeedGoldCalculator = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.calc = AccNeedGoldCalculator
		res_acc_needgolds = {{id=1,type='build',phases={{timeS=600,gold=3},{timeS=3600,gold=12},{timeS=21600,gold=40},{timeS=86400,gold=120}}}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_getNeedGold = function(self)
		assert ( self.calc:getNeedGold('build', 0) == 0 )
		assert ( self.calc:getNeedGold('build', 1) == 1 )
		assert ( self.calc:getNeedGold('build', 500) == 3 )
		assert ( self.calc:getNeedGold('build', 600) == 4 )
		assert ( self.calc:getNeedGold('build', 601) == 4 )
		assert ( self.calc:getNeedGold('build', 3599) == 12 )
		assert ( self.calc:getNeedGold('build', 86400) == 121 )
		assert ( self.calc:getNeedGold('build', 86400*2) == 241 )
		
		res_acc_needgolds = {{id=1,type='build',phases={{timeS=600,gold=3},{timeS=3600,gold=12},{timeS=21600,gold=40},{timeS=86400,gold=120},{timeS=0,gold=0}}}}
		assert ( self.calc:getNeedGold('build', 86400*2) == 241 )
	end;
})

local TestCaseAddThreeBuildingPosEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_exec = function(self)
		local stateContainer = self.player:getStateContainer()
		
		self.mm:mock(stateContainer, 'appendState')
		self.mm:mock(self.player:getCitys(), 'handleAutoBuilds')
		
		AddThreeBuildingPosEffector():exec(self.player, 2, {val=3}, nil)
		
		assert ( self.mm.walkLog == 'appendState,handleAutoBuilds' )
		assert ( self.mm.params['appendState'][1].type == EFFECT_TYPE.PERDURE )
		assert ( self.mm.params['appendState'][1].duration == 6 )
		assert ( self.mm.params['appendState'][1].effect.id == RES_EFF.ADD_THREE_BUILDINGPOS )
		assert ( self.mm.params['appendState'][1].effect.val== 3 )
		assert ( self.mm.params['appendState'][1].effect.unit== 0 )
		
		assert ( self.mm.params['appendState'][2].type == 0 )
		assert ( self.mm.params['appendState'][2].id == 0 )
		assert ( self.mm.params['appendState'][2].skillId == 0 )
	end;
})

local TestCaseAddTowerRecoverSoldierEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local r_isCanAppend = {false}
		self.mm:mock(self.player:getStateContainer(), 'isCanAppend', r_isCanAppend)
		assertEQ ( AddTowerRecoverSoldierEffector():isCanExec(self.player), false )
		assertEQ ( self.mm.params['isCanAppend'], {RES_EFF.TOWER_RECOVER_SOLDIER} )
		
		r_isCanAppend[1] = true
		assertEQ ( AddTowerRecoverSoldierEffector():isCanExec(self.player), true )
	end;
	
	test_exec = function(self)
		local stateContainer = self.player:getStateContainer()
		
		local mm = MMock()
		mm:mock(stateContainer, 'appendState')
		
		AddTowerRecoverSoldierEffector():exec(self.player, 1, {val=10, val2=20*3600}, nil)
		mm:restore()
		
		assert ( mm.walkLog == 'appendState' )
		assert ( mm.params['appendState'][1].type == EFFECT_TYPE.PERDURE )
		assert ( mm.params['appendState'][1].duration == 20*3600 )
		assert ( mm.params['appendState'][1].effect.id == RES_EFF.TOWER_RECOVER_SOLDIER )
		assert ( mm.params['appendState'][1].effect.val== 10 )
		assert ( mm.params['appendState'][1].effect.unit== 1 )
		
		assert ( mm.params['appendState'][2].type == 0 )
		assert ( mm.params['appendState'][2].id == 0 )
		assert ( mm.params['appendState'][2].skillId == 0 )
	end;
})

local TestCaseAddTowerRecoverSoldierByActEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local r_isCanAppend = {false}
		self.mm:mock(self.player:getStateContainer(), 'isCanAppend', r_isCanAppend)
		assertEQ ( AddTowerRecoverSoldierByActEffector():isCanExec(self.player), false )
		assertEQ ( self.mm.params['isCanAppend'], {RES_EFF.TOWER_RECOVER_SOLDIER_BYACT} )
		
		r_isCanAppend[1] = true
		assertEQ ( AddTowerRecoverSoldierByActEffector():isCanExec(self.player), true )
	end;
	
	test_exec = function(self)
		local stateContainer = self.player:getStateContainer()
		
		local mm = MMock()
		mm:mock(stateContainer, 'appendState')
		
		AddTowerRecoverSoldierByActEffector():exec(self.player, 1, {val=10, val2=10*3600}, nil)
		mm:restore()
		
		assert ( mm.walkLog == 'appendState' )
		assert ( mm.params['appendState'][1].type == EFFECT_TYPE.PERDURE )
		assert ( mm.params['appendState'][1].duration == 10*3600 )
		assert ( mm.params['appendState'][1].effect.id == RES_EFF.TOWER_RECOVER_SOLDIER_BYACT )
		assert ( mm.params['appendState'][1].effect.val== 10 )
		assert ( mm.params['appendState'][1].effect.unit== 1 )
		
		assert ( mm.params['appendState'][2].type == 0 )
		assert ( mm.params['appendState'][2].id == 0 )
		assert ( mm.params['appendState'][2].skillId == 0 )

	end;
})

local TestCaseRestoreHurtBuildValEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = RestoreHurtBuildValEffector:new()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		assertEQ ( self.effector:isCanExec(self.player, 0, {val=1}, {}), false )
		assertEQ ( self.effector:isCanExec(self.player, 1, {val=0}, {}), false )
		assertEQ ( self.effector:isCanExec(self.player, 2, {val=1}, {}), true )
	end;
	
	test_getNeedNumber = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.player:getCityRes():setBuildVal(1000)
		self.player:getCityRes():setBuildHurtVal(0)
		assertEQ ( self.effector:getNeedNumber(self.player, 1, {val=100}, {}), 0 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100167, ''} )
		
		self.mm:clear()
		self.player:getCityRes():setBuildHurtVal(90)
		assertEQ ( self.effector:getNeedNumber(self.player, 1, {val=100}, {}), 1 )
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.effector:getNeedNumber(self.player, 2, {val=100}, {}), 1 )
		
		self.player:getCityRes():setBuildHurtVal(920)
		assertEQ ( self.effector:getNeedNumber(self.player, 8, {val=100}, {}), 8 )
		assertEQ ( self.effector:getNeedNumber(self.player, 11, {val=100}, {}), 10 )
	end;
	
	test_exec = function(self)
		self.mm:mock(CityBuildValSender, 'send')
		self.player:getCityRes():setBuildVal(1000)
		self.player:getCityRes():setBuildHurtVal(100)
		assertEQ (self.player:getCityRes():getBuildHurtVal(), 100)
		self.effector:exec(self.player, 2, {val=3}, {})
		assertEQ (self.player:getCityRes():getBuildHurtVal(), 100 - 2*3)
		
		self.effector:exec(self.player, 3, {val=40}, {})
		assertEQ (self.player:getCityRes():getBuildHurtVal(), 0)
		assertEQ (self.mm.params['send'], {self.player, {'hurtval'}} )
	end;
})

local TestCaseSendWorldBlessEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		assert ( SendWorldBlessEffector():isCanExec(self.player, 1, {val=1}, {netcmd={tmsg=''}}) == false, 'empty string' )
		
		local res_max_bless_string_len_ = res_max_bless_string_len
		res_max_bless_string_len = 9
		assert ( SendWorldBlessEffector():isCanExec(self.player, 1, {val=1}, {netcmd={tmsg='aaaaaaaaaa'}}) == false, 'beyond max len' )
		res_max_bless_string_len = res_max_bless_string_len_
		
		assert ( self.mm.walkLog == '' )
		assert ( SendWorldBlessEffector():isCanExec(self.player, 1, {val=1}, {netcmd={tmsg='aaaaaafuck'}}) == false, 'has dirty word' )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100041, ''} )
		
		assert ( SendWorldBlessEffector():isCanExec(self.player, 1, {val=1}, {netcmd={tmsg='aaaaaa'}}) == true )
	end;
	
	test_getNeedNumber = function(self)
		assert ( SendWorldBlessEffector():getNeedNumber() == 1 )
	end;
	
	test_exec = function(self)
		self.player:setRoleName('role')
		self.mm:mock( app:getPlayerMgr(), 'sendWorldBless' )
		SendWorldBlessEffector():exec(self.player, 1, {val=1}, {netcmd={tmsg='a'}})
		assert ( self.mm.walkLog == 'sendWorldBless' )
		assertListEQ ( self.mm.params['sendWorldBless'], {1, 'role: a'} )
	end;
})

local HelperInitEffectorDrops = function(effector)
	effector.drops = {}
	local drop1 = DropItem()
	drop1:handle(7500001)
	local drop2 = DropItem()
	drop2:handle(7500001)
	table.insert(effector.drops, drop1:getDrops())
	table.insert(effector.drops, drop2:getDrops())
	Util:dictCopy(effector.drops[1], {roleExp=1,heroExp=2,rolePs=10,roleMoney=11} )
	Util:dictCopy(effector.drops[2], {roleExp=3,heroExp=4,rolePs=20,roleMoney=21} )
end;

local TestCaseDropItemEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = DropItemEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local g_getDrops = {items={}}
		local g_createRawItems = {{}}
		self.mm:mock(self.effector.dropItem, 'handle')
		self.mm:mock(self.effector.dropItem, 'getDrops', {g_getDrops})
		self.mm:mock(self.effector.dropItem, 'createRawItems', {g_createRawItems})
		self.mm:mock(self.player:getPkg(), 'preAddItems', {false})
		
		assert ( self.effector:isCanExec(self.player, 2, {val=1001}, nil) == false )
		assert ( self.mm.walkLog == 'handle,getDrops,createRawItems,handle,getDrops,createRawItems,preAddItems,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['handle.1'], {1001} )
		assertListEQ ( self.mm.params['handle.2'], {1001} )
		assertListEQ ( self.mm.params['createRawItems.1'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['createRawItems.2'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['preAddItems'], {self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100129, ''} )
		
		assert ( self.effector.dropRawItems[1]  == g_createRawItems[1] )
		assert ( self.effector.dropRawItems[2]  == g_createRawItems[1] )
		assert ( self.effector.drops[1]  == g_getDrops )
		assert ( self.effector.drops[2]  == g_getDrops )
	end;
	
	test_isCanExec_twoDropId = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local g_getDrops = {items={}}
		local g_createRawItems = {{}}
		self.mm:mock(self.effector.dropItem, 'handle')
		self.mm:mock(self.effector.dropItem, 'getDrops', {g_getDrops})
		self.mm:mock(self.effector.dropItem, 'createRawItems', {g_createRawItems})
		self.mm:mock(self.player:getPkg(), 'preAddItems', {false})
		
		assert ( self.effector:isCanExec(self.player, 1, {val=1001,val2=1002,val3=0}, nil) == false )
		assert ( self.mm.walkLog == 'handle,getDrops,createRawItems,handle,getDrops,createRawItems,preAddItems,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['handle.1'], {1001} )
		assertListEQ ( self.mm.params['handle.2'], {1002} )
		assertListEQ ( self.mm.params['createRawItems.1'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['createRawItems.2'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['preAddItems'], {self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100129, ''} )
		
		assert ( self.effector.dropRawItems[1]  == g_createRawItems[1] )
		assert ( self.effector.dropRawItems[2]  == g_createRawItems[1] )
		assert ( self.effector.drops[1]  == g_getDrops )
		assert ( self.effector.drops[2]  == g_getDrops )
	end;
	
	test_isCanExec_threeDropId = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local g_getDrops = {items={}}
		local g_createRawItems = {{}}
		self.mm:mock(self.effector.dropItem, 'handle')
		self.mm:mock(self.effector.dropItem, 'getDrops', {g_getDrops})
		self.mm:mock(self.effector.dropItem, 'createRawItems', {g_createRawItems})
		self.mm:mock(self.player:getPkg(), 'preAddItems', {false})
		
		assert ( self.effector:isCanExec(self.player, 1, {val=1001,val2=1002,val3=1003}, nil) == false )
		assert ( self.mm.walkLog == 'handle,getDrops,createRawItems,handle,getDrops,createRawItems,handle,getDrops,createRawItems,preAddItems,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['handle.1'], {1001} )
		assertListEQ ( self.mm.params['handle.2'], {1002} )
		assertListEQ ( self.mm.params['handle.3'], {1003} )
		assertListEQ ( self.mm.params['createRawItems.1'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['createRawItems.2'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['createRawItems.3'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['preAddItems'], {self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100129, ''} )
		
		assert ( self.effector.dropRawItems[1]  == g_createRawItems[1] )
		assert ( self.effector.dropRawItems[2]  == g_createRawItems[1] )
		assert ( self.effector.dropRawItems[3]  == g_createRawItems[1] )
		assert ( self.effector.drops[1]  == g_getDrops )
		assert ( self.effector.drops[2]  == g_getDrops )
		assert ( self.effector.drops[3]  == g_getDrops )
	end;
	
	test_exec = function(self)
		HelperInitEffectorDrops(self.effector)
		self.effector.dropRawItems = {}
		
		self.mm:mock(self.player:getPkg(), 'addItems')
		self.mm:mock(self.player, 'addExp')
		self.mm:mock(self.player, 'addXPSAttr')
		
		local oldPs =  self.player:getAttrVal(ATTR.PS) 
		self.effector:exec(self.player)
		
		assert ( self.mm.walkLog == 'addItems,addExp,addXPSAttr,addExp,addXPSAttr' )
		assertListEQ ( self.mm.params['addItems'], {self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['addExp.1'], {1} )
		assertListEQ ( self.mm.params['addXPSAttr.1'], {2, false} )
		assertListEQ ( self.mm.params['addExp.2'], {3} )
		assertListEQ ( self.mm.params['addXPSAttr.2'], {4, false} )
		assertListEQ ( self.player:getCityRes():getMoney(), 11 + 21 )
		assertListEQ ( self.player:getAttrVal(ATTR.PS), oldPs + 10 + 20 )
	end;
	
	test_dropXPS = function(self)
		self.player:setLevel(10)
		assertEQ (self.player:getAttr(ATTR.XPS).ulVal, 100 )
		local effect = {val3=0,val2=0,id=RES_EFF.DROPITEM,val=7500358}
		local effector = EffectorMgr:getEffector(effect)
		effector:isCanExec(self.player, 10000, effect)
		effector:exec(self.player, 10000, effect)
		assertEQ (self.player:getAttr(ATTR.XPS).ulVal, self.player:getAttr(ATTR.MXPS).ulVal )
	end;
})

local TestCasePassivityDropItemEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = PassivityDropItemEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local g_getDrops = {items={}}
		local g_createRawItems = {{}}
		self.mm:mock(self.effector.dropItem, 'handle')
		self.mm:mock(self.effector.dropItem, 'getDrops', {g_getDrops})
		self.mm:mock(self.effector.dropItem, 'createRawItems', {g_createRawItems})
		
		assert ( self.effector:isCanExec(self.player, 2, {val=1001}, nil) == true )
		assert ( self.mm.walkLog == 'handle,getDrops,createRawItems,handle,getDrops,createRawItems' )
		assertListEQ ( self.mm.params['handle.1'], {1001} )
		assertListEQ ( self.mm.params['handle.2'], {1001} )
		assertListEQ ( self.mm.params['createRawItems.1'], {g_getDrops.items} )
		assertListEQ ( self.mm.params['createRawItems.2'], {g_getDrops.items} )
		
		assert ( self.effector.dropRawItems[1]  == g_createRawItems[1] )
		assert ( self.effector.dropRawItems[2]  == g_createRawItems[1] )
		assert ( self.effector.drops[1]  == g_getDrops )
		assert ( self.effector.drops[2]  == g_getDrops )
	end;
	
	test_exec = function(self)
		HelperInitEffectorDrops(self.effector)
		self.effector.dropRawItems = {}
		
		local r_addItems = {false}
		self.mm:mock(self.player:getPkg(), 'addItems', r_addItems)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(MailSender, 'sendBriefMail')
		self.mm:mock(self.player, 'addExp')
		self.mm:mock(self.player, 'addXPSAttr')
		
		local oldPs =  self.player:getAttrVal(ATTR.PS) 
		self.effector:exec(self.player)
		
		assert ( self.mm.walkLog == 'addItems,addSysMail,sendBriefMail,addExp,addXPSAttr,addExp,addXPSAttr' )
		assertListEQ ( self.mm.params['addItems'], {self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, self.effector.dropRawItems} )
		assertListEQ ( self.mm.params['sendBriefMail'], {self.player, {name='mail'}} )
		assertListEQ ( self.mm.params['addExp.1'], {1} )
		assertListEQ ( self.mm.params['addXPSAttr.1'], {2, false} )
		assertListEQ ( self.mm.params['addExp.2'], {3} )
		assertListEQ ( self.mm.params['addXPSAttr.2'], {4, false} )
		assertListEQ ( self.player:getCityRes():getMoney(), 11 + 21 )
		assertListEQ ( self.player:getAttrVal(ATTR.PS), oldPs + 10 + 20 )
	end;
})

local TestCaseMoveCityUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.moveUtil = MoveCityUtil()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;

	test_isHerosValidState = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{state=HERO_STATE.FREE,soldier={resid=150001010,number=10}} } })
		local hero = self.player:getHeroMgr():getHeroByIdx(0)
		
		self.mm:mock( WUtil, 'sendWarningMsgArgs' )
		assertEQ ( self.moveUtil:isHerosStateCanMove(self.player), true )
		assertEQ ( self.mm.walkLog, '' )
		
		hero:setState(HERO_STATE.STEEL)
		assertEQ ( self.moveUtil:isHerosStateCanMove(self.player), true )
		assertEQ ( self.mm.walkLog, '' )
		
		hero:setState(HERO_STATE.DISPATCHFIELD)
		assertEQ ( self.moveUtil:isHerosStateCanMove(self.player), true )
		assertEQ ( self.mm.walkLog, '' )
		
		hero:setState(HERO_STATE.EXPED)
		assertEQ ( self.moveUtil:isHerosStateCanMove(self.player), false )
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100062, ''} )
	end;	
	
	test_moveToPos = function(self)
		local idx = 0
		self.mm:mock(app:getCityMgr(), 'getGridByPos', nil, function()
			idx = idx + 1
			if idx == 1 then return 'srcGrid' 
			else return 'desGrid' end
		end)
		self.mm:mock( RankMgrC, 'StartChangeRolePos' )
		self.mm:mock(app:getCityMgr(), 'copyGrid')
		self.mm:mock( app:getCityMgr(), 'freeCityPos' )
		self.mm:mock( self.player, 'setCityPos' )
		self.mm:mock( app:getCityMgr(), 'initPlayerGrid' )		
		self.mm:mock( self.player, 'refreshCityGrid' )		
		self.mm:mock( RankMgrC, 'EndChangeRolePos' )
		self.mm:mock( self.moveUtil, '_returnEnemyArmys' )
		self.mm:mock( self.moveUtil, '_returnAllianceArmys' )
		self.mm:mock( RoleBaseSender, 'send' )
		self.mm:mock( WUtil, 'sendSuccMsgArgs' )
		
		local p_pos = {x=1, y=2}
		self.moveUtil:moveToPos(self.player, p_pos)
		assertEQ ( self.mm.walkLog, 'StartChangeRolePos,getGridByPos,getGridByPos,copyGrid,freeCityPos,setCityPos,getGridByPos,refreshCityGrid,EndChangeRolePos,_returnEnemyArmys,_returnAllianceArmys,send,sendSuccMsgArgs' )
		assertEQ ( self.mm.params['StartChangeRolePos'], {self.player:getRoleId()} )
		assertEQ ( self.mm.params['getGridByPos.1'], {self.player:getCityPos()} )
		assertEQ ( self.mm.params['getGridByPos.2'], {p_pos} )
		assertEQ ( self.mm.params['copyGrid'], {'desGrid', 'srcGrid'} )
		
		assertEQ ( self.mm.params['freeCityPos'], {self.player:getCityPos()} )
		assertEQ ( self.mm.params['setCityPos'],  {p_pos} )
		assertEQ ( self.mm.params['getGridByPos'], {self.player:getCityPos()} )
		assertEQ ( self.mm.params['_returnEnemyArmys'],  {self.player} )
		assertEQ ( self.mm.params['_returnAllianceArmys'],  {self.player} )
		assertEQ ( self.mm.params['send'],  {self.player, {'pos'} } )
		assertEQ ( self.mm.params['sendSuccMsgArgs'],  {self.player, 100063, '1,2' } )
		assertEQ ( self.mm.params['EndChangeRolePos'], {self.player:getRoleId()} )
	end;
	
	test__returnEnemyArmys = function(self)
		self.player:getArmyContainer():addEnemyArmyId(1)
		self.player:getArmyContainer():addEnemyArmyId(2)
		self.mm:mock(self.moveUtil, '_returnArmy' )
		self.moveUtil:_returnEnemyArmys(self.player)
		assertEQ ( self.mm.walkLog, '_returnArmy,_returnArmy' )
		assertEQ ( self.mm.params['_returnArmy.1'], {self.player, 2} )
		assertEQ ( self.mm.params['_returnArmy.2'], {self.player, 1} )
	end;
	
	test__returnAllianceArmys = function(self)
		self.player:getArmyContainer():addAllianceArmyId(1)
		self.player:getArmyContainer():addAllianceArmyId(2)
		self.mm:mock(self.moveUtil, '_returnArmy' )
		self.moveUtil:_returnAllianceArmys(self.player)
		assertEQ ( self.mm.walkLog, '_returnArmy,_returnArmy' )
		assertEQ ( self.mm.params['_returnArmy.1'], {self.player, 2} )
		assertEQ ( self.mm.params['_returnArmy.2'], {self.player, 1} )
	end;
	
	test__returnArmy = function(self)
		local r_getArmyById = {nil}
		local r_getReturnNeedTime = {100}
		local r_sourceOnlinePlayer = {name='sourcePlayer'}
		local r_sourceTargetPlayer = {name='targetPlayer'}
		self.mm:mock(app:getArmyMgr(), 'getArmyById', r_getArmyById )
		self.mm:mock(self.moveUtil, '_getReturnNeedTime', r_getReturnNeedTime )
		self.mm:mock(app:getArmyMgr(), 'changeArmy' )
		self.mm:mock(ArmyPlayerGetter, 'getOnlineSourcePlayer', {r_sourceOnlinePlayer} )
		self.mm:mock(ArmyPlayerGetter, 'getOnlineTargetPlayer', {r_sourceTargetPlayer} )
		self.mm:mock(MilitarySender, 'sendArmyState' )
		
		local p_armyId = 10
		self.moveUtil:_returnArmy(self.player, p_armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById' )
		assertEQ ( self.mm.params['getArmyById'], {p_armyId})
		
		self.mm:clear()
		r_getArmyById[1] = {state=ARMYDYN_STATE.RETURN}
		self.moveUtil:_returnArmy(self.player, p_armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById' )
		
		self.mm:clear()
		r_getArmyById[1] = {state=ARMYDYN_STATE.GOTO, armyId=10, fighted=1, stopTime=0}
		self.moveUtil:_returnArmy(self.player, p_armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById,_getReturnNeedTime,changeArmy,getOnlineSourcePlayer,sendArmyState,getOnlineTargetPlayer,sendArmyState' )
		assertEQ ( self.mm.params['_getReturnNeedTime'], {r_getArmyById[1]} )
		assertEQ ( self.mm.params['changeArmy'], {p_armyId, ARMYDYN_STATE.RETURN, FIGHT_FLAG.UNFIGHT, Util:getTime() + 100} )
		assertEQ ( self.mm.params['getOnlineSourcePlayer'], { r_getArmyById[1] } )
		assertEQ ( self.mm.params['sendArmyState.1'], { r_sourceOnlinePlayer, r_getArmyById[1].armyId} )
		assertEQ ( self.mm.params['getOnlineTargetPlayer'], { r_getArmyById[1] } )
		assertEQ ( self.mm.params['sendArmyState.2'], { r_sourceTargetPlayer, r_getArmyById[1].armyId} )
	end;	
	
	test__getReturnNeedTime = function(self)
		local p_army = {state=ARMYDYN_STATE.GOTO, armyId=10, fighted=1, stopTime=0}
		self.mm:mock(app:getArmyMgr(), 'getArmyCallBackNeedTime', {10} )
		self.mm:mock(app:getArmyMgr(), 'getArmyExpedNeedFullTime', {20} )
		assertEQ ( self.moveUtil:_getReturnNeedTime(p_army), 10 )
		assertEQ ( self.mm.walkLog, 'getArmyCallBackNeedTime' )
		assertEQ ( self.mm.params['getArmyCallBackNeedTime'], {p_army.armyId} )
		
		self.mm:clear()
		p_army.state = ARMYDYN_STATE.DISPATCH
		assertEQ ( self.moveUtil:_getReturnNeedTime(p_army), 20 )
		assertEQ ( self.mm.walkLog, 'getArmyExpedNeedFullTime' )
		assertEQ ( self.mm.params['getArmyExpedNeedFullTime'], {p_army.armyId} )
	end;
})

local TestCaseMoveCityEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = MoveCityEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getNeedNumber = function(self)
		assertEQ ( self.effector:getNeedNumber(), 1 )
	end;	
	
	test_exec = function(self)
		local r_pos = {x=1, y=2}
		local r_grid = {}
		self.mm:mock( self.effector, '_allocCityPos', {r_pos} )
		self.mm:mock( self.effector.moveCityUtil, 'moveToPos', {r_pos} )
		
		local p_params = {}
		self.effector:exec(self.player, 1, {}, p_params)
		assertEQ ( self.mm.walkLog, '_allocCityPos,moveToPos' )
		assertEQ ( self.mm.params['_allocCityPos'], {self.player, p_params} )
		assertEQ ( self.mm.params['moveToPos'], {self.player, r_pos} )
	end;
})

local TestCaseSetPosMoveCityEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = SetPosMoveCityEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		local r_isValidMovePos = {false}
		local r_isHerosValidState = {false}
		self.mm:mock(self.effector, '_isValidMovePos', r_isValidMovePos)
		self.mm:mock(self.effector.moveCityUtil, 'isHerosStateCanMove', r_isHerosValidState)
		
		local p_params = {tposX=1,tposY=2}
		assertEQ ( self.effector:isCanExec(self.player, 1, {}, p_params), false )
		assertEQ ( self.mm.params['_isValidMovePos'], {self.player, p_params} )
		
		self.mm:clear()
		r_isValidMovePos[1] = true
		assertEQ ( self.effector:isCanExec(self.player, 1, {}, p_params), false )
		assertEQ ( self.mm.params['isHerosStateCanMove'], {self.player} )
		
		self.mm:clear()
		r_isHerosValidState[1] = true
		assertEQ ( self.effector:isCanExec(self.player, 1, {}, p_params), true )
	end;
	
	test__allocCityPos = function(self)
		local p_params = {netcmd={tposX=1, tposY=2}}
		assertEQ ( self.effector:_allocCityPos(self.player, p_params), {x=1, y=2} )
	end;
	
	test__isValidMovePos = function(self)
		self.player:setCityId(9900001)
		
		local r_getCityResIdByPos = {9900002}
		local r_getGridByPos = {{objType=OBJ_TYPE.FIELD}}
		self.mm:mock(app:getCityMgr(), 'getCityResIdByPos', r_getCityResIdByPos)
		self.mm:mock(app:getCityMgr(), 'getGridByPos', r_getGridByPos)
		self.mm:mock(WUtil, 'sendWarningMsgArgs', r_getGridByPos)
		
		local p_number = 1
		local p_effectres = {}
		local p_params = {netcmd={tposX=1,tposY=2}}
		assertEQ ( self.effector:_isValidMovePos(self.player, p_params), false )
		assertEQ ( self.mm.params['getCityResIdByPos'], {{x=1, y=2}} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100061, ''} )
		
		self.mm:clear()
		r_getCityResIdByPos[1] = 9900001
		assertEQ ( self.effector:_isValidMovePos(self.player, p_params), false )
		assertEQ ( self.mm.params['getGridByPos'], {{x=1, y=2}} )
		
		self.mm:clear()
		r_getGridByPos[1] = {objType=OBJ_TYPE.NONE}
		assertEQ ( self.effector:_isValidMovePos(self.player, p_params), true )
	end;	
})

local TestCaseRandMoveCityEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = RandMoveCityEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		self.player:setCityId(9900001)
		local r_hasFreeGrid = {false}
		local r_isHerosValidState = {false}
		self.mm:mock(app:getCityMgr(), 'hasFreeGrid', r_hasFreeGrid )
		self.mm:mock(self.effector.moveCityUtil, 'isHerosStateCanMove', r_isHerosValidState )
		assertEQ ( self.effector:isCanExec(self.player), false )
		assertEQ ( self.mm.params['hasFreeGrid'], {9900001} ) 
		
		self.mm:clear()
		r_hasFreeGrid[1] = true
		assertEQ ( self.effector:isCanExec(self.player), false )
		assertEQ ( self.mm.params['isHerosStateCanMove'], {self.player} ) 
	end;
	
	test__allocCityPos = function(self)
		self.player:setCityId(9900001)
		self.mm:mock(app:getCityMgr(), 'getFreeCityPos', {{x=1, y=0}} )
		assertEQ ( self.effector:_allocCityPos(self.player), {x=1, y=0} )
		assertEQ ( self.mm.params['getFreeCityPos'],  {9900001} )
	end;
})

local TestCaseAddCommResEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = AddCommResEffector({'Food', 'Money'})
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.effector.commRess, {'Food', 'Money'} )
	end;
	
	test_exec = function(self)
		self.mm:mock(self.effector, '_addVal')
		self.mm:mock(self.effector, '_sendMsg')
		
		local number = 2
		local effectres = {val=3}
		self.effector:exec(self.player, number, effectres, {})
		assertEQ ( self.mm.walkLog, '_addVal,_sendMsg' )
		assertEQ ( self.mm.params['_addVal'], {self.player, number, effectres} )
		assertEQ ( self.mm.params['_sendMsg'], {self.player} )
	end;
	
	test__addVal = function(self)
		local lastFood = self.player:getCityRes():getFood();
		local lastMoney = self.player:getCityRes():getMoney();
		
		local number = 2
		local effectres = {val=3}
		self.effector:exec(self.player, number, effectres, {})
		assertEQ ( self.player:getCityRes():getFood(), 2*3 + lastFood)
		assertEQ ( self.player:getCityRes():getMoney(), 2*3 + lastMoney)	
	end;
	
	test__sendMsg = function(self)
		self.mm:mock(CommResSender, 'sendAll' )
		
		self.effector:_sendMsg(self.player)
		assertEQ ( self.mm.walkLog, 'sendAll')
		assertEQ ( self.mm.params['sendAll'], {self.player} )
	end;
})

local TestCaseAddAvoidFightEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = AddAvoidFightEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isCanExec = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local r_isCanAppend = {false}
		self.mm:mock(self.player:getStateContainer(), 'isCanAppend', r_isCanAppend)
		
		self.mm:clear()
		local effectres = {id=RES_EFF.AVOIDFIGHT}
		assertEQ ( self.effector:isCanExec(self.player, 1, effectres, nil), false )
		assertEQ ( self.mm.params['isCanAppend'], {effectres.id})
		
		self.mm:clear()
		r_isCanAppend[1] = true
		self.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.effector:isCanExec(self.player, 1, effectres, nil), false )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100100, ''} )
		
		self.mm:clear()
		self.player:setState(ROLE_STATE.FREE)
		assertEQ ( self.effector:isCanExec(self.player, 1, effectres, nil), true )
	end;
	
	test_getNeedNumber = function(self)
		assertEQ ( self.effector:getNeedNumber(self.player, 2), 1 )
	end;
	
	test_exec = function(self)
		self.mm:mock(self.player:getStateContainer(), 'appendState')
		local effectres = {id=RES_EFF.AVOIDFIGHT, val=3600}
		self.effector:exec(self.player, 1, effectres, nil)
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=effectres.val, effect={id=effectres.id,val=1,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		assertEQ ( self.mm.params['appendState'], {stateRes, creator} )
	end;
})

local TestCaseTradingAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = TradingAccEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isCanExec = function(self)
		Util:setTimeDrt(10)

		local g_effectres = {val=0}
		local g_params = {}
		
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )

		self.mm:clear()
		g_effectres = {val=1}
		self.player:getTradingArea():setStopTime(10)
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		self.mm:clear()
		self.player:getTradingArea():setStopTime(30)
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
	end;
	
	test_getNeedNumber = function(self)
		self.mm:mock(self.effector, 'getNeedNumberInner', {10})
		local g_effectres = {val=1}
		self.player:getTradingArea():setStopTime(10)
		assertEQ (self.effector:getNeedNumber(self.player, 1, g_effectres, g_params), 10)
		assertEQ ( self.mm.params['getNeedNumberInner'], {10, g_effectres, 1} )
	end;
	
	test_exec = function(self)
		Util:setTimeDrt(10)
		self.player:getTradingArea():setStopTime(20)

		self.mm:mock( global.getTimer(), 'start' )
		self.mm:mock( self.effector, 'calcStopTime', {15} )
		self.mm:mock( TradingAreaSender, 'sendStopTime' )
	
		local g_effectres = {val=0}
		local g_params = {}
		self.effector:exec(self.player, 1, g_effectres, g_params)
		assertEQ ( self.mm.walkLog, '' )
		
		g_effectres = {val=1}
		self.effector:exec(self.player, 1, g_effectres, g_params)
		assertEQ ( self.player:getTradingArea():getStopTime(), 15 )
		assertEQ ( self.mm.params['calcStopTime'], {20, g_effectres, 1} )
		assertEQ ( self.mm.params['start'], {5*1000, {TIMER_EVT.TRADING_STOP}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['sendStopTime'], {self.player } )
	end;
})

local TestCaseFullTradingAccUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = FullTradingAccUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( getmetatable(self.effector:getClass())  == FullAccUseGiftGoldEffector )
		assert ( self.effector.innerEffector:getClass() == TradingAccEffector )
		assert ( self.effector.accType == 'trading' )
	end;
	
	test__getDurationTimeS = function(self)
		Util:setTimeDrt(10)
		self.player:getTradingArea():setStopTime(30)
		assert ( self.effector:_getDurationTimeS(self.player, nil) == 20 )
	end;
})

local TestCaseDoingRoleTaskAccEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = DoingRoleTaskAccEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isCanExec = function(self)
		Util:setTimeDrt(10)

		local g_effectres = {val=0}
		local g_params = {}
		
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )

		self.mm:clear()
		g_effectres = {val=1}
		self.player:getTask():getDoingRoleTask():setStopTime(10)
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == false )
		
		self.mm:clear()
		self.player:getTask():getDoingRoleTask():setStopTime(30)
		assert ( self.effector:isCanExec(self.player, 1, g_effectres, g_params) == true )
	end;
	
	test_getNeedNumber = function(self)
		self.mm:mock(self.effector, 'getNeedNumberInner', {10})
		local g_effectres = {val=1}
		self.player:getTask():getDoingRoleTask():setStopTime(10)
		assertEQ (self.effector:getNeedNumber(self.player, 1, g_effectres, g_params), 10)
		assertEQ ( self.mm.params['getNeedNumberInner'], {10, g_effectres, 1} )
	end;
	
	test_exec = function(self)
		Util:setTimeDrt(10)
		self.player:getTask():getDoingRoleTask():setStopTime(20)
	
		self.mm:mock( self.player:getTask():getDoingRoleTask(), 'startDoing' )
		self.mm:mock( self.effector, 'calcStopTime', {15} )
	
		local g_effectres = {val=0}
		local g_params = {}
		self.effector:exec(self.player, 1, g_effectres, g_params)
		assertEQ ( self.mm.walkLog, '' )
		
		g_effectres = {val=1}
		self.effector:exec(self.player, 1, g_effectres, g_params)
		assertEQ ( self.player:getTask():getDoingRoleTask():getStopTime(), 15 )
		assertEQ ( self.mm.params['calcStopTime'], {20, g_effectres, 1} )
		assertEQ ( self.mm.params['startDoing'], {} )
	end;
})

local TestCaseFullTaskAccUseGiftGoldEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = FullTaskAccUseGiftGoldEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_init = function(self)
		assert ( getmetatable(self.effector:getClass()) == FullAccUseGiftGoldEffector )
		assert ( self.effector.innerEffector:getClass() == DoingRoleTaskAccEffector )
		assert ( self.effector.accType == 'roletask' )
	end;
	
	test__getDurationTimeS = function(self)
		Util:setTimeDrt(10)
		self.player:getTask():getDoingRoleTask():setStopTime(30)
		assert ( self.effector:_getDurationTimeS(self.player, nil) == 20 )
	end;
})

local BaseTestAddStateEffectEffector = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.effector = self:_createEffector()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	check_isCanExecWhenNotOneNumber = function(self)
		self:setUp()
		assertEQ ( self.effector:isCanExec(self.player, 2, {}, {}), false )
		self:tearDown()
	end;
	
	check_isCanExecWhenExistState = function(self)
		self:setUp()
		local stateContainer = self.player:getStateContainer()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=self:_getEffectId(),val=100,unit=1 }}
		local creator = {type=0,id=0,skillId=0}
		stateContainer:appendState(stateRes, creator)
		
		assertEQ ( self.effector:isCanExec(self.player, 1, {}, {}), false )
		self:tearDown()
	end;
	
	check_isCanExecOk = function(self)
		self:setUp()
		assertEQ ( self.effector:isCanExec(self.player, 1, {}, {}), true )
		self:tearDown()
	end;
	
	check_getNeedNumber = function(self)
		self:setUp()
		assertEQ ( self.effector:getNeedNumber(self.player, 1, {}, {}), 1 )
		assertEQ ( self.effector:getNeedNumber(self.player, 2, {}, {}), 1 )
		assertEQ ( self.effector:getNeedNumber(self.player, 0, {}, {}), 1 )
		self:tearDown()
	end;
	
	check_exec = function(self)
		self:setUp()
		self.effector:exec(self.player, 1, self:_createEffectRes(), {})
		local state = self.player:getStateContainer():getEffectState(self:_getEffectId())
		assertEQ ( state:getDuration(), 200 )
		assertEQ ( state:getEffectVal(), 100 )
		assertEQ ( state:getEffectValUnit(), 1 )
		self:tearDown()
	end;
	
	check_all = function(self)
		self:check_isCanExecWhenNotOneNumber()
		self:check_isCanExecWhenExistState()
		self:check_isCanExecOk()
		self:check_getNeedNumber()
		self:check_exec()
	end;
	
	_createEffectRes = function(self)
		return {val=100, val2=200, val3=300}
	end;
})

local TestCaseAddBuildSpeedEffector = BaseTestAddStateEffectEffector:extends({
	_createEffector = function(self)
		return AddBuildSpeedEffector()
	end;
	
	_getEffectId = function(self)
		return RES_EFF.ADD_BUILD_SPEED
	end;
	
	test_all = function(self)
		self:check_all()
	end;
})

local TestCaseAddCommResOutputEffector = BaseTestAddStateEffectEffector:extends({
	_createEffector = function(self)
		return AddCommResOutputEffector()
	end;
	
	_getEffectId = function(self)
		return RES_EFF.ADD_COMMRES_OUTPUT
	end;
	
	test_all = function(self)
		self:check_all()
	end;	
})

local TestCaseAddCultureSpeedAndMoneyOutputEffector = BaseTestAddStateEffectEffector:extends({
	_createEffector = function(self)
		return AddCultureSpeedAndMoneyOutputEffector()
	end;
	
	_getEffectId = function(self)
		return RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT
	end;
	
	test_all = function(self)
		self:check_all()
	end;	
})

tqEffector_t_main = function(suite)
	suite:addTestCase(TestCaseEffectorMgr, 'TestCaseEffectorMgr')
	suite:addTestCase(TestCaseEffector, 'TestCaseEffector')
	suite:addTestCase(TestCaseSomeEffector, 'TestCaseSomeEffector')
	suite:addTestCase(TestCaseHeroLearnTacticSkillEffector, 'TestCaseHeroLearnTacticSkillEffector')
	suite:addTestCase(TestCaseHeroLearnSpecSkillEffector, 'TestCaseHeroLearnSpecSkillEffector')
	suite:addTestCase(TestCaseAccelerateEffector, 'TestCaseAccelerateEffector')
	suite:addTestCase(TestCaseBuildAccEffector, 'TestCaseBuildAccEffector')
	suite:addTestCase(TestCaseHeroSSteelAccEffector, 'TestCaseHeroSSteelAccEffector')
	suite:addTestCase(TestCaseHeroSkillSteelAccEffector, 'TestCaseHeroSkillSteelAccEffector')
	suite:addTestCase(TestCaseLearnCultureAccEffector, 'TestCaseLearnCultureAccEffector')
	suite:addTestCase(TestCaseBuildCityDefAccEffector, 'TestCaseBuildCityDefAccEffector')

	suite:addTestCase(TestCaseFullAccUseGiftGoldEffector, 'TestCaseFullAccUseGiftGoldEffector')
	suite:addTestCase(TestCaseFullAccBuildUseGiftGoldEffector, 'TestCaseFullAccBuildUseGiftGoldEffector')
	suite:addTestCase(TestCaseFullAccCultureLearnUseGiftGoldEffector, 'TestCaseFullAccCultureLearnUseGiftGoldEffector')
	suite:addTestCase(TestCaseFullAccSkeletonSteelUseGiftGoldEffector, 'TestCaseFullAccSkeletonSteelUseGiftGoldEffector')
	suite:addTestCase(TestCaseFullAccSkillSteelUseGiftGoldEffector, 'TestCaseFullAccSkillSteelUseGiftGoldEffector')
	suite:addTestCase(TestCaseFullAccCityDefBuildUseGiftGoldEffector, 'TestCaseFullAccCityDefBuildUseGiftGoldEffector')
	
	suite:addTestCase(TestCaseAddRoleAttrEffector, 'TestCaseAddRoleAttrEffector')
		
	suite:addTestCase(TestCaseFightAttrsEffector, 'TestCaseFightAttrsEffector')
	suite:addTestCase(TestCaseLearnLineUpEffector, 'TestCaseLearnLineUpEffector')
	suite:addTestCase(TestCaseHeroAttrEffector, 'TestCaseHeroAttrEffector')
	suite:addTestCase(TestCaseHeroLearnSkillEffector, 'TestCaseHeroLearnSkillEffector')
	suite:addTestCase(TestCaseAddHeroInnerForceEffector, 'TestCaseAddHeroInnerForceEffector')
	suite:addTestCase(TestCaseAccNeedGoldCalculator,'TestCaseAccNeedGoldCalculator')
	
	suite:addTestCase(TestCaseAddThreeBuildingPosEffector,'TestCaseAddThreeBuildingPosEffector')
	suite:addTestCase(TestCaseAddTowerRecoverSoldierEffector,'TestCaseAddTowerRecoverSoldierEffector')
	suite:addTestCase(TestCaseAddTowerRecoverSoldierByActEffector,'TestCaseAddTowerRecoverSoldierByActEffector')
	suite:addTestCase(TestCaseRestoreHurtBuildValEffector,'TestCaseRestoreHurtBuildValEffector')
	suite:addTestCase(TestCaseSendWorldBlessEffector,'TestCaseSendWorldBlessEffector')
	suite:addTestCase(TestCaseMoveCityUtil,'TestCaseMoveCityUtil')
	suite:addTestCase(TestCaseMoveCityEffector,'TestCaseMoveCityEffector')
	suite:addTestCase(TestCaseSetPosMoveCityEffector,'TestCaseSetPosMoveCityEffector')
	suite:addTestCase(TestCaseRandMoveCityEffector,'TestCaseRandMoveCityEffector')
	suite:addTestCase(TestCaseDropItemEffector,'TestCaseDropItemEffector')
	suite:addTestCase(TestCasePassivityDropItemEffector,'TestCasePassivityDropItemEffector')
	
	suite:addTestCase(TestCaseAddCommResEffector,'TestCaseAddCommResEffector')
	suite:addTestCase(TestCaseAddAvoidFightEffector,'TestCaseAddAvoidFightEffector')
	
	suite:addTestCase(TestCaseTradingAccEffector,'TestCaseTradingAccEffector')
	suite:addTestCase(TestCaseFullTradingAccUseGiftGoldEffector,'TestCaseFullTradingAccUseGiftGoldEffector')
	suite:addTestCase(TestCaseDoingRoleTaskAccEffector,'TestCaseDoingRoleTaskAccEffector')
	suite:addTestCase(TestCaseFullTaskAccUseGiftGoldEffector,'TestCaseFullTaskAccUseGiftGoldEffector')
	
	suite:addTestCase(TestCaseAddBuildSpeedEffector,'TestCaseAddBuildSpeedEffector')
	suite:addTestCase(TestCaseAddCommResOutputEffector,'TestCaseAddCommResOutputEffector')
	suite:addTestCase(TestCaseAddCultureSpeedAndMoneyOutputEffector,'TestCaseAddCultureSpeedAndMoneyOutputEffector')
end;

