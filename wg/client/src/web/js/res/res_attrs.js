/*
------------------
基本属性值的表示:
	attr:{id:xx,val:xx,u:xx}   -- {id, 数值, 单位}
	attrs:[attr1,attr2,...]
	
-----------
buff的概念
	主动式:
		可触发的次数/回合数，触发的时间间隔
	被动式:
		可触发的次数/回合数 或 持续的时长
	{  
	    type:0/1/2/3,  --即时主动/即时被动/回合主动/回合被动
	    count:100 --剩余可触发次数/回合数
	    interval: 1 --单位秒（每次的时间间隔，当即时时配合count使用）
	    time:1 --单位秒（可持续的最长时间，和count与interval不能并存）
	}
	
	每次触发的就是效果
	{id:xx,val:xx,u:xx}
	
	一个完整的buff结构
	buff = {
		type:0/1/2/3,  --即时主动/即时被动/回合主动/回合被动
		count:100 --剩余可触发次数/回合数
		interval: 1 --单位秒
		time:1 --单位秒
		creator:{skillid:100001,level:10} --buff的生成者(目前已知的是技能)
		eattr:{id:xx,val:xx,u:xx} --每次触发的效果
	}

---------
效果属性
	eattr:{id:xx,val:xx,u:xx} {id, 数值, 单位}
*/

