/*
 * FileManager.cpp
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#include "FileSys.h"
#include <filePkg.h>
#include <DataProcessor.h>
#include "File.h"
#include "PkgFile.h"

DECLARE_DLLMAIN()

IInterface* CreateInterface(const TQGUID& guid) {
	if (guid != IUID_IFILEMANAGER)
		return NULL;

	IInterface* interFace = new IO::FileManager;
	interFace->SetIUID(guid);
	return interFace;
}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;

	if ((*interFace)->GetIUID() != IUID_IFILEMANAGER)
		return;

	IO::FileManager* fileMgr = (IO::FileManager*) (*interFace);
	delete fileMgr;
	(*interFace) = NULL;
}

//////////////////////////////////////////////////////////
namespace IO {

inline char hextochar(uchar a) {
	if (a >= 0 && a <= 9) {
		return '0' + a;
	} else if (a >= 10 && a <= 15) {
		return 'A' + (a - 10);
	}
	return '0';
}

FileManager::FileManager() :m_natureFileImportant(false) {
	INIT_TQINTERFACE()
	if (getcwd(m_workpath, sizeof(m_workpath)) == NULL)
		assert(false);
	FormatWorkPath();
}

FileManager::~FileManager() {
}

void FileManager::SetNatureFileImportant(){
	m_natureFileImportant = true;
}

bool FileManager::AddPackage(const char* pkgfile) {
	FILE* fp = fopen(pkgfile, "rb");
	if (fp == NULL)
		return AddPackageErrorHdr(fp);

	m_files.push_back(fp);

	PkgFileHead head;
	if (fread(&head, sizeof(PkgFileHead), 1, fp) != 1)
		return AddPackageErrorHdr(fp);

	PkgFileInfo* fileinfos = new PkgFileInfo[head.filecount];
	if (fread(fileinfos, sizeof(PkgFileInfo), head.filecount, fp)
			!= head.filecount)
		return AddPackageErrorHdr(fp);

	int infobytes = sizeof(PkgFileInfo) * head.filecount;
	DecryptBuf((uchar*) fileinfos, (uchar*) fileinfos, infobytes);
	for (uint i = 0; i < head.filecount; ++i) {
		PkgFileInfo& pkgfileinfo = fileinfos[i];
		FileInfo& fileinfo = m_fileInfos[pkgfileinfo.filename];
		fileinfo.fp = fp;
		fileinfo.offset = pkgfileinfo.offset;
		fileinfo.len = pkgfileinfo.len;
		fileinfo.factlen = pkgfileinfo.factlen;
	}
	SafeDeleteArray(fileinfos);
	return true;
}

bool FileManager::AddPackageErrorHdr(FILE* fp) {
	if (fp == NULL)
		return false;

	m_files.pop_back();
	fclose(fp);
	fp = NULL;
	return false;
}

IFile* FileManager::OpenFile(const char* filename, const char* mod) {
	if (filename == NULL || mod == NULL) {
		return NULL;
	}

	IFile* file = CreateFile(filename, mod);
	file->SetGameSys(m_lpGameSys);
	if (!file->OnOneTimeInit()) {
		DestroyFile(&file);
	}

	if (!file->Open()) {
		DestroyFile(&file);
	}
	return file;
}

IFile* FileManager::CreateFile(const char* filename, const char* mod) {
	IFile* file = NULL;
	if ( m_natureFileImportant && IsNatureFileExist(filename) ) {
		file = new File(filename, mod);
	} else {
		file = DefaultCreateFile(filename, mod);
	}
	return file;
}

IFile* FileManager::DefaultCreateFile(const char* filename, const char* mod) {
	IFile* file = NULL;
	FileInfo* info = GetFileInfo(filename);
	if (info != NULL) {
		file = new PkgFile(info);
	} else {
		file = new File(filename, mod);
	}
	return file;
}

FileInfo* FileManager::GetFileInfo(const char* filename) {
	char cfilename[MAX_PATH + 1];
	SafeStrCpy(cfilename, filename, sizeof(cfilename));
	strlwr(cfilename);
	ChangeBackslashs(cfilename);
	CutFileName(cfilename);
	char shash[33];
	Md5HashBufferStr(shash, (uchar*) cfilename, strlen(cfilename));
	MapFileInfoIter iter = m_fileInfos.find(shash);
	if (iter != m_fileInfos.end()) {
		return &((*iter).second);
	}
	return NULL;
}

void FileManager::DestroyFile(IFile** ppfile) {
	IFile* file = *ppfile;
	if (file->GetType() == FILE_TYPE_PKGFILE) {
		PkgFile* f = (PkgFile*) file;
		SafeDelete(f);
	} else {
		File* f = (File*) file;
		SafeDelete(f);
	}
	*ppfile = NULL;
}

void FileManager::Close(IFile** ppfile) {
	if (ppfile != NULL && (*ppfile) != NULL) {
		IFile* file = *ppfile;
		file->OnOneTimeRelease();
		DestroyFile(ppfile);
	}
}

bool FileManager::IsFileExist(const char *filename, unsigned int iFlags) {
	if (GetFileInfo(filename) != NULL) {
		return true;
	} else {
		return IsNatureFileExist(filename);
	}
}

bool FileManager::IsNatureFileExist(const char *filename){
	FILE* fp = fopen(filename, "rb");
	if (fp != NULL) {
		fclose(fp);
		return true;
	}
	return false;
}

uint32 FileManager::GetFileModifyTime(const char* filename) {
	if (filename == NULL)
		return 0;

	FileInfo* info = GetFileInfo(filename);
	if (info != NULL)
		return 0;

	struct stat resStat;
	int ret = stat(filename, &resStat);
	if (ret == -1)
		return 0;

	return resStat.st_mtime;
}

void FileManager::SetWorkPath(const char* workpath) {
	if (workpath != NULL) {
		SafeStrCpy(m_workpath, workpath, sizeof(m_workpath));
		FormatWorkPath();
	}
}

bool FileManager::OnOneTimeInit() {
	assert(m_lpGameSys!=NULL);
	if (m_lpGameSys == NULL) {
		return false;
	}
	return true;
}

void FileManager::OnOneTimeRelease() {
	for (uint i = 0; i < m_files.size(); ++i) {
		FILE* fp = m_files[i];
		fclose(fp);
	}
	m_files.clear();
}

void FileManager::FormatWorkPath() {
	strlwr(m_workpath);
	ChangeBackslashs(m_workpath);
	CompleteDir(m_workpath, sizeof(m_workpath));
}

char* FileManager::ChangeBackslashs(char* filename) {
	char* c = NULL;
	while (*(c = filename++) != '\0') {
		if (*c == '\\')
			*c = '/';
	}
	return filename;
}

char* FileManager::CompleteDir(char* path, int buflen) {
	int len = strlen(path);
	if (path[len - 1] != '/' && len < (buflen - 1)) {
		path[len] = '/';
		path[len + 1] = '\0';
	}
	return path;
}

char* FileManager::CutFileName(char* filename) {
	if (strstr(filename, m_workpath) == filename) {
		memmove(filename, filename + strlen(m_workpath),
				strlen(filename) - strlen(m_workpath) + 1);
	}
	return filename;
}

char* FileManager::Md5HashBufferStr(char* outbuf, uchar* srcbuf, int len) {
	uchar obuf[16];
	Net::DataProcessor::Md5HashBuf(obuf, srcbuf, len);
	for (int i = 0; i < 16; ++i) {
		uchar a = (obuf[i] >> 4) & 0xf;
		uchar b = obuf[i] & 0xf;
		outbuf[2 * i + 0] = hextochar(a);
		outbuf[2 * i + 1] = hextochar(b);
	}
	outbuf[32] = 0;
	return outbuf;
}

void FileManager::DecryptBuf(uchar* outbuf, uchar* inbuf, int len) {
	for (int i = 0; i < len; ++i) {
		outbuf[i] = inbuf[i] ^ c_xors[(i + len) % 16];
	}
}

} /* namespace IO */
