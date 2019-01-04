/*
 * PkgFile.h
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#ifndef PKGFILE_H_
#define PKGFILE_H_
#include <IFile.h>
#include "FileInfo.h"

namespace IO {

class PkgFile: public IFile {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()
public:
	bool Open();

	int GetLength();

	int Read(void* lpBuf, int iSize, int iCount);

	int Write(void* lpBuf, int iSize, int iCount);

	int Print(const char* lpszFormatUtf8, ...);

	int Seek(long lOffset, int iOrigin);

	int Tell(void);

	int Eof(void);

	void Close(void);

	bool OnOneTimeInit();

	void OnOneTimeRelease();

	int GetType();

public:
	PkgFile(FileInfo* fileInfo);
	virtual ~PkgFile();

private:
	bool Decode(uchar* encodebuf);
	void DecryptBuf(uchar* outbuf, uchar* inbuf, int len);
	bool OpenErrorHdr(uchar* buff);

private:
	int m_type;
	FileInfo* m_fileInfo;
	uchar* m_buff;
	int m_pos;
};

} /* namespace IO */
#endif /* PKGFILE_H_ */
