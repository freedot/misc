--浮点精度
FLOAT_DRT = 0.001
--资源的精度
RES_PRECISION = 10000
--属性的精度
ATTR_PRECISION = 1000
--玩家保存到DB的时间间隔(秒)
SAVE_PLAYERDB_INTERVAL_S = 5*60
--刷新英雄属性的时间间隔
RECALC_HERO_ATTR_INTERVAL_S = 5*60

TIMER_ID = {
	DEFAULT = 0,
	PLAYER = 1,
	ARMY = 2,
	CITYMGR = 3,
	BLESSMSG = 4,
	ALLI_MGR = 5,
	ARMY_MGR = 6,
	FIGHTREFSTATE = 7,
	PLAYER_MGR = 8,
	WORLD_MSG = 9,
	ACTTOWER_RANK = 10,
	ROLE_RANK = 11,
	SVR_ACTEFFECT = 12,
	ONLINES_CHECK = 13,
	SEND_ALL_MAILS = 14,
	ROLEWORLDBOSS_RANK = 15,
	ALLIANCEWORLDBOSS_RANK = 16, 
	COUNTRYWORLDBOSS_RANK = 17, 
	ALLIANCE_RANK = 18, 
	OPEN_SVR_ACT = 19,
	QUESTION_ACT = 20,-- 答题活动
}

TIMER_EVT = {
	NONE = 0,
	STEEL_STOP=1, --英雄修炼结束事件
	PLAYER_BUFF=2, --角色buff事件
	YOUNG_END=3, --新手期结束事件
	BUILD_STOP=4, --建筑结束事件
	BUILDUP_STOP=5, --内城建筑升级结束事件
	BUILDDOWN_STOP=6, --内城建筑拆除结束事件
	SAVEPLAYERDB=7, --将玩家数据保存到db中
	REFRESHROLEATTR=8, --刷新ROLE的属性
	FARMGROWUP_STOP=9, --农场成长结束
	HERO_UNLOCK_STOP=10, --英雄解锁状态到期通知
	RECALC_HERO_ATTR=11, --重新计算英雄的属性
	SSTEEL_HERO_STOP=12, --脉络修炼结束通知
	SKILL_STEEL_HERO_STOP=13,--修炼英雄基础技能结束
	LEARN_CULTURE_STOP=14,--修炼英雄基础技能结束
	EXPED_STOP=15,--出征结束
	EXPED_RETURN_STOP=16,--出征返回结束
	SET_START_REFRESHFIELDLEVEL=17,--用来设置（START_REFRESHFIELDLEVEL）
	START_REFRESHFIELDLEVEL=18,--每天整点开始刷新野地等级
	REFRESHFIELDLEVEL=19,--刷新野地等级(每次刷新部分，刷完后停止该timer)
	SEND_BLESSMSG=20,--发送祝福
	HERO_STEEL_STOP=21,--武将修炼停止事件
	BUILD_CITYDEF_STOP=22,--建造城防停止事件
	DECLARE_STATE_STOP=23,--宣战状态停止事件
	FIGHTING_STATE_STOP=24,--战斗中状态停止事件
	FREE_OFFLINE_PLAYER=25,--释放离线玩家事件
	WORLD_CHANNEL_UPDATE=26,--世界频道的更新事件
	UPGRADE_ALLIANCE=27,--联盟升级
	DISMISS_ALLIANCE=28,--联盟解散
	DISMISS_TRANSFER=29,--联盟盟主转让
	SAVE_ALLIANCE=30,--保存联盟
	TRADING_STOP=31,--跑商结束
	SORT_ACTTOWER_RANK=32,--千层塔排序
	SORT_ALLI_RANK=33,--联盟排序
	DOINGTASK_STOP=34,--君主任务结束
	REFRESH_EVERYDAYTASK=35,--role的日常任务刷新
	DOINGTASK_CD_STOP=36,--君主任务冷却结束结束
	SVR_ACT_EFFECT_REFRESH = 37,--服务器活动效果刷新
	SORT_ROLE_RANK=38,--角色排序
	FIGHT_REF_STATECHANGE = 39,--玩家战斗状态的改变
	REFRESH_ACTTASK = 40,---活动任务刷新
	GETGOLD_WHEN_PAY = 41,---当支付时获取当前金币余额
	ONLINES_CHECK=42,--统计在线人数
	SEND_ALL_MAILS=43,--发送全服邮件
	ROLEWORLDBOSS_RANK = 44,
	ALLIANCEWORLDBOSS_RANK = 45, 
	COUNTRYWORLDBOSS_RANK = 46, 
	ALLI_ITEM_TIMEOUT = 47,--联盟物品到期
	ALLIANCE_RANK = 48,--联盟物品到期
	SAVEGRID = 49,--保存grid
	OPEN_SVR_ACT = 50,-- 开服活动奖励
	QUESTION_ACT = 51,-- 答题活动

	FIX_TIMER_START = 10000,
	MAX = 20000,
}


