// PkgMaker.cpp : Defines the entry point for the console application.
//

#include <commhead.h>
#include <vector>
#include <string>
#include <fstream>
#include <filePkg.h>
#include <zlib/zlib.h>
#include <DataProcessor.h>
#include "SearchFiles.h"
#include <buffer.h>
#include <iostream>
#include <buffer.h>
#include "FileWrap.h"

#include "Regex.h"

#ifndef MAX_PATH
#define MAX_PATH 260
#endif

inline char hextochar(uchar a) {
	if (a >= 0 && a <= 9) {
		return '0' + a;
	} else if (a >= 10 && a <= 15) {
		return 'A' + (a - 10);
	}
	return 0;
}

class Packer {
public:
	void setWorkPath(char* workpath) {
		SafeStrCpy(m_workpath, workpath, sizeof(m_workpath));
		FormatWorkPath();
	}

	void setSrcPath(char* srcpath) {
		SafeStrCpy(m_srcpath, srcpath, sizeof(m_srcpath));
		int len = strlen(m_srcpath);
		if (m_srcpath[len - 1] == '\\' || m_srcpath[len - 1] == '/') {
			m_srcpath[len - 1] = '\0';
		}
	}

	void setOutFile(char* outfile) {
		SafeStrCpy(m_outfile, outfile, sizeof(m_outfile));
	}

	void setExclude(char* excludeCfgFile) {
		SafeStrCpy(m_excludeCfgFile, excludeCfgFile, sizeof(m_excludeCfgFile));
	}

	void pack() {
		SearchFiles searchFile;
		FileSpec spec(m_excludeCfgFile);
		std::vector<std::string>& pkgFiles = searchFile.searchBy(
				(const char*) m_srcpath, (IFileSpec*) &spec);
		if (pkgFiles.empty()) {
			std::cerr << "search files is empty!" << std::endl;
			return;
		}

		FileWrap wfpWrap;
		FILE* wfp = wfpWrap.Open(m_outfile, "wb");
		if (wfp == NULL) {
			std::cerr << "open file :" << m_outfile << " failed!" << std::endl;
			return;
		}

		int offset = 0;
		std::cout << pkgFiles.size() << std::endl;
		WriteFileHead(wfp, pkgFiles.size(), offset);
		SkipOffsetsSegment(wfp, pkgFiles.size(), offset);
		Buffer<PkgFileInfo> fileInfos;
		WritePkgFiles(wfp, pkgFiles, fileInfos, offset);
		FillOffsetsSegment(wfp, fileInfos, offset);
	}

private:
	void WriteFileHead(FILE*wfp, int fileCount, int& offset) {
		PkgFileHead head;
		head.ver = 1;
		head.filecount = fileCount;
		fwrite(&head, 1, sizeof(head), wfp);
		offset += sizeof(head);
	}

	void SkipOffsetsSegment(FILE*wfp, int fileCount, int& offset) {
		fseek(wfp, sizeof(PkgFileInfo) * fileCount, SEEK_CUR);
		offset += sizeof(PkgFileInfo) * fileCount;
	}

	void WritePkgFiles(FILE*wfp, const std::vector<std::string>& pkgFiles,
			Buffer<PkgFileInfo>& fileInfos, int& offset) {
		fileInfos.Recount(pkgFiles.size());
		memset(fileInfos.GetBuffer(), 0, fileInfos.GetBytesSize());
		for (int i = 0; i < (int) pkgFiles.size(); ++i) {
			const char* filename = pkgFiles[i].c_str();
			PkgFileInfo* fileinfo = fileInfos.Get(i);
			SafeStrCpy(fileinfo->filename, makeHashFileName(filename),
					sizeof(fileinfo->filename));

			Buffer<uchar> fileBuf;
			fileinfo->factlen = ReadFile(filename, &fileBuf);
			if (fileinfo->factlen == 0)
				return;

			fileinfo->len = encodeBuf(fileBuf.GetBuffer(), fileinfo->factlen);
			fwrite(fileBuf.GetBuffer(), 1, fileinfo->len, wfp);

			fileinfo->offset = offset;
			offset += fileinfo->len;
		}
	}

	void FillOffsetsSegment(FILE*wfp, Buffer<PkgFileInfo>& fileInfos,
			int& offset) {
		fseek(wfp, sizeof(PkgFileHead), SEEK_SET);

		Buffer<PkgFileInfo> eFileInfos(fileInfos.GetCount());
		encryptBuf((uchar*) eFileInfos.GetBuffer(),
				(uchar*) fileInfos.GetBuffer(), fileInfos.GetBytesSize());

		fwrite(eFileInfos.GetBuffer(), 1, eFileInfos.GetBytesSize(), wfp);
	}

	void FormatWorkPath() {
		ChangeBackslashs(m_workpath);
		CompleteDir(m_workpath, sizeof(m_workpath));
	}

	char* ChangeBackslashs(char* filename) {
		char* c = NULL;
		while (*(c = filename++) != '\0') {
			if (*c == '\\')
				*c = '/';
		}
		return filename;
	}

	char* CompleteDir(char* path, int buflen) {
		int len = strlen(path);
		if (path[len - 1] != '/' && len < (buflen - 1)) {
			path[len] = '/';
			path[len + 1] = '\0';
		}
		return path;
	}
	
	char* makeHashFileName(const char* filename) {
		std::cout << filename << std::endl;
		char* refname = (char*) filename + strlen(m_workpath);
		
		char lwrFile[1024];
		SafeStrCpy(lwrFile, refname, sizeof(lwrFile));
		strlwr(lwrFile);
		return md5HashBufferStr(m_hashCodes, (uchar*) lwrFile, strlen(lwrFile));
	}

