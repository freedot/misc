--*******************************************************************************
--  Copyright (C) 2012   All rights reserved.
--*******************************************************************************
require('tqWallActorProxy')

local TestCaseWallActorProxy = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetName = function(self)
		assert ( WallActorProxy():getName() == rstr.actor.wallActorName )
	end;
})


tqWallActorProxy_t_main = function(suite)
	suite:addTestCase(TestCaseWallActorProxy, 'TestCaseWallActorProxy')
end;


