--
res_test_items = {}

local res_init_skill_effect_pri = function()
	for _, skillRes in ipairs(res_items_heroskills) do
		if skillRes.effects ~= nil then
			for _, effect in ipairs(skillRes.effects) do
				effect.pri = 0
				if effect.id ~= 0 then
					local effPriRes = Util:find(res_fighteffect_pri, 'effectid', effect.id)
					effect.pri = 10000 - effPriRes.id
				end
			end
		end
	end
end
res_init_skill_effect_pri()


--
local res_comm_init_state_relations = function(relations_raw, relations_out)
	local colsType = {}
	for _, relRow in ipairs(relations_raw) do
		relations_out[relRow.effecttype] = {}
		table.insert(colsType, relRow.effecttype)
	end
	for _, relRow in ipairs(relations_raw) do
		for i, relType in ipairs(colsType) do
			relations_out[relRow.effecttype][relType] = relRow.rels[i]
		end
	end
end
--
res_comm_get_state_relations =  function(relations, rowEffectId, colEffectId)
	local row = relations[rowEffectId]
	if row == nil then 
		return 0 
	end
	
	local rel = row[colEffectId]
	if rel == nil then
		return 0 
	end
	return rel
end

--
res_state_relations = {}
res_comm_init_state_relations(res_state_relations_raw, res_state_relations);
--
res_get_state_relations =  function(rowEffectId, colEffectId)
	return res_comm_get_state_relations(res_state_relations, rowEffectId, colEffectId)
end

--
res_fighteffect_rels = {}
res_comm_init_state_relations(res_fighteffect_rel, res_fighteffect_rels);
--
res_get_fighteffect_rel =  function(rowEffectId, colEffectId)
	return res_comm_get_state_relations(res_fighteffect_rels, rowEffectId, colEffectId)
end

--
res_soldier_restrictions = {}
local res_init_soldier_restriction = function()
	for _, restrictRow in ipairs(res_soldier_restriction) do
		res_soldier_restrictions[restrictRow.id] = {}
		for id=FIXID.FIRSTSOLDIER, FIXID.LASTSOLDIER, 1 do
			res_soldier_restrictions[restrictRow.id][id] = false
		end
		for _, restrictId in ipairs(restrictRow.restrictionids) do
			res_soldier_restrictions[restrictRow.id][restrictId] = true
		end
	end
end
res_init_soldier_restriction()
res_get_soldier_restriction = function(attackerId, defenderId)
	local row = res_soldier_restrictions[attackerId]
	if row == nil then return false, 0 end
	local restrict = row[defenderId]
	if restrict == nil then return false, 0 end
	
	local addFactor = 0
	if attackerId >= FIXID.FIRSTSOLDIER then
		addFactor = res_restriction_addhurtfactor
	end
	return restrict, addFactor
end

--
split_res_smithy_salelist = function()
	for _, res in ipairs(res_smithy_salelist) do
		res.itemIds = {}
		local itemIds = string.split(res.sitemIds, ',')
		for _, id in ipairs(itemIds) do
			if tonumber(id) > 0 then
				res.itemIds[ tonumber(id) ] = true
			end
		end
	end
end
split_res_smithy_salelist()

--add bindid, nobindid, isbind in res_items_ex
add_bindinfo_in_res_items_ex = function()
	for i, item in ipairs(res_items_ex) do
		if item.isbind == nil then
			item.isbind = 0
		end
		
		if item.bindid == nil then
			item.bindid = 0
		end
		
		if item.nobindid == nil then
			item.nobindid = 0
		end
		
		if item.nobindid > 0 then
			local nobindItem = Util:qfind(res_items_ex, 'id', item.nobindid)
			if nobindItem == nil then
				error ( ' add_bindinfo_in_res_items_ex : ' .. item.nobindid )
			end
			nobindItem.bindid = item.id
		end
	end
end
-- add unique in res_items_ex
add_unique_in_res_items_ex = function()
	for i, item in ipairs(res_items_ex) do
		if item.pile == 1 then
			item.unique = 1
		else
			item.unique = 0
		end
	end
end
add_bindinfo_in_res_items_ex()
add_unique_in_res_items_ex()

--add addpopu field in res_inbuild
add_addpopu_in_res_inbuild = function()
	local lastPopu = 0
	for _, b in ipairs(res_inbuild) do
		if b.popu ~= nil and b.popu > 0 then
			b.addpopu = b.popu - lastPopu;
			lastPopu = b.popu;
		end
	end
end
add_addpopu_in_res_inbuild()

