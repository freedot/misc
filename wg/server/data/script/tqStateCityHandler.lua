--*******************************************************************************
StateCityHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = StateCityEnterHandler()
	end;
})

StateCityEnterHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local cityId = Util:getNumber(cmdtb, 'id')
		if cityId < FIXID.FIRSTSTATECITY or cityId > FIXID.LASTSTATECITY then
			return false
		end
		
		StateCitySender:sendEnter(player, cityId)
		StateCitySender:sendNpcs(player, cityId)
		
		return true
	end;
})


