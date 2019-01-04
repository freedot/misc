/*
 * IpHelper.h
 *
 *  Created on: 2013-3-2
 *      Author: Administrator
 */

#ifndef IPHELPER_H_
#define IPHELPER_H_
#include <commhead.h>

namespace Net {

const int MAX_URL = 1024;

enum EProtocol {
	EP_NONE, EP_UDP, EP_TCP,
};

class IpHelper {
public:
	/** get protocol type from url(tcp://www.xxx.com:port) or ip(tcp://x.x.x.x:port) string */
	static uint32 GetPTypeFromUrl(const char* urlAndPort);

	/** get ip from url(tcp://www.xxx.com:port) or ip(tcp://x.x.x.x:port) string */
	static uint32 GetIpFromUrl(const char* urlAndPort);

	/** get port from url(tcp://www.xxx.com:port) or ip(tcp://x.x.x.x:port) string */
	static ushort GetPortFromUrl(const char* urlAndPort);

	/** Convert the url(www.xxx.com) or ip(x.x.x.x) to ip long */
	static uint32 ConvertUrlOrIpToLong(const char* urlOrIp);

private:
	static std::string GetIpStringFromUrl(const char* urlAndPort);
};

} /* namespace Net */
#endif /* IPHELPER_H_ */