--
check_drops_exp_and_credit_mutex = function()
	for _, drop in ipairs(res_drops) do
		if ( drop.heroexp ~= null and drop.credit ~= null ) then
			if ( drop.heroexp.pro > 0 
				and drop.heroexp.maxnum > 0
				and drop.credit.pro > 0 
				and drop.credit.maxnum > 0 ) then
				assert ( false, 'heroexp and credit collision in res_drops [id]:'..drop.id)
			end
		end
	end
end
check_drops_exp_and_credit_mutex()

--recalc round table rand in res_drops
recalc_drops_round_table_rand = function()
	local specials = {'roleexp', 'credit', 'heroexp', 'roleps', 'money', 'iforce', 'fourres', 'idlepopu', 'giftgold',  'gold', 'allicontribute', 'prestige', 'statehonour', 'daobing1', 'xinbing'}
	for _, drop in ipairs(res_drops) do
		local roundPro = 0
		for _, item in ipairs(drop.items) do
			item.randtype = 0
			if drop.randtype == RAND_TYPE.ROUNDRAND then
				if item.pro > 0 and item.id > 0 and item.maxnum > 0 then
					item.randtype = RAND_TYPE.ROUNDRAND
					item.minpro = roundPro + 1
					item.maxpro = item.minpro + item.pro - 1
					roundPro = item.maxpro
				end
			end
		end
		
		for _, s in ipairs(specials) do
			item = drop[s]
			if item ~=nil and item.randtype == RAND_TYPE.ROUNDRAND then
				if item.pro > 0 and item.maxnum > 0 then
					item.minpro = roundPro + 1
					item.maxpro = item.minpro + item.pro - 1
					roundPro = item.maxpro
				end
			end
		end
		
		assert ( roundPro == 100 or roundPro == 0 , 'round rand error in res_drops [id]:'..drop.id .. ', total roundpro:' .. roundPro )
	end
end
recalc_drops_round_table_rand()


res_role_iconids = {{},{}} -- man, 
add_res_role_iconids = function()
	for _, item in ipairs(res_role_icons) do
		table.insert(res_role_iconids[1], item.icon[1])
		table.insert(res_role_iconids[2], item.icon[2])
	end
end
add_res_role_iconids()
table.sort(res_role_iconids[1])
table.sort(res_role_iconids[2])


init_res_copyfields_fields = function()
	for _, copyfield in ipairs(res_copyfields) do
		if copyfield.name == nil and copyfield.gateName ~= nil then
			copyfield.name = copyfield.gateName
		end
		
		if copyfield.citydefid == nil then
			copyfield.citydefid = 0
		end
	end
end
init_res_copyfields_fields()


res_everyday_tasks = {}
res_growup_tasks = {}
res_active_tasks = {}
res_task_alli_mems = {}  -- mems is key, 
init_res_some_tasks = function()
	for _, task in ipairs(res_tasks) do
		if task.type == TASK_TYPE.EVERYDAY then
			table.insert(res_everyday_tasks, task)
		elseif task.type == TASK_TYPE.GROWUP 
			or task.type == TASK_TYPE.SUBGROWUP then
			table.insert(res_growup_tasks, task)
		elseif task.type == TASK_TYPE.ACTIVE then
			table.insert(res_active_tasks, task)
		end
	end
	
	for _, task in ipairs(res_tasks) do
		if task.docond ~= nil and task.docond.type == TASK_FINISH_TYPE.ALLI_MEM_NUM then
			res_task_alli_mems[task.docond.val1] = true
		end
	end
end
init_res_some_tasks()

res_shops_class = {}  -- { {id=1, name='tag1', list={{id:10001},}}, }
init_res_shops_class = function()
	for _, s in ipairs(res_shops) do
		local shopClass = Util:find(res_shops_class, 'id', s.type)
		if shopClass == nil then
			table.insert(res_shops_class, {id=s.type, name=Util:find(res_shops_tagsname, 'id', s.type).name, list={}})
			shopClass = res_shops_class[#res_shops_class]
		end
		table.insert(shopClass.list, {id=s.itemid})
	end
end
init_res_shops_class()


res_dirtywords_ex = {}
init_res_dirtywords_ex = function()
	for _, d in ipairs(res_dirtywords) do
		if res_dirtywords_ex[d.key] == nil then
			res_dirtywords_ex[d.key] = {}
		end
		table.insert(res_dirtywords_ex[d.key], {level=d.level, words=d.words} )
	end
end
init_res_dirtywords_ex()


