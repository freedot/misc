local GM_RET_OK = 0
local GM_RET_INVALIDPARAM = 1
local GM_NEWLINE =  '<br/>'

GMHandler = Class:extends({
	onOSRequest = function(self, player, netevt, cmdtb)
		local fun, params = self:_getFunNameAndParams(cmdtb)
		if fun == nil or type(fun) ~= 'function' then 
			return 'error'
		end
		
		local rt, s = fun(GMCALL, player, params)
		if s == nil then s = '' end
		if rt == GM_RET_OK then
			return 0, '执行成功' .. s
		elseif rt == GM_RET_INVALIDPARAM then
			return -1, '执行失败' .. s
		end
	end;
	
	onRequest = function(self, player, netevt, cmdtb)
		if player:getGMFlag() < 3 then 
			return 
		end
		
		local fun, params = self:_getFunNameAndParams(cmdtb)
		if fun == nil or type(fun) ~= 'function' then 
			self:sendSysMsg(player, rstr.err.gminvalidfun)
			return 
		end
		
		local rt, s = fun(GMCALL, player, params)
		if rt == GM_RET_OK then
			self:sendSysMsg(player, rstr.succ.gmexecok, s)
		elseif rt == GM_RET_INVALIDPARAM then
			self:sendSysMsg(player, rstr.err.gminvalidparam, s)
		end
	end;
	
	_getFunNameAndParams = function(self, cmdtb)
		local params = self:getParams(cmdtb)
		local cmd = Util:getString(cmdtb, 'name')
		local fun = GMCALL['gm_'..cmd]
		return fun, params
	end;
	
	getParams = function(self, cmdtb)
		local params = {}
		for i=1, 100, 1 do
			local p = Util:getString(cmdtb, 'p'..i)
			if p == nil then break end
			table.insert(params, p)
		end
		return params
	end;
	
	sendSysMsg = function(self, player, title, s)
		local msg = title
		if s ~= nil then
			msg = msg .. GM_NEWLINE .. s
		end
		local appendInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		ChatSender:sendMsg(player, 0, CHAT_SYSPLAYER.SYS, '', appendInfo, CHAT_CHANNEL.PRIVATE, msg)
	end;
})

GmMovegrids = Class:extends({
	--@* 正在跑商中的处理
	init = function(self)
		self._oldGridsDB = GridsBD(app, 'mapgrids', false)
		self._exileGridsDB = GridsBD(app, 'exilegrids', false)
		self._newGridsDB = GridsBD(app, 'mapgrids_new', false)
		self._gridIdMap = {}
		self._freeNewGrids = {{},{},{}}
		self.NEW_GRID_COLS = 600
		self.OLD_GRID_COLS = 800
	end;
	
	handle = function(self)
		print 'start move ... 1'
		self:_initNewFreeGrids()
		print 'start move ... 2'
		local alliances, singlesGrids, roleCount, singlesCount = self:_collectAllGrids()
		print 'start move ... 3'
		-- 分配落单的
		local oneMaxCount = math.ceil(singlesCount/3)		
		for i, grid in ipairs(singlesGrids) do
			local cityId = self:_getCityIdByIdx(oneMaxCount, i)
			self:_saveNewGrids(cityId, grid)
		end
		print 'start move ... 4'
		-- 分配联盟的
		local i = 1
		oneMaxCount = math.ceil((roleCount-singlesCount)/3)
		for alliId, grids in pairs(alliances) do
			local cityId = self:_getCityIdByIdx(oneMaxCount, i)
			if alliId > 0 then
				for _, grid in ipairs(grids) do
					self:_saveNewGrids(cityId, grid)
					i = i + 1
				end
			end
		end
		print 'start move ... 5'
		self:_travelSetRoles()
		print 'start move ... 6'
		self:_travelSetAlliances()
		print 'start move ... 7'
		return GM_RET_OK
	end;
	
	_initNewFreeGrids = function(self)
		self._freeNewGrids = {{},{},{}}
		local gridIds = self._newGridsDB:getAllFreeGridIds()
		for _, gridId in ipairs(gridIds) do
			local cityId = self:_getCityIdByNewGridId(gridId)
			if cityId >=1 and cityId <=3 then
				table.insert(self._freeNewGrids[cityId], gridId)
			end
		end
	end;
	
	_getCityIdByNewGridId = function(self, gridId)
		local pos = self:_getPosByNewGridId(gridId)
		local cityId = -1;
		for i=4, 1, -1 do
			if self:_isInRects(res_maprects[i], pos) then
				cityId = i
				break;
			end
		end
		return cityId
	end;	
	
	_isInRects = function(self, rects, pos)
		if not self:_isInViewMap(pos) then
			return false
		end
		
		for _, rect in ipairs(rects) do
			if ((pos.x >= rect[1] and pos.x < rect[3]) and (pos.y >= rect[2] and pos.y < rect[4])) then
				return true
			end
		end
		return false
	end;
	
	_isInViewMap = function(self, pos)
		return pos.x >= 200 and pos.x < 400 and pos.y >= 200 and pos.y < 400
	end;
	
	_collectAllGrids = function(self)
		local singlesGrids = {}
		local singlesCount = 0
		local alliances = {}
		local grids = self._oldGridsDB:getAllRoleGrids()
		local grids2 = self._exileGridsDB:getAllRoleGrids(nil, "where objType=10")
		for _, g in ipairs(grids2) do
			table.insert(grids, g)
		end
		
		local checkgrids = {}
		for _, grid in ipairs(grids) do
			if checkgrids[grid.gridId] == true then
				LOGEX('OS', '<repeat>' )
			end
			
			checkgrids[grid.gridId] = true
			
			if alliances[grid.allianceId] == nil then
				alliances[grid.allianceId] = {}
			end
			
			table.insert(alliances[grid.allianceId], grid)
			if grid.allianceId == 0 then
				singlesCount = singlesCount + 1
				singlesGrids = alliances[grid.allianceId]
			end
		end
		return alliances, singlesGrids, table.getn(grids), singlesCount
	end;
	
	_allocNewGridId = function(self, cityId)
		local grids = self._freeNewGrids[cityId]
		local idx = math.random(1, table.getn(grids))
		local gridId = grids[idx]
		table.remove(grids, idx)
		return gridId
	end;
	
	_getCityIdByIdx = function(self, oneMaxCount, i)
		local cityId
		if i <= oneMaxCount then
			cityId = 1
		elseif i <= 2*oneMaxCount then
			cityId = 2
		else
			cityId = 3
		end
		return cityId
	end;	
	
	_saveNewGrids = function(self, cityId, grid)
		local newGridId = self:_allocNewGridId(cityId)
		self._gridIdMap[grid.gridId] = newGridId
		grid.gridId = newGridId
		self._newGridsDB:save(grid)
	end;
	
	_travelSetRoles = function(self)
		local oldGrids = {}
		local users = {}
		RolesDB(app):getAllUserName(users)
		for i, user in ipairs(users) do
			print ( '<' .. i .. '>' .. user )
			LOGEX('OS', '<_travelSetRoles> user=' .. user  )
			player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, user)
			local pos = player:getCityPos()
			local oldGridId =  pos.y*self.OLD_GRID_COLS + pos.x + 1
			local newGridId = self._gridIdMap[oldGridId]
			if newGridId == nil then
				LOGEX('OS', '<movegrids> error1' )
			end
			local newpos = self:_getPosByNewGridId(newGridId)
			local cityId = self:_getCityResIdByNewPos(newpos)
			player:setCityId(cityId)
			player:setCityPos(newpos)
			
			if player:getCityRes():getLevel() == 0 then
				player:getCityRes():setBuildHurtValAndState(player:getCityRes():getBuildHurtVal()-1)
				player:getCityRes():setLevel(1)
				LOGEX('OS', '<_travelSetRoles> die: ' .. player:getRoleName() )
			end
			
			for i=player:getPersistVar().military.favoriteCount-1, 0, -1 do
				local oldGridId = player:getPersistVar().military.favorites[i]
				local newGridId = self._gridIdMap[oldGridId]
				if newGridId ~= nil then
					player:getPersistVar().military.favorites[i] = newGridId
				else
					player:getPersistVar().military.favoriteCount = Util:removeElementC(player:getPersistVar().military.favorites, player:getPersistVar().military.favoriteCount, i)
				end
			end
			
			player:tmpsave()
			app:getPlayerMgr():freePlayer(player)
		end
	end;
	
	_travelSetAlliances = function(self)
		local alliDB = AlliancesDB(app)
		local allAllis = alliDB:getAllAlliances()
		for _, alli in ipairs(allAllis) do	
			local gridId = self._newGridsDB:getGridIdByRoleName(alli.leader)
			if gridId <= 0 then
				LOGEX('OS', '<movegrids> error3' )
			end
			LOGEX('OS', string.format('<_travelSetAlliances> %d %s', gridId, alli.leader) )
			local pos = self:_getPosByNewGridId(gridId)
			local cityId = self:_getCityResIdByNewPos(pos)
			alliDB:resetAlliCityResId(alli.allianceId, cityId)
		end
	end;
	
	_getPosByNewGridId = function(self, gridId)
		local gridIdx = gridId - 1
		local col = gridIdx%self.NEW_GRID_COLS
		local row = math.floor(gridIdx/self.NEW_GRID_COLS)
		return {x=col, y=row}
	end;
	
	_getCityResIdByNewPos = function(self, pos)
		local gridId = pos.y*self.NEW_GRID_COLS + pos.x + 1
		local cityId = self:_getCityIdByNewGridId(gridId)
		return 9900001 - 1 + cityId
	end;
})

