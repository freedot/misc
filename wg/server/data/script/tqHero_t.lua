--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqHero')

local TestCaseHero = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	helper_getLastHeroDynAttrVals = function(self)
		self.hu_bak = self.hero:getAttrVal(ATTR.HU)
		self.de_bak = self.hero:getAttrVal(ATTR.DE)
		self.hi_bak = self.hero:getAttrVal(ATTR.HI)
		self.mps_bak = self.hero:getAttrVal(ATTR.MPS) + 0.9
		self.es_bak = self.hero:getAttrVal(ATTR.ES)
		self.ber_bak = self.hero:getAttrVal(ATTR.BER)
	end;
	
	helper_checkRecalDynAttrsWhenHealthChange = function(self, msg)
		assertEQ ( self.hero:getAttrVal(ATTR.HU), math.floor(0.8*self.hu_bak + 0.6) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.DE), math.floor(0.8*self.de_bak ) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.HI), math.floor(0.8*self.hi_bak ) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.MPS), math.floor(0.8*self.mps_bak ) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.ES), math.floor(0.8*self.es_bak) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.BER), math.floor(0.8*self.ber_bak) , msg)
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, self.hero, {ATTR.MIF, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.ES, ATTR.BER, ATTR.MPS, ATTR.SFC, ATTR.FC}} , msg)
	end;
	
	test_setAttrRawVal_healthChange = function(self)
		self.mm:mock(HeroAttrSender, 'sendAttrsByIds')
		self:helper_getLastHeroDynAttrVals()
		
		self.hero:setAttrRawVal(-1, 1)
		self.hero:setAttrRawVal(ATTR.HEALTH, 70*ATTR_PRECISION+10)
		assertEQ ( self.hero:getAttrRawVal(ATTR.HEALTH), 70*ATTR_PRECISION+10)
		self:helper_checkRecalDynAttrsWhenHealthChange('test_setAttrRawVal')
		
		self.mm:clear()
		self.hero:setAttrRawVal(ATTR.HEALTH, 71*ATTR_PRECISION+10)
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_setAttrVal_healthChange  = function(self)
		self.mm:mock(HeroAttrSender, 'sendAttrsByIds')
		self:helper_getLastHeroDynAttrVals()
		
		self.hero:setAttrVal(-1, 1)
		self.hero:setAttrVal(ATTR.HEALTH, 70)
		assertEQ ( self.hero:getAttrVal(ATTR.HEALTH), 70)
		
		self:helper_checkRecalDynAttrsWhenHealthChange('test_setAttrVal')
		
		self.mm:clear()
		self.hero:getAttrVal(ATTR.HEALTH, 71)
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_setAttrVal_innerForceChange = function(self)
		self.mm:mock(HeroAttrSender, 'sendAttrsByIds')
		self:helper_getLastHeroDynAttrVals()
		self.hero:setAttrVal(ATTR.IF, 100)
		assertEQ ( self.hero:getAttrVal(ATTR.IF), 100)
		assertEQ ( self.hero:getAttrVal(ATTR.HU), math.floor(self.hu_bak + self.hu_bak*100/510 + 0.1) , msg)
		assertEQ ( self.hero:getAttrVal(ATTR.DE), math.floor(self.de_bak + self.de_bak*100/510 + 0.1) , msg)
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, self.hero, {ATTR.HU, ATTR.DE}} )
	end;
	
	test_isLocked = function(self)
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		assert ( self.hero:isLocked() == false )
		
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		assert ( self.hero:isLocked() == true )
		
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		assert ( self.hero:isLocked() == false )
	end;
	
	test_isUnLocking = function(self)
		self.hero:setLockState(HERO_LOCKSTATE.NONE)
		assert ( self.hero:isUnLocking() == false )
		
		self.hero:setLockState(HERO_LOCKSTATE.LOCKED)
		assert ( self.hero:isUnLocking() == false )
		
		self.hero:setLockState(HERO_LOCKSTATE.UNLOCKING)
		assert ( self.hero:isUnLocking() == true )	
	end;
	
	test_getWearContainer = function(self)
		assert ( self.hero:getWearContainer() ~= nil )
		assert ( self.hero:getWearContainer():getClass() == HeroWear )
	end;
	
	test_isFree = function(self)
		self.hero:setState(0)
		assert ( self.hero:isFree() == true )
		
		self.hero:setState(1)
		assert ( self.hero:isFree() == false )
	end;
	
	test_isSteeling = function(self)
		self.hero:setState(0)
		assert ( self.hero:isSteeling() == false )
		
		self.hero:setState(HERO_STATE.STEEL)
		assert ( self.hero:isSteeling() == true )
	end;
	
	test_isDispatchField = function(self)
		self.hero:setState(0)
		assert ( self.hero:isDispatchField() == false )
		
		self.hero:setState(HERO_STATE.DISPATCHFIELD)
		assert ( self.hero:isDispatchField() == true )
	end;
	
	test_isExped = function(self)
		self.hero:setState(0)
		assert ( self.hero:isExped() == false )
		
		self.hero:setState(HERO_STATE.EXPED)
		assert ( self.hero:isExped() == true )
	end;
	
	_testHeroInsightSkill_WhenUpgradeLevel = function(self)
		assert( self.hero:getSkillCount() == 0 )
		while self.hero:getLevel() < res_hero_hasskill_minlevel do
			self.hero:addExp(self.player, 1000000)
		end
		assert( self.hero:getSkillCount() == 1 )
	end;
	
	test_addExp_arriveMaxLevel_clearExp = function(self)
		local mm = MethodMock()
		mm:mock(self.hero, 'isArriveMaxLevel', function() return true end)
		
		self.hero:addExp(self.player, 1)
		
		mm:restore()
		
		assert ( self.hero:getAttrVal(ATTR.XP) == 0 )
	end;
	
	testSetSoldierNumber = function(self)
		self.hero:setSoldierNumber(-1)
		assert ( self.hero:getSoldierNumber() == 0 )
		
		self.hero:setSoldierNumber(1000000)
		assert ( self.hero:getSoldierNumber() < 1000000 )
	end;
	
	testHeroInsightSkill_WhenUpgradeLevel = function(self)
		assert( self.hero:getSkillCount() == 0 )
		self.hero:getInner().ucLevel = res_hero_hasskill_minlevel
		self.hero:onLevelChange(self.player)
		assert( self.hero:getSkillCount() == 1 )
	end;
	
	test_doTask_WhenUpgradeLevel = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.hero:onLevelChange(self.player)
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.HERO_UPGRADE, self.hero:getLevel()} )
	end;
	
	testAddSoldierNumber = function(self)
		self.hero:addSoldierNumber(1)
		assert ( self.hero:getSoldier().number == 1 )
		self.hero:addSoldierNumber( 1 + self.hero:getAttrVal(ATTR.CO) )
		assert ( self.hero:getSoldier().number == self.hero:getAttrVal(ATTR.CO) )
	end;
	
	testGetAdaptableFactor = function(self)
		self.hero.hero.aucSubjects[0] = 0
		self.hero.hero.aucSubjects[1] = 1
		self.hero.hero.aucSubjects[2] = 2
		self.hero.hero.aucSubjects[3] = 3
		self.hero.hero.aucSubjects[4] = 4
		
		self.hero:carrySoldier({resid=0,number=0})
		assert ( self.hero:getAdaptableFactor() == 0 )
		
		self.hero:carrySoldier({resid=150001001,number=1})
		assert ( self.hero:getAdaptableFactor() == 0.6 )
		
		self.hero:carrySoldier({resid=150002001,number=1})
		assert ( self.hero:getAdaptableFactor() == 0.8 )
		
		self.hero:carrySoldier({resid=150003001,number=1})
		assert ( self.hero:getAdaptableFactor() == 1 )
		
		self.hero:carrySoldier({resid=150004001,number=1})
		assert ( self.hero:getAdaptableFactor() == 1.2 )
		
		self.hero:carrySoldier({resid=150005001,number=1})
		assert ( self.hero:getAdaptableFactor() == 1.4 )
	end;
	
	testGetFCAttr = function(self)
		assert ( self.hero:getAttrVal(ATTR.FC) == 0 )
		self.hero:carrySoldier({resid=150001004,number=10})
		assert ( self.hero:getAttrVal(ATTR.FC) > 0 )
	end;
	
	testFormatAttrVal = function(self)
		self.hero:setAttrVal(ATTR.MO, -1)
		assert ( self.hero:getAttrVal(ATTR.MO) == 0 )
		
		self.hero:setAttrVal(ATTR.MMO, 150)
		self.hero:setAttrVal(ATTR.MO, 140)
		assert ( self.hero:getAttrVal(ATTR.MO) == 140 )
		
		self.hero:setAttrVal(ATTR.MO, 151)
		assert ( self.hero:getAttrVal(ATTR.MO) == 150 )
		
		self.hero:setAttrVal(ATTR.HEALTH, -1)
		assert ( self.hero:getAttrVal(ATTR.HEALTH) == 0 )
		
		self.hero:setAttrVal(ATTR.MHEALTH, 100)
		self.hero:setAttrVal(ATTR.HEALTH, 90)
		assert ( self.hero:getAttrVal(ATTR.HEALTH) == 90 )
		
		self.hero:setAttrVal(ATTR.HEALTH, 101)
		assert ( self.hero:getAttrVal(ATTR.HEALTH) == 100 )
	end;
	
	test_getMaxLevel = function(self)
		assert ( self.hero:getMaxLevel() == 60 )
		
		self.hero:setSkeletonLevel(1)
		assert ( self.hero:getMaxLevel() == 80 )
		
		self.hero:setSkeletonLevel(7)
		assert ( self.hero:getMaxLevel() == 150 )
		
		self.hero:setSkeletonLevel(8)
		assert ( self.hero:getMaxLevel() == 150 )
	end;
	
	test_isArriveMaxLevel = function(self)
		assert ( self.hero:getMaxLevel() == 60 )
		
		self.hero.hero.ucLevel = 59
		assert ( self.hero:isArriveMaxLevel() == false )
		
		self.hero.hero.ucLevel = 60
		assert ( self.hero:isArriveMaxLevel() == true )
		
		self.hero.hero.ucLevel = 61
		assert ( self.hero:isArriveMaxLevel() == true )
	end;
	
	test_setOfficial = function(self)
		self.mm:mock(self.hero, 'recalcCommandAttr')
		self.mm:mock(self.hero, 'uncarrySoldierBeyondCommand')
		self.hero:setOfficial(10)
		assertEQ ( self.mm.walkLog, 'recalcCommandAttr,uncarrySoldierBeyondCommand' )
		assertEQ ( self.hero:getOfficial(), 10 )
	end;
	
	test_recalcCommandAttr = function(self)
		self.mm:mock(HeroAttrHelper, 'getCommandVal', {1})
		self.mm:mock(self.hero, 'setAttrVal')
		self.hero:recalcCommandAttr()
		assertEQ ( self.mm.walkLog, 'getCommandVal,setAttrVal' )
		assertEQ ( self.mm.params['getCommandVal'], {{player=self.player, hero=self.hero}} )
		assertEQ ( self.mm.params['setAttrVal'], {ATTR.CO, 1} )
	end;
	
	test_uncarrySoldierBeyondCommand = function(self)
		self.hero:carrySoldier({resid=150001001, number=0})
		local r_gtSoldierNumber = {self.hero:getAttrVal(ATTR.CO)}
		self.mm:mock(self.hero, 'getSoldierNumber', r_gtSoldierNumber)
		self.mm:mock(self.player:getSoldierMgr(), 'addSoldier')
		self.mm:mock(self.hero, 'subSoldierNumber')
		self.mm:mock(RoleSoldierSender, 'sendSoldier')
		self.mm:mock(HeroAttrSender, 'sendCarrySoldier')
		
		self.hero:uncarrySoldierBeyondCommand()
		assertEQ ( self.mm.walkLog, 'getSoldierNumber' )
		
		self.mm:clear()
		r_gtSoldierNumber[1] = self.hero:getAttrVal(ATTR.CO) + 1
		self.hero:uncarrySoldierBeyondCommand()
		assertEQ ( self.mm.walkLog, 'getSoldierNumber,addSoldier,subSoldierNumber,sendSoldier,sendCarrySoldier' )
		assertEQ ( self.mm.params['addSoldier'], {{resid=150001001, number=1}} )
		assertEQ ( self.mm.params['subSoldierNumber'], {1} )
		assertEQ ( self.mm.params['sendSoldier'], {self.player, 150001001} )
		assertEQ ( self.mm.params['sendCarrySoldier'], {self.player, self.hero} )
	end;
})

