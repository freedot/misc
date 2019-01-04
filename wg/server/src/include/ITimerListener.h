#ifndef _I_TIMERLISTENER_H
#define _I_TIMERLISTENER_H

/** 该接口是用来监听时钟触发事件的，凡是需要时钟驱动的对象必须继承于该接口
 */
class ITimerListener {
public:
	/** 监听时钟回调函数
	 @param hHdr
	 该时钟对应的句柄
	 @param lIdEvent
	 该时钟对应的事件id
	 @param lpUserData
	 该时钟对应的用户数据
	 @param lCurTimeMs
	 当前系统的绝对时间，单位毫秒
	 */
	virtual void OnTimer(TQHANDLE hHdr, int32 lIdEvent, void* lpUserData,
			int32 lCurTimeMs) = 0;
};

class TIMER_IDS;
class TIMER_PARAMS;

class ITimerListenerEx {
public:
	virtual void OnTimer(const TIMER_IDS* ids, const TIMER_PARAMS* params,
			uint32 curTimeMs) = 0;
};

#endif // _I_TIMERLISTENER_H
