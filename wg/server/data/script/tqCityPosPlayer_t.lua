--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqCityPosPlayer')

local TestCaseCityPosPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetPos = function(self)
		local player = CityPosPlayer(2)
		assert ( player:getCityPos().x == 1 )
		assert ( player:getCityPos().y == 0 )
	end;
	
	testGetObjType = function(self)
		local player = CityPosPlayer(2)
		assert ( player:getObjType() == OBJ_TYPE.CITYPOS )
	end;
})


tqCityPosPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseCityPosPlayer, 'TestCaseCityPosPlayer')
end;