local TestCaseHeroSoldier = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testFormatSoldierNumber = function(self)
		self.hero:getInner().stSoldier.number = 10
		self.hero:setAttrVal(ATTR.CO, 1)
		self.hero:formatSoldierNumber()
		assert ( self.hero:getSoldierNumber() == 1 )
	end;
	
	testAddSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 3)
		self.hero:addSoldierNumber(-1)
		assert ( self.hero:getSoldierNumber() == 0 )
		
		self.hero:addSoldierNumber(1)
		self.hero:addSoldierNumber(1)
		assert ( self.hero:getSoldierNumber() == 2 )
		
		self.hero:addSoldierNumber(2)
		assert ( self.hero:getSoldierNumber() == 3 )
		
		local methodMock = MethodMock()
		methodMock:mock(self.hero, 'setSoldierNumber', function(self) methodMock.walkLog = 'setSoldierNumber' end)
		self.hero:addSoldierNumber(1)
		methodMock:restore()
		assert ( methodMock.walkLog == 'setSoldierNumber' )
	end;
	
	testSubSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 3)
		self.hero:addSoldierNumber(2)
		self.hero:subSoldierNumber(-1)
		assert ( self.hero:getSoldierNumber() == 2 )
		
		self.hero:subSoldierNumber(1)
		assert ( self.hero:getSoldierNumber() == 1 )
		
		self.hero:subSoldierNumber(2)
		assert ( self.hero:getSoldierNumber() == 0 )
		
		local methodMock = MethodMock()
		methodMock:mock(self.hero, 'setSoldierNumber', function(self) methodMock.walkLog = 'setSoldierNumber' end)
		self.hero:subSoldierNumber(1)
		methodMock:restore()
		assert ( methodMock.walkLog == 'setSoldierNumber' )
	end;
	
	testCarrySoldier = function(self)
		self.hero:setAttrVal(ATTR.CO, 3)
		
		self.hero:carrySoldier({resid=150001001, number=-1})
		assert ( self.hero:getSoldier().resid == 150001001 )
		assert ( self.hero:getSoldier().number == 0 )
		
		self.hero:carrySoldier({resid=150001001, number=1})
		assert ( self.hero:getSoldier().number == 1 )
		
		self.hero:carrySoldier({resid=150001001, number=4})
		assert ( self.hero:getSoldier().number == 3 )
		
		local methodMock = MethodMock()
		methodMock:mock(self.hero, 'setSoldierNumber', function(self) methodMock.walkLog = 'setSoldierNumber' end)
		self.hero:carrySoldier({resid=150001001, number=1})
		methodMock:restore()
		assert ( methodMock.walkLog == 'setSoldierNumber' )
	end;
	
	testUncarrySoldier = function(self)
		self.hero:setAttrVal(ATTR.CO, 3)
		self.hero:carrySoldier({resid=150001001, number=1})
		
		self.hero:uncarrySoldier()
		assert ( self.hero:getSoldier().resid == 0 )
		assert ( self.hero:getSoldier().number == 0 )
		
		local methodMock = MethodMock()
		methodMock:mock(self.hero, 'setSoldierNumber', function(self) methodMock.walkLog = 'setSoldierNumber' end)
		self.hero:uncarrySoldier()
		methodMock:restore()
		assert ( methodMock.walkLog == 'setSoldierNumber' )
	end;
	
	testSetSoldierNumber = function(self)
		self.hero:setAttrVal(ATTR.CO, 3)
		self.hero:setSoldierNumber(-1)
		assert ( self.hero:getSoldier().number == 0 )
		
		self.hero:setSoldierNumber(1)
		assert ( self.hero:getSoldier().number == 1 )
		
		self.hero:setSoldierNumber(4)
		assert ( self.hero:getSoldier().number == 3 )
		
		local methodMock = MethodMock()
		methodMock:mock(self.hero, 'formatSoldierNumber', function(self) methodMock.walkLog = 'formatSoldierNumber' end)
		methodMock:mock(self.hero, 'recalcRoleAFAttr', function(self) methodMock.walkLog = methodMock.walkLog..',recalcRoleAFAttr' end)
		methodMock:mock(self.hero, 'recalcHeroFCAttr', function(self) methodMock.walkLog = methodMock.walkLog..',recalcHeroFCAttr' end)
		self.hero:setSoldierNumber(1)
		methodMock:restore()
		assert ( methodMock.walkLog == 'formatSoldierNumber,recalcRoleAFAttr,recalcHeroFCAttr' )
	end;
	
	testSetSoldierResid = function(self)
		self.hero:setSoldierResid(0)
		assert ( self.hero:getSoldierResid() == 0 )
		
		self.hero:setSoldierResid(150001001)
		assert ( self.hero:getSoldierResid() == 150001001 )
	end;
	
	testRecalcRoleAFAttr = function(self)
		self.hero:setAttrVal(ATTR.CO, 1)
		self.hero:setSoldierNumber(1)
		clearSendMsg_t()
		
		self.hero:recalcRoleAFAttr()
		assert ( selectSendMsgCnt_t('eq@'..'{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{"'..ATTR.AF..'":{val:1,u:0}}}}' ) == 1 )
	end;
	
	testRecalcHeroFCAttr = function(self)
		self.hero:setAttrVal(ATTR.CO, 100)
		self.hero:carrySoldier({resid=150001001, number=100})
		clearSendMsg_t()
		
		self.hero:recalcHeroFCAttr()
		assert ( selectSendMsgCnt_t('has@'..'{cmd:'..NETCMD.HERORES..',heros:%[{id:1,attrs:{"'..ATTR.FC..'":{val:' ) == 1 )
	end;
	
	test_getHeroSteel = function(self)
		assertEQ ( self.hero:getHeroSteel():getClass(), HeroSteel )
	end;
	
	
})

tqHero_t_main = function(suite)
	suite:addTestCase(TestCaseHero, 'TestCaseHero')
	suite:addTestCase(TestCaseHeroSoldier, 'TestCaseHeroSoldier')
end;


