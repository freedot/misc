require('tqCultureHandler')

local TestCaseLearnCultureHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.needres = ItemResUtil:findCultureLevelres(120006, 1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInvalidCultureId = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=10000, food=10000, wood=10000, stone=10000, iron=10000,  cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=1,state=0} } })
		local cmd = {id=FIXID.FIRSTCBUILD-1}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testCultureFullLevel = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=100000000, food=100000000, wood=100000000, stone=100000000, iron=100000000,  cultures={{id=120001, level=100},{id=120006, level=10}}, builds={ {id=10,resid=110010,level=100,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testHasCultureLearning = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=self.needres.iron,  learningculture={id=120001, stoptime=1}, cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=1,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInvalidPreCond1 = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=self.needres.iron,  cultures={}, builds={ {id=10,resid=110010,level=1,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testInvalidPreCond2 = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=self.needres.iron,  cultures={{id=120001, level=1}} })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testNoEnoughMoney = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=0, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=self.needres.iron,  cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=1,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 2 );
	end;
	
	testNoEnoughWood = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=0, stone=self.needres.stone, iron=self.needres.iron,  cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=1,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	testNoEnoughIron = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=0,  cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=10,state=0} } })
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 );
	end;
	
	helper_learnOk = function(self, isVip ) 
		if isVip then
			self.player:setVipLevel(1)
		end
		
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.player, nil, {money=self.needres.money, food=self.needres.food, wood=self.needres.wood, stone=self.needres.stone, iron=self.needres.iron,   cultures={{id=120001, level=1}}, builds={ {id=10,resid=110010,level=10,state=0} } })
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT,val=50,unit=1 }}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		
		local cmd = {id=120006}
		LearnCultureHdr:handle(self.player, cmd)
	
		assert ( self.player:getCityRes():getMoney() == 0 )
		assert ( self.player:getCityRes():getFood() == 0 )
		assert ( self.player:getCityRes():getWood() == 0 )
		assert ( self.player:getCityRes():getStone() == 0 )
		assert ( self.player:getCityRes():getIron() == 0 )
		
		local learningCulture = self.player:getCultures():getLearningCulture()
		assert ( learningCulture.id == 120006 )
		
		local roleBrains = self.player:getAttrVal(ATTR.BR_B) + self.player:getAttrVal(ATTR.BR_A)
		local buffadd = 50/100
		local needtime = res_calc_fact_learn_culture_time(self.needres.ntime, 10, roleBrains, buffadd) 
		if isVip then
			needtime = 0
		end
		assert ( learningCulture.stoptime == Util:getTime() + needtime )
		assertEQ ( self.mm.params['start'], {needtime*1000, {TIMER_EVT.LEARN_CULTURE_STOP, 120006}, self.player:getTimerCaller()} )
		assert ( getSendMsgCnt_t() >= 4 )
	end;
	
	testLearnOk = function(self)
		self:helper_learnOk(false)
	end;
	
	test_learn_vip = function(self)
		self:helper_learnOk(true)
	end;
});

local TestCaseCancelLearningCultureHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testNoLearningCulture = function(self)
		local cmd = {}
		CancelLearningCultureHdr:handle(self.player, cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testCancelOK = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { learningculture={id=120001, stoptime=1} })
		local cmd = {}
		CancelLearningCultureHdr:handle(self.player, cmd)
		assert ( self.player:getCultures():getLearningCulture().id == 0 )
		assert ( self.player:getCultures():getLearningCulture().stoptime == 0 )
		assert ( getSendMsgCnt_t() == 1 )
	end;
});

tqCultureHandler_t_main = function(suite)
	suite:addTestCase(TestCaseLearnCultureHdr, 'TestCaseLearnCultureHdr')
	suite:addTestCase(TestCaseCancelLearningCultureHdr, 'TestCaseCancelLearningCultureHdr')
end;

