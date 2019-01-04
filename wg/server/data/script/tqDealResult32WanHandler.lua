--*******************************************************************************
Wan32OrderDB = Class:extends({
	init = function(self, gapp)
		self._gapp = gapp
		self._conn = self._gapp:getDBConn()
	end;
	
	has = function(self, orderno)
		local dbRows = self._conn:query(string.format("SELECT orderno FROM wan32order WHERE orderno='%s';", orderno))
		if dbRows == nil then return false end
		return dbRows:getRowCount() == 1
	end;
	
	insert = function(self, orderno, rname, gold)
		local s = string.format("INSERT INTO wan32order VALUES('%s', '%s', '%d');", orderno, rname, gold)
		self._conn:exec(s)
	end;
})

DealResult32WanHandler = Class:extends({
	init = function(self, gapp)
		self._mapper = nil
	end;
	
	onRequest = function(self, none, nevt, cmdtb)
		self:_initParams(cmdtb)
		
		self:_delayCreateMapper()
		local ret = -2
		if self._mapper:has(self._orderno) then
			ret = -5
		else
			local player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, self._userName)
			if player ~= nil then
				ret = 1
				player:getPkg():addGold(self._addgold)
				player:getTask():getPayAct():addGold(self._addgold)
				player:checkUpgradeVipLevel()
				PayGoldSender:sendPayGold(player)
				TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FIRST_RECHARGE)
				self._mapper:insert(self._orderno, player:getRoleName(), self._addgold)
				LOGEX('DEAL_32WAN', '<wan32addgold> user:[' .. player:getName() .. '], role:[' .. player:getRoleName() .. '], orderno:' .. self._orderno .. ', addgold:' .. self._addgold  )
			end
		end
		
		Service:getProxyServer():send32wanImmPay(self._clientId, ret)
	end;
	
	_initParams = function(self, cmdtb)
		self._userName = Util:getString(cmdtb, 'openid')
		self._clientId = Util:getNumber(cmdtb, 'clientid')
		self._addgold = Util:getNumber(cmdtb, 'addgold')
		self._orderno = Util:getString(cmdtb, 'orderno')
	end;
	
	_delayCreateMapper = function(self)
		if self._mapper == nil then
			self._mapper = Wan32OrderDB(app)
		end
	end;
})


