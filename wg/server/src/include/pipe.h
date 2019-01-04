#ifndef _PIPE_H_
#define _PIPE_H_
#include "commhead.h"
#include "semaphore.h"
#include "sharemem.h"
#include "ioresult.h"
#include "ringutil.h"


namespace IO {

/** 管道初始化标志 */
enum EPipeLockFlag {
	/// 无锁同步标志
	PIPE_NOT_LOCK = 0,

	/// 有锁同步标志
	PIPE_MUTEX_LOCK = 1,
};

/// 管道头用户自定义数据长度
#define PIPE_HEAD_USERDATA_LEN 256
#define PIPE_REAR_SPACE_BYTE 1

/// 序列号数据类型
typedef uint32 seq_type;

/** 获得下一个序列号
 @param ulSeq
 当前序列号
 @return
 返回下个序列好
 */
inline seq_type TQGETNEXTSEQ(seq_type ulSeq) {
	++ulSeq;
	if (ulSeq == 0) {
		ulSeq = 1;
	}
	return ulSeq;
}

/** 共享内存传输管道
 */
class Pipe {
public:
	/** 构造函数
	 @param strNameKey
	 共享内存key
	 @param iSize
	 共享内存的大小
	 @param uiType
	 该管道的一些标记，默认值是无锁同步机制
	 */
	Pipe();
	Pipe(const char* strNameKey, int iSize, uint uiType = PIPE_MUTEX_LOCK);

	/** 析构函数
	 */
	virtual ~Pipe();

	/** Init the pipe by share mem key, iSize, uiType
	 @param strNameKey
	 共享内存key
	 @param iSize
	 共享内存的大小
	 @param uiType
	 该管道的一些标记，默认值是无锁同步机制
	 @return
	 返回值为true表示成功
	 */
	bool Init(const char* strNameKey, int iSize, uint uiType = PIPE_MUTEX_LOCK);

public:
	/** 向管道中压入一数据段，是PushHead和PushData的组合
	 @param iLen
	 数据段的长度
	 @param lpBuf
	 数据段的数据指针
	 @return
	 返回成功或管道满标志
	 */
	int Push(int iLen, const void* lpBuf);

	int PushHead(int iLen);

	void PushData(int iLen, const void* lpBuf);

	/** 从管道的Top端获得头数据，只是获得数据，并不将数据从管道中pop出
	 @param iLen [in/out]
	 输入的是lpBuf的最大长度, 输出的是实际获得长度
	 @param lpBuf
	 将要获得数据段的数据指针
	 @return
	 返回成功或管道空或其他错误标志
	 */
	int Top(int &iLen, void* lpBuf);

	/** 获得管道头包的序列号
	 */
	uint32 GetTopSeq();

	/** 获得管道正在读取包的序列号
	 */
	uint32 GetGetSeq();

	/** 通过序列号弹出包体
	 @param uiSeq
	 将要被弹出到的包序号
	 */
	void PopBySeq(uint32 ulSeq);

	/** 从管道的输出端获得头数据，同时将数据从管道中pop出
	 @param iLen [in/out]
	 输入的是lpBuf的最大长度, 输出的是实际获得长度
	 @param lpBuf
	 将要获得数据段的数据指针
	 @return
	 返回成功或管道空或其他错误标志
	 */
	int Pop(int &iLen, void* lpBuf);

	/** 从管道的输出端将数据从管道中pop出
	 */
	int Pop();

	/** 从管道中指定的位置取数据
	 @param iLen [in/out]
	 输入的是lpBuf的最大长度, 输出的是实际获得长度
	 @param lpBuf
	 将要获得数据段的数据指针
	 @return
	 返回成功或管道空或其他错误标志
	 */
	int Get(int &iLen, void* lpBuf);

	/** 将Get的读指针下移一个包位置
	 */
	int NextGetPos();

	/** 将Get的读指针重新设置
	 */
	void ResetGetPos();

	/** 当有数据压入管道中, 发送此信号, 和@see Pipe::WaitForPushSignal 配套使用
	 */
	void SendPushSignal();

	/** 当有数据从管道中pop出, 发送此信号, 和@see Pipe::WaitForPopSignal 配套使用
	 */
	void SendPopSignal();

	/** 当有数据压入管道中, 激活此等待 @see Pipe::SendPopSignal
	 */
	void WaitForPopSignal();

	/** 当有数据压入管道中, 激活此等待 @see Pipe::SendPushSignal
	 */
	void WaitForPushSignal();

	/** 获得当前管道名称
	 */
	const char* GetName();

	/** 获得用户数据长度
	 */
	int GetUserDataLen() const;

