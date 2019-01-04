ShopHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ShopBuyItemHandler:new()
		self.handlers[2] = ShopGetSaleListHandler:new()
		self.handlers[3] = ShopSaleItemHandler:new()
		self.handlers[4] = ShopBuyGoldHandler:new()
	end;
	
	onRequest = function(self, player, netevt, cmdtb, exflag)
		if cmdtb.subcmd == 1 and g_use_self_gold then
			exflag = true -- 先屏蔽掉用系统的金币购买道具
		end
		return self:getHandler(cmdtb.subcmd):handle(player, cmdtb, exflag)
	end;	
})

ShopBuyItemHandler = Class:extends({
	init = function(self)
		self.payTypeHandlers = {}
		self.payTypeHandlers[PAY_TYPE.MONEY] = PayTypeByMoneyHandler()
		self.payTypeHandlers[PAY_TYPE.GOLD] = PayTypeByGoldHandler()
		self.payTypeHandlers[PAY_TYPE.GIFTGOLD] = PayTypeByGiftGoldHandler()
		self.payTypeHandlers[PAY_TYPE.PRESTIGE] = PayTypeByPrestigeHandler()
		self.payTypeHandlers[PAY_TYPE.HONOR] = PayTypeByHonorHandler()
		self.payHandler=nil
	end;
	
	handle = function(self, player, cmdtb, factBuy)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		self.expends = self.payHandler:getExpends()
		
		if not WUtil:isEnoughExpends(self.expends) then
			return false
		end
		
		if not self.payHandler:isCanBuy() then
			return false
		end
		
		local factResId = self:_getFactResId(self.payHandler:isBind()==1, self.resId)
		local rawItems = {RawItemEx({resId=factResId, number=self.number,isBind=self.payHandler:isBind()})}
		if not player:getPkg():preAddItems(rawItems) then
			WUtil:sendWarningMsgArgs(self.player, 100023, '')
			return false
		end
		
		if self:_isStartBuyByGold(factBuy) then
			if not self:_doStartBuy(cmdtb) then
				return false
			end
		else
			self:_doBuy(rawItems, factResId)
		end
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local payType = Util:getNumber(cmdtb, 'paytype')
		if (payType < PAY_TYPE.FIRST) or (payType > PAY_TYPE.LAST) then
			return false
		end
		
		local resId = Util:getNumber(cmdtb, 'resid')
		if resId <= 0 then
			return false
		end
		
		local number = Util:getNumber(cmdtb, 'num')
		if number <= 0 then
			return false
		end
		
		local itemres = ItemResUtil:findItemres(resId)
		if itemres == nil then
			return false
		end
		
		if itemres.buyprice == nil then
			return false
		end
		
		
		local todayLeftNumer = player:getBuyLimiter():getTodayLeftNumber(resId)
		if todayLeftNumer == 0 then
			WUtil:sendWarningMsgArgs(self.player, 100180, '"@itemid'..resId..'"')
			return false
		end
		
		self.number = math.min(number, todayLeftNumer)
		
		local payTypeIdx = payType+1
		local oneNeedPay = itemres.buyprice[payTypeIdx]
		if (oneNeedPay == nil) or (oneNeedPay == 0) then
			return false
		end
		
		self.player = player
		self.resId = resId
		self.itemres = itemres
		self.oneNeedPay = oneNeedPay
		self.numberBeCut =  number > self.number
		self.payHandler = self:_getTypeHandler(payType)
		self.payHandler:initParams(self.player, self.resId, oneNeedPay, self.number)
		
		return true
	end;
	
	_getFactResId = function(self, isBind, resId)
		local itemres = ItemResUtil:findItemres( resId )
		if not isBind and itemres.nobindid > 0 then
			return itemres.nobindid
		end
		
		if isBind and itemres.bindid > 0 then
			return itemres.bindid
		end
		
		return resId
	end;
	
	_getTypeHandler = function(self, payType)
		return self.payTypeHandlers[payType]
	end;
	
	_isStartBuyByGold = function(self, factBuy)
		return self.payHandler:isGold() and (not factBuy)
	end;
	
	_doStartBuy = function(self, cmdtb)
		if Service:getProxyServer():hasDeal(self.player:getName()) then
			WUtil:sendWarningMsgArgs(self.player, 100176, '')
			return false
		end
		
		local holdPkgCount = self.player:getPkg():calcHoldGridsCount(self.itemres, self.number)
		local dealPkg = {cmdpkg=cmdtb, holdPkgCount=holdPkgCount, resid=self.resId, price=self.oneNeedPay, number=self.number}
		Service:getProxyServer():addDeal(self.player, dealPkg)
		
		Service:getProxyServer():setSendMsgFlag(false)
		WUtil:subExpends(self.expends)
		Service:getProxyServer():setSendMsgFlag(true)
		
		return true
	end;
	
	_doBuy = function(self, rawItems, factResId)
		self.player:getBuyLimiter():addBuyItemId(self.resId, self.number)
		if self.numberBeCut then
			WUtil:sendWarningMsgArgs(self.player, 100180, '"@itemid'..self.resId..'"')
		end
		self.player:getPkg():addItems(rawItems)
		WUtil:subExpends(self.expends)
		self:_doTasks(factResId)	
	end;
	
	_doTasks = function(self, resid)
		if self.itemres.apos == nil then return end
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.BUY_ONE_ARM)
	end;
})

