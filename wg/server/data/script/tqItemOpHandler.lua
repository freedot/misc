--*******************************************************************************
--*******************************************************************************
MAX_SPLITARM_COUNT = 1000
MAX_GEM_COMBINE_LEVEL = 4

ItemOpHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = SplitArmOpHandler:new()
		self.handlers[2] = IntensifyArmOpHandler:new()
		self.handlers[3] = BesetGemOpHandler:new()
		self.handlers[4] = UnbesetGemOpHandler:new()
		self.handlers[5] = CombineGemOpHandler:new()
		self.handlers[6] = UpgradeGemOpHandler:new()
		self.handlers[7] = DropItemFromPkgHandler:new()
	end;
})

SplitArmOpHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_collectArms() then
			return false
		end
		
		if not self:_collectItemRess() then
			return false
		end
		
		if self:_hasCanNoSplitArms() then
			return false
		end
		
		self:_splitArms()
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local count = Util:getNumber(cmdtb, 'count')
		if count <= 0 then
			LOG('<error>split arm init params count error, count:' .. count)
			return false
		end
		
		if count > MAX_SPLITARM_COUNT then
			LOG('<error>split arm init params count error, count:' .. count)
			return false
		end;
		
		local itemIds = {}
		for i=1, count, 1 do
			local id = Util:getNumber(cmdtb, 'id'..i)
			if id <= 0 then
				LOG('<error>split arm init params id error, id:' .. id)
				return false
			end
			
			if Util:find(itemIds, nil, id) ~= nil then
				LOG('<error>split arm init params has repeat, id:' .. id)
				return false
			end
			
			table.insert(itemIds, id)
		end
		
		self.itemIds = itemIds
		self.player = player
		
		return true
	end;
	
	_collectArms = function(self)
		local items = {}
		local pkg = self.player:getPkg()
		for _, id in ipairs(self.itemIds) do
			local item  = pkg:getItemById(id)
			if item == nil then
				LOG('<error>split arm collect arm find not exist id:' .. id)
				return false
			end
			table.insert(items, item)
		end
		
		self.items = items
		return true
	end;
	
	_collectItemRess = function(self)
		local itemRess = {}
		for _, item in ipairs(self.items) do
			local res = ItemResUtil:findItemres(item:getResId())
			if res == nil then
				LOG('<error>split arm collect item res find not exist resid:' .. item:getResId())
				return false
			end
			
			table.insert(itemRess, res)
		end
		
		self.itemRess = itemRess
		return true
	end;
	
	_hasCanNoSplitArms = function(self)
		for _, res in ipairs(self.itemRess) do
			if res.decomposeGet == nil then
				LOG('<error>split arm has can not split arm :' .. res.id)
				return true
			end
			
			if res.decomposeGet == 0 then
				LOG('<error>split arm has can not split arm :' .. res.id)
				return true
			end
		end
		
		return false
	end;
	
	_splitArms = function(self)
		local getResIds = self:_calcSplitGetItems()
		local combineResIds = self:_combineSameItems(getResIds)
		ItemOpSender:sendDecomposeResult(self.player, getResIds)
		self:_deleteSplitArms()
		self:_addGetItems( combineResIds )
	end;
	
	_calcSplitGetItems = function(self)
		local getResIds = {}
		for idx, item in ipairs(self.items) do
			local res = self.itemRess[idx]
			local forceLevel = item:getForceLevel()
			table.insert(getResIds, {armResid=item:getResId(), forceLevel=forceLevel, resid=res.decomposeGet, number=self:_getEssenceNumber()})
			
			if forceLevel > 0 then
				table.insert(getResIds, {armResid=item:getResId(), forceLevel=forceLevel, resid=FIXID.REFINESTONE, number=self:_getStoneNumber(forceLevel)})
			end
		end
		return getResIds
	end;
	
	_getEssenceNumber = function(self)
		local curPer = math.random(10000)/100
		return Util:getRoundRandVal(res_splitarm_get_essence_num, curPer).num
	end;
	
	_getStoneNumber = function(self, maxCount)
		local curPer = math.random(10000)/100
		local num = Util:getRoundRandVal(res_splitarm_get_stone_num, curPer).num
		return math.min(num, maxCount)
	end;
	
	_deleteSplitArms = function(self)
		for _, itemId in ipairs(self.itemIds) do
			ItemMsgSender:sendDelItem(self.player,itemId)
			self.player:getPkg():delItemById(itemId)
		end
	end;
	
	_combineSameItems = function(self, getResIds)
		local combineResIds = {}
		for _, res in ipairs(getResIds) do
			local existRes = Util:find(combineResIds, 'resid', res.resid)
			if existRes ~= nil then
				existRes.number = existRes.number + res.number
			else
				table.insert( combineResIds, {resid=res.resid, number=res.number} )
			end
		end
		return combineResIds
	end;
	
	_addGetItems = function(self, getResIds)
		local rawItems = DropItem():createRawItems(getResIds)
		if not self.player:getPkg():addItems( rawItems ) then
			assert ( false, "forever can't arrive here" )
			LOG("forever can't arrive here, code:4835612151")
		end
	end;
});

