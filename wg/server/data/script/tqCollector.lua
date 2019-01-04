--*******************************************************************************
HasHighHeroSpec = Class:extends({
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

PlayersCollector = Class:extends({
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
	end;
})

AllianceCollector = Class:extends({
	collect = function(self, needCount)
		local rankss = {}
		local count = app:getAlliMgr():getSortAlliCount(0)	
		needCount = math.min(count, needCount)
		for rank=1, needCount, 1 do
			local alliance = app:getAlliMgr():getSortAlliBy(0, rank-1)
			local memCount = alliance:getMemberCount()
			local ranks = {}
			for idx = 0, memCount-1, 1 do
				local roleId = alliance:getMemberByIdx(idx):getId()
				local roleName = app:getCityMgr():getRoleNameByRoleId(roleId)
				table.insert(ranks, {roleName=roleName})
			end
			table.insert(rankss, ranks)
		end
		return rankss
	end;
})



