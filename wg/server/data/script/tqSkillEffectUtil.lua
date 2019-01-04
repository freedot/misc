--*******************************************************************************
--  
--*******************************************************************************
SkillEffectUtil = Class:extends({
	init = function(self)
	end;
	
	getAppendValByHeroSkillEffect = function(self, hero, effectId, baseVal)
		if hero == nil then
			return 0
		end
		
		local val = 0
		local skillCount = hero:getSkillCount()
		for i=0, skillCount-1, 1 do
			local skill = hero:getSkillByIdx(i)
			local skillRes = ItemResUtil:findItemres(skill.ulResId)
			local skillLevel = skill.ucLevel + AddLevelByHeroFiveElemAttr:getAddLevel(hero,  skillRes)
			
			for _, effect in ipairs(skillRes.effects) do
				val = val + self:_calcEffect(effectId, effect, skillLevel, baseVal)
			end
		end
		
		return val
	end;
	
	_calcEffect = function(self, effectId, effect, skillLevel, baseVal)
		if effect.id ~= effectId then
			return 0
		end
		
		local pro = eval(effect.pro, {LV=skillLevel})
		if (math.random(100) > pro) then
			return 0
		end
		
		local effectVal = eval(effect.val, {LV=skillLevel})
		if effect.u == VAL_UNIT.VAL then
			return effectVal
		elseif effect.u == VAL_UNIT.PER then
			return baseVal*effectVal/100
		else
			return 0
		end
	end;
}):new()


