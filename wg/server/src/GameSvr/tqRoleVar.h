/** 该文件代码由工具tools_h自动生成，请勿手动修改。 01/12/15 20:29:51*/
#ifndef _tq_role_338saf3w3_var_h_
#define _tq_role_338saf3w3_var_h_
#include <pkgBits.h>
#include <pkgBase.h>


/**----------------const---------------*/
//tolua_begin
#define PKG_CUR_VER									 127
#define MAX_SQL_LEN									 2097152
#define MAX_ROLE_TABLE_CNT							 1
#define MAX_CITY_STATES_CNT							 32
#define MAX_INBUILD_CNT								 30
#define MAX_BUILDING_CNT							 6
#define MAX_CITY_CNT								 5
#define MAX_SELFFIELD_CNT							 11
#define MAX_ITEMS_CNT								 750
#define MAX_HOLES_CNT								 3
#define MAX_WEARS_CNT								 12
#define MAX_USERNAME_ARR_LEN						 33
#define MAX_USERNAME_LEN							 (MAX_USERNAME_ARR_LEN - 1)
#define MIN_USERNAME_LEN							 3
#define MAX_ROLENAME_ARR_LEN						 22
#define MAX_ROLENAME_LEN							 (MAX_ROLENAME_ARR_LEN - 1)
#define MIN_ROLENAME_LEN							 3
#define MAX_HERONAME_ARR_LEN						 19
#define MAX_HERONAME_LEN							 (MAX_HERONAME_ARR_LEN - 1)
#define MIN_HERONAME_LEN							 2
#define MAX_CITYNAME_ARR_LEN						 22
#define MAX_CITYNAME_LEN							 (MAX_CITYNAME_ARR_LEN - 1)
#define MAX_TASKS_CNT								 500
#define MAX_ONLINE_TASKS_CNT						 4
#define MAX_EVERYDAY_TASKS_CNT						 10
#define MAX_ACT_TASKS_CNT							 100
#define MAX_HERO_CNT								 32
#define MAX_NEWHERO_CNT								 6
#define MAX_SLDS_CNT								 50
#define MAX_GEMBESET_CNT							 3
#define MAX_MAILTITLE_ARR_LEN						 46
#define MAX_MAISYSLCON_ARR_LEN						 4097
#define MAX_MAILCON_ARR_LEN							 751
#define MAX_MAILTITLE_LEN							 (MAX_MAILTITLE_ARR_LEN - 1)
#define MAX_MAISYSLCON_LEN							 (MAX_MAISYSLCON_ARR_LEN - 1)
#define MAX_MAILCON_LEN								 (MAX_MAILCON_ARR_LEN - 1)
#define MAX_BULLETINS_CNT							 16
#define MAX_BUDDYS_CNT								 300
#define MAX_BUDDYS_APPLY_CNT						 10
#define MAX_ROLEATTRS_CNT							 22
#define MAX_HEROATTRS_CNT							 37
#define MAX_SIMPLEHEROATTRS_CNT						 3
#define MAX_NEWHEROATTRS_CNT						 9
#define MAX_FARM_CNT								 120
#define MAX_CULTURE_CNT								 33
#define MAX_FARM_LOG_CNT							 50
#define MAX_SUBJECT_CNT								 5
#define MAX_HEROWEAR_CNT							 7
#define MAX_HERO_SKILL_CNT							 13
#define MAX_HERO_SCUT_CNT							 12
#define MAX_ITEM_ATTRS_CNT							 18
#define MAX_FAVORITE_CNT							 10
#define MAX_ENEMY_CNT								 300
#define MAX_SUCC_COPYFIELD_CNT						 30
#define MAX_LINEUP_CNT								 16
#define MAX_DEFAULTTEAM_HERO_CNT					 5
#define MAX_DEFAULTTEAM_CNT							 3
#define MAX_TEAM_HERO_CNT							 5
#define MAX_SELFARMY_CNT							 20
#define MAX_ENEMYARMY_CNT							 50
#define MAX_ALLIARMY_CNT							 10
#define MAX_PAIQIAN_ALLIARMY_CNT					 5
#define MAX_CITYDEF_CNT								 5
#define MAX_ROLEINTRO_ARR_LEN						 151
#define MAX_ROLEINTRO_LEN							 150
#define MAX_COLLECTOR_CNT							 10
#define MAX_INVITE_JOIN_ALLI_CNT					 10
#define MAX_ALLINAME_ARR_LEN						 22
#define MAX_TRADING_ROLES_CNT						 20
#define MAX_ACT_TERRACE_COUNT						 100
#define MAX_ACTREWARDS_CNT							 4
#define MAX_SIGNINREWARDS_CNT						 3
#define MAX_SIGNINREWARDS_CNT_EX					 4
#define MAX_ACTVALTASKS_CNT							 20
#define MAX_FORCELINEUPCFG_CNT						 2
#define MAX_YD_LVL_IDS_CNT							 15
#define MAX_BD_LVL_IDS_CNT							 15
#define MAX_BUY_ITEMS_CNT							 20
#define MAX_CTLCFG_BTIMAP_CNT						 4
#define MAX_PAYACT_GIFT_CNT							 10
#define MAX_WAIT_BUILDS_CNT							 20
#define MAX_CDKEY_CNT								 20
#define MAX_HELPTIP_CNT								 20
//tolua_end


/**----------------struct---------------*/

#pragma pack(push, 1)
/*
 *  已经完成的建筑结构
 */
struct SInBuild //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulId;												// 建筑位置id
	uint32 ulResId;												// 建筑资源id
	uint8 ucLevel;												// 建筑当前等级
	uint8 ucState;												// 建筑状态
	uint32 ulStoptime;											// 建筑将结束的时间
	uint32 ulDuration;											// 等待状态中的建筑需要的时间
	//tolua_end

	SInBuild():ulId(0),
		ulResId(0),
		ucLevel(0),
		ucState(0),
		ulStoptime(0),
		ulDuration(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulId, 1);
		D_UINT32(ulResId, 1);
		D_UINT8(ucLevel, 1);
		D_UINT8(ucState, 1);
		D_UINT32(ulStoptime, 1);
		D_UINT32(ulDuration, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulId, 1);
		E_UINT32(ulResId, 1);
		E_UINT8(ucLevel, 1);
		E_UINT8(ucState, 1);
		E_UINT32(ulStoptime, 1);
		E_UINT32(ulDuration, 1);
		return iPos;
	}
};//tolua_export


/*
 *  内城建筑列表结构
 */
struct SInBuildList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucTotal;												// 内城建筑个数
	SInBuild astInBuilds[MAX_INBUILD_CNT];						// 建筑列表的具体内容
	//tolua_end

	SInBuildList():ucTotal(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucTotal, 1);
		D_ARRAY_STRUCT(astInBuilds, ucTotal, MAX_INBUILD_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucTotal, 1);
		E_ARRAY_STRUCT(astInBuilds, ucTotal, MAX_INBUILD_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  城池资源
 */
struct SCityRes //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucLevel;												// 城堡等级
	uint32 ulBuildVal;											// 城堡建设度
	uint32 ulHurtBuildVal;										// 受损的建设度
	uint32 todayLostedBuildTime;								// 当日受损的建设度时间
	uint32 todayLostedBuildVal;									// 当日受损的建设度值
	int32 lIdlePopu;											// 空闲人口
	uint64 ullWood;												// 木材
	uint64 ullStone;											// 石料
	uint64 ullIron;												// 铁矿
	uint64 ullFood;												// 粮食
	uint64 ullMoney;											// 钱币
	uint32 ulMLastTime;											// 钱币最近一次的更新时间
	uint32 ulILastTime;											// 空闲人口最近一次的更新时间
	uint8 lastMaxLevel;											// 城堡上次的最大等级
	//tolua_end

	SCityRes():ucLevel(0),
		ulBuildVal(0),
		ulHurtBuildVal(0),
		todayLostedBuildTime(0),
		todayLostedBuildVal(0),
		lIdlePopu(0),
		ullWood(0),
		ullStone(0),
		ullIron(0),
		ullFood(0),
		ullMoney(0),
		ulMLastTime(0),
		ulILastTime(0),
		lastMaxLevel(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucLevel, 1);
		D_UINT32(ulBuildVal, 1);
		D_UINT32(ulHurtBuildVal, 1);
		D_UINT32(todayLostedBuildTime, 1);
		D_UINT32(todayLostedBuildVal, 1);
		D_INT32(lIdlePopu, 1);
		D_UINT64(ullWood, 1);
		D_UINT64(ullStone, 1);
		D_UINT64(ullIron, 1);
		D_UINT64(ullFood, 1);
		D_UINT64(ullMoney, 1);
		D_UINT32(ulMLastTime, 1);
		D_UINT32(ulILastTime, 1);
		D_UINT8(lastMaxLevel, 17);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucLevel, 1);
		E_UINT32(ulBuildVal, 1);
		E_UINT32(ulHurtBuildVal, 1);
		E_UINT32(todayLostedBuildTime, 1);
		E_UINT32(todayLostedBuildVal, 1);
		E_INT32(lIdlePopu, 1);
		E_UINT64(ullWood, 1);
		E_UINT64(ullStone, 1);
		E_UINT64(ullIron, 1);
		E_UINT64(ullFood, 1);
		E_UINT64(ullMoney, 1);
		E_UINT32(ulMLastTime, 1);
		E_UINT32(ulILastTime, 1);
		E_UINT8(lastMaxLevel, 17);
		return iPos;
	}
};//tolua_export


/*
 *  城池防御
 */
struct SCityDef //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 defs[MAX_CITYDEF_CNT];								// 城防数量列表
	uint32 stopTime;											// 当前正在建造城防的结束时间
	uint32 buildResId;											// 当前正在建造城防的资源id
	uint32 buildNumber;											// 当前正在建造城防的数量
	//tolua_end

	SCityDef():stopTime(0),
		buildResId(0),
		buildNumber(0){
		memset(defs, 0, sizeof(defs[0])*MAX_CITYDEF_CNT);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_ARRAY_UINT32(defs, MAX_CITYDEF_CNT, MAX_CITYDEF_CNT, 1);
		D_UINT32(stopTime, 1);
		D_UINT32(buildResId, 1);
		D_UINT32(buildNumber, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_ARRAY_UINT32(defs, MAX_CITYDEF_CNT, MAX_CITYDEF_CNT, 1);
		E_UINT32(stopTime, 1);
		E_UINT32(buildResId, 1);
		E_UINT32(buildNumber, 1);
		return iPos;
	}
};//tolua_export


/*
 *  effect结构定义
 */
struct SEffect //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 id;													// 效果id
	uint32 val;													// 效果值
	uint8 unit;													// 效果单位
	//tolua_end

	SEffect():id(0),
		val(0),
		unit(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(id, 1);
		D_UINT32(val, 1);
		D_UINT8(unit, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(id, 1);
		E_UINT32(val, 1);
		E_UINT8(unit, 1);
		return iPos;
	}
};//tolua_export


/*
 *  生产者结构定义
 */
struct SCreator //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 type;													// 生产者类型
	uint64 id;													// 生产者的id
	uint32 skillId;												// 生产者使用的技能id
	//tolua_end

	SCreator():type(0),
		id(0),
		skillId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(type, 1);
		D_UINT64(id, 1);
		D_UINT32(skillId, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(type, 1);
		E_UINT64(id, 1);
		E_UINT32(skillId, 1);
		return iPos;
	}
};//tolua_export


/*
 *  state结构定义
 */
struct SState //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 id;													// state的唯一id
	uint16 type;												// 效果类型
	uint32 startTime;											// 当前效果开始的时刻
	uint32 lastTime;											// 最近一次更新效果的时刻
	uint32 duration;											// 表示时长（秒）
	uint8 isOnline;												// 是否只有在线才计时间
	SCreator creator;											// 生产者
	SEffect effect;												// 效果
	//tolua_end

	SState():id(0),
		type(0),
		startTime(0),
		lastTime(0),
		duration(0),
		isOnline(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(id, 1);
		D_UINT16(type, 1);
		D_UINT32(startTime, 1);
		D_UINT32(lastTime, 1);
		D_UINT32(duration, 1);
		D_UINT8(isOnline, 1);
		D_STRUCT(creator, 1);
		D_STRUCT(effect, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(id, 1);
		E_UINT16(type, 1);
		E_UINT32(startTime, 1);
		E_UINT32(lastTime, 1);
		E_UINT32(duration, 1);
		E_UINT8(isOnline, 1);
		E_STRUCT(creator, 1);
		E_STRUCT(effect, 1);
		return iPos;
	}
};//tolua_export


