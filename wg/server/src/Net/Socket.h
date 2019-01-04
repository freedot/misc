/*
 * Socket.h
 *
 *  Created on: 2013-2-21
 *      Author: Administrator
 */

#ifndef SOCKET_H_
#define SOCKET_H_
#include <commhead.h>

namespace Net {

class Socket {
public:
	Socket();
	Socket(int socket);
	virtual ~Socket();

public:
	void Attach(int socket);
	int GetHandle();
	bool CreateSocket(int af, int type, int protocol, uint32 flags);
	int Accept(sockaddr* addr, int* addrLen, uint32 timeOut = INFINITE);
	bool Bind(ushort port);
	bool Connect(const char* ipOrUrl, ushort port);
	bool SetNonBlocking();
	bool SetSendBufferMaxSize(int bufferSize);
	bool SetRecvBufferMaxSize(int bufferSize);
	bool SetCloseDelay(int delayS);
	bool SetListenNumber(int listenNumber);
	int Recv(char* buf, int len, uint32 timeOut = INFINITE);
	int Send(char* buf, int len, uint32 timeOut = INFINITE);
	int Read(char* buf, int len);
	int Write(const char* buf, int len);
	int RecvFrom(char* buf, int len, int flags, sockaddr* from,
			int* fromLen);
	int SendTo(const char* buf, uint len, int flags,
			const sockaddr* toAddr, int toLen);
	void Close();

private:
	uint32 ConvertUrlOrIpToLong(const char* ipOrUrl);

private:
	int m_socket;
};

} /* namespace Net */
#endif /* SOCKET_H_ */
