#ifndef _PLATFORM_H
#define _PLATFORM_H
#include <platdefine.h>

#if defined(WIN32)
inline bool IsWin32() {
	return true;
}
inline bool IsLinux() {
	return false;
}
#elif defined(LINUX)
inline bool IsWin32() {return false;}
inline bool IsLinux() {return true;}
#endif

// comm define
#if defined(WIN32)
#elif defined(LINUX)
#define MAX_PATH  1024
#endif

#if defined(WIN32)
#include <tchar.h>
#include <winsock2.h>
#include <mswsock.h>
#include <WinError.h>
#include <windows.h>
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/timeb.h>
#include <fcntl.h>
#include <io.h>
#include <signal.h>
#include <process.h>
#elif defined(LINUX)
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/un.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/mman.h>
#include <sys/sem.h>
#include <sys/epoll.h>
#include <netdb.h>
#include <netinet/in.h>
#include <pthread.h>
#include <signal.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <dlfcn.h>

#if defined(__GNU_LIBRARY__) && !defined(_SEM_SEMUN_UNDEFINED)
/* union semun is defined by including <sys/sem.h> */
#else
/* according to X/OPEN we have to define it ourselves */
union semun {
	int val; /* value for SETVAL */
	struct semid_ds *buf; /* buffer for IPC_STAT, IPC_SET */
	unsigned short *array; /* array for GETALL, SETALL */
	struct seminfo *__buf; /* buffer for IPC_INFO */
};
#endif
#endif

// load dll
#if defined(WIN32)
#define F_OK 0
#define DYNLIB_LOAD( a ) LoadLibraryA( a )
#define DYNLIB_GETSYM( a, b ) GetProcAddress( a, b )
#define DYNLIB_UNLOAD( a ) FreeLibrary( a )
struct HINSTANCE__;
typedef struct HINSTANCE__* hInstance;
#ifdef DEBUG
#define DYNLIB_EXT "_d.so"
#else
#define DYNLIB_EXT ".so"
#endif // DEBUG
#define DYNLIB_HANDLE hInstance
#define DYNLIB_ERROR GetLastError
#elif defined(LINUX)
#define DYNLIB_HANDLE void*
#define DYNLIB_LOAD( a ) dlopen( a, RTLD_LAZY )
#define DYNLIB_GETSYM( a, b ) dlsym( a, b )
#define DYNLIB_UNLOAD( a ) dlclose( a )
#define DYNLIB_ERROR dlerror
#ifdef DEBUG
#define DYNLIB_EXT "_d.so"
#else
#define DYNLIB_EXT ".so"
#endif // DEBUG
#endif

// create thread
#if defined(WIN32)
#define TQCREATETHREAD(a, b, c) CreateThread(NULL, a, b, c , 0, NULL)
#define THREADRET long unsigned int
#define THREADAPI WINAPI
#define THREADRET_ERR -1
#define THREADRET_OK 0
#define EWOULDBLOCK EAGAIN
#elif defined(LINUX)
#define TQCREATETHREAD(a, b, c) \
		pthread_t __tid__;\
		pthread_create(&__tid__, a, b, c)

#define THREADRET void*
#define THREADAPI
#define THREADRET_ERR NULL
#define THREADRET_OK NULL
#endif

// share memory handle
#if defined(WIN32)
typedef HANDLE SHAREMEM_HANDLE;
const SHAREMEM_HANDLE INVAILED_SHAREMEM_HANDLE = NULL;
#elif defined(LINUX)
typedef int SHAREMEM_HANDLE;
const int INVAILED_SHAREMEM_HANDLE = -1;
#endif

// Compiler specific settings.
#if defined(WIN32)
#define _TQ_CDECL _cdecl
#define _TQ_STDCALL _stdcall
#define _TQ_DECLSPEC __declspec
#define _TQ_EXPORT __declspec( dllexport )
#elif defined(LINUX)
#define _TQ_STDCALL
#define _TQ_CDECL
#define _TQ_DECLSPEC
#define _TQ_EXPORT
#define __forceinline
#endif

// Dll export
#if defined(DLL_EXPORTS)
#define _TQ_API extern "C" _TQ_EXPORT
#else
#define _TQ_API extern "C" _TQ_STDCALL
#endif

// dll main
#if defined(WIN32)
#define DECLARE_DLLMAIN() \
		BOOL APIENTRY DllMain( HANDLE hModule, \
		DWORD  ul_reason_for_call, \
			LPVOID lpReserved\
			)\
		{\
			return TRUE;\
		}
#elif defined(LINUX)
#define DECLARE_DLLMAIN()
#endif

