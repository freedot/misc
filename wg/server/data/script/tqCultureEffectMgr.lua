--*******************************************************************************
--*******************************************************************************
CultureEffectMgr = Class:extends({
	init = function(self)
		self:initEffectsMap()
	end;
	
	initEffectsMap = function(self)
		self.effectsMap = {}
		for _, culture in ipairs(res_items_cultures) do
			for _, effect in ipairs(culture.effects) do
				self:insertEffectToMap(culture, effect)
			end
		end		
	end;
	
	insertEffectToMap = function(self, culture, effect)
		if effect.id == 0 then
			return
		end
		
		if self.effectsMap[effect.id] == nil then
			self.effectsMap[effect.id] = {}
		end
			
		table.insert(self.effectsMap[effect.id], {val=effect.val, u=effect.u, cultureId=culture.id})
	end;
	
	getEffectAddVal = function(self, player, baseVal, effectId)
		local addVal = 0
		if player == nil then
			return addVal
		end
		
		local effects = self.effectsMap[effectId]
		if effects == nil then
			return addVal
		end
		
		local cultureMgr = player:getCultures()
		for _, effect in ipairs(effects) do
			local level = cultureMgr:getLevel(effect.cultureId)
			local val = eval(effect.val, {LV=level})
			if effect.u == VAL_UNIT.VAL then
				addVal = addVal + val
			elseif effect.u == VAL_UNIT.PER then
				addVal = addVal + val*baseVal/100
			end
		end
		return addVal
	end;
}):new()