// --------------------------------- 基础属性 ----------------------------------
/*
<<attr1>>
xp(Experience)经验值
	xp.c(current)--当前经验值
	xp.n(nextneed)--升到下级需要的经验值
hp气血
	hp.c(current)--当前血量
	hp.m(max)--当前最大血量
mp魔法
	mp.c(current)--当前魔法值
	mp.m(max)--当前最大魔法值
ps(physical strength)体力
	ps.c(current)--当前体力
	ps.m(max)--当前最大体力
lo(loyalty)忠诚
sa(Salary)俸禄
an(Angry)愤怒
	an.c(current)--当前愤怒值
	an.m(max)--当前最大愤怒值
mr(move radius)移动半径
ar(attack range type)攻击范围类型
	

<<attr2>>
--一下所有的 x.b--表示基础的  x.a--表示后续添加的
in(Interior)内政
ph(Physical)体质
ma(Magic)魔力
st(strength)力量
en(Endurance)耐力
ag(Agile)敏捷
pp(Potential point)潜力点


<<attr3>>
co(Command)统率
hi(Hit)命中
hu(Hurt)伤害
de(Defense)防御
sp(speed)速度
es(Escape)躲避
ma(Mana)灵力

<<attr4>>--资质
at(Attack)攻击资质
de(Defense)防御资质
ph(Physical)体力资质
ma(Magic)法力资质
sp(speed)速度资质
es(Escape)躲闪资质
gr(Growth)成长
el(Element)五行

<<other>>
dur(Durability)装备耐久
效果属性 {id:107,val:10,u:1}  -- {id:效果类型,val:效果值,u:0表示值,1表示百分数}
*/
/*
G_EID = 0;
ATTR = {
	NONE : G_EID++,		// 无
	LVL : G_EID++,		// (Level)等级
	//<<attr1>>
	XP : G_EID++,		// (Experience)经验值
	NXP : G_EID++,		// (Next experience)升到下级需要的经验值
	PS : G_EID++,		// (physical strength)体力
	MPS : G_EID++,		// 最大体力
	AN : G_EID++,		// (Angry)愤怒
	MAN : G_EID++,		// 最大愤怒
	MO : G_EID++,		// (morale)士气
	MMO : G_EID++,		// 最大士气
	HEALTH: G_EID++, 	// 当前健康度
	MHEALTH: G_EID++,// 最大健康度
	IF : G_EID++,			// ( inner force)内功
	MIF : G_EID++,		// ( max inner force)内功的上限
	STP: G_EID++, 		// 当前的计谋点
	MSTP: G_EID++, 	// 最大的计谋点
	AF: G_EID++,			// 当前兵力
	MAF: G_EID++,		// 最大兵力
	XPS : G_EID++,		// 经验池当前值
	MXPS : G_EID++,	//  经验池最大值
	
	//<<attr2>>
	IN_B : G_EID++,		// (Interior)内政
	IN_A : G_EID++,		// (Interior)内政
	FOR_B : G_EID++,	// 武力force
	FOR_A : G_EID++,	// 武力force
	BR_B : G_EID++,		// 智力brains
	BR_A : G_EID++,		// 智力brains
	
	PH_B : G_EID++,		// (Physical)体质(根骨)
	PH_A : G_EID++,		// (Physical)体质(根骨)
	ST_B : G_EID++,		// (strength)力量
	ST_A : G_EID++,		// (strength)力量
	AG_B : G_EID++,		//(Agile)敏捷
	AG_A : G_EID++,		//(Agile)敏捷
	
	PP : G_EID++,			//(Potential point)潜力点
	
	//<<attr3>>
	CRE : G_EID++,		// (Credit)武勋
	CO : G_EID++,		// (Command)统率
	HI : G_EID++,			// (Hit)命中
	HU : G_EID++,		// (Hurt)攻击伤害
	DE : G_EID++,		// (Defense)防御
	SP : G_EID++,		// (speed)速度
	ES : G_EID++,		// (Escape)闪避
	BER : G_EID++, 		// (Berserk attack percentage ) 会心暴击
	SFC : G_EID++, 		// (single fighting capacity ) 单挑力
	
	//<<natural attr>> 
	NAG : G_EID++,		// (Agile)敏捷(身法)
	NPH : G_EID++,		// (Natural Physical)体力资质(根骨)
	NST : G_EID++,		// (strength)力量资质
	
	//<<other>>
	MONEY: G_EID++,		// 钱币
	GOLD: G_EID++,			// 金币
	GIFTGOLD: G_EID++,	// 礼金
	IDLEPOPU : G_EID++,	// 空闲人口
	
	NAF : G_EID++, 			// 当前新兵兵力
	MNAF : G_EID++,		// 最大新兵兵力
	NAFO : G_EID++,			// 当前新兵产出/小时
	
	FC : G_EID++, 		// (fighting capacity ) 战力
	
	HP : G_EID++,		// (hp) 生命 
	MHP : G_EID++,		// (max hp)最大生命
	UHP : G_EID++,		// (unit hp) 作战单位生命 	
	
	JIN_SKILL_LEVEL : G_EID++, // 金系等级
	MU_SKILL_LEVEL : G_EID++, // 金系等级
	SHUI_SKILL_LEVEL : G_EID++, // 水系等级
	HUO_SKILL_LEVEL : G_EID++, // 火系等级
	TU_SKILL_LEVEL : G_EID++, // 土系等级
	
	PRESTIGE : G_EID++, // 声望
	
	MAX : G_EID++
};
*/

