--*******************************************************************************
ClientCfgHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ClientCfgToggleMapHandler()
		self.handlers[2] = ClientCfgGongGaoHandler()
		self.handlers[3] = ClientCfgSetHelpTipHandler()
	end;
})

ClientCfgToggleMapHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local idx = Util:getNumber(cmdtb, 'idx')
		local flag = Util:getNumber(cmdtb, 'flag')
		local clientCfg = player:getClientCfg()
		if idx < 0 or idx >= clientCfg:getToggleMapCount() then
			return false
		end
		
		if flag < 0 or flag > 255 then
			return false
		end
		
		clientCfg:setToggleMapFlag(idx, flag)
		ClientCfgSender:sendToggleMap(player)
		
		return true
	end;
})

ClientCfgGongGaoHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local ver = Util:getNumber(cmdtb, 'ver')
		local clientCfg = player:getClientCfg()
		clientCfg:setGongGaoVer(ver)
		return true
	end;
})

ClientCfgSetHelpTipHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local tipId = Util:getNumber(cmdtb, 'tipId')
		local helpTips = player:getClientCfg():getHelpTips()
		local node = nil
		if helpTips:has(tipId) then
			node = helpTips:getByValKey(tipId)
			node.times = node.times + 1
		else
			node = {id=tipId, times=1}
			helpTips:insert(node)
		end
		
		ClientCfgSender:sendHelpTip(player, node.id, node.times)
		return true
	end;
})

