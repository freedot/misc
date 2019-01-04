/*
 * WinNetIO.h
 *
 *  Created on: 2013-2-25
 *      Author: Administrator
 */

#ifndef WINNETIO_H_
#define WINNETIO_H_
#include <commhead.h>

#if defined(WIN32)

#include "NetIO.h"
#include <vector>
#include <map>

namespace Net {

class WinNetIO: public Net::NetIO {
public:
	WinNetIO();
	virtual ~WinNetIO();

	bool Create(int maxEventCnt);
	int WaitEvent(int timeOut);
	SEvent* GetEvent(int eventIndex);
	bool AddRecvEvent(int socket, void* ptr);
	bool ModifyEvent(int socket, uint32 eventFlags, void* ptr);
	bool DelEvent(int socket);

private:
	void ClearFD(fd_set *fd);
	bool SetFD(fd_set *fd, int socket);
	void DeleteFD(fd_set *fd, int socket);

private:
	int m_listenSocket;
	int m_maxfd;
	int m_maxEventCnt;
	int m_rdfs_size;
	fd_set *m_rdfs;
	fd_set *m_global_rdfs;
	std::vector<int> m_eventSockets;
	std::map<int, SEvent> m_events;
};

} /* namespace Net */

#endif /* WIN32 */
#endif /* WINNETIO_H_ */
