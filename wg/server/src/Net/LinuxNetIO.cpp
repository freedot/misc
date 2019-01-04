/*
 * LinuxNetIO.cpp
 *
 *  Created on: 2013-2-25
 *      Author: Administrator
 */

#include "LinuxNetIO.h"
#if defined(LINUX)

namespace Net {

LinuxNetIO::LinuxNetIO() {
	// TODO Auto-generated constructor stub
	m_maxEventCnt = 0;
	m_epollFd = 0;
	m_events = NULL;
}

LinuxNetIO::~LinuxNetIO() {
	// TODO Auto-generated destructor stub
}

bool LinuxNetIO::Create(int maxEventCnt) {
	if (maxEventCnt <= 0 || maxEventCnt > 0x7fffffff) {
		std::cerr << "*The event max count failed: " << maxEventCnt
				<< std::endl;
		return false;
	}

	m_maxEventCnt = maxEventCnt;
	m_epollFd = epoll_create(m_maxEventCnt);
	if (m_epollFd < 0) {
		std::cerr << "*epoll create failed! error code: " << m_epollFd
				<< std::endl;
		std::cerr << "*errno: " << strerror(errno) << std::endl;
		return false;
	}

	m_events = new epoll_event[m_maxEventCnt];
	memset(m_events, 0, sizeof(epoll_event) * m_maxEventCnt);

	return true;
}

int LinuxNetIO::WaitEvent(int timeOut) {
	return epoll_wait(m_epollFd, m_events, m_maxEventCnt, timeOut);
}

SEvent* LinuxNetIO::GetEvent(int eventIndex) {
	if (eventIndex < 0 || eventIndex >= m_maxEventCnt)
		return NULL;
	epoll_event& rawEvent = m_events[eventIndex];
	m_event.userPtr = rawEvent.data.ptr;
	if (rawEvent.events == EPOLLIN) m_event.eventFlags = NETIO_EVENT_RECV_FLAG;
	else if (rawEvent.events == EPOLLOUT) m_event.eventFlags = NETIO_EVENT_WRITE_FLAG;
	else m_event.eventFlags = -1;
	return &m_event;
}

bool LinuxNetIO::AddRecvEvent(int socket, void* ptr) {
	epoll_event event;
	memset(&event, 0, sizeof(event));
	event.events = EPOLLIN;
	event.data.ptr = ptr;
	if (epoll_ctl(m_epollFd, EPOLL_CTL_ADD, socket, &event) < 0) {
		std::cerr << "*epoll_ctl EPOLL_CTL_ADD failed !" << std::endl;
		std::cerr << "*errno: " << strerror(errno) << std::endl;
		return false;
	}
	return true;
}

bool LinuxNetIO::ModifyEvent(int socket, uint32 eventFlags, void* ptr) {
	epoll_event event;
	memset(&event, 0, sizeof(event));
	if ( eventFlags == NETIO_EVENT_RECV_FLAG ) event.events = EPOLLIN;
	else if ( eventFlags == NETIO_EVENT_WRITE_FLAG ) event.events = EPOLLOUT;
	event.data.ptr = ptr;
	if (epoll_ctl(m_epollFd, EPOLL_CTL_MOD, socket, &event) < 0) {
		std::cerr << "*epoll_ctl EPOLL_CTL_MOD failed !" << std::endl;
		std::cerr << "*errno: " << strerror(errno) << std::endl;
		return false;
	}
	return true;
}

bool LinuxNetIO::DelEvent(int socket) {
	epoll_event event;
	memset(&event, 0, sizeof(event));
	if (epoll_ctl(m_epollFd, EPOLL_CTL_DEL, socket, &event) < 0) {
		std::cerr << "*epoll_ctl EPOLL_CTL_DEL failed !" << std::endl;
		std::cerr << "*errno: " << strerror(errno) << std::endl;
		return false;
	}
	return true;
}

} /* namespace Net */
#endif /* LINUX */
