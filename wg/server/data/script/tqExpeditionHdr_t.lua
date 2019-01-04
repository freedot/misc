require('tqExpeditionHdr')

local TestCaseExpeditionHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=0},{state=0,soldier={resid=150001001,number=0}} } })
		local heroMgr = self.player:getHeroMgr()
		local hero4 = heroMgr:getHeroById(4)
		hero4:setAttrVal(ATTR.HEALTH, hero4:getAttrVal(ATTR.HEALTH)/10)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidLineupId = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180003,count=5,hid1=1,hid2=2,hid3=0,hid4=0,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testInvalidHeroCount = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=0,hid1=1,hid2=2,hid3=0,hid4=0,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )

		cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=6,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testNoHasHero = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=12,hid2=10,hid3=0,hid4=0,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testHasRepeatHeros = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=1,hid3=2,hid4=0,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testHasBusyHero = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=3,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testHasDeepWoundHero = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=4,hid5=0}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testHasNoCarrySoldierHero = function(self)
		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=5}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )

		local cmd = {ttype=OBJ_TYPE.COPYFIELD,tid=171001,expedType=EXPED_TYPE.ACT_TERRACE,lineup=180002,count=1,hid1=5}
		local hdr = ExpeditionMgr:getHandler(cmd)
		SendMsgStub:clear()
		hdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount() > 0, true )
	end;
	
	testPlayerMoveToCopyField = function(self)
		local fieldPlayer = CopyFieldPlayer(171001)
		local needTime = ExpeditionHdr():getMoveNeedTime(self.player, fieldPlayer, 0)
		assert ( needTime == 8 )
	end;
	
	testCopyFieldMoveToPlayer = function(self)
		local fieldPlayer = CopyFieldPlayer(171001)
		local needTime = ExpeditionHdr():getMoveNeedTime(fieldPlayer, self.player, 0)
		assert ( needTime == 8*3 )
	end;

	testPlayerMoveToPlayer_Tiaoxin = function(self)
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		local needTime = ExpeditionHdr():getMoveNeedTime(self.player, targetPlayer, EXPED_TYPE.TIAOXIN)
		assert ( needTime == res_tiaoxin_needtime )
	end;
	
	testPlayerMoveToPlayer_NoTiaoxin = function(self)
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		
		self.player:setCityPos({x=0, y=0})
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		targetPlayer:setCityPos({x=100, y=0})
		
		local speed = ExpeditionHdr():getMinSpeedFromHeros({hero1,hero2})
		assert ( speed == 50 )
		
		local needTime = ExpeditionHdr():getMoveNeedTime(self.player, targetPlayer, EXPED_TYPE.CUIHUI, speed)
		local expectTime = math.floor(100/50*3600) + res_army_preparetime*40/50
		assert ( needTime == expectTime )
	end;
	
	test_isCanAddArmy = function(self)
		local hdr = ExpeditionHdr()
		hdr.player = self.player
		
		local r_isSelfArmyFull = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getArmyContainer(), 'isSelfArmyFull', r_isSelfArmyFull )
		
		assertEQ ( hdr:isCanAddArmy(), true )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull' )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = true
		assertEQ ( hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100094, ''} )
	end;
	
	test_paiqianSameAlliancePlayer_addSpeed = function(self)
		local hdr = ExpeditionHdr()
		
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		targetPlayer:setCityPos({x=100, y=0})
		self.player:setCityPos({x=0, y=0})
		
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.PAIQIAN
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		hdr:addArmy()
		local army = hdr.army
		local expectTime = math.floor(100/50*3600) + res_army_preparetime*40/50
		assertEQ ( army.needTime,  expectTime) 
		
		local hdr = ExpeditionPaiqianPlayerHdr()
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.PAIQIAN
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		self.player:setAlliId(1)
		targetPlayer:setAlliId(1)
		local amry = hdr:addArmy()
		local expectTime = math.floor(100/50*3600) + res_army_preparetime*40/50
		assertEQ ( army.needTime,  expectTime) 
		
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.ALLIINBUILD,level=10,state=0} } })
		hdr:addArmy()
		local army = hdr.army
		local factSpeed = 50 + 50 * (0.1*10)
		local expectTime = math.floor(100/factSpeed*3600) + res_army_preparetime*40/factSpeed
		assertEQ ( army.needTime,  expectTime) 
	end;
	
	test_countryFight_TAOFA = function(self)
		local hdr = ExpeditionHdr()
		
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		targetPlayer:setCityPos({x=341, y=268})
		self.player:setCityPos({x=134, y=40})
		
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.TAOFA
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		hdr:addArmy()
		local army = hdr.army
		assertEQ ( army.needTime,  res_countryfight_needtime) 
	end;
	
	test_countryFight_CUIHUI = function(self)
		local hdr = ExpeditionHdr()
		
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		targetPlayer:setCityPos({x=341, y=268})
		self.player:setCityPos({x=134, y=40})
		
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.CUIHUI
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		hdr:addArmy()
		local army = hdr.army
		assertEQ ( army.needTime,  res_countryfight_needtime) 
	end;
	
	test_countryFight_TIAOXIN = function(self)
		local hdr = ExpeditionHdr()
		
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		targetPlayer:setCityPos({x=341, y=268})
		self.player:setCityPos({x=134, y=40})
		
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.TIAOXIN
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		hdr:addArmy()
		local army = hdr.army
		assertEQ ( army.needTime,  res_countryfight_needtime) 
	end;
	
	test_not_countryFight = function(self) -- this test is impossible in reality, just test here. Can't exped TAOFA to fieldplayer
		local hdr = ExpeditionHdr()
		
		local targetPlayer = FieldPlayer(2)
		self.player:setCityPos({x=134, y=40})
		
		local hero1 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		local hero2 = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		hero1:setAttrVal(ATTR.SP, 50)
		hero2:setAttrVal(ATTR.SP, 100)
		hdr.heros = {hero1, hero2}
		hdr.player = self.player
		hdr.targetPlayer = targetPlayer
		hdr.expedType = EXPED_TYPE.TAOFA
		hdr.lineupId = 0
		hdr.heroIds = {hero1:getId(), hero2:getId()}
		
		hdr:addArmy()
		local army = hdr.army
		assertEQ ( army.needTime >  res_countryfight_needtime, true) 
	end;
});

local TestCaseExpeditionTaofaCopyFieldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isValidTarget = function(self)
		local hdr = ExpeditionTaofaCopyFieldHdr()
		hdr.player = self.player
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		
		hdr.targetPlayer = CopyFieldPlayer(171001)
		assertEQ ( hdr:isValidTarget(), true )
		assertEQ ( self.mm.walkLog, '' )
		
		hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100071,''} )
	end;
});

local TestCaseExpeditionFightPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ExpeditionFightPlayerHdr()
		self.hdr.player = self.player
		self.hdr.targetId = 10001
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isValidSource = function(self)
		self.hdr.player = self.player
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		
		self.hdr.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:isValidSource(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100089,''} )
		
		self.hdr.player:setState(ROLE_STATE.REST)
		assertEQ ( self.hdr:isValidSource(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100090,''} )	
	end;
	
	test_isValidTarget = function(self)
		local r_getFightRefState = {0}
		local r_isSameAlliance = {true}
		local r_hasEnoughItemWhenBeyondTimes = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player, 'getFightRefState', r_getFightRefState )
		self.mm:mock(self.hdr, 'isSameAlliance', r_isSameAlliance )
		self.mm:mock(self.hdr, 'hasEnoughItemWhenBeyondTimes', r_hasEnoughItemWhenBeyondTimes )
		
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100073,''} )
		
		self.hdr.targetPlayer = self.player
		self.hdr.targetPlayer:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100074,''} )
		
		self.hdr.targetPlayer:setState(ROLE_STATE.REST)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100075,''} )
		
		self.hdr.targetPlayer:setState(ROLE_STATE.FREE)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['getFightRefState'], {self.hdr.targetId} )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100076,''} )
		
		r_getFightRefState[1] = REF_ROLESTATE.FIGHTING
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100077,''} )
		
		r_isSameAlliance[1] = false
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100078,''} )
		
		r_hasEnoughItemWhenBeyondTimes[1] = true
		self.hdr.targetPlayer:getCityRes():setLevel(0)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100156,''}, 'the target city is die' )
		
		self.hdr.targetPlayer:getCityRes():setLevel(1)
		assertEQ ( self.hdr:isValidTarget(), true )
		
		self.hdr.targetPlayer:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100173,''} )
	end;
	
	test_isCanAddArmy = function(self)
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		local r_isSelfArmyFull = {false}
		local r_isEnemyArmyFull = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getArmyContainer(), 'isSelfArmyFull', r_isSelfArmyFull )
		self.mm:mock(self.hdr.targetPlayer:getArmyContainer(), 'isEnemyArmyFull', r_isEnemyArmyFull )
		
		assertEQ ( self.hdr:isCanAddArmy(), true )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100094, ''} )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = false
		r_isEnemyArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,isEnemyArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100095, ''} )
	end;
});

local TestCaseExpeditionTaofaPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero2 = self.sourcePlayer:getHeroMgr():getHeroById(2)
		self.hero1:setName('hero1')
		self.hero2:setName('hero2')
		
		self.validcmd = {ttype=OBJ_TYPE.ROLE,tid=200001,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testTargetIsNull = function(self)
		local cmd = {ttype=OBJ_TYPE.ROLE,tid=1,expedType=EXPED_TYPE.TAOFA,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetIsNotRole = function(self)
		self.mm:mock(self.targetPlayer, 'isRole', {false} )
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetInvalidState_inYoung = function(self)
		self.targetPlayer:setState(ROLE_STATE.YOUNG)
		getLastTimer_t().eventid = -1;
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetInvalidState_inRest = function(self)
		self.targetPlayer:setState(ROLE_STATE.REST)
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetInvalidState_noInFightingRefState= function(self)
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.NORMAL
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testIsAlliancePlayer = function(self)
		self.sourcePlayer:setAlliId(1)
		self.targetPlayer:setAlliId(1)
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testExceedFightTimesTodayAndHasNoEnoughItem = function(self)
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:setTodayFightTimes({taofa=5, cuihui=5, tiaoxin=5, fightowner=5})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testSelfArmyIsFull = function(self)
		self.mm:mock(self.sourcePlayer:getArmyContainer(), 'isSelfArmyFull', {true})
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testEnemyArmyIsFull = function(self)
		self.mm:mock(self.targetPlayer:getArmyContainer(), 'isEnemyArmyFull',{true})
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testExpedOk_subExpedItem = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=5, cuihui=5, tiaoxin=5, fightowner=5})
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING) == 0 )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
	end;
	
	testExpedOk_onExpedItem = function(self)
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		self.mm:mock(global.getTimer(), 'start')
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.taofa, 1 )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.sourcePlayer} )
		assert ( getSendMsgCnt_t() > 0 )
		
		assert ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING) == 1 )
		
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assert ( army ~= nil )
		assert ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0) == armyId )
		assert ( self.targetPlayer:getArmyContainer():getEnemyArmyId(0) == armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		
		assert ( self.hero1:getState() == HERO_STATE.EXPED)
		assert ( self.hero2:getState() == HERO_STATE.EXPED)
		
		assert ( self.targetPlayer:getEnemyContainer():getCount() == 1 )
		assert ( self.targetPlayer:getEnemyContainer():getByIdx(0) == self.sourcePlayer:getRoleId() )
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:1},{id:2,state:1}]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:0,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('has@enemys:%[{_k:"gridId"},{gridId:203') == 1 )
	end;
	
	test_expedOk_notHonourFight = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900001)
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_expedOk_honourFight = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assertEQ ( self.mm.params['trigerTask'], {self.sourcePlayer, TASK_FINISH_TYPE.FIGHT_PLAYER_FOR_HONOR} )
	end;
});

local TestCaseExpeditionCuihuiPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero2 = self.sourcePlayer:getHeroMgr():getHeroById(2)
		self.hero1:setName('hero1')
		self.hero2:setName('hero2')
		
		self.validcmd = {ttype=OBJ_TYPE.ROLE,tid=200001,expedType=EXPED_TYPE.CUIHUI,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testExpedOk = function(self)
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.cuihui, 1 )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.sourcePlayer} )
	end;	
	
	testExpedOk_expendItem = function(self)
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.cuihui, 2 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 0 )
	end;
});

local TestCaseExpeditionTiaoxinPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero1:setName('hero1')
		
		self.validcmd = {ttype=OBJ_TYPE.ROLE,tid=200001,expedType=EXPED_TYPE.TIAOXIN,lineup=180001,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testExpedOk = function(self)
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.tiaoxin, 1 )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.sourcePlayer} )
	end;	
	
	testExpedOk_expendItem = function(self)
		self.sourcePlayer:addDeclareState(200001).state = REF_ROLESTATE.FIGHTING
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.tiaoxin, 2 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 0 )
	end;
});
	

local TestCaseExpeditionPaiqianPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero2 = self.sourcePlayer:getHeroMgr():getHeroById(2)
		self.hero1:setName('hero1')
		self.hero2:setName('hero2')
		
		self.validcmd = {ttype=OBJ_TYPE.ROLE,tid=200001,expedType=EXPED_TYPE.PAIQIAN,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
		
		self.hdr = ExpeditionPaiqianPlayerHdr()
		self.hdr.player = self.player
		self.hdr.targetId = 10001
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testTargetIsNull = function(self)
		local cmd = {ttype=OBJ_TYPE.ROLE,tid=1,expedType=EXPED_TYPE.PAIQIAN,lineup=180002,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetIsNotRole = function(self)
		self.mm:mock(self.targetPlayer, 'isRole', {false})
		self.sourcePlayer:setAlliId(1)
		self.targetPlayer:setAlliId(1)
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testIsNotAlliancePlayer = function(self)
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testSelfArmyIsFull = function(self)
		clearLastTimer_t()
		self.mm:mock(self.sourcePlayer:getArmyContainer(), 'isSelfArmyFull', {true})
		self.sourcePlayer:setAlliId(1)
		self.targetPlayer:setAlliId(1)
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testAllianceArmyIsFull = function(self)
		self.mm:mock(self.targetPlayer:getArmyContainer(), 'isAllianceArmyFull', {true})
		self.sourcePlayer:setAlliId(1)
		self.targetPlayer:setAlliId(1)
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testExpedOk = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.sourcePlayer:setAlliId(1)
		self.targetPlayer:setAlliId(1)
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assert ( army ~= nil )
		assert ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0) == armyId )
		assert ( self.targetPlayer:getArmyContainer():getAllianceArmyId(0) == armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		
		assert ( self.hero1:getState() == HERO_STATE.EXPED)
		assert ( self.hero2:getState() == HERO_STATE.EXPED)
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:1},{id:2,state:1}]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:0,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msgid:100011,params:[]}' ) == 1 )
	end;
	
	test_isValidTarget = function(self)
		local r_isSameAlliance = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.hdr, 'isSameAlliance', r_isSameAlliance )	
		
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100073,''} )
		
		self.hdr.targetPlayer = self.player
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100079,''} )
		
		r_isSameAlliance[1] = true
		assertEQ ( self.hdr:isValidTarget(), true )
		
		self.hdr.targetPlayer:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100172,''} )		
	end;
	
	test_isCanAddArmy = function(self)
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		
		local r_isSelfArmyFull = {false}
		local r_isAllianceArmyFull = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getArmyContainer(), 'isSelfArmyFull', r_isSelfArmyFull )
		self.mm:mock(self.hdr.targetPlayer:getArmyContainer(), 'isAllianceArmyFull', r_isAllianceArmyFull )
		
		assertEQ ( self.hdr:isCanAddArmy(), true )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100094, ''} )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = false
		r_isAllianceArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,isAllianceArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100096, ''} )	
	end;
});

local TestCaseExpeditionFightFieldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero1:setName('hero1')
		
		self.validcmd_dantiao = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.DANTIAO, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		self.validcmd_zhanling = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.ZHANLING, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		
		self.hdr = ExpeditionFightFieldHdr()
		self.hdr.player = self.player
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	addAllianceField = function(self)
		self.alliancePlayer = TestCaseHelper:loadPlayerByUserNameEx('friend', 'friend_r', 200002)
		TestCaseHelper:addSelfField(self.alliancePlayer, {x=1, y=0})
		
		self.alliancePlayer:setAlliId(1)
		self.sourcePlayer:setAlliId(1)
	end;
	
	addEnemyOwnerField = function(self)
		self.enemyPlayer = TestCaseHelper:loadPlayerByUserNameEx('enemy', 'enemy_r', 200003)
		TestCaseHelper:addSelfField(self.enemyPlayer, {x=1, y=0})
		self.sourcePlayer:addDeclareState(200003).state = REF_ROLESTATE.FIGHTING
	end;
	
	testTargetIsNull = function(self)
		local cmd = {ttype=OBJ_TYPE.FIELD,tid=1000,expedType=EXPED_TYPE.DANTIAO,lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testHerosCount = function(self)
		local cmd = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.DANTIAO,lineup=180001,count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testIsSelfField = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testIsAlliancePlayerField = function(self)
		self:addAllianceField()
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testSelfArmyIsFull = function(self)
		self.mm:mock(self.sourcePlayer:getArmyContainer(), 'isSelfArmyFull', {true})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetOwnerEnemyArmyIsFull = function(self)
		self:addEnemyOwnerField()
		self.mm:mock(self.enemyPlayer:getArmyContainer(), 'isEnemyArmyFull', {true})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testSelfFieldFullWhenZhanling = function(self)
		self:addEnemyOwnerField()
		
		self.mm:mock(self.sourcePlayer:getSelfField(), 'isFull', {true})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testExpedOk = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self:addEnemyOwnerField()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling)
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assert ( army ~= nil )
		assert ( army.isMem == false )
		assert ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0) == armyId )
		assert ( self.enemyPlayer:getArmyContainer():getEnemyArmyId(0) == armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		
		assert ( self.hero1:getState() == HERO_STATE.EXPED)
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:1}]}' ) == 1 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:0,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msgid:100011,params:[]}' ) == 1 )
	end;
	
	testExpedOk_memArmy = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.validcmd_zhanling.isMemArmy = 1
		self:addEnemyOwnerField()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling)
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assert ( army ~= nil )
		assert ( army.isMem == true )
		assert ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0) == armyId )
		assert ( self.enemyPlayer:getArmyContainer():getEnemyArmyId(0) == armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		
		assert ( self.hero1:getState() == HERO_STATE.EXPED)
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:1}]}' ) == 0 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:0,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msgid:100011,params:[]}' ) == 1 )
	end;

	
	test_isValidSource = function(self)
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		
		self.hdr.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:isValidSource(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100089,''} )
		
		self.hdr.player:setState(ROLE_STATE.REST)
		assertEQ ( self.hdr:isValidSource(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100090,''} )		
	end;
	
	test_isValidTarget = function(self)
		local r_isValidOwnerPlayerWhenOwnerField = {false}
		local r_isSelfField = {true}
		local r_isAlliPlayerField = {true}
		self.mm:mock(WUtil, 'sendErrorMsgArgs'  )
		self.mm:mock(self.hdr, 'isValidOwnerPlayerWhenOwnerField', r_isValidOwnerPlayerWhenOwnerField  )
		self.mm:mock(SelfFieldChecker, 'isSelfField', r_isSelfField )
		self.mm:mock(self.hdr, 'isAlliPlayerField', r_isAlliPlayerField )
		
		self.hdr.targetPlayer = self.player
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100080,''} )
		
		self.mm:clear()
		self.hdr.targetPlayer = OwnerFieldPlayer(2)
		self.hdr.targetPlayer.objType = OBJ_TYPE.OWNERFIELD
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.walkLog, 'isValidOwnerPlayerWhenOwnerField' )
		
		r_isValidOwnerPlayerWhenOwnerField[1] = true
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100081,''} )
		assertEQ ( self.mm.params['isSelfField'], {self.player, self.hdr.targetPlayer} )
		
		r_isSelfField[1] = false
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100082,''} )
		assertEQ ( self.mm.params['isSelfField'], {self.player, self.hdr.targetPlayer} )
		
		r_isAlliPlayerField[1] = false
		assertEQ ( self.hdr:isValidTarget(), true )
	end;
	
	test_isValidOwnerPlayerWhenOwnerField = function(self)
		local r_getFightRefState = {0}
		self.mm:mock(WUtil, 'sendErrorMsgArgs'  )
		self.mm:mock(self.player, 'getFightRefState', r_getFightRefState )
		
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isValidOwnerPlayerWhenOwnerField(), true )
		
		self.hdr.targetPlayer = OwnerFieldPlayer(2)
		self.hdr.targetPlayer.objType = OBJ_TYPE.OWNERFIELD
		self.hdr.targetPlayer.ownerPlayer = self.player
		
		self.hdr.targetPlayer:getOwnerPlayer():setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:isValidOwnerPlayerWhenOwnerField(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100091,''} )
		
		self.hdr.targetPlayer:getOwnerPlayer():setState(ROLE_STATE.REST)
		assertEQ ( self.hdr:isValidOwnerPlayerWhenOwnerField(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100092,''} )
		
		self.hdr.targetPlayer:getOwnerPlayer():setState(ROLE_STATE.FREE)
		assertEQ ( self.hdr:isValidOwnerPlayerWhenOwnerField(), true )
	end;
	
	test_isCanAddArmy = function(self)
		local r_isSelfArmyFull = {false}
		local r_isOwnerEnemyArmyFullWhenOwnerField = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getArmyContainer(), 'isSelfArmyFull', r_isSelfArmyFull )
		self.mm:mock(self.hdr, 'isOwnerEnemyArmyFullWhenOwnerField', r_isOwnerEnemyArmyFullWhenOwnerField )
		
		assertEQ ( self.hdr:isCanAddArmy(), true )

		self.mm:clear()
		r_isSelfArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100094, ''} )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = false
		r_isOwnerEnemyArmyFullWhenOwnerField[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,isOwnerEnemyArmyFullWhenOwnerField,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100097, ''} )		
	end;
});

local TestCaseExpeditionPaiqianFieldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero1:setName('hero1')
		
		self.validcmd = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.PAIQIAN, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		
		self.hdr = ExpeditionPaiqianFieldHdr()
		self.hdr.player = self.player
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testHerosCount = function(self) 
		local cmd = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.PAIQIAN, lineup=180001,count=5,hid1=1,hid2=2,hid3=0,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testTargetIsNull = function(self)
		local cmd = {ttype=OBJ_TYPE.FIELD,tid=2000,expedType=EXPED_TYPE.PAIQIAN, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, cmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testIsNotSelfField = function(self)
		TestCaseHelper:addSelfField(TestCaseHelper:loadPlayerByUserNameEx('other', 'other_r', 200003), {x=1, y=0})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testHasMySelfArmy = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestArmyResHelper:createArmy(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testSelfArmyIsFull = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		self.mm:mock(self.sourcePlayer:getArmyContainer(), 'isSelfArmyFull', {true})
		clearLastTimer_t()
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		assert( getLastTimer_t().eventid < 0 )
	end;
	
	testExpedOk = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assert ( army ~= nil )
		assert ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0) == armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		
		assert ( self.hero1:getState() == HERO_STATE.EXPED)
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:1,state:1}]}' ) == 1 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:0,flag:0,msgid:100011,params:[]}' ) == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msgid:100011,params:[]}' ) == 1 )
	end;
	
	test_isValidTarget = function(self)
		local r_isSelfField = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs'  )
		self.mm:mock(SelfFieldChecker, 'isSelfField', r_isSelfField )
		
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100071,''} )
		
		self.hdr.targetPlayer = OwnerFieldPlayer(2)
		self.mm:mock(self.hdr.targetPlayer, 'getObjType', {OBJ_TYPE.OWNERFIELD}  )
		assertEQ ( self.hdr:isValidTarget(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100083,''} )
		
		r_isSelfField[1] = true
		assertEQ ( self.hdr:isValidTarget(), true )
	end;
	
	test_isCanAddArmy = function(self)
		local r_isSelfArmyFull = {false}
		local r_hasSelfArmyInField = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getArmyContainer(), 'isSelfArmyFull', r_isSelfArmyFull )
		self.mm:mock(SelfFieldChecker, 'hasSelfArmyInField', r_hasSelfArmyInField )
		
		self.hdr.targetPlayer = FieldPlayer(2)
		assertEQ ( self.hdr:isCanAddArmy(), true )
		assertEQ ( self.mm.params['hasSelfArmyInField'], {self.player, self.hdr.targetPlayer} )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100094, ''} )
		
		self.mm:clear()
		r_isSelfArmyFull[1] = false
		r_hasSelfArmyInField[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.walkLog, 'isSelfArmyFull,hasSelfArmyInField,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100099, ''} )		
	end;
	
	test_moveSpeed = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		ExpeditionMgr:handle(self.sourcePlayer, self.validcmd)
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		local expectTime = army.needTime
		assertEQ ( math.abs(army.needTime - expectTime) < 2, true ) 
	end;
})

local TestCaseExpeditionTaofaFieldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero1:setName('hero1')
		
		self.validcmd_dantiao = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.DANTIAO, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		self.validcmd_zhanling = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.ZHANLING, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		
		self.hdr = ExpeditionDantiaoFieldHdr()
		self.hdr.player = self.player
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_addEnemyOwnerField = function(self)
		self.enemyPlayer = TestCaseHelper:loadPlayerByUserNameEx('enemy', 'enemy_r', 200003)
		TestCaseHelper:addSelfField(self.enemyPlayer, {x=1, y=0})
		self.sourcePlayer:addDeclareState(200003).state = REF_ROLESTATE.FIGHTING
	end;
	
	testExpedOkWhenTargetHasOwner = function(self)
		self:helper_addEnemyOwnerField()
		
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		self.mm:mock(global.getTimer(), 'start')
		
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao), true )
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assertEQ ( army ~= nil, true )
		assertEQ ( army.isMem, false )
		assertEQ ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0), armyId )
		assertEQ ( self.enemyPlayer:getArmyContainer():getEnemyArmyId(0), armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 1 )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.sourcePlayer} )
		assertEQ ( self.hero1:getState(), HERO_STATE.EXPED)
	end;	
	
	testExpedFailWhenTargetHasOwnerHasNoEnoughItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao), false )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4 )
	end;
	
	testExpedOkWhenTargetHasOwnerNotExpendItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=3})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 3 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 1, 'attack has owner field, not beyond today times, not expend item' )
	end;
	
	testExpedOkWhenTargetHasOwnerExpendItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 0, 'attack has owner field, beyond today times, need expend item' )
	end;
	
	testExpedOkWhenTargetHasNoOwner = function(self)
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_dantiao), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4, 'attack has no owner field, not add fightowner count' )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 1, 'attack has no owner field, not expend item' )
	end;
})

local TestCaseExpeditionZhanlingFieldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=0,soldier={resid=150001001,number=1}} } })
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero1:setName('hero1')
		
		self.validcmd_dantiao = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.DANTIAO, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		self.validcmd_zhanling = {ttype=OBJ_TYPE.FIELD,tid=2,expedType=EXPED_TYPE.ZHANLING, lineup=180001,count=5,hid1=1,hid2=0,hid3=0,hid4=0,hid5=0}
		
		self.hdr = ExpeditionZhanlingFieldHdr()
		self.hdr.player = self.player
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_addEnemyOwnerField = function(self)
		self.enemyPlayer = TestCaseHelper:loadPlayerByUserNameEx('enemy', 'enemy_r', 200003)
		TestCaseHelper:addSelfField(self.enemyPlayer, {x=1, y=0})
		self.sourcePlayer:addDeclareState(200003).state = REF_ROLESTATE.FIGHTING
	end;
	
	test_isCanAddArmy = function(self)
		local r_isFull = {false}
		self.mm:mock(WUtil, 'sendErrorMsgArgs' )
		self.mm:mock(self.player:getSelfField(), 'isFull', r_isFull )
		self.mm:mock(ExpeditionFightFieldHdr, 'isCanAddArmy', {true} )
		
		assertEQ ( self.hdr:isCanAddArmy(), true )
		assertEQ ( self.mm.params['isCanAddArmy'], {} )
		
		self.mm:clear()
		r_isFull[1] = true
		assertEQ ( self.hdr:isCanAddArmy(), false )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100098, ''} )		
	end;
	
	testExpedOkWhenTargetHasOwner = function(self)
		self:helper_addEnemyOwnerField()
		
		self.mm:mock(MilitarySender, 'sendTodayFTimes')
		self.mm:mock(global.getTimer(), 'start')
		
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling), true )
		local armyId = 1
		local army = app:getArmyMgr():getArmyById(armyId)
		assertEQ ( army ~= nil, true )
		assertEQ ( army.isMem, false )
		assertEQ ( self.sourcePlayer:getArmyContainer():getSelfArmyId(0), armyId )
		assertEQ ( self.enemyPlayer:getArmyContainer():getEnemyArmyId(0), armyId )
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_STOP )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 1 )
		assertEQ ( self.mm.params['sendTodayFTimes'], {self.sourcePlayer} )
		assertEQ ( self.hero1:getState(), HERO_STATE.EXPED)
	end;	
	
	testExpedFailWhenTargetHasOwnerHasNoEnoughItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling), false )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4 )
	end;
	
	testExpedOkWhenTargetHasOwnerNotExpendItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=3})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 3 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 1, 'attack has owner field, not beyond today times, not expend item' )
	end;
	
	testExpedOkWhenTargetHasOwnerExpendItem = function(self)
		self:helper_addEnemyOwnerField()
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4 + 1 )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 0, 'attack has owner field, beyond today times, need expend item' )
	end;
	
	testExpedOkWhenTargetHasNoOwner = function(self)
		self.sourcePlayer:getPkg():addItems({RawItemEx({resId=FIXID.CHUSHILING, number=1})})
		self.sourcePlayer:setTodayFightTimes({taofa=2, cuihui=2, tiaoxin=2, fightowner=4})
		assertEQ ( ExpeditionMgr:handle(self.sourcePlayer, self.validcmd_zhanling), true )
		local times = self.sourcePlayer:getTodayFightTimes()
		assertEQ ( times.fightowner, 4, 'attack has no owner field, not add fightowner count' )
		assertEQ ( self.sourcePlayer:getPkg():getItemNumber(FIXID.CHUSHILING), 1, 'attack has no owner field, not expend item' )
	end;
})

