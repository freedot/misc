--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerCityDef')

local TestCasePlayerCityDef = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.cityDef = PlayerCityDef(self.player)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testDefNumber = function(self)
		self.cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 1)
		self.cityDef:setDefNumber(CITYDEF_TYPE.GUNMU, 2)
		self.cityDef:setDefNumber(CITYDEF_TYPE.JUMA, 3)
		self.cityDef:setDefNumber(CITYDEF_TYPE.LEISHI, 4)
		self.cityDef:setDefNumber(CITYDEF_TYPE.NUJIAN, 5)
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.XIANJING) == 1 )
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.GUNMU) == 2 )
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.JUMA) == 3 )
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.LEISHI) == 4 )
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.NUJIAN) == 5 )
	end;
	
	test_setBuildingStopTime = function(self)
		self.cityDef:setBuildingStopTime(10)
		assertEQ ( self.cityDef:getBuildingStopTime(), 10 )
	end;
	
	test_setBuildingResid = function(self)
		self.cityDef:setBuildingResid(100011)
		assertEQ ( self.cityDef:getBuildingResid(), 100011 )
	end;
	
	test_setBuildingNumber = function(self)
		self.cityDef:setBuildingNumber(20)
		assertEQ ( self.cityDef:getBuildingNumber(), 20 )
	end;
})


tqPlayerCityDef_t_main = function(suite)
	suite:addTestCase(TestCasePlayerCityDef, 'TestCasePlayerCityDef')
end;


