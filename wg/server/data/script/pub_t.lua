package.path = ';.\\?.lua;.\\com\\?.lua'
_unit_test_ = true
MAX_BIGINT =  10000000000000

require('json')
require('root')
require('tqClass')
require('tqBaseClass')
require('testunit')
require('luaut')
require('tqDefs')
require('res.res_string')
require('tqTestData')
require('tqNetError')
require('tqUtfString')
require('tqDirtyWordChecker')
require('tqValidChecker')
require('tqRetDef')
require('tqUtil')
require('tqArmyMgr')
require('tqWorldBlessQueue')
require('tqWorldMsgQueue')
require('tqWUtil')
require('serverStartChecker')
require('res.res_fixid')
require('res.res_fixid_ex')
require('res.res_items')
require('res.res_build')
require('res.res_datas')
require('timer')

res_svr_mics_cfg = {
	svrOpenTime='2000-10-10', -- 开服时间
	payZoneId=1, 
};

res_mapview = {
	200,200,400,400
}


ServerStartChecker:start(true)

res_first_hero_minLevel = 1

local __clockMs = 0
os.setClockMs = function(ms)
	__clockMs = ms
end;

os.clockMs = function()
	return __clockMs
end;

debug.log = function(msg)
end;

local __log = ''
LOG = function(msg)
	__log = msg
end;

CLEAR_LOG = function()
	__log = ''
end;

GET_LOG = function()
	return __log
end;

ProxyServerC = Class:extends({
	init = function(self)
		self:clear()
	end;
	
	getSendMsg = function(self)	
		return self._msg
	end;
	
	clear = function(self)
		self._msg = ''
	end;
	
	sendMsg = function(self, msg )
		self._msg = msg
	end;
	
	connect = function(self, url)
		return false
	end;
}):new()

GridsMgr = Class:extends({
	init = function(self)
		self.grids = {}
		self.roleIdMapGridId = {}
		self.roleNameMapRoleId = {}
		self.exileGrids = {}
		self.exileCitysRoles = {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}}
	end;
	
	SetMapView = function(self)
	end;
	
	Load = function(self)
	end;
	
	GetGridById = function(self, id)
		return self.grids[id]
	end;
	
	ClearGrid = function(self, grid)
		grid.roleId = 0
		grid.modelId = 17000601
		grid.roleName = ''
		grid.userName = ''
		grid.subCitys = ''
		grid.level = 0
		grid.sex = 0
		grid.state = 0
		grid.icon = 0
		grid.allianceId = 0
		grid.enemyAlliId = 0
		grid.refreshTime = 0
		grid.alliName = ''
		grid.cityLevel = 0
		grid.buildCurVal = 0
		grid.roleRank = 0
		grid.introduction = ''
		grid.loginTime = 0
	end;
	
	CopyGrid = function(self, des, src)
		des.roleId =                      src.roleId                
		des.modelId =                    src.modelId 
		des.roleName =                  src.roleName 
		des.userName =                 src.userName 
		des.subCitys =                   src.subCitys  
		des.level =                        src.level  
		des.sex =                         src.sex 
		des.state =                       src.state 
		des.icon =                        src.icon 
		des.allianceId =                 src.allianceId 
		des.enemyAlliId =               src.enemyAlliId 
		des.refreshTime =              src.refreshTime
		des.alliName =                   src.alliName 
		des.cityLevel =                  src.cityLevel 
		des.buildCurVal =               src.buildCurVal 
		des.roleRank =                   src.roleRank  
		des.introduction =              src.introduction  
		des.loginTime =                  src.loginTime     		 
	end;
	
	GetCityIdByGridId = function(self, gridId)
		return 1
	end;
	
	GetFreeGridId = function(self, cityId)
		return 1
	end;
	
	GetPosByGridId = function(self, gridId)
		local x = math.floor((gridId-1)%GRIDS_COL)
		local y = math.floor((gridId-1)/GRIDS_COL)
		return x, y
	end;
	
	GetRoleIdByRoleName = function(self, roleName)
		local roleId = self.roleNameMapRoleId[roleName]
		if roleId == nil then
			return -1
		end
		return roleId
	end;
	
	GetGridIdByRoleId = function(self, roleId)
		local gridId = self.roleIdMapGridId[roleId]
		if gridId == nil then
			return -1
		end
		return gridId
	end;
	
	MapRoleNameToRoleId = function(self, roleName, roleId)
		self.roleNameMapRoleId[roleName] = roleId
	end;
	
	MapRoleIdToGridId = function(self, roleId, gridId)
		self.roleIdMapGridId[roleId] = gridId
	end;
	
	RefreshExileRoleIds = function(self)
	end;
	
	AppendExileGrid = function(self, grid)
		self.exileGrids[grid.roleId] = {}
		for k, v in pairs(grid) do
			self.exileGrids[grid.roleId][k] = v
		end
	end;	
	
	GetExileGridByRoleId = function(self, roleId)
		return self.exileGrids[roleId]
	end;
	
	RemoveExileGridByRoleId = function(self, roleId)
		self.exileGrids[roleId] = nil
	end;
	
	GetExileGridsCount = function(self, cityId)
		return table.getn(self.exileCitysRoles[cityId])
	end;
	
	GetExileRoleIdByIdx = function(self, cityId, idx)
		return self.exileCitysRoles[cityId][idx]
	end;
}):new()

