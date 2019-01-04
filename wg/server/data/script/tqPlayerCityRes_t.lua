require('tqPlayerCityRes')

local TestCasePlayerCityRes = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getMoneyOutput = function(self)
		self.player:getCityRes():setIdlePopu(1000)
		assertEQ ( self.player:getCityRes():getMoneyOutput(), 1000 )
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT,val=50,unit=1 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		assertEQ ( self.player:getCityRes():getMoneyOutput(), 1500 )
		
		self.player:setVipLevel(6)
		assertEQ ( self.player:getCityRes():getMoneyOutput(), 2000 )
	end;
	
	test_start = function(self)
		self.player:getCityRes():setBuildVal(100)
		self.player:getCityRes():setBuildHurtVal(0)
		self.player:getCityRes():start()
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.HURT_BUILDVAL), false )
		
		self.player:getCityRes():setBuildHurtVal(10)
		self.player:getCityRes():start()
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.HURT_BUILDVAL), true )
	end;
	
	test_setCommRes = function(self)
		local cres = self.player:getCityRes()
		cres:setWood(100)
		assert(cres:getWood() == 100)
		cres:setStone(101)
		assert(cres:getStone() == 101)
		cres:setIron(102)
		assert(cres:getIron() == 102)
		cres:setFood(103)
		assert(cres:getFood() == 103)
	end;
	
	test_getIdlePopu = function(self)
		local cres = self.player:getCityRes()
		local farm = self.player:getFarm()
		farm:setBlockCount(1)
	end;
	
	test_onCityLevelChange = function(self)
		local cres = self.player:getCityRes()
		self.mm:travelMock(cres, 'resetFarmBlockCount')
		self.mm:mock(cres, 'resetRoleYoungState')
		self.mm:mock(self.player, 'refreshCityGrid')
		
		cres.cityres.lastMaxLevel = 0
		cres.cityres.ucLevel = 2
		cres:onCityLevelChange()
		assert ( self.mm.walkLog == 'resetFarmBlockCount,resetRoleYoungState,refreshCityGrid' )
		assertEQ ( cres.cityres.lastMaxLevel, 2 )
		
		
		cres.cityres.ucLevel = 1
		cres:onCityLevelChange()
		assertEQ ( cres.cityres.lastMaxLevel, 2 )
		
		self.mm:mock(self.player:getCityRes(), '_getDieCityHoldDay', {10})
		self.mm:mock(self.player:getCityRes(), 'sendCityDie')
		self.mm:mock(app:getCityMgr(), '_saveExileGrid')
		local oldGrid = self.player:getCityGrid()
		assertEQ ( oldGrid.roleId,  self.player:getRoleId() )
		
		self.player:getFarm():seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		assertEQ ( self.player:getFarm():getBlockCount(), 1 )
		
		cres:setBuildVal(100)
		cres:setBuildHurtVal(100)
		cres.cityres.ucLevel = 0
		cres:onCityLevelChange()
		assertEQ ( oldGrid.roleId,  0 )
		assertEQ ( oldGrid.objType,  0 )
		assertEQ ( self.player:getFarm():getBlockCount(), 0 )
		assertEQ ( app:getCityMgr():getRoleIdByRoleName(self.player:getRoleName()), self.player:getRoleId() )
		
		local exileGrid = app:getCityMgr():getExileGridByRoleId(self.player:getRoleId())
		assertEQ ( exileGrid.roleId, self.player:getRoleId())
		local newGrid = self.player:getCityGrid()
		assertEQ ( exileGrid == newGrid, true )
		assertEQ ( oldGrid.refreshTime, 0  )
		assertEQ ( exileGrid.refreshTime, Util:getTime() + 10*24*3600 )
		assertEQ ( self.mm.params['sendCityDie'], {} )
		assertEQ ( self.mm.params['_saveExileGrid'], {exileGrid} )
	end;
	
	test_immediateReturnSelfArmysToFieldWhenDie = function(self)
		self.mm:mock( HeroAttrSender, 'sendHerosState' )
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=HERO_STATE.FREE,soldier={resid=150001010,number=10}},{state=HERO_STATE.FREE,soldier={resid=150002001,number=1}} } })
		sourcePlayer:setLevel(1)
		local hero1 = sourcePlayer:getHeroMgr():getHeroById(1)
		local hero2 = sourcePlayer:getHeroMgr():getHeroById(2)
		local army1 = TestArmyResHelper:createArmyEx(sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		local army2 = TestArmyResHelper:createArmyEx(sourcePlayer, CopyFieldPlayer(171002), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), army1 )
		assertEQ ( app:getArmyMgr():getArmyById(army2.armyId), army2 )
		
		hero1:setState(HERO_STATE.EXPED)
		hero2:setState(HERO_STATE.EXPED)
		
		local cres = sourcePlayer:getCityRes()
		cres.cityres.ucLevel = 0
		self.mm:clear()
		cres:onCityLevelChange()
		assertEQ ( hero1:getState(), HERO_STATE.FREE )
		assertEQ ( hero2:getState(), HERO_STATE.FREE )
		assertEQ ( self.mm.params['sendHerosState.3'], {sourcePlayer, {hero1}} )
		assertEQ ( self.mm.params['sendHerosState.4'], {sourcePlayer, {hero2}} )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 0 )
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), nil )
		assertEQ ( app:getArmyMgr():getArmyById(army2.armyId), nil )
	end;
	
	test_immediateReturnSelfArmysToPlayerWhenDie = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=HERO_STATE.FREE,soldier={resid=150001010,number=10}},{state=HERO_STATE.FREE,soldier={resid=150002001,number=1}} } })
		sourcePlayer:setLevel(1)
		targetPlayer:setLevel(1)
		local hero1 = sourcePlayer:getHeroMgr():getHeroById(1)
		local hero2 = sourcePlayer:getHeroMgr():getHeroById(2)
		local army1 = TestArmyResHelper:createArmyEx(sourcePlayer, targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), army1 )
		
		hero1:setState(HERO_STATE.EXPED)
		hero2:setState(HERO_STATE.EXPED)
		
		local cres = sourcePlayer:getCityRes()
		cres.cityres.ucLevel = 0
		cres:onCityLevelChange()
		assertEQ ( hero1:getState(), HERO_STATE.FREE )
		assertEQ ( hero2:getState(), HERO_STATE.FREE )
	
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 0 )
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), nil )
	end;
	
	test_returnEnemyArmysWhenDie = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=HERO_STATE.FREE,soldier={resid=150001010,number=10}},{state=HERO_STATE.FREE,soldier={resid=150002001,number=1}} } })
		sourcePlayer:setLevel(1)
		targetPlayer:setLevel(1)
		local army1 = TestArmyResHelper:createArmyEx(sourcePlayer, targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), army1 )
		
		local cres = targetPlayer:getCityRes()
		cres.cityres.ucLevel = 0
		cres:onCityLevelChange()
		assertEQ ( targetPlayer:getArmyContainer():getEnemyArmyCount(), 1 )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 1 ) 
		assertEQ ( army1.state, ARMYDYN_STATE.RETURN )
	end;
	
	test_returnAllianceArmysWhenDie = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		TestCaseCondition:setPreCond(sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=HERO_STATE.FREE,soldier={resid=150001010,number=10}},{state=HERO_STATE.FREE,soldier={resid=150002001,number=1}} } })
		sourcePlayer:setLevel(1)
		targetPlayer:setLevel(1)
		local army1 = TestArmyResHelper:createArmyEx(sourcePlayer, targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		assertEQ ( app:getArmyMgr():getArmyById(army1.armyId), army1 )
		
		local cres = targetPlayer:getCityRes()
		cres.cityres.ucLevel = 0
		cres:onCityLevelChange()
		assertEQ ( targetPlayer:getArmyContainer():getAllianceArmyCount(), 1 )
		assertEQ ( sourcePlayer:getArmyContainer():getSelfArmyCount(), 1 ) 
		assertEQ ( army1.state, ARMYDYN_STATE.RETURN )
	end;
	
	test_giveupAllFieldsWhenDie = function(self)
		self.player:getSelfField():addField({gridId=1})
		assertEQ ( self.player:getSelfField():getCount(), 1 )
		local cres = self.player:getCityRes()
		cres.cityres.ucLevel = 0
		cres:onCityLevelChange()
		assertEQ ( self.player:getSelfField():getCount(), 0 )
	end;
	
	test__getDieCityHoldDay = function(self)
		self.player:getCityRes():setLevel(1)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 7 )
		
		self.player:getCityRes():setLevel(3)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 7 )
		
		self.player:getCityRes():setLevel(4)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 15 )
		
		self.player:getCityRes():setLevel(7)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 15 )
		
		self.player:getCityRes():setLevel(8)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 30 )
		
		self.player:getCityRes():setLevel(10)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 30 )
		
		self.player:getCityRes():setLevel(11)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 60 )
		
		self.player:getCityRes():setLevel(12)
		self.player:getCityRes():onCityLevelChange()
		assertEQ ( self.player:getCityRes():_getDieCityHoldDay(), 60 )
	end;
	
	test_sendCityDie = function(self)
		local r_getFreeCityPos = {nil}
		self.mm:mock(app:getCityMgr(), 'getFreeCityPos', r_getFreeCityPos )
		self.mm:mock(CreateRoleSender, 'sendCityDieState' )
		self.mm:mock(CreateRoleSender, 'sendCityDieNoPos' )
		self.mm:mock(CreateRoleSender, 'sendCityDie' )
		self.player:getCityRes():sendCityDie()
		assertEQ ( self.mm.walkLog, 'sendCityDieState,getFreeCityPos,sendCityDieNoPos' )
		assertEQ ( self.mm.params['getFreeCityPos'] , {self.player:getCityId()} )
		assertEQ ( self.mm.params['sendCityDieState'] , {self.player} )		
		assertEQ ( self.mm.params['sendCityDieNoPos'] , {self.player } )
		
		self.mm:clear()
		r_getFreeCityPos[1] = {x=1, y=2}
		self.player:getCityRes():sendCityDie()
		assertEQ ( self.mm.walkLog, 'sendCityDieState,getFreeCityPos,sendCityDie' )
		assertEQ ( self.mm.params['getFreeCityPos'] , {self.player:getCityId()} )
		assertEQ ( self.mm.params['sendCityDie'] , {self.player,   {x=1, y=2}} )
	end;
	
	test_addWood = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.player:getCityRes():addWood(10)
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.WOOD..'",10'} )
	end;
	
	test_addStone = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.player:getCityRes():addStone(10)
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.STONE..'",10'} )
	end;
	
	test_addIron = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.player:getCityRes():addIron(10)
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.IRON..'",10'} )
	end;
	
	test_addFood = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.player:getCityRes():addFood(10)
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.FOOD..'",10'} )
	end;
	
	test_addMoney = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs')
		self.mm:mock(MoneySender, 'send')
		self.player:getCityRes():addMoney(10)
		assertEQ ( self.player:getCityRes():getMoney(), 10)
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.MONEY..'",10'} )
		assertEQ ( self.mm.params['send'], {self.player, {'money'}} )
	end;
	
	test_subMoney = function(self)
		self.mm:mock(MoneySender, 'send')
		self.player:getCityRes():setMoney(10)
		self.player:getCityRes():subMoney(1)
		assertEQ ( self.player:getCityRes():getMoney(), 9)
		assertEQ ( self.mm.params['send'], {self.player, {'money'}} )
	end;
	
	test_refreshIdlePopu = function(self)
		Util:setTimeDrt(10000)
		self.player:getCityRes():setLevel(0)
		self.player:getCityRes():refreshIdlePopu()
		assertEQ ( self.player:getCityRes():getIdlePopu(), 0 )
		assertEQ ( self.player:getCityRes():getILastTime() , 10000 )
		
		Util:setTimeDrt(10000 + 100)
		local cur =  math.floor(100*res_idlepopu_output*self.player:getCitys():getMaxPopu())
		self.player:getCityRes():setLevel(1)
		self.player:getCityRes():refreshIdlePopu()
		assertEQ ( self.player:getCityRes():getIdlePopu(), cur )
		
		self.mm:mock(self.player:getFarm(), 'getWorkforce', {1} )
		Util:setTimeDrt(10000 + 100 + 1000000)
		self.player:getCityRes():refreshIdlePopu()
		assertEQ ( self.player:getCityRes():getIdlePopu(), self.player:getCitys():getMaxPopu() - 1)
	end;
	
	test_setIdlePopu = function(self)
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.player:getCityRes():setIdlePopu(10)
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test_addBuildVal = function(self)
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.player:getCityRes():addBuildVal(1)
		assertEQ ( self.player:getCityRes():getBuildVal(), 1 )
		self.player:getCityRes():addBuildVal(1)
		assertEQ ( self.player:getCityRes():getBuildVal(), 2 )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test_setBuildHurtVal = function(self)
		self.player:getCityRes():setBuildVal(100)
		self.player:getCityRes():setBuildHurtVal(-1)
		assertEQ ( self.player:getCityRes():getBuildHurtVal(), 0 )
		
		Util:setTimeDrt(100)
		self.player:getCityRes():setBuildHurtVal(1)
		assertEQ ( self.player:getCityRes():getBuildHurtVal(), 1 )
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 100 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 100-1 )
		
		Util:setTimeDrt(200)
		self.player:getCityRes():setBuildHurtVal(1)
		assertEQ ( self.player:getCityRes():getBuildHurtVal(), 1 )
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 100 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 100-1 )
		
		Util:setTimeDrt(300)
		self.player:getCityRes():setBuildHurtVal(101)
		assertEQ ( self.player:getCityRes():getBuildHurtVal(), 100 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 100-100 )
	end;
	
	test_setBuildVal = function(self)
		Util:setTimeDrt(1000)
		self.player:getCityRes():setBuildVal(-1)
		assertEQ ( self.player:getCityRes():getBuildVal(), 0 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 0 )
		
		Util:setTimeDrt(2000)
		self.player:getCityRes():setBuildVal(100)
		assertEQ ( self.player:getCityRes():getBuildVal(), 100 )
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 2000 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 100 )
		
		Util:setTimeDrt(3000)
		self.player:getCityRes():setBuildVal(100)
		assertEQ ( self.player:getCityRes():getBuildVal(), 100 )
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 2000 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 100 )
		
		Util:setTimeDrt(4000)
		self.player:getCityRes():setBuildVal(100)
		self.player:getCityRes():setBuildHurtVal(100)
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 4000 )
		assertEQ ( self.player:getCityRes():getBuildVal(), 100 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 0 )
		
		Util:setTimeDrt(5000)
		self.player:getCityRes():setBuildVal(10)
		self.player:getCityRes():setBuildHurtVal(100)
		assertEQ ( self.player:getCityGrid().misc.buildValTime, 4000 )
		assertEQ ( self.player:getCityRes():getBuildVal(), 10 )
		assertEQ ( self.player:getCityRes():getBuildHurtVal(), 10 )
		assertEQ ( self.player:getCityGrid().buildCurVal, 0 )
	end;
})


tqPlayerCityRes_t_main = function(suite)
	suite:addTestCase(TestCasePlayerCityRes, 'TestCasePlayerCityRes')
end;


