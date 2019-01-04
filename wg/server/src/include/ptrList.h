#ifndef _PTRLIST_H_
#define _PTRLIST_H_
#include "fixAlloc.h"
#include "singleton.h"

const int C_PTRLISTALLOC_NODE_COUNT = 4096;
const bool C_ISFIXED_ALLOC_PTRLISTALLOC_NODE = false;

//==============================================================================
struct SListNode {
	/** 将一节点插入当前节点的前面
	 @param lpInsertNode
	 要插入的节点 */
	void InsertBefore(SListNode* lpInsertNode);

	/** 将一节点插入当前节点的后面
	 @param lpInsertNode
	 要插入的节点 */
	void InsertAfter(SListNode* lpInsertNode);

	/** 将当前节点从链表中移除 */
	void RemoveSelfFromList();

	/** 构造函数 */
	SListNode();

	SListNode* lpPrev;
	SListNode* lpNext;
};

inline SListNode::SListNode() :
		lpPrev(NULL), lpNext(NULL) {
}

inline
void SListNode::InsertBefore(SListNode* lpInsertNode) {
	if (lpInsertNode) {
		lpInsertNode->lpPrev = this->lpPrev;
		lpInsertNode->lpNext = this;
		if (this->lpPrev) {
			this->lpPrev->lpNext = lpInsertNode;
		}
		this->lpPrev = lpInsertNode;
	}
}

inline
void SListNode::InsertAfter(SListNode* lpInsertNode) {
	if (lpInsertNode) {
		lpInsertNode->lpPrev = this;
		lpInsertNode->lpNext = this->lpNext;
		if (this->lpNext) {
			this->lpNext->lpPrev = lpInsertNode;
		}
		this->lpNext = lpInsertNode;
	}
}

inline
void SListNode::RemoveSelfFromList() {
	if (this->lpPrev) {
		this->lpPrev->lpNext = this->lpNext;
	}

	if (this->lpNext) {
		this->lpNext->lpPrev = this->lpPrev;
	}

	lpPrev = NULL;
	lpNext = NULL;
}

//==============================================================================
/** 某对象指针链表节点 */
template<typename T>
struct SPtrListNode: public SListNode {
	/** 构造函数 */
	SPtrListNode();

	/** 前一个节点指针 */
	SPtrListNode<T>* Prev() const;

	/** 后一个节点指针 */
	SPtrListNode<T>* Next() const;

	/** 当前节点值 */
	T* Value();

	T* lpPtr;
};

template<typename T> inline SPtrListNode<T>::SPtrListNode() :
		lpPtr(NULL) {
}

template<typename T> inline SPtrListNode<T>* SPtrListNode<T>::Prev() const {
	return static_cast<SPtrListNode<T>*>(lpPrev);
}

template<typename T> inline SPtrListNode<T>* SPtrListNode<T>::Next() const {
	return static_cast<SPtrListNode<T>*>(lpNext);
}

template<typename T> inline T* SPtrListNode<T>::Value() {
	return lpPtr;
}

//==============================================================================
/** 分配列表节点的单件 */
class PtrListAlloc: public Singleton<PtrListAlloc> {
	DECLARE_SINGLETON(PtrListAlloc);
public:
	/** 分配一个可用的节点
	 如果返回为NULL，有两层含义，一是可分配队列为空(bFixed为true)，
	 一是内存用光(bFixed为false)	*/
	SPtrListNode<void>* Alloc();

	/** 释放一个节点
	 @param lpObject
	 将被释放的对象指针 */
	void Free(SPtrListNode<void>* lpObject);

private:
	/** 构造函数，私有化的目的是防止其他地方构造该类确保单一性*/
	PtrListAlloc();

private:
	/** 连表节点分配器对象 */
	FixAlloc<SPtrListNode<void> > m_objNodeAlloc;
};

inline PtrListAlloc::PtrListAlloc() {
	m_objNodeAlloc.Init(C_PTRLISTALLOC_NODE_COUNT, 0,
			C_ISFIXED_ALLOC_PTRLISTALLOC_NODE, true);
}

inline SPtrListNode<void>* PtrListAlloc::Alloc() {
	return m_objNodeAlloc.Alloc();
}