ActTowerRankC = Class:extends({
	Sort = function(self)
	end;
	
	LoadLast = function(self)
	end;
	
	GetCount = function(self)
		return 11
	end;
	
	Get = function(self, idx)
		return {gridId=(idx+1)*10, roleId=(idx+1)*10000, roleName='role'..(idx + 1)
		,misc={towerLayer=100, towerTime=0, towerRank=idx+1, buildValTime=0, terraceGate=0, cityMaxLevel=1,
			is_yellow_vip = 0,
			is_yellow_year_vip = 0,
			yellow_vip_level = 0,
			is_yellow_high_vip = 0,
			is_blue_vip = 0,
			is_blue_year_vip = 0,
			blue_vip_level = 0,
			is_super_blue_vip = 0,
			_3366_grow_level = 0,
			vip_level = 0,
			lastRoleLevel = 0,
			lastBuildVal = 0,
			lastTowerLayer = idx,
			lastTowerTime = (idx+1)*100,
		}}
	end;
	
	GetIdxByName = function(self, roleName)
	end;
})

RoleRankC = Class:extends({
	Sort = function(self)
	end;
	
	LoadLast = function(self)
	end;
	
	GetCount = function(self)
		return 11
	end;
	
	Get = function(self, idx)
		return {gridId=(idx+1)*100, roleId=(idx+1)*100000, roleName='rrole'..(idx + 1), roleRank=idx+1,alliName='alli'..(idx+1), level=100, buildCurVal=10000000,
			misc={
				lastRoleLevel = (idx+1)*10,
				lastBuildVal = (idx+1)*1000,
				lastTowerLayer = 0,
				lastTowerTime = 0,
			}
		}
	end;
	
	GetIdxByName = function(self, roleName)
	end;
})

RankMgrC = Class:extends({
	init = function(self)
		self.actTowerRankC = ActTowerRankC:new()
		self.roleRankC = RoleRankC:new()
	end;
	
	GetRank = function(self, rankName)
		if rankName == 'actTower' then
			return self.actTowerRankC
		elseif rankName == 'role' then
			return self.roleRankC
		end
	end;
	
	StartChangeRolePos = function(self, roleId)
	end;
	
	AddNewRole = function(self, roleId)
	end;
	
	RemoveRole = function(self, roleId)
	end;
	
	EndChangeRolePos = function(self, roleId)
	end;
}):new()


SPub = GetScriptPub()
function IsDebug()
	return false
end

require('res.res_fixid')
require('res.res_herolevelexps')
require('res.res_items_builds')
require('res.res_items_farms')
require('res.res_citylevelneeds')
require('res.res_rolelevelexps')
require('res.res_inbuilds')
require('res.res_xingming')
require('res.res_heronames_filter_names')
require('res.res_officials')
require('res.res_herojingmai')
require('res.res_items_heroskills')
require('res.res_items_soldiers')
require('res.res_items_cultures')
require('res.res_soldiers_upd')
require('res.res_cultures_upd')
require('res.res_lineup')
require('res.res_copyfields')
require('res.res_fightmaps')
require('res.res_effects')
require('res.res_soldier_restriction')
require('res.res_fieldheros')
require('res.res_drops')
require('res.res_mailtemps')
require('res.res_fields')
require('res.res_acc_needgolds')
require('res.res_state_relations_raw')
require('res.res_smithy_salelist')
require('res.res_force_arms')
require('res.res_items_ex')
require('res.res_herosteel')
require('res.res_citydef')
require('res.res_icons')
require('res.res_alli_upd_needs')
require('res.res_alli_lawlight_upd')
require('res.res_citys_npcs')
require('res.res_tasks')
require('res.res_svr_mics_cfg')
require('res.res_dayacts')
require('res.res_activityval_tasks')
require('res.res_shops')
require('res.res_gms')
require('res.res_dirtywords')
require('res.res_exchanges')
require('res.res_yd')
require('res.res_pay_act')
require('res.res_vip')
require('res.res_bd')
require('res.res_rankgifts')
require('res.res_worldboss')
require('res.res_opensvract')
require('res.res_questions')

require('res.res_init')

require('tqEffector')
require('tqBaseCmdHandler_t')
require('tqNetCmd')
require('tqAlliances')
require('tqPlayers')
require('tqPlayerMgr')
require('tqCityManager')
require('tqMailMgr')

res_tasks_ = res_tasks
res_online_tasks_ = res_online_tasks
res_newhelp_tasks_ = res_newhelp_tasks
res_everyday_tasks_ = res_everyday_tasks
res_growup_tasks_ = res_growup_tasks
res_active_tasks_ = res_active_tasks


Util.getTime = function(self) return self.timedrt end

__send_msgs = {}
SPub.SendMsg = function (self, id, connid, msg)
	if not Json.IsValid(msg) then
		error(' *** sendMsg is not json data')
	end
	table.insert(__send_msgs, msg)
end

local __item_uid = 0
SPub.AllocItemUId = function(self)
	__item_uid = __item_uid + 1
	return __item_uid
end

SPub.IsExistRoleName = function(self, name)
	if name == 'exist' then
		return true
	else
		return false
	end
end

SPub.MakeNewRoleId = function(self)
	return 1
end

SPub.CreateRole = function(self, dbvar)
	return 0
end

SPub.RoleSave = function(self)
end

SPub.RoleLogin = function(self)
	return RET_LOGIN_OK
end;

SPub.GetZoneId = function(self)
	return 0
end;

SPub.ClearInnerHero = function(self, innerHero)
end;

SPub.getTimeMs = function(self)
	return os.clock()*1000
end;

