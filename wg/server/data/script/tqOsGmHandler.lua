--*******************************************************************************
RolesDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
	end;
	
	getAllRoleNames = function(self, outs)
		self:_getAllOneFields('rname', outs)
	end;
	
	getAllUserName = function(self, outs)
		self:_getAllOneFields('uname', outs)
	end;
	
	_getAllOneFields = function(self, fieldName, outs)
		local dbRows = self._conn:query("SELECT " .. fieldName .. " FROM roles;")
		if dbRows == nil then return false end
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			table.insert(outs, dbRow:getFieldVal(fieldName))			
			dbRows:nextRow()
		end
	end;
})

SendMailToAllRoles = Class:extends({
	init = function(self, gmHandler)
		self._gmHandler = GMHandler()
		self._run = false
		self._gmcmd = nil
		self._roleNames = {}
		self._pos = 1
		self._oneTimes = 60
		self._mapper = nil
		self._updateCaller = Caller:new(TIMER_ID.SEND_ALL_MAILS, self, self._onTimer)
	end;
	
	start = function(self, gmcmd)
		self._run = true
		self._pos = 1
		self._gmcmd = gmcmd
		self:_delayCreateDBMapper()
		self._roleNames = {}
		self._mapper:getAllRoleNames(self._roleNames)
		global.getTimer():start(1*1000, {TIMER_EVT.SEND_ALL_MAILS}, self._updateCaller)
	end;
	
	isIdle = function(self)
		return not self._run 
	end;
	
	_onTimer = function(self, timer)
		local from = self._pos
		local to = math.min(from+self._oneTimes, table.getn(self._roleNames))
		for i = from, to do
			self._gmcmd['p1'] = self._roleNames[i]
			self._gmHandler:onOSRequest(nil, nil, self._gmcmd)
		end
		self._pos = to + 1
		if self._pos > table.getn(self._roleNames) then
			self._run = false
			timer:stop()
		end
	end;
	
	_delayCreateDBMapper = function(self)
		if self._mapper == nil then
			self._mapper = RolesDB(app)
		end
	end;
})

OsGmHandler = Class:extends({
	init = function(self)
		self._gmHandler = GMHandler()
		self._sendAllMails = SendMailToAllRoles(self._gmHandler)
	end;
	
	onRequest = function(self, none, netevt, cmdtb)
		self:_initParams(cmdtb)
		local ps = string.split(self._gmmsg, ' ');
		if table.getn(ps) == 0 then
			Service:getProxyServer():sendGmResult(self._clientId, self._t, -1, 'error')
			return
		end
		
		local gmcmd = {}
		gmcmd['name'] = ps[1]  -- function name
		for i=2, table.getn(ps) do
			gmcmd['p' .. (i-1)] = ps[i]:gsub('&jh;', '#')
		end
		
		if gmcmd['name'] == 'send_other_mail' and gmcmd['p4'] ~= nil then
			LOGEX('OS', '<senditem>role:' .. gmcmd['p1'] .. ',item:' .. gmcmd['p4'] )
		end
		
		if gmcmd['name'] == 'send_other_mail'  and gmcmd['p1'] == '*' then
			if self._sendAllMails:isIdle() then
				self._sendAllMails:start(gmcmd)
				Service:getProxyServer():sendGmResult(self._clientId, self._t, 0, '开始发送...')
			else 
				Service:getProxyServer():sendGmResult(self._clientId, self._t, -1, '忙碌状态，稍后再试！')
			end
			return
		end		
		
		local ret, msg = self._gmHandler:onOSRequest(nil, nil, gmcmd)
		Service:getProxyServer():sendGmResult(self._clientId, self._t, ret, msg)
	end;
	
	_initParams = function(self, cmdtb)
		self._t = Util:getString(cmdtb, 't')
		self._clientId = Util:getNumber(cmdtb, 'clientid')
		self._gmmsg = Util:getString(cmdtb, 'gmmsg')
	end;
})


