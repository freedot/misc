--*******************************************************************************
--*******************************************************************************
ARM_EFF_MAP_ATTR = {}
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_STR] = ATTR.ST_B
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_PHY] = ATTR.PH_B
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_AGILE] = ATTR.AG_B
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_CO] = ATTR.CO
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_JIN_SKILL_LEVEL] = ATTR.JIN_SKILL_LEVEL
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_MU_SKILL_LEVEL] = ATTR.MU_SKILL_LEVEL
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_SHUI_SKILL_LEVEL] = ATTR.SHUI_SKILL_LEVEL
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_HUO_SKILL_LEVEL] = ATTR.HUO_SKILL_LEVEL
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_TU_SKILL_LEVEL] = ATTR.TU_SKILL_LEVEL
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_SP] = ATTR.SP
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_ATT] = ATTR.HU
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_DEF] = ATTR.DE
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_HIT] = ATTR.HI
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_ES] = ATTR.ES
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_MPS] = ATTR.MPS


PlayerPackage = Class:extends({
	init = function(self, player)
		self.player = player
		self.pkg = player:getPersistVar().stItems
		self.innerItems = self.pkg.stItems
		self:_initItems()
	end;
	
	setMaxGridsCnt = function(self, maxcnt)
		self.pkg.usGridMaxCnt = maxcnt
	end;
	
	getMaxGridsCnt = function(self)
		return self.pkg.usGridMaxCnt - Service:getProxyServer():getHoldPkgCount(self.player:getName())
			+ self.player:getVipEffectVal(VIP_EFF.ADD_PKG_COUNT)
	end;
	
	getItemNumber = function(self, resid)
		local number = self:_getItemNumber(resid)
		number = number + self:_getItemNumber( self:_getBindOrNoBindResId(resid) )
		return number
	end;
	
	getItemByResId = function(self, resid)
		return Util:findByFun(self.items, 'getResId', resid)
	end;

	getItemById = function(self, id)
		if id <= 0 then
			return nil
		end
		
		return Util:findByFun(self.items, 'getId', id)
	end;
	
	getItemsCount = function(self)
		return table.getn(self.items)
	end;
	
	getItemByIdx = function(self, idx)  -- idx from 0 to n-1
		return self.items[idx+1]
	end;
	
	subItemByResId = function(self, resid, number)
		local number1 = self:_getItemNumber(resid)
		self:_subItemByResId(resid, number)
		if number > number1 then
			self:_subItemByResId(self:_getBindOrNoBindResId(resid), number - number1)
		end
	
		if IsDebug() then
			print ( 'subItemByResId: checkInvalidItem ' ) 
			self:_checkInvalidItem()
		end
	end;
	
	delItemById = function(self, itemId)
		Util:findC(self.innerItems.items, self.innerItems.count, 'id', itemId)
		self:_removeItemByIdx(Util:getLastFindIdx())
		
		if IsDebug() then
			print ( 'delItemById: checkInvalidItem ' ) 
			self:_checkInvalidItem()
		end
	end;
	
	returnItems = function(self, addItems)
		if addItems == nil then
			return true
		end
		
		local splitAddItems = self:_splitUniqueItems(addItems)
		if table.getn(splitAddItems) == 0 then
			return true
		end
		
		if not self:_preAddItems(splitAddItems) then
			return false
		end
		
		self:_addItems(splitAddItems)
		return true
	end;
	
	addItems = function(self, addItems)
		if not self:returnItems(addItems) then
			return false
		end
		
		self:_sendGetItemsTip(addItems)
		TaskFinisher:checkTasks(self.player)
		
		if IsDebug() then
			print ( 'addItems: checkInvalidItem ' ) 
			self:_checkInvalidItem()
		end
		
		return true	
	end;
	
	_checkInvalidItem = function(self)
		for _, item in ipairs(self.items) do
			if item:getResId() == 0 then
				print ( '*error: item resid == 0 ' ) 
				StopServer()
			end
		end
	end;
	
	addItemsNoTip = function(self, addItems)
		if not self:returnItems(addItems) then
			return false
		end
		
		TaskFinisher:checkTasks(self.player)
		return true
	end;
	
	preAddItems = function(self, addItems)
		if addItems == nil then
			return true
		end
		
		local splitAddItems = self:_splitUniqueItems(addItems)
		if table.getn(splitAddItems) == 0 then
			return true
		end
		
		return self:_preAddItems(splitAddItems)
	end;
	
	_getBindOrNoBindResId = function(self, resid)
		if (resid == 0) or (resid == nil) then
			return 0
		end
		
		local itemres = ItemResUtil:findItemres(resid)
		if itemres == nil then
			return 0
		end
		
		if (itemres.nobindid ~= nil) and (itemres.nobindid > 0) then
			return itemres.nobindid
		elseif (itemres.bindid ~= nil) and (itemres.bindid > 0) then
			return itemres.bindid
		end
		
		return 0
	end;

	_getItemNumber = function(self, resid)
		if (resid == 0) or (resid == nil) then
			return 0
		end
		
		local number = 0
		for _, item in ipairs(self.items) do
			if item:getResId() == resid then
				number = number + item:getNumber()
			end
		end
		return number
	end;
	
	_subItemByResId = function(self, resid, number)
		local changeItems = {}
		if number <= 0 then
			return changeItems
		end
		
		local count = self:getItemsCount()
		for i=count-1, 0, -1 do -- 倒序遍历，防止remove出错
			local item = self:getItemByIdx(i)
			if item:getResId() == resid then
				local canSubNumber = math.min(item:getNumber(), number)
				item:subNumber(canSubNumber)
				
				if item:getNumber() == 0 then
					table.insert(changeItems, {del=true, id=item:getId(), resid=item:getResId()})
					self:_removeItemByIdx(i)
				else
					table.insert(changeItems, {del=false, id=item:getId(), resid=item:getResId(), number=item:getNumber()})
				end
				
				number = number - canSubNumber
				if number == 0 then 
					break 
				end
			end
		end
		
		ItemMsgSender:sendChangeItems( self.player, changeItems )
		
		return changeItems
	end;	
	
	_splitUniqueItems = function(self, addItems)
		local splitAddItems = {}
		for _, addItem in ipairs(addItems) do
			local itemres = ItemResUtil:findItemres( addItem:getResId() )
			if itemres.pile == 1 and addItem:getNumber() > 1 then
				for i=1, addItem:getNumber(), 1 do
					local newRawItem = RawItemEx({resId=addItem:getResId(), number=1})
					table.insert(splitAddItems, newRawItem)
				end
			else
				table.insert(splitAddItems, addItem)
			end
		end
		return splitAddItems
	end;
	
	_preAddItems = function(self, addItems)
		local ret = true
		self:_backItems()
		
		for _, addItem in ipairs(addItems) do
			local item = self:_addItem(addItem)
			if item == nil then
				ret = false
				break
			end
		end
		
		self:_restoreItems()
		return ret	
	end;	
	
	_addItems = function(self, addItems)
		local itemIds = {}
		for _, addItem in ipairs(addItems) do
			local item = self:_addItem(addItem)
			table.insert(itemIds, item:getResId() )
		end
		ItemMsgSender:sendByResId(self.player, itemIds)
	end;	
	
	_sendGetItemsTip = function(self, addItems)
		for _, addItem in ipairs(addItems) do
			WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. addItem:getResId() .. '",' .. addItem:getNumber())
		end
	end;
	
	_addItem = function(self, addItem)
		local itemres = ItemResUtil:findItemres( addItem:getResId() )
		local lastFillItem, leftNumber = self:_fillExitItemsNumber(itemres, addItem:getNumber())
		if leftNumber == 0 then
			return lastFillItem
		end
		
		return self:_createNewItems(itemres, addItem, leftNumber)
	end;
	
	_fillExitItemsNumber = function(self, itemres, leftNumber)
		if itemres.pile == 1 then
			return nil, leftNumber
		end
		
		local lastFillItem = nil
		for _, item in ipairs(self.items) do
			if item:getResId() ~= itemres.id then
			elseif (item:getNumber() + leftNumber) <= itemres.pile then
				item:addNumber(leftNumber)
				leftNumber = 0
				lastFillItem = item
				break
			elseif item:getNumber() < itemres.pile then
				local canHold = itemres.pile - item:getNumber()
				item:addNumber(canHold)
				leftNumber = leftNumber - canHold
				lastFillItem = item
			end
		end
		
		return lastFillItem, leftNumber
	end;
	
	_createNewItems = function(self, itemres, srcItem, leftNumber)
		local item = nil
		while leftNumber > 0 do
			item = self:_allocItem()
			if item == nil then
				return nil
			end
			
			self:_createNewItem(srcItem, item, itemres, leftNumber)
			leftNumber = leftNumber - item:getNumber()
		end
		
		return item
	end;
	
	_createNewItem = function(self, srcItem, item, itemres, number)
		local canHold = math.min(itemres.pile, number)
		if srcItem:isRawItem() or (itemres.pile > 1) then
			self:_createNewItemFromRawItem(srcItem, item, itemres, canHold)
		else
			self:_createNewItemFromExistItem(srcItem, item, itemres, canHold)
		end
	end;
	
	_createNewItemFromRawItem = function(self, srcItem, item, itemres, number)
		item:setId( UUIDMgr:newItemId() )
		item:setResId( srcItem:getResId() )
		item:setNumber( number )
		self:_bindItem(srcItem, item, itemres)
		
		if itemres.pile == 1 then
			item:setNumber(1)
			self:_createItemAttrs( item, itemres )
		end
	end;
	
	_createNewItemFromExistItem = function(self, srcItem, item, itemres, number)
		item:copyFrom( srcItem )
		item:setNumber( 1 )
	end;
	
	_bindItem = function(self, srcItem, item, itemres)
		--if not srcItem.isBind() then
		--	return 
		--end
		
		if srcItem:isBind() then
			item:bind()
		end
		
		if itemres.isbind == 1 then
			item:bind()
			return
		end
		
		--if itemres.bindid ~= nil and itemres.bindid > 0 then
		--	item.setResId(itemres.bindid)
		--	return
		--end
		
		--if itemres.pile == 1 then
			--item.bind()
		--end
	end;
	
	_allocItem = function(self)
		if self:getItemsCount() >= self:getMaxGridsCnt() then
			return nil
		end
		
		local item = ItemEx(self.innerItems.items[self.innerItems.count]);
		self.innerItems.count = self.innerItems.count + 1
		table.insert( self.items, item )
		
		item:clear()
		
		return item
	end;
	
	_createItemAttrs = function(self, item, itemRes)
		if itemRes.effects == nil then
			return
		end
		
		for _, effect in ipairs(itemRes.effects) do
			if (effect.id ~= nil) 
				and (effect.id > 0) 
				and (effect.pro ~= nil) 
				and (effect.pro > 0) 
				and (effect.max > 0) then
				local isHit = math.random(100) <= effect.pro
				local val = math.random(effect.min, effect.max)
				if isHit and val > 0 then
					item:addAttr({attr=ARM_EFF_MAP_ATTR[effect.id], val=val, unit=effect.unit})
				end
			end
		end
	end;

	_backItems = function(self)
		UUIDMgr:backItemId()
		self.bakitems = CppPlayerVar:allocVar('SItemListEx')
		self.bakitems.var.count = self.innerItems.count
		for i=self.bakitems.var.count-1,0,-1 do
			self.bakitems.var.items[i] = self.innerItems.items[i]
		end
		self.bakItemsCount = self:getItemsCount()
	end;
	
	_restoreItems = function(self)
		UUIDMgr:restoreItemId() 
		self.innerItems.count = self.bakitems.var.count
		for i=self.bakitems.var.count-1,0,-1 do
			self.innerItems.items[i] = self.bakitems.var.items[i]
		end
		CppPlayerVar:freeVar(self.bakitems.hdr)
		
		for i=self:getItemsCount(), self.bakItemsCount + 1, -1 do
			table.remove(self.items, i)
		end
	end;
		
	_initItems = function(self)
		self.items = {}
		for i=1, self.innerItems.count, 1 do
			table.insert( self.items, ItemEx( self.innerItems.items[i-1] ) )
		end
	end;
	
	_removeItemByIdx = function(self, idx)
		if idx < 0 or idx >= self:getItemsCount() then
			return
		end
		
		self.innerItems.count = Util:removeElementC(self.innerItems.items, self.innerItems.count, idx)
		table.remove( self.items, table.getn(self.items) )
	end;	
	
	setGold = function(self, gold)
		if gold < 0 then
			return
		end
		
		self.pkg.ulGold = gold
	end;
	
	addGold = function(self, gold)
		self:_addGold(gold)
		Service:getProxyServer():sendQueryGold(self.player)
	end;
	
	_addGold = function(self, gold)
		if gold <= 0 then 
			return
		end
		
		self:setGold(self:getGold() + gold)
		WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.GOLD .. '",' .. gold )
		PkgMiscSender:send(self.player, {'gold'})
	end;
	
	getGold = function(self)
		return self.pkg.ulGold
	end;
	
	setGiftGold = function(self, giftgold)
		if giftgold < 0 then
			return
		end
		
		self.pkg.ulGiftGold = giftgold
	end;
	
	getGiftGold = function(self)
		return self.pkg.ulGiftGold
	end;
	
	getAllGold = function(self)
		return self:getGold() + self:getGiftGold()
	end;
	
	subGold = function(self, gold)
		self:_subGold(gold)
		Service:getProxyServer():sendQueryGold(self.player)
	end;
	
	discountWhenYellowDiamond = function(self, gold)
		if g_use_self_gold then
			return gold
		end
		
		if self.player:isYellowDiamond() then	
			gold = math.floor(gold*0.8)
		end
		return gold
	end;
	
	_subGold = function(self, gold)
		if gold <= 0 then
			return
		end
		
		if self.pkg.ulGold > gold then
			self.pkg.ulGold = self.pkg.ulGold - gold
		else
			self.pkg.ulGold = 0
		end
	end;
	
	subGiftGold = function(self, gold)
		if gold <= 0 then
			return
		end
		
		if gold <= self.pkg.ulGiftGold then
			self.pkg.ulGiftGold = self.pkg.ulGiftGold - gold
		else
			self:subGold(gold - self.pkg.ulGiftGold)
			self.pkg.ulGiftGold = 0
		end
	end;
	
	addGiftGold = function(self, gold)
		if gold <= 0 then
			return
		end
		
		self:setGiftGold(self:getGiftGold() + gold)
	end;

	refreshSalve = function(self)
		ItemMsgSender:sendSalveMax(self.player)
		
		local canAddMaxNumber = self:getMaxSalveCount() - self:getItemNumber(FIXID.SALVE)
		local factAddNumber = math.min(self:getOutputSalves(), canAddMaxNumber)
		self:setLastSalveTime()
		if factAddNumber <= 0 then
			return
		end
		
		self:addItemsNoTip({RawItemEx({resId=FIXID.SALVE, number=factAddNumber})})
	end;
	
	getMaxSalveCount = function(self)
		local hospitalLevels = self.player:getCitys():getBuildsLevelSum(FIXID.HOSPITALBUILD)
		if hospitalLevels == 0 then
			return 0
		end
		
		local liandanluLevels = self.player:getCitys():getBuildsLevelSum(FIXID.LIANDANLUBUILD)
		return 25*hospitalLevels + 20*liandanluLevels + 75
	end;
	
	getSalveOutput = function(self)
		return math.max(5, self:getMaxSalveCount()/100)/600
	end;
	
	getOutputSalves = function(self)
		local esapleTime = Util:getTime() - self.pkg.lastSalveTime
		return math.floor(esapleTime*self:getSalveOutput())
	end;
	
	setLastSalveTime = function(self)
		self.pkg.lastSalveTime = Util:getTime()
	end;
	
	calcHoldGridsCount = function(self, itemres, number)
		return math.ceil( number/itemres.pile )
	end;
})


