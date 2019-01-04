/*
 * FileManager.h
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#ifndef FILEMANAGER_H_
#define FILEMANAGER_H_
#include <IFile.h>
#include <IFileManager.h>
#include <map>
#include "FileInfo.h"

namespace IO {

class FileManager: public IFileManager {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()

public:
	void SetNatureFileImportant();

	bool AddPackage(const char* lpszPackageNameUtf8);

	IFile* OpenFile(const char* lpszFileNameUtf8, const char* lpszMod);

	void Close(IFile** lplpFile);

	bool IsFileExist(const char *lpszPathUtf8, unsigned int iFlags);

	uint32 GetFileModifyTime(const char* lpszPathUtf8);

	void SetWorkPath(const char* lpszPathUtf8);

	bool OnOneTimeInit();

	void OnOneTimeRelease();

public:
	FileManager();
	virtual ~FileManager();

protected:
	char* Md5HashBufferStr(char* outbuf, uchar* srcbuf, int len);
	IFile* CreateFile(const char* filename, const char* mod);
	IFile* DefaultCreateFile(const char* filename, const char* mod);
	void DestroyFile(IFile** ppfile);
	FileInfo* GetFileInfo(const char* filename);
	char* ChangeBackslashs(char* filename);
	char* CutFileName(char* filename);
	char* CompleteDir(char* path, int buflen);
	void FormatWorkPath();
	void DecryptBuf(uchar* outbuf, uchar* inbuf, int len);
	bool AddPackageErrorHdr(FILE* fp);
	bool IsNatureFileExist(const char *lpszPathUtf8);

protected:
	char m_workpath[MAX_PATH];
	typedef std::map<std::string, FileInfo> MapFileInfo;
	typedef MapFileInfo::iterator MapFileInfoIter;
	MapFileInfo m_fileInfos;
	std::vector<FILE*> m_files;
	bool m_natureFileImportant;
};

} /* namespace IO */
#endif /* FILEMANAGER_H_ */
