#ifndef _TQ_DYNSMDBG_H_
#define _TQ_DYNSMDBG_H_
#include <IScriptSys.h>
#include <vector>
struct lua_State;

namespace Script {
class DynSMDbg: public IScriptModule {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()

public:
	bool InitScriptEnvironment(IScriptSys* lpScriptSys, void* lpScriptEnv);
	bool OnOneTimeInit();
	void OnUpdate(uint32 ulTimeMs);
	void OnOneTimeRelease();

public:
	/** 构造函数 */
	DynSMDbg();

	/** 析构函数 */
	virtual ~DynSMDbg();

protected:
	void RegisterLuaFun(lua_State* lpLuaState);

private:
	lua_State* m_lpLuaState;
};

} // end namespace Script

#endif // _TQ_DYNSMDBG_H_