local TestCaseExpeditionMgr = TestCase:extends({
	testGetHandler = function(self)
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.TAOFA, ttype=OBJ_TYPE.ROLE}):getClass() == ExpeditionTaofaPlayerHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.CUIHUI, ttype=OBJ_TYPE.ROLE}):getClass() == ExpeditionCuihuiPlayerHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.TIAOXIN, ttype=OBJ_TYPE.ROLE}):getClass() == ExpeditionTiaoxinPlayerHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.PAIQIAN, ttype=OBJ_TYPE.ROLE}):getClass() == ExpeditionPaiqianPlayerHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.DANTIAO, ttype=OBJ_TYPE.FIELD}):getClass() == ExpeditionDantiaoFieldHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.ZHANLING, ttype=OBJ_TYPE.FIELD}):getClass() == ExpeditionZhanlingFieldHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.PAIQIAN, ttype=OBJ_TYPE.FIELD}):getClass() == ExpeditionPaiqianFieldHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.TAOFA, ttype=OBJ_TYPE.COPYFIELD}):getClass() == ExpeditionTaofaCopyFieldHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.ACT_TOWER, ttype=OBJ_TYPE.COPYFIELD}):getClass() == ExpeditionTaofaCopyFieldHdr )
		assert ( ExpeditionMgr:getHandler({expedType=EXPED_TYPE.ACT_WORLDBOSS, ttype=OBJ_TYPE.COPYFIELD}):getClass() == ExpeditionTaofaCopyFieldHdr )
	end;
})

tqExpeditionHdr_t_main = function(suite)
	suite:addTestCase(TestCaseExpeditionHdr, 'TestCaseExpeditionHdr')
	suite:addTestCase(TestCaseExpeditionTaofaCopyFieldHdr, 'TestCaseExpeditionTaofaCopyFieldHdr')
	suite:addTestCase(TestCaseExpeditionFightPlayerHdr, 'TestCaseExpeditionFightPlayerHdr')
	suite:addTestCase(TestCaseExpeditionTaofaPlayerHdr, 'TestCaseExpeditionTaofaPlayerHdr')
	suite:addTestCase(TestCaseExpeditionCuihuiPlayerHdr, 'TestCaseExpeditionCuihuiPlayerHdr')
	suite:addTestCase(TestCaseExpeditionTiaoxinPlayerHdr, 'TestCaseExpeditionTiaoxinPlayerHdr')
	suite:addTestCase(TestCaseExpeditionPaiqianPlayerHdr, 'TestCaseExpeditionPaiqianPlayerHdr')
	suite:addTestCase(TestCaseExpeditionFightFieldHdr, 'TestCaseExpeditionFightFieldHdr')
	suite:addTestCase(TestCaseExpeditionPaiqianFieldHdr, 'TestCaseExpeditionPaiqianFieldHdr')
	suite:addTestCase(TestCaseExpeditionTaofaFieldHdr, 'TestCaseExpeditionTaofaFieldHdr')
	suite:addTestCase(TestCaseExpeditionZhanlingFieldHdr, 'TestCaseExpeditionZhanlingFieldHdr')
	suite:addTestCase(TestCaseExpeditionMgr, 'TestCaseExpeditionMgr')
end;

