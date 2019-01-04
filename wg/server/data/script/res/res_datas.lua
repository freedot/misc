--当民房为0时，容纳的人口上限
res_initmaxpopu = 1800
---主角初始数据
res_role_initdata = {
	level=1,
	prestige=100,
	attrs = {
		{attr=ATTR.HEALTH, val=100},
		{attr=ATTR.MHEALTH, val=100},
		{attr=ATTR.XP, val=0},
		{attr=ATTR.NXP, val=500},
		{attr=ATTR.PS, val=50},
		{attr=ATTR.MPS, val=50},
		{attr=ATTR.STP, val=100},
		{attr=ATTR.MSTP, val=100},
		{attr=ATTR.AF, val=0},
		{attr=ATTR.MAF, val=0},
		{attr=ATTR.FOR_B, val=0},
		{attr=ATTR.FOR_A, val=0},
		{attr=ATTR.BR_B, val=0},
		{attr=ATTR.BR_A, val=0},
		{attr=ATTR.IN_B, val=0},
		{attr=ATTR.IN_A, val=0},
		{attr=ATTR.PP, val=0},
		{attr=ATTR.XPS, val=100},
		{attr=ATTR.MXPS, val=0},
		{attr=ATTR.NAF, val=0},
		{attr=ATTR.MNAF, val=0},
		{attr=ATTR.NAFO, val=0},
	},
	cityres = {
		taxrate = 1,
		money = 500,
		food = 5000,
		wood = 500,
		stone = 500,
		iron = 500,
		maxres = 1000, --容量上限
		idlepopu = 0,
		citylevel = 1,
		idlepopu = 200,
	},
	farm = {
		{
			id = 1,
			resid = FIXID.FARM,
			level = 1,
			state = FARM_STATE.COMPLETE,
		},
		{
			id = 2,
			resid = FIXID.TIMBERYARD,
			level = 1,
			state = FARM_STATE.COMPLETE,
		},
		{
			id = 3,
			resid = FIXID.QUARRY,
			level = 1,
			state = FARM_STATE.COMPLETE,
		},
		{
			id = 4,
			resid = FIXID.IRONORE,
			level = 1,
			state = FARM_STATE.COMPLETE,
		},
	},
	inbuild = {
		{
			id = 1,
			resid = FIXID.GOV_BUILD,
			level = 1,
			state = BUILD_STATE.COMM,
		},
		{
			id = 2,
			resid = FIXID.WALLBUILD,
			level = 1,
			state = BUILD_STATE.COMM,
		},
	},
	resbuild = {
		{
			id = 1,
			resid = FIXID.SITUSHU,
			level = 1,
			state = BUILD_STATE.COMM,
		},
	},
	militarybuild = {
		{
			id = 1,
			resid = FIXID.SIMASHU,
			level = 1,
			state = BUILD_STATE.COMM,
		},
	},
	pkg = {
		maxgridcnt = 250, -- max 450
		gold = 0,
		giftgold= 0,
		items = {{resid=FIXID.SMALLSPEAKER, number=500},},
	}
}
--可以出生的城市
res_city_range = {first = 9900001, last = 9900003}
--武将的最大等级
res_max_hero_level = 150
--武将的基础最大等级（在静脉修炼前的）
res_base_max_hero_level = 60
--经脉的最大等级
res_max_skeleton_level = 8
--武将每级增加的俸禄数量
res_hero_base_salary = 20
--武将最大愤怒值
res_hero_max_angry = 150
--在线时可超出最大资源的比例
res_maxres_beyond = 100

