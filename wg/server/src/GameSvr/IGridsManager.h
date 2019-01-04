#ifndef _IGRIDSMANAGER_H_INCLUDED_
#define _IGRIDSMANAGER_H_INCLUDED_
#include <commhead.h>

enum OBJ_TYPE {
	OBJ_TYPE_NONE = 0,
	OBJ_TYPE_ROLE = 1,
	OBJ_TYPE_HERO = 2,
	OBJ_TYPE_GROUP = 3,
	OBJ_TYPE_FIELD = 4,
	OBJ_TYPE_COPYFIELD = 5,
	OBJ_TYPE_NPCFIELD = 6,
	OBJ_TYPE_TOWER = 7,
	OBJ_TYPE_OWNERFIELD = 8,
	OBJ_TYPE_CITYPOS = 9,
	OBJ_TYPE_DIED_ROLE = 10,
};

//tolua_begin
#define IS_MINI_MAP 0
#define IS_NEW_MAP 1

#define GRIDS_COUNT 360000
#define GRIDS_COL 600
#define GRIDS_ROW 600
#define CITYBLOCK_COUNT 4
//tolua_end

//tolua_begin
struct GridMisc {
	uint16 shiChangLevel;
	uint16 towerLayer;
	uint32 towerTime;
	uint32 towerRank;
	uint32 buildValTime;
	uint8 terraceGate;
	uint8 cityMaxLevel;

	uint8 is_yellow_vip;
	uint8 is_yellow_year_vip;
	uint8 yellow_vip_level;
	uint8 is_yellow_high_vip;

	uint8 is_blue_vip;
	uint8 is_blue_year_vip;
	uint8 blue_vip_level;
	uint8 is_super_blue_vip;
	uint8 _3366_grow_level;

	uint8 vip_level;

	uint16 lastRoleLevel;
	uint32 lastBuildVal;
	uint16 lastTowerLayer;
	uint32 lastTowerTime;
};

struct Grid {
	uint32 gridId;
	char objType;
	uint32 resId;
	uint32 modelId;
	char subCitys[28];
	uint64 roleId;
	char roleName[22];
	char userName[33];
	short icon;
	short level;
	char sex;
	char state;
	uint64 allianceId;
	uint64 enemyAlliId;
	uint32 refreshTime;
	char alliName[22];
	char cityLevel;
	uint32 buildCurVal;
	uint32 roleRank;
	char introduction[52];
	uint32 loginTime;
	GridMisc misc;
};
//tolua_end

//tolua_begin
class IGridsManager {
public:
	virtual bool Load() = 0;

	virtual Grid* GetGridById(int gridId) = 0;
	virtual Grid* GetGridByRoleId(int64 roleId) = 0;
	virtual int GetCityIdByGridId(int gridId) = 0;
	virtual int GetFreeGridId(int cityId) = 0;
	virtual void GetPosByGridId(int gridId, int& x, int& y) = 0;

	virtual int64 GetRoleIdByRoleName(const char* roleName) = 0;
	virtual int GetGridIdByRoleId(int64 roleId) = 0;
	virtual void MapRoleNameToRoleId(const char* roleName, int64 roleId) = 0;
	virtual void MapRoleIdToGridId(int64 roleId, int gridId) = 0;

	virtual void RefreshExileRoleIds() = 0;
	virtual Grid* GetExileGridByRoleId(int64 roleId) = 0;
	virtual void RemoveExileGridByRoleId(int64 roleId) = 0;
	virtual void AppendExileGrid(const Grid* gird) = 0;

	virtual void ClearGrid(const Grid* grid) = 0;
	virtual void CopyGrid(const Grid* des, const Grid* src) = 0;

	virtual void SetMapView(int x1, int y1, int x2, int y2) = 0;

	//tolua_end
	virtual ~IGridsManager() {
	}
	;
	//tolua_begin
};
//tolua_end

#endif