HeroWearOrPkgItemBaseOp = Class:extends({
	_baseInitParams = function(self, player, cmdtb)
		local hero = self:_getHero(player, cmdtb)
		local item, armPos = self:_getItem(player, hero, cmdtb)
		if item == nil then
			return false
		end
		
		self.player = player
		self.hero = hero
		self.item = item
		self.armPos = armPos
		
		return true
	end;
	
	_getHero = function(self, player, cmdtb)
		local heroId = Util:getNumber(cmdtb, 'hid')
		return player:getHeroMgr():getHeroById(heroId)
	end;
	
	_getItem = function(self, player, hero, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		if hero == nil then
			return player:getPkg():getItemById(itemId), 0
		else
			local wearArm = hero:getWearContainer():getWearArmById(itemId)
			if wearArm == nil then
				return nil, 0
			end
			
			return wearArm:getArm(), wearArm:getArmPos()
		end
	end;
	
	_isNullHeroOrHeroFree = function(self)
		if self.hero == nil then
			return true
		end
		
		return self.hero:isFree()
	end;	
	
	_isCanBesetForceArm = function(self)
		local res = ItemResUtil:findItemres(self.item:getResId())
		if res == nil then
			return false
		end
		
		return (res.apos >= HEROARM_POS.HEAD) and (res.apos <= HEROARM_POS.SHOES)	
	end;	
	
	_recalHeroAttrs = function(self)
		if self.hero == nil then
			return
		end
		
		 HeroAttrHelper:recalcAttrs(self.player, self.hero) 
	end;	
	
	_sendItem = function(self)
		if self.hero ~= nil then
			HeroAttrSender:sendWear(self.player, self.hero, self.armPos)
		else
			ItemMsgSender:sendItem(self.player, self.item)
		end
	end;	
});

IntensifyArmOpHandler = HeroWearOrPkgItemBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isNullHeroOrHeroFree() then
			WUtil:sendWarningMsgArgs(player, 100027, '')
			return false
		end
	
		if self:_isMaxForceLevel() then
			return false
		end

		if not self:_isCanForceArm() then
			return false
		end
		
		self.expends = self:_getExpends()
		if not WUtil:isEnoughExpends(self.expends) then
			return false
		end
		
		WUtil:subExpends(self.expends)
		self:_intensifyArm()
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.STRONG_ARM)
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		return self:_baseInitParams(player, cmdtb)
	end;	
	
	_isMaxForceLevel = function(self)
		return self.item:getForceLevel() >= res_max_forcelevel
	end;
	
	_isCanForceArm = function(self)
		return self:_isCanBesetForceArm()
	end;
	
	_getExpends = function(self)
		local nextForceLevel = self.item:getForceLevel() + 1
		return WUtil:createExpendObjs(self.player, nil, res_force_arms[nextForceLevel].expends)
	end;
	
	_intensifyArm = function(self)
		self:_armUpgradeForceLevel()
		self:_recalItemAppendAttrs()
		self.item:bind()
		self:_recalHeroAttrs()
		self:_sendItem()
		ItemOpSender:sendIntensifyResult(self.player, self.item)
	end;
	
	_armUpgradeForceLevel = function(self)
		self.item:setForceLevel(self.item:getForceLevel() + 1)
	end;
	
	_recalItemAppendAttrs = function(self)
		local attrIds = {{baseAttrId=ATTR.ST_B, appendAttrId=ATTR.ST_A}
			,{baseAttrId=ATTR.PH_B, appendAttrId=ATTR.PH_A}
			,{baseAttrId=ATTR.AG_B, appendAttrId=ATTR.AG_A}}
			
		local effect = res_force_arms[self.item:getForceLevel()].effect
		for _, attrId in ipairs(attrIds) do
			self:_calcItemAppendAttrVal(attrId.baseAttrId,  attrId.appendAttrId, effect)
		end	
	end;
	
	_calcItemAppendAttrVal = function(self, baseAttrId,  appendAttrId, effect)
		local baseAttr = self.item:getAttr(baseAttrId)
		if baseAttr == nil then
			return
		end
		
		local appendAttrVal = math.floor(baseAttr.val * effect / 100)
		appendAttrVal = self:_formatForceValByMinVal(baseAttr.val, appendAttrVal)
		local appendAttr = self.item:getAttr(appendAttrId)
		if appendAttr ~= nil then
			appendAttr.val = appendAttrVal
		else
			self.item:addAttr({attr=appendAttrId, val=appendAttrVal, unit=0})
		end
	end;
	
	_formatForceValByMinVal = function(self, baseAttrVal, appendAttrVal)
		if (baseAttrVal > 0) and (appendAttrVal == 0) then
			return 1
		else
			return appendAttrVal
		end
	end;
})

