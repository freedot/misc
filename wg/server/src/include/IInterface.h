#ifndef _I_INTERFACE_H_
#define _I_INTERFACE_H_
#include "commhead.h"
#include "IUpdateListener.h"
#include "IEventListener.h"
#include "IRenderListener.h"

class IGameSys;

class IInterface: public IUpdateListener,
		public IEventListener,
		public IRenderListener {
public:
	virtual void SetIUID(const TQGUID& IGUID) = 0;
	virtual const TQGUID& GetIUID(void) const = 0;
	virtual void SetGameSys(const IGameSys* lpGameSys) = 0;
	virtual bool OnOneTimeInit() = 0;
	virtual void OnOneTimeRelease() = 0;
};

_TQ_API IInterface* CreateInterface(const TQGUID& IGUID);
_TQ_API void DestroyInterface(IInterface** lplpInterface);

typedef IInterface* (*CREATEINTERFACE)(const TQGUID& IGUID);

typedef void (*DESTROYINTERFACE)(IInterface**);

/** 申明一个接口的定义 */
#define DECLARE_TQINTERFACE() \
		public: \
		virtual void SetIUID(const TQGUID& IGUID){m_IGUID = IGUID;} \
		virtual const TQGUID& GetIUID(void) const{return m_IGUID;} \
		virtual void SetGameSys(const IGameSys* lpGameSys){m_lpGameSys=const_cast<IGameSys*>(lpGameSys);} \
	private: \
	TQGUID m_IGUID; \
	IGameSys* m_lpGameSys; \
		public: 

/** 初始化接口 */
#define INIT_TQINTERFACE() \
		memset(&m_IGUID, 0, sizeof(m_IGUID));\
		m_lpGameSys = NULL;

#define DECLARE_RENDERLISTENER() \
		virtual void OnRender();

#define DECLARE_DEFAULT_RENDERLISTENER() \
		virtual void OnRender(){}

#define DECLARE_EVENTLISTENER() \
		virtual void OnEvent(SEvent& stEvent);

#define DECLARE_DEFAULT_EVENTLISTENER() \
		virtual void OnEvent(SEvent& stEvent){}

#define DECLARE_UPDATELISTENER() \
		virtual void OnUpdate(uint32 ulTimeMs);

#define DECLARE_DEFAULT_UPDATELISTENER() \
		virtual void OnUpdate(uint32 ulTimeMs){}

#define DECLARE_DEFAULT_ONONETIME() \
		virtual bool OnOneTimeInit(){return true;}\
		virtual void OnOneTimeRelease(){}

#endif // _I_INTERFACE_H_