COLLECT_REASON = {
	MANUAL = 0,  -- 手工主动采集
	REFRESH = 1, -- 系统刷新变为0级采集同时放弃
	BEATTACKED = 2, -- 被其他玩家攻击采集同时放弃
}

BUILDCITY_ID = {
	ALL = 0,
	MAIN = 1,
	SUB1 = 2,
	SUB2 = 3,
	SUB3 = 4,
	SUB4 = 5,
	ALLI = 6,
}

--城池类型
CITY_TYPE = {
	NONE = 0,
	
	MAIN = 1,
	SUBRES = 2,
	SUBARMY = 3,
	
	SUBCIVI = 4, -- sub civilization city
	
	NPCLOW = 5,
	NPCMID = 6,
	NPCHIGH = 7,
}

-- 建筑状态 
BUILD_STATE = {
	COMM=0
	,UPGRADE=1
	,DOWN=2
	,BUILD=3
	,LEARNSKILL=4
}

-- 效果类型
EFFECT_TYPE = {
	PER_SECOND=0 --每秒
	,PER_FIVESECOND=1 --每5秒
	,PER_TENSECOND=2 --每10秒
	,PER_MINUTE=3 --每分钟
	,PER_HOUR=4 --每小时
	,ONETIME=5 --只有一次
	,PERDURE=6 --持续的
}