MockNodeMgr = NodeMgr:extends({
	init = function(self, structName, blockSize)
		self._structName = structName
		self._blockSize = blockSize or 4096
		self._freeMgr = FreeMgr:new(100)
		self._nodes = {}
	end;
})

MockBucketMgr = BucketMgr:extends({
	init = function(self, precision, nodeMgr)
		self._curPos = -1
		self._totalS =20
		self._precision = precision
		self._nodeMgr = nodeMgr
		self._buckets = {}
		self:_initBuckets()
	end;
})

local __last_timer_ = {eventid=-1}
MockTimerEx = Timer:extends({
	init = function(self, precision)
		self._stopTimerFlag = false
		self._callers = {}
		self._curTime = 0
		self._seq = 1
		self._precision = precision
		self._nodeMgr = MockNodeMgr:new('Node', 100)
		self._bucketMgr = MockBucketMgr:new(self._precision, self._nodeMgr)
		self._bucketMgr:initPos(os.clockMs())
	end;
	
	start = function(self, elapse, params, caller)
		__last_timer_.eventid = params[1]
		Timer.start(self, elapse, params, caller)
	end;
	
	stop = function(self)
		__last_timer_.eventid = -1
		Timer.stop(self)
	end;
})

getLastTimer_t = function()
	return __last_timer_
end
clearLastTimer_t  =function()
	__last_timer_.eventid = -1
end;

global.getLogBasePath = function()
	return '/home/game'
end;

global.getSvrNameId = function()
	return 'gamesvr00001'
end;

global._timer = MockTimerEx:new(500)
global.initTimer = function()
	os.setClockMs(0)
	global._timer = MockTimerEx:new(500)
end;

__last_sql = {}
__query_callback = function() return nil end
app_t = Class:extends({
	init = function(self)
		global.initTimer()
		self.playermgr = PlayerMgr:new()
		self.citymgr = CityManager:new(self)
		self.armyMgr = ArmyMgr:new(self)
		self.mailMgr = MailMgr:new(self)
		self.allianceMgr = AllianceMgr:new(self)
		self.worldBlessQueue = WorldBlessQueue:new(self)
		self.worldMsgQueue = WorldMsgQueue:new(self)
		self.actTowerRank = ActTowerRank:new()
		self.roleRank = RoleRank:new()
		self.svrAct = nil
	end;
	
	getMailMgr = function(self)
		return self.mailMgr
	end;
	
	handleError = function(self, player, errorId)
	end;
	
	getCmdHandler = function(self, cmd)
		if cmd == NETCMD.LOGIN then
			return {startLogin=function(self) end; offlineRoleLogin=function(self, player, username) return LoginHandler():offlineRoleLogin(player, username) end;}
		elseif cmd == NETCMD.SHOP then
			return ShopHandler:new()
		elseif cmd == NETCMD.BUILDRES then
			return BuildResHandler:new()
		end
	end;
	
	getAlliMgr = function(self)
		return self.allianceMgr
	end;
	
	getActTowerRank = function(self)
		return self.actTowerRank
	end;
	
	getRoleRank = function(self)
		return self.roleRank
	end;
	
	getPlayerMgr = function(self)
		return self.playermgr
	end;
	
	getCityMgr = function(self)
		return self.citymgr
	end;
	
	getWorldBlessQueue = function(self)
		return self.worldBlessQueue
	end;
	
	getWorldMsgQueue = function(self)
		return self.worldMsgQueue
	end;
	
	getArmyMgr = function(self)
		return self.armyMgr
	end;
	
	getSvrAct = function(self)
		if self.svrAct == nil then
			self.svrAct = ServerActEffect(self)
			self.svrAct:start()
		end
		return self.svrAct
	end;
	
	getDBConn = function(self)
		if self.dbConn == nil then
			self.dbConn = Class:extends({
				exec=function(self, sql) 
					local selectIdx = string.find(string.lower(sql), 'select')
					if selectIdx and selectIdx == 1 then
						error ( 'use db.exec: ' .. sql )
					end
					
					table.insert(__last_sql, sql)
					return true
				end;
				
				query=function(self, sql)
					local selectIdx = string.find(string.lower(sql), 'select')
					if selectIdx == nil then
						error ( 'use db.query: ' .. sql )
					end
					
					table.insert(__last_sql, sql)
					local dbrows = MockDBRows()
					__query_callback(sql, dbrows)
					if not dbrows:nextRow() then 
						return NullDBRows() 
					end
					return dbrows
				end;
				
				escape=function(self, s)
					return s
				end;
			}):new()
		end
		
		return self.dbConn
	end;
	
	regDBQuery = function(self, callBack)
		__query_callback = callBack
	end;
	
	unregDBQuery = function(self)
		__query_callback = function() return nil end
	end;
})

getSql_t =function(frame)
	if frame < 1 or frame > table.getn(__last_sql) then
		return ''
	end
	
	return __last_sql[frame]
end;	

getLastSql_t = function()
	return getSql_t(table.getn(__last_sql))
end;

printSql_t = function()
	print ( '**************' )
	print ( table.getn(__last_sql) )
	for _, s in ipairs(__last_sql) do
		print ( s )
	end
	print ( '**************' )
end;

clearLastSql_t = function()
	__last_sql = {}
end;	
		
clearSendMsg_t = function()
	__send_msgs = {}
end


getSendMsgCnt_t = function()
	return table.getn(__send_msgs)
end


getSendMsg_t = function(frame)
	if frame == nil then
		frame = table.getn(__send_msgs)
	end
	local rt = __send_msgs[frame]
	if rt == nil then 
		rt = ''
	end
	return rt
