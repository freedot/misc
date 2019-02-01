/* 君主的最大等级 */
res_max_role_level = 100;
/* 英雄的最大等级 */
res_max_hero_level = 150;
/* 在线时可超出最大资源的比例 */
res_maxres_beyond = 100;
/* 主角初始数据 */
res_role_initdata = {
	attrs : [
		{attr:ATTR.HEALTH, val:100},
		{attr:ATTR.MHEALTH, val:100},
		{attr:ATTR.XP, val:0},
		{attr:ATTR.NXP, val:500},
		{attr:ATTR.PS, val:50},
		{attr:ATTR.MPS, val:50},
		{attr:ATTR.STP, val:100},
		{attr:ATTR.MSTP, val:100},
		{attr:ATTR.AF, val:5600},
		{attr:ATTR.MAF, val:10000},
		{attr:ATTR.FOR_B, val:0},
		{attr:ATTR.FOR_A, val:0},
		{attr:ATTR.BR_B, val:0},
		{attr:ATTR.BR_A, val:0},
		{attr:ATTR.IN_B, val:0},
		{attr:ATTR.IN_A, val:0},
		{attr:ATTR.PP, val:20}
	]
};
/* 君主增加一点[武力][内政]分别需要的潜力点数 */
res_role_pp_drts = [1,1];
/* 城池的最高等级 */
res_max_city_level = 16;
/*主城中可建的建筑个数列表（不同的城池等级阶段对应不同的个数）*/
res_maincity_inbuildnums = [{clevel:1, cnt:9},{clevel:2, cnt:16},{clevel:3, cnt:23},{clevel:4, cnt:30}];
//拆除建筑时返还的资源比率
res_down_retres_per = 0.33;
//计算实际的内城建造时间
res_calc_fact_inbuild_time = function(ntime, culturelevel, govlevel, role_interior){
	return ntime/(1 + culturelevel + (govlevel - 1)/2 + role_interior*0.02);
};
//计算实际的学习国学科技的时间
res_calc_fact_learn_culture_time = function(ntime, collegeLevel, roleBrains, addBuff){
	return ntime/(1 + collegeLevel/2 + roleBrains/2 + addBuff);
};


//提前征收农场块时，所占的比例
res_getfarmres_pre = 0.7;
//每块农田需要的劳力
res_farmblock_needpopu = 400;
//农田种子各级成熟需要的时间（单位秒）
res_farmpip_needtime = {LV1:30*60, LV2:4*60*60, LV3:10*60*60, LV4:24*60*60};
//每块农田每秒的产出
res_farm_sec_output = 0.66666667;
//每点君主内政加成农田产出的比率
res_farm_roleinterior_addper = 0.01;
//工坊等级加成农田产出的比率
res_farm_wsbuild_addper = 0.05;
//联盟等级加成农田产出的比率
res_farm_alli_addper = 0.05;
//国学科技加成农田产出的比率
res_farm_culture_addper = 0.2;
//空闲人口每秒的产出（和人口上限相乘）
res_idlepopu_output=0.001;

//可携带英雄上限的计算公式（通过君主等级）
res_gethero_maxcnt = function(rolelevel) {
	if (rolelevel < 10) return 2;
	else if (rolelevel < 20) return 3;
	else if (rolelevel == 20) return 4;
	else return 4 + parseInt( (rolelevel - 20)/5, 10 );
};
//英雄改名需要消耗的金币
res_hero_changename_need_gold = 10;
//刷新英雄的初始值
res_init_newheros = {
	prof1 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
	,prof2 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
	,prof3 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
	,prof4 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
	,prof5 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
	,prof6 : [
		{attr:ATTR.ST_B, val:10}
		,{attr:ATTR.AG_B, val:10}
		,{attr:ATTR.PH_B, val:10}
	]
};
//获得英雄对应等级的潜力点
res_get_hero_ppoint = function(level) {
	if (level <= 1) return {sys:0, free:0};
	else if (level < 20) return {sys:3, free:6};
	else if (level < 40) return {sys:3, free:6};
	else if (level < 60) return {sys:3, free:6};
	else if (level < 80) return {sys:6, free:12};
	else if (level < 100) return {sys:6, free:18};
	else if (level < 120) return {sys:9, free:18};
	else if (level < 140) return {sys:9, free:24};
	else return {sys:12, free:21};
};

