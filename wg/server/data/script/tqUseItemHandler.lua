-- 
UseItemHandler = Class:extends({
	onRequest = function(self, player, netevt, cmdtb)
		UseItemHdr:handle(player, cmdtb)
	end;
})

--
BaseItemHdr = Class:extends({
	setParam = function(self, player, itemId, itemres)
		self.player = player
		self.itemId = itemId
		self.itemres = itemres
	end;
	
	hasEnoughNumber = function(self, needNumber)
		return self:getNumber() >= needNumber
	end;
	
	isValidTarget = function(self, target)
		local hasTarget = (Util:find(self.itemres.targets, nil, target) ~= nil)
		if not hasTarget then
			WUtil:sendSysMsg( self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 'error use target type :'..target );
		end
		
		return hasTarget
	end;
	
	_getBindOrNoBindId = function(self)
		if (self.itemres.nobindid ~= nil) and (self.itemres.nobindid > 0) then
			return self.itemres.nobindid
		elseif (self.itemres.bindid ~= nil) and (self.itemres.bindid > 0) then
			return self.itemres.bindid
		end
		
		return 0
	end;
})

--
UniqueItemHdr = BaseItemHdr:extends({
	getNumber = function(self)
		local pkg = self.player:getPkg()
		local item = pkg:getItemById(self.itemId)
		if item == nil then 
			return 0 
		end
		
		return item:getNumber()
	end;
	
	subItem = function(self, number)
		local pkg = self.player:getPkg()
		pkg:delItemById(self.itemId)
		ItemMsgSender:sendDelItem(self.player, self.itemId)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, self.itemres.id, self:_getBindOrNoBindId())
	end;
})

--
PileItemHdr = BaseItemHdr:extends({
	getNumber = function(self)
		return self.player:getPkg():getItemNumber(self.itemres.id)
	end;
	
	subItem = function(self, number)
		self.player:getPkg():subItemByResId(self.itemres.id, number)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, self.itemres.id, self:_getBindOrNoBindId())
	end;
})

GiftGoldItemHdr = BaseItemHdr:extends({
	getNumber = function(self)
		local pkg = self.player:getPkg()
		return pkg:getAllGold()
	end;
	
	subItem = function(self, number)
		local pkg = self.player:getPkg()
		
		local msg = ''
		local giftGold, gold = self:_subGiftGoldAndGold(number)
		if gold == 0 then
			msg = string.format(rstr.speedByGiftGold, giftGold)
		else
			msg = string.format(rstr.speedByGiftGoldAndGold, giftGold, gold)
		end
		WUtil:sendSysMsg(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msg)
		
		pkg:subGiftGold(number)

		PkgMiscSender:send(self.player, {'gold', 'giftgold'})
	end;
	
	_subGiftGoldAndGold = function(self, number)
		local pkg = self.player:getPkg()
		if pkg:getGiftGold() >= number then
			return number, 0
		else
			return pkg:getGiftGold(), number - pkg:getGiftGold()
		end
	end;
})

NullItemHdr = Class:extends({
	setParam = function(self, player, itemId, itemres)
	end;
	
	hasEnoughNumber = function(self, needNumber)
		return false
	end;
	
	subItem = function(self, needNumber)
	end;
}):new()

--
SubItemHdr = Class:extends({
	init = function(self)
		self.itemHdrs = {}
		self.itemHdrs['unique'] = UniqueItemHdr:new()
		self.itemHdrs['pile'] = PileItemHdr:new()
	end;
	
	hasEnoughNumber = function(self, player, itemid, resid, number)
		local hdr = self:_getAndSetHdr(player, itemid, resid)
		return hdr:hasEnoughNumber(number)
	end;
	
	subItem = function(self, player, itemid, resid, number)
		local hdr = self:_getAndSetHdr(player, itemid, resid)
		hdr:subItem(number)
	end;
	
	_getAndSetHdr = function(self, player, itemid, resid)
		local hdr = self:_getHdr(resid)
		hdr:setParam(player, itemid, ItemResUtil:findItemres(resid))
		return hdr
	end;
	
	_getHdr = function(self, resid)
		local hdr = NullItemHdr
		local itemres = ItemResUtil:findItemres(resid)
		if itemres == nil then
			return hdr
		end
		
		if itemres.unique == 1 then
			hdr = self.itemHdrs['unique']
		else
			hdr = self.itemHdrs['pile']
		end
		
		return hdr
	end;
}):new()

