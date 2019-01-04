--*******************************************************************************
--*******************************************************************************
BaseCmdHandler = Class:extends({
	init = function(self)
		self.handlers = {}
		self.nullHandler = NullHandler()
		self:regHandlers()
	end;
	
	regHandlers = function(self)
	end;
	
	getHandler = function(self, subcmd)
		local hdr = self.handlers[subcmd]
		if hdr == nil then
			return self.nullHandler
		end
		
		return hdr
	end;
	
	onRequest = function(self, player, netevt, cmdtb, exflag)
		return self:getHandler(cmdtb.subcmd):handle(player, cmdtb, exflag)
	end;
})

NullHandler = Class:extends({
	handle = function(self) 
	end
})


