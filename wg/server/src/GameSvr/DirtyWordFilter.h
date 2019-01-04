/*
 * DirtyWordFilter.h
 *
 *  Created on: 2014-2-10
 *      Author: qujianbiao
 */

#ifndef DIRTYWORDFILTER_H_
#define DIRTYWORDFILTER_H_
#include <commhead.h>
//#include <ext/hash_map>
using namespace std;
//using namespace __gnu_cxx;

class DirtyWordFilter {
public:
	bool HasDirtyWord(const char* msg, int32 levelMask);
	const char* ReplaceDirtyWord(const char* msg, int32 levelMask);

public:
	DirtyWordFilter();
	virtual ~DirtyWordFilter();

private:
	bool LoadWords(const char* dirtyFile);

private:
	//hash_map<string, uint32> m_dirtyWords;
	vector<int> m_wordsBytes;
};

#endif /* DIRTYWORDFILTER_H_ */
