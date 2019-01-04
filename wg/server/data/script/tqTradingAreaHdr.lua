--*******************************************************************************
TradingAreaHdr = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetTradingAreaInfoHdr()
		self.handlers[2] = StartTradingHdr()
		self.handlers[3] = CancelTradingHdr()
		self.handlers[4] = SetTradingAreaHdr()
		self.handlers[5] = GetTradingAllianceMembersHdr()
		self.handlers[6] = GetTradingAllianceDetailMembersHdr()
	end;
})

TradingBaseHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local alliance = app:getAlliMgr():getAlliById(player:getAlliId())
		if alliance:isNull() then
			return false
		end
		
		if not self:_hasEnoughBuildLevel(player) then
			WUtil:sendWarningMsgArgs(player, 100149, '')
			return false
		end
		
		if not self:_additionalCheck(player, cmdtb) then
			return false 
		end
		
		return self:_handle(player, cmdtb)
	end;
	
	_hasEnoughBuildLevel = function(self, player)
		local buildLevel =  player:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD)
		return buildLevel >= res_trading_need_build_minlevel
	end;
	
	_additionalCheck = function(self, player, cmdtb)
		return true
	end;
	
	_handle = function(self, player, cmdtb)
	end;
})

GetTradingAreaInfoHdr = TradingBaseHdr:extends({
	_additionalCheck = function(self, player)
		player:getTradingArea():checkTargetsInAlliance()
		return true
	end;
	
	_handle = function(self, player)
		TradingAreaSender:sendStopTime(player)
		TradingAreaSender:sendBaseInfo(player)
		TradingAreaSender:sendTargets(player)
		TradingAreaSender:sendTodayTimes(player)
		return true
	end;
})

StartTradingHdr = TradingBaseHdr:extends({
	_additionalCheck = function(self, player, cmdtb)
		local tradingArea = player:getTradingArea()
		if tradingArea:getTargetsSet():getCount() == 0 then
			WUtil:sendWarningMsgArgs(player, 100153, '')
			return false
		end
		
		if os.date("*t", Util:getTime()).hour == 23 then
			WUtil:sendWarningMsgArgs(player, 100154, '')
			return false
		end
		
		if tradingArea:isTodayFullTimes() then
			WUtil:sendWarningMsgArgs(player, 100162, '')
			return false
		end
		
		if tradingArea:getStopTime() ~= 0 then
			return false
		end
		
		local isVip = Util:getNumber(cmdtb, 'vip', 0) > 0
		if isVip and not player:hasVipEffect(VIP_EFF.SPEED_TRADING) then
			return false
		end
		
		self.curTimes = 1
		if isVip then
			self.curTimes = self:_getLeftTime(player)
		end
		
		return tradingArea:checkTargetsInAlliance()
	end;
	
	_handle = function(self, player)
		local tradingArea = player:getTradingArea()
		tradingArea:setCurTimes(self.curTimes)
		tradingArea:setStopTime(Util:getTime() + self.curTimes*tradingArea:getTotalNeedTime())
		tradingArea:setTodayTimes(tradingArea:getTodayTimes() + self.curTimes)
		tradingArea:start()
		WUtil:sendSuccMsgArgs(player, 100148, '')
		TradingAreaSender:sendTodayTimes(player)
		
		for i=1, self.curTimes do
			TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.START_ONE_TRADINGAREA)
		end
		
		return true
	end;
	
	_getLeftTime = function(self, player)
		return player:getTradingArea():getMaxTimes() - player:getTradingArea():getTodayTimes()
	end;
})

SetTradingAreaHdr = TradingBaseHdr:extends({
	_handle = function(self, player, cmdtb)
		self:_insertTargets(player)
		TradingAreaSender:sendTargets(player)
		
		return true
	end;
	
	_additionalCheck = function(self, player, cmdtb)
		local count = Util:getNumber(cmdtb, 'count')
		if not self:_isValidCityCount(player, count) then
			WUtil:sendWarningMsgArgs(player, 100150, '')
			return false
		end
		
		if not self:_getSetTargets(player, count, cmdtb) then
			return false
		end	
		
		return true
	end;
	
	_isValidCityCount = function(self, player, count)
		return count > 0 and count <= player:getTradingArea():getMaxCitys()
	end;
	
	_getSetTargets = function(self, player, count, cmdtb)
		local targets = {}
		for i=1, count, 1 do
			local roleId = Util:getNumber(cmdtb, 't' .. i)
			local grid = app:getCityMgr():getGridByRoleId(roleId)
			if grid == nil then 
				WUtil:sendWarningMsgArgs(player, 100152, '')
				return false 
			end
			
			if grid.allianceId ~= player:getAlliId() then 
				WUtil:sendWarningMsgArgs(player, 100151, '')
				return false 
			end
			table.insert(targets, grid.roleId)
		end
		self.targets = targets
		return true
	end;
	
	_insertTargets = function(self, player)
		local set = player:getTradingArea():getTargetsSet()
		set:clear()
		for _, targetId in ipairs(self.targets) do
			set:insert(targetId)
		end
	end;
})

GetTradingAllianceMembersHdr = TradingBaseHdr:extends({
	_handle = function(self, player)
		TradingAreaSender:sendMembers(player)
		return true
	end;
})

GetTradingAllianceDetailMembersHdr = TradingBaseHdr:extends({
	_additionalCheck = function(self, player, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'roleId')
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return false
		end
		
		if grid.allianceId ~= player:getAlliId() then
			return false
		end
		
		self.grid = grid

		return true
	end;
	
	_handle = function(self, player)
		TradingAreaSender:sendDetailMember(player, self.grid)
		return true
	end;
})

CancelTradingHdr = Class:extends({
	handle = function(self, player)
		player:getTradingArea():setStopTime(0)
		TradingAreaSender:sendStopTime(player)
	end;
})