//不同职业对应的主、副、次属性，以及自动分配的潜力点的比重
res_hero_main_sec_last_attrs = {
	prof1 : { attrs:[ATTR.ST_B,ATTR.PH_B,ATTR.AG_B], autoassign:[1,1,1] }
	,prof2 : { attrs:[ATTR.PH_B,ATTR.AG_B,ATTR.ST_B], autoassign:[3,2,1] }
	,prof3 : { attrs:[ATTR.AG_B,ATTR.PH_B,ATTR.ST_B], autoassign:[3,2,1] }
	,prof4 : { attrs:[ATTR.AG_B,ATTR.ST_B,ATTR.PH_B], autoassign:[3,2,1] }
	,prof5 : { attrs:[ATTR.ST_B,ATTR.AG_B,ATTR.PH_B], autoassign:[3,2,1] }
	,prof6 : { attrs:[ATTR.ST_B,ATTR.PH_B,ATTR.AG_B], autoassign:[3,2,1] }
};
//英雄面板上可分配属性的序号
res_hero_attr_ui_idx = {};
res_hero_attr_ui_idx[ATTR.ST_B] = 0;
res_hero_attr_ui_idx[ATTR.AG_B] = 1;
res_hero_attr_ui_idx[ATTR.PH_B] = 2;
//通过英雄等级计算需要的洗点道具个数
res_getneed_hero_clearppitems = function(level){
	return 1 + parseInt((level - 1) / 10, 10);
};

//通过经脉等级获得加强一次需要的道具数量
res_get_str_if_need_itemnum = function(skeletonLevel) {
	var res = TQ.qfind(res_herojingmai, 'id', skeletonLevel+1);
	if ( res ) {
		return res.needchilindan;
	}
	
	var maxRes = res_herojingmai[res_herojingmai.length-1];
	if ( maxRes.id == skeletonLevel ){
		return maxRes.needchilindan;
	}
	
	return 0;
};

//通过英雄等级获得可开启的基础技能格子数
res_get_basegridcnt_by_herolevel = function(herolevel){
	if ( herolevel < 60 ) return 0;
	else if ( herolevel < 80) return 2;
	else if ( herolevel < 100 ) return 3;
	else if ( herolevel < 120 ) return 4;
	else if ( herolevel < 135 ) return 5;
	else if ( herolevel <= 150 ) return 6;
};
//英雄基础技能的最大等级
res_hero_baseskill_maxlevel = 10;
//英雄战略技能的最大等级
res_hero_tacticskill_maxlevel = 1;
//英雄专精技能的最大等级
res_hero_specskill_maxlevel = 1;
//英雄基础技能的开始id
res_hero_baseskill_id_first = 6001008;
res_hero_baseskill_id_last = 6001022;
//英雄开启技能需要的最低等级
res_hero_hasskill_minlevel = 60;
res_base_max_hero_level = 60;
//英雄开启经脉的最低等级
res_hero_hasjingmai_minlevel = 12;
//修炼英雄基础技能一次可以使用的最多小时
res_canuse_sstime_maxnum = 48;
//通过军营总的等级数计算新兵上限
res_calc_newsoldier_maxcnt = function(buildlevels){
	return buildlevels*100;
};
//遣散士兵返回资源的比例
res_demob_soldier_retres_per = 0.3;
//军队的基本移动速度(公里/小时)
res_army_movespeed = 40;
//军队出征前的准备时间(秒)
res_army_preparetime = 900;
//挑衅玩家需要的行程时间(秒)
res_tiaoxin_needtime = 5*60;
//国战玩家需要的行程时间(秒)
res_countryfight_needtime = 15*60;
//通过健康值获得健康的类别
res_gethealthtype = function(healthVal){
	if ( healthVal < 30 ) {
		return HEALTH_TYPE.DEEP_WOUND;
	}
	else if ( healthVal < 80 ) {
		return HEALTH_TYPE.FLESH_WOUND;
	}
	else {
		return HEALTH_TYPE.HEALTH;
	}
};
//每天可以讨伐玩家的次数
res_max_taofa_player_times = 5;
//每天可以攻击玩家的次数
res_max_attack_player_times = 10;

