--*******************************************************************************
AutoBuildsHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = StartAutoBuildsHdr()
	end;
})

StartAutoBuildsHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_isValidCount(player, cmdtb) then
			return false
		end
		
		if not self:_isValidIds(player, cmdtb) then
			return false
		end
		
		self:_insertIdsToAutoQueue(player)
		
		local autoBuilds = player:getCitys():getAutoBuilds()
		if autoBuilds:getCount() == 0 then
			player:getCitys():setStartAutoBuild(0)
			AutoBuildSender:sendInfo(player)
		else
			player:getCitys():setStartAutoBuild(1)
			player:getCitys():handleAutoBuilds()
		end
		
		return true
	end;
	
	_isValidCount = function(self, player, cmdtb)
		self.count = Util:getNumber(cmdtb, 'count')
		if self.count < 0 then
			return false
		end
		
		local max = player:getVipEffectVal(VIP_EFF.ADD_BUILD_AUTO_QUEUE)
		if self.count > max then
			return false
		end
		
		return true
	end;
	
	_isValidIds = function(self, player, cmdtb)
		self.ids = {}
		for i=1, self.count do
			local combineId = Util:getNumber(cmdtb, 'id' .. i, 0)
			if combineId == 0 then return false end
			
			local cid = math.floor(combineId/1000)
			local id = combineId%1000
			
			local city = player:getCitys():getCityById(cid)
			if city == nil or city:getType() ==  CITY_TYPE.NONE then return false end
			
			local build = city:getBuildById(id)
			if build == nil or build.ucState ~= 0 then return false end
			
			table.insert(self.ids, combineId)
		end
		
		return true
	end;
	
	_insertIdsToAutoQueue = function(self, player)
		local autoBuilds = player:getCitys():getAutoBuilds()
		autoBuilds:clear()
		for _, combineId in ipairs(self.ids) do
			autoBuilds:insert(combineId)
		end	
	end;
})

