---------------------------------------------------------------------------------------
PkgHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = SendPkgAllDataHdr()
	end;
})

SendPkgAllDataHdr = Class:extends({
	handle = function(self, player)
		local pkg = player:getPkg()
		ItemMsgSender:sendAll(player)
		ItemMsgSender:sendSalveMax(player)
		PkgMiscSender:sendAll(player)	
	end;
})



