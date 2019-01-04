#include <algorithm>
#include "GridsManager.h"
#include "gamesvr.h"
#include <IDatabase.h>
#define array_len(arr) (sizeof(arr)/sizeof(arr[0]))
using namespace std;

const GridRect c_cityRects1[] = { { 0, 0, 72, 120 }, { 72, 0, 165, 161 }, { 165, 0, 251, 263 }, { 251, 0, 340, 300 }, {
		340, 0, 455, 255 }, { 455, 0, 600, 229 } };
const GridRect c_cityRects2[] = { { 0, 120, 72, 161 }, { 0, 161, 165, 263 }, { 0, 263, 251, 300 }, { 0, 300, 310, 366 },
		{ 0, 366, 278, 448 }, { 0, 448, 221, 549 }, { 0, 549, 200, 600 } };
const GridRect c_cityRects3[] = { { 200, 549, 221, 600 }, { 221, 448, 278, 600 }, { 278, 366, 310, 600 }, { 310, 300,
		340, 600 }, { 340, 255, 455, 600 }, { 455, 229, 600, 600 } };
const GridRect c_cityRects4[] = { { 268, 268, 329, 329 } };


GridsManager::GridsManager() :
		m_gameSvr(NULL), m_db(NULL), m_grids(NULL) {
	SetMapView(200, 200, 400, 400);
	AllocGrids();
	m_freeGridIdxs.reserve(10000);
	m_cityExileRoles.resize(CITYBLOCK_COUNT);
}

GridsManager::~GridsManager() {
	FreeGrids();
}

void GridsManager::SetMapView(int x1, int y1, int x2, int y2) {
	m_mapView.x1 = x1;
	m_mapView.y1 = y1;
	m_mapView.x2 = x2;
	m_mapView.y2 = y2;

	CollectCityIds();
}

void GridsManager::CollectCityIds() {
	for (int i = 0; i < CITYBLOCK_COUNT; i++) {
		m_cityGridIds[i].reserve(10000);
		m_cityGridIds[i].clear();
	}

	for (int gridId = 1; gridId <= GRIDS_COUNT; gridId++) {
		int cityId = GetCityIdByGridId(gridId);
		if (cityId <= 0)
			continue;
		m_cityGridIds[CITYID_TO_IDX(cityId)].push_back(gridId);
	}
}

void GridsManager::ClearGrid(const Grid* grid) {
	if (grid == NULL)
		return;
	uint32 gridId = grid->gridId;
	memset((void*) grid, 0, sizeof(Grid));
	((Grid*) grid)->gridId = gridId;
}

void GridsManager::CopyGrid(const Grid* des, const Grid* src) {
	if (src == NULL || des == NULL)
		return;
	uint32 gridId = des->gridId;
	memcpy((void*) des, (const void*) src, sizeof(Grid));
	((Grid*) des)->gridId = gridId;
}

void GridsManager::AllocGrids() {
	m_grids = new Grid[GRIDS_COUNT];
}

void GridsManager::FreeGrids() {
	SafeDeleteArray(m_grids);
}

void GridsManager::SetGameSvr(GameSvr* gameSvr) {
	m_gameSvr = gameSvr;
	m_db = m_gameSvr->GetDB();
}

bool GridsManager::Load() {
	if (!LoadMapGridsDB())
		return false;
	if (!LoadExileGridsDB())
		return false;

	RefreshExileRoleIds();
	InitRoleIdMapGridId();
	InitRoleNameMapRoleId();
	return true;
}

bool GridsManager::LoadMapGridsDB() {
	if (m_db == NULL) {
		cerr << "load mapgrids db failed: the m_db is null!" << endl;
		return false;
	}

	if (!m_db->Query("select * from mapgrids order by gridId;")) {
		cerr << "load mapgrids db failed: select error!" << endl;
		return false;
	}

	int rowCount = m_db->GetRowCount();
	if (rowCount != GRIDS_COUNT) {
		cerr << "load mapgrids db failed: select count error, is " << rowCount << endl;
		return false;
	}

	for (int i = 0; i < rowCount; ++i) {
		m_db->GetRow();

		Grid* grid = GetGridById(GRIDIDX_TO_ID(i));
		ReadGridFrowDBRow(grid);
	}

	return true;
}

