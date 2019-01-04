/*
 * FileSpec.h
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#ifndef FILESPEC_H_
#define FILESPEC_H_
#include <string>
#include <vector>

class IFileSpec {
public:
	virtual bool IsSatisfiedBy(const std::string& path) = 0;
	virtual ~IFileSpec(){};
};

class FileSpec : public IFileSpec {
public:
	bool IsSatisfiedBy(const std::string& filepath);

public:
	FileSpec(const char* excludeCfgFile);
	virtual ~FileSpec();

private:
	char* ChangeBackslashs(char* filename);
	char* TrimReturnCharacter(char* filename);

private:
	std::vector<std::string> m_excludes;
};

#endif /* FILESPEC_H_ */
