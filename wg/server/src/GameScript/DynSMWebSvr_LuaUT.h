#ifndef _TQ_SMWEBSVR_LUAUT_H_
#define _TQ_SMWEBSVR_LUAUT_H_
#if defined(LUA_UT)
#include <IInterface.h>

struct lua_State;
extern "C" __declspec(dllexport) int luaopen_luaut(lua_State *L);

#endif // LUA_UT

#endif // _TQ_SMWEBSVR_LUAUT_H_
