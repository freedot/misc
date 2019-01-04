--*******************************************************************************
PlayerBuyLimiter = Class:extends({
	init = function(self, player)
		self.miscs = player:getPersistVar().stMiscs
		self.items = MapCppSet(self.miscs, 'buyLimitCount', 'buyLimitItems', 'resId', MAX_BUY_ITEMS_CNT)
	end;
	
	getTodayLeftNumber= function(self, resId)
		self:_clearWhenNextDay()
		local res = Util:find(res_shops, 'itemid', resId)
		if res == nil or res.itemnumsec ~= 2 then
			return 0xffffffff
		end
		
		local node = self.items:getByValKey(resId)
		if node == nil then
			return res.itemnum
		end
		
		return res.itemnum - node.number
	end;
	
	addBuyItemId = function(self, resId, number)
		self:_clearWhenNextDay()
		self.miscs.buyLimitTime = Util:getTime()
		local res = Util:find(res_shops, 'itemid', resId)
		if res == nil or res.itemnumsec ~= 2 then
			return
		end
		
		local node = self.items:getByValKey(resId)
		if node == nil then
			self.items:insert({resId=resId, number=number})
		else
			node.number = node.number + number
		end
	end;
	
	_clearWhenNextDay = function(self)
		if not Util:isCurDay(self.miscs.buyLimitTime) then
			self.items:clear()
		end
	end;
})


