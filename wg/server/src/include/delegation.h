#ifndef _DELEGATION_H_
#define _DELEGATION_H_
#include <assert.h>

/** 提供Closure存储空间的虚拟类
 */
struct ObjectPlaceHolder {
	/** 用来模拟实际情况类的虚拟类，成员函数指针在有继承与无继承下大小不一样，
	 ObjectPlaceHolder需要提供足够的空间供MemFuncInvoker...实例存储，所以需
	 要按多继承情形模拟成员函数指针。
	 */
	class DummyBaseA {
	};
	class DummyBaseB {
	};
	class DummyClass: public DummyBaseA, public DummyBaseB {
	};

public:
	ObjectPlaceHolder() {
		Clear();
	}
	ObjectPlaceHolder(const ObjectPlaceHolder& other) {
		obj = other.obj;
		fptr = other.fptr;
	}
	inline bool IsNull(void) const {
		return obj == NULL;
	}
	inline void Clear(void) {
		obj = NULL;
		fptr = NULL;
	}
	inline bool operator ==(const ObjectPlaceHolder& other) const {
		return (obj == other.obj && fptr == other.fptr);
	}
private:
	DummyClass* obj;
	void (DummyClass::*fptr)(void);
};

/** Closure对象实现，同时实现了静态成员函数接口invoke，这是实现虚函数相似功能的关键
 重载的new方法使用指定的空间作为对象实例化的空间，因为我们实际上是用的委托方的空
 间，并不需要释放，所以delete方法什么也不做
 */
template<typename Delegation, typename T, typename R, typename V>
struct MemFuncInvoker0 {
private:
	struct Wrapper { typedef Delegation type; };
	friend class Wrapper :: type;
	typedef MemFuncInvoker0<Delegation, T, R, V> ThisType;
	typedef R (T::*Fptr)(V);
	MemFuncInvoker0(T* obj, Fptr func) {
		mObj = obj;
		mFunc = func;
	}
	static inline R Invoke(const ObjectPlaceHolder* address, V var) {
		const ThisType* pThis = reinterpret_cast<const ThisType*>(address);
		T* pObj = pThis->mObj;
		Fptr pFunc = pThis->mFunc;
		(pObj->*pFunc)(var);
	}
	static inline void* operator new(size_t size,
			const ObjectPlaceHolder* address, size_t space) {
		assert(size<=space);
		return (void*) address;
	}
	static inline void operator delete(void*, const ObjectPlaceHolder* address,
			size_t space) {
	}
private:
	T* mObj;
	Fptr mFunc;
};

/** 委托的实现 无返回值
 */
template<typename R, typename V>
struct Delegation0 {
public:
	typedef Delegation0<R, V> ThisType;
	typedef R (*InvokerType)(const ObjectPlaceHolder*, V);
public:
	Delegation0() {
		Detach();
	}
	Delegation0(const Delegation0& other) {
		mObj = other.mObj;
		invoker = other.invoker;
	}
	template<typename T>
	Delegation0(T* obj, R (T::*fptr)(V)) {
		Attach(obj, fptr);
	}
	template<typename T>
	inline void Attach(T* obj, R (T::*fptr)(V)) {
		invoker = MemFuncInvoker0<ThisType, T, R, V>::Invoke;
		new (&mObj, sizeof(ObjectPlaceHolder)) MemFuncInvoker0<ThisType, T, R, V>(
				obj, fptr);
	}
	inline void Detach(void) {
		mObj.Clear();
		invoker = NULL;
	}
	inline bool IsNull(void) const {
		return mObj.IsNull() || invoker == NULL;
	}
	inline R operator ()(V var) {
		invoker(&mObj, var);
	}
	inline bool operator ==(const Delegation0& other) const {
		return (mObj == other.mObj);
	}
private:
	//用来保存MemFuncInvoker实例的空间
	ObjectPlaceHolder mObj;
	InvokerType invoker;
};

#endif //_DELEGATION_H_