//英雄的最小资质
res_heronature_min_attrval = 90;
//英雄的不同职业不同属性的最大资质
res_heronature_max_attrs = {};
	res_heronature_max_attrs[HERO_PROF.YONGSHI] = {};
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NST] = 145;
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NPH] = 145;
		res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NAG] = 145;
		
	res_heronature_max_attrs[HERO_PROF.DAOJIANG] = {};
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NST] = 135;
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NPH] = 150;
		res_heronature_max_attrs[HERO_PROF.DAOJIANG][ATTR.NAG] = 145;
		
	res_heronature_max_attrs[HERO_PROF.JIJIANG] = {};
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NST] = 135;
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NPH] = 145;
		res_heronature_max_attrs[HERO_PROF.JIJIANG][ATTR.NAG] = 150;
		
	res_heronature_max_attrs[HERO_PROF.GONGJIANG] = {};
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NST] = 145;
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NPH] = 135;
		res_heronature_max_attrs[HERO_PROF.GONGJIANG][ATTR.NAG] = 150;
		
	res_heronature_max_attrs[HERO_PROF.QIJIANG] = {};
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NST] = 150;
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NPH] = 135;
		res_heronature_max_attrs[HERO_PROF.QIJIANG][ATTR.NAG] = 145;
		
	res_heronature_max_attrs[HERO_PROF.QIXIE] = {};
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NST] = 150;
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NPH] = 145;
		res_heronature_max_attrs[HERO_PROF.QIXIE][ATTR.NAG] = 135;
//最高的强化等级
res_max_forcelevel = 10; 
//从商城中可买到的宝石列表
res_canbuy_gems = [4500002,4500012,4500022,4500032];
//宝石的最高等级
res_max_gem_level = 7;
//背包中一次容许使用道具的最大个数
res_max_canuseitem_number = 100;
//单次可以采集的最长时间，单位秒
res_max_collect_time = 10*3600;
// 开启各级分城需要的城池等级
res_create_subcity_needcitylevels = {};
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB1] = 4;
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB2] = 6;
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB3] = 8;
	res_create_subcity_needcitylevels[BUILDCITY_ID.SUB4] = 11;
// 容许加速修炼的武将最高等级
res_hero_lowsteel_level = 80;
// 普通武将修炼单次最大小时数
res_comm_herosteel_max_hours = 10;
// 高级武将修炼单次最大小时数
res_high_herosteel_max_hours = 24;
// 创建联盟需要消耗的钱币
res_create_alli_need_money = 30000;
// 创建联盟需要的角色最低等级
res_create_alli_need_rolelevel = 10;
// 联盟的最高等级
res_alli_max_level = 10;
// 联盟圣兽的最高等级
res_alli_lawlight_maxlevel = 5;
// 跑商需要的最小市场等级
res_trading_need_build_minlevel = 5;
// 城防攻击力	
res_citydefs_hurt_bytype={};
res_citydefs_hurt_bytype[CITYDEF_TYPE.XIANJING] = 5000;
res_citydefs_hurt_bytype[CITYDEF_TYPE.GUNMU] = 5000;
res_citydefs_hurt_bytype[CITYDEF_TYPE.JUMA] = 5000;
res_citydefs_hurt_bytype[CITYDEF_TYPE.LEISHI] = 6000;
res_citydefs_hurt_bytype[CITYDEF_TYPE.NUJIAN] = 5000;
// 进入点将台需要的君主等级
res_enter_terrace_need_rolelevel = 12;
// 进入千层塔需要的君主等级
res_enter_tower_need_rolelevel = 10;
//宝石合成不同级别对应的概率和消耗
res_gem_combinelevels = [
	{level:1, per:25, needNumber:2}
	,{level:2, per:50, needNumber:3}
	,{level:3, per:75, needNumber:4}
	,{level:4, per:100, needNumber:5}
	];
//vip最大等级
res_vip_max_level = 12;
res_nattr_max_level = 16.5;