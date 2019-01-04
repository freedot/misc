/*
** Lua binding: tqAllTolua
** Generated automatically by tolua++-1.0.92 on 01/04/19 15:13:02.
*/

#ifndef __cplusplus
#include "stdlib.h"
#endif
#include "string.h"

#include "tolua++.h"

/* Exported function */
TOLUA_API int  tolua_tqAllTolua_open (lua_State* tolua_S);

#include "../include/ITime.h"

/* function to register type */
static void tolua_reg_types (lua_State* tolua_S)
{
 tolua_usertype(tolua_S,"ITime");
 tolua_usertype(tolua_S,"IInterface");
}

/* method: SetDispersionMs of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_SetDispersionMs00
static int tolua_tqAllTolua_ITime_SetDispersionMs00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
  unsigned int dispersionMs = (( unsigned int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SetDispersionMs'", NULL);
#endif
  {
   self->SetDispersionMs(dispersionMs);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SetDispersionMs'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SetScale of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_SetScale00
static int tolua_tqAllTolua_ITime_SetScale00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
  double scale = ((double)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SetScale'", NULL);
#endif
  {
   self->SetScale(scale);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SetScale'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SleepMs of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_SleepMs00
static int tolua_tqAllTolua_ITime_SleepMs00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
  unsigned int timeMs = (( unsigned int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SleepMs'", NULL);
#endif
  {
   self->SleepMs(timeMs);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SleepMs'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCurrentTimeMs of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_GetCurrentTimeMs00
static int tolua_tqAllTolua_ITime_GetCurrentTimeMs00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCurrentTimeMs'", NULL);
#endif
  {
   unsigned int tolua_ret = ( unsigned int)  self->GetCurrentTimeMs();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCurrentTimeMs'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCurrentTimeMsEx of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_GetCurrentTimeMsEx00
static int tolua_tqAllTolua_ITime_GetCurrentTimeMsEx00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCurrentTimeMsEx'", NULL);
#endif
  {
   unsigned long long tolua_ret = ( unsigned long long)  self->GetCurrentTimeMsEx();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCurrentTimeMsEx'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCurrentTimeSec of class  ITime */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_ITime_GetCurrentTimeSec00
static int tolua_tqAllTolua_ITime_GetCurrentTimeSec00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"ITime",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  ITime* self = (ITime*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCurrentTimeSec'", NULL);
#endif
  {
   unsigned int tolua_ret = ( unsigned int)  self->GetCurrentTimeSec();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCurrentTimeSec'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* Open function */
TOLUA_API int tolua_tqAllTolua_open (lua_State* tolua_S)
{
 tolua_open(tolua_S);
 tolua_reg_types(tolua_S);
 tolua_module(tolua_S,NULL,0);
 tolua_beginmodule(tolua_S,NULL);
  tolua_cclass(tolua_S,"ITime","ITime","IInterface",NULL);
  tolua_beginmodule(tolua_S,"ITime");
   tolua_function(tolua_S,"SetDispersionMs",tolua_tqAllTolua_ITime_SetDispersionMs00);
   tolua_function(tolua_S,"SetScale",tolua_tqAllTolua_ITime_SetScale00);
   tolua_function(tolua_S,"SleepMs",tolua_tqAllTolua_ITime_SleepMs00);
   tolua_function(tolua_S,"GetCurrentTimeMs",tolua_tqAllTolua_ITime_GetCurrentTimeMs00);
   tolua_function(tolua_S,"GetCurrentTimeMsEx",tolua_tqAllTolua_ITime_GetCurrentTimeMsEx00);
   tolua_function(tolua_S,"GetCurrentTimeSec",tolua_tqAllTolua_ITime_GetCurrentTimeSec00);
  tolua_endmodule(tolua_S);
 tolua_endmodule(tolua_S);
 return 1;
}


#if defined(LUA_VERSION_NUM) && LUA_VERSION_NUM >= 501
 TOLUA_API int luaopen_tqAllTolua (lua_State* tolua_S) {
 return tolua_tqAllTolua_open(tolua_S);
};
#endif