end


selectSendMsgCnt_t = function(sql)
	local findCnt = 0
	local words = string.split(sql, '@')
	local key = words[1]
	local strs = words[2]
	local msgCnt = getSendMsgCnt_t()
	for i=1, msgCnt, 1 do
		if key == 'eq' then
			if getSendMsg_t(i) == strs then
				findCnt = findCnt + 1
			end
		else
			if isInclude(getSendMsg_t(i), unpack(string.split(strs, ' ')) ) then
				findCnt = findCnt + 1
			end
		end
	end
	
	return findCnt
end;

printSendMsg_t = function()
	print ( '**************' )
	local msgCnt = getSendMsgCnt_t()
	print ( msgCnt )
	for i=1, msgCnt, 1 do
		print ( getSendMsg_t(i) )
	end
	print ( '**************' )
end;

SendMsgStub = Class:extends({
	clear = function(self)
		clearSendMsg_t()
	end;
	
	getCount = function(self)
		return getSendMsgCnt_t()
	end;
}):new()


FixRoleData_t = Class:extends({
	fixRoleData = function(self, player)
		self:fixRoleAttrs(player)
		self:fixRoleBuildData(player)
	end;
	
	fixHeroData = function(self, player)
		TestHeroDataEx:make(player)
		player:getHeroMgr():_createAllHeroObjs()
	end;
	
	fixRoleBuildData = function(self, player)
		local citys = player:getPersistVar().stCitys
		citys.ucTotal = 1
		local city = citys.astCitys[0]
		city.ucType = CITY_TYPE.MAIN
		city.stInBuilds.ucTotal = table.getn(res_role_initdata.inbuild)
		for i=0, city.stInBuilds.ucTotal-1, 1 do
			local build = city.stInBuilds.astInBuilds[i]
			self:fixOneBuildData(build, res_role_initdata.inbuild[i+1])
		end
		player:getCitys():initCitys()
	end;	
	
	fixOneBuildData = function(self, build, resbuild)
		build.ulId = resbuild.id
		build.ulResId = resbuild.resid
		build.ucLevel = resbuild.level
		build.ucState = resbuild.state
	end;
	
	fixRoleAttrs = function(self, player)
		local attrs = player:getAttrs()
		attrs.ucCount = table.getn(res_role_initdata.attrs)
		for i, a in ipairs(res_role_initdata.attrs) do
			attrs.astAttrs[i-1].usAttr = a.attr
			attrs.astAttrs[i-1].ulVal = a.val
		end
	end;
}):new()