-- 使用效果
RES_EFF = {
	NONE = 0						-- 无定义
	,ACCELERATE = 1				-- 加速效果
	,ADDARMGRID = 2			-- 增加背包装备栏格子数
	,ACC_FOOD = 3		-- 粮食增产
	,ACC_WOOD = 4		-- 木材增产
	,ACC_STONE = 5		-- 石料增产
	,ACC_IRON = 6		-- 生铁增产
	,ACC_MORALE = 7			-- 提升民心
	,ACC_POPU = 8				-- 提升人口
	,ACC_MONEY = 9				-- 增加银两税收
	,ACC_LOYAL = 10				-- 提升英雄忠诚度
	,HURT_BUILDVAL = 11		-- 建设度受损
	,REFRESHNHERO = 12		-- 刷新招募的英雄列表
	,ADDHEROHEALTH = 13		-- 增加英雄健康
	,ADDHEROMORALE = 14		-- 增加英雄士气
	,CLEARHEROPP = 15				-- 洗英雄的点
	,ACC_STEELMAILUO = 16 		-- 加速脉络修炼
	,LEARN_HERO_BSKILL = 17 	--学习英雄基础技能
	,ACC_STEELSKILL = 18 			-- 加速英雄技能修炼
	,ADD_CANSTEELSKILL = 19 	-- 增加英雄技能可修炼的时间，单位小时
	,ADD_NEWSOLDIER = 20		--增加新兵数
	,LEARN_HERO_TSKILL = 21		--学习英雄战略技能
	,LEARN_HERO_SSKILL = 22		--学习英雄专精技能
	
	,ADD_DB_STR = 23 --增加刀兵力量
	,ADD_DB_PHY = 24 --增加刀兵骨根
	,ADD_DB_AGILE = 25 --增加刀兵身法
		
	,ADD_JB_STR = 26 --增加戟兵力量
	,ADD_JB_PHY = 27 --增加戟兵骨根
	,ADD_JB_AGILE = 28 --增加戟兵身法
		
	,ADD_GB_STR = 29 --增加弓兵力量
	,ADD_GB_PHY = 30 --增加弓兵骨根 
	,ADD_GB_AGILE = 31 --增加弓兵身法
		
	,ADD_QB_STR = 32 --增加骑兵力量
	,ADD_QB_PHY = 33 --增加骑兵骨根
	,ADD_QB_AGILE = 34 --增加骑兵身法
		
	,ADD_QX_STR = 35 --增加器械力量
	,ADD_QX_PHY = 36 --增加器械骨根
	,ADD_QX_AGILE = 37 --增加器械身法
		
	,ADD_ROLE_FOR = 38 --增加君主武力
	,ADD_ROLE_IN = 39 --增加君主内政
	,ADD_ROLE_BR = 40 --增加君主智谋
	
	,ACC_CULTURELEARN = 41 --加速科技研究
	,ADD_SOLDIERLEVEL = 42 --增加兵阶
	,LEARN_LINEUP = 43 -- 学习阵法
	
	,ADDHEROIF = 44 -- 增加英雄内功
	,FULL_ACC_BUILDING_USEGIFTGOLD = 45		-- 使用礼金建筑升级立即完成
	,FULL_ACC_CULTURELEARN_USEGIFTGOLD = 46		-- 使用礼金科技研发立即完成
	,FULL_ACC_SKELETONSTEEL_USEGIFTGOLD = 47		-- 使用礼金筋脉修炼立即完成
	,FULL_ACC_SKILLSTEEL_USEGIFTGOLD = 48		-- 使用礼金技能修炼立即完成
	,ADD_THREE_BUILDINGPOS = 49		-- 增加3个建筑排程
	
	,SEND_WORLD_BLESS = 50			--全服发送祝福
	,SETPOS_MOVECITY = 51			--指定位置迁城
	,RAND_MOVECITY = 52			--随机迁城
	,DROPITEM = 53			--掉落物品
	
	,ACC_CITYDEF = 54 --加速城防建设
	,FULL_ACC_CITYDEF_USEGIFTGOLD = 55 --使用礼金加速城防建设立即完成	
	
	,ADD_FOOD = 56 -- 增加粮食
	,ADD_WOOD = 57 -- 增加木材
	,ADD_STONE = 58 -- 增加石料
	,ADD_IRON = 59 -- 增加铁锭
	,ADD_MONEY = 60 -- 增加钱币
	,ADD_FOURRES = 61 -- 增加四项资源
	
	,AVOIDFIGHT = 62 -- 增加免战状态
	,AVOIDFIGHTCD = 63 --增加免战冷却状态
	,ADD_ROLEATTRVAL = 64 --增加君主属性值
	
	,EXIT_ALLIANCE = 65 --离开联盟状态
	
	,PASSIVITY_DROPITEM = 66			--被动掉落
	
	,ACC_TRADING = 67 --  跑商加速
	,FULL_ACC_TRADING_USEGIFTGOLD = 68 -- 礼金金币跑商加速
	,HURT_SPEED_BUILDVAL = 69 -- 加速建设度恢复
	,TOWER_RECOVER_SOLDIER = 70 -- 千层塔后援补给
	,ACC_DOINGROLETASK = 71 -- 加速正在做的君主任务
	,FULL_ACC_TASK_USEGIFTGOLD = 72 -- 利用礼金加速正在做的君主任务
	,TOWER_RECOVER_SOLDIER_BYACT = 73 -- 千层塔后援补给日活动
	,RESTORE_HURT_BUILDVAL = 74 -- 恢复受损建设度
	,YOUNG_STATE = 75 -- 新手保护期状态
	
	,ADD_BUILD_SPEED = 76 --建设速度提高
	,ADD_COMMRES_OUTPUT = 77 --资源产量增加
	,ADD_CULTURE_SPEED_AND_MONEY_OUTPUT = 78 --科研速度提高和钱币产量增加
	,ZHANSHENZHIGUANG = 79 --战神之光
	
	,F_BISHA = 100 -- 必杀
	,F_LIANJI = 101 -- '连击
	,F_JIPO = 102 -- 击破
	,F_XIXUE = 103 -- 吸血
	,F_CUIDU3 = 104 -- 淬毒3
	,F_SHENYI = 105 -- 神医
	,F_ADD_ES = 106 -- 增加闪避
	,F_ADD_FIREHURT = 107 -- 增加受到火伤
	,F_ADD_HU = 108 -- 攻击伤害
	,F_XINGYUN = 109 -- 幸运
	,F_ADD_FULLATTRS = 110 -- 全属性
	,F_XUERUO = 111 -- 削弱 
	,F_HUOGONG = 112 -- 火攻
	,F_CHENGSHANG = 113 -- 承伤 
	,F_FANJI = 114 -- 反击
	,F_GETRES = 115 -- 资源采集
	,F_GETGEM = 116 -- 珠宝采集	
	,F_DIXIAOFANJI = 118 --抵消反击
	
	,H_ADD_STR = 200 -- 增加武将力量
	,H_ADD_PHY = 201 -- 增加武将根骨
	,H_ADD_AGILE = 202 -- 增加武将身法
	,H_ADD_CO = 203 -- 增加武将统率
	,H_ADD_JIN_SKILL_LEVEL = 204 -- 增加武将金系技能等级
	,H_ADD_MU_SKILL_LEVEL = 205 -- 增加武将木系技能等级
	,H_ADD_SHUI_SKILL_LEVEL = 206 -- 增加武将水系技能等级
	,H_ADD_HUO_SKILL_LEVEL = 207 -- 增加武将火系技能等级
	,H_ADD_TU_SKILL_LEVEL = 208 -- 增加武将土系技能等级
	,H_ADD_SP = 209 -- 增加武将行军速度
	,H_ADD_ATT = 210 -- 增加武将攻击
	,H_ADD_DEF = 211 -- 增加武将防御
	,H_ADD_HIT = 212 -- 增加武将命中
	,H_ADD_ES = 213 -- 增加武将闪避
	,H_ADD_MPS = 214 -- 增加武将体力
};

