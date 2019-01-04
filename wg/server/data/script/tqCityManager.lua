require('tqFieldLevelRefresher')

GridsBD = Class:extends({
	init = function(self, gapp, tableName, isEvalMisc)
		self._conn = gapp:getDBConn()
		self._tableName = tableName
		self._isEvalMisc = isEvalMisc
		self._allFields = { 'gridId',
			'objType',
			'resId',
			'modelId',
			'subCitys',
			'roleId',
			'roleName',
			'userName',
			'icon',
			'level',
			'sex',
			'state',
			'allianceId',
			'enemyAlliId',
			'refreshTime',
			'alliName',
			'cityLevel',
			'buildCurVal',
			'roleRank',
			'introduction',
			'loginTime',
			'misc',
		}
	end;
	
	getAllRoleGrids = function(self, fields, cond)
		if fields == nil then
			fields = self._allFields
		end
		
		if cond == nil then
			cond = "where objType=1"
		end
		
		local grids = {}
		local dbRows = self._conn:query("SELECT * FROM " .. self._tableName .. " " .. cond .. ";")
		if dbRows == nil then return grids end
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			local grid = {}
			for _, field in ipairs(fields) do
				grid[field] = dbRow:getFieldVal(field)
				if field == 'misc' and self._isEvalMisc then
					grid.misc = eval(dbRow:getFieldVal('misc'))
				end
			end
			table.insert(grids, grid)			
			dbRows:nextRow()
		end
		return grids
	end;
	
	getAllFreeGridIds = function(self)
		local gridIds = {}
		local dbRows = self._conn:query("SELECT gridId FROM " .. self._tableName .. " where objType=0;")
		if dbRows == nil then return gridIds end
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			local gridId = dbRow:getFieldVal('gridId')
			table.insert(gridIds, gridId)
			dbRows:nextRow()
		end
		return gridIds
	end;
	
	save = function(self, grid)
		local sets = ''
		for _, fieldName in ipairs(self._allFields) do
			if sets ~= '' then
				sets = sets..", "
			end
			
			sets = sets..fieldName.."='"..grid[fieldName].."'"
		end
		
		local sql = "update " .. self._tableName .. " set " .. sets .. " where gridId=" .. grid.gridId .. ";"
		self._conn:exec(sql)
	end;
	
	getGridIdByRoleName = function(self, roleName)
		local gridId = 0
		local dbRows = self._conn:query("SELECT * FROM " .. self._tableName .. " where objType=1 and roleName='" .. roleName .. "';")
		if dbRows == nil then return gridId end
		if dbRows:getRowCount() ~= 1 then return gridId end
		local dbRow = dbRows:getCurRow()
		local gridId = dbRow:getFieldVal('gridId')
		return gridId
	end;
	
	getRoleNameByRoleId = function(self, roleId)
		local dbRows = self._conn:query("SELECT roleName FROM " .. self._tableName .. " where objType=1 and roleId=" .. roleId .. ";")
		if dbRows == nil then return '' end
		if dbRows:getRowCount() ~= 1 then return '' end
		
		local dbRow = dbRows:getCurRow()
		return dbRow:getFieldVal('roleName')
	end;
})

