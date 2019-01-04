/*
 * FileWrap.cpp
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#include "FileWrap.h"

FileWrap::FileWrap() :
		m_fp(NULL) {
	// TODO Auto-generated constructor stub

}

FileWrap::~FileWrap() {
	if (m_fp != NULL) {
		fclose(m_fp);
		m_fp = NULL;
	}
}

FILE* FileWrap::Open(const char* filename, const char* mod) {
	return fopen(filename, mod);
}