bool GridsManager::LoadExileGridsDB() {
	if (m_db == NULL) {
		cerr << "load exilegrids db failed: the m_db is null!" << endl;
		return false;
	}

	if (!m_db->Query("select * from exilegrids order by gridId;")) {
		cerr << "load exilegrids db failed: select error!" << endl;
		return false;
	}

	int rowCount = m_db->GetRowCount();
	for (int i = 0; i < rowCount; ++i) {
		m_db->GetRow();

		Grid grid;
		ReadGridFrowDBRow(&grid);
		m_exileGrids[grid.roleId] = grid;
	}

	return true;
}

void GridsManager::ReadGridFrowDBRow(Grid* grid) {
	if (grid == NULL)
		return;
	//std::cout << "ReadGridFrowDBRow .. 1, gridId:" << grid->gridId << std::endl;
	int fieldIdx = 0;
	grid->gridId = atoi(m_db->GetField(fieldIdx++));
	grid->objType = atoi(m_db->GetField(fieldIdx++));
	grid->resId = atoi(m_db->GetField(fieldIdx++));
	grid->modelId = atoi(m_db->GetField(fieldIdx++));
	SafeStrCpy(grid->subCitys, m_db->GetField(fieldIdx++), sizeof(grid->subCitys));
	grid->roleId = SafeAsciToUInt64(m_db->GetField(fieldIdx++));
	SafeStrCpy(grid->roleName, m_db->GetField(fieldIdx++), sizeof(grid->roleName));
	SafeStrCpy(grid->userName, m_db->GetField(fieldIdx++), sizeof(grid->userName));
	grid->icon = atoi(m_db->GetField(fieldIdx++));
	grid->level = atoi(m_db->GetField(fieldIdx++));
	grid->sex = atoi(m_db->GetField(fieldIdx++));
	grid->state = atoi(m_db->GetField(fieldIdx++));
	grid->allianceId = SafeAsciToUInt64(m_db->GetField(fieldIdx++));
	grid->enemyAlliId = SafeAsciToUInt64(m_db->GetField(fieldIdx++));
	grid->refreshTime = SafeAsciToULong(m_db->GetField(fieldIdx++));
	SafeStrCpy(grid->alliName, m_db->GetField(fieldIdx++), sizeof(grid->alliName));
	grid->cityLevel = atoi(m_db->GetField(fieldIdx++));
	grid->buildCurVal = atoi(m_db->GetField(fieldIdx++));
	grid->roleRank = atoi(m_db->GetField(fieldIdx++));
	SafeStrCpy(grid->introduction, m_db->GetField(fieldIdx++), sizeof(grid->introduction));
	grid->loginTime = SafeAsciToULong(m_db->GetField(fieldIdx++));
	//std::cout << "ReadGridFrowDBRow .. 2" << std::endl;
	char* misc = m_db->GetField(fieldIdx++);
	grid->misc.shiChangLevel = GetValueFromTable(misc, "shiChangLevel");
	grid->misc.towerLayer = GetValueFromTable(misc, "towerLayer");
	grid->misc.towerTime = GetValueFromTable(misc, "towerTime");
	grid->misc.towerRank = GetValueFromTable(misc, "towerRank");
	grid->misc.buildValTime = GetValueFromTable(misc, "buildValTime");
	grid->misc.terraceGate = GetValueFromTable(misc, "terraceGate");
	grid->misc.cityMaxLevel = GetValueFromTable(misc, "cityMaxLevel");
	//std::cout << "ReadGridFrowDBRow .. 3" << std::endl;
	grid->misc.is_yellow_vip = GetValueFromTable(misc, "is_yellow_vip");
	grid->misc.is_yellow_year_vip = GetValueFromTable(misc, "is_yellow_year_vip");
	grid->misc.yellow_vip_level = GetValueFromTable(misc, "yellow_vip_level");
	grid->misc.is_yellow_high_vip = GetValueFromTable(misc, "is_yellow_high_vip");
	grid->misc.is_blue_vip = GetValueFromTable(misc, "is_blue_vip");
	grid->misc.is_blue_year_vip = GetValueFromTable(misc, "is_blue_year_vip");
	grid->misc.blue_vip_level = GetValueFromTable(misc, "blue_vip_level");
	grid->misc.is_super_blue_vip = GetValueFromTable(misc, "is_super_blue_vip");
	grid->misc._3366_grow_level = GetValueFromTable(misc, "_3366_grow_level");
	grid->misc.vip_level = GetValueFromTable(misc, "vip_level");

	grid->misc.lastRoleLevel = GetValueFromTable(misc, "lastRoleLevel");
	if (grid->objType == OBJ_TYPE_ROLE && grid->misc.lastRoleLevel == 0)
		grid->misc.lastRoleLevel = grid->level;

	grid->misc.lastBuildVal = GetValueFromTable(misc, "lastBuildVal");
	if (grid->objType == OBJ_TYPE_ROLE && grid->misc.lastBuildVal == 0)
		grid->misc.lastBuildVal = grid->buildCurVal;

	grid->misc.lastTowerLayer = GetValueFromTable(misc, "lastTowerLayer");
	if (grid->objType == OBJ_TYPE_ROLE && grid->misc.lastTowerLayer == 0)
		grid->misc.lastTowerLayer = grid->misc.towerLayer;

	grid->misc.lastTowerTime = GetValueFromTable(misc, "lastTowerTime");
	if (grid->objType == OBJ_TYPE_ROLE && grid->misc.lastTowerTime == 0)
		grid->misc.lastTowerTime = grid->misc.towerTime;
	//std::cout << "ReadGridFrowDBRow .. 4" << std::endl;
}

