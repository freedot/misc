--*******************************************************************************
PaymentHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = PaymentStartHandler()
		self.handlers[2] = PaymentStopHandler()
	end;
})

PaymentStartHandler = Class:extends({
	handle = function(self, player)
		player:startPay()
	end;
})

PaymentStopHandler = Class:extends({
	handle = function(self, player)
		player:stopPay()
		Service:getProxyServer():sendQueryGold(player)
	end;
})


