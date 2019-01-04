--*******************************************************************************
--  
--*******************************************************************************
RoleStateHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetRoleStatesHandler()
		self.handlers[2] = CancelRoleStateHandler()
	end;
})

GetRoleStatesHandler = Class:extends({
	handle = function(self, player)
		RoleStateSender:sendStates(player)
	end;
})

CancelRoleStateHandler = Class:extends({
	init = function(self)
		self.canCancelStates = {}
		self.canCancelStates[RES_EFF.AVOIDFIGHT] = true
	end;
	
	handle = function(self, player, cmdtb)
		local stateId = Util:getNumber(cmdtb, 'state')
		if not self:_isCanCancelState(stateId) then
			return false
		end
		
		player:getStateContainer():stopState(stateId)
		return true
	end;
	
	_isCanCancelState = function(self, stateId)
		return self.canCancelStates[stateId] == true
	end;
})