/*
 *  State列表结构定义
 */
struct SStateList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// State列表的个数
	SState states[MAX_CITY_STATES_CNT];							// State列表的具体内容
	uint32 lastStateId;											// state最近一次的id
	//tolua_end

	SStateList():count(0),
		lastStateId(1000){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 1);
		D_ARRAY_STRUCT(states, count, MAX_CITY_STATES_CNT, 1);
		D_UINT32(lastStateId, 101);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 1);
		E_ARRAY_STRUCT(states, count, MAX_CITY_STATES_CNT, 1);
		E_UINT32(lastStateId, 101);
		return iPos;
	}
};//tolua_export


/*
 *  单个城市结构
 */
struct SCity //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucType;												// 城市的类型
	SInBuildList stInBuilds;									// 内城建筑列表
	//tolua_end

	SCity():ucType(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucType, 1);
		D_STRUCT(stInBuilds, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucType, 1);
		E_STRUCT(stInBuilds, 1);
		return iPos;
	}
};//tolua_export


/*
 *  二维坐标
 */
struct SPos //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int32 x;													// 横向x
	int32 y;													// 纵向y
	//tolua_end

	SPos():x(0),
		y(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT32(x, 1);
		D_INT32(y, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT32(x, 1);
		E_INT32(y, 1);
		return iPos;
	}
};//tolua_export


/*
 *  单个野地结构
 */
struct SSelfField //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 gridId;												// 野地的格子id
	uint32 startTime;											// 采集开始的时间
	uint32 soldierNumber;										// 参与采集的士兵数量
	//tolua_end

	SSelfField():gridId(0),
		startTime(0),
		soldierNumber(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(gridId, 1);
		D_UINT32(startTime, 1);
		D_UINT32(soldierNumber, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(gridId, 1);
		E_UINT32(startTime, 1);
		E_UINT32(soldierNumber, 1);
		return iPos;
	}
};//tolua_export


/*
 *  祭坛兑换次数
 */
struct SExchangeTodayTimes //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 curTimes;											// 已经兑换次数
	uint32 maxTimes;											// 今日最大次数
	uint32 lastTime;											// 最近的一次时间
	//tolua_end

	SExchangeTodayTimes():curTimes(0),
		maxTimes(0),
		lastTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(curTimes, 13);
		D_UINT32(maxTimes, 13);
		D_UINT32(lastTime, 13);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(curTimes, 13);
		E_UINT32(maxTimes, 13);
		E_UINT32(lastTime, 13);
		return iPos;
	}
};//tolua_export


/*
 *  城市列表
 */
struct SCitys //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	SCityRes stCRes;											// 城堡的通用资源
	SCityDef cityDef;											// 城池防御
	uint8 ucTotal;												// 城市列表个数
	SCity astCitys[MAX_CITY_CNT];								// 城市列表具体内容
	uint8 fieldTotal;											// 自己的野地列表个数
	SSelfField selfFields[MAX_SELFFIELD_CNT];					// 自己的野地列表个数
	SExchangeTodayTimes exchangeTodayTimes;						// 祭坛兑换次数
	uint8 startAutoBuild;										// 是否开启了自动建造
	int8 waitBuildCount;										// 等待建造个数
	uint32 waitBuilds[MAX_WAIT_BUILDS_CNT];						// 等待建造数据
	//tolua_end

	SCitys():ucTotal(0),
		fieldTotal(0),
		startAutoBuild(0),
		waitBuildCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_STRUCT(stCRes, 1);
		D_STRUCT(cityDef, 1);
		D_UINT8(ucTotal, 1);
		D_ARRAY_STRUCT(astCitys, ucTotal, MAX_CITY_CNT, 1);
		D_UINT8(fieldTotal, 1);
		D_ARRAY_STRUCT(selfFields, fieldTotal, MAX_SELFFIELD_CNT, 1);
		D_STRUCT(exchangeTodayTimes, 13);
		D_UINT8(startAutoBuild, 111);
		D_INT8(waitBuildCount, 111);
		D_ARRAY_UINT32(waitBuilds, waitBuildCount, MAX_WAIT_BUILDS_CNT, 111);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_STRUCT(stCRes, 1);
		E_STRUCT(cityDef, 1);
		E_UINT8(ucTotal, 1);
		E_ARRAY_STRUCT(astCitys, ucTotal, MAX_CITY_CNT, 1);
		E_UINT8(fieldTotal, 1);
		E_ARRAY_STRUCT(selfFields, fieldTotal, MAX_SELFFIELD_CNT, 1);
		E_STRUCT(exchangeTodayTimes, 13);
		E_UINT8(startAutoBuild, 111);
		E_INT8(waitBuildCount, 111);
		E_ARRAY_UINT32(waitBuilds, waitBuildCount, MAX_WAIT_BUILDS_CNT, 111);
		return iPos;
	}
};//tolua_export


/*
 *  孔结构
 */
struct SOneHole //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 usAttr;												// 属性的类型
	uint32 ulIdxOrVal;											// 索引或值
	//tolua_end

	SOneHole():usAttr(0),
		ulIdxOrVal(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(usAttr, 1);
		D_UINT32(ulIdxOrVal, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(usAttr, 1);
		E_UINT32(ulIdxOrVal, 1);
		return iPos;
	}
};//tolua_export


/*
 *  角色所有固定的属性或变化很少的属性
 */
struct SFixVar //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucIcon;												// 头像
	uint32 ulCityId;											// 出生城市id
	uint32 ulCPosX;												// 出生城市id
	uint32 ulCPosY;												// 出生城市id
	uint32 ulCreateTime;										// 创建时间
	//tolua_end

	SFixVar():ucIcon(0),
		ulCityId(0),
		ulCPosX(0),
		ulCPosY(0),
		ulCreateTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucIcon, 1);
		D_UINT32(ulCityId, 1);
		D_UINT32(ulCPosX, 1);
		D_UINT32(ulCPosY, 1);
		D_UINT32(ulCreateTime, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucIcon, 1);
		E_UINT32(ulCityId, 1);
		E_UINT32(ulCPosX, 1);
		E_UINT32(ulCPosY, 1);
		E_UINT32(ulCreateTime, 1);
		return iPos;
	}
};//tolua_export


/*
 *  属性值
 */
struct SAttr //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 usAttr;												// 属性类型
	int32 ulVal;												// 属性值,遗漏
	uint8 ucUnit;												// 属性类型
	//tolua_end

	SAttr():usAttr(0),
		ulVal(0),
		ucUnit(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(usAttr, 1);
		D_INT32(ulVal, 1);
		D_UINT8(ucUnit, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(usAttr, 1);
		E_INT32(ulVal, 1);
		E_UINT8(ucUnit, 1);
		return iPos;
	}
};//tolua_export


/*
 *  属性值
 */
struct SAttrEx //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 attr;												// 属性类型
	uint32 val;													// 属性值
	uint8 unit;													// 属性类型
	//tolua_end

	SAttrEx():attr(0),
		val(0),
		unit(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(attr, 1);
		D_UINT32(val, 1);
		D_UINT8(unit, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(attr, 1);
		E_UINT32(val, 1);
		E_UINT8(unit, 1);
		return iPos;
	}
};//tolua_export


/*
 *  主角属性值列表
 */
struct SRoleAttrList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulNSLastTime;										// 新士兵最近更新时间
	uint8 ucCount;												// 属性个数
	SAttr astAttrs[MAX_ROLEATTRS_CNT];							// 属性值
	uint32 lastPSRefreshDay;									// 上次ps属性刷新是一年中的第几天
	//tolua_end

	SRoleAttrList():ulNSLastTime(0),
		ucCount(0),
		lastPSRefreshDay(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulNSLastTime, 1);
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astAttrs, ucCount, MAX_ROLEATTRS_CNT, 1);
		D_UINT32(lastPSRefreshDay, 10);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulNSLastTime, 1);
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astAttrs, ucCount, MAX_ROLEATTRS_CNT, 1);
		E_UINT32(lastPSRefreshDay, 10);
		return iPos;
	}
};//tolua_export


/*
 *  qq会员
 */
struct SQQMembership //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 is_yellow_vip;
	uint8 is_yellow_year_vip;
	uint8 yellow_vip_level;
	uint8 is_yellow_high_vip;
	uint8 is_blue_vip;
	uint8 is_blue_year_vip;
	uint8 blue_vip_level;
	uint8 is_super_blue_vip;
	uint8 _3366_grow_level;
	//tolua_end

	SQQMembership():is_yellow_vip(0),
		is_yellow_year_vip(0),
		yellow_vip_level(0),
		is_yellow_high_vip(0),
		is_blue_vip(0),
		is_blue_year_vip(0),
		blue_vip_level(0),
		is_super_blue_vip(0),
		_3366_grow_level(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(is_yellow_vip, 105);
		D_UINT8(is_yellow_year_vip, 105);
		D_UINT8(yellow_vip_level, 105);
		D_UINT8(is_yellow_high_vip, 105);
		D_UINT8(is_blue_vip, 105);
		D_UINT8(is_blue_year_vip, 105);
		D_UINT8(blue_vip_level, 105);
		D_UINT8(is_super_blue_vip, 105);
		D_UINT8(_3366_grow_level, 110);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(is_yellow_vip, 105);
		E_UINT8(is_yellow_year_vip, 105);
		E_UINT8(yellow_vip_level, 105);
		E_UINT8(is_yellow_high_vip, 105);
		E_UINT8(is_blue_vip, 105);
		E_UINT8(is_blue_year_vip, 105);
		E_UINT8(blue_vip_level, 105);
		E_UINT8(is_super_blue_vip, 105);
		E_UINT8(_3366_grow_level, 110);
		return iPos;
	}
};//tolua_export


/*
 *  角色的所有基础属性
 */
struct SBaseInfo //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucGM;													// GM权限
	uint8 ucLevel;												// 角色等级
	uint32 ulPrestige;											// 声望值
	uint32 ulCityHonor;											// 州荣誉
	uint32 ulCityCD;											// 转州的冷却时间
	uint64 ullAlliance;											// 联盟id
	uint8 ucState;												// 主角状态
	SRoleAttrList stAttrs;										// 主角属性列表
	uint32 cityModel;											// 主角城池外观
	char introduction[MAX_ROLEINTRO_ARR_LEN];					// 介绍
	SQQMembership qqMembership;									// qq会员
	//tolua_end

	SBaseInfo():ucGM(0),
		ucLevel(0),
		ulPrestige(0),
		ulCityHonor(0),
		ulCityCD(0),
		ullAlliance(0),
		ucState(0),
		cityModel(0){
		introduction[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucGM, 1);
		D_UINT8(ucLevel, 1);
		D_UINT32(ulPrestige, 1);
		D_UINT32(ulCityHonor, 1);
		D_UINT32(ulCityCD, 1);
		D_UINT64(ullAlliance, 1);
		D_UINT8(ucState, 1);
		D_STRUCT(stAttrs, 1);
		D_UINT32(cityModel, 7);
		D_STRING(introduction, MAX_ROLEINTRO_ARR_LEN, 8);
		D_STRUCT(qqMembership, 105);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucGM, 1);
		E_UINT8(ucLevel, 1);
		E_UINT32(ulPrestige, 1);
		E_UINT32(ulCityHonor, 1);
		E_UINT32(ulCityCD, 1);
		E_UINT64(ullAlliance, 1);
		E_UINT8(ucState, 1);
		E_STRUCT(stAttrs, 1);
		E_UINT32(cityModel, 7);
		E_STRING(introduction, MAX_ROLEINTRO_ARR_LEN, 8);
		E_STRUCT(qqMembership, 105);
		return iPos;
	}
};//tolua_export


/*
 *  单个任务结构
 */
struct STask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taskId;												// 任务id
	uint8 state;												// 任务状态
	//tolua_end

	STask():taskId(0),
		state(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taskId, 1);
		D_UINT8(state, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taskId, 1);
		E_UINT8(state, 1);
		return iPos;
	}
};//tolua_export


