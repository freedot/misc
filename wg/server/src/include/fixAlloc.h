#ifndef _FIXALLOC_H_
#define _FIXALLOC_H_
#include <memory>
#include <limits>
#include <vector>
#include <list>
#include <assert.h>


/** 一个固定大小结构对象分配器
 @remarks
 该分配器不支持多线程，同时节点是无引用计数安全机制，
 在析构该分配器时，确保是所有节点自动失效或全部已Free
 */
template<typename T>
class FixAlloc {
private:
	/** 单向节点结构 */
	struct SInnerListNode {
		/** 指向的下个节点 */
		SInnerListNode* lpNext;
	};

	/** 每个整块的头部结构 */
	struct SBufferHead {
		/** 该块被引用的个数 */
		int iRefCount;
		/** 该块的起始地址,在节点释放时作范围判断 */
		char* lpFirstPtr;
		/** 该块的结尾地址,在节点释放时作范围判断 */
		char* lpLastPtr;
		/** 当前可分配的空闲节点头指针 */
		SInnerListNode* lpFreeHead;
	};

public:
	/** 初始化fixedlist分配器
	 @remark
	 在新版本中增加了iNodeSize和bConstruct的目的是为了分配一块指定大小的内存，
	 而不是为固定大小的结构使用，例如一般是这样使用：
	 FixAlloc<char> objAlloc;
	 objAlloc.Init(1024, 32, false, false);
	 对于是一个结构的使用：
	 FixAlloc<MyStruct> objAlloc;
	 objAlloc.Init(1024, 0, false, true);
	 @param iCount
	 将要分配的节点个数
	 @param iNodeSize
	 单个节点的大小，如果为0，则会取sizeof(T)作为节点的大小
	 @param bFixed
	 是否为固定大小的内存，即队列空后并不重新分配，如果为false，在队列为空时
	 将继续分配iCount个节点个数的内存使用
	 @param bConstruct
	 是否为分配的对象进行构造和析构
	 @return
	 返回true表示初始化成功
	 */
	bool Init(int iCount, int iNodeSize, bool bFixed, bool bConstruct);

	/** 分配一个可用的节点
	 @param lpulPos [O] 获得将被分配的节点在数组中的位置
	 如果返回为NULL，有两层含义，一是可分配队列为空(bFixed为true)，
	 一是内存用光(bFixed为false)
	 在该成员函数中会自动调用T的构造函数
	 */
	T* Alloc(uint32* lpulPos = NULL);

	/** 释放一个节点
	 @param lpObject
	 将被释放的对象指针
	 在该成员函数中会自动调用T的析构函数
	 */
	void Free(T* lpObject);

	/** 返回所有的节点个数 */
	int GetAllCount();

	/** 返回当前可用的节点个数 */
	int GetFreeCount();

	/** 返回当前已经被使用的节点个数 */
	int GetUsedCount();

	/** 通过数组下标获得节点对象
	 @param iIdx 数组下标
	 @return 返回对应的节点对象
	 */
	T* GetNodeByIdx(int iIdx);

public:
	/** 构造函数 */
	FixAlloc();
	/** 析构函数 */
	~FixAlloc();

private:
	/** 将一快连续的内存初始化成一条相接的单向链表
	 @param lpBuffer
	 连续的内存
	 @param iCount
	 链表的节点个数
	 @return
	 返回true或false
	 */
	bool InitBufferToList(char* lpBuffer, int iCount);

	/** 创建一块新的内存块 */
	bool AllocOneBlock();

private:
	typedef typename std::vector<SBufferHead*> StdVctNodeBuffer;
	typedef typename StdVctNodeBuffer::iterator StdVctNodeBufferIter;
	int m_iNodeCount;					/// 每个内存分配块可容纳的节点个数
	StdVctNodeBuffer m_vctNodeBuffer;	/// 是用来保存为FreeNode分配的内存块，以便释放。
	bool m_bFixed;						/// 是否为固定大小的内存，即队列空后并不重新分配
	bool m_bConstruct;					/// 是否为分配的对象进行构造和析构
	int m_iAllNodeCount;				/// 所有节点个数
	int m_iUsedNodeCount;				/// 已经被使用的节点个数
	int m_iNodeSize;					/// 节点大小
};