--武将修炼的类型
res_steelneeds = {
	{money=200, gold=0, maxhours=10, expout=2000, maxlevel=4}
	,{money=0, gold=2, maxhours=24, expout=3000, maxlevel=28}
	,{money=100, gold=0, maxhours=10, expout=4000, maxlevel=28}
	,{money=0, gold=1, maxhours=24, expout=5000, maxlevel=28}
	,{money=300, gold=0, maxhours=10, expout=6000, maxlevel=28}
	,{money=0, gold=3, maxhours=24, expout=7000, maxlevel=28}
}
--每一个金币兑换的经验
gold_exchange_exp_num = 1000
--金币兑换经验的成功率
gold_exchange_exp_rate = 90
--没升一级增加的潜力点
res_level_add_ppoint = 2
--新手保护期天数
res_young_days = 7
--新手保护城池等级
res_young_citylevel = 4
--转州的cd时间（单位小时）
res_changecity_cd = 24
--转州需要消耗的声望的比率
res_ccity_prestige_per = 0.5
--转州时需要的金币
res_ccity_need_gold = 100
--分城中可建的建筑个数
res_subcity_inbuildnum = 13
--npc中可建的建筑个数
res_npccity_inbuildnum = 20
--主城中可建的建筑个数列表（不同的城池等级阶段对应不同的个数）
res_maincity_inbuildnums = {LV0=9,LV1=9,LV2=16,LV3=23,LV4=30,LV5=30,LV6=30,LV7=30,LV8=30,LV9=30,
	LV10=30,LV11=30,LV12=30,LV13=30,LV14=30,LV15=30,LV16=30,LV17=30,LV18=30,LV19=30,
	LV20=30,LV21=30,LV22=30,LV23=30,LV24=30,LV25=30,LV26=30,LV27=30,LV28=30,LV29=30,LV30=30}
--仓库为0级时，可存储的粮、木、石、铁的上限
res_commres_basestorenum = 1000
--建筑队列的基础最大个数
res_max_building_cnt = 3
--主城中可以建造的建筑id列表
res_maincity_canbuildids = {110001,110002,110003,110004,110005,110006,110007,110008,110009,110010,110011,110012}
--资源分城中可以建造的建筑id列表
res_subrescity_canbuildids = {110002,110013,110014,110015,110016,110017}
--军事分城中可以建造的建筑id列表
res_subarmycity_canbuildids = {110006,110018,110019,110020,110021,110022}
--建筑升级增加建设度公式
res_buildup_addbuildval = function(lv) 
	if lv <= 10 then
		return 10*lv + 90
	elseif lv <= 20 then
		return 20*lv - 10
	elseif lv <= 30 then
		return 30*lv - 210
	elseif lv <= 40 then
		return 40*lv - 510
	else
		return 50*lv - 910
	end
end
--建筑升级增加君主经验公式
res_buildup_addexp = function(lv) 
	return res_buildup_addbuildval(lv) / 10
end
--城池的最高等级
res_max_city_level = 16;
--拆除建筑时返还的资源比率
res_down_retres_per = 0.33
--新创建玩家的受损建筑度比例
res_newrole_hurtbuidval_per = 0
--君主每升一级奖励的潜力点数
res_getrole_pps_bylevel = function(level)
	return 2
end
--计算武将经验池的最大值公式
res_calc_attr_MXPS = function(role_level, role_interior)
	return role_level*2000 + role_interior*1000
end
--计算实际的内城建造时间
res_calc_fact_inbuild_time = function(ntime, culturelevel, govlevel, role_interior)
	local ntime = ntime/(1 + culturelevel + (govlevel - 1)/2 + role_interior*0.02)
	return math.max(1, math.floor(ntime))
end
--计算实际的学习国学科技的时间
res_calc_fact_learn_culture_time = function(ntime, collegeLevel, roleBrains, buffadd)
	local ntime = ntime/(1 + collegeLevel/2 + roleBrains/2 + buffadd)
	return math.max(1, math.floor(ntime))
end

--计算最大兵力上限
res_calc_attr_MAF = function(role_level, role_force, addval) --field headquarters levels
	return role_force*100 + role_level*500 + addval
end

--提前征收农场块时，所占的比例
res_getfarmres_pre = 0.7;
--每块农田需要的劳力
res_farmblock_needpopu = 400;
--农田种子各级成熟需要的时间（单位秒）
res_farmpip_needtime = {LV1=30*60, LV2=4*60*60, LV3=10*60*60, LV4=24*60*60};
--每块农田每秒的产出
res_farm_sec_output = 0.66666667;
--每点君主内政加成农田产出的比率
res_farm_roleinterior_addper = 0.01;
--工坊等级加成农田产出的比率
res_farm_wsbuild_addper = 0.05;
--联盟等级加成农田产出的比率
res_farm_alli_addper = 0.05;
--国学科技加成农田产出的比率
res_farm_culture_addper = 0.2;
--计算农场的产出
res_calc_farm_totalres = function(baseout, culturelevel, wslevel, role_interior, allilevel, buffAdd, vipAdd)
	return baseout*(1 + culturelevel*res_farm_culture_addper + wslevel*res_farm_wsbuild_addper + role_interior*res_farm_roleinterior_addper + allilevel*res_farm_alli_addper + buffAdd + vipAdd)
