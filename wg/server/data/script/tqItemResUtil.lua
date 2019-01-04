--*******************************************************************************
--  
--*******************************************************************************
ItemResUtil = Class:extends({
	findItemres = function(self, resid)
		if resid == 0 then return nil end
		local res = Util:qfind(res_test_items, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_builds, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_farms, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_ex, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_heroskills, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_soldiers, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_items_cultures, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_lineup, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_mailtemps, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_citydefs, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_copyfields, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_drops, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_fields, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_fieldheros, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_tasks, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_activityval_tasks, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_online_tasks, 'id', resid)
		if res ~= nil then return res end
		res = Util:qfind(res_newhelp_tasks, 'id', resid)
		if res ~= nil then return res end
		
		return nil
	end;
	
	findBuildLevelres = function(self, resid, level)
		return Util:qfind(res_inbuild, 'id', resid*1000 + level)
	end;
	
	findEffectres = function(self, resid, effectid)
		local itemres = self:findItemres(resid)
		if (itemres == nil) then return nil end
		return Util:qfind(itemres.effects, 'id', effectid);
	end;
	
	findCultureLevelres = function(self, resid, level)
		return Util:qfind(res_cultures_upd, 'id', resid*1000 + level)
	end;
	
	findFieldLevelRes = function(self, resid, level)
		return Util:qfind(res_fields_level, 'id', resid*1000 + level)
	end;
	
	splitResidLevel = function(self, id)
		local resid = math.floor(id/1000)
		local level = math.mod(id, 1000)
		return resid, level
	end;
	
	makeSoldierId = function(self, baseId, level)
		return baseId*1000 + level
	end;
}):new()

