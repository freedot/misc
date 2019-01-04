#ifndef _SEMAPHORE_H_
#define _SEMAPHORE_H_
#include "commhead.h"

#define SEMAPHORE_PTR_LOCK(L) if ( (L) != NULL) (L)->Lock();
#define SEMAPHORE_PTR_UNLOCK(L)  if ( (L) != NULL) (L)->Unlock();

#if defined(WIN32)

class Semaphore {
public:
	Semaphore(const char* szName) {
		long lInitCount = 1;
		long lMaxCount = 1;
		assert(lInitCount > 0);
		assert(lMaxCount >= lInitCount);
		m_hSemaphore = ::CreateSemaphore(0, lInitCount, lMaxCount, szName);
		assert(0 != m_hSemaphore);
	}

	~Semaphore() {
		if (NULL != m_hSemaphore) {
			::CloseHandle(m_hSemaphore);
			m_hSemaphore = NULL;
		}
	}

	bool Lock() {
		if (::WaitForSingleObject(m_hSemaphore, INFINITE) == WAIT_OBJECT_0) {
			return true;
		} else {
			return false;
		}
	}

	bool Unlock() {
		long lCount = 1;
		assert(NULL != m_hSemaphore);
		return ::ReleaseSemaphore(m_hSemaphore, lCount, 0) == TRUE;
	}

private:
	HANDLE m_hSemaphore;
};

#elif defined(LINUX)

class Semaphore
{
public:
	Semaphore(const char* szName)
	{
		//create key value
		int iId = 1;
		m_key = ftok(szName, iId);

		//create signal
		m_iSemId=semget(m_key, 1, IPC_CREAT|0666);
		assert(m_iSemId>=0);

		//init signal
		union semun eSem;
		eSem.val = 0;
		semctl(m_iSemId, 0, SETVAL, eSem);
	};

	~Semaphore()
	{
		if ( m_iSemId >= 0 )
		{
			union semun eSem;
			eSem.val = 0;
			semctl(m_iSemId, 0, IPC_RMID, eSem);
		}
	};

	bool Lock()
	{
		assert(m_iSemId >= 0);
		struct sembuf stSops= {0, -1, IPC_NOWAIT};
		return (semop(m_iSemId, &stSops, 1) == 0);
	};

	bool Unlock()
	{
		assert(m_iSemId >= 0);
		struct sembuf stSops= {0, 1, IPC_NOWAIT};
		return (semop(m_iSemId, &stSops, 1) == 0);
	};

private:
	key_t m_key;
	int m_iSemId;
};

#endif // LINUX

#endif // _SEMAPHORE_H_
