--*******************************************************************************
QueryUserExistHandler = Class:extends({
	onRequest = function(self, none, nevt, cmdtb)
		self:_initParams(cmdtb)
		
		local ret = -1
		if SPub:IsExistUserName(self._userName) then
			ret = 1
		end
		
		Service:getProxyServer():sendQueryUserExist(self._clientId, ret)
	end;
	
	_initParams = function(self, cmdtb)
		self._userName = Util:getString(cmdtb, 'openid')
		self._clientId = Util:getNumber(cmdtb, 'clientid')
	end;
})


