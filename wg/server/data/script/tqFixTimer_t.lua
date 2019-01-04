--*******************************************************************************
require('tqFixTimer')

local TestCaseFixTimer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self._timeInfo = {count = 0, params={0,0}}
		
		self.timerCaller = TimerCaller:new(10)
		self.timerCaller:register(1, Caller:new(0, self, self.onTimer))
		
		self.timer = FixTimer:new(2) -- 2秒的循环频率
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	onTimer = function(self, timer, seq, curTime, params)
		self._timeInfo.count = self._timeInfo.count + 1
		self._timeInfo.params[1] = params[1]
		self._timeInfo.params[2] = params[2]
	end;
	
	test_start = function(self)
		assertEQ ( self.timer:getFrequency(), 2 )
		
		--1388721600   2014-01-03  12:00:00
		Util:setTimeDrt(1388721600-1)

		os.setClockMs(0)
		self.timer:start({hour=12, min=0, sec=0}, {1,2}, self.timerCaller)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 0 )
		
		os.setClockMs(1000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		assertEQ ( self._timeInfo.params[1], 1 )
		assertEQ ( self._timeInfo.params[2], 2 )
		
		os.setClockMs(1000 + 2000 - 1)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		
		os.setClockMs(1000 + 2000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 2 )
		
		os.setClockMs(1000 + 4000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 3 )
	end;
	
	test_startJustMoment = function(self)
		--1388721600   2014-01-03  12:00:00
		Util:setTimeDrt(1388721600)

		os.setClockMs(0)
		self.timer:start({hour=12, min=0, sec=0}, {1}, self.timerCaller)
		os.setClockMs(500)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		
		os.setClockMs(500 + 2000 - 1)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		
		os.setClockMs(500 + 2000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 2 )
		
		os.setClockMs(500 + 4000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 3 )
	end;
	
	test_startDefaultFrequency = function(self)
		--1388721600   2014-01-03  12:00:00
		self.timer = FixTimer:new() -- 24小时的循环频率
		assertEQ ( self.timer:getFrequency(), 24*3600 )
		Util:setTimeDrt(1388721600)

		os.setClockMs(0)
		self.timer:start({hour=12, min=0, sec=0}, {1}, self.timerCaller)
		os.setClockMs(500)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		
		os.setClockMs(500 + 1*24*3600*1000 - 1)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 1 )
		
		os.setClockMs(500 + 1*24*3600*1000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 2 )
		
		os.setClockMs(500 + 2*24*3600*1000 - 1)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 2 )
		
		os.setClockMs(500 + 2*24*3600*1000)
		global.getTimer():update()
		assertEQ ( self._timeInfo.count, 3 )
	end;
})


tqFixTimer_t_main = function(suite)
	suite:addTestCase(TestCaseFixTimer, 'TestCaseFixTimer')
end;