-- 使用对象
RES_TRG = {
	NONE = 0				-- 无定义
	,SELF_DEF_BUILDING = 1	-- 自己的正在建造的城防
	,SELF_DEF_BUILDED = 2		-- 自己的已经建造的城防
	,SELF_HERO = 3			-- 自己的英雄
	,SELF_SOLDIER = 4		-- 自己的士兵
	
	,FRIEND_DEF_BUILDING = 5	-- 友方的正在建造的城防
	,FRIEND_DEF_BUILDED = 6	-- 友方的已经建造的城防
	,FRIEND_HERO = 7		-- 友方的英雄
	,FRIEND_SOLDIER = 8		-- 友方的士兵
	
	,ENEMY_DEF_BUILDING = 9	-- 敌方的正在建造的城防
	,ENEMY_DEF_BUILDED = 10	-- 敌方的已经建造的城防
	,ENEMY_HERO = 11		-- 敌方的英雄
	,ENEMY_SOLDIER = 12		-- 敌方的士兵
	
	,SELF_ARMY = 13			-- 自己的军队
	,ALLI_ARMY = 14			-- 联盟的军队
	,ENEMY_ARMY = 15		-- 敌放的军队
	
	,LEARNING_CULTURE = 16	-- 自己的正在研究的国学
	,MAKING_WEAPONRY = 17	-- 自己的正在锻造的武器
	,BUILDING_OBUILD = 18		-- 自己的正在建造的外城建筑
	,BUILDING_IBUILD = 19		-- 自己的正在建造的内城建筑
	,RECRUITING_SOLDIER = 20	-- 自己的正在招募的士兵
	,OBUILD = 21			-- 自己的已建好的外城建筑
	,IBUILD = 22			-- 自己的已建好的内城建筑 
	,OBUILDRES = 23			-- 自己的外城资源
	,ADDARMGRID = 24		-- 增加装备栏格子数
	,MORALE = 25			-- 增加装备栏格子数
	,POPU = 26				-- 增加装备栏格子数
	,GOLD = 27				-- 增加装备栏格子数
	
	,MYCITY = 28			-- 我的城池
	,ALLICITY = 29			-- 联盟城池
	,ENEMYCITY = 30			-- 对方城池
	
	,FARM = 31				-- 自己的农田
	,TIMBERYARD = 32		-- 自己的木场
	,QUARRY = 33			-- 自己的石场
	,IRONORE = 34			-- 自己的铁场
	
	,SELF_ROLE = 35			-- 自己的君主
	
	,SELF_NEWHEROS = 36	-- 自己的招募英雄列表
	
	,MAX = 1000
};

OBJ_TYPE = {
	NONE = 0
	,ROLE = 1
	,HERO = 2
	,GROUP = 3
	,FIELD = 4 
	,COPYFIELD = 5 
	,NPCFIELD = 6
	,TOWER = 7
	,OWNERFIELD = 8
	,CITYPOS = 9
	,DIED_ROLE = 10
	,INVALID = 100
};

EXPEND_TYPE = {
	ROLEATTR = 0,
	HEROATTR = 1,
	ITEM = 2,
	MONEY = 3,
	GOLD = 4,
	GIFTGOLD = 5,
	COMMRES = 6,
	IDLEPOPU = 7,
	PRESTIGE = 8,
	HONOR = 9,
};

-- 武将装备位置
HEROARM_POS = {
	FIRST=1		-- 
	,HEAD=1		-- 头部
	,WEAPON=2	-- 武器
	,ARMOR=3	-- 盔甲
	,SNOOPY=4	-- 饰品
	,SHOES=5	-- 鞋子
	,TRUMP=6	-- 武魂
	,HORSE=7	-- 坐骑
	,LAST = 7
};

--君主装备位置
ROLEARM_POS = {
	WEAPON=1	-- 武器
	,BOOK=2 -- 书籍
	,YUPEI=3 -- 玉佩
	,MEDAL=4 -- 勋章
	,MAX = 5
};

-- 联盟职位
ALLI_POS = {
	NONE = 0
	,MEM = 1 -- 普通成员 
	,ELDER = 2 -- 长老
	,ALEADER = 3 -- 副盟主
	,LEADER = 4 -- 盟主
}

ROLE_SEX = {
	MALE = 0
	,FEMALE = 1
}

-- 数值类型
VAL_UNIT={
	VAL=0,
	PER=1,
}

-- 农场块的状态 
FARM_STATE = {
	SAPLING = 0
	,GROWUP = 1
	,COMPLETE = 2
}

--农场日志类型
FARMLOG_TYPE = {	
	GETSELF = 1 -- 摘取自己的资源
	,GETOTHER = 2 -- 摘取别人的资源
	,OTHERGET = 3 -- 别人偷我的资源
}

-- 系统消息类型
SMSGT = {
	POP=0, --弹出提示
	SYSCHANNEL=1, --频道提示
	SHOWPOP=2, --布告栏展示
	POPMSGBOX = 3, --弹出对话框
	CHAT_CHANNEL = 4, --聊天频道
	CHAT_CHANNEL = 4, --聊天频道
	SYS_POPBAR = 5, -- 系统广播提示条	
	NPC_MSG = 6, -- NPC消息
}

-- sysmsgtip的显示类型, 对应SMSGT.POP
SMT_NORMAL = 0
SMT_WARNING = 1
SMT_ERROR = 2
SMT_SUCCESS = 3

