#include <commhead.h>
#include <safefun.h>
#include "LuaMath.h"

#define D2_INCLUDE(x,y,x1,y1,x2,y2)             (((x)>=(x1))&&((x)<=(x2))&&((y)>=(y1))&&((y)<=(y2)))

int Math_OR(lua_State* lpLuaState) {
	int iCount = lua_gettop(lpLuaState);
	if (iCount <= 0) {
		lua_pushnumber(lpLuaState, 0);
		return 1;
	}

	unsigned int uiOp1 = (unsigned int) lua_tonumber(lpLuaState, 1);
	for (int i = 2; i <= iCount; ++i) {
		unsigned int uiOp2 = (unsigned int) lua_tonumber(lpLuaState, i);
		uiOp1 |= uiOp2;
	}
	lua_pushnumber(lpLuaState, uiOp1);
	return 1;
}

int Math_AND(lua_State* lpLuaState) {
	int iCount = lua_gettop(lpLuaState);
	if (iCount <= 0) {
		lua_pushnumber(lpLuaState, 0);
		return 1;
	}

	unsigned int uiOp1 = (unsigned int) lua_tonumber(lpLuaState, 1);
	for (int i = 2; i <= iCount; ++i) {
		unsigned int uiOp2 = (unsigned int) lua_tonumber(lpLuaState, i);
		uiOp1 &= uiOp2;
	}
	lua_pushnumber(lpLuaState, uiOp1);
	return 1;
}

int Math_HEX(lua_State* lpLuaState) {
	int iCount = lua_gettop(lpLuaState);
	if (iCount <= 0) {
		lua_pushnumber(lpLuaState, 0);
		return 1;
	}

	const char* lpszNumber = lua_tostring(lpLuaState, 1);
	unsigned int uiNumber = 0;
	if (lpszNumber != NULL) {
		char szBuf[128];
		SafeSprintf(szBuf, sizeof(szBuf), "H%s", lpszNumber);
		uiNumber = (uint) SafeAsciToInt(szBuf);
	}

	lua_pushnumber(lpLuaState, uiNumber);
	return 1;
}

int Math_Point2DInPoly(lua_State* lpLuaState) {
	int iArgCount = lua_gettop(lpLuaState);
	if (iArgCount < 9) {
		lua_pushboolean(lpLuaState, 0);
		return 1;
	}

	int iPosx = (int) lua_tonumber(lpLuaState, 1);
	int iPosy = (int) lua_tonumber(lpLuaState, 2);
	int iCount = (int) lua_tonumber(lpLuaState, 3);
	int aiPointxs[128];
	int aiPointys[128];
	int iPos = 4;
	int min_x = 0x7fffffff;
	int max_x = -0x7fffffff;
	int min_y = 0x7fffffff;
	int max_y = -0x7fffffff;
	int i = 0;
	for (; i < iCount; ++i) {
		aiPointxs[i] = (int) lua_tonumber(lpLuaState, iPos++);
		aiPointys[i] = (int) lua_tonumber(lpLuaState, iPos++);
		min_x = std::min<int>(aiPointxs[i], min_x);
		max_x = std::max<int>(aiPointxs[i], max_x);
		min_y = std::min<int>(aiPointys[i], min_y);
		max_y = std::max<int>(aiPointys[i], max_y);
	}
	aiPointxs[i] = aiPointxs[0];
	aiPointys[i] = aiPointys[0];

	int flag, flag1;
	double data;
	if (!D2_INCLUDE(iPosx,iPosy,min_x,min_y,max_x,max_y)) {
		lua_pushboolean(lpLuaState, 0);
		return 1;
	}

	flag1 = 0;
	for (i = 0; i < iCount; i++) {
		data = (double) (aiPointxs[i] - iPosx)
				* (double) (aiPointys[i + 1] - iPosy)
				- (double) (aiPointxs[i + 1] - iPosx)
						* (double) (aiPointys[i] - iPosy);
		flag = (data > 0.0) ? 1 : ((data < 0.0) ? -1 : 0);
		if (flag) {
			if (!flag1)
				flag1 = flag;
			if (flag != flag1) {
				lua_pushboolean(lpLuaState, 0);
				return 1;
			}
		}
	}

	lua_pushboolean(lpLuaState, 1);
	return 1;
}

int Math_LSHIFT(lua_State* lpLuaState) {
	int iCount = lua_gettop(lpLuaState);
	if (iCount <= 0) {
		lua_pushnumber(lpLuaState, 0);
		return 1;
	}

	unsigned int uiOp1 = (unsigned int) lua_tonumber(lpLuaState, 1);
	if (iCount == 1) {
		lua_pushnumber(lpLuaState, uiOp1);
		return 1;
	}

	unsigned int uiOp2 = (unsigned int) lua_tonumber(lpLuaState, 2);
	unsigned int uiVal = uiOp1 << uiOp2;
	lua_pushnumber(lpLuaState, uiVal);
	return 1;
}

int Math_RSHIFT(lua_State* lpLuaState) {
	int iCount = lua_gettop(lpLuaState);
	if (iCount <= 0) {
		lua_pushnumber(lpLuaState, 0);
		return 1;
	}

	unsigned int uiOp1 = (unsigned int) lua_tonumber(lpLuaState, 1);
	if (iCount == 1) {
		lua_pushnumber(lpLuaState, uiOp1);
		return 1;
	}

	unsigned int uiOp2 = (unsigned int) lua_tonumber(lpLuaState, 2);
	unsigned int uiVal = uiOp1 >> uiOp2;
	lua_pushnumber(lpLuaState, uiVal);
	return 1;
}
