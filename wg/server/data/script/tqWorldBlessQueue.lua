--*******************************************************************************
WorldBlessQueue = Class:extends({
	init = function(self, gameApp)
		self.gameApp = gameApp
		self.blessMsg = {}
		self.hasTimer = false
		self._timerCaller = Caller:new(TIMER_ID.BLESSMSG, self, self._onTimer)
	end;
	
	appendMsg = function(self, blessId, msg)
		table.insert(self.blessMsg, {blessId=blessId, msg=msg})
		if not self.hasTimer then
			global.getTimer():start(5*1000, {TIMER_EVT.SEND_BLESSMSG}, self._timerCaller)
			self.hasTimer = true
			self:_handleMsg(nil)
		end
	end;
	
	getTimerCaller = function(self)
		return self._timerCaller
	end;
	
	_onTimer = function(self, timer)
		self:_handleMsg(timer)
	end;
	
	_handleMsg = function(self, timer)
		if table.getn(self.blessMsg) == 0 then
			timer:stop()
			self.hasTimer = false
			return
		end
		
		local msgNode = self.blessMsg[1]
		self.gameApp:getPlayerMgr():sendWorldBless(msgNode.blessId, msgNode.msg)
		table.remove(self.blessMsg, 1)
	end;
})