inline
void PtrListAlloc::Free(SPtrListNode<void>* lpObject) {
	m_objNodeAlloc.Free(lpObject);
}

//==============================================================================
/** 指针链表 @see SPtrListNode 和 @see PtrListAlloc*/

template<typename T>
class PtrList {
public:
	typedef SPtrListNode<T> Iterator;

public:
	/** 在链表的头插入一个对象指针
	 @param lpPtr
	 将要插入的对象指针
	 @return
	 返回节点指针 */
	Iterator* PushFront(T* lpPtr);

	/** 在链表的尾插入一个对象指针
	 @param lpPtr
	 将要插入的对象指针
	 @return
	 返回节点指针 */
	Iterator* PushBack(T* lpPtr);

	/** 将一个链表节点Attach到链表的头,该链表节点需要是被Pick出来的
	 @param lpNode
	 将要Attack的链表节点*/
	void AttachFront(Iterator* lpNode);

	/** 将一个链表节点Attach到链表的尾,该链表节点需要是被Pick出来的
	 @param lpNode
	 将要Attach的链表节点*/
	void AttachBack(Iterator* lpNode);

	/** 将表头移出 */
	void PopFront();

	/** 将表尾移出 */
	void PopBack();

	/** 从链表中将该节点摘取
	 @remark
	 和@see Erase 不同的是，Pick只是将该节点摘取出来，并不真正删除该节点
	 随后该节点还需要插入到链表中。
	 @param lpNode
	 将要摘取的节点指针
	 @return
	 返回下个节点的指针*/
	Iterator* Pick(Iterator* lpNode);

	/** 移除一个链表的节点指针
	 @param lpNode
	 将要移除的节点指针
	 @return
	 返回下个节点的指针*/
	Iterator* Erase(Iterator* lpNode);

	/** 返回表头的值 */
	T* Front();

	/** 返回表尾的值 */
	T* Back();

	/** 查找一个对象
	 @param lpObj
	 要查找的对象
	 @return
	 返回当前对象所处的游标 */
	Iterator* Find(const T* lpObj);

	/** 在指定的范围内查找一个对象
	 @param lpBegin
	 范围游标头
	 @param lpEnd
	 范围游标尾
	 @param lpObj
	 要查找的对象
	 @return
	 返回当前对象所处的游标 */
	Iterator* FindInRange(Iterator* lpBegin, Iterator* lpEnd, const T* lpObj);

	/** 从链表中移出指定的值
	 @param lpObj
	 将被移出的值
	 @remark
	 由于该操作需要遍历整个链表节点,所以耗时较长,建议在比较时使用 */
	void Remove(T* lpObj);

	/** 返回当前链表是否为空 */
	bool IsEmpty(void);

	/** 获取链表的开始节点指针 */
	Iterator* Begin() const;

	/** 获取链表的结束Eof节点指针 */
	Iterator* End() const;

	/** 清空链表 */
	void Clear();

	/** 释放整个列表资源 */
	void Release();

public:
	/** 构造函数 */
	PtrList();

	/** 析构函数 */
	virtual ~PtrList();

private:
	/** 链表头节点指针 */
	SPtrListNode<T>* m_lpHead;
	/** 链表尾节点指针 */
	SPtrListNode<T>* m_lpTail;
};

template<typename T> inline PtrList<T>::PtrList() {
	m_lpHead =
			reinterpret_cast<SPtrListNode<T>*>(PtrListAlloc::Instance()->Alloc());
	m_lpTail =
			reinterpret_cast<SPtrListNode<T>*>(PtrListAlloc::Instance()->Alloc());
	m_lpHead->lpPrev = NULL;
	m_lpHead->lpNext = m_lpTail;
	m_lpTail->lpPrev = m_lpHead;
	m_lpTail->lpNext = NULL;
}

