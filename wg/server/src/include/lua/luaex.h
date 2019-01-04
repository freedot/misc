#ifndef lua_ex_h
#define lua_ex_h

#include "lua.h"

/*
** push functions (C -> stack)
*/
/*
typedef void lua_Table;
typedef void lua_Fun;
LUA_API void lua_pushluatable(lua_State *L, lua_Table *p);
LUA_API void lua_pushluafun(lua_State *L, lua_Fun *p);
*/

/*
** access functions (stack -> C)
*/
/*
LUA_API const void* lua_toluaobject (lua_State *L, int idx);


LUA_API void lua_initStaticObject(lua_State *L);


LUA_API void lua_clearfunself(lua_State *L, int idx);
*/

#endif //lua_ex_h