end

--空闲人口每秒的产出（和人口上限相乘）
res_idlepopu_output=0.001
--刷新role的属性的时间间隔（秒）
res_refresh_roleattr_interval = 60*15;

--不同职业对应的主、副、次属性，以及自动分配的潜力点的比重
res_hero_main_sec_last_attrs = {
	prof1 = { attrs={ATTR.ST_B,ATTR.PH_B,ATTR.AG_B}, autoassign={1,1,1} }
	,prof2 = { attrs={ATTR.PH_B,ATTR.AG_B,ATTR.ST_B}, autoassign={3,2,1} }
	,prof3 = { attrs={ATTR.AG_B,ATTR.PH_B,ATTR.ST_B}, autoassign={3,2,1} }
	,prof4 = { attrs={ATTR.AG_B,ATTR.ST_B,ATTR.PH_B}, autoassign={3,2,1} }
	,prof5 = { attrs={ATTR.ST_B,ATTR.AG_B,ATTR.PH_B}, autoassign={3,2,1} }
	,prof6 = { attrs={ATTR.ST_B,ATTR.PH_B,ATTR.AG_B}, autoassign={3,2,1} }
};
--武将的最小资质
res_heronature_min_attrval = 90
--武将的不同职业不同属性的最大资质
res_heronature_max_attrs = {}
	res_heronature_max_attrs[HERO_PROF.YONGSHI] = {}
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NST] = 145
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NPH] = 145   
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NAG] = 145
		
	res_heronature_max_attrs[HERO_PROF.DAOJIANG] = {}
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NST] = 135
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NPH] = 150
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NAG] = 145
		
	res_heronature_max_attrs[HERO_PROF.JIJIANG] = {}
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NST] = 135
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NPH] = 145
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NAG] = 150
		
	res_heronature_max_attrs[HERO_PROF.GONGJIANG] = {}
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NST] = 145
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NPH] = 135
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NAG] = 150
		
	res_heronature_max_attrs[HERO_PROF.QIJIANG] = {}
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NST] = 150
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NPH] = 135
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NAG] = 145
		
	res_heronature_max_attrs[HERO_PROF.QIXIE] = {}
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NST] = 150
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NPH] = 145
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NAG] = 135
--获取武将资质
res_getheronature_attr = function(attr, prof)
	return math.random(res_heronature_min_attrval, res_heronature_max_attrs[prof][attr])
end;

--刷新武将的初始值
res_init_newheros = {
	prof1 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
	,prof2 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
	,prof3 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
	,prof4 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
	,prof5 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
	,prof6 = {
		{attr=ATTR.ST_B, val=2, unit=0}
		,{attr=ATTR.ST_A, val=0, unit=0}
		,{attr=ATTR.AG_B, val=2, unit=0}
		,{attr=ATTR.AG_A, val=0, unit=0}
		,{attr=ATTR.PH_B, val=2, unit=0}
		,{attr=ATTR.PH_A, val=0, unit=0}
	}
}
--可携带武将上限的计算公式（通过君主等级）
res_gethero_maxcnt = function(rolelevel)
	if rolelevel < 10 then return 2
	elseif rolelevel < 20 then return 3
	elseif rolelevel == 20 then return 4
	else return 4 + math.floor( (rolelevel - 20) / 5 )
	end
end;

--武将不同职业初始的兵科
res_hero_init_subjects = {
	[HERO_PROF.YONGSHI] = {2,2,2,2,2}, -- 勇士
	[HERO_PROF.DAOJIANG] = {3,1,1,2,1}, -- 刀将
	[HERO_PROF.JIJIANG] = {2,3,1,1,1}, -- 戟将
	[HERO_PROF.GONGJIANG] = {1,1,3,1,2}, -- 弓将
	[HERO_PROF.QIJIANG] = {1,2,1,3,1}, -- 骑将
	[HERO_PROF.QIXIE] = {1,1,2,1,3}, -- 器将
};

--不同职业个属性的权重值
res_hero_base_attr_factor = {
	[0] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0 },
	[HERO_PROF.YONGSHI] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0 },
	[HERO_PROF.DAOJIANG] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0},
	[HERO_PROF.JIJIANG] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0},
	[HERO_PROF.GONGJIANG] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0},
	[HERO_PROF.QIJIANG] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0},
	[HERO_PROF.QIXIE] = {[HERO_BASE_ATTR.STR]=1.0, [HERO_BASE_ATTR.AGILE]=1.0, [HERO_BASE_ATTR.PHY]=1.0},
}