BesetGemOpHandler = HeroWearOrPkgItemBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isValidGem() then
			return false
		end
		
		if not self:_isNullHeroOrHeroFree() then
			WUtil:sendWarningMsgArgs(player, 100028, '')
			return false
		end
		
		if not self:_isCanBesetArm() then
			return false
		end
		
		if self:_isBesetGemstFull() then
			return false
		end
		
		if self:_hasBesetedSameTypeGem() then
			return false
		end
		
		self:_besetGem()
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.BESET_GEM)
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		if not self:_baseInitParams(player, cmdtb) then
			return false
		end
		
		self.gemResId = Util:getNumber(cmdtb, 'gid')
		
		return true
	end;
	
	_isValidGem = function(self)
		if not GemUtil:isGem(self.gemResId) then
			return false
		end
		
		return self.player:getPkg():getItemNumber(self.gemResId) > 0
	end;
	
	_isCanBesetArm = function(self)
		return self:_isCanBesetForceArm()	
	end;
	
	_isBesetGemstFull = function(self)
		return self.item:getGemsCount() == MAX_GEMBESET_CNT
	end;
	
	_hasBesetedSameTypeGem = function(self)
		local gemEffectId = GemUtil:getEffectId(self.gemResId)
		for i = self.item:getGemsCount()-1, 0, -1 do
			local curGemEffectId = GemUtil:getEffectId( self.item:getGemByIdx(i) )
			if gemEffectId == curGemEffectId then
				return true
			end
		end
		return false
	end;

	_besetGem = function(self)
		self:_besetGemToArm()
		self.item:bind()
		self:_subGemFromPkg()
		self:_recalHeroAttrs()
		self:_sendItem()
		
		ItemOpSender:sendBesetResult(self.player, self.item)
	end;
	
	_besetGemToArm = function(self)
		self.item:addGem(self.gemResId)
	end;
	
	_subGemFromPkg = function(self)
		self.player:getPkg():subItemByResId(self.gemResId, 1)
	end;
})