uint32 GridsManager::GetValueFromTable(char * misc, const char* key) {
	if (misc == NULL)
		return 0;

	char* start = strstr(misc, key);
	if (start == NULL)
		return 0;

	start += strlen(key); // skip key
	start++; // skip =
	return SafeAsciToULong(start);
}

void GridsManager::InitRoleIdMapGridId() {
	for (int i = 0; i < GRIDS_COUNT; i++) {
		Grid* grid = GetGridById(GRIDIDX_TO_ID(i));
		if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
			continue;

		MapRoleIdToGridId(grid->roleId, grid->gridId);
	}
}

void GridsManager::InitRoleNameMapRoleId() {
	for (int i = 0; i < GRIDS_COUNT; i++) {
		Grid* grid = GetGridById(GRIDIDX_TO_ID(i));
		if (grid == NULL || grid->objType != OBJ_TYPE_ROLE)
			continue;
		MapRoleNameToRoleId(grid->roleName, grid->roleId);
	}

	map<int64, Grid>::iterator iter = m_exileGrids.begin();
	for (; iter != m_exileGrids.end(); ++iter) {
		Grid* grid = &((*iter).second);
		MapRoleNameToRoleId(grid->roleName, grid->roleId);
	}
}

int64 GridsManager::GetRoleIdByRoleName(const char* roleName) {
	map<string, int64>::iterator iter = m_roleNameMapRoleId.find(roleName);
	if (iter == m_roleNameMapRoleId.end())
		return -1;

	return (*iter).second;
}

int GridsManager::GetGridIdByRoleId(int64 roleId) {
	map<int64, int>::iterator iter = m_roleIdMapGridId.find(roleId);
	if (iter == m_roleIdMapGridId.end())
		return -1;

	return (*iter).second;
}

inline void GridsManager::MapRoleNameToRoleId(const char* roleName, int64 roleId) {
	m_roleNameMapRoleId[roleName] = roleId;
}

inline void GridsManager::MapRoleIdToGridId(int64 roleId, int gridId) {
	m_roleIdMapGridId[roleId] = gridId;
}

inline Grid* GridsManager::GetGridById(int gridId) {
	if (!IsValidGridId(gridId)) {
		return NULL;
	}
	return m_grids + GRIDID_TO_IDX(gridId);
}

inline Grid* GridsManager::GetGridByRoleId(int64 roleId) {
	int gridId = GetGridIdByRoleId(roleId);
	return GetGridById(gridId);
}

void GridsManager::RefreshExileRoleIds() {
	for (int i = 0; i < (int) m_cityExileRoles.size(); ++i) {
		m_cityExileRoles[i].clear();
	}

	map<int64, Grid>::iterator iter = m_exileGrids.begin();
	for (; iter != m_exileGrids.end(); ++iter) {
		Grid& grid = (*iter).second;
		AppendToCityExileRoles(&grid);
	}
}