GmHasHighHeroSpec = Class:extends({
	init = function(self, number)
		self._number = number
	end;
	
	isSatisfiedBy = function(self, player)
		local number = 0
		local count = player:getHeroMgr():getHeroCount()
		for i=0, count-1 do
			local hero = player:getHeroMgr():getHeroByIdx(i)
			if self:_calcFactor(hero) >= 16.49999 then
				number = number + 1
			end
		end
		return number >= self._number
	end;
	
	_calcFactor = function(self, hero)
		local prof = hero:getProf()
		local nattrs = {};
		nattrs[ATTR.AG_B] = ATTR.NAG
		nattrs[ATTR.PH_B] = ATTR.NPH
		nattrs[ATTR.ST_B] = ATTR.NST

		local resattrs = res_hero_main_sec_last_attrs['prof'..prof].attrs;
		local mainNAttr = nattrs[resattrs[1]];
		local secNAttr = nattrs[resattrs[2]];
		local lastNAttr = nattrs[resattrs[3]];

		local mainFactor = self:_getLevel( prof, mainNAttr, hero:getAttrVal(mainNAttr) )
		local secFactor = self:_getLevel( prof, secNAttr, hero:getAttrVal(secNAttr) )
		local lastFactor = self:_getLevel( prof, lastNAttr, hero:getAttrVal(lastNAttr) )
	
		local factor = 0
		if prof == HERO_PROF.YONGSHI then
			factor = 1.1*mainFactor + 1.1*secFactor + 1.1*lastFactor;
		else
			factor = 1.2*mainFactor + 1.1*secFactor + 1.0*lastFactor;
		end
		return factor
	end;
	
	_getLevel = function(self, prof, attr, val)
		local C_MAX_LEVEL = 5;
		local maxVal = res_heronature_max_attrs[prof][attr];
		local perLevelVal = (maxVal - res_heronature_min_attrval)/C_MAX_LEVEL;
		local curLevel = math.floor((val - res_heronature_min_attrval)/perLevelVal) + 1;
		return math.min(curLevel, C_MAX_LEVEL)
	end;
})

GmPlayersCollecter = Class:extends({
	collect = function(self, spec)
		local users = {}
		RolesDB(app):getAllUserName(users)
		local roles = ''
		for _, user in ipairs(users) do
			player = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, user)
			if spec:isSatisfiedBy(player) then
				if roles ~= '' then
					roles = roles .. ';'
				end
				roles = roles .. player:getRoleName()
			end
			if player:isOffline() then
				app:getPlayerMgr():exitPlayer(player)
			end
		end
		LOGEX('OS', roles)
	end;
})

GmAllianceCollecter = Class:extends({
	collect = function(self, needCount)
		local alliDB = AlliancesDB(app)
		local gridsDB = GridsBD(app, 'mapgrids', false)
		
		local count = app:getAlliMgr():getSortAlliCount(0)	
		needCount = math.min(count, needCount)
		for rank=1, needCount, 1 do
			local alliance = app:getAlliMgr():getSortAlliBy(0, rank-1)
			LOGEX('OS', '#-- alliance : ' .. alliance:getName() .. ', rank : ' .. rank)
			local members = alliDB:getAllianceMembersByName(alliance:getName() )
			local roles = ''
			for _, memid in ipairs(members) do
				if roles ~= '' then
					roles = roles .. ';'
				end
				roles = roles .. gridsDB:getRoleNameByRoleId(memid)
			end
			LOGEX('OS', roles)
			LOGEX('OS', '#--')
		end
	end;
})

