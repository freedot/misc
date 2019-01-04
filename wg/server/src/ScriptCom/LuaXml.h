#ifndef _LUAXML_H__
#define _LUAXML_H__
extern "C" 
{
 #include <lua/lua.h>
 #include <lua/lauxlib.h>
 #include <lua/lualib.h>
 #include <lua/luaex.h>
}
#include <tinyxml/tinyxml.h>

extern int ParseXmlFile(lua_State* lpLuaState);
extern int SaveXmlFile(lua_State* lpLuaState);

#endif // _LUAXML_H__