Grid* GridsManager::GetExileGridByRoleId(int64 roleId) {
	map<int64, Grid>::iterator iter = m_exileGrids.find(roleId);
	if (iter == m_exileGrids.end()) {
		return NULL;
	}
	return &((*iter).second);
}

void GridsManager::RemoveExileGridByRoleId(int64 roleId) {
	map<int64, Grid>::iterator iter = m_exileGrids.find(roleId);
	if (iter != m_exileGrids.end()) {
		Grid& grid = (*iter).second;

		int cityId = GetCityIdByGridId(grid.gridId);
		std::vector<uint64>& city = m_cityExileRoles[CITYID_TO_IDX(cityId)];
		city.erase(remove(city.begin(), city.end(), grid.roleId), city.end());
		m_exileGrids.erase(iter);
	}
}

void GridsManager::AppendExileGrid(const Grid* grid) {
	if (grid == NULL)
		return;

	m_exileGrids[grid->roleId] = *grid;
	m_exileGrids[grid->roleId].objType = OBJ_TYPE_DIED_ROLE;
	AppendToCityExileRoles(grid);
}

// 即使亡城也在原国家占个位置（有时效性）
void GridsManager::AppendToCityExileRoles(const Grid* grid) {
	int cityId = GetCityIdByGridId(grid->gridId);
	uint32 keepBackTime = grid->refreshTime;
	if ((uint32) time(NULL) >= keepBackTime)
		return;

	m_cityExileRoles[CITYID_TO_IDX(cityId)].push_back(grid->roleId);
}

int GridsManager::GetFreeGridId(int cityId) {
	int cityIdx = GRIDID_TO_IDX(cityId);
	if (cityIdx < 0 || cityIdx >= (int) (array_len(m_cityGridIds))) {
		return -1;
	}

	m_freeGridIdxs.clear();
	std::vector<int>& gridIds = m_cityGridIds[cityIdx];
	for (int i = 0; i < (int) gridIds.size(); ++i) {
		Grid* grid = GetGridById(gridIds[i]);
		if (grid == NULL || grid->objType != OBJ_TYPE_NONE)
			continue;
		m_freeGridIdxs.push_back(grid->gridId);
	}

	if (!IsHasFreeGrid(cityIdx)) {
		return -1;
	}

	return m_freeGridIdxs[rand() % m_freeGridIdxs.size()];
}

bool GridsManager::IsHasFreeGrid(int cityIdx) {
	return m_freeGridIdxs.size() - m_cityExileRoles[cityIdx].size() > 0;
}

inline int GridsManager::GetCityIdByGridId(int gridId) {
	int posX = 0;
	int posY = 0;
	GetPosByGridId(gridId, posX, posY);
	if (IsInRects(array_len(c_cityRects4), c_cityRects4, posX, posY))
		return 4;
	if (IsInRects(array_len(c_cityRects3), c_cityRects3, posX, posY))
		return 3;
	if (IsInRects(array_len(c_cityRects2), c_cityRects2, posX, posY))
		return 2;
	if (IsInRects(array_len(c_cityRects1), c_cityRects1, posX, posY))
		return 1;
	return -1;
}

inline bool GridsManager::IsInRects(int count, const GridRect* rects, int posX, int posY) {
	for (int i = 0; i < count; ++i) {
		const GridRect* rect = rects + i;
		if ((posX >= rect->x1 && posX < rect->x2) && (posY >= rect->y1 && posY < rect->y2)) {
			return true;
		}
	}
	return false;
}

inline void GridsManager::GetPosByGridId(int gridId, int& x, int& y) {
	if (!IsValidGridId(gridId)) {
		x = -1;
		y = -1;
		return;
	}

	x = GRIDID_TO_IDX(gridId) % GRIDS_COL;
	y = GRIDID_TO_IDX(gridId) / GRIDS_COL;
}

inline bool GridsManager::IsValidGridId(int gridId) {
	int gridIdx = GRIDID_TO_IDX(gridId);
	if ((gridIdx < 0) || (gridIdx > GRIDS_COUNT))
		return false;
	int x = GRIDID_TO_IDX(gridId) % GRIDS_COL;
	int y = GRIDID_TO_IDX(gridId) / GRIDS_COL;
	return (x >= m_mapView.x1 && x < m_mapView.x2) && (y >= m_mapView.y1 && y < m_mapView.y2);
}
