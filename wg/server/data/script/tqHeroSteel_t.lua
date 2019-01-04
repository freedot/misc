--*******************************************************************************
--  
--*******************************************************************************
require('tqHeroSteel')

local TestCaseHeroSteel = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.steel = {steelType=HSTEEL_TYPE.COMM, startTime=0, quarters=0, quarterRes=10, quarterMoney=20, hourGold=2, actMult=1}
		self.heroSteel = HeroSteel(self.steel)
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	test_init = function(self)
		assertEQ ( self.heroSteel.steel, self.steel )
	end;
	
	test_setSteelQuarters = function(self)
		self.heroSteel:setSteelQuarters(10)
		assertEQ ( self.heroSteel:getSteelQuarters(), 10 )
	end;
	
	test_setQuarterRes = function(self)
		self.heroSteel:setQuarterRes(2)
		assertEQ ( self.heroSteel:getQuarterRes(), 2 )
	end;

	test_setStartTime = function(self)
		self.heroSteel:setStartTime(1)
		assertEQ ( self.heroSteel:getStartTime(), 1 )
	end;
	
	test_setSteelType = function(self)
		self.heroSteel:setSteelType(HSTEEL_TYPE.COMM)
		assertEQ ( self.heroSteel:getSteelType(), HSTEEL_TYPE.COMM )
		
		self.heroSteel:setSteelType(HSTEEL_TYPE.HIGH)
		assertEQ ( self.heroSteel:getSteelType(), HSTEEL_TYPE.HIGH )
	end;
	
	test_setQuarterMoney = function(self)
		self.heroSteel:setQuarterMoney(10)
		assertEQ ( self.heroSteel.steel.quarterMoney, 10 )
	end;
	
	test_setHourGold = function(self)
		self.heroSteel:setHourGold(10)
		assertEQ ( self.heroSteel.steel.hourGold, 10 )
	end;
	
	test_getSteeledExp = function(self)
		Util:setTimeDrt(1379520000 + 20*3600) -- 8:00 - 11:00 有效
		local r_getSteeledQuarters = {0.5}
		self.mm:mock(self.heroSteel, '_getSteeledQuarters', r_getSteeledQuarters )
		assertEQ ( self.heroSteel:getSteeledExp(), 0 )
		
		r_getSteeledQuarters[1] = 1
		assertEQ ( self.heroSteel:getSteeledExp(), 1*10 )
		
		self.heroSteel:setActMult(3)
		assertEQ ( self.heroSteel:getSteeledExp(), 1*10*3 )
		
		--TestHelperServerActEffectSet(app.getSvrAct(), SVR_TODAY_ACT_TYPE.HERO_STEEL_2)
		--TestHelperServerActEffectClear(app.getSvrAct())
		--TestHelperServerActEffectSet(app.getSvrAct(), SVR_TODAY_ACT_TYPE.HERO_STEEL_3)
		--assertEQ ( self.heroSteel.getSteeledExp(), 1*10*3 )
	end;
	
	test_getReturnMoney = function(self)
		self.mm:mock(self.heroSteel, '_getLeftQuarters', {10} )
		assertEQ ( self.heroSteel:getReturnMoney(), 10*20*0.7 )
	end;
	
	test_getReturnGold = function(self)
		local r_getSteeledQuarters = {0.5}
		self.mm:mock(self.heroSteel, '_getSteeledQuarters', r_getSteeledQuarters )
		self.mm:mock(self.heroSteel, 'getSteelQuarters', {10} )
		self.mm:mock(self.heroSteel, '_getLeftQuarters', {5} )
		
		assertEQ ( self.heroSteel:getReturnGold(), 10*2/4 )
		
		r_getSteeledQuarters[1] = 5
		assertEQ ( self.heroSteel:getReturnGold(), math.floor(5*2/4) )
	end;
	
	test__getDuration = function(self)
		assertEQ ( self.heroSteel:_getDuration(), 0 )
		Util:setTimeDrt(11)
		self.steel.startTime = 1
		self.steel.quarters = 1
		assertEQ ( self.heroSteel:_getDuration(), 10 )
		Util:setTimeDrt(900 + 11)
		assertEQ ( self.heroSteel:_getDuration(), 900 )
		Util:setTimeDrt(0)
		assertEQ ( self.heroSteel:_getDuration(), 0 )
	end;
	
	test__getSteeledQuarters = function(self)
		self.mm:mock(self.heroSteel, '_getDuration', {900})
		assertEQ ( self.heroSteel:_getSteeledQuarters(), 1 )
	end;
	
	test__getLeftQuarters = function(self)
		self.mm:mock(self.heroSteel, 'getSteelQuarters', {10})
		self.mm:mock(self.heroSteel, '_getSteeledQuarters', {5})
		assertEQ ( self.heroSteel:_getLeftQuarters(), 5 )
	end;
	
	test_setActMult = function(self)
		assertEQ ( self.heroSteel:getActMult(), 1 )
		self.heroSteel:setActMult(2)
		assertEQ ( self.heroSteel:getActMult(), 2 )
	end;
})

tqHeroSteel_t_main = function(suite)
	suite:addTestCase(TestCaseHeroSteel, 'TestCaseHeroSteel')
end;


