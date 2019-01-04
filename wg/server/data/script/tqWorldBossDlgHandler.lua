--*******************************************************************************
GmDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
	end;
	
	getFlag = function(self, userName)
		local dbRows = self._conn:query("SELECT flag FROM gms WHERE name='" .. userName .. "';")
		if dbRows == nil or dbRows:getRowCount() ~= 1 then
			return 0
		end
		local dbRow = dbRows:getCurRow()
		return dbRow:getFieldVal('flag')
	end;
})

RankRefreshDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
		self._refreshTimeCache = {}
		self._sortTimeCache = {}
		self._sortTimesCache = {}
	end;
	
	clear =  function(self)
		self._refreshTimeCache = {}
		self._sortTimeCache = {}
		self._sortTimesCache = {}
	end;
	
	getSortTime = function(self, name)
		return self:_getFieldVal(name, self._sortTimeCache, 'sortTime')
	end;
	
	updateSortTime = function(self, name)
		self:_updateTime(name, self._sortTimeCache, 'sortTime', Util:getTime(), Util:getTime())
		self:_addTimes(name)
	end;	
	
	getRefreshTime = function(self, name)
		return self:_getFieldVal(name, self._refreshTimeCache, 'refreshTime')
	end;
	
	updateRefreshTime = function(self, name)
		self:_updateTime(name, self._refreshTimeCache, 'refreshTime', Util:getTime(), 0)
	end;
	
	getSortTimes = function(self, name)
		return self:_getFieldVal(name, self._sortTimesCache, 'sortTimes')
	end;
	
	_getFieldVal = function(self, name, cahce, fieldName)
		if cahce[name] ~= nil then
			return cahce[name]
		end
		
		local dbRows = self._conn:query("SELECT " .. fieldName .. " FROM rankrefresh WHERE name='" .. name .. "';")
		if dbRows == nil or dbRows:getRowCount() ~= 1 then
			return 0
		end
		local dbRow = dbRows:getCurRow()
		local time = dbRow:getFieldVal(fieldName)
		cahce[name] = time
		return time	
	end;
	
	_updateTime = function(self, name, cahce, fieldName, refreshTime, sortTime)
		local sql = ''
		local dbRows = self._conn:query("SELECT " .. fieldName .. " FROM rankrefresh WHERE name='" .. name .. "';")
		if dbRows == nil or dbRows:getRowCount() ~= 1 then
			sql = "INSERT INTO rankrefresh VALUES('', '" .. name .. "', '" .. refreshTime .. "', '" .. sortTime .. "', '0');"
		else
			sql = "UPDATE rankrefresh SET " .. fieldName .. "=" .. Util:getTime() .. " WHERE name='" .. name .. "';"
		end
		self._conn:exec( sql )
		cahce[name] = Util:getTime()	
	end;
	
	_addTimes = function(self, name)
		local times = self:getSortTimes(name) +1
		sql = "UPDATE rankrefresh SET sortTimes=" .. times .. " WHERE name='" .. name .. "';"
		self._conn:exec( sql )
		self._sortTimesCache[name] = times
	end;
})

RoleRankDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
		self._fieldsName = {
			'roleid', 'roleName', 'lastWorldBossHurt', 'curWorldBossHurt', 'worldBossRank'
		}
	end;
	
	addRoleBossHurt = function(self, player, hurt)
		local dbRows = self._conn:query("SELECT curWorldBossHurt FROM rolerank WHERE roleid=" .. player:getRoleId() .. ";")
		if dbRows == nil or dbRows:getRowCount() ~= 1 then
			self._conn:exec( self:_makeInsertSql(player, {curWorldBossHurt=hurt}) )
		else
			local dbRow = dbRows:getCurRow()
			local curWorldBossHurt = dbRow:getFieldVal('curWorldBossHurt')
			if hurt > curWorldBossHurt then -- just record max hurt val in today
				sql = "UPDATE rolerank SET curWorldBossHurt=" .. hurt .. " WHERE roleid=" .. player:getRoleId() .. ";"
				self._conn:exec( sql )
			end
		end
	end;
	
	sortWorldBossRank = function(self)
		self:_clearWorldBossRank()
		local ranks = self:_worldBossRank('curWorldBossHurt', 'WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC')
		for rankId, rank in ipairs(ranks) do
			local sql = "update rolerank set lastWorldBossHurt=" .. rank.hurt .. ",curWorldBossHurt=0, worldBossRank=" .. rankId .. " where roleid=" .. rank.id .. ";"
			self._conn:exec(sql)
		end
		return ranks
	end;
	
	lastWorldBossRank = function(self)
		return self:_worldBossRank('lastWorldBossHurt', 'WHERE worldBossRank>0 ORDER BY worldBossRank')
	end;
	
	_worldBossRank = function(self, fieldName, cond)
		local ranks = {}
		local dbRows = self._conn:query("SELECT roleid, roleName, " .. fieldName .. " FROM rolerank " .. cond .. ";")
		if dbRows == nil then 
			return ranks
		end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local roleid = dbRow:getFieldVal('roleid')
			local roleName = dbRow:getFieldVal('roleName')
			local hurt = dbRow:getFieldVal(fieldName)
			
			local rank = {id=roleid, name=roleName, hurt=hurt}
			table.insert(ranks, rank)

			dbRows:nextRow()
		end		
		return ranks
	end;	
	
	_makeInsertSql = function(self, player, fields)
		local s = ""
		for _, fieldName in ipairs(self._fieldsName) do
			if s ~= '' then s = s .. ',' end
			
			if fieldName == "roleid" then
				s = s .. "'" .. player:getRoleId() .. "'"
			elseif fieldName == "roleName" then
				s = s .. "'" .. player:getRoleName() .. "'"
			elseif fields[fieldName] ~= nil then
				s = s .. "'" .. fields[fieldName] .. "'"
			else
				s = s .. "'0'"
			end
		end
		
		return "INSERT INTO rolerank VALUES(" .. s .. ");"
	end;
	
	_clearWorldBossRank = function(self)
		local sql = "UPDATE rolerank SET worldBossRank=0 WHERE worldBossRank>0;"
		self._conn:exec(sql)
	end;
})

AllianceRankDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
		self._fieldsName = {
			'alliid', 'alliName', 'lastWorldBossHurt', 'curWorldBossHurt', 'worldBossRank'
		}
	end;
	
	addWorldBossHurt = function(self, player, hurt)
		local sql = ''
		local dbRows = self._conn:query("SELECT curWorldBossHurt FROM allirank WHERE alliid=" .. player:getAlliId() .. ";")
		if dbRows == nil or dbRows:getRowCount() ~= 1 then
			sql = self:_makeInsertSql(player, {curWorldBossHurt=hurt})
		else
			local dbRow = dbRows:getCurRow()
			local curWorldBossHurt = dbRow:getFieldVal('curWorldBossHurt') + hurt
			sql = "UPDATE allirank SET curWorldBossHurt=" .. curWorldBossHurt .. " WHERE alliid=" .. player:getAlliId() .. ";"
		end
		self._conn:exec(sql)
	end;
	
	sortWorldBossRank = function(self)
		self:_clearWorldBossRank()

		local ranks = self:_worldBossRank('curWorldBossHurt', 'WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC')
		for rankId, rank in ipairs(ranks) do
			local sql = "update allirank set lastWorldBossHurt=" .. rank.hurt .. ",curWorldBossHurt=0, worldBossRank=" .. rankId .. " where alliid=" .. rank.id .. ";"
			self._conn:exec(sql)
		end	
		
		return ranks	
	end;
	
	lastWorldBossRank = function(self)
		return self:_worldBossRank('lastWorldBossHurt', 'WHERE worldBossRank>0 ORDER BY worldBossRank')
	end;
	
	sortRank = function(self)
		local ranks = self:_rank( 'ORDER BY level DESC, honour DESC' )
		for rankId, rank in ipairs(ranks) do
			rank.lastLevel = rank.level
			rank.lastHonour = rank.honour
			rank.rank = rankId
			local sql = "update alliances set lastLevel=" .. rank.level .. ",lastHonour=" .. rank.honour .. ",rank=" .. rankId .. " where allianceId=" .. rank.id .. ";"
			self._conn:exec(sql)
		end
		return ranks
	end;
	
	lastRank = function(self)
		return self:_rank('ORDER BY rank')
	end;
	
	makeRank = function(self, alliance)
		local allianceId = alliance:getId()
		local name = alliance:getName()
		local level = alliance:getLevel()
		local honour = alliance:getHonour()
		local lastLevel = level
		local lastHonour = honour
		return {id=allianceId, name=name, level=level, honour=honour, lastLevel=lastLevel, lastHonour=lastHonour, rank=100000 }
	end;
	
	_worldBossRank = function(self, fieldName, cond)
		local ranks = {}
		local dbRows = self._conn:query("SELECT alliid, alliName, " .. fieldName .. " FROM allirank " .. cond .. ";")
		if dbRows == nil then 
			return ranks
		end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local alliid = dbRow:getFieldVal('alliid')
			local alliName = dbRow:getFieldVal('alliName')
			local hurt = dbRow:getFieldVal(fieldName)
			
			local rank = {id=alliid, name=alliName, hurt=hurt}
			table.insert(ranks, rank)

			dbRows:nextRow()
		end		
		return ranks
	end;	
	
	_makeInsertSql = function(self, player, fields)
		local alliance = self._app:getAlliMgr():getAlliById(player:getAlliId())
		local s = ""
		for _, fieldName in ipairs(self._fieldsName) do
			if s ~= '' then s = s .. ',' end
			
			if fieldName == "alliid" then
				s = s .. "'" .. alliance:getId() .. "'"
			elseif fieldName == "alliName" then
				s = s .. "'" .. alliance:getName() .. "'"
			elseif fields[fieldName] ~= nil then
				s = s .. "'" .. fields[fieldName] .. "'"
			else
				s = s .. "'0'"
			end
		end
		
		return "INSERT INTO allirank VALUES(" .. s .. ");"
	end;
	
	_clearWorldBossRank = function(self)
		local sql = "UPDATE allirank SET worldBossRank=0 WHERE worldBossRank>0;"
		self._conn:exec(sql)
	end;	
	
	_rank = function(self, cond)
		local ranks = {}
		local dbRows = self._conn:query("SELECT allianceId, name, level, honour, lastLevel, lastHonour, rank FROM alliances " .. cond .. ";")
		if dbRows == nil then 
			return ranks
		end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local allianceId = dbRow:getFieldVal('allianceId')
			local name = dbRow:getFieldVal('name')
			local level = dbRow:getFieldVal('level')
			local honour = dbRow:getFieldVal('honour')
			local lastLevel = dbRow:getFieldVal('lastLevel')
			local lastHonour = dbRow:getFieldVal('lastHonour')
			local arank = dbRow:getFieldVal('rank')

			local rank = {id=allianceId, name=name, level=level, honour=honour, lastLevel=lastLevel, lastHonour=lastHonour, rank=arank }
			table.insert(ranks, rank)

			dbRows:nextRow()
		end		
		return ranks
	end;	
})

