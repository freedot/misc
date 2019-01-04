#ifndef _I_EVENT_HANDLER_H_
#define _I_EVENT_HANDLER_H_
#include "IInterface.h"
#include "IEventListener.h"
#include "delegation.h"
#include <list>

// {C962C784-4C24-45db-BE06-493EDF8FAA27}
static const TQGUID IUID_IEVENTHANDLER = { 0xc962c784, 0x4c24, 0x45db, { 0xbe,
		0x6, 0x49, 0x3e, 0xdf, 0x8f, 0xaa, 0x27 } };

enum EEventType;
typedef Delegation0<void, SEvent&> DelegationEvent;

/** 事件系统初始化标志 */
enum EEventHandlerFlag {
	/// 无锁同步标志
	EEHF_NOT_LOCK = 0,
	/// 有锁同步标志
	EEHF_MUTEX_LOCK = 1,
};

/** 事件回调注册表结构
 */
struct SEventTable {
	/// 处理发送事件对象起始id
	object_id lObjFromId;
	/// 处理发送事件对象终止id
	object_id lObjToId;
	/// 要处理的事件类型ID
	EEventType eEventType;
	/// 处理该事件的回调函数
	DelegationEvent objCallback;
	/// 传入的用户数据对象
	UserDataObject objUserData;
};

typedef std::list<SEventTable> StdLstEventTable;
typedef StdLstEventTable::iterator StdLstEventTableIter;

/** 事件处理器接口
 */
class IEventHandler: public IInterface {
public:
	/** 初始化该事件处理器接口
	 @param iInitNodeCount
	 可以容纳注册的初始节点个数
	 @param eFlag
	 是否需要线程同步的保护标志
	 @return
	 返回true或false
	 */
	virtual bool Init(int iInitNodeCount, EEventHandlerFlag eFlag) = 0;

	/** 注册一个对某个事件的对象回调接口
	 @param lObjFromId
	 处理发送事件对象起始id
	 @param lObjToId
	 处理发送事件对象终止id
	 @param eEventType
	 要处理的事件类型ID
	 @param objCallback
	 处理该事件的回调函数
	 @param objUserData
	 传入的用户数据对象
	 @return
	 返回该注册句柄，为NULL时表示失败。该句柄主要供UnRegister使用。
	 */
	virtual TQHANDLE Register(object_id lObjFromId, object_id lObjToId,
			EEventType eEventType, const DelegationEvent& objCallback,
			const UserDataObject* lpUserData) = 0;

	/** 注销一个事件处理句柄
	 @param hHandle
	 事件注册句柄，是由函数Register返回的值。
	 */
	virtual void UnRegister(TQHANDLE hHandle) = 0;

	/** 返回当前的事件处理器是否可用
	 */
	virtual bool GetEvtHandlerEnabled() = 0;

	/** 在事件处理器链中,获得当前处理器的下个兄弟处理器对象指针
	 */
	virtual const IEventHandler* GetNextHandler() const = 0;

	/** 在事件处理器链中,获得当前处理器的前一个兄弟处理器对象指针
	 */
	virtual const IEventHandler* GetPreviousHandler() const = 0;

	/** 处理一个事件消息
	 @param stEvent
	 事件消息
	 */
	virtual void ProcessEvent(SEvent& stEvent) = 0;

	/** 设置或关闭当前处理器的有效性
	 @remarks
	 可以使用该函数实现避免从链中删除,同时又能实现不响应事件
	 @param bEnabled
	 true或false
	 */
	virtual void SetEvtHandlerEnabled(bool bEnabled) = 0;

	/** 设置当前处理器的下一个兄弟处理器指针
	 @param lpHandler
	 下一个兄弟处理器指针
	 */
	virtual void SetNextHandler(const IEventHandler* lpHandler) = 0;

	/** 设置当前处理器的上一个兄弟处理器指针
	 @param lpHandler
	 上一个兄弟处理器指针
	 */
	virtual void SetPreviousHandler(const IEventHandler* lpHandler) = 0;
};

#endif // _I_EVENT_HANDLER_H_
