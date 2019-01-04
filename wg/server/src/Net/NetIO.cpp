#include "NetIO.h"
#include "WinNetIO.h"
#include "LinuxNetIO.h"

namespace Net {
#if defined(WIN32)
void Startup() {
	WSADATA wsd;
	int ret = WSAStartup(MAKEWORD(2,2), &wsd);
	if (0 != ret) {
		std::cerr << "WSAStartup() failed" << std::endl;
	}
}
void Cleanup() {
	WSACleanup();
}
#elif defined(LINUX)
void Startup() {};
void Cleanup() {};
#endif

NetIO* CreateNetIO() {
#if defined(WIN32)
	return new WinNetIO;
#elif defined(LINUX)
	return new LinuxNetIO;
#endif
}

void DestoryNetIO(NetIO** netIO) {
#if defined(WIN32)
	delete (WinNetIO*) (*netIO);
#elif defined(LINUX)
	delete (LinuxNetIO*)(*netIO);
#endif
	(*netIO) = NULL;
}

}

