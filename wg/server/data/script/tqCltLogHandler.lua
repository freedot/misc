--*******************************************************************************
CltLogHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = CltErrLogHandler()
		self.handlers[2] = CltSuggestHandler()
	end;
})

CltErrLogHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local browser = Util:getNumber(cmdtb, 'browser')
		local ver = Util:getNumber(cmdtb, 'ver')
		local msg = Util:getString(cmdtb, 'msg')
		LOG('<clienterr> role:' .. player:getRoleName() .. ',browser:' .. browser .. ',ver:' .. ver .. ',msg:' .. msg)
	end;
})

CltSuggestHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local msg = Util:getString(cmdtb, 'msg')
		LOGEX('SUG', '<suggest> user:' .. player:getName() .. ',role:' .. player:getRoleName() .. ',level:' .. player:getLevel() .. ',msg:' .. msg)
	end;
})