//占用的人口, 占用空间
res_attrs = [
	{
		id:ATTR.NONE
		,name:'NONE'
	}
	,{
		id:ATTR.LVL
		,name:'等级'
	}
	,{
		id:ATTR.XP
		,name:'当前经验'
	}
	,{
		id:ATTR.NXP
		,name:'下级经验'
	}
	,{
		id:ATTR.PS
		,name:'精力'
	}
	,{
		id:ATTR.MPS
		,name:' 最大精力'
	}
	,{
		id:ATTR.AN
		,name:' 愤怒'
	}
	,{
		id:ATTR.MAN
		,name:' 最大愤怒'
	}
	,{
		id:ATTR.MO
		,name:' 士气'
	}
	,{
		id:ATTR.MMO
		,name:' 最大士气'
	}
	,{
		id:ATTR.HEALTH
		,name:' 健康'
	}
	,{
		id:ATTR.MHEALTH
		,name:' 最大健康'
	}
	,{
		id:ATTR.IF
		,name:' 内功'
	}
	,{
		id:ATTR.MIF
		,name:' 最大内功'
	}
	,{
		id:ATTR.STP
		,name:' 计谋'
	}
	,{
		id:ATTR.MSTP
		,name:' 最大计谋'
	}
	,{
		id:ATTR.AF
		,name:' 兵力'
	}
	,{
		id:ATTR.MAF
		,name:' 最大兵力'
	}
	,{
		id:ATTR.XPS
		,name:' 经验池'
	}
	,{
		id:ATTR.MXPS
		,name:' 最大经验池'
	}
	,{
		id:ATTR.IN_B
		,name:' 内政'
	}
	,{
		id:ATTR.IN_A
		,name:' 内政'
	}
	,{
		id:ATTR.FOR_B
		,name:'武力'
	}
	,{
		id:ATTR.FOR_A
		,name:'武力'
	}
	,{
		id:ATTR.BR_B
		,name:'智力'
	}
	,{
		id:ATTR.BR_A
		,name:'智力'
	}
	,{
		id:ATTR.PH_B
		,name:'根骨'
	}
	,{
		id:ATTR.PH_A
		,name:'根骨'
	}
	,{
		id:ATTR.ST_B
		,name:'力量'
	}
	,{
		id:ATTR.ST_A
		,name:'力量'
	}
	,{
		id:ATTR.AG_B
		,name:'身法'
	}
	,{
		id:ATTR.AG_A
		,name:'身法'
	}
	,{
		id:ATTR.PP
		,name:'潜力'	
	}
	,{
		id:ATTR.CRE
		,name:'武勋'
	}
	,{
		id:ATTR.CO
		,name:'统率'
	}
	,{
		id:ATTR.HI
		,name:'命中'
	}
	,{
		id:ATTR.HU
		,name:'攻击'
	}
	,{
		id:ATTR.DE
		,name:'防御'
	}
	,{
		id:ATTR.SP
		,name:'速度'
	}
	,{
		id:ATTR.ES
		,name:'闪避'
	}
	,{
		id:ATTR.BER
		,name:'会心'
	}
	,{
		id:ATTR.SFC
		,name:'单挑力'
	}
	,{
		id:ATTR.FC
		,name:'战力'
	}
	,{
		id:ATTR.NAG
		,name:'身法资质'
	}
	,{
		id:ATTR.NPH
		,name:'根骨资质'
	}
	,{
		id:ATTR.NST
		,name:'力量资质'
	}
	,{
		id:ATTR.MONEY
		,name:'钱币'
	}
	,{
		id:ATTR.GOLD
		,name:'金币'
	}
	,{
		id:ATTR.GIFTGOLD
		,name:'礼金'
	}
	,{
		id:ATTR.IDLEPOPU
		,name:'空闲人口'
	}
	,{
		id:ATTR.NAF
		,name:'新兵兵力'
	}
	,{
		id:ATTR.MNAF
		,name:'新兵兵力上限'
	}
	,{
		id:ATTR.NAFO
		,name:'新兵产出'
	}
	,{
		id:ATTR.HP
		,name:'血量'
	}
	,{
		id:ATTR.JIN_SKILL_LEVEL
		,name:'金系技能等级'
	}
	,{
		id:ATTR.MU_SKILL_LEVEL
		,name:'木系技能等级'
	}
	,{
		id:ATTR.SHUI_SKILL_LEVEL
		,name:'水系技能等级'
	}
	,{
		id:ATTR.HUO_SKILL_LEVEL
		,name:'火系技能等级'
	}
	,{
		id:ATTR.TU_SKILL_LEVEL
		,name:'土系技能等级'
	}
].sort(G_ID_ASCCOMP);

// --------------------------------- 效果属性 ----------------------------------
G_EID = 0;
EATTR = {//effect attr
	NONE : G_EID++,		// 无
	ADDMAXHP : G_EID++ 	// 增加血量的最大上限
};

res_effectattrs = [
	{
		id:EATTR.ADDMAXHP,
		name:'生命上限'
	}
].sort(G_ID_ASCCOMP);

/** 英雄属性显示列表 */
res_heroattrs = [
	{name:'率兵量：', attrs:[ATTR.CA, ATTR.MCA]}
	,{name:'体　力：', attrs:[ATTR.PS, ATTR.MPS]}
];