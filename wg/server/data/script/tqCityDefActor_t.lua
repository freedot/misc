--*******************************************************************************
--*******************************************************************************
require('tqCityDefActor')

local TestCaseCityDefActor = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local cityDef = self.player:getCityDef()
		cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.GUNMU, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.JUMA, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.LEISHI, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.NUJIAN, 1000)
		
		self.actor = CityDefActor()
		self.actor:setCityDef(cityDef, CITYDEF_TYPE.XIANJING)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetName = function(self)
		local actor = CityDefActor()
		actor:setCityDef(self.player:getCityDef(), CITYDEF_TYPE.XIANJING)
		assert ( actor:getName() == rstr.cityDefActorNames[CITYDEF_TYPE.XIANJING] )
		
		local actor = CityDefActor()
		actor:setCityDef(self.player:getCityDef(), CITYDEF_TYPE.GUNMU)
		assert ( actor:getName() == rstr.cityDefActorNames[CITYDEF_TYPE.GUNMU] )
		
		local actor = CityDefActor()
		actor:setCityDef(self.player:getCityDef(), CITYDEF_TYPE.JUMA)
		assert ( actor:getName() == rstr.cityDefActorNames[CITYDEF_TYPE.JUMA] )
		
		local actor = CityDefActor()
		actor:setCityDef(self.player:getCityDef(), CITYDEF_TYPE.LEISHI)
		assert ( actor:getName() == rstr.cityDefActorNames[CITYDEF_TYPE.LEISHI] )
		
		local actor = CityDefActor()
		actor:setCityDef(self.player:getCityDef(), CITYDEF_TYPE.NUJIAN)
		assert ( actor:getName() == rstr.cityDefActorNames[CITYDEF_TYPE.NUJIAN] )
	end;
})


tqCityDefActor_t_main = function(suite)
	suite:addTestCase(TestCaseCityDefActor, 'TestCaseCityDefActor')
end;


