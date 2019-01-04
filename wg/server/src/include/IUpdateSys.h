#ifndef _I_UPDATESYS_H_
#define _I_UPDATESYS_H_
#include "IInterface.h"
#include "IUpdateListener.h"

// {0E1694FD-2AA4-4d07-BCB7-1BECC71CB058}
static const TQGUID IUID_IUPDATESYS = { 0xe1694fd, 0x2aa4, 0x4d07, { 0xbc, 0xb7,
		0x1b, 0xec, 0xc7, 0x1c, 0xb0, 0x58 } };

//tolua_begin

/** 更新系统,用来管理更新监听对象
 */
class IUpdateSys: public IInterface {
public:
	/** 向系统中添加一个更新监听对象
	 @param listener
	 将要被添加的更新监听对象
	 */
	virtual void AddUpdateListener(IUpdateListener* listener) = 0;

	/** 删除指定索引号的更新监听对象
	 @param idx
	 数据索引号
	 */
	virtual void DelUpdateListener(int idx) = 0;

	/** 获取更新监听对象的个数
	 @return
	 返回更新监听对象的个数
	 */
	virtual int GetUpdateListenerCount() = 0;
};

//tolua_end

#endif // _I_UPDATESYS_H_