/*
 *  正在进行中的君主任务
 */
struct SDoingRoleTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taskId;												// 正在进行中的君主任务id
	uint32 stopTime;											// 任务的结束时间
	uint32 cdStopTime;											// 冷却的结束时间
	//tolua_end

	SDoingRoleTask():taskId(0),
		stopTime(0),
		cdStopTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taskId, 20);
		D_UINT32(stopTime, 20);
		D_UINT32(cdStopTime, 20);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taskId, 20);
		E_UINT32(stopTime, 20);
		E_UINT32(cdStopTime, 20);
		return iPos;
	}
};//tolua_export


/*
 *  单日活跃度任务结构
 */
struct SActValTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taskId;												// 任务id
	uint32 times;												// 完成的任务次数
	//tolua_end

	SActValTask():taskId(0),
		times(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taskId, 25);
		D_UINT32(times, 25);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taskId, 25);
		E_UINT32(times, 25);
		return iPos;
	}
};//tolua_export


/*
 *  活动任务结构
 */
struct SActTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taskId;												// 任务id
	uint8 state;												// 任务状态
	uint32 times;												// 完成的任务次数
	uint32 maxTimes;											// 可完成任务的最大次数
	uint32 startTime;											// 任务的开始时间
	uint32 stopTime;											// 任务的结束时间
	//tolua_end

	SActTask():taskId(0),
		state(0),
		times(0),
		maxTimes(0),
		startTime(0),
		stopTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taskId, 30);
		D_UINT8(state, 30);
		D_UINT32(times, 30);
		D_UINT32(maxTimes, 30);
		D_UINT32(startTime, 30);
		D_UINT32(stopTime, 30);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taskId, 30);
		E_UINT8(state, 30);
		E_UINT32(times, 30);
		E_UINT32(maxTimes, 30);
		E_UINT32(startTime, 30);
		E_UINT32(stopTime, 30);
		return iPos;
	}
};//tolua_export


/*
 *  活跃度结构
 */
struct SActivityVal //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 refreshActValTime;									// 今天活跃值的刷新时间
	uint32 val;													// 今天已有的活跃值
	uint32 gotActRewardTime;									// 已领取的活跃度奖励的刷新时间
	uint32 gotActRewards[MAX_ACTREWARDS_CNT];					// 已领取的活跃度奖励
	uint32 refreshSigninTime;									// 今天活跃值的刷新时间
	uint8 todaySign;											// 今天是否已签到
	uint32 signinDaysTime;										// 本月签到天数的刷新时间
	uint8 signinDays;											// 本月签到天数
	uint32 gotSigninRewardTime;									// 已领取的签到奖励的刷新时间
	uint32 gotSigninRewards[MAX_SIGNINREWARDS_CNT];				// 已领取的签到奖励
	uint32 refreshTaskTime;										// 刷新任务列表的时间
	int32 count;												// 任务列表数
	SActValTask tasks[MAX_ACTVALTASKS_CNT];						// 任务列表内容
	uint32 gotOnlineGoodsTime;									// 最近一次获取在线节日礼包的时间
	uint32 gotGoodsTimes;										// 最近一次获取在线节日礼包的次数
	uint32 gotSigninRewardsEx[MAX_SIGNINREWARDS_CNT_EX];		// 已领取的签到奖励
	//tolua_end

	SActivityVal():refreshActValTime(0),
		val(0),
		gotActRewardTime(0),
		refreshSigninTime(0),
		todaySign(0),
		signinDaysTime(0),
		signinDays(0),
		gotSigninRewardTime(0),
		refreshTaskTime(0),
		count(0),
		gotOnlineGoodsTime(0),
		gotGoodsTimes(0){
		memset(gotActRewards, 0, sizeof(gotActRewards[0])*MAX_ACTREWARDS_CNT);
		memset(gotSigninRewards, 0, sizeof(gotSigninRewards[0])*MAX_SIGNINREWARDS_CNT);
		memset(gotSigninRewardsEx, 0, sizeof(gotSigninRewardsEx[0])*MAX_SIGNINREWARDS_CNT_EX);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(refreshActValTime, 25);
		D_UINT32(val, 25);
		D_UINT32(gotActRewardTime, 25);
		D_ARRAY_UINT32(gotActRewards, MAX_ACTREWARDS_CNT, MAX_ACTREWARDS_CNT, 25);
		D_UINT32(refreshSigninTime, 25);
		D_UINT8(todaySign, 25);
		D_UINT32(signinDaysTime, 25);
		D_UINT8(signinDays, 25);
		D_UINT32(gotSigninRewardTime, 25);
		D_ARRAY_UINT32(gotSigninRewards, MAX_SIGNINREWARDS_CNT, MAX_SIGNINREWARDS_CNT, 25);
		D_UINT32(refreshTaskTime, 25);
		D_INT32(count, 25);
		D_ARRAY_STRUCT(tasks, count, MAX_ACTVALTASKS_CNT, 25);
		D_UINT32(gotOnlineGoodsTime, 102);
		D_UINT32(gotGoodsTimes, 102);
		D_ARRAY_UINT32(gotSigninRewardsEx, MAX_SIGNINREWARDS_CNT_EX, MAX_SIGNINREWARDS_CNT_EX, 125);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(refreshActValTime, 25);
		E_UINT32(val, 25);
		E_UINT32(gotActRewardTime, 25);
		E_ARRAY_UINT32(gotActRewards, MAX_ACTREWARDS_CNT, MAX_ACTREWARDS_CNT, 25);
		E_UINT32(refreshSigninTime, 25);
		E_UINT8(todaySign, 25);
		E_UINT32(signinDaysTime, 25);
		E_UINT8(signinDays, 25);
		E_UINT32(gotSigninRewardTime, 25);
		E_ARRAY_UINT32(gotSigninRewards, MAX_SIGNINREWARDS_CNT, MAX_SIGNINREWARDS_CNT, 25);
		E_UINT32(refreshTaskTime, 25);
		E_INT32(count, 25);
		E_ARRAY_STRUCT(tasks, count, MAX_ACTVALTASKS_CNT, 25);
		E_UINT32(gotOnlineGoodsTime, 102);
		E_UINT32(gotGoodsTimes, 102);
		E_ARRAY_UINT32(gotSigninRewardsEx, MAX_SIGNINREWARDS_CNT_EX, MAX_SIGNINREWARDS_CNT_EX, 125);
		return iPos;
	}
};//tolua_export


/*
 *  在线领奖任务
 */
struct SOnlineTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taskId;												// 任务id
	uint32 startTime;											// 该任务开始的时间
	uint32 lastTime;											// 上次已经登录的时间
	uint32 lastLapsed;											// 上次已经登录后流逝的时间
	uint8 isCircled;											// 是否已开始循环任务
	//tolua_end

	SOnlineTask():taskId(0),
		startTime(0),
		lastTime(0),
		lastLapsed(0),
		isCircled(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taskId, 27);
		D_UINT32(startTime, 27);
		D_UINT32(lastTime, 27);
		D_UINT32(lastLapsed, 27);
		D_UINT8(isCircled, 27);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taskId, 27);
		E_UINT32(startTime, 27);
		E_UINT32(lastTime, 27);
		E_UINT32(lastLapsed, 27);
		E_UINT8(isCircled, 27);
		return iPos;
	}
};//tolua_export


/*
 *  新手指引任务
 */
struct SNewcomerTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 curTaskId;											// 当前任务id
	uint8 isEnd;												// 新手指引任务是否结束
	uint8 isGlobalTipEnd;										// 新手指引任务结束后提示全局攻略面板
	//tolua_end

	SNewcomerTask():curTaskId(0),
		isEnd(0),
		isGlobalTipEnd(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(curTaskId, 28);
		D_UINT8(isEnd, 123);
		D_UINT8(isGlobalTipEnd, 124);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(curTaskId, 28);
		E_UINT8(isEnd, 123);
		E_UINT8(isGlobalTipEnd, 124);
		return iPos;
	}
};//tolua_export


/*
 *  黄钻任务
 */
struct SYellowDiamondTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int8 gotNewgift;											// 新手礼包已领取
	uint32 gotCommGift;											// 黄钻每日礼包的领取时间
	uint32 gotYearGift;											// 年费黄钻每日礼包的领取时间
	int32 lvlCount;												// 黄钻等级礼包的领取id列表的个数
	int8 gotLvlGifts[MAX_YD_LVL_IDS_CNT];						// 黄钻等级礼包的领取id列表
	//tolua_end

	SYellowDiamondTask():gotNewgift(0),
		gotCommGift(0),
		gotYearGift(0),
		lvlCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT8(gotNewgift, 104);
		D_UINT32(gotCommGift, 104);
		D_UINT32(gotYearGift, 104);
		D_INT32(lvlCount, 104);
		D_ARRAY_INT8(gotLvlGifts, lvlCount, MAX_YD_LVL_IDS_CNT, 104);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT8(gotNewgift, 104);
		E_UINT32(gotCommGift, 104);
		E_UINT32(gotYearGift, 104);
		E_INT32(lvlCount, 104);
		E_ARRAY_INT8(gotLvlGifts, lvlCount, MAX_YD_LVL_IDS_CNT, 104);
		return iPos;
	}
};//tolua_export


/*
 *  蓝钻任务
 */
struct SBlueDiamondTask //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int8 gotNewgift;											// 新手礼包已领取
	uint32 gotCommGift;											// 蓝钻每日礼包的领取时间
	uint32 gotYearGift;											// 年费蓝钻每日礼包的领取时间
	uint32 gotHighGift;											// 超级蓝钻每日礼包的领取时间
	int32 lvlCount;												// 蓝钻等级礼包的领取id列表的个数
	int8 gotLvlGifts[MAX_BD_LVL_IDS_CNT];						// 蓝钻等级礼包的领取id列表
	uint32 got3366Gift;											// 3366每日礼包的领取时间
	//tolua_end

	SBlueDiamondTask():gotNewgift(0),
		gotCommGift(0),
		gotYearGift(0),
		gotHighGift(0),
		lvlCount(0),
		got3366Gift(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT8(gotNewgift, 113);
		D_UINT32(gotCommGift, 113);
		D_UINT32(gotYearGift, 113);
		D_UINT32(gotHighGift, 113);
		D_INT32(lvlCount, 113);
		D_ARRAY_INT8(gotLvlGifts, lvlCount, MAX_BD_LVL_IDS_CNT, 113);
		D_UINT32(got3366Gift, 113);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT8(gotNewgift, 113);
		E_UINT32(gotCommGift, 113);
		E_UINT32(gotYearGift, 113);
		E_UINT32(gotHighGift, 113);
		E_INT32(lvlCount, 113);
		E_ARRAY_INT8(gotLvlGifts, lvlCount, MAX_BD_LVL_IDS_CNT, 113);
		E_UINT32(got3366Gift, 113);
		return iPos;
	}
};//tolua_export


/*
 *  充值活动
 */
struct SPayAct //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 lastPayTime;											// 最近一次充值时间
	uint32 allGold;												// 所有的充值数
	uint32 actAllGold;											// 本次活动的充值数
	uint8 giftGots[MAX_PAYACT_GIFT_CNT];						// 礼包领取标记
	//tolua_end

	SPayAct():lastPayTime(0),
		allGold(0),
		actAllGold(0){
		memset(giftGots, 0, sizeof(giftGots[0])*MAX_PAYACT_GIFT_CNT);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(lastPayTime, 108);
		D_UINT32(allGold, 108);
		D_UINT32(actAllGold, 108);
		D_ARRAY_UINT8(giftGots, MAX_PAYACT_GIFT_CNT, MAX_PAYACT_GIFT_CNT, 108);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(lastPayTime, 108);
		E_UINT32(allGold, 108);
		E_UINT32(actAllGold, 108);
		E_ARRAY_UINT8(giftGots, MAX_PAYACT_GIFT_CNT, MAX_PAYACT_GIFT_CNT, 108);
		return iPos;
	}
};//tolua_export


/*
 *  世界boss
 */
