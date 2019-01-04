#ifndef _REQUIREEX_H__
#define _REQUIREEX_H__
extern "C" 
{
 #include <lua/lua.h>
 #include <lua/lauxlib.h>
 #include <lua/lualib.h>
 #include <lua/luaex.h>
}

#include "GameSys.h"

extern int InstallRequireEx(lua_State *L);

#endif // _REQUIREEX_H__