--君主状态
ROLE_STATE = {
	FREE = 0 --空闲
	,YOUNG = 1 --新手
	,REST = 2 --休息
}

-- 英雄的状态
HERO_STATE = {
	FREE = 0 --空闲
	,EXPED = 1 --出征
	,STEEL = 2 --修炼
	,ACT = 3 --活动
	,DISPATCHFIELD = 4 --派遣到野地
	,ACT_TOWER = 5 -- 千层塔
	,ACT_TERRACE = 6 -- 点将台	
	,ACT_WORLDBOSS = 7 -- 世界BOSS
}

HERO_LOCKSTATE = {
	NONE = 0
	,LOCKED = 1
	,UNLOCKING = 2
}

G_EID = -1;
function NewEID()
	G_EID = G_EID + 1;
	return G_EID;
end

ATTR = {
	NONE = NewEID(),		-- 无
	LVL = NewEID(),			-- (Level)等级
	--<<attr1>>
	XP = NewEID(),			-- (Experience)经验值 ****
	NXP = NewEID(),			-- (Next experience)升到下级需要的经验值 ****
	PS = NewEID(),			-- (physical strength)体力 ****
	MPS = NewEID(),			-- 最大体力 ****
	AN = NewEID(),			-- (Angry)怒气
	MAN = NewEID(),			-- 最大怒气
	MO = NewEID(),			-- (morale)士气
	MMO = NewEID(),		-- 最大士气
	HEALTH = NewEID(), 	-- 当前健康度 ****	
	MHEALTH = NewEID(), 	-- 最大健康度  ****
	IF = NewEID(),			-- ( inner force)内功****
	MIF = NewEID(),			-- ( max inner force)内功的上限****
	STP = NewEID(), 			-- 当前的计谋点
	MSTP = NewEID(), 		-- 最大的计谋点
	AF = NewEID(), 			-- 当前兵力
	MAF = NewEID(),			-- 最大兵力
	XPS = NewEID(),			--  经验池当前值
	MXPS = NewEID(),		--  经验池最大值
	
	--<<attr2>>
	IN_B = NewEID(),			-- (Interior)内政
	IN_A = NewEID(),			-- (Interior)内政
	FOR_B = NewEID(),		--  武力force
	FOR_A = NewEID(),		--  武力force
	BR_B = NewEID(),		--  智力brains
	BR_A = NewEID(),		--  智力brains	
	
	PH_B = NewEID(),		-- (Physical)体质(根骨) ****
	PH_A = NewEID(),		-- (Physical)体质(根骨) ****
	ST_B = NewEID(),		-- (strength)力量 ****
	ST_A = NewEID(),		-- (strength)力量 ****
	AG_B = NewEID(),		-- (Agile)敏捷(身法) ****
	AG_A = NewEID(),		-- (Agile)敏捷(身法) ****
	
	PP = NewEID(),			-- (Potential point)潜力点 ****
	
	--<<attr3>>
	CRE = NewEID(),			-- (Credit)武勋 ****
	CO = NewEID(),			-- (Command)统率 ****
	HI = NewEID(),			-- (Hit)命中 ****
	HU = NewEID(),			-- (Hurt)攻击伤害 ****
	DE = NewEID(),			-- (Defense)防御 ****
	SP = NewEID(),			-- (speed)速度****
	ES = NewEID(),			-- (Escape)闪避 ****
	BER = NewEID(), 			-- (Berserk attack percentage ) 会心暴击 ****
	SFC = NewEID(), 			-- (single fighting capacity ) 单挑力 ****
		
	--<<attr4>> 
	NAG = NewEID(),			-- (Agile)敏捷(身法)资质
	NPH = NewEID(),			-- (Natural Physical)体力(根骨)资质
	NST = NewEID(),			-- (Strength)力量资质
	
	--<<other>>
	MONEY = NewEID(),		-- 钱币
	GOLD = NewEID(),		-- 金币
	GIFTGOLD = NewEID(),	-- 礼金
	IDLEPOPU = NewEID(),	-- 空闲人口
	
	NAF = NewEID(), 			-- 当前新兵兵力
	MNAF = NewEID(),		-- 最大新兵兵力
	NAFO = NewEID(), 		-- 当前新兵产出/小时
	
	FC = NewEID(), 		-- (fighting capacity ) 战力
	
	HP = NewEID(),		--(hp) 生命 
	MHP = NewEID(),		--(max hp)最大生命
	UHP = NewEID(),		--(unit hp) 作战单位生命 
	
	JIN_SKILL_LEVEL = NewEID(), -- 金系等级
	MU_SKILL_LEVEL = NewEID(), -- 金系等级
	SHUI_SKILL_LEVEL = NewEID(), -- 水系等级
	HUO_SKILL_LEVEL = NewEID(), -- 火系等级
	TU_SKILL_LEVEL = NewEID(), -- 土系等级
	
	PRESTIGE = NewEID(), -- 声望
	HONOR = NewEID(), -- 荣誉
	
	MAX = NewEID()
}

