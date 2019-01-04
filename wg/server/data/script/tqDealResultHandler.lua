--*******************************************************************************
DealResultHandler = Class:extends({
	init = function(self)
		self._buyGoldHdr = ShopBuyGoldHandler:new()
	end;
	
	onRequest = function(self, none, nevt, cmdtb)
		self:_initParams(cmdtb)
		if self._ret ~= 0 then
			self:_handleFail(cmdtb)
		else
			self:_handleSucc(cmdtb)
		end
	end;
	
	_initParams = function(self, cmdtb)
		self._ret = Util:getNumber(cmdtb, 'ret')
		self._userName = Util:getString(cmdtb, 'openid')
		self._token = Util:getString(cmdtb, 'token')
		self._resid = Util:getNumber(cmdtb, 'resid')
		self._price = Util:getNumber(cmdtb, 'price')
		self._number = Util:getNumber(cmdtb, 'number')
		self._deal = Service:getProxyServer():getDeal(self._userName)
		self._player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, self._userName)
	end;
	
	_handleFail = function(self)
		if self._player == nil then
			self:_log('<deal>player not exist, deal result error')
			return 
		end
		
		if self._deal == nil then
			WUtil:sendWarningMsgArgs(self._player, 100177, '')
			self:_log('<deal>timeout, deal result error')
			return 
		end
		
		if self._deal.token ~= self._token then
			WUtil:sendWarningMsgArgs(self._player, 100178, '')
			self:_log('<deal>token not fit, deal result error')
		else
			WUtil:sendWarningMsgArgs(self._player, 100176, '')
			self:_log('<deal>deal result error')
		end
		Service:getProxyServer():cancelDeal(self._player)	
	end;
	
	_handleSucc = function(self)
		if self._player == nil then
			self:_log('<deal>player not exist, deal result succ')
			return 
		end
		
		if GoldIdHelper:isGoldId(self._resid) then
			self:_doSuccBuyGold()
			return
		end
		
		if self._deal == nil then
			WUtil:sendWarningMsgArgs(self._player, 100177, '')
			self:_log('<deal>timeout, deal result succ')
			return 
		end
		
		if self._deal.token ~= self._token then
			WUtil:sendWarningMsgArgs(self._player, 100178, '')
			self:_log('<deal>token not fit, deal result succ')
			Service:getProxyServer():cancelDeal(self._player)	
			return
		end
		
		self:_doSucc()
	end;
	
	_log = function(self, tag)
		LOG(string.format(tag .. ': user=%s, resid=%d, price=%d, number=%d, token=%s',
			self._userName, self._resid, self._price, self._number, self._token ))
	end;
	
	_doSucc = function(self)
		Service:getProxyServer():returnRes(self._player, self._deal)
		local hdr = app:getCmdHandler(self._deal.cmdpkg.cmd)
		if hdr:onRequest(self._player, nil, self._deal.cmdpkg, true) then
			self:_log('<deal>deal result succ')
		else
			self:_log('<deal-error>deal result succ, but send item failed')
		end
		Service:getProxyServer():clearDeal(self._userName)
	end;
	
	_doSuccBuyGold = function(self)
		Service:getProxyServer():returnRes(self._player, self._deal)
		local cmd = {id=self._resid, number=self._number}
		if self._buyGoldHdr:handle(self._player, cmd, true) then
			self:_log('<deal>deal result succ')
		else
			self:_log('<deal-error>deal result succ, but send item failed')
		end
		Service:getProxyServer():clearDeal(self._userName)
	end;
})


