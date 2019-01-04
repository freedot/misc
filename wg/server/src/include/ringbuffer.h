#ifndef _RINGBUFFER_H
#define _RINGBUFFER_H
#include "typedef.h"
#include <string.h>

class RingBuffer {
public:
	/** 返回当前队列是否为空 */
	bool IsEmpty();

	/** 返回当前是否有足够的空间容纳指定长度的pkgBuf */
	bool HasEnoughPkgSize(int pkgLen);

	/** 返回队列顶部包的大小 */
	int32 GetTopPkgSize();

	/** 向队列尾部压入指定长度的pkgBuf
	 @return
	 ret == RET_ISFULL 表示队列空间不足
	 ret == RET_NULLBUF/RET_ERRORLEN 表示参数非法
	 ret >0 表示压入队列中的长度*/
	int32 Push(byte* pkgBuf, int32 pkgLen);

	/** 从队列顶部弹出完整的包
	 @param outBuf 接收包的buf
	 @param bufLen outBuf的大小
	 @return
	 ret == RET_ISEMPTY 表示队列为空
	 ret == RET_NULLBUF 表示参数非法
	 ret == RET_LESSBUFLEN 表示buf的长度不足
	 ret >0 表示弹出的包大小*/
	int32 Pop(byte*outBuf, int32 bufLen);

public:
	RingBuffer(int32 maxBufSize);
	virtual ~RingBuffer();

public:
	enum {
		HEADLEN = 4,
		RET_NULLBUF = -1,
		RET_ERRORLEN = -2,
		RET_ISFULL = -3,
		RET_LESSBUFLEN = -4,
		RET_ISEMPTY = -5,
	};

private:
	enum {
		SPLITBYTE = 1, // 当队列满时,需在写指针和读指针间插入一个分割字节
	};

private:
	int32 GetLeftSize();
	int32 AddBuf(byte* buf, int32 len);
	void WriteBuf(byte* buf, int32 len);
	void Commit();
	void ReadTopBuf(byte* outBuf, int32 readLen);
	void MoveReadPos(int32 len);
	void MoveWrittingPos(int32 len);
	int32 GetNextPos(int32 pos, int32 len);
	bool IsWriteWrap(int32 writeLen);
	bool IsReadWrap(int32 readLen);

private:
	struct HeadInfo {
		int32 bufSize;
		int32 readPos;
		int32 writePos;
		int32 writtingPos; //为保证原子写入, 在整个包都写入后, 一次将该值提交到writePos
	};
	byte* m_buf;
	HeadInfo* m_headInfo;
	byte* m_headBuf;
};

RingBuffer::RingBuffer(int32 maxBufSize) {
	int32 size = sizeof(HeadInfo) + maxBufSize + SPLITBYTE;
	m_buf = new byte[size];
	m_headBuf = m_buf + sizeof(HeadInfo);

	m_headInfo = (HeadInfo*) m_buf;
	m_headInfo->bufSize = maxBufSize + SPLITBYTE;
	m_headInfo->readPos = 0;
	m_headInfo->writePos = 0;
	m_headInfo->writtingPos = 0;
}

RingBuffer::~RingBuffer() {
	delete[] m_buf;
	m_buf = NULL;
}

inline
bool RingBuffer::IsEmpty() {
	return m_headInfo->readPos == m_headInfo->writePos;
}

inline
bool RingBuffer::HasEnoughPkgSize(int pkgLen) {
	return (HEADLEN + pkgLen) <= GetLeftSize();
}

inline
int32 RingBuffer::Push(byte* pkgBuf, int32 pkgLen) {
	if (pkgBuf == NULL)
		return RET_NULLBUF;
	if (pkgLen <= 0)
		return RET_ERRORLEN;
	if (!HasEnoughPkgSize(pkgLen))
		return RET_ISFULL;

	AddBuf((byte*) (&pkgLen), HEADLEN);
	AddBuf(pkgBuf, pkgLen);
	Commit();

	return pkgLen;
}

inline
int32 RingBuffer::Pop(byte*outBuf, int32 bufLen) {
	if (IsEmpty())
		return RET_ISEMPTY;
	if (outBuf == NULL)
		return RET_NULLBUF;

	int32 pkgLen = 0;
	ReadTopBuf((byte*) (&pkgLen), HEADLEN);
	if (pkgLen > bufLen)
		return RET_LESSBUFLEN;
	MoveReadPos(HEADLEN);

	ReadTopBuf(outBuf, pkgLen);
	MoveReadPos(pkgLen);

	return pkgLen;
}

inline
int32 RingBuffer::GetLeftSize() {
	int32 usedSize = (m_headInfo->writtingPos - m_headInfo->readPos
			+ m_headInfo->bufSize) % m_headInfo->bufSize;
	return m_headInfo->bufSize - usedSize - SPLITBYTE;
}

inline
int32 RingBuffer::GetTopPkgSize() {
	if (IsEmpty())
		return 0;

	int32 pkgLen = 0;
	ReadTopBuf((byte*) (&pkgLen), HEADLEN);
	return pkgLen;
}

inline
int32 RingBuffer::AddBuf(byte* buf, int32 len) {
	if (buf == NULL)
		return RET_NULLBUF;
	if (len <= 0)
		return RET_ERRORLEN;
	if (GetLeftSize() < len)
		return RET_ISFULL;

	WriteBuf(buf, len);
	MoveWrittingPos(len);
	return len;
}

inline
void RingBuffer::WriteBuf(byte* buf, int32 len) {
	if (IsWriteWrap(len)) {
		int32 firstPartLen = m_headInfo->bufSize - m_headInfo->writtingPos;
		int32 secPartLen = len - firstPartLen;
		memcpy(m_buf + m_headInfo->writtingPos, buf, firstPartLen);
		memcpy(m_buf, buf + firstPartLen, secPartLen);
	} else {
		memcpy(m_buf + m_headInfo->writtingPos, buf, len);
	}
}

inline
void RingBuffer::Commit() {
	m_headInfo->writePos = m_headInfo->writtingPos;
}

inline
void RingBuffer::ReadTopBuf(byte* outBuf, int32 readLen) {
	if (IsReadWrap(readLen)) {
		int firstPartLen = m_headInfo->bufSize - m_headInfo->readPos;
		int secPartLen = readLen - firstPartLen;
		memcpy(outBuf, m_buf + m_headInfo->readPos, firstPartLen);
		memcpy(outBuf + firstPartLen, m_buf, secPartLen);
	} else {
		memcpy(outBuf, m_buf + m_headInfo->readPos, readLen);
	}
}

inline
void RingBuffer::MoveReadPos(int32 len) {
	m_headInfo->readPos = GetNextPos(m_headInfo->readPos, len);
}

inline
void RingBuffer::MoveWrittingPos(int32 len) {
	m_headInfo->writtingPos = GetNextPos(m_headInfo->writtingPos, len);
}

inline
int32 RingBuffer::GetNextPos(int32 pos, int32 len) {
	return (pos + len) % m_headInfo->bufSize;
}

inline
bool RingBuffer::IsWriteWrap(int32 writeLen) {
	return (m_headInfo->writtingPos + writeLen) > m_headInfo->bufSize;
}

inline
bool RingBuffer::IsReadWrap(int32 readLen) {
	return (m_headInfo->readPos + readLen) > m_headInfo->bufSize;
}

#endif //_BYTERIBUFFER_H
