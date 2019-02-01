//属性的精度
ATTR_PRECISION = 1000;

/** 系统消息类型 */
SMSGT = {
	POP : 0 //弹出提示
	,SYSCHANNEL : 1 //频道提示
	,SHOWPOP : 2 //布告栏展示
	,POPMSGBOX : 3 //弹出对话框
	,CHAT_CHANNEL: 4 // 聊天频道
	,SYS_POPBAR: 5 // 系统广播提示条
	,NPC_MSG: 6 // NPCBOX
};

/** 群组的职位 */
GROUP_POS ={
	COMM:0
	,ASSIST:1
	,ADMIN:2
};

/** 英雄的职位 */
HERO_STATE = {
	FREE:0 //空闲
	,EXPED:1 //出征
	,STEEL:2 //修炼
	,ACT:3 //活动
	,DISPATCHFIELD:4 //派遣到野地
	,ACT_TOWER:5 //千层塔
	,ACT_TERRACE:6 //点将台
	,ACT_WORLDBOSS:7 //世界boss
};

HERO_LOCKSTATE = {
	NONE : 0
	,LOCKED : 1
	,UNLOCKING : 2
};


/** 对象类型 */
OBJ_TYPE = {
	NONE:0
	,ROLE:1
	,HERO:2
	,GROUP:3
	,FIELD:4 
	,COPYFIELD:5 
	,NPCFIELD : 6
	,TOWER : 7
	,OWNERFIELD : 8
	,CITYPOS : 9	
	,DIED_ROLE : 10	
	,INVALID : 100
};

/** 虚拟按键 */
VK_KEY={
	RETURN : 13
	,SPACE : 32
	
	,SHIFT : 16
	,CONTROL : 17
	
	,UPARROW : 38
	,DOWNARROW : 40
	
	,NUM_0 : 48
	,A	: 65
	,C	: 67
	,D	: 68
	,X	: 88
	,Y	: 89
	,Z : 90
	
	,LWIN : 91
	,SLEEP : 95
	
	,NUMPAD0	:	96	//小数字键盘0键
	,DIVIDE	:	111 //除号键
	
	,F1	:	112
	,F5	:	116
	,F24	:	135
	
	,NUMLOCK	:	144	//Num Lock键
	,SCROLL	:	145	//Scroll Lock键
	,LSHIFT	:	160	//左Shift键
	,RSHIFT	:	161	//右Shift键
	,LCONTROL	:	162	//左Ctrl键
	,RCONTROL	:	163	//右Ctrl键
	,LMENU	:	164	//左Alt键
	,RMENU	:	165	//右Alt键	
	
};

/** 任务目标 */
RES_TATTR ={
	NONE : 0
	,ADDFAVORITE : 1		// 添加
	,RECOMMEND : 2			// 推荐朋友
	,KILLMONSTER : 3		// 杀怪
	,UPLEVEL : 4			// 已达等级
	,FINDNPC : 5			// 已找到xxxnpc
	,FINDMONSTER : 6		// 已找到xxx怪物
	,FINDPLAYER : 7			// 已找到xxx玩家
	,FINDITEM : 8			// 已找到xxx物品
	,REACHPOS : 9			// 已到达xxx位置
	,GIVEAS: 10			// 赠送xxx给xxx
	,GAINWHOGIFT: 11		// 得到要赠与xxx的物品
};

