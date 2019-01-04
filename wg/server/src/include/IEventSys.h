#ifndef _I_EVENTSYS_H_
#define _I_EVENTSYS_H_
#include "IInterface.h"
//#include "delegation.h"
#include "IEventListener.h"

// {04E37DAE-9D02-40db-91CA-306D01AB624E}
static const TQGUID IUID_IEVENTSYS = { 0x4e37dae, 0x9d02, 0x40db, { 0x91, 0xca,
		0x30, 0x6d, 0x1, 0xab, 0x62, 0x4e } };

//tolua_begin

/** 事件系统初始化标志 */
enum EEventSysFlag {
	/// 无锁同步标志
	EESF_NOT_LOCK = 0,
	/// 有锁同步标志
	EESF_MUTEX_LOCK = 1,
};

/** 主要负责事件队列的维护、事件的分发处理。
 */
class IEventSys: public IInterface {
public:
	/** 初始化事件处理系统
	 @param count
	 初始化事件节点个数
	 @param handlePendMaxTimes
	 在一帧中处理pend队列中事件的个数
	 @return
	 返回true初始化化成功。
	 */
	virtual bool Init(uint32 count, uint32 handlePendMaxTimes) = 0;

	/** 处理事件队列
	 @return
	 返回0表示无消息处理，负数表示出错的类型，正数为处理消息的个数
	 */
	virtual int ProcessPendEvents()= 0;

	/** 向事件处理系统发送一个事件消息，需要立即处理并返回
	 @param event
	 事件消息数据
	 @return
	 返回0表示成功, 负数表示错误的类型。
	 */
	virtual int SendEvent(SEvent& event) = 0;

	/** 向事件处理系统的事件队列中发送一个事件消息，不需要立即处理，无返回值
	 @param event
	 事件消息数据
	 */
	virtual void PendEvent(SEvent& event) = 0;

	/** 添加事件监听对象
	 @param listener
	 将要被添加的事件监听对象
	 */
	virtual void AddEventListener(IEventListener* listener) = 0;

	/** 删除指定索引号的事件监听对象
	 @param idx
	 数据索引号
	 */
	virtual void DelEventListener(int idx) = 0;

	/** 获取事件监听对象的个数
	 @return
	 返回事件监听对象的个数
	 */
	virtual int GetEventListenerCount() = 0;

};

//tolua_end

#endif // _I_EVENTSYS_H_