// type define
#if defined(WIN32)
#define	_int64_ 				__int64
#define	_uint64_ 				unsigned __int64
#define	_object_id_ 			__int64
#elif defined(LINUX)
#define	_int64_ 				long long
#define	_uint64_ 				unsigned long long
#define	_object_id_ 			long long
#endif 

// socket
#if defined(WIN32)
inline int tq_socket(int af, int type, int protocol, unsigned int flags) {
	return WSASocket(af, type, protocol, NULL, 0, flags);
}
inline bool tq_socket_nonblock(int socket) {
	unsigned long flag = 1;
	return (ioctlsocket(socket, FIONBIO, &flag) == 0);
}
#define socketerrno				WSAGetLastError()
#define SOCKETEWOULDBLOCK		WSAEWOULDBLOCK
#define SOCKETEAGAIN			WSAEWOULDBLOCK
#define socklen_t 				int
#define signal(a,b)
#elif defined(LINUX)
inline int tq_socket(int af, int type, int protocol, unsigned int flags) {
	return socket(af, type, protocol);
}
inline bool tq_socket_nonblock(int socket) {
	int flag = fcntl(socket, F_GETFL, 0);
	flag |= O_NONBLOCK;
	flag |= O_NDELAY;
	return ( fcntl(socket, F_SETFL, flag) == 0 );
}
#define closesocket close
#define socketerrno				errno
#define SOCKETEWOULDBLOCK		EWOULDBLOCK
#define SOCKETEAGAIN			EAGAIN
const unsigned int INFINITE = 0xFFFFFFFF;
#endif

// timer
#if defined(WIN32)
#define tq_sleep(s) Sleep(s)
inline _uint64_ GetTickCountEx() {
	static _uint64_ lastTick = (_uint64_) GetTickCount();
	static _uint64_ cycleTimes = 0;

	_uint64_ curTick = (_uint64_) GetTickCount();
	if (curTick < lastTick) {
		cycleTimes++;
	}
	lastTick = curTick;

	return cycleTimes * 0xFFFFFFFFll + curTick;
}
#elif defined(LINUX)
#define tq_sleep(s) usleep(s*1000)
inline unsigned int GetTickCount() {
	struct timespec ts;
	clock_gettime(CLOCK_MONOTONIC, &ts);
	return (ts.tv_sec*1000 + ts.tv_nsec/(1000*1000));
}
inline _uint64_ GetTickCountEx() {
	struct timespec ts;
	clock_gettime(CLOCK_MONOTONIC, &ts);
	return ((_uint64_)(ts.tv_sec)*1000 + (_uint64_)(ts.tv_nsec)/(1000*1000));
}
#endif

// string
#if defined(WIN32)
#define tq_strchr strchr
#elif defined(LINUX)
#define strnicmp 	strncasecmp
inline char* strlwr( char* str ) {
	char* orig = str;
	// process the string
	for (; *str != '\0'; str++ )
	*str = tolower(*str);
	return orig;
}
inline char* itoa(int val, char* buf, int radix) {
	if ( radix == 8) {
		sprintf(buf, "%o", val);
	}
	else if ( radix == 16 ) {
		sprintf(buf, "%x", val);
	}
	else {
		sprintf(buf, "%d", val);
	}

	return buf;
}
inline char* tq_strchr(const char* str, char c) {
	return strchr((char*) str, c);
}
#endif

#define tq_swap64(x) \
((((x) & 0xff00000000000000ull) >> 56)                                  \
| (((x) & 0x00ff000000000000ull) >> 40)                                 \
| (((x) & 0x0000ff0000000000ull) >> 24)                                 \
| (((x) & 0x000000ff00000000ull) >> 8)                                  \
| (((x) & 0x00000000ff000000ull) << 8)                                  \
| (((x) & 0x0000000000ff0000ull) << 24)                                 \
| (((x) & 0x000000000000ff00ull) << 40)                                 \
| (((x) & 0x00000000000000ffull) << 56))

inline bool IsLittleEndian() {
	union {
		unsigned int a;
		unsigned char b;
	} c;
	c.a = 1;
	return (c.b == 1);
}

inline _uint64_ ntohqex(_uint64_ x) {
	if (IsLittleEndian())
		return tq_swap64(x);
	else
		return x;
}

inline _uint64_ htonqex(_uint64_ x) {
	if (IsLittleEndian())
		return tq_swap64(x);
	else
		return x;
}

#ifdef OV_LITTLEENDIAN
 #define ntohq(x)                                ov_swap64(x)
 #define htonq(x)                                ov_swap64(x)
#else
 #define ntohq(x)                                (x)
 #define htonq(x)                                (x)
#endif

#endif //_PLATFORM_H