/** 物种类别 */
G_EID = 0;
RES_CLS = {
	NONE : G_EID++							// 无类别
	
	,COMMRES : G_EID++					// 普通资源
	,OBUILD : G_EID++						// 外城资源
	,IBUILD : G_EID++						// 内城建筑
	,CULTURE : G_EID++					// 国学
	,HERO : G_EID++							// 英雄
	,SOLDIER : G_EID++						// 士兵
	,CITYDEF : G_EID++					// 城市防御
	,TASK : G_EID++							// 任务
	,PKGITEM : G_EID++					// 包裹物品（所有）
		,EQUIPITEM : G_EID++				// 装备道具
			,HEROEQUIPITEM : G_EID++	// 英雄装备道具
			,ROLEEQUIPITEM : G_EID++	// 君主装备道具
		,CANUSEITEM: G_EID++			// 可用道具
		,SPEEDITEM: G_EID++				// 加速道具
		,BOOKITEM: G_EID++				// 书籍道具
		,GEMITEM: G_EID++					// 灵石道具
			,ST_GEMITEM: G_EID++					// 力量灵石道具
			,AG_GEMITEM: G_EID++					// 身法灵石道具
			,PH_GEMITEM: G_EID++					// 根骨灵石道具
			,CO_GEMITEM: G_EID++					// 统率灵石道具
		,TASKITEM: G_EID++				// 任务道具
		,OTHERITEM: G_EID++				// 除去装备和用品外的其他道具
		,MY_AUCTION_ITEM: G_EID++	// 我正在竞拍的道具
	,STRATEGY : G_EID++					// 计谋
	,SKILL : G_EID++							// 技能
	,NPC : G_EID++							// NPC资源
	,FIGHTMAP : G_EID++					// 战斗地图
	,CITYMAP : G_EID++					// 城市地图
	,WORLDMAP : G_EID++					// 世界地图
	
	,MAX : G_EID++
};

/** 民心状态 */
MORALE_STATE = {
	STABLE:0	//稳定
	,RISE:1		//上升
	,DROP:2		//下降
};

/** 人口状态 */
POPU_STATE = {
	STABLE:0	//稳定
	,RISE:1		//上升
	,DROP:2		//下降
};

/** 建筑状态 */
BUILD_STATE = {
	COMM:0
	,UPGRADE:1
	,DOWN:2
	,BUILD:3
	,LEARNSKILL:4
};

/** 战斗状态 */
FIGHT_STAT = {
	NONE : 0 // 无战斗状态
	,WAITMOVE : 1 // 等待移动状态
	,WAITATTACK : 2 // 等待攻击状态
	,WAITDEAL : 3// 等待使用治疗状态
	,WAITFRIEND : 4 // 等待队友发指令状态
	,WAITENEMY : 5 // 等待对方发指令状态
	,AUTOFIGHT : 6 // 自动战斗状态
	,FIGHTRESULT : 7 // 战斗结果状态
};

/** 战斗回合状态 */
FROUND_STAT = {
	SELF:0
	,FRIEND:1
	,ENEMY:2
	,AUTOFIGHT:3
};

/* 战斗中actor的标志 */
FACTOR_FLAG = {
	SELF_BUIDING : 0
	,SELF_BUIDED : 1
	,SELF_HERO : 2
	,SELF_SOLDIER : 3
	
	,FRIEND_BUIDING : 30
	,FRIEND_BUIDED : 31
	,FRIEND_HERO : 32
	,FRIEND_SOLDIER : 33
	
	,ENEMY_BUIDING : 60
	,ENEMY_BUIDED : 61
	,ENEMY_HERO : 62
	,ENEMY_SOLDIER : 63
};

/** 城防地块的标志 */
CDBLOCK_FLAG = {
	NOMARL: 0
	,CAN_BUILD_LAND_CD : 0x1
	,CAN_BUILD_WATER_CD : 0x2
};

// 攻击效果属性
ATTACK_EFFECT = {
	STRONG 			: 1,	// 暴击
	MISS 				: 2,	// 未击中
	ADDHP 				: 3,	// 加血
	SUBHP	 			: 4,	// 减血
	ADDMP 				: 5,	// 加魔
	SUBMP 				: 6,	// 减魔
	DEAD 				: 7,	// 死亡
	COMA 				: 8,	// 昏迷
	REVIVE				: 9	// 复活
};

FRESULT_RET = {
	WIN:0
	,FAIL:1
};

