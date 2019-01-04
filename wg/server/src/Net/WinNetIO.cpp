/*
 * WinNetIO.cpp
 *
 *  Created on: 2013-2-25
 *      Author: Administrator
 */

#include "WinNetIO.h"
#if defined(WIN32)

namespace Net {

WinNetIO::WinNetIO() {
	m_maxfd = 0;
	m_listenSocket = 0;
	m_maxEventCnt = 1024;
	m_rdfs_size = 0;
	m_rdfs = NULL;
	m_global_rdfs = NULL;
}

WinNetIO::~WinNetIO() {
}

bool WinNetIO::Create(int maxEventCnt) {
	if (maxEventCnt <= 0 || maxEventCnt > 0x7fffffff) {
		std::cerr << "*The event max count failed: " << maxEventCnt
				<< std::endl;
		return false;
	}

	m_maxEventCnt = maxEventCnt;
	m_eventSockets.reserve(m_maxEventCnt);
	m_rdfs_size = sizeof(fd_set)
			+ sizeof(SOCKET) * (m_maxEventCnt - FD_SETSIZE);
	m_rdfs = (fd_set*) malloc(m_rdfs_size);
	m_global_rdfs = (fd_set*) malloc(m_rdfs_size);
	ClearFD(m_global_rdfs);
	return true;
}

int WinNetIO::WaitEvent(int timeOut) {
	timeval tv;
	timeval* ptv;
	if ((int)INFINITE == timeOut) {
		ptv = NULL;
	} else {
		ptv = &tv;
		tv.tv_sec = timeOut / 1000;
		tv.tv_usec = (timeOut % 1000) * 1000;
	}

	m_eventSockets.clear();

	memcpy(m_rdfs, m_global_rdfs, m_rdfs_size);
	int ret = select(m_maxfd + 1, m_rdfs, NULL, NULL, ptv);
	if (ret == 0)
		return 0;
	if (ret < 0)
		return -1;

	for (uint i = 0; i < m_global_rdfs->fd_count; ++i) {
		int s = m_global_rdfs->fd_array[i];
		if (!FD_ISSET(s, m_rdfs))
			continue;
		m_eventSockets.push_back(s);
	}
	return m_eventSockets.size();
}

SEvent* WinNetIO::GetEvent(int eventIndex) {
	int eventSocket = m_eventSockets[eventIndex];
	return &(m_events[eventSocket]);
}

bool WinNetIO::AddRecvEvent(int socket, void* ptr) {
	m_listenSocket = (m_listenSocket != 0) ? m_listenSocket : socket; // first event must be listen socket
	m_maxfd = (socket > m_maxfd) ? socket : m_maxfd;
	if (!SetFD(m_global_rdfs, socket))
		return false;

	SEvent event;
	event.socket = socket;
	event.userPtr = ptr;
	event.eventFlags = NETIO_EVENT_RECV_FLAG;
	m_events[socket] = event;
	return true;
}

bool WinNetIO::ModifyEvent(int socket, uint32 eventFlags, void* ptr) {
	SEvent event;
	event.socket = socket;
	event.userPtr = ptr;
	m_events[socket] = event;
	return true;
}

bool WinNetIO::DelEvent(int socket) {
	DeleteFD(m_global_rdfs, socket);
	std::map<int, SEvent>::iterator iter = m_events.find(socket);
	if ( iter != m_events.end()){
		m_events.erase(iter);
	}
	return true;
}

inline
void WinNetIO::ClearFD(fd_set *fd) {
	FD_ZERO(fd);
}

inline
bool WinNetIO::SetFD(fd_set *fd, int socket) {
	if (fd->fd_count == (uint) m_maxEventCnt)
		return false;

	for (uint i = 0; i < fd->fd_count; ++i) {
		if (fd->fd_array[i] == (uint) socket)
			return true;
	}

	fd->fd_array[fd->fd_count++] = socket;
	return true;
}

inline
void WinNetIO::DeleteFD(fd_set *fd, int socket) {
	uint findPos = fd->fd_count;
	for (uint i = 0; i < fd->fd_count; ++i) {
		if (fd->fd_array[i] == (uint) socket) {
			findPos = i;
			break;
		}
	}

	if (findPos == fd->fd_count) // not find
		return;

	for (uint i = findPos; i < fd->fd_count - 1; ++i) {
		fd->fd_array[i] = fd->fd_array[i + 1];
	}

	fd->fd_count--;
}

} /* namespace Net */
#endif /* WIN32 */
