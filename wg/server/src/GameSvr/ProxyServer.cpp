/*
 * ProxyServer.cpp
 *
 *  Created on: 2014-3-20
 *      Author: Administrator
 */

#include "ProxyServer.h"
#include "gamesvr.h"

ProxyServer::ProxyServer() :
		m_gameSvr(NULL) {
}

ProxyServer::~ProxyServer() {
}

void ProxyServer::setGameSvr(GameSvr* gameSvr) {
	m_gameSvr = gameSvr;
}

bool ProxyServer::connect(const char* url, int port) {
	m_socket.CreateSocket(AF_INET, SOCK_STREAM, 0, 0);
	if (!m_socket.Connect(url, port)) {
		std::cerr << "*connect proxy server failed! url:" << url << ", port:"
				<< port << std::endl;
		return false;
	}

	m_socket.SetNonBlocking();
	m_socket.SetRecvBufferMaxSize(102400);
	m_socket.SetSendBufferMaxSize(102400);

	return true;
}

bool ProxyServer::isLosted(){
	return m_socket.GetHandle() <= 0;
}

bool ProxyServer::sendMsg(const char* msg) {
	if ( isLosted() ) {
		std::cerr << "proxy server socket close" << std::endl;
		return false;
	}

	int msglen = strlen(msg);
	int sendLen = 0;
	while (true) {
#if defined(WIN32)
		int ret = m_socket.Send((char*) (msg + sendLen), (msglen - sendLen));
#else
		int ret = m_socket.Write((const char*) (msg + sendLen), (msglen - sendLen));
#endif // WIN32
		if (ret < 0) {
			if (errno == EAGAIN || errno == EWOULDBLOCK) {
				tq_sleep(1);
				continue;
			}
			std::cerr << "proxy server send errno:" << errno << std::endl;
			m_socket.Close();
			return false;
		}

		sendLen += ret;
		if (sendLen == msglen) {
			break;
		}

		tq_sleep(1);
	}
	return true;
}

bool ProxyServer::handlePkg() {
	if ( isLosted() ) {
		//std::cerr << "proxy server socket close" << std::endl;
		return false;
	}

	char buf[1024 + 1] = { 0 };
	int recvLen = m_socket.Recv(buf, sizeof(buf) - 1, 0);
	if (recvLen < 0) {
		std::cout << "errno:" << socketerrno << std::endl;
		std::cerr << "proxy server socket recv failed!" << std::endl;
		m_socket.Close();
		return false;
	}

	if (recvLen == 0) {
		return true;
	}

	char* cur = buf;
	char* next = NULL;
	while (true) {
		next = strstr(cur, "#");
		if (next == NULL) {
			if (!combinePkg(cur, strlen(cur)))
				return false;
			break;
		}

		prt_int pkgLen = (prt_int) (next - cur);
		if (!combinePkg(cur, (int) pkgLen))
			return false;

		char* pkg = m_combineBuf.GetBuf();
		m_gameSvr->SendProxyCmd(pkg);
		m_combineBuf.Clear();

		cur = next + 1; // skip #
	}
	return true;
}

bool ProxyServer::combinePkg(char* buf, int len) {
	if (m_combineBuf.CopyMem(buf, len) == NULL) {
		m_socket.Close();
		std::cerr << "proxy server recv pkg too long!" << std::endl;
		return false;
	}
	return true;
}