PayTypeBaseHandler = Class:extends({
	initParams = function(self, player, resId, oneNeedPay, number)
		self.player = player
		self.resId = resId
		self.oneNeedPay = oneNeedPay
		self.number = number
	end;
	
	getExpends = function(self)
		return nil
	end;
	
	isCanBuy = function(self)
		return true
	end;
	
	isBind = function(self)
		return 1
	end;
	
	isGold = function(self)
		return false
	end;
})

PayTypeByMoneyHandler = PayTypeBaseHandler:extends({
	getExpends = function(self)
		local expendRess = {{attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=self.oneNeedPay*self.number}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
	
	isCanBuy = function(self)
		local level = self.player:getCitys():getBuildLevelByResId(FIXID.SMITHY)
		local res = res_smithy_salelist[level]
		if res == nil then
			return false
		end
		
		return res.itemIds[self.resId] == true
	end;
})

PayTypeByGoldHandler = PayTypeBaseHandler:extends({
	getExpends = function(self)
		local oneNeedPay = self.player:getPkg():discountWhenYellowDiamond(self.oneNeedPay)
		local expendRess = {{attr=ATTR.GOLD,type=EXPEND_TYPE.GOLD,val=oneNeedPay*self.number}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
	
	isBind = function(self)
		return 0
	end;
	
	isGold = function(self)
		return true
	end;	
})

PayTypeByGiftGoldHandler = PayTypeBaseHandler:extends({
	getExpends = function(self)
		local expendRess = {{attr=ATTR.GIFTGOLD,type=EXPEND_TYPE.GIFTGOLD,val=self.oneNeedPay*self.number}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
})

PayTypeByPrestigeHandler = PayTypeBaseHandler:extends({
	getExpends = function(self)
		local expendRess = {{attr=ATTR.PRESTIGE,type=EXPEND_TYPE.PRESTIGE,val=self.oneNeedPay*self.number}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
})

PayTypeByHonorHandler = PayTypeBaseHandler:extends({
	getExpends = function(self)
		local expendRess = {{attr=ATTR.HONOR,type=EXPEND_TYPE.HONOR,val=self.oneNeedPay*self.number}}
		return WUtil:createExpendObjs(self.player, nil, expendRess)
	end;
})

ShopSaleItemHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isCanSale() then
			return false
		end
		
		self:_sendSuccResult()
		
		self.player:getPkg():delItemById(self.item:getId())
		self.player:getCityRes():addMoney(self.saleMoney)
		
		ItemMsgSender:sendDelItem(self.player, self.itemId)
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		if itemId <= 0 then
			return false
		end
		
		local item = player:getPkg():getItemById(itemId)
		if item == nil then
			return false
		end
		
		local itemres = ItemResUtil:findItemres( item:getResId() )
		if itemres == nil then
			return false
		end
		
		if itemres.salePrice == nil then
			self.saleMoney = 0
		else
			self.saleMoney = itemres.salePrice*item:getNumber()
		end
		
		self.player = player
		self.itemId = itemId
		self.item = item
		return true
	end;
	
	_isCanSale = function(self)
		if self.saleMoney == 0 then
			return false
		end
		
		if self.item:getGemsCount() > 0 then
			WUtil:sendWarningMsgArgs(self.player, 100036, '')
			return false
		end
		
		return true
	end;
	
	_sendSuccResult = function(self)
		WUtil:sendSuccMsgArgs( self.player, 100040, '"@itemid' .. self.item:getResId() .. '",' .. self.saleMoney )
	end;
})

ShopGetSaleListHandler = Class:extends({
	handle = function(self, player, cmdtb)
		--ShopSender.sendShopSalesList(player, res_shops_class)
	end;
})

ShopBuyGoldHandler = Class:extends({
	handle = function(self, player, cmdtb, factBuy)
		self.player = player
		local resid = Util:getNumber(cmdtb, 'id')
		if not GoldIdHelper:isGoldId(resid) then
			return false
		end
		
		self.res = ItemResUtil:findItemres(resid)
		self.number = Util:getNumber(cmdtb, 'number')
		if self.number <= 0 then
			return false
		end
		
		if not factBuy then
			return self:_doStartBuy(cmdtb)
		else
			return self:_addGold()
		end
	end;
	
	_doStartBuy = function(self, cmdtb)
		local dealPkg = {cmdpkg=cmdtb, holdPkgCount=0, resid=self.res.id, price=self.res.effects[1].val, number= self.number}
		Service:getProxyServer():addDeal(self.player, dealPkg)
		return true
	end;
	
	_addGold = function(self)
		local totalGold = self.res.effects[1].val *  self.number
		self.player:getPkg():addGold(totalGold)
		self.player:getTask():getPayAct():addGold(totalGold)
		self.player:checkUpgradeVipLevel()
		PayGoldSender:sendPayGold(self.player)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FIRST_RECHARGE)
		LOG('<addgold> role:[' .. self.player:getRoleName() .. '], add:' .. totalGold  )
		return true
	end;
})



