
//<newIDFun>

/** 使用对象 */
RES_TRG = {
	'NONE' : 0				// 无定义
	,'SELF_DEF_BUILDING' : 1	// 自己的正在建造的城防
	,'SELF_DEF_BUILDED' : 2		// 自己的已经建造的城防
	,'SELF_HERO' : 3			// 自己的英雄
	,'SELF_SOLDIER' : 4		// 自己的士兵的
	
	,'FRIEND_DEF_BUILDING' : 5	// 友方的正在建造的城防
	,'FRIEND_DEF_BUILDED' : 6	// 友方的已经建造的城防
	,'FRIEND_HERO' : 7		// 友方的英雄
	,'FRIEND_SOLDIER' : 8		// 友方的士兵
	
	,'ENEMY_DEF_BUILDING' : 9	// 敌方的正在建造的城防
	,'ENEMY_DEF_BUILDED' : 10	// 敌方的已经建造的城防
	,'ENEMY_HERO' : 11		// 敌方的英雄
	,'ENEMY_SOLDIER' : 12		// 敌方的士兵
	
	,'SELF_ARMY' : 13			// 自己的军队
	,'ALLI_ARMY' : 14			// 联盟的军队
	,'ENEMY_ARMY' : 15		// 敌放的军队
	
	,'LEARNING_CULTURE' : 16	// 自己的正在研究的国学
	,'MAKING_WEAPONRY' : 17	// 自己的正在锻造的武器
	,'BUILDING_OBUILD' : 18		// 自己的正在建造的外城建筑
	,'BUILDING_IBUILD' : 19		// 自己的正在建造的内城建筑
	,'RECRUITING_SOLDIER' : 20	// 自己的正在招募的士兵
	,'OBUILD' : 21			// 自己的已建好的外城建筑
	,'IBUILD' : 22			// 自己的已建好的内城建筑 
	,'OBUILDRES' : 23			// 自己的外城资源
	,'ADDARMGRID' : 24		// 增加装备栏格子数
	,'MORALE' : 25			// 增加装备栏格子数
	,'POPU' : 26				// 增加装备栏格子数
	,'GOLD' : 27				// 增加装备栏格子数
	
	,'MYCITY' : 28			// 我的城池
	,'ALLICITY' : 29			// 联盟城池
	,'ENEMYCITY' : 30			// 对方城池
	
	,'FARM' : 31				// 自己的农田
	,'TIMBERYARD' : 32		// 自己的木场
	,'QUARRY' : 33			// 自己的石场
	,'IRONORE' : 34			// 自己的铁场
	
	,'SELF_ROLE' : 35			// 自己的君主
	
	,'SELF_NEWHEROS' : 36 //酒馆英雄
	
	,'MAX' : 1000
};