--
UseItemHdr = Class:extends({
	init = function(self)
		self.itemHdrs = {}
		self.itemHdrs['unique'] = UniqueItemHdr()
		self.itemHdrs['pile'] = PileItemHdr()
		self.itemHdrs['giftGold'] = GiftGoldItemHdr()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return false end
		if not self:isValid() then return false end
		if not self:isCanExecEffects() then return false end
		if self:getNeedNumber() == 0 then return false end
		if not self:_hasEnoughRoleLevel() then return false end
		if not self:_canUseById() then return false end
		
		self:subItem()
		self:execEffects()
		
		return true
	end;
	
	getParam = function(self, player, cmdtb)
		self.number = Util:getNumber(cmdtb, 'number')
		if self.number <= 0 then 
			return false 
		end
		
		self.resid = Util:getNumber(cmdtb, 'resid')
		self.itemres = ItemResUtil:findItemres(self.resid)
		if self.itemres == nil then
			return false
		end
		
		self.params = UseTarget:parse(player, cmdtb)
		if self.params == nil then 
			return false 
		end
		
		self.params.byItem = true
		self.player = player
		self.itemId = Util:getNumber(cmdtb, 'id')
		self.targetType = Util:getNumber(cmdtb, 'ttype')
		self.itemHdr = self:getItemHdr()
		self.itemHdr:setParam(self.player, self.itemId, self.itemres)

		return true
	end;
	
	getItemHdr = function(self)
		local hdrType = 'pile'
		if self.itemres.unique == 1 then
			hdrType = 'unique'
		elseif self:hasEffect(RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD)
			or self:hasEffect(RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD)
			or self:hasEffect(RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD)
			or self:hasEffect(RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD)
			or self:hasEffect(RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD)
			or self:hasEffect(RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD) 
			or self:hasEffect(RES_EFF.FULL_ACC_TASK_USEGIFTGOLD) 
			then
			hdrType = 'giftGold'
		else
			hdrType = 'pile'
		end
		
		return self.itemHdrs[hdrType]
	end;
	
	hasEffect = function(self, effectId)
		return Util:find(self.itemres.effects, 'id', effectId) ~= nil
	end;
	
	isValid = function(self)
		return self.itemHdr:hasEnoughNumber(self.number)
			and self.itemHdr:isValidTarget(self.targetType)
	end;
	
	subItem = function(self)
		self.itemHdr:subItem(self.needNumber)
	end;
	
	isCanExecEffects = function(self)
		for _, effect in ipairs(self.itemres.effects) do
			local effector = EffectorMgr:getEffector(effect)
			if effector:isCanExec(self.player, self.number, effect, self.params) then
				return true
			end
		end
		
		return false
	end;
	
	_hasEnoughRoleLevel = function(self)
		if self.itemres.roleLevel == nil then
			return true
		end
		
		if self.player:getLevel() < self.itemres.roleLevel then
			WUtil:sendWarningMsgArgs(self.player, 100179, tostring(self.itemres.roleLevel) )
			return false
		end
		return true
	end;
	
	_canUseById = function(self)
		if self.resid == FIXID.ALLI_CONTRIB_CARD and self.player:getAlliId() == 0 then
			WUtil:sendWarningMsgArgs(self.player, 100187, '' )
			return false
		end
		return true
	end;
	
	getNeedNumber = function(self)
		self.needNumber = 0
		for _, effect in ipairs(self.itemres.effects) do
			local effector = EffectorMgr:getEffector(effect)
			local curNeedNumber = effector:getNeedNumber(self.player, self.number, effect, self.params)
			if curNeedNumber > self.needNumber then
				self.needNumber = curNeedNumber
			end
		end
		
		return self.needNumber
	end;
	
	execEffects = function(self)
		for _, effect in ipairs(self.itemres.effects) do
			local effector = EffectorMgr:getEffector(effect)
			effector:exec(self.player, self.needNumber, effect, self.params)
		end
	end;
}):new()


