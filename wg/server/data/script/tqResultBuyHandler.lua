--*******************************************************************************
ResultBuyHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ResultBuySuccHandler()
		self.handlers[2] = ResultBuyCancelHandler()
	end;
})

ResultBuySuccHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local proxy = Service:getProxyServer()
		proxy:resetDealTime(player:getName(), proxy:getSuccTimeOut())
	end;
})

ResultBuyCancelHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local proxy = Service:getProxyServer()
		proxy:resetDealTime(player:getName(), proxy:getCancelTimeOut())
	end;
})