CountryRankDB = Class:extends({
	init = function(self, gapp)
		self._app = gapp
		self._conn = self._app:getDBConn()
		self._isSorted = false
	end;
	
	addWorldBossHurt = function(self, player, hurt)
		local sql = ''
		local dbRows = self._conn:query("SELECT curWorldBossHurt FROM countryrank WHERE id=" .. player:getCityId() .. ";")
		if dbRows ~= nil and dbRows:getRowCount() == 1 then
			local dbRow = dbRows:getCurRow()
			local curWorldBossHurt = dbRow:getFieldVal('curWorldBossHurt') + hurt
			sql = "UPDATE countryrank SET curWorldBossHurt=" .. curWorldBossHurt .. " WHERE id=" .. player:getCityId() .. ";"
			self._conn:exec(sql)
		end
	end;
	
	sortWorldBossRank = function(self)
		self._isSorted = false
		self:_resetHitWorldBossTimes()
		if os.date("*t", Util:getTime()).wday == 1 then -- 星期日
		--if os.date("*t", Util.getTime()).wday == 5 then -- 星期日
			self:_sortWorldBossRank()
			self._isSorted = true
		end
		return self:_lastWorldBossRank()
	end;
	
	isSorted = function(self)
		return self._isSorted
	end;
	
	lastWorldBossRank = function(self)
		return self:_lastWorldBossRank()
	end;
	
	_resetHitWorldBossTimes = function(self)
		local ranks = self:_worldBossRank({"curWorldBossHurt", "weekWorldBossHurt", "curWorldBossHurtTimes"}, "curWorldBossHurtTimes", "WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC")
		for rankId, rank in ipairs(ranks) do
			if rankId == 1 then -- add times
				local sql = "UPDATE countryrank SET curWorldBossHurtTimes=" .. (rank.times+1) .. " WHERE id=" .. rank.id .. ";"
				self._conn:exec(sql)
			end
		
			local sql = "UPDATE countryrank SET curWorldBossHurt=0, weekWorldBossHurt=" .. (rank.weekWorldBossHurt + rank.curWorldBossHurt) .. " WHERE id=" .. rank.id .. ";"
			self._conn:exec(sql)
		end
	end;
	
	_sortWorldBossRank = function(self)
		local ranks = self:_worldBossRank({"curWorldBossHurtTimes"}, "curWorldBossHurtTimes", "ORDER BY curWorldBossHurtTimes DESC, weekWorldBossHurt DESC")
		for rankId, rank in ipairs(ranks) do
			if rank.times == 0 then
				rankId = 0
			end			
			local sql = "UPDATE countryrank SET lastWorldBossHurtTimes=" .. rank.times .. ", curWorldBossHurtTimes=0, weekWorldBossHurt=0, worldBossRank=" .. rankId .. " where id=" .. rank.id .. ";"
			self._conn:exec(sql)
		end		
	end;
	
	_lastWorldBossRank = function(self)
		return self:_worldBossRank({"lastWorldBossHurtTimes"}, "lastWorldBossHurtTimes", "WHERE worldBossRank>0 ORDER BY worldBossRank")
	end;
	
	_worldBossRank = function(self, fieldNames, timesFieldName, cond)
		local ranks = {}
		
		local sfields = ''
		for _, fieldName in ipairs(fieldNames) do
			sfields = sfields .. ', '
			sfields = sfields .. fieldName
		end
		
		local dbRows = self._conn:query("SELECT id, country" .. sfields .. " FROM countryrank " .. cond .. ";")
		if dbRows == nil then 
			return ranks
		end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local id = dbRow:getFieldVal('id')
			local country = dbRow:getFieldVal('country')
			local times = dbRow:getFieldVal(timesFieldName)
			
			local rank = {id=id, name=country, times=times}
			for _, fieldName in ipairs(fieldNames) do
				if fieldName ~= timesFieldName then
					rank[fieldName] = dbRow:getFieldVal(fieldName)
				end
			end
			
			table.insert(ranks, rank)

			dbRows:nextRow()
		end		
		return ranks
	end;	
})

BaseRankSorter = Class:extends({
	init = function(self)
		self._ranks = {}
	end;
	
	sort = function(self)
	end;
	
	loadLast = function(self)
	end;
	
	getCount = function(self)
		return math.min(table.getn(self._ranks), self:_getLimitCount())
	end;
	
	get = function(self, idx) -- idx from 0 - n-1
		return self._ranks[idx+1]
	end;
	
	getIdxByName = function(self, name)
		local count = self:getCount()
		for i=1, count, 1 do
			local rank = self._ranks[i]
			if rank.name == name then
				return i-1
			end
		end
		return -1
	end;
	
	clearRanks = function(self)
		self._ranks = {}
	end;
	
	addRank = function(self, rank)
		table.insert(self._ranks, rank)
	end;
})

RoleWorldBossRankSorter = BaseRankSorter:extends({
	sort = function(self)
		self._ranks = Service:getRoleRankDB():sortWorldBossRank()
		return RET_RANK_SORTER_SORT
	end;
	
	loadLast = function(self)
		self._ranks = Service:getRoleRankDB():lastWorldBossRank()
	end;
	
	_getLimitCount = function(self)
		return 20
	end;
})

