/*
 * PkgFile.cpp
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#include "PkgFile.h"
#include <filePkg.h>
#include <./zlib/zlib.h>

namespace IO {

PkgFile::PkgFile(FileInfo* fileInfo) :
		m_type(FILE_TYPE_PKGFILE), m_fileInfo(fileInfo), m_buff(NULL), m_pos(0) {
	INIT_TQINTERFACE()
}

PkgFile::~PkgFile() {
	Close();
}

bool PkgFile::Open() {
	m_pos = 0;
	SafeDeleteArray(m_buff);
	m_buff = new uchar[m_fileInfo->factlen];
	uchar* ebuff = new uchar[m_fileInfo->len];
	if (fseek(m_fileInfo->fp, m_fileInfo->offset, SEEK_SET) != 0)
		return OpenErrorHdr(ebuff);

	if (fread(ebuff, m_fileInfo->len, 1, m_fileInfo->fp) != 1)
		return OpenErrorHdr(ebuff);

	Decode(ebuff);
	SafeDeleteArray(ebuff);
	return true;
}

bool PkgFile::OpenErrorHdr(uchar* buff) {
	SafeDeleteArray(m_buff);
	SafeDeleteArray(buff);
	return false;
}

bool PkgFile::Decode(uchar* encodebuf) {
	DecryptBuf(encodebuf, encodebuf, m_fileInfo->len);
	uLong len = (uLong)(m_fileInfo->factlen);
	uLong curLen = (uLong)(m_fileInfo->len);
	uncompress(m_buff, &len, encodebuf, curLen);
	return true;
}

int PkgFile::GetLength() {
	return m_fileInfo->factlen;
}

int PkgFile::Read(void* lpBuf, int iSize, int iCount) {
	int readbytes = iSize * iCount;
	if (readbytes <= (m_fileInfo->factlen - m_pos)) {
		memcpy(lpBuf, m_buff + m_pos, readbytes);
		m_pos += readbytes;
		return iCount;
	} else {
		return -1;
	}
}

int PkgFile::Write(void* lpBuf, int iSize, int iCount) {
	return 0;
}

int PkgFile::Print(const char* lpszFormatUtf8, ...) {
	return 0;
}

int PkgFile::Seek(long lOffset, int iOrigin) {
	int pos = -1;
	if (iOrigin == SEEK_SET) {
		pos = lOffset;
	} else if (iOrigin == SEEK_CUR) {
		pos += lOffset;
	} else if (iOrigin == SEEK_END) {
		pos = m_fileInfo->factlen - lOffset;
	}

	if (pos < 0 || pos >= m_fileInfo->factlen) {
		return -1;
	} else {
		m_pos = pos;
		return 0;
	}
}

int PkgFile::Tell(void) {
	return m_pos;
}

int PkgFile::Eof(void) {
	return (m_pos >= m_fileInfo->factlen);
}

void PkgFile::Close(void) {
	SafeDeleteArray(m_buff);
}

bool PkgFile::OnOneTimeInit() {
	assert(m_lpGameSys!=NULL);
	if (m_lpGameSys == NULL) {
		return false;
	}
	return true;
}

void PkgFile::OnOneTimeRelease() {
}

int PkgFile::GetType() {
	return m_type;
}

inline void PkgFile::DecryptBuf(uchar* outbuf, uchar* inbuf, int len) {
	for (int i = 0; i < len; ++i) {
		outbuf[i] = inbuf[i] ^ c_xors[(i + len) % 16];
	}
}

}
