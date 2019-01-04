SAVE_ALLIANCE_STEP = 100

AlliancesDB = Class:extends({
	init = function(self, gapp)
		self._conn = gapp:getDBConn()
		self._allFields = { 'allianceId',
			'leader',
			'cityResId',
		}
	end;
	
	getAllAlliances = function(self)
		local allis = {}
		local dbRows = self._conn:query("SELECT * FROM alliances;")
		if dbRows == nil then return allis end
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			local alli = {}
			for _, field in ipairs(self._allFields) do
				alli[field] = dbRow:getFieldVal(field)
			end
			table.insert(allis, alli)
			dbRows:nextRow()
		end
		return allis
	end;
	
	resetAlliCityResId = function(self, allianceId, cityResId)
		local sql = "update alliances set cityResId=" .. cityResId .. " where allianceId=" .. allianceId .. ";"
		self._conn:exec(sql)	
	end;
	
	getAllianceMembersByName = function(self, alliName)
		local dbRows = self._conn:query("SELECT member FROM alliances where name='" .. alliName .. "';")
		if dbRows == nil then return allis end
		if dbRows:getRowCount() ~= 1 then return {} end
		
		local memberids = {}
		local dbRow = dbRows:getCurRow()
		members = eval(dbRow:getFieldVal('member'))
		for _, m in ipairs(members) do
			table.insert(memberids, m.id)
		end
		return memberids
	end;
})

AllianceMember = Class:extends({
	init = function(self)
		self.id = 0 -- role id
		self.lastRes = {val=0, lastTime=0}
		self.lastCard = {val=0, lastTime=0}
		self.totalRes = 0
		self.totalCard = 0
		self.alliPos = 0
		self.contributes = 0
		self.gainGift = {count=0, lastTime=0}
		self.feed = {count=0, lastTime=0}
		self.fire = {count=0, lastTime=0}
	end;
	
	setId = function(self, id)
		self.id = id
	end;
	
	getId = function(self)
		return self.id
	end;
	
	setLastRes = function(self, lastRes)
		TodayTimes:set(self.lastRes, 'val', 'lastTime', lastRes.val, lastRes.lastTime)
	end;
	
	getTodayRes = function(self)
		return TodayTimes:get(self.lastRes, 'val', 'lastTime')
	end;
	
	setLastCard = function(self, lastCard)
		TodayTimes:set(self.lastCard, 'val', 'lastTime', lastCard.val, lastCard.lastTime)
	end;
	
	getTodayCard = function(self)
		return TodayTimes:get(self.lastCard, 'val', 'lastTime')
	end;
	
	setTotalRes = function(self, totalRes)
		self.totalRes = totalRes
	end;
	
	getTotalRes = function(self)
		return self.totalRes
	end;
	
	setTotalCard = function(self, totalCard)
		self.totalCard = totalCard
	end;
	
	getTotalCard = function(self)
		return self.totalCard
	end;
	
	setAlliPos = function(self, alliPos)
		self.alliPos = alliPos
	end;
	
	getAlliPos = function(self)
		return self.alliPos
	end;
	
	setContributes = function(self, contributes)
		self.contributes = contributes
	end;
	
	getContributes = function(self)
		return self.contributes
	end;
	
	getGainGift = function(self)
		return self.gainGift
	end;
	
	setGainGiftCount = function(self, gainGift)
		TodayTimes:set(self.gainGift, 'count', 'lastTime', gainGift.count, gainGift.lastTime)
	end;	
	
	getGainGiftCount = function(self)
		return TodayTimes:get(self.gainGift, 'count', 'lastTime')
	end;
	
	setFeedCount = function(self, feed)
		TodayTimes:set(self.feed, 'count', 'lastTime', feed.count, feed.lastTime)
	end;
	
	getFeedCount = function(self)
		return TodayTimes:get(self.feed, 'count', 'lastTime' )
	end;
	
	getFeed = function(self)
		return self.feed
	end;
	
	setLastFire = function(self, fire)
		self.fire.count = fire.count
		self.fire.lastTime = fire.lastTime
	end;
	
	isTodayFireFull = function(self)
		return self:_getTodayFireCount() >= 3 
	end;
	
	addTodayFireCount = function(self)
		TodayTimes:set(self.fire, 'count', 'lastTime', self:_getTodayFireCount() + 1, Util:getTime())
	end;	
	
	_getTodayFireCount = function(self)
		return TodayTimes:get(self.fire, 'count', 'lastTime')
	end;
	
	toString = function(self)
		local s = '{'
		s = s .. 'id=' .. self.id
		s = s .. ',lastRes={val=' .. self.lastRes.val .. ',lastTime=' .. self.lastRes.lastTime .. '}'
		s = s .. ',lastCard={val=' .. self.lastCard.val .. ',lastTime=' .. self.lastCard.lastTime .. '}'
		s = s .. ',totalRes=' .. self.totalRes
		s = s .. ',totalCard=' .. self.totalCard
		s = s .. ',alliPos=' .. self.alliPos
		s = s .. ',contributes=' .. self.contributes
		s = s .. ',gainGift={count=' .. self.gainGift.count .. ',lastTime=' .. self.gainGift.lastTime .. '}'
		s = s .. ',feed={count=' .. self.feed.count .. ',lastTime=' .. self.feed.lastTime .. '}'
		s = s .. ',fire={count=' .. self.fire.count .. ',lastTime=' .. self.fire.lastTime .. '}'
		s = s .. '}'
		return s
	end;
})

