----------------------------------------------------------------------------------
-- 通过该文件可生成不同游戏的角色对象
-- 生成角色数据库
-- 生成拉取和更新角色数据的接口函数
-- 生成供tolua使用的注释
-- 该文件生成的交付件有: xxx.h 文件  xxx.sql 文件 

-- 编译顺序，先编译 GameSvr，在编译 GameScript， 把
-- libgamescript.so copy 到 bin 下
-- luaut.dll copy 到 script 下
----------------------------------------------------------------------------------
require('db_define')

g_role = 
{
	-- 将要输出的文件
	output_file = '../tqRoleVar.h',
	output_db_file = '../tqDbAssist.h',
	-- 是否输出给tolua使用
	is_out_tolua = true,
	
	-- 常量的定义
	const = 
	{
		{name = 'PKG_CUR_VER';                    	val = 127,},
		
		{name = 'MAX_SQL_LEN';                    	val = 2097152,},
		{name = 'MAX_ROLE_TABLE_CNT';               val = 1,},
		{name = 'MAX_CITY_STATES_CNT';                    val = 32,},
		{name = 'MAX_INBUILD_CNT';                  val = 30,},
		{name = 'MAX_BUILDING_CNT';                 val = 6,},
		{name = 'MAX_CITY_CNT';                 	val = 5,},
		{name = 'MAX_SELFFIELD_CNT';                 	val = 11,},
		{name = 'MAX_ITEMS_CNT';                 	val = 750,},
		{name = 'MAX_HOLES_CNT';                 	val = 3,},
		{name = 'MAX_WEARS_CNT';                 	val = 12,},
		{name = 'MAX_USERNAME_ARR_LEN';           val = 33,},
		{name = 'MAX_USERNAME_LEN';          		val = '(MAX_USERNAME_ARR_LEN - 1)',},
		{name = 'MIN_USERNAME_LEN';          		val = 3,},
		{name = 'MAX_ROLENAME_ARR_LEN';           val = 22,},
		{name = 'MAX_ROLENAME_LEN';           		val = '(MAX_ROLENAME_ARR_LEN - 1)',},
		{name = 'MIN_ROLENAME_LEN';           		val = 3,},
		{name = 'MAX_HERONAME_ARR_LEN';           val = 19,},
		{name = 'MAX_HERONAME_LEN';           		val = '(MAX_HERONAME_ARR_LEN - 1)',},
		{name = 'MIN_HERONAME_LEN';           		val = 2,},
		{name = 'MAX_CITYNAME_ARR_LEN';            val = 22,},
		{name = 'MAX_CITYNAME_LEN';           		val = '(MAX_CITYNAME_ARR_LEN - 1)',},
		{name = 'MAX_TASKS_CNT';                 	val = 500,},
		{name = 'MAX_ONLINE_TASKS_CNT';                 	val = 4,},
		{name = 'MAX_EVERYDAY_TASKS_CNT';                 	val = 10,},
		{name = 'MAX_ACT_TASKS_CNT';                 	val = 100,},
		{name = 'MAX_HERO_CNT';               		val = 32,},
		{name = 'MAX_NEWHERO_CNT';             	val = 6,},
		{name = 'MAX_SLDS_CNT';               		val = 50,},
		{name = 'MAX_GEMBESET_CNT';               		val = 3,},
		
		{name = 'MAX_MAILTITLE_ARR_LEN';       val = 45+1,},
		{name = 'MAX_MAISYSLCON_ARR_LEN';   val = 4096+1,},
		{name = 'MAX_MAILCON_ARR_LEN';        val = 750+1,},
		
		{name = 'MAX_MAILTITLE_LEN',             val = '(MAX_MAILTITLE_ARR_LEN - 1)',},
		{name = 'MAX_MAISYSLCON_LEN',          val = '(MAX_MAISYSLCON_ARR_LEN - 1)',},
		{name = 'MAX_MAILCON_LEN',               val = '(MAX_MAILCON_ARR_LEN - 1)',},
		
		{name = 'MAX_BULLETINS_CNT';            	val = 16,},
		{name = 'MAX_BUDDYS_CNT';               	val = 300,},
		{name = 'MAX_BUDDYS_APPLY_CNT';      val = 10,},
		{name = 'MAX_ROLEATTRS_CNT';           val = 22,},
		{name = 'MAX_HEROATTRS_CNT';          	val = 37,},
		{name = 'MAX_SIMPLEHEROATTRS_CNT'; val = 3,},
		{name = 'MAX_NEWHEROATTRS_CNT';     val = 9,},
		{name = 'MAX_FARM_CNT';               		val = 120,},
		{name = 'MAX_CULTURE_CNT';               		val = 33,},
		{name = 'MAX_FARM_LOG_CNT';               		val = 50,},
		{name = 'MAX_SUBJECT_CNT';               val = 5,},
		{name = 'MAX_HEROWEAR_CNT';               val = 7,},
		{name = 'MAX_HERO_SKILL_CNT';               val = 13,},
		{name = 'MAX_HERO_SCUT_CNT';               val = 12,},
		{name = 'MAX_ITEM_ATTRS_CNT';               val = 18,},
		{name = 'MAX_FAVORITE_CNT';               val = 10,},
		{name = 'MAX_ENEMY_CNT';               val = 300,},
		{name = 'MAX_SUCC_COPYFIELD_CNT';               val = 30,},
		{name = 'MAX_LINEUP_CNT';               val = 16,},
		{name = 'MAX_DEFAULTTEAM_HERO_CNT';               val = 5,},
		{name = 'MAX_DEFAULTTEAM_CNT';               val = 3,},
		{name = 'MAX_TEAM_HERO_CNT';               val = 5,},
		{name = 'MAX_SELFARMY_CNT';               val = 20,},
		{name = 'MAX_ENEMYARMY_CNT';          val = 50,},
		{name = 'MAX_ALLIARMY_CNT';          val = 10,},
		{name = 'MAX_PAIQIAN_ALLIARMY_CNT';          val = 5,},
		{name = 'MAX_CITYDEF_CNT';          val = 5,},
		{name = 'MAX_ROLEINTRO_ARR_LEN';          val = 151,},
		{name = 'MAX_ROLEINTRO_LEN';          val = 150,},
		{name = 'MAX_COLLECTOR_CNT';          val = 10,},
		{name = 'MAX_INVITE_JOIN_ALLI_CNT';          val = 10,},
		{name = 'MAX_ALLINAME_ARR_LEN';           val = 22,},
		{name = 'MAX_TRADING_ROLES_CNT';           val = 20,},
		{name = 'MAX_ACT_TERRACE_COUNT';           val = 100,},
		{name = 'MAX_ACTREWARDS_CNT';           val = 4,},
		{name = 'MAX_SIGNINREWARDS_CNT';           val = 3,},
		{name = 'MAX_SIGNINREWARDS_CNT_EX';           val = 4,},
		{name = 'MAX_ACTVALTASKS_CNT';           val = 20,},
		{name = 'MAX_FORCELINEUPCFG_CNT';           val = 2,},
		{name = 'MAX_YD_LVL_IDS_CNT';           val = 15,},
		{name = 'MAX_BD_LVL_IDS_CNT';           val = 15,},
		{name = 'MAX_BUY_ITEMS_CNT';           val = 20,},
		{name = 'MAX_CTLCFG_BTIMAP_CNT';           val = 4,},
		{name = 'MAX_PAYACT_GIFT_CNT';           val = 10,},
		{name = 'MAX_WAIT_BUILDS_CNT';           val = 20,},
		{name = 'MAX_CDKEY_CNT';           val = 20,},
		{name = 'MAX_HELPTIP_CNT';           val = 20,},
	};
	
	
	-- 结构的定义
	struct = 
	{
		-- 内城建筑结构
		{
			type = 'struct',
			name = 'SInBuild',
			desc = '已经完成的建筑结构',
			item = 
			{
				{ type='uint32',	name='Id', 				default='0', 	ver=1, 	desc='建筑位置id', },
				{ type='uint32',	name='ResId', 			default='0', 	ver=1, 	desc='建筑资源id', },
				{ type='uchar', 	name='Level', 			default='0', 	ver=1, 	desc='建筑当前等级', },
				{ type='uchar',	name='State',			default='0', 	ver=1, 	desc='建筑状态', },
				{ type='uint32',	name='Stoptime',		default='0', 	ver=1, 	desc='建筑将结束的时间', },
				{ type='uint32',	name='Duration',		default='0', 	ver=1, 	desc='等待状态中的建筑需要的时间', },
			},
		},
		
		-- 内城建筑列表结构 
		{
			type = 'struct',
			name = 'SInBuildList',
			desc = '内城建筑列表结构',
			item = 
			{
				{ type='uchar',		name='Total', 			default='0', 	ver=1, 	desc='内城建筑个数', },
				{ type='SInBuild', 	name='InBuilds', 		count='MAX_INBUILD_CNT', refer='Total',	ver=1, 	desc='建筑列表的具体内容', },
			},
		},
		
		--城池资源
		{
			type = 'struct',
			name = 'SCityRes',
			desc = '城池资源',
			item = 
			{
				{ type='uchar',		name='Level', 								default='0', 	ver=1, 			desc='城堡等级', },
				{ type='uint32',		name='BuildVal', 							default='0', 	ver=1, 			desc='城堡建设度', },
				{ type='uint32',		name='HurtBuildVal', 					default='0', 	ver=1, 			desc='受损的建设度', },
				{ type='uint32',		purename='todayLostedBuildTime', 	default='0', 	ver=1, 			desc='当日受损的建设度时间', },
				{ type='uint32',		purename='todayLostedBuildVal', 	default='0', 	ver=1, 			desc='当日受损的建设度值', },
				{ type='int32',		name='IdlePopu',							default='0', 	ver=1, 			desc='空闲人口', },
				{ type='uint64',		name='Wood',								default='0', 	ver=1, 			desc='木材', },
				{ type='uint64',		name='Stone',								default='0', 	ver=1, 			desc='石料', },
				{ type='uint64',		name='Iron',								default='0', 	ver=1, 			desc='铁矿', },
				{ type='uint64',		name='Food',								default='0', 	ver=1, 			desc='粮食', },
				{ type='uint64',		name='Money',							default='0', 	ver=1, 			desc='钱币', },
				{ type='uint32',		name='MLastTime',						default='0', 	ver=1, 			desc='钱币最近一次的更新时间', },
				{ type='uint32',		name='ILastTime',						default='0', 	ver=1, 			desc='空闲人口最近一次的更新时间', },
				{ type='uchar',		purename='lastMaxLevel', 								default='0', 	ver=17, 			desc='城堡上次的最大等级', },
			},
		},
		
		--城池防御
		{
			type = 'struct',
			name = 'SCityDef',
			desc = '城池防御',
			item = 
			{
				{ type='uint32',	purename='defs',					count='MAX_CITYDEF_CNT',		ver=1, 	desc='城防数量列表', },
				{ type='uint32',	purename='stopTime',			default='0',								ver=1,	desc='当前正在建造城防的结束时间',},
				{ type='uint32',	purename='buildResId',			default='0',								ver=1,	desc='当前正在建造城防的资源id',},
				{ type='uint32',	purename='buildNumber',		default='0',								ver=1,	desc='当前正在建造城防的数量',},
			},
		},
		
		--effect结构定义
		{
			type = 'struct',
			name = 'SEffect',
			desc = 'effect结构定义',
			item = 
			{
				{ type='ushort', 	purename='id', 		default='0', 	ver=1, 	desc='效果id', },
				{ type='uint32', 	purename='val', 		default='0', 	ver=1, 	desc='效果值', },
				{ type='uchar', 	purename='unit', 		default='0', 	ver=1, 	desc='效果单位', },				
			},		
		},
		
		--生产者结构定义
		{
			type = 'struct',
			name = 'SCreator',
			desc = '生产者结构定义',
			item = 
			{
				{ type='uchar', 	purename='type', 		default='0', 	ver=1, 	desc='生产者类型', },
				{ type='uint64', 	purename='id', 			default='0', 	ver=1, 	desc='生产者的id', },
				{ type='uint32', 	purename='skillId', 		default='0', 	ver=1, 	desc='生产者使用的技能id', },
			},			
		},
		
		-- state结构定义
		{
			type = 'struct',
			name = 'SState',
			desc = 'state结构定义',
			item = 
			{
				{ type='uint32',		purename='id', 				default='0', 	ver=1, 	desc='state的唯一id', },
				{ type='ushort',		purename='type', 			default='0', 	ver=1, 	desc='效果类型', },
				{ type='uint32', 		purename='startTime', 		default='0', 	ver=1, 	desc='当前效果开始的时刻', },
				{ type='uint32', 		purename='lastTime', 		default='0', 	ver=1, 	desc='最近一次更新效果的时刻', },
				{ type='uint32', 		purename='duration', 		default='0', 	ver=1, 	desc='表示时长（秒）', },
				{ type='uchar', 		purename='isOnline', 		default='0', 	ver=1, 	desc='是否只有在线才计时间', },
				{ type='SCreator', 	purename='creator', 								ver=1, 	desc='生产者', },
				{ type='SEffect', 	purename='effect', 								ver=1, 	desc='效果', },
			},
		},
		
		-- state列表结构定义
		{
			type = 'struct',
			name = 'SStateList',
			desc = 'State列表结构定义',
			item = 
			{
				{ type='uchar',		purename='count',	default='0', 	ver=1, 	desc='State列表的个数', },
				{ type='SState',		purename='states',	count='MAX_CITY_STATES_CNT', refer='count',	ver=1, 	desc='State列表的具体内容', },
				{ type='uint32',		purename='lastStateId',	default='1000', 	ver=101, 	desc='state最近一次的id', },
			},
		},
		
		-- 单个城市结构
		{
			type = 'struct',
			name = 'SCity',
			desc = '单个城市结构',
			item = 
			{
				{ type='uchar',				name='Type', 					default='0', 	ver=1, 	desc='城市的类型', },
				{ type='SInBuildList', 	name='InBuilds', 									ver=1, 	desc='内城建筑列表', },
			},
		},
		
		--二维坐标
		{
			type = 'struct',
			name = 'SPos',
			desc = '二维坐标',
			item = 
			{
				{ type='int32',		purename='x',	default='0', 	ver=1, 	desc='横向x', },
				{ type='int32',		purename='y',	default='0', 	ver=1, 	desc='纵向y', },
			},
		},		
		
		-- 单个野地结构
		{
			type = 'struct',
			name = 'SSelfField',
			desc = '单个野地结构',
			item = 
			{
				{ type='uint32',			purename='gridId', 				default='0', 	ver=1, 	desc='野地的格子id', },
				{ type='uint32',			purename='startTime', 			default='0', 	ver=1, 	desc='采集开始的时间', },
				{ type='uint32',			purename='soldierNumber', 	default='0', 	ver=1, 	desc='参与采集的士兵数量', },
			},
		},
		
		-- 祭坛兑换次数
		{
			type = 'struct',
			name = 'SExchangeTodayTimes',
			desc = '祭坛兑换次数',
			item = 
			{
				{ type='uint32',		purename='curTimes', 			default='0', 	ver=13, 	desc='已经兑换次数', },
				{ type='uint32',		purename='maxTimes', 			default='0', 	ver=13, 	desc='今日最大次数', },
				{ type='uint32',		purename='lastTime',	default='0', 	ver=13, 	desc='最近的一次时间', },
			},
		},
		
		-- 城市列表
		{
			type = 'struct',
			name = 'SCitys',
			desc = '城市列表',
			item = 
			{
				{ type='SCityRes',		name='CRes', 			default='0', 	ver=1, 	desc='城堡的通用资源', },
				{ type='SCityDef',		purename='cityDef', 	default='0', 	ver=1, 	desc='城池防御', },
				{ type='uchar',			name='Total', 			default='0', 	ver=1, 	desc='城市列表个数', },
				{ type='SCity', 			name='Citys', 			count='MAX_CITY_CNT', refer='Total',	ver=1, 	desc='城市列表具体内容', },
				
				{ type='uchar',			purename='fieldTotal', 	default='0', 	ver=1, 	desc='自己的野地列表个数', },
				{ type='SSelfField',		purename='selfFields', 	count='MAX_SELFFIELD_CNT', refer='fieldTotal',	ver=1, 	desc='自己的野地列表个数', },
				{ type='SExchangeTodayTimes',	purename='exchangeTodayTimes', default='0', 	ver=13, 	desc='祭坛兑换次数', },
				
				{ type='uint8',			purename='startAutoBuild', 	default='0', 	ver=111, 	desc='是否开启了自动建造', },
				{ type='int8',				purename='waitBuildCount', 	default='0', 	ver=111, 	desc='等待建造个数', },
				{ type='uint32',			purename='waitBuilds', 	count='MAX_WAIT_BUILDS_CNT', refer='waitBuildCount',	ver=111, 	desc='等待建造数据', },
			},
		},
		
		--孔结构
		{
			type = 'struct',
			name = 'SOneHole',
			desc = '孔结构',
			item = 
			{
				{ type='ushort',	name='Attr',		default='0', 	ver=1, 	desc='属性的类型', },
				{ type='uint32',		name='IdxOrVal',	default='0', 	ver=1, 	desc='索引或值', },
			},
		},
		
		--角色所有固定的属性或变化很少的属性
		{
			type = 'struct',
			name = 'SFixVar',
			desc = '角色所有固定的属性或变化很少的属性',
			item = 
			{
				{ type='uchar',		name='Icon',			default='0', 					ver=1, 			desc='头像', },
				{ type='uint32',		name='CityId',			default='0', 					ver=1, 			desc='出生城市id', },
				{ type='uint32',		name='CPosX',			default='0', 					ver=1, 			desc='出生城市id', },
				{ type='uint32',		name='CPosY',			default='0', 					ver=1, 			desc='出生城市id', },
				{ type='uint32',		name='CreateTime',	default='0', 					ver=1, 			desc='创建时间', },
			},
		},
		
		--属性值
		{
			type = 'struct',
			name = 'SAttr',
			desc = '属性值',
			item = 
			{
				{ type='ushort',		name='Attr',		default='0', 	ver=1, 			desc='属性类型', },
				{ type='int32',		purename='ulVal', default='0', 	ver=1, 			desc='属性值,遗漏', },
				{ type='uchar',		name='Unit',		default='0', 	ver=1, 			desc='属性类型', },
			},
		},
		
		--属性值
		{
			type = 'struct',
			name = 'SAttrEx',
			desc = '属性值',
			item = 
			{
				{ type='ushort',		purename='attr',		default='0', 	ver=1, 			desc='属性类型', },
				{ type='uint32',		purename='val',		default='0', 	ver=1, 			desc='属性值', },
				{ type='uchar',		purename='unit',		default='0', 	ver=1, 			desc='属性类型', },
			},
		},
		
		--主角属性值列表
		{
			type = 'struct',
			name = 'SRoleAttrList',
			desc = '主角属性值列表',
			item = 
			{
				{ type='uint32',		name='NSLastTime',	default='0', 	ver=1, 			desc='新士兵最近更新时间', },
				{ type='uchar',		name='Count',			default='0', 	ver=1, 			desc='属性个数', },
				{ type='SAttr',		name='Attrs',			count='MAX_ROLEATTRS_CNT', 	refer='Count',	ver=1,	desc='属性值', },
				{ type='uint32',		purename='lastPSRefreshDay',		default='0', 	ver=10, 			desc='上次ps属性刷新是一年中的第几天', },
			},
		},
		
		--qq会员
		{
			type = 'struct',
			name = 'SQQMembership',
			desc = 'qq会员',
			item = 
			{
				{ type='uint8',	purename='is_yellow_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='is_yellow_year_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='yellow_vip_level',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='is_yellow_high_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='is_blue_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='is_blue_year_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='blue_vip_level',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='is_super_blue_vip',	default='0', 	ver=105, 			desc='', },
				{ type='uint8',	purename='_3366_grow_level',	default='0', 	ver=110, 			desc='', },
			},
		},
	
		--角色的所有基础属性
		{
			type = 'struct',
			name = 'SBaseInfo',
			desc = '角色的所有基础属性',
			item = 
			{
				{ type='uchar',				name='GM',			default='0', 			ver=1, 			desc='GM权限', },
				{ type='uchar',				name='Level',		default='0', 			ver=1, 			desc='角色等级', },
				{ type='uint32',				name='Prestige',	default='0', 			ver=1, 			desc='声望值', },
				{ type='uint32',				name='CityHonor',default='0', 			ver=1, 			desc='州荣誉', },
				{ type='uint32',				name='CityCD',	default='0', 			ver=1, 			desc='转州的冷却时间', },
				{ type='uint64',				name='Alliance',	default='0', 			ver=1, 			desc='联盟id', },
				{ type='uchar',				name='State',		default='0', 			ver=1, 			desc='主角状态', },
				{ type='SRoleAttrList',		name='Attrs',									ver=1, 			desc='主角属性列表', },
				{ type='uint32',				purename='cityModel',	default='0', 	ver=7, 			desc='主角城池外观', },
				{ type='string',				purename='introduction',	count='MAX_ROLEINTRO_ARR_LEN', 	ver=8, 			desc='介绍', },
				{ type='SQQMembership',	purename='qqMembership',		ver=105,	desc='qq会员', },
			},
		},
		
		--单个任务结构
		{
			type = 'struct',
			name = 'STask',
			desc = '单个任务结构',
			item = 
			{
				{ type='uint32',	purename='taskId',	default='0', 	ver=1, 		desc='任务id', },
				{ type='uchar',		purename='state',		default='0', 	ver=1, 			desc='任务状态', },
			},	
		},
		
		--单个任务结构
		{
			type = 'struct',
			name = 'SDoingRoleTask',
			desc = '正在进行中的君主任务',
			item = 
			{
				{ type='uint32',	purename='taskId',	default='0', 	ver=20, 		desc='正在进行中的君主任务id', },
				{ type='uint32',	purename='stopTime',	default='0', 	ver=20, 			desc='任务的结束时间', },
				{ type='uint32',	purename='cdStopTime',	default='0', 	ver=20, 			desc='冷却的结束时间', },
			},	
		},
		
		--日活跃度任务结构
		{
			type = 'struct',
			name = 'SActValTask',
			desc = '单日活跃度任务结构',
			item = 
			{
				{ type='uint32',	purename='taskId',	default='0', 	ver=25, 		desc='任务id', },
				{ type='uint32',	purename='times',		default='0', 	ver=25, 			desc='完成的任务次数', },
			},	
		},
		
		--活动任务结构
		{
			type = 'struct',
			name = 'SActTask',
			desc = '活动任务结构',
			item = 
			{
				{ type='uint32',	purename='taskId',	default='0', 	ver=30, 		desc='任务id', },
				{ type='uchar',	purename='state',	default='0', 	ver=30, 		desc='任务状态', },
				{ type='uint32',	purename='times',		default='0', 	ver=30, 			desc='完成的任务次数', },
				{ type='uint32',	purename='maxTimes',		default='0', 	ver=30, 			desc='可完成任务的最大次数', },
				{ type='uint32',	purename='startTime',		default='0', 	ver=30, 			desc='任务的开始时间', },
				{ type='uint32',	purename='stopTime',		default='0', 	ver=30, 			desc='任务的结束时间', },
			},	
		},
		
		--活跃度结构
		{
			type = 'struct',
			name = 'SActivityVal',
			desc = '活跃度结构',
			item = 
			{
				{ type='uint32',	purename='refreshActValTime',	default='0', 	ver=25, 		desc='今天活跃值的刷新时间', },
				{ type='uint32',	purename='val',	default='0', 	ver=25, 		desc='今天已有的活跃值', },
				{ type='uint32',	purename='gotActRewardTime',	default='0', 	ver=25, 		desc='已领取的活跃度奖励的刷新时间', },
				{ type='uint32',	purename='gotActRewards', count='MAX_ACTREWARDS_CNT',  ver=25, desc='已领取的活跃度奖励', },
				
				{ type='uint32',	purename='refreshSigninTime',	default='0', 	ver=25, 		desc='今天活跃值的刷新时间', },
				{ type='uint8',	purename='todaySign', default='0', ver=25, desc='今天是否已签到', },				
				{ type='uint32',	purename='signinDaysTime', default='0', ver=25, desc='本月签到天数的刷新时间', },
				{ type='uint8',	purename='signinDays', default='0', ver=25, desc='本月签到天数', },
				{ type='uint32',	purename='gotSigninRewardTime', default='0',  ver=25, desc='已领取的签到奖励的刷新时间', },
				{ type='uint32',	purename='gotSigninRewards', count='MAX_SIGNINREWARDS_CNT',  ver=25, desc='已领取的签到奖励', },
				
				{ type='uint32',	purename='refreshTaskTime',	default='0', 	ver=25, 	desc='刷新任务列表的时间', },
				{ type='int32',	purename='count',	default='0', 	ver=25, 	desc='任务列表数', },
				{ type='SActValTask',	purename='tasks',	count='MAX_ACTVALTASKS_CNT', refer='count',	ver=25, 	desc='任务列表内容', },
				
				{ type='uint32',	purename='gotOnlineGoodsTime',	default='0', 	ver=102, 	desc='最近一次获取在线节日礼包的时间', },
				{ type='uint32',	purename='gotGoodsTimes',	default='0', 	ver=102, 	desc='最近一次获取在线节日礼包的次数', },
				{ type='uint32',	purename='gotSigninRewardsEx', count='MAX_SIGNINREWARDS_CNT_EX',  ver=125, desc='已领取的签到奖励', },
			},	
		},
		
		--在线领奖任务
		{
			type = 'struct',
			name = 'SOnlineTask',
			desc = '在线领奖任务',
			item = 
			{
				{ type='uint32',	purename='taskId',		default='0', 	ver=27, 		desc='任务id', },
				{ type='uint32',	purename='startTime',	default='0', 	ver=27, 		desc='该任务开始的时间', },
				{ type='uint32',	purename='lastTime',	default='0', 	ver=27, 		desc='上次已经登录的时间', },
				{ type='uint32',	purename='lastLapsed',	default='0', 	ver=27, 		desc='上次已经登录后流逝的时间', },
				{ type='uint8',	purename='isCircled',	default='0', 	ver=27, 		desc='是否已开始循环任务', },
			},	
		},
		
		--新手指引任务
		{
			type = 'struct',
			name = 'SNewcomerTask',
			desc = '新手指引任务',
			item = 
			{
				{ type='uint32',	purename='curTaskId',		default='0', 	ver=28, 		desc='当前任务id', },
				{ type='uint8',	purename='isEnd',		default='0', 	ver=123, 		desc='新手指引任务是否结束', },
				{ type='uint8',	purename='isGlobalTipEnd',		default='0', 	ver=124, 		desc='新手指引任务结束后提示全局攻略面板', },
			},	
		},
		
		--新手指引任务
		{
			type = 'struct',
			name = 'SYellowDiamondTask',
			desc = '黄钻任务',
			item = 
			{
				{ type='int8',	purename='gotNewgift',	default='0', 	ver=104, 	desc='新手礼包已领取', },
				{ type='uint32',	purename='gotCommGift',	default='0', 	ver=104, 	desc='黄钻每日礼包的领取时间', },
				{ type='uint32',	purename='gotYearGift',	default='0', 	ver=104, 	desc='年费黄钻每日礼包的领取时间', },
				{ type='int32',	purename='lvlCount',	default='0', 	ver=104, 	desc='黄钻等级礼包的领取id列表的个数', },
				{ type='int8',	purename='gotLvlGifts',	count='MAX_YD_LVL_IDS_CNT', refer='lvlCount', 	ver=104, 	desc='黄钻等级礼包的领取id列表', },
			},	
		},
		
		{
			type = 'struct',
			name = 'SBlueDiamondTask',
			desc = '蓝钻任务',
			item = 
			{
				{ type='int8',	purename='gotNewgift',	default='0', 	ver=113, 	desc='新手礼包已领取', },
				{ type='uint32',	purename='gotCommGift',	default='0', 	ver=113, 	desc='蓝钻每日礼包的领取时间', },
				{ type='uint32',	purename='gotYearGift',	default='0', 	ver=113, 	desc='年费蓝钻每日礼包的领取时间', },
				{ type='uint32',	purename='gotHighGift',	default='0', 	ver=113, 	desc='超级蓝钻每日礼包的领取时间', },
				{ type='int32',	purename='lvlCount',	default='0', 	ver=113, 	desc='蓝钻等级礼包的领取id列表的个数', },
				{ type='int8',	purename='gotLvlGifts',	count='MAX_BD_LVL_IDS_CNT', refer='lvlCount', 	ver=113, 	desc='蓝钻等级礼包的领取id列表', },
				{ type='uint32',	purename='got3366Gift',	default='0', 	ver=113, 	desc='3366每日礼包的领取时间', },
			},	
		},
		
		--充值活动
		{
			type = 'struct',
			name = 'SPayAct',
			desc = '充值活动',
			item = 
			{
				{ type='uint32',	purename='lastPayTime',	default='0', 	ver=108, 	desc='最近一次充值时间', },
				{ type='uint32',	purename='allGold',	default='0', 	ver=108, 	desc='所有的充值数', },
				{ type='uint32',	purename='actAllGold',	default='0', 	ver=108, 	desc='本次活动的充值数', },
				{ type='uint8',	purename='giftGots', count='MAX_PAYACT_GIFT_CNT', ver=108, desc='礼包领取标记', },
			},	
		},		
		
		--世界boss
		{
			type = 'struct',
			name = 'SWorldboss',
			desc = '世界boss',
			item = 
			{
				{ type='uint8',	purename='times',		default='0', 	ver=116, 	desc='当日挑战次数', },
				{ type='uint16',	purename='guwuLevel',	default='0', 	ver=116, 	desc='鼓舞等级', },
				{ type='uint8',	purename='gotGift',	default='0', 	ver=116, 	desc='今天的奖励是否领取', },
				{ type='uint32',	purename='refreshTime',	default='0', 	ver=116, 	desc='刷新时间', },
				{ type='uint32',	purename='getPersonRankGiftTime',	default='0', 	ver=117, 	desc='获取个人排名奖品的时间', },
				{ type='uint32',	purename='getCountryRankGiftTime',	default='0', 	ver=117, 	desc='获取势力排名奖品的时间', },
			},	
		},
		
		--发送奖励的活动
		{
			type = 'struct',
			name = 'SSendReward',
			desc = '发送奖励的活动',
			item = 
			{
				{ type='uint8',	purename='sendFirstHero',		default='0', 	ver=122, 	desc='是否已经发送了首个武将', },
			},	
		},
		
		--正在做的任务列表
		{
			type = 'struct',
			name = 'STaskList',
			desc = '正在做的任务列表',
			item = 
			{
				{ type='int32',	purename='count',	default='0', 	ver=1, 	desc='任务列表数', },
				{ type='STask',	purename='tasks',	count='MAX_TASKS_CNT', refer='count',	ver=1, 	desc='任务列表内容', },
				{ type='SDoingRoleTask',	purename='doingRoleTask',	 ver=20, 	desc='正在进行中的君主任务', },
				{ type='uint32',	purename='refreshTime',	default='0', 	ver=21, 	desc='日常任务列表刷新', },
				{ type='int32',	purename='everydayCount',	default='0', 	ver=21, 	desc='日常任务列表数', },
				{ type='STask',	purename='everydayTasks',	count='MAX_EVERYDAY_TASKS_CNT', refer='everydayCount',	ver=21, 	desc='日常任务列表内容', },
				{ type='uint32',	purename='prestigeLastTime',	default='0', 	ver=22, 	desc='声望任务的最近一次时间', },				
				{ type='SActivityVal',	purename='activityVal',	ver=25, 	desc='活跃度', },
				{ type='SOnlineTask',	purename='onlineTask', ver=27, 	desc='在线领奖任务', },
				{ type='SNewcomerTask',	purename='newComerTask', ver=28, 	desc='新手指引任务', },
				{ type='int32',	purename='actTaskCount',	default='0', 	ver=30, 	desc='活动任务列表数', },
				{ type='SActTask',	purename='actTasks',	count='MAX_ACT_TASKS_CNT', refer='actTaskCount',	ver=30,	desc='活动任务列表内容', },
				{ type='SYellowDiamondTask', purename='ydtasks',	ver=104, desc='黄钻任务', },
				{ type='SPayAct', purename='payAct',	ver=108, desc='充值活动', },
				{ type='SBlueDiamondTask', purename='bdtasks',	ver=113, desc='蓝钻任务', },
				{ type='SWorldboss', purename='worldboss',	ver=116, desc='世界boss', },
				{ type='SSendReward', purename='sendReward',	ver=122, desc='发送奖励的活动', },
			},	
		},
		
		--单个士兵结构
		{
			type = 'struct',
			name = 'SSoldier',
			desc = '单个士兵结构',
			item = 
			{
				{ type='uint32',		purename='resid',			default='0', 							ver=1, 	desc='士兵资源ID*1000+level', },
				{ type='uint32',		purename='number',		default='0', 							ver=1, 	desc='士兵个数', },
			},
		},		
		
		--宣战结构
		{
			type = 'struct',
			name = 'SDeclare',
			desc = '宣战结构',
			item = 
			{
				{ type='uchar',		purename='state',	default='0', 	ver=1, 	desc='状态', },
				{ type='uint32',		purename='stoptime',	default='0', 	ver=1, 	desc='状态结束的时间', },
				{ type='uint64',		purename='id',		default='0', 	ver=1, 	desc='目标id', },
			},
		},
		
		--默认战队
		{
			type = 'struct',
			name = 'SDefaultTeam',
			desc = '默认战队',
			item = 
			{
				{ type='uint32',		purename='lineupId',	default='0', 	ver=1, 	desc='阵型id', },
				{ type='uint64',		purename='heroIds',	count='MAX_DEFAULTTEAM_HERO_CNT',	ver=1, 	desc='列表中英雄id', },
			},
		},
		
		--每日战况
		{
			type = 'struct',
			name = 'STodayFightTimes',
			desc = '每日战况',
			item = 
			{
				{ type='uint32',		purename='taofa',		default='0', 	ver=1, 	desc='讨伐次数', },
				{ type='uint32',		purename='cuihui',		default='0', 	ver=1, 	desc='摧毁次数', },
				{ type='uint32',		purename='tiaoxin',		default='0', 	ver=1, 	desc='挑衅次数', },
				{ type='uint32',		purename='fightowner',	default='0', 	ver=1, 	desc='攻击野地宿主次数', },
				{ type='uint32',		purename='lastTime',	default='0', 	ver=1, 	desc='最近的一次时间', },
			},
		},
		
		--军队中简单英雄结构
		{
			type = 'struct',
			name = 'SSimpleHero',
			desc = '军队中简单英雄结构',
			item = 
			{
				{ type='uint64',		purename='id',	default='0', 	ver=1, 	desc='英雄id', },
				{ type='string',		purename='name',				count='MAX_HERONAME_ARR_LEN',	ver=1, 	desc='英雄名', },
				{ type='uchar', 		purename='level', 				default='0', 								ver=1, 	desc='英雄等级', },		
				{ type='uchar',		purename='attrCount',		default='0', 	ver=1, 			desc='属性个数', },
				{ type='SAttrEx',	purename='attrs',		count='MAX_SIMPLEHEROATTRS_CNT', 	refer='attrCount',	ver=1,	desc='属性值', },	--健康度、单挑力、战力			
				{ type='SSoldier',	purename='soldier', 															ver=1, 	desc='携带的士兵', },
				{ type='uchar', 		purename='lineupPos', 				default='0', 								ver=1, 	desc='阵列中的站位', },		
			},
		},
		
		--防守军队
		{
			type = 'struct',
			name = 'SDefArmy',
			desc = '防守军队',
			item = 
			{
				{ type='uint32',					purename='lineupId',					default='0', 								ver=1, 	desc='阵型id', },
				{ type='uchar',					purename='heroCount',				default='0', 								ver=1, 	desc='英雄个数', },				
				{ type='uint64',					purename='heros',	count='MAX_TEAM_HERO_CNT', refer='heroCount',	ver=1, 	desc='英雄列表', },
			}
		},
		
		--箭塔军队
		{
			type = 'struct',
			name = 'STowerArmy',
			desc = '箭塔军队',
			item = 
			{
				{ type='SSoldier',				purename='soldiers',	count='MAX_TEAM_HERO_CNT', ver=1, 	desc='每个箭塔中的士兵', },
			}
		},
		
		--今天的国战荣誉
		{
			type = 'struct',
			name = 'SFightTodayHonor',
			desc = '今天的国战荣誉',
			item = 
			{
				{ type='uint32', 	purename='hasRefreshTime', 		default='0', 				ver=118, 	desc='可贡献的别人打掉的刷新时间', },
				{ type='uint32', 	purename='hasHonor', 		default='0', 				ver=118, 	desc='今天还剩余的荣誉', },
				{ type='uint32', 	purename='getRefreshTime', 		default='0', 				ver=118, 	desc='获得的刷新时间', },
				{ type='uint32', 	purename='getHonor', 		default='0', 				ver=118, 	desc='今天已获得荣誉', },
			}
		},
		
		--军事结构
		{
			type = 'struct',
			name = 'SMilitary',
			desc = '军事结构',
			item = 
			{
				{ type='uchar',					purename='favoriteCount',	default='0', 	ver=1, 	desc='收藏目标个数', },
				{ type='uint64',					purename='favorites',	count='MAX_FAVORITE_CNT', refer='favoriteCount',	ver=1, 	desc='收藏目标列表', },
				
				{ type='uchar',					purename='enemyCount',	default='0', 	ver=1, 	desc='仇人个数', },
				{ type='uint64',					purename='enemys',	count='MAX_ENEMY_CNT', refer='enemyCount',	ver=1, 	desc='仇人列表', },
				
				{ type='uchar',					purename='lineupCount',	default='0', 	ver=1, 	desc='阵型个数', },
				{ type='uint32',					purename='lineups',	count='MAX_LINEUP_CNT', refer='lineupCount',	ver=1, 	desc='阵型目标列表', },
				
				{ type='SDefaultTeam',		purename='defaultTeams',	count='MAX_DEFAULTTEAM_CNT',	ver=1, 	desc='默认战队列表', },
				{ type='STodayFightTimes',	purename='todayFightTimes', ver=1, 	desc='每日战况', },
				
				{ type='uchar',					purename='selfArmyCount',	default='0', 	ver=1, 	desc='我的出征军队个数', },
				{ type='uint64',					purename='selfArmyIds', 		count='MAX_SELFARMY_CNT', refer='selfArmyCount', ver=1, 	desc='我的出征军队列表', },
				
				{ type='uchar',					purename='enemyArmyCount',	default='0', 	ver=1, 	desc='攻打我方敌人军队个数', },
				{ type='uint64',					purename='enemyArmyIds', count='MAX_ENEMYARMY_CNT', refer='enemyArmyCount', ver=1, 	desc='攻打我方敌人军队列表', },
				
				{ type='uchar',					purename='alliArmyCount',	default='0', 	ver=1, 	desc='同盟派遣军队个数', },
				{ type='uint64',					purename='alliArmyIds', count='MAX_ALLIARMY_CNT', refer='alliArmyCount', ver=1, 	desc='同盟派遣军队列表', },
				
				{ type='SDefArmy',				purename='defArmy',	ver=1, 	desc='防守军队', },
				{ type='STowerArmy',			purename='towerArmy',	ver=1, 	desc='箭塔军队', },
				
				{ type='uchar',					purename='succCopyFieldCount',	default='0', 	ver=2, 	desc='挑战成功的副本个数', },
				{ type='uint32',					purename='succCopyFields',	count='MAX_SUCC_COPYFIELD_CNT', refer='succCopyFieldCount',	ver=2, 	desc='挑战成功的副本id列表', },
				
				{ type='SFightTodayHonor',	purename='todayHonor',	ver=118, 	desc='今天的国战荣誉', },
			},
		},
		
		{
			type = 'struct',
			name = 'SInviteJoinAlliance',
			desc = '杂项结构',
			item = 
			{
				{ type='uint64', 	purename='allianceId', 	default='0', 	ver=15, 	desc='联盟id', },
				{ type='uint64', 	purename='roleId', 		default='0', 	ver=15, 	desc='邀请人id', },
			},
		},
		
		--跑商
		{
			type = 'struct',
			name = 'STradingArea',
			desc = '跑商结构',
			item = 
			{
				{ type='uint32', 	purename='stopTime', 	default='0', 				ver=16, 	desc='跑商停止时间', },
				{ type='int32', 	purename='count', 		default='0', 				ver=16, 	desc='目标个数', },
				{ type='uint64', 	purename='roleIds', 		count='MAX_TRADING_ROLES_CNT', refer='count',		ver=16, 	desc='目标角色id列表', },
				{ type='int32', 	purename='todayTimes', 		default='0', 				ver=24, 	desc='今天已跑的次数', },
				{ type='uint32', 	purename='refreshTime', 		default='0', 				ver=24, 	desc='刷新时间', },
				{ type='uint16', 	purename='curTimes', 		default='1', 				ver=112, 	desc='当前跑商的次数', },
			},
		},
		
		-- 千层塔
		{
			type = 'struct',
			name = 'SActTower',
			desc = '千层塔',
			item = 
			{
				{ type='uint32', 	purename='todayEnterTimes', 	default='0', 	ver=18, 	desc='当天进入的次数', },
				{ type='uint32', 	purename='todayRefreshTime', 	default='0', 	ver=18, 	desc='今天次数的刷新时间', },
				{ type='uint32', 	purename='maxLayer', 	default='0', 	ver=18, 	desc='当前玩家闯过的最高层', },
				{ type='uint32', 	purename='leftLifes', 	default='0', 	ver=18, 	desc='当前关卡剩余的生命', },
				{ type='uint32', 	purename='stopTime', 	default='0', 	ver=18, 	desc='战斗冷却的结束时间', },
				{ type='uint32', 	purename='curLayer', 	default='0', 	ver=18, 	desc='当前正在攻打的楼层', },
				{ type='uint32', 	purename='maxTime', 	default='0', 	ver=19, 	desc='通过最大层数时的时间', },
				{ type='uint32', 	purename='autoStartTime', 	default='0', 	ver=120, 	desc='自动挑战的开始时间', },
				{ type='uint16', 	purename='autoToLayer', 	default='0', 	ver=121, 	desc='自动挑战的上限层数', },
			},
		},
		
		-- 点将台关卡
		{
			type = 'struct',
			name = 'SActTerraceGate',
			desc = '点将台关卡',
			item = 
			{
				{ type='uint32', 	purename='gateId', 	default='0', 	ver=18, 	desc='关卡id', },
				{ type='uint32', 	purename='subGateId', 	default='0', 	ver=18, 	desc='子关卡id', },
			},
		},
		
		-- 点将台
		{
			type = 'struct',
			name = 'SActTerrace',
			desc = '点将台',
			item = 
			{
				{ type='uint32', 	purename='todayEnterTimes', 	default='0', 	ver=18, 	desc='当天进入的次数', },
				{ type='uint32', 	purename='todayRefreshTime', 	default='0', 	ver=18, 	desc='今天次数的刷新时间', },
				{ type='SActTerraceGate', 	purename='maxGate', ver=18, 	desc='当前玩家闯过的最高关卡', },
				{ type='uint32', 	purename='leftLifes', 	default='0', 	ver=18, 	desc='当前关卡剩余的生命', },
				{ type='uint32', 	purename='stopTime', 	default='0', 	ver=18, 	desc='战斗冷却的结束时间', },
				{ type='SActTerraceGate', 	purename='curGate', ver=18, 	desc='当前正在攻打的关卡', },
				{ type='int32', 	purename='countResults',  default='0', 	 ver=18, 	desc='通过了的关卡的评价列表大小', },
				{ type='uint8', 	purename='results', count='MAX_ACT_TERRACE_COUNT', refer='countResults', ver=18, 	desc='评价列表', },
				{ type='uint32', 	purename='autoStartTime', 	default='0', 	ver=120, 	desc='自动挑战的开始时间', },
				{ type='uint16', 	purename='autoToSubGateId', 	default='0', 	ver=121, 	desc='自动挑战的上限子关', },
			},
		},
		
		{
			type = 'struct',
			name = 'SForceLineupCfg',
			desc = '武将布局阵型保存结构',
			item = 
			{
				{ type='uint32', 	purename='type', 		default='0', 				ver=29, 	desc='类型', },
				{ type='uint32', 	purename='lineup', 		default='0', 				ver=29, 	desc='阵型', },
				{ type='int8', 	purename='heroCount', 		default='0', 				ver=29, 	desc='武将个数', },
				{ type='uint64', 	purename='heroIds', count='MAX_TEAM_HERO_CNT', refer='heroCount', ver=29, 	desc='武将id列表', },
			},
		},
		
		{
			type = 'struct',
			name = 'SHelpTip',
			desc = '新手帮助提示',
			item = 
			{
				{ type='uint32', 	purename='id', 		default='0', 				ver=127, 	desc='id', },
				{ type='uint8', 	purename='times', 		default='0', 				ver=127, 	desc='已经提示的次数', },
			},
		},
		
		{
			type = 'struct',
			name = 'SPlayerClientCfg',
			desc = '玩家客户端的配置',
			item = 
			{
				{ type='int8', 	purename='forceCount', 		default='0', 				ver=29, 	desc='武将布局个数', },
				{ type='SForceLineupCfg', 	purename='forces', count='MAX_FORCELINEUPCFG_CNT', refer='forceCount', ver=29, 	desc='武将布局', },
				{ type='uint8', 	purename='toggleMap', 		count='MAX_CTLCFG_BTIMAP_CNT', 		ver=107, 	desc='客户端的一些开关bit位', },
				{ type='int32', 	purename='gonggaoVer', 		default='0', ver=119, 	desc='最近一次玩家看到的公告版本号', },
				{ type='int16', purename='helpTipCount', default='0', ver=127, desc='新手帮助tip的个数'},
				{ type='SHelpTip', purename='helpTips', count='MAX_HELPTIP_CNT', refer='helpTipCount', ver=127, desc='新手帮助tipid的列表', },
			},
		},
		
		{
			type = 'struct',
			name = 'SBuyLimitItem',
			desc = '购买受限的道具',
			item = 
			{
				{ type='uint32', 	purename='resId', 		default='0', 				ver=106, 	desc='道具id', },
				{ type='uint32', 	purename='number', 		default='0', 				ver=106, 	desc='个数', },
			},
		},
		
		--vip结构
		{
			type = 'struct',
			name = 'SVip',
			desc = 'vip功能',
			item = 
			{
				{ type='uint8',	purename='level',	default='0', ver=110, 	desc='等级', },
			},
		},

		-- cd key
		{
			type = 'struct',
			name = 'SCDKey',
			desc = 'cd key',
			item = 
			{
				{ type='int32',	purename='count', default='0', ver=115, 	desc='已领过的cdkey', },
				{ type='int16',	purename='types', count='MAX_CDKEY_CNT', refer='count', ver=115,	desc='已经领过的type', },
			},
		},
		
		--杂项结构
		{
			type = 'struct',
			name = 'SMiscs',
			desc = '杂项结构',
			item = 
			{
				{ type='SPlayerClientCfg',	purename='clientCfg',	 ver=29, 	desc='玩家客户端的配置', },
				{ type='string',		purename='applyAlliance',	count='MAX_ALLINAME_ARR_LEN',	ver=15, 	desc='正在申请的联盟名', },
				{ type='uchar',		purename='inviteJoinAllianceCount',	default='0', 	ver=15, 	desc='邀请我加入联盟的个数', },
				{ type='SInviteJoinAlliance',	purename='inviteJoinAlliances',	count='MAX_INVITE_JOIN_ALLI_CNT', refer='inviteJoinAllianceCount',	ver=15, 	desc='邀请我加入联盟的列表', },
				{ type='STradingArea',	purename='trading',	 ver=16, 	desc='跑商结构', },
				{ type='SActTower',	purename='actTower',	 ver=18, 	desc='千层塔', },
				{ type='SActTerrace',	purename='actTerrace',	 ver=18, 	desc='点将台', },
				
				{ type='uint32',	purename='buyLimitTime', default='0', ver=106, 	desc='购买受限道具的时间', },
				{ type='int32',	purename='buyLimitCount',	 default='0', ver=106, 	desc='购买受限道具的个数', },
				{ type='SBuyLimitItem',	purename='buyLimitItems',	 count='MAX_BUY_ITEMS_CNT', 	refer='buyLimitCount', ver=106, 	desc='购买受限的道具', },
				{ type='SVip',	purename='vip', ver=110, 	desc='vip功能', },
				{ type='SCDKey',	purename='cdkey', ver=115, 	desc='cd key', },
			},
		},
		
		--所有士兵列表结构
		{
			type = 'struct',
			name = 'SSoldierList',
			desc = '所有士兵列表结构',
			item = 
			{
				{ type='uchar',		purename='count',		default='0', 										ver=1, 	desc='士兵类型个数', },
				{ type='SSoldier',	purename='soldiers',		count='MAX_SLDS_CNT', refer='count',	ver=1, 	desc='士兵类型具体内容', },
			},
		},
		
		--单个英雄携带士兵结构
		{
			type = 'struct',
			name = 'SCarrySoldier',
			desc = '单个英雄携带士兵结构',
			item = 
			{
				{ type='uint32',		name='ResId',				default='0', 							ver=1, 	desc='士兵资源ID', },
				{ type='uint32',		name='Number',			default='0', 							ver=1, 	desc='士兵个数', },
			},
		},
		
		--所有英雄携带士兵列表结构
		{
			type = 'struct',
			name = 'SCarrySoldierList',
			desc = '所有英雄携带士兵列表结构',
			item = 
			{
				{ type='uchar',			name='Count',		default='0', 							ver=1, 	desc='士兵类型个数', },
				{ type='SCarrySoldier',	name='Soldiers',	count='MAX_SLDS_CNT', refer='Count',	ver=1, 	desc='士兵类型具体内容', },
			},	
		},
		
		--英雄属性值列表
		{
			type = 'struct',
			name = 'SHeroAttrList',
			desc = '英雄属性值列表',
			item = 
			{
				{ type='uchar',		name='Count',		default='0', 	ver=1, 			desc='属性个数', },
				{ type='SAttr',		name='Attrs',		count='MAX_HEROATTRS_CNT', 	refer='Count',	ver=1,	desc='属性值', },
			},
		},
		
		--道具属性值列表
		{
			type = 'struct',
			name = 'SItemAttrList',
			desc = '道具属性值列表',
			item = 
			{
				{ type='uchar',		name='Count',		default='0', 													ver=1, 	desc='属性个数', },
				{ type='SAttr',		name='Attrs',		count='MAX_ITEM_ATTRS_CNT', 	refer='Count',	ver=1,	desc='属性值', },
			},
		},
		
		--镶嵌宝石列表
		{
			type = 'struct',
			name = 'SGemBesetList',
			desc = '镶嵌宝石列表',
			item = 
			{
				{ type='uchar',	name='Count',		default='0', 													ver=3, 	desc='宝石个数', },
				{ type='uint32',	name='Gems',		count='MAX_GEMBESET_CNT', 	refer='Count',		ver=3,	desc='宝石resid列表', },
			},
		},
		
		--道具
		{
			type = 'struct',
			name = 'SItem',
			desc = '道具（包括普通物品、装备、宝石等）',
			item = 
			{
				{ type='uint64',				name='Id',				default='0', 	ver=1,		desc='道具ID', },
				{ type='uchar',				name='Type',			default='0', 	ver=1, 		desc='道具类型', },
				{ type='uint32',				name='ResId',			default='0', 	ver=1,		desc='道具资源ID', },
				{ type='ushort',				name='Number',		default='0', 	ver=1, 		desc='道具堆叠个数', },
				{ type='uchar',				name='ForceLevel',	default='0', 	ver=3, 		desc='强化等级', },
				{ type='SItemAttrList',		name='Attrs', 								ver=1, 		desc='属性列表', },
				{ type='SGemBesetList',	name='Gems', 								ver=3, 		desc='宝石列表', },
			},
		},
		
		--道具属性值列表(新)
		{
			type = 'struct',
			name = 'SItemAttrListEx',
			desc = '道具属性值列表',
			item = 
			{
				{ type='uchar',		purename='count',		default='0', 													ver=1, 	desc='属性个数', },
				{ type='SAttrEx',	purename='attrs',			count='MAX_ITEM_ATTRS_CNT', 	refer='count',	ver=1,	desc='属性值', },
			},
		},
		
		--镶嵌宝石列表(新)
		{
			type = 'struct',
			name = 'SGemBesetListEx',
			desc = '镶嵌宝石列表',
			item = 
			{
				{ type='uchar',	purename='count',		default='0', 													ver=3, 	desc='宝石个数', },
				{ type='uint32',	purename='gems',		count='MAX_GEMBESET_CNT', 	refer='count',	ver=3,	desc='宝石resid列表', },
			},
		},
		
		--道具(新)
		{
			type = 'struct',
			name = 'SItemEx',
			desc = '道具（包括普通物品、装备、宝石等）',
			item = 
			{
				{ type='uint64',					purename='id',				default='0', 	ver=1,		desc='道具ID', },
				{ type='uchar',					purename='type',			default='0', 	ver=1, 		desc='道具类型', },
				{ type='uchar',					purename='isRaw',		default='0', 	ver=5, 		desc='道具是否已被鉴定', },
				{ type='uchar',					purename='isBind',		default='0', 	ver=6, 		desc='道具是否已绑定', },
				{ type='uint32',					purename='resId',			default='0', 	ver=1,		desc='道具资源ID', },
				{ type='ushort',					purename='number',		default='0', 	ver=1, 		desc='道具堆叠个数', },
				{ type='uchar',					purename='forceLevel',	default='0', 	ver=3, 		desc='强化等级', },
				{ type='SItemAttrListEx',		purename='attrs', 							ver=1, 		desc='属性列表', },
				{ type='SGemBesetListEx',	purename='gems', 							ver=3, 		desc='宝石列表', },
			},
		},
		
		--穿戴装备
		{
			type = 'struct',
			name = 'SWear',
			desc = '穿戴装备',
			item = 
			{
				{ type='uchar',				purename='armPos',		default='0', 	ver=1,	desc='装备位置', },
				{ type='SItemEx',			purename='arm',								ver=1,	desc='装备', },
			},
		},
		
		--穿戴装备列表
		{
			type = 'struct',
			name = 'SWearList',
			desc = '穿戴装备列表',
			item = 
			{
				{ type='uchar',		purename='count',		default='0', 	ver=1, 			desc='装备个数', },
				{ type='SWear',		purename='wears',		count='MAX_HEROWEAR_CNT', 	refer='count',	ver=1,	desc='装备', },
			},
		},
		
		--道具列表结构
		{
			type = 'struct',
			name = 'SItemListEx',
			desc = '道具列表结构',
			item = 
			{
				{ type='ushort',			purename='count',		default='0', 									ver=4, 	desc='道具格子数', },
				{ type='SItemEx',		purename='items',		count='MAX_ITEMS_CNT', refer='count',	ver=4, 	desc='道具列表的具体内容', },
			},
		},	
		
		--角色身上所有的道具
		{
			type = 'struct',
			name = 'SAllItems',
			desc = '角色身上所有的道具',
			item = 
			{
				{ type='uint32',			name='GiftGold',		ver=1, 	default='0',		desc='礼金卷', },
				{ type='uint32',			name='Gold',			ver=1, 	default='0',		desc='金币', },
				{ type='ushort',			name='GridMaxCnt',	ver=1, 	default='0',		desc='格子最大数', },
				{ type='SItemListEx',	name='Items',			ver=4, 						desc='背包中的物品', },
				{ type='uint32',			purename='lastSalveTime',		ver=14, 	default='0',		desc='最近一次刷新药膏的时间', },
			},
		},
		
		--技能
		{
			type = 'struct',
			name = 'SSkill',
			desc = '技能',
			item = 
			{
				{ type='uint32',		name='ResId',			default='0', 	ver=1, 			desc='技能资源ID', },
				{ type='uchar',		name='Level',		default='0', 	ver=1, 			desc='技能等级', },
				{ type='uint32',		name='Dex',		default='0', 	ver=1, 			desc='当前的熟练度', },
			},
		},
		
		--技能列表
		{
			type = 'struct',
			name = 'SSkillList',
			desc = '技能列表',
			item = 
			{
				{ type='uchar',		name='Count',		default='0', 	ver=1, 			desc='技能个数', },
				{ type='SSkill',		name='Skills',		count='MAX_HERO_SKILL_CNT', 	refer='Count',	ver=1,	desc='技能', },
			},
		},
		
		--道具快捷
		{
			type = 'struct',
			name = 'SSCut',
			desc = '道具快捷',
			item = 
			{
				{ type='uchar',		name='CutPos',	default='0', 	ver=1, 			desc='道具快捷位置', },
				{ type='uint32',		name='ResId',		default='0', 	ver=1, 			desc='关联的道具资源id', },
			},
		},
		
		--道具快捷列表
		{
			type = 'struct',
			name = 'SSCutList',
			desc = '道具快捷列表',
			item = 
			{
				{ type='uchar',		name='Count',		default='0', 	ver=1, 			desc='快捷个数', },
				{ type='SSCut',		name='SCuts',		count='MAX_HERO_SCUT_CNT', 	refer='Count',	ver=1,	desc='快捷', },
			},
		},
		
		--英雄修炼结构
		{
			type = 'struct',
			name = 'OSHeroSteel',
			desc = '英雄修炼结构',
			item = 
			{
				{ type='uchar',		name='SteelType',		default='0', 	ver=1, 			desc='修炼类型', },
				{ type='uint32',		name='StartTime',		default='0', 	ver=1, 			desc='开始修炼时间（单位秒）', },
				{ type='uint32',		name='LastTime',			default='0', 	ver=1, 			desc='最近一次计算更新的修炼时间（单位秒）', },
				{ type='uchar',		name='Hours',				default='0', 	ver=1, 			desc='修炼的小时数', },
				{ type='uint64',		name='Exp',				default='0', 	ver=1, 			desc='已经获得的经验', },
				{ type='uint32',		name='TakeGold',			default='0', 	ver=1, 			desc='已经获得的经验', },
			},
		},
		
		--英雄修炼结构
		{
			type = 'struct',
			name = 'SHeroSteel',
			desc = '英雄修炼结构',
			item = 
			{
				{ type='uchar',		purename='steelType',		default='0', 	ver=12, 			desc='修炼类型', },
				{ type='uint32',		purename='startTime',		default='0', 	ver=12, 			desc='开始修炼时间（单位秒）', },
				{ type='uchar',		purename='quarters',			default='0', 	ver=12, 			desc='修炼的15分钟数', },
				{ type='uint32',		purename='quarterRes',		default='0', 	ver=12, 			desc='一刻钟可获得的经验', },
				{ type='uint32',		purename='quarterMoney',	default='0', 	ver=12, 			desc='一刻钟消耗的钱币', },
				{ type='uint32',		purename='hourGold',		default='0', 	ver=12, 			desc='一小时消耗的金币', },
				{ type='uchar',		purename='actMult',		default='1', 	ver=103, 		desc='活动加成的倍数', },
			},
		},
		
		--英雄结构
		{
			type = 'struct',
			name = 'SOHero',
			desc = '英雄结构',
			item = 
			{
				{ type='uint64',					name='Id',			default='0', 								ver=1, 		desc='英雄Id', },
				{ type='uint32',					name='ResId',		default='0', 								ver=1, 		desc='英雄ResId', },
				{ type='string',					name='Name',		count='MAX_HERONAME_ARR_LEN',	ver=1, 		desc='英雄名', },
				{ type='uchar', 					name='Level', 		default='0', 								ver=1, 		desc='英雄等级', },
				{ type='uint32', 					name='Exp', 		default='0', 								ver=1, 		desc='英雄经验', },
				{ type='uchar', 					name='State', 		default='0', 								ver=1, 		desc='英雄状态', },
				{ type='uint32', 					name='CityId', 	default='0', 								ver=1, 		desc='英雄当前所在城市id', },
				{ type='uint32', 					name='CityPosX', default='0', 									ver=1, 		desc='英雄当前所在城市水平坐标', },
				{ type='uint32', 					name='CityPosY', default='0', 									ver=1, 		desc='英雄当前所在城市垂直坐标', },
				{ type='uint8', 					name='Subjects', count='MAX_SUBJECT_CNT',			ver=1, 		desc='英雄兵科列表', },
				{ type='SCarrySoldierList',	name='Soldiers', 													ver=1, 		desc='携带的士兵列表', },
				{ type='SHeroAttrList',			name='Attrs', 														ver=1, 		desc='属性列表', },
				{ type='SWearList',				name='Wears', 													ver=1, 		desc='穿戴装备列表', },
				{ type='SSkillList',				name='Skills', 														ver=1, 		desc='技能列表', },
				{ type='SSCutList',				name='SCuts', 													ver=1, 		desc='道具快捷列表', },
				{ type='SHeroSteel',			name='Steel', 														ver=1, 		desc='英雄修炼', },
			},
		},
		
		--英雄技能修炼结构
		{
			type = 'struct',
			name = 'SSkillSteel',
			desc = '英雄技能修炼结构',
			item = 
			{
				{ type='uint32',					name='ResId',		default='0', 								ver=1, 		desc='技能ResId', },
				{ type='uint32',					name='Stoptime',		default='0', 								ver=1, 		desc='技能修炼结束时刻', },
				{ type='uint32',					name='Durtime',		default='0', 								ver=1, 		desc='技能修炼的时长，单位小时', },
			},
		},
		
		--英雄结构
		{
			type = 'struct',
			name = 'SHero',
			desc = '英雄结构',
			item = 
			{
				{ type='uint64',					name='Id',					default='0', 								ver=1, 	desc='英雄Id', },
				{ type='uchar',					name='Prof',				default='0', 								ver=1, 	desc='英雄职业', },
				{ type='string',					name='Name',				count='MAX_HERONAME_ARR_LEN',	ver=1, 	desc='英雄名', },
				{ type='uchar', 					name='Level', 				default='0', 								ver=1, 	desc='英雄等级', },
				{ type='uchar', 					name='SkeletonLevel',	default='0', 								ver=1, 	desc='英雄脉络等级', },
				{ type='uint32', 					name='SSteelStopTime',default='0', 								ver=1, 	desc='英雄修炼结束时间', },
				{ type='uint32', 					name='Icon', 				default='0', 								ver=1, 	desc='英雄头像', },
				{ type='uchar', 					name='Sex', 				default='0', 								ver=1, 	desc='英雄性别', },
				{ type='uchar', 					name='State', 				default='0', 								ver=1, 	desc='英雄状态', },
				{ type='uchar', 					name='Official', 			default='0', 								ver=1, 	desc='英雄官职', },
				{ type='uchar', 					name='LockState', 		default='0', 								ver=1, 	desc='锁定状态', },
				{ type='uint32', 					name='UnlockTime', 		default='0', 								ver=1, 	desc='解锁到期时间', },
				{ type='uchar', 					name='Subjects', 		count='MAX_SUBJECT_CNT',			ver=1, 	desc='英雄兵科列表', },
				{ type='SHeroAttrList',		name='Attrs', 																ver=1, 	desc='属性列表', },
				{ type='SSoldier',				name='Soldier', 															ver=1, 	desc='携带的士兵', },
				{ type='SWearList',			name='Wears', 															ver=1, 	desc='穿戴装备列表', },
				{ type='SSkillList',				name='Skills', 																ver=1, 	desc='技能列表', },
				{ type='uint32',					name='CurTacticSkill', 	default='0',									ver=1, 	desc='当前装备的战略技能', },
				{ type='SHeroSteel',			name='Steel', 																ver=1, 	desc='英雄修炼', },
				{ type='SSkillSteel',			name='SkillSteel', 														ver=1, 	desc='英雄技能修炼', },
			},
		},
		
		--酒馆中的英雄
		{
			type = 'struct',
			name = 'SNewHero',
			desc = '酒馆中的英雄',
			item = 
			{
				{ type='uint32',			name='Id',				default='0', 															ver=1, 	desc='Id', },
				{ type='uchar',			name='Prof',			default='0', 															ver=1, 	desc='英雄职业', },
				{ type='string',			name='Name',			count='MAX_HERONAME_ARR_LEN',								ver=1, 	desc='英雄名', },
				{ type='uchar', 			name='Level', 			default='0', 															ver=1, 	desc='英雄等级', },
				{ type='uint32', 			name='Icon', 			default='0', 															ver=1, 	desc='英雄头像', },
				{ type='uchar', 			name='Sex', 			default='0', 															ver=1, 	desc='英雄性别', },
				{ type='uchar',			name='AttrCount',	default='0', 															ver=1, 	desc='属性个数', },
				{ type='SAttr',			name='Attrs',			count='MAX_NEWHEROATTRS_CNT', 	refer='AttrCount',	ver=1,	desc='属性值', },
			},
		},
		
		--英雄列表结构 
		{
			type = 'struct',
			name = 'SHeroList',
			desc = '英雄列表结构',
			item = 
			{
				{ type='uint32',		name='HeroAttrLastTime',	default='0', 													ver=1, 	desc='英雄属性刷新的上次时间', },
				{ type='uchar',		name='Count',					default='0', 													ver=1, 	desc='英雄个数', },
				{ type='SHero',		name='Heros',					count='MAX_HERO_CNT', refer='Count',				ver=1, 	desc='英雄具体内容', },
				{ type='uint32',		name='CanUseSSTime',		default='0', 													ver=1, 	desc='可使用的技能修炼时间', },
				{ type='uint32',		name='NewHeroLastTime',	default='0', 													ver=1, 	desc='酒馆中英雄刷新的上次时间', },
				{ type='uchar',		name='NewCount',			default='0', 													ver=1, 	desc='酒馆中英雄个数', },
				{ type='SNewHero',	name='NewHeros',			count='MAX_NEWHERO_CNT', refer='NewCount',	ver=1, 	desc='酒馆中英雄具体内容', },
			},	
		},
		
		--战报结构
		{
			type = 'struct',
			name = 'SBulletin',
			desc = '战报结构',
			item = 
			{
			},
		},
		
		-- 战报结构列表
		{
			type = 'struct',
			name = 'SBulletinList',
			desc = '战报结构列表',
			item = 
			{
				{ type='uchar',		name='Count',		default='0', 								ver=1, 	desc='战报个数', },
				{ type='SBulletin',	name='Bulletins',	count='MAX_BULLETINS_CNT', refer='Count',	ver=1, 	desc='战报具体内容', },
			},	
		},
		
		--好友结构
		{
			type = 'struct',
			name = 'SBuddy',
			desc = '好友结构',
			item = 
			{
				{ type='uchar',		purename='flag',		default='0',	ver=1, 	desc='好友类型标志', },
				{ type='uint64',		purename='roleId',	default='0',	ver=1, 	desc='角色id', },
			},
		},
		
		-- 好友结构列表
		{
			type = 'struct',
			name = 'SBuddyList',
			desc = '好友结构列表',
			item = 
			{
				{ type='ushort',	purename='count',				default='0', 										ver=1, 	desc='好友个数', },
				{ type='SBuddy',	purename='buddys',				count='MAX_BUDDYS_CNT', 			refer='count',	ver=1, 	desc='好友具体内容', },
				{ type='ushort',	purename='applyCount',		default='0', 										ver=1, 	desc='申请个数', },
				{ type='uint64',	purename='applyRoleIds',	count='MAX_BUDDYS_APPLY_CNT', 	refer='applyCount',	ver=1, 	desc='申请列表', },
			},
		},
		
		-- 农场结构列表
		{
			type = 'struct',
			name = 'SFarm',
			desc = '农场结构',
			item = 
			{
				{ type='uint32',	name='Id',							default='0', 				ver=1, 	desc='农场位置Id', },
				{ type='uint32',	name='ResId',						default='0', 				ver=1, 	desc='农场资源Id', },
				{ type='uchar',	name='Level',						default='1', 				ver=1, 	desc='资源等级', },
				{ type='uchar',	name='State',						default='0', 				ver=1, 	desc='资源成长状态', },
				{ type='uint32',	name='StartTime',					default='0', 				ver=1, 	desc='资源成长的起始时间', },
				{ type='uint32',	name='StopTime',					default='0', 				ver=1, 	desc='资源何时成长完成', },
				{ type='uint32',	name='TotalRes',					default='0', 				ver=1, 	desc='资源成长完成后可采集的总的数量', },
				{ type='uint32',	name='LeftRes',						default='0', 				ver=1, 	desc='资源成长完成后可采集的剩余的数量', },
				{ type='uchar',	purename='collectorCount',	default='0', 				ver=9, 	desc='采集者数量', },
				{ type='uint64',	purename='collectors',			count='MAX_COLLECTOR_CNT', 	refer='collectorCount', ver=9, desc='采集者id列表', },
				{ type='uint32',	purename='seqId',				default='0', 				ver=100, 	desc='农场资源seqId', },				
				{ type='uint32',	purename='protectStopTime',				default='0', 				ver=110, 	desc='农场资源seqId', },				
			},
		},
		
		-- 农场记录结构列表
		{
			type = 'struct',
			name = 'SFarmLog',
			desc = '农场记录结构',
			item = 
			{
				{ type='uchar',	name='Type',		default='0', 								ver=1, 	desc='记录类型', },
				{ type='string',	name='RName',	count='MAX_ROLENAME_ARR_LEN',	ver=1, 	desc='角色名', },
				{ type='uint32',	name='LogTime',	default='0', 								ver=1, 	desc='记录日志的时间', },
				{ type='uint32',	name='Param1',	default='0', 								ver=1, 	desc='记录参数1', },
				{ type='uint32',	name='Param2',	default='0', 								ver=1, 	desc='记录参数2', },
				{ type='uint32',	name='Param3',	default='0', 								ver=1, 	desc='记录参数3', },
				{ type='uint32',	name='Param4',	default='0', 								ver=1, 	desc='记录参数4', },
			},
		},
		
		-- 农场结构列表
		{
			type = 'struct',
			name = 'SFarmList',
			desc = '农场结构列表',
			item = 
			{
				{ type='uchar',			name='Count',			default='0', 													ver=1, 	desc='农场个数', },
				{ type='SFarm',			name='Farms',			count='MAX_FARM_CNT', 			refer='Count',		ver=1, 	desc='农场具体内容', },
				
				{ type='uint32',			name='LogVer',			default='0', 													ver=1, 	desc='记录块的版本号', },
				{ type='uchar',			name='LogCount',		default='0', 													ver=1, 	desc='农场操作记录个数', },
				{ type='SFarmLog',	name='FarmLogs',		count='MAX_FARM_LOG_CNT', 	refer='LogCount',	ver=1, 	desc='农场具体记录', },
				
				{ type='uint32',			purename='farmVer',	default='0', 													ver=9, 	desc='农场的版本号', },
				{ type='uint32',			purename='lastSeqId',	default='0', 													ver=100, 	desc='地块最后一次的seqId', },
			},
		},
		
		-- 科技
		{
			type = 'struct',
			name = 'SCulture',
			desc = '科技',
			item = 
			{
				{ type='uchar',		purename='level',		default='0', 													ver=1, 	desc='科技等级', },
				{ type='uint32',		purename='id',			default='0', 													ver=1, 	desc='科技资源id', },
			},
		},
		
		--正在研究的科技
		{
			type = 'struct',
			name = 'SLearningCulture',
			desc = '正在研究的科技',
			item = 
			{
				{ type='uint32',		purename='id',				default='0', 													ver=1, 	desc='科技id', },
				{ type='uint32',		purename='stoptime',	default='0', 													ver=1, 	desc='停止时间', },
			},
		},
		
		-- 科技列表
		{
			type = 'struct',
			name = 'SCultures',
			desc = '科技列表',
			item = 
			{
				{ type='uchar',					purename='count',			default='0', 													ver=1, 	desc='科技个数', },
				{ type='SCulture',				purename='cultures',			count='MAX_CULTURE_CNT', 		refer='count',		ver=1, 	desc='科技具体内容', },
				{ type='SLearningCulture',	purename='learning',																				ver=1, 	desc='正在研究的科技', },
			},
		},
		
		----------------------------------
		-- SDBVar 的定义
		----------------------------------
		{
			type = 'struct',
			name = 'SDBVar',
			binddb = 'roles',
			desc = '需持久化保存的角色数据',
			item = 
			{
				{ type='uint64',			name='RoleId',		default='0', 								dbfield='roleid',		dbupd='key',		ver=1, 		desc='角色唯一id', },
				{ type='string',			name='UName',	count='MAX_USERNAME_ARR_LEN',	dbfield='uname',		dbupd='',		ver=1, 		desc='用户名', },
				{ type='string',			name='RName',	count='MAX_ROLENAME_ARR_LEN',	dbfield='rname',		dbupd='',		ver=1, 		desc='角色名', },
				{ type='uchar',			name='Sex',		default='0', 								dbfield='sex',			dbupd='',		ver=1, 		desc='性别', },
				{ type='SFixVar',			name='FixVar',														dbfield='bfixvars',		dbupd='val',		ver=1, 		desc='持久不变的属性', },
				{ type='SBaseInfo',		name='BInfos',														dbfield='bbinfos',		dbupd='val',		ver=1, 		desc='角色的一些基础属性', },
				{ type='SHeroList',		name='Heros',														dbfield='bheros',		dbupd='val',		ver=1, 		desc='英雄列表', },
				{ type='SSoldierList',	purename='soldiers',												dbfield='bsoldiers',	dbupd='val',		ver=1, 		desc='士兵列表', },
				{ type='SCitys',			name='Citys',														dbfield='bcitys',		dbupd='val',		ver=1, 		desc='城市列表', },
				{ type='SFarmList',		name='Farms',														dbfield='bfarms',		dbupd='val',		ver=1, 		desc='农场列表', },
				{ type='SCultures',		purename='cultures',												dbfield='bcultures',	dbupd='val',		ver=1, 		desc='科技列表', },
				{ type='SAllItems',		name='Items',														dbfield='bitems',		dbupd='val',		ver=1, 		desc='道具列表', },
				{ type='SStateList',		purename='states',												dbfield='bbuffs',		dbupd='val',		ver=1, 		desc='buff列表', },
				{ type='SMilitary',		purename='military',												dbfield='bmilitary', 	dbupd='val',		ver=1, 		desc='军事信息', },
				{ type='STaskList',		purename='tasks',														dbfield='btasks',		dbupd='val',		ver=1, 		desc='任务列表', },
				{ type='SBulletinList',	name='Bulletins',													dbfield='bbulletins',	dbupd='val',		ver=1, 		desc='战报列表', },
				{ type='SBuddyList',	purename='buddys',												dbfield='bbuddys', 	dbupd='val',		ver=1, 		desc='好友列表', },
				{ type='SMiscs',			name='Miscs',														dbfield='bmiscs',		dbupd='val',		ver=1, 		desc='杂项结构', },
				{ type='uint32',			purename='regTime',		default='0', 						dbfield='regtime',			dbupd='',		ver=23, 		desc='角色创建时间', },
				{ type='uint32',			purename='lockToTime',		default='0', 				dbfield='locktotime',		dbupd='val',		ver=114, 	desc='封号截止时间', },
			},
		},
		

		----------------------------------
		-- SDBAlliVar 的定义
		----------------------------------
		{
			type = 'struct',
			name = 'SDBAlliVar',
			binddb = 'alliances',
			desc = '需持久化保存的联盟数据',
			item = 
			{
				{ type='uint64',		name='allianceId',		default='0', 									dbfield='allianceId', dbupd='key',		ver=1, 		desc='联盟唯一id', },
			},
		},
	},
	
	--一些const字符串的输出
	const_str = 
	{
		{
			name = 'sc_lpszLoginSql',
			str = 'select * from roles where uname=\'%s\';',
		},
		
		{
			name = 'sc_lpszGetLastRoleAutoId',
			str = 'select id from roles order by id desc limit 1;',
		},
		
		{
			name = 'sc_lpszFindRoleNameExist',
			str = 'select id from roles where rname=\'%s\';',
		},
		
		{
			name = 'sc_lpszFindUserNameExist',
			str = 'select id from roles where uname=\'%s\';',
		},
		
		{
			name = 'sc_lpszGetAlliById',
			str = 'select id from alliances where uid=%I64u;',
		},
	},
	
	--操作数据库函数
	outfun={
		{
			dbtablename='roles', 
			vardef='SDBVar*', 
			funname={getvar='RoleVarInitRoleFromDB', 
				convertvar='VarConvertRoleFieldToBlob', 
				updatevar='VarUpdateRoleIntoDB', 
				insertvar='VarInsertRoleIntoDB'}
		},
		{
			dbtablename='alliances', 
			vardef='SDBAlliVar*', 
			funname={getvar='AlliVarInitAlliFromDB', 
				convertvar='VarConvertAlliFieldToBlob', 
				updatevar='VarUpdateAlliIntoDB', 
				insertvar='VarInsertAlliIntoDB'}
		},
	},
}

--独立运行
if package.loaded['role_define'] == nil then
	require('lua_tool.tools_h')
	output_h(g_role, g_dbtb)
end