G_EID = 0;
ATTR = {
	'NONE' : G_EID++,	// 无
	'LVL' : G_EID++,		// (Level)等级
	//<<attr1>>
	'XP' : G_EID++,		// (Experience)经验值
	'NXP' : G_EID++,		// (Next experience)升到下级需要的经验值
	'PS' : G_EID++,		// (physical strength)体力
	'MPS' : G_EID++,		// 最大体力
	'AN' : G_EID++,		// (Angry)愤怒
	'MAN' : G_EID++,		// 最大愤怒
	'MO' : G_EID++,		// (morale)士气
	'MMO' : G_EID++,		// 最大士气
	'HEALTH' : G_EID++, 	// 当前健康度
	'MHEALTH' : G_EID++,// 最大健康度
	'IF' : G_EID++,			// ( inner force)内功
	'MIF' : G_EID++,		// ( max inner force)内功的上限
	'STP' : G_EID++, 		// 当前的计谋点
	'MSTP' : G_EID++, 	// 最大的计谋点
	'AF' : G_EID++,			// 当前兵力
	'MAF' : G_EID++,		// 最大兵力
	'XPS' : G_EID++,		// 经验池当前值
	'MXPS' : G_EID++,	//  经验池最大值
	
	//<<attr2>>
	'IN_B' : G_EID++,		// (Interior)内政
	'IN_A' : G_EID++,		// (Interior)内政
	'FOR_B' : G_EID++,	// 武力force
	'FOR_A' : G_EID++,	// 武力force
	'BR_B' : G_EID++,		// 智力brains
	'BR_A' : G_EID++,		// 智力brains
	
	'PH_B' : G_EID++,		// (Physical)体质(根骨)
	'PH_A' : G_EID++,		// (Physical)体质(根骨)
	'ST_B' : G_EID++,		// (strength)力量
	'ST_A' : G_EID++,		// (strength)力量
	'AG_B' : G_EID++,		//(Agile)敏捷
	'AG_A' : G_EID++,		//(Agile)敏捷
	
	'PP' : G_EID++,			//(Potential point)潜力点
	
	//<<attr3>>
	'CRE' : G_EID++,		// (Credit)武勋
	'CO' : G_EID++,		// (Command)统率
	'HI' : G_EID++,			// (Hit)命中
	'HU' : G_EID++,		// (Hurt)攻击伤害
	'DE' : G_EID++,		// (Defense)防御
	'SP' : G_EID++,		// (speed)速度
	'ES' : G_EID++,		// (Escape)闪避
	'BER' : G_EID++, 		// (Berserk attack percentage ) 会心暴击
	'SFC' : G_EID++, 		// (single fighting capacity ) 单挑力
	
	//<<natural attr>> 
	'NAG' : G_EID++,		// (Agile)敏捷(身法)
	'NPH' : G_EID++,		// (Natural Physical)体力资质(根骨)
	'NST' : G_EID++,		// (strength)力量资质
	
	//<<other>>
	'MONEY' : G_EID++,		// 钱币
	'GOLD' : G_EID++,			// 金币
	'GIFTGOLD' : G_EID++,	// 礼金
	'IDLEPOPU' : G_EID++,	// 空闲人口
	
	'NAF' : G_EID++, 			// 当前新兵兵力
	'MNAF' : G_EID++,		// 最大新兵兵力
	'NAFO' : G_EID++,			// 当前新兵产出/小时
	
	'FC' : G_EID++, 		// (fighting capacity ) 战力
	
	'HP' : G_EID++,		// (hp) 生命 
	'MHP' : G_EID++,		// (max hp)最大生命
	'UHP' : G_EID++,		// (unit hp) 作战单位生命 	
	
	'JIN_SKILL_LEVEL' : G_EID++, // 金系等级
	'MU_SKILL_LEVEL' : G_EID++, // 金系等级
	'SHUI_SKILL_LEVEL' : G_EID++, // 水系等级
	'HUO_SKILL_LEVEL' : G_EID++, // 火系等级
	'TU_SKILL_LEVEL' : G_EID++, // 土系等级
	
	'PRESTIGE' : G_EID++, // 声望
	
	'MAX' : G_EID++
};


