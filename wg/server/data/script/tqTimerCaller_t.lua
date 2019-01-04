--*******************************************************************************
require('tqTimerCaller')

local TestCaseTimerCaller = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self._timer1 = {count=0}
		self._timer2 = {count=0}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	onTimer1 = function(self, timer, seq, curTime, params)
		self._timer1.count = self._timer1.count + 1
		self._timer1.seq = seq
		self._timer1.curTime = curTime
		self._timer1.params = params
	end;
	
	onTimer2 = function(self, timer, seq, curTime, params)
		self._timer2.count = self._timer2.count + 1
	end;
	
	test_timerCaller = function(self)
		local timerCaller = TimerCaller:new()
		timerCaller:setId(10)
		timerCaller:register(1, Caller:new(0, self, self.onTimer1))
		timerCaller:register(2, Caller:new(0, self, self.onTimer2))
		
		os.setClockMs(0)
		local timer = Timer:new(500)
		
		os.setClockMs(1000)
		timer:start(1000, {1, 10}, timerCaller)
		timer:start(5000, {2, 20}, timerCaller)
		timer:start(1000, {3, 30}, timerCaller)
		
		os.setClockMs(2000)
		timer:update()
		assertEQ ( self._timer1.count, 1 )
		assertEQ ( self._timer2.count, 0 )
		assertEQ ( self._timer1.seq > 0, true )
		assertEQ ( self._timer1.params[1], 1 )
		assertEQ ( self._timer1.params[2], 10 )
		assertEQ ( self._timer1.curTime, 2000 )
		
		os.setClockMs(6000)
		timer:update()
		assertEQ ( self._timer2.count, 1 )	

		self._timer1.count = 0
		os.setClockMs(7000)
		timer:clearCaller(timerCaller:getId())
		timer:update()
		assertEQ ( self._timer1.count, 0 )	
		
		timerCaller = TimerCaller:new(20)
		timerCaller:register(1, Caller:new(0, self, self.onTimer1))
		timer:start(1000, {1, 10}, timerCaller)
		os.setClockMs(8000)
		timer:update()
		assertEQ ( self._timer1.count, 1 )	
		
		timer:clearCaller(timerCaller:getId())
		os.setClockMs(9000)
		timer:update()
		assertEQ ( self._timer1.count, 1 )
	end;
})


tqTimerCaller_t_main = function(suite)
	suite:addTestCase(TestCaseTimerCaller, 'TestCaseTimerCaller')
end;


