--*******************************************************************************
GetBuyTokenHandler = Class:extends({
	onRequest = function(self, none, nevt, cmdtb)
		self:_initParams(cmdtb)
		if self._ret ~= 0 then
			self:_handleFail()
		else
			self:_handleSucc()
		end
	end;
	
	_initParams = function(self, cmdtb)
		self._ret = Util:getNumber(cmdtb, 'ret')
		self._userName = Util:getString(cmdtb, 'openid')
		self._msg = Util:getString(cmdtb, 'msg')
		self._url_params = Util:getString(cmdtb, 'url_params')
		self._token = Util:getString(cmdtb, 'token')
		self._deal = Service:getProxyServer():getDeal(self._userName)
		self._player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, self._userName)
	end;
	
	_handleFail = function(self, cmdtb)
		if self._player == nil then
			LOG(string.format('<deal>player not exist, get token error: user=%s, ret=%d, msg=%s',
				self._userName, self._ret, self._msg ))
			return 
		end
		
		if self._deal == nil then
			WUtil:sendWarningMsgArgs(self._player, 100177, '')
			LOG(string.format('<deal>timeout, get token error: user=%s, ret=%d, msg=%s',
				self._userName, self._ret, self._msg ))
			return
		end
		
		WUtil:sendWarningMsgArgs(self._player, 100176, '')
		LOG(string.format('<deal>get token error: user=%s, resid=%d, price=%d, number=%d, ret=%d, msg=%s',
			self._userName, self._deal.resid, self._deal.price, self._deal.number, self._ret, self._msg ))
		Service:getProxyServer():cancelDeal(self._player)
	end;
	
	_handleSucc = function(self, cmdtb)
		if self._player == nil then
			LOG(string.format('<deal>player not exist, get token succ: user=%s, url_params=%s, token=%s',
				self._userName, self._url_params, self._token ))
			return
		end
		
		if self._deal == nil then
			WUtil:sendWarningMsgArgs(self._player, 100177, '')
			LOG(string.format('<deal>timeout, get token succ: user=%s, url_params=%s, token=%s',
				self._userName, self._url_params, self._token ))
			return
		end
		
		self._deal.url_params = self._url_params
		self._deal.token = self._token
		LOG(string.format('<deal>get token succ: user=%s, resid=%d, price=%d, number=%d, url_params=%s, token=%s',
			self._userName, self._deal.resid, self._deal.price, self._deal.number, self._deal.url_params, self._deal.token))
		DealByGoldSender:sendStartBuy(self._player, self._deal.url_params)
	end;
})


