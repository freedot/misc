#ifndef _GRIDSMANAGER_H_INCLUDED_
#define _GRIDSMANAGER_H_INCLUDED_
#include "IGridsManager.h"
#include <map>
#include <string>
#include <IGameSys.h>

#define GRIDIDX_TO_ID(idx) (idx+1)  
#define GRIDID_TO_IDX(id) (id-1)

#define CITYIDX_TO_ID(idx) (idx+1)  
#define CITYID_TO_IDX(id) (id-1)

struct GridRect {
	int x1, y1, x2, y2;
};

namespace IO {
class IDatabase;
}

class GameSvr;

class GridsManager: public IGridsManager {
public:
	GridsManager();
	virtual ~GridsManager();

	void SetGameSvr(GameSvr* gameSvr);

	bool Load();

	Grid* GetGridById(int gridId);
	Grid* GetGridByRoleId(int64 roleId);
	int GetCityIdByGridId(int gridId);
	int GetFreeGridId(int cityId);
	void GetPosByGridId(int gridId, int& x, int& y);

	void RefreshExileRoleIds();
	Grid* GetExileGridByRoleId(int64 roleId);
	void RemoveExileGridByRoleId(int64 roleId);
	void AppendExileGrid(const Grid* gird);

	void ClearGrid(const Grid* grid);
	void CopyGrid(const Grid* des, const Grid* src);

	int64 GetRoleIdByRoleName(const char* roleName);
	int GetGridIdByRoleId(int64 roleId);
	void MapRoleNameToRoleId(const char* roleName, int64 roleId);
	void MapRoleIdToGridId(int64 roleId, int gridId);
	void SetMapView(int x1, int y1, int x2, int y2);

private:
	bool LoadMapGridsDB();
	bool LoadExileGridsDB();
	uint32 GetValueFromTable(char * misc, const char* key);
	void InitRoleIdMapGridId();
	void InitRoleNameMapRoleId();
	void AllocGrids();
	void FreeGrids();
	bool IsValidGridId(int gridId);
	void ReadGridFrowDBRow(Grid* grid);
	bool IsHasFreeGrid(int cityIdx);
	void AppendToCityExileRoles(const Grid* grid);
	bool IsInRects(int count, const GridRect* rects, int posX, int posY);
	void CollectCityIds();

private:
	GameSvr* m_gameSvr;
	IO::IDatabase* m_db;
	Grid* m_grids;
	std::vector<int> m_cityGridIds[CITYBLOCK_COUNT];
	std::vector<int> m_freeGridIdxs;

	GridRect m_mapView;

	std::map<int64, Grid> m_exileGrids;
	std::vector<std::vector<uint64> > m_cityExileRoles;

	std::map<int64, int> m_roleIdMapGridId;
	std::map<std::string, int64> m_roleNameMapRoleId;
};


#endif