UnbesetGemOpHandler = HeroWearOrPkgItemBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isValidGemGridPos() then
			return false
		end
		
		if not self:_isNullHeroOrHeroFree() then
			WUtil:sendWarningMsgArgs(player, 100029, '')
			return false
		end
		
		if not self:_addGemsToPkg() then
			WUtil:sendWarningMsgArgs(player, 100030, '')
			return false
		end
		
		self:_unbesetGems()
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		if not self:_baseInitParams(player, cmdtb) then
			return false
		end
		
		self.removeGemPos = Util:getNumber(cmdtb, 'gpos')
		
		return true
	end;
	
	_isValidGemGridPos = function(self)
		if self.item:getGemsCount() == 0 then
			return false
		end
		
		if self.removeGemPos >= self.item:getGemsCount() then
			return false
		end
		
		return true
	end;
	
	_addGemsToPkg = function(self)
		local rawItems = {}
		if self.removeGemPos < 0 then -- remove all gems
			for i=1, self.item:getGemsCount(), 1 do
				local gemResId = self.item:getGemByIdx(i-1)
				table.insert(rawItems, RawItemEx({resId=gemResId, number=1}))
			end
		else
			local gemResId = self.item:getGemByIdx(self.removeGemPos)
			table.insert(rawItems, RawItemEx({resId=gemResId, number=1}))
		end
		
		return self.player:getPkg():addItemsNoTip(rawItems)
	end;
	
	_unbesetGems = function(self)
		self:_unbesetGemsFromArm()
		self:_recalHeroAttrs()
		self:_sendItem()
		
		ItemOpSender:sendBesetResult(self.player, self.item)	
	end;
	
	_unbesetGemsFromArm = function(self)
		if self.removeGemPos < 0 then
			self.item:clearGems()
		else
			self.item:removeGem(self.removeGemPos)
		end
	end;
})

CombineGemOpHandler = Class:extends({
	handle = function(self, player, cmdtb)
		self:_initParams(player, cmdtb)
		
		if not self:_isValid() then
			return false
		end
		
		if not self:_addGemsToPkg() then
			return false
		end
		
		self:_subExpendGems()
		self:_sendResult()
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.MERGE_GEM)
	
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		self.player = player
		self.gemResId = Util:getNumber(cmdtb, 'gid')
		self.comblineLevel = Util:getNumber(cmdtb, 'clevel')
		self.isBatch = (Util:getNumber(cmdtb, 'batch') == 1)
	end;
	
	_isValid = function(self)
		if not GemUtil:isGem(self.gemResId) then
			return false
		end
		
		if GemUtil:isMaxGemLevel(self.gemResId) then
			return false
		end

		if not GemUtil:isValidCombineLevel(self.comblineLevel) then
			return false
		end
		
		if not self:_hasEnoughGems() then
			return false
		end
		
		return true
	end;
	
	_addGemsToPkg = function(self)
		self._totalCombinedTimes = self:_getCanCombineTimes()
		self.succNumber = self:_calcSuccCombineNumber()
		if self.succNumber == 0 then
			WUtil:sendWarningMsgArgs(self.player, 100035, '')
			return true
		end
		
		local rawItem = RawItemEx({resId=GemUtil:getNextLevelResId(self.gemResId)
			, number=self.succNumber})
		if not self.player:getPkg():addItems({rawItem}) then
			WUtil:sendWarningMsgArgs(self.player, 100034, '')
			return false
		end
		
		return true
	end;
	
	_subExpendGems = function(self)
		local number = self:_getCanCombineTimes() * GemUtil:getCombineNeedNumber(self.comblineLevel)
		local expendRess={{type=EXPEND_TYPE.ITEM,resid=self.gemResId,val=number}}
		local expends = WUtil:createExpendObjs(self.player, nil, expendRess)
		WUtil:subExpends(expends)
	end;
	
	_sendResult = function(self)
		if self.succNumber > 0 then
			WUtil:sendSuccMsgArgs(self.player, 100038, '"@itemid' .. GemUtil:getNextLevelResId(self.gemResId) .. '"')
		end
		
		if self.isBatch then
			self:_sendBatchMsgBox()
		end
	end;
	
	_sendBatchMsgBox = function(self)
		local failNumber = self._totalCombinedTimes - self.succNumber
		local msg = ''
		if failNumber == 0 then
			msg = rstr.armop.msg.batchSucces
		else
			msg = rstr.armop.msg.batchFail
		end
		
		msg = string.format(msg, self.succNumber, failNumber)
		WUtil:sendPopBoxMsg(self.player, msg)
	end;
	
	_calcSuccCombineNumber = function(self)
		local number = 0
		local succPro = GemUtil:getCombineSuccPro(self.comblineLevel)
		for i=self:_getCanCombineTimes(), 1, -1 do
			if math.random(100) <= succPro then
				number = number + 1
			end
		end
		return number
	end;
	
	_hasEnoughGems = function(self)
		return self:_getCanCombineTimes() > 0
	end;
	
	_getCanCombineTimes = function(self)
		local oneTimeNeedNumber = GemUtil:getCombineNeedNumber(self.comblineLevel)
		local myHasNumber = self.player:getPkg():getItemNumber(self.gemResId)
		local times = math.floor(myHasNumber/oneTimeNeedNumber)
		
		if self.isBatch then
			return times
		else
			return math.min(times, 1)
		end
	end;	
})

