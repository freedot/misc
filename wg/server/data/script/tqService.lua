Service = Class:extends({
	init = function(self)
		self._objs = {}
	end;
	
	register = function(self, name, obj)
		self._objs[name] = obj
	end;
	
	getProxyServer = function(self)
		return self._objs['ProxyServer']
	end;
	
	getRankSorterMgr = function(self)
		return self._objs['RankSorterMgr']
	end;
	
	getRankRefreshDB = function(self)
		return self._objs['RankRefreshDB']
	end;
	
	getRoleRankDB = function(self)
		return self._objs['RoleRankDB']
	end;
	
	getAllianceRankDB = function(self)
		return self._objs['AllianceRankDB']
	end;
	
	getCountryRankDB = function(self)
		return self._objs['CountryRankDB']
	end;
	
	getRoleWorldBossRank = function(self)
		return self._objs['RoleWorldBossRank']
	end;
	
	getAllianceWorldBossRank = function(self)
		return self._objs['AllianceWorldBossRank']
	end;
	
	getCountryWorldBossRank = function(self)
		return self._objs['CountryWorldBossRank']
	end;
	
	getAllianceRank = function(self)
		return self._objs['AllianceRank']
	end;
	
	getGmDB = function(self)
		return self._objs['GmDB']
	end;
	
	getSvrVarDB = function(self)
		return self._objs['SvrVarDB']
	end;
	
	getOpenSvrAct = function(self)
		return self._objs['OpenSvrAct']
	end;
	
	getQuestionAct = function(self)
		return self._objs['QuestionAct']
	end;
}):new()