struct SWorldboss //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 times;												// 当日挑战次数
	uint16 guwuLevel;											// 鼓舞等级
	uint8 gotGift;												// 今天的奖励是否领取
	uint32 refreshTime;											// 刷新时间
	uint32 getPersonRankGiftTime;								// 获取个人排名奖品的时间
	uint32 getCountryRankGiftTime;								// 获取势力排名奖品的时间
	//tolua_end

	SWorldboss():times(0),
		guwuLevel(0),
		gotGift(0),
		refreshTime(0),
		getPersonRankGiftTime(0),
		getCountryRankGiftTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(times, 116);
		D_UINT16(guwuLevel, 116);
		D_UINT8(gotGift, 116);
		D_UINT32(refreshTime, 116);
		D_UINT32(getPersonRankGiftTime, 117);
		D_UINT32(getCountryRankGiftTime, 117);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(times, 116);
		E_UINT16(guwuLevel, 116);
		E_UINT8(gotGift, 116);
		E_UINT32(refreshTime, 116);
		E_UINT32(getPersonRankGiftTime, 117);
		E_UINT32(getCountryRankGiftTime, 117);
		return iPos;
	}
};//tolua_export


/*
 *  发送奖励的活动
 */
struct SSendReward //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 sendFirstHero;										// 是否已经发送了首个武将
	//tolua_end

	SSendReward():sendFirstHero(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(sendFirstHero, 122);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(sendFirstHero, 122);
		return iPos;
	}
};//tolua_export


/*
 *  正在做的任务列表
 */
struct STaskList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int32 count;												// 任务列表数
	STask tasks[MAX_TASKS_CNT];									// 任务列表内容
	SDoingRoleTask doingRoleTask;								// 正在进行中的君主任务
	uint32 refreshTime;											// 日常任务列表刷新
	int32 everydayCount;										// 日常任务列表数
	STask everydayTasks[MAX_EVERYDAY_TASKS_CNT];				// 日常任务列表内容
	uint32 prestigeLastTime;									// 声望任务的最近一次时间
	SActivityVal activityVal;									// 活跃度
	SOnlineTask onlineTask;										// 在线领奖任务
	SNewcomerTask newComerTask;									// 新手指引任务
	int32 actTaskCount;											// 活动任务列表数
	SActTask actTasks[MAX_ACT_TASKS_CNT];						// 活动任务列表内容
	SYellowDiamondTask ydtasks;									// 黄钻任务
	SPayAct payAct;												// 充值活动
	SBlueDiamondTask bdtasks;									// 蓝钻任务
	SWorldboss worldboss;										// 世界boss
	SSendReward sendReward;										// 发送奖励的活动
	//tolua_end

	STaskList():count(0),
		refreshTime(0),
		everydayCount(0),
		prestigeLastTime(0),
		actTaskCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT32(count, 1);
		D_ARRAY_STRUCT(tasks, count, MAX_TASKS_CNT, 1);
		D_STRUCT(doingRoleTask, 20);
		D_UINT32(refreshTime, 21);
		D_INT32(everydayCount, 21);
		D_ARRAY_STRUCT(everydayTasks, everydayCount, MAX_EVERYDAY_TASKS_CNT, 21);
		D_UINT32(prestigeLastTime, 22);
		D_STRUCT(activityVal, 25);
		D_STRUCT(onlineTask, 27);
		D_STRUCT(newComerTask, 28);
		D_INT32(actTaskCount, 30);
		D_ARRAY_STRUCT(actTasks, actTaskCount, MAX_ACT_TASKS_CNT, 30);
		D_STRUCT(ydtasks, 104);
		D_STRUCT(payAct, 108);
		D_STRUCT(bdtasks, 113);
		D_STRUCT(worldboss, 116);
		D_STRUCT(sendReward, 122);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT32(count, 1);
		E_ARRAY_STRUCT(tasks, count, MAX_TASKS_CNT, 1);
		E_STRUCT(doingRoleTask, 20);
		E_UINT32(refreshTime, 21);
		E_INT32(everydayCount, 21);
		E_ARRAY_STRUCT(everydayTasks, everydayCount, MAX_EVERYDAY_TASKS_CNT, 21);
		E_UINT32(prestigeLastTime, 22);
		E_STRUCT(activityVal, 25);
		E_STRUCT(onlineTask, 27);
		E_STRUCT(newComerTask, 28);
		E_INT32(actTaskCount, 30);
		E_ARRAY_STRUCT(actTasks, actTaskCount, MAX_ACT_TASKS_CNT, 30);
		E_STRUCT(ydtasks, 104);
		E_STRUCT(payAct, 108);
		E_STRUCT(bdtasks, 113);
		E_STRUCT(worldboss, 116);
		E_STRUCT(sendReward, 122);
		return iPos;
	}
};//tolua_export


/*
 *  单个士兵结构
 */
struct SSoldier //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 resid;												// 士兵资源ID*1000+level
	uint32 number;												// 士兵个数
	//tolua_end

	SSoldier():resid(0),
		number(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(resid, 1);
		D_UINT32(number, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(resid, 1);
		E_UINT32(number, 1);
		return iPos;
	}
};//tolua_export


/*
 *  宣战结构
 */
struct SDeclare //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 state;												// 状态
	uint32 stoptime;											// 状态结束的时间
	uint64 id;													// 目标id
	//tolua_end

	SDeclare():state(0),
		stoptime(0),
		id(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(state, 1);
		D_UINT32(stoptime, 1);
		D_UINT64(id, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(state, 1);
		E_UINT32(stoptime, 1);
		E_UINT64(id, 1);
		return iPos;
	}
};//tolua_export


/*
 *  默认战队
 */
struct SDefaultTeam //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 lineupId;											// 阵型id
	uint64 heroIds[MAX_DEFAULTTEAM_HERO_CNT];					// 列表中英雄id
	//tolua_end

	SDefaultTeam():lineupId(0){
		memset(heroIds, 0, sizeof(heroIds[0])*MAX_DEFAULTTEAM_HERO_CNT);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(lineupId, 1);
		D_ARRAY_UINT64(heroIds, MAX_DEFAULTTEAM_HERO_CNT, MAX_DEFAULTTEAM_HERO_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(lineupId, 1);
		E_ARRAY_UINT64(heroIds, MAX_DEFAULTTEAM_HERO_CNT, MAX_DEFAULTTEAM_HERO_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  每日战况
 */
struct STodayFightTimes //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 taofa;												// 讨伐次数
	uint32 cuihui;												// 摧毁次数
	uint32 tiaoxin;												// 挑衅次数
	uint32 fightowner;											// 攻击野地宿主次数
	uint32 lastTime;											// 最近的一次时间
	//tolua_end

	STodayFightTimes():taofa(0),
		cuihui(0),
		tiaoxin(0),
		fightowner(0),
		lastTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(taofa, 1);
		D_UINT32(cuihui, 1);
		D_UINT32(tiaoxin, 1);
		D_UINT32(fightowner, 1);
		D_UINT32(lastTime, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(taofa, 1);
		E_UINT32(cuihui, 1);
		E_UINT32(tiaoxin, 1);
		E_UINT32(fightowner, 1);
		E_UINT32(lastTime, 1);
		return iPos;
	}
};//tolua_export


/*
 *  军队中简单英雄结构
 */
struct SSimpleHero //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 id;													// 英雄id
	char name[MAX_HERONAME_ARR_LEN];							// 英雄名
	uint8 level;												// 英雄等级
	uint8 attrCount;											// 属性个数
	SAttrEx attrs[MAX_SIMPLEHEROATTRS_CNT];						// 属性值
	SSoldier soldier;											// 携带的士兵
	uint8 lineupPos;											// 阵列中的站位
	//tolua_end

	SSimpleHero():id(0),
		level(0),
		attrCount(0),
		lineupPos(0){
		name[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(id, 1);
		D_STRING(name, MAX_HERONAME_ARR_LEN, 1);
		D_UINT8(level, 1);
		D_UINT8(attrCount, 1);
		D_ARRAY_STRUCT(attrs, attrCount, MAX_SIMPLEHEROATTRS_CNT, 1);
		D_STRUCT(soldier, 1);
		D_UINT8(lineupPos, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(id, 1);
		E_STRING(name, MAX_HERONAME_ARR_LEN, 1);
		E_UINT8(level, 1);
		E_UINT8(attrCount, 1);
		E_ARRAY_STRUCT(attrs, attrCount, MAX_SIMPLEHEROATTRS_CNT, 1);
		E_STRUCT(soldier, 1);
		E_UINT8(lineupPos, 1);
		return iPos;
	}
};//tolua_export


/*
 *  防守军队
 */
struct SDefArmy //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 lineupId;											// 阵型id
	uint8 heroCount;											// 英雄个数
	uint64 heros[MAX_TEAM_HERO_CNT];							// 英雄列表
	//tolua_end

	SDefArmy():lineupId(0),
		heroCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(lineupId, 1);
		D_UINT8(heroCount, 1);
		D_ARRAY_UINT64(heros, heroCount, MAX_TEAM_HERO_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(lineupId, 1);
		E_UINT8(heroCount, 1);
		E_ARRAY_UINT64(heros, heroCount, MAX_TEAM_HERO_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  箭塔军队
 */
struct STowerArmy //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	SSoldier soldiers[MAX_TEAM_HERO_CNT];						// 每个箭塔中的士兵
	//tolua_end

	STowerArmy(){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_ARRAY_STRUCT(soldiers, MAX_TEAM_HERO_CNT, MAX_TEAM_HERO_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_ARRAY_STRUCT(soldiers, MAX_TEAM_HERO_CNT, MAX_TEAM_HERO_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  今天的国战荣誉
 */
struct SFightTodayHonor //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 hasRefreshTime;										// 可贡献的别人打掉的刷新时间
	uint32 hasHonor;											// 今天还剩余的荣誉
	uint32 getRefreshTime;										// 获得的刷新时间
	uint32 getHonor;											// 今天已获得荣誉
	//tolua_end

	SFightTodayHonor():hasRefreshTime(0),
		hasHonor(0),
		getRefreshTime(0),
		getHonor(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(hasRefreshTime, 118);
		D_UINT32(hasHonor, 118);
		D_UINT32(getRefreshTime, 118);
		D_UINT32(getHonor, 118);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(hasRefreshTime, 118);
		E_UINT32(hasHonor, 118);
		E_UINT32(getRefreshTime, 118);
		E_UINT32(getHonor, 118);
		return iPos;
	}
};//tolua_export


/*
 *  军事结构
 */
struct SMilitary //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 favoriteCount;										// 收藏目标个数
	uint64 favorites[MAX_FAVORITE_CNT];							// 收藏目标列表
	uint8 enemyCount;											// 仇人个数
	uint64 enemys[MAX_ENEMY_CNT];								// 仇人列表
	uint8 lineupCount;											// 阵型个数
	uint32 lineups[MAX_LINEUP_CNT];								// 阵型目标列表
	SDefaultTeam defaultTeams[MAX_DEFAULTTEAM_CNT];				// 默认战队列表
	STodayFightTimes todayFightTimes;							// 每日战况
	uint8 selfArmyCount;										// 我的出征军队个数
	uint64 selfArmyIds[MAX_SELFARMY_CNT];						// 我的出征军队列表
	uint8 enemyArmyCount;										// 攻打我方敌人军队个数
	uint64 enemyArmyIds[MAX_ENEMYARMY_CNT];						// 攻打我方敌人军队列表
	uint8 alliArmyCount;										// 同盟派遣军队个数
	uint64 alliArmyIds[MAX_ALLIARMY_CNT];						// 同盟派遣军队列表
	SDefArmy defArmy;											// 防守军队
	STowerArmy towerArmy;										// 箭塔军队
	uint8 succCopyFieldCount;									// 挑战成功的副本个数
	uint32 succCopyFields[MAX_SUCC_COPYFIELD_CNT];				// 挑战成功的副本id列表
	SFightTodayHonor todayHonor;								// 今天的国战荣誉
	//tolua_end

	SMilitary():favoriteCount(0),
		enemyCount(0),
		lineupCount(0),
		selfArmyCount(0),
		enemyArmyCount(0),
		alliArmyCount(0),
		succCopyFieldCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(favoriteCount, 1);
		D_ARRAY_UINT64(favorites, favoriteCount, MAX_FAVORITE_CNT, 1);
		D_UINT8(enemyCount, 1);
		D_ARRAY_UINT64(enemys, enemyCount, MAX_ENEMY_CNT, 1);
		D_UINT8(lineupCount, 1);
		D_ARRAY_UINT32(lineups, lineupCount, MAX_LINEUP_CNT, 1);
		D_ARRAY_STRUCT(defaultTeams, MAX_DEFAULTTEAM_CNT, MAX_DEFAULTTEAM_CNT, 1);
		D_STRUCT(todayFightTimes, 1);
		D_UINT8(selfArmyCount, 1);
		D_ARRAY_UINT64(selfArmyIds, selfArmyCount, MAX_SELFARMY_CNT, 1);
		D_UINT8(enemyArmyCount, 1);
		D_ARRAY_UINT64(enemyArmyIds, enemyArmyCount, MAX_ENEMYARMY_CNT, 1);
		D_UINT8(alliArmyCount, 1);
		D_ARRAY_UINT64(alliArmyIds, alliArmyCount, MAX_ALLIARMY_CNT, 1);
		D_STRUCT(defArmy, 1);
		D_STRUCT(towerArmy, 1);
		D_UINT8(succCopyFieldCount, 2);
		D_ARRAY_UINT32(succCopyFields, succCopyFieldCount, MAX_SUCC_COPYFIELD_CNT, 2);
		D_STRUCT(todayHonor, 118);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(favoriteCount, 1);
		E_ARRAY_UINT64(favorites, favoriteCount, MAX_FAVORITE_CNT, 1);
		E_UINT8(enemyCount, 1);
		E_ARRAY_UINT64(enemys, enemyCount, MAX_ENEMY_CNT, 1);
		E_UINT8(lineupCount, 1);
		E_ARRAY_UINT32(lineups, lineupCount, MAX_LINEUP_CNT, 1);
		E_ARRAY_STRUCT(defaultTeams, MAX_DEFAULTTEAM_CNT, MAX_DEFAULTTEAM_CNT, 1);
		E_STRUCT(todayFightTimes, 1);
		E_UINT8(selfArmyCount, 1);
		E_ARRAY_UINT64(selfArmyIds, selfArmyCount, MAX_SELFARMY_CNT, 1);
		E_UINT8(enemyArmyCount, 1);
		E_ARRAY_UINT64(enemyArmyIds, enemyArmyCount, MAX_ENEMYARMY_CNT, 1);
		E_UINT8(alliArmyCount, 1);
		E_ARRAY_UINT64(alliArmyIds, alliArmyCount, MAX_ALLIARMY_CNT, 1);
		E_STRUCT(defArmy, 1);
		E_STRUCT(towerArmy, 1);
		E_UINT8(succCopyFieldCount, 2);
		E_ARRAY_UINT32(succCopyFields, succCopyFieldCount, MAX_SUCC_COPYFIELD_CNT, 2);
		E_STRUCT(todayHonor, 118);
		return iPos;
	}
};//tolua_export


/*
 *  杂项结构
 */
struct SInviteJoinAlliance //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 allianceId;											// 联盟id
	uint64 roleId;												// 邀请人id
	//tolua_end

	SInviteJoinAlliance():allianceId(0),
		roleId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(allianceId, 15);
		D_UINT64(roleId, 15);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(allianceId, 15);
		E_UINT64(roleId, 15);
		return iPos;
	}
};//tolua_export


/*
 *  跑商结构
 */
struct STradingArea //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 stopTime;											// 跑商停止时间
	int32 count;												// 目标个数
	uint64 roleIds[MAX_TRADING_ROLES_CNT];						// 目标角色id列表
	int32 todayTimes;											// 今天已跑的次数
	uint32 refreshTime;											// 刷新时间
	uint16 curTimes;											// 当前跑商的次数
	//tolua_end

	STradingArea():stopTime(0),
		count(0),
		todayTimes(0),
		refreshTime(0),
		curTimes(1){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(stopTime, 16);
		D_INT32(count, 16);
		D_ARRAY_UINT64(roleIds, count, MAX_TRADING_ROLES_CNT, 16);
		D_INT32(todayTimes, 24);
		D_UINT32(refreshTime, 24);
		D_UINT16(curTimes, 112);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(stopTime, 16);
		E_INT32(count, 16);
		E_ARRAY_UINT64(roleIds, count, MAX_TRADING_ROLES_CNT, 16);
		E_INT32(todayTimes, 24);
		E_UINT32(refreshTime, 24);
		E_UINT16(curTimes, 112);
		return iPos;
	}
};//tolua_export


/*
 *  千层塔
 */
struct SActTower //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 todayEnterTimes;										// 当天进入的次数
	uint32 todayRefreshTime;									// 今天次数的刷新时间
	uint32 maxLayer;											// 当前玩家闯过的最高层
	uint32 leftLifes;											// 当前关卡剩余的生命
	uint32 stopTime;											// 战斗冷却的结束时间
	uint32 curLayer;											// 当前正在攻打的楼层
	uint32 maxTime;												// 通过最大层数时的时间
	uint32 autoStartTime;										// 自动挑战的开始时间
	uint16 autoToLayer;											// 自动挑战的上限层数
	//tolua_end

	SActTower():todayEnterTimes(0),
		todayRefreshTime(0),
		maxLayer(0),
		leftLifes(0),
		stopTime(0),
		curLayer(0),
		maxTime(0),
		autoStartTime(0),
		autoToLayer(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(todayEnterTimes, 18);
		D_UINT32(todayRefreshTime, 18);
		D_UINT32(maxLayer, 18);
		D_UINT32(leftLifes, 18);
		D_UINT32(stopTime, 18);
		D_UINT32(curLayer, 18);
		D_UINT32(maxTime, 19);
		D_UINT32(autoStartTime, 120);
		D_UINT16(autoToLayer, 121);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(todayEnterTimes, 18);
		E_UINT32(todayRefreshTime, 18);
		E_UINT32(maxLayer, 18);
		E_UINT32(leftLifes, 18);
		E_UINT32(stopTime, 18);
		E_UINT32(curLayer, 18);
		E_UINT32(maxTime, 19);
		E_UINT32(autoStartTime, 120);
		E_UINT16(autoToLayer, 121);
		return iPos;
	}
};//tolua_export


/*
 *  点将台关卡
 */
struct SActTerraceGate //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 gateId;												// 关卡id
	uint32 subGateId;											// 子关卡id
	//tolua_end

	SActTerraceGate():gateId(0),
		subGateId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(gateId, 18);
		D_UINT32(subGateId, 18);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(gateId, 18);
		E_UINT32(subGateId, 18);
		return iPos;
	}
};//tolua_export