	/** 获得用户数据缓冲指针
	 */
	char* GetUserData() const;

private:
	/** 获得整个管道的数据长度 */
	int GetLeftLen();

	/** 获得当前ptr端数据的长度
	 @param iGetPos
	 该参数可以是m_lpHead->iGet或m_lpHead->iFront
	 @return
	 返回_ptr所指向的pipe中数据包的长度 */
	int GetDataLen(int iGetPos);

	/** 获得当前ptr端数据的长度
	 @param iGetPos
	 该参数可以是m_lpHead->iGet或m_lpHead->iFront
	 @param iLen [in/out]
	 输入的是lpBuf的最大长度, 输出的是实际获得长度
	 @param lpBuf
	 将要获得数据段的数据指针
	 @return
	 返回成功或管道空或其他错误标志
	 */
	int InnerGet(int iGetPos, int &iLen, void* lpBuf);

	/** 将指定位置移到下一个包的起始位置位置
	 @param iPos
	 当前包的指定位置
	 @return
	 返回 TQ_IO_OK 或其它错误返回值
	 */
	int NextPos(int& iPos);

	/** 向管道的末尾写入指定长度的数据 
	 @param lpBuf
	 要写入的数据缓冲
	 @param iLen
	 数据缓冲的长度
	 @remarks
	 该函数会移动rear指针的值
	 */
	void WriteDataToPipeRear(const void* lpBuf, int iLen);

	/** 从指定的位置读取数据
	 @param iGetPos
	 该参数可以是m_lpHead->iGet或m_lpHead->iFront
	 @param lpBuf
	 将要获得数据段的数据指针
	 @param iLen
	 输入的是lpBuf将要读取数据长度
	 */
	void ReadDataFromPipeGetPos(int iGetPos, void* lpBuf, int iLen);

	/** 获得管道指定位置包的序列号
	 @param iGetPos
	 该参数可以是m_lpHead->iGet或m_lpHead->iFront
	 @return
	 返回指定包的序号
	 */
	uint32 GetSeq(int iGetPos);

	/** 获得展开的rear位置
	 */
	int GetExpandRear();

private:
	typedef int len_type;
	#define SEQ_TYPE_SIZE sizeof(seq_type)
	#define LEN_TYPE_SIZE sizeof(len_type)
	#define PIPE_PKG_HEAD_SIZE (SEQ_TYPE_SIZE+LEN_TYPE_SIZE)

	/** 管道的头结构 */
#pragma pack(push, 1)
	struct SPipeHead {
		/// 管道尾指针
		int iRear;
		/// 管道头指针
		int iFront;
		/// 管道当前读取数据的指针
		int iGet;
		/// 整个内存的大小
		int iSize;
		/// 引用计数
		int iRefCount;
		/// 当前已经使用的序列号
		seq_type ulSeq;
		/// 用户自定义数据
		char acUserData[PIPE_HEAD_USERDATA_LEN];
	};
#pragma pack(pop)

private:
	/// 类型标志
	uint m_uiType;
	/// 管道头指针
	SPipeHead* m_lpHead;
	/// 共享内存句柄
	SHAREMEM_HANDLE m_hShareMem;
	/// 存放可使用的Buf长度
	int m_iBufSize;
	/// 共享内存映射到进程中的内存指针,实际存放内容的指针
	uchar* m_lpBuffer;