AllianceLawLight = Class:extends({
	init = function(self)
		self.level = 1
		self.val = 0
	end;
	
	setLevel = function(self, level)
		self.level = level
	end;
	
	getLevel = function(self)
		return self.level
	end;
	
	setGrowupVal = function(self, val)
		if val > self:_getRes().maxgrowupval then
			val = self:_getRes().maxgrowupval
		end
		self.val = val
	end;
	
	getGrowupVal = function(self)
		return self.val
	end;
	
	isFullLevel = function(self)
		return self:getLevel() == res_alli_lawlight_maxlevel
	end;
	
	isFullGrowupVal = function(self)
		return self:getGrowupVal() == self:_getRes().maxgrowupval
	end;
	
	getBestowDropId = function(self)
		return self:_getRes().bestowdropid
	end;
	
	getFeedDropId = function(self)
		return self:_getRes().feeddropid
	end;
	
	getFeedNeedContribute = function(self)
		return self:_getRes().feedneedcontributes
	end;
	
	getCanFeedMaxCount = function(self)
		return self:_getRes().maxfeedtimes
	end;
	
	getUpgradeNeedBuildVal = function(self)
		return self:_getNextLevelRes().needbuildval
	end;
	
	getUpgradeNeedCard = function(self)
		return self:_getNextLevelRes().needcard
	end;
	
	toString = function(self)
		return '{level=' .. self.level .. ',val=' .. self.val .. '}'
	end;
	
	_getRes = function(self)
		return res_alli_lawlight_upd[ self:getLevel() ]
	end;	
	
	_getNextLevelRes = function(self)
		return res_alli_lawlight_upd[ self:getLevel() + 1]
	end;	
})

AllianceItemPkg = Class:extends({
	init = function(self)
		self.items = {}
		self.lastItems = {}
		self.maxItemId = 0
		self.alliId = 0
	end;
	
	setAllianceId = function(self, alliId)	
		self.alliId = alliId
	end;
	
	start = function(self)
		for _, item in ipairs(self.items) do
			self:_startItem(item)
		end
	end;
	
	addItem = function(self, item)
		local ritem = self:onlyAddItem(item)
		self:_startItem(item)
		return ritem
	end;
	
	onlyAddItem = function(self, item)
		if item.id == nil then
			item.id = self.maxItemId + 1
			self.maxItemId = self.maxItemId + 1
		elseif item.id > 0 then
			if self.maxItemId < item.id then
				self.maxItemId = item.id
			end
		end
		table.insert(self.items, item)
		return item
	end;
	
	_startItem = function(self, item)
		local elapse = item.sptime - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.ALLI_ITEM_TIMEOUT, self.alliId, item.id}, app:getAlliMgr():getTimerCaller())
	end;
	
	removeItemByIdx = function(self, idx) -- idx from 0 - n-1
		table.remove(self.items, idx+1)
	end;
	
	removeById = function(self, id)
		if Util:find(self.items, 'id', id) ~= nil then
			self:removeItemByIdx(Util:getLastFindIdx() - 1)
		end
	end;
	
	getItemByIdx = function(self, idx) -- idx from 0 - n-1
		return self.items[idx+1]
	end;
	
	getItemById = function(self, id)
		return Util:find(self.items, 'id', id)
	end;
	
	getItemCount = function(self)
		return table.getn(self.items)
	end;
	
	clearLastItems = function(self)
		self.lastItems = {}
	end;
	
	addLastItem = function(self, item)
		table.insert(self.lastItems, item)
	end;
	
	getLastItemCount = function(self)
		return table.getn(self.lastItems)
	end;
	
	getLastItemByIdx = function(self, idx) -- idx from 0 - n-1
		return self.lastItems[idx+1]
	end;
	
	itemTimeOut = function(self, itemId)
		local item = Util:find(self.items, 'id', itemId)
		if item == nil then return end
		
		if self:_hasBuyer(item) then
			self:_sendItemToBuyer(item)
		end
		
		if self:_hasSeller(item) and not self:_hasBuyer(item) then
			self:_returnItemToSeller(item)
		elseif self:_hasSeller(item) and self:_hasBuyer(item) then
			self:_gainContributesSellItemSucc(item)
		end
		
		table.remove(self.items, Util:getLastFindIdx())
	end;
	
	gainContributesSellItemSucc = function(self, item)
		self:_gainContributesSellItemSucc(item)
	end;
	
	returnContributeToBuyer = function(self, item)
		if item.buyer == '' then return end
		
		local roleId = app:getCityMgr():getRoleIdByRoleName(item.buyer)
		local allianceId = app:getCityMgr():getAlliIdByRoleName(item.buyer)
		local alliance = app:getAlliMgr():getAlliById(allianceId)
		local mem = alliance:getMemberById( roleId )
		if mem == nil then return end
		
		mem:setContributes(mem:getContributes() + item.cur)
		local mail = app:getMailMgr():addSysMail(item.buyer, rstr.mail.title.returnContributeWhenLow, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.returnContributeWhenLow,item.cur))
		local player = app:getPlayerMgr():getOnlinePlayerByRoleName(item.buyer)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
			AllianceSender:sendSelfContributes(player, alliance)
		end
	end;	
	
	_hasSeller = function(self, item)
		return item.boss ~= 1 and item.seller ~= nil and item.seller ~= ''
	end;
	
	_hasBuyer = function(self, item)
		return item.buyer ~= nil and item.buyer ~= ''
	end;
	
	_sendItemToBuyer = function(self, item)
		local dropRawItems = DropItem():createRawItems({{resid=item.resid,number=item.num}})
		local mail = app:getMailMgr():addSysMail(item.buyer, rstr.mail.title.biddingAlliItem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.biddingAlliItem, dropRawItems)
		local player = app:getPlayerMgr():getOnlinePlayerByRoleName(item.buyer)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
		end
	end;	
	
	_returnItemToSeller = function(self, item)
		local dropRawItems = DropItem():createRawItems({{resid=item.resid,number=item.num}})
		local mail = app:getMailMgr():addSysMail(item.seller, rstr.mail.title.sellAlliItemTimeOut, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.sellAlliItemTimeOut, dropRawItems)
		local player = app:getPlayerMgr():getOnlinePlayerByRoleName(item.seller)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
		end
	end;
	
	_gainContributesSellItemSucc = function(self, item)
		if item.seller == nil or item.seller == '' then
			return
		end
		
		local roleId = app:getCityMgr():getRoleIdByRoleName(item.seller)
		local allianceId = app:getCityMgr():getAlliIdByRoleName(item.seller)
		local alliance = app:getAlliMgr():getAlliById(allianceId)
		local mem = alliance:getMemberById( roleId )
		if mem == nil then return end
		
		mem:setContributes(mem:getContributes() + item.cur)
		local mail = app:getMailMgr():addSysMail(item.seller, rstr.mail.title.sellAlliItemSucc, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.sellAlliItemSucc,item.cur))
		
		local player = app:getPlayerMgr():getOnlinePlayerByRoleName(item.seller)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
			AllianceSender:sendSelfContributes(player, alliance)
		end
	end;
	
	toString = function(self)
		return 'items=' .. toLUAString(self.items) .. ',litems=' .. toLUAString(self.lastItems) .. ','
	end;
})

