--*******************************************************************************
PlayerClientCfg = Class:extends({
	init = function(self, player)
		self.clientCfg = player:getPersistVar().stMiscs.clientCfg
		self.forces = MapCppSet(self.clientCfg, 'forceCount', 'forces', 'type', MAX_FORCELINEUPCFG_CNT)
		self.helpTips = MapCppSet(self.clientCfg, 'helpTipCount', 'helpTips', 'id', MAX_HELPTIP_CNT)
	end;
	
	getForces = function(self)
		return self.forces
	end;
	
	addForces = function(self, force)
		self.forces:get(force.type)
	end;
	
	getForceLineupCount = function(self)
		return self.clientCfg.forceCount
	end;
	
	addForceLineup = function(self, ttype, lineup, heros)
		local node = nil
		for i=0, self.clientCfg.forceCount-1, 1 do
			local curnode = self.clientCfg.forces[i]
			if curnode.type == ttype then
				node = curnode
				break
			end
		end
		
		if (node == nil) and (self.clientCfg.forceCount >= MAX_FORCELINEUPCFG_CNT) then
			return false
		end
		
		if node == nil then
			node = self.clientCfg.forces[self.clientCfg.forceCount]
			self.clientCfg.forceCount = self.clientCfg.forceCount + 1
		end
		
		node.type = ttype
		node.lineup = lineup
		node.heroCount = #heros
		for i=0, node.heroCount-1, 1 do
			node.heroIds[i] = heros[i+1]
		end
		
		return true
	end;
	
	getForceLineup = function(self, idx) -- idx from 0 to n-1
		return self.clientCfg.forces[idx]
	end;
	
	getToggleMapCount = function(self)
		return MAX_CTLCFG_BTIMAP_CNT
	end;
	
	getToggleMapFlag = function(self, idx)
		return self.clientCfg.toggleMap[idx]
	end;
	
	setToggleMapFlag = function(self, idx, flag)
		self.clientCfg.toggleMap[idx] = flag
	end;
	
	getGongGaoVer = function(self)
		return self.clientCfg.gonggaoVer
	end;
	
	setGongGaoVer = function(self, ver)
		self.clientCfg.gonggaoVer = ver
	end;
	
	getHelpTips = function(self)
		return self.helpTips
	end;
})


