--*******************************************************************************
RET_RANK_SORTER_REFRESH = 0
RET_RANK_SORTER_SORT = 1
RankSorterAdapter = Class:extends({
	init = function(self, sorterC)
		self._sorterC = sorterC
	end;
	
	sort = function(self)
		self._sorterC:Sort()
		return RET_RANK_SORTER_SORT
	end;
	
	loadLast = function(self)
		self._sorterC:LoadLast()
	end;
	
	getCount = function(self)
		return self._sorterC:GetCount()
	end;
	
	get = function(self, idx)
		return self._sorterC:Get(idx)
	end;
	
	getIdxByName = function(self, roleName)
		return self._sorterC:GetIdxByName(roleName)
	end;
	
	clearRanks = function(self)
	end;
	
	addRank = function(self, rank)
	end;
})

RankSorterMgr = Class:extends({
	getRankSorter = function(self, rankName)
		local sorterC = RankMgrC:GetRank(rankName)
		if sorterC ~= nil then
			return RankSorterAdapter(sorterC)
		end
		
		if rankName == 'roleWorldBoss' then
			return RoleWorldBossRankSorter:new()
		elseif rankName == 'allianceWorldBoss' then
			return AllianceWorldBossRankSorter:new()
		elseif rankName == 'countryWorldBoss' then
			return CountryWorldBossRankSorter:new()
		elseif rankName == 'alliance' then
			return AllianceRankSorter:new()
		else
			return nil
		end
	end;
})

Service:register('RankSorterMgr', RankSorterMgr:new())

RankTemplet = Class:extends({
	init = function(self)
		self._rankSorter = Service:getRankSorterMgr():getRankSorter(self:getRankName())
		self._fixTimer = FixTimer:new()
		self._timerCaller = TimerCaller:new(self:_getTimerId())
		self._timerCaller:register(self:_getTimeEventId(), Caller:new(0, self, self._onSortTimer))
	end;
	
	start = function(self)
		local lastRefreshTime = Service:getRankRefreshDB():getRefreshTime(self:getRankName())
		if (Util:getTime() - lastRefreshTime) >= 24*3600 then
			self:_sort()
			self:_sortEnd()
		else
			self._rankSorter:loadLast()
		end
		
		self._fixTimer:start(self:_getFixTime(), {self:_getTimeEventId()}, self._timerCaller)
	end;
	
	getPageCount = function(self, onePageNumber)
		local count = self._rankSorter:getCount()
		return math.ceil(count/onePageNumber)
	end;
	
	selectRanks = function(self, pageNo, onePageNumber)
		local count = self._rankSorter:getCount()
		local pageCount = self:getPageCount(onePageNumber)
		local fromIdx = (pageNo - 1)*onePageNumber
		local toIdx = math.min(fromIdx + onePageNumber - 1, count - 1)
		
		local ranks = {}
		for idx=fromIdx, toIdx, 1 do
			table.insert(ranks, self._rankSorter:get(idx))
		end
		return ranks
	end;
	
	getIdxByName = function(self, roleName)
		return self._rankSorter:getIdxByName(roleName)
	end;
	
	getRankName = function(self)
		return 'comm'
	end;	
	
	clearRanks = function(self)
		self._rankSorter:clearRanks()
	end;
	
	addRank = function(self, rank)
		self._rankSorter:addRank(rank)
	end;
	
	getCount = function(self)
		return self._rankSorter:getCount()
	end;
	
	get = function(self, idx)
		return self._rankSorter:get(idx)
	end;
	
	_onSortTimer = function(self)
		self:_sort()
	end;	
	
	_sort = function(self)
		local ret = self._rankSorter:sort()
		if ret == RET_RANK_SORTER_REFRESH then
			Service:getRankRefreshDB():updateRefreshTime(self:getRankName())
		elseif ret == RET_RANK_SORTER_SORT then
			Service:getRankRefreshDB():updateRefreshTime(self:getRankName())
			Service:getRankRefreshDB():updateSortTime(self:getRankName())
		end
	end;
	
	_sortEnd = function(self)
	end;
})

ActTowerRank = RankTemplet:extends({
	getRankName = function(self)
		return 'actTower'
	end;

	_getTimerId = function(self)
		return TIMER_ID.ACTTOWER_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.SORT_ACTTOWER_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=0, sec=15}
	end;
	
	_sortEnd = function(self)
		local count = self._rankSorter:getCount()
		for i=0, count-1 do
			local grid = self._rankSorter:get(i)
			app:getCityMgr():pushSaveGrid(grid, {'misc'})
		end
	end;	
})