GmAllianceMemCollecter = Class:extends({
	collect = function(self, alliName)
		local alliDB = AlliancesDB(app)
		local gridsDB = GridsBD(app, 'mapgrids', false)
		local members = alliDB:getAllianceMembersByName(alliName)
		local roles = ''
		for _, memid in ipairs(members) do
			if roles ~= '' then
				roles = roles .. ';'
			end
			roles = roles .. gridsDB:getRoleNameByRoleId(memid)
		end
		LOGEX('OS', roles)
	end;
})

GmTowerRankCollecter = Class:extends({
	collect = function(self, count)
		local alliDB = AlliancesDB(app)
		local gridsDB = GridsBD(app, 'mapgrids', true)
		local grids = gridsDB:getAllRoleGrids({'roleName', 'misc'})
		local hasRankGrids = {}
		for _, grid in ipairs(grids) do
			if grid.misc.towerRank > 0 then
				table.insert(hasRankGrids, grid)
			end
		end
		
		local sortcmp = function(a, b)
			return a.misc.towerRank < b.misc.towerRank
		end
		table.sort(hasRankGrids, sortcmp)
		
		local roles = ''
		for i, grid in ipairs(hasRankGrids) do
			if i > count then
				break
			end
			if roles ~= '' then
				roles = roles .. ';'
			end
			roles = roles .. grid.roleName
		end
		LOGEX('OS', roles)
	end;
})

GmRoleRankCollecter = Class:extends({
	collect = function(self, count)
		local alliDB = AlliancesDB(app)
		local gridsDB = GridsBD(app, 'mapgrids', true)
		local grids = gridsDB:getAllRoleGrids({'roleName', 'roleRank'})
		
		local sortcmp = function(a, b)
			return a.roleRank < b.roleRank
		end
		table.sort(grids, sortcmp)
		
		local roles = ''
		for i, grid in ipairs(grids) do
			if i > count then
				break
			end
			if roles ~= '' then
				roles = roles .. ';'
			end
			roles = roles .. grid.roleName
		end
		LOGEX('OS', roles)
	end;
})

GmArmyContainerIter = Class:extends({
	init = function(self, obj, getFun, count)
		self.fun = {obj=obj, getFun=getFun}
		self.count = count
		self.pos = 0
	end;
	
	next = function(self)
		if self.pos == self.count then
			return nil
		end
		
		local item = self.fun:getFun(self.fun.obj, self.pos)
		self.pos = self.pos + 1
		return item
	end;
})

GmArmyRContainerIter = Class:extends({
	init = function(self, obj, getFun, count)
		self.fun = {obj=obj, getFun=getFun}
		self.pos = count - 1
	end;
	
	next = function(self)
		if self.pos == -1 then
			return nil
		end
		
		local item = self.fun:getFun(self.fun.obj, self.pos)
		self.pos = self.pos - 1
		return item
	end;
})

GMCALLBASE = Class:extends({
	getNumber = function(self, params, idx)
		if table.getn(params) < 1 then return nil end
		return Util:toNumber(params[idx], 0)
	end;
	
	getString = function(self, params, idx)
		if table.getn(params) < 1 then return nil end
		return params[idx]
	end;
	
	addRes = function(self, player, params, funs)
		local num = self:getNumber(params, 1)
		if num == nil then return GM_RET_INVALIDPARAM end
		
		local cres = player:getCityRes()
		for  _, f in ipairs(funs) do
			local getter = cres['get'..f]
			local setter = cres['set'..f]
			setter(cres, getter(cres) + num)
		end
		CommResSender:sendAll(player)	
		return GM_RET_OK
	end;
	
	addHeroAttr = function(self, player, params, attrid, maxattrid)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		local addval = self:getNumber(params, 2)
		if addval == nil then return GM_RET_INVALIDPARAM end
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		local maxval = hero:getAttrVal(maxattrid)
		if (maxval == 0) then maxval = 0xffffffff end
		local attrval = hero:getAttrVal(attrid) + addval
		attrval = math.min(attrval, maxval)
		hero:setAttrVal(attrid, attrval)
		HeroAttrSender:sendAttr(player, hero, hero:getAttr(attrid))
		return GM_RET_OK
	end;
})

