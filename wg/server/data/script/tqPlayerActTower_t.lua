--*******************************************************************************
require('tqPlayerActTower')

test_helper_actTower_setMaxLayer = function(player, maxLayer)
	player:getActTower().actTower.maxLayer = maxLayer
end;

local TestCasePlayerActTower = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getTodayEnterTimes = function(self)
		assertEQ ( self.player:getActTower():getTodayEnterTimes(), 0 )
	end;
	
	test_setTodayEnterTimes = function(self)
		Util:setTimeDrt(1374573632)
		self.player:getActTower():setTodayEnterTimes(1)
		assertEQ ( self.player:getActTower():getTodayEnterTimes(), 1 )
		
		Util:setTimeDrt(1374573632 + 24*3600)
		assertEQ ( self.player:getActTower():getTodayEnterTimes(), 0 )
		
		self.player:getActTower():setTodayEnterTimes(2)
		assertEQ ( self.player:getActTower():getTodayEnterTimes(), 2 )
	end;
	
	test_setLeftLifes = function(self)
		assertEQ ( self.player:getActTower():getLeftLifes(), 0 )
		self.player:getActTower():setLeftLifes(1)
		assertEQ ( self.player:getActTower():getLeftLifes(), 1 )
	end;
	
	test_setStopTime = function(self)
		assertEQ ( self.player:getActTower():getStopTime(), 0 )
		self.player:getActTower():setStopTime(1)
		assertEQ ( self.player:getActTower():getStopTime(), 1 )
	end;
	
	test_setCurLayer = function(self)
		assertEQ ( self.player:getActTower():getCurLayer(), 0 )
		self.player:getActTower():setCurLayer(1)
		assertEQ ( self.player:getActTower():getCurLayer(), 1 )
	end;
	
	test_getMaxLayerTime = function(self)
		assertEQ ( self.player:getActTower():getMaxLayerTime(), 0 )
		assertEQ ( self.player:getActTower():getMaxLayer(), 0 )
		Util:setTimeDrt(10)
		self.player:getActTower():setMaxLayer(20)
		assertEQ ( self.player:getActTower():getMaxLayerTime(), 10 )
		Util:setTimeDrt(20)
		self.player:getActTower():setMaxLayer(10)
		assertEQ ( self.player:getActTower():getMaxLayer(), 20 )
		assertEQ ( self.player:getActTower():getMaxLayerTime(), 10 )
	end;
	
	test_setMaxLayerSendRoleMsg = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.player:getActTower():setMaxLayer(20)
		assertEQ ( self.mm.params['send'], {self.player, {'actTower'}} )
	end;
	
	test_setMaxLayerWhenArrivedMaxLevel = function(self)
		self.player:getActTower():setMaxLayer(res_act_tower_max_layer + 1)
		assertEQ ( self.player:getActTower():getMaxLayer(), res_act_tower_max_layer )
	end;
	
	test_setAutoStartTime = function(self)
		assertEQ ( self.player:getActTower():getAutoStartTime(), 0 )
		self.player:getActTower():setAutoStartTime(10)
		assertEQ ( self.player:getActTower():getAutoStartTime(), 10 )
	end;
	
	test_setAutoToLayer = function(self)
		assertEQ ( self.player:getActTower():getAutoToLayer(), 0 )
		self.player:getActTower():setAutoToLayer(10)
		assertEQ ( self.player:getActTower():getAutoToLayer(), 10 )
	end;
})


tqPlayerActTower_t_main = function(suite)
	suite:addTestCase(TestCasePlayerActTower, 'TestCasePlayerActTower')
end;


