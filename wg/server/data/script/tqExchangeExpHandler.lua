--*******************************************************************************
--  
--*******************************************************************************
ExchangeExpHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetExchangeExpTimesHdr:new()
		self.handlers[2] = ExchangeHerosExpHdr:new()
	end;
})

GetExchangeExpTimesHdr = Class:extends({
	handle = function(self, player)
		ExchangeHeroExpSender:sendTodayTimes(player)
	end;
})

ExchangeHerosExpHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		if not self:_hasEnoughTimes() then
			return false
		end
		
		if not self:_hasEnoughCommRes() then
			return false
		end
		
		if not self:_hasEnoughCap() then
			return false
		end
		
		self:_subCommRes()
		self:_exchange()
		self:_sendMsgs()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local times = Util:getNumber(cmdtb, 'times')
		if times <= 0 then
			return false
		end
		
		self.player = player
		self.times = times
		
		return true
	end;

	_hasEnoughTimes = function(self)
		local todayTimes = self.player:getCitys():getExchangeExpTodayTimes()
		return (self.times + todayTimes.curTimes) <= todayTimes.maxTimes
	end;
		
	_hasEnoughCommRes = function(self)
		local expendress = {
			{id=FIXID.FOOD, type=EXPEND_TYPE.COMMRES, val=self.times*1000}
			,{id=FIXID.WOOD, type=EXPEND_TYPE.COMMRES, val=self.times*1000}
			,{id=FIXID.STONE, type=EXPEND_TYPE.COMMRES, val=self.times*1000}
			,{id=FIXID.IRON, type=EXPEND_TYPE.COMMRES, val=self.times*1000}
		}
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
		return WUtil:isEnoughExpends(self.expends)
	end;
	
	_hasEnoughCap = function(self)
		local addExpVal = self.times*1000
		return (self.player:getAttrVal(ATTR.MXPS) - self.player:getAttrVal(ATTR.XPS)) >= addExpVal
	end;
	
	_exchange = function(self)
		local addExpVal = self.times*1000
		self.player:addXPSAttr(addExpVal)
		self.player:getCitys():addExchangeExpTodayTimes(self.times)
	end;
	
	_subCommRes = function(self)
		WUtil:subExpends(self.expends)
	end;
	
	_sendMsgs = function(self)
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.XPS))
		ExchangeHeroExpSender:sendTodayTimes(self.player)
	end;
})

