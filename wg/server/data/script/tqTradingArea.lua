--*******************************************************************************
TodayTimes = Class:extends({
	get = function(self, dict, todayTimesName, refreshTimeName)
		if not Util:isCurDay(dict[refreshTimeName]) then
			dict[todayTimesName] = 0
		end
		return dict[todayTimesName]
	end;
	
	set = function(self, dict, todayTimesName, refreshTimeName, times, time)
		dict[todayTimesName] = times
		dict[refreshTimeName] = time
	end;
}):new()


TradingArea = Class:extends({
	init = function(self, player)
		self.player = player
		self.trading = player:getPersistVar().stMiscs.trading
		self.targets = MapCppSet(self.trading, 'count', 'roleIds', nil, MAX_TRADING_ROLES_CNT)
		self.player:getTimerCaller():register(TIMER_EVT.TRADING_STOP, Caller:new(0, self, self._onTradingStopTimer))
	end;
	
	start = function(self)
		if self:getStopTime() == 0 then
			return
		end
		
		local needTime = self:getStopTime() - Util:getTime()
		global.getTimer():start(needTime*1000, {TIMER_EVT.TRADING_STOP}, self.player:getTimerCaller())
		TradingAreaSender:sendStopTime(self.player)
	end;
	
	getTargetsSet = function(self)
		return self.targets
	end;
	
	getStopTime = function(self)
		return self.trading.stopTime
	end;
	
	setStopTime = function(self, stopTime)
		self.trading.stopTime = stopTime
	end;
	
	setCurTimes = function(self, curTimes)
		self.trading.curTimes = curTimes
	end;
	
	getCurTimes = function(self)
		return self.trading.curTimes
	end;
	
	getRate = function(self)
		return 1
	end;
	
	getMaxCitys = function(self)
		return 4
	end;
	
	getCapacity = function(self)
		return self.player:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD)*100
	end;
	
	getTotalDistance = function(self)
		return self:_getTargetSum(self, self.getTargetDistance)
	end;
	
	getTotalNeedTime = function(self)
		return self:_getTargetSum(self, self.getNeedTime)
	end;
	
	getTotalGainMoney = function(self)
		return self:_getTargetSum(self, self.getFactGain)*(1 + self.player:getVipEffectVal(VIP_EFF.ADD_TRADING_GET)/100)
	end;
	
	getTargetDistance = function(self, grid)
		if grid == nil then return 0 end
		
		local fromPos = self.player:getCityPos()
		local toPos = app:getCityMgr():getPosByGridId( grid.gridId )
		local distance = math.sqrt((fromPos.x - toPos.x)*(fromPos.x - toPos.x) + (fromPos.y - toPos.y)*(fromPos.y - toPos.y))
		return math.floor(distance*7.41 + 0.5)
	end;
	
	getFactGain = function(self, grid)
		if grid == nil then return 0 end
		
		local factRoute = self:getTargetDistance(grid)
		local decayFactor = self:_getDecayFactorByDistance(factRoute)
		local baseGain = self:_getBaseGain(grid)*self:getRate()
		return math.floor(2*baseGain*(10 - decayFactor) + 0.5)
	end;
	
	getNeedTime = function(self, grid)
		return 600 + self:getTargetDistance(grid)*15
	end;
	
	checkTargetsInAlliance = function(self)
		local count = self.targets:getCount()
		for i=0, count-1, 1 do
			local grid = app:getCityMgr():getGridByRoleId(self.targets:get(i))
			if grid == nil then
				WUtil:sendWarningMsgArgs(self.player, 100147, '')
				return false
			end
			
			if grid.allianceId ~= self.player:getAlliId() then
				WUtil:sendWarningMsgArgs(self.player, 100146, '"' .. grid.roleName .. '"')
				return false
			end
			
			if grid.cityLevel == 0 then
				WUtil:sendWarningMsgArgs(self.player, 100155, '"' .. grid.roleName .. '"')
				return false
			end
		end
		return true
	end;
	
	getMaxTimes = function(self)
		return res_base_tradingarea_times
	end;
	
	getTodayTimes = function(self)
		return TodayTimes:get(self.trading, 'todayTimes', 'refreshTime')
	end;
	
	setTodayTimes = function(self, times)
		TodayTimes:set(self.trading, 'todayTimes', 'refreshTime',  times, Util:getTime())
	end;
	
	isTodayFullTimes = function(self)
		return self:getTodayTimes() >= self:getMaxTimes()
	end;
	
	_onTradingStopTimer = function(self, timer)
		timer:stop()
		if self:getStopTime() == 0 then
			return 
		end
		
		if not self:_isArrivedTime(self:getStopTime()) then
			return
		end
		
		self.player:getCityRes():addMoney( self.trading.curTimes*self:getTotalGainMoney() )
		self:setStopTime( 0 )
		TradingAreaSender:sendStopTime(self.player)
	end;
	
	_isArrivedTime = function(self, stopTime)
		return (Util:getTime() + TIMER_DRT_TIME) >= stopTime
	end;
	
	_getDecayFactorByDistance = function(self, factRoute)
		return math.atan(factRoute/150 + 0.22)*7.65 - 2.0
	end;
	
	_getBaseGain = function(self, grid)
		local fromBuildLevel = self.player:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD)
		local toBuildLevel = grid.misc.shiChangLevel
		return 100*math.min(fromBuildLevel, toBuildLevel)
	end;
	
	_getTargetSum = function(self, obj, getFun)
		local sum = 0
		local count = self.targets:getCount()
		for i=0, count-1, 1 do
			local grid = app:getCityMgr():getGridByRoleId(self.targets:get(i))
			sum = sum + getFun(obj, grid)
		end
		return sum
	end;
})