--获得武将对应等级的潜力点
res_get_hero_ppoint = function(level)
	if level <= 1 then return {sys=0, free=0}
	elseif level <= 20 then return {sys=3, free=3}
	elseif level <= 40 then return {sys=3, free=5}
	elseif level <= 60 then return {sys=6, free=7}
	elseif level <= 80 then return {sys=6, free=9}
	elseif level <= 100 then return {sys=9, free=12}
	elseif level <= 120 then return {sys=12, free=15}
	elseif level <= 140 then return {sys=15, free=18}
	else return {sys=18, free=21}
	end
end;
--武将的基础速度(公里/小时)
res_hero_base_move_speed = 40
--根据武将等级计算统率兵力上限
res_gethero_command_maxval = function(level)  
	return level*10 + math.floor(level/10)*30 
end

--基本的资质
res_base_nature = 100
res_hero_mapattr_factors = {
	hurt = 2,
	def = 2,
	hit = 1,
	esc = 1,
	batkper = 1,
	maxphy = 1,
}

--计算武将的攻击伤害属性
res_calchero_hurt_attr = function(heroProf, strength, appendStr, nature_strength, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.STR]
	return strength*res_hero_mapattr_factors.hurt*(nature_strength / res_base_nature + factor + innerForce/510 - 1) + appendStr*res_hero_mapattr_factors.hurt
end
--计算武将的防御属性
res_calchero_def_attr = function(heroProf, phy, appendPhy, nature_phy, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.PHY]
	return phy*res_hero_mapattr_factors.def *(nature_phy / res_base_nature + factor + innerForce/510 - 1) + appendPhy*res_hero_mapattr_factors.def
end
--计算武将的命中属性
res_calchero_hit_attr = function(heroProf, agile, appendAgile, nature_agile, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.AGILE]
	return  agile*res_hero_mapattr_factors.hit*(nature_agile / res_base_nature + factor + innerForce/510 - 1) + appendAgile*res_hero_mapattr_factors.hit
end
--计算武将的闪避属性
res_calchero_esc_attr = function(heroProf, agile, appendAgile, nature_agile, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.AGILE]
	return agile*res_hero_mapattr_factors.esc*(nature_agile / res_base_nature + factor + innerForce/510 - 1) + appendAgile*res_hero_mapattr_factors.esc
end
--计算武将的会心属性
res_calchero_batkper_attr = function(heroProf, agile, appendAgile, nature_agile, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.AGILE]
	return agile*res_hero_mapattr_factors.batkper*(nature_agile/res_base_nature + factor + innerForce/510 - 1) + appendAgile*res_hero_mapattr_factors.batkper
end
--计算武将的最大体力属性
res_calchero_maxphy_attr = function(heroProf, phy, appendPhy, nature_phy, innerForce)
	local factor = res_hero_base_attr_factor[heroProf][HERO_BASE_ATTR.PHY]
	return phy*res_hero_mapattr_factors.maxphy*(nature_phy / res_base_nature + factor + innerForce/510 - 1) + appendPhy*res_hero_mapattr_factors.maxphy
end

--计算士兵的攻击伤害属性
res_calcsoldier_hurt_attr = function(strength)
	return res_calchero_hurt_attr(0, strength, 0, res_base_nature, 0)
end
--计算士兵的防御属性
res_calcsoldier_def_attr = function(phy)
	return res_calchero_def_attr(0, phy, 0, res_base_nature, 0)
end
--计算士兵的命中属性
res_calcsoldier_hit_attr = function(agile)
	return res_calchero_hit_attr(0, agile, 0, res_base_nature, 0)
end
--计算士兵的闪避属性
res_calcsoldier_esc_attr = function(agile)
	return res_calchero_esc_attr(0, agile, 0, res_base_nature, 0)
end
--计算士兵的会心属性
res_calcsoldier_batkper_attr = function(agile)
	return res_calchero_batkper_attr(0, agile, 0, res_base_nature, 0)
end
--计算士兵的最大体力属性
res_calcsoldier_maxphy_attr = function(phy)
	return res_calchero_maxphy_attr(0, phy, 0, res_base_nature, 0)
end

