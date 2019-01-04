#include "luaex.h"

#include <assert.h>
#include <string.h>

#include "lapi.h"
#include "ldebug.h"
#include "ldo.h"
#include "lfunc.h"
#include "lgc.h"
#include "lmem.h"
#include "lobject.h"
#include "lstate.h"
#include "lstring.h"
#include "ltable.h"
#include "ltm.h"
#include "lundump.h"
#include "lvm.h"
#include "ltable.h"

#ifndef api_check
#define api_check(L, o)		/*{ assert(o); }*/
#endif

#ifndef api_checknelems
#define api_checknelems(L, n)	api_check(L, (n) <= (L->top - L->base))
#endif

#ifndef api_incr_top
#define api_incr_top(L)   {api_check(L, L->top < L->ci->top); L->top++;}
#endif



#define setfunobj(obj1,obj2) \
  { TValue *o1=(obj1); \
    Value* v = (Value*)(obj2); \
    o1->tt=LUA_TFUNCTION; \
	o1->value = *v; }

#define settableobj(obj1,obj2) \
  { TValue *o1=(obj1); \
    Value* v = (Value*)(obj2); \
    o1->tt=LUA_TTABLE; \
	o1->value = *v; }


#define setfunobj2s setfunobj
#define settableobj2s settableobj

LUA_API void lua_pushluatable(lua_State *L, lua_Table *p)
{
  lua_lock(L);
  luaC_checkGC(L);
  settableobj2s(L->top, p);
  api_incr_top(L);
  lua_unlock(L);
}


LUA_API void lua_pushluafun(lua_State *L, lua_Table *p)
{
  lua_lock(L);
  luaC_checkGC(L);
  setfunobj2s(L->top, p);
  api_incr_top(L);
  lua_unlock(L);
}

static TValue *negindex (lua_State *L, int idx) {
  if (idx > LUA_REGISTRYINDEX) {
    api_check(L, idx != 0 && -idx <= L->top - L->base);
    return L->top+idx;
  }
  else switch (idx) {  /* pseudo-indices */
    case LUA_REGISTRYINDEX: return registry(L);
    case LUA_GLOBALSINDEX: return gt(L);
    default: {
      TValue *func = (L->base - 1);
      idx = LUA_GLOBALSINDEX - idx;
      lua_assert(iscfunction(func));
      return (idx <= clvalue(func)->c.nupvalues)
                ? &clvalue(func)->c.upvalue[idx-1]
                : NULL;
    }
  }
}



static TValue *luaA_indexAcceptable (lua_State *L, int idx) {
  if (idx > 0) {
    TValue *o = L->base+(idx-1);
    api_check(L, idx <= L->stack_last - L->base);
    if (o >= L->top) return NULL;
    else return o;
  }
  else
    return negindex(L, idx);
}


LUA_API const void* lua_toluaobject (lua_State *L, int idx)
{
  StkId o = luaA_indexAcceptable(L, idx);
  if (o == NULL) return NULL;
  else {
	return &(o->value);
  }
}


LUA_API void lua_initStaticObject(lua_State *L)
{
	global_State *g = G(L);
	c_dummynode = cast(const Node*, g->dummynode);
}


LUA_API void lua_clearfunself(lua_State *L, int idx) {
	//StkId o = luaA_indexAcceptable(L, idx);
	//if ( ttisfunction(o) ) {
	//	clearfunself(o);
	//}
}