/*
 *  点将台
 */
struct SActTerrace //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 todayEnterTimes;										// 当天进入的次数
	uint32 todayRefreshTime;									// 今天次数的刷新时间
	SActTerraceGate maxGate;									// 当前玩家闯过的最高关卡
	uint32 leftLifes;											// 当前关卡剩余的生命
	uint32 stopTime;											// 战斗冷却的结束时间
	SActTerraceGate curGate;									// 当前正在攻打的关卡
	int32 countResults;											// 通过了的关卡的评价列表大小
	uint8 results[MAX_ACT_TERRACE_COUNT];						// 评价列表
	uint32 autoStartTime;										// 自动挑战的开始时间
	uint16 autoToSubGateId;										// 自动挑战的上限子关
	//tolua_end

	SActTerrace():todayEnterTimes(0),
		todayRefreshTime(0),
		leftLifes(0),
		stopTime(0),
		countResults(0),
		autoStartTime(0),
		autoToSubGateId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(todayEnterTimes, 18);
		D_UINT32(todayRefreshTime, 18);
		D_STRUCT(maxGate, 18);
		D_UINT32(leftLifes, 18);
		D_UINT32(stopTime, 18);
		D_STRUCT(curGate, 18);
		D_INT32(countResults, 18);
		D_ARRAY_UINT8(results, countResults, MAX_ACT_TERRACE_COUNT, 18);
		D_UINT32(autoStartTime, 120);
		D_UINT16(autoToSubGateId, 121);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(todayEnterTimes, 18);
		E_UINT32(todayRefreshTime, 18);
		E_STRUCT(maxGate, 18);
		E_UINT32(leftLifes, 18);
		E_UINT32(stopTime, 18);
		E_STRUCT(curGate, 18);
		E_INT32(countResults, 18);
		E_ARRAY_UINT8(results, countResults, MAX_ACT_TERRACE_COUNT, 18);
		E_UINT32(autoStartTime, 120);
		E_UINT16(autoToSubGateId, 121);
		return iPos;
	}
};//tolua_export


/*
 *  武将布局阵型保存结构
 */
struct SForceLineupCfg //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 type;												// 类型
	uint32 lineup;												// 阵型
	int8 heroCount;												// 武将个数
	uint64 heroIds[MAX_TEAM_HERO_CNT];							// 武将id列表
	//tolua_end

	SForceLineupCfg():type(0),
		lineup(0),
		heroCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(type, 29);
		D_UINT32(lineup, 29);
		D_INT8(heroCount, 29);
		D_ARRAY_UINT64(heroIds, heroCount, MAX_TEAM_HERO_CNT, 29);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(type, 29);
		E_UINT32(lineup, 29);
		E_INT8(heroCount, 29);
		E_ARRAY_UINT64(heroIds, heroCount, MAX_TEAM_HERO_CNT, 29);
		return iPos;
	}
};//tolua_export


/*
 *  新手帮助提示
 */
struct SHelpTip //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 id;													// id
	uint8 times;												// 已经提示的次数
	//tolua_end

	SHelpTip():id(0),
		times(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(id, 127);
		D_UINT8(times, 127);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(id, 127);
		E_UINT8(times, 127);
		return iPos;
	}
};//tolua_export


/*
 *  玩家客户端的配置
 */
struct SPlayerClientCfg //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int8 forceCount;											// 武将布局个数
	SForceLineupCfg forces[MAX_FORCELINEUPCFG_CNT];				// 武将布局
	uint8 toggleMap[MAX_CTLCFG_BTIMAP_CNT];						// 客户端的一些开关bit位
	int32 gonggaoVer;											// 最近一次玩家看到的公告版本号
	int16 helpTipCount;											// 新手帮助tip的个数
	SHelpTip helpTips[MAX_HELPTIP_CNT];							// 新手帮助tipid的列表
	//tolua_end

	SPlayerClientCfg():forceCount(0),
		gonggaoVer(0),
		helpTipCount(0){
		memset(toggleMap, 0, sizeof(toggleMap[0])*MAX_CTLCFG_BTIMAP_CNT);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT8(forceCount, 29);
		D_ARRAY_STRUCT(forces, forceCount, MAX_FORCELINEUPCFG_CNT, 29);
		D_ARRAY_UINT8(toggleMap, MAX_CTLCFG_BTIMAP_CNT, MAX_CTLCFG_BTIMAP_CNT, 107);
		D_INT32(gonggaoVer, 119);
		D_INT16(helpTipCount, 127);
		D_ARRAY_STRUCT(helpTips, helpTipCount, MAX_HELPTIP_CNT, 127);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT8(forceCount, 29);
		E_ARRAY_STRUCT(forces, forceCount, MAX_FORCELINEUPCFG_CNT, 29);
		E_ARRAY_UINT8(toggleMap, MAX_CTLCFG_BTIMAP_CNT, MAX_CTLCFG_BTIMAP_CNT, 107);
		E_INT32(gonggaoVer, 119);
		E_INT16(helpTipCount, 127);
		E_ARRAY_STRUCT(helpTips, helpTipCount, MAX_HELPTIP_CNT, 127);
		return iPos;
	}
};//tolua_export


/*
 *  购买受限的道具
 */
struct SBuyLimitItem //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 resId;												// 道具id
	uint32 number;												// 个数
	//tolua_end

	SBuyLimitItem():resId(0),
		number(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(resId, 106);
		D_UINT32(number, 106);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(resId, 106);
		E_UINT32(number, 106);
		return iPos;
	}
};//tolua_export


/*
 *  vip功能
 */
struct SVip //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 level;												// 等级
	//tolua_end

	SVip():level(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(level, 110);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(level, 110);
		return iPos;
	}
};//tolua_export


/*
 *  cd key
 */
