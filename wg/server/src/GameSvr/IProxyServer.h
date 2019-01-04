/*
 * IProxyServer.h
 *
 *  Created on: 2014-3-20
 *      Author: Administrator
 */

#ifndef IPROXYSERVER_H_
#define IPROXYSERVER_H_
#include <commhead.h>

//tolua_begin
class IProxyServer {
public:
	virtual bool connect(const char* url, int port) = 0;
	virtual bool isLosted() = 0;
	virtual bool sendMsg(const char* msg) = 0;
	//tolua_end
	virtual ~IProxyServer() {};
	//tolua_begin
};
//tolua_end

#endif /* IPROXYSERVER_H_ */
