--*******************************************************************************
TimerCaller = Caller:extends({
	init = function(self, objId)
		objId = objId or 0
		self._s = {objId = objId, obj = self, fun = self._onTimer}
		self._ss = {}
	end;
	
	register = function(self, event, caller)
		self._ss[event] = caller
	end;
	
	_onTimer = function(self, timer, seq, curTime, params)
		local event = params[1]
		local caller = self._ss[event]
		if caller ~= nil then
			caller:invoke(timer, seq, curTime, params)
		else
			timer:stop()
		end
	end;
})


