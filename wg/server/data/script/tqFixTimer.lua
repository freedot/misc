--*******************************************************************************
FixTimer = Class:extends({
	init = function(self, frequencyS)
		self._frequencyS = frequencyS or 24*3600
		self._myCaller = Caller:new(0, self, self._onTimer)
		self._caller = nil
	end;
	
	start = function(self, fixTime, params, caller)
		local elapse = Util:getFixNextTime(Util:getTime(), fixTime.hour, fixTime.min, fixTime.sec) - Util:getTime()
		local newParams = {}
		params[1] = TIMER_EVT.FIX_TIMER_START + params[1]
		self._caller = caller
		self._caller:register(params[1], self._myCaller)
		
		global.getTimer():start(elapse*1000, params, self._caller)
	end;
	
	getFrequency = function(self)
		return self._frequencyS
	end;
	
	_onTimer = function(self, timer, seq, curTime, params)
		timer:stop()
		params[1] = params[1] - TIMER_EVT.FIX_TIMER_START
		global.getTimer():start(self._frequencyS*1000, params, self._caller)
		self._caller:invoke(timer, seq, curTime, params)
	end;
})