ITEM_WHERE = {
	PKG:0
	,HEROWEAR:1
};

/** 军队类别 */
ARMY_TYPE = {
	SELF:1
	,ENEMY:2
	,ALLI:3
};

/** 军事动态状态 */
ARMYDYN_STATE = {
	GOTO:0 // 前往
	,FIGHT:1 // 战斗
	,RETURN:2 // 返回
	,DISPATCH:3 // 派遣
	,COLLECT:4 // 采集
};

/** 军事动态行为 */
ARMYDYN_ACT = {
	PLUNDER:0 // 掠夺
	,COLLECT:3//采集
};

/** 战斗类型 */
FIGHT_TYPE = {
	AUTO:0 //自动战斗
	,MANUAL:1 //手工操作 
};


ROLE_SEX = {
	MALE:0
	,FEMALE:1
	,NONE:2
};

/** 联盟职位 */
ALLI_POS = {
	NONE:0
	,MEM:1 // 普通成员
	,ELDER:2 // 长老
	,ALEADER:3 // 副盟主
	,LEADER:4 // 盟主
};

/** 联盟操作 */
ALLI_OP={
	UPALLI:1
	,UPBUILD:2
	,INVITE:3
	,TRANSFER:4
	,SUBSCRIBE:5
	,SAVEQQ:6
	,EVENTS:7
	,DISMISS:8
	,QUIT:9
	,MODIFYINTRODUCE:10
	,MODIFYBULLETIN:11
	,KICK:12
	,APPOINTALEADER:13
	,APPOINTELDER:14
	,FIREALEADER:15
	,FIREELDER:16
	,UPSKILL:17
};

ROLE_STATE={
	FREE:0 // 正常状态
	,YOUNG:1 // 新手状态
	,REST:2 // 免战状态
};

/** 联盟职位对应的操作 */
ALLI_POS_OP = [
	[] // NONE
	,[ALLI_OP.SUBSCRIBE,ALLI_OP.EVENTS,ALLI_OP.QUIT]// MEM
	,[ALLI_OP.INVITE,ALLI_OP.SUBSCRIBE,ALLI_OP.EVENTS,ALLI_OP.QUIT]// ELDER
	,[ALLI_OP.UPBUILD,ALLI_OP.INVITE,ALLI_OP.SUBSCRIBE
		,ALLI_OP.SAVEQQ,ALLI_OP.EVENTS,ALLI_OP.MODIFYINTRODUCE,ALLI_OP.MODIFYBULLETIN
		,ALLI_OP.KICK,ALLI_OP.APPOINTELDER,ALLI_OP.FIREELDER,ALLI_OP.QUIT]// ALEADER
	,[ALLI_OP.UPALLI,ALLI_OP.UPBUILD,ALLI_OP.UPSKILL,ALLI_OP.INVITE,ALLI_OP.TRANSFER,ALLI_OP.SUBSCRIBE
		,ALLI_OP.SAVEQQ,ALLI_OP.EVENTS,ALLI_OP.DISMISS,ALLI_OP.MODIFYINTRODUCE,ALLI_OP.MODIFYBULLETIN
		,ALLI_OP.KICK,ALLI_OP.APPOINTALEADER,ALLI_OP.APPOINTELDER,ALLI_OP.FIREALEADER,ALLI_OP.FIREELDER]//LEADER
];

/** 地图类型 */
CITY_FLAG = {
	MAIN : 0
};

/** 农场操作状态 */
FARMOP_STATE = {
	SEL:0
	,INPUT:1
	,INIT:2
	,GET:3
	,PREGET:4
};

/** 农场块的状态 */
FARM_STATE = {
	SAPLING : 0
	,GROWUP : 1
	,COMPLETE : 2
};

/** 农场日志类型 */
FARMLOG_TYPE = {	
	GETSELF : 1 // 摘取自己的资源
	,GETOTHER : 2 // 摘取别人的资源
	,OTHERGET : 3 // 别人偷我的资源
};