--获得武将的总属性值
res_gethero_totalattrs_val = function(hurt, def, hit, esc, batkper, maxphy)
	local factors = res_hero_mapattr_factors
	return hurt/factors.hurt + (def + maxphy)/(factors.def + factors.maxphy) + (hit + esc + batkper)/(factors.hit + factors.esc + factors.batkper)
end

--获得武将的单挑力
res_gethero_single_fight_capacity = function(totalAttr)
	return ((totalAttr*300)^0.6)/10
end

--获得武将的战力
res_gethero_fight_capacity = function(armyTotalAttr,  soldierLevel, adaptableFactor, soldierNumber)
	return  (armyTotalAttr + 50*soldierLevel)*adaptableFactor*(soldierNumber^0.3448275862)/40
end

		
--武将解锁需要的时长
res_unlock_hero_time = 3 * 24 * 3600
--武将改名需要消耗的金币
res_hero_changename_need_gold = 10
--武将健康度的恢复速度(x/小时)
res_hero_mealth_upspeed = 2
--武将士气的掉落速度(x/小时)
res_hero_morale_downspeed = 2
--武将士气的恢复速度(x/小时)
res_hero_morale_upspeed = 2
--通过武将等级计算需要的洗点道具个数
res_getneed_hero_clearppitems = function(level)
	return 1 + math.floor((level - 1)/ 10);
end;
--通过经脉等级获得加强一次需要的道具数量
res_get_str_if_need_itemnum = function(skeletonLevel)
	local res = Util:qfind(res_herojingmai, 'id', skeletonLevel+1);
	if res ~= nil then
		return res.needchilindan
	end
	
	local maxRes = res_herojingmai[table.getn(res_herojingmai)]
	if maxRes.id == skeletonLevel then
		return maxRes.needchilindan
	end
	
	return 0
end;
--每次强化内功获得的概率分布{per=概率,val=获得的数值}
res_str_if_get_vals = {{per=40, val=1},{per=25, val=2},{per=25, val=3},{per=5, val=4},{per=5, val=5}}

--通过武将等级获得可开启的基础技能格子数
res_get_basegridcnt_by_herolevel = function(herolevel)
	if ( herolevel < 60 ) then return 0
	elseif ( herolevel < 80) then return 2
	elseif ( herolevel < 100 ) then return 3
	elseif ( herolevel < 120 ) then return 4
	elseif ( herolevel < 140 ) then return 5
	elseif ( herolevel <= 150 ) then return 6 end
end;
--武将基础技能的最大等级(目前只开10级)
res_hero_baseskill_maxlevel = 10
--武将基础技能的开始id
res_hero_baseskill_id_first = 6001008
--武将基础技能的最后id
res_hero_baseskill_id_last = 6001022
--领悟技能时的最大的技能等级
res_insight_skill_max_level = 5
--学习技能时的最大的技能等级
res_learn_skill_max_level = 5
--武将开启技能需要的最低等级
res_hero_hasskill_minlevel = 60
--修炼武将基础技能一次可以使用的最多小时
res_canuse_sstime_maxnum = 48
--修炼每小时可获得的技能熟练度
res_get_skilldex_per_hour = 5
--获得武将的随机等级
res_get_rand_newhero_level = function(rolelevel, buildlevel)
	local mlevel =  math.min(rolelevel + buildlevel, res_base_max_hero_level-1)
	return math.random(mlevel)
end;
--遣散士兵返回资源的比例
res_demob_soldier_retres_per = 0.3;
--军队出征前的准备时间(秒)
res_army_preparetime = 900;
--挑衅玩家需要的行程时间(秒)
res_tiaoxin_needtime = 5*60;
--国战玩家需要的行程时间(秒)
res_countryfight_needtime = 15*60;
--今天玩家拥有可被掠夺的初始荣誉
res_today_init_has_honor = 25;
--今天玩家可获得的荣誉上线
res_today_max_get_honor = 50;
--等级相差小于xx级才可以获得荣誉值
res_get_honor_differ_level = 10;
--讨伐可获得的荣誉
res_taofa_honor = 3;
--摧毁可获得的荣誉
res_cuihui_honor = 5;
--挑衅可获得的荣誉
res_tiaoxin_honor = 1;

--通过健康值获得健康的类别
res_gethealthtype = function(healthVal)
	if ( healthVal < 30 ) then
		return HEALTH_TYPE.DEEP_WOUND
	elseif ( healthVal < 80 ) then
		return HEALTH_TYPE.FLESH_WOUND
	else
		return HEALTH_TYPE.HEALTH
	end
