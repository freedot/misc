--*******************************************************************************
GameRoot = {
	run = function(self, gapp)
		if gapp == nil then
			self:create()
		end
		self:serviceRegister()
		self:serviceStart()
	end;
	
	create = function(self)
		global.loadSvrCfg()
		global.loadCodes(global.scriptFiles)
		global.loadNpcScripts()
		global.loadSvrAfterCfg()
		app = GameApp:rnew(app)
		app:create()
		if not Service:getProxyServer():connect() then
			StopServer()
		end	
	end;
	
	serviceRegister = function(self)
		Service:register('GmDB', GmDB:new(app))
		Service:register('RankRefreshDB', RankRefreshDB:new(app))
		Service:register('RoleRankDB', RoleRankDB:new(app))
		Service:register('AllianceRankDB', AllianceRankDB:new(app))
		Service:register('CountryRankDB', CountryRankDB:new(app))
		Service:register('RoleWorldBossRank', RoleWorldBossRank:new(app))
		Service:register('AllianceWorldBossRank', AllianceWorldBossRank:new(app))
		Service:register('AllianceRank', AllianceRank:new(app))
		Service:register('CountryWorldBossRank', CountryWorldBossRank:new(app))	
		Service:register('SvrVarDB', SvrVarDB:new(app))	
		Service:register('OpenSvrAct', OpenSvrAct:new(app))	
		Service:register('QuestionAct', QuestionAct:new(app))	
	end;
	
	serviceStart = function(self)	
		Service:getRoleWorldBossRank():start()
		Service:getAllianceWorldBossRank():start()
		Service:getCountryWorldBossRank():start()
		Service:getAllianceRank():start()
		app:getSvrAct():start()
		app:getActTowerRank():start()
		app:getRoleRank():start()
		app:getAlliMgr():start()
		Service:getOpenSvrAct():start()
		Service:getQuestionAct():start()
	end;
}

