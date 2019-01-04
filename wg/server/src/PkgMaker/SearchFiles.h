/*
 * SearchFiles.h
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#ifndef SEARCHFILES_H_
#define SEARCHFILES_H_
#include "FileSpec.h"
#include <string>
#include <vector>

class SearchFiles {
public:
	std::vector<std::string>& searchBy(const char* path, IFileSpec* spec);

public:
	SearchFiles();
	virtual ~SearchFiles();

private:
	void innerSearchBy(std::string path, IFileSpec* spec);

private:
	std::vector<std::string> m_files;
};

#endif /* SEARCHFILES_H_ */
