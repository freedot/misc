ItemHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetDetailItemHdr()
	end;
})

GetDetailItemHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local item = self:_getTargetItem(cmdtb)
		if item == nil then
			WUtil:sendWarningMsgArgs(player, 100168, '')
			ItemMsgSender:sendOtherDetailItemFail(player)
			return false
		end
		
		local roleId = Util:getNumber(cmdtb, 'roleId')
		ItemMsgSender:sendOtherDetailItem(player, roleId, item)
		
		return true
	end;
	
	_getTargetItem = function(self, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'roleId')
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return nil
		end
		
		local target = app:getPlayerMgr():getPlayerByName(grid.userName)
		if target == nil then
			target = app:getPlayerMgr():getOfflinePlayerByName(grid.userName)
		end	
		
		if target == nil then
			return nil
		end
		
		local itemId = Util:getNumber(cmdtb, 'itemId')
		return target:getPkg():getItemById(itemId)
	end;
})



