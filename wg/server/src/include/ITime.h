#ifndef _I_TIME_H_
#define _I_TIME_H_
#include <IInterface.h>

// {0206A677-529E-4264-9F07-F91C10AEBB87}
static const TQGUID IUID_ITIME = { 0x206a677, 0x529e, 0x4264, { 0x9f, 0x7, 0xf9,
		0x1c, 0x10, 0xae, 0xbb, 0x87 } };

//tolua_begin

/** 时间接口，作用是获取和server端同步的时间计数或者是client的虚拟播放时间
 */
class ITime: public IInterface {
public:
	/** 设置当前client时间和server的时间的差量
	 @param dispersionMs
	 单位毫秒，= servertime-clienttime
	 */
	virtual void SetDispersionMs(uint32 dispersionMs) = 0;

	/** 设置当前时间的缩放因子
	 @param scale
	 时间的缩放因子
	 */
	virtual void SetScale(double scale) = 0;

	/** 休眠一定的时间
	 @param timeMs
	 休眠的时间长度,单位毫秒
	 */
	virtual void SleepMs(uint32 timeMs) = 0;

	/** 获得当前时间
	 @remark
	 该函数返回的时间是通过时间差量和缩放因子运算过得到的,并不是真正的时间
	 @return
	 返回当前经运算过的时间,单位毫秒
	 */
	virtual uint32 GetCurrentTimeMs() = 0;
	virtual uint64 GetCurrentTimeMsEx() = 0;

	/** 获得当前时间
	 @remark
	 该函数返回的时间是通过时间差量和缩放因子运算过得到的,并不是真正的时间
	 @return
	 返回当前经运算过的时间,单位秒
	 */
	virtual uint32 GetCurrentTimeSec() = 0;
};

//tolua_end

#endif // _I_TIME_H_
