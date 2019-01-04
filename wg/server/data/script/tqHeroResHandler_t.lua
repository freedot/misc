require('tqHeroResHandler')

local TestCaseHeroResHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = HeroResHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(0):getClass() == FirstGetHerosInfoHdr )
		assert ( self.handler:getHandler(1):getClass() == GetHeroDetailInfoHdr )
		assert ( self.handler:getHandler(2):getClass() == HeroChangeNameHdr )
		assert ( self.handler:getHandler(4):getClass() == AssignHeroPPHdr )
		assert ( self.handler:getHandler(6):getClass() == ClearHeroPPHdr )
		assert ( self.handler:getHandler(8):getClass() == FireHeroHdr )
		assert ( self.handler:getHandler(13):getClass() == RefreshNewHerosHdr )
		assert ( self.handler:getHandler(15):getClass() == RecruitHeroHdr )
		assert ( self.handler:getHandler(33):getClass() == LockHeroHdr )
		assert ( self.handler:getHandler(34):getClass() == UnLockHeroHdr )
		assert ( self.handler:getHandler(35):getClass() == TreatmentHeroHdr )
		assert ( self.handler:getHandler(36):getClass() == CongeHeroOfficialHdr )
		assert ( self.handler:getHandler(37):getClass() == ConferHeroOfficialHdr )
		assert ( self.handler:getHandler(39):getClass() == SteelHeroSkeletonHdr )
		assert ( self.handler:getHandler(40):getClass() == UseItemInsightHeroSkillHdr )
		assert ( self.handler:getHandler(41):getClass() == SkillSteelHeroHdr )
		assert ( self.handler:getHandler(43):getClass() == WearHeroTSkillHdr )
		assert ( self.handler:getHandler(44):getClass() == TreatmentHerosHdr )
		assert ( self.handler:getHandler(45):getClass() == UnWearHeroTSkillHdr )
		assert ( self.handler:getHandler(46):getClass() == WearHeroArmHdr )
		assert ( self.handler:getHandler(47):getClass() == UnWearHeroArmHdr )
		assert ( self.handler:getHandler(48):getClass() == StopHeroSteelHdr )
		assert ( self.handler:getHandler(49):getClass() == SteelHeroHdr )
		assert ( self.handler:getHandler(50):getClass() == UpgradeHeroNAttrHdr )
	end;
})

local TestCaseRefreshNewHerosHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testRefreshNewHero = function(self)
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=10,state=0})
		
		local _res_get_bak = res_get_rand_newhero_level
		res_get_rand_newhero_level = function() return 3 end
		local cmd = {useitem=1}
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		RefreshNewHerosHdr:handle(self.player, cmd)
		local newhero = self.player:getHeroMgr():getNewHeros():getNewHero(0)
		res_get_rand_newhero_level = _res_get_bak
		
		assert( newhero.ucLevel == 3 )
		local attrcnt = newhero.astAttrs[0].ulVal + newhero.astAttrs[2].ulVal + newhero.astAttrs[4].ulVal
		local addcnt = res_get_hero_ppoint(2).sys + res_get_hero_ppoint(2).free + res_get_hero_ppoint(3).sys + res_get_hero_ppoint(3).free
		local basecnt = res_init_newheros.prof1[1].val + res_init_newheros.prof1[3].val + res_init_newheros.prof1[5].val
		
		assert( attrcnt == basecnt + addcnt )
	end;

})

local TestCaseHeroResHandler_bak = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	useItemRefreshHeros = function(self)
		local cmd = {useitem=1}
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		RefreshNewHerosHdr:handle(self.player, cmd)
	end;
	
	isvalidHero = function(self, hero)
		return hero:getLevel() > 0 
			and hero:getIcon() > 0 
			and hero:getName() ~= '' 
			and hero:getId() > 0 
			and hero:getAttrsCount() > 0
			and hero:getAttr(ATTR.SFC) ~= nil
			and ( hero:getSubject(0) > 0 and hero:getSubject(4) > 0 )
	end;
	
	testRefreshNewHerosHdr = function(self)
		local cmd = {}
		RefreshNewHerosHdr:handle(self.player, cmd)
		assert( getSendMsg_t() ~= '' )
	end;
	
	testRefreshNewHerosByItemHdr = function(self)
		local cmd = {useitem=1}
		RefreshNewHerosHdr:handle(self.player, cmd)
		assert( getSendMsg_t() == '' )
		
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		RefreshNewHerosHdr:handle(self.player, cmd)
		assert( getSendMsg_t() ~= '' )
	end;
	
	testRecruitHeroHdr = function(self)
		self:useItemRefreshHeros()
		
		local cmd = {id=2}
		assert ( RecruitHeroHdr:getParam(self.player, cmd) == true )
		assert ( RecruitHeroHdr:isValidHeroId() == false )
		
		local cmd = {id=1}
		assert ( RecruitHeroHdr:getParam(self.player, cmd) == true )
		assert ( RecruitHeroHdr:isValidHeroId() == true )
		assert ( RecruitHeroHdr:isHerosCountFull() == false )
		
		local cmd = {id=1}
		self.player:getHeroMgr().getHeroCount = function() return 2 end
		assert ( RecruitHeroHdr:getParam(self.player, cmd) == true )
		assert ( RecruitHeroHdr:isValidHeroId() == true )
		assert ( RecruitHeroHdr:isHerosCountFull() == true )
	end;
	
	testRecruitHeroHdrOk = function(self)
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.mm:mock(TaskFinisher, 'trigerTask')
		local _res_get_bak = res_get_rand_newhero_level
		res_get_rand_newhero_level = function() return 3 end
		self:useItemRefreshHeros()
		res_get_rand_newhero_level = _res_get_bak
		
		clearSendMsg_t()
		local cmd = {id=1}
		RecruitHeroHdr:handle(self.player, cmd)
		assert(self.player:getHeroMgr():getHeroCount() == 1)
		assert(self.player:getHeroMgr():getNewHeros():getNewHerosCount() == 0)
		local hero = self.player:getHeroMgr():getHeroByIdx(0)
		assert( self:isvalidHero( hero ) == true )
		assert( getSendMsgCnt_t() == 2 )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.HERO_UPGRADE, 3} )
		
		local hero = self.player:getHeroMgr():getHeroByIdx(0)
		assert(hero:getLevel() == 3)
		assert(hero:getAttrVal(ATTR.PP) == 0)
	end;
})

local TestCaseFireHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.heromgr = self.player:getHeroMgr()
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		FireHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testHeroState = function(self)
		self.hero:setState(1);
		self.hero:setLockState(HERO_LOCKSTATE.NONE);
		local cmd = {id=self.hero:getId()}
		FireHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		
		self.hero:setState(0);
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED);
		local cmd = {id=self.hero:getId()}
		FireHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		
		self.hero:setState(0);
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING);
		local cmd = {id=self.hero:getId()}
		FireHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testHdrOk = function(self)
		local soldierResid = 1
		local heroid = self.hero:getId()
		self.hero:carrySoldier({resid=soldierResid, number=1})
	
		assert ( self.player:getSoldierMgr():getSoldierNumber(soldierResid) ==  0 )
		clearSendMsg_t()
		
		local cmd = {id=heroid}
		FireHeroHdr:handle(self.player, cmd)
		
		assert ( self.player:getSoldierMgr():getSoldierNumber(soldierResid) ==  1, 'return one soldier to soldiermgr ' )
		assert ( self.heromgr:getHeroById(heroid) == nil, 'delete this hero from heromgr' )
		
		assert ( getSendMsgCnt_t() == 3 );
	end;
})

local TestCaseLockHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.heromgr = self.player:getHeroMgr()
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInvalidHeroState = function(self)
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		self.hero:setState(HERO_STATE.EXPED);
		local cmd = {id=self.hero:getId()}
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInValidLockState = function(self)
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		local cmd = {id=self.hero:getId()}
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		local cmd = {id=self.hero:getId()}
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;	
	
	testLockOk = function(self)
		local cmd = {id=self.hero:getId()}
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		self.hero:setState(HERO_STATE.FREE);
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 1 );
		assert( self.hero:getLockState() == 1 );
		
		clearSendMsg_t()
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		self.hero:setState(HERO_STATE.STEEL);
		LockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 1 );
	end;
})

local TestCaseUnLockHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.heromgr = self.player:getHeroMgr()
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInValidHeroState = function(self)
		local cmd = {}
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		self.hero:setState(HERO_STATE.EXPED);
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInValidLockState = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		local cmd = {id=self.hero:getId()}
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		assertEQ( self.mm.walkLog, '' )
		
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		local cmd = {id=self.hero:getId()}
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		assertEQ( self.mm.walkLog, '' )
	end;
	
	testLockOk = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		self.hero:setState(HERO_STATE.FREE);
		local cmd = {id=self.hero:getId()}
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 1 );
		assert ( self.hero:getLockState() == HERO_LOCKSTATE.UNLOCKING )
		assertEQ ( self.mm.params['start'], {res_unlock_hero_time*1000, {TIMER_EVT.HERO_UNLOCK_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
		
		clearSendMsg_t()
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		self.hero:setState(HERO_STATE.STEEL)
		UnLockHeroHdr:handle(self.player, cmd)
		assert ( self.hero:getLockState() == HERO_LOCKSTATE.UNLOCKING )
	end;
})

local TestCaseHeroChangeNameHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1, name="abc"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInValidHeroState = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.hero:setState(HERO_STATE.STEEL)
		self.player:getPkg():setGold(res_hero_changename_need_gold);
		local cmd = {id=self.hero:getId(), name="abcd"}
		HeroChangeNameHdr:handle(self.player, cmd)
		
		assert ( self.player:getPkg():getGold() == res_hero_changename_need_gold )
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testNotEnoughMoney = function(self)
		self.player:getPkg():setGold(0);
		self.player:getPkg():setGiftGold(0);
		local cmd = {id=self.hero:getId(), name="abc"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2 );
		assert ( self.hero:getName() ~= 'abc' );
	end;
	
	testInVaildName = function(self)
		clearSendMsg_t()
		self.player:getPkg():setGold(res_hero_changename_need_gold);
		self.player:getPkg():setGiftGold(0);
		local cmd = {id=self.hero:getId(), name="ab'c"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getGold() ~= 0, 'include invalid char' );
		assert ( getSendMsgCnt_t() == 2 );
		assert ( self.hero:getName() ~= "ab'c" );
		
		clearSendMsg_t()
		local cmd = {id=self.hero:getId(), name="ab"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getGold() ~= 0, 'too short' );
		assert ( getSendMsgCnt_t() == 2 );
		assert ( self.hero:getName() ~= "ab" );
		
		clearSendMsg_t()
		local cmd = {id=self.hero:getId(), name="a12345678"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getGold() ~= 0, 'too long' );
		assert ( getSendMsgCnt_t() == 2 );
		assert ( self.hero:getName() ~= "a12345678" );
		
		clearSendMsg_t()
		local cmd = {id=self.hero:getId(), name="fuck"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getGold() ~= 0, 'include filter word' );
		assert ( getSendMsgCnt_t() == 2 );
		assert ( self.hero:getName() ~= "fuck" );
	end;
	
	testChangeNameOk = function(self)
		self.hero:setName('hero1')
		self.player:getPkg():setGold(res_hero_changename_need_gold/2);
		self.player:getPkg():setGiftGold(res_hero_changename_need_gold/2);
		local cmd = {id=self.hero:getId(), name="abcd"}
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.hero:getName() == 'hero1' );
		
		self.player:getPkg():setGold(res_hero_changename_need_gold);
		HeroChangeNameHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getGold() == 0 )
		assert ( self.player:getPkg():getGiftGold() == res_hero_changename_need_gold/2 )
		assert ( getSendMsgCnt_t() >= 2 );
		assert ( self.hero:getName() == 'abcd' );
	end;
})

local TestCaseTreatmentHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.heromgr = self.player:getHeroMgr()
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		
		local res = ItemResUtil:findItemres(FIXID.SALVE)
		res.effects[1].val = 1;
		
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		TreatmentHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidHeroState = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, self.hero:getAttrVal(ATTR.MHEALTH) - 10 )
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.SALVE, number=10})})
		clearSendMsg_t()
		
		local cmd = {id=1}
		self.hero:setState(HERO_STATE.EXPED)
		TreatmentHeroHdr:handle(self.player, cmd)
		assert ( selectSendMsgCnt_t('has@{cmd:82,type:') == 2 )
	end;
	
	testNoNeedTreatment = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, self.hero:getAttrVal(ATTR.MHEALTH) )
		
		local cmd = {id=1}
		TreatmentHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNotEnoughItem = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, self.hero:getAttrVal(ATTR.MHEALTH) - 10 )
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.SALVE, number=1})})
		clearSendMsg_t()
		
		local cmd = {id=1}
		TreatmentHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testTreatmentOk = function(self)
		self.hero:setAttrVal(ATTR.HEALTH, self.hero:getAttrVal(ATTR.MHEALTH) - 10 )
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.SALVE, number=10})})
		clearSendMsg_t()
		
		local cmd = {id=1}
		TreatmentHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() > 0 )
	end;
})

local TestCaseTreatmentHerosHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.soldierMgr = self.player:getSoldierMgr()
		self.heroMgr = self.player:getHeroMgr()
		TestCaseCondition:setPreCond(self.player, nil, {soldiers={{resid=150001001,number=10}},heros={{state=0},{state=0} } })
	
		local res = ItemResUtil:findItemres(FIXID.SALVE)
		res.effects[1].val = 1;
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidHeroCount = function(self)
		local cmd = {count=0}
		TreatmentHerosHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidHeroId = function(self)
		local cmd = {count=2,id1=1,id2=3}
		TreatmentHerosHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoNeedTreatment = function(self)
		local hero1 = self.heroMgr:getHeroById(1)
		local hero2 = self.heroMgr:getHeroById(2)
		hero1:setAttrVal(ATTR.HEALTH, hero1:getAttrVal(ATTR.MHEALTH))
		hero2:setAttrVal(ATTR.HEALTH, hero2:getAttrVal(ATTR.MHEALTH))
		
		local cmd = {count=2,id1=1,id2=2}
		TreatmentHerosHdr:handle(self.player, cmd)

		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNotEnoughItem = function(self)
		local hero1 = self.heroMgr:getHeroById(1)
		local hero2 = self.heroMgr:getHeroById(2)
		hero1:setAttrVal(ATTR.HEALTH, 0)
		hero2:setAttrVal(ATTR.HEALTH, hero2:getAttrVal(ATTR.MHEALTH))
		
		SendMsgStub:clear()
		local cmd = {count=2,id1=1,id2=2}
		TreatmentHerosHdr:handle(self.player, cmd)
		assertEQ ( SendMsgStub:getCount(), 0 )
	end;
	
	testTreatmentOk = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {item={id=FIXID.SALVE, num=10} })
		local hero1 = self.heroMgr:getHeroById(1)
		local hero2 = self.heroMgr:getHeroById(2)
		hero1:setAttrVal(ATTR.HEALTH, (hero1:getAttrVal(ATTR.MHEALTH)-10))
		hero2:setAttrVal(ATTR.HEALTH, hero2:getAttrVal(ATTR.MHEALTH))

		local cmd = {count=2,id1=1,id2=2}
		TreatmentHerosHdr:handle(self.player, cmd)
		assert ( hero1:getAttrVal(ATTR.HEALTH) == hero1:getAttrVal(ATTR.MHEALTH) )
		assert ( self.player:getPkg():getItemNumber(FIXID.SALVE) == 0 )
		assert ( getSendMsgCnt_t() > 0 )
	end;
})

local TestCaseAssignHeroPPHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidHeroState = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		self.hero:addExp(self.player, 400)
		self.hero:setAttrVal(ATTR.PP, 3);
		clearSendMsg_t()
		
		self.hero:setState( HERO_STATE.EXPED )
		local cmd = {id=1,p0=1,p1=1,p2=1}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
		
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testInValidPPAssign_negative = function(self)
		local cmd = {id=1,p0=-1,p1=0,p2=0}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidPPAssign_zero = function(self)
		local cmd = {id=1,p0=0,p1=0,p2=0}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidPPAssign_beyond = function(self)
		local cmd = {id=1,p0=10,p1=10,p2=10}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testPPAssignOk = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.player:setAttrVal(ATTR.FOR_B, 100)
		self.hero:addExp(self.player, 400)
		local oldST = self.hero:getAttrVal(ATTR.ST_B)
		local oldAG = self.hero:getAttrVal(ATTR.AG_B)
		local oldPH = self.hero:getAttrVal(ATTR.PH_B)
		local oldSFC = self.hero:getAttrVal(ATTR.SFC)
		local oldHU = self.hero:getAttrVal(ATTR.HU)
		local oldDE = self.hero:getAttrVal(ATTR.DE)
		self.hero:setAttrVal(ATTR.PP, 3);
		
		local cmd = {id=1,p0=1,p1=1,p2=1}
		AssignHeroPPHdr:handle(self.player, cmd)
		assert ( self.hero:getAttrVal(ATTR.PP) == 0 )
		assert ( self.hero:getAttrVal(ATTR.ST_B) == oldST + 1 )
		assert ( self.hero:getAttrVal(ATTR.ST_B) == self.hero:getAttrVal(ATTR.ST_A) )
		assert ( self.hero:getAttrVal(ATTR.AG_B) == oldAG + 1 )
		assert ( self.hero:getAttrVal(ATTR.PH_B) == oldPH + 1 )
		assert ( self.hero:getAttrVal(ATTR.SFC) > oldSFC )
		assert ( self.hero:getAttrVal(ATTR.HU) > oldHU )
		assert ( self.hero:getAttrVal(ATTR.DE) > oldDE )
		assert ( getSendMsgCnt_t() ~= 0 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.ASSIGN_HERO_ATTR} )
	end;
})

local TestCaseClearHeroPPHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		ClearHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidHeroState = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(ClearHeroPPHdr, 'isNeedClear' )
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = {id=1}
		ClearHeroPPHdr:handle(self.player, cmd)
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testNoNeedClear = function(self)
		self.hero:addExp(self.player, 400)
		
		clearSendMsg_t()
		local cmd = {id=1}
		ClearHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughItems = function(self)
		self.hero:addExp(self.player, 400)
		self.hero:setAttrVal(ATTR.ST_B, self.hero:getAttrVal(ATTR.ST_B) + 1)
		
		clearSendMsg_t()
		local cmd = {id=1}
		ClearHeroPPHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testClearPPOk = function(self)
		self.player:setAttrVal(ATTR.FOR_B, 100)
		self.hero:addExp(self.player, 400)
		self.hero:setAttrVal(ATTR.ST_B, self.hero:getAttrVal(ATTR.ST_B) + 1)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.CLEARPP, number=1})})
		
		local oldPP = self.hero:getAttrVal(ATTR.PP)
		local oldST = self.hero:getAttrVal(ATTR.ST_B)
		
		clearSendMsg_t()
		local cmd = {id=1}
		ClearHeroPPHdr:handle(self.player, cmd)
		assert ( self.hero:getAttrVal(ATTR.ST_B) ==  oldST - 1 )
		assert ( self.hero:getAttrVal(ATTR.ST_B) == self.hero:getAttrVal(ATTR.ST_A) )
		assert ( self.hero:getAttrVal(ATTR.PP) ==  oldPP + 1 )
		assert ( self.player:getPkg():getItemNumber(FIXID.CLEARPP) == 0 )
		assert ( getSendMsgCnt_t() ~= 0 )
	end;
	
})


local TestCaseCongeHeroOfficialHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.heromgr = self.player:getHeroMgr()
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		CongeHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoOfficial = function(self)
		self.hero:setOfficial(0)
		self.hero:getInner().stSoldier.ulNumber = 0
		self.hero:setState(0)
		local cmd = {id=1}
		CongeHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHasSoldier = function(self)
		self.hero:setOfficial(1)
		self.hero:getInner().stSoldier.number = 1
		self.hero:setState(0)
		local cmd = {id=1}
		CongeHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHeroState = function(self)
		self.hero:setOfficial(1)
		self.hero:getInner().stSoldier.ulNumber = 0
		self.hero:setState(1)
		local cmd = {id=1}
		CongeHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testCongeOk = function(self)
		self.hero:setOfficial(1)
		self.hero:getInner().stSoldier.ulNumber = 0
		self.hero:setState(0)
		
		local oldcommand = self.hero:getAttrVal(ATTR.CO)
		
		clearSendMsg_t()
		local cmd = {id=1}
		CongeHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 0 )
		assert( self.hero:getAttrVal(ATTR.CO) < oldcommand )
		assert ( getSendMsgCnt_t() == 2 )
	end;
	
})


local TestCaseConferHeroOfficialHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setLevel(5)
		self.heromgr = self.player:getHeroMgr()
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		self.sechero = HeroTestCaseHelper:createOneNewHero(self.player, self.heromgr)
		
		res_heroofficials[1].needitem = 1
		res_heroofficials[1].needcredit = 1
		
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	setPreCondition = function(self, p)
		self.sechero:setOfficial(p.otherofficial)
		
		self.hero:setState(p.state)
		self.hero:setOfficial(p.official)
		self.hero:setAttrVal(ATTR.CRE, p.credit)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.TIGERCARD, number=p.itemnum})});
		clearSendMsg_t()
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidOfficialId = function(self)
		local cmd = {id=1,official=-1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHeroState = function(self)
		self:setPreCondition({state=1, official=0, credit=1, itemnum=1, otherofficial=0})
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 0 )
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHasOfficial = function(self)
		self:setPreCondition({state=0, official=1, credit=1, itemnum=1, otherofficial=0})
		
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 1 )
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testFullOfficials = function(self)
		self:setPreCondition({state=0, official=0, credit=1, itemnum=1, otherofficial=1})
		
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 0 )
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughTigerCard = function(self)
		self:setPreCondition({state=0, official=0, credit=1, itemnum=0, otherofficial=0})
		
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 0 )
		assert ( getSendMsgCnt_t() ~= 0 )
	end;
	
	testNoEnoughCredit = function(self)
		self:setPreCondition({state=0, official=0, credit=0, itemnum=1, otherofficial=0})
		
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 0 )
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testConferOk = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask' )
		self:setPreCondition({state=0, official=0, credit=1, itemnum=1, otherofficial=0})
		
		local oldcommand = self.hero:getAttrVal(ATTR.CO)
	
		local cmd = {id=1,official=1}
		ConferHeroOfficialHdr:handle(self.player, cmd)
		assert ( self.hero:getOfficial() == 1 )
		assert ( self.hero:getAttrVal(ATTR.CRE) == 1 )
		assert ( self.player:getPkg():getItemNumber(FIXID.TIGERCARD) == 0 )
		assert ( self.hero:getAttrVal(ATTR.CO) == oldcommand + res_heroofficials[1].addcom )
		assert ( getSendMsgCnt_t() == 3 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.CONFER_HERO_OFFICAL} )
	end;
	
})

local TestCaseSteelHeroSkeletonHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	setPreCondition = function(self, p)
		local innerhero = self.hero:getInner()
		innerhero.ucLevel = p.herolevel
		self.hero:setSkeletonLevel(p.slevel)
		self.hero:setSSteelStopTime(p.steelstoptime);
		self.hero:setAttrVal(ATTR.IF, p.curif)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.MAILUODAN, number=p.itemnum})});
		self.player:getCityRes():setMoney(p.money);
		res_herojingmai[8].itemid = FIXID.MAILUODAN
		res_herojingmai[8].needitem = 1
		res_herojingmai[8].needmoney = 1
		res_herojingmai[8].needtime = 30
		clearSendMsg_t()
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidHeroState = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(SteelHeroSkeletonHdr, 'getExpends' )
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = {id=self.hero:getId()}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testHeroIsSteeling = function(self)
		self:setPreCondition({steelstoptime=30, slevel=7, herolevel=150, curif=400, itemnum=1, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testFullSkeletonLevel = function(self)
		self:setPreCondition({steelstoptime=0, slevel=8, herolevel=150, curif=400, itemnum=1, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughHeroLevel = function(self)
		self:setPreCondition({steelstoptime=0, slevel=7, herolevel=1, curif=400, itemnum=1, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughIF = function(self)
		self:setPreCondition({steelstoptime=0, slevel=7, herolevel=150, curif=0, itemnum=1, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughItem = function(self)
		self:setPreCondition({steelstoptime=0, slevel=7, herolevel=150, curif=400, itemnum=0, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2 )
		assert ( self.player:getCityRes():getMoney() == 1 )
	end;
	
	testNoEnoughMoney = function(self)
		self:setPreCondition({steelstoptime=0, slevel=7, herolevel=150, curif=400, itemnum=1, money=0})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2)
		assert ( self.player:getPkg():getItemNumber(FIXID.MAILUODAN) == 1 )
	end;
	
	testSteelOK = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self:setPreCondition({steelstoptime=0, slevel=7, herolevel=150, curif=400, itemnum=1, money=1})
		local cmd = {id=1}
		SteelHeroSkeletonHdr:handle(self.player, cmd)

		assert ( self.player:getPkg():getItemNumber(FIXID.MAILUODAN) == 0 )
		assert ( self.player:getCityRes():getMoney() == 0 )
		assertEQ ( self.mm.params['start'], {30*1000, {TIMER_EVT.SSTEEL_HERO_STOP, self.hero:getId()}, self.player:getTimerCaller()} )
		assert ( self.hero:getSSteelStopTime() == Util:getTime() + 30 )
		assert ( getSendMsgCnt_t() > 1 )
		assert ( isInclude(getSendMsg_t(), 'id:1', 'skeleton:', 'stoptime:') == true )
	end;
})

local TestCaseInsightHeroSkillHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	setPreCondition = function(self, p)
		if p.item ~= nil then
			self.player:getPkg():addItems({RawItemEx({resId=p.item.id, number=p.item.num})});
		end
		
		if p.herolevel ~= nil then
			local innerhero = self.hero:getInner()
			innerhero.ucLevel = p.herolevel
		end
		
		if p.skills ~= nil then
			for _, skill in ipairs(p.skills) do
				self.hero:addSkill(skill)
			end
		end
		
		clearSendMsg_t()
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		UseItemInsightHeroSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testValidHeroState = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(UseItemInsightHeroSkillHdr, 'getExpends' )
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = {id=self.hero:getId()}
		UseItemInsightHeroSkillHdr:handle(self.player, cmd)
		
		assert ( self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testNoEmptySkillGrid = function(self)
		self:setPreCondition({item={id=FIXID.LINGWUDAN,num=99}, herolevel=60, skills={{resid=6001008,level=1},{resid=6001009,level=1}}})
		local cmd = {id=1}
		UseItemInsightHeroSkillHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getItemNumber(FIXID.LINGWUDAN) == 99 )
		assert ( getSendMsgCnt_t() == 0 )
		assert ( self.hero:getSkillCount() == 2 )
	end;
	
	testNoEnoughItem = function(self)
		self:setPreCondition({herolevel=60, skills={{resid=6001008,level=1}}})
		local cmd = {id=1}
		UseItemInsightHeroSkillHdr:handle(self.player, cmd)
		assert ( self.hero:getSkillCount() == 1 )
		assert ( getSendMsgCnt_t() == 2 )
	end;
	
	testInsight_OK = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self:setPreCondition({item={id=FIXID.LINGWUDAN,num=99}, herolevel=60, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1}
		UseItemInsightHeroSkillHdr:handle(self.player, cmd)
		assert ( self.player:getPkg():getItemNumber(FIXID.LINGWUDAN) == 98 )
		assert ( self.hero:getSkillCount() == 3 )
		assert ( self.hero:getSkillByIdx(2).ucLevel <= res_insight_skill_max_level )
		assert ( self.hero:getSkillByIdx(2).ulResId ~= 6001008 )
		assert ( getSendMsgCnt_t() == 4 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.HERO_INSIGHT_SKILL} )
	end;
})

local TestCaseSkillSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	setPreCondition = function(self, p)
		if p.skills ~= nil then
			for _, skill in ipairs(p.skills) do
				self.hero:addSkill(skill)
			end
		end
		
		if p.sstime ~= nil then
			local heromgr = self.player:getHeroMgr()
			heromgr:setCanUseSkillSteelTime(p.sstime)
		end
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testValidHeroState = function(self)
		local g_player = self.player
		local g_hero = self.hero
		self.mm:mock(SkillSteelHeroHdr, 'getParam', {true}, function(self)
			self.player = g_player
			self.hero = g_hero
			end )
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(g_player, 'getHeroMgr')
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = { id=self.hero:getId() }
		SkillSteelHeroHdr:handle(self.player, cmd)
		
		assert ( self.mm.walkLog == 'getParam,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;
	
	testInValidSkillId_InvalidRange = function(self)
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001001,stime=1}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	 
	testInValidSkillId_HasNoThisSkill = function(self)
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001009,stime=1}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidSkillId_SkillFullLevel = function(self)	
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=20}}})
		local cmd = {id=1,skillid=6001008,stime=1}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidTimeNum_BeyondOneTimeMaxCanTime = function(self)
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001008,stime=10000}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidTimeNum_ZeroNum = function(self)
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001008,stime=0}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInValidTimeNum_NoEnoughNum = function(self)
		self:setPreCondition({sstime=1, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001008,stime=2}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testHasSkillSteeling = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self:setPreCondition({sstime=10000, skills={{resid=6001001,level=1},{resid=6001008,level=1}}})
		local cmd = {id=1,skillid=6001008,stime=2}
		SkillSteelHeroHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() ~= 0 )
		assert ( self.player:getHeroMgr():getCanUseSkillSteelTime() == 10000 - 2 )
		assert( self.hero:getSkillSteel().ulStoptime == Util:getTime() + 2 * 3600 )
		assertEQ ( self.mm.params['start'], {2*3600*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, self.hero:getId(), 6001008}, self.player:getTimerCaller()} )
		
		assert( self.hero:getSkillSteel().ulResId == 6001008 )
		
		assert( self.hero:getSkillSteel().ulDurtime == 2 )
	end;
})


local TestCaseWearHeroTSkillHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1, skillid=6001001}
		WearHeroTSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testValidHeroState = function(self)
		local g_player = self.player
		local g_hero = self.hero
		self.mm:mock(WearHeroTSkillHdr, 'getParam', {true}, function(self)
			self.player = g_player
			self.hero = g_hero
			end )
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(WearHeroTSkillHdr, 'hasSkill')
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = { id=self.hero:getId() }
		WearHeroTSkillHdr:handle(self.player, cmd)
		
		assert ( self.mm.walkLog == 'getParam,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;	
	
	testInValidSkill = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, curtskill=0} })
		local cmd = {id=1, skillid=6001001}
		WearHeroTSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testIsWeared = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, curTacticSkillId=6001001, skills={{resid=6001001,level=1}}} })
		local cmd = {id=1, skillid=6001001}
		WearHeroTSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testWear_OK = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, curTacticSkillId=6001002, skills={{resid=6001001,level=1},{resid=6001002,level=1}}} })
		local cmd = {id=1, skillid=6001001}
		WearHeroTSkillHdr:handle(self.player, cmd)
		assert( self.hero:getCurTacticSkillId() ==  6001001 )
		assert ( getSendMsgCnt_t() > 0 )
		assert ( isInclude(getSendMsg_t(), 'curtskill:6001001') == true )
	end;
});

local TestCaseUnWearHeroTSkillHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testInValidHeroId = function(self)
		local cmd = {id=-1}
		UnWearHeroTSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testValidHeroState = function(self)
		local g_player = self.player
		local g_hero = self.hero
		self.mm:mock(UnWearHeroTSkillHdr, 'getParam', {true}, function(self)
			self.player = g_player
			self.hero = g_hero
			end )
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(UnWearHeroTSkillHdr, 'isWeared')
		
		self.hero:setState(HERO_STATE.EXPED)
		local cmd = { id=self.hero:getId() }
		UnWearHeroTSkillHdr:handle(self.player, cmd)
		
		assert ( self.mm.walkLog == 'getParam,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100022, ''} )
	end;		
	
	testIsNoWeared = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, curTacticSkillId=0} })
		local cmd = {id=1}
		UnWearHeroTSkillHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testWear_OK = function(self)
		TestCaseCondition:setPreCond(self.player, self.hero, {hero={level=60, curTacticSkillId=6001001} })
		local cmd = {id=1}
		UnWearHeroTSkillHdr:handle(self.player, cmd)
		assert( self.hero:getCurTacticSkillId() ==  0 )
		assert ( getSendMsgCnt_t() > 0 )
		assert ( isInclude(getSendMsg_t(), 'curtskill:0') == true )
	end;
});

local TestCaseWearHeroArmHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		res_test_items = {
			{id=1,pile=1}
			,{id=2,apos=0,pile=1}
			,{id=3,apos=1,targets={},pile=1 }
			,{id=4,apos=1,targets={RES_TRG.SELF_HERO},needlevel=10,pile=1 } 
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:restoreRes()
		TestCaseHelper:clearAll(self);
	end;

	testHandle = function(self)
		local g_player = self.player
		local g_hero = self.hero
		local g_cmd = {}
		
		local g_initParamRt = {false}
		local g_isFitLevelRt = {false}
		local g_hasCoAttrInCurWearRt = {true}
		local g_getArmByArmPosRt = {{}}
		self.mm:mock(WearHeroArmHdr, '_initParam', g_initParamRt, function(self)
			self.itemRes = {needlevel=10,apos=1}
			self.item = LuaItemEx({id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=0,gems={}}})
			self.player = g_player
			self.hero = g_hero end)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(WearHeroArmHdr, '_isFitLevel', g_isFitLevelRt)
		self.mm:mock(WearHeroArmHdr, '_hasCoAttrInCurWear', g_hasCoAttrInCurWearRt)
		local g_willWearItem = WearHeroArmHdr:_allocTempItem()
		self.mm:mock(WearHeroArmHdr, '_allocTempItem', {g_willWearItem})
		self.mm:mock(g_willWearItem, 'copyFrom')
		self.mm:mock(self.player:getPkg(), 'delItemById')
		self.mm:mock(ItemMsgSender, 'sendDelItem')
		self.mm:mock(g_hero:getWearContainer(), 'getArmByArmPos', g_getArmByArmPosRt)
		self.mm:mock(g_hero:getWearContainer(), 'unWear')
		self.mm:mock(self.player:getPkg(), 'returnItems')
		self.mm:mock(g_hero:getWearContainer(), 'wear')
		self.mm:mock(WearHeroArmHdr, '_freeTempItem')
		self.mm:mock(HeroAttrSender, 'sendUnWear')
		self.mm:mock(HeroAttrSender, 'sendWear')
		self.mm:mock(HeroAttrHelper, 'recalcAttrs')
		self.mm:mock(TaskFinisher, 'trigerTask')
			
		assert ( WearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ(self.mm.params['_initParam'], {g_player, g_cmd})
		
		self.mm:clear()
		g_hero:setState(1)
		g_initParamRt[1] = true
		assert ( WearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ( self.mm.params['sendWarningMsgArgs'], {g_player, 100018, ''} )
		
		self.mm:clear()
		g_hero:setState(0)
		assert ( WearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ( self.mm.params['sendWarningMsgArgs'], {g_player, 100019, '10'} )
		
		self.mm:clear()
		g_isFitLevelRt[1] = true
		assert ( WearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ( self.mm.params['sendWarningMsgArgs'], {g_player, 100020, '"@armpos1"'} )
		
		self.mm:clear()
		g_hasCoAttrInCurWearRt[1] = false
		assert ( WearHeroArmHdr:handle(g_player, g_cmd) == true )
		
		assert ( self.mm.walkLog == '_initParam,_isFitLevel,_hasCoAttrInCurWear,_allocTempItem,copyFrom,delItemById,sendDelItem,getArmByArmPos,returnItems,unWear,wear,_freeTempItem,sendUnWear,sendWear,recalcAttrs,trigerTask' )
		assertListEQ ( self.mm.params['copyFrom'], {WearHeroArmHdr.item} )
		assertListEQ ( self.mm.params['delItemById'], {WearHeroArmHdr.item:getId()} )
		assertListEQ ( self.mm.params['sendDelItem'], {g_player, WearHeroArmHdr.item:getId()} )
		assert ( self.mm.params['returnItems'][1][1] == g_getArmByArmPosRt[1] )
		assertListEQ ( self.mm.params['unWear'], {1} )
		assertListEQ ( self.mm.params['wear'], {1, g_willWearItem} )
		assertListEQ ( self.mm.params['_freeTempItem'], {g_willWearItem} )
		assertListEQ ( self.mm.params['sendUnWear'], {g_player, g_hero, 1} )
		assertListEQ ( self.mm.params['sendWear'], {g_player, g_hero, 1} )
		assertListEQ ( self.mm.params['recalcAttrs'], { self.player, g_hero } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.WEAR_HERO_ARM} )
	end;
	
	test_initParam = function(self)
		assert ( WearHeroArmHdr:_initParam(self.player, {}) == false )
		assert ( WearHeroArmHdr.player == self.player )
		
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=2}) == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=1, num=1} })
		local item = self.player:getPkg():getItemByResId(1)
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId()}) == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=2, num=1} })
		local item = self.player:getPkg():getItemByResId(2)
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId()}) == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=3, num=1} })
		local item = self.player:getPkg():getItemByResId(3)
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId()}) == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=4, num=1} })
		local item = self.player:getPkg():getItemByResId(4)
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId()}) == false )
		
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId(), heroId=10000}) == false )
		assert ( WearHeroArmHdr:_initParam(self.player, {itemId=item:getId(), heroId=self.hero:getId()}) == true )
		
		assert ( WearHeroArmHdr.item == item )
		assert ( WearHeroArmHdr.itemRes == ItemResUtil:findItemres(4) )
		assert ( WearHeroArmHdr.hero == self.hero )
	end;
	
	test_isFitLevel = function(self)
		WearHeroArmHdr.itemRes = ItemResUtil:findItemres(4)
		WearHeroArmHdr.hero = self.hero
		
		assert ( WearHeroArmHdr:_isFitLevel() == false )
		
		self.hero:getInner().ucLevel = 10
		assert ( WearHeroArmHdr:_isFitLevel() == true )
	end;
	
	test_hasCoAttrInCurWear = function(self)
		WearHeroArmHdr.hero = self.hero
		local g_armPos = 1
		WearHeroArmHdr.itemRes = {apos=g_armPos} 
		assert ( WearHeroArmHdr:_hasCoAttrInCurWear() == false )
		
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=0,val=0,unit=0}
		local g_arm = ItemEx(g_resItem)
		self.hero:getWearContainer():wear(g_armPos, g_arm)
		assert ( WearHeroArmHdr:_hasCoAttrInCurWear() == false )
		
		local g_armPos = 2
		WearHeroArmHdr.itemRes = {apos=g_armPos} 
		g_arm:addAttr({attr=ATTR.CO, val=1, unit=0})
		self.hero:getWearContainer():wear(g_armPos, g_arm)
		assert ( WearHeroArmHdr:_hasCoAttrInCurWear() == true )
	end;
	
	test_allocTempItem = function(self)
		local willWearItem = WearHeroArmHdr:_allocTempItem()
		assert ( willWearItem:getCppVarHdr() ~= nil )
	end;
	
	test_freeTempItem = function(self)
		self.mm:mock(CppPlayerVar, 'freeVar' )
		local willWearItem = WearHeroArmHdr:_allocTempItem()
		WearHeroArmHdr:_freeTempItem(willWearItem)
		assertListEQ ( self.mm.params['freeVar'], {willWearItem:getCppVarHdr()} )
	end;
});

local TestCaseUnWearHeroArmHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testHandle = function(self)
		local g_player = self.player
		local g_hero = self.hero
		local g_cmd = {}
		
		local g_initParamRt = {false}
		local g_addItemsRt = {false}
		
		self.mm:mock(UnWearHeroArmHdr, '_initParam', g_initParamRt, function(self)
			self.player = g_player
			self.armPos = 1
			self.wearArm = WearItem({armPos=1,arm={id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}})
			self.hero = g_hero end)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(g_player:getPkg(), 'returnItems', g_addItemsRt)
		self.mm:mock(g_hero:getWearContainer(), 'unWear')
		self.mm:mock(HeroAttrSender, 'sendUnWear')
		self.mm:mock(HeroAttrHelper, 'recalcAttrs')
		self.mm:mock(g_hero, 'uncarrySoldierBeyondCommand')
		
		assert ( UnWearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ(self.mm.params['_initParam'], {g_player, g_cmd})
		
		self.mm:clear()
		g_hero:setState(1)
		g_initParamRt[1] = true
		assert ( UnWearHeroArmHdr:handle(g_player, g_cmd) == false )
		assertListEQ(self.mm.params['sendWarningMsgArgs'], {g_player, 100018, ''})
		
		self.mm:clear()
		g_hero:setState(0)
		assert ( UnWearHeroArmHdr:handle(g_player, g_cmd) == false )
		assert ( self.mm.params['returnItems'][1][1] == UnWearHeroArmHdr.wearArm:getArm() )
		assertListEQ(self.mm.params['sendWarningMsgArgs'], {g_player, 100021, ''})
		
		self.mm:clear()
		g_addItemsRt[1] = true
		assert ( UnWearHeroArmHdr:handle(g_player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParam,returnItems,unWear,sendUnWear,recalcAttrs,uncarrySoldierBeyondCommand' )
		assertListEQ(self.mm.params['unWear'], {1})
		assertListEQ(self.mm.params['sendUnWear'], {g_player, g_hero, 1})
		assertListEQ(self.mm.params['recalcAttrs'], {self.player, g_hero })
	end;
	
	test_initParam = function(self)
		assert ( UnWearHeroArmHdr:_initParam(self.player, {}) == false )
		assert ( UnWearHeroArmHdr.player == self.player )
		
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=-1}) == false )
		
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=self.hero:getId()}) == false )
		assert ( UnWearHeroArmHdr.hero == self.hero )
		
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=self.hero:getId(), armPos=HEROARM_POS.FIRST-1}) == false )
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=self.hero:getId(), armPos=HEROARM_POS.LAST+1}) == false )
		
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=self.hero:getId(), armPos=HEROARM_POS.LAST}) == false )
		
		local armPos = HEROARM_POS.LAST
		local arm = LuaItemEx({id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=0,gems={}}})
		self.hero:getWearContainer():wear(armPos, arm)
		assert ( UnWearHeroArmHdr:_initParam(self.player, {heroId=self.hero:getId(), armPos=HEROARM_POS.LAST}) == true )
		assert ( UnWearHeroArmHdr.wearArm:getArmPos() == armPos )
		assert ( UnWearHeroArmHdr.wearArm:getArmPos() == UnWearHeroArmHdr.armPos )
	end;
});

local TestCaseStopHeroSteelHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = StopHeroSteelHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		local r_isCommSteel = {false}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(self.hdr, '_handleOneHero')
		
		self.hdr.heros = {self.hero}
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParam[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,_handleOneHero' )
		assertEQ ( self.mm.params['_handleOneHero'], {self.hero} )
	end;
	
	test__initParam = function(self)
		local r_getHerosCount = {0}
		self.mm:mock(self.hdr, '_clearLastHeros' )
		self.mm:mock(self.hdr, '_collectAllSteelingHeros' )
		self.mm:mock(self.hdr, '_collectCurSteelingHero' )
		self.mm:mock(self.hdr, '_getHerosCount', r_getHerosCount )
		
		local p_cmd = {heroId=-1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false)
		assertEQ ( self.mm.walkLog, '_clearLastHeros,_collectAllSteelingHeros,_getHerosCount' )
		
		r_getHerosCount[1] = 1
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), true)
		
		self.mm:clear()
		r_getHerosCount[1] = 0
		local p_cmd = {heroId=1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false)
		assertEQ ( self.mm.walkLog, '_clearLastHeros,_collectCurSteelingHero,_getHerosCount' )
		
		r_getHerosCount[1] = 1
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), true)
	end;
	
	test__clearLastHeros = function(self)
		self.hdr.heros = {{id=1}}
		self.hdr:_clearLastHeros()
		assertEQ ( self.hdr.heros, {} )
	end;
	
	test__collectAllSteelingHeros = function(self)
		self.hdr:_clearLastHeros()
		self.hdr.player = self.player
	
		self.hero:setState(HERO_STATE.FREE)
		self.hdr:_collectAllSteelingHeros()
		assertEQ ( self.hdr.heros, {} )
		
		self.hero:setState(HERO_STATE.STEEL)
		self.hdr:_collectAllSteelingHeros()
		assertEQ ( self.hdr.heros, {self.hero} )
	end;
	
	test__collectCurSteelingHero = function(self)
		self.hdr:_clearLastHeros()
		self.hdr.player = self.player
		
		self.hdr:_collectCurSteelingHero(1000000)
		assertEQ ( self.hdr.heros, {}, 'invalid hero id' )
		
		self.hero:setState(HERO_STATE.FREE)
		self.hdr:_collectCurSteelingHero(self.hero:getId())
		assertEQ ( self.hdr.heros, {}, 'cur hero is not steeling' )
		
		self.hero:setState(HERO_STATE.STEEL)
		self.hdr:_collectCurSteelingHero(self.hero:getId())
		assertEQ ( self.hdr.heros, {self.hero} )
	end;
	
	test__getHerosCount = function(self)
		self.hdr.heros = {}
		assertEQ ( self.hdr:_getHerosCount(), 0 )
		
		self.hdr.heros = {self.hero}
		assertEQ ( self.hdr:_getHerosCount(), 1 )
	end;
	
	test__handleOneHero = function(self)
		self.hdr.player = self.player
		self.hdr.exp = 1
		self.hdr.returnGold = 2
		self.hdr.returnMoney = 3
		
		self.mm:mock(self.hdr, '_initGetRes')
		self.mm:mock(self.hdr, '_cancelSteelState')
		self.mm:mock(self.hero, 'addExp')
		self.mm:mock(self.player:getPkg(), 'addGold')
		self.mm:mock(self.player:getCityRes(), 'addMoney')
		self.mm:mock(self.hdr, '_sendMsg')
		
		self.hdr:_handleOneHero(self.hero)
		assertEQ ( self.mm.walkLog, '_initGetRes,_cancelSteelState,addExp,addGold,addMoney,_sendMsg' )
		assertEQ ( self.mm.params['addExp'], {self.player, 1} )
		assertEQ ( self.mm.params['addGold'], {2} )
		assertEQ ( self.mm.params['addMoney'], {3} )
	end;
	
	test__initGetRes = function(self)
		self.mm:mock(self.hero:getHeroSteel(), 'getSteeledExp', {10} )
		self.mm:mock(self.hero:getHeroSteel(), 'getReturnMoney', {20} )
		self.mm:mock(self.hero:getHeroSteel(), 'getReturnGold', {2} )
		self.hdr:_initGetRes(self.hero)
		assertEQ ( self.hdr.exp, 10 )
		assertEQ ( self.hdr.returnMoney, 20 )
		assertEQ ( self.hdr.returnGold, 2 )
	end;
	
	test__cancelSteelState = function(self)
		self.hero:setState(HERO_STATE.STEEL)
		self.hero:getHeroSteel():setStartTime(1)
		self.hdr:_cancelSteelState(self.hero)
		assertEQ ( self.hero:isFree(), true )
		assertEQ ( self.hero:getHeroSteel():getStartTime(), 0 )
	end;
	
	test__sendMsg = function(self)
		self.mm:mock(HeroAttrSender, 'sendDetailHero')
		self.mm:mock(PkgMiscSender, 'send')
		
		self.hdr.player = self.player
		self.hdr:_sendMsg(self.hero)
		assertEQ ( self.mm.walkLog, 'sendDetailHero,send' )
		assertEQ ( self.mm.params['sendDetailHero'], {self.player, self.hero} )
		assertEQ ( self.mm.params['send'], {self.player, {'gold'}} )
	end;
});

local TestCaseBaseSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = BaseSteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_setParam = function(self)
		self.hdr:setParam(self.param)
		assertEQ ( self.hdr.param, self.param )
		assertEQ ( self.hdr.steelRes, res_herosteel[self.hero:getLevel()] )
	end;
	
	test_getQuarterMoney = function(self)
		assertEQ ( self.hdr:getQuarterMoney(), 0 )
	end;
	
	test_getHourGold = function(self)
		assertEQ ( self.hdr:getHourGold(), 0 )
	end;
	
	test_getSteelNeedGold = function(self)
		self.hdr:setParam(self.param)
		self.mm:mock(self.hdr, 'getHourGold', {4} )
		assertEQ ( self.hdr:getSteelNeedGold(), 4/4*10 )
	end;
	
	test_getSteelNeedMoney = function(self)
		self.hdr:setParam(self.param)
		assertEQ ( self.hdr:getSteelNeedMoney(), res_herosteel[self.hero:getLevel()].expendMoney*10 )
	end;
})

local TestCaseCommSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = CommSteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getQuarterRes = function(self)
		assertEQ ( self.hdr:getQuarterRes(), res_herosteel[self.hero:getLevel()].commGetExp)
	end;
	
	test_getQuarterMoney = function(self)
		assertEQ ( self.hdr:getQuarterMoney(), res_herosteel[self.hero:getLevel()].expendMoney)
	end;
	
	test_getMaxSteelQuarters = function(self)
		assertEQ ( self.hdr:getMaxSteelQuarters(), res_comm_herosteel_max_hours*4)
	end;
	
	test_isArriveSteelMaxLevel = function(self)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(self.hero:getLevel()+1), false)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(self.hero:getLevel()), true)
	end;
	
	test_isValidEfficientType = function(self)
		assertEQ ( self.hdr:isValidEfficientType(), true)
	end;
});

local TestCaseHighSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = HighSteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getQuarterRes = function(self)
		assertEQ ( self.hdr:getQuarterRes(), res_herosteel[self.hero:getLevel()].highGetExp)
	end;
	
	test_getHourGold = function(self)
		assertEQ ( self.hdr:getHourGold(), 2)
	end;
	
	test_getMaxSteelQuarters = function(self)
		assertEQ ( self.hdr:getMaxSteelQuarters(), res_high_herosteel_max_hours*4)
	end;
	
	test_isArriveSteelMaxLevel = function(self)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(), false)
	end;
	
	test_isValidEfficientType = function(self)
		assertEQ ( self.hdr:isValidEfficientType(), true)
	end;
})

local TestCaseVip1SteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = Vip1SteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getQuarterRes = function(self)
		assertEQ ( self.hdr:getQuarterRes(), res_herosteel[self.hero:getLevel()].high1GetExp)
	end;
	
	test_getHourGold = function(self)
		assertEQ ( self.hdr:getHourGold(), 5)
	end;
	
	test_getMaxSteelQuarters = function(self)
		assertEQ ( self.hdr:getMaxSteelQuarters(), res_high_herosteel_max_hours*4)
	end;
	
	test_isArriveSteelMaxLevel = function(self)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(), false)
	end;
	
	test_isValidEfficientType = function(self)
		assertEQ ( self.hdr:isValidEfficientType(), true)
	end;
})

local TestCaseVip2SteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = Vip2SteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getQuarterRes = function(self)
		assertEQ ( self.hdr:getQuarterRes(), res_herosteel[self.hero:getLevel()].high2GetExp)
	end;
	
	test_getHourGold = function(self)
		assertEQ ( self.hdr:getHourGold(), 10)
	end;
	
	test_getMaxSteelQuarters = function(self)
		assertEQ ( self.hdr:getMaxSteelQuarters(), res_high_herosteel_max_hours*4)
	end;
	
	test_isArriveSteelMaxLevel = function(self)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(), false)
	end;
	
	test_isValidEfficientType = function(self)
		assertEQ ( self.hdr:isValidEfficientType(), true)
	end;
})

local TestCaseSpeedSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = SpeedSteelHeroHdr(HighSteelHeroHdr(), 3)
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_getQuarterRes = function(self)
		assertEQ ( self.hdr:getQuarterRes(), res_herosteel[self.hero:getLevel()].highGetExp*2)
	end;
	
	test_getHourGold = function(self)
		assertEQ ( self.hdr:getHourGold(), 2+3)
	end;
	
	test_getMaxSteelQuarters = function(self)
		assertEQ ( self.hdr:getMaxSteelQuarters(), res_high_herosteel_max_hours*4)
	end;
	
	test_isArriveSteelMaxLevel = function(self)
		assertEQ ( self.hdr:isArriveSteelMaxLevel(), false)
	end;
	
	test_isValidEfficientType = function(self)
		self.hero.hero.ucLevel = res_hero_lowsteel_level
		assertEQ ( self.hdr:isValidEfficientType(), true )
		
		self.hero.hero.ucLevel = res_hero_lowsteel_level + 1
		assertEQ ( self.hdr:isValidEfficientType(), false )
	end;
})

local TestCaseDefaultSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = DefaultSteelHeroHdr()
		self.param = {hero=self.hero, steelQuarters=10}
		self.hdr:setParam(self.param)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_isValidEfficientType = function(self)
		assertEQ ( self.hdr:isValidEfficientType(), false )
	end;
})

local TestCaseSteelHeroHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = SteelHeroHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		self.mm:mock( self.hdr, '_initParam', r_initParam )
		self.mm:mock( self.hdr, '_handleOneHero' )
		self.mm:mock( self.hdr, '_subExpends' )
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		local p_cmd = {steelType=0,count=1,hid1=1,sq1=10,eff1=0}
		self.hdr:handle(self.player, p_cmd)
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmd} )
		
		self.mm:clear()
		self.hdr.params = {{hero=self.hero}}
		r_initParam[1] = true
		self.hdr:handle(self.player, p_cmd)
		assertEQ ( self.mm.walkLog, '_initParam,_handleOneHero,_subExpends,trigerTask' )
		assertEQ ( self.mm.params['_handleOneHero'], {{hero=self.hero}} )
		assertEQ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.STEEL_HERO} )
	end;
	
	test__initParam = function(self)
		local p_params = {}
		
		local r_initHeroSteelMaxLevel = {false}
		local r_initSteelType = {false}
		local r_collectHeros = {false}
		local r_isAllHerosFreeState = {false}
		local r_hasHerosArriveMaxLevel = {true}
		local r_hasHerosArriveBuildMaxLevel = {true}
		local r_isValidSteelQuarters = {false}
		local r_isValidEfficientTypes = {false}
		local r_hasEnoughMoney = {false}
		local r_hasEnoughGold = {false}
		
		self.mm:mock( self.hdr, '_initHeroSteelMaxLevel', r_initHeroSteelMaxLevel )
		self.mm:mock( self.hdr, '_initSteelType', r_initSteelType )
		self.mm:mock( self.hdr, '_collectHeros', r_collectHeros )
		self.mm:mock( self.hdr, '_isAllHerosFreeState', r_isAllHerosFreeState )
		self.mm:mock( self.hdr, '_hasHerosArriveMaxLevel', r_hasHerosArriveMaxLevel )
		self.mm:mock( self.hdr, '_hasHerosArriveBuildMaxLevel', r_hasHerosArriveBuildMaxLevel )
		self.mm:mock( self.hdr, '_isValidSteelQuarters', r_isValidSteelQuarters )
		self.mm:mock( self.hdr, '_isValidEfficientTypes', r_isValidEfficientTypes )
		self.mm:mock( self.hdr, '_hasEnoughMoney', r_hasEnoughMoney )
		self.mm:mock( self.hdr, '_hasEnoughGold', r_hasEnoughGold )
		
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		assertEQ ( self.mm.walkLog, '_initHeroSteelMaxLevel' )
		assertEQ ( self.mm.params['_initHeroSteelMaxLevel'], {self.player} )
		
		self.mm:clear()
		r_initHeroSteelMaxLevel[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		assertEQ ( self.mm.params['_initSteelType'], {p_params} )
		
		self.mm:clear()
		r_initSteelType[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		assertEQ ( self.mm.params['_collectHeros'], {self.player, p_params} )
	
		self.mm:clear()
		r_collectHeros[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		
		self.mm:clear()
		r_isAllHerosFreeState[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
	
		self.mm:clear()
		r_hasHerosArriveMaxLevel[1] = false
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
	
		self.mm:clear()
		r_hasHerosArriveBuildMaxLevel[1] = false
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		
		self.mm:clear()
		r_isValidSteelQuarters[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		
		self.mm:clear()
		r_isValidEfficientTypes[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		assertEQ ( self.mm.params['_hasEnoughMoney'], {self.player} )
		
		self.mm:clear()
		r_hasEnoughMoney[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), false )
		assertEQ ( self.mm.params['_hasEnoughGold'], {self.player} )
		
		self.mm:clear()
		r_hasEnoughGold[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_params), true )
		assertEQ ( self.hdr.player, self.player )
	end;
	
	test__initHeroSteelMaxLevel = function(self)
		assertEQ ( self.hdr:_initHeroSteelMaxLevel(self.player), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.STEEL_BUILD,level=1,state=0} } })
		assertEQ ( self.hdr:_initHeroSteelMaxLevel(self.player), true )
		assertEQ ( self.hdr.heroSteelMaxLevel, ItemResUtil:findBuildLevelres(FIXID.STEEL_BUILD, 1).herosteelmaxlevel )
	end;
	
	test__initSteelType = function(self)
		local p_params = {steelType=HSTEEL_TYPE.FIRST-1}
		assertEQ ( self.hdr:_initSteelType(p_params), false )
		p_params.steelType = HSTEEL_TYPE.FIRST
		assertEQ ( self.hdr:_initSteelType(p_params), true )
		p_params.steelType = HSTEEL_TYPE.LAST + 1
		assertEQ ( self.hdr:_initSteelType(p_params), false )
	end;
	
	test__collectHeros = function(self)
		local p_params = {count=0}
		assertEQ ( self.hdr:_collectHeros(self.player, p_params), false )
		
		local p_params = {count=1, hid1=self.hero:getId()+1, sq1=10,eff1=1}
		assertEQ ( self.hdr:_collectHeros(self.player, p_params), false )
		
		local p_params = {count=1, hid1=self.hero:getId(), sq1=10,eff1=1}
		assertEQ ( self.hdr:_collectHeros(self.player, p_params), true )
		assertEQ ( self.hdr.params, {{hero=self.hero, steelQuarters=10, effType=1}} )
	end;
	
	test__isAllHerosFreeState = function(self)
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.hero:setState(HERO_STATE.FREE)
		assertEQ ( self.hdr:_isAllHerosFreeState(), true )
		
		self.hero:setState(HERO_STATE.STEEL)
		assertEQ ( self.hdr:_isAllHerosFreeState(), false )
	end;
	
	test__hasHerosArriveMaxLevel = function(self)
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.hero.hero.ucLevel = self.hero:getMaxLevel() - 1
		assertEQ ( self.hdr:_hasHerosArriveMaxLevel(), false )
		
		self.hero.hero.ucLevel = self.hero:getMaxLevel()
		assertEQ ( self.hdr:_hasHerosArriveMaxLevel(), true )
	end;
	
	test__hasHerosArriveBuildMaxLevel = function(self)
		self.hdr.steelType = HSTEEL_TYPE.COMM
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=0}}
		self.hdr.heroSteelMaxLevel = self.hero:getLevel() + 1
		assertEQ ( self.hdr:_hasHerosArriveBuildMaxLevel(), false )
		
		self.hdr.heroSteelMaxLevel = self.hero:getLevel()
		assertEQ ( self.hdr:_hasHerosArriveBuildMaxLevel(), true )
		
		self.hdr.steelType = HSTEEL_TYPE.HIGH
		assertEQ ( self.hdr:_hasHerosArriveBuildMaxLevel(), false )
	end;
	
	test__isValidSteelQuarters = function(self)	
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.mm:mock( self.hdr, '_getMaxSteelQuarters', {10} )
		assertEQ ( self.hdr:_isValidSteelQuarters(), true )
		
		self.hdr.params = {{hero=self.hero, steelQuarters=11, effType=1}}
		assertEQ ( self.hdr:_isValidSteelQuarters(), false )
	end;
	
	test__getMaxSteelQuarters = function(self)
		self.hdr.steelType = HSTEEL_TYPE.HIGH
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.mm:mock(self.hdr:_getHdr( self.hdr.params[1] ), 'getMaxSteelQuarters', {100})
		assertEQ ( self.hdr:_getMaxSteelQuarters(), 100 )
	end;
	
	test__isValidEfficientTypes = function(self)
		self.hdr.steelType = HSTEEL_TYPE.COMM
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		local r_isValidEfficientType = {false}
		self.mm:mock(self.hdr:_getHdr( self.hdr.params[1] ), 'isValidEfficientType', r_isValidEfficientType)
		assertEQ ( self.hdr:_isValidEfficientTypes(), false )
		
		r_isValidEfficientType[1] = true
		assertEQ ( self.hdr:_isValidEfficientTypes(), true )
	end;
	
	test__hasEnoughMoney = function(self)
		local r_getNeedMoney = {0}
		self.mm:mock(self.hdr, '_getNeedMoney', r_getNeedMoney)
		assertEQ ( self.hdr:_hasEnoughMoney(self.player), true )
		assertEQ ( self.mm.params['_getNeedMoney'], {self.player} )
		
		r_getNeedMoney[1] = self.player:getCityRes():getMoney() + 1
		assertEQ ( self.hdr:_hasEnoughMoney(self.player), false )
	end;
	
	test__getNeedMoney = function(self)
		self.hdr.steelType = HSTEEL_TYPE.COMM
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.mm:mock(self.hdr:_getHdr( self.hdr.params[1] ), 'getSteelNeedMoney', {10})
		assertEQ ( self.hdr:_getNeedMoney(), 10 )
	end;
	
	test__hasEnoughGold = function(self)
		local r_getNeedGold = {0}
		self.mm:mock(self.hdr, '_getNeedGold', r_getNeedGold)
		assertEQ ( self.hdr:_hasEnoughGold(self.player), true )
		assertEQ ( self.mm.params['_getNeedGold'], {self.player} )
		
		r_getNeedGold[1] = self.player:getPkg():getGold() + 1
		assertEQ ( self.hdr:_hasEnoughGold(self.player), false )
	end;
	
	test__getNeedGold = function(self)
		self.hdr.steelType = HSTEEL_TYPE.COMM
		self.hdr.params = {{hero=self.hero, steelQuarters=10, effType=1}}
		self.mm:mock(self.hdr:_getHdr( self.hdr.params[1] ), 'getSteelNeedGold', {10})
		assertEQ ( self.hdr:_getNeedGold(), 10 )
	end;
	
	test__handleOneHero = function(self)
		app:getSvrAct() -- 延迟初始化，会触发timer.start
		Util:setTimeDrt(1379520000 + 20*3600) -- 8:00 - 11:00 有效
		self.hdr.player = self.player
		self.hdr.steelType = HSTEEL_TYPE.COMM
		
		local p_param = {hero=self.hero, steelQuarters=5, effType=HSTEEL_EFF_TYPE.NORMAL}
	
		self.mm:mock(self.hero, 'setState' )
		self.mm:travelMock(self.hero:getHeroSteel(), 'setStartTime' )
		self.mm:mock(self.hero:getHeroSteel(), 'setSteelType' )
		self.mm:mock(self.hero:getHeroSteel(), 'setSteelQuarters' )
		self.mm:mock(self.hero:getHeroSteel(), 'setQuarterRes' )
		self.mm:mock(self.hero:getHeroSteel(), 'setQuarterMoney' )
		self.mm:mock(self.hero:getHeroSteel(), 'setHourGold' )
		
		self.mm:mock(self.hdr:_getHdr(p_param), 'getQuarterRes', {10} )
		self.mm:mock(self.hdr:_getHdr(p_param), 'getQuarterMoney', {20} )
		self.mm:mock(self.hdr:_getHdr(p_param), 'getHourGold', {30} )
		
		self.mm:mock(global.getTimer(), 'start' )
		
		self.mm:mock(HeroAttrSender, 'sendHerosState' )
		self.mm:mock(HeroAttrSender, 'sendHeroSteel' )
		
		self.hdr:_handleOneHero(p_param)
		local expectStr = 'setState,setStartTime,setSteelType,setSteelQuarters,getQuarterRes,setQuarterRes,getQuarterMoney,setQuarterMoney,getHourGold,setHourGold,start,sendHerosState,sendHeroSteel'
		assertEQ ( self.mm.walkLog, expectStr )
		assertEQ ( self.mm.params['setState'], {HERO_STATE.STEEL} )
		assertEQ ( self.mm.params['setStartTime'], {Util:getTime()} )
		assertEQ ( self.mm.params['setSteelType'], {HSTEEL_TYPE.COMM} )
		assertEQ ( self.mm.params['setSteelQuarters'], {5} )
		assertEQ ( self.mm.params['setQuarterRes'], {10} )
		assertEQ ( self.mm.params['setQuarterMoney'], {20} )
		assertEQ ( self.mm.params['setHourGold'], {30} )
		assertEQ ( self.mm.params['start'], {5*900*1000, {TIMER_EVT.HERO_STEEL_STOP, self.hero:getId(), Util:getTime(), HSTEEL_TYPE.COMM}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['sendHerosState'], {self.player, {self.hero}} )
		assertEQ ( self.mm.params['sendHeroSteel'], {self.player, self.hero} )
		assertEQ ( self.hero:getHeroSteel():getActMult(), 1 )
		
		self.mm:clear()
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.HERO_STEEL_2)
		self.hdr:_handleOneHero(p_param)
		assertEQ ( self.hero:getHeroSteel():getActMult(), 2 )
		
		self.mm:clear()
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.HERO_STEEL_3)
		self.hdr:_handleOneHero(p_param)
		assertEQ ( self.hero:getHeroSteel():getActMult(), 5 )
	end;
	
	test__getHdr = function(self)
		self.hdr.player = self.player
		
		self.hdr.steelType = HSTEEL_TYPE.COMM
		local p_param = {effType=HSTEEL_EFF_TYPE.NORMAL, hero=self.hero}
		assertEQ ( self.hdr:_getHdr(p_param):getClass(), CommSteelHeroHdr )
		assertEQ ( self.hdr:_getHdr(p_param).param, p_param )
		
		self.hdr.steelType = HSTEEL_TYPE.HIGH
		p_param.effType = HSTEEL_EFF_TYPE.NORMAL
		assertEQ ( self.hdr:_getHdr(p_param):getClass(), HighSteelHeroHdr )
		assertEQ ( self.hdr:_getHdr(p_param).param, p_param )
		
		self.hdr.steelType = HSTEEL_TYPE.HIGH
		p_param.effType = HSTEEL_EFF_TYPE.SPEED
		assertEQ ( self.hdr:_getHdr(p_param):getClass(), SpeedSteelHeroHdr )
		assertEQ ( self.hdr:_getHdr(p_param).param, p_param )
		
		self.hdr.steelType = HSTEEL_TYPE.HIGH
		p_param.effType = HSTEEL_EFF_TYPE.SPEED + 1
		assertEQ ( self.hdr:_getHdr(p_param):getClass(), DefaultSteelHeroHdr )
		assertEQ ( self.hdr:_getHdr(p_param).param, p_param )
	end;
	
	test__subExpends = function(self)
		self.hdr.player = self.player
		
		self.mm:mock(self.hdr, '_getNeedMoney', {1})
		self.mm:mock(self.hdr, '_getNeedGold', {2})
		self.mm:mock(WUtil, 'createExpendObjs', {{name='epxendobjs'}})
		self.mm:mock(WUtil, 'subExpends')
		
		self.hdr:_subExpends()
		assertEQ ( self.mm.walkLog, '_getNeedMoney,_getNeedGold,createExpendObjs,subExpends' )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {{attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=1},{attr=ATTR.GOLD,type=EXPEND_TYPE.GOLD,val=2}}} )
		assertEQ ( self.mm.params['subExpends'], { {name='epxendobjs'} } )
	end;
});

local TestCaseUpgradeHeroNAttrHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = HeroResHandler():getHandler(50)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	test_handle_invalidHeroId = function(self)
		local cmd = {}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_noEnoughItem = function(self)
		self.mm:travelMock( WUtil, 'sendPopBoxMsgArgs' )
		local cmd = {heroId=self.hero:getId()}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendPopBoxMsgArgs'], {self.player, 100066, '"@itemid' .. FIXID.HERO_NATTR_DAN .. '",1,0,' .. FIXID.HERO_NATTR_DAN }, "has't item" )
	end;
	
	test_handle_lowNAttr = function(self)
		self.mm:travelMock( WUtil, 'sendPopBoxMsgArgs' )
		self.mm:travelMock( HeroAttrHelper, 'recalcDynAttrs' )
		self.mm:travelMock( HeroAttrSender, 'sendAttrsByIds' )
		self.mm:travelMock( Service:getOpenSvrAct(), 'recordWhenHasFiveHighHero' )
		self.hero:setAttrVal(ATTR.NAG, 138-1);
		self.hero:setAttrVal(ATTR.NPH, 134-1);
		self.hero:setAttrVal(ATTR.NST, 126-1);
		HeroAttrHelper:recalcDynAttrs(self.player, self.hero)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HERO_NATTR_DAN, number=1})})
		local cmd = {heroId=self.hero:getId()}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.HERO_NATTR_DAN), 0 )
		assertEQ ( self.hero:getAttrVal(ATTR.NAG) + self.hero:getAttrVal(ATTR.NPH) + self.hero:getAttrVal(ATTR.NST), 138-1 + 134-1 + 126-1 + 3 )
		assertEQ ( self.mm.params['recalcDynAttrs'], {self.player, self.hero} )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, self.hero, {ATTR.MIF, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.NAG, ATTR.NPH, ATTR.NST, ATTR.SFC, ATTR.FC}} )
		assertEQ ( self.mm.params['recordWhenHasFiveHighHero'], {self.player} )
	end;
	
	test_handle_highNAttr = function(self)
		self.hero:setAttrVal(ATTR.NAG, 138);
		self.hero:setAttrVal(ATTR.NPH, 134);
		self.hero:setAttrVal(ATTR.NST, 126);
		HeroAttrHelper:recalcDynAttrs(self.player, self.hero)
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HERO_NATTR_DAN, number=1})})
		local cmd = {heroId=self.hero:getId()}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.hero:getAttrVal(ATTR.NAG) >= 138, true )
		assertEQ ( self.hero:getAttrVal(ATTR.NPH) >= 134, true )
		assertEQ ( self.hero:getAttrVal(ATTR.NST) >= 126, true )
		assertEQ ( self.hero:getAttrVal(ATTR.NAG) + self.hero:getAttrVal(ATTR.NPH) + self.hero:getAttrVal(ATTR.NST) > (138 + 134 + 126), true)
	end;
})

tqHeroResHandler_t_main = function(suite)
	suite:addTestCase(TestCaseHeroResHandler, 'TestCaseHeroResHandler')
	suite:addTestCase(TestCaseRefreshNewHerosHdr, 'TestCaseRefreshNewHerosHdr')
	suite:addTestCase(TestCaseHeroResHandler_bak, 'TestCaseHeroResHandler_bak')
	suite:addTestCase(TestCaseFireHeroHdr, 'TestCaseFireHeroHdr')
	suite:addTestCase(TestCaseLockHeroHdr, 'TestCaseLockHeroHdr')
	suite:addTestCase(TestCaseUnLockHeroHdr, 'TestCaseUnLockHeroHdr')
	suite:addTestCase(TestCaseHeroChangeNameHdr, 'TestCaseHeroChangeNameHdr')
	suite:addTestCase(TestCaseTreatmentHeroHdr, 'TestCaseTreatmentHeroHdr')
	suite:addTestCase(TestCaseTreatmentHerosHdr, 'TestCaseTreatmentHerosHdr')
	suite:addTestCase(TestCaseAssignHeroPPHdr, 'TestCaseAssignHeroPPHdr')
	suite:addTestCase(TestCaseClearHeroPPHdr, 'TestCaseClearHeroPPHdr')
	suite:addTestCase(TestCaseCongeHeroOfficialHdr, 'TestCaseCongeHeroOfficialHdr')
	suite:addTestCase(TestCaseConferHeroOfficialHdr, 'TestCaseConferHeroOfficialHdr')
	suite:addTestCase(TestCaseSteelHeroSkeletonHdr, 'TestCaseSteelHeroSkeletonHdr')
	suite:addTestCase(TestCaseInsightHeroSkillHdr, 'TestCaseInsightHeroSkillHdr')
	suite:addTestCase(TestCaseSkillSteelHeroHdr, 'TestCaseSkillSteelHeroHdr')
	suite:addTestCase(TestCaseWearHeroTSkillHdr, 'TestCaseWearHeroTSkillHdr')
	suite:addTestCase(TestCaseUnWearHeroTSkillHdr, 'TestCaseUnWearHeroTSkillHdr')
	suite:addTestCase(TestCaseWearHeroArmHdr, 'TestCaseWearHeroArmHdr')
	suite:addTestCase(TestCaseUnWearHeroArmHdr, 'TestCaseUnWearHeroArmHdr')
	suite:addTestCase(TestCaseStopHeroSteelHdr, 'TestCaseStopHeroSteelHdr')
	suite:addTestCase(TestCaseBaseSteelHeroHdr, 'TestCaseBaseSteelHeroHdr')
	suite:addTestCase(TestCaseCommSteelHeroHdr, 'TestCaseCommSteelHeroHdr')
	suite:addTestCase(TestCaseHighSteelHeroHdr, 'TestCaseHighSteelHeroHdr')
	suite:addTestCase(TestCaseVip1SteelHeroHdr, 'TestCaseVip1SteelHeroHdr')
	suite:addTestCase(TestCaseVip2SteelHeroHdr, 'TestCaseVip2SteelHeroHdr')
	suite:addTestCase(TestCaseSpeedSteelHeroHdr, 'TestCaseSpeedSteelHeroHdr')
	suite:addTestCase(TestCaseDefaultSteelHeroHdr, 'TestCaseDefaultSteelHeroHdr')
	suite:addTestCase(TestCaseSteelHeroHdr, 'TestCaseSteelHeroHdr')
	suite:addTestCase(TestCaseUpgradeHeroNAttrHdr, 'TestCaseUpgradeHeroNAttrHdr')
end;