struct SCDKey //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	int32 count;												// 已领过的cdkey
	int16 types[MAX_CDKEY_CNT];									// 已经领过的type
	//tolua_end

	SCDKey():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_INT32(count, 115);
		D_ARRAY_INT16(types, count, MAX_CDKEY_CNT, 115);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_INT32(count, 115);
		E_ARRAY_INT16(types, count, MAX_CDKEY_CNT, 115);
		return iPos;
	}
};//tolua_export


/*
 *  杂项结构
 */
struct SMiscs //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	SPlayerClientCfg clientCfg;									// 玩家客户端的配置
	char applyAlliance[MAX_ALLINAME_ARR_LEN];					// 正在申请的联盟名
	uint8 inviteJoinAllianceCount;								// 邀请我加入联盟的个数
	SInviteJoinAlliance inviteJoinAlliances[MAX_INVITE_JOIN_ALLI_CNT];	// 邀请我加入联盟的列表
	STradingArea trading;										// 跑商结构
	SActTower actTower;											// 千层塔
	SActTerrace actTerrace;										// 点将台
	uint32 buyLimitTime;										// 购买受限道具的时间
	int32 buyLimitCount;										// 购买受限道具的个数
	SBuyLimitItem buyLimitItems[MAX_BUY_ITEMS_CNT];				// 购买受限的道具
	SVip vip;													// vip功能
	SCDKey cdkey;												// cd key
	//tolua_end

	SMiscs():inviteJoinAllianceCount(0),
		buyLimitTime(0),
		buyLimitCount(0){
		applyAlliance[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_STRUCT(clientCfg, 29);
		D_STRING(applyAlliance, MAX_ALLINAME_ARR_LEN, 15);
		D_UINT8(inviteJoinAllianceCount, 15);
		D_ARRAY_STRUCT(inviteJoinAlliances, inviteJoinAllianceCount, MAX_INVITE_JOIN_ALLI_CNT, 15);
		D_STRUCT(trading, 16);
		D_STRUCT(actTower, 18);
		D_STRUCT(actTerrace, 18);
		D_UINT32(buyLimitTime, 106);
		D_INT32(buyLimitCount, 106);
		D_ARRAY_STRUCT(buyLimitItems, buyLimitCount, MAX_BUY_ITEMS_CNT, 106);
		D_STRUCT(vip, 110);
		D_STRUCT(cdkey, 115);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_STRUCT(clientCfg, 29);
		E_STRING(applyAlliance, MAX_ALLINAME_ARR_LEN, 15);
		E_UINT8(inviteJoinAllianceCount, 15);
		E_ARRAY_STRUCT(inviteJoinAlliances, inviteJoinAllianceCount, MAX_INVITE_JOIN_ALLI_CNT, 15);
		E_STRUCT(trading, 16);
		E_STRUCT(actTower, 18);
		E_STRUCT(actTerrace, 18);
		E_UINT32(buyLimitTime, 106);
		E_INT32(buyLimitCount, 106);
		E_ARRAY_STRUCT(buyLimitItems, buyLimitCount, MAX_BUY_ITEMS_CNT, 106);
		E_STRUCT(vip, 110);
		E_STRUCT(cdkey, 115);
		return iPos;
	}
};//tolua_export


/*
 *  所有士兵列表结构
 */
struct SSoldierList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// 士兵类型个数
	SSoldier soldiers[MAX_SLDS_CNT];							// 士兵类型具体内容
	//tolua_end

	SSoldierList():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 1);
		D_ARRAY_STRUCT(soldiers, count, MAX_SLDS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 1);
		E_ARRAY_STRUCT(soldiers, count, MAX_SLDS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  单个英雄携带士兵结构
 */
struct SCarrySoldier //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulResId;												// 士兵资源ID
	uint32 ulNumber;											// 士兵个数
	//tolua_end

	SCarrySoldier():ulResId(0),
		ulNumber(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulResId, 1);
		D_UINT32(ulNumber, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulResId, 1);
		E_UINT32(ulNumber, 1);
		return iPos;
	}
};//tolua_export


/*
 *  所有英雄携带士兵列表结构
 */
struct SCarrySoldierList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 士兵类型个数
	SCarrySoldier astSoldiers[MAX_SLDS_CNT];					// 士兵类型具体内容
	//tolua_end

	SCarrySoldierList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astSoldiers, ucCount, MAX_SLDS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astSoldiers, ucCount, MAX_SLDS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄属性值列表
 */
struct SHeroAttrList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 属性个数
	SAttr astAttrs[MAX_HEROATTRS_CNT];							// 属性值
	//tolua_end

	SHeroAttrList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astAttrs, ucCount, MAX_HEROATTRS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astAttrs, ucCount, MAX_HEROATTRS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  道具属性值列表
 */
struct SItemAttrList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 属性个数
	SAttr astAttrs[MAX_ITEM_ATTRS_CNT];							// 属性值
	//tolua_end

	SItemAttrList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astAttrs, ucCount, MAX_ITEM_ATTRS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astAttrs, ucCount, MAX_ITEM_ATTRS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  镶嵌宝石列表
 */
struct SGemBesetList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 宝石个数
	uint32 aulGems[MAX_GEMBESET_CNT];							// 宝石resid列表
	//tolua_end

	SGemBesetList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 3);
		D_ARRAY_UINT32(aulGems, ucCount, MAX_GEMBESET_CNT, 3);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 3);
		E_ARRAY_UINT32(aulGems, ucCount, MAX_GEMBESET_CNT, 3);
		return iPos;
	}
};//tolua_export


/*
 *  道具（包括普通物品、装备、宝石等）
 */
struct SItem //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 ullId;												// 道具ID
	uint8 ucType;												// 道具类型
	uint32 ulResId;												// 道具资源ID
	uint16 usNumber;											// 道具堆叠个数
	uint8 ucForceLevel;											// 强化等级
	SItemAttrList stAttrs;										// 属性列表
	SGemBesetList stGems;										// 宝石列表
	//tolua_end

	SItem():ullId(0),
		ucType(0),
		ulResId(0),
		usNumber(0),
		ucForceLevel(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(ullId, 1);
		D_UINT8(ucType, 1);
		D_UINT32(ulResId, 1);
		D_UINT16(usNumber, 1);
		D_UINT8(ucForceLevel, 3);
		D_STRUCT(stAttrs, 1);
		D_STRUCT(stGems, 3);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(ullId, 1);
		E_UINT8(ucType, 1);
		E_UINT32(ulResId, 1);
		E_UINT16(usNumber, 1);
		E_UINT8(ucForceLevel, 3);
		E_STRUCT(stAttrs, 1);
		E_STRUCT(stGems, 3);
		return iPos;
	}
};//tolua_export


/*
 *  道具属性值列表
 */
struct SItemAttrListEx //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// 属性个数
	SAttrEx attrs[MAX_ITEM_ATTRS_CNT];							// 属性值
	//tolua_end

	SItemAttrListEx():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 1);
		D_ARRAY_STRUCT(attrs, count, MAX_ITEM_ATTRS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 1);
		E_ARRAY_STRUCT(attrs, count, MAX_ITEM_ATTRS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  镶嵌宝石列表
 */
struct SGemBesetListEx //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// 宝石个数
	uint32 gems[MAX_GEMBESET_CNT];								// 宝石resid列表
	//tolua_end

	SGemBesetListEx():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 3);
		D_ARRAY_UINT32(gems, count, MAX_GEMBESET_CNT, 3);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 3);
		E_ARRAY_UINT32(gems, count, MAX_GEMBESET_CNT, 3);
		return iPos;
	}
};//tolua_export


/*
 *  道具（包括普通物品、装备、宝石等）
 */
struct SItemEx //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 id;													// 道具ID
	uint8 type;													// 道具类型
	uint8 isRaw;												// 道具是否已被鉴定
	uint8 isBind;												// 道具是否已绑定
	uint32 resId;												// 道具资源ID
	uint16 number;												// 道具堆叠个数
	uint8 forceLevel;											// 强化等级
	SItemAttrListEx attrs;										// 属性列表
	SGemBesetListEx gems;										// 宝石列表
	//tolua_end

	SItemEx():id(0),
		type(0),
		isRaw(0),
		isBind(0),
		resId(0),
		number(0),
		forceLevel(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(id, 1);
		D_UINT8(type, 1);
		D_UINT8(isRaw, 5);
		D_UINT8(isBind, 6);
		D_UINT32(resId, 1);
		D_UINT16(number, 1);
		D_UINT8(forceLevel, 3);
		D_STRUCT(attrs, 1);
		D_STRUCT(gems, 3);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(id, 1);
		E_UINT8(type, 1);
		E_UINT8(isRaw, 5);
		E_UINT8(isBind, 6);
		E_UINT32(resId, 1);
		E_UINT16(number, 1);
		E_UINT8(forceLevel, 3);
		E_STRUCT(attrs, 1);
		E_STRUCT(gems, 3);
		return iPos;
	}
};//tolua_export


/*
 *  穿戴装备
 */
struct SWear //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 armPos;												// 装备位置
	SItemEx arm;												// 装备
	//tolua_end

	SWear():armPos(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(armPos, 1);
		D_STRUCT(arm, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(armPos, 1);
		E_STRUCT(arm, 1);
		return iPos;
	}
};//tolua_export


/*
 *  穿戴装备列表
 */
struct SWearList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// 装备个数
	SWear wears[MAX_HEROWEAR_CNT];								// 装备
	//tolua_end

	SWearList():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 1);
		D_ARRAY_STRUCT(wears, count, MAX_HEROWEAR_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 1);
		E_ARRAY_STRUCT(wears, count, MAX_HEROWEAR_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  道具列表结构
 */
struct SItemListEx //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 count;												// 道具格子数
	SItemEx items[MAX_ITEMS_CNT];								// 道具列表的具体内容
	//tolua_end

	SItemListEx():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(count, 4);
		D_ARRAY_STRUCT(items, count, MAX_ITEMS_CNT, 4);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(count, 4);
		E_ARRAY_STRUCT(items, count, MAX_ITEMS_CNT, 4);
		return iPos;
	}
};//tolua_export


/*
 *  角色身上所有的道具
 */
struct SAllItems //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulGiftGold;											// 礼金卷
	uint32 ulGold;												// 金币
	uint16 usGridMaxCnt;										// 格子最大数
	SItemListEx stItems;										// 背包中的物品
	uint32 lastSalveTime;										// 最近一次刷新药膏的时间
	//tolua_end

	SAllItems():ulGiftGold(0),
		ulGold(0),
		usGridMaxCnt(0),
		lastSalveTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulGiftGold, 1);
		D_UINT32(ulGold, 1);
		D_UINT16(usGridMaxCnt, 1);
		D_STRUCT(stItems, 4);
		D_UINT32(lastSalveTime, 14);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulGiftGold, 1);
		E_UINT32(ulGold, 1);
		E_UINT16(usGridMaxCnt, 1);
		E_STRUCT(stItems, 4);
		E_UINT32(lastSalveTime, 14);
		return iPos;
	}
};//tolua_export


/*
 *  技能
 */
struct SSkill //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulResId;												// 技能资源ID
	uint8 ucLevel;												// 技能等级
	uint32 ulDex;												// 当前的熟练度
	//tolua_end

	SSkill():ulResId(0),
		ucLevel(0),
		ulDex(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulResId, 1);
		D_UINT8(ucLevel, 1);
		D_UINT32(ulDex, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulResId, 1);
		E_UINT8(ucLevel, 1);
		E_UINT32(ulDex, 1);
		return iPos;
	}
};//tolua_export


/*
 *  技能列表
 */
struct SSkillList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 技能个数
	SSkill astSkills[MAX_HERO_SKILL_CNT];						// 技能
	//tolua_end

	SSkillList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astSkills, ucCount, MAX_HERO_SKILL_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astSkills, ucCount, MAX_HERO_SKILL_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  道具快捷
 */
struct SSCut //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCutPos;												// 道具快捷位置
	uint32 ulResId;												// 关联的道具资源id
	//tolua_end

	SSCut():ucCutPos(0),
		ulResId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCutPos, 1);
		D_UINT32(ulResId, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCutPos, 1);
		E_UINT32(ulResId, 1);
		return iPos;
	}
};//tolua_export


/*
 *  道具快捷列表
 */
