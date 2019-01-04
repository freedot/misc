GameApp = Class:extends({
	init = function(self)
		--对象是否被创建的标志
		self._created = rinit(self._created, false)
		if self._created then 
			self:registerAllEvent() 
		end
		math.randomseed(Util:getTime())
		self.playermgr = PlayerMgr:rnew(self.playermgr)
		
		self.evtcast = rinit(self.evtcast, EventCast())
		self.syscommander = SysCommander:rnew(self.syscommander)
		self.evtreg = rinit(self.evtreg, {})
		self.handlers = rinit(self.handlers, {})
		self.dbconn = DBConn:new()
		self.dbconn:setConn(SPub:GetDBConn())
		
		self.cityMgr = CityManager:new(self)
		self.cityMgr:load()
		
		self.armyMgr = ArmyMgr:new(self)
		self.armyMgr:startTimers()
		
		self.mailMgr = MailMgr:new(self)
		
		self.allimgr = AllianceMgr:new(self)
		
		self.actTowerRank = ActTowerRank:new(self)
		self.roleRank = RoleRank:new(self)
		
		self.worldBlessQueue = WorldBlessQueue:new(self)
		self.worldMsgQueue = WorldMsgQueue:new(self)
		self.svrAct = ServerActEffect(self)
			
		self:_initHandlers()
		
		--self.svrAct.start()
		--self.actTowerRank.start()
		--self.roleRank.start()
		--self.allimgr.start()
	end;
	
	evtRegister = function(self, eventid, fun)
		local handle = AppEvtRegister(nil, eventid, -1, -1, self, fun)
		table.insert(self.evtreg, {keyobj=self, handle=handle, baseobj=nil})
	end;
	
	create = function(self)
		math.randomseed(Util:getTime())
		self:registerAllEvent()
		self._created = true
		
		UUIDMgr:load()
		Repository:load()
	end;
	
	registerAllEvent = function(self)
	end;
	
	unRegisterAll = function(self)
	end;

	handleError = function(self, player)
		err, appendmsg = getLastError()
		if err.needsend then
			local closeflag = 0
			if err.needclose then closeflag = 1 end
			local msg = err.msg 
			if appendmsg ~= nil and appendmsg ~= '' then
				msg = appendmsg
			end
			local errmsg = '{cmd:'..NETCMD.ERROR..',msg:\"'..msg..'\",closeflag:'..closeflag..'}'
			LOG('<error> handleError: msg:' .. msg .. ', closeflag:' .. closeflag)
			if player ~= nil then
				player:sendMsg(errmsg)
			end
		end
		if err.needclose then
			if player:isDeleted() then
				LOG('<error> save player after player is deleted!, [handleError] ')
			end
			self.playermgr:exitPlayer(player)
		end
		if err.needlog then
			local lmsg = FormatErrorLog(player, err)
			LOG(lmsg)
		end
	end;
	
	_setHandler = function(self, cmdid, handlerClass)
		self.handlers['c'..cmdid] = handlerClass:new(self.handlers['c'..cmdid])
	end;
	
	getCmdHandler = function(self, cmdid)
		return self.handlers['c'..cmdid]
	end;
	
	getDBConn = function(self)
		return self.dbconn
	end;
	
	onProxyRequest = function(self, nevt)
		setLastError(TQERR.OK)
		self:handleInGameData(nil, nevt)
		if getLastError() ~= TQERR.OK then
			self:handleError(nil)
		end
	end;

	onRequest = function(self, nevt)
		setLastError(TQERR.OK)
		local player = self.playermgr:getPlayerById(nevt.playerid, nevt.connid)
		if player == nil then
			player = self.playermgr:newPlayer(nevt.playerid, nevt.connid)
		end
		if player:getGameState() == EGUS_LOGINNING then
			self:handleLoginningData(player, nevt)
		else
			self:handleInGameData(player, nevt)
		end
		if getLastError() ~= TQERR.OK then
			self:handleError(player)
		end
	end;
	
	onCommand = function(self, nevt)
		local cmdtb = Util:safeEval(nevt.data)
		if cmdtb ~= nil then
			self.syscommander:onCommand(nevt, cmdtb)
		end
	end;
	
	getPlayerMgr = function(self)
		return self.playermgr
	end;
	
	getWorldBlessQueue = function(self)
		return self.worldBlessQueue
	end;
	
	getWorldMsgQueue = function(self)
		return self.worldMsgQueue
	end;
	
	getSvrAct = function(self)
		return self.svrAct
	end;
	
	getCityMgr = function(self)
		return self.cityMgr
	end;
	
	getArmyMgr = function(self)
		return self.armyMgr
	end;
	
	getMailMgr = function(self)
		return self.mailMgr
	end;
	
	getAlliMgr = function(self)
		return self.allimgr
	end;
	
	getActTowerRank = function(self)
		return self.actTowerRank
	end;
	
	getRoleRank = function(self)
		return self.roleRank
	end;
	
	handleLoginningData = function(self, player, nevt)
		local sigtb = Util:safeEval( DecodeSig(nevt.data) )
		if sigtb ~= nil then
			local loginHdr = self:getCmdHandler(NETCMD.LOGIN)
			if loginHdr.onRequest ~= nil then
				loginHdr:onRequest(player, nevt, sigtb)
			elseif loginHdr.OnRequest ~= nil then
				loginHdr:OnRequest(player, nevt, sigtb)
			end
		else
			setLastError(TQERR.UNKNOWN)
			player:setValidRole(false)
		end
	end;
	
	handleInGameData = function(self, player, nevt)
		if IsDebug() then print('...[c->s]: recv data = '..nevt.data) end
		local cmdtb = Util:safeEval(nevt.data)
		if cmdtb ~= nil then
			local cmdhdr = self:getCmdHandler(Util:getNumber(cmdtb, 'cmd'))
			if cmdhdr == nil then
				setLastError(TQERR.UNKNOWNHDR)
				print ('error cmdid:' .. Util:getNumber(cmdtb, 'cmd') )
				LOG('<error> cmdid:' .. Util:getNumber(cmdtb, 'cmd'))
			elseif cmdhdr.onRequest ~= nil then
				cmdhdr:onRequest(player, nevt, cmdtb)
			elseif cmdhdr.OnRequest ~= nil then
				cmdhdr:OnRequest(player, nevt, cmdtb)
			end
		else
			setLastError(TQERR.UNKNOWN)
		end
	end;

	_initHandlers = function(self)
		self:reloadHandlers(self:getHandlerCfg())
	end;
	
	reloadHandlers = function(self, cfgs)
		for _, cfg in ipairs(cfgs) do
			print ( 'load handler cmd : ' .. self:_getCmdIdName(cfg[1]) )
			self:_setHandler(cfg[1], cfg[2])
		end
	end;
	
	getHandlerCfg = function(self)
		return { -- cmdid, handlerClass, isCanReload
			{NETCMD.LOGIN, LoginHandler},
			{NETCMD.CREATEROLE, CreateRoleHandler},
			{NETCMD.BUILDRES, BuildResHandler},
			{NETCMD.HEARTBEAT, HeartBeatHandler},
			{NETCMD.USEITEM, UseItemHandler},
			{NETCMD.GENRES, GenResHandler},
			{NETCMD.SOLDIERRES, SoldierResHandler},
			{NETCMD.DEFRES, DefResHandler},
			{NETCMD.CHAT, ChatHandler},
			{NETCMD.ROLEBASE, RoleBaseHandler},
			{NETCMD.PKG, PkgHandler},
			{NETCMD.SHOP, ShopHandler},
			{NETCMD.DEAL, DealHandler},
			{NETCMD.REPORT, ReportHandler},
			{NETCMD.MAIL, MailHandler},
			{NETCMD.STORE, StoreHandler},
			{NETCMD.TASK, TaskHandler},
			{NETCMD.MAP, StateCityHandler},
			{NETCMD.MILITARY, MilitaryHandler},
			{NETCMD.HERORES, HeroResHandler},
			{NETCMD.CITYRES, CityResHandler},
			{NETCMD.FRIEND, FriendHandler},
			{NETCMD.TEAM, TeamHandler},
			{NETCMD.ITEM, ItemHandler},
			{NETCMD.FARM, FarmResHandler},
			{NETCMD.CULTURE, CultureHandler},
			{NETCMD.STRATEGY, StrategyHandler},
			{NETCMD.RANKING, RankingHandler},
			{NETCMD.ALLIANCE, AllianceHandler},
			{NETCMD.MAKE, MakeHandler},
			{NETCMD.NPCTALK, NpcTalkHandler},
			{NETCMD.ITEMOP, ItemOpHandler},
			{NETCMD.SELFFIELD, CmdSelfFieldHandler},
			{NETCMD.OUTFIELD, OutFieldHandler},
			{NETCMD.CITYDEF, CityDefHandler},
			{NETCMD.TOWER, TowerHandler},
			{NETCMD.EXCHANGEEXP, ExchangeExpHandler},
			{NETCMD.FIGHTREFSTATE, FightRefStateHandler},
			{NETCMD.ROLESTATE, RoleStateHandler},
			{NETCMD.OTHERPLAYERINFO, OtherPlayerInfoHdr},
			{NETCMD.TRADING_AREA, TradingAreaHdr},
			{NETCMD.ACT_TOWER, ActTowerHdr},
			{NETCMD.ACT_TERRACE, ActTerraceHdr},
			{NETCMD.ACTIVITY_VAL, ActivityValHandler},
			{NETCMD.NEWCOMERHELP, NewcomerHelperHdr},
			{NETCMD.EXCHANGE, ExchangeHandler},
			{NETCMD.CLT_LOG, CltLogHandler},
			{NETCMD.PROXY_QueryGold, QueryGoldHandler},
			{NETCMD.PROXY_GetBuyToken, GetBuyTokenHandler},
			{NETCMD.PROXY_DealResult, DealResultHandler},
			{NETCMD.PROXY_QueryUserExist, QueryUserExistHandler},
			{NETCMD.PROXY_DealResult32Wan, DealResult32WanHandler},
			{NETCMD.YELLOWDIAMOND, YellowDiamondHandler},
			{NETCMD.BLUEDIAMOND, BlueDiamondHandler},
			{NETCMD.RESULT_BuyByGold, ResultBuyHandler},
			{NETCMD.CLT_CFG, ClientCfgHandler},
			{NETCMD.AUTOBUILD, AutoBuildsHandler},
			{NETCMD.CDKEY, CDKeyHandler},
			{NETCMD.PROXY_OS_GM, OsGmHandler},
			{NETCMD.WORLDBOSS, WorldBossDlgHandler},
			{NETCMD.SEND_REWARD, SendRewardHandler},
			{NETCMD_GM, GMHandler},
		}
	end;
	
	_getCmdIdName = function(self, cmdId)
		for name, id in pairs(NETCMD) do
			if cmdId == id then
				return 'NETCMD.' .. name
			end
		end
		
		if cmdId == NETCMD_GM then
			return 'NETCMD_GM'
		end
		
		return 'INVALID_CMD'
	end;
})


