require('tqCityManager')

local TestCaseCityManager = TestCase:extends({
	setUp = function(self)
		global.initTimer()
		self.cityMgr = CityManager:new(app)
		TestCaseHelper:createPlayer(self)
		self.player:setName('user')
		self.player:setRoleName('role')
		self.player:setRoleId(1001)
		self.player:setLevel(2)
		self.player:setState(1)
		self.player:setAlliId(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_load = function(self)
		self.vb:replace(out, 'print', function() end)
		
		local r_Load = {false}
		self.mm:mock(GridsMgr, 'Load', r_Load)
		self.mm:mock(self.cityMgr, '_startTimer')
		assertEQ ( self.cityMgr:load(), false )
		assertEQ ( self.mm.walkLog, 'Load' )
		
		self.mm:clear()
		r_Load[1] = true
		assertEQ ( self.cityMgr:load(), true )
		assertEQ ( self.mm.walkLog, 'Load,_startTimer' )
	end;
	
	test_getRandCityIds = function(self)
		local checks = {count=3, starti=9900001, endi=9900003}
		
		local cityIds = self.cityMgr:getRandCityIds()
		assertEQ( table.getn(cityIds), checks.count )
		for cityId=checks.starti, checks.endi, 1 do
			assert ( Util:find(cityIds, nil, cityId) ~= nil ) 
		end
	end;
	
	test_hasFreeGrid = function(self)
		local r_GetFreeGridId = {-1}
		self.mm:mock(self.cityMgr, '_getCityIdByCityResId', {1})
		self.mm:mock(GridsMgr, 'GetFreeGridId', r_GetFreeGridId)
		
		local p_cityResId = 9900001
		assertEQ ( self.cityMgr:hasFreeGrid(p_cityResId), false )
		assertEQ ( self.mm.params['_getCityIdByCityResId'], {9900001} )
		
		r_GetFreeGridId[1] = 1
		assertEQ ( self.cityMgr:hasFreeGrid(p_cityResId), true )
	end;
	
	test_getFreeCityPos = function(self)
		local r_GetFreeGridId = {-1}
		self.mm:mock(self.cityMgr, '_getCityIdByCityResId', {1})
		self.mm:mock(GridsMgr, 'GetFreeGridId', r_GetFreeGridId)
		self.mm:mock(self.cityMgr, 'getPosByGridId', {{x=1, y=2}})
		
		local p_cityResId = 9900001
		assertEQ ( self.cityMgr:getFreeCityPos(p_cityResId, self.player), nil )
		
		self.mm:clear()
		r_GetFreeGridId[1] = 10
		assertEQ ( self.cityMgr:getFreeCityPos(p_cityResId, self.player), {x=1, y=2} )
		assertEQ ( self.mm.walkLog, '_getCityIdByCityResId,GetFreeGridId,getPosByGridId' )
		assertEQ ( self.mm.params['_getCityIdByCityResId'], {9900001} )
		assertEQ ( self.mm.params['GetFreeGridId'], {1} )
		assertEQ ( self.mm.params['getPosByGridId'], {10} )
	end;
	
	test_getGridByGridId = function(self)
		self.mm:mock(GridsMgr, 'GetGridById', {{name='grid'}})
		assertEQ ( self.cityMgr:getGridByGridId(1), {name='grid'} )
		assertEQ ( self.mm.params['GetGridById'], {1} )
	end;
	
	test_getGridByPos = function(self)
		self.mm:mock(self.cityMgr, '_getGridIdByPos', {1})
		self.mm:mock(GridsMgr, 'GetGridById', {{name='grid'}})
		assertEQ ( self.cityMgr:getGridByPos({x=1, y=2}), {name='grid'})
		assertEQ ( self.mm.params['_getGridIdByPos'], {{x=1, y=2}} )
		assertEQ ( self.mm.params['GetGridById'], {1} )
	end;
	
	test_getPosByGridId = function(self)
		self.mm:mock(GridsMgr, 'GetPosByGridId', {1,2})
		assertEQ ( self.cityMgr:getPosByGridId(10), {x=1, y=2} )
		assertEQ ( self.mm.params['GetPosByGridId'], {10,0,0} )
	end;
	
	test_getGridByRoleId = function(self)
		local r_GetGridById = {nil}
		local r_GetExileGridByRoleId = {nil}
		GridsMgr:MapRoleIdToGridId(1001, 1)
		self.mm:mock(GridsMgr, 'GetGridById', r_GetGridById)
		self.mm:mock(GridsMgr, 'GetExileGridByRoleId', r_GetExileGridByRoleId)
		
		assertEQ ( self.cityMgr:getGridByRoleId(1002), nil )
		assertEQ ( self.cityMgr:getGridByRoleId(1001), nil )
		
		r_GetGridById[1] = {objType=OBJ_TYPE.NONE, roleId=1001}
		assertEQ ( self.cityMgr:getGridByRoleId(1001), nil )
		
		r_GetGridById[1] = {objType=OBJ_TYPE.ROLE, roleId=1002}
		assertEQ ( self.cityMgr:getGridByRoleId(1001), nil )
		
		r_GetGridById[1] = {objType=OBJ_TYPE.ROLE, roleId=1001}
		assertEQ ( self.cityMgr:getGridByRoleId(1001), r_GetGridById[1] )
		
		r_GetGridById[1] = {objType=OBJ_TYPE.DIED_ROLE, roleId=1001}
		assertEQ ( self.cityMgr:getGridByRoleId(1001), r_GetGridById[1] )
		
		GridsMgr:MapRoleIdToGridId(1003, -1)
		r_GetExileGridByRoleId[1] = {objType=OBJ_TYPE.ROLE, roleId=1003}
		assertEQ ( self.cityMgr:getGridByRoleId(1003), r_GetExileGridByRoleId[1] )
	end;
	
	test_getGridByRoleName = function(self)
		GridsMgr:MapRoleNameToRoleId('role', 1001)
		self.mm:mock(self.cityMgr, 'getGridByRoleId', {{name='grid'}})
		assertEQ ( self.cityMgr:getGridByRoleName('role'), {name='grid'} )
		assertEQ ( self.mm.params['getGridByRoleId'], {1001} )
	end;
	
	test_getCityResIdByPos = function(self)
		self.mm:mock(self.cityMgr, '_getGridIdByPos', {1})
		self.mm:mock(GridsMgr, 'GetCityIdByGridId', {2})
		self.cityMgr.cityIdMapResId[2] = nil
		assertEQ ( self.cityMgr:getCityResIdByPos({x=1, y=2}), -1 )
		assertEQ ( self.mm.params['_getGridIdByPos'], {{x=1, y=2}})
		assertEQ ( self.mm.params['GetCityIdByGridId'], {1})
		
		self.cityMgr.cityIdMapResId[2] = 9900002
		assertEQ ( self.cityMgr:getCityResIdByPos({x=1, y=2}), 9900002 )
	end;
	
	test_initPlayerGrid = function(self)
		local grid = {name='grid', gridId=1}
		self.player:setCityPos({x=0, y=0})
		self.mm:mock( self.cityMgr, 'getGridByPos', {grid} )
		self.mm:mock( self.cityMgr, '_clearRoleGrid' )
		self.mm:mock( self.player, 'setCityGrid' )
		self.mm:mock( RankMgrC, 'AddNewRole' )
		self.cityMgr:initPlayerGrid(self.player)
		assertEQ ( self.mm.walkLog, 'getGridByPos,_clearRoleGrid,setCityGrid,AddNewRole' )
		assertEQ ( self.mm.params['getGridByPos'], {self.player:getCityPos()} )
		assertEQ ( self.mm.params['_clearRoleGrid'], {grid} )
		assertEQ ( self.mm.params['setCityGrid'], {grid} )
		assertEQ ( self.mm.params['AddNewRole'], {self.player:getRoleId()} )
		assertEQ ( GridsMgr:GetGridIdByRoleId(1001), grid.gridId )
		assertEQ ( GridsMgr:GetRoleIdByRoleName('role'), 1001 )
	end;
	
	test_freeCityPos = function(self)
		local r_getGridByPos = {nil}
		self.mm:mock(self.cityMgr, 'getGridByPos', r_getGridByPos)
		self.mm:mock(self.cityMgr, '_clearGrid')
		self.mm:mock(self.cityMgr, 'saveAllGrids')
		self.mm:mock( RankMgrC, 'RemoveRole' )
		self.mm:travelMock( GridsMgr, 'MapRoleIdToGridId' )
		self.mm:travelMock( GridsMgr, 'MapRoleNameToRoleId' )
		
		local p_pos = {x=1, y=2}
		self.cityMgr:freeCityPos(p_pos)
		assertEQ ( self.mm.walkLog, 'getGridByPos' )
		assertEQ ( self.mm.params['getGridByPos'], {p_pos} )
		
		GridsMgr:MapRoleIdToGridId(1001, 1)
		GridsMgr:MapRoleNameToRoleId('role', 1)
		
		self.mm:clear()
		r_getGridByPos[1] = {roleId=1001, roleName='role'}
		self.cityMgr:freeCityPos(p_pos)
		assertEQ ( self.mm.walkLog, 'getGridByPos,RemoveRole,MapRoleIdToGridId,MapRoleNameToRoleId,_clearGrid,saveAllGrids' )
		assertEQ ( self.mm.params['RemoveRole'], {self.player:getRoleId()} )
		assertEQ ( self.mm.params['_clearGrid'], {r_getGridByPos[1]} )
		assertEQ ( self.mm.params['saveAllGrids'], {r_getGridByPos[1]} )
		assertEQ ( GridsMgr:GetGridIdByRoleId(1001), -1 )
		assertEQ ( GridsMgr:GetRoleIdByRoleName('role'), -1 )
	end;
	
	test_occupyFieldGrid = function(self)
		self.mm:mock(self.cityMgr, 'saveGrid')
		
		local r_grid = nil
		self.cityMgr:occupyFieldGrid(self.player, r_grid)
		assertEQ ( self.mm.walkLog, '' )
		
		r_grid = {objType=OBJ_TYPE.ROLE}
		self.cityMgr:occupyFieldGrid(self.player, r_grid)
		assertEQ ( self.mm.walkLog, '' )
		
		r_grid = {objType=OBJ_TYPE.FIELD, roleId=0}
		self.cityMgr:occupyFieldGrid(self.player, r_grid)
		assertEQ ( self.mm.walkLog, 'saveGrid' )
		assertEQ ( self.mm.params['saveGrid'], {r_grid, {'roleId','roleName'}})
		assertEQ ( r_grid.roleId, self.player:getRoleId())
		assertEQ ( r_grid.roleName, self.player:getRoleName())
	end;
	
	test_clearOccupyFieldGrid = function(self)
		local r_grid = {nil}
		self.mm:mock(GridsMgr, 'GetGridById', r_grid)
		self.mm:mock(self.cityMgr, 'saveGrid')
		
		self.cityMgr:clearOccupyFieldGrid(1)
		assertEQ ( self.mm.walkLog, 'GetGridById' )
		
		self.mm:clear()
		r_grid[1] = {gridId=1, objType=OBJ_TYPE.ROLE}
		self.cityMgr:clearOccupyFieldGrid(1)
		assertEQ ( self.mm.walkLog, 'GetGridById' )
		
		self.mm:clear()
		r_grid[1] = {gridId=1, objType=OBJ_TYPE.FIELD, roleId=1, roleName='role'}
		self.cityMgr:clearOccupyFieldGrid(1)
		assertEQ ( self.mm.walkLog, 'GetGridById,saveGrid' )
		assertEQ ( self.mm.params['saveGrid'], {r_grid[1], {'roleId', 'roleName'}})
		assertEQ ( r_grid[1].roleId, 0)
		assertEQ ( r_grid[1].roleName, '')
	end;
	
	test_saveAllGrids = function(self)
		self.mm:mock(self.cityMgr, 'saveGrid')
		
		local p_grid = {gridId=1}
		self.cityMgr:saveAllGrids(p_grid)
		assertEQ ( self.mm.params['saveGrid'], {p_grid, self.cityMgr.allFields} )
	end;
	
	test_saveGrid = function(self)
		local r_getSaveGridSql = {''}
		self.mm:mock(self.cityMgr, '_getSaveGridSql', r_getSaveGridSql)
		self.mm:mock(app:getDBConn(), 'exec')
		
		local p_grid = {gridId=1}
		local p_fields = {'roleId'}
		self.cityMgr:saveGrid(p_grid, p_fields)
		assertEQ ( self.mm.walkLog, '_getSaveGridSql' )
		assertEQ ( self.mm.params['_getSaveGridSql'], {p_grid, p_fields} )
		
		self.mm:clear()
		r_getSaveGridSql[1] = 'update mapgrids set roleId=0 where gridId=1;'
		self.cityMgr:saveGrid(p_grid, p_fields)
		assertEQ ( self.mm.walkLog, '_getSaveGridSql,exec' )
		assertEQ ( self.mm.params['exec'], {r_getSaveGridSql[1]} )
	end;
	
	test__saveExileGrid = function(self)
		self.vb:replace(self.cityMgr, 'allFields', {'gridId','roleId'} )
		
		local r_getInsertExileGridSql = {''}
		self.mm:mock(self.cityMgr, '_getInsertExileGridSql', r_getInsertExileGridSql)
		self.mm:mock(app:getDBConn(), 'exec')
		
		local p_grid = {gridId=1,roleId=2}
		self.cityMgr:_saveExileGrid(p_grid)
		assertEQ ( self.mm.walkLog, '_getInsertExileGridSql' )
		assertEQ ( self.mm.params['_getInsertExileGridSql'], {p_grid, self.cityMgr.allFields} )
		
		self.mm:clear()
		r_getInsertExileGridSql[1] = "insert into exilegrids values('1','2');"
		self.cityMgr:_saveExileGrid(p_grid)
		assertEQ ( self.mm.walkLog, '_getInsertExileGridSql,exec' )
		assertEQ ( self.mm.params['exec'], {r_getInsertExileGridSql[1]} )
	end;
	
	test__removeExileGrid = function(self)
		local roleId=1
		self.mm:mock(app:getDBConn(), 'exec')
		self.cityMgr:_removeExileGrid(roleId)
		local sql = "delete from exilegrids where roleId=1;"
		assertEQ ( self.mm.params['exec'], {sql} )
	end;
	
	test__clearRoleGrid = function(self)
		self.mm:mock(self.cityMgr, '_clearGrid')
		
		local p_grid = {objType=OBJ_TYPE.NONE}
		self.cityMgr:_clearRoleGrid(p_grid)
		assertEQ ( self.mm.params['_clearGrid'], {p_grid} )
		assertEQ ( p_grid.objType,  OBJ_TYPE.ROLE)
	end;
	
	test__onStartTimer = function(self)
		self.mm:nologMock(self.cityMgr.exileRolesRefresher, 'refresh:refresh1')
		self.mm:nologMock(self.cityMgr.exileRolesRefresher, 'isComplete:isComplete1', {true})
		self.mm:nologMock(self.cityMgr.fieldLevelRefresher, 'refresh:refresh2')
		self.mm:nologMock(self.cityMgr.fieldLevelRefresher, 'isComplete:isComplete2', {true})
		
		self.mm:mock(self.cityMgr.exileRolesRefresher, 'start:start1')
		self.mm:mock(self.cityMgr.fieldLevelRefresher, 'start:start2')
		
		--1388696400  2014-01-03  5:00:00
		Util:setTimeDrt(1388696400)
		os.setClockMs(0)
		self.cityMgr:_startTimer()
		Util:setTimeDrt(1388696400 + 1*3600 - 1)
		os.setClockMs((1*3600 - 1)*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		Util:setTimeDrt(1388696400 + 1*3600)
		os.setClockMs(1*3600*1000)
		global.getTimer():update()  -- 触发了_onStartTimer
		assertEQ ( self.mm.walkLog, 'start1,start2' )
		
		self.mm:clear()
		Util:setTimeDrt(1388696400 + 1*3600 + 24*3600 - 1)
		os.setClockMs((1*3600 + 24*3600 - 1)*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		Util:setTimeDrt(1388696400 + 1*3600 + 24*3600)
		os.setClockMs((1*3600 + 24*3600)*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, 'start1,start2', '24小时后继续触发' )
	end;	
	
	test__onRefreshTimer = function(self)
		local g_isCompleteRt1 = {false}
		self.mm:mock(self.cityMgr.exileRolesRefresher, 'refresh:refresh1')
		self.mm:mock(self.cityMgr.exileRolesRefresher, 'isComplete:isComplete1', g_isCompleteRt1)
		local g_isCompleteRt2 = {false}
		self.mm:mock(self.cityMgr.fieldLevelRefresher, 'refresh:refresh2')
		self.mm:mock(self.cityMgr.fieldLevelRefresher, 'isComplete:isComplete2', g_isCompleteRt2)
		
		--1388696400  2014-01-03  5:00:00
		Util:setTimeDrt(1388696400)
		os.setClockMs(0)
		self.cityMgr:_startTimer()
		Util:setTimeDrt(1388696400 + 1*3600 - 1)
		os.setClockMs((1*3600 - 1)*1000)
		global.getTimer():update()
		Util:setTimeDrt(1388696400 + 1*3600)
		os.setClockMs(1*3600*1000)
		global.getTimer():update()  -- 触发了_onStartTimer，同时start TIMER_EVT.REFRESHFIELDLEVEL 时钟
		Util:setTimeDrt(1388696400 + 1*3600 + 1)
		os.setClockMs((1*3600 + 1)*1000) 
		global.getTimer():update() -- 触发了_onRefreshTimer
		assertEQ ( self.mm.walkLog, 'refresh1,refresh2,isComplete1' )
		assertEQ ( global.getTimer():isStoped(), false )
		
		self.mm:clear()
		g_isCompleteRt1[1] = true
		Util:setTimeDrt(1388696400 + 1*3600 + 2)
		os.setClockMs((1*3600 + 2)*1000) 
		global.getTimer():update() -- 触发了_onRefreshTimer
		assertEQ ( self.mm.walkLog, 'refresh1,refresh2,isComplete1,isComplete2' )
		assertEQ ( global.getTimer():isStoped(), false )
		
		self.mm:clear()
		g_isCompleteRt2[1] = true
		Util:setTimeDrt(1388696400 + 1*3600 + 3)
		os.setClockMs((1*3600 + 3)*1000) 
		global.getTimer():update() -- 触发了_onRefreshTimer
		assertEQ ( self.mm.walkLog, 'refresh1,refresh2,isComplete1,isComplete2' )
		assertEQ ( global.getTimer():isStoped(), true )
	end;
	
	test__getCityIdByCityResId = function(self)
		assertEQ ( self.cityMgr:_getCityIdByCityResId(9900001), 1 )
	end;
	
	test__clearGrid = function(self)
		local p_grid = {}
		self.cityMgr:_clearGrid(p_grid)
		assertEQ( p_grid.objType, OBJ_TYPE.NONE )
		assertEQ( p_grid.resId, FIXID.PINGDIFIELDID )
		assertEQ( p_grid.roleId, 0 )
		assertEQ( p_grid.modelId, 17000601 )
		assertEQ( p_grid.roleName, '' )
		assertEQ( p_grid.userName, '' )
		assertEQ( p_grid.subCitys, '' )
		assertEQ( p_grid.level, 0 )
		assertEQ( p_grid.sex, 0 )
		assertEQ( p_grid.state, 0 )
		assertEQ( p_grid.icon, 0 )
		assertEQ( p_grid.allianceId, 0 )
		assertEQ( p_grid.enemyAlliId, 0 )
		assertEQ( p_grid.refreshTime, 0 )
		assertEQ( p_grid.alliName, '' )
		assertEQ( p_grid.cityLevel, 0 )
		assertEQ( p_grid.buildCurVal, 0 )
		assertEQ( p_grid.roleRank, 0 )
		assertEQ( p_grid.introduction, '' )
		assertEQ( p_grid.loginTime, 0 )
	end;
	
	test__getSaveGridSql = function(self)
		local r_grid = nil
		local r_fields = {}
		assertEQ ( self.cityMgr:_getSaveGridSql(r_grid, r_fields), '' )
		
		r_grid = {gridId=1, roleId=1001, roleName='role'}
		assertEQ ( self.cityMgr:_getSaveGridSql(r_grid, r_fields), '' )
		
		r_fields = {'roleId', 'roleName'}
		assertEQ ( self.cityMgr:_getSaveGridSql(r_grid, r_fields), "update mapgrids set roleId='1001', roleName='role' where gridId=1;" )
	end;
	
	test__getGridIdByPos = function(self)
		local r_isPosInCityRange = {false}
		self.mm:mock(self.cityMgr, '_isPosInCityRange', r_isPosInCityRange)
		assertEQ ( self.cityMgr:_getGridIdByPos({x=1, y=2}), -1 )
		assertEQ ( self.mm.params['_isPosInCityRange'], {{x=1, y=2}})
		
		r_isPosInCityRange[1] = true
		assertEQ ( self.cityMgr:_getGridIdByPos({x=1, y=2}), 2*GRIDS_COL + 1 + 1 )
	end;
	
	test__isPosInCityRange = function(self)
		assertEQ ( self.cityMgr:_isPosInCityRange({x=-1, y=0}), false )
		assertEQ ( self.cityMgr:_isPosInCityRange({x=0, y=-1}), false )
		assertEQ ( self.cityMgr:_isPosInCityRange({x=GRIDS_COL, y=0}), false )
		assertEQ ( self.cityMgr:_isPosInCityRange({x=0, y=GRIDS_ROW}), false )
		assertEQ ( self.cityMgr:_isPosInCityRange({x=0, y=0}), true )
		assertEQ ( self.cityMgr:_isPosInCityRange({x=0, y=199}), true )
	end;
	
	test__makeGridMiscStr = function(self)
		local grid = TestCaseHelper:createGrid(1, OBJ_TYPE.ROLE, 10001, 'role', 'user')
		grid.misc.is_yellow_vip = 1
		grid.misc.yellow_vip_level = 2
		local expectStr = '{shiChangLevel=0,towerLayer=0,towerTime=0,towerRank=0,buildValTime=0,terraceGate=0,cityMaxLevel=0,vip_level=0,lastRoleLevel=0,lastBuildVal=0,lastTowerLayer=0,lastTowerTime=0,is_yellow_vip=1,yellow_vip_level=2}'
		assertEQ ( self.cityMgr:_makeGridMiscStr(grid), expectStr )
	end;
});

tqCityManager_t_main = function(suite)
	suite:addTestCase(TestCaseCityManager, 'TestCaseCityManager')
end;