Alliance = Class:extends({
	init = function(self, allianceMgr)
		self.allianceMgr = allianceMgr
		self.id = 0
		self.level = 0
		self.name = ''
		self.flagName = ''
		self.cityResId = 0
		self.honour = 0
		self.leader = ''
		self.buildVal = 0
		self.cardNumber = 0
		self.qqGroup = ''
		self.introduction = ''
		self.bulletin = ''
		self.members = {}
		self.lawLight = {}
		self.dismissTime = 0
		self.applyRoleIds = Set(nil, res_alli_applylist_maxcount)
		self.applyMerges = Set(nil, res_alli_applymerges_maxcount)
		self.rank = 999999
		self.dismiss = {start=0}
		self.upgrade = {start=0, stop=0}
		self.transfer = {start=0, name=""}
		self.events = {}
		self.itemPkg = AllianceItemPkg()
	end;
	
	getItemPkg = function(self)
		return self.itemPkg
	end;
	
	isNull = function(self)
		return self:getId() == 0
	end;
	
	setId = function(self, id)
		self.id = id
		self.itemPkg:setAllianceId(id)
	end;
	
	getId = function(self)
		return self.id
	end;
	
	setRank = function(self, rank)
		self.rank = rank
	end;
	
	getRank = function(self)
		return self.rank
	end;
	
	isFullLevel = function(self)
		return self:getLevel() >= res_alli_max_level
	end;
	
	setLevel = function(self, level)
		self.level = level
	end;
	
	getLevel = function(self)
		return self.level
	end;	
	
	setName = function(self, name)
		self.name = name
	end;
	
	getName = function(self)
		return self.name
	end;	
	
	setFlag = function(self, flag)
		self.flagName = flag
	end;	
	
	getFlag = function(self)
		return self.flagName
	end;	
	
	setCityResId = function(self, cityResId)
		self.cityResId = cityResId
	end;
	
	getCityResId = function(self)
		return self.cityResId
	end;
	
	addHonour = function(self, addHonour)
		if addHonour <= 0 then
			return
		end
		self.honour = self.honour + addHonour
	end;
	
	subHonour = function(self, subHonour)
		if subHonour <= 0 then
			return
		end
		self.honour = self.honour - subHonour
		if self.honour < 0 then
			self.honour = 0
		end
	end;
	
	setHonour = function(self, honour)
		self.honour = honour
	end;
	
	getHonour = function(self)
		return self.honour
	end;
	
	setLeader = function(self, leader)
		self.leader = leader
	end;
	
	getLeader = function(self)
		return self.leader
	end;
	
	setBuildVal = function(self, buildVal)
		self.buildVal = buildVal
	end;
	
	getBuildVal = function(self)
		return self.buildVal
	end;
	
	setCardNumber = function(self, cardNumber)
		self.cardNumber = cardNumber
	end;
	
	getCardNumber = function(self)
		return self.cardNumber
	end;
	
	setQQGroup = function(self, qqGroup)
		self.qqGroup = qqGroup
	end;
	
	getQQGroup = function(self)
		return self.qqGroup
	end;
	
	setIntroduction = function(self, introduction)
		self.introduction = introduction
	end;
	
	getIntroduction = function(self)
		return self.introduction
	end;
	
	setBulletin = function(self, bulletin)
		self.bulletin = bulletin
	end;
	
	getBulletin = function(self)
		return self.bulletin
	end;
	
	isFullMember = function(self)
		return self:getMemberCount() == self:getMaxMember()
	end;
	
	getMaxMember = function(self)
		return self:_getRes().memmaxcount
	end;
	
	getMemberCount = function(self)
		return table.getn(self.members)
	end;
	
	getMemberByIdx = function(self, idx) -- from 0 to n-1
		return self.members[idx+1]
	end;
	
	addMember = function(self, member)
		self:insertMember(member)
		local addHonour = 100
		self:addHonour(addHonour)
		self.allianceMgr:addAllianceEvent(self, 'addMember', {roleId=member:getId(), addHonour=addHonour})
		self:_doTasks()
	end;
	
	-- @不产生联盟事件，不增加联盟荣誉
	insertMember = function(self, member)
		table.insert(self.members, member)
	end;
	
	getMemberById = function(self, roleId)
		for _, member in ipairs(self.members) do
			if member:getId() == roleId then
				return member
			end
		end
		return nil
	end;
	
	removeMember = function(self, idx) -- from 0 to n-1
		local member = self.members[idx+1]
		local subHonour = 100
		self:subHonour(subHonour)
		self.allianceMgr:addAllianceEvent(self, 'delMember', {roleId=member:getId(), subHonour=subHonour})
		table.remove(self.members, idx+1)
	end;
	
	removeMemberById = function(self, roleId)
		local idx = -1
		for i, member in ipairs(self.members) do
			if member:getId() == roleId then
				idx = i - 1
			end
		end
		
		if idx >= 0 then
			self:removeMember(idx)
		end
	end;
	
	setLawLight = function(self, lawLight)
		self.lawLight = lawLight
	end;
	
	getLawLight = function(self)
		return self.lawLight
	end;
	
	setDismissStartTime = function(self, dismissTime)
		self.dismiss.start = dismissTime
		self:_startTimer(self:getDismissStopTime(), TIMER_EVT.DISMISS_ALLIANCE)
	end;
	
	getDismissStartTime = function(self)
		return self.dismiss.start
	end;
	
	getDismissStopTime = function(self)
		return self:_getStopTime(self.dismiss.start, 12*3600)
	end;
	
	setUpgradeStartTime = function(self, upgradeStartTime)
		self.upgrade.start = upgradeStartTime
	end;
	
	getUpgradeStartTime = function(self)
		return self.upgrade.start
	end;
	
	setUpgradeStopTime = function(self, upgradeStopTime)
		self.upgrade.stop = upgradeStopTime
		self:_startTimer(self.upgrade.stop, TIMER_EVT.UPGRADE_ALLIANCE)
	end;
	
	getUpgradeStopTime = function(self)
		return self.upgrade.stop
	end;
	
	setTransferStartTime = function(self, transferTime)
		self.transfer.start = transferTime
		self:_startTimer(self:getTransferStopTime(), TIMER_EVT.DISMISS_TRANSFER)
	end;
	
	getTransferStartTime = function(self)
		return self.transfer.start 
	end;
	
	getTransferStopTime = function(self)
		return self:_getStopTime(self.transfer.start, 24*3600)
	end;
	
	setTransferTarget = function(self, target)
		self.transfer.name = target
	end;
	
	getTransferTarget = function(self)
		return self.transfer.name
	end;
	
	getApplyRoleIdsSet = function(self)
		return self.applyRoleIds
	end;
	
	getApplyMergesSet = function(self)
		return self.applyMerges
	end;
	
	getGainDropId = function(self)
		return self:_getRes().getitemdropid
	end;
	
	getGainNeedContribute = function(self)
		return self:_getRes().expendcontribute
	end;
	
	getUpgradeNeedBuildVal = function(self)
		return self:_getNextLevelRes().needbuildval
	end;
	
	getUpgradeNeedTime = function(self)
		return self:_getNextLevelRes().needtime
	end;	
	
	isUpgrading = function(self)
		return self:getUpgradeStopTime() > 0
	end;
	
	isTransfering = function(self)
		return self:getTransferStopTime() > 0
	end;
	
	isDismissing = function(self)
		return self:getDismissStopTime() > 0
	end;
	
	addEvent = function(self, event, first)
		if first then
			table.insert(self.events, 1, event)
		else
			table.insert(self.events, event)
		end
		self:_removeExpiredEvents()
	end;
	
	getEventsCount = function(self)	
		return table.getn(self.events)
	end;
	
	getEventByIdx = function(self, idx) -- from 0 to n-1
		return self.events[idx+1]
	end;
	
	_getStopTime = function(self, start, durationS )
		if start == 0 then return 0 end
		return start + durationS
	end;
	
	_startTimer= function(self, stopTime, timerEvt)
		if stopTime == 0 then return end
		
		local elapseS = math.max(1, stopTime - Util:getTime())
		global.getTimer():start(elapseS*1000, {timerEvt, self:getId()}, self.allianceMgr:getTimerCaller())
	end;
	
	_getRes = function(self)
		return res_alli_upd_needs[self:getLevel()]
	end;
	
	_getNextLevelRes = function(self)
		return res_alli_upd_needs[self:getLevel() + 1]
	end;
	
	_removeExpiredEvents = function(self)
		local cnt = table.getn(self.events)
		for i=cnt, 1, -1 do
			local event = self.events[i]
			if event.createTime < Util:getTime() - res_alli_events_expired_days*24*3600 then
				table.remove(self.events, i)
			end
		end
	end;
	
	_doTasks = function(self)
		local memCount = self:getMemberCount()
		if res_task_alli_mems[memCount] == nil then
			return 
		end
		
		for i=0, memCount-1, 1 do
			local member = self:getMemberByIdx(i)
			local player = ArmyPlayerGetter:getOnlinePlayer(OBJ_TYPE.ROLE, member:getId())
			if player ~= NullPlayer then
				TaskFinisher:checkTasks(player)
			end
		end	
	end;
})

