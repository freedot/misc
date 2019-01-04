--*******************************************************************************
OtherPlayerInfoHdr = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetBuildAddSpeedHdr()
	end;
})

GetBuildAddSpeedHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local targetName = Util:getString(cmdtb, 'name')
		if player:getName() == targetName then
			return false
		end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(targetName)
		if target == nil then
			return false
		end
		
		if not self:_isSameAlliance(player, target) then
			return false
		end
		
		OtherPlayerInfoSender:sendBuildAddSpeed(player, target)
		
		return true
	end;
	
	_isSameAlliance = function(self, player, target)
		return  (player:getAlliId() == target:getAlliId() ) and ( player:getAlliId() > 0 )
	end;
})