/** 使用效果 */
RES_EFF = {
	'NONE' : 0				// 无定义
	,'ACCELERATE' : 1			// 加速效果
	,'ADDARMGRID' : 2			// 增加背包装备栏格子数
	,'ACC_FOOD' : 3		// 粮食增产
	,'ACC_WOOD' : 4		// 木材增产
	,'ACC_STONE' : 5		// 石料增产
	,'ACC_IRON' : 6		// 生铁增产
	,'ACC_MORALE' : 7			// 提升民心
	,'ACC_POPU' : 8			// 提升人口
	,'ACC_MONEY' : 9			// 增加银两税收
	,'ACC_LOYAL' : 10			// 提升英雄忠诚度
	,'HURT_BUILDVAL' : 11	// 建设度受损
	,'REFRESHNHERO' : 12		// 刷新招募的英雄列表
	,'ADDHEROHEALTH' : 13		// 增加英雄健康
	,'ADDHEROMORALE' : 14		// 增加英雄士气
	,'CLEARHEROPP' : 15		// 洗英雄的点
	,'ACC_STEELMAILUO' : 16		// 加速脉络修炼
	,'LEARN_HERO_BSKILL' : 17		// 学习英雄基础技能
	,'ACC_STEELSKILL' : 18		// 加速英雄技能修炼
	,'ADD_CANSTEELSKILL' : 19		// 增加英雄技能可修炼的时间，单位小时
	,'ADD_NEWSOLDIER' : 20		// 增加新兵数
	,'LEARN_HERO_TSKILL' : 21		// 学习英雄战略技能
	,'LEARN_HERO_SSKILL' : 22		// 学习英雄专精技能
	
	,'ADD_DB_STR' : 23 //'增加刀兵力量'
	,'ADD_DB_PHY' : 24 //'增加刀兵骨根'
	,'ADD_DB_AGILE' : 25 //'增加刀兵身法'
		
	,'ADD_JB_STR' : 26 //'增加戟兵力量'
	,'ADD_JB_PHY' : 27 //'增加戟兵骨根'
	,'ADD_JB_AGILE' : 28 //'增加戟兵身法'
		
	,'ADD_GB_STR' : 29 //'增加弓兵力量'
	,'ADD_GB_PHY' : 30 //'增加弓兵骨根' 
	,'ADD_GB_AGILE' : 31 //'增加弓兵身法'
		
	,'ADD_QB_STR' : 32 //'增加骑兵力量'
	,'ADD_QB_PHY' : 33 //'增加骑兵骨根'
	,'ADD_QB_AGILE' : 34 //'增加骑兵身法'
		
	,'ADD_QX_STR' : 35 //'增加器械力量'
	,'ADD_QX_PHY' : 36 //'增加器械骨根'
	,'ADD_QX_AGILE' : 37 //'增加器械身法'
		
	,'ADD_ROLE_FOR' : 38 //'增加君主武力'
	,'ADD_ROLE_IN' : 39 //'增加君主内政'
	,'ADD_ROLE_BR' : 40 //'增加君主智谋'
	
	,'ACC_CULTURELEARN' : 41		// 加速科技研究
	,'ADD_SOLDIERLEVEL' : 42		// 增加兵阶
	,'LEARN_LINEUP' : 43		// 学习阵法
	
	,'ADDHEROIF' : 44		// 增加英雄内功
	,'FULL_ACC_BUILDING_USEGIFTGOLD' : 45		// 使用礼金建筑升级立即完成
	,'FULL_ACC_CULTURELEARN_USEGIFTGOLD' : 46		// 使用礼金科技研发立即完成
	,'FULL_ACC_SKELETONSTEEL_USEGIFTGOLD' : 47		// 使用礼金筋脉修炼立即完成
	,'FULL_ACC_SKILLSTEEL_USEGIFTGOLD' : 48		// 使用礼金技能修炼立即完成
	,'ADD_THREE_BUILDINGPOS' : 49		// 增加3个建筑排程
	
	,'SEND_WORLD_BLESS' : 50			//全服发送祝福
	,'SETPOS_MOVECITY' : 51			//指定位置迁城
	,'RAND_MOVECITY' : 52			//随机迁城
	,'DROPITEM' : 53			//掉落物品
	
	,'ACC_CITYDEF' : 54 //加速城防建设
	,'FULL_ACC_CITYDEF_USEGIFTGOLD' : 55 //使用礼金加速城防建设立即完成
	
	,'ADD_FOOD' : 56 //增加粮食
	,'ADD_WOOD' : 57 //增加木材
	,'ADD_STONE' : 58 //增加石料
	,'ADD_IRON' : 59 //增加铁锭
	,'ADD_MONEY' : 60 //增加钱币
	,'ADD_FOURRES' : 61 //增加四项资源
	
	,'AVOIDFIGHT' : 62 //增加免战状态
	,'AVOIDFIGHTCD' : 63 //增加免战冷却状态
	
	,'ADD_ROLEATTRVAL' : 64 // 增加君主属性值
	
	,'EXIT_ALLIANCE' : 65 // 离开联盟状态
	,'PASSIVITY_DROPITEM' : 66	//被动掉落
	
	,'ACC_TRADING' : 67 // 跑商加速
	
	
	,'FULL_ACC_TRADING_USEGIFTGOLD' : 68 // 礼金金币跑商加速
	,'HURT_SPEED_BUILDVAL' : 69 // 加速建设度恢复
	
	,'TOWER_RECOVER_SOLDIER' : 70 // 千层塔后援补给
	
	,'ACC_DOINGROLETASK' : 71 // 加速正在做的君主任务
	,'FULL_ACC_TASK_USEGIFTGOLD' : 72 // 利用礼金加速正在做的君主任务
	
	,'TOWER_RECOVER_SOLDIER_BYACT' : 73 // 千层塔后援补给日活动
	
	,'RESTORE_HURT_BUILDVAL' : 74 // 恢复受损建设度
	
	,'YOUNG_STATE' : 75 //新手保护期状态
	
	,'ADD_BUILD_SPEED' : 76 //建设速度提高
	,'ADD_COMMRES_OUTPUT' : 77 //资源产量增加
	,'ADD_CULTURE_SPEED_AND_MONEY_OUTPUT' : 78 //科研速度提高和钱币产量增加
	,'ZHANSHENZHIGUANG' : 79 //战神之光
	
	,'F_BISHA' : 100 // 必杀
	,'F_LIANJI' : 101 // '连击
	,'F_JIPO' : 102 // 击破
	,'F_XIXUE' : 103 // 吸血
	,'F_CUIDU3' : 104 // 淬毒3
	,'F_SHENYI' : 105 // 神医
	,'F_ADD_ES' : 106 // 增加闪避
	,'F_ADD_FIREHURT' : 107 // 增加受到火伤
	,'F_ADD_HU' : 108 // 攻击伤害
	,'F_XINGYUN' : 109 // 幸运
	,'F_ADD_FULLATTRS' : 110 // 全属性
	,'F_XUERUO' : 111 // 削弱 
	,'F_HUOGONG' : 112 // 火攻
	,'F_CHENGSHANG' : 113 // 承伤 
	,'F_FANJI' : 114 // 反击
	,'F_GETRES' : 115 // 资源采集
	,'F_GETGEM' : 116 // 珠宝采集
	,'F_DIXIAOFANJI' : 117 // 抵消反击
	
	,'H_ADD_STR' : 200 // 增加武将力量
	,'H_ADD_PHY' : 201 // 增加武将根骨
	,'H_ADD_AGILE' : 202 // 增加武将身法
	,'H_ADD_CO' : 203 // 增加武将统率
	,'H_ADD_JIN_SKILL_LEVEL' : 204 // 增加武将金系技能等级
	,'H_ADD_MU_SKILL_LEVEL' : 205 // 增加武将木系技能等级
	,'H_ADD_SHUI_SKILL_LEVEL' : 206 // 增加武将水系技能等级
	,'H_ADD_HUO_SKILL_LEVEL' : 207 // 增加武将火系技能等级
	,'H_ADD_TU_SKILL_LEVEL' : 208 // 增加武将土系技能等级
	,'H_ADD_SP' : 209 // 增加行军速度
	,'H_ADD_ATT' : 210 // 增加武将攻击
	,'H_ADD_DEF' : 211 // 增加武将防御
	,'H_ADD_HIT' : 212 // 增加武将命中
	,'H_ADD_ES' : 213 // 增加武将闪避
	,'H_ADD_MPS' : 214 // 增加武将体力
	
	// 一下仅供客户端使用
	,'F_CLT_SUBHP' : 10000 // 普通攻击减血
	,'F_CLT_BERSERK_SUBHP' : 10001 // 暴击攻击减血
	,'F_CLT_MISS' : 10002 // 未击中
};

