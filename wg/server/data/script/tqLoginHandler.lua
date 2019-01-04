
LoginHandler = Class:extends({
	onRequest = function(self, player, netevt, cmdtb)
		if not self:isValidSigCmd(netevt, cmdtb) then
			setLastError(TQERR.INVALIDSIG)
			player:setValidRole(false)
			return
		end
		local userName = Util:getString(cmdtb, 'user')
		if not ServerStartChecker:isCanLogin(userName) then
			setLastError(TQERR.SVRNOTOPEN)
			player:setValidRole(false)
			return 
		end
		
		local isBDBrowser = (Util:getNumber(cmdtb, 'bd', 0) == 1)
		self:exitPlayer(userName)
		self:sendStartMsg(player)
		self:sendHeartBeatMsg(player)
		local ret = self:roleLogin(player, cmdtb)
		player:setPlatForm(cmdtb.platform)
		player:setQQMembership(cmdtb.qqmembership)		
		if ret == RET_LOGIN_NOROLE then
			self:startCreateRole(player, cmdtb)
		elseif ret == RET_LOGIN_OK then
			self:startLogin(player, isBDBrowser)
			if player:getCityRes():getLevel() == 0 then
				player:getCityRes():sendCityDie()
			end
		end
	end;
	
	startLogin = function(self, player, isBDBrowser)
		if Util:getTime() < player:getLockToTime() then
			local lockToTime = os.date("%Y-%m-%d %H:%M:%S", player:getLockToTime())
			local appendmsg = TQERR.LOCKEDUSER.msg .. '[' .. lockToTime .. ']'
			setLastError(TQERR.LOCKEDUSER, appendmsg)
			player:setValidRole(false)
			return
		end
		
		player:getTimerCaller():setId(player:getRoleId())
		player:loginOk()
		app:getPlayerMgr():appendPlayerIndex(player)
		self:sendLoginOkStartMsg(player)
		self:sendLoginOkEndMsg(player)
		player:setGameState(EGUS_INGAME)
		player:sendNotifyLoginOk()
		Service:getProxyServer():sendQueryGold(player)
		self:resetLoginDatas(player)
		self:startSomeTimers(player)
		self:sendMsgs(player)
		self:_resetLoginTime(player)
		self:_checkTasks(player, isBDBrowser)
		local proxy = Service:getProxyServer()
		proxy:resetDealTime(player:getName(), proxy:getCancelTimeOut())
		player:getTask():getPayAct():check()
		ActivityValSender:sendPayGiftGots(player)
		ActivityValSender:sendPayActAllGold(player)
		app:getSvrAct():addPlayerState(player)
		player:checkUpgradeVipLevel()
		PayGoldSender:sendPayGold(player)
		AutoBuildSender:sendInfo(player)
		StateCitySender:sendMapView(player)
		
		if player:getTask():getNewcomerTask():isGlobalTipEnd() then
			TaskSender:sendOpenTodayAct(player)
		elseif player:getTask():getNewcomerTask():isTaskEnd() then
			TaskSender:sendStartGlobalTip(player)
		end
		
		ClientCfgSender:sendHelpTips(player)
		
		LOGEX('ACU', '<login> time:' .. Util:getTime() .. ', user:' .. player:getName() .. ', role:' .. player:getRoleName() )
	end;
	
	offlineRoleLogin = function(self, player, username)
		local rt = SPub:RoleLogin(player:getPersistVar(), username, SPub:GetZoneId() )
		if ( rt ~= RET_LOGIN_OK ) then return false end
		
		player:getTimerCaller():setId(player:getRoleId())
		player:loginStart()
		player:loginOk()
		player:setName(username)
		player:setGameState(EGUS_OFFLINE_INGAME)
		self:resetLoginDatas(player)
		app:getSvrAct():addPlayerState(player)
		return true
	end;
	
	isValidSigCmd = function(self, netevt, cmdtb)
		return (self:isLoginCmd(netevt, cmdtb) 
			and self:isValidStampTime(netevt, cmdtb) 
			and self:isValidUserName(netevt, cmdtb) 
			and self:isValidZoneId(netevt, cmdtb) )
			and cmdtb.qqmembership ~= nil
	end;

	isLoginCmd = function(self, netevt, cmdtb) 
		if Util:getNumber(cmdtb, 'cmd') ~= NETCMD.LOGIN then
			setLastError(TQERR.INVALIDSIG)
			print('*sig error, invalid cmd')
			return false
		end
		return true
	end;
	
	isValidStampTime = function (self, netevt, cmdtb)
		local drttime = Util:getTime() - Util:getNumber(cmdtb, 'stamp');
		if drttime > 3600 then
			setLastError(TQERR.STAMP_TIMEOUT)
			print('*sig error, invalid stamp')
			return false
		end
		return true
	end;
	
	isValidUserName = function(self, netevt, cmdtb) 
		local username = Util:getString(cmdtb, 'user')
		if not ValidChecker:isUserName(username) then
			setLastError(TQERR.INVALIDUSERNAME)
			print('*sig error, invalid user name')
			return false
		end
		return true
	end;
	
	isValidZoneId = function(self, netevt, cmdtb)
		if Util:getNumber(cmdtb, 'zoneid', -1) == -1 then
			setLastError(TQERR.INVALIDSIG)
			print('*sig error, invalid username')
			return false
		end
		return true
	end;
	
	sendStartMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.LOGIN..',begin:1,id:'..player:getId()..'}'
		player:sendMsg(sendmsg)
	end;
	
	sendHeartBeatMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.HEARTBEAT..',svrtime:'..Util:getTime()..'}'
		player:sendMsg(sendmsg)
	end;
	
	sendLoginOkStartMsg = function(self, player)
		local userkey = Util:createRandKey()
		local sendmsg = '{cmd:'..NETCMD.LOGIN..',result:0,svrtime:'..Util:getTime()..',key:"'..userkey..'",pkgmaxlen:65535}'
		player:sendMsg(sendmsg)
		player:setUserKey(userkey)
	end;
	
	sendLoginOkEndMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.LOGIN..', result:2}'
		player:sendMsg(sendmsg)
	end;

	roleLogin = function(self, player, cmdtb)
		local rt = SPub:RoleLogin(player:getPersistVar(), 
			Util:getString(cmdtb, 'user'), 
			Util:getNumber(cmdtb, 'zoneid'))
		if ( rt == RET_LOGIN_NOROLE or rt == RET_LOGIN_OK ) then
			player:loginStart()
			player:setName(Util:getString(cmdtb, 'user'))
			return rt
		elseif ( rt == RET_LOGIN_DBFIELD_NOENOUGH_LEN 
			or rt == RET_LOGIN_DBFIELD_ERR ) then
			setLastError(TQERR.INVALIDUSERDATA)
			player:setValidRole(false)
		elseif rt == RET_LOGIN_ZONEID_ERR then
			setLastError(TQERR.INVALIDSIG)
			player:setValidRole(false)
		else
			setLastError(TQERR.UNKNOWN)
			player:setValidRole(false)
		end	
		return RET_LOGIN_ERR
	end;
	
	startCreateRole = function(self, player, cmdtb)
		app:getPlayerMgr():appendPlayerIndex(player)
		self:sendStartCreateRoleMsg(player)
		CreateRoleSender:sendCreateRoleInfoMsg(player)
		player:setGameState(EGUS_CREATEROLE)
		player:sendNotifyLoginOk()
	end;
	
	setResetRolePos = function(self, player)
	end;
	
	sendStartCreateRoleMsg = function(self, player)
		local userkey = Util:createRandKey()
		local sendmsg = '{cmd:'..NETCMD.LOGIN..',result:1,key:"'..userkey..'",pkgmaxlen:65535}'
		player:sendMsg(sendmsg)
		player:setUserKey(userkey)
	end;

	exitPlayer = function(self, name)
		local existplayer = app:getPlayerMgr():getPlayerByName(name)
		if existplayer == nil then
			existplayer = app:getPlayerMgr():getOfflinePlayerByName(name)
		end
		
		if existplayer ~= nil then
			local lastError = getLastError()
			setLastError(TQERR.RELOGIN)
			app:handleError(existplayer, TQERR.RELOGIN)
			setLastError(lastError)
		end
	end;
	
	resetLoginDatas = function(self, player)
		player:recalMaxNewSoldier()
		player:refreshPSAttr()
		player:getCityRes():refreshIdlePopu()
		player:getCityRes():refreshMoney()
		player:getCityRes():cutMoney()
		player:getCityRes():cutCommRes()
		self:checkRoleState(player)
		self:checkHerosState(player)
		player:refreshCityGrid()
	end;
	
	startSomeTimers = function(self, player)
		player:startSaveDBTimer()
		player:startRecalcHeroAttrTimer()
		player:startRefreshRoleAttrTimer()
	end;
	
	sendMsgs = function(self, player)
		ServerCfgSender:send(player)
		ClientCfgSender:sendToggleMap(player)
		ClientCfgSender:sendGongGaoVer(player)
		MilitarySender:sendSuccCopyFields(player)
	end;
	
	_resetLoginTime = function(self, player)
		local grid = player:getCityGrid()
		if grid == nil then
			return
		end 
		grid.loginTime = Util:getTime()
		app:getCityMgr():saveGrid(grid, {'loginTime'})
	end;
	
	_checkTasks = function(self, player, isBDBrowser)
		self:_doRoleFristLoginTask(player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY)
		if isBDBrowser then
			TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.USE_DOTBROWSER)
		end
		TaskFinisher:checkTasks(player)
	end;
	
	_doRoleFristLoginTask = function(self, player)
		local fmtFirstLoginTime = Util:getFixPreTime(player:getRegTime(), 0, 0, 0)
		local curTime = Util:getFixPreTime(Util:getTime(), 0, 0, 0)
		local days = (curTime - fmtFirstLoginTime)/(24*3600)
		if days > 10 then return end
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FIRST_ROLELOGIN, days)	
	end;
	
	checkRoleState = function(self, player)
		self:checkYoungState(player)
		self:checkLearningCulture(player)
		self:checkBuildingCityDef(player)
	end;
	
	checkYoungState = function(self, player)
		if player:getState() ~= ROLE_STATE.YOUNG then return end
		local drttime = Util:getTime() - player:getPersistVar().stFixVar.ulCreateTime
		if drttime >= res_young_days*3600*24 then
			player:setState(ROLE_STATE.FREE)
		else
			local elapse = res_young_days*3600*24-drttime
			global.getTimer():start(elapse*1000, {TIMER_EVT.YOUNG_END}, player:getTimerCaller())
		end
	end;
	
	checkLearningCulture = function(self, player)
		local learningCulture = player:getCultures():getLearningCulture()
		if learningCulture.id == 0 then return end
		
		local elapse = learningCulture.stoptime - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.LEARN_CULTURE_STOP, learningCulture.id}, player:getTimerCaller())
	end;
	
	checkBuildingCityDef = function(self, player)
		local cityDef = player:getCityDef()
		if cityDef:getBuildingResid() == 0 then 
			return 
		end
		
		local elapse = cityDef:getBuildingStopTime() - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.BUILD_CITYDEF_STOP, cityDef:getBuildingResid()}, player:getTimerCaller())
	end;
	
	checkHerosState = function(self, player)
		local heromgr = player:getHeroMgr()
		local cnt = heromgr:getHeroCount()
		for i=0, cnt-1, 1 do
			local hero = heromgr:getHeroByIdx(i)
			self:checkHeroUnlockState(player, hero)
			self:checkHeroSkeletonSteeling(player, hero)
			self:checkHeroSkillSteeling(player, hero)
			self:checkHeroSteeling(player, hero)
		end
	end;
	
	checkHeroUnlockState = function(self, player, hero)
		if hero:getLockState() ~= HERO_LOCKSTATE.UNLOCKING then 
			return 
		end
		
		local elapse = hero:getUnLockTime() - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.HERO_UNLOCK_STOP, hero:getId()}, player:getTimerCaller())
	end;
	
	checkHeroSkeletonSteeling = function(self, player, hero)
		if hero:getSSteelStopTime() == 0 then 
			return 
		end
		
		local elapse = hero:getSSteelStopTime() - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.SSTEEL_HERO_STOP, hero:getId()}, player:getTimerCaller())
	end;
	
	checkHeroSkillSteeling = function(self, player, hero)
		local skillsteel = hero:getSkillSteel()
		if skillsteel.ulResId == 0 or skillsteel.ulStoptime == 0 then 
			return 
		end

		local elapse = skillsteel.ulStoptime - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.SKILL_STEEL_HERO_STOP, hero:getId(), skillsteel.ulResId}, player:getTimerCaller())
	end;
	
	checkHeroSteeling = function(self, player, hero)
		local heroSteel = hero:getHeroSteel()
		if heroSteel:getStartTime() == 0 then 
			return 
		end

		local elapse = heroSteel:getStartTime() + heroSteel:getSteelQuarters()*900 - Util:getTime()
		global.getTimer():start(elapse*1000, {TIMER_EVT.HERO_STEEL_STOP, hero:getId(), heroSteel:getStartTime(), heroSteel:getSteelType()}, player:getTimerCaller())
	end;
})



