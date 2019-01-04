//============================================================================
// Name        : rm.cpp
// Author      : 
// Version     :
// Copyright   : Your copyright notice
// Description : Hello World in C++, Ansi-style
//============================================================================

#include <iostream>
#include <windows.h>
using namespace std;

int main(int argc,char *argv[]) {
	for ( int i=2; i<argc; ++i ) { // skip -rf
		cout << argv[i] << endl;
		DeleteFile(argv[i]);
	}
	return 0;
}