/** 出征类型 */
EXPED_TYPE = {
	FIRST : 1//
	,TAOFA : 1 //
	,DANTIAO : 2 //
	,CUIHUI : 3 //
	,TIAOXIN : 4 //
	,PAIQIAN : 5 //
	,ZHANLING : 6 //
	,ACT_TOWER : 7 //
	,ACT_TERRACE : 8 //
	,ACT_WORLDBOSS : 9 //
};

/** 和其他玩家的战争状态 */
REF_ROLESTATE = {
	NORMAL : 0 // 正常
	,DECLARING_FIGHT : 1 // 宣战状态
	,FIGHTING : 2 // 战斗状态
};

/** 健康类别 */
HEALTH_TYPE = {
	HEALTH : 0 // 健康
	,FLESH_WOUND : 1 //  轻伤
	,DEEP_WOUND : 2 // 重伤
};

/** 城防类型 */
CITYDEF_TYPE = {
	FIRST : 1
	,XIANJING : 1 // 陷阱
	,GUNMU : 2  //  滚木
	,JUMA : 3 //  拒马
	,LEISHI : 4 // 礌石
	,NUJIAN : 5 // 弩箭
};

/** 战斗actor类型 */
ACTOR_TYPE = {
	COMM : 0
	,WALL : 1
	,HERO : 2
	,SOLDIER : 3
	,DEF : 4
	,TOWER : 5
};

BUILDCITY_ID = {
	NONE:-1
	,ALL:0
	,MAIN : 1
	,SUB1 : 2
	,SUB2 : 3
	,SUB3 : 4
	,SUB4 : 5
	,ALLI : 6
};

CITY_TYPE = {
	NONE : 0
	,MAIN : 1
	,SUBRES : 2
	,SUBARMY : 3
};

ALLBUILDSGROUP_TYPE = {
	NONE : -1
	,CITY : 0
	,ALLI : 1
	,CULTURE : 2
	,CITYDEF : 3
};

//武将修炼类型
HSTEEL_TYPE ={
	FIRST : 0
	,COMM : 0 //普通修炼
	,HIGH : 1 //高级修炼
	,VIP1 : 2 //黄金修炼
	,VIP2 : 3 //白金修炼
	,LAST : 3
};

CITYTYPE_MAP_RESIDS = TQ.pairListToDict([CITY_TYPE.SUBRES, 170401, CITY_TYPE.SUBARMY, 170402]);

//战斗状态
FIGHT_RESULT = {
	INPROCESS : 0
	,ATTACKSUCC : 1
	,ATTACKFAIL : 2
};

//聊天对象
CHAT_TARGET = {
	WORLD : 0
	,STATE : 1
	,ALLIANCE : 2
	,PLAYER : 3
};

/** 聊天面板的提示标签类型 */
CHAT_TAG = {
	SYS:0
	,WORLD:1
	,ALLIANCE:2
	,STATE:3
	,PRIVATE:4
	,PROMPT:5
};

/** 聊天发布消息的系统玩家 */
CHAT_SYSPLAYER = {
	STATE : 0
	,ALLIANCE : 1
	,SYS : 2
	,MAX : 3
};

/** 聊天频道 */
CHAT_CHANNEL = {
	ALL : 0
	,STATE : 1
	,ALLIANCE : 2
	,PRIVATE : 3
	,WORLD : 4
	,MAX : 5
};

/** 任务状态 */
TASK_STATE = {
	WAIT_COMPLETE:0
	,WAIT_GET:1
	,COMPLETE:2
	,CANNOTDO:3
	,CANDO:4
	,DOING:5
};

/** 保存到服务器上的配兵布阵类型 */
FORCELINE_TYPE = {
	COMM : 1
	,ACTTOWER : 2
	,WORLDBOSS : 3
};