/** 数值类型 */
VAL_UNIT={
	'VAL':0
	,'PER':1
};

/** 状态迁移关系 */
STATE_REL = {
	'NO' : 0 //不做任何处理的
	,'PARATAXIS' : 1 //可并列存在的
	,'REPLACE' : 2 //替换的
	,'MUTEX' : 3 //互斥的
	,'REPLACE_ADD_DUR' : 4 //替换同时效果的时间叠加
	,'REPLACE_ADD_VAL' : 5 //替换同时效果的数值叠加
	,'REPLACE_ADD_DURVAL' : 6 //替换同时效果的时间和数值叠加
};

/** 英雄职业*/
HERO_PROF = {
	'YONGSHI' : 1 // 勇士
	,'DAOJIANG' : 2 // 刀将
	,'JIJIANG' : 3 // 戟将
	,'GONGJIANG' : 4 // 弓将
	,'QIJIANG' : 5  // 骑将
	,'QIXIE' : 6 // 器将
};

/** 装备位置 */
HEROARM_POS = {
	'FIRST':1		
	,'HEAD':1		// 头部
	,'WEAPON':2	// 武器
	,'ARMOR':3	// 盔甲
	,'SNOOPY':4	// 饰品
	,'SHOES':5	// 鞋子
	,'TRUMP':6	// 武魂
	,'HORSE':7	// 坐骑
	,'LAST':7
};

