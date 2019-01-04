#ifndef _I_GAMESYS_H
#define _I_GAMESYS_H
#include "IInterface.h"

// {6B57354B-57D9-4eec-AD41-F657304DC77D}
static const TQGUID IUID_IGAMESYS = { 0x6b57354b, 0x57d9, 0x4eec, { 0xad, 0x41,
		0xf6, 0x57, 0x30, 0x4d, 0xc7, 0x7d } };

//tolua_begin

/** 提供了其它接口对象注册和访问的对象容器，提供接口内部的相互调用一种
 途径，因此带来的是接口间其实隐含增加相互之间的耦合关系。
 */
class IGameSys: public IInterface {
public:
	/** 初始化游戏系统
	 */
	virtual bool Init() = 0;

	/** 向游戏系统注册一个创建某个IUID的接口所需的动态库，供@see IGameSys::CreateInterface使用
	 @param guid
	 接口的唯一标示ID
	 @param dllName
	 动态库的路径文件名
	 @return
	 返回true或false
	 */
	virtual bool RegisterInterface(const TQGUID& guid,
			const char* dllName) = 0;

	/** 通过IUID创建一个接口对象
	 @param guid
	 接口的唯一标示ID
	 @param guidName
	 接口的唯一标示字符串, 同guid
	 @return
	 返回接口对象, 为NULL时创建失败.
	 */
	virtual IInterface* CreateInterface(const TQGUID& guid) = 0;
	virtual IInterface* CreateInterface(const char* guidName)= 0;

	/** 通过IUID创建同时初始化一个接口对象
	 @remark
	 和CreateInterface的区别是，会额外的调用该接口的OnOneTimeInit成员方法
	 @param guid
	 接口的唯一标示ID
	 @param guidName
	 接口的唯一标示字符串, 同guid
	 @return
	 返回接口对象, 为NULL时创建失败.
	 */
	virtual IInterface* CreateAndInitInterface(const TQGUID& guid) = 0;
	virtual IInterface* CreateAndInitInterface(const char* guidName)= 0;

	/** 销毁一个接口对象
	 @param interFace
	 要被销毁的接口对象的指针
	 */
	virtual void DestroyInterface(IInterface** interFace) = 0;

	/** 容器的实现, 用户可向该容器中注册一个用户数据指针, 该用户数据指针和一个key值绑定
	 一般可以用该方法注册一个接口对象, 例如m_lpGameSys->RegisterUserData("EventSys", m_lpEventSys)
	 @param key
	 用户数据的key值
	 @param userData
	 用户数据指针
	 @return
	 返回true或false, 返回false表示该key值已经被使用或参数为空
	 */
	virtual bool RegisterUserData(const char* key, void* userData) = 0;

	/** 注销一个用户数据指针
	 @param key
	 用户数据的key值
	 */
	virtual void UnRegisterUserData(const char* key) = 0;

	/** 通过key值获得一个用户数据指针
	 @param key
	 用户数据的key值
	 @return
	 返回用户数据指针
	 */
	virtual void* GetUserData(const char* key) = 0;
};

#endif // _I_GAMESYS_H
