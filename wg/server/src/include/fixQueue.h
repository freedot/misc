#ifndef _FIX_QUEUE_H_
#define _FIX_QUEUE_H_
#include <commhead.h>

/** 固定节点个数的队列 */
template<class _Ty>
class FixQueue {
public:
	/** 初始化队列函数 
	 @param iNodeCount
	 节点个数
	 @param uiType
	 队列标志,默认是多线程保护的
	 @return
	 返回true或false */
	bool init(int iNodeCount);

	/** 向队列压入某值 
	 @param val
	 要压入的值 */
	void push(const _Ty& val);

	/** 返回队列顶部的值 */
	_Ty top();

	/** 将队列顶弹出，配合@see top使用 */
	void pop();

	/** 判断队列是否为空 */
	bool empty();

	/** 判断队列是否为满 */
	bool full();

	/** 清空队列，队列的容器大小并不改变 */
	void clear();

public:
	/** 构造函数 */
	FixQueue();
	/** 构造函数 
	 @param iNodeCount
	 节点个数
	 @param uiType
	 队列标志,默认是多线程保护的 */
	FixQueue(int iNodeCount);
	/** 析构函数 */
	~FixQueue();

private:
	int _iTop;					/// 队列头位置
	int _iTail;					/// 队列尾位置
	int _iCount;				/// 队列实际节点的个数，=iNodeCount+1
	std::vector<_Ty> _vctQueue;	/// 队列内容存放的实际容器
};

template<class _Ty> inline FixQueue<_Ty>::FixQueue() :
		_iTop(0), _iTail(0), _iCount(0) {
}

template<class _Ty> inline FixQueue<_Ty>::FixQueue(int iNodeCount) {
	bool bRt = init(iNodeCount);
	assert(bRt);
}

template<class _Ty> inline FixQueue<_Ty>::~FixQueue() {
	_vctQueue.clear();
}

template<class _Ty> inline
bool FixQueue<_Ty>::init(int iNodeCount) {
	_iCount = iNodeCount + 1;
	_vctQueue.resize(_iCount);
	_iTop = 0;
	_iTail = 0;
	return true;
}

template<class _Ty> inline
void FixQueue<_Ty>::push(const _Ty& val) {
	int iTimes = 0;
	while (true) {
		if (_iTop == _iTail
				|| ((_iTail + _iCount - _iTop) % _iCount) < (_iCount - 1)) {
			_vctQueue[_iTail++] = val;
			_iTail = _iTail % _iCount;
			break;
		}

		if ((++iTimes) > 1000) {
			iTimes = 0;
			std::cerr << "the fix queue fill, can't push val in the queue!"
					<< std::endl;
		}

		// block here
		tq_sleep(1);
	}
}

template<class _Ty> inline _Ty FixQueue<_Ty>::top() {
	_Ty val;
	val = _vctQueue[_iTop];
	return val;
}

template<class _Ty> inline
void FixQueue<_Ty>::pop() {
	if (_iTop != _iTail) {
		_iTop = (_iTop + 1) % _iCount;
	}
}

template<class _Ty> inline
bool FixQueue<_Ty>::empty() {
	return (_iTop == _iTail);
}

template<class _Ty> inline
bool FixQueue<_Ty>::full() {
	return ((_iTail + _iCount - _iTop) % _iCount) == (_iCount - 1);
}

template<class _Ty> inline
void FixQueue<_Ty>::clear() {
	_iTop = _iTail = 0;
}

#endif // _FIX_QUEUE_H_