/** 君主装备位置*/
ROLEARM_POS = {
	'WEAPON':1	// 武器
	,'BOOK':2 // 书籍
	,'YUPEI':3 // 玉佩
	,'MEDAL':4 // 勋章
	,'MAX' : 5
};

/** 五行 */
FIVEELEM_TYPE = {
	'JIN' : 1 //金系
	,'MU' : 2 //木系
	,'SHUI' : 3 //水系
	,'HUO' : 4 //火系
	,'TU' : 5 //土系
};

/** 消耗类型 */
EXPEND_TYPE = {
	'ROLEATTR' : 0
	,'HEROATTR' : 1
	,'ITEM' : 2
	,'MONEY' : 3
	,'GOLD' : 4
	,'GIFTGOLD' : 5
	,'COMMRES' : 6
	,'IDLEPOPU' : 7
	,'PRESTIGE' : 8
};

/** 任务类型 */
TASK_TYPE = {
	'ACTIVE' : 1 // 活动任务
	,'GROWUP' : 2 // 成长主线任务
	,'SUBGROWUP' : 3 // 成长支线任务
	,'ROLE' : 4 // 君主任务
	,'EVERYDAY' : 5 // 日常任务
	,'ONELINE' : 6 // 在线领奖任务
	,'ACTIVITYVAL' : 7 // 活跃度任务
};

/** 活动任务的开始时间 */
TASK_STARTTIME = {
	'SVR_OPEN' : 1 // 开服时间
	,'FIRST_LOGIN' : 100 // 首登时间
	,'MAX_FIRST_LOGIN' : 199 // 最大首登时间
};

