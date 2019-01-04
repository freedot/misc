#ifndef _LUAMATH_H__
#define _LUAMATH_H__

extern "C" 
{
 #include <lua/lua.h>
 #include <lua/lauxlib.h>
 #include <lua/lualib.h>
 #include <lua/luaex.h>
}
#include <tinyxml/tinyxml.h>

extern int Math_OR(lua_State* lpLuaState);
extern int Math_AND(lua_State* lpLuaState);
extern int Math_HEX(lua_State* lpLuaState);
extern int Math_Point2DInPoly(lua_State* lpLuaState);
extern int Math_LSHIFT(lua_State* lpLuaState);
extern int Math_RSHIFT(lua_State* lpLuaState);

#endif // _LUAMATH_H__
