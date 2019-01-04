#ifndef _TQ_DYNSMCOM_H_
#define _TQ_DYNSMCOM_H_
#include <IScriptSys.h>
#include "GameSys.h"
struct lua_State;
extern int luaopen_tqAllTolua(lua_State* tolua_S);

namespace Script {
class DynSMCom: public IScriptModule {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()

public:
	bool InitScriptEnvironment(IScriptSys* lpScriptSys, void* lpScriptEnv);
	bool OnOneTimeInit();
	void OnOneTimeRelease() {
	}
	;

public:
	/** 构造函数 */
	DynSMCom();
	/** 析构函数 */
	virtual ~DynSMCom();

private:
	/** 注册lua函数
	 @param lpLuaState
	 lua状态对象
	 */
	void RegisterLuaFun(lua_State* lpLuaState);

private:
	lua_State* m_lpLuaState;
};

} // end namespace Script

#endif // _TQ_DYNSMCOM_H_