struct SSCutList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 快捷个数
	SSCut astSCuts[MAX_HERO_SCUT_CNT];							// 快捷
	//tolua_end

	SSCutList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astSCuts, ucCount, MAX_HERO_SCUT_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astSCuts, ucCount, MAX_HERO_SCUT_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄修炼结构
 */
struct OSHeroSteel //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucSteelType;											// 修炼类型
	uint32 ulStartTime;											// 开始修炼时间（单位秒）
	uint32 ulLastTime;											// 最近一次计算更新的修炼时间（单位秒）
	uint8 ucHours;												// 修炼的小时数
	uint64 ullExp;												// 已经获得的经验
	uint32 ulTakeGold;											// 已经获得的经验
	//tolua_end

	OSHeroSteel():ucSteelType(0),
		ulStartTime(0),
		ulLastTime(0),
		ucHours(0),
		ullExp(0),
		ulTakeGold(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucSteelType, 1);
		D_UINT32(ulStartTime, 1);
		D_UINT32(ulLastTime, 1);
		D_UINT8(ucHours, 1);
		D_UINT64(ullExp, 1);
		D_UINT32(ulTakeGold, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucSteelType, 1);
		E_UINT32(ulStartTime, 1);
		E_UINT32(ulLastTime, 1);
		E_UINT8(ucHours, 1);
		E_UINT64(ullExp, 1);
		E_UINT32(ulTakeGold, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄修炼结构
 */
struct SHeroSteel //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 steelType;											// 修炼类型
	uint32 startTime;											// 开始修炼时间（单位秒）
	uint8 quarters;												// 修炼的15分钟数
	uint32 quarterRes;											// 一刻钟可获得的经验
	uint32 quarterMoney;										// 一刻钟消耗的钱币
	uint32 hourGold;											// 一小时消耗的金币
	uint8 actMult;												// 活动加成的倍数
	//tolua_end

	SHeroSteel():steelType(0),
		startTime(0),
		quarters(0),
		quarterRes(0),
		quarterMoney(0),
		hourGold(0),
		actMult(1){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(steelType, 12);
		D_UINT32(startTime, 12);
		D_UINT8(quarters, 12);
		D_UINT32(quarterRes, 12);
		D_UINT32(quarterMoney, 12);
		D_UINT32(hourGold, 12);
		D_UINT8(actMult, 103);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(steelType, 12);
		E_UINT32(startTime, 12);
		E_UINT8(quarters, 12);
		E_UINT32(quarterRes, 12);
		E_UINT32(quarterMoney, 12);
		E_UINT32(hourGold, 12);
		E_UINT8(actMult, 103);
		return iPos;
	}
};//tolua_export


/*
 *  英雄结构
 */
struct SOHero //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 ullId;												// 英雄Id
	uint32 ulResId;												// 英雄ResId
	char szName[MAX_HERONAME_ARR_LEN];							// 英雄名
	uint8 ucLevel;												// 英雄等级
	uint32 ulExp;												// 英雄经验
	uint8 ucState;												// 英雄状态
	uint32 ulCityId;											// 英雄当前所在城市id
	uint32 ulCityPosX;											// 英雄当前所在城市水平坐标
	uint32 ulCityPosY;											// 英雄当前所在城市垂直坐标
	uint8 aucSubjects[MAX_SUBJECT_CNT];							// 英雄兵科列表
	SCarrySoldierList stSoldiers;								// 携带的士兵列表
	SHeroAttrList stAttrs;										// 属性列表
	SWearList stWears;											// 穿戴装备列表
	SSkillList stSkills;										// 技能列表
	SSCutList stSCuts;											// 道具快捷列表
	SHeroSteel stSteel;											// 英雄修炼
	//tolua_end

	SOHero():ullId(0),
		ulResId(0),
		ucLevel(0),
		ulExp(0),
		ucState(0),
		ulCityId(0),
		ulCityPosX(0),
		ulCityPosY(0){
		szName[0]=0;
		memset(aucSubjects, 0, sizeof(aucSubjects[0])*MAX_SUBJECT_CNT);
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(ullId, 1);
		D_UINT32(ulResId, 1);
		D_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		D_UINT8(ucLevel, 1);
		D_UINT32(ulExp, 1);
		D_UINT8(ucState, 1);
		D_UINT32(ulCityId, 1);
		D_UINT32(ulCityPosX, 1);
		D_UINT32(ulCityPosY, 1);
		D_ARRAY_UINT8(aucSubjects, MAX_SUBJECT_CNT, MAX_SUBJECT_CNT, 1);
		D_STRUCT(stSoldiers, 1);
		D_STRUCT(stAttrs, 1);
		D_STRUCT(stWears, 1);
		D_STRUCT(stSkills, 1);
		D_STRUCT(stSCuts, 1);
		D_STRUCT(stSteel, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(ullId, 1);
		E_UINT32(ulResId, 1);
		E_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		E_UINT8(ucLevel, 1);
		E_UINT32(ulExp, 1);
		E_UINT8(ucState, 1);
		E_UINT32(ulCityId, 1);
		E_UINT32(ulCityPosX, 1);
		E_UINT32(ulCityPosY, 1);
		E_ARRAY_UINT8(aucSubjects, MAX_SUBJECT_CNT, MAX_SUBJECT_CNT, 1);
		E_STRUCT(stSoldiers, 1);
		E_STRUCT(stAttrs, 1);
		E_STRUCT(stWears, 1);
		E_STRUCT(stSkills, 1);
		E_STRUCT(stSCuts, 1);
		E_STRUCT(stSteel, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄技能修炼结构
 */
struct SSkillSteel //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulResId;												// 技能ResId
	uint32 ulStoptime;											// 技能修炼结束时刻
	uint32 ulDurtime;											// 技能修炼的时长，单位小时
	//tolua_end

	SSkillSteel():ulResId(0),
		ulStoptime(0),
		ulDurtime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulResId, 1);
		D_UINT32(ulStoptime, 1);
		D_UINT32(ulDurtime, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulResId, 1);
		E_UINT32(ulStoptime, 1);
		E_UINT32(ulDurtime, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄结构
 */
struct SHero //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 ullId;												// 英雄Id
	uint8 ucProf;												// 英雄职业
	char szName[MAX_HERONAME_ARR_LEN];							// 英雄名
	uint8 ucLevel;												// 英雄等级
	uint8 ucSkeletonLevel;										// 英雄脉络等级
	uint32 ulSSteelStopTime;									// 英雄修炼结束时间
	uint32 ulIcon;												// 英雄头像
	uint8 ucSex;												// 英雄性别
	uint8 ucState;												// 英雄状态
	uint8 ucOfficial;											// 英雄官职
	uint8 ucLockState;											// 锁定状态
	uint32 ulUnlockTime;										// 解锁到期时间
	uint8 aucSubjects[MAX_SUBJECT_CNT];							// 英雄兵科列表
	SHeroAttrList stAttrs;										// 属性列表
	SSoldier stSoldier;											// 携带的士兵
	SWearList stWears;											// 穿戴装备列表
	SSkillList stSkills;										// 技能列表
	uint32 ulCurTacticSkill;									// 当前装备的战略技能
	SHeroSteel stSteel;											// 英雄修炼
	SSkillSteel stSkillSteel;									// 英雄技能修炼
	//tolua_end

	SHero():ullId(0),
		ucProf(0),
		ucLevel(0),
		ucSkeletonLevel(0),
		ulSSteelStopTime(0),
		ulIcon(0),
		ucSex(0),
		ucState(0),
		ucOfficial(0),
		ucLockState(0),
		ulUnlockTime(0),
		ulCurTacticSkill(0){
		szName[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(ullId, 1);
		D_UINT8(ucProf, 1);
		D_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		D_UINT8(ucLevel, 1);
		D_UINT8(ucSkeletonLevel, 1);
		D_UINT32(ulSSteelStopTime, 1);
		D_UINT32(ulIcon, 1);
		D_UINT8(ucSex, 1);
		D_UINT8(ucState, 1);
		D_UINT8(ucOfficial, 1);
		D_UINT8(ucLockState, 1);
		D_UINT32(ulUnlockTime, 1);
		D_ARRAY_UINT8(aucSubjects, MAX_SUBJECT_CNT, MAX_SUBJECT_CNT, 1);
		D_STRUCT(stAttrs, 1);
		D_STRUCT(stSoldier, 1);
		D_STRUCT(stWears, 1);
		D_STRUCT(stSkills, 1);
		D_UINT32(ulCurTacticSkill, 1);
		D_STRUCT(stSteel, 1);
		D_STRUCT(stSkillSteel, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(ullId, 1);
		E_UINT8(ucProf, 1);
		E_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		E_UINT8(ucLevel, 1);
		E_UINT8(ucSkeletonLevel, 1);
		E_UINT32(ulSSteelStopTime, 1);
		E_UINT32(ulIcon, 1);
		E_UINT8(ucSex, 1);
		E_UINT8(ucState, 1);
		E_UINT8(ucOfficial, 1);
		E_UINT8(ucLockState, 1);
		E_UINT32(ulUnlockTime, 1);
		E_ARRAY_UINT8(aucSubjects, MAX_SUBJECT_CNT, MAX_SUBJECT_CNT, 1);
		E_STRUCT(stAttrs, 1);
		E_STRUCT(stSoldier, 1);
		E_STRUCT(stWears, 1);
		E_STRUCT(stSkills, 1);
		E_UINT32(ulCurTacticSkill, 1);
		E_STRUCT(stSteel, 1);
		E_STRUCT(stSkillSteel, 1);
		return iPos;
	}
};//tolua_export


/*
 *  酒馆中的英雄
 */
struct SNewHero //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulId;												// Id
	uint8 ucProf;												// 英雄职业
	char szName[MAX_HERONAME_ARR_LEN];							// 英雄名
	uint8 ucLevel;												// 英雄等级
	uint32 ulIcon;												// 英雄头像
	uint8 ucSex;												// 英雄性别
	uint8 ucAttrCount;											// 属性个数
	SAttr astAttrs[MAX_NEWHEROATTRS_CNT];						// 属性值
	//tolua_end

	SNewHero():ulId(0),
		ucProf(0),
		ucLevel(0),
		ulIcon(0),
		ucSex(0),
		ucAttrCount(0){
		szName[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulId, 1);
		D_UINT8(ucProf, 1);
		D_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		D_UINT8(ucLevel, 1);
		D_UINT32(ulIcon, 1);
		D_UINT8(ucSex, 1);
		D_UINT8(ucAttrCount, 1);
		D_ARRAY_STRUCT(astAttrs, ucAttrCount, MAX_NEWHEROATTRS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulId, 1);
		E_UINT8(ucProf, 1);
		E_STRING(szName, MAX_HERONAME_ARR_LEN, 1);
		E_UINT8(ucLevel, 1);
		E_UINT32(ulIcon, 1);
		E_UINT8(ucSex, 1);
		E_UINT8(ucAttrCount, 1);
		E_ARRAY_STRUCT(astAttrs, ucAttrCount, MAX_NEWHEROATTRS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  英雄列表结构
 */
struct SHeroList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulHeroAttrLastTime;									// 英雄属性刷新的上次时间
	uint8 ucCount;												// 英雄个数
	SHero astHeros[MAX_HERO_CNT];								// 英雄具体内容
	uint32 ulCanUseSSTime;										// 可使用的技能修炼时间
	uint32 ulNewHeroLastTime;									// 酒馆中英雄刷新的上次时间
	uint8 ucNewCount;											// 酒馆中英雄个数
	SNewHero astNewHeros[MAX_NEWHERO_CNT];						// 酒馆中英雄具体内容
	//tolua_end

	SHeroList():ulHeroAttrLastTime(0),
		ucCount(0),
		ulCanUseSSTime(0),
		ulNewHeroLastTime(0),
		ucNewCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulHeroAttrLastTime, 1);
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astHeros, ucCount, MAX_HERO_CNT, 1);
		D_UINT32(ulCanUseSSTime, 1);
		D_UINT32(ulNewHeroLastTime, 1);
		D_UINT8(ucNewCount, 1);
		D_ARRAY_STRUCT(astNewHeros, ucNewCount, MAX_NEWHERO_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulHeroAttrLastTime, 1);
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astHeros, ucCount, MAX_HERO_CNT, 1);
		E_UINT32(ulCanUseSSTime, 1);
		E_UINT32(ulNewHeroLastTime, 1);
		E_UINT8(ucNewCount, 1);
		E_ARRAY_STRUCT(astNewHeros, ucNewCount, MAX_NEWHERO_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  战报结构
 */
struct SBulletin //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	//tolua_end

	SBulletin(){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		return iPos;
	}
};//tolua_export


/*
 *  战报结构列表
 */
struct SBulletinList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 战报个数
	SBulletin astBulletins[MAX_BULLETINS_CNT];					// 战报具体内容
	//tolua_end

	SBulletinList():ucCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astBulletins, ucCount, MAX_BULLETINS_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astBulletins, ucCount, MAX_BULLETINS_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  好友结构
 */
struct SBuddy //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 flag;													// 好友类型标志
	uint64 roleId;												// 角色id
	//tolua_end

	SBuddy():flag(0),
		roleId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(flag, 1);
		D_UINT64(roleId, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(flag, 1);
		E_UINT64(roleId, 1);
		return iPos;
	}
};//tolua_export


/*
 *  好友结构列表
 */
struct SBuddyList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint16 count;												// 好友个数
	SBuddy buddys[MAX_BUDDYS_CNT];								// 好友具体内容
	uint16 applyCount;											// 申请个数
	uint64 applyRoleIds[MAX_BUDDYS_APPLY_CNT];					// 申请列表
	//tolua_end

	SBuddyList():count(0),
		applyCount(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT16(count, 1);
		D_ARRAY_STRUCT(buddys, count, MAX_BUDDYS_CNT, 1);
		D_UINT16(applyCount, 1);
		D_ARRAY_UINT64(applyRoleIds, applyCount, MAX_BUDDYS_APPLY_CNT, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT16(count, 1);
		E_ARRAY_STRUCT(buddys, count, MAX_BUDDYS_CNT, 1);
		E_UINT16(applyCount, 1);
		E_ARRAY_UINT64(applyRoleIds, applyCount, MAX_BUDDYS_APPLY_CNT, 1);
		return iPos;
	}
};//tolua_export


/*
 *  农场结构
 */
struct SFarm //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 ulId;												// 农场位置Id
	uint32 ulResId;												// 农场资源Id
	uint8 ucLevel;												// 资源等级
	uint8 ucState;												// 资源成长状态
	uint32 ulStartTime;											// 资源成长的起始时间
	uint32 ulStopTime;											// 资源何时成长完成
	uint32 ulTotalRes;											// 资源成长完成后可采集的总的数量
	uint32 ulLeftRes;											// 资源成长完成后可采集的剩余的数量
	uint8 collectorCount;										// 采集者数量
	uint64 collectors[MAX_COLLECTOR_CNT];						// 采集者id列表
	uint32 seqId;												// 农场资源seqId
	uint32 protectStopTime;										// 农场资源seqId
	//tolua_end

	SFarm():ulId(0),
		ulResId(0),
		ucLevel(1),
		ucState(0),
		ulStartTime(0),
		ulStopTime(0),
		ulTotalRes(0),
		ulLeftRes(0),
		collectorCount(0),
		seqId(0),
		protectStopTime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(ulId, 1);
		D_UINT32(ulResId, 1);
		D_UINT8(ucLevel, 1);
		D_UINT8(ucState, 1);
		D_UINT32(ulStartTime, 1);
		D_UINT32(ulStopTime, 1);
		D_UINT32(ulTotalRes, 1);
		D_UINT32(ulLeftRes, 1);
		D_UINT8(collectorCount, 9);
		D_ARRAY_UINT64(collectors, collectorCount, MAX_COLLECTOR_CNT, 9);
		D_UINT32(seqId, 100);
		D_UINT32(protectStopTime, 110);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(ulId, 1);
		E_UINT32(ulResId, 1);
		E_UINT8(ucLevel, 1);
		E_UINT8(ucState, 1);
		E_UINT32(ulStartTime, 1);
		E_UINT32(ulStopTime, 1);
		E_UINT32(ulTotalRes, 1);
		E_UINT32(ulLeftRes, 1);
		E_UINT8(collectorCount, 9);
		E_ARRAY_UINT64(collectors, collectorCount, MAX_COLLECTOR_CNT, 9);
		E_UINT32(seqId, 100);
		E_UINT32(protectStopTime, 110);
		return iPos;
	}
};//tolua_export