ARMY_BUFF = {
	SHOWDETAIL = 1,
}

-- 军队类别
ARMY_TYPE = {
	SELF=1
	,ENEMY=2
	,ALLI=3
}

-- 军事动态状态
ARMYDYN_STATE = {
	GOTO=0 -- 前往
	,FIGHT=1 -- 战斗
	,RETURN=2 -- 返回
	,DISPATCH=3 -- 派遣
	,COLLECT=4 -- 采集
}

-- 出征类型
EXPED_TYPE = {
	FIRST = 1 --
	,TAOFA = 1  --
	,DANTIAO = 2  --
	,CUIHUI = 3  --
	,TIAOXIN = 4  --
	,PAIQIAN = 5  --
	,ZHANLING = 6  --
	,ACT_TOWER = 7 --
	,ACT_TERRACE = 8 --
	,ACT_WORLDBOSS = 9
};

-- 和其他玩家的战争状态 
REF_ROLESTATE = {
	NORMAL = 0 -- 正常
	,DECLARING_FIGHT = 1 -- 宣战状态
	,FIGHTING = 2 -- 战斗状态
};

-- 健康类别
HEALTH_TYPE = {
	HEALTH = 0 -- 健康
	,FLESH_WOUND = 1 --  轻伤
	,DEEP_WOUND = 2 -- 重伤
};

-- 状态效果迁移关系
STATE_REL = {
	NO = 0, --不做任何处理的
	PARATAXIS = 1, --可并列存在的
	REPLACE = 2,  --替换的
	MUTEX = 3, --互斥的
	REPLACE_ADD_DUR = 4, --替换同时效果的时间叠加
	REPLACE_ADD_VAL = 5, --替换同时效果的数值叠加
	REPLACE_ADD_DURVAL = 6, --替换同时效果的时间和数值叠加
}

-- 城防类型
CITYDEF_TYPE = {
	FIRST = 1,
	XIANJING = 1, -- 陷阱
	GUNMU = 2,  --  滚木
	JUMA = 3, --  拒马
	LEISHI = 4, -- 礌石
	NUJIAN = 5, -- 弩箭
	LAST = 5,
}

--英雄职业
HERO_PROF = {
	YONGSHI = 1,-- 勇士
	DAOJIANG = 2,-- 刀将
	JIJIANG = 3,-- 戟将
	GONGJIANG = 4,-- 弓将
	QIJIANG = 5, -- 骑将
	QIXIE = 6,-- 器将
}

--武将基础属性定义
HERO_BASE_ATTR = {
	STR = 1,  --力量
	AGILE = 2, -- 身法
	PHY = 3, -- 根骨
}

--战斗actor类型
ACTOR_TYPE = {
	COMM = 0,
	WALL = 1,
	HERO = 2,
	SOLDIER = 3,
	DEF = 4,
	TOWER = 5,
}

--战斗状态
FIGHT_RESULT = {
	INPROCESS = 0,
	ATTACKSUCC = 1,
	ATTACKFAIL = 2,
}

--战斗阵营
FIGHT_CAMP = {
	ATTACK = 0,
	DEFEND = 1,
}


--是否战斗标志
FIGHT_FLAG = {
	UNFIGHT = 0,
	FIGHTED = 1,
}


-- 五行
FIVEELEM_TYPE = {
	JIN = 1 --金系
	,MU = 2 --木系
	,SHUI = 3 --水系
	,HUO = 4 --火系
	,TU = 5 --土系
}

--购买支付方式
PAY_TYPE = {
	FIRST = 0
	,MONEY = 0
	,GOLD = 1
	,GIFTGOLD = 2
	,PRESTIGE = 3
	,HONOR = 4
	,LAST = 4
}

--武将修炼类型
HSTEEL_TYPE ={
	FIRST = 0
	,COMM = 0 --普通修炼
	,HIGH = 1 -- 高级修炼
	,VIP1 = 2 -- 黄金修炼
	,VIP2 = 3 -- 白金修炼
	,LAST = 3
}

--
HSTEEL_EFF_TYPE ={
	FIRST = 0
	,NORMAL = 0
	,SPEED = 1
	,LAST = 1
}

--
RAND_TYPE = {
	FULLRAND = 0  -- 全随机
	,ROUNDRAND = 1 -- 圆桌随机
}

-- 聊天面板的提示标签类型
CHAT_TAG = {
	SYS = 0
	,WORLD = 1
	,ALLIANCE = 2
	,STATE = 3
	,PRIVATE = 4
	,PROMPT = 5
}

--聊天对象
CHAT_TARGET = {
	WORLD = 0
	,STATE = 1
	,ALLIANCE = 2
	,PLAYER = 3
}

-- 聊天发布消息的系统玩家
CHAT_SYSPLAYER = {
	STATE = 0
	,ALLIANCE = 1
	,SYS = 2
	,MAX = 3
}

