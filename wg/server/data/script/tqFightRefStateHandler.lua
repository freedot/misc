--*******************************************************************************
FightRefStateHandler = BaseCmdHandler:extends({
	regHandlers = function(self, subcmd)
		self.handlers[1] = GetFightRefStatesHdr()
	end;
})

GetFightRefStatesHdr = Class:extends({
	handle = function(self, player)
		FightResStateSender:sendAllStates(player)
	end;
})


