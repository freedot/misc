/*
 * Socket.cpp
 *
 *  Created on: 2013-2-21
 *      Author: Administrator
 */
#include "Socket.h"
#include <iostream>

namespace Net {

Socket::Socket() {
	m_socket = -1;
}

Socket::Socket(int socket) {
	m_socket = socket;
}

Socket::~Socket() {
}

void Socket::Attach(int socket) {
	m_socket = socket;
}

int Socket::GetHandle() {
	return m_socket;
}

bool Socket::CreateSocket(int af, int type, int protocol, uint32 flags) {
	m_socket = (int) tq_socket(af, type, protocol, flags);
	return (m_socket >= 0);
}

int Socket::Accept(sockaddr* addr, int* addLen, uint32 timeOut) {
	if (INFINITE == timeOut || 0 == timeOut) {
		return accept(m_socket, addr, (socklen_t*) addLen);
	}

	int ret;
	timeval tv;
	timeval* pstTV;

	fd_set fds;
	FD_ZERO(&fds);
	FD_SET((uint) m_socket, &fds);
	pstTV = &tv;
	tv.tv_sec = timeOut / 1000;
	tv.tv_usec = (timeOut % 1000) * 1000;

	ret = select(m_socket + 1, &fds, NULL, NULL, pstTV);
	if (ret < 0) {
		return -1;
	}

	if (0 == ret) {
		return 0;
	}

	if (FD_ISSET(m_socket, &fds)) {
		return accept(m_socket, addr, (socklen_t*) addLen);
	} else {
		return 0;
	}
}

bool Socket::Bind(ushort port) {
	struct sockaddr_in addr;
	memset((char*) &addr, 0, sizeof(addr));
	addr.sin_family = AF_INET;
	addr.sin_port = htons(port);
	addr.sin_addr.s_addr = htonl(INADDR_ANY);

	return (bind(m_socket, (const sockaddr*) &addr, sizeof(addr)) == 0);
}

bool Socket::Connect(const char* ipOrUrl, ushort port) {
	sockaddr_in svrAddr;
	svrAddr.sin_family = AF_INET;
	svrAddr.sin_port = htons(port);
	svrAddr.sin_addr.s_addr = ConvertUrlOrIpToLong(ipOrUrl);
	return (connect(m_socket, (struct sockaddr*) &svrAddr, sizeof(svrAddr)) == 0);
}

bool Socket::SetNonBlocking() {
	return tq_socket_nonblock(m_socket);
}

bool Socket::SetSendBufferMaxSize(int bufferSize) {
	return (setsockopt(m_socket, SOL_SOCKET, SO_SNDBUF,
			(const char *) &bufferSize, sizeof(bufferSize)) == 0);
}

bool Socket::SetRecvBufferMaxSize(int bufferSize) {
	return (setsockopt(m_socket, SOL_SOCKET, SO_RCVBUF,
			(const char *) &bufferSize, sizeof(bufferSize)) == 0);
}

bool Socket::SetCloseDelay(int delayS) {
	linger _linger;
	_linger.l_onoff = 1;
	_linger.l_linger = delayS;
	return (setsockopt(m_socket, SOL_SOCKET, SO_LINGER, (const char*) &_linger,
			sizeof(_linger)) == 0);
}

bool Socket::SetListenNumber(int listenNumber) {
	return (listen(m_socket, listenNumber) == 0);
}

int Socket::Recv(char* buf, int len, uint32 timeOut) {
	int ret;
	timeval tv;
	timeval* pstTV;

	fd_set fds;
	FD_ZERO(&fds);
	FD_SET((uint) m_socket, &fds);
	if (INFINITE == timeOut) {
		pstTV = NULL;
	} else {
		pstTV = &tv;
		tv.tv_sec = timeOut / 1000;
		tv.tv_usec = (timeOut % 1000) * 1000;
	}

	ret = select(m_socket + 1, &fds, NULL, NULL, pstTV);
	if (ret < 0) {
		return -1;
	}

	if (0 == ret) {
		return 0;
	}

	ret = recv(m_socket, buf, len, 0);
	if (ret == 0)
		return -1;

	if (ret < 0) {
		std::cerr << "socket errno:" << socketerrno << std::endl;

		if (SOCKETEWOULDBLOCK == socketerrno || SOCKETEAGAIN == socketerrno) {
			tq_sleep(100);
			return 0;
		}

		return -1;
	}

	return ret;
}

int Socket::Send(char* buf, int len, uint32 timeOut) {
	int ret;

	if (timeOut > 0) {
		timeval tv;
		timeval* pstTV;

		fd_set fds;
		FD_ZERO(&fds);
		FD_SET((uint) m_socket, &fds);
		pstTV = &tv;
		if (INFINITE == timeOut) {
			pstTV = NULL;
		} else {
			pstTV = &tv;
			tv.tv_sec = timeOut / 1000;
			tv.tv_usec = (timeOut % 1000) * 1000;
		}

		ret = select(m_socket + 1, NULL, &fds, NULL, pstTV);
		if (ret < 0) {
			return -1;
		}

		if (0 == ret) {
			return 0;
		}
	}

	ret = send(m_socket, buf, len, 0);
	if (ret < 0) {
		if (SOCKETEWOULDBLOCK == socketerrno || SOCKETEAGAIN == socketerrno) {
			tq_sleep(200);
			return 0;
		}

		return -1;
	} else if (0 == ret) {
		return -1;
	}

	return ret;
}

int Socket::Read(char* buf, int len) {
	return read(m_socket, buf, (size_t) len);
}

int Socket::Write(const char* buf, int len) {
	return write(m_socket, buf, (size_t) len);
}

int Socket::RecvFrom(char* buf, int bufLen, int flags, sockaddr* fromAddr,
		int* fromLen) {
	return recvfrom(m_socket, buf, bufLen, flags, fromAddr,
			(socklen_t*) fromLen);
}

int Socket::SendTo(const char* buf, uint bufLen, int flags,
		const sockaddr* toAddr, int toLen) {
	return sendto(m_socket, buf, bufLen, flags, toAddr, toLen);
}

void Socket::Close() {
	if (m_socket >= 0) {
		closesocket(m_socket);
		m_socket = -1;
	}
}

uint32 Socket::ConvertUrlOrIpToLong(const char* urlOrIp) {
	if (!urlOrIp)
		return 0;

	uint32 ip = inet_addr(urlOrIp);
	if (ip != INADDR_NONE)
		return ip;

	hostent* hp = gethostbyname(urlOrIp);
	if (!hp)
		return 0;

	memcpy(&ip, hp->h_addr, hp->h_length);
	return ip;
}

} /* namespace Net */