CityManager = Class:extends({
	init = function(self, gapp)
		self.gapp = gapp
		self._timerCaller = TimerCaller:new(TIMER_ID.CITYMGR)
		self._fixTimer = FixTimer:new()
		self:_regTimers()
		
		self.cityResIdMapId = {
			[9900001] =1, 
			[9900002] = 2,
			[9900003] = 3,
			[9900004] = 4,}
		
		self.cityIdMapResId = {}
		for k, v in pairs(self.cityResIdMapId) do
			self.cityIdMapResId[v] = k
		end
		
		self.allFields = { 'gridId',
			'objType',
			'resId',
			'modelId',
			'subCitys',
			'roleId',
			'roleName',
			'userName',
			'icon',
			'level',
			'sex',
			'state',
			'allianceId',
			'enemyAlliId',
			'refreshTime',
			'alliName',
			'cityLevel',
			'buildCurVal',
			'roleRank',
			'introduction',
			'loginTime',
			'misc',
		}
		
		self.fieldLevelRefresher = FieldLevelRefresher()
		self.exileRolesRefresher = ExileRolesRefresher()
		self._savegrids = {}
		self._savegridPos = 1
	end;
	
	load = function(self)	
		out:print( 'load city ... ' )
		GridsMgr:SetMapView(res_mapview[1], res_mapview[2], res_mapview[3], res_mapview[4])
		if not GridsMgr:Load() then
			return false
		end
		out:print( 'load city ok', 'printTime' )
		
		self:_startTimer()
		
		return true
	end;
	
	getRandCityIds = function(self)
		local cityIds = {9900001, 9900002, 9900003}
		local arrayLen = table.getn(cityIds)
		for i=1, arrayLen, 1 do
			local a = math.random(arrayLen)
			local b = math.random(arrayLen)
			local tmp = cityIds[a]
			cityIds[a] = cityIds[b]
			cityIds[b] = tmp
		end
		return cityIds
	end;
	
	hasFreeGrid = function(self, cityResId)
		return GridsMgr:GetFreeGridId( self:_getCityIdByCityResId(cityResId) ) > 0
	end;
	
	getFreeCityPos = function(self, cityResId)
		local gridId = GridsMgr:GetFreeGridId( self:_getCityIdByCityResId(cityResId) )
		if gridId < 0 then
			return nil 
		end
		
		return self:getPosByGridId(gridId)
	end;
	
	getGridByGridId = function(self, gridId)
		return GridsMgr:GetGridById(gridId)
	end;
	
	getGridByPos = function(self, pos)
		local gridId = self:_getGridIdByPos(pos)
		return GridsMgr:GetGridById(gridId)
	end;
	
	getPosByGridId = function(self, gridId)
		local pos = {x=0, y=0}
		pos.x, pos.y = GridsMgr:GetPosByGridId(gridId, pos.x, pos.y)
		return pos
	end;
	
	getGridByRoleId = function(self, roleId)
		local gridId = GridsMgr:GetGridIdByRoleId(roleId)
		if gridId == -1 then
			local grid = GridsMgr:GetExileGridByRoleId(roleId)
			return self:_getRoleGrid(grid, roleId)
		end
		
		local grid = GridsMgr:GetGridById(gridId)
		return self:_getRoleGrid(grid, roleId)
	end;
	
	getRoleNameByRoleId = function(self, roleId)
		local grid = self:getGridByRoleId(roleId)
		if grid == nil then return '' end
		return grid.roleName
	end;
	
	getGridByRoleName = function(self, roleName)
		local roleId = GridsMgr:GetRoleIdByRoleName(roleName)
		return self:getGridByRoleId(roleId)
	end;
	
	getRoleIdByRoleName = function(self, roleName)
		return GridsMgr:GetRoleIdByRoleName(roleName)
	end;
	
	getAlliIdByRoleName = function(self, roleName)
		local grid = self:getGridByRoleName(roleName)
		if grid == nil then
			return 0
		end
		return grid.allianceId
	end;
	
	getCityResIdByPos = function(self, pos)
		local gridId = self:_getGridIdByPos(pos)
		local cityId = GridsMgr:GetCityIdByGridId(gridId)
		local cityResId = self.cityIdMapResId[cityId]
		if cityResId == nil then
			return -1
		end
		
		return cityResId
	end;
	
	initPlayerGrid = function(self, player)
		self:_initPlayerGrid(player, true)
	end;
	
	resetPlayerGrid = function(self, player)
		self:_initPlayerGrid(player, false)
	end;
	
	_initPlayerGrid = function(self, player, clearGrid)
		local grid = self:getGridByPos(player:getCityPos())
		if grid == nil then
			return
		end
		
		if clearGrid then
			self:_clearRoleGrid(grid)
		end
		
		player:setCityGrid(grid)
		
		GridsMgr:MapRoleIdToGridId(player:getRoleId(), grid.gridId)
		GridsMgr:MapRoleNameToRoleId(player:getRoleName(), player:getRoleId())
		
		RankMgrC:AddNewRole(player:getRoleId())	
	end;
	
	copyGrid = function(self, desgrid, srcgrid)
		GridsMgr:CopyGrid(desgrid, srcgrid)
	end;
	
	freeCityPos = function(self, pos)
		local grid = self:getGridByPos(pos)
		if grid == nil then 
			return
		end
		
		RankMgrC:RemoveRole(grid.roleId)
		GridsMgr:MapRoleIdToGridId(grid.roleId, -1)
		GridsMgr:MapRoleNameToRoleId(grid.roleName, -1)
		
		self:_clearGrid(grid)
		self:saveAllGrids(grid)
	end;
	
	occupyFieldGrid = function(self, player, grid)
		if grid == nil or grid.objType ~= OBJ_TYPE.FIELD then
			return
		end
		
		grid.roleId = player:getRoleId()
		grid.roleName = player:getRoleName()
		self:saveGrid(grid, {'roleId', 'roleName'})
	end;
	
	clearOccupyFieldGrid = function(self, gridId)
		local grid = GridsMgr:GetGridById(gridId)
		if grid == nil or grid.objType ~= OBJ_TYPE.FIELD then
			return
		end
		
		grid.roleId = 0
		grid.roleName = ''
		self:saveGrid(grid, {'roleId', 'roleName'})
	end;	
	
	saveAllGrids = function(self, grid)
		self:saveGrid(grid, self.allFields)
	end;
	
	pushSaveGrid = function(self, grid, fields)
		table.insert(self._savegrids, {grid=grid, fields=fields})
	end;
	
	saveGrid = function(self, grid, fields)
		local sql = self:_getSaveGridSql(grid, fields)
		if sql == '' then
			return
		end
		
		self.gapp:getDBConn():exec(sql)
	end;
	
	appendExileGrid = function(self, grid)
		GridsMgr:AppendExileGrid(grid)
		local exileGrid = self:getExileGridByRoleId(grid.roleId)
		self:_saveExileGrid(exileGrid)
	end;
	
	removeExileGridByRoleId = function(self, roleId)
		GridsMgr:RemoveExileGridByRoleId(roleId)
		self:_removeExileGrid(roleId)
	end;
	
	getExileGridByRoleId = function(self, roleId)
		return GridsMgr:GetExileGridByRoleId(roleId)
	end;	
	
	mapRoleNameToRoleId = function(self, roleName, roleId)
		GridsMgr:MapRoleNameToRoleId(roleName, roleId)
	end;
	
	safeExit = function(self)
		self:_saveGridByStep(100000000)
	end;
	
	startRefreshFieldLevel = function(self)
		self:_startRefreshFieldLevel()
	end;
	
	_regTimers = function(self)
		self._timerCaller:register(TIMER_EVT.START_REFRESHFIELDLEVEL, Caller:new(0, self, self._onStartTimer))
		self._timerCaller:register(TIMER_EVT.REFRESHFIELDLEVEL, Caller:new(0, self, self._onRefreshTimer))
		self._timerCaller:register(TIMER_EVT.SAVEGRID, Caller:new(0, self, self._onSaveGridTimer))
	end;	
	
	_saveExileGrid = function(self, grid)
		local sql = self:_getInsertExileGridSql(grid, self.allFields)
		if sql == '' then
			return
		end
		
		self.gapp:getDBConn():exec(sql)
	end;
	
	_removeExileGrid = function(self, roleId)
		local sql = 'delete from exilegrids where roleId=' .. roleId .. ';'
		self.gapp:getDBConn():exec(sql)
	end;
	
	refreshExileRoleIds = function(self)
		GridsMgr:RefreshExileRoleIds()
	end;
	
	_getRoleGrid = function(self, grid, roleId)
		if grid == nil then
			return nil
		end
		
		if (grid.objType ~= OBJ_TYPE.ROLE and grid.objType ~= OBJ_TYPE.DIED_ROLE) or (grid.roleId ~= roleId) then
			return nil 
		end
		
		return grid
	end;	

	_clearRoleGrid = function(self, grid)
		self:_clearGrid(grid)
		grid.objType = OBJ_TYPE.ROLE
		grid.loginTime = Util:getTime()
	end;
	
	_startTimer = function(self)
		self._fixTimer:start({hour=res_refresh_fieldlevel_dayhour, min=0, sec=0}, {TIMER_EVT.START_REFRESHFIELDLEVEL}, self._timerCaller)
		global.getTimer():start(2*1000, {TIMER_EVT.SAVEGRID}, self._timerCaller)
	end;
	
	_onStartTimer = function(self)
		self:_startRefreshFieldLevel()
	end;
	
	_startRefreshFieldLevel = function(self)
		self.exileRolesRefresher:start()
		self.fieldLevelRefresher:start()
		global.getTimer():start(1*1000, {TIMER_EVT.REFRESHFIELDLEVEL}, self._timerCaller)
		LOG('start refresh map grids')
	end;
	
	_onRefreshTimer = function(self, timer)
		self.exileRolesRefresher:refresh()
		self.fieldLevelRefresher:refresh()
		if self.exileRolesRefresher:isComplete() and self.fieldLevelRefresher:isComplete() then
			LOG(' refresh map grids stop')
			timer:stop()
		end
	end;
	
	_onSaveGridTimer = function(self, timer)
		self:_saveGridByStep(100)
	end;
	
	_saveGridByStep = function(self, step)
		local totalCnt = table.getn(self._savegrids)
		if self._savegridPos > totalCnt then
			if totalCnt > 0 then
				self._savegridPos = 1
				self._savegrids = {}
			end
			return 
		end
		
		local toPos = self._savegridPos + step
		if toPos > totalCnt then
			toPos = totalCnt
		end
		
		for pos=self._savegridPos, toPos do
			local node = self._savegrids[pos]
			self:saveGrid(node.grid, node.fields)
		end
		
		self._savegridPos = toPos + 1	
	end;
	
	_getCityIdByCityResId = function(self, cityResId)
		local cityId = self.cityResIdMapId[cityResId]
		if cityId == nil then
			return -1
		end
		return cityId
	end;	
	
	_clearGrid = function(self, grid)
		local gridId = grid.gridId
		GridsMgr:ClearGrid(grid)
		grid.gridId = gridId
		grid.objType = OBJ_TYPE.NONE
		grid.resId = FIXID.PINGDIFIELDID
		grid.modelId = res_fields[FIXID.PINGDIFIELDID - FIXID.FIRSTFIELDID + 1].models[1]
	end;

	_getSaveGridSql = function(self, grid, fields)
		if grid == nil or table.getn(fields) == 0 then
			return ''
		end
		
		local sets = ''
		for _, fieldName in ipairs(fields) do
			if sets ~= '' then
				sets = sets..", "
			end
			
			if fieldName == 'misc' then
				sets = sets..fieldName.."=\'" .. self:_makeGridMiscStr(grid) .. "\'"
			else
				sets = sets..fieldName.."='"..grid[fieldName].."'"
			end
		end
		
		return "update mapgrids set "..sets.." where gridId="..grid.gridId..";"		
	end;
	
	_getInsertExileGridSql = function(self, grid, fields)
		if grid == nil or table.getn(fields) == 0 then
			return ''
		end
		
		local values = ''
		for _, fieldName in ipairs(fields) do
			if values ~= '' then
				values = values .. ", "
			end
			
			if fieldName == 'misc' then
				values = values .. "\'" .. self:_makeGridMiscStr(grid) .. "\'"
			else
				values = values .. "\'" .. grid[fieldName]  .. "\'"
			end
		end
		
		return "insert into exilegrids values(" .. values .. ");"
	end;
	
	_makeGridMiscStr = function(self, grid)
		local misc = "{shiChangLevel=" .. grid.misc.shiChangLevel .. ",towerLayer=" .. grid.misc.towerLayer .. ",towerTime=" .. grid.misc.towerTime .. ",towerRank=" .. grid.misc.towerRank .. ",buildValTime=" .. grid.misc.buildValTime .. ",terraceGate=" .. grid.misc.terraceGate .. ",cityMaxLevel=" .. grid.misc.cityMaxLevel .. ',vip_level=' .. grid.misc.vip_level .. ',lastRoleLevel=' .. grid.misc.lastRoleLevel .. ',lastBuildVal=' .. grid.misc.lastBuildVal .. ',lastTowerLayer=' .. grid.misc.lastTowerLayer .. ',lastTowerTime=' .. grid.misc.lastTowerTime
		for _, k in ipairs(g_qqMembershipFields) do
			if grid.misc[k] ~= nil and grid.misc[k] > 0 then
				misc = misc .. ',' .. k .. '=' .. grid.misc[k]
			end
		end
		misc = misc .. '}'
		return misc
	end;
	
	_getGridIdByPos = function(self, pos)
		if not self:_isPosInCityRange(pos) then
			return -1
		end
		return pos.y*GRIDS_COL + pos.x + 1
	end;
	
	_isPosInCityRange = function(self, pos)
		if (pos.x < 0) or (pos.x >= GRIDS_COL) then	
			return false
		end
		
		if (pos.y < 0) or (pos.y >= GRIDS_ROW) then	
			return false
		end
		
		return true
	end;
	
})