TestCaseCondition = Class:extends({
	setPreCond = function(self, player, hero, p)
		self.player = player
		self.hero = hero
		self:setArmys(p.armys)
		self:setTodayFightTimes(p.todayfighttimes)
		self:setDefaultTeams(p.defaultteams)
		self:setLineups(p.lineups)
		self:createHeros(p.heros)
		self:setFavorites(p.favorites)
		self:setBuilds(p.builds)
		self:setSoldiers(p.soldiers)
		self:setMoney(p.money)
		self:setFood(p.food)
		self:setWood(p.wood)
		self:setStone(p.stone)
		self:setIron(p.iron)
		self:setCultures(p.cultures)
		self:setLearningCulture(p.learningculture)
		self:setPlayerPreCond(p.player)
		self:setCurTime(p.curtime)
		self:setItem(p.item)
		self:setHeroPreCond(p.hero)
	end;
	
	setArmys = function(self, armys)
		if armys == nil then return end
		
		self:setSelfArmys(armys.self)
		self:setEnemyArmys(armys.enemy)
		self:setAllianceArmys(armys.alliance)
	end;
	
	setSelfArmys = function(self, aself)
		if aself == nil then return end
		local armyContainer = self.player:getArmyContainer()
		for _, s in ipairs(aself) do
			armyContainer:addSelfArmyId(s)
		end
	end;
	
	setEnemyArmys = function(self, enemy)
		if enemy == nil then return end
		local armyContainer = self.player:getArmyContainer()
		for _, s in ipairs(enemy) do
			armyContainer:addEnemyArmyId(s)
		end		
	end;
	
	setAllianceArmys = function(self, alliance)
		if alliance == nil then return end
		local armyContainer = self.player:getArmyContainer()
		for _, s in ipairs(alliance) do
			armyContainer:addAllianceArmyId(s)
		end
	end;
	
	setTodayFightTimes = function(self, todayfighttimes)
		if todayfighttimes == nil then return end
		
		self.player:setTodayFightTimes(todayfighttimes)
	end;
	
	setDefaultTeams = function(self, defaultteams)
		if defaultteams == nil then return end
		
		for i, team in ipairs(defaultteams) do
			self.player:setDefaultTeam(i, team.lineupId, team.heroIds)
		end
	end;
	
	setLineups = function(self, lineups)
		if lineups == nil then return end
		
		for _, lineup in ipairs(lineups) do
			self.player:addLineup(lineup)
		end
	end;
	
	createHeros = function(self, heros)
		if heros == nil then return end
		
		local mm = MethodMock()
		mm:mock(math, 'random', function(a,b)
			if b ~= nil then
				return b
			end
			
			return a
			end)
		
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		
		local heromgr = self.player:getHeroMgr()
		self.player:getPkg():_addItem(RawItemEx({resId=FIXID.REFRESHCARD, number=1000}))
		
		for _, heroRes in ipairs(heros) do
			local cmd = {useitem=1}
			RefreshNewHerosHdr:handle(self.player, cmd)
			local newhero = self.player:getHeroMgr():getNewHeros():getNewHero(0)
			local hero = heromgr:createHero(newhero)
			if heroRes.state ~= nil then
				hero:setState(heroRes.state)
			end
			if heroRes.soldier ~= nil then
				hero:carrySoldier(heroRes.soldier)
			end
			if heroRes.level ~= nil then
				for level=2, heroRes.level, 1 do
					hero:getInner().ucLevel = level
					HeroAttrHelper:resetAttrsByLevel(self.player, hero)
				end
				hero:getInner().ucLevel = heroRes.level
				HeroAttrHelper:resetAttrsByLevel(self.player, hero)
			else
				hero:getInner().ucLevel = 1
			end
 		end
		
		mm:restore()
		
		clearSendMsg_t()	
	end;
	
	setFavorites = function(self, favorites)
		if favorites == nil then return end
		for _, id in ipairs(favorites) do
			self.player:getFavoriteContainer():add(id)
		end
	end;
	
	setBuilds = function(self, builds)
		if builds == nil then return end
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		for _, build in ipairs(builds) do
			city:delBuild(build.id)
			city:addBuild(build)
		end
		self.player:refreshCityGrid()
	end;
	
	setSoldiers = function(self, soldiers)
		if soldiers == nil then return end
		for _, soldier in ipairs(soldiers) do
			self.player:getSoldierMgr():addSoldier(soldier)
		end
	end;
	
	setMoney = function(self, money)
		if money == nil then return end
		self.player:getCityRes():setMoney(money)
	end;
	
	setFood = function(self, food)
		if food == nil then return end
		
		self.player:getCityRes():setFood(food)
	end;
	
	setWood = function(self, wood)
		if wood == nil then return end
		self.player:getCityRes():setWood(wood)
	end;
	
	setStone = function(self, stone)
		if stone == nil then return end
		self.player:getCityRes():setStone(stone)
	end;
	
	setIron = function(self, iron)
		if iron == nil then return end
		self.player:getCityRes():setIron(iron)
	end;
	
	setCultures = function(self, cultures)
		if cultures == nil then return end
		
		local culturesObj = self.player:getCultures()
		for _, culture in ipairs(cultures) do
			culturesObj:addCulture(culture.id, culture.level)
		end
	end;	
	
	setLearningCulture = function(self, learningculture)
		if learningculture == nil then return end
		
		local culturesObj = self.player:getCultures()
		culturesObj:setLearningCulture(learningculture)
	end;
	
	setPlayerPreCond = function(self, playerp)
		if playerp == nil then return end
		
		self:setPlayerAttrs(playerp.attrs)
	end;
	
	setCurTime = function(self, curtime)
		if curtime == nil then return end
		
		Util:setTimeDrt(curtime)
	end;
	
	setItem = function(self, item)
		if item == nil then return end
		
		self.player:getPkg():_addItem(RawItemEx({resId=item.id, number=item.num}));
	end;
	
	setHeroPreCond = function(self, herop)
		if herop == nil then return end

		self:setHeroLevel(herop.level)
		self:setHeroProf(herop.prof)
		self:setHeroCurTacticSkillId(herop.curTacticSkillId)
		self:setHeroSkills(herop.skills)
		self:setHeroSkillSteel(herop.skillsteel)
	end;
	
	setHeroLevel = function(self, level)
		if level == nil then return end
		
		self.hero:getInner().ucLevel = level
	end;
	
	setHeroProf = function(self, prof)
		if prof == nil then return end
		
		self.hero:getInner().ucProf = prof
	end;
	
	setHeroCurTacticSkillId = function(self, curTacticSkillId)
		if curTacticSkillId == nil then return end
		
		self.hero:setCurTacticSkillId(curTacticSkillId)
	end;
	
	setHeroSkills = function(self, skills)
		if skills == nil then return end
		
		for _, skill in ipairs(skills) do
			self.hero:addSkill(skill)
		end
	end;
	
	setHeroSkillSteel = function(self, skillsteel)
		if skillsteel == nil then return end
		
		local ss = self.hero:getSkillSteel()
		ss.ulResId = skillsteel.resid
		ss.ulDurtime = skillsteel.durtime
		ss.ulStoptime = skillsteel.stoptime
	end;
	
	setPlayerAttrs = function(self, attrs)
		if attrs == nil then return end
		
		for _, attr in ipairs(attrs) do
			self.player:setAttrVal(attr.id, attr.val)
		end
	end;
}):new()

HeroTestCaseHelper = Class:extends({
	createOneNewHero = function(self, player, heromgr)
		local mm = MethodMock()
		mm:mock(math, 'random', function(a,b)
			if b ~= nil then
				return b
			end
			
			return a
			end)

		local city = player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		
		local cmd = {useitem=1}
		player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		RefreshNewHerosHdr:handle(player, cmd)
		local newhero = player:getHeroMgr():getNewHeros():getNewHero(0)
		local hero = heromgr:createHero(newhero)
		clearSendMsg_t()
		
		mm:restore()
		
		return hero
	end;	
})

