--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerWall')

local TestCasePlayerWall = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.WALLBUILD,level=1,state=0} } })
		self.res_inbuild_ = res_inbuild
		res_inbuild={{id=FIXID.WALLBUILD*1000+1, hp=100000, def=20}}
	end;
	
	tearDown = function(self)
		res_inbuild = self.res_inbuild_
		TestCaseHelper:clearAll(self)
	end;
	
	testGetWallHPAndDEF = function(self)
		local wall = self.player:getWall()
		assert ( wall ~= nil )
		local hp, def = wall:getHPAndDEF()
		assert ( hp == 100000 )
		assert ( def == 20 )
	end;
})


tqPlayerWall_t_main = function(suite)
	suite:addTestCase(TestCasePlayerWall, 'TestCasePlayerWall')
end;