-- 聊天频道
CHAT_CHANNEL = {
	ALL = 0
	,STATE = 1
	,ALLIANCE = 2
	,PRIVATE = 3
	,WORLD = 4
	,MAX = 5
};

-- 任务状态
TASK_STATE = {
	WAIT_COMPLETE = 0
	,WAIT_GET = 1
	,COMPLETE = 2
	,CANNOTDO = 3
	,CANDO = 4
	,DOING = 5
};

-- 任务类型
TASK_TYPE = {
	ACTIVE = 1 -- 活动任务
	,GROWUP = 2 -- 成长主线任务
	,SUBGROWUP = 3 -- 成长支线任务
	,ROLE = 4 -- 君主任务
	,EVERYDAY = 5 -- 日常任务
	,ONELINE = 6 -- 在线领奖任务
	,ACTIVITYVAL = 7 -- 活跃度任务
};

-- 活动任务的开始时间
TASK_STARTTIME = {
	SVR_OPEN = 1 -- 开服时间
	,FIRST_LOGIN = 100 -- 首登时间
	,MAX_FIRST_LOGIN = 199 -- 最大首登时间
};

-- 任务达成类型
TASK_FINISH_TYPE = {
	FIRST_ROLELOGIN = 1 --T_首次登录  val1=登录的第几天
	,FAVORITE_URL = 2 -- T_添加收藏夹
	,FIRST_RECHARGE = 3 -- T_首次充值
	,BUILD_UPGRADE_USEGOLD = 5 -- T_使用礼金立即完成1个建筑
	,PLANT_ONE_FARMBLOCK = 6 -- T_种植一块资源田
	,FARMPOPU = 7 -- T_农场劳动的人口达到 val1=人口个数
	,HAS_BUILD = 8 -- T_拥有建筑 val1=建筑id val2=level val3=个数
	,USE_ITEM = 9 -- T_使用道具 val1=道具id
	,CARRY_SOLDIER = 11 -- T_令武将统率士兵 val1=士兵id val2=个数
	,TAOFA_COPYFIELD = 12 -- T_讨伐副本 val1=副本id
	,DANTIAO_FIELD = 13 -- T_单挑野地 val1=野地等级
	,FINISH_PRESTIGE_TASK = 14 -- T_完成1次声望任务
	,WIN_ACT_TOWER = 15 -- T_战胜千层塔 val1=层数
	,JION_ACT_BZQJ = 16 -- T_参加1次百战千军活动 
	,TRAIN_SOLDIER = 17 -- T_士兵训练 val1=士兵id val2=士兵个数
	,MAX_POPU = 18 -- T_人口上限达到 val1=人口上限值
	,LEARN_CULTURE = 19 -- T_学习国学 val1=国学id val2=国学等级
	,MENOY_OUTPUT = 21 -- T_钱币时产量  val1=产量值
	,CITY_LEVEL = 22 -- T_城池升级  val1=城池等级
	,FINISH_GET_VITALITY_GIFT = 23 -- T_完成1次活跃度抽奖
	,FINISH_ONE_ROLETASK = 24 -- T_执行1次君主任务
	,ASSIGN_ROLE_ATTR = 25 -- T_分配君主属性
	,ASSIGN_HERO_ATTR = 26 -- T_分配武将属性
	,CONFER_HERO_OFFICAL = 27 -- T_册封武将
	,JION_ALLI = 28 -- T_加入个联盟
	,GET_ALLI_GIFT = 29 -- T_领取1次联盟福利
	,START_ONE_TRADINGAREA = 30 -- T_开始1次跑商
	,ADD_QQ_GROUP = 31 -- T_加入联盟Q群
	,STEEL_HERO = 32 -- T_执行1次武将修炼
	,STEEL_HERO_JING_MAI = 34 -- T_打通武将经脉
	,HAS_ONE_ARM = 35 -- T_拥有1件装备
	,HERO_UPGRADE = 36 -- T_武将升级 val1=武将等级
	,BUY_ONE_ARM = 37 -- T_购买1个装备
	,WEAR_HERO_ARM = 38 -- T_将1个装备穿戴在武将身上
	,CITY_BUILD_VAL = 39 -- T_建设度达到 val1=建设度的值
	,NEWSOLIDER_MAX = 40 -- T_新兵上限 val1=上限值
	,HAS_CITY_DEF = 41 -- T_现有城防御数量 val1=防御数量
	,SET_CITY_DEF_ARMY = 42 -- T_设定城防部队
	,BUILD_SUBCITY = 43 -- T_建造分城‘ val1=第几个分城
	,ROLE_UPGRADE = 44 -- T_君主升级‘ val1=君主等级
	,GET_ALL_FARMRES = 45 -- T_征收全部资源田
	,WATERING_TREE = 46 -- T_给摇钱树浇1次水
	,JION_ACT_TERRACE = 47 -- T_参与点将台活动一次
	,WIN_ACT_TERRACE = 48 -- T_点将台通关 val1=第几关
	,ALLI_MEM_NUM = 49 -- T_联盟成员人数 val1=联盟成员人数
	,STRONG_ARM = 50 -- T_装备强化
	,MERGE_GEM = 51 -- T_宝石合成
	,BESET_GEM = 52 -- T_宝石镶嵌
	,ZHANLING_FIELD = 53 -- T_占领野地 val1=野地等级
	,HAS_ITEM_NUM = 54 -- T_拥有道具 val1=道具id val2=道具数量
	,RECRUIT_HERO = 55 -- T_招募武将 val1=武将类别
	,ASSIGN_HERO_EXPS = 56 -- T_分配武将经验
	,USE_DOTBROWSER = 57 -- T_使用登陆器登录
	,ROLELOGIN_EVERYDAY = 58 -- 'T_每日登录'
	,GET_ALL_OTHERFARMRES = 59 -- 'T_摘取全部资源田'
	,FINISH_ONE_EVERYDAYTASK = 60 -- 'T_完成一次日常任务'
	,JION_ACT_TOWER = 61 -- 'T_参与千层塔活动一次'
	,GET_ALLICONTRI_BYCOMMITRES = 62 -- 'T_联盟捐献获得贡献'
	,FEED_LIGHTLAW = 63 -- 'T_圣兽喂养'
	,SPEED_BUILDING = 64 -- 'T_进行加速'
	,GET_RES_FROMFIELD = 65 -- 'T_野地采集'
	,PROVOKE_PLAYER =  66 -- 'T_挑衅玩家'
	,SUB_ITEM =  67 -- 'T_扣除道具'
	,HERO_INSIGHT_SKILL =  68 -- 'T_武将领悟技能'
	,HERO_LINEUP_ACTTOWER =  69 -- 'T_武将上阵'
	,BUILD_CITY_DEF = 70 -- 'T_开始建造城防数量' val1=防御id val2=防御数量
	,RECHARGE = 71 -- T_充值
	,GET_REWARD_BY_PRESTIGE = 72 -- 'T_领取声望每日奖励' *** 
	,FIGHT_PLAYER_FOR_HONOR = 73 -- 'T_发起跨国荣誉战' *** 
};

