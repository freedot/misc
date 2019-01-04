--*******************************************************************************
PlayerActTower = Class:extends({
	init = function(self, player)
		self.player = player
		self.actTower = player:getPersistVar().stMiscs.actTower
	end;
	
	getTodayEnterTimes = function(self)
		return TodayTimes:get(self.actTower, 'todayEnterTimes', 'todayRefreshTime')
	end;
	
	setTodayEnterTimes = function(self, times)
		TodayTimes:set(self.actTower, 'todayEnterTimes', 'todayRefreshTime', times, Util:getTime())
	end;
	
	getMaxLayer = function(self)
		return self.actTower.maxLayer
	end;
	
	setMaxLayer = function(self, maxLayer)
		if self:_isArrivedMaxLevel(maxLayer) then
			maxLayer = res_act_tower_max_layer
		end
		
		if maxLayer > self.actTower.maxLayer then
			self.actTower.maxLayer = maxLayer
			self.actTower.maxTime = Util:getTime()
			self.player:refreshCityGrid()
			RoleBaseSender:send(self.player, {'actTower'})
		end
	end;
	
	_isArrivedMaxLevel = function(self, maxLayer)
		return maxLayer >= res_act_tower_max_layer
	end;
	
	getMaxLayerTime = function(self)
		return self.actTower.maxTime
	end;
	
	setLeftLifes = function(self, leftLifes)
		self.actTower.leftLifes = leftLifes
	end;
	
	getLeftLifes = function(self)
		if self.actTower.leftLifes > 3 then -- 异常处理
			LOG('*error: self.actTower.leftLifes:' .. self.actTower.leftLifes)
			self.actTower.leftLifes = 3
		end
		return self.actTower.leftLifes
	end;
	
	setStopTime = function(self, stopTime)
		self.actTower.stopTime = stopTime
	end;
	
	getStopTime = function(self)
		return self.actTower.stopTime
	end;
	
	setCurLayer = function(self, curLayer)
		self.actTower.curLayer = curLayer
	end;
	
	getCurLayer = function(self)
		return self.actTower.curLayer
	end;
	
	setAutoStartTime = function(self, autoStartTime)
		self.actTower.autoStartTime = autoStartTime
	end;
	
	getAutoStartTime = function(self)
		return self.actTower.autoStartTime
	end;
	
	setAutoToLayer = function(self, autoToLayer)
		self.actTower.autoToLayer = autoToLayer
	end;
	
	getAutoToLayer = function(self)
		return self.actTower.autoToLayer
	end;
})


