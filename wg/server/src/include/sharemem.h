#ifndef _SHAREMEN_H_
#define _SHAREMEN_H_
#include "commhead.h"
#include "safefun.h"

using namespace std;

#if defined(WIN32)

static SHAREMEM_HANDLE CreateShareMem(const char* szName, uint32 uSize,
		bool& bExist) {
	bExist = false;
	SHAREMEM_HANDLE hMem;
	hMem = CreateFileMappingA(INVALID_HANDLE_VALUE, 0, PAGE_READWRITE, 0, uSize,
			szName);
	uint32 uErrCode = GetLastError();
	if (uErrCode == ERROR_ALREADY_EXISTS) {
		bExist = true;
		clog << "create the " << szName << " share mem already exist." << endl;
	}

	if (hMem == NULL) {
		cerr << "create the " << szName << " share mem failed." << endl;
	}

	return hMem;
}

static void* MapShareMem(SHAREMEM_HANDLE hMem) {
	void* lpBuf = 0;
	lpBuf = MapViewOfFile(hMem, FILE_MAP_ALL_ACCESS, 0, 0, 0);
	assert(0 != lpBuf);
	if (0 == lpBuf) {
		cerr << "map share mem failed!" << endl;
	}
	return lpBuf;
}

static void UnMapShareMem(void* lpBuf) {
	UnmapViewOfFile(lpBuf);
}

static void ReleaseShareMem(SHAREMEM_HANDLE hMem) {
	CloseHandle(hMem);
}

#elif defined(LINUX)
static SHAREMEM_HANDLE CreateShareMem(const char* keyName, uint32 uSize,
		bool& bExist) {
	bExist = false;
	if (keyName == NULL || uSize == 0) {
		return INVAILED_SHAREMEM_HANDLE;
	}

	key_t key = SafeAsciToInt(keyName);
	if (key == 0) {
		return INVAILED_SHAREMEM_HANDLE;
	}
	
	uSize += sizeof(int32); // add ref count size
	SHAREMEM_HANDLE shmid = shmget(key, uSize, 0664 | IPC_CREAT | IPC_EXCL);
	if (shmid == INVAILED_SHAREMEM_HANDLE && errno != EEXIST) {
		return INVAILED_SHAREMEM_HANDLE;
	}

	if (shmid == INVAILED_SHAREMEM_HANDLE && errno == EEXIST) {
		bExist = true;
		shmid = shmget(key, uSize, 0664 | IPC_CREAT);
	} else {
		void* buf = shmat(shmid, NULL, 0);
		if ((prt_int) buf == -1) {
			return INVAILED_SHAREMEM_HANDLE;
		}
		
		*((int32*) buf) = 0; // clear ref count
		shmdt(buf);
	}
	
	return shmid;
}

static void* MapShareMem(SHAREMEM_HANDLE memHandle) {
	char* buf = (char*) shmat(memHandle, NULL, 0);
	if ((prt_int) buf == -1) {
		std::cerr << "attach shared memory failed! the handle is " << memHandle << std::endl;
		buf = NULL;
	}

	// the first int32 size, is ref count
	int32 refCount = *((int32*) buf);
	*((int32*) buf) = refCount + 1;
	return (void*) (buf + sizeof(int32));
}

static void UnMapShareMem(void* buf) {
	char* headBuf = (char*) buf - sizeof(int32);
	int32 refCount = *((int32*) headBuf);
	*((int32*) headBuf) = refCount - 1;

	shmdt((void*) headBuf);
}

static void ReleaseShareMem(SHAREMEM_HANDLE memHandle) {
	void * buf = shmat(memHandle, NULL, 0);
	if ((prt_int) buf == -1) {
		std::cout << "ReleaseShareMem attach share mem failed " << std::endl;
		return;
	}
	
	int32 refCount = *((int32*) buf);
	shmdt(buf);
	if (refCount <= 0) {
		shmid_ds ds;
		shmctl(memHandle, IPC_RMID, &ds);
	}
}

#endif // LINUX
#endif // _SHAREMEN_H_
