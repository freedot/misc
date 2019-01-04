--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
CppPlayerVar = Class:extends({
	allocVar = function(self, vartag, default)
		local dbvar = SPub:AllocDBVar()
		local rtvar = nil
		if vartag == 'SItem' then
			rtvar = dbvar.stItems.stItems.items[0]
			if default ~= nil then dbvar.stItems.stItems.items[0] = default end
		elseif vartag == 'SItemListEx' then
			rtvar = dbvar.stItems.stItems
		elseif vartag == 'SSkillList' then
			rtvar = dbvar.stHeros.astHeros[0].stSkills
		elseif vartag == 'SSkill' then
			rtvar = dbvar.stHeros.astHeros[0].stSkills.astSkills[0]
			if default ~= nil then dbvar.stHeros.astHeros[0].stSkills.astSkills[0] = default end
		elseif vartag == 'SAttrList' then
			rtvar = dbvar.stHeros.astHeros[0].stAttrs
		elseif vartag == 'SAttr' then
			rtvar = dbvar.stHeros.astHeros[0].stAttrs.astAttrs[0]
			if default ~= nil then dbvar.stHeros.astHeros[0].stAttrs.astAttrs[0] = default end
		elseif vartag == 'SState' then
			rtvar = dbvar.states
		elseif vartag == 'SMilitary' then
			rtvar = dbvar.military
		elseif vartag == 'SNewHero' then
			rtvar =  dbvar.stHeros.astNewHeros[0]
		end
		if rtvar == nil then
			SPub:FreeDBVar(dbvar)
		end
		return {hdr=dbvar,var=rtvar}
	end;
	
	freeVar = function(self, hdr)
		if hdr ~= nil then
			SPub:FreeDBVar(hdr)
		end
	end;
}):new()


