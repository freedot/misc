/*
** Lua binding: tqAllTolua
** Generated automatically by tolua++-1.0.92 on 01/04/19 15:32:35.
*/

#ifndef __cplusplus
#include "stdlib.h"
#endif
#include "string.h"

#include "tolua++.h"

/* Exported function */
TOLUA_API int  tolua_tqAllTolua_open (lua_State* tolua_S);

#pragma GCC diagnostic ignored "-Wunused-function"
#include "EventCast.h"
#include "../include/result.h"
#include "../include/eventtype.h"
#include "../include/baseevent.h"
#include "../include/messagerCmd.h"
#include "../include/IDatabase.h"
#include "../include/IScriptSys.h"
#include "../GameSvr/tqRoleVar.h"
#include "../GameSvr/IScriptPub.h"
#include "../GameSvr/IGridsManager.h"
#include "../GameSvr/IRankManager.h"
#include "../GameSvr/IRank.h"
#include "../GameSvr/IProxyServer.h"
using namespace IO;
using namespace Script;

/* function to release collected object via destructor */
#ifdef __cplusplus

static int tolua_collect_IScriptPub (lua_State* tolua_S)
{
 IScriptPub* self = (IScriptPub*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_STask (lua_State* tolua_S)
{
 STask* self = (STask*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SDefaultTeam (lua_State* tolua_S)
{
 SDefaultTeam* self = (SDefaultTeam*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SAttrEx (lua_State* tolua_S)
{
 SAttrEx* self = (SAttrEx*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SEvent (lua_State* tolua_S)
{
 SEvent* self = (SEvent*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SState (lua_State* tolua_S)
{
 SState* self = (SState*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SFarmLog (lua_State* tolua_S)
{
 SFarmLog* self = (SFarmLog*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SActValTask (lua_State* tolua_S)
{
 SActValTask* self = (SActValTask*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SActTask (lua_State* tolua_S)
{
 SActTask* self = (SActTask*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SAttr (lua_State* tolua_S)
{
 SAttr* self = (SAttr*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SSoldier (lua_State* tolua_S)
{
 SSoldier* self = (SSoldier*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SHelpTip (lua_State* tolua_S)
{
 SHelpTip* self = (SHelpTip*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SNewHero (lua_State* tolua_S)
{
 SNewHero* self = (SNewHero*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SCulture (lua_State* tolua_S)
{
 SCulture* self = (SCulture*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SItemEx (lua_State* tolua_S)
{
 SItemEx* self = (SItemEx*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SBaseEvent (lua_State* tolua_S)
{
 SBaseEvent* self = (SBaseEvent*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SSkill (lua_State* tolua_S)
{
 SSkill* self = (SSkill*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SInviteJoinAlliance (lua_State* tolua_S)
{
 SInviteJoinAlliance* self = (SInviteJoinAlliance*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SInBuild (lua_State* tolua_S)
{
 SInBuild* self = (SInBuild*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_EventCast (lua_State* tolua_S)
{
 EventCast* self = (EventCast*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SSCut (lua_State* tolua_S)
{
 SSCut* self = (SSCut*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SSelfField (lua_State* tolua_S)
{
 SSelfField* self = (SSelfField*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SWear (lua_State* tolua_S)
{
 SWear* self = (SWear*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SForceLineupCfg (lua_State* tolua_S)
{
 SForceLineupCfg* self = (SForceLineupCfg*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SCity (lua_State* tolua_S)
{
 SCity* self = (SCity*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SBuddy (lua_State* tolua_S)
{
 SBuddy* self = (SBuddy*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SBuyLimitItem (lua_State* tolua_S)
{
 SBuyLimitItem* self = (SBuyLimitItem*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SBulletin (lua_State* tolua_S)
{
 SBulletin* self = (SBulletin*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SHero (lua_State* tolua_S)
{
 SHero* self = (SHero*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SFarm (lua_State* tolua_S)
{
 SFarm* self = (SFarm*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}

static int tolua_collect_SCarrySoldier (lua_State* tolua_S)
{
 SCarrySoldier* self = (SCarrySoldier*) tolua_tousertype(tolua_S,1,0);
	Mtolua_delete(self);
	return 0;
}
#endif


/* function to register type */
static void tolua_reg_types (lua_State* tolua_S)
{
 tolua_usertype(tolua_S,"SOHero");
 tolua_usertype(tolua_S,"Grid");
 tolua_usertype(tolua_S,"SBuyLimitItem");
 tolua_usertype(tolua_S,"SAttr");
 tolua_usertype(tolua_S,"SBlueDiamondTask");
 tolua_usertype(tolua_S,"SItem");
 tolua_usertype(tolua_S,"SInBuild");
 tolua_usertype(tolua_S,"SCarrySoldierList");
 tolua_usertype(tolua_S,"SItemAttrList");
 tolua_usertype(tolua_S,"IScriptPub");
 tolua_usertype(tolua_S,"SEvent");
 tolua_usertype(tolua_S,"SBuddy");
 tolua_usertype(tolua_S,"STradingArea");
 tolua_usertype(tolua_S,"SBulletin");
 tolua_usertype(tolua_S,"SHero");
 tolua_usertype(tolua_S,"SInBuildList");
 tolua_usertype(tolua_S,"TimerEvent");
 tolua_usertype(tolua_S,"SSkillSteel");
 tolua_usertype(tolua_S,"SEffect");
 tolua_usertype(tolua_S,"SDefaultTeam");
 tolua_usertype(tolua_S,"SVip");
 tolua_usertype(tolua_S,"SDoingRoleTask");
 tolua_usertype(tolua_S,"IScriptSys");
 tolua_usertype(tolua_S,"SHeroList");
 tolua_usertype(tolua_S,"SDeclare");
 tolua_usertype(tolua_S,"SHeroSteel");
 tolua_usertype(tolua_S,"SDefArmy");
 tolua_usertype(tolua_S,"SBaseInfo");
 tolua_usertype(tolua_S,"SWorldboss");
 tolua_usertype(tolua_S,"SMilitary");
 tolua_usertype(tolua_S,"IProxyServer");
 tolua_usertype(tolua_S,"SInviteJoinAlliance");
 tolua_usertype(tolua_S,"SSkill");
 tolua_usertype(tolua_S,"EventCast");
 tolua_usertype(tolua_S,"SFightTodayHonor");
 tolua_usertype(tolua_S,"IRank");
 tolua_usertype(tolua_S,"SAllItems");
 tolua_usertype(tolua_S,"SFixVar");
 tolua_usertype(tolua_S,"IGridsManager");
 tolua_usertype(tolua_S,"SActTerrace");
 tolua_usertype(tolua_S,"SSoldierList");
 tolua_usertype(tolua_S,"GridMisc");
 tolua_usertype(tolua_S,"STask");
 tolua_usertype(tolua_S,"SFarm");
 tolua_usertype(tolua_S,"SCityRes");
 tolua_usertype(tolua_S,"SMiscs");
 tolua_usertype(tolua_S,"SPlayer");
 tolua_usertype(tolua_S,"STowerArmy");
 tolua_usertype(tolua_S,"IInterface");
 tolua_usertype(tolua_S,"SAttrEx");
 tolua_usertype(tolua_S,"SQQMembership");
 tolua_usertype(tolua_S,"SPayAct");
 tolua_usertype(tolua_S,"ScriptEvent");
 tolua_usertype(tolua_S,"SActValTask");
 tolua_usertype(tolua_S,"SDBAlliVar");
 tolua_usertype(tolua_S,"SItemEx");
 tolua_usertype(tolua_S,"SExchangeTodayTimes");
 tolua_usertype(tolua_S,"SGemBesetListEx");
 tolua_usertype(tolua_S,"SStateList");
 tolua_usertype(tolua_S,"IDatabase");
 tolua_usertype(tolua_S,"SFarmLog");
 tolua_usertype(tolua_S,"SPlayerClientCfg");
 tolua_usertype(tolua_S,"SLearningCulture");
 tolua_usertype(tolua_S,"SCulture");
 tolua_usertype(tolua_S,"SFarmList");
 tolua_usertype(tolua_S,"STaskList");
 tolua_usertype(tolua_S,"SCultures");
 tolua_usertype(tolua_S,"SSelfField");
 tolua_usertype(tolua_S,"STodayFightTimes");
 tolua_usertype(tolua_S,"SBuddyList");
 tolua_usertype(tolua_S,"SCity");
 tolua_usertype(tolua_S,"SBulletinList");
 tolua_usertype(tolua_S,"SNewHero");
 tolua_usertype(tolua_S,"SItemAttrListEx");
 tolua_usertype(tolua_S,"SSCutList");
 tolua_usertype(tolua_S,"SSCut");
 tolua_usertype(tolua_S,"SItemListEx");
 tolua_usertype(tolua_S,"SOnlineTask");
 tolua_usertype(tolua_S,"SSkillList");
 tolua_usertype(tolua_S,"SOneHole");
 tolua_usertype(tolua_S,"SWearList");
 tolua_usertype(tolua_S,"SHeroAttrList");
 tolua_usertype(tolua_S,"SWear");
 tolua_usertype(tolua_S,"SDBVar");
 tolua_usertype(tolua_S,"SSimpleHero");
 tolua_usertype(tolua_S,"OSHeroSteel");
 tolua_usertype(tolua_S,"SActTask");
 tolua_usertype(tolua_S,"SGemBesetList");
 tolua_usertype(tolua_S,"SSoldier");
 tolua_usertype(tolua_S,"SActTower");
 tolua_usertype(tolua_S,"SActivityVal");
 tolua_usertype(tolua_S,"SActTerraceGate");
 tolua_usertype(tolua_S,"SHelpTip");
 tolua_usertype(tolua_S,"SBaseEvent");
 tolua_usertype(tolua_S,"SRoleAttrList");
 tolua_usertype(tolua_S,"SSendReward");
 tolua_usertype(tolua_S,"SYellowDiamondTask");
 tolua_usertype(tolua_S,"SPos");
 tolua_usertype(tolua_S,"SCDKey");
 tolua_usertype(tolua_S,"IRankManager");
 tolua_usertype(tolua_S,"SCityDef");
 tolua_usertype(tolua_S,"SForceLineupCfg");
 tolua_usertype(tolua_S,"SCreator");
 tolua_usertype(tolua_S,"SNewcomerTask");
 tolua_usertype(tolua_S,"SState");
 tolua_usertype(tolua_S,"UserDataObject");
 tolua_usertype(tolua_S,"TimerUserData");
 tolua_usertype(tolua_S,"SCitys");
 tolua_usertype(tolua_S,"SCarrySoldier");
}

/* method: new of class  EventCast */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_EventCast_new00
static int tolua_tqAllTolua_EventCast_new00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"EventCast",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  {
   EventCast* tolua_ret = (EventCast*)  Mtolua_new((EventCast)());
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"EventCast");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'new'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: new_local of class  EventCast */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_EventCast_new00_local
static int tolua_tqAllTolua_EventCast_new00_local(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"EventCast",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  {
   EventCast* tolua_ret = (EventCast*)  Mtolua_new((EventCast)());
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"EventCast");
    tolua_register_gc(tolua_S,lua_gettop(tolua_S));
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'new'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: delete of class  EventCast */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_EventCast_delete00
static int tolua_tqAllTolua_EventCast_delete00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"EventCast",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  EventCast* self = (EventCast*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'delete'", NULL);
#endif
  Mtolua_delete(self);
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'delete'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Cast_ScriptEvent of class  EventCast */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_EventCast_Cast_ScriptEvent00
static int tolua_tqAllTolua_EventCast_Cast_ScriptEvent00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"EventCast",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  EventCast* self = (EventCast*)  tolua_tousertype(tolua_S,1,0);
  SBaseEvent* lpBaseEvent = ((SBaseEvent*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Cast_ScriptEvent'", NULL);
#endif
  {
   ScriptEvent* tolua_ret = (ScriptEvent*)  self->Cast_ScriptEvent(lpBaseEvent);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"ScriptEvent");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Cast_ScriptEvent'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Cast_TimerEvent of class  EventCast */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_EventCast_Cast_TimerEvent00
static int tolua_tqAllTolua_EventCast_Cast_TimerEvent00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"EventCast",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  EventCast* self = (EventCast*)  tolua_tousertype(tolua_S,1,0);
  SBaseEvent* lpBaseEvent = ((SBaseEvent*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Cast_TimerEvent'", NULL);
#endif
  {
   TimerEvent* tolua_ret = (TimerEvent*)  self->Cast_TimerEvent(lpBaseEvent);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"TimerEvent");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Cast_TimerEvent'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* get function: eventType of class  SBaseEvent */
#ifndef TOLUA_DISABLE_tolua_get_SBaseEvent_eventType
static int tolua_get_SBaseEvent_eventType(lua_State* tolua_S)
{
  SBaseEvent* self = (SBaseEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->eventType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: eventType of class  SBaseEvent */
#ifndef TOLUA_DISABLE_tolua_set_SBaseEvent_eventType
static int tolua_set_SBaseEvent_eventType(lua_State* tolua_S)
{
  SBaseEvent* self = (SBaseEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->eventType = ((EEventType) (int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* method: delete of class  SBaseEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SBaseEvent_delete00
static int tolua_tqAllTolua_SBaseEvent_delete00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SBaseEvent* self = (SBaseEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'delete'", NULL);
#endif
  Mtolua_delete(self);
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'delete'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetSize of class  SBaseEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SBaseEvent_GetSize00
static int tolua_tqAllTolua_SBaseEvent_GetSize00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SBaseEvent* self = (SBaseEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetSize'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetSize();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetSize'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_get_SEvent_id
static int tolua_get_SEvent_id(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_set_SEvent_id
static int tolua_set_SEvent_id(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: eventData of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_get_SEvent_eventData_ptr
static int tolua_get_SEvent_eventData_ptr(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventData'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)self->eventData,"SBaseEvent");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: eventData of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_set_SEvent_eventData_ptr
static int tolua_set_SEvent_eventData_ptr(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventData'",NULL);
  if (!tolua_isusertype(tolua_S,2,"SBaseEvent",0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->eventData = ((SBaseEvent*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: userData of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_get_SEvent_userData
static int tolua_get_SEvent_userData(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'userData'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->userData,"UserDataObject");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: userData of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_set_SEvent_userData
static int tolua_set_SEvent_userData(lua_State* tolua_S)
{
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'userData'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"UserDataObject",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->userData = *((UserDataObject*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* method: new of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_new00
static int tolua_tqAllTolua_SEvent_new00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  {
   SEvent* tolua_ret = (SEvent*)  Mtolua_new((SEvent)());
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SEvent");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'new'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: new_local of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_new00_local
static int tolua_tqAllTolua_SEvent_new00_local(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  {
   SEvent* tolua_ret = (SEvent*)  Mtolua_new((SEvent)());
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SEvent");
    tolua_register_gc(tolua_S,lua_gettop(tolua_S));
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'new'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: new of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_new01
static int tolua_tqAllTolua_SEvent_new01(lua_State* tolua_S)
{
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
 {
  SBaseEvent* baseEvent = ((SBaseEvent*)  tolua_tousertype(tolua_S,2,0));
  {
   SEvent* tolua_ret = (SEvent*)  Mtolua_new((SEvent)(baseEvent));
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SEvent");
  }
 }
 return 1;
tolua_lerror:
 return tolua_tqAllTolua_SEvent_new00(tolua_S);
}
#endif //#ifndef TOLUA_DISABLE

/* method: new_local of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_new01_local
static int tolua_tqAllTolua_SEvent_new01_local(lua_State* tolua_S)
{
 tolua_Error tolua_err;
 if (
     !tolua_isusertable(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SBaseEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
 {
  SBaseEvent* baseEvent = ((SBaseEvent*)  tolua_tousertype(tolua_S,2,0));
  {
   SEvent* tolua_ret = (SEvent*)  Mtolua_new((SEvent)(baseEvent));
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SEvent");
    tolua_register_gc(tolua_S,lua_gettop(tolua_S));
  }
 }
 return 1;
tolua_lerror:
 return tolua_tqAllTolua_SEvent_new00_local(tolua_S);
}
#endif //#ifndef TOLUA_DISABLE

/* method: IsSkiped of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_IsSkiped00
static int tolua_tqAllTolua_SEvent_IsSkiped00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'IsSkiped'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->IsSkiped();
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'IsSkiped'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: IsUpParent of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_IsUpParent00
static int tolua_tqAllTolua_SEvent_IsUpParent00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'IsUpParent'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->IsUpParent();
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'IsUpParent'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Skip of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_Skip00
static int tolua_tqAllTolua_SEvent_Skip00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isboolean(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
  bool bSkiped = ((bool)  tolua_toboolean(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Skip'", NULL);
#endif
  {
   self->Skip(bSkiped);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Skip'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: UpParent of class  SEvent */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_SEvent_UpParent00
static int tolua_tqAllTolua_SEvent_UpParent00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"SEvent",0,&tolua_err) ||
     !tolua_isboolean(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  SEvent* self = (SEvent*)  tolua_tousertype(tolua_S,1,0);
  bool bFlag = ((bool)  tolua_toboolean(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'UpParent'", NULL);
#endif
  {
   self->UpParent(bFlag);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'UpParent'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Query of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_Query00
static int tolua_tqAllTolua_IDatabase_Query00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,1,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
  const char* sql = ((const char*)  tolua_tostring(tolua_S,2,0));
  int len = ((int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Query'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->Query(sql,len);
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Query'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetRow of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetRow00
static int tolua_tqAllTolua_IDatabase_GetRow00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetRow'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->GetRow();
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetRow'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetRowCount of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetRowCount00
static int tolua_tqAllTolua_IDatabase_GetRowCount00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetRowCount'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetRowCount();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetRowCount'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetFieldCount of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetFieldCount00
static int tolua_tqAllTolua_IDatabase_GetFieldCount00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetFieldCount'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetFieldCount();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetFieldCount'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetField of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetField00
static int tolua_tqAllTolua_IDatabase_GetField00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
  char* fieldName = ((char*)  tolua_tostring(tolua_S,2,0));
  int len = ((int)  tolua_tonumber(tolua_S,3,0));
  int type = ((int)  tolua_tonumber(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetField'", NULL);
#endif
  {
   char* tolua_ret = (char*)  self->GetField(fieldName,&len,&type);
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
   tolua_pushnumber(tolua_S,(lua_Number)len);
   tolua_pushnumber(tolua_S,(lua_Number)type);
  }
 }
 return 3;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetField'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetLastError of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetLastError00
static int tolua_tqAllTolua_IDatabase_GetLastError00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetLastError'", NULL);
#endif
  {
   unsigned int tolua_ret = ( unsigned int)  self->GetLastError();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetLastError'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetLastErrorStr of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_GetLastErrorStr00
static int tolua_tqAllTolua_IDatabase_GetLastErrorStr00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetLastErrorStr'", NULL);
#endif
  {
   const char* tolua_ret = (const char*)  self->GetLastErrorStr();
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetLastErrorStr'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RealEscapeString of class  IDatabase */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IDatabase_RealEscapeString00
static int tolua_tqAllTolua_IDatabase_RealEscapeString00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IDatabase",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IDatabase* self = (IDatabase*)  tolua_tousertype(tolua_S,1,0);
  const char* rawString = ((const char*)  tolua_tostring(tolua_S,2,0));
  int rawStrLen = ((int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RealEscapeString'", NULL);
#endif
  {
   const char* tolua_ret = (const char*)  self->RealEscapeString(rawString,rawStrLen);
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RealEscapeString'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: ClearLoaded of class  IScriptSys */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptSys_ClearLoaded00
static int tolua_tqAllTolua_IScriptSys_ClearLoaded00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptSys",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptSys* self = (IScriptSys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'ClearLoaded'", NULL);
#endif
  {
   self->ClearLoaded();
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'ClearLoaded'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulId of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ulId
static int tolua_get_SInBuild_unsigned_ulId(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulId of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ulId
static int tolua_set_SInBuild_unsigned_ulId(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ulResId
static int tolua_get_SInBuild_unsigned_ulResId(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ulResId
static int tolua_set_SInBuild_unsigned_ulResId(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ucLevel
static int tolua_get_SInBuild_unsigned_ucLevel(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ucLevel
static int tolua_set_SInBuild_unsigned_ucLevel(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucState of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ucState
static int tolua_get_SInBuild_unsigned_ucState(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucState of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ucState
static int tolua_set_SInBuild_unsigned_ucState(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulStoptime of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ulStoptime
static int tolua_get_SInBuild_unsigned_ulStoptime(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStoptime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulStoptime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulStoptime of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ulStoptime
static int tolua_set_SInBuild_unsigned_ulStoptime(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStoptime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulStoptime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulDuration of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_get_SInBuild_unsigned_ulDuration
static int tolua_get_SInBuild_unsigned_ulDuration(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDuration'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulDuration);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulDuration of class  SInBuild */
#ifndef TOLUA_DISABLE_tolua_set_SInBuild_unsigned_ulDuration
static int tolua_set_SInBuild_unsigned_ulDuration(lua_State* tolua_S)
{
  SInBuild* self = (SInBuild*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDuration'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulDuration = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucTotal of class  SInBuildList */
#ifndef TOLUA_DISABLE_tolua_get_SInBuildList_unsigned_ucTotal
static int tolua_get_SInBuildList_unsigned_ucTotal(lua_State* tolua_S)
{
  SInBuildList* self = (SInBuildList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucTotal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucTotal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucTotal of class  SInBuildList */
#ifndef TOLUA_DISABLE_tolua_set_SInBuildList_unsigned_ucTotal
static int tolua_set_SInBuildList_unsigned_ucTotal(lua_State* tolua_S)
{
  SInBuildList* self = (SInBuildList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucTotal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucTotal = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astInBuilds of class  SInBuildList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SInBuildList_astInBuilds
static int tolua_get_tqAllTolua_SInBuildList_astInBuilds(lua_State* tolua_S)
{
 int tolua_index;
  SInBuildList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SInBuildList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_INBUILD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astInBuilds[tolua_index],"SInBuild");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astInBuilds of class  SInBuildList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SInBuildList_astInBuilds
static int tolua_set_tqAllTolua_SInBuildList_astInBuilds(lua_State* tolua_S)
{
 int tolua_index;
  SInBuildList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SInBuildList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_INBUILD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astInBuilds[tolua_index] = *((SInBuild*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ucLevel
static int tolua_get_SCityRes_unsigned_ucLevel(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ucLevel
static int tolua_set_SCityRes_unsigned_ucLevel(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ulBuildVal
static int tolua_get_SCityRes_unsigned_ulBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulBuildVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulBuildVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ulBuildVal
static int tolua_set_SCityRes_unsigned_ulBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulBuildVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulBuildVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulHurtBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ulHurtBuildVal
static int tolua_get_SCityRes_unsigned_ulHurtBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulHurtBuildVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulHurtBuildVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulHurtBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ulHurtBuildVal
static int tolua_set_SCityRes_unsigned_ulHurtBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulHurtBuildVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulHurtBuildVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayLostedBuildTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_todayLostedBuildTime
static int tolua_get_SCityRes_unsigned_todayLostedBuildTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayLostedBuildTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayLostedBuildTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayLostedBuildTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_todayLostedBuildTime
static int tolua_set_SCityRes_unsigned_todayLostedBuildTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayLostedBuildTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayLostedBuildTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayLostedBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_todayLostedBuildVal
static int tolua_get_SCityRes_unsigned_todayLostedBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayLostedBuildVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayLostedBuildVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayLostedBuildVal of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_todayLostedBuildVal
static int tolua_set_SCityRes_unsigned_todayLostedBuildVal(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayLostedBuildVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayLostedBuildVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lIdlePopu of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_lIdlePopu
static int tolua_get_SCityRes_lIdlePopu(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lIdlePopu'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lIdlePopu);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lIdlePopu of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_lIdlePopu
static int tolua_set_SCityRes_lIdlePopu(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lIdlePopu'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lIdlePopu = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullWood of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ullWood
static int tolua_get_SCityRes_unsigned_ullWood(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullWood'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullWood);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullWood of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ullWood
static int tolua_set_SCityRes_unsigned_ullWood(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullWood'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullWood = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullStone of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ullStone
static int tolua_get_SCityRes_unsigned_ullStone(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullStone'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullStone);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullStone of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ullStone
static int tolua_set_SCityRes_unsigned_ullStone(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullStone'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullStone = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullIron of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ullIron
static int tolua_get_SCityRes_unsigned_ullIron(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullIron'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullIron);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullIron of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ullIron
static int tolua_set_SCityRes_unsigned_ullIron(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullIron'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullIron = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullFood of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ullFood
static int tolua_get_SCityRes_unsigned_ullFood(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullFood'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullFood);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullFood of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ullFood
static int tolua_set_SCityRes_unsigned_ullFood(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullFood'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullFood = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullMoney of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ullMoney
static int tolua_get_SCityRes_unsigned_ullMoney(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullMoney'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullMoney);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullMoney of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ullMoney
static int tolua_set_SCityRes_unsigned_ullMoney(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullMoney'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullMoney = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulMLastTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ulMLastTime
static int tolua_get_SCityRes_unsigned_ulMLastTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulMLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulMLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulMLastTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ulMLastTime
static int tolua_set_SCityRes_unsigned_ulMLastTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulMLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulMLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulILastTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_ulILastTime
static int tolua_get_SCityRes_unsigned_ulILastTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulILastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulILastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulILastTime of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_ulILastTime
static int tolua_set_SCityRes_unsigned_ulILastTime(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulILastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulILastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastMaxLevel of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_get_SCityRes_unsigned_lastMaxLevel
static int tolua_get_SCityRes_unsigned_lastMaxLevel(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastMaxLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastMaxLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastMaxLevel of class  SCityRes */
#ifndef TOLUA_DISABLE_tolua_set_SCityRes_unsigned_lastMaxLevel
static int tolua_set_SCityRes_unsigned_lastMaxLevel(lua_State* tolua_S)
{
  SCityRes* self = (SCityRes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastMaxLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastMaxLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: defs of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCityDef_defs
static int tolua_get_tqAllTolua_SCityDef_defs(lua_State* tolua_S)
{
 int tolua_index;
  SCityDef* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCityDef*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITYDEF_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->defs[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: defs of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCityDef_defs
static int tolua_set_tqAllTolua_SCityDef_defs(lua_State* tolua_S)
{
 int tolua_index;
  SCityDef* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCityDef*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITYDEF_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->defs[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_get_SCityDef_unsigned_stopTime
static int tolua_get_SCityDef_unsigned_stopTime(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_set_SCityDef_unsigned_stopTime
static int tolua_set_SCityDef_unsigned_stopTime(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buildResId of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_get_SCityDef_unsigned_buildResId
static int tolua_get_SCityDef_unsigned_buildResId(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buildResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buildResId of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_set_SCityDef_unsigned_buildResId
static int tolua_set_SCityDef_unsigned_buildResId(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buildResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buildNumber of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_get_SCityDef_unsigned_buildNumber
static int tolua_get_SCityDef_unsigned_buildNumber(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildNumber'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buildNumber);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buildNumber of class  SCityDef */
#ifndef TOLUA_DISABLE_tolua_set_SCityDef_unsigned_buildNumber
static int tolua_set_SCityDef_unsigned_buildNumber(lua_State* tolua_S)
{
  SCityDef* self = (SCityDef*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildNumber'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buildNumber = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_get_SEffect_unsigned_id
static int tolua_get_SEffect_unsigned_id(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_set_SEffect_unsigned_id
static int tolua_set_SEffect_unsigned_id(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: val of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_get_SEffect_unsigned_val
static int tolua_get_SEffect_unsigned_val(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->val);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: val of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_set_SEffect_unsigned_val
static int tolua_set_SEffect_unsigned_val(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->val = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: unit of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_get_SEffect_unsigned_unit
static int tolua_get_SEffect_unsigned_unit(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'unit'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->unit);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: unit of class  SEffect */
#ifndef TOLUA_DISABLE_tolua_set_SEffect_unsigned_unit
static int tolua_set_SEffect_unsigned_unit(lua_State* tolua_S)
{
  SEffect* self = (SEffect*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'unit'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->unit = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: type of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_get_SCreator_unsigned_type
static int tolua_get_SCreator_unsigned_type(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->type);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: type of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_set_SCreator_unsigned_type
static int tolua_set_SCreator_unsigned_type(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->type = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_get_SCreator_unsigned_id
static int tolua_get_SCreator_unsigned_id(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_set_SCreator_unsigned_id
static int tolua_set_SCreator_unsigned_id(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: skillId of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_get_SCreator_unsigned_skillId
static int tolua_get_SCreator_unsigned_skillId(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'skillId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->skillId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: skillId of class  SCreator */
#ifndef TOLUA_DISABLE_tolua_set_SCreator_unsigned_skillId
static int tolua_set_SCreator_unsigned_skillId(lua_State* tolua_S)
{
  SCreator* self = (SCreator*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'skillId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->skillId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_id
static int tolua_get_SState_unsigned_id(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_id
static int tolua_set_SState_unsigned_id(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: type of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_type
static int tolua_get_SState_unsigned_type(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->type);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: type of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_type
static int tolua_set_SState_unsigned_type(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->type = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startTime of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_startTime
static int tolua_get_SState_unsigned_startTime(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startTime of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_startTime
static int tolua_set_SState_unsigned_startTime(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTime of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_lastTime
static int tolua_get_SState_unsigned_lastTime(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTime of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_lastTime
static int tolua_set_SState_unsigned_lastTime(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: duration of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_duration
static int tolua_get_SState_unsigned_duration(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'duration'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->duration);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: duration of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_duration
static int tolua_set_SState_unsigned_duration(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'duration'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->duration = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isOnline of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_unsigned_isOnline
static int tolua_get_SState_unsigned_isOnline(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isOnline'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isOnline);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isOnline of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_unsigned_isOnline
static int tolua_set_SState_unsigned_isOnline(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isOnline'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isOnline = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: creator of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_creator
static int tolua_get_SState_creator(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'creator'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->creator,"SCreator");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: creator of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_creator
static int tolua_set_SState_creator(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'creator'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCreator",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->creator = *((SCreator*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: effect of class  SState */
#ifndef TOLUA_DISABLE_tolua_get_SState_effect
static int tolua_get_SState_effect(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'effect'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->effect,"SEffect");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: effect of class  SState */
#ifndef TOLUA_DISABLE_tolua_set_SState_effect
static int tolua_set_SState_effect(lua_State* tolua_S)
{
  SState* self = (SState*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'effect'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SEffect",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->effect = *((SEffect*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_get_SStateList_unsigned_count
static int tolua_get_SStateList_unsigned_count(lua_State* tolua_S)
{
  SStateList* self = (SStateList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_set_SStateList_unsigned_count
static int tolua_set_SStateList_unsigned_count(lua_State* tolua_S)
{
  SStateList* self = (SStateList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: states of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SStateList_states
static int tolua_get_tqAllTolua_SStateList_states(lua_State* tolua_S)
{
 int tolua_index;
  SStateList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SStateList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITY_STATES_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->states[tolua_index],"SState");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: states of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SStateList_states
static int tolua_set_tqAllTolua_SStateList_states(lua_State* tolua_S)
{
 int tolua_index;
  SStateList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SStateList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITY_STATES_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->states[tolua_index] = *((SState*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastStateId of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_get_SStateList_unsigned_lastStateId
static int tolua_get_SStateList_unsigned_lastStateId(lua_State* tolua_S)
{
  SStateList* self = (SStateList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastStateId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastStateId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastStateId of class  SStateList */
#ifndef TOLUA_DISABLE_tolua_set_SStateList_unsigned_lastStateId
static int tolua_set_SStateList_unsigned_lastStateId(lua_State* tolua_S)
{
  SStateList* self = (SStateList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastStateId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastStateId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucType of class  SCity */
#ifndef TOLUA_DISABLE_tolua_get_SCity_unsigned_ucType
static int tolua_get_SCity_unsigned_ucType(lua_State* tolua_S)
{
  SCity* self = (SCity*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucType of class  SCity */
#ifndef TOLUA_DISABLE_tolua_set_SCity_unsigned_ucType
static int tolua_set_SCity_unsigned_ucType(lua_State* tolua_S)
{
  SCity* self = (SCity*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucType = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stInBuilds of class  SCity */
#ifndef TOLUA_DISABLE_tolua_get_SCity_stInBuilds
static int tolua_get_SCity_stInBuilds(lua_State* tolua_S)
{
  SCity* self = (SCity*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stInBuilds'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stInBuilds,"SInBuildList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stInBuilds of class  SCity */
#ifndef TOLUA_DISABLE_tolua_set_SCity_stInBuilds
static int tolua_set_SCity_stInBuilds(lua_State* tolua_S)
{
  SCity* self = (SCity*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stInBuilds'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SInBuildList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stInBuilds = *((SInBuildList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: x of class  SPos */
#ifndef TOLUA_DISABLE_tolua_get_SPos_x
static int tolua_get_SPos_x(lua_State* tolua_S)
{
  SPos* self = (SPos*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'x'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->x);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: x of class  SPos */
#ifndef TOLUA_DISABLE_tolua_set_SPos_x
static int tolua_set_SPos_x(lua_State* tolua_S)
{
  SPos* self = (SPos*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'x'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->x = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: y of class  SPos */
#ifndef TOLUA_DISABLE_tolua_get_SPos_y
static int tolua_get_SPos_y(lua_State* tolua_S)
{
  SPos* self = (SPos*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'y'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->y);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: y of class  SPos */
#ifndef TOLUA_DISABLE_tolua_set_SPos_y
static int tolua_set_SPos_y(lua_State* tolua_S)
{
  SPos* self = (SPos*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'y'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->y = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gridId of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_get_SSelfField_unsigned_gridId
static int tolua_get_SSelfField_unsigned_gridId(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gridId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gridId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gridId of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_set_SSelfField_unsigned_gridId
static int tolua_set_SSelfField_unsigned_gridId(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gridId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gridId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startTime of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_get_SSelfField_unsigned_startTime
static int tolua_get_SSelfField_unsigned_startTime(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startTime of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_set_SSelfField_unsigned_startTime
static int tolua_set_SSelfField_unsigned_startTime(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: soldierNumber of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_get_SSelfField_unsigned_soldierNumber
static int tolua_get_SSelfField_unsigned_soldierNumber(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldierNumber'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->soldierNumber);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: soldierNumber of class  SSelfField */
#ifndef TOLUA_DISABLE_tolua_set_SSelfField_unsigned_soldierNumber
static int tolua_set_SSelfField_unsigned_soldierNumber(lua_State* tolua_S)
{
  SSelfField* self = (SSelfField*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldierNumber'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->soldierNumber = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curTimes of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_get_SExchangeTodayTimes_unsigned_curTimes
static int tolua_get_SExchangeTodayTimes_unsigned_curTimes(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->curTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curTimes of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_set_SExchangeTodayTimes_unsigned_curTimes
static int tolua_set_SExchangeTodayTimes_unsigned_curTimes(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: maxTimes of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_get_SExchangeTodayTimes_unsigned_maxTimes
static int tolua_get_SExchangeTodayTimes_unsigned_maxTimes(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->maxTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: maxTimes of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_set_SExchangeTodayTimes_unsigned_maxTimes
static int tolua_set_SExchangeTodayTimes_unsigned_maxTimes(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->maxTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTime of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_get_SExchangeTodayTimes_unsigned_lastTime
static int tolua_get_SExchangeTodayTimes_unsigned_lastTime(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTime of class  SExchangeTodayTimes */
#ifndef TOLUA_DISABLE_tolua_set_SExchangeTodayTimes_unsigned_lastTime
static int tolua_set_SExchangeTodayTimes_unsigned_lastTime(lua_State* tolua_S)
{
  SExchangeTodayTimes* self = (SExchangeTodayTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stCRes of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_stCRes
static int tolua_get_SCitys_stCRes(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stCRes'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stCRes,"SCityRes");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stCRes of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_stCRes
static int tolua_set_SCitys_stCRes(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stCRes'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCityRes",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stCRes = *((SCityRes*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cityDef of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_cityDef
static int tolua_get_SCitys_cityDef(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityDef'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->cityDef,"SCityDef");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cityDef of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_cityDef
static int tolua_set_SCitys_cityDef(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityDef'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCityDef",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cityDef = *((SCityDef*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucTotal of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_unsigned_ucTotal
static int tolua_get_SCitys_unsigned_ucTotal(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucTotal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucTotal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucTotal of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_unsigned_ucTotal
static int tolua_set_SCitys_unsigned_ucTotal(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucTotal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucTotal = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astCitys of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCitys_astCitys
static int tolua_get_tqAllTolua_SCitys_astCitys(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astCitys[tolua_index],"SCity");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astCitys of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCitys_astCitys
static int tolua_set_tqAllTolua_SCitys_astCitys(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CITY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astCitys[tolua_index] = *((SCity*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: fieldTotal of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_unsigned_fieldTotal
static int tolua_get_SCitys_unsigned_fieldTotal(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'fieldTotal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->fieldTotal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: fieldTotal of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_unsigned_fieldTotal
static int tolua_set_SCitys_unsigned_fieldTotal(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'fieldTotal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->fieldTotal = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: selfFields of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCitys_selfFields
static int tolua_get_tqAllTolua_SCitys_selfFields(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SELFFIELD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->selfFields[tolua_index],"SSelfField");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: selfFields of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCitys_selfFields
static int tolua_set_tqAllTolua_SCitys_selfFields(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SELFFIELD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->selfFields[tolua_index] = *((SSelfField*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: exchangeTodayTimes of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_exchangeTodayTimes
static int tolua_get_SCitys_exchangeTodayTimes(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'exchangeTodayTimes'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->exchangeTodayTimes,"SExchangeTodayTimes");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: exchangeTodayTimes of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_exchangeTodayTimes
static int tolua_set_SCitys_exchangeTodayTimes(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'exchangeTodayTimes'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SExchangeTodayTimes",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->exchangeTodayTimes = *((SExchangeTodayTimes*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startAutoBuild of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_unsigned_startAutoBuild
static int tolua_get_SCitys_unsigned_startAutoBuild(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startAutoBuild'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startAutoBuild);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startAutoBuild of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_unsigned_startAutoBuild
static int tolua_set_SCitys_unsigned_startAutoBuild(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startAutoBuild'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startAutoBuild = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: waitBuildCount of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_SCitys_waitBuildCount
static int tolua_get_SCitys_waitBuildCount(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'waitBuildCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->waitBuildCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: waitBuildCount of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_SCitys_waitBuildCount
static int tolua_set_SCitys_waitBuildCount(lua_State* tolua_S)
{
  SCitys* self = (SCitys*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'waitBuildCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->waitBuildCount = ((  char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: waitBuilds of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCitys_waitBuilds
static int tolua_get_tqAllTolua_SCitys_waitBuilds(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_WAIT_BUILDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->waitBuilds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: waitBuilds of class  SCitys */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCitys_waitBuilds
static int tolua_set_tqAllTolua_SCitys_waitBuilds(lua_State* tolua_S)
{
 int tolua_index;
  SCitys* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCitys*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_WAIT_BUILDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->waitBuilds[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: usAttr of class  SOneHole */
#ifndef TOLUA_DISABLE_tolua_get_SOneHole_unsigned_usAttr
static int tolua_get_SOneHole_unsigned_usAttr(lua_State* tolua_S)
{
  SOneHole* self = (SOneHole*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usAttr'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->usAttr);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: usAttr of class  SOneHole */
#ifndef TOLUA_DISABLE_tolua_set_SOneHole_unsigned_usAttr
static int tolua_set_SOneHole_unsigned_usAttr(lua_State* tolua_S)
{
  SOneHole* self = (SOneHole*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usAttr'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->usAttr = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulIdxOrVal of class  SOneHole */
#ifndef TOLUA_DISABLE_tolua_get_SOneHole_unsigned_ulIdxOrVal
static int tolua_get_SOneHole_unsigned_ulIdxOrVal(lua_State* tolua_S)
{
  SOneHole* self = (SOneHole*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIdxOrVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulIdxOrVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulIdxOrVal of class  SOneHole */
#ifndef TOLUA_DISABLE_tolua_set_SOneHole_unsigned_ulIdxOrVal
static int tolua_set_SOneHole_unsigned_ulIdxOrVal(lua_State* tolua_S)
{
  SOneHole* self = (SOneHole*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIdxOrVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulIdxOrVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucIcon of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_get_SFixVar_unsigned_ucIcon
static int tolua_get_SFixVar_unsigned_ucIcon(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucIcon'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucIcon);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucIcon of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_set_SFixVar_unsigned_ucIcon
static int tolua_set_SFixVar_unsigned_ucIcon(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucIcon'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucIcon = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityId of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_get_SFixVar_unsigned_ulCityId
static int tolua_get_SFixVar_unsigned_ulCityId(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityId of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_set_SFixVar_unsigned_ulCityId
static int tolua_set_SFixVar_unsigned_ulCityId(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCPosX of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_get_SFixVar_unsigned_ulCPosX
static int tolua_get_SFixVar_unsigned_ulCPosX(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCPosX'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCPosX);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCPosX of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_set_SFixVar_unsigned_ulCPosX
static int tolua_set_SFixVar_unsigned_ulCPosX(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCPosX'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCPosX = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCPosY of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_get_SFixVar_unsigned_ulCPosY
static int tolua_get_SFixVar_unsigned_ulCPosY(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCPosY'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCPosY);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCPosY of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_set_SFixVar_unsigned_ulCPosY
static int tolua_set_SFixVar_unsigned_ulCPosY(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCPosY'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCPosY = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCreateTime of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_get_SFixVar_unsigned_ulCreateTime
static int tolua_get_SFixVar_unsigned_ulCreateTime(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCreateTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCreateTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCreateTime of class  SFixVar */
#ifndef TOLUA_DISABLE_tolua_set_SFixVar_unsigned_ulCreateTime
static int tolua_set_SFixVar_unsigned_ulCreateTime(lua_State* tolua_S)
{
  SFixVar* self = (SFixVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCreateTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCreateTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: usAttr of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_get_SAttr_unsigned_usAttr
static int tolua_get_SAttr_unsigned_usAttr(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usAttr'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->usAttr);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: usAttr of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_set_SAttr_unsigned_usAttr
static int tolua_set_SAttr_unsigned_usAttr(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usAttr'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->usAttr = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulVal of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_get_SAttr_ulVal
static int tolua_get_SAttr_ulVal(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulVal of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_set_SAttr_ulVal
static int tolua_set_SAttr_ulVal(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulVal = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucUnit of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_get_SAttr_unsigned_ucUnit
static int tolua_get_SAttr_unsigned_ucUnit(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucUnit'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucUnit);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucUnit of class  SAttr */
#ifndef TOLUA_DISABLE_tolua_set_SAttr_unsigned_ucUnit
static int tolua_set_SAttr_unsigned_ucUnit(lua_State* tolua_S)
{
  SAttr* self = (SAttr*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucUnit'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucUnit = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: attr of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_get_SAttrEx_unsigned_attr
static int tolua_get_SAttrEx_unsigned_attr(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attr'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->attr);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: attr of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_set_SAttrEx_unsigned_attr
static int tolua_set_SAttrEx_unsigned_attr(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attr'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->attr = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: val of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_get_SAttrEx_unsigned_val
static int tolua_get_SAttrEx_unsigned_val(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->val);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: val of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_set_SAttrEx_unsigned_val
static int tolua_set_SAttrEx_unsigned_val(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->val = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: unit of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_get_SAttrEx_unsigned_unit
static int tolua_get_SAttrEx_unsigned_unit(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'unit'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->unit);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: unit of class  SAttrEx */
#ifndef TOLUA_DISABLE_tolua_set_SAttrEx_unsigned_unit
static int tolua_set_SAttrEx_unsigned_unit(lua_State* tolua_S)
{
  SAttrEx* self = (SAttrEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'unit'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->unit = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulNSLastTime of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_get_SRoleAttrList_unsigned_ulNSLastTime
static int tolua_get_SRoleAttrList_unsigned_ulNSLastTime(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNSLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulNSLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulNSLastTime of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_set_SRoleAttrList_unsigned_ulNSLastTime
static int tolua_set_SRoleAttrList_unsigned_ulNSLastTime(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNSLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulNSLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_get_SRoleAttrList_unsigned_ucCount
static int tolua_get_SRoleAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_set_SRoleAttrList_unsigned_ucCount
static int tolua_set_SRoleAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astAttrs of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SRoleAttrList_astAttrs
static int tolua_get_tqAllTolua_SRoleAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SRoleAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SRoleAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ROLEATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astAttrs[tolua_index],"SAttr");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astAttrs of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SRoleAttrList_astAttrs
static int tolua_set_tqAllTolua_SRoleAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SRoleAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SRoleAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ROLEATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astAttrs[tolua_index] = *((SAttr*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastPSRefreshDay of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_get_SRoleAttrList_unsigned_lastPSRefreshDay
static int tolua_get_SRoleAttrList_unsigned_lastPSRefreshDay(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastPSRefreshDay'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastPSRefreshDay);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastPSRefreshDay of class  SRoleAttrList */
#ifndef TOLUA_DISABLE_tolua_set_SRoleAttrList_unsigned_lastPSRefreshDay
static int tolua_set_SRoleAttrList_unsigned_lastPSRefreshDay(lua_State* tolua_S)
{
  SRoleAttrList* self = (SRoleAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastPSRefreshDay'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastPSRefreshDay = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_yellow_vip
static int tolua_get_SQQMembership_unsigned_is_yellow_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_yellow_vip
static int tolua_set_SQQMembership_unsigned_is_yellow_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_year_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_yellow_year_vip
static int tolua_get_SQQMembership_unsigned_is_yellow_year_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_year_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_year_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_year_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_yellow_year_vip
static int tolua_set_SQQMembership_unsigned_is_yellow_year_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_year_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_year_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: yellow_vip_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_yellow_vip_level
static int tolua_get_SQQMembership_unsigned_yellow_vip_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'yellow_vip_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->yellow_vip_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: yellow_vip_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_yellow_vip_level
static int tolua_set_SQQMembership_unsigned_yellow_vip_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'yellow_vip_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->yellow_vip_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_high_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_yellow_high_vip
static int tolua_get_SQQMembership_unsigned_is_yellow_high_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_high_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_high_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_high_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_yellow_high_vip
static int tolua_set_SQQMembership_unsigned_is_yellow_high_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_high_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_high_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_blue_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_blue_vip
static int tolua_get_SQQMembership_unsigned_is_blue_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_blue_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_blue_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_blue_vip
static int tolua_set_SQQMembership_unsigned_is_blue_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_blue_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_blue_year_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_blue_year_vip
static int tolua_get_SQQMembership_unsigned_is_blue_year_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_year_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_blue_year_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_blue_year_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_blue_year_vip
static int tolua_set_SQQMembership_unsigned_is_blue_year_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_year_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_blue_year_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: blue_vip_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_blue_vip_level
static int tolua_get_SQQMembership_unsigned_blue_vip_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'blue_vip_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->blue_vip_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: blue_vip_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_blue_vip_level
static int tolua_set_SQQMembership_unsigned_blue_vip_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'blue_vip_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->blue_vip_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_super_blue_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned_is_super_blue_vip
static int tolua_get_SQQMembership_unsigned_is_super_blue_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_super_blue_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_super_blue_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_super_blue_vip of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned_is_super_blue_vip
static int tolua_set_SQQMembership_unsigned_is_super_blue_vip(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_super_blue_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_super_blue_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: _3366_grow_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_get_SQQMembership_unsigned__3366_grow_level
static int tolua_get_SQQMembership_unsigned__3366_grow_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable '_3366_grow_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->_3366_grow_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: _3366_grow_level of class  SQQMembership */
#ifndef TOLUA_DISABLE_tolua_set_SQQMembership_unsigned__3366_grow_level
static int tolua_set_SQQMembership_unsigned__3366_grow_level(lua_State* tolua_S)
{
  SQQMembership* self = (SQQMembership*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable '_3366_grow_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->_3366_grow_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucGM of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ucGM
static int tolua_get_SBaseInfo_unsigned_ucGM(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucGM'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucGM);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucGM of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ucGM
static int tolua_set_SBaseInfo_unsigned_ucGM(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucGM'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucGM = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ucLevel
static int tolua_get_SBaseInfo_unsigned_ucLevel(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ucLevel
static int tolua_set_SBaseInfo_unsigned_ucLevel(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulPrestige of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ulPrestige
static int tolua_get_SBaseInfo_unsigned_ulPrestige(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulPrestige'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulPrestige);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulPrestige of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ulPrestige
static int tolua_set_SBaseInfo_unsigned_ulPrestige(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulPrestige'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulPrestige = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityHonor of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ulCityHonor
static int tolua_get_SBaseInfo_unsigned_ulCityHonor(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityHonor'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityHonor);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityHonor of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ulCityHonor
static int tolua_set_SBaseInfo_unsigned_ulCityHonor(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityHonor'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityHonor = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityCD of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ulCityCD
static int tolua_get_SBaseInfo_unsigned_ulCityCD(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityCD'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityCD);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityCD of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ulCityCD
static int tolua_set_SBaseInfo_unsigned_ulCityCD(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityCD'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityCD = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullAlliance of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ullAlliance
static int tolua_get_SBaseInfo_unsigned_ullAlliance(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullAlliance'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullAlliance);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullAlliance of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ullAlliance
static int tolua_set_SBaseInfo_unsigned_ullAlliance(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullAlliance'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullAlliance = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucState of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_ucState
static int tolua_get_SBaseInfo_unsigned_ucState(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucState of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_ucState
static int tolua_set_SBaseInfo_unsigned_ucState(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stAttrs of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_stAttrs
static int tolua_get_SBaseInfo_stAttrs(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stAttrs,"SRoleAttrList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stAttrs of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_stAttrs
static int tolua_set_SBaseInfo_stAttrs(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SRoleAttrList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stAttrs = *((SRoleAttrList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cityModel of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_unsigned_cityModel
static int tolua_get_SBaseInfo_unsigned_cityModel(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityModel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->cityModel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cityModel of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_unsigned_cityModel
static int tolua_set_SBaseInfo_unsigned_cityModel(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityModel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cityModel = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: introduction of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_introduction
static int tolua_get_SBaseInfo_introduction(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'introduction'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->introduction);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: introduction of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_introduction
static int tolua_set_SBaseInfo_introduction(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'introduction'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->introduction,(const char*)tolua_tostring(tolua_S,2,0),MAX_ROLEINTRO_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: qqMembership of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_get_SBaseInfo_qqMembership
static int tolua_get_SBaseInfo_qqMembership(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'qqMembership'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->qqMembership,"SQQMembership");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: qqMembership of class  SBaseInfo */
#ifndef TOLUA_DISABLE_tolua_set_SBaseInfo_qqMembership
static int tolua_set_SBaseInfo_qqMembership(lua_State* tolua_S)
{
  SBaseInfo* self = (SBaseInfo*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'qqMembership'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SQQMembership",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->qqMembership = *((SQQMembership*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taskId of class  STask */
#ifndef TOLUA_DISABLE_tolua_get_STask_unsigned_taskId
static int tolua_get_STask_unsigned_taskId(lua_State* tolua_S)
{
  STask* self = (STask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taskId of class  STask */
#ifndef TOLUA_DISABLE_tolua_set_STask_unsigned_taskId
static int tolua_set_STask_unsigned_taskId(lua_State* tolua_S)
{
  STask* self = (STask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: state of class  STask */
#ifndef TOLUA_DISABLE_tolua_get_STask_unsigned_state
static int tolua_get_STask_unsigned_state(lua_State* tolua_S)
{
  STask* self = (STask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->state);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: state of class  STask */
#ifndef TOLUA_DISABLE_tolua_set_STask_unsigned_state
static int tolua_set_STask_unsigned_state(lua_State* tolua_S)
{
  STask* self = (STask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->state = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taskId of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_get_SDoingRoleTask_unsigned_taskId
static int tolua_get_SDoingRoleTask_unsigned_taskId(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taskId of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_set_SDoingRoleTask_unsigned_taskId
static int tolua_set_SDoingRoleTask_unsigned_taskId(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_get_SDoingRoleTask_unsigned_stopTime
static int tolua_get_SDoingRoleTask_unsigned_stopTime(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_set_SDoingRoleTask_unsigned_stopTime
static int tolua_set_SDoingRoleTask_unsigned_stopTime(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cdStopTime of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_get_SDoingRoleTask_unsigned_cdStopTime
static int tolua_get_SDoingRoleTask_unsigned_cdStopTime(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cdStopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->cdStopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cdStopTime of class  SDoingRoleTask */
#ifndef TOLUA_DISABLE_tolua_set_SDoingRoleTask_unsigned_cdStopTime
static int tolua_set_SDoingRoleTask_unsigned_cdStopTime(lua_State* tolua_S)
{
  SDoingRoleTask* self = (SDoingRoleTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cdStopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cdStopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taskId of class  SActValTask */
#ifndef TOLUA_DISABLE_tolua_get_SActValTask_unsigned_taskId
static int tolua_get_SActValTask_unsigned_taskId(lua_State* tolua_S)
{
  SActValTask* self = (SActValTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taskId of class  SActValTask */
#ifndef TOLUA_DISABLE_tolua_set_SActValTask_unsigned_taskId
static int tolua_set_SActValTask_unsigned_taskId(lua_State* tolua_S)
{
  SActValTask* self = (SActValTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: times of class  SActValTask */
#ifndef TOLUA_DISABLE_tolua_get_SActValTask_unsigned_times
static int tolua_get_SActValTask_unsigned_times(lua_State* tolua_S)
{
  SActValTask* self = (SActValTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->times);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: times of class  SActValTask */
#ifndef TOLUA_DISABLE_tolua_set_SActValTask_unsigned_times
static int tolua_set_SActValTask_unsigned_times(lua_State* tolua_S)
{
  SActValTask* self = (SActValTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->times = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taskId of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_taskId
static int tolua_get_SActTask_unsigned_taskId(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taskId of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_taskId
static int tolua_set_SActTask_unsigned_taskId(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: state of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_state
static int tolua_get_SActTask_unsigned_state(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->state);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: state of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_state
static int tolua_set_SActTask_unsigned_state(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->state = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: times of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_times
static int tolua_get_SActTask_unsigned_times(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->times);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: times of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_times
static int tolua_set_SActTask_unsigned_times(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->times = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: maxTimes of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_maxTimes
static int tolua_get_SActTask_unsigned_maxTimes(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->maxTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: maxTimes of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_maxTimes
static int tolua_set_SActTask_unsigned_maxTimes(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->maxTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startTime of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_startTime
static int tolua_get_SActTask_unsigned_startTime(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startTime of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_startTime
static int tolua_set_SActTask_unsigned_startTime(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_get_SActTask_unsigned_stopTime
static int tolua_get_SActTask_unsigned_stopTime(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  SActTask */
#ifndef TOLUA_DISABLE_tolua_set_SActTask_unsigned_stopTime
static int tolua_set_SActTask_unsigned_stopTime(lua_State* tolua_S)
{
  SActTask* self = (SActTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshActValTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_refreshActValTime
static int tolua_get_SActivityVal_unsigned_refreshActValTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshActValTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshActValTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshActValTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_refreshActValTime
static int tolua_set_SActivityVal_unsigned_refreshActValTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshActValTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshActValTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: val of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_val
static int tolua_get_SActivityVal_unsigned_val(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->val);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: val of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_val
static int tolua_set_SActivityVal_unsigned_val(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'val'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->val = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotActRewardTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_gotActRewardTime
static int tolua_get_SActivityVal_unsigned_gotActRewardTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotActRewardTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotActRewardTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotActRewardTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_gotActRewardTime
static int tolua_set_SActivityVal_unsigned_gotActRewardTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotActRewardTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotActRewardTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotActRewards of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SActivityVal_gotActRewards
static int tolua_get_tqAllTolua_SActivityVal_gotActRewards(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACTREWARDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gotActRewards[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotActRewards of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SActivityVal_gotActRewards
static int tolua_set_tqAllTolua_SActivityVal_gotActRewards(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACTREWARDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gotActRewards[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshSigninTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_refreshSigninTime
static int tolua_get_SActivityVal_unsigned_refreshSigninTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshSigninTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshSigninTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshSigninTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_refreshSigninTime
static int tolua_set_SActivityVal_unsigned_refreshSigninTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshSigninTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshSigninTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todaySign of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_todaySign
static int tolua_get_SActivityVal_unsigned_todaySign(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todaySign'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todaySign);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todaySign of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_todaySign
static int tolua_set_SActivityVal_unsigned_todaySign(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todaySign'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todaySign = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: signinDaysTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_signinDaysTime
static int tolua_get_SActivityVal_unsigned_signinDaysTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'signinDaysTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->signinDaysTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: signinDaysTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_signinDaysTime
static int tolua_set_SActivityVal_unsigned_signinDaysTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'signinDaysTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->signinDaysTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: signinDays of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_signinDays
static int tolua_get_SActivityVal_unsigned_signinDays(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'signinDays'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->signinDays);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: signinDays of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_signinDays
static int tolua_set_SActivityVal_unsigned_signinDays(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'signinDays'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->signinDays = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotSigninRewardTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_gotSigninRewardTime
static int tolua_get_SActivityVal_unsigned_gotSigninRewardTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotSigninRewardTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotSigninRewardTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotSigninRewardTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_gotSigninRewardTime
static int tolua_set_SActivityVal_unsigned_gotSigninRewardTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotSigninRewardTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotSigninRewardTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotSigninRewards of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SActivityVal_gotSigninRewards
static int tolua_get_tqAllTolua_SActivityVal_gotSigninRewards(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIGNINREWARDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gotSigninRewards[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotSigninRewards of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SActivityVal_gotSigninRewards
static int tolua_set_tqAllTolua_SActivityVal_gotSigninRewards(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIGNINREWARDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gotSigninRewards[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshTaskTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_refreshTaskTime
static int tolua_get_SActivityVal_unsigned_refreshTaskTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTaskTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshTaskTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshTaskTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_refreshTaskTime
static int tolua_set_SActivityVal_unsigned_refreshTaskTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTaskTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshTaskTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_count
static int tolua_get_SActivityVal_count(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_count
static int tolua_set_SActivityVal_count(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: tasks of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SActivityVal_tasks
static int tolua_get_tqAllTolua_SActivityVal_tasks(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACTVALTASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->tasks[tolua_index],"SActValTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: tasks of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SActivityVal_tasks
static int tolua_set_tqAllTolua_SActivityVal_tasks(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACTVALTASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->tasks[tolua_index] = *((SActValTask*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotOnlineGoodsTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_gotOnlineGoodsTime
static int tolua_get_SActivityVal_unsigned_gotOnlineGoodsTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotOnlineGoodsTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotOnlineGoodsTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotOnlineGoodsTime of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_gotOnlineGoodsTime
static int tolua_set_SActivityVal_unsigned_gotOnlineGoodsTime(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotOnlineGoodsTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotOnlineGoodsTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotGoodsTimes of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_SActivityVal_unsigned_gotGoodsTimes
static int tolua_get_SActivityVal_unsigned_gotGoodsTimes(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotGoodsTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotGoodsTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotGoodsTimes of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_SActivityVal_unsigned_gotGoodsTimes
static int tolua_set_SActivityVal_unsigned_gotGoodsTimes(lua_State* tolua_S)
{
  SActivityVal* self = (SActivityVal*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotGoodsTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotGoodsTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotSigninRewardsEx of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SActivityVal_gotSigninRewardsEx
static int tolua_get_tqAllTolua_SActivityVal_gotSigninRewardsEx(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIGNINREWARDS_CNT_EX)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gotSigninRewardsEx[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotSigninRewardsEx of class  SActivityVal */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SActivityVal_gotSigninRewardsEx
static int tolua_set_tqAllTolua_SActivityVal_gotSigninRewardsEx(lua_State* tolua_S)
{
 int tolua_index;
  SActivityVal* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActivityVal*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIGNINREWARDS_CNT_EX)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gotSigninRewardsEx[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taskId of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_get_SOnlineTask_unsigned_taskId
static int tolua_get_SOnlineTask_unsigned_taskId(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taskId of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_set_SOnlineTask_unsigned_taskId
static int tolua_set_SOnlineTask_unsigned_taskId(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startTime of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_get_SOnlineTask_unsigned_startTime
static int tolua_get_SOnlineTask_unsigned_startTime(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startTime of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_set_SOnlineTask_unsigned_startTime
static int tolua_set_SOnlineTask_unsigned_startTime(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTime of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_get_SOnlineTask_unsigned_lastTime
static int tolua_get_SOnlineTask_unsigned_lastTime(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTime of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_set_SOnlineTask_unsigned_lastTime
static int tolua_set_SOnlineTask_unsigned_lastTime(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastLapsed of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_get_SOnlineTask_unsigned_lastLapsed
static int tolua_get_SOnlineTask_unsigned_lastLapsed(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastLapsed'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastLapsed);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastLapsed of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_set_SOnlineTask_unsigned_lastLapsed
static int tolua_set_SOnlineTask_unsigned_lastLapsed(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastLapsed'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastLapsed = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isCircled of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_get_SOnlineTask_unsigned_isCircled
static int tolua_get_SOnlineTask_unsigned_isCircled(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isCircled'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isCircled);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isCircled of class  SOnlineTask */
#ifndef TOLUA_DISABLE_tolua_set_SOnlineTask_unsigned_isCircled
static int tolua_set_SOnlineTask_unsigned_isCircled(lua_State* tolua_S)
{
  SOnlineTask* self = (SOnlineTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isCircled'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isCircled = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curTaskId of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_get_SNewcomerTask_unsigned_curTaskId
static int tolua_get_SNewcomerTask_unsigned_curTaskId(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTaskId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->curTaskId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curTaskId of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_set_SNewcomerTask_unsigned_curTaskId
static int tolua_set_SNewcomerTask_unsigned_curTaskId(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTaskId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curTaskId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isEnd of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_get_SNewcomerTask_unsigned_isEnd
static int tolua_get_SNewcomerTask_unsigned_isEnd(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isEnd'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isEnd);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isEnd of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_set_SNewcomerTask_unsigned_isEnd
static int tolua_set_SNewcomerTask_unsigned_isEnd(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isEnd'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isEnd = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isGlobalTipEnd of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_get_SNewcomerTask_unsigned_isGlobalTipEnd
static int tolua_get_SNewcomerTask_unsigned_isGlobalTipEnd(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isGlobalTipEnd'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isGlobalTipEnd);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isGlobalTipEnd of class  SNewcomerTask */
#ifndef TOLUA_DISABLE_tolua_set_SNewcomerTask_unsigned_isGlobalTipEnd
static int tolua_set_SNewcomerTask_unsigned_isGlobalTipEnd(lua_State* tolua_S)
{
  SNewcomerTask* self = (SNewcomerTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isGlobalTipEnd'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isGlobalTipEnd = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotNewgift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SYellowDiamondTask_gotNewgift
static int tolua_get_SYellowDiamondTask_gotNewgift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotNewgift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotNewgift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotNewgift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SYellowDiamondTask_gotNewgift
static int tolua_set_SYellowDiamondTask_gotNewgift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotNewgift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotNewgift = ((  char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotCommGift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SYellowDiamondTask_unsigned_gotCommGift
static int tolua_get_SYellowDiamondTask_unsigned_gotCommGift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotCommGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotCommGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotCommGift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SYellowDiamondTask_unsigned_gotCommGift
static int tolua_set_SYellowDiamondTask_unsigned_gotCommGift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotCommGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotCommGift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotYearGift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SYellowDiamondTask_unsigned_gotYearGift
static int tolua_get_SYellowDiamondTask_unsigned_gotYearGift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotYearGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotYearGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotYearGift of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SYellowDiamondTask_unsigned_gotYearGift
static int tolua_set_SYellowDiamondTask_unsigned_gotYearGift(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotYearGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotYearGift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lvlCount of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SYellowDiamondTask_lvlCount
static int tolua_get_SYellowDiamondTask_lvlCount(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lvlCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lvlCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lvlCount of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SYellowDiamondTask_lvlCount
static int tolua_set_SYellowDiamondTask_lvlCount(lua_State* tolua_S)
{
  SYellowDiamondTask* self = (SYellowDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lvlCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lvlCount = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotLvlGifts of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SYellowDiamondTask_gotLvlGifts
static int tolua_get_tqAllTolua_SYellowDiamondTask_gotLvlGifts(lua_State* tolua_S)
{
 int tolua_index;
  SYellowDiamondTask* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SYellowDiamondTask*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_YD_LVL_IDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gotLvlGifts[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotLvlGifts of class  SYellowDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SYellowDiamondTask_gotLvlGifts
static int tolua_set_tqAllTolua_SYellowDiamondTask_gotLvlGifts(lua_State* tolua_S)
{
 int tolua_index;
  SYellowDiamondTask* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SYellowDiamondTask*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_YD_LVL_IDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gotLvlGifts[tolua_index] = ((  char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotNewgift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_gotNewgift
static int tolua_get_SBlueDiamondTask_gotNewgift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotNewgift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotNewgift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotNewgift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_gotNewgift
static int tolua_set_SBlueDiamondTask_gotNewgift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotNewgift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotNewgift = ((  char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotCommGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_unsigned_gotCommGift
static int tolua_get_SBlueDiamondTask_unsigned_gotCommGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotCommGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotCommGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotCommGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_unsigned_gotCommGift
static int tolua_set_SBlueDiamondTask_unsigned_gotCommGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotCommGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotCommGift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotYearGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_unsigned_gotYearGift
static int tolua_get_SBlueDiamondTask_unsigned_gotYearGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotYearGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotYearGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotYearGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_unsigned_gotYearGift
static int tolua_set_SBlueDiamondTask_unsigned_gotYearGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotYearGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotYearGift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotHighGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_unsigned_gotHighGift
static int tolua_get_SBlueDiamondTask_unsigned_gotHighGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotHighGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotHighGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotHighGift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_unsigned_gotHighGift
static int tolua_set_SBlueDiamondTask_unsigned_gotHighGift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotHighGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotHighGift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lvlCount of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_lvlCount
static int tolua_get_SBlueDiamondTask_lvlCount(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lvlCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lvlCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lvlCount of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_lvlCount
static int tolua_set_SBlueDiamondTask_lvlCount(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lvlCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lvlCount = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotLvlGifts of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SBlueDiamondTask_gotLvlGifts
static int tolua_get_tqAllTolua_SBlueDiamondTask_gotLvlGifts(lua_State* tolua_S)
{
 int tolua_index;
  SBlueDiamondTask* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBlueDiamondTask*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BD_LVL_IDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gotLvlGifts[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotLvlGifts of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SBlueDiamondTask_gotLvlGifts
static int tolua_set_tqAllTolua_SBlueDiamondTask_gotLvlGifts(lua_State* tolua_S)
{
 int tolua_index;
  SBlueDiamondTask* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBlueDiamondTask*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BD_LVL_IDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gotLvlGifts[tolua_index] = ((  char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: got3366Gift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_get_SBlueDiamondTask_unsigned_got3366Gift
static int tolua_get_SBlueDiamondTask_unsigned_got3366Gift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'got3366Gift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->got3366Gift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: got3366Gift of class  SBlueDiamondTask */
#ifndef TOLUA_DISABLE_tolua_set_SBlueDiamondTask_unsigned_got3366Gift
static int tolua_set_SBlueDiamondTask_unsigned_got3366Gift(lua_State* tolua_S)
{
  SBlueDiamondTask* self = (SBlueDiamondTask*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'got3366Gift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->got3366Gift = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastPayTime of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_get_SPayAct_unsigned_lastPayTime
static int tolua_get_SPayAct_unsigned_lastPayTime(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastPayTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastPayTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastPayTime of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_set_SPayAct_unsigned_lastPayTime
static int tolua_set_SPayAct_unsigned_lastPayTime(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastPayTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastPayTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: allGold of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_get_SPayAct_unsigned_allGold
static int tolua_get_SPayAct_unsigned_allGold(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->allGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: allGold of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_set_SPayAct_unsigned_allGold
static int tolua_set_SPayAct_unsigned_allGold(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->allGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actAllGold of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_get_SPayAct_unsigned_actAllGold
static int tolua_get_SPayAct_unsigned_actAllGold(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actAllGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->actAllGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actAllGold of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_set_SPayAct_unsigned_actAllGold
static int tolua_set_SPayAct_unsigned_actAllGold(lua_State* tolua_S)
{
  SPayAct* self = (SPayAct*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actAllGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->actAllGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: giftGots of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SPayAct_giftGots
static int tolua_get_tqAllTolua_SPayAct_giftGots(lua_State* tolua_S)
{
 int tolua_index;
  SPayAct* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPayAct*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_PAYACT_GIFT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->giftGots[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: giftGots of class  SPayAct */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SPayAct_giftGots
static int tolua_set_tqAllTolua_SPayAct_giftGots(lua_State* tolua_S)
{
 int tolua_index;
  SPayAct* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPayAct*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_PAYACT_GIFT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->giftGots[tolua_index] = (( unsigned char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: times of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_times
static int tolua_get_SWorldboss_unsigned_times(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->times);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: times of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_times
static int tolua_set_SWorldboss_unsigned_times(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->times = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: guwuLevel of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_guwuLevel
static int tolua_get_SWorldboss_unsigned_guwuLevel(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'guwuLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->guwuLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: guwuLevel of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_guwuLevel
static int tolua_set_SWorldboss_unsigned_guwuLevel(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'guwuLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->guwuLevel = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gotGift of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_gotGift
static int tolua_get_SWorldboss_unsigned_gotGift(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotGift'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gotGift);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gotGift of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_gotGift
static int tolua_set_SWorldboss_unsigned_gotGift(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gotGift'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gotGift = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_refreshTime
static int tolua_get_SWorldboss_unsigned_refreshTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_refreshTime
static int tolua_set_SWorldboss_unsigned_refreshTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: getPersonRankGiftTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_getPersonRankGiftTime
static int tolua_get_SWorldboss_unsigned_getPersonRankGiftTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getPersonRankGiftTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->getPersonRankGiftTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: getPersonRankGiftTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_getPersonRankGiftTime
static int tolua_set_SWorldboss_unsigned_getPersonRankGiftTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getPersonRankGiftTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->getPersonRankGiftTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: getCountryRankGiftTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_get_SWorldboss_unsigned_getCountryRankGiftTime
static int tolua_get_SWorldboss_unsigned_getCountryRankGiftTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getCountryRankGiftTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->getCountryRankGiftTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: getCountryRankGiftTime of class  SWorldboss */
#ifndef TOLUA_DISABLE_tolua_set_SWorldboss_unsigned_getCountryRankGiftTime
static int tolua_set_SWorldboss_unsigned_getCountryRankGiftTime(lua_State* tolua_S)
{
  SWorldboss* self = (SWorldboss*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getCountryRankGiftTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->getCountryRankGiftTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: sendFirstHero of class  SSendReward */
#ifndef TOLUA_DISABLE_tolua_get_SSendReward_unsigned_sendFirstHero
static int tolua_get_SSendReward_unsigned_sendFirstHero(lua_State* tolua_S)
{
  SSendReward* self = (SSendReward*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sendFirstHero'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->sendFirstHero);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: sendFirstHero of class  SSendReward */
#ifndef TOLUA_DISABLE_tolua_set_SSendReward_unsigned_sendFirstHero
static int tolua_set_SSendReward_unsigned_sendFirstHero(lua_State* tolua_S)
{
  SSendReward* self = (SSendReward*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sendFirstHero'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->sendFirstHero = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_count
static int tolua_get_STaskList_count(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_count
static int tolua_set_STaskList_count(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: tasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_STaskList_tasks
static int tolua_get_tqAllTolua_STaskList_tasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->tasks[tolua_index],"STask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: tasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_STaskList_tasks
static int tolua_set_tqAllTolua_STaskList_tasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->tasks[tolua_index] = *((STask*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: doingRoleTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_doingRoleTask
static int tolua_get_STaskList_doingRoleTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'doingRoleTask'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->doingRoleTask,"SDoingRoleTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: doingRoleTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_doingRoleTask
static int tolua_set_STaskList_doingRoleTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'doingRoleTask'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SDoingRoleTask",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->doingRoleTask = *((SDoingRoleTask*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshTime of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_unsigned_refreshTime
static int tolua_get_STaskList_unsigned_refreshTime(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshTime of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_unsigned_refreshTime
static int tolua_set_STaskList_unsigned_refreshTime(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: everydayCount of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_everydayCount
static int tolua_get_STaskList_everydayCount(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'everydayCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->everydayCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: everydayCount of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_everydayCount
static int tolua_set_STaskList_everydayCount(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'everydayCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->everydayCount = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: everydayTasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_STaskList_everydayTasks
static int tolua_get_tqAllTolua_STaskList_everydayTasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_EVERYDAY_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->everydayTasks[tolua_index],"STask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: everydayTasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_STaskList_everydayTasks
static int tolua_set_tqAllTolua_STaskList_everydayTasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_EVERYDAY_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->everydayTasks[tolua_index] = *((STask*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: prestigeLastTime of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_unsigned_prestigeLastTime
static int tolua_get_STaskList_unsigned_prestigeLastTime(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'prestigeLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->prestigeLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: prestigeLastTime of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_unsigned_prestigeLastTime
static int tolua_set_STaskList_unsigned_prestigeLastTime(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'prestigeLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->prestigeLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: activityVal of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_activityVal
static int tolua_get_STaskList_activityVal(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'activityVal'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->activityVal,"SActivityVal");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: activityVal of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_activityVal
static int tolua_set_STaskList_activityVal(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'activityVal'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SActivityVal",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->activityVal = *((SActivityVal*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: onlineTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_onlineTask
static int tolua_get_STaskList_onlineTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'onlineTask'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->onlineTask,"SOnlineTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: onlineTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_onlineTask
static int tolua_set_STaskList_onlineTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'onlineTask'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SOnlineTask",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->onlineTask = *((SOnlineTask*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: newComerTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_newComerTask
static int tolua_get_STaskList_newComerTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'newComerTask'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->newComerTask,"SNewcomerTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: newComerTask of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_newComerTask
static int tolua_set_STaskList_newComerTask(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'newComerTask'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SNewcomerTask",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->newComerTask = *((SNewcomerTask*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actTaskCount of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_actTaskCount
static int tolua_get_STaskList_actTaskCount(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTaskCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->actTaskCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actTaskCount of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_actTaskCount
static int tolua_set_STaskList_actTaskCount(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTaskCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->actTaskCount = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actTasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_STaskList_actTasks
static int tolua_get_tqAllTolua_STaskList_actTasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACT_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->actTasks[tolua_index],"SActTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actTasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_STaskList_actTasks
static int tolua_set_tqAllTolua_STaskList_actTasks(lua_State* tolua_S)
{
 int tolua_index;
  STaskList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STaskList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACT_TASKS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->actTasks[tolua_index] = *((SActTask*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ydtasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_ydtasks
static int tolua_get_STaskList_ydtasks(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ydtasks'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->ydtasks,"SYellowDiamondTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ydtasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_ydtasks
static int tolua_set_STaskList_ydtasks(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ydtasks'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SYellowDiamondTask",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ydtasks = *((SYellowDiamondTask*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: payAct of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_payAct
static int tolua_get_STaskList_payAct(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'payAct'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->payAct,"SPayAct");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: payAct of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_payAct
static int tolua_set_STaskList_payAct(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'payAct'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SPayAct",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->payAct = *((SPayAct*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: bdtasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_bdtasks
static int tolua_get_STaskList_bdtasks(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'bdtasks'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->bdtasks,"SBlueDiamondTask");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: bdtasks of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_bdtasks
static int tolua_set_STaskList_bdtasks(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'bdtasks'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SBlueDiamondTask",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->bdtasks = *((SBlueDiamondTask*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: worldboss of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_worldboss
static int tolua_get_STaskList_worldboss(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'worldboss'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->worldboss,"SWorldboss");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: worldboss of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_worldboss
static int tolua_set_STaskList_worldboss(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'worldboss'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SWorldboss",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->worldboss = *((SWorldboss*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: sendReward of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_get_STaskList_sendReward
static int tolua_get_STaskList_sendReward(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sendReward'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->sendReward,"SSendReward");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: sendReward of class  STaskList */
#ifndef TOLUA_DISABLE_tolua_set_STaskList_sendReward
static int tolua_set_STaskList_sendReward(lua_State* tolua_S)
{
  STaskList* self = (STaskList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sendReward'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSendReward",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->sendReward = *((SSendReward*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: resid of class  SSoldier */
#ifndef TOLUA_DISABLE_tolua_get_SSoldier_unsigned_resid
static int tolua_get_SSoldier_unsigned_resid(lua_State* tolua_S)
{
  SSoldier* self = (SSoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->resid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: resid of class  SSoldier */
#ifndef TOLUA_DISABLE_tolua_set_SSoldier_unsigned_resid
static int tolua_set_SSoldier_unsigned_resid(lua_State* tolua_S)
{
  SSoldier* self = (SSoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->resid = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: number of class  SSoldier */
#ifndef TOLUA_DISABLE_tolua_get_SSoldier_unsigned_number
static int tolua_get_SSoldier_unsigned_number(lua_State* tolua_S)
{
  SSoldier* self = (SSoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->number);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: number of class  SSoldier */
#ifndef TOLUA_DISABLE_tolua_set_SSoldier_unsigned_number
static int tolua_set_SSoldier_unsigned_number(lua_State* tolua_S)
{
  SSoldier* self = (SSoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->number = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: state of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_get_SDeclare_unsigned_state
static int tolua_get_SDeclare_unsigned_state(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->state);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: state of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_set_SDeclare_unsigned_state
static int tolua_set_SDeclare_unsigned_state(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->state = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stoptime of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_get_SDeclare_unsigned_stoptime
static int tolua_get_SDeclare_unsigned_stoptime(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stoptime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stoptime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stoptime of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_set_SDeclare_unsigned_stoptime
static int tolua_set_SDeclare_unsigned_stoptime(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stoptime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stoptime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_get_SDeclare_unsigned_id
static int tolua_get_SDeclare_unsigned_id(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SDeclare */
#ifndef TOLUA_DISABLE_tolua_set_SDeclare_unsigned_id
static int tolua_set_SDeclare_unsigned_id(lua_State* tolua_S)
{
  SDeclare* self = (SDeclare*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineupId of class  SDefaultTeam */
#ifndef TOLUA_DISABLE_tolua_get_SDefaultTeam_unsigned_lineupId
static int tolua_get_SDefaultTeam_unsigned_lineupId(lua_State* tolua_S)
{
  SDefaultTeam* self = (SDefaultTeam*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lineupId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineupId of class  SDefaultTeam */
#ifndef TOLUA_DISABLE_tolua_set_SDefaultTeam_unsigned_lineupId
static int tolua_set_SDefaultTeam_unsigned_lineupId(lua_State* tolua_S)
{
  SDefaultTeam* self = (SDefaultTeam*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lineupId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: heroIds of class  SDefaultTeam */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SDefaultTeam_heroIds
static int tolua_get_tqAllTolua_SDefaultTeam_heroIds(lua_State* tolua_S)
{
 int tolua_index;
  SDefaultTeam* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SDefaultTeam*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_DEFAULTTEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->heroIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: heroIds of class  SDefaultTeam */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SDefaultTeam_heroIds
static int tolua_set_tqAllTolua_SDefaultTeam_heroIds(lua_State* tolua_S)
{
 int tolua_index;
  SDefaultTeam* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SDefaultTeam*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_DEFAULTTEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->heroIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: taofa of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_get_STodayFightTimes_unsigned_taofa
static int tolua_get_STodayFightTimes_unsigned_taofa(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taofa'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->taofa);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: taofa of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_set_STodayFightTimes_unsigned_taofa
static int tolua_set_STodayFightTimes_unsigned_taofa(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'taofa'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->taofa = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cuihui of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_get_STodayFightTimes_unsigned_cuihui
static int tolua_get_STodayFightTimes_unsigned_cuihui(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cuihui'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->cuihui);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cuihui of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_set_STodayFightTimes_unsigned_cuihui
static int tolua_set_STodayFightTimes_unsigned_cuihui(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cuihui'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cuihui = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: tiaoxin of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_get_STodayFightTimes_unsigned_tiaoxin
static int tolua_get_STodayFightTimes_unsigned_tiaoxin(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'tiaoxin'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->tiaoxin);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: tiaoxin of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_set_STodayFightTimes_unsigned_tiaoxin
static int tolua_set_STodayFightTimes_unsigned_tiaoxin(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'tiaoxin'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->tiaoxin = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: fightowner of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_get_STodayFightTimes_unsigned_fightowner
static int tolua_get_STodayFightTimes_unsigned_fightowner(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'fightowner'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->fightowner);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: fightowner of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_set_STodayFightTimes_unsigned_fightowner
static int tolua_set_STodayFightTimes_unsigned_fightowner(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'fightowner'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->fightowner = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTime of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_get_STodayFightTimes_unsigned_lastTime
static int tolua_get_STodayFightTimes_unsigned_lastTime(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTime of class  STodayFightTimes */
#ifndef TOLUA_DISABLE_tolua_set_STodayFightTimes_unsigned_lastTime
static int tolua_set_STodayFightTimes_unsigned_lastTime(lua_State* tolua_S)
{
  STodayFightTimes* self = (STodayFightTimes*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_unsigned_id
static int tolua_get_SSimpleHero_unsigned_id(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_unsigned_id
static int tolua_set_SSimpleHero_unsigned_id(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: name of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_name
static int tolua_get_SSimpleHero_name(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'name'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->name);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: name of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_name
static int tolua_set_SSimpleHero_name(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'name'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->name,(const char*)tolua_tostring(tolua_S,2,0),MAX_HERONAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: level of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_unsigned_level
static int tolua_get_SSimpleHero_unsigned_level(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: level of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_unsigned_level
static int tolua_set_SSimpleHero_unsigned_level(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: attrCount of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_unsigned_attrCount
static int tolua_get_SSimpleHero_unsigned_attrCount(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attrCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->attrCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: attrCount of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_unsigned_attrCount
static int tolua_set_SSimpleHero_unsigned_attrCount(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attrCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->attrCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: attrs of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SSimpleHero_attrs
static int tolua_get_tqAllTolua_SSimpleHero_attrs(lua_State* tolua_S)
{
 int tolua_index;
  SSimpleHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSimpleHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIMPLEHEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->attrs[tolua_index],"SAttrEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: attrs of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SSimpleHero_attrs
static int tolua_set_tqAllTolua_SSimpleHero_attrs(lua_State* tolua_S)
{
 int tolua_index;
  SSimpleHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSimpleHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SIMPLEHEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->attrs[tolua_index] = *((SAttrEx*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: soldier of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_soldier
static int tolua_get_SSimpleHero_soldier(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldier'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->soldier,"SSoldier");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: soldier of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_soldier
static int tolua_set_SSimpleHero_soldier(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldier'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSoldier",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->soldier = *((SSoldier*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineupPos of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_get_SSimpleHero_unsigned_lineupPos
static int tolua_get_SSimpleHero_unsigned_lineupPos(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupPos'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lineupPos);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineupPos of class  SSimpleHero */
#ifndef TOLUA_DISABLE_tolua_set_SSimpleHero_unsigned_lineupPos
static int tolua_set_SSimpleHero_unsigned_lineupPos(lua_State* tolua_S)
{
  SSimpleHero* self = (SSimpleHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupPos'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lineupPos = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineupId of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_get_SDefArmy_unsigned_lineupId
static int tolua_get_SDefArmy_unsigned_lineupId(lua_State* tolua_S)
{
  SDefArmy* self = (SDefArmy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lineupId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineupId of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_set_SDefArmy_unsigned_lineupId
static int tolua_set_SDefArmy_unsigned_lineupId(lua_State* tolua_S)
{
  SDefArmy* self = (SDefArmy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lineupId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: heroCount of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_get_SDefArmy_unsigned_heroCount
static int tolua_get_SDefArmy_unsigned_heroCount(lua_State* tolua_S)
{
  SDefArmy* self = (SDefArmy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'heroCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->heroCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: heroCount of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_set_SDefArmy_unsigned_heroCount
static int tolua_set_SDefArmy_unsigned_heroCount(lua_State* tolua_S)
{
  SDefArmy* self = (SDefArmy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'heroCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->heroCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: heros of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SDefArmy_heros
static int tolua_get_tqAllTolua_SDefArmy_heros(lua_State* tolua_S)
{
 int tolua_index;
  SDefArmy* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SDefArmy*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->heros[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: heros of class  SDefArmy */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SDefArmy_heros
static int tolua_set_tqAllTolua_SDefArmy_heros(lua_State* tolua_S)
{
 int tolua_index;
  SDefArmy* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SDefArmy*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->heros[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: soldiers of class  STowerArmy */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_STowerArmy_soldiers
static int tolua_get_tqAllTolua_STowerArmy_soldiers(lua_State* tolua_S)
{
 int tolua_index;
  STowerArmy* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STowerArmy*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->soldiers[tolua_index],"SSoldier");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: soldiers of class  STowerArmy */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_STowerArmy_soldiers
static int tolua_set_tqAllTolua_STowerArmy_soldiers(lua_State* tolua_S)
{
 int tolua_index;
  STowerArmy* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STowerArmy*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->soldiers[tolua_index] = *((SSoldier*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: hasRefreshTime of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_get_SFightTodayHonor_unsigned_hasRefreshTime
static int tolua_get_SFightTodayHonor_unsigned_hasRefreshTime(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hasRefreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->hasRefreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: hasRefreshTime of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_set_SFightTodayHonor_unsigned_hasRefreshTime
static int tolua_set_SFightTodayHonor_unsigned_hasRefreshTime(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hasRefreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->hasRefreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: hasHonor of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_get_SFightTodayHonor_unsigned_hasHonor
static int tolua_get_SFightTodayHonor_unsigned_hasHonor(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hasHonor'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->hasHonor);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: hasHonor of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_set_SFightTodayHonor_unsigned_hasHonor
static int tolua_set_SFightTodayHonor_unsigned_hasHonor(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hasHonor'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->hasHonor = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: getRefreshTime of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_get_SFightTodayHonor_unsigned_getRefreshTime
static int tolua_get_SFightTodayHonor_unsigned_getRefreshTime(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getRefreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->getRefreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: getRefreshTime of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_set_SFightTodayHonor_unsigned_getRefreshTime
static int tolua_set_SFightTodayHonor_unsigned_getRefreshTime(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getRefreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->getRefreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: getHonor of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_get_SFightTodayHonor_unsigned_getHonor
static int tolua_get_SFightTodayHonor_unsigned_getHonor(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getHonor'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->getHonor);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: getHonor of class  SFightTodayHonor */
#ifndef TOLUA_DISABLE_tolua_set_SFightTodayHonor_unsigned_getHonor
static int tolua_set_SFightTodayHonor_unsigned_getHonor(lua_State* tolua_S)
{
  SFightTodayHonor* self = (SFightTodayHonor*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'getHonor'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->getHonor = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: favoriteCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_favoriteCount
static int tolua_get_SMilitary_unsigned_favoriteCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'favoriteCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->favoriteCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: favoriteCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_favoriteCount
static int tolua_set_SMilitary_unsigned_favoriteCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'favoriteCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->favoriteCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: favorites of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_favorites
static int tolua_get_tqAllTolua_SMilitary_favorites(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FAVORITE_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->favorites[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: favorites of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_favorites
static int tolua_set_tqAllTolua_SMilitary_favorites(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FAVORITE_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->favorites[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: enemyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_enemyCount
static int tolua_get_SMilitary_unsigned_enemyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->enemyCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: enemyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_enemyCount
static int tolua_set_SMilitary_unsigned_enemyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->enemyCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: enemys of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_enemys
static int tolua_get_tqAllTolua_SMilitary_enemys(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ENEMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->enemys[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: enemys of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_enemys
static int tolua_set_tqAllTolua_SMilitary_enemys(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ENEMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->enemys[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineupCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_lineupCount
static int tolua_get_SMilitary_unsigned_lineupCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lineupCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineupCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_lineupCount
static int tolua_set_SMilitary_unsigned_lineupCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineupCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lineupCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineups of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_lineups
static int tolua_get_tqAllTolua_SMilitary_lineups(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_LINEUP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->lineups[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineups of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_lineups
static int tolua_set_tqAllTolua_SMilitary_lineups(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_LINEUP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->lineups[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: defaultTeams of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_defaultTeams
static int tolua_get_tqAllTolua_SMilitary_defaultTeams(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_DEFAULTTEAM_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->defaultTeams[tolua_index],"SDefaultTeam");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: defaultTeams of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_defaultTeams
static int tolua_set_tqAllTolua_SMilitary_defaultTeams(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_DEFAULTTEAM_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->defaultTeams[tolua_index] = *((SDefaultTeam*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayFightTimes of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_todayFightTimes
static int tolua_get_SMilitary_todayFightTimes(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayFightTimes'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->todayFightTimes,"STodayFightTimes");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayFightTimes of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_todayFightTimes
static int tolua_set_SMilitary_todayFightTimes(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayFightTimes'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"STodayFightTimes",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayFightTimes = *((STodayFightTimes*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: selfArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_selfArmyCount
static int tolua_get_SMilitary_unsigned_selfArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'selfArmyCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->selfArmyCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: selfArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_selfArmyCount
static int tolua_set_SMilitary_unsigned_selfArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'selfArmyCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->selfArmyCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: selfArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_selfArmyIds
static int tolua_get_tqAllTolua_SMilitary_selfArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SELFARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->selfArmyIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: selfArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_selfArmyIds
static int tolua_set_tqAllTolua_SMilitary_selfArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SELFARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->selfArmyIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: enemyArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_enemyArmyCount
static int tolua_get_SMilitary_unsigned_enemyArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyArmyCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->enemyArmyCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: enemyArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_enemyArmyCount
static int tolua_set_SMilitary_unsigned_enemyArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyArmyCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->enemyArmyCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: enemyArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_enemyArmyIds
static int tolua_get_tqAllTolua_SMilitary_enemyArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ENEMYARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->enemyArmyIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: enemyArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_enemyArmyIds
static int tolua_set_tqAllTolua_SMilitary_enemyArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ENEMYARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->enemyArmyIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: alliArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_alliArmyCount
static int tolua_get_SMilitary_unsigned_alliArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'alliArmyCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->alliArmyCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: alliArmyCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_alliArmyCount
static int tolua_set_SMilitary_unsigned_alliArmyCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'alliArmyCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->alliArmyCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: alliArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_alliArmyIds
static int tolua_get_tqAllTolua_SMilitary_alliArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ALLIARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->alliArmyIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: alliArmyIds of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_alliArmyIds
static int tolua_set_tqAllTolua_SMilitary_alliArmyIds(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ALLIARMY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->alliArmyIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: defArmy of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_defArmy
static int tolua_get_SMilitary_defArmy(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'defArmy'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->defArmy,"SDefArmy");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: defArmy of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_defArmy
static int tolua_set_SMilitary_defArmy(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'defArmy'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SDefArmy",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->defArmy = *((SDefArmy*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: towerArmy of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_towerArmy
static int tolua_get_SMilitary_towerArmy(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerArmy'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->towerArmy,"STowerArmy");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: towerArmy of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_towerArmy
static int tolua_set_SMilitary_towerArmy(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerArmy'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"STowerArmy",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->towerArmy = *((STowerArmy*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: succCopyFieldCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_unsigned_succCopyFieldCount
static int tolua_get_SMilitary_unsigned_succCopyFieldCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'succCopyFieldCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->succCopyFieldCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: succCopyFieldCount of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_unsigned_succCopyFieldCount
static int tolua_set_SMilitary_unsigned_succCopyFieldCount(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'succCopyFieldCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->succCopyFieldCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: succCopyFields of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMilitary_succCopyFields
static int tolua_get_tqAllTolua_SMilitary_succCopyFields(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUCC_COPYFIELD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->succCopyFields[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: succCopyFields of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMilitary_succCopyFields
static int tolua_set_tqAllTolua_SMilitary_succCopyFields(lua_State* tolua_S)
{
 int tolua_index;
  SMilitary* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMilitary*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUCC_COPYFIELD_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->succCopyFields[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayHonor of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_get_SMilitary_todayHonor
static int tolua_get_SMilitary_todayHonor(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayHonor'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->todayHonor,"SFightTodayHonor");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayHonor of class  SMilitary */
#ifndef TOLUA_DISABLE_tolua_set_SMilitary_todayHonor
static int tolua_set_SMilitary_todayHonor(lua_State* tolua_S)
{
  SMilitary* self = (SMilitary*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayHonor'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SFightTodayHonor",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayHonor = *((SFightTodayHonor*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: allianceId of class  SInviteJoinAlliance */
#ifndef TOLUA_DISABLE_tolua_get_SInviteJoinAlliance_unsigned_allianceId
static int tolua_get_SInviteJoinAlliance_unsigned_allianceId(lua_State* tolua_S)
{
  SInviteJoinAlliance* self = (SInviteJoinAlliance*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allianceId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->allianceId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: allianceId of class  SInviteJoinAlliance */
#ifndef TOLUA_DISABLE_tolua_set_SInviteJoinAlliance_unsigned_allianceId
static int tolua_set_SInviteJoinAlliance_unsigned_allianceId(lua_State* tolua_S)
{
  SInviteJoinAlliance* self = (SInviteJoinAlliance*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allianceId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->allianceId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleId of class  SInviteJoinAlliance */
#ifndef TOLUA_DISABLE_tolua_get_SInviteJoinAlliance_unsigned_roleId
static int tolua_get_SInviteJoinAlliance_unsigned_roleId(lua_State* tolua_S)
{
  SInviteJoinAlliance* self = (SInviteJoinAlliance*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->roleId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleId of class  SInviteJoinAlliance */
#ifndef TOLUA_DISABLE_tolua_set_SInviteJoinAlliance_unsigned_roleId
static int tolua_set_SInviteJoinAlliance_unsigned_roleId(lua_State* tolua_S)
{
  SInviteJoinAlliance* self = (SInviteJoinAlliance*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->roleId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_STradingArea_unsigned_stopTime
static int tolua_get_STradingArea_unsigned_stopTime(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_STradingArea_unsigned_stopTime
static int tolua_set_STradingArea_unsigned_stopTime(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_STradingArea_count
static int tolua_get_STradingArea_count(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_STradingArea_count
static int tolua_set_STradingArea_count(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleIds of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_STradingArea_roleIds
static int tolua_get_tqAllTolua_STradingArea_roleIds(lua_State* tolua_S)
{
 int tolua_index;
  STradingArea* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STradingArea*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TRADING_ROLES_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->roleIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleIds of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_STradingArea_roleIds
static int tolua_set_tqAllTolua_STradingArea_roleIds(lua_State* tolua_S)
{
 int tolua_index;
  STradingArea* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (STradingArea*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TRADING_ROLES_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->roleIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayTimes of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_STradingArea_todayTimes
static int tolua_get_STradingArea_todayTimes(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayTimes of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_STradingArea_todayTimes
static int tolua_set_STradingArea_todayTimes(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayTimes = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshTime of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_STradingArea_unsigned_refreshTime
static int tolua_get_STradingArea_unsigned_refreshTime(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshTime of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_STradingArea_unsigned_refreshTime
static int tolua_set_STradingArea_unsigned_refreshTime(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curTimes of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_get_STradingArea_unsigned_curTimes
static int tolua_get_STradingArea_unsigned_curTimes(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->curTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curTimes of class  STradingArea */
#ifndef TOLUA_DISABLE_tolua_set_STradingArea_unsigned_curTimes
static int tolua_set_STradingArea_unsigned_curTimes(lua_State* tolua_S)
{
  STradingArea* self = (STradingArea*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curTimes = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayEnterTimes of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_todayEnterTimes
static int tolua_get_SActTower_unsigned_todayEnterTimes(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayEnterTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayEnterTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayEnterTimes of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_todayEnterTimes
static int tolua_set_SActTower_unsigned_todayEnterTimes(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayEnterTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayEnterTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayRefreshTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_todayRefreshTime
static int tolua_get_SActTower_unsigned_todayRefreshTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayRefreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayRefreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayRefreshTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_todayRefreshTime
static int tolua_set_SActTower_unsigned_todayRefreshTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayRefreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayRefreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: maxLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_maxLayer
static int tolua_get_SActTower_unsigned_maxLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxLayer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->maxLayer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: maxLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_maxLayer
static int tolua_set_SActTower_unsigned_maxLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxLayer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->maxLayer = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: leftLifes of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_leftLifes
static int tolua_get_SActTower_unsigned_leftLifes(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'leftLifes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->leftLifes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: leftLifes of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_leftLifes
static int tolua_set_SActTower_unsigned_leftLifes(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'leftLifes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->leftLifes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_stopTime
static int tolua_get_SActTower_unsigned_stopTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_stopTime
static int tolua_set_SActTower_unsigned_stopTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_curLayer
static int tolua_get_SActTower_unsigned_curLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curLayer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->curLayer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_curLayer
static int tolua_set_SActTower_unsigned_curLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curLayer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curLayer = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: maxTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_maxTime
static int tolua_get_SActTower_unsigned_maxTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->maxTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: maxTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_maxTime
static int tolua_set_SActTower_unsigned_maxTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->maxTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: autoStartTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_autoStartTime
static int tolua_get_SActTower_unsigned_autoStartTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoStartTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->autoStartTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: autoStartTime of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_autoStartTime
static int tolua_set_SActTower_unsigned_autoStartTime(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoStartTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->autoStartTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: autoToLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_get_SActTower_unsigned_autoToLayer
static int tolua_get_SActTower_unsigned_autoToLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoToLayer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->autoToLayer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: autoToLayer of class  SActTower */
#ifndef TOLUA_DISABLE_tolua_set_SActTower_unsigned_autoToLayer
static int tolua_set_SActTower_unsigned_autoToLayer(lua_State* tolua_S)
{
  SActTower* self = (SActTower*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoToLayer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->autoToLayer = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gateId of class  SActTerraceGate */
#ifndef TOLUA_DISABLE_tolua_get_SActTerraceGate_unsigned_gateId
static int tolua_get_SActTerraceGate_unsigned_gateId(lua_State* tolua_S)
{
  SActTerraceGate* self = (SActTerraceGate*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gateId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gateId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gateId of class  SActTerraceGate */
#ifndef TOLUA_DISABLE_tolua_set_SActTerraceGate_unsigned_gateId
static int tolua_set_SActTerraceGate_unsigned_gateId(lua_State* tolua_S)
{
  SActTerraceGate* self = (SActTerraceGate*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gateId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gateId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: subGateId of class  SActTerraceGate */
#ifndef TOLUA_DISABLE_tolua_get_SActTerraceGate_unsigned_subGateId
static int tolua_get_SActTerraceGate_unsigned_subGateId(lua_State* tolua_S)
{
  SActTerraceGate* self = (SActTerraceGate*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'subGateId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->subGateId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: subGateId of class  SActTerraceGate */
#ifndef TOLUA_DISABLE_tolua_set_SActTerraceGate_unsigned_subGateId
static int tolua_set_SActTerraceGate_unsigned_subGateId(lua_State* tolua_S)
{
  SActTerraceGate* self = (SActTerraceGate*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'subGateId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->subGateId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayEnterTimes of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_todayEnterTimes
static int tolua_get_SActTerrace_unsigned_todayEnterTimes(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayEnterTimes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayEnterTimes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayEnterTimes of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_todayEnterTimes
static int tolua_set_SActTerrace_unsigned_todayEnterTimes(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayEnterTimes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayEnterTimes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: todayRefreshTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_todayRefreshTime
static int tolua_get_SActTerrace_unsigned_todayRefreshTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayRefreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->todayRefreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: todayRefreshTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_todayRefreshTime
static int tolua_set_SActTerrace_unsigned_todayRefreshTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'todayRefreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->todayRefreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: maxGate of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_maxGate
static int tolua_get_SActTerrace_maxGate(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxGate'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->maxGate,"SActTerraceGate");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: maxGate of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_maxGate
static int tolua_set_SActTerrace_maxGate(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'maxGate'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SActTerraceGate",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->maxGate = *((SActTerraceGate*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: leftLifes of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_leftLifes
static int tolua_get_SActTerrace_unsigned_leftLifes(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'leftLifes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->leftLifes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: leftLifes of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_leftLifes
static int tolua_set_SActTerrace_unsigned_leftLifes(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'leftLifes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->leftLifes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stopTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_stopTime
static int tolua_get_SActTerrace_unsigned_stopTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stopTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_stopTime
static int tolua_set_SActTerrace_unsigned_stopTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curGate of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_curGate
static int tolua_get_SActTerrace_curGate(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curGate'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->curGate,"SActTerraceGate");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curGate of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_curGate
static int tolua_set_SActTerrace_curGate(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curGate'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SActTerraceGate",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curGate = *((SActTerraceGate*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: countResults of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_countResults
static int tolua_get_SActTerrace_countResults(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'countResults'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->countResults);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: countResults of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_countResults
static int tolua_set_SActTerrace_countResults(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'countResults'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->countResults = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: results of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SActTerrace_results
static int tolua_get_tqAllTolua_SActTerrace_results(lua_State* tolua_S)
{
 int tolua_index;
  SActTerrace* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActTerrace*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACT_TERRACE_COUNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->results[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: results of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SActTerrace_results
static int tolua_set_tqAllTolua_SActTerrace_results(lua_State* tolua_S)
{
 int tolua_index;
  SActTerrace* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SActTerrace*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ACT_TERRACE_COUNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->results[tolua_index] = (( unsigned char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: autoStartTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_autoStartTime
static int tolua_get_SActTerrace_unsigned_autoStartTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoStartTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->autoStartTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: autoStartTime of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_autoStartTime
static int tolua_set_SActTerrace_unsigned_autoStartTime(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoStartTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->autoStartTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: autoToSubGateId of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_get_SActTerrace_unsigned_autoToSubGateId
static int tolua_get_SActTerrace_unsigned_autoToSubGateId(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoToSubGateId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->autoToSubGateId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: autoToSubGateId of class  SActTerrace */
#ifndef TOLUA_DISABLE_tolua_set_SActTerrace_unsigned_autoToSubGateId
static int tolua_set_SActTerrace_unsigned_autoToSubGateId(lua_State* tolua_S)
{
  SActTerrace* self = (SActTerrace*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'autoToSubGateId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->autoToSubGateId = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: type of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_get_SForceLineupCfg_unsigned_type
static int tolua_get_SForceLineupCfg_unsigned_type(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->type);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: type of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_set_SForceLineupCfg_unsigned_type
static int tolua_set_SForceLineupCfg_unsigned_type(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->type = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lineup of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_get_SForceLineupCfg_unsigned_lineup
static int tolua_get_SForceLineupCfg_unsigned_lineup(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineup'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lineup);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lineup of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_set_SForceLineupCfg_unsigned_lineup
static int tolua_set_SForceLineupCfg_unsigned_lineup(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lineup'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lineup = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: heroCount of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_get_SForceLineupCfg_heroCount
static int tolua_get_SForceLineupCfg_heroCount(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'heroCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->heroCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: heroCount of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_set_SForceLineupCfg_heroCount
static int tolua_set_SForceLineupCfg_heroCount(lua_State* tolua_S)
{
  SForceLineupCfg* self = (SForceLineupCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'heroCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->heroCount = ((  char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: heroIds of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SForceLineupCfg_heroIds
static int tolua_get_tqAllTolua_SForceLineupCfg_heroIds(lua_State* tolua_S)
{
 int tolua_index;
  SForceLineupCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SForceLineupCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->heroIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: heroIds of class  SForceLineupCfg */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SForceLineupCfg_heroIds
static int tolua_set_tqAllTolua_SForceLineupCfg_heroIds(lua_State* tolua_S)
{
 int tolua_index;
  SForceLineupCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SForceLineupCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_TEAM_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->heroIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SHelpTip */
#ifndef TOLUA_DISABLE_tolua_get_SHelpTip_unsigned_id
static int tolua_get_SHelpTip_unsigned_id(lua_State* tolua_S)
{
  SHelpTip* self = (SHelpTip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SHelpTip */
#ifndef TOLUA_DISABLE_tolua_set_SHelpTip_unsigned_id
static int tolua_set_SHelpTip_unsigned_id(lua_State* tolua_S)
{
  SHelpTip* self = (SHelpTip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: times of class  SHelpTip */
#ifndef TOLUA_DISABLE_tolua_get_SHelpTip_unsigned_times
static int tolua_get_SHelpTip_unsigned_times(lua_State* tolua_S)
{
  SHelpTip* self = (SHelpTip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->times);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: times of class  SHelpTip */
#ifndef TOLUA_DISABLE_tolua_set_SHelpTip_unsigned_times
static int tolua_set_SHelpTip_unsigned_times(lua_State* tolua_S)
{
  SHelpTip* self = (SHelpTip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'times'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->times = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: forceCount of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_SPlayerClientCfg_forceCount
static int tolua_get_SPlayerClientCfg_forceCount(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'forceCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->forceCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: forceCount of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_SPlayerClientCfg_forceCount
static int tolua_set_SPlayerClientCfg_forceCount(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'forceCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->forceCount = ((  char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: forces of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SPlayerClientCfg_forces
static int tolua_get_tqAllTolua_SPlayerClientCfg_forces(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FORCELINEUPCFG_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->forces[tolua_index],"SForceLineupCfg");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: forces of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SPlayerClientCfg_forces
static int tolua_set_tqAllTolua_SPlayerClientCfg_forces(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FORCELINEUPCFG_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->forces[tolua_index] = *((SForceLineupCfg*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: toggleMap of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SPlayerClientCfg_toggleMap
static int tolua_get_tqAllTolua_SPlayerClientCfg_toggleMap(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CTLCFG_BTIMAP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->toggleMap[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: toggleMap of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SPlayerClientCfg_toggleMap
static int tolua_set_tqAllTolua_SPlayerClientCfg_toggleMap(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CTLCFG_BTIMAP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->toggleMap[tolua_index] = (( unsigned char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gonggaoVer of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_SPlayerClientCfg_gonggaoVer
static int tolua_get_SPlayerClientCfg_gonggaoVer(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gonggaoVer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gonggaoVer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gonggaoVer of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_SPlayerClientCfg_gonggaoVer
static int tolua_set_SPlayerClientCfg_gonggaoVer(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gonggaoVer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gonggaoVer = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: helpTipCount of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_SPlayerClientCfg_helpTipCount
static int tolua_get_SPlayerClientCfg_helpTipCount(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'helpTipCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->helpTipCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: helpTipCount of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_SPlayerClientCfg_helpTipCount
static int tolua_set_SPlayerClientCfg_helpTipCount(lua_State* tolua_S)
{
  SPlayerClientCfg* self = (SPlayerClientCfg*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'helpTipCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->helpTipCount = ((  short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: helpTips of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SPlayerClientCfg_helpTips
static int tolua_get_tqAllTolua_SPlayerClientCfg_helpTips(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HELPTIP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->helpTips[tolua_index],"SHelpTip");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: helpTips of class  SPlayerClientCfg */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SPlayerClientCfg_helpTips
static int tolua_set_tqAllTolua_SPlayerClientCfg_helpTips(lua_State* tolua_S)
{
 int tolua_index;
  SPlayerClientCfg* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SPlayerClientCfg*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HELPTIP_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->helpTips[tolua_index] = *((SHelpTip*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: resId of class  SBuyLimitItem */
#ifndef TOLUA_DISABLE_tolua_get_SBuyLimitItem_unsigned_resId
static int tolua_get_SBuyLimitItem_unsigned_resId(lua_State* tolua_S)
{
  SBuyLimitItem* self = (SBuyLimitItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->resId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: resId of class  SBuyLimitItem */
#ifndef TOLUA_DISABLE_tolua_set_SBuyLimitItem_unsigned_resId
static int tolua_set_SBuyLimitItem_unsigned_resId(lua_State* tolua_S)
{
  SBuyLimitItem* self = (SBuyLimitItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->resId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: number of class  SBuyLimitItem */
#ifndef TOLUA_DISABLE_tolua_get_SBuyLimitItem_unsigned_number
static int tolua_get_SBuyLimitItem_unsigned_number(lua_State* tolua_S)
{
  SBuyLimitItem* self = (SBuyLimitItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->number);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: number of class  SBuyLimitItem */
#ifndef TOLUA_DISABLE_tolua_set_SBuyLimitItem_unsigned_number
static int tolua_set_SBuyLimitItem_unsigned_number(lua_State* tolua_S)
{
  SBuyLimitItem* self = (SBuyLimitItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->number = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: level of class  SVip */
#ifndef TOLUA_DISABLE_tolua_get_SVip_unsigned_level
static int tolua_get_SVip_unsigned_level(lua_State* tolua_S)
{
  SVip* self = (SVip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: level of class  SVip */
#ifndef TOLUA_DISABLE_tolua_set_SVip_unsigned_level
static int tolua_set_SVip_unsigned_level(lua_State* tolua_S)
{
  SVip* self = (SVip*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SCDKey */
#ifndef TOLUA_DISABLE_tolua_get_SCDKey_count
static int tolua_get_SCDKey_count(lua_State* tolua_S)
{
  SCDKey* self = (SCDKey*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SCDKey */
#ifndef TOLUA_DISABLE_tolua_set_SCDKey_count
static int tolua_set_SCDKey_count(lua_State* tolua_S)
{
  SCDKey* self = (SCDKey*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: types of class  SCDKey */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCDKey_types
static int tolua_get_tqAllTolua_SCDKey_types(lua_State* tolua_S)
{
 int tolua_index;
  SCDKey* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCDKey*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CDKEY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->types[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: types of class  SCDKey */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCDKey_types
static int tolua_set_tqAllTolua_SCDKey_types(lua_State* tolua_S)
{
 int tolua_index;
  SCDKey* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCDKey*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CDKEY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->types[tolua_index] = ((  short)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: clientCfg of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_clientCfg
static int tolua_get_SMiscs_clientCfg(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'clientCfg'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->clientCfg,"SPlayerClientCfg");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: clientCfg of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_clientCfg
static int tolua_set_SMiscs_clientCfg(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'clientCfg'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SPlayerClientCfg",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->clientCfg = *((SPlayerClientCfg*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: applyAlliance of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_applyAlliance
static int tolua_get_SMiscs_applyAlliance(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'applyAlliance'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->applyAlliance);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: applyAlliance of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_applyAlliance
static int tolua_set_SMiscs_applyAlliance(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'applyAlliance'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->applyAlliance,(const char*)tolua_tostring(tolua_S,2,0),MAX_ALLINAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: inviteJoinAllianceCount of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_unsigned_inviteJoinAllianceCount
static int tolua_get_SMiscs_unsigned_inviteJoinAllianceCount(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'inviteJoinAllianceCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->inviteJoinAllianceCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: inviteJoinAllianceCount of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_unsigned_inviteJoinAllianceCount
static int tolua_set_SMiscs_unsigned_inviteJoinAllianceCount(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'inviteJoinAllianceCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->inviteJoinAllianceCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: inviteJoinAlliances of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMiscs_inviteJoinAlliances
static int tolua_get_tqAllTolua_SMiscs_inviteJoinAlliances(lua_State* tolua_S)
{
 int tolua_index;
  SMiscs* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMiscs*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_INVITE_JOIN_ALLI_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->inviteJoinAlliances[tolua_index],"SInviteJoinAlliance");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: inviteJoinAlliances of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMiscs_inviteJoinAlliances
static int tolua_set_tqAllTolua_SMiscs_inviteJoinAlliances(lua_State* tolua_S)
{
 int tolua_index;
  SMiscs* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMiscs*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_INVITE_JOIN_ALLI_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->inviteJoinAlliances[tolua_index] = *((SInviteJoinAlliance*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: trading of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_trading
static int tolua_get_SMiscs_trading(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'trading'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->trading,"STradingArea");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: trading of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_trading
static int tolua_set_SMiscs_trading(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'trading'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"STradingArea",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->trading = *((STradingArea*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actTower of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_actTower
static int tolua_get_SMiscs_actTower(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTower'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->actTower,"SActTower");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actTower of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_actTower
static int tolua_set_SMiscs_actTower(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTower'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SActTower",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->actTower = *((SActTower*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actTerrace of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_actTerrace
static int tolua_get_SMiscs_actTerrace(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTerrace'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->actTerrace,"SActTerrace");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actTerrace of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_actTerrace
static int tolua_set_SMiscs_actTerrace(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actTerrace'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SActTerrace",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->actTerrace = *((SActTerrace*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buyLimitTime of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_unsigned_buyLimitTime
static int tolua_get_SMiscs_unsigned_buyLimitTime(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buyLimitTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buyLimitTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buyLimitTime of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_unsigned_buyLimitTime
static int tolua_set_SMiscs_unsigned_buyLimitTime(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buyLimitTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buyLimitTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buyLimitCount of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_buyLimitCount
static int tolua_get_SMiscs_buyLimitCount(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buyLimitCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buyLimitCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buyLimitCount of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_buyLimitCount
static int tolua_set_SMiscs_buyLimitCount(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buyLimitCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buyLimitCount = ((  int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buyLimitItems of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SMiscs_buyLimitItems
static int tolua_get_tqAllTolua_SMiscs_buyLimitItems(lua_State* tolua_S)
{
 int tolua_index;
  SMiscs* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMiscs*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUY_ITEMS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->buyLimitItems[tolua_index],"SBuyLimitItem");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buyLimitItems of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SMiscs_buyLimitItems
static int tolua_set_tqAllTolua_SMiscs_buyLimitItems(lua_State* tolua_S)
{
 int tolua_index;
  SMiscs* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SMiscs*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUY_ITEMS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->buyLimitItems[tolua_index] = *((SBuyLimitItem*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: vip of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_vip
static int tolua_get_SMiscs_vip(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'vip'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->vip,"SVip");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: vip of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_vip
static int tolua_set_SMiscs_vip(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'vip'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SVip",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->vip = *((SVip*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cdkey of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_get_SMiscs_cdkey
static int tolua_get_SMiscs_cdkey(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cdkey'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->cdkey,"SCDKey");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cdkey of class  SMiscs */
#ifndef TOLUA_DISABLE_tolua_set_SMiscs_cdkey
static int tolua_set_SMiscs_cdkey(lua_State* tolua_S)
{
  SMiscs* self = (SMiscs*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cdkey'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCDKey",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cdkey = *((SCDKey*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SSoldierList */
#ifndef TOLUA_DISABLE_tolua_get_SSoldierList_unsigned_count
static int tolua_get_SSoldierList_unsigned_count(lua_State* tolua_S)
{
  SSoldierList* self = (SSoldierList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SSoldierList */
#ifndef TOLUA_DISABLE_tolua_set_SSoldierList_unsigned_count
static int tolua_set_SSoldierList_unsigned_count(lua_State* tolua_S)
{
  SSoldierList* self = (SSoldierList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: soldiers of class  SSoldierList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SSoldierList_soldiers
static int tolua_get_tqAllTolua_SSoldierList_soldiers(lua_State* tolua_S)
{
 int tolua_index;
  SSoldierList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSoldierList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SLDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->soldiers[tolua_index],"SSoldier");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: soldiers of class  SSoldierList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SSoldierList_soldiers
static int tolua_set_tqAllTolua_SSoldierList_soldiers(lua_State* tolua_S)
{
 int tolua_index;
  SSoldierList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSoldierList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SLDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->soldiers[tolua_index] = *((SSoldier*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SCarrySoldier */
#ifndef TOLUA_DISABLE_tolua_get_SCarrySoldier_unsigned_ulResId
static int tolua_get_SCarrySoldier_unsigned_ulResId(lua_State* tolua_S)
{
  SCarrySoldier* self = (SCarrySoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SCarrySoldier */
#ifndef TOLUA_DISABLE_tolua_set_SCarrySoldier_unsigned_ulResId
static int tolua_set_SCarrySoldier_unsigned_ulResId(lua_State* tolua_S)
{
  SCarrySoldier* self = (SCarrySoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulNumber of class  SCarrySoldier */
#ifndef TOLUA_DISABLE_tolua_get_SCarrySoldier_unsigned_ulNumber
static int tolua_get_SCarrySoldier_unsigned_ulNumber(lua_State* tolua_S)
{
  SCarrySoldier* self = (SCarrySoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNumber'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulNumber);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulNumber of class  SCarrySoldier */
#ifndef TOLUA_DISABLE_tolua_set_SCarrySoldier_unsigned_ulNumber
static int tolua_set_SCarrySoldier_unsigned_ulNumber(lua_State* tolua_S)
{
  SCarrySoldier* self = (SCarrySoldier*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNumber'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulNumber = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SCarrySoldierList */
#ifndef TOLUA_DISABLE_tolua_get_SCarrySoldierList_unsigned_ucCount
static int tolua_get_SCarrySoldierList_unsigned_ucCount(lua_State* tolua_S)
{
  SCarrySoldierList* self = (SCarrySoldierList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SCarrySoldierList */
#ifndef TOLUA_DISABLE_tolua_set_SCarrySoldierList_unsigned_ucCount
static int tolua_set_SCarrySoldierList_unsigned_ucCount(lua_State* tolua_S)
{
  SCarrySoldierList* self = (SCarrySoldierList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astSoldiers of class  SCarrySoldierList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCarrySoldierList_astSoldiers
static int tolua_get_tqAllTolua_SCarrySoldierList_astSoldiers(lua_State* tolua_S)
{
 int tolua_index;
  SCarrySoldierList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCarrySoldierList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SLDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astSoldiers[tolua_index],"SCarrySoldier");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astSoldiers of class  SCarrySoldierList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCarrySoldierList_astSoldiers
static int tolua_set_tqAllTolua_SCarrySoldierList_astSoldiers(lua_State* tolua_S)
{
 int tolua_index;
  SCarrySoldierList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCarrySoldierList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SLDS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astSoldiers[tolua_index] = *((SCarrySoldier*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SHeroAttrList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroAttrList_unsigned_ucCount
static int tolua_get_SHeroAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SHeroAttrList* self = (SHeroAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SHeroAttrList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroAttrList_unsigned_ucCount
static int tolua_set_SHeroAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SHeroAttrList* self = (SHeroAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astAttrs of class  SHeroAttrList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SHeroAttrList_astAttrs
static int tolua_get_tqAllTolua_SHeroAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SHeroAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astAttrs[tolua_index],"SAttr");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astAttrs of class  SHeroAttrList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SHeroAttrList_astAttrs
static int tolua_set_tqAllTolua_SHeroAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SHeroAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astAttrs[tolua_index] = *((SAttr*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SItemAttrList */
#ifndef TOLUA_DISABLE_tolua_get_SItemAttrList_unsigned_ucCount
static int tolua_get_SItemAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SItemAttrList* self = (SItemAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SItemAttrList */
#ifndef TOLUA_DISABLE_tolua_set_SItemAttrList_unsigned_ucCount
static int tolua_set_SItemAttrList_unsigned_ucCount(lua_State* tolua_S)
{
  SItemAttrList* self = (SItemAttrList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astAttrs of class  SItemAttrList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SItemAttrList_astAttrs
static int tolua_get_tqAllTolua_SItemAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SItemAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEM_ATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astAttrs[tolua_index],"SAttr");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astAttrs of class  SItemAttrList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SItemAttrList_astAttrs
static int tolua_set_tqAllTolua_SItemAttrList_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SItemAttrList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemAttrList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEM_ATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astAttrs[tolua_index] = *((SAttr*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SGemBesetList */
#ifndef TOLUA_DISABLE_tolua_get_SGemBesetList_unsigned_ucCount
static int tolua_get_SGemBesetList_unsigned_ucCount(lua_State* tolua_S)
{
  SGemBesetList* self = (SGemBesetList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SGemBesetList */
#ifndef TOLUA_DISABLE_tolua_set_SGemBesetList_unsigned_ucCount
static int tolua_set_SGemBesetList_unsigned_ucCount(lua_State* tolua_S)
{
  SGemBesetList* self = (SGemBesetList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: aulGems of class  SGemBesetList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SGemBesetList_aulGems
static int tolua_get_tqAllTolua_SGemBesetList_aulGems(lua_State* tolua_S)
{
 int tolua_index;
  SGemBesetList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SGemBesetList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_GEMBESET_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->aulGems[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: aulGems of class  SGemBesetList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SGemBesetList_aulGems
static int tolua_set_tqAllTolua_SGemBesetList_aulGems(lua_State* tolua_S)
{
 int tolua_index;
  SGemBesetList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SGemBesetList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_GEMBESET_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->aulGems[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullId of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_unsigned_ullId
static int tolua_get_SItem_unsigned_ullId(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullId of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_unsigned_ullId
static int tolua_set_SItem_unsigned_ullId(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucType of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_unsigned_ucType
static int tolua_get_SItem_unsigned_ucType(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucType of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_unsigned_ucType
static int tolua_set_SItem_unsigned_ucType(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucType = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_unsigned_ulResId
static int tolua_get_SItem_unsigned_ulResId(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_unsigned_ulResId
static int tolua_set_SItem_unsigned_ulResId(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: usNumber of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_unsigned_usNumber
static int tolua_get_SItem_unsigned_usNumber(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usNumber'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->usNumber);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: usNumber of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_unsigned_usNumber
static int tolua_set_SItem_unsigned_usNumber(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usNumber'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->usNumber = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucForceLevel of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_unsigned_ucForceLevel
static int tolua_get_SItem_unsigned_ucForceLevel(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucForceLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucForceLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucForceLevel of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_unsigned_ucForceLevel
static int tolua_set_SItem_unsigned_ucForceLevel(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucForceLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucForceLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stAttrs of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_stAttrs
static int tolua_get_SItem_stAttrs(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stAttrs,"SItemAttrList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stAttrs of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_stAttrs
static int tolua_set_SItem_stAttrs(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SItemAttrList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stAttrs = *((SItemAttrList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stGems of class  SItem */
#ifndef TOLUA_DISABLE_tolua_get_SItem_stGems
static int tolua_get_SItem_stGems(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stGems'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stGems,"SGemBesetList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stGems of class  SItem */
#ifndef TOLUA_DISABLE_tolua_set_SItem_stGems
static int tolua_set_SItem_stGems(lua_State* tolua_S)
{
  SItem* self = (SItem*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stGems'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SGemBesetList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stGems = *((SGemBesetList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SItemAttrListEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemAttrListEx_unsigned_count
static int tolua_get_SItemAttrListEx_unsigned_count(lua_State* tolua_S)
{
  SItemAttrListEx* self = (SItemAttrListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SItemAttrListEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemAttrListEx_unsigned_count
static int tolua_set_SItemAttrListEx_unsigned_count(lua_State* tolua_S)
{
  SItemAttrListEx* self = (SItemAttrListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: attrs of class  SItemAttrListEx */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SItemAttrListEx_attrs
static int tolua_get_tqAllTolua_SItemAttrListEx_attrs(lua_State* tolua_S)
{
 int tolua_index;
  SItemAttrListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemAttrListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEM_ATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->attrs[tolua_index],"SAttrEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: attrs of class  SItemAttrListEx */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SItemAttrListEx_attrs
static int tolua_set_tqAllTolua_SItemAttrListEx_attrs(lua_State* tolua_S)
{
 int tolua_index;
  SItemAttrListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemAttrListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEM_ATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->attrs[tolua_index] = *((SAttrEx*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SGemBesetListEx */
#ifndef TOLUA_DISABLE_tolua_get_SGemBesetListEx_unsigned_count
static int tolua_get_SGemBesetListEx_unsigned_count(lua_State* tolua_S)
{
  SGemBesetListEx* self = (SGemBesetListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SGemBesetListEx */
#ifndef TOLUA_DISABLE_tolua_set_SGemBesetListEx_unsigned_count
static int tolua_set_SGemBesetListEx_unsigned_count(lua_State* tolua_S)
{
  SGemBesetListEx* self = (SGemBesetListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gems of class  SGemBesetListEx */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SGemBesetListEx_gems
static int tolua_get_tqAllTolua_SGemBesetListEx_gems(lua_State* tolua_S)
{
 int tolua_index;
  SGemBesetListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SGemBesetListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_GEMBESET_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->gems[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gems of class  SGemBesetListEx */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SGemBesetListEx_gems
static int tolua_set_tqAllTolua_SGemBesetListEx_gems(lua_State* tolua_S)
{
 int tolua_index;
  SGemBesetListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SGemBesetListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_GEMBESET_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->gems[tolua_index] = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_id
static int tolua_get_SItemEx_unsigned_id(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_id
static int tolua_set_SItemEx_unsigned_id(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: type of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_type
static int tolua_get_SItemEx_unsigned_type(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->type);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: type of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_type
static int tolua_set_SItemEx_unsigned_type(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'type'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->type = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isRaw of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_isRaw
static int tolua_get_SItemEx_unsigned_isRaw(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isRaw'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isRaw);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isRaw of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_isRaw
static int tolua_set_SItemEx_unsigned_isRaw(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isRaw'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isRaw = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: isBind of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_isBind
static int tolua_get_SItemEx_unsigned_isBind(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isBind'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->isBind);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: isBind of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_isBind
static int tolua_set_SItemEx_unsigned_isBind(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'isBind'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->isBind = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: resId of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_resId
static int tolua_get_SItemEx_unsigned_resId(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->resId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: resId of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_resId
static int tolua_set_SItemEx_unsigned_resId(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->resId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: number of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_number
static int tolua_get_SItemEx_unsigned_number(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->number);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: number of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_number
static int tolua_set_SItemEx_unsigned_number(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'number'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->number = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: forceLevel of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_unsigned_forceLevel
static int tolua_get_SItemEx_unsigned_forceLevel(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'forceLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->forceLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: forceLevel of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_unsigned_forceLevel
static int tolua_set_SItemEx_unsigned_forceLevel(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'forceLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->forceLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: attrs of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_attrs
static int tolua_get_SItemEx_attrs(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attrs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->attrs,"SItemAttrListEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: attrs of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_attrs
static int tolua_set_SItemEx_attrs(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'attrs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SItemAttrListEx",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->attrs = *((SItemAttrListEx*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gems of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemEx_gems
static int tolua_get_SItemEx_gems(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gems'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->gems,"SGemBesetListEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gems of class  SItemEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemEx_gems
static int tolua_set_SItemEx_gems(lua_State* tolua_S)
{
  SItemEx* self = (SItemEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gems'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SGemBesetListEx",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gems = *((SGemBesetListEx*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: armPos of class  SWear */
#ifndef TOLUA_DISABLE_tolua_get_SWear_unsigned_armPos
static int tolua_get_SWear_unsigned_armPos(lua_State* tolua_S)
{
  SWear* self = (SWear*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'armPos'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->armPos);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: armPos of class  SWear */
#ifndef TOLUA_DISABLE_tolua_set_SWear_unsigned_armPos
static int tolua_set_SWear_unsigned_armPos(lua_State* tolua_S)
{
  SWear* self = (SWear*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'armPos'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->armPos = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: arm of class  SWear */
#ifndef TOLUA_DISABLE_tolua_get_SWear_arm
static int tolua_get_SWear_arm(lua_State* tolua_S)
{
  SWear* self = (SWear*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'arm'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->arm,"SItemEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: arm of class  SWear */
#ifndef TOLUA_DISABLE_tolua_set_SWear_arm
static int tolua_set_SWear_arm(lua_State* tolua_S)
{
  SWear* self = (SWear*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'arm'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SItemEx",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->arm = *((SItemEx*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SWearList */
#ifndef TOLUA_DISABLE_tolua_get_SWearList_unsigned_count
static int tolua_get_SWearList_unsigned_count(lua_State* tolua_S)
{
  SWearList* self = (SWearList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SWearList */
#ifndef TOLUA_DISABLE_tolua_set_SWearList_unsigned_count
static int tolua_set_SWearList_unsigned_count(lua_State* tolua_S)
{
  SWearList* self = (SWearList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: wears of class  SWearList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SWearList_wears
static int tolua_get_tqAllTolua_SWearList_wears(lua_State* tolua_S)
{
 int tolua_index;
  SWearList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SWearList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HEROWEAR_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->wears[tolua_index],"SWear");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: wears of class  SWearList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SWearList_wears
static int tolua_set_tqAllTolua_SWearList_wears(lua_State* tolua_S)
{
 int tolua_index;
  SWearList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SWearList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HEROWEAR_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->wears[tolua_index] = *((SWear*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SItemListEx */
#ifndef TOLUA_DISABLE_tolua_get_SItemListEx_unsigned_count
static int tolua_get_SItemListEx_unsigned_count(lua_State* tolua_S)
{
  SItemListEx* self = (SItemListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SItemListEx */
#ifndef TOLUA_DISABLE_tolua_set_SItemListEx_unsigned_count
static int tolua_set_SItemListEx_unsigned_count(lua_State* tolua_S)
{
  SItemListEx* self = (SItemListEx*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: items of class  SItemListEx */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SItemListEx_items
static int tolua_get_tqAllTolua_SItemListEx_items(lua_State* tolua_S)
{
 int tolua_index;
  SItemListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEMS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->items[tolua_index],"SItemEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: items of class  SItemListEx */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SItemListEx_items
static int tolua_set_tqAllTolua_SItemListEx_items(lua_State* tolua_S)
{
 int tolua_index;
  SItemListEx* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SItemListEx*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_ITEMS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->items[tolua_index] = *((SItemEx*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulGiftGold of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_get_SAllItems_unsigned_ulGiftGold
static int tolua_get_SAllItems_unsigned_ulGiftGold(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulGiftGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulGiftGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulGiftGold of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_set_SAllItems_unsigned_ulGiftGold
static int tolua_set_SAllItems_unsigned_ulGiftGold(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulGiftGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulGiftGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulGold of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_get_SAllItems_unsigned_ulGold
static int tolua_get_SAllItems_unsigned_ulGold(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulGold of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_set_SAllItems_unsigned_ulGold
static int tolua_set_SAllItems_unsigned_ulGold(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: usGridMaxCnt of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_get_SAllItems_unsigned_usGridMaxCnt
static int tolua_get_SAllItems_unsigned_usGridMaxCnt(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usGridMaxCnt'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->usGridMaxCnt);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: usGridMaxCnt of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_set_SAllItems_unsigned_usGridMaxCnt
static int tolua_set_SAllItems_unsigned_usGridMaxCnt(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'usGridMaxCnt'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->usGridMaxCnt = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stItems of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_get_SAllItems_stItems
static int tolua_get_SAllItems_stItems(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stItems'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stItems,"SItemListEx");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stItems of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_set_SAllItems_stItems
static int tolua_set_SAllItems_stItems(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stItems'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SItemListEx",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stItems = *((SItemListEx*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastSalveTime of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_get_SAllItems_unsigned_lastSalveTime
static int tolua_get_SAllItems_unsigned_lastSalveTime(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastSalveTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastSalveTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastSalveTime of class  SAllItems */
#ifndef TOLUA_DISABLE_tolua_set_SAllItems_unsigned_lastSalveTime
static int tolua_set_SAllItems_unsigned_lastSalveTime(lua_State* tolua_S)
{
  SAllItems* self = (SAllItems*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastSalveTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastSalveTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_get_SSkill_unsigned_ulResId
static int tolua_get_SSkill_unsigned_ulResId(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_set_SSkill_unsigned_ulResId
static int tolua_set_SSkill_unsigned_ulResId(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_get_SSkill_unsigned_ucLevel
static int tolua_get_SSkill_unsigned_ucLevel(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_set_SSkill_unsigned_ucLevel
static int tolua_set_SSkill_unsigned_ucLevel(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulDex of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_get_SSkill_unsigned_ulDex
static int tolua_get_SSkill_unsigned_ulDex(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDex'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulDex);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulDex of class  SSkill */
#ifndef TOLUA_DISABLE_tolua_set_SSkill_unsigned_ulDex
static int tolua_set_SSkill_unsigned_ulDex(lua_State* tolua_S)
{
  SSkill* self = (SSkill*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDex'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulDex = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SSkillList */
#ifndef TOLUA_DISABLE_tolua_get_SSkillList_unsigned_ucCount
static int tolua_get_SSkillList_unsigned_ucCount(lua_State* tolua_S)
{
  SSkillList* self = (SSkillList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SSkillList */
#ifndef TOLUA_DISABLE_tolua_set_SSkillList_unsigned_ucCount
static int tolua_set_SSkillList_unsigned_ucCount(lua_State* tolua_S)
{
  SSkillList* self = (SSkillList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astSkills of class  SSkillList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SSkillList_astSkills
static int tolua_get_tqAllTolua_SSkillList_astSkills(lua_State* tolua_S)
{
 int tolua_index;
  SSkillList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSkillList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_SKILL_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astSkills[tolua_index],"SSkill");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astSkills of class  SSkillList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SSkillList_astSkills
static int tolua_set_tqAllTolua_SSkillList_astSkills(lua_State* tolua_S)
{
 int tolua_index;
  SSkillList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSkillList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_SKILL_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astSkills[tolua_index] = *((SSkill*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCutPos of class  SSCut */
#ifndef TOLUA_DISABLE_tolua_get_SSCut_unsigned_ucCutPos
static int tolua_get_SSCut_unsigned_ucCutPos(lua_State* tolua_S)
{
  SSCut* self = (SSCut*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCutPos'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCutPos);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCutPos of class  SSCut */
#ifndef TOLUA_DISABLE_tolua_set_SSCut_unsigned_ucCutPos
static int tolua_set_SSCut_unsigned_ucCutPos(lua_State* tolua_S)
{
  SSCut* self = (SSCut*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCutPos'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCutPos = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SSCut */
#ifndef TOLUA_DISABLE_tolua_get_SSCut_unsigned_ulResId
static int tolua_get_SSCut_unsigned_ulResId(lua_State* tolua_S)
{
  SSCut* self = (SSCut*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SSCut */
#ifndef TOLUA_DISABLE_tolua_set_SSCut_unsigned_ulResId
static int tolua_set_SSCut_unsigned_ulResId(lua_State* tolua_S)
{
  SSCut* self = (SSCut*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SSCutList */
#ifndef TOLUA_DISABLE_tolua_get_SSCutList_unsigned_ucCount
static int tolua_get_SSCutList_unsigned_ucCount(lua_State* tolua_S)
{
  SSCutList* self = (SSCutList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SSCutList */
#ifndef TOLUA_DISABLE_tolua_set_SSCutList_unsigned_ucCount
static int tolua_set_SSCutList_unsigned_ucCount(lua_State* tolua_S)
{
  SSCutList* self = (SSCutList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astSCuts of class  SSCutList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SSCutList_astSCuts
static int tolua_get_tqAllTolua_SSCutList_astSCuts(lua_State* tolua_S)
{
 int tolua_index;
  SSCutList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSCutList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_SCUT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astSCuts[tolua_index],"SSCut");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astSCuts of class  SSCutList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SSCutList_astSCuts
static int tolua_set_tqAllTolua_SSCutList_astSCuts(lua_State* tolua_S)
{
 int tolua_index;
  SSCutList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SSCutList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_SCUT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astSCuts[tolua_index] = *((SSCut*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucSteelType of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ucSteelType
static int tolua_get_OSHeroSteel_unsigned_ucSteelType(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSteelType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucSteelType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucSteelType of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ucSteelType
static int tolua_set_OSHeroSteel_unsigned_ucSteelType(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSteelType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucSteelType = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulStartTime of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ulStartTime
static int tolua_get_OSHeroSteel_unsigned_ulStartTime(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStartTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulStartTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulStartTime of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ulStartTime
static int tolua_set_OSHeroSteel_unsigned_ulStartTime(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStartTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulStartTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulLastTime of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ulLastTime
static int tolua_get_OSHeroSteel_unsigned_ulLastTime(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulLastTime of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ulLastTime
static int tolua_set_OSHeroSteel_unsigned_ulLastTime(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucHours of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ucHours
static int tolua_get_OSHeroSteel_unsigned_ucHours(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucHours'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucHours);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucHours of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ucHours
static int tolua_set_OSHeroSteel_unsigned_ucHours(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucHours'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucHours = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullExp of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ullExp
static int tolua_get_OSHeroSteel_unsigned_ullExp(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullExp'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullExp);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullExp of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ullExp
static int tolua_set_OSHeroSteel_unsigned_ullExp(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullExp'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullExp = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulTakeGold of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_OSHeroSteel_unsigned_ulTakeGold
static int tolua_get_OSHeroSteel_unsigned_ulTakeGold(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulTakeGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulTakeGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulTakeGold of class  OSHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_OSHeroSteel_unsigned_ulTakeGold
static int tolua_set_OSHeroSteel_unsigned_ulTakeGold(lua_State* tolua_S)
{
  OSHeroSteel* self = (OSHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulTakeGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulTakeGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: steelType of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_steelType
static int tolua_get_SHeroSteel_unsigned_steelType(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'steelType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->steelType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: steelType of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_steelType
static int tolua_set_SHeroSteel_unsigned_steelType(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'steelType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->steelType = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: startTime of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_startTime
static int tolua_get_SHeroSteel_unsigned_startTime(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->startTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: startTime of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_startTime
static int tolua_set_SHeroSteel_unsigned_startTime(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'startTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->startTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: quarters of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_quarters
static int tolua_get_SHeroSteel_unsigned_quarters(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarters'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->quarters);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: quarters of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_quarters
static int tolua_set_SHeroSteel_unsigned_quarters(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarters'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->quarters = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: quarterRes of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_quarterRes
static int tolua_get_SHeroSteel_unsigned_quarterRes(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarterRes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->quarterRes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: quarterRes of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_quarterRes
static int tolua_set_SHeroSteel_unsigned_quarterRes(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarterRes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->quarterRes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: quarterMoney of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_quarterMoney
static int tolua_get_SHeroSteel_unsigned_quarterMoney(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarterMoney'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->quarterMoney);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: quarterMoney of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_quarterMoney
static int tolua_set_SHeroSteel_unsigned_quarterMoney(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'quarterMoney'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->quarterMoney = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: hourGold of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_hourGold
static int tolua_get_SHeroSteel_unsigned_hourGold(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hourGold'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->hourGold);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: hourGold of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_hourGold
static int tolua_set_SHeroSteel_unsigned_hourGold(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hourGold'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->hourGold = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: actMult of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_get_SHeroSteel_unsigned_actMult
static int tolua_get_SHeroSteel_unsigned_actMult(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actMult'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->actMult);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: actMult of class  SHeroSteel */
#ifndef TOLUA_DISABLE_tolua_set_SHeroSteel_unsigned_actMult
static int tolua_set_SHeroSteel_unsigned_actMult(lua_State* tolua_S)
{
  SHeroSteel* self = (SHeroSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'actMult'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->actMult = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ullId
static int tolua_get_SOHero_unsigned_ullId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ullId
static int tolua_set_SOHero_unsigned_ullId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ulResId
static int tolua_get_SOHero_unsigned_ulResId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ulResId
static int tolua_set_SOHero_unsigned_ulResId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szName of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_szName
static int tolua_get_SOHero_szName(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szName of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_szName
static int tolua_set_SOHero_szName(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szName,(const char*)tolua_tostring(tolua_S,2,0),MAX_HERONAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ucLevel
static int tolua_get_SOHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ucLevel
static int tolua_set_SOHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulExp of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ulExp
static int tolua_get_SOHero_unsigned_ulExp(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulExp'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulExp);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulExp of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ulExp
static int tolua_set_SOHero_unsigned_ulExp(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulExp'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulExp = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucState of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ucState
static int tolua_get_SOHero_unsigned_ucState(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucState of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ucState
static int tolua_set_SOHero_unsigned_ucState(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ulCityId
static int tolua_get_SOHero_unsigned_ulCityId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityId of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ulCityId
static int tolua_set_SOHero_unsigned_ulCityId(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityPosX of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ulCityPosX
static int tolua_get_SOHero_unsigned_ulCityPosX(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityPosX'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityPosX);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityPosX of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ulCityPosX
static int tolua_set_SOHero_unsigned_ulCityPosX(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityPosX'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityPosX = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCityPosY of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_unsigned_ulCityPosY
static int tolua_get_SOHero_unsigned_ulCityPosY(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityPosY'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCityPosY);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCityPosY of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_unsigned_ulCityPosY
static int tolua_set_SOHero_unsigned_ulCityPosY(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCityPosY'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCityPosY = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: aucSubjects of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SOHero_aucSubjects
static int tolua_get_tqAllTolua_SOHero_aucSubjects(lua_State* tolua_S)
{
 int tolua_index;
  SOHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SOHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUBJECT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->aucSubjects[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: aucSubjects of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SOHero_aucSubjects
static int tolua_set_tqAllTolua_SOHero_aucSubjects(lua_State* tolua_S)
{
 int tolua_index;
  SOHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SOHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUBJECT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->aucSubjects[tolua_index] = (( unsigned char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSoldiers of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stSoldiers
static int tolua_get_SOHero_stSoldiers(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSoldiers'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSoldiers,"SCarrySoldierList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSoldiers of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stSoldiers
static int tolua_set_SOHero_stSoldiers(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSoldiers'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCarrySoldierList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSoldiers = *((SCarrySoldierList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stAttrs of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stAttrs
static int tolua_get_SOHero_stAttrs(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stAttrs,"SHeroAttrList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stAttrs of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stAttrs
static int tolua_set_SOHero_stAttrs(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SHeroAttrList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stAttrs = *((SHeroAttrList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stWears of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stWears
static int tolua_get_SOHero_stWears(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stWears'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stWears,"SWearList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stWears of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stWears
static int tolua_set_SOHero_stWears(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stWears'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SWearList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stWears = *((SWearList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSkills of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stSkills
static int tolua_get_SOHero_stSkills(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkills'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSkills,"SSkillList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSkills of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stSkills
static int tolua_set_SOHero_stSkills(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkills'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSkillList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSkills = *((SSkillList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSCuts of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stSCuts
static int tolua_get_SOHero_stSCuts(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSCuts'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSCuts,"SSCutList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSCuts of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stSCuts
static int tolua_set_SOHero_stSCuts(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSCuts'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSCutList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSCuts = *((SSCutList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSteel of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_get_SOHero_stSteel
static int tolua_get_SOHero_stSteel(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSteel'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSteel,"SHeroSteel");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSteel of class  SOHero */
#ifndef TOLUA_DISABLE_tolua_set_SOHero_stSteel
static int tolua_set_SOHero_stSteel(lua_State* tolua_S)
{
  SOHero* self = (SOHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSteel'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SHeroSteel",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSteel = *((SHeroSteel*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_get_SSkillSteel_unsigned_ulResId
static int tolua_get_SSkillSteel_unsigned_ulResId(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_set_SSkillSteel_unsigned_ulResId
static int tolua_set_SSkillSteel_unsigned_ulResId(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulStoptime of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_get_SSkillSteel_unsigned_ulStoptime
static int tolua_get_SSkillSteel_unsigned_ulStoptime(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStoptime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulStoptime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulStoptime of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_set_SSkillSteel_unsigned_ulStoptime
static int tolua_set_SSkillSteel_unsigned_ulStoptime(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStoptime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulStoptime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulDurtime of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_get_SSkillSteel_unsigned_ulDurtime
static int tolua_get_SSkillSteel_unsigned_ulDurtime(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDurtime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulDurtime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulDurtime of class  SSkillSteel */
#ifndef TOLUA_DISABLE_tolua_set_SSkillSteel_unsigned_ulDurtime
static int tolua_set_SSkillSteel_unsigned_ulDurtime(lua_State* tolua_S)
{
  SSkillSteel* self = (SSkillSteel*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulDurtime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulDurtime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullId of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ullId
static int tolua_get_SHero_unsigned_ullId(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullId of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ullId
static int tolua_set_SHero_unsigned_ullId(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucProf of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucProf
static int tolua_get_SHero_unsigned_ucProf(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucProf'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucProf);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucProf of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucProf
static int tolua_set_SHero_unsigned_ucProf(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucProf'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucProf = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szName of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_szName
static int tolua_get_SHero_szName(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szName of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_szName
static int tolua_set_SHero_szName(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szName,(const char*)tolua_tostring(tolua_S,2,0),MAX_HERONAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucLevel
static int tolua_get_SHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucLevel
static int tolua_set_SHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucSkeletonLevel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucSkeletonLevel
static int tolua_get_SHero_unsigned_ucSkeletonLevel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSkeletonLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucSkeletonLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucSkeletonLevel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucSkeletonLevel
static int tolua_set_SHero_unsigned_ucSkeletonLevel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSkeletonLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucSkeletonLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulSSteelStopTime of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ulSSteelStopTime
static int tolua_get_SHero_unsigned_ulSSteelStopTime(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulSSteelStopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulSSteelStopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulSSteelStopTime of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ulSSteelStopTime
static int tolua_set_SHero_unsigned_ulSSteelStopTime(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulSSteelStopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulSSteelStopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulIcon of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ulIcon
static int tolua_get_SHero_unsigned_ulIcon(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIcon'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulIcon);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulIcon of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ulIcon
static int tolua_set_SHero_unsigned_ulIcon(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIcon'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulIcon = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucSex of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucSex
static int tolua_get_SHero_unsigned_ucSex(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucSex);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucSex of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucSex
static int tolua_set_SHero_unsigned_ucSex(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucSex = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucState of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucState
static int tolua_get_SHero_unsigned_ucState(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucState of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucState
static int tolua_set_SHero_unsigned_ucState(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucOfficial of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucOfficial
static int tolua_get_SHero_unsigned_ucOfficial(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucOfficial'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucOfficial);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucOfficial of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucOfficial
static int tolua_set_SHero_unsigned_ucOfficial(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucOfficial'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucOfficial = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLockState of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ucLockState
static int tolua_get_SHero_unsigned_ucLockState(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLockState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLockState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLockState of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ucLockState
static int tolua_set_SHero_unsigned_ucLockState(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLockState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLockState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulUnlockTime of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ulUnlockTime
static int tolua_get_SHero_unsigned_ulUnlockTime(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulUnlockTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulUnlockTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulUnlockTime of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ulUnlockTime
static int tolua_set_SHero_unsigned_ulUnlockTime(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulUnlockTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulUnlockTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: aucSubjects of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SHero_aucSubjects
static int tolua_get_tqAllTolua_SHero_aucSubjects(lua_State* tolua_S)
{
 int tolua_index;
  SHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUBJECT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->aucSubjects[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: aucSubjects of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SHero_aucSubjects
static int tolua_set_tqAllTolua_SHero_aucSubjects(lua_State* tolua_S)
{
 int tolua_index;
  SHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_SUBJECT_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->aucSubjects[tolua_index] = (( unsigned char)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stAttrs of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stAttrs
static int tolua_get_SHero_stAttrs(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stAttrs,"SHeroAttrList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stAttrs of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stAttrs
static int tolua_set_SHero_stAttrs(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stAttrs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SHeroAttrList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stAttrs = *((SHeroAttrList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSoldier of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stSoldier
static int tolua_get_SHero_stSoldier(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSoldier'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSoldier,"SSoldier");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSoldier of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stSoldier
static int tolua_set_SHero_stSoldier(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSoldier'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSoldier",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSoldier = *((SSoldier*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stWears of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stWears
static int tolua_get_SHero_stWears(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stWears'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stWears,"SWearList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stWears of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stWears
static int tolua_set_SHero_stWears(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stWears'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SWearList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stWears = *((SWearList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSkills of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stSkills
static int tolua_get_SHero_stSkills(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkills'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSkills,"SSkillList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSkills of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stSkills
static int tolua_set_SHero_stSkills(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkills'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSkillList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSkills = *((SSkillList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCurTacticSkill of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_unsigned_ulCurTacticSkill
static int tolua_get_SHero_unsigned_ulCurTacticSkill(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCurTacticSkill'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCurTacticSkill);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCurTacticSkill of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_unsigned_ulCurTacticSkill
static int tolua_set_SHero_unsigned_ulCurTacticSkill(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCurTacticSkill'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCurTacticSkill = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSteel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stSteel
static int tolua_get_SHero_stSteel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSteel'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSteel,"SHeroSteel");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSteel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stSteel
static int tolua_set_SHero_stSteel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSteel'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SHeroSteel",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSteel = *((SHeroSteel*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stSkillSteel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_get_SHero_stSkillSteel
static int tolua_get_SHero_stSkillSteel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkillSteel'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stSkillSteel,"SSkillSteel");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stSkillSteel of class  SHero */
#ifndef TOLUA_DISABLE_tolua_set_SHero_stSkillSteel
static int tolua_set_SHero_stSkillSteel(lua_State* tolua_S)
{
  SHero* self = (SHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stSkillSteel'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSkillSteel",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stSkillSteel = *((SSkillSteel*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulId of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ulId
static int tolua_get_SNewHero_unsigned_ulId(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulId of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ulId
static int tolua_set_SNewHero_unsigned_ulId(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucProf of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ucProf
static int tolua_get_SNewHero_unsigned_ucProf(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucProf'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucProf);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucProf of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ucProf
static int tolua_set_SNewHero_unsigned_ucProf(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucProf'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucProf = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szName of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_szName
static int tolua_get_SNewHero_szName(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szName of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_szName
static int tolua_set_SNewHero_szName(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szName,(const char*)tolua_tostring(tolua_S,2,0),MAX_HERONAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ucLevel
static int tolua_get_SNewHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ucLevel
static int tolua_set_SNewHero_unsigned_ucLevel(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulIcon of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ulIcon
static int tolua_get_SNewHero_unsigned_ulIcon(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIcon'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulIcon);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulIcon of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ulIcon
static int tolua_set_SNewHero_unsigned_ulIcon(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulIcon'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulIcon = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucSex of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ucSex
static int tolua_get_SNewHero_unsigned_ucSex(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucSex);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucSex of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ucSex
static int tolua_set_SNewHero_unsigned_ucSex(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucSex = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucAttrCount of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_SNewHero_unsigned_ucAttrCount
static int tolua_get_SNewHero_unsigned_ucAttrCount(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucAttrCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucAttrCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucAttrCount of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_SNewHero_unsigned_ucAttrCount
static int tolua_set_SNewHero_unsigned_ucAttrCount(lua_State* tolua_S)
{
  SNewHero* self = (SNewHero*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucAttrCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucAttrCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astAttrs of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SNewHero_astAttrs
static int tolua_get_tqAllTolua_SNewHero_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SNewHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SNewHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_NEWHEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astAttrs[tolua_index],"SAttr");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astAttrs of class  SNewHero */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SNewHero_astAttrs
static int tolua_set_tqAllTolua_SNewHero_astAttrs(lua_State* tolua_S)
{
 int tolua_index;
  SNewHero* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SNewHero*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_NEWHEROATTRS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astAttrs[tolua_index] = *((SAttr*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulHeroAttrLastTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroList_unsigned_ulHeroAttrLastTime
static int tolua_get_SHeroList_unsigned_ulHeroAttrLastTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulHeroAttrLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulHeroAttrLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulHeroAttrLastTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroList_unsigned_ulHeroAttrLastTime
static int tolua_set_SHeroList_unsigned_ulHeroAttrLastTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulHeroAttrLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulHeroAttrLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroList_unsigned_ucCount
static int tolua_get_SHeroList_unsigned_ucCount(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroList_unsigned_ucCount
static int tolua_set_SHeroList_unsigned_ucCount(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astHeros of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SHeroList_astHeros
static int tolua_get_tqAllTolua_SHeroList_astHeros(lua_State* tolua_S)
{
 int tolua_index;
  SHeroList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astHeros[tolua_index],"SHero");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astHeros of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SHeroList_astHeros
static int tolua_set_tqAllTolua_SHeroList_astHeros(lua_State* tolua_S)
{
 int tolua_index;
  SHeroList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_HERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astHeros[tolua_index] = *((SHero*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulCanUseSSTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroList_unsigned_ulCanUseSSTime
static int tolua_get_SHeroList_unsigned_ulCanUseSSTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCanUseSSTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulCanUseSSTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulCanUseSSTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroList_unsigned_ulCanUseSSTime
static int tolua_set_SHeroList_unsigned_ulCanUseSSTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulCanUseSSTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulCanUseSSTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulNewHeroLastTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroList_unsigned_ulNewHeroLastTime
static int tolua_get_SHeroList_unsigned_ulNewHeroLastTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNewHeroLastTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulNewHeroLastTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulNewHeroLastTime of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroList_unsigned_ulNewHeroLastTime
static int tolua_set_SHeroList_unsigned_ulNewHeroLastTime(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulNewHeroLastTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulNewHeroLastTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucNewCount of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_SHeroList_unsigned_ucNewCount
static int tolua_get_SHeroList_unsigned_ucNewCount(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucNewCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucNewCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucNewCount of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_SHeroList_unsigned_ucNewCount
static int tolua_set_SHeroList_unsigned_ucNewCount(lua_State* tolua_S)
{
  SHeroList* self = (SHeroList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucNewCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucNewCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astNewHeros of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SHeroList_astNewHeros
static int tolua_get_tqAllTolua_SHeroList_astNewHeros(lua_State* tolua_S)
{
 int tolua_index;
  SHeroList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_NEWHERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astNewHeros[tolua_index],"SNewHero");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astNewHeros of class  SHeroList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SHeroList_astNewHeros
static int tolua_set_tqAllTolua_SHeroList_astNewHeros(lua_State* tolua_S)
{
 int tolua_index;
  SHeroList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SHeroList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_NEWHERO_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astNewHeros[tolua_index] = *((SNewHero*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SBulletinList */
#ifndef TOLUA_DISABLE_tolua_get_SBulletinList_unsigned_ucCount
static int tolua_get_SBulletinList_unsigned_ucCount(lua_State* tolua_S)
{
  SBulletinList* self = (SBulletinList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SBulletinList */
#ifndef TOLUA_DISABLE_tolua_set_SBulletinList_unsigned_ucCount
static int tolua_set_SBulletinList_unsigned_ucCount(lua_State* tolua_S)
{
  SBulletinList* self = (SBulletinList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astBulletins of class  SBulletinList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SBulletinList_astBulletins
static int tolua_get_tqAllTolua_SBulletinList_astBulletins(lua_State* tolua_S)
{
 int tolua_index;
  SBulletinList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBulletinList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BULLETINS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astBulletins[tolua_index],"SBulletin");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astBulletins of class  SBulletinList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SBulletinList_astBulletins
static int tolua_set_tqAllTolua_SBulletinList_astBulletins(lua_State* tolua_S)
{
 int tolua_index;
  SBulletinList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBulletinList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BULLETINS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astBulletins[tolua_index] = *((SBulletin*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: flag of class  SBuddy */
#ifndef TOLUA_DISABLE_tolua_get_SBuddy_unsigned_flag
static int tolua_get_SBuddy_unsigned_flag(lua_State* tolua_S)
{
  SBuddy* self = (SBuddy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'flag'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->flag);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: flag of class  SBuddy */
#ifndef TOLUA_DISABLE_tolua_set_SBuddy_unsigned_flag
static int tolua_set_SBuddy_unsigned_flag(lua_State* tolua_S)
{
  SBuddy* self = (SBuddy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'flag'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->flag = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleId of class  SBuddy */
#ifndef TOLUA_DISABLE_tolua_get_SBuddy_unsigned_roleId
static int tolua_get_SBuddy_unsigned_roleId(lua_State* tolua_S)
{
  SBuddy* self = (SBuddy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->roleId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleId of class  SBuddy */
#ifndef TOLUA_DISABLE_tolua_set_SBuddy_unsigned_roleId
static int tolua_set_SBuddy_unsigned_roleId(lua_State* tolua_S)
{
  SBuddy* self = (SBuddy*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->roleId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_get_SBuddyList_unsigned_count
static int tolua_get_SBuddyList_unsigned_count(lua_State* tolua_S)
{
  SBuddyList* self = (SBuddyList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_set_SBuddyList_unsigned_count
static int tolua_set_SBuddyList_unsigned_count(lua_State* tolua_S)
{
  SBuddyList* self = (SBuddyList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buddys of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SBuddyList_buddys
static int tolua_get_tqAllTolua_SBuddyList_buddys(lua_State* tolua_S)
{
 int tolua_index;
  SBuddyList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBuddyList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUDDYS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->buddys[tolua_index],"SBuddy");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buddys of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SBuddyList_buddys
static int tolua_set_tqAllTolua_SBuddyList_buddys(lua_State* tolua_S)
{
 int tolua_index;
  SBuddyList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBuddyList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUDDYS_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->buddys[tolua_index] = *((SBuddy*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: applyCount of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_get_SBuddyList_unsigned_applyCount
static int tolua_get_SBuddyList_unsigned_applyCount(lua_State* tolua_S)
{
  SBuddyList* self = (SBuddyList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'applyCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->applyCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: applyCount of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_set_SBuddyList_unsigned_applyCount
static int tolua_set_SBuddyList_unsigned_applyCount(lua_State* tolua_S)
{
  SBuddyList* self = (SBuddyList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'applyCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->applyCount = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: applyRoleIds of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SBuddyList_applyRoleIds
static int tolua_get_tqAllTolua_SBuddyList_applyRoleIds(lua_State* tolua_S)
{
 int tolua_index;
  SBuddyList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBuddyList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUDDYS_APPLY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->applyRoleIds[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: applyRoleIds of class  SBuddyList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SBuddyList_applyRoleIds
static int tolua_set_tqAllTolua_SBuddyList_applyRoleIds(lua_State* tolua_S)
{
 int tolua_index;
  SBuddyList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SBuddyList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_BUDDYS_APPLY_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->applyRoleIds[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulId
static int tolua_get_SFarm_unsigned_ulId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulId
static int tolua_set_SFarm_unsigned_ulId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulResId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulResId
static int tolua_get_SFarm_unsigned_ulResId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulResId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulResId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulResId
static int tolua_set_SFarm_unsigned_ulResId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulResId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulResId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLevel of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ucLevel
static int tolua_get_SFarm_unsigned_ucLevel(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLevel of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ucLevel
static int tolua_set_SFarm_unsigned_ucLevel(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucState of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ucState
static int tolua_get_SFarm_unsigned_ucState(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucState);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucState of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ucState
static int tolua_set_SFarm_unsigned_ucState(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucState'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucState = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulStartTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulStartTime
static int tolua_get_SFarm_unsigned_ulStartTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStartTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulStartTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulStartTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulStartTime
static int tolua_set_SFarm_unsigned_ulStartTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStartTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulStartTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulStopTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulStopTime
static int tolua_get_SFarm_unsigned_ulStopTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulStopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulStopTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulStopTime
static int tolua_set_SFarm_unsigned_ulStopTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulStopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulStopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulTotalRes of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulTotalRes
static int tolua_get_SFarm_unsigned_ulTotalRes(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulTotalRes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulTotalRes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulTotalRes of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulTotalRes
static int tolua_set_SFarm_unsigned_ulTotalRes(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulTotalRes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulTotalRes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulLeftRes of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_ulLeftRes
static int tolua_get_SFarm_unsigned_ulLeftRes(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLeftRes'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulLeftRes);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulLeftRes of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_ulLeftRes
static int tolua_set_SFarm_unsigned_ulLeftRes(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLeftRes'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulLeftRes = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: collectorCount of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_collectorCount
static int tolua_get_SFarm_unsigned_collectorCount(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'collectorCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->collectorCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: collectorCount of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_collectorCount
static int tolua_set_SFarm_unsigned_collectorCount(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'collectorCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->collectorCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: collectors of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SFarm_collectors
static int tolua_get_tqAllTolua_SFarm_collectors(lua_State* tolua_S)
{
 int tolua_index;
  SFarm* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarm*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_COLLECTOR_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
 tolua_pushnumber(tolua_S,(lua_Number)self->collectors[tolua_index]);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: collectors of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SFarm_collectors
static int tolua_set_tqAllTolua_SFarm_collectors(lua_State* tolua_S)
{
 int tolua_index;
  SFarm* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarm*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_COLLECTOR_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->collectors[tolua_index] = (( unsigned long long)  tolua_tonumber(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: seqId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_seqId
static int tolua_get_SFarm_unsigned_seqId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'seqId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->seqId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: seqId of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_seqId
static int tolua_set_SFarm_unsigned_seqId(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'seqId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->seqId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: protectStopTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_get_SFarm_unsigned_protectStopTime
static int tolua_get_SFarm_unsigned_protectStopTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'protectStopTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->protectStopTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: protectStopTime of class  SFarm */
#ifndef TOLUA_DISABLE_tolua_set_SFarm_unsigned_protectStopTime
static int tolua_set_SFarm_unsigned_protectStopTime(lua_State* tolua_S)
{
  SFarm* self = (SFarm*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'protectStopTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->protectStopTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucType of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ucType
static int tolua_get_SFarmLog_unsigned_ucType(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucType of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ucType
static int tolua_set_SFarmLog_unsigned_ucType(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucType = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szRName of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_szRName
static int tolua_get_SFarmLog_szRName(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szRName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szRName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szRName of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_szRName
static int tolua_set_SFarmLog_szRName(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szRName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szRName,(const char*)tolua_tostring(tolua_S,2,0),MAX_ROLENAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulLogTime of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ulLogTime
static int tolua_get_SFarmLog_unsigned_ulLogTime(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLogTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulLogTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulLogTime of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ulLogTime
static int tolua_set_SFarmLog_unsigned_ulLogTime(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLogTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulLogTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulParam1 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ulParam1
static int tolua_get_SFarmLog_unsigned_ulParam1(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam1'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulParam1);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulParam1 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ulParam1
static int tolua_set_SFarmLog_unsigned_ulParam1(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam1'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulParam1 = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulParam2 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ulParam2
static int tolua_get_SFarmLog_unsigned_ulParam2(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam2'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulParam2);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulParam2 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ulParam2
static int tolua_set_SFarmLog_unsigned_ulParam2(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam2'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulParam2 = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulParam3 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ulParam3
static int tolua_get_SFarmLog_unsigned_ulParam3(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam3'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulParam3);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulParam3 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ulParam3
static int tolua_set_SFarmLog_unsigned_ulParam3(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam3'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulParam3 = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulParam4 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_get_SFarmLog_unsigned_ulParam4
static int tolua_get_SFarmLog_unsigned_ulParam4(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam4'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulParam4);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulParam4 of class  SFarmLog */
#ifndef TOLUA_DISABLE_tolua_set_SFarmLog_unsigned_ulParam4
static int tolua_set_SFarmLog_unsigned_ulParam4(lua_State* tolua_S)
{
  SFarmLog* self = (SFarmLog*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulParam4'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulParam4 = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucCount of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_SFarmList_unsigned_ucCount
static int tolua_get_SFarmList_unsigned_ucCount(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucCount of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_SFarmList_unsigned_ucCount
static int tolua_set_SFarmList_unsigned_ucCount(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astFarms of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SFarmList_astFarms
static int tolua_get_tqAllTolua_SFarmList_astFarms(lua_State* tolua_S)
{
 int tolua_index;
  SFarmList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarmList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FARM_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astFarms[tolua_index],"SFarm");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astFarms of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SFarmList_astFarms
static int tolua_set_tqAllTolua_SFarmList_astFarms(lua_State* tolua_S)
{
 int tolua_index;
  SFarmList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarmList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FARM_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astFarms[tolua_index] = *((SFarm*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ulLogVer of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_SFarmList_unsigned_ulLogVer
static int tolua_get_SFarmList_unsigned_ulLogVer(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLogVer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ulLogVer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ulLogVer of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_SFarmList_unsigned_ulLogVer
static int tolua_set_SFarmList_unsigned_ulLogVer(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ulLogVer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ulLogVer = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucLogCount of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_SFarmList_unsigned_ucLogCount
static int tolua_get_SFarmList_unsigned_ucLogCount(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLogCount'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucLogCount);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucLogCount of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_SFarmList_unsigned_ucLogCount
static int tolua_set_SFarmList_unsigned_ucLogCount(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucLogCount'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucLogCount = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: astFarmLogs of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SFarmList_astFarmLogs
static int tolua_get_tqAllTolua_SFarmList_astFarmLogs(lua_State* tolua_S)
{
 int tolua_index;
  SFarmList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarmList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FARM_LOG_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->astFarmLogs[tolua_index],"SFarmLog");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: astFarmLogs of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SFarmList_astFarmLogs
static int tolua_set_tqAllTolua_SFarmList_astFarmLogs(lua_State* tolua_S)
{
 int tolua_index;
  SFarmList* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SFarmList*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_FARM_LOG_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->astFarmLogs[tolua_index] = *((SFarmLog*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: farmVer of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_SFarmList_unsigned_farmVer
static int tolua_get_SFarmList_unsigned_farmVer(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'farmVer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->farmVer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: farmVer of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_SFarmList_unsigned_farmVer
static int tolua_set_SFarmList_unsigned_farmVer(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'farmVer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->farmVer = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastSeqId of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_get_SFarmList_unsigned_lastSeqId
static int tolua_get_SFarmList_unsigned_lastSeqId(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastSeqId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastSeqId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastSeqId of class  SFarmList */
#ifndef TOLUA_DISABLE_tolua_set_SFarmList_unsigned_lastSeqId
static int tolua_set_SFarmList_unsigned_lastSeqId(lua_State* tolua_S)
{
  SFarmList* self = (SFarmList*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastSeqId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastSeqId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: level of class  SCulture */
#ifndef TOLUA_DISABLE_tolua_get_SCulture_unsigned_level
static int tolua_get_SCulture_unsigned_level(lua_State* tolua_S)
{
  SCulture* self = (SCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: level of class  SCulture */
#ifndef TOLUA_DISABLE_tolua_set_SCulture_unsigned_level
static int tolua_set_SCulture_unsigned_level(lua_State* tolua_S)
{
  SCulture* self = (SCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SCulture */
#ifndef TOLUA_DISABLE_tolua_get_SCulture_unsigned_id
static int tolua_get_SCulture_unsigned_id(lua_State* tolua_S)
{
  SCulture* self = (SCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SCulture */
#ifndef TOLUA_DISABLE_tolua_set_SCulture_unsigned_id
static int tolua_set_SCulture_unsigned_id(lua_State* tolua_S)
{
  SCulture* self = (SCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: id of class  SLearningCulture */
#ifndef TOLUA_DISABLE_tolua_get_SLearningCulture_unsigned_id
static int tolua_get_SLearningCulture_unsigned_id(lua_State* tolua_S)
{
  SLearningCulture* self = (SLearningCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->id);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: id of class  SLearningCulture */
#ifndef TOLUA_DISABLE_tolua_set_SLearningCulture_unsigned_id
static int tolua_set_SLearningCulture_unsigned_id(lua_State* tolua_S)
{
  SLearningCulture* self = (SLearningCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'id'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->id = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stoptime of class  SLearningCulture */
#ifndef TOLUA_DISABLE_tolua_get_SLearningCulture_unsigned_stoptime
static int tolua_get_SLearningCulture_unsigned_stoptime(lua_State* tolua_S)
{
  SLearningCulture* self = (SLearningCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stoptime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->stoptime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stoptime of class  SLearningCulture */
#ifndef TOLUA_DISABLE_tolua_set_SLearningCulture_unsigned_stoptime
static int tolua_set_SLearningCulture_unsigned_stoptime(lua_State* tolua_S)
{
  SLearningCulture* self = (SLearningCulture*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stoptime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stoptime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: count of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_get_SCultures_unsigned_count
static int tolua_get_SCultures_unsigned_count(lua_State* tolua_S)
{
  SCultures* self = (SCultures*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->count);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: count of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_set_SCultures_unsigned_count
static int tolua_set_SCultures_unsigned_count(lua_State* tolua_S)
{
  SCultures* self = (SCultures*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'count'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->count = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cultures of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_get_tqAllTolua_SCultures_cultures
static int tolua_get_tqAllTolua_SCultures_cultures(lua_State* tolua_S)
{
 int tolua_index;
  SCultures* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCultures*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CULTURE_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  tolua_pushusertype(tolua_S,(void*)&self->cultures[tolua_index],"SCulture");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cultures of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_set_tqAllTolua_SCultures_cultures
static int tolua_set_tqAllTolua_SCultures_cultures(lua_State* tolua_S)
{
 int tolua_index;
  SCultures* self;
 lua_pushstring(tolua_S,".self");
 lua_rawget(tolua_S,1);
 self = (SCultures*)  lua_touserdata(tolua_S,-1);
#ifndef TOLUA_RELEASE
 {
  tolua_Error tolua_err;
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);
 }
#endif
 tolua_index = (int)tolua_tonumber(tolua_S,2,0);
#ifndef TOLUA_RELEASE
 if (tolua_index<0 || tolua_index>=MAX_CULTURE_CNT)
  tolua_error(tolua_S,"array indexing out of range.",NULL);
#endif
  self->cultures[tolua_index] = *((SCulture*)  tolua_tousertype(tolua_S,3,0));
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: learning of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_get_SCultures_learning
static int tolua_get_SCultures_learning(lua_State* tolua_S)
{
  SCultures* self = (SCultures*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'learning'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->learning,"SLearningCulture");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: learning of class  SCultures */
#ifndef TOLUA_DISABLE_tolua_set_SCultures_learning
static int tolua_set_SCultures_learning(lua_State* tolua_S)
{
  SCultures* self = (SCultures*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'learning'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SLearningCulture",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->learning = *((SLearningCulture*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullRoleId of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_unsigned_ullRoleId
static int tolua_get_SDBVar_unsigned_ullRoleId(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullRoleId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullRoleId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullRoleId of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_unsigned_ullRoleId
static int tolua_set_SDBVar_unsigned_ullRoleId(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullRoleId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullRoleId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szUName of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_szUName
static int tolua_get_SDBVar_szUName(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szUName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szUName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szUName of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_szUName
static int tolua_set_SDBVar_szUName(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szUName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szUName,(const char*)tolua_tostring(tolua_S,2,0),MAX_USERNAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: szRName of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_szRName
static int tolua_get_SDBVar_szRName(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szRName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->szRName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: szRName of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_szRName
static int tolua_set_SDBVar_szRName(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'szRName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->szRName,(const char*)tolua_tostring(tolua_S,2,0),MAX_ROLENAME_ARR_LEN);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ucSex of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_unsigned_ucSex
static int tolua_get_SDBVar_unsigned_ucSex(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ucSex);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ucSex of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_unsigned_ucSex
static int tolua_set_SDBVar_unsigned_ucSex(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ucSex'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ucSex = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stFixVar of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stFixVar
static int tolua_get_SDBVar_stFixVar(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stFixVar'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stFixVar,"SFixVar");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stFixVar of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stFixVar
static int tolua_set_SDBVar_stFixVar(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stFixVar'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SFixVar",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stFixVar = *((SFixVar*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stBInfos of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stBInfos
static int tolua_get_SDBVar_stBInfos(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stBInfos'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stBInfos,"SBaseInfo");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stBInfos of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stBInfos
static int tolua_set_SDBVar_stBInfos(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stBInfos'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SBaseInfo",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stBInfos = *((SBaseInfo*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stHeros of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stHeros
static int tolua_get_SDBVar_stHeros(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stHeros'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stHeros,"SHeroList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stHeros of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stHeros
static int tolua_set_SDBVar_stHeros(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stHeros'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SHeroList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stHeros = *((SHeroList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: soldiers of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_soldiers
static int tolua_get_SDBVar_soldiers(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldiers'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->soldiers,"SSoldierList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: soldiers of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_soldiers
static int tolua_set_SDBVar_soldiers(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'soldiers'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SSoldierList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->soldiers = *((SSoldierList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stCitys of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stCitys
static int tolua_get_SDBVar_stCitys(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stCitys'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stCitys,"SCitys");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stCitys of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stCitys
static int tolua_set_SDBVar_stCitys(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stCitys'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCitys",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stCitys = *((SCitys*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stFarms of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stFarms
static int tolua_get_SDBVar_stFarms(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stFarms'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stFarms,"SFarmList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stFarms of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stFarms
static int tolua_set_SDBVar_stFarms(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stFarms'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SFarmList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stFarms = *((SFarmList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cultures of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_cultures
static int tolua_get_SDBVar_cultures(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cultures'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->cultures,"SCultures");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cultures of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_cultures
static int tolua_set_SDBVar_cultures(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cultures'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SCultures",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cultures = *((SCultures*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stItems of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stItems
static int tolua_get_SDBVar_stItems(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stItems'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stItems,"SAllItems");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stItems of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stItems
static int tolua_set_SDBVar_stItems(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stItems'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SAllItems",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stItems = *((SAllItems*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: states of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_states
static int tolua_get_SDBVar_states(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'states'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->states,"SStateList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: states of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_states
static int tolua_set_SDBVar_states(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'states'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SStateList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->states = *((SStateList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: military of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_military
static int tolua_get_SDBVar_military(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'military'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->military,"SMilitary");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: military of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_military
static int tolua_set_SDBVar_military(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'military'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SMilitary",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->military = *((SMilitary*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: tasks of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_tasks
static int tolua_get_SDBVar_tasks(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'tasks'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->tasks,"STaskList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: tasks of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_tasks
static int tolua_set_SDBVar_tasks(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'tasks'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"STaskList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->tasks = *((STaskList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stBulletins of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stBulletins
static int tolua_get_SDBVar_stBulletins(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stBulletins'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stBulletins,"SBulletinList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stBulletins of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stBulletins
static int tolua_set_SDBVar_stBulletins(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stBulletins'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SBulletinList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stBulletins = *((SBulletinList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buddys of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_buddys
static int tolua_get_SDBVar_buddys(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buddys'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->buddys,"SBuddyList");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buddys of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_buddys
static int tolua_set_SDBVar_buddys(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buddys'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SBuddyList",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buddys = *((SBuddyList*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: stMiscs of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_stMiscs
static int tolua_get_SDBVar_stMiscs(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stMiscs'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->stMiscs,"SMiscs");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: stMiscs of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_stMiscs
static int tolua_set_SDBVar_stMiscs(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'stMiscs'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"SMiscs",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->stMiscs = *((SMiscs*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: regTime of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_unsigned_regTime
static int tolua_get_SDBVar_unsigned_regTime(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'regTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->regTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: regTime of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_unsigned_regTime
static int tolua_set_SDBVar_unsigned_regTime(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'regTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->regTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lockToTime of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBVar_unsigned_lockToTime
static int tolua_get_SDBVar_unsigned_lockToTime(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lockToTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lockToTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lockToTime of class  SDBVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBVar_unsigned_lockToTime
static int tolua_set_SDBVar_unsigned_lockToTime(lua_State* tolua_S)
{
  SDBVar* self = (SDBVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lockToTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lockToTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: ullallianceId of class  SDBAlliVar */
#ifndef TOLUA_DISABLE_tolua_get_SDBAlliVar_unsigned_ullallianceId
static int tolua_get_SDBAlliVar_unsigned_ullallianceId(lua_State* tolua_S)
{
  SDBAlliVar* self = (SDBAlliVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullallianceId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->ullallianceId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: ullallianceId of class  SDBAlliVar */
#ifndef TOLUA_DISABLE_tolua_set_SDBAlliVar_unsigned_ullallianceId
static int tolua_set_SDBAlliVar_unsigned_ullallianceId(lua_State* tolua_S)
{
  SDBAlliVar* self = (SDBAlliVar*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'ullallianceId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->ullallianceId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: connid of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_get_ScriptEvent_connid
static int tolua_get_ScriptEvent_connid(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'connid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->connid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: connid of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_set_ScriptEvent_connid
static int tolua_set_ScriptEvent_connid(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'connid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->connid = ((int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: playerid of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_get_ScriptEvent_playerid
static int tolua_get_ScriptEvent_playerid(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'playerid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->playerid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: playerid of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_set_ScriptEvent_playerid
static int tolua_set_ScriptEvent_playerid(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'playerid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->playerid = (( long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: datalen of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_get_ScriptEvent_datalen
static int tolua_get_ScriptEvent_datalen(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'datalen'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->datalen);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: datalen of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_set_ScriptEvent_datalen
static int tolua_set_ScriptEvent_datalen(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'datalen'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->datalen = ((int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: data of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_get_ScriptEvent_data
static int tolua_get_ScriptEvent_data(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'data'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->data);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: data of class  ScriptEvent */
#ifndef TOLUA_DISABLE_tolua_set_ScriptEvent_data
static int tolua_set_ScriptEvent_data(lua_State* tolua_S)
{
  ScriptEvent* self = (ScriptEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'data'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->data = ((char*)  tolua_tostring(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: hdr of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_hdr
static int tolua_get_TimerEvent_hdr(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hdr'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->hdr);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: hdr of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_hdr
static int tolua_set_TimerEvent_hdr(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'hdr'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->hdr = ((int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: connid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_connid
static int tolua_get_TimerEvent_connid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'connid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->connid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: connid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_connid
static int tolua_set_TimerEvent_connid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'connid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->connid = ((int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: playerid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_playerid
static int tolua_get_TimerEvent_playerid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'playerid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->playerid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: playerid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_playerid
static int tolua_set_TimerEvent_playerid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'playerid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->playerid = (( long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: eventid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_unsigned_eventid
static int tolua_get_TimerEvent_unsigned_eventid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventid'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->eventid);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: eventid of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_unsigned_eventid
static int tolua_set_TimerEvent_unsigned_eventid(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'eventid'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->eventid = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: curtimeMs of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_unsigned_curtimeMs
static int tolua_get_TimerEvent_unsigned_curtimeMs(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curtimeMs'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->curtimeMs);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: curtimeMs of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_unsigned_curtimeMs
static int tolua_set_TimerEvent_unsigned_curtimeMs(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'curtimeMs'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->curtimeMs = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: param1 of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_param1
static int tolua_get_TimerEvent_param1(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'param1'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->param1);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: param1 of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_param1
static int tolua_set_TimerEvent_param1(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'param1'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->param1 = (( long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: param2 of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_get_TimerEvent_param2
static int tolua_get_TimerEvent_param2(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'param2'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->param2);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: param2 of class  TimerEvent */
#ifndef TOLUA_DISABLE_tolua_set_TimerEvent_param2
static int tolua_set_TimerEvent_param2(lua_State* tolua_S)
{
  TimerEvent* self = (TimerEvent*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'param2'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->param2 = (( long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* method: MakeNewRoleId of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_MakeNewRoleId00
static int tolua_tqAllTolua_IScriptPub_MakeNewRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const SDBVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const SDBVar* dbvar = ((const SDBVar*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'MakeNewRoleId'", NULL);
#endif
  {
   long long tolua_ret = ( long long)  self->MakeNewRoleId(dbvar);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'MakeNewRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: CreateRole of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_CreateRole00
static int tolua_tqAllTolua_IScriptPub_CreateRole00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const SDBVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const SDBVar* dbvar = ((const SDBVar*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'CreateRole'", NULL);
#endif
  {
   int tolua_ret = (int)  self->CreateRole(dbvar);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'CreateRole'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RoleLogin of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_RoleLogin00
static int tolua_tqAllTolua_IScriptPub_RoleLogin00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SDBVar",0,&tolua_err) ||
     !tolua_isstring(tolua_S,3,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  SDBVar* dbvar = ((SDBVar*)  tolua_tousertype(tolua_S,2,0));
  const char* username = ((const char*)  tolua_tostring(tolua_S,3,0));
  int zoneid = ((int)  tolua_tonumber(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RoleLogin'", NULL);
#endif
  {
   int tolua_ret = (int)  self->RoleLogin(dbvar,username,zoneid);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RoleLogin'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RoleSave of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_RoleSave00
static int tolua_tqAllTolua_IScriptPub_RoleSave00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const SDBVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const SDBVar* dbvar = ((const SDBVar*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RoleSave'", NULL);
#endif
  {
   int tolua_ret = (int)  self->RoleSave(dbvar);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RoleSave'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RoleLogout of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_RoleLogout00
static int tolua_tqAllTolua_IScriptPub_RoleLogout00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const SPlayer",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const SPlayer* lpPlayer = ((const SPlayer*)  tolua_tousertype(tolua_S,2,0));
  int iReason = ((int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RoleLogout'", NULL);
#endif
  {
   self->RoleLogout(lpPlayer,iReason);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RoleLogout'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SendMsg of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_SendMsg00
static int tolua_tqAllTolua_IScriptPub_SendMsg00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isstring(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  long long id = (( long long)  tolua_tonumber(tolua_S,2,0));
  int connid = ((int)  tolua_tonumber(tolua_S,3,0));
  const char* msg = ((const char*)  tolua_tostring(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SendMsg'", NULL);
#endif
  {
   self->SendMsg(id,connid,msg);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SendMsg'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SendMsgNotifyCmd of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_SendMsgNotifyCmd00
static int tolua_tqAllTolua_IScriptPub_SendMsgNotifyCmd00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  long long id = (( long long)  tolua_tonumber(tolua_S,2,0));
  int connid = ((int)  tolua_tonumber(tolua_S,3,0));
  int cmd = ((int)  tolua_tonumber(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SendMsgNotifyCmd'", NULL);
#endif
  {
   self->SendMsgNotifyCmd(id,connid,cmd);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SendMsgNotifyCmd'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SendUseKeyCmd of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_SendUseKeyCmd00
static int tolua_tqAllTolua_IScriptPub_SendUseKeyCmd00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isstring(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  long long id = (( long long)  tolua_tonumber(tolua_S,2,0));
  int connid = ((int)  tolua_tonumber(tolua_S,3,0));
  const char* key = ((const char*)  tolua_tostring(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SendUseKeyCmd'", NULL);
#endif
  {
   self->SendUseKeyCmd(id,connid,key);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SendUseKeyCmd'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: AllocDBVar of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_AllocDBVar00
static int tolua_tqAllTolua_IScriptPub_AllocDBVar00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'AllocDBVar'", NULL);
#endif
  {
   SDBVar* tolua_ret = (SDBVar*)  self->AllocDBVar();
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SDBVar");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'AllocDBVar'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: FreeDBVar of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_FreeDBVar00
static int tolua_tqAllTolua_IScriptPub_FreeDBVar00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SDBVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  SDBVar* dbvar = ((SDBVar*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'FreeDBVar'", NULL);
#endif
  {
   self->FreeDBVar(dbvar);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'FreeDBVar'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: IsExistRoleName of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_IsExistRoleName00
static int tolua_tqAllTolua_IScriptPub_IsExistRoleName00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const char* rolename = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'IsExistRoleName'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->IsExistRoleName(rolename);
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'IsExistRoleName'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: IsExistUserName of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_IsExistUserName00
static int tolua_tqAllTolua_IScriptPub_IsExistUserName00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const char* username = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'IsExistUserName'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->IsExistUserName(username);
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'IsExistUserName'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: InitAlliByUID of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_InitAlliByUID00
static int tolua_tqAllTolua_IScriptPub_InitAlliByUID00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isusertype(tolua_S,3,"SDBAlliVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  long long id = (( long long)  tolua_tonumber(tolua_S,2,0));
  SDBAlliVar* dballivar = ((SDBAlliVar*)  tolua_tousertype(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'InitAlliByUID'", NULL);
#endif
  {
   int tolua_ret = (int)  self->InitAlliByUID(id,dballivar);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'InitAlliByUID'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: AllocDBAlliVar of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_AllocDBAlliVar00
static int tolua_tqAllTolua_IScriptPub_AllocDBAlliVar00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'AllocDBAlliVar'", NULL);
#endif
  {
   SDBAlliVar* tolua_ret = (SDBAlliVar*)  self->AllocDBAlliVar();
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"SDBAlliVar");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'AllocDBAlliVar'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: FreeDBAlliVar of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_FreeDBAlliVar00
static int tolua_tqAllTolua_IScriptPub_FreeDBAlliVar00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"SDBAlliVar",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  SDBAlliVar* dbvar = ((SDBAlliVar*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'FreeDBAlliVar'", NULL);
#endif
  {
   self->FreeDBAlliVar(dbvar);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'FreeDBAlliVar'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: AllocTimerUserData of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_AllocTimerUserData00
static int tolua_tqAllTolua_IScriptPub_AllocTimerUserData00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'AllocTimerUserData'", NULL);
#endif
  {
   TimerUserData* tolua_ret = (TimerUserData*)  self->AllocTimerUserData();
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"TimerUserData");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'AllocTimerUserData'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: FreeTimerUserData of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_FreeTimerUserData00
static int tolua_tqAllTolua_IScriptPub_FreeTimerUserData00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"TimerUserData",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  TimerUserData* userdata = ((TimerUserData*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'FreeTimerUserData'", NULL);
#endif
  {
   self->FreeTimerUserData(userdata);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'FreeTimerUserData'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetZoneId of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_GetZoneId00
static int tolua_tqAllTolua_IScriptPub_GetZoneId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetZoneId'", NULL);
#endif
  {
   unsigned short tolua_ret = ( unsigned short)  self->GetZoneId();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetZoneId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetDBConn of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_GetDBConn00
static int tolua_tqAllTolua_IScriptPub_GetDBConn00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetDBConn'", NULL);
#endif
  {
   IDatabase* tolua_ret = (IDatabase*)  self->GetDBConn();
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"IDatabase");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetDBConn'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: ClearInnerHero of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_ClearInnerHero00
static int tolua_tqAllTolua_IScriptPub_ClearInnerHero00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const SHero",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  const SHero* hero = ((const SHero*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'ClearInnerHero'", NULL);
#endif
  {
   self->ClearInnerHero(hero);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'ClearInnerHero'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: diffTimeMs of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_diffTimeMs00
static int tolua_tqAllTolua_IScriptPub_diffTimeMs00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
  unsigned int time1 = (( unsigned int)  tolua_tonumber(tolua_S,2,0));
  unsigned int time2 = (( unsigned int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'diffTimeMs'", NULL);
#endif
  {
    int tolua_ret = (  int)  self->diffTimeMs(time1,time2);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'diffTimeMs'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: getTimeMs of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_getTimeMs00
static int tolua_tqAllTolua_IScriptPub_getTimeMs00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'getTimeMs'", NULL);
#endif
  {
   unsigned int tolua_ret = ( unsigned int)  self->getTimeMs();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'getTimeMs'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: getTimeMsEx of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_getTimeMsEx00
static int tolua_tqAllTolua_IScriptPub_getTimeMsEx00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'getTimeMsEx'", NULL);
#endif
  {
   unsigned long long tolua_ret = ( unsigned long long)  self->getTimeMsEx();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'getTimeMsEx'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCfgBasePath of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_GetCfgBasePath00
static int tolua_tqAllTolua_IScriptPub_GetCfgBasePath00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCfgBasePath'", NULL);
#endif
  {
   const char* tolua_ret = (const char*)  self->GetCfgBasePath();
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCfgBasePath'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetLogBasePath of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_GetLogBasePath00
static int tolua_tqAllTolua_IScriptPub_GetLogBasePath00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetLogBasePath'", NULL);
#endif
  {
   const char* tolua_ret = (const char*)  self->GetLogBasePath();
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetLogBasePath'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetSvrNameId of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_GetSvrNameId00
static int tolua_tqAllTolua_IScriptPub_GetSvrNameId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetSvrNameId'", NULL);
#endif
  {
   const char* tolua_ret = (const char*)  self->GetSvrNameId();
   tolua_pushstring(tolua_S,(const char*)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetSvrNameId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: delete of class  IScriptPub */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IScriptPub_delete00
static int tolua_tqAllTolua_IScriptPub_delete00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IScriptPub",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IScriptPub* self = (IScriptPub*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'delete'", NULL);
#endif
  Mtolua_delete(self);
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'delete'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* get function: shiChangLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_shiChangLevel
static int tolua_get_GridMisc_unsigned_shiChangLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'shiChangLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->shiChangLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: shiChangLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_shiChangLevel
static int tolua_set_GridMisc_unsigned_shiChangLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'shiChangLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->shiChangLevel = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: towerLayer of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_towerLayer
static int tolua_get_GridMisc_unsigned_towerLayer(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerLayer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->towerLayer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: towerLayer of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_towerLayer
static int tolua_set_GridMisc_unsigned_towerLayer(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerLayer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->towerLayer = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: towerTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_towerTime
static int tolua_get_GridMisc_unsigned_towerTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->towerTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: towerTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_towerTime
static int tolua_set_GridMisc_unsigned_towerTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->towerTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: towerRank of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_towerRank
static int tolua_get_GridMisc_unsigned_towerRank(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerRank'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->towerRank);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: towerRank of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_towerRank
static int tolua_set_GridMisc_unsigned_towerRank(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'towerRank'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->towerRank = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buildValTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_buildValTime
static int tolua_get_GridMisc_unsigned_buildValTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildValTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buildValTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buildValTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_buildValTime
static int tolua_set_GridMisc_unsigned_buildValTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildValTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buildValTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: terraceGate of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_terraceGate
static int tolua_get_GridMisc_unsigned_terraceGate(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'terraceGate'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->terraceGate);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: terraceGate of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_terraceGate
static int tolua_set_GridMisc_unsigned_terraceGate(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'terraceGate'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->terraceGate = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cityMaxLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_cityMaxLevel
static int tolua_get_GridMisc_unsigned_cityMaxLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityMaxLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->cityMaxLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cityMaxLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_cityMaxLevel
static int tolua_set_GridMisc_unsigned_cityMaxLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityMaxLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cityMaxLevel = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_yellow_vip
static int tolua_get_GridMisc_unsigned_is_yellow_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_yellow_vip
static int tolua_set_GridMisc_unsigned_is_yellow_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_year_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_yellow_year_vip
static int tolua_get_GridMisc_unsigned_is_yellow_year_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_year_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_year_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_year_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_yellow_year_vip
static int tolua_set_GridMisc_unsigned_is_yellow_year_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_year_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_year_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: yellow_vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_yellow_vip_level
static int tolua_get_GridMisc_unsigned_yellow_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'yellow_vip_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->yellow_vip_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: yellow_vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_yellow_vip_level
static int tolua_set_GridMisc_unsigned_yellow_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'yellow_vip_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->yellow_vip_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_yellow_high_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_yellow_high_vip
static int tolua_get_GridMisc_unsigned_is_yellow_high_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_high_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_yellow_high_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_yellow_high_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_yellow_high_vip
static int tolua_set_GridMisc_unsigned_is_yellow_high_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_yellow_high_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_yellow_high_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_blue_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_blue_vip
static int tolua_get_GridMisc_unsigned_is_blue_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_blue_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_blue_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_blue_vip
static int tolua_set_GridMisc_unsigned_is_blue_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_blue_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_blue_year_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_blue_year_vip
static int tolua_get_GridMisc_unsigned_is_blue_year_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_year_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_blue_year_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_blue_year_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_blue_year_vip
static int tolua_set_GridMisc_unsigned_is_blue_year_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_blue_year_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_blue_year_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: blue_vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_blue_vip_level
static int tolua_get_GridMisc_unsigned_blue_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'blue_vip_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->blue_vip_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: blue_vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_blue_vip_level
static int tolua_set_GridMisc_unsigned_blue_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'blue_vip_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->blue_vip_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: is_super_blue_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_is_super_blue_vip
static int tolua_get_GridMisc_unsigned_is_super_blue_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_super_blue_vip'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->is_super_blue_vip);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: is_super_blue_vip of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_is_super_blue_vip
static int tolua_set_GridMisc_unsigned_is_super_blue_vip(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'is_super_blue_vip'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->is_super_blue_vip = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: _3366_grow_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned__3366_grow_level
static int tolua_get_GridMisc_unsigned__3366_grow_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable '_3366_grow_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->_3366_grow_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: _3366_grow_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned__3366_grow_level
static int tolua_set_GridMisc_unsigned__3366_grow_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable '_3366_grow_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->_3366_grow_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_vip_level
static int tolua_get_GridMisc_unsigned_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'vip_level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->vip_level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: vip_level of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_vip_level
static int tolua_set_GridMisc_unsigned_vip_level(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'vip_level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->vip_level = (( unsigned char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastRoleLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_lastRoleLevel
static int tolua_get_GridMisc_unsigned_lastRoleLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastRoleLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastRoleLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastRoleLevel of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_lastRoleLevel
static int tolua_set_GridMisc_unsigned_lastRoleLevel(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastRoleLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastRoleLevel = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastBuildVal of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_lastBuildVal
static int tolua_get_GridMisc_unsigned_lastBuildVal(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastBuildVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastBuildVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastBuildVal of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_lastBuildVal
static int tolua_set_GridMisc_unsigned_lastBuildVal(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastBuildVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastBuildVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTowerLayer of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_lastTowerLayer
static int tolua_get_GridMisc_unsigned_lastTowerLayer(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTowerLayer'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTowerLayer);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTowerLayer of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_lastTowerLayer
static int tolua_set_GridMisc_unsigned_lastTowerLayer(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTowerLayer'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTowerLayer = (( unsigned short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: lastTowerTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_get_GridMisc_unsigned_lastTowerTime
static int tolua_get_GridMisc_unsigned_lastTowerTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTowerTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->lastTowerTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: lastTowerTime of class  GridMisc */
#ifndef TOLUA_DISABLE_tolua_set_GridMisc_unsigned_lastTowerTime
static int tolua_set_GridMisc_unsigned_lastTowerTime(lua_State* tolua_S)
{
  GridMisc* self = (GridMisc*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'lastTowerTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->lastTowerTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: gridId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_gridId
static int tolua_get_Grid_unsigned_gridId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gridId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->gridId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: gridId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_gridId
static int tolua_set_Grid_unsigned_gridId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'gridId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->gridId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: objType of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_objType
static int tolua_get_Grid_objType(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'objType'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->objType);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: objType of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_objType
static int tolua_set_Grid_objType(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'objType'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->objType = ((char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: resId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_resId
static int tolua_get_Grid_unsigned_resId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->resId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: resId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_resId
static int tolua_set_Grid_unsigned_resId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'resId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->resId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: modelId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_modelId
static int tolua_get_Grid_unsigned_modelId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'modelId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->modelId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: modelId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_modelId
static int tolua_set_Grid_unsigned_modelId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'modelId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->modelId = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: subCitys of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_subCitys
static int tolua_get_Grid_subCitys(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'subCitys'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->subCitys);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: subCitys of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_subCitys
static int tolua_set_Grid_subCitys(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'subCitys'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->subCitys,(const char*)tolua_tostring(tolua_S,2,0),28);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_roleId
static int tolua_get_Grid_unsigned_roleId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->roleId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_roleId
static int tolua_set_Grid_unsigned_roleId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->roleId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_roleName
static int tolua_get_Grid_roleName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->roleName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_roleName
static int tolua_set_Grid_roleName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->roleName,(const char*)tolua_tostring(tolua_S,2,0),22);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: userName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_userName
static int tolua_get_Grid_userName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'userName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->userName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: userName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_userName
static int tolua_set_Grid_userName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'userName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->userName,(const char*)tolua_tostring(tolua_S,2,0),33);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: icon of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_icon
static int tolua_get_Grid_icon(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'icon'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->icon);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: icon of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_icon
static int tolua_set_Grid_icon(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'icon'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->icon = ((short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: level of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_level
static int tolua_get_Grid_level(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->level);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: level of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_level
static int tolua_set_Grid_level(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'level'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->level = ((short)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: sex of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_sex
static int tolua_get_Grid_sex(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sex'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->sex);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: sex of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_sex
static int tolua_set_Grid_sex(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'sex'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->sex = ((char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: state of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_state
static int tolua_get_Grid_state(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->state);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: state of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_state
static int tolua_set_Grid_state(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'state'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->state = ((char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: allianceId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_allianceId
static int tolua_get_Grid_unsigned_allianceId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allianceId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->allianceId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: allianceId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_allianceId
static int tolua_set_Grid_unsigned_allianceId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'allianceId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->allianceId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: enemyAlliId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_enemyAlliId
static int tolua_get_Grid_unsigned_enemyAlliId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyAlliId'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->enemyAlliId);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: enemyAlliId of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_enemyAlliId
static int tolua_set_Grid_unsigned_enemyAlliId(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'enemyAlliId'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->enemyAlliId = (( unsigned long long)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: refreshTime of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_refreshTime
static int tolua_get_Grid_unsigned_refreshTime(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->refreshTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: refreshTime of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_refreshTime
static int tolua_set_Grid_unsigned_refreshTime(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'refreshTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->refreshTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: alliName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_alliName
static int tolua_get_Grid_alliName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'alliName'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->alliName);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: alliName of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_alliName
static int tolua_set_Grid_alliName(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'alliName'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->alliName,(const char*)tolua_tostring(tolua_S,2,0),22);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: cityLevel of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_cityLevel
static int tolua_get_Grid_cityLevel(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityLevel'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->cityLevel);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: cityLevel of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_cityLevel
static int tolua_set_Grid_cityLevel(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'cityLevel'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->cityLevel = ((char)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: buildCurVal of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_buildCurVal
static int tolua_get_Grid_unsigned_buildCurVal(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildCurVal'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->buildCurVal);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: buildCurVal of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_buildCurVal
static int tolua_set_Grid_unsigned_buildCurVal(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'buildCurVal'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->buildCurVal = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: roleRank of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_roleRank
static int tolua_get_Grid_unsigned_roleRank(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleRank'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->roleRank);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: roleRank of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_roleRank
static int tolua_set_Grid_unsigned_roleRank(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'roleRank'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->roleRank = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: introduction of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_introduction
static int tolua_get_Grid_introduction(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'introduction'",NULL);
#endif
  tolua_pushstring(tolua_S,(const char*)self->introduction);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: introduction of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_introduction
static int tolua_set_Grid_introduction(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'introduction'",NULL);
  if (!tolua_isstring(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
 SafeStrCpy((char*)
self->introduction,(const char*)tolua_tostring(tolua_S,2,0),52);
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: loginTime of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_unsigned_loginTime
static int tolua_get_Grid_unsigned_loginTime(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'loginTime'",NULL);
#endif
  tolua_pushnumber(tolua_S,(lua_Number)self->loginTime);
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: loginTime of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_unsigned_loginTime
static int tolua_set_Grid_unsigned_loginTime(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'loginTime'",NULL);
  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->loginTime = (( unsigned int)  tolua_tonumber(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* get function: misc of class  Grid */
#ifndef TOLUA_DISABLE_tolua_get_Grid_misc
static int tolua_get_Grid_misc(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'misc'",NULL);
#endif
   tolua_pushusertype(tolua_S,(void*)&self->misc,"GridMisc");
 return 1;
}
#endif //#ifndef TOLUA_DISABLE

/* set function: misc of class  Grid */
#ifndef TOLUA_DISABLE_tolua_set_Grid_misc
static int tolua_set_Grid_misc(lua_State* tolua_S)
{
  Grid* self = (Grid*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  tolua_Error tolua_err;
  if (!self) tolua_error(tolua_S,"invalid 'self' in accessing variable 'misc'",NULL);
  if ((tolua_isvaluenil(tolua_S,2,&tolua_err) || !tolua_isusertype(tolua_S,2,"GridMisc",0,&tolua_err)))
   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);
#endif
  self->misc = *((GridMisc*)  tolua_tousertype(tolua_S,2,0))
;
 return 0;
}
#endif //#ifndef TOLUA_DISABLE

/* method: Load of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_Load00
static int tolua_tqAllTolua_IGridsManager_Load00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Load'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->Load();
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Load'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetGridById of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetGridById00
static int tolua_tqAllTolua_IGridsManager_GetGridById00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  int gridId = ((int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetGridById'", NULL);
#endif
  {
   Grid* tolua_ret = (Grid*)  self->GetGridById(gridId);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"Grid");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetGridById'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetGridByRoleId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetGridByRoleId00
static int tolua_tqAllTolua_IGridsManager_GetGridByRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetGridByRoleId'", NULL);
#endif
  {
   Grid* tolua_ret = (Grid*)  self->GetGridByRoleId(roleId);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"Grid");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetGridByRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCityIdByGridId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetCityIdByGridId00
static int tolua_tqAllTolua_IGridsManager_GetCityIdByGridId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  int gridId = ((int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCityIdByGridId'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetCityIdByGridId(gridId);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCityIdByGridId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetFreeGridId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetFreeGridId00
static int tolua_tqAllTolua_IGridsManager_GetFreeGridId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  int cityId = ((int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetFreeGridId'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetFreeGridId(cityId);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetFreeGridId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetPosByGridId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetPosByGridId00
static int tolua_tqAllTolua_IGridsManager_GetPosByGridId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,4,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,5,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  int gridId = ((int)  tolua_tonumber(tolua_S,2,0));
  int x = ((int)  tolua_tonumber(tolua_S,3,0));
  int y = ((int)  tolua_tonumber(tolua_S,4,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetPosByGridId'", NULL);
#endif
  {
   self->GetPosByGridId(gridId,x,y);
   tolua_pushnumber(tolua_S,(lua_Number)x);
   tolua_pushnumber(tolua_S,(lua_Number)y);
  }
 }
 return 2;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetPosByGridId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetRoleIdByRoleName of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetRoleIdByRoleName00
static int tolua_tqAllTolua_IGridsManager_GetRoleIdByRoleName00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  const char* roleName = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetRoleIdByRoleName'", NULL);
#endif
  {
   long long tolua_ret = ( long long)  self->GetRoleIdByRoleName(roleName);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetRoleIdByRoleName'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetGridIdByRoleId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetGridIdByRoleId00
static int tolua_tqAllTolua_IGridsManager_GetGridIdByRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetGridIdByRoleId'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetGridIdByRoleId(roleId);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetGridIdByRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: MapRoleNameToRoleId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_MapRoleNameToRoleId00
static int tolua_tqAllTolua_IGridsManager_MapRoleNameToRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  const char* roleName = ((const char*)  tolua_tostring(tolua_S,2,0));
  long long roleId = (( long long)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'MapRoleNameToRoleId'", NULL);
#endif
  {
   self->MapRoleNameToRoleId(roleName,roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'MapRoleNameToRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: MapRoleIdToGridId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_MapRoleIdToGridId00
static int tolua_tqAllTolua_IGridsManager_MapRoleIdToGridId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
  int gridId = ((int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'MapRoleIdToGridId'", NULL);
#endif
  {
   self->MapRoleIdToGridId(roleId,gridId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'MapRoleIdToGridId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RefreshExileRoleIds of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_RefreshExileRoleIds00
static int tolua_tqAllTolua_IGridsManager_RefreshExileRoleIds00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RefreshExileRoleIds'", NULL);
#endif
  {
   self->RefreshExileRoleIds();
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RefreshExileRoleIds'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetExileGridByRoleId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_GetExileGridByRoleId00
static int tolua_tqAllTolua_IGridsManager_GetExileGridByRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetExileGridByRoleId'", NULL);
#endif
  {
   Grid* tolua_ret = (Grid*)  self->GetExileGridByRoleId(roleId);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"Grid");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetExileGridByRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RemoveExileGridByRoleId of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_RemoveExileGridByRoleId00
static int tolua_tqAllTolua_IGridsManager_RemoveExileGridByRoleId00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RemoveExileGridByRoleId'", NULL);
#endif
  {
   self->RemoveExileGridByRoleId(roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RemoveExileGridByRoleId'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: AppendExileGrid of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_AppendExileGrid00
static int tolua_tqAllTolua_IGridsManager_AppendExileGrid00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const Grid",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  const Grid* gird = ((const Grid*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'AppendExileGrid'", NULL);
#endif
  {
   self->AppendExileGrid(gird);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'AppendExileGrid'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: ClearGrid of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_ClearGrid00
static int tolua_tqAllTolua_IGridsManager_ClearGrid00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const Grid",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  const Grid* grid = ((const Grid*)  tolua_tousertype(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'ClearGrid'", NULL);
#endif
  {
   self->ClearGrid(grid);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'ClearGrid'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: CopyGrid of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_CopyGrid00
static int tolua_tqAllTolua_IGridsManager_CopyGrid00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,2,"const Grid",0,&tolua_err) ||
     !tolua_isusertype(tolua_S,3,"const Grid",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  const Grid* des = ((const Grid*)  tolua_tousertype(tolua_S,2,0));
  const Grid* src = ((const Grid*)  tolua_tousertype(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'CopyGrid'", NULL);
#endif
  {
   self->CopyGrid(des,src);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'CopyGrid'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: SetMapView of class  IGridsManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IGridsManager_SetMapView00
static int tolua_tqAllTolua_IGridsManager_SetMapView00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IGridsManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,4,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,5,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,6,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IGridsManager* self = (IGridsManager*)  tolua_tousertype(tolua_S,1,0);
  int x1 = ((int)  tolua_tonumber(tolua_S,2,0));
  int y1 = ((int)  tolua_tonumber(tolua_S,3,0));
  int x2 = ((int)  tolua_tonumber(tolua_S,4,0));
  int y2 = ((int)  tolua_tonumber(tolua_S,5,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'SetMapView'", NULL);
#endif
  {
   self->SetMapView(x1,y1,x2,y2);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'SetMapView'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetRank of class  IRankManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRankManager_GetRank00
static int tolua_tqAllTolua_IRankManager_GetRank00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRankManager",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRankManager* self = (IRankManager*)  tolua_tousertype(tolua_S,1,0);
  const char* rankName = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetRank'", NULL);
#endif
  {
   IRank* tolua_ret = (IRank*)  self->GetRank(rankName);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"IRank");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetRank'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: StartChangeRolePos of class  IRankManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRankManager_StartChangeRolePos00
static int tolua_tqAllTolua_IRankManager_StartChangeRolePos00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRankManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRankManager* self = (IRankManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'StartChangeRolePos'", NULL);
#endif
  {
   self->StartChangeRolePos(roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'StartChangeRolePos'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: AddNewRole of class  IRankManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRankManager_AddNewRole00
static int tolua_tqAllTolua_IRankManager_AddNewRole00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRankManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRankManager* self = (IRankManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'AddNewRole'", NULL);
#endif
  {
   self->AddNewRole(roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'AddNewRole'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: RemoveRole of class  IRankManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRankManager_RemoveRole00
static int tolua_tqAllTolua_IRankManager_RemoveRole00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRankManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRankManager* self = (IRankManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'RemoveRole'", NULL);
#endif
  {
   self->RemoveRole(roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'RemoveRole'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: EndChangeRolePos of class  IRankManager */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRankManager_EndChangeRolePos00
static int tolua_tqAllTolua_IRankManager_EndChangeRolePos00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRankManager",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRankManager* self = (IRankManager*)  tolua_tousertype(tolua_S,1,0);
  long long roleId = (( long long)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'EndChangeRolePos'", NULL);
#endif
  {
   self->EndChangeRolePos(roleId);
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'EndChangeRolePos'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Sort of class  IRank */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRank_Sort00
static int tolua_tqAllTolua_IRank_Sort00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRank",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRank* self = (IRank*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Sort'", NULL);
#endif
  {
   self->Sort();
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Sort'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: LoadLast of class  IRank */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRank_LoadLast00
static int tolua_tqAllTolua_IRank_LoadLast00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRank",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRank* self = (IRank*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'LoadLast'", NULL);
#endif
  {
   self->LoadLast();
  }
 }
 return 0;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'LoadLast'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetCount of class  IRank */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRank_GetCount00
static int tolua_tqAllTolua_IRank_GetCount00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRank",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRank* self = (IRank*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetCount'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetCount();
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetCount'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: Get of class  IRank */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRank_Get00
static int tolua_tqAllTolua_IRank_Get00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRank",0,&tolua_err) ||
     !tolua_isnumber(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRank* self = (IRank*)  tolua_tousertype(tolua_S,1,0);
  int idx = ((int)  tolua_tonumber(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'Get'", NULL);
#endif
  {
   const Grid* tolua_ret = (const Grid*)  self->Get(idx);
    tolua_pushusertype(tolua_S,(void*)tolua_ret,"const Grid");
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'Get'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: GetIdxByName of class  IRank */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IRank_GetIdxByName00
static int tolua_tqAllTolua_IRank_GetIdxByName00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IRank",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IRank* self = (IRank*)  tolua_tousertype(tolua_S,1,0);
  const char* roleName = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'GetIdxByName'", NULL);
#endif
  {
   int tolua_ret = (int)  self->GetIdxByName(roleName);
   tolua_pushnumber(tolua_S,(lua_Number)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'GetIdxByName'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: connect of class  IProxyServer */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IProxyServer_connect00
static int tolua_tqAllTolua_IProxyServer_connect00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IProxyServer",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnumber(tolua_S,3,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,4,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IProxyServer* self = (IProxyServer*)  tolua_tousertype(tolua_S,1,0);
  const char* url = ((const char*)  tolua_tostring(tolua_S,2,0));
  int port = ((int)  tolua_tonumber(tolua_S,3,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'connect'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->connect(url,port);
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'connect'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: isLosted of class  IProxyServer */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IProxyServer_isLosted00
static int tolua_tqAllTolua_IProxyServer_isLosted00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IProxyServer",0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,2,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IProxyServer* self = (IProxyServer*)  tolua_tousertype(tolua_S,1,0);
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'isLosted'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->isLosted();
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'isLosted'.",&tolua_err);
 return 0;
#endif
}
#endif //#ifndef TOLUA_DISABLE

/* method: sendMsg of class  IProxyServer */
#ifndef TOLUA_DISABLE_tolua_tqAllTolua_IProxyServer_sendMsg00
static int tolua_tqAllTolua_IProxyServer_sendMsg00(lua_State* tolua_S)
{
#ifndef TOLUA_RELEASE
 tolua_Error tolua_err;
 if (
     !tolua_isusertype(tolua_S,1,"IProxyServer",0,&tolua_err) ||
     !tolua_isstring(tolua_S,2,0,&tolua_err) ||
     !tolua_isnoobj(tolua_S,3,&tolua_err)
 )
  goto tolua_lerror;
 else
#endif
 {
  IProxyServer* self = (IProxyServer*)  tolua_tousertype(tolua_S,1,0);
  const char* msg = ((const char*)  tolua_tostring(tolua_S,2,0));
#ifndef TOLUA_RELEASE
  if (!self) tolua_error(tolua_S,"invalid 'self' in function 'sendMsg'", NULL);
#endif
  {
   bool tolua_ret = (bool)  self->sendMsg(msg);
   tolua_pushboolean(tolua_S,(bool)tolua_ret);
  }
 }
 return 1;
#ifndef TOLUA_RELEASE
 tolua_lerror:
 tolua_error(tolua_S,"#ferror in function 'sendMsg'.",&tolua_err);
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
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"EventCast","EventCast","",tolua_collect_EventCast);
  #else
  tolua_cclass(tolua_S,"EventCast","EventCast","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"EventCast");
   tolua_function(tolua_S,"new",tolua_tqAllTolua_EventCast_new00);
   tolua_function(tolua_S,"new_local",tolua_tqAllTolua_EventCast_new00_local);
   tolua_function(tolua_S,".call",tolua_tqAllTolua_EventCast_new00_local);
   tolua_function(tolua_S,"delete",tolua_tqAllTolua_EventCast_delete00);
   tolua_function(tolua_S,"Cast_ScriptEvent",tolua_tqAllTolua_EventCast_Cast_ScriptEvent00);
   tolua_function(tolua_S,"Cast_TimerEvent",tolua_tqAllTolua_EventCast_Cast_TimerEvent00);
  tolua_endmodule(tolua_S);
  tolua_constant(tolua_S,"RET_OK",RET_OK);
  tolua_constant(tolua_S,"RET_FAILED",RET_FAILED);
  tolua_constant(tolua_S,"RET_LOGIN_OK",RET_LOGIN_OK);
  tolua_constant(tolua_S,"RET_LOGIN_NOROLE",RET_LOGIN_NOROLE);
  tolua_constant(tolua_S,"RET_LOGIN_DBFIELD_NOENOUGH_LEN",RET_LOGIN_DBFIELD_NOENOUGH_LEN);
  tolua_constant(tolua_S,"RET_LOGIN_DBFIELD_ERR",RET_LOGIN_DBFIELD_ERR);
  tolua_constant(tolua_S,"RET_LOGIN_ZONEID_ERR",RET_LOGIN_ZONEID_ERR);
  tolua_constant(tolua_S,"RET_DB_COM_ERR",RET_DB_COM_ERR);
  tolua_constant(tolua_S,"RET_LOGIN_ERR",RET_LOGIN_ERR);
  tolua_constant(tolua_S,"RET_CREATEROLE_OK",RET_CREATEROLE_OK);
  tolua_constant(tolua_S,"RET_CREATEROLE_DBFIELD_ERR",RET_CREATEROLE_DBFIELD_ERR);
  tolua_constant(tolua_S,"RET_NOFIND_ALLI",RET_NOFIND_ALLI);
  tolua_constant(tolua_S,"RET_CREATEROLE_DBFIELD_NOENOUGH_LEN",RET_CREATEROLE_DBFIELD_NOENOUGH_LEN);
  tolua_constant(tolua_S,"RET_NULL_PTR",RET_NULL_PTR);
  tolua_constant(tolua_S,"RET_CPP_MIN",RET_CPP_MIN);
  tolua_constant(tolua_S,"RET_CPP_MAX",RET_CPP_MAX);
  tolua_constant(tolua_S,"EET_UNKNOWN",EET_UNKNOWN);
  tolua_constant(tolua_S,"EET_LOG_EVENT_FIRST",EET_LOG_EVENT_FIRST);
  tolua_constant(tolua_S,"EET_LOG_INFORMATION",EET_LOG_INFORMATION);
  tolua_constant(tolua_S,"EET_LOG_WARNING",EET_LOG_WARNING);
  tolua_constant(tolua_S,"EET_LOG_ERROR",EET_LOG_ERROR);
  tolua_constant(tolua_S,"EET_LOG_EVENT_LAST",EET_LOG_EVENT_LAST);
  tolua_constant(tolua_S,"EET_NET_EVENT_FIRST",EET_NET_EVENT_FIRST);
  tolua_constant(tolua_S,"EET_NET_EVENT_LAST",EET_NET_EVENT_LAST);
  tolua_constant(tolua_S,"EET_USER_EVENT_FIRST",EET_USER_EVENT_FIRST);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SBaseEvent","SBaseEvent","",tolua_collect_SBaseEvent);
  #else
  tolua_cclass(tolua_S,"SBaseEvent","SBaseEvent","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SBaseEvent");
   tolua_variable(tolua_S,"eventType",tolua_get_SBaseEvent_eventType,tolua_set_SBaseEvent_eventType);
   tolua_function(tolua_S,"delete",tolua_tqAllTolua_SBaseEvent_delete00);
   tolua_function(tolua_S,"GetSize",tolua_tqAllTolua_SBaseEvent_GetSize00);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SEvent","SEvent","",tolua_collect_SEvent);
  #else
  tolua_cclass(tolua_S,"SEvent","SEvent","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SEvent");
   tolua_variable(tolua_S,"id",tolua_get_SEvent_id,tolua_set_SEvent_id);
   tolua_variable(tolua_S,"eventData",tolua_get_SEvent_eventData_ptr,tolua_set_SEvent_eventData_ptr);
   tolua_variable(tolua_S,"userData",tolua_get_SEvent_userData,tolua_set_SEvent_userData);
   tolua_function(tolua_S,"new",tolua_tqAllTolua_SEvent_new00);
   tolua_function(tolua_S,"new_local",tolua_tqAllTolua_SEvent_new00_local);
   tolua_function(tolua_S,".call",tolua_tqAllTolua_SEvent_new00_local);
   tolua_function(tolua_S,"new",tolua_tqAllTolua_SEvent_new01);
   tolua_function(tolua_S,"new_local",tolua_tqAllTolua_SEvent_new01_local);
   tolua_function(tolua_S,".call",tolua_tqAllTolua_SEvent_new01_local);
   tolua_function(tolua_S,"IsSkiped",tolua_tqAllTolua_SEvent_IsSkiped00);
   tolua_function(tolua_S,"IsUpParent",tolua_tqAllTolua_SEvent_IsUpParent00);
   tolua_function(tolua_S,"Skip",tolua_tqAllTolua_SEvent_Skip00);
   tolua_function(tolua_S,"UpParent",tolua_tqAllTolua_SEvent_UpParent00);
  tolua_endmodule(tolua_S);
  tolua_constant(tolua_S,"MSG_CMD_USEREXIT_SC",MSG_CMD_USEREXIT_SC);
  tolua_constant(tolua_S,"MSG_CMD_USERLOGINOK_SC",MSG_CMD_USERLOGINOK_SC);
  tolua_constant(tolua_S,"MSG_CMD_USEREXIT_CS",MSG_CMD_USEREXIT_CS);
  tolua_cclass(tolua_S,"IDatabase","IDatabase","",NULL);
  tolua_beginmodule(tolua_S,"IDatabase");
   tolua_function(tolua_S,"Query",tolua_tqAllTolua_IDatabase_Query00);
   tolua_function(tolua_S,"GetRow",tolua_tqAllTolua_IDatabase_GetRow00);
   tolua_function(tolua_S,"GetRowCount",tolua_tqAllTolua_IDatabase_GetRowCount00);
   tolua_function(tolua_S,"GetFieldCount",tolua_tqAllTolua_IDatabase_GetFieldCount00);
   tolua_function(tolua_S,"GetField",tolua_tqAllTolua_IDatabase_GetField00);
   tolua_function(tolua_S,"GetLastError",tolua_tqAllTolua_IDatabase_GetLastError00);
   tolua_function(tolua_S,"GetLastErrorStr",tolua_tqAllTolua_IDatabase_GetLastErrorStr00);
   tolua_function(tolua_S,"RealEscapeString",tolua_tqAllTolua_IDatabase_RealEscapeString00);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"IScriptSys","IScriptSys","",NULL);
  tolua_beginmodule(tolua_S,"IScriptSys");
   tolua_function(tolua_S,"ClearLoaded",tolua_tqAllTolua_IScriptSys_ClearLoaded00);
  tolua_endmodule(tolua_S);
  tolua_constant(tolua_S,"PKG_CUR_VER",PKG_CUR_VER);
  tolua_constant(tolua_S,"MAX_SQL_LEN",MAX_SQL_LEN);
  tolua_constant(tolua_S,"MAX_ROLE_TABLE_CNT",MAX_ROLE_TABLE_CNT);
  tolua_constant(tolua_S,"MAX_CITY_STATES_CNT",MAX_CITY_STATES_CNT);
  tolua_constant(tolua_S,"MAX_INBUILD_CNT",MAX_INBUILD_CNT);
  tolua_constant(tolua_S,"MAX_BUILDING_CNT",MAX_BUILDING_CNT);
  tolua_constant(tolua_S,"MAX_CITY_CNT",MAX_CITY_CNT);
  tolua_constant(tolua_S,"MAX_SELFFIELD_CNT",MAX_SELFFIELD_CNT);
  tolua_constant(tolua_S,"MAX_ITEMS_CNT",MAX_ITEMS_CNT);
  tolua_constant(tolua_S,"MAX_HOLES_CNT",MAX_HOLES_CNT);
  tolua_constant(tolua_S,"MAX_WEARS_CNT",MAX_WEARS_CNT);
  tolua_constant(tolua_S,"MAX_USERNAME_ARR_LEN",MAX_USERNAME_ARR_LEN);
  tolua_constant(tolua_S,"MAX_USERNAME_LEN",MAX_USERNAME_LEN);
  tolua_constant(tolua_S,"MIN_USERNAME_LEN",MIN_USERNAME_LEN);
  tolua_constant(tolua_S,"MAX_ROLENAME_ARR_LEN",MAX_ROLENAME_ARR_LEN);
  tolua_constant(tolua_S,"MAX_ROLENAME_LEN",MAX_ROLENAME_LEN);
  tolua_constant(tolua_S,"MIN_ROLENAME_LEN",MIN_ROLENAME_LEN);
  tolua_constant(tolua_S,"MAX_HERONAME_ARR_LEN",MAX_HERONAME_ARR_LEN);
  tolua_constant(tolua_S,"MAX_HERONAME_LEN",MAX_HERONAME_LEN);
  tolua_constant(tolua_S,"MIN_HERONAME_LEN",MIN_HERONAME_LEN);
  tolua_constant(tolua_S,"MAX_CITYNAME_ARR_LEN",MAX_CITYNAME_ARR_LEN);
  tolua_constant(tolua_S,"MAX_CITYNAME_LEN",MAX_CITYNAME_LEN);
  tolua_constant(tolua_S,"MAX_TASKS_CNT",MAX_TASKS_CNT);
  tolua_constant(tolua_S,"MAX_ONLINE_TASKS_CNT",MAX_ONLINE_TASKS_CNT);
  tolua_constant(tolua_S,"MAX_EVERYDAY_TASKS_CNT",MAX_EVERYDAY_TASKS_CNT);
  tolua_constant(tolua_S,"MAX_ACT_TASKS_CNT",MAX_ACT_TASKS_CNT);
  tolua_constant(tolua_S,"MAX_HERO_CNT",MAX_HERO_CNT);
  tolua_constant(tolua_S,"MAX_NEWHERO_CNT",MAX_NEWHERO_CNT);
  tolua_constant(tolua_S,"MAX_SLDS_CNT",MAX_SLDS_CNT);
  tolua_constant(tolua_S,"MAX_GEMBESET_CNT",MAX_GEMBESET_CNT);
  tolua_constant(tolua_S,"MAX_MAILTITLE_ARR_LEN",MAX_MAILTITLE_ARR_LEN);
  tolua_constant(tolua_S,"MAX_MAISYSLCON_ARR_LEN",MAX_MAISYSLCON_ARR_LEN);
  tolua_constant(tolua_S,"MAX_MAILCON_ARR_LEN",MAX_MAILCON_ARR_LEN);
  tolua_constant(tolua_S,"MAX_MAILTITLE_LEN",MAX_MAILTITLE_LEN);
  tolua_constant(tolua_S,"MAX_MAISYSLCON_LEN",MAX_MAISYSLCON_LEN);
  tolua_constant(tolua_S,"MAX_MAILCON_LEN",MAX_MAILCON_LEN);
  tolua_constant(tolua_S,"MAX_BULLETINS_CNT",MAX_BULLETINS_CNT);
  tolua_constant(tolua_S,"MAX_BUDDYS_CNT",MAX_BUDDYS_CNT);
  tolua_constant(tolua_S,"MAX_BUDDYS_APPLY_CNT",MAX_BUDDYS_APPLY_CNT);
  tolua_constant(tolua_S,"MAX_ROLEATTRS_CNT",MAX_ROLEATTRS_CNT);
  tolua_constant(tolua_S,"MAX_HEROATTRS_CNT",MAX_HEROATTRS_CNT);
  tolua_constant(tolua_S,"MAX_SIMPLEHEROATTRS_CNT",MAX_SIMPLEHEROATTRS_CNT);
  tolua_constant(tolua_S,"MAX_NEWHEROATTRS_CNT",MAX_NEWHEROATTRS_CNT);
  tolua_constant(tolua_S,"MAX_FARM_CNT",MAX_FARM_CNT);
  tolua_constant(tolua_S,"MAX_CULTURE_CNT",MAX_CULTURE_CNT);
  tolua_constant(tolua_S,"MAX_FARM_LOG_CNT",MAX_FARM_LOG_CNT);
  tolua_constant(tolua_S,"MAX_SUBJECT_CNT",MAX_SUBJECT_CNT);
  tolua_constant(tolua_S,"MAX_HEROWEAR_CNT",MAX_HEROWEAR_CNT);
  tolua_constant(tolua_S,"MAX_HERO_SKILL_CNT",MAX_HERO_SKILL_CNT);
  tolua_constant(tolua_S,"MAX_HERO_SCUT_CNT",MAX_HERO_SCUT_CNT);
  tolua_constant(tolua_S,"MAX_ITEM_ATTRS_CNT",MAX_ITEM_ATTRS_CNT);
  tolua_constant(tolua_S,"MAX_FAVORITE_CNT",MAX_FAVORITE_CNT);
  tolua_constant(tolua_S,"MAX_ENEMY_CNT",MAX_ENEMY_CNT);
  tolua_constant(tolua_S,"MAX_SUCC_COPYFIELD_CNT",MAX_SUCC_COPYFIELD_CNT);
  tolua_constant(tolua_S,"MAX_LINEUP_CNT",MAX_LINEUP_CNT);
  tolua_constant(tolua_S,"MAX_DEFAULTTEAM_HERO_CNT",MAX_DEFAULTTEAM_HERO_CNT);
  tolua_constant(tolua_S,"MAX_DEFAULTTEAM_CNT",MAX_DEFAULTTEAM_CNT);
  tolua_constant(tolua_S,"MAX_TEAM_HERO_CNT",MAX_TEAM_HERO_CNT);
  tolua_constant(tolua_S,"MAX_SELFARMY_CNT",MAX_SELFARMY_CNT);
  tolua_constant(tolua_S,"MAX_ENEMYARMY_CNT",MAX_ENEMYARMY_CNT);
  tolua_constant(tolua_S,"MAX_ALLIARMY_CNT",MAX_ALLIARMY_CNT);
  tolua_constant(tolua_S,"MAX_PAIQIAN_ALLIARMY_CNT",MAX_PAIQIAN_ALLIARMY_CNT);
  tolua_constant(tolua_S,"MAX_CITYDEF_CNT",MAX_CITYDEF_CNT);
  tolua_constant(tolua_S,"MAX_ROLEINTRO_ARR_LEN",MAX_ROLEINTRO_ARR_LEN);
  tolua_constant(tolua_S,"MAX_ROLEINTRO_LEN",MAX_ROLEINTRO_LEN);
  tolua_constant(tolua_S,"MAX_COLLECTOR_CNT",MAX_COLLECTOR_CNT);
  tolua_constant(tolua_S,"MAX_INVITE_JOIN_ALLI_CNT",MAX_INVITE_JOIN_ALLI_CNT);
  tolua_constant(tolua_S,"MAX_ALLINAME_ARR_LEN",MAX_ALLINAME_ARR_LEN);
  tolua_constant(tolua_S,"MAX_TRADING_ROLES_CNT",MAX_TRADING_ROLES_CNT);
  tolua_constant(tolua_S,"MAX_ACT_TERRACE_COUNT",MAX_ACT_TERRACE_COUNT);
  tolua_constant(tolua_S,"MAX_ACTREWARDS_CNT",MAX_ACTREWARDS_CNT);
  tolua_constant(tolua_S,"MAX_SIGNINREWARDS_CNT",MAX_SIGNINREWARDS_CNT);
  tolua_constant(tolua_S,"MAX_SIGNINREWARDS_CNT_EX",MAX_SIGNINREWARDS_CNT_EX);
  tolua_constant(tolua_S,"MAX_ACTVALTASKS_CNT",MAX_ACTVALTASKS_CNT);
  tolua_constant(tolua_S,"MAX_FORCELINEUPCFG_CNT",MAX_FORCELINEUPCFG_CNT);
  tolua_constant(tolua_S,"MAX_YD_LVL_IDS_CNT",MAX_YD_LVL_IDS_CNT);
  tolua_constant(tolua_S,"MAX_BD_LVL_IDS_CNT",MAX_BD_LVL_IDS_CNT);
  tolua_constant(tolua_S,"MAX_BUY_ITEMS_CNT",MAX_BUY_ITEMS_CNT);
  tolua_constant(tolua_S,"MAX_CTLCFG_BTIMAP_CNT",MAX_CTLCFG_BTIMAP_CNT);
  tolua_constant(tolua_S,"MAX_PAYACT_GIFT_CNT",MAX_PAYACT_GIFT_CNT);
  tolua_constant(tolua_S,"MAX_WAIT_BUILDS_CNT",MAX_WAIT_BUILDS_CNT);
  tolua_constant(tolua_S,"MAX_CDKEY_CNT",MAX_CDKEY_CNT);
  tolua_constant(tolua_S,"MAX_HELPTIP_CNT",MAX_HELPTIP_CNT);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SInBuild","SInBuild","",tolua_collect_SInBuild);
  #else
  tolua_cclass(tolua_S,"SInBuild","SInBuild","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SInBuild");
   tolua_variable(tolua_S,"ulId",tolua_get_SInBuild_unsigned_ulId,tolua_set_SInBuild_unsigned_ulId);
   tolua_variable(tolua_S,"ulResId",tolua_get_SInBuild_unsigned_ulResId,tolua_set_SInBuild_unsigned_ulResId);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SInBuild_unsigned_ucLevel,tolua_set_SInBuild_unsigned_ucLevel);
   tolua_variable(tolua_S,"ucState",tolua_get_SInBuild_unsigned_ucState,tolua_set_SInBuild_unsigned_ucState);
   tolua_variable(tolua_S,"ulStoptime",tolua_get_SInBuild_unsigned_ulStoptime,tolua_set_SInBuild_unsigned_ulStoptime);
   tolua_variable(tolua_S,"ulDuration",tolua_get_SInBuild_unsigned_ulDuration,tolua_set_SInBuild_unsigned_ulDuration);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SInBuildList","SInBuildList","",NULL);
  tolua_beginmodule(tolua_S,"SInBuildList");
   tolua_variable(tolua_S,"ucTotal",tolua_get_SInBuildList_unsigned_ucTotal,tolua_set_SInBuildList_unsigned_ucTotal);
   tolua_array(tolua_S,"astInBuilds",tolua_get_tqAllTolua_SInBuildList_astInBuilds,tolua_set_tqAllTolua_SInBuildList_astInBuilds);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCityRes","SCityRes","",NULL);
  tolua_beginmodule(tolua_S,"SCityRes");
   tolua_variable(tolua_S,"ucLevel",tolua_get_SCityRes_unsigned_ucLevel,tolua_set_SCityRes_unsigned_ucLevel);
   tolua_variable(tolua_S,"ulBuildVal",tolua_get_SCityRes_unsigned_ulBuildVal,tolua_set_SCityRes_unsigned_ulBuildVal);
   tolua_variable(tolua_S,"ulHurtBuildVal",tolua_get_SCityRes_unsigned_ulHurtBuildVal,tolua_set_SCityRes_unsigned_ulHurtBuildVal);
   tolua_variable(tolua_S,"todayLostedBuildTime",tolua_get_SCityRes_unsigned_todayLostedBuildTime,tolua_set_SCityRes_unsigned_todayLostedBuildTime);
   tolua_variable(tolua_S,"todayLostedBuildVal",tolua_get_SCityRes_unsigned_todayLostedBuildVal,tolua_set_SCityRes_unsigned_todayLostedBuildVal);
   tolua_variable(tolua_S,"lIdlePopu",tolua_get_SCityRes_lIdlePopu,tolua_set_SCityRes_lIdlePopu);
   tolua_variable(tolua_S,"ullWood",tolua_get_SCityRes_unsigned_ullWood,tolua_set_SCityRes_unsigned_ullWood);
   tolua_variable(tolua_S,"ullStone",tolua_get_SCityRes_unsigned_ullStone,tolua_set_SCityRes_unsigned_ullStone);
   tolua_variable(tolua_S,"ullIron",tolua_get_SCityRes_unsigned_ullIron,tolua_set_SCityRes_unsigned_ullIron);
   tolua_variable(tolua_S,"ullFood",tolua_get_SCityRes_unsigned_ullFood,tolua_set_SCityRes_unsigned_ullFood);
   tolua_variable(tolua_S,"ullMoney",tolua_get_SCityRes_unsigned_ullMoney,tolua_set_SCityRes_unsigned_ullMoney);
   tolua_variable(tolua_S,"ulMLastTime",tolua_get_SCityRes_unsigned_ulMLastTime,tolua_set_SCityRes_unsigned_ulMLastTime);
   tolua_variable(tolua_S,"ulILastTime",tolua_get_SCityRes_unsigned_ulILastTime,tolua_set_SCityRes_unsigned_ulILastTime);
   tolua_variable(tolua_S,"lastMaxLevel",tolua_get_SCityRes_unsigned_lastMaxLevel,tolua_set_SCityRes_unsigned_lastMaxLevel);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCityDef","SCityDef","",NULL);
  tolua_beginmodule(tolua_S,"SCityDef");
   tolua_array(tolua_S,"defs",tolua_get_tqAllTolua_SCityDef_defs,tolua_set_tqAllTolua_SCityDef_defs);
   tolua_variable(tolua_S,"stopTime",tolua_get_SCityDef_unsigned_stopTime,tolua_set_SCityDef_unsigned_stopTime);
   tolua_variable(tolua_S,"buildResId",tolua_get_SCityDef_unsigned_buildResId,tolua_set_SCityDef_unsigned_buildResId);
   tolua_variable(tolua_S,"buildNumber",tolua_get_SCityDef_unsigned_buildNumber,tolua_set_SCityDef_unsigned_buildNumber);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SEffect","SEffect","",NULL);
  tolua_beginmodule(tolua_S,"SEffect");
   tolua_variable(tolua_S,"id",tolua_get_SEffect_unsigned_id,tolua_set_SEffect_unsigned_id);
   tolua_variable(tolua_S,"val",tolua_get_SEffect_unsigned_val,tolua_set_SEffect_unsigned_val);
   tolua_variable(tolua_S,"unit",tolua_get_SEffect_unsigned_unit,tolua_set_SEffect_unsigned_unit);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCreator","SCreator","",NULL);
  tolua_beginmodule(tolua_S,"SCreator");
   tolua_variable(tolua_S,"type",tolua_get_SCreator_unsigned_type,tolua_set_SCreator_unsigned_type);
   tolua_variable(tolua_S,"id",tolua_get_SCreator_unsigned_id,tolua_set_SCreator_unsigned_id);
   tolua_variable(tolua_S,"skillId",tolua_get_SCreator_unsigned_skillId,tolua_set_SCreator_unsigned_skillId);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SState","SState","",tolua_collect_SState);
  #else
  tolua_cclass(tolua_S,"SState","SState","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SState");
   tolua_variable(tolua_S,"id",tolua_get_SState_unsigned_id,tolua_set_SState_unsigned_id);
   tolua_variable(tolua_S,"type",tolua_get_SState_unsigned_type,tolua_set_SState_unsigned_type);
   tolua_variable(tolua_S,"startTime",tolua_get_SState_unsigned_startTime,tolua_set_SState_unsigned_startTime);
   tolua_variable(tolua_S,"lastTime",tolua_get_SState_unsigned_lastTime,tolua_set_SState_unsigned_lastTime);
   tolua_variable(tolua_S,"duration",tolua_get_SState_unsigned_duration,tolua_set_SState_unsigned_duration);
   tolua_variable(tolua_S,"isOnline",tolua_get_SState_unsigned_isOnline,tolua_set_SState_unsigned_isOnline);
   tolua_variable(tolua_S,"creator",tolua_get_SState_creator,tolua_set_SState_creator);
   tolua_variable(tolua_S,"effect",tolua_get_SState_effect,tolua_set_SState_effect);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SStateList","SStateList","",NULL);
  tolua_beginmodule(tolua_S,"SStateList");
   tolua_variable(tolua_S,"count",tolua_get_SStateList_unsigned_count,tolua_set_SStateList_unsigned_count);
   tolua_array(tolua_S,"states",tolua_get_tqAllTolua_SStateList_states,tolua_set_tqAllTolua_SStateList_states);
   tolua_variable(tolua_S,"lastStateId",tolua_get_SStateList_unsigned_lastStateId,tolua_set_SStateList_unsigned_lastStateId);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SCity","SCity","",tolua_collect_SCity);
  #else
  tolua_cclass(tolua_S,"SCity","SCity","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SCity");
   tolua_variable(tolua_S,"ucType",tolua_get_SCity_unsigned_ucType,tolua_set_SCity_unsigned_ucType);
   tolua_variable(tolua_S,"stInBuilds",tolua_get_SCity_stInBuilds,tolua_set_SCity_stInBuilds);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SPos","SPos","",NULL);
  tolua_beginmodule(tolua_S,"SPos");
   tolua_variable(tolua_S,"x",tolua_get_SPos_x,tolua_set_SPos_x);
   tolua_variable(tolua_S,"y",tolua_get_SPos_y,tolua_set_SPos_y);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SSelfField","SSelfField","",tolua_collect_SSelfField);
  #else
  tolua_cclass(tolua_S,"SSelfField","SSelfField","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SSelfField");
   tolua_variable(tolua_S,"gridId",tolua_get_SSelfField_unsigned_gridId,tolua_set_SSelfField_unsigned_gridId);
   tolua_variable(tolua_S,"startTime",tolua_get_SSelfField_unsigned_startTime,tolua_set_SSelfField_unsigned_startTime);
   tolua_variable(tolua_S,"soldierNumber",tolua_get_SSelfField_unsigned_soldierNumber,tolua_set_SSelfField_unsigned_soldierNumber);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SExchangeTodayTimes","SExchangeTodayTimes","",NULL);
  tolua_beginmodule(tolua_S,"SExchangeTodayTimes");
   tolua_variable(tolua_S,"curTimes",tolua_get_SExchangeTodayTimes_unsigned_curTimes,tolua_set_SExchangeTodayTimes_unsigned_curTimes);
   tolua_variable(tolua_S,"maxTimes",tolua_get_SExchangeTodayTimes_unsigned_maxTimes,tolua_set_SExchangeTodayTimes_unsigned_maxTimes);
   tolua_variable(tolua_S,"lastTime",tolua_get_SExchangeTodayTimes_unsigned_lastTime,tolua_set_SExchangeTodayTimes_unsigned_lastTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCitys","SCitys","",NULL);
  tolua_beginmodule(tolua_S,"SCitys");
   tolua_variable(tolua_S,"stCRes",tolua_get_SCitys_stCRes,tolua_set_SCitys_stCRes);
   tolua_variable(tolua_S,"cityDef",tolua_get_SCitys_cityDef,tolua_set_SCitys_cityDef);
   tolua_variable(tolua_S,"ucTotal",tolua_get_SCitys_unsigned_ucTotal,tolua_set_SCitys_unsigned_ucTotal);
   tolua_array(tolua_S,"astCitys",tolua_get_tqAllTolua_SCitys_astCitys,tolua_set_tqAllTolua_SCitys_astCitys);
   tolua_variable(tolua_S,"fieldTotal",tolua_get_SCitys_unsigned_fieldTotal,tolua_set_SCitys_unsigned_fieldTotal);
   tolua_array(tolua_S,"selfFields",tolua_get_tqAllTolua_SCitys_selfFields,tolua_set_tqAllTolua_SCitys_selfFields);
   tolua_variable(tolua_S,"exchangeTodayTimes",tolua_get_SCitys_exchangeTodayTimes,tolua_set_SCitys_exchangeTodayTimes);
   tolua_variable(tolua_S,"startAutoBuild",tolua_get_SCitys_unsigned_startAutoBuild,tolua_set_SCitys_unsigned_startAutoBuild);
   tolua_variable(tolua_S,"waitBuildCount",tolua_get_SCitys_waitBuildCount,tolua_set_SCitys_waitBuildCount);
   tolua_array(tolua_S,"waitBuilds",tolua_get_tqAllTolua_SCitys_waitBuilds,tolua_set_tqAllTolua_SCitys_waitBuilds);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SOneHole","SOneHole","",NULL);
  tolua_beginmodule(tolua_S,"SOneHole");
   tolua_variable(tolua_S,"usAttr",tolua_get_SOneHole_unsigned_usAttr,tolua_set_SOneHole_unsigned_usAttr);
   tolua_variable(tolua_S,"ulIdxOrVal",tolua_get_SOneHole_unsigned_ulIdxOrVal,tolua_set_SOneHole_unsigned_ulIdxOrVal);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SFixVar","SFixVar","",NULL);
  tolua_beginmodule(tolua_S,"SFixVar");
   tolua_variable(tolua_S,"ucIcon",tolua_get_SFixVar_unsigned_ucIcon,tolua_set_SFixVar_unsigned_ucIcon);
   tolua_variable(tolua_S,"ulCityId",tolua_get_SFixVar_unsigned_ulCityId,tolua_set_SFixVar_unsigned_ulCityId);
   tolua_variable(tolua_S,"ulCPosX",tolua_get_SFixVar_unsigned_ulCPosX,tolua_set_SFixVar_unsigned_ulCPosX);
   tolua_variable(tolua_S,"ulCPosY",tolua_get_SFixVar_unsigned_ulCPosY,tolua_set_SFixVar_unsigned_ulCPosY);
   tolua_variable(tolua_S,"ulCreateTime",tolua_get_SFixVar_unsigned_ulCreateTime,tolua_set_SFixVar_unsigned_ulCreateTime);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SAttr","SAttr","",tolua_collect_SAttr);
  #else
  tolua_cclass(tolua_S,"SAttr","SAttr","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SAttr");
   tolua_variable(tolua_S,"usAttr",tolua_get_SAttr_unsigned_usAttr,tolua_set_SAttr_unsigned_usAttr);
   tolua_variable(tolua_S,"ulVal",tolua_get_SAttr_ulVal,tolua_set_SAttr_ulVal);
   tolua_variable(tolua_S,"ucUnit",tolua_get_SAttr_unsigned_ucUnit,tolua_set_SAttr_unsigned_ucUnit);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SAttrEx","SAttrEx","",tolua_collect_SAttrEx);
  #else
  tolua_cclass(tolua_S,"SAttrEx","SAttrEx","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SAttrEx");
   tolua_variable(tolua_S,"attr",tolua_get_SAttrEx_unsigned_attr,tolua_set_SAttrEx_unsigned_attr);
   tolua_variable(tolua_S,"val",tolua_get_SAttrEx_unsigned_val,tolua_set_SAttrEx_unsigned_val);
   tolua_variable(tolua_S,"unit",tolua_get_SAttrEx_unsigned_unit,tolua_set_SAttrEx_unsigned_unit);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SRoleAttrList","SRoleAttrList","",NULL);
  tolua_beginmodule(tolua_S,"SRoleAttrList");
   tolua_variable(tolua_S,"ulNSLastTime",tolua_get_SRoleAttrList_unsigned_ulNSLastTime,tolua_set_SRoleAttrList_unsigned_ulNSLastTime);
   tolua_variable(tolua_S,"ucCount",tolua_get_SRoleAttrList_unsigned_ucCount,tolua_set_SRoleAttrList_unsigned_ucCount);
   tolua_array(tolua_S,"astAttrs",tolua_get_tqAllTolua_SRoleAttrList_astAttrs,tolua_set_tqAllTolua_SRoleAttrList_astAttrs);
   tolua_variable(tolua_S,"lastPSRefreshDay",tolua_get_SRoleAttrList_unsigned_lastPSRefreshDay,tolua_set_SRoleAttrList_unsigned_lastPSRefreshDay);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SQQMembership","SQQMembership","",NULL);
  tolua_beginmodule(tolua_S,"SQQMembership");
   tolua_variable(tolua_S,"is_yellow_vip",tolua_get_SQQMembership_unsigned_is_yellow_vip,tolua_set_SQQMembership_unsigned_is_yellow_vip);
   tolua_variable(tolua_S,"is_yellow_year_vip",tolua_get_SQQMembership_unsigned_is_yellow_year_vip,tolua_set_SQQMembership_unsigned_is_yellow_year_vip);
   tolua_variable(tolua_S,"yellow_vip_level",tolua_get_SQQMembership_unsigned_yellow_vip_level,tolua_set_SQQMembership_unsigned_yellow_vip_level);
   tolua_variable(tolua_S,"is_yellow_high_vip",tolua_get_SQQMembership_unsigned_is_yellow_high_vip,tolua_set_SQQMembership_unsigned_is_yellow_high_vip);
   tolua_variable(tolua_S,"is_blue_vip",tolua_get_SQQMembership_unsigned_is_blue_vip,tolua_set_SQQMembership_unsigned_is_blue_vip);
   tolua_variable(tolua_S,"is_blue_year_vip",tolua_get_SQQMembership_unsigned_is_blue_year_vip,tolua_set_SQQMembership_unsigned_is_blue_year_vip);
   tolua_variable(tolua_S,"blue_vip_level",tolua_get_SQQMembership_unsigned_blue_vip_level,tolua_set_SQQMembership_unsigned_blue_vip_level);
   tolua_variable(tolua_S,"is_super_blue_vip",tolua_get_SQQMembership_unsigned_is_super_blue_vip,tolua_set_SQQMembership_unsigned_is_super_blue_vip);
   tolua_variable(tolua_S,"_3366_grow_level",tolua_get_SQQMembership_unsigned__3366_grow_level,tolua_set_SQQMembership_unsigned__3366_grow_level);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SBaseInfo","SBaseInfo","",NULL);
  tolua_beginmodule(tolua_S,"SBaseInfo");
   tolua_variable(tolua_S,"ucGM",tolua_get_SBaseInfo_unsigned_ucGM,tolua_set_SBaseInfo_unsigned_ucGM);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SBaseInfo_unsigned_ucLevel,tolua_set_SBaseInfo_unsigned_ucLevel);
   tolua_variable(tolua_S,"ulPrestige",tolua_get_SBaseInfo_unsigned_ulPrestige,tolua_set_SBaseInfo_unsigned_ulPrestige);
   tolua_variable(tolua_S,"ulCityHonor",tolua_get_SBaseInfo_unsigned_ulCityHonor,tolua_set_SBaseInfo_unsigned_ulCityHonor);
   tolua_variable(tolua_S,"ulCityCD",tolua_get_SBaseInfo_unsigned_ulCityCD,tolua_set_SBaseInfo_unsigned_ulCityCD);
   tolua_variable(tolua_S,"ullAlliance",tolua_get_SBaseInfo_unsigned_ullAlliance,tolua_set_SBaseInfo_unsigned_ullAlliance);
   tolua_variable(tolua_S,"ucState",tolua_get_SBaseInfo_unsigned_ucState,tolua_set_SBaseInfo_unsigned_ucState);
   tolua_variable(tolua_S,"stAttrs",tolua_get_SBaseInfo_stAttrs,tolua_set_SBaseInfo_stAttrs);
   tolua_variable(tolua_S,"cityModel",tolua_get_SBaseInfo_unsigned_cityModel,tolua_set_SBaseInfo_unsigned_cityModel);
   tolua_variable(tolua_S,"introduction",tolua_get_SBaseInfo_introduction,tolua_set_SBaseInfo_introduction);
   tolua_variable(tolua_S,"qqMembership",tolua_get_SBaseInfo_qqMembership,tolua_set_SBaseInfo_qqMembership);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"STask","STask","",tolua_collect_STask);
  #else
  tolua_cclass(tolua_S,"STask","STask","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"STask");
   tolua_variable(tolua_S,"taskId",tolua_get_STask_unsigned_taskId,tolua_set_STask_unsigned_taskId);
   tolua_variable(tolua_S,"state",tolua_get_STask_unsigned_state,tolua_set_STask_unsigned_state);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SDoingRoleTask","SDoingRoleTask","",NULL);
  tolua_beginmodule(tolua_S,"SDoingRoleTask");
   tolua_variable(tolua_S,"taskId",tolua_get_SDoingRoleTask_unsigned_taskId,tolua_set_SDoingRoleTask_unsigned_taskId);
   tolua_variable(tolua_S,"stopTime",tolua_get_SDoingRoleTask_unsigned_stopTime,tolua_set_SDoingRoleTask_unsigned_stopTime);
   tolua_variable(tolua_S,"cdStopTime",tolua_get_SDoingRoleTask_unsigned_cdStopTime,tolua_set_SDoingRoleTask_unsigned_cdStopTime);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SActValTask","SActValTask","",tolua_collect_SActValTask);
  #else
  tolua_cclass(tolua_S,"SActValTask","SActValTask","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SActValTask");
   tolua_variable(tolua_S,"taskId",tolua_get_SActValTask_unsigned_taskId,tolua_set_SActValTask_unsigned_taskId);
   tolua_variable(tolua_S,"times",tolua_get_SActValTask_unsigned_times,tolua_set_SActValTask_unsigned_times);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SActTask","SActTask","",tolua_collect_SActTask);
  #else
  tolua_cclass(tolua_S,"SActTask","SActTask","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SActTask");
   tolua_variable(tolua_S,"taskId",tolua_get_SActTask_unsigned_taskId,tolua_set_SActTask_unsigned_taskId);
   tolua_variable(tolua_S,"state",tolua_get_SActTask_unsigned_state,tolua_set_SActTask_unsigned_state);
   tolua_variable(tolua_S,"times",tolua_get_SActTask_unsigned_times,tolua_set_SActTask_unsigned_times);
   tolua_variable(tolua_S,"maxTimes",tolua_get_SActTask_unsigned_maxTimes,tolua_set_SActTask_unsigned_maxTimes);
   tolua_variable(tolua_S,"startTime",tolua_get_SActTask_unsigned_startTime,tolua_set_SActTask_unsigned_startTime);
   tolua_variable(tolua_S,"stopTime",tolua_get_SActTask_unsigned_stopTime,tolua_set_SActTask_unsigned_stopTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SActivityVal","SActivityVal","",NULL);
  tolua_beginmodule(tolua_S,"SActivityVal");
   tolua_variable(tolua_S,"refreshActValTime",tolua_get_SActivityVal_unsigned_refreshActValTime,tolua_set_SActivityVal_unsigned_refreshActValTime);
   tolua_variable(tolua_S,"val",tolua_get_SActivityVal_unsigned_val,tolua_set_SActivityVal_unsigned_val);
   tolua_variable(tolua_S,"gotActRewardTime",tolua_get_SActivityVal_unsigned_gotActRewardTime,tolua_set_SActivityVal_unsigned_gotActRewardTime);
   tolua_array(tolua_S,"gotActRewards",tolua_get_tqAllTolua_SActivityVal_gotActRewards,tolua_set_tqAllTolua_SActivityVal_gotActRewards);
   tolua_variable(tolua_S,"refreshSigninTime",tolua_get_SActivityVal_unsigned_refreshSigninTime,tolua_set_SActivityVal_unsigned_refreshSigninTime);
   tolua_variable(tolua_S,"todaySign",tolua_get_SActivityVal_unsigned_todaySign,tolua_set_SActivityVal_unsigned_todaySign);
   tolua_variable(tolua_S,"signinDaysTime",tolua_get_SActivityVal_unsigned_signinDaysTime,tolua_set_SActivityVal_unsigned_signinDaysTime);
   tolua_variable(tolua_S,"signinDays",tolua_get_SActivityVal_unsigned_signinDays,tolua_set_SActivityVal_unsigned_signinDays);
   tolua_variable(tolua_S,"gotSigninRewardTime",tolua_get_SActivityVal_unsigned_gotSigninRewardTime,tolua_set_SActivityVal_unsigned_gotSigninRewardTime);
   tolua_array(tolua_S,"gotSigninRewards",tolua_get_tqAllTolua_SActivityVal_gotSigninRewards,tolua_set_tqAllTolua_SActivityVal_gotSigninRewards);
   tolua_variable(tolua_S,"refreshTaskTime",tolua_get_SActivityVal_unsigned_refreshTaskTime,tolua_set_SActivityVal_unsigned_refreshTaskTime);
   tolua_variable(tolua_S,"count",tolua_get_SActivityVal_count,tolua_set_SActivityVal_count);
   tolua_array(tolua_S,"tasks",tolua_get_tqAllTolua_SActivityVal_tasks,tolua_set_tqAllTolua_SActivityVal_tasks);
   tolua_variable(tolua_S,"gotOnlineGoodsTime",tolua_get_SActivityVal_unsigned_gotOnlineGoodsTime,tolua_set_SActivityVal_unsigned_gotOnlineGoodsTime);
   tolua_variable(tolua_S,"gotGoodsTimes",tolua_get_SActivityVal_unsigned_gotGoodsTimes,tolua_set_SActivityVal_unsigned_gotGoodsTimes);
   tolua_array(tolua_S,"gotSigninRewardsEx",tolua_get_tqAllTolua_SActivityVal_gotSigninRewardsEx,tolua_set_tqAllTolua_SActivityVal_gotSigninRewardsEx);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SOnlineTask","SOnlineTask","",NULL);
  tolua_beginmodule(tolua_S,"SOnlineTask");
   tolua_variable(tolua_S,"taskId",tolua_get_SOnlineTask_unsigned_taskId,tolua_set_SOnlineTask_unsigned_taskId);
   tolua_variable(tolua_S,"startTime",tolua_get_SOnlineTask_unsigned_startTime,tolua_set_SOnlineTask_unsigned_startTime);
   tolua_variable(tolua_S,"lastTime",tolua_get_SOnlineTask_unsigned_lastTime,tolua_set_SOnlineTask_unsigned_lastTime);
   tolua_variable(tolua_S,"lastLapsed",tolua_get_SOnlineTask_unsigned_lastLapsed,tolua_set_SOnlineTask_unsigned_lastLapsed);
   tolua_variable(tolua_S,"isCircled",tolua_get_SOnlineTask_unsigned_isCircled,tolua_set_SOnlineTask_unsigned_isCircled);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SNewcomerTask","SNewcomerTask","",NULL);
  tolua_beginmodule(tolua_S,"SNewcomerTask");
   tolua_variable(tolua_S,"curTaskId",tolua_get_SNewcomerTask_unsigned_curTaskId,tolua_set_SNewcomerTask_unsigned_curTaskId);
   tolua_variable(tolua_S,"isEnd",tolua_get_SNewcomerTask_unsigned_isEnd,tolua_set_SNewcomerTask_unsigned_isEnd);
   tolua_variable(tolua_S,"isGlobalTipEnd",tolua_get_SNewcomerTask_unsigned_isGlobalTipEnd,tolua_set_SNewcomerTask_unsigned_isGlobalTipEnd);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SYellowDiamondTask","SYellowDiamondTask","",NULL);
  tolua_beginmodule(tolua_S,"SYellowDiamondTask");
   tolua_variable(tolua_S,"gotNewgift",tolua_get_SYellowDiamondTask_gotNewgift,tolua_set_SYellowDiamondTask_gotNewgift);
   tolua_variable(tolua_S,"gotCommGift",tolua_get_SYellowDiamondTask_unsigned_gotCommGift,tolua_set_SYellowDiamondTask_unsigned_gotCommGift);
   tolua_variable(tolua_S,"gotYearGift",tolua_get_SYellowDiamondTask_unsigned_gotYearGift,tolua_set_SYellowDiamondTask_unsigned_gotYearGift);
   tolua_variable(tolua_S,"lvlCount",tolua_get_SYellowDiamondTask_lvlCount,tolua_set_SYellowDiamondTask_lvlCount);
   tolua_array(tolua_S,"gotLvlGifts",tolua_get_tqAllTolua_SYellowDiamondTask_gotLvlGifts,tolua_set_tqAllTolua_SYellowDiamondTask_gotLvlGifts);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SBlueDiamondTask","SBlueDiamondTask","",NULL);
  tolua_beginmodule(tolua_S,"SBlueDiamondTask");
   tolua_variable(tolua_S,"gotNewgift",tolua_get_SBlueDiamondTask_gotNewgift,tolua_set_SBlueDiamondTask_gotNewgift);
   tolua_variable(tolua_S,"gotCommGift",tolua_get_SBlueDiamondTask_unsigned_gotCommGift,tolua_set_SBlueDiamondTask_unsigned_gotCommGift);
   tolua_variable(tolua_S,"gotYearGift",tolua_get_SBlueDiamondTask_unsigned_gotYearGift,tolua_set_SBlueDiamondTask_unsigned_gotYearGift);
   tolua_variable(tolua_S,"gotHighGift",tolua_get_SBlueDiamondTask_unsigned_gotHighGift,tolua_set_SBlueDiamondTask_unsigned_gotHighGift);
   tolua_variable(tolua_S,"lvlCount",tolua_get_SBlueDiamondTask_lvlCount,tolua_set_SBlueDiamondTask_lvlCount);
   tolua_array(tolua_S,"gotLvlGifts",tolua_get_tqAllTolua_SBlueDiamondTask_gotLvlGifts,tolua_set_tqAllTolua_SBlueDiamondTask_gotLvlGifts);
   tolua_variable(tolua_S,"got3366Gift",tolua_get_SBlueDiamondTask_unsigned_got3366Gift,tolua_set_SBlueDiamondTask_unsigned_got3366Gift);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SPayAct","SPayAct","",NULL);
  tolua_beginmodule(tolua_S,"SPayAct");
   tolua_variable(tolua_S,"lastPayTime",tolua_get_SPayAct_unsigned_lastPayTime,tolua_set_SPayAct_unsigned_lastPayTime);
   tolua_variable(tolua_S,"allGold",tolua_get_SPayAct_unsigned_allGold,tolua_set_SPayAct_unsigned_allGold);
   tolua_variable(tolua_S,"actAllGold",tolua_get_SPayAct_unsigned_actAllGold,tolua_set_SPayAct_unsigned_actAllGold);
   tolua_array(tolua_S,"giftGots",tolua_get_tqAllTolua_SPayAct_giftGots,tolua_set_tqAllTolua_SPayAct_giftGots);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SWorldboss","SWorldboss","",NULL);
  tolua_beginmodule(tolua_S,"SWorldboss");
   tolua_variable(tolua_S,"times",tolua_get_SWorldboss_unsigned_times,tolua_set_SWorldboss_unsigned_times);
   tolua_variable(tolua_S,"guwuLevel",tolua_get_SWorldboss_unsigned_guwuLevel,tolua_set_SWorldboss_unsigned_guwuLevel);
   tolua_variable(tolua_S,"gotGift",tolua_get_SWorldboss_unsigned_gotGift,tolua_set_SWorldboss_unsigned_gotGift);
   tolua_variable(tolua_S,"refreshTime",tolua_get_SWorldboss_unsigned_refreshTime,tolua_set_SWorldboss_unsigned_refreshTime);
   tolua_variable(tolua_S,"getPersonRankGiftTime",tolua_get_SWorldboss_unsigned_getPersonRankGiftTime,tolua_set_SWorldboss_unsigned_getPersonRankGiftTime);
   tolua_variable(tolua_S,"getCountryRankGiftTime",tolua_get_SWorldboss_unsigned_getCountryRankGiftTime,tolua_set_SWorldboss_unsigned_getCountryRankGiftTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSendReward","SSendReward","",NULL);
  tolua_beginmodule(tolua_S,"SSendReward");
   tolua_variable(tolua_S,"sendFirstHero",tolua_get_SSendReward_unsigned_sendFirstHero,tolua_set_SSendReward_unsigned_sendFirstHero);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"STaskList","STaskList","",NULL);
  tolua_beginmodule(tolua_S,"STaskList");
   tolua_variable(tolua_S,"count",tolua_get_STaskList_count,tolua_set_STaskList_count);
   tolua_array(tolua_S,"tasks",tolua_get_tqAllTolua_STaskList_tasks,tolua_set_tqAllTolua_STaskList_tasks);
   tolua_variable(tolua_S,"doingRoleTask",tolua_get_STaskList_doingRoleTask,tolua_set_STaskList_doingRoleTask);
   tolua_variable(tolua_S,"refreshTime",tolua_get_STaskList_unsigned_refreshTime,tolua_set_STaskList_unsigned_refreshTime);
   tolua_variable(tolua_S,"everydayCount",tolua_get_STaskList_everydayCount,tolua_set_STaskList_everydayCount);
   tolua_array(tolua_S,"everydayTasks",tolua_get_tqAllTolua_STaskList_everydayTasks,tolua_set_tqAllTolua_STaskList_everydayTasks);
   tolua_variable(tolua_S,"prestigeLastTime",tolua_get_STaskList_unsigned_prestigeLastTime,tolua_set_STaskList_unsigned_prestigeLastTime);
   tolua_variable(tolua_S,"activityVal",tolua_get_STaskList_activityVal,tolua_set_STaskList_activityVal);
   tolua_variable(tolua_S,"onlineTask",tolua_get_STaskList_onlineTask,tolua_set_STaskList_onlineTask);
   tolua_variable(tolua_S,"newComerTask",tolua_get_STaskList_newComerTask,tolua_set_STaskList_newComerTask);
   tolua_variable(tolua_S,"actTaskCount",tolua_get_STaskList_actTaskCount,tolua_set_STaskList_actTaskCount);
   tolua_array(tolua_S,"actTasks",tolua_get_tqAllTolua_STaskList_actTasks,tolua_set_tqAllTolua_STaskList_actTasks);
   tolua_variable(tolua_S,"ydtasks",tolua_get_STaskList_ydtasks,tolua_set_STaskList_ydtasks);
   tolua_variable(tolua_S,"payAct",tolua_get_STaskList_payAct,tolua_set_STaskList_payAct);
   tolua_variable(tolua_S,"bdtasks",tolua_get_STaskList_bdtasks,tolua_set_STaskList_bdtasks);
   tolua_variable(tolua_S,"worldboss",tolua_get_STaskList_worldboss,tolua_set_STaskList_worldboss);
   tolua_variable(tolua_S,"sendReward",tolua_get_STaskList_sendReward,tolua_set_STaskList_sendReward);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SSoldier","SSoldier","",tolua_collect_SSoldier);
  #else
  tolua_cclass(tolua_S,"SSoldier","SSoldier","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SSoldier");
   tolua_variable(tolua_S,"resid",tolua_get_SSoldier_unsigned_resid,tolua_set_SSoldier_unsigned_resid);
   tolua_variable(tolua_S,"number",tolua_get_SSoldier_unsigned_number,tolua_set_SSoldier_unsigned_number);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SDeclare","SDeclare","",NULL);
  tolua_beginmodule(tolua_S,"SDeclare");
   tolua_variable(tolua_S,"state",tolua_get_SDeclare_unsigned_state,tolua_set_SDeclare_unsigned_state);
   tolua_variable(tolua_S,"stoptime",tolua_get_SDeclare_unsigned_stoptime,tolua_set_SDeclare_unsigned_stoptime);
   tolua_variable(tolua_S,"id",tolua_get_SDeclare_unsigned_id,tolua_set_SDeclare_unsigned_id);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SDefaultTeam","SDefaultTeam","",tolua_collect_SDefaultTeam);
  #else
  tolua_cclass(tolua_S,"SDefaultTeam","SDefaultTeam","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SDefaultTeam");
   tolua_variable(tolua_S,"lineupId",tolua_get_SDefaultTeam_unsigned_lineupId,tolua_set_SDefaultTeam_unsigned_lineupId);
   tolua_array(tolua_S,"heroIds",tolua_get_tqAllTolua_SDefaultTeam_heroIds,tolua_set_tqAllTolua_SDefaultTeam_heroIds);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"STodayFightTimes","STodayFightTimes","",NULL);
  tolua_beginmodule(tolua_S,"STodayFightTimes");
   tolua_variable(tolua_S,"taofa",tolua_get_STodayFightTimes_unsigned_taofa,tolua_set_STodayFightTimes_unsigned_taofa);
   tolua_variable(tolua_S,"cuihui",tolua_get_STodayFightTimes_unsigned_cuihui,tolua_set_STodayFightTimes_unsigned_cuihui);
   tolua_variable(tolua_S,"tiaoxin",tolua_get_STodayFightTimes_unsigned_tiaoxin,tolua_set_STodayFightTimes_unsigned_tiaoxin);
   tolua_variable(tolua_S,"fightowner",tolua_get_STodayFightTimes_unsigned_fightowner,tolua_set_STodayFightTimes_unsigned_fightowner);
   tolua_variable(tolua_S,"lastTime",tolua_get_STodayFightTimes_unsigned_lastTime,tolua_set_STodayFightTimes_unsigned_lastTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSimpleHero","SSimpleHero","",NULL);
  tolua_beginmodule(tolua_S,"SSimpleHero");
   tolua_variable(tolua_S,"id",tolua_get_SSimpleHero_unsigned_id,tolua_set_SSimpleHero_unsigned_id);
   tolua_variable(tolua_S,"name",tolua_get_SSimpleHero_name,tolua_set_SSimpleHero_name);
   tolua_variable(tolua_S,"level",tolua_get_SSimpleHero_unsigned_level,tolua_set_SSimpleHero_unsigned_level);
   tolua_variable(tolua_S,"attrCount",tolua_get_SSimpleHero_unsigned_attrCount,tolua_set_SSimpleHero_unsigned_attrCount);
   tolua_array(tolua_S,"attrs",tolua_get_tqAllTolua_SSimpleHero_attrs,tolua_set_tqAllTolua_SSimpleHero_attrs);
   tolua_variable(tolua_S,"soldier",tolua_get_SSimpleHero_soldier,tolua_set_SSimpleHero_soldier);
   tolua_variable(tolua_S,"lineupPos",tolua_get_SSimpleHero_unsigned_lineupPos,tolua_set_SSimpleHero_unsigned_lineupPos);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SDefArmy","SDefArmy","",NULL);
  tolua_beginmodule(tolua_S,"SDefArmy");
   tolua_variable(tolua_S,"lineupId",tolua_get_SDefArmy_unsigned_lineupId,tolua_set_SDefArmy_unsigned_lineupId);
   tolua_variable(tolua_S,"heroCount",tolua_get_SDefArmy_unsigned_heroCount,tolua_set_SDefArmy_unsigned_heroCount);
   tolua_array(tolua_S,"heros",tolua_get_tqAllTolua_SDefArmy_heros,tolua_set_tqAllTolua_SDefArmy_heros);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"STowerArmy","STowerArmy","",NULL);
  tolua_beginmodule(tolua_S,"STowerArmy");
   tolua_array(tolua_S,"soldiers",tolua_get_tqAllTolua_STowerArmy_soldiers,tolua_set_tqAllTolua_STowerArmy_soldiers);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SFightTodayHonor","SFightTodayHonor","",NULL);
  tolua_beginmodule(tolua_S,"SFightTodayHonor");
   tolua_variable(tolua_S,"hasRefreshTime",tolua_get_SFightTodayHonor_unsigned_hasRefreshTime,tolua_set_SFightTodayHonor_unsigned_hasRefreshTime);
   tolua_variable(tolua_S,"hasHonor",tolua_get_SFightTodayHonor_unsigned_hasHonor,tolua_set_SFightTodayHonor_unsigned_hasHonor);
   tolua_variable(tolua_S,"getRefreshTime",tolua_get_SFightTodayHonor_unsigned_getRefreshTime,tolua_set_SFightTodayHonor_unsigned_getRefreshTime);
   tolua_variable(tolua_S,"getHonor",tolua_get_SFightTodayHonor_unsigned_getHonor,tolua_set_SFightTodayHonor_unsigned_getHonor);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SMilitary","SMilitary","",NULL);
  tolua_beginmodule(tolua_S,"SMilitary");
   tolua_variable(tolua_S,"favoriteCount",tolua_get_SMilitary_unsigned_favoriteCount,tolua_set_SMilitary_unsigned_favoriteCount);
   tolua_array(tolua_S,"favorites",tolua_get_tqAllTolua_SMilitary_favorites,tolua_set_tqAllTolua_SMilitary_favorites);
   tolua_variable(tolua_S,"enemyCount",tolua_get_SMilitary_unsigned_enemyCount,tolua_set_SMilitary_unsigned_enemyCount);
   tolua_array(tolua_S,"enemys",tolua_get_tqAllTolua_SMilitary_enemys,tolua_set_tqAllTolua_SMilitary_enemys);
   tolua_variable(tolua_S,"lineupCount",tolua_get_SMilitary_unsigned_lineupCount,tolua_set_SMilitary_unsigned_lineupCount);
   tolua_array(tolua_S,"lineups",tolua_get_tqAllTolua_SMilitary_lineups,tolua_set_tqAllTolua_SMilitary_lineups);
   tolua_array(tolua_S,"defaultTeams",tolua_get_tqAllTolua_SMilitary_defaultTeams,tolua_set_tqAllTolua_SMilitary_defaultTeams);
   tolua_variable(tolua_S,"todayFightTimes",tolua_get_SMilitary_todayFightTimes,tolua_set_SMilitary_todayFightTimes);
   tolua_variable(tolua_S,"selfArmyCount",tolua_get_SMilitary_unsigned_selfArmyCount,tolua_set_SMilitary_unsigned_selfArmyCount);
   tolua_array(tolua_S,"selfArmyIds",tolua_get_tqAllTolua_SMilitary_selfArmyIds,tolua_set_tqAllTolua_SMilitary_selfArmyIds);
   tolua_variable(tolua_S,"enemyArmyCount",tolua_get_SMilitary_unsigned_enemyArmyCount,tolua_set_SMilitary_unsigned_enemyArmyCount);
   tolua_array(tolua_S,"enemyArmyIds",tolua_get_tqAllTolua_SMilitary_enemyArmyIds,tolua_set_tqAllTolua_SMilitary_enemyArmyIds);
   tolua_variable(tolua_S,"alliArmyCount",tolua_get_SMilitary_unsigned_alliArmyCount,tolua_set_SMilitary_unsigned_alliArmyCount);
   tolua_array(tolua_S,"alliArmyIds",tolua_get_tqAllTolua_SMilitary_alliArmyIds,tolua_set_tqAllTolua_SMilitary_alliArmyIds);
   tolua_variable(tolua_S,"defArmy",tolua_get_SMilitary_defArmy,tolua_set_SMilitary_defArmy);
   tolua_variable(tolua_S,"towerArmy",tolua_get_SMilitary_towerArmy,tolua_set_SMilitary_towerArmy);
   tolua_variable(tolua_S,"succCopyFieldCount",tolua_get_SMilitary_unsigned_succCopyFieldCount,tolua_set_SMilitary_unsigned_succCopyFieldCount);
   tolua_array(tolua_S,"succCopyFields",tolua_get_tqAllTolua_SMilitary_succCopyFields,tolua_set_tqAllTolua_SMilitary_succCopyFields);
   tolua_variable(tolua_S,"todayHonor",tolua_get_SMilitary_todayHonor,tolua_set_SMilitary_todayHonor);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SInviteJoinAlliance","SInviteJoinAlliance","",tolua_collect_SInviteJoinAlliance);
  #else
  tolua_cclass(tolua_S,"SInviteJoinAlliance","SInviteJoinAlliance","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SInviteJoinAlliance");
   tolua_variable(tolua_S,"allianceId",tolua_get_SInviteJoinAlliance_unsigned_allianceId,tolua_set_SInviteJoinAlliance_unsigned_allianceId);
   tolua_variable(tolua_S,"roleId",tolua_get_SInviteJoinAlliance_unsigned_roleId,tolua_set_SInviteJoinAlliance_unsigned_roleId);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"STradingArea","STradingArea","",NULL);
  tolua_beginmodule(tolua_S,"STradingArea");
   tolua_variable(tolua_S,"stopTime",tolua_get_STradingArea_unsigned_stopTime,tolua_set_STradingArea_unsigned_stopTime);
   tolua_variable(tolua_S,"count",tolua_get_STradingArea_count,tolua_set_STradingArea_count);
   tolua_array(tolua_S,"roleIds",tolua_get_tqAllTolua_STradingArea_roleIds,tolua_set_tqAllTolua_STradingArea_roleIds);
   tolua_variable(tolua_S,"todayTimes",tolua_get_STradingArea_todayTimes,tolua_set_STradingArea_todayTimes);
   tolua_variable(tolua_S,"refreshTime",tolua_get_STradingArea_unsigned_refreshTime,tolua_set_STradingArea_unsigned_refreshTime);
   tolua_variable(tolua_S,"curTimes",tolua_get_STradingArea_unsigned_curTimes,tolua_set_STradingArea_unsigned_curTimes);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SActTower","SActTower","",NULL);
  tolua_beginmodule(tolua_S,"SActTower");
   tolua_variable(tolua_S,"todayEnterTimes",tolua_get_SActTower_unsigned_todayEnterTimes,tolua_set_SActTower_unsigned_todayEnterTimes);
   tolua_variable(tolua_S,"todayRefreshTime",tolua_get_SActTower_unsigned_todayRefreshTime,tolua_set_SActTower_unsigned_todayRefreshTime);
   tolua_variable(tolua_S,"maxLayer",tolua_get_SActTower_unsigned_maxLayer,tolua_set_SActTower_unsigned_maxLayer);
   tolua_variable(tolua_S,"leftLifes",tolua_get_SActTower_unsigned_leftLifes,tolua_set_SActTower_unsigned_leftLifes);
   tolua_variable(tolua_S,"stopTime",tolua_get_SActTower_unsigned_stopTime,tolua_set_SActTower_unsigned_stopTime);
   tolua_variable(tolua_S,"curLayer",tolua_get_SActTower_unsigned_curLayer,tolua_set_SActTower_unsigned_curLayer);
   tolua_variable(tolua_S,"maxTime",tolua_get_SActTower_unsigned_maxTime,tolua_set_SActTower_unsigned_maxTime);
   tolua_variable(tolua_S,"autoStartTime",tolua_get_SActTower_unsigned_autoStartTime,tolua_set_SActTower_unsigned_autoStartTime);
   tolua_variable(tolua_S,"autoToLayer",tolua_get_SActTower_unsigned_autoToLayer,tolua_set_SActTower_unsigned_autoToLayer);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SActTerraceGate","SActTerraceGate","",NULL);
  tolua_beginmodule(tolua_S,"SActTerraceGate");
   tolua_variable(tolua_S,"gateId",tolua_get_SActTerraceGate_unsigned_gateId,tolua_set_SActTerraceGate_unsigned_gateId);
   tolua_variable(tolua_S,"subGateId",tolua_get_SActTerraceGate_unsigned_subGateId,tolua_set_SActTerraceGate_unsigned_subGateId);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SActTerrace","SActTerrace","",NULL);
  tolua_beginmodule(tolua_S,"SActTerrace");
   tolua_variable(tolua_S,"todayEnterTimes",tolua_get_SActTerrace_unsigned_todayEnterTimes,tolua_set_SActTerrace_unsigned_todayEnterTimes);
   tolua_variable(tolua_S,"todayRefreshTime",tolua_get_SActTerrace_unsigned_todayRefreshTime,tolua_set_SActTerrace_unsigned_todayRefreshTime);
   tolua_variable(tolua_S,"maxGate",tolua_get_SActTerrace_maxGate,tolua_set_SActTerrace_maxGate);
   tolua_variable(tolua_S,"leftLifes",tolua_get_SActTerrace_unsigned_leftLifes,tolua_set_SActTerrace_unsigned_leftLifes);
   tolua_variable(tolua_S,"stopTime",tolua_get_SActTerrace_unsigned_stopTime,tolua_set_SActTerrace_unsigned_stopTime);
   tolua_variable(tolua_S,"curGate",tolua_get_SActTerrace_curGate,tolua_set_SActTerrace_curGate);
   tolua_variable(tolua_S,"countResults",tolua_get_SActTerrace_countResults,tolua_set_SActTerrace_countResults);
   tolua_array(tolua_S,"results",tolua_get_tqAllTolua_SActTerrace_results,tolua_set_tqAllTolua_SActTerrace_results);
   tolua_variable(tolua_S,"autoStartTime",tolua_get_SActTerrace_unsigned_autoStartTime,tolua_set_SActTerrace_unsigned_autoStartTime);
   tolua_variable(tolua_S,"autoToSubGateId",tolua_get_SActTerrace_unsigned_autoToSubGateId,tolua_set_SActTerrace_unsigned_autoToSubGateId);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SForceLineupCfg","SForceLineupCfg","",tolua_collect_SForceLineupCfg);
  #else
  tolua_cclass(tolua_S,"SForceLineupCfg","SForceLineupCfg","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SForceLineupCfg");
   tolua_variable(tolua_S,"type",tolua_get_SForceLineupCfg_unsigned_type,tolua_set_SForceLineupCfg_unsigned_type);
   tolua_variable(tolua_S,"lineup",tolua_get_SForceLineupCfg_unsigned_lineup,tolua_set_SForceLineupCfg_unsigned_lineup);
   tolua_variable(tolua_S,"heroCount",tolua_get_SForceLineupCfg_heroCount,tolua_set_SForceLineupCfg_heroCount);
   tolua_array(tolua_S,"heroIds",tolua_get_tqAllTolua_SForceLineupCfg_heroIds,tolua_set_tqAllTolua_SForceLineupCfg_heroIds);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SHelpTip","SHelpTip","",tolua_collect_SHelpTip);
  #else
  tolua_cclass(tolua_S,"SHelpTip","SHelpTip","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SHelpTip");
   tolua_variable(tolua_S,"id",tolua_get_SHelpTip_unsigned_id,tolua_set_SHelpTip_unsigned_id);
   tolua_variable(tolua_S,"times",tolua_get_SHelpTip_unsigned_times,tolua_set_SHelpTip_unsigned_times);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SPlayerClientCfg","SPlayerClientCfg","",NULL);
  tolua_beginmodule(tolua_S,"SPlayerClientCfg");
   tolua_variable(tolua_S,"forceCount",tolua_get_SPlayerClientCfg_forceCount,tolua_set_SPlayerClientCfg_forceCount);
   tolua_array(tolua_S,"forces",tolua_get_tqAllTolua_SPlayerClientCfg_forces,tolua_set_tqAllTolua_SPlayerClientCfg_forces);
   tolua_array(tolua_S,"toggleMap",tolua_get_tqAllTolua_SPlayerClientCfg_toggleMap,tolua_set_tqAllTolua_SPlayerClientCfg_toggleMap);
   tolua_variable(tolua_S,"gonggaoVer",tolua_get_SPlayerClientCfg_gonggaoVer,tolua_set_SPlayerClientCfg_gonggaoVer);
   tolua_variable(tolua_S,"helpTipCount",tolua_get_SPlayerClientCfg_helpTipCount,tolua_set_SPlayerClientCfg_helpTipCount);
   tolua_array(tolua_S,"helpTips",tolua_get_tqAllTolua_SPlayerClientCfg_helpTips,tolua_set_tqAllTolua_SPlayerClientCfg_helpTips);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SBuyLimitItem","SBuyLimitItem","",tolua_collect_SBuyLimitItem);
  #else
  tolua_cclass(tolua_S,"SBuyLimitItem","SBuyLimitItem","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SBuyLimitItem");
   tolua_variable(tolua_S,"resId",tolua_get_SBuyLimitItem_unsigned_resId,tolua_set_SBuyLimitItem_unsigned_resId);
   tolua_variable(tolua_S,"number",tolua_get_SBuyLimitItem_unsigned_number,tolua_set_SBuyLimitItem_unsigned_number);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SVip","SVip","",NULL);
  tolua_beginmodule(tolua_S,"SVip");
   tolua_variable(tolua_S,"level",tolua_get_SVip_unsigned_level,tolua_set_SVip_unsigned_level);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCDKey","SCDKey","",NULL);
  tolua_beginmodule(tolua_S,"SCDKey");
   tolua_variable(tolua_S,"count",tolua_get_SCDKey_count,tolua_set_SCDKey_count);
   tolua_array(tolua_S,"types",tolua_get_tqAllTolua_SCDKey_types,tolua_set_tqAllTolua_SCDKey_types);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SMiscs","SMiscs","",NULL);
  tolua_beginmodule(tolua_S,"SMiscs");
   tolua_variable(tolua_S,"clientCfg",tolua_get_SMiscs_clientCfg,tolua_set_SMiscs_clientCfg);
   tolua_variable(tolua_S,"applyAlliance",tolua_get_SMiscs_applyAlliance,tolua_set_SMiscs_applyAlliance);
   tolua_variable(tolua_S,"inviteJoinAllianceCount",tolua_get_SMiscs_unsigned_inviteJoinAllianceCount,tolua_set_SMiscs_unsigned_inviteJoinAllianceCount);
   tolua_array(tolua_S,"inviteJoinAlliances",tolua_get_tqAllTolua_SMiscs_inviteJoinAlliances,tolua_set_tqAllTolua_SMiscs_inviteJoinAlliances);
   tolua_variable(tolua_S,"trading",tolua_get_SMiscs_trading,tolua_set_SMiscs_trading);
   tolua_variable(tolua_S,"actTower",tolua_get_SMiscs_actTower,tolua_set_SMiscs_actTower);
   tolua_variable(tolua_S,"actTerrace",tolua_get_SMiscs_actTerrace,tolua_set_SMiscs_actTerrace);
   tolua_variable(tolua_S,"buyLimitTime",tolua_get_SMiscs_unsigned_buyLimitTime,tolua_set_SMiscs_unsigned_buyLimitTime);
   tolua_variable(tolua_S,"buyLimitCount",tolua_get_SMiscs_buyLimitCount,tolua_set_SMiscs_buyLimitCount);
   tolua_array(tolua_S,"buyLimitItems",tolua_get_tqAllTolua_SMiscs_buyLimitItems,tolua_set_tqAllTolua_SMiscs_buyLimitItems);
   tolua_variable(tolua_S,"vip",tolua_get_SMiscs_vip,tolua_set_SMiscs_vip);
   tolua_variable(tolua_S,"cdkey",tolua_get_SMiscs_cdkey,tolua_set_SMiscs_cdkey);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSoldierList","SSoldierList","",NULL);
  tolua_beginmodule(tolua_S,"SSoldierList");
   tolua_variable(tolua_S,"count",tolua_get_SSoldierList_unsigned_count,tolua_set_SSoldierList_unsigned_count);
   tolua_array(tolua_S,"soldiers",tolua_get_tqAllTolua_SSoldierList_soldiers,tolua_set_tqAllTolua_SSoldierList_soldiers);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SCarrySoldier","SCarrySoldier","",tolua_collect_SCarrySoldier);
  #else
  tolua_cclass(tolua_S,"SCarrySoldier","SCarrySoldier","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SCarrySoldier");
   tolua_variable(tolua_S,"ulResId",tolua_get_SCarrySoldier_unsigned_ulResId,tolua_set_SCarrySoldier_unsigned_ulResId);
   tolua_variable(tolua_S,"ulNumber",tolua_get_SCarrySoldier_unsigned_ulNumber,tolua_set_SCarrySoldier_unsigned_ulNumber);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCarrySoldierList","SCarrySoldierList","",NULL);
  tolua_beginmodule(tolua_S,"SCarrySoldierList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SCarrySoldierList_unsigned_ucCount,tolua_set_SCarrySoldierList_unsigned_ucCount);
   tolua_array(tolua_S,"astSoldiers",tolua_get_tqAllTolua_SCarrySoldierList_astSoldiers,tolua_set_tqAllTolua_SCarrySoldierList_astSoldiers);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SHeroAttrList","SHeroAttrList","",NULL);
  tolua_beginmodule(tolua_S,"SHeroAttrList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SHeroAttrList_unsigned_ucCount,tolua_set_SHeroAttrList_unsigned_ucCount);
   tolua_array(tolua_S,"astAttrs",tolua_get_tqAllTolua_SHeroAttrList_astAttrs,tolua_set_tqAllTolua_SHeroAttrList_astAttrs);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SItemAttrList","SItemAttrList","",NULL);
  tolua_beginmodule(tolua_S,"SItemAttrList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SItemAttrList_unsigned_ucCount,tolua_set_SItemAttrList_unsigned_ucCount);
   tolua_array(tolua_S,"astAttrs",tolua_get_tqAllTolua_SItemAttrList_astAttrs,tolua_set_tqAllTolua_SItemAttrList_astAttrs);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SGemBesetList","SGemBesetList","",NULL);
  tolua_beginmodule(tolua_S,"SGemBesetList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SGemBesetList_unsigned_ucCount,tolua_set_SGemBesetList_unsigned_ucCount);
   tolua_array(tolua_S,"aulGems",tolua_get_tqAllTolua_SGemBesetList_aulGems,tolua_set_tqAllTolua_SGemBesetList_aulGems);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SItem","SItem","",NULL);
  tolua_beginmodule(tolua_S,"SItem");
   tolua_variable(tolua_S,"ullId",tolua_get_SItem_unsigned_ullId,tolua_set_SItem_unsigned_ullId);
   tolua_variable(tolua_S,"ucType",tolua_get_SItem_unsigned_ucType,tolua_set_SItem_unsigned_ucType);
   tolua_variable(tolua_S,"ulResId",tolua_get_SItem_unsigned_ulResId,tolua_set_SItem_unsigned_ulResId);
   tolua_variable(tolua_S,"usNumber",tolua_get_SItem_unsigned_usNumber,tolua_set_SItem_unsigned_usNumber);
   tolua_variable(tolua_S,"ucForceLevel",tolua_get_SItem_unsigned_ucForceLevel,tolua_set_SItem_unsigned_ucForceLevel);
   tolua_variable(tolua_S,"stAttrs",tolua_get_SItem_stAttrs,tolua_set_SItem_stAttrs);
   tolua_variable(tolua_S,"stGems",tolua_get_SItem_stGems,tolua_set_SItem_stGems);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SItemAttrListEx","SItemAttrListEx","",NULL);
  tolua_beginmodule(tolua_S,"SItemAttrListEx");
   tolua_variable(tolua_S,"count",tolua_get_SItemAttrListEx_unsigned_count,tolua_set_SItemAttrListEx_unsigned_count);
   tolua_array(tolua_S,"attrs",tolua_get_tqAllTolua_SItemAttrListEx_attrs,tolua_set_tqAllTolua_SItemAttrListEx_attrs);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SGemBesetListEx","SGemBesetListEx","",NULL);
  tolua_beginmodule(tolua_S,"SGemBesetListEx");
   tolua_variable(tolua_S,"count",tolua_get_SGemBesetListEx_unsigned_count,tolua_set_SGemBesetListEx_unsigned_count);
   tolua_array(tolua_S,"gems",tolua_get_tqAllTolua_SGemBesetListEx_gems,tolua_set_tqAllTolua_SGemBesetListEx_gems);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SItemEx","SItemEx","",tolua_collect_SItemEx);
  #else
  tolua_cclass(tolua_S,"SItemEx","SItemEx","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SItemEx");
   tolua_variable(tolua_S,"id",tolua_get_SItemEx_unsigned_id,tolua_set_SItemEx_unsigned_id);
   tolua_variable(tolua_S,"type",tolua_get_SItemEx_unsigned_type,tolua_set_SItemEx_unsigned_type);
   tolua_variable(tolua_S,"isRaw",tolua_get_SItemEx_unsigned_isRaw,tolua_set_SItemEx_unsigned_isRaw);
   tolua_variable(tolua_S,"isBind",tolua_get_SItemEx_unsigned_isBind,tolua_set_SItemEx_unsigned_isBind);
   tolua_variable(tolua_S,"resId",tolua_get_SItemEx_unsigned_resId,tolua_set_SItemEx_unsigned_resId);
   tolua_variable(tolua_S,"number",tolua_get_SItemEx_unsigned_number,tolua_set_SItemEx_unsigned_number);
   tolua_variable(tolua_S,"forceLevel",tolua_get_SItemEx_unsigned_forceLevel,tolua_set_SItemEx_unsigned_forceLevel);
   tolua_variable(tolua_S,"attrs",tolua_get_SItemEx_attrs,tolua_set_SItemEx_attrs);
   tolua_variable(tolua_S,"gems",tolua_get_SItemEx_gems,tolua_set_SItemEx_gems);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SWear","SWear","",tolua_collect_SWear);
  #else
  tolua_cclass(tolua_S,"SWear","SWear","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SWear");
   tolua_variable(tolua_S,"armPos",tolua_get_SWear_unsigned_armPos,tolua_set_SWear_unsigned_armPos);
   tolua_variable(tolua_S,"arm",tolua_get_SWear_arm,tolua_set_SWear_arm);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SWearList","SWearList","",NULL);
  tolua_beginmodule(tolua_S,"SWearList");
   tolua_variable(tolua_S,"count",tolua_get_SWearList_unsigned_count,tolua_set_SWearList_unsigned_count);
   tolua_array(tolua_S,"wears",tolua_get_tqAllTolua_SWearList_wears,tolua_set_tqAllTolua_SWearList_wears);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SItemListEx","SItemListEx","",NULL);
  tolua_beginmodule(tolua_S,"SItemListEx");
   tolua_variable(tolua_S,"count",tolua_get_SItemListEx_unsigned_count,tolua_set_SItemListEx_unsigned_count);
   tolua_array(tolua_S,"items",tolua_get_tqAllTolua_SItemListEx_items,tolua_set_tqAllTolua_SItemListEx_items);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SAllItems","SAllItems","",NULL);
  tolua_beginmodule(tolua_S,"SAllItems");
   tolua_variable(tolua_S,"ulGiftGold",tolua_get_SAllItems_unsigned_ulGiftGold,tolua_set_SAllItems_unsigned_ulGiftGold);
   tolua_variable(tolua_S,"ulGold",tolua_get_SAllItems_unsigned_ulGold,tolua_set_SAllItems_unsigned_ulGold);
   tolua_variable(tolua_S,"usGridMaxCnt",tolua_get_SAllItems_unsigned_usGridMaxCnt,tolua_set_SAllItems_unsigned_usGridMaxCnt);
   tolua_variable(tolua_S,"stItems",tolua_get_SAllItems_stItems,tolua_set_SAllItems_stItems);
   tolua_variable(tolua_S,"lastSalveTime",tolua_get_SAllItems_unsigned_lastSalveTime,tolua_set_SAllItems_unsigned_lastSalveTime);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SSkill","SSkill","",tolua_collect_SSkill);
  #else
  tolua_cclass(tolua_S,"SSkill","SSkill","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SSkill");
   tolua_variable(tolua_S,"ulResId",tolua_get_SSkill_unsigned_ulResId,tolua_set_SSkill_unsigned_ulResId);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SSkill_unsigned_ucLevel,tolua_set_SSkill_unsigned_ucLevel);
   tolua_variable(tolua_S,"ulDex",tolua_get_SSkill_unsigned_ulDex,tolua_set_SSkill_unsigned_ulDex);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSkillList","SSkillList","",NULL);
  tolua_beginmodule(tolua_S,"SSkillList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SSkillList_unsigned_ucCount,tolua_set_SSkillList_unsigned_ucCount);
   tolua_array(tolua_S,"astSkills",tolua_get_tqAllTolua_SSkillList_astSkills,tolua_set_tqAllTolua_SSkillList_astSkills);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SSCut","SSCut","",tolua_collect_SSCut);
  #else
  tolua_cclass(tolua_S,"SSCut","SSCut","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SSCut");
   tolua_variable(tolua_S,"ucCutPos",tolua_get_SSCut_unsigned_ucCutPos,tolua_set_SSCut_unsigned_ucCutPos);
   tolua_variable(tolua_S,"ulResId",tolua_get_SSCut_unsigned_ulResId,tolua_set_SSCut_unsigned_ulResId);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSCutList","SSCutList","",NULL);
  tolua_beginmodule(tolua_S,"SSCutList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SSCutList_unsigned_ucCount,tolua_set_SSCutList_unsigned_ucCount);
   tolua_array(tolua_S,"astSCuts",tolua_get_tqAllTolua_SSCutList_astSCuts,tolua_set_tqAllTolua_SSCutList_astSCuts);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"OSHeroSteel","OSHeroSteel","",NULL);
  tolua_beginmodule(tolua_S,"OSHeroSteel");
   tolua_variable(tolua_S,"ucSteelType",tolua_get_OSHeroSteel_unsigned_ucSteelType,tolua_set_OSHeroSteel_unsigned_ucSteelType);
   tolua_variable(tolua_S,"ulStartTime",tolua_get_OSHeroSteel_unsigned_ulStartTime,tolua_set_OSHeroSteel_unsigned_ulStartTime);
   tolua_variable(tolua_S,"ulLastTime",tolua_get_OSHeroSteel_unsigned_ulLastTime,tolua_set_OSHeroSteel_unsigned_ulLastTime);
   tolua_variable(tolua_S,"ucHours",tolua_get_OSHeroSteel_unsigned_ucHours,tolua_set_OSHeroSteel_unsigned_ucHours);
   tolua_variable(tolua_S,"ullExp",tolua_get_OSHeroSteel_unsigned_ullExp,tolua_set_OSHeroSteel_unsigned_ullExp);
   tolua_variable(tolua_S,"ulTakeGold",tolua_get_OSHeroSteel_unsigned_ulTakeGold,tolua_set_OSHeroSteel_unsigned_ulTakeGold);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SHeroSteel","SHeroSteel","",NULL);
  tolua_beginmodule(tolua_S,"SHeroSteel");
   tolua_variable(tolua_S,"steelType",tolua_get_SHeroSteel_unsigned_steelType,tolua_set_SHeroSteel_unsigned_steelType);
   tolua_variable(tolua_S,"startTime",tolua_get_SHeroSteel_unsigned_startTime,tolua_set_SHeroSteel_unsigned_startTime);
   tolua_variable(tolua_S,"quarters",tolua_get_SHeroSteel_unsigned_quarters,tolua_set_SHeroSteel_unsigned_quarters);
   tolua_variable(tolua_S,"quarterRes",tolua_get_SHeroSteel_unsigned_quarterRes,tolua_set_SHeroSteel_unsigned_quarterRes);
   tolua_variable(tolua_S,"quarterMoney",tolua_get_SHeroSteel_unsigned_quarterMoney,tolua_set_SHeroSteel_unsigned_quarterMoney);
   tolua_variable(tolua_S,"hourGold",tolua_get_SHeroSteel_unsigned_hourGold,tolua_set_SHeroSteel_unsigned_hourGold);
   tolua_variable(tolua_S,"actMult",tolua_get_SHeroSteel_unsigned_actMult,tolua_set_SHeroSteel_unsigned_actMult);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SOHero","SOHero","",NULL);
  tolua_beginmodule(tolua_S,"SOHero");
   tolua_variable(tolua_S,"ullId",tolua_get_SOHero_unsigned_ullId,tolua_set_SOHero_unsigned_ullId);
   tolua_variable(tolua_S,"ulResId",tolua_get_SOHero_unsigned_ulResId,tolua_set_SOHero_unsigned_ulResId);
   tolua_variable(tolua_S,"szName",tolua_get_SOHero_szName,tolua_set_SOHero_szName);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SOHero_unsigned_ucLevel,tolua_set_SOHero_unsigned_ucLevel);
   tolua_variable(tolua_S,"ulExp",tolua_get_SOHero_unsigned_ulExp,tolua_set_SOHero_unsigned_ulExp);
   tolua_variable(tolua_S,"ucState",tolua_get_SOHero_unsigned_ucState,tolua_set_SOHero_unsigned_ucState);
   tolua_variable(tolua_S,"ulCityId",tolua_get_SOHero_unsigned_ulCityId,tolua_set_SOHero_unsigned_ulCityId);
   tolua_variable(tolua_S,"ulCityPosX",tolua_get_SOHero_unsigned_ulCityPosX,tolua_set_SOHero_unsigned_ulCityPosX);
   tolua_variable(tolua_S,"ulCityPosY",tolua_get_SOHero_unsigned_ulCityPosY,tolua_set_SOHero_unsigned_ulCityPosY);
   tolua_array(tolua_S,"aucSubjects",tolua_get_tqAllTolua_SOHero_aucSubjects,tolua_set_tqAllTolua_SOHero_aucSubjects);
   tolua_variable(tolua_S,"stSoldiers",tolua_get_SOHero_stSoldiers,tolua_set_SOHero_stSoldiers);
   tolua_variable(tolua_S,"stAttrs",tolua_get_SOHero_stAttrs,tolua_set_SOHero_stAttrs);
   tolua_variable(tolua_S,"stWears",tolua_get_SOHero_stWears,tolua_set_SOHero_stWears);
   tolua_variable(tolua_S,"stSkills",tolua_get_SOHero_stSkills,tolua_set_SOHero_stSkills);
   tolua_variable(tolua_S,"stSCuts",tolua_get_SOHero_stSCuts,tolua_set_SOHero_stSCuts);
   tolua_variable(tolua_S,"stSteel",tolua_get_SOHero_stSteel,tolua_set_SOHero_stSteel);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SSkillSteel","SSkillSteel","",NULL);
  tolua_beginmodule(tolua_S,"SSkillSteel");
   tolua_variable(tolua_S,"ulResId",tolua_get_SSkillSteel_unsigned_ulResId,tolua_set_SSkillSteel_unsigned_ulResId);
   tolua_variable(tolua_S,"ulStoptime",tolua_get_SSkillSteel_unsigned_ulStoptime,tolua_set_SSkillSteel_unsigned_ulStoptime);
   tolua_variable(tolua_S,"ulDurtime",tolua_get_SSkillSteel_unsigned_ulDurtime,tolua_set_SSkillSteel_unsigned_ulDurtime);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SHero","SHero","",tolua_collect_SHero);
  #else
  tolua_cclass(tolua_S,"SHero","SHero","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SHero");
   tolua_variable(tolua_S,"ullId",tolua_get_SHero_unsigned_ullId,tolua_set_SHero_unsigned_ullId);
   tolua_variable(tolua_S,"ucProf",tolua_get_SHero_unsigned_ucProf,tolua_set_SHero_unsigned_ucProf);
   tolua_variable(tolua_S,"szName",tolua_get_SHero_szName,tolua_set_SHero_szName);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SHero_unsigned_ucLevel,tolua_set_SHero_unsigned_ucLevel);
   tolua_variable(tolua_S,"ucSkeletonLevel",tolua_get_SHero_unsigned_ucSkeletonLevel,tolua_set_SHero_unsigned_ucSkeletonLevel);
   tolua_variable(tolua_S,"ulSSteelStopTime",tolua_get_SHero_unsigned_ulSSteelStopTime,tolua_set_SHero_unsigned_ulSSteelStopTime);
   tolua_variable(tolua_S,"ulIcon",tolua_get_SHero_unsigned_ulIcon,tolua_set_SHero_unsigned_ulIcon);
   tolua_variable(tolua_S,"ucSex",tolua_get_SHero_unsigned_ucSex,tolua_set_SHero_unsigned_ucSex);
   tolua_variable(tolua_S,"ucState",tolua_get_SHero_unsigned_ucState,tolua_set_SHero_unsigned_ucState);
   tolua_variable(tolua_S,"ucOfficial",tolua_get_SHero_unsigned_ucOfficial,tolua_set_SHero_unsigned_ucOfficial);
   tolua_variable(tolua_S,"ucLockState",tolua_get_SHero_unsigned_ucLockState,tolua_set_SHero_unsigned_ucLockState);
   tolua_variable(tolua_S,"ulUnlockTime",tolua_get_SHero_unsigned_ulUnlockTime,tolua_set_SHero_unsigned_ulUnlockTime);
   tolua_array(tolua_S,"aucSubjects",tolua_get_tqAllTolua_SHero_aucSubjects,tolua_set_tqAllTolua_SHero_aucSubjects);
   tolua_variable(tolua_S,"stAttrs",tolua_get_SHero_stAttrs,tolua_set_SHero_stAttrs);
   tolua_variable(tolua_S,"stSoldier",tolua_get_SHero_stSoldier,tolua_set_SHero_stSoldier);
   tolua_variable(tolua_S,"stWears",tolua_get_SHero_stWears,tolua_set_SHero_stWears);
   tolua_variable(tolua_S,"stSkills",tolua_get_SHero_stSkills,tolua_set_SHero_stSkills);
   tolua_variable(tolua_S,"ulCurTacticSkill",tolua_get_SHero_unsigned_ulCurTacticSkill,tolua_set_SHero_unsigned_ulCurTacticSkill);
   tolua_variable(tolua_S,"stSteel",tolua_get_SHero_stSteel,tolua_set_SHero_stSteel);
   tolua_variable(tolua_S,"stSkillSteel",tolua_get_SHero_stSkillSteel,tolua_set_SHero_stSkillSteel);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SNewHero","SNewHero","",tolua_collect_SNewHero);
  #else
  tolua_cclass(tolua_S,"SNewHero","SNewHero","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SNewHero");
   tolua_variable(tolua_S,"ulId",tolua_get_SNewHero_unsigned_ulId,tolua_set_SNewHero_unsigned_ulId);
   tolua_variable(tolua_S,"ucProf",tolua_get_SNewHero_unsigned_ucProf,tolua_set_SNewHero_unsigned_ucProf);
   tolua_variable(tolua_S,"szName",tolua_get_SNewHero_szName,tolua_set_SNewHero_szName);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SNewHero_unsigned_ucLevel,tolua_set_SNewHero_unsigned_ucLevel);
   tolua_variable(tolua_S,"ulIcon",tolua_get_SNewHero_unsigned_ulIcon,tolua_set_SNewHero_unsigned_ulIcon);
   tolua_variable(tolua_S,"ucSex",tolua_get_SNewHero_unsigned_ucSex,tolua_set_SNewHero_unsigned_ucSex);
   tolua_variable(tolua_S,"ucAttrCount",tolua_get_SNewHero_unsigned_ucAttrCount,tolua_set_SNewHero_unsigned_ucAttrCount);
   tolua_array(tolua_S,"astAttrs",tolua_get_tqAllTolua_SNewHero_astAttrs,tolua_set_tqAllTolua_SNewHero_astAttrs);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SHeroList","SHeroList","",NULL);
  tolua_beginmodule(tolua_S,"SHeroList");
   tolua_variable(tolua_S,"ulHeroAttrLastTime",tolua_get_SHeroList_unsigned_ulHeroAttrLastTime,tolua_set_SHeroList_unsigned_ulHeroAttrLastTime);
   tolua_variable(tolua_S,"ucCount",tolua_get_SHeroList_unsigned_ucCount,tolua_set_SHeroList_unsigned_ucCount);
   tolua_array(tolua_S,"astHeros",tolua_get_tqAllTolua_SHeroList_astHeros,tolua_set_tqAllTolua_SHeroList_astHeros);
   tolua_variable(tolua_S,"ulCanUseSSTime",tolua_get_SHeroList_unsigned_ulCanUseSSTime,tolua_set_SHeroList_unsigned_ulCanUseSSTime);
   tolua_variable(tolua_S,"ulNewHeroLastTime",tolua_get_SHeroList_unsigned_ulNewHeroLastTime,tolua_set_SHeroList_unsigned_ulNewHeroLastTime);
   tolua_variable(tolua_S,"ucNewCount",tolua_get_SHeroList_unsigned_ucNewCount,tolua_set_SHeroList_unsigned_ucNewCount);
   tolua_array(tolua_S,"astNewHeros",tolua_get_tqAllTolua_SHeroList_astNewHeros,tolua_set_tqAllTolua_SHeroList_astNewHeros);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SBulletin","SBulletin","",tolua_collect_SBulletin);
  #else
  tolua_cclass(tolua_S,"SBulletin","SBulletin","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SBulletin");
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SBulletinList","SBulletinList","",NULL);
  tolua_beginmodule(tolua_S,"SBulletinList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SBulletinList_unsigned_ucCount,tolua_set_SBulletinList_unsigned_ucCount);
   tolua_array(tolua_S,"astBulletins",tolua_get_tqAllTolua_SBulletinList_astBulletins,tolua_set_tqAllTolua_SBulletinList_astBulletins);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SBuddy","SBuddy","",tolua_collect_SBuddy);
  #else
  tolua_cclass(tolua_S,"SBuddy","SBuddy","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SBuddy");
   tolua_variable(tolua_S,"flag",tolua_get_SBuddy_unsigned_flag,tolua_set_SBuddy_unsigned_flag);
   tolua_variable(tolua_S,"roleId",tolua_get_SBuddy_unsigned_roleId,tolua_set_SBuddy_unsigned_roleId);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SBuddyList","SBuddyList","",NULL);
  tolua_beginmodule(tolua_S,"SBuddyList");
   tolua_variable(tolua_S,"count",tolua_get_SBuddyList_unsigned_count,tolua_set_SBuddyList_unsigned_count);
   tolua_array(tolua_S,"buddys",tolua_get_tqAllTolua_SBuddyList_buddys,tolua_set_tqAllTolua_SBuddyList_buddys);
   tolua_variable(tolua_S,"applyCount",tolua_get_SBuddyList_unsigned_applyCount,tolua_set_SBuddyList_unsigned_applyCount);
   tolua_array(tolua_S,"applyRoleIds",tolua_get_tqAllTolua_SBuddyList_applyRoleIds,tolua_set_tqAllTolua_SBuddyList_applyRoleIds);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SFarm","SFarm","",tolua_collect_SFarm);
  #else
  tolua_cclass(tolua_S,"SFarm","SFarm","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SFarm");
   tolua_variable(tolua_S,"ulId",tolua_get_SFarm_unsigned_ulId,tolua_set_SFarm_unsigned_ulId);
   tolua_variable(tolua_S,"ulResId",tolua_get_SFarm_unsigned_ulResId,tolua_set_SFarm_unsigned_ulResId);
   tolua_variable(tolua_S,"ucLevel",tolua_get_SFarm_unsigned_ucLevel,tolua_set_SFarm_unsigned_ucLevel);
   tolua_variable(tolua_S,"ucState",tolua_get_SFarm_unsigned_ucState,tolua_set_SFarm_unsigned_ucState);
   tolua_variable(tolua_S,"ulStartTime",tolua_get_SFarm_unsigned_ulStartTime,tolua_set_SFarm_unsigned_ulStartTime);
   tolua_variable(tolua_S,"ulStopTime",tolua_get_SFarm_unsigned_ulStopTime,tolua_set_SFarm_unsigned_ulStopTime);
   tolua_variable(tolua_S,"ulTotalRes",tolua_get_SFarm_unsigned_ulTotalRes,tolua_set_SFarm_unsigned_ulTotalRes);
   tolua_variable(tolua_S,"ulLeftRes",tolua_get_SFarm_unsigned_ulLeftRes,tolua_set_SFarm_unsigned_ulLeftRes);
   tolua_variable(tolua_S,"collectorCount",tolua_get_SFarm_unsigned_collectorCount,tolua_set_SFarm_unsigned_collectorCount);
   tolua_array(tolua_S,"collectors",tolua_get_tqAllTolua_SFarm_collectors,tolua_set_tqAllTolua_SFarm_collectors);
   tolua_variable(tolua_S,"seqId",tolua_get_SFarm_unsigned_seqId,tolua_set_SFarm_unsigned_seqId);
   tolua_variable(tolua_S,"protectStopTime",tolua_get_SFarm_unsigned_protectStopTime,tolua_set_SFarm_unsigned_protectStopTime);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SFarmLog","SFarmLog","",tolua_collect_SFarmLog);
  #else
  tolua_cclass(tolua_S,"SFarmLog","SFarmLog","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SFarmLog");
   tolua_variable(tolua_S,"ucType",tolua_get_SFarmLog_unsigned_ucType,tolua_set_SFarmLog_unsigned_ucType);
   tolua_variable(tolua_S,"szRName",tolua_get_SFarmLog_szRName,tolua_set_SFarmLog_szRName);
   tolua_variable(tolua_S,"ulLogTime",tolua_get_SFarmLog_unsigned_ulLogTime,tolua_set_SFarmLog_unsigned_ulLogTime);
   tolua_variable(tolua_S,"ulParam1",tolua_get_SFarmLog_unsigned_ulParam1,tolua_set_SFarmLog_unsigned_ulParam1);
   tolua_variable(tolua_S,"ulParam2",tolua_get_SFarmLog_unsigned_ulParam2,tolua_set_SFarmLog_unsigned_ulParam2);
   tolua_variable(tolua_S,"ulParam3",tolua_get_SFarmLog_unsigned_ulParam3,tolua_set_SFarmLog_unsigned_ulParam3);
   tolua_variable(tolua_S,"ulParam4",tolua_get_SFarmLog_unsigned_ulParam4,tolua_set_SFarmLog_unsigned_ulParam4);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SFarmList","SFarmList","",NULL);
  tolua_beginmodule(tolua_S,"SFarmList");
   tolua_variable(tolua_S,"ucCount",tolua_get_SFarmList_unsigned_ucCount,tolua_set_SFarmList_unsigned_ucCount);
   tolua_array(tolua_S,"astFarms",tolua_get_tqAllTolua_SFarmList_astFarms,tolua_set_tqAllTolua_SFarmList_astFarms);
   tolua_variable(tolua_S,"ulLogVer",tolua_get_SFarmList_unsigned_ulLogVer,tolua_set_SFarmList_unsigned_ulLogVer);
   tolua_variable(tolua_S,"ucLogCount",tolua_get_SFarmList_unsigned_ucLogCount,tolua_set_SFarmList_unsigned_ucLogCount);
   tolua_array(tolua_S,"astFarmLogs",tolua_get_tqAllTolua_SFarmList_astFarmLogs,tolua_set_tqAllTolua_SFarmList_astFarmLogs);
   tolua_variable(tolua_S,"farmVer",tolua_get_SFarmList_unsigned_farmVer,tolua_set_SFarmList_unsigned_farmVer);
   tolua_variable(tolua_S,"lastSeqId",tolua_get_SFarmList_unsigned_lastSeqId,tolua_set_SFarmList_unsigned_lastSeqId);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"SCulture","SCulture","",tolua_collect_SCulture);
  #else
  tolua_cclass(tolua_S,"SCulture","SCulture","",NULL);
  #endif
  tolua_beginmodule(tolua_S,"SCulture");
   tolua_variable(tolua_S,"level",tolua_get_SCulture_unsigned_level,tolua_set_SCulture_unsigned_level);
   tolua_variable(tolua_S,"id",tolua_get_SCulture_unsigned_id,tolua_set_SCulture_unsigned_id);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SLearningCulture","SLearningCulture","",NULL);
  tolua_beginmodule(tolua_S,"SLearningCulture");
   tolua_variable(tolua_S,"id",tolua_get_SLearningCulture_unsigned_id,tolua_set_SLearningCulture_unsigned_id);
   tolua_variable(tolua_S,"stoptime",tolua_get_SLearningCulture_unsigned_stoptime,tolua_set_SLearningCulture_unsigned_stoptime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SCultures","SCultures","",NULL);
  tolua_beginmodule(tolua_S,"SCultures");
   tolua_variable(tolua_S,"count",tolua_get_SCultures_unsigned_count,tolua_set_SCultures_unsigned_count);
   tolua_array(tolua_S,"cultures",tolua_get_tqAllTolua_SCultures_cultures,tolua_set_tqAllTolua_SCultures_cultures);
   tolua_variable(tolua_S,"learning",tolua_get_SCultures_learning,tolua_set_SCultures_learning);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SDBVar","SDBVar","",NULL);
  tolua_beginmodule(tolua_S,"SDBVar");
   tolua_variable(tolua_S,"ullRoleId",tolua_get_SDBVar_unsigned_ullRoleId,tolua_set_SDBVar_unsigned_ullRoleId);
   tolua_variable(tolua_S,"szUName",tolua_get_SDBVar_szUName,tolua_set_SDBVar_szUName);
   tolua_variable(tolua_S,"szRName",tolua_get_SDBVar_szRName,tolua_set_SDBVar_szRName);
   tolua_variable(tolua_S,"ucSex",tolua_get_SDBVar_unsigned_ucSex,tolua_set_SDBVar_unsigned_ucSex);
   tolua_variable(tolua_S,"stFixVar",tolua_get_SDBVar_stFixVar,tolua_set_SDBVar_stFixVar);
   tolua_variable(tolua_S,"stBInfos",tolua_get_SDBVar_stBInfos,tolua_set_SDBVar_stBInfos);
   tolua_variable(tolua_S,"stHeros",tolua_get_SDBVar_stHeros,tolua_set_SDBVar_stHeros);
   tolua_variable(tolua_S,"soldiers",tolua_get_SDBVar_soldiers,tolua_set_SDBVar_soldiers);
   tolua_variable(tolua_S,"stCitys",tolua_get_SDBVar_stCitys,tolua_set_SDBVar_stCitys);
   tolua_variable(tolua_S,"stFarms",tolua_get_SDBVar_stFarms,tolua_set_SDBVar_stFarms);
   tolua_variable(tolua_S,"cultures",tolua_get_SDBVar_cultures,tolua_set_SDBVar_cultures);
   tolua_variable(tolua_S,"stItems",tolua_get_SDBVar_stItems,tolua_set_SDBVar_stItems);
   tolua_variable(tolua_S,"states",tolua_get_SDBVar_states,tolua_set_SDBVar_states);
   tolua_variable(tolua_S,"military",tolua_get_SDBVar_military,tolua_set_SDBVar_military);
   tolua_variable(tolua_S,"tasks",tolua_get_SDBVar_tasks,tolua_set_SDBVar_tasks);
   tolua_variable(tolua_S,"stBulletins",tolua_get_SDBVar_stBulletins,tolua_set_SDBVar_stBulletins);
   tolua_variable(tolua_S,"buddys",tolua_get_SDBVar_buddys,tolua_set_SDBVar_buddys);
   tolua_variable(tolua_S,"stMiscs",tolua_get_SDBVar_stMiscs,tolua_set_SDBVar_stMiscs);
   tolua_variable(tolua_S,"regTime",tolua_get_SDBVar_unsigned_regTime,tolua_set_SDBVar_unsigned_regTime);
   tolua_variable(tolua_S,"lockToTime",tolua_get_SDBVar_unsigned_lockToTime,tolua_set_SDBVar_unsigned_lockToTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"SDBAlliVar","SDBAlliVar","",NULL);
  tolua_beginmodule(tolua_S,"SDBAlliVar");
   tolua_variable(tolua_S,"ullallianceId",tolua_get_SDBAlliVar_unsigned_ullallianceId,tolua_set_SDBAlliVar_unsigned_ullallianceId);
  tolua_endmodule(tolua_S);
  tolua_constant(tolua_S,"EGUS_INIT",EGUS_INIT);
  tolua_constant(tolua_S,"EGUS_CHECK_CROSS",EGUS_CHECK_CROSS);
  tolua_constant(tolua_S,"EGUS_LOGINNING",EGUS_LOGINNING);
  tolua_constant(tolua_S,"EGUS_CREATEROLE",EGUS_CREATEROLE);
  tolua_constant(tolua_S,"EGUS_INGAME",EGUS_INGAME);
  tolua_constant(tolua_S,"EGUS_OFFLINE_INGAME",EGUS_OFFLINE_INGAME);
  tolua_constant(tolua_S,"EGUS_WILLCLOSE",EGUS_WILLCLOSE);
  tolua_cclass(tolua_S,"ScriptEvent","ScriptEvent","SBaseEvent",NULL);
  tolua_beginmodule(tolua_S,"ScriptEvent");
   tolua_variable(tolua_S,"connid",tolua_get_ScriptEvent_connid,tolua_set_ScriptEvent_connid);
   tolua_variable(tolua_S,"playerid",tolua_get_ScriptEvent_playerid,tolua_set_ScriptEvent_playerid);
   tolua_variable(tolua_S,"datalen",tolua_get_ScriptEvent_datalen,tolua_set_ScriptEvent_datalen);
   tolua_variable(tolua_S,"data",tolua_get_ScriptEvent_data,tolua_set_ScriptEvent_data);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"TimerEvent","TimerEvent","SBaseEvent",NULL);
  tolua_beginmodule(tolua_S,"TimerEvent");
   tolua_variable(tolua_S,"hdr",tolua_get_TimerEvent_hdr,tolua_set_TimerEvent_hdr);
   tolua_variable(tolua_S,"connid",tolua_get_TimerEvent_connid,tolua_set_TimerEvent_connid);
   tolua_variable(tolua_S,"playerid",tolua_get_TimerEvent_playerid,tolua_set_TimerEvent_playerid);
   tolua_variable(tolua_S,"eventid",tolua_get_TimerEvent_unsigned_eventid,tolua_set_TimerEvent_unsigned_eventid);
   tolua_variable(tolua_S,"curtimeMs",tolua_get_TimerEvent_unsigned_curtimeMs,tolua_set_TimerEvent_unsigned_curtimeMs);
   tolua_variable(tolua_S,"param1",tolua_get_TimerEvent_param1,tolua_set_TimerEvent_param1);
   tolua_variable(tolua_S,"param2",tolua_get_TimerEvent_param2,tolua_set_TimerEvent_param2);
  tolua_endmodule(tolua_S);
  #ifdef __cplusplus
  tolua_cclass(tolua_S,"IScriptPub","IScriptPub","IInterface",tolua_collect_IScriptPub);
  #else
  tolua_cclass(tolua_S,"IScriptPub","IScriptPub","IInterface",NULL);
  #endif
  tolua_beginmodule(tolua_S,"IScriptPub");
   tolua_function(tolua_S,"MakeNewRoleId",tolua_tqAllTolua_IScriptPub_MakeNewRoleId00);
   tolua_function(tolua_S,"CreateRole",tolua_tqAllTolua_IScriptPub_CreateRole00);
   tolua_function(tolua_S,"RoleLogin",tolua_tqAllTolua_IScriptPub_RoleLogin00);
   tolua_function(tolua_S,"RoleSave",tolua_tqAllTolua_IScriptPub_RoleSave00);
   tolua_function(tolua_S,"RoleLogout",tolua_tqAllTolua_IScriptPub_RoleLogout00);
   tolua_function(tolua_S,"SendMsg",tolua_tqAllTolua_IScriptPub_SendMsg00);
   tolua_function(tolua_S,"SendMsgNotifyCmd",tolua_tqAllTolua_IScriptPub_SendMsgNotifyCmd00);
   tolua_function(tolua_S,"SendUseKeyCmd",tolua_tqAllTolua_IScriptPub_SendUseKeyCmd00);
   tolua_function(tolua_S,"AllocDBVar",tolua_tqAllTolua_IScriptPub_AllocDBVar00);
   tolua_function(tolua_S,"FreeDBVar",tolua_tqAllTolua_IScriptPub_FreeDBVar00);
   tolua_function(tolua_S,"IsExistRoleName",tolua_tqAllTolua_IScriptPub_IsExistRoleName00);
   tolua_function(tolua_S,"IsExistUserName",tolua_tqAllTolua_IScriptPub_IsExistUserName00);
   tolua_function(tolua_S,"InitAlliByUID",tolua_tqAllTolua_IScriptPub_InitAlliByUID00);
   tolua_function(tolua_S,"AllocDBAlliVar",tolua_tqAllTolua_IScriptPub_AllocDBAlliVar00);
   tolua_function(tolua_S,"FreeDBAlliVar",tolua_tqAllTolua_IScriptPub_FreeDBAlliVar00);
   tolua_function(tolua_S,"AllocTimerUserData",tolua_tqAllTolua_IScriptPub_AllocTimerUserData00);
   tolua_function(tolua_S,"FreeTimerUserData",tolua_tqAllTolua_IScriptPub_FreeTimerUserData00);
   tolua_function(tolua_S,"GetZoneId",tolua_tqAllTolua_IScriptPub_GetZoneId00);
   tolua_function(tolua_S,"GetDBConn",tolua_tqAllTolua_IScriptPub_GetDBConn00);
   tolua_function(tolua_S,"ClearInnerHero",tolua_tqAllTolua_IScriptPub_ClearInnerHero00);
   tolua_function(tolua_S,"diffTimeMs",tolua_tqAllTolua_IScriptPub_diffTimeMs00);
   tolua_function(tolua_S,"getTimeMs",tolua_tqAllTolua_IScriptPub_getTimeMs00);
   tolua_function(tolua_S,"getTimeMsEx",tolua_tqAllTolua_IScriptPub_getTimeMsEx00);
   tolua_function(tolua_S,"GetCfgBasePath",tolua_tqAllTolua_IScriptPub_GetCfgBasePath00);
   tolua_function(tolua_S,"GetLogBasePath",tolua_tqAllTolua_IScriptPub_GetLogBasePath00);
   tolua_function(tolua_S,"GetSvrNameId",tolua_tqAllTolua_IScriptPub_GetSvrNameId00);
   tolua_function(tolua_S,"delete",tolua_tqAllTolua_IScriptPub_delete00);
  tolua_endmodule(tolua_S);
  tolua_constant(tolua_S,"IS_MINI_MAP",IS_MINI_MAP);
  tolua_constant(tolua_S,"IS_NEW_MAP",IS_NEW_MAP);
  tolua_constant(tolua_S,"GRIDS_COUNT",GRIDS_COUNT);
  tolua_constant(tolua_S,"GRIDS_COL",GRIDS_COL);
  tolua_constant(tolua_S,"GRIDS_ROW",GRIDS_ROW);
  tolua_constant(tolua_S,"CITYBLOCK_COUNT",CITYBLOCK_COUNT);
  tolua_cclass(tolua_S,"GridMisc","GridMisc","",NULL);
  tolua_beginmodule(tolua_S,"GridMisc");
   tolua_variable(tolua_S,"shiChangLevel",tolua_get_GridMisc_unsigned_shiChangLevel,tolua_set_GridMisc_unsigned_shiChangLevel);
   tolua_variable(tolua_S,"towerLayer",tolua_get_GridMisc_unsigned_towerLayer,tolua_set_GridMisc_unsigned_towerLayer);
   tolua_variable(tolua_S,"towerTime",tolua_get_GridMisc_unsigned_towerTime,tolua_set_GridMisc_unsigned_towerTime);
   tolua_variable(tolua_S,"towerRank",tolua_get_GridMisc_unsigned_towerRank,tolua_set_GridMisc_unsigned_towerRank);
   tolua_variable(tolua_S,"buildValTime",tolua_get_GridMisc_unsigned_buildValTime,tolua_set_GridMisc_unsigned_buildValTime);
   tolua_variable(tolua_S,"terraceGate",tolua_get_GridMisc_unsigned_terraceGate,tolua_set_GridMisc_unsigned_terraceGate);
   tolua_variable(tolua_S,"cityMaxLevel",tolua_get_GridMisc_unsigned_cityMaxLevel,tolua_set_GridMisc_unsigned_cityMaxLevel);
   tolua_variable(tolua_S,"is_yellow_vip",tolua_get_GridMisc_unsigned_is_yellow_vip,tolua_set_GridMisc_unsigned_is_yellow_vip);
   tolua_variable(tolua_S,"is_yellow_year_vip",tolua_get_GridMisc_unsigned_is_yellow_year_vip,tolua_set_GridMisc_unsigned_is_yellow_year_vip);
   tolua_variable(tolua_S,"yellow_vip_level",tolua_get_GridMisc_unsigned_yellow_vip_level,tolua_set_GridMisc_unsigned_yellow_vip_level);
   tolua_variable(tolua_S,"is_yellow_high_vip",tolua_get_GridMisc_unsigned_is_yellow_high_vip,tolua_set_GridMisc_unsigned_is_yellow_high_vip);
   tolua_variable(tolua_S,"is_blue_vip",tolua_get_GridMisc_unsigned_is_blue_vip,tolua_set_GridMisc_unsigned_is_blue_vip);
   tolua_variable(tolua_S,"is_blue_year_vip",tolua_get_GridMisc_unsigned_is_blue_year_vip,tolua_set_GridMisc_unsigned_is_blue_year_vip);
   tolua_variable(tolua_S,"blue_vip_level",tolua_get_GridMisc_unsigned_blue_vip_level,tolua_set_GridMisc_unsigned_blue_vip_level);
   tolua_variable(tolua_S,"is_super_blue_vip",tolua_get_GridMisc_unsigned_is_super_blue_vip,tolua_set_GridMisc_unsigned_is_super_blue_vip);
   tolua_variable(tolua_S,"_3366_grow_level",tolua_get_GridMisc_unsigned__3366_grow_level,tolua_set_GridMisc_unsigned__3366_grow_level);
   tolua_variable(tolua_S,"vip_level",tolua_get_GridMisc_unsigned_vip_level,tolua_set_GridMisc_unsigned_vip_level);
   tolua_variable(tolua_S,"lastRoleLevel",tolua_get_GridMisc_unsigned_lastRoleLevel,tolua_set_GridMisc_unsigned_lastRoleLevel);
   tolua_variable(tolua_S,"lastBuildVal",tolua_get_GridMisc_unsigned_lastBuildVal,tolua_set_GridMisc_unsigned_lastBuildVal);
   tolua_variable(tolua_S,"lastTowerLayer",tolua_get_GridMisc_unsigned_lastTowerLayer,tolua_set_GridMisc_unsigned_lastTowerLayer);
   tolua_variable(tolua_S,"lastTowerTime",tolua_get_GridMisc_unsigned_lastTowerTime,tolua_set_GridMisc_unsigned_lastTowerTime);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"Grid","Grid","",NULL);
  tolua_beginmodule(tolua_S,"Grid");
   tolua_variable(tolua_S,"gridId",tolua_get_Grid_unsigned_gridId,tolua_set_Grid_unsigned_gridId);
   tolua_variable(tolua_S,"objType",tolua_get_Grid_objType,tolua_set_Grid_objType);
   tolua_variable(tolua_S,"resId",tolua_get_Grid_unsigned_resId,tolua_set_Grid_unsigned_resId);
   tolua_variable(tolua_S,"modelId",tolua_get_Grid_unsigned_modelId,tolua_set_Grid_unsigned_modelId);
   tolua_variable(tolua_S,"subCitys",tolua_get_Grid_subCitys,tolua_set_Grid_subCitys);
   tolua_variable(tolua_S,"roleId",tolua_get_Grid_unsigned_roleId,tolua_set_Grid_unsigned_roleId);
   tolua_variable(tolua_S,"roleName",tolua_get_Grid_roleName,tolua_set_Grid_roleName);
   tolua_variable(tolua_S,"userName",tolua_get_Grid_userName,tolua_set_Grid_userName);
   tolua_variable(tolua_S,"icon",tolua_get_Grid_icon,tolua_set_Grid_icon);
   tolua_variable(tolua_S,"level",tolua_get_Grid_level,tolua_set_Grid_level);
   tolua_variable(tolua_S,"sex",tolua_get_Grid_sex,tolua_set_Grid_sex);
   tolua_variable(tolua_S,"state",tolua_get_Grid_state,tolua_set_Grid_state);
   tolua_variable(tolua_S,"allianceId",tolua_get_Grid_unsigned_allianceId,tolua_set_Grid_unsigned_allianceId);
   tolua_variable(tolua_S,"enemyAlliId",tolua_get_Grid_unsigned_enemyAlliId,tolua_set_Grid_unsigned_enemyAlliId);
   tolua_variable(tolua_S,"refreshTime",tolua_get_Grid_unsigned_refreshTime,tolua_set_Grid_unsigned_refreshTime);
   tolua_variable(tolua_S,"alliName",tolua_get_Grid_alliName,tolua_set_Grid_alliName);
   tolua_variable(tolua_S,"cityLevel",tolua_get_Grid_cityLevel,tolua_set_Grid_cityLevel);
   tolua_variable(tolua_S,"buildCurVal",tolua_get_Grid_unsigned_buildCurVal,tolua_set_Grid_unsigned_buildCurVal);
   tolua_variable(tolua_S,"roleRank",tolua_get_Grid_unsigned_roleRank,tolua_set_Grid_unsigned_roleRank);
   tolua_variable(tolua_S,"introduction",tolua_get_Grid_introduction,tolua_set_Grid_introduction);
   tolua_variable(tolua_S,"loginTime",tolua_get_Grid_unsigned_loginTime,tolua_set_Grid_unsigned_loginTime);
   tolua_variable(tolua_S,"misc",tolua_get_Grid_misc,tolua_set_Grid_misc);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"IGridsManager","IGridsManager","",NULL);
  tolua_beginmodule(tolua_S,"IGridsManager");
   tolua_function(tolua_S,"Load",tolua_tqAllTolua_IGridsManager_Load00);
   tolua_function(tolua_S,"GetGridById",tolua_tqAllTolua_IGridsManager_GetGridById00);
   tolua_function(tolua_S,"GetGridByRoleId",tolua_tqAllTolua_IGridsManager_GetGridByRoleId00);
   tolua_function(tolua_S,"GetCityIdByGridId",tolua_tqAllTolua_IGridsManager_GetCityIdByGridId00);
   tolua_function(tolua_S,"GetFreeGridId",tolua_tqAllTolua_IGridsManager_GetFreeGridId00);
   tolua_function(tolua_S,"GetPosByGridId",tolua_tqAllTolua_IGridsManager_GetPosByGridId00);
   tolua_function(tolua_S,"GetRoleIdByRoleName",tolua_tqAllTolua_IGridsManager_GetRoleIdByRoleName00);
   tolua_function(tolua_S,"GetGridIdByRoleId",tolua_tqAllTolua_IGridsManager_GetGridIdByRoleId00);
   tolua_function(tolua_S,"MapRoleNameToRoleId",tolua_tqAllTolua_IGridsManager_MapRoleNameToRoleId00);
   tolua_function(tolua_S,"MapRoleIdToGridId",tolua_tqAllTolua_IGridsManager_MapRoleIdToGridId00);
   tolua_function(tolua_S,"RefreshExileRoleIds",tolua_tqAllTolua_IGridsManager_RefreshExileRoleIds00);
   tolua_function(tolua_S,"GetExileGridByRoleId",tolua_tqAllTolua_IGridsManager_GetExileGridByRoleId00);
   tolua_function(tolua_S,"RemoveExileGridByRoleId",tolua_tqAllTolua_IGridsManager_RemoveExileGridByRoleId00);
   tolua_function(tolua_S,"AppendExileGrid",tolua_tqAllTolua_IGridsManager_AppendExileGrid00);
   tolua_function(tolua_S,"ClearGrid",tolua_tqAllTolua_IGridsManager_ClearGrid00);
   tolua_function(tolua_S,"CopyGrid",tolua_tqAllTolua_IGridsManager_CopyGrid00);
   tolua_function(tolua_S,"SetMapView",tolua_tqAllTolua_IGridsManager_SetMapView00);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"IRankManager","IRankManager","",NULL);
  tolua_beginmodule(tolua_S,"IRankManager");
   tolua_function(tolua_S,"GetRank",tolua_tqAllTolua_IRankManager_GetRank00);
   tolua_function(tolua_S,"StartChangeRolePos",tolua_tqAllTolua_IRankManager_StartChangeRolePos00);
   tolua_function(tolua_S,"AddNewRole",tolua_tqAllTolua_IRankManager_AddNewRole00);
   tolua_function(tolua_S,"RemoveRole",tolua_tqAllTolua_IRankManager_RemoveRole00);
   tolua_function(tolua_S,"EndChangeRolePos",tolua_tqAllTolua_IRankManager_EndChangeRolePos00);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"IRank","IRank","",NULL);
  tolua_beginmodule(tolua_S,"IRank");
   tolua_function(tolua_S,"Sort",tolua_tqAllTolua_IRank_Sort00);
   tolua_function(tolua_S,"LoadLast",tolua_tqAllTolua_IRank_LoadLast00);
   tolua_function(tolua_S,"GetCount",tolua_tqAllTolua_IRank_GetCount00);
   tolua_function(tolua_S,"Get",tolua_tqAllTolua_IRank_Get00);
   tolua_function(tolua_S,"GetIdxByName",tolua_tqAllTolua_IRank_GetIdxByName00);
  tolua_endmodule(tolua_S);
  tolua_cclass(tolua_S,"IProxyServer","IProxyServer","",NULL);
  tolua_beginmodule(tolua_S,"IProxyServer");
   tolua_function(tolua_S,"connect",tolua_tqAllTolua_IProxyServer_connect00);
   tolua_function(tolua_S,"isLosted",tolua_tqAllTolua_IProxyServer_isLosted00);
   tolua_function(tolua_S,"sendMsg",tolua_tqAllTolua_IProxyServer_sendMsg00);
  tolua_endmodule(tolua_S);
 tolua_endmodule(tolua_S);
 return 1;
}


#if defined(LUA_VERSION_NUM) && LUA_VERSION_NUM >= 501
 TOLUA_API int luaopen_tqAllTolua (lua_State* tolua_S) {
 return tolua_tqAllTolua_open(tolua_S);
};
#endif