end;
--健康类别对应的属性缩放因子
res_health_map_attrsfactors = {}
res_health_map_attrsfactors[HEALTH_TYPE.HEALTH] = 1.0
res_health_map_attrsfactors[HEALTH_TYPE.FLESH_WOUND] = 0.8
res_health_map_attrsfactors[HEALTH_TYPE.DEEP_WOUND] = 0.1
--每天可以攻击玩家的次数
res_max_attack_player_times = 10;
--需要精度的武将属性
res_need_precision_attrs = {ATTR.HEALTH, ATTR.MO};
--武将体力转换成血量的乘数因子
res_ps_to_factps = 10
--通过士气，获得技能的触发概率增加值（百分数）
res_addskillpro_bymorale = function(morale)
	if morale < 40 then
		return -1000000
	elseif morale < 80 then
		return -math.floor((80 - morale)/4)
	elseif morale < 100 then
		return 0
	else
		return math.floor((morale - 100)/5)
	end
end;
--计算基础伤害
res_get_attack_base_hurtHP = function(hurtVal, defVal)
	if (hurtVal < 1) then hurtVal = 1 end
	if (defVal < 0) then defVal = 0 end
	return hurtVal*(hurtVal + 50) / (hurtVal + defVal + 50)
end;
--计算暴击伤害
res_get_berserkHurt = function(basehurt)
	return basehurt*1.5
end;
--获得命中率
res_get_hit_pro_val = function(hitVal, esVal)
	if (hitVal < 1) then hitVal = 1 end
	if (esVal < 0) then esVal = 0 end
	return math.sqrt((hitVal + 200)/(hitVal + esVal + 200)) * 100
end;
--获得命中率的附加概率
res_get_hit_appendPro_val = function(attHeroLevel, defHeroLevel)
	return math.max(0, (attHeroLevel - defHeroLevel))*0.2
end;

--通过兵科的适配星级数获得兵科的适配计算因子
res_get_subject_adaptablefactor = function(val)
	return 1 + (val - 2)*0.2
end;
--兵种相克时增加的伤害系数
res_restriction_addhurtfactor = 0.2
--单位城防的攻击
res_citydefs_hurt_bytype={}
res_citydefs_hurt_bytype[CITYDEF_TYPE.XIANJING] = 5000
res_citydefs_hurt_bytype[CITYDEF_TYPE.GUNMU] = 5000
res_citydefs_hurt_bytype[CITYDEF_TYPE.JUMA] = 5000
res_citydefs_hurt_bytype[CITYDEF_TYPE.LEISHI] = 6000
res_citydefs_hurt_bytype[CITYDEF_TYPE.NUJIAN] = 5000
--城防中每次消耗数量的比例
res_citydef_each_need_num_per= 0.05
--获得士兵和武将的最终属性和
res_get_soldier_attr_val = function(heroattr, soldierattr, factor)
	return (heroattr/3 + soldierattr)*factor
end
--获得士兵和武将会心的最终属性和
res_get_soldier_ber_attr_val = function(heroattr, soldierattr, adaptableFactor)
	return (heroattr/2 + soldierattr)*adaptableFactor
end
--武将获得掉落和目标等级的差距(目前设为超大值，不限制，即都可以获得)
hero_cangetdrop_leveldrt = 1000
--出征完敌方返回后消耗的武将健康值
res_expedreturn_sub_health = 2
--进攻者出征成功后武将消耗的健康度
res_exped_low_expend_health = 0 
--进攻者出征失败后武将消耗的健康度
res_exped_high_expend_health = 8
--进攻者出征成功后武将得到的士气值
res_exped_attacker_succ_addmo = 1
--进攻者出征失败后武将损失的士气值
res_exped_attacker_fail_submo = -2
--防御者防御成功后武将得到的士气值
res_exped_defender_succ_addmo = 1
--防御者防御失败后武将得到的士气值
res_exped_defender_fail_submo = -1

--新手保护期战斗中损失士兵的恢复率
young_revive_soldier_pre=1.0
--被攻击方战斗中损失士兵的恢复率
defender_revive_soldier_pre=0.2

--野地个数和官府等级的关系
res_selffield_maxcount=function(govLevel)
	return math.floor(govLevel/5) + 1