AllianceMgr = Class:extends({
	init = function(self, gapp)
		self.lastSortTime = 0
		self._timerCaller = TimerCaller:new(TIMER_ID.ALLI_MGR)

		self:_init(gapp)
		self:_regTimers()
		self:_loadFromDB()
		self:sortAlliances()
		
		global.getTimer():start(10*1000, {TIMER_EVT.SAVE_ALLIANCE}, self._timerCaller)
		global.getTimer():start(20*1000, {TIMER_EVT.SORT_ALLI_RANK}, self._timerCaller)
		
		self._worldBossEvents = {}
	end;
	
	start = function(self)
		for _, alliance in pairs(self.ids) do
			alliance:getItemPkg():start()
		end
	end;
	
	getTimerCaller = function(self)
		return self._timerCaller
	end;
	
	sortAlliances = function(self)
		self.stateCitySorts = {}
		self:_sortAllAlliances()
		self:_sortStateCityAlliances()
	end;
	
	--@cityResId =0 返回总的排序列表个数，>0 返回指定州城排序列表个数
	getSortAlliCount = function(self, cityResId)
		local citySorts = self.stateCitySorts[cityResId]
		if not citySorts then
			return 0
		end
		
		return table.getn(citySorts)
	end;
	
	--@cityResId =0 从总的排序列表中取，>0 从指定州城排序列表中取
	--@idx from 0 to n-1
	getSortAlliBy = function(self, cityResId, idx)
		return self.stateCitySorts[cityResId][idx+1]
	end;
	
	addWorldBossTmpEvent = function(self, role, hurt, time)
		table.insert(self._worldBossEvents, {role, hurt, time})
		if table.getn(self._worldBossEvents) > 5 then
			table.remove(self._worldBossEvents, 1)
		end
	end;
	
	getWorldBossTmpEvents = function(self)
		return self._worldBossEvents
	end;
		
	_init = function(self, gapp)
		self.gapp = gapp
		self.emptyalli = self:_newEmptyAlli()
		self.saveAllianceTimer = SaveAllianceTimer(self)
		self.upgradeAllianceTimer = UpgradeAllianceTimer(self)
		self.dismissAllianceTimer = DismissAllianceTimer(self)
		self.transferAllianceTimer = TransferAllianceTimer(self)
		self:clear()
	end;

	_regTimers = function(self)
		self._timerCaller:register(TIMER_EVT.SAVE_ALLIANCE, Caller:new(0, self.saveAllianceTimer, self.saveAllianceTimer.onTimer) )
		self._timerCaller:register(TIMER_EVT.SORT_ALLI_RANK, Caller:new(0, self, self._onSortAlliance) )
		self._timerCaller:register(TIMER_EVT.UPGRADE_ALLIANCE, Caller:new(0, self.upgradeAllianceTimer, self.upgradeAllianceTimer.onTimer) )
		self._timerCaller:register(TIMER_EVT.DISMISS_ALLIANCE, Caller:new(0, self.dismissAllianceTimer, self.dismissAllianceTimer.onTimer) )
		self._timerCaller:register(TIMER_EVT.DISMISS_TRANSFER, Caller:new(0, self.transferAllianceTimer, self.transferAllianceTimer.onTimer) )
		self._timerCaller:register(TIMER_EVT.ALLI_ITEM_TIMEOUT, Caller:new(0, self, self._onAllianceTimeout) )
	end;
	
	_loadFromDB = function(self)
		self:_loadAlliancesFromDB()
		self:_loadAllianceEventsFromDB()
	end;
	
	_loadAlliancesFromDB = function(self)
		local dbRows = self.gapp:getDBConn():query('select * from alliances;')
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			local alliance = self:_loadAlliance(dbRow)
			self:_insertKeyIndex(alliance)
			dbRows:nextRow()
		end	
	end;
	
	_loadAllianceEventsFromDB = function(self)
		for _, alliance in pairs(self.ids) do
			local lastTime = Util:getTime() - res_alli_events_expired_days*24*3600
			local dbRows = self.gapp:getDBConn():query('select * from allianceevents where allianceId=' .. alliance:getId() .. ' and createTime>' .. lastTime .. ' order by createTime desc;')
			local rowCount = dbRows:getRowCount()
			for i=1, rowCount, 1 do
				local dbRow = dbRows:getCurRow()
				alliance:addEvent({event=dbRow:getFieldVal('event'), createTime=dbRow:getFieldVal('createTime') }, false)
				dbRows:nextRow()
			end
		end	
	end;
	
	_insertKeyIndex = function(self, alliance)
		self.ids[alliance:getId()] = alliance
		self.names[alliance:getName()] = alliance
		self.flagNames[alliance:getFlag()] = alliance
	end;
	
	_loadAlliance = function(self, dbRow)
		local alliance = Alliance(self)
		alliance:setId( dbRow:getFieldVal('allianceId') )
		alliance:setLevel( dbRow:getFieldVal('level') )
		alliance:setName( dbRow:getFieldVal('name') )
		alliance:setFlag( dbRow:getFieldVal('flagName') )
		alliance:setCityResId( dbRow:getFieldVal('cityResId') )
		alliance:setLeader( dbRow:getFieldVal('leader') )
		alliance:setHonour( dbRow:getFieldVal('honour') )
		alliance:setBuildVal( dbRow:getFieldVal('buildVal') )
		alliance:setCardNumber( dbRow:getFieldVal('card') )
		alliance:setQQGroup( dbRow:getFieldVal('qqGroup') )
		alliance:setIntroduction( dbRow:getFieldVal('introduction') )
		alliance:setBulletin( dbRow:getFieldVal('bulletin') )
		
		local members = self:_loadMembers(dbRow:getFieldVal('member'))
		for _, member in ipairs(members) do
			alliance:insertMember(member)
		end
		
		alliance:setLawLight( self:_loadLawLight(dbRow:getFieldVal('lawLight')) )
		
		local misc = eval(dbRow:getFieldVal('misc'))
		alliance:setDismissStartTime(misc.dismiss.start)
		alliance:setUpgradeStartTime(misc.upgrade.start)
		alliance:setUpgradeStopTime(misc.upgrade.stop)
		alliance:setTransferStartTime(misc.transfer.start)
		alliance:setTransferTarget(misc.transfer.name)
		for _, roleId in ipairs(misc.applyRoleIds) do
			alliance:getApplyRoleIdsSet():insert(roleId)
		end
		for _, allianceId in ipairs(misc.applyMerges) do
			alliance:getApplyMergesSet():insert(allianceId)
		end
		self:_loadItems(alliance, misc.items)
		self:_loadLastItems(alliance, misc.litems)
		
		return alliance
	end;
	
	_loadItems = function(self, alliance, items)
		if items == nil then return end
		for _, item in ipairs(items) do
			alliance:getItemPkg():onlyAddItem(item)
		end
	end;
	
	_loadLastItems = function(self, alliance, lastItems)
		if lastItems == nil then return end
		for _, item in ipairs(lastItems) do
			alliance:getItemPkg():addLastItem(item)
		end
	end;
	
	_loadMembers = function(self, memberBLOB)
		local members = {}
		local membersTable = eval(memberBLOB)
		for _, memberRes in ipairs(membersTable) do
			local member = AllianceMember()
			member:setId(memberRes.id)
			member:setLastRes(memberRes.lastRes)
			member:setLastCard(memberRes.lastCard)
			member:setTotalRes(memberRes.totalRes)
			member:setTotalCard(memberRes.totalCard)
			member:setAlliPos(memberRes.alliPos)
			member:setContributes(memberRes.contributes)
			member:setGainGiftCount(memberRes.gainGift)
			member:setFeedCount(memberRes.feed)
			member:setLastFire(memberRes.fire)
			table.insert(members, member)
		end
		return members
	end;
	
	_loadLawLight = function(self, lawLightBLOB)
		local lawLightRes = eval(lawLightBLOB)
		local lawLight = AllianceLawLight()
		lawLight:setLevel(lawLightRes.level)
		lawLight:setGrowupVal(lawLightRes.val)
		return lawLight
	end;
	
	createAlliance = function(self, player, alliName, alliFlag)
		local alliance = self:_makeAlliance(player, alliName, alliFlag)
		self:_insertKeyIndex(alliance)
		self:_insertToDB(alliance)
		self:sortAlliances()
		local rank = Service:getAllianceRankDB():makeRank(alliance)
		Service:getAllianceRank():addRank(rank)
		return alliance
	end;
	
	_makeAlliance = function(self, player, alliName, alliFlag)
		local alliance = Alliance(self)
		alliance:setId( UUIDMgr:newAllianceId() )
		alliance:setLevel( 1 )
		alliance:setName( alliName )
		alliance:setFlag( alliFlag )
		alliance:setCityResId( player:getCityId() )
		alliance:setHonour( 0 )
		alliance:setLeader( player:getRoleName() )
		alliance:setBuildVal( 0 )
		alliance:setCardNumber( 0 )
		alliance:setQQGroup( '' )
		alliance:setIntroduction( '' )
		alliance:setBulletin( '' )
		self:addAllianceEvent(alliance, 'upgradeAlliance', {level=1, addHonour=1*100})
		alliance:addHonour(100)
		alliance:addMember( self:_makeMember(player) )
		alliance:setLawLight( AllianceLawLight() )
		self:addAllianceEvent(alliance, 'upgradeLawLight', {level=1, addHonour=200})
		alliance:addHonour(200)
		return alliance
	end;
	
	_makeMember = function(self, player)
		local member = AllianceMember()
		member:setId(player:getRoleId())
		member:setAlliPos(ALLI_POS.LEADER)
		return member
	end;
	
	_insertToDB = function(self, alliance)
		local fields = '\'' .. alliance:getId() .. '\''
		fields = fields .. ',\'' .. alliance:getLevel() .. '\''
		fields = fields .. ',\'' .. alliance:getName() .. '\''
		fields = fields .. ',\'' .. alliance:getFlag() .. '\''
		fields = fields .. ',\'' .. alliance:getCityResId() .. '\''
		fields = fields .. ',\'' .. alliance:getHonour() .. '\''
		fields = fields .. ',\'' .. alliance:getLeader() .. '\''
		fields = fields .. ',\'' .. alliance:getBuildVal() .. '\''
		fields = fields .. ',\'' .. alliance:getCardNumber() .. '\''
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(alliance:getQQGroup()) .. '\''
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(alliance:getIntroduction()) .. '\''
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(alliance:getBulletin()) .. '\''
		
		local mems = '{'
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			mems = mems .. alliance:getMemberByIdx(i):toString() .. ','
		end
		mems = mems .. '}'
		
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(mems) .. '\'' -- member
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(alliance:getLawLight():toString()) .. '\'' -- lawLight
		fields = fields .. ',\'' .. self.gapp:getDBConn():escape(self:_makeMiscString(alliance)) .. '\''
		fields = fields .. ',\'' .. Util:getTime() .. '\'' -- createTime
		fields = fields .. ',\'' .. alliance:getLevel() .. '\'' -- lastLevel
		fields = fields .. ',\'' .. alliance:getHonour() .. '\'' -- lastHonour
		fields = fields .. ',\'100000\'' -- rank
		local s = 'insert into alliances values(' .. fields .. ');'
		self.gapp:getDBConn():exec(s)
	end;
	
	_makeMiscString = function(self, alliance)
		local misc = '{'
		misc = misc .. self:_makeDismissString(alliance)
		misc = misc .. self:_makeUpgradeString(alliance)
		misc = misc .. self:_makeTransferString(alliance)
		misc = misc .. self:_makeApplyString(alliance)
		misc = misc .. self:_makeApplyMergesString(alliance)
		misc = misc .. self:_makeItemsString(alliance)
		misc = misc .. '}'
		return misc
	end;
	
	_makeDismissString = function(self, alliance)
		return  'dismiss={start=' .. alliance:getDismissStartTime() .. '},'
	end;
	
	_makeUpgradeString = function(self, alliance)
		return  'upgrade={start=' .. alliance:getUpgradeStartTime() .. ',stop=' .. alliance:getUpgradeStopTime() .. '},'
	end;
	
	_makeTransferString = function(self, alliance)
		return  'transfer={start=' .. alliance:getTransferStartTime() .. ',name="' .. alliance:getTransferTarget() .. '"},'
	end;
	
	_makeApplyString = function(self, alliance)
		local s = ''
		local set = alliance:getApplyRoleIdsSet()
		for i=0, set:getCount()-1, 1 do
			s = s .. set:get(i) .. ','
		end
		return 'applyRoleIds={' .. s .. '},'
	end;
	
	_makeApplyMergesString = function(self, alliance)
		local s = ''
		local set = alliance:getApplyMergesSet()
		for i=0, set:getCount()-1, 1 do
			s = s .. set:get(i) .. ','
		end
		return 'applyMerges={' .. s .. '},'
	end;
	
	_makeItemsString = function(self, alliance)
		return alliance:getItemPkg():toString()
	end;
	
	saveAlliance = function(self, alliance)
		local fields = 'level=\'' .. alliance:getLevel() .. '\''
		fields = fields .. ',honour=\'' .. alliance:getHonour() .. '\''
		fields = fields .. ',leader=\'' .. alliance:getLeader() .. '\''
		fields = fields .. ',buildVal=\'' .. alliance:getBuildVal() .. '\''
		fields = fields .. ',card=\'' .. alliance:getCardNumber() .. '\''
		fields = fields .. ',qqGroup=\'' .. self.gapp:getDBConn():escape(alliance:getQQGroup()) .. '\''
		fields = fields .. ',introduction=\'' .. self.gapp:getDBConn():escape(alliance:getIntroduction()) .. '\''
		fields = fields .. ',bulletin=\'' .. self.gapp:getDBConn():escape(alliance:getBulletin()) .. '\''
		
		local mems = '{'
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			mems = mems .. alliance:getMemberByIdx(i):toString() .. ','
		end
		mems = mems .. '}'
		
		fields = fields .. ',member=\'' .. self.gapp:getDBConn():escape(mems) .. '\'' -- member
		fields = fields .. ',lawLight=\'' .. self.gapp:getDBConn():escape(alliance:getLawLight():toString()) .. '\'' -- lawLight
		fields = fields .. ',misc=\'' .. self.gapp:getDBConn():escape(self:_makeMiscString(alliance)) .. '\'' -- lawLight
		local s = 'update alliances set ' .. fields .. ' where allianceId=' .. alliance:getId() .. ';'
		self.gapp:getDBConn():exec(s)
	end;
	
	clear = function(self)
		self.ids = {}
		self.names = {}
		self.flagNames = {}	
	end;
	
	getAlliById = function(self, id)
		local alliance = self.ids[id]
		if not alliance then return self.emptyalli end
		return alliance
	end;
	
	getAlliByName = function(self, name)
		local alliance = self.names[name]
		if not alliance then return self.emptyalli end
		return alliance
	end;
	
	getAlliByFlagName = function(self, flag)
		local alliance = self.flagNames[flag]
		if not alliance then return self.emptyalli end
		return alliance
	end;
	
	safeExit = function(self)
		local count = self:getSortAlliCount(0)
		for i=0, count-1, 1 do
			self:saveAlliance(self:getSortAlliBy(0, i))
		end
	end;
	
	exitAlliance = function(self, alliance)
		self:_removeKeyIndex(alliance)
		self:sortAlliances()
		self:_removeFromDB(alliance)
	end;
	
	addAllianceEvent = function(self, alliance, eventName, params)
		local event = self:_makeAllianceEvent(alliance, eventName, params)
		local fields = '\'\''
		fields = fields .. ',\'' .. alliance:getId() .. '\''
		fields = fields .. ',\'' .. event .. '\''
		fields = fields .. ',\'' .. Util:getTime() .. '\'' -- createTime
		local s = 'insert into allianceevents values(' .. fields .. ');'
		self.gapp:getDBConn():exec(s)
		alliance:addEvent({event=event, createTime=Util:getTime()}, true)
	end;
	
	_makeAllianceEvent = function(self, alliance, eventName, params)
		if eventName == 'addMember' then
			local roleName = app:getCityMgr():getRoleNameByRoleId(params.roleId)
			return string.format(rstr.alliance.events.addMember, roleName, params.addHonour)
		elseif eventName == 'delMember' then
			local roleName = app:getCityMgr():getRoleNameByRoleId(params.roleId)
			return string.format(rstr.alliance.events.delMember, roleName, params.subHonour)
		elseif eventName == 'upgradeAlliance' then
			return string.format(rstr.alliance.events.upgradeAlliance, params.level, params.addHonour)
		elseif eventName == 'upgradeLawLight' then
			return string.format(rstr.alliance.events.upgradeLawLight, params.level, params.addHonour)
		elseif eventName == 'lawLightBestow' then
			return string.format(rstr.alliance.events.lawLightBestow, params.addHonour)
		elseif eventName == 'mergeAlliance' then
			return string.format(rstr.alliance.events.mergeAlliance, params.minAlliance, params.maxAlliance, params.addHonour)
		elseif eventName == 'changeAlliPos' then
			local roleName = app:getCityMgr():getRoleNameByRoleId(params.roleId)
			local alliPosName = rstr.alliance.alliPoss[params.alliancePos]
			return string.format(rstr.alliance.events.changeAlliPos, roleName, alliPosName)
		elseif eventName == 'pkAttacker' then
			return string.format(rstr.alliance.events.pkAttacker, params.attacker, params.defender, params.addHonour)
		elseif eventName == 'pkDefender' then
			return string.format(rstr.alliance.events.pkDefender, params.attacker, params.defender, params.subHonour)
		elseif eventName == 'roleTask' then
			return string.format(rstr.alliance.events.roleTask, params.roleName, params.addHonour )
		end
	end;
	
	_removeKeyIndex = function(self, alliance)
		self.ids[alliance:getId()] = nil
		self.names[alliance:getName()] = nil
		self.flagNames[alliance:getFlag()] = nil
	end;
	
	_removeFromDB = function(self, alliance)
		local s = 'delete from alliances where allianceId=' .. alliance:getId() .. ';'
		self.gapp:getDBConn():exec(s)
	end;
	
	_sortAllAlliances = function(self)
		self.stateCitySorts[0] = {}
		self:_collectAlliancesByCityResId(self.stateCitySorts[0], 0)
		self:_sortAlliances(self.stateCitySorts[0])
		self:_setAllSortAlliancesRank()
	end;
	
	_sortStateCityAlliances = function(self)
		for cityResId=FIXID.FIRSTSTATECITY, FIXID.LASTSTATECITY, 1 do
			self.stateCitySorts[cityResId] = {}
			self:_collectAlliancesByCityResId(self.stateCitySorts[cityResId], cityResId)
			self:_sortAlliances(self.stateCitySorts[cityResId])
		end
	end;
	
	_collectAlliancesByCityResId = function(self, desArray, cityResId)
		for _, alliance in pairs(self.names) do
			if cityResId == 0 or alliance:getCityResId() == cityResId then
				table.insert(desArray, alliance)
			end
		end	
	end;
	
	_sortAlliances = function(self, desArray)
		local sortFunc = function(a, b)
			if a:getLevel() == b:getLevel() then
				return a:getHonour() > b:getHonour()
			end
			return a:getLevel() > b:getLevel()
		end
		
		table.sort(desArray, sortFunc)	
	end;
	
	_setAllSortAlliancesRank = function(self)
		for rank, alliance in ipairs(self.stateCitySorts[0]) do
			alliance:setRank(rank)
		end
	end;
	
	_newEmptyAlli = function(self)
		local alliance = Alliance()
		alliance:setId(0)
		alliance:setName('--')
		alliance:setLevel(0)
		alliance:setFlag('')
		return alliance
	end;
	
	_onSortAlliance = function(self)
		if Util:isCurDay(self.lastSortTime) then
			return
		end
		
		self:sortAlliances()
		self.lastSortTime = Util:getTime()	
	end;
	
	_onAllianceTimeout = function(self, timer, seq, curTime, params)
		timer:stop()
		local allianceId = params[2]
		local itemId = params[3]
		local alliance = self:getAlliById(allianceId)
		if alliance:isNull() then return end
		alliance:getItemPkg():itemTimeOut(itemId)
	end;
})

