require('tqSoldierResHandler')

local TestCaseSoldierResHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = SoldierResHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(1):getClass() == GetSoldersHdr )
		assert ( self.handler:getHandler(2):getClass() == TrainSoldierHdr )
		assert ( self.handler:getHandler(3):getClass() == UpgradeSoldierHdr )
		assert ( self.handler:getHandler(4):getClass() == DemobSoldierHdr )
		assert ( self.handler:getHandler(8):getClass() == ConfirmSoldiersAssignHdr )
	end;	
})

local TestCaseGetSoldersHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(	RoleSoldierSender, 'sendSoldiers' )
		SoldierResHandler():getHandler(1):handle(self.player)
		assertEQ ( self.mm.params['sendSoldiers'], {self.player} )
	end;
})

local TestCaseTrainSoldierHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setLevel(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInValidSoldierId = function(self)
		local cmd = {id=150000,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
		
		local cmd = {id=150006,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testNoEnoughCultureLevel = function(self)
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=needres.money, food=needres.food, cultures={{id=120006, level=0}}, player={ attrs={{id=ATTR.NAF,val=1} } }   })
		local cmd = {id=150001,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInValidSoldierNumber = function(self)
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=needres.money, food=needres.food, cultures={{id=120006, level=1}}, player={ attrs={{id=ATTR.NAF,val=0} } }   })
		local cmd = {id=150001,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testNoEnoughMoney = function(self)
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=0, food=needres.food, cultures={{id=120006, level=1}}, player={ attrs={{id=ATTR.NAF,val=1} } }   })
		local cmd = {id=150001,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2 );
	end;
	
	testNoEnoughFood = function(self)
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=needres.money, food=0, cultures={{id=120006, level=1}}, player={ attrs={{id=ATTR.NAF,val=1} } }   })
		local cmd = {id=150001,num=1}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testNoEnoughCapacity = function(self)
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=needres.money*2, food=needres.food*2, cultures={{id=120006, level=1}}, soldiers={{resid=150002*1000+1,number=1000000}}, player={ attrs={{id=ATTR.NAF,val=2} } }   })
		local cmd = {id=150001,num=2}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testTrainOK = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		local needres = res_soldiers_upd[1]
		TestCaseCondition:setPreCond(self.player, nil, { money=needres.money*2, food=needres.food*2, cultures={{id=120006, level=1}}, player={ attrs={{id=ATTR.NAF,val=2} } }   })
		local cmd = {id=150001,num=2}
		TrainSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 5 );
		assert ( self.player:getCityRes():getMoney() == 0 )
		assert ( self.player:getCityRes():getFood() == 0 )
		assert ( self.player:getAttrVal(ATTR.NAF) == 0 )
		assert ( self.player:getSoldierMgr():getSoldierNumber( WUtil:makeSoldierResId(150001, 1) ) == 2 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.TRAIN_SOLDIER, WUtil:makeSoldierResId(150001, 1), 2} )
	end;
});

local TestCaseUpgradeSoldierHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.needres = res_soldiers_upd[2]
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidSoldierId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, cultures={{id=120006, level=2}}, soldiers={{resid=150002*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=1}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, cultures={{id=120006, level=2}}, soldiers={{resid=150001*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=0}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money*2, food=self.needres.food*2, cultures={{id=120006, level=2}}, soldiers={{resid=150001*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=2}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughCultureLevel = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money*2, food=self.needres.food*2, cultures={{id=120006, level=1}}, soldiers={{resid=150001*1000+1,number=2}} })
		local cmd = {id=150001*1000+1, num=2}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughMoney = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=0, food=self.needres.food*2, cultures={{id=120006, level=2}}, soldiers={{resid=150001*1000+1,number=2}} })
		local cmd = {id=150001*1000+1, num=2}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2 )
	end;
	
	testNoEnoughFood = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money*2, food=0, cultures={{id=120006, level=2}}, soldiers={{resid=150001*1000+1,number=2}} })
		local cmd = {id=150001*1000+1, num=2}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testUpgradeOK = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money*2, food=self.needres.food*2, cultures={{id=120006, level=2}}, soldiers={{resid=150001*1000+1,number=3}} })
		local cmd = {id=150001*1000+1, num=2}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() ~= 0 )
		assert ( self.player:getCityRes():getMoney() == 0 )
		assert ( self.player:getCityRes():getFood() == 0 )
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 1 ) == 1 )
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 2 ) == 2 )
		assert ( self.player:getSoldierMgr():getSoldiersCount() == 2 )
		
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food })
		local cmd = {id=150001*1000+1, num=1}
		UpgradeSoldierHdr:handle(self.player, cmd)
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 1 ) == 0 )
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 2 ) == 3 )
		assert ( self.player:getSoldierMgr():getSoldiersCount() == 1 )
	end;
});

TestCaseDemobSoldierHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.needres = res_soldiers_upd[1]
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidSoldierId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {soldiers={{resid=150002*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=1}
		DemobSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInvalidNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {soldiers={{resid=150001*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=0}
		DemobSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoEnoughNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {soldiers={{resid=150001*1000+1,number=1}} })
		local cmd = {id=150001*1000+1, num=2}
		DemobSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testDemobOK = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {soldiers={{resid=150001*1000+1,number=3}} })
		local cmd = {id=150001*1000+1, num=2}
		DemobSoldierHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() >= 3 )
		assert ( self.player:getCityRes():getMoney() == math.floor(self.needres.money*res_demob_soldier_retres_per)*2 )
		assert ( self.player:getCityRes():getFood() == math.floor(self.needres.food*res_demob_soldier_retres_per)*2 )
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 1 ) == 1 )
		assert ( self.player:getSoldierMgr():getSoldiersCount() == 1 )
		
		local cmd = {id=150001*1000+1, num=1}
		DemobSoldierHdr:handle(self.player, cmd)
		assert ( self.player:getSoldierMgr():getSoldierNumber( 150001*1000 + 1 ) == 0 )
		assert ( self.player:getSoldierMgr():getSoldiersCount() == 0 )
	end;
});

TestCaseConfirmSoldiersAssignHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.hdr = SoldierResHandler():getHandler(8)
	end;

	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.hdr.herosHdr:getClass(), NetCmdHerosHdr )
		assertEQ ( self.hdr.paramParser:getClass(), NetCmdSoldierParser )
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		local r_hasRepeatHeros = {true}
		local r_hasBusyHeros = {true}
		local r_isEmptyHeros = {true}
		local r_hasNoAssignNoChange = {true}
		local r_hasBeyondHasSoldiersNumber = {true}
		local r_hasBeyondCommand = {true}
		
		self.mm:mock(self.hdr, '_initParam', r_initParam )
		self.mm:mock(self.hdr.herosHdr, 'hasRepeatHeros', r_hasRepeatHeros )
		self.mm:mock(self.hdr.herosHdr, 'hasBusyHeros', r_hasBusyHeros )
		self.mm:mock(self.hdr.herosHdr, 'isEmptyHeros', r_isEmptyHeros )
		self.mm:mock(self.hdr, '_hasNoAssignNoChange', r_hasNoAssignNoChange )
		self.mm:mock(self.hdr, '_hasBeyondHasSoldiersNumber', r_hasBeyondHasSoldiersNumber )
		self.mm:mock(self.hdr, '_hasBeyondCommand', r_hasBeyondCommand )
		self.mm:mock(self.hdr, '_takeOff' )
		self.mm:mock(self.hdr, '_confirmAllAssigns' )
		self.mm:mock(self.hdr, '_sendMsg' )
		
		local p_cmd = {}
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_initParam[1] = true
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros' )
		
		self.mm:clear()
		r_hasRepeatHeros[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros' )
		assertEQ ( self.mm.params['hasBusyHeros'], {{[HERO_STATE.ACT_TOWER]=true, [HERO_STATE.ACT_TERRACE]=true}} )
		
		self.mm:clear()
		r_hasBusyHeros[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros,isEmptyHeros' )
		
		self.mm:clear()
		r_isEmptyHeros[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros,isEmptyHeros,_hasNoAssignNoChange' )
		
		self.mm:clear()
		r_hasNoAssignNoChange[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros,isEmptyHeros,_hasNoAssignNoChange,_hasBeyondHasSoldiersNumber' )
		
		self.mm:clear()
		r_hasBeyondHasSoldiersNumber[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros,isEmptyHeros,_hasNoAssignNoChange,_hasBeyondHasSoldiersNumber,_hasBeyondCommand' )
		
		self.mm:clear()
		r_hasBeyondCommand[1] = false
		assertEQ ( self.hdr:handle(self.player, p_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,hasRepeatHeros,hasBusyHeros,isEmptyHeros,_hasNoAssignNoChange,_hasBeyondHasSoldiersNumber,_hasBeyondCommand,_takeOff,_confirmAllAssigns,_sendMsg' )
	end;
	
	test__initParam = function(self)
		local r_handleParam = {false}
		local r_getSoldiers = {nil}
		self.mm:mock(self.hdr.herosHdr, 'handleParam', r_handleParam)
		self.mm:mock(self.hdr.paramParser, 'getSoldiers', r_getSoldiers)
		
		local p_cmd = {}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, 'handleParam' )
		assertEQ ( self.mm.params['handleParam'], {self.player, p_cmd} )
		
		self.mm:clear()
		r_handleParam[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), false )
		assertEQ ( self.mm.walkLog, 'handleParam,getSoldiers' )
		
		self.mm:clear()
		r_getSoldiers[1] = {{id=1}}
		assertEQ ( self.hdr:_initParam(self.player, p_cmd), true )
		assertEQ ( self.hdr.soldiers, r_getSoldiers[1] )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.heros, self.hdr.herosHdr:getHeros() )
		assertEQ ( self.hdr.changedHeros, {} )
		assertEQ ( self.hdr.changedSoldiers, {} )
	end;
	
	test__getCurSoldierByIdx = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {
			heros={{state=0,level=2,soldier={resid=150001001,number=10}}
				}  })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.hdr.heros = {self.hero}
		assertEQ ( self.hdr:_getCurSoldierByIdx(1), self.hero:getSoldier() )
	end;
	
	test__getCarriedNumber = function(self)
		self.hdr.soldiers = {{id=1}}
		local r_getCurSoldierByIdx = {{resid=150001001,number=1}}
		self.mm:mock(self.hdr, '_getCurSoldierByIdx', r_getCurSoldierByIdx)
		
		assertEQ ( self.hdr:_getCarriedNumber(150001001), 1 )
		assertEQ ( self.mm.params['_getCurSoldierByIdx'], {1} )
		
		assertEQ ( self.hdr:_getCarriedNumber(150001002), 0 )
	end;
	
	test__carrySoldier = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		TestCaseCondition:setPreCond(self.player, nil, {
			heros={{state=0,level=2,soldier={resid=150001001,number=10}}
				}  })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.hdr.heros = {self.hero}
		self.hdr.player = self.player
		self.mm:mock(self.hero, 'carrySoldier' )
		self.hdr:_carrySoldier(1, {resid=150001002,number=10})
		assertEQ ( self.mm.params['carrySoldier'], {{resid=150001002, number=10}})
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, 150001001, 10} )
	end;
	
	test__recordChange = function(self)
		self.hdr.heros = {{id=1},{id=2}}
		self.hdr.changedSoldiers = {150001001}
		self.hdr.changedHeros = {}
		self.mm:mock( Util, 'insertUnique' )
		self.hdr:_recordChange(1, 150001002)
		assertEQ ( self.mm.walkLog, 'insertUnique,insertUnique' )
		assertEQ ( self.mm.params['insertUnique.1'], {self.hdr.changedSoldiers, 'nil', 150001002})
		assertEQ ( self.mm.params['insertUnique.2'], {self.hdr.changedHeros, 'nil', {id=1}})
	end;
	
	test__getCommand = function(self)
		self.hero:setAttrVal(ATTR.CO, 10)
		self.hdr.heros = {self.hero}
		assertEQ ( self.hdr:_getCommand(1), 10 )
	end;
	
	test__getHeroCount = function(self)
		self.hdr.heros = {{id=1},{id=2}}
		assertEQ ( self.hdr:_getHeroCount(), 2 )
	end;
	
	test__clearSoldier = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {
			heros={{state=0,level=2,soldier={resid=150001001,number=10}}
				}  })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.hdr.heros = {self.hero}
		self.mm:mock(self.hero, 'carrySoldier' )
		self.hdr:_clearSoldier(1, {resid=150001001,number=10})
		assertEQ ( self.mm.params['carrySoldier'], {{resid=150001001, number=0}})
	end;
	
	test__sendMsg = function(self)
		self.hdr.player = self.player
		self.hdr.changedHeros = {1}
		self.hdr.changedSoldiers = {2}
		self.mm:mock( HeroAttrSender, 'sendCarrySoldiers' )
		self.mm:mock( RoleSoldierSender, 'sendSoldiersByIds' )
		self.hdr:_sendMsg()
		assertEQ ( self.mm.walkLog, 'sendCarrySoldiers,sendSoldiersByIds' )
		assertEQ ( self.mm.params['sendCarrySoldiers'], {self.player, self.hdr.changedHeros} )
		assertEQ ( self.mm.params['sendSoldiersByIds'], {self.player, self.hdr.changedSoldiers} )
	end;
});

tqSoldierResHandler_t_main = function(suite)
	suite:addTestCase(TestCaseSoldierResHandler, 'TestCaseSoldierResHandler')
	suite:addTestCase(TestCaseGetSoldersHdr, 'TestCaseGetSoldersHdr')
	suite:addTestCase(TestCaseTrainSoldierHdr, 'TestCaseTrainSoldierHdr')
	suite:addTestCase(TestCaseUpgradeSoldierHdr, 'TestCaseUpgradeSoldierHdr')
	suite:addTestCase(TestCaseDemobSoldierHdr, 'TestCaseDemobSoldierHdr')
	suite:addTestCase(TestCaseConfirmSoldiersAssignHdr, 'TestCaseConfirmSoldiersAssignHdr')
end;

