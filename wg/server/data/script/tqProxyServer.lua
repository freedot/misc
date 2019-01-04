--*******************************************************************************
local SVR_CMD_SetZoneId = 1
local SVR_CMD_QueryGold = 2
local SVR_CMD_GetBuyToken = 3
local SVR_CMD_UserExistResult = 7
local SVR_CMD_ImmPayResult = 8
local SVR_CMD_GMResult = 11

GoldIdHelper = Class:extends({
	isGoldId = function(self, resid)
		return (resid >= FIXID.GOLD_1) and (resid <= FIXID.GOLD_4)
	end;
}):new()

ProxyServer = Class:extends({
	init = function(self)
		self._deals = {}
		self._TIMEOUT = 30 -- second
		self._canSendMsg = true
	end;
	
	clear = function(self)
		self._deals = {}
	end;
	
	getSuccTimeOut = function()
		return 30
	end;
	
	getCancelTimeOut = function()
		return 5
	end;
	
	connect = function(self)
		if not ProxyServerC:connect('127.0.0.1', 9100) then
			return false
		end
		local msg = '{"cmd":' .. SVR_CMD_SetZoneId .. ',"zoneId":"' .. res_svr_mics_cfg.payZoneId .. '","user":"bdgame","psw":"385wflwreifdew213"}#'
		ProxyServerC:sendMsg(msg)
		return true
	end;
	
	hasDeal = function(self, userName)
		return self:getDeal(userName) ~= nil
	end;
	
	getHoldPkgCount = function(self, userName)
		local deal = self:getDeal(userName)
		if (not deal) or (deal.holdPkgCount == nil) then
			return 0
		end
		return deal.holdPkgCount
	end;
	
	addDeal = function(self, player, dealData)
		if dealData then
			dealData.stamp = Util:getTime()
			dealData.timeout = 0xffffffff
		end
		self._deals[player:getName()] = dealData
		self:sendGetBuyToken(player, dealData)
	end;
	
	returnRes = function(self, player, deal)
		self:_returnRes(player, deal)
	end;
	
	cancelDeal = function(self, player)
		if player == nil then
			return
		end
		
		local userName = player:getName()
		local deal = self:getDeal(userName)
		if deal == nil then
			return 
		end
		
		self:_returnRes(player, deal)
		self._deals[userName] = nil
	end;
	
	getDeal = function(self, userName)
		local deal = self._deals[userName]
		if deal == nil then
			return nil
		end
		
		if Util:getTime() - deal.stamp > deal.timeout then
			LOG('<deal>timeout, user:' .. userName .. ', dealpkg:' .. toJIONString(deal) )
			local player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, userName)
			self:_returnRes(player, deal)
			self._deals[userName] = nil
			return nil
		end
		
		return deal
	end;
	
	resetDealTime = function(self, userName, timeout)
		local deal = self:getDeal(userName)
		if deal == nil then
			return
		end
		
		deal.stamp = Util:getTime()
		deal.timeout = timeout
	end;
	
	clearDeal = function(self, userName)
		self._deals[userName] = nil
	end;
	
	_returnRes = function(self, player, deal)
		if deal == nil then
			return
		end
		
		if GoldIdHelper:isGoldId(deal.resid) then
			return 
		end
		
		if g_use_self_gold then
			return
		end
		
		local totalGold = player:getPkg():discountWhenYellowDiamond(deal.price)*deal.number
		player:getPkg():addGold(totalGold)
	end;
	
	setSendMsgFlag = function(self, flag)
		self._canSendMsg = flag
	end;
	
	sendQueryGold = function(self, player)
		if g_use_self_gold then
			return
		end
		
		if not self._canSendMsg then
			return
		end
		
		local msg = '{"cmd":' .. SVR_CMD_QueryGold .. ',"params":{'
		msg = msg .. '"openid":"' .. player:getPlatForm().openid .. '"'
		msg = msg .. ',"openkey":"' .. player:getPlatForm().openkey .. '"'
		msg = msg .. ',"appid":"' .. player:getPlatForm().appid .. '"'
		msg = msg .. ',"pf":"' .. player:getPlatForm().pf .. '"'
		msg = msg .. ',"pfkey":"' .. player:getPlatForm().pfkey .. '"'
		msg = msg .. ',"ts":"' .. os.time() .. '"'
		msg = msg .. ',"zoneid":"' .. res_svr_mics_cfg.payZoneId .. '"'
		msg = msg .. '}}#'
		ProxyServerC:sendMsg(msg)
	end;
	
	sendGetBuyToken = function(self, player, dealData)
		if not self._canSendMsg then
			return
		end
		
		local msg = '{"cmd":' .. SVR_CMD_GetBuyToken .. ',"params":{'
		msg = msg .. '"openid":"' .. player:getPlatForm().openid .. '"'
		msg = msg .. ',"openkey":"' .. player:getPlatForm().openkey .. '"'
		msg = msg .. ',"appid":"' .. player:getPlatForm().appid .. '"'
		msg = msg .. ',"pf":"' .. player:getPlatForm().pf .. '"'
		msg = msg .. ',"pfkey":"' .. player:getPlatForm().pfkey .. '"'
		--msg = msg .. ',"amt":"' .. (dealData.price*dealData.number)  .. '"'		
		--msg = msg .. ',"amttype":"coin"'
		msg = msg .. ',"ts":"' .. os.time() .. '"'
		msg = msg .. ',"payitem":"' .. dealData.resid .. '*' .. dealData.price .. '*' .. dealData.number .. '"'
		local res = ItemResUtil:findItemres( dealData.resid)
		local name = res.name or 'name'
		local desc = res.desc or 'desc'
		local icon = res.bigpic or 1
		msg = msg .. ',"goodsmeta":"' .. name .. '*' .. desc .. '"'
		local url = 'http://1251007151.cdn.myqcloud.com/1251007151/images/office/item/big/' .. icon .. '.gif'
		msg = msg .. ',"goodsurl":"' .. url .. '"'
		msg = msg .. ',"zoneid":"' .. res_svr_mics_cfg.payZoneId .. '"'
		--msg = msg .. ',"paymode":"1"'
		msg = msg .. '}}#'
		ProxyServerC:sendMsg(msg)
	end;
	
	sendQueryUserExist = function(self, clientId, ret)
		if not self._canSendMsg then
			return
		end
		
		local msg = '{"cmd":' .. SVR_CMD_UserExistResult .. ',"clientid":' .. clientId .. ',"ret":' .. ret .. '}#'
		ProxyServerC:sendMsg(msg)
	end;
	
	send32wanImmPay = function(self, clientId, ret)
		if not self._canSendMsg then
			return
		end
		
		local msg = '{"cmd":' .. SVR_CMD_ImmPayResult .. ',"clientid":' .. clientId .. ',"ret":' .. ret .. '}#'
		ProxyServerC:sendMsg(msg)
	end;
	
	sendGmResult = function(self, clientId, t, ret, msg)
		if not self._canSendMsg then
			return
		end
		
		local msg = '{"cmd":' .. SVR_CMD_GMResult .. ',"clientid":' .. clientId .. ',"t":"' .. t .. '","ret":' .. ret .. ',"msg":"' .. msg .. '"}#'
		ProxyServerC:sendMsg(msg)
	end;
})

Service:register('ProxyServer', ProxyServer:new())

