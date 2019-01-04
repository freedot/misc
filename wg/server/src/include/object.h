#ifndef _OBJECT_H_
#define _OBJECT_H_
#include "objectDef.h"

//tolua_begin
class BaseObject {
public:
	void setId(object_id id) {
		m_id = id;
	}

	object_id getId() {
		return m_id;
	}

public:
	virtual ~BaseObject() {
	}

protected:
	BaseObject() :
			m_id(0) {
	}

protected:
	object_id m_id;
};

/** 基础对象 */
class TypeObject: public BaseObject {
public:
	/** 获得对象类型 */
	int32 GetType() {
		return m_lType;
	}

	//tolua_end
public:
	/** 析构函数 */
	virtual ~TypeObject() {
	}

protected:
	/** 构造函数 */
	TypeObject() :
			m_lType(-1) {
	}

protected:
	int32 m_lType;
	//tolua_begin
};

//tolua_end

//tolua_begin

/** 引用计数对象 */
class RefObject: public BaseObject {
public:
	/** 增加引用计数 */
	int32 AddRef() {
		return ++m_lRefCount;
	}

	/** 获得当前的引用计数 */
	int32 GetRefCount() const {
		return m_lRefCount;
	}

	/** 释放引用计数 */
	virtual int32 Release() {
		if (m_lRefCount <= 0) {
			delete this;
		} else {
			--m_lRefCount;
		}
		return m_lRefCount;
	}

	//tolua_end
protected:
	/** 构造函数*/
	RefObject() :
			m_lRefCount(0) {
	}
	/** 析构函数*/
	virtual ~RefObject() {
	}
protected:
	/** 引用计数 */
	int32 m_lRefCount;
	//tolua_begin

};

//tolua_end

#endif // _OBJECT_H_
