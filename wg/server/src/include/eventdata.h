#ifndef _EVENT_DATA_H_
#define _EVENT_DATA_H_
#include "baseevent.h"

//tolua_begin

struct SLogEvent: public SBaseEvent {
	/// pointer to text which has been logged
	const char* text;

	SLogEvent() :
		text(NULL) {
	}
	/** get struct size */
	virtual int GetSize() {
		return sizeof(SLogEvent);
	}
};

struct SNetEvent: public SBaseEvent {
	/// 网络消息类型
	int32 msgType;
	/// 当前网络状态
	int32 netState;
	/// 当前网络错误号
	int32 netError;
	/// 网络消息协议号
	int32 cmd;
	/// 网络消息结果值
	int32 cmdResult;
	/// 网络数据缓冲长度
	int32 dataLen;
	/// 网络数据缓冲
	char* data;

	SNetEvent() :
			msgType(0), netState(0), netError(0), cmd(0), cmdResult(0), dataLen(
					0), data(NULL) {
	}
	/** get struct size */
	virtual int GetSize() {
		return sizeof(SNetEvent);
	}
};

struct SUserEvent: public SBaseEvent {
	/// Some user specified data as int
	int64 userData1;
	/// Another user specified data as int
	int64 userData2;
	/// Some user specified data as float
	float userData3;

	SUserEvent() :
		userData1(0), userData2(0), userData3(0.0f) {
	}
	/** get struct size */
	virtual int GetSize() {
		return sizeof(SUserEvent);
	}
};

/** 用来得到数据结构中最大的字节数 */
inline int GetEventDataMaxSize() {
	int iSize1 = sizeof(SLogEvent);
	int iSize2 = sizeof(SNetEvent);
	int iSize3 = sizeof(SUserEvent);

	int iMaxSize = iSize1;
	if (iSize2 > iMaxSize)
		iMaxSize = iSize2;
	if (iSize3 > iMaxSize)
		iMaxSize = iSize3;
	return iMaxSize;
}

//tolua_end

#endif // _EVENT_DATA_H_
