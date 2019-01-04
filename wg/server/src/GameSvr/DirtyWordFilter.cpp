/*
 * DirtyWordFilter.cpp
 *
 *  Created on: 2014-2-10
 *      Author: qujianbiao
 */

#include "DirtyWordFilter.h"

DirtyWordFilter::DirtyWordFilter() {
	// TODO Auto-generated constructor stub

}

DirtyWordFilter::~DirtyWordFilter() {
	// TODO Auto-generated destructor stub
}

bool DirtyWordFilter::HasDirtyWord(const char* msg, int32 levelMask) {
	/*
	int32 genWordsBytes(const char* t) { // utf8
		for ( ) {
		}
	}

	int32 wordsCount = 10;
	for ( int allPos=0; allPos<wordsCount; ++allPos ) {
		for ( int curPos=allPos; curPos<(allPos + m_maxWordCount); ++curPos ) {
			strcat(tag, src + , );
			int32 level = getDirtyLevel(tag);
			if (level == 0) continue;
			return true;
		}
	}
	*/
	return true;
}

const char* DirtyWordFilter::ReplaceDirtyWord(const char* msg,
		int32 levelMask) {
	return NULL;
}

bool DirtyWordFilter::LoadWords(const char* dirtyFile) {
	return true;
}