/** 任务达成类型 */
TASK_FINISH_TYPE = {
	'FIRST_ROLELOGIN' : 1 //'T_首次登录'  val1=登录的第几天  ok
	,'FAVORITE_URL': 2 // 'T_添加收藏夹'  *** 
	,'FIRST_RECHARGE': 3 // 'T_首次充值' *** 
	,'BUILD_UPGRADE_USEGOLD': 5 // 'T_使用礼金立即完成1个建筑' ok
	,'PLANT_ONE_FARMBLOCK': 6 // 'T_种植一块资源田'  ok
	,'FARMPOPU': 7 // 'T_农场劳动的人口达到' val1=人口个数  ok
	,'HAS_BUILD': 8 // 'T_拥有建筑' val1=建筑id val2=level val3=个数 ok
	,'USE_ITEM': 9 // 'T_使用道具' val1=道具id ok
	,'CARRY_SOLDIER': 11 // 'T_令武将统率士兵' val1=士兵id val2=个数 ok
	,'TAOFA_COPYFIELD': 12 // 'T_讨伐副本' val1=副本id ok
	,'DANTIAO_FIELD': 13 // 'T_单挑野地' val1=野地等级 ok
	,'FINISH_PRESTIGE_TASK': 14 // 'T_完成1次声望任务' ok
	,'WIN_ACT_TOWER': 15 // 'T_战胜千层塔' val1=层数 ok
	,'JION_ACT_BZQJ': 16 // 'T_参加1次百战千军活动'  ***
	,'TRAIN_SOLDIER': 17 // 'T_士兵训练' val1=士兵id val2=士兵个数 ok
	,'MAX_POPU': 18 // 'T_人口上限达到' val1=人口上限值 ok
	,'LEARN_CULTURE': 19 // 'T_学习国学' val1=国学id val2=国学等级 ok
	,'MENOY_OUTPUT': 21 // 'T_钱币时产量'  val1=产量值 ok
	,'CITY_LEVEL': 22 // 'T_城池升级'  val1=城池等级 ok
	,'FINISH_GET_VITALITY_GIFT': 23 // 'T_完成1次活跃度抽奖'  ok
	,'FINISH_ONE_ROLETASK': 24 // 'T_执行1次君主任务' ok
	,'ASSIGN_ROLE_ATTR': 25 // 'T_分配君主属性' ok
	,'ASSIGN_HERO_ATTR': 26 // 'T_分配武将属性' ok
	,'CONFER_HERO_OFFICAL': 27 // 'T_册封武将' ok
	,'JION_ALLI': 28 // 'T_加入个联盟' ok
	,'GET_ALLI_GIFT': 29 // 'T_领取1次联盟福利' ok
	,'START_ONE_TRADINGAREA': 30 // 'T_开始1次跑商' ok
	,'ADD_QQ_GROUP': 31 // 'T_加入联盟Q群' ***
	,'STEEL_HERO': 32 // 'T_执行1次武将修炼' ok
	,'STEEL_HERO_JING_MAI': 34 // 'T_打通武将经脉' ok
	,'HAS_ONE_ARM': 35 // 'T_拥有1件装备' ok
	,'HERO_UPGRADE': 36 // 'T_武将升级' val1=武将等级 ok
	,'BUY_ONE_ARM': 37 // 'T_购买1个装备' ok
	,'WEAR_HERO_ARM': 38 // 'T_将1个装备穿戴在武将身上' ok
	,'CITY_BUILD_VAL': 39 // 'T_建设度达到' val1=建设度的值 ok
	,'NEWSOLIDER_MAX': 40 // 'T_新兵上限' val1=上限值 ok
	,'HAS_CITY_DEF': 41 // 'T_现有城防御数量' val1=防御id val2=防御数量  ok
	,'SET_CITY_DEF_ARMY': 42 // 'T_设定城防部队' ok
	,'BUILD_SUBCITY': 43 // 'T_建造分城' val1=第几个分城 ok
	,'ROLE_UPGRADE': 44 // 'T_君主升级' val1=君主等级 ok
	,'GET_ALL_FARMRES': 45 // 'T_征收全部资源田' ok
	,'WATERING_TREE': 46 // 'T_给摇钱树浇1次水'  ***
	,'JION_ACT_TERRACE': 47 // 'T_参与点将台活动一次' ok
	,'WIN_ACT_TERRACE': 48 // 'T_点将台通关' val1=第几关 ok
	,'ALLI_MEM_NUM': 49 // 'T_联盟成员人数' val1=联盟成员人数  ok
	,'STRONG_ARM': 50 // 'T_装备强化'  ok
	,'MERGE_GEM': 51 // 'T_宝石合成'  ok
	,'BESET_GEM': 52 // 'T_宝石镶嵌'  ok
	,'ZHANLING_FIELD': 53 // 'T_占领野地'  val1=野地等级 ok
	,'HAS_ITEM_NUM': 54 // 'T_拥有道具' val1=道具id val2=道具数量 ok
	,'RECRUIT_HERO': 55 // 'T_招募武将' val1=武将类别 ok
	,'ASSIGN_HERO_EXPS': 56 // 'T_分配武将经验' ok
	,'USE_DOTBROWSER': 57 // 'T_使用登陆器登录'  ***
	,'ROLELOGIN_EVERYDAY': 58 // 'T_每日登录' ok
	,'GET_ALL_OTHERFARMRES': 59 // 'T_摘取全部资源田' ok
	,'FINISH_ONE_EVERYDAYTASK': 60 // 'T_完成一次日常任务' ok
	,'JION_ACT_TOWER': 61 // 'T_参与千层塔活动一次' ok
	,'GET_ALLICONTRI_BYCOMMITRES': 62 // 'T_联盟捐献获得贡献' ok
	,'FEED_LIGHTLAW': 63 // 'T_圣兽喂养' ok
	,'SPEED_BUILDING': 64 // 'T_进行加速' ok
	,'GET_RES_FROMFIELD': 65 // 'T_野地采集' ok
	,'PROVOKE_PLAYER': 66 // 'T_挑衅玩家' ok
	,'SUB_ITEM': 67 // 'T_扣除道具' val1=道具id val2=道具数量
	,'HERO_INSIGHT_SKILL': 68 // 'T_武将领悟技能'
	,'HERO_LINEUP_ACTTOWER': 69 // 'T_武将上阵'
	,'BUILD_CITY_DEF': 70 // 'T_开始建造城防数量' val1=防御id val2=防御数量
	,'RECHARGE': 71 // 'T_充值' *** 
	,'GET_REWARD_BY_PRESTIGE': 72 // 'T_通过声望领取奖励' *** 
	,'FIGHT_PLAYER_FOR_HONOR': 73 // 'T_发起跨国荣誉战' *** 
};

