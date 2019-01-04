#ifndef _TQ_I_SCRIPT_PUB_H_
#define _TQ_I_SCRIPT_PUB_H_
#include <IInterface.h>
#include "tqRoleVar.h"
#include <IDatabase.h>

class SPlayer;
using namespace IO;

//tolua_begin
enum EGameUserState {
	/// 初始化状态
	EGUS_INIT,
	/// Flash校验状态
	EGUS_CHECK_CROSS,
	/// 正在登录
	EGUS_LOGINNING,
	/// 创建角色状态
	EGUS_CREATEROLE,
	/// 在游戏中
	EGUS_INGAME,
	/// 离线在游戏中（不是玩家主动进入，是由程序自动拉起）
	EGUS_OFFLINE_INGAME,
	/// 处于关闭状态
	EGUS_WILLCLOSE,
};
//tolua_end

//tolua_begin
struct ScriptEvent : public SBaseEvent {
	/// connect server id
	int connid;
	/// 产生该事件的玩家对象id
	object_id playerid;
	/// 网络数据缓冲长度
	int datalen;
	/// 网络数据缓冲
	char* data;
	//tolua_end
	
	/** 构造函数 */
	ScriptEvent():connid(0),playerid(0),datalen(0),data(NULL){}
	virtual ~ScriptEvent(){}
	/** 获得当前结构大小 */
	virtual int GetSize(){ return sizeof(ScriptEvent); }
	
	//tolua_begin
};
//tolua_end

//tolua_begin
struct TimerEvent : public SBaseEvent {
	/// 时钟句柄
	int hdr;
	/// connect server id
	int connid;
	/// 产生该事件的玩家对象id
	object_id playerid;
	/// 事件ID
	uint32 eventid;
	/// 当前时间
	uint32 curtimeMs;
	/// 参数
	int64 param1;
	/// 参数
	int64 param2;
	//tolua_end
	
	/** 构造函数 */
	TimerEvent():hdr(0),connid(0),playerid(0),eventid(0),curtimeMs(0),param1(0),param2(0){}
	virtual ~TimerEvent(){}
	/** 获得当前结构大小 */
	virtual int GetSize(){ return sizeof(TimerEvent); }
	
	//tolua_begin
};
//tolua_end

struct TimerUserData {
	/// connect server id
	int connid;
	/// 产生该事件的玩家对象id
	object_id playerid;
	/// 参数
	int64 param1;
	/// 参数
	int64 param2;
};


//tolua_begin
class IScriptPub : public IInterface {
public:

	virtual object_id MakeNewRoleId(const SDBVar* dbvar) = 0;

	/** 创建角色 
	*/
	virtual int CreateRole(const SDBVar* dbvar) = 0;

	/** 用户登录游戏
	*/
	virtual int RoleLogin(SDBVar* dbvar, const char* username, int zoneid) = 0;

	/** 角色数据保存
	*/
	virtual int RoleSave(const SDBVar* dbvar) = 0;

	/** 用户登出游戏
	*/
	virtual void RoleLogout(const SPlayer* lpPlayer, int iReason) = 0;

	/** 给指定id的客户端发送消息
	*/
	virtual void SendMsg(object_id id, int connid, const char* msg) = 0;

	/** 
	*/
	virtual void SendMsgNotifyCmd(object_id id, int connid, int cmd) = 0;

	/** 
	*/
	virtual void SendUseKeyCmd(object_id id, int connid, const char* key) = 0;

	virtual SDBVar* AllocDBVar() = 0;

	virtual void FreeDBVar(SDBVar* dbvar) = 0;

	virtual bool IsExistRoleName(const char* rolename) = 0;
	
	virtual bool IsExistUserName(const char* username) = 0;

	virtual int InitAlliByUID(object_id id, SDBAlliVar* dballivar) = 0;

	virtual SDBAlliVar* AllocDBAlliVar() = 0;
 
	virtual void FreeDBAlliVar(SDBAlliVar* dbvar) = 0;

	virtual TimerUserData* AllocTimerUserData() = 0;

	virtual void FreeTimerUserData(TimerUserData* userdata) = 0;

	virtual ushort GetZoneId() = 0;

	virtual IDatabase* GetDBConn() = 0;
	
	virtual void ClearInnerHero(const SHero* hero) = 0;

	virtual int32 diffTimeMs(uint32 time1, uint32 time2) = 0;

	virtual uint32 getTimeMs() = 0;
	
	virtual uint64 getTimeMsEx() = 0;

	virtual const char* GetCfgBasePath() = 0;
	
	virtual const char* GetLogBasePath() = 0;
	
	virtual const char* GetSvrNameId() = 0;

	virtual ~IScriptPub(){}
};
//tolua_end

#endif // _TQ_I_SCRIPT_PUB_H_





