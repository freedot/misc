--*******************************************************************************
MyFile = Class:extends({
	init = function(self, filePath, mod)
		self._f = nil
	end;
	
	open = function(self, filePath, mod)
		self._f = io.open(filePath, mod)
	end;
	
	write = function(self, s)
		if not self:isValid() then
			return nil
		end
		return self._f:write(s)
	end;
	
	read = function(self)
		if not self:isValid() then
			return ''
		end
		return self._f:read()
	end;
	
	close = function(self)
		if self:isValid() then
			self._f:close()
			self._f = nil
		end
	end;
	
	isValid = function(self)
		return self._f ~= nil
	end;
})


SvrVarDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
		self._keyValCache = {}
	end;
	
	clearCache = function(self)
		self._keyValCache = {}
	end;
	
	-- @ varName -- 变量名
	-- @ return -- 返回两个值：变量对应值, 是否存在于数据库
	getValue = function(self, varName)
		if self._keyValCache[varName] ~= nil then
			return self._keyValCache[varName].var, self._keyValCache[varName].find
		end
		
		local dbRows = self._conn:query("SELECT var FROM svrvar WHERE name='" .. varName .. "';")
		if dbRows ~= nil and dbRows:getRowCount() == 1 then
			local dbRow = dbRows:getCurRow()
			self._keyValCache[varName] = {var=dbRow:getFieldVal('var'), find=true}
		else
			self._keyValCache[varName] = {var=0, find=false}
		end
		return self._keyValCache[varName].var, self._keyValCache[varName].find
	end;
	
	setValue = function(self, varName, value)
		local sql = ''
		local _, has = self:getValue(varName)
		if has then
			sql = "UPDATE svrvar SET var=" .. value .. " WHERE name='" .. varName .. "';"
		else
			sql = "INSERT INTO svrvar VALUES('" .. varName .. "', '" .. value .. "');"
		end
		self._keyValCache[varName] = {var=value, find=true}
		self._conn:exec(sql)
	end;
})

OpenSvrAct = Class:extends({
	init = function(self, gapp)
		self._timerCaller = TimerCaller:new(TIMER_ID.OPEN_SVR_ACT)
		self._timerCaller:register(TIMER_EVT.OPEN_SVR_ACT, Caller:new(0, self, self._onOpenSvrActTimer))
		self._hasHighHeroSpec = HasHighHeroSpec(5)
	end;
	
	start = function(self)
		if Service:getSvrVarDB():getValue('opensvract') == 1 then
			return
		end
		
		local elapse = ActTaskUtil:getOpenSvrActTime() - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.OPEN_SVR_ACT}, self._timerCaller)
	end;
	
	recordWhenHasFiveHighHero = function(self, player)
		if Service:getSvrVarDB():getValue('opensvract') == 1 then
			return
		end
		
		if self._hasHighHeroSpec:isSatisfiedBy(player) then
			local f = MyFile:new()
			f:open(self:_getHeroLogFilePath(), 'a')
			f:write(player:getRoleName() .. ',')
			f:close()
		end
	end;
	
	_getHeroLogFilePath = function(self)
		return global.getLogBasePath() .. '/' .. global.getSvrNameId() .. '_highfiveheros.log'
	end;
	
	_onOpenSvrActTimer = function(self, timer)
		timer:stop()
		Service:getSvrVarDB():setValue('opensvract', 1)
		
		self:_sendActTowerRankGift();
		self:_sendRoleRankGift();
		self:_sendAllianceRankGift();
		self:_sendHasFiveHighHerosGift();
	end;
	
	_sendActTowerRankGift = function(self)
		local lowrank = res_opensvract_tower[table.getn(res_opensvract_tower)].lowrank
		local ranks = app:getActTowerRank():selectRanks(1, lowrank)
		self:_sendOpenSvrActRankGift(res_opensvract_tower, ranks, false)
	end;		
	
	_sendRoleRankGift = function(self)
		local lowrank = res_opensvract_tower[table.getn(res_opensvract_role)].lowrank
		local ranks = app:getRoleRank():selectRanks(1, lowrank)
		self:_sendOpenSvrActRankGift(res_opensvract_role, ranks, false)
	end;	
	
	_sendAllianceRankGift = function(self)
		local rankss = AllianceCollector():collect(10)
		self:_sendOpenSvrActRankGift(res_opensvract_alli, rankss, true)
	end;
	
	_sendHasFiveHighHerosGift = function(self)
		local roles = self:_loadHasFiveHighHerosRoles()
		self:_sendOpenSvrActRankGift(res_opensvract_hero, roles, false)
	end;
	
	_loadHasFiveHighHerosRoles = function(self)
		local f = MyFile:new()
		f:open(self:_getHeroLogFilePath(), 'r')
		local s = f:read()
		f:close()
		
		local lists = string.split(s, ',')
		local dicts = {}
		for _, roleName in ipairs(lists) do
			dicts[roleName] = 1
		end
		
		local roles = {}
		for roleName, _ in pairs(dicts) do
			table.insert(roles, {roleName=roleName} )
		end
			
		return roles
	end;
	
	_sendOpenSvrActRankGift = function(self, opensvractRes, ranks, isGroupRank)
		for _, rowRes in ipairs(opensvractRes) do
			local isBreak = false
			for rankIdx=rowRes.highrank, rowRes.lowrank do
				local rank = ranks[rankIdx]
				if rank == nil then 
					isBreak = true
					break 
				end
				
				if isGroupRank then
					self:_sendGroupMails(rowRes, rank) -- this rank has many roles, like {{roleName='role1'}, {roleName='role2'}}
				else
					self:_sendMail(rowRes, rank.roleName)
				end
			end
			
			if isBreak then break end
		end	
	end;
	
	_sendGroupMails = function(self, rowRes, rankGroup)
		for _, rank in ipairs(rankGroup) do
			self:_sendMail(rowRes, rank.roleName)
		end
	end;
	
	_sendMail = function(self, rowRes, roleName)
		local dropRawItems = {RawItemEx({id=1, resId=rowRes.itemid, number=rowRes.itemnumber})}
		local mail = app:getMailMgr():addSysMail(roleName, rowRes.mailtitle, FIXID.COMM_SYS_MAILTEMP, rowRes.mailcon, dropRawItems)
		local target = app:getPlayerMgr():getOnlinePlayerByRoleName(roleName)
		if target ~= nil then 
			MailSender:sendBriefMail(target, mail)
		end
	end;
})


