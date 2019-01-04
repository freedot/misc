--*******************************************************************************
--  Copyright (C) 2011 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
UseTarget = Class:extends({
	parse = function(self, player, cmdtb)
		local params = self:createParams(player, cmdtb)
		if params ~= nil then
			params.netcmd = cmdtb
		end
		return params
	end;
	
	createParams = function(self, player, cmdtb)
		local targettype = Util:getNumber(cmdtb, 'ttype')
		if targettype == RES_TRG.BUILDING_IBUILD then
			return self:getBuildingIBuildParams(player, cmdtb)
		elseif targettype == RES_TRG.SELF_NEWHEROS then
			return self:getSelfNewHerosParams(player, cmdtb)
		elseif targettype == RES_TRG.SELF_HERO then
			return self:getSelfHeroParams(player, cmdtb)
		elseif targettype == RES_TRG.SELF_ROLE then
			return self:getSelfRoleParams(player, cmdtb)
		end
		return nil	
	end;
	
	getBuildingIBuildParams = function(self, player, cmdtb)
		local params = {}
		
		local citys = player:getCitys()
		local cityid = Util:getNumber(cmdtb, 'tcid')
		local city = citys:getCityById(cityid)
		if city == nil then return nil end
		
		local buildid = Util:getNumber(cmdtb, 'tid')
		local build = city:getBuildById(buildid)
		if build == nil then return nil end
		
		params.cityid = cityid
		params.build = build
		return params
	end;
	
	getSelfNewHerosParams = function(self, player, cmdtb)
		return {}
	end;
	
	getSelfHeroParams = function(self, player, cmdtb)
		local params = {}
		
		local heroid = Util:getNumber(cmdtb, 'tid')
		local hero = player:getHeroMgr():getHeroById(heroid)
		if hero == nil then return nil end
		
		params.hero = hero
		return params
	end;
	
	getSelfRoleParams = function(self, player, cmdtb) 
		return {}
	end;
})