TestCaseHelper = Class:extends({
	init = function(self)
	end;
	
	createPlayer = function(self, testcase, callBackBeforeLoginOk)
		self:initCityGrids()
		self:initCityMgr()
		testcase.playermgr = PlayerMgr:new()
		testcase.player = testcase.playermgr:newPlayer(1,0)
		testcase.player:setRoleId(10001)
		testcase.player:setName('user')
		testcase.player:setRoleName('role')
		testcase.player:getPersistVar().tasks.refreshTime = 0
		if callBackBeforeLoginOk ~= nil then
			callBackBeforeLoginOk(testcase.player)
		end
		testcase.player:loginStart()
		testcase.player:loginOk()
		testcase.player:getCityRes():setLevel(1)
		testcase.player:getTask():initGrowupTasks()
		FixRoleData_t:fixRoleData(testcase.player)
		testcase.player:getPkg():setMaxGridsCnt(res_role_initdata.pkg.maxgridcnt)
		testcase.player:getFarm().farms.farmVer = 0
		testcase.heromgr = testcase.player:getHeroMgr()
		testcase.mm = MMock()
		testcase.vb = ValueBack()
		alliance = nil
		clearSendMsg_t()
		clearLastTimer_t()
		app:unregDBQuery()
		Service:getProxyServer():clear()
		ProxyServerC:clear()
		Service:getRankRefreshDB():clear()
		CLEAR_LOG()
	end;
	
	createHero = function(self, testcase)
		testcase.hero = HeroTestCaseHelper:createOneNewHero(testcase.player, testcase.heromgr)
	end;
	
	loadPlayerByUserName = function(self, userName, roleName)
		local player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, userName)
		app:getPlayerMgr():appendPlayerIndex(player)
		player:setName(userName)
		player:setRoleName(roleName)
		FixRoleData_t:fixRoleData(player)
		player:setGameState(EGUS_INGAME)
		player:getPkg():setMaxGridsCnt(res_role_initdata.pkg.maxgridcnt)
		clearSendMsg_t()
		return player
	end;	
	
	loadPlayerByUserNameEx = function(self, userName, roleName, roleId, gridId)
		local player = self:loadPlayerByUserName(userName, roleName)
		player:getPkg():setMaxGridsCnt(res_role_initdata.pkg.maxgridcnt)
		player:setRoleId(roleId)
		local grid = self:createGrid(gridId, OBJ_TYPE.ROLE, roleId, roleName, userName)
		local gridId = self:addCityGrid(grid)
		player:setCityId( GridsMgr:GetCityIdByGridId(gridId) )
		player:setCityPos( app:getCityMgr():getPosByGridId(gridId) )
		player:setLevel(1)
		player.cityGrid = app:getCityMgr():getGridByRoleId( player:getRoleId() )
		player:getFarm().farms.farmVer = 0
		player:getCityRes():setLevel(1)
		clearSendMsg_t()
		return player
	end;
	
	createGrid = function(self, gridId, objType, roleId, roleName, userName)
		local grid = {
			gridId = gridId,
			objType = objType,
			resId = 0,
			modelId = 0,
			subCitys = '',
			roleId = roleId,
			roleName = roleName,
			userName = userName,
			icon = 0,
			level = 1,
			sex = 0,
			state = 0,
			allianceId = 0,
			enemyAlliId = 0,
			refreshTime = 0,
			alliName = '',
			cityLevel = 1,
			buildCurVal = 0,
			roleRank = 0,
			introduction = '',
			loginTime = Util:getTime(),
			misc = {
					shiChangLevel = 0,
					towerLayer = 0,
					towerTime = 0,
					towerRank = 0,
					buildValTime = 0,
					terraceGate = 0,
					cityMaxLevel = 0,
					
					is_yellow_vip = 0,
					is_yellow_year_vip = 0,
					yellow_vip_level = 0,
					is_yellow_high_vip = 0,
					is_blue_vip = 0,
					is_blue_year_vip = 0,
					blue_vip_level = 0,
					is_super_blue_vip = 0,
					_3366_grow_level = 0,
					
					vip_level = 0,
					
					lastRoleLevel = 0,
					lastBuildVal = 0,
					lastTowerLayer = 0,					
					lastTowerTime = 0,					
				},
			}
		return grid
	end;
	
	clearAll = function(self, testcase)
		testcase.mm:restore()
		testcase.vb:restore()
		clearSendMsg_t()	
		clearLastSql_t()
		clearLastTimer_t()
		Util:setTimeDrt(1)
		testcase.playermgr:freePlayer(testcase.player)
		testcase.playermgr.list = {}
		testcase.playermgr.onlinePlayers = {}
		testcase.playermgr.offlinePlayers = {}
		app:getPlayerMgr():clear()
		app:getAlliMgr():clear()
		app:getAlliMgr():sortAlliances()
		app:getWorldMsgQueue():clear()
		UUIDMgr.uuids.armyId = 0
		UUIDMgr.uuids.itemId = 0
		self:clearCityMgr()
		self:clearArmyMgr()
		res_test_items = {}
	end;
	
	backRes = function(self)
		self.res_citydefs_ = res_citydefs
		self.res_citydef_ = res_citydef
		self.res_inbuild_ = res_inbuild
		self.res_items_builds_ = res_items_builds
		self.res_copyfields_ = res_copyfields
		self.res_drops_ = res_drops
		self.res_items_ = res_items
		self.res_items_ex_ = res_items_ex
		self.res_fields_level_ = res_fields_level
		self.res_items_cultures_ = res_items_cultures
		self.res_acc_needgolds_ = res_acc_needgolds
		self.res_state_relations_ = res_state_relations
		self.res_smithy_salelist_ = res_smithy_salelist
		self.res_rolenames_xing_ = res_rolenames_xing
		self.res_rolenames_ming_ = res_rolenames_ming
		self.res_tasks_ = res_tasks
		self.res_growup_tasks_ = res_growup_tasks
	end;
	
	restoreRes = function(self)
		res_citydefs = self.res_citydefs_
		res_citydef = self.res_citydef_
		res_inbuild = self.res_inbuild_
		res_items_builds = self.res_items_builds_
		res_copyfields = self.res_copyfields_
		res_drops = self.res_drops_
		res_items = self.res_items_
		res_items_ex = self.res_items_ex_
		res_fields_level = self.res_fields_level_
		res_items_cultures = self.res_items_cultures_
		res_acc_needgolds = self.res_acc_needgolds_
		res_state_relations = self.res_state_relations_
		res_smithy_salelist = self.res_smithy_salelist_
		res_rolenames_xing = self.res_rolenames_xing_
		res_rolenames_ming = self.res_rolenames_ming_		
		res_tasks = self.res_tasks_
		res_growup_tasks = self.res_growup_tasks_
		
		CultureEffectMgr:initEffectsMap()
	end;
	
	backFun = function(self, obj, funName, newfun)
		self.backFun = obj[funName]
		obj[funName] = newfun
	end;
	
	restoreFun = function(self, obj, funName)
		obj[funName] = self.backFun
	end;
	
	initCityMgr = function(self)
		local grids = self:getCityMgrGridIds()
		for _, grid in ipairs(grids) do
			GridsMgr.grids[grid.gridId] = grid
		end
		GridsMgr:MapRoleIdToGridId(10001, 202)
	end;
	
	clearCityMgr = function(self)
		local grids = self:getCityMgrGridIds()
		for _, grid in ipairs(grids) do
			GridsMgr.grids[grid.gridId] = nil
		end
		GridsMgr.roleIdMapGridId = {}
	end;
	
	clearArmyMgr = function(self)
		app:getArmyMgr().cacheArmys = {}
	end;
	
	getCityMgrGridIds = function(self)
		return self.cityGrids
	end;
	
	addCityGrid = function(self, gridRes)
		if gridRes.gridId == nil then
			gridRes.gridId = self:_getMaxCityGridId() + 1
		else
			for i, grid in ipairs(self.cityGrids) do
				if ( grid.gridId == gridRes.gridId ) then
					table.remove(self.cityGrids, i)
					break
				end
			end
		end
		
		table.insert( self.cityGrids, gridRes )
		
		if gridRes.objType == OBJ_TYPE.ROLE then
			GridsMgr:MapRoleIdToGridId(gridRes.roleId, gridRes.gridId)
			GridsMgr:MapRoleNameToRoleId(gridRes.roleName, gridRes.roleId)
		end
		
		GridsMgr.grids[gridRes.gridId] = gridRes
		
		return gridRes.gridId
	end;
	
	_getMaxCityGridId = function(self)
		local maxGridId = 0
		for _, grid in ipairs(self.cityGrids) do
			if grid.gridId > maxGridId then
				maxGridId = grid.gridId
			end
		end
		return maxGridId
	end;
	
	initCityGrids = function(self)
		local grid1 = self:createGrid(1, OBJ_TYPE.NONE, 0, '', '')
		local grid2 = self:createGrid(2, OBJ_TYPE.FIELD, 0, '', '')
		grid2.resId = 170001
		local grid3 = self:createGrid(201, OBJ_TYPE.NONE, 0, '', '')
		local grid4 = self:createGrid(202, OBJ_TYPE.ROLE, 10001, 'role', 'user')
		grid4.allianceId = 2
		self.cityGrids = {grid1, grid2, grid3, grid4}
	end;
	
	addSelfField = function(self, player, pos)
		local grid = app:getCityMgr():getGridByPos(pos)
		app:getCityMgr():occupyFieldGrid(player, grid)
		
		local selfFieldMgr = player:getSelfField()
		selfFieldMgr:addField(grid)
	end;
	
	clearPkgItems = function(self, player)
		local pkg = player:getPkg()
		local cnt = pkg:getItemsCount()
		for idx=cnt-1, 0, -1 do
			local item = pkg:getItemByIdx(idx)
			pkg:delItemById(item:getId())
		end
	end;
}):new()


