CityResHandler = Class:extends({
	onRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			self:sendCityResMsg(player)
		elseif cmdtb.subcmd == 2 then
			self:upgradeCityLevel(player)
		end
	end;
	
	sendCityResMsg = function(self, player)
		MoneySender:sendAll(player)
		CityBuildValSender:sendAll(player)
		CommResSender:sendAll(player)
		PopuSender:sendAll(player)
	end;
	
	upgradeCityLevel = function(self, player)
		local cres = player:getCityRes()
		if cres:isFullLevel() then return end
		local nextneed = cres:getMaxBuildVal()
		local cur = cres:getBuildVal() - cres:getBuildHurtVal()
		if cur < nextneed then return end
		
		cres:setLevel(cres:getLevel()+1)
		CityBuildValSender:sendAll(player)
		RoleBaseSender:send(player, {'cityMaxLevel'})
		TaskFinisher:checkTasks(player)
	end;
})