--  服务器当日活动类型
SVR_TODAY_ACT_TYPE = {
	HERO_STEEL_2 = 1 --  修炼双倍
	,HERO_STEEL_3 =  2 --  修炼三倍
	,ACT_TERRACE_IF_2 =  3 --  点将双倍
	,ACT_TERRACE_IF_3 =  4 --  点将三倍
	,ACT_TERRACE_TIMES_1 =  5 --  点将多次
	,ACT_TOWER_EXP_2 =  6 --  闯塔双倍
	,ACT_TOWER_EXP_3 =  7 --  闯塔三倍
	,ACT_TOWER_RECOVER_10 =  8 --  闯塔恢复10%
	,ACT_TOWER_RECOVER_20 =  9 --  闯塔恢复20%
	,ACT_TOWER_TIMES_1 =  10 --  闯塔多次
	,ACT_PAY_1 =  11 --  充值活动1
	,ACT_MAX = 1000
};

-- 保存到服务器上的配兵布阵类型
FORCELINE_TYPE = {
	COMM = 1
	,ACTTOWER = 2
	,WORLDBOSS = 3
};


VIP_EFF = {
	SKIP_TOWER =1 --V_千层塔跳层免费补收益
	,SPEED_ROLETASK = 2 -- ,V_免费加速君主任务
	,CITY_MODEL = 3 --V_绚丽城池外观标识
	,TALK_TAG = 4 --V_聊天成就标识
	,SPEED_CULTURELEARN = 5 --V_免费无限次加速科技
	,SPEED_TRADING = 6 --V_连续跑商
	,ADD_ACTVAL = 7 --V_活跃度加分
	,ADD_EVERYDAYTASK = 8 --V_日常任务增加个数
	,SPEED_ACTCD = 9 --V_千层塔点将台过关耗时减少
	,ADD_MONEY_OUTPUT = 10 --V_基础钱币产量增加
	,ADD_PKG_COUNT = 11 --V_背包容量增加
	,ADD_FRIEND_COUNT = 12 --V_好友仇人上限增加
	,ADD_FARM_PROTECT_TIME = 13 --V_农场保护时间加长
	,ADD_BUILD_QUEUE = 14 --V_增加免费建筑队列
	,ADD_BUILD_AUTO_QUEUE = 15 --V_增加自动建造队列
	,PAY = 16 -- V_充值 
	,ADD_COMMRES_OUTPUT = 17 -- V_基础资源产量加成
	,ADD_LAWLIGHTFEED_TIMES = 18 -- V_增加联盟圣兽喂养次数
	,ADD_TRADING_GET = 19 -- V_增加跑商收益
	,ADD_TOWER_EXP_GET = 20 -- V_千层塔经验加成
	,HERO_HIGH_STEEL = 21 -- V_武将开启黄金白金修炼模式
	,VIP_ITEM = 22 -- V_可优惠购买VIP礼包
};