MockDBRow = Class:extends({
	init = function(self)
		self.record = {}
		self.fieldCount = 0
	end;
	
	setRecord = function(self, fieldCount, record)
		self.fieldCount = fieldCount
		self.record = record
	end;
	
	getFieldCount = function(self)
		return self.fieldCount
	end;

	getFieldVal = function(self, fieldName)
		return self.record[fieldName]
	end;
})

MockDBRows = Class:extends({
	init = function(self, conn)
		self.dbrow = MockDBRow()
		self.records = {}
		self.curRecord = 0
	end;

	setRecords = function(self, records)
		local fieldNumber = 0
		for _, v in pairs(records) do
			fieldNumber = fieldNumber + 1
		end
		self.fieldNumber = fieldNumber
		self.records = records
		self.curRecord = 0
	end;
	
	getRowCount = function(self)
		return table.getn(self.records)
	end;
	
	nextRow = function(self)
		if self.curRecord < self:getRowCount() then
			self.curRecord = self.curRecord + 1
			return true
		else
			return false
		end
	end;
	
	getCurRow = function(self)
		self.dbrow:setRecord(self.fieldNumber, self.records[self.curRecord])
		return self.dbrow
	end;
})

MethodMock = Class:extends({
	init = function(self)
		self.nodes = {}
	end;
	
	mock = function(self, obj, methodName, newMethod)
		if obj == nil then
			obj = _G
		end
		
		if obj[methodName] == nil or type(obj[methodName]) ~= 'function' then
			error ( 'mock error method : ' .. methodName )
		end
		
		table.insert(self.nodes, {obj=obj, methodName=methodName, method=obj[methodName]})
		obj[methodName] = newMethod
	end;
	
	restore = function(self)
		for _, node in ipairs(self.nodes) do
			node.obj[node.methodName] = node.method
		end
		self.nodes = {}
	end;
})