GMCALL = GMCALLBASE:extends({
	gm_addres = function(self, player, params)
		return self:addRes(player, params, {'Food', 'Wood', 'Stone', 'Iron'})
	end;
	
	gm_addfood = function(self, player, params)
		return self:addRes(player, params, {'Food'})
	end;
	
	gm_addwood = function(self, player, params)
		return self:addRes(player, params, {'Wood'})
	end;
	
	gm_addstone = function(self, player, params)
		return self:addRes(player, params, {'Stone'})
	end;
	
	gm_addiron = function(self, player, params)
		return self:addRes(player, params, {'Iron'})
	end;
	
	gm_additem = function(self, player, params)
		local resid = self:getNumber(params, 1)
		if resid == nil then return GM_RET_INVALIDPARAM end
		if ItemResUtil:findItemres(resid) == nil then return GM_RET_INVALIDPARAM end
		local number = self:getNumber(params, 2)
		if number == nil then number = 1 end
		if number <= 0 then number = 1 end
		local pkg = player:getPkg()
		pkg:addItems({RawItemEx({resId=resid, number=number})})
		ItemMsgSender:sendByResId(player, {resid})
		return GM_RET_OK
	end;
	
	gm_addheroexp = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local addval = self:getNumber(params, 2)
		if addval == nil or addval <= 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:addExp(player, addval)
		return GM_RET_OK
	end;	
	
	
	gm_addmoney = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		local cityres = player:getCityRes()
		cityres:addMoney(val)
		MoneySender:sendAll(player)
		return GM_RET_OK
	end;	
	
	gm_addexp = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		player:addExp(val)	
		return GM_RET_OK
	end;
	
	gm_attr_getpayact = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local payAct = target:getTask():getPayAct().payAct
		local s = ''
		s = s .. 'lastPayTime:' .. payAct.lastPayTime
		s = s .. ',allGold:' .. payAct.allGold
		s = s .. ',actAllGold:' .. payAct.actAllGold
		s = s .. ',giftGots:' .. payAct.giftGots[0] .. ',' .. payAct.giftGots[1] .. ',' .. payAct.giftGots[2] .. ',' .. payAct.giftGots[3] .. ',' .. payAct.giftGots[4] .. ',' .. payAct.giftGots[5]

		return GM_RET_OK, s
	end;
	
	gm_addpaygold = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		player:getTask():getPayAct():addAllGold(val)
		player:checkUpgradeVipLevel()
		PayGoldSender:sendPayGold(player)
		return GM_RET_OK
	end;	
	
	gm_addbuildval = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		local cres = player:getCityRes()
		cres:addBuildVal(val)
		CityBuildValSender:sendAll(player)	
		return GM_RET_OK
	end;	
	
	gm_startserver = function(self, player, params)
		local flag = self:getNumber(params, 1)
		if flag == nil then return GM_RET_INVALIDPARAM end
		
		if flag == 0 then
			ServerStartChecker:start(false)
		elseif flag == 1 then
			ServerStartChecker:start(true)
		end
		
		return GM_RET_OK
	end;	 
	
	gm_getserverstat = function(self, player, params)
		if ServerStartChecker:isStart() then
			return GM_RET_OK, ' 当前为开服状态'
		else 
			return GM_RET_OK, ' 当前为关服状态'
		end
	end;	
	
	gm_lockuser = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local hours = self:getNumber(params, 2)
		if hours < 0 then return GM_RET_INVALIDPARAM end
		
		if hours == 0 then
			target:setLockToTime(0)
			target:save()
		else
			target:setLockToTime(Util:getTime() + hours*3600)
			local lockToTime = os.date("%Y-%m-%d %H:%M:%S", target:getLockToTime())
			local msg = TQERR.LOCKEDUSER.msg .. '[' .. lockToTime .. ']'
			local errmsg = '{cmd:'..NETCMD.ERROR..',msg:\"'..msg..'\",closeflag:1}'
			target:sendMsg(errmsg)
			app:getPlayerMgr():exitPlayer(target)
		end
		return GM_RET_OK
	end;
	
	gm_saverank = function(self, player, params)
		return GM_RET_OK
	end;
	
	gm_getallimems = function(self, player, params)
		return GM_RET_OK
	end;
	
	-- 收集有个5个武将为16.5的玩家
	gm_collectplayers1 = function(self, player, params)
		local spec = GmHasHighHeroSpec:new(5)
		LOGEX('OS', '-- collect has five heros roles -- start')
		GmPlayersCollecter:new():collect(spec)
		LOGEX('OS', '-- collect has five heros roles -- end')
		return GM_RET_OK
	end;
	
	-- 联盟排名的玩家 collectplayers2 10
	gm_collectplayers2 = function(self, player, params)
		local count = self:getNumber(params, 1)
		if count == nil or count <= 0 then 
			count = 10
		end
		
		LOGEX('OS', '-- collect alliance rank roles -- start')
		GmAllianceCollecter:new():collect(count)
		LOGEX('OS', '-- collect alliance rank roles -- end')
		return GM_RET_OK
	end;
	
	-- 联盟成员的玩家 collectplayers3 allianceName
	gm_collectplayers3 = function(self, player, params)
		local alliName = self:getString(params, 1)
		if alliName == nil or alliName == '' then return GM_RET_INVALIDPARAM end
		
		LOGEX('OS', '-- collect alliance mem roles -- start')
		GmAllianceMemCollecter:new():collect(alliName)
		LOGEX('OS', '-- collect alliance mem roles -- end')
		return GM_RET_OK
	end;
	
	-- 千层塔排名的玩家 collectplayers4 100
	gm_collectplayers4 = function(self, player, params)
		local count = self:getNumber(params, 1)
		if count == nil or count <= 0 then 
			count = 100
		end
		
		LOGEX('OS', '-- collect tower rank roles -- start')
		GmTowerRankCollecter:new():collect(count)
		LOGEX('OS', '-- collect tower rank roles -- end')
		return GM_RET_OK
	end;
	
	-- 君主排名的玩家  collectplayers5 100
	gm_collectplayers5 = function(self, player, params)
		local count = self:getNumber(params, 1)
		if count == nil or count <= 0 then 
			count = 100
		end
		
		LOGEX('OS', '-- collect role rank roles -- start')
		GmRoleRankCollecter:new():collect(count)
		LOGEX('OS', '-- collect role rank roles -- end')
		return GM_RET_OK
	end;
	
	gm_testxxx = function(self, player, params)
		return GM_RET_OK, 'ok1'
	end;
	
	gm_refreshfield = function(self, player, params)
		app:getCityMgr():startRefreshFieldLevel()
		return GM_RET_OK
	end;
	
	--[[ for debug
	gm_addexp = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		player:addExp(val)	
		return GM_RET_OK
	end;

	gm_clearSubCitys = function(self, player, params)
		player:getCitys():clearSubCitys()
		return GM_RET_OK
	end;
	]]
	
	--[[

	
	gm_addidle = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil then return GM_RET_INVALIDPARAM end
		local cityres = player:getCityRes()
		cityres:setIdlePopu(val)
		PopuSender:send(player, {'idle'})
		return GM_RET_OK
	end;

	
	gm_addherohealth = function(self, player, params)
		return self:addHeroAttr(player, params, ATTR.HEALTH, ATTR.MHEALTH)
	end;
	
	gm_addheromorale = function(self, player, params)
		return self:addHeroAttr(player, params, ATTR.MO, ATTR.MMO)
	end;
	
	gm_addheroexp = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local addval = self:getNumber(params, 2)
		if addval == nil or addval <= 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:addExp(player, addval)
		return GM_RET_OK
	end;
	
	gm_addherocredit = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local addval = self:getNumber(params, 2)
		if addval == nil or addval <= 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:setAttrVal(ATTR.CRE, hero:getAttrVal(ATTR.CRE) + addval)
		HeroAttrSender:sendAttr(player, hero, hero:getAttr(ATTR.CRE))
		return GM_RET_OK
	end;
	
	gm_setheroslevel = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local setval = self:getNumber(params, 2)
		if setval == nil or setval < 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:setSkeletonLevel(setval)
		HeroAttrSender:sendDetailHero(player, hero)
		return GM_RET_OK
	end;
	
	gm_setheroif = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local setval = self:getNumber(params, 2)
		if setval == nil or setval < 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:setAttrVal(ATTR.IF, setval);
		HeroAttrSender:sendAttr(player, hero, hero:getAttr(ATTR.IF))
		return GM_RET_OK
	end;
	
	gm_setherostate = function(self, player, params)
		local heroidx = self:getNumber(params, 1)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local state = self:getNumber(params, 2)
		if state == nil or state < 0 then return GM_RET_INVALIDPARAM end
		
		local hero = player:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:setState(state)
		HeroAttrSender:sendHerosState(player, {hero})
		return GM_RET_OK
	end;
	
	gm_setrolelevel = function(self, player, params)
		local setval = self:getNumber(params, 1)
		if setval == nil or setval < 1 or setval > 100  then return GM_RET_INVALIDPARAM end
		
		player:setLevel(setval)
		RoleBaseSender:send(player, {'level'})
		return GM_RET_OK
	end;
	
	gm_addnewsoldier = function(self, player, params)
		local newNum = self:getNumber(params, 1)
		if newNum == nil then return GM_RET_INVALIDPARAM end
		if newNum <= 0 then return GM_RET_INVALIDPARAM end
		
		local attr = player:getAttr(ATTR.NAF)
		attr.ulVal = attr.ulVal + newNum
		RoleAttrSender:sendAttr(player, attr)
		return GM_RET_OK
	end;
	
	gm_addlineup = function(self, player, params)
		local lineupId = self:getNumber(params, 1)
		if lineupId == nil then return GM_RET_INVALIDPARAM end
		if lineupId < 0 then return GM_RET_INVALIDPARAM end
		
		player:addLineup(lineupId)
		MilitarySender:sendLineups(player)
		return GM_RET_OK
	end;
	
	gm_clearlineups = function(self, player, params)
		player:clearLineups()
		MilitarySender:sendLineups(player)
		return GM_RET_OK
	end;
	
	gm_clearpkg = function(self, player, params)
		local pkg = player:getPkg()
		local cnt = pkg:getItemsCount()
		for idx=cnt-1, 0, -1 do
			local item = pkg:getItemByIdx(idx)
			pkg:delItemById(item:getId())
			ItemMsgSender:sendDelItem(player, item:getId())
		end
		return GM_RET_OK
	end;
	]]
	gm_addgiftgold = function(self, player, params)
		local setval = self:getNumber(params, 1)
		if setval <= 0 then return GM_RET_INVALIDPARAM end
		
		local pkg = player:getPkg()
		pkg:setGiftGold(pkg:getGiftGold() + setval)
		
		PkgMiscSender:sendAll(player)
		
		return GM_RET_OK	
	end;
	
	gm_add_other_giftgold = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local addval = self:getNumber(params, 2)
		if addval == nil or addval <= 0 then return GM_RET_INVALIDPARAM end
		
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local pkg = target:getPkg()
		pkg:setGiftGold(pkg:getGiftGold() + addval)
		PkgMiscSender:sendAll(target)
		
		return GM_RET_OK	
	end;
	
	gm_clear_other_pkg = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local pkg = target:getPkg()
		local cnt = pkg:getItemsCount()
		for idx=cnt-1, 0, -1 do
			local item = pkg:getItemByIdx(idx)
			pkg:delItemById(item:getId())
			ItemMsgSender:sendDelItem(target, item:getId())
		end
		return GM_RET_OK
	end;
	
	gm_add_other_item = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local resid = self:getNumber(params, 2)
		if resid == nil then return GM_RET_INVALIDPARAM end
		if ItemResUtil:findItemres(resid) == nil then return GM_RET_INVALIDPARAM end
		
		local number = self:getNumber(params, 3)
		if number == nil then number = 1 end
		if number <= 0 then number = 1 end
		
		local pkg = target:getPkg()
		pkg:addItems({RawItemEx({resId=resid, number=number})})
		ItemMsgSender:sendByResId(target, {resid})
		return GM_RET_OK
	end;
	
	gm_set_other_herostate = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local heroidx = self:getNumber(params, 2)
		if heroidx == nil then return GM_RET_INVALIDPARAM end
		
		local state = self:getNumber(params, 3)
		if state == nil or state < 0 then return GM_RET_INVALIDPARAM end
		
		local hero = target:getHeroMgr():getHeroByIdx(heroidx)
		if hero == nil then return GM_RET_INVALIDPARAM end
		
		hero:setState(state)
		HeroAttrSender:sendHerosState(target, {hero})
		return GM_RET_OK
	end;
	
	gm_send_other_mail = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		
		local title = self:getString(params, 2)
		if title == nil or title == '' then return GM_RET_INVALIDPARAM end
		
		local con = self:getString(params, 3)
		if con == nil or con == '' then return GM_RET_INVALIDPARAM end
		
		local dropRawItems = {}
		for i=4, 9, 1 do
			local p = self:getString(params, i)
			if p == nil or p == '' then
				break
			end
			
			local resIdAndNumberPair = string.split(p, ':')
			if #resIdAndNumberPair ~= 2 then
				break
			end
			
			local resId = tonumber(resIdAndNumberPair[1])
			local number = tonumber(resIdAndNumberPair[2])
			local itemres = ItemResUtil:findItemres(resId)
			if itemres == nil then
				break
			end

			if number <= 0 then
				break
			end
			
			table.insert(dropRawItems, RawItemEx({id=i, resId=resId, number=number}))
		end
		
		
		local mail = app:getMailMgr():addSysMail(roleName, title, FIXID.COMM_SYS_MAILTEMP, con, dropRawItems)
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target ~= nil then 
			MailSender:sendBriefMail(target, mail)
		end
		return GM_RET_OK
	end;
	
	gm_pay_other_gold = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local number = self:getNumber(params, 2)
		if number == nil then number = 1 end
		if number <= 0 then number = 1 end
		
		target:getPkg():addGold(number)
		target:getTask():getPayAct():addGold(number)
		target:checkUpgradeVipLevel()
		PayGoldSender:sendPayGold(target)
		TaskFinisher:trigerTask(target, TASK_FINISH_TYPE.FIRST_RECHARGE)

		return GM_RET_OK
	end;
	
	gm_armyarrive = function(self, player, params)
		local armyId = self:getNumber(params, 1)
		if armyId == nil or armyId <= 0 then return GM_RET_INVALIDPARAM end
		
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then return GM_RET_INVALIDPARAM end
		
		if army.stopTime > Util:getTime() then
			army.stopTime = Util:getTime()
		end
		
		MilitarySender:sendArmyState(player, army.armyId)
		app:getArmyMgr():startTimer(army.armyId, army.state, army.stopTime)
		
		return GM_RET_OK
	end;	
	
	gm_send_sysmsg = function(self, player, params)
		local msg = self:getString(params, 1)
		if msg == nil or msg == '' then return GM_RET_INVALIDPARAM end
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		for _, p in pairs(players) do
			WUtil:sendSysMsg(p, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, msg)
			WUtil:sendSysMsg(p, SMSGT.SYS_POPBAR, SMT_NORMAL, msg)
		end
		return GM_RET_OK
	end;
	
	gm_is_online = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		local roleId = app:getCityMgr():getRoleIdByRoleName(roleName)
		if roleId < 0 then return GM_RET_INVALIDPARAM end
		
		local s = ''
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(roleId)
		if target == nil then 
			s = 'offline'
		else
			s = 'online'
		end
		
		return GM_RET_OK, s
	end;
	
	gm_get_onlines = function(self, player, params)
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		local cnt = 0
		for _, p in pairs(players) do
			cnt = cnt + 1
		end
		return GM_RET_OK, ' 当前在线 : ' .. cnt
	end;
	
	gm_addgold = function(self, player, params)
		local setval = self:getNumber(params, 1)
		if setval <= 0 then return GM_RET_INVALIDPARAM end
		
		local pkg = player:getPkg()
		pkg:setGold(pkg:getGold() + setval)
		
		PkgMiscSender:sendAll(player)
		
		return GM_RET_OK
	end;
	
	gm_paygold = function(self, player, params)
		local resid = self:getNumber(params, 1)
		if resid <= 0 then return GM_RET_INVALIDPARAM end
		
		local number = self:getNumber(params, 2)
		if number <= 0 then return GM_RET_INVALIDPARAM end
		
		local cmd = {id=resid, number=number}
		ShopBuyGoldHandler:new():handle(player, cmd, true)
		
		return GM_RET_OK
	end;
	
	gm_setprestige = function(self, player, params )
		local val = self:getNumber(params, 1)
		player:setPrestige(val)
		return GM_RET_OK
	end;
	
	gm_startcdk = function(self, player, params)
		local flag = self:getNumber(params, 1)
		if flag == nil then return GM_RET_INVALIDPARAM end
		ServerOnlineToggleChecker:setFlag('cdkey', flag == 1)
		return GM_RET_OK
	end;
	
	gm_getcomroleinfo = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		return GM_RET_OK
	end;

	------[[迁移数据]]
	helper_immReturnArmy = function(self, armyId)
		local army = app:getArmyMgr():getArmyById(armyId)
		if army ~= nil then
			army.state = ARMYDYN_STATE.RETURN
			army.stopTime = Util:getTime()
			ExpedReturnTimerHdr:handle(armyId)
		end
	end;
	
	-- 立即召回所有玩家的军队
	gm_callbackallarmys = function(self)
		local users = {}
		RolesDB(app):getAllUserName(users)
		for i, user in ipairs(users) do
			tplayer = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, user)
			local armyContainer = tplayer:getArmyContainer()
			local iter = GmArmyRContainerIter(armyContainer, armyContainer.getSelfArmyId, armyContainer:getSelfArmyCount())
			while true do
				local armyId = iter:next()
				if armyId == nil then break end
				self:helper_immReturnArmy(armyId)
			end
			app:getPlayerMgr():exitPlayer(tplayer)
			print ( '<' .. i .. '>' .. user )
		end
		return GM_RET_OK
	end;
	
	-- 放弃所有野地
	gm_giveupallfields = function(self)
		local users = {}
		RolesDB(app):getAllUserName(users)
		local giveUpSelfFieldHdr = GiveUpFieldHandler()
		for i, user in ipairs(users) do
			tplayer = app:getPlayerMgr():getOrLoadPlayerByUserName(OBJ_TYPE.ROLE, user)
			local count = tplayer:getSelfField():getCount()
			for fieldIdx=count-1, 0, -1 do
				local selfField = tplayer:getSelfField():getFieldByIdx(fieldIdx)
				giveUpSelfFieldHdr:handle(tplayer, {fieldId=selfField.gridId, collectReason=COLLECT_REASON.REFRESH})
			end
			app:getPlayerMgr():exitPlayer(tplayer)
			print ( '<' .. i .. '>' .. user )
		end
		return GM_RET_OK
	end;
	
	gm_movegrids = function(self)
		return GmMovegrids():handle()
	end;
	
	gm_clearworldboss = function(self, player, params)
		player:getTask():getWorldBoss():clear()
		return GM_RET_OK
	end;
	
	gm_stopbuff = function(self, player, params)
		local buffid = self:getNumber(params, 1)
		if buffid <= 0 then return GM_RET_INVALIDPARAM end
		player:getStateContainer():stopState(buffid)
		return GM_RET_OK
	end;
	
	gm_setcityhonor = function(self, player, params)
		local honor = self:getNumber(params, 1)
		if honor <= 0 then return GM_RET_INVALIDPARAM end
		player:setCityHonor(honor)
		return GM_RET_OK
	end;
	
	gm_showpkgitems = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local minNumber = self:getNumber(params, 2)
		if minNumber == nil or minNumber < 0 then
			minNumber = 0
		end
		
		local count = target:getPkg():getItemsCount()
		local s = '';
		for i=0, count-1 do
			local item = target:getPkg():getItemByIdx(i)
			if item:getNumber() >= minNumber then
				s = s .. '<br/>id=' .. item:getId() .. ',resid=' .. item:getResId() .. ',number=' .. item:getNumber()
			end
		end
		
		return GM_RET_OK, s
	end;
	
	gm_subpkgitems1 = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local itemid = self:getNumber(params, 2)
		if itemid == nil or itemid < 1 then
			return GM_RET_INVALIDPARAM
		end
		
		local number = self:getNumber(params, 3)
		if number == nil or number < 1 then
			return GM_RET_INVALIDPARAM
		end
		
		
		local item = target:getPkg():getItemById(itemid)
		if item == nil then
			return GM_RET_INVALIDPARAM
		end
		
		if number >= item:getNumber() then
			target:getPkg():delItemById(itemid)
			ItemMsgSender:sendDelItem(target, itemid)
		else
			item:subNumber(number)
			ItemMsgSender:sendNumber(target, item)
		end
		
		return GM_RET_OK
	end;
	
	gm_subpkgitems2 = function(self, player, params)
		local roleName = self:getString(params, 1)
		if roleName == nil or roleName == '' then return GM_RET_INVALIDPARAM end
		
		local target = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
		if target == nil then return GM_RET_INVALIDPARAM end
		
		local resid = self:getNumber(params, 2)
		if resid == nil or resid < 1 then
			return GM_RET_INVALIDPARAM
		end
		
		local number = self:getNumber(params, 3)
		if number == nil or number < 1 then
			return GM_RET_INVALIDPARAM
		end
		
		target:getPkg():subItemByResId(resid,number)
		
		return GM_RET_OK
	end;	
	
	gm_clearActTowerCount = function(self, player, params)
		player:getActTower():setTodayEnterTimes(0)
		ActTowerSender:sendBaseInfo(player)
		return GM_RET_OK
	end;
	
	gm_setsigndays = function(self, player, params)
		local days = self:getNumber(params, 1)
		if days < 0 then return GM_RET_INVALIDPARAM end
		
		player:getTask():getActivityVal():setSignDays(days)
		return GM_RET_OK
	end;
	
	gm_setactval = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val < 0 then return GM_RET_INVALIDPARAM end
		player:getTask():getActivityVal():setTodayVal(val)
		return GM_RET_OK
	end;
	
	
--[[	
	gm_addgold = function(self, player, params)
		local setval = self:getNumber(params, 1)
		if setval <= 0 then return GM_RET_INVALIDPARAM end
		
		local pkg = player:getPkg()
		pkg:setGold(pkg:getGold() + setval)
		
		PkgMiscSender:sendAll(player)
		
		return GM_RET_OK
	end;
	
	gm_subbval = function(self, player, params)
		local setval = self:getNumber(params, 1)
		if setval <= 0 then return GM_RET_INVALIDPARAM end
		
		local pkg = player:getCityRes():setBuildHurtValAndState(setval)
		return GM_RET_OK	
	end;
	
	gm_clearfightrefstate = function(self, player, params)
		--player.fightRefState.military.declareCount=0
		return GM_RET_OK	
	end;
	
	makeArmyIdStr = function(self, iter)
		local s = ''
		while true do
			local id = iter:next()
			if id == nil then
				break
			end
			
			s = s .. id .. ','
		end
		
		return s
	end;
	
	gm_showarmyids = function(self, player)
		local armyContainer = player:getArmyContainer()
		local iter = GmArmyContainerIter(armyContainer, armyContainer.getSelfArmyId, armyContainer:getSelfArmyCount())
		local s = 'self army ids:[' .. self:makeArmyIdStr(iter) .. ']' .. GM_NEWLINE
		
		iter = GmArmyContainerIter(armyContainer, armyContainer.getEnemyArmyId, armyContainer:getEnemyArmyCount())
		s = s .. 'enemy army ids:[' .. self:makeArmyIdStr(iter) .. ']' .. GM_NEWLINE
		
		iter = GmArmyContainerIter(armyContainer, armyContainer.getAllianceArmyId, armyContainer:getAllianceArmyCount())
		s = s .. 'alli army ids:[' .. self:makeArmyIdStr(iter) .. ']' .. GM_NEWLINE
		
		return GM_RET_OK , s
	end;
	
	gm_clearmyarmys = function(self, player)
		local armyContainer = player:getArmyContainer()
		armyContainer.military.selfArmyCount = 0
		armyContainer.military.alliArmyCount = 0
		armyContainer.military.enemyArmyCount = 0
		return GM_RET_OK
	end;
	
	gm_clearselffield = function(self, player)
		local selfField = player:getSelfField()
		for i=selfField:getCount()-1, 0, -1 do
			local field = selfField:getFieldByIdx(i)
			app:getCityMgr():clearOccupyFieldGrid(field.gridId)
			selfField:deleteField(field)
		end
		return GM_RET_OK
	end;
	
	gm_showstates = function(self, player)
		local s = 'states:' .. GM_NEWLINE
		local container = player:getStateContainer()
		for i=1, container:getStatesCount(), 1 do
			local state = container:getStateByIdx(i)
			s = s .. '  id:' .. state:getEffectId()
		end
		return GM_RET_OK, s
	end;
	
	gm_clearstate = function(self, player, params)
		local effectId = self:getNumber(params, 1)
		if effectId == nil or effectId < 0 then return GM_RET_INVALIDPARAM end
		
		local container = player:getStateContainer()
		container:stopState(effectId)
		return GM_RET_OK
	end;
	
	gm_setrolestate = function(self, player, params)
		local state = self:getNumber(params, 1)
		if state == nil or state < 0 then return GM_RET_INVALIDPARAM end
		
		player:setState(state)
		return GM_RET_OK
	end;
	
	gm_setroleattr = function(self, player, params)
		local attrid = self:getNumber(params, 1)
		if attrid == nil or attrid < 0 then return GM_RET_INVALIDPARAM end
		
		local val = self:getNumber(params, 2)
		if val == nil or val < 0 then return GM_RET_INVALIDPARAM end
		
		player:setAttrVal(attrid, val)
		return GM_RET_OK
	end;
	
	gm_exitalli = function(self, player, params)
		player:setAlliPos(0)
		RoleBaseSender:send(player, {'alliance'})
		return GM_RET_OK
	end;
	
	gm_clearAlliGiftTimes = function(self, player, params)
		local alliance = app:getAlliMgr():getAlliById( player:getAlliId() )
		if alliance:isNull() then
			return GM_RET_OK
		end
		
		local member = alliance:getMemberById(player:getRoleId())
		member:setGainGiftCount({count=0, lastTime=0})
		member:setFeedCount({count=0, lastTime=0})
		return GM_RET_OK
	end;
	
	
	
	gm_clearActTerraceCount = function(self, player, params)
		player:getActTerrace():setTodayEnterTimes(0)
		player:getActTerrace():setLeftLifes(0)
		ActTerraceSender:sendBaseInfo(player)
		return GM_RET_OK
	end;
	
	gm_cleartask = function(self, player, params)
		player:getTask():getCommTasks():clear()
	end;
	
	gm_addalligrowupval = function(self, player, params)
		local val = self:getNumber(params, 1)
		if val == nil or val < 0 then return GM_RET_INVALIDPARAM end
		
		local alliance = app:getAlliMgr():getAlliById( player:getAlliId() )
		if alliance:getId() == 0 then
			return GM_RET_OK, 'you not in alliance'
		end
		
		local lawLight = alliance:getLawLight()
		lawLight:setGrowupVal(lawLight:getGrowupVal() + val)
		
		return GM_RET_OK
	end;
	]]
	gm_help = function(self, player, params)
		local msg = ''
		msg = msg..'//addres 资源数量 --[增加粮食、木材、石料、生铁]'..GM_NEWLINE
		msg = msg..'//addfood 资源数量 --[增加粮食]'..GM_NEWLINE
		msg = msg..'//addwood 资源数量 --[增加木材]'..GM_NEWLINE
		msg = msg..'//addstone 资源数量 --[增加石料]'..GM_NEWLINE
		msg = msg..'//addiron 资源数量 --[增加生铁]'..GM_NEWLINE
		msg = msg..'//additem 道具ID 道具数量 --[增加道具]'..GM_NEWLINE
		--[[
		msg = msg..'//addbuildval 建设度 --[增加建设度]'..GM_NEWLINE
		msg = msg..'//addexp 君主经验 --[增加君主经验]'..GM_NEWLINE
		msg = msg..'//addidle 空闲人口 --[增加空闲人口]'..GM_NEWLINE
		msg = msg..'//addmoney 钱数 --[增加钱数]'..GM_NEWLINE
		msg = msg..'//addherohealth 英雄序号 健康值 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//addheromorale 英雄序号 士气值 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//addheroexp 英雄序号 经验值 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//addherocredit 英雄序号 武勋值 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//setheroslevel 英雄序号 等级 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//setheroif 英雄序号 内功值 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//setherostate 英雄序号 状态 --[英雄序号从0开始]'..GM_NEWLINE
		msg = msg..'//setrolelevel 君主等级 --[设置君主等级]'..GM_NEWLINE
		msg = msg..'//addnewsoldier 新兵数量 --[增加新兵数量]'..GM_NEWLINE
		]]
		msg = msg..'//addgiftgold 数量--[增加礼金]'..GM_NEWLINE
		msg = msg..'//add_other_giftgold [君主名] 数量 --[该其他君主增加礼金]'..GM_NEWLINE
		msg = msg..'//clear_other_pkg [君主名] -- [清空其他君主的背包]'..GM_NEWLINE
		msg = msg..'//add_other_item [君主名] 道具ID 道具数量 --[给其他君主增加道具]'..GM_NEWLINE
		msg = msg..'//set_other_herostate [君主名] 第几个 状态 --[设置其他君主的武将的状态]'..GM_NEWLINE
		msg = msg..'//send_other_mail--[君主名] [邮件标题] [邮件内容] [道具id1:个数] [道具id2:个数]'..GM_NEWLINE
		msg = msg..'//armyarrive armyId --[将指定的军队立刻到达]'..GM_NEWLINE
		msg = msg..'//send_sysmsg msg --[向在线玩家发送系统消息]'..GM_NEWLINE
		msg = msg..'//is_online [君主名] --[判断一个玩家是否在线]'..GM_NEWLINE
		msg = msg..'//get_onlines--[判断当前玩家在线人数]'..GM_NEWLINE
		msg = msg..'//paygold 金币资源id 数量--[模拟充值]'..GM_NEWLINE
		msg = msg..'//attr_getpayact 君主名--[模拟充值]'..GM_NEWLINE
		msg = msg..'//addpaygold 金币数--[增加君主的已充值的记录，为刷新vip等级用]'..GM_NEWLINE
		msg = msg..'//startserver 1/0--[开服或关服 1表示开服，0表示关服]'..GM_NEWLINE
		msg = msg..'//setprestige val--[设置声望]'..GM_NEWLINE
		msg = msg..'//getserverstat--[获取当前服务器关开状态]'..GM_NEWLINE
		msg = msg..'//lockuser 小时数--[封号]'..GM_NEWLINE
		msg = msg..'//startcdk 1/0--[打开或关闭cdk功能]'..GM_NEWLINE
		msg = msg..'//getcomroleinfo 君主名--[获取角色普通信息]'..GM_NEWLINE
		msg = msg..'//showpkgitems 君主名 最低个数--[查看背包]'..GM_NEWLINE
		msg = msg..'//subpkgitems1 君主名 itemid 个数--[删除道具]'..GM_NEWLINE
		msg = msg..'//subpkgitems2 君主名 resid 个数--[删除道具]'..GM_NEWLINE

		--[[
		msg = msg..'//addgold 数量--[增加金币]'..GM_NEWLINE
		msg = msg..'//clearlineups --[清空阵型]'..GM_NEWLINE
		msg = msg..'//addlineup 阵型ID --[增加新阵型]'..GM_NEWLINE
		msg = msg..'//clearpkg  --[清空背包]'..GM_NEWLINE
		msg = msg..'//subbval  数量--[增加建设度受损值]'..GM_NEWLINE
		msg = msg..'//clearfightrefstate  --[清空宣战列表]'..GM_NEWLINE
		msg = msg..'//showarmyids  --[显示当前军情的id]'..GM_NEWLINE
		
		msg = msg..'//clearmyarmys --[清空自己身上缓冲的army列表]'..GM_NEWLINE
		msg = msg..'//clearselffield --[清空自己的野地列表]'..GM_NEWLINE
		msg = msg..'//showstates --[显示君主上所有状态效果]'..GM_NEWLINE
		msg = msg..'//clearstate effectId--[清除君主某一状态效果]'..GM_NEWLINE
		msg = msg..'//setrolestate state--[设置君主状态]'..GM_NEWLINE
		msg = msg..'//setroleattr attrid val --[设置君主属性]'..GM_NEWLINE
		msg = msg..'//exitalli --[退出联盟]'..GM_NEWLINE
		msg = msg..'//clearAlliGiftTimes --[清除联盟领取奖励次数]'..GM_NEWLINE
		msg = msg..'//clearActTowerCount --[清除千层塔进入次数]'..GM_NEWLINE
		msg = msg..'//clearActTerraceCount --[清除点将台进入次数]'..GM_NEWLINE
		msg = msg..'//cleartask  --[清理任务]'..GM_NEWLINE
		msg = msg..'//addalligrowupval 成长值 --[增加圣兽的成长值]'..GM_NEWLINE
		]]
		local appendInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		ChatSender:sendMsg(player, 0, CHAT_SYSPLAYER.SYS, '', appendInfo, CHAT_CHANNEL.PRIVATE, msg)
		return GM_RET_OK
	end;
}):new()



