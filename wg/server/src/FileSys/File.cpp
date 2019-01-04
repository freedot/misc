/*
 * File.cpp
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#include "File.h"

namespace IO {

File::File(const char* filename, const char* mod) {
	m_fp = NULL;
	m_type = FILE_TYPE_FILE;
	m_length = 0;
	m_filename = filename;
	m_mod = mod;
	INIT_TQINTERFACE()
}

File::~File() {
	Close();
}

bool File::Open() {
	m_fp = fopen(m_filename.c_str(), m_mod.c_str());
	if (m_fp == NULL) {
		return false;
	}
	return true;
}

int File::GetLength() {
	if (m_length == 0 && m_fp != NULL) {
		int iPos = ftell(m_fp);
		fseek(m_fp, 0, SEEK_END);
		m_length = ftell(m_fp);
		fseek(m_fp, iPos, SEEK_SET);
	}

	return m_length;
}

int File::Read(void* lpBuf, int iSize, int iCount) {
	assert(m_fp);
	return fread(lpBuf, iSize, iCount, m_fp);
}

int File::Write(void* lpBuf, int iSize, int iCount) {
	assert(m_fp);
	return fwrite(lpBuf, iSize, iCount, m_fp);
}

int File::Print(const char* lpszFormatUtf8, ...) {
	return 0;
}

int File::Seek(long lOffset, int iOrigin) {
	assert(m_fp);
	return fseek(m_fp, lOffset, iOrigin);
}

int File::Tell(void) {
	assert(m_fp);
	return ftell(m_fp);
}

int File::Eof(void) {
	assert(m_fp);
	return feof(m_fp);
}

void File::Close(void) {
	if (m_fp != NULL) {
		fclose(m_fp);
		m_fp = NULL;
	}
}

bool File::OnOneTimeInit() {
	assert(m_lpGameSys!=NULL);
	if (m_lpGameSys == NULL) {
		return false;
	}
	return true;
}

void File::OnOneTimeRelease() {
}

int File::GetType() {
	return m_type;
}
} /* namespace IO */