AllianceUtil = Class:extends({
	searchLeader = function(self, alliance)
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			local mem = alliance:getMemberByIdx(i)
			if mem:getAlliPos() == ALLI_POS.LEADER then
				return mem
			end
		end
		return nil
	end;
	
	compareAlliance = function(self, allianceA, allianceB)
		if allianceA:getLevel() == allianceB:getLevel() then
			return allianceA:getHonour() > allianceB:getHonour()
		end
		return allianceA:getLevel() > allianceB:getLevel()
	end;
}):new()

AllianceBaseTimer = Class:extends({
	init = function(self, allianceMgr)
		self.allianceMgr = allianceMgr
	end;
})

SaveAllianceTimer = Class:extends({
	init = function(self, allianceMgr)
		self.allianceMgr = allianceMgr
		self.lastPos = 0
	end;
	
	onTimer = function(self)
		local startPos,  endPos = self:_getCurRange()
		for idx=startPos, endPos, 1 do
			local alliance = self.allianceMgr:getSortAlliBy(0, idx)
			self.allianceMgr:saveAlliance(alliance)
			self.lastPos = self.lastPos + 1
		end
	end;
	
	_getCurRange = function(self)
		local count = self.allianceMgr:getSortAlliCount(0)
		if self.lastPos >= count then
			self.lastPos = 0
		end
		
		local startPos = self.lastPos
		local endPos = startPos + SAVE_ALLIANCE_STEP - 1
		if endPos >= count then
			endPos = count - 1
		end
		
		return startPos, endPos
	end;
})

