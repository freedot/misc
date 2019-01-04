--*******************************************************************************
--*******************************************************************************
ItemExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
		self.itemres = ItemResUtil:findItemres(self.expend.resid)
	end;
	
	isEnough = function(self)
		if self:getNumber() < self.expend.val then
			WUtil:sendErrorMsgArgs(self.player, 100001, '"@itemid'..self.expend.resid..'",'..self.expend.val)
			return false
		end
		
		return true
	end;
	
	getNumber = function(self)
		return self.player:getPkg():getItemNumber(self.itemres.id)
	end;	
	
	sub = function(self)
		self.player:getPkg():subItemByResId(self.itemres.id, self.expend.val)
	end;
})

AttrExpend = Class:extends({
	sendAttr = function(self, attr)
	end;
	
	sub = function(self)
		self.attr.ulVal = self.attr.ulVal - self.expend.val
		self:sendAttr(self.attr)
	end;
})

RoleAttrExpend = AttrExpend:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		self.attr = self.player:getAttr(self.expend.attr)
		local rt = (self.attr.ulVal >= self.expend.val)
		if not rt then
			WUtil:sendErrorMsgArgs(self.player, 100003, '"@attrid'..self.expend.attr..'",'..self.expend.val)
		end
		return rt
	end;
	
	sendAttr = function(self)
		RoleAttrSender:sendAttr(self.player, self.attr)
	end;
})

HeroAttrExpend = AttrExpend:extends({
	init = function(self, player, hero, expend)
		self.player = player
		self.hero = hero
		self.expend = expend
	end;
	
	isEnough = function(self)
		self.attr = self.hero:getAttr(self.expend.attr)
		local rt = (self.attr.ulVal >= self.expend.val)
		if not rt then
			WUtil:sendErrorMsgArgs(self.player, 100002, '"@heroid'..self.hero:getId()..'",'..'"@attrid'..self.expend.attr..'",'..self.expend.val)
		end
		return rt
	end;
	
	sendAttr = function(self)
		HeroAttrSender:sendAttr(self.player, self.hero, self.attr)
	end;
})

MoneyExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		if self.player:getCityRes():getMoney() < self.expend.val then
			WUtil:sendErrorMsgArgs(self.player, 100159, self.expend.val)
			return false
		else
			return true
		end
	end;
	
	sub = function(self)
		self.player:getCityRes():subMoney(self.expend.val)
	end;
})

GoldExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		if self.player:getPkg():getGold() < self.expend.val then
			WUtil:sendErrorMsgArgs(self.player, 100160, self.expend.val)
			return false
		else
			return true
		end
	end;
	
	sub = function(self)
		self.player:getPkg():subGold(self.expend.val)
		PkgMiscSender:send(self.player, {'gold'})
	end;
})

GiftGoldExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		if self.player:getPkg():getAllGold() < self.expend.val then
			WUtil:sendErrorMsgArgs(self.player, 100161, self.expend.val)
			return false
		else
			return true
		end
	end;
	
	sub = function(self)
		self.player:getPkg():subGiftGold(self.expend.val)
		PkgMiscSender:send(self.player, {'gold','giftgold'})
	end;
})

PureGiftGoldExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		if self.player:getPkg():getGiftGold() < self.expend.val then
			WUtil:sendErrorMsgArgs(self.player, 100161, self.expend.val)
			return false
		else
			return true
		end
	end;
	
	sub = function(self)
		self.player:getPkg():subGiftGold(self.expend.val)
		PkgMiscSender:send(self.player, {'giftgold'})
	end;
})

CommResExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
		self.m = ''
	end;
	
	isEnough = function(self)
		local ms = {{id=FIXID.FOOD, m='Food'},{id=FIXID.WOOD, m='Wood'},{id=FIXID.STONE, m='Stone'},{id=FIXID.IRON, m='Iron'}}
		local m = Util:find(ms, 'id', self.expend.id)
		if m == nil then return false end
		
		local cres = self.player:getCityRes()
		self.m = m.m
		local getter = cres['get'..self.m]
		return getter(cres) >= self.expend.val
	end;
	
	sub = function(self)
		local cres = self.player:getCityRes()
		local setter = cres['set'..self.m]
		local getter = cres['get'..self.m]
		setter(cres, getter(cres) - self.expend.val )
		CommResSender:send(self.player, {self.expend.id})
	end;
})

IdlePopuExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		local cityres = self.player:getCityRes()
		local isenough = cityres:getIdlePopu() >= self.expend.val
		if not isenough then
			WUtil:sendErrorMsgArgs(self.player, 100000, self.expend.val)
		end
		return isenough
	end;
	
	sub = function(self)
		local cityres = self.player:getCityRes()
		local leftpopu = cityres:getIdlePopu() - self.expend.val
		cityres:setIdlePopu(leftpopu)
		PopuSender:send(self.player, {'idle'})
	end;
})

PrestigeExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		local isEnough = self.player:getPrestige() >= self.expend.val
		if not isEnough then
			WUtil:sendWarningMsgArgs(self.player, 100024, '')
		end
		return isEnough
	end;
	
	sub = function(self)
		local leftPrestige = self.player:getPrestige() - self.expend.val
		self.player:setPrestige(leftPrestige)
		RoleBaseSender:send(self.player, {'prestige'})
	end;
})

HonorExpend = Class:extends({
	init = function(self, player, expend)
		self.player = player
		self.expend = expend
	end;
	
	isEnough = function(self)
		local isEnough = self.player:getCityHonor() >= self.expend.val
		if not isEnough then
			WUtil:sendWarningMsgArgs(self.player, 100197, '')
		end
		return isEnough
	end;
	
	sub = function(self)
		local leftHonor = self.player:getCityHonor() - self.expend.val
		self.player:setCityHonor(leftHonor)
		RoleBaseSender:send(self.player, {'cityhonor'})
	end;
})


