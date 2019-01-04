#ifndef _ZONELINE_H_
#define _ZONELINE_H_
#include "pkgdef.h" 

struct SDir
{
	ulong id;
	char svrName[MAX_SERVER_NAME_LEN];
	char svrUrl[MAX_SERVER_URL_LEN];
	ulong maxCnt;
	ulong onlineCnt;
};


#endif // _ZONELINE_H_