/*
 *  农场记录结构
 */
struct SFarmLog //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucType;												// 记录类型
	char szRName[MAX_ROLENAME_ARR_LEN];							// 角色名
	uint32 ulLogTime;											// 记录日志的时间
	uint32 ulParam1;											// 记录参数1
	uint32 ulParam2;											// 记录参数2
	uint32 ulParam3;											// 记录参数3
	uint32 ulParam4;											// 记录参数4
	//tolua_end

	SFarmLog():ucType(0),
		ulLogTime(0),
		ulParam1(0),
		ulParam2(0),
		ulParam3(0),
		ulParam4(0){
		szRName[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucType, 1);
		D_STRING(szRName, MAX_ROLENAME_ARR_LEN, 1);
		D_UINT32(ulLogTime, 1);
		D_UINT32(ulParam1, 1);
		D_UINT32(ulParam2, 1);
		D_UINT32(ulParam3, 1);
		D_UINT32(ulParam4, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucType, 1);
		E_STRING(szRName, MAX_ROLENAME_ARR_LEN, 1);
		E_UINT32(ulLogTime, 1);
		E_UINT32(ulParam1, 1);
		E_UINT32(ulParam2, 1);
		E_UINT32(ulParam3, 1);
		E_UINT32(ulParam4, 1);
		return iPos;
	}
};//tolua_export


/*
 *  农场结构列表
 */
struct SFarmList //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 ucCount;												// 农场个数
	SFarm astFarms[MAX_FARM_CNT];								// 农场具体内容
	uint32 ulLogVer;											// 记录块的版本号
	uint8 ucLogCount;											// 农场操作记录个数
	SFarmLog astFarmLogs[MAX_FARM_LOG_CNT];						// 农场具体记录
	uint32 farmVer;												// 农场的版本号
	uint32 lastSeqId;											// 地块最后一次的seqId
	//tolua_end

	SFarmList():ucCount(0),
		ulLogVer(0),
		ucLogCount(0),
		farmVer(0),
		lastSeqId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(ucCount, 1);
		D_ARRAY_STRUCT(astFarms, ucCount, MAX_FARM_CNT, 1);
		D_UINT32(ulLogVer, 1);
		D_UINT8(ucLogCount, 1);
		D_ARRAY_STRUCT(astFarmLogs, ucLogCount, MAX_FARM_LOG_CNT, 1);
		D_UINT32(farmVer, 9);
		D_UINT32(lastSeqId, 100);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(ucCount, 1);
		E_ARRAY_STRUCT(astFarms, ucCount, MAX_FARM_CNT, 1);
		E_UINT32(ulLogVer, 1);
		E_UINT8(ucLogCount, 1);
		E_ARRAY_STRUCT(astFarmLogs, ucLogCount, MAX_FARM_LOG_CNT, 1);
		E_UINT32(farmVer, 9);
		E_UINT32(lastSeqId, 100);
		return iPos;
	}
};//tolua_export


/*
 *  科技
 */
struct SCulture //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 level;												// 科技等级
	uint32 id;													// 科技资源id
	//tolua_end

	SCulture():level(0),
		id(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(level, 1);
		D_UINT32(id, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(level, 1);
		E_UINT32(id, 1);
		return iPos;
	}
};//tolua_export


/*
 *  正在研究的科技
 */
struct SLearningCulture //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint32 id;													// 科技id
	uint32 stoptime;											// 停止时间
	//tolua_end

	SLearningCulture():id(0),
		stoptime(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT32(id, 1);
		D_UINT32(stoptime, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT32(id, 1);
		E_UINT32(stoptime, 1);
		return iPos;
	}
};//tolua_export


/*
 *  科技列表
 */
struct SCultures //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint8 count;												// 科技个数
	SCulture cultures[MAX_CULTURE_CNT];							// 科技具体内容
	SLearningCulture learning;									// 正在研究的科技
	//tolua_end

	SCultures():count(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT8(count, 1);
		D_ARRAY_STRUCT(cultures, count, MAX_CULTURE_CNT, 1);
		D_STRUCT(learning, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT8(count, 1);
		E_ARRAY_STRUCT(cultures, count, MAX_CULTURE_CNT, 1);
		E_STRUCT(learning, 1);
		return iPos;
	}
};//tolua_export


/*
 *  需持久化保存的角色数据
 */
struct SDBVar //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 ullRoleId;											// 角色唯一id
	char szUName[MAX_USERNAME_ARR_LEN];							// 用户名
	char szRName[MAX_ROLENAME_ARR_LEN];							// 角色名
	uint8 ucSex;												// 性别
	SFixVar stFixVar;											// 持久不变的属性
	SBaseInfo stBInfos;											// 角色的一些基础属性
	SHeroList stHeros;											// 英雄列表
	SSoldierList soldiers;										// 士兵列表
	SCitys stCitys;												// 城市列表
	SFarmList stFarms;											// 农场列表
	SCultures cultures;											// 科技列表
	SAllItems stItems;											// 道具列表
	SStateList states;											// buff列表
	SMilitary military;											// 军事信息
	STaskList tasks;											// 任务列表
	SBulletinList stBulletins;									// 战报列表
	SBuddyList buddys;											// 好友列表
	SMiscs stMiscs;												// 杂项结构
	uint32 regTime;												// 角色创建时间
	uint32 lockToTime;											// 封号截止时间
	//tolua_end

	SDBVar():ullRoleId(0),
		ucSex(0),
		regTime(0),
		lockToTime(0){
		szUName[0]=0;
		szRName[0]=0;
	}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(ullRoleId, 1);
		D_STRING(szUName, MAX_USERNAME_ARR_LEN, 1);
		D_STRING(szRName, MAX_ROLENAME_ARR_LEN, 1);
		D_UINT8(ucSex, 1);
		D_STRUCT(stFixVar, 1);
		D_STRUCT(stBInfos, 1);
		D_STRUCT(stHeros, 1);
		D_STRUCT(soldiers, 1);
		D_STRUCT(stCitys, 1);
		D_STRUCT(stFarms, 1);
		D_STRUCT(cultures, 1);
		D_STRUCT(stItems, 1);
		D_STRUCT(states, 1);
		D_STRUCT(military, 1);
		D_STRUCT(tasks, 1);
		D_STRUCT(stBulletins, 1);
		D_STRUCT(buddys, 1);
		D_STRUCT(stMiscs, 1);
		D_UINT32(regTime, 23);
		D_UINT32(lockToTime, 114);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(ullRoleId, 1);
		E_STRING(szUName, MAX_USERNAME_ARR_LEN, 1);
		E_STRING(szRName, MAX_ROLENAME_ARR_LEN, 1);
		E_UINT8(ucSex, 1);
		E_STRUCT(stFixVar, 1);
		E_STRUCT(stBInfos, 1);
		E_STRUCT(stHeros, 1);
		E_STRUCT(soldiers, 1);
		E_STRUCT(stCitys, 1);
		E_STRUCT(stFarms, 1);
		E_STRUCT(cultures, 1);
		E_STRUCT(stItems, 1);
		E_STRUCT(states, 1);
		E_STRUCT(military, 1);
		E_STRUCT(tasks, 1);
		E_STRUCT(stBulletins, 1);
		E_STRUCT(buddys, 1);
		E_STRUCT(stMiscs, 1);
		E_UINT32(regTime, 23);
		E_UINT32(lockToTime, 114);
		return iPos;
	}
};//tolua_export


/*
 *  需持久化保存的联盟数据
 */
struct SDBAlliVar //tolua_export 
	: public SPkgBase 
{//tolua_export
	//tolua_begin
	uint64 ullallianceId;										// 联盟唯一id
	//tolua_end

	SDBAlliVar():ullallianceId(0){}

	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){
		D_UINT64(ullallianceId, 1);
		return iPos;
	}

	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){
		E_UINT64(ullallianceId, 1);
		return iPos;
	}
};//tolua_export


#pragma pack(pop)


#endif //_tq_role_338saf3w3_var_h_