UpgradeAllianceTimer = AllianceBaseTimer:extends({
	onTimer = function(self, timer, seq, curTime, params)
		timer:stop()
		
		local allianceId = params[2]
		local alliance = self.allianceMgr:getAlliById(allianceId)
		if alliance:isNull() then return end
		
		if not self:_isArriveTime(alliance) then
			return
		end
		
		alliance:setLevel(alliance:getLevel() + 1)
		alliance:setUpgradeStartTime(0)
		alliance:setUpgradeStopTime(0)
		
		local addHonour = alliance:getLevel()*100
		alliance:addHonour(addHonour)
		app:getAlliMgr():addAllianceEvent(alliance, 'upgradeAlliance', {level=alliance:getLevel(), addHonour=addHonour})
		
		AllianceSender:sendSelfAllianceDetailToMembers(alliance)
	end;
	
	_isArriveTime = function(self, alliance)
		return (Util:getTime()+TIMER_DRT_TIME) >= alliance:getUpgradeStopTime()
	end;
})

DismissAllianceTimer = AllianceBaseTimer:extends({
	onTimer = function(self, timer, seq, curTime, params)
		timer:stop()
		
		local allianceId = params[2]
		local alliance = self.allianceMgr:getAlliById(allianceId)
		if alliance:isNull() then return end
		
		if not self:_isArriveTime(alliance) then return end
		
		if not alliance:isDismissing() then return end
		
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			local mem = alliance:getMemberByIdx(i)
			local memPlayer = app:getPlayerMgr():getOrLoadPlayerByRoleId(mem:getId())
			if memPlayer ~= nil then
				memPlayer:exitAlliance(mem)
				RoleBaseSender:send(memPlayer, {'alliance'})
			
				local mail = app:getMailMgr():addSysMail(memPlayer:getRoleName()
					,rstr.mail.title.allianceDismissed, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.allianceDismissed, nil)
				MailSender:sendBriefMail(memPlayer, mail)
			end
		end
		
		app:getAlliMgr():exitAlliance(alliance)
	end;
	
	_isArriveTime = function(self, alliance)
		return (Util:getTime()+TIMER_DRT_TIME) >= alliance:getDismissStopTime()
	end;	
})

