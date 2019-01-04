--*******************************************************************************
PlayerActTerrace = Class:extends({
	init = function(self, player)
		self.player = player
		self.actTerrace = player:getPersistVar().stMiscs.actTerrace
	end;
	
	getTodayEnterTimes = function(self)
		return TodayTimes:get(self.actTerrace, 'todayEnterTimes', 'todayRefreshTime')
	end;
	
	setTodayEnterTimes = function(self, times)
		TodayTimes:set(self.actTerrace, 'todayEnterTimes', 'todayRefreshTime', times, Util:getTime())
	end;
	
	getMaxGate = function(self)	
		if self.actTerrace.maxGate.gateId <= 0 then
			self.actTerrace.maxGate.gateId = 1
			self.actTerrace.maxGate.subGateId = 1
		end
		
		return self.actTerrace.maxGate
	end;
	
	setMaxGate = function(self, maxGate)
		if maxGate.gateId < self.actTerrace.maxGate.gateId then
			return
		end
		
		if maxGate.gateId > self.actTerrace.maxGate.gateId 
			or maxGate.subGateId > self.actTerrace.maxGate.subGateId then
			
			self.actTerrace.maxGate.gateId = maxGate.gateId
			if self.actTerrace.maxGate.gateId > res_act_terrace_max_gate_id then
				self.actTerrace.maxGate.gateId = res_act_terrace_max_gate_id
			end
			
			self.actTerrace.maxGate.subGateId = maxGate.subGateId
			if self.actTerrace.maxGate.gateId == res_act_terrace_max_gate_id
				or self.actTerrace.maxGate.subGateId > res_act_terrace_max_subgate_id then
				self.actTerrace.maxGate.subGateId = res_act_terrace_max_subgate_id
			end
			
			self.player:refreshCityGrid()
			RoleBaseSender:send(self.player, {'actTerrace'})
		end
	end;
	
	setLeftLifes = function(self, leftLifes)
		self.actTerrace.leftLifes = leftLifes
	end;
	
	getLeftLifes = function(self)
		return self.actTerrace.leftLifes
	end;
	
	setStopTime = function(self, stopTime)
		self.actTerrace.stopTime = stopTime
	end;
	
	getStopTime = function(self)
		return self.actTerrace.stopTime
	end;
	
	setCurGate = function(self, curGate)
		self.actTerrace.curGate.gateId = curGate.gateId
		self.actTerrace.curGate.subGateId = curGate.subGateId
	end;
	
	getCurGate = function(self)
		return self.actTerrace.curGate
	end;
	
	getResultCount = function(self)
		return self.actTerrace.countResults
	end;
	
	getResultByIdx = function(self, idx) -- from 0 - n-1
		if idx < 0 or idx >= self.actTerrace.countResults then
			return 0
		end
		
		return self.actTerrace.results[idx]
	end;
	
	setResult = function(self, idx, result)
		if idx > self.actTerrace.countResults then
			LOG('error: set actTerrace result can\' skip ')
			return 
		end
		
		if idx == self.actTerrace.countResults then
			if self.actTerrace.countResults == MAX_ACT_TERRACE_COUNT then
				LOG('error: actTerrace countResults arrived max count')
				return 
			end
			
			self.actTerrace.countResults = self.actTerrace.countResults + 1
			self.actTerrace.results[idx] = 0
		end
		
		if result > self.actTerrace.results[idx] then
			self.actTerrace.results[idx] = result
		end
	end;
	
	setAutoStartTime = function(self, autoStartTime)
		self.actTerrace.autoStartTime = autoStartTime
	end;
	
	getAutoStartTime = function(self)
		return self.actTerrace.autoStartTime
	end;
	
	setAutoToSubGateId = function(self, autoToSubGateId)
		self.actTerrace.autoToSubGateId = autoToSubGateId
	end;
	
	getAutoToSubGateId = function(self)
		return self.actTerrace.autoToSubGateId
	end;
})


