/*
 * SearchFiles.cpp
 *
 *  Created on: 2013-3-21
 *      Author: qujianbiao
 */

#include "SearchFiles.h"
#include <commhead.h>

SearchFiles::SearchFiles() {
	// TODO Auto-generated constructor stub

}

SearchFiles::~SearchFiles() {
	// TODO Auto-generated destructor stub
}

std::vector<std::string>& SearchFiles::searchBy(const char* spath,
		IFileSpec* spec) {
	m_files.clear();
	std::string path = spath;
	innerSearchBy(path, spec);
	return m_files;
}

#if defined(WIN32)
void SearchFiles::innerSearchBy(std::string path, IFileSpec* spec) {
	struct _finddata_t filefind;
	std::string curr = path + "/*.*";
	int done = 0, handle;
	if ((handle = _findfirst(curr.c_str(), &filefind)) == -1)
		return;
	while (!(done = _findnext(handle, &filefind))) {
		if (!strcmp(filefind.name, "."))
			continue;
		if (!strcmp(filefind.name, ".."))
			continue;

		curr = path + "/" + filefind.name;
		if ((_A_SUBDIR & filefind.attrib) == _A_SUBDIR) {
			if (spec->IsSatisfiedBy(curr)) {
				innerSearchBy(curr, spec);
			}
		} else {
			if (spec->IsSatisfiedBy(curr)) {
				m_files.push_back(curr);
			}
		}
	}
	_findclose(handle);
}

#elif defined(LINUX)
#include <sys/dir.h>
#include <sys/stat.h>

int IsDir(const char* path) {
	struct stat st;
	lstat(path, &st);
	return S_ISDIR(st.st_mode);
}

void SearchFiles::innerSearchBy(std::string path, IFileSpec* spec) {
	DIR *pdir;
	struct dirent *pdirent;
	std::string curr = path;
	pdir = opendir(curr.c_str());
	if (pdir == NULL) return;

	while ((pdirent = readdir(pdir)) != NULL) {
		if (strcmp(pdirent->d_name, ".") == 0)
			continue;
		if (strcmp(pdirent->d_name, "..") == 0)
			continue;

		curr = path + "/" + pdirent->d_name;
		if (IsDir(curr.c_str())) {
			if (spec->IsSatisfiedBy(curr)) {
				innerSearchBy(curr, spec);
			}
		}
		else {
			if (spec->IsSatisfiedBy(curr)) {
				m_files.push_back(curr);
			}
		}
	}

	closedir(pdir);
}
#endif//WIN32
