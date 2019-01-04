--*******************************************************************************
require('tqPlayerActTerrace')

local TestCasePlayerActTerrace = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getTodayEnterTimes = function(self)
		assertEQ ( self.player:getActTerrace():getTodayEnterTimes(), 0 )
	end;
	
	test_setTodayEnterTimes = function(self)
		Util:setTimeDrt(1374573632)
		self.player:getActTerrace():setTodayEnterTimes(1)
		assertEQ ( self.player:getActTerrace():getTodayEnterTimes(), 1 )
		
		Util:setTimeDrt(1374573632 + 24*3600)
		assertEQ ( self.player:getActTerrace():getTodayEnterTimes(), 0 )
		
		self.player:getActTerrace():setTodayEnterTimes(2)
		assertEQ ( self.player:getActTerrace():getTodayEnterTimes(), 2 )
	end;
	
	test_setLeftLifes = function(self)
		assertEQ ( self.player:getActTerrace():getLeftLifes(), 0 )
		self.player:getActTerrace():setLeftLifes(1)
		assertEQ ( self.player:getActTerrace():getLeftLifes(), 1 )
	end;
	
	test_setStopTime = function(self)
		assertEQ ( self.player:getActTerrace():getStopTime(), 0 )
		self.player:getActTerrace():setStopTime(1)
		assertEQ ( self.player:getActTerrace():getStopTime(), 1 )
	end;
	
	test_setCurGate = function(self)
		assertEQ ( self.player:getActTerrace():getCurGate().gateId, 0 )
		assertEQ ( self.player:getActTerrace():getCurGate().subGateId, 0 )
		self.player:getActTerrace():setCurGate({gateId=1, subGateId=2})
		assertEQ ( self.player:getActTerrace():getCurGate().gateId, 1 )
		assertEQ ( self.player:getActTerrace():getCurGate().subGateId, 2 )
	end;
	
	test_setMaxGate = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 1 )
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 1 )
		
		self.player:getActTerrace():setMaxGate({gateId=2, subGateId=3})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 2)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 3 )
		
		self.player:getActTerrace():setMaxGate({gateId=3, subGateId=3})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 3)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 3 )
		
		self.player:getActTerrace():setMaxGate({gateId=3, subGateId=4})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 3)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 4 )
		
		self.player:getActTerrace():setMaxGate({gateId=3, subGateId=3})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 3)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 4 )
		
		self.player:getActTerrace():setMaxGate({gateId=2, subGateId=5})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, 3)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, 4 )
		
		self.player:getActTerrace():setMaxGate({gateId=9, subGateId=8})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, res_act_terrace_max_gate_id)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, res_act_terrace_max_subgate_id )
		
		self.player:getActTerrace():setMaxGate({gateId=10, subGateId=1})
		assertEQ ( self.player:getActTerrace():getMaxGate().gateId, res_act_terrace_max_gate_id)
		assertEQ ( self.player:getActTerrace():getMaxGate().subGateId, res_act_terrace_max_subgate_id )
		assertEQ ( self.mm.params['send'], {self.player, {'actTerrace'}} )
	end;
	
	test_setResult = function(self)
		assertEQ ( self.player:getActTerrace():getResultCount(), 0 )
		self.player:getActTerrace():setResult(0, 10)
		assertEQ ( self.player:getActTerrace():getResultCount(), 1 )
		assertEQ ( self.player:getActTerrace():getResultByIdx(0), 10 )
		
		self.player:getActTerrace():setResult(2, 20)
		assertEQ ( self.player:getActTerrace():getResultCount(), 1 )
		assertEQ ( self.player:getActTerrace():getResultByIdx(2), 0 )
		
		self.player:getActTerrace():setResult(0, 100)
		assertEQ ( self.player:getActTerrace():getResultCount(), 1 )
		assertEQ ( self.player:getActTerrace():getResultByIdx(0), 100 )
		
		self.player:getActTerrace():setResult(0, 101)
		assertEQ ( self.player:getActTerrace():getResultByIdx(0), 101, 'user max value' )
		
		self.player:getActTerrace():setResult(0, 99)
		assertEQ ( self.player:getActTerrace():getResultByIdx(0), 101, 'user max value' )
		
		for i=1, 99 do
			self.player:getActTerrace():setResult(i, i)
		end
		assertEQ ( self.player:getActTerrace():getResultCount(), 100 )
		assertEQ ( self.player:getActTerrace():getResultByIdx(99), 99 )
		self.player:getActTerrace():setResult(100, 100)
		assertEQ ( self.player:getActTerrace():getResultCount(), 100 )
	end;
	
	test_getResultByIdx = function(self)
		assertEQ ( self.player:getActTerrace():getResultByIdx(-1), 0 )
		assertEQ ( self.player:getActTerrace():getResultByIdx(0), 0 )
	end;
	
	test_setAutoStartTime = function(self)
		assertEQ ( self.player:getActTerrace():getAutoStartTime(), 0 )
		self.player:getActTerrace():setAutoStartTime(10)
		assertEQ ( self.player:getActTerrace():getAutoStartTime(), 10 )
	end;
	
	test_setAutoToSubGateId = function(self)
		assertEQ ( self.player:getActTerrace():getAutoToSubGateId(), 0 )
		self.player:getActTerrace():setAutoToSubGateId(1)
		assertEQ ( self.player:getActTerrace():getAutoToSubGateId(), 1 )
	end;
})


tqPlayerActTerrace_t_main = function(suite)
	suite:addTestCase(TestCasePlayerActTerrace, 'TestCasePlayerActTerrace')
end;


