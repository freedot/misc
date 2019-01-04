--*******************************************************************************
RoleRank = RankTemplet:extends({
	getRankName = function(self)
		return 'role'
	end;
	
	_getTimerId = function(self)
		return TIMER_ID.ROLE_RANK
	end;
	
	_getTimeEventId = function(self)
		return TIMER_EVT.SORT_ROLE_RANK
	end;
	
	_getFixTime = function(self)
		return {hour=0, min=0, sec=10}
	end;
	
	_sortEnd = function(self)
		local count = self._rankSorter:getCount()
		for i=0, count-1 do
			local grid = self._rankSorter:get(i)
			app:getCityMgr():pushSaveGrid(grid, {'roleRank', 'misc'})
		end
	end;		
})


