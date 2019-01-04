/*
 * NetIO.h
 *
 *  Created on: 2013-2-25
 *      Author: Administrator
 */

#ifndef NETIO_H_
#define NETIO_H_
#include <commhead.h>

#define NETIO_EVENT_RECV_FLAG 1
#define NETIO_EVENT_WRITE_FLAG 2

namespace Net {
	
struct SEvent {
	int socket;
	int eventFlags;
	void* userPtr;
	
	bool isRecvEvent(){
		return this->eventFlags == NETIO_EVENT_RECV_FLAG;
	}
	
	bool isWriteEvent(){
		return this->eventFlags == NETIO_EVENT_WRITE_FLAG;
	}
};

class NetIO {
public:
	virtual bool Create(int maxEventCnt) = 0;
	virtual int WaitEvent(int timeOut) = 0;
	virtual SEvent* GetEvent(int eventIndex) = 0;
	virtual bool AddRecvEvent(int socket, void* ptr) = 0;
	virtual bool ModifyEvent(int socket, uint32 eventFlags, void* ptr) = 0;
	virtual bool DelEvent(int socket) = 0;
	virtual ~NetIO() {};
};

_TQ_API void Startup();
_TQ_API void Cleanup();

_TQ_API NetIO* CreateNetIO();
_TQ_API void DestoryNetIO(NetIO** netIO);

} /* namespace Net */
#endif /* NETIO_H_ */