template<typename T> inline PtrList<T>::~PtrList() {
	Release();
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::PushFront(
		T* lpPtr) {
	SPtrListNode<T>* lpNode = NULL;
	if (lpPtr != NULL) {
		lpNode =
				reinterpret_cast<SPtrListNode<T>*>(PtrListAlloc::Instance()->Alloc());
		lpNode->lpPtr = lpPtr;
		m_lpHead->InsertAfter(lpNode);
	}
	return lpNode;
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::PushBack(
		T* lpPtr) {
	Iterator* lpNode = NULL;
	if (lpPtr != NULL) {
		lpNode = reinterpret_cast<Iterator*>(PtrListAlloc::Instance()->Alloc());
		lpNode->lpPtr = lpPtr;
		m_lpTail->InsertBefore(lpNode);
	}
	return lpNode;
}

template<typename T> inline
void PtrList<T>::AttachFront(Iterator* lpNode) {
	if (lpNode != NULL) {
		m_lpHead->InsertAfter(lpNode);
	}
}

template<typename T> inline
void PtrList<T>::AttachBack(Iterator* lpNode) {
	if (lpNode != NULL) {
		m_lpTail->InsertBefore(lpNode);
	}
}

template<typename T> inline
void PtrList<T>::PopFront() {
	if (!IsEmpty()) {
		Erase(m_lpHead->Next());
	}
}

template<typename T> inline
void PtrList<T>::PopBack() {
	if (!IsEmpty()) {
		Erase(m_lpTail->Prev());
	}
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::Erase(
		Iterator* lpPtr) {
	Iterator* lpNext = Pick(lpPtr);
	if (lpPtr) {
		PtrListAlloc::Instance()->Free(
				reinterpret_cast<SPtrListNode<void>*>(lpPtr));
	}
	return lpNext;
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::Pick(
		Iterator* lpPtr) {
	Iterator* lpNext = NULL;
	if (lpPtr != NULL && lpPtr != m_lpHead && lpPtr != m_lpTail) {
		lpNext = lpPtr->Next();
		lpPtr->RemoveSelfFromList();
	} else if (lpPtr == m_lpHead || lpPtr == m_lpTail) {
		lpPtr = lpNext->Prev();  // crash it
	}
	return lpNext;
}

template<typename T> inline T* PtrList<T>::Front() {
	if (!IsEmpty()) {
		return m_lpTail->Prev()->Value();
	}
	return NULL;
}

template<typename T> inline T* PtrList<T>::Back() {
	if (!IsEmpty()) {
		return m_lpHead->Next()->Value();
	}
	return NULL;
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::Find(
		const T* lpObj) {
	return FindInRange(Begin(), End(), lpObj);
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::FindInRange(
		Iterator* lpBegin, Iterator* lpEnd, const T* lpObj) {
	Iterator* lpIter = lpBegin;
	for (; lpIter != lpEnd; lpIter = lpIter->Next()) {
		if (lpIter->Value() == lpObj) {
			return lpIter;
		}
	}
	return lpEnd;
}

template<typename T> inline
void PtrList<T>::Remove(T* lpObj) {
	Iterator* lpIter = FindInRange(Begin(), End(), lpObj);
	while (lpIter != End()) {
		lpIter = Erase(lpIter);
		lpIter = FindInRange(lpIter, End(), lpObj);
	}
}

template<typename T> inline
bool PtrList<T>::IsEmpty() {
	return (m_lpHead->Next() == m_lpTail);
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::Begin() const {
	return m_lpHead->Next();
}

template<typename T> inline typename PtrList<T>::Iterator* PtrList<T>::End() const {
	return m_lpTail;
}

template<typename T> inline
void PtrList<T>::Clear() {
	Iterator* lpNode = Begin();
	Iterator* lpNextNode = lpNode;
	while (lpNode != End()) {
		lpNextNode = lpNode->Next();
		lpNode->RemoveSelfFromList();
		PtrListAlloc::Instance()->Free(
				reinterpret_cast<SPtrListNode<void>*>(lpNode));
		lpNode = lpNextNode;
	}
}

template<typename T> inline
void PtrList<T>::Release() {
	SPtrListNode<T>* lpNode = m_lpHead;
	SPtrListNode<T>* lpNextNode = lpNode;
	while (lpNode) {
		lpNextNode = static_cast<SPtrListNode<T>*>(lpNode->lpNext);
		PtrListAlloc::Instance()->Free(
				reinterpret_cast<SPtrListNode<void>*>(lpNode));
		lpNode = lpNextNode;
	}

	m_lpHead = NULL;
	m_lpTail = NULL;
}

#endif // _PTRLIST_H_