/**  活跃度任务连接 */
ACTIVITYVAL_TASK_LINK = {
	'NONE' : 0
	,'FARM' : 1 //农场
	,'ROLETASK' : 2 // 君主任务
	,'EVERYDAYTASK' : 3 // 日常任务
	,'ACT_TERRACE' : 4 // 点将台
	,'ACT_TOWER' : 5 // 千层塔
	,'ALLI_CONTRIBUTE' : 6 // 联盟捐献
	,'ALLI_GIFT' : 7 // 联盟福利
	,'TRADING_AREA' : 8 // 市场
	,'STEEL_HERO' : 9 // 武馆
	,'HEROS_DLG' : 10 // 武将界面
	,'OTHERFARM' : 11 // 他人农场
};

/**  服务器当日活动类型 */
SVR_TODAY_ACT_TYPE = {
	'HERO_STEEL_2': 1 //  修炼双倍
	,'HERO_STEEL_3': 2 //  修炼三倍
	,'ACT_TERRACE_IF_2': 3 //  点将双倍
	,'ACT_TERRACE_IF_3': 4 //  点将三倍
	,'ACT_TERRACE_TIMES_1': 5 //  点将多次
	,'ACT_TOWER_EXP_2': 6 //  闯塔双倍
	,'ACT_TOWER_EXP_3': 7 //  闯塔三倍
	,'ACT_TOWER_RECOVER_10': 8 //  闯塔恢复10%
	,'ACT_TOWER_RECOVER_20': 9 //  闯塔恢复20%
	,'ACT_TOWER_TIMES_1': 10 //  闯塔多次
	,'ACT_PAY_1' :  11 //  充值活动1
};

VIP_EFF = {
	'SKIP_TOWER' :1 //'V_千层塔跳层免费补收益'
	,'SPEED_ROLETASK' : 2 // ,'V_免费加速君主任务'
	,'CITY_MODEL' : 3 // ,'V_绚丽城池外观标识
	,'TALK_TAG' : 4 // ,'V_聊天成就标识
	,'SPEED_CULTURELEARN' : 5 // ,'V_免费无限次加速科技' : '
	,'SPEED_TRADING' : 6 // ,'V_连续跑商' : '
	,'ADD_ACTVAL' : 7 // ,'V_活跃度加分' : '
	,'ADD_EVERYDAYTASK' : 8 // ,'V_日常任务增加个数' : '
	,'SPEED_ACTCD' : 9 // ,'V_千层塔点将台过关耗时减少' : '
	,'ADD_MONEY_OUTPUT' : 10 // ,'V_基础钱币产量增加' : '
	,'ADD_PKG_COUNT' : 11 // ,'V_背包容量增加' : '
	,'ADD_FRIEND_COUNT' : 12 // ,'V_好友仇人上限增加' : '
	,'ADD_FARM_PROTECT_TIME' : 13 //,'V_农场保护时间加长' : '
	,'ADD_BUILD_QUEUE' : 14 // ,'V_增加免费建筑队列' : '
	,'ADD_BUILD_AUTO_QUEUE' : 15 // ,'V_增加自动建造队列' : '
	,'PAY' : 16 // ,'V_充值' : '
	,'ADD_COMMRES_OUTPUT' : 17 // ,'V_基础资源产量加成' : '
	,'ADD_LAWLIGHTFEED_TIMES' : 18 // ,'V_增加联盟圣兽喂养次数' : '
	,'ADD_TRADING_GET' : 19 // ,'V_增加跑商收益' : '
	,'ADD_TOWER_EXP_GET' : 20 // ,'V_千层塔经验加成' : '
	,'HERO_HIGH_STEEL' : 21 // ,'V_武将开启黄金白金修炼模式' : '
	,'VIP_ITEM' : 22 // ,'V_可优惠购买VIP礼包' : '
	,'VIP_ITEM_PRICE' : 23 // ,'V_VIP礼包价格' : '
};

