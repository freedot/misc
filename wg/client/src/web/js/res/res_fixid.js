/*------------------------------------------------------------------------------------
[item]字段意义说明
id:				道具id
bigpic:				道具的大图标
smallpic:			道具的小图标
saleprice:			出售价格
name:				名称
sname：			简要名称
desc:				描述
pile:				最大堆叠个数，当最大堆叠个数为1时，背包中个数不显示

// 道具使用相关---
useconfirm:			使用时是否需要二次确认

canuse:			该道具是否可以被使用
  {
    comm:true,  		普通状态下可以用
    fight:true,  		战斗状态下可以用
  }
targets:			该道具可使用到得对象类型
  [
    RES_TRG.XXX,
    ...
  ]
  
attrange：			攻击范围类型（用于英雄/士兵/技能/道具/城防建筑）

apos:				装备位置（用于装备）
maxdur:			装备最大耐久度

attrref:			道具关联的某个将领的某个属性
   {herostate: HERO_STATE.CHIEF, attr:ATTR.PS},
   
buyprice:[0,5,5]		道具购买的价格[钱币、金币、礼金]

// 地图
mapsize:{cx:960,cy:960}, 	地图大小
img:'fightmap.jpg',		大地图
simg:'fightmap.jpg',		缩小的地图
buildtips: [ 			区域提示
	{idx:0,type:1,tip:'在此处可建造城防单位',rect:[128,0,192,384]},
	{idx:1,type:1,tip:'在此处可建造城防单位',rect:[384,128,192,192]},
	{idx:2,type:1,tip:'在此处可建造城防单位',rect:[640,0,192,384]},
	{idx:3,type:2,tip:'在此处可建造护城河单位',rect:[384,416,192,32]}
]

// 士兵  base attrs
battrs:			生命，攻击，防御，移动速度，负重，口粮，占用的人口
  {hp:0,att:0,def:0,speed:180,weight:200,foodpay:2,popu:1}
skills:[]  			会的技能（士兵/城防建筑）/城防建筑可以（通过国学）升级
outlay:			治疗费用/劝说费用/招降费用（伤兵/俘虏）
  {treat:1,pers:1,summon:1}
  
// 城防建筑  base attrs
battrs:			生命，攻击，防御，占用空间(和士兵的有重叠的部分)
  {hp:0,att:0,def:0,space:1}
showlayer:50,  		物件单元所在的层次(显示上的)
needs:				穿戴该装备的需求（都是对值）（用于装备）
  [{attr:ATTR.LVL,val:20}]
expends:			使用消耗（用于技能）（都是对值）
  [{attr:ATTR.MP,val:'HLVL/5+2'}]
expends:			使用消耗（用于计谋）（都是对值）
  [{resid:2000002,val:1}]

// 技能表
最大等级
攻击目标
目标个数(公式)
使用消耗(公式)
冷却时间(回合数)
效果属性--{效果类型/作用对象/效果单位/效果数值}
可否暴击
攻击范围(列表)

//技能学习表
门派技能
生活技能

//buff表
@see res_attrs.js
------------------------------------------------------------------------------------*/
FIXID = {//手工维护
	FIRSTCITYDEF:150101
	,ARMGRID:1001
	,SELFDIRECT:1002
	,FARM:100001
	,TIMBERYARD:100002
	,QUARRY:100003
	,IRONORE:100004
	,EMPTYFARMBLOCK:100005
	,NEXTFARMBLOCK:100006
	
	,ACT_TERRACE_NPC : 7000001
	,ACT_TOWER_NPC : 7000002
	,ACT_WORLD_BOSS : 7000003
	,WORLDBOSSFIELD : 174001
	
	,GOLD:10001
	,GIFTGOLD:10002
	,FOOD:20001
	,WOOD:20002
	,STONE:20003
	,IRON:20004
	,MONEY:20005
	,POPU:20007
	,IDLEPOPU:20008
	,ROLEEXP:20009
	,HEROSEXP:20012
	,ROLEPS:20013
	
	,ACT_TOWER_STARTID:172001
	,HEIMULING : 3000229
	
	
	
	
	,EDICT:2000003 //讨逆圣旨
	,ARMYMOVE:2500002 //行军令
	,ALLIBUILDITEM:2000004 //虎符
	,CITYLEVEL:20011
	
	,PIPSTART:100011
	,PIPEND:100026
	
	,FIRSTINBUILD:110001
	,LASTINBUILD:110022
	
	,FIRSTALLIBUILD:110101
	,LASTALLIBUILD:110105
	,ALLISKILLBUILD:110101

	//国学科技
	,FIRSTCBUILD:120001
	,LASTCBUILD:120033
	
	
	,FIRSTSOLDIER:150001
	,LASTSOLDIER:150005	
	,FIRSTCDBUILD:160001
	,LASTCDBUILD:160005
	,DEFAULTSKILL:6001001
	,FIRSTSKILL:6001001	
	,LASTSKILL:7000000
	,FIRSTITEM:2000001
	,LASTITEM:5000000
	
	,SLEEVE:2000002//锦囊
	,FIRSTSTRATEGY:6000001
	,LASTSTRATEGY:6000021
	
	,JINGHUA1:5000001
	,JINGHUA2:5000001
	,JINGHUA3:5000001
	,JINGHUA4:5000001
	,JINGHUA5:5000001
	,FIRSTSTATECITY : 9900001
	,LASTSTATECITY : 9900013	
	,WORLDMAP : 9910001	
	,OUTFIELD : 9910002
	,MAINCITY : 9000001
	,SUBRESCITY : 9000002
	,SUBARMYCITY : 9000003
	
	,SUBCIVICITY : 9000004
	,NPCCITY : 9000005
	,FARMMAP : 9000006
	,ALLISKILLS:[]
	
	
	,FIRSTGEM:4500001
	,LASTGEM:4500040
	
	,FIRST_ST_GEM:4500001
	,LAST_ST_GEM:4500010
	
	,FIRST_AG_GEM:4500011
	,LAST_AG_GEM:4500020
	
	,FIRST_PH_GEM:4500021
	,LAST_PH_GEM:4500030

	,FIRST_CO_GEM:4500031
	,LAST_CO_GEM:4500040
	
	,MONEYPKGID:5500000 // 钱垛道具
};
