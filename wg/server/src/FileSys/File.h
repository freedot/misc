/*
 * File.h
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#ifndef FILE_H_
#define FILE_H_
#include <IFile.h>
#include <string>
#include "FileInfo.h"

namespace IO {

class File: public IFile {
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
	File(const char* filename, const char* mod);
	virtual ~File();

protected:
	FILE* m_fp;
	int m_type;
	int m_length;
	std::string m_filename;
	std::string m_mod;
};

} /* namespace IO */
#endif /* FILE_H_ */
