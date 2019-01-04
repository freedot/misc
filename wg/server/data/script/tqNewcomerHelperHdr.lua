--*******************************************************************************
NewcomerHelperHdr = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = NewHelperGetCurNodeHdr()
	end;
})

NewHelperGetCurNodeHdr = Class:extends({
	handle = function(self, player, cmdtb)
		NewcomerTaskSender:sendCurTask(player)
	end;
})