MMock = Class:extends({
	init = function(self)
		self.nodes = {}
		self.walkLog = ''
		self.params = {}
	end;
	
	travelMock = function(self, obj, methodName, customRt, customMethod)
		self:mock(obj, methodName, customRt, customMethod, 'travel')
	end;
	
	nologMock = function(self, obj, methodName, customRt, customMethod)
		self:mock(obj, methodName, customRt, customMethod, 'nolog')
	end;
	
	mock = function(self, obj, methodName, customRt, customMethod, flag)
		if obj == nil then
			obj = _G
		end
		
		local alias = string.split(methodName, ':')
		methodName = alias[1]
		local methodAlias = alias[2]
		if methodAlias == nil then
			methodAlias = methodName
		end
		
		if obj[methodName] == nil or type(obj[methodName]) ~= 'function' then
			error ( 'mock error: method \'' .. methodName .. '\', is not exist!')
		end
		
		if self:isExist(obj, methodName) then 
			error ( 'mock error: method \'' .. methodName .. '\', is repeat mock!')
		end
		
		local originalMethod = obj[methodName]
		table.insert(self.nodes, {obj=obj, methodName=methodName, method=originalMethod})
		
		self.params[methodAlias] = {}
		local mm = self
		
		local newMethod = function(...)
			local params = {}
			for i=1, select('#', ...), 1 do
				local a = select(i, ...)
				if a == nil then
					table.insert(params, 'nil')
				else
					table.insert(params, a)
				end
			end
			
			for i=#params, 1, -1 do
				if params[i] ~= 'nil' then
					break
				else
					table.remove(params, i)
				end
			end
			
			local _isGlobalObject = function()
				return (obj == math) or (obj == string) or (obj == table) or (obj == _G) or (obj == global)
			end;
			
			local _getNewParamStackFrameName = function()
				for i=1, 10000, 1 do
					local stackFrameName = methodAlias .. '.' .. i
					if mm.params[stackFrameName] == nil then
						return stackFrameName
					end
				end
				return nil
			end;
			
			local _collectStackFramesParams = function(curStackFrameName)
				mm.params[curStackFrameName] = {}
				mm.params[methodAlias] = {}
				local count = table.getn(params)
				for i=1, count, 1 do
					local fmtParam = params[i]
					local isFirstParam = (i == 1)
					if _isGlobalObject() or not isFirstParam  then
						table.insert(mm.params[curStackFrameName], fmtParam)
						table.insert(mm.params[methodAlias], fmtParam)
					end
				end
			end;
			
			local _recordWalkLog = function(flag)
				if flag == 'nolog' then
					return
				end
				
				if mm.walkLog ~= '' then
					mm.walkLog = mm.walkLog .. ','
				end
				mm.walkLog = mm.walkLog .. methodAlias
			end;
			
			local _callCustomMethod = function()
				if customMethod == nil then
					return nil
				end
				
				local rt, rt1, rt2, rt3, rt4, rt5, rt6, rt7, rt8, rt9 = customMethod(unpack(params))
				if rt == nil or rt == 'nil' then
					return nil
				end
				return {rt, rt1, rt2, rt3, rt4, rt5, rt6, rt7, rt8, rt9}
			end;
			
			local _callOriginalMethod = function()
				if flag == nil or flag ~= 'travel' then
					return nil
				end
				
				local originalRt = nil
				if _isGlobalObject() then
					originalRt = {originalMethod(obj, unpack(params))}
				else
					--[[
					for i=1, #params, 1 do
						if params[i] == nil then
							params[i] = 'nil'
						end
					end
					]]
					table.remove(params, 1)
					originalRt = {originalMethod(obj, unpack(params))}
				end
				
				if customRt ~= nil then
					return nil
				end
				
				if table.getn(originalRt) == 0 then
					return nil
				end
				
				return originalRt
			end;
			
			local curStackFrameName = _getNewParamStackFrameName()
			_collectStackFramesParams(curStackFrameName)
			_recordWalkLog(flag)
			local rt = _callCustomMethod()
			if rt ~= nil then
				return unpack(rt)
			end
			
			local rt = _callOriginalMethod()
			if rt ~= nil then
				return unpack(rt)
			end
			
			if customRt ~= nil then
				return unpack(customRt)
			end
		end
		
		obj[methodName] = newMethod
	end;
	
	clear = function(self)
		self.walkLog = ''
		self.params = {}
	end;
	
	restore = function(self)
		for _, node in ipairs(self.nodes) do
			node.obj[node.methodName] = node.method
		end
		self.nodes = {}
	end;
	
	isExist = function(self, obj, methodName)
		for _, node in ipairs(self.nodes) do
			if node.obj == obj and node.methodName == methodName then
				return true
			end
		end
		
		return false
	end;
})

ValueBack = Class:extends({
	init = function(self)
		self.nodes = {}
	end;
	
	replace = function(self, obj, valName, newVal)
		if obj == nil then
			obj = _G
		end
		
		table.insert(self.nodes, {obj=obj, valName=valName, originVal=obj[valName]})
		obj[valName] = newVal
	end;
	
	restore = function(self)
		for _, node in ipairs(self.nodes) do
			node.obj[node.valName] = node.originVal
		end
		self.nodes = {}
	end;
})




