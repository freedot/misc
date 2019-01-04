#ifndef _OBJ_CONTAINER_H
#define _OBJ_CONTAINER_H
#include <commhead.h>
#include <vector>
#include <fixAlloc.h>
#include <fixQueue.h>

/** 对象管理容器 */
template<class T>
class ObjContainer {
public:
	/** 初始化该仿真对象容器 
	 @param type
	 对象的类型
	 @param maxcount
	 能容纳仿真对象的最大个数
	 @return
	 返回true或false*/
	bool init(uchar type, int maxcount);

	/** 通过对象的id获得该对象指针 
	 @param lId
	 对象id
	 @return
	 返回对象指针或NULL*/
	T* getById(object_id id);

	/** 获取总的对象个数，包括NULL对象 */
	int getCount();

	/** 通过对象的索引获得该对象指针 
	 @param idx
	 对象的索引
	 @return
	 返回对象指针或NULL*/
	T* getByIdx(uint32 idx);

	/** 释放一个对象
	 @param lId
	 要释放的对象id*/
	void freeObject(object_id id);

	/** 分配一个对象 
	 @return
	 返回对象的指针或NULL */
	T* allocObject();

public:
	/** 构造函数 */
	ObjContainer();
	/** 析构函数 */
	virtual ~ObjContainer();

private:
	object_id getNewObjectId();

private:
	FixAlloc<T> m_allocs;	// 对象分配器
	FixQueue<object_id> m_freeIds; // 存放空闲的节点
	std::vector<T*> m_objects;	// 存放对象指针
	uchar m_type; // 对象的类型
};

template<class T> inline ObjContainer<T>::ObjContainer() :
		m_type(0) {
}

template<class T> inline ObjContainer<T>::~ObjContainer() {
}

template<class T> inline
bool ObjContainer<T>::init(uchar type, int maxcount) {
	if (maxcount <= 0)
		return false;
	m_type = type;
	m_allocs.Init(maxcount, 0, true, true);
	m_objects.resize(maxcount);
	m_freeIds.init(maxcount);
	for (int i = 0; i < maxcount; ++i) {
		m_objects[i] = NULL;
		m_freeIds.push((object_id)(i));
	}
	return true;
}

template<class T> inline T* ObjContainer<T>::getById(object_id id) {
	int32 idx = GETSIMOBJINDEX(id);
	if (idx < 0 || idx >= (int32)m_objects.size())
		return NULL;
	T* obj = m_objects[idx];
	if (obj != NULL && obj->getId() == id) {
		return obj;
	}
	return NULL;
}

template<class T> inline int ObjContainer<T>::getCount() {
	return (int)m_objects.size();
}

template<class T> inline T* ObjContainer<T>::getByIdx(uint32 idx) {
	if (idx >= (uint32)m_objects.size())
		return NULL;
	return m_objects[idx];
}

template<class T> inline
void ObjContainer<T>::freeObject(object_id id) {
	int32 idx = GETSIMOBJINDEX(id);
	if (idx < 0 || idx >= (int32)m_objects.size())
		return;
	T* obj = m_objects[idx];
	if (obj != NULL && obj->getId() == id) {
		m_allocs.Free(obj);
		m_freeIds.push(id);
		m_objects[idx] = NULL;
		std::clog << "free object id: " << (uint32) id << std::endl;
	}
}

template<class T> inline T* ObjContainer<T>::allocObject() {
	object_id id = getNewObjectId();
	if (id == SIMOBJ_INVALID_ID)
		return NULL;

	std::clog << "alloc object id: " << (uint32) id << std::endl;
	T* obj = m_allocs.Alloc();
	if (obj == NULL) {
		assert(false);
		std::cerr << "alloc object id failed" << std::endl;
		return NULL;
	}

	uint32 idx = GETSIMOBJINDEX(id);
	m_objects[idx] = obj;
	obj->setId(id);
	return obj;
}

template<class T> inline object_id ObjContainer<T>::getNewObjectId() {
	if (m_freeIds.empty())
		return SIMOBJ_INVALID_ID;

	object_id id = m_freeIds.top();
	m_freeIds.pop();
	uint32 idx = GETSIMOBJINDEX(id);
	ushort seq = GETSIMOBJSEQ(id);
	seq = NEXT_OBJ_SEQ(seq);
	return MAKESIMOBJID(idx, m_type, seq);
}

#endif // _OBJ_CONTAINER_H
