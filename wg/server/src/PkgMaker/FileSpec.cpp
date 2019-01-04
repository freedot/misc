/*
 * FileSpec.cpp
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#include "FileSpec.h"
#include <commhead.h>
#include <fstream>
#include "Regex.h"

FileSpec::FileSpec(const char* excludeCfgFile) {
	std::fstream infile(excludeCfgFile);
	if (!infile)
		return;
	std::string line;
	while (std::getline(infile, line)) {
		char* sline = (char*) line.c_str();
		strlwr(sline);
		ChangeBackslashs(sline);
		TrimReturnCharacter(sline);
		if (line == "") {
			continue;
		}
		
		m_excludes.push_back(line);
	}
	infile.close();
}

FileSpec::~FileSpec() {
	// TODO Auto-generated destructor stub
}

bool FileSpec::IsSatisfiedBy(const std::string& filepath) {
	for (int i = 0; i < (int) m_excludes.size(); ++i) {
		std::string& exc = m_excludes[i];
		char* sfilepath = (char*) filepath.c_str();
		ChangeBackslashs(sfilepath);
		char lwrFile[1024];
		SafeStrCpy(lwrFile, filepath.c_str(), sizeof(lwrFile));
		strlwr(lwrFile);
		if (Regex::match((char*) exc.c_str(), lwrFile) == 1) {
			return false;
		}
	}
	return true;
}

char* FileSpec::ChangeBackslashs(char* filename) {
	char* c = NULL;
	while (*(c = filename++) != '\0') {
		if (*c == '\\')
			*c = '/';
	}
	return filename;
}

char* FileSpec::TrimReturnCharacter(char* filename) {
	char* c = NULL;
	while (*(c = filename++) != '\0') {
		if (*c == '\n' || *c == '\r')
			*c = '\0';
	}
	return filename;
}