template<typename T> inline FixAlloc<T>::FixAlloc() :
		m_iNodeCount(0), m_bFixed(false), m_iAllNodeCount(0), m_iUsedNodeCount(
				0), m_iNodeSize(0) {
}


template<typename T> inline FixAlloc<T>::~FixAlloc() {
	for (uint i = 0; i < m_vctNodeBuffer.size(); ++i) {
		SBufferHead* lpBufHead = m_vctNodeBuffer[i];
		SafeDeleteArray(lpBufHead);
	}
	m_vctNodeBuffer.clear();
	m_iNodeCount = 0;
	m_iAllNodeCount = 0;
	m_iUsedNodeCount = 0;
}


template<typename T> inline
bool FixAlloc<T>::Init(int iCount, int iNodeSize, bool bFixed,
		bool bConstruct) {
	m_bFixed = bFixed;
	m_bConstruct = bConstruct;
	m_iNodeSize = iNodeSize;
	if (m_iNodeSize <= 0) {
		m_iNodeSize = sizeof(T);
	}

	if (iCount > 0) {
		m_iNodeCount = iCount;
		return AllocOneBlock();
	}

	return false;
}


template<typename T> inline
bool FixAlloc<T>::InitBufferToList(char* lpBuffer, int iCount) {
	int iNodeSize = sizeof(SInnerListNode) + m_iNodeSize;
	SBufferHead* lpBufHead = reinterpret_cast<SBufferHead*>(lpBuffer);
	lpBufHead->iRefCount = 0;
	lpBufHead->lpFirstPtr = lpBuffer;
	lpBufHead->lpLastPtr =
			(lpBuffer + iCount * iNodeSize + sizeof(SBufferHead));
	lpBufHead->lpFreeHead = NULL;

	char* lpNodeBuf = lpBuffer + sizeof(SBufferHead);
	SInnerListNode* lpNode = reinterpret_cast<SInnerListNode*>(lpNodeBuf);
	lpNode->lpNext = NULL;
	for (int i = 0; i < iCount - 1; ++i) {
		SInnerListNode* lpNode1 = reinterpret_cast<SInnerListNode*>(lpNodeBuf
				+ i * iNodeSize);
		SInnerListNode* lpNode2 = reinterpret_cast<SInnerListNode*>(lpNodeBuf
				+ (i + 1) * iNodeSize);
		lpNode1->lpNext = lpNode2;
		lpNode2->lpNext = NULL;
	}

	lpBufHead->lpFreeHead = lpNode;
	m_vctNodeBuffer.push_back(lpBufHead);
	return true;
}


template<typename T> inline
bool FixAlloc<T>::AllocOneBlock() {
	int iNodeSize = sizeof(SInnerListNode) + m_iNodeSize;
	char* lpBuffer = new char[sizeof(SBufferHead) + m_iNodeCount * iNodeSize];
	if (lpBuffer != NULL) {
		m_iAllNodeCount += m_iNodeCount;
		if (!InitBufferToList(lpBuffer, m_iNodeCount)) {
			SafeDeleteArray(lpBuffer);
			return false;
		}
		return true;
	}
	return false;
}


template<typename T> inline T* FixAlloc<T>::GetNodeByIdx(int iIdx) {
	if (iIdx >= 0 && iIdx < m_iAllNodeCount) {
		int iBlockIdx = iIdx / m_iNodeCount;
		int iInnerIdx = iIdx % m_iNodeCount;
		SBufferHead* lpBufferHead = m_vctNodeBuffer[iBlockIdx];
		char* lpNodeBuf = lpBufferHead->lpFirstPtr + sizeof(SBufferHead);
		int iNodeSize = sizeof(SInnerListNode) + m_iNodeSize;
		T* lpObject = reinterpret_cast<T*>(lpNodeBuf + iInnerIdx * iNodeSize
				+ sizeof(SInnerListNode));
		return lpObject;
	}
	return NULL;
}