TransferAllianceTimer = AllianceBaseTimer:extends({
	onTimer = function(self, timer, seq, curTime, params)
		timer:stop()
		
		local allianceId = params[2]
		local alliance = self.allianceMgr:getAlliById(allianceId)
		if alliance:isNull() then return end
		
		if not self:_isArriveTime(alliance) then
			return 
		end
		
		if not alliance:isTransfering() then return end
		
		alliance:setTransferStartTime(0)
		
		local newLeaderId = app:getCityMgr():getRoleIdByRoleName(alliance:getTransferTarget())
		if newLeaderId < 0 then return end
		
		local newLeaderMem = alliance:getMemberById(newLeaderId)
		if not self:_isCanBeTransfer(newLeaderMem) then return end
		
		local oldLeaderMem = AllianceUtil:searchLeader(alliance)
		self:_swapLeaderPos(alliance, newLeaderMem, oldLeaderMem)
		self:_sendMsgs(alliance, newLeaderMem, oldLeaderMem)
		self:_sendMails(newLeaderMem, oldLeaderMem)
	end;
	
	_isArriveTime = function(self, alliance)
		return (Util:getTime()+TIMER_DRT_TIME) >= alliance:getTransferStopTime()
	end;
	
	_isCanBeTransfer = function(self, newLeaderMem)
		return (newLeaderMem ~= nil) and (newLeaderMem:getAlliPos() == ALLI_POS.ALEADER)
	end;

	_swapLeaderPos = function(self, alliance, newLeaderMem, oldLeaderMem)
		newLeaderMem:setAlliPos(ALLI_POS.LEADER)
		oldLeaderMem:setAlliPos(ALLI_POS.ALEADER)
		local roleName = app:getCityMgr():getRoleNameByRoleId(newLeaderMem:getId())
		alliance:setLeader(roleName)
		app:getAlliMgr():addAllianceEvent(alliance, 'changeAlliPos', {roleId=newLeaderMem:getId(), alliancePos=newLeaderMem:getAlliPos()})
		app:getAlliMgr():addAllianceEvent(alliance, 'changeAlliPos', {roleId=oldLeaderMem:getId(), alliancePos=oldLeaderMem:getAlliPos()})
	end;
	
	_sendMsgs = function(self, alliance, newLeaderMem, oldLeaderMem)
		self:_sendMsgToPlayer(alliance, newLeaderMem:getId())
		self:_sendMsgToPlayer(alliance, oldLeaderMem:getId())
	end;
	
	_sendMsgToPlayer = function(self, alliance, roleId)
		local player = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if player ~= nil then
			AllianceSender:sendSelfMember(player, alliance)
			AllianceSender:sendSelfAllianceDetail(player, alliance)
		end	
	end;
	
	_sendMails = function(self, newLeaderMem, oldLeaderMem)
		self:_sendMailToPlayer(newLeaderMem:getId(), rstr.mail.content.becomLeader)
		self:_sendMailToPlayer(oldLeaderMem:getId(), rstr.mail.content.verbLeader)
	end;
	
	_sendMailToPlayer = function(self, roleId, content)
		local roleName = app:getCityMgr():getRoleNameByRoleId(roleId)
		local mail = app:getMailMgr():addSysMail(roleName, rstr.mail.title.transferLeader, FIXID.COMM_SYS_MAILTEMP, content, nil)
		
		local player = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if player ~= nil then
			MailSender:sendBriefMail(player, mail)
		end	
	end;
})



