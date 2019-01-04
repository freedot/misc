--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqCampActorInfoSetterForDebug')

local TestCaseCampActorInfoSetterForDebug = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setActorInfo = function(self)
		local outActor = {}
		local mMock = MethodMock()
		mMock:mock(CampActorInfoSetterForDebug, 'setWallActorInfo', function(self, inActor, outActor) 
			mMock.walkLog = 'setWallActorInfo'
			mMock.inActor = inActor
			mMock.outActor = outActor
		end)
		CampActorInfoSetterForDebug:setActorInfo(WallActorProxy(), outActor)
		mMock:restore()
		assert ( mMock.walkLog == 'setWallActorInfo' )
		assert ( mMock.inActor:getType() == ACTOR_TYPE.WALL  )
		assert ( mMock.outActor == outActor )
		
		--
		mMock:mock(CampActorInfoSetterForDebug, 'setHeroActorInfo', function(self, inActor, outActor) 
			mMock.walkLog = 'setHeroActorInfo'
			mMock.inActor = inActor
			mMock.outActor = outActor
		end)
		CampActorInfoSetterForDebug:setActorInfo(HeroActor(), outActor)
		mMock:restore()
		assert ( mMock.walkLog == 'setHeroActorInfo' )
		assert ( mMock.inActor:getType() == ACTOR_TYPE.HERO  )
		assert ( mMock.outActor == outActor )
		
		--
		mMock:mock(CampActorInfoSetterForDebug, 'setSoldierActorInfo', function(self, inActor, outActor) 
			mMock.walkLog = 'setSoldierActorInfo'
			mMock.inActor = inActor
			mMock.outActor = outActor
		end)
		CampActorInfoSetterForDebug:setActorInfo(SoldierActor(), outActor)
		mMock:restore()
		assert ( mMock.walkLog == 'setSoldierActorInfo' )
		assert ( mMock.inActor:getType() == ACTOR_TYPE.SOLDIER  )
		assert ( mMock.outActor == outActor )
		
		--
		mMock:mock(CampActorInfoSetterForDebug, 'setCityDefActorInfo', function(self, inActor, outActor) 
			mMock.walkLog = 'setCityDefActorInfo'
			mMock.inActor = inActor
			mMock.outActor = outActor
		end)
		CampActorInfoSetterForDebug:setActorInfo(CityDefActor(), outActor)
		mMock:restore()
		assert ( mMock.walkLog == 'setCityDefActorInfo' )
		assert ( mMock.inActor:getType() == ACTOR_TYPE.DEF  )
		assert ( mMock.outActor == outActor )
	end;
	
	test_setWallActorInfo = function(self)
		local outActor = {}
		local wallActor = WallActorProxy()
		local wallData = WallActorData()
		wallData:setHPAndDEF(100, 10)
		wallActor:setWallData(wallData)
		
		CampActorInfoSetterForDebug:setWallActorInfo(wallActor, outActor)
		assert ( outActor.detail ~= nil )
		assert ( outActor.detail.attrs ~= nil )
		assert ( outActor.detail.attrs[ATTR.HP] == 100 )
		assert ( outActor.detail.attrs[ATTR.MHP] == 100 )
		assert ( outActor.detail.attrs[ATTR.DE] == 10 )
		assert ( outActor.detail.attackSpeed == MIN_ATTACKSPEED )
		assert ( outActor.detail.attackRange == MIN_ATTACKRANGE )
		assert ( outActor.detail.isCanDodge == false )
	end;
	
	test_setHeroActorInfo = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}}} })
		local hero = self.player:getHeroMgr():getHeroById(1)
		
		local outActor = {}
		local heroActor = HeroActor()
		heroActor:setHero(hero)
		
		CampActorInfoSetterForDebug:setHeroActorInfo(heroActor, outActor)
		assert ( outActor.detail ~= nil )
		assert ( outActor.detail.attrs ~= nil )
		assert ( outActor.detail.attrs[ATTR.HU] > 0 )
		assert ( outActor.detail.attrs[ATTR.DE] > 0 )
		assert ( outActor.detail.attrs[ATTR.HI] > 0 )
		assert ( outActor.detail.attrs[ATTR.HP] > 0 )
		assert ( outActor.detail.attrs[ATTR.ES] > 0 )
		assert ( outActor.detail.attrs[ATTR.BER] > 0 )
		assert ( outActor.detail.attrs[ATTR.SFC] > 0 )
		
		assert ( outActor.detail.attackSpeed > 0 )
		assert ( outActor.detail.attackRange > 0 )
		assert ( outActor.detail.isCanDodge == true )
		assert ( outActor.detail.icon > 0 )
	end;
	
	test_setSoldierActorInfo = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{state=0,soldier={resid=150001001,number=1}}} })
		local hero = self.player:getHeroMgr():getHeroById(1)
		
		local outActor = {}
		local soldierActor = SoldierActor()
		soldierActor:setHero(hero)
		
		CampActorInfoSetterForDebug:setSoldierActorInfo(soldierActor, outActor)
		assert ( outActor.detail ~= nil )
		assert ( outActor.detail.attrs ~= nil )
		assert ( outActor.detail.attrs[ATTR.HU] > 0 )
		assert ( outActor.detail.attrs[ATTR.DE] > 0 )
		assert ( outActor.detail.attrs[ATTR.HI] > 0 )
		assert ( outActor.detail.attrs[ATTR.HP] > 0 )
		assert ( outActor.detail.attrs[ATTR.ES] > 0 )
		assert ( outActor.detail.attrs[ATTR.BER] > 0 )
		assert ( outActor.detail.attrs[ATTR.UHP] > 0 )
		assert ( outActor.detail.attrs[ATTR.FC] > 0 )
		
		assert ( outActor.detail.attackSpeed > 0 )
		assert ( outActor.detail.attackRange > 0 )
		assert ( outActor.detail.isCanDodge == true )
		assert ( outActor.detail.icon > 0 )
	end;
	
	test_setCityDefActorInfo = function(self)
		local outActor = {}
		
		local cityDef = self.player:getCityDef()
		cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 1000)
		local defActor = CityDefActor()
		defActor:setCityDef(cityDef, CITYDEF_TYPE.XIANJING)
		
		CampActorInfoSetterForDebug:setCityDefActorInfo(defActor, outActor)
		assert ( outActor.detail ~= nil )
		assert ( outActor.detail.attrs ~= nil )
		assert ( outActor.detail.attrs[ATTR.HU] > 0 )
		
		assert ( outActor.detail.unitNumber == 50 )
		assert ( outActor.detail.attackSpeed == MIN_ATTACKSPEED )
		assert ( outActor.detail.attackRange == MAX_ATTACKRANGE )
		assert ( outActor.detail.isCanDodge == true )
	end;
})


tqCampActorInfoSetterForDebug_t_main = function(suite)
	suite:addTestCase(TestCaseCampActorInfoSetterForDebug, 'TestCaseCampActorInfoSetterForDebug')
end;