template<typename T> inline T* FixAlloc<T>::Alloc(uint32* lpulPos) {
	SBufferHead* lpBufHead = NULL;
	StdVctNodeBufferIter iter = m_vctNodeBuffer.begin();
	for (int i = 0; iter != m_vctNodeBuffer.end(); ++iter, ++i) {
		lpBufHead = (*iter);
		if (lpBufHead->lpFreeHead != NULL) {
			if (lpulPos != NULL) {
				int iNodeSize = sizeof(SInnerListNode) + m_iNodeSize;
				int iOffsetSize = int32(
						reinterpret_cast<char*>(lpBufHead->lpFreeHead)
								- lpBufHead->lpFirstPtr) - sizeof(SBufferHead);
				int32 lOffsetPos = iOffsetSize / iNodeSize;
				assert((iOffsetSize%iNodeSize) == 0);
				*lpulPos = m_iNodeCount * i + lOffsetPos;
			}
			break;
		}
	}

	if (NULL == lpBufHead || NULL == lpBufHead->lpFreeHead) {
		if (!m_bFixed) {
			// alloc new block
			if (!AllocOneBlock()) {
				return NULL;
			}
			lpBufHead = m_vctNodeBuffer[m_vctNodeBuffer.size() - 1];

			if (lpulPos != NULL) {
				*lpulPos = m_iAllNodeCount - m_iNodeCount;
			}
		} else {
			return NULL;
		}
	}

	assert(lpBufHead->lpFreeHead != NULL);
	SInnerListNode* lpNode = lpBufHead->lpFreeHead;
	++lpBufHead->iRefCount;
	lpBufHead->lpFreeHead = lpBufHead->lpFreeHead->lpNext;
	lpNode->lpNext = NULL;

	T* lpObject = reinterpret_cast<T*>(reinterpret_cast<char*>(lpNode)
			+ sizeof(SInnerListNode));
	++m_iUsedNodeCount;

	if (m_bConstruct) {
		new (reinterpret_cast<void*>(lpObject)) T();
	}

	return lpObject;
}


template<typename T> inline
void FixAlloc<T>::Free(T* lpObject) {
	if (lpObject != NULL) {
		if (m_bConstruct) {
			(lpObject)->~T();
		}

		SInnerListNode* lpNode =
				reinterpret_cast<SInnerListNode*>(reinterpret_cast<char*>(lpObject)
						- sizeof(SInnerListNode));
		char* lpNodePtr = reinterpret_cast<char*>(lpNode);

		SBufferHead* lpBufHead = NULL;
		StdVctNodeBufferIter iter = m_vctNodeBuffer.begin();
		for (; iter != m_vctNodeBuffer.end(); ++iter) {
			lpBufHead = (*iter);
			/// 需要被回收内存合法性的检查
			if (lpNodePtr >= lpBufHead->lpFirstPtr
					&& lpNodePtr < lpBufHead->lpLastPtr) {
				lpNode->lpNext = lpBufHead->lpFreeHead;
				lpBufHead->lpFreeHead = lpNode;
				--lpBufHead->iRefCount;
				assert(lpBufHead->iRefCount >= 0);
				/// 确保至少还剩一块内存可供使用
				if (lpBufHead->iRefCount == 0 && m_vctNodeBuffer.size() > 1) {
					char* lpFirstPtr = lpBufHead->lpFirstPtr;
					SafeDeleteArray(lpFirstPtr);
					m_vctNodeBuffer.erase(iter);
				}
				--m_iUsedNodeCount;
				break;
			}
		}
	}
}


template<typename T> inline
int FixAlloc<T>::GetAllCount() {
	return m_iAllNodeCount;
}


template<typename T> inline
int FixAlloc<T>::GetFreeCount() {
	return m_iAllNodeCount - m_iUsedNodeCount;
}


template<typename T> inline
int FixAlloc<T>::GetUsedCount() {
	return m_iUsedNodeCount;
}

#endif // _FIXALLOC_H_
