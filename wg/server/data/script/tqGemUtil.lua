--*******************************************************************************
--  
--*******************************************************************************
GemUtil = Class:extends({
	init = function(self)
	end;
	
	isGem = function(self, resid)
		return (resid >= FIXID.FIRSTGEM) and (resid <= FIXID.LASTGEM)
	end;
	
	isMaxGemLevel = function(self, resid)
		local res = ItemResUtil:findItemres(resid)
		return res.gemLevel >= res_max_gem_level
	end;
	
	getEffectId = function(self, resid)
		local res = ItemResUtil:findItemres(resid)
		return res.effects[1].id
	end;
	
	isValidCombineLevel = function(self, combineLevel)
		return self:getCombineLevel(combineLevel) ~= nil
	end;
	
	getCombineNeedNumber = function(self, combineLevel)
		return self:getCombineLevel(combineLevel).needNumber
	end;
	
	getCombineSuccPro = function(self, combineLevel)
		return self:getCombineLevel(combineLevel).per
	end;
	
	getCombineLevel = function(self, combineLevel)
		return res_gem_combinelevels[combineLevel]
	end;
	
	getNextLevelResId = function(self, gemResid)
		return gemResid + 1
	end;
	
	getAttr = function(self, resid)
		if not self:isGem(resid) then
			return {attr=0,val=0,unit=0}
		end
		
		local res = ItemResUtil:findItemres(resid)
		local effect = res.effects[1]
		return {attr=ARM_EFF_MAP_ATTR[effect.id], val=effect.val, unit=effect.unit}
	end;
	
	hasAttr = function(self, arm, attrId )
		for i=1, arm:getGemsCount(), 1 do
			local attr = self:getAttr( arm:getGemByIdx(i-1) )
			if attr.attr == attrId then
				return true
			end
		end
		
		return false
	end;
}):new()