AllianceWorldBossRankSorter = BaseRankSorter:extends({
	sort = function(self)
		self._ranks = Service:getAllianceRankDB():sortWorldBossRank()
		self:_clearLastDropItems()
		self:_dropItems()
		return RET_RANK_SORTER_SORT
	end;
	
	loadLast = function(self)
		self._ranks = Service:getAllianceRankDB():lastWorldBossRank()
	end;
	
	_clearLastDropItems = function(self)
		for _, rank in ipairs(self._ranks) do
			local alliance = app:getAlliMgr():getAlliById(rank.id)
			alliance:getItemPkg():clearLastItems()
		end
	end;
	
	_dropItems = function(self)
		local dropItem = DropItem()
		for rankIdx, res in ipairs(res_rank_allidrops) do
			local rank = self._ranks[rankIdx]
			if rank == nil then break end
			
			local alliance = app:getAlliMgr():getAlliById(rank.id)
			dropItem:handle(res.dropId)
			local items = dropItem:getDrops().items
			for _, item in ipairs(items) do
				local itemres = ItemResUtil:findItemres(item.resid)
				local nitem = {resid=item.resid, num=item.number, boss=1, sptime=Util:getTime()+23*3600, cur=item.number*itemres.startAuctionPrice, fixed=item.number*itemres.fixedAuctionPrice, buyer=''}
				alliance:getItemPkg():addItem(nitem)
				alliance:getItemPkg():addLastItem(nitem)
			end
		end
	end;
	
	_getLimitCount = function(self)
		return 9
	end;
})

AllianceRankSorter = BaseRankSorter:extends({
	sort = function(self)
		self._ranks = Service:getAllianceRankDB():sortRank()
		return RET_RANK_SORTER_SORT
	end;
	
	loadLast = function(self)
		self._ranks = Service:getAllianceRankDB():lastRank()
	end;
	
	_getLimitCount = function(self)
		return table.getn(self._ranks)
	end;
})

CountryWorldBossRankSorter = BaseRankSorter:extends({
	sort = function(self)
		self._ranks = Service:getCountryRankDB():sortWorldBossRank()
		if Service:getCountryRankDB():isSorted() then
			return RET_RANK_SORTER_SORT
		else
			return RET_RANK_SORTER_REFRESH
		end
	end;
	
	loadLast = function(self)
		self._ranks = Service:getCountryRankDB():lastWorldBossRank()
	end;
	
	_getLimitCount = function(self)
		return 3
	end;
})			

RoleWorldBossRank = RankTemplet:extends({
	getRankName = function(self)
		return 'roleWorldBoss'
	end;
	
	_getTimerId = function(self)
		return TIMER_ID.ROLEWORLDBOSS_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.ROLEWORLDBOSS_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=20, sec=0}
	end;
})

AllianceWorldBossRank = RankTemplet:extends({
	getRankName = function(self)
		return 'allianceWorldBoss'
	end;
	
	_getTimerId = function(self)
		return TIMER_ID.ALLIANCEWORLDBOSS_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.ALLIANCEWORLDBOSS_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=25, sec=0}
	end;
})

AllianceRank = RankTemplet:extends({
	getRankName = function(self)
		return 'alliance'
	end;
	
	_getTimerId = function(self)
		return TIMER_ID.ALLIANCE_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.ALLIANCE_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=5, sec=0}
	end;
})

CountryWorldBossRank = RankTemplet:extends({
	getRankName = function(self)
		return 'countryWorldBoss'
	end;
	
	_getTimerId = function(self)
		return TIMER_ID.COUNTRYWORLDBOSS_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.COUNTRYWORLDBOSS_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=30, sec=0}
	end;
})

--------------------
local TODAY_MAX_TIMES = 3
local GUWU_MAX_LEVEL = 10
AddItemToPkgHelper = Class:extends({
	addItems = function(self, player, items) 
		local rawItems = DropItem():createRawItems(items)
		if player:getPkg():addItems(rawItems) then
			return
		end
		
		local mail = app:getMailMgr():addSysMail(player:getRoleName(), rstr.mail.title.sendItemNoEnoughPkg, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.sendItemNoEnoughPkg, rawItems)
		MailSender:sendBriefMail(player, mail)
	end;
}):new()

WorldBossDlgHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = WorldBossGetInfoHandler()
		self.handlers[2] = ExpedWorldBossHandler()
		self.handlers[3] = WorldBossGetTodayGiftHandler()
		self.handlers[4] = WorldBossGuwuHandler()
		self.handlers[5] = GetWorldBossPersonRankGiftHandler()
		self.handlers[6] = GetWorldBossCountryRankGiftHandler()
		self.handlers[7] = WorldBossGetRankInfoHandler()
		self.handlers[8] = WorldBossGetAlliGiftInfoHandler()
	end;
})