end;
--野地的最高等级
res_max_field_level = 10
--单次可以采集的最长时间，单位秒
res_max_collect_time = 10*3600
--单挑有宿主野地时，获得对方正在采集中资源的几率(百分比)
res_dantiao_ownerfield_getres_pro = 30
--攻击有宿主野地时，获得对方正在采集中资源的比例(百分比)
res_fight_ownerfield_getres_ratio = 20
--刷新野地等级每天的时间
res_refresh_fieldlevel_dayhour = 6 -- 早晨6点
--邮件过期时间长度(单位秒)
res_mail_timeout_s = 30*24*3600


--分解装备获得的精华个数圆桌概率
res_splitarm_get_essence_num = {{per=85, num=1},{per=10, num=2},{per=5, num=3}}
--分解装备获得的神石个数圆桌概率
res_splitarm_get_stone_num = {{per=85, num=1},{per=10, num=2},{per=5, num=3}}
--最高的强化等级
res_max_forcelevel = 10
--宝石的最高等级
res_max_gem_level = 7
--宝石合成不同级别对应的概率和消耗
res_gem_combinelevels = {
	{level=1, per=25, needNumber=2}
	,{level=2, per=50, needNumber=3}
	,{level=3, per=75, needNumber=4}
	,{level=4, per=100, needNumber=5}
	}
--发送全服祝福容许的最长字符个数
res_max_bless_string_len = 80
--刷新每个空闲的野地空地地块
res_refresh_outfields = {{per=10, val=170001},{per=10, val=170002},{per=10, val=170003},{per=10, val=170004},{per=10, val=170005},{per=50, val=170006}}
--宣战开始后的时间间隔
res_declare_fight_interval = 3600
--战争状态开始后的时间间隔
res_fightting_interval =  24*3600
-- 开启各级分城需要的城池等级
res_create_subcity_needcitylevels = {}
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB1] = 4
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB2] = 6
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB3] = 8
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB4] = 11
-- 容许加速修炼的武将最高等级
res_hero_lowsteel_level = 80
-- 普通武将修炼单次最大小时数
res_comm_herosteel_max_hours = 10
-- 高级武将修炼单次最大小时数
res_high_herosteel_max_hours = 24
-- 清空世界消息的时间间隔
res_world_msg_clear_interval = 40
-- 替换世界消息的时间间隔
res_world_msg_replace_interval = 15
-- 创建联盟需要消耗的钱币
res_create_alli_need_money = 30000
-- 创建联盟需要的角色最低等级
res_create_alli_need_rolelevel = 10
-- 一个联盟允许的最大申请加入个数
res_alli_applylist_maxcount = 20
-- 一个联盟允许的最大申请合并个数
res_alli_applymerges_maxcount = 20
-- 联盟的最高等级
res_alli_max_level = 10
-- 联盟圣兽的最高等级
res_alli_lawlight_maxlevel = 5
-- 联盟事件过期天数
res_alli_events_expired_days = 3
-- 跑商需要的最小市场等级
res_trading_need_build_minlevel = 5
-- 改变日常任务需要的金币
res_change_everyday_task_need_gold = 10
-- 完成日常任务需要的金币
res_complete_everyday_task_need_gold = 20
--点将台的最大关卡id
res_act_terrace_max_gate_id = 9
--点将台的最大子关卡id
res_act_terrace_max_subgate_id = 7
--千层塔最大层数
res_act_tower_max_layer = 100
--每日可跑商的基本次数
res_base_tradingarea_times = 3
--每月可签到的最大天数
res_max_signin_days = 28
--每天可闯塔的基础次数
res_act_tower_enter_times = 2
--每天可闯塔的使用道具进入次数
res_act_tower_enter_times_useitem = 1
--每天可点将的基础次数
res_act_terrace_enter_times = 2
--每天可点将的使用道具进入次数
res_act_terrace_enter_times_useitem = 1
--最大可宣战个数
res_max_declare_count = 100
-- 进入点将台需要的君主等级
res_enter_terrace_need_rolelevel = 12
-- 进入千层塔需要的君主等级
res_enter_tower_need_rolelevel = 10
-- 首次刷武将的最低等级
res_first_hero_minLevel = 2
-- 日常任务基础个数
res_everyday_task_base_cnt = 7
-- 基础的好友个数
res_friend_base_cnt = 100
-- 基础的敌人个数
res_enemy_base_cnt = 100