	int encodeBuf(uchar* buf, int buflen) {
		ulong ebuflen = (ulong)buflen + 4096;
		uchar* ebuf = new uchar[ebuflen];
		if (compress(ebuf, &ebuflen, (const uchar*) buf, (ulong)buflen) != Z_OK) {
			printf("compress error!\n");
			return 0;
		}
		encryptBuf(buf, ebuf, ebuflen);
		SafeDeleteArray(ebuf);
		return ebuflen;
	}

	char* md5HashBufferStr(char* outbuf, uchar* srcbuf, int len) {
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

	void encryptBuf(uchar* outbuf, uchar* inbuf, int len) {
		for (int i = 0; i < len; ++i) {
			outbuf[i] = inbuf[i] ^ c_xors[(i + len) % 16];
		}
	}

	int ReadFile(const char* filename, Buffer<uchar>* fileBuf) {
		FileWrap fpWrap;
		FILE* rfp = fpWrap.Open(filename, "rb");
		if (rfp == NULL) {
			std::cerr << "open file :" << filename << " failed!" << std::endl;
			return 0;
		}

		fseek(rfp, 0, SEEK_END);
		int fileLen = ftell(rfp);
		fseek(rfp, 0, SEEK_SET);

		fileBuf->Recount(fileLen + 4096);
		if (fread(fileBuf->GetBuffer(), 1, (size_t)fileLen, rfp) != (size_t)fileLen) {
			return 0;
		}

		return fileLen;
	}

private:
	char m_workpath[MAX_PATH];
	char m_outfile[MAX_PATH];
	char m_srcpath[MAX_PATH];
	char m_excludeCfgFile[MAX_PATH];
	char m_hashCodes[33];
};

class UnPacker {
public:
	void setSrcPath(const char* srcPath) {
		m_srcPath = srcPath;
	}

	void setOutPath(const char* outPath) {
		m_outPath = outPath;
	}

	void unPack() {
		FileWrap fpWrap;
		FILE* fp = fpWrap.Open(m_srcPath.c_str(), "rb");
		if (fp == NULL) {
			std::cerr << "open src pack " << m_srcPath << " failed!"
					<< std::endl;
			return;
		}

		PkgFileHead head;
		if (fread(&head, sizeof(head), 1, fp) != 1) {
			return;
		}

		Buffer<PkgFileInfo> rawFileInfos(head.filecount);
		if (fread(rawFileInfos.GetBuffer(), sizeof(PkgFileInfo),
				rawFileInfos.GetCount(), fp)
				!= (uint) rawFileInfos.GetCount()) {
			return;
		}

		Buffer<PkgFileInfo> fileInfos(head.filecount);
		decryptBuf((uchar*) fileInfos.GetBuffer(),
				(uchar*) rawFileInfos.GetBuffer(), rawFileInfos.GetBytesSize());

		Buffer<uchar> rawBuffer;
		Buffer<uchar> outBuffer;
		for (uint32 i = 0; i < head.filecount; ++i) {
			PkgFileInfo* fileinfo = fileInfos.Get(i);

			rawBuffer.Recount(fileinfo->len);
			if (fread(rawBuffer.GetBuffer(), 1, fileinfo->len, fp)
					!= fileinfo->len) {
				return;
			}

			outBuffer.Recount(fileinfo->factlen);
			std::string fileName = m_outPath + "/" + fileinfo->filename;

			FileWrap wfpWrap;
			FILE* wfp = wfpWrap.Open(fileName.c_str(), "wb");
			if (wfp == NULL)
				return;

			int factLen = decodeBuf(rawBuffer.GetBuffer(),
					rawBuffer.GetBytesSize(), outBuffer.GetBuffer(),
					outBuffer.GetBytesSize());
			assert( factLen == outBuffer.GetBytesSize());
			fwrite(outBuffer.GetBuffer(), 1, outBuffer.GetBytesSize(), wfp);
		}
	}

private:
	int decodeBuf(uchar* inBuf, int inBuflen, uchar* outBuf, int outBufLen) {
		Buffer<uchar> dbuf(inBuflen);
		decryptBuf(dbuf.GetBuffer(), inBuf, inBuflen);
		if (uncompress(outBuf, (ulong *) &outBufLen,
				(const uchar*) dbuf.GetBuffer(), (ulong)dbuf.GetBytesSize()) != Z_OK) {
			return 0;
		}
		return outBufLen;
	}

	void decryptBuf(uchar* outbuf, uchar* inbuf, int len) {
		for (int i = 0; i < len; ++i) {
			outbuf[i] = inbuf[i] ^ c_xors[(i + len) % 16];
		}
	}

private:
	std::string m_srcPath;
	std::string m_outPath;
};

int main(int argc, char* argv[]) {
	if (argc != 4 && argc != 6) {
		std::cout << "arg error!" << std::endl;
		std::cout << "pack: PkgMaker -p workpath srcdir outfile excludefile"
				<< std::endl;
		std::cout << "unpack: PkgMaker -u pkgfile outfold" << std::endl;
		std::cout << "remark: must full path" << std::endl;
		return 0;
	}

	if (strcmp(argv[1], "-p") == 0) {
		Packer packer;
		packer.setWorkPath(argv[2]);
		packer.setSrcPath(argv[3]);
		packer.setOutFile(argv[4]);
		packer.setExclude(argv[5]);

		packer.pack();
	} else if (strcmp(argv[1], "-u") == 0) {
		UnPacker unPacker;
		unPacker.setSrcPath(argv[2]);
		unPacker.setOutPath(argv[3]);
		unPacker.unPack();
	}

	return 0;
}

