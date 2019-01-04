#ifndef _I_TIMERQUEUE_H
#define _I_TIMERQUEUE_H
#include "IInterface.h"
#include "ITimerListener.h"

typedef void* TQHANDLE;

// {7292645E-9B07-4c76-926B-332D18F40577}
static const TQGUID IUID_ITIMERQUEUE = { 0x7292645e, 0x9b07, 0x4c76, { 0x92,
		0x6b, 0x33, 0x2d, 0x18, 0xf4, 0x5, 0x77 } };
// {2292646E-1B07-4175-826C-222D18F40577}
static const TQGUID IUID_ITIMERQUEUE_EX = { 0x2292646E, 0x1b07, 0x4175, { 0x82,
		0x6c, 0x22, 0x2d, 0x18, 0xf4, 0x5, 0x77 } };

/** 时间队列接口 */
class ITimerQueue: public IInterface {
public:
	/** 初始化时钟队列的最小精度，单位是毫秒
	 @param ulPrecisionMs
	 时钟队列的最小精度，单位毫秒
	 @return
	 返回true初始化化成功。
	 */
	virtual bool Init(uint32 ulPrecisionMs) = 0;

	/** 在时钟队列中，设置一个时钟
	 @param ulIdEvent
	 该时钟的事件id，该值将在ITimerListener::OnTimer()调用时被传入
	 @param lpUserData
	 该时钟的用户数据
	 @param ulElapseMs
	 该时钟将被触发的时间间隔
	 @param lpTimer
	 该时钟被触发时，将调用的监听对象
	 @return
	 将返回该时钟的句柄，为NULL时表示添加失败。该句柄将用来释放该时钟节点，
	 参见@see ITimerQueue::KillTimer。
	 */
	virtual TQHANDLE SetTimer(uint32 ulIdEvent, void* lpUserData,
			uint32 ulElapseMs, ITimerListener* lpTimer) = 0;

	/** 通过时钟句柄获得绑定的userdata
	 @param hTimer
	 时钟句柄
	 @return
	 返回用户数据
	 */
	virtual void* GetUserData(TQHANDLE hTimer) = 0;

	/** Kill掉某个时钟节点
	 @param hTimer
	 将要被Kill的时钟节点句柄，该句柄是由@see ITimerQueue::SetTimer 生成
	 */
	virtual bool KillTimer(TQHANDLE hTimer) = 0;

	virtual void Print() = 0; // for debug
};

const int TIMER_IDS_COUNT = 8;
class TIMER_IDS {
public:
	char keyCount;
	uint32 ids[TIMER_IDS_COUNT];
	bool operator<(const TIMER_IDS& ids) const {
		for (int i = 0; i < keyCount; ++i) {
			if (this->ids[i] < ids.ids[i])
				return true;
		}
		return false;
	}

	TIMER_IDS() {
		keyCount = 0;
		memset(this->ids, 0, sizeof(this->ids));
	}

	TIMER_IDS(const TIMER_IDS& ids, int keyCount) {
		this->keyCount = keyCount;
		for (int i = 0; i < TIMER_IDS_COUNT; ++i) {
			this->ids[i] = ids.ids[i];
		}
	}
};

const int TIMER_PARAMS_COUNT = 2;
class TIMER_PARAMS {
public:
	uint32 ps[TIMER_PARAMS_COUNT];
};

class ITimerQueueEx: public IInterface {
public:
	virtual bool Init(uint32 queueSize, uint32 precisionMs) = 0;
	virtual TIMER_IDS* GetConstIds() = 0;
	virtual TIMER_PARAMS* GetConstParams() = 0;
	virtual void Start(int keyIdCnt, const TIMER_IDS* ids, uint32 elapseMs,
			const TIMER_PARAMS* params, ITimerListenerEx* timerListener) = 0;
	virtual void Stop() = 0;
};

#endif // _I_TIMERQUEUE_H
