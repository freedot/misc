/*
 * LinuxNetIO.h
 *
 *  Created on: 2013-2-25
 *      Author: Administrator
 */

#ifndef LINUXNETIO_H_
#define LINUXNETIO_H_
#include <commhead.h>

#if defined(LINUX)

#include "NetIO.h"

namespace Net {

class LinuxNetIO: public NetIO {
public:
	LinuxNetIO();
	virtual ~LinuxNetIO();

	bool Create(int maxEventCnt);
	int WaitEvent(int timeOut);
	SEvent* GetEvent(int eventIndex);
	bool AddRecvEvent(int socket, void* ptr);
	bool ModifyEvent(int socket, uint32 eventFlags, void* ptr);
	bool DelEvent(int socket);

private:
	int m_maxEventCnt;
	int m_epollFd;
	epoll_event* m_events;
	SEvent m_event;
};

} /* namespace Net */

#endif /* LINUX */
#endif /* LINUXNETIO_H_ */