WorldBossGetInfoHandler = Class:extends({
	handle = function(self, player, cmdtb)
		WorldBossSender:sendEvents(player)
		WorldBossSender:sendTodayInfo(player)
	end;
})

ActObjectWorldBossAdapter = Class:extends({
	getStopTime = function(self)
		return 0
	end;
	
	setStopTime = function(self, stopTime)
	end;
}):new()

ExpedWorldBossHandler = ActBaseExpedHdr:extends({
	_getActObject = function(self, player)
		return  ActObjectWorldBossAdapter
	end;
	
	_isHasLeftLife = function(self, player)
		return player:getTask():getWorldBoss():getTodayTimes() < TODAY_MAX_TIMES
	end;
	
	_getHeroActState = function(self)
		return HERO_STATE.ACT_WORLDBOSS
	end;
	
	_isArrivedMaxGate = function(self, actTower)
		return false
	end;
	
	_isValid = function(self, player)
		return player:getAlliId() > 0
	end;	
	
	_sendSimpleEnterMsg = function(self, player)
		-- not implemented
	end;
	
	_resetWhenArrivedMaxLayer = function(self, actTower)
		-- not implemented
	end;
	
	_expedSuccess = function(self, player)
		-- impossible enter here
		self:_expedFail(player)
	end;
	
	_expedFail = function(self, player)
		self:_addTodayTimes(player)
		Service:getRoleRankDB():addRoleBossHurt(player, self.fightResult_)
		Service:getAllianceRankDB():addWorldBossHurt(player, self.fightResult_)
		Service:getAllianceRankDB():addWorldBossHurt(player, self.fightResult_)
		Service:getCountryRankDB():addWorldBossHurt(player, self.fightResult_)
		app:getAlliMgr():addWorldBossTmpEvent(player:getRoleName(), self.fightResult_, Util:getTime())
	end;
	
	_getLastGateInfo = function(self, actTower)
		return nil
	end;
	
	_sendEnterMsg = function(self, player)
		WorldBossSender:sendEvents(player)
		WorldBossSender:sendTodayInfo(player)
		WorldBossSender:sendFightDemo(player, self.fightDemo_, self.fightResult_)
	end;
	
	_addTodayTimes = function(self, player)
		local times = player:getTask():getWorldBoss():getTodayTimes()
		player:getTask():getWorldBoss():setTodayTimes(times + 1)
	end;
})


WorldBossGetTodayGiftHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if player:getTask():getWorldBoss():getTodayTimes() < TODAY_MAX_TIMES then
			WUtil:sendWarningMsgArgs(player, 100188, '')
			return false
		end
		
		if player:getTask():getWorldBoss():getGotGift() == 1 then
			return false
		end
		
		local itemId = self:_getCanGetItemId(player)
		AddItemToPkgHelper:addItems(player, {{resid=itemId,number=1}})
		player:getTask():getWorldBoss():setGotGift(1)
		WorldBossSender:sendTodayInfo(player)
		
		return true		
	end;
	
	_getCanGetItemId = function(self, player)
		local guwuLevel = player:getTask():getWorldBoss():getGuwuLevel()
		return Util:find(res_worldboss_gift, 'guwuLevel', guwuLevel).itemId
	end;
})

WorldBossGuwuHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local t = Util:getNumber(cmdtb, 't')
		local times = Util:getNumber(cmdtb, 'times')
		if t < 0 or t > 1 then 
			return false 
		end
		
		if times < 1 or (times + player:getTask():getWorldBoss():getGuwuLevel()) > GUWU_MAX_LEVEL then
			return false
		end
		
		local goldExpend = self:_getGoldExpend(player, t)
		if times == 1 and not self:_addOneTimes(player, t, goldExpend) then
			return false
		elseif times > 1 then
			self:_addManyTimes(player, times, t, goldExpend)
		end
		
		WorldBossSender:sendTodayInfo(player)
		
		return true		
	end;
	
	_getGoldExpend = function(self, player, t)
		if t == 0 then
			return GoldExpend(player, {attr=ATTR.GOLD,val=40})
		else
			return PureGiftGoldExpend(player, {attr=ATTR.GIFTGOLD,val=40})
		end
	end;
	
	_getAddLevel = function(self, t) 
		if t == 0 then
			return 1
		else
			return math.random(0,1)
		end
	end;
	
	_addOneTimes = function(self, player, t, goldExpend)
		if not goldExpend:isEnough() then
			return false
		end
		
		goldExpend:sub()
		
		local level = player:getTask():getWorldBoss():getGuwuLevel()
		local addLevel = self:_getAddLevel(t)
		player:getTask():getWorldBoss():setGuwuLevel(level + addLevel)
		if addLevel == 1 then
			WUtil:sendSuccMsgArgs(player, 100189, '')
		else
			WUtil:sendWarningMsgArgs(player, 100190, '')
		end
		
		return true
	end;
	
	_addManyTimes = function(self, player, times, t, goldExpend)
		local msg = ''
		for i=1, times do
			if not goldExpend:isEnough() then
				msg = msg .. string.format(self:_getNoEnoughGoldStr(t), i) .. '<br/>'
				break 
			end
			
			goldExpend:sub()
			
			local level = player:getTask():getWorldBoss():getGuwuLevel()
			local addLevel = self:_getAddLevel(t)
			player:getTask():getWorldBoss():setGuwuLevel(level + addLevel)
			if addLevel == 1 then
				msg = msg .. string.format(rstr.worldboss.guwu.succ, i) .. '<br/>'
			else
				msg = msg .. string.format(rstr.worldboss.guwu.fail, i) .. '<br/>'
			end
		end
		WUtil:sendPopBoxMsg(player, msg)
	end;
	
	_getNoEnoughGoldStr = function(self, t)
		if t == 0 then
			return rstr.worldboss.guwu.nogold
		else
			return rstr.worldboss.guwu.nogiftgold
		end
	end;
})

GetWorldBossPersonRankGiftHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local rankIdx = Service:getRoleWorldBossRank():getIdxByName(player:getRoleName())
		if rankIdx < 0 then
			WUtil:sendWarningMsgArgs(player, 100191, '')
			return false
		end
		
		local sortTime = Service:getRankRefreshDB():getSortTime(Service:getRoleWorldBossRank():getRankName())
		if player:getTask():getWorldBoss():getPersonRankGiftTime() >= sortTime then
			WUtil:sendWarningMsgArgs(player, 100193, '')
			return false
		end
		
		player:getTask():getWorldBoss():setPersonRankGiftTime(Util:getTime())
		local item = self:_getCanGetItemRes(rankIdx)
		AddItemToPkgHelper:addItems(player, {{resid=item.itemid,number=item.itemnum}})
		
		WorldBossSender:sendTodayInfo(player)
		
		return true
	end;
	
	_getCanGetItemRes = function(self, rankIdx) 
		return res_rank_persiongifts[rankIdx+1]
	end;
})

GetWorldBossCountryRankGiftHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local countryName = country_names[player:getCityId()]
		local rankIdx = Service:getCountryWorldBossRank():getIdxByName(countryName)
		if rankIdx < 0 then
			WUtil:sendWarningMsgArgs(player, 100192, '')
			return false
		end
		
		local sortTime = Service:getRankRefreshDB():getSortTime(Service:getCountryWorldBossRank():getRankName())
		if player:getTask():getWorldBoss():getCountryRankGiftTime() >= sortTime then
			WUtil:sendWarningMsgArgs(player, 100193, '')
			return false
		end
		
		player:getTask():getWorldBoss():setCountryRankGiftTime(Util:getTime())
		
		local buffLevel = 3-rankIdx
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=3*24*3600, effect={id=RES_EFF.ZHANSHENZHIGUANG,val=buffLevel,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		player:getStateContainer():appendState(stateRes, creator)
		
		WorldBossSender:sendTodayInfo(player)
		WUtil:sendSuccMsg(player, string.format(rstr.zhanshenzhiguang, buffLevel))
		
		return true
	end;
})

WorldBossGetRankInfoHandler = Class:extends({
	handle = function(self, player)
		WorldBossSender:sendRanks(player)
		WorldBossSender:sendTodayInfo(player)
	end;
})

WorldBossGetAlliGiftInfoHandler = Class:extends({
	handle = function(self, player)
		local alliance = app:getAlliMgr():getAlliById(player:getAlliId())
		if alliance:isNull() then
			return false
		end
		
		WorldBossSender:sendGetAlliGiftInfo(player)
		
		return true
	end;
})




