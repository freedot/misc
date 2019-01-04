/*
 * ProxyServer.h
 *
 *  Created on: 2014-3-20
 *      Author: Administrator
 */

#ifndef PROXYSERVER_H_
#define PROXYSERVER_H_
#include "IProxyServer.h"
#include "IGameSys.h"
#include <Socket.h>

class CombineBuf {
public:
	void Clear() {
		m_pos = 0;
	}

	const char* CopyMem(const char* src, int copylen) {
		if ((m_pos + copylen + 1) >= (int)sizeof(m_buf)) {
			return NULL;
		}

		memcpy(m_buf + m_pos, src, copylen);
		m_pos += copylen;
		m_buf[m_pos] = '\0';
		src += copylen;
		return src;
	}

	char* GetBuf() {
		return m_buf;
	}

	CombineBuf() :
			m_pos(0) {
	}

private:
	char m_buf[102400];
	int m_pos;
};

class GameSvr;
class ProxyServer: public IProxyServer {
public:
	bool connect(const char* url, int port);
	bool isLosted();
	bool sendMsg(const char* msg);

public:
	void setGameSvr(GameSvr* gameSvr);
	bool handlePkg();

public:
	ProxyServer();
	virtual ~ProxyServer();

private:
	bool combinePkg(char* buf, int len);

private:
	GameSvr* m_gameSvr;
	Net::Socket m_socket;
	CombineBuf m_combineBuf;
};

#endif /* PROXYSERVER_H_ */
