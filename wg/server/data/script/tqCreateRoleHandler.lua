CreateRoleHandler = Class:extends({
	onRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 0 then
			self:createRole(player, cmdtb)
		elseif cmdtb.subcmd == 1 then
			self:onCheckValid(player, cmdtb)
		elseif cmdtb.subcmd == 2 then
			self:onGetRandName(player, cmdtb)
		elseif cmdtb.subcmd == 3 then
			self:onGetDieCityRandPos(player, cmdtb)
		elseif cmdtb.subcmd == 4 then
			self:onSetDieCityPos(player, cmdtb)
		else
			setLastError(TQERR.UNKNOWN)
		end
	end;
	
	createRole = function(self, player, cmdtb)
		self:getParam(player, cmdtb)
		if not self:checkCreateRoleParam(player) then 
			setLastErrorStr(rstr.err.invalidparam)
			return
		end
		
		self.cityid = self:getHasFreeGridCityId()
		if self.cityid == -1 then
			CreateRoleSender:sendCreateRoleFailedMsg(self.player)
			setLastError(TQERR.FULLINTHISCITY)
			return
		end
		
		self:initRoleBaseData(self.player)
		self.player:setRoleId( SPub:MakeNewRoleId(self.player:getPersistVar()) )
		self.player:getTimerCaller():setId(self.player:getRoleId())
		self.player:setRegTime(Util:getTime())
		local ret = SPub:CreateRole(self.player:getPersistVar())
		if ret ~= 0 then
			CreateRoleSender:sendCreateRoleFailedMsg(self.player)
			setLastError(TQERR.UNKNOWNCREATEROLE)
			return
		end
		
		local pos = app:getCityMgr():getFreeCityPos( self.cityid )
		self.player:setCityPos(pos)
		app:getCityMgr():initPlayerGrid(self.player)
		self:initRoleData(self.player)
		self.player:getTask():getOnlineTask():setTask(FIXID.FIRST_ONLINE_TASK, 0)
		self.player:getTask():getNewcomerTask():setCurTaskId(FIXID.FIRST_NEWCOMER_TASK)
		self.player:getTask():initGrowupTasks()
		CreateRoleSender:sendCreateRoleOkMsg(self.player)
		local isBDBrowser = (Util:getNumber(cmdtb, 'bd', 0) == 1)
		app:getCmdHandler(NETCMD.LOGIN):startLogin(self.player, isBDBrowser)
		if self.player:isDeleted() then
			LOG('<error> save player after player is deleted!, [createRole] ')
		end
		self.player:save()
	end;
	
	getHasFreeGridCityId = function(self)
		local cityIds = app:getCityMgr():getRandCityIds()
		for _, cityId in ipairs(cityIds) do
			if app:getCityMgr():hasFreeGrid( cityId ) then
				return cityId
			end
		end	
		return -1
	end;
	
	onCheckValid = function(self, player, cmdtb)
		self.player = player
		self.rname = Util:getString(cmdtb, 'rname')
		local rtmsg = 'OK'
		if not self:isValidNewRoleName() then
			rtmsg = getLastErrorStr()
		end
		CreateRoleSender:sendCheckMsg(self.player, "rname", rtmsg)
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.rname = Util:getString(cmdtb, 'rname')
		self.icon = Util:getNumber(cmdtb, 'icon')
		if self.icon < 200 then
			self.sex = ROLE_SEX.MALE
		else
			self.sex = ROLE_SEX.FEMALE
		end
	end;

	checkCreateRoleParam = function(self)
		if not self:isValidNewRoleName() then
			CreateRoleSender:sendCheckMsg(self.player, "rname", getLastErrorStr())
			return false
		elseif (not self:isValidSex() 
			or not self:isValidIcon() ) then
			setLastError(TQERR.INVALIDCREATEROLE)
			return false
		end
		return true
	end;
	
	isValidNewRoleName = function(self)
		return ValidChecker:isRoleName(self.rname) and ValidChecker:isNewRoleName(self.rname)
	end;
	
	isValidSex = function(self) 
		return (self.sex == ROLE_SEX.MALE or self.sex == ROLE_SEX.FEMALE)
	end;
	
	isValidIcon = function(self)
		return Util:qfind(res_role_iconids[self.sex+1], nil, self.icon) ~= nil
	end;
	
	initRoleBaseData = function(self, player)
		local dbvar = player:getPersistVar()
		dbvar.szUName = player:getName()
		dbvar.stFixVar.ulCreateTime = Util:getTime()
		dbvar.stFixVar.ulCityId = self.cityid
		dbvar.stBInfos.ulPrestige = res_role_initdata.prestige
		
		player:setIcon(self.icon)
		player:setSex(self.sex)
		player:setRoleName(self.rname)
		player:setLevel(res_role_initdata.level)
		player:setAlliId(0)
		player:setState(ROLE_STATE.YOUNG)
		
		if IsDebug() then
			player:setGMFlag(1)
		end
	end;	
	
	initRoleData = function(self, player)
		self:initRoleFarmData(player)
		self:initRoleBuildData(player)
		self:initRoleAttrs(player)
		self:initCityResData(player)
		self:initCityBuildVal(player)
		self:initRoleMilitaryData(player)
		self:initRolePackageData(player)
		self:initLineups(player)
	end;
	
	initRoleFarmData = function(self, player)
		local farm = player:getFarm()
		for _, resfarm in ipairs(res_role_initdata.farm) do
			farm:seedBlock(resfarm)
		end
	end;

	initRoleBuildData = function(self, player)
		local city = player:getCitys():addCity(CITY_TYPE.MAIN)
		if city == nil then return end
		for _, b in ipairs(res_role_initdata.inbuild) do
			city:addBuild({id=b.id,resid=b.resid,level=b.level,state=b.state,stoptime=0})
		end
	end;
	
	initOneBuildData = function(self, build, resbuild)
		build.ulId = resbuild.id
		build.ulResId = resbuild.resid
		build.ucLevel = resbuild.level
		build.ucState = resbuild.state
	end;
	
	initRoleAttrs = function(self, player)
		local dbvar = player:getPersistVar()
		dbvar.stBInfos.stAttrs.ucCount = table.getn(res_role_initdata.attrs)
		for i, a in ipairs(res_role_initdata.attrs) do
			dbvar.stBInfos.stAttrs.astAttrs[i-1].usAttr = a.attr
			dbvar.stBInfos.stAttrs.astAttrs[i-1].ulVal = a.val
		end
		player:setNextXP()
		player:setNSLastTime(Util:getTime())
	end;
	
	initCityResData = function(self, player)
		local cres = player:getCityRes()
		
		cres:setTax(res_role_initdata.cityres.taxrate)
		
		cres:setILastTime(Util:getTime())
		cres:setIdlePopu(res_role_initdata.cityres.idlepopu)
		
		cres:setMLastTime(Util:getTime())
		cres:setMoney(res_role_initdata.cityres.money)
		
		cres:setFood(res_role_initdata.cityres.food)
		cres:setWood(res_role_initdata.cityres.wood)
		cres:setStone(res_role_initdata.cityres.stone)
		cres:setIron(res_role_initdata.cityres.iron)
		cres:setLevel(res_role_initdata.cityres.citylevel)
	end;
	
	initCityBuildVal = function(self, player)
		local buildval = 0
		local citys = player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		local builds = city:getBuilds()
		for i=0, builds.ucTotal-1, 1 do
			local build = builds.astInBuilds[i]
			buildval =  buildval + res_buildup_addbuildval(build.ucLevel)
		end
		local cres = player:getCityRes()
		cres:setBuildVal(buildval)
		cres:setBuildHurtValAndState(buildval*res_newrole_hurtbuidval_per)
	end;
	
	initRoleMilitaryData = function(self, player)
		local m = player:getPersistVar().military
	end;
	
	initRolePackageData = function(self, player)
		local pkg = player:getPkg()
		pkg:setMaxGridsCnt(res_role_initdata.pkg.maxgridcnt)
		pkg:setGold(res_role_initdata.pkg.gold)
		pkg:setGiftGold(res_role_initdata.pkg.giftgold)
		pkg:setLastSalveTime()
		local rawItems = DropItem():createRawItems(res_role_initdata.pkg.items)
		pkg:addItems(rawItems)
	end;
	
	initLineups = function(self, player)
		player:addLineup(FIXID.DEFAULTLINEUP)
	end;
	
	onGetRandName = function(self, player, cmdtb)
		local sex = Util:getNumber(cmdtb, 'sex')
		if sex ~= ROLE_SEX.MALE and sex ~= ROLE_SEX.FEMALE then
			return
		end

		local xingIdx = math.random(table.getn(res_rolenames_xing))
		local xing = res_rolenames_xing[xingIdx].name
		local mingIdx = math.random(table.getn(res_rolenames_ming))
		local ming = res_rolenames_ming[mingIdx].name[sex+1]
		
		local randName = xing .. ming
		CreateRoleSender:sendRandName(player, randName)
	end;
	
	onGetDieCityRandPos = function(self, player, cmdtb)
		if player:getCityRes():getLevel() ~= 0 then
			return
		end
		
		player:getCityRes():sendCityDie()
	end;
	
	onSetDieCityPos = function(self, player, cmdtb)
		if player:getCityRes():getLevel() ~= 0 then
			return
		end
		
		local pos = {x=Util:getNumber(cmdtb, 'x'), y=Util:getNumber(cmdtb, 'y')}
		local exileGrid = app:getCityMgr():getExileGridByRoleId(player:getRoleId())
		if exileGrid == nil then
			LOG('<error> 44352sf312 roleid:' .. player:getRoleId())
			return
		end
		if not self:_isValidPos(exileGrid, pos) then
			WUtil:sendWarningMsgArgs(player, 100174, '')
			return
		end
	
		player:setCityPos(pos)
		app:getCityMgr():initPlayerGrid(player)
		app:getCityMgr():removeExileGridByRoleId(player:getRoleId())
		player:getCityRes():setBuildHurtValAndState(player:getCityRes():getBuildHurtVal()-1)
		player:getCityRes():setLevel(1)
		player:refreshCityGrid()
		CityBuildValSender:sendAll(player)
		RoleBaseSender:sendAll(player)
		CreateRoleSender:sendSetCityDiePosOk(player)
		
		local stateRes = {type=EFFECT_TYPE.PER_MINUTE,duration=3*24*3600, effect={id=RES_EFF.HURT_SPEED_BUILDVAL,val=400,unit=VAL_UNIT.PER}}
		local creator = {type=0,id=0,skillId=0}
		player:getStateContainer():appendState(stateRes, creator)
	end;
	
	_isValidPos = function(self, exileGrid, curPos)
		local cityMgr = app:getCityMgr()
		local curGrid = cityMgr:getGridByPos(curPos)
		if curGrid == nil or curGrid.objType ~= OBJ_TYPE.NONE then
			return false
		end
		
		local exilePos = cityMgr:getPosByGridId(exileGrid.gridId)
		return cityMgr:getCityResIdByPos(curPos) ==  cityMgr:getCityResIdByPos(exilePos)
	end;
})


