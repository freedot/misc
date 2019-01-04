/*
 * FileWrap.h
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#ifndef FILEWRAP_H_
#define FILEWRAP_H_
#include <commhead.h>

class FileWrap {
public:
	FILE* Open(const char* fname, const char* mod);

public:
	FileWrap();
	virtual ~FileWrap();

private:
	FILE* m_fp;
};

#endif /* FILEWRAP_H_ */