UpgradeGemOpHandler = HeroWearOrPkgItemBaseOp:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isValid() then
			return false
		end
		
		self:_upgradeGemInArm()
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		if not self:_baseInitParams(player, cmdtb) then
			return false
		end
		
		self.gemPos = Util:getNumber(cmdtb, 'gpos')
		self.gemResId = self.item:getGemByIdx(self.gemPos)
		if self.gemResId == nil then
			return false
		end
		
		return true
	end;
	
	_isValid = function(self)
		if not self:_isNullHeroOrHeroFree() then
			WUtil:sendWarningMsgArgs(self.player, 100033, '')
			return false
		end
		
		if GemUtil:isMaxGemLevel(self.gemResId) then
			return false
		end

		if not self:_hasEnoughGems() then
			return false
		end

		return true
	end;
	
	_upgradeGemInArm = function(self)
		self:_resetGemResIdInArm()
		self:_recalHeroAttrs()
		self:_sendItem()
		self:_subExpendGems()
		self:_sendSuccResult()
	end;
	
	_hasEnoughGems = function(self)
		return self:_getFactNeedNumber() <= self.player:getPkg():getItemNumber(self.gemResId)
	end;
	
	_resetGemResIdInArm = function(self)
		self.item:setGemByIdx(self.gemPos, GemUtil:getNextLevelResId(self.gemResId))
	end;
	
	_subExpendGems = function(self)
		local expendRess={{type=EXPEND_TYPE.ITEM,resid=self.gemResId,val=self:_getFactNeedNumber() }}
		local expends = WUtil:createExpendObjs(self.player, nil, expendRess)
		WUtil:subExpends(expends)
	end;
	
	_sendSuccResult = function(self)
		WUtil:sendSuccMsgArgs(self.player, 100037, '"@itemid' .. GemUtil:getNextLevelResId(self.gemResId) .. '"')
	end;
	
	_getFactNeedNumber = function(self)
		return GemUtil:getCombineNeedNumber(MAX_GEM_COMBINE_LEVEL) - 1 -- sub beseted one gem
	end;
})

DropItemFromPkgHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		self.player:getPkg():delItemById(self.itemId)
		ItemMsgSender:sendDelItem(self.player, self.itemId)
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		local item = player:getPkg():getItemById(itemId)
		if item == nil then
			return false
		end
		
		self.itemId = itemId
		self.player = player
		return true
	end;	
})