	/// 数据存取的互斥量
	Semaphore* m_lpCsBuffer;
	/// pop时的信号量, 初始状态时lock
	Semaphore* m_lpPopSignal;
	/// push时的信号量, 初始状态时lock
	Semaphore* m_lpPushSignal;
	/// 管道名称
	std::string m_strName;
};

//------------------------------------------------------------------------------------------
inline Pipe::Pipe() :
		m_uiType(0), m_lpHead(NULL), m_hShareMem(INVAILED_SHAREMEM_HANDLE), m_iBufSize(
				0), m_lpBuffer(NULL), m_lpCsBuffer(0), m_lpPopSignal(0), m_lpPushSignal(
				0) {
}

//------------------------------------------------------------------------------------------
inline Pipe::Pipe(const char* strNameKey, int iSize, uint uiType) :
		m_lpHead(NULL), m_hShareMem(INVAILED_SHAREMEM_HANDLE), m_iBufSize(0), m_lpBuffer(
				NULL), m_lpCsBuffer(0), m_lpPopSignal(0), m_lpPushSignal(0) {
	bool bt = Init(strNameKey, iSize, uiType);
	assert(bt);
}

//------------------------------------------------------------------------------------------
inline Pipe::~Pipe() {
	if (m_lpHead != NULL) {
		SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
		int refCount = --m_lpHead->iRefCount;
		
		SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
		UnMapShareMem((void*) m_lpHead);
		m_lpHead = NULL;

		if (refCount <= 0) {
			ReleaseShareMem(m_hShareMem);
		}
	}

	SafeDelete(m_lpCsBuffer);
	SafeDelete(m_lpPopSignal);
	SafeDelete(m_lpPushSignal);
	m_lpBuffer = NULL;
}

//------------------------------------------------------------------------------------------
inline
bool Pipe::Init(const char* strNameKey, int iSize, uint uiType) {
	m_uiType = uiType;
	assert( strNameKey != NULL);
	if (strNameKey == NULL) {
		return false;
	}

	if (iSize < 4096) {
		iSize = 4096;
	}

	m_strName = strNameKey;

	// create all semphare
	char szTName[256];
	if (m_uiType == PIPE_MUTEX_LOCK) {
		SafeSprintf(szTName, sizeof(szTName), "%s.cs", strNameKey);
		m_lpCsBuffer = new Semaphore(szTName);
		assert(0!=m_lpCsBuffer);

		SafeSprintf(szTName, sizeof(szTName), "%s.pop", strNameKey);
		m_lpPopSignal = new Semaphore(szTName);
		assert(0!=m_lpPopSignal);

		SafeSprintf(szTName, sizeof(szTName), "%s.push", strNameKey);
		m_lpPushSignal = new Semaphore(szTName);
		assert(0!=m_lpPushSignal);

		if (m_lpCsBuffer == NULL || m_lpPopSignal == NULL
				|| m_lpPushSignal == NULL) {
			return false;
		}
	}

	// alloc share memory
	bool bExist = false;
	m_hShareMem = CreateShareMem(strNameKey, iSize, bExist);
	if (INVAILED_SHAREMEM_HANDLE == m_hShareMem) {
		cerr << "create share mem failed!" << endl;
		return false;
	}

	// mapping the share mem to local proc mem
	m_lpBuffer = (uchar *) MapShareMem(m_hShareMem);
	if (0 == m_lpBuffer) {
		cerr << "map share mem handle failed!" << endl;
		return false;
	}

	// init the local var
	m_lpHead = reinterpret_cast<SPipeHead*>(m_lpBuffer);
	m_lpBuffer = m_lpBuffer + sizeof(SPipeHead);

	if (!bExist) {
		m_lpHead->iSize = iSize;
		SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
		m_lpHead->iRear = 0;
		m_lpHead->iFront = 0;
		m_lpHead->iGet = 0;
		m_lpHead->iRefCount = 0;
		m_lpHead->ulSeq = 0;
		memset(m_lpHead->acUserData, 0, sizeof(m_lpHead->acUserData));
		SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
	} else {
		// already exist, get the old mem size
		iSize = m_lpHead->iSize;
		SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
		++m_lpHead->iRefCount; // ref count add 1
		SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
	}

	m_iBufSize = iSize - sizeof(SPipeHead);
	return true;
}

//------------------------------------------------------------------------------------------
inline
void Pipe::WriteDataToPipeRear(const void* lpBuf, int iLen) {
	if (m_lpHead != NULL && iLen <= GetLeftLen()) {
		int iWritePos = m_lpHead->iRear;
		int iLeftLen = (m_iBufSize - iWritePos);
		if (iLeftLen > iLen) {
			memcpy((m_lpBuffer + iWritePos), lpBuf, iLen);
		} else {
			// split two segment data
			memcpy((m_lpBuffer + iWritePos), lpBuf, iLeftLen);
			memcpy(m_lpBuffer, (uchar*) lpBuf + iLeftLen, iLen - iLeftLen);
		}

		m_lpHead->iRear = (m_lpHead->iRear + iLen) % m_iBufSize;
	}
}

//------------------------------------------------------------------------------------------
inline
void Pipe::ReadDataFromPipeGetPos(int iGetPos, void* lpBuf, int iLen) {
	iGetPos = iGetPos % m_iBufSize;
	int iLeftLen = m_iBufSize - iGetPos;
	if (iLeftLen >= iLen) {
		memcpy(lpBuf, (m_lpBuffer + iGetPos), iLen);
	} else if (iLeftLen <= 0) {
		int iReadPos = (iGetPos) % m_iBufSize;
		memcpy(lpBuf, (m_lpBuffer + iReadPos), iLen);
	} else // iLeftLen > 0 and iLeftLen < iCurDateLen
	{
		// split two segment data
		memcpy(lpBuf, (m_lpBuffer + iGetPos), iLeftLen);
		memcpy((char*) lpBuf + iLeftLen, m_lpBuffer, iLen - iLeftLen);
	}
}

//------------------------------------------------------------------------------------------
inline
int Pipe::Push(int iLen, const void* lpBuf) {
	int iRt = PushHead(iLen);
	if (iRt != TQ_IO_OK) {
		return iRt;
	}
	PushData(iLen, lpBuf);
	return iRt;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::PushHead(int iLen) {
	int iRt = TQ_IO_OK;
	if (iLen <= 0) {
		return iRt;
	}

	if (m_lpHead == NULL) {
		return TQ_IO_ERR_PIPE_EMPTY;
	}

	SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
	m_lpHead->ulSeq = TQGETNEXTSEQ(m_lpHead->ulSeq);
	if (GetLeftLen() >= (int)(iLen + PIPE_PKG_HEAD_SIZE)) {
		len_type lLen = (len_type) (iLen);
		// first write the data len
		WriteDataToPipeRear(&lLen, sizeof(lLen));
		// write the seq
		WriteDataToPipeRear(&m_lpHead->ulSeq, sizeof(m_lpHead->ulSeq));
	} else {
		iRt = TQ_IO_ERR_PIPE_FULL;
	}
	SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);

	return iRt;
}

//------------------------------------------------------------------------------------------
inline
void Pipe::PushData(int iLen, const void* lpBuf) {
	SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
	// copy data buf to pipe
	WriteDataToPipeRear(lpBuf, iLen);
	SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
}

//------------------------------------------------------------------------------------------
inline
int Pipe::Top(int& iLen, void* lpBuf) {
	if (m_lpHead == NULL) {
		return TQ_IO_ERR_PIPE_EMPTY;
	}

	return InnerGet(m_lpHead->iFront, iLen, lpBuf);
}

//------------------------------------------------------------------------------------------
inline
int Pipe::Pop(int & iLen, void* lpBuf) {
	if (m_lpHead == NULL) {
		return TQ_IO_ERR_PIPE_EMPTY;
	}

	int iRt = InnerGet(m_lpHead->iFront, iLen, lpBuf);
	if (iRt == TQ_IO_OK) {
		iRt = Pop();
	}
	return iRt;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::Pop() {
	int iRt = TQ_IO_OK;
	if (m_lpHead == NULL) {
		return iRt;
	}

	NextPos(m_lpHead->iFront);
	SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
	m_lpHead->iGet = AdjustPosInRangeRingQueue(m_iBufSize,
			m_lpHead->iFront, m_lpHead->iRear, m_lpHead->iGet);
	SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);

	return iRt;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::Get(int &iLen, void* lpBuf) {
	if (m_lpHead == NULL) {
		return TQ_IO_ERR_PIPE_EMPTY;
	}

	return InnerGet(m_lpHead->iGet, iLen, lpBuf);
}

//------------------------------------------------------------------------------------------
inline
int Pipe::NextGetPos() {
	int iRt = TQ_IO_OK;
	if (m_lpHead == NULL) {
		return iRt;
	}
	SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
	iRt = NextPos(m_lpHead->iGet);
	SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
	return iRt;
}

//------------------------------------------------------------------------------------------
inline
void Pipe::ResetGetPos() {
	if (m_lpHead != NULL) {
		m_lpHead->iGet = m_lpHead->iFront;
	}
}

//------------------------------------------------------------------------------------------
inline
int Pipe::NextPos(int& iPos) {
	int iRt = TQ_IO_OK;
	int iCurDateLen = GetDataLen(iPos);
	if (0 != iCurDateLen) {
		iPos = (iPos + PIPE_PKG_HEAD_SIZE + iCurDateLen) % m_iBufSize;
	}
	return iRt;
}

//------------------------------------------------------------------------------------------
inline
void Pipe::SendPushSignal() {
	SEMAPHORE_PTR_UNLOCK(m_lpPushSignal);
}

//------------------------------------------------------------------------------------------
inline
void Pipe::SendPopSignal() {
	SEMAPHORE_PTR_UNLOCK(m_lpPopSignal);
}

//------------------------------------------------------------------------------------------
inline
void Pipe::WaitForPopSignal() {
	SEMAPHORE_PTR_LOCK(m_lpPopSignal);
}

//------------------------------------------------------------------------------------------
inline
void Pipe::WaitForPushSignal() {
	SEMAPHORE_PTR_LOCK(m_lpPushSignal);
}

//------------------------------------------------------------------------------------------
inline
int Pipe::GetLeftLen() {
	int iLeftLen = 0;
	if (m_lpHead != NULL) {
		iLeftLen = (m_lpHead->iFront - m_lpHead->iRear + 2 * m_iBufSize
				- PIPE_REAR_SPACE_BYTE) % m_iBufSize;
	}
	return iLeftLen;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::GetDataLen(int iGetPos) {
	int erear = GetExpandRear();
	if (m_lpHead == NULL || iGetPos + (int)sizeof(len_type) > erear) {
		return 0;
	}

	len_type lCurDataLen;
	ReadDataFromPipeGetPos(iGetPos, &lCurDataLen, sizeof(lCurDataLen));
	if ((erear - iGetPos) < (int)(lCurDataLen + PIPE_PKG_HEAD_SIZE)) {
		return 0;
	}
	return lCurDataLen;
}

//------------------------------------------------------------------------------------------
inline uint32 Pipe::GetSeq(int iGetPos) {
	int erear = GetExpandRear();
	if (m_lpHead == NULL || (int)(iGetPos + PIPE_PKG_HEAD_SIZE)< erear ) {
		return 0;
	}

	seq_type ulSeq;
	iGetPos = (iGetPos + sizeof(len_type)) % m_iBufSize;
	ReadDataFromPipeGetPos(iGetPos, &ulSeq, sizeof(ulSeq));
	return ulSeq;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::InnerGet(int iGetPos, int &iLen, void* lpBuf) {
	int iRt = TQ_IO_OK;
	assert(lpBuf != NULL);
	if (lpBuf == NULL) {
		return TQ_IO_ERR_PIPE_INVALIEDPARAM;
	}

	SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
	int iCurDateLen = GetDataLen(iGetPos);
	if (iCurDateLen > iLen) {
		// iLen is not enough
		iRt = TQ_IO_ERR_PIPE_RECVBUF_LEN_LESS;
	} else if (0 == iCurDateLen) {
		// pipe empty
		iRt = TQ_IO_ERR_PIPE_EMPTY;
	} else {
		iGetPos = (iGetPos + PIPE_PKG_HEAD_SIZE) % m_iBufSize;
		ReadDataFromPipeGetPos(iGetPos, lpBuf, iCurDateLen);
	}
	iLen = iCurDateLen;
	SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);

	return iRt;
}

//------------------------------------------------------------------------------------------
inline
const char* Pipe::GetName() {
	return m_strName.c_str();
}

//------------------------------------------------------------------------------------------
inline uint32 Pipe::GetTopSeq() {
	if (m_lpHead == NULL) {
		return 0;
	}
	return (uint32) GetSeq(m_lpHead->iFront);
}

//------------------------------------------------------------------------------------------
inline uint32 Pipe::GetGetSeq() {
	if (m_lpHead == NULL) {
		return 0;
	}
	return (uint32) GetSeq(m_lpHead->iGet);
}

//------------------------------------------------------------------------------------------
inline
void Pipe::PopBySeq(uint32 ulSeq) {
	if (m_lpHead != NULL) {
		SEMAPHORE_PTR_LOCK(m_lpCsBuffer);
		int iGetPos = m_lpHead->iFront;
		while (true) {
			uint32 ulCurSeq = GetSeq(iGetPos);
			if (ulCurSeq == 0) {
				break;
			}

			if (ulCurSeq == ulSeq) {
				int iRet = NextPos(iGetPos);
				if (iRet != IO::TQ_IO_OK) {
					break;
				}

				m_lpHead->iFront = iGetPos;
				break;
			}

			int iRet = NextPos(iGetPos);
			if (iRet != IO::TQ_IO_OK) {
				break;
			}
		}

		m_lpHead->iGet = AdjustPosInRangeRingQueue(m_iBufSize,
				m_lpHead->iFront, m_lpHead->iRear, m_lpHead->iGet);

		SEMAPHORE_PTR_UNLOCK(m_lpCsBuffer);
	}
}

//------------------------------------------------------------------------------------------
inline
int Pipe::GetUserDataLen() const {
	if (m_lpHead != NULL) {
		return sizeof(m_lpHead->acUserData);
	}
	return 0;
}

//------------------------------------------------------------------------------------------
inline
char* Pipe::GetUserData() const {
	if (m_lpHead != NULL) {
		return m_lpHead->acUserData;
	}
	return NULL;
}

//------------------------------------------------------------------------------------------
inline
int Pipe::GetExpandRear() {
	int rear = m_lpHead->iRear;
	if (m_lpHead->iFront > m_lpHead->iRear) {
		rear = m_lpHead->iRear + m_iBufSize;
	}
	return rear;
}

} // end namespace IO

#endif // _PIPE_H_
