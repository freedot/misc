--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqArmyCampActorsGetter')

local TestCaseArmyCampActorsGetter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		self.copyfieldRes = ItemResUtil:findItemres(171001)
		self.copyfieldRes.citydefid = 1
		res_citydefs={{juma=1,leishi=1,gunmu=1,nujian=1,walldef=2,wallhp=100,xianjing=1,id=1}}
		res_copyfields={{name='一伙暴民',taofadrop=7500001,level=1,dantiaodrop=7500001,needtime=8,heros={0,7600001,0,0,0},walllevel=0,lineup=180001,id=171001,citydefid=1}}	
	end;
	
	tearDown = function(self)
		TestCaseHelper:restoreRes()
		TestCaseHelper:clearAll(self)
		self.copyfieldRes.citydefid = 0
	end;
	
	testCreateCityDefActorsFieldPlayer = function(self)
		local actors = {}
		local fieldPlayer = CopyFieldPlayer(171001)
		ArmyCampActorsGetter:createCityDefActors(fieldPlayer, actors)

		assert ( table.getn(actors) == 5 )
		assert ( actors[1]:getDefType() == CITYDEF_TYPE.XIANJING)
		assert ( actors[1]:getNumber() == 1)
		assert ( actors[2]:getDefType() == CITYDEF_TYPE.GUNMU)
		assert ( actors[2]:getNumber() == 1)
		assert ( actors[3]:getDefType() == CITYDEF_TYPE.JUMA)
		assert ( actors[3]:getNumber() == 1)
		assert ( actors[4]:getDefType() == CITYDEF_TYPE.LEISHI)
		assert ( actors[4]:getNumber() == 1)	
		assert ( actors[5]:getDefType() == CITYDEF_TYPE.NUJIAN)
		assert ( actors[5]:getNumber() == 1)	
	end;
	
	testCreateCityDefActorsCommPlayer = function(self)
		local actors = {}
		local cityDef = self.player:getCityDef()
		cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 10)
		ArmyCampActorsGetter:createCityDefActors(self.player, actors)
		assert ( table.getn(actors) == 1 )
		assert ( actors[1]:getDefType() == CITYDEF_TYPE.XIANJING)
		assert ( actors[1]:getNumber() == 10 )
	end;
	
	testCreateWallActorsFieldPlayer = function(self)
		local actors = {}
		local fieldPlayer = CopyFieldPlayer(171001)
		ArmyCampActorsGetter:createWallActors(fieldPlayer, actors)
		assert ( table.getn(actors) == 3 )
		assert ( actors[1]:getAttrVal(ATTR.HP) == 100 )
		assert ( actors[1]:getAttrVal(ATTR.DE) == 2 )
		assert ( actors[3]:getAttrVal(ATTR.HP) == 100 )
		assert ( actors[3]:getAttrVal(ATTR.DE) == 2 )
	end;
	
	testCreateWallActorsCommPlayer = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.WALLBUILD,level=1,state=0} } })
		local actors = {}
		ArmyCampActorsGetter:createWallActors(self.player, actors)
		assert ( table.getn(actors) == 3 )
		assert ( actors[1]:getAttrVal(ATTR.HP) == 100000 )
		assert ( actors[1]:getAttrVal(ATTR.DE) == 20 )
		assert ( actors[3]:getAttrVal(ATTR.HP) == 100000 )
		assert ( actors[3]:getAttrVal(ATTR.DE) == 20 )
	end;
	
	testCreateHeroOrSoldierActorsFieldPlayer = function(self)
		local actors = {}
		local fieldPlayer = CopyFieldPlayer(171001)
		local defArmy = fieldPlayer:getArmyContainer():getDefArmy()
		
		ArmyCampActorsGetter:createHeroOrSoldierActors(fieldPlayer, defArmy, EXPED_TYPE.TAOFA, actors, FIGHT_CAMP.DEFEND)
		assert ( table.getn(actors) == 1 )
		assert ( actors[1]:getCamp() == FIGHT_CAMP.DEFEND )
		assert ( actors[1]:getClass() == SoldierActor )
		assert ( actors[1]:getLineupPos() > 0 )
	end;

	testCreateHeroOrSoldierActorsCommPlayerSelfArmy = function(self)
		local sourcePlayer, targetPlayer, armyId, needTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		local army = app:getArmyMgr():getArmyById(armyId)
		
		local actors = {}
		ArmyCampActorsGetter:createHeroOrSoldierActors(sourcePlayer, army, EXPED_TYPE.TAOFA, actors, FIGHT_CAMP.ATTACK)
		assert ( table.getn(actors) == 1 )
		assert ( actors[1]:getCamp() == FIGHT_CAMP.ATTACK )
		assert ( actors[1]:getClass() == SoldierActor )
		assert ( actors[1]:getLineupPos() == 1 )
		local defVal = actors[1]:getAttrVal(ATTR.DE)
		local hurtVal = actors[1]:getAttrVal(ATTR.HU)
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=3*24*3600, effect={id=RES_EFF.ZHANSHENZHIGUANG,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		sourcePlayer:getStateContainer():appendState(stateRes, creator)
		
		local actors = {}
		ArmyCampActorsGetter:createHeroOrSoldierActors(sourcePlayer, army, EXPED_TYPE.TAOFA, actors, FIGHT_CAMP.ATTACK)
		assert ( table.getn(actors) == 1 )
		assertEQ ( actors[1]:getAttrVal(ATTR.DE), math.floor(defVal*(1+0.1)) )
		assertEQ ( actors[1]:getAttrVal(ATTR.HU), math.floor(hurtVal*(1+0.1)) )
	end;

	testCreateHeroOrSoldierActorsCommPlayerDefArmy = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{state=0,soldier={resid=150001001,number=1}} } })
		local actors = {}
		self.player:getArmyContainer():setDefArmy(180001, {0,1,0,0,0})
		local defArmy = self.player:getArmyContainer():getDefArmy()
		
		ArmyCampActorsGetter:createHeroOrSoldierActors(self.player, defArmy, EXPED_TYPE.TAOFA, actors, FIGHT_CAMP.DEFEND)
		assert ( table.getn(actors) == 1 )
		assert ( actors[1]:getCamp() == FIGHT_CAMP.DEFEND )
		assert ( actors[1]:getClass() == SoldierActor )
		assert ( actors[1]:getLineupPos() > 0 )
	end;
	
	testCreateHeroOrSoldierActorsCommPlayerTowerArmy = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.TOWERBUILD,level=1,state=0} } })
		local actors = {}
		self.player:getArmyContainer():setAllTowerSoldiers({{resid=0, number=1},{resid=150001001, number=0},{resid=150001001, number=1},{resid=0, number=0},{resid=0, number=0}})
		local towerPlayer = self.player:getArmyContainer():getTowerPlayer()
		local towerArmy = self.player:getArmyContainer():getTowerArmy()
		
		ArmyCampActorsGetter:createHeroOrSoldierActors(towerPlayer, towerArmy, EXPED_TYPE.TAOFA, actors, FIGHT_CAMP.DEFEND)
		assert ( table.getn(actors) == 1 )
	end;

	testGetAttackerActors_playerAttackPlayer = function(self)
		local sourcePlayer, targetPlayer, armyId, needTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		local army = app:getArmyMgr():getArmyById(armyId)
		
		local attackerCamp = ArmyCampActorsGetter:getSourceCamp(army)
		assert ( attackerCamp.player == sourcePlayer )
		assert ( attackerCamp.lineupId == 180001 )
		assert ( table.getn(attackerCamp.actors) == 1 )
	end;
	
	testGetAttackerActors_copyFieldAttackPlayer = function(self)
		local sourcePlayer, targetPlayer, armyId, needTime = TestArmyResHelper:createArmy(CopyFieldPlayer(171001), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		local army = app:getArmyMgr():getArmyById(armyId)
		
		local attackerCamp = ArmyCampActorsGetter:getSourceCamp(army)
		
		assert ( attackerCamp.player:getObjType() == OBJ_TYPE.COPYFIELD )
		assert ( attackerCamp.lineupId == 180001 )
		assert ( table.getn(attackerCamp.actors) == 1 )
	end;
	
	testGetAttackerActors_playerPaiqianPlayer = function(self)
		local sourcePlayer, targetPlayer, armyId, needTime = TestArmyResHelper:createArmy(TestArmyResHelper:createSourcePlayer(), TestArmyResHelper:createTargetPlayer(), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		local army = app:getArmyMgr():getArmyById(armyId)
		
		local sourceCamp = ArmyCampActorsGetter:getSourceCamp(army)
		
		assert ( sourceCamp.player == sourcePlayer )
		assert ( sourceCamp.lineupId == 180001 )
		assert ( table.getn(sourceCamp.actors) == 1 )
	end;
	
	testCreateAllianceActorsCamps = function(self)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		local alliPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('friend1', 'friend1_r', 200001)
		local alliPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('friend2', 'friend2_r', 200002)
		TestCaseCondition:setPreCond(alliPlayer2, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })		
		local _, _, _, _ = TestArmyResHelper:createArmy(alliPlayer1, targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)		
		local _, _, _, _ = TestArmyResHelper:createArmy(alliPlayer2, targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		
		local defenderCamps = {}
		ArmyCampActorsGetter:createAllianceActorsCamps(defenderCamps, targetPlayer, EXPED_TYPE.TAOFA)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( defenderCamps[1].isAlliacneArmy == true )
		assert ( defenderCamps[1].armyId == 2 )
		assert ( defenderCamps[1].player == alliPlayer2 )
		assert ( defenderCamps[1].lineupId == 180001 )
		assert ( table.getn(defenderCamps[1].actors) == 2 )
		assert ( defenderCamps[1].actors[1]:getClass() == SoldierActor )
		assert ( defenderCamps[1].actors[2]:getClass() == SoldierActor )
	end;

	testCreateTowerActorsCamp = function(self)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100001)
		TestCaseCondition:setPreCond(targetPlayer, nil, { builds={ {id=12,resid=FIXID.TOWERBUILD,level=1,state=0} } })
		targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1)

		local defenderCamps = {}
		ArmyCampActorsGetter:createTowerActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TAOFA)
		assert ( table.getn(defenderCamps) == 0,  'no assign tower soldier')
		
		-- assign tower soldier
		targetPlayer:getArmyContainer():setAllTowerSoldiers({{resid=150001010,number=10}})
		
		ArmyCampActorsGetter:createTowerActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TAOFA)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( table.getn(defenderCamps[1].actors) == 2 )
		assert ( defenderCamps[1].actors[1]:getClass() == SoldierActor )
		assert ( defenderCamps[1].actors[2]:getClass() == CityDefActor )
		
		defenderCamps = {}
		ArmyCampActorsGetter:createTowerActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TIAOXIN)
		assert ( table.getn(defenderCamps) == 0 )
	end;
	
	testCreateDefArmyActorsCamp = function(self)
		local bak_res = res_role_initdata.inbuild
		res_role_initdata.inbuild = {{id = 1,resid = FIXID.GOV_BUILD,level = 1,state = BUILD_STATE.COMM,}}
		local targetPlayer = TestCaseHelper:loadPlayerByUserName('target', 'target_r')
		res_role_initdata.inbuild = bak_res
		 
		local defenderCamps = {}
		ArmyCampActorsGetter:createDefArmyActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TAOFA)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( table.getn(defenderCamps[1].actors) == 0 )
		
		-- set defend army, heros, city defend, wall
		TestCaseCondition:setPreCond(targetPlayer, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001010,number=10}}, {state=0,soldier={resid=150001011,number=10}} } })
		targetPlayer:getArmyContainer():setDefArmy(180001, {0,1,2,0,0})
		targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1)
		TestCaseCondition:setPreCond(targetPlayer, nil, { builds={ {id=2,resid=FIXID.WALLBUILD,level=1,state=0} } })
		
		defenderCamps = {}
		ArmyCampActorsGetter:createDefArmyActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TAOFA)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( table.getn(defenderCamps[1].actors) == 2+1+3 )
		assert ( defenderCamps[1].actors[1]:getClass() == SoldierActor )
		assert ( defenderCamps[1].actors[2]:getClass() == SoldierActor )
		assert ( defenderCamps[1].actors[3]:getClass() == WallActorProxy )
		assert ( defenderCamps[1].actors[5]:getClass() == WallActorProxy )
		assert ( defenderCamps[1].actors[6]:getClass() == CityDefActor )
		
		defenderCamps = {}
		ArmyCampActorsGetter:createDefArmyActorsCamp(defenderCamps, targetPlayer, EXPED_TYPE.TIAOXIN)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( table.getn(defenderCamps[1].actors) == 1 )
		assert ( defenderCamps[1].actors[1]:getClass() == HeroActor )
	end;
	
	testGetDefenderCamps = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		local targetPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('target1', 'target1_r', 200001)
		TestCaseCondition:setPreCond(targetPlayer1, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}}, {state=1,soldier={resid=150001011,number=10}} } })
		targetPlayer1:getArmyContainer():setDefArmy(180001, {0,1,2,0,0})
		
		local targetPlayer2 = FieldPlayer(2)
		local  _, _, armyId1, _ = TestArmyResHelper:createArmy(sourcePlayer, targetPlayer1, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		local  _, _, armyId2, _ = TestArmyResHelper:createArmy(sourcePlayer, targetPlayer2, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		
		local army1 = app:getArmyMgr():getArmyById(armyId1)
		local defenderCamps = ArmyCampActorsGetter:getTargetCamps(army1)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( defenderCamps[1].player ==  targetPlayer1 )
		
		local army2 = app:getArmyMgr():getArmyById(armyId2)
		local defenderCamps = ArmyCampActorsGetter:getTargetCamps(army2)
		assert ( table.getn(defenderCamps) == 1 )
		assert ( defenderCamps[1].player:getObjType() == OBJ_TYPE.FIELD )
	end;
	
	test_createHeroOrSoldierActors = function(self)
		local r_createActor = {nil}
		local r_isHeroExped = {false}
		self.mm:mock(ArmyCampActorsGetter, 'createActor', r_createActor )
		self.mm:mock(ArmyCampActorsGetter, 'isHeroExped', r_isHeroExped )
		
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0,soldier={resid=150001010,number=0}}} })
		local p_army = {heros={1}}
		local p_expedType = EXPED_TYPE.TAOFA
		local r_actors = {}
		local p_camp = 0
		ArmyCampActorsGetter:createHeroOrSoldierActors(self.player, p_army, p_expedType, r_actors, p_camp )
		assertEQ ( table.getn(r_actors), 0 )
		assertEQ ( self.mm.params['createActor'], {p_expedType, self.player:getHeroMgr():getHeroById(1), 1, p_camp} )
		
		self.mm:clear()
		r_actors = {}
		r_createActor[1] = {name='actor'}
		local p_army = {heros={1,1}}
		ArmyCampActorsGetter:createHeroOrSoldierActors(self.player, p_army, p_expedType, r_actors, p_camp )
		assertEQ ( table.getn(r_actors), 2 )
		assertEQ ( r_actors[1], {name='actor'} )
		assertEQ ( r_actors[2], {name='actor'} )
		assertEQ ( self.mm.params['isHeroExped'], {p_expedType} )
		
		self.mm:clear()
		r_actors = {}
		r_isHeroExped[1] = true
		ArmyCampActorsGetter:createHeroOrSoldierActors(self.player, p_army, p_expedType, r_actors, p_camp )
		assertEQ ( table.getn(r_actors), 1 )
		assertEQ ( r_actors[1], {name='actor'} )
	end;
	
	test_createActor = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0,soldier={resid=150001010,number=0}},{state=0,soldier={resid=150001010,number=1}}} })
		
		local p_expedType = EXPED_TYPE.TAOFA
		local p_hero = nil
		local p_pos = 1
		local p_camp = 0
		assertEQ ( ArmyCampActorsGetter:createActor(p_expedType, p_hero, p_pos, p_camp), nil )
		
		p_hero = self.player:getHeroMgr():getHeroById(1)
		assertEQ ( ArmyCampActorsGetter:createActor(p_expedType, p_hero, p_pos, p_camp), nil )
		
		p_hero = self.player:getHeroMgr():getHeroById(2)
		local actor = ArmyCampActorsGetter:createActor(p_expedType, p_hero, p_pos, p_camp)
		assertEQ ( actor:getClass(), SoldierActor )
		assertEQ ( actor:getHero(), p_hero )
		assertEQ ( actor:getLineupPos(), p_pos )
		assertEQ ( actor:getCamp(), p_camp )
		
		p_expedType = EXPED_TYPE.DANTIAO
		p_hero = self.player:getHeroMgr():getHeroById(1)
		local actor = ArmyCampActorsGetter:createActor(p_expedType, p_hero, p_pos, p_camp)
		assertEQ ( actor:getClass(), HeroActor )
	end;
	
	test_allocActor = function(self)
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.TAOFA):getClass() == SoldierActor )
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.CUIHUI):getClass() == SoldierActor )
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.PAIQIAN):getClass() == SoldierActor )
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.ZHANLING):getClass() == SoldierActor )
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.DANTIAO):getClass() == HeroActor )
		assert ( ArmyCampActorsGetter:allocActor(EXPED_TYPE.TIAOXIN):getClass() == HeroActor )
	end;
	
	test_isHeroExped = function(self)
		assertEQ ( ArmyCampActorsGetter:isHeroExped(EXPED_TYPE.DANTIAO), true )
		assertEQ ( ArmyCampActorsGetter:isHeroExped(EXPED_TYPE.TIAOXIN), true )
		assertEQ ( ArmyCampActorsGetter:isHeroExped(EXPED_TYPE.TAOFA), false )
	end;
})


tqArmyCampActorsGetter_t_main = function(suite)
	suite:addTestCase(TestCaseArmyCampActorsGetter, 'TestCaseArmyCampActorsGetter')
end